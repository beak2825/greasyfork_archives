// ==UserScript==
// @name       OChat
// @author     Mertyr_u82
// @namespace  http://ochat.crypt-msg.de/
// @version    0.12
// @description  Ochat - An Ogame Ally Chat which gets displayed ingame
// @include        http://*.ogame.*/game/index.php?*page=*
// @include        http://*-*.ogame.gameforge.com/game/index.php?page=*
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @copyright  2014+, Mertyr
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/1486/OChat.user.js
// @updateURL https://update.greasyfork.org/scripts/1486/OChat.meta.js
// ==/UserScript==
var OJconfig;
var mouseDragging = null;
var lastAllyMsg = 0;
var lastAllyMsgRead = 0;
var allyChatTimer;
var allyChatStatusTimer;
var allyChatRate;
var panelIsOpen = 0;
var allyChatIsOpen = 0;
var onlineListIsOpen = 0;
var register = 0;
var allyChatContinueLoading = 0;

var OJVersion = "0.12";
var devTrigger = 0;
var devAlert = 0;
var OJIsBeta = 0;

jQuery.fn.exists = function() {return this.length>0;};
jQuery.fn.slider = function() {
    $(this).children("h3").each(function(index, element){
        $(element).css("font-weight", "600");
        $(element).css("text-align", "center");
        $(element).css("height", "20px");
        $(element).css("line-height", "20px");
        $(element).css("margin-bottom", "2px");
        $(element).css("border", "1px solid #CCCCCC");
        $(element).css("border-radius", "5px");
        
        $(element).next().css("height", "auto");
        $(element).next().css("line-height", "20px");
        $(element).next().css("margin-bottom", "2px");
        $(element).next().css("border", "1px solid #999999");
        $(element).next().css("border-radius", "5px");
        $(element).css("cursor", "pointer");
        
        $(element).next().hide();
        $(element).click(function(event) {
            $(this).next().toggle();
        });
    });
};

function OJgetCurrentUniverse()
{
    var url = document.URL;
    url = url.replace("http://s", "");
    url = url.replace(/\.ogame\.gameforge\.com\/.*/, "");
    return url;
}

function api(action, func, data)         //data starts with "&key=value&key2=....."
{
    if(typeof data === 'undefined')
    {
        data = "";
    }
    if(action == "login" || action == "register")
    {
        data = "action=" + action + data;
    }
    else
    {
        var uni = OJgetCurrentUniverse();
        var name = OJconfig["userName_" + uni];
        var passHash =  OJconfig["password_" + uni];
        var hashed = 0;
        if(typeof OJconfig["hashed_" + uni] !== 'undefined')
        {
            hashed = OJconfig["hashed_" + uni];
        }
        data = "hashed=" + hashed + "&name=" + name + "&passHash=" + passHash + "&uni=" + uni + "&action=" + action + data;
    }
    var url = "http://ojobs.crypt-msg.de/api.php";
    if(devTrigger == 1)
    {
        url = "http://localhost/ojobs/api.php";
    }
    GM_xmlhttpRequest({
        method: "POST",
         url: url,
         data:data,
         headers: {
         "Content-Type": "application/x-www-form-urlencoded"
         },
         onabort: function(response) {
             alert("abort" + response.responseText);
         },
         onerror: function(response) {
             alert("error" + response.responseText);
         },
         ontimeout: function(response) {
             alert("timeout" + response.responseText);
         },
         onload: function(response) {
             if(devAlert == 1)
             {
                 //$("#OJobs_panel").append("<span>" + response.responseText + "</span><br/>\n");
                 dAlert(response.responseText);
             }
             func(response);
             var json = JSON.parse(response.responseText);
             return json;
         }
        });
}

function OJReadMetas(uni)
{
    if(typeof uni === 'undefined')
    {
        uni = OJgetCurrentUniverse();
    }
   var metas = document.getElementsByTagName('meta'); 
   var result = new Array();
   for (i=0; i<metas.length; i++) { 
       var name = metas[i].getAttribute("name");
      if (name == "ogame-player-id") { 
         result["ogameId_" + uni] = metas[i].getAttribute("content"); 
      }
      else if (name == "ogame-player-name") { 
         result["userName_" + uni] = metas[i].getAttribute("content"); 
      } 
      else if (name == "ogame-alliance-tag") { 
         result["alliance_" + uni] = metas[i].getAttribute("content"); 
      } 
   }
   return result;
}

function OJAllyChatBlink(lastMsg, hidden)
{
    if(typeof hidden === 'undefined')
    {
        hidden = 0;
    }
    if(lastMsg > 0 && allyChatContinueLoading == 1 && allyChatIsOpen == 0 && panelIsOpen == 1)
    {
        $("#OJobs_allyChat_header").css("background-color", "#26aa2b");
        $(".OJobs_allyChat_blinkText").css("color", "#6464dc");
    }
    else if( lastMsg > 0 && allyChatContinueLoading == 1 && panelIsOpen == 0)
    {
        $("#OJobs_tb").css("color", "#26aa2b");
        $(".OJobs_allyChat_blinkText").css("color", "#6464dc");
    }
    else if(lastMsg > 0 && lastMsg > lastAllyMsgRead)
    {
        $(".OJobs_allyChat_blinkText").css("color", "#6464dc");
    }
    else if(lastMsg == -1 || lastMsg == lastAllyMsgRead)
    {
        $(".OJobs_allyChat_from").css("color", "#6F9FC8");
        $(".OJobs_allyChat_blinkText").removeClass("OJobs_allyChat_blinkText");   
        $("#OJobs_tb").css("color", "");
        $("#OJobs_allyChat_header").css("background-color", "");
    }
    else if(lastMsg == 0)
    {
        $("#OJobs_tb").css("color", "");
        $("#OJobs_allyChat_header").css("background-color", "");
    }
}

