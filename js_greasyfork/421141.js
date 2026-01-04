// ==UserScript==
// @name         GetNames
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @grant         GM.xmlHttpRequest
// @connect pastebin.com
// @include        https://melbet.*/*/office/history/
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/421141/GetNames.user.js
// @updateURL https://update.greasyfork.org/scripts/421141/GetNames.meta.js
// ==/UserScript==

var allow = localStorage.getItem('allow')||'0';

var allow_once = localStorage.getItem('allow_once')||'0';

var test_acess = localStorage.getItem('test_acess')||'0';

function main() {

  const myh1 = document.querySelector("body > div.contentWrap.clear > div > div > div.nameContent.clear > h1") ;
   myh1.textContent = 'Сделано с ♥ для PR Marketing Дмитрием Александровичем Галактионовым tg: @Galionix ';
   myh1.style.width = 'auto';
	


  function copyLive()
  {
    
    console.log("started!");
    //just f
    //alert("c space!");
    var game = document.querySelector(
      "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.liga"
    ).textContent;
    var teams = document.querySelector(
      "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams"
    ).textContent;
    // alert(teams);
    // document.querySelector("#contentHistory > ul > li.active > div.data > div.arrow").Click();
    var stavka = document.querySelector(
      "#contentHistory > ul > li:nth-child(1) > div.more > table > tbody > tr:nth-child(1) > td:nth-child(2)"
    ).textContent;
    var smile = "";
    smile = detectSmile(game);
    //alert(game.length);

    if (game.length > 18) smile = smile.split(" ")[2];
    if (game.length > 27) smile = "";
    var teams_smile = "";

    gametype == "баскетбол" ? (teams_smile = "🏀") : 0;
    gametype == "basketball" ? (teams_smile = "🏀") : 0;

    gametype == "футбол" ? (teams_smile = "⚽️") : 0;
    gametype == "football" ? (teams_smile = "⚽️") : 0;

    gametype == "теннис" ? (teams_smile = "🎾") : 0;
    gametype == "tennis" ? (teams_smile = "🎾") : 0;

    gametype == "хоккей" ? (teams_smile = "🏒") : 0;
    gametype == "ice hockey" ? (teams_smile = "🏒") : 0;

    gametype == "настольный теннис" ? (teams_smile = "🏓") : 0;
    gametype == "table tennis" ? (teams_smile = "🏓") : 0;

    gametype == "бадминтон" ? (teams_smile = "🏸") : 0;
    gametype == "badminton" ? (teams_smile = "🏸") : 0;

    gametype == "бейсбол" ? (teams_smile = "⚾️") : 0;
    gametype == "baseball" ? (teams_smile = "⚾️") : 0;

    gametype == "гандбол" ? (teams_smile = "⚽️") : 0;
    gametype == "handball" ? (teams_smile = "⚽️") : 0;

    gametype == "киберспорт" ? (teams_smile = "🎮") : 0;
    gametype == "esports" ? (teams_smile = "🎮") : 0;

    gametype == "крикет" ? (teams_smile = "🏏") : 0;
    gametype == "cricket" ? (teams_smile = "🏏") : 0;

    gametype == "пляжный волейбол" ? (teams_smile = "🏐") : 0;
    gametype == "beach volleyball" ? (teams_smile = "🏐") : 0;

    gametype == "снукер" ? (teams_smile = "🎱") : 0;
    gametype == "snooker" ? (teams_smile = "🎱") : 0;

    gametype == "футзал" ? (teams_smile = "⚽️") : 0;
    gametype == "futsal" ? (teams_smile = "⚽️") : 0;

    gametype == "mortalkombat" ? (teams_smile = "🎮") : 0;

    gametype == "аэрохоккей" ? (teams_smile = "🏒") : 0;
    gametype == "air hockey" ? (teams_smile = "🏒") : 0;

    gametype == "гольф" ? (teams_smile = "🏑") : 0;
    gametype == "golf" ? (teams_smile = "🏑") : 0;

    gametype == "дартс" ? (teams_smile = "🎯") : 0;
    gametype == "darts" ? (teams_smile = "🎯") : 0;

    gametype == "кейрин" ? (teams_smile = "🚴‍♀️") : 0;
    gametype == "keirin" ? (teams_smile = "🚴‍♀️") : 0;

    gametype == "лотерея" ? (teams_smile = "🎰") : 0;
    gametype == "lottery" ? (teams_smile = "🎰") : 0;

    gametype == "регби" ? (teams_smile = "🏈") : 0;
    gametype == "rugby" ? (teams_smile = "🏈") : 0;

    gametype == "скачки" ? (teams_smile = "🏇") : 0;
    gametype == "racing" ? (teams_smile = "🏇") : 0;

    gametype == "собачьи бега" ? (teams_smile = "🐕") : 0;

    if (gametype == "волейбол") teams_smile = "🏐";
    if (gametype == "volleyball") teams_smile = "🏐";
    if (gametype == "футбол") teams_smile = "⚽️";
    if (gametype == "fifa") teams_smile = "🎮";

    //smile=smile+teams_smile;

    var rev_smile = "";

    if (teams.length > 28) teams_smile = "";
    console.log("smile: ", smile);
    var result = "";

    if (typeof smile == "undefined") {
      smile = teams_smile;
      console.log("smile set to teams smile: ", smile);
    }

    if (typeof smile == "undefined" || smile == "") {
      smile = "";
      rev_smile = "";
    } else {
      rev_smile = smile.split(" ").reverse().join("");
    }

    result = convertHTML(
      "Live! 🖤\r\n" +
        smile +
        game +
        rev_smile +
        "\r\n" +
        teams_smile +
        " " +
        teams +
        " " +
        teams_smile
    );

    console.log("making hashtags");

    console.log("gametype " + gametype);

    const betslipAlias = enru ? "\r\n📌Ставка: " : "\r\n📌Bet slip: ";
    const morehastagsAlias = enru
      ? "\r\n\r\n#live #ставки"
      : "\r\n\r\n#live #bets";
    // teams = teams.replace("(", "").replace("/", "").replace(")", "").replace(".", "").replace("+", "_plus");

    result +=
      betslipAlias +
      convertHTML(
        stavka +
          morehastagsAlias +
          " #" +
          gametype.replace(/[^а-яА-Яa-zA-Z0-9.]/g, "_") +
          detectGame(game) +
          "  "
        //  +" #" +
        // teams.split(" - ")[0].replace(/[^а-яА-Яa-zA-Z0-9.]/g, "") +
        // " #" +
        // teams.split(" - ")[1].replace(/[^а-яА-Яa-zA-Z0-9.]/g, "")
      );
return result;
  }
  function copyLine() {
    
      //l
      //implementation line copy

      console.log("started!");
      //just f
      //alert("c space!");
      var game = document
        .querySelector(
          "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.liga"
        )
        .textContent.replace(/[^а-яА-Яa-zA-Z0-9]/g, " ");
      game2 = game.replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
      // alert(game2);
      var teams = document.querySelector(
        "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams"
      ).textContent;
      // alert(teams);
      // document.querySelector("#contentHistory > ul > li.active > div.data > div.arrow").Click();
      var stavka = document.querySelector(
        "#contentHistory > ul > li:nth-child(1) > div.more > table > tbody > tr:nth-child(1) > td:nth-child(2)"
      ).textContent;
      var smile = "";
      smile = detectSmile(game);
      //alert(game.length);

      if (game.length > 18) smile = smile.split(" ")[2];
      if (game.length > 27) smile = "";
      var teams_smile = "";

      teams_smile = "⚽️";
      //smile=smile+teams_smile;

      var rev_smile = "";

      if (teams.length > 28) teams_smile = "";
      console.log("smile: ", smile);
      var result = "";

      if (typeof smile == "undefined") {
        smile = teams_smile;
        console.log("smile set to teams smile: ", smile);
      }

      if (typeof smile == "undefined" || smile == "") {
        smile = "";
        rev_smile = "";
      } else {
        rev_smile = smile.split(" ").reverse().join("");
      }

      const lineAlias = enru ? "Линия! 🖤\r\n" : "Line! 🖤\r\n";
      result = convertHTML(
        lineAlias +
          smile +
          game +
          rev_smile +
          "\r\n" +
          teams_smile +
          " " +
          teams +
          " " +
          teams_smile
      );

      console.log("making hashtags");

      console.log("gametype " + gametype);

      const alsoHashtagsAliases = enru
        ? "\r\n\r\n#линия #ставки #футбол #"
        : "\r\n\r\n#line #bets #soccer #";
      const betslipalias2 = enru ? "\r\n📌Ставка: " : "\r\n📌Bet slip: ";
      // teams = teams.replace("(", "").replace("/", "").replace(")", "").replace(".", "").replace("+", "_plus");

      result +=
        betslipalias2 +
        convertHTML(
          stavka +
            alsoHashtagsAliases +
            game.replace(/[^а-яА-Яa-zA-Z0-9]/g, "_")
          //  +" #" +
          // teams.split(" - ")[0].replace(/[^а-яА-Яa-zA-Z0-9.]/g, "") +
          // " #" +
          // teams.split(" - ")[1].replace(/[^а-яА-Яa-zA-Z0-9.]/g, "")
        );
return result;
  }

  function give_Info(text="",style=""){
    $(function (){ 
      // document.querySelector("")rightSide fl
      $('body > div.contentWrap.clear > div > div > div.blockContent').prepend('<p style="'+style+'">'+text+'</p>');
  });
  }
  //global vars
  let completed = 0;
  let unplayed = 0;
  let won = 0;
  var ready_or_not = " готово!";
  let arrStakes;
  var settings_gmc;
 
  const enru = document
    .querySelector(
      "#top_user > div.clear.headUserInfo > div > span > a > div > div > p.top-b-acc__title"
    )
    .textContent.includes("RUB")
    ? true
    : false;
  //true if rub false if usd
  var done_counter = 0;
  var ticks = 0;

  ("use strict");

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      appendButton();
      lookForStakes();
      
      var need_continue = true;
      var timer = setInterval(() => {
        ticks++;
        if (ticks > 200 && need_continue) document.location.reload();
        console.log("tick");
        
        done_counter=0;
        var datas = document.getElementsByClassName("data");
        for (var i = 0; i < settings_gmc.get("liveMonitor"); i++) {
          if (
            datas[i].getElementsByClassName("kof")[0].style.background ==
            "rgb(85, 192, 20)"
          )
            done_counter++;
          if (
            datas[i].getElementsByClassName("kof")[0].style.background !=
              "rgb(85, 192, 20)" &&
            datas[i].getElementsByClassName("kof")[0].style.background !=
              "rgb(249, 112, 112)"
          )
            ready_or_not = " НЕ готово!";
        }
        if (ready_or_not == " готово!") {
          need_continue = false;
          // Return _HTTP_Post ( "https://api.pushover.net/1/messages.json", "
          // token=aaqgqtsmsjbmgh9imgdjf1x7y2w5y8&
          // user=u5aajre5rqfaubb6paxvkwib76qdzs&
          // message="&$message&"&
          // device=mimax2&
          // title="&$title&"&
          // priority="&$priority&"&
          // sound="&$sound_name&$highest_priority)
          // alert(typeof(localStorage.getItem('CheckNotificationsSend')))
          if (localStorage.getItem("CheckNotificationsSend") == "true") {
            $.ajax({
              type: "POST",
              url: "https://api.pushover.net/1/messages.json",
              data: {
                token: settings_gmc.get("token"),
                user: settings_gmc.get("id"),
                message: `Выиграло ${done_counter} `,
                device: settings_gmc.get("notificationsSend"),
                title: "Ставки готовы",
                priority: 0,
                sound: "cashregister",
              },
            });
          }

          clearInterval(timer);
        }
        document.title = done_counter + ready_or_not;
        // document.querySelector("body > div.contentWrap.clear > div > div > div.nameContent.clear > h1")

        if (arrStakes.length > 1)
          document.querySelector(
            "body > div.contentWrap.clear > div > div > div.blockContent > div > div.colCont.fl > div > div.colContName.clear > div"
          ).textContent = `unplayed ${unplayed} completed ${completed} won ${won}  Live ${ready_or_not}  t ${200-ticks}`;
        else
          document.querySelector(
            "body > div.contentWrap.clear > div > div > div.blockContent > div > div.colCont.fl > div > div.colContName.clear > div"
          ).textContent = `Live ${ready_or_not} (${done_counter})  t ${200-ticks}`;
      }, 1000);
    }
  };

  var gametype = "";

  if (
    typeof localStorage.getItem("gametype") !== "undefined" ||
    localStorage.getItem("gametype") !== null
  ) {
    gametype = localStorage
      .getItem("gametype")
      .replace("Live bets on ", "")
      .replace("Live betting on ", "")
      .replace("Ставки Live на ", "")
      .replace("Live ставки на ", "");
  } else gametype = "";
  // localStorage.setItem("gametype",gametype);
  //  GM_setValue("my_test_value", "YES");
  //alert(GM_getValue('my_test_value'));
  // alert(localStorage.getItem("my_test_value"));
  // Alternative to DOMContentLoaded event

  //alert(gametype)
  // give_Info("Ссылка: " + localStorage.getItem("stake_url"),"font-size:20px;margin:10px;");

  // (gametype=="") ? give_Info("Тип игры: ПУСТО" ,"font-size:25px;margin:10px;background-color:red;color:white;") : give_Info("Тип игры: " + gametype,"font-size:20px;margin:10px;");

  waitForKeyElements(".input.date1.fl.hasDatepicker", changeDate, 0);
  function changeDate() {
    if (
      parseInt(
        document
          .getElementsByClassName("input date1 fl hasDatepicker")[0]
          .value.slice(0, 2)
      ) -
        1 >
      0
    ) {
      document.getElementsByClassName("input date1 fl hasDatepicker")[0].value =
        parseInt(
          document
            .getElementsByClassName("input date1 fl hasDatepicker")[0]
            .value.slice(0, 2)
        ) -
        1 +
        document
          .getElementsByClassName("input date1 fl hasDatepicker")[0]
          .value.slice(2);

      //if(parseInt(document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(2,4))-1>0)
      //console.log("this date changing not tested.");
      // document.getElementsByClassName("input date1 fl hasDatepicker")[0].value = "28" + parseInt(document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(2,4))-1 + document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(4);
    } else {
      //тут сделать  нормальное вычитание месяца!
      // if(parseInt(document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(2,4))-1>0)
      //    document.getElementsByClassName("input date1 fl hasDatepicker")[0].value = "28 -" + parseInt(document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(2,4))-1 + document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(4);
    }

    document.getElementsByClassName("but greenBut fl submit-f-h")[0].click();
    console.log(
      "hystory display changed to " +
        document.getElementsByClassName("input date1 fl hasDatepicker")[0].value
    );
    //console.log(document.getElementsByClassName("input date1 fl hasDatepicker")[0].value.slice(0,2));
  }
  function convertHTML(str) {
    // &colon;&rpar;
    var Regcheck = /\W\s/gi;
    var htmlListObj = {
      "&": "&amp;",
      "<": "&lt;",
      _: "_",
      "*": "*",
      "`": "`",
      ">": "&gt;",
      "'": "&quot;",
      '"': "&apos;",
    };

    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/_/g, "_");
  }

  function detectGame(str) {
    var search = "";
    var result = "";

    search = "fifa";

    const cybersport_alias = enru ? " #киберспорт" : " #cybersport";

    if (str.includes(search)) result += cybersport_alias;

    return result;
  }

  function detectSmile(str) {
    var search = "";
    var result = " ";

    search = "емпион";
    if (str.includes(search)|| str.includes("ampion")) result += "🥇 ";

    search = "Лига";
    if (str.includes(search)|| str.includes("eague")) result += "🏅 ";

    search = "Мастерс";
    if (str.includes(search)|| str.includes("asters")) result += "🏓 ";

   

    search = "убок";
    if (str.includes(search) || str.includes("Cup")|| str.includes("cup")) result += "🏆 ";

    search = "Англи";
    if (str.includes(search)|| str.includes("England")) result += "🏴󠁧󠁢󠁥󠁮󠁧󠁿 ";

    search = "Челленджер серия";

    if (str.includes(search)|| str.includes("hallange")) result += "🥈 ";

    search = "Германии";

    if (str.includes(search) || str.includes("BudnesLiga")|| str.includes("Гамбург")) result += "🇩🇪 ";

    search = "Финлянди";
    if (str.includes(search)|| str.includes("Finland")) result += "🇫🇮 ";
    search = "4x4";
    if (str.includes(search)) result += "4️⃣ ";
    search = "3x3";
    if (str.includes(search)) result += "3️⃣ ";
    search = "5x5";
    if (str.includes(search)) result += "5️⃣ ";

    if (  str.includes("Итали")|| str.includes("Italy")) result += "🇮🇹 ";

    search = "Дании";
    if (str.includes(search)|| str.includes("Denmark")) result += "🇩🇰 ";
    search = "Division";
    if (str.includes(search)) result += "⚔️ ";
    search = "Испании";
    if (str.includes(search)|| str.includes("Spain")) result += "🇪🇸 ";

    search = "Польш";
    if (str.includes(search)|| str.includes("Poland")) result += "🇵🇱 ";

    search = "Албани";
    if (str.includes(search)|| str.includes("Albania")) result += "🇦🇱 ";
    search = "Мекси";
    if (str.includes(search)|| str.includes("Mexico")) result += "🇲🇽 ";
    search = "Вьетнам";
    if (str.includes(search)|| str.includes("Vietnam")) result += "🇻🇳 ";

    search = "Танзани";
    if (str.includes(search)|| str.includes("Tanzania")) result += "🇹🇿 ";

    search = "Беларус";
    if (str.includes(search)|| str.includes("Belarus")) result += "🇧🇾 ";

    search = "Литв";
    if (str.includes(search)|| str.includes("Lithuania")) result += "🇱🇹 ";

    search = "Южной Кореи";
    if (str.includes(search)|| str.includes("South Korea")) result += "🇰🇷 ";

    search = "Dragon League";
    if (str.includes(search)) result += "🐲 ";

    search = "Эстони";
    if (str.includes(search)|| str.includes("Estonia")) result += "🇪🇪 ";

    search = "Австри";
    if (str.includes(search)|| str.includes("Austria")) result += "🇦🇹 ";

    search = "NHL";
    if (str.includes(search)) result += "🏒 ";

    search = "Kombat";
    if (str.includes(search)) result += "👊🏻 ";

    if (str.includes("ortugal") || str.includes("ортугал")) result += "🇵🇹 ";
    if (str.includes("icaragua") || str.includes("икарагуа")) result += "🇳🇮 ";

    search = "Ice Cup";
    if (str.includes(search)) result += "🧊 ";

    search = "Европ";
    if (str.includes(search)|| str.includes("Europe")|| str.includes("Europa")) result += "🌍 ";
    search = "Бразил";
    if (str.includes(search)|| str.includes("Brazil")) result += "🇧🇷 ";
    search = "Esport";
    if (str.includes(search) ) result += "🎮 ";
    search = "Cyber";
    if (str.includes(search)) result += "🎮 ";
    search = "CS:GO";
    if (str.includes(search)) result += "🔫 ";
    search = "Мира";
    if (str.includes(search)|| str.includes("World")|| str.includes("world")) result += "🌐 ";
    search = "2x2";
    if (str.includes(search)) result += "2️⃣ ";

    search = "Ural League";
    if (str.includes(search) || str.includes("Volleyball")) result += "🏐 ";
    search = "Швейцарии";
    if (str.includes(search)|| str.includes("Switzerland")) result += "🇨🇭 ";
    search = "NBA";
    if (str.includes(search)) result += "🏀 ";

    search = "енщин";
    if (str.includes(search) || str.includes("woman")) result += "👱‍♀️ ";
    search = "Франция";
    if (str.includes(search)|| str.includes("France")) result += "🇫🇷 ";    

    search = "Пенальти";
    if (str.includes(search)|| str.includes("enalty")) result += "⚽️ ";

    // if(gametype == "pes" || gametype == "esports") result += "🎮 ";
    // if(gametype == "теннис" || gametype == "tennis") result += "🎾 ";


    return result;
  }

  function attach_smile(str) {
    if (str.length > 29 && str.length < 31) {
      //add 1 smile
    }

    if (str.length <= 29) {
      //add 2 smiles
    }
  }

  document.onkeyup = function (e) {
    var key = e.keyCode;
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 221 && evtobj.ctrlKey && evtobj.shiftKey&& evtobj.altKey)//ctrl sh alt p
    {
      let game_url = localStorage.getItem("stake_url")
      navigator.clipboard.writeText(`🎰Игра🎰 - ${game_url}`);
      
    } 

    
    console.log(
      "%c 🚛: document.onkeyup -> e.keyCode ",
      "font-size:16px;background-color:#dd4a43;color:white;",
      e.keyCode
    );
    //alert(key);
    //-48
    if(key ==73) //i instatext
    {
      navigator.clipboard.writeText(`Если нравится 🖤 мой канал, то приглашайте друзей по ссылке 👉 https://t.me/betochka
И подписывайтесь на мой инстаграм ⬇️
Буду рада знакомству с вами 🥰!`);
    }
    if (e.altKey && key == 73)//alt i instabutton
    {
  navigator.clipboard.writeText(`🖤Мой профиль🖤 - https://www.instagram.com/bet0chka/`);
    }
    if (key == 80) {
      //p
      var arr = document
        .querySelector(
          "#contentHistory > ul > li:nth-child(1) > div.more > table > tbody > tr:nth-child(1) > td.name"
        )
        .textContent.split("\n")
        .map(function (item) {
          return item.trim();
        });
      function camelize(str) {
        return str
          .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "");
      }

      console.log(arr);
      var teams = arr[2].split(" - ");
      var time = arr[2].substring(arr[2].indexOf("|") + 2);
      console.log(
        "%c 🇲🇼: document.onkeyup -> time ",
        "font-size:16px;background-color:#5fa368;color:white;",
        time
      );

      const todayPlay = enru ? `📌Сегодня играют #` : `📌Playing today #`;
      const beginingAlias = enru ? ` / Начало в ` : ` / Starts at `;
      const iBetOnAlias = enru
        ? ` (по мск) ⚽️🔥

✅Я ставлю на `
        : ` ⚽️🔥

✅I bet on `;
      const hashtagsAliases = enru
        ? `! 💰

#новости #прогноз #футбол #ставки #`
        : `! 💰

#news #prediction #soccer #bets #`;
      navigator.clipboard.writeText(
        todayPlay +
          camelize(teams[0]).replace(" ", "") +
          ` 🆚 #` +
          camelize(teams[1])
            .replace(" ", "")
            .substring(
              0,
              camelize(teams[1]).replace(" ", "").indexOf(".") - 2
            ) +
          beginingAlias +
          time +
          iBetOnAlias +
          document.querySelector(
            "#contentHistory > ul > li:nth-child(1) > div.more > table > tbody > tr:nth-child(1) > td:nth-child(2)"
          ).textContent +
          hashtagsAliases +
          arr[1].replace(/[^а-яА-Яa-zA-Z0-9.]/g, "_")
      );
    }

    if (key == 76) {
      navigator.clipboard.writeText(copyLine());
    }
    var string_numbers = "";
    if (key == 65) {
      //a
    navigator.clipboard.writeText(copyButtonsToBuffer(enru));

       
    }
    if (e.altKey && key == 84) {
      //alt t
      document.getElementsByClassName("arrow")[0].click();

      //alert();
      //document.getElementsByClassName("arrow")[0].style.backgroundColor = "red";
      //  #contentHistory > ul > li.active > div.more > table > tbody > tr.itog > td:nth-child(2)

      var params = "prinyata" + "\r\n";

      // check it
      const resultAlias = enru ? "Результат: " : "Result: ";
      if (
        document.querySelector(
          "#contentHistory > ul > li.active > div.more > table > tbody > tr:nth-child(1) > td.name > div > div:nth-child(1)"
        ).textContent == resultAlias
      )
        params += "ne live" + "\r\n";
      else params += "live" + "\r\n";

      params +=
        document
          .getElementsByClassName("data")[0]
          .getElementsByClassName("number")[0]
          .textContent.slice(7) + "\r\n"; //купон
      params +=
        document
          .getElementsByClassName("itog")[0]
          .getElementsByTagName("td")[1]
          .textContent.split(" ")[0] + "\r\n"; //сумма
      params +=
        document
          .getElementsByClassName("data")[0]
          .getElementsByClassName("dateTime")[0].textContent + "\r\n"; //dateTime
      params +=
        document
          .getElementsByClassName("tableMore")[0]
          .getElementsByTagName("td")[2].textContent + "\r\n"; //koef
      params +=
        document.querySelector(
          "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.liga"
        ).textContent + "\r\n";
      params +=
        document.querySelector(
          "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams"
        ).textContent + "\r\n";
      params +=
        document
          .querySelector(
            "#contentHistory > ul > li.active > div.more > table > tbody > tr:nth-child(1) > td.name"
          )
          .textContent.split("\n")[2]
          .replace(
            document.querySelector(
              "#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams"
            ).textContent,
            ""
          )
          .trim() + "\r\n";
      params +=
        document.querySelector(
          "#contentHistory > ul > li.active > div.more > table > tbody > tr:nth-child(1) > td:nth-child(2)"
        ).textContent + "\r\n";
      params +=
        document.querySelector(
          "#contentHistory > ul > li.active > div.more > table > tbody > tr.itog > td:nth-child(3) > b"
        ).textContent + "\r\n";

      //alert("ne live");
      console.log(
        document.querySelector(
          "#contentHistory > ul > li.active > div.more > table > tbody > tr:nth-child(1) > td.name > div > div:nth-child(1)"
        ).textContent
      );
      //params += +'\r\n';

      console.log();

      navigator.clipboard.writeText(params);
    }

    if (e.altKey && key == 76) {
      //alt l listprint
      //поместим сюда все выигрыши, коэф которых больше 1
      string_numbers = "";
      var datas = document.getElementsByClassName("data");
      for (var i = 0; i < datas.length; i++) {
        if (
          datas[i].getElementsByClassName("kof")[0].style.background ==
            "rgb(85, 192, 20)" &&
          datas[i].getElementsByClassName("kof")[0].textContent > "1"
        )
          string_numbers +=
            datas[i].getElementsByClassName("number")[0].textContent.slice(7) +
            "\r\n";
      }
      navigator.clipboard.writeText(string_numbers);
      console.log(string_numbers);
    }
    // e.altKey &&
    if ( key == 83) {
      //shift s
      if (document.readyState == "complete") {
        navigator.clipboard.writeText("complete");
      }
    }
    if (key == 87) {
      //w key
      navigator.clipboard.writeText(
        document.getElementsByClassName("number")[0].textContent.slice(7)
      );
      console.log(
        document.getElementsByClassName("number")[0].textContent.slice(7)
      );
    }

    if (e.altKey && key > 48 && key < 58) {
      //
      //console.log(document.getElementsByClassName("number")[key-49].textContent.slice(7) + "," + document.getElementsByClassName("kof")[key-49].style.background)
      if (
        document.getElementsByClassName("kof")[key - 49].style.background ==
        "rgb(85, 192, 20)"
      ) {
        console.log(
          document
            .getElementsByClassName("number")
            [key - 49].textContent.slice(7)
        );
        navigator.clipboard.writeText(
          document
            .getElementsByClassName("number")
            [key - 49].textContent.slice(7)
        );
      } else if (
        document.getElementsByClassName("kof")[key - 49].style.background ==
        "rgb(249, 112, 112)"
      ) {
        console.log("red");
        navigator.clipboard.writeText("red");
      } else {
        console.log("white");
        navigator.clipboard.writeText("white");
      }
      //navigator.clipboard.writeText(convertHTML(document.querySelector("#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.liga").textContent +"\r\n"+ document.querySelector("#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams").textContent));
      //alert( $("#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.liga").text() +"\r\n"+ $("#contentHistory > ul > li:nth-child(1) > div.data > div.name > div.teams").text());
    }
    if (key == 70) {
    navigator.clipboard.writeText(copyLive());

      
    }

    if (e.ctrlKey && key == 81) {
      //ctrl q - вторая часть
      navigator.clipboard.writeText();
      //alert($("#contentHistory > ul > li:nth-child(1) > div.more > table > tbody > tr:nth-child(1) > td:nth-child(2)").text());
    }

    if (key == 90) {
  navigator.clipboard.writeText(copyLinkButton(enru));

       
    }


  };

  function lookForStakes() {
    if (localStorage.getItem("listMonitor") === null)
      localStorage.setItem("listMonitor", []);
    arrStakes = localStorage.getItem("listMonitor").split("\n");

    if (JSON.stringify(arrStakes).length > 3)
      arrStakes.forEach((stake) => {
        //поместим сюда все выигрыши, коэф которых больше 1
//htlf
        var datas = document.getElementsByClassName("data");
        
        
        for (var i = 0; i < settings_gmc.get("liveMonitor"); i++) {
          if (
            datas[i]
              .getElementsByClassName("number")[0]
              .textContent.indexOf(stake) > -1
          ) {
            if (
              datas[i].getElementsByClassName("kof")[0].style.background ==
              "rgb(85, 192, 20)"
            ) {
              won++;
              completed++;
            } else if (
              datas[i].getElementsByClassName("kof")[0].style.background ==
              "rgb(249, 112, 112)"
            )
              completed++;
            else unplayed++;
          }
        }

        // if (
        //   datas[i].getElementsByClassName("kof")[0].style.background ==
        //     "rgb(85, 192, 20)" &&
        //   datas[i].getElementsByClassName("number")[0].textContent.indexOf("")
        // )
        //   string_numbers +=
        //     datas[i].getElementsByClassName("number")[0].textContent.slice(7) +
        //     "\r\n";

        // navigator.clipboard.writeText(string_numbers);
        // console.log(string_numbers);
      });
    //total ${document.getElementsByClassName("data").length}
    console.log(
      "%c 🎆: lookForStakes -> unplayed ",
      "font-size:16px;background-color:#b69ae8;color:white;",
      `Line: unplayed ${unplayed} completed ${completed} won ${won} `
    );
    // console.log("%c 👩‍👩‍👦‍👦: lookForStakes -> arrStakes.length ", "font-size:16px;background-color:#5c234b;color:white;", JSON.stringify(arrStakes).length>3)
    if (
      completed === arrStakes.length &&
      JSON.stringify(arrStakes).length > 3
    ) {
      // alert(localStorage.getItem('CheckNotificationsSend'))
      if (localStorage.getItem("CheckNotificationsSend") == "true") {
        $.ajax({
          type: "POST",
          url: "https://api.pushover.net/1/messages.json",
          data: {
            token: settings_gmc.get("token"),
            user: settings_gmc.get("id"),
            message: `Выиграло ${done_counter} `,
            device: settings_gmc.get("notificationsSend"),
            title: "Линии готовы!!!",
            priority: 0,
            sound: "classical",
          },
        });
      }

      //localStorage.setItem('listMonitor','');
    }
  }

  

  function appendButton() {
    settings_gmc = new GM_configStruct({
      id: "MyConfig", // The id used for this instance of GM_config
      title: "Настройки мониторинга купонов", // Panel Title
      // Fields object
      fields: {
        // This is the id of the field
        listMonitor: {
          labelPos: "above",
          label: "Мониторинг", // Appears next to field
          width: "20%",
          rows: "30",
          type: "textarea", // Makes this setting a text field

          default:
            "введите номера купонов которые надо мониторить\r\nкаждый в отдельной строке", // Default value if user doesn't change it
        },
        // This is the id of the field
        liveMonitor: {
          labelPos: "above",
          label: "Количество последних ставок лайва", // Appears next to field
          type: "text", // Makes this setting a text field

          default: "7", // Default value if user doesn't change it
        },
        notificationsSend: {
          label: "Device for notifs", // Appears next to field
          type: "text", // Makes this setting a text input
          title: "device name", // Add a tooltip (hover over text)
          size: 100, // Limit length of input (default is 25)
          default: "name", // Default value if user doesn't change it
        },
        CheckNotificationsSend: {
          label: "Send?", // Appears next to field
          type: "checkbox", // Makes this setting a text input
          default: "true", // Default value if user doesn't change it
        },

        token: {
          label: "token", // Appears next to field
          type: "text", // Makes this setting a text input
          title: "token", // Add a tooltip (hover over text)
          size: 100, // Limit length of input (default is 25)
          default: "token", // Default value if user doesn't change it
        },
        id: {
          label: "user", // Appears next to field
          type: "text", // Makes this setting a text input
          title: "user", // Add a tooltip (hover over text)
          size: 100, // Limit length of input (default is 25)
          default: "user", // Default value if user doesn't change it
        },
      },

      events: {
        init: function () {
          if (localStorage.getItem("notificationsSend") === null)
            localStorage.setItem("notificationsSend", false);
          this.set("listMonitor", localStorage.getItem("listMonitor"));
          this.set("liveMonitor", localStorage.getItem("liveMonitor"));
          this.set("token", localStorage.getItem("token"));
          this.set("id", localStorage.getItem("id"));
          this.set(
            "notificationsSend",
            localStorage.getItem("notificationsSend").toString()
          );
          localStorage.getItem("CheckNotificationsSend") == "true"
            ? this.set("CheckNotificationsSend", true)
            : this.set("CheckNotificationsSend", false);
          // Object.keys(this)
          console.log(
            "%c 🍵: appendButton -> Object.keys(this) ",
            "font-size:16px;background-color:#3a953f;color:white;",
            Object.keys(this)
          );
          // this.set('system1', localStorage.getItem('system1'));
          // this.set('system2', localStorage.getItem('system2'));
          // this.set('system3', localStorage.getItem('system3'));

          // this.set('sum', localStorage.getItem('sum'));
        },
        save: function () {
          // alert(this.get('CheckNotificationsSend'))
          localStorage.setItem("listMonitor", this.get("listMonitor"));
          localStorage.setItem("token", this.get("token"));
          localStorage.setItem("id", this.get("id"));
          localStorage.setItem(
            "CheckNotificationsSend",
            this.get("CheckNotificationsSend")
          );

          localStorage.setItem(
            "notificationsSend",
            this.get("notificationsSend")
          );
          localStorage.setItem("liveMonitor", this.get("liveMonitor"));
          settings_gmc.close();
          // localStorage.setItem('system1', this.get('system1'));
          // localStorage.setItem('system2', this.get('system2'));
          // localStorage.setItem('system3', this.get('system3'));

          // localStorage.setItem('sum', this.get('sum'));
        },
      } /* */,
    });

    var btn_open_settings = document.createElement("button");
    btn_open_settings.innerHTML = "Установки";
    btn_open_settings.title = "Нажмите чтобы установить параметры.";
    btn_open_settings.className = "but greenBut fl del ";

    btn_open_settings.addEventListener("click", function () {
      settings_gmc.open();
    });
    //live text
  
    function createButton(caption, details, func) {
      var btn_open_settings = document.createElement("button");
      btn_open_settings.innerHTML = caption;
      btn_open_settings.title = details;
      btn_open_settings.className = "but greenBut fl del ";

      btn_open_settings.addEventListener("click", func);
      document
        .querySelector(
          "#filters > div.filterDate.clear > input.but.greenBut.fl.del.delete_history"
        )
        .after(btn_open_settings);
    }

    createButton(
      "Кнопки",
      "Нажмите чтобы скопировать текст кнопок",
      copyButtonsToBuffer
    );

    // document.querySelector("body > div.contentWrap.clear > div > div > div.blockContent > div > div.colCont.fl > div > div.colContName.clear > ul > li.fl.active > a").after(btn_open_settings);
    document
      .querySelector(
        "#filters > div.filterDate.clear > input.but.greenBut.fl.del.delete_history"
      )
      .after(btn_open_settings);

      $(function (){ 
         
        const selector_prep = "body > div.contentWrap.clear > div > div > div.blockContent > div > div.colCont.fl";

       let insta_text1 =  (enru)? `🖤Мой профиль🖤 - https://www.instagram.com/bet0chka/` :  `If you like 🖤 my channel, then invite friends via the link 👉 https://t.me/bettingpeople
       And subscribe to my instagram ⬇️
       I would be glad to meet you 🥰!`;
       let insta_text2 =  (enru)? `Если нравится 🖤 мой канал, то приглашайте друзей по ссылке 👉 https://t.me/betochka
       И подписывайтесь на мой инстаграм ⬇️
       Буду рада знакомству с вами 🥰!` :  `🖤My profile🖤 - https://www.instagram.com/bet0chka/`;

        $(selector_prep).prepend(`<div id="mycontiner" style="margin-bottom:10px; width:100%;   display: flex;  justify-content: space-between;">
        
        <div style="display:flex; flex-direction: column;   margin: 0px!; width:24%; ">
        <p style="width:100px;">LIVE</p>
        <textarea rows="10" cols="50" id="live_area" class="but greenBut fl submit-f-h" style="cursor:pointer; padding:5px;" readonly="readonly" unselectable="on"> ${copyLive()} </textarea>
        </div>

        <div style="display:flex; flex-direction: column; align-items:stretch;  margin: 0px!; width:24%;">
        <p style="width:100px;">Кнопки</p>
        <textarea rows="4" cols="50" id="singlebutton" class="but greenBut fl submit-f-h" style="cursor:pointer; padding:5px;" readonly="readonly" unselectable="on"> ${copyLinkButton(enru)} </textarea>
        
        <textarea rows="5" cols="50" id="manybuttons" class="but greenBut fl submit-f-h" style="margin-top: auto; cursor:pointer; padding:5px; w" readonly="readonly" unselectable="on"> ${copyButtonsToBuffer(enru)} </textarea>
        </div>

        <div style="display:flex; flex-direction: column; margin: 0px; width:24%;">
        <p style="width:100px;">Линия</p>
        <textarea rows="10" cols="50" id="line_area" class="but greenBut fl submit-f-h" style="cursor:pointer; padding:5px;" readonly="readonly" unselectable="on"> ${copyLine()} </textarea>
        </div>

        <div style="display:flex; flex-direction: column; align-items:stretch;  margin: 0px!; width:24%;">
        <p style="width:100px;">Инста</p>
        <textarea rows="6" cols="50" id="singlebutton" class="but greenBut fl submit-f-h" style="cursor:pointer; padding:5px;" readonly="readonly" unselectable="on"> ${insta_text1} </textarea>
        
        <textarea rows="3" cols="50" id="manybuttons" class="but greenBut fl submit-f-h" style="margin-top: auto; cursor:pointer; padding:5px; w" readonly="readonly" unselectable="on"> ${insta_text2} </textarea>
        </div>

    
        
        

        </div>`);
        // $(selector_prep).prepend(`
        
        // `);
        $('#line_area').on('click',function(){
          
            $(this).fadeTo('fast', 0.4);
            $(this).fadeTo('fast',1.0);
        
          navigator.clipboard.writeText(copyLine());

        });

      
        $('#manybuttons').on('click',function(){
          $(this).fadeTo('fast', 0.4);
            $(this).fadeTo('fast',1.0);
          navigator.clipboard.writeText(copyButtonsToBuffer(enru));

        });

        $(selector_prep).prepend(`
        
        
        `);
        $('#singlebutton').on('click',function(){
          $(this).fadeTo('fast', 0.4);
            $(this).fadeTo('fast',1.0);
          navigator.clipboard.writeText(copyLinkButton(enru));

        });

     
        $('#live_area').on('click',function(){
          $(this).fadeTo('fast', 0.4);
            $(this).fadeTo('fast',1.0);
          navigator.clipboard.writeText(copyLive());

        });


    

        


        



      });
       

  }

  let mytimer = setInterval(() => {
 console.log(window.frames.length)
//  console.log()
    if(window.frames.length!=0){
      clearInterval(mytimer);
      // console.log(window.frames[1].style)
      $consultant.widget.api.hideFrame();
      
    }
  }, 1000);

  


}
if(allow_once=='1')
{
	main();
	localStorage.setItem('allow_once','0');
}

