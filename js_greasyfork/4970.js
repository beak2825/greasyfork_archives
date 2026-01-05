// ==UserScript==
// @version    0.4
// @name       eUSA Forums Feed for Erepublik
// @namespace  http://eusaforums.com/
// @description  Preview the latest posts on your favorite eUSA Forums board from the Erepublik homepage
// @require		http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @grant		GM_setValue
// @grant		GM_deleteValue
// @grant		GM_getValue
// @grant		GM_xmlhttpRequest
// @match      *://www.erepublik.com/*
// @exclude    *://www.erepublik.com/*/*
// @copyright  2014+, Mike Ontry
// @downloadURL https://update.greasyfork.org/scripts/4970/eUSA%20Forums%20Feed%20for%20Erepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/4970/eUSA%20Forums%20Feed%20for%20Erepublik.meta.js
// ==/UserScript==

jQuery("body").append ( '                                                          																	\
    <div id="gmPopupContainer">                                               																		\
    <form> 																																			\
		<h2>eUSA Forums Feed Settings</h2><br />																									\
		<small>The username and password fields are optional. Use them if you are not already logged in to the forums on this device.</small><br />	\
		Username:<br />														  																		\
        <input type="text" id="eUSAForums-user" value="'+GM_getValue("user", "Forum Username")+'"><br />											\
		Password:<br />														  																		\
        <input type="password" id="eUSAForums-pass" value="'+GM_getValue("pass", "")+'"><br />          											\
		Number of posts to show:<br />														  														\
        <input type="text" id="eUSAForums-posts" value="'+GM_getValue("posts", "5")+'"><br />          												\
                                                                              																		\
        <button id="eUSAForums-submit" type="button">Save</button>			  																		\
		<button id="eUSAForums-clear" type="button">Clear Settings</button><br /><br />																\
		<h2>Add board</h2><br />																													\
		Board name:<br />																															\
        <input type="text" id="addboard-name"><br />																								\
		Board id:<br />																																\
		<input type="text" id="addboard-id"><br />																									\
		<button id="addboard-submit" type="button">Add</button><br /><br />																			\
		<h2>Remove board</h2><br />																													\
        <div id="removeboard-div"></div><br />																										\
		<button id="removeboard-submit" type="button">Remove</button><br />																			\
        <div id="gmCloseDlgBtn" title="Close"><img src="http://ereptools.tk/images/close.png"/></div>   											\
    </form>                                                                   																		\
    </div>                                                                    																		\
' );

jQuery(document).on("change", "#eUSAForums-board", function (e) {
    var board = jQuery("#eUSAForums-board").val();
    if(GM_getValue("board") != board) {
        GM_setValue("board", board);
        waitForFeed(GM_getValue("board"), GM_getValue("posts"));
    }
});

jQuery("#addboard-submit").click ( function () {
    var addName = jQuery("#addboard-name").val();
    var addId = jQuery("#addboard-id").val();
    jQuery("#addboard-name").val("");
    jQuery("#addboard-id").val("");
    if (addName != "" || addId != ""){
        if( GM_getValue("boardsList", "") != ""){
            var oldBoards = JSON.parse(GM_getValue("boardsList"));
            oldBoards.push(addName);
            oldBoards.push(addId);
            GM_setValue("boardsList", JSON.stringify(oldBoards));
        }else{
            var boardsList = [addName, addId];
            GM_setValue("boardsList", JSON.stringify(boardsList));
        }
    }
    jQuery("#gmPopupContainer").hide();
    loadBoardList();
});

jQuery("#removeboard-submit").click ( function () {
    var removeName = jQuery("#removeboard-name").val();
    if (removeName != ""){
        if( GM_getValue("boardsList", "") != ""){
            var oldBoards = JSON.parse(GM_getValue("boardsList"));
            for (i = 0; i < oldBoards.length; i++) { 
                if(oldBoards[i] == removeName){
                    oldBoards.splice(i-1,2);
                }
            }
            GM_setValue("boardsList", JSON.stringify(oldBoards));
        }
    }
    jQuery("#gmPopupContainer").hide();
    loadBoardList();
});

jQuery("#eUSAForums-submit").click ( function () {
    var user = jQuery("#eUSAForums-user").val();
    var pass = jQuery("#eUSAForums-pass").val();    
    var posts = jQuery("#eUSAForums-posts").val();
    if (GM_getValue("user") != user || GM_getValue("pass") != pass || GM_getValue("posts") != posts ) {
        GM_setValue("posts", posts);
        jQuery("#gmPopupContainer").hide();
        if(GM_getValue("user") != user || GM_getValue("pass") != pass){
            GM_setValue("user", user);
            GM_setValue("pass", pass);
            if(GM_getValue("user") != "Forum Username" || GM_getValue("pass") != ""){
            	loginForums();
            }
        }
        waitForFeed(GM_getValue("board"), GM_getValue("posts"));
    }else {
        jQuery("#gmPopupContainer").hide();
    }
});