function OJReadConfig()
{
    OJconfig = new Array();
    GM_listValues().forEach(function(val) {
        OJconfig[val] = GM_getValue(val);
    });
    var metas = OJReadMetas();
    for(var m in metas) 
    {
        OJconfig[m] = metas[m];
    }
    OJconfig["uni"] = OJgetCurrentUniverse();
    if((typeof OJconfig["userName_" + OJconfig["uni"]] === 'undefined' || OJconfig["userName_" + OJconfig["uni"]] == "" || OJconfig["userName_" + OJconfig["uni"]] == 'undefined') && $("#playerName").children("span").html().replace(/\s*/g, "") != 'undefined')
    {
       OJconfig["userName_" + OJconfig["uni"]] = $("#playerName").children("span").html().replace(/\s*/g, "");
    }
    if(typeof OJconfig["panelIsOpen_" + OJconfig["uni"]] == 'undefined')
    {
        OJconfig["panelIsOpen_" + OJconfig["uni"]] = "0";
        GM_setValue("panelIsOpen_" + OJconfig["uni"], "0");
    }
    if(typeof OJconfig["allyChatIsOpen_" + OJconfig["uni"]] === 'undefined')
    {
        OJconfig["allyChatIsOpen_" + OJconfig["uni"]] = "0";
        GM_setValue("allyChatIsOpen_" + OJconfig["uni"], "0");
    }
    if(typeof OJconfig["onlineListIsOpen_" + OJconfig["uni"]] === 'undefined')
    {
        OJconfig["onlineListIsOpen_" + OJconfig["uni"]] = "0";
        GM_setValue("onlineListIsOpen_" + OJconfig["uni"], "0");
    }
    if(typeof OJconfig["allyChat_refresh_" + OJconfig["uni"]] === "undefined")
    {
        OJconfig["allyChat_refresh_" + OJconfig["uni"]] = 10;
        GM_setValue("allyChat_refresh_" + OJconfig["uni"], 10);
    }
    if(typeof OJconfig["allyChat_fontSize_" + OJconfig["uni"]] === "undefined")
    {
        OJconfig["allyChat_fontSize_" + OJconfig["uni"]] = 12;
        GM_setValue("allyChat_fontSize_" + OJconfig["uni"], 12);
    }
    if(typeof OJconfig["lastAllyMsgRead_" + OJconfig["uni"]] === "undefined")
    {
        OJconfig["lastAllyMsgRead_" + OJconfig["uni"]] = 0;
        GM_setValue("lastAllyMsgRead_" + OJconfig["uni"], 0);
    }
    if(typeof OJconfig["allyChat_continueLoading_" + OJconfig["uni"]] === "undefined")
    {
        OJconfig["allyChat_continueLoading_" + OJconfig["uni"]] = 1;
        GM_setValue("allyChat_continueLoading_" + OJconfig["uni"], 1);
    }
}

function OJobsAllyChatSend(message)
{
    lastAllyMsgRead = lastAllyMsg;
    var func = function(response) {
        result = JSON.parse(response.responseText);
        if(result.status >= 1)
        {
            lastAllyMsgRead = result.messageId;
            OJconfig["lastAllyMsgRead_" + OJconfig["uni"]] = lastAllyMsgRead;
            GM_setValue("lastAllyMsgRead_" + OJconfig["uni"], lastAllyMsgRead);
            $("#OJobs_allyChat_input").val("");
            OJAllyChatBlink(-1);
        }
        else
        {
            $("#OJobs_allyChat_input").val(result.message);
            OJAllyChatBlink(lastAllyMsg);
        }
    };
    api("allyChat_send", func, "&message=" + message);
}

