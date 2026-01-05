// ==UserScript==
// @name        KAT - Check Fake UL Request
// @namespace   CheckFaker
// @version     1.02
// @description Check UL requests against faker database
// @match       https://*.kat.cr/moderator/verify/tier1/*
// @downloadURL https://update.greasyfork.org/scripts/18480/KAT%20-%20Check%20Fake%20UL%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/18480/KAT%20-%20Check%20Fake%20UL%20Request.meta.js
// ==/UserScript==

$('<button id="checkRequests" class="icon16 textButton" style="padding:0px 5px; margin-left:10px;"><span></span>Check Requests on page</button><span id="spamPlaceholder" style="display:none"></span>').appendTo(".mainpart table tbody tr td h2");

function getWordList()
{
    $("#checkRequests").attr("disabled", "disabled");
    $("#checkRequests").css("background", "grey");
    $.ajax(
    {
        type: 'GET',
        url: "/community/show/phraselist/",
        success: function(data)
        {
            $("#spamPlaceholder").html(/<div id="content_17561446">([^<]+)<\/div>/.exec(data.html)[1]);
            console.log("done");
            checkRequests();
        },
        error: function (responseData, textStatus, errorThrown) 
        {
            alert('Error: Could not read thread');
        }
    });
}

function checkRequests()
{
    $( document ).ready(function()
    {
        var count = 0;
        var pattern = "\\b(" + $("#spamPlaceholder").text() + ")\\b";
        var regex = new RegExp(pattern, "gi");
        $("#spamPlaceholder").html("");
        $("tr[id^='request_']").each(function(index)
        {
            var request = $(this).find("td:eq(4)").text();
            var replaced = request.replace(regex, "<b style='color:red'>$1</b>");
            var matches = replaced.split("<b").length - 1;
            if (matches > 0)
            {
                $(this).find("td:eq(4)").html(replaced);
                $(this).addClass("faker");
                $(this).attr("matches", matches);
                count++;
            }
    //        checkEmail(index);
        });
        if (count > 0)
        {
            $('<label for="fakersOnly">Only show fakers?</label><input id="fakersOnly" type="checkbox" checked></input> - <label for="sensitivity">With at least </label><input id="sensitivity" type="number" min="1" max="10" value="1" /><span> matched phrases</span>').insertAfter(".mainpart table tbody tr td h2");
            $("#fakersOnly").change(function()
            {
                if ($(this).is(":checked"))
                {
                    $("tr[id^='request_']").hide();
                    $("tr[class*='faker']").filter(function() { return $(this).attr("matches") >= $("#sensitivity").val(); }).show();
                }
                else
                {
                    $("tr[id^='request_']").show();
                }
            });
            $("#sensitivity").change(function() { $("#fakersOnly").trigger("change"); });
            $("#fakersOnly").trigger("change");
        }
        alert(count + " faker(s) found");
    });
}

function checkEmail(current)
{
    var selector = $("tr[id^='request_']:eq(" + current + ")").find("td:eq(2)");
    var domain = $(selector).text().split("@")[1];
    domain = domain.split(" ")[0];
    $.ajax(
    {
        type: 'GET',
        url: 'https://jsonp.afeld.me/?url=http://gazza911.96.lt/fakerdb/api_get.php?email=' + domain,
        crossDomain: true,
        dataType: 'json',
        success: function(data) 
        {
            console.log(data);
            if (data == 1) 
            { 
                $(selector).html("<b style='color:red'>" + $(selector).text() + "</b>");
                $(selector).parent().addClass("faker");
            }
            else 
            { 
                $(selector).html("<span style='color:green'>" + $(selector).text() + "</span>");
            }
        },
        error: function (responseData, textStatus, errorThrown) 
        {
            console.log('GET failed. Error: ' + errorThrown);
        }
    });
}

$("#checkRequests").click(getWordList);