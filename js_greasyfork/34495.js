// ==UserScript==
// @name Virtonomica:Групповое качество
// @namespace      virtonomica
// @author         Незнайка Незнаев
// @version        1.1
// @description    Позволяет массово устанавливать на складе минимальный уровень качества у определённой группы закупаемых товаров.
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/34495/Virtonomica%3A%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/34495/Virtonomica%3A%D0%93%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE.meta.js
// ==/UserScript==

var run = function() {
  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
//=============================================================================================================  
///////////////////////////////////////////////////////////////////////////
		//function getType()
		//возвращает тип в виде строки  (по изображению)
		/////////////////////////////////////////////////////////////////////////////
		function get_Type_Podrazd(){
			
      var Type_Podrazd =  $('.tabu li:eq(1)').text();
      
			if(Type_Podrazd=='') return 'unknown';
			
			Type_Podrazd = Type_Podrazd.match(/[А-я]*[а-я]/);
      
      return Type_Podrazd;
		}//end getType()
		///////////////////////////////////////////////////////////////////////////  
//=============================================================================================================
/////////////////////////////////////////////////////////////////////////////
//вывод окна установки общего качества
  function show_quality_form_all(item, obrazec)
  {
  	var quality_fild = $(item).parent().children('input');
	  var coords = $(item).position();
	  var bbb;
	  var NumTmpVal;
	  var TmpVal;
    var form = $('.ord_constraint_quality');

	  var inputs = $(form.children('input'));

	  $(inputs[0]).attr("value", $(quality_fild).attr("value"));

	  $(inputs[1]).unbind();
	  $(inputs[1]).click(function(){
      
		  var val = parseFloat($(inputs[0]).attr("value"));
		  val = isNaN(val) ? 0 : (val < 1 ? 0 : val);// если значение цифровое и больше 1, то присваиваем его переменной
		  $(quality_fild).attr("value", val);
		  $(item).text(val ? val : '=');// если значение больше 1, то отображаем его, в противном случае выводим '='
		  $(this).parent().css({display:"none"});
		  
		  $('table.list tr:gt(0)').each(function () {

	      var Tip_Classa = $(this);	      
			  var flag = 0;
			  
			  if (Tip_Classa.hasClass("p_title")){
			  
				  TmpVal = $('td', this).slice(-3,-2).text();
				  NumTmpVal = parseFloat($('td', this).slice(-3,-2).text());

			  }//end if (aaa.hasClass("p_title"))

			  if (Tip_Classa.hasClass(obrazec)){	
				  var znachenie = $('td', this).slice(-3,-2).text();				

				  if (znachenie != TmpVal){ 					

				    var tag_a = $('td', this).slice(-3,-2).find('a');

				    tag_a.text(TmpVal);

				    var inp = $("input[name^='supplyContractData']:eq(5)", this);

				    inp.val(NumTmpVal);
					
          }
        }
		  });//end $('table.list tr:gt(0):has(.p_title)').each
		
	  });//end $(inputs[1]).click
    
    $(inputs[2]).unbind();
	  $(inputs[2]).click(function(){
      
		  $(this).parent().css({display:"none"});
	  });

	  form.css({left:coords.left+15, top:coords.top+15, display:"block"});		

	  return false;	   
    
  }
//=============================================================================================================
/////////////////////////////////////////////////////////////////////////////  
// Проверим, что это склад
// 
  var Type_Podrazd =  get_Type_Podrazd();
  //alert(Type_Podrazd);
  
  if ( Type_Podrazd == 'Склад') {
	  // кнопка
	   var input_all = $('<button id=b2>Склад</button>').click(function(){});		
	  
	  var Tip_Produkta;	  
	  var container = $('#topblock');
	  container.append( $('<table><tr>').append('<td>').append(input_all).append('<td>').append('<td><span id=allquality style="color:yellow"></span>')  );
    	
    $('table.list tr:gt(0)').each(function () {
	
	    var Tip_Classa = $(this);	    
	    if (Tip_Classa.hasClass("p_title")){
		   
		    Tip_Produkta = $('strong', this).slice(0,1).text();
		    $('strong', this).slice(0,1).addClass("tip");
		    //alert(Tip_Produkta);		
    
		    $('td:gt(0)', this).slice(-3,-2).addClass("num");		   
	      $('td:gt(0)', this).slice(-3,-2).append($('<br><a href="#" onclick="show_quality_form_all(this); return false;">=</a>').click(function () {
         
			    Tip_Produkta = $(this).parent().parent().find(".tip").text();			   
	        show_quality_form_all(this, Tip_Produkta); return false;
        }));		
				
	    }//end if (aaa.hasClass("p_title"))
	
	    if (Tip_Classa.hasClass("odd") || Tip_Classa.hasClass("even")){
			  Tip_Classa.addClass(Tip_Produkta);	
			  
	    }//end 	if ((aaa.hasClass("odd")
	
    });//end $('table.list tr:gt(0):has(.p_title)').each

  }//это склад


};

    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);

