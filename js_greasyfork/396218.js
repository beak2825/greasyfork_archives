// ==UserScript==
// @name         VRC YA DAUN
// @namespace    https://vk.com/shelley666
// @version      3000
// @description  VRChat Little Enhancer
// @author       Shelley666&D1n++
// @include      /.*?:\/\/.*?vrchat.*?\..*?(home|launch|api).*?/
// @include      /.*?:\/\/.*?vrchat.*?\..*?(friendlist|favoritelist).*?/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @resource     JqueryUIcss    https://code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css
// @resource     private_image  https://assets.vrchat.com/www/images/default_private_image.png
// @resource     JumpICON       https://image.flaticon.com/icons/svg/1215/1215194.svg
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/locale/zh-tw.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.4.0/chroma.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pushy/1.3.0/js/pushy.min.js
// @icon        https://cdn.discordapp.com/attachments/278138644588396545/675825166034403368/unknown_11.png
// @run-at       document-start
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/396218/VRC%20YA%20DAUN.user.js
// @updateURL https://update.greasyfork.org/scripts/396218/VRC%20YA%20DAUN.meta.js
// ==/UserScript==
// https://cdnjs.com/libraries/jqueryui
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @resource     JqueryUIcss    https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/trontastic/theme.min.css

// https://remotestoragejs.readthedocs.io/en/latest/getting-started/initialize-and-configure.html

// Chroma.js
// https://github.com/gka/chroma.js/
// https://gka.github.io/chroma.js/#chroma-blend

// moment https://momentjs.com/
// https://cdnjs.com/libraries/moment.js/

// https://github.com/js-cookie/js-cookie
// https://developer.mozilla.org/zh-TW/docs/Web/API/Window.onpopstate
// https://www.oxxostudio.tw/articles/201706/javascript-promise-settimeout.html

//alert(unescape("%u541B%u306E%u540D%u524D%u306F"));

//<span aria-hidden="true" class="fa fa-cog fa-2x fa-spin"></span>

var url = window.location.href;

var WorldTemp   = {};
var UserTemp    = {};
//var StatusColor = {  "join me":"#00008b", "active":"#53377a", "busy":"#f400a1" };
var StatusColor = {  "join me":"#00008b", "active":"#53377a", "busy":"#f400a1" };
var TrustedData = {//"admin_official_thumbnail" : ["#FFFFFF" , "Admin Thumbnailr" ] by Shelley666&D1n++ (Ex sosi)
                     "admin_moderator"      : ["#8B0000" , "Admin"       ]  // by Shelley666&D1n++ (Ex sosi)
                    ,"system_troll"         : ["#808080" , "Troll"       ]  // by Shelley666&D1n++ (Ex sosi)
                    ,"system_probable_troll": ["#808080" , "Troll??"     ]  // by Shelley666&D1n++ (Ex sosi)
                    ,"system_trust_legend"  : ["#ccff00"  , "Veteran"     ]
                    ,"system_trust_veteran" : ["#710abe" , "Trusted User"]
                    ,"system_trust_trusted" : ["#d53e07" , "Known User"  ]
                    ,"system_trust_known"   : ["#009900" , "User"        ]
                    ,"system_trust_intermediate" : ["#000080" , "Intermediate" ] //New User+ (New User > User) by Shelley666&D1n++ (Ex sosi)
                    ,"system_trust_basic"   : ["#00008b" , "New User"    ]
                    ,"system_legend"        : ["#b32851" , "Legend"      ]};// by Shelley666&D1n++ (Ex sosi)
var RoomType    = {  "private"              : ["Private" , "#1fd1ed"]
                    ,"~hidden"              : ["F+", "#8143E6"]
                    ,"~fO"             : ["FO" , "#FF7B42"]
                    ,"~canRequestInvite"    : ["Inv+" , "#2BCF5C"]
                    ,"~private"             : ["Inv"  , "#1778FF"]
                    ,"~pub"                 : ["Pub"  , "magenta" ] };
//                    ,"~null"                : ["Public"  , "magenta" ] };
var WorldType   = {  "pub"               : ["check"      , "magenta"]
                    ,"hid"               : ["exclamation", "#ff4d4d"   ]
                    ,"private"              : ["exclamation", "lightpink" ] };
var modType     = {  mute       : { re:"unmute"     , text: "Mute"          }
                    ,unmute     : { re:"mute"       , text: "UnMute"        }
                    ,hideAvatar : { re:"showAvatar" , text: "HideAvatar"    }
                    ,showAvatar : { re:"hideAvatar" , text: "ShowAvatar"    }
                    ,block      : { re:"unmute"     , text: "Block"         }
                    ,unblock    : { re:"block"      , text: "Unblock"       } };


let JqueryUIcss = `<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css" type="text/css">`;

// 延長Cookie登入狀態
function CookieExtend(){ //return;
    if(window.location.href.match("\/login")) return;

    var auth    = Cookies.get('auth');
    var apiKey  = Cookies.get('apiKey');
    if(auth)      Cookies.set('auth'  , auth  , { expires: 7 });
    if(apiKey)    Cookies.set('apiKey', apiKey, { expires: 7 });
}

MainStart();
function MainStart(){
    InsertCustomCSS();
    $(document).ready(JumpMainDomainCheck);

    if(url.match("\/launch\?")){
        if(url.match(regexUnityID("wld",url) + ":") || url.match(regexUnityID("wrld",url) + ":")){
            var url2 = url .replace(regexUnityID("wld" ,url) + ":",regexUnityID("wld" ,url) + "&instanceId=");
                url2 = url2.replace(regexUnityID("wrld",url) + ":",regexUnityID("wrld",url) + "&instanceId=");
            window.location.href = url2;
            return;
        }
        //$(document).ready(function(){ setTimeout(LaunchPage,1000 * 1); });
    }
    if(url.match("\/home.?"))           HomePage();
    if(url.match("\/friendlist.?"))     FriendList();
    if(url.match("\/favoritelist.?"))   GetFavOfWorlds();
}

function JumpMainDomainCheck(){
    if(document.location.host == "www.vrchat.net" || document.location.host == "vrchat.net") return;

    // https://www.w3schools.com/cssref/tryit.asp?filename=trycss_cursor
    $("body").append(""
    + "<div class='noselect' style='display:inline-block;position:fixed;left:10px;bottom:5px;z-index:500;cursor:alias;'>"
        + '<img id="JumpMainDomain" width="17" title="Jump to www.vrchat.net" src="' + GetTMRes("JumpICON","data:image/svg+xml;") + '" />'
    + "</div>")

    $("#JumpMainDomain").click(function(){
        document.location.host = "www.vrchat.net";
    })
}

var LastHomePage = document.location.pathname;
function HomePage(){
    $.get( "/api/1/auth/user").done(function( json ){ //console.error(json);
        json = JSON.parse(json);
        if(json["id"]) GM_setValue("ScriptUserData",json);
    })

    /*
    if(url.match("\/home\/launch\?")){
        window.location.href = url.replace("\/home\/launch\?","\/launch\?");
        return;
    }
    */

    setTimeout (CookieExtend,1000 *  5);
    setInterval(CookieExtend,1000 * 15);
    window.onbeforeunload = function(e) { CookieExtend(); };

    // https://stackoverflow.com/a/30680994
    $("head").append("<style>::-webkit-scrollbar {width: 0px;  /* remove scrollbar space */background: transparent;  /* optional: just make scrollbar invisible */}</style>");

    // https://stackoverflow.com/a/12471484
    //$("head").append("<style>img.steam {position: relative;margin: auto;top: 0;left: 0;right: 0;bottom: 0;}</style>");
    //$("head").append("<style>img.steam {align:middle;}</style>");
    //$("head").append("<style>.verticalcenter {display: table-cell;height: auto;vertical-align: middle;}</style>");

    setInterval(function(){
        HomePageFunc();

        RunOnce("img.img-thumbnail.rounded-circle.float-left.home-avatar:eq(0)"
                                                        ,"UserBaseData"         ,UserBaseData)
        RunOnce("div.home-content div.center-block.text-center > h2:contains('Hello there,'):eq(0)"
                                                        ,"MainHome"             ,MainHome)
        RunOnce("h3.subheader:contains('steam_'):eq(0)" ,"SteamIDLinkToPage"    ,SteamIDLinkToPage);
        RunOnce("div.animated.fadeIn.card > h3.card-header:contains('Password')"
                                                        ,"SetPublicAvatar"      ,SetPublicAvatar);
        RunOnce("div.card.card-body.bg-primary:hidden"  ,"UserStatus"           ,UserStatus);
        RunOnce("img.profile-thumbnail.img-rounded"     ,"ExpandWorldThumbnail" ,ExpandWorldThumbnail);
        RunOnce("button#login-form-submit"              ,"LoginGoBack"          ,LoginGoBack);
        RunOnce("div.home-content > div.row:eq(0)"      ,"WorldsWithFriends"    ,WorldsWithFriends);
        RunOnce("div.home-content div.col-md-12 small:contains('— by')"
                                                        ,"WorldToVRCList"       ,WorldToVRCList);
        RunOnce("div.home-content div.col-md-4 div.btn-group:contains('Launch')"
                                                        ,"WorldPageFav"         ,WorldPageFav)
        RunOnce("div.friend-group:eq(0)"                ,"HideOnline"           ,function(element){
            $(element).find("h4:contains('Online'):eq(0)").hide();
        })
        RunOnce("div.flex-shrink-1:eq(0) a.launch-btn:eq(0)"  ,"LaunchOptions"  ,LaunchPage);

        if(document.location.pathname != LastHomePage){
            if( document.location.pathname.match(/(\/login|\/register|\/password)/) ){
                //console.error(document.location.pathname);
            }
            else LastHomePage = document.location.pathname;
        }
    },1000 * 0.7);
}

function MainHome(){
    $("div.home-content > div")
    .append(`
    <h3>Function Page</h3>
    <button type="button" class="btn btn-primary" id="Lone_WWF_main_Launch">Worlds With Friends</button>
    <button type="button" class="btn btn-primary" id="">
        <a target="_blank" style="color:black;" href="/friendlist">Friend List</a>
    </button>
    <button type="button" class="btn btn-primary" id="">
        <a target="_blank" style="color:black;" href="/favoritelist">Favorite World List</a>
    </button>
    `)
    .append(`
    <div class="row">
        <div class="col-12">
            <h3>Blocked/Muted/Hided&Showed Avatar by <font color="yellow">someone</font>.<div id="Lone_BlockLoad_Data_Count" style="display:inline;"></div></h3>
            <div class="row">
                <div class="col-md-4">
                    <button type="button" class="btn btn-primary" id="Lone_BlockLoad">Who against you</button>
                    <div id="Lone_BlockLoad_Data"  style="display:-webkit-inline-box;font-family:Segoe UI;"></div>
                    <div id="Lone_BlockLoad_Data2" style="display:-webkit-inline-box;font-family:Segoe UI;"></div>
                </div>
            </div>
        </div>
    </div>`)
    .append(`
    <div class="row">
        <div class="col-12">
            <h3>Block/mute/hide&showAvatar someone by <font color="yellow">you</font>.<div id="Lone_BlockLoad_DataYou_Count" style="display:inline;"></div></h3>
            <div class="row">
                <div class="col-md-4">
                    <button type="button" class="btn btn-primary" id="Lone_BlockLoadYou">Load your moderation</button>
                    <div id="Lone_BlockLoad_DataYou"  style="display:-webkit-inline-box;font-family:Segoe UI;"></div>
                    <div id="Lone_BlockLoad_DataYou2" style="display:-webkit-inline-box;font-family:Segoe UI;"></div>
                </div>
            </div>
        </div>
    </div>`);

    $("#Lone_WWF_main_Launch").click(function(){
        $("div.home-content:eq(0) > div:eq(0)").html(`<div class="row WorldsWithFriends"><div class="col-12"></div></div>`);
        WorldsWithFriends();
        $("#WorldsWithFriends").click();
    })

    $("#Lone_BlockLoad").click(function(){
        $("#Lone_BlockLoad").prop('disabled', true);
        $("#Lone_BlockLoad_Data , #Lone_BlockLoad_Data2").html("");

        $.get( "/api/1/auth/user/playermoderated").done(function( json ){ //console.error(json);
            GM_setValue("playermoderated",json || []);
            $("#Lone_BlockLoad_Data_Count").html("(" + json.length + ")");
            var block = "", blockCount = 0;
            var mute  = "", muteCount  = 0;
            var hide  = "", hideCount  = 0;
            var show  = "", showCount  = 0;
            $("#Lone_BlockLoad").prop('disabled', false);
            $(json).each(function(index, value){ //console.error( index + ": " + value );
                GM_setValue(value.sourceUserId + "_pastName",value.sourceDisplayName);
                value.created = moment(value.created).format("YYYY-MM-DD[T]HH:mm");
                if(value.type == "block"){ //console.error("block: " + value.sourceDisplayName);
                    blockCount = blockCount + 1;
                    block   = block
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:black;' href='/home/user/" + value.sourceUserId + "'>"
                        + value.sourceDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "mute"){ //console.error("mute: " + value.sourceDisplayName);
                    muteCount = muteCount + 1;
                    mute   = mute
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#99003d;' href='/home/user/" + value.sourceUserId + "'>"
                        + value.sourceDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "hideAvatar"){ //console.error("mute: " + value.sourceDisplayName);
                    hideCount = hideCount + 1;
                    hide   = hide
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#99003d;' href='/home/user/" + value.sourceUserId + "'>"
                        + value.sourceDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "showAvatar"){ //console.error("mute: " + value.sourceDisplayName);
                    showCount = showCount + 1;
                    show   = show
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#6b7886;' href='/home/user/" + value.sourceUserId + "'>"
                        + value.sourceDisplayName + "</a>" + "<br>";
                }
            })
            $("#Lone_BlockLoad_Data").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'Block you:  ' + blockCount + '<br>'
                +  block
                + '</b></div>');

            $("#Lone_BlockLoad_Data").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'Mute you:  ' + muteCount + '<br>'
                +  mute
                + '</b></div>');

            $("#Lone_BlockLoad_Data2").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'Hide your Avatar:  ' + hideCount + '<br>'
                +  hide
                + '</b></div>');

            $("#Lone_BlockLoad_Data2").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'Show your Avatar:  ' + showCount + '<br>'
                +  show
                + '</b></div>');

        }).fail(function( xhr, status, error ) { console.error(error);
            $("#Lone_BlockLoad_Data").html("fetch error");
            $("#Lone_BlockLoad").prop('disabled', false);
        });
    })

    $("#Lone_BlockLoadYou").click(function(){
        $("#Lone_BlockLoadYou").prop('disabled', true);
        $("#Lone_BlockLoad_DataYou , #Lone_BlockLoad_DataYou2").html("");

        $.get( "/api/1/auth/user/playermoderations").done(function( json ){ //console.error(json);
            GM_setValue("playermoderations",json || []);
            $("#Lone_BlockLoad_DataYou_Count").html("(" + json.length + ")");
            var block = "", blockCount = 0;
            var mute  = "", muteCount  = 0;
            var hide  = "", hideCount  = 0;
            var show  = "", showCount  = 0;
            $("#Lone_BlockLoadYou").prop('disabled', false);
            $(json).each(function(index, value){ //console.error( index + ": " + value );
                GM_setValue(value.targetUserId + "_pastName",value.targetDisplayName);
                value.created = moment(value.created).format("YYYY-MM-DD[T]HH:mm");
                if(value.type == "block"){ //console.error("block: " + value.sourceDisplayName);
                    blockCount = blockCount + 1;
                    block   = block
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:black;' href='/home/user/" + value.targetUserId + "'>"
                        + value.targetDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "mute"){ //console.error("mute: " + value.sourceDisplayName);
                    muteCount = muteCount + 1;
                    mute   = mute
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#99003d;' href='/home/user/" + value.targetUserId + "'>"
                        + value.targetDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "hideAvatar"){ //console.error("mute: " + value.sourceDisplayName);
                    hideCount = hideCount + 1;
                    hide   = hide
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#99003d;' href='/home/user/" + value.targetUserId + "'>"
                        + value.targetDisplayName + "</a>" + "<br>";
                }
                else if(value.type == "showAvatar"){ //console.error("mute: " + value.sourceDisplayName);
                    showCount = showCount + 1;
                    show   = show
                        + "<font color='blue'>"   + value.created.split("T")[0] + "</font>&nbsp;"
                        + "<font color='green'>"  + value.created.split("T")[1].split(/:\d+\..+Z/)[0] + "</font>&nbsp;"
                        + "<a target='_blank' style='color:#6b7886;' href='/home/user/" + value.targetUserId + "'>"
                        + value.targetDisplayName + "</a>" + "<br>";
                }
            })
            $("#Lone_BlockLoad_DataYou").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'You block:  ' + blockCount + '<br>'
                +  block
                + '</b></div>');

            $("#Lone_BlockLoad_DataYou").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'You mute:  ' + muteCount + '<br>'
                +  mute
                + '</b></div>');

            $("#Lone_BlockLoad_DataYou2").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'You hideAvatar:  ' + hideCount + '<br>'
                +  hide
                + '</b></div>');

            $("#Lone_BlockLoad_DataYou2").append('<br>'
                + '<div class="card card-body bg-primary lone_ignore"><b>'
                + 'You ShowAvatar:  ' + showCount + '<br>'
                +  show
                + '</b></div>');
        }).fail(function( xhr, status, error ) { console.error(error);
            $("#Lone_BlockLoad_DataYou").html("fetch error");
            $("#Lone_BlockLoadYou").prop('disabled', false);
        });
    })

    // ===========================================================================
    // CREDIT
    let TM_JumpICON = GetTMRes("JumpICON","data:image/svg+xml;");
    $("div.home-content > div")
    .append(`
    <br>
    <div class="row">
        <div class="col-12">
            <h3><h3 style="float:right;"><font color="yellow">Credit</font></h3></h3>
            <div class="row">
                <div class="col-md-4"><img width="20" src="${TM_JumpICON}" /> Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </div>
        </div>
    </div>
    `)
}

