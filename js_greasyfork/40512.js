// ==UserScript==
// @name ResetEra - Hide Forum Threads
// @namespace ThreadFilter
// @description Hides threads on resetera.com
// @require http://code.jquery.com/jquery-latest.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @include http*://*resetera.com/forums/**
// @version 1.0.6
// @downloadURL https://update.greasyfork.org/scripts/40512/ResetEra%20-%20Hide%20Forum%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/40512/ResetEra%20-%20Hide%20Forum%20Threads.meta.js
// ==/UserScript==

let threadTitle;
let currentVisibleThreads = [];
let shownCount = 0;
let originalPageCount = GetNextPage();
let pageCount = originalPageCount;
let additionalThreadCount = 0;

let filterAnchorElementSelector = '.buttonGroup-buttonWrapper:first';
let threadNamePrefix = 'js-threadListItem-';
let memberLinkSelector = '.posterDate a[href*="members/"]';
let memberLinkPrefix = 'https://www.resetera.com/members/';
let threadLinkPrefix = 'https://www.resetera.com/threads/';
let filterButtonClass = 'callToAction';
let darkPurpleColor = 'rgb(86, 65, 132)';
let lightPurpleColor = 'rgb(167, 145, 207)';
let threadsPerPage = 50;

$(document).ready(function() {
    CheckExpiredThreads();
    CreateStyles();
    CreateFilteringElements();
    CreateEventHandlers();

    SetOptions();

	UpdateHideLinks();

    UpdateThreads();
});

function CreateFilteringElements()
{
    let filteringElements = '<div style="font-size:.8rem; margin-left:50px !important; float:right !important;" class="FilteringElementsContainer RowOrdering">';
    filteringElements += '<div style="margin-right:20px;color:#ae8fd6;font-size:12px"><strong>Thread Filter:</strong><br />' + GetFilter() + '</div>';
    filteringElements += '<div>' + GetOpenControlPanelButton() + '</div>';
    filteringElements += '</div>';

    $(filterAnchorElementSelector).parent().append(GetControlPanel());
    $(filterAnchorElementSelector).parent().append(filteringElements);
    $('.TabLinksContainer div a').click(ControlPanelTabClicked);

    
    AddTitleBarSpacer();
}

function GetOpenControlPanelButton() {
    //return '<span class="nodeListNewDiscussionButton"><a id="OpenFilterCP" class="callToAction FilterCP">Filter Control Panel</a></span>';
    return '<span class="nodeListNewDiscussionButton"><button id="OpenFilterCP" class="callToAction FilterCP">Filter Control Panel</button></span>';
}

function CreateStyles()
{
    $("body").append("<link rel='stylesheet' href='//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css'>");

    CreateFilterCPStyle();

    AddStyleToBody('.RowOrdering { display:flex; flex-direction:row; margin-bottom:10px;}');
    AddStyleToBody('.FilteringElementsContainer { padding:5px; }');
    AddStyleToBody('.BoldText { font-weight:bold; }');
    AddStyleToBody('.DisabledFeature { display:none; }');
    AddStyleToBody('.ListingTable td { padding-bottom:10px; }');

    if (localStorage.getItem("HideLinkStyle") != "HideShow")
    {
        $("body").append(GetRemoveStyle());
    }
}

function CreateFilterCPStyle() {
    let  FilterCPStyle = ' .FilterCP { padding: 10px;';
    FilterCPStyle += 'font-weight: bolder;';
    FilterCPStyle += 'font-size: 11px;';
    FilterCPStyle += 'color: black;';
    FilterCPStyle += '-webkit-box-pack: "Open Sans", sans-serif;';
    FilterCPStyle += 'background-color: rgb(167, 145, 207); }';

    FilterCPStyle += '.HiddenTab { display:none }';

    FilterCPStyle += '.TabLinksContainer div { background-color: ' + darkPurpleColor + '; color: white; padding: 10px;}';
    FilterCPStyle += '.TabLinksContainer div a { color: white !important;}';

    FilterCPStyle += '.SelectedTabLink { border: 2px solid white; padding: 2px; }';

    AddStyleToBody(FilterCPStyle);
}

function AddStyleToBody(FilterCPStyle) {
    $("body").append("<style>" + FilterCPStyle + "</style>");
}

function CreateFilter()
{
    $(filterAnchorElementSelector).parent().append(GetFilter());

}

function GetFilter() {
    return "<select id='ThreadFilter'><option value='Unignored' selected='true'>Show Unignored Only</option><option value='Ignored'>Show Ignored Only</option><option value='All'>Show All</option></select>&nbsp;";
}

function AddTitleBarSpacer() {
    $('dl.sectionHeaders .main').after('<dd></dd>');
}

