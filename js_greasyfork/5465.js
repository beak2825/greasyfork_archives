// ==UserScript==
// @name       CrackedPageOne
// @namespace  digital-utopia.org
// @version    0.3
// @description  combines multi-page Cracked.com articles into a single page.
// @match      http://www.cracked.com/*
// @copyright  2014, Digital_Utopia
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/5465/CrackedPageOne.user.js
// @updateURL https://update.greasyfork.org/scripts/5465/CrackedPageOne.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;

var pages=[];
//$.noConflict();
$( document ).ready(function() {
    
    
    var ps = parseInt($(".paginationNumber:eq(0)").html());
    var pe = parseInt($(".paginationNumber:eq(1)").html()); 
    var doHtml =false;
    $(".paginationNumber:eq(1)").html("1");
    if(ps==1 && pe > 1)
    {
        var pathname = window.location.pathname;
        if(pathname.indexOf("_p1")!=-1)
        {
			pathname=pathname.substring(1,pathname.length-2);            
        }else if(pathname.indexOf("html")!=-1){
            pathname=pathname.substring(1,pathname.length-5)+"_p";
            doHtml=true;
        	
        }else{
			pathname=pathname.substring(1,pathname.length-1)+"_p";
            
         
        }
        for(var i=(ps+1); i <= pe;i++)
        {
         if(doHtml==false)
         {
         	pages.push("http://www.cracked.com/"+pathname+i+"/");   
         }else{
            pages.push("http://www.cracked.com/"+pathname+i+".html"); 
            console.log("http://www.cracked.com/"+pathname+i+".html");
         }
        }
        
        loadPage(0);
    }
    function loadPage(index)
    {
        $.get(pages[index],function(data){
            var content=($(".body > section",data).html());
            var doWrap=false;
            if(content == undefined)
            {
                content=($(".articleWrapper",data).html());
                doWrap=true;
            }
            if(doWrap==false){
            $(".body > section:eq(0)").append(content);
            }else{
               $(".articleWrapper").append(content); 
            }
            $("img",".body > section:eq(0)").each(function(){
               $(this).attr("src",$(this).attr("data-img"));
            });
            if(pages[index+1]!=undefined)
            {
                loadPage(index+1);   
            }
        });
        
    }
    $(".next").removeAttr("href")
    $(".next").attr("class",$(".next").attr("class")+" disabled");
    
    
});
                    


