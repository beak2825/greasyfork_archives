// ==UserScript==
// @name        Black Screen
// @description Black Screens
// @author      anonymous
// @namespace   anonymous
// @version     4.5
// @match       http://10.2.12.200/app/attendant422/main.html?cartType=SELF
// @icon        https://
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458636/Black%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/458636/Black%20Screen.meta.js
// ==/UserScript==
var RegiList;
var MenuArea;
var Regi;
var RegiEle;
var RegiID;
var CoinData;
var RCA;
var RCB;
var COA;
var COB;
var SearchItems = new RegExp(localStorage.getItem("SearchItems"));
var SearchItems_ = localStorage.getItem("SearchItems");
if ( !SearchItems_ ) {
  SearchItems = /サトノダイヤモンド/;
}
var searchCondition = {
  StoreCode: "00422"
};
var mainteParam = {
  "AccessCode": null,
  "LangCode": null,
  "ManagementType": 9,
  "IsBOAccess": true,
  "UserId": 90001026,
  "SearchCondition": JSON.stringify(searchCondition)
};

var css = function(){/*
  html,body {
    overflow: hidden;
    background: #42474B;
    color: #fff;
    width: 100%;
  }
  div[class="cart-detail-div"] {
    display: none;
  }
  div[class*="watch-content"] {
    overflow: hidden;
    overflow-y: hidden !important;
    width: 93%;
    right: 0.15%;
  }
  div[class*="keep-header"][class*="stagenormal"] {
    height: 11% !important;
  }
  div[class="pro-info  detail-model"] {
    top: 8% !important;
    width: 99.1% !important;
    height: 8% !important;
    margin: 0 0 0 0 !important;
  }
  div[class="pro-sum textHeight  detail-model"] {
    width: 99.1% !important;
    height: auto !important;
    margin: 0 0 0 0 !important;
  }
  div[name="showError"] {
    margin: 0 5px !important;
  }
  div[class*="stagenormal"] {
    background: #42474B !important;
  }
  div[class*="stageinvalid"] {
    background: rgba(0,0,0,0.4) !important;
  }
  div[class="keep-border warn-backcolor"] {
    background: rgba(0,0,0,0.5) !important;
    border-color: #FF3399 !important;
  }
  div[class="keep-header stagewarn"] {
    background: rgba(0,0,0,0.5) !important;
  }
  div[class="keep-border notice-backcolor"] {
    background: rgba(0,0,0,0.5) !important;
    border-color: #00FFFF !important;
  }
  div[class="keep-header stagenotice"] {
    background: rgba(0,0,0,0.5) !important;
  }
  div[class*="table-bordered"] {
    border: 1px solid #42474B;
  }
  div[name="proDetail"] {
    display: flex;
  }
  div[name="proDetail"] {
    height: 74% !important;
    bottom: 8% !important;
    margin: 0 0 1% 0 !important;
  }
  div[class="clear-init pro-list-area"] {
    width: 77.5%;
    margin: 0 1% !important;
  }
  div[name="tabletName"],div[name="tabletState"] {
    color: #FFFFFF !important;
    font-size: 16px !important;
  }
  div[class="protype"] {
    font-size: 13px !important;
    color: #000 !important;
    background: #fd7e00 !important;
  }
  div[class*="clear-init"],div[class="num"] {
    font-size: 13px !important;
  }
  div[class*="pro-list proName "] {
    font-size: 13px !important;
  }
  div[class*="pro-list   text-right"] {
    font-size: 13px !important;
    right: 1% !important;
  }
  table[class*="CoinTable"] {
    font-size: 13px !important;
    width: 19%;
  }
  table[class*="CoinTable"] TD {
    display: table-cell;
    border: 1px solid #ddd;
  }
  table[class*="CoinTable"] TD[class*="Right"] {
    text-align: right;
  }
  div[class="time"] {
    padding: 15px 0px 15px 0px;
    font-size: 15px !important;
  }
  a{
	color: #FFFFFF;
    text-decoration: none;
  }
  input[id="InputBoxEins"]{
	color: #000;
  }
*/}.toString().match(/\n([\s\S]*)\n/)[1];
function ChangeCSS() {
var style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
}


function LoadWait() {
  if ( document.querySelectorAll('div[class="cart-div"]').length != 36 ) {
    setTimeout( LoadWait, 100 );
    return;
  } else {
    LoadWait_();
  }
}
LoadWait();
function LoadWait_() {
  try {
    if ( document.querySelectorAll('div[class="cart-div"]')[0].style.width == "25%" ) {
      MainTask();
    } else {
      setTimeout( LoadWait_, 100 );
      return;
    }
  } catch (e) {
    return;
  }
}
LoadWait_();


