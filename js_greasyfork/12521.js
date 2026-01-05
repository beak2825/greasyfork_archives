// ==UserScript==
// @name        KAT - Parse SFS
// @namespace   ParseSFS
// @version     1.04
// @description Parses SFStest
// @include     https://*kat.cr/user/*
// @include     https://*kat.cr/user/*
// @downloadURL https://update.greasyfork.org/scripts/12521/KAT%20-%20Parse%20SFS.user.js
// @updateURL https://update.greasyfork.org/scripts/12521/KAT%20-%20Parse%20SFS.meta.js
// ==/UserScript==

var observer;

function parse()
{
    observer.disconnect();
    var allText = $("#fancybox-content div").text();
    var success = allText[35];
    console.log(success);
    if (success != undefined && success == 1)
    {
        $("#fancybox-content div").text("");
        var regex = /\[\w+] => stdClass Object[^[]+\[(?:normalized[^[]+\[)?\w+] => ([^\n]+)[^[]+\[\w+] => ([^\n]+)(?:(?:[^[)]+\[\w+] => ([^\n]+))?[^[]+\[\w+] => ([^\n]+)[^[]+\[\w+] => ([^\n]+))?\s+\)/g; 
        var m;
        var count = 0;
        while ((m = regex.exec(allText)) !== null) 
        {
            if (count === 0) $("#fancybox-content div").append("Username");
            else if (count === 1) $("#fancybox-content div").append("Email");
            else if (count === 2) $("#fancybox-content div").append("IP");
            count++;
            if (m[3] != undefined) 
            {
                $("#fancybox-content div").append(" appears in the SFS database with " + m[5] + "% confidence; it appears " + m[3] + " times and was last seen " + m[2] + " - It is a confirmed tor exit node");
            }
            else if (m[5] != undefined) 
            {
                $("#fancybox-content div").append(" appears in the SFS database with " + m[5] + "% confidence; it appears " + m[2] + " times and was last seen " + m[1]);
            }
            else
            {
                $("#fancybox-content div").append(" is not in the SFS database.");
            }
            $("#fancybox-content div").append("<br /><hr />");
        }
    }
    else
    {
        $("#fancybox-content div").append("<hr />KAT was not successful in querying the database");
    }
}

$('a[href^="/moderator/sfs/"]').on("click", function()
{ 
    var target = document.querySelector("#fancybox-content");
	observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		parse();
	  });
	});
 
	var config = { childList: true  };
	 
	observer.observe(target, config);
});