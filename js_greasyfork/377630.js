// ==UserScript==
// @name     [GB] 體育賽事資訊提示 (網頁版)
// @description 於聯賽頁顯示 EventCode, TournamentCode，賽事內頁顯示 GroupOptionCode 等資訊
// @include  http*://qasport*/Sports/Asia/Index.aspx*
// @include  http*://msp2*/Sports/Asia/Index.aspx*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version  2019.02
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/246085
// @downloadURL https://update.greasyfork.org/scripts/377630/%5BGB%5D%20%E9%AB%94%E8%82%B2%E8%B3%BD%E4%BA%8B%E8%B3%87%E8%A8%8A%E6%8F%90%E7%A4%BA%20%28%E7%B6%B2%E9%A0%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377630/%5BGB%5D%20%E9%AB%94%E8%82%B2%E8%B3%BD%E4%BA%8B%E8%B3%87%E8%A8%8A%E6%8F%90%E7%A4%BA%20%28%E7%B6%B2%E9%A0%81%E7%89%88%29.meta.js
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

GM_addStyle(".EventInfo { color:blue !important;padding-left:5px;text-align:left;padding-left:5px;cursor: copy; } .GroupOptionInfo {padding-left:5px;} ");

showEventInfo();


function showEventInfo()
{

    if ($("div.content-wrap").length > 0) {

        if ($("#a_eventinfo_switcher").length == 0) {
            $("#a_selectrule").after("<a id='a_eventinfo_switcher' href='javascript:void(0);' class='btn btn-click right' switch='off'>EventCode Off</a>");

            $("#a_eventinfo_switcher").on("click", function (e) {
                if ($(this).attr("switch") == "on") {
                    $(this).attr("switch", "off");
                    $(this).attr("style", "");
                    $(this).text("EventCode Off");

                    $("div.content-wrap").find(".EventInfo").remove();
                    $("div.content-wrap").find("div>ul>li").attr("style", "");
                }
                else {
                    $(this).attr("switch", "on");
                    $(this).attr("style", "background-color:#666;color:#EEE;");
                    $(this).text("EventCode On");
                }
            });
        }

        if ($("#a_groupoption_switcher").length == 0) {
            $("#div_select_odds_inner").after("<a id='a_groupoption_switcher' href='javascript:void(0);' class='btn btn-click right' switch='off'>GroupOption Off</a>");

            $("#a_groupoption_switcher").on("click", function (e) {
                if ($(this).attr("switch") == "on") {
                    $(this).attr("switch", "off");
                    $(this).attr("style", "");
                    $(this).text("GroupOption Off");

                    $("div[id^=div_eventcontent_]").find("span.GroupOptionInfo").remove();
                }
                else {
                    $(this).attr("switch", "on");
                    $(this).attr("style", "background-color:#666;color:#EEE;");
                    $(this).text("GroupOption On");
                }
            });
        }

        if ($("#a_eventinfo_switcher").attr("switch") == "on") {
            $("div.content-wrap").each(function() {
                var tourCode = "";
                var eventCode = "";
                var sportCode = "";

                if (($(this).attr("touid") !== undefined) && ($(this).attr("touid") != "")) {
                    tourCode = $(this).attr("touid");
                    eventCode = $(this).find("div.team-wrap").children("input[type=hidden]").attr("id").split("_")[2];
                    //sportCode = $(this).find("a[ref=ref_a_event_detail]").attr("id").split("_")[4];

                    if ($(this).find(".EventInfo").length == 0) {
                        $(this).find("div.team-wrap").prepend("<div class='EventInfo btn' data-ec='{0}'>EC:{0} TC:{1}</div>".format(eventCode, tourCode));
                    }
                }
                else if (($(this).attr("lvtou") !== undefined) && ($(this).attr("lvtou") != "")) {
                    tourCode = $(this).attr("lvtou");
                    eventCode = $(this).attr("id").split("_")[3];
                    //sportCode = $(this).attr("sid");

                    if ($(this).find(".EventInfo").length == 0) {
                        $(this).find("div.team-wrap").prepend("<div class='EventInfo btn' data-ec='{0}'>EC:{0} TC:{1}</div>".format(eventCode, tourCode));
                    }
                }

                var gname = $(this).find("a[rel=rel_li_rate][gname$=1X2]").length;
                
                if (gname > 0) {
                    $(this).find("div>ul>li").attr("style", "height:80px;");
                }
                else {
                    $(this).find("div>ul>li").attr("style", "height:60px;");
                }
            });

            $("div.content-wrap div.EventInfo").on("click", function (e) {
                copy($(this).data("ec"));
            });

        }

        if ($("#a_groupoption_switcher").attr("switch") == "on") {
            showGroupOption();
        }
    }

    //因畫面會定期重置，故每隔一段時間自動補上
    setTimeout(showEventInfo, 1000);
}

/* 賽事內頁用 */
function showOddDetail() {
    if ($("a[rel=rel_li_rate]").length > 0) {

        $("a[rel=rel_li_rate]").children().remove(".OddDetail");

        $("a[rel=rel_li_rate]").each(function(){

            var arySplit = $(this).attr("id").split("_");
            var eventCode = arySplit[5];
            var sportCode = arySplit[3];
            var sportTourCode = arySplit[4];
            var optionGUID = arySplit[6];

            if ((optionGUID !== undefined) && (optionGUID !== "")) {
                $(this).append("<span class='OddDetail' style='float:right;color:blue;padding-left:10px;'>(OptionGUID:{0})</span>".format(optionGUID));
            }

        });

        //因畫面會定期重置，故每隔一段時間自動補上
        setTimeout(showOddDetail, 3000);
    }
}

function showGroupOption() {
    if ($("div[id^=div_eventcontent_]").length > 0) {
        
        $("div[id^=div_eventcontent_]").each(function(){
            var groupOptionCode = $(this).attr("id").replace("div_eventcontent_", "");

            if ($(this).find(".GroupOptionInfo").length == 0) {
                $(this).find("h1.pre-match-title").append("<span class='GroupOptionInfo'>(GC:{0})</span>".format(groupOptionCode));
            }

        });

        //因畫面會定期重置，故每隔一段時間自動補上
        //setTimeout(showGroupOption, 3000);
    }
}

/* 可在開發者工具中，直接呼叫 function */
//unsafeWindow._showLiveEventDetail = showLiveEventDetail;
unsafeWindow._showEventDetail = showEventInfo;
unsafeWindow._showOddDetail = showOddDetail;
unsafeWindow._showGroupOption = showGroupOption;

