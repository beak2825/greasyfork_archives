// ==UserScript==
// @name        Regex
// @namespace   http://wifi.com
// @include     http://callumacrae.github.io/regex-tuesday/
// @version     2.7
// @description help at regex challenge site
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14214/Regex.user.js
// @updateURL https://update.greasyfork.org/scripts/14214/Regex.meta.js
// ==/UserScript==

var script_link = 'https://greasyfork.org/scripts/14214-regex/code/Regex.user.js';

var elArray = document.getElementsByClassName("challenge");
var done = ["http://callumacrae.github.io/regex-tuesday/challenge1.html",
           "http://callumacrae.github.io/regex-tuesday/challenge2.html",
           "http://callumacrae.github.io/regex-tuesday/challenge3.html",
           "http://callumacrae.github.io/regex-tuesday/challenge4.html",
           "http://callumacrae.github.io/regex-tuesday/challenge5.html",
           "http://callumacrae.github.io/regex-tuesday/challenge6.html",
           "http://callumacrae.github.io/regex-tuesday/challenge7.html",
           "http://callumacrae.github.io/regex-tuesday/challenge8.html",
           "http://callumacrae.github.io/regex-tuesday/challenge9.html",
           "http://callumacrae.github.io/regex-tuesday/challenge10.html",
           "http://callumacrae.github.io/regex-tuesday/challenge11.html",
           "http://callumacrae.github.io/regex-tuesday/challenge12.html",
           "http://callumacrae.github.io/regex-tuesday/challenge13.html",
           "http://callumacrae.github.io/regex-tuesday/challenge14.html",
           "http://callumacrae.github.io/regex-tuesday/challenge15.html",
           "http://callumacrae.github.io/regex-tuesday/challenge16.html",
           "http://callumacrae.github.io/regex-tuesday/challenge17.html",
           "http://callumacrae.github.io/regex-tuesday/challenge18.html",
           "http://callumacrae.github.io/regex-tuesday/challenge19.html",
           "http://callumacrae.github.io/regex-tuesday/challenge20.html"];

//alert(elArray[0].parentElement.parentElement.parentElement.innerHTML);

var counter = elArray.length;
for(i = 0; i< elArray.length; i++){
  //alert(elArray[i].href);
  if(contains(elArray[i].href, done)){
     elArray[i].style.backgroundColor = "limegreen";  
     counter--;
  }
}
if(counter != 0)
    elArray[0].parentElement.parentElement.parentElement.innerHTML = "<h2 style='background-color:red'>Still " + counter + " challenges left</h2>" + elArray[0].parentElement.parentElement.parentElement.innerHTML;
else
    elArray[0].parentElement.parentElement.parentElement.innerHTML = "<h2 style='background-color:limegreen'>No challenges left</h2>" + elArray[0].parentElement.parentElement.parentElement.innerHTML;
function contains(myValue, myArray)
{
    var count=myArray.length;
    for(var i=0;i<count;i++)
    {
        if(myArray[i]== myValue){return true;}
    }
    return false;
}
function updateCheck(forced)
{
    if ((forced) || (parseInt(GM_getValue('SUC_last_update', '0')) + 86400000 <= (new Date().getTime()))) // Checks once a day (24 h * 60 m * 60 s * 1000 ms)
    {
        try
        {
            GM_xmlhttpRequest(
                {
                    method: 'GET',
                    url: script_link,
                    headers: {'Cache-Control': 'no-cache'},
                    onload: function(resp)
                    {
                        var local_version, remote_version, rt, script_name;
                        
                        rt=resp.responseText;
                        GM_setValue('SUC_last_update', new Date().getTime()+'');
                        var re = /@version\s*(.*?)\s/m; 
                        remote_version=parseFloat(re.exec(rt)[1]);
                        local_version=parseFloat(GM_getValue('SUC_current_version', '-1'));
                        if(local_version!=-1)
                        {
                            script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];
                            GM_setValue('SUC_target_script_name', script_name);
                            if (remote_version > local_version)
                            {
                                if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?'))
                                {
                                    GM_openInTab(script_link);
                                    GM_setValue('SUC_current_version', remote_version);
                                }
                            }
                        }
                        else
                            GM_setValue('SUC_current_version', remote_version+'');
                    }
                });
        }
        catch (err)
        {
            if (true)
                alert('An error occurred while checking for updates:\n'+err);
        }
    }
}


updateCheck();