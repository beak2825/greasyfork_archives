	

    // ==UserScript==
    // @name        Pr0gramm.com by Seglor
    // @namespace   http://userscripts.org/scripts/show/486514
    // @description Improve das Pr0gramm
    // @include     http://pr0gramm.com/*
    // @version     1.4
    // @grant       none
    // @require             http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/3198/Pr0grammcom%20by%20Seglor.user.js
// @updateURL https://update.greasyfork.org/scripts/3198/Pr0grammcom%20by%20Seglor.meta.js
    // ==/UserScript==
     
    (function() {
     
     
    var wheelLast = 0;
    var design = '1';
    /****/// CSS und Kommentarbox links
       
       
    var css = '#upload-form input[type="submit"] { position:relative; top: 290px; left: 350px; }'+
    '.tags { padding-left:3px; } div.item-tags { padding: 4px 0 8px 10% !important;} div.tagsinput { position:absolute; } input[value="Tags speichern"],input[value="Abbrechen"] { float:right; }'+
    '.comments-large-rectangle { height:auto; position:px; width:280px; right:0;top:0; position:relative; } .comments-large-rectangle > a > img { width: 280px; } #footer-links {z-index:200;} div.item-tags { padding: 4px 0 8px 20%;} div.item-info { text-align:center;} #zahlbreite { color: #FFFFFF; margin: 27px 0 0 15px; float: left;} div.stream-row { clear:right; }'+
    '.ui-widget-content {border: 1px solid #AAAAAA;color: #222222;}'+
    '.ui-slider { position: relative; text-align: left;}'+
    '.ui-slider-horizontal { height: 0.8em;}'+
    '.ui-corner-all {  border-radius: 4px;}'+
    '.ui-slider-horizontal .ui-slider-range { height: 100%; top: 0;}'+
    '.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {'+
    'background: #E6E6E6; border: 1px solid #D3D3D3; color: #555555; font-weight: normal;}'+
    '.ui-slider-horizontal .ui-slider-handle { margin-left: -0.6em; top: -0.3em;}'+
    '.ui-slider .ui-slider-handle { cursor: default; height: 1.2em; position: absolute; width: 1.2em; z-index: 2;}'+
    '#slider { float: left; clear: left; width: 300px; margin: 30px 15px 5px; }#slider .ui-slider-range { background: #EE4D2E; } #slider .ui-slider-handle { border-color: #EE4D2E; }'+
    '@media screen and (max-width:1400px){ div#head {margin: 0 0 0 25% !important;} div#page {margin: 0 0 0 25% !important;} .item-comments {width: 24% !important;}} #head { z-index:200; } #stream-next, #stream-prev { z-index:122; } .item-image{max-height:460px;} .item-comments {\n  position: fixed !important;\n  top: 0;\n  left: 0;\n \n  width: 300px;\n  height: 100vh;\n  max-height: 100vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n \n.item-comments textarea.comment {\n  resize: none;\n}\n \ndiv.comment-box > div.comment-box {\n    background: none repeat scroll 0 0 rgba(0, 0, 0, 0.1);\n    padding: 0 0 0 6px;\n}';
     
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
            addStyle(css);
        } else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
     
       
         
    $(function()
    {
            $('.item-comments').jScrollPane();
    });
     
     
     
    function update(e) {
            // nur in Uploads
            if ($("div.item-container").length) {
                   
                    //$('.item-container').hide();
                    $('.item-container').fadeIn();
                    $(".item-container").attr( 'id', 'bild' );
                   
                    var positionX = 0,        
            positionY = 0;
                    var pageElement = document.getElementById('bild');
                    positionX += pageElement.offsetLeft;        
            positionY += pageElement.offsetTop;
                    //alert($(window).height());           
            window.scrollTo(positionX, positionY-130);
            }
    }
     
     
            setInterval(function() {       
                    if ($('.item-image').length) {
                            /*
                            var vids = document.getElementsByTagName("video");
                            for (i = 0; i < vids.length; i++) vids[i].setAttribute("controls", "true");
                            */
                            // + bei resized Bildern
                            if (!$('.item-fullsize-link').length) {
                                    var imgu = document.getElementsByClassName('item-image')[0];
                                    if (imgu.naturalHeight > 460) {
                                            var link = imgu.getAttribute('src');
                                            $('.item-image-wrapper').append('<a class="item-fullsize-link" target="_blank" href="'+link+'" style="">+</a>');
                                    }
                            }
                            var stil = document.getElementsByTagName('html')[0];
                            stil.style.overflow='hidden';
     
                            $(".item-container").attr( 'id', 'bild' );
                            var positionX = 0,        
                            positionY = 0;
                            var pageElement = document.getElementById('bild');
                            positionX += pageElement.offsetLeft;        
                            positionY += pageElement.offsetTop;
                            //alert($(window).height());           
                            window.scrollTo(positionX, positionY-130);
                    }else{
                            var stil = document.getElementsByTagName('html')[0];
                            stil.style.overflow='visible';
                    }
                   
        }, 200);
           
     
     
     
    // Breiteneinstellung in Settings
     
    function refreshdas() {
        if (design == '1') {
            var weite = $("#slider").slider("value");
            $("#page").css( "width", weite+"px");
            $("#head").css( "width", weite+"px");
            var proreihe = weite/128;
            var treshold = 0.55* $(window).width();
     
            document.getElementById("zahlbreite").innerHTML = weite+' Pixel';
            if (weite > treshold) {
                $(".item-comments").css( "top", "50px");
            }else{
                $(".item-comments").css( "top", "0");
            }
        }
    }
     
    function changedesign() {
        if (document.getElementById("design") && design == '1') {
            var elem = document.getElementById('design');
            elem.parentNode.removeChild(elem);
        }else{
     
                var css = '#page { width: 100% !important }'+
                          '#head { width: 100% !important }'+
                          '.comment-foot { width: 260px !important }'+
                          '.item-comments { top: 48px !important; width: 312px !important;}' +
                                    '.item-container-content { margin-top: 20px !important }'+
                                    'div.item-container { background: rgba(0, 0, 0, 0.9) !important; position: absolute !important; height: 100% !important; width: 100% !important; }'+
                                    '.stream-row { clear: none !important; margin-left: 0 !important; }'+
                                    '#main-view { max-width: 100% !important; width: 100% !important; }'+
                                    '.user-info { margin: 20px 30px 0 0 !important; }'+
                                    '#pr0gramm-logo { margin-left: 15px !important; }'+
                                    '.item-pointer { display: none !important; }'+
                         'div.item-tags { padding: 4px 0 8px 20% !important;}'+
                         'div.item-vote { left: 345px;)';
            if (!document.getElementById("design") && design == '2') {
                var node = document.createElement("style");
                    node.type = "text/css";
                    node.id = "design";
                    node.appendChild(document.createTextNode(css));
                    var heads = document.getElementsByTagName("head");
                    if (heads.length > 0) {
                        heads[0].appendChild(node);
                    } else {
                        document.documentElement.appendChild(node);
                    }
            }
        }
    }
     
       
    // Settings öffnen
    $('#settings-link').click(function() {
            setInterval(function () {
                   
                    if ($("div.overlay-tabs").length && !$("#settings-optik").length) {
                            $('div.overlay-tabs').append('<span id="settings-optik" class="link tab">Optik</span>');               
                    }
                    var valus = parseInt(document.getElementById("page").style.width);
                    $( "#slider" ).slider( "value", valus );
                            $('span#settings-optik').click(function() {
                                    loaded = false;
                                    $('#settings-optik').attr('class', 'link tab active');
                                    $('div.overlay-content:eq(1)').attr('id', 'cont');
                   
                                    document.getElementById("cont").innerHTML = '<div id="slider"></div><span id="zahlbreite" style="color:#fff;">788</span>'+
                        '<div style="margin: 50px;"><br><br>Design wechseln: <input type="button" id="buttons1" value="Design 1"> <input type="button" id="buttons2" value="Design 2"></div>';
                                       
                            $('#buttons1').click(function() {
                                design = '1';
                                changedesign();
                                $('#slider').slider('enable');
                                $('#slider').slider({ disabled: "false" });
                            });
                            $('#buttons2').click(function() {
                                design = '2';
                                changedesign();
                                $('#slider').slider('disable');
                                $('#slider').slider({ disabled: "true" });
                            });
                   
                                $('#slider').slider({
                                    orientation: "horizontal",
                                    range: "min",
                                    max: $(window).width(),
                                    min: 788,
                                    value: valus,
                                    slide: refreshdas,
                                    change: refreshdas
                                });
                                           
                            });    
                   
            }, 300);
    });
     
    $('#stream-next').click(function() {
            update();
    });
    $('#stream-prev').click(function() {
            update();
    });
     
     
    // Space Vergrößerung und links/rechts Bildwechsel
    document.addEventListener("keydown", keydown, false);
           
    var spacepressed = false;
    function keydown(event) {
            if (event.keyCode == '37' || event.keyCode == '39') {
                    update();
            }else if (event.keyCode == '32') {
                   
                    // falls textarea aktiv
                    var el = document.activeElement;
                    if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' || el.tagName.toLowerCase() == 'textarea')) {
                            return;
                    }
                   
                    // Bild mit Space vergrößern
                    if ($('.item-image').length != 0) {
                            event.preventDefault();
                            event.stopPropagation();
                   
                            if (!spacepressed && $("div.item-container").length) {
                                    $(".item-image").css( 'max-height', '100%' );
                                    spacepressed = true;
                            }else{
                                    $(".item-image").css( 'max-height', '460px' );
                                    spacepressed = false;
                            }
                    }
            }else if (event.keyCode == '68') {                                
             //$('#stream-next').click();                                
        }else if (event.keyCode == '65') {                                
            //$('#stream-prev').click();    
            }
    }
     
     
    // Image Scroll
     
        // Firefox
    document.addEventListener("DOMMouseScroll", handleWheel, false);
            // IE9, Chrome, Safari, Opera
    document.addEventListener("mousewheel", handleWheel, false);
            // IE 6/7/8
     if(!document.addEventListener) {
            document.attachEvent("onmousewheel", handleWheel);
    }
     
    function handleWheel(event) {
     
        if ($("div.item-container").length) {
                    var coms = document.getElementsByClassName("item-comments");
                    if (coms.length != 1 || isHover(coms[0])) {
                            return;
                    }
                   
            event.preventDefault();
            event.stopPropagation();
            event.returnValue=false;
     
                    var wheelWait = 200;
                    var time = (new Date()).getTime();
                    var msec = time - wheelLast;
                    wheelLast = time;
                    if (msec < wheelWait) {
                            return;
                    }
     
                var delta = 0;
            if (!event)
                    event = window.event;
            if (event.wheelDelta) {
                    delta = event.wheelDelta/120;
            } else if (event.detail) {
                    delta = -event.detail/3;
            }
                   
            if(delta<0){
                $('#stream-next').click();
                    }else{
                $('#stream-prev').click();
                    }
                    update();
           
            }
    }
     
    function isHover(e) {
    if (!e) return false;
        return (e.parentElement.querySelector(':hover') === e);
    }
     
     
     
     
    })();

