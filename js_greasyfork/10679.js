// ==UserScript==
// @name         MCP-Enhancement-Project -- MusiXs
// @namespace    
// @version      0.9.2
// @description  MCP-Enhancement-Script für den Bereich MusiXs
// @author       Dominik Bissinger alias Nihongasuki
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*        
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10679/MCP-Enhancement-Project%20--%20MusiXs.user.js
// @updateURL https://update.greasyfork.org/scripts/10679/MCP-Enhancement-Project%20--%20MusiXs.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function () {
    $(document).ajaxSuccess (function () {
        main();
    });
    main();
});

//Get Important Elements and Manage function-run
var main = function () {
    if (window.location.href.indexOf('mcp?section=musixs&s=edit-beta') === -1) {
        return;
    };
    var style = document.createElement('style');
    style.innerHTML = "del { color: #a00;}ins {color: #0a0;}.membersField{width: 7em;}";
    document.head.appendChild(style);
    
    //Get Elements
    var compareTable = document.getElementsByClassName('compareTable');
    var tr = [];
    var h3 = [];
    var td = [];
    
    for (var i = 0; i < compareTable.length; i++) {
        tr[i] = compareTable[i].getElementsByTagName('tr')[0];
        h3 = document.getElementsByTagName('h3');
    };
    
    for (var j = 0; j < tr.length; j++) {
        td[j] = tr[j].getElementsByTagName('td');
    };
    
    //mark Desciprion-Differenzes
    for (var o = 0; o < td.length; o++) {
        if (h3[o].innerHTML === "Beschreibung:") {
            checkDifferenzes(td[o][0],td[o][1]);
        };
    };
    
    //Add Editable Input
    //changeHandler(h3,td);
};

//Mark Differenzes with DiffAlgorhythm
var checkDifferenzes = function (oldString,newString) {
    if (oldString.innerHTML.indexOf('<del>') > -1 || oldString.innerHTML.indexOf('<ins>') > -1) {return;};
    var o = oldString.innerHTML;
    var n = newString.innerHTML;
    oldString.innerHTML = diffString(o,n);
};

//Manage wich Change needs to be started and do generall Changes
var changeHandler = function (h3,td) {
    //Return if the function already ran or the location is incorrect
    if ($('.proxerField').length !== 0 || $('.no_details').length !== 0) {return;};
    if ($('.active')[2].innerHTML !== "Unkontrolliert") {return;};
    
    //Function to replace Links with Class "publish" with Links with Class "newPublish"
    var changeLink = function () {
        var publish = document.getElementsByClassName('publish');
        for (var i = 0; i < publish.length; i++) {
            var newPublish = document.createElement('a');
            newPublish.setAttribute("href","javascript:;");
            newPublish.setAttribute("class","newPublish");
            newPublish.innerHTML = "Freischalten";
            publish[i].parentNode.replaceChild(newPublish,publish[i]);
        };
        if (publish.length !== 0) {changeLink();}; //Repeat Funktion until there is no Link left
    };
    changeLink();
    
    //Decide Which Event and Replace Handler to use
    if ($('.active')[1].innerHTML === "Bands") {
        for (var i = 0; i < td.length; i++) {
            bandsReplace(h3[i],td[i][1]);
        }; 
        bandsEvent();
    };
    
    if ($('.active')[1].innerHTML === "Personen") {
        for (var i = 0; i < td.length; i++) {
            personsReplace(h3[i],td[i][1]);
        }; 
        personsEvent();
    };
    
    if ($('.active')[1].innerHTML === "Songs") {
        for (var i = 0; i < td.length; i++) {
            songsReplace(h3[i],td[i][1]);
        }; 
        songsEvent();
    };
};