function GetRemoveStyle()
{
    var HideThreadStyle = 'margin-left: -11px;  margin-top: -38px;';
    var HideThreadStyle2 = 'padding-left:10px; margin-left:-45px;  margin-top:-2px;';
    let XStyle = 'content: "x";  font-size: 20pt; color:' + lightPurpleColor;

    RemoveStyle = '<style id="RemoveStyle">';
    RemoveStyle += ' .RemoveUser { padding-left: 35px; padding-top: 0px !important; margin-top: 0px !important; }';
    RemoveStyle += ' .RemoveThread { padding-left: 35px; width:50px; }';

    let removeThreadSelector = 'a[id*="RemoveThread"]';

    RemoveStyle += removeThreadSelector + ':before { ' + XStyle + '; transition: visibility 1s; -webkit-transition:visibility 1s; }';
     RemoveStyle += removeThreadSelector + ' {  padding-left:35px; background-clip:content-box; visibility: hidden !important; transition: visibility 1s; -webkit-transition:visibility 1s;}';
     RemoveStyle += ' .structItem-title:hover > a[id*="RemoveThread"] { visibility: visible !important; transition: visibility 1s; -webkit-transition:visibility 1s; }';

    RemoveStyle += '</style>';

    return RemoveStyle;
}

function UpdateHideLinks()
{
    $(GetThreads()).each(function( index,value ) { AddHideLink(this);});
}

function GetThreads(parentElement)
{
    if (!parentElement)
    {
        parentElement = window.document;
    }

   return $(parentElement).find('.js-threadList').children();
}


function GetUserID(currentThread)
{
    let MemberLink = $(currentThread).find('.username')[0];
    let memberIDMatcher = /members\/.+?\.(\d+)\//i;
    let foundID = memberIDMatcher.exec(MemberLink.href);

    if (foundID && foundID.length > 1)
    {
    return foundID[1];
    }

    return 0;
}

function GetMemberLink(currentThread)
{
    return $(currentThread).find(memberLinkSelector)[0];
}

function GetThreadStarterUsername(currentThread)
{
    return GetMemberLink(currentThread).innerText;
}

function GetThreadID(currentThread)
{
    return currentThread.className.match(/js-threadListItem-(\d+)/i)[1];
}

function GetThreadTitle(currentThread)
{
    return $(currentThread).find('.structItem-title a:first')[0].innerText;
}

function AddHideLink(currentThread)
{
	    IgnoreList = GetListFromLocalStorage('IgnoreList');
    	IgnoredUserList = GetListFromLocalStorage('IgnoredUserList');

  	   	nThreadID = GetThreadID(currentThread);
      	nUserID = GetUserID(currentThread);

    	var bThreadIgnored = (containsObject(nThreadID,IgnoreList) == -1) ? false : true;
    	var bUserIgnored = (containsObject(nUserID,IgnoredUserList) == -1) ? false : true;
        var sThreadFilterVal = $('#ThreadFilter').val();
        let MemberLink = GetMemberLink(currentThread);

        ThreadIgnoreText = "";
            UserIgnoreText = "";
    	if ($(currentThread).has("a[id*='RemoveThread" + nThreadID + "']").length == 0)
	    {

            let RemoveUserLinks = $('a[id*=RemoveUser' + nUserID + ']').toArray();

    		sUserIDReference = (RemoveUserLinks.length > 0) ? nUserID + RemoveUserLinks.length : nUserID;

            $('#RemoveUser' + sUserIDReference).click({param1: nUserID, param2: 'IgnoredUserList', param3: UpdateThreads, param4: currentThread}, IgnoreItem);


            let removeThreadElement = '<a id="RemoveThread' + nThreadID + '">' + ThreadIgnoreText + '</a>';
            $($(currentThread).find('.structItem-title a')).after(removeThreadElement);

            $('#RemoveThread' + nThreadID).click({param1: nThreadID, param2: 'IgnoreList', param3: UpdateThreads, param4: currentThread}, IgnoreItem);
    	}
    	else
        {
            $('#RemoveThread' + nThreadID).text(ThreadIgnoreText);
            $('a[id*=RemoveUser' + nUserID).text(UserIgnoreText + " User");
        }
}


function CreateEventHandlers()
{
    $('#ThreadFilter').change(function() { UpdateThreads(); UpdateHideLinks();});
    $('#OpenFilterCP').click(OpenFilterCP);
    $('#AddWordButton').click(AddToWordFilter);
    $('#AddIgnoredUserButton').click(AddToIgnoredUserList);
    $('input[name="HideLinkStyle"]').change(function () { localStorage.setItem('HideLinkStyle', this.value); RemoveHideLinks(); SaveLastUpdate();});
    $('#SearchAdditional').change(function() { localStorage.setItem('SearchAdditional', this.checked); SaveLastUpdate();});
    //$('#CloudSync').change(function() { localStorage.setItem('CloudSync', this.checked); ShowCloudSyncOptions(this); });
    //$('#CloudSyncFrequency').change(function() { localStorage.setItem('CloudSyncFrequency', this.value); SaveLastUpdate(); });
    //$('#CloudSyncKey').change(function() {CloudKeyChanged(this.value);});
    //$('#GenerateCloudSyncKey').click(GenerateCloudSyncKey);
    $('#ThreadExpiration').change(function() { localStorage.setItem('ThreadExpiration', this.checked); if (localStorage.getItem('ExpirationDays') == null) {localStorage.setItem('ExpirationDays',30); 	document.getElementById("ExpirationDays").value = localStorage.getItem("ExpirationDays");} $('#ThreadExpirationOptions').toggle(); SaveLastUpdate(); });
	$('#ExpirationDays').change(function() {localStorage.setItem('ExpirationDays', this.value);});
}