function WorldPageFav(element){
    var world_id = regexUnityID("(wrld|wld)",window.location.href);
    if(!world_id) return;

    $("head").append(`<style>
    .Lone_WorldPageFav .btn-secondary {
        display: none;
    }
    </style>`);

    $(element).prepend(`
    <div role="group" class="w-100 btn-group-lg btn-group-vertical Lone_WorldPageFav"><br>
        <button type="button" class="btn btn-primary" id="WorldPageFav">Favorite this World？</button>
        <button type="button" dType="worlds0" class="btn btn-secondary">Worlds1</button>
        <button type="button" dType="worlds2" class="btn btn-secondary">Worlds2</button>
        <button type="button" dType="worlds3" class="btn btn-secondary">Worlds3</button>
        <button type="button" dType="worlds4" class="btn btn-secondary">Worlds4</button>
        <br>
    </div>
    `);

    $("#WorldPageFav").click(function(){ $(".Lone_WorldPageFav .btn-secondary").slideToggle("fast"); });

    $(".Lone_WorldPageFav .btn-secondary").click(async function(){
        $(".Lone_WorldPageFav .btn-secondary").prop('disabled', true);
        let [data, err] = await getAPI("favorites",{
             method: 'POST'
            ,headers: { 'content-type': 'application/json' }
            ,body: JSON.stringify({ type: "world", favoriteId: world_id, tags:$(this).attr("dType") })
        });
        $(".Lone_WorldPageFav .btn-secondary").prop('disabled', false);
        if(data)        alert("Favorited!");
        else if(err)    alert( (await err.json()).error.message || "Error!");
    });
}

function UserBaseData(element){
    var userID      = regexUnityID("usr" ,$(element).parent().attr("href"));
    var displayName = $(element).parent().parent().find("p.display-name").html();

    if(userID && displayName){
        GM_setValue("cur_userID"        ,userID)
        GM_setValue("cur_displayName"   ,displayName)
    }

    let ScriptUserData = GM_getValue("ScriptUserData",{ "friends": [] });
    let FriendsLength  = ScriptUserData["friends"].length;
    $(element).parent().parent().find("p.display-name:eq(0)").append(`
        <br><a style="float:right">Friends (${FriendsLength})</a>
    `)
}

function WorldToVRCList(element){
    // "— by "
    $(element).contents().filter(function(){ return this.nodeType === 3; }).eq(0).remove();
    var world_id    = regexUnityID("(wrld|wld)",window.location.href);
    var world_name  = $("small.WorldToVRCList:eq(0)").parent().find("a:eq(0)").html();
    var user_name   = $("small.WorldToVRCList:eq(0) a[href*='usr_']").html();
    //$(element).parents("div.col-md-12:eq(0)").find("")
    var template_VRCWorldList = `
        <a target="_blank" href="%world-by-id%">—</a>&nbsp;
        <a target="_blank" href="%world-by-author%">by&nbsp;`

    $("small.WorldToVRCList:eq(0)").prepend(LoadFormatText(template_VRCWorldList,{
         "%world-by-id%" : encodeURI(
            "https://www.google.com/search?q=site:www.vrcw.net \"" + world_id + "\" | " +
            "\"" + world_name + "\"")
        ,"%world-by-author%" : encodeURI("http://www.vrcw.net/search?utf8=%E2%9C%93&keyword=" + user_name)
    }).out)
}

