// ==UserScript==
// @name        Fincance Plus

// @description 比赛页面详细的财政信息 More fincance information for Trophymanager. 
// @include     *trophymanager.com/matches/*
// @author    	Dgzt ，fix by 太原龙城足球俱乐部
// @version     1.0.2023090501
// @grant       none
// @namespace http://trophymanager.com
// @downloadURL https://update.greasyfork.org/scripts/29537/Fincance%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/29537/Fincance%20Plus.meta.js
// ==/UserScript==

var urlHome='https://trophymanager.com';
var tfp_ticket_price=200;

/**
 * The mutation handler for check when post the report section.
 * 
 * @param mutationRecords - The mutation records.
 */
function tfp_mutationHandler(mutationRecords){
  mutationRecords.forEach(function(mutation){

    if(mutation.type==='childList' && mutation.addedNodes.length > 0){
      mutation.addedNodes.forEach(function(node){
        if($(node).hasClass('post_report')){
          var attendanceSpan = $(node).find('.attendance');
          var attendance = parseInt(match_info.attendance);
          var ul = $(attendanceSpan).parent().parent();
          
          tfp_appendFinance(attendance, ul);
        }
      });
    }
  });
}

/**
 * Appends the finance information.
 *
 * @param attendance - The numebr of spectators.
 * @param ul - The updating element.
 */
function tfp_appendFinance(attendance, ul){
  var homeClubId = $(document).find('.home_name').children('a').attr('club_link');
  $.get(urlHome+'/stadium/'+homeClubId, null, function(data) {
    if(data != null){ 
      var faciliteis = JSON.parse(tfp_getFacilityJson(data));
      
      var stadiumIncome = tfp_getStadiumIncome(attendance);
      var fastfoodIncome = tfp_getFastfoodIncome(faciliteis, attendance);
      var merchandiseStandIncome = tfp_getMerchandiseStandIncome(faciliteis, attendance);
      var restaurantIncome = tfp_getRestaurantIncome(faciliteis, attendance);
      var sausageStandIncome = tfp_getSausageStandIncome(faciliteis, attendance);
      
      var allIncome = stadiumIncome + fastfoodIncome + merchandiseStandIncome + restaurantIncome + sausageStandIncome;
      
      ul.append('<li>' +
                '<span class="bold">收入:</span><br/>' +
                '<table>' +
                '  <tbody>' +
                '    <tr>' +
                '      <td>门票: </td>' + 
                '      <td>' + number_format(stadiumIncome) + '</td>' +
                '    </tr>' + 
                '    <tr>' +
                '      <td>快餐店: </td>' + 
                '      <td>' + number_format(fastfoodIncome) + '</td>' +
                '    </tr>' + 
                '    <tr>' +
                '      <td>纪念品摊: </td>' + 
                '      <td>' + number_format(merchandiseStandIncome) + '</td>' +
                '    </tr>' +  
                '    <tr>' +
                '      <td>餐厅: </td>' + 
                '      <td>' + number_format(restaurantIncome) + '</td>' +
                '    </tr>' + 
                '    <tr>' +
                '      <td>热狗摊: </td>' + 
                '      <td>' + number_format(sausageStandIncome) + '</td>' +
                '    </tr>' + 
                '    <tr>' +
                '      <td></td><td class="bold">' + number_format(allIncome) + '</td>' +
                '    </tr>' +
                '  </tbody>' + 
                '</table>' +
                '</li>');
    }
  });
}

/**
 * Returns the facility json string.
 *
 * @param htmlString - The html in string.
 */
function tfp_getFacilityJson(htmlString){
  var dataIndex = htmlString.indexOf('facility_data');
  var openBracketIndex = htmlString.indexOf('{', dataIndex);

  var openBracket = 0;
  var checkIndex = openBracketIndex;
  do{
    switch(htmlString[checkIndex]){
      case '{' : ++openBracket; break;
      case '}' : --openBracket; break;
    }
    
    ++checkIndex;
  }while(openBracket != 0);
  
  return htmlString.substring(openBracketIndex, checkIndex);
}

/**
 * Returns the stadium income.
 *
 * @param attendance - The numebr of spectators.
 */
function tfp_getStadiumIncome(attendance){
  return attendance * tfp_ticket_price;
}

/**
 * Returns the fastfood income.
 *
 * @param faciliteis - The facilities.
 * @param attendance - The numebr of spectators.
 */
function tfp_getFastfoodIncome(faciliteis, attendance){
  var levelSpan = faciliteis.fastfood.level_effect[faciliteis.fastfood.level];
  return tfp_getCoinPerSpectator(levelSpan) * attendance;
}

/**
 * Returns the merchandise stand income.
 *
 * @param faciliteis - The facilities.
 * @param attendance - The numebr of spectators.
 */
function tfp_getMerchandiseStandIncome(faciliteis, attendance){
  var levelSpan = faciliteis.merc_stand.level_effect[faciliteis.merc_stand.level];
  return tfp_getCoinPerSpectator(levelSpan) * attendance;
}

/**
 * Returns the restaurant income.
 *
 * @param faciliteis - The facilities.
 * @param attendance - The numebr of spectators.
 */
function tfp_getRestaurantIncome(faciliteis, attendance){
  var levelSpan = faciliteis.restaurant.level_effect[faciliteis.restaurant.level];
  return tfp_getCoinPerSpectator(levelSpan) * attendance;
}

/**
 * Returns the sausage stand income.
 *
 * @param faciliteis - The facilities.
 * @param attendance - The numebr of spectators.
 */
function tfp_getSausageStandIncome(faciliteis, attendance){
  var levelSpan = faciliteis.sausage.level_effect[faciliteis.sausage.level];
  return tfp_getCoinPerSpectator(levelSpan) * attendance;
}

/**
 * Returns the number of coins from span element.
 *
 * @param spanString - The span element in string.
 */
function tfp_getCoinPerSpectator(spanString){
  var endBrace = spanString.indexOf('>');
  var startBrace = spanString.indexOf('<', endBrace);
  
  return parseInt(spanString.substring(endBrace+1, startBrace));
}

$(document).ready(function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var myObserver = new MutationObserver (tfp_mutationHandler);
  var obsConfig = { childList: true, characterData: true, attributes: true, subtree: true };
  
  var targetNodes = $(".box_body");
  targetNodes.each(function(){
    myObserver.observe(this, obsConfig);
  });
});
