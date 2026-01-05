// ==UserScript==
// @name        AO3 anti-kudos
// @namespace   ao3
// @description Lets you leave anti-kudos on terrible fic.
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @version     1.2
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant		GM_setValue
// @grant 	GM_listValues
// @grant 	GM_getValue
// @grant		GM_xmlhttpRequest
// @grant		GM.setValue
// @grant 	GM.listValues
// @grant 	GM.getValue
// @grant		GM.xmlHttpRequest
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @require 	https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.1.35/aws-sdk.min.js
// @downloadURL https://update.greasyfork.org/scripts/10543/AO3%20anti-kudos.user.js
// @updateURL https://update.greasyfork.org/scripts/10543/AO3%20anti-kudos.meta.js
// ==/UserScript==
//******* CONFIG OPTIONS ******* //
window.antikudosConfig = {
    hideCrap: false,
    // set to true if you don't want to see works you've left anti-kudos on.
	boldCrap: true
	// set to false if you don't want the number of anti-kudos to be bolded.
};


 
// ***************************** //

var options = window.antikudosConfig;

(async function(){
  
  AWS.config.update({accessKeyId: 'AKIAIBDCUKBAGRNARCIQ', secretAccessKey: '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'});
  AWS.config.region = 'us-west-1'; 
  var myBlacklist = await GM.listValues();
  
  var works = $('li.blurb');
  if (works[0]) {
    if (options.hideCrap === true) hideWorks(works);
    addAntikudosStats(works, false);
      return;
  }else{
    works = $('dl.meta');
    if (works[0]) {addAntikudosStats(works, true); } else {return;}
  }
  
  var workID = $('#kudo_commentable_id').val();
  var didWeClick = await GM.getValue(workID.toString(), false);
  var clickedButton = false;
  var buttons = $('div.feedback').find('li');
  var messageSpace = $('#kudos_message');

  var antikudoText = '<li id=\"antikudosbutton\"><a>Anti-Kudos ♠</a></li>';
  var antikudos = buttons.find(':contains(\'Next Chapter\')').length ? buttons.eq(2).after(antikudoText) : buttons.eq(1).after(antikudoText);
  listAntikudos(workID, false, didWeClick);
	
  $('#antikudosbutton').click(function(){
      if (clickedButton) return;
      if (didWeClick){
        messageSpace.addClass("comment_error").append("You have already expressed your hatred for this fic. :)");
      }else{
			
      GM.xmlHttpRequest({
        method: "POST",
        url: "http://ec2-52-8-177-39.us-west-1.compute.amazonaws.com/",
        data: workID,
        headers: {'Content-Type': 'text/plain'},
        onerror: function(dummy){
          messageSpace.addClass("comment_error").append("Something went wrong! Please reload and try again.");
        },
        onload: async function(response){
          if (response.status === 200){
            if (response.responseText === 'Item was added!') {
                  messageSpace.addClass("notice").append("Thank you for leaving anti-kudos!");
              listAntikudos(workID, true, didWeClick);
              await GM.setValue(workID.toString(), true);
            }else{
              messageSpace.addClass("comment_error").append("Something went wrong! Server message: "+ response.responseText+" Please reload and try again.");
            }
          }else{
            messageSpace.addClass("comment_error").append("Something went wrong! Status code " + response.status + ". Please reload and try again.");
          } 
        } 
      }); 
      }
      clickedButton = true; 
  }); 
})();


function listAntikudos(thisworkID, justClicked, didWeClick){
	getOneFromDatabase(thisworkID, function(numAntis){	
		if (justClicked === false && (numAntis === 0 || numAntis === "N/A")) {return;}
		var antikudoListText = 'left anti-kudos on this work!</p>'
		if (justClicked || didWeClick){
			numAntis--; 
			if (numAntis === 0){
				antikudoListText = '<p class=\"antikudos kudos\">You '+antikudoListText;
			}else if (numAntis === 1){
				antikudoListText = '<p class=\"antikudos kudos\">You and '+numAntis+' hater '+antikudoListText;
			}else{
				antikudoListText = '<p class=\"antikudos kudos\">You and '+numAntis+' haters '+antikudoListText;
			}
		}else{
			if (numAntis === 1){
				antikudoListText = '<p class=\"antikudos kudos\">'+numAntis+' hater '+antikudoListText;
			}else{
				antikudoListText = '<p class=\"antikudos kudos\">'+numAntis+' haters '+antikudoListText;
			}
		}
		
		if ($.find('p.antikudos').length > 0){
			$('p.antikudos').replaceWith(antikudoListText);
		}else{
			var kudosList = $('#kudos');
			var antikudosList = kudosList.find('p.kudos').length ? kudosList.find('p.kudos').before(antikudoListText) : kudosList.append(antikudoListText);			
		}
		$('p.antikudos').css('background', 'url(\"http://i.imgur.com/XYu9WJD.png\") no-repeat');
	}); 
}

