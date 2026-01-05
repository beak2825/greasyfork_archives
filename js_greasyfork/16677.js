// ==UserScript==
// @name        Copy Important links Directly 
// @namespace   Sality
// @description Copy important link in text area
// @include     *kat.cr/*
// @version     0.8Beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16677/Copy%20Important%20links%20Directly.user.js
// @updateURL https://update.greasyfork.org/scripts/16677/Copy%20Important%20links%20Directly.meta.js
// ==/UserScript==


    
try{
    
    
   var pathname = window.location.pathname;
    //Spam Testing script -----------------------------------------------------------------------------------------------------------------------------------------------
    
    if ((pathname.indexOf('\/user\/') != 0)&&(pathname.indexOf('\/community\/') != 0)&&(pathname.indexOf('\/messenger\/') != 0)){
    if ($('div.mainpart table.data').length) {
        
        $('div.mainpart table.data .torrentname ').each(function(){
            var link = pathname.protocol + '//' + pathname.host +$('a.cellMainLink',$(this)).attr('href');
            $(this).before('<i title="Copy Link" class="ka ka16 ka-arrow-right ka-red sality" style="float:right;"></i>');
            
            
                              
        });
        addtextarea();  
}
}
    
    
    function addtextarea(){
        if($('.mainpart [class="pages botmarg5px floatright"]').length){
            if($('#mainSearchTable').length){
        $('.mainpart [class="pages botmarg5px floatright"]').after('<textarea class="botmarg5px quicksubmit" name="content" rows="10" cols="" id="salityx"></textarea>');
        
        $('.mainpart a.rsssign').after('<i title="Copy Link" class="ka ka16 ka-reply blueButton " style="float:right;margin:0px 5px;" id="sality-copyall" ></i>');
        
            }
            else{
                 
             }
        }
        else{
         if($('#mainSearchTable').length){
            $('#mainSearchTable table[style="width: 100%"]').after('<textarea class="botmarg5px quicksubmit" name="content" rows="10" cols="" id="salityx"></textarea>');
         }
             else{
                 $('div.torrentMediaInfo').after('<textarea class="botmarg5px quicksubmit" name="content" rows="10" cols="" id="salityx"></textarea>');
             }
            
        }
    }
    function addLink(url){
        $('#salityx').val($('#salityx').val()+url+"\n");
    }
    
      $('#sality-copyall').click(function(){
      	var n=0;var temp="";
		$('.data .torrentname a.cellMainLink').each(function(){
			var url =window.location.protocol + '//' + window.location.host +$(this).attr('href');
			temp+=url+"\n";
			n++;
			if(n%15==0){
				temp+="\n";
			}
			});
			$('#salityx').val(temp);
	});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('div.mainpart table.data .sality').click(function(){
        var $temp =$(this).parent();
        var url =window.location.protocol + '//' + window.location.host +$('.torrentname a.cellMainLink',$temp).attr('href');
            addLink(url);
    });
    
}//try end
    catch(ex){
        console.log("imp link :Error IN script /Page . Inform Sality");
        }