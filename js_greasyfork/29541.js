// ==UserScript==
// @name        Virtonomica: Multipage Visiter
// @version        0.195
// @description    Позволяет устанавливать параметры для группы предприятий
// @namespace      virtonomica
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list*
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list?old*
// @include        http*://virtonomic*.*/*/main/unit/view/*/trading_hall*
// @include        http*://virtonomic*.*/*/main/unit/view/*/supply*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29541/Virtonomica%3A%20Multipage%20Visiter.user.js
// @updateURL https://update.greasyfork.org/scripts/29541/Virtonomica%3A%20Multipage%20Visiter.meta.js
// ==/UserScript==


try {
urlsToLoad = readCookie('units_1');
if(urlsToLoad !== null) urlsToLoad = urlsToLoad.split(',');

urlsToLoadClean = readCookie('units_2');
if(urlsToLoadClean !== null) urlsToLoadClean = urlsToLoadClean.split(',');

urlsMode = readCookie('units_mode');

  } catch (ex) {
//    alert('Error: ' + ex);
  }


window.addEventListener('load', FireTimer, false);
if (document.readyState == 'complete') {
  FireTimer();
}//--- Catch new pages loaded by WELL BEHAVED ajax.

window.addEventListener('hashchange', FireTimer, false);
function FireTimer() {
  setTimeout(GotoNextURL, 1000); // 5000 == 5 seconds
}
var realm = readCookie('last_realm');
var serialize = function () {
  var arr = new Array();
  var arr2 = new Array();
  $('.ui-selected > .info > a').each(function () {
    arr.push('https://virtonomica.ru/'+realm+'/main/unit/view/' + /\d+$/.exec($(this).attr('href')) [0] + '/trading_hall#new');
    arr2.push('https://virtonomica.ru/'+realm+'/main/unit/view/' + /\d+$/.exec($(this).attr('href')) [0] + '/trading_hall');
  });
  if (arr.length == 0) {
    return;
  }
//  alert('ok');
  setCookie('units_1', arr.join(','));
  setCookie('units_2', arr2.join(','));
  return arr[0];
};
var serialize_supply = function () {
  var arr = new Array();
  var arr2 = new Array();
  $('.ui-selected > .info > a').each(function () {
    arr.push('https://virtonomica.ru/'+realm+'/main/unit/view/' + /\d+$/.exec($(this).attr('href')) [0] + '/supply#new');
    arr2.push('https://virtonomica.ru/'+realm+'/main/unit/view/' + /\d+$/.exec($(this).attr('href')) [0] + '/supply');
  });
  if (arr.length == 0) {
    return;
  }
//  alert('ok');
  setCookie('units_1', arr.join(','));
  setCookie('units_2', arr2.join(','));
  return arr[0];
};


var begin = function () {
  try {
    var id = serialize();
  setCookie('units_mode', 'normal');
    //                    var url = $(this).val().replace('%id%', id).replace('#new', '') + '#new';
    var url = id.replace('%realm%', realm);
//    alert(url);
//    exit;
    window.location = url;
  } catch (ex) {
    alert('Error: ' + ex);
  }
  return false;
};
var begin4 = function () {
  try {
    var id = serialize();
  setCookie('units_mode', 'polka');
    //                    var url = $(this).val().replace('%id%', id).replace('#new', '') + '#new';
    var url = id.replace('%realm%', realm);
//    alert(url);
//    exit;
    window.location = url;
  } catch (ex) {
    alert('Error: ' + ex);
  }
  return false;
};

var begin2 = function () {
  try {
    var id = serialize();
  setCookie('units_mode', 'magic');
    //                    var url = $(this).val().replace('%id%', id).replace('#new', '') + '#new';
    var url = id.replace('%realm%', realm);
//    alert(url);
//    exit;
    window.location = url;
  } catch (ex) {
    alert('Error: ' + ex);
  }
  return false;
};

var begin_balance = function () {
  try {
    var id = serialize_supply();
  setCookie('units_mode', 'balance');
    var url = id.replace('%realm%', realm);
    window.location = url;
  } catch (ex) {
    alert('Error: ' + ex);
  }
  return false;
};

var begin_supply05 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_05');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply1 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_1');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply5 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_5');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply10 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_10');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply15 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_15');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply25 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_25');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply33 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_33');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply48 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_48');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply50 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_50');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply75 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_75');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply100 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_100');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply120 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_120');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply150 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_150');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supply200 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_200');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supplyx10 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_x10');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supplyx25 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_x25');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};
var begin_supplyx30 = function () {  try {    var id = serialize_supply();  setCookie('units_mode', 'supply_x30');    var url = id.replace('%realm%', realm);    window.location = url;  } catch (ex) {    alert('Err1or: ' + ex);  }  return false;};


