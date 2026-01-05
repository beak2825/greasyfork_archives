// ==UserScript==
// @name        Ninegag
// @namespace   de.onenterframe.ninegag
// @description 9gag-link-helper on front-pages
// @include     *9gag.com/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29971/Ninegag.user.js
// @updateURL https://update.greasyfork.org/scripts/29971/Ninegag.meta.js
// ==/UserScript==
var trace = function(o){
    console.log(o);
};

function insertCSS(){
    var css = '<style class="clippy">'
    + '#Clippy{position:fixed;left:calc(50% - 5em);top:85px;width:3em;height:3em;background:#000;border-radius:5px;box-shadow:0 0 5px 0 rgba(0,0,0,.5);z-index:-1;color:#FFF;font-weight:900;font-family:sans-serif;text-align:center;opacity:.00001;cursor:pointer;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;align-content:stretch;align-items:center}#Clippy i{display:none;flex:0 0 auto;align-self:center}#Clippy.active{z-index:100000;opacity:1}#Clippy.film i.fa-film,#Clippy.picture i.fa-picture-o{display:block}'
    + '</style>';
    css += '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">';
    $('head').append(css);
}
//
function insertVendors() {
    var scr = document.createElement('script'); 
    scr.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.6.1/clipboard.min.js';
    scr.onload = function() { 
       applyClippy();
    };
    document.body.appendChild(scr);
}
//
function insertBtnTemplates() {
    var tpl = '<button type="button" id="Clippy" class="btn clippy" data-clipboard-action="copy" data-clipboard-text=""><i class="fa fa-film" aria-hidden="true"></i><i class="fa fa-picture-o" aria-hidden="true"></i></button>';
    $('body').append(tpl);
}
//
function applyClippy() {
    
    var clippy = new Clipboard('#Clippy', {
        text: function(trigger) {
          return $(trigger).data('clipboard-text'); // source should somehow be copied from scope above it
        }
    });
    clippy.on('success', function(e) {
        /*
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
          //*/
        e.clearSelection();
    });

    clippy.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
    
    $('#Clippy')
       .on('mouseenter', function(ev){
           ev.preventDefault();
           ev.stopImmediatePropagation();
           ev.stopPropagation();
           return false;
       })
    ;
    $('.post-container')
    .on('mouseover', 'a.badge-track', function(ev){
        if( !$(this).hasClass('badge-animated-cover') ) {
            // pictures:
            try {
                var src = $(this).find('img.badge-item-img').prop('src');
                var viewportOffset = $(this).parent()[0].getBoundingClientRect();
                var top = viewportOffset.top;
                $('#Clippy')
                   .addClass('picture')
                   .data('clipboard-text', src)
                   .addClass('active').css({
                       top: top + 60
                   })
                ;
            }
            catch(err) {
                trace(err)
            }
        } 
        if( $(this).hasClass('badge-animated-cover') ) {
            // videos:
            try {
                var poster = $(this).find('video').prop('poster');
                var video = $(this).find('video source[type="video/mp4"]').prop('src');
                var viewportOffset = $(this).parent()[0].getBoundingClientRect();
                var top = viewportOffset.top;
                var clip = '**click** ' + video + '\r\n' + poster;
                $('#Clippy')
                   .addClass('film')
                   .data('clipboard-text', clip)
                   .addClass('active').css({
                       top: top + 60
                   })
                ;
            }
            catch(err) {
                trace(err)
            }
        }
    })
    //*
    .on('mouseleave', 'a.badge-track', function(ev){
        if($(ev.relatedTarget).prop('id') != 'Clippy') {
           $('#Clippy').delay(1500).data('clipboard-text', '').removeClass('active film picture');
        }
    })
    //*/
    ;
    
}
//
$(function() {
    // !order
    insertBtnTemplates();
    insertCSS();
    insertVendors();
});