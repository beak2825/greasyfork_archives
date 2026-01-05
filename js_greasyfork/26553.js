// ==UserScript==
// @name        Dominion for Lazy Folks Reloaded
// @namespace   forum.dominionstrategy.net
// @description Keyboard Shortcuts
// @version     2.03
// @grant       none
// @include     https://dominion.games/*
// @require     http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/26553/Dominion%20for%20Lazy%20Folks%20Reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/26553/Dominion%20for%20Lazy%20Folks%20Reloaded.meta.js
// ==/UserScript==

//Key Configs
selectorKeys = "SDFGHWERTYUJK";
augmenterKeys = "XCVBNM";
menuKeyLeft = 37;
menuKeyUp = 38;
menuKeyRight = 39;
menuKeyDown = 40;
menuKeyAccept = 32;
menuKeyChat = 13;
menuKeyEscape = 27;
menuKeyCycle = 9;
menuKeySubmit = 80;
menuPrefixKey = 192;

prefixKeys = "QAZÀ";

inGame = false;

//Lists of bad dudes
miscellaneousCards = {'Ruin Pile':[CardNames.RUINED_VILLAGE,CardNames.RUINED_LIBRARY,CardNames.ABANDONED_MINE,CardNames.RUINED_MARKET,CardNames.SURVIVORS],
					  'Prize Pile':[CardNames.TRUSTY_STEED,CardNames.FOLLOWERS,CardNames.PRINCESS,CardNames.DIADEM,CardNames.BAG_OF_GOLD],
					  'Shelters':[CardNames.NECROPOLIS,CardNames.OVERGROWN_ESTATE,CardNames.HOVEL],
					  'Spoils':[CardNames.SPOILS],
					  'Madman':[CardNames.MADMAN],
					  'Mercenary':[CardNames.MERCENARY]};
					  
superLongPiles =   	 {'Knights':[CardNames.DAME_ANNA,CardNames.DAME_JOSEPHINE,CardNames.DAME_NATALIE,CardNames.DAME_MOLLY,CardNames.DAME_SYLVIA,
								 CardNames.SIR_BAILEY,CardNames.SIR_DESTRY,CardNames.SIR_MARTIN,CardNames.SIR_MICHAEL,CardNames.SIR_VANDER],
					  'Castles':[CardNames.HUMBLE_CASTLE,CardNames.CRUMBLING_CASTLE,CardNames.SMALL_CASTLE,CardNames.HAUNTED_CASTLE,
								 CardNames.OPULENT_CASTLE,CardNames.SPRAWLING_CASTLE,CardNames.GRAND_CASTLE,CardNames.KINGS_CASTLE]};

animationSpeed = 20;
longAnimationSpeed = 300;
translucentAlpha = 0.7;

currentHotkeys = {};
activeKeys = prefixKeys.charAt(0);
typing = false;
activeNumerics = -1;
pointer = 0;
openMat = 0;

window.setInterval(checkGameState, 100);
window.setInterval(animate, 5);
window.setInterval(overlayHotkeys,100);
window.setTimeout(checkDebugStuff,1000);

function checkDebugStuff(){
    if (typeof angular.element(document.body).scope() == 'undefined') {
            angular.reloadWithDebugInfo();
        return false;
    } else {
        return true;
    }
}

function checkGameState(){    
    if ($('.game-page').length > 0 && $('.loading-page > *').length == 0){
		if (!inGame){
			startOfGame();
			inGame = true;
		}
    }else{
        inGame = false;
    }    
}

function startOfGame(){
	drawThings();
	$('.side-bar').fadeTo(longAnimationSpeed,translucentAlpha);
    assignKeys();
}

