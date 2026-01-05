// ==UserScript==
// @name        NGU SBMod
// @namespace   http://www.nextgenupdate.com
// @description Shoutbox plugin that adds several features
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/infernoshout\.php\?do=detach$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums\/(forumhome|index)\.php$/
// @include     /^https?:\/\/www\.nextgenupdate\.com\/forums.?.?$/
// @version     1.81
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21066/NGU%20SBMod.user.js
// @updateURL https://update.greasyfork.org/scripts/21066/NGU%20SBMod.meta.js
// ==/UserScript==

$.getScript('http://cammy.me/ngu/puggles.js')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// variables / arrays / data                                                                                                                                 //////


var saveshouts = 0;
var happyHourBG = 'http://f.cl.ly/items/2x2u1r2w372V0m3G2o3Y/rain.gif';
var happyHourText = 'HAPPY HOUR';
var happyHourTextColor = 'rgba(255,255,255,1.0)';
var sbm_smilies_hidden = {
	":mario:": "http://www.nextgenupdate.com/forums/images/mario.gif",
	":trolldad:": "images/smilies/trolldad.png",
	":ca:": "http://www.nextgenupdate.com/forums/images/smilies/challengeaccepted.jpg",
	":okay:": "images/smilies/okay.png",
	":fa:": "images/smilies/ForeverAlone.png",
	":lol:": "images/smilies/LOLguy.png",
	":carling:": "http://www.nextgenupdate.com/forums/images/smilies/troll.gif",
	":boss:": "http://www.nextgenupdate.com/forums/images/smilies/memes/likeaboss.jpg",
	":yds:": "images/smilies/u%20dont%20say.png",
	":fyea:": "images/smilies/memes/fyea.png",
	"yuno": "images/smilies/memes/yuno.png",
	":dumb:": "http://www.nextgenupdate.com/forums/images/smilies/memes/Dumb.png",
	"=Z": "http://www.nextgenupdate.com/forums/images/smilies/Z=.jpg",
	":megusta:": "images/smilies/memes/Megusta.png",
	":ohgodwhy:": "http://www.nextgenupdate.com/forums/images/smilies/memes/oh-god-why1.jpg",
	":|": "http://www.nextgenupdate.com/forums/images/smilies/pokerfacee.jpg",
	":ha!:": "http://www.nextgenupdate.com/forums/images/smilies/memes/meme-aww.jpg",
	":FU:": "http://www.nextgenupdate.com/forums/images/smilies/FFFFFUUU.gif",
	":blank:": "http://www.nextgenupdate.com/forums/images/smilies/memes/vish.jpg",
	"^^": "http://www.nextgenupdate.com/forums/images/smilies/memes/%5E%5E.jpg",
	":think:": "http://www.nextgenupdate.com/forums/images/smilies/memes/=.jpg",
	":satisfied:": "http://www.nextgenupdate.com/forums/images/smilies/memes/download.jpg",
	":happyguy:": "http://www.nextgenupdate.com/forums/images/smilies/memes//(=.jpg",
	":happycry:": "http://www.nextgenupdate.com/forums/images/smilies/HappyCry.png",
	"D:>": "http://www.nextgenupdate.com/forums/images/smilies/memes/D=.jpg",
	"<:D": "http://www.nextgenupdate.com/forums/images/smilies/=D.jpg",
	">:<": "http://www.nextgenupdate.com/forums/images/smilies/memes/=SS.jpg"
};
var sbm_smilies_elite = {
	":wtf:": "images/smilies/wtf.gif",
	";D": "images/smilies/wink2.png",
	":nyan:": "images/smilies/nyan.gif",
	":banhamma:": "images/smilies/banhamma.gif",
	":run:": "images/smilies/troll_run.gif",
	":slowpoke:": "images/smilies/slowpoke.png",
	":fah:": "images/smilies/fah.png",
	":alpaca:": "images/smilies/alpaca1.gif",
	":mudkip:": "images/smilies/Mudkip.png",
	":dunce:": "images/smilies/new%202/sFun_dunce.gif",
	":hug:": "images/smilies/newset1/saril.gif",
	":luv:": "images/smilies/newset1/asik.gif",
	":monkey:": "images/smilies/monkey.gif",
	":dance:": "images/smilies/badger.gif",
	":drink:": "images/smilies/drink.gif",
	":dealwiththeobscurename:": "images/smilies/deal.gif",
	":walt:": "images/heisenberg.png",
    ":nope:": "images/nope.png"
};
var sbm_smilies_weed = {
	":high:": "images/smilies/weed1.gif",
	":higher:": "images/smilies/weed2.gif",
	":ripped:": "images/smilies/weed3.gif",
	":blazed:": "images/smilies/weed4.gif",
	":puffpuffpass:": "http://www.nextgenupdate.com/forums/images/smilies/weed5.gif",
	":bongrip:": "http://www.nextgenupdate.com/forums/images/smilies/weed6.gif",
	":bongripped:": "images/smilies/weed7.jpg",
	":carlaang:": "images/smilies/weed8.png",
	":enzooo:": "images/smilies/weed9.png",
	":reaperrr:": "images/smilies/weed10.png",
	":yunosmoke:": "images/smilies/weed11.gif",
	":outieee:": "images/smilies/weed12.png",
	":drackosss:": "images/smilies/weed13.png"
};
//////// end of variables / arrays / data                                                                                                                          //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// local storage functions - edited functions taken from https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js                          //////

function sbm_addStyle(aCss)
{
	'use strict';
	var head = document.getElementsByTagName('head')[0];
	if (head)
	{
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.textContent = aCss;
		head.appendChild(style);
		return style;
	}
	return null;
}