var magButton2 = $('<button value="/%realm%/main/unit/view/%id%/trading_hall" class="js-multisale-button" disabled>Цены в магазине</button>').click(begin);
var magButton4 = $('<button value="/%realm%/main/unit/view/%id%/trading_hall" class="js-multisale-button" disabled>Полка</button>').click(begin4);
var magButton3 = $('<button value="/%realm%/main/unit/view/%id%/trading_hall" class="js-multisale-button" disabled>Magic</button>').click(begin2);
var effButton2 = $("<span style=\"font-size:75%;margin:1px; padding:1px; border:1px solid #2222ff; border-radius:3px; cursor:pointer\" onClick='$(\".prod\").click();'>Эффективность</span>");
var balButton1 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>Балансир расходников</button>').click(begin_balance);

var magButton_05 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>0.5%</button>').click(begin_supply05);
var magButton_1 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>1%</button>').click(begin_supply1);
var magButton_5 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>5%</button>').click(begin_supply5);
var magButton_10 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>10%</button>').click(begin_supply10);
var magButton_15 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>15%</button>').click(begin_supply15);
var magButton_25 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>25%</button>').click(begin_supply25);
var magButton_33 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>33%</button>').click(begin_supply33);
var magButton_48 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>48%</button>').click(begin_supply48);
var magButton_50 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>50%</button>').click(begin_supply50);
var magButton_75 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>75%</button>').click(begin_supply75);
var magButton_100 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>100%</button>').click(begin_supply100);
var magButton_120 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>120%</button>').click(begin_supply120);
var magButton_150 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>150%</button>').click(begin_supply150);
var magButton_200 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>200%</button>').click(begin_supply200);
var magButton_x10 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>X1</button>').click(begin_supplyx10);
var magButton_x25 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>X2.5</button>').click(begin_supplyx25);
var magButton_x30 = $('<button value="/%realm%/main/unit/view/%id%/supply" class="js-multisale-button" disabled>X3.0</button>').click(begin_supplyx30);

var panel4 = $('<fieldset><legend>Всякое</legend></fieldset>');
panel4.append(effButton2);
panel4.append(magButton2);
panel4.append(magButton4);
panel4.append(magButton3);
panel4.append(balButton1);

var panel5 = $('<fieldset><legend>Закупки в магазины</legend></fieldset>');

panel5.append(magButton_05);
panel5.append(magButton_1);
panel5.append(magButton_5);
panel5.append(magButton_10);
panel5.append(magButton_15);
panel5.append(magButton_25);
panel5.append(magButton_33);
panel5.append(magButton_48);
panel5.append(magButton_50);
panel5.append(magButton_75);
panel5.append(magButton_100);
panel5.append(magButton_120);
panel5.append(magButton_150);
panel5.append(magButton_200);
panel5.append(magButton_x10);
panel5.append(magButton_x25);
panel5.append(magButton_x30);


$('.unit-list-2014').wrap($('<form id="js-multisale-form" />')).after(panel4).after(panel5);

function GotoNextURL() {

  var numUrls = urlsToLoad.length;
  var urlIdx = urlsToLoad.indexOf(location.href);
  var urlIdx2 = urlsToLoadClean.indexOf(location.href);
//      alert(urlIdx);
  if (urlIdx == - 1 && urlIdx2 == - 1) return;
//    alert();
  if (urlIdx2 == - 1 && urlIdx > - 1)
  {
    if(urlsMode == "balance")
      {
    $('.iterators').click();
    $('input[name="applyChanges"]').click();
    return false;
      }

        if(urlsMode == "supply_05")      {    $('.05ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_1")      {    $('.1ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_5")      {    $('.5ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_10")      {    $('.10ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_15")      {    $('.15ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_25")      {    $('.25ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_33")      {    $('.33ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_48")      {    $('.48ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_50")      {    $('.50ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_75")      {    $('.75ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_100")      {    $('.100ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_120")      {    $('.120ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_150")      {    $('.150ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_200")      {    $('.200ex').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_x10")      {    $('.x10').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_x25")      {    $('.x25').click();    $('input[name="applyChanges"]').click();    return false;      }
        if(urlsMode == "supply_x30")      {    $('.x30').click();    $('input[name="applyChanges"]').click();    return false;      }

    
    if(urlsMode == "normal")
      {
    $('.qps_button').click();
    $('input[name="setprice"]').click();
    return false;
      }
    if(urlsMode == "magic")
      {
    $('.qps_button_global_electionsMagic').click();
    $('input[name="setprice"]').click();
    return false;
      }
    if(urlsMode == "polka")
      {
    $('.qps_button_global_electionsPolka').click();
    $('input[name="setprice"]').click();
    return false;
      }

  }else{console.log('unknown shit');}  //    setActionAndSubmit("setprice");

  urlIdx2++;
  if (urlIdx2 >= numUrls)
  {
    urlsToLoad[urlIdx2] = 'https://virtonomica.ru/';
    setCookie('units_1', 0, - 1);
    setCookie('units_2', 0, - 1);
  }
  location.href = urlsToLoad[urlIdx2];
}