function RemoveHideLinks()
{
    $("a[id*='RemoveThread']").remove();
    $("a[id*='RemoveUser']").remove();

    $("#RemoveStyle").remove();

    if (localStorage.getItem("HideLinkStyle") != "HideShow")
    	$("body").append(GetRemoveStyle());
}

function SetOptions()
{
    document.getElementById("ThreadFilter").value = CheckThreadFilterValue(localStorage.getItem("ThreadFilter"));

    //if (localStorage.getItem("CloudSyncKey"))
    //    document.getElementById("CloudSyncKey").value = localStorage.getItem("CloudSyncKey");

    if (!localStorage.getItem("HideLinkStyle"))
        localStorage.setItem("HideLinkStyle","X");

	if (localStorage.getItem("ExpirationDays"))
		document.getElementById("ExpirationDays").value = localStorage.getItem("ExpirationDays");

    CheckSettingOption("SearchAdditional");
    //CheckSettingOption("CloudSync");
    CheckSettingOption("HideLinkStyle");
	CheckSettingOption("ThreadExpiration");

    $('#ThreadExpirationOptions').css('display',$('#ThreadExpiration').prop('checked') ? 'block' : 'none');
}

function UpdateThreads()
    {
      shownCount = 0;
      $('#ThreadFilter').blur();
      localStorage.setItem('ThreadFilter',document.getElementById("ThreadFilter").value);
      currentVisibleThreads = [];

      $(GetThreads()).each(function(index)
        	{
    	 	 nThreadID = GetThreadID(this);
    	 	 threadTitle = GetThreadTitle(this);
             sUserID = GetUserID(this);

             if (CheckThreadHidden(nThreadID,threadTitle,sUserID))
             {
                 $(this).hide();
                 }
             else
             {
                 currentVisibleThreads.push(nThreadID);
                 shownCount++;

                 $(this).show();
             }
    	});

        if (localStorage.getItem("SearchAdditional") == "true")
        {
            pageCount = originalPageCount;
            GetAdditionalThreads();
        }

}



function GetAdditionalThreads()
{

    if (shownCount < threadsPerPage && pageCount <= (parseInt(originalPageCount) + 5))
    {
        let nextPageURL = window.location.href.replace(/page-\d*/i,'') + "page-" + pageCount;

        var jqxhr = $.get(nextPageURL, ProcessAdditionalThread)
    	.done(function() {
        pageCount++;
        GetAdditionalThreads();
  	});
    }
}

function ProcessAdditionalThread(data)
{
	    var lastThread = $(GetThreads()).last();
        let foundThreads = [];

        $(GetThreads(data)).each(function(index, value)
       	{
            nThreadID = GetThreadID(this);
        	threadTitle = GetThreadTitle(this);
        	sUserID = GetUserID(this);

        	additionalThreadCount = additionalThreadCount + 1;

            if (!CheckThreadHidden(nThreadID, threadTitle, sUserID) && shownCount < threadsPerPage && $.inArray(nThreadID,currentVisibleThreads) == -1)
            	{
                    lastThread = $(lastThread).after(this);
                    foundThreads.push(this);

    	    	AddHideLink(this);
            	shownCount++;
            	}

        });

        
}

function CheckThreadFilterValue(sFilterValue)
{
    if (sFilterValue != "Unignored" && sFilterValue != "Ignored" && sFilterValue != "All")
        sFilterValue = "Unignored";

    return sFilterValue;
}

function IgnoreItem(event) {
    var nCurrentID = event.data.param1;
    var sList = event.data.param2;
    var addItem = {};
    addItem.ID = nCurrentID;
    addItem.AddDate = new Date();

    if (sList == "IgnoreList")
        addItem.Title = GetThreadTitle(event.data.param4);
    else if (sList == "IgnoredUserList")
        addItem.Username = GetThreadStarterUsername(event.data.param4);

    CurrentList = GetListFromLocalStorage(sList);

    containsObject(nCurrentID,CurrentList,addItem);

    localStorage.setItem(sList, JSON.stringify(CurrentList));

    if (event.data.param3)
    	event.data.param3();

    AddHideLink(event.data.param4);
    IgnoreItemServerSide(nCurrentID);
    SaveLastUpdate();

    CheckCloudUpdateNeeded();




    return 0;
}

function IgnoreItemServerSide(threadID)
{
    var token = $('[name="_xfToken"]')[0].value;
    var data = {
        '_xfRequestUri': '/threads/',
        '_xfWithData': '1',
        '_xfToken': token,
        '_xfResponseType': 'json'};


    $.ajax({
  type: "POST",
  url: 'https://www.resetera.com/misc/tic-ignore?content_type=thread&is_confirmed=1&content_id=' + threadID,
  data: data,
  success: function( data ) {
console.log('Ignored thread #' + threadID + ' on server side', data);
}
});


}


