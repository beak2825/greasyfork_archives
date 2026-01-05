// ==UserScript==
// @name BRASS online improved
// @namespace tequila_j-script
// @version    0.2.3
// @description  Various tweaks to improve Order of the Hammer's brass (orderofthehammer.com)
// @match      http://brass.orderofthehammer.com/board.php
// @match      https://brass.orderofthehammer.com/board.php*
// @match      http://*.orderofthehammer.com/board.php*
// @match      https://*.orderofthehammer.com/board.php*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource   jquery-ui-theme http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/humanity/jquery-ui.min.css
// @resource   condensed-font https://fonts.googleapis.com/css?family=Roboto+Condensed
// @grant    GM_addStyle
// @grant    GM_getResourceText 
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/29128/BRASS%20online%20improved.user.js
// @updateURL https://update.greasyfork.org/scripts/29128/BRASS%20online%20improved.meta.js
// ==/UserScript==


var condensedFontCSSsrc = GM_getResourceText ("condensed-font");

GM_addStyle (condensedFontCSSsrc);

function urlParam(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

function updateCSS() {
  
GM_addStyle(`  
.dropdown {
    position: relative;
    display: inline-block;
    font: 12px 'Roboto Condensed', sans-serif;
}

.dropdown-content {
    display: none;
    position: absolute;
    padding: 4px;
    top: 0px;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 250;
    box-shadow: -5px -5px 3px #000000;
}

.dropdown-content li {
    color: black;
    padding: 4px 6px;
    text-decoration: none;
    display: block;
}

.dropdown-content li.title {
  color: black;
    padding: 4px 6px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid black;
    background-color: #d1d1d1;
}

.dropdown-content li.title:hover {background-color: #d1d1d1}

.dropdown-content li:hover {background-color: #b1b1b1}

.dropdown:hoverA .dropdown-content {
    display: block;
}
    
.sub-menu {
    margin-left: 10px;
    margin-top: 22px;
}
    
.sub-menu-1 {
    
}
    
    
`);

//fix title menu z-index	
GM_addStyle(`
div.play-area {
  position:relative;
}

.card-pointer {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  //background: url(https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/location.png?alt=media&token=78344917-5f7c-4d1f-9f22-8a70f992a006);
  background: url(http://i.imgur.com/wDnJWfH.png);
  background-size: 20px;
  background-repeat: no-repeat;
  z-index: 200;
}

.card-pointer-1 {
}

.card-pointer-2 {
margin-left: 17px;
}

.card-pointer-3 {
margin-left: 34px;
}

.card-pointer-4 {
margin-left: 51px;
}
  
div.board-side {
position: absolute;
    left: 960px;
    top: 0px;
    width: 400px;
}

div.main-board {
  position:relative;
  background-color:peru !important;
}

div.industry-cards {
  position:relative;
  background-color: rgba(159,89,41,0.8);
  padding: 10px 5px;
  z-index: 200;
  display:inline-block;
  border: 1px solid lightgray;
}

div.industry-cards-full {
  top: 0px;
  left: 0px;
}

div.industry-cards-compact {
  top:0px;
  left:150px;
}

div.industry-card {
  display: inline-block;
}

div.industry-card img {
  margin:5px;
  max-width: 25px;
  max-height: 30px;
}
    
div.extra-player-board-container-normal {
  height: 225px;
  width: 362px;
}

div.extra-player-board-container-normal div.scale-wrapper {
  transform: scale(0.75);
  transform-origin: 0 0;
}

div.extra-player-board tr.player-info-money {
  font-size: 24px ;
}

div.extra-player-board table tr {
  font-size: 14px;
}

div.extra-player-board-container-mini {
  display: inline-block;
}

div.extra-player-board-container-mini-3 {
  height: 100px;
  width: 180px;
}

div.extra-player-board-container-mini-4 {
  height: 75px;
  width: 121px;
}

div.extra-player-board-container-miniatures {
  width: 370px;  
}

div.extra-player-board-container-miniatures div.extra-player-board-container-mini table tr {
  display: none;
}

div.extra-player-board-container-miniatures div.extra-player-board-container-mini table tr.player-info-money {
  display: block;
}

div.extra-player-board-container-mini div.scale-wrapper {
  transform-origin: 0 0;
  cursor: pointer;
}

div.extra-player-board-container-mini-2 div.scale-wrapper {
  transform: scale(0.5);
}

div.extra-player-board-container-mini-3 div.scale-wrapper {
  transform: scale(0.375);
}

div.extra-player-board-container-mini-3 table tr.player-info-money {
  font-size: 36px;
}

div.extra-player-board-container-mini-4 div.scale-wrapper {
  transform: scale(0.25);
}

div.extra-player-board-container-mini-4 table tr.player-info-money {
  font-size: 42px;
}

div.extra-player-board-container-mini div.extra-player-board {
}



`);    

GM_addStyle(`

div#game-history {
  margin-top: 15px;
}

table.log-table {
  font-size: x-small;
  border-collapse:collapse;
  font-family: arial, serif;
}


table.log-table tr:hover {
  background-color: lightgrey;
}

table.log-table .colclass0 {
}

table.log-table .colclass1 {
}

table.log-table .colclass2 {
}

table.log-table .log-color-blue .time-column {
}

table.log-table td {
  border-bottom: 1px solid grey;
  padding: 2px 0px 2px 2px;  
}

table.log-table td.time-column {
  width: 5px;
}

table.log-table .log-color-purple td {
  border-color: purple;
}

table.log-table .log-color-purple .time-column {
  background-color: purple;
}

table.log-table .log-color-red td {
  border-color: red;
}

table.log-table .log-color-red .time-column {
  background-color: red;  
}

table.log-table .log-color-yellow td {
  border-color: yellow;
}

table.log-table .log-color-yellow .time-column {
  background-color: yellow;  
}

table.log-table .log-color-green td {
  border-color: green;
}

table.log-table .log-color-green .time-column {
  background-color: green;  
}

table.log-table .log-color-gray td {
  border-color: gray;
}

table.log-table .log-color-gray .time-column {
  background-color: gray;  
}

table.log-table .log-color-start td {
  border-color: black;
}

table.log-table .log-color-start .time-column {
  background-color: black;  
}


`)
  
  
}

function setSelectByText(select, text) {
  select.find('option').filter(function() {
            return this.text == text;
        }).prop('selected', true);
  return select;
}

function createSelect(parent) {
    var chooseAction = createMenuFromSelect($(parent),$('#MoveType'));
    if (chooseAction === undefined) return;
    var options = chooseAction.options;
    for (i = 0; i < options.length; i++) {
        $(options[i]).on("click", function() {
            var option = $(this);
            var chooseActionValue = $(this).data("value");
            switch (chooseActionValue) {
                case "0": //Build Industry
                    console.log("Industry for " + $("#dCardX").find("select:first").val());
                    var helper = "#dBuildOpts" + $("#dCardX").find("select:first").val();
                    var select = $(helper).find("select:first");
                    var buildIndustryOptions = createMenuFromSelect($(this),select,1);

                    // Location card
                    console.log(">> " + select.attr("name"));
                    if (select.attr("name").startsWith("Tile")) {
                        var indOptions = buildIndustryOptions.options;
                        for (j = 0 ; j < indOptions.length; j++) {
                            var indOption = $(indOptions[j]);
                            var select2 = $(helper).find("select[name^=IndustrySpace]");
                            indOption.on("click", function() {
                                var nextMenu = createMenuFromSelect($(this),select2,2);
                                nextMenu.options.each(function () {
                                      var coalIsVisible = $("#dCoal select[name^='CoalSource']").is(":visible");
                                      console.log("Coal" + coalIsVisible);
                                      var ironIsVisible = $("#dIron select[name^='IronSource']").is(":visible");
                                      console.log("Iron" + ironIsVisible);
                                      if (coalIsVisible) {
                                        $(this).on('click', function() {
                                            var nextMenu = createMenuFromSelect($(this),$("#dCoal select[name^='CoalSource']"),3, "Coal");
                                            if (ironIsVisible) {
                                              nextMenu.options.each(function() {
                                                $(this).on("click", function () {
                                                  var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                                })
                                              })
                                            }
                                        })
                                      } else {
                                        if (ironIsVisible) {
                                          nextMenu.options.each(function() {
                                                var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                              })
                                        }
                                      }
                                    })

                        })
                    }
                  } 
                  //industry card 
                  else { 
                        if (select.attr("name").startsWith("Industry")) {
                          buildIndustryOptions.options.each( function() {
                              $(this).on("click", function() {
                                        var coalIsVisible = $("#dCoal select[name^='CoalSource']").is(":visible");
                                        console.log("Coal" + coalIsVisible);
                                        var ironIsVisible = $("#dIron select[name^='IronSource']").is(":visible");
                                        console.log("Iron" + ironIsVisible);
                                        if (coalIsVisible) {
                                            console.log("Coal criado");
                                              var nextMenu = createMenuFromSelect($(this),$("#dCoal select[name^='CoalSource']"),3, "Coal");
                                              if (ironIsVisible) {
                                                nextMenu.options.each(function() {
                                                  $(this).on("click", function () {
                                                    var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                                  })
                                                })
                                              }
                                        } else {
                                          if (ironIsVisible) {
                                            nextMenu.options.each(function() {
                                                  var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                                })
                                          }
                                        }
                                      })

                          
                      })
                  } 
                }
                  
                    
                    break;
                case "1": //Double Action
                //select second card
                    var varNextSelectName = "SecondCard";
                    var selectChooseSecondCard = createMenuFromSelect($(this),$("#dCardY").find("select[name=" + varNextSelectName +"]"),1);
                    for (j = 0 ; j < selectChooseSecondCard.options.length; j++) {
                            var srcOption = $(selectChooseSecondCard.options[j]);
                            srcOption.on("click", function() {
                                var nextMenu = createMenuFromSelect($(this),$("#dDoubleBuildOpts select[name^='TileTypeY']"),2);
                                nextMenu.options.each(function () {
                                  $(this).on("click", function() {
                                    var nextMenu = createMenuFromSelect($(this),$("#dDoubleBuildOpts select[name^='IndustrySpaceY']"),3);
                                    nextMenu.options.each(function () {
                                      var coalIsVisible = $("#dCoal select[name^='CoalSource']").is(":visible");
                                      console.log("Coal" + coalIsVisible);
                                      var ironIsVisible = $("#dIron select[name^='IronSource']").is(":visible");
                                      console.log("Iron" + ironIsVisible);
                                      if (coalIsVisible) {
                                        $(this).on('click', function() {
                                            var nextMenu = createMenuFromSelect($(this),$("#dCoal select[name^='CoalSource']"),3, "Coal");
                                            if (ironIsVisible) {
                                              nextMenu.options.each(function() {
                                                $(this).on("click", function () {
                                                  var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                                })
                                              })
                                            }
                                        })
                                      } else {
                                        if (ironIsVisible) {
                                          nextMenu.options.each(function() {
                                                var nextMenu = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),3, "Iron");
                                              })
                                        }
                                      }
                                    })
                                  })
                                  
                                })
                            })
                    }
                break;

                case "2": // Build Link
                    var varSelectName = "LinkToBuild";
                    var buildLinkOptions = createMenuFromSelect($(this),$("select[name=" + varSelectName +"]"),1);
                    buildLinkOptions.options.each(function () {
                            var srcOption = $(this);
                            var coalIsVisible = $("#dCoal select[name^='CoalSource']").is(":visible");
                            if (coalIsVisible) {
                              $(this).on('click', function() {
                                var nextMenu = createMenuFromSelect($(this),$("#dCoal select[name^='CoalSource']"),3, "Coal");
                              })
                            }
                    })

                    break;
                case "3": //Develop
                    var buildLinkOptions = createMenuFromSelect($(this),$("#dTileType select[name^='TileType']"),1);
                    var srcOptions = buildLinkOptions.options;
                    for (j = 0 ; j < srcOptions.length; j++) {
                            var srcOption = $(srcOptions[j]);
                            srcOption.on("click", function() {
                                var chooseOption = createMenuFromSelect($(this),$("#dIron select[name^='IronSource']"),2, "Iron");
                            })
                    }
                    break;
                case "4": // Loan
                    var buildLinkOptions = createMenuFromSelect($(this),$("#dLoan select[name^='LoanAmount']"),1);
                    break;
                case "5": //Sell
                    var srcMenuOptions = createMenuFromSelect($(this),$("#dIndustrySpaceX select[name^='IndustrySpace']"),1);
                    var srcOptions = srcMenuOptions.options;
                    for (j = 0 ; j < srcOptions.length; j++) {
                            var srcOption = $(srcOptions[j]);
                            srcOption.on("click", function() {
                                var portOption = createMenuFromSelect($(this),$("#dIndustrySpaceX select[name^='PortSpace']"),2);
                            })
                    }
                    break;
                    
        }
    })
    }
}


