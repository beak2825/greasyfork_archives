// ==UserScript==
// @name           Virtonomica:Labs Info
// @name:en        Virtonomica:Labs Info   
// @namespace      Virtonomica
// @version        1.54
// @description    Дополнительная информация по лаборатории
// @description:en Additional information about the lab 
// @include        https://*virtonomic*.*/*/main/unit/view/*/investigation
// @downloadURL https://update.greasyfork.org/scripts/1530/Virtonomica%3ALabs%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/1530/Virtonomica%3ALabs%20Info.meta.js
// ==/UserScript==
var run = function() {

	function TrimStr(s) {
		s = s.replace( /^\s+/g, '');
		return s.replace( /\s+$/g, '');
	}

    /**
    * Склоенение числа дней
    */
    function getDays( days ){
       	if (lang == "En") {
           if (days == 1) return "1 day";
           else return days + " days";
       	}

	// RU
       	d = days%10;
	switch( d ){
		case 1: return (days + " день"); 
		case 2: 
		case 3: 
		case 4: 
			return (days + " дня"); 
		default : return (days + " дней"); 
	}
    }

    // определяем интерфейс
    // autodefined language interface
    var lang = 'undef';
    var bt_logout = $("li[class='icon menulogout']");
    //var logout_string = bt_logout.attr('title');
	var logout_string = $("a[href*='user/logout']").text();
    if (logout_string == 'Выход') {
	   lang = 'Ru';
    } else if(logout_string == 'Logout') {
	   lang = 'En';
    } 
    if ( lang == 'undef') {
        alert('Unsupported language for userscript "LabsInfo"');
		return;
    }  

    // Строки зависимые от языка
    // language definitions
    var LangMsg = new Object();
    LangMsg['Ru'] = new Object();
    LangMsg['En'] = new Object();

    LangMsg['Ru']['Scientists'] = "Учёных на проекте";
    LangMsg['En']['Scientists'] = "Scientists in project";

    LangMsg['Ru']['required'] = "требуется учёных:";
    LangMsg['En']['required'] = "scientists required";

    LangMsg['Ru']['Current research stage'] = "Текущая стадия продолжается";
    LangMsg['En']['Current research stage'] = "Current research stage lasts for";

    LangMsg['Ru']['average up'] = "средний прирост";
    LangMsg['En']['average up'] = "average up";

    LangMsg['Ru']['average up 2'] = "Если включить +25% к гипотезе";
    LangMsg['En']['average up 2'] = "If we connect +25% to the hypothesis";
  
    LangMsg['Ru']['prognosis'] = "прогнозируется заверешние работ через ";
    LangMsg['En']['prognosis'] = "Prognosis completion in ";

    LangMsg['Ru']['prognosis 2'] = "прогнозируется заверешние работ через ";
    LangMsg['En']['prognosis 2'] = "Prognosis completion in ";

    LangMsg['Ru']['bonus'] = "Бонус";
    LangMsg['En']['bonus'] = "Bonus";

    LangMsg['Ru']['stage'] = "Стадия разработки";
    LangMsg['En']['stage'] = "Research stage";

    LangMsg['Ru']['innov'] = "Инновации";
    LangMsg['En']['innov'] = "Business Boosters";

    function getLabsInfo() {
        info = $("<div id=labs_info></div>");
	$("table.infoblock").before( info );

	// Число ученых
	var works = $("td:contains('" + LangMsg[lang]['Scientists'] + "')").next().text().replace(" ","").replace(" ","");

	// Сколько ученых надо
	var el_req = $("td:contains('" + LangMsg[lang]['required'] + "')");
	var str = el_req.text();
	var pos = str.indexOf('(') + 1 + LangMsg[lang]['required'].length;
	var req = parseInt( str.substr(pos).replace(")","").replace(" ","").replace(" ","") );

	var power = works/req;

	el_req.append( " <font color=green>" + (Math.ceil(works/req*1000)/10) + "%</font>" );

	// Число недель для текущей стадии
  var last = 0;
  var procents = 0;
  var el;
	var weeks = $("td:contains('" + LangMsg[lang]['Current research stage'] + "')").next().text();
	if (weeks > 0) {
		// Элемент для вывода информации
		el = $("td.progress_bar:eq(1)").next();
		// Текущий процент
		procents = parseFloat( el.text() );

		var up = procents/weeks;
		last = Math.ceil( (100 -  procents)/up);
		el.parent().parent()
		.append("<tr><td colspan=2>"+ LangMsg[lang]['average up'] + ": " + (Math.ceil( 1000*up )/1000) + "%")
		.append("<tr><td colspan=2>" + LangMsg[lang]['prognosis'] + "<font color=green>" + getDays(last) + "</font>");
	}

	// поиск гипотез
	form = $("form[action*='investigation']");
	
	tr = $("tr[onclick^='hypotesisSelect']", form.eq(0) );

  // Какая у нас стадия
  var td_stage =  $("td:contains('" + LangMsg[lang]['stage'] + "')").next();  
  var stage = parseInt( td_stage.text() );   
      
  //console.info("stage=" +stage);
  
  // Bonus
	kv = 1.0;
  var kv2 = 1.0;
  // find all bonus
  var td_bonus = $("td:contains('" + LangMsg[lang]['bonus'] + "')").next();
  var div_bonus = $("div", td_bonus);
  for(var i=0; i<div_bonus.length; i++ ) {
    var str = div_bonus.eq(i).text();
    var pos1 = str.indexOf('+') + 2;
    var pos2 = str.indexOf('%') - 1;
    var bonus = parseFloat( str.substr(pos1, pos2-pos1) );
    
    var inn_name = $.trim( str.substr(0, pos1-2 ) );
    //console.log( "[" + inn_name + "]");
    
    kv *= (1 + bonus/100);
    
    if ( stage ==1 && inn_name == LangMsg[lang]['innov']) {
      kv2 = 1.3;
    }
  }
      
  if ( kv2 > 1 ) {
    var up2 = up / kv2;
    var last2 = Math.ceil( (100 -  procents)/up2);
    
    //console.log("up2=" + up2);
    //console.log("last2="+ last2);
    
   	el.parent().parent()
    .append("<tr><td colspan=2>"+ LangMsg[lang]['average up 2'] + ": " + (Math.ceil( 1000*up2 )/1000) + "%, " + LangMsg[lang]['prognosis 2'] + "<font color=green>" + getDays(last2) + "</font>")
    ; 
  }

	k = kv*1.4286*(1 - 0.3/power);

	for (i=0; i<tr.length; i++){
		td = $("td", tr.eq(i) );
		pr = parseFloat(td.eq(2).text().replace("%", "").replace(" ", "").replace(" ", "") );
		days = parseFloat(td.eq(3).text().replace(" ", "").replace(" ", "") );
		td.eq(3).append( " <span title='" + (Math.ceil(days/k*10)/10)+"'><font color=maroon>(" + (Math.ceil(days/k)/1) + ")</font></span>");
        }
    }

    getLabsInfo();
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}