function assignKeys(){
	currentHotkeys = {};
    //Populate currentHotkeys. Call this at the start of the game, and every time keybinds change. For now that's only when tab is hit.
    let theSupply = activeGame.getSupply();
	
	for (let i = 0; i<theSupply.baseCardPiles.length; i++){
		currentHotkeys[prefixKeys[0]+selectorKeys.charAt(i)] = theSupply.baseCardPiles[i].pileName;
    }
	
	//shift due to ruins
	let ruinsDelta = theSupply.kingdomCardPiles[0].pileName.isRuin() ? 1 : 0;
    		
    //Alternate stuff for split piles, travellers
	for (let i = ruinsDelta; i<theSupply.kingdomCardPiles.length; i++){
		switch (true){
			case theSupply.kingdomCardPiles[i].pileName.isTraveller():
				let j = theSupply.kingdomCardPiles[i].pileName;
				let k = 0;
				do{
					currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i-ruinsDelta)+augmenterKeys[k]] = j;
					j = getTravellerSuccessors(j);
					k ++;
				}while (getTravellerSuccessors(j)!= "")
			break;
			
			case getBottomSplitPile(theSupply.kingdomCardPiles[i].pileName) != "":
				currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i-ruinsDelta)+augmenterKeys[0]] = theSupply.kingdomCardPiles[i].pileName;
				currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i-ruinsDelta)+augmenterKeys[1]] = getBottomSplitPile(theSupply.kingdomCardPiles[i].pileName);
			break;
			
			case theSupply.kingdomCardPiles[i].pileName.name in superLongPiles: //knights are yuck. Give them a 4-hit combo.
				let targetLongPile = superLongPiles[theSupply.kingdomCardPiles[i].pileName.name];
				for (let j =0; j<targetLongPile.length/2; j++){
					currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i)+augmenterKeys.charAt(0)+augmenterKeys.charAt(j)] = targetLongPile[j];
					currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i)+augmenterKeys.charAt(1)+augmenterKeys.charAt(j)] = targetLongPile[j+targetLongPile.length/2];
				}
			break;
			
			default:
				currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i-ruinsDelta)] = theSupply.kingdomCardPiles[i].pileName;
			break;
		}
    }
	
	//Landscapes
	for (let i = 0; i<theSupply.landscapes.length; i++){
		currentHotkeys[prefixKeys[1]+selectorKeys.charAt(i+theSupply.kingdomCardPiles.length-ruinsDelta)] = theSupply.landscapes[i].cardName;
	}
	
	
	//Populate miscellaneous. This includes split piles, travellers, hermit types, prizes, spoils, shelters and ruins.
	let i = 0; 
	for (pile of activeGame.getPiles()){
		if (pile.pileName.name in miscellaneousCards){
			if (miscellaneousCards[pile.pileName.name].length>1){
				for (let j =0; j<miscellaneousCards[pile.pileName.name].length; j++){				
					currentHotkeys[prefixKeys[2]+selectorKeys.charAt(i)+augmenterKeys.charAt(j)] = miscellaneousCards[pile.pileName.name][j];
				}
			} else {
				currentHotkeys[prefixKeys[2]+selectorKeys.charAt(i)] = miscellaneousCards[pile.pileName.name][0];
			}
			i++;
		}		
    }
	
	//derp some shelters in
	for (let j =0; j<miscellaneousCards['Shelters'].length; j++){				
		currentHotkeys[prefixKeys[2]+selectorKeys.charAt(i)+augmenterKeys.charAt(j)] = miscellaneousCards['Shelters'][j];
	}
	overlayHotkeys();
}

function getBottomSplitPile(card){	
	let topNames = [CardNames.SAUNA,
					CardNames.GLADIATOR,
					CardNames.SETTLERS, 
					CardNames.PATRICIAN,
					CardNames.CATAPULT];
	let bottomNames = [CardNames.AVANTO,
					   CardNames.FORTUNE,
					   CardNames.BUSTLING_VILLAGE, 
					   CardNames.EMPORIUM,
					   CardNames.ROCKS];
	if ($.inArray(card, topNames)>-1){
		return bottomNames[$.inArray(card, topNames)];
	}else{
		return "";
	}
}

function getTravellerSuccessors(card){
	let travellerLines =  [[CardNames.PAGE,
							CardNames.TREASURE_HUNTER, 
							CardNames.WARRIOR,
							CardNames.HERO,
							CardNames.CHAMPION],
						   [CardNames.PEASANT,
							CardNames.SOLDIER,
							CardNames.FUGITIVE,
							CardNames.DISCIPLE,
							CardNames.TEACHER]];
	for (line of travellerLines){
		if ($.inArray(card,line)>-1 && $.inArray(card,line)<line.length-1){
			return line[$.inArray(card,line)+1];
		}
	}
	return "";
}