function CheckThreadHidden(nThreadID, sThreadTitle,sUserID)
{
    	var sThreadFilterVal = $('#ThreadFilter').val();
    	var bWordFilterApplies = false;
    	var bUserFilterApplies = false;

    	IgnoreList = GetListFromLocalStorage('IgnoreList');
    	nThreadIndex = containsObject(nThreadID,IgnoreList);

    	var bThreadIgnored = (nThreadIndex == -1) ? false : true;

        if ((bThreadIgnored && sThreadFilterVal == 'Unignored'))
        {
            return true;
        }
        else
        {
            bWordFilterApplies = WordFilterApplies(sThreadTitle);

            if (bWordFilterApplies && sThreadFilterVal == 'Unignored')
          	{
              	return true;
           	}
            else
           	{
                bUserFilterApplies = containsObject(sUserID,GetListFromLocalStorage('IgnoredUserList')) != -1 ? true : false;

                if (bUserFilterApplies && sThreadFilterVal == 'Unignored')
             	{
                    return true;
             	}
                else if (!bThreadIgnored && !bWordFilterApplies && !bUserFilterApplies && sThreadFilterVal == 'Ignored')
             	{
                 	return true;
             	}
           	}

        }

    return false;
}

function WordFilterApplies(sThreadTitle)
{
    CurrentArea = GetCurrentArea();

    var bFilterApplies = false;
	WordList = GetListFromLocalStorage('WordList');

	jQuery.each(WordList,function (index)
	{

        if (this.Area == null || this.Area == 'All' || this.Area == CurrentArea)
        {
        if (this.Type == 'plaintext')
		{
			sFragments = this.Word.split('*');

			bMatchesPattern = true;

            jQuery.each(sFragments, function(index)
			{
				if (sThreadTitle.toLowerCase().indexOf(this.toLowerCase()) == -1)
				{
					bMatchesPattern = false;
				}
			});

			if (bMatchesPattern === true)
        	{
        		bFilterApplies = true;
				return 0;
        	}
		}
		else if (this.Type == 'regularexpression')
		{
			sRegExMatches = sThreadTitle.match(this.Word);

			if (sRegExMatches)
            	{
                	bFilterApplies = true;
                	return 0;
            	}
		}
            }
    });

    return bFilterApplies;
 }


function GetCurrentArea()
{
    CurrentLocation = window.location.href;

    if (CurrentLocation.indexOf("etcetera-forum.9") != -1 || CurrentLocation.indexOf("etcetera-hangouts.10") != -1)
        return "EtcetEra";
    else if (CurrentLocation.indexOf("gaming-forum.7") != -1 || CurrentLocation.indexOf("gaming-hangouts.8") != -1)
    	return "Video Games";

}

function AddToWordFilter(event) {
    newWord = $('#AddWordText').val();

    var addWord = {};
    addWord.Word = newWord;
    addWord.Type = $('input[name*=AddWordType]:checked').val();
    addWord.Area = $('input[name*=AddWordArea]:checked').val();

    WordList = GetListFromLocalStorage('WordList');
    nWordIndex = containsObject(addWord.Word, WordList);

    if (nWordIndex == -1) {

        WordList.push(addWord);
    }

    localStorage.setItem('WordList', JSON.stringify(WordList));
    $('#AddWordText').val('');
    $('input[name="AddWordArea"][value="All"]').prop('checked', true);
    UpdateListing('WordListing', 'WordList');

    localStorage.setItem("LastUpdate",new Date());
    CheckCloudUpdateNeeded();

}

function AddToIgnoredUserList(event) {
    newIgnoredUserText = $('#AddIgnoredUserText').val();

    var addIgnoredUser = {};
    addIgnoredUser.Username = newIgnoredUser;

    IgnoredUserList = GetListFromLocalStorage('IgnoredUserList');
    nIgnoredUserIndex = containsObject(addIgnoredUser.Username, IgnoredUserList);

    if (nIgnoredUserIndex == -1) {
        IgnoredUserList.push(addIgnoredUser);
    }

    localStorage.setItem('IgnoredUserList', JSON.stringify(IgnoredUserList));
    $('#AddIgnoredUserText').val('');

    UpdateListing('IgnoredUserListing', 'IgnoredUserList');

    localStorage.setItem("LastUpdate",new Date());
    CheckCloudUpdateNeeded();

}

function CreateControlPanel()
{
      var sControlPanel = GetControlPanel();

    $(filterAnchorElementSelector).parent().append(sControlPanel);
    $(filterAnchorElementSelector).parent().append($('<span class="nodeListNewDiscussionButton"><a id="OpenFilterCP" class="callToAction FilterCP">Filter Control Panel</a></span>'));
    $('.TabLinksContainer div a').click(ControlPanelTabClicked);

    AddTitleBarSpacer();
}

function GetControlPanel()
{
    var sControlPanel = "<div id='tabs' style='display:none;'>";
    sControlPanel += "<div class='TabLinksContainer RowOrdering'>";
    sControlPanel += "<div><a id='1' class='SelectedTabLink' href='javascript:void(0)'>Word Filter</a></div>";
  sControlPanel += "<div><a id='2' href='javascript:void(0)'>Ignored Threads</a></div>";
  sControlPanel += "<div class='DisabledFeature'><a id='3' href='javascript:void(0)'>Ignored Users</a></div>";
  sControlPanel += "<div><a id='4' href='javascript:void(0)'>Settings</a></div>";
  sControlPanel += "</div>";
    sControlPanel += "<div id='tabs-1'>";
  sControlPanel += CreateWordFilter();
  sControlPanel += "</div>";
  sControlPanel += "<div id='tabs-2' class='HiddenTab'>";
  sControlPanel += "<div id='RecentlyIgnoredListing'></div>";
  sControlPanel += "</div>";
  sControlPanel += "<div class='DisabledFeature' id='tabs-3' class='HiddenTab'>";
  sControlPanel += CreateIgnoredUserTab();
  sControlPanel += "</div>";
    sControlPanel += "<div id='tabs-4' class='HiddenTab'>";
  sControlPanel += CreateSettingsOptions();
  sControlPanel += "</div>";
  sControlPanel += "</div>";

  return sControlPanel;
}