//Songs Replace Handler
var songsReplace = function (h3,td) {
    var id = $(td).parents('.proxerForm').attr('id').substr(5);
    if (h3.innerHTML === "Titel:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField songsTitle"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Original ausgeschriebener Name:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField songsOrig_Title"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Youtube-ID:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField songsYoutube"+id);
        input.setAttribute("placeholder","Bsp: https://www.youtube.com/watch?v=ejsfGzsiLxU");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Länge:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField songsDuration"+id);
        input.setAttribute("placeholder","Bsp: 0:34 (0 Minuten 34 Sekunden)");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Bands:") {
        var oldInner = td.innerHTML;
        var entrys = oldInner.split("<br>");;
        var table = document.createElement('table');
        var tBody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var p = document.createElement('p');
        
        tr.innerHTML = '<th>Name</th><th>Typ</th><th></th>'
        
        table.setAttribute("class","no_details songsBands"+id);

        p.innerHTML = '<input type="submit" class="songsBands'+id+'_add" value="+">';
        
        td.innerHTML = "";
        tBody.appendChild(tr);
        table.appendChild(tBody);
        td.appendChild(table);
        td.appendChild(p);
        for (var j = 0; j < entrys.length -1; j++) {
            $('.songsBands'+id+'_fillerMessage').remove();
            var index = {"interpret":"Hauptinterpret","featuring":"Featuring","misc":"Sonstige"};
		    var append = '<tr>'+
		    '<td>'+
		    '<input type="text" class="songsBands'+id+'_new">'+
		    '</td><td>'+
		    '<select size="1" class="songsBands'+id+'_newType">';
	    	for(var i in index){
	    		append += '<option value="'+i+'">'+index[i]+'</option>';
	    	}
	    	append+='</select></td>'+
	    	'<td><input type="submit" class="remove" value="-"></td></tr>';

	    	$('.songsBands'+id+'').append(append);
	    	removeFieldTable();
        };
        
        var table = document.getElementsByClassName('songsBands'+id)[0];
        var tr = table.getElementsByTagName('tr');
        for (var i = 1; i < tr.length; i++) {
            var j = i-1;
            var td = tr[i].getElementsByTagName('td');
            
            var index0 = entrys[j].indexOf('>');
            var index1 = entrys[j].indexOf('<',1);
            var name = entrys[j].substring(index0+1,index1);
            
            var input = td[0].getElementsByTagName('input')[0];
            var arr = [];
            arr[0] = input;
            arr[1] = name;
            $.ajax({
			    url: '/bands?format=json&s=getSearchList&search='+name,
                indexValue: arr,
				success: function( data ) {
                    var newInput = this.indexValue;
					$.map( data.list, function( item ) {
                        if (data.list.length === 1) {
                            newInput[0].value = newInput[1]+" #"+item.id;
                        }else{
                            for (var j = 0; j < data.list.length; j++) {
                                if (newInput[1] === item.title) {
                                    newInput[0].value = newInput[1]+" #"+item.id;
                                };
                            };
                        };
					});
				}
			});
            
            var index1 = entrys[j].indexOf('(');
            var index2 = entrys[j].indexOf(')');
            var string = entrys[j].substring(index1+1,index2);
            
            var options = td[1].getElementsByTagName('option');
            for (var x = 0; x < options.length; x++) {
                if (options[x].innerHTML === string) {
                    options[x].setAttribute("selected","");
                };
            };
        };
    };
    
	$('.songsBands'+id+'_add').off('click');
	$('.songsBands'+id+'_add').on('click',function(){
		$('.songsBands'+id+'_fillerMessage').remove();
		var index = {"interpret":"Hauptinterpret","featuring":"Featuring","misc":"Sonstige"};
		var append = '<tr>'+
		'<td>'+
		'<input type="text" class="songsBands'+id+'_new">'+
		'</td><td>'+
		'<select size="1" class="songsBands'+id+'_newType">';
		for(var i in index){
			append += '<option value="'+i+'">'+index[i]+'</option>';
		}
		append+='</select></td>'+
		'<td><input type="submit" class="remove" value="-"></td></tr>';

		$('.songsBands'+id+'').append(append);
		removeFieldTable();
		
		$( '.songsBands'+id+'_new' ).autocomplete({
			source: function( request, response ) {
				$.ajax({
					url: '/bands?format=json&s=getSearchList&search='+request.term,
					success: function( data ) {
						response( $.map( data.list, function( item ) {
							return {
								label: item.title,
								value: item.title+" #"+item.id
							}
						}));
					}
				});
			}
		});
	});
		
    
    if (h3.innerHTML === "Songtext:") {
        var oldInner = td.innerHTML;
        var entrys = oldInner.split("<hr>");
        var table = document.createElement('table');
        var tBody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var p = document.createElement('p');
        
        tr.innerHTML = '<th width="50">Standard</th><th width="100">Sprache</th><th>Songtext</th><th width="50"></th>'
        tBody.appendChild(tr);
        
        for (var i = 0; i < entrys.length -1; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            
            var input = document.createElement('input');
            input.setAttribute("type","radio");
            input.setAttribute("name","songsLyrics"+id+"_default");
            input.setAttribute("class","songsLyrics"+id+"_default");
            if (entrys[i].indexOf('<i>') > -1) {
                input.setAttribute("value","1");
                input.setAttribute("checked","");
            }else{
                input.setAttribute("value","0");
            };
            td1.appendChild(input);
            
            td2.innerHTML = '<select size="1" class="songsLyrics'+id+'_type"><option value="jp-latin" id="option1'+id+i+'">Japanisch (Latein-Schrift)</option><option value="jp" id="option2'+id+i+'">Japanisch (Schriftzeichen)</option><option value="kr-latin" id="option3'+id+i+'">Koreanisch (Latein-Schrift)</option><option value="kr" id="option4'+id+i+'">Koreanisch (Schriftzeichen)</option><option value="de" id="option5'+id+i+'">Deutsch</option><option value="en" id="option6'+id+i+'">Englisch</option></select>';
            
            var textarea = document.createElement('textarea');
            textarea.setAttribute("style","width: 163px; margin: 0px; height: 30px;");
            textarea.setAttribute("class","songsLyrics"+id+"_description");
            textarea.setAttribute("id","songsLyrics"+id+i);
            textarea.setAttribute("placeholder","Songtext");
            var url = "http://proxer.me/edit-beta?format=json&s=data&formid="+id;
            var z = 0;
            $.ajax({
                url: url,
                method: 'GET',
                success: function (response) {
                    var newID = id;
                    var x = z;
                    z++;
                    var newData = response.newData;
                    var fillTextarea = function () {
                        var textArea = document.getElementById("songsLyrics"+newID+x);
                        if (textArea !== null) {
                            textArea.innerHTML = newData.lyrics[x][3];
                        }else{
                            setTimeout(fillTextarea,100);
                        };
                    }
                    fillTextarea();
                }
            });
            td3.appendChild(textarea);
            
            td4.innerHTML = '<input type="submit" class="remove" value="-">';
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tBody.appendChild(tr);
        };
        
        table.setAttribute("class","no_details songsLyrics"+id);

        p.innerHTML = '<input type="submit" class="songsLyrics'+id+'_add" value="+">';
        
        td.innerHTML = "";
        table.appendChild(tBody);
        td.appendChild(table);
        td.appendChild(p);
        for (var i = 0; i < entrys.length -1; i++) {
            var name = entrys[i].split('</b>')[0].substring(3);
            if (name.indexOf('<i>') > -1) {
                name = name.substring(3,name.length -5);
            }else{
                name = name.substring(0,name.length -1);
            };
            for (var j = 1; j < 7; j++) {
                var text = 'option'+j+id+i;
                var option = document.getElementById(text);
                if (option.innerHTML === name) {
                    option.setAttribute("selected","");
                }
            }
        };
    };
    
    
		
    $('.songsLyrics'+id+'_add').off('click');	
    $('.songsLyrics'+id+'_add').on('click',function(){
        $('.songsLyrics'+id+'_fillerMessage').remove();
        var index = {"jp-latin":"Japanisch (Latein-Schrift)","jp":"Japanisch (Schriftzeichen)","kr-latin":"Koreanisch (Latein-Schrift)","kr":"Koreanisch (Schriftzeichen)","de":"Deutsch","en":"Englisch"};
		var append = '<tr>'+
		'<td>'+
		'<input type="radio" name="songsLyrics'+id+'_default" value="0" class="songsLyrics'+id+'_default">'+
		'</td><td>'+
		'<select size="1" class="songsLyrics'+id+'_type">';
		for(var i in index){
			append += '<option value="'+i+'">'+index[i]+'</option>';
		}
		append+='</select></td>'+
		'<td><textarea class="songsLyrics'+id+'_description" placeholder="Songtext" style="width:100%;"></textarea></td>'+
		'<td><input type="submit" class="remove" value="-"></td></tr>';

		$('.songsLyrics'+id).append(append);
		removeFieldTable();	
   });	
};

