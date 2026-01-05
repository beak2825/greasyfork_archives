// ==UserScript==
// @name         wowhead item set link for wow armory
// @version      0.2
// @description  generates a wowhead link to the items you wearing (transmog included)
// @author       jacobisconfused
// @grant        none
// @include      http://us.battle.net/wow/en/character/*
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @namespace https://greasyfork.org/users/13379
// @downloadURL https://update.greasyfork.org/scripts/11038/wowhead%20item%20set%20link%20for%20wow%20armory.user.js
// @updateURL https://update.greasyfork.org/scripts/11038/wowhead%20item%20set%20link%20for%20wow%20armory.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($){
    var wowheadLink = "http://www.wowhead.com/compare?items=";
    
    var allSlots = $('.slot');
    allSlots.each(function(){ 
                
        var transmogData = $(this).find('.transmog-frame').attr('data-item');
        if(transmogData) {
            var objData = splitItemData(transmogData);
            if(objData && objData.t){
                wowheadLink += objData.t + ":";
            }
        }
        else {
            var item = $(this).find('.item').attr('href');
            if(item)
                wowheadLink += item.split('/')[4] + ":";
        }      
        
    });
    
    // will force the modelviewer to show 
    wowheadLink += '#modelviewer:4:1;145058;3;139973;16;139023;5;132724;9;143383;10;132725;6;138603;7;132731;8;132729;17;135435:' + getRace() + '+0:0';
    
    $('.profile-view-options').prepend('<li><a target="_blank" href="' + wowheadLink + '" class="simple">Items</a></li>')

    function splitItemData(itemData)
    {
        var data = {};
        if(itemData){
            var splitData = itemData.split('&');
            for (var i = 0; i < splitData.length; i++)
            {
                var o = splitData[i].split('=');
                data[o[0]] = o[1];
            }
        }
        return data;
    }
    
    function getRace(){
        var race = $('.race').html();
        switch(race){
            case "Blood Elf":
                return 10;
            case "Draenei":
                return 11;
            case "Dwarf":
                return 3;
            case "Gnome":
                return 7;
            case "Goblin":
                return 9;
            case "Human":
                return 1;
            case "Night Elf":
                return 4;
            case "Orc":
                return 2;
            case "Pandaren":
                return 24;
            case "Tauren":
                return 6;
            case "Troll":
                return 8;
            case "Undead":
                return 5;
            case "Worgen":
                return 22;
            default:
                return 1;
        }
    }
})(jQuery);