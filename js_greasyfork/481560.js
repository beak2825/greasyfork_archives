// ==UserScript==
// @name         TPPC v8: Battle Script
// @description  Auto-battles the specified trainer; used to level up Pokemon.
// @include      http://*tppcrpg.net*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    https://gitlab.com/toxocious
// @author       Toxocious
// @version      8.0
// @downloadURL https://update.greasyfork.org/scripts/481560/TPPC%20v8%3A%20Battle%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/481560/TPPC%20v8%3A%20Battle%20Script.meta.js
// ==/UserScript==

/**
 * Gyms
 */
const GYMS = {
  '3379420': { 'Roster_Levels': [ 25, 25, 25, 25, 25, 25 ] },
  '3166941': { 'Roster_Levels': [ 43, 40, 40, 40, 40, 40 ] },
  '3269882': { 'Roster_Levels': [ 75, 75, 75, 75, 75, 75 ] },
  '3101815': { 'Roster_Levels': [ 100, 100, 100, 100, 100, 100 ] },
  '1113640': { 'Roster_Levels': [ 150, 150, 150, 150, 150, 150 ] },
  '1325349': { 'Roster_Levels': [ 200, 200, 200, 200, 200, 200 ] },
  '924714':  { 'Roster_Levels': [ 250, 250, 250, 250, 250, 250 ] },
  '913641':  { 'Roster_Levels': [ 350, 350, 350, 350, 350, 350 ] },
  '3033909': { 'Roster_Levels': [ 400, 400, 400, 400, 400, 400 ] },
  '3384456': { 'Roster_Levels': [ 500, 500, 500, 500, 500, 500 ] },
  '2646064': { 'Roster_Levels': [ 650, 650, 650, 650, 650, 650 ] },
  '2656958': { 'Roster_Levels': [ 800, 800, 800, 815, 815, 815 ] },
  '1933117': { 'Roster_Levels': [ 900, 900, 900, 900, 900, 900 ] },
  '3384457': { 'Roster_Levels': [ 1000, 1000, 1000, 1000, 1000, 1000 ] },
  '3394572': { 'Roster_Levels': [ 1200, 1200, 1200, 1200, 1200, 1200 ] },
  '498042':  { 'Roster_Levels': [ 1506, 1551, 1576, 1550, 1550, 1550 ] },
  '2536240': { 'Roster_Levels': [ 1760, 1760, 1760, 1760, 1760, 1760 ] },
  '3384459': { 'Roster_Levels': [ 2000, 2000, 2000, 2000, 2000, 2000 ] },
  '482301':  { 'Roster_Levels': [ 2500, 2500, 2500, 2500, 2500, 2500 ] },
  '3439851': { 'Roster_Levels': [ 3000, 3000, 3000, 3000, 3000, 3000 ] },
  '3421893': { 'Roster_Levels': [ 3499, 3499, 3500, 3499, 3499, 3499 ] },
  '995268':  { 'Roster_Levels': [ 4000, 4000, 4000, 4000, 4000, 4000 ] },
  '3328818': { 'Roster_Levels': [ 4499, 4499, 4499, 4499, 4499, 4499 ] },
  '3101818': { 'Roster_Levels': [ 5000, 5000, 5000, 5000, 5000, 5000 ] },
  '3395546': { 'Roster_Levels': [ 5500, 5500, 5500, 5500, 5500, 5500 ] },
  '3402750': { 'Roster_Levels': [ 6000, 6000, 6000, 6000, 6000, 6000 ] },
  '3387834': { 'Roster_Levels': [ 6500, 6500, 6500, 6500, 6500, 6500 ] },
  '3355075': { 'Roster_Levels': [ 7000, 7000, 7000, 7000, 7000, 7000 ] },
  '3395547': { 'Roster_Levels': [ 7500, 7500, 7500, 7500, 7500, 7500 ] },
};

// Pick an ID from above, and the macro will auto-battle that account.
const GYM_ID = 3397010;

/**
 * The level in which you want the script to stop macroing.
 */
const goalLevel = 150;

// Variables ( Don't touch these. )
let randClick = 0;
let clicked = 0;
let count = 0;
let set = 0;
let randWidth = Math.floor(Math.random() * 50 + 20);
let randArea = Math.floor(Math.random() * 6 + 10);

// Sleep function.
function sleep(miliseconds)
{
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {}
}