function sbm_deleteValue(aKey)
{
	'use strict';
	localStorage.removeItem('ngu_sbmod_' + aKey);
}

function sbm_getValue(aKey, aDefault)
{
	'use strict';
	var val = localStorage.getItem('ngu_sbmod_' + aKey);
	if (null === val && 'undefined' != typeof aDefault)
	{
		return aDefault;
	}
	return val;
}

function sbm_setValue(aKey, aVal)
{
	'use strict';
	localStorage.setItem('ngu_sbmod_' + aKey, aVal);
}

//////// end of local storage functions                                                                                                                            //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// misc functions                                                                                                                                            //////

// shout function
function jsShout(message)
{
	//iboxoshouts.set_loader('');
	iboxoshouts.shout.ajax = new vB_AJAX_Handler(true);
	iboxoshouts.shout.ajax.onreadystatechange(InfernoShoutboxControl.shout_posted);
	iboxoshouts.shout.ajax.send('infernoshout.php', 'do=shout&message='+message);
	//iboxoshouts.clear();
}

function numberWithCommas(x)// http://stackoverflow.com/a/2901298
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// return username and userid from the onclick attribute
function userDetailsFromOnclick(input)
{
    // input string will look like this:
    // return InfernoShoutboxControl.open_pm_tab('pm_1234', 'User with ID 1234');
    //
    // so first remove this from the beginning:
    // return InfernoShoutboxControl.open_pm_tab('pm_
    //
    // then remove this from the end:
    // ');
    //
    // then split on this:
    //  ', '
    //
    // then put it all on one line and return it, this should work for any user, except one that has ', ' in the username
    // if it's not obvious, this returns an array
    return input.replace('return InfernoShoutboxControl.open_pm_tab(\'pm_', '').replace('\');', '').split('\', \'',2);
}

// return userid from profile link
function userIdFromHref(input)
{
    var input2 = input.split("=",2);
    return input2[1];
}

function getUserPrefixImages(e)
{
    var o = [];
    var c = 0;
    var nodes = e.parentNode.childNodes;
    for (var i = 0; i < nodes.length; i++)
    {
        if (nodes[i] == e)
        {
            break;
        }
        else if (nodes[i].tagName == "IMG")
        {
            o[c] = nodes[i].getAttribute('src');
            c++;
        }
        else if (nodes[i].tagName == "A")
        {
            var cnodes = nodes[i].childNodes;
            for (var j = 0; j < cnodes.length; j++)
            {
                if (cnodes[j].tagName == "IMG")
                {
                    o[c] = cnodes[j].getAttribute('src');
                    c++;
                }
            }
        }
    }
    if (c === 0)
    {
        return null;
    }
    else
    {
        return o;
    }
}

function findUserElement(e)
{
    while (e.parentNode)
    {
        if (e.tagName == "A")
        {
            var h = e.getAttribute('href');
            if (h == '#' || h.indexOf('member.php?u=') > -1)
            {
                return e;
            }
        }
        e = e.parentNode;
    }
    return null;
}

// enable or disable happyhour css (seperate function so it can be called on startup)
function doHappyHourCSS(enable)
{
    if (enable)
        sbm_addStyle('div [style="padding-top: 1px; padding-bottom: 1px;"]>.hidden-phone{display: none !important;}div [style="padding-top: 1px; padding-bottom: 1px;"]:before{content: "'+happyHourText+'" !important;white-space: pre !important;color: '+happyHourTextColor+' !important;padding-left: 2px !important;padding-right: 2px !important;background-image: url("'+happyHourBG+'") !important;font-weight: bold !important}');
    else
        sbm_addStyle('div [style="padding-top: 1px; padding-bottom: 1px;"]>.hidden-phone{display: initial !important;}div [style="padding-top: 1px; padding-bottom: 1px;"]:before{content: none !important;white-space: none !important;color: none !important;padding-left: none !important;padding-right: none !important;background-image: none !important;font-weight: none !important}');
}

// set idle timeout
function setIdletime(time)
{
    InfernoShoutboxControl.idletimelimit = time;
	sbm_setValue("int_idletimelimit",time);
	if (time == -1)
	{
		document.getElementById("sbm_dropdown_idletimelimit").innerHTML = 'Set Idletime (disabled)';
		iboxoshouts.show_notice('Idle timeout disabled');
	}
	else
	{
		document.getElementById("sbm_dropdown_idletimelimit").innerHTML = 'Set Idletime ('+time+')';
		iboxoshouts.show_notice('Idle timeout set to '+time+' seconds');
	}
}

// js prompt for idle timeout
function promptIdletime()
{
    var newIdletime = prompt("Enter idle timeout in seconds (-1 disables)",InfernoShoutboxControl.idletimelimit);
    if (newIdletime)
    {
        setIdletime(newIdletime);
    }
}

//////// end of misc functions                                                                                                                                     //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// dropdown menu functions                                                                                                                                   //////

function dropdownToggleItemText(varName,itemtext)
{
    if (sbm_getValue(varName) == "enabled")
    {
		return '☒ ' + itemtext;
    }
    else
    {
		return '☐ ' + itemtext;
    }
}

function toggle_var_and_update_dropdown_element(varName,element_id,element_text)
{
	if (sbm_getValue(varName) == "enabled")
	{
		iboxoshouts.show_notice(element_text + ' Disabled');
		sbm_setValue(varName,"disabled");
	}
	else
	{
		iboxoshouts.show_notice(element_text + ' Enabled');
		sbm_setValue(varName,"enabled");
	}
	document.getElementById(element_id).innerHTML = dropdownToggleItemText(varName,element_text);
}

