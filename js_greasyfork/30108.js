// ==UserScript==
// @name        TP-Link Router Interface Enhancer
// @description Adds an extra "Client Name" column or information to several sub-pages of the TP-Link router web-interface.
// @namespace   localhost
// @include     http://192.168*/*/userRpm/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30108/TP-Link%20Router%20Interface%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/30108/TP-Link%20Router%20Interface%20Enhancer.meta.js
// ==/UserScript==

var MACaddr = {
  "12-34-56-78-90-AB": "(PC) Sample",
  "23-45-67-89-0A-BC": "(NAS) Sample",
  "34-56-78-90-AB-CD": "(Printer) Sample",
  "45-67-89-0A-BC-DE": "(TV) Sample",
  "56-78-90-AB-CD-EF": "(Smartphone) Sample",
  "67-89-0A-BC-DE-F1": "(Tablet) Sample"
};

function init() {
  if(location.href.includes("AssignedIpAddrListRpm.htm")) DHCP.DHCPClientsList();
  if(location.href.includes("FixMapCfgRpm.htm")) DHCP.AddressReservation();
  if(location.href.includes("WlanStationRpm")) Wireless.WirelessStatistics();
  if(location.href.includes("SystemStatisticRpm.htm")) SystemTools.Statistics();
}


var Wireless = {
  "WirelessStatistics": function() {
    $("#autoWidth").find("table").find("tr").each(function() {
      var ct = $(this).find("td").eq(1).text();
      var nt;
      if(ct==="MAC Address") {
        nt = '<td class="ListTC2" id="t_host_name">Client Name</td>';
      } else {
        nt = '<td class="ListC2">' + ((typeof MACaddr[ct]==="string") ? MACaddr[ct] : "-") + "</td>";
      }
      $(this).find("td").eq(1).after("<td>" + nt + "</td>");
    });    
  }
};

var DHCP = {
  "DHCPClientsList": function() {
    $("#autoWidth").find("table").find("tr").each(function() {
      var ct = $(this).find("td").eq(1).text();
      var cm = $(this).find("td").eq(2).text();
      var hn = ((typeof MACaddr[cm]==="string") ? '<span title="Original Name: ' + ct + '" style="font-weight: bold;">' + MACaddr[cm] + '</span>' : ct);
      if(ct!=="Client Name") $(this).find("td").eq(1).html(hn);
    });
  },
  "AddressReservation": function() {
    // code is currently identical to Wireless.WirelessStatistics();
    // keeping this separated for easy readability and distinctive method names
    Wireless.WirelessStatistics();
  }
};

var SystemTools = {
  "Statistics": function() {
    $("#autoWidth").find("table").find("tr").each(function() {
      if($(this).find("td").length===8) {
        $(this).find("td").eq(0).html('Client Name<br>IP Address');
      }
      if($(this).find("td").length===9) {
        var hi = $(this).find("td").eq(0).html().split('<br>');
        if(hi.length!==2) return;
        $(this).find("td").eq(0).html(((typeof MACaddr[hi[1]]==="string") ? MACaddr[hi[1]] : "-") + "<br>" + hi[0]);
      }
    });
  }
};

var $ = jQuery;
init();