function overlayHotkeys(){
	if(inGame){
		for (selector of ['.supply .mini-card','.hand .full-card', '.base-hero-bar .mini-card', '.reveal-area .full-card']){
			$(selector).each(function(index){
				let cardName = returnCardNameFromLiteral($(this).find('.card-name').html());
				let cardHotkey = findHotkey(cardName);
				if ($(this).find('.DFLPHotkeyOverlay').length == 0){
					$(this).append(returnCardHotkeyOverlay(cardHotkey,8,30));
				} else{
					for (let i = 0;i<cardHotkey.length;i++){
						$(this).find('.DFLPHotkeyOverlay .DFLPHotkeyLabel:eq('+i+')').html(cardHotkey[i]);
					}
				}
			});
		}
		
		$('.supply .event').each(function(){
			if ($(this).find('.DFLPHotkeyOverlay').length == 0){
				let cardName = returnCardNameFromLiteral($(this).find('.event-name').html());
				$(this).append(returnCardHotkeyOverlay(findHotkey(cardName),10,12));
			}
		});
		
		$('.done-buttons-area .done-button,.game-button,.number-button').each(function(index){
			$(this).val($(this).val().replace(/^(\(.\)-)?/,'('+(index+1)+')-'));
		});		
		
		$('.modal-window .lobby-button').each(function(index){
			$(this).html($(this).html().replace(/^(\(.\)-)?/,'('+(index+1)+')-'));
		});	
		
		//shrink text of cleanup stuff
		if ($('single-cleanup .cleanup-window').length > 0){		
			$('.cleanup-window button.single-cleanup-disable').html($('.cleanup-window button.single-cleanup-disable').html().replace(/^(\(←\) )?/,'(←) '));  
			$('.cleanup-window button.single-cleanup-done').html($('.cleanup-window button.single-cleanup-done').html().replace(/( \(→\))?$/,' (→)'));
			$('.cleanup-button').css('font-size','1.0vw');
		}
		
		$('.cleanup-window .cleanup-item').each(function(){	
			$(this).find('.cleanup-button').eq(0).html($(this).find('.cleanup-button').eq(0).html().replace(/^(\(←\) )?/,'(←) '));
			$(this).find('.cleanup-button').eq(0).css('font-size','1.0vw');		
			$(this).find('.cleanup-button').eq(1).html($(this).find('.cleanup-button').eq(1).html().replace(/( \(→\))?$/,' (→)'));
			$(this).find('.cleanup-button').eq(1).css('font-size','1.0vw');
		});
		if ($('.cleanup-window .cleanup-done').length>0){
			$('.cleanup-window .cleanup-done').html($('.cleanup-window .cleanup-done').html().replace((new RegExp('( \\('+String.fromCharCode(menuKeySubmit)+'\\))?$')),' ('+String.fromCharCode(menuKeySubmit)+')'));
			$('.cleanup-window .cleanup-done').css('font-size','1.0vw');
		}
		
		let firstControlLink = $('.control-link').eq(0);
		firstControlLink.html(firstControlLink.html().replace(/^(\(.\)  )?/,'(`)  '));
		
		if (activeKeys == 'À'){
			$('.control-link').css('color','#9999FF');
			$('.control-link').each(function(index){
				$(this).html($(this).html().replace(/(-\(.\))?$/,'-('+(selectorKeys.charAt(index)+')')));
			});
		}else{
			$('.control-link').css('color','#d3d3d3');
			$('.control-link').each(function(index){
				$(this).html($(this).html().replace(/(-\(.\))?$/,''));
			});
		}
		
		$('.DFLPTurnStartPictorial').remove();
		
		let k = 0;
		if ($('.ability-link').length>0){
			publicAbilities.map(x => {
				let thisName = activeGame.getCardNameById(x.association);
				let y = x.logEntryArguments;
				let subtitle = "";
				if (y.length>0){
					y[0].argument.map(function(z){
						subtitle += z.cardName.name+(z.frequency==1?"":" x"+z.frequency)+", ";
					});
				}
				subtitle = subtitle.replace(/, $/,"");
				$('.DFLPTurnStartContainer').append(returnStartTurnPictorial(getFullArtURL(thisName),thisName.name,subtitle,k+1));
				k++;
			});
			$('.game-log story').css('display','none');
		}
		
		
		handleNumberBarVisibility();
		handleMenuVisibility();
		recolorOverlays();
	}
}

function drawThings(){
	$('.game-area').prepend(returnNumberBar(0));
	$('.game-area').prepend(returnIconBar());
	$('.game-area').prepend(returnStartTurnContainer());
}

function recolorOverlays(){
	$('.DFLPHotkeyOverlay').each(function(index){
		for (let i = 0; i<$(this).find('.DFLPHotkeyLabel').length;i++){
			if (activeKeys.charAt(i) == $(this).find('.DFLPHotkeyLabel:eq('+i+')').html()){
				$(this).find('.DFLPHotkeyLabel:eq('+i+')').css('color','#9999FF');
			}else{
				for (let j = i; j<$(this).find('.DFLPHotkeyLabel').length;j++){
					$(this).find('.DFLPHotkeyLabel:eq('+j+')').css('color','#FFFFFF');
				}
				break;
			}
		}
	});
}

function handleNumberBarVisibility(){
	if(activeNumerics>-1 || typing){
		$('.DFLPNumberBar').css('display','inline-block');
	}else{
		$('.DFLPNumberBar').css('display','none');
	}
}

