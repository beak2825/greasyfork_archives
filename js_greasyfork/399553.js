// ==UserScript==
// @name      MH - Iceberg Progress Info
// @author    Giuseppe Di Sciacca (Improved by Hazado)
// @version   1.020
// @description Originally found at http://mhutilitiesbyshk.altervista.org/scripts.php
// @require   https://code.jquery.com/jquery-1.7.1.min.js
// @include   http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @namespace https://greasyfork.org/users/149039
// @downloadURL https://update.greasyfork.org/scripts/399553/MH%20-%20Iceberg%20Progress%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/399553/MH%20-%20Iceberg%20Progress%20Info.meta.js
// ==/UserScript==

if(user.environment_name=='Iceberg')
    doIcebergPluginStuff();

// the guts of this userscript
function doIcebergPluginStuff() {
    jQuery('div.depth').css('cursor','pointer');
    jQuery('div.depth').click(function(){
        if(jQuery('div.cutawayClippingMask').css('overflow')=='hidden')
        {
            jQuery('div.depth').css('z-index',30);
            jQuery('div.cutawayClippingMask div.icebergContainer').css('z-index',30);
            jQuery('div.cutawayClippingMask').css('overflow','visible');
        }
        else
        {
            jQuery('div.depth').css('z-index',3);
            jQuery('div.cutawayClippingMask div.icebergContainer').css('z-index',2);
            jQuery('div.cutawayClippingMask').css('overflow','hidden');
        }
    });

    jQuery(document).keyup(function(e){
        if(e.keyCode==27)
        {
            jQuery('div.depth').css('z-index',3);
            jQuery('div.cutawayClippingMask div.icebergContainer').css('z-index',2);
            jQuery('div.cutawayClippingMask').css('overflow','hidden');
        }
    });

    var feet=calculateIcebergPercentageProgress();
    setInterval(function(){
        if(parseInt(user.quests.QuestIceberg.user_progress) != feet)
            feet=calculateIcebergPercentageProgress();
    },15000);//checks if there's the need to update every 15 seconds

    var huntsDone=parseInt(user.quests.QuestIceberg.turns_taken);
    jQuery('div.chest').mouseover(function(){
        if(jQuery(this).children('div.mousehuntTooltip').html().indexOf(' hunts left)')<0 || huntsDone!=parseInt(user.quests.QuestIceberg.turns_taken)) {
            var stage=user.quests.QuestIceberg.current_phase;
            //if I'm updating I remove the old message in the brackets in order to add it again
            if(jQuery(this).children('div.mousehuntTooltip').html().indexOf(' hunts left)')>0)
                jQuery(this).children('div.mousehuntTooltip').html(jQuery(this).children('div.mousehuntTooltip').html().replace(/\(\d{1,3}/,'').replace(' hunts left) ',''));
            //write the number of hunts left for the chest in the message
            var huntsForChest=parseInt(jQuery(this).children('div.mousehuntTooltip').children('div.chest-state.active').children('b').first().html().replace('Hunt #',''),10);
            huntsDone=parseInt(user.quests.QuestIceberg.turns_taken);
            huntsForChest-=2;//huntsForChest-2=>at least 1 hunt for icewing and 1 for the last general that doesn't give you any feet
            var huntsLeft=huntsForChest-huntsDone;
            if(huntsLeft<0) huntsLeft=0;
            var avgForChest=(Math.round(180000/huntsForChest))/100;
            var feet=parseInt(user.quests.QuestIceberg.user_progress);
            if(feet<1800)
                var avgToHit=(Math.round((1800-feet)*100/huntsLeft))/100;
            else
                var avgToHit=0;
            if(jQuery(this).children('div.mousehuntTooltip').children('div.chestAverage').length==0)
              var averageMsg='<div class="chestAverage"><br/>Required Average: ';
            else
              var averageMsg='<br/>Required Average: ';
            if(getAverageFeet()>=avgForChest)
                averageMsg+='<span style="color:green">';
            else
                averageMsg+='<span style="color:red">';
            averageMsg+=avgForChest+'</span>';
            if(jQuery(this).children('div.mousehuntTooltip').children('div.chestAverage').length==0)
              averageMsg+="<br/>Minimum average needed in the next hunts: "+avgToHit+'</div>';
            else
              averageMsg+="<br/>Minimum average needed in the next hunts: "+avgToHit;
            if(jQuery(this).children('div.mousehuntTooltip').children('div.chestAverage').length==0){//need to create the progress div?
                jQuery(this).children('div.mousehuntTooltip').html(jQuery(this).children('div.mousehuntTooltip').html().replace('</b> to earn','</b> ('+huntsLeft+' hunts left) to earn')+averageMsg);
            }
            else {
                jQuery(this).children('div.mousehuntTooltip').html(jQuery(this).children('div.mousehuntTooltip').html().replace('</b> to earn','</b> ('+huntsLeft+' hunts left) to earn'));
                jQuery(this).children('div.mousehuntTooltip').children('div.chestAverage').html(averageMsg);
            }
        }
    });
    //div.waterline has z-index:4, div.iceberg has z-index 3, so I shouldn't be able to intercept anything on div.iceberg
    //cange z-index to 4 then
    jQuery('div.icebergContainer div.iceberg').css('z-index',4);
    jQuery(document).on('mouseover','div.icebergContainer div.iceberg',function(){
        if(jQuery(this).children('div.help').length==0)
        {
            jQuery(this).append('<div class="help"></div>');
            //give same style as .icebergHud .timeline .chest .help
            jQuery(this).children('div.help').attr('style','background: #EEEEEE; border: 1px solid #333333; border-radius: 10px; color: #000000; display: none; left: -65px; padding: 10px; position: absolute; top: 20px; width: 150px;');
            //adjust a bit
            jQuery(this).children('div.help').css('top','34px').css('left','-55px');
        }
        var stage=user.quests.QuestIceberg.current_phase;
        var feet=parseInt(user.quests.QuestIceberg.user_progress);
        var huntsDone=parseInt(user.quests.QuestIceberg.turns_taken);
        if(feet<1800 || (feet==1800 && stage=='General') )
            huntsForChest=247;//250-deep mouse-icewing-general
        else
            huntsForChest=248;//250-deep mouse-icewing //not 249 since the div.iceberg disappears after icewing
        var huntsLeft=huntsForChest-huntsDone;
        var avgForChest=(Math.round(200000/huntsForChest))/100;
        if(huntsLeft>0)
            var avgToHit=(Math.round((2000-feet)*100/huntsLeft))/100;
        else
            var avgToHit=0;
        //build message
        var averageMsg='<span style="font-weight:bold;">Deep Mouse</span>:';
        averageMsg+='<br/>Required Average: ';
        if(getAverageFeet()>=avgForChest)
            averageMsg+='<span style="color:green">';
        else
            averageMsg+='<span style="color:red">';
        averageMsg+=avgForChest+'</span>';
        if(avgToHit>0)
            averageMsg+='<br/>Minimum average needed in the next hunts: '+avgToHit;
        else
            averageMsg+='<br/>Hunt #'+huntsDone+', you cannot reach the Deep Mouse anymore :(';
        jQuery(this).children('div.help').html(averageMsg).show();
    });
    jQuery(document).on('mouseout','div.iceberg',function(){
        jQuery(this).children('div.help').hide();
    });
    function calculateIcebergPercentageProgress(){
        var feet=parseInt(user.quests.QuestIceberg.user_progress);
        var stagePerc=0;
        var stageMissing=0;
        var totalPerc=(Math.round(feet/0.18))/100;
        var totalAvg=getAverageFeet(feet);
        var totalMissing=1800-feet;
        var stage=user.quests.QuestIceberg.current_phase;
        var progressMessage = '';
        if(stage=='Hidden Depths')
        {
            stagePerc=(Math.round(feet/0.02))/100;
            stageMissing=200-feet;
            progressMessage = '<br /><b>Stage progress:</b> '+stagePerc+'% - '+stageMissing+' feet to go';
        }
        else if(stage=="Icewing's Lair" || stage=='The Deep Lair')
        {
            progressMessage = '<br /><b>Stage progress:</b> 100%';
        }
        else
        {
            if(stage=='Treacherous Tunnels')
            {
                stagePerc=(Math.round(feet/0.03))/100;
                stageMissing=300-feet;
            }
            else if(stage=='Brutal Bulwark')
            {
                stagePerc=(Math.round((feet-300)/0.03))/100;
                stageMissing=600-feet;
            }
            else if(stage=='Bombing Run')
            {
                stagePerc=(Math.round((feet-600)/0.1))/100;
                stageMissing=1600-feet;
            }
            else if(stage=='The Mad Depths')
            {
                stagePerc=(Math.round((feet-1600)/0.02))/100;
                stageMissing=1800-feet;
            }
            if(stagePerc>0 || stageMissing>0)//if in a known stage
                progressMessage = '<b>Total progress:</b> '+totalPerc+'% - '+totalMissing+' feet to go<br /><b>Stage progress:</b> '+stagePerc+'% - '+stageMissing+' feet to go';
            else if(stage=='General')
                progressMessage = '<b>Total progress:</b> '+totalPerc+'% - '+totalMissing+' feet to go<br /><b>Stage progress:</b> 100% - <b>General</b>';
        }


        if(jQuery('div.cutaway div.depth span.averageTurns').length==0){//need to create the progress div?
            jQuery('div.cutaway div.depth span.turnsTaken')[0].outerHTML = jQuery('div.cutaway div.depth span.turnsTaken')[0].outerHTML.replace('</span>',"</span><span class='averageTurns'> - Avg: "+totalAvg+" feet/hunt</span>");
            jQuery('div.cutaway div.depth').append("<span class='TotalProgress'>"+progressMessage+"</span>");
        }
        else{//just update it
            jQuery('div.cutaway div.depth span.averageTurns')[0].innerHTML = " - Avg: "+totalAvg+" feet/hunt";
            jQuery('div.cutaway div.depth span.TotalProgress')[0].innerHTML = progressMessage;
        }



        return feet;
    }
    function getAverageFeet(feet){
        if(feet==undefined)//the only purpose of this parameter is for optimization, to avoid retrieving it everytime
            feet=parseInt(user.quests.QuestIceberg.user_progress);
        var totalHunts=parseInt(user.quests.QuestIceberg.turns_taken);
        if(totalHunts==0)
            totalHunts=1;//for average, just to avoid division by zero
        return (Math.round((feet*100)/totalHunts))/100;
    }
}