// ==UserScript==
// @name         dA_dragFullscreen
// @namespace    http://phi.pf-control.de/userscripts/dA_dragFullscreen
// @version      1.3
// @description  drag too large image in fullscreen
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @require    	 http://ajax.googleapis.com/ajax/libs/jquery/1.12.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/419629/dA_dragFullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/419629/dA_dragFullscreen.meta.js
// ==/UserScript==

/* globals $*/
/* jshint esnext:true */

(function() {
    'use strict';

    /* //works, but too much drag on very large images
    function addDragger(){
        var el=$("div.ReactModal__Content--after-open img").not("[dA_dragFullscreen]").attr("dA_dragFullscreen",1).draggable();
        if(el.length>0)console.log(el);
    }
    setInterval(addDragger,1000);
    */

   //imgGear copied from inkscape "render gear", slightly adjusted
    let imgGear='<svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20.444057 20.232336" > <g transform="translate(-15.480352,-5.6695418)">  <g transform="matrix(0.26458333,0,0,0.26458333,25.702381,15.78571)"  style="fill:#000000">  <path  style="fill:#000000;stroke:#000000;stroke-width:1"  d="m 28.46196,-3.25861 4.23919,-0.48535 0.51123,0.00182 4.92206,1.5536 v 4.37708 l -4.92206,1.5536 -0.51123,0.00182 -4.23919,-0.48535 -1.40476,6.15466 4.02996,1.40204 0.45982,0.22345 3.76053,3.53535 -1.89914,3.94361 -5.1087,-0.73586 -0.4614,-0.22017 -3.60879,-2.2766 -3.93605,4.93565 3.02255,3.01173 0.31732,0.40083 1.8542,4.81687 -3.42214,2.72907 -4.2835,-2.87957 -0.32017,-0.39856 -2.26364,-3.61694 -5.68776,2.73908 1.41649,4.0249 0.11198,0.49883 -0.41938,5.14435 -4.26734,0.97399 -2.6099,-4.45294 -0.11554,-0.49801 -0.47013,-4.2409 h -6.31294 l -0.47013,4.2409 -0.11554,0.49801 -2.6099,4.45294 -4.26734,-0.97399 -0.41938,-5.14435 0.11198,-0.49883 1.41649,-4.0249 -5.68776,-2.73908 -2.26364,3.61694 -0.32017,0.39856 -4.2835,2.87957 -3.42214,-2.72907 1.8542,-4.81687 0.31732,-0.40083 3.02255,-3.01173 -3.93605,-4.93565 -3.60879,2.2766 -0.4614,0.22017 -5.1087,0.73586 -1.89914,-3.94361 3.76053,-3.53535 0.45982,-0.22345 4.02996,-1.40204 -1.40476,-6.15466 -4.23919,0.48535 -0.51123,-0.00182 -4.92206,-1.5536 v -4.37708 l 4.92206,-1.5536 0.51123,-0.00182 4.23919,0.48535 1.40476,-6.15466 -4.02996,-1.40204 -0.45982,-0.22345 -3.76053,-3.53535 1.89914,-3.94361 5.1087,0.73586 0.4614,0.22017 3.60879,2.2766 3.93605,-4.93565 -3.02255,-3.01173 -0.31732,-0.40083 -1.8542,-4.81687 3.42214,-2.72907 4.2835,2.87957 0.32017,0.39856 2.26364,3.61694 5.68776,-2.73908 -1.41649,-4.0249 -0.11198,-0.49883 0.41938,-5.14435 4.26734,-0.97399 2.6099,4.45294 0.11554,0.49801 0.47013,4.2409 h 6.31294 l 0.47013,-4.2409 0.11554,-0.49801 2.6099,-4.45294 4.26734,0.97399 0.41938,5.14435 -0.11198,0.49883 -1.41649,4.0249 5.68776,2.73908 2.26364,-3.61694 0.32017,-0.39856 4.2835,-2.87957 3.42214,2.72907 -1.8542,4.81687 -0.31732,0.40083 -3.02255,3.01173 3.93605,4.93565 3.60879,-2.2766 0.4614,-0.22017 5.1087,-0.73586 1.89914,3.94361 -3.76053,3.53535 -0.45982,0.22345 -4.02996,1.40204 z"  />  <circle  style="fill:#ffffff;stroke:#000000;stroke-width:1"  cx="0"  cy="0"  r="15" />  </g>  </g> </svg>';

    let tracking=false;
    let trackingMoved=false;
    let copyImg, img, highRec;
    let diag;

    let cImgW,cImgH,imgW,imgH, winW,winH;
    let userSet={
        dragRequired:false,
        opacityPrev:0,
        opacityHigh:0,
        marginPrev:0.02
    };

    function leaveTracking(){
        tracking=false;
        copyImg.hide();
        highRec.hide();
    }
    function moveToXY(tx,ty){
        imgW=img.width();
        imgH=img.height();

        let maxOffX=imgW-winW;
        let maxOffY=imgH-winH;

        let highw=winW/imgW*cImgW;
        let highh=winH/imgH*cImgH;

        let cImgOff=copyImg.offset();

        let x = tx-cImgOff.left-highw/2;
        let y = ty-cImgOff.top-highh/2;

        if(x<0)x=0;
        else if(x>cImgW-highw)x=cImgW-highw;
        if(y<0)y=0;
        else if(y>cImgH-highh)y=cImgH-highh;

        if(highw>cImgW)x=-(highw-cImgW)/2;
        if(highh>cImgH)y=-(highh-cImgH)/2;

        highRec.css({width:highw+"px",height:highh+"px",top: cImgOff.top+y+"px", left: cImgOff.left+x+"px"});

        let scrollX=x/(cImgW-highw)*maxOffX;
        let scrollY=y/(cImgH-highh)*maxOffY;


        $("div.ReactModal__Content--after-open").parent().scrollLeft(scrollX).scrollTop(scrollY);
    }
    function resizePreview(){
        winW=window.innerWidth;
        winH=window.innerHeight;
        let ratImg=img.width()/img.height();
        let ratWin=winW/winH;
        copyImg.css({
            position:"fixed",'max-height':winH*(1-2*userSet.marginPrev)+"px",'max-width':winW*(1-2*userSet.marginPrev)+"px",top:winH*userSet.marginPrev+"px",left:winW*userSet.marginPrev+"px",
            opacity:userSet.opacityPrev,display:"none",cursor:"move",'z-index':2
        });
        if(ratImg>ratWin){//wider than window
            copyImg.css({top:(winH-winW*(1-2*userSet.marginPrev)/ratImg)/2+"px"});
        }else{
            copyImg.css({left:(winW-winH*(1-2*userSet.marginPrev)*ratImg)/2+"px"});
        }

        cImgW=copyImg.width();
        cImgH=copyImg.height();

        highRec.css({
            opacity:userSet.opacityHigh,position:"fixed",border:"2px solid #475c4daa",'box-shadow':"0px 0px 10px white inset",display:"none",'box-sizing':"border-box",'z-index':3
        });
    }

    function addDragger(){
        let el=$("div.ReactModal__Content[role=dialog]>div>img").not("[dA_dragFullscreen]").attr("dA_dragFullscreen",1).attr("draggable","false");
        if(el.length>0){
            img=el;

            winW=window.innerWidth;
            winH=window.innerHeight;
            copyImg=img.clone().attr("dA_dragFullscreen",2).insertAfter(img);

            highRec=$("<div id='dA_dragFullscreen_highR'></div>").insertAfter(img);

            resizePreview();

            $(document).on("mouseleave",function (ev){
                leaveTracking();
            });
            img.on("mousedown",function(ev){

                imgW=img.width();
                imgH=img.height();

                if(imgW>winW||imgH>winH){
                    tracking=true;
                }
                trackingMoved=false;
                ev.preventDefault();
                ev.stopPropagation();
            }).on("mouseup",function(ev){
                leaveTracking()
                ev.preventDefault();
                ev.stopPropagation();
            }).on("click",function(ev){
                if(trackingMoved){
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }).on("mousemove",function(ev){
                if(!tracking && userSet.dragRequired)return;
                if(!trackingMoved){
                    copyImg.show();
                    highRec.show();
                }

                trackingMoved=true;
                moveToXY(ev.pageX,ev.pageY);
            });

            copyImg.on("mousemove",function(ev){
                if(!tracking && userSet.dragRequired)return;
                trackingMoved=true;
                moveToXY(ev.pageX,ev.pageY);

            }).on("mouseup",function(ev){
                leaveTracking()
                ev.preventDefault();
                ev.stopPropagation();
            });

            let but=$("<div title='dragFullscreen Settings'>"+imgGear+"</div>");
            let closebut=$("div.ReactModal__Content button");
            but.css({
                cursor:'pointer','z-index':99,position:"fixed",'background-color': "rgba(var(--L2-RGB),.8)",'border-radius': "50px",display: "flex",'align-items': "center",'justify-content': "center",
                top:parseInt(closebut.css("top"))+closebut.height()+20+"px",right:closebut.css("right"),height: "48px",width:closebut.css("width")
            });
            closebut.parent().after(but);

            diag=$(`
<form style='display:grid;grid-template-columns:70% auto;grid-gap: 5px;'>
<label for="dragRequired">Only when dragged</label>
<input type="checkbox" ${userSet.dragrequired?"checked='checked'":""} style="width:100%;" name="dragRequired">
<label for="previewOpacity">Preview Opacity % [0-100]:</label>
<input type="text" value="${userSet.opacityPrev*100}" style="width:100%;" name="previewOpacity">
<label for="highOpacity">Highlight Opacity % [0-100]:</label>
<input type="text" value="${userSet.opacityHigh*100}" style="width:100%;" name="highOpacity">
<label for="previewMargin">Preview Margin % [0-100]:</label>
<input type="text" value="${userSet.marginPrev*100}" style="width:100%;" name="previewMargin">
</form>`);
            document.body.append(diag);

            but.on("mouseup",function(ev){
                ev.preventDefault();
                ev.stopPropagation();
            }).on("click",function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                diag.dialog({
                    modal: true,
                    width:400,
                    title:"dragFullscreen Settings",
                    buttons: {
                        'OK': function () {
                            userSet.dragRequired = $('input[name="dragRequired"]').prop("checked");
                            userSet.opacityPrev = $('input[name="previewOpacity"]').val()/100.0;
                            userSet.opacityHigh= $('input[name="highOpacity"]').val()/100.0;
                            userSet.marginPrev= $('input[name="previewMargin"]').val()/100.0;
                            $(this).dialog('close');
                            GM.setValue("settings",JSON.stringify(userSet));

                            resizePreview();
                        },
                        'Cancel': function () {
                            $(this).dialog('close');
                        }
                    }
                });
            });
        }
    }

    $("head").append(
        '<link id="dA_DragnFav_styles"' +
        'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/le-frog/jquery-ui.min.css" ' +
        'rel="stylesheet" type="text/css">'
    );

    GM.getValue("settings","").then((val)=>{
        if(val=="")return;
        userSet=JSON.parse(val);
        if(!userSet.hasOwnProperty("marginPrev"))userSet.marginPrev=0.1;//default, backwards compability to v1.1
    }).finally(()=>{

        setInterval(addDragger,1000);
    });
})();