function getCards() {

  var cardArea = $("body > p:eq(3)").text();
  var cardsTextArray = cardArea.split(":");
  if (cardsTextArray.length < 2) {
      return [];
  }
  var cards = cardsTextArray[1].trim().replace(/\.$/,"").split(/\s*,\s*/);

    //var cardOptions = $("#dCardX > select:first").find("option");
    //var cards = [];
    //if (cardOptions !== undefined) {
    //    for (i = 0; i < cardOptions.length; i++) {
    //        var cardOption = $(cardOptions[i]);
    //        if (cardOption.val().startsWith("NoCardSelect")) continue;
    //        cards.push(cardOption.html());
    //    };        
   // }
    return cards;
    
}


function createMenuFromSelect(srcClick, select, level, title) {
  if ($(srcClick).hasClass("dropdown"))
    return {element:srcClick, parent: $(srcClick), options: $(srcClick).children("li")};
  
  $(srcClick).addClass("dropdown");
  
  
  var parent = $('<ul/>').addClass('dropdown-content');
  if (level !== undefined) parent.addClass("sub-menu").addClass("sub-menu-" + level);

  if (title !== undefined) {
    var titleEntry = $("<li/>").addClass("title").append(title);
    parent.append(titleEntry);
  }
  
  $(select).children('option').each(function() {
    var option = $(this);
    var menuOption = $('<li/>');
    var optionTitle = $('<div/>');
    menuOption.append(optionTitle);
    optionTitle.html(option.html());
    menuOption.data("value",option.val());
    menuOption.on('click', function(event) {
      event.stopPropagation();
      //link to build 
      $(select).val(option.val())
      
      $(select).change();
      //AlterForm();
    });
    parent.append(menuOption);
  });

  srcClick.append(parent);

  srcClick.on('click', function(){
    parent.slideToggle("fast");
  });

  parent.mouseleave(function(){
    $(parent).toggle("fast");
    $(parent).find("ul").hide();
  });
  
  srcClick.click();
  
  return {element:srcClick, parent: $(parent), options: $(parent).children("li")};
  
}