function handleMenuVisibility(){
	//opacities and highlighting
	pointer = Math.max(0,pointer);            
	var toBeHighlighted =  [$('cleanup-item:eq('+pointer+') .cleanup-button'),
							$('.reveal-area .full-card:eq('+pointer+')'),
							$('.order-window .full-card:eq('+pointer+')'),
							$('.number-input:eq('+pointer+')')];
	var doNotHighlight =   [$('cleanup-item:not(:eq('+pointer+')) .cleanup-button'),
							$('.reveal-area .full-card:not(:eq('+pointer+'))'),
							$('.order-window .full-card:not(:eq('+pointer+'))'),
							$('.number-input:not(:eq('+pointer+'))')];
	
	[0,1,2,3].map(x => {doNotHighlight[x].fadeTo(animationSpeed,translucentAlpha);
						toBeHighlighted[x].fadeTo(animationSpeed,1);});
						
	$('.game-log.ng-hide').length>0? $('.DFLPTurnStartContainer').fadeTo(animationSpeed,0.3) : $('.DFLPTurnStartContainer').fadeTo(animationSpeed,0.9);
    	
}

function animate(){
	if(inGame){
		if (activeKeys == 'À'){
			if (parseInt($('.DFLPIconBar').css('bottom'))<0){
				DFLPHotbarSlide(8);
			}
		}else{
			if (parseInt($('.DFLPIconBar').css('bottom'))>-parseInt($('.DFLPIconBar').css('height'))){
				DFLPHotbarSlide(-8);
			}
		}
	}
}

function iconBarActions(index){
	switch (index){
		case 3:			        
			$(".searchBoxContainer").css('display',"inline");
		break;
		
		case 4:
			openMat = (openMat+1) % 3;			
			switch(openMat){
				case 0: angular.element($('.opponent-name-counter-pane').eq(0)).scope().onClick(); break;
				case 1: angular.element($('.opponent-name-counter-pane').eq(1)).scope().onClick(); break;
				case 2: $('.game-area').click(); break;
			}
		break;
		
		default:
			$('.control-link').eq(index).click();
		break;		
	}
}

function searchResults(text, wordsList){
    var output = "";
    $.each(wordsList, function(i,word){
        var regex = new RegExp("^"+text,"i");
        if (regex.test(word) && output == ""){
            output = word;
        }
    });
    return output;
}

$(document).keyup(function(e){
	if (inGame){
		if (e.keyCode == 16){
			typing = false;
			$('.DFLPNumberBar').fadeTo(longAnimationSpeed,translucentAlpha);
		}
	}
});

$(document).keydown(function(e){
	if (inGame){		
        if($(".game-chat-input").is(":focus")){			
			//escape chat when message sent
			if($(".game-chat-input").is(":focus")){
				if (e.keyCode == menuKeyEscape){
					$('.game-chat-input').blur();
					$('.side-bar').fadeTo(longAnimationSpeed,translucentAlpha);
				}
			}
		}
		else{
			//search
			if($(".searchBoxContainer").css('display')!='none'){
				switch(e.keyCode){
					case 8:
					   $(".searchBox").html($(".searchBox").html().replace(/.$/,""));
					   break;
					case menuKeyChat:						
						submitSearchText($(".searchResults").html());
						$(".searchBox").html("");
						$(".searchBoxContainer").css('display','none');
						break;
					case 192:
						$(".searchBox").html("");
						$(".searchBoxContainer").css('display','none');
						break;
					case menuKeyEscape:
						$(".searchBox").html("");
						$(".searchBoxContainer").css('display','none');
						break;

					default:
					   $(".searchBox").html($(".searchBox").html()+String.fromCharCode(e.keyCode));
					   break;
				}
				var wordsList = [];
				for (var i=1; i< getValues(CardNames).length; i++){
				   wordsList.push(LANGUAGE.getCardName[getValues(CardNames)[i]]['singular']);    
				}
				var targetName = searchResults($('.searchBox').html(),wordsList);
				$('.searchResults').html(targetName);
				return;
			}
			
			//normal keys
			if (prefixKeys.includes(String.fromCharCode(e.keyCode))){
				activeKeys = String.fromCharCode(e.keyCode);
			}
			if (selectorKeys.includes(String.fromCharCode(e.keyCode))){
				//check for menu stuff
				if (activeKeys.charAt(0)=='À'){
					iconBarActions(selectorKeys.search(String.fromCharCode(e.keyCode)));
				}
				activeKeys = activeKeys.charAt(0)+String.fromCharCode(e.keyCode);
				if (checkHotkeyLegitimacy(activeKeys)){
					if ($.inArray(activeKeys,Object.keys(currentHotkeys))>-1){						
						triggerHotkey(currentHotkeys[activeKeys], e.shiftKey);
					}
				}
				else{
					activeKeys = activeKeys.charAt(0);
				}
			}
			if (augmenterKeys.includes(String.fromCharCode(e.keyCode))){
				if (activeKeys.length>1){
					activeKeys = activeKeys+String.fromCharCode(e.keyCode);
					if (checkHotkeyLegitimacy(activeKeys)){
						if ($.inArray(activeKeys,Object.keys(currentHotkeys))>-1){
							triggerHotkey(currentHotkeys[activeKeys], e.shiftKey);
						}
					}
					else{
						activeKeys = activeKeys.charAt(0);
					}
				}
			}
			
			//end action/game
			if (e.keyCode == menuKeyAccept){
				if ($('.end-actions-button').is(':visible')){
					$('.end-actions-button').click();    
				}
				else{
					if ($('.end-turn-button').is(':visible')){
						$('.end-turn-button').click();
					}					
				}
				return;
			}
			
			//chatting
			if (e.keyCode == menuKeyChat){
				$('.game-chat-input').focus();
				$('.side-bar').fadeTo(longAnimationSpeed,1);
			}
			
			//typing
			if (e.keyCode == 16){
				typing = true;
				activeNumerics = -1;
				$('.DFLPNumberBox').html(activeNumerics);
				$('.DFLPNumberBar').fadeTo(longAnimationSpeed,1);
			}
			
			//numerics
			if (typing){
				if (e.keyCode > 47 && e.keyCode < 58){
					if (activeNumerics < 9999){
						activeNumerics = 10*Math.max(0,activeNumerics)+(e.keyCode-48);
					}
					$('.DFLPNumberBox').html(activeNumerics);
				}
			}else{
				if (e.keyCode > 47 && e.keyCode < 58){
					let buttonCode = e.keyCode - 48;          
				
					if (e.keyCode == 48){
						buttonCode = 0;          
					}
					if (($('.done-buttons-area .done-button,.game-button,.number-button').length>=buttonCode ||$('.modal-window .lobby-button').length>=buttonCode)&& buttonCode !=0){
						hitButton(buttonCode);
					}else{
						activeNumerics=buttonCode;
						$('.DFLPNumberBox').html(buttonCode);
						numerics(activeNumerics);
					}
				}
			}
			
			if (e.keyCode == menuKeySubmit){				
				if (activeNumerics!=-1){
					numerics(activeNumerics);
				}else{
					menuNavigation(4);
				}
			}
			
			//navigation
			if ($.inArray(e.keyCode,[menuKeyUp,menuKeyLeft,menuKeyDown,menuKeyRight])>-1){
				menuNavigation($.inArray(e.keyCode,[menuKeyUp,menuKeyLeft,menuKeyDown,menuKeyRight]));
			}
			
			
			recolorOverlays();
		}
	}
	//Call rehotkeying
});

