// ==UserScript==
// @name        Shortlinks
// @namespace   Violentmonkey Scripts
// @match       https://awgrow.com/*
// @match       https://mdn.lol/*
// @match       https://homeculina.com/*
// @match       https://ineedskin.com/*
// @match       https://auntmanny.com/*
// @match       https://lawyex.co/*
// @match       https://pluginmixer.com/*
// @match       https://phineypet.com/*
// @match       https://hauntingrealm.com/*
// @match       https://healthyfollicles.com/*
// @match       https://edonmanor.com/*
// @match       https://misterio.ro/*
// @match       https://chefknives.expert/*
// @match       https://shinchu.net/*
// @match       https://boardgamechick.com/*
// @match       https://boredboard.com/*
// @match       https://basketballsavvy.com/*
// @match       https://gametechreviewer.com/*
// @match       https://gearsadviser.com/*
// @match       https://vrtier.com/*
// @match       https://vegan4k.com/*
// @match       https://tunebug.com/*
// @match       https://crewus.net/*
// @match       https://techedifier.com/*
// @match       https://earnfromyourlaptop.com/*
// @match       https://gamedouc.com/*
// @match       https://rijex.pw/*
// @match       https://revcut.net/*
// @match       https://miner-sim.com/*
// @match       https://cryptoad.org/*
// @match       https://120898.xyz/*
// @match       https://c2g.at/*
// @match       https://cutlink.xyz/*
// @match       https://urlcut.pro/*
// @match       https://blog.adlink.click/*
// @match       https://kenzo-flowertag.com/*
// @match       https://blog.freeoseocheck.com/*
// @match       https://blog.coinsvalue.net/*
// @match       https://blog.cookinguide.net/*
// @match       https://blog.cryptowidgets.net/*
// @match       https://blog.insurancegold.in/*
// @match       https://blog.wiki-topia.com/*
// @match       https://blog.makeupguide.net/*
// @match       https://blog.carstopia.net/*
// @match       https://blog.carsmania.net/*
// @grant       none
// @version     1.5
// @author      -
// @description 3/24/2024, 3:11:02 AM
// @downloadURL https://update.greasyfork.org/scripts/492724/Shortlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/492724/Shortlinks.meta.js
// ==/UserScript==


// NOTES:
// set timabc131933f2a52fe1ced09d2521cacb0cd5 = 0 to bypass sites above


// LOOKS LIKE ITS RANDOMLY GENERATED. SCRAPE.

// tim + document.querySelector('center[style="max-width:180px;"]').children[0].id.slice(5)
// eval(`tim${document.querySelector('center[style="max-width:180px;"]').children[0].id.slice(5)} = 0`)
// eval(`tim${document.querySelector('center[style="max-width:180px;"]').children[0].id.slice(4)} = 0`)
// document.querySelector('center[style="max-width:180px;"]').children[0].click();


// NEED TO WAIT 20 seconds STILL!!!
/*
function BoostTimers() {
    const FsT = window.setTimeout;
    const FsI = window.setInterval;
    Object.defineProperty(window, 'setTimeout', {
        value: function(func, delay) {
            if (delay === 1000) {
                delay = 50;
            }
            return FsT.apply(this, arguments);
        }
    });
    Object.defineProperty(window, 'setInterval', {
        value: function(func, delay) {
            if (delay === 1000) {
                delay = 50;
            }
            return FsI.apply(this, arguments);
        }
    });
}*/

