// ==UserScript==
// @name         Wanikani You Should Already Know This Reading
// @namespace    mempo
// @version      1.3
// @description  Inject mnemonics from other items into your lessons
// @author       Mempo
// @match        https://www.wanikani.com/lesson/session
// @match        http://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @match        https://www.wanikani.com/vocabulary/*
// @match        http://www.wanikani.com/vocabulary/*
// @resource     qtipCSS http://cdn.jsdelivr.net/qtip2/3.0.3/jquery.qtip.css
// @require      http://cdn.jsdelivr.net/qtip2/3.0.3/jquery.qtip.js
// @run-at       document-end
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/25128/Wanikani%20You%20Should%20Already%20Know%20This%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/25128/Wanikani%20You%20Should%20Already%20Know%20This%20Reading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("START WK YOU SHOULD ALREADY KNOW THIS READING");
    var qtipCSS = GM_getResourceText ("qtipCSS");
    var css = '.WKINJECT { ' +
              '    text-decoration: underline ' +
              '    color: blue ' +
              ' } ';
    
    
    
    addStyle(qtipCSS);
    addStyle(css);
    
    // VOCABULARY PAGE
    if (window.location.href.indexOf('vocabulary') != -1) { //on a vocabulary page
        $(".container .span12 > section p [lang=ja]").each(function(){
            if($(this).parent().next("section").attr("id") === "note-meaning"){ //meaning explanation
                $(this).parent().after('<div class="WKINJECT_MEANING_' + $(this).html() +'"></div>');
            }else if($(this).parent().next("section").attr("id") === "note-reading"){ //reading explanation
                $(this).parent().after('<div class="WKINJECT_READING_' + $(this).html() +'"></div>');
            }
            
            $(this).after('<div class="tooltiptext" style="display:none">'+
                          'Inject the <span class="WKINJECT" id="WKINJECT_MEANING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">meaning</span> mnemonic of ' + $(this).html() + '<br>'+
                          'Inject the <span class="WKINJECT" id="WKINJECT_READING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">reading</span> mnemonic of ' + $(this).html()+
                          '</div>');
            $(this).qtip({ // Grab some elements to apply the tooltip to
                content: {
                    text: $(this).next(".tooltiptext")

                },
                hide: {
                    event: false,
                    inactive: 2000
                }
            });
        });
        WKINJECTHANDLER();
    }
    
    //LESSON PAGE
    if (window.location.href.indexOf('lesson') != -1) {
        //console.log("/// initial lesson");
        $.jStorage.listenKeyChange('l/currentLesson', function(){
            //console.log("/// currentItem changed");
            //console.log($("#supplement-voc [lang=ja]"));
            $("#supplement-voc [lang=ja]").each(function(){
                if($(this).parent().attr("id") === "supplement-voc-meaning-exp" || $(this).parent().parent().attr("id") === "supplement-voc-meaning-exp"){ //meaning explanation // double parent() if item is in highlight tag
                    $(this).parent().append('<div class="WKINJECT_MEANING_' + $(this).html() +'"></div>');
                }else if($(this).parent().attr("id") === "supplement-voc-reading-exp" || $(this).parent().parent().attr("id") === "supplement-voc-reading-exp"){ //reading explanation
                    $(this).parent().append('<div class="WKINJECT_READING_' + $(this).html() +'"></div>');
                }else{
                    return;   
                }

                $(this).after('<div class="tooltiptext" style="display:none">'+
                              'Inject the <span class="WKINJECT" id="WKINJECT_MEANING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">meaning</span> mnemonic of ' + $(this).html() + '<br>'+
                              'Inject the <span class="WKINJECT" id="WKINJECT_READING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">reading</span> mnemonic of ' + $(this).html()+
                              '</div>');
                $(this).qtip({ // Grab some elements to apply the tooltip to
                    content: {
                        text: $(this).next(".tooltiptext")

                    },
                    hide: {
                        event: false,
                        inactive: 2000
                    }
                });
            });
            
            WKINJECTHANDLER();
        });
    }
    
    //REVIEW PAGE
    if (window.location.href.indexOf('review') != -1) {
        
        //CAVEAT: NOT COMPATIBLE WITH REVIEW INFO PAGE LINK SCRIPT!!! THROWS MAXIMUM CALL STACK ERROR
        $.fn._ripl_show = $.fn.show;
        $.fn.show = function(a,b,c){ 
            var res = $.fn._ripl_show.call(this,a,b,c);

            // detect when Wanikani has loaded additional item information
            // ("#all-info").show() seems to correspond with this.
            if(typeof this[0] !== 'undefined' && this[0].id === 'information'){
                // start of wanikani ajax request

            } else if(typeof this[0] !== 'undefined' && this[0].id === 'all-info'){
                // wanikani ajax request returns - does not fire with radicals
                
                insertToolTip();

            } else if (typeof this[0] === 'undefined'){
                //console.log("i'm curious");
                console.log(this); // i'm curious
            }

            return res;
        };
        
        
    }
    
    function insertToolTip(){
        //console.log("inside tooltip function");
        
            $("#item-info [lang=ja]").each(function(){
                if($(this).parent().attr("id") === "item-info-meaning-mnemonic" || $(this).parent().parent().attr("id") === "item-info-meaning-mnemonic"){ //meaning explanation // double parent() if item is in highlight tag
                    $(this).parent().append('<div class="WKINJECT_MEANING_' + $(this).html() +'"></div>');
                }else if($(this).parent().attr("id") === "item-info-reading-mnemonic" || $(this).parent().parent().attr("id") === "item-info-reading-mnemonic"){ //reading explanation
                    $(this).parent().append('<div class="WKINJECT_READING_' + $(this).html() +'"></div>');
                }else{
                    return;   
                }

                $(this).after('<div class="tooltiptext" style="display:none">'+
                              'Inject the <span class="WKINJECT" id="WKINJECT_MEANING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">meaning</span> mnemonic of ' + $(this).html() + '<br>'+
                              'Inject the <span class="WKINJECT" id="WKINJECT_READING" data-WKINJECT="'+$(this).html() +'" style="text-decoration:underline;color: blue;cursor:pointer">reading</span> mnemonic of ' + $(this).html()+
                              '</div>');
                $(this).qtip({ // Grab some elements to apply the tooltip to
                    content: {
                        text: $(this).next(".tooltiptext")

                    },
                    hide: {
                        event: false,
                        inactive: 2000
                    }
                });
            });
            
            
            WKINJECTHANDLER();
    }
    
    function WKINJECTHANDLER(){
        $(".WKINJECT").on("click",function(event){
            
            if($(event.target).attr("id")==="WKINJECT_MEANING"){
                if(!$( "div.WKINJECT_MEANING_"+event.target.dataset.wkinject ).attr("id")){
                    $( "div.WKINJECT_MEANING_"+event.target.dataset.wkinject ).load( "https://www.wanikani.com/vocabulary/" + event.target.dataset.wkinject + "/ .individual-item .span12 section.context-sentence + section p" , function(){
                        $("div.WKINJECT_MEANING_"+event.target.dataset.wkinject).before("<h5>Mnemonic for "+event.target.dataset.wkinject +"</h5>");
                        $("div.WKINJECT_MEANING_"+event.target.dataset.wkinject).attr("id","WKINJECT_DONE");
                    });
                }else{
                    console.log("already injected");
                }
            }else if($(event.target).attr("id")==="WKINJECT_READING"){
                if(!$( "div.WKINJECT_READING_"+event.target.dataset.wkinject ).attr("id")){
                    $( "div.WKINJECT_READING_"+event.target.dataset.wkinject ).load( "https://www.wanikani.com/vocabulary/" + event.target.dataset.wkinject + "/ .individual-item .span12 section.context-sentence + section + section p" , function(){
                        $("div.WKINJECT_READING_"+event.target.dataset.wkinject).before("<h5>Mnemonic for "+event.target.dataset.wkinject +"</h5>");
                        $("div.WKINJECT_READING_"+event.target.dataset.wkinject).attr("id","WKINJECT_DONE");
                    });
                }else{
                    console.log("already injected");
                }

            }
        });
    }
    
    function addStyle(aCss) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
})();