function addAntikudosStats(works, isWorkPage){
	var thisworkID;
	var numAntikudos = [0];
	
	if (isWorkPage){
		thisworkID = $('#kudo_commentable_id').val();
		
		getOneFromDatabase(thisworkID, function(output){
			numAntikudos[0] = output;
			displayNumberAntikudos(works, numAntikudos, thisworkID);
		}); 
	}else{
		var tableName = 'numAntiKudosTable';
		var table = new AWS.DynamoDB({params: {TableName: tableName}});
		var worksParams = {
			"RequestItems" : {
				"numAntiKudosTable" : {
					"Keys" : []
				}
			}
		};
		var theseworkIDs = [];
		var workLink;
		works.each(function(index, value){
			if ($(this).hasClass('work')){
				theseworkIDs[index] = $(this).attr('id').slice(5);
			}else{
				workLink = $(this).find('h4.heading').find('a').attr('href');
				if (workLink.slice(1,2) === 'w'){
					theseworkIDs[index] = workLink.slice(7);				
				}else{
					theseworkIDs[index] = index;
				}
			}
			worksParams.RequestItems.numAntiKudosTable.Keys[index] = {"workID" : {"S" : theseworkIDs[index].toString()}}; 
		}); 
		table.batchGetItem(worksParams, function(err, data){
			if (err) {console.log('error');
			}else{
				for (var i=0; i < theseworkIDs.length; i++){
					if (data.Responses.numAntiKudosTable.length > 0){
						for (var j=0; j < data.Responses.numAntiKudosTable.length; j++){
							if (theseworkIDs[i].toString() === data.Responses.numAntiKudosTable[j].workID.S ){
								numAntikudos[i] = data.Responses.numAntiKudosTable[j].numAntiKudos.N;
								break;
							}
							numAntikudos[i] = 0;
						}
					}else{
						numAntikudos[i] = 0;
					}
				}
			}
			displayNumberAntikudos(works, numAntikudos, theseworkIDs);
		});
	}
}

   
function hideWorks(works){
        var hideMe;
        var workID;
        works.each(function(){
			workID = $(this).attr('id').slice(5);
			hideMe = compare(workID);					
			if (hideMe) $(this).hide();     
        }); 
} 

function compare(workID){
	for(var i = 0; i < myBlacklist.length; i++){
		if (workID === myBlacklist[i]){
			return true;
		}
	}
	return false;
}

function displayNumberAntikudos(works, numAntikudos, theseworkIDs){
	works.each(function(index,value){	
		if (!$(this).hasClass('work') && $(this).find('h4.heading').find('a').attr('href').slice(1,2) !== 'w'){ return true; }
		var stats = $(this).find('dl.stats');
		var statText;
		var eqNum = 2;
		
		if (stats.find(":contains('Comments:')").length) eqNum++;
		if (stats.find(":contains('Kudos:')").length) eqNum++;
		if (stats.find(":contains('Updated:')").length) eqNum++;
		
		if (works.length > 1){
			statText = "<dt>Anti-Kudos: </dt><dd><a href=\"/works/"+theseworkIDs[index]+"#comments\">"+numAntikudos[index]+"</a></dd>";
			
		}else{
			statText = "<dt>Anti-Kudos: </dt><dd>"+numAntikudos[index]+"</dd>";
		}     
		if (options.boldCrap === true) { statText = "<b>"+statText+"</b>"; }
    stats.find("dd").eq(eqNum).after(statText);	
		$(this).attr('antikudos', numAntikudos[index]);
	});
	
	if (works.length > 1){
		var headerMenu = $('ul.primary.navigation.actions');
		var  antikudosMenu = $('<li class="dropdown"></li>').html('<a>Anti-Kudos</a>');
		headerMenu.find('li.search').before(antikudosMenu);
		var dropMenu = $('<ul class="menu dropdown-menu"></li>');
		antikudosMenu.append(dropMenu);
		
		var buttonSortAsc = $('<li></li>').html('<a>Sort on this page (ascending)</a>');
		buttonSortAsc.click(function() { sortUp(); });
		
		var buttonSortDesc = $('<li></li>').html('<a>Sort on this page (descending)</a>');
		buttonSortDesc.click(function() { sortDown(); });
		
		dropMenu.append(buttonSortAsc);
		dropMenu.append(buttonSortDesc);
	}
} 

function getOneFromDatabase(thisworkID, callback){
	var response;
	var table = new AWS.DynamoDB({params: {TableName: 'numAntiKudosTable'}});
	var workParams = {
		TableName: 'numAntiKudosTable',
		Key: {
			workID: {S: thisworkID.toString()}
		},
		ProjectionExpression: 'numAntiKudos'
	};
	table.getItem(workParams, function(err, data){
		if (err){response = "N/A"; 
		}else{
			if(Object.getOwnPropertyNames(data).length === 0){
				response = 0;
			}else{
				response = parseInt(data.Item.numAntiKudos.N,10);
			}
		}
		callback(response);
	}); 	
} 

function sortUp(){
	
	var work_list = $('li.blurb').first().parent();
	var blurbs = work_list.children('li');

	blurbs.sort(function(a, b) {
	   return parseInt(a.getAttribute('antikudos')) - parseInt(b.getAttribute('antikudos'));
	});

	blurbs.detach().appendTo(work_list);

}

function sortDown(){
	
	var work_list = $('li.blurb').first().parent();
	var blurbs = work_list.children('li');

	blurbs.sort(function(a, b) {
	   return parseInt(b.getAttribute('antikudos')) - parseInt(a.getAttribute('antikudos'));
	});

	blurbs.detach().appendTo(work_list);

}