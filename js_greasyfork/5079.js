// ==UserScript==
// @name        KAT - Show All Friends
// @namespace   ShowAllFriends
// @version     1.14
// @description Show all friends on KAT in one page
// @require		http://code.jquery.com/jquery-latest.js
// @match     http://kickass.to/user/*/friends/
// @match     https://kickass.to/user/*/friends/
// @downloadURL https://update.greasyfork.org/scripts/5079/KAT%20-%20Show%20All%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/5079/KAT%20-%20Show%20All%20Friends.meta.js
// ==/UserScript==

$('<div id="placeholder" style="visibility: hidden;"></div>').insertBefore(".pages");

var next = 2;
var max = $(".pages > a:last").text();
var self = $.trim($(".nickname").contents().get(0).nodeValue);

// Will sort alphabetically at the end if 'sorting' is set to 1 [Disabled by default as it can take quite a bit of time]
var sorting = 0;

function load(page)
{
    if (next <= max)
    {
        $("#placeholder").load("https://kickass.to/user/" + self + "/friends/?page=" + page);    
        window.setTimeout(function()
        {
          var response = $("#placeholder").html();  
          $("#placeholder").html("");
          response = response.replace(/.*?;{/, "{");                        
          try 
          { 
              var jsonFile = JSON.parse(response);
              var html = jsonFile.html.substring(jsonFile.html.indexOf('<div class="badge">'),jsonFile.html.indexOf('<div class="pages botmarg5px floatright">'));
              $(".overauto").append(html);
              console.log('Page ' + page + ' successfully loaded');
              next++;
              load(next);
          }
            catch(error) 
            {
                var length = (page - 1) * 46 - 1;
                $(".badge:gt(" + length + ")").remove();
                console.log("Could not parse page (automatically retrying) - If you frequently get this, increase the setTimeout timer (default is 1500)");
                load(next);        
            }
        }, 1500);
    }
	else 
    { 
		if (sorting == "1" && max < 4) { sort(); } // if you would like to sort afterwards, it is advisable to keep the 'max is less than' number (of pages) quite low as this can be a lengthy process 
        $(".overauto").prepend('Filter By Group: <select id="filter" style="margin-right:10px"><option value="No Filter">No Filter</option><option value="User">User</option><option value="Uploader">Uploader</option><option value="Verified uploader">Verified Uploader</option><option value="Super User">Super User</option><option value="Former Translator">Former Translator</option><option value="Translator">Translator</option><option value="KAT Elite">KAT Elite</option><optgroup label="Moderators"><option value="Torrent Helper">Torrent Helper</option><option value="Forum Moderator">Forum Moderator</option><option value="Super Moderator">Super Moderator</option></optgroup><optgroup label="Staff/Admins"><option value="KAT Staff">KAT Staff</option><option value="Site Administrator">Site Administrator</option><option value="Other Admins">Other Admins</option></optgroup></select>Online Only? <input type="checkbox" id="online"></input><br>');
        $("#filter").bind("change", function()
		{
            var group = $("#filter").val();
            if (group != "No Filter" && group != "Other Admins")
            {
            	$(".badge").hide();
				$('.badge span[class*="aclColor"]').each(function()
    			{              
                    if ($(this).text() == group) 
                    { 
                        $(this).parents(".badge").show();
                    }
                });
            }
            else if (group == "Other Admins")
            {
                $(".badge").hide();
                $(".aclColor_").parents(".badge").show(); // Mr. people
				$('.badge span[class*="aclColor_10"]').each(function()
    			{              
                    if ($(this).text() != "Site Administrator") 
                    { 
                        $(this).parents(".badge").show();
                    }
                });
            }
            else { $(".badge").show(); }
            $(".hidden").removeClass("hidden");
            $("#online").trigger("change");
		});
        $("#online").bind("change", function() 
            {
                if($(this).is(":checked")) 
                { 
                    $(".badgeSiteStatus > .offline:visible").parents(".badge").addClass("hidden");
                    $(".badgeSiteStatus > .offline:visible").parents(".badge").hide(); 
                }
                else
                {
                    $(".hidden").show();
                    $(".hidden").removeClass("hidden");
                }
            });
    }
};

var sort = function()
{
    var info = [];
    $('.badge').each(function()
    {                     
        var all = $(this).html();
        var user = $(this).find("span > a").text();
        info.push({"html":all, "name":user});
        $(this).remove();
    });
    info.sort(function(a, b) { return a.name.localeCompare(b.name);	});
    
    for (i = 0; i < info.length; i++)
	{
   		$('.overauto').append('<div class="badge">' + info[i].html + '</div>');
	}
};

$(".pages").hide();
load(next);