function submitSearchText(targetText){
	triggerHotkey(CardNames[targetText.toUpperCase()], false);
}

function checkHotkeyLegitimacy(hotKey){
	let output = false;
	for (candidate in currentHotkeys){
		if ((new RegExp("^"+hotKey)).test(candidate)){
			output = true;
		}
	}
	return output;
}

function triggerHotkey(targetCard, shifted){
	if (publicCollectors.length>0){		
		switch(publicCollectors[0].type){
			case 0: //playing out of hand
				clickCard('.hand','.full-play-border',targetCard);
			break;	
			case 1: //Gain. Order is in ordinal order.
				clickCard('.supply','.mini-card',targetCard);
				clickCard('.base-hero-bar','.mini-card',targetCard);
			break;
			case 2: //Discarding.
				clickCard('.game-area','.full-discard-border',targetCard);
			break;
			case 3: //Trashing, lame clicks too.
				clickCard('.game-area','.full-trash-border',targetCard);
				//Huge exception here for lurker. (and salt)
				if ($('.mini-card:has(.plus-sign)').length > 0){					
					let cardInTrash = false;
					$('.full-play-border').each(function(index){
						if (returnCardNameFromLiteral($(this).find('.card-name').html())==targetCard){
							cardInTrash = true;
						}
					});
					if ($('.full-play-border').length == 0 || cardInTrash == false || shifted){
						clickCard('.supply','.mini-card',targetCard);
					}else{
						clickCard('.game-area','.full-play-border',targetCard);
					}
				}
				
			break;
			case 4: //Trashing, lame clicks too.
				clickCard('.game-area','.full-trash-border',targetCard);
			break;
			//5 and 6 are weird. Skipping.
			case 7: //Resolving reactions and stuff.
				clickCard('.game-area','.full-react-border',targetCard);
			break;
			
			
			case 9: //Buying. Same as gaining.
				let cardInHand = false;
				$('.hand .full-card').each(function(index){
					if (returnCardNameFromLiteral($(this).find('.card-name').html())==targetCard){
						cardInHand = true;
					}
				});
				
				//if not a treasure, not in hand, or shift is pressed
				if (targetCard.isTreasure() == false || cardInHand == false || shifted){					
					clickCard('.supply','.mini-card',targetCard);				
					clickCard('.base-hero-bar','.mini-card',targetCard);
					clickCard('.supply','.event',targetCard,'.event-name');
				}else{
					if (!shifted){				
						clickCard('.hand','.full-play-border',targetCard);				
					}
				}
			break;
			//10-12 are menu option things. Skip.
			case 13: //Topdecking. Copy discard.
				clickCard('.game-area','.full-discard-border',targetCard);
			break;
			case 14: //Set aside. Copy discard.
				clickCard('.game-area','.full-discard-border',targetCard);
			break;
			case 15: //returning to supply. (or revealing province to tournament wtf)
				clickCard('.hand','.full-card',targetCard);
			break;
			case 16: //Pass.
				clickCard('.hand','.full-pass-border',targetCard);
			break;
			//What the heck is complex???
			case 18: //Wish. Strangely enough this is probably the simplest.
				answerQuestion(18, getOrdinal(CardNames,targetCard));
			break;
			//Delayed???
			case 20: //Archive. Same as most reveal-window things.
				clickCard('.game-area','.full-play-border',targetCard);
			break;
			//Keep in discard??? 22-23 is bid/overpay. Nothing to do here.
			case 24: //Inn. Do this lame clicky way. Click the first nondiscarded one.
				$('.game-area .full-discard-border:has(.card-name:contains('+LANGUAGE.getCardName[targetCard]['singular']+')):eq(0)').click();
			break;
			case 25: //Secret Chamber. Copy discard.
				clickCard('.hand','.full-discard-border',targetCard);
			break;
			//26 is the other part of Secret Chamber.
			//27 Donate. Use default lame clicks.
			//28 Take How Many???
			//29 Return to supply. Use default lame clicks.
			case 30: //Gain Prize
				clickCard('.reveal-area','.full-card',targetCard);
			break;
			//31 Prioritize Cards????? 
			//32 Button???
			
			case 34: //Impersonate. BoM et. al. Copy gain.
				clickCard('.supply','.mini-card',targetCard);				
			break;
			default: //click something!
				clickCard('.game-area','.full-card',targetCard);				
			break;
		}
	}
	activeKeys = activeKeys.charAt(0);
}