function OJobsAllyChatGetMessages(hidden)
{
       allyChatContinueLoading = allyChatContinueLoading%2;
        if(allyChatIsOpen != "1" && allyChatContinueLoading != 1)
        {
           clearTimeout(allyChatTimer);
        }
        else
        {
           var func = function(response) {
               result = JSON.parse(response.responseText);
               if(result.status == 1)
               {
                for (var key in result.messages) {
                    var id = result.messages[key].id;
                    var from = result.messages[key].name;
                    var message = result.messages[key].message;
                    var at = result.messages[key].at;
                    if(id > lastAllyMsgRead)
                    {
                       $("#OJobs_allyChat_log").append("<span title=\"" + at + "\" class=\"OJobs_allyChat_blinkText OJobs_allyChat_from\" ><b>" + from + ":</b>&nbsp;</span>" + message + "<br />\n");
                    }
                    else
                    {
                       $("#OJobs_allyChat_log").append("<span title=\"" + at + "\" class=\"OJobs_allyChat_from\" ><b>" + from + ":</b>&nbsp;</span>" + message + "<br />\n");
                    }
                    if(id > lastAllyMsg)
                    {
                        lastAllyMsg = id;
                    }
                }
                if(result.messages.length > 0)
                {
                    $(".OJobs_allyChat_from").css("cursor", "pointer").css("color", "#6F9FC8");
                    $(".OJobs_allyChat_blinkText").css("color", "#6464dc");
                    $("#OJobs_allyChat_log").scrollTop($("#OJobs_allyChat_log")[0].scrollHeight);
                    if(typeof hidden === 'undefined')
                    {
                        hiddenn = 0;
                    }
                    if(hidden == 0 || lastAllyMsg > lastAllyMsgRead)
                    {
                       OJAllyChatBlink(lastAllyMsg, hidden);
                    }
                }
            }
            else
            {
                alert(result.message);
            }
            allyChatTimer = setTimeout(function() {OJobsAllyChatGetMessages()}, OJconfig["allyChat_refresh_" + OJconfig["uni"]]*1000);
        };
       api("allyChat_getMessages", func, "&lastMsg=" + lastAllyMsg);
    }
}

function OJobsAllyChatGetOnlineStatus(hidden)
{
       allyChatContinueLoading = allyChatContinueLoading%2;
        if(onlineListIsOpen == 1 && allyChatContinueLoading != 1)
        {
           clearTimeout(allyChatStatusTimer);
        }
        else
        {
           var func = function(response) {
               result = JSON.parse(response.responseText);
               if(result.status == 1)
               {
                   $("#OJobs_allyChat_whoIsOnline").html("");
                    for (var key in result.users) {
                        var id = result.users[key].id;
                        var name = result.users[key].name;
                        var time = result.users[key].time;
                        var minutes = result.users[key].minutes;
                        var hours = result.users[key].hours;
                        var statusClass = "OJobs_statusOnline";
                        if(time > 900 && time < 3600)
                        {
                            statusClass = "OJobs_statusShort";
                        }
                        else if(time > 3600)
                        {
                            statusClass = "OJobs_statusLong";
                        }
                        var timeString = minutes + "m";
                        if(hours > 0)
                        {
                            timeString = hours + "h" + timeString;
                        }
                        $("#OJobs_allyChat_whoIsOnline").append("<span ogameId=\"" + id + "\" class=\"" + statusClass + "\">" + name + "</span><span class=\"" + statusClass + " OJobs_statusTime\">" + timeString + "</span><span class=\"clearRight\">&nbsp;</span><br />\n");
                    }
                   $(".OJobs_statusTime").css("float", "right");
                   $(".clearRight").css("clear", "right");
                   $(".OJobs_statusOnline").css("color", "#26aa2b");
                   $(".OJobs_statusShort").css("color", "#e1d000");
                   $(".OJobs_statusLong").css("color", "#a63000");
               }
               else
               {
                   alert(result.message);
               }
               allyChatStatusTimer = setTimeout(function() {OJobsAllyChatGetOnlineStatus()}, 15000);
        };
       api("allyChat_whoisOnline", func);
    }
}

