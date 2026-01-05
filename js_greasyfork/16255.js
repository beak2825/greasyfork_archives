// ==UserScript==
// @name        Virtonomica: Напоминалка FactorNew
// @namespace   Virtonomica напоминалка
// @description    Отображение за ход, где надо сменить спецухи; сколько осталось до окончания платных услуг.
// @version     4.4
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list
// @include       http*://virtonomic*.*/*/main/company/view/*/dashboard
// @include       http*://virtonomic*.*/*/main/geo/citylist/*
// @include      http*://virtonomic*.*/*/main/user/privat/persondata/message/inbox/*

// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16255/Virtonomica%3A%20%D0%9D%D0%B0%D0%BF%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D0%BB%D0%BA%D0%B0%20FactorNew.user.js
// @updateURL https://update.greasyfork.org/scripts/16255/Virtonomica%3A%20%D0%9D%D0%B0%D0%BF%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D0%BB%D0%BA%D0%B0%20FactorNew.meta.js
// ==/UserScript==

var run = function() {
    
   function ToStorage(name,  val)
	{
	    try {
	       window.localStorage.setItem( name,  JSON.stringify( val ) );
	    } catch(e) {
	       out = "Ошибка добавления в локальное хранилище";
	   //    console.log(out);
	    }
	}
     function getCookie(cName){
	// разделение куков
	var    cookieStr = document.cookie,                  // получаем строку куков
	       cookieArray = cookieStr.split(';'),           // вспоминаем о чудесном методе split и разбиваем строку с куками на упорядоченый массив по разделителю ";"
	       i, j;
	 
	       // удалим пробельные символы (если они, вдруг, есть) в начале и в конце у каждой куки
	       for (j=0; j<cookieArray.length; j++) cookieArray[j] = cookieArray[j].replace(/(\s*)\B(\s*)/g, '');
	 
	var    cookieNameArray = new Array({name: '', value: new Array()});    // результирующий упорядоченный массив
	                                                                       // каждый элемент будет объектом с методами name и value
	                                                                       // name - имя куки, value - упорядоченный массив значений куки 
	       // обрабатываем каждую куку
	       for (i=0; i<cookieArray.length; i++)
	       {
	           var    keyValue = cookieArray[i].split('='),               // разделяем имя и значение       
	                  cookieVal = unescape(keyValue[1]).split(';');       // разделяем значения, если они заданы перечнем
	 
	                  // удаляем пробельные символы  (если они, вдруг, есть) у значений в начале и в конце
	                  for (j=0; j<cookieVal.length; j++) cookieVal[j] = cookieVal[j].replace(/(\s*)[\B*](\s*)/g, '');
	                  keyValue[0] = keyValue[0].replace(/(\s*)[\B]*(\s*)/g, '');
	                  // вот получился такой cookie-объект
	                  cookieNameArray[i] = {
	                      name: keyValue[0],
	                      value: cookieVal
	                  };
	       };
	    var cookieNALen = cookieNameArray.length;    // размер полученного массива
	        // выбираем нужную куку
	        if (!cName) return cookieNameArray
	            else 
	                for (i=0; i<cookieNALen; i++) if (cookieNameArray[i].name == cName) return cookieNameArray[i].value;         
	     return false;  
	};
   
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
//****************************************формирование и запись в лок хр ссылок с плантациями по месяцах     
  myrealm = readCookie('last_realm');
 prot=window.location.protocol;
 hostserv=window.location.host;
  
 var ttt=document.location.href
  ttt = ttt.split("/")
   console.log(ttt)
	      // console.log(ttt[8])
 	if (ttt[8] == "unit_list"){
 //console.log(typeselect)
     var typeselect2=$("a[class$='u-s']").attr('class')
 if (typeselect2 == 'i-orchard u-s' || typeselect2 == 'i-farm u-s'){
 
    
    
    
   var sbros = $('<input type="button" id=sbros value="Очистить локальное хранилище"/>').click(function(){
      //   Jan Feb Mar Apr May June July Aug Sept Oct Nov Dec   
  
      localStorage.removeItem("Jan");
      localStorage.removeItem("Feb");
      localStorage.removeItem("Mar");
      localStorage.removeItem("Apr");
      localStorage.removeItem("May");
      localStorage.removeItem("June");
      localStorage.removeItem("July");
      localStorage.removeItem("Aug");
      localStorage.removeItem("Sept");
      localStorage.removeItem("Oct");
      localStorage.removeItem("Nov");
      localStorage.removeItem("Dec");
      localStorage.removeItem("myJan");
      localStorage.removeItem("myFeb");
      localStorage.removeItem("myMar");
      localStorage.removeItem("myApr");
      localStorage.removeItem("myMay");
      localStorage.removeItem("myJune");
      localStorage.removeItem("myJuly");
      localStorage.removeItem("myAug");
      localStorage.removeItem("mySept");
      localStorage.removeItem("myOct");
      localStorage.removeItem("myNov");
      localStorage.removeItem("myDec");
     localStorage.removeItem("ekostrannap");
   })
   
 /*  var  proverim = $('<input type="button" id= proverim value="Для проверки"/>').click(function(){
    myJan = JSON.parse( window.localStorage.getItem('myJan') );
   myFeb = JSON.parse( window.localStorage.getItem('myFeb') );
   myMar = JSON.parse( window.localStorage.getItem('myMar') );
   myApr = JSON.parse( window.localStorage.getItem('myApr') );
   myMay = JSON.parse( window.localStorage.getItem('myMay') );
  myJune = JSON.parse( window.localStorage.getItem('myJune') );
   myJuly = JSON.parse( window.localStorage.getItem('myJuly') );
   myAug = JSON.parse( window.localStorage.getItem('myAug') );
   mySept = JSON.parse( window.localStorage.getItem('mySept') );
   myOct = JSON.parse( window.localStorage.getItem('myOct') );
   myNov = JSON.parse( window.localStorage.getItem('myNov') );
     myDec = JSON.parse( window.localStorage.getItem('myDec') );
    console.log(myJan)
    console.log(myFeb)
     console.log(myMar)
      console.log(myApr)
       console.log(myMay)
        console.log(myJune)
         console.log(myJuly)
          console.log(myAug)
           console.log(mySept)
            console.log(myOct)
             console.log(myNov)
              console.log(myDec)
   var    ekostrannap = JSON.parse( window.localStorage.getItem('ekostrannap') );
      console.log(ekostrannap)
   })*/

     function plantscan(z, Vrin, Murl){
        var kult= $('td:eq(1)', Vrin[z]).text();
        var mes= $("td[title~='уборка']", Vrin[z]).attr('title').replace(/\s/g, "").replace(/\,уборкаурожая/g, "");    
      
     switch (mes) {
  case "Январь": {
      
     Jan = JSON.parse( window.localStorage.getItem('Jan') );
    if (Jan==null)  {
    
 Jan= '<a href='+Murl+'>'+kult;   
        ToStorage('Jan', Jan);
       }
    
   else    { 
     Jan=Jan+' либо '+kult;
   
   ToStorage('Jan', Jan); 
   }
     break;
  }
    
 case "Февраль": {
  
     Feb = JSON.parse( window.localStorage.getItem('Feb') );
     if (Feb==null) {
   Feb= '<a href='+Murl+'>'+kult;   
        ToStorage('Feb', Feb);
      }
   else {   
   Feb=Feb+' либо '+kult;
   ToStorage('Feb', Feb);
  }
     break;
  }   
    
  case "Март": {
    
     Mar = JSON.parse( window.localStorage.getItem('Mar') );
     if (Mar==null) {
   Mar= '<a href='+Murl+'>'+kult;   
        ToStorage('Mar', Mar);
      }
   else {   
   Mar=Mar+' либо '+kult;
   ToStorage('Mar', Mar);
  }
     break;
  }  
    
case "Апрель": {
     
     Apr = JSON.parse( window.localStorage.getItem('Apr') );
     if (Apr==null) {
   Apr= '<a href='+Murl+'>'+kult;   
        ToStorage('Apr', Apr);
      }
   else {   
   Apr=Apr+' либо '+kult;
   ToStorage('Apr', Apr);
  }
     break;
  }    
    
    
 case "Май": {
   
     May = JSON.parse( window.localStorage.getItem('May') );
     if (May==null) {
   May= '<a href='+Murl+'>'+kult;   
        ToStorage('May', May);
      }
   else {   
   May=May+' либо '+kult;
   ToStorage('May', May);
  }
     break;
  }   
    
 case "Июнь": {
    
     June = JSON.parse( window.localStorage.getItem('June') );
     if (June==null) {
   June= '<a href='+Murl+'>'+kult;   
        ToStorage('June', June);
      }
   else {   
   June=June+' либо '+kult;
   ToStorage('June', June);
  }
     break;
  }   
    
case "Июль": {
   
     July = JSON.parse( window.localStorage.getItem('July') );
     if (July==null) {
   July= '<a href='+Murl+'>'+kult;   
        ToStorage('July', July);
      }
   else {   
   July=July+' либо '+kult;
   ToStorage('July', July);
  }
     break;
  }    
    
 case "Август": {
     
     Aug = JSON.parse( window.localStorage.getItem('Aug') );
     if (Aug==null) {
   Aug= '<a href='+Murl+'>'+kult;   
        ToStorage('Aug', Aug);
      }
   else {   
   Aug=Aug+' либо '+kult;
   ToStorage('Aug', Aug);
  }
     break;
  }
    
    
  case "Сентябрь": {
  
     Sept = JSON.parse( window.localStorage.getItem('Sept') );
     if (Sept==null) {
   Sept= '<a href='+Murl+'>'+kult;   
        ToStorage('Sept', Sept);
      }
   else {   
   Sept=Sept+' либо '+kult;
   ToStorage('Sept', Sept);
  }
     break;
  }  
    
  case "Октябрь": {
   
     Oct = JSON.parse( window.localStorage.getItem('Oct') );
     if (Oct==null) {
   Oct= '<a href='+Murl+'>'+kult;   
        ToStorage('Oct', Oct);
      }
   else {   
   Oct=Oct+' либо '+kult;
   ToStorage('Oct', Oct);
  }
     break;
  }  
    
  case "Ноябрь": {
   
     Nov = JSON.parse( window.localStorage.getItem('Nov') );
     if (Nov==null) {
   Nov= '<a href='+Murl+'>'+kult;   
        ToStorage('Nov', Nov);
      }
   else {   
   Nov=Nov+' либо '+kult;
   ToStorage('Nov', Nov);
  }
     break;
  }  
    
    
    case "Декабрь": {
     
     Dec = JSON.parse( window.localStorage.getItem('Dec') );
     if (Dec==null) {
   Dec= '<a href='+Murl+'>'+kult;   
        ToStorage('Dec', Dec);
      }
   else {   
   Dec=Dec+' либо '+kult;
   ToStorage('Dec', Dec);
  }
     break;
  }
    
    
  };
                          
        }
     
  //******************************поиск плантаций
     idplan = "";
   var idplant = $('<input type="button" id=idplant value="Добавить"/>').click(function(){
   var m=0
     $('form[id="js-multisale-form"]> table > tbody>tr:has([title="Земледельческая ферма"]),tr:has([title="Плантация"])').each(function() {
          var el = $("td.unit_id", this);
       for(i=0; i< el.length; i++){
           if ( !el.eq(i).is(':visible') ) continue;
     	   id = el.eq(i).text();
           idplan+= id + ",";
            }
         });
idplan=idplan.slice(0,-1) ;
   idplan =  idplan.split(',');

      k=0;
   while (k< idplan.length){
                
     var Murl=prot+'//'+hostserv+'/'+myrealm+'/window/unit/produce_change/'+idplan[k];
//проверка каждой плантации
     $.ajax({ url:Murl, 
        async: false,
        type: 'post',
        success: function(data){

    
 var   Vrin = $('table.list>tbody>tr.even, tr.odd',data); 
            
      if (Vrin.length >1){
        m=m+1;

    z=0;
   while (z< Vrin.length){
     
          plantscan(z, Vrin, Murl);
          z=z+1;
    }

       //янв
      Jan = JSON.parse( window.localStorage.getItem('Jan') );
      myJan = JSON.parse( window.localStorage.getItem('myJan') );
      if (myJan==null){
         myJan={};
       }
    
    if (Jan!=null && myJan[myrealm]!=null){
         myJan[myrealm]=myJan[myrealm]+'<br/>'+Jan+'</a>';
        }
    if (Jan!=null && myJan[myrealm]==null){
         myJan[myrealm]=Jan+'</a>';
        }      
      
      ToStorage('myJan',  myJan);
    
    //февр
      Feb = JSON.parse( window.localStorage.getItem('Feb') );
      myFeb = JSON.parse( window.localStorage.getItem('myFeb') );
        if (myFeb==null){
         myFeb={};
       }
       if (Feb!=null && myFeb[myrealm]!=null){
         myFeb[myrealm]=myFeb[myrealm]+'<br/>'+Feb+'</a>';
        }
    if (Feb!=null && myFeb[myrealm]==null){
         myFeb[myrealm]=Feb+'</a>';
        }    
      ToStorage('myFeb',  myFeb);
    
     //март
      Mar = JSON.parse( window.localStorage.getItem('Mar') );
      myMar = JSON.parse( window.localStorage.getItem('myMar') );
       if (myMar==null){
         myMar={};
       }
       if (Mar!=null && myMar[myrealm]!=null){
         myMar[myrealm]=myMar[myrealm]+'<br/>'+Mar+'</a>';
        }
    if (Mar!=null && myMar[myrealm]==null){
         myMar[myrealm]=Mar+'</a>';
        }    
      ToStorage('myMar',  myMar);
        
     //апр
      Apr = JSON.parse( window.localStorage.getItem('Apr') );
      myApr = JSON.parse( window.localStorage.getItem('myApr') );
          if (myApr==null){
         myApr={};
       }
       if (Apr!=null && myApr[myrealm]!=null){
         myApr[myrealm]=myApr[myrealm]+'<br/>'+Apr+'</a>';
        }
     if (Apr!=null && myApr[myrealm]==null){
         myApr[myrealm]=Apr+'</a>';
        }  
      ToStorage('myApr',  myApr);
    
    //май
      May = JSON.parse( window.localStorage.getItem('May') );
      myMay = JSON.parse( window.localStorage.getItem('myMay') );
           if (myMay==null){
         myMay={};
       } 
       if (May!=null && myMay[myrealm]!=null){
         myMay[myrealm]=myMay[myrealm]+'<br/>'+May+'</a>';
        }
    if (May!=null && myMay[myrealm]==null){
         myMay[myrealm]=May+'</a>';
        }  
      ToStorage('myMay',  myMay);
    
     //июнь
      June = JSON.parse( window.localStorage.getItem('June') );
      myJune = JSON.parse( window.localStorage.getItem('myJune') );
          if (myJune==null){
         myJune={};
       } 
       if (June!=null && myJune[myrealm]!=null){
         myJune[myrealm]=myJune[myrealm]+'<br/>'+June+'</a>';
        }
     if (June!=null && myJune[myrealm]==null){
         myJune[myrealm]=June+'</a>';
        }   
      ToStorage('myJune',  myJune);
     //июль
    July = JSON.parse( window.localStorage.getItem('July') );
      myJuly = JSON.parse( window.localStorage.getItem('myJuly') );
            if (myJuly==null){
         myJuly={};
       } 
       if (July!=null && myJuly[myrealm]!=null){
         myJuly[myrealm]=myJuly[myrealm]+'<br/>'+July+'</a>';
        }
     if (July!=null && myJuly[myrealm]==null){
         myJuly[myrealm]=July+'</a>';
        } 
      ToStorage('myJuly',  myJuly);
    
     //авг
    Aug = JSON.parse( window.localStorage.getItem('Aug') );
      myAug = JSON.parse( window.localStorage.getItem('myAug') );
            if (myAug==null){
         myAug={};
       } 
       if (Aug!=null && myAug[myrealm]!=null){
         myAug[myrealm]=myAug[myrealm]+'<br/>'+Aug+'</a>';
        }
    if (Aug!=null && myAug[myrealm]==null){
         myAug[myrealm]=Aug+'</a>';
        }   
      ToStorage('myAug',  myAug);
    
     //сент
    Sept = JSON.parse( window.localStorage.getItem('Sept') );
      mySept = JSON.parse( window.localStorage.getItem('mySept') );
           if (mySept==null){
         mySept={};
       } 
       if (Sept!=null && mySept[myrealm]!=null){
         mySept[myrealm]=mySept[myrealm]+'<br/>'+Sept+'</a>';
        }
     if (Sept!=null && mySept[myrealm]==null){
         mySept[myrealm]=Sept+'</a>';
        }   
      ToStorage('mySept',  mySept);
     //окт
    Oct = JSON.parse( window.localStorage.getItem('Oct') );
      myOct = JSON.parse( window.localStorage.getItem('myOct') );
             if (myOct==null){
         myOct={};
       } 
       if (Oct!=null && myOct[myrealm]!=null){
         myOct[myrealm]=myOct[myrealm]+'<br/>'+Oct+'</a>';
        }
    if (Oct!=null && myOct[myrealm]==null){
         myOct[myrealm]=Oct+'</a>';
        }  
      ToStorage('myOct',  myOct);
    
     //Nov
   Nov = JSON.parse( window.localStorage.getItem('Nov') );
      myNov = JSON.parse( window.localStorage.getItem('myNov') );
              if (myNov==null){
         myNov={};
       } 
       if (Nov!=null && myNov[myrealm]!=null){
         myNov[myrealm]=myNov[myrealm]+'<br/>'+Nov+'</a>';
        }
    if (Nov!=null && myNov[myrealm]==null){
         myNov[myrealm]=Nov+'</a>';
        } 
      ToStorage('myNov',  myNov);
    
    //Dec
   Dec = JSON.parse( window.localStorage.getItem('Dec') );
      myDec = JSON.parse( window.localStorage.getItem('myDec') );
          if (myDec==null){
         myDec={};
       } 
       if (Dec!=null && myDec[myrealm]!=null){
         myDec[myrealm]=myDec[myrealm]+'<br/>'+Dec+'</a>';
        }
    if (Dec!=null && myDec[myrealm]==null){
         myDec[myrealm]=Dec+'</a>';
        }  
      ToStorage('myDec',  myDec);
    localStorage.removeItem("Jan");
      localStorage.removeItem("Feb");
      localStorage.removeItem("Mar");
      localStorage.removeItem("Apr");
      localStorage.removeItem("May");
      localStorage.removeItem("June");
      localStorage.removeItem("July");
      localStorage.removeItem("Aug");
      localStorage.removeItem("Sept");
      localStorage.removeItem("Oct");
      localStorage.removeItem("Nov");
      localStorage.removeItem("Dec");
         
    }
        }  
            })
            
  k=k+1;
   }
   
alert('Добавлено '+m+' плант.');
   })
    var panel5 = $('<fieldset><legend>Добавление плантаций для напоминалки</legend></fieldset>');
            panel5.append(idplant).append(sbros);
               $('.unit-list-2014').wrap($('<form id="js-multisale-form" />')).after(panel5);
  }
}
//************************************************************************************************************  
 //******************вывод ссылок по месяцам*****************************************************************
  
 	if (ttt[8] == "dashboard"){

    myJan = JSON.parse( window.localStorage.getItem('myJan') );
   myFeb = JSON.parse( window.localStorage.getItem('myFeb') );
   myMar = JSON.parse( window.localStorage.getItem('myMar') );
   myApr = JSON.parse( window.localStorage.getItem('myApr') );
   myMay = JSON.parse( window.localStorage.getItem('myMay') );
  myJune = JSON.parse( window.localStorage.getItem('myJune') );
   myJuly = JSON.parse( window.localStorage.getItem('myJuly') );
   myAug = JSON.parse( window.localStorage.getItem('myAug') );
   mySept = JSON.parse( window.localStorage.getItem('mySept') );
   myOct = JSON.parse( window.localStorage.getItem('myOct') );
   myNov = JSON.parse( window.localStorage.getItem('myNov') );
     myDec = JSON.parse( window.localStorage.getItem('myDec') );
    if (myJan==null && myFeb==null && myMar==null && myApr==null && myMay==null && myJune==null && myJuly==null && myAug==null && mySept==null && myOct==null && myNov==null &&  myDec==null) {
             z='Добавьте плантации в локальное хранилище';  
 }
    else{
 if (myJan[myrealm]==null && myFeb[myrealm]==null && myMar[myrealm]==null && myApr[myrealm]==null && myMay[myrealm]==null && myJune[myrealm]==null && myJuly[myrealm]==null && myAug[myrealm]==null && mySept[myrealm]==null && myOct[myrealm]==null && myNov[myrealm]==null &&  myDec[myrealm]==null) {
             z='Добавьте плантации в локальное хранилище';  
 }
else{
   var chislo= parseInt($('div.date_time').text().replace(/\s/g, ""));
  //получаем месяц
  var mes= ($('div.date_time').text().replace(/\w/g, "").replace(/\г\./g, "").replace(/\s/g, "").replace(/\::/g, ""));
console.log(chislo)
console.log(mes)
  /* chislo=27
  mes="июля";*/
switch (mes) {
  case "января": {
     if (chislo+7 >  31) {
 
   
       myFeb = JSON.parse( window.localStorage.getItem('myFeb') );
          if (myFeb[myrealm]==null) myFeb[myrealm]='Менять не нужно';
       var z= myFeb[myrealm];
            
    
  }
   else {   
    z= "Менять не нужно";
  }
     break;
  }
    
 case "февраля": {
     if (chislo+7 >  28) {
   
   
       myMar = JSON.parse( window.localStorage.getItem('myMar') );
          if (myMar[myrealm]==null) myMar[myrealm]='Менять не нужно';
       var z= myMar[myrealm];
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }   
    
  case "марта": {
     if (chislo+7 >  31) {
    
       myApr = JSON.parse( window.localStorage.getItem('myApr') );
          if (myApr[myrealm]==null) myApr[myrealm]='Менять не нужно';
       var z= myApr[myrealm];
            
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }  
    
case "апреля": {
     if (chislo+7 >  30) {
    
       myMay = JSON.parse( window.localStorage.getItem('myMay') );
          if (myMay[myrealm]==null) myMay[myrealm]='Менять не нужно';
       var z= myMay[myrealm];
            
  
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }    
    
    
 case "мая": {
     if (chislo+7 >  31) {
    
       myJune = JSON.parse( window.localStorage.getItem('myJune') );
          if (myJune[myrealm]==null) myJune[myrealm]='Менять не нужно';
       var z= myJune[myrealm];
            
  
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }   
    
 case "июня": {
     if (chislo+7 >  30) {
    
        myJuly = JSON.parse( window.localStorage.getItem('myJuly') );
          if ( myJuly[myrealm]==null) myJuly[myrealm]='Менять не нужно';
       var z=  myJuly[myrealm];
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }   
    
case "июля": {
     if (chislo+7 >  31) {
    
    
           myAug = JSON.parse( window.localStorage.getItem('myAug') );
          if ( myAug[myrealm]==null) myAug[myrealm]='Менять не нужно';
       var z=  myAug[myrealm];
                    
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }    
    
 case "августа": {
     if (chislo+7 >  31) {
    
        
         mySept = JSON.parse( window.localStorage.getItem('mySept') );
          if (mySept[myrealm]==null) mySept[myrealm]='Менять не нужно';
       var z=  mySept[myrealm];
                
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }
    
    
  case "сентября": {
     if (chislo+7 >  30) {
    
 
         
         myOct = JSON.parse( window.localStorage.getItem('myOct') );
          if ( myOct[myrealm]==null)  myOct[myrealm]='Менять не нужно';
       var z=   myOct[myrealm];
               
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }  
    
  case "октября": {
     if (chislo+7 >  31) {
    
   
         myNov = JSON.parse( window.localStorage.getItem('myNov') );
          if ( myNov[myrealm]==null)  myNov[myrealm]='Менять не нужно';
       var z=   myNov[myrealm];
            
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }  
    
  case "ноября": {
     if (chislo+7 >  30) {
    
   
         myDec = JSON.parse( window.localStorage.getItem('myDec') );
          if ( myDec[myrealm]==null)  myDec[myrealm]='Менять не нужно';
       var z=   myDec[myrealm];
            
            
            
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }  
    
    
    case "декабря": {
     if (chislo+7 >  31) {
       myJan = JSON.parse( window.localStorage.getItem('myJan') );  
          if (myJan[myrealm]==null) myJan[myrealm]='Менять не нужно';
       var z= myJan[myrealm]; 
  }
 
  else {   
    z= "Менять не нужно";
  }
    
    break;
  }
   default: 
	   
	    break; 
    
  };
    }
  }

  $('div.metro_header').after('<div id="spec" align="center" style="background:#f4fdf0; float:left;margin-left:20px; width:45%; border: 1px solid black; border-radius:10px; -moz-border-radius:5px;">'+
                  '<div align="center" ><p style="color:green; font-size: 12pt;">Смена специализаций на плантациях</p></div>'    +   
                           '<div style="border: 1px solid black;"></div>'+
      
    //для спецух                        
                            '<div  align="center" style="font-size: 11pt;">'+z+'</div>'   +            
                            
                            
                            ' </div>');  
  
 // для напоминания платных услуг
  
  
  		$(document).ready(function(){
       
    
  var Murlik1= prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/pay_service/manage';
   $.ajax({ url:Murlik1, 
        async: false,
        type: 'post',
        success: function(data){
            var plusl= $("table[class='list payservice']>tbody>tr", data);
    var   pluslvst="";
     //console.log(plusl)
      if (plusl.length==0){
        pluslvst='<tr><td>Платных услуг не подключено</td></tr>';
      }
      else {
      for(k=1; k< plusl.length;  k++){
     var nameusl=$('td[class="payicon nowrap"]>img',plusl[k]).attr('title');
     var hodusl=$('td[class="nowrap payusage"]',plusl[k]).text();
    if (hodusl<5){
        pluslvst=pluslvst+'<tr style="color:red;"><td>'+nameusl+'</td><td>'+hodusl+'</td></tr>' 
    }
        else{
       pluslvst=pluslvst+'<tr><td>'+nameusl+'</td><td>'+hodusl+'</td></tr>' 
        }
      }
    }
     // console.log(pluslvst)
     
       var ekostrannap=JSON.parse( window.localStorage.getItem('ekostrannap') );
       dlaeko100='';
      if (ekostrannap!=null){
      if (ekostrannap[myrealm]!=null){
   
   var ekoss=ekostrannap[myrealm];
        ekoss=ekoss.slice(0, -1);
        ekoss=ekoss.split(';')
        for (h=0; h<ekoss.length; h++){
        $.ajax({ url:ekoss[h], 
        async: false,
        type: 'post',
        success: function(data){
          var ekostrananame=$('div#headerInfoCenter>h1>img', data).attr('title');
          var eko100hod=parseInt($('img[title="Экологический стандарт – 100"]', data).next().text());
        if (eko100hod<5){
        dlaeko100=dlaeko100+'<tr style="color:red;"><td>Эко-100 '+ekostrananame+'</td><td>'+eko100hod+'</td></tr>' 
    }
        else{
       dlaeko100=dlaeko100+'<tr><td>Эко-100 '+ekostrananame+'</td><td>'+eko100hod+'</td></tr>' 
        }
        }
    })
         }
      }
      }
      $(' div#spec').after('<div align="center" style="background:#f4fdf0; float:left;margin-left:45px;  width:45%; border: 1px solid black; border-radius:10px; -moz-border-radius:5px;">'+
                  '<div align="center" ><p style="color:green; font-size: 12pt;">Окончание платных услуг</p></div>'    +   
                           '<div style="border: 1px solid black;"></div>'+
                             '<div  align="center" style="font-size: 11pt;">'+ 
                           '<table>'+
                           pluslvst+
                           dlaeko100+
                          '</table></div>'+
                                

                            ' </div>');      	      

  
  
  
  
  
  
    }  
   })
})
  }
  //*************************************добавление эко100
  	if (ttt[6] == "citylist"){
     $('img[title="Экологический стандарт – 100"]').click(function(){
       var ekostrannap=JSON.parse( window.localStorage.getItem('ekostrannap') );
        if (ekostrannap==null)  {
          ekostrannap={};
        }
        if (ekostrannap[myrealm]==null)  {
          ekostrannap[myrealm]='';
        }
                             var ekostranassilka=   window.location.href;
       var ekostrananame=$('div#headerInfoCenter>h1>img').attr('title');
       alert('Эко-100 в стране "'+ekostrananame+'" добавлено для напоминания!')
       ekostrannap[myrealm]=ekostrannap[myrealm]+ekostranassilka+';';
  //     alert(ekostranassilka)
    //   alert(ekostrananame)
   ToStorage('ekostrannap',  ekostrannap);
       
                                                          })
    }
  //*************************************оповещение сообщением
   	if (ttt[8] == "unit_list"){
       myrealmkyk = readCookie('last_realm');
    var    otsoob = getCookie(myrealmkyk);
      idsoob=$('div.data>span.name>a').attr('href');
      idsoob=idsoob.split('/')
     // alert(idsoob[7])
  //  alert(otsoob);
   
  if (otsoob !=1){  //не проверяли сегодня
   //***********проверка смены специализаций 
 var chislo= parseInt($('div.date_time').text().replace(/\s/g, ""));
  //получаем месяц
  var mes= ($('div.date_time').text().replace(/\w/g, "").replace(/\г\./g, "").replace(/\s/g, "").replace(/\::/g, ""));
console.log(chislo)
console.log(mes)
/*  chislo=27
  mes="июня";*/
switch (mes) {
  case "января": {
     if (chislo+7 >  31) {
 
   
       myFeb = JSON.parse( window.localStorage.getItem('myFeb') );
       if (myFeb!=null){
          if (myFeb[myrealm]!=null){
         var otprp=   myFeb[myrealm]; 
               var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
       }
  }
  
     break;
  }
    
 case "февраля": {
     if (chislo+7 >  28) {
   
   
       myMar = JSON.parse( window.localStorage.getItem('myMar') );
        if (myMar!=null) {
          if (myMar[myrealm]!=null) {
            var otprp=   myMar[myrealm];  
                         var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }      
        }    
  }
    
    break;
  }   
    
  case "марта": {
     if (chislo+7 >  31) {
    
       myApr = JSON.parse( window.localStorage.getItem('myApr') );
         if (myApr!=null){
       if (myApr[myrealm]!=null){
           var otprp=   myApr[myrealm];  
                       var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
         }   
  }
 
    break;
  }  
    
case "апреля": {
     if (chislo+7 >  30) {
    
       myMay = JSON.parse( window.localStorage.getItem('myMay') );
          if (myMay[myrealm]!=null){
       if (myMay[myrealm]!=null){
   var otprp=   myMay[myrealm];  
                      var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
       }
  }
     }
    break;
  }    
    
    
 case "мая": {
     if (chislo+7 >  31) {
    
       myJune = JSON.parse( window.localStorage.getItem('myJune') );
        if (myJune!=null){
       if (myJune[myrealm]!=null){
         var otprp=   myJune[myrealm];  

                      var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          } 
  }
 }
    break;
  }   
    
 case "июня": {
     if (chislo+7 >  30) {
    
        myJuly = JSON.parse( window.localStorage.getItem('myJuly') );
          if ( myJuly!=null){
       if ( myJuly[myrealm]!=null){
          var otprp=   myJuly[myrealm];     
                       var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
       }
            
  }
     }
    break;
  }   
    
case "июля": {
     if (chislo+7 >  31) {
    
    
           myAug = JSON.parse( window.localStorage.getItem('myAug') );
                if ( myAug!=null) {
       if ( myAug[myrealm]!=null) {
                   var otprp=   myAug[myrealm];     

                       var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
                }
                }
    break;
  }    
    
 case "августа": {
     if (chislo+7 >  31) {
    
        
         mySept = JSON.parse( window.localStorage.getItem('mySept') );
          if (mySept!=null) {
            
       if (mySept[myrealm]!=null) {
               var otprp=   mySept[myrealm];     

                      var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
                
  }
     }
    break;
  }
    
    
  case "сентября": {
     if (chislo+7 >  30) {
    
 
         
         myOct = JSON.parse( window.localStorage.getItem('myOct') );
     if ( myOct!=null)  {
       if ( myOct[myrealm]!=null)  {
                         var otprp=   myOct[myrealm];     

                      var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
     }   
  }
 
  
    break;
  }  
    
  case "октября": {
     if (chislo+7 >  31) {
    
   
         myNov = JSON.parse( window.localStorage.getItem('myNov') );
           if ( myNov!=null)  {
       if ( myNov[myrealm]!=null)  {
                           var otprp=   myNov[myrealm];     

                       var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
           }    
            
  }
 

    break;
  }  
    
  case "ноября": {
     if (chislo+7 >  30) {
    
   
         myDec = JSON.parse( window.localStorage.getItem('myDec') );
        if ( myDec!=null) {
       if ( myDec[myrealm]!=null) {
          var otprp=   myDec[myrealm];     

                      var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
            
        }       
            
  }
 
    break;
  }  
    
    case "декабря": {
     if (chislo+7 >  31) {
       myJan = JSON.parse( window.localStorage.getItem('myJan') );  
         if (myJan!=null) {
       if (myJan[myrealm]!=null) {
                    var otprp=   myJan[myrealm];     
                   var tema="Напоминалка: Смена специализаций ";
var soob='<tr><td colspan="2">На следующих плантациях возможна смена специализации:<br>'+otprp+'</td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
          }
  }
     }
    break;
  }
   default: 
	   
	    break; 
    
  };
    //*************************проверка платных услуг
     var Murlplusl= prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/pay_service/manage';
   $.ajax({ url:Murlplusl, 
        async: false,
        type: 'post',
        success: function(data){
           var plusl= $("table[class='list payservice']>tbody>tr", data);
    var   pluslvst="";
     //console.log(plusl)
      if (plusl.length!=0){
           for(k=1; k< plusl.length;  k++){
     var nameusl=$('td[class="payicon nowrap"]>img',plusl[k]).attr('title');
     var hodusl=$('td[class="nowrap payusage"]',plusl[k]).text();
    if (hodusl==1){
          var tema="Напоминалка: окончание услуги "+nameusl;
var soob='<tr><td colspan="2">До окончания услуги "'+nameusl+'" осталося 1 ход!<br>Для продления посетите ссылку: <a href='+Murlplusl+'>Эксклюзив</a></td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
    }
       
      }
      }
        }
          })
    
    
    
    
    //**************************проверка Эко-100
          var ekostrannap=JSON.parse( window.localStorage.getItem('ekostrannap') );
      
      if (ekostrannap!=null){
      if (ekostrannap[myrealm]!=null){
   
   var ekoss=ekostrannap[myrealm];
        ekoss=ekoss.slice(0, -1);
        ekoss=ekoss.split(';')
        for (h=0; h<ekoss.length; h++){
        $.ajax({ url:ekoss[h], 
        async: false,
        type: 'post',
        success: function(data){
          var ekostrananame=$('div#headerInfoCenter>h1>img', data).attr('title');
          var eko100hod=parseInt($('img[title="Экологический стандарт – 100"]', data).next().text());
        if (eko100hod==2){
     
  var tema="Напоминалка: Эко-100 "+ekostrananame;
var soob='<tr><td colspan="2">До окончания Эко-100 в стране "'+ekostrananame+'" осталось 2 хода!<br>Ссылка на регион: <a href='+ekoss[h]+'>'+ekostrananame+'</a></td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })

    }
     if (eko100hod==1){
         var tema="Напоминалка: Эко-100 "+ekostrananame;
var soob='<tr><td colspan="2">До окончания Эко-100 в стране "'+ekostrananame+'" осталося 1 ход!<br>Ссылка на регион: <a href='+ekoss[h]+'>'+ekostrananame+'</a></td></tr>';
   var Murlsoob=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/message/compose/'+idsoob[7];
  var  fff="messageData%5Bprev%5D=&external=&messageData%5Bto%5D%5B%5D="+idsoob[7]+"&messageData%5Bsubject%5D="+tema+"&messageData"+
"%5Bbody%5D="+soob;
  
  
  
  $.ajax({  url:Murlsoob, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){                      
                 }
                })
   
    }
        }
    })
         }
        
      }
      }
   //****************************** запись кука
    
  if (myrealmkyk=="vera"){
    var intervalper=75600000;// вера
     var Chas=0//вера

  }
      if (myrealmkyk=="lien"){
    var intervalper=82800000;//лена
    var Chas=9//лена
  }
      if (myrealmkyk=="olga"){
    var intervalper=75600000;// ольга
    var Chas=23//ольга
  }
 
var date = new Date();
   
  var  currentTimeZoneOffsetInHours = -date.getTimezoneOffset()/60
  date.setHours(date.getHours()-currentTimeZoneOffsetInHours)
 var dateMsec = date.getTime()
 date.setDate(date.getDate()+1)
date.setHours(Chas, 0, 0, 0);
var interval = date.getTime()-dateMsec;
if (interval > intervalper){
     date = new Date();
   currentTimeZoneOffsetInHours = -date.getTimezoneOffset()/60
  date.setHours(date.getHours()-currentTimeZoneOffsetInHours)
  date.setHours(Chas, 0, 0, 0);
//  alert ('2 механизм')
}
    interval = date.getTime()-dateMsec;
    var expires = new Date(); // получаем текущую дату
      expires.setTime(expires.getTime()+interval+30*60*1000); // срок - +30 мин после начала пересчета
   document.cookie = myrealmkyk+"=1; expires=" + expires.toGMTString() +  "; path=/";
 //   alert (expires.toGMTString())
   // alert ("Проверено 1")
  }
/*      else {
         alert ("Уже проверяли")
      }*/
     
      
    }
  //******************************обработчик сообщений
   	if (ttt[9] == "inbox"){


      var  mytema=$('tr.odd:contains("Напоминалка:")');
          if (mytema.length==1){
    var  mysoob=$('tr.odd:contains("Содержание")').next().text();
     // console.log(mysoob)
        $('tr.odd:contains("Содержание")').next().replaceWith(mysoob);
      }
    }
}
  
  if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}


