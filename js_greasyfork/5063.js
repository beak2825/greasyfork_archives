// ==UserScript==
// @name       Редактирование статей shatki.ru
// @namespace  http://www.shatki.ru/
// @version    0.1
// @description  enter something useful
// @match      http://www.shatki.ru/administrator/index.php?option=com_content&view=article&layout=edit
// @copyright  2012+, You
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/5063/%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D0%B5%D0%B9%20shatkiru.user.js
// @updateURL https://update.greasyfork.org/scripts/5063/%D0%A0%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D0%B5%D0%B9%20shatkiru.meta.js
// ==/UserScript==

$('#minwidth-body').after('<button id="button_NP" type="button" style="cursor: pointer; display: block; position: absolute; right: 71px; top: 310px; z-index: 100;">Новый путь</button>');
$('#minwidth-body').after('<input id="input_day" value="1" type="text" size="3" style="cursor: pointer; display: block; position: absolute; right: 100px; top: 350px; z-index: 100;">');
$('#minwidth-body').after('<button id="button_NPclean" type="button" style="cursor: pointer; display: block; position: absolute; right: 71px; top: 348px; z-index: 100;">X</button>');
$('#minwidth-body').after('<a href="http://www.shatki.ru/t/article/"  target="_blank" style="cursor: pointer; display: block; position: absolute; right: 71px; top: 380px; z-index: 100;">new article</a>');

$( "#input_day" ).click(function() {
	var day = $( "#input_day" ).val();
	day++;
	//console.log(day);
	$( "#input_day" ).val(day);
});

//$( "#jform_articletext" ).val("1\n2\n3\n4\n5\n");

$( "#button_NPclean" ).click(function() {
    $( "#input_day" ).val('');
});

$( "#button_NP" ).click(function() {
	var text = $( "#jform_articletext" ).val();
    var title = text.match(/.+/);
    //console.log(title);
    $('#jform_title').val(title);
    text = text.replace(/.+/,"");
	text = $.trim(text);
    $( "#jform_articletext" ).val(text);
    
    $( '#jform_catid :contains("- Новый путь")' ).attr("selected", "selected");
    $( '#jform_featured :contains("да")' ).attr("selected", "selected");
    
    var plus = parseInt($( "#input_day" ).val());
    if(plus > 0){
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+plus);
        function addzero(int){
        	return "0"+int;
        }
        var y = tomorrow.getFullYear();
        var m = tomorrow.getMonth();
		m++;
        if(m<10) m = addzero(m);
        var d = tomorrow.getDate();
        if(d<10) d = addzero(d);
        var h = tomorrow.getHours();
        if(h<10) h = addzero(h);
        h = "07"; // всегда 7 часов утра
        var min = tomorrow.getMinutes();
        if(min<10) min = addzero(min);
        var s = tomorrow.getSeconds();
        if(s<10) s = addzero(s);
        
        var date_plus = y+"-"+m+"-"+d+" "+h+":"+min+":"+s;
        //console.log("2013-09-20 17:35:48\n",tomorrow,date_plus);
        $( "#jform_created, #jform_publish_up" ).val(date_plus);
    
    }else{
        $( "#jform_created, #jform_publish_up" ).val("");
    }

});