//Persons Replace Handler
var personsReplace = function (h3,td) {
    var id = $(td).parents('.proxerForm').attr('id').substr(5);
    if (h3.innerHTML === "Name:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField personName"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Original geschriebener Name:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField personNameOrig"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Haupttätigkeit:") {
        var oldInner = td.innerHTML;
        var value = ["musician","seiuu","mangaka","director","misc"];
        var name = ["Musiker","Synchronsprecher (Seiyuu)","Mangaka","Regisseur","Sonstige"];
        td.innerHTML = "";
        for (var i = 0; i < value.length; i++) {
            var input = document.createElement('input');
            var text = document.createTextNode(" "+name[i]+" ");
            var br = document.createElement('br');
            input.setAttribute("type","radio");
            input.setAttribute("name","personType"+id);
            input.setAttribute("class","proxerField personType"+id);
            input.setAttribute("value",value[i]);
            if (name[i] === oldInner) {
                input.setAttribute("checked","");
            };
            td.appendChild(input);
            td.appendChild(text);
            td.appendChild(br);
        };
    };
    
    if (h3.innerHTML === "Geschlecht:") {
        var oldInner = td.innerHTML;
        var value = ["misc","f","m"];
        var name = ["Unbekannt","Weiblich","Männlich"];
        td.innerHTML = "";
        for (var i = 0; i < value.length; i++) {
            var input = document.createElement('input');
            var text = document.createTextNode(" "+name[i]+" ");
            var br = document.createElement('br');
            input.setAttribute("type","radio");
            input.setAttribute("name","personGender"+id);
            input.setAttribute("class","proxerField personGender"+id);
            input.setAttribute("value",value[i]);
            if (name[i] === oldInner) {
                input.setAttribute("checked","");
            };
            td.appendChild(input);
            td.appendChild(text);
            td.appendChild(br);
        };
    };
    
    if (h3.innerHTML === "Bild:") {
        var img = td.getElementsByTagName('img')[0];
        var src = img.src;
        var image = document.createElement('img');
        var input = document.createElement('input');
        var submit = document.createElement('input');
        var br = document.createElement('br');
        
        image.setAttribute("class","personImage"+ id +"_previewContainer");
        image.setAttribute("src",src);
        image.setAttribute("style","max-width: 300px; max-height: 300px; padding:5px; margin:5px; border: 1px solid;");
        
        input.setAttribute("style","width: 72.5%;");
        input.setAttribute("type","text");
        input.setAttribute("class","proxerField personImage"+id);
        input.setAttribute("placeholder","Link zum Bild mit http://");
        input.setAttribute("value",src);
        
        submit.setAttribute("type","submit");
        submit.setAttribute("value","Vorschau");
        submit.setAttribute("style","margin-left: 5px;");
        submit.setAttribute("class","personImage_previewImage");
        
        td.innerHTML = "";
        td.appendChild(image);
        td.appendChild(br);
        td.appendChild(input);
        td.appendChild(submit);
    };
    
    if (h3.innerHTML === "Geburtstag:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField personBirthday"+id);
        input.setAttribute("placeholder","Geburtsdatum im Format jjjj-mm-dd Bsp: 1992-06-22");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Beschreibung:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('textarea');
        input.setAttribute("style","width:95%; height: 100%;");
        input.setAttribute("class","proxerField personDescription"+id);
        input.setAttribute("placeholder","Informationen zur Person");
        input.innerHTML = oldInner;
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Wiki-Artikel:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField personWiki"+id);
        input.setAttribute("placeholder","Artikeltitel im Wiki");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
};

