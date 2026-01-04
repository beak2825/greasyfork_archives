// ==UserScript==
// @name         Make Stake
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant         GM.xmlHttpRequest
// @connect pastebin.com
// @include       https://melbet.*/*/live/*
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/421142/Make%20Stake.user.js
// @updateURL https://update.greasyfork.org/scripts/421142/Make%20Stake.meta.js
// ==/UserScript==


const ru_site =
// document.querySelector("#top_user > div.clear.headUserInfo > div > span > a > div > div > p.top-b-acc__title")

document
  .querySelector(
    "p.top-b-acc__title"
  )
  .textContent.includes("RUB")
  ? true
  : false;
  console.log('ru_site ' + ru_site);

function give_Info(text="",style=""){
  $(function (){ 
    // document.querySelector("")rightSide fl
    $('body > div.bodyWrapper > div.contentWrap.clear > div.rightSide.fl').prepend('<p style="'+style+'">'+text+'</p>');
});
}
const base_url =  ru_site ? "https://melbet.org/" : "https://melbet.com/en/";
// const base_url_eng = "https://melbet.com/en/";

const urls = [
  base_url + "live/fifa/",
  
  base_url + "live/tennis/",

  base_url + "live/basketball/",

  base_url + "live/ice-hockey/",

  base_url + "live/volleyball/",

  base_url + "live/table-tennis/",

  base_url + "live/esports/",

  base_url + "live/mortal-kombat/",

  base_url + "live/pes/",

  base_url + "live/playgrounds/",

  base_url + "live/football/",

];

// const urls_eng = [
//   base_url_eng + "live/fifa/",
  
//   base_url_eng + "live/tennis/",

//   base_url_eng + "live/basketball/",

//   base_url_eng + "live/ice-hockey/",

//   base_url_eng + "live/volleyball/",

//   base_url_eng + "live/table-tennis/",

//   base_url_eng + "live/esports/",

//   base_url_eng + "live/mortal-kombat/",

//   base_url_eng + "live/pes/",

//   base_url_eng + "live/playgrounds/",

//   base_url_eng + "live/football/",

// ];

let current_index = localStorage.getItem("current_index");

let needToSelectGameType = localStorage.getItem("needToSelectGameType");
let needBet = localStorage.getItem("needBet");

const inGame = localStorage.getItem("inGame");

const Summaximum = 7000;
const Summinimum = 3500;


const Summaximum_eng = 40;
const Summinimum_eng = 90;

let betted = false;



//это для скрипта
let state = "init";

let countdown = 30;
(localStorage.getItem("needBet") != "true") ? give_Info("Ставка не требуется.") : give_Info("Делаем ставку...");
document.onreadystatechange = setInterval(() => {

  if(localStorage.getItem("needBet") == "true"){
  if (countdown>1) {countdown--;
    give_Info("[" + countdown + "] Ожидаем интервал...","font-size:10px;margin:0px;");
  
  }
  else{
    gameChoose();
  }
  console.log("countdown "+ countdown);
}
else{
  console.log("needBet false" );
  // give_Info("Ставка не требуется.");
}

}, 1000);



document.onreadystatechange = function () {

  if (document.readyState == "complete") {

    try {
      
   

    if(!document.querySelector("#oneClickCheck").checked){
      document.querySelector("#oneClickCheck").click();
      document.querySelector("body > div > div.contentWrap.clear > div.centerCon.fl > div > div.nameContent.nameContent__live.clear > div > div.fl.oneClickInput.clear > a").click();

    }

  } catch (error) {
    give_Info("Нажми ставка в один клик!","font-size:25px;color:white;background-color: red;"); 
  }
    // if(document.querySelector("#oneClickCheck").checked)
// let color = blue;
if(localStorage.getItem("stakes_array_w") == '["000"]')
    {give_Info("Z - отменить процесс оформление ставки ","margin:0;font-size:15px;color:white;background-color: #4287f5;");
    give_Info("Enter - сделать ставку ","margin:0;font-size:15px;color:white;background-color: #4287f5;");
    give_Info("E - выйти в главную категорию","margin:0;font-size:15px;color:white;background-color: #4287f5;");
    give_Info("Страница загрузилась :) ","color:white;background-color: #4287f5;");
    // info_output = document.getElementById("body > div.bodyWrapper > div.contentWrap.clear > div.centerCon.fl") ;
    }
    //Запоминаем тип игры если урл короткий
    if (document.location.href.length < 60) {
      localStorage.setItem(
        "gametype",
        document.querySelector("#h1").textContent
      );
      give_Info("Запомнили тип игры: " + document.querySelector("#h1").textContent)
      console.log(
        "%c 🐆: ЗАПОМНИЛИ ",
        "font-size:16px;background-color:#eaffa2;color:black;",
        document.querySelector("#h1").textContent
      );
    }

    console.log(
      "%c 🌆: document.onreadystatechange -> needToSelectGameType ",
      "font-size:16px;background-color:#9b26e2;color:white;",
      needToSelectGameType
    );

    if (needToSelectGameType == "true") setTimeout(gameChoose, 3000);
  }
};

