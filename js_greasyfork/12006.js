// ==UserScript==
// @name       More UI part2
// @namespace  http://use.i.E.your.homepage/
// @version    1.0.2.1
// @description The second part to The GT UI+
// @match      http://www.ghost-trappers.com/fb/camp.php*
// @match      http://www.ghost-trappers.com/fb/hunt.php*
// @copyright  2015+, GTNoAPI
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12006/More%20UI%20part2.user.js
// @updateURL https://update.greasyfork.org/scripts/12006/More%20UI%20part2.meta.js
// ==/UserScript==

initUIv2();

function initUIv2(){
	GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://gtnoapi.herokuapp.com/api/ghosts',
			headers: {
				"Accept": "application/json",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache"
			},
			onload: function(rD) {
				$('.logText').each(function(){
					var ghostEncounter = $(this).find('a').html();
					var ghostInfo = getGhostByName(ghostEncounter, rD.response);
					if(ghostEncounter && ghostEncounter == ghostInfo.name){
						var perantEle;
						var childEle;
						if(ghostInfo.loot){

							var arrow= $('<div></div>').css({
								'width': '0' ,
								'height': '0',
								'border-top': '10px solid transparent',
								'border-bottom': '10px solid transparent',
								'border-left': '10px solid #223341',
								'position': 'absolute',
								'top': '10px',
								'right': '-10px',
							})

							childEle = $('<span></span>').css({
								'position': 'absolute',
								'top': '-14px',
								'right': '40px',
								'z-index': '9999999',
								'font-size': '14px',
								'display': 'none',
								'background-color': '#223341',
								'border': '1px solid #222',
								'border-radius': '7px',
								'padding': '10px',
								'min-width': '150px'

							}).html(ghostInfo.loot);


							 perantEle = $('<div>?</div>').css({
								 'cursor':'pointer',
								 'padding': '1px 4.5px',
								 'border-radius': '50%',
								 'background-color': 'black',
								 'color': 'white',
								 'float': 'right',
								 'font-weight': 'bold',
								 'position': 'relative'
							 });


							perantEle.hover(function(){
								if(childEle.css('display')=='none'){
									childEle.show();
								}
								else{
									childEle.hide();
								}
							});

							arrow.appendTo(childEle);
							childEle.appendTo(perantEle)
						}




						$(this).append(perantEle);
					}
				});
			}
		});
};


function getGhostByName(name, jsonTxt){
	
	var obj = jQuery.parseJSON(jsonTxt);
	var result = '';
	for(var x = 0; x < obj.length; x++){
		if(obj[x].name == name){
			var title = '';
			for(var y = 0; y < obj[x].loot.length; y++){
				title += obj[x].loot[y] + '<br />';
			}
			
			result = {
				'name':obj[x].name,
				'loot':title,
				'type':obj[x].type
			}
			
		}
		
	}
	
	
	return result;
}