//Bands Replace Handler
var bandsReplace = function (h3,td) {
    var id = $(td).parents('.proxerForm').attr('id').substr(5);
    if (h3.innerHTML === "Name:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsTitle"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Originalname:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsTitleOrig"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Synonyme:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsTitleSyn"+id);
        input.setAttribute("placeholder","");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Genre:") {
        var oldInner = td.innerHTML;
        td.innerHTML = '<table width="100%"><tbody id="bandsGenreTable'+id+'"><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="38"> <span>Alternative</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="13"> <span>Blues</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="42"> <span>C-Pop</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="29"> <span>Dance</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="37"> <span>Death Metal</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="15"> <span>Dubstep</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="14"> <span>Electronic</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="40"> <span>Enka</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="25"> <span>Folk</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="17"> <span>Funk</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="21"> <span>Gothic</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="32"> <span>Hard Rock</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="30"> <span>Heavy Metal </span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="9"> <span>Hip Hop</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="41"> <span>Indie</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="39"> <span>Industrial</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="34"> <span>Instrumental</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="5"> <span>J-Pop</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="4"> <span>J-Rock</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="8"> <span>Jazz</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="18"> <span>K-Pop</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="19"> <span>K-Rock</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="10"> <span>Klassik</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="24"> <span>Metal</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="16"> <span>Nightcore</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="26"> <span>Old School</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="35"> <span>Orchester</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="12"> <span>Punk</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="27"> <span>Rhythm and Blues</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="36"> <span>Rock'+" 'n' "+'Roll</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="20"> <span>Soul</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="28"> <span>Swing</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="33"> <span>Techno</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="31"> <span>Trance</span></td><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="6"> <span>Utaite</span></td></tr><tr><td width="20%"><input type="checkbox" class="bandsGenre'+id+'" value="7"> <span>Visual Kei</span></td></tr></tbody></table>';
        td.parentNode.getElementsByTagName('td')[0].width = "15%";
        var checked = oldInner.split(' ');
        var tableBody = document.getElementById('bandsGenreTable'+id);
        var genres = tableBody.getElementsByTagName('span');
        var genresInput = document.getElementsByClassName('bandsGenre'+id);
        for (var i = 0; i < genres.length; i++) {
            for (var j = 0; j < checked.length; j++) {
                if (genres[i].innerHTML === checked[j]) {
                    genresInput[i].setAttribute ("checked","");
                };
            };
        };
        
    };
        
    if (h3.innerHTML === "Webseite:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsLink"+id);
        input.setAttribute("placeholder","Link der Band OHNE http://");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
        
    if (h3.innerHTML === "Gründung:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsStart"+id);
        input.setAttribute("placeholder","Format: dd.mm.jjjj Bsp: 22.06.1992");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
        
    if (h3.innerHTML === "Auflösung:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsEnd"+id);
        input.setAttribute("placeholder","Format: dd.mm.jjjj Bsp: 22.06.1992");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Bild:") {
        var img = td.getElementsByTagName('img')[0];
        var src = img.src;
        var image = document.createElement('img');
        var input = document.createElement('input');
        var submit = document.createElement('input');
        var br = document.createElement('br');
        
        image.setAttribute("class","bandsImage"+ id +"_previewContainer");
        image.setAttribute("src",src);
        image.setAttribute("style","max-width: 300px; max-height: 300px; padding:5px; margin:5px; border: 1px solid;");
        
        input.setAttribute("style","width: 72.5%;");
        input.setAttribute("type","text");
        input.setAttribute("class","proxerField bandsImage"+id);
        input.setAttribute("placeholder","Link zum Bild mit http://");
        input.setAttribute("value",src);
        
        submit.setAttribute("type","submit");
        submit.setAttribute("value","Vorschau");
        submit.setAttribute("style","margin-left: 5px;");
        submit.setAttribute("class","bandsImage_previewImage");
        
        td.innerHTML = "";
        td.appendChild(image);
        td.appendChild(br);
        td.appendChild(input);
        td.appendChild(submit);
    };
        
    if (h3.innerHTML === "Beschreibung:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('textarea');
        input.setAttribute("style","width:95%; height: 100%;");
        input.setAttribute("class","proxerField bandsDescription"+id);
        input.setAttribute("placeholder","Beschreibung des Unternehmens");
        input.innerHTML = oldInner;
        td.innerHTML = "";
        td.appendChild(input);
    };
        
    if (h3.innerHTML === "Wiki-Artikel:") {
        var oldInner = td.innerHTML;
        var input = document.createElement('input');
        input.setAttribute("type","text");
        input.setAttribute("style","width:95%;");
        input.setAttribute("class","proxerField bandsWiki"+id);
        input.setAttribute("placeholder","Artikeltitel im Wiki");
        input.setAttribute("value",oldInner);
        td.innerHTML = "";
        td.appendChild(input);
    };
    
    if (h3.innerHTML === "Mitglieder:") {
        var oldInner = td.innerHTML;
        var entrys = oldInner.split("<br>");
        var a = td.getElementsByTagName('a');
        var table = document.createElement('table');
        var tBody = document.createElement('tbody');
        var tr = document.createElement('tr');
        var p = document.createElement('p');
        
        tr.innerHTML = '<th>Person</th><th>Stagename</th><th>Typ</th><th>Beschreibung</th><th></th>'
        
        table.setAttribute("class","no_details bandsMembers"+id);

        p.innerHTML = '<input type="submit" class="bandsMembers'+id+'_add" value="+">';
        
        td.innerHTML = "";
        tBody.appendChild(tr);
        table.appendChild(tBody);
        td.appendChild(table);
        td.appendChild(p);
        for (var j = 0; j < entrys.length -1; j++) {
            var index = {"vocal":"S&auml;nger","leadvocal":"Leads&auml;nger","bass":"Bassist","guitar":"Gitarrist","drum":"Schlagzeuger","dancer":"T&auml;nzer","keyboarder":"Keyboarder","leader":"Leader","misc":"Sonstige"};
            var append = '<tr>'+
	    	'<td>'+
	    	'<input type="text" class="membersField bandsMembers'+id+'_new" placeholder="Person">'+
	    	'</td><td>'+
	    	'<input type="text" class="membersField bandsMembers'+id+'_newName" placeholder="Name">'+
	    	'</td><td>'+
	    	'<select size="1" class="membersField bandsMembers'+id+'_newType">';
	    	for(var i in index){
	    		append += '<option value="'+i+'">'+index[i]+'</option>';
	    	}
	    	append+='</select></td>'+
	    	'<td><input type="text" class="membersField bandsMembers'+id+'_newDescription" placeholder="Beschreibung"></td>'+
	    	'<td><input type="submit" class="remove" value="-"></td></tr>';
        
	    	$('.bandsMembers'+id).append(append);
	    	removeFieldTable();
        };
        
        var table = document.getElementsByClassName('bandsMembers'+id)[0];
        var tr = table.getElementsByTagName('tr');
        for (var i = 1; i < tr.length; i++) {
            var j = i-1;
            var td = tr[i].getElementsByTagName('td');
            
            var index0 = entrys[j].indexOf('>');
            var index1 = entrys[j].indexOf('<',1);
            var name = entrys[j].substring(index0+1,index1);
            
            var input = td[0].getElementsByTagName('input')[0];
            var arr = [];
            arr[0] = input;
            arr[1] = name;
            $.ajax({
			    url: '/persons?format=json&s=getSearchList&search='+name,
                indexValue: arr,
				success: function( data ) {
                    var newInput = this.indexValue;
					$.map( data.list, function( item ) {
						if (data.list.length === 1) {
                            newInput[0].value = newInput[1]+" #"+item.id;
                        }else{
                            for (var j = 0; j < data.list.length; j++) {
                                if (newInput[1] === item.name) {
                                    newInput[0].value = newInput[1]+" #"+item.id;
                                };
                            };
                        };
					});
				}
			});
            
            var index0 = entrys[j].indexOf('-');
            var index1 = entrys[j].indexOf('(');
            var index2 = entrys[j].indexOf(')');
            if (index0 > -1) {
                var string1 = entrys[j].substring(index0+2,index1-1);
            };
            var string2 = entrys[j].substring(index1+1,index2);
            
            var input = td[1].getElementsByTagName('input')[0];
            if (string1 !== undefined) {
                input.value = string1;
            };
            
            var options = td[2].getElementsByTagName('option');
            for (var x = 0; x < options.length; x++) {
                if (options[x].innerHTML === string2) {
                    options[x].setAttribute("selected","");
                };
            };
            
            var input = td[3].getElementsByTagName('input')[0];
            var descr = entrys[j].split("<i>")[1];
            var index = descr.indexOf('<');
            descr = descr.substring(2,index);
            if (descr !== " ") {
                input.value = descr;
            };
        };
    };
    
    
    $('.bandsMembers'+id+'_add').off('click');
	$('.bandsMembers'+id+'_add').on('click',function(){
		var index = {"vocal":"S&auml;nger","leadvocal":"Leads&auml;nger","bass":"Bassist","guitar":"Gitarrist","drum":"Schlagzeuger","dancer":"T&auml;nzer","keyboarder":"Keyboarder","leader":"Leader","misc":"Sonstige"};
        var append = '<tr>'+
		'<td>'+
		'<input type="text" class="membersField bandsMembers'+id+'_new" placeholder="Person">'+
		'</td><td>'+
		'<input type="text" class="membersField bandsMembers'+id+'_newName" placeholder="Name">'+
		'</td><td>'+
		'<select size="1" class="membersField bandsMembers'+id+'_newType">';
		for(var i in index){
			append += '<option value="'+i+'">'+index[i]+'</option>';
		}
		append+='</select></td>'+
		'<td><input type="text" class="membersField bandsMembers'+id+'_newDescription" placeholder="Beschreibung"></td>'+
		'<td><input type="submit" class="remove" value="-"></td></tr>';
        
		$('.bandsMembers'+id).append(append);
		removeFieldTable();
		$( '.bandsMembers'+id+'_new' ).autocomplete({
			source: function( request, response ) {
                $.ajax({
					url: '/persons?format=json&s=getSearchList&search='+request.term,
					success: function( data ) {
						response( $.map( data.list, function( item ) {
							return {
								label: item.name,
								value: item.name+" #"+item.id
							}
						}));
					}
				});
			}
        });
    });
		
};

