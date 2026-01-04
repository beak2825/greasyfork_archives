// ==UserScript==
// @name IPD Improvements
// @description Improvements to IPD
// @namespace Violentmonkey Scripts
// @match https://webadmin.aut.ac.nz/admin/db/ipd/*
// @match https://netmon.aut.ac.nz/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/388311/IPD%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/388311/IPD%20Improvements.meta.js
// ==/UserScript==

//var type = document.getElementById("sys_target").value; //will be either 'incident' or 'u_request'

//Add a 'search for unused IP addresses' button to each IPD record
//search for &u= cause that means we're looking at a record and not a search
if ((document.body.innerHTML.includes("IPD / Edit Record") == true) && (document.location.href.includes("&u=")))
{
  GM_setValue("search_url", "")
  //will only work for first IP...
  var current_ip = document.getElementsByClassName("ipaddress")[0].value;
  var subnet = (current_ip.split(".").slice(0,3).join("."))
  var search_term = subnet+".*";
  var search_url = `https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=${search_term}&q1=all&Rows=1000&Set=0`
  
  var ipd_ip_search = document.createElement("button");
  ipd_ip_search.style = "white-space: nowrap; float: right";
  ipd_ip_search.innerHTML = "Search for unused IP addresses";
  ipd_ip_search.id = "ipd_ip_search_button";
  ipd_ip_search.onClick = "ipd_ip_search_button();";
  //ipd_ip_search.class = "";

  //The only location/combo shit that _actually works_
  //document.getElementById(`status.${type}.group_list`).insertAdjacentElement("afterend", ipd_ip_search);
  document.getElementsByName("__ADDINTERFACE")[1].insertAdjacentElement("afterend", ipd_ip_search);

  button = document.getElementById("ipd_ip_search_button");
  button.addEventListener("click", ipd_ip_search_button, false);

  function ipd_ip_search_button()
  {
    GM_setValue("search_url", search_url);
    GM_setValue("subnet", subnet);
    window.open(search_url, '_blank');
  }
}

//check if an IP range is being searched for
//https://www.aelius.com/njh/subnet_sheet.html
if ((document.location.href.includes(".*")) && (document.body.innerHTML.includes("Hide Secondary Interfaces")))
{
  //grab what could be the IP from the URL
  var search_string = document.location.href.split("v1=")[1].substring(0, document.location.href.split("v1=")[1].indexOf("&"));
  //if it's got a . then split it at the .'s check it's got 4 bits and check each section if it's a number. If all that passes then it's an IP. Suppose we could check if they're less than 255...
  if (search_string.includes("."))
  {
    var octets = search_string.split(".");
    if (octets.length == 4)
    {
      var i;
      var not_an_int = false;
      for (i = 0; i < 3; i++)
      {
        if (Number.isNaN(Number(octets[i])) == true)
        {
          not_an_int = true;
        }
      }
    }
  }
  if (not_an_int == false)
  {
    var subnet = octets.slice(0,3).join(".");
    //basically loop over every cell on the page, the cells containing the IP address is every 15th (starting from the 12th one)
    //we then check that it's in the range that we're searching for and if it is, put the last octet in the array (easier to manipulate later)
    var used_ips = [];
    var all_cells = document.getElementsByTagName("td");
    var i;
    for (i = 0; i < all_cells.length; i++) 
    { 
      if ((i - 10) % 15 == 0)
      {
        //drop the last octet so we can do the comparison
        if (all_cells[i].innerText.split(".").slice(0,3).join(".") == subnet)
        {
          //put the last octet in an array
          used_ips.push(Number(all_cells[i].innerText.split(".").slice(3)))
        }
      }
    }
    
    //now generate a list of unused IP addresses
    //just make two arrays for the subnets we mainly use
    var unused_ips_24 = [];
    var unused_ips_25 = [];
    var j;
    for (j = 1; j < 255; j++)
    {
      if (used_ips.includes(j) == false)
      {
        if (j < 129)
        {
          unused_ips_24.push(j);
        }
        else
        {
          unused_ips_25.push(j);
        }
      }
    }
    
    //figure out if there are more rows found than are being displayed, and if yes give a warning
    var row_amount_regex = /Found (\d*?) rows:/;
    var row_amount = Number(row_amount_regex.exec(document.body.innerHTML)[1]);
    var displayed_rows = Number(document.location.href.split("Rows=")[1].substring(0, document.location.href.split("Rows=")[1].indexOf("&")));
    var warning = document.createTextNode("WARNING: NOT ALL ROWS ARE BEING DISPLAYED SO THE LISTED IP ADDRESSES MAY BE INACCURATE");

    //Why does this look so fucky? So that when we put it on the page it'll look halfway decent. There's probably a better way of doing it but meh
    var ip_header = document.createTextNode(`These are the unused IPs for ${subnet}.*`);
    var ip_string_24 = "." + unused_ips_24.join(" .")
    var ip_string_24_header = document.createTextNode(subnet + ".0 subnet addresses")
    var ip_string_24_node = document.createTextNode(ip_string_24)
    
    var ip_string_25 = "." + unused_ips_25.join(" .")
    var ip_string_25_header = document.createTextNode(subnet + ".128 subnet addresses")
    var ip_string_25_node = document.createTextNode(ip_string_25)

    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    if (displayed_rows < row_amount)
    {
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(warning);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    }
    document.getElementsByTagName("font")[2].appendChild(ip_header);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(ip_string_24_header);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(ip_string_24_node);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(ip_string_25_header);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
    document.getElementsByTagName("font")[2].appendChild(ip_string_25_node);
    document.getElementsByTagName("font")[2].appendChild(document.createElement("br"));
  }
}

