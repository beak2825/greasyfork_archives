// ==UserScript==
// @name         Rule34.xxx - Image Hover
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Shows the full size image when you hover over a thumbnail. Also adds arrow key navigation.
// @author       Gondola
// @match        https://rule34.xxx/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @compatible   firefox
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/405953/Rule34xxx%20-%20Image%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/405953/Rule34xxx%20-%20Image%20Hover.meta.js
// ==/UserScript==


(function() {

    /*---START Keyboard Navigation---*/
    var pagination = document.getElementsByClassName("pagination")[0].children

    for(var i = 0; i < pagination.length; i++)
    {
        if(pagination[i].nodeName == "B")
        {
            pagination[i].classList.add("key_nav_pagination")
        }
    }

    window.addEventListener("keyup", checkKeyPress, false);

    function checkKeyPress(key)
    {
        if(document.activeElement.tagName != 'INPUT')
        {

            if(key.keyCode == "39")
            {
                document.getElementsByClassName("key_nav_pagination")[0].nextSibling.nextSibling.click()
            }

            if(key.keyCode == "37")
            {
                document.getElementsByClassName("key_nav_pagination")[0].previousSibling.previousSibling.click()
            }
        }
    }
    /*---END Keyboard Navigation---*/



    /*---START Image Hover---*/
    document.getElementById("body").insertAdjacentHTML('afterbegin', "<img id='img_hover_container' style='float:left; position:absolute; max-width:200px; overflow:hidden; z-index:9999;' src=''>")

    var img_type = "jpg";
    var mouse_offset_x = 16;
    var mouse_offset_y = 16;
    var mouse_side = false;
    var currentMousePos = { x: -1, y: -1 };

    $(".preview").mouseenter(function()
    {
        img_type = "jpg"
        $("#img_hover_container").attr("src",this.src.replace("thumbnails","/images").replace("thumbnail_",""))
        $("#img_hover_container").css("max-height",$(window).height())

    })

    $(".preview").mouseleave(function()
    {
        $("#img_hover_container").attr("src","")
    })


    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        update_pos();
    });
    
    
    //remove tag tooltip on hover
    var thumb_list = document.getElementsByClassName("preview")

    for(var tl = 0; tl < thumb_list.length; tl++)
    {
        thumb_list[tl].title = "";
    }


    function update_pos(){
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
        if(currentMousePos.y > ($(window).height() - $("#img_hover_container").height()))
        {
            mouse_offset_y = ($(window).height() - $("#img_hover_container").height()) + $(document).scrollTop();
        }
        else
        {
            mouse_offset_y = currentMousePos.y + 16;
        }

        $("#img_hover_container").offset({
            top: mouse_offset_y,
            left: currentMousePos.x + mouse_offset_x
        });
    }

    //image type handler
    $("#img_hover_container").on('error', function()
    {
        if(img_type == "jpg")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace("jpg","png"))
            img_type = "png";
        }
        else if(img_type == "png")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace("png","jpeg"))
            img_type = "jpeg";
        }
        else if(img_type == "jpeg")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace("jpeg","gif"))
            img_type = "gif";
        }
    })

    //Update image position periodically
    var intervalID = setInterval(function(){update_pos();}, 100);

    $("#img_hover_container").css("max-height", $(window).height())
    /*---END Image Hover---*/

})();