// If you're on the battle page.
if (window.location.pathname == "/battle.php")
{
  // Track random battle pauses.
  $(document).ready(function()
  {
    let set = 0;

    if (!localStorage.getItem('TPPC-v8-BS-Short-Pause'))
    {
      localStorage.setItem('TPPC-v8-BS-Short-Pause', 0);
    }

    if (!localStorage.getItem('TPPC-v8-BS-Long-Pause'))
    {
      localStorage.setItem('TPPC-v8-BS-Long-Pause', 0);
    }

    if ( set == 0 )
    {
      $(".lvlitem").append(`
        <br>
        <a href='#' style='color:#FFFFFF !important;text-decoration:none;'>
          Pause Count:
        </a> ` + localStorage.getItem('TPPC-v8-BS-Short-Pause') + ` <br />
        Long Pause: ` + localStorage.getItem('TPPC-v8-BS-Long-Pause')
      );
    }

    set = 1;

    $(".lvlitem a").click(function()
    {
      if(clicked === 0)
      {
        if (confirm("Reset counter?"))
        {
          clicked = 1;
          clearInterval(interval);
          localStorage.removeItem('TPPC-v8-BS-Short-Pause')
          localStorage.removeItem('TPPC-v8-BS-Long-Pause')
        }
      }
    });
  });

  // Set an interval.
  interval = setInterval(function()
  {
    // Alert once you've reached your set Goal Level.
    if (document.body.innerHTML.search("has reached level (" + goalLevel + ")") != -1)
    {
      clearInterval(interval);
      alert("Done!");
      return true;
    }

    // Restart battle with a random delay.
    links = document.getElementsByTagName("a");
    if ($("#cancelBattle > A").html() == "Restart Battle" && count === 0)
    {
      count++;
      myDelay = 200;
      randInt = Math.floor(Math.random() * 200 + 1);

      if (randInt == 1)
      {
        randDelay = Math.floor(Math.random() * 300 + Math.random() * 125 + 225);
        myDelay = myDelay * randDelay;

        var longpause = localStorage.getItem('TPPC-v8-BS-Long-Pause') + 1;
        localStorage.setItem('TPPC-v8-BS-Long-Pause', longpause);
      }

      setTimeout(function()
      {
        window.location = document.location.href.replace(/battle\.php.*$/, '') + 'battle.php?Battle=Trainer&Trainer=' + GYM_ID;
      }, Math.random() * 400 + myDelay);

    }

    // Get battle button position and top left, bottom right coords.
    x = $('.submit').position();
    cordX = x.left;
    cordY = x.top;

    if (document.body.innerHTML.lastIndexOf(/Loading.../) == -1)
    {
      inputs = document.getElementsByTagName("input");
      randInt = Math.floor(Math.random() * 720 + 1);

      if (randInt == 1)
      {
        randClick = Math.floor(Math.random() * 25000) + 5000;
        sleep(randClick);

        var shortpause = localStorage.getItem('TPPC-v8-BS-Short-Pause') + 1;
        localStorage.setItem('TPPC-v8-BS-Short-Pause', shortpause);
      }

      // Check to see if Blissey's levels have changed.
      let validGym = true;
      storeText = $('#Trainer2_Pokemon').text();
      storeText.split('|').slice(1).map(index =>
      {
        let pokemon = index.split(' ')[0];

        if (pokemon.indexOf('Chansey') < 0 && pokemon.indexOf('Blissey') < 0)
          validGym = false;

        let level = pokemon.split('(L:')[1].split(')')[0];
        if (GYMS[GYM_ID]['Roster_Levels'].includes(level) < 0)
          validGym = false;
      });

      if (!validGym)
      {
        clearInterval(interval);
        alert("The gym has been altered to some extent, so the macro has stopped execution.");

        return true;
      }

      for (i = 0; i < inputs.length; i++)
      {
        if (inputs[i].value.search(/(Attack)/) != -1)
        {
          count = 0;
          Move = document.getElementById("MyMove").value;

          var genX = Math.floor(Math.random() * randArea + cordX + randWidth);
          var genY = Math.floor(Math.random() * randArea + cordY + randWidth);

          unsafeWindow.getBattleStatus({
            "MyMove": Move,
            "pageID": Math.floor(Math.random() * randArea + cordX + randWidth) + "." + Math.floor(Math.random() * 18 + cordY + 3)
          });
        }

        if (inputs[i].value.search(/(Continue)/) != -1)
        {
          unsafeWindow.getBattleStatus({
            "MyMove": "WaitFaint",
            "pageID": Math.floor(Math.random() * randArea + cordX + randWidth) + "." + Math.floor(Math.random() * 15 + cordY + 2)
          });
        }
      }
    }
  }, Math.random() * 75 + 225);
}

/* =========== Captcha stuff =========== */
$(document).ready(function()
{
  // Alert when a captcha appears.
  if (document.body.innerHTML.search(/Please Enter The Combination You See Above/) != -1)
  {
    alert("Captcha!");
  }

  // After you solve the captcha, redirect to the battle trainer page.
  if (document.body.innerHTML.search(/You can resume battling/) != -1)
  {
    window.location = "http://www.tppcrpg.net/battle_trainer.php";
  }

  // If you're on the battle trainer page, begin battling.
  if (window.location == "http://www.tppcrpg.net/battle_trainer.php")
  {
    var input = document.getElementById('Trainer');
    input.value = input.value + battleGym["b" + gymLevel];
    $('input').click();
  }
});
// ==UserScript==
// @name        New script - google.com
// @namespace   Violentmonkey Scripts
// @match       https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
// @grant       none
// @version     1.0
// @author      -
// @description 06/12/2023, 19:34:14
// ==/UserScript==