function numerics(buttonCode){
	activeNumerics = -1;
	if (publicCollectors.length>0){		
		switch(true){
			case (typeof publicAbilities != 'undefined'):			
				let evt = {};
				evt.which = 1;
				publicAbilityClicked(evt, publicAbilities[buttonCode-1].index);
			break;
			case $('.number-range').length>0:
				submitNumericalAnswer(buttonCode);
			break;
			case $('.reveal-area .full-card').length>0: //Reveal window things.
				$('.reveal-area .full-card').eq(buttonCode-1).click();
			break;
			default:
				if ($('.done-buttons-area .done-button,.game-button,.number-button').length>=buttonCode){
					hitButton(buttonCode);
				}else{
					$('.reveal-area .full-card').eq(buttonCode-1).click();
				}
			break;
		}
	}	
}

function hitButton(buttonCode){
	pointer = 0;
	if ($('.modal-window .lobby-button').length>0){
		$('.modal-window .lobby-button').eq(buttonCode-1).click();
	}
	$('.done-buttons-area .done-button,.game-button,.number-button').eq(buttonCode-1).click();
}

function submitNumericalAnswer(buttonCode){
	questionType = $('.number-input:eq('+pointer+')').attr('question');
	console.info('answering_a_,_b_'.replace('_a_',questionType).replace('_b_',buttonCode))
	if (buttonCode >= $('.number-input').attr('min') && buttonCode <= $('.number-input').attr('max'))
		angular.element($('.number-range')).controller().answer(questionType,buttonCode);	
}

function indexInCollectors(i){
	return $.inArray(i,publicCollectors.map(x=>x.type)) > -1;
}

function menuNavigation(dirCode){
	//Direct things to the correct functions.
	if (publicCollectors.length>0){	
		if($.inArray(true,[11,12,22,23,26].map(x => indexInCollectors(x)))>-1){
			return sliderNavigation(dirCode);
		}
		if($('.reveal-area .full-card').length>0){
			return revealNavigation(dirCode);
		}
		if(indexInCollectors(8)){
			return orderNavigation(dirCode);
		}
		if($('end-of-turn .cleanup-window').length>0){
			return cleanupNavigation(dirCode);
		}
		if($('single-cleanup .cleanup-window').length > 0){
			if (dirCode == 1)
				$('.cleanup-window button.single-cleanup-disable').click();  
			if (dirCode == 3)
				$('.cleanup-window button.single-cleanup-done').click();
		}
	}	
}

function sliderNavigation(dirCode){
	switch(dirCode){
		case 1:
		case 3:
			$('.number-range:eq('+pointer+')').focus();
		break;
		
		case 0:
			pointer = Math.max(0,pointer-1);
			$('.number-range:eq('+pointer+')').focus();
			
		break;
		
		case 2:
			pointer = Math.min($('.number-range').length-1,pointer+1);
			$('.number-range:eq('+pointer+')').focus();
		break;
		
		case 4:
			$('.pay-button:eq('+pointer+')').click();
		break;
	}
}