function ControlPanelTabClicked()
{
    $('#tabs div[id*="tabs-"]').addClass('HiddenTab');
    $('#tabs div[id="tabs-' + this.id + '"]').removeClass('HiddenTab');

    $('.TabLinksContainer a').removeClass('SelectedTabLink');
    $('.TabLinksContainer div a[id="' + this.id + '"]').addClass('SelectedTabLink');
}

function OpenFilterCP()
    {
    	UpdateListing('WordListing', 'WordList');
        UpdateListing('RecentlyIgnoredListing', 'IgnoreList');
        UpdateListing('IgnoredUserListing', 'IgnoredUserList');
        //ShowCloudSyncOptions();

        let tabsContainer = $('#tabs');
         $('#tabs').dialog();
         $('#tabs').bind('dialogclose', function(event) { CheckExpiredThreads();	UpdateThreads(); UpdateHideLinks(); });
    	 $('#tabs').dialog({ title: "Filter Control Panel", closeText:""});
         $("#tabs").dialog("option", "width", '60%');
    }


function CreateWordFilter()
{
    sWordFilter = "<div id='WordFilter'>";
    sWordFilter += "<span class='BoldText'>Add New Word:</span>&nbsp;<input id='AddWordText'><input type='button' id='AddWordButton' value='Add'><br /><br />";
    sWordFilter += "<div style='margin-left:20px'><span class='BoldText'>Type</span> - <input type='radio' name='AddWordType' value='plaintext' checked>Plain Text (* supported)<input type='radio' name='AddWordType' value='regularexpression'>Regular Expression</div><br />";
    sWordFilter += "<div style='margin-left:20px'><span class='BoldText'>Area</span> - <input type='radio' name='AddWordArea' value='All' checked>All <input type='radio' name='AddWordArea' value='Video Games'>Video Games <input type='radio' name='AddWordArea' value='EtcetEra'>EtcetEra</div>";
    sWordFilter += "<br /><br /><hr width='100%' color='black'><div id='WordListing'></div>";
    sWordFilter += "</div>";

    return sWordFilter;
}

function CreateIgnoredUserTab()
{
    sIgnoredUserTab = "<hr width='100%' color='black'><div id='IgnoredUserListing'></div>";

    return sIgnoredUserTab;
}

function CreateSettingsOptions()
{
    sCreateSettings = "<span class='DisabledFeature'><span class='BoldText'>Hide Link Style</span><br /><input type='radio' name='HideLinkStyle' checked='true' value='X'>X <input type='radio' name='HideLinkStyle' value='HideShow'>Hide/Show<br /><br /></span>";
    sCreateSettings += "<input type='checkbox' id='SearchAdditional' checked='true'>Search additional pages for threads</input>";

	sCreateSettings += "<br />";
    sCreateSettings += "<input type='checkbox' id='ThreadExpiration'>Thread Expiration</input>";
    sCreateSettings += "<div id='ThreadExpirationOptions' style='display:none;margin-left:30px'>";
    sCreateSettings += "Remove threads from filter after <select id='ExpirationDays'>";

	for (var i = 1; i < 31; i++)
		sCreateSettings += "<option>" + i +"</option>";

	sCreateSettings += "</select> day(s).";
    sCreateSettings += "</div>";

    //sCreateSettings += "<span><br />";
    //sCreateSettings += "<input type='checkbox' id='CloudSync'>Cloud sync</input>";
    //sCreateSettings += "<br /><div id='CloudSyncOptions' style='display:none;float:left;margin-left:30px'><br />";
    //sCreateSettings += "Update Frequency:<br />";
    //sCreateSettings += "<select id='CloudSyncFrequency'>";
    //sCreateSettings += "<option value='Instant'>Instant</option>";
    //sCreateSettings += "<option value='1'>1 minute</option>";
    //sCreateSettings += "<option value='5'>5 minutes</option>";
    //sCreateSettings += "<option value='10'>10 minutes</option>";
    //sCreateSettings += "</select>";

    //sCreateSettings += "<br /><br />Sync Key:";
    //sCreateSettings += "<br /><div style='float:left'><input id='CloudSyncKey'></div><div style='float:left;margin-left:15px;vertical-align:middle'><input type='button' id='GenerateCloudSyncKey' value='Generate'></div>";
    //sCreateSettings += "<br /><br /><br />To sync up your settings with the cloud, enter your sync key above.  To create a new key, click the generate button.";
    //sCreateSettings += "<div id='CloudKeyNotFoundMessage' style='display:none;color:red'><br />Sorry, the sync key you entered was not found.  Please try another key or generate a new one.</div>";
    //sCreateSettings += "<div id='LastCloudUpdate' style='display:none;'><br />Last cloud update was at: <span class='BoldText'><div id='LastCloudUpdateTime'></div></span></div>";
    //sCreateSettings += "</div></span>";
    return sCreateSettings;
}