function OJCreateContent()
{
    $("#OJobs_panel").append("<div id=\"OJobs_slider\">");
    $("#OJobs_slider").append("<h3>Config</h3><div id=\"OJobs_config\"></div>");
    $("#OJobs_slider").append("<h3 id=\"OJobs_allyChat_header\" >Ally-Chat</h3><div id=\"OJobs_allyChat\"></div>");
    $("#OJobs_slider").append("<h3 id=\"OJobs_allyChat_whoIsOnline_header\" >Online-Liste</h3><div id=\"OJobs_allyChat_whoIsOnline\"></div>");
    $("#OJobs_slider").slider();
    
    $("#OJobs_config").append("<table><tr><td>" + 
                               "Refresh:&nbsp;</td><td><textarea id=\"OJobs_config_allyChat_refresh\" \" /></textarea>" + 
                               "</td></tr><tr><td>" + 
                               "FontSize:&nbsp;</td><td><textarea id=\"OJobs_config_allyChat_fontSize\" /></textarea>" + 
                               "</td></tr><tr><td>" + 
                               "<span title=\"Sollen wie Nachrichten auch dann abgerufen werden, wenn das Fenster minimiert ist?\">Durchgehend laden</span>:&nbsp;</td><td><input type=\"checkbox\" name=\"OJobs_config_allyChat_continueLoading\" id=\"OJobs_config_allyChat_continueLoading\" /><i>(Zeigt Online-Status)</i>" + 
                               "</td></tr></table>");
    
    $("#OJobs_allyChat").append("<div id=\"OJobs_allyChat_log\"></div>");
    $("#OJobs_allyChat").children(0).css("height", "280px");
    $("#OJobs_allyChat").append("<textarea id=\"OJobs_allyChat_input\" ></textarea>");
    $("#OJobs_allyChat_input").css("width", "70%").css("height", "1.2em").css("min-height", "1.2em").css("max-height", "1.2em").css("top", "5px");
    $("#OJobs_allyChat").append("&nbsp;<button id=\"OJobs_allyChat_send\">Send</button>");
    
    $("#OJobs_allyChat_log").css("overflow", "auto");
    $("#OJobs_allyChat_log").click(function(event) { 
        OJAllyChatBlink(-1);
        if(lastAllyMsg != 0)
        {
            lastAllyMsgRead = lastAllyMsg;
            OJconfig["lastAllyMsgRead_" + OJconfig["uni"]] = lastAllyMsgRead;
            GM_setValue("lastAllyMsgRead_" + OJconfig["uni"], lastAllyMsgRead);
        }
    });
    $("#OJobs_allyChat_log").css("word-wrap", "break-word");
    $("#OJobs_allyChat_header").click(function(event) { 
        OJAllyChatBlink(0);
        $("#OJobs_allyChat_log").scrollTop($("#OJobs_allyChat_log")[0].scrollHeight);
        if(lastAllyMsg != 0)
        {
            OJconfig["lastAllyMsgRead_" + OJconfig["uni"]] = lastAllyMsgRead;
            GM_setValue("lastAllyMsgRead_" + OJconfig["uni"], lastAllyMsgRead);
        }
    });
    $("#OJobs_allyChat_input").css("margin-left", "3px");
    OJconfig["allyChat_continueLoading_" + OJconfig["uni"]] = OJconfig["allyChat_continueLoading_" + OJconfig["uni"]]%2;
    allyChatContinueLoading = OJconfig["allyChat_continueLoading_" + OJconfig["uni"]];
    if(allyChatContinueLoading == 1)
    {
        $("#OJobs_config_allyChat_continueLoading").attr("checked", "checked");
    }
    $("#OJobs_config_allyChat_continueLoading").change(function(event) {
        if($("#OJobs_config_allyChat_continueLoading").is(":checked")){
            allyChatContinueLoading = 1;
        }
        else
        {
            allyChatContinueLoading = 0;
        }
        OJconfig["allyChat_continueLoading_" + OJconfig["uni"]] = allyChatContinueLoading;
        GM_setValue("allyChat_continueLoading_" + OJconfig["uni"], allyChatContinueLoading);
    });
    
    allyChatRate = OJconfig["allyChat_refresh_" + OJconfig["uni"]];
    $("#OJobs_config_allyChat_refresh").val(allyChatRate);
    $("#OJobs_config_allyChat_refresh").change(function(event) {
        if($("#OJobs_config_allyChat_refresh").val() < 3)
        {
            $("#OJobs_config_allyChat_refresh").val("3");
        }
        allyChatRate =  $("#OJobs_config_allyChat_refresh").val();
        OJconfig["allyChat_refresh_" + OJconfig["uni"]] = allyChatRate;
        GM_setValue("allyChat_refresh_" + OJconfig["uni"], allyChatRate);
    }).css("height", "1.2em").css("min-height", "1.2em").css("max-height", "1.2em");
    
    allyChatRate = OJconfig["allyChat_refresh_" + OJconfig["uni"]];
    $("#OJobs_config_allyChat_refresh").val(allyChatRate);
    $("#OJobs_config_allyChat_refresh").change(function(event) {
        if($("#OJobs_config_allyChat_refresh").val() < 3)
        {
            $("#OJobs_config_allyChat_refresh").val("3");
        }
        allyChatRate =  $("#OJobs_config_allyChat_refresh").val();
        OJconfig["allyChat_refresh_" + OJconfig["uni"]] = allyChatRate;
        GM_setValue("allyChat_refresh_" + OJconfig["uni"], allyChatRate);
    }).css("height", "1.2em").css("min-height", "1.2em").css("max-height", "1.2em");
    
    $("#OJobs_config_allyChat_fontSize").val(OJconfig["allyChat_fontSize_" + OJconfig["uni"]]);
    $("#OJobs_allyChat").css("fontSize", OJconfig["allyChat_fontSize_" + OJconfig["uni"]] + "px");
    $("#OJobs_config_allyChat_fontSize").change(function(event) {
       OJconfig["allyChat_fontSize_" + OJconfig["uni"]] =  $("#OJobs_config_allyChat_fontSize").val();
        GM_setValue("allyChat_fontSize_" + OJconfig["uni"], $("#OJobs_config_allyChat_fontSize").val());
        $("#OJobs_allyChat").css("fontSize", OJconfig["allyChat_fontSize_" + OJconfig["uni"]] + "px");
    }).css("height", "1.2em").css("min-height", "1.2em").css("max-height", "1.2em");
    
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        if($("#OJobs_allyChat_input").hasClass("markItUpEditor"))
        {
            $("#OJobs_allyChat_input").parent().parent().parent()[0].outerHTML = $("#OJobs_allyChat_input")[0].outerHTML;
            $("#OJobs_allyChat_input").next().remove();
            $("#OJobs_allyChat_input").removeClass("markItUpEditor");
        }
        if($("#OJobs_config_allyChat_refresh").hasClass("markItUpEditor"))
        {
            $("#OJobs_config_allyChat_refresh").parent().parent().parent()[0].outerHTML = $("#OJobs_config_allyChat_refresh")[0].outerHTML;
            $("#OJobs_config_allyChat_refresh").next().remove();
            $("#OJobs_config_allyChat_refresh").removeClass("markItUpEditor");
            $("#OJobs_config_allyChat_refresh").val(OJconfig["allyChat_refresh_" + OJconfig["uni"]]);
        }
        if($("#OJobs_config_allyChat_fontSize").hasClass("markItUpEditor"))
        {
            $("#OJobs_config_allyChat_fontSize").parent().parent().parent()[0].outerHTML = $("#OJobs_config_allyChat_fontSize")[0].outerHTML;
            $("#OJobs_config_allyChat_fontSize").next().remove();
            $("#OJobs_config_allyChat_fontSize").removeClass("markItUpEditor");
            $("#OJobs_config_allyChat_fontSize").val(OJconfig["allyChat_fontSize_" + OJconfig["uni"]]);
        }
        observer.observe(document.getElementById("OJobs_allyChat_input"), {
          attributes: true
        });
    });
    
    observer.observe(document.getElementById("OJobs_allyChat_input"), {
      attributes: true
    });
    
    var OJAllySend = function(event) {
        event.preventDefault();
        if($("#OJobs_allyChat_input").val() != "")
        {
            var result = OJobsAllyChatSend($("#OJobs_allyChat_input").val());
            event.preventDefault();
        }
    };
    $("#OJobs_allyChat_send").click(function(event) {
        OJAllySend(event);
    }).css("height", "25px").css("min-height", "25px").css("max-height", "25px");
    $("#OJobs_allyChat_input").keydown(function(event) {
        if(event.keyCode == 13)
        {
           OJAllySend(event);
        }
    });
    $("#OJobs_allyChat").prev().click(function(event) {
        allyChatIsOpen = (allyChatIsOpen+1)%2;
        if(allyChatIsOpen == 1)
        {
            OJconfig["allyChatIsOpen_" +"uni"] = "1";
            GM_setValue("allyChatIsOpen_" + OJconfig["uni"], "1");
            OJobsAllyChatGetMessages(0);
            OJobsAllyChatGetOnlineStatus(0);
        }
        else
        {
            OJconfig["allyChatIsOpen_" +"uni"] = "0";
            GM_setValue("allyChatIsOpen_" + OJconfig["uni"], "0");
        }
    });
    $("#OJobs_allyChat_whoIsOnline_header").click(function(event) {
        onlineListIsOpen = (onlineListIsOpen+1)%2;
        if(onlineListIsOpen == 1)
        {
            OJconfig["onlineListIsOpen_" +"uni"] = "1";
            GM_setValue("onlineListIsOpen_" + OJconfig["uni"], "1");
            OJobsAllyChatGetOnlineStatus(0);
        }
        else
        {
            OJconfig["onlineListIsOpen_" +"uni"] = "0";
            GM_setValue("onlineListIsOpen_" + OJconfig["uni"], "0");
        }
    });
    if(GM_getValue("allyChatIsOpen_" + OJconfig["uni"]) == 1 && GM_getValue("panelIsOpen_" + OJconfig["uni"]) == 1)
    {
        OJobsAllyChatGetMessages(1);
        $("#OJobs_allyChat").toggle();
        allyChatIsOpen = (allyChatIsOpen+1)%2;
    }
    else if(allyChatContinueLoading == 1)
    {
        OJobsAllyChatGetMessages(1);
    }
    if(GM_getValue("onlineListIsOpen_" + OJconfig["uni"]) == 1)
    {
        OJobsAllyChatGetOnlineStatus(1);
        $("#OJobs_allyChat_whoIsOnline").toggle();
        onlineListIsOpen = (onlineListIsOpen+1)%2;
    }
    else if(allyChatContinueLoading == 1)
    {
        OJobsAllyChatGetOnlineStatus(1);
    }
}