function toggle_var_only(varName, extraText)
{
	if (sbm_getValue(varName) == "enabled")
	{
		iboxoshouts.show_notice(extraText + ' Disabled');
		sbm_setValue(varName,"disabled");
	}
	else
	{
		iboxoshouts.show_notice(extraText + ' Enabled');
		sbm_setValue(varName,"enabled");
	}
}

function addOptionsDropdownItems()
{
    var newsbOptionsDropdown = '<li><a id="sbm_dropdown_idletimelimit" style="cursor: pointer;">Set Idletime ('+sbm_getValue("int_idletimelimit")+')</a></li>';
	newsbOptionsDropdown += '<li><a id="sbm_dropdown_happyhour" style="cursor: pointer;">'+dropdownToggleItemText("bool_happyhour","Happy Hour")+'</a></li>';
	newsbOptionsDropdown += '<li><a id="sbm_dropdown_smilies_hidden" style="cursor: pointer;">'+dropdownToggleItemText("bool_smilies_hidden","Hidden Smilies")+'</a></li>';
	newsbOptionsDropdown += '<li><a id="sbm_dropdown_smilies_elite" style="cursor: pointer;">'+dropdownToggleItemText("bool_smilies_elite","Elite Smilies")+'</a></li>';
	newsbOptionsDropdown += '<li><a id="sbm_dropdown_smilies_weed" style="cursor: pointer;">'+dropdownToggleItemText("bool_smilies_weed","Weed Smilies")+'</a></li>';
	newsbOptionsDropdown += '<li><a id="sbm_dropdown_smilies_fake" style="cursor: pointer;">'+dropdownToggleItemText("bool_smilies_fake","Fake Smilies")+'</a></li>';
	newsbOptionsDropdown += '<li><div style="width: 100%; height: 1px; border: 0; background-color: rgba(128,128,128,0.8); margin-top: 0; margin-bottom: 0;"></div></li>';

	// get the default dropdown menu element
	var sbOptionsDropdown = document.getElementsByClassName("shoutbox_dropdown_s");

	// append html with new menu items
	sbOptionsDropdown[0].innerHTML += newsbOptionsDropdown;

	// add click event listeners
	document.getElementById('sbm_dropdown_idletimelimit').addEventListener("click",function(){
		var newIdletime = prompt("Enter idle timeout in seconds (-1 disables)",InfernoShoutboxControl.idletimelimit);
		if (newIdletime)
		{
			setIdletime(newIdletime);
		}
	});
	document.getElementById('sbm_dropdown_happyhour').addEventListener('click',function(){
		toggle_var_and_update_dropdown_element("bool_happyhour","sbm_dropdown_happyhour","Happy Hour");
        if (sbm_getValue("bool_happyhour") == "enabled")
		{
			doHappyHourCSS(true);
		}
		else
		{
			doHappyHourCSS(false);
		}
    });
	document.getElementById('sbm_dropdown_smilies_hidden').addEventListener('click',function(){
		toggle_var_and_update_dropdown_element("bool_smilies_hidden","sbm_dropdown_smilies_hidden","Hidden Smilies");
    });
	document.getElementById('sbm_dropdown_smilies_elite').addEventListener('click',function(){
		toggle_var_and_update_dropdown_element("bool_smilies_elite","sbm_dropdown_smilies_elite","Elite Smilies");
    });
	document.getElementById('sbm_dropdown_smilies_weed').addEventListener('click',function(){
		toggle_var_and_update_dropdown_element("bool_smilies_weed","sbm_dropdown_smilies_weed","Weed Smilies");
    });
	document.getElementById('sbm_dropdown_smilies_fake').addEventListener('click',function(){
		toggle_var_and_update_dropdown_element("bool_smilies_fake","sbm_dropdown_smilies_fake","Fake Smilies");
    });
    
    var sbMenuLinks = JSON.parse(sbm_getValue("json_quicklinks"));

	// loop through the object of links and create / config / add elements
	for(var i in sbMenuLinks)
	{
	    // create li
	    var menuLi = document.createElement("li");
	    // create a
	    var menuA = document.createElement("a");
	    // set a style="cursor: pointer;"
	    menuA.style.cursor = "pointer";
	    // set a href to the link in the object
	    menuA.href = sbMenuLinks[i];
	    // set target to open in new tab
	    menuA.target = '_blank';
	    // create text for link from the object
	    menuText = document.createTextNode(i);
	    // append the created a element with the link text
	    menuA.appendChild(menuText);
	    // append the created li element with the created a element
	    menuLi.appendChild(menuA);
	    // append the dropdown menu with the final element
	    sbOptionsDropdown[0].appendChild(menuLi);
	}
}

//////// end of dropdown menu functions                                                                                                                            //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// settings popup functions                                                                                                                                  //////