function MainTask() {
  ChangeCSS();
  RegiList = document.querySelector('div[class="watch-content"]');
  MenuArea = document.querySelector('div[class="menu-area"]');
  Regi = document.querySelectorAll('div[class="cart-div"]');
  resize();
  CreateTable();
  MenuAreas();
  setInterval(GetCoin,1000);
  ObserverCreate();
}

function MenuAreas() {
  document.querySelector('div[class=" btn-close"]').remove();
  document.querySelector('div[class="model-menu"]').remove();
  document.querySelector('div[id="storeName"]').remove();
  document.querySelector('div[id="showTime"]').remove();
  document.querySelector('div[id="specialBtn"]').parentElement.remove();
  document.querySelector('div[id="バーコード"]').parentElement.remove();
  document.querySelector('div[id="receiptBtnMember"]').parentElement.remove();
  document.querySelector('div[id="receiptBtnCart"]').parentElement.remove();
  document.querySelector('div[id="optRecordBtn"]').parentElement.remove();
  var MenuArea = document.querySelector('div[class="info-menu"');
  MenuArea.insertAdjacentHTML('beforeend', '<div class="time"></div>');
  var MenuArea_ = document.querySelector('div[class="menu-area"');
  MenuArea_.insertAdjacentHTML('beforeend', '<a href="http://10.2.12.200/app/attendant422/main.html?cartType=SELF" ><div class="btn-menu"><div class="btn special">再読み込み</div></div></a>');
  MenuArea_.insertAdjacentHTML('beforeend', '<a href="https://trialmercury.posaas.net/POS4ULS_BO/CashChangerStateList.html" target="_blank"><div class="btn-menu"><div class="btn special">釣銭機在高情報</div></div></a>');
  MenuArea_.insertAdjacentHTML('beforeend', '<a href="https://trialmercury.posaas.net/POS4ULS_BO/EJournal.html" target="_blank"><div class="btn-menu"><div class="btn special">電子ジャーナル</div></div></a>');
  MenuArea_.insertAdjacentHTML('beforeend', '<a href="http://10.2.4.86/LostFinder_New/" target="_blank"><div class="btn-menu"><div class="btn special">忘れ物台帳管理</div></div></a>');
  MenuArea_.insertAdjacentHTML('beforeend', '商品検索<button type="button" id="InputBoxZwei">♡</button><input id="InputBoxEins" type="text" size="8" value="' + SearchItems_ + '"></label>');
  MenuArea_.insertAdjacentHTML('beforeend', '<BR><BR><select id="SelectBoxEins"><option value="A26">A26</option><option value="A31">A31</option></select><button type="button" id="SelectBoxZwei">♡</button>');
  var Button = document.querySelector('button[id="InputBoxZwei"]');
  var Button_ = document.querySelector('button[id="SelectBoxZwei"]');
  var Button__ = document.querySelector('div[class="time"]');
  setInterval(LoadProc,1000);
  Button.addEventListener('click',()=>{
    var Box = document.querySelector('input[id="InputBoxEins"]');
    localStorage.setItem("SearchItems", Box.value);
    if ( !Box.value ) {
      SearchItems = /サトノダイヤモンド/;
    } else {
      SearchItems = new RegExp(Box.value);
    }
    ;
  }, false);
  Button_.addEventListener('click',()=>{
    var Box_ = document.querySelector('select[id="SelectBoxEins"]');
    GetMusic(Box_.value);
  }, false);
  Button__.addEventListener('click',()=>{
    document.title = "利用状況監視_";
  }, false);
}

function LoadProc() {
  var now = new window.Date();
  var Year = now.getFullYear().toString().substr(2);
  var Month = now.getMonth()+1;
  var Month_ = Month.toString().padStart(2, "0");
  var Date = now.getDate().toString().padStart(2, "0");
  var Hour = now.getHours().toString().padStart(2, "0");
  var Min = now.getMinutes().toString().padStart(2, "0");
  var Sec = now.getSeconds().toString().padStart(2, "0");
  var Week = now.getDay() ;	// 曜日(数値)
  var Week_ = [ "日", "月", "火", "水", "木", "金", "土" ][Week];
  // console.log(Year + "年" + Month + "月" + Date + "日" + Hour + ":" + Min + ":" + Sec);
  document.querySelector('div[class="time"]').innerHTML = Year + '/' + Month_ + '/' + Date + '(' + Week_ +')<BR>' + Hour + ':' + Min + ':' + Sec;
}

