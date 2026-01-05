// ==UserScript==
// @name        KAT - MOD - Decline Message
// @namespace   Dr.YeTii
// @include     *kat.cr/moderator/verify/tier1/*
// @include     *kickass.to/moderator/verify/tier1/*
// @version     1
// @description Awesomeness
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10754/KAT%20-%20MOD%20-%20Decline%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/10754/KAT%20-%20MOD%20-%20Decline%20Message.meta.js
// ==/UserScript==

$('body').prepend('<style>.data tr.odd:hover, .data tr.even:hover {background: none repeat scroll 0% 0% #E3E0D6;}</style>');
declineReason = "This is not a valid request. A valid one:\n•Is in English\n•Says something about yourself\n•Explicitly states what you plan to upload (titles, formats, etc)\nSo thank you, but we will have to decline you for the moment. Re-apply in 3 days. Don't PM mods as this is not taken lightly.";

$('.data tr:not(.firstr)').each(function() {
  if ($('td a.ilock', $(this)).length == 0) {
    $('.itorrent', $(this)).remove();
    var id = $('td a.redButton', $(this)).attr('href').split('/')[3];
    $('.iunverify', $(this)).remove();
    $('td:last', $(this)).prepend('<a data-id="'+id+'" title="Accept" class="greenButton iverify icon16 requestBtn acceptRequest"><span></span></a> '+
                                  '<a data-id="'+id+'" title="Not Explicit Enough\n\n'+declineReason+'" class="greyButton iunverify icon16 requestBtn declineRequest"><span></span></a> '+
                                  '<a data-id="'+id+'" title="Decline" class="redButton iunverify icon16 requestBtn declineOtherReason"><span></span></a>');
  }
});

$('.requestBtn').click(function() {
  fadeTr = true;
  var id = $(this).attr('data-id');
  if ($(this).is('.declineRequest')) {
    declineRequest(id, 3, declineReason);
  }else if ($(this).is('.acceptRequest')){
    $.post('/moderator/verifycontrol/'+id+'/', 'action=accept', function(data) {});
  }else if($(this).is('.declineOtherReason')) {
    var declineReasonCustom = prompt('Enter reason:');
    if (declineReasonCustom.length > 0) {
      var declineDurationCustom = prompt('How long should they wait? (7 days if invalid input)');
      if (!isNaN(declineDurationCustom)) {
        if (parseInt(declineDurationCustom) > 0) {
          declineRequest(id, declineDurationCustom, declineReasonCustom);
        }else{
          declineRequest(id, 7, declineReasonCustom);
        }
      }else{
        declineRequest(id, 7, declineReasonCustom);
      }
    }else{
      fadeTr = false;
    }
  }
  if (fadeTr)
    $(this).closest('tr').fadeOut(200);
});


function declineRequest(id, duration, reason) {
  $.post('/moderator/verifycontrol/'+id+'/', 'action=decline&duration=&custom_duration='+duration+'&reason='+encodeURIComponent(reason), function(data) {});
}