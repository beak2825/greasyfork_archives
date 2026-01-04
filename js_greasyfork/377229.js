// ==UserScript==
// @name         Auto Work at night
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.erepublik.com/en/main/messages-inbox
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/377229/Auto%20Work%20at%20night.user.js
// @updateURL https://update.greasyfork.org/scripts/377229/Auto%20Work%20at%20night.meta.js
// ==/UserScript==

var isEatingHungry = true;                 // true - eat as soon as possible; false - eat when buffer is full
var remainingEnergyBeforeStartEat = 1020;   // valid only when isEatingHungry = false
var countCompaniesToWork = 20;             // valid only when isEatingHungry = false
var minEnergyToWork = 800;                  // valid only when isEatingHungry = true

var timeBeforeRefreshMin = 1;
var timeMaxTimeWithoutRefreshMin = 60;
var alwaysAutoEat = true;

var session_key_last_work_day = "last_work_day";

async function getSession(key){
    return await GM.getValue(key);
}
async function setSession(key, value){
    await GM.setValue(key, value);
}

/*
(function() {
$j(document).ready(function(){
debugger
//     () => async {
//     let x = await GM.getValue(session_key_last_work_day);
//     alert(x);
//     await setSession(session_key_last_work_day, "123");
//     }
       setInterval(main, 1 * 60 * 1000); // 1 min
     //main();
   });
})();
*/
window.addEventListener("load", function(){
//alert(123);
    // make initial eat of food if possible
    var isHome = isHomePage();
    if(alwaysAutoEat && isHome && canEatFood()){
        eatFood();
    }

    setInterval(main, 1 * 60 * 1000);
    logInfo("page loaded");
});



function canEatFood(){
    var foodRemaining = parseInt($j("big.tooltip_health_limit")[0].innerText);
    logInfo("remaining food = " + foodRemaining);
    //alert(foodRemaining);
    var canEat = foodRemaining > 10 &&  erepublik.citizen.energyToRecover - erepublik.citizen.energy >= 4;
    //alert(canEat);
    return canEat;
}
function eatFood(){
    logInfo("eating food");
    $j(".eat_food_wide").click();
}
function getAvailableEnergy(){
    var foodRemaining = parseInt($j("big.tooltip_health_limit")[0].innerText);
    return erepublik.citizen.energy + foodRemaining; //erepublik.citizen.energyFromFoodRemaining;
}
function getCountCompaniesCanworkWithEnergy(){
    var number = Math.floor (getAvailableEnergy() / 10 );
    if(!isEatingHungry){
        number = Math.min(number, countCompaniesToWork);
    }
    //alert("work in = "+number);
    return number;
}

function isTimeToWork()
{
   var totalCapacity = erepublik.citizen.energyToRecover * 2;
   var foodRemaining = parseInt($j("big.tooltip_health_limit")[0].innerText);
   var currentEnergy = erepublik.citizen.energy + foodRemaining; //erepublik.citizen.energyFromFoodRemaining;

   var hasReachedMaxLimit = (currentEnergy + remainingEnergyBeforeStartEat) >= totalCapacity;
   var hasReachedMinLimit = currentEnergy >= minEnergyToWork;
   var result = (isEatingHungry && hasReachedMinLimit)
            || (!isEatingHungry && hasReachedMaxLimit);
  // alert("isTimeToWork = "+ result);
   return result;
}

function isHomePage()
{
    var isHome = $j("#hpTopNews").length == 1;
    return isHome;
}

function gotoHomePage()
{
    logInfo("going to home page");
    location.href = "https://www.erepublik.com/en";
}

function gotoCompanies()
{
    logInfo("going to companies");
    location.href = "https://www.erepublik.com/en/economy/myCompanies" + "?mine=mine-script";
}

var isActivatedTracking;
var loadTime;
function tryToRedirectHome() {
    if(!loadTime){
        loadTime = new Date();
    }
    var now = new Date();
    var isTooMuch = now.getTime() - loadTime.getTime() > timeBeforeRefreshMin*60*1000;
    var needForceRefresh =  now.getTime() - loadTime.getTime() > timeMaxTimeWithoutRefreshMin*60*1000;
    if(isTooMuch || erepublik.citizen.energy == 0){
        gotoHomePage();
    }
    if(needForceRefresh){
        window.location.reload();
    }
    else{
        if(!isActivatedTracking){
            isActivatedTracking = true;
            setInterval(tryToRedirectHome, 10000);
        }
    }
}

function workNow()
{
    logInfo("workNow() called");
    var counter = 0;

    // remove all checkboxes
    $j("div.list_group .listing:not(div.disabled) a.owner_work").removeClass("active");

    var countCompaniesCanworkWithEnergy = getCountCompaniesCanworkWithEnergy();
    $j("div.list_group .listing:not(div.disabled) a.owner_work")
        .each(function(idx, item)
              {
                 if(idx >= countCompaniesCanworkWithEnergy)
                     return;
                 //if(idx >= countCompaniesToWork)
                   //  return;
                 //alert(counter);
                 $j(item).click();
                 counter++;
              });

    $j("#start_production").click();
}




function main()
{
    logInfo("enter main...");
    var isTimeToWrk = isTimeToWork();
    var isHome = isHomePage();

    var isMyCompaniesScreen = window.location.href.includes("erepublik.com/en/economy/myCompanie");
    var isMineLink = window.location.search.includes("mine-script");

    if(alwaysAutoEat && isHome && canEatFood()){
        // eat only in home to avoid wrong values of food remaining
        eatFood();
    }

    if(isHome){
        if(isTimeToWrk){
            gotoCompanies();
        }
    }
    else
    {
        if(isMineLink)
        {
            if(isMyCompaniesScreen)
            {
                workNow();
            }
        }
        // todo - try to redirect home
        tryToRedirectHome();
    }
    logInfo("...exit main");
}

function logInfo(info)
{
    console.info(info + "   " + new Date());
}