// ==UserScript==
// @name        Extract Surnames
// @name:en        Extract Surnames ds
// @description Extract Surnames from website
// @description:en Extract Surnames from websitedd sd
// @include     http://indiachildnames.com/surname/*
// @author      atul
// @version     1.0.7
// @grant       none
// @namespace   https://greasyfork.org/en/users/100769-atul-k
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40450/Extract%20Surnames.user.js
// @updateURL https://update.greasyfork.org/scripts/40450/Extract%20Surnames.meta.js
// ==/UserScript==
(function () {
  var lNames = "";
  var Names = $("#contentstable :first").children();
  var storedValue = localStorage.getItem('clodura');
  if (!storedValue) {
      storedValue = 'surname,lanaguages,origin\n';
      localStorage.setItem('clodura', storedValue);
  }
  
  for(var i=1; i < Names.length; i++) {
  	var surname = $(Names[i]).children('td :first').text();
    var language = $(Names[i]).children('td :nth-child(2)').text();
    language = language.split(',').join(';');
    var origin = $(Names[i]).children('td :last').text();
    origin = origin.split(',').join(';');
    var final = surname + "," + language + "," + origin;
    lNames = lNames + final + '\n';
  }
  
  storedValue = storedValue + lNames;  
  localStorage.setItem('clodura', storedValue);
  
  var a = $('table#clienttable > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table > tbody >tr > td:last').children('font:last ~ a')[0];
  
  if(a) {
      var href = a.href;
      href = href.split('http://indiachildnames.com/surname/')[1];
      window.location.replace(href);
  } 
  else {
      var c = $('table#clienttable > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table > tbody >tr > td:last').children('font:first ~ a:first')[0];
    
      if(c) {
          var href2 = c.href;
          href2 = href2.split('http://indiachildnames.com/surname/')[1];
          window.location.replace(href2);
      }
      else {
        // Start file download.
        download("surnames.csv",localStorage.getItem('clodura'));          
      }
  }

    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
  
}) ();
