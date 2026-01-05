// ==UserScript==
// @name         Wanikani Wrap-up Button Enhancement
// @namespace    Mempo
// @version      2.2
// @description  Beefed-up Wrap-up button
// @author       Mempo
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24928/Wanikani%20Wrap-up%20Button%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/24928/Wanikani%20Wrap-up%20Button%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var amount = 42; //by default
    var css = 
        '#additional-content ul li.WKWBE {' +
        '    width: 8.25% !important' +
        '} ' +
        '.WKWBEToolbarEmulation { '+
            'cursor: pointer; '+
            'position: relative;'+
            'display: block;'+
            'margin-right: 10px;'+
            'padding: 10px;'+
            'background-color: #fbfbfb;'+
            'color: #888;'+
            'text-decoration: none;'+
            '-webkit-box-shadow: 3px 3px 0 #e1e1e1;'+
            '-moz-box-shadow: 3px 3px 0 #e1e1e1;'+
            'box-shadow: 3px 3px 0 #e1e1e1;'+
        '};';
    addStyle(css);


    $('#additional-content ul li:first').after('<li class="WKWBE ignore_in_width_calc"><div class="WKWBEToolbarEmulation" id="WKWBE_Amount">_</div></li>');
    $('#additional-content ul li:first').addClass("WKWBE");
    
    var el = document.getElementById("option-wrap-up");
    el.addEventListener("click", addCustomWrapUpAmount);
    editAmount();
    
    function editAmount(){
        $('div#WKWBE_Amount').bind('dblclick', function() {
            $(this).attr('contentEditable', true);
        }).blur(function() {
            $(this).attr('contentEditable', false);
        });
    }
    
    
    function addCustomWrapUpAmount(){
        
        var i=0;
        var poplist;
        var pushlist;
        var reviewpop;
        
        amount = parseInt($('div#WKWBE_Amount').html());
        if(isNaN(amount)){
            amount = 42;
        }

        var currentActiveLength = $.jStorage.get("activeQueue").length;

        if(amount>currentActiveLength){
            poplist = $.jStorage.get("reviewQueue");
            pushlist = $.jStorage.get("activeQueue");
            reviewpop = 1;
        }else{ 
            poplist = $.jStorage.get("activeQueue");
            pushlist = $.jStorage.get("reviewQueue");
            reviewpop = 0;
        }

        

        var iterCount =  (-(reviewpop-1))*(currentActiveLength-amount) + reviewpop*(amount-currentActiveLength);
        for(i=0;i < iterCount ;i++){

            pushlist.push(poplist.pop());

        }
        $.jStorage.set("activeQueue",reviewpop?pushlist:poplist);
        $.jStorage.set("reviewQueue",reviewpop?poplist:pushlist);
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

// Hook into App Store
try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}