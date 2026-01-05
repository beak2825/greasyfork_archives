// ==UserScript==
// @require         https://code.jquery.com/jquery-1.12.3.min.js
// @name			TicketMaster
// @namespace		http://umggaming.com/clutch
// @description		You know what this does.
// @version			1.0
// @include			http://www.umggaming.com/admin/main.php?location=tickets_view&action=edit&id=*
// @downloadURL https://update.greasyfork.org/scripts/20378/TicketMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/20378/TicketMaster.meta.js
// ==/UserScript==

$(document).ready(function(){
    
  $('[name=assigned]').prop('selectedIndex', 1);
  $('[name=status]').prop('selectedIndex', 2);
  
  var matchExists = document.documentElement.innerHTML.indexOf('L-'); 
  if (matchExists == -1)
    {
      CKEDITOR.instances['new_response'].editable().setHtml("p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> As we cannot access the Match details, please create a new ticket in the proper arena for your issue linking the Match ID you are referencing. </br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>");
  $('[name=submit]').click();
    }
  
  if($('[name=arena]').get(0).selectedIndex == 0)
     alert("This is a Prime Elite ticket. Please click on another ticket.");
  
    var buttons = {
        "Normal Win": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the win for this match as you have provided valid proof of winning this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Already Won": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has already received the win for this match.  This ticket is now closed.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "No Ticket": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">As the opposing team failed to submit a Dispute Ticket within the time limit given, you have received the win for this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Accept Win": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/>Your team has received the win as the opposing team has accepted the loss for this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
      "Forfeit Win": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the win for this match as you have provided valid proof of the opposing team forfeiting this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "No Show Win": {"color": "1b7e5a", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the win for this match as you have provided valid proof of your opponent not showing up to play within the 15 minutes they are allowed.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Cancel": {"color": "73716e", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> I have decided to cancel this match since neither you or your opponent managed to submit valid proof for this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "No Match ID": {"color": "2489c5", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> As we cannot access the Match details, please create a new ticket in the proper arena for your issue linking the Match ID you are referencing. </br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
      "Lag 30+ Sec": {"color": "73716e", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> I have decided to cancel this match due to lag or connection issues that have affected the ability to fairly complete this match. </br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Normal Loss": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the loss for this match as the opposing team has provided valid proof of winning this match.</br><br/>If you have any more questions feel free to reply to this ticket and I’ll be glad to answer them for you!</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "DoP": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/>Your team has received the loss for this match as the opposing team has provided valid proof of winning this match.</br><br/><b>In addition, you have been banned for disputing on purpose.</b></br><br/><i>For the future, please review the UMGO General Rules section of the rules in order to learn the proper procedure on providing proof, reporting scores, etc.</i></br></br>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "No Ticket L": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> As your team failed to submit a ticket within the 2 hour time frame, the match outcome will remain. It's the responsibility of the winning team to report the score correctly.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Accept Loss": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the loss for this match as requested.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
      "Forfeit Loss": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the loss for this match as the opposing team has provided valid proof of you forfeiting this match.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "No Show L": {"color": "D83A3A", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> Your team has received the loss for this match as your opponent has provided valid proof of your team not showing up within the 15 minute time limit.</br><br/> [signature]</p>"},
        "Unfinished": {"color": "73716e", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> This match was cancelled due to the fact that it was not completed</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
        "Escalation": {"color": "2489c5", "text": "<p style=\"margin: 0px 0px 8px; line-height: 1.2; font-family: 'Segoe UI', arial, sans-serif; font-size: 13px;\">Hello,<br/><br/> If you believe the wrong call was made for this match, you may escalate this ticket to have it reviewed by the highest ranking supervisor or manager available.</br><br/>Thank you for using UMG Online!</br><br/> [signature]</p>"},
                      
    };
    var buttonCount = 0;
    
    var styleLeft = 270;
    var styleBottom = 40;
    
    $.each(buttons, function(key, value){
        buttonCount++;
        if(buttonCount == 10){
            styleLeft = 270;
            styleBottom = 0;
            buttonCount = 0;
        }
        
        $("<input/>").attr({
            "type": "button",
            "value": key,
            "class": "quick-response-button",
            "style": "position:absolute;bottom:"+styleBottom+"px;left:"+styleLeft+"px; width: 90px;border: 0 none;border-radius: 2px 2px 2px 2px;color: #fff;cursor: pointer;display: inline-block;font-family: Arial,sans-serif;font-size: 12px;font-weight: bold;line-height: 20px;margin-bottom: 0;margin-top: 10px;padding: 7px 10px;text-transform: none;transition: all 0.3s ease 0s;-moz-transition: all 0.3s ease 0s;-webkit-transition: all 0.3s ease 0s;text-align: center;background:#"+value.color+""
        }).appendTo("body");
        
        styleLeft = styleLeft + 95;
    });
    
    $(document).on("click", ".quick-response-button", function(){
        name = $(this).val();
        comment = buttons[name].text;
        
        CKEDITOR.instances['new_response'].editable().setHtml(comment);
		$('[name=submit]').click();
    });
});