//Songs Event Handler
var songsEvent = function () {
    removeFieldTable();
    $('.newPublish').off('click');
    $('.newPublish').on('click',function(){
        var id=$(this).parents('.proxerForm').attr('id').substr(5);
        var url = "http://proxer.me/edit-beta?format=json&s=data&formid="+id;
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                var curData = response.currentData;
                var newData = response.newData;
                var data=new Object();
                data['songsTitle']=$('.songsTitle'+id).val(); if (data['songsTitle'] === undefined) {data['songsTitle'] = curData.title;};
                data['songsOrig_Title']=$('.songsOrig_Title'+id).val(); if (data['songsOrig_Title'] === undefined) {data['songsOrig_Title'] = curData.orig_title;};
                data['songsYoutube']=$('.songsYoutube'+id).val(); if (data['songsYoutube'] === undefined) {data['songsYoutube'] = curData.youtube;};
                data['songsDuration']=$('.songsDuration'+id).val(); if (data['songsDuration'] === undefined) {data['songsDuration'] = curData.duration;};
                data['songsBands']=new Array();
                var counter=0;
                var oldType=$('.songsBands'+id+'_type');
                for(var i=0;i<oldType.length;i++){
                    data['songsBands'][counter++]=new Array(oldType[i].title,oldType[i].value);
                }
                var newBands=$('.songsBands'+id+'_new');
                var newType=$('.songsBands'+id+'_newType');
                for(var i=0;i<newType.length;i++){
                    if(newType[i].value!='-'&&Number(newBands[i].value.split("#")[1])>0){
                        data['songsBands'][counter++]=new Array(newBands[i].value.split("#")[1],newType[i].value);
                    }
                }
                data['songsLyrics']=new Array();
                var counter=0;
                var lyricsDefault=$('.songsLyrics'+id+'_default');
                var lyricsType=$('.songsLyrics'+id+'_type');
                var lyricsDescription=$('.songsLyrics'+id+'_description');
                for(var i=0;i<lyricsDefault.length;i++){
                    data['songsLyrics'][counter++]=new Array(lyricsDefault[i].value,lyricsDefault[i].checked?"1":"0",lyricsType[i].value,lyricsDescription[i].value);
                }
                submitFields(data,'songs',id);
            }
        });
    });
};

