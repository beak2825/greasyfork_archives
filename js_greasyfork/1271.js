// ==UserScript==
// @name        GOTA Improvements
// @description Various improvements to Game of Thrones: Ascent
// @namespace   https://greasyfork.org/users/1665-nolana
// @include     http://gota.disruptorbeam.com/
// @include     http://gota-www.disruptorbeam.com/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.6.0/moment.min.js
// @version     5
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/1271/GOTA%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/1271/GOTA%20Improvements.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// $('div.locked').remove();
$(window).bind("load", function() {
   init();                        
});


function init() {
    $('#page-wrap').css('max-width',$(window).width()+'px');
    $('#holdings_container').width($(window).width()-10);
    // remove locked buildings
   // $(document).on('click','#navlink-buildings',function (e) {
   //   $('#building_items div.locked').remove();
   //});
   fixChat();
   observeChat();
   
   addGlobalStyle(".attack_date { color: grey; margin-left: 4px; margin-top:2px; text-align: left}");
   $(document).on('click', '#incomingtab', function() {
          getIncoming();
   });
}
var incomingAttacks;

function getIncoming() {
    console.log('getting incoming');
    window.setTimeout(function () {
    GM_xmlhttpRequest({
     method: "GET",
      url: "http://gota.disruptorbeam.com/play/incoming_attacks",
     onload: function(response) {
       incomingAttacks = JSON.parse(response.responseText);
       insertAttackTimestamps(incomingAttacks);
       console.log("Incoming:"+response.responseText);
     }
    });
    }, 2000);
}

function insertAttackTimestamps(a) {
    console.log('insert attack timestamps');
    // alert('bubu');
    $('div.perkscroll div.achiev-content').each(function() {
         $(this).remove('span.attack_date');
         var id = /[0-9]+/.exec($(this).find('div.increspond').attr('onclick'))
         var attack = a.attacks.filter(function(e){ return e.camp_attack_id === null ? e.pvp_id == id : e.camp_attack_id == id; })[0];
        console.log("last login:" + attack.attacker.updated_at);
        var text = 'Last seen:' + moment(attack.attacker.updated_at,"YYYY-MM-DD HH:mm:ss Z").local().format('MMMM Do YYYY, h:mm:ss a');
         $('<div class="attack_date">'+ text + '</div>').appendTo($(this));
    });
   
    unsafeWindow.$('div.perkscroll').data("jsp").reinitialise();
    //alert(unsafeWindow.$('div.perkscroll').data("jsp"));
}
 
function fixChat() {
    var chatWidth = $(window).width()/3;
    addGlobalStyle(".gamechat{bottom:auto;float:none;height:auto;left:auto;right:188px;margin-left:2px;margin-top:8px;padding:1px 10px 15px;position:absolute;top:3px;width:" + chatWidth +"px;"+
                   "background:url(http://disruptorbeamcdn-01.insnw.net/images/pvp/actionbg.png?t=e2e9110ff577) repeat-x scroll 0 0 #000;border:1px solid #444;border-radius:12px;color:#FFF;font-size:16px;text-align:left;z-index:3}");
    addGlobalStyle("b {font-weight:bold}");
    addGlobalStyle("sub {font-size:11px;color:grey}");
    addGlobalStyle(".gamechat .chatscroll p { width: " + (chatWidth - 60) + "px;margin-bottom: 2px;font-size: 14px;");
    addGlobalStyle("#building_items div.locked { display:none; }");
   $('#combatlog').width(chatWidth - 10);
    
    $('#combatlog .jspPane p.pchat').each(function () {
        fixChatLine($(this));
    });
}

function observeChat() {
    var target = $('#combatlog .jspPane')[0];
    // Create an observer instance
    var observer = new MutationObserver(function( mutations ) {
       mutations.forEach(function( mutation ) {
       var newNodes = mutation.addedNodes; // DOM NodeList
       if (newNodes !== null) { // If there are new nodes added
    	var $nodes = $(newNodes); // jQuery set
    	$nodes.each(function() {
    		var $node = $(this);
    		if ($node.hasClass( "pactivity" )) {
                console.log('act:'+$node.text());
                // TODO, fix activity line
    		} else if ($node.hasClass("pchat")) {
                console.log('chat:' + $node.text());
                fixChatLine($node, new Date().toLocaleString());
            }
    	});
       }
     });    
    });
    var config = { 
	   attributes: false, 
	   childList: true, 
	   characterData: false 
    };
    observer.observe(target, config);
}

function fixChatLine(p, time) {
    var text = p.text();
    var result = /([^:]+):(.*)/.exec(text);
    if (result === null) return; // already highlighted
    var author = result[1];
    var line = result[2];
   
    p.find('strong').replaceWith('<strong><b>' + author + '</b>' + line + (time ? '  <sub>' + time + '</sub>' : ''));
  
}
function addGlobalStyle(css) {
		try {
			var elmHead, elmStyle;
			elmHead = document.getElementsByTagName('head')[0];
			elmStyle = document.createElement('style');
			elmStyle.type = 'text/css';
			elmHead.appendChild(elmStyle);
			elmStyle.innerHTML = css;
		} catch (e) {
			if (!document.styleSheets.length) {
				document.createStyleSheet();
			}
			document.styleSheets[0].cssText += css;
		}
}
