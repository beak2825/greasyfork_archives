// ==UserScript==
// @name flickrAwardCounter FI
// @namespace http://www.phazeshift.co.uk/download/
// @description UserScript to count award images in Flickr photo comments
// @version 1.00
// @author phazeshift et al.
// @license MIT
// @include http*://*flickr.com/*photos/*/*
// @include http*://*flickr.com/groups/*/discuss*
// @include http*://*flickr.com/groups/*/pool*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_log
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/445703/flickrAwardCounter%20FI.user.js
// @updateURL https://update.greasyfork.org/scripts/445703/flickrAwardCounter%20FI.meta.js
// ==/UserScript==
     
    /*
     
    Installation
    ============
    First you need a UserScript manager extension for your browser. The state of the art seems to be Tampermonkey these days.
    Works with Firefox, Safari and Chrome. Even Edge I'm told. https://www.tampermonkey.net
    Then visit the script's new home page at Greasy Fork: https://greasyfork.org/en/scripts/441654-flickrawardcounter
    Click the green Install or Update button at the top left of the page. That's it.
    You can now visit or reload one of the Flickr pages the script is modifying: photo details, group pool, group discuss.
     
    Release Notes
    ============
    v1.0 Counts the comments on the current photo page using javascript
    v2.0 Counts the comments for a photo using the flickr API on Group, Pool and Photo pages
    v2.1 Updated to be more compatible with other scripts; no longer removes PoolList class from pool page. Fixed reloading of comments when clicking Show all.
    v2.2 Allows multiple images to be specified per award, (separated with ';') and allows dupes for certain people to be ignored (separated with ';')
    v2.3 Config dialog allows more awards to be added instead of being off the page.
    v2.4 Added Sort & Edit options to config. Added Auto update function.
    v2.5 Added option to display number favourites.
    v2.6 Fixed clear config option
    v2.7 Changed search code to find text that isn't in image tags
    v2.8 Added option to hide awards with count = 0
    v2.9 Fixed multiple URL config option & counting multiple awards in single comment
    Added option to save settings online and tidied config page
    Fixed version check code
    v2.10 Applied Alesas patch to work with the new flickr layout. Thanks to Alesa for the patch and Tambako for letting me know about the new layout.
    Added option to display number of galleries.
    v2.11 Fixed an issue that caused script version to be checked on every page load when running under some Greasemonkey emulators that don't support storing settings.
    Changed SaveCloudSettings to use a post request to prevent errors with long URLs
    Added option to export counter settings to a string
    Fixed compatibility issue with 'Flickr Group Pool Admin - Warn + Delete' script
    Updated Pool display technique to interfere less with other scripts
    v2.12 Added Aleas patch for update check exception handler
    Reverted change to pool handling as award counts were unreadable
    Fixed detection of image url for pool photos after recent flickr change
    v2.13 Fixed detection of image id for individual photos after recent flickr change
    v2.14 Fixed count display spacing on comment threads
    Fixed counter to work with new pool layout
    v2.15 Fixed show all on group discussion page
    v2.16 Fixed Flickr Urls to support https. Thanks to Dave_O1
    Added support for justified pool layout
    Added greasemonkey @grant metadata
    v2.17 Fixed SSL support
    Fixed single photo view
    v2.18 Fixed discussion view
    v2.19 Fixed retrieval of photo id
    v2.20 Fixed retrieval of photo id again, using location instead of document content.
    Added @version and @license GM tags.
    MB 2022-03-17.
    v2.21 Fixed pool view in 'new' layout as opposed to deprecated 'classic'.
    Tweaked photo id extraction regular expression.
    Policed global leaks and wayward var declarations.
    Added @author tag.
    MB 2022-03-24.
    v2.22 Fixed discussion view in 'new' (default) layout format.
    Awards pane in each photo of the 'new' pool layout now scrollable if too many awards to display.
    MB 2022-03-28.
    v2.23 Updated configuration panel to display properly in modern browsers.
    Removed cloud export for settings (phazeshift endpoint no longer available).
    Fixed script version check now based on Greasy Fork repository.
    Displays update link in the configuration panel when new version is available.
    MB 2022-04-14.
    v2.24 Updated event handler so that awards for the selected photo are displayed directly
    when going from one photo to the next or previous in photo page view, as well as when
    clicking on a photo tile in the new standard pool and stream views. No more page reloading necessary.
    Updated photo page to display actual comments separately from awards. Click link to alternate display.
    Feature can be disabled/enabled at the bottom of the configuration panel.
    MB 2022-04-22.
     
    Known Issues
    ============
    Group pool and discuss pages in deprecated 'classic' layout cannot display the award links in Safari.
    That is apparently not solvable at the script's level. The 'new' default layout should be used anyway.
     
    */
     
     
    // Config Stuff
     
    var glblConfigAwards = undefined;
    var glblAllPhotos = undefined;
    var glblCommentsText = undefined;
    var glblAuthors = {};
    var glblLastPhotoId = undefined;
    var glblPhotoId = undefined;
    var glblMode = undefined;
    var glblAllowDupesFrom = undefined;
    var glblVersion = '2.24';
    var glblServerVersion = glblVersion;
    var glblLastCheckedVersion = undefined;
    var glblScriptUrl = 'http://www.phazeshift.co.uk/files/flickrawardcounter.user.js';
    var glblScriptVersionUrl = 'https://greasyfork.org/en/scripts/441654-flickrawardcounter.json';
    var glblCloudSettingsUrl = 'http://www.phazeshift.co.uk/flickrawardcountersettings.php?';
    var glblCloudSettingsId = "";
    var glblUpdateCheck = true;
    var glblFavourites = false;
    var glblGalleries = false;
    var glblHideZeroCount = false;
    var glblSeparateAwards = true;
    var glblApiKey = 'cf7bfd7c92fcbea46bb7bce79b81ead7';
    const SinglePhotoMode = 'Single';
    const DiscussMode = 'Group';
    const PoolMode = 'Pool';
    const ConfigureLink = '<small>( <a href="#flickrawardconfig-configure" class="Plain">configure</a> )</small>';
    const AwardCounter = '<small>Flickr Award Counter</small> ';
    const PoolAwardXPath = "//div[@class='flickraward']";
    const AwardInnerXPath = ".//span[@id='flickraward-awardcount-inner']";
    const AwardFooterXPath = ".//span[@id='awardcount-awardfooter']";
    const AwardToHideXPath = ".//span[@id='flickraward-awardcount-tohide']";
     
    function Save() {
        GM_setValue('awards', CreateSaveAwardStr());
    	GM_setValue('awardsText', CreateSaveCommentsStr());
     
        if (glblAllowDupesFrom) {
            GM_setValue('awards-allow-dupes-from', glblAllowDupesFrom.join(';').toLowerCase());
        }
     
        GM_setValue('favourites', glblFavourites);
        GM_setValue('galleries', glblGalleries);
        GM_setValue('hidezerocount', glblHideZeroCount);
        GM_setValue('separateawards', glblSeparateAwards);
        GM_setValue('updatecheck', glblUpdateCheck);
        SaveCloudSettingsId();
    }
     
    function SaveCloudSettingsId() {
        GM_setValue('cloudsettingsid',glblCloudSettingsId);
    }
     
    function SaveUpdateInfo() {
        GM_setValue('serverversion', glblServerVersion);
        if (glblLastCheckedVersion) { GM_setValue('lastcheckedversion',glblLastCheckedVersion.getTime().toString()); }
    }
     
    function GmSettingsWorking() {
        GM_setValue('gmsettingstest',glblVersion);
        return (glblVersion == GM_getValue('gmsettingstest',''));
    }
     
    function Load() {
        var buf = '';
        ParseSaveAwardStr(GM_getValue('awards', ''));
        ParseSaveCommentsStr(GM_getValue('awardsText', ''));
        buf = GM_getValue('awards-allow-dupes-from', '');
     
        if (buf.length > 0){
            glblAllowDupesFrom = buf.toLowerCase().split(';');
        }
     
        glblServerVersion = GM_getValue('serverversion',glblServerVersion);
        buf = GM_getValue('lastcheckedversion');
     
        if (buf && buf != ''){
            glblLastCheckedVersion = new Date();
            glblLastCheckedVersion.setTime(buf);
        }
     
        glblUpdateCheck = GM_getValue('updatecheck', glblUpdateCheck);
        glblFavourites = GM_getValue('favourites',glblFavourites);
        glblGalleries = GM_getValue('galleries',glblGalleries);
        glblHideZeroCount = GM_getValue('hidezerocount',glblHideZeroCount);
        glblSeparateAwards = GM_getValue('separateawards',glblSeparateAwards);
        glblCloudSettingsId = GM_getValue('cloudsettingsid',glblCloudSettingsId);
    }
     
    function CreateSaveAwardStr() {
        var buf = '';
     
        for (var i = 0; i < glblConfigAwards.length; i++) {
            if (glblConfigAwards[i] != undefined) {
                buf = buf + escape(glblConfigAwards[i]["Name"]) + ',' + escape(glblConfigAwards[i]["Url"].join(';')) + "|";
            }
        }
     
        buf = buf.substring(0, buf.length - 1);
        return buf;
    }
     
    function CreateSaveCommentsStr() { //stringify award comments
        var buf = ''
        	i = j = k = max = 0;
     
        for (i = 0; i < glblConfigAwards.length; i++) {
     
            if (glblConfigAwards[i] != undefined && 'Comments' in glblConfigAwards[i]) {
                buf += escape(glblConfigAwards[i].Name) + ',';
                max = k = 0;
     
                for (j = 0; j < glblConfigAwards[i].Comments.length; j++) {
     
                	if (glblConfigAwards[i].Comments[j].count > max) {
                		max = glblConfigAwards[i].Comments[j].count;
                		k = j;
                	}
                }
     
                buf += escape(glblConfigAwards[i].Comments[k].text) + '|';
            }
    	}
     
    	buf = buf.substring(0, buf.length - 1);
        return buf;
    }
     
    function ParseSaveAwardStr(buf) {
    var Items = [],
        Items2 = [];
        glblConfigAwards = new Array();
        if (buf == undefined) { return; }
        Items = buf.split('|');
        for (var i = 0; i < Items.length; i++) {
            if (Items[i] != '')
            {
                Items2 = Items[i].split(',');
                try {
                    AddAward(unescape(Items2[0]),unescape(Items2[1]));
                } catch (ex) {
                    alert(ex)
                }
            }
        }
    }
     
    function ParseSaveCommentsStr(buf) {
     
    	var elements = [],
    		name = text = '',
    		i = index = 0;
     
        if (! buf) {
        	return;
        }
     
    	records = buf.split('|')
     
        for (i = 0; i < records.length; i++) {
     
        	if (records[i]) {
        		fields = records[i].split(',');
        		name = unescape(fields[0]);
        		text = unescape(fields[1]);
        		index = FindAwardPosByName(name);
     
        		if (index != -1) {
    				glblConfigAwards[index].Comments = [];
    				glblConfigAwards[index].Comments.push({'text': text, 'count': 0});
        		}
        	}
        }
    }
     
    function CmpConfigAwards(a,b) {
        var x = a["Name"].toLowerCase();
        var y = b["Name"].toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
     
    function Sort() {
        glblConfigAwards.sort(CmpConfigAwards);
        ConfigDisplayAwards();
    }
     
    function SortOne(awardId, up) {
        var tmpAward,
            newPos,
            i = FindAwardPosByName(awardId);
        if (i == -1) {return; }
        tmpAward = glblConfigAwards[i];
        if (up) { newPos = i - 1; }
        else { newPos = i + 1; }
        if ((newPos < 0) || newPos > glblConfigAwards.length - 1) { return; }
        glblConfigAwards[i] = glblConfigAwards[newPos];
        glblConfigAwards[newPos] = tmpAward;
        ConfigDisplayAwards();
    }
     
    function FindAwardByName(awardid) {
        var i = FindAwardPosByName(awardid);
        if (i == -1) return undefined;
        return glblConfigAwards[i];
    }
     
    function FindAwardPosByName(awardid) {
     
        var Award = {};
     
        for (var i=0; i < glblConfigAwards.length; i++) {
     
            if (glblConfigAwards[i] != undefined) {
                Award = glblConfigAwards[i];
     
                if (Award["Name"] == awardid) {
                    return i;
                }
            }
        }
     
        return -1;
    }
     
    function ConfigDisplayAwardRow(buf, Award, pos, total) {
        buf = '<tr>';
        buf += '<td class="col1">' + ConvertTags(Award["Name"]) + '</td>';
        buf += '<td class="col2">' + ConvertTags(Award["Url"].join(';')) + '</td>';
        buf += '<td class="col3"><a href="#flickrawardconfig-edit-' + escape(Award["Name"]) + '" class="AwardCounterButton" title="edit">e</a></td>';
        buf += '<td class="col4"><a href="#flickrawardconfig-remove-' + escape(Award["Name"]) + '" class="AwardCounterButton" title="delete">d</a></td>';
        buf += '<td class="col5">';
        if (pos != 0) buf += '<a href="#flickrawardconfig-sortup-' + escape(Award["Name"]) + '" class="AwardCounterButton" title="move up">/\\</a>';
    	buf += '</td>'
        buf += '<td class="col6">';
        if (pos != total) buf += '<a href="#flickrawardconfig-sortdown-' + escape(Award["Name"]) + '" class="AwardCounterButton" title="move down">\\/</a>';
    	buf += '</td>'
    	buf += '</tr>'
        return buf;
    }
     
    function ConfigDisplayAwards() {
     
        var varElement = document.getElementById('AwardCounterVarList'),
            buf = '',
            i,
            Award,
            awardAdded = false;
     
        for (i = 0; i < glblConfigAwards.length; i++) {
     
            if (glblConfigAwards[i]) {
                Award = glblConfigAwards[i];
                buf += ConfigDisplayAwardRow(buf, Award, i, glblConfigAwards.length - 1);
                awardAdded = true;
            }
        }
     
        if (!awardAdded) {
            buf = '<tr><td colspan="6">None defined.</td></tr>';
        }
     
        // Replace html with new stuff
        varElement.innerHTML = buf;
    }
     
    function DeleteElement(elementname) {
        var varElement = document.getElementById(elementname);
        if (varElement) {
            varElement.parentNode.removeChild(varElement);
        }
    }
     
    function SafeSetElementValue(elename, elevalue) {
        var varElement = document.getElementById(elename);
        if (varElement) {
            varElement.value = elevalue;
        }
    }
     
    function trim(stringToTrim) {
        return stringToTrim.replace(/^\s+|\s+$/g,"");
    }
     
    function TrimArray(arr) {
        for (var i = 0; i<arr.length; i++) {
            arr[i] = trim(arr[i]);
        }
        return arr;
    }
     
    function CheckString(Value) {
        if (Value.indexOf('|') > -1) return false;
        if (Value.indexOf(',') > -1) return false;
        return true;
    }
     
    function AddAward(Name, Url) {
        var newAward = true;
        if (!Name) {return};
        if (!Url) {return};
        Name = RemoveTags(Name);
        var Award = FindAwardByName(Name);
        if (!CheckString(Name)) {
            throw('Name contains a \'|\' or a \',\' which isn\'t valid');
        }
        if (!CheckString(Url)) {
            throw('Url contains a \'|\' or a \',\' which isn\'t valid');
        }
        if (Award != undefined) {
            newAward = false;
        }
        if (newAward)
        {
            Award = {"Name" : "", "Url" : ""};
        }
        Award["Name"] = Name;
        Award["Url"] = TrimArray(Url.split(';'));
        if (newAward)
        {
            glblConfigAwards[glblConfigAwards.length] = Award;
        }
    }
     
    function EditAward(Name) {
        var Award = FindAwardByName(Name);
        if (Award == undefined) return;
        document.getElementById("AwardName").value = Award["Name"];
        document.getElementById("AwardUrl").value = Award["Url"].join(';');
    }
     
    function RemoveAward(Name) {
        var i = FindAwardPosByName(Name);
        if (i != -1) {
            glblConfigAwards[i] = undefined;
        }
        ConfigDisplayAwards();
    }
     
    function NewerVersion(serverVersion, currentVersion) {
        serverVersion = serverVersion.split(".");
        currentVersion = currentVersion.split(".");
     
        var i;
     
        for (i = 0; i < serverVersion.length; i++) {
            if (parseInt(serverVersion[i]) > parseInt(currentVersion[i])) return true;
        }
     
        return false;
    }
     
    function CreateConfigPage() {
     
        var newDiv = document.createElement('div'),
     
        	htmlTemplate = `
    <div id="flickrawardconfig-main">
    	<h3>Flickr Award Counter</h3>**UPDATE**
    	<p>
    		<small>Version **VERSION** &copy; copyright 2007-2022 <a href="http://www.phazeshift.co.uk/" class="Plain">Phazeshift</a> et al. Re-released under <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>.</small>
    	</p>
    	<p style="line-height: 18px;"><small>
    		This is a small UserScript to count the number of awards given to photos in groups on Flickr.
    		It will count any number of different awards given by users.
    		It will ignore duplicate awards of the same type from a user.
    		To start, just add a name for the award below and paste the url of the image for the award, click Add, then click Save.
    	</small></p>
    	<strong>Registered Awards</strong><br>
    	<table id="AwardCounterVarList"></table>
    	<table id="AwardCounterVarListFooter">
    		<tr>
    			<td width="100%" align="right">
    				<a href="#flickrawardconfig-sort" class="AwardCounterButton">Sort</a>
    				<a href="#flickrawardconfig-clear" class="AwardCounterButton">Delete All</a>
    			</td>
    		</tr>
    	</table>
    	<table id="AwardCounterInputs">
    		<tr>
    			<td class="col1"><b>Award Name</b></td>
    			<td class="col2"><b>Award Image Url</b></td>
    			<td class="col3">&nbsp;</td>
    			<td class="col4">&nbsp;</td>
    			<td class="col5">&nbsp;</td>
    			<td class="col6">&nbsp;</td>
    		</tr>
    		<tr>
    			<td class="col1">
    				<input type="text" id="AwardName" name="AwardName"/>
    			</td>
    			<td class="col2">
    				<input type="text" id="AwardUrl" name="AwardUrl" placeholder="list of urls, separated by semi-colons, no spaces allowed"/>
    			</td>
    			<td colspan="4">
    				<a href="#flickrawardconfig-add" class="AwardCounterButton" title="add award to list">Add</a>
    			</td>
    		</tr>
    	</table>
    	<table id="AwardCounterOptions">
    		<tr>
    			<td class="col1">
    				<b>Allow Duplicates From </b>
    			</td>
    			<td class="col2">
    				<input type="text" size="100%" id="AwardAllowDupesFrom" placeholder="list of user ids, separated by semi-colons, no spaces allowed"/>
    			</td>
    			<td class="col3">&nbsp;</td>
    			<td class="col4">&nbsp;</td>
    			<td class="col5">&nbsp;</td>
    			<td class="col6">&nbsp;</td>
    		</tr>
    		<tr>
    			<td colspan="6">
    				<small>You can specify a list of users to allow duplicate awards on the same photo for.</small>
    			</td>
    		</tr>
    		<tr>
    			<td class="col1">
    				<input type="checkbox"**Favourites** id="AwardFavouritesEnabled"/>
    				<b>show favourites</b>
    			</td>
    			<td colspan="5">
    					<small>This option will show the number of users that have added a picture as a favourite.
    					This option is a little slower, as it requires a second call to flickr.</small>
    			</td>
    		</tr>
    		<tr>
    			<td class="col1">
    				<input type="checkbox"**Galleries** id="AwardGalleriesEnabled"/>
    				<b>show galleries</b>
    			</td>
    			<td colspan="5">
    					<small>This option will show the number of galleries a picture has been added to.
    					This option is a little slower, as it requires a second call to flickr.</small>
    			</td>
    		</tr>
    		<tr>
    			<td class="col1">
    				<input type="checkbox"**HideZeroCount** id="AwardHideZeroCountEnabled"/>
    				<b>hide zero count</b>
    			</td>
    			<td colspan="5">
    				<small>This option will hide awards with a count of zero.</small>
    			</td>
    		</tr>
    		<tr>
    			<td class="col1">
    				<input type="checkbox"**SeparateAwards** id="AwardSeparationEnabled"/>
    				<b>separate awards from comments</b>
    			</td>
    			<td colspan="5">
    				<small>This option will show actual comments only in the comments pane.
    				Click 'show awards' to display awards instead.</small>
    			</td>
    		</tr>
    	</table>
    	<table id="AwardCounterExports"">
    		<tr>
    			<td class="col1">
    				<b>Export settings</b>
    			</td>
    			<td class="col2">
    				<input type="text" size="100%" id="ExportSettings" name="ExportSettings" value="" placeholder="leave blank & click export or paste backup string & click import"/>
    			</td>
    			<td colspan="4" align="right">
    				<a href="#flickrawardconfig-exportsettings" class="AwardCounterButton">Export</a>
    				<a href="#flickrawardconfig-importsettings" class="AwardCounterButton">Import</a>
    			</td>
    		</tr>
    		<tr>
    			<td colspan="6" style="white-space: normal; line-height: 18px;">
    				<small>This option will allow you to save and restore your awards as a string that can be copied to a text file.
    				To save your settings, leave the box blank and click Export.
    				Copy the string that pops in the box and paste it somewhere else.
    				To load your settings, just paste a string
    				(copied from some text backup or another instance of FlickrAwardCounter)
    				in the box and click Import.</small>
    			</td>
    		</tr>
    	</table>
    	<table id="AwardCounterActions">
    		<tr>
    			<td width="100%" align="right">
    				<a href="#flickrawardconfig-save" class="AwardCounterButton">Save</a>
    				<a href="#flickrawardconfig-cancel" class="AwardCounterButton">Cancel</a>
    			</td>
    		</tr>
    	</table>
    </div>
    		`,
     
        	cssTemplate = `
    #flickrawardconfig-main {
    	position:absolute;
    	top: **TOP**px;
    	left: **LEFT**px;
    	border: thin solid;
    	width: 800px;
    	padding: 20px;
    	font-family: Arial;
    	text-align: left;
    	background-color: #eee;
    	color: black;
    	z-index: 10000;
    }
     
    #AwardCounterVarList,
    #AwardCounterExports,
    #AwardCounterActions {
    	width: 780px;
    	margin-top: 10px;
    }
     
    #AwardCounterVarListFooter,
    #AwardCounterInputs,
    #AwardCounterOptions {
    	width: 780px;
    }
     
    #AwardCounterVarList tr:first-child,
    #AwardCounterExports tr:first-child {
    	border-top: 1px solid #ccc; ! important;
    	border-bottom: 1px solid #e3e3e3; ! important;
    }
     
    #AwardCounterVarListFooter tr::before,
    #AwardCounterVarList tr::before,
    #AwardCounterInputs tr::before,
    #AwardCounterOptions tr::before,
    #AwardCounterExports tr::before,
    #AwardCounterActions tr::before {
    	content: none; ! important;
    }
     
    #AwardCounterVarListFooter tr::after,
    #AwardCounterVarList tr::after,
    #AwardCounterInputs tr::after,
    #AwardCounterOptions tr::after,
    #AwardCounterExports tr::after,
    #AwardCounterActions tr::after {
    	content: none; ! important;
    }
     
    #AwardCounterVarList td {
    	overflow: hidden;
    	text-overflow: ellipsis;
    }
     
    #AwardCounterInputs tr,
    #AwardCounterOptions tr,
    #AwardCounterActions tr {
    	border: none;
    }
     
    td.col1 {
    	width: 150px;
    }
     
    td.col2 {
    	width: 480px;
    }
     
    td.col3, td.col4 {
    	width: 30px;
    }
     
    td.col5, td.col6 {
    	width: 30px;
    }
     
    td.col1 input[type=text],
    td.col2 input[type=text] {
    	width: 100%;
    }
    		`;
     
    	cssTemplate = cssTemplate.replace('**TOP**', document.body.scrollTop + 50);
    	cssTemplate = cssTemplate.replace('**LEFT**', document.body.scrollLeft + 40);
        AddGlobalStyle(cssTemplate);
     
    	htmlTemplate = htmlTemplate.replace('**VERSION**', glblVersion);
    	htmlTemplate = htmlTemplate.replace('**UPDATE**', (NewerVersion(glblServerVersion, glblVersion)) ? '<p><b>Please update to <a href="https://greasyfork.org/en/scripts/441654-flickrawardcounter">version ' + glblServerVersion + '</a></b>.</p>' : '');
    	htmlTemplate = htmlTemplate.replace('**Favourites**', (glblFavourites) ? ' checked="checked"' : '');
    	htmlTemplate = htmlTemplate.replace('**Galleries**', (glblGalleries) ? ' checked="checked"' : '');
    	htmlTemplate = htmlTemplate.replace('**HideZeroCount**', (glblHideZeroCount) ? ' checked="checked"' : '');
    	htmlTemplate = htmlTemplate.replace('**SeparateAwards**', (glblSeparateAwards) ? ' checked="checked"' : '');
    	htmlTemplate = htmlTemplate.replace('**CloudSettingsId**', glblCloudSettingsId);
     
        newDiv.setAttribute('id','flickrawardconfig-container');
        newDiv.innerHTML = htmlTemplate;
        document.body.insertBefore(newDiv, document.body.firstChild);
    }
     
     
    // Handle Events
     
    function EventAdd() {
        try {
            var AwardName = document.getElementById("AwardName").value;
            var AwardUrl = document.getElementById("AwardUrl").value;
            AddAward(AwardName,AwardUrl);
            document.getElementById("AwardName").value = '';
            document.getElementById("AwardUrl").value = '';
            ConfigDisplayAwards();
        } catch (ex) {
            alert(ex);
        }
    }
     
    function EventCancel() {
        Load();
        DeleteElement("flickrawardconfig-container");
    }
     
    function EventExportSettings() {
        document.getElementById("ExportSettings").value = CreateSaveAwardStr();
    }
     
    function EventImportSettings() {
        ParseSaveAwardStr(document.getElementById("ExportSettings").value);
        ConfigDisplayAwards();
    }
     
    function EventSaveCloudSettings() {
    /*
        glblCloudSettingsId = document.getElementById("AwardCloudSettingsId").value;
        SaveCloudSettingsId();
        Save();
        SaveCloudSettings();
    */
    }
     
    function EventLoadCloudSettings() {
    /*
        glblCloudSettingsId = document.getElementById("AwardCloudSettingsId").value;
        SaveCloudSettingsId();
        LoadCloudSettings();
    */
    }
     
    function EventSave() {
        var buf = document.getElementById("AwardAllowDupesFrom").value;
        if (buf.length > 0) {
            glblAllowDupesFrom = TrimArray(buf.toLowerCase().split(';'));
        }
        glblFavourites = document.getElementById("AwardFavouritesEnabled").checked;
        glblGalleries = document.getElementById("AwardGalleriesEnabled").checked;
        glblHideZeroCount = document.getElementById("AwardHideZeroCountEnabled").checked;
        glblSeparateAwards = document.getElementById("AwardSeparationEnabled").checked;
        Save();
        EventCancel();
        GetAwardCounts();
    }
     
    function EventSortAll() {
        Sort();
    }
     
    function GetIdFromClicked(clickedOn,eventType){
        var idstart = clickedOn.indexOf(eventType) + eventType.length + 1;
        var awardid = clickedOn.substring(idstart,255);
        return unescape(awardid);
    }
     
    function EventRemove(clickedOn) {
        var awardid = GetIdFromClicked(clickedOn,'remove');
        RemoveAward(awardid);
    }
     
    function EventEdit(clickedOn) {
        var awardid = GetIdFromClicked(clickedOn,'edit');
        EditAward(awardid);
    }
     
    function EventSortOne(clickedOn,up) {
        var awardid;
        if (up) {
            awardid = GetIdFromClicked(clickedOn,'-sortup');
        } else {
            awardid = GetIdFromClicked(clickedOn,'-sortdown');
        }
        SortOne(awardid,up);
    }
     
    function EventCountShow(clickedOn) {
        var photoid = GetIdFromClicked(clickedOn, 'countshow'),
            theElement = GetDisplayElement(photoid);
     
        theElement = FindFirstElement(theElement, AwardInnerXPath);
        theElement.innerHTML = 'Retrieving comments, please wait...';
        GetCommentsForPhotoId(photoid);
    }
     
    function EventCountAllShow() {
        glblAllPhotos = [];
     
        var PhotoDetails,
            theElement,
            PhotoId,
            allPhotoElements = document.evaluate(
                PoolAwardXPath,
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null);
     
        for (var i = 0; i < allPhotoElements.snapshotLength; i++) {
            theElement = allPhotoElements.snapshotItem(i);
            PhotoId = theElement.id.substring(theElement.id.lastIndexOf('-')+1,255);
            PhotoDetails = {};
            PhotoDetails.PhotoId = PhotoId;
            PhotoDetails.Done = false;
            glblAllPhotos[i] = PhotoDetails;
        }
     
        theElement = document.getElementById('flickraward-awardcountall');
     
        if (theElement) {
            theElement.innerHTML = '<small>Retrieving comments, please wait...</small>';
        }
     
        DisplayNextPhotoDetails();
    }
     
    function EventCountHideAll() {
        ToggleAll(false)
    }
     
    function ToggleAll(Visible) {
        var theElement,
            PhotoId;
        var allPhotoElements = document.evaluate(
            PoolAwardXPath,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        for (var i = 0; i < allPhotoElements.snapshotLength; i++) {
            theElement = allPhotoElements.snapshotItem(i);
            PhotoId = theElement.id.substring(theElement.id.lastIndexOf('-')+1,255);
            ToggleDisplayAwards(PhotoId,Visible);
        }
        ToggleShowHideAll(Visible);
    }
     
    function EventCountReshowAll() {
        ToggleAll(true);
    }
     
    function EventClear() {
        var Ok = confirm("Do you really want to delete the awards you have set up??");
        if (!Ok) { return; }
        GM_setValue('awards', '');
        GM_setValue('awards-allow-dupes-from', '');
        GM_setValue('lastcheckedversion', '');
        Load();
        ConfigDisplayAwards();
    }
     
    function EventCountPositionAndShow(clickedOn) {
        var PhotoId = GetIdFromClicked(clickedOn, 'countpositionandshow'),
            theElement = GetDisplayElement(PhotoId);
        theElement = FindFirstElement(theElement,AwardInnerXPath);
        theElement.innerHTML = 'Retrieving comments, please wait...';
        ToggleDisplayAwards(PhotoId, true);
        GetCommentsForPhotoId(PhotoId);
    }
     
    function EventCountHide(clickedOn) {
        clickedOn = unescape(clickedOn);
        var idstart = clickedOn.indexOf('counthide') + 10;
        var PhotoId = clickedOn.substring(idstart,255);
        ToggleDisplayAwards(PhotoId, false);
    }
     
    function EventCountReshow(clickedOn) {
        clickedOn = unescape(clickedOn);
        var idstart = clickedOn.indexOf('countreshow') + 12;
        var PhotoId = clickedOn.substring(idstart,255);
        ToggleDisplayAwards(PhotoId,true);
    }
     
    function EventConfigPage() {
        // Do our config page stuff
        CreateConfigPage();
        if (glblConfigAwards == undefined) {
            Load();
        }
        ConfigDisplayAwards();
        if (glblAllowDupesFrom) {
            var varElement = document.getElementById("AwardAllowDupesFrom");
            varElement.value = glblAllowDupesFrom.join(';');
        }
    }
     
     
    // Configure Event Handler
     
    function EndsWith(str, substr){
        return (str.lastIndexOf(substr) == str.length - substr.length);
    }
     
    function ConfigureEvents() {
     
        document.addEventListener('click', function(event) {
            // event.target is the element that was clicked
            var clickedOn = event.target.toString(),
            	target;
     
            if (clickedOn.indexOf('#flickrawardconfig-') > -1) { // flickrAwardCounter interface elements
     
                if (EndsWith(clickedOn, 'save')) {
                    EventSave();
                }
     
                if (EndsWith(clickedOn, 'sort')) {
                    EventSortAll();
                }
     
                if (EndsWith(clickedOn, 'cancel')) {
                    EventCancel();
                }
     
                if (EndsWith(clickedOn, 'add')) {
                    EventAdd();
                }
     
                if (EndsWith(clickedOn, 'exportsettings')) {
                    EventExportSettings();
                }
     
                if (EndsWith(clickedOn, 'importsettings')) {
                    EventImportSettings();
                }
     
                if (EndsWith(clickedOn, 'configure')) {
                    EventConfigPage();
                }
     
                if (EndsWith(clickedOn, 'togglecomments')) {
                    ToggleComments();
                }
     
                if (clickedOn.indexOf('-remove-') > 0) {
                    EventRemove(clickedOn);
                }
     
                if (clickedOn.indexOf('-sortup-') > 0) {
                    EventSortOne(clickedOn,true);
                }
     
                if (clickedOn.indexOf('-sortdown-') > 0) {
                    EventSortOne(clickedOn,false);
                }
     
                if (clickedOn.indexOf('-edit-') > 0) {
                    EventEdit(clickedOn);
                }
     
                if (clickedOn.indexOf('countshow') > 0) {
                    EventCountShow(clickedOn);
                }
     
                if (clickedOn.indexOf('countallhide') > 0) {
                    EventCountHideAll(clickedOn);
                }
     
                if (clickedOn.indexOf('countallreshow') > 0) {
                    EventCountReshowAll(clickedOn);
                }
     
                if (clickedOn.indexOf('counthide') > 0) {
                    EventCountHide(clickedOn);
                }
     
                if (clickedOn.indexOf('countpositionandshow') > 0) {
                    EventCountPositionAndShow(clickedOn);
                }
     
                if (clickedOn.indexOf('countreshow') > 0) {
                    EventCountReshow(clickedOn);
                }
     
                if (clickedOn.indexOf('countallshow') > 0) {
                    EventCountAllShow();
                }
     
                if (clickedOn.indexOf('clear') > 0) {
                    EventClear();
                }
     
                // we handled the event so stop propagation
                event.stopPropagation();
                event.preventDefault();
            }
     
            else { // process click on Flickr interface elements
            	target = (event.target.tagName.toLowerCase() == 'span' && event.target.parentNode) ? event.target.parentNode : event.target;
     
            	if (target.tagName.toLowerCase() == 'a') { // click on a link
     
    				if ('data-track' in target.attributes && (target.attributes['data-track'].value == 'prevPhotoButtonClick' || target.attributes['data-track'].value == 'nextPhotoButtonClick')) { // previous / next photo click in photo page
    					setTimeout(ProcessFlickrPhotoPage, 1000);
    				}
     
            		else if (target.classList.contains('overlay')) { // click on photo in pool page
    					glblMode = SinglePhotoMode;
    					setTimeout(ProcessFlickrPhotoPage, 1000);
            		}
            	}
            }
        }, true);
     
    	document.addEventListener('keyup', function(event) { // process left right arrow keys in photo page
     
    		if (event.code == 'ArrowLeft' || event.code == 'ArrowRight') {
     
    			if (glblMode == SinglePhotoMode) {
    				setTimeout(ProcessFlickrPhotoPage, 1000);
    			}
    		}
    	}, true);
    }
     
     
    // API calls
     
    function CallFlickrMethod(method, params, onLoadFunction) {
        params['format'] = 'json';
        params['nojsoncallback'] = 1;
        params['method'] = method;
        var url = "https://api.flickr.com/services/rest?";
        CallMethod(url,params,onLoadFunction);
    }
     
    function CallMethod(url, params, onLoadFunction) { // http GET XHR wrapper
    	var key;
     
        for(key in params) {
            url += "&" + key + "=" + params[key];
        }
     
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
     
            headers: {
                "User-Agent": "flickrAwardCounter",
                "Accept": "application/json",
            },
     
            onload: onLoadFunction
        });
    }
     
    function CallPostMethod(url, params, onLoadFunction) { // http POST XHR wrapper
     
        var key,
    		data = '';
     
        for (key in params) {
            data += key + "=" + params[key] + "&";
        }
     
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: data,
     
            headers: {
                "User-Agent": "flickrAwardCounter",
                "Accept": "text/monkey,text/xml",
                "Content-Type": "application/x-www-form-urlencoded"
            },
     
            onload: onLoadFunction
        });
    }
     
     
    function GetCommentsForPhotoId(PhotoId) {
     
        // Have we already cached the comments? if so skip api call
        if (glblLastPhotoId != PhotoId || glblCommentsText == undefined) {
     
            var params = {},
                onLoadFunction = function(details) {
                    ProcessComments(details.responseText);
                };
     
            glblPhotoId = PhotoId;
            params.photo_id = PhotoId;
            params.api_key = glblApiKey;
            CallFlickrMethod('flickr.photos.comments.getList', params, onLoadFunction);
        } else {
            ProcessComments(glblCommentsText);
        }
    }
     
    function GetFavouritesForPhotoId(PhotoId) {
        var params = new Array();
        params['photo_id'] = PhotoId;
        params['per_page'] = 1;
        params['api_key'] = glblApiKey;
        var onLoadFunction = function(details) {
            ProcessFavourites(details.responseText);
        }
        CallFlickrMethod('flickr.photos.getFavorites', params, onLoadFunction);
    }
     
    function GetGalleriesForPhotoId(PhotoId) {
        var params = new Array();
        params['photo_id'] = PhotoId;
        params['per_page'] = 1;
        params['api_key'] = glblApiKey;
        var onLoadFunction = function(details) {
            ProcessGalleries(details.responseText,PhotoId);
        }
        CallFlickrMethod('flickr.galleries.getListForPhoto', params, onLoadFunction);
    }
     
    function CountAwardsPresentInText(intext, awardtextarr, index = -1) {
     
        var result = 0,
        	i = 0;
     
        for (i = 0; i < awardtextarr.length; i++) {	// loop through award urls
     
            if (intext.toLowerCase().indexOf(awardtextarr[i].toLowerCase()) > -1) {
            	result++;
            }
        }
     
        return result;
    }
     
    function inArray(arr, str) {
        for (var i=0; i<arr.length; i++)
        {
            if (arr[i] == str)
            { return true; }
        }
        return false;
    }
     
    function AllowDupes(who){
        if (!glblAllowDupesFrom) return false;
        return inArray(glblAllowDupesFrom,who.toLowerCase())
    }
     
    function ProcessFavourites(favouriteText) {
        var photoId = 0,
            obj = eval('(' + favouriteText + ')');
        if (obj.stat == 'fail') { return; }
        photoId = obj.photo.id;
        DisplayFavourites(obj.photo.total,photoId);
    }
     
    function ProcessGalleries(galleryText,photoId) {
        var obj = eval('(' + galleryText + ')');
        if (obj.stat == 'fail') { return; }
        DisplayGalleries(obj.galleries.total,photoId);
    }
     
    function ProcessComments(commentsText) {
     
        // initialize everything
        var glblCommentsText = commentsText,
            Award,
            awardCount,
            who,
            whoAwarded,
            CommentCount = 0,
            PhotoId = 0,
            dupesAllowed = false,
            WhoAwardedAwards = [],
            AwardCounts = [],
            comments = [],
            comment = {}
            cleanedUpComment = '',
            realComments = [],
            awardComments = [],
            obj = eval('(' + commentsText + ')');
     
        for (var i = 0; i < glblConfigAwards.length; i++) {
            WhoAwardedAwards[i] = new Array();
            AwardCounts[i] = 0;
        }
     
        if (obj.stat == 'fail') {
    		console.error('ProcessComments: comments retrieval failed for ' + glblPhotoId + ' - code: ' + obj.code + ', ' + obj.message)
     
            if (obj.code == 1) {
                DisplayError(glblPhotoId, obj.message + " (maybe it's private and I can't grab the comments?)");
            } else {
                DisplayError(glblPhotoId,'Code: ' + obj.code + ' Message: ' + obj.message);
            }
        }
     
        else
     
        {
            PhotoId = obj.comments.photo_id;
            glblLastPhotoId = PhotoId;
            comments = obj.comments.comment;
     
            if (comments) { // at least 1 comment
                CommentCount = comments.length;
     
                for (i = 0; i < comments.length; i++) { // loop through all comments
                    comment = comments[i];
                    who = comment.authorname;
     
                    for (var i2 = 0; i2 < glblConfigAwards.length; i2++) { // loop through configured award markers
                        Award = glblConfigAwards[i2];
     
                        if (Award == undefined) {
                            continue;
                        }
     
                        awardCount = CountAwardsPresentInText(comment._content, Award.Url, i2);
     
                        if (awardCount > 0) {
    						cleanedUpComment = comment._content.trim().replace(/\s+/g, ' ').replace(' "', '"').replace(/([^>]) </g, '$1<');
     
    						if ('Comments' in Award) {
     
    							for (var j = 0; j < Award.Comments.length; j++) { // loop thru comment texts
     
    								if (cleanedUpComment.toLowerCase().indexOf(Award.Comments[j].text.toLowerCase()) > -1) { // already registered
    									Award.Comments[j].count++; // one more
    									break;
    								} else if (Award.Comments[j].text.toLowerCase().indexOf(cleanedUpComment.toLowerCase()) > -1) { // already included
    									Award.Comments[j].text = cleanedUpComment;
    									Award.Comments[j].count++; // one more
    									break;
    								}
    							}
     
    							if (j >= Award.Comments.length) { // new comment
    								Award.Comments.push({'text': cleanedUpComment, 'count': 1});
    							}
    						} else { // first comment
    							Award.Comments = [];
    							Award.Comments.push({'text': cleanedUpComment, 'count': 1});
    						}
     
                            whoAwarded = WhoAwardedAwards[i2];
                            dupesAllowed = AllowDupes(who);
     
                            if (inArray(whoAwarded,who) && !dupesAllowed) {
                                continue;
                            }
     
                            if (!dupesAllowed) {
                                awardCount = 1;
                            }
     
                            AwardCounts[i2] = AwardCounts[i2] + awardCount;
                            whoAwarded[whoAwarded.length] = who;
                            glblConfigAwards[i2] = Award; // save to global array
                        }
                    }
     
    				if (comment._content.indexOf('<a href=') != -1 || comment._content.indexOf('<img src=') != -1) { // comment is an award
    					awardComments.push(comment);
    				} else { // comment is a real comment
    					realComments.push(comment);
    				}
     
    				glblAuthors[comment.author] = (comment.realname) ? comment.realname : comment.authorname;
                }
     
    			GM_setValue('awardsText', CreateSaveCommentsStr());
            }
     
            DisplayAwards(AwardCounts, CommentCount, PhotoId);
     
            if (glblFavourites) {
                GetFavouritesForPhotoId(PhotoId);
            }
     
            if (glblGalleries) {
                GetGalleriesForPhotoId(PhotoId);
            }
         }
     
        if (glblAllPhotos) {
            DisplayNextPhotoDetails();
        } else if (glblSeparateAwards) { // only in single photo display mode
     
        	setTimeout(function () {
    			DisplaySeparatedComments(realComments, awardComments);
    		}, 1000);
    	}
    }
     
    function DisplayNextPhotoDetails() {
     
        if (!glblAllPhotos) {
            return;
        }
     
        var theElement,
            AwardDivOuter,
            AwardDivInner;
     
        for (var i = 0; i < glblAllPhotos.length; i++) {
     
            if (!glblAllPhotos[i].Done) {
                glblAllPhotos[i].Done = true;
                AwardDivOuter = GetDisplayElement(glblAllPhotos[i].PhotoId);
     
                if (AwardDivOuter) {
                    AwardDivInner = FindFirstElement(AwardDivOuter,AwardInnerXPath);
     
                    if (AwardDivInner.innerHTML == '') {
                        GetCommentsForPhotoId(glblAllPhotos[i].PhotoId);
                    } else {
                        ToggleDisplayAwards(glblAllPhotos[i].PhotoId, true);
                    }
                }
            }
        }
     
        glblAllPhotos = undefined;
        theElement = document.getElementById('flickraward-awardcountall');
     
        if (theElement) {
            theElement.innerHTML = AwardCounter + ' ' + ConfigureLink + ' <span id="flickaward-showhideall"></span>';
            ToggleShowHideAll(true);
        }
    }
     
    function ToggleShowHideAll(Visible) {
        var theElement = document.getElementById('flickaward-showhideall');
     
        if (theElement) {
     
            if (Visible) {
                theElement.innerHTML = '<small>( <a href="#flickrawardconfig-countallhide" class="Plain">hide all awards</a> )</small>';
            } else {
                theElement.innerHTML = '<small>( <a href="#flickrawardconfig-countallreshow" class="Plain">show all awards</a> )</small>';
            }
        }
    }
     
    function GetAwardCounts() {
        var PhotoId = GetPhotoId();
        GetCommentsForPhotoId(PhotoId);
    }
     
    function DisplaySeparatedComments(comments, awards) {
     
    	var i,
    		buf = '',
    		authorname = '',
    		container = document.createElement('div'),
    		action = AwardCounter + '<small>( <a href="#flickrawardconfig-togglecomments" class="Plain" id="togglecomments">show awards</a> )</small>';
    		commentsList = document.getElementsByClassName('comments'),
    		commentsMore = document.getElementsByClassName('comments-more'),
    		user = getUserId();
     
    	if (commentsList.length == 0 || commentsList[0].tagName.toLowerCase() != 'ul') {
    		return;
    	}
     
    	if (commentsMore.length > 0) {
    		commentsMore[0].classList.add('noshow');
    	}
    console.log(glblAuthors);
    	for (i = 0; i < comments.length; i++) {
    		buf += RenderOneComment(comments[i], 'real', user);
    	}
     
    	for (i = 0; i < awards.length; i++) {
    		buf += RenderOneComment(awards[i], 'award noshow', user);
    	}
     
    	commentsList[0].innerHTML = buf;
    	container.innerHTML = action;
     
    	if (! document.getElementById('togglecomments')) {
    		commentsList[0].parentElement.insertBefore(container, commentsList[0]);
    	}
    }
     
    function RenderOneComment(comment, label = 'real', userId = '') {
     
    	var s = `
    <li class="comment ==LABEL==" id="comment==SHORTID==">
    	<div class="comment-icon circle-icon">
    		<a data-person-nsid="==AUTHOR==" href="/photos/==AUTHOR==/" data-track="commentBuddyIconClick" data-action="follow">
    			<img src="//live.staticflickr.com/==RND4==/buddyicons/==AUTHOR==.jpg?1541753920#==AUTHOR==" width="32" height="32">
    		</a>
    	</div>
    	<p class="comment-author">
    		<a href="/photos/==AUTHOR==/" data-track="commentUserNameClick" data-action="follow">==AUTHORNAME==</a>
    		<a href="/account/upgrade/pro" class="pro-badge-new">
    			<svg class="icon icon-pro-badge"><use xlink:href="#icon-pro-badge"></use></svg>
    		</a>
    		<span class="comment-date">==ELAPSED==</span>
    		<span class="comment-actions">
    			==ACTION==
    			<a href="#" class="comment-delete ui-icon-comment-delete" data-id="==ID==" data-action="delete" title="Delete"></a>
    			<a href="==PERMALINK==" class="comment-permalink ui-icon-comment-permalink" data-track="commentPermalinkClick" title="Permalink"></a>
    		</span>
    	</p>
    	<div class="comment-content" data-emoji-enabled="">==CONTENT==</div>
    </li>
    		`,
    		authorname = (comment.realname) ? comment.realname : comment.authorname,
    		regexp = /\[(.+?\/\/.+?\/photos\/(.+?))\/*\]/g,
    		matches = comment._content.matchAll(regexp),
    		match, realname,
    		reply = '<a href="#" class="comment-reply ui-icon-comment-reply" data-pathalias="==AUTHOR==" data-action="reply" title="Reply"></a>',
    		edit = '<a href="#" class="comment-edit ui-icon-comment-edit" data-id="==ID==" data-action="edit" title="Edit"></a>';
     
    	for (match of matches) {
    		realname = (match[2] in glblAuthors) ? glblAuthors[match[2]] : match[2];
    		comment._content = comment._content.replace(match[0], '<a href="' + match[1] + '">' + realname + '</a>')
    	}
     
    	comment._content = comment._content.replace(/\n/g, '<br>');
    	s = s.replace(/==ACTION==/g, (comment.author == userId) ? edit : reply);
    	s = s.replace(/==LABEL==/g, label);
    	s = s.replace(/==SHORTID==/g, comment.id.replace(/.*-/, ''));
    	s = s.replace(/==AUTHOR==/g, comment.author);
    	s = s.replace(/==AUTHORNAME==/g, authorname);
    	s = s.replace(/==RND4==/g, randomInRange(4111, 8888).toString());
    	s = s.replace(/==ELAPSED==/g, elapsed(comment.datecreate));
    	s = s.replace(/==ID==/g, comment.id);
    	s = s.replace(/==PERMALINK==/g, comment.permalink);
    	s = s.replace(/==CONTENT==/g, comment._content);
    	return s;
    }
     
    function ToggleComments() {
    	var link = document.getElementById('togglecomments'),
    		comments = document.getElementsByClassName('real'),
    		awards = document.getElementsByClassName('award');
     
    	if (!link) {
    		return;
    	}
     
    	if (link.innerHTML == 'show awards') {
     
    		awards.forEach(function(award) {
    			award.classList.remove('noshow');
    		});
     
    		comments.forEach(function(comment) {
    			comment.classList.add('noshow');
    		});
     
    		link.innerHTML = 'show comments';
    	} else {
     
    		awards.forEach(function(award) {
    			award.classList.add('noshow');
    		});
     
    		comments.forEach(function(comment) {
    			comment.classList.remove('noshow');
    		});
     
    		link.innerHTML = 'show awards';
    	}
    }
     
    function randomInRange(min, max) { //returns random integer between min and max
    	return Math.floor(Math.random() * (max - min + 1) + min);
    } //returns random integer between min and max
     
    function elapsed(d) { //returns number of years/months/weeks/days/hours/min/secs from now
     
    	var now = new Date(),
    		from = new Date(parseInt(d, 10) * 1000), // d is the number of seconds since the epoch as a string
    		years = now.getFullYear() - from.getFullYear(),
    		months = now.getMonth() - from.getMonth(),
    		secs = Math.floor((now - from) / 1000),
    		mins = Math.floor(secs / 60),
    		hours = Math.floor(mins / 60),
    		days = Math.floor(hours / 24),
    		weeks = Math.floor(days / 7);
     
    	if (years) {
    		return years + 'y';
    	}
     
    	if (months) {
    		return months + 'm';
    	}
     
    	if (weeks) {
    		return weeks + 'w';
    	}
     
    	if (days) {
    		return days + 'd';
    	}
     
    	if (hours) {
    		return hours + 'h';
    	}
     
    	if (mins) {
    		return mins + 'm';
    	}
     
    	if (secs) {
    		return secs + 's';
    	}
     
    	return 'error';
    } //returns number of years/months/weeks/days/hours/min/secs from now
     
    function getUserId() { // retrieves Flickr current user id from page
    	var userElement = GetMatchingElementsFromDom('//div[@class="c-account-buddyicon"]/a/div');
     
    	if (userElement.snapshotLength == 1) {
    		return(userElement.snapshotItem(0).style.backgroundImage.toString().replace(/.*#([^"]+)".*/, '$1'));
    	} else {
    		console.log('getUserId: user not found in page.');
    		return('');
    	}
    } // retrieves Flickr current user id from page
     
    function GetMatchingElementsFromDom(xpath) {
     
        return document.evaluate(
            xpath,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
    }
     
    function GetPhotoId() {
     
        var Id = '',
            thisElement;
     
        //<link id="image-src" href="http://farm8.staticflickr.com/7207/7122222123_e75d17f0f0_m.jpg" rel="image_src">
        var allPhotoUrls = GetMatchingElementsFromDom(".//link[@id='image-src']/@href");
     
        if (allPhotoUrls.snapshotLength === 0) { // old layout
            allPhotoUrls = GetMatchingElementsFromDom(".//div[@class='photoImgDiv']/img/@src");
        }
     
        if (allPhotoUrls.snapshotLength === 0) { // new layout
            allPhotoUrls = GetMatchingElementsFromDom(".//div[@class='photo-div']/img/@src");
        }
     
        if (allPhotoUrls.snapshotLength === 0) { // new layout 29/06/2014
            allPhotoUrls = GetMatchingElementsFromDom(".//meta[@name='og:image']/@content");
        }
     
        if (allPhotoUrls.snapshotLength === 0) { // new layout 22/04/2015
            allPhotoUrls = GetMatchingElementsFromDom(".//img[@class='low-res-photo']/@src");
        }
     
        for (var i = 0; i < allPhotoUrls.snapshotLength; i++) {
            thisElement = allPhotoUrls.snapshotItem(i);
     
            if (thisElement.value) {
                Id = GetImageId(thisElement.value);
                break;
            }
        }
     
        if (!Id) { // new layout 16/03/2022, try using location instead of document
            // eg. https://www.flickr.com/photos/marcbarrot/51941641266/in/dateposted-public/
            Id = document.location.href.replace(/.*\/(\d+)\/.*/, "$1");
     
            if (Id == document.location.href) {
                // eg. https://www.flickr.com/photos/marcbarrot/51941641266
                Id = document.location.href.replace(/.*\/(\d+)$/, "$1");
            }
     
            Id = (Id == document.location.href) ? '' : Id;// for consistency, return empty if cannot locate photo id
       }
     
        return Id;
    }
     
    function CreateAwardPane(pane, insertAfter) {
     
    	var newElement = document.createElement('p'),
            buf = '<h3>Awards</h3></p><p><span id="flickraward-awardcount-inner" class="AwardCount">Retrieving comments, please wait...</span><br/>' + AwardCounter + ConfigureLink;
     
        if (pane) {
            newElement.setAttribute('id', 'flickraward-awardcount');
            newElement.innerHTML = buf;
     
            if (insertAfter) {
                pane.parentNode.insertBefore(newElement, pane.nextSibling);
            } else {
            	pane.parentNode.insertBefore(newElement, pane);
            }
        }
    }
     
    function GetDisplayElement(PhotoId) {
     
        if (glblMode == SinglePhotoMode) {
            return document.getElementById('flickraward-awardcount');
        } else {
            var buf = 'flickraward-awardcount-' + PhotoId;
            return document.getElementById(buf);
        }
    }
     
    function DisplayError(PhotoId, errorstr) {
        var AwardDivOuter = GetDisplayElement(PhotoId);
        if (AwardDivOuter) {
            var AwardDivInner = FindFirstElement(AwardDivOuter,AwardInnerXPath);
            AwardDivInner.innerHTML = 'Error: ' + errorstr;
            if (glblMode != SinglePhotoMode)
            {
                ToggleDisplayAwards(PhotoId,true);
            }
        }
    }
     
    function ToggleDisplayAwards(PhotoId, Visible) {
     
        var Footer,
            buf = '',
            AwardDivToHide,
            AwardDivOuter = GetDisplayElement(PhotoId);
     
        if (AwardDivOuter) {
            Footer = FindFirstElement(AwardDivOuter, AwardFooterXPath);
            AwardDivToHide = FindFirstElement(AwardDivOuter, AwardToHideXPath);
     
            if (!Visible) {
                if (glblMode == DiscussMode) {
                    buf += AwardCounter;
                }
     
                buf += '<small>( <a href="#flickrawardconfig-countreshow-' + PhotoId + '" class="Plain">show awards</a> )</small>';
                Footer.innerHTML = buf;
            } else {
                Footer.innerHTML = '';
            }
     
            if (Visible) {
                //AwardDivToHide.style.visibility = 'visible';
                AwardDivToHide.style.display = 'inline';
                AwardDivToHide.style.lineHeight = 'normal';
            } else {
                //AwardDivToHide.style.visibility = 'hidden';
                AwardDivToHide.style.display = 'none';
            }
        }
    }
     
    function DisplayFavourites(favCount, PhotoId){
        var AwardDivOuter = GetDisplayElement(PhotoId);
        if (AwardDivOuter) {
            var AwardDiv = FindFirstElement(AwardDivOuter,AwardInnerXPath);
            AwardDiv.innerHTML += '&nbsp; <b>' + favCount + '</b> favourites<br/>';
        }
    }
     
    function DisplayGalleries(galCount, PhotoId){
        var AwardDivOuter = GetDisplayElement(PhotoId);
        if (AwardDivOuter) {
            var AwardDiv = FindFirstElement(AwardDivOuter,AwardInnerXPath);
            AwardDiv.innerHTML += '&nbsp; <b>' + galCount + '</b> galleries<br/>';
        }
    }
     
    function DisplayAwards(AwardCounts, CommentCount, PhotoId) {
        var addedAward,
            AwardDiv,
            buf = '',
            Award,
            AwardDivOuter = GetDisplayElement(PhotoId);
     
        if (AwardDivOuter) {
            AwardDiv = FindFirstElement(AwardDivOuter,AwardInnerXPath);
            // Iterate over awards
            addedAward = false;
     
            for (var i = 0; i < glblConfigAwards.length; i++) {
                Award = glblConfigAwards[i];
     
                if (Award != undefined) {
     
                    // Stick our content into the page before comments
                    if ((!glblHideZeroCount) || (AwardCounts[i] != 0)) {
                        buf += '&nbsp;&nbsp;&nbsp;&nbsp;<b>' + AwardCounts[i] + '</b> ' + Award.Name + '<br/>';
                    }
     
                    addedAward = true;
                }
            }
     
            buf += '&nbsp; <b>' + CommentCount + '</b> comments<br/>';
     
            if (!addedAward){
                buf += 'No awards configured, please click configure to set some up<br/>';
            }
     
            AwardDiv.innerHTML = buf;
     
            if (glblMode != SinglePhotoMode) {
                ToggleDisplayAwards(PhotoId, true);
            }
        }
    }
     
    function GetImageId(url) {
        url = url.substring(url.lastIndexOf('/') + 1,255);
        url = url.substring(0,url.indexOf('_'));
        return url;
    }
     
    function FindPhotoIdInElement(theElement) {
        var idAttr = theElement.attributes['data-photo-id'],
            elements,
            matches;
     
        if (idAttr) {//photo id is an attribute of the node
            return idAttr.value;
        } else {
     
            if (theElement.className && theElement.className == 'interaction-view' && theElement.firstElementChild && theElement.firstElementChild.firstElementChild && theElement.firstElementChild.firstElementChild.href) {// try new group pool page format
                //group pool page in new format, photo id is in the href attribute of the link as grand-child of the node
                return theElement.firstElementChild.firstElementChild.href.replace(/.*\/(\d+)\/.*/, "$1");
            }
        }
     
        var thisElement,
            buf,
            query,
            items = [],
            realUrl,
     
            allImgs = document.evaluate(
            ".//img",
            theElement,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
     
        for (var i = 0; i < allImgs.snapshotLength; i++) {
            thisElement = allImgs.snapshotItem(i);
     
            if (thisElement.src.match('^https?:\/\/(.*)(static\.?flickr|yimg)\.com\/(.*)\/(.*).jpg$')) {
                buf = GetImageId(thisElement.src);
                return buf;
            }
     
            if (thisElement.src.match('^https://ec.yimg.com/ec.*$')) {
                query = thisElement.src.split('?')[1].split('&');
     
                for (var j = 0; j < query.length; j++) {
                    items = query[j].split("=");
     
                    if (items[0] == 'url') {
                        realUrl = unescape(items[1]);
                        buf = GetImageId(realUrl);
                        return buf;
                    }
                }
            }
        }
     
        return '';
    }
     
    function FindGroupIdInLocation() {
    	var id = location.href.replace(/.*?\/groups\/([\w@]+)\/.*/, "$1");
    	return (id != location.href) ? id : '';
    }
     
    function GetCommentCountLink(ImageId) {
     
        if (glblMode == PoolMode) {
            return '<span id="awardcount-awardfooter"><small>( <a href="#flickrawardconfig-countshow-'+ ImageId +'" class="Plain">show awards</a> )</small>';
        } else {
            return '<span id="awardcount-awardfooter"><small>flickr Award Counter ( <a href="#flickrawardconfig-countshow-'+ ImageId +'" class="Plain">show awards</a> ) </small>';
        }
    }
     
    function AddGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
     
    function AddCommentCountLinks(xPath, into) {
     
        var context = (xPath.indexOf('message') != -1 && document.getElementsByClassName('replies')) ? document.getElementsByClassName('replies')[0] : document,
     
            allElements = document.evaluate(
            xPath,
            context,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null),
     
            ImageId,
            thisElement,
            newElement,
            buf;
     
        for (var i = 0; i < allElements.snapshotLength; i++) {
     
            thisElement = allElements.snapshotItem(i);
     
            if (thisElement.innerHTML.indexOf('flickraward-awardcount-') > -1) {
                continue;
            }
     
            ImageId = FindPhotoIdInElement(thisElement);
     
            if (ImageId != '') {
                newElement = document.createElement('div');
                newElement.setAttribute('id','flickraward-awardcount-' + ImageId);
                newElement.setAttribute('style','z-index: 9000; margin-top: 8px; text-align:left; ! important');
                newElement.setAttribute('class','flickraward');
                buf = '<span id="flickraward-awardcount-tohide" style="display:none;">';
                buf += '<span id="flickraward-awardcount-inner" class="AwardCount"></span>';
                buf += '<small>( <a href="#flickrawardconfig-counthide-' + ImageId + '" class="Plain">hide awards</a> )</small>';
                buf += '</span>' + GetCommentCountLink(ImageId);
                newElement.innerHTML = buf;
                //todo : change this to insert after poollist
                if (into) {
                    thisElement.appendChild(newElement);
                } else {
                    thisElement.parentNode.insertBefore(newElement, thisElement.nextSibling);
                }
            }
        }
    }
     
    function GetElements(node, xpath) {
     
        var allElements = document.evaluate(
            xpath,
            node,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
     
        return allElements;
    }
     
    function AddJustifiedCommentCountLinks(xPath) {
     
        var allElements = GetElements(document, xPath),
            thisElement,
            newElement,
            buf,
            height,
            width,
            imageId,
    //      groupId = FindGroupIdInLocation(),
            newPoolLayout = xPath.indexOf('interaction-view') != -1;//true if pool page is displayed in the new as opposed to classic layout
     
        for (var i = 0; i < allElements.snapshotLength; i++) {
            thisElement = allElements.snapshotItem(i);
     
            if ((thisElement.innerHTML.indexOf('flickraward-awardcount-') > -1) || (newPoolLayout && thisElement.parentElement.innerHTML.indexOf('flickraward-awardcount-') > -1)) {
                continue;
            }
     
            imageId = FindPhotoIdInElement(thisElement);
     
            if (imageId) {
                height = Math.floor(thisElement.clientHeight * 0.8);
                width = Math.floor(thisElement.clientWidth * 0.98);
                newElement = document.createElement('div');
                newElement.setAttribute('id','flickraward-awardcount-' + imageId);
                newElement.setAttribute('style','position:absolute; background-color: #ffffff; opacity:0.65; left:5px; top:10px; max-height: ' + (height + 5) + 'px; padding: 0 5px; text-align:left; z-index:100; ! important');
                newElement.setAttribute('class','flickraward');
                buf = '<div style="overflow: auto; max-width: ' + width + 'px; max-height: ' + height + 'px;"><span id="flickraward-awardcount-tohide" style="display:none;">';
                buf += '<span><small>( <a href="#flickrawardconfig-counthide-' + imageId + '" class="Plain">hide awards</a> )</small></span><br/>';
                buf += '<span id="flickraward-awardcount-inner" class="AwardCount"></span>';
                buf += '</span></div>' + GetCommentCountLink(imageId);
                newElement.innerHTML = buf;
     
                if (newPoolLayout) {
                    thisElement.parentElement.appendChild(newElement);
                } else {
                    thisElement.appendChild(newElement);
                }
            }
        }
    }
     
    function ProcessFlickrPhotoPage() {
     
        var commentsHolders,
        	discussPane = document.getElementById('DiscussPhoto'), // old layout
        	insertAfter = false;
     
        if (!discussPane) { // new layout?
            discussPane = document.getElementById('meta');
        }
     
        if (!discussPane) { // even newer layout ?
            commentsHolders = document.getElementsByClassName('sub-photo-right-row1');
     
            if (commentsHolders.length > 0) {
                discussPane = commentsHolders[0];
                insertAfter = true;
            }
        }
     
        if (discussPane) { // we know where to display awards
            CreateAwardPane(discussPane, insertAfter);
            // Get the number of images on the page
            GetAwardCounts();
        } else {
        	console.error('ProcessFlickrPhotoPage: cannot locate awards pane insertion point.');
        }
    }
     
    function ProcessFlickrGroupPage() {
        var thisElement = document.getElementById('DiscussTopic'),//classic format
            elements = [];
     
        if (!thisElement) {//new format
            elements = document.getElementsByClassName('replies');
            thisElement = (elements) ? elements[0] : null;
        }
     
        if (thisElement) {
            CreateCountAllDiv(thisElement);
     
            if (elements.length) {
                // new group format
                setTimeout(function () {
                    AddCommentCountLinks(".//div[@class='message']", true);
                }, 3000);
            } else {
                // classic group format (deprecated)
                AddCommentCountLinks("//td[@class='Said']", true);
            }
         }
    }
     
    function FindFirstElement(root, xPath) {
        var allElements = document.evaluate(
            xPath,
            root,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        var thisElement = null;
        if (allElements.snapshotLength > 0)
        {
            thisElement = allElements.snapshotItem(0);
        }
        return thisElement;
    }
     
    function CreatePoolViewErrorDiv(Parent){
        if (Parent)
        {
            var newElement = document.createElement('div');
            newElement.setAttribute('id','flickraward-errordiv');
            var buf = AwardCounter + ' ' + ConfigureLink + ' <small>( Cannot show awards in justified view, please change to a thumbnail view )</small>';
            newElement.innerHTML = buf;
            Parent.parentNode.insertBefore(newElement, Parent);
        }
    }
     
    function CreateCountAllDiv(Parent) {
     
        var newElement = document.createElement('div'),
            buf;
     
        if (Parent) {
            newElement.setAttribute('id','flickraward-awardcountall');
            buf = AwardCounter + ' ' + ConfigureLink + ' <small>( <a href="#flickrawardconfig-countallshow" class="Plain">show all awards</a> )</small>';
            newElement.innerHTML = buf;
            Parent.parentNode.insertBefore(newElement, Parent);
        }
    }
     
    function ProcessFlickrPoolPage() {
        AddGlobalStyle('.AwardCount { font-size: 11px; padding: 0px; text-align: left; ! important; }');
        AddGlobalStyle('.photo-display-item { background-color: #fff !important; }');
     
        var thisElement = FindFirstElement(document, "//div[@id='pool-photos']"); //deprecated Classic group page
     
    	if (!thisElement) {
    		thisElement = FindFirstElement(document, "//div[contains(concat(' ', normalize-space(@class), ' '), ' photo-list-view ')]");
    	}
     
        if (thisElement) {
            CreateCountAllDiv(thisElement);
        }
     
        var varElement = document.getElementById("options-thumb"); //deprecated Classic group page
     
        if (varElement && varElement.innerHTML.indexOf("Justified") > -1) { //deprecated Classic group page in justified view
     
            setInterval (function() {
                AddJustifiedCommentCountLinks("//div[contains(@class,'pool-photo photo-display-item') and not(div[class='flickraward'])]");
            }, 3000);
     
        } else if (varElement) { // //deprecated Classic group page in non justified view
     
            setInterval (function() {
                AddCommentCountLinks("//div[contains(@class,'pool-photo photo-display-item') and not(div[class='flickraward'])]",true);
            }, 3000);
     
        } else { //assume New group page in justified view
     
            setInterval (function() {
                AddJustifiedCommentCountLinks("//div[contains(@class,'interaction-view')]");
            }, 3000);
     
       }
    }
     
    function RemoveTags(theString) {
        theString = theString.replace('<', '');
        theString = theString.replace('>', '');
        return theString;
    }
     
    function ConvertTags(theString) {
        theString = theString.replace('<', '&lt;');
        theString = theString.replace('>', '&gt;');
        return theString;
    }
     
    function DateDiffDays(date1, date2) {
        var one_day = 1000 * 60 * 60 * 24;
        return Math.ceil((date1.getTime() - date2.getTime()) / one_day);
    }
     
    function ProcessUpdateInfo(updateInfo) {
     
        try {
           var obj = eval('(' + updateInfo + ')');
     
            if (obj.error) {
                alert('Update check error: ' + obj.error);
            } else {
                glblServerVersion = obj.version;
                console.log(glblServerVersion + '/' + glblVersion);
            }
     
            glblLastCheckedVersion = new Date();
     
            SaveUpdateInfo();
        } catch (e) {
            GM_log("error processing updateinfo: " + e + " - updateInfo=\"" + updateInfo + "\"");
        }
    }
     
    function CheckForUpdates() {
     
        var onLoadFunction = function(details) {
            ProcessUpdateInfo(details.responseText);
        }
     
        if (!glblUpdateCheck) {
            return;
        }
     
        var currentDate = new Date();
     
        if ((glblLastCheckedVersion != undefined) && (DateDiffDays(currentDate, glblLastCheckedVersion) < 2)) {
            return;
        }
     
        CallMethod(glblScriptVersionUrl, [], onLoadFunction);
    }
     
    function LoadCloudSettings() {
        var onLoadFunction = function(details) {
            ProcessCloudSettings(details.responseText);
        }
        var params = new Array();
        params['action'] = 'load';
        params['settingsid'] = glblCloudSettingsId;
        CallPostMethod(glblCloudSettingsUrl,params,onLoadFunction);
    }
     
    function SaveCloudSettings(){
        var onSaveFunction = function(details) {
            ProcessCloudSettings(details.responseText);
        }
        var params = new Array();
        params['action'] = 'save';
        params['settingsid'] = glblCloudSettingsId;
        params['settings'] = CreateSaveAwardStr();
        CallPostMethod(glblCloudSettingsUrl,params,onSaveFunction);
    }
     
    function EvalReturnValue(val){
        try {
            return eval('(' + val + ')');
        }
        catch (e) {
            alert("Oops! Could not parse the value returned from the webserver! \r\n" + e.name + " " + e.message + " '" + val + "'");
        }
    }
     
    function ProcessCloudSettings(cloudSettings){
        var obj = EvalReturnValue(cloudSettings);
        var msg;
        if (obj.error) {
            alert('Settings error: ' + obj.error);
            return;
        }
        if ((!obj.settingsid) || (!obj.action)) {
            alert('Settings error: Server returned invalid data');
            return;
        }
        glblCloudSettingsId = obj.settingsid;
        SaveCloudSettingsId();
        SafeSetElementValue("AwardCloudSettingsId",glblCloudSettingsId);
        if (obj.action == 'save') {
            msg = "Settings saved";
        }
        if (obj.action == 'load') {
            ParseSaveAwardStr(obj.settings);
            ConfigDisplayAwards();
            msg = "Settings loaded";
        }
        alert(msg);
    }
     
     
    // Main script
     
    function Main() {
        GM_registerMenuCommand("Configure flickrAwardCounter",EventConfigPage);
        GM_registerMenuCommand("Clear flickrAwardCounter config",EventClear);
        AddGlobalStyle('.AwardCounterButton:link, .AwardCounterButton:visited { padding: 2px 4px 2px 4px; margin: 0px; text-decoration: none; text-align: center; border: 1px solid; border-color: #aaa #000 #000 #aaa; background: #BBBBBB; ! important; }');
        AddGlobalStyle('.AwardCounterButtonSmall:link, .AwardCounterButtonSmall:visited { padding: 2px 4px 2px 4px; margin: 0px; text-decoration: none; width: 10px; text-align: center; border: 1px solid; border-color: #aaa #000 #000 #aaa; background: #BBBBBB; ! important; }');
        AddGlobalStyle('.AwardCounterButton:hover, .AwardCounterButtonSmall:hover { border-color: #000 #aaa #aaa #000; ! important; }');
        AddGlobalStyle('.AwardCount { text-align: left; ! important; }');
    	AddGlobalStyle('.noshow { display: none; ! important; }');
     
        if (glblConfigAwards == undefined) {
            Load();
        }
     
        ConfigureEvents();
     
        if (document.location.href.match('^https?:\/\/(.*)\/groups\/(.*)\/discuss(.*)$')) {
            // this is a group discussion page
            glblMode = DiscussMode;
            ProcessFlickrGroupPage();
        } else if (document.location.href.match('^https?:\/\/(.*)\/groups\/(.*)\/pool(.*)$')) {
            // this is a group pool page
            glblMode = PoolMode;
            ProcessFlickrPoolPage();
        } else {
            // this is a photo page
            glblMode = SinglePhotoMode;
            ProcessFlickrPhotoPage();
        }
     
    	CheckForUpdates();
    }
     
    Main();