//Persons Event Handler
var personsEvent = function () {
    $('.personImage_previewImage').off('click');
    $('.personImage_previewImage').on('click',function(){
        var src=$(this).prev().val();
        var id=$(this).parents('.proxerForm').attr('id').substr(5);
        $('.personImage'+id+'_previewContainer').attr('src',src);
    });
    removeFieldTable();
    $('.newPublish').off('click');
    $('.newPublish').on('click',function(){
        var id=$(this).parents('.proxerForm').attr('id').substr(5);
        var url = "http://proxer.me/edit-beta?format=json&s=data&formid="+id;
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                var curData = response.currentData;
                var newData = response.newData;
                var data=new Object();
                data['personName']=$('.personName'+id).val(); if (data['personName'] === undefined) {data['personName'] = curData.name;};
                data['personNameOrig']=$('.personNameOrig'+id).val(); if (data['personNameOrig'] === undefined) {data['personNameOrig'] = curData.name_orig;};
                data['personType']=$('.personType'+id+':checked').val(); if (data['personType'] === undefined) {data['personType'] = curData.type;};
                data['personGender']=$('.personGender'+id+':checked').val(); if (data['personGender'] === undefined) {data['personGender'] = curData.gender;};
                data['personImage']=$('.personImage'+id).val(); if (data['personImage'] === undefined) {data['personImage'] = "";};
                data['personWiki']=$('.personWiki'+id).val(); if (data['personWiki'] === undefined) {data['personWiki'] = curData.wiki;};
                data['personDescription']=$('.personDescription'+id).val(); if (data['personDescription'] === undefined) {data['personDescription'] = curData.description;};
                data['personBirthday']=$('.personBirthday'+id).val(); if (data['personBirthday'] === undefined) {data['personBirthday'] = curData.birthday;};
                submitFields(data,'person',id);
            }
        });
    });
};