function revealNavigation(dirCode){
	switch(dirCode){
		case 1:
			pointer = Math.max(0,pointer-1);
		break;
		case 3:
			pointer = Math.min($('.reveal-area .full-card').length-1,pointer+1);
		break;
		case 4:
			$('.reveal-area .full-card:eq('+pointer+')').click();
		break;
	}
}

function orderNavigation(dirCode){
	//copypastaed from v1.
	switch(dirCode){
		case 1:
			if (typing){//ha! what a stupid use of a variable.
				let targetCard = $('.order-window .full-card:eq('+pointer+')');
				let evt = {clientX : targetCard.offset().left-targetCard.width()/4, clientY : targetCard.offset().top+1};
				let evta = {clientX : targetCard.offset().left+1, clientY :targetCard.offset().top+1};
				angular.element(targetCard).scope().onMouseDown(evta);                            
				activeGame.broadcast(Events.DRAG, evt);
				activeGame.broadcast(Events.DROP);
				targetCard.click();
				
				pointer = Math.max(pointer-1, 0);
			}else{
				pointer = Math.max(0,pointer-1);
			}
		break;
		
		case 3:
			if (typing){
				let targetCard = $('.order-window .full-card:eq('+pointer+')');
				let evt = {clientX : targetCard.offset().left+targetCard.width()/4, clientY : targetCard.offset().top+1};
				let evta = {clientX : targetCard.offset().left+1, clientY :targetCard.offset().top+1};
				angular.element(targetCard).scope().onMouseDown(evta);                            
				activeGame.broadcast(Events.DRAG, evt);
				activeGame.broadcast(Events.DROP);
				targetCard.click();
				
				pointer = Math.min(pointer+1, $('.order-window .full-card').length-1);
			}else{
				pointer = Math.min($('.order-window .full-card').length-1,pointer+1);
			}
		break;
		
		case 4:
			$('.done-buttons-area input').click();
			pointer = 0;
		break;
	}
}

function cleanupNavigation(dirCode){
	var numberOfItems = $('.cleanup-window .cleanup-item').length;
	switch (dirCode){
		case 0:
			if(typing){				
				if ($('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-order-button').length>0){
					if (pointer != 0)
					   $('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-order-button:eq(0)').click();

					pointer = Math.max(0,pointer - 1);
				}
			}else{
				pointer = Math.max(0,pointer - 1);
			}
		break;
		
		case 2:
			if(typing){				
				if ($('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-order-button').length>0){
					if (pointer != 0)
					   $('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-order-button:eq(0)').click();

					pointer = Math.min(numberOfItems-1,pointer + 1);
				}
			}else{
				pointer = Math.min(numberOfItems-1,pointer + 1);
			}
		break;
		
		case 4:
			//end
			$('.cleanup-button.cleanup-done').trigger('click');
			pointer = 0;
		break;

		case 1:
		   //select first
		   $('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-action-button:eq(0)').click();
		break;

		case 3:
		   //select second
		   $('cleanup-item:eq('+pointer+') .cleanup-button.cleanup-action-button:eq(1)').click();
		break;    
	}
   return false;
}

function clickCard(cardLocation, cardBorderType, targetCard, cardNameType = '.card-name'){
	//because calling the events directly is too nasty.
	$(cardLocation+' '+cardBorderType).each(function(){
		if (returnCardNameFromLiteral($(this).find(cardNameType).html())==targetCard){
			$(this).click();
		}
	});
}

function answerQuestion(type, answer){
	if (answer > -1) { //probably shouldn't catch this here.
		console.info('answering '+type+','+answer);
		angular.element($('.mini-card')).scope().$parent.click({questionType: type, answerIndex: answer});
	}
	return true;
}

function returnCardNameFromLiteral(targetName){
	for (cName of Object.keys(CardNames)){
		if (LANGUAGE.getCardName[CardNames[cName].name]['singular'] == targetName){
			return CardNames[cName];
		}
	}
}

function returnNumberBar(defaultNumber){
	return '<div class = "DFLPNumberBar" style= "text-align: center; width:10vw; height:6vh; position: absolute; bottom:1vh; right:1vw; background-color: #000000; opacity:'+translucentAlpha+'; outline: #FFFFFF solid medium;">\
				<div style="display: inline-block; position:relative; width:100%; height:40%; margin-top: 5%; font-size:4vh; font-family:TrajanPro-Bold; z-index:901">\
					<span class = "DFLPNumberBox" style="position:relative; color:#FFFFFF;">'+defaultNumber+'</span>\
				</div>\
				<div style = "position:absolute; height:10%; top:60%;right:0.3vw;font-size:0.8em; font-family:TrajanPro-Bold; color:#FFFFFF; z-index:901">('+String.fromCharCode(menuKeySubmit)+')</div>\
			</div>';				
}

