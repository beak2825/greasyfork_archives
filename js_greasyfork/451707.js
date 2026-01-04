// ==UserScript==
// @name        PixelPlanet AI captcha-solver
// @namespace   Violentmonkey Scripts
// @match       *://*.pixelplanet.fun/*
// @match       *://pixelplanet.fun/*
// @grant       none
// @version     1.0
// @author      -
// @license GPL
// @description 9/20/2022, 11:31:23 AM
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/451707/PixelPlanet%20AI%20captcha-solver.user.js
// @updateURL https://update.greasyfork.org/scripts/451707/PixelPlanet%20AI%20captcha-solver.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}


function return_captcha(whatever) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function sneed(a) {
  console.log(a)
  fetch('https://hf.space/embed/sneedium/userscript_pixelplanet/api/predict/', {
      method: 'POST',
      headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': 'http://127.0.0.1:7860',
          'Referer': 'http://127.0.0.1:7860/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Safari/537.36'
      },
      body: JSON.stringify({
          'fn_index': 0,
          'data': [  a  ],
          'session_hash': makeid(12)
      })
  }).then(
      function(response) {
          if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
              response.status);
          return;
          }

          // Examine the text in the response
          captcha_result = response.json().then(
                function(response) {
                  captcha_result = response.data[0] //+ "BAD"
                  console.log("The captcha is: ", captcha_result)
                  // alert("The captcha is: "+captcha_result)
                  $("#app > div.Alert.show > form > input[type=text]:nth-child(4)").val(captcha_result);

                  const myPromise0 = new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve(getElementByXpath('//*[@type="submit"]'));
                  }, 300);
                  });
                  myPromise0.then(r => r.click())

                  const myPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                      resolve(getElementByXpath('//*[@class="errormessage"]'));
                    }, 1111);
                  });
                  myPromise
                    .then(function(r){
                        console.log("myPromise.then():",r.textContent);

                        //Tryng the function again in a loop
                        clearInterval(pollingFunc);
                        pollingFunc = setInterval(function() {do_loop_till_working();}, 1000);
                        // wait_for_Interval.then();
                    })
                    .catch(
                      function(err){

                        //Tryng the function again in a loop
                        clearInterval(pollingFunc);
                        pollingFunc = setInterval(function() {do_loop_till_working();}, 1000);
                        console.log("error (should be a captcha worked): myPromise.catch():","captcha worked!");
                      })
//                   });


                  // sleep(2)
                  // var pollingFunc = setInterval(function() {do_loop_till_working();}, 2000);
                }
          ) ;

      }
      ).catch(function(err) {
      console.log('Fetch Error :-S', err);
      });

}

function do_url_to_svg(url){
    fetch(  url  )
      .then(
      function(response) {
          if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
              response.status);
          return;
          }

          // Examine the text in the response
          response.text().then(function(data) {
            sneed(data)
          });
      }
      )
      .catch(function(err) {
      console.log('Fetch Error :-S', err);
      });
}
function do_loop_till_working(){
  try {
    // url = document.querySelector("#app > div.Alert.show > form > div > img")['src']
    url = document.querySelector("#app > div.Alert.show > form > div > img")['src'];
    console.log(url);

    // sleep(1100);
    // setInterval(function() {

    clearInterval(pollingFunc);

    //TODO: RECALL pollingFunc when captcha is solved!
    //TODO: Disable the reload button (or remove it) ..
    //TODO: disable the ablity for the user to solve the captcha by his own

    url = document.querySelector("#app > div.Alert.show > form > div > img")['src']
    console.log(url);

    do_url_to_svg(  url  );
  }
  catch(err) {
    console.log("sneed", err)
    // clearInterval(pollingFunc);

  }
}


let pollingFunc = setInterval(function() {
  do_loop_till_working();
  // };
}, 1000);
