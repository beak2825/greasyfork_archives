// ==UserScript==
// @name         Arreglar Humanatic
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/21551/Arreglar%20Humanatic.user.js
// @updateURL https://update.greasyfork.org/scripts/21551/Arreglar%20Humanatic.meta.js
// ==/UserScript==

arreglar();
function arreglar(){
    try{
        skipCall= function (){
            var section = 'skip_call';

            $.ajax({
                url: 'load_new_call.cfm',
                type: 'post',
                data: {
                    section: section,
                    uid: 66926
                },
                beforeSend: function(){
                    console.log("SKIP CALL");
                    $('.duration-bar-color').stop(true,false).remove();
                    $('.waveform-active').stop(true,false).remove();
                    $('.large_container').animate({"left":"150%"},300);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    console.log("error occurred ");
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                },
                success: function(data){
                    try{
                pauseAudio();}catch(e){}
            try{
                audioSource.stop();}catch(e){}
                    var redirect2 = $(data).find('#redirect-found').html();
                    console.log("redirect 2: "+redirect2);
                    $('.large_container').find('.all_details').remove();
                    $('.large_container').append(data).animate({"left":"0%"},300);
                    var redirect = redirect = $('#redirect-found').html();
                    try{console.log(redirect());}catch(e){}
                    var pAmount = $('#perk_amount9').html();
                    pAmount = pAmount - 1;
                    $('#perk_amount9').html(pAmount);
                    var selectionFlag = selectionFlag = $('#selection-redirect').html();
                    if (selectionFlag != undefined){
                        /*
					code for replacing loading new
					*/
                        $('.loading-gif').hide();
                        $('.options-and-streak').hide();
                        $('.audited__call__alert__holder').show();
                    }
                    else{

                    }

                    //$('.loading-gif').css("display","inline-block");
                    applyListeners();
                },
                complete: function(response){

                }
            });
        };
        getCallInfo = function (callBreak){
            try{
                pauseAudio();}catch(e){}
            try{
                audioSource.stop();}catch(e){}
            try{clearTimeout(omi);}catch(e){}
            try{var current = document.getElementById('current_call').innerHTML;
                var chosenOp = $('input[type=radio]:checked').siblings('.the-hco').text();}catch(e){
                    var current = "";
                    var chosenOp = "";
                }
            console.log("the current cqid is: " + current + "Option is: " + chosenOp + " Break: " + callBreak);
            var endCall = callBreak;
            var section = 'load_new';

            if (current == "") {
                console.log("The is no cqid");
                current = 9999999;
                console.log("cqid: " + current);
            }
            if (chosenOp == ""){
                console.log("no option chosen");
                chosenOp = 0;
                console.log("default option: " + chosenOp);
            }

            $.ajax({
                type: "POST",
                url: "cfc/humfun_activities.cfc",
                data: {
                    method: 'check_incorrect_review',
                    uid: 66926,
                    hcat: 20
                },
                beforeSend: function(){
                    //console.log("checking for incorrect review");
                },
                success: function(data) {
                    //console.log("penalty calls: " + data);
                    if(data > 0){
                        $('.penalty-shadow-box').css({"opacity":"0","display":"table"}).animate({"opacity":"1"},300);
                    }
                    else{
                        //console.log("no new incorrect review");
                    }
                }
            });
            $.ajax({
                type: "POST",
                url: "load_new_call.cfm",
                data: {
                    section: section,
                    cqid: current,
                    op: chosenOp,
                    finished: endCall
                },
                beforeSend: function(){
                    if(typeof audio !== "undefined"){
                        audio.pause();
                    }

                    console.log("sending");
                    $('.large_container').animate({"left":"150%"},300);
                    checkForGems(current);
                    //checkForLevelup(current);
                },
                success: function(data) {
                    var redirect2 = $(data).find('#redirect-found').html();
                    console.log("redirect 2: "+redirect2);
                    $('.large_container').find('.all_details').remove();
                    $('.large_container').append(data).animate({"left":"0%"},300);
                    var redirect = redirect = $('#redirect-found').html();
                    console.log("finished and redirect: " + redirect);
                    if(redirect.indexOf("selection_review.cfm") != -1){try{clearTimeout(kokoko);}catch(e){};kokoko = setTimeout(skipCall,500);} else {
                        console.log(redirect.indexOf("selection_review.cfm") + "ddd");
                    }
                    var selectionFlag = selectionFlag = $('#selection-redirect').html();
                    if (selectionFlag != undefined){
                        /*
						code for replacing loading new
						*/
                        $('.loading-gif').hide();
                        $('.options-and-streak').hide();
                        $('.audited__call__alert__holder').show();
                    }
                    if (redirect != undefined){
                        if(redirect.trim() == "review.cfm"){
                            getCallInfo(callBreak);
                        }
                        else{
                            //window.location.href = redirect;
                        }
                    }
                    else{
                        console.log("no problems found");
                    }

                    $('.loading-gif').css("display","inline-block");

                    updateRModule();
                }
            });
        };
    }catch(e){}
    setTimeout(arreglar,100);
}