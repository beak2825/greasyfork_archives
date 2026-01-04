// ==UserScript==
// @name     [GB] 體育賽事資訊提示 (手機版)
// @description 於聯賽頁顯示 EventCode, TournamentCode，賽事內頁顯示 GroupOptionCode 等資訊
// @include  http*://qasport*/M/*
// @include  http*://msp2*/M/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version  2019.02
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @namespace https://greasyfork.org/users/246085
// @downloadURL https://update.greasyfork.org/scripts/377633/%5BGB%5D%20%E9%AB%94%E8%82%B2%E8%B3%BD%E4%BA%8B%E8%B3%87%E8%A8%8A%E6%8F%90%E7%A4%BA%20%28%E6%89%8B%E6%A9%9F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377633/%5BGB%5D%20%E9%AB%94%E8%82%B2%E8%B3%BD%E4%BA%8B%E8%B3%87%E8%A8%8A%E6%8F%90%E7%A4%BA%20%28%E6%89%8B%E6%A9%9F%E7%89%88%29.meta.js
// ==/UserScript==


/*
擴充仿 C# 的 string.format 方法
*/

//可在Javascript中使用如同C#中的string.format
//使用方式 : var fullName = String.format('Hello. My name is {0} {1}.', 'FirstName', 'LastName');
String.format = function ()
{
    var s = arguments[0];
    if (s == null) return "";
    for (var i = 0; i < arguments.length - 1; i++)
    {
        var reg = getStringFormatPlaceHolderRegEx(i);
        s = s.replace(reg, (arguments[i + 1] == null ? "" : arguments[i + 1]));
    }
    return cleanStringFormatResult(s);
}
//可在Javascript中使用如同C#中的string.format (對jQuery String的擴充方法)
//使用方式 : var fullName = 'Hello. My name is {0} {1}.'.format('FirstName', 'LastName');
String.prototype.format = function ()
{
    var txt = this.toString();
    for (var i = 0; i < arguments.length; i++)
    {
        var exp = getStringFormatPlaceHolderRegEx(i);
        txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
    }
    return cleanStringFormatResult(txt);
}
//讓輸入的字串可以包含{}
function getStringFormatPlaceHolderRegEx(placeHolderIndex)
{
    return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
}
//當format格式有多餘的position時，就不會將多餘的position輸出
//ex:
// var fullName = 'Hello. My name is {0} {1} {2}.'.format('firstName', 'lastName');
// 輸出的 fullName 為 'firstName lastName', 而不會是 'firstName lastName {2}'
function cleanStringFormatResult(txt)
{
    if (txt == null) return "";
    return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
}

function copy(s) {
  $('body').append('<textarea id="clip_area"></textarea>');

  var clip_area = $('#clip_area');

  clip_area.text(s);
  clip_area.select();

  document.execCommand('copy');

  clip_area.remove();
}

/*
My Script
*/

var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
document.getElementsByTagName("HEAD")[0].appendChild(link);

GM_addStyle(".EventInfo { height: 16px;font-size: 10px;margin-top: -5px;margin-bottom: 5px;color: blue; } .GroupOptionInfo {padding-left:5px;}");

showEventInfo();