var error_500 = `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>500 Internal Server Error</title>
</head><body>
<h1>Internal Server Error</h1>
<p>The server encountered an internal error or
misconfiguration and was unable to complete
your request.</p>
<p>Please contact the server administrator at 
 you@example.com to inform them of the time this error occurred,
 and the actions you performed just before this error.</p>
<p>More information about this error may be available
in the server error log.</p>
</body></html>`;

//
//Throw an alert if the (first) IP listed in IPD isn't in the subnet as given by netmon
//

//GM_notification("a", "b");
var ip_address = document.getElementsByClassName("ipaddress")[0].value;
var switch_name;

GM_xmlhttpRequest({
  method: "GET",
  url: `https://netmon.aut.ac.nz/admin/monitor/FindMacAddress.pl?macaddress=${ip_address}`,
  onload: function(response) 
  {
    if (response == error_500)
    {
      GM_notification("500 ERROR!", "Received a 500 error, please refresh until I can get it to auto refetch in the background");
    }
    var switch_regex = /<a href='CiscoViewVlan.pl\?device=(.*?)'>/;
    var switch_name = switch_regex.exec(response.responseText)[1];
    GM_setValue("switch_name", switch_name);
  }
});

GM_xmlhttpRequest({
  method: "GET",
  url: `https://netmon.aut.ac.nz/admin/monitor/CiscoViewVlan.pl?device=${GM_getValue("switch_name")}`,
  onload: function(response) 
  {
    if (response == error_500)
    {
      GM_notification("500 ERROR!", "Received a 500 error, please refresh until I can get it to auto refetch in the background");
    }
    //will give us something like "156.62.149."
    var base_ip = ip_address.split(".").slice(0,3).join(".").concat(".");
    var last_octet = ip_address.split(".").slice(3);
    
    var subnet_regex = new RegExp(base_ip + "(\\d{1,3})\\/(2\\d)");
    var subnet_last_octet = Number(subnet_regex.exec(response.responseText)[1]);
    var subnet_type = Number(subnet_regex.exec(response.responseText)[2]);
    //do the comparisons and alert if it's in the wrong subnet
    if (subnet_type == 25)
    {
      if (subnet_last_octet == 0 && last_octet >= 128)
      {
          alert(`The IP address is out of range for this subnet! 
It should be between 0 and 128`);
      }
      //128 should be a broadcast address anyway
      else if (subnet_last_octet == 128 && last_octet <= 128)
      {
        alert(`The IP address is out of range for this subnet! 
It should be between 128 and 255`);
      }
      /*else
      {
        alert('good subnet');
      }*/
    }
  }
});
