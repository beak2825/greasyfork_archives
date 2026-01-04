// ==UserScript==
// @name        Custom User Tags
// @namespace   incelerated
// @author      incelerated
// @version     0.9
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @match       https://incels.is/threads/*
// @match       https://incels.is/conversations/*
// @match       https://incels.is/account/preferences
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @description A script to add the ability to add custom tags for users on incels.is
// @downloadURL https://update.greasyfork.org/scripts/428704/Custom%20User%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/428704/Custom%20User%20Tags.meta.js
// ==/UserScript==



//for supporting tampermoneky
var getValue = (typeof GM.getValue != 'undefined')? GM.getValue : GM_getValue;
var setValue = (typeof GM.setValue != 'undefined')? GM.setValue : GM_setValue;


var usertags = {};

loadTags(function(){
  $(document).ready(function(){
    //for preferences page
    if(document.location.href.indexOf("account/preferences") != -1){
        applyBackRes();
        return;
    }
    //for threads
    applyTags();
    applyTagListeners();
    applyDocumentListeners();
  });
});


function loadTags(callback){
  return getValue('usertags', '{}').then(
    function(tags){
      usertags = JSON.parse(tags);
      if(typeof callback == 'function'){
      	callback();
      }
    }
  );
}


async function saveTags(){
  
  //reload tags first, in case we have made a change in another browser tab
  await loadTags();
  
  var inputs = $(".editing");

  //if we aren't editing anything then don't do anything
  if(inputs.length == 0){
    return;
  }
  
  inputs.each(function(){
    var username = $(this).attr('data-username');
  	var tagVal = $(this).val();
    //if tag is empty delete it from usertags
    if(tagVal == ''){
        if(typeof usertags[username] != 'undefined'){
            delete usertags[username];
        }
    }
    else{
        usertags[username] = tagVal;
    }
  });

  setValue('usertags', JSON.stringify(usertags)).then(
    //succ
    function(){
      //refresh all tags
      $(".customtag").remove();
      applyTags();
      applyTagListeners();
    },
    //fail
    function(error){
      alert('failed to save tag | ' + error);
    }
  );
  
}


function applyTags(){
  
  //add the tags for each user if defined
  $(".message-userDetails").each(function(){
    var detailsBox = $(this);
    var username = detailsBox.find("a.username").first();
    if(username.length === 0){
      return;
    }
    username = username.text();

    var tagsInput = document.createElement("input");
    tagsInput.type = 'text';
    tagsInput.className = 'input customtag';
    tagsInput.setAttribute('readonly', 'readonly');
    tagsInput.setAttribute('data-username', username);
    tagsInput.style = "padding: 1px 5px; margin-top: 5px; text-align: center; font-size: 1em; cursor: pointer; display: none;";
    if(typeof usertags[username] != 'undefined' && usertags[username] != ''){
      tagsInput.value = usertags[username];
      tagsInput.title = usertags[username];
      tagsInput.style.display = "block";
    }
    detailsBox.find(".userTitle").append(tagsInput);

  });
  
}


function applyTagListeners(){
  
  //clicking on tags enables editing
  $(".customtag").click(function(){
    $(this).removeClass('tempshow');
    $(this).removeAttr('readonly');
    $(this).css('cursor', 'auto');
    $(this).addClass('editing');
    $(this).focus();
  });
  
  //pressing enter on tag editor input saves the tag
  $('.customtag').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        saveTags();
    }
  });

}

function applyDocumentListeners(){
  
  //clicking anywhere on the page saves the tags
  $(document).click(function(e){
    //clicking on the tag itself doesn't trigger save
    if($(e.target).hasClass('customtag')){
      return;
    }
		saveTags();
  });
  
 
  //moving mouse over user details shows tags input (if tag is empty it is hidden)
  $(".message-userDetails").mouseover(function(){
    var customtag = $(this).find(".customtag").first();
    if(customtag.hasClass('editing')){
       return;
    }
    customtag.show();
  });

  //moving mouse away from details hides empty tag inputs
  $(".message-userDetails").mouseout(function(){
    var customtag = $(this).find(".customtag").first();
    if(customtag.hasClass('editing')){
       return;
    }
    if(!customtag.val()){
      customtag.hide();
    }
  });
  
}

function applyBackRes(){

	var lastBlock = $(".block-body").last();

	var backresHTML = `<h2 class="block-formSectionHeader"><span class="block-formSectionHeader-aligner">Custom User Tags</span></h2>
	<div class="block-body">
	<dl class="formRow formRow--noColon">
	<dt>
	<div class="formRow-labelWrapper"></div>
	</dt>
	<dd>
	<textarea id="usertags-textarea" class="field_Incel2 input input--fitHeight" style="height: 120px;"></textarea>
	<br />
	<button type="button" class="button" id="usertags-backup"><span class="button-text">Backup Tags</span></button>
	<button type="button" class="button" id="usertags-restore"><span class="button-text">Restore Tags</span></button>
	<div class="formRow-explain">
	To bakcup: Press Backup Tags and save the data in a text file for future use
	<br />
	To restore: Copy your backup in the field above and press Restore Tags
	</div>
	</dd>
	</dl>
	</div>`;

	$(backresHTML).insertAfter(lastBlock);

	$("#usertags-backup").click(function(){
		var data = JSON.stringify(usertags);
		$("#usertags-textarea").val(data);
	});

	$("#usertags-restore").click(function(){
        try{
            var data = JSON.parse($("#usertags-textarea").val());
            restore(data);
        }catch(e){
            alert('Bad data');
        }
	});

}

function restore(data){
    Object.assign(usertags, data);
    setValue('usertags', JSON.stringify(usertags)).then(
    //succ
    function(){
      alert('Tags updated successfully');
    },
    //fail
    function(error){
      alert('failed to update tags:\n' + error);
    }
  );
}