// ==UserScript==
// @name         CB Favorite Smileys
// @namespace    http://ibrodtv.met/gm/
// @version      1.0
// @description  Access your favorite most used smileys faster, don’t need to memorize the code.
// @author       Sliightz
// @match    https://*.chaturbate.com/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.9/jquery-ui.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382676/CB%20Favorite%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/382676/CB%20Favorite%20Smileys.meta.js
// ==/UserScript==

$("head").append (
    '<link '
    + 'href="//ajax.aspnetcdn.com/ajax/jquery.ui/1.8.9/themes/blitzer/jquery-ui.css" '
    + 'rel="stylesheet" type="text/css">'
);
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.box {\
	display: block;\
	width: 80px;\
	height: 120px;\
	margin: 10px;\
}\
#selectField {\
	border: 1px solid #ddd;\
	width: 200px;\
}\
.smallimg {\
	display: block;\
  	max-width:200px;\
  	max-height:90px;\
  	width: auto;\
  	height: auto;\
}');
if ( $( "#xmovie" ).length ) {
    var newli2 = document.createElement('li');
    newli2.innerHTML="<div class='button_share'><a href=# id=btnShow>SMILEY</a></div>";
    newli2.addEventListener('click',function(){copyToClipboard();}, false);
    document.getElementsByClassName("socials")[0].appendChild(newli2);
}


