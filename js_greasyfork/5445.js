// ==UserScript==
// @name       990.ro Enhancer
// @namespace  http://andreipham.com
// @version    0.5
// @description  Enhances 990.ro
// @match      http://www.990.ro/*
// @copyright  2014, Andrei Pham
// @downloadURL https://update.greasyfork.org/scripts/5445/990ro%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/5445/990ro%20Enhancer.meta.js
// ==/UserScript==

function App()
{
    this.shows = (arguments !== null && arguments != undefined) ? arguments : false;
    
    this.adZones = new Array(
        
        "#coloana-dreapta div > iframe",
        ".a-el",
        "#content div > iframe"
        
    );
    
    this.highlightShows = function(){
      
        for(var i=0; i<this.shows.length; i++)
        {
            $(".ss [title='"+this.shows[i]+"']").eq(0).css("background-color", "rgba(0, 0, 0, 1.0)").parent().insertBefore($(".ss").eq(0));
        }
        
    };
    
    this.hideAds = function(){
      
        for(var i=0; i<this.adZones.length; i++)
        {
            $(this.adZones[i]).remove();
        }
        
    };
    
    this.reorder = function(){
        
        $("#content > div:nth-child(6)").insertAfter("#content > div:nth-of-type(2)");
        
    };
    
    this.repairLinks = function(){
      
        var id = "",
            ids = new Array(),
            auxHref = "",
            ultimateHref = "";
        
        $("#content div div div a[href^=seriale2-]").each(function(){
           
            $(this).attr("target", "_blank");
            
            ids = $(this).attr("href").split("-");
            id = ids[1] + "-" + ids[2];
            
            auxHref = "player-serial-" + id + "-sfast.html";
            $(this).attr("href", auxHref);
            
            $(this).on("click", function(e){
                
                e.preventDefault();
                
                $.get($(this).attr("href"), function(data){
                    
                    ultimateHref = $("<div>" + data + "</div>").find("#content > div > div:nth-child(2) > a").attr("href");
                    
                    ultimateHref = "http://" + ultimateHref.split("http://")[2];
                    
                    window.open(ultimateHref, "_blank");
                    
                });
                
            });
            
            
        });
        
    };
    
    this.init = function(){
      
        this.highlightShows();
        
        this.hideAds();
        
        this.repairLinks();
        
        this.reorder();
        
    };
    
    this.init();
}

var app = new App("Once upon a time", "The walking dead", "Falling skies", "Lost", "Intelligence", "Lie to me", "Dominion", "Gotham", "The Knick", "The Strain");