// ==UserScript==
// @name        deviantART easy scroll
// @description Scrolls image to middle and allows horizontal scroll on mouse move event
// @namespace   https://greasyfork.org/users/2366-graenfur
// @author      Graenfur
// @include     *deviantart.com*
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1898/deviantART%20easy%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/1898/deviantART%20easy%20scroll.meta.js
// ==/UserScript==


function main() {
    var b = $('body'), //body
        ph = $('.dev-page-view'), //page holder
        ih = $('.dev-view-deviation'), //image holder
        sd = 0; //scrollable distance
    
    //force large images to be scrollable inline instead of making the whole page as wide as image
    $('<style>.view-mode-full_zoomed .dev-view-deviation{overflow-x:scroll;}</style>').appendTo('head');
    
    b.on("mouseup",".dev-view-deviation img", function (e) { if(e.button == 0){
        //refreshing variables
        ph = $('.dev-page-view');
        ih = $('.dev-view-deviation');
        
        var img = $(this), //image
            iw = img.attr("width"), //image width
            hasZoomIn = ph.hasClass("cursor-zoom-in"), //can be zoomed in
            hasZoomOut = ph.hasClass("cursor-zoom-out"); //can be zoomed out
            
        sd = iw - b.width(); //scrollable distance
        
        
        if(hasZoomIn && !hasZoomOut){console.log(img.offset().top);
            $('html, body, .dev-view-deviation').stop().animate({
                scrollTop:(img.offset().top),
                scrollLeft:sd/2 //scrolls to zoomed images middle
            },400,function(){
                if(ph.hasClass('view-mode-full_zoomed')){ //after full zoom
                    b.addClass('animated'); //signal that mousemove can add scrolling
                }
            });
        }else if(hasZoomOut){
            $('html, body, .dev-view-deviation').stop().animate({
                scrollTop:0,
                scrollLeft:0
            },400);
            b.removeClass('scrollable animated');
        }
    }});
    
    
    var mouseX = 0,
        nweMouseX = 0,
        oldMouseX = 0,
        sp = 0, //scroll position
        xp = 0; //x position
    
    b.on('mousemove','.dev-view-deviation',function(e){
        newMouseX = e.pageX;
        if(newMouseX != oldMouseX){
        	mouseX = newMouseX;
            oldMouseX = newMouseX;
        	mouseX += (mouseX-(b.width()/2))*0.3; //increases mousemove/scroll sensitivity closer to edges
        	if(b.hasClass('animated')){
            	b.addClass('scrollable'); //allows scrolling after image is zoomed
        	}
        }
    });
    
    //scroll easing loop
    var loop = setInterval(function(){
        if(b.hasClass('scrollable')){
            xp += (mouseX - xp) / 10; //easig
            sp = (xp/b.width())*sd; //converts mouse position to scroll position
            $('.dev-view-deviation').scrollLeft(sp);
        }else{
            xp = b.width()/2; //force scrolling to start from middle instead of left edge
        }
    }, 20);
    
}

// Inject our main script
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);