//Bands Event Handler
var bandsEvent = function () {
    $('.bandsImage_previewImage').off('click');
    $('.bandsImage_previewImage').on('click',function(){
        var src=$(this).prev().val();
        var id=$(this).parents('.proxerForm').attr('id').substr(5);
        $('.bandsImage'+id+'_previewContainer').attr('src',src);
    });
    removeFieldTable();
    $('.newPublish').off('click');
    $('.newPublish').on('click',function(){
        var id=$(this).parents('.proxerForm').attr('id').substr(5);
        var url = "http://proxer.me/edit-beta?format=json&s=data&formid="+id;
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                var curData = response.currentData;
                var newData = response.newData;
                var data=new Object();
                data['bandsTitle']=$('.bandsTitle'+id).val(); if (data['bandsTitle'] === undefined) {data['bandsTitle'] = curData.title;};
                data['bandsTitleOrig']=$('.bandsTitleOrig'+id).val(); if (data['bandsTitleOrig'] === undefined) {data['bandsTitleOrig'] = curData.title_orig;};
                data['bandsTitleSyn']=$('.bandsTitleSyn'+id).val(); if (data['bandsTitleSyn'] === undefined) {data['bandsTitleSyn'] = curData.title_syn;};
                data['bandsDescription']=$('.bandsDescription'+id).val(); if (data['bandsDescription'] === undefined) {data['bandsDescription'] = curData.description;};
                data['bandsImage']=$('.bandsImage'+id).val(); if (data['bandsImage'] === undefined) {data['bandsImage'] = curData.image_id;};
                data['bandsLink']=$('.bandsLink'+id).val(); if (data['bandsLink'] === undefined) {data['bandsLink'] = curData.website;};
                data['bandsStart']=$('.bandsStart'+id).val(); if (data['bandsStart'] === undefined) {data['bandsStart'] = curData.start;};
                data['bandsEnd']=$('.bandsEnd'+id).val(); if (data['bandsEnd'] === undefined) {data['bandsEnd'] = curData.end;};
                data['bandsMembers']=new Array();
                
                var counter=0;
                var oldType=$('.bandsMembers'+id+'_type');
                var oldDescription=$('.bandsMembers'+id+'_description');
                var oldName=$('.bandsMembers'+id+'_name');
                for(var i=0;i<oldType.length;i++){
                    data['bandsMembers'][counter++]=new Array(oldType[i].title,oldType[i].value,oldDescription[i].value,oldName[i].value);
                }
                var newIndustry=$('.bandsMembers'+id+'_new');
                var newType=$('.bandsMembers'+id+'_newType');
                var newDescription=$('.bandsMembers'+id+'_newDescription');
                var newName=$('.bandsMembers'+id+'_newName');
                for(var i=0;i<newType.length;i++){
                    data['bandsMembers'][counter++]=new Array(newIndustry[i].value==''?0:newIndustry[i].value.split('#')[1],newType[i].value,newDescription[i].value,newName[i].value);
                }
                data['bandsGenre']=new Array();
                var counter=0;
                $(".bandsGenre"+id+":checked").each(function(){
                    data['bandsGenre'][counter++]=this.value;
                });
                if (data['bandsGenre'][0] === undefined) {
                    data['bandsGenre'][0] = "28";
                };
                data['bandsWiki']=$('.bandsWiki'+id).val(); if (data['bandsWiki'] === undefined) {data['bandsWiki'] = curData.wiki;};
                submitFields(data,'bands',id);
            }
        });
    });
};
           
