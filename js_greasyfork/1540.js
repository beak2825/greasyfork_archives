// ==UserScript==
// @name           Virtonomica:Notes
// @name:en        Virtonomica:Notes   
// @namespace      Virtonomica
// @description    Система добавления и показа оповещений
// @description:en The list of notes   
// @version        0.26.6
// @include        https://*virtonomic*.*/*/main/unit/view/*
// @include        https://*virtonomic*.*/*/main/company/view/*/unit_list
// @include        https://*virtonomic*.*/*/main/company/view/*/unit_list?new
// @include        https://*virtonomic*.*/*/main/company/view/*/unit_list?old
// @include        https://*irtonomic*.*/*/main/politics/president/*
// @include        https://*virtonomic*.*/*/main/politics/governor/*
// @include        https://*virtonomic*.*/*/main/politics/mayor/*
// @downloadURL https://update.greasyfork.org/scripts/1540/Virtonomica%3ANotes.user.js
// @updateURL https://update.greasyfork.org/scripts/1540/Virtonomica%3ANotes.meta.js
// ==/UserScript==
var run = function() {
   var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
   $ = win.$;

   	var loc_storage = function(){
		return({
			'save': function (name,  val){
				try {
					window.localStorage.setItem( name,  JSON.stringify( val ) );
				} catch(e) {
					out = "Ошибка добавления в локальное хранилище";
					//console.log(out);
				}
			},
			'load': function(name){
				obj = JSON.parse( window.localStorage.getItem(name) );
				if ( obj == null ) obj = new Object();
				return obj;
			}
		});
	}
	var LS = new loc_storage();

    // определяем интерфейс
    // autodefined language interface
    var lang = 'undef';
    //var bt_logout = $("li[class='icon menulogout']");
    //var logout_string = bt_logout.attr('title');
    var logout_string = $("a[href*='user/logout']").text();
    console.log(logout_string);
    // язык по умолчанию
    lang = 'En';
    if (logout_string == 'Выход') {
	   lang = 'Ru';
    } else if(logout_string == 'Logout') {
	   lang = 'En';
    } 
    console.log(lang);
    if ( lang == 'undef') {
        alert('Unsupported language for userscript "Notes"');
		return;
    }  

    // Строки зависимые от языка
    // language definitions
    var LangMsg = new Object();
    LangMsg['Ru'] = new Object();
    LangMsg['En'] = new Object();

    LangMsg['Ru']['governor'] = "Губернатор";
    LangMsg['En']['governor'] = "Governor";
	
    LangMsg['Ru']['president'] = "Президент";
    LangMsg['En']['president'] = "President";
	
    LangMsg['Ru']['mayor'] = "Мэр";
    LangMsg['En']['mayor'] = "Mayor";

    LangMsg['Ru']['notes'] = "Напоминание";
    LangMsg['En']['notes'] = "Notes";

    LangMsg['Ru']['list_notes'] = "Список напоминаний";
    LangMsg['En']['list_notes'] = "List of Notes";

    LangMsg['Ru']['save'] = "Сохранить";
    LangMsg['En']['save'] = "Save";
	
    LangMsg['Ru']['del'] = "Удалить";
    LangMsg['En']['del'] = "Delete";

    LangMsg['Ru']['add_notes'] = "Добавить напоминание";
    LangMsg['En']['add_notes'] = "Add Notes";

    LangMsg['Ru']['export'] = "Окно экспорта/импорта";
    LangMsg['En']['export'] = "Windwow export/import";
	
    LangMsg['Ru']['import'] = "Импортировать данные из окна";
    LangMsg['En']['import'] = "Importing data from textarea";
	
    LangMsg['Ru']['data_export'] = "Данные экспорта";
    LangMsg['En']['data_export'] = "Data exporting";
	
    // --- virtonomica user interface
    LangMsg['Ru']['comp'] = "компании";
    LangMsg['En']['comp'] = "of a company";
	
	// Стили  
    var st = $("style");
	if ( $(".my_btn", st).length == 0 ) {
		st.append(".my_btn{cursor:pointer;opacity:0.5;float:left;color: white;}");
		st.append(".my_btn:hover{opacity:1.0}");
		st.append(".my_btn img {width:20px;}");
    
		st.append(".table_row:hover{background-color: lightgray;}");
    //css("text-decoration","line-through").css("color","grey");
    st.append(".del_line:{text-decoration:line-through;color:grey}");
    st.append(".del_line a, .del_line td, .del_line td img, .del_line td font img {text-decoration:line-through;color:grey;opacity:0.5}");
    
    st.append(".unit_name{padding: 4px;}");

	}

	//console.log( LangMsg );
	
   /**
   * записать данные в локальнео хранилище, с проверкой ошибок
   */
   function ToStorage(name,  val)
   {
       try {
           window.localStorage.setItem( name,  JSON.stringify( val ) );
       } catch(e) {
           out = "Ошибка добавления в локальное хранилище";
           //console.log(out);
       }
   }

   function getFromStorage(obj, id_shop)
   {
       if (obj[id_shop] == null) return '';
       return JSON.stringify(obj[id_shop]);
   }

/**
* Добавить заметку к текущему предприятию
* следует вызывать на страницах где одно подраздление, ИД которого виден в url
*
* @param msg текст сообщения, можно использовать html теги
*/
function addNotes( msg ){
    // объект для хранения сообщений
    notes = JSON.parse( window.localStorage.getItem('notes') );
    if ( notes == null ) notes = new Object();

    // Идентификатор подразделения
    var id = /(\d+)/.exec(location.href)[0];
     
    // дизайн от 16.10.2017
    var title = $("div.title h1").text();
    var type = $.trim( $('ul.tabu li').eq(1).text() );
  
    if ( notes[id] == null ) notes[id] = new Object();

    var d = new Date();

    if ( notes[id]['text'] != null) {
      // сообщение для этого подраздления уже есть
      msg = notes[id]['text'] + "<br>" + msg;
    }

    notes[id]['text'] = msg;
    // Количество миллисекунд
    notes[id]['time'] = d.getTime();
    notes[id]['name'] = title;
    notes[id]['type'] = type;

    ToStorage('notes', notes);
}

   var txt = "<table><tr><td><td><table width=100%><tr><td align=rigth id=notes_title><td align=center><h3>" + LangMsg[ lang ]['notes'] + "</h3><div id=notes_link style='color:grey'></div></table><td>&nbsp;";
   txt+= "";
   txt+= "<tr><td>&nbsp;<td align=center id=notes_form>&nbsp;<td>&nbsp;" + "<tr><td colspan=3></table>";
   
   var div_form = "<div id=notes style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1002; position: absolute; border: 1px solid rgb(0, 0, 0); display: none;'>" + txt + "</div>";

   var div_export = "<div id=notes_export style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1003; position: absolute; border: 1px solid rgb(0, 0, 0); display: none;'>"
   + "<h3 style='margin:4px'>" + LangMsg[ lang ]['data_export'] + "</h3>"
   + "<table><tr><td>&nbsp;<td>"
   + "<textarea name=export_text id=export_text rows=10 cols=64></textarea>"
   + "<br><center><span id=export_load></span></center>"
   + "</table>";
   + "</div>";

  // старй дизайн списка юниов (2104 года)
  var tu = $("table.unit-list-2014");
  // если не нашли старй дизайн, то пробуем найти новый
  if ( tu.length == 0) {
  	tu = $("table.unit_list_table");
  }
  
   if (tu.length == 1) {
       // Это у нас список подразделений - рисуем кнопку отображения отчета со сылками
       // Оповещения
       notes = JSON.parse( window.localStorage.getItem('notes') );
       if ( notes == null ) notes = new Object();
       var len = 0;

       // проверить, какие оповещения отразить как актуальные
       for (key in notes){
           len++;
       }

// http://cdn1.iconfinder.com/data/icons/Upojenie_by_SoundForge/Icons/Notes.png
// http://www.iconsearch.ru/uploads/icons/crystalclear/24x24/kedit.png

       var wc = $("<li><div id=main_notes class=my_btn> <img alt='" + LangMsg[ lang ]['list_notes'] +"' src=https://cdn1.iconfinder.com/data/icons/humano2/32x32/apps/gnome-sticky-notes-applet.png> <span id=all_notes> ("+ len+")</span></div>").click( function() {
           $("#notes").toggle();
           if( $('#notes').is(':visible') ) {
                   // код для visible
               // Оповещения
               notes = JSON.parse( window.localStorage.getItem('notes') );
               if ( notes == null ) notes = new Object();

               // Формируем ссылку на торговый зал
               var url = /^https:\/\/virtonomic[as]\.(\w+)\/\w+\//.exec(location.href)[0];
               console.log(url);

               var all_count = 0;
               $("#notes_form").html('');
               var out = $("<table>");
               for (key in notes){
                   if (notes[key] == null) continue;
                   if (notes[key]['time'] == null) continue;

                   // подсчитываем сколько у нас оповещениий
                   // TODO - учитывать только акутальные
                   all_count++;

                   var d = new Date();
                   d.setTime(notes[key]['time']);

                   var link_text = notes[key]['name'];
                   if ( link_text == '' ) {
                       link_text = key;
                   }
                   link = "<a href=" + url + "main/unit/view/" + key + ">" + link_text + "</a>";
				   if ( notes[key]['link'] != null ) {
					   link = "<a href=" + notes[key]['link'] + ">" + link_text + "</a>";
				   }
				   
                   span = $("<span name=" + key + " style='cursor:pointer;' title='del'><font color=red><b>Х</b></font></span>").click(
                   function(){
                       idp = $(this).attr('name');
                       //alert('del = ' + idp);
                       delete notes[idp];
                       ToStorage('notes', notes);
											 $(this).parent().addClass("del_line");

                       //$("#main_notes").click().click();
                   });

                   out_tr = $("<tr class='table_row'>");
                   out_tr.append("<td>" + d.toLocaleDateString())
                   .append("<td class=unit_name>" + link)
                   .append("<td>(" + notes[key]['type'] + ")")
                   .append("<td style='border: 1px solid gray; border-radius: 4px 4px 4px 4px; box-shadow: 0 1px 3px 0 #999999; display: block; float: left; margin-top: 4px; overflow: hidden; padding: 2px 4px;  text-align:left'>" + notes[key]['text'])
                   .append("<td>").append(span);
                   out.append(out_tr);
                   str = "(" + all_count +")";
                   if (all_count == 0)  str = '';
                   $("#all_notes").html("(" + all_count +")");
               }
               $("#notes_form").html( out );

           }
       });

// http://cdn1.iconfinder.com/data/icons/basicset/save_32.png
// http://www.iconsearch.ru/uploads/icons/ultimategnome/48x48/stock_export.png
       var wc_export = $("<span id=main_notes_export style='cursor:pointer; color: white;'><img src=https://cdn1.iconfinder.com/data/icons/basicset/save_32.png title='" + LangMsg[ lang]['export']+ "' alt='О" + LangMsg[ lang]['export']+ "'></span>").click( function() {
           $("#export_text").val( JSON.stringify( notes ) );
           $("#notes_export").toggle();
       });

// http://cdn1.iconfinder.com/data/icons/freeapplication/png/24x24/Load.png
// http://www.iconsearch.ru/uploads/icons/freeapplication/24x24/load.png
       var wc_load = $("<img src=https://cdn1.iconfinder.com/data/icons/freeapplication/png/24x24/Load.png title='" + LangMsg[ lang ]['import'] + "' alt='" + LangMsg[ lang ]['import'] + "'>").click( function() {
           //alert("Load");
           var text =  $("#export_text").val() ;
           try {
               notes = JSON.parse( text );
               ToStorage('notes', notes);
		$("#notes_export").hide();
               $("#main_notes").click().click();
           } catch(e) {
               alert("Неверные данным для импорта");
           }
       });

	       	var container = $('ul.tabu');
		container.append( wc );

     // для старого дизайна
     var list_type = $("table.unit-top");
     if ( list_type.length == 0 ){
         // если не нашли пробуем искать в новом дизайне
         list_type = $("div.row");
     }
     
		list_type.before ( div_form);
	       	//container.append( div_form );
       //var container = $('#topblock');
       //container.append( $('<table><tr><td>').append(wc) );
       //container.append( div_form );
       $("#notes_title").append(wc_export).append( div_export );
       $("#export_load").append(wc_load);


       return;
   }

   // Идентификатор подразделения
   var id = /(\d+)/.exec(location.href)[0];
   console.log("id=" + id);
   
   // тип подразделения
   var type = '';
   // название подразделения
   var title = '';
      
   var pos = location.href.indexOf("politics");
   // проверяем на объект политики
   if (pos > 0) {
	   console.log("politics");
	   
	   // вычитываем название объекта политики
	   var polit_name = "";
	   var el = $("#headerInfoCenter h1");
	   var el2 = $("a", el);
	   if (el2.length > 0 ) {
		   polit_name = el2.text();
	   } else {
		   polit_name = el.text();
	   }
	   
	   if ( location.href.indexOf("president") > 0 ) {
		   type = LangMsg[ lang ]['president'];
	   }
	   if ( location.href.indexOf("governor") > 0 ) {
		   type =  LangMsg[ lang ]['governor'] ;
	   }
	   if ( location.href.indexOf("mayor") > 0 ) {
		   type =  LangMsg[ lang ]['mayor'] ;
		   polit_name = el.html();
		   pos = polit_name.indexOf("<img");
		   polit_name = $.trim( polit_name.substr(0, pos) );
		   
	   }
	   console.log( polit_name );
	   title = polit_name;
	   console.log( type );
	   
   } else {
	   // обработка обыных юнитов (units)
     
    // дизайн от 16.10.2017
    var title = $("div.title h1").text();
    var type = $.trim( $('ul.tabu li').eq(1).text() );
       
   }
   
   // Оповещения
   notes = JSON.parse( window.localStorage.getItem('notes') );
   if ( notes == null ) notes = new Object();
   if ( notes[id] == null) notes[id] = new Object();

   notes_html = "";
   if ( notes[id]['text'] != null) notes_html = notes[id]['text'];

   var form = "";
   form += "<span id=notes_error style='color:red;'></span><br>";
   form += "<div id=notes_preview style='border: 1px solid gray; border-radius: 4px 4px 4px 4px; box-shadow: 0 1px 3px 0 #999999; display: block; float: left; margin-top: 4px; margin-right: 4px; overflow: hidden; padding: 2px 4px; text-align:left'>" + notes_html +"</div>";
   form += " <textarea name=notes_txt id=notes_txt rows=5 cols=48>";
   form += notes_html;
   form+= "</textarea><br>";

   var form_button = $("<button id=notes_btn style='cursor:pointer'>" +LangMsg[ lang ]['save'] + "</button>").click( function() {
       $("#notes_error").text('');
       var text =  $("#notes_txt").val() ;
       $("#notes_preview").html( text );	
       if (text == '') {
           $("#notes_error").text('Ошибка - нет описания');
           return;
       }

       var d = new Date();
       // Оповещения
       notes = JSON.parse( window.localStorage.getItem('notes') );
       if ( notes == null ) notes = new Object();

       if ( notes[id] == null) notes[id] = new Object();

       notes[id]['text'] = text;
       notes[id]['time'] = d.getTime();
       notes[id]['name'] = title;
       notes[id]['type'] = type;
	   notes[id]['link'] = location.href;

       ToStorage('notes', notes);
       $("#notes").toggle();
   });

   var form_button_del = $(" <button style='cursor:pointer'>" +LangMsg[ lang ]['del'] + "</button>").click( function() {
       // Оповещения
       notes = JSON.parse( window.localStorage.getItem('notes') );
       if ( notes == null ) notes = new Object();

       if ( notes[id] == null) notes[id] = new Object();

       $("#notes_txt").val("");
       $("#notes_preview").html( "" );
       delete  notes[id];
       ToStorage('notes', notes);
   });

// http://cdn1.iconfinder.com/data/icons/oxygen/32x32/actions/document-new.png
// http://www.iconsearch.ru/uploads/icons/ull_icons/24x24/message_add.png
   var wc = $("<li class=my_btn><img alt='"+ LangMsg[ lang ]['add_notes'] + "' src=https://cdn1.iconfinder.com/data/icons/oxygen/32x32/actions/document-new.png title='"+ LangMsg[ lang ]['add_notes'] + "'> </li>").click( function() {
       $("#notes").toggle();
       // Обновить зампетку
       notes = JSON.parse( window.localStorage.getItem('notes') );
       if ( notes == null ) notes = new Object();
       if ( notes[id] == null) notes[id] = new Object();

 		$("#notes_txt").change(function() {
			console.log('change ' + $("#notes_txt").val() );
			$("#notes_preview").html( $("#notes_txt").val() );
		
		});
		
       if ( notes[id]['text'] == null ) return;
       $("#notes_txt").val( notes[id]['text'] );
       $("#notes_preview").html( notes[id]['text'] );
	   if (notes[id]['link'] != null) {
			$("#notes_link").html( notes[id]['link'] );
	   }
   });
   
   //var container = $('#topblock');
   //var container = $('#topblock').next();
   var container = $('ul.tabu');

   if (tu.length == 0) {
       container = $("li:last", container).prev().parent();
       container.append(wc) ;
       //container.append( $('<table><tr><td>').append(wc) );
       $("#childMenu").before ( div_form);

       $("#notes_form").append(form).append(form_button).append(form_button_del);
   }
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}