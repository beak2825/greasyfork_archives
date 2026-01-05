// ==UserScript==
// @name        KAT - Move to Social Group
// @namespace   MoveToSG
// @version     1.02
// @description Allows you to move a thread to a social group
// @include     https://*kat.cr/community/show/*
// @include     https://*kat.cr/community/move/*
// @downloadURL https://update.greasyfork.org/scripts/12506/KAT%20-%20Move%20to%20Social%20Group.user.js
// @updateURL https://update.greasyfork.org/scripts/12506/KAT%20-%20Move%20to%20Social%20Group.meta.js
// ==/UserScript==

function getSG_ID()
{                               
    var link = $("#getSG").val();
    if (/https?:\/\/(?:sandbox\.)?kat\.cr\/community\/[^\/]+\/$/.test(link))
    {
        $("#getSG").off("change, keyup");
        $("#getSG").val("");
        $("#getSG").attr("placeholder", "Getting Social Group now");        
        $.ajax(
        {
            type: 'GET',
            url: link,
            dataType: 'json',
            success: function(data) 
            {
                var community = /community\/socialgroups\/(?:join|leave)\/\?group=(\d+)/;
                var match = community.exec(data.html);
                if (match != undefined)
                {
                    var cID = match[1];
                    console.log(cID);
                    if ($('option[value="' + cID + '"]').length == 0)                        
                    {
                        var name = /<h1 class="floatleft">([^<]+)<\/h1>/;
                        var match = name.exec(data.html);
                        var sgName = match[1];
                        $('<option value="' + cID + '">' + sgName + '</option>').appendTo("#SG");
                    }
                    $("select[name='forum']").val(cID);
                    $("#getSG").attr("placeholder", "Enter the Social Group URL");
                }
                else
                {
                    $("#getSG").attr("placeholder", "Please enter a valid Social Group URL");
                }
                $("#getSG").on("change, keyup", getSG_ID);                
            },
            error: function (responseData, textStatus, errorThrown) 
            {
                alert('GET failed: ' + textStatus);
            }
        });
    }
}

function setUp()
{
    $('<optgroup label="Social Groups" id="SG"></optgroup>').appendTo("select[name='forum']");
    // Add defaults
    // $('<option value="REPLACE WITH ID">REPLACE WITH NAME</option>').appendTo("#SG")
    // Uncomment the above line; remove the slashes // then change the value and name, it will appear in the dropdown at the bottom by default - copy and paste for more
    $('<input id="getSG" type="url" style="margin:5px 0px; width:260px;" placeholder="Enter the Social Group URL"></input>').insertAfter("select[name='forum']");
    $("#getSG").on("change, keyup", getSG_ID);
}

if (window.location.href.search("\/move\/") == -1)
{
    $('a[href^="/community/move/"]').one("click", function()
     { 
         setTimeout(setUp, 1000);
     });
}
else 
{
    setTimeout(setUp, 1000);
}

$( document ).ajaxError(function() {
  $("#getSG").attr("placeholder", "Please enter a valid Social Group URL");
  $("#getSG").on("change, keyup", getSG_ID);
});
