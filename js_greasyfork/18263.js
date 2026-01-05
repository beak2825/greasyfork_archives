// ==UserScript==
// @name         osu top ranks data adder
// @namespace    
// @version      0.1
// @description  Adds beatmap difficulty data/images/sound previews to user top ranks
// @author       Piotrekol
// @match        *://osu.ppy.sh/u/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/18263/osu%20top%20ranks%20data%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/18263/osu%20top%20ranks%20data%20adder.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
//==============================
//==============================
//==============================
var YOUR_OSU_API_KEY = "FILL WITH YOUR KEY THERE";
//==============================
//==============================
//==============================
//Do not edit below unless you know what you are doing

var imageField = "<td width=\"61\">\
					<a href=\"#\" onclick=\"playBeatmapPreview({0}); return false;\">\
					<img  height=\"45\" src=\"https://b.ppy.sh/thumb/{0}.jpg\">\
					</a>\
					</td>";
var dataField = "</br>\
					<b>AR</b> {0}"+
	                " <b>CS</b> {1}"+
	                " <b>OD</b> {2}"+
	                " <b>HP</b> {3}"+
	                " ({4}<div class=\"starfield\" style=\"width:14px; display:inline-block;\"><div class=\"active\" style=\"width:14px\"></div></div>)";
var useTest=false;
if(useTest){
	var highlightScore = function(LookFor,node){
		if(node.text().indexOf(LookFor) > -1)
			node.css({
                        "background-color": "#B0C4DE"
                    });
	}
}

function createObserver(target,cfg,nodeCallback){
    var observer = new MutationObserver(function( mutations ) {
        mutations.forEach(function( mutation ) {
            var newNodes = mutation.addedNodes;
            if( newNodes !== null ) {
                var $nodes = $( newNodes );
                $nodes.each(function() {
                    nodeCallback($(this));
                });
            }
        });    
    });
    try{
    	observer.observe(target, cfg);
	}catch(e){}
}


function run(){
	var target_top = $( "#leader" )[0];
	var target_fav = $("#beatmaps")[0];
	createObserver(target_top,{ 
					childList: true, 
					subtree: true
					},function(node){
	    var node = node.find(".h b a[href]")[0];

	    if (typeof node != 'undefined')
	    {
	        var mapID = node.attributes.href.value.split("/")[2].split("?")[0];
	        GetPage("https://osu.ppy.sh/api/get_beatmaps?k="+YOUR_OSU_API_KEY+"&b="+mapID,0,function(data){
	            data = JSON.parse(data);
	            $(node.parentNode.parentNode.parentNode.parentNode).prepend(imageField.format(data[0].beatmapset_id));
	            $(node.parentNode.parentNode).append(dataField.format(data[0].diff_approach,data[0].diff_size,
	            	data[0].diff_overall,data[0].diff_drain,(Math.round(data[0].difficultyrating*100)/100)));
	            
				if(useTest){
	            	highlightScore("HR",$(node.parentNode.parentNode.parentNode.parentNode));
	            }
	        });
	    }
	});
}

function GetPage(url,retryNumber,callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        synchronous: false,
        timeout: 10000,
        headers: {
            Referer: location.href
        },
        onload: function(resp) {
            callback(resp.responseText);
        },
        ontimeout: function() {
            if(retryNumber<1){
            	retryNumber++;
            	setTimeout(function(){
            		GetPage(url,retryNumber,callback);
            	},1500);
            }else{
            	callback(null);
            }
        }
    });
}
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

run();