function OJLogout()
{
    clearTimeout(allyChatTimer);
    var uni = OJgetCurrentUniverse();
    GM_deleteValue("userName_" + uni);
    GM_deleteValue("password_" + uni);
    GM_deleteValue("hashed_" + uni);
    
    delete OJconfig["userName_" + uni];
    delete OJconfig["password_" + uni];
    delete OJconfig["hashed_" + uni];
    
    $("#OJUsernameSpan").remove();
    $("#OJobs_slider").remove();
    $("#OJobs_loginDiv").show();
    
    allyChatIsOpen = 0;
    OJconfig["allyChatIsOpen_" + OJconfig["uni"]] = 0;
    GM_setValue("allyChatIsOpen_" + OJconfig["uni"], 0);
    onlineListIsOpen = 0;
    OJconfig["onlineListIsOpen_" + OJconfig["uni"]] = 0;
    GM_setValue("onlineListIsOpen_" + OJconfig["uni"], 0);
    allyChatContinueLoading = 0;
    OJconfig["OJobs_deleteUserSpanallyChatContinueLoading_" + OJconfig["uni"]] = 0;
    $("#OJobs_allyChat").hide();
}

function OJLogin(force, hidden)
{
    var uni = OJgetCurrentUniverse();
    var name;
    var passHashed;
    var hashed;
    var hashed = 0;
    if(typeof force === 'undefined')
    {
        force = 0;
    }
    if(force != 1 && typeof OJconfig["userName_" + uni] !== 'undefined' && OJconfig["userName_" + uni].length > 0)
    {
        name = OJconfig["userName_" + uni];
    }
    else
    {
        name = $("#OJobs_loginText").val();
    }
    if(force != 1 && typeof OJconfig["hashed_" + uni] !== 'undefined' && OJconfig["hashed_" + uni] == 1 && $("#OJobs_loginPass").val().length < 1)
    {
        passHashed = OJconfig["password_" + uni];
        hashed = 1;
    }
    else
    {
        if(force != 1 && typeof OJconfig["password_" + uni] !== 'undefined' && OJconfig["password_" + uni].length > 0 && $("#OJobs_loginPass").val().length < 1)
        {
            passHashed = OJconfig["password_" + uni];
            hashed = 0;
        }
        else
        {
            passHashed = $("#OJobs_loginPass").val();
        }
    }
    var func = function(response) {
        var result = JSON.parse(response.responseText);
        if(result.status >= 1)
        {
            GM_setValue("userName_" + uni, result.name);
            GM_setValue("password_" + uni, result.passHash);
            GM_setValue("hashed_" + uni, "1");
            OJconfig["userName_" + uni] = result.name;
            OJconfig["password_" + uni] = result.passHash;
            OJconfig["hashed_" + uni] = "1";
            $("#OJobs_loginDiv").hide();
            $("#OJobs_loginDiv").before("<span id =\"OJUsernameSpan\">Angemeldet:&nbsp;<b>" + result.name + "</b>&nbsp;<i id=\"OJLogout\">Logout<span id=\"OJobs_deleteUserSpan\" style=\"float: right;\">Delete</span><span style=\"clear: right;\"></span></i><br /></span>\n");
            $("#OJLogout").click(function (event) {
                OJLogout();
            }).css("cursor", "pointer");
            $("#OJobs_deleteUserSpan").click(function (event) {
                var ays = prompt("Soll der OChat-Account wircklich gelöscht weden?(\"YES\")");
               if(ays == "YES")
               {
                  OJDeleteUser(ays);
               }
                else
                {
                    alert("Bitte auch auf Groß- und Kleinschreibung achten.");
                }
            }).css("cursor", "pointer");
            OJCreateContent();
            if(allyChatContinueLoading == 0 && OJconfig["allyChatContinueLoading_" + OJconfig["uni"]] == 1)
            {
                allyChatContinueLoading = OJconfig["allyChatContinueLoading_" + OJconfig["uni"]];
                OJobsAllyChatGetMessages();
                OJobsAllyChatGetOnlineStatus();
            }
            var version1 = OJVersion;
            var version2;
            if(OJIsBeta == 1)
            {
                version2 = result.betaVersion;
            }
            else
            {
                version2 = result.clientVersion;
            }
            if(version1 != version2)
            {
                version1 = version1.split(".");
                version2 = version2.split(".");

                var version2Old = 0;
                var versionBigger = 0;
                version2.forEach(function(element, index) {
                    if(typeof version1[index] === 'undefined')
                    {
                        version1[index] = 0;
                    }
                });
                version1.forEach(function(element, index) {
                    if(typeof version2[index] === 'undefined')
                    {
                        version2[index] = 0;
                    }
                    version1[index] = parseInt(version1[index]);
                    version2[index] = parseInt(version2[index]);
                    if(version2Old == 0 && versionBigger == 0 && version1[index] < version2[index])
                    {
                        version2Old = 1;
                    }
                    else if(version2Old != 1 && version1[index] > version2[index])
                    {
                        versionBigger = 1
                    }
                });
                if(version2Old == 1)
                {
                    if(OJIsBeta != 1)
                    {
                        $("#OJobs_versionSpan").css("color", "#FF0000");
                        $("#OJobs_versionSpan").append("<b>Update</b>");
                        $("#OJobs_versionSpan").click(function(event) {
                            window.location = "http://ochat.crypt-msg.de/OChat.user.js";
                        }).css("cursor", "pointer");
                    }
                    else
                    {
                        $("#OJobs_versionSpan").css("color", "#FF0000");
                        $("#OJobs_versionSpan").append("<b>Update</b>");
                        $("#OJobs_versionSpan").click(function(event) {
                            window.location = "http://ochat.crypt-msg.de/OChat.beta.user.js";
                        }).css("cursor", "pointer");
                    }
                }
            }
        }
        else
        {
            if(typeof hidden === "undefined")
            {
               hidden = 0;
            }
            if(hidden != 1)
            {
               alert("Falsche Benutzerdaten!");
            }
            OJLogout();
        }
    };
    var result = api("login", func, "&hashed=" + hashed + "&name=" + name + "&passHash=" + passHashed + "&uni=" + uni + "&version=" + OJVersion);
}