function CreateTable() {
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[0];
  RegiID = "RI2501"
  CreateTable_();
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[1];
  RegiID = "RI2502"
  CreateTable_();
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[2];
  RegiID = "RI2503"
  CreateTable_();
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[3];
  RegiID = "RI2504"
  CreateTable_();
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[4];
  RegiID = "RI2505"
  CreateTable_();
  RegiEle = document.querySelectorAll('div[name="proDetail"]')[5];
  RegiID = "RI2506"
  CreateTable_();
}

function CreateTable_() {
  eval(`
  RegiEle.insertAdjacentHTML('beforeend', '\
  <table class="CoinTable ${RegiID}">\
    <tbody>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">1</td>\
        <td class="CoinTable ${RegiID}_1 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">5</td>\
        <td class="CoinTable ${RegiID}_5 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">10</td>\
        <td class="CoinTable ${RegiID}_10 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">50</td>\
        <td class="CoinTable ${RegiID}_50 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">100</td>\
        <td class="CoinTable ${RegiID}_100 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">500</td>\
        <td class="CoinTable ${RegiID}_500 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">1,000</td>\
        <td class="CoinTable ${RegiID}_1000 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">2,000</td>\
        <td class="CoinTable ${RegiID}_2000 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">5,000</td>\
        <td class="CoinTable ${RegiID}_5000 Right"></td>\
      </tr>\
      <tr>\
        <td class="CoinTable ${RegiID} Left">10,000</td>\
        <td class="CoinTable ${RegiID}_10000 Right"></td>\
      </tr>\
    </tbody>\
  </table>');
  `);
}

function resize() {
//  var RegiWidth = RegiList.clientWidth / 3 - 1;
  var RegiWidth = (window.innerWidth - MenuArea.clientWidth) / 3 - 1;
//  var RegiHeight = RegiList.clientHeight / 2;
//  var RegiHeight = document.body.clientHeight / 2;
  var RegiHeight = window.innerHeight / 2 - 1;
  for (var i = 0; i < Regi.length; i++) {
    Regi[i].style.width = RegiWidth + "px";
    Regi[i].style.height = RegiHeight + "px";
  }
};

window.onresize=function(){
  resize();
};

async function GetCoin() {
  var response = await makeGetRequest();
  CoinData = JSON.parse(JSON.parse(response).Datas);
  RCA = 0;
  RCB = 2501;
  CoinView();
  RCA = 1;
  RCB = 2502;
  CoinView();
  RCA = 2;
  RCB = 2503;
  CoinView();
  RCA = 3;
  RCB = 2504;
  CoinView();
  RCA = 4;
  RCB = 2505;
  CoinView();
  RCA = 5;
  RCB = 2506;
  CoinView();
}
function CoinView() {
  eval(`
  if (120 <= CoinData[${RCA}].CoinCount1){
    if (140 <= CoinData[${RCA}].CoinCount1){
      document.querySelector('td[class*="RI${RCB}_1"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount1 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_1"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount1 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_1"]').innerHTML = CoinData[${RCA}].CoinCount1;
  }
  if (120 <= CoinData[${RCA}].CoinCount5){
    if (140 <= CoinData[${RCA}].CoinCount5){
      document.querySelector('td[class*="RI${RCB}_5"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount5 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_5"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount5 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_5"]').innerHTML = CoinData[${RCA}].CoinCount5;
  }
  if (120 <= CoinData[${RCA}].CoinCount10){
    if (140 <= CoinData[${RCA}].CoinCount10){
      document.querySelector('td[class*="RI${RCB}_10"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount10 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_10"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount10 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_10"]').innerHTML = CoinData[${RCA}].CoinCount10;
  }
  if (120 <= CoinData[${RCA}].CoinCount50){
    if (140 <= CoinData[${RCA}].CoinCount50){
      document.querySelector('td[class*="RI${RCB}_50"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount50 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_50"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount50 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_50"]').innerHTML = CoinData[${RCA}].CoinCount50;
  }
  if (120 <= CoinData[${RCA}].CoinCount100){
    if (140 <= CoinData[${RCA}].CoinCount100){
      document.querySelector('td[class*="RI${RCB}_100"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount100 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_100"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount100 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_100"]').innerHTML = CoinData[${RCA}].CoinCount100;
  }
  if (80 <= CoinData[${RCA}].CoinCount500){
    if (90 <= CoinData[${RCA}].CoinCount500){
      document.querySelector('td[class*="RI${RCB}_500"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].CoinCount500 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_500"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].CoinCount500 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_500"]').innerHTML = CoinData[${RCA}].CoinCount500;
  }
  if (120 <= CoinData[${RCA}].BillCount1000){
    if (140 <= CoinData[${RCA}].BillCount1000){
      document.querySelector('td[class*="RI${RCB}_1000"]').innerHTML = '<div style="color: RED;">' + CoinData[${RCA}].BillCount1000 + '</div>';
    } else {
      document.querySelector('td[class*="RI${RCB}_1000"]').innerHTML = '<div style="color: #fd7e00;">' + CoinData[${RCA}].BillCount1000 + '</div>';
    }
  } else {
    document.querySelector('td[class*="RI${RCB}_1000"]').innerHTML = CoinData[${RCA}].BillCount1000;
  }
  document.querySelector('td[class*="RI${RCB}_2000"]').innerHTML = CoinData[${RCA}].BillCount2000;
  document.querySelector('td[class*="RI${RCB}_5000"]').innerHTML = CoinData[${RCA}].BillCount5000;
  document.querySelector('td[class*="RI${RCB}_10000"]').innerHTML = CoinData[${RCA}].BillCount10000;
  `);
}