function addToSettings_Smilies()
{
    // get object from storage
    var oSmil = JSON.parse(sbm_getValue("json_smilies_fake"));
    
    // get the target element
    var sbOpts = document.getElementById("ngusb-options");
    
    if (!document.getElementById("sbm_settings_tab_fakesmilies"))// check if tab has already been created
    {
        // create the new tab
    	var sbm_jsv_tab_fakesmilies = document.createElement("li");
    	sbm_jsv_tab_fakesmilies.id = 'sbm_settings_tab_fakesmilies';
    	sbm_jsv_tab_fakesmilies.innerHTML = '<a href="#sbm_settings_content_fakesmilies" data-toggle="tab">Fake Smilies</a>';
        
        // append the new tab to the target element
    	sbOpts.childNodes[3].childNodes[1].appendChild(sbm_jsv_tab_fakesmilies);
    }
    
    if (!document.getElementById("sbm_settings_content_fakesmilies"))// check if content element has already been created
    {
        // content doesn't exist - create new content element
    	var sbm_jsv_content_fakesmilies = document.createElement("div");
    	sbm_jsv_content_fakesmilies.className = 'tab-pane';
    	sbm_jsv_content_fakesmilies.id = 'sbm_settings_content_fakesmilies';
    	sbm_jsv_content_fakesmilies.style.maxHeight = '300px';
    }
    else
    {
        // content exists - just get the content element so it can be updated
        var sbm_jsv_content_fakesmilies = document.getElementById("sbm_settings_content_fakesmilies");
    }
    
    // a whole bunch of html to make / update the content
    var sbm_jsv_content_innerhtml_fakesmilies = '<div class="form-horizontal"><b>Existing Smilies</b> (leave any field blank to delete)<br><br>';
    
    // loop through object and add row(s) of pre-filled elements using stored data
    for(var z in oSmil)
	{
		sbm_jsv_content_innerhtml_fakesmilies += '<div class="row">';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_fakesmilies += '<label class="control-label" for="code" style="width: 30px;">Code:</label>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="controls">';
        sbm_jsv_content_innerhtml_fakesmilies += '<input class="span2" type="text" size="50" id="code" name="smilies[code][]" value="'+z+'" style="width: 80px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_fakesmilies += '<label class="control-label" for="url" style="width: 30px;">Url:</label>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="controls">';
        sbm_jsv_content_innerhtml_fakesmilies += '<input class="span2" type="text" size="50" id="url" name="smilies[url][]" value="'+oSmil[z]+'" style="width: 360px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
	}
    
    // more html
	sbm_jsv_content_innerhtml_fakesmilies += '<b>Add New Smilies</b><br><br>';
    
    // add some row(s) of empty fields for additions
    for(var h = 0; h < 2; h++)
    {
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="row">';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_fakesmilies += '<label class="control-label" for="code" style="width: 30px;">Code:</label>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="controls">';
        sbm_jsv_content_innerhtml_fakesmilies += '<input type="text" size="50" id="code" name="smilies[code][]" value="" style="width: 80px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_fakesmilies += '<label class="control-label" for="url" style="width: 30px;">Url:</label>';
        sbm_jsv_content_innerhtml_fakesmilies += '<div class="controls">';
        sbm_jsv_content_innerhtml_fakesmilies += '<input type="text" size="50" id="url" name="smilies[url][]" value="" style="width: 360px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
        sbm_jsv_content_innerhtml_fakesmilies += '</div>';
    }
    
    // end of html
	sbm_jsv_content_innerhtml_fakesmilies += '<input value="Save Settings" type="submit" class="btn btn-primary" id="sbm_settings_save_fakesmilies"></div>';
    
    // set the html of the content element
	sbm_jsv_content_fakesmilies.innerHTML = sbm_jsv_content_innerhtml_fakesmilies;
    
    if (!document.getElementById("sbm_settings_content_fakesmilies"))// check if content element has already been created
    {
        // content doesn't exist - append the tab content to the target element
    	sbOpts.childNodes[3].childNodes[3].appendChild(sbm_jsv_content_fakesmilies);
    }
    
    // add event listener for the save button
    document.getElementById('sbm_settings_save_fakesmilies').addEventListener('click',function(){
		var fakeSmilRows = document.getElementById("sbm_settings_content_fakesmilies").getElementsByClassName("row");
    	var fakeSmilObj = {};
    	for (var e in fakeSmilRows)
    	{
	        if (fakeSmilRows[e].firstChild)
	        {
	            var smilCode = fakeSmilRows[e].childNodes[0].childNodes[1].firstChild.value;
	            var smilUrl = fakeSmilRows[e].childNodes[1].childNodes[1].firstChild.value;
	            if (smilCode && smilUrl)
	            {
	                fakeSmilObj[smilCode] = smilUrl;
	            }
	        }
	    }
	    sbm_setValue("json_smilies_fake",JSON.stringify(fakeSmilObj));
	    console.log('NGU SBMod > Fake Smilies updated - JSON: ' + sbm_getValue("json_smilies_fake"));
	    addToSettings_Smilies();
    });
}