//проверка нужна ли инициализация
if (
  typeof localStorage.getItem("need_stake") === "undefined" ||
  localStorage.getItem("need_stake") === null
) {
  console.log("initonce");
  initOnce();
}
// реализация инициализации
function initOnce() {
  alert("[Перезагрузка страницы.] Сейчас вылетит птичка! (Инициализация необходимых переменных для работы скрипта!)");
  localStorage.setItem("current_index", 1);
  var stakes_array = ["000"];
  localStorage.setItem("stakes_array_w", JSON.stringify(stakes_array));
  localStorage.setItem("need_stake", 1);
  var groups_array = ["000"];
  localStorage.setItem("groups_array_w", JSON.stringify(groups_array));
  current_index = 1;
  document.location = urls[current_index];
}

function writeBufferEnsure2(str) {
  let timerId = setTimeout(function tick() {
    console.log("trying to write buffer");
    navigator.clipboard.writeText(str);
    if (navigator.clipboard.readText != str) {
      timerId = setTimeout(tick, 2000); // (*)
    } else {
      state = "init";
      document.location = urls[current_index];
    }
  }, 2000);
}

function switchGameType() {
  run_once = 0;

  if (current_index < urls.length - 1) current_index++;
  else current_index = 0;
  //current_index = Math.floor(Math.random() * (urls.length - 1 - 0 + 1)) + 0;
  console.log(
    "%c 🇬🇧: switchType -> current_index ",
    "font-size:16px;background-color:#3023e1;color:white;",
    current_index
  );
  console.log(
    "%c 🇬🇧: switchType -> current_index ",
    "font-size:16px;background-color:#3023e1;color:white;",
    urls[current_index]
  );

  localStorage.setItem("current_index", current_index);
  //alert("Type index:"+ current_index + ", url: " + urls[current_index]);
  //
}

function gameChoose() {
  gametype = document.querySelector("#h1").textContent;
  localStorage.setItem("gametype", gametype);
  // localStorage.setItem("gametype", gametype);
  localStorage.setItem("needBet", "true");
  console.log("selecting game");
  // alert(localStorage.getItem("needBet"));

  state = "init";

  var stakes_array = ["000"];

  //localStorage.setItem("stakes_array_w", JSON.stringify(stakes_array));
  stakes_array = JSON.parse(localStorage.getItem("stakes_array_w"));

  //alert(stakes_array);

  //var elements = document.getElementsByClassName("nameLink fl clear");
  var tables = document.getElementsByClassName("kofsTableLineNums "); //это п1   kof fl l1
  var elements, first_col;
  //alert(tables.length);
  //return;
  var i, j;
  for (i = 0; i < tables.length; i++) {
    elements = tables[i].getElementsByClassName("nameLink fl clear");

    first_col = tables[i].getElementsByClassName("kof fl l1");
    for (j = 0; j < elements.length; j++) {
      //alert(elements[j].textContent);
      if (
        !stakes_array.includes(elements[j].textContent) &&
        first_col[j].textContent != "-"
      ) {
        stakes_array.unshift(elements[j].textContent);
        if (stakes_array.length > 20) stakes_array.pop();
        localStorage.setItem("stakes_array_w", JSON.stringify(stakes_array));
        //alert(stakes_array);
        localStorage.setItem("needToSelectGameType", "false");
        localStorage.setItem("inGame", "true");
        elements[j].click();
        waitForKeyElements(".blockContent.kofsContent", makeBet, 1);

        return;
      }
    }
  }

  switchGameType();
  // alert("No suitable Games. Next is " + urls[current_index]);
  // localStorage.setItem("need_stake", 1);

  localStorage.setItem("needToSelectGameType", "true");
  document.location = urls[current_index];
}

function changeSumm() {
  const result = document
    .querySelector(
      "#top_user > div.clear.headUserInfo > div > span > a > div > div > p.top-b-acc__title"
    )
    .textContent.includes("USD")
    ? (Math.floor(Math.random() * (Summaximum_eng - Summinimum_eng + 1)) + Summinimum_eng)
    : Math.floor(Math.random() * (Summaximum - Summinimum + 1)) + Summinimum;
  document.getElementById("one_summa").value = result;
  document.getElementsByClassName("but fl input_one_click_but")[0].click();
  waitForKeyElements(".ui-button-text", press_ok, 1);
}

//betting result capture
waitForKeyElements(".ui-button-text", press_ok, 1);