function CheckSettingOption(sSetting)
{
    if (sSetting == "HideLinkStyle")
    	$('input[name="HideLinkStyle"][value="' + localStorage.getItem(sSetting) + '"]').prop('checked', true);
    else
    {
        if (localStorage.getItem(sSetting))
			$("#" + sSetting).attr("checked", localStorage.getItem(sSetting) == "true" ? true : false);
        else if (sSetting != "CloudSync" && sSetting != "ThreadExpiration")
			localStorage.setItem(sSetting, "true");
    }

}

function UpdateListing(sListingDiv, sListName)
{
	$('#' + sListingDiv).empty();
    CurrentList = GetListFromLocalStorage(sListName);

    if (sListName == 'IgnoreList' || sListName == 'IgnoredUserList')
        CurrentList.reverse();

    var sListingText;

	if (sListName == 'IgnoredUserList')
    	sColumnHeadings = '<td align="center" width="300px"><span class="BoldText">Username</span></td>';
    else if (sListName == 'IgnoreList')
        sColumnHeadings = '<td align="center" width="300px"><span class="BoldText">Title</span></td>';
    else if (sListName == 'WordList')
        sColumnHeadings = '<td align="center" width="200px"><span class="BoldText">Word</span></td><td align="center" width="200px"><span class="BoldText">Type</span></td><td align="center" width="100px"><span class="BoldText">Area</span></td>';

    sListingText = '<table class="ListingTable" width="100%"><tr>' + sColumnHeadings + '<td>&nbsp;</td></tr>';

  	jQuery.each(CurrentList,function (index)
	{
        if (sListName == 'IgnoredUserList')
        	sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:300px"><a href="' + memberLinkPrefix +  + this.ID + '" target="_blank">' + this.Username + '</a></div></td><td><input type=button id="RemoveIgnoredUser' + this.ID + '" value=Unignore /></td></tr>';
    	else if (sListName == 'IgnoreList')
        	sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:300px"><a href="' + threadLinkPrefix + this.ID + '" target="_blank">' + this.Title + '</a></div></td><td><input type=button id="RemoveRecentlyIgnored' + this.ID + '" value=Unignore /></td></tr>';
    	else if (sListName == 'WordList')
            sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:200px">' + this.Word + '</div></td><td align="center">' + this.Type + '</td><td align="center">' + (this.Area != null ? this.Area : 'All') + '</td><td><input type=button id="RemoveWord' + index + '" value=Remove /></td></tr>';

	});

    sListingText += '</table>';

    $('#' + sListingDiv).append(sListingText);

    jQuery.each(CurrentList,function (index)
                {
                    if (sListName == 'IgnoredUserList')
                        $('#RemoveIgnoredUser' + this.ID).click({sCurrentID: this.ID, sListName: 'IgnoredUserList', sListDiv: 'IgnoredUserListing'}, RemoveIgnored);
	    	else if (sListName == 'IgnoreList')
        	            $('#RemoveRecentlyIgnored' + this.ID).click({sCurrentID: this.ID, sListName: 'IgnoreList', sListDiv: 'RecentlyIgnoredListing'}, RemoveIgnored);
    	else if (sListName == 'WordList')
                        $('#RemoveWord' + index).click({sCurrentID: this.Word, sListName: 'WordList', sListDiv: 'WordListing'}, RemoveIgnored);

                });
}


function RemoveIgnored(event) {
    IgnoreList = GetListFromLocalStorage(event.data.sListName);
    nCurrentIndex = containsObject(event.data.sCurrentID,IgnoreList);
    IgnoreList.splice(nCurrentIndex,1);
    localStorage.setItem(event.data.sListName, JSON.stringify(IgnoreList));

    UpdateListing(event.data.sListDiv,event.data.sListName);

    localStorage.setItem("LastUpdate",new Date());
   // CheckCloudUpdateNeeded();
}

function containsObject(id, list, addItem)
{
    if (list.length > 0)
    {
        if (list[0].hasOwnProperty('ID'))
            return binaryIndexOf(id,list,addItem);
        else
        {
	       for (var i = 0; i < list.length; i++)
                if (list[i].ID == id || list[i].Word == id)
                   return i;
        }
    }
    else if (typeof addItem === 'object')
    {
        list.splice(0, 0, addItem);
    }
   	return -1;
}


function binaryIndexOf(id,list,addItem) {
    'use strict';
    var minIndex = 0;
    var maxIndex = list.length - 1;
    var currentIndex;
    var currentElement;

    if (localStorage.getItem("IgnoredThreadsSorted") != "true")
    {
      list = list.sort(sortByID);
      localStorage.setItem("IgnoreList",JSON.stringify(list));
      localStorage.setItem("IgnoredThreadsSorted","true");
    }

    if ((parseInt(id) < parseInt(list[minIndex].ID) || parseInt(id) > parseInt(list[maxIndex].ID)) && typeof addItem === 'undefined')
       return -1;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = list[currentIndex].ID;

        if (parseInt(currentElement) < parseInt(id)) {
            minIndex = currentIndex + 1;
        }
        else if (parseInt(currentElement) > parseInt(id)) {
            maxIndex = currentIndex - 1;
        }
        else {
            if (typeof addItem === 'undefined')
                return currentIndex;
            else
            {
                list.splice(currentIndex,1);
                //localStorage.setItem('IgnoreList', JSON.stringify(list));
                writeignored(list);
                return currentIndex;
            }
        }
    }


    if (typeof addItem === 'undefined')
        return -1;
    else
    {
        list.splice(minIndex, 0, addItem);
    }
}

