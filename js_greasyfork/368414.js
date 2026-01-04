// ==UserScript==
// @name         Automatic Canned Negative Reputation Tool
// @namespace    https://hackforums.net/member.php?action=profile&uid=3165279
// @version      1.1
// @description  try to take over the world!
// @author       Elitas
// @match        https://hackforums.net/showthread.php?tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368414/Automatic%20Canned%20Negative%20Reputation%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/368414/Automatic%20Canned%20Negative%20Reputation%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var postNum = -1; //Allow counting from 0.
    $(".post").each(function(){ //For each post do...
        postNum += 1;//Set post number.
        var uid = document.querySelectorAll(".largetext a")[postNum].href.split("uid=")[1];//Grab uid of poster.
        var button = $("<a href='javascript:void(0)' class='postbit_ts postbit_neg' id='" + postNum + "'><span>Neg</span></a><");//Set button design.
        $(".author_buttons:eq(" + postNum + ")").append(button);//Create and append button.
    });
    function showRep(num){
        var uid = document.querySelectorAll(".largetext a")[num].href.split("uid=")[1];//Grab uid of poster.
        var post_key;
        var negRep;
        var c1 = "You have been automatically negrepped by Elitas' awesome, automatic negative rep tool.";
        var c2 = "DEAL WITH CAUTION!";
        var c3 = "You have been automatically negrepped. This means something you've posted on  HF is ignorant, wrong, a troll post, posting just to post, a waste of time to read, or a mixture of the aforementioned.";
        var c4 = "You have been negged, blame Elitas.";
        var c5 = "This user is not a fan of Summer Glau. I would have to recommend avoiding him at all costs."
        $.get("https://hackforums.net/reputation.php?uid=" + uid + "&action=add",function(content) {
            post_key = $(content).find("input[name='my_post_key']").val();
            negRep = $(content).find('#reputation option').length;
        });
        $(".selectDiv").remove();
        $(".author_buttons:eq(" + num + ")").append($("<span class='selectDiv'></br></span><div style='float:left;' class='selectDiv'><select id='cannedNum" + num + "' style='height:30px;'><option value='1'>" + c1 + "</option><option value='2'>" + c2 + "</option><option value='3'>" + c3 + "</option><option value='4'>" + c4 + "</option><option value='5'>" + c5 + "</option></select></div><a href='javascript:void(0)' class='postbit_ts postbit_conf selectDiv' id='confirm" + postNum + "'><span>Confirm</span></a>"));
        $(".postbit_conf").click(function(){
            var canned = $("#cannedNum" + num).val();
            var cannedResponse;
            if(canned == 1){
                cannedResponse = c1;
            }
            else if(canned == 2){
                cannedResponse = c2;
            }
            else if(canned == 3){
                cannedResponse = c3;
            }
            else if(canned == 4){
                cannedResponse = c4;
            }
            else if(canned == 5){
                cannedResponse = c5;
            }
            else{
                alert("Invalid choice, you likely changed the value of a select element.");
                return 0;
            }
            if(negRep < 1){
                alert("You do not have permission to rep this user.");
                return 0;
            }
            else if(negRep == 2){
                negRep = 0;
            }
            else if(negRep == 7){
                negRep = -3;
            }
            else if(negRep == 9){
                negRep = -4;
            }
            else if(negRep == 11){
                negRep = -5;
            }
            else if(negRep == 21){
                negRep = -10;
            }
            $.ajax({
                type: 'POST',
                url: 'https://hackforums.net/reputation.php',
                data: {
                    'my_post_key': post_key,
                    'action': 'do_add',
                    'uid': uid,
                    'reputation': negRep,
                    'comments': cannedResponse
                },
                success: function(msg){
                    if(msg.includes("successfully been updated")){
                        $(".selectDiv").remove();
                        alert("Your reputation for this user has been successfully updated!")
                    }
                    else{
                        $(".selectDiv").remove();
                        alert("Failure: The reputation was not set for this user for an unknown reason.");
                    }
                }
            });
        });
    }
    $(".postbit_neg").click(function(){ showRep(this.id); });
})();