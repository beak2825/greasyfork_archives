// ==UserScript==
// @name         CrescentPlus
// @namespace    memeteam
// @version      1.2
// @description  try to take over the world!
// @author       Skyrossm, Xproplayer
// @match        https://crescent.gg/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/374416/CrescentPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/374416/CrescentPlus.meta.js
// ==/UserScript==

/* =======+ Settings +======= */
//var colorStealer = true; //Steal the previous message's color. NOTE: some users may use red and heck u over, use at own risk.
var betterPosts = true; //Add New Posts to the bottom of /shoutbox/
var nicknames = true;
    // [ID, Replacement, If the original name should be replaced]
		//To find the ID look at the url for someones profile
		//eg. https://crescent.gg/members/opalium.1/
		//                                        ^ you want this number
		//setting the 3rd argument to true will replace the full username and not just add brackets around it.
    var replacements = [
        [54, "Sky", false],
      	[98, "lmfao", false]
    ];

var flip = true; //flip the sidebar and forums alsos improves general look

(function() {
  	//Removes cooldown on shoutbox messages
  	setInterval(function() {
          	 document.cookie = "xf_shoutbox_last_shout" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}, 500);
  /*if(colorStealer){
    jQuery.ajax({
                url: "https://code.jquery.com/color/jquery.color.js",
                dataType: "script",
                cache: true
    });
    setInterval(function(){
        lastColor = $(".siropuShoutboxShouts > li > span").last().css("color");
        hexColor = jQuery.Color(lastColor).toHexString(false);
        XF.ajax("POST", XF.canonicalizeUrl("index.php?shoutbox/styling"), { shoutboxStyle: 'bold', shoutboxColor: hexColor });
        $("input[name=shout]").animate({color: lastColor},1000);
    }, 2000);
  }*/
  if(betterPosts && window.location.pathname == "/shoutbox/"){
        $('div[class="p-body-content"]').append('<br><style>.threadListItem{overflow:hidden;zoom:1;margin:0;padding:5px 0;border-top:1px solid #2c2c2c;border-bottom:1px solid #161616}.threadListItem:first-child{border-top:none;padding-top:0}.threadListItem:last-child{border-bottom:none}.threadListItem .avatar{float:left;font-size:0}.threadListItem .avatar img{width:24px;height:24px}.threadListItem .messageInfo{margin-left:34px}.threadListItem .title{padding:1px 0}.threadListItem .additionalRow,.threadListItem .title{overflow:hidden;white-space:nowrap;word-wrap:normal;text-overflow:ellipsis}</style><div id="threadFrame" class="section threadList"></div>');
    		$('#threadFrame').load('https://www.crescent.gg/ .block[data-widget-key="forum_overview_new_posts"]');
    		setInterval(function(){
        	$('#threadFrame').load('https://www.crescent.gg/ .block[data-widget-key="forum_overview_new_posts"]');
    		}, 300000);
  }
  if(nicknames){
        replace();
				
        setInterval(function() {
            replace(); 
        }, 1000);
  }
  
  if(flip){
    $('.p-body-main').css({"direction": "ltr"});
    //$('.p-body-header').remove();
    $('.p-body-content').css({"padding-right": "15px"});
    $('.p-body-sidebar .block').css({"background": "#1a1a1a", "border-radius": "5px", "padding": "14px", "box-shadow": "inset 0 0 10px rgba(0,0,0,0.85)"});
    $('.block-container').css("border-radius", "0px");
    $('.p-body-sidebar > div').last().remove(); $('.p-body-sidebar > div').last().remove();
    $('.p-pageWrapper').css({"background": "url('https://upload.wikimedia.org/wikipedia/commons/b/bc/STS-128_ISS_Approach_Moon.jpg') no-repeat", "background-position": "top left", "background-size": "auto 100%"});
    $('.headerProxy').css("background", "none");
    $('.node-extra-row').css({"white-space": "normal"});
    $('.nodeList.gridNodes .block-body .node').css("min-width", "100%");
    $('.node-main').css({"padding-top": "7px", "padding-bottom": "0px"});
  }
  
})();

function replace() {
        var usernames = document.getElementsByClassName('username');
        main:
        for (var i = 0; i < usernames.length; ++i) {
            if(usernames[i].children[0] != null)
              var item = usernames[i].children[0];
            else
              item = usernames[i];
          
            if (item) {
                if (usernames[i].href) {
                    var id = usernames[i].href.split(".").slice(-1)[0].split("/")[0];
                    for (var i2 = 0; i2 < replacements.length; ++i2) {
                        var replacement = replacements[i2];
                        if (id == replacement[0]) {
                            if (!item.innerHTML.includes(replacement[1])) {
                                if(replacement[2]){
                                    item.innerHTML = replacement[1];
                                } else {
                                    item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                }
                            }
                        }
                    }
                } else {
                    if (usernames[i].tagName == "H1") {
                        id = window.location.href.split("/").slice(-2)[0].split(".").slice(-1)[0];
                        for (var i2 = 0; i2 < replacements.length; ++i2) {
                            var replacement = replacements[i2];
                            if (id == replacement[0]) {
                                if (!item.innerHTML.includes(replacement[1])) {
                                    if(replacement[2]){
                                        item.innerHTML = replacement[1];
                                    } else {
                                        item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                    }
                                }
                            }
                        }
                    }
                    if (usernames[i].tagName == "H3") {
                        var id = item.href.split(".").slice(-1)[0].split("/")[0];
                        for (var i2 = 0; i2 < replacements.length; ++i2) {
                            var replacement = replacements[i2];
                            if (id == replacement[0]) {
                                if (!item.innerHTML.includes(replacement[1])) {
                                    if(!item.className.includes("StatusTooltip")){
                                        if(replacement[2]){
                                            item.innerHTML = replacement[1];
                                        } else {
                                            item.innerHTML = item.innerHTML + " <span style=\"color: grey;\">(" + replacement[1] + ")</span>";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