jQuery("#eUSAForums-clear").click ( function () {
    jQuery("#eUSAForums-user").val("");
    jQuery("#eUSAForums-pass").val("");
    jQuery("#eUSAForums-posts").val("");
    GM_deleteValue("user");
    GM_deleteValue("pass");
    GM_deleteValue("board");
    GM_deleteValue("posts");
    waitForFeed("", "");
    loadBoardList();
    jQuery("#gmPopupContainer").hide();
} );

jQuery("#gmCloseDlgBtn").click ( function () {
    jQuery("#gmPopupContainer").hide();
} );

jQuery(".column:first").append('<h1 class="noborder eUSAForums-title" style="clear:left;"></h1><div id="eUSAForums-config">Feed Settings</div><div id="eUSAForums-select"></div>');
jQuery(".column:first").append('<div class="media_widget eUSAForums"><div id="eUSAForums-container"><ul></ul></div><a href="http://eusaforums.com/forum/index.php?action=forum" target="_blank" class="visit_eUSAForums" title="Visit Forums">Visit Forum</a></div>');
jQuery("#gmPopupContainer").css({top: jQuery("#eUSAForums-config").offset().top, left: jQuery("#eUSAForums-config").offset().left});
jQuery("#eUSAForums-config").click ( function () {
    jQuery("#gmPopupContainer").show();
});

jQuery(document).on("mouseleave mouseenter", "li.eUSAForums-list", function (e) {
    if (e.type === 'mouseenter') {
        jQuery(this).children('.eUSAForums-items').css('display', 'none');
        jQuery(this).children('.eUSAForums-desc').css('display', 'inline-block');
        jQuery(this).height(140);
        jQuery(this).children('.eUSAForums-desc').height(140);
    }
    else{
        jQuery(this).children('.eUSAForums-items').css('display', 'block');
        jQuery(this).children('.eUSAForums-desc').css('display', 'none');
        jQuery(this).height(70);
        jQuery(this).children('.eUSAForums-desc').height(70);
    }
});

function loginForums() {
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://eusaforums.com/forum/index.php?action=login2",
        data: "&action=login2&user="+GM_getValue("user")+"&passwrd="+GM_getValue("pass")+"&cookieneverexp=on&hash_passwrd=",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function() {
            waitForFeed(GM_getValue("board"), GM_getValue("posts"));
        }
    });
}

function loadBoardList() {
    var selectMenu = '<select id="eUSAForums-board"><option value="">All Boards</option>';
    var selectConfigMenu = '<select id="removeboard-name"><option value="">Select Board</option>';
	if( GM_getValue("boardsList", "") != ""){
		var oldBoards = JSON.parse(GM_getValue("boardsList"));
        for (i = 0; i < oldBoards.length; i+=2) {
            selectMenu += '<option value="'+oldBoards[i+1]+'">'+oldBoards[i]+'</option>';
            selectConfigMenu += '<option value="'+oldBoards[i+1]+'">'+oldBoards[i]+'</option>';
        }
    }
    selectMenu += '</select>';
    selectConfigMenu += '</select>';
    jQuery("#eUSAForums-select").empty();
    jQuery("#eUSAForums-select").append(selectMenu);
    jQuery("#removeboard-div").empty();
    jQuery("#removeboard-div").append(selectConfigMenu);
}

function waitForFeed(b,p) {
    b = typeof b !== 'undefined' ? b : GM_getValue("board", "");
    p = typeof p !== 'undefined' ? p : GM_getValue("posts", "");
    jQuery("#eUSAForums-container").find("ul").empty();
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://eusaforums.com/forum/index.php?action=.xml;sa=recent;board="+b+";limit="+p+";type=atom",
        onload: function(response) {
            var data = jQuery.parseXML(response.responseText);
    
            jQuery(data).find("feed").each(function () {
                var el = jQuery(this);        
                var title = el.find("title:first").text();
                jQuery(".eUSAForums-title").html(title);
            });
            jQuery(data).find("entry").each(function () {
                var el = jQuery(this);        
                var title = el.find("title").text();
                var link = el.find("id").text();
                var pubDate = el.find("published").text();
                var desc = el.find("summary").text();
                var author = el.find("author").find("name").text();
                var authorLink = el.find("author").find("uri").text();
                
                jQuery("#eUSAForums-container").find("ul").append('<li class="eUSAForums-list"><div class="eUSAForums-items"><div><a href="'+link+'" target="_blank" class="eUSAForums-link">'+title+'</a><br /><a href="'+authorLink+'" target="_blank">'+author+'</a><br /><br /><small>'+pubDate+'</small></div></div><br /><br /><div class="eUSAForums-desc"><a href="'+link+'" target="_blank" class="eUSAForums-link">'+title+'</a><br /><a href="'+authorLink+'" target="_blank">'+author+'</a><br /><br />'+desc+'<br /><br /><a href="'+link+'" target="_blank" class="eUSAForums-link">Continue Reading...</a></div></li>');
            });
        }
    });
}