function addToSettings_QuickLinks()
{
    // get object from storage
    var sbm_quicklinks = JSON.parse(sbm_getValue("json_quicklinks"));
    
    // get the target element
    var sbOpts = document.getElementById("ngusb-options");
    
    if (!document.getElementById("sbm_settings_tab_quicklinks"))// check if tab has already been created
    {
        // create the new tab
    	var sbm_jsv_tab_quicklinks = document.createElement("li");
    	sbm_jsv_tab_quicklinks.id = 'sbm_settings_tab_quicklinks';
    	sbm_jsv_tab_quicklinks.innerHTML = '<a href="#sbm_settings_content_quicklinks" data-toggle="tab">Quick Links</a>';
        
        // append the new tab to the target element
    	sbOpts.childNodes[3].childNodes[1].appendChild(sbm_jsv_tab_quicklinks);
    }
    
    if (!document.getElementById("sbm_settings_content_quicklinks"))// check if content element has already been created
    {
        // content doesn't exist - create new content element
    	var sbm_jsv_content_quicklinks = document.createElement("div");
    	sbm_jsv_content_quicklinks.className = 'tab-pane';
    	sbm_jsv_content_quicklinks.id = 'sbm_settings_content_quicklinks';
    	sbm_jsv_content_quicklinks.style.maxHeight = '300px';
    }
    else
    {
        // content exists - just get the content element so it can be updated
        var sbm_jsv_content_quicklinks = document.getElementById("sbm_settings_content_quicklinks");
    }
    
    // a whole bunch of html to make / update the content
	var sbm_jsv_content_innerhtml_quicklinks = '<div class="form-horizontal"><b>Existing Quick Links</b> (leave any field blank to delete)<br><br>';
    
    // loop through object and add row(s) of pre-filled elements using stored data
    for(var z in sbm_quicklinks)
	{
        sbm_jsv_content_innerhtml_quicklinks += '<div class="row">';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_quicklinks += '<label class="control-label" style="width: 30px;">Text:</label>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="controls">';
        sbm_jsv_content_innerhtml_quicklinks += '<input type="text" size="50" name="links[text][]" value="'+z+'" style="width: 80px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_quicklinks += '<label class="control-label" style="width: 30px;">Url:</label>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="controls">';
        sbm_jsv_content_innerhtml_quicklinks += '<input type="text" size="50" name="links[url][]" value="'+sbm_quicklinks[z]+'" style="width: 360px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
	}
    
    // more html
	sbm_jsv_content_innerhtml_quicklinks += '<b>Add New Quick Links</b><br><br>';
    
    // add some row(s) of empty fields for additions
    for(var h = 0; h < 2; h++)
    {
        sbm_jsv_content_innerhtml_quicklinks += '<div class="row">';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_quicklinks += '<label class="control-label" style="width: 30px;">Text:</label>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="controls">';
        sbm_jsv_content_innerhtml_quicklinks += '<input type="text" size="50" name="links[text][]" value="" style="width: 80px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="control-group span2">';
        sbm_jsv_content_innerhtml_quicklinks += '<label class="control-label" style="width: 30px;">Url:</label>';
        sbm_jsv_content_innerhtml_quicklinks += '<div class="controls">';
        sbm_jsv_content_innerhtml_quicklinks += '<input type="text" size="50" name="links[url][]" value="" style="width: 360px; margin-left: -120px;">';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
        sbm_jsv_content_innerhtml_quicklinks += '</div>';
    }
    
    // end of html
	sbm_jsv_content_innerhtml_quicklinks += '<input value="Save Settings" type="submit" class="btn btn-primary" id="sbm_settings_save_quicklinks"></div>';
    
    // set the html of the content element
	sbm_jsv_content_quicklinks.innerHTML = sbm_jsv_content_innerhtml_quicklinks;
    
    if (!document.getElementById("sbm_settings_content_quicklinks"))// check if content element has already been created
    {
        // content doesn't exist - append the tab content to the target element
    	sbOpts.childNodes[3].childNodes[3].appendChild(sbm_jsv_content_quicklinks);
    }
    
    // add event listener for the save button
    document.getElementById('sbm_settings_save_quicklinks').addEventListener('click',function(){
	    var quickLinkRows = document.getElementById("sbm_settings_content_quicklinks").getElementsByClassName("row");
	    var quickLinkObj = {};
	    for (var e in quickLinkRows)
	    {
	        if (quickLinkRows[e].firstChild)
	        {
	            var linkText = quickLinkRows[e].childNodes[0].childNodes[1].firstChild.value;
	            var linkUrl = quickLinkRows[e].childNodes[1].childNodes[1].firstChild.value;
	            if (linkText && linkUrl)
	            {
	                quickLinkObj[linkText] = linkUrl;
	            }
	        }
	    }
	    sbm_setValue("json_quicklinks",JSON.stringify(quickLinkObj));
	    console.log('NGU SBMod > Quick Links updated - JSON: ' + sbm_getValue("json_quicklinks"));
	    addToSettings_QuickLinks();
	    addOptionsDropdownItems();
	});
}

//////// end of settings popup functions                                                                                                                           //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// context menu functions                                                                                                                                    //////

function removeMenu()
{
    // delete the context menu if it exists
	var contextmenu = document.getElementById("sbm_contextmenu");
	if (contextmenu)
	{
		contextmenu.parentNode.removeChild(contextmenu);
	}
}

function rcMenuIgnore(uid,uname,ignore)
{
    if (ignore)
    {
    	jsShout('/ignore ' + uid);
    }
    else
    {
        jsShout('/unignore ' + uid);
    }
}

function rightClickMenu(uid, uname, uelem)
{
    var elem = document.getElementById('sbm_contextmenu');
    if (elem)
    {
        elem.parentNode.removeChild(elem);
    }

	var rcMenuUl = document.createElement("ul");
	rcMenuUl.className = "dropdown-menu";
	rcMenuUl.style.display = "none";
	rcMenuUl.id = "sbm_contextmenu";
    
    var rcMenuLi = document.createElement("li");
    rcMenuLi.innerHTML = '<a href="http://www.nextgenupdate.com/forums/member.php?u=' + uid + '" target="_blank" title="' + numberWithCommas(uid) + '">' + uelem + '</a>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
    rcMenuLi.innerHTML = '<div style="width: 100%; height: 1px; border: 0; background-color: rgba(128,128,128,0.8); margin-top: 0; margin-bottom: 0;"></div>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
    rcMenuLi.innerHTML = '<a href="#" onclick="return InfernoShoutboxControl.open_pm_tab(\'pm_'+uid+'\', \''+uname+'\');"><img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/message.png"> Open SBPM</a>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
	rcMenuLi.innerHTML = '<a href="http://www.nextgenupdate.com/forums/search.php?do=finduser&userid='+uid+'&contenttype=vBForum_Post&showposts=1" target="_blank"><img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/forum.png"> Find latest posts</a>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
	rcMenuLi.innerHTML = '<a href="http://www.nextgenupdate.com/forums/search.php?do=finduser&userid='+uid+'&starteronly=1&contenttype=vBForum_Thread" target="_blank"><img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/forum.png"> Find latest started threads</a>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
	rcMenuLi.innerHTML = '<a href="http://www.nextgenupdate.com/forums/private.php?do=newpm&u=' + uid + '" target="_blank"><img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/message.png"> Send forum PM</a>';
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
	var rcMenuA = document.createElement("a");
	rcMenuA.style.cursor = 'pointer';
	rcMenuA.addEventListener('click',function(){rcMenuIgnore(uid,uname,true);});
    rcMenuA.innerHTML = '<img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/ignore.png"> Ignore ' + uelem;
	rcMenuLi.appendChild(rcMenuA);
	rcMenuUl.appendChild(rcMenuLi);
    
    var rcMenuLi = document.createElement("li");
	var rcMenuA = document.createElement("a");
	rcMenuA.style.cursor = 'pointer';
	rcMenuA.addEventListener('click',function(){rcMenuIgnore(uid,uname,false);});
    rcMenuA.innerHTML = '<img class="icon" src="http://www.nextgenupdate.com/forums/images/site_icons/markasread.png"> Unignore ' + uelem;
	rcMenuLi.appendChild(rcMenuA);
	rcMenuUl.appendChild(rcMenuLi);

    document.getElementsByClassName('shoutbox_body')[0].appendChild(rcMenuUl);
}