function stopAllRunningIntervals() {
  // Set a fake timeout to get the highest timeout id
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkBanner() {
    // stopAllRunningIntervals();
    // Issue with mdn.lol I can't find the banner and shit...
    // alert(document.querySelector('#click').textContent); // Investigate for now... put this line...
    try {
      //let banner = document.getElementById('click').textContent;
      let banner = $('#click').text();
      if (banner.includes("Click The Ad Below")) {
        //alert("NEED TO RELOAD WINDOW AND AVOID DETECTION!");
        // FOR BLOG.*.NET/IN
        try {
          eval(`startTimer${document.querySelector('.btn-').nextElementSibling.id}()`)
        } catch(err) {
          //alert("There's no `startTimer` variable found... - " + err)
        }

        try {
          eval(`str${document.querySelector('.btn-').nextElementSibling.id}()`)
        } catch(err) {
          //alert("There's no `str+` variable found... - " + err);
        }

        try {
          eval(`tim${document.querySelector('.btn-').nextElementSibling.id} = 0`)
        } catch(err) {
          //alert("timer using nextelement doesnt work here - " + err)
        }

        try {
          eval(`tim${document.querySelector('center[style="max-width:180px;"]').children[0].id.slice(4)} = 0`)
        } catch(err) {
          //alert("timer skip with slice 4 doesnt work here - " + err)
        }


        try {
          eval(`tim${document.querySelector('center[style="max-width:180px;"]').children[0].id.slice(5)} = 0`)
        } catch(err) {
          //alert("timer skip with slice 5 doesnt work here - " + err);
        }


      } else if (banner.includes("Click Any Ad") && $('#click').is(':visible')) {
        window.location.reload();
        /*
        if (banner.includes("Captcha") && $('#click').is('visible')) { // Only do this is banner is visible!
          //alert("Need to reload!");
          window.location.reload();
          return;
        }
        */
        /*
        // Disable focus... override the page's settings
        stopAllRunningIntervals();
        try {
          eval(`startTimer${document.getElementsByTagName('form')[0].id}()`);
          eval(`tim${document.getElementsByTagName('form')[0].id} = 0`);
        } catch(err) {
          //alert("STARTTIMER - used #form selector, nothing found - " + err);
        }

        try {
          eval(`str${document.getElementsByTagName('form')[0].id}()`);
          eval(`tim${document.getElementsByTagName('form')[0].id} = 0`);
        } catch(err) {
          //alert("STR - used #form selector, nothing found - " + err);
        }
        */
        /*
        alert("Will reload page because I can't bypass that stuff...")
        window.location.reload();
        */
      }
    } catch(err) {
      //alert("Something bad happened here no banner found - " + err)
    }
}

window.addEventListener('load', function() {
  // BoostTimers();
  // Just click on the link...
  switch(window.location.host) {
    case "revcut.net": case "c2g.at": case "cutlink.xyz": case "urlcut.pro": case "blog.adlink.click":
      sleep(7500).then(() => {
        console.log("Will proceed to click the link....");
        document.querySelector('.get-link').click();
        document.querySelector('.get-link').click();
      })
      break;
  }

  let captchaCheckInterval = null;
  //let captchaCheck = document.getElementById('.g-recaptcha');
  //captchaCheck = grecaptcha && grecaptcha.getResponse().length !== 0;
  if (typeof grecaptcha !== 'undefined') {
    console.log("Checking for a captcha somewhere...");
    checkBanner(); // First check for banner "Click on Ad"
    try {
      //grecaptcha.getResponse();
      captchaCheckInterval = setInterval(() => {
        console.log("Waiting for captcha to be solved....")
        if (grecaptcha && grecaptcha.getResponse().length !== 0) {
          // /alert("Captcha has now been solved!");
          clearInterval(captchaCheckInterval);
          captchaCheckInterval = null;
          clickNext(0);
        }
      }, 2000);
    } catch(error) {
      console.log("Captcha doesn't exist on this page :>");
      checkBanner();
      clickNext(15500);
    }
  } else {
    checkBanner();
    clickNext(15500);
  }

});

const clickNext = (timeToSolve) => {
  switch(window.location.host) {
    case "120898.xyz":
      sleep(1000).then(() => document.querySelector('.btn.btn-primary.mt-2').click());
      break;
    case "miner-sim.com": case "cryptoad.org":
      let peskyButtons = document.querySelectorAll('.wpsafelink-button');
      // First click on generate link
      peskyButtons[0].click()
      // Then click on next link
      sleep(10000).then(() => peskyButtons[2].click())
      break;
    case "blog.freeoseocheck.com": case "blog.coinsvalue.net": case "blog.cookinguide.net": case "blog.carstopia.net":
    case "blog.cryptowidgets.net": case "blog.insurancegold.in": case "blog.wiki-topia.com": case "blog.makeupguide.net": case "blog.carsmania.net":
      // Add an extra 5000ms or 5 seconds if it asks for an ad click...
      let properTimeToWait = (timeToSolve === 15500 ? timeToSolve + 15500 : 0);
      //alert("Why is this thing not working? " + properTimeToWait);
      sleep(properTimeToWait).then(() => {
        console.log("Clicking on next now after waiting for 20 seconds...")
        document.querySelector('center[style="max-width:180px;"]').children[0].click()
      })
      break;
    case "pluginmixer.com": case "phineypet.com": case "hauntingrealm.com": case "healthyfollicles.com": case "edonmanor.com": case "misterio.ro":
    case "chefknives.expert": case "shinchu.net": case "boardgamechick.com": case "basketballsavvy.com": case "gametechreviewer.com":
    case "vrtier.com": case "vegan4k.com": case "boredboard.com": case "gearsadviser.com": case "tunebug.com": case "crewus.net": case "techedifier.com": case "earnfromyourlaptop.com":
      if (document.body.innerText.includes("A timeout occurred") ||
          document.body.innerText.includes("Web server is returning an unknown error") ||
          document.body.innerText.includes("OOPS! YOU HAVE BEEN BLOCKED") ||
          document.body.innerText.includes("Sorry, you have been blocked")) {
        window.location.reload();
        break;
      }
      sleep(timeToSolve).then(() => {
        //alert("Stopping all intervals to avoid detection?...")
        //alert("Reenabling focus on document?")
        //document.hasFocus = oldNativeFunction;
        document.getElementsByTagName('button')[0].click();
        //$('button').click()
        /*
        if (grecaptcha) {
          alert("There's a captcha hmmm...");
          let captchaCheckInterval = setInterval(() => {
            console.log("Waiting for captcha to be solved....")
            if (grecaptcha.getResponse().length !== 0) {
              document.querySelector('button').click();
              clearInterval(captchaCheckInterval);
            }
          }, 2000);
        } else {
          document.querySelector('button').click();
        }
        */
      })
      break;
    default:
      sleep(timeToSolve).then(() => {
        //let peskyElements = document.getElementsByClassName('text-center');
        //let peskyButton = peskyElements[peskyElements.length - 1].children[1];
        let peskyButton = document.querySelector('.btn-').nextElementSibling;
        //console.log("Check element if better this is peskyButton.elements[1]: ", peskyButton.elements[1]);
        //alert(peskyButton.elements);
        if (peskyButton.innerText.toLowerCase().trim().startsWith("step") || peskyButton.innerText.toLowerCase().trim().startsWith("continue")) {
          let actualPeskyButton = peskyButton.children[1];
          if (actualPeskyButton) {
            console.log("Clicking the button now after 15 seconds...", actualPeskyButton);
            actualPeskyButton.click();
            //actualPeskyButton.click();
          } else {
            let checkActualPeskyButton = peskyButton.elements;
            if (checkActualPeskyButton) {
              console.log("Clicking the extra steps button...", checkActualPeskyButton[1]);
              checkActualPeskyButton[1].click();
              //checkActualPeskyButton[1].click();
            } else {
              console.log("Clicking the button now after 15 seconds...", peskyButton);
              peskyButton.click();
              //peskyButton.click();
            }
          }
        } else {
          console.log("The button doesn't exist so I will reload the page...");
          //alert("WILL RELOAD!");
          window.location.reload();
        }
      });
      break;
  }
}