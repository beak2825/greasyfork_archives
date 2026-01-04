// ==UserScript==
// @name         Live domain switcher
// @namespace    livedomainswitcher
// @version      0.1
// @description  Switch email domain
// @match        https://account.live.com/AddAssocId*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36063/Live%20domain%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/36063/Live%20domain%20switcher.meta.js
// ==/UserScript==

var domains = [
                "outlook",
                "msn",
                "live",
                "hotmail",
                "passport",
              ];
var domainsExt = [
                   ".com",
                   ".net",
                   ".co.uk",
                   ".com.br",
                   ".com.fr",
                   ".com.au",
                   ".com.sq",
                   ".com.my",
                   ".com.tw",
                 ];

$('document').ready(function(){
  //alert("hello");
  var domainsString = '<select id="lds-domain">';
  for (var i = 0; i < domains.length; i++) {
    domainsString += '<option value="' + domains[i] + '">' + domains[i] + '</option>';
  }
  domainsString += '</select><select id="lds-domain-ext">';
  for (var i = 0; i < domainsExt.length; i++) {
    domainsString += '<option value="' + domainsExt[i] + '">' + domainsExt[i] + '</option>';
  }
  domainsString += '</select>';
  $('#idLiveOptionSection').first().before('Switch domain to: ' + domainsString + ' <button id="lds-switch">Switch</button>');
  $('#lds-switch').click(function(e){switchDomain();e.preventDefault();});
});

function switchDomain() {
  var targetDomain = $('#lds-domain').val();
  //alert(targetDomain);
  $.ajax({
    url: "https://account.live.com/AddAssocId?ru=&cru=&fl=",
    type: "POST",
    data: {
      canary: $('input#canary').val(),
      PostOption: $('input#PostOption').val(),
      SingleDomain: $('#lds-domain').val() + $('#lds-domain-ext').val(),
      UpSell: $('input#UpSell').val(),
      AddAssocIdOptions: $('input#idLiveOption').val(),
      AssociatedIdLive: 'a',
    },
  }).error(function(){
    alert("Error: May be login screen");
    return;
  }).success(function(data){
    //alert($('#idSingleDomain', data).text());
    if ($('#idSingleDomain', data).length > 0) {
      $('#idSingleDomain').text($('#idSingleDomain', data).text());
      $('#SingleDomain').attr("value", $('#SingleDomain', data).attr("value"));
    } else {
      alert("Error: domain not on results page. May be login screen");
    }
  });
}