function contextMenuLogic(e)
{
	e = e || window.event;
   	var target = e.target || e.srcElement;
    var userElem = findUserElement(target);
    var userElemInner, userDetails, shoutImages;
    
    if (userElem)
    {
        userElemInner = userElem.innerHTML;
        if (userElem.parentNode.parentNode.parentNode.id == 'shoutbox_users_frame')
        {
            userDetails = [userIdFromHref(userElem.getAttribute('href')),target.innerHTML];
        }
        else
        {
            userDetails = userDetailsFromOnclick(userElem.getAttribute('onclick'));
            shoutImages = getUserPrefixImages(userElem);
        }
        if (shoutImages)
        {
			for (var i = 0; i < shoutImages.length; i++)
			{
				userElemInner = '<img src="' + shoutImages[i] + '"> ' + userElemInner;
			}
        }
        rightClickMenu(userDetails[0], userDetails[1], userElemInner);
        e.preventDefault();
    }
    else
    {
        return;
    }
    
    // get position of click - shifted by 20px on each axis, adjust as necessary
    var posx = e.clientX + window.pageXOffset + 20 + 'px';
	var posy = e.clientY + window.pageYOffset + 20 + 'px';
    
    // set style of menu
	document.getElementById("sbm_contextmenu").style.position = 'absolute';
	document.getElementById("sbm_contextmenu").style.display = 'inline';
	document.getElementById("sbm_contextmenu").style.left = posx;
	document.getElementById("sbm_contextmenu").style.top = posy;
}

//////// end of context menu functions                                                                                                                             //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// main script                                                                                                                                               //////

// local storage checks
if (sbm_getValue("bool_happyhour") === undefined)
{
	sbm_setValue("bool_happyhour", "disabled");
    console.log('NGU SBMod > bool_happyhour was undefined - set to false');
}
if (sbm_getValue("bool_smilies_hidden") === undefined)
{
	sbm_setValue("bool_smilies_hidden", "disabled");
    console.log('NGU SBMod > bool_smilies_hidden was undefined - set to false');
}
if (sbm_getValue("bool_smilies_elite") === undefined)
{
	sbm_setValue("bool_smilies_elite", "disabled");
    console.log('NGU SBMod > bool_smilies_elite was undefined - set to false');
}
if (sbm_getValue("bool_smilies_weed") === undefined)
{
	sbm_setValue("bool_smilies_weed", "disabled");
    console.log('NGU SBMod > bool_smilies_weed was undefined - set to false');
}
if (sbm_getValue("bool_smilies_fake") === undefined)
{
	sbm_setValue("bool_smilies_fake", "disabled");
    console.log('NGU SBMod > bool_smilies_fake was undefined - set to false');
}
if (sbm_getValue("int_idletimelimit") === undefined)
{
	sbm_setValue("int_idletimelimit",InfernoShoutboxControl.idletimelimit);
    console.log('NGU SBMod > int_idletimelimit was undefined - set to forum default ('+InfernoShoutboxControl.idletimelimit+')');
}
if (sbm_getValue("json_smilies_fake") === undefined)
{
	sbm_setValue("json_smilies_fake",'{":housox:":"http://www.nextgenupdate.com/forums/images/smilies/housox.gif",":fap:":"http://www.nextgenupdate.com/forums/images/smilies/fap.gif"}');
    console.log('NGU SBMod > json_smilies_fake was undefined - example string used (2 smilies)');
}
if (sbm_getValue("json_quicklinks") === undefined)
{
	sbm_setValue("json_quicklinks",'{"> Inbox":"http://www.nextgenupdate.com/forums/private.php","> Control Panel":"http://www.nextgenupdate.com/forums/usercp.php"}');
    console.log('NGU SBMod > json_quicklinks was undefined - example string used (2 links)');
}

// context menu event listener
document.addEventListener('contextmenu', function(e){contextMenuLogic(e);}, false);

// click event listener
document.addEventListener('click', function(event)
{
	event = event || window.event;
   	var target = event.target || event.srcElement;
        
    // delete the context menu if it exists
	var contextmenu = document.getElementById("sbm_contextmenu");
	if (contextmenu)
	{
		contextmenu.parentNode.removeChild(contextmenu);
	}
    
	if (target.getAttribute('id') == 'killspam')
	{
		clearInterval(leSBSpam);
        iboxoshouts.show_notice('spam cancelled');
	}
});

// add tab(s) to settings popup
addToSettings_Smilies();
addToSettings_QuickLinks();

// set happy hour css on/off based on stored var
if (sbm_getValue("bool_happyhour") == "enabled")
{
	doHappyHourCSS(true);
}
else
{
	doHappyHourCSS(false);
}

// set idle timeout based on stored var
InfernoShoutboxControl.idletimelimit = sbm_getValue("int_idletimelimit");

