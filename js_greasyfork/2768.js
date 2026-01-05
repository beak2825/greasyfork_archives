// ==UserScript==
// @name    	BrokerYard - checker
// @namespace   virtonomica
// @description Контроль правильности своего хода
// @include 	http://virtonomica.ru/*/main/brokergame/view/*
// @exclude 	http://virtonomica.ru/*/main/brokergame/view/*/players
// @exclude 	http://virtonomica.ru/*/main/brokergame/view/*/result
// @version 	1
// @downloadURL https://update.greasyfork.org/scripts/2768/BrokerYard%20-%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/2768/BrokerYard%20-%20checker.meta.js
// ==/UserScript==
var run = function() {

    // наши ставки
    money = new Object();
    money['bk_blue'] = $("input[name='blue']");
    money['bk_red'] = $("input[name='red']");
    money['bk_yellow'] = $("input[name='yellow']");
    money['bk_green'] = $("input[name='green']");

    //console.log( blue.val() );
    $("table.grid").before("<span id=checker_info>");

    // наша карта
    divs = $("div[id^='order_']:visible");
    console.log( divs.attr('id') );
    if ("order_empty" == divs.attr('id') ){
   	 $("#checker_info").text("Ход еще не сделан").css("color", "magenta");
   	 return;
    }

    table = $("table", divs);
    tr = $("tr", table);
    console.log("TR = " + tr.length);
    for (i=1; i< tr.length; i++){
   	 td = $("td", tr.eq(i));
   	 //console.log("td = " + td);
   	 color = td.eq(0).attr('class');
   	 if (color ==undefined) continue;
   	 dv = $("div", td.eq(0) );
   	 card = jQuery.trim( dv.text() );
   	 action = parseInt( money[color].val().replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
   	 console.log(color + " = " +  card + "|" + action);
   	 if ( action == 0) continue;

   	 if ( (card == "+100") ||
   	  	(card == "x2") ||
   	  	(card == "+60") ||
   	  	(card == "+50") ||
   	  	(card == "+40") ||
   	  	(card == "+30") ) {
   		 console.log("Up");
   		 $("#checker_info").append(" Поднимаем свой цвет").css("color", "green");
   	 }
   	 if ( (card == "-100") ||
   	  	(card == "1/2") ||
   	  	(card == "-60") ||
   	  	(card == "-50") ||
   	  	(card == "-40") ||
   	  	(card == "-30") ) {
   		 console.log("Down");
   		 $("#checker_info").append(" Внимание!! опускаем свой цвет").css("color", "red");
   	 }
   	 if (card == "Zero") {
   		 console.log("Zero");
   		 $("#checker_info").append(" Внимание!! Блокируем свой цвет").css("color", "red");
   	 }
    }
    //console.log(divs.html());

    console.log('end checker');
}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}