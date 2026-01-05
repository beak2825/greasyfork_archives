// ==UserScript==
// @name        Spam Thread check
// @namespace   Sality
// @description Spam link check
// @include     *kat.cr/*
// @version     0.8 Beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16647/Spam%20Thread%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/16647/Spam%20Thread%20check.meta.js
// ==/UserScript==



var blockList = / http:\/\/|www\.|weight loss|gain muscle|brain pill|boost your memory|Save Your Fingers From Aging|Improve concentration|anti aging skin|best fat Loss solution|skin care|skincare/;
var okList = /congrats|adopt|latest|torrent|community|release|mod|request/;

    var pathname = window.location.pathname;
try{

    
    
    //Spam Testing script -----------------------------------------------------------------------------------------------------------------------------------------------
    if ($('ul#latestForum').length) {
        
        $('ul#latestForum li').each(function(){
            var title = $('p.latest-title',$(this)).text().trim().toLowerCase();
            if(title.match(blockList))
            {
                $('span.explanation',$(this)).after('<span style="padding:5px;background-color:#cc1212;color:#fff;" class="sality">&nbsp;X&nbsp;</span>');

            }
            else if(title.match(okList))
            {
                $('span.explanation',$(this)).after('<span style="padding:5px;background-color:#00cc00;color:#fff;" class="sality">Ok</span>');
                
                
            }
            else
            {
                $('span.explanation',$(this)).after('<span style="padding:5px;background-color:#ff9900;color:#fff;" class="sality">&nbsp;#&nbsp;</span>');
                
                
            }
            
        });
    console.log("Probable Spamming Detection Done");    
}

    //community check-------------------------------------------------------------------------------------------------------------------------------------------------------
    
  if (pathname.indexOf('\/community\/') != -1) {
       
        //if($('table.data .showBlockJS div.markeredBlock a.cellMainLink').length)
            
            
            
            $('table.data .showBlockJS tr td:nth-child(2) div.markeredBlock').each(function(){
                
            var title = $('a.cellMainLink',$(this)).text().trim().toLowerCase();
                
            if(title.match(blockList))
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#cc1212;color:#fff;" class="sality">Spam</span>');
                     
            } 
                else if(title.match(okList))
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#00cc00;color:#fff;" class="sality">&nbsp; Ok &nbsp;</span>');
                
            }
            else
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#ff9900;color:#fff;" class="sality">Check</span>');
                   
            }         
});
        
         //community page top links----------------------------------------------------------------------------------------------------------------------------------------
                $('table[class="data clear"] div.markeredBlock').each(function(){
                    var title = $('a.cellMainLink',$(this)).text().trim().toLowerCase();
            if(title.match(blockList))
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#cc1212;color:#fff;" class="sality">Spam</span>'); 
                
            }
            else if(title.match(okList))
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#00bb22;color:#fff;" class="sality">&nbsp; Ok &nbsp;</span>');
                
            }
            else
            {
                $('a.cellMainLink',$(this)).after('<span style="padding:5px;background-color:#227799;color:#fff;" class="sality">Check</span>');
                
            }
                });
   }
        
    $('table.data span.sality').css({"border-radius":"5px","float":"right"});
   $('ul#latestForum li span.sality').css({"border-radius":"5px","margin-top":"-25px","margin-left":"-5px","position":"absolute"});
}//try end
    catch(ex){
        Console.log("Error IN script /Page . Inform Sality");
        }

//special Thanks to Gazza-911