function WorldsWithFriends(){
    $("div.home-content div.col-12:eq(0)")
    .prepend(`
        <div>
            <h3><a id='WorldsWithFriends' href='#' style='color:#67d781;'>Worlds with Friends</a></h3>
        </div>
    `);

    $("#WorldsWithFriends").click(function(){
        let col12 = $(this).parents("div.col-12:eq(0)").html(`
            <br>Fetching Data....
            <br>Request Times : (&nbsp;<a id="FetchTimes">0</a>&nbsp;)
            <br>Request Length: (&nbsp;<a id="FetchLength"></a>&nbsp;)
        `);

        let GFM_Online = $.extend(true, {}, GetFriendsMulti);
        GFM_Online.firstRun(async function(status, obj) {
            let json = obj.userArray || [];
            if(status == "keepGoing"){
                $("#FetchTimes" ).html(`${parseInt($("#FetchTimes").html()) + 1}`);
                $("#FetchLength").html(json.length);
                return;
            }
            await sleep(50);

            var WorldsJson = {};
            for (var i = 0; i < json.length; i++) { //console.error(json[i])
                var location = /(wrld|wld)_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\d+/gmi.exec(json[i].location);
                    location = location ?  location[0] : json[i].location;
                json[i]   .locationBase =  location;
                WorldsJson[location]    =  WorldsJson[location] ||    {"counter"  : 0};
                WorldsJson[location]["counter"] = WorldsJson[location]["counter"] + 1;
                WorldsJson[location]["room"]    = json[i].location;
                WorldsJson[location]["created"] = regexUnityID("usr",json[i].location) || "NoOwner";

                // 玩家暫存資料
                UserTemp[json[i].id] = json[i];
                GM_setValue(json[i].id,json[i])
            }
            WorldsJson = sortObject(WorldsJson);
            var privateData = WorldsJson["private"];
            delete            WorldsJson["private"];
            delete            WorldsJson["offline"];
                              WorldsJson["private"] = privateData || { "counter":0 };

            //RoomsType["publlic"]

            /*
            for (var i = 0; i < json.length; i++) { //console.error(json[i])
                WorldsJson[regexUnityID("wrld",json[i].location)
                         ||regexUnityID("wld" ,json[i].location)
                         ||                    json[i].location] = 1;
            }
            */
            Append({ "json":json, "WorldsJson":WorldsJson });
            //console.error(WorldsJson);
            //console.error(UserTemp);
            LogInfo("Loaded:World(" + Object.keys(WorldsJson).length + "), Online(" + json.length + ")");
        });
    });
    //<span aria-hidden="true" class="fa fa-crosshairs fa-1x">
    // ▼▲▽△
    var template_top = `
        <h3 id='Lone_WWF_top_desc'>
            Total Online: <font style='color:yellow;'>%online-count%</font>
                          /
                          <font style='color:yellow;'>%online-percent%%</font>
            (Private: <font style='color:#1fd1ed;'>%private-count%</font>
                      /
                      <font style='color:#1fd1ed;'>%private-percent%</font>)
            (Rooms: <font style='color:#67d781;'>%rooms-count%</font> <-
                    <font style='color:yellow;' id="rooms-public">?</font>
                    /
                    <font style='color:#FF7B42;' id="rooms-fonly">?</font>
                    /
                    <font style='color:#8143E6;' id="rooms-fplus">?</font>)
                    <!-- https://pjchender.blogspot.com/2017/12/5-fontawesome-5.html -->
                    <div class="fa-1x" style="display:inline;">
                        &nbsp;
                        <i class="fas fa-sync" id="Lone_WWF_refresh"></i>
                    </div>
        </h3>`
    var template_world = `
        <!--
        <div class="row %private-type%" style="border-left:%world-color% 5px outset;border-right:%world-color% 5px outset;">
        -->
        <div class="row %private-type%">
            <div class="col-12 template_world">
                <h3><a class="Lone_wrld" wrld_id="%world-id%" style="color:white;" target="%world-window%" href="%world-page%">%world-name%</a>
                    <a class="btn btn-primary float-right Lone_World_locationJoin" style="width:80px;font-family:Segoe UI;padding:.2rem .75rem;background:%room-color% linear-gradient(180deg, %room-color%, %room-color%) repeat-x;border-color:%room-color%" href="%locationJoin%">%room-type%</a>

                    <font class="float-right Lone_world_tags" style="color:white;">▼</font>

                    <a class="btn btn-primary float-right pointer Lone_world_room_people"
                       room="%room-location%"
                       world="%world-ido%"
                       href="javascript:void();"
                       style="min-width:70px;padding:.2rem .75rem;background:#67d781 linear-gradient(180deg, #67d781, #67d781) repeat-x;border-color:#67d781;color:blue;">%world-room%</a>

                    <a class="float-right" style="color:white;" target="_blank" href="%world-launch-link%">◄</a>

                    <span class="badge badge-secondary float-right" style="display:none;text-transform:capitalize;padding:.14em .4em;">
                        <span aria-hidden="true" class="fa"></span>&nbsp;
                    </span>

                    <a class="float-right Lone_wrld_author_link_vrclist" style="color:white;"  target="_blank">&nbsp;►</a>
                    <a class="float-right Lone_wrld_author_link" style="color:LightCoral;font-size:22px;" target="_blank"></a>
                </h3>
                <h3 style="float:right;z-index:5;border-bottom:unset;">
                    <!--<a style="vertical-align:top;font-size:15px;">Room Created by-->
                    <a class="Lone_room_createdBy" CreatedBy="%CreatedBy%">Room Created by
                        <a class="btn btn-primary pointer Lone_room_createdBy_btn" CreatedBy="%CreatedBy%" target="_blank">
                            <span class="fa fa-database"></span>
                        </a>
                    </a>
                    <a class="Lone_room_people_counter %private-room-counter%">%room-counter%</a>
                    <img class="Lone_wrld_img %blur%" src="%default_private_image%" /><br>
                    %privateRoomMEME%
                </h3>
                <div class="col-md-4" id="%world-ido%" style="%background-color%;position:unset;"></div>
            </div>
        </div>`
    var template_user   = `
    <div class="row text-left friend-row" user_id="%user_id%">
      <!--<a class="col-12">-->
        <img class="img-thumbnail rounded float-left friend-img Lone_world_friend" src="%img-thumbnail%" title="%display-title%" style="width:160px;height:120px;border-right-width:6px;border-right-color:%trust-color%;border-left:%world-color% 6px outset;">
        <div class="friend-caption text-success">
          <ul><li><a target="_blank" href="%user_page%">
                  <font color="%StatusColor%"><b>%display-name%</b></font></a></li>
              <li>%status-des%<font style="opacity:0.0;">-</font></li>
              <!--
              <li><font style="display:%rank-hide%;color:white !important;">Appearing as <font style="color:#67d781;">User</font> Rank</font></li>
              -->
          </ul>
        </div>
      <!--</a>-->
    </div>`
    function Append(jsons){
        var ScriptUserData = GM_getValue("ScriptUserData",{ "friends": [] });
        //console.error(ScriptUserData);
        var json        = jsons["json"]
        var WorldsJson  = jsons["WorldsJson"]
        var col12 = $("div.home-content div.row div.col-12:eq(0)").html("" +
            LoadFormatText(template_top,{
                // "%online-count%"   : json.length + (json.length >= FriendsLimit ? "<a style='color:#90ee90;'>↑</a>":"")
                 "%online-count%"   : json.length
                ,"%online-percent%" : Math.round(json.length / ScriptUserData["friends"].length * 100)
                ,"%private-count%"  : WorldsJson["private"]["counter"] || 0
                ,"%rooms-count%"    : Object.keys(WorldsJson).length - 1
                ,"%private-percent%": Math.round((WorldsJson["private"]["counter"] || 0) / json.length * 100) + "%"
            }).out)

        $("#Lone_WWF_refresh").click(function(){
            $("div.home-content div.col-12:eq(0)").html("");
            WorldsWithFriends();
            $("#WorldsWithFriends").click();
        })

        $.each(WorldsJson, function(key, value) {
            $(col12).append('' +
                LoadFormatText(template_world,{
                   //"%world-color%"    : ColorChroma(key)
                     "%private-type%"   : value.room == "private" ? "Lone_private_room" : ""
                    ,"%blur%"           : value.room == "private" ? "" : "blur"
                    ,"%world-id%"       : key.split(":")[0] || key
                    ,"%world-ido%"      : key
                    ,"%world-name%"     : value.room == "private" ? key : "🚧Under Construction🚧" /* key.split(":")[0] || key */
                    ,"%world-room%"     : key.split(":")[1] || "-"
                    ,"%world-page%"     : key.match("private") ? "#" : "/home/world/" + key.split(":")[0] || key
                    ,"%room-type%"      : GetRoomType(value.room)[0]
                    ,"%room-counter%"   : value.counter > 1 ? value.counter : ""
                    ,"%locationJoin%"   : value.room == "private" ? "#" : "vrchat://launch?ref=" + document.location.host + "&id=" + value.room
                    ,"%world-window%"   : value.room == "private" ? ""  : "_blank"
                    ,"%room-color%"     : GetRoomType(value.room)[1]
                    ,"%background-color%": value.room == "private" ? "background-color:#313131;" : ""
                    //,"%world-launch-link%": value.room == "private" ? "" : "https://www.vrchat.net/launch?worldId=" + key.split(":")[0]
                    ,"%world-launch-link%": value.room == "private" ? "" : "https://www.vrchat.net/home/launch?worldId=" + key.split(":")[0]
                    ,"%private-room-counter%": value.room == "private" ? "Lone_room_private_counter" : ""
                    ,"%CreatedBy%"      : value.created || "NoOwner"
                    ,"%default_private_image%": GM_getResourceURL("private_image")
                    ,"%privateRoomMEME%": value.room == "private" ? `<div id="privateIMG" style="display:inline;"></div>` : ""
                    ,"%room-location%"  : value.room
                }).out
            )

            setTimeout(function(){
                $("a.Lone_room_createdBy_btn[CreatedBy*='usr_']").each(function(){
                    var usr_id      = $(this).attr("CreatedBy");
                    //console.error([usr_id, UserTemp[usr_id]]);
                    if(UserTemp[usr_id]){
                        CreatedByAuto(this, UserTemp[usr_id]["displayName"]);
                    }
                    else {
                        var UserSaved   = GM_getValue(usr_id, null);
                        if(UserSaved){
                            CreatedByAuto(this, UserSaved["displayName"]);
                        }
                    }
                })
            },1)
        });

        $("#rooms-public").html( $(".Lone_World_locationJoin:contains('Public')"    ).length || 0);
        $("#rooms-fplus") .html( $(".Lone_World_locationJoin:contains('Friends+')"  ).length || 0);
        $("#rooms-fonly") .html(($(".Lone_World_locationJoin:contains('Friends')"   ).length || 0)-
                                 $(".Lone_World_locationJoin:contains('Friends+')"  ).length || 0);

        $("#privateIMG").html(`
        <a target="_blank" href="https://www.reddit.com/r/VRchat/comments/avtboy/meme_when_all_of_your_friends_are_in_private/">
            <img width="250px" height="140px" src="https://media1.tenor.com/images/a7e004f24af8ca4289fe65803a6580ba/tenor.gif" />
        </a>
        <br>
        <img width="250px" height="296px" src="https://i.imgur.com/YgEXLSq.jpg" id="privateMEME" style="display:none;" />

        `);

        $("#privateIMG").hover(function(){ $("#privateMEME").show(); },function(){ $("#privateMEME").hide() });

        AppendUserList(json);
        function AppendUserList(userJson, locationBase, exclude = {}){
        $.each(userJson, function(index, value) { //console.error(value.location);
            var  pastName = GM_getValue(value.id + "_pastName",null);
            if( !pastName || value.displayName === pastName)
                 pastName = "";
            //else pastName = " ( " + pastName + " ) ";
            else pastName = pastName + "&nbsp;&nbsp;&nbsp;";
            value.location = value.location || locationBase;
            $("div.col-md-4[id='" + ( value.locationBase || locationBase ) + "']").append('' +
                LoadFormatText(template_user,{
                     "%user_id%"        : value.id
                    ,"%display-name%"   : "<font style='color:white;'>"
                        + value.username    +"</font><br>"
                        + "<font style='color:white;'>" + pastName + "</font>"
                        + value.displayName
                    ,"%world-color%"    : ColorChroma(value.location)
                    ,"%img-thumbnail%"  : value.currentAvatarThumbnailImageUrl
                    ,"%user_page%"      : "/home/user/" + value.id
                    ,"%status-des%"     : value.statusDescription || ""
                    ,"%StatusColor%"    : StatusColor[value.status]
                    ,"%trust-color%"    : GetTrusted(value.tags)[0]
                    ,"%rank-hide%"      : value.tags.toString().match("show_social_rank") ? "none" : "unset"

                    ,"%display-title%"  : "<font style='font-size:28px;'>"
                        +   value.displayName
                        + "<br><a style='color:" + StatusColor[value.status] + ";'>"
                        +   value.status
                        + "</a>"
                        + "<br><a style='color:" + GetTrusted(value.tags)[0] + ";'>"
                        +   (GetTrusted(value.tags)[1] || "Visiter")
                        + "</a>"
                        //+ "<br><img src='" + value.currentAvatarImageUrl + "' />"
                        + "<br><img src='" + value.currentAvatarThumbnailImageUrl + "' />"
                        //+ "-"
                + "</font>"}).out
            )
        })
            // https://api.jqueryui.com/tooltip/#option-position
            $(".Lone_world_friend").tooltip({
                position: { at: "right+15 center"}
            });
        }

        $("#private").parent().find("img:eq(0)").css("opacity","1.0")
            .css("width","250px").css("height","187.5px");

        $(col12).append("<h3>-</h3>");

        // ================================================================================================
        //return;
        var worldsREQ = {};
        $.each(WorldsJson, function(key, value) {
            if(key == "private" || worldsREQ[key]) return true; // continue
            worldsREQ[key] = true;

            if(WorldTemp[key.split(":")[0]]){
                WorldDataAppend(WorldTemp[key.split(":")[0]], key);
                //console.error([WorldTemp[key.split(":")[0]], key.split(":")[0]]);
                return true; // continue
            }

            var e_template_world = $("div.col-md-4[id='" + key + "']").parents("div.template_world:eq(0)");
            jQuery.ajax({
                //,async:false // https://stackoverflow.com/a/2592780
                url: "/api/1/worlds/" + key.split(":")[0],
                success: function(json) { //console.error(json);
                    if(!json.id){
                        $(e_template_world).find("a.Lone_wrld").html("Fetch error...");
                        return false;
                    }
                    WorldTemp[json.id] = json;
                    setTimeout(function(){
                        WorldDataAppend(json, key);
                    },1000)
                },error: (function( xhr, status, error ) { console.error([xhr, status, error]);
                    $("div.col-md-4[id='" + key + "']").parents("div.template_world:eq(0)")
                        .find("a.Lone_wrld")
                        .html("Failed? " + xhr.status);
                })
            });
            //return false;
        })
        LogInfo("VRChatLittleONE Worlds Request: " + Object.keys(worldsREQ).length);

        function WorldDataAppend(json, key){
            var e_template_world = $("div.col-md-4[id='" + key + "']").parents("div.template_world:eq(0)");
            //$("div.col-md-4[id='" + key + "']").prepend(json.description);

            $(e_template_world).find("a.Lone_wrld")
                .html(json.name /*+ " by " + json.authorName*/);

            $(e_template_world).find("img.Lone_wrld_img:eq(0)")
                .removeClass("blur")
                .attr("src",json.thumbnailImageUrl)
                .css("opacity","1.0")

            $(e_template_world).find("span.badge:eq(0)").show()
                .append(json.releaseStatus + "&nbsp;V." + json.version)
                .css("color",WorldType[json.releaseStatus][1])
                .attr("title","Occupants: "         + "<font class='Lone_wrld_badge'>" + json.occupants         + "</font>"
                         +"<br>PublicOccupants: "   + "<font class='Lone_wrld_badge'>" + json.publicOccupants   + "</font>"
                         +"<br>PrivateOccupants: "  + "<font class='Lone_wrld_badge'>" + json.privateOccupants  + "</font>"
                         +"<br>Capacity: "          + "<font class='Lone_wrld_badge'>" + json.capacity          + "</font>"
                         +"<br>Author: "            + "<font class='Lone_wrld_badge'>" + json.authorName        + "</font>"
                         +"<br>Description: <br>&nbsp;&nbsp;&nbsp;&nbsp;"
                            + "<font style='color:#1fd1ed;'><b>" + json.description + "</b></font>"
                ).tooltip()
                .find("span.fa:eq(0)")
                .addClass("fa-" + WorldType[json.releaseStatus][0])

            $(e_template_world).find(".Lone_world_tags:eq(0)").tooltip()
                .attr("title","World Tags:" + JSON.stringify(json.tags, null, "<br>").slice(1,-1))

            $(e_template_world).find(".Lone_wrld_author_link:eq(0)")
                .html(json.authorName)
                .attr("href","/home/user/" + json.authorId)

            $(e_template_world).find(".Lone_wrld_author_link_vrclist:eq(0)")
                .attr("href","http://www.vrcworldlist.net/search?utf8=%E2%9C%93&keyword=" + encodeURI(json.authorName))
        }

        $(".Lone_room_createdBy_btn").click(function(){ CreatedByAuto(this); });

        function CreatedByAuto(btn, displayName){ $(btn).unbind("click");
            if(displayName){ StyleLaunch(displayName); return; }

            var CreatedByUrl = "/api/1/users/" + $(btn).attr("CreatedBy");
            $.get( CreatedByUrl ).done(function( json ){ //console.error(json);
                StyleLaunch(json.displayName);
                UserTemp[json.id] = json;
            })

            function StyleLaunch(displayName){
                $(btn)
                    .html("<br>" + displayName)
                    .css("font-size","20px")
                    .removeClass('btn-primary')
                    .attr("href","/home/user/" + $(btn).attr("CreatedBy"))
            }
        }

        $(".Lone_world_room_people").click(function(){
            var roomElement = this;
            var userElement = $(this).parents("div.template_world:eq(0)").find("div.col-md-4:eq(0)");
            var room = $(this).attr("room").replace(":","/");
            if(room == "private") return;

            $(userElement).html("");//.css("background-color","#798897")

            $.get( "/api/1/worlds/" + room ).done(function( json ){ console.error(json);
                AppendUserList(json.users, $(roomElement).attr("world"));

                $(userElement).css("background-color","#1f262e");
                var RoomCounter = $(userElement).find("div.friend-row").length;
                $(roomElement)
                    .parents("div.template_world:eq(0)")
                    .find("a.Lone_room_people_counter:eq(0)")
                    .html(RoomCounter);

                /*
                $(userElement).find("div.friend-row").each(function(){
                    var user_id = $(this).attr("user_id");

                })
                */
            }).fail(function( xhr, status, error ) { console.error(error);

            })
        })
    }
}

function LoginGoBack(element){
    if(document.location.pathname == LastHomePage || LastHomePage == "") return;
    /*
    $(element).clone().appendTo($(element).parent())
        .removeAttr("id").removeAttr("name").removeAttr("value")
        .html("Login & goBack")
    */

    $(element).parent()
        //.append("&nbsp;&nbsp;&nbsp;<a href='#' id='LoginGoBack' class='btn btn-primary LoginGoBack'>Login & GoBack</a>")
        .append("<a href='#' id='LoginGoBack' class='btn btn-primary LoginGoBack'>Login & GoBack</a>")
        .append("<br>" + LastHomePage)

    $("#LoginGoBack").click(function(){
        //console.error(document.location);
        //console.error(LastHomePage);

        // https://wp.me/p7qfLb-6E
        // https://stackoverflow.com/a/11960692
        // https://stackoverflow.com/questions/12840410/how-to-get-a-cookie-from-an-ajax-response
        $.ajax({ //async: false, //data: '{ "comment" }',
            type: "GET",
            url: "/api/1/auth/user?apiKey=JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26",
            dataType: 'json',
            headers: {
                "Authorization": "Basic " + btoa($("#username_email").val() + ":" + $("#password").val())
            },
            success: function (data, textStatus, request){ //console.error(data);
                CookieExtend();
                window.location.href = document.location.origin + LastHomePage;
                //window.location.href = window.location.href;
                //history.go(-2);
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.error(jqXHR);
                console.error(textStatus);
                console.error(errorThrown);
                alert("login Failed");
            }
        });
    });
}

function ExpandWorldThumbnail(element){
    $(element).wrap("<a target='_blank' href='" + $(element).attr("src") + "'></a>");
    Expandhumbnail(element);
}