//Submit Funktion
function submitFields(data,section,formid){
    if(formid==0){
        var ajaxLink=getCurrentLink()+'format=json&s=form&formid=0';
    }else{
        var entryId=$('#entry'+formid).find('.entryid').val();
        if(entryId>0){
            var ajaxLink='/edit-beta?section='+section+'&id='+entryId+'&format=json&s=form&formid='+formid;
        }else{
            var ajaxLink='/new-beta?section='+section+'&format=json&s=form&formid='+formid;
        }
    }
    $.post(ajaxLink,data,function(result){
        if(result.error==0){
            $('#entry'+formid).hide();
            if(formid==0){
                $('#entry'+formid).after('<h3>'+result.msg+'</h3>');
            }else{
                create_message(1,5000,result.msg);
            }
        }else{
            create_message(1,5000,result.msg);
        }
    });
}

//Whatever this does
function removeFieldTable(){
    $('.remove').off('click');
    $('.remove').on('click',function(){
        $(this).parent().parent().fadeOut('slow','linear',function(){
            $(this).remove();
        });
    });
}

//Dito
function keyAt(obj,index){
    var i=0;
    for(var key in obj){
        if((index||0)===i++)return key;
    }
}       
           
           
           
           
           
           
           
           
           

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}

function diffString( o, n ) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
  var str = "";

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
      }
  } else {
    if (out.n[0].text == null) {
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
      }
    }

    for ( var i = 0; i < out.n.length; i++ ) {
      if (out.n[i].text == null) {
        str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
      } else {
        var pre = "";

        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
          pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
        }
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }
  
  return str;
}

function randomColor() {
    return "rgb(" + (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%)";
}
function diffString2( o, n ) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  var os = "";
  var colors = new Array();
  for (var i = 0; i < out.o.length; i++) {
      colors[i] = randomColor();

      if (out.o[i].text != null) {
          os += '<span style="background-color: ' +colors[i]+ '">' + 
                escape(out.o[i].text) + oSpace[i] + "</span>";
      } else {
          os += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
      }
  }

  var ns = "";
  for (var i = 0; i < out.n.length; i++) {
      if (out.n[i].text != null) {
          ns += '<span style="background-color: ' +colors[out.n[i].row]+ '">' + 
                escape(out.n[i].text) + nSpace[i] + "</span>";
      } else {
          ns += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
      }
  }

  return { o : os , n : ns };
}

function diff( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}