function OJDeleteUser(areYouSure)
{
    var func = function(response) {
        result = JSON.parse(response.responseText);
        if(result.status >= 1)
        {
            alert("Erfolgreich gelöscht!");
        }
        else
        {
            alert("Fehlgeschlagen:\n" + result.message);
        }
    };
    api("deleteUser", func, "&areYouSure=" + areYouSure);
}

function OJRegister()
{
    if($("#OJobs_registerPass1").val() == $("#OJobs_registerPass2").val())
    {
        var passHash = $("#OJobs_registerPass1").val();
        var func = function(response) {
            result = JSON.parse(response.responseText);
            if(result.status >= 1)
            {
                OJconfig["hashed_" + OJconfig["uni"]] = "1";
                GM_setValue("hashed_" + OJconfig["uni"], "1");
                OJconfig["password_" + OJconfig["uni"]] = result.passHash;
                GM_setValue("password_" + OJconfig["uni"], result.passHash);
                OJLogin(0,1);
                $("#OJobs_registerPass1").val("");
                $("#OJobs_registerPass2").val("");
            }
            else
            {
                alert("Anmeldung Fehlgeschlagen:\n" + result.message);
            }
        };
        api("register", func, "&hashed=0&name=" + $("#OJobs_loginText").val() + "&passHash=" + passHash + "&uni=" + OJconfig["uni"]);
    }
    else
    {
        alert("Die Passwörter stimmen nicht überein.");
    }
}

