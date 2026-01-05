// ==UserScript==
// @name         Оптимизация налоговых выплат FactorNew
// @namespace   Оптимизация налоговых выплат
// @version 	   1.1
// @description   Оптимизация налоговых выплат
// @include       http://virtonomic*.*/*/main/geo/regionENVD/*
// @include       http://virtonomic*.*/*/main/geo/regionlist/*
// @include       http://virtonomic*.*/*/main/geo/countrydutylist/*
// @include       http://virtonomic*.*/*/main/common/main_page/game_info/world
// @include        http://virtonomic*.*/*/main/unit/view/*/sale

// @downloadURL https://update.greasyfork.org/scripts/17345/%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%D1%8B%D1%85%20%D0%B2%D1%8B%D0%BF%D0%BB%D0%B0%D1%82%20FactorNew.user.js
// @updateURL https://update.greasyfork.org/scripts/17345/%D0%9E%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%D1%8B%D1%85%20%D0%B2%D1%8B%D0%BF%D0%BB%D0%B0%D1%82%20FactorNew.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
  $(document).ready(function () {
     var strn=window.location.href;
  strn=strn.split("/")
 console.log(strn)
  //записываем envd**************************
  if (strn[6]=='regionENVD'){
     localStorage.removeItem("envd");
   var envd={};
 var tr=$('table.list>tbody>tr.odd, tr.even');
  //console.log(tr.length)
    for (i=0; i<tr.length; i++){
 var td=$('td:has(img)', tr[i]);
     //   console.log(td.length)
      for(z=0; z<td.length; z++){
        var name=$(td[z]).next().text();
        //    console.log(name)
            var proc=parseInt($(td[z]).next().next().text().replace(/\s/g, ""));
     //   console.log(proc)
        envd[name]=proc;
         localStorage.setItem("envd",  JSON.stringify(envd));
      }
      
      
    }
   // console.log(envd)
  }
    //налог на прибыль в регионе
   if (strn[6]=='regionlist'){
   var regnal = JSON.parse(localStorage.getItem("regnal"));
   var foroptstr=JSON.parse(localStorage.getItem("foroptstr"));
 // console.log(regnal)
     if (regnal==null) regnal={};
     if (foroptstr==null) foroptstr={};
var trreg=$('table.grid>tbody>tr.even, tr.odd');
    // console.log(trreg.length)
     var nameregforopt="";
     for (i=0; i<trreg.length; i++){
     var  namereg=$('td:eq(0)>a', trreg[i]).text();
      var procreg=parseInt($('td:eq(3)', trreg[i]).text());
      // console.log(namereg)
        //console.log(procreg)
        regnal[namereg]=procreg;
       nameregforopt=nameregforopt+namereg+';';
        localStorage.setItem("regnal",  JSON.stringify(regnal));
     }
     var nameforoptstr=$('div#headerInfoCenter>h1').text();
      nameregforopt=nameregforopt.slice(0,-1) ;
     foroptstr[nameforoptstr]= nameregforopt;
      localStorage.setItem("foroptstr",  JSON.stringify(foroptstr));
     console.log(foroptstr)
   }
    // сбор экс имп иц
       if (strn[6]=='countrydutylist'){
         var expstran = JSON.parse(localStorage.getItem("expstran"));
         var impstran = JSON.parse(localStorage.getItem("impstran"));
         var icstran = JSON.parse(localStorage.getItem("icstran"));
         var namestrani=$('div#headerInfoCenter>h1:eq(0)').text();
         //console.log(namestrani)
         if (expstran==null) expstran={};
         if (impstran==null) impstran={};
          if (icstran==null) icstran={};
        // console.log(expstran)
var trstran=$('div#mainContent>table.list>tbody>tr.odd, tr.even');
       //  console.log(trstran.length)
          expstran[namestrani]={};
          impstran[namestrani]={};
          icstran[namestrani]={};
          for (i=0; i<trstran.length; i++){
         var tdstran=$('td:has(img)', trstran[i]);
        //  console.log(tdstran.length)
        for(z=0; z<tdstran.length; z++){
        var nameprodstran=$(tdstran[z]).next().text();
        //    console.log(name)
            var exp=parseInt($(tdstran[z]).next().next().text().replace(/\s/g, ""));
             var imp=parseInt($(tdstran[z]).next().next().next().text().replace(/\s/g, ""));
            var ic=parseFloat($(tdstran[z]).next().next().next().next().text().replace(/\s/g, "").replace(/\$/g, ""));
     
         expstran[namestrani][nameprodstran]=exp;
         impstran[namestrani][nameprodstran]=imp;
          icstran[namestrani][nameprodstran]=ic;
                 localStorage.setItem("expstran",  JSON.stringify(expstran));
                  localStorage.setItem("impstran",  JSON.stringify(impstran));
                localStorage.setItem("icstran",  JSON.stringify(icstran));
          
          /*console.log(nameprodstran)
          console.log(exp)
        console.log(imp)
         console.log(ic)*/
   
      }
            
          }
         //console.log(expstran)
         // console.log(impstran)
         //  console.log(icstran)
            }
    //****проверка на странице всех стран
    if (strn[8]=='world'){
    $('div#mainContent>div.cfx>div.content').after('<div><input id="dialog" type="button" value="Посмотреть записанные дананные по странах"><input id="removedan" type="button" value="Очистить данные">')
   $('#removedan').click(function() {
     localStorage.removeItem("envd");
     localStorage.removeItem("regnal");
     localStorage.removeItem("expstran");
     localStorage.removeItem("impstran");
     localStorage.removeItem("icstran");
     localStorage.removeItem("foroptstr");
    
   })
    $('#dialog').click(function() {
       var regnal = JSON.parse(localStorage.getItem("regnal"));
       var envd = JSON.parse(localStorage.getItem("envd"));
       var expstran = JSON.parse(localStorage.getItem("expstran"));
         var impstran = JSON.parse(localStorage.getItem("impstran"));
         var icstran = JSON.parse(localStorage.getItem("icstran"));
       if (regnal==null) {
       var  regnaluk="Нет данных.";
       }
       else{
         regnaluk=Object.keys(regnal).length+' регионов.';
       }
       if (envd==null) {
       var  envduk="Нет данных.";
       }
       else{
         envduk='Данные записаны.';
       }
       if (expstran==null) {
       var  expstranuk="Нет данных.";
       }
       else{
         expstranuk=Object.keys(expstran).length+' стран.';
       }
        if (impstran==null) {
       var  impstranuk="Нет данных.";
       }
       else{
         impstranuk=Object.keys(impstran).length+' стран.';
       }
        if (icstran==null) {
       var  icstranuk="Нет данных.";
       }
       else{
         icstranuk=Object.keys(icstran).length+' стран.';
       }
       
   $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100001; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
	    $('<div id="js-progress" style=" background-color: #fcfbc0; height: 50%; width:50%; left:25%; top:25%;   position: fixed; color: black;  z-index: 1000000; font-size: 40pt; text-align: center;" >'+
        
        
        'Налоги: '+regnaluk+ '<br>ЕНВД: '+envduk+'<br>Экспорт: '+expstranuk+'<br>Импорт: '+impstranuk+'<br>ИЦ: '+icstranuk+'</div>').prependTo('body');
    
        
  
       
       
    $('div#js-wall').click(function(){
      
        $('#js-progress').remove();
     $('#js-wall').remove();
      
    })
     
     
       
       
       
     })
    }
    //***** расчет налогов на предпр************************
    if (strn[8]=='sale'){
   $('table.grid>tbody>tr:eq(0)>th:last-child').after('<th>Расчет налогов</th>')
   
    var trsb=$('table.grid>tbody>tr.odd:visible, tr.even:visible');
     // console.log(trsb.length)
    for(i=0; i< trsb.length; i++) {
    
  $('td:contains("Максимальный объем:")', trsb[i]).after('<td><input class="sbit" type="button" value="Экономия"></td>');

		}
      var zavod=$('div#unitImage>img').attr('src')
      zavod=zavod.split('/');
      zavod=zavod[4].slice(0,-6)
      //*****если завод то добавляем ЕНВД
      if (zavod=='workshop'){
         
         for(i=0; i< trsb.length; i++) {
    
  $('td>input.sbit', trsb[i]).after('<input class="sbit2" type="button" value="ЕНВД">');

		}
    $('.sbit2').click(function(){
       var regnal = JSON.parse(localStorage.getItem("regnal"));
         var envd = JSON.parse(localStorage.getItem("envd"));
         var expstran = JSON.parse(localStorage.getItem("expstran"));
         var impstran = JSON.parse(localStorage.getItem("impstran"));
         var icstran = JSON.parse(localStorage.getItem("icstran"));
        var td = $(this).parent().parent();
      var provcena=$('input.money:eq(0)', td).attr('value');
  //    alert(provcena)
      var kola=$('div.officePlace>a');
    //  console.log(kola.length)
      if (kola.length==3){
         var nameregsb=$('div.officePlace>a:eq(1)').text();
       console.log(nameregsb)
      }
      if (kola.length==4){
         var nameregsb=$('div.officePlace>a:eq(2)').text();
        console.log(nameregsb)
      }
     
          if (regnal[nameregsb]==null){
            alert ('Нет данных по налогу');
    return;
          } 
      
      if (provcena==0){
        var u=0;
      }
      else{
        u=1;
      }
      var nameprodsb=$('td:has(a):eq('+u+')',td).attr('title');
   nameprodsb=nameprodsb.slice(0,-58);
  if (envd[nameprodsb]==null){
    
    alert ('Нет данных по ЕНВД');
    return;
  }
        var sssb=parseFloat($('td.nowrap>table>tbody>tr>td:contains("Себестоимость")', td).next().text().replace(/\s/g, "").replace(/\$/g, ""));
 
     // console.log(sssb)
     // console.log(envd[nameprodsb])
    //  console.log(regnal[nameregsb])
      
    var  pricesb=sssb+sssb*(envd[nameprodsb]/100)-0.02;
 pricesb=Math.round(pricesb * 100) / 100 ;
    $('td>input.money', td).val(pricesb)
    })
 
    
    }
        //********расчет для перевозки в другие страны
        $('.sbit').click(function(){
         var regnal = JSON.parse(localStorage.getItem("regnal"));
         var envd = JSON.parse(localStorage.getItem("envd"));
         var expstran = JSON.parse(localStorage.getItem("expstran"));
         var impstran = JSON.parse(localStorage.getItem("impstran"));
         var icstran = JSON.parse(localStorage.getItem("icstran"));
        var td = $(this).parent().parent();
          var provcena=$('input.money:eq(0)', td).attr('value');
  if (provcena==0){
        var u=0;
      }
      else{
        u=1;
      }
      var nameprodsb=$('td:has(a):eq('+u+')',td).attr('title');
   nameprodsb=nameprodsb.slice(0,-58);
         
 /* if (envd[nameprodsb]==null){
    
    alert ('Нет данных по ЕНВД');
    return;
  }*/
  var kola=$('div.officePlace>a');        
        if (kola.length==3){
         var nameregsb=$('div.officePlace>a:eq(1)').text();
      //  console.log(nameregsb)
      }
      if (kola.length==4){
         var nameregsb=$('div.officePlace>a:eq(2)').text();
      //  console.log(nameregsb)
      }   
        
         var namestransb=$('div.officePlace>a:eq(1)').text();
   //    console.log(namestransb)
    if (regnal[nameregsb]==null){
    
    alert ('Нет данных по налогу');
    return;
  }
           if (expstran[namestransb][nameprodsb]==null){
    
    alert ('Нет данных по экспорту');
    return;
  }
           if (impstran[namestransb][nameprodsb]==null){
    
    alert ('Нет данных по экспорту');
    return;
  }
           if (icstran[namestransb][nameprodsb]==null){
    
    alert ('Нет данных по экспорту');
    return;
  }
            var sssb=parseFloat($('td.nowrap>table>tbody>tr>td:contains("Себестоимость")', td).next().text().replace(/\s/g, "").replace(/\$/g, ""));
                   /* console.log('налог региона='+regnal[nameregsb])
    console.log('экспорт='+expstran[namestransb][nameprodsb])
      console.log('импорт='+impstran[namestransb][nameprodsb])
         console.log('иц='+icstran[namestransb][nameprodsb])*/
       //   console.log(sssb)
          var optreg="";
       //   foroptstr
           var foroptstr = JSON.parse(localStorage.getItem("foroptstr"));
      var optstran="";
       for (var key in foroptstr){
         if (optstran==""){
         optstran=optstran+'<option selected="selected" class="strana" >'+key+'</option>';
         var  namestransb2=key;
             console.log( namestransb2) 
           
          //***************************
           var vremennai=foroptstr[namestransb2];
             
           vremennai=vremennai.split(';');
             for (l=0; l< vremennai.length; l++){
         if (optreg==""){
         optreg=optreg+'<option selected="selected" class="region" >'+vremennai[0]+'</option>';
         var  namereg2=vremennai[0];
         }
         else {
           optreg=optreg+'<option class="region">'+vremennai[l]+'</option>';
         }
       }
         //******************
         }
         else {
           optstran=optstran+'<option class="strana">'+key+'</option>';
         }
       }
          
          
         
          
          
          

          $('<div id="js-wall"  style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100001; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
	    $('<div id="js-progress" align="center" style=" background-color: #e6e6e0; left:25%; top:25%;  position: fixed; color: black;  z-index: 1000000; font-size: 12pt; text-align: center;" >'+
          '<div  align="center" style="width:300px; float:left; margin: 5px; background-image:linear-gradient(to top, #b9f8c2, #49f761); border-radius:20px;-moz-border-radius:20px; padding:5px;"><table id="rass1"'+ 
                                     'style="border-collapse: collapse;"><tr><th colspan="2" class="str1">Из</th></tr>'+
                                     '<tr><td class="str1">Страна</td><td class="str1">'+namestransb+'</td></tr>'+
                                     '<tr><td class="str1"> Регион</td><td class="str1">'+nameregsb+'</td></tr>'+
                                     '<tr><td class="str1">Налог на прибыль</td><td class="str1">'+regnal[nameregsb]+'%</td></tr>'+
                                     '<tr><td class="str1">Продукт</td><td class="str1">'+nameprodsb+'</td></tr>'+
                                     '<tr><td class="str1">Иц</td><td id="icdalras" class="str1">'+icstran[namestransb][nameprodsb]+'</td></tr>'+
                                       '<tr><td class="str1">Экспорт</td><td id="export" class="str1">'+expstran[namestransb][nameprodsb]+'%</td>'+
                                     
                                     
                                     '</table></div><div align="center" style="width:500px;  margin: 5px; float:left; background-image:linear-gradient(to top, #b9f8c2, #49f761); border-radius:20px;-moz-border-radius:20px; padding:5px;"><table  style="border-collapse: collapse;">'+
                                     '<tr><th colspan="2" class="str2">В</th></tr>'+
                                     '<tr><td class="str2">Страна</td><td class="str2"><select id="strana" name="strana" >'+optstran+'</select></td></tr>'+
                                     '<tr><td class="str2"> Регион</td><td class="str2"><select id="region" name="region" >'+optreg+'</select></td></tr>'+
                                     '<tr><td class="str2">Налог на прибыль</td><td id="nalog2" class="str2">'+regnal[namereg2]+'</td></tr>'+
                                     '<tr><td class="str2">Продукт</td><td class="str2">'+nameprodsb+'</td></tr>'+
                                     '<tr><td class="str2">Импорт</td><td id="import" class="str2">'+impstran[namestransb2][nameprodsb]+'%</td></tr>'+
                                     '<tr><td class="str2">Цена продажи</td><td class="str2"></td></tr>'+
                                     '</table></div><div><input id="prov" type="button" value="Посчитать"></div></div>').prependTo('body');
        
     
       
          $('td.str1, th.str1,td.str2, th.str2 ').css({  'border': '2px dotted  #818282',
                               
                                                })
    
        
 $('option.strana').click(function(){
    $("#import").replaceWith("<td id='import' class='str2'>"+impstran[this.value][nameprodsb]+"</td>");
         var vremennai=foroptstr[this.value];
           vremennai=vremennai.split(';');
   optreg="";
               for (l=0; l< vremennai.length; l++){
         
               if (optreg==""){
         optreg=optreg+'<option selected="selected" class="region" >'+vremennai[0]+'</option>';
         var  namereg2=vremennai[0];
         }
         else {
           optreg=optreg+'<option class="region">'+vremennai[l]+'</option>';
         }
       }
  //  console.log(optreg)
    $("select#region").replaceWith("<select id='region' name='region' >"+optreg+"</select></td>");
     $('option.region').click(function(){
    $("td#nalog2").replaceWith("<td id='nalog2' class='str2'>"+regnal[this.value]+"</td>");
       $('td.str1, th.str1,td.str2, th.str2 ').css({  'border': '2px dotted  #818282',
                               
                                                })
  })
    $('option.region').click();
 
  })
    
          
      //******* расчет выплат**************************************************************************************
          
          $('#prov').click(function(){
            $('table#rasschet').remove();
                    var sssb=parseFloat($('td.nowrap>table>tbody>tr>td:contains("Себестоимость")', td).next().text().replace(/\s/g, "").replace(/\$/g, ""));
        //    console.log(sssb)
            if (zavod=='workshop'){
               sssb=sssb+sssb*(envd[nameprodsb]/100)-0.02;
 sssb=Math.round(sssb * 100) / 100 ;
             }
           
var icdlaras=parseFloat($('td#icdalras').text().replace(/\%/g, ""))
 var stavtp=parseFloat($('td#export').text().replace(/\%/g, ""))+parseFloat($('td#import').text().replace(/\%/g, ""));
       stavtp=stavtp/100;  
if (sssb > icdlaras) {
var  pricedlaras=sssb;
var  pricedlaras2=icdlaras;
   var tamsbor2=pricedlaras2*stavtp;
             tamsbor2=Math.round(tamsbor2 * 100) / 100 ;
    var ssposledostposs2=pricedlaras2+tamsbor2;
            ssposledostposs2=Math.round(ssposledostposs2 * 100) / 100 ;
 var ubitok=sssb-icdlaras;
 
  var nalv=parseFloat($('td#nalog2').text().replace(/\%/g, ""))
  nalv=nalv/100;
   
  var sssponig=ubitok/(1-nalv)+ssposledostposs2;
  sssponig=Math.round(sssponig * 100) / 100 ;
  
  var ssbolic='<tr class="itog"><td >Понижение сс</td><td>'+pricedlaras2+'</td><td>'+pricedlaras2+'</td><td>'+tamsbor2+'</td><td>'+ssposledostposs2+'</td><td>'+sssponig+'</td></tr>';

}
         else {
           pricedlaras=icdlaras ;
           ssbolic="";
         }
           
   
        var tamsbor=pricedlaras*stavtp;
             tamsbor=Math.round(tamsbor * 100) / 100 ;
              var ssposledostposs=sssb+tamsbor;
            ssposledostposs=Math.round(ssposledostposs * 100) / 100 ;
           if (sssb > icdlaras) {
            var ssrazn=ssposledostposs-sssponig;
            ssrazn=Math.round(ssrazn * 100) / 100 ;
            var raznss='<tr class="itog"><td></td><td></td><td></td><td></td><td>Разница</td><td id="tdrazn">'+ssrazn+'</td></tr>';
            }
            else{
              raznss="";
            }
            $('input#prov').after('<table id="rasschet" style="margin:0 auto"><tr class="itog"><th>Способ</th><th >Цена</th><th >Цена для таможни</th><th>Таможенный сбор</th><th>СС после доставки</th><th title=" Цена отгрузки со склада, с учетом убытка при понижении сс до иц и налога в конечной стране">Итого СС</th></tr>'+
                               
                               '<tr class="itog"><td >По СС</td><td>'+sssb+'</td><td>'+pricedlaras+'</td><td>'+tamsbor+'</td><td>'+ssposledostposs+'</td><td>'+ssposledostposs+'</td></tr>'+
                            ssbolic+raznss+
                               '</table>')
          $("tr.itog").css({  'border': '1px solid #d5d7d4',
                                            'background': '#f4fa9b' ,       })
          if (ssrazn>0){
           $("td#tdrazn").css({      'background': '#82f58a' ,       })
          }
            else {
               $("td#tdrazn").css({      'background': '#fd1c1c' ,       })
            }
       })
          
    $('div#js-wall').click(function(){
      
        $('#js-progress').remove();
     $('#js-wall').remove();
      
    })  
          
          
          
          
      })
    
    }
  })
         }
  if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}