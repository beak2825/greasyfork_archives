// ==UserScript==
// @name         mouse_middle_button_grab
// @namespace    
// @version      0.3
// @description  drap canvas when using processon
// @author       SimonTheCoder
// @match        https://www.processon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20495/mouse_middle_button_grab.user.js
// @updateURL https://update.greasyfork.org/scripts/20495/mouse_middle_button_grab.meta.js
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
        if(e.button == 1 && middle_down === true){
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
        if(e.altKey === true){
            console.log("zoom: " + e.deltaY);
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
            e.preventDefault();
            e.stopPropagation();
        }

    };
    /*
    designer_layout.onclick = function(e){
        if(e.button == 1){
            e.stopPropagation();
        }
    };
    */
})();