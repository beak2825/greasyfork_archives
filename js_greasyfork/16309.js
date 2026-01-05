// ==UserScript==
// @name гродно шенген покупки рандом даты
// @namespace гродно шенген покупки рандом даты
// @description гродно шенген покупки рандом даты.
// @include https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx*
// @include https://by.e-konsulat.gov.pl/Bledy*
// @include https://rejestracja.by.e-konsulat.gov.pl*
// @require http://code.jquery.com/jquery-latest.min.js
// @version 1
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16309/%D0%B3%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%20%D1%88%D0%B5%D0%BD%D0%B3%D0%B5%D0%BD%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%D1%80%D0%B0%D0%BD%D0%B4%D0%BE%D0%BC%20%D0%B4%D0%B0%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/16309/%D0%B3%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%20%D1%88%D0%B5%D0%BD%D0%B3%D0%B5%D0%BD%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%D1%80%D0%B0%D0%BD%D0%B4%D0%BE%D0%BC%20%D0%B4%D0%B0%D1%82%D1%8B.meta.js
// ==/UserScript==


 var testMode=true;
 var grodnoTestId = 89;
 var grodnoId = 89;
 var city = 95;
 var sepr = ' || ';

 var typePresent = false;
 var dayPresent = false;
 var result = false;
 var fmessage = document.documentElement.innerHTML;

 try{
 if($('#cp_tabCaptcha')) {
	$('#cp_tabCaptcha').css({position:'RELATIVE',top:'0px',left:'0px'});  
 }
 }catch(e){
 }

 try{
 if ($('#cp_tabListy')) {
     $('#cp_tabListy').css({position:'RELATIVE',top:'0px',left:'0px'});
 }
 }catch(e){
 }

 try{
 if($('#cp_krokiRejestracji_tabFormularz')) {
     $('#cp_krokiRejestracji_tabFormularz').css({position:'absolute',top:'0px',left:'0px',display:'none'});

 }
 }catch(e){
 }

  if (document.getElementById('cp_cbDzien')) {
      localStorage.clear();

    var options = $('#cp_cbDzien option');
    min = 1;
    max = options.length;
    var lastValue = undefined;
    while (lastValue==undefined) {
       rand = Math.floor(Math.random() * (max - min + 1)) + min; 
       lastValue = options.eq(rand).val(); 
       console.log(lastValue);
    }
      var typeValue = $('#cp_cbRodzajUslugi option:selected').text();
  console.log(lastValue);
  console.log(typeValue);
  GM_setValue('lastValue', lastValue);
  GM_setValue('typeValue', typeValue);   
      
  if(lastValue != -1 && typeof(lastValue) != 'undefined'){
   $('#cp_cbDzien').val(lastValue);
   $('#cp_btnRezerwuj').removeAttr('disabled');
   $('<input name="ctl00$cp$btnRezerwuj" value="Зарегистрироваться">').attr('type','hidden').appendTo('#form1');
     document.title = "Выбрали: " + lastValue; 
      
     setTimeout(function() {$("#form1").submit();}, 1);
 }else{
        location.href = "https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=8&IDPlacowki=95";
   return;
    }
 } else if ($('#cp_lblBrakTerminow').text().length > 0) {
 	document.title = "Неудача " + $('#cp_lblBrakTerminow').text();
 	setTimeout(function() {location.href = "https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=8&IDPlacowki=95";}, 1500);
 	return;
 } else if (document.getElementById('cp_cbRodzajUslugi')) {

     
 	document.title = "Выбираем тип визы. Нажмите ENTER!!!";
  localStorage.clear();   
     var id;
 	 if(city == "95"){
        id = grodnoTestId;
    }
     
//    if (document.getElementById('cp_cbRodzajUslugi')) {
//        typePresent = true;
//    } 
//
//    if (document.getElementById('cp_cbDzien')) {
//        dayPresent = true;
//    }
//
//    if(typePresent && !dayPresent){
//        document.title = "Выбираем тип визы";
//        var id;
//        if(city == "95"){
//			id = testMode ? "" + brestTestId : "";
//        }
//        $('#cp_cbRodzajUslugi').val(id);
//        setTimeout('__doPostBack(\'ctl00$cp$cbRodzajUslugi\',\'\')', 1);
//    }

$(window).keydown(function(e) {
   if (e.which == 13) {
         $('#cp_cbRodzajUslugi').val(id);
    setTimeout('__doPostBack(\'ctl00$cp$cbRodzajUslugi\',\'\')', 1);
   }
});
      
     
 } else if (document.getElementById('cp_f_lblWalidacjaKonsultacjaInfo')) {
    var lastValue = GM_getValue('lastValue');
    var typeValue = GM_getValue('typeValue');
    GM_setValue('lastValue', '');
    GM_setValue('typeValue', '');
    
	function addZero(i) {
	if (i < 10) {
	i = "0" + i;
	}
	return i;
	}
   
    var date = new Date();
    var secopen = addZero(date.getSeconds());
    var minopen = addZero(date.getMinutes());
    var hoursopen = addZero(date.getHours());
    var timez = hoursopen + ":" + minopen + ":" + secopen;

    
    document.title = sepr +lastValue +sepr +typeValue +sepr +timez; 
     var p = document.createElement('h3'),
   
     txt = document.createTextNode(lastValue +sepr +typeValue +sepr +timez);
     p.appendChild(txt);
     document.getElementById('cp_f_lblNaglowek1').appendChild(p);
    
    return;
     
 } else if (document.getElementById('cp_tabCaptcha')) {
    document.title = "Введите капчу: ";
    localStorage.clear();
    $(window).keydown(function(e) {
     if (e.which == 13) {
     setTimeout('__doPostBack(\'ctl00$cp$btnDalej\',\'\')', 1);
     }
    });
    return; 
     
 } else if (document.getElementById('tresc_lblBlad')) {
     document.title = "Ошибка: Blad ogolny";
    return;
     
 } else if (fmessage.search('Request') != -1) {
     var fmessage = document.documentElement.innerHTML;
     document.title = "Ошибка: Request";
     
    return;
     
 } else if (document.getElementById('tresc_lblBlad')) {
     document.title = "321";
     location.href = "https://by.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx?IDUSLUGI=8&IDPlacowki=95";
    return;
 
  }