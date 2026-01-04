// ==UserScript==
// @name         VRChat BigPUG
// @version      0.10
// @description  VRChat
// @author       NoNameNoWings
// @include      /.*?:\/\/.*?vrchat.*?\..*?(home|launch|api).*?/
// @include      /.*?:\/\/.*?vrchat.*?\..*?(bigpug).*?/
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/json.min.js
// @resource     JqueryUIcss    https://code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css
// @resource     obsidian       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/obsidian.min.css
// @icon         https://assets.vrchat.com/www/images/favicon.png
// @namespace    https://greasyfork.org/users/43385
// @downloadURL https://update.greasyfork.org/scripts/379599/VRChat%20BigPUG.user.js
// @updateURL https://update.greasyfork.org/scripts/379599/VRChat%20BigPUG.meta.js
// ==/UserScript==
//hljs.configure({ useBR: false });
var url = window.location.href;

MainStart();
function MainStart(){
         if(url.match("\/launch\?")) LaunchPage();
    else if(url.match("\/home.?"))   HomePage();
    else if(url.match("\/api.?"))    ApiPage();
    
    if(url.match("bigpug"))          MainPage();
}

function MainPage(){
    $("head").append("<title>BigPUG Maintain</title>");
    $("head").append(`<link rel="Shortcut Icon" type="image/x-icon" href="https://assets.vrchat.com/www/images/favicon.png" />`);
    $('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("JqueryUIcss") + '" type="text/css" />');
     
    $("body").html(`
<div id="tabs">
  <ul>
    <li><a href="#tabs-1">Self Data</a></li>
    <li><a href="#tabs-2">Avatars</a></li>
    <li><a href="#tabs-3">Misc</a></li>
  </ul>
  <div id="tabs-1">
    <br><a href="/api/1/config" target="_blank">Remote Config</a>
    <br>
    <br><a href="/api/1/auth/user" target="_blank">檢視個人資料</a>
    <br>
    <br><a href="/api/1/avatars/favorites?n=100" target="_blank">檢視角色收藏</a>
    <br>
    <br><a href="javascript:void();" id="SaveCurrentAvatar">儲存當前Avatar</a>
        <a id="SaveCurrentAvatarStatus"></a>
  </div>
  <div id="tabs-2">
    <br><a href="javascript:void();" target="_blank" id="LoadAvatarList">載入Avatar列表</a>
    <br><div id="AvatarListData"></div>
  </div>
  <div id="tabs-3">
    <br><a href="javascript:void();" target="_blank" id="ShowUserAvatars">載入使用者公開角色</a>
        <input type="text" name="" style="width:30%" id="ShowUserAvatarsByID">
  </div>
</div>`); $( "#tabs" ).tabs();
    
    $("#SaveCurrentAvatar").click(async function(){
        $("#SaveCurrentAvatarStatus").html("... 載入使用者資訊");
        let UserData    = JSON.parse( await LoadUserData() );
        //console.error(UserData);
        
        $("#SaveCurrentAvatarStatus").html("... 載入Avatar資訊");
        let AvatarData  = JSON.parse( await LoadAvatarData( UserData.currentAvatar) );
        //console.error(AvatarData);
        
        $("#SaveCurrentAvatarStatus").html("... 正在儲存");
        let AvatarListData = GM_getValue("AvatarListData",{});
        AvatarListData[UserData.currentAvatar] = AvatarData;
        
        GM_setValue("AvatarListData",AvatarListData);
        $("#SaveCurrentAvatarStatus").html("... 儲存完畢");
        //console.error(AvatarListData);
    })
    
    $("#LoadAvatarList").click(function(){
        let json_Stringified = JSON.stringify(GM_getValue("AvatarListData",{}), null, 2);
        $("#AvatarListData").html(`<pre><code class="json">` + json_Stringified + `</code></pre>`);
        
        $.each($("pre code"),function(i, val){
            hljs.highlightBlock(val);
            HighLightedCodeStyle();
        })
    })
    
    $("#ShowUserAvatars").click(function(){
        let ShowUserAvatarsByID = $("#ShowUserAvatarsByID").val();
        if(!ShowUserAvatarsByID || ShowUserAvatarsByID.length == 0) return;
        window.open("/api/1/avatars?sort=updated&n=100&offset=0&order=descending&releaseStatus=public&userId=" + ShowUserAvatarsByID);
    });
}

async function LoadUserData(){
    return await fetch('/api/1/auth/user', {credentials: 'same-origin'}).then(function(response){
        return response.text();
    });
}

async function LoadAvatarData(avatarID){
    return await fetch('/api/1/avatars/' + avatarID, {credentials: 'same-origin'}).then(function(response){
        return response.text();
    });
}

// https://highlightjs.org/usage/
function ApiPage(){ if(!isJSON($("body").html())) return;
    $("body").css({"backgroundColor":"black", "color":"white"});
    
    //$('head').append("<style>" + GM_getResourceText("obsidian") + "</style>");
    $('head').append('<link rel="stylesheet" href="' + GM_getResourceURL("obsidian") + '" type="text/css" />');
    
    var json = JSON.parse($("body").text());
    var json_Stringified = JSON.stringify(json, null, 2);
    
    console.info(""); console.error(json); console.info("");
    
    $("body").html('<pre><code class="json">' + json_Stringified + '</code></pre>');
    //hljs.initHighlightingOnLoad();
    
    $(document).ready(function() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    });
    
    var inter_hljs = setInterval(function(){
        if($("span.hljs-string").length){
            clearInterval(inter_hljs);
            HighLightedCodeStyle();
            AvatarSet();
            AvatarAddToFavorites();
            FavoritesDelete();
            WorldFav();
            JumpPage();
        }
    }, 100);
    
    function JumpPage(){ if(!url.match("\&n\=") && !url.match("\?n\=")) return;
        let n       = parseInt(getQueryString("n", url));
        let offset  = parseInt(getQueryString("offset", url));
        let offsetPrev = offset - n;
        let offsetNext = (offset || 0) + n;
        
        let PrevPage = UpdateQueryString("offset", (offsetPrev < 0 ? 0:offsetPrev), url);
        let NextPage = UpdateQueryString("offset", offsetNext, url);
        if(offset > 0) 
            $("body").append(`<a href="${PrevPage}">上一頁</a>`);
            $("body").append(`<a href="${NextPage}">下一頁</a>`);
    }
    
    // https://vrchatapi.github.io/#/AvatarAPI/ChooseAvatar
    function AvatarSet(){ if(!url.match("\/avatars\/")) return;
        //$("body").prepend('<div style="text-align: center;"><img src="' + json.thumbnailImageUrl + '"></div>');
        $("body").append('<input id="AvatarSetByID" type="button" value="使用此 Avatar">');
        $("#AvatarSetByID").click(function(){ SetAvatarByID(json.id); });
    }
    
    function WorldFav(){ if(!url.match("\/worlds\/")) return;
        $("body").append('<input id="WorldFav" type="button" value="收藏地圖世界">');
        $("#WorldFav").click(function(){ WorldFavFunc(json.id); });
    }
    
    // https://vrchatapi.github.io/#/FavoritesAPI/AddFavorite
    function AvatarAddToFavorites(){ if(!url.match("\/avatars\/")) return;
        $("body").append('<input id="AvatarAddToFavorites" type="button" value="加入最愛 Avatar">');
        
        $("#AvatarAddToFavorites").click(function(){
            $("#AvatarAdd").remove();
            
            $.post( "/api/1/favorites",{ type: "avatar", favoriteId: json.id, tags:"avatars1" })
            .done(function( html ){ console.error(html);
                //var json = JSON.parse(html);
                
                var json_Stringified = JSON.stringify(html, null, 2);
                //var json_Stringified = html;
                $("body").append('<div id="AvatarAdd"><div style="text-align: center;"><img src="' + html.currentAvatarThumbnailImageUrl + '"></div></a><pre><code class="json" id="AvatarAddRes">' + json_Stringified + '</code></pre></div>');
                
                hljs.highlightBlock($("#AvatarAddRes:eq(0)")[0]);
                HighLightedCodeStyle();
            }).fail(function( xhr, status, error ) { 
                console.error(xhr);
                console.error(JSON.stringify(xhr.responseJSON, null, 4));
                alert(JSON.stringify(xhr.responseJSON.error, null, 4));
            })
        })
    }
    
    // https://vrchatapi.github.io/#/FavoritesAPI/DeleteFavorite
    function FavoritesDelete(){ if(!url.match("\/favorites\/fvrt_")) return;
        $("body").append('<input id="FavoritesRemove" type="button" value="移除本最愛項目">');
        
        $("#FavoritesRemove").click(function(){
            $("#FavoritesRemoveDIV").remove();
            
            if(!confirm("再次確認是否刪除本最愛項目")) return;
            
            $.ajax({
                url: "/api/1/favorites/" + json.id,
                type: "delete"
            }).done(function( html ) { console.error(html);
                //var json = JSON.parse(html);
                var json_Stringified = JSON.stringify(html, null, 2);
                
                $("body").append('<div id="FavoritesRemoveDIV"><pre><code class="json" id="FavoritesRemoveDIVFinish">' + json_Stringified + '</code></pre></div>');
                
                hljs.highlightBlock($("#FavoritesRemoveDIVFinish:eq(0)")[0]);
                HighLightedCodeStyle();
            });
        })
    }
}