function makeGetRequest() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://trialmercury.posaas.net/BackOfficeService.svc/GetManagementData/1/00422/12391",
      data: JSON.stringify(mainteParam),
      onload: function(response) {
        resolve(response.responseText);
      }
    });
  });
}

async function GetMusic(num) {
  var response = await makeGetRequest_(num);
  var MusicJson = JSON.parse(response);
  alert(MusicJson.data.song_data[0].song_name.replace(/^.+?[^\)]\)(.+?)$/g, "$1") + "\n" + MusicJson.data.song_data[0].artist_name + "\n\n" + MusicJson.data.song_data[1].song_name.replace(/^.+?[^\)]\)(.+?)$/g, "$1") + "\n" + MusicJson.data.song_data[1].artist_name);
};

function makeGetRequest_(num) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://bf.usen.com/api/?chcd=" + num,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        resolve(response.responseText);
      }
    });
  });
}

// function makeGetRequest_(num) {
//   return new Promise((resolve, reject) => {
//     GM_xmlhttpRequest({
//       method: "POST",
//       url: "http://m.cansystem.info/noa/?ser=CAN&ap=CAN&ch=" + num,
//       overrideMimeType: "text/plain; charset=Shift_JIS",
//       onload: function(response) {
//         resolve(response.responseText);
//       }
//     });
//   });
// }


function ObserverCreate() {
  COA = 0;
  COB = 2501;
  ObserverCreate_();
  COA = 1;
  COB = 2502;
  ObserverCreate_();
  COA = 2;
  COB = 2503;
  ObserverCreate_();
  COA = 3;
  COB = 2504;
  ObserverCreate_();
  COA = 4;
  COB = 2505;
  ObserverCreate_();
  COA = 5;
  COB = 2506;
  ObserverCreate_();
}
function ObserverCreate_() {
  eval(`
  var Count${COB} = 0;
  var CoinObserver = document.querySelectorAll('div[name="proList"]')[${COA}];
  var URLObserver = new MutationObserver(function(mutations, observer) {
    try {
// 商品を探す機能
      for (var i = 0; i < mutations[1].addedNodes.length; i = i + 3) {
//      console.log(SearchItems.test(mutations[1].addedNodes[i].textContent));
        if(SearchItems.test(mutations[1].addedNodes[i].textContent) === true){
          mutations[1].addedNodes[i].style.backgroundColor = "green" ;
        }
      }
// 商品を探す機能
      if (Count${COB} != mutations[1].addedNodes.length) {
        Count${COB} = mutations[1].addedNodes.length;
        CoinObserver.scrollTo(0, CoinObserver.scrollHeight);
      }
    } catch (e) {
      Count${COB} = 0;
    }
  });
  URLObserver.observe(CoinObserver, {childList: true, subtree: false});
  `);
}

// POS COOKIE
// document.cookie = "StoreCode=00422; Max-Age=2147483647; Domain=trialmercury.posaas.net; Path=/POS4ULS_BO;";
// document.cookie = "Name=トライアルPOS; Max-Age=2147483647; Domain=trialmercury.posaas.net; Path=/POS4ULS_BO;";
// document.cookie = "EmployeeCode=90001026; Max-Age=2147483647; Domain=trialmercury.posaas.net; Path=/POS4ULS_BO;";
// document.cookie = "CompanyCode=1; Max-Age=2147483647; Domain=trialmercury.posaas.net; Path=/POS4ULS_BO;";