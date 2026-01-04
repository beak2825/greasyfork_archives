// ==UserScript==
// @name        Automated SSO Testing
// @namespace   ota.com
// @include     *.ourtownamerica.com/intra/api/forms/zip_checker/vcss3/steps.php
// @version     3
// @grant       none
// @description For testing OTA's SSO
// @downloadURL https://update.greasyfork.org/scripts/30867/Automated%20SSO%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/30867/Automated%20SSO%20Testing.meta.js
// ==/UserScript==

$(function(){
  wait().then(function(){
    getRandomUser().then(function(user){
      $(".form-data-1").find(".button").click();
      wait().then(function(){
        $("#firstname").val(user.name.first);
        $("#lastname").val(user.name.last);
        $("#companyname").val("Auto Testing");
        $("#phone-1").val(user.phone);
        $("#email").val(user.email);
        var options = $("#check1 > option");
        options[Math.floor(Math.random() * options.length)].selected = true;
        $("#address-1").val(user.location.street);
        $("#city").val(user.location.city);
        $("#mainstate").val(user.location.state);
        $('#zip').val(user.location.zip);
        $(".next-step-3").click();
        waitForElement(".swal2-styled:visible").then(function(){
          $(".swal2-styled:visible").click();
          wait().then(function(){
            $(".want").prop("checked", true);
            $(".form-data-2").click();
            wait().then(function(){
              $("#website").val(getRandomWebsite());
              $("#alt-phone").val(user.cell);
              $("#comments").val("This is an automated test");
              $(".fill-form-2").click();
              wait().then(function(){
                if(Math.random() > .5) $("#monthly-2").click();
                else $("#yearly-2").click();
                var $plan = $(".cd-pricing-wrapper").eq(Math.floor(Math.random()*2));
                while($plan.hasClass("unavailable-plan")) $plan = $(".cd-pricing-wrapper").eq(Math.floor(Math.random()*2));
                $plan.click();
                $(".check-plan").click();
                wait().then(function(){
                  $(".check-logo").click();
                  wait().then(function(){
                    $(".swal2-cancel").click();
                    wait().then(function(){
                      $(".swal2-confirm").click();
                      var cc = cc_gen();
                      $('#card_name').val(user.name.first + ' ' + user.name.last);
                      $('#card_billing1').val(user.location.street);
                      $('#card_city').val(user.location.city);
                      $('#card_state').val(user.location.state);
                      $('#card_zip').val(user.location.zip);
                      $('#CreditCardType').val(cc.issuer);
                      console.log(cc.issuer);
                      $('#card_number').val(cc.cc);
                      $('#card_cvv').val(cc.cvv);
                      $('#card_month').val(("0"+cc.exp_month).substr(-2));
                      $('#card_year').val(cc.exp_year);
                      wait().then(function(){
                        $(".submitorder").click();
                        wait(2).then(function(){
                          $(".swal2-confirm").click();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

function getRandomWebsite(){
  var d = "yourmom,poop,ota,somewebsite,mysite,ihearttofart,applesauce".split(',');
  var p = "com,net,org".split(',');
  return d[Math.floor(Math.random() * 6)]+"."+p[Math.floor(Math.random() * 2)];
}

function waitForElement(selector){
  return new Promise(function(done){
    var i = setInterval(function(){
      if($(selector).length){
        clearInterval(i);
        done();
      }
    }, 500);
  });
}

function getRandomUser(){
  return new Promise(function(done){
    $.ajax({
      url: 'https://randomuser.me/api/',
      dataType: 'json',
      success: function (data) {
        var zip = "01001,01301,01337,01342,01351,01360,01376,01420".split(",")[Math.floor(Math.random()*8)];
        data.results[0].location.zip = zip;
        data.results[0].location.state = "Florida";
        done(data.results[0]);
      }
    });
  });
}

function wait(time){
  if(undefined === time) time = 1;
  return new Promise(function(done){
    setTimeout(done, time*1000);
  });
}

function cc_gen() {
    var pos;
    var str = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var sum = 0;
    var final_digit = 0;
    var t = 0;
    var len_offset = 0;
    var len = 0;
    var issuerIndex = Math.floor(Math.random() * 2);
    var issuers = ['Mastercard', 'Visa', 'Discover'];
    var issuer = issuers[issuerIndex];
    var CVV = (Math.floor(Math.random() * 9) + 1 + "")
        .concat(Math.floor(Math.random() * 9) + 1 + "")
        .concat(Math.floor(Math.random() * 9) + 1 + "");
    var exp_year = new Date().getFullYear() + Math.floor(Math.random() * 4) + 1;
    var exp_month = Math.floor(Math.random() * 12) + 1
    switch (issuer) {
        case "Visa":
            str[0] = 4;
            pos = 1;
            len = Math.random() > .5 ? 16 : 13;
            break;
        case "Mastercard":
            str[0] = 5;
            t = Math.floor(Math.random() * 5) % 5;
            str[1] = 1 + t; // Between 1 and 5.
            pos = 2;
            len = 16;
            break;
        case "Discover":
            str[0] = 6;
            str[1] = 0;
            str[2] = 1;
            str[3] = 1;
            pos = 4;
            len = 16;
            break;
    }
    while (pos < len - 1)
        str[pos++] = Math.floor(Math.random() * 10) % 10;
    len_offset = (len + 1) % 2;
    for (pos = 0; pos < len - 1; pos++) {
        if ((pos + len_offset) % 2) {
            t = str[pos] * 2;
            if (t > 9) t -= 9;
            sum += t;
        } else  sum += str[pos];
    }
    final_digit = (10 - (sum % 10)) % 10;
    str[len - 1] = final_digit;
    t = str.join('');
    t = t.substr(0, len);
    return {
        cc: t,
        cvv: CVV,
        issuer: issuer,
        exp_year: exp_year,
        exp_month: exp_month
    }
}
