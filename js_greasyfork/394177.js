// ==UserScript==
// @name     Virtonomica:Top page redisign
// @version  0.1
// @description Переделываем новый "дизайн" (конца 2019 года)
// @grant    none
// @include	https://*virtonomic*.*/vera/main/user/privat/persondata/knowledge
// @namespace https://greasyfork.org/users/2055
// @downloadURL https://update.greasyfork.org/scripts/394177/Virtonomica%3ATop%20page%20redisign.user.js
// @updateURL https://update.greasyfork.org/scripts/394177/Virtonomica%3ATop%20page%20redisign.meta.js
// ==/UserScript==
var run = function() {

var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
  
  function get_qa_type( el )
  {
  	//var tmp = $(".qa-advert", el);
    //if (tmp.length == 1) return "advert";
    var type = ['management', 'medicine', 'car', 'it', 'educational', 'restaurant', 'service', 'trade', 'mining', 'manufacture', 'power', 'animal', 'fishing', 'farming', 'research'];
    
    for( var i=0; i< type.length; i++) {
	    var tmp = $(".qa-" + type[i], el);
      if (tmp.length == 1) return type[i]
    }
    /*
    var tmp = $(".qa-management", el);
    if (tmp.length == 1) return "management";
    
    tmp = $(".qa-medicine", el);
    if (tmp.length == 1) return "medicine";
    
    tmp = $(".qa-car", el);
    if (tmp.length == 1) return "car";

    tmp = $(".qa-it", el);
    if (tmp.length == 1) return "it";

    tmp = $(".qa-educational", el);
    if (tmp.length == 1) return "educational";

    */
    return "unknow";
  }
  
	// Стили  
	var st = $("style");

  // скрываем иконки "достижений"
  st.append(".achivement{display: none;}");
  
  // класс для показа базового числа рабочих
  st.append(".base{color: #2149c1;font-weight: bold;}");
  
  // раздвигаем на весь блок
  $(".skill").css("width", "100%");  
  
  // меняем цвет у прироста
  $(".fill2").css("background-color","#b9b9b9");
  
  // убираем кнопки повышения квалы
  $(".input-group").css("display","none");
  $(".forecast_value_container").parent().css("display","none");
  
  // надписи про рабоичх и рекламу в одну строку
  $(".legend").css("white-space", "nowrap");
  
  //$(".bonuses-table tr").css("width", "40px");
  
  //ускорение роста навыка после покупки:
  $(".message").each( function(){
  	var el = $(this);
    el.html( el.html().replace("ускорение роста навыка после покупки:", ""));
  });
  $(".text").each( function(){
  	var el = $(this);
    el.html( el.html().replace("за пересчёт:", "+"));
    	
  });
  
  st.append(".pull-right{color: #790ddf;}");
  
  
  var kv = $(".values");
  console.info(kv);
  kv.each( function(){
    var el = $(this);
    var val = parseInt( $(".val", el ).text() );
    
    var type = get_qa_type( el );
    
    console.log( type + ":" + val);
    //console.info( val );
    
    if ( type == "unknow") return;
    
    var info = $(".text-right", el.parent().parent() );
    console.info( info );
    info.before("<td class='base text-center text-middle' title='Максимальная численность персонала для квалификации без бонусов / миниум для 100% роста квалификации'>" + getThousandsSplitted( calcPersonalTop3( val, type) ) + "</td>");
    //text-right

  });
  
  // попробуем переместить усорение от снятия штрафа на рост квалы
  $(".card-block").each(function(){
  	var el = $(this);
    var mes = $(".message", el) ;
    mes.hide();
    //$('.legend', el).append("<tr><div class='message>'" + mes.html() + "</div>" );
    $('.legend', el).append( "<span class=message>" + mes.html() + "</span>" );
    mes.hide();
    
  });
  
 	function getThousandsSplitted(val) {
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	/**
   * вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3)
	 * function calcPersonalTop3(q, type)
   *
	 *@param q - квалификация игрока
	 * 
	 */
	function calcPersonalTop3( q, type){
		return ((2*q*q + 6*q)*getK3(type));
	}

	/**
	 * возвращает к для расчётов нагрузки по типу для топ-3
	 *   
	 *@param type строка с запрашиваемым типом
	 */
	function getK3(type)
	{
		switch(type)
		{
			//case('shop'):
      case('trade'):
			//case('restaurant'):
      case('restaurant'):
			//case('lab'):
      case('research'):  
				return 5;
				break;
			case('workshop'):
				if (/anna/.test(window.location.href)) {
				return 100;
				break;
				}
				else {
				return 50;
				break;
				}
			case('mill'):
				if (/anna/.test(window.location.href)) {
				return 100;
				break;
				}
				return 50;
				break;
			case('sawmill'):
				if (/anna/.test(window.location.href)) {
				return 100;
				break;
				}
				return 50;
				break;
			//case('animalfarm'):
      case('animal'):  
				return 7.5;
				break;
			case('medicine'):
			//case('fishingbase'):
      case('fishing'):
				return 12.5;
				break;
			case('farm'):
				return 20;
				break;
			case('orchard'):
				return 15;
				break;
			//case('mine'):
      case('mining'):
				if (/anna/.test(window.location.href)) {
				return 50;
				break;
				}
				else {
				return 100;
				break;
				}
			//case('office'):
      case('management'):
				return 1;
				break;
			//case('service_light'):
      case('service'):
				return 1.5;
				break;
			case('power'):
				return 75.0;
				break;
			//case('repair'):
        case('car'):
				return 2.5;
				break;
			case('fuel'):
				return 2.5;
				break;
			case('educational'):
				return 1.5;
				break;
			case('it'):
				return 1;
				break;
			case('villa'):
			case('warehouse'):
			case('unknown'):
			default:
				return 0;
		}//end switch
	}//end getType()
  
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 