function HighLightedCodeStyle(){
    function SetHREF(url,Text){
        if(!Text || Text == null) Text = url;
        return "\"<a style='color:#ec7600;' target='_blank' href='" + url + "'><b>" + Text + "</b></a>\"";
    }
    
    $("span.hljs-attr").each(function(index, value){
        var aText = $(this).html().toString().slice(1,-1);
        var sText = $(this).next("span.hljs-string").html();
        
        if(sText) 
                sText = sText.toString().slice(1,-1);
        else    return true;
        
        if(aText.match("^thumbnailImageUrl$")){
            $(`<br><img src="${sText}" />`).insertAfter($(this).next("span.hljs-string"));
        }
        //return false;
    });
    
    $("span.hljs-string").each(function(index, value){
        var Text = $(this).html().toString().slice(1,-1);
        // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        if(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(Text)){
            var LinkToImg = "";
            //if(Text.match(".jpg$") || Text.match(".png$")) LinkToImg = "<br><img src='" + Text + "'>";
            $(this).html(SetHREF(Text) + LinkToImg);
            //$(this).prev("span.hljs-attr").css("color","#DF0174");
        }
        else if(Text.match("^avtr_")){
            let Href = SetHREF("/api/1/avatars/" + Text,Text);
            $(this).html(`${Href} <a class="avtrAddFav pointer"><加入收藏></a><a class="avtrAddSave pointer" avtr="${Text}"><儲存></a>`);
            $(this).prev("span.hljs-attr").css("color","#9AFE2E");
        }
        else if(Text.match("^wrld_.+:") || Text.match("^world_.+:")){
            $(this).html(SetHREF("/api/1/worlds/" + Text.replace(":", "\/"),Text));
            $(this).prev("span.hljs-attr").css("color","#BD8DD7");
        }
        else if(Text.match("^wrld_") || Text.match("^world_") || Text.match("^wld_")){
            $(this).html(SetHREF("/api/1/worlds/" + Text,Text));
            $(this).prev("span.hljs-attr").css("color","#01A9DB");
        }
        else if(Text.match("^usr_")){
            $(this).html(SetHREF("/api/1/users/" + Text,Text) + ` <a class="pointer userPublicAvatar" user="${Text}"><公開角色></a>`);
            $(this).prev("span.hljs-attr").css("color","#AEB404");
        }
        else if(Text.match("^fvrt_")){
            $(this).html(SetHREF("/api/1/favorites/" + Text,Text));
            $(this).prev("span.hljs-attr").css("color","#BE81F7");
        }
        else if(Text.match("^steam_")){
            $(this).html(SetHREF("https://steamcommunity.com/profiles/" + Text.substring(6),Text));
            $(this).prev("span.hljs-attr").css("color","#A4A4A4");
        }
        else if(Text.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]+Z$")){
            var LocalTime = TimeLocalizerUTC(Text)
            $(this).html("\""
                + "<font color='white'>"    + LocalTime.split("T")[0]             + "</font>T"
                + "<font color='##ffcd22'>" + LocalTime.split("T")[1].slice(0,-1) + "</font>Z"
            + "\"");
            $(this).prev("span.hljs-attr").css("color","#93c763");
        }
        // Notification
        else if(Text.match("^not_")){
            $(this).html(SetHREF("/api/1/auth/user/notifications/" + Text,Text));
            $(this).prev("span.hljs-attr").css("color","#00cccc");
        }
        else if(Text.match("^Join me in ")){
            $(this).html("Join me in " + "<a style='color:#00cccc;'>" + Text.split(/^Join me in /)[1] + "</a>");
        }
        // Private world or avatar
        else if(Text.match("^private$") || Text.match("^hidden$")){
            $(this).html(`<font color="#FF4500"><b>${Text}</b></font>`);
            $(this).prev("span.hljs-attr").css("color","#FF4500");
        }
        
    })
    
    $(".avtrAddFav").click(function(){ avtrAddFav($(this).parent().html()); });
    $(".avtrAddSave").click(avtrSave);
    $(".userPublicAvatar").click(userPublicAvatar);
}