function showEventInfo()
{
    if ($("#a_eventinfo_switcher").length == 0) {
            $("#div_Login").prepend("<a id='a_eventinfo_switcher' href='javascript:void(0);' style='font-size: 20px;float: left;margin-top: 11px;margin-right: 12px;color:#fff;' switch='off'><i class='fa fa-toggle-off'></i></a>");

            $("#a_eventinfo_switcher").on("click", function (e) {
                if ($(this).attr("switch") == "on") {
                    $(this).attr("switch", "off");
                    $(this).children().remove();
                    $(this).prepend("<i class='fa fa-toggle-off'></i>");

                    $("div#divBetOptionContent div.game").children().remove(".EventInfo");
                    $("div[rel=divElGame] > div.game").children().remove(".EventInfo");
                }
                else {
                    $(this).attr("switch", "on");
                    $(this).children().remove();
                    $(this).prepend("<i class='fa fa-toggle-on'></i>");
                }
            });

        }

    if ($("#a_groupoption_switcher").length == 0) {
            $("#hEventContent").find("span.title").append("<a id='a_groupoption_switcher' href='javascript:void(0);' style='font-size: 20px;float: right;padding-left: 5px;color:#fff;' switch='off'><i class='fa fa-toggle-off'></i></a>");

            $("#a_groupoption_switcher").on("click", function (e) {
                if ($(this).attr("switch") == "on") {
                    $(this).attr("switch", "off");
                    $(this).children().remove();
                    $(this).prepend("<i class='fa fa-toggle-off'></i>");

                    $("div[id^=div_content_]").children().remove(".GroupOptionInfo");
                }
                else {
                    $(this).attr("switch", "on");
                    $(this).children().remove();
                    $(this).prepend("<i class='fa fa-toggle-on'></i>");
                }
            });

        }

    if ($("#a_eventinfo_switcher").attr("switch") == "on") {
        if (($("#divSecMenu > ul > li.calender.active").length > 0) || ($("#divSecMenu > ul > li.league.active").length > 0)) {
            showPrematchEventInfo();
        }
        else {
            if ($("#divSecMenu > ul > li.live.active").length > 0) {
                showLiveEventInfo();
            }
        }
    }

    if ($("#a_groupoption_switcher").attr("switch") == "on") {
            showGroupOption();
    }

    setTimeout(showEventInfo, 1000);
}


function showPrematchEventInfo()
{
    if ($("div[rel=divElGame] > div.game").length > 0) {

        //$("div[rel=divElGame] > div.game").children().remove(".EventInfo");

        $("div[rel=divElGame] > div.game").each(function() {
            var divTopside = $(this).children("a.topside");
            var rid = divTopside.attr("rid");
            if ((rid !== undefined) && (rid != "")) {
                var eventCode = rid.split("_")[2];
                var tourCode = rid.split("_")[1];

                if ($(this).find(".EventInfo").length == 0) {
                    divTopside.before("<div class='EventInfo' data-ec='{0}'>EC:{0} TC:{1}</div>".format(eventCode, tourCode));
                }
            }

        });

        $("div[rel=divElGame] > div.game > div.EventInfo").on("click", function (e) {
            //console.info('EventCode:', $(this).data("ec"));
            copy($(this).data("ec"));
        });
    }
}

function showLiveEventInfo()
{

    if ($("div#divBetOptionContent div.game").length > 0) {

        $("div#divBetOptionContent div.game").each(function() {
            var divTopside = $(this).children("a.topside");
            var rid = divTopside.attr("rid");
            if ((rid !== undefined) && (rid != "")) {
                var eventCode = rid.split("_")[2];
                var tourCode = rid.split("_")[1];

                if ($(this).find(".EventInfo").length == 0) {
                    divTopside.before("<div class='EventInfo' data-ec='{0}'>EC:{0} TC:{1}</div>".format(eventCode, tourCode));
                }
            }

        });

        $("div#divBetOptionContent div.game > div.EventInfo").on("click", function (e) {
            copy($(this).data("ec"));
        });
    }
}

function showGroupOption() {
    if ($("div[id^=div_content_]").length > 0) {

        $("div[id^=div_content_]").each(function(){
            var groupOptionCode = $(this).attr("id").replace("div_content_", "");

            if ($(this).find(".GroupOptionInfo").length == 0) {
                $(this).find("a.heading>span").append("<span class='GroupOptionInfo'>(GC:{0})</span>".format(groupOptionCode));
            }

        });

        //因畫面會定期重置，故每隔一段時間自動補上
        //setTimeout(showGroupOption, 3000);
    }
}
