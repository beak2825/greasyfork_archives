// ==UserScript==
// @name     Neopets BotBot
// @version  1.1
// @grant    none
// @include		http://www.neopets.com/*
// @author Bochuplah
// @description Login to Neopets and go to http://www.neopets.com/index.phtml to see the magic!!!
// @namespace https://greasyfork.org/en/users/576814
// @downloadURL https://update.greasyfork.org/scripts/404484/Neopets%20BotBot.user.js
// @updateURL https://update.greasyfork.org/scripts/404484/Neopets%20BotBot.meta.js
// ==/UserScript==



//dailies pages
var indexPage="http://www.neopets.com/index.phtml";
var omelettePage="http://www.neopets.com/prehistoric/omelette.phtml"
var fishingPage="http://www.neopets.com/water/fishing.phtml"
var shrinePage="http://www.neopets.com/desert/shrine.phtml"
var plushiePage="http://www.neopets.com/faerieland/tdmbgpop.phtml"
var springPage="http://www.neopets.com/faerieland/springs.phtml"
var springPageTwo="http://www.neopets.com/faerieland/index.phtml?"
var tombolaPage="http://www.neopets.com/island/tombola.phtml"
var tombolaPageTwo="http://www.neopets.com/island/tombola2.phtml" //after collecting prize
var trudyPage="http://www.neopets.com/trudys_surprise.phtml"
var bankPage="http://www.neopets.com/bank.phtml"


//start the magic if you have already login
function indexFun()
{
  console.log("indexFun");

  var f = document.getElementById("logout_link");

  if (f!= null)
  {
  	//go to the next page
  	window.location.href = omelettePage;
  }
  else
  {
    alert("[Neopets BotBot]Please Login to Neopets!!!")
  }
}

function omeletteFun()
{
  console.log("[BotBot]omeletteFun");

  var omeletteForm = document.getElementsByTagName("form")[1];

  if (omeletteForm != null && omeletteForm.innerHTML.includes("Grab"))
  {
    console.log("[BotBot]button found");
    omeletteForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = fishingPage;
    console.log("[BotBot]hehe can go next page");
  }
}

function fishingFun()
{
  console.log("[BotBot]fishingFun");

  var fishingForm = document.getElementsByTagName("form")[1];

  if (fishingForm != null && fishingForm.innerHTML.includes("Reel"))
  {
    console.log("[BotBot]button found");
    fishingForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = shrinePage;
    console.log("[BotBot]hehe can go next page");
  }
}

function shrineFun()
{
  console.log("[BotBot]shrineFun");

  var shrineForm = document.getElementsByTagName("form")[1];


  if (shrineForm != null && shrineForm.innerHTML.includes("Approach"))
  {
    console.log("[BotBot]button found");
    shrineForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = plushiePage;
    console.log("[BotBot]hehe can go next page");
  }
}

function plushieFun()
{
  console.log("[BotBot]plushieFun");

  var plushieForm = document.getElementsByTagName("form")[1];

  if (plushieForm != null && plushieForm.innerHTML.includes("Talk"))
  {
    console.log("[BotBot]button found");
    plushieForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = springPage;
    console.log("[BotBot]hehe can go next page");
  }
}

function springFun()
{
  console.log("[BotBot]springFun");

  var springForm = document.getElementsByTagName("form")[1];

  if (springForm != null && springForm.innerHTML.includes("Heal"))
  {
    console.log("[BotBot]button found");
    springForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = tombolaPage;
    console.log("[BotBot]hehe can go next page");
  }
}

function tombolaFun()
{
  console.log("[BotBot]tombolaFun!!");

  var tombolaForm = document.getElementsByTagName("form")[1];

  if (tombolaForm != null && tombolaForm.innerHTML.includes("Play"))
  {
    console.log("[BotBot]button found");
    tombolaForm.submit();
  }
  else
  {
    //go to the next page
    window.location.href = bankPage;

    console.log("[BotBot]hehe can go next page");
    //setTimeout(() => { window.location.href = bankPage; }, 10000);
  }
}

/*
//work in progress (not working yet)
function trudyDailyFun()
{
  console.log("[BotBot]trudyDailyFun!!");

  var comeBackTmr = document.querySelectorAll("Come back tomorrow");

  var gameForm = document.getElementsByTagName("table")[3];

  gameForm.submit();

  if (comeBackTmr == null)
  {
    //daily not done yet
    console.log("[BotBot]daily not done yet!!");

    //var gameForm = document.getElementsByTagName("table")[3];

    //gameForm.submit();
  }
  else
  {
    //means done daily
    console.log("[BotBot]daily done already!!");

    //window.location.href = bankPage;

    console.log("[BotBot]hehe can go next page");
  }


}*/


function bankFun()
{
  console.log("bankFun");


  var interestForm = document.getElementsByTagName("form")[3];

  if (interestForm != null && interestForm.innerText.includes("Collect"))
  {
    console.log("[BotBot]Collecting interest");
    interestForm.submit();
  }
  else
  {
    console.log("[BotBot]interest already collected");

   	var neopointsOnHand = document.getElementById("npanchor").innerText.replace(/,/g, "");

    console.log("[BotBot]neopoints: " + neopointsOnHand);

    if (Number(neopointsOnHand) > 0)
    {
      	console.log("depositing neopoints: " + neopointsOnHand);
        var depositForm = document.getElementsByTagName("form")[1];
      	depositForm.elements.namedItem("amount").value = neopointsOnHand;
  			depositForm.submit();
    }
    else
    {
      console.log("[BotBot]no neopoints to deposit");
        //go to the next page
       window.location.href = trudyPage;
    }

  }

}

//perform actions only when page finish loading
window.addEventListener('load', function() {
  var currentURL = window.location.href;

  console.log("[BotBot]URL: " + currentURL);

  if (currentURL.localeCompare(indexPage) == 0)
  {
  	indexFun();
  }
  else if (currentURL.localeCompare(omelettePage) == 0)
  {
    omeletteFun();
  }
  else if (currentURL.localeCompare(fishingPage) == 0)
  {
    fishingFun();
  }
  else if (currentURL.localeCompare(shrinePage) == 0)
  {
    shrineFun();
  }
  else if (currentURL.localeCompare(plushiePage) == 0)
  {
    plushieFun();
  }
  else if (currentURL.localeCompare(springPage) == 0 || currentURL.localeCompare(springPageTwo) == 0)
  {
    springFun();
  }
  else if (currentURL.toLowerCase().includes("tombola"))
  {
    tombolaFun();
  }
/*  else if (currentURL.toLowerCase().includes("trudys_surprise"))
  {
    trudyDailyFun();
  }*/
  else if (currentURL.localeCompare(bankPage) == 0)
  {
    bankFun();
  }
  else
  {
    console.log("[BotBot]nothing to do...");
  }



}, false);