// ==UserScript==
// @name         Civitai - Image & Video Hover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mouse over videos&images to view full size
// @author       gfish
// @license      MIT
// @match        https://civitai.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/535204/Civitai%20-%20Image%20%20Video%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/535204/Civitai%20-%20Image%20%20Video%20Hover.meta.js
// ==/UserScript==

(function() {
    document.body.insertAdjacentHTML('afterbegin', "<img id='img_hover_container' style='float:left; pointer-events:none; position:absolute; max-width:200px; overflow:hidden; z-index:9999;' src=''>")
    document.body.insertAdjacentHTML('afterbegin', "<video id='vid_hover_container' style='float:left; pointer-events:none; position:absolute; max-width:200px; overflow:hidden; z-index:9999; visibility:hidden;' src='' loop autoplay='true' muted='true'>")
    let vid = document.getElementById('vid_hover_container')

    let bEnter = false;
    let img_type = "jpg";
    let mainRoutine = setInterval((e) => {
        [...document.getElementsByTagName('img'), ...document.getElementsByTagName('video')].forEach((el) => {
            if (el.xhover !== true) {
                el.xhover = true;
                el.addEventListener("mouseenter", (event) => {
                    bEnter = true;
                    img_type = "jpg"
                    $("#img_hover_container").attr("src", el.currentSrc.replace("width=","original=true,width0="))
                    $("#vid_hover_container").css("visibility","visible")
                    $("#vid_hover_container").attr("src", el.currentSrc.replace("width=","original=true,width0=").replace("anim=false","anim=true").replace(".jpeg",".webm"))
                    vid.load()
                    console.log(el.currentSrc, '  |  ', vid.src)
                })
                el.addEventListener("mouseleave", (event) => {
                    bEnter = false;
                    $("#img_hover_container").attr("src", "")
                    vid.pause();
                    vid.removeAttribute('src'); // empty source
                    vid.load();
                })
            }
        });
    }, 100);

    let currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        update_pos();
    });

    let mouse_offset_x = 16;
    let mouse_offset_x2 = 16;
    let mouse_offset_y = 16;
    let mouse_offset_y2 = 16;
    let mouse_side = false;
    function update_pos(){
        //Mouse Horizontal
        if(currentMousePos.x > ($(window).width()/2))
        {
            mouse_side = true;
            mouse_offset_x = -$("#img_hover_container").width() - 16;
            mouse_offset_x2 = -$("#vid_hover_container").width() - 16;
            $("#img_hover_container").css("max-width", currentMousePos.x - 16)
            $("#vid_hover_container").css("max-width", currentMousePos.x - 16)
        }
        else
        {
            mouse_side = false;
            mouse_offset_x = 16;
            mouse_offset_x2 = 16;
            $("#img_hover_container").css("max-width", $(window).width()-currentMousePos.x)
            $("#vid_hover_container").css("max-width", $(window).width()-currentMousePos.x)
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
        if(currentMousePos.y > ($(window).height() - $("#vid_hover_container").height()))
        {
            mouse_offset_y2 = ($(window).height() - $("#vid_hover_container").height()) + $(document).scrollTop();
        }
        else
        {
            mouse_offset_y2 = currentMousePos.y + 16;
        }

        $("#img_hover_container").offset({
            top: mouse_offset_y,
            left: currentMousePos.x + mouse_offset_x
        });
        $("#vid_hover_container").offset({
            top: mouse_offset_y2,
            left: currentMousePos.x + mouse_offset_x2
        });

        if (bEnter) {
            if (vid.src !== "" && vid.currentTime > 0) {
                $("#vid_hover_container").css('visibility','visible');
                $("#img_hover_container").css("visibility","hidden");
            }
            else {
                $("#vid_hover_container").css("visibility","hidden");
                $("#img_hover_container").css("visibility","visible");
            }
        }
        else {
            $("#vid_hover_container").css('visibility','hidden');
            $("#img_hover_container").css("visibility","hidden");
        }
    }

    //Update image position periodically
    var intervalID = setInterval(function(){update_pos();}, 100);

    //image type handler
    $("#img_hover_container").on('error', function(er)
    {
        if(img_type == "jpg")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace(".jpg",".png"))
            img_type = "png";
        }
        else if(img_type == "png")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace(".png",".jpeg"))
            img_type = "jpeg";
        }
        else if(img_type == "jpeg")
        {
            $("#img_hover_container").attr("src", $("#img_hover_container").attr("src").replace(".jpeg",".gif"))
            img_type = "gif";
        }
    })
    $("#vid_hover_container").on('error', function(er)
    {
        if (vid.src.includes('original=true,'))
        {
            $("#vid_hover_container").attr("src", vid.src.replace("original=true,","").replace("skip=,","skip0="))
            vid.load()
        }
    })

    $("#img_hover_container").css("max-height", $(window).height())
    $("#vid_hover_container").css("max-height", $(window).height())
    window?.navigation.addEventListener("navigate", (event) => {
        console.log('nav')
        bEnter = false;
        $("#img_hover_container").attr("src", "")
        vid.pause();
        vid.removeAttribute('src'); // empty source
        vid.load();
    })
})();