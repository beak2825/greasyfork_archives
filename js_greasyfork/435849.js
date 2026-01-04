

    // ==UserScript==
    // @name         4plebs - Image Hover
    // @namespace    http://tampermonkey.net/
    // @version      1.1
    // @description  Hover over images to show the fullsize image beside the mouse cursor.
    // @author       Gondola#7671
    // @match        https://archive.4plebs.org/*
    // @require      http://code.jquery.com/jquery-3.4.1.min.js
    // @compatible   firefox
    // @compatible   chrome
    // @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435849/4plebs%20-%20Image%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/435849/4plebs%20-%20Image%20Hover.meta.js
    // ==/UserScript==

    $(document).ready(function(){

        /*---START Image Hover---*/
        var mouse_offset_x = 16;
        var mouse_offset_y = 16;
        var container_y = 0;
        var mouse_side = false;
        var currentMousePos = { x: -1, y: -1 };


        $("body").append("<img id='img_hover_container' style='float:left; position:absolute; max-width:200px; overflow:hidden; z-index:9999;' src=''>")


        $(".thread_image_link").mouseenter(function()
        {
            $("#img_hover_container").attr("src",$(this).attr('href'))
            $("#img_hover_container").css("max-height",$(window).height())
        })


        $(".thread_image_link").mouseleave(function()
        {
            $("#img_hover_container").attr("src","")
        })


        //Update Mouse Position
        $(document).mousemove(function(event)
        {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY - $(document).scrollTop();
            update_pos();

            console.log("window height: " + $(window).height())
            console.log("currentMousePos.y: " +  currentMousePos.y)
        });


        function update_pos()
        {
            //Mouse Horizontal
            if(currentMousePos.x > ($(window).width()/2))
            {
                mouse_side = true;
                mouse_offset_x = -$("#img_hover_container").width() - 16;
                $("#img_hover_container").css("max-width", currentMousePos.x - 16)
            }
            else
            {
                mouse_side = false;
                mouse_offset_x = 16;
                $("#img_hover_container").css("max-width", $(window).width()-currentMousePos.x)
            }

            //Mouse Vertical
            if(currentMousePos.y > (($(window).height()) - $("#img_hover_container").height()) - 16)
            {
                container_y = $(document).scrollTop() + $(window).height() - $("#img_hover_container").height()
                console.log(mouse_offset_y)
            }
            else
            {
                container_y = currentMousePos.y + 16 + $(document).scrollTop() ;
            }

            $("#img_hover_container").offset({
                top: container_y,
                left: currentMousePos.x + mouse_offset_x
            });
        }


        //Update image position periodically
        var intervalID = setInterval(function(){update_pos();}, 100);

        $("#img_hover_container").css("max-height", $(window).height())
        /*---END Image Hover---*/

    });

