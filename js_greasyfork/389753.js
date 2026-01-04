// ==UserScript==
// @version 0.5
// @name Block Barking Dog in Review33
// @namespace http://www.review33.com/block_dog_bark
// @description Block user message in review33 thread ### THIS SCRIPT PROVIDED NO WARRANTY, USE IT AT YOUR OWN RISK ###
// @include *://www.review33.com/discuss/forum_message.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389753/Block%20Barking%20Dog%20in%20Review33.user.js
// @updateURL https://update.greasyfork.org/scripts/389753/Block%20Barking%20Dog%20in%20Review33.meta.js
// ==/UserScript==

// ===================================================================================================
// user customization START >>>>

// Add user_id in the list, seperated by comma, double quoted.
var blk_usr_ids = ["20470630235959", "20190815143610"];

// set if show user id; 0 = noShow, 1 = show;
var show_userid = 1;

// >> END user customization
// ===================================================================================================




// ===================================================================================================
// === advised not to modify code below
// ===================================================================================================

var blk_msg = '&#24050;&#31105;&#27490;&#20116;&#27611;&#29399;&#20098;&#21536;';
var blk_msg_unhide = '&#35731;&#23427;&#21536;';

var user_id;
var $ = window.jQuery;

(function() {

  $('body').prepend('<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>'); // added due to implement limitation
  $('body').prepend('<script>function fAllowDogBake(aObj){ $(aObj).parentsUntil(\'table\').find(\'tr\').css(\'display\', \'block\').filter(\'.c_warn_msg\').css(\'display\',\'none\'); };</script>');
  $('table').css('width', '100%');
  $('a[href*="pm_reply.php?touserid"]') // get <a>
    .before(function(i,s){return (show_userid===0?'':'<div style=\'color:#45c4ff; font-size:0.8em; padding:2px; font-style: italic;\'>ID: '+ encodeURIComponent(getUrlParameter('touserid', this.getAttribute('href'))) +'</div>') } ) // show userid
    .filter(function(index, aObj){
      user_id = isBlockedUserid(index, aObj);
      return user_id;
    }) // userid to block
    .parentsUntil('tbody', 'tr') // get parent tr
    .before('<tr class=\'c_warn_msg\'><td style="width:100%;height:50px;text-align:center;background-color:#ffd4d4; color:red; font-weight:bold;" colspan=4>&raquo; ' + blk_msg + ' &laquo; (<a href="#" onclick="javascript:fAllowDogBake(this);return false;">'+blk_msg_unhide+'</a>)</td></tr>') // add block msg b4 curr tr
    .css('background-color', '#ffd4d4').css('display', 'none') // massage theDog msg
    ;

    function isBlockedUserid(index, aObj) {
       user_id = getUrlParameter('touserid', aObj.getAttribute("href"));
       for(var i=0; i<blk_usr_ids.length; i++) {
           if(user_id == blk_usr_ids[i]) {
               user_id = user_id + ':' + Math.random();
               return user_id;
           }
       }
        //*/
      return false;
    }

    function getUrlParameter(sParam,sURL) {
        if (typeof sURL === "undefined") {return;}
        var sPageURL = sURL.split('?'),
            sURLVariables = sPageURL[1].split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    function consoleLog(msg) {
        console.log(new Date().toLocaleTimeString() + '  ::  ' + msg); // debug
    }

})();

