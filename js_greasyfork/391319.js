// ==UserScript==
// @name         Facebook - közvetlen hivatkozások
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Facebook közvetlen megosztási hivatkozások
// @author       vacsati
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391319/Facebook%20-%20k%C3%B6zvetlen%20hivatkoz%C3%A1sok.user.js
// @updateURL https://update.greasyfork.org/scripts/391319/Facebook%20-%20k%C3%B6zvetlen%20hivatkoz%C3%A1sok.meta.js
// ==/UserScript==
var ikon={svg_1:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="height: 16px;vertical-align: text-bottom; fill: #616770;">',
          link:'<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
          cset:'<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>',
          kep:'<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
          film:'<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
          svg_0:'</svg>'};
(function() {
    $.fn.testFn = function(){
        this.each(function(){
            var cucc=$(this).find('span:nth-child(3)').find('span:first').find('a:first').attr('href');
            if(cucc){
                var arr = cucc.split('/');console.log("ar:",arr);
                var csatorna=arr[1];
                var cim=arr[3];
                var cim2;
                if(arr[2]=="posts"){
                    cim2=cim.split('?');
                    $(this).append(" · <a href='https://www.facebook.com/"+csatorna+"/posts/"+cim2[0]+"'>"+ikon.svg_1+ikon.cset+ikon.svg_0+"</a>");
                }
                else if(arr[2]=="videos"){
                    $(this).append(" · <a href='https://www.facebook.com/"+csatorna+"/posts/"+cim+"'>"+ikon.svg_1+ikon.cset+ikon.svg_0+"</a>");
                    $(this).append(" · <a href='https://www.facebook.com/"+csatorna+"/videos/"+cim+"'>"+ikon.svg_1+ikon.film+ikon.svg_0+"</a>");
                }
                else if(arr[2]=="photos"){
                    cim2=arr[4];
                    $(this).append(" · <a href='https://www.facebook.com/"+csatorna+"/photos/"+cim2+"'>"+ikon.svg_1+ikon.kep+ikon.svg_0+"</a>");
                }
                else console.log(arr);
            }
        });
    };
    $.fn.test2Fn = function(){
        this.each(function(){
            var frm=this.closest( "form" );
            var css_d="position:absolute; top:-4px; left:0; right: 0;";
            var css_a="display: inline-block; margin-left: calc(50% - 14px); background: white; border: 1px solid #eeeff0; padding: 2px; border-radius: 4px; margin-top: -10px;";
            console.log("post:",this.value,frm);
            $(frm).prepend("<div style='"+css_d+"'><a href='posts/"+this.value+"' style='"+css_a+"'>"+ikon.svg_1+ikon.cset+ikon.svg_0+"</a></div>");
        });
    };
    'use strict';
    //$('*[data-testid="fbfeed_story"]').append("<p>Test</p>");

    $(document).ready( function() {
    });
    $('body').bind("DOMSubtreeModified",function(e){
        setTimeout(function(){
            console.log('!');
            $('*[data-testid="story-subtitle"]:not(.kiv)').addClass("kiv").testFn();
            $('input[name="ft_ent_identifier"]:not(.forrS)').addClass("forrS").test2Fn();
        }, 1000);
    });
})();