// add items to options dropdown menu
addOptionsDropdownItems();

// sb options tweaks
document.getElementById("ngusb-options").style.width = "700px";
document.getElementById("ngusb-general").firstChild.style.width = "670px";
document.getElementById("ngusb-general").firstChild.style.height = "300px";
document.getElementById("ngusb-commands").firstChild.style.width = "670px";
document.getElementById("ngusb-commands").firstChild.style.height = "300px";
document.getElementById("ngusb-ignore").firstChild.style.width = "670px";
document.getElementById("ngusb-ignore").firstChild.style.height = "300px";
sbm_addStyle('.bootstrap .nav-tabs > li > a{padding-top: 0 !important;padding-bottom: 0 !important;padding-right: 6px !important;padding-left: 6px !important;font-size: 12px !important;}');

//////// end of main script                                                                                                                                        //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// edited inferno functions taken from http://www.nextgenupdate.com/forums/infernoshout/browser/infernojs.js?ver=2.5.2                                       //////

// rewrite of the shout function to enable !commands
iboxoshouts.new_shout = function()
{
	if (iboxoshouts.posting_shout)
	{
		iboxoshouts.show_notice('A previous message is still being submitted.');
		return false;
	}
	if (iboxoshouts.idle)
	{
		iboxoshouts.hide_notice();
	}
	iboxoshouts.idle = false;
	iboxoshouts.idletime = 0;
	message = PHP.trim(iboxoshouts.editor.value);
    if (message == '!cmd')
    {
        var cmdnotice = 'commands: [<a href="javascript:void(0);" OnClick="return InfernoShoutboxControl.hide_notice();">X</a>]<br>';
        cmdnotice += '!cmd - shows commands<br>';
        cmdnotice += '!happy - toggles happy hour<br>';
        cmdnotice += '!idle,(int) - set idle timeout in seconds - use !idle,-1 to disable<br>';
        cmdnotice += '!goidle - go idle right away<br>';
        cmdnotice += '!spam|(number of messages)|message - will get you banned';
        InfernoShoutboxControl.show_notice(cmdnotice);
        clearTimeout(InfernoShoutboxControl.kill_notice);
        iboxoshouts.editor.value = '';
    	return false;
    }
    else if (message.substring(0, 5) == '!idle')
    {
        iboxoshouts.editor.value = '';
        var idleCmd = message.split(",",2);
        if (isNaN(idleCmd[1]))
        {
            iboxoshouts.show_notice(idleCmd[1]+' is not a number. Try !idle,-1');
        }
        else
        {
            setIdletime(idleCmd[1]);
        }
        return false;
    }
    else if (message == '!goidle')
    {
        iboxoshouts.editor.value = '';
        iboxoshouts.idle = true;
        return false;
    }
    else if (message.substring(0, 5) == '!spam')
    {
        iboxoshouts.editor.value = '';
        var spamCmd = message.split("|",3);
        if (isNaN(spamCmd[1]))
        {
            iboxoshouts.show_notice(spamCmd[1]+' is not a number!');
        }
        else
        {
            var sbSpamTime = (iboxoshouts.floodtime * 1000) + 100;
			var number2 = 0;
			iboxoshouts.show_notice('Spamming "'+spamCmd[2]+'" <b class="highlight">'+spamCmd[1]+'</b> times, <a style="cursor: pointer;" id="killspam">click here</a> to cancel...');
			leSBSpam = setInterval(function ()
            {
				number2++;
				if (number2 > spamCmd[1])
                {
					return false;
				}
				jsShout(spamCmd[2]);
				shoutsleft = spamCmd[1] - number2;
				if (shoutsleft > 0)
                {
					iboxoshouts.show_notice('<b class="highlight">'+shoutsleft+'</b> shouts left to spam, <a style="cursor: pointer;" id="killspam">click here</a> to cancel...');
				}
                else
                {
					iboxoshouts.show_notice('Spam finished');
				}
			}, sbSpamTime);
        }
        return false;
    }
    else if (message == '!happy')
    {
		toggle_var_and_update_dropdown_element("bool_happyhour","sbm_dropdown_happyhour","Happy Hour");
		if (sbm_getValue("bool_happyhour") == "enabled")
		{
			doHappyHourCSS(true);
		}
		else
		{
			doHappyHourCSS(false);
		}
        iboxoshouts.editor.value = '';
        return false;
    }
    else
    {
		if (message === '')
		{
			iboxoshouts.show_notice('Please enter a message first.');
			return false;
		}
    }
	
	message = iboxoshouts.shout_params.prefix + message + iboxoshouts.shout_params.suffix;
	iboxoshouts.posting_shout = true;
	iboxoshouts.set_loader('');
	iboxoshouts.shout.ajax = new vB_AJAX_Handler(true);
	iboxoshouts.shout.ajax.onreadystatechange(InfernoShoutboxControl.shout_posted);
	iboxoshouts.shout.ajax.send('infernoshout.php', 'do=shout&message=' + PHP.urlencode(message));
	iboxoshouts.clear();
	return false;
};
iboxoshouts.shout = iboxoshouts.new_shout;

// rewrite of update_shouts to add things
iboxoshouts.new_update_shouts = function(shouts)
{
	iboxoshouts.shoutframe.innerHTML = '';
	    
    if (sbm_getValue("bool_smilies_fake") == "enabled")
    {
		
        var sSmil = JSON.parse(sbm_getValue("json_smilies_fake"));
        for(var k in sSmil)
        {
            var re = new RegExp(k,"g");
            shouts = shouts.replace(re, '<a href="'+sSmil[k]+'" target="_blank" title="'+[k]+'"><img src="'+sSmil[k]+'"></a>');
        }
    }
    
	iboxoshouts.shoutframe.innerHTML = shouts;
    
	if (iboxoshouts.newestbottom && iboxoshouts.shoutframe.scrollTop < iboxoshouts.shoutframe.scrollHeight)
	{
		iboxoshouts.shoutframe.scrollTop = iboxoshouts.shoutframe.scrollHeight;
	}
};
iboxoshouts.update_shouts = iboxoshouts.new_update_shouts;