function getNumberOfPlayers() {
  return $(document).data('number-of-players-started');
}

function getNumberOfCurrentPlayers() {
  return $(document).data('number-of-players-current');
}
  
function getBoardType() {
  return $(document).data('board-type');
}

function getCityClassName(cityName) {
    var sname = cityName.split(" ")[0].toLowerCase();
    return "city-" + sname;
}

function getLoggedUser() {
    var u = $(document).data("logged-user");
    return u;
}


function getCoordinates(players, boardType) {
  
  var coord = new Map();
  
  if (players == 2) {
    if (boardType == "full") {
      coord.set("Barrow – In – Furness",{y:145, x:15, pos: 'bottom'});
      coord.set("Birkenhead",{y:663, x:7, pos: 'top'});
      coord.set("Blackburn",{y:302, x:420, pos: 'top'});
      coord.set("Bolton",{y:450, x:404, pos: 'top'});
      coord.set("Burnley",{y:288, x:636, pos: 'bottom'});
      coord.set("Bury",{y:445, x:554, pos: 'top'});
      coord.set("Colne",{y:187, x:683, pos: 'top'});
      coord.set("Ellesmere Port",{y:803, x:141, pos: 'top'});
      coord.set("Fleetwood",{y:215, x:38, pos: 'top'});
      coord.set("Lancaster",{y:155, x:340, pos: 'top'});
      coord.set("Liverpool",{y:492, x:32, pos: 'top'});
      coord.set("Macclesfield",{y:827,x:507, pos: 'top'});
      coord.set("Manchester",{y:676, x:653, pos: 'bottom'});
      coord.set("Oldham",{y:551, x:671, pos: 'bottom'});
      coord.set("Preston",{y:287, x:317, pos: 'top'});
      coord.set("Rochdale",{y:521, x:775, pos: 'bottom'});
      coord.set("Stockport",{y:754, x:157, pos: 'top'});
      coord.set("Warrington & Runcorn",{y:698, x:380, pos: 'bottom'});
      coord.set("Wigan",{y:550, x:341, pos: 'bottom'});
      return coord;
    }
    if (boardType == "compact") {
      coord.set("Barrow – In – Furness",{y:87, x:432, pos: 'bottom'}); 
      coord.set("Birkenhead",{y:663, x:7, pos: 'top'});//
      coord.set("Blackburn",{y:257, x:578, pos: 'top'});
      coord.set("Bolton",{y:401, x:384, pos: 'top'});
      coord.set("Burnley",{y:10, x:600, pos: 'bottom'});
      coord.set("Bury",{y:335, x:726, pos: 'top'});
      coord.set("Colne",{y:163, x:721, pos: 'top'});
      coord.set("Ellesmere Port",{y:803, x:141, pos: 'top'});
      coord.set("Fleetwood",{y:16, x:51, pos: 'top'});
      coord.set("Lancaster",{y:179, x:242, pos: 'top'});
      coord.set("Liverpool",{y:496, x:93, pos: 'top'});
      coord.set("Macclesfield",{y:827,x:507, pos: 'top'});//
      coord.set("Manchester",{y:593, x:440, pos: 'bottom'});
      coord.set("Oldham",{y:551, x:671, pos: 'bottom'});//
      coord.set("Preston",{y:255, x:47, pos: 'top'});
      coord.set("Rochdale",{y:521, x:775, pos: 'bottom'});//
      coord.set("Stockport",{y:754, x:157, pos: 'top'});//
      coord.set("Warrington & Runcorn",{y:476, x:338, pos: 'bottom'});
      coord.set("Wigan",{y:336, x:294, pos: 'bottom'});//
      return coord;
    }
  }
  
  if (players == 4 || players == 3 ) {
    if (boardType == "full") {
      coord.set("Barrow – In – Furness",{y:145, x:15, pos: 'bottom'});
      coord.set("Birkenhead",{y:663, x:7, pos: 'top'});
      coord.set("Blackburn",{y:302, x:420, pos: 'top'});
      coord.set("Bolton",{y:450, x:404, pos: 'top'});
      coord.set("Burnley",{y:288, x:636, pos: 'bottom'});
      coord.set("Bury",{y:445, x:554, pos: 'top'});
      coord.set("Colne",{y:187, x:683, pos: 'top'});
      coord.set("Ellesmere Port",{y:803, x:141, pos: 'top'});
      coord.set("Fleetwood",{y:215, x:38, pos: 'top'});
      coord.set("Lancaster",{y:155, x:340, pos: 'top'});
      coord.set("Liverpool",{y:492, x:32, pos: 'top'});
      coord.set("Macclesfield",{y:827,x:507, pos: 'top'});
      coord.set("Manchester",{y:676, x:653, pos: 'bottom'});
      coord.set("Oldham",{y:548, x:760, pos: 'bottom'});
      coord.set("Preston",{y:287, x:317, pos: 'top'});
      coord.set("Rochdale",{y:521, x:775, pos: 'bottom'});
      coord.set("Stockport",{y:754, x:515, pos: 'top'});
      coord.set("Warrington & Runcorn",{y:698, x:380, pos: 'bottom'});
      coord.set("Wigan",{y:550, x:341, pos: 'bottom'});
      return coord;
    }
    if (boardType == "compact") {
      coord.set("Barrow – In – Furness",{y:86, x:430, pos: 'bottom'});
      coord.set("Birkenhead",{y:740, x:3, pos: 'bottom'});
      coord.set("Blackburn",{y:260, x:576, pos: 'bottom'});
      coord.set("Bolton",{y:400, x:384, pos: 'bottom'});
      coord.set("Burnley",{y:7, x:602, pos: 'top'});
      coord.set("Bury",{y:335, x:722, pos: 'top'});
      coord.set("Colne",{y:162, x:722, pos: 'bottom'});
      coord.set("Ellesmere Port",{y:738, x:157, pos: 'top'});
      coord.set("Fleetwood",{y:16, x:50, pos: 'bottom'});
      coord.set("Lancaster",{y:176, x:244, pos: 'top'});
      coord.set("Liverpool",{y:493, x:98, pos: 'top'});
      coord.set("Macclesfield",{y:737,x:770, pos: 'bottom'});
      coord.set("Manchester",{y:595, x:438, pos: 'bottom'});
      coord.set("Oldham",{y:497, x:835, pos: 'bottom'});
      coord.set("Preston",{y:257, x:46, pos: 'bottom'});
      coord.set("Rochdale",{y:205, x:774, pos: 'top'});
      coord.set("Stockport",{y:539, x:825, pos: 'top'});
      coord.set("Warrington & Runcorn",{y:476, x:338, pos: 'top'});
      coord.set("Wigan",{y:321, x:341, pos: 'right'});
      return coord;
    }
  }
  
  return false;
  
}