loadBoardList();

//CSS
GM_addStyle ( "                                                 			\
    #gmPopupContainer {                                         			\
        position:               absolute;                       			\
		width:					278px;										\
        padding:                2em;                            			\
        background:             #C1E4F1;                     				\
        border:                 3px double black;               			\
        border-radius:          1ex;                            			\
        z-index:                999;										\
		display:				none;										\
    }                                                           			\
    #gmPopupContainer button{                                   			\
        cursor:                 pointer;                        			\
        margin:                 1em 1em 0;                      			\
        border:                 1px outset buttonface;          			\
    }                                                           			\
	#gmCloseDlgBtn {         		                            			\
		cursor:                 pointer;                        			\
		position:				absolute;									\
		top:					0px;										\
		right:					0px;										\
    }                                                           			\
	#eUSAForums-config {													\
		background-color:		#C1E4F1;									\
		text-align:				center;										\
		cursor:                 pointer;                        			\
	}																		\
	#eUSAForums-select {													\
		background-color:		#C1E4F1;									\
		text-align:				center;										\
	}																		\
	#eUSAForums-select select {												\
        background: #C1E4F1;												\
        border:none;														\
        outline:none;														\
        cursor:pointer;														\
    }																		\
    .eUSAForums-items a { 													\
        float: left; 														\
        color: #333; 														\
        line-height: 15px; 													\
        clear: both; 														\
        font-size: 14px; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
    .eUSAForums li { 														\
        width: 318px; 														\
        height: 70px;														\
        top: 0; 															\
        left: 0; 															\
        padding: 7px; 														\
        float: left; 														\
        clear: both; 														\
        border-bottom: 1px solid #efeded; 									\
        position: relative; 												\
    } 																		\
    .eUSAForums ul { 														\
        list-style-type: none; 												\
    } 																		\
    .visit_eUSAForums { 													\
        float: left; 														\
        width: 100px; 														\
        height: 20px; 														\
        -moz-border-radius-topleft: 5px; 									\
        -moz-border-radius-topright: 5px; 									\
        border-radius: 5px 5px 0 0; 										\
        background-color: #e0ddd0; 											\
        background-image: -webkit-linear-gradient(#f2f0ec 0,#e0ddd0 100%); 	\
        background-image: linear-gradient(#f2f0ec 0,#e0ddd0 100%); 			\
        box-shadow: #d6d1c5 0 1px 2px inset; 								\
        position: absolute; 												\
        bottom: 3px; 														\
        font-size: 11px; 													\
        text-shadow: #fff 0 1px 0; 											\
        color: #726c5f; 													\
        left: 116px; 														\
        text-align: center; 												\
        line-height: 22px; 													\
    } 																		\
    .eUSAForums-desc { 														\
		background-color: #E7EAEF;											\
        display: none; 														\
        z-index: 10; 														\
        width: 318px; 														\
        height: 70px; 														\
        position: absolute; 												\
        top: 0; 															\
        left: 0; 															\
        padding: 7px; 														\
        overflow-y: auto; 													\
        overflow-x: auto; 													\
        color: #333; 														\
        line-height: 15px; 													\
        clear: both; 														\
        font-size: 14px; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
    .eUSAForums-desc a { 													\
        color: #346; 														\
		text-decoration: underline;											\
        line-height: 15px; 													\
        clear: both; 														\
        font-size: 14px; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
	.eUSAForums-desc .bbc_standard_quote { 									\
        background-color: #D7DAEC; 											\
		border-bottom-style: solid;											\
        border-bottom-color:          #9999AA;                            	\
		padding: 3px; 														\
        font-size: small; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
	.eUSAForums-desc .bbc_alternate_quote { 								\
        background-color: #E7EAFC; 											\
		border-bottom-style: solid;											\
        border-bottom-color:          #9999AA;                            	\
		border-top-style: solid;											\
        border-top-color:          #9999AA;                            		\
		padding: 3px; 														\
        font-size: small; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
	.eUSAForums-desc .topslice_quote { 										\
        background-color: #D7DAEC; 											\
		border-top-style: solid;											\
		border-top-color:          #9999AA;                            		\
		padding: 3px; 														\
        font-size: small; 													\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
	.eUSAForums-desc .topslice_quote a { 									\
        font-size: x-small; 												\
        font-family: Cambria,Georgia,serif; 								\
    } 																		\
	.eUSAForums-desc .bbc_img { 											\
        max-width: 300px; 													\
        max-height: 400px; 													\
    }																		\
	.youtube iframe { 														\
        width: 275px; 														\
        height: 140px; 														\
    }																		\
" );
window.addEventListener('load', waitForFeed(), false);