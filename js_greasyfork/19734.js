// ==UserScript==
// @name Ubiquiti nastaveni
// @version 1.3
// @description -
// @author cuckycz
// @match https://*/system.cgi
// @match https://*/services.cgi
// @match https://*/advanced.cgi
// @match https://*/login.cgi*
// @match http://*/login.cgi*
// @grant none
// @namespace https://greasyfork.org/users/39040
// @downloadURL https://update.greasyfork.org/scripts/19734/Ubiquiti%20nastaveni.user.js
// @updateURL https://update.greasyfork.org/scripts/19734/Ubiquiti%20nastaveni.meta.js
// ==/UserScript==



$(function(){
  
  var url_pathName = window.location.pathname;
  
  if(url_pathName == '/login.cgi'){
    // vyber mezi klientem a zarizenim
    $(document.body).append("<div style='text-align:center;'><input type='button' id='btnklient' value='klient' style='margin: 10px; padding: 10px;' /><input type='button' id='btnzarizeni' value='zarizeni' style='margin: 10px; padding: 10px;' /></div>");
    $("#btnklient").click(function(){
          $("#username").val("klient");
          $("#password").val("Cl1€ntRac1ngnet");
          $('#loginform').submit();
    });
    $("#btnzarizeni").click(function(){
          $("#username").val("zarizeni");
          $("#password").val("R@c1ngN€t");
          $('#loginform').submit();
    });
  }
  
  
  // login stranka 
  $("#username").val("ubnt");
  $("#password").val("123555");
  
  // nastaveni upravy hesla 
  $("#admin_passwd_trigger").click();
  $("#OldPassword").val("Cl1€ntRac1ngnet");
  

  // nastaveni uzivatelskeho jmena 
  $("#adminname").val("klient");

  // nastaveni hesla 
  $("#NewPassword").val("Cl1€ntRac1ngnet");
  $("#NewPassword2").val("Cl1€ntRac1ngnet");

  // nastaveni casoveho pasma
  $("#timezone").val("GMT-1");
  
  // snmp nastaveni
  $("#snmpStatus").prop("checked", true);
  $("#snmpCommunity").val("racingnet");
  $("#snmpContact").val("355335535");
  $("#snmpLocation").val("-");
  
  // nastaveni  portu
  $("#httpsport").val("46123");
  $("#httpport").val("46120");
  $("#sshport").val("46222");
  
  // ntp nastaveni
  $("#ntpStatus").prop("checked", true);
  $("#ntpServer").val("10.0.10.5");
  
  // zapnuti syslogu
  $("#syslog_status").prop("checked", true);
  
  // vypnuti discovery a cdp
  $("#discovery_status").prop("checked", false);
  $("#cdp_status").prop("checked", false);

  // zapnuti eirp
  $("#eirp_status").prop("checked", true);
  
});