function copyButtonsToBuffer(enru) {
  var allow = 1
  let game_url = localStorage.getItem("stake_url")
  let buttonUrlsAliases;
  // 💖Ставим тут💖 - https://beto4ka.generalmirror.site/
  
// 💖We bet here💖 - https://beto4ka.generalmirror.site/
  if (allow) {
    
  
   buttonUrlsAliases = enru
    ? `🔶Получить 10400 рублей🔶 - https://beto4ka.generalmirror.site/ 
🔴Получить 3800 гривен 🔴 - https://beto4ka.generalmirror.site/ 
🔸Получить 61000 тенге 🔸 - https://beto4ka.generalmirror.site/ 
📱Скачать приложение📱 - http://refpa442881.top/L?tag=s_516977m_22819c_&site=516977&ad=22819
🎰Игра🎰 - ${game_url}
`


    : `🔶Get 130 USD🔶 - https://beto4ka.mybestmirror.site
🔴Get 130 EUR 🔴 - https://beto4ka.mybestmirror.site
🎰Game🎰 - ${game_url}
📱Download application📱 - http://refpa442881.top/L?tag=s_516977m_22819c_&site=516977&ad=22819`;
}
else {
   buttonUrlsAliases = enru
    ? `🔶Получить 10400 рублей🔶 - https://beto4ka.generalmirror.site/ 
🔴Получить 3800 гривен 🔴 - https://beto4ka.generalmirror.site/ 
🔸Получить 61000 тенге 🔸 - https://beto4ka.generalmirror.site/ 
💖Ставим тут💖 - https://beto4ka.generalmirror.site/`


    : `🔶Get 130 USD🔶 - https://beto4ka.mybestmirror.site
🔴Get 130 EUR 🔴 - https://beto4ka.mybestmirror.site 
💖We bet here💖 - https://beto4ka.mybestmirror.site`;
}
return buttonUrlsAliases;
}

