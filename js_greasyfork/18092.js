// ==UserScript==
// @name         Jenkins Config XML File Viewer
// @namespace    http://budw.in/
// @version      0.2
// @description  Add a link to view the job's XML configuration file from the job's page.  This link is titled "View Config XML File."
// @author       Drew Budwin
// @match        http*://*/job/*
// @require      https://code.jquery.com/jquery-2.2.1.js
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/18092/Jenkins%20Config%20XML%20File%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/18092/Jenkins%20Config%20XML%20File%20Viewer.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals $:false */
/* global waitForKeyElements */
'use strict';

waitForKeyElements(".icon-folder.icon-xlg", addConfigXMLFileLinkWithImage);

function addConfigXMLFileLinkWithImage()
{
    $('table').each(function()
    {
    	var tableToPrependRowTo = $(this);
    
        if (tableToPrependRowTo.children().is(':contains("Workspace")'))
        {
            var rowToPrepend = getRowWithLinkAndImage();
            tableToPrependRowTo.prepend(rowToPrepend);
        }
    });
}

function getRowWithLinkAndImage()
{
	return '<tr><td>' + getConfigXMLFileLinkWithImage() + '</td><td style="vertical-align:middle">' + getConfigXMLFileLink() + '</td></tr>';
}

function getConfigXMLFileLinkWithImage()
{
    return '<a href="' + getConfigXMLFileUrl() + '"><img src="' + getSettingIconUrl() + '"></a>';
}

function getConfigXMLFileLink()
{
    return '<a href="' + getConfigXMLFileUrl() + '">View Config XML File</a>';
}

function getConfigXMLFileUrl()
{
    return window.location.href + 'config.xml';
}

function getSettingIconUrl()
{
    var baseUrl = window.location.protocol + '//' + window.location.host;
    var resourceLocation = $('head').attr('resURL') + '/';
    var settingsIconName = 'images/48x48/setting.png';
    var imageUrl = baseUrl + resourceLocation + settingsIconName;
    
    return imageUrl;
}