async function userPublicAvatar(){
    let userID = $(this).attr("user");
    window.open("/api/1/avatars?sort=updated&n=100&offset=0&order=descending&releaseStatus=public&userId=" + userID);
}

async function avtrSave(){
    let AvatarID = $(this).attr("avtr");
    
    ShowMSG("... 載入Avatar資訊");
    let AvatarData  = JSON.parse( await LoadAvatarData( AvatarID ) );
    //console.error(AvatarData);
    
    ShowMSG("... 正在儲存");
    let AvatarListData = GM_getValue("AvatarListData",{});
    AvatarListData[AvatarID] = AvatarData;
    
    GM_setValue("AvatarListData",AvatarListData);
    ShowMSG("... 儲存完畢");
    //console.error(AvatarListData);
    
}

function avtrAddFav(AvatarID){
    AvatarID = regexUnityID("avtr",AvatarID);
    $.post( "/api/1/favorites",{ type: "avatar", favoriteId: AvatarID, tags:"avatars1" })
    .done(function( html ){ console.error(html);
        alert("Favorited");
    }).fail(function( xhr, status, error ) { 
        console.error(xhr);
        console.error(JSON.stringify(xhr.responseJSON, null, 4));
        alert(JSON.stringify(xhr.responseJSON.error, null, 4));
    })
}