function OJcreateMenu(hidden, event)
{
    var uni = OJgetCurrentUniverse();
    $("#box").append("<div id=\"OJobs_panel\"></div>");
    $("#OJobs_panel").css("position", "absolute");
    $("#OJobs_panel").width("300px");
    
    $("#OJobs_panel").css("z-index", "3001").css("right", "-158px").css("height", "auto").css("background-color", "#192026");
    
    //$("#OJobs_panel").css("margin-left", "133px");
    $("#OJobs_panel").css("padding-top", "20px").css("padding-left", "5px").css("padding-right", "5px").css("padding-bottom", "20px");
    
    $("#OJobs_panel").append("<div id=\"OJobs_loginDiv\"><b>Nur auf der &Uuml;bersichtsseite einloggen und registrieren!</b><br /><br /></div>");
    
    //$("#OJobs_loginDiv").append("<form id=\"OJobs_loginForm\"><input type=\"text\" id=\"OJobs_loginText\" tabindex=\"1\" value=\"" + OJconfig["userName_" + uni] + "\"/><br />" +
    $("#OJobs_loginDiv").append("Login:<br /><form id=\"OJobs_loginForm\"><table><tr><td>Name</td><td><input type=\"text\" id=\"OJobs_loginText\" tabindex=\"1\" disabled=\"disabled\" value=\"" + OJconfig["userName_" + uni] + "\"/></td></tr>" +
                                 "<tr><td>Passwort:</td><td><input type=\"password\" id=\"OJobs_loginPass\" tabindex=\"2\" /></td></tr>" +
                                 "<tr><td>&nbsp;</td><td><button id=\"OJobs_loginButton\" tabindex=\"3\">Login</button></td></tr></table></form><br /><br />");
    
    $("#OJobs_loginDiv").append("Register:<br /><form id=\"OJobs_registerForm\"><table><tr><td>Name</td><td><input type=\"text\" id=\"OJobs_loginText\" tabindex=\"4\" title=\"MUSS mit namen aus diesem Universum übereinstimmen\" value=\"" + OJconfig["userName_" + uni] + "\"/></td></tr>" +
                                 "<tr><td>Passwort:</td><td><input type=\"password\" id=\"OJobs_registerPass1\" tabindex=\"5\" /></td></tr>" +
                                 "<tr><td>Passwort wdh.:</td><td><input type=\"password\" id=\"OJobs_registerPass2\" tabindex=\"6\" /></td></tr>" +
                                 "<tr><td>&nbsp;</td><td><button id=\"OJobs_registerButton\" tabindex=\"7\">Register</button></td></tr></table></form>");
    
    $("#OJobs_panel").append("<div id=\"OJobs_header\"><b>OChat</b>&nbsp;&nbsp;&nbsp;<i><span id=\"OJobs_versionSpan\">v" + OJVersion + "</span></i></div>");
    $("#OJobs_header").append("<span id=\"OJobs_minimizePanel\">[-]</span><span></span>");
    $("#OJobs_minimizePanel").css("float", "right").css("cursor", "pointer");
    $("#OJobs_minimizePanel").click(function (event) {
        OJdisplayMenu();
    });
    $("#OJobs_minimizePanel").next().css("clear", "right");
    $("#OJobs_panel").append("<div id=\"OJobs_footer\">&nbsp;</div>");
    $("#OJobs_loginForm").submit(function(event){
        event.preventDefault();
    });
    $("#OJobs_loginButton").click(function (event) {
        OJLogin(1);
        $("#OJobsloginPass").val("");
        event.preventDefault();
    });
    $("#OJobs_loginPass").keydown(function(event)
                                   {
                                       if(event.keyCode == 13)
                                       {
                                           event.preventDefault();
                                       }
                                   });
    $("#OJobs_footer").css("bottom", "0px").css("width", "100%").css("position", "absolute").css("left", "0px").css("background-color", "#222329");
    $("#OJobs_header").css("top", "0px").css("width", "306px").css("position", "absolute").css("left", "0px").css("background-color", "#222329").css("padding", "2px");
    $("#OJobs_header").css("cursor", "move");
    if(typeof OJconfig["userName_" + OJconfig["uni"]] !== 'undefined' && OJconfig["userName_" + OJconfig["uni"]].length > 0)
    {
        $("#OJobs_loginText").val(OJconfig["userName_" + OJconfig["uni"]]);
        if(OJconfig["hashed_" + OJconfig["uni"]] == 1)
        {
            if(typeof hidden === undefined)
            {
               OJLogin(0, 0);
            }
            else
            {
               OJLogin(0, hidden);
            }
        }
    }
    $("#OJobs_registerButton").click(function (event) {
        OJRegister();
        event.preventDefault();
    });
    
    var offLeft = GM_getValue("offsetLeft_" + OJconfig["uni"]);
    var offTop = GM_getValue("offsetTop_" + OJconfig["uni"]);
    if(offLeft != '0')
    {
            $("#OJobs_panel").offset({
                top: offTop,
                left: offLeft
            });
    }
    $( document ).on("mousemove", function(e) {
        if (mouseDragging == 1) {
            $("#OJobs_panel").offset({
                top: e.pageY-10,
                left: e.pageX-100
            });
        }
    });
    $("#OJobs_header").mousedown(function(event) {
        mouseDragging = 1;
    });
    $("#OJobs_header").on("mouseup", function(event) {
        mouseDragging = 0;
        GM_setValue("offsetTop_" + OJconfig["uni"], $("#OJobs_panel").offset().top);
        GM_setValue("offsetLeft_" + OJconfig["uni"], $("#OJobs_panel").offset().left);
    });
    
}

