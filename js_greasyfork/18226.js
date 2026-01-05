// ==UserScript==
// @name        paok24_quick_preview
// @namespace   gt
// @description quick articles preview for paok24
// @include     http://www.paok24.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18226/paok24_quick_preview.user.js
// @updateURL https://update.greasyfork.org/scripts/18226/paok24_quick_preview.meta.js
// ==/UserScript==

jQuery(window).load(function(){

    createModalBox();
    var title = jQuery(".items .tag-widget .entry > h4");
    jQuery.each(title, function(){
        var element = jQuery(this);
        var url = element.find("a").attr("href");

        var modalButtonHTML = '' +
            '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal"><span class="fa fa-search"></span></button>';

        element.html(modalButtonHTML+element.html());


        element.find("button").attr("style", 'width: 20px; float: left;height: 20px;font-size: 12px;margin-left: -2px;padding: 0px;margin-right: 4px;')
        element.find("button").click(function(){
            preview(url);
        })

    })

    function preview(url){
        var finalURL = url + " .long_text";
        var modalContent = jQuery('.modal-body');
        modalContent.html("<span class='fa fa-spinner fa-spin'></span>");
        modalContent.load(finalURL)
    }

    function createModalBox(html){

        var boxHTML = '' +
            '<div class="modal fade" id="myModal" role="dialog">' +
            '   <div class="modal-dialog">' +
            '   <!-- Modal content-->' +
            '       <div class="modal-content">' +
                '       <div class="modal-header">' +
                '           <button type="button" class="close"data-dismiss="modal">&times;</button>' +
                '           <h4 class="modal-title"></h4>' +
                '       </div>' +
                    '   <div class="modal-body">' +
                    '   </div>' +
                    '   <div class="modal-footer">' +
                    '       <button type="button" class="btnbtn-default"data-dismiss="modal">Κλείσιμο</button>' +
                    '   </div>' +
                   '</div>' +
               '</div>' +
            '</div>';
        var div = jQuery("<div>");
        div.html(boxHTML);
        div.appendTo(jQuery('body'));
    }

})