function writeignored(list)
{
    for (var i = 0; i < list.length; i++)
        console.log(list[i].ID);
}

function sortByID(a, b)
{
    return a.ID - b.ID;
}


function GetNextPage()
{
    var str = window.location.href;
	var res = str.match("page-[0-9]+");

    if (res)
        	return parseInt(res[0].replace("page-","")) + 1;
    else
            return 2;

}

function GetListFromLocalStorage(sListName)
{
     return localStorage.getItem(sListName) ? JSON.parse(localStorage.getItem(sListName)) : [];
}

function CheckExpiredThreads()
{
	if (localStorage.getItem("ThreadExpiration") == "true")
	{
        if (!localStorage.getItem("LastExpirationCheck"))
                localStorage.setItem("LastExpirationCheck",new Date());

        var checkexpirationdate = new Date(localStorage.getItem("LastExpirationCheck"));
        checkexpirationdate.setDate(checkexpirationdate.getDate() + 1);

        if (new Date() >= checkexpirationdate)
            {
                var madechange = false;
                var expirationdays = parseInt(localStorage.getItem("ExpirationDays"));
                var threadexpiration;

                ignoreList = GetListFromLocalStorage('IgnoreList');

                for (i = 0; i < ignoreList.length; i++)
                {
                    if (typeof ignoreList[i].AddDate === 'undefined')
                    {
                        ignoreList[i].AddDate = new Date();
                        madechange = true;
                    }
                    else
                    {
                        threadexpiration = new Date(ignoreList[i].AddDate);
                        threadexpiration.setDate(threadexpiration.getDate() + expirationdays);

                        if (new Date() >= threadexpiration)
                        {
                            ignoreList.splice(i,1);
                            madechange = true;
                        }
                    }
                }

                if (madechange == true)
                {
                    localStorage.setItem("IgnoreList",JSON.stringify(ignoreList));
                    SaveLastUpdate();
                    CheckCloudUpdateNeeded();
                }

                localStorage.setItem("LastExpirationCheck",new Date());
            }

	}
}

var Type = "POST";
var URL;
var URLPrefix = "";
var Data = {};
var ContentType = "application/json; charset=utf-8";
var DataType = "json";

function CheckCloudSync()
{
    if (localStorage.getItem("CloudSync") == "true" && localStorage.getItem("CloudSyncKey"))
    {
	CheckCloudUpdateNeeded();

        if (localStorage.getItem("CloudSyncFrequency") != 'Instant')
 	setInterval(CheckCloudUpdateNeeded, 1000 * 60);
    }
}

function GetCloudSyncDateSucceeded(result)
{
    if (!localStorage.getItem("CloudSyncFrequency"))
            localStorage.setItem("CloudSyncFrequency","5");

    currentDate = new Date();

    if (localStorage.getItem("CloudSyncFrequency") != 'Instant')
    {
    	nextDate = new Date(localStorage.getItem("CloudSyncDate"));
    	nextDate.setTime(nextDate.getTime() + parseInt(localStorage.getItem("CloudSyncFrequency")) * 60 * 1000);
    }
    else
        nextDate = currentDate;

    date2 = localStorage.getItem("CloudSyncDate") ? new Date(localStorage.getItem("CloudSyncDate")) : new Date();
    date1 = new Date(result);

    if (result != 'None')
    {
        CloudKeyFound();

        if (!result || (result && localStorage.getItem("CloudSyncDate") && date2 > date1) || (currentDate >= nextDate && new Date(localStorage.getItem("LastUpdate")) > new Date(localStorage.getItem("CloudSyncDate"))))
       	    SendInfoToCloud(new Date());
    	else if (!localStorage.getItem("CloudSyncDate") || (result && localStorage.getItem("CloudSyncDate") && date1 > date2))
    	    GetInfoFromCloud();
    }
    else if (localStorage.getItem("CloudSyncKey"))
        CloudKeyNotFound();

}

function ShowCloudSyncOptions()
{
    $('#CloudSyncOptions').css('display',$('#CloudSync').prop('checked') ? 'block' : 'none');

    if (!localStorage.getItem('CloudSyncFrequency'))
        localStorage.setItem('CloudSyncFrequency','5');

    $('#CloudSyncFrequency').val(localStorage.getItem('CloudSyncFrequency'));
}


function GetInfoFromCloud()
{
	URL = "GetHideForumThreadsInfoNew?Key=" + localStorage.getItem("CloudSyncKey");
        Data = "";
        CallService(GetHideForumThreadsInfo);
}