// https://vrchatapi.github.io/#/UserAPI/GetByID
function UserStatus(element){
    var UserID = regexUnityID("usr",window.location.href);
    if(!UserID) return;

    var Status = `&nbsp;
        <span id="LO_status" aria-hidden="true" class="fa fa-circle"></span>&nbsp;
        <a id="LO_pastName"></a>`
    //var StatusColor = { "join me":"aqua", "active":"lime", "busy":"red" };

    $("div.col-md-12 > h2:eq(0)").append(Status);
    element = $(element).removeAttr("hidden").html("retrieving status data...");

    $.get( "/api/1/users/" + UserID).done(function( json ){ //console.error(json);
        var  pastName = GM_getValue(UserID + "_pastName","");
        if(  json.displayName === pastName || json.username === pastName) pastName = "";
        $("#LO_status").css("color",StatusColor[json.status]);
        $("#LO_pastName").html(pastName);

        $(element).html(json.statusDescription == "" ?
            "<a style='color:blue;'><b>No Description</b></a>" : "<b>" + json.statusDescription + "</b>");

        // https://github.com/VRChatAPI/vrchatapi.github.io/blob/master/UserAPI/Tags.md
        var TagsJson = "<br>" + JSON.stringify(json.tags, null, 2).toString().slice(1,-1);
        var Tags     = LoadFormatText(TagsJson,{ "ignoreSymbol":true
            ,"\",":"<br>"
            ,"\"" :""
            // https://www.vrchat.net/home/user/8JoV9XEdpo
            //,"admin_official_thumbnail" :"<font color='#FFFFFF'>%RepSrc%</font> [thumbnail]"

            ,"admin_moderator"          : "<font color='#8B0000'>%RepSrc%</font> [Admin]"
            ,"system_legend"            : "(7/7) <font color='#FF0000'>%RepSrc%</font> [Legend]"
            ,"system_trust_legend"      : "(6/7) <font color='yellow' >%RepSrc%</font> [Veteran]"
            ,"system_trust_veteran"     : "(5/7) <font color='#8143E6'>%RepSrc%</font> [Trusted User]"
            ,"system_trust_trusted"     : "(4/7) <font color='#FF7B42'>%RepSrc%</font> [Known User]"
            ,"system_trust_known"       : "(3/7) <font color='#2BCF5C'>%RepSrc%</font> [User]"
            ,"system_trust_intermediate": "(1/7) <font color='#000080'>%RepSrc%</font> [Intermediate] New User+" // (New User > User)
            ,"system_trust_basic"       : "(1/7) <font color='#1778FF'>%RepSrc%</font> [New User]"
            ,"system_troll"             : "(0/7) <font color='#808080'>%RepSrc%</font> [Troll]"
            // https://www.vrchat.net/home/user/usr_837524d7-e1a6-4744-afe5-b23ef1fd4103
            ,"system_probable_troll"    : "(0/7) <font color='#808080'>%RepSrc%</font> [Troll??]"

            ,"show_social_rank"         : "%RepSrc% [ShowLevel]"
        }).out;

        $("div.home-content div.col-md-12 > h3.subheader:eq(0)").append(LoadFormatText(
            `<span id="Lone_AvatarCloneStatus" aria-hidden="true" class="fa fa-clone" title="Allow Avatar Clone : %cloneType%" style="color:%cloneColor%;"></span>`
            ,{
                 "%cloneColor%" : json.allowAvatarCopying == true ? "green" : "red"
                ,"%cloneType%"  : json.allowAvatarCopying == true ? "Yes"   : "No"
            }).out).append(`<a id='trustedData' style='color:` + GetTrusted(json.tags)[0] + `;'
                   title='` + "Tags" + `'>&nbsp;`
                    + (json.tags.toString().match("show_social_rank") ? "":"<s>")
                    + GetTrusted(json.tags)[1]
                    + (json.tags.toString().match("show_social_rank") ? "":"</s>")
                    +
               `</a>`);

        $("#Lone_AvatarCloneStatus").tooltip();

        $("div.col-md-4").find("img.offline, img.online").eq(0)
            .wrap("<a target='_blank' href='" + json.currentAvatarImageUrl + "'></a>")
            //.attr("src",json.currentAvatarImageUrl)
            .parent().parent().append(`<h3>
                <a id="CheckAvatarOwner" style="color:white;" href="javascript:void();" title="Check avatar's owner of current user.">
                    Owner?
                </a>
                <!--
                <a id='trustedData' style='float:right;color:` + GetTrusted(json.tags)[0] + `;'
                   title='` + "Tags" + `'>`
                    + (json.tags.toString().match("show_social_rank") ? "":"<s>")
                    + GetTrusted(json.tags)[1]
                    + (json.tags.toString().match("show_social_rank") ? "":"</s>")
                    +
               `</a>-->
            </h3><h3 id="ShowAvatarOwner" style="display:none;"></h3>`);

        $("#CheckAvatarOwner").tooltip().click(function(){
            $("#ShowAvatarOwner").css("display","block").html("Checking...");
            var path = document.location.origin + "/api/1/file/" + regexUnityID("file",json.currentAvatarImageUrl);
            $.get( path ).done(function( json ){ // console.error(json);
                var isOwner = regexUnityID("usr",window.location.href) == json.ownerId ?
                              "<font style='color:#67d781;'>is</font>" : "is <font style='color:yellow;'>not</font>"
                $("#ShowAvatarOwner")
                    .attr("title",json.name).tooltip()
                    .html("user " + isOwner + " avatar's <a target='_blank' href='/home/user/" + json.ownerId + "'>owner</a>.");
            })
        });
        $("#trustedData").tooltip({ content: function () { return Tags; } });

        Expandhumbnail($("img.online, img.offline"));
        Expandhumbnail($("div.card.bg-primary > div.card-body:eq(0) img[src*='file']:eq(0)"));

        if(json.last_login.length > 0){
            var last_login = moment(json.last_login).format("YYYY-MM-DD HH:mm:ss");
            var last_login_fromNow = moment(json.last_login).fromNow(true);
            if(json.location != "offline")
                    last_login_fromNow = "上線 " + last_login_fromNow
            else    last_login_fromNow = last_login_fromNow + "前 上線"
            $("#LO_status").parent().append("<div style='float:right;'>" + last_login + "</div>");
            $("div.home-content div.mb-4.row div.col-md-12 h3.subheader:eq(0)").append("<div style='float:right;'>" + last_login_fromNow + "</div>");
        }

        // https://stackoverflow.com/a/1986850
        // $("div.world-join")
        if(json.location == "offline"){
            $("img[src*='default_offline_image.png']:eq(0)").parents("div.card.bg-primary:eq(0)")
                .css("cssText", "background-color: #404c58 !important;");
        }
        else if(json.location == "private"){
            $("img[src*='default_private_image.png']:eq(0)").parents("div.card.bg-primary:eq(0)")
                .css("cssText", "background-color: #6b7886 !important;")
                .html("<div class='card-body'><img src='https://assets.vrchat.com/www/images/default_private_image.png' /></div>")
        }
    }).fail(function( xhr, status, error ) { console.error(error);
        $(element).html("<a style='color:darkred;'><b>ERROR</b></a>");
        $("#LO_status").css("color","black");
    });

    modToUser();
}

function modToUser(){
    var UserID = regexUnityID("usr",window.location.href);
    if(!UserID) return;

    // Mute UnMute HideAvatar ShowAvatar
    // <span aria-hidden="true" class="fa fa-star-half-alt"></span>
    // <span aria-hidden="true" class="fa fa-volume-off"></span>
    // btn-primary // btn-secondary
    $("head").append(`<style>
        .Lone_PlayerModerations .btn-secondary {
            display: none;
        }

        .Lone_PlayerModerations .btn-secondary[dType="unmute"],
        .Lone_PlayerModerations .btn-secondary[dType="showAvatar"] {
            color: darkred;
        }
    </style>`);
    $("button.btn.btn-secondary:contains('Block') , button.btn.btn-secondary:contains('Unblock')")
    .parents("div.col-md-4:eq(0)").append(`
    <div role="group" class="w-100 btn-group-lg btn-group-vertical Lone_PlayerModerations"><br>
        <button type="button"                    class="btn btn-primary"  >Your Moderations </button>
        <button type="button" dType="mute"       class="btn btn-secondary">Mute             </button>
        <button type="button" dType="hideAvatar" class="btn btn-secondary">HideAvatar       </button>
        <button type="button" dType="reset"      class="btn btn-secondary">Reset            </button>
    </div>
    `);

    let Moderations = GM_getValue("playermoderations",[]).filter( val => val.targetUserId == UserID );
    if(Moderations.length){
        let modTypeTemp = Moderations[0].type;
        $(`.btn-secondary[dType="${modTypeTemp}"]`)
            .attr("dType",modType[modTypeTemp]["re"])
            .html(modType[modType[modTypeTemp]["re"]]["text"])
    }

    $(".Lone_PlayerModerations .btn-primary:eq(0)").click(function(){
        $(".Lone_PlayerModerations .btn-secondary").slideToggle("fast");
    });

    $(".Lone_PlayerModerations .btn-secondary").click( async function(){
        $(".Lone_PlayerModerations .btn-secondary").prop('disabled', true);

        $(".Lone_PlayerModerations .btn-primary").html("Read list for modify");
        let [modList, err0] = await getAPI("auth/user/playermoderations"); LogInfo("modList:", modList.length);
        if ( modList ) GM_setValue("playermoderations",modList);
             modList = (modList || []).filter( val => val.targetUserId == UserID && val.type != "block" );

        $(".Lone_PlayerModerations .btn-primary").html("Delete duplicate data");
        for(let i = 0; i < modList.length;i++){ if(modList[i].type == "block") continue;
            let [result, del_err] = await getAPI("auth/user/playermoderations/" + modList[i].id, { method: 'DELETE' });
            LogInfo("user data in modList has deleted", result, del_err);
        }

        let dType = $(this).attr("dType");
        if( dType == "reset"){
            dType = "unmute";
            $(`.btn-secondary[dType="unmute"]`)
                .attr("dType","mute")
                .html(modType["mute"]["text"]);
            $(`.btn-secondary[dType="showAvatar"]`)
                .attr("dType","hideAvatar")
                .html(modType["hideAvatar"]["text"]);
        }

        $(".Lone_PlayerModerations .btn-primary").html("Setting Player Moderations");
        // https://vrchatapi.github.io/#/ModerationAPI/SendPlayerModerations
        let value = await getAPI("auth/user/playermoderations",{
             method: 'POST'
            ,headers: { 'content-type': 'application/json' }
            ,body: JSON.stringify({ type: dType, moderated: UserID })
        });
        if(value[1]){ alert("Error"); return; }
        value = [value[0]]; LogInfo("SetPlayerModerations:", value);

        // https://stackoverflow.com/a/37585362
        let array_out   = GM_getValue("playermoderations",[])
                            .map(obj => value.find(o => o.targetUserId === obj.targetUserId) || obj);
        GM_setValue("playermoderations",array_out);

        let modTypeTemp = value[0].type;
        $(`.btn-secondary[dType="${modTypeTemp}"]`)
             .attr("dType",modType[modTypeTemp]["re"])
             .html(modType[modType[modTypeTemp]["re"]]["text"]);

        $(".Lone_PlayerModerations .btn-primary").html("Your Moderations");
        $(".Lone_PlayerModerations .btn-secondary").prop('disabled', false);
    });
}

// http://www.wibibi.com/info.php?tid=79
// http://www.wibibi.com/info.php?tid=CSS3_background-size_%E5%B1%AC%E6%80%A7
// http://www.wibibi.com/info.php?tid=75
// https://goo.gl/BlGwtZ
function Expandhumbnail(e, url){
    $(e).hover(function() {
        $("div.home-content:eq(0) > div:eq(0)")
            .css("background-repeat","no-repeat")
            .css("background-size","contain") // 100%
            .css("background-image","url(" + (url || $(e).attr("src")) + ")")
            .css("background-position","center top") // 100%
            .find("div").css("opacity","0.3") //.fadeTo( "fast" , 0.1)
    }, function(){
        $("div.home-content:eq(0) > div:eq(0)")
            .css("background-image","")
            .find("div").css("opacity","1.0")
    });
}

// https://fontawesome.com/icons?d=gallery
function SetPublicAvatar(element){
    var e_AvatarThumbnail = $("img.img-thumbnail.rounded-circle.float-left.home-avatar:eq(0)").attr("src");

    var styleElement = `<hr>
    <div class="animated fadeIn card">
      <h3 class="card-header">CHANGE AVATAR (PUBLIC ONLY)</h3>
      <div class="card-body"><div><div class="center-panel"><form>
        <div class="row">
          <div class="col-1" style="text-align: right;">
            <span aria-hidden="true" class="fa fa-portrait fa-2x" id="SetAvatarPortrait" style="color:#FA5882;"></span>
          </div>
          <div class="col-10"><div class="row">
              <!--<textarea class="form-control" name="avatar-bluPrintID" id="avatar-bluPrintID"></textarea>-->
              <input type="text" class="form-control" id="avatar-bluPrintID" name="avatar-bluPrintID"></input>
          </div></div>
        </div>
      </div>
      <div class="row"><div class="col-1"></div>
        <div class="col-10"><div class="row">
          <div id="SetAvatarStatusDiv" style="display:none">
            <div id="SetAvatarStatus" style=""></div>
          </div>
        </div></div>
      </div>
      <div class="row">
        <div class="col-4 offset-4">
          <button class="btn btn-primary w-100" value="Use Tsumiki"   id="SetTsumikiAvatar">Use Tsumiki</button>
        </div>
        <div class="col-4">
          <button class="btn btn-primary w-100" value="Change Avatar" id="SetPublicAvatar">Change Avatar</button>
        </div>
      </div>
    </form></div></div>
    </div>
    </div><hr>`

    $(styleElement).insertAfter( $(element).parent() );

    /*
    var styleElement = $(''
        + '<div class="card row"><h3>Change Avatar (Public only)</h3>'
        + '<div><div class="center-panel">'
        + '<form class="form-horizontal" name="update-status" action="#">'
        + '<div class="form-group"><div class="row"></div>'
        + '<div class="row">'
        + '<div class="col-1">'
            // https://fontawesome.com/icons?d=gallery&c=images
            // https://fontawesome.com/icons/portrait?style=solid
        + '<span aria-hidden="true" class="fa fa-portrait fa-4x">'
        + '</span>'
        + '</div>'
        + '<textarea class="col-md-10" name="avatar-bluPrintID" id="avatar-bluPrintID"></textarea>'
        //+ '<div class="col-1 d-none" id="SetPublicAvatarChecked"><span aria-hidden="true" class="fa fa-check fa-2x text-success"></span></div>'
        + '</div></div><div class="form-group">'
        + '<div class="row"><div class="offset-8">' //<div class="col-4 offset-8">'
        //+ '<input class="btn btn-primary w-100" value="Change Avatar" type="button" id="SetPublicAvatar">'
        + '<input class="btn btn-primary" value="Change Avatar" type="button" id="SetPublicAvatar">&nbsp;'
        + '<input class="btn btn-primary" value="Use Default" type="button" id="SetTsumikiAvatar">'
        + '</div></div></div>'
        + '</form>'
        //+ '<div class="form-group" id="SetAvatarStatusDiv" style="display:none;"><div class="row"><div class="col-4"><div><span color="success" aria-hidden="true" class="fa fa-check"></span>&nbsp;<a id="SetAvatarStatus"></a></div></div><div class="col-4 offset-4"></div></div></div>'
        + '<div class="form-group" id="SetAvatarStatusDiv" style="display:none;"><div class="row"><div class="col-4"><div><span color="success" aria-hidden="true" class="fa fa-asterisk"></span>&nbsp;<a id="SetAvatarStatus"></a></div></div><div class="col-4 offset-4"></div></div></div>'
        + '</div></div></div>').insertAfter( $(element).parent() );
    */
    $("#avatar-bluPrintID").change(bluPrintIDchanged).keyup(bluPrintIDchanged);
    function bluPrintIDchanged(){
        if(regexUnityID("avtr",$("#avatar-bluPrintID").val())){
                //$("#SetPublicAvatarChecked").removeClass("d-none");
                $("#SetAvatarPortrait").css("color","magenta");
        }
        else {
                //$("#SetPublicAvatarChecked").addClass("d-none");
                $("#SetAvatarPortrait").css("color","f400a1");
        }
    }

    $("#SetTsumikiAvatar").click(function(){
        $("#avatar-bluPrintID").val("avtr_4d60222f-e022-41ee-9468-e4daf13bd181").trigger("keyup");
        $("#SetPublicAvatar").click();
    })

    $("#SetPublicAvatar").click(function(){
        var AvatarID = regexUnityID("avtr",$("#avatar-bluPrintID").val());
        if(!AvatarID || !confirm("Change Avatar?")) return;

        $("#SetPublicAvatar").prop('disabled', true);
        $("#SetAvatarStatus").html("");

        $.ajax({
            url: "/api/1/avatars/" + AvatarID + "/select",
            type: "PUT"
        }).done(function( json ) { //console.error(html);
            if(json.currentAvatar == AvatarID){
                $("img.img-thumbnail.rounded-circle.float-left.home-avatar:eq(0)")
                    .removeAttr("src").attr("src",json.currentAvatarThumbnailImageUrl)
                $("#SetAvatarStatus").html("Avatar Changed.");
            }
            else {
                $("#SetAvatarStatus").html("error?");
            }

            //$("#SetAvatarStatus").html($("#SetAvatarStatus").html() + "<img src='" + json.currentAvatarThumbnailImageUrl + "' />");
            $("#SetAvatarStatus").html($("#SetAvatarStatus").html()
                + "<a target='_blank' href='" + json.currentAvatarImageUrl + "'><br>"
                + "<img style='width:200px;height:150px;' src='" + json.currentAvatarThumbnailImageUrl + "' /></a>");

            $("#SetAvatarStatusDiv").show();
            $("#SetPublicAvatar").prop('disabled', false);
            $(styleElement).find("span.fa-portrait").css("color","#F4FA58");
        }).fail(function( xhr, status, error ) {  console.error(status); console.error(error);
            $("#SetAvatarStatusDiv").show();
            $("#SetPublicAvatar").prop('disabled', false);
            //alert(" Failed to Change Avatar. Private avatar is not available. \n Or maybe you type a wrong Avatar ID");
            $("#SetAvatarStatus").html(" Failed to Change Avatar. <br> Wrong Avatar ID? <br> Private avatar is not available.");
            $(styleElement).find("span.fa-portrait").css("color","black");
        })
    });
}