function makeBet() {
  localStorage.setItem("inGame", "false");
  changeSumm();
  // alert("Summ changed");

  var groups_array = ["000"];
  //var kof_arr = [];
  // localStorage.setItem("groups_array_w", JSON.stringify(groups_array));
  groups_array = JSON.parse(localStorage.getItem("groups_array_w"));

  var k, l;
  console.log("hi");
  var groups = document.getElementsByClassName("group");
  for (k = 0; k < groups.length; k++) {
    console.log(groups[k].getElementsByClassName("groupName")[0].textContent);
    //kof_arr = [];
    var kofs = groups[k].getElementsByClassName("kof ");
    for (l = 0; l < kofs.length; l++) {
      // kof_arr.unshift( kofs[l].textContent );

      // console.log(kofs[l].textContent);

      // kof_arr.sort(compareNumbers);var evtobj = window.event? event : e
      // alert(kof_arr); 
      if (
        !groups_array.includes(
          groups[k].getElementsByClassName("groupName")[0].textContent
        )
      ) {
        if (
          parseFloat(kofs[l].textContent) > parseFloat("1.4") &&
          parseFloat(kofs[l].textContent) < parseFloat("2.0")
        ) {
          groups_array.unshift(
            groups[k].getElementsByClassName("groupName")[0].textContent
          );
          if (groups_array.length > 3) groups_array.pop();
          localStorage.setItem("groups_array_w", JSON.stringify(groups_array));

          kofs[l].click();
          betted=true;
          //alert("We select kof " + kofs[l].textContent + " at " + groups[k].getElementsByClassName("groupName")[0].textContent);
          //alert(groups_array);
          waitForKeyElements(".ui-button-text", press_ok, 0);

          return;
        }
      }
    }
  }
  state = "init";
  console.log("Here we go back. No suitable stakes");

  switchGameType();

  document.location = urls[current_index];
}

function press_ok() {
  console.log(
    "%c 🍬: autoOk -> document.getElementById('alert_dialog').textContent ",
    "font-size:16px;background-color:#c59b9a;color:white;",
    document.getElementById("alert_dialog").textContent
  );

const bet_done_alias = ru_site ? "Ваша ставка принята!" : "Bet accepted!";
  const amount_set_alias = ru_site ? "Сумма установлена!" : "Stake amount set!";
  if (document.getElementById("alert_dialog").textContent == amount_set_alias) {

  


    document.getElementsByClassName("ui-button-text")[0].click();
  

    console.log("%c 🇨🇳: STATE ", "font-size:16px;background-color:#f42e73;color:white;", state)
    // waitForKeyElements(".ui-button-text", press_ok, 1);
    return;
  }
  
  //alert(document.getElementById("alert_dialog").textContent);

  //Ваша ставка принята!
  else if (document.getElementById("alert_dialog").textContent == bet_done_alias && betted) {
    console.log(document.getElementById("alert_dialog").textContent);
    // info_output.textContent+="\r\n" + bet_done_alias;
    betted=false;
    localStorage.setItem("needBet", "false");
    give_Info(bet_done_alias,"font-size:16px;background-color:#21b849;color:white;");
    give_Info("НАЖМИТЕ Е и потом Enter!","font-size:25px;background-color:#ff0000;color:white;");
    // alert("Ваша ставка принята");
    //alert("betting finished!");
    console.log("done, press alt s");
    localStorage.setItem("needToSelectGameType", "false");

    state = "good";
    localStorage.setItem("stake_url", location.href);
    console.log("%c 🇨🇳: STATE ", "font-size:16px;background-color:#f42e73;color:white;", state)

  } else {
    switchGameType();

    localStorage.setItem("needToSelectGameType", "true");

    document.location = urls[current_index];
    console.log("%c 🇨🇳: STATE ", "font-size:16px;background-color:#f42e73;color:white;", state)
  }

  document.getElementsByClassName("ui-button-text")[0].click();

  //  document.location = comeback_url;
}


document.onkeyup = function (e) {
  var key = e.keyCode;
  console.log(
    "%c 🇨🇻: document.onkeyup -> key ",
    "font-size:16px;background-color:#27a057;color:white;",
    key
  );

  if (key == 13) {
    document.location == base_url + "ru/live/"
      ? alert("Вы находитесь не в категории!")
      : gameChoose();
  }

  if (key == 90) {
   
    localStorage.setItem("needBet","false");
  localStorage.setItem("needBet", "false");
  localStorage.setItem("needToSelectGameType", "false");

  document.location.reload();
    give_Info("Процесс оформления ставки отменён.", "font-size:20px;background-color: #b6fc03;");

  }

  if (key === 69) document.location = urls[current_index];

  //this is 4 script
  if (key == 83) {
    //alt s
    if (state == "good") {
      
      state = "init";
      
      writeBufferEnsure2("good");
    }
    else{
    console.log("s trig. status: working");
    }
  }
};

document.onclick = function (ee) {
  if (document.location.href.length < 60) {

    localStorage.setItem("gametype", document.querySelector("#h1").textContent);


    give_Info("Запомнили по клику тип игры: " + document.querySelector("#h1").textContent);

    console.log(
      "%c 🐆: ЗАПОМНИЛИ ",
      "font-size:16px;background-color:#eaffa2;color:black;",
      document.querySelector("#h1").textContent
    );
  }
};