function returnCardHotkeyOverlay(keyCodes,fontSize, topMargin){
	let output = 	'<div class = "DFLPHotkeyOverlay" style = "display:inline-block; text-align: center; position: relative; width: 100%; height: 100%; top:0; z-index:901;">\
						<div style = "display: inline-block; width:auto; height:40%; margin-top: '+topMargin+'%; font: tahoma; color: #FFFFFF; text-shadow:3px 3px 6px #000000">\
							<span class = "DFLPHotkeyLabel small" style = "position:relative; bottom:0%; font-size:'+(fontSize/2)+'em">'+keyCodes[0]+'</span>';
	for (let i =1; i<keyCodes.length; i++){
		output += '<span class = "DFLPHotkeyLabel large" style = "position:relative; bottom:0%; font-size:'+fontSize+'em">'+keyCodes[i]+'</span>';
	}
	output += '</div>\
            </div>';
	return output;
}

function returnIconBar(){
	return '<div class = "DFLPIconBar" style = "position:absolute; bottom:0; right:0;">\
                <div class = "searchIconContainer" style="position:relative; width:50px; height: 50px; z-index: 9999999; background-color: #333333;">\
                    <img class = "searchIcon" src = "http://i.imgur.com/RaRiP1u.png" style = "position:absolute; left:0px; width:50px; height:50px;" /> \
					<div class = "DFLPIconHotkeyLabel large" style = "position:absolute; right:0px; bottom:0px; font-size:1.5em; color:#FFFFFF;">G</div>\
                    <div class = "searchBoxContainer" style="position:absolute; bottom:0px; right:50px; width:300px; height: 50px; z-index: 9999999; display:none;"> \
                        <img src = "http://i.imgur.com/TvFF6XM.png" style="position:absolute; width:100%; height: 100%; opacity: 0.9;" />\
                        <div class = "searchResults" style = "position: absolute; top: 30%; height: 20%; left: 12%; width: 90%; font-family:TrajanPro-Bold; font-size: 1.0em; color: #3333CC; text-transform: uppercase;"></div> \
                        <div class = "searchBox" style="position: absolute; top: 30%; height: 20%; left: 12%; width: 90%; font-family:TrajanPro-Bold; font-size: 1.0em; "></div> \
                    </div>\
                </div>\
                <div class = "matIconContainer" style="position:relative; width:50px; height: 50px; z-index: 9999999; background-color: #333333;">\
                    <img class = "matIcon" src = "http://i.imgur.com/rXKXJw9.png" style = "position:absolute; left:0px; width:50px; height:50px;" /> \
					<div class = "DFLPIconHotkeyLabel large" style = "position:absolute; right:0px; bottom:0px; font-size:1.5em; color:#FFFFFF;">H</div>\
                </div>\
            </div>';
}

function returnStartTurnPictorial(artURL, bigText, smallText, hotkey){
	return '<div class="DFLPTurnStartPictorial" style="position:relative; width:15vw; height: 6vh; left:0; top:auto; background:linear-gradient(to right, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)),url('+artURL+') no-repeat; background-size:cover; border-style:solid; border-width: 3px; border-color: #222222;">\
				<div style="width:100%; height:auto; left:5%; top:50%; position:absolute; transform: translateY(-50%);">\
					<div class="DFLPPictorialLabel left major" style="width:100%; height:100%; font-family: TrajanPro-Bold; color: #FFFFFF; text-shadow:3px 3px 3px #000000; font-size: 1.4em;">'+bigText+'</div>\
					<div class="DFLPPictorialLabel left minor" style="width:100%; height:100%; font-family: TrajanPro-Bold; color: #FFFFFF; text-shadow:3px 3px 3px #000000; font-size: 0.8em;">'+smallText+'</div>\
				</div>\
				<div class="DFLPPictorialLabel right" style="width:auto; height:auto; position:absolute; right:12%; top:50%; transform:translateY(-50%) translateX(50%); font-family: TrajanPro-Bold; color: #FFFFFF; text-shadow:3px 3px 3px #000000; font-size: 2.0em;">'+hotkey+'</div>\
			</div>';
}

function returnStartTurnContainer(){
	return '<div class="DFLPTurnStartContainer" style="position:absolute; top:5%; left:100%; opacity:0.9; z-index: 9999;"></div>';
}

function DFLPHotbarSlide(delta){
	currentPos = parseInt($('.DFLPIconBar').css('bottom').replace('px',''));
	currentPos += delta
	$('.DFLPIconBar').css('bottom',currentPos.toString()+'px');
}

function findHotkey(name) {
    return Object.keys(currentHotkeys)[Object.values(currentHotkeys).indexOf(name)];
}