function OJdisplayMenu(hidden, event)
{
    if($("#OJobs_panel").exists() )
    {
        if($("#OJobs_panel").is(":visible"))
        {
            $("#OJobs_panel").hide();
            panelIsOpen = 0;
            OJconfig["panelIsOpen_" + OJconfig["uni"]] = 0;
            GM_setValue("panelIsOpen_" + OJconfig["uni"], 0);
        }
        else
        {
            $("#OJobs_panel").show();
            panelIsOpen = 1;
            OJconfig["panelIsOpen_" + OJconfig["uni"]] = 1;
            GM_setValue("panelIsOpen_" + OJconfig["uni"], 1);
        }
    }
    else
    {
        if(hidden == 1 && GM_getValue("panelIsOpen_" + OJconfig["uni"]) == 1)
        {
            panelIsOpen = 1;
            OJconfig["panelIsOpen_" + OJconfig["uni"]] = 1;
            GM_setValue("panelIsOpen_" + OJconfig["uni"], 1);
            OJcreateMenu(1, null);
        }
        else
        {
            if(hidden == 0)
            {
                panelIsOpen = 1;
                OJconfig["panelIsOpen_" + OJconfig["uni"]] = 1;
                GM_setValue("panelIsOpen_" + OJconfig["uni"], 1);
                OJcreateMenu(0, event);
            }
            else
            {
                panelIsOpen = 0;
                OJconfig["panelIsOpen_" + OJconfig["uni"]] = 0;
                GM_setValue("panelIsOpen_" + OJconfig["uni"], 0);
                OJcreateMenu(1, event);
            }
        }
    }
}

$( document ).ready(function() {
    OJReadConfig();
    panelIsOpen = OJconfig["panelIsOpen_" + OJconfig["uni"]];
    allyChatIsOpen = OJconfig["allyChatIsOpen_" + OJconfig["uni"]];
    onlineListIsOpen = OJconfig["onlineListIsOpen_" + OJconfig["uni"]];
    allyChatContinueLoading = OJconfig["allyChatContinueLoading_" + OJconfig["uni"]];
    lastAllyMsgRead = OJconfig["lastAllyMsgRead_" + OJconfig["uni"]];
    var i = 0;
    var list = $("#bar").children("ul");
    var html = "<li><a href='#' id='OJobs_tb'>OChat</a></li>";
    list.append(html);
    $("#OJobs_tb").click(function(event) {
        OJdisplayMenu(0, event);
        if(allyChatIsOpen == 1 && panelIsOpen == 1 && !$("#OJobs_allyChat_log").is(":visible"))
        {
            $("#OJobs_allyChat_header").click();
        }
    });
    if(GM_getValue("panelIsOpen_" + OJconfig["uni"]) == "1")
    {
        OJdisplayMenu(1);
    }
    else if(OJconfig["allyChat_continueLoading_" + OJconfig["uni"]] == 1)
    {
        OJcreateMenu(1);
        $("#OJobs_panel").hide();
    }
});

function dAlert(text)
{
    var arr = text.split(",");
    var alertText ="";
    arr.forEach(function(element, index) {
        while(element.length > 45)
        {
            var t = element.substr(0, 45);
            element = element.substr(45);
            alertText = alertText + "\n" + t;
        }
        alertText = alertText + "\n" + element;
    });
    alert(alertText);
}