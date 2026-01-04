// ==UserScript==
// @name Mole Hole css
// @namespace https://greasyfork.org/users/323892
// @version 0.0.1.20250409183900
// @description Mole Hole
// @author David1327
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/423026/Mole%20Hole%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/423026/Mole%20Hole%20css.meta.js
// ==/UserScript==

(function() {
let css = `#notification_area .notification.mass_notification .icon {background-position:-295px -68px;}

#twn_bb_lnk {
    background: url("https://grepolis-david1327.e-monsite.com/medias/images/but.png") no-repeat scroll -155px 0px transparent;
    display: block;
    float: right;
    height: 23px;
    margin: -2px 0 0 5px;
    width: 22px;
}
#twn_bb_id {
    display: none;
    margin-top: -2px;
    width: 130px;
}
.inp70 {
    background: url('https://grepolis-david1327.e-monsite.com/medias/images/input70.png') no-repeat scroll 0% 0% transparent;
    border: 0px none;
    height: 17px;
    width: 70px;
    text-align: center;
    padding: 3px;
}
.inp200 {
    background: url('https://grepolis-david1327.e-monsite.com/medias/images/input200.png') no-repeat scroll 0% 0% transparent;
    border: 0px none;
    height: 17px;
    width: 200px;
    text-align: center;
    padding: 3px;
}
.inp500 {
    background: url('https://grepolis-david1327.e-monsite.com/medias/images/input500.gif') no-repeat scroll 0% 0% transparent;
    border: 0px none;
    height: 17px;
    width: 500px;
    text-align: center;
    padding: 3px;
}

.mhWondIco {
    height:20px;
    width: 20px;
    display: block;
    float: left;
}

.mhWondIco.great_pyramid_of_giza	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwgreat-pyramid-of-giza.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.colossus_of_rhodes		{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwcolossus-of-rhodes.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.hanging_gardens_of_babylon	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwhanging-gardens-of-babylon.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.lighthouse_of_alexandria	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwlighthouse-of-alexandria.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.mausoleum_of_halicarnassus	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwmausoleum-of-halicarnassus.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.statue_of_zeus_at_olympia	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwstatue-of-zeus-at-olympia.png") no-repeat scroll 0 0 transparent;}
.mhWondIco.temple_of_artemis_at_ephesus	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/iwtemple-of-artemis-at-ephesus.png") no-repeat scroll 0 0 transparent;}

.mhTwnIco {
    height:20px;
    width: 20px;
    display: block;
    float: left;
    background: url("https://grepolis-david1327.e-monsite.com/medias/images/twnlistico.png") transparent;
}

.mhTwnIco.phoenician	{background-position:-0px 0px;}
.mhTwnIco.domination	{background-position:-20px 0px;}
.mhTwnIco.colonize	{background-position:-40px 0px;}
.mhTwnIco.nohero	{background-position:-60px 0px;}

.town_cast_spell_oldcontent .favor {
	background: url("https://grepolis-david1327.e-monsite.com/medias/images/bg-favor.png") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
	height:55px;
	width:112px;
	display:block;
}

.AllySymIco,
.PlaySymIco{
    width: 20px;
    height:20px;
    display: block;
    float: left;
    margin:-3px 3px 0 0;
}

a.submenu_link .left.mh,
a.submenu_link .right.mh,
a.submenu_link .middle.mh	{background: url("https://grepolis-david1327.e-monsite.com/medias/images/subtab.gif") no-repeat scroll 0 0 transparent;}

a.submenu_link .left.mh		{background-position:left 0px;}
a.submenu_link .right.mh	{background-position:right 0px;}
a.submenu_link .middle.mh	{background-position:center -22px; background-repeat:repeat;}
a.submenu_link.active .left.mh	{background-position:left -44px;}
a.submenu_link.active .right.mh	{background-position:right -44px;}
a.submenu_link.active .middle.mh{background-position:center -66px; color:#430;}

.colA0A0FF	{background:#A0A0FF;}

.gmGrdAX{border-color:#000000; border-width:2px; border-top-style:solid;   position:absolute; height:2px; z-index:4;}
.gmGrdAY{border-color:#000000; border-width:2px; border-left-style:solid;  position:absolute; width:2px;  z-index:4;}
.gmGrdBX{border-color:#FFFFFF; border-width:1px; border-top-style:dashed;  position:absolute; height:1px; z-index:3}
.gmGrdBY{border-color:#FFFFFF; border-width:1px; border-left-style:dashed; position:absolute; width:1px;  z-index:3}
.gmGrdCX{border-color:#8080FF; border-width:1px; border-top-style:dotted;  position:absolute; height:1px; z-index:2}
.gmGrdCY{border-color:#8080FF; border-width:1px; border-left-style:dotted; position:absolute; width:1px;  z-index:2}

/* notifications */
#mh_NotiBox div.notification {
	background-color: rgba(0,0,0,.7);
	border: 1px solid #ebdab9;
	border-radius: 6px;
	margin: 1px;
	width: 39px;
	height: 39px;
}

#mh_NotiBox div.icon {
	width: 41px;
	height: 41px;
	background: url(https://grepolis-david1327.e-monsite.com/medias/images/alpha-sprite-2.69.png) -48px -68px;
}

#mh_NotiBox div.notification.incoming_attack div.icon {
	background-position: -335px -68px;
}

#mh_NotiBox div.notification.newreport div.icon {
	background-position: -48px -68px;
}

#mh_NotiBox div.description {
	background-color: rgba(0,0,0,.7);
	border: 1px solid #ebdab9;
	border-radius: 6px;
	width: 418px;
	min-height: 30px;
	padding: 5px;
	text-align: left;
	color: #edb;
	font-size: 10px;
	left: 40px;
	top: -42px;
	position:relative;
	overflow: hidden;
}

#mh_NotiBox a.notify_subjectlink:hover {
	text-decoration: underline;
}

#mh_NotiBox a.notify_subjectlink {
	text-align: left;
	color: #edb;
	font-size: 10px;
	line-height: 10px;
}

#mh_NotiBox .notification_date {
	position: absolute;
	bottom: 1px;
	right: 5px;
}

/* procentowa zawartosc ludnosci */
#town_groups_list .pop_percent { position: absolute; right: 7px; top:0px; font-size: 0.7em; display:block !important;}
#town_groups_list .full { color: green; }
#town_groups_list .threequarter { color: darkgoldenrod; }
#town_groups_list .half { color: darkred; }
#town_groups_list .quarter { color: red; }

/* lista miast */
#townsoverview.mh_Townlist div {
/*	border-left: 1px solid;*/
	padding: 0;
	margin: 0;
}

#mhTownList_inner td {
	text-align: right;
	border-left: 1px solid;
	padding: 0;
	margin: 0;
}

#mhTownList_inner .mhTwnIco {
	display: inline-block;
	vertical-align: middle;
	float: none;
}

/* lista wiosek */
#townsoverview.mh_FarmList div {
/*	border-left: 1px solid;*/
	text-align: center;
	padding: 0;
	margin: 0;
}

#mhFarmList_inner td {
	text-align: right;
	border-left: 1px solid;
	padding: 0;
	margin: 0;
}

/*#mhFarmList_inner .mhFrmIco {
	display: inline-block;
	vertical-align: middle;
	float: none;
}*/

#mhFarmList_inner td.mh_sel {
	style="cursor:pointer;
}

/* lista misji */
#townsoverview.mh_MissList div {
/*	border-left: 1px solid;*/
	text-align: center;
	padding: 0;
	margin: 0;
}

#mhMissList_inner td {
	text-align: right;
	border-left: 1px solid;
	padding: 0;
	margin: 0;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