function prepare() {
    
    var actionForm = $("form[action='gameaction.php']");
    actionForm.addClass("user-action");
    var mainActionForm = actionForm.find('div:first')
    if (mainActionForm.find("input").length > 0) {
      mainActionForm.addClass('game-action-box');
    }
  
    //var board = $("body div:eq(2)");
    var board = $("form[action='gameaction.php']").prev("div");
    board.addClass("main-board");
    
    var playArea = $("<div/>").addClass("play-area");
    board.prev().after(playArea);
    
    var boardSwitch = board.find("div > a").first();
    boardSwitch.addClass("board-switch");
    
    //Store user name
    var loginBox = $("#loginbox");
    if (loginBox.find("form").length == 0) {//user is logged in 
        var userNameLine = loginBox.find("p:first").text().split(" ");
        username = userNameLine[userNameLine.length - 1].slice(0,-1);
        $(document).data("logged-user",username);
        console.log("Logged in as " + username);
    } else {
        console.log("User is not logged in");
    }

    //Store number of players
    var gameInfoBlock = $("form[action='gameaction.php'] > p");
    var gameInfoText = gameInfoBlock.text().split("\.")[0];
    var numberInText = gameInfoText.match(/\d+/g);
  
    $(document).data('number-of-players-started',numberInText[0]);
    $(document).data('number-of-players-current',numberInText[1]);

    //Store type of board
    var boardImageType = $(".main-board > img:first");
    if (boardImageType.attr("src").indexOf("0.png") >= 0) {
      $(document).data('board-type',"full");
    } else {
      $(document).data('board-type',"compact");
    }

    //assign class to player boards    
    var playerBoardsTitle = board.find("div > div > b:contains('Game status')");
    playerBoardsTitle.each(function() {
        var pbt = $(this);
        var mainDiv = pbt.parent().parent();
        mainDiv.addClass("player-board");
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec($(pbt).children("a").text());
        mainDiv.data("player-nick",matches[1]);
        mainDiv.find('table tr').find('td:first').addClass('info-name');
        mainDiv.find('table tr').find('td:nth-child(2)').addClass('info-value');
        mainDiv.find('table tr:first').addClass('player-info-money');
        var tiles = mainDiv.find('div').filter(function() {
            var $this = $(this);
            return $this.css("width") == "48px" 
            && $this.css("height") == "48px";
        })
        tiles.addClass('tiles');

    });

    var gameInfo = actionForm.children("p:first");
    gameInfo.addClass("game-info");
    gameInfo.nextAll("p").addClass("game-info");

}


