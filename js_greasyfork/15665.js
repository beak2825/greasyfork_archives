// ==UserScript==
// @name         Youtube Repeat
// @namespace    Fabi
// @version      1.2
// @description  Repetir youtube
// @author       You
// @include      http*://www.youtube.com/watch?v=*
// @downloadURL https://update.greasyfork.org/scripts/15665/Youtube%20Repeat.user.js
// @updateURL https://update.greasyfork.org/scripts/15665/Youtube%20Repeat.meta.js
// ==/UserScript==

// Podría haberme evitado toda esta cosa de jQuery
// Pero la paja es más fuerte.
// Fabi.

// a function that loads jQuery and calls a callback function when jQuery has finished loading
// http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


addButton=function($){
    var templat='<div class="ytRContainer"><input type="checkbox" class="ytRepeat" style="display:none" id="ytRepeat"'+((localStorage.YTR==1)?' checked':'')+'><label for="ytRepeat" id="ytrb" class="btn'+((localStorage.YTR==1)?' r':'')+'">Loop</label></div>';
    var styleSheet='<style>.ytRContainer{display: inline-block;color: #979797;font-size: 10px;font-family: "Roboto";position: relative;top: -2px;}.btn{background:#f0f0f0;border:none;color:#707070;padding:8px 15px;border-radius:3px;cursor:pointer;outline:none;border-bottom:solid 4px #e0e0e0;position:relative;font-weight:bolder;letter-spacing:.8px}.btn:active{top:2px;border-bottom:solid 3px #e0e0e0}.btn.r{background:#F95859;color:#f0f0f0;border-color:#E43838}.btn.b{background:#3498db;color:#f0f0f0;border-color:#277FBA}</style>';

    $('head').append(styleSheet);
    $('#watch8-secondary-actions').append(templat);
}

function main() {
    
    //Well, I need $ 
    (function($){
        
        if(localStorage.YTR == null){localStorage.setItem('YTR','0');} //Set if not setted (?
       
        //Add Button
        addButton($);
                
        if(localStorage.YTR==1){
            $('video.video-stream.html5-main-video').attr('loop','');
        }
        $('body').on('change','.ytRepeat',function(){
            localStorage.YTR = ($(this).is(':checked'))?1:0;
            if($(this).is(':checked')){
                $('video.video-stream.html5-main-video').attr('loop','');
                if(!$('#ytrb').hasClass('r')){
                    $('#ytrb').addClass('r');
                }
            }else{
                $('video.video-stream.html5-main-video').removeAttr('loop');
                 if($('#ytrb').hasClass('r')){
                    $('#ytrb').removeClass('r');
                }
            }
        });
        //AJAX? WHO WANTS AJAX?
        $('body').on('click','a',function(e){
            
            if($(this).attr('target') == '_blank'){
                e.preventDefault();
                e.stopPropagation();
                window.open($(this).attr('href'));
            }
            else if(!$(this).attr('href').startsWith('#')){ //Really m8?
                e.preventDefault();
                e.stopPropagation();
                location.href=$(this).attr('href');
            }
        });

    })(jQ); //$ instead jQ, nice trick (?
}

// load jQuery and execute the main function
addJQuery(main);