// ==UserScript==
// @name         FA Additional BBCode Helper
// @namespace    FurAffinity
// @version      0.2
// @description  Adds clickable functionality to common BBCode inputs
// @author       JaysonHusky
// @match        https://www.furaffinity.net/controls/journal/*
// @match        https://www.furaffinity.net/controls/profile/
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/29808/FA%20Additional%20BBCode%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/29808/FA%20Additional%20BBCode%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var TemplateStyle=$('body').attr('data-static-path');
     // Add Special Stylesheet for keywords
	var JaysBBCodeCSS=document.createElement('style');
	var jayBBCodeStyle=document.createTextNode(`
	#abhjh{
		border-radius:3px;
		background:rgba(1,0,0,0.1);
		margin-right:5px;
		padding:3px;
	}
	a#whatsthis{
		float:right;
		clear:right;
		font-size:10px;
	}
	.helpcur{
		cursor:help;
	}
	table#additionalbbcodes{
		width:900px;
	}
	a.additionalbbcodeclicker{
		cursor:pointer;
		margin-right; 10px;
	}
	table#additionalbbcodes tr{
		border-bottom: 1px dotted grey;
	}
	table#additionalbbcodes td.clickable{
		background: transparent;
		transition: 1s all;
		text-align:center;
	}
	table#additionalbbcodes td.clickable:hover{
		background: grey;
		transition: 1s all;
	}
	#abhjhbox{
		font-size:11px;
		display:block;
		margin:10px;
	}
	`);
	JaysBBCodeCSS.appendChild(jayBBCodeStyle);
	document.getElementsByTagName('body')[0].appendChild(JaysBBCodeCSS);
	var pathx=window.location.pathname;
		if(~pathx.indexOf("/controls/profile/")){
            $('.p10b h4').after(`
		<div id="abhjh">
			<h3>&nbsp;&nbsp;Additional BBCode Helper</h3>
			<br/>
			<table id="additionalbbcodes">
				<tr>
					<td><b>Styling</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[b]','[/b]');">Bold</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[i]','[/i]');">Italic</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[u]','[/u]');">Underline</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[left]','[/left]');">Left Align</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[center]','[/center]');">Center Align</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[right]','[/right]');">Right Align</a></td>
				</tr>
				<tr>
					<td><b>Links</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[url]','[/url]');">URL (Simple Link)</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[url=INSERT_URL_TO_LINK_HERE]','[/url]');">URL (Custom Link)</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':icon',':');">Username &amp; Icon</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':link',':');">Username Only</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':','icon:');">Icon Only</a></td>
				</tr>
				<tr>
					<td><b>Formatting</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[color=white]','[/color]');">Color</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[quote]','[/quote]');">Quote</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[s]','[/s]');">Strikethrough</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[sup]','[/sup]');">Superscript</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[sub]','[/sub]');">Subscript</a></td>
				</tr>
			</table>
			<span id="abhjhbox">Additional BBCode Helper is a add-on to add clickable functionality to the most commonly used BBCode on FurAffinity.<br/><b>You must highlight the text you want to "wrap" in the tags before clicking the tag you want.</b><br/>The color option will default to white, you can replace it with ANY valid color.</span>
		</div>
		<br/>
	`);
        }
    else{
        $('form .floatleft').append(`
		<br/><br/>
		<div id="abhjh">
			<h3>&nbsp;&nbsp;Additional BBCode Helper</h3>
			<br/>
			<table id="additionalbbcodes">
				<tr>
					<td><b>Links</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[url]','[/url]');">URL (Simple Link)</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[url=INSERT_URL_TO_LINK_HERE]','[/url]');">URL (Custom Link)</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':icon',':');">Username &amp; Icon</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':link',':');">Username Only</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,':','icon:');">Icon Only</a></td>
				</tr>
				<tr>
					<td><b>Formatting</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[color=white]','[/color]');">Color</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[quote]','[/quote]');">Quote</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[s]','[/s]');">Strikethrough</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[sup]','[/sup]');">Superscript</a></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[sub]','[/sub]');">Subscript</a></td>
				</tr>
				<tr>
					<td><b>Media</b></td>
					<td width="10px"></td>
					<td class="clickable"><a class="additionalbbcodeclicker" onclick="performInsert(this,'[yt]','[/yt]');">YouTube</a></td>
				</tr>
			</table>
			<span id="abhjhbox">Additional BBCode Helper is a add-on to add clickable functionality to the most commonly used BBCode on FurAffinity.<br/><b>You must highlight the text you want to "wrap" in the tags before clicking the tag you want.</b><br/>The color option will default to white, you can replace it with ANY valid color.</span>
		</div>
		<br/>
	`);
    }
})();