function rebuildInterface() {

  if (username !== undefined) {
    console.log("I can get the username");
    return;//do nothing
  }
  
  var actionForm = $("form.user-action");

  var boardSide = $("<div/>").addClass("board-side");
  boardSide.append(actionForm);
  
  var board = $(".main-board");
  
  var playArea = $("div.play-area");
  
  // box stuff
  playArea.append(board);
  playArea.append(boardSide);

  //box its own block
  var gameInfoBox = $("<div/>").addClass("form-info");
  var gameInfoP = $("p.game-info:first");
  //gameInfoP.after(gameInfoBox);
  gameInfoBox.append($("p.game-info"));
  
  //Add player board information below the form
  var username = getLoggedUser();  
  var playerboard = $("<div/>").addClass("extra-player-board-container-normal");
  var otherPlayerBoards = $("<div/>").addClass("extra-player-board-container-miniatures");

  //add game log
  var gameHistory = $("<div/>").addClass("game-history").attr("id","game-history");

  //set mini sizes, according number of players
  var currentPlayers = getNumberOfCurrentPlayers();

  //alocate the mini player boards
  if (username !== undefined) {
    var playerInfo = $("div.player-board");
    for (i = 0; i < playerInfo.length; i++) {
      var cloned = $(playerInfo[i]).clone();
      cloned.css({ position: '', left: '', top: ''});
      cloned.addClass("extra-player-board");
      cloned.find("a").each(function(event) {
          var el = $(this);
          el.attr("disabled", true);
          var originalOnClick = el.prop('onclick');
          el.on('click', function (evt) {
            if (! $(this).attr("disabled")) {
              originalOnClick.call(this,event)
              evt.preventDefault();
            } else {
              evt.preventDefault();
            }
          })
          el.prop("onclick",null);
        });

      var wrapbox = $("<div/>").addClass("scale-wrapper").append(cloned); //this wrapper is here because I was having problems
      //with height and scale, which left an empty space in screen
      if ($(playerInfo[i]).data("player-nick") == username) {
        playerboard.append(wrapbox);
        playerboard.find("a").attr("disabled", false);
      } else {
        var wrapper1 = $("<div/>").addClass("extra-player-board-container-mini")
        .addClass("extra-player-board-container-mini-"+ currentPlayers).append(wrapbox);
        wrapper1.on('click', function() {
          var bbc = $("div.extra-player-board-container-normal > div.scale-wrapper")
          var bboard = $(bbc).children("div.extra-player-board");
          var mbc = $(this).children("div.scale-wrapper");
          var mboard = $(mbc).children("div.extra-player-board");
          mbc.append(bboard);
          $(bboard).find("a").attr('disabled', true);
          bbc.append(mboard);
          $(mboard).find("a").attr('disabled', false);
        })
        otherPlayerBoards.append(wrapper1);
        
      }
    }
  }

  actionForm.append($(".game-action-board"));
  actionForm.append(playerboard);
  actionForm.append(otherPlayerBoards);
  
  actionForm.append(gameHistory);
  $("body").append($("<div id='gameHistoryHelper' style='display:none'/>"));

  actionForm.append(gameInfoBox);

  
  
  
  var boardType = getBoardType();
  var numberOfPlayers = getNumberOfPlayers();
  
  var coord = getCoordinates(numberOfPlayers,boardType);
  
  var cards = getCards();
  
  console.log("Using " + boardType + " board for " + numberOfPlayers + " players");
  if (coord == false) {
      console.log("I do not have coordinates for " + boardType + " board with " + numberOfPlayers + " players");
      return;
  }

  var industryCardContainer = $("<div/>").addClass("industry-cards-" + boardType).addClass("industry-cards");
  board.append(industryCardContainer);
  
  var indu = new Map();
  //indu.set('Coal Mine',{url:"https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/coal.png?alt=media&token=37a392d7-c2a6-44f3-bf7d-fc36da40d59c"});
  //indu.set('Cotton Mill',{url:"https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/cotton.png?alt=media&token=58270f82-d144-41af-a29e-e6abbf499e28"});
  //indu.set('Iron Works',{url:"https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/iron.png?alt=media&token=6dc1e5ce-a016-41d1-9be5-f0a967c80dfa"});
  //indu.set('Port',{url:"https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/port.png?alt=media&token=3b6b6fb0-261f-4dee-a0bd-14b0b15a05d2"});
  //indu.set('Shipyard',{url:"https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/shipyard.png?alt=media&token=cc8dc963-5ab0-4949-8889-db3de824db93"});

  //var locationImg = "https://firebasestorage.googleapis.com/v0/b/brass-8ba1c.appspot.com/o/location.png?alt=media&token=7c5b4284-174b-49b6-8de3-852574b67ff9";
  
  indu.set('Coal Mine',{url:"http://i.imgur.com/lhMbgOH.png"});
  indu.set('Cotton Mill',{url:"http://i.imgur.com/cb1RTT2.png"});
  indu.set('Iron Works',{url:"http://i.imgur.com/9iuGri6.png"});
  indu.set('Port',{url:"http://i.imgur.com/4lEGb99.png"});
  indu.set('Shipyard',{url:"http://i.imgur.com/kDdQ2Vm.png"});
  
  var visualCardContainer = $("<div/>");
  $(".main-board").append(visualCardContainer);

  var cardcounter = [];
  var industryCardPos = 0;
  for (i=0; i<cards.length; i++) {
    var currcard = cards[i];
    console.log("Assembling card:" + currcard);
    var c = coord.get(currcard);
    if (c !== undefined ) {
      //var card = $("<img src='https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/png/0023-20e3.png'></img>");
      var cardU = $("<div></div>");
      cardU.css({position: "absolute",
                top: c.y,
                left: c.x});
      
      cardU.data("im",currcard);
      
      var card = $("<div></div>");
      cardU.addClass("card-pointer");
      cardU.addClass(getCityClassName(currcard));
      cardU.append(card);
      
      visualCardContainer.append(cardU);
      if (cardcounter[currcard] == undefined) cardcounter[currcard] = 1;
      else cardcounter[currcard]++;
      cardU.addClass("card-pointer-" + cardcounter[currcard]);
      
      cardU.on('click', function() {
        var cardName = $(this).data("im");
        var selectBox = $("#dCardX").find("select:first");
        var sbox = setSelectByText(selectBox,cardName);
        sbox.change();
        console.log(sbox.html());
        createSelect($(this));
      });
    } else {
      var ic = indu.get(currcard);
      if (ic !== undefined) {
        var cardUContainer = $("<div/>").addClass('industry-card');
        cardUContainer.data("im",currcard);
        
        var cardContainer = $("<img/>").attr("src",ic.url);
        cardContainer.addClass("industry-card-" + industryCardPos);
        
        cardUContainer.append(cardContainer);
        
        industryCardContainer.append(cardUContainer);
        industryCardPos++;
        cardUContainer.on('click', function() {
          var cardName = $(this).data("im");
          var selectBox = $("#dCardX").find("select:first");
          var sbox = setSelectByText(selectBox,cardName);
          sbox.change();
          createSelect($(this));
        });
      }
    }
    
    
  }
  
};

