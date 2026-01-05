// ==UserScript==
// @name         ImgSkraper
// @namespace    https://github.com/totocheku/ImgSkraper/
// @version      0.1
// @description  Scrap all the <img> on the web page and show them in side bar for easy viewing
// @author       totocheku
// @match        http://www.xossip.com/*
// @grant        none
// @runat        document-start

// @downloadURL https://update.greasyfork.org/scripts/12368/ImgSkraper.user.js
// @updateURL https://update.greasyfork.org/scripts/12368/ImgSkraper.meta.js
// ==/UserScript==

var imgSkraperStyle = 
    '.imgSkraper_container { height: 100%; width:100%; }' +
    '.imgSkraper_sidebar.left { position:fixed; height:100%; width: 200px; background:rgb(255, 255, 255); left:0px; top:0px; }' +
    '.imgSkraper_control { position:absolute; top:0px; left:0px; z-index:200; }' +
    '.imgSkraper_bar { position:relative; }' +
    '.imgSkraper_bar ul { list-style:none; padding:10px; }' +
    '.imgSkraper_page { margin-left:200px; top:0px; }' +
    '.imgSkraper_floatingImage { display:none; position:absolute; top:0px; left:200px; padding:5px; z-index:100; }';

function createUiElements() {
    //wrap the website inside a  div
    $('body').wrapInner('<div class="imgSkraper_page"></div>');
    
    var sidebar = $('<div></div>', {
        'id':'imgSkraper_sidebar',
        'class':'imgSkraper_sidebar left'
    });
    
    var barDiv = $('<div></div>', {
        'id':'imgSkraper_bar',
        'class':'imgSkraper_bar'
    }).appendTo(sidebar);
    
    $('<ul></ul>', {
        'id':'imgSkraper_imageUL'
    }).appendTo(barDiv);
    
    $('<div id="imgSkraper_floatingImage" class="imgSkraper_floatingImage"></div>').appendTo(sidebar);
    
    //imgSkraper div
    $('body').prepend(sidebar.prop('outerHTML'));
/*    
    var controlsDiv = $('<div></div>', {
        'id':'imgSkraper_control',
        'class':'imgSkraper_control'
    });
    
    var controlsHtml = '<input type="checkbox" id="imgSkraper_sidebarToggleBtn">' +
        '<label for="imgSkraper_sidebarToggleBtn">toggle</label>';
    $(controlsHtml).appendTo(controlsDiv);
    
    $('body').prepend(controlsDiv);
*/    
}

function imgLinkMouseEnter(event) {
    var image = new Image();
    image.src = event.data;
    var div = $('#imgSkraper_floatingImage');
    div.html(image.outerHTML);
    div.css('display', 'block');
}

function imgLinkMouseLeave(event) {
    var div = $('#imgSkraper_floatingImage');
    div.html("");
    div.css('display', 'none');
}

function imgLinkMouseClick(event) {
}

function gatherImages() {
    $('body').find('img').each(function(index) {
        //$(this).load(function() {
            var width = $(this).width();
            var height = $(this).height();
        if(width > 100 && height > 100) {
                var filename = $(this).attr('src');
                var imageUL = $('#imgSkraper_imageUL');
                var imgLink = $('<li>'+filename.split('/').pop()+'</li>').appendTo(imageUL);
                imgLink.on('mouseenter', null, filename, imgLinkMouseEnter);
                imgLink.on('mouseleave', null, filename, imgLinkMouseLeave);
                imgLink.on('click', null, filename, imgLinkMouseClick);
        }
        //});
    });
}

function toggleBtnChanged(event) {
    var sidebar = $('#imgSkraper_sidebar');
    sidebar.trigger('sidebar:toggle');
}

function updateSidebarToggleButtonState(open) {
    var toggleBtn = $('#imgSkraper_sidebarToggleBtn');
    if(open === true) {
        toggleBtn.button( "option", "icons", {primary:null, secondary:"ui-icon-arrowthickstop-1-w"});
    } else {
        toggleBtn.button( "option", "icons", {primary:"ui-icon-arrowthickstop-1-e", secondary:null});
    }
    
    toggleBtn.button('refresh');
}

function sidebarStateChanged(open) {
    return updateSidebarToggleButtonState(open);
}

function showUiElements() {
    var toggleBtn = $('#imgSkraper_sidebarToggleBtn');
    toggleBtn.button();
    toggleBtn.on('change', toggleBtnChanged);
    
    var sidebar = $('#imgSkraper_sidebar');
    sidebar.sidebar({'close':true});
    sidebar.on("sidebar:open", sidebarStateChanged(true));
    sidebar.on("sidebar:close", sidebarStateChanged(false));
    sidebar.trigger("sidebar:open");
}

function start() {
    createUiElements();
    showUiElements();
    gatherImages();
}

function checkResources() {
    //sidebar loaded?
    if(typeof $.fn.sidebar != 'undefined') {
        start();
        
        return;
    }
    
    setTimeout(checkResources, 1000);
}

function loadResources() {
    //jquery UI
    $("head").append(
        '<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css">' +
        '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.js"></script>'
    );
   
    //jquery sidebar
    $("head").append(
        '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-sidebar/3.3.0/jquery.sidebar.js"></script>'
    );
    
    //css 
    $('head').append(
        '<style>'+imgSkraperStyle+'</style>'
    );
    
    checkResources();
}

function checkjQuery() {
    if(typeof jQuery != 'undefined') {
        loadResources();
        
        return;
    }
    
    setTimeout(checkjQuery, 1000);
}

function begin() {
    if(!window.jQuery) {
        //load jQuery
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js';
    
        (document.getElementsByTagName('head') || document.getElementsByTagName('body'))[0].appendChild(script);
    
        //check if jQuery has been loaded
        setTimeout(checkjQuery, 1000);
    }
}

window.onload = begin;
