// ==UserScript==
// @name         Neoboard Quick User Links
// @version      2.0.1
// @description  Adds some icons on message form that make it easier to get your links
// @author       Nyu (clraik)
// @match        *://*.neopets.com/neoboards/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/98713
// @downloadURL https://update.greasyfork.org/scripts/420213/Neoboard%20Quick%20User%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/420213/Neoboard%20Quick%20User%20Links.meta.js
// ==/UserScript==





var user = $('[class="nav-profile-dropdown-text"]>a')[0] ? $('[class="nav-profile-dropdown-text"]>a')[0].innerText : $('[class="user medText"]>a')[0].innerText;
var savedUser=GM_getValue("savedUser", user);
//username will be added to neomail, trading post, auctions and gallery links.
var savedNC=GM_getValue("savedNC", "");//"";
// http://impress.openneo.net/user/EXAMPLE_USER/closet
// or http://items.jellyneo.net/mywishes/EXAMPLE_USER/
var savedPP=GM_getValue("savedPP", "http://www.neopets.com/~") || "http://www.neopets.com/~";


var z=0;
var neomailLink="http://www.neopets.com/neomessages.phtml?type=send&recipient="+savedUser;
var tpLink="http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string="+savedUser;
var aucLink="http://www.neopets.com/genie.phtml?type=find_user&auction_username="+savedUser;
var galleryLink="http://www.neopets.com/gallery/index.phtml?gu="+savedUser;
//if(document.URL.indexOf("http://www.neopets.com/neoboards/create_topic.phtml?") != -1) {
var htex = $('[class="replySmilies-neoboards"]')[0] || $('[class="topicCreateSmilies-neoboards"]')[0];
//var htex=document.getElementsByTagName("form")[1].getElementsByTagName("table")[1].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("td")[0];

var a = document.createElement ('a');
var b = document.createElement('a');
var c = document.createElement('a');
var d = document.createElement ('a');
var e = document.createElement ('a');
var f = document.createElement ('a');
var au = document.createElement ('a');
var settings = document.createElement ('a');

a.setAttribute('href', 'javascript:;');
a.setAttribute('onclick', 'insertSmiley("'+neomailLink+'")');
a.setAttribute('return', 'false:;');
a.innerHTML = '<img src="http://images.neopets.com/neocircles/envelope.gif" width="21" height="21" alt="Paragraph" border="0" title="Add neomail link"></a>';
htex.appendChild(a);
z++;
if (savedNC!==""){
    b.setAttribute('href', 'javascript:;');
    b.setAttribute('onclick', 'insertSmiley("'+savedNC+'")');
    b.setAttribute('return', 'false:;');
    b.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/posting.png" width="21" height="21" alt="Paragraph" border="0" title="Add NC TL link"></a>';
    htex.appendChild(b);
    z++;
}


if (savedPP!==""&&savedPP!=="http://www.neopets.com/~"){
    c.setAttribute('href', 'javascript:;');
    c.setAttribute('onclick', 'insertSmiley("'+savedPP+'")');
    c.setAttribute('return', 'false:;');


    c.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/star.png" width="21" height="21" alt="Paragraph" border="0" title="Add petpage link"></a>';
    if (z!==2){
        htex.appendChild(c);
        z++;
    }
    else{
        c.innerHTML="<br>"+c.innerHTML;
        htex.appendChild(c);
        z++;
    }
}
d.setAttribute('href', 'javascript:;');
d.setAttribute('onclick', 'insertSmiley("'+tpLink+'")');
d.setAttribute('return', 'false:;');
d.innerHTML = '<img src="http://images.neopets.com/games/arcade/nav_buttons/background.png" width="21" height="21" alt="Paragraph" border="0" title="Add trading post link"></a>';


if(z!==2){
    htex.appendChild(d);
    z++;
}else{
    d.innerHTML="<br>"+d.innerHTML;
    htex.appendChild(d);
    z++;
}
e.setAttribute('href', 'javascript:;');
e.setAttribute('onclick', 'insertSmiley("'+aucLink+'")');
e.setAttribute('return', 'false:;');


e.innerHTML = '<img src="http://images.neopets.com/games/arcade/cat/world_brv.png" width="21" height="21" alt="Paragraph" border="0" title="Add auction link"></a>';


if(z!==2){
    htex.appendChild(e);
    z++;
}else{
    e.innerHTML="<br>"+e.innerHTML;
    htex.appendChild(e);
    z++;
}
f.setAttribute('href', 'javascript:;');
f.setAttribute('onclick', 'insertSmiley("'+galleryLink+'")');
f.setAttribute('return', 'false:;');