function GetHideForumThreadsInfo(result) {
    if (result.CloudSyncDate != null)
    {
    localStorage.setItem("CloudSyncDate",result.CloudSyncDate);
    localStorage.setItem("SearchAdditional",result.SearchAdditional);
    localStorage.setItem("ThreadFilter",result.ThreadFilter);
    localStorage.setItem("IgnoredThreadsSorted",result.IgnoredThreadsSorted);
    localStorage.setItem("ThreadExpiration",result.ThreadExpiration);
    localStorage.setItem("ExpirationDays",result.ExpirationDays);
    localStorage.setItem("LastExpirationCheck",result.LastExpirationCheck);
    localStorage.setItem("IgnoredUserList",result.IgnoredUserList);
    localStorage.setItem("IgnoreList",result.IgnoreList);
    localStorage.setItem("WordList",result.WordList);
    localStorage.setItem("HideLinkStyle",result.HideLinkStyle);

    console.log("info received from cloud",result);

    SetOptions();
    RemoveHideLinks();

    CloudKeyFound();
    }
    else
        CloudKeyNotFound();


}

function SaveLastUpdate()
{
	localStorage.setItem("LastUpdate",new Date());
}

function CloudKeyChanged(CurrentKey)
{
    localStorage.setItem("CloudSyncKey",CurrentKey);

    if (CurrentKey != '')
        GetInfoFromCloud();
    else
        CloudKeyNotFound();
}

function CloudKeyFound()
    {
        $('#CloudKeyNotFoundMessage').hide();
        ShowLastCloudUpdate();

    }

function CloudKeyNotFound()
    {
        $('#CloudKeyNotFoundMessage').show();
        $('#LastCloudUpdate').hide();
     }



function ShowLastCloudUpdate()
{
    document.getElementById("LastCloudUpdateTime").innerHTML = localStorage.getItem("CloudSyncDate");
    $('#LastCloudUpdate').show();
}

function GenerateCloudSyncKey()
{
    localStorage.setItem("CloudSyncKey","None");
    SendInfoToCloud(new Date());
}

function SendInfoToCloud(currentDate)
{
    localStorage.setItem("CloudSyncDate",currentDate);

$.ajax({
  url: URLPrefix + "UpdateHideForumThreadsInfoNew",
  type: "POST",
    data: {Key:localStorage.getItem("CloudSyncKey"),
           CloudSyncDate: currentDate,
           SearchAdditional: localStorage.getItem("SearchAdditional") ? localStorage.getItem("SearchAdditional") : "",
           ThreadFilter: localStorage.getItem("ThreadFilter") ? localStorage.getItem("ThreadFilter") : "",
           IgnoredThreadsSorted: localStorage.getItem("IgnoredThreadsSorted") ? localStorage.getItem("IgnoredThreadsSorted") : "",
           ThreadExpiration: localStorage.getItem("ThreadExpiration") ? localStorage.getItem("ThreadExpiration") : "",
           ExpirationDays: localStorage.getItem("ExpirationDays") ? localStorage.getItem("ExpirationDays") : "",
           LastExpirationCheck: localStorage.getItem("LastExpirationCheck") ? localStorage.getItem("LastExpirationCheck") : "",
           IgnoredUserList: localStorage.getItem("IgnoredUserList") ? localStorage.getItem("IgnoredUserList") : "[]",
           IgnoreList: localStorage.getItem("IgnoreList") ? localStorage.getItem("IgnoreList") : "[]",
           WordList: localStorage.getItem("WordList") ? localStorage.getItem("WordList") : "[]",
           HideLinkStyle: localStorage.getItem("HideLinkStyle") ? localStorage.getItem("HideLinkStyle") : "X",
           Username: GetUsername()},
  success: Success,
  dataType: "json",
  error: ServiceFailed

});

}

function GetUsername()
{
    Username = $('#usercptools').text().replace('Welcome ','');

    UsernamePattern = new RegExp("([A-Za-z0-9]+)");
   FoundUsername = UsernamePattern.exec(Username);

    if (FoundUsername != null)
    	return FoundUsername[0].toString();
    else
        return "None";
}

function Success(result)
{
    localStorage.setItem("CloudSyncKey", result);
    document.getElementById("CloudSyncKey").value = localStorage.getItem("CloudSyncKey");
    CloudKeyFound();
    console.log("info sent to cloud");
}

function CheckCloudUpdateNeeded()
{
    if (localStorage.getItem("CloudSync") == "true" && localStorage.getItem("CloudSyncKey"))
    {
        URL = "GetCloudSyncDate?Key=" + localStorage.getItem("CloudSyncKey");
        CallService(GetCloudSyncDateSucceeded);
    }
}

// Function to call WCF  Service
function CallService(succeededcallback) {
    $.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: URLPrefix + URL, // Location of the service
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        data: Data,
        processdata: true, //True or False
        success: function(msg) {//On Successful service call
	indirectCaller(succeededcallback,msg);
        },
        error: ServiceFailed// When Service call fails
    });
}

function ServiceFailed(xhr) {
    console.log('error - ' + xhr.responseText);

    if (xhr.responseText) {
        var err = xhr.responseText;
        if (err)
            error(err);
        else
            error({ Message: "Unknown server error." })
    }
    return;
}

function indirectCaller(f,msg) {
    // Call `caller`, who will in turn call `f`
    f(msg);
}