function loadLog() {
  var gameID = urlParam("GameID");
  var iframeSource = "viewticker.php?GameID=" + gameID;
  $historyLog = $("<iframe />").css({display:"none"}).attr('src',iframeSource);
  $("body").append($historyLog);
  $historyLog.load(function() {
    logEntries = $historyLog.contents().find("table[cellpadding='4']:last > tbody");
    var lastEvents = $(logEntries).slice(-(2*getNumberOfCurrentPlayers() -1));
    var logTable = $("<table/>").addClass("log-table");
    
    //revert the events body
    logTable.append(lastEvents.get().reverse());

    //revert the events inside each body
    lastEvents.each(function(elem,index){
      var arr = $.makeArray($("tr",this).detach());
      arr.reverse();
        $(this).append(arr);
    });

    logTable.find("tbody").find("tr:last").find("td:nth-child(2)").each(function(){
      var $this = $(this);
      $this.addClass("desc-column");
      var pcolorText = $(this).html().split(" ",2)
      if (pcolorText.length > 1) {
        var infoColor = "log-color-" + pcolorText[0].toLowerCase();
        $this.parents("tbody").addClass(infoColor);
      }
    });
    //remove date
    logTable.find("tbody").find("tr").find("td:first").each(function(){
      var $this = $(this);
      var date = $this.html().replace("<br>"," ");
      var localDate = new Date(date);
      $this.html("");
      $this.addClass("time-column");

      if (! isNaN(localDate.getTime())) {
        $this.parents("tr").attr("alt",localDate.toLocaleString());
        $this.parents("tr").attr("title",localDate.toLocaleString());
      }
    });


    $("#game-history").append(logTable);

  })

}


updateCSS();
//$( window ).load(function() {
$(document).ready(function() {
    prepare();
    rebuildInterface();
    loadLog();
});
  
 console.log("run");