// rewrite of smilies_fetched to add smilies to the menu
iboxoshouts.new_smilies_fetched = function()
{
	ajax = InfernoShoutboxControl.fetchsmilies.ajax;
	
	if (ajax.handler.readyState == 4 && ajax.handler.status == 200)
	{
		InfernoShoutboxControl.set_loader('none');
		InfernoShoutboxControl.fetchingsmilies = false;
		InfernoShoutboxControl.smiliesbox.style.display = '';
		InfernoShoutboxControl.smiliesrow.innerHTML = ajax.handler.responseText;
        
		if (sbm_getValue("bool_smilies_hidden") == "enabled")
        {
            for(var k in sbm_smilies_hidden)
			{
                var HTML = '<span style="padding-right: 2px; padding-left: 2px">';
                HTML += '<img ';
                HTML += 'src="'+sbm_smilies_hidden[k]+'" ';
                HTML += 'title="'+k+'" ';
                HTML += 'onclick="InfernoShoutboxControl.append_smilie(\''+k+'\');" ';
                HTML += 'onmouseover="this.style.cursor = \'pointer\';" ';
                HTML += 'style="cursor: pointer; max-height: 40px">';
                HTML += '</span>';
                InfernoShoutboxControl.smiliesrow.innerHTML += HTML;
			}
        }
        
		if (sbm_getValue("bool_smilies_elite") == "enabled")
        {
            for(var k in sbm_smilies_elite)
			{
                var HTML = '<span style="padding-right: 2px; padding-left: 2px">';
                HTML += '<img ';
                HTML += 'src="'+sbm_smilies_elite[k]+'" ';
                HTML += 'title="'+k+'" ';
                HTML += 'onclick="InfernoShoutboxControl.append_smilie(\''+k+'\');" ';
                HTML += 'onmouseover="this.style.cursor = \'pointer\';" ';
                HTML += 'style="cursor: pointer; max-height: 40px">';
                HTML += '</span>';
                InfernoShoutboxControl.smiliesrow.innerHTML += HTML;
			}
        }
        
		if (sbm_getValue("bool_smilies_weed") == "enabled")
        {
            for(var k in sbm_smilies_weed)
			{
                var HTML = '<span style="padding-right: 2px; padding-left: 2px">';
                HTML += '<img ';
                HTML += 'src="'+sbm_smilies_weed[k]+'" ';
                HTML += 'title="'+k+'" ';
                HTML += 'onclick="InfernoShoutboxControl.append_smilie(\''+k+'\');" ';
                HTML += 'onmouseover="this.style.cursor = \'pointer\';" ';
                HTML += 'style="cursor: pointer; max-height: 40px">';
                HTML += '</span>';
                InfernoShoutboxControl.smiliesrow.innerHTML += HTML;
			}
        }
        
		if (sbm_getValue("bool_smilies_fake") == "enabled")
        {
            var mSmil = JSON.parse(sbm_getValue("json_smilies_fake"));
            for(var k in mSmil)
			{
                var fHTML = '<span style="padding-right: 2px; padding-left: 2px">';
                fHTML += '<img ';
                fHTML += 'src="'+mSmil[k]+'" ';
                fHTML += 'title="'+k+'" ';
                fHTML += 'onclick="InfernoShoutboxControl.append_smilie(\''+k+'\');" ';
                fHTML += 'onmouseover="this.style.cursor = \'pointer\';" ';
                fHTML += 'style="cursor: pointer; max-height: 40px">';
                fHTML += '</span>';
                InfernoShoutboxControl.smiliesrow.innerHTML += fHTML;
			}
        }
	}
};

iboxoshouts.smilies_fetched = iboxoshouts.new_smilies_fetched;

// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░░░░▄▄▄▄▄▄▄░░░░░░░░░
// ░░░░░░░░░▄▀▀▀░░░░░░░▀▄░░░░░░░
// ░░░░░░░▄▀░░░░░░░░░░░░▀▄░░░░░░
// ░░░░░░▄▀░░░░░░░░░░▄▀▀▄▀▄░░░░░
// ░░░░▄▀░░░░░░░░░░▄▀░░██▄▀▄░░░░
// ░░░▄▀░░▄▀▀▀▄░░░░█░░░▀▀░█▀▄░░░
// ░░░█░░█▄▄░░░█░░░▀▄░░░░░▐░█░░░
// ░░▐▌░░█▀▀░░▄▀░░░░░▀▄▄▄▄▀░░█░░
// ░░▐▌░░█░░░▄▀░░░░░░░░░░░░░░█░░
// ░░▐▌░░░▀▀▀░░░░░░░░░░░░░░░░▐▌░
// ░░▐▌░░░░░░░░░░░░░░░▄░░░░░░▐▌░
// ░░▐▌░░░░░░░░░▄░░░░░█░░░░░░▐▌░
// ░░░█░░░░░░░░░▀█▄░░▄█░░░░░░▐▌░
// ░░░▐▌░░░░░░░░░░▀▀▀▀░░░░░░░▐▌░
// ░░░░█░░░░░░░░░░░░░░░░░░░░░█░░
// ░░░░▐▌▀▄░░░░░░░░░░░░░░░░░▐▌░░
// ░░░░░█░░▀░░░░░░░░░░░░░░░░▀░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

//////// end of edited inferno functions                                                                                                                           //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////