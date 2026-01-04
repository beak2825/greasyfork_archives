// ==UserScript==
// @name        2ch.hk dvatch solver made by a sneeder
// @namespace   Violentmonkey Scripts
// @match       https://2ch.hk/*
// @match       https://2ch.hk/
// @grant       none
// @version     1.1
// @author      -
// @description 9/20/2022, 11:31:23 AM
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/451912/2chhk%20dvatch%20solver%20made%20by%20a%20sneeder.user.js
// @updateURL https://update.greasyfork.org/scripts/451912/2chhk%20dvatch%20solver%20made%20by%20a%20sneeder.meta.js
// ==/UserScript==


//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

//KILL ALL PEDOPHILE MODS
//LEARN ENGLISH LOL I AM NOT RUSSIAN LOL

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
  console.log("image data:",a)
  fetch('https://hf.space/embed/sneedium/dvatch_captcha_sneedium/api/predict/', {
      method: 'POST',
      headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
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
                  console.log(response)
                  captcha_result = response.data[0] //+ "BAD"
                  console.log("The captcha is: ", captcha_result)
                  // alert("The captcha is: "+captcha_result)
                  $("#qr-postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input").val(captcha_result);
                  $("#postform > div.postform__raw.postform__raw_flex.captcha > input.captcha__val.input").val(captcha_result);


                  setTimeout(function() {
                    pollingFunc = setInterval(function() {do_loop_till_working();}, 1250);
                  }, 3000);


                }
          ) ;

      }
      ).catch(function(err) {
      console.log('Fetch Error :-S', err);
      });

}

function scrap_captcha_image(url){

  //Converts the PNG to BASE64
  const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

  toDataURL(url)
      .then(dataUrl => {        sneed(dataUrl)    })

}
var last_url = ""
function do_loop_till_working(){
  try {
    // url = document.querySelector("#app > div.Alert.show > form > div > img")['src']
    url = document.querySelector("#captcha-widget-main > img")['src'];
    // sleep(1100);
    // setInterval(function() {

    clearInterval(pollingFunc);

    //TODO: RECALL pollingFunc when captcha is solved!
    //TODO: Disable the reload button (or remove it) ..
    //TODO: disable the ablity for the user to solve the captcha by his own

    // console.log('url', url);
    // console.log('last_url', last_url);

    if (url != last_url){
      var thetwo_match = true
      console.log('Using the AI lol');
      scrap_captcha_image(  url  );
    }else{


      setTimeout(function() {
        pollingFunc = setInterval(function() {do_loop_till_working();}, 1250);
      }, 1000);

    }

    last_url = url
  }
  catch(err) {
    console.log("sneed"
                , err
               )
    // clearInterval(pollingFunc);

  }
}

  let pollingFunc = setInterval(function() {
    do_loop_till_working();
    // };
  }, 1250);
