// ==UserScript==
// @name         teaserfast.ru - keep tab open
// @description  auto "watch ads" without popups
// @author       WXC
// @match        https://teaserfast.ru/*
// @version      1.0
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at document-idle
// @noframes

// @namespace https://greasyfork.org/users/899925
// @downloadURL https://update.greasyfork.org/scripts/494146/teaserfastru%20-%20keep%20tab%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/494146/teaserfastru%20-%20keep%20tab%20open.meta.js
// ==/UserScript==


// start register here: https://teaserfast.ru/u/exik
// maybe you need Payeer wallet: https://payeer.com/?partner=286029
// thank you for support to all my referrals :)

// how to use? Just keep tab open ...

// please allow site notification for captcha, once every few hours
// if you see: {"error":true} ... you need to login (turn off this script)



$(document).ready(function() {

  var start = false;

  if( location.pathname == "/check-captcha/" ) {

      if( $(".alert_success").is(":visible") ) {
          location.href = "/extn/account/";
      }
      else {

          document.title = "CAPTCHA!";

          function notify() {
              const notification = new Notification("Need to solve CAPTCHA!", {
                  image: "https://67d3d41a52.cbaul-cdnwnd.com/def6fcc31a98c94adc127eae222fdbcd/200000013-5a03e5a042/450/LADY%20CAPTCHA-7.webp?ph=67d3d41a52"
              });
          }

          setInterval( function() {
              notify();
          }, ( 30 * 1000 ) );

          notify();

      }

  }
  else if( location.pathname == "/login/" ) {
      // wait for login
  }
  else if( location.pathname !== "/extn/account/" ) {
      location.href = "/extn/account/";
  }
  else {
      start = true;
  }



  function generateRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  function getAdvert( tftype ) { // check ads

      var time = (new Date()).valueOf();

      var params = {
          extension: 1,
          tftype: tftype,
          version: 17,
          get: 'submit'
      };

      $.ajax({
          type: "POST",
          url: url_get_advert,
          data: $.param(params),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          success: function(response) {

              var res = JSON.parse(response);

              if( res.error ) { // err
                  console.log( "Cekame, normalka ..."+ JSON.stringify(res, null, 2));
              }
              else {

                  $("body").css("background-color","#ffc107"); // working

                  if (res.teaser) {

                      clearInterval( check );
                      console.log("TEASER");
                      teaser_parser( res );

                  }
                  else if (res.popup) {

                      clearInterval( check );
                      console.log("POPUP");
                      popup_parser( res );

                  }
                  else if (res.captcha) {

                      clearInterval( check );
                      location.href = "/check-captcha/#NotifyRe8";

                  }
                  else {
                      // ...
                  }

              }

          },
          error: function(xhr, status, error) {
              console.log(JSON.stringify(error, null, 2));
          }

      });

  }



  function popup_parser( res ) {

      console.log(JSON.stringify(res, null, 2));
      var token = "";
      var iframe_url = "";
      var sec = 60;

      if( res.url.indexOf("popup-no") > -1 ) { // forwarding popup

          token = res.url.replace( "https://teaserfast.ru/extn/popup-no/?hsa=", "" ) ;
          console.log( token );

          iframe_url = res.url;
          $("#ifr").attr("src", iframe_url );

          popup_reward( token, sec );

      }
      else { // classic popup

          token = res.url.replace( "https://teaserfast.ru/extn/popup-timer/?tzpha=", "" ) ;
          console.log( token );

          iframe_url = res.url;
          $("#ifr").attr("src", iframe_url );

          var parts = res.message.split("сек."); // "message": "Смотреть сайт в течение 15 сек. и заработать 0.045 руб.?\n\n(Вы можете отключить данный вид рекламы в личном кабинете, в разделе настройки показа)"
          if (parts.length > 1) {

              var numberParts = parts[0].trim().split(" ");
              sec = numberParts[numberParts.length - 1]; // parse sec

              popup_reward( token, sec );

          }
          else {

              popup_reward( token, sec );
              //alert("NO SECS - USE 60s!")

          }

      }

  }



  function popup_reward( token, sec ) {

      var rand = generateRandomNumber(5, 10); // sec
      var counter = parseInt(sec) + parseInt(rand);

      var scriptElement = document.createElement("script");
      scriptElement.id = "wait_worker";
      scriptElement.text = 'var i = ' + counter + '; var timer = setInterval(function() { if(i > 0) { i--; postMessage(i); } else { clearInterval(timer); } }, 1000);';
      document.body.insertAdjacentElement("afterend", scriptElement);

      var wait_worker = null, URL = window.URL || (window.webkitURL);
      window.URL = URL;
      var workerData = new Blob([document.getElementById('wait_worker').textContent], { type: "text/javascript" });

      function init_wait() {
          if (typeof(Worker) === "undefined") {
              alert('No webworker supported');
              return false;
          }

          wait_worker = new Worker(window.URL.createObjectURL(workerData));
          wait_worker.onmessage = function(e) {
              if (e.data === 0) {

                  clearInterval(timer);

                  var params = {
                      hash: token
                  };
                  console.log("POST: " + url_pcheck);
                  console.log("DATA: " + $.param(params));
                  $.ajax({
                      type: "POST",
                      url: url_pcheck,
                      data: $.param(params),
                      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                      success: function(response) {
                          if (response.error) { // err
                              console.log("REWARD - ERR: " + JSON.stringify(response, null, 2));
                              //alert("REWARD-ERR-VIEWED?");
                          }
                          else { // ok
                              $("body").css("background-color", "#4caf50"); // ok
                              var res = JSON.parse(response);
                              console.log(JSON.stringify(res, null, 2));
                              document.title = "EARN +" + res.earn;
                              //alert("REWARD-OK?");
                              setTimeout(function() {
                                  location.reload();
                              }, (3 * 1000));
                          }
                      },
                      error: function(xhr, status, error) {
                          console.log("REWARD-ERR: " + JSON.stringify(error, null, 2));
                      }
                  });
              }
              else {
                  document.title = "WAIT " + e.data + "s";
              }
          };
      }

      init_wait();

  }



  function teaser_parser( res ) {

      console.log(JSON.stringify(res, null, 2));

      var hash = res.hash;
      var sec = res.timer; // sec

      teaser_reward( hash, sec );

  }



  function teaser_reward( hash, sec ) {

      var rand = generateRandomNumber(5, 10); // sec
      var counter = parseInt(sec) + parseInt(rand);

      var scriptElement = document.createElement("script");
      scriptElement.id = "wait_worker";
      scriptElement.text = 'var i = ' + counter + '; var timer = setInterval(function() { if(i > 0) { i--; postMessage(i); } else { clearInterval(timer); } }, 1000);';
      document.body.insertAdjacentElement("afterend", scriptElement);

      var wait_worker = null, URL = window.URL || (window.webkitURL);
      window.URL = URL;
      var workerData = new Blob([document.getElementById('wait_worker').textContent], { type: "text/javascript" });

      function init_wait() {
          if (typeof(Worker) === "undefined") {
              alert('No webworker supported');
              return false;
          }

          wait_worker = new Worker(window.URL.createObjectURL(workerData));
          wait_worker.onmessage = function(e) {
              if (e.data === 0) {

                  clearInterval(timer);

                  var params = {
                      hash: hash
                  };

                  console.log("POST: " + url_teaser_check);
                  console.log("DATA: " + $.param(params));
                  $.ajax({
                      type: "POST",
                      url: url_teaser_check,
                      data: $.param(params),
                      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                      success: function(response) {

                          if( response.error ) { // err

                              console.log("REWARD - ERR: "+ JSON.stringify(response, null, 2));
                              //alert("REWARD-ERR-VIEWED?");

                          }
                          else { // ok

                              $("body").css("background-color","#4caf50"); // ok

                              var res = JSON.parse(response);
                              console.log(JSON.stringify(res, null, 2));

                              document.title = "EARN +"+ res.earn;
                              //alert("REWARD-OK?");

                              setTimeout( function() {
                                  location.reload();
                              }, ( 3 * 1000 ) );

                          }
                      },
                      error: function(xhr, status, error) {
                          console.log( "REWARD-ERR: "+ JSON.stringify(error, null, 2));
                      }

                  });

              }
              else {
                  document.title = "WAIT " + e.data + "s";
              }
          };
      }

      init_wait();

  }



  // ===== START =====
  if( start ) {

      $("body").css("background-color","#00bcd4"); // idle

      $("<iframe>", {
          src: "", id: "ifr", style: "position: fixed; left: 300px; top: 80px;",
          frameborder: 1, height: 280, width: 800, scrolling: "yes"
      }).insertAfter("body");


      var domain = "teaserfast.ru";
      var url_get_advert = "https://"+domain+"/extn/get/";
      var url_pcheck = "https://"+domain+"/extn/popup-check/";
      var url_teaser_check = "https://"+domain+"/extn/status/";



      var type = 1; // 0 = ad,  1 = popup
      if( generateRandomNumber(1, 2) == 1 ) type = 0;

      var check = setInterval( function() {

          getAdvert( type );
          console.log( "CHECK getAdvert ["+ type +"]" );

      }, ( generateRandomNumber(30, 45) * 1000 ) );

      getAdvert( type );

  }



  setTimeout( function() { // global reload
      console.log( "global reload" );
      location.reload();
  }, ( 10 * 60 * 1000 ) ); // 10m

});