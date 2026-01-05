// ==UserScript==
// @name		PH! forum SPOILER gomb
// @author		http://prohardver.hu/tag/spammer.html
// @namespace 	https://greasyfork.org/users/2358-spammer
// @version    	0.6.5
// @description A PH! lapcsalad forumaban uj hozzaszolas irasakor megjelenik a SPOILER gomb
// @match 		http://prohardver.hu/muvelet/hsz/*
// @match 		http://itcafe.hu/muvelet/hsz/*
// @match 		http://gamepod.hu/muvelet/hsz/*
// @match 		http://mobilarena.hu/muvelet/hsz/*
// @match 		http://logout.hu/muvelet/hsz/*
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2062/PH%21%20forum%20SPOILER%20gomb.user.js
// @updateURL https://update.greasyfork.org/scripts/2062/PH%21%20forum%20SPOILER%20gomb.meta.js
// ==/UserScript==

$(document).ready(function () {
    
    //-----------------------------------------------------//
    //----- 1. Textarea sor kivalaszto --------------------//
    //-----------------------------------------------------//   

    function getNumberOfLinesInTextarea(tarea) {
        return (tarea.value.length < 1 ? 0 : tarea.value.split("\n").length);
    }
    
    function selectTextareaLine(tarea, lineNum) {
        lineNum--; // array starts at 0
        var lines = tarea.value.split("\n");
    
        if (lineNum + 1 > lines.length) {
            throw 'You supplied an index which is out of bounds!';
        }
    
        // calculate start/end
        var startPos = 0,
            endPos = tarea.value.length;
        for (var x = 0; x < lines.length; x++) {
            if (x === lineNum) {
                break;
            }
            startPos += (lines[x].length + 1);
    
        }
    
        endPos = lines[lineNum].length + startPos;
    
        // do selection
        // Chrome / Firefox
        if (typeof (tarea.selectionStart) !== "undefined") {
            tarea.focus();
            tarea.selectionStart = startPos;
            tarea.selectionEnd = endPos;
            return true;
        }
    
        // IE
        if (document.selection && document.selection.createRange) {
            tarea.focus();
            tarea.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
            return true;
        }
    
        return false;
    }
    
    //---------------------------------------------//
    //----- 2. Gombok kinezete --------------------//
    //---------------------------------------------//  
  
    var $spoiler_button_CSS = {
     
      	"font-family":"Tahoma,Kalimati,sans-serif",
        "font-weight":"bold",
        "min-width":"90px",
        "height":"23px"
 
    }
    
    var $spoiler_button_with_title_CSS = {"width":"120px"};
    var $spoiler_button_with_link_title_CSS = {"width":"180px"};
    
    var $spoiler_button = '<input type="button" value="SPOILER" id="spoiler_button">';
    var $spoiler_button_with_title = '<input type="button" value="SPOILER (+cím)" id="spoiler_button_with_title">';
    var $spoiler_button_with_link_title = '<input type="button" value="SPOILER (+linkesített cím)" id="spoiler_button_with_link_title">';
    
    //-----------------------------------------------------//
    //----- 3. Textarea + gombok beszurasa ----------------//
    //-----------------------------------------------------//  
    
    $('textarea').attr("id","commentbox"); //hozzadunk egy ID-t.
    var $commentbox = $('#commentbox');
    $('.buttons:eq(1)').after('<div class="buttons" id="extra_buttons">'+$spoiler_button + $spoiler_button_with_title + $spoiler_button_with_link_title+'</div>'); //beszurunk egy uj button divet a a gyariak utan (utolso, smiley div ele)
    
    //-----------------------------------------------------------------------------------------------//
    //----- 4. Gombok -------------------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------//  
    // A gombok szovegkiemelo funkciojanak megvalositasaert koszonet Sk8erPeternek a segitsegert!----//
    //-----------------------------------------------------------------------------------------------//
    
    $('#spoiler_button').css($spoiler_button_CSS); //ugy nezzenek ki, mint a "gyari" gombok
    $('#spoiler_button_with_title').css($spoiler_button_CSS).css($spoiler_button_with_title_CSS); //ugy nezzen ki, mint a "gyari" gombok + egyeni
    $('#spoiler_button_with_link_title').css($spoiler_button_CSS).css($spoiler_button_with_link_title_CSS); //ugy nezzen ki, mint a "gyari" gombok + egyeni
    
   	var tarea = document.getElementById('commentbox');
	var $tarea = $(tarea);
    var $spoiler_block_start = '[B][SPOILER][/B][OFF]';
    var $spoiler_block_end = '[/OFF][B][/SPOILER][/B]';
    var $type_here_placeholder = '----Kezdheted pötyögni a spoileres szöveget----';
    var $prompt_title_text = 'Írd be a címét annak, amiről a spoilert írod (pl. The Sopranos 1x01)';
    var $prompt_link_text = 'Másold be a címhez tartozó linket (pl. IMDB link). Ha mégsem akarsz linket hozzáadni, hagyd üresen és akkor csak a címet fogja beilleszteni.';

    	//------------------------------------------//
    	// --- 4.1. Sima SPOILER gomb megnyomasa ---//
    	//------------------------------------------//
        $('#spoiler_button').click(function () {
            
            //beszuras  
            try {
                var textToInsert =
                  '' 
                + ''
                + '\n'+$spoiler_block_start
                + '\n'+$type_here_placeholder
                + '\n'+$spoiler_block_end;
        
                $tarea.val($tarea.val() + textToInsert);
                
                var numberOfLinesToInsert = textToInsert.split("\n").length;
                var numberOfLinesInTextareaAfterInsertion = getNumberOfLinesInTextarea(tarea);
        
                var numberOfLineToSelectFromTextToInsert = 3;
                if (numberOfLineToSelectFromTextToInsert > numberOfLinesToInsert) {
                    throw 'You can\'t select a line that is out of bounds.';
                }
               
                selectTextareaLine(tarea, numberOfLinesInTextareaAfterInsertion - numberOfLinesToInsert + numberOfLineToSelectFromTextToInsert);
        
            } catch (err) {
                alert('An error occurred: ' + err);
            }
        
        }); //click vege
    
 
    	//-----------------------------------------------------//
    	// --- 4.2. Cimmel ellatott SPOILER gomb megnyomasa ---//
    	//-----------------------------------------------------//
        $('#spoiler_button_with_title').click(function () {
            
            
            var $prompt_title = prompt($prompt_title_text, "");
                
            //csekkoljuk, hogy irtak-e cimet
            if ($prompt_title === null){
                
                var $title = ""; //nincs cim, 'Cancel'-t nyomott
            
            } else if ($prompt_title === '') {
            
                var $title = ""; //nincs cim, 'Enter'-t nyomott
            
            } else if ($prompt_title.length > 0) {
                
                var $title = '[B]'+$prompt_title+'[/B]'; //irt cimet
            
            } else {
             
                var $title = ""; 
                
            }
            
        	//beszuras   
            try {
                var textToInsert =
                  $title  
                + '\n'
                + '\n'+$spoiler_block_start
                + '\n'+$type_here_placeholder
                + '\n'+$spoiler_block_end;
        
                $tarea.val($tarea.val() + textToInsert);
                
                var numberOfLinesToInsert = textToInsert.split("\n").length;
                var numberOfLinesInTextareaAfterInsertion = getNumberOfLinesInTextarea(tarea);
        
                var numberOfLineToSelectFromTextToInsert = 4;
                if (numberOfLineToSelectFromTextToInsert > numberOfLinesToInsert) {
                    throw 'You can\'t select a line that is out of bounds.';
                }
               
                selectTextareaLine(tarea, numberOfLinesInTextareaAfterInsertion - numberOfLinesToInsert + numberOfLineToSelectFromTextToInsert);
        
            } catch (err) {
                alert('An error occurred: ' + err);
            }
        
        }); //click vege
    
    
    	//-----------------------------------------------------------------//
        // --- 4.3. Linkesitett cimmel ellatott SPOILER gomb megnyomasa ---//
    	//-----------------------------------------------------------------//
        $('#spoiler_button_with_link_title').click(function () {
            
 			//bekerjuk a cimet
            var $prompt_title = prompt($prompt_title_text, "");
                
            //csekkoljuk, hogy irtak-e cimet
            if ($prompt_title === null){
                
                var $title = ""; //nincs cim, 'Cancel'-t nyomott
            
            } else if ($prompt_title === '') {
            
                var $title = ""; //nincs cim, 'Enter'-t nyomott
            
            } else if ($prompt_title.length > 0) {
                
                var $title = '[B]'+$prompt_title+'[/B]'; //irt cimet
            
            } else {
             
                var $title = ""; 
                
            }
            
            //bekerjuk a linket
            var $prompt_link = prompt($prompt_link_text, "");
            
            //csekkoljuk, hogy irtak-e linket
            if ($prompt_link === null){
                
                var $insert_title_format = $title; //nincs link, 'Cancel'-t nyomott, ezert csak a cimet szurjuk be
            
            } else if ($prompt_link === '') {
            
                var $insert_title_format = $title; //nincs link, 'Enter'-t nyomott, ezert csak a cimet szurjuk be
            
            } else if ($prompt_link.length > 0) {
                
                        if ($title.length > 0) {
                            
                            var $insert_title_format = '[L:'+$prompt_link+']'+$title+'[/L]'; //irt linket es cimet is, megformazzuk
                        
                        } else { 
                            
                            var $insert_title_format = '[L:'+$prompt_link+'][link][/L]'; //csak linket irt, de cimet nem
                        }                      
            
            } else {
             
                var $insert_title_format = $title; //barmilyen egyeb esetben csak cimet szurunk be
            }


            //beszuras  
            try {
                var textToInsert =
                  $insert_title_format 
                + '\n'
                + '\n'+$spoiler_block_start
                + '\n'+$type_here_placeholder
                + '\n'+$spoiler_block_end;
        
                $tarea.val($tarea.val() + textToInsert);
                
                var numberOfLinesToInsert = textToInsert.split("\n").length;
                var numberOfLinesInTextareaAfterInsertion = getNumberOfLinesInTextarea(tarea);
        
                var numberOfLineToSelectFromTextToInsert = 4;
                if (numberOfLineToSelectFromTextToInsert > numberOfLinesToInsert) {
                    throw 'You can\'t select a line that is out of bounds.';
                }
               
                selectTextareaLine(tarea, numberOfLinesInTextareaAfterInsertion - numberOfLinesToInsert + numberOfLineToSelectFromTextToInsert);
        
            } catch (err) {
                alert('An error occurred: ' + err);
            }
        
        }); //click vege
    

    
}); //script vege
