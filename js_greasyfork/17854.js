// ==UserScript==
// @name         jawz Steve Sears 2.0
// @version      1.0
// @description  something useful
// @author       jawz
// @match		 https://www.mturkcontent.com/dynamic/hit?assignmentId=*
// @match        https://s3.amazonaws.com/*
// @match		 https://www.linkedin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/17854/jawz%20Steve%20Sears%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/17854/jawz%20Steve%20Sears%2020.meta.js
// ==/UserScript==

var links = document.links;
var url = links[1].href;
console.log(links[1].href);

GM_xmlhttpRequest //GET TO DATA
	({
    	method: "GET",
        url: url,
        onload: function (results)
        	{
                rdata = results.response.replace(/(\r\n|\n|\r)/gm,"");
                
                ////Employees On Linkedin////
                //if (rdata.indexOf('extra_biz_employees_deg_connected">') > 0) {
                //	var emp = rdata.split('extra_biz_employees_deg_connected">');
                //	emp = emp[1].split("</a>");
                //	emp = emp[0];
                //} else if (rdata.indexOf("We're sorry but the company you are looking for does not exist") > 0)
                //    var emp = "N/A";
                //else
                //    var emp = "0";
                    
                //console.log("Employees On Linkedin: " + emp)
                
                ////Website////
                //if (rdata.indexOf('rel="nofollow">') > 0) {
                //	var web = rdata.split('rel="nofollow">');
                //	web = web[1].split("</a>");
                //	web = web[0]
                //	console.log("Website: " + web)
                //}
                
                ////Industry//// 
                if (rdata.indexOf('<h4>Industry</h4><p>') > 0) {
                	var ind = rdata.split('<h4>Industry</h4><p>');
                	ind = ind[1].split("</p>");
                	ind = ind[0]
                    if (ind==null)
                        ind = 'N/A'
                	//console.log("Industry: " + ind)
                }
                
                ////Type//// 
                //if (rdata.indexOf('<h4>Type</h4><p>') > 0) {
                //	var typ = rdata.split('<h4>Type</h4><p>');
                //	typ = typ[1].split("</p>");
                //	typ = typ[0]
                //	console.log("Type: " + typ)
                //}
                
                ////Headquarters//// 
                	////Street Address////
                	//if (rdata.indexOf('"streetAddress">') > 0) {
                	//	var str = rdata.split('"streetAddress">');
                	//	str = str[1].split("</span>");
                	//	str = str[0]
                	//	console.log("Street Address: " + str)
                    //}
                    
                    ////Locality//// 
                	//if (rdata.indexOf('"addressLocality">') > 0) {
                    //	var loc = rdata.split('"addressLocality">');
                	//	loc = loc[1].split(",</span>");
                	//	loc = loc[0]
                	//	console.log("Locality: " + loc)
                    //}
                    
                    ////Region////
                	//if (rdata.indexOf('"addressRegion">') > 0) {
                    //	var reg = rdata.split('"addressRegion">');
                	//	reg = reg[1].split("</abbr>");
                	//	reg = reg[0]
                	//	console.log("Region: " + reg)
                    //}
                
                	////Country//// 
                    if (rdata.indexOf('"addressCountry">') > 0) {
                		var str = rdata.split('"addressCountry">');
                		str = str[1].split("</span>");
                		str = str[0]
                        if (str==null)
                        str = 'N/A'
                		//console.log("Country: " + str)
                    }
                
                    ////Postal Code//// 
                	if (rdata.indexOf('"postalCode">') > 0) {
                    	var pos = rdata.split('"postalCode">');
                		pos = pos[1].split("</span>");
                		pos = pos[0]
                        if (pos==null)
                        pos = 'N/A'
                		//console.log("Postal Code: " + pos)
                    }
                    
                ////Company Size//// 
                if (rdata.indexOf('<h4>Company Size</h4><p>') > 0) {
                	var com = rdata.split('<h4>Company Size</h4><p>');
                	com = com[1].split("</p>");
                	com = com[0]
                    if (com==null)
                        com = 'N/A'
                	//console.log("Company Size: " + com)
                }
                
                ////Founded//// 
                //if (rdata.indexOf('<h4>Founded</h4><p>') > 0) {
                //	var fou = rdata.split('<h4>Founded</h4><p>');
                //	fou = fou[1].split("</p>");
                //	fou = fou[0]
                //	console.log("Founded: " + fou)
                //}
                
                //if (ind.indexOf("Marketing") >= 0 )
                //    document.getElementById('marketing_company').value= "yes";
                //else
                //    document.getElementById('marketing_company').value= "no";
                
                //com = com.replace("employees", "");
                if(ind)
                ind = ind.replace('&amp;', '&');

                document.getElementById('industry').value= ind;
                document.getElementById('employees').value= com;
                document.getElementById('zipcode').value= pos;
                document.getElementById('country').value= str;
                
                if (document.getElementById('industry').value=='undefined')
                    document.getElementById('industry').value='N/A';
                if (document.getElementById('employees').value=='undefined')
                    document.getElementById('employees').value='N/A';
                if (document.getElementById('zipcode').value=='undefined')
                    document.getElementById('zipcode').value='N/A';
                if (document.getElementById('country').value=='undefined')
                    document.getElementById('country').value='N/A';
                
                if (document.getElementById('industry').value=='')
                    document.getElementById('industry').value='N/A';
                if (document.getElementById('employees').value=='')
                    document.getElementById('employees').value='N/A';
                if (document.getElementById('zipcode').value=='')
                    document.getElementById('zipcode').value='N/A';
                if (document.getElementById('country').value=='')
                    document.getElementById('country').value='N/A';
                
                
            }
});
