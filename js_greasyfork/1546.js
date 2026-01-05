// ==UserScript==
// @name           Virtonomica:DinamicSalary 2
// @namespace      Virtonomica
// @description     Позволяет помечать города из списка
// @description     Клик по названию города помечает его зачеркиванием
// @description     Повторный клик снимает зачеркивание
// @version        1.92
// @include        https://*virtonomic*.*/*main/common/main_page/game_info/salary
// @include    	   https://virtonomic*.*/*/main/company/view/*/unit_list
// @include    	   https://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @downloadURL https://update.greasyfork.org/scripts/1546/Virtonomica%3ADinamicSalary%202.user.js
// @updateURL https://update.greasyfork.org/scripts/1546/Virtonomica%3ADinamicSalary%202.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	/**
    * записать данные в локальнео хранилище, с проверкой ошибок
    */
	function ToStorage(name,  val)
	{
        try {
            window.localStorage.setItem( name,  JSON.stringify( val ) );
		} catch(e) {
         out = "Ошибка добавления в локальное хранилище";
		}
	}

	var demograhics = JSON.parse( window.localStorage.getItem('demograhics') );
	if (demograhics == null) {
		demograhics = new Object();
	}
	
	// Проверим ссылку что это список юнитов
	var href = location.href;
	n = href.lastIndexOf("/");
	end = href.substr(n+1, href.length) ;
	if ( end == "unit_list" ) {
		var table = $("table.unit-list-2014");
		var el = $("td.geo", table);
		for( i=0; i<el.length; i++){
			var name = $.trim( el.eq(i).text() );
			if (demograhics[name] == null) continue;
			//console.log(name);
			//console.log( demograhics[name] );
			
			var add = "";
			if ( demograhics[name]['price'] != null) {
				add+= "<font color=";
				if (parseFloat(demograhics[name]['price']) < 0) {
					add+= "red";
				} else {
					add+= "green";
				}
				add+= ">";
				add+= "$" + demograhics[name]['price'];
				add+= "</font>";
			}
			if ( demograhics[name]['obr'] != null) {
				add+= "<font color= ";
				if (parseFloat(demograhics[name]['obr']) < 0) {
					add+= "red";
				} else {
					add+= "green";
				}
				add+= ">";
				add+= " Об." + demograhics[name]['obr'];
				add+= "</font>";
			}
			if (add != "") {
				el.eq(i).append( "<br><small>(" + add + ")</small>");
			}
		}	
		return;
	} 
		n = href.lastIndexOf("employee");
		console.log("employee 0");
		// Управление - персонал
		if (n > -1) {
			console.log("employee");
			var table = $("table.list");
			var el = $("td.u-a", table);
			console.log(el.length);
			for( i=0; i<el.length; i++){
				var name = $.trim( $("b", el.eq(i)).text() );
				if (demograhics[name] == null) continue;
				//console.log(name);
				//console.log( demograhics[name] );
			
			var add = "";
			if ( demograhics[name]['price'] != null) {
				add+= "<font color=";
				if (parseFloat(demograhics[name]['price']) < 0) {
					add+= "red";
				} else {
					add+= "green";
				}
				add+= ">";
				add+= "$" + demograhics[name]['price'];
				add+= "</font>";
			}
			if ( demograhics[name]['obr'] != null) {
				add+= "<font color= ";
				if (parseFloat(demograhics[name]['obr']) < 0) {
					add+= "red";
				} else {
					add+= "green";
				}
				add+= ">";
				add+= " Об." + demograhics[name]['obr'];
				add+= "</font>";
			}
			if (add != "") {
				el.eq(i).append( "<small>(" + add + ")</small>");
			}
			
		}	
		return;
			
		}

	
    //console.log('start');
    var table = $("table.list");
    var tr = $("tr", table);
    for(i=1; i<tr.length; i++) {
		td = $("td", tr.eq(i) ).eq(0);
		if (td.length== 0) continue;

		img = $('img', td);
		if (img.length != 1) continue;

		img.click( function() {
			el = $(this).parent().parent();
			var decor = el.css("text-decoration");
			//console.log(decor);
			var new_decor = "none";
			var new_color = "black";
			if (decor != 'line-through'){
				new_decor = "line-through";
				new_color = "grey";
			}	
			el.css("text-decoration", new_decor);
			el.css("color", new_color);
		});
	
		var name = $.trim( img.next().html() );
		//console.log(name);
		
		td = $("td", tr.eq(i) ).eq(5);
		price = $.trim( td.text() );
		if ( price != "") {
			price = price.replace('$','');
			price = price.replace('+','');
			//console.log( price );ar
			if ( demograhics[ name ] == null ) {
				demograhics[ name ] = new Object();
			} 
			demograhics[ name ]['price'] = price;
		}
		
		td = $("td", tr.eq(i) ).eq(7);
		ur_obr = $.trim( td.text() );
		if ( ur_obr != "") {
			ur_obr = ur_obr.replace('+','');
			//console.log( ur_obr );
			if ( demograhics[ name ] == null ) {
				demograhics[ name ] = new Object();
			} 
			demograhics[ name ]['obr'] = ur_obr;
		}
    }	
    //console.log( demograhics );
	ToStorage("demograhics", demograhics);

    table.before("<p>Клик мышкой по флажку слева от города делает строчку зачеркнутой.<br>Повторный клик снимает зачеркнутость.<div id=dm_out></div>");
	
	var save = $('<div id=dm_save style="float:left;cursor:pointer;">SAVE</div>');
	var clear = $('<div id=dm_save style="float:right;cursor:pointer;">CLEAR</div>');
	
	table.before(save).before(clear);

	save.click(function(){
		console.log( demograhics );
		ToStorage("demograhics", demograhics);
		$("#dm_out").html("данные сохранены").css('color', 'green');
	});
	
	clear.click(function(){
		demograhics = null;
		ToStorage("demograhics", demograhics);
		$("#dm_out").html("данные сброшены").css('color', 'red');
	});
	
}


// Хак, что бы получить полноценный доступ к DOM >:]
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 
