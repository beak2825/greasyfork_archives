// ==UserScript==
// @name         Add Locations
// @namespace    */DealerApp/DealerAppLocations*
// @version      1.02
// @description  Autofill all the fields when adding a location on a dealer application
// @author       Eduardo Martinez
// @match        */DealerApp/DealerAppLocations*
// @exclude      https://*
// @updateURl    https://github.com/emartinez1621/scripts/raw/master/Add%20Locations.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18063/Add%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/18063/Add%20Locations.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

$('#AddLocation').click(function() {
  function randomPhone(){
  var areaCode = Math.floor(Math.random() * 1000);
  var nextThree = Math.floor(Math.random() * 1000);
  var finalFour = Math.floor(Math.random() * 10000);
  if(areaCode < 100){
    areaCode += 100;
  }
  if(nextThree < 100){
    nextThree += 100;
  }
  if(finalFour < 1000){
    finalFour += 1000;
  }
  return '('+ areaCode + ')' + '-' + nextThree + '-' + finalFour;
  }

  var retailerType = ['Furniture', 'Jewelers', 'Emporium', 'Audio', 'Electronics'];
  function randomRetalerType(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }


  $.ajax({
      url: 'http://api.randomuser.me/?nat=us',
    dataType: 'json',
    success: function(data){
      var user = data.results[0].user;
      var firstName = user.name.first;
      var lastName = user.name.last;
      var generatedEmail = user.email.replace(/ /g, "_");
      var email = generatedEmail.replace("@example", "@email");
      var address = user.location.street;
      var city = user.location.city;
      var retailerName = lastName + ' '+ city + ' ' + randomRetalerType(retailerType);
      var username = user.username;
      var bankAccount = Math.floor(Math.random() * 999999999);


      $('#Name').val(retailerName);
      $('#StreetLine1').val(address);
      $('#City').val(city);
      $('#StateID').val('UT');
      $('#PostalCode').val('84081');
      $('#PhoneNumber').val(randomPhone());
      $('#FaxNumber').val(randomPhone());
      $('#ContactName').val(firstName + '' + lastName);
      $('#EmailAddress').val(email);
      $('#RoutingNumber').val('124001545');
      $('#BankName').val('Chase');
      $('#AccountNumber').val(bankAccount);



    }
  });
});
