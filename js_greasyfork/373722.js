// ==UserScript==
// @name         Report Filter
// @namespace    https://v3rmillion.net/
// @version      1
// @description  To filter reports for specific sections.
// @author       You
// @match        https://v3rmillion.net/modcp.php?action=reports*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373722/Report%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/373722/Report%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("tborder")[1].outerHTML = "<span style='font-weight:bold;color:yellow;'>Filter Reports: </span><select onchange='if (this.selectedIndex) document.location=document.location.href.replace(/&r_type=[0-9]{1,2}/gm, \"\") + \"&r_type=\" + this.selectedIndex;' name='comment' id='filter_report'><option value='2A - Cross-Posting'>2A - Cross-Posting</option><option value='2B - Double-Posting'>2B - Double-Posting</option><option value='2C - 1-word topics/posts'>2C - 1-word topics/posts</option><option value='2D - General Spam'>2D - General Spam</option><option value='2E - Wrong Section Posting'>2E - Wrong Section Posting</option><option value='2F - Disrespectful/Vulgar Posting'>2F - Disrespectful/Vulgar Posting</option><option value='2G - Pornographic Content'>2G - Pornographic Content</option><option value='2H - English Language'>2H - English Language</option><option value='2I - Writing Style'>2I - Writing Style</option><option value='2J - Topic Titles'>2J - Topic Titles</option><option value='2M - Multi-Accounting'>2M - Multi-Accounting</option><option value='2N - Necroposting'>2N - Necroposting</option><option value='2O - Filter Evasion'>2O - Filter Evasion</option><option value='2P - Homophobia and/or Racism'>2P - Homophobia and/or Racism</option><option value='2Q - Perverted Exploiting'>2Q - Perverted Exploiting</option><option value='2R - Fraud/Carding'>2R - Fraud/Carding</option><option value='2S - Actual Money'>2S - Actual Money</option><option value='2T - Unauthorised Sales'>2T - Unauthorised Sales</option><option value='2U - Sale Quality'>2U - Sale Quality</option><option value='3A - Avatar Size'>3A - Avatar Size</option><option value='3B - Impersonation'>3B - Impersonation</option><option value='3C - Inappropriate Avatar'>3C - Inappropriate Avatar</option><option value='4A - Pornographic Links'>4A - Pornographic Links</option><option value='4B - Gore'>4B - Gore</option><option value='4C - Download Links (no VT)'>4C - Download Links</option><option value='4E - Malware'>4E - Malware</option><option value='4F - Trollware'>4F - Trollware</option><option value='4G - Inappropriate Links'>4G - Inappropriate Links</option><option value='4I - Link Obfuscation/Shortening'>4I - Link Obfuscation/Shortening</option><option value='4J - Piracy/Torrenting'>4J - Piracy/Torrenting</option><option value='4K - Advertising'>4K - Advertising</option><option value='5A - Obnoxious Siggy'>5A - Obnoxious Siggy</option><option value='7* - Privacy Violation'>7* - Privacy Violation</option></select>" + document.getElementsByClassName("tborder")[1].outerHTML;
    var sel=document.getElementById('filter_report');
	var getend = document.location.href.match(/&r_type=[0-9]{1,2}$/gm)[0];
    var successcount = 0;
    if(getend!=null){
        getend = document.location.href.match(/[0-9]{1,2}$/gm);
        document.getElementById("filter_report").options[getend].selected = 'selected';
        var seloptions = sel.options[getend].value;
        var post_rep_type;

        var all_as = document.getElementsByTagName("a");
        for(var a = 0; a<all_as.length;a++){

            if(all_as[a].href.indexOf("modcp.php?action=reports")>-1){
              all_as[a].href = all_as[a].href.replace(/&r_type=[0-9]{1,2}/gm, "") + "&r_type=" + getend;
            }


            if(all_as[a].href.indexOf("showthread.php")>-1 && all_as[a].href.indexOf("#")==-1){
                var boo = all_as[a].parentNode.parentNode.parentNode.getElementsByClassName("trow1")[1] || all_as[a].parentNode.parentNode.parentNode.getElementsByClassName("trow2")[1];
                if(boo!=undefined){
                    post_rep_type = boo.textContent.replace(/\n.*/gm, "");
                    if(post_rep_type!=seloptions){
                        var allchildren = all_as[a].parentNode.parentNode.parentNode.outerHTML = "<tr style='display:none;'>" + all_as[a].parentNode.parentNode.parentNode.innerHTML + "</tr>";
                    }else{
                      successcount++;
                    }
                }
            }
        }
        if(successcount==0){
          var pmatch = document.location.href.match(/page=[0-9]*/gm)
          var pnum = (pmatch!=null ? pmatch[0] : "1");
          pnum = pnum.replace("page=","");
          pnum++;
          setTimeout(function(){ window.location ="modcp.php?action=reports&page=" + pnum + "&r_type=" + getend; }, 2000);
        }
    }

})();