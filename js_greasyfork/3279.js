// ==UserScript==
// @name           osu! Activity Hover Details
// @description    Hover on Recent Activities / Best Performance to see score details
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        https://osu.ppy.sh/u/*
// @include        http://osu.ppy.sh/u/*
// @require        http://code.jquery.com/ui/1.10.4/jquery-ui.js
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @copyright      2014, Jeb
// @version        0.1.2.10
// @namespace      https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/3279/osu%21%20Activity%20Hover%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/3279/osu%21%20Activity%20Hover%20Details.meta.js
// ==/UserScript==
function addStyle(style) {
    var head = document.getElementsByTagName("head")[0];
    var ele = head.appendChild(window.document.createElement( 'style' ));
    ele.innerHTML = style;
    return ele;
}
addStyle('@import "//ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/themes/base/jquery-ui.css"');
$(function() {
    
    $( document ).tooltip({
        items: ".event, .prof-beatmap",
        content: function(){
            var element = $( this );
            if (typeof(element.attr("title"))=="undefined"){
                
                $( ".event" ).click(function() {
                    element=$(this);
                    if (typeof(element.attr("title"))=="undefined"){
                        u=userId;
                        b=element.children(0).last()[0].outerHTML.replace(/((.|\n)+)\/b\/(\d+)((.|\n)+)/,"$3");
                        m=element.children(0).last()[0].outerHTML.replace(/((.|\n)+)\/b\/(\d+)\?m=(\d+)((.|\n)+)/,"$4");
                        $.get("http://wa.vg/apis/tooltip.php", {
                            'm':m,'u':u,'b':b
                        }, function(data) {
                            element.attr("title",data);
                        });
						element.attr("title","Loading...");
						return "Loading...";
                    }
                    
                });
                $( ".prof-beatmap" ).click(function() {
                    element=$(this);
                    if (element.attr("id").indexOf("performance")==0){
						if (typeof(element.attr("title"))=="undefined"){
							u=userId;
							cd=$(element.children(0).children(0).children(0).children(0).children(0)[0]).children(0)[1].innerHTML;
							m=cd.replace(/<a href="\/b\/.*?\?m=(.*?)">.*/,"$1");
							b=cd.replace(/<a href="\/b\/(.*?)\?m=.*?">.*/,"$1");
							$.get("http://wa.vg/apis/tooltip.php", {
								'm':m,'u':u,'b':b
							}, function(data) {
								element.attr("title",data);
							});
							element.attr("title","Loading...");
							return "Loading...";
						}
                    }else return element.attr("title");
					;
                });
                return "Click on a score to load";
            }else return element.attr("title");
        }
    });

    
});