$("body").append ( '<div id="dialog" style="display: none;"> \
<div style="margin-right: 5px; float: left; width: 200px;"> \
<select size="10" style="width: 100%;" id="selectField">\
</select>\
</div>\
<div id="img"></div>\
</div> \
</div>' );
var thecode = ["----MOD----",":starttip",":_mh",":tipguys",":omb100",":tipguyz",":moretipsmorefun",":bluestipdirect007",":moretipsmorefun",":bestshow-ever",":makeherhappy",":moremoremoretips",":comeonguysss90",":comeonguysss",":tipmoreshow",":nd",":motivation",":tipperswelcome",":ohmitip01 ",":tipmore",":buytokens",":moretipssss",":moretipsgreatshow ",":tipfollow1",":tipsee",":tipifyoulikeherboobs",":tipsshow",":mtmf",":nodemands2",":mistertip",":rolocamiminios",":motheralert",":followmeguys",":qss","----THANKS----",":tx2",":clapping",":thxxxx",":thankstoalltippers","----USER----",":despierta",":cena",":snicker",":haha",":lmaoo",":wooooooows",":blush",":fruity2",":minlove",":pandafit",":gig",":hat",":asstoface",":scared2",":deadd",":dontsleep",":breathe2",":bow",":clappinghobbits",":haha10",":icebucket",":lostt",":OMGOMGOMGOMG781488",":wtff",":movebear12",":drool",":omg333",":CleanUp",":slapass3",":kissass",":mhorny",":msmoke",":haah",":machinegunpussy",":faintchr",":shesexy52",":ironmanbomb ",":wwfp",":LOOOO",":iwatchu2",":OhMyGod",":elephant3",":lasdrogassonmalas",":vamoadesnudarno",":aydiomio",":glassesloop",":st3lmaoo",":curiousdog ",":st3cjsfaint",":calmchr",":froghang",":sniperkitty",":jerryhorny",":bartspy",":plss",":cachetes",];
var img = ["http://www.ibrodtv.net/gm/blank.png","https://public.chaturbate.com/uploads/avatar/2013/04/23/lJP5eX81ylM05lSY.jpg","https://public.chaturbate.com/uploads/avatar/2012/05/06/P4huUjLnDbcDUH.jpg","https://public.chaturbate.com/uploads/avatar/2012/10/10/zpncjY8nH1kL.jpg","https://public.chaturbate.com/uploads/avatar/2016/01/29/09/37/ebc961e595701c9768bdbce22f9f42861293f9e7.jpg","https://public.chaturbate.com/uploads/avatar/2013/04/19/N2pd5GeP1ru8.jpg","https://public.chaturbate.com/uploads/avatar/2014/03/26/8DH6EA7UAWpKuMpbH.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/28/BcI9umsJFt4CHMyZM.jpg","https://public.chaturbate.com/uploads/avatar/2015/04/26/18/16/b85f89d66b4965ff5231e14ca6acd73705e2df0d.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/19/X9DTqCKP4t9enSZsK.jpg","https://public.chaturbate.com/uploads/avatar/2013/04/25/PljOsGmvkjfw.jpg","https://public.chaturbate.com/uploads/avatar/2015/10/30/12/08/4838caf289e5ab1699c3225612c84b1b9b519f0f.jpg","https://public.chaturbate.com/uploads/avatar/2015/10/17/23/37/62c8696ed0193b35365282ac7d9e5ebf4a1e1ab5.jpg","https://public.chaturbate.com/uploads/avatar/2014/05/26/NlQf0NFDiDKSI3yp.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/25/umyozVLJLyPUoITE.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/26/wF4XBDRxMYzB9eV.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/27/mdypvZ68U0WElfdj.jpg","https://public.chaturbate.com/uploads/avatar/2015/02/13/11/42/3b3f92eecb7aa554142dc97d56720749cc3c8531.jpg","https://public.chaturbate.com/uploads/avatar/2015/10/13/08/47/10643fcf7cc05a1a805365a046ac015916dba49a.jpg","https://public.chaturbate.com/uploads/avatar/2012/10/25/o8CwjiyRcGaRO.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/40zDltP1pRAA.jpg","https://public.chaturbate.com/uploads/avatar/2012/11/09/8qobABqoBPj8250x80.jpg","https://public.chaturbate.com/uploads/avatar/2014/02/28/5YjRYIhwuoMGNlpLBm.jpg","https://public.chaturbate.com/uploads/avatar/2013/08/03/aq0VMmtKKhch4ClB.jpg","https://public.chaturbate.com/uploads/avatar/2013/08/26/LygfsI4OyN77AqcevX.jpg","https://public.chaturbate.com/uploads/avatar/2015/01/13/09/14/d0f6b20b4f28de35d8552361afa19fce35991efb.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/13/ya7Rwj4DBOpU0xE.jpg","https://public.chaturbate.com/uploads/avatar/2013/09/03/kXSmVO7MLROI0K9wx.jpg","https://public.chaturbate.com/uploads/avatar/2013/12/12/muFkKDeAS95QHHAt.jpg","https://public.chaturbate.com/uploads/avatar/2014/05/09/ZmJNMhL5veE4WdY.jpg","https://public.chaturbate.com/uploads/avatar/2016/02/13/17/15/9973d78d0327541cd3762153dca562c67521f781.jpg","https://public.chaturbate.com/uploads/avatar/2013/10/27/eInY6jcEIfJJpdRSkB.jpg","https://public.chaturbate.com/uploads/avatar/2014/03/31/7UGfZxxrWLkEG5TBC.jpg","https://public.chaturbate.com/uploads/avatar/2013/10/12/mkBviReHRzFWAykS.jpg","http://www.ibrodtv.net/gm/blank.png","https://public.chaturbate.com/uploads/avatar/2014/02/20/DMFEjmjfDQR1T.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/RnwxSzKYAo4QV47Y.jpg","https://public.chaturbate.com/uploads/avatar/2014/06/21/M1k4THlQM7XrSNc.jpg","https://public.chaturbate.com/uploads/avatar/2014/07/31/4ZWdkWisiglVq.jpg","http://www.ibrodtv.net/gm/blank.png","https://public.chaturbate.com/uploads/avatar/2014/05/24/dVu4iTuyCUdzqCgW.jpg","https://public.chaturbate.com/uploads/avatar/2013/02/15/Xur5KzLzQ5xVumeV.jpg","https://public.chaturbate.com/uploads/avatar/2013/03/01/8gVpOHh5xBph6.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/G2GwxpKghuBj3eK.jpg","https://public.chaturbate.com/uploads/avatar/2012/04/19/DA1ygTWTX0FC.jpg","https://public.chaturbate.com/uploads/avatar/2014/10/31/14/55/f203a96834197823b10089a4bbd1882d37fb5fde.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/cxecSeKtWjRK.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/vTgBE7IwPjY0j.jpg","https://public.chaturbate.com/uploads/avatar/2012/05/03/4hCTPmFDs7YMEC6.jpg","https://public.chaturbate.com/uploads/avatar/2014/04/02/IsnXrjQhLTcjtq6vav.jpg","https://public.chaturbate.com/uploads/avatar/2012/04/21/gDv0fhq13fo5lQhCR.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/BEFPfw0F2LPRry.jpg","https://public.chaturbate.com/uploads/avatar/2014/04/12/MN27HF9gKBtnxMUqTM.jpg","https://public.chaturbate.com/uploads/avatar/2013/02/06/E0AlAsyO3xmXs1zC.jpg","https://public.chaturbate.com/uploads/avatar/2014/01/16/fRGkTlxTDODuzjSnR.jpg","https://public.chaturbate.com/uploads/avatar/2014/04/10/mIDWQsCQlETcP.jpg","https://public.chaturbate.com/uploads/avatar/2015/08/24/17/24/88e27cf16172494ed8c6a47af2b01cabfe3c304d.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/Yo40tPhkYkKieE.jpg","https://public.chaturbate.com/uploads/avatar/2014/02/28/mmsmOHoVrA0pAFfsWK.jpg","https://public.chaturbate.com/uploads/avatar/2012/05/27/P0cp3MnQDh6AOATF.jpg","https://public.chaturbate.com/uploads/avatar/2014/08/20/ydIRxf7JVSvYQm9Wa7.jpg","https://public.chaturbate.com/uploads/avatar/2015/03/22/10/01/892aa3d50f23b11712f8f59b4ae0da362a8cdcf5.jpg","https://public.chaturbate.com/uploads/avatar/2015/11/07/11/11/e141cdcc3c81177b9590fea7bffe70571353b030.jpg","https://public.chaturbate.com/uploads/avatar/2012/10/28/JKjuKSc9gv80GyWKFE.jpg","https://public.chaturbate.com/uploads/avatar/2015/11/05/14/16/d9eda26184d0690f9c831924b3cab59260c1b624.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/ucbHXRTah3U3YXJvzo.jpg","https://public.chaturbate.com/uploads/avatar/2013/08/20/E92DFmxq0KUsU.jpg","https://public.chaturbate.com/uploads/avatar/2013/08/12/ocmKvfbTwx0U43V.jpg","https://public.chaturbate.com/uploads/avatar/2015/09/14/11/55/9a1bbafcec4547e224461fc23f1b3d3b1dc762e5.jpg","https://public.chaturbate.com/uploads/avatar/2011/11/08/NTzF8AHfjkQHP.jpg","https://public.chaturbate.com/uploads/avatar/2012/05/24/cMINQubh5622rsxDm.jpg","https://public.chaturbate.com/uploads/avatar/2012/05/24/4k3zhbIzIeWzN3.jpg","https://public.chaturbate.com/uploads/avatar/2012/04/18/veGsdYAC0qcwf.jpg",
"https://public.chaturbate.com/uploads/avatar/2014/08/29/wBq3JfAdEUCquP4i1.jpg",
"https://public.chaturbate.com/uploads/avatar/2014/04/10/HDtOCZpnjEeAf.jpg","https://public.chaturbate.com/uploads/avatar/2014/05/10/QFCJxgQxZW6Pvc.jpg","https://public.chaturbate.com/uploads/avatar/2015/05/05/20/02/e1bab995da3110886865706ffb152c6041ad1f18.jpg","https://public.chaturbate.com/uploads/avatar/2013/08/19/DjKKAEQ944rDWw9.jpg","https://public.chaturbate.com/uploads/avatar/2016/05/21/20/50/99e25c0c7775f761eea6567298523aec3414d5d6.jpg","https://public.chaturbate.com/uploads/avatar/2013/07/22/7ENKzEQk9xgwvsjdf.jpg","https://public.chaturbate.com/uploads/avatar/2014/02/20/5Jh9Ieoz7C7oMuc.jpg","https://public.chaturbate.com/uploads/avatar/2013/02/10/fiRvke8f6IrGJMVNN.jpg","https://public.chaturbate.com/uploads/avatar/2016/08/11/16/13/19f1563d4d7582f2a397ec37838bd8c3a594813e_250x80.jpg","https://public.chaturbate.com/uploads/avatar/2016/03/20/08/00/6b542e04cc27cceeeea9341c0e63e73495b41fbb.jpg","https://public.chaturbate.com/uploads/avatar/2015/10/20/16/11/cc1a5cf924ad0649af4519e4dd51734409f454a8_250x80.jpg","https://public.chaturbate.com/uploads/avatar/2015/08/19/22/29/9e4a3bbf3b7fde584bba418ba620fdf0cbe0638d.jpg","https://public.chaturbate.com/uploads/avatar/2013/11/24/4UHP3ePXjN5wiC.jpg","https://public.chaturbate.com/uploads/avatar/2016/01/15/13/32/e978c08f4f6b798160040521d600c9a2bedab7fc.jpg","https://public.chaturbate.com/uploads/avatar/2013/12/29/5KMlYzrpFgsEr9G0.jpg","https://public.chaturbate.com/uploads/avatar/2014/04/10/1anl423BKcJHTm04.jpg","https://public.chaturbate.com/uploads/avatar/2015/02/17/21/42/2279c78cf6550e98295096c71695ba6cd936019f.jpg","https://public.chaturbate.com/uploads/avatar/2014/07/01/V6o6TLSG5pTpNj_250x80.jpg","https://public.chaturbate.com/uploads/avatar/2013/07/31/HKlCL2XT5EX48BArbF.jpg","https://public.chaturbate.com/uploads/avatar/2014/08/18/V0QfT2EbjXVD1Cbi1_250x80.jpg","https://public.chaturbate.com/uploads/avatar/2013/02/23/YAvPM0tHEPUuYtmWg.jpg","https://public.chaturbate.com/uploads/avatar/2014/03/11/Acru0ihMqq91gQ.jpg"];
var theimg = "";
var selbox = "";
var i;
for (i = 0; i < thecode.length; i++) {
	selbox += "<option value="+"option" + i + ">" + thecode[i] + "</option>";
    theimg += "<div id="+"option" + i + " class=\"box\"><img class=\"smallimg\" src=" + img[i] + " /><input type=\"text\" onclick=\"this.focus();this.select()\" value=" + thecode[i] + " style=\"width: 180px\"></div>";
}
document.getElementById("img").innerHTML = theimg;
document.getElementById("selectField").innerHTML = selbox;
$(function () {
    $("#dialog").dialog({
        modal: true,
        autoOpen: false,
        title: "CB Smiley",
        width: 250,
        height: 320,
        resizable: false,
        position: [200,200], // change position. 1st box is distance from left, second is distance from the top.
        create: function (event) { $(event.target).parent().css('position', 'fixed');},
    });
    $("#btnShow").click(function () {
        $('#dialog').dialog('open');
    });
});
$(document).ready(function () {
    $('.box').hide();
    $('#option1').show();
    $('#selectField').change(function () {
        $('.box').hide();
        $('#'+$(this).val()).show();
    });
});