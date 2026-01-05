// ==UserScript==
// @name         ubuntu-it Forum - [Risolto] automatizzato
// @description  Aggiunge un pulsante "Applica [Risolto]" alle proprie disussioni
// @include      http*://forum.ubuntu-it.org/viewtopic.php?*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        unsafeWindow
// @version      0.202010190929
// @namespace https://greasyfork.org/users/3779
// @downloadURL https://update.greasyfork.org/scripts/3507/ubuntu-it%20Forum%20-%20%5BRisolto%5D%20automatizzato.user.js
// @updateURL https://update.greasyfork.org/scripts/3507/ubuntu-it%20Forum%20-%20%5BRisolto%5D%20automatizzato.meta.js
// ==/UserScript==

this.onload_functions = unsafeWindow.onload_functions;
console.log( unsafeWindow.onload_functions );

this.$ = this.jQuery = jQuery.noConflict(true);

(function(jQuery){

	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 10: "return", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 59: ";", 61: "=",
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 173: "-", 186: ";", 187: "=",
			188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
			".": ">",  "/": "?",  "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    options: {
      filterTextInputs: true
		}
	};

  function keyHandler( handleObj ) {
    if ( typeof handleObj.data === "string" ) {
      handleObj.data = { keys: handleObj.data };
    }

		// Only care when a possible input has been specified
		if ( !handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function( event ) {
      // Don't fire in text-accepting inputs that we didn't directly bind to
      if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
        ( jQuery.hotkeys.options.filterTextInputs &&
          jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1 ) ) ) {
				return;
			}

			var special = jQuery.hotkeys.specialKeys[ event.keyCode ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				modif = "", possible = {};

      jQuery.each([ "alt", "ctrl", "meta", "shift" ], function(index, specialKey) {
        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });


      modif = modif.replace('alt+ctrl+meta+shift', 'hyper');

			if ( special ) {
				possible[ modif + special ] = true;
			}

			if ( character ) {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( this.jQuery );

var realConsole = console;
console = {
    log: function(msg){
        realConsole.log(msg);
        jQuery('#zoff-risolto-log').append('<div>'+msg+'</div>');
    }
};

var ajaxCache = {};

function syncAjax( url, data ){
    data = data || {};
    idStr = url+JSON.stringify(data);
    if( ajaxCache[idStr] ){
        return ajaxCache[idStr];
    }
    jQuery.ajax({
        async: false,
        url: url,
        data: data,
        dataType: 'html',
        success: function(result){
            ajaxCache[idStr] = result;
        }
    });
    return ajaxCache[idStr];
}

function getPost(topicId, firstOrLast, page){
    firstOrLast = !!firstOrLast;
    var result = syncAjax( 'viewtopic.php', {t:topicId, start: firstOrLast?0:(page-1)*20} );
    if( firstOrLast )
        return jQuery('.post:first',result);
    else
        return jQuery('.post:last',result);
}

function getTopicPages(){
    return parseInt($('.pagination:first li:not(.arrow):last').text());
}

function getCurrentPage(){
    return parseInt($('.pagination:first .active').text() || '1');
}

function getPostOrder(){
    if( jQuery('.post').length>1 ){
        var first_id = jQuery('.post:first').attr('id').substr(1);
        var last_id = jQuery('.post:last').attr('id').substr(1);
        return parseInt(last_id)>parseInt(first_id);
    }
    return getTopicPages()===1 || getCurrentPage()===1;
}

function getEditForm(post){
    var editUrl = post.find('a[title="Modifica messaggio"]').attr('href');
    var result = syncAjax( editUrl, {});
    return jQuery('#postform',result);
}

function createWaitLayer(){
    var wait = jQuery('<div><h1 style="text-align: center">Applico il tag [Risolto]...<br>Attendi qualche secondo per la fine delle operazioni</h1></div>');
    wait.css({
        'position': 'fixed',
        'top': '0px',
        'bottom': '0px',
        'left': '0px',
        'right': '0px',
        'color': 'white',
        'opacity': 0.8,
        'background-color': 'black'
    });
    setTimeout(function(){
		if( wait.is(':visible') ){
			wait.remove();
			alert('Le operazioni stanno impiegando piu\' tempo del dovuto, l\'inserimento del [Risolto] potrebbe essere fallito');
		}
	},10000);
    return wait;
}

function getCurrentUser(){
    var user = jQuery('a[href="./ucp.php"]:first').text().trim();
    return user || false;
}

function getCurrentTopicId(){
    var loc = jQuery('#page-body h2:first a').attr('href');
    var split = loc.split('t=');
    if(split.length<2){
        throw "Impossibile trovare l'ID della discussione";
    }
    return split[1].split('&')[0];
}

function isAdminOrMod(username){
    if( typeof localStorage.adminOrMod === 'undefined' ) {
        var result = syncAjax('memberlist.php',{ mode:'group', g:20 });
        localStorage.adminOrMod = !!jQuery('table .username-coloured:contains("'+username+'")',result).length;
    }
    return localStorage.adminOrMod === 'true';
}

function isOwner(user, topicId){
    var npages = getTopicPages();
    var currPage = getCurrentPage();
    var postOrderAsc = getPostOrder();
    if( postOrderAsc ){
        if( currPage===1 ){
            var topic_post = jQuery('.post:first');
        }else{
            var topic_post = getPost(topicId,postOrderAsc,npages);
        }
    }else{
        if( currPage===npages ){
            var topic_post = jQuery('.post:last');
        }else{
            var topic_post = getPost(topicId,postOrderAsc,npages);
        }
    }
	return !!topic_post.find('.postprofile').text().icontains(user);
}

function canEdit(user, topicId){
	if( !user ){
		return false;
	}
	return isAdminOrMod( user ) || isOwner(user, topicId);
}

function isAlreadySolved(){
	return jQuery('#page-body h2:first').text().icontains('[risolto]');
}

function isClosed(){
    return jQuery('.locked-icon').length!==0;
}


String.prototype.icontains = function (s){
    s = s || '';
    return this.toLowerCase().indexOf(s.toLowerCase())!==-1;
}


jQuery(function(){
    
    var log = jQuery('<div id="zoff-risolto-log" style="display:none"></div>');
    log.css({
        opacity: 1,
        color: 'black',
        backgroundColor: 'white'
    });
    var logContainer = jQuery('<div></div>');
    logContainer.css({
            position: 'fixed',
            top: 0,
            left: 0,
            paddingLeft: 3,
            paddingRight: 3,
            color: 'white',
            backgroundColor: '#cccccc',
            cursor: 'pointer',
        })
        .click(function(){
            jQuery('#zoff-risolto-log').toggle();
        })
        .append(log);
    jQuery(document.body).append(logContainer);
    
    var topicId = getCurrentTopicId();
    var alreadySolved = isAlreadySolved();
    var user = getCurrentUser();
    var adminOrMod = isAdminOrMod( user );
    var owner = isOwner(user, topicId);
    var closed = isClosed();

    console.log('version: ' + GM_info.script.version);
    console.log('topic: ' + topicId);
    console.log('user: ' + user);
    console.log('owner: ' + owner);
    console.log('adminOrMod: ' + adminOrMod );
    console.log('topic already solved: ' + alreadySolved);
    console.log('current page: ' + getCurrentPage() +'/' +getTopicPages());
    console.log('post order ASC: ' + getPostOrder());
    console.log('closed: ' + closed);
    
    var condition = !isNaN(topicId) && (!alreadySolved) && (user!==false) && ( adminOrMod || (owner && (!closed)) );
    console.log('condition: ' +  condition + ' type: ' + (typeof condition));

    if( condition===true ){
        console.log('preparing the button...');
        var button = jQuery('<input type="button" title="Aggiungi automaticamente il flag [Risolto] al titolo della discussione" class="button2" value="Aggiungi [Risolto]">');

        button.click(function(){

            var wait = createWaitLayer();
            jQuery(document.body).append(wait);

            var topic_post = getPost(topicId,getPostOrder(),getTopicPages());
            var editForm = getEditForm(topic_post);
            var subject = jQuery('#subject',editForm);
            subject.val('[Risolto] '+subject.val());

            if(jQuery('#postform').length > 0){
                jQuery('#postform').replaceWith(editForm);
            }else{
                jQuery('#smiley-box',editForm).remove();
                jQuery('#colour_palette',editForm).remove();
                jQuery(document.body).append(editForm);
            }

            setTimeout(function(){
                jQuery('input[name=post]',editForm).click();
            }, 2000);
        });

        jQuery('#topic-search fieldset').append(button);
        
        console.log('button added!' );
    }else{
        console.log('button not needed!');
    }
    jQuery(document).bind('keydown', 'ctrl+shift+l', function() {
            jQuery('#zoff-risolto-log').toggle();
    });
});


(function($){
  function check404(){
    return jQuery('#message:contains("La discussione richiesta non esiste.")').length>0;
  }
  function checkAmp(){
    return window.location.href.match(/&amp;/).length > 0;
  }
  if( check404() && checkAmp() ){
    window.location.href = window.location.href.replace(/&amp;/g,'&');
  }
})(jQuery);