f.innerHTML = '<img src="http://images.neopets.com/games/arcade/nav_buttons/site_item.png" width="21" height="21" alt="Paragraph" border="0" title="Add gallery link"></a>';


if(z!==2){
    htex.appendChild(f);
    z++;
}else{
    f.innerHTML="<br>"+f.innerHTML;
    htex.appendChild(f);
    z++;
}

au.setAttribute('href', 'javascript:;');
au.setAttribute('onclick', 'insertSmiley("Bidding on:\\n\\n\\nOffering:\\n\\n\\n@'+savedUser+'")');
au.setAttribute('return', 'false:;');
au.innerHTML = '<img src="http://images.neopets.com/games/arcade/nav_buttons/dictionary.png" width="21" height="21" alt="Paragraph" border="0" title="Bidding template"></a>';
if(z!==2){
    htex.appendChild(au);
    z++;
}else{
    au.innerHTML="<br>"+au.innerHTML;
    htex.appendChild(au);
    z++;
}

settings.setAttribute('href', 'javascript:;');
settings.setAttribute('id', 'NBsettings');
settings.setAttribute('return', 'false:;');
settings.innerHTML = '<br><div id="imgSetCont"><img src="http://images.neopets.com/games/pages/buttons/settings.png" id="imgSettings"alt="Paragraph" border="0" title="Change links"></div></a>';
htex.appendChild(settings);
// height= "42" width="21"
$('[id="NBsettings"]').on('click', function() {
    popSettings();
});

GM_addStyle ( ""+
             "#imgSetCont {"+
             "width:               21px;"+
             "height:              21px;"+
             "overflow:            hidden;"+
             " }"+
             "#imgSettings:hover{"+
             "margin-top:          -21px;"+
             "}"+
             "#imgSetCont img {"+
             "width: 21px;"+
             "height: 42px;"+
             "} .maxH{height:100%;}"
            );

var popSettings = function(){
    //alert('ajajjaja'),

    savedUser=GM_getValue("savedUser", savedUser);
    savedNC=GM_getValue("savedNC", "");
    savedPP=GM_getValue("savedPP", "http://www.neopets.com/~");

    var popupHTML = '<div id="neoboardPopup" class="nav-text__2020 nav-top__2020 maxH">'+
        '<button id="closeNeoboardConf" type="button"style="height:29px; width:29px; background: none; position: fixed; margin-top: -26px; margin-left: 160px; ">'+
        '<img src="http://images.neopets.com/games/aaa/dailydare/2010/popup/buttons/close-x_ov.png" style="margin-top:-100px;margin-left:-20px;"></button>'+
		'<form style="text-align:left;">'+
        '<table><tr><td>'+
        '<h3>Username:</h3></td><td><input type="text" id="f_user" value="' + savedUser + '" ></td></tr><tr><td>'+
        '<h3>NC Tradelist:</h3></td><td><input type="text" id="f_nc" value="' + savedNC + '" ></td></tr><tr><td>'+
        '<h3>Petpage:</h3></td><td><input type="text" id="f_pp" value="' + savedPP + '" ></td>'+
        '</tr><table>'+
        '<br><br><button id="saveNeoboardConf" type="button"style="height:29px; width:163px; background: url(http://images.neopets.com/trousers/play/prank_but.png)">'+
        '<img src="https://secure.nc.neopets.com/np/images/label/btn-save.png" style="margin-top:-10px;" height="43px" width="151px"></button>'+
    '</form></div>';
	$("body").append (popupHTML);

	$("#saveNeoboardConf").click ( function () {
		var u = f_user.value;
		var n = f_nc.value;
		var p = f_pp.value;

		GM_setValue("savedUser",u);
        GM_setValue("savedNC",n);
        GM_setValue("savedPP",p);
        $('[id="neoboardPopup"]').empty().remove();
        document.location.reload();
	} );

    $("#closeNeoboardConf").click ( function () {
		$('[id="neoboardPopup"]').empty().remove();
	} );



	GM_addStyle ( ""+
				 "#neoboardPopup {"+
				 "position:               fixed;"+
                 "height: 350px;"+
				 "top:                    30%;"+
				 "left:                   25%;"+
				 "padding:                10px;"+
				 "border:                 5px outset;"+
				 "border-radius:          10px;"+
				 "z-index:                100;"+
				 "}"+
				 "#neoboardPopup button{"+
				 "cursor:                 pointer;"+
				 "margin:                 10px 10px 0;"+
				 "border:                 none;"+
				 " }"+
				 "#saveNeoboardConf:hover{"+
				 "cursor:                 pointer;"+
				 "}" );

}

