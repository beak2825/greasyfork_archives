// ==UserScript==
// @name         jawz Kronopin
// @version      1.1
// @description  Classified
// @author      jawz
// @match		https://www.mturkcontent.com/dynamic/hit?assignmentId=*
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21390/jawz%20Kronopin.user.js
// @updateURL https://update.greasyfork.org/scripts/21390/jawz%20Kronopin.meta.js
// ==/UserScript==

$('table:contains("Log-in to LinkedIn")').hide();

var links = document.links;
var info = [];

function runScan() {
    for (i = 0; i < 6; i++) {
        var imp = "Q" + (i + 1) + "Url";
        getData(links[i].href, imp, i+1);
    }
}

if ($('#submitButton').val() == "Submit")
    runScan();
else
    document.body.style.background = "#ff0066"
    
var btn = document.createElement("BUTTON");
btn.innerHTML = "Reload";
btn.type = "button";
btn.onclick = function() { location.reload(); }

$('b:contains("NA if the company")').append (btn);

var btn = document.createElement("BUTTON");
btn.innerHTML = "Login";
btn.type = "button";
btn.onclick = function() { window.open("https://www.linkedin.com/uas/login?goback=&trk=hb_signin",'_blank');; }

$('b:contains("NA if the company")').append (btn);


function getData(lurl, inputA, y) {
GM_xmlhttpRequest //GET TO DATA
	({
    	method: "GET",
        url: lurl,
        onload: function (results)
        	{
                rdata = results.response.replace(/(\r\n|\n|\r)/gm,"");
                //if (inputA == "Q4Url")
                //    GM_setClipboard(rdata)
                ////Employees On Linkedin////
                if (rdata.indexOf('employeeCount":') > 0) {
                	var emp = rdata.split('employeeCount":');
                	
                    emp = emp[1].split(",");
                	emp = emp[0]
                } else if (rdata.indexOf("We're sorry but the company you are looking for does not exist")  > 0 || rdata.indexOf('but the company you are looking for is not ') > 0)
                    var emp = "NA"
                else
                    var emp = "0"
                
                
                $( "input[name='" + inputA + "']" ).val(emp)
                info[y] = $('#Q' + y + 'Url').val()
                if (info[y] == "NA")
                    info[y] = 0;
                
                if ($('#Q1Url').val() != "" && $('#Q2Url').val() != "" && $('#Q3Url').val() != "" && $('#Q4Url').val() != "" && $('#Q5Url').val() != "" && $('#Q6Url').val() != "") {
                    if (info[1] + info[2] + info[3] + info[4] + info[5] + info[6] > 0)
                        setTimeout(function(){ $('#submitButton').click(); }, 250);
                    else
                        document.body.style.background = "#ff0066"
                } 
            }
	});
}


