// ==UserScript==
// @name         mouse_middle_button_grab
// @namespace    
// @version      0.3
// @description  drag canvas when using processon
// @author       SimonTheCoder
// @match        https://www.processon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34233/mouse_middle_button_grab.user.js
// @updateURL https://update.greasyfork.org/scripts/34233/mouse_middle_button_grab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("mouse_middle_button_grab loaded.");
    var diaType = "diagram";
    var designer_layout = document.getElementById("designer_layout");
    if(!designer_layout){
        console.log("seems we are drawing mindmap.");
        designer_layout = document.getElementById("canvas_container");
        diaType = "mindmap";
    }

    //var designer_layout = document.getElementById("canvas_container");
    console.log("designer_layout:"+designer_layout);

    var sampleStartX = 0;
    var sampleStartY = 0;
    var startTimeStamp = 0;
    var lastX = 0;
    var lastY = 0;
    var global_test_e = null;
    var middle_down = false;
    designer_layout.onmousedown = function(e) {
        if(e.button == 1){
            global_test_e = e;
            lastX = e.x;
            lastY = e.y;

            sampleStartX = e.x;
            sampleStartY = e.x;
            startTimeStamp = e.timeStamp;

            //console.log("middle mouse down. x =" + e.x + " y=" +e.y);
            middle_down = true;
            //e.stopPropagation();
        }
    };
    designer_layout.onmouseup = function(e){
        if(e.button == 1){
            global_test_e = e;
            //console.log("middle mouse up. x =" + e.x + " y=" +e.y);
            //console.log("middle mouse up. lastx =" + lastX + " lastY=" +lastY);
            //console.log("middle mouse up. time=" + (e.timeStamp - startTimeStamp));
            var endSpeed = Math.sqrt((e.x-sampleStartX)*(e.x-sampleStartX) + (e.y-sampleStartY)*(e.y-sampleStartY))/(e.timeStamp - startTimeStamp);
            //console.log("middle mouse up. lastSpeed= " + endSpeed);
            lastX = e.x;
            lastY = e.y;

            middle_down = false;
            //e.stopPropagation();
        }
    };
    designer_layout.onmousemove = function(e){
        //console.log("mouse move button=%d", e.button);
        if(middle_down === true){
            //console.log("middle mouse move. x =" + e.x + " y=" +e.y + " lastx =" + lastX + " lasty=" +lastY );
            designer_layout.scrollTop = designer_layout.scrollTop - (e.y - lastY);
            designer_layout.scrollLeft = designer_layout.scrollLeft - (e.x - lastX);
            lastX = e.x;
            lastY = e.y;

            if(e.timestamp - startTimeStamp > 200){
                sampleStartX = e.x;
                sampleStartY = e.x;
                startTimeStamp = e.timeStamp;
            }
            //e.stopPropagation();
        }

    };
    designer_layout.onmousewheel = function(e){
        if(e.altKey === true && e.shiftKey === true){
            //console.log("zoom: " + e.deltaY);
            var oldScale = Designer.config.scale;
            var oldScrollTop = designer_layout.scrollTop;
            var oldScrollLeft = designer_layout.scrollLeft;
            var oldScrollWidth = designer_layout.scrollWidth;
            var oldScrollHeight = designer_layout.scrollHeight;
            if(e.deltaY > 0){
                if(diaType == "mindmap"){
                    document.getElementById("btn_zoomsmall").click();
                }else{
                    Designer.zoomOut();
                }
            }else{
                if(diaType == "mindmap"){
                    document.getElementById("btn_zoombig").click();
                }else{

                    if(Designer.config.scale < 0.3){
                        Designer.setZoomScale(0.4);
                    }else{
                        Designer.zoomIn();
                    }
                }
            }
            var newScale = Designer.config.scale;

            //console.log(e);
            recalcScrollAfterScaleChanged(oldScrollTop,oldScrollLeft,oldScrollWidth,oldScrollHeight,oldScale,newScale,e.x,e.y);
            e.preventDefault();
            e.stopPropagation();
        }

    };

    if(diaType == "diagram"){
        designer_layout.ondblclick = function(e){
            if(e.button==1){
                var oldScale = Designer.config.scale;
                var oldScrollTop = designer_layout.scrollTop;
                var oldScrollLeft = designer_layout.scrollLeft;
                var oldScrollWidth = designer_layout.scrollWidth;
                var oldScrollHeight = designer_layout.scrollHeight;

                console.log("clear set zoom scale to 1.");
                Designer.setZoomScale(1);
                recalcScrollAfterScaleChanged(oldScrollTop,oldScrollLeft,oldScrollWidth,oldScrollHeight,oldScale,1.0,e.x,e.y);

            }
        };
    }
    function recalcScrollAfterScaleChanged(oldScrollTop,oldScrollLeft,oldScrollWidth,oldScrollHeight,oldScale, newScale, centerX, centerY){
        if(diaType != "diagram") return; //supports diagram only
        console.log("top,left= " +designer_layout.scrollTop +" ,"+designer_layout.scrollLeft+" scale:"+ oldScale + ","+newScale);
        var diaClientRect = designer_layout.getClientRects()[0];
        var offsetTop = centerY - diaClientRect.top;
        var offsetLeft = centerX - diaClientRect.left;
        console.log("offset:"+offsetTop + ","+offsetLeft);

        var centerPointScrollTopOrigFactor = (oldScrollTop + offsetTop)/oldScrollHeight;
        var centerPointScrollLeftOrigFactor = (oldScrollLeft + offsetLeft)/oldScrollWidth;
        var centerPointScrollTopNew = centerPointScrollTopOrigFactor * designer_layout.scrollHeight;
        var centerPointScrollLeftNew = centerPointScrollLeftOrigFactor * designer_layout.scrollWidth;
        designer_layout.scrollTop = centerPointScrollTopNew - offsetTop;
        designer_layout.scrollLeft = centerPointScrollLeftNew - offsetLeft;

/*
        designer_layout.scrollTop = designer_layout.scrollHeight * (oldScrollTop + offsetTop)/oldScrollHeight  - offsetTop;
        designer_layout.scrollLeft =designer_layout.scrollWidth * (oldScrollLeft + offsetLeft)/oldScrollWidth  - offsetLeft;
*/
    }
    /*
    function recalcScrollAfterScaleChanged(oldScale, newScale){
        if(diaType != "diagram") return; //supports diagram only
        var diaClientRect = designer_layout.getClientRects()[0];
        var centerPointScrollTopOrig = (designer_layout.scrollTop + diaClientRect.height/2)/oldScale;
        var centerPointScrollLeftOrig = (designer_layout.scrollLeft + diaClientRect.width/2)/oldScale;
        var centerPointScrollTopNew = centerPointScrollTopOrig * newScale;
        var centerPointScrollLeftNew = centerPointScrollLeftOrig * newScale;
        designer_layout.scrollTop = centerPointScrollTopNew - diaClientRect.height/2/oldScale*newScale;
        designer_layout.scrollLeft = centerPointScrollLeftNew - diaClientRect.width/2/oldScale*newScale;
    }*/
    /*
    designer_layout.onclick = function(e){
        if(e.button == 1){
            e.stopPropagation();
        }
    };
    */
})();


(function() {
    'use strict';

    // Your code here...
})();