function SetAvatarByID(vrca){
    // https://api.vrchat.cloud/api/1/avatar/avtr_c0d0b0ac-3a29-4f5a-a6d4-3ef3c24c6d75/select
    //var vrca = prompt("請問尊姓大名？","");
    $("#AvatarSetting").remove();
    
    if(!confirm("再次確認是否更換Avatar.")) return
    
    $.ajax({
        url: "/api/1/avatars/" + vrca + "/select",
        type: "PUT"
    }).done(function( html ) { console.error(html);
        //var json = JSON.parse(html);
        var json_Stringified = JSON.stringify(html, null, 2);
        $("body").append('<div id="AvatarSetting"><div style="text-align: center;"><img src="' + html.currentAvatarThumbnailImageUrl + '"></div></a><pre><code class="json" id="AvatarSetFinish">' + json_Stringified + '</code></pre></div>');
        
        hljs.highlightBlock($("#AvatarSetFinish:eq(0)")[0]);
        HighLightedCodeStyle();
    }).fail(function( xhr, status, error ) { 
        console.error(status);
        console.error(error);
        alert("fail");
    })
}

// https://vrchatapi.github.io/#/FavoritesAPI/AddFavorite
function WorldFavFunc(id){
    if(!confirm("再次確認是否收藏")) return

    $.post( "/api/1/favorites/",{ type: "world", favoriteId: id })
    .done(function( html ) { console.error(html);
        alert("faved");
    }).fail(function( xhr, status, error ) { 
        console.error(status);
        console.error(error);
        console.error(xhr.responseJSON.error);
        alert("fail");
    })
}

