// ==UserScript==
// @name           HTML Item List Creator
// @description    Auto create item lists  from wowhead.com comparisons
// @namespace      http://mogboutique.tumblr.com/
// @author         http://mogboutique.tumblr.com/
// @include        http://*.wowhead.com/compare?items*
// @grant          none
// @version        0.0.2
// @downloadURL https://update.greasyfork.org/scripts/17883/HTML%20Item%20List%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/17883/HTML%20Item%20List%20Creator.meta.js
// ==/UserScript==






$('#su_table').before("<div id='html_item_list' style='border:1px dashed;margin-botto:20px;padding:20px;'><h3>Hi! This is HTML Item List Creator.</h3>Click one of this buttons below to generate the code you need, then copy the contents:<br /><br /> <button id='autobtn' style='margin-right:10px;'>HTML Code (Blogs)</button><button id='reddit'>Markdown (Reddit)</button><button id='bbcode' style='margin-left:10px;'>BBCode (Forums)</button><br /><br />For updates, click <a href='http://tmblr.co/Zj6X5vZ-Es2N'>here</a>.<br /><br /><textarea id='autoitems' style='font-size:12px;display:none;width:100%;min-height:110px;background:transparent;border:1px solid;color:green;text-shadow:0 0 3px green;' spellcheck='false'></textarea></div>");




var table2 = [
	            '' ,//0
	            'Head: ' ,//1
	            'Neck: ' ,//2
	            'Shoulders: ' ,//3
	            'Shirt: ' ,//4
	            'Chest: ' ,//5
	            'Waist: ' ,//6
	            'Legs: ' ,//7
	            'Boots: ' ,//8
	            'Wrists: ', //9
	            'Hands: '  ,  //10
	            '' ,  //11,
	            '' ,  //12
	            '1H Weapon: ',//13,
	            'Shield: ' ,   //14
	            'Ranged: ' ,  //15
	            'Cloak: ' ,   //16
	            '2H Weapon: ' //17

             ];


table2[23] = 'Off-hand: ';


var fakeDiv= $('<div id="fake" style="display:none;"></div>').appendTo('body');





function Markdown(url,name,slot) {
	  
	
}




$('#autobtn').click(createList);
$('#reddit').click(Markdown);
$('#bbcode').click(BBCode);



function createList(){
	
	$( fakeDiv ).html( '' );
	
   $('div.summary-group-bottom .iconsmall a').each(function(){
	
	var href=$(this).attr('href');
	var match = href.match(/\/item=(\d+)/)[1];
	
	var url = 'http://www.wowhead.com/item='+ match;
	
	if(match) {
		
	
		
		var a  = $('<a>').attr('href','http://www.wowhead.com/item='+ match );
	
		$( fakeDiv ).append( a );
		
		var slot = g_items[match].jsonequip.slot;
		var name = g_items[match].name_enus;
		
	    
		
		if( slot && table2[slot] )
		   $( a ).before( table2[slot] );
		  

		if( name )
			 $( a ).text( name );
		
		$(a).after('<br>');
		
				
	}
	
});
    
    text =  fakeDiv.html();
	
	text = text + '<br><a href="http://www.wowhead.com' + $('#su_link').attr('href') +'">View on Wowhead</a>';
	

    
    baseURI = document.baseURI;
    var uri = baseURI.match(/http:\/\/[a-z]+.wowhead.com\//)[0];
    
    if(uri)  {
 

     $('#autoitems').text(text).fadeIn() ;
		
    }
    else {
      $('#autoitems').text('Error :(').fadeIn() ;
    }
}

function Markdown(){
	
	$( fakeDiv ).html( '' );
	
   $('div.summary-group-bottom .iconsmall a').each(function(){
	
	var href=$(this).attr('href');
	var match = href.match(/\/item=(\d+)/)[1];
	
	var url = 'http://www.wowhead.com/item='+ match;
	
	if(match) {
		
	
		
		var slot = g_items[match].jsonequip.slot;
		var name = g_items[match].name_enus;
		
	    
		

		if( name ){
			
			if( slot && table2[slot] ) $( fakeDiv ).append(  table2[slot] );
			
			$( fakeDiv ).append(  '[' + name + '](' + url + ')\n\n' );
		}
			 
		
				
	}
	
});
    
    text =  fakeDiv.html();
	
	text = text + '[View on Wowhead](http://www.wowhead.com' + $('#su_link').attr('href') +')';
	

    
    baseURI = document.baseURI;
    var uri = baseURI.match(/http:\/\/[a-z]+.wowhead.com\//)[0];
    
    if(uri)  {
 

     $('#autoitems').text(text).fadeIn() ;
		
    }
    else {
      $('#autoitems').text('Error :(').fadeIn() ;
    }
}

function BBCode(){
	
	$( fakeDiv ).html( '' );
	
   $('div.summary-group-bottom .iconsmall a').each(function(){
	
	var href=$(this).attr('href');
	var match = href.match(/\/item=(\d+)/)[1];
	
	var url = 'http://www.wowhead.com/item='+ match;
	
	if(match) {
		
	
		
		//var a  = $('<a>').attr('href','http://www.wowhead.com/item='+ match );
	
		//$( fakeDiv ).append( a );
		
		var slot = g_items[match].jsonequip.slot;
		var name = g_items[match].name_enus;
		
	    
		
		if( slot && table2[slot] )
		   //$( a ).before( table2[slot] ); 
		   $(fakeDiv).append( table2[slot] )
		  

		if( name )
			$(fakeDiv).append( '[url=' + url + ']' + name + '[/url]'); 
					
	}
	
});
    
    text =  fakeDiv.html();
	
	text = text + '[url=http://www.wowhead.com' + $('#su_link').attr('href') +']View on Wowhead[/url]\n';
	

    
    baseURI = document.baseURI;
    var uri = baseURI.match(/http:\/\/[a-z]+.wowhead.com\//)[0];
    
    if(uri)  {
 

     $('#autoitems').text(text).fadeIn() ;
		
    }
    else {
      $('#autoitems').text('Error :(').fadeIn() ;
    }
}