var PageStates = {};
function HomePageFunc(){
    var MenuNode = $("a.btn-secondary.text-left[title='worlds']:eq(0)");
    if(!$(MenuNode).length || $(MenuNode).hasClass("LittleONE_done")) return;
    /*
    $("div.friend-container:eq(0)")
        .css("height","calc(100% - 145px)")
        //.parent().find("h3:eq(0)").css("white-space","nowrap").hide();
    */

    $('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("JqueryUIcss") + '" type="text/css" />');

    $(MenuNode).addClass("LittleONE_done");

    $("span.copyright:eq(0)").html( ""
        + "<a target='_blank' style='color:#BDBDBD;' href='https://greasyfork.org/zh-TW/scripts?set=327266'>"
        +   $("span.copyright:eq(0)").html()
        + "</a>&nbsp;&nbsp;"
        + "<a target='_blank' style='color:white;' href='https://greasyfork.org/zh-TW/scripts/376747-vrchat-littleone'>"
        +   "<font color='#67d781'>VRChat LittleONE</font>&nbsp;v<font color='#0040FF'>" + GM_info.script.version + "</font>"
        + "</a>");

    //$("div.w-100.btn-group-lg.btn-group-vertical > a[title='home']:eq(0)").append('&nbsp;<span aria-hidden="true" class="fa fa-angle-right fa-1.5x"></span>');

    // HomePage Home button Yellow
    $("a.btn.btn-secondary.text-left[title='home']:eq(0)").css("color","yellow");
    // HomePage World button green
    $("a.btn.btn-secondary.text-left[title='worlds']:eq(0)").css("color","#67d781");

    // 左側邊欄縮排
    /*
    var leftBar = $("div.container-fluid div.bg-gradient-secondary.leftbar:eq(0)")
    $(leftBar)
        //.width("3.7%") // .width("55px")
        .find("a.btn.btn-secondary.text-left").each(function(){
            $(this).contents().filter(function(){ return this.nodeType === 3; }).eq(0).remove();
        })
    */
    /*
    $( leftBar ).animate({
        width: "fit-content",
        height: "toggle"
        }, {
        duration: 5000,
        specialEasing: {
          width: "linear",
          height: "easeOutBounce"
        },
        complete: function() {
          $( this ).after( "<div>Animation complete.</div>" );
        }
    });
    */
    // 中間資訊區域靠左並延展
    /*
    var widthPercentage = GetWidthPercentage($(leftBar)) * 1.8;
    var flexPercentage  = (100 - GetWidthPercentage($("div.bg-gradient-secondary.rightbar:eq(0)")) * 1.35) + "%";
    $("div.container-fluid div.offset-lg-2.col-lg-7.col-xs-12:eq(0)")
        .css("margin-left",widthPercentage + "%").css("flex","0 0 " + flexPercentage).css("max-width",flexPercentage)
    */
    return;
    //==================================================================================================================
    /*
    window.onpopstate = function(event) {
        //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        console.error("location: " + document.location + ", state: " + JSON.stringify(event.state));
    };
    */

    // https://www.vrchat.com/api/1/auth/user/playermoderated
    $(MenuNode).clone().html("<span aria-hidden='true' class='fa fa-user'></span>&nbsp;&nbsp;Friends History")
    .attr("title","FriendsHistory").insertAfter($(MenuNode)).attr("href","#").removeAttr("href")
    .click(function(){
        if(PageStates.Last != "FriendsHistory"){
            PageStates.Last2 = PageStates.Last;
            PageStates.Last  = "FriendsHistory";
        }

        $("a.btn.btn-secondary.text-left[title='download']:eq(0)").click();
        return;

        //$("div.home-content:eq(0)").append('<div id="dialog" title="Friends History"><p>Working Progress....</p></div>');
        /*
        $( "#dialog" ).dialog({
             position: { my: "left top", at: "left top", of: $("div.home-content:eq(0)") }
            ,width: $("div.home-content:eq(0)").width()
        });
        */
        //$("div.home-content:eq(0) > div:eq(0) > div:eq(0)").html("ccc");
        //$("div.home-content:eq(0) > div:eq(0)").html(""

        $("div.home-content:eq(0) > div:eq(0)").html(""
            + '<div class="center-block text-center justify-content-center mb-4 row">'
            +   '<div class="col-6">'
            +       '<h3> Working Progress....</h2>'
            +   '</div>'
            + '</div>').attr("class","");

        //history.pushState({"key":"FriendsHistory"}, "FriendsHistory", "/home#FriendsHistory");
        history.pushState({"key":"FriendsHistory"}, "FriendsHistory", "/home/FriendsHistory");
        //history.replaceState({"key":"FriendsHistory"}, "DownloadPage", "/home/FriendsHistory");

        var currentState = history.state;
        console.error("location: " + document.location + ", state: " + JSON.stringify(history));

        /*
        var currentState = history.state;
        console.error("location: " + document.location + ", state: " + JSON.stringify(currentState));



        //location.hash = "ccc";
        history.replaceState({"key":"FriendsHistory"}, "FriendsHistory", "/home/FriendsHistory");
        */
    })

    $("a.btn.btn-secondary.text-left:not(.LittleONE_done)").click(function(){
        var CurrentTitle = $(this).attr("title");

        if(history.state == null || history.state.key == null) return;

        if(CurrentTitle == "home" && PageStates.Last == "FriendsHistory"){
            history.replaceState({"key":PageStates["download"]}, "download", "/home");
            //$("a.btn.btn-secondary.text-left[title='download']:eq(0)").click();
            //$("a.btn.btn-secondary.text-left[title='home']:eq(0)").click();
        }

        PageStates.Last2                        = PageStates.Last;
        PageStates.Last                         = CurrentTitle;
        PageStates[PageStates.Last]             = history.state.key;
        PageStates["Location_" + CurrentTitle]  = document.location;

        console.error("location: " + document.location + ", state: " + JSON.stringify(history.state.key));
        console.error(PageStates);

    });
    //==================================================================================================================
}

function SteamIDLinkToPage(element){
    // https://zh.wikipedia.org/zh-tw/File:Steam_icon_logo.svg
    //<img class='steam' width='30.4' height='30.4' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/240px-Steam_icon_logo.svg.png'/>
    $(element).html("<a target='_blank' style='color:white;' href='https://steamcommunity.com/profiles/" + $(element).html().substring(6) + "'>" + $(element).html() + "</a>");

    var avatarIMG = $("img.online[src*='steam'],img.offline[src*='steam']").eq(0);
    $(avatarIMG).attr("src", $(avatarIMG).attr("src").replace("_medium.","_full."));
}

function LaunchPage(element){ // Beta
    var WorldID     = getQueryString("worldId");
    var InstancesID = getRndInteger(100, 99999);
    var usr_empty   = "usr_30ae0fcd-ed69-4f55-b4f3-34f5272f7344";
    var htmlSrc     = `<a href="vrchat://launch?id=` + WorldID + `:%room-id%~%launch-link%" class="btn btn-primary launch-btn" style="color:black;background-color:%Launch-bcolor%;min-width:230px;text-align:left;">%launch-text%</a>`

    var btns        = [
         LoadFormatText(htmlSrc,{ "%room-id%"        : "1"
            ,"%launch-link%"    : "pub"
            ,"%Launch-bcolor%"  : "yellow"
            ,"%launch-text%"    : "Public:1"}).out
        ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
            ,"%launch-link%"    : "pub"
            ,"%Launch-bcolor%"  : "yellow"
            ,"%launch-text%"    : "Public:" + InstancesID}).out
        ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
            ,"%launch-link%"    : "hidden(%usr_empty%)"
            ,"%usr_empty%"      : usr_empty
            ,"%Launch-bcolor%"  : "#8143E6"
            ,"%launch-text%"    : "Friends+"}).out
        ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
            ,"%launch-link%"    : "canRequestInvite(%usr_empty%)"
            ,"%usr_empty%"      : usr_empty
            ,"%Launch-bcolor%"  : "#2BCF5C"
            ,"%launch-text%"    : "Invite+"}).out
    ]

    var userID      = GM_getValue("cur_userID"      ,null);
    var displayName = GM_getValue("cur_displayName" ,null);
    //userID = null;

    if(userID && displayName){
        btns.push(
             LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : ""
                ,"%Launch-bcolor%"  : "#f5b501"
                ,"%launch-text%"    : displayName}).out
            ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : "friends(" + userID + ")"
                ,"%Launch-bcolor%"  : "#FF7B42"
                ,"%launch-text%"    : "Friends"}).out
            ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : "private(" + userID + ")"
                ,"%Launch-bcolor%"  : "#1778FF"
                ,"%launch-text%"    : "Invite"}).out)
    } else {
        btns.push(LoadFormatText(htmlSrc,{
             "%room-id%"        : ""
            ,"%launch-link%"    : ""
            ,"%usr_empty%"      : ""
            ,"%Launch-bcolor%"  : "red"
            ,"%launch-text%"    : "LoadData..."}).out)
    }

    $(element).parent().append("<br>");
    $.each(btns, function(i, value) { //console.error(key + " - " + value);
        $(element).parent().append(value).append("<br>");
    })

    if(userID && displayName) return;
    $.get( "/api/1/auth/user").done(function( json ){ //console.error(json);
        json = JSON.parse(json);
        if(!json.id){
            $("a.launch-btn:contains('LoadData...'):eq(0)").html("Not login");
            return;
        }

        GM_setValue("cur_userID"      ,json.id);
        GM_setValue("cur_displayName" ,json.displayName);

        var btns2       = [
             LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : ""
                ,"%Launch-bcolor%"  : "#f5b501"
                ,"%launch-text%"    : json.displayName}).out
            ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : "friends(" + json.id + ")"
                ,"%Launch-bcolor%"  : "#FF7B42"
                ,"%launch-text%"    : "Friends"}).out
            ,LoadFormatText(htmlSrc,{ "%room-id%"        : InstancesID
                ,"%launch-link%"    : "private(" + json.id + ")"
                ,"%Launch-bcolor%"  : "#1778FF"
                ,"%launch-text%"    : "Invite"}).out
        ]

        $("a.launch-btn:contains('LoadData...'):eq(0)").remove();
        $.each(btns2, function(i, value) { //console.error(key + " - " + value);
            $(element).parent().append(value);
        })
    }).fail(function( xhr, status, error ) {
        $("a.launch-btn:contains('LoadData...'):eq(0)").html("Not login");
        console.error(xhr);
        console.error(JSON.stringify(xhr.responseJSON, null, 4));
        alert(JSON.stringify(xhr.responseJSON.error, null, 4));
    })



    // -----------------------------------------------------------------------------------------------------------------
    return;
    // https://stackoverflow.com/a/30680994
    $("head").append("<style>::-webkit-scrollbar {width: 0px;  /* remove scrollbar space */background: transparent;  /* optional: just make scrollbar invisible */}");

    var WorldID = getQueryString("worldId");
    $("span.world:eq(0)").html("<a href='/home/world/" + WorldID + "' target='_blank'>" + $("span.world:eq(0)").html() + "</a>");

    var InstancesID = getRndInteger(100, 99999)
    var prevText    = "<a class='btn btn-primary btn-lg' href='vrchat://launch?ref=" + document.location.host + "&id=" + WorldID + ":";
    var nextText    = "</a>";

    $("#launch").parent()
        .after(LoadFormatText("<p>"
            +       "%prevText%1            '>Public:1"                                           + "%nextText%"
            + "&nbsp;%prevText%%InstancesID%'>Public"                                             + "%nextText%"
            + "&nbsp;%prevText%%InstancesID%" + "~hidden(%usr_empty%)'>Friends+"                  + "%nextText%"
            + "&nbsp;%prevText%%InstancesID%" + "~friends(%usr_empty%)'>Friends"                  + "%nextText%"
            + "&nbsp;%prevText%%InstancesID%" + "~private~canRequestInvite(%usr_empty%)'>Invite+" + "%nextText%"
            + "&nbsp;%prevText%%InstancesID%" + "~private(%usr_empty%)'>Invite"                   + "%nextText%"
            + "</p>"
        ,{
             "%prevText%"   : prevText
            ,"%InstancesID%": InstancesID
            ,"%nextText%"   : nextText
            // usr_id from https://forum.gamer.com.tw/Co.php?bsn=60076&sn=48167935
            ,"%usr_empty%"  : "usr_30ae0fcd-ed69-4f55-b4f3-34f5272f7344"
        }).out);

        /*
        //.after("<p>"   + prevText + "~public'>Public"   + nextText
        .after("<p>"   + prevText + "'>Public"          + nextText
            + "&nbsp;" + prevText + "~hidden'>Friends+" + nextText
            + "&nbsp;" + prevText + "~friends'>Friends" + nextText
            + "&nbsp;" + prevText + "~private~canRequestInvite()'>Invite+" + nextText
            + "&nbsp;" + prevText + "~private'>Invite"  + nextText
            + "</p>");
        */

    $("div.row > div:eq(0)").css("opacity","0.75");
    $("body").css("background-color","black");
    //$("div.bg").css("position","relative");
}

function FriendList(){
    $("body").html(`<h2 align="center">This page is Incomplete / Under Construction v0.3</h2><br>`);
    $("head").append(`
    <title>VRChat LittleONE Friend List</title>
    <link rel="stylesheet" href="/public/css/vrchatstrap.css" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,400i,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Dosis:300,400,400i,700" rel="stylesheet">
    <link rel="stylesheet" href="https://assets.vrchat.com/www/font-awesome/css/font-awesome.min.css" type="text/css">
    <link rel="stylesheet" href="https://assets.vrchat.com/www/css/animate.min.css" type="text/css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">

    <style>
        body {
            background-color: #1a2026;
            color: white;
        }

        /* https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */
        /* Customize the label (the container) */
        .checkboxContainer {
          display: block;
          position: relative;
          padding-left: 35px;
          margin-bottom: 1px;
          cursor: pointer;
          font-size: 20px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Hide the browser's default checkbox */
        .checkboxContainer input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        /* Create a custom checkbox */
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 25px;
          width: 25px;
          background-color: #eee;
        }

        /* On mouse-over, add a grey background color */
        .checkboxContainer:hover input ~ .checkmark {
          background-color: #ccc;
        }

        /* When the checkbox is checked, add a blue background */
        .checkboxContainer input:checked ~ .checkmark {
          background-color: #2196F3;
        }

        .checkboxContainer input[disabled] ~ .checkmark {
          background-color: red;
        }

        /* Create the checkmark/indicator (hidden when not checked) */
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        /* Show the checkmark when checked */
        .checkboxContainer input:checked ~ .checkmark:after {
          display: block;
        }

        /* Style the checkmark/indicator */
        .checkboxContainer .checkmark:after {
          left: 9px;
          top: 5px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 3px 3px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }

        /* https://stackoverflow.com/a/13356401 */
        div.topcorner {
            display: none;

            width: 667px;
            height: 500px;
            position: fixed;
            top: 0;
            right: 0;
            z-index: 10;
            opacity: 0.9;

            background-repeat: no-repeat;
            background-size: contain;
            background-position: center top;

            /*  position: absolute;
                bottom: 0;
                left: 0;
                margin: auto;
                background-color: black;
            */
        }

        div.topcorner#ImageShow2 {
            z-index: 15;
            opacity: 1.0;
        }
    </style>
    `);

    $("body").append(`
    <div>
        <h3>Load Options <a class="dataContent" id="LoadStatus"></a></h3>
    <div>
    <table border="0">
    <tr><td>
    <label class="checkboxContainer"> Load User Data
        <input class="LoadOptions" type="checkbox" id="LUD" data-func="getUserData" disabled checked>
        <span class="checkmark"></span>
    </label>

    </td><td>：</td><td style="float:right;">
        <div class="dataContent" id="LUD_Status" data-func="getUserData" style="display:inline;"></div>
    </td></tr>

    <tr><td>
    <label class="checkboxContainer"> Load Block you Data
        <input class="LoadOptions" type="checkbox" id="LByD" data-func="getBlockDataByUser" checked>
        <span class="checkmark"></span>
    </label>
    </td><td>：</td><td style="float:right;">
        <div class="dataContent" id="LByD_Status" data-func="getBlockDataByUser" style="display:inline;"></div>
    </td></tr>

    <tr><td>
    <label class="checkboxContainer"> Load you Block Data
        <input class="LoadOptions" type="checkbox" id="LyBD" data-func="getBlockDataByYou" checked>
        <span class="checkmark"></span>
    </label>
    </td><td>：</td><td style="float:right;">
        <div class="dataContent" id="LyBD_Status" data-func="getBlockDataByYou" style="display:inline;"></div>
    </td></tr>

    <tr><td>
    <label class="checkboxContainer"> Load Online  Friends
        <input class="LoadOptions" type="checkbox" id="LOnF" data-func="getFriendsOnline" checked>
        <span class="checkmark"></span>
    </label>
    </td><td>：</td><td style="float:right;">
        <div class="dataContent" id="LOnF_Status" data-func="getFriendsOnline" style="display:inline;"></div>
    </td></tr>

    <tr><td>
    <label class="checkboxContainer"> Load Offline Friends
        <input class="LoadOptions" type="checkbox" id="LOfF" data-func="getFriendsOffline" checked>
        <span class="checkmark"></span>
    </label>
    </td><td>：</td><td style="float:right;">
        <div class="dataContent" id="LOfF_Status" data-func="getFriendsOffline" style="display:inline;"></div>
    </td></tr>
    </table>
    <br>
    </div>

    <h3>Appearance</h3>
    <div>
    <table border="0">
    <tr><td>
    <label class="checkboxContainer"> Show Avatar  Thumbnail
        <input class="LoadOptions" type="checkbox" id="SAT">
    <span class="checkmark"></span>
    </label>
    </td></tr>
    </table>
    <br>
    </div>

    <h3>Sort Options</h3>
    <button type="button" class="btn btn-primary" id="">displayName</button>
    <button type="button" class="btn btn-primary" id="">userName</button>
    <button type="button" class="btn btn-primary" id="">NotFriend</button>

    <br><h3></h3>
    <button type="button" class="btn btn-primary" id="Lone_GetFriend">Get Friend List</button>
    <div class="dataContent" id="userContent"></div>
    <div class="topcorner"   id="ImageShow"></div>
    <div class="topcorner"   id="ImageShow2"></div>
    `);


    let template_user   = `
    <% for(let i=0; i < json.length; i++) { %>
    <% let onlineColor  = json[i].location == 'offline' ? "white":"green" %>
    <% let statusColor  = StatusColor[json[i].status] %>
    <% let trustColor   = GetTrusted(json[i].tags)[0] %>
    <% let pastName     = GM_getValue(json[i].id + "_pastName","") %>
    <% let image        = $("#SAT").prop("checked") == true ? json[i].currentAvatarThumbnailImageUrl:"https://d348imysud55la.cloudfront.net/thumbnails/1904009139.thumbnail-500.png" %>

    <div class="text-left friend-row"
         style="display:flex;margin-left:15px;margin-top:10px;"
         user_id="<%= json[i].id %>">

        <img class="img-thumbnail rounded float-left friend-img Lone_world_friend"
             bak="<%= json[i].currentAvatarThumbnailImageUrl %>"
             ba2="<%= json[i].currentAvatarImageUrl %>"
             ori="<%= json[i].currentAvatarImageUrl %>"
             src="<%= image %>"
             title="%display-title%"
             style="width:160px;height:120px;border-right-width:6px;border-right-color:<%= trustColor %>;border-left:<%= onlineColor %> 6px outset;">

        <div class="friend-caption text-success" style="display:none;">
          <ul>
              <li>___userID____：&nbsp;<%= json[i].id %></li>
              <li>____friendKey：&nbsp;<%= json[i].friendKey %></li>
              <li>___userName：&nbsp;<%= json[i].username %></li>
              <li>___pastName：&nbsp;<%= pastName %></li>
              <li>displayName：<a target="_blank" href="/home/user/<%= json[i].id %>" style="display:inline;">
                  <font color="<%= statusColor %>"><b><%= json[i].displayName %></b></font></a></li>
              <li><%= json[i].statusDescription %><font style="opacity:0.0;">-</font></li>
              <!--
              <li><font style="display:%rank-hide%;color:white !important;">Appearing as <font style="color:#67d781;">User</font> Rank</font></li>
              -->
          </ul>
        </div>


        <div class="friend-caption text-success">
        <table border="0" style="margin-left:5px;color:white;">
        <tr><td style="float:right;">userID：</td>
            <td><a style="float:right;"><%= json[i].id %></a></td></tr>
        <tr><td style="float:right;">friendKey：</td>
            <td><a style="float:right;"><%= json[i].friendKey %></a></td></tr>
        <tr><td style="float:right;">userName：</td>
            <td><%= json[i].username %></td></tr>
        <tr><td style="float:right;">pastName：</td>
            <td><b><%= pastName %></b></td></tr>
        <tr><td style="float:right;">displayName：</td>
            <td><a target="_blank" href="/home/user/<%= json[i].id %>" style="display:inline;"><font color="<%= statusColor %>"><b><%= json[i].displayName %></b></font></a></td></tr>
        <tr><td style="float:right;">Description：</td>
            <td><%= json[i].statusDescription %><font style="opacity:0.0;">-</font></td></tr>
        </table>
        </div>

    </div>

    <% } %>`

    $("#Lone_GetFriend").click( async function(){
        $(".dataContent").html("");
        $( "#LoadStatus" ).append(" > Loading")

        let LoadOptionsChecked = $( ".LoadOptions:checked[data-func]" ).toArray().map(v => $(v).attr("data-func"));
        let FL = $.extend(true, {}, FriendLister);
        FL.runSpecific(LoadOptionsChecked,function(status, data){
            if(status.status == "keepGoing"){
                let kv      = FL["init"][status.key.substr(3)];
                let Length  = kv.length || kv.toString().length || "";
                $(`.dataContent[data-func="${status.key}"]`).html(Length);
                return;
            }

            $( "#LoadStatus" ).append(` > Done.`)
            let parse       = eval(compile(template_user));
            let json        = FL["init"]["FriendsOnline"].concat(FL["init"]["FriendsOffline"]);
            let dataFriends = parse(json);
            $("#userContent").append(dataFriends);

            $(".img-thumbnail").hover(function(){
                let bak = $(this).attr("bak");
                let ba2 = $(this).attr("ba2");
                //$("#ImageShow").html(`<img src="${src}" width="667" height="500" />`);
                $("#ImageShow") .css("background-image",`url("${bak}")`).show();
                $("#ImageShow2").css("background-image",`url("${ba2}")`).show();

            },function(){
                $("#ImageShow , #ImageShow2").css("background-image",``).hide();
            })

            $( "#LoadStatus" ).append(` ( ${FL["init"]["LoadTime"]} ms )`)
        });
    })
}

let GetFriendsMulti = { //New Version
    def           : {
         max       : 100
        ,offset    : 0
        ,userArray : []
        ,offline   : false
        ,multi     : 2
        ,running   : 0
        ,end       : false
    },
    firstRun:  async function(callback, obj) { if(!callback) return;
        let self    = this;
        self        = Object.assign(self, self.def || {});
        self        = Object.assign(self, obj      || {});
        self.offset-= self.max;
        self.run(callback);
    },
    run:       async function(callback, obj)   { let self  = this;
        for(let i = 1; i <= self.multi;i++) {
            self.getNew(async function(...args) {
                                      callback.apply(this, ["keepGoing", self]);
                if(self.running == 0) callback.apply(this, ["success"  , self]);
            });
        }
    },
    getNew:    async function(callback)        { let self  = this;
        if(self.end) { callback.apply(this, []); return; }

        self.running   ++
        self.offset    += self.max;
        let offsetTemp  = self.offset;
        let [data, err] = await getAPI("auth/user/friends/?offline=" + self.offline + "&n=" + self.max + "&offset=" + self.offset);
        if(data.length == 0 || data.length < self.max) self.end = true;
        self.userArray  = self.userArray.concat(data);
        self.running   --
        LogInfo("offset:", offsetTemp, "length:", data.length);
        callback.apply(this, []);
        if(!self.end) self.getNew(callback);
    }
}

// https://stackoverflow.com/questions/4616202/self-references-in-object-literals-initializers
let FriendLister = {
    init: {
         UserData           : {}
        ,BlockDataByUser    : []
        ,BlockDataByYou     : []
        ,FriendsOnline      : []
        ,FriendsOffline     : []

        ,LoadTime           : 0
        ,error: null
    },
    runAll:         async function(callback){
        const keys = Object.keys(this).filter(val => val.match("^get"));
		for(let i = 0;i < keys.length;i++)       this[keys[i]](callback);
    },
    runAllawait:    async function(callback){
        const keys = Object.keys(this).filter(val => val.match("^get"));
		for(let i = 0;i < keys.length;i++) await this[keys[i]](callback);
        return this.init;
    },
    runAllEndback:  async function(callback){ if(!callback) return false;
        const timestamp     = Date.now();
        const keys          = Object.keys(this).filter(val => val.match("^get"));
        let EndbackCounter  = 1;
		for(let i = 0;i < keys.length;i++){
            this[keys[i]](function(status, ...args){
                callback.apply(this, [{ status: "keepGoing", key: keys[i] }, { d: args } ]);
                if(status == "success" && EndbackCounter++ >= keys.length){
                    LogInfo("runAllEndback used:", Date.now() - timestamp, "ms.");
                    callback.apply(this, [{ status: "success" }, { d: args } ]);
                    return true;
                }
            });
        }
        return false;
    },
    runSpecific:        async function(keys, callback){ if(!callback) return false;
        //keys = keys.filter(f => array.includes(f));    // https://stackoverflow.com/a/41169035
        const timestamp     = Date.now();
        let self            = this;
        let EndbackCounter  = 1;
        for(let i = 0;i < keys.length;i++){
            this[keys[i]](function(status, ...args){
                callback.apply(this, [{ status: "keepGoing", key: keys[i] }, { d: args } ]);
                if(status == "success" && EndbackCounter++ >= keys.length){
                    self.init.LoadTime = Date.now() - timestamp;
                    LogInfo("runSpecific used:", self.init.LoadTime, "ms.");
                    callback.apply(this, [{ status: "success" }, { d: args } ]);
                    return true;
                }
            });
        }
        return false
    },
    getUserData:        async function(callback){
        let [UserData, UD_err0] = await getAPI("auth/user");
        this.init.UserData = UserData || {};
        if(callback) callback.apply(this, ["success", UserData, UD_err0]);
    },
    getBlockDataByUser: async function(callback){
        let [BlockDataByUser, LBD_err0] = await getAPI("auth/user/playermoderated");
        this.init.BlockDataByUser = BlockDataByUser || {};
        if(callback) callback.apply(this, ["success", BlockDataByUser, LBD_err0]);
    },
    getBlockDataByYou:  async function(callback){
        let [BlockDataByYou, LBD_err1] = await getAPI("auth/user/playermoderations");
        this.init.BlockDataByYou = BlockDataByYou || {};
        if(callback) callback.apply(this, ["success", BlockDataByYou, LBD_err1]);
    },
    getFriendsOnline:   async function(callback){ let self = this;
        let GFM_Online = $.extend(true, {}, GetFriendsMulti);
        GFM_Online.firstRun(function(status, obj) {
            //if(status == "keepGoing"){ return; }
            //if(status != "success"  ){ return; }
            self.init.FriendsOnline = obj.userArray || [];
            //console.error("getFriendsOnline", status, obj.userArray);
            if(callback) callback.apply(self, [status, obj.userArray]);
        }, { offline: false } );
    },
    getFriendsOffline: async function(callback){ let self = this;
        let GFM_Offline = $.extend(true, {}, GetFriendsMulti);
        GFM_Offline.firstRun(function(status, obj) {
            //if(status == "keepGoing"){ return; }
            //if(status != "success"  ){ return; }
            self.init.FriendsOffline = obj.userArray || [];
            //console.error("getFriendsOffline", status, obj.userArray);
            if(callback) callback.apply(self, [status, obj.userArray]);
        }, { offline: true } );
    }
}

async function GetFavOfWorlds(){ // v1.11
    $("body").html(`

            <h2 align="center">This page is Incomplete / Under Construction</h2><br>

        <h2 align="center">Your Favorited Worlds v1.01</h2><br>
        <div class="fa-8x" style="display: flex;align-items: center;justify-content: center;" id="wLoading">
            <i class="fas fa-atom fa-spin" style="color:#67d781;margin: 0;"></i>
            <div id="GFoW_Status" class=""> 0 / 5</div>
        </div>
        <div class="centerImageUrl pointer"></div>
    `);
    $("div.centerImageUrl").click(function(){ $(this).hide(); });

    $("head").append(`
    ${JqueryUIcss}

    <title>VRChat LittleONE Worlds List</title>
    <link rel="stylesheet" href="/public/css/vrchatstrap.css" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,400i,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Dosis:300,400,400i,700" rel="stylesheet">
    <link rel="stylesheet" href="https://assets.vrchat.com/www/font-awesome/css/font-awesome.min.css" type="text/css">
    <link rel="stylesheet" href="https://assets.vrchat.com/www/css/animate.min.css" type="text/css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">

    <style>
        body {
            background-color: #1a2026;
            color: white;
        }

        span.wRStatus[data-status="public"] {
            color: #ff0;
        }
        span.wRStatus[data-status="friends"] {
            color: #FF7B42;
        }
        span.wRStatus[data-status="private"] {
            color: #1fd1ed;
        }

        div.wRStatus[data-status="public"] {
            background-color: #ff0 !important;
        }
        div.wRStatus[data-status="friends"] {
            background-color: #FF7B42 !important;
        }
        div.wRStatus[data-status="private"] {
            background-color: #1fd1ed !important;
        }

        .wTagNum {
            text-decoration: underline;
            //text-decoration-color: #FF7B42;
            text-decoration-color: #1fd1ed;
        }

        .wTagNum[data-wTagNum="32"] {
            text-decoration-color: red;
            font-weight: bold;
            color: gray;
        }

        .worldRow {
            display: flex;
            flex-wrap: wrap;
            //flex-direction:column;
            max-width: 90%;
            //margin-left: 10px;
            margin-left: auto;
            margin-right: auto;

            // https://ithelp.ithome.com.tw/articles/10211068
            //justify-content: space-around;

        }

        .fDiv {
            width:336px;
            margin-left: 5px;
        }

        .wThumb {
            height:252px;
            background-color: #1f262e;
            position:relative;

        }

        .wThumb .corner {
            display:none;
        }

        /* https://stackoverflow.com/questions/23985018/simple-css-animation-loop-fading-in-out-loading-text */
        @keyframes fadeIn {
            from { opacity: 0; }
        }

        .wThumb:hover .corner {
            display:inline-block;
            animation: fadeIn 0.5s
        }

        .corner {
            z-index: 5;
        }

        .wLeftTop {
            display: inline;
            position: absolute;
            left: 2px;
            top: 0px;
        }

        .wLeftBottom {
            display: inline;
            position: absolute;
            left: 2px;
            bottom: 2px;
        }

        .wRightBottom {
            display: inline;
            position: absolute;
            right: 5px;
            bottom: 1px;
        }

        .wCenterCenter {
            display: inline;
            position: absolute;
            top: 50%;
            left: 50%;
            right: 50%;
            bottom: 50%;
        }

        .wRightTop {
            display: inline;
            position: absolute;
            right: 5px;
            top: 5px;
        }

        .wThumb img {
            z-index: 3;
            border: 0px solid red;
            padding: 5px;
            /*border-bottom-left-radius: 10px 10px;*/
            border-radius: 25px;
        }

        .wThumb span.fa {
            width: 24px;
            height: 24px;
            display:none;
        }

        .fa-exclamation {
            color: lightpink;
        }

        .fa-check {
            color: lightgreen;
        }

        .fa-times-circle {
            color: darkred;
        }

        .fOpacity:hover {
            opacity: 1.0
        }

        .fOpacity {
            opacity: 0.6;
        }

        .search-container {
            border:1px solid teal;
            box-shadow:10px 10px 8px 10px #111;
            margin:20px;
            padding:20px;
        }
        .search-container a {
            color:yellow !important;
        }

        .search-container .wInfo {
            color:#67d781;
            font-weight:bold;
        }

        .wThumbImg2 {
            max-width:500px;
            max-height:500px;
        }

        .search-container .wInfo[dType="description"] {
            color: 1fd1ed !important;
            font-weight:bold;
        }

        /* https://stackoverflow.com/a/13356401 */
        div.centerImageUrl {
            display: none;
            width: 100%;
            height: 100%;
            background-color: black;

            /* position: absolute; */
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
            margin: auto;

            background-repeat: no-repeat;
            background-size: contain;
            background-position: center top;
        }

    </style>
    `);

    let [favWorlds0, err00] = await getAPI("worlds/favorites/?n=100&offset=0");     $("#GFoW_Status").html(" 1 / 5");
    let [favWorlds1, err10] = await getAPI("worlds/favorites/?n=100&offset=100");   $("#GFoW_Status").html(" 2 / 5");
    let worldsAllData       = favWorlds0.concat(favWorlds1);
    LogInfo("GetFavOfWorlds worldsAllData:", worldsAllData.length);

    //let [worldsFav0, err]= await getAPI("favorites/?type=world&n=100&tags=worlds0");
    //https://github.com/cssmagic/CSS-Secrets/issues/11
    let FavTempAll         = {};
    let [groupData , errG] = await getAPI("favorite/groups?type=world");            $("#GFoW_Status").html(" 3 / 5");
    LogInfo("GetFavOfWorlds groupData:", groupData.length);
    let [worldsFav0, err0] = await getAPI("favorites/?type=world&n=100&offset=0");  $("#GFoW_Status").html(" 4 / 5");
    let [worldsFav1, err1] = await getAPI("favorites/?type=world&n=100&offset=100");$("#GFoW_Status").html(" 5 / 5");
    let worldsAll          = worldsFav0.concat(worldsFav1);
    LogInfo("GetFavOfWorlds worldsAll:", worldsAll.length);
    //console.error(groupData.filter(val => val.type == "world"), worldsAll);

    let groupList = {
         worlds0: { dis: "worlds0", cnt: -1, status: "none?" }
      //,worlds1: { dis: "worlds1", cnt: -1, status: "none?" } // canceled by VRC?
        ,worlds2: { dis: "worlds2", cnt: -1, status: "none?" }
        ,worlds3: { dis: "worlds3", cnt: -1, status: "none?" }
        ,worlds4: { dis: "worlds4", cnt: -1, status: "none?" }
    };

    LogInfo("GetFavOfWorlds worldsAll&groupData with TAG...");
    $.each(groupData.concat(worldsAll),function(i, v){
        let worldTag = v.tags[0] || v.name || "TagNameError";
        groupList[worldTag]             = groupList[worldTag]   || { tag: worldTag, cnt: 0, status: "none?" };
        groupList[worldTag]["dis"]      = v.displayName         || groupList[worldTag]["dis"];
        groupList[worldTag]["status"]   = v.visibility          || groupList[worldTag]["status"] || "none?";
        groupList[worldTag]["cnt"]++
    })

    LogInfo("GetFavOfWorlds groupList appending...");
    $.each(groupList,function(k, v){
        let rowName  = v["dis"];
        let worldTag = k;
        let worldCnt = v["cnt"];
        let status   = v["status"];
        // card-body
        $("body").append(`
            <h3><font>
                    <span title="${status}" aria-hidden="true" class="fa fa-user-shield wRStatus" data-status="${status}"></span>
                    ${worldTag} => 32 /
                    <font class="wTagNum" id="num_${worldTag}" data-wTagNum="${worldCnt}">${worldCnt}</font>
                </font>
                <div class="card bg-primary wRowTitle n-size wRStatus" data-status="${status}" wTag="${worldTag}">
                    <font color="#8143E6" align="center"><b>${rowName}</b></font>
                </div>
            </h3>
            <div class="worldRow" id="${worldTag}" style="display:none;"></div>
        `)
    });

    $(".wRowTitle").click(function(){  $("#" + $(this).attr("wTag")).slideToggle("fast");  });

    LogInfo("GetFavOfWorlds worldsAll listing..");
    //$.each(worldsAll,function(i, v){
    $.each(worldsAllData,function(i, v){
        let favId    = v.favoriteId;
        //let worldTag = v.tags[0] || "TagNameError";
        let worldId  = v.id;
        let worldTag = worldsAll.find(o => o.id === v.favoriteId).tags[0] || "TagNameError";

        $(`#${worldTag}`).append(`
        <div class="fDiv" fid="${favId}" wid="${worldId}">
            <div class="wThumb">
                <div class="corner wLeftTop fa-2x">
                    <a class="wLink" target="_blank" href="/home/world/${worldId}">
                        <i class="fas fa-home"></i>
                    </a>
                    <!--
                    <i class="fas fa-info-circle"></i>
                    -->
                </div>
                <div class="corner wLeftBottom fa-2x">
                    <!--
                    <i class="fas fa-rocket"></i>
                    <i class="fas fa-swatchbook pointer"></i>
                    -->
                </div>
                <div class="corner wRightBottom fa-2x">
                    <!--
                    <i class="fas fa-minus-square pointer" style="color:#FF7B42;background-color:black;border: 1px solid #FF7B42;"></i>
                    -->
                    <i class="fas fa-trash pointer" style="color:#FF7B42;"></i>
                </div>
                <div class="corner wRightTop fa-2x">
                    <span class="badge badge-secondary">
                        <span aria-hidden="true" class="fa fa-exclamation"></span>
                        <span aria-hidden="true" class="fa fa-check"></span>
                        <span aria-hidden="true" class="fa fa-times-circle"></span>
                    </span>
                </div>
                <img class="wThumbImg w-size" src="${v.thumbnailImageUrl}"/>
            </div>
            <div class="wName" style="position:relative;height:50px;">
                <!--Processing...<br>${favId}-->
                ${v.name}
            </div>
        </div>
        `);

        // https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes
        $(`#${worldTag}`).append(`
        <div class="search-container row" fid="${favId}" style="display:none;">
            <div class="col-12 col-md-4">
                <!--
                <a class="wLink" target="_blank" href="/home/world/${worldId}">
                    <img class="wThumbImg wThumbImg2 w-100" src="" big="">
                </a>
                -->
                <img class="wThumbImg wThumbImg2 w-100" src="${v.thumbnailImageUrl}" big="${v.imageUrl || v.thumbnailImageUrl}">
            </div>
            <div class="col-12 col-md-8">
                <h4>
                    <a class="wInfo wLink" dType="name" target="_blank" href="/home/world/${worldId}">${v.name}</a>&nbsp;<small>— &nbsp;
                    <a class="wiUser wInfo" dType="authorName" target="_blank">${v.authorName}</a></small>
                </h4>
                <div class="row">
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-user"></span>
                            &nbsp;Players</h6>
                        <span class="wInfo" dType="occupants">${v.occupants || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-star"></span>
                            &nbsp;Favorites</h6>
                        <span class="wInfo" dType="favorites">${v.favorites || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-thermometer-empty"></span>
                            &nbsp;Heat</h6>
                        <span class="wInfo" dType="heat">-----</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-award"></span>
                            &nbsp;Popularity(聲望)</h6>
                        <span class="wInfo" dType="popularity">${v.popularity || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-eye"></span>
                            &nbsp;Visits</h6>
                        <span class="wInfo" dType="visits">${v.visits || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-users"></span>
                            &nbsp;Capacity</h6>
                        <span class="wInfo" dType="capacity">${v.capacity || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-plus-square"></span>
                            &nbsp; Created</h6>
                        <span class="wInfo" dType="created_at">？</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span title="Published" aria-hidden="true" class="fa fa-bullhorn"></span>
                            &nbsp; Published</h6>
                        <span class="wInfo" dType="publicationDate">？</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span aria-hidden="true" class="fa fa-plus-square"></span>
                            &nbsp; Updated</h6>
                        <span class="wInfo" dType="updated_at">？</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span title="Lab Published" aria-hidden="true" class="fa fa-bullhorn"></span>
                            &nbsp; Lab Published</h6>
                        <span class="wInfo" dType="labsPublicationDate">？</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span title="Version" aria-hidden="true" class="fa fa-code-branch"></span>
                            &nbsp; version</h6>
                        <span class="wInfo" dType="version">${v.version || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span title="Release" aria-hidden="true" class="fa fa-user-shield"></span>
                            &nbsp; Release</h6>
                        <span class="wInfo" dType="releaseStatus">${v.releaseStatus || "none"}</span>
                    </div>
                    <div class="col-4 col-sm-3 col-md-3">
                        <h6><span title="Release" aria-hidden="true" class="fa fa-play-circle"></span>
                            &nbsp; Youtube Trailer</h6>
                        <span class="wInfo" dType="previewYoutubeId">？</span>
                    </div>

                    <!-------------------------------------------------------
                    <div class="col-12 col-sm-6 col-md-6">
                        <p class="tags">
                        <span>
                            <span class="badge badge-secondary">
                            <a href="/home/search/tag:content_featured"><span title="content_featured" aria-hidden="true" class="fa fa-hashtag">
                        </span> &nbsp;content_featured</a>
                        </span>&nbsp;</span>
                        </p>
                    </div>
                    --------------------------------------------------------->

                </div>
                <div class="row"><p class="wInfo" dType="description"></p></div>
            </div>
        </div>
        `);

        $("img.wThumbImg2").click(function(){
            let imageSrc = $(this).attr("big");
            $("div.centerImageUrl").css("background-image",`url('${imageSrc}')`).fadeIn("fast");
        });

        $(`.fdiv[fid="${favId}"] div.wThumb:eq(0) img:eq(0)`).click(function(){
            $(`.search-container[fid!="${favId}"]`).hide("fast");
            $(`.search-container[fid="${favId}"]:eq(0)`).toggle("fast");
        });


        /*
        if(!worldId){
            getAPI(`favorites/${favId}`).then(async function(value){ value = value[0];
                if(!value.favoriteId){
                    console.error("value.favoriteId: ", value.favoriteId);
                    return;
                }

                $(`.search-container[fid="${favId}"] .wLink`).attr("href","/home/world/" + value.favoriteId);
                $(`.fDiv[fid="${favId}"] .wLink:eq(0)`).attr("href","/home/world/" + value.favoriteId);
                $(`.fDiv[fid="${favId}"]  img:eq(0)`).addClass("fOpacity");

                let wData = await getWorldData(value.favoriteId);
                if(!wData){
                    $(`.fdiv[fid="${favId}"] .fa-times-circle`).css("display","inline-block");
                    //$(`.fDiv[fid="${favId}"] .wThumb:eq(0)`).css("background-color","#798897");
                    $(`.fDiv[fid="${favId}"] .wThumb:eq(0)`).css("background-color","black");
                    $(`.fdiv[fid="${favId}"] div.wname:eq(0)`).html(`
                        <font color="red"><b>Not Available ( Deleted )</b></font> =>
                        <a target="_blank" href="https://www.google.com/search?q=site:www.vrcw.net ${value.favoriteId}">
                                Search on Google
                           </a>
                    `);
                } else {
                    $(`.fdiv[fid="${favId}"] .fa-exclamation`).css("display", "inline-block");
                    $(`.fDiv[fid="${favId}"] .wThumb:eq(0)`).css("background-color", "lightpink");
                    $(`.fdiv[fid="${favId}"] div.wname:eq(0)`).css("font-weight", "bold").css("color","lightpink")
                }
            })
            return;
        }

        getWorldData(worldId);
        async function getWorldData(worldNewId){ if(!worldNewId) return null;
        return await getAPI(`worlds/${worldNewId}`).then(value => { if( !value || !value[0] || value[1] ) return null;
            value = value[0];
            FavTempAll[favId] = value;
            //console.error(worldNewId);
            //console.error(value);
            //console.error(value.thumbnailImageUrl, value.name)

            let worldThumb = value.thumbnailImageUrl;
            let worldName  = value.name;
            $(`.fdiv[fid="${favId}"] img.wThumbImg`).attr("src",worldThumb);
            $(`.fdiv[fid="${favId}"] div.wname:eq(0)`).html(`${worldName}`);
            if(value.releaseStatus == "public"){
                //$(`.fdiv[fid="${favId}"] .fa-check`).css("display","inline-block");
                $(`.fdiv[fid="${favId}"] span.badge`).hide();
            }

            $(`.search-container[fid="${favId}"] img.wThumbImg`)
                .attr("src",worldThumb)
                .attr("big",value.imageUrl);
            $(`.search-container[fid="${favId}"] .wiUser`).attr("href","/home/user/" + value.authorId);
            $(`.search-container[fid="${favId}"] .wInfo`).each(function(){
                let dataTag  = value[ $(this).attr("dType") ] || null;
                let dataTime =
                    /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d.\d[0-9]+?Z/
                        .test(dataTag)
                            ? moment(dataTag).format("YYYY-MM-DD _ HH:mm:ss") + "<br>" + moment(dataTag).fromNow()
                            : null;
                let DataLink = ( $(this).attr("dType") == "previewYoutubeId" && dataTag && dataTag.length > 0 )
                        ? `<a target="_blank" href="https://youtu.be/${dataTag}">Youtube Link</a>`
                        : null

                $(this).html(dataTime || DataLink || dataTag || "-");
            });

            let heatFire = (value.heat || 0);
            for(let i = 0; i < value.heat || 0; i++){
                heatFire = heatFire + ( (i == 0 && value.heat > 0) ? "：":"" );
                heatFire = heatFire + `<span aria-hidden="true" class="fa fa-fire"></span>`;
            }
            $(`.search-container[fid="${favId}"] .wInfo[dType="heat"]`).html(heatFire);

            return value;
        });
        }
        //return false;
        */
    });

    $("body").append("<h3><br>-</h3><br>");
    $("#wLoading").effect( "blind", "slow" );

    let DeleteDialog = `
    <div id="dialog-confirm" title="Delete this favorited ITEM?"><p>
      <span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>
      Are you sure delete this item?
    </p></div>`;

    $(".fa-trash").click(function(){
        let trash = this;
        $(DeleteDialog).dialog({
            resizable: false, height: "auto", width: 400, modal: true,
            //position: { my: "center", at: "center", of: trash },
            position: { my: "right top", at: "right bottom", of: trash },
            buttons: { "Delete It！": function() {
                $( this ).dialog( "close" );
                DeleteFav($(trash).parents("div.fDiv:eq(0)").attr("fid"));
            }, Cancel: function() { $( this ).dialog( "close" ); }}
        });
    });

    function DeleteFav(favId){
        $(`.fdiv[fid="${favId}"]`).css("opacity","0.3");
        getAPI(`favorites/${favId}`, {method: "DELETE" } ).then(value => {
            if(!value[0]){
                console.error(value);
                alert("Error!")
                return;
            }
            $(`.fdiv[fid="${favId}"]`).hide("slow");
            //alert(value[0]["success"]["message"]);
        });
    }
}

async function getAPI(url, header){
    let err2 = null;
    header   = Object.assign(header || {}, { credentials: 'same-origin' });
    return [await fetch("/api/1/" + url, header)
        .then(async response => response.ok
            ? response.json().then(value => { return value; })
            : ( async function(){
                err2 = response.clone(); // Avoid reader once limit : https://stackoverflow.com/a/54115314
                console.error(`Promise.reject: ${response.status} ${response.statusText}\n${await response.text()}`);
                return;
            })()
        ), err2];
}

// 取得網址標記
function getQueryString( paramName,paramURL){
	if(paramURL     == undefined) paramURL = window.location.href;

	paramName       = paramName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]").toLowerCase();
	var reg         = "[\\?&]"+paramName +"=([^&#]*)";
	var regex       = new RegExp( reg );
	var regResults  = regex.exec( paramURL.toLowerCase());
	if( regResults  == null )
            return "";
	else    return regResults [1];
}

// 確認資料是不是json  https://stackoverflow.com/a/25416299
function isJSON(MyTestStr){
    try {
        var MyJSON = JSON.stringify(MyTestStr);
        var json = JSON.parse(MyJSON);
        if(typeof(MyTestStr) == 'string')
            if(MyTestStr.length == 0)
                return false;
    }
    catch(e){ return false; }
    return true;
}

function RunOnce(element, className, callback){
    if(!$(element).length || $(element).hasClass(className) || $(element).hasClass("lone_ignore")) return;
        $(element).addClass(className);
    callback.apply(this, [element, className]);
}

// https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function regexUnityID(typeID,text){
    if(typeID == null || typeID == "" ) return null;
    var regexUID = new RegExp("(" + typeID + "_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})");
    var result   = regexUID.exec(text,"gm");
    if(result) return result[1];
    return null;
}

// https://stackoverflow.com/a/18786024
function GetWidthPercentage(e){ return $(e).width() / $(e).parent().width() * 100; }


/*
LoadFormatText("textfor%1 to %2 + ?=%3",{
	"%1":"ccc",
	"%2":"ccc2",
	"%3":"ccc3",
	"file":"local/readme.js"
},function(data){
	//console.error(JSON.stringify(data))
})

var sun = LoadFormatText("%posg + %1 + 5421",{
	"%1":"ccc",
	"%2":"ccc2",
	"%3":"ccc3",
	"%posg":"fuckyou"
})
console.error(JSON.stringify(sun.out))
*/
function LoadFormatText(Source,data,callback){
	if(data.file && !data.queried){
		LoadLocalTextFile2(data.file,function(fText){ 		//取得本地檔案內容
			data.queried = true								//設定已取得檔案內容
			LoadFormatText(fText,data,function(fTextNew){ 	//執行一次字串格式化
				callback.apply(this, [fTextNew]);			//異步回傳資料
			})
		})
	}
	else {
		data.src	= Source								//備份原始字串
		var object 	= Object.keys(data)						//取得每個元素標題
		for(var i = 0;i < object.length;i++){
			var RepTXT = data[object[i]]
			if(!data.ignoreSymbol && !object[i].match("%")) continue;   //跳過非替代內容
			else if(RepTXT == undefined) RepTXT = "undefined"
			else if(typeof(RepTXT) == "number" && isNaN(RepTXT)) RepTXT = "NaN"
            RepTXT = ("" + RepTXT).replace(new RegExp("%RepSrc%","gm"),object[i]);
			Source = Source.replace(new RegExp(object[i],"gm"),RepTXT);
			//console.error(object[i] + " : " + data[object[i]]);
		}
		//console.error(Source);
		data.out = Source;
		if(callback) callback.apply(this, [data]);
		return data;
	}
}

// https://stackoverflow.com/a/6116502
function GetTrusted(levels){
    var ret = [null,null];
    $.each(TrustedData, function(key, value) {
        if ( $.inArray(key, levels) > -1 ){
            ret = value;
            return false;
        }
    })
    return ret;
}

function GetRoomType(location){
    var ret = RoomType["~pub"];
    $.each(RoomType, function(key, value) {
        if(location.match(key)){
            ret = value;
            return false;
        }
    })
    return ret;
}

// https://stackoverflow.com/a/15734408
$.widget("ui.tooltip", $.ui.tooltip, {
    options: {
        content: function () {
            return $(this).prop('title');
        }
    }
});

// https://stackoverflow.com/a/29622653
function sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function GetTMRes(name, replace){
    return GM_getResourceURL(name)
            .replace("data:application;",replace || "data:application;");
}

function ColorChroma(unity_id){
    var code = /_([0-9a-f]){8}-([0-9a-f]){4}-([0-9a-f]){4}-([0-9a-f]){4}-([0-9a-f])([0-9a-f]){11}/g.exec(unity_id)
        code = code || ["","efe2dc"]
        code.shift();
        code = "#" + code.toString().replace(/,/gm,"");
    return chroma(code).brighten(1);
}

function ajaxFail( xhr, status, error ){
    console.error([xhr, status, error]);
    console.error(JSON.stringify(xhr.responseJSON, null, 4));
    alert(JSON.stringify(xhr.responseJSON.error, null, 4));
}

// https://blog.camel2243.com/2016/06/18/javascript-sleep%E5%87%BD%E6%95%B8%E5%AF%A6%E4%BD%9C/
async function sleep(ms = 0) { return new Promise(r => setTimeout(r, ms)); }

// https://codereview.stackexchange.com/a/37533
function getByteCount( s ){
    var count = 0, stringLength = s.length, i;
    s = String( s || "" );
    for( i = 0 ; i < stringLength ; i++ ){
        var partCount = encodeURI( s[i] ).split("%").length;
        count += partCount==1?1:partCount-1;
    }
    return count;
}

// https://stackoverflow.com/questions/7505623/colors-in-javascript-console/42551926#42551926
// https://stackoverflow.com/questions/676721/calling-dynamic-function-with-dynamic-parameters-in-javascript
function LogInfo( ...infoText ){ console.info("%c VRChatLittleONE", "color:DodgerBlue", ...infoText); }

function InsertCustomCSS(){
    $("head").append(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pushy/1.3.0/css/pushy.min.css" type="text/css">`);

    if(!$(`link[rel="icon"]`).length)
        $("head").append(`<link rel="icon" href="https://assets.vrchat.com/www/images/favicon.png">`);



    // https://www.cnblogs.com/pigtail/archive/2013/03/11/2953848.html
    document.head.insertAdjacentHTML('beforeend', `<style>
    /* https://stackoverflow.com/a/4407335 */
    .noselect {
      -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
         -khtml-user-select: none; /* Konqueror HTML */
           -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome and Opera */
    }

    .pointer { cursor: pointer ; }
    .n-size  { cursor: n-resize; }
    .w-size  { cursor: w-resize; }

    div.WorldsWithFriends .friend-row li {
        list-style-type: none !important;
    }

    div.WorldsWithFriends .friend-row a {
        display: unset;
    }

    div.WorldsWithFriends h3 {
        text-transform: unset;
    }

    h2, h3 {
        text-transform: unset !important;
    }

    div.WorldsWithFriends div.template_world div.col-md-4 {
        flex: unset !important;
        max-width: unset !important;
    }

    div.WorldsWithFriends div.template_world div.friend-caption.text-success {
        /* margin-left: 125px !important; */
        min-width: max-content;padding:.5rem !important;
        font-size: 20px !important;
    }

    .Lone_wrld_badge {
        float       :right;
        color       :lightgreen;
        font-weight :bold;
    }

    a.Lone_room_people_counter {
        /* vertical-align:middle; */
        position:absolute;
        right   :170px;
        top     :126px;
    }

    a.Lone_room_private_counter {
        right   :268px;
        top     :198px;
    }

    a.Lone_room_createdBy {
        vertical-align:top;
        font-size: 15px;
        top: 44px;
        position: absolute;
        right: 208px;
    }

    a.Lone_room_createdBy_btn {
        vertical-align:top;
        font-size:10px;
        background:#1a2026 linear-gradient(180deg, #1a2026, #1a2026) repeat-x;
    }

    div.Lone_private_room a.Lone_room_createdBy,
    div.Lone_private_room a.Lone_room_createdBy_btn,
    a.Lone_room_createdBy[CreatedBy='NoOwner'],
    a.Lone_room_createdBy_btn[CreatedBy='NoOwner']
    {
        display:none;
    }

    /* https://www.w3schools.com/howto/howto_css_image_effects.asp */
    img.blur {
        -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
        filter: blur(5px);
    }

    img.Lone_wrld_img {
        width:150px;
        height:115px;
        opacity:0.3;
    }

    .Lone_world_room_people:hover {
        color:white !important;
        -webkit-filter: blur(1px); /* Safari 6.0 - 9.0 */
        filter: blur(1px);
    }

    /* https://stackoverflow.com/questions/12956586/width-of-jquery-ui-tooltip-widget */
    .ui-tooltip {
        max-width: 500px !important;
    }

    /* 左邊欄縮略 */
    /* https://stackoverflow.com/questions/7839164/is-there-a-css-cross-browser-value-for-width-moz-fit-content */
    div.container-fluid div.bg-gradient-secondary.leftbar:first-child {
        width: fit-content;      /* chrome  */
        width: -moz-fit-content; /* firefox */
    }

    /* 去除瀏覽器垂直捲動條 */
    /* https://www.reddit.com/r/FirefoxCSS/comments/8ka8jd/hide_scrollbar_firefox_60/ */
    browser {
        margin-bottom: -17px !important;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    </style>`);
}
//=================
// %appdata%/../locallow/VRChat

// https://stackoverflow.com/questions/3680429/click-through-a-div-to-underlying-elements

/*
            // https://stackoverflow.com/a/8054797
            // https://stackoverflow.com/a/1553727
            // http://api.jquery.com/category/events/event-object/
            $('*').click(function(event) {
                if (this === event.currentTarget) { // only fire this handler on the original element
                    event.stopImmediatePropagation();
                    console.error($(event.target).attr("href"));
                }
            });
            */

// https://gist.github.com/roselan/3176700
(function( $ ){
  $.fn.observe = function( callback, options ) {

    var settings = $.extend( {
            attributes   : true,
            childList    : true,
            characterData: true
        },
        options );

    return this.each(function() {
        var self = this,
            observer,
            MutationObserver = window.MutationObserver       ||
                               window.WebKitMutationObserver ||
                               window.MozMutationObserver;

        if (MutationObserver && callback) {
            observer = new MutationObserver(function(mutations) {
                callback.call(self, mutations);
            });
            observer.observe(this, settings);
        }
    });
  };
})( jQuery );

// https://stackoverflow.com/questions/23984629/how-to-set-min-font-size-in-css
// https://www.bestcssbuttongenerator.com/
// ES
// https://juejin.im/post/5b2a186cf265da596d04a648
// https://medium.com/@peterchang_82818/es6-10-features-javascript-developer-must-know-98b9782bef44
// https://zi.media/@yidianzixun/post/pW8JXi
// https://blog.camel2243.com/2016/06/18/javascript-sleep%E5%87%BD%E6%95%B8%E5%AF%A6%E4%BD%9C/
// http://es6.ruanyifeng.com/#docs/async

// Day 05: ES6篇 - let與const
// https://ithelp.ithome.com.tw/articles/10185142
// http://es6.ruanyifeng.com/#docs/let

// ECMA 6
// http://es6.ruanyifeng.com/#docs/string#%E5%AE%9E%E4%BE%8B%EF%BC%9A%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91

// 鐵人賽：ES6 原生 Fetch 遠端資料方法
// https://wcc723.github.io/javascript/2017/12/28/javascript-fetch/
function compile(template){
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}