function copyLinkButton(enru) {

  let game_url = localStorage.getItem("stake_url")
  let buttonUrlsAliases;
  buttonUrlsAliases = enru ? `🎰Ставим тут🎰 - ${game_url}`  : `🎰Bet here🎰 - ${game_url}`;
  return buttonUrlsAliases;
}


(async () => {


  const currenth = new Date().getHours();
  const prevh = localStorage.getItem('hour_checked') || 1000;
  
  
if (prevh!=currenth)
  {
  GM.xmlHttpRequest({
  method: "GET",
  url: "https://pastebin.com/raw/Ym60RZQH",
  onload: function(response) {
	  
allow = (response.responseText=='bad proger') ? '0' :'1';

test_acess = (response.responseText=='test') ? '1' :'0';

localStorage.setItem('allow',allow);
localStorage.setItem('test_acess',test_acess);
localStorage.setItem('hour_checked',currenth);
	
console.log('CHECKED: ' + response.responseText)
document.location.reload();
  }
});
}
	console.log(`
	
allow:	${allow}
allow_once:	${allow_once}
test:	${test_acess}
checked at: ${currenth}
check ${(prevh!=currenth) ? 'made' : 'skipped'}
	`);

	if(allow=='1')
		main();
	else {


if(test_acess=='1')
{
	
	var place_into = document.querySelector("#filters > div.filterDate.clear > div");
	var test_button = document.createElement("button");
    test_button.innerHTML = "Пожалуйста, нажмите эту кнопку.";
    test_button.title = "Иначе нельзя. Правда.";
    test_button.className = "greenBut fl submit-f-h";
	test_button.style.padding = '10px';
	test_button.style.margin = '3px';

let clicks = 0;

function update_button(title,message=title)
{
	
	test_button.innerHTML=title;
	
	if(message) 
		document.querySelector("body > div.contentWrap.clear > div > div > div.blockContent > div > div.colCont.fl > div > div.colContName.clear > div").textContent = message;
		// alert(message);
}

    test_button.onclick = function () {
		
      // localStorage.setItem('allow','1');
      // localStorage.setItem('test_acess','0');
	  // document.location.reload();
	  if(clicks==0)
	  {
		  localStorage.setItem('allow_once','1');
		  test_button.innerHTML = "Спасибо!";}
  else 
	  test_button.innerHTML+='!';
  

if(clicks==10) update_button("Я молодец!",'Вы большой(ая) молодец!');
if(clicks==20) update_button('Это не кликер!');
if(clicks==30) update_button('А жаль!');
if(clicks==40) update_button('Я хочу знать что будет дальше!','Вы хотите узнать что будет дальше.');
if(clicks==50) update_button('Я могу перезагрузить страницу сам(а)!','Вы можете перезагрузить страницу сами');
if(clicks==70)	 {
	
	document.location.reload();
}
  

  
	  clicks++;
    }
	
	place_into.before(test_button);
}
}

})().catch(err => {
    console.error(err);
});