// ===========================================================================================================

function HomePage(){ 
    setInterval(function(){
        MessageSender();
        RunOnce("div.card-body:eq(0)","NameToUserAPI",NameToUserAPI);
        
        RunOnce("div.home-content h3:contains('Instances'):eq(0)","WorldToAPI",WorldToAPI)
        RunOnce("a#jumpwarning","WorldToPostData",WorldToPostData);
        RunOnce("div.col-md-12 > span.badge.badge-secondary:eq(0)","WorldTypeColor",WorldTypeColor);
        /*
        if($("div.home-content:eq(0)").length)
            $("div.home-content:eq(0)").observe( function (mutations) { console.log(this, mutations); })
        //.addClass('yatta').append('<span>genki desu</span>');
        */
    },1000 * 0.4)
}

function WorldTypeColor(element){
    $("div.col-md-12 > span.badge.badge-secondary:eq(0)").each(function(){
        if($(this).html().match("Public"))
                $(this).css("color","lightgreen");
        else    $(this).css("color","LightPink");
    })
    
}

function WorldToPostData(element){
    var worldID = /(wrld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec($(element).attr("href"));
    var worldID2 = /(wld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec($(element).attr("href"));
    if(worldID2) worldID = worldID2;
    if(!worldID) return; 
    
    $(element).parent().find("code:contains('launch'):eq(0)").wrap(function(){
        return "<a target='_blank' href='" + $(this).html() + "'></a>";
    });
    
    $("div.col-8 > p > strong:contains('Invite your friends to join you with this link:'), br:eq(0)").remove();
    $("div.col-8 > p > br:eq(0)").remove();
    
    $(element).parent().find("p > em:eq(0)").parent().remove();
    
    $(element).clone().insertAfter($(element)).html("GetPostData").removeAttr("id").removeAttr("href")
    .click(function(){
        $.get( "/api/1/worlds/" + worldID[1]).done(function( html ){ //console.error(html);
            var Postdata = LoadFormatText(""
            + "<textarea style='width:100%;'>"
            +   "[url=https://www.vrchat.net/home/world/%wrld%][img=%image%?.jpg][/url]\n"
            +       "[url=https://www.vrchat.net/launch?worldId=%wrld%]%wrldName%[/url] "
            +       "[url=https://sssss]—[/url] "
            +       "[url=%vrcworldlistA%]by[/url] "
            +   "[url=https://www.vrchat.net/home/user/%usr%]%usrName%[/url]\n"
            +   "%wrldDes%"
            + "</textarea>"
            + "<br>VRCW：<a target='_blank' href='%vrcworldlistN%'>name</a>、"
            + "<a target='_blank' href='%vrcworldlistA%'>author</a>、"
            + "<a target='_blank' href='%vrcworldlistG%'>googleID</a>"
                ,{"%wrld%"         :worldID[1]
                , "%image%"        :html.imageUrl
                , "%wrldName%"     :html.name
                , "%usr%"          :html.authorId
                , "%usrName%"      :html.authorName
                , "%wrldDes%"      :html.description
                , "%vrcworldlistN%":"http://www.vrcworldlist.net/search?utf8=%E2%9C%93&keyword=" + encodeURI(html.name)
                , "%vrcworldlistA%":"http://www.vrcworldlist.net/search?utf8=%E2%9C%93&keyword=" + encodeURI(html.authorName)
                , "%vrcworldlistG%":""
                    + "https://www.google.com/search?q="
                    + "site:vrcworldlist.net " + worldID[1]
            }).out;
            //console.error(Postdata);
            $(element).parent().find("p:last").html(Postdata);
            
        })
    })
}

function WorldToAPI(){
    var worldID = /\/world\/(wrld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec(window.location.href);
    if(!worldID) return;
    
    var WorldNameTag    = $("div.home-content div.col-md-12 > h3:eq(0)");
    var textNode        = $(WorldNameTag).contents()
        .filter(function(){ return this.nodeType === 3; }).eq(0);
    var WorldName       = $(textNode).text();
    
    $(WorldNameTag).prepend("<a target='_blank' href='/api/1/worlds/" + worldID[1] + "'>" + WorldName + "</a>")
    $(textNode).replaceWith("");
}

function NameToUserAPI(){ //console.error("NameToUserAPI");
    var UserNameTag = $("div.home-content h2:eq(0)");
    var UserName    = $(UserNameTag).html();
    var UserID      = /\/user\/(usr_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec(window.location.href);
    if(!UserID) return;
    
    $(UserNameTag).html(""
        + "<a href='/api/1/users/" + UserID[1] + "' target='_blank'>"
        +   $(UserNameTag).html()
        + "</a>");
}

function MessageSender(){ //console.error("HomePageFunc");
    var UserID   = /^http.+?\/\/.+\/user\/(usr_.+)$/.exec(window.location.href);
    var UserCard = $("div.card.card-body.bg-primary");
    if(UserID == null 
    ||  UserID.length <= 1 
    || !$(UserCard).length 
    ||  $(UserCard).attr("id") == "MsgSend"
    || !$("button.btn.btn-primary:contains('Unfriend'):eq(0)").length) return;
    
    $(UserCard).attr("id","MsgSend");
    
    $(''
      + '<div class="col-md-12 row">'
      +     '<textarea id="MessageSenderM" class="col-md-9"></textarea>'
      +     '<button   id="MessageSenderS" class="btn col-md-3">Send Message</button>'
      + '</div>'
      + '<p class="col-md-12 row">'
      +     '<small><a href="https://docs.unity3d.com/Manual/StyledText.html" target="_blank">'
      +         '<code>&lt;b&gt;<b>b</b>&lt;/b&gt;</code><br>'
      +         '<code>&lt;i&gt;<i>i</i>&lt;/i&gt;</code><br>'
      +         '<code>&lt;color=yellow&gt;<font style="color:yellow">color</font>&lt;/color&gt;</code>'
      +     '</a></small>'
      + '</p>')
      .insertAfter($("div.mb-4.row:last"))
    
    $("#MessageSenderS").click(function(){
        if($("#MessageSenderM").val().toString().replace(" ", "") == ""){
            return;
        }
        //SendNotification(UserID[1], $("#MessageSenderM").val());
        //console.error(UserID);
        //console.error($("#MessageSenderM").val());
        
        
        $.ajax({
            url: '/api/1/user/'+ UserID[1] +'/message',
            type: 'POST',
            data:{ type: 1, message: $("#MessageSenderM").val()},
            success: alert("[OK] Message sent successfully!")
        });
        
        /*
        $.ajax({
            url: '/api/1/user/'+ UserID[1] +'/notification',
            type: 'POST',
            data:{ type: "message", message: $("#MessageSenderM").val()},
            success: alert("[OK] Message sent successfully!")
        });
        */
    })
}

// Outdated!!
// https://vrchatapi.github.io/#/NotificationAPI/SendNotification
function SendNotification(UserID, msg){
    if(ContainsCounter(msg, "\n") >= 3){
        alert("3 Lines Only.\n禁止超過三行.");
        return;
    }
    
    //msg = msg + "\nPress <color=yellow>Decline 取消</color> to Stop message repeat.";
    
    $("#MessageSenderS").prop('disabled', true);
    
    //var type = "all";     // 訊息會重複
    //var type = "hidden";  // 無訊息顯示
    //var type = "message"; // 禁止使用 Error 501
    //var type = "friendrequest";//訊息會被交友蓋住
    //var type = "votetokick"; //沒用處，無訊息顯示
    
    // Good to use
    var type    = "halp";
    //var type    = "invite";
    
    $.post( "/api/1/user/" + UserID + "/notification",{ type: type, message: msg })
    .done(function( html ){ console.error(html);
        if(html.jobName == "write_notification") 
                alert("Message has been Sent\n" + html.id);
        else    alert("Data Error?");
        $("#MessageSenderS").prop('disabled', false);
    }).fail(function( jqXHR, textStatus ) { console.error(textStatus);
        $("#MessageSenderS").prop('disabled', false);
        alert( "Request failed: " + textStatus );
    });
    
}

function LaunchPage(){
    var WorldID = getQueryString("worldId");
    
    // https://vrchatapi.github.io/#/WorldAPI/GetWorld
    var AlertInfo_Explain = $("p.alert.alert-info.explain:eq(0)");
    $(AlertInfo_Explain).clone().appendTo($(AlertInfo_Explain).parent())
    .html( "API：" + 
           "<a target='_blank' href='api/1/worlds/" + WorldID + "'>WorldData</a>, " + 
           "<a target='_blank' href='api/1/worlds/" + WorldID + "/metadata'>WorldMetaData</a>");
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

// 取得初始網址
function getBaseURL(){
    return /^(.+\/[\/].+?vrchat.+?[\/]).+$/.exec(url)[1];
}


// 取得好友紀錄並列表展示
function FriendsHistoryListing(){
    $.get()
    
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
    catch(e){
        return false;
    }
    return true;
}

function ContainsCounter(text, str){
    return text.split(str).length - 1;
}

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
			if(!object[i].match("%")) continue;				//跳過非替代內容
			else if(RepTXT == undefined) RepTXT = "undefined"
			else if(typeof(RepTXT) == "number" && isNaN(RepTXT)) RepTXT = "NaN"
			Source = Source.replace(new RegExp(object[i],"gm"),RepTXT)
			//console.error(object[i] + " : " + data[object[i]])
		}
		//console.error(Source)
		data.out = Source;
		if(callback) callback.apply(this, [data]);
		return data;
	}
}

function RunOnce(element, className, callback){
    if(!$(element).length || $(element).hasClass(className) || $(element).hasClass("lone_ignore")) return;
        $(element).addClass(className);
    callback.apply(this, [element, className]);
}

//TimeLocalizerUTC("2018-10-14T05:28:29.527Z"); // same as 2018-10-14T13:28:29.527Z
//TimeLocalizerUTC("2018-10-14T22:28:29.527Z"); // same as 2018-10-15T06:28:29.527Z
function TimeLocalizerUTC(DateTime){
    // https://stackoverflow.com/a/1091399
    // https://stackoverflow.com/a/32252686
    var current = new Date(DateTime);
    var utcDate = new Date(current.getTime() - current.getTimezoneOffset() * 60000);
    //alert(utcDate + "\n" + utcDate.toISOString());
    //alert(current + "\n" + current.toISOString());
    //console.error(DateTime + " to " + utcDate.toISOString())
    return utcDate.toISOString();
}

function regexUnityID(typeID,text){
    if(typeID == null || typeID == "" ) return null;
    var regexUID = new RegExp("(" + typeID + "_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})");
    var result   = regexUID.exec(text,"gm");
    if(result) return result[1];
    return null;
}

// https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

async function getAPI(url, header){
    let err2 = null;
    header   = Object.assign(header || {}, { credentials: 'same-origin' });
    return [await fetch("/api/1/" + url, header)
        .then(async response => response.ok ? response.json().then(value => { 
            //console.info(value);
            return value 
        })
        : Promise.reject(new Error(`${response.status} ${response.statusText}\n${await response.text()}`)))
            .catch(err => { 
                console.error("Promise.reject: ", err); 
                err2 = err;
                ShowMSG(err);
            }), err2]
}

InsertCustomCSS();
function InsertCustomCSS(){ $("head").append(`<style>

    .pointer {cursor: pointer;}
    
    #rsalert {
        pointer-events: none;
        -webkit-box-shadow: 1px 1px 5px #bbb;
        box-shadow: 1px 1px 5px #bbb;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        max-width: 100%;
        opacity: 0;
        position: fixed;
        -webkit-transition: 0.5s;
        -o-transition: 0.5s;
        transition: 0.5s;
        width: 100%;
        z-index: 9999;
        top: 0px;
    }
    
    #rsalert:hover, .rsalert:focus {
        cursor: default;
    }
    
    .rsalert-dark {
        background-color: #757575;
        border: 1px solid #676767;
        color: #fff;
    }
    
    #rsalert span {
        padding: 7px 35px 7px 15px;
        color: white !important;
        font-weight :bold !important;
    }
    
    #rsalert .closersalert {
        pointer-events: auto !important;
        background: unset;
        background-color: unset;
        border: unset;
        color: inherit;
        cursor: pointer;
        font-size: 1rem;
        margin-right: 10px;
        outline: unset;
    }

    #rsalert button {
        padding: 1px 6px;
    }

    #rsalert button {
        height: 5px;
        -webkit-appearance: button;
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: initial;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        margin: 0em;
        font: 400 13.3333px Arial;
        
        align-items: flex-start;
        text-align: center;
        cursor: default;
        color: buttontext;
        background-color: buttonface;
        box-sizing: border-box;
        padding: 2px 6px 3px;
        border-width: 2px;
        border-style: outset;
        border-color: buttonface;
        border-image: initial;
    }
</style>`)}

// https://www.jqueryscript.net/other/Top-Notification-Bar-RSAlert.html
// https://www.jqueryscript.net/demo/Top-Notification-Bar-RSAlert/
InsertCustomAlertBox();
function InsertCustomAlertBox(){
    $("body").append(`
    <div id="rsalert" class="rsalert-dark">
        <span id="rsalertMSG"></span>
        <button class="closersalert">×</button>
    </div>
    `)
    
    $(".closersalert").click(function(){ $("#rsalert").css("opacity","0"); });
}
function ShowMSG(MSG, IsAppend){
    if(!IsAppend) $("#rsalertMSG").html("");
    $("#rsalert").css("opacity","1");
    let CodeBlock = hljs.highlightAuto(JSON.stringify(MSG), null, 2).value;
    //console.error(CodeBlock);
    $("#rsalertMSG").append(CodeBlock);
}

/*
$("#taglist").bind("DOMSubtreeModified", function() { 
		TagListChange2(); 
	});
*/


//=================
// %appdata%/../locallow/VRChat
// https://discordapp.com/channels/396622671078490116/404542431158337536/494566422148677643


// MutationObserver 监听DOM树变化    https://www.jianshu.com/p/b5c9e4c7b1e1
// roselan/jquery.observe.src.js     https://gist.github.com/roselan/3176700

// 使用MutationObserver和DOMSubtreeModified监听HTML中title的变化
// https://goo.gl/yDUP6r

// 用 MutationObserver 和 Mutation events 监听 DOM 变化
// https://csbun.github.io/blog/2015/05/mutation-observer-and-event/

/*
// https://gist.github.com/roselan/3176700
(function( $ ){
  $.fn.observe = function( callback, options ) {  

    var settings = $.extend( {
            attributes: true, 
            childList: true, 
            //subtree: true,
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
        else if(this.addEventListener && callback){
            this.addEventListener("DOMSubtreeModified", function(evt) {
                callback.call(this);
            }, false);
        }
        else if(callback){
            console.log('observe : unsupported browser');
        }
    });
  };
})( jQuery );
*/