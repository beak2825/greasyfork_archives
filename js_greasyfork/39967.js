// ==UserScript==
// @name        BlueCat Address Manager Direct Actions (Deploy)
// @namespace   *
// @description Add direct buttons for Deploy Actions in BlueCat Address Manager
// @include     */app*
// @license		MIT
// @version     5
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/39967/BlueCat%20Address%20Manager%20Direct%20Actions%20%28Deploy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39967/BlueCat%20Address%20Manager%20Direct%20Actions%20%28Deploy%29.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
	// always add deployment status quick button to toolbar
    var toolbar = document.getElementsByClassName("ToolBar");
	if (toolbar !== undefined) {
		var tRs1 = toolbar[0].getElementsByTagName("tr");
		if (tRs1 !== undefined) {
            var tR1 = tRs1[0];
            var a = tR1.insertCell(0);
            a.innerHTML = '<td><div class="ToolBarItemSeparator">&nbsp;</div></td>';
			var b = tR1.insertCell(0);
			b.innerHTML='<td><a id="link_DS" onclick="ProteusWaitingPage.start();" name="DStatusExtra" class="ToolBarItem" href="/app?component=%24ValueObjectFormTable_14.%24ComboButtonBar.%24ComboButton.direct&page=ConfigurationPage&service=direct&session=T&sp=Spage%3DDeploymentStatus&sp=Spage%3DDeploymentStatus"><img src="/images/icons/small/flash_question.gif" border="0" alt="Deployment Status" title="Deployment Status"></a></td>';
		}
	}
    var page = document.childNodes[2].nodeValue;
    if (/ Page: ConfigurationPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (/Servers/.test(subtab.innerHTML.trim())) {
            var topBar = document.getElementsByClassName('value-table-topToolBar')[0];
            var tBody = topBar.getElementsByTagName('tbody')[2];
            var tR = tBody.getElementsByTagName('tr')[0];
            var w = tR.insertCell(-1);
            w.innerHTML='<div class="separator"></div>';
            var x = tR.insertCell(-1);
            x.innerHTML='<span id="deployButton" class="title"><a style="color:inherit; text-decoration: none;" href="javascript:remoteSubmitLink( document.getElementById( \'form\' ), \'SDeploy\' );"><img src="/images/icons/small/flash.gif" border="0">&nbsp;<b style="vertical-align: super;">Deploy</b></a></span>';
            var y = tR.insertCell(-1);
            y.innerHTML='<div class="separator"></div>';
            var z = tR.insertCell(-1);
            z.innerHTML='<span id="deployStatusButton" class="title"><a style="color:inherit; text-decoration: none;" href="/app?component=%24ValueObjectFormTable_14.%24ComboButtonBar.%24ComboButton.direct&page=ConfigurationPage&service=direct&session=T&sp=Spage%3DDeploymentStatus&sp=Spage%3DDeploymentStatus"><img src="/images/icons/small/flash_question.gif" border="0">&nbsp;<span class="title-center"><b style="vertical-align: super;">Deployment Status</b></a></span>';
        }
    }
	if (/ Page: ServerPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (! /Details/.test(subtab.innerHTML.trim())) {
            var actions = document.getElementsByClassName('action-items')[0];
            var tBody = actions.getElementsByTagName('tbody')[0];
            var w = tBody.insertRow(-1);
            w.innerHTML='<tr id="For_Deploy"><td class="action-item"><div id="action-item" class="with-description-with-icon"><a href="javascript:remoteSubmitLink( document.getElementById( \'form\' ), \'SDeploy\' );"><div class="selection " onmouseover="onActionItemOver(this, event);" onmouseout="onActionItemOut(this, event);" onclick="onActionItemClick(this, event);"><table class="action-item-selection" cellspacing="0" cellpadding="0"><tbody><tr><td class="icon"><div class="active"><img src="/images/icons/small/flash.gif" border="0"></div></td><td class="action"><div class="active"><div class="action-title">Deploy</div><div class="action-description">Deploy this server</div></div></td></tr></tbody></table></div></a></div></td></tr>';
        }
    }
    if (/ Page: IP4NetworkPage /.test(page)) {
        var topBar = document.getElementsByClassName('value-table-topToolBar')[0];
        var tBody = topBar.getElementsByTagName('tbody')[2];
        var tR = tBody.getElementsByTagName('tr')[0];
        var w = tR.insertCell(-1);
        w.innerHTML='<div class="separator"></div>';
        var x = tR.insertCell(-1);
        x.innerHTML='<span id="deployButton" class="title"><a style="color:inherit; text-decoration: none;" href="javascript:remoteSubmitLink( document.getElementById( \'form\' ), \'SQuickDeploy\' );"><img src="/images/icons/small/flash.gif" border="0">&nbsp;<b style="vertical-align: super;">Quick Deploy</b></a></span>';
        var y = tR.insertCell(-1);
    }
    if (/ Page: ZoneDetails /.test(page)) {
        var topBar = document.getElementsByClassName('value-table-topToolBar')[0];
        var tBody = topBar.getElementsByTagName('tbody')[2];
        var tR = tBody.getElementsByTagName('tr')[0];
        var w = tR.insertCell(-1);
        w.innerHTML='<div class="separator"></div>';
        var x = tR.insertCell(-1);
        x.innerHTML='<span id="deployButton" class="title"><a style="color:inherit; text-decoration: none;" href="javascript:remoteSubmitLink( document.getElementById( \'form\' ), \'SQuickDeploy\' );"><img src="/images/icons/small/flash.gif" border="0">&nbsp;<b style="vertical-align: super;">Quick Deploy</b></a></span>';
        var y = tR.insertCell(-1);
    }
}