// ==UserScript==
// @name        ITSM+
// @description ITSM+ enhancements for ITSM
// @namespace   neemspeesweetikveel
// @icon        https://mugshot0.assets-yammer.com/mugshot/images/ZpF41f5KNgwnJ0qx3hhf41hw-5LnrMM4?P1=1615368857&P2=104&P3=1&P4=Plnw1BRGJafXRkfKMOSQAAfaW_uNJy5efo30aAF6A5hH7NyS3IzDN7WCsMpvyJHby23SoYqgDmOJUfwsRxIzQYCKOT00Ce66hpkUG5uhKxNogQmh2emxFPYWFYOrMNC7QyEin0MJWEekOeC6OKiqYLOdDs91AkyemcJiLIFHLuzXJ231PdHwCXhc97fnXaQ2gWyfHlyZNyOCSsXAhc8I1cpNP955-FX_rLYYbfopPxYBJUzM8DldDRHe14xs0iDx0wu6gth0jH38qGYf3EAD29R68ICi7ONqdYBzX3fJp9XoBrZFGQ6hAsP-eOP9rHun0p5bpzHUTzXSV3Kq8ol2vQ==
// @version     2.068
// @include     https://*.service-now.com/*
// @include     https://help.nttltd.global.ntt/*
// @include     https://onlinesupport.emc.com*
// @include     https://support.infoblox.com/app/ask*
// @include     https://casemanager.juniper.net/casemanager/*
// @include     https://tools.cisco.com/ServiceRequestTool/scm/mgmt/*
// @include     https://*.cloudapps.cisco.com/*
// @include     https://*.webex.com/*
// @include     https://*.salesforce.com/*
// @include     https://*.force.com/*
// @include     https://*.ntt.eu/*u_escalation
// @include     https://*.fortinet.com/*
// @include     http://eservice.evercom.be/*
// @include     *eubebrusvsps1.eu.didata.local/Lists/Cust*
// @include     *wired.*.com/communities/eu/be.belgium/Lists/*
// @include     https://pws/*
// @include     https://moveit.*.com/*
// @include     https://usercenter.checkpoint.com/usercenter/portal/media-type/html/role/usercenterUser/page/default.psml/js_pane/*
// @include     https://websupport.f5.com/casemanager/*
// @include     https://meetings-eu.*.com/orion/meeting/schedule*
// @include     https://meetings-eu.*.com/orion/joinmeeting.do
// @include     http://eubebruphpbb/phpbb3_1/*
// @include     http*://scram.client.eu.didata.local/*
// @include     https://*.dimensiondata.com/*
// @include     https://nttlimited.sharepoint.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @resource    nttlogo     https://dimensiondataservices.service-now.com/NTTbanner.jpg
// @resource    favicon     https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/images/og-images/favicon.ico
// @resource    jabbericon  https://lh5.ggpht.com/8SJwWIlSqvTU_zBEOht4diByqRNgzGlVNh0qlv8B69cm1qevWgDGTx5DRb8s_0-EtaW8=w300
// @resource    lyncicon    https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Lync.png
// @resource    sharepicon  http://icons.iconarchive.com/icons/dakirby309/simply-styled/128/Microsoft-SharePoint-2013-icon.png
// @resource    phpbbsicon  http://icons.iconarchive.com/icons/tatice/cristal-intense/128/PhpBB-icon.png
// @resource    sprite      https://developer.service-now.com/images/sprites/i16.pngx
// @resource    yammer      http://news.thewindowsclubco.netdna-cdn.com/wp-content/uploads/2015/02/Internet-Explorer-9.jpg
// @resource    zrdb        https://zrdb.eu.didata.local/favicon.ico
// @resource    googlemaps  https://www.google.com/images/branding/product/ico/maps_32dp.ico
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_listValues
// @grant       GM_log
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @connect     greasyfork.org
// @connect     nttlimited.sharepoint.com
// @run-at		document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/26921/ITSM%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/26921/ITSM%2B.meta.js
// ==/UserScript==
GM_log('#GM_ITSM+# start');

// var gdc_csv = GM_getResourceURL("gdc_csv");
// @require     http://findicons.com/files/icons/2181/34al_volume_3_2_se/24/001_46.png
// @require     http://findicons.com/files/icons/39/aqcua/32/online.png
// @resource    jabbericon  http://static1.squarespace.com/static/5357f5d5e4b0e0474a40a6cf/5373d791e4b0b339e9db0a49/5469e622e4b0bff63b7aa21a/1416226441513/Jabber-logo-2014.png?format=50w
// // @resource    jabbericon  http://www.adiumxtras.com/images/thumbs/gaim_service_icons_contact_list_styles_12031889_thumb.png
// @resource    gdc_csv     https://nttlimited.sharepoint.com/:x:/r/teams/23vfd/internalsite/Shared%20Documents/Main%20clients%20file/EU%20clients%20list%20guidence%20csv.csv
// // @run-at		document-idle   // @run-at		document-start
// https://jira.dimensiondata.com/s/73af8r/803005/88d5555c82f30f5ec4e899423265dd40/_/jira-logo-scaled.png
// https://dimensiondataservices.service-now.com/images/app.ngbsm/disk.svg


var luha = '';		// Add something to new swow line. E.g. '{sa} (DD) ' will add  'LuHa (DD) ' after the starting number of the swow line if you name is Luc Hanssens.
var sep = '';				// Set default separator between linenumer and rest of line. Default is '.', can be ')'.

if (luha.length > 0) {
    GM_setValue('XtraSWOW',luha);
    GM_log('#=static=#  XtraSWOW=', luha);
}
// uncomment to remove this value
//	GM_deleteValue('XtraSWOW');
if (sep.length > 0) {
    GM_setValue('SWOW_sep',sep);
    GM_log('#=static=#  SWOW_sep=', sep);
}
// uncomment to remove this value
//	GM_deleteValue('SWOW_sep');

var timer0 = new Date();
var timer1 = new Date();
var timer2 = new Date();
var timer3 = new Date();
var timer4 = new Date();
var timer5 = new Date();
var timer6 = new Date();
var whatsnew = '';
whatsnew = 'RMA tab check for record. CI link corrected.';	// ver 1.908
whatsnew = 'Tasklist resized to fit smaller screens.';	// ver 1.909
whatsnew = 'Splunk link, mail-templates update';	// ver 1.910
whatsnew = 'Show breaches and breach doc.';	// ver 1.911
whatsnew = 'Use inprogess for sla list again.';	// ver 1.912
whatsnew = 'This version will work on the services instance of ITSM.';	// ver 1.913
whatsnew = 'Cloning of contract change fails, disabled for now';	// ver 1.915
whatsnew = 'IM tags disabled for now';	// ver 1.916
whatsnew = 'Fix SLA\'s in taskslists and minor fixes';	// ver 1.917
whatsnew = 'Indicate via popup required \'load related lists\' with form, and abort script. ';	// ver 1.918
whatsnew = 'New case buttons. Provisionairy fix ';	// ver 1.920
whatsnew = 'Provisionairy SWOW fix ';	// ver 1.921
whatsnew = 'tasklist font adjust ';	// ver 1.922
whatsnew = 'Riverbed, fast reload for unassigned tasklist, reject text to worknotes.';	// ver 1.923
whatsnew = 'Attachments popup restored. ';	// ver 1.928
whatsnew = 'UMICORE links. ';	// ver 1.929
whatsnew = 'UMICORE links. ';	// ver 1.930
whatsnew = 'nolo fix. ';	// ver 1.931
whatsnew = 'Closure buttons checks fix. Scram links for JSR'; 	// ver 1.932
whatsnew = 'Task list coloring old cases fixed'; 	// ver 1.933
whatsnew = 'Template setting window wrap fixed'; 	// ver 1.934
whatsnew = 'Static SWOW settings as requested by Luc Hanssens'; 	// ver 1.935
whatsnew = 'Bugske'; 	// ver 1.936
whatsnew = 'Bugske'; 	// ver 1.937
whatsnew = 'Bugske'; 	// ver 1.938
whatsnew = 'Scram CH Robinson'; 	// ver 1.939
whatsnew = 'Bugske'; 	// ver 1.940
whatsnew = 'Bugskes'; 	// ver 1.941
whatsnew = 'Bugskes'; 	// ver 1.942
whatsnew = 'RMA Tab fixed.'; 	// ver 1.943
whatsnew = 'Html links in case notes are now clickable.'; 	// ver 1.944
whatsnew = 'Fixed old email address format in moveit invite.\nTimes for unassigned case to 60 sec for Benoit.'; 	// ver 1.945
whatsnew = 'Fix for space in lastname gives bad email address.'; 	// ver 1.946
whatsnew = 'RMA button fixed.'; 	// ver 1.947
whatsnew = 'Contact list window fixed. Bad email addresses fixed'; 	// ver 1.948
whatsnew = 'Big link icon fixed. internal ITSM email on top bar'; 	// ver 1.949
whatsnew = 'Bugske in firefox'; 	// ver 1.950
whatsnew = 'Bug Personalize List Columns popup. (Thanks Danny :-)'; 	// ver 1.951
whatsnew = 'Bug Personalize List Columns popup. (Thanks Danny :-)'; 	// ver 1.952
whatsnew = 'Fix in Phonenumber marking and weblinks.'; 	// ver 1.953
whatsnew = 'ITSM+ can now be tried on the support instance of servicesnow https://DDsupport.service-now.com'; 	// ver 1.954
whatsnew = 'Add \'Contact Name\' for Email to overrule Requester/Affected contact in Mail Client configuration.\nRed color for workload and ETA when value is not OK.'; 	// ver 1.955
whatsnew = 'Fixed SDM/AM link under stakeholders tab.'; 	// ver 1.956
whatsnew = 'Fixed SWOW date issue where Save/Update button seemed not to work.\nThanks to Geert, Vijay and Christine for reporting this!!\n\nAdded DDvalidation to the pages that run my script.\nTest the script on the DDsupport and DDvalidation instances on a old copy of your cases.'; 	// ver 1.957
whatsnew = 'Bugske'; 	// ver 1.948
whatsnew = 'Added cookie monster to eat old cookies. (ETA older than 30 days.)\nFixed: Duplicate SWOW line when taking over someone elses case.'; 	// ver 1.959
whatsnew = 'Added queues used by other EU countries'; 	// ver 1.960
whatsnew = 'You can now adjust the reload timer to 2, 5 and 10 minutes by right-clicking the reload progress bar.\nNTT Case link fix.'; 	// ver 1.961
whatsnew = 'You can now adjust the reload timer to 2, 5 and 10 minutes by right-clicking the reload progress bars.\nNTT Case link fixed.'; 	// ver 1.962
whatsnew = 'Technology Field mandatory for closure'; 	// ver 1.963
whatsnew = 'SWOW fix, last SWOW entry, completed or canceled, if no active entry is found.'; 	// ver 1.964
whatsnew = 'SWOW fix, last SWOW entry, completed or canceled, if no active entry is found.\n\nBugske.'; 	// ver 1.965
whatsnew = 'Stop reload timer, when editing task filter in tasklist.'; 	// ver 1.966
whatsnew = 'Use loggedin name for {mf} {ml} in templates instead of assigned name.\nOpen Closure details tab when technology field not filled.'; 	// ver 1.967
whatsnew = 'Fixed bug with tasklist filter and autoreload.'; 	// ver 1.968
whatsnew = 'Fixed those gdamn big icons. \nWill next service-now bring use tiles?. \nWhat a way to waste a saturdayevening, but it beats watching the eurovision songcontest.'; 	// ver 1.969
whatsnew = 'Fixed the menu, so you can: \'Toggle Template Bar\', \'Toggle annotations on / off\' and \'Add a Tag\'.'; 	// ver 1.970
whatsnew = `\n\nImproved Windows95 expirience. ;-) And a popup screen you can't click away.\nFixes and enhancements in case closure.\nBetter detecting of logged in user.
\n\nSwitching between Status in the SWOW screen adds a new SWOW line with a default text!
\n\nBetter detecting of CI, Serial, Vendor and breached and running SLA/OLA's .\n
\nThis version no longer requirers to load the "related tabs" so you could gain a bit of time on pageload.
\nThis means you click on "load related lists" at the bottom of the page, if you need something there.
\n\nThis version uses direct queries into the ITSM database, it no longer depends on parsing to get the results.
\n\nAs always if some doesn\'t work as expected let me know.`; 	// ver 1.971
whatsnew = ''; // ver 1.972 // ver 1.973
whatsnew = 'Bug in RMA tab. (Thanks Nick)'; // ver 1.974
whatsnew = 'Hide workload entry fields on closure, only for Uncovered base contract.\nDetect RMA creation date.\nAdded a jump back up icon, to load related list bar.'; // ver 1.975
whatsnew = 'Consolidation for using the script without loading the related tabs with the page each time.\nFor the sake of faster page load, I would like to request you to change the System Settings -> Forms -> Related list loading to: On-demand'; // ver 1.975
whatsnew = 'Priority field is back on request of Wim, but with colors :-)\nLocation and Site field are gone when empty.\nCustomer Reference added as global variable for mail templates.'; // ver 1.976
whatsnew = 'Location field is back on request of Christine, people do use it and fill/update it during the case.'; // ver 1.977
whatsnew = 'Better detection of email addresses in notes.\nRequest of Wim to highlite updates outside of 9-18 business hours.'; // ver 1.978
whatsnew = 'New RMA administrator email address.'; // ver 1.979
whatsnew = '\nPost buttons for Comments and Work notes Tab. Clicking one, saves both comments and work notes if present.\nAlways keep in mind this only saves the textarea field and not any other fields you may have changed.\n\nSWOW update is now in HTML format.\nWorkload added on submit to closure queue, is now added as non-billable for Uncovered base contracts and Approve is added to MACD and MSEN Request fulfilment contracts.'; // ver 1.980
whatsnew = '\nDo not use the Post button for SWOW updates (yet). Use Save or Update.\n\nSome enhancements in showing the "posted" updates.'; // ver 1.981
whatsnew = '\nSWOW now posts directly to the ITSM server, no need to save/update unless you change other settings like e.g. request/incident status or add workload\n You may notice a blue icon that indicates the record on the server has changed.\nThis is normal.'; // ver 1.982
whatsnew = '\nBug fix SWOW dates.'; // ver 1.983
whatsnew = '\nNew Tab where you can add New Case/RMA/Customer reference/BugID.\nBetter fix for UTC SWOW dates and allow absense of ETA. '; // ver 1.984
whatsnew = '\nAlcatel-Lucent support web link Added.\nHiding the blue banners is now opt-out via \'Configure Actions\' -> \'Other Settings\'.\nBanners can still be seen while page loads and when you hover the orange icon of the associated field.';// ver 1.985
whatsnew = '\nPost SWOW button now checks if you have added an ETA to the update, and if there a multiple ETA\'s and displays a warning in these cases\nFix for contents of tab not displayed.';// ver 1.986
whatsnew = '\nOther fields in SWOW window (product, vendor, etc), now update on change, regardless if you post the SWOW message.\nAdded setting to prevent a default SWOW message on a status change of the case.'; // ver 1.987
whatsnew = '\n\nThis version again opens you case list instead of the home.do!!\nYou can get to the home.do (Employee Self Service) by clicking the dimension data logo.'; // ver 1.988
whatsnew = '\n\nBug opening case url. It also got redirected to the tasklist. Thanks Carlos!!'; // ver 1.989
whatsnew = '\n\nSWOW update now wants an ETA\'s in the future, and will also warn when there is no known customer name to replace CST/cust/client/etc.\nBeta of the Attachments tab, I\'m not 100% there yet.\nIt currently filters duplicate images and some logo\'s\nIt shows more fields than you need because I\'m still brainstorming on how we can hide and show selected attachments in an intuitive way.\nLet me know if you have feedback.'; // ver 1.990
whatsnew = '\n\nBugfix for SWOW update with no new ETA. Thanks Geert.' ; // ver 1.991
whatsnew = '\n\nSmall fix for Attachments tab.(Still Beta.)' ; // ver 1.992
whatsnew = '\n\nQuick fix for editable company name field.' ; // ver 1.993
whatsnew = '\n\nDate conversion fix for firefox users.' ; // ver 1.994
whatsnew = '\n\nDate conversion fix for firefox users. An uncaught typo.' ; // ver 1.995
whatsnew = '\n\nAnother uncaught typo.' ; // ver 1.996
whatsnew = '\n\nReverting to the old code. ' ; // ver 1.997
whatsnew = '\n\nDisplay of, and links to, active and expired, customer and backout contracs.' ; // ver 1.998
whatsnew = '\n\nLink to the contracts for a CI, link to the details of a CI, and a link to the contracts for the customer.\n\nAlso if there is one BO contract with an external ref (e.g cisco contract number) ITSM+ will automatically add this as a Vendor contract.\nSo for the first time we will be able to show the contract the customer has with Dimension Data AND the contract Dimension Data has with the vendor of the CI. (Provided the data from SAP is correct.)' ; // ver 1.999
whatsnew = `\n\nSmoother loading of the CSS adjustments and hiding of fields.
\nRenaming attachments under the Attachments tab, is now possible.
\nFix for the links to the SDM,AM,CM,etc names on sharepoint and wired on the Stakeholders Tab.
\nFix for SLA/OLA % > 99 < 100 (Thanks Dorian.)
\n(since we can\'t seem to get the right names in ITSM)
\n\nNow we have arrived at 2.000, I think I will try not to add too much new stuff anymore,
\nbut instead write down in a document what the various features are, and how to use them.` ; // ver 2.000
whatsnew = '\n\nShow temporary contacts in yellow. ' ; // ver 2.001
whatsnew = '\n\nFix for transparent background of popup screens. ' ; // ver 2.002
whatsnew = '\n\nNew webex site.' ; // ver 2.003
whatsnew = '\n\nAdded CTASK PRJTASK STASK types. I don\'t work with these types so perhaps additional adjusting is required.\n\nFix in tasklist showing Do a SWOW Update when not required.\nFix in swowscreen, continue to copy selected text to last selected field.\nFix in contacts list, some tranparent part where it should not.' ; // ver 2.004
whatsnew = '\n\nForgot to add PRJ project type :-(. that is done now. ' ; // ver 2.005
whatsnew = '\n\nDelegation button added to tasklist.\nIf infotable serialnumber is found in ITSM CI-list, it becomes a link\nContracts will also be using the infotable CI instead of the ITSM CI.\nAdded buttons to find cases for contact or location.' ; // ver 2.006
whatsnew = '\n\nNew Search field.\nLink to parent case.' ; // ver 2.007
whatsnew = '\n\nFirst adjustments to make ITSM+ work on Jakarta release.\nFix for adding external reference under NEW tab should now work again like before.' ; // ver 2.008
whatsnew = `\n\nThis version should work on the Jakarta release, so let me know if you see anything out of the ordinary.
\nYou can test this functionality on: https://dimensiondatavalidation.service-now.com.
\n\nI added an ITSM+ group on yammer that can be used to raise issues or ask questions.
\nI will describe the added functionality for the new versions there as well.
\nA direct Link to the yammer group is under the ITSM+ tab.
\n\nFurther minor changes are: a typo gone in the calendar (thanks Vince),
\nAnd the appearance of the ITSM+ settings icon in the top bar.
\nMoving all setting there under a number of tabs, will be done in due time.
\n\nLast but not least I solved an old ITSM issue where a large white-space appears between the related lists and the response-time bar at the end of the page.
\nThis means you can use ctrl-end to jump to the bottom of the page and see the related lists.
`; // ver 2.009
whatsnew = `\n\nAdded vendor Symantec to the various vendor menus.
\n\nAdded "Contract Management Validation" to the end of the top bar, right-click content menu.
\nThis opens an internal ticket with the country contract team and adds the "EU.SCT Inquiry - Internal" contract
\nand the "EU.<country>.All.CM.ContractManagement" Assignee group and the details from the Info-Table if present.
\n\nSome small CSS improvements to the u_new_call.do page to make it appear correctly on Jakarta release.
`; // ver 2.010
whatsnew = `\n\nChanged closure procedure for GDC1 and GDC2 SD queues, (there appears to be no GDC closure group) assuming cases must go to GSC for closure.
`; // ver 2.011
whatsnew = `\n\nBug fixed in u_new_call.do
`; // ver 2.012
whatsnew = `\n\nTask list colouring of old cases did not work.
\n\nReassign to closure queue button was missing the post button from the case log. Dependency removed.
`; // ver 2.013
whatsnew = `\n\nQuick fix, bad fix. Removing post button dependency introduced racing condition.
`; // ver 2.014
whatsnew = `\n\nThe Contract change Tab did not highlite itself when the contract of a case was changed.
\n\nThe Vendor Genesys has been added to ITSM+ (first phase).
\n\nGerman support will see a link to their Zentral Remote Database.
`; // ver 2.015
whatsnew = `\n\nCases should, as of now, be assigned to the countries servicedesk.closure queue, and no longer to the closure queue of the accountable owner!
\nThis version adjusts the scrip's behavior accordingly.
`; // ver 2.016
whatsnew = `\n\nAdjustment for German closure queue to EU.DE.All.BER.SD.Closure.
\n\nFixed coloring of case priority.
`; // ver 2.017
whatsnew = `\n\nFixed issue where navigation bar was pushed to the left by caseview.
`; // ver 2.018
whatsnew = `\n\nRemoved useless scrollbar on right of tasklist. (Jakarta issue)
\n\nAvoid useless space and scrollbar at bottom of caseview. (Jakarta issue)
\n\nAdded new cisco RMA url
\n\nNew workload entry field that uses Post instead of Update/Save.
\n\nNew default workload setting under ITSM+ settings.
\n\Update check for new ITSM+ script version under ITSM+ settings.
\n\nFixed bug with URL encoding for ZRDB (Thanks Sascha)
\n\nFixed bug with SWOW highlighting (Thanks Vincent)
`; // ver 2.019
whatsnew = `\n\nAdjusted Search field in caseview, to open in new tab, and directly open the case, if found.
\nFix for contacts with double lastname.
\nFix for external reference not always present in iframe.
\nNew Alcatel Lucent support web url.
\nPopup from Jabber phone call now stays when form gets focus and has close button.
\nRevison of vendor web script for better new case url detection.
\nAdjustement for VIP customers, since we now have them (colour and title).
\nAdded support for the Symantec and Genesys support-websites.
\nAdjustement to workload entries not by case assignee, to avoid billable time on case with a uncovered base contract.
\nNew mail templates added. Click Reset Mail Templates button if you don\'t see them appear.
\n\nAlso, on Chrome,  if it doesn't happen automatically, I would urge you to update tampermonkey to version 4.6.
`; // ver 2.020
whatsnew = `
\nFix for work_notes Post button not always adding the workload.
\nFix for focus lost on workload input fields. (Thanks Benoit)
`; // ver 2.021
whatsnew = `
\nFix detecting company name, checking what fields are actually present. (Thanks Sascha)
\nFix for rejecting case back to GDC1 or GDC2 (Thanks Benoit)
`; // ver 2.022
whatsnew = `
\nFixes for using themes
`; // ver 2.023
whatsnew = `
\nFixes for progress bar in tasklist.
`; // ver 2.024
whatsnew = `
\nAdded my own CI search in cases and in 'new_call.do' script.
\nThis also allows to change the contracts of the cases.
`; // ver 2.025
whatsnew = `
\nRemoved some rough edges on my own CI search.
`; // ver 2.026
whatsnew = `
\nAdded functionality to find/detect license keys or PAK's. (Thanks Machi)
\nAllow found CI to be added to infotable (when it cannot be added as case CI due to different company).
\nAdded location to googlemaps link.
`; // ver 2.027
whatsnew = `
\nFix: placeholder for vendor contract if no contractnumber/name is present.
\nFix: url for webex meeting was not always populating correctly.
\nAdded category (subcategory) to CI details url title when present.
`; // ver 2.028
whatsnew = `
\nAdded \'IP address\' search to my own CI search.
\nAdded OS details to the infotable when detected.
`; // ver 2.029
whatsnew = `
\nAdded communications check, if I see deployed status on the CI.
\nImproved OS details on the Info-Table, added more places to detect version info.
`; // ver 2.030
whatsnew = `
\nAdded an option, to turn off the communications check 'run on page load'. You can still run it manually by right-clicking it.
\nFilter on '1.0.0.' IP range for communications check, since these always appear 'reachable' because the IP's are dummies and the devices are monitored by an onsite Nimsoft.
\nIf other IP ranges need to be filtered for any reason let me know.
\nFixed transparent calendar background under planning tab (and elsewhere :-).
\nWhen you enter more then 59 minutes on the workload, it now converts to hours:minutes.
\nAdded the contact_type field in the label of the case number since people indicated they want to see this field.
\nContrary to some believes, it does NOT indicate how you should contact the customer, it just shows how the ticket was opened.
\nAdded the CI class as shown by ITSM, to the Info-Table, for what it is worth.
\nFixed the malformed info-table's under the log tab.
`; // ver 2.031
whatsnew = `
\nWhen a new case is accepted, 5 minutes are automatically put in the workload (and saved when you click the Save/Update button).
\nMoved ITSM+ settings functions from under ITSM main loop, so it can be access from task-list page as well.
\nAdded ITSM+ settings icon to navigation top bar of the task-list.
\nFixed issue with ITSM+ settings form where buttons were displayed not belonging to the selected TAB.
\nFixed absence of delegation button on empty task-list.
`; // ver 2.032
whatsnew = `Fixed forgotten declaration of variable.  =:-/   Thanks Pierrot.
`; // ver 2.033
whatsnew = `
\nAdded link to Manage Center so you can see what your customer sees.
\nSeveral fixes to make ITSM+ play nice with my ITSM themes script.
\nSeveral fixes to the tabs not always rendering correct.
`; // ver 2.034
whatsnew = `
\nAdded dropdown on effort to change activity type. (Works only with Post button.)
\nAdded url for Alcatel-Lucent support web. (Will be shortened to AL-LU in case link.)
\nRemoved & from customer names for zrdb url. (It still finds the customer.)
`; // ver 2.035
whatsnew = `
\nUsing the service-now popup-calendar in SWOW calendar to select the date for the next ETA.
\nMoved the filter-button in the Log tab to the right. So now you can filter you Log entries again.
\nAdd a particalur Alcatel-Lucent company to the Company field on vendorcase creation.
\nAllow scrollbar on sys_user.do page. I didn't check why service-now adds it, when the page size doesn't require scrolling.
`; // ver 2.036
whatsnew = `
\nMoved the links to the vendor support web under the New Tab.
\nMoved a lot of code, removed duplications of code, removed a lot of obsolete comments and code.
\nFixed an issue with with adding workload via the Post Effort.
\n\nAdded a fix for the DE closure queue provided by Christian Geltz.
\nAdded a German version of the SWOW screen. (Can be turned off in ITSM+ settings.) Maybe my translations are not good. :-)  Let me know.
\n\nAdded an indication for Belgium customers, if they are transitioned to a GDC, and if there are in-country delivery constraints, etc.
\nUnfortunately the info provided is not too clear, hope this improves in the future.\nStill wondering how and when I should provide this info, in the best (non-intrusive) way.
`; // ver 2.037
whatsnew = `
\nAdded vendor ALE Rainbow.
`; // ver 2.038
whatsnew = `
\nFix for popup window location.
`; // ver 2.039
whatsnew = `
\nFix for phonenumber dialing.
`; // ver 2.040
whatsnew = `
\nFix for SWOW calendar and icons.
`; // ver 2.041
whatsnew = `
\nFix for SWOW calendar again.
`; // ver 2.042
whatsnew = `
\nZRDB new favicon.
\nRemove Secret link, add PWS link.
\nSWOW Calender date rounding error.
`; // ver 2.043
whatsnew = `
\nNew rejection queue for Belgium.
`; // ver 2.044
whatsnew = `
\nClosure queues removed.
\nITSI detect to avoid HTML update to work_notes.
\nMinor GUI improvements.
`; // ver 2.045
whatsnew = `
Adjusted some URL's to use the new NTT related names.
`; // ver 2.046
whatsnew = `
Change task no longer add 5 minutes on case acceptance.
`; // ver 2.047
whatsnew = `
Rejection queues adkjusted.
`; // ver 2.048
whatsnew = `
Vendor Checkmk added.
Table fix on the "Communications Check" results in log view.
`; // ver 2.049
whatsnew = `
In version 2.037 I introduced an indication if a customer was transitioned to a GDC and to which GDC (1 or 2).
\nI've been made aware the csv file I use todo is no longert maintained because the feature is no longer required.
\nTherefor the feature has been removed from the script.
`; // ver 2.050
whatsnew = `
Some new settings are added.
\nFirst setting disables the automatic setting of the 'Resolved by' field to the assignee, when the field is empty.
\nIf you want this to be set automatically, you must set it!!.
\nSecond setting disables HTML SWOW update. A plain text replacement will be added instead. This is only active when the Integration tab is visible.
\nYou can check in the yammer ITSM+ group for more details.
`; // ver 2.051
whatsnew = `
\nRemoved vendor ALE Rainbow.
\nShow servicenow release and patch level in the navigation page.
`; // ver 2.052
whatsnew = `
\nFix for RSO administration.
`; // ver 2.053
whatsnew = `
\nFix for RSO administration. Second attempt
`; // ver 2.054
whatsnew = `
\nOption to save datetime of completed action.
`; // ver 2.055
whatsnew = `
\nAdd ITSI ticket number to external references.
\nAdd Fix in Phone dialer response to comments.
`; // ver 2.056
whatsnew = `s
\nQuick fix for Orlando release. Leaving the tasklist filter visible for now.
`; // ver 2.057

whatsnew = `
\nMinor changes to play nice with the nttlimitedinternal instance.
\nAdded PTASK to list of pages handled.
`; // ver 2.058

whatsnew = `
\nAdded a button to the email_client.do page, the ITSM build in email.
\nThe button toggles between putting you and bosprod in the from and reply-to field.
\nThis allows you to be compliant with the ITSM email procedure found in:
\nhttps://confluence.nttltd.global.ntt/display/EUMSC/ITSM+-+E-mail+Procedure.
`; // ver 2.059
whatsnew = `
\nAdded extra workload type.
`; // ver 2.060
whatsnew = `
\nUse the NTT Limited Services name for the didatabosprod@service-now.com email.
`; // ver 2.061

whatsnew = `
\nCommented out some lines suspected of making changes, when rejecting an assigned case.
`; // ver 2.062

whatsnew = `
\nQuick fix, to allow a privacyStatement page to appear.
\nI will investigate later what goes wrong later.
`; // ver 2.063
whatsnew = `
\nQuick fix, to remove A1_ prefix when searching Customer Name in ZRDB.
`; // ver 2.064                                                                     // Fix for a rename of customers in ITSM  by our new ITSM+ guru Christian Woerstenfeld
whatsnew = `
\nURL for MoveIt adjusted to ntt domain.
`; // ver 2.065
whatsnew = `
\nUpdate of text in the SWOW screen label, as requested by Nika Arriesgado
`; // ver 2.066

whatsnew = `
\nQuick fix for issue with unsafeWindow.g_form and unsafeWindow.NOW.
`; // ver 2.067


var scriptversion = GM_info.script.version;
var ITSMupdates = '';
var SNrel='';
var release='';
var SNpatch='';

var newversion = 'Welcome to version ' + scriptversion + ' of the: \'ITSM+\' script.\n\n\I believe this is the first time you run this version of the script.\n\nNew in this version is: ' + whatsnew;
newversion += '\n\nEnjoy.\n\nMichel :-)\n\n';

var kerstmis = `\n\n\
Prettige Feestdagen.		   \/\\		\n\
Bonnes fêtes.		         \/o.\\		\n\
Season greetings.		\/.o .\\	\n\
Frohe Feiertage.                \/o . o.\\	\n\
\/. o. o. o\\\n\
\/----n n----\\`;

var nieuwjaar = `\n\n\
Gelukkig Nieuwjaar.\n\
Bonne Année.\n\
Happy New Year.\n\
Frohes Neujahr.\n`;


if (typeof unsafeWindow === "undefined") unsafeWindow = window;
var result;
var SS = unsafeWindow.document.styleSheets;
// GM_log('# ', SS, SS.length);
for(var i=0; i<SS.length; i++) {
    //    GM_log('# ', SS[i], SS[i].length);
    if ( SS[i].hasOwnProperty('cssRules') ) {
        for(var j=0; j<SS[i].cssRules.length; j++) {
            if(SS[i].cssRules[j].selectorText == "body") {
                result = SS[i].cssRules[j].style;
            }
        }
    }
}
GM_log('# CSS ', result);


// GM_addStyle(' table.wide			{ max-width:1500px !important;width:1450px !important; }');

GM_addStyle(`
body       { scroll-behavior: smooth; }
.fieldmsg  { display:none; }
`);
GM_addStyle(' a.linked   { white-space:nowrap !important;}' );	// disable if you need a bigger screen
GM_log('#=#=#=# started ');
var script = window.location.pathname;
var hostn  = window.location.host;
var search = window.location.search;
GM_log('#=#=#=# started script:' + script + ' on ' + hostn);

if (typeof unsafeWindow === "undefined") {
    unsafeWindow = window;
    GM_log('#=#=#=# unsafeWindow is not defined');
} else {
    GM_log('#=#=#=# unsafeWindow is defined');
}

// ==============================================================================================================================================================
//
// PWS
//
// ==============================================================================================================================================================

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready( function() {

    if ( hostn === 'pws' && script === '/' ) {
        GM_log('#=#=#=# ' , search );
        var cust;
        if ( search.indexOf('=') > -1 ) cust = search.split('=')[1];
        var pwstimer = setInterval(function(){
            var shfrm = document.getElementById("shell_frame");
            var iframesh = $('#shell_frame');
            if (shfrm) {
                //            GM_log('#=#=#=# shell_frame found');
                var npfrm = shfrm.contentWindow.document.getElementById("RAD_SPLITTER_PANE_EXT_CONTENT_navigationPane");
                var iframenp = $('#RAD_SPLITTER_PANE_EXT_CONTENT_navigationPane', iframesh.contents() );
                if (npfrm) {
                    //                GM_log('#=#=#=# navigationPane found');
                    var tlfrm = npfrm.contentWindow.document.getElementById("RAD_SPLITTER_PANE_EXT_CONTENT_topLeftPane");
                    var iframetl = $('#RAD_SPLITTER_PANE_EXT_CONTENT_navigationPane', iframenp.contents() );
                    if (tlfrm) {
                        //                    GM_log('#=#=#=# topLeftPane found');
                        var searchbox = tlfrm.contentWindow.document.getElementById("RadComboBox1");
                        var jqsearchbox = $('#RadComboBox1', iframetl.contents() );
                        if ( searchbox ) {
                            GM_log('#=#=#=# searchbox found ',  searchbox.length );
                            GM_log('#=#=#=# searchbox found ',  searchbox );
                            GM_log('#=#=#=# searchbox found ',  jqsearchbox.length );  // #RadComboBox1
                            GM_log('#=#=#=# searchbox found ',  jqsearchbox );  // #RadComboBox1
                            GM_log('#=#=#=# searchbox found ', $('#PasswordstateLogo').length );
                            searchbox.focus();
                            searchbox.value = cust;
                            jqsearchbox.val(cust);
                            var e = jQuery.Event("keydown");
                            e.which = 13;
                            $('#RadComboBox1', iframetl.contents() ).trigger(e);
                            //                                    const ke = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: 13 });
                            //                                    tlfrm.contentWindow.document.body.dispatchEvent(ke);
                            //                        tlfrm.contentWindow.document.getElementById("RadComboBox1_ClientState").value = '{"enabled":true,"emptyMessage":"Search Password Lists or Folders ...","validationText":"' + cust + '","valueAsString":"' + cust + '","lastSetTextBoxValue":"' + cust + '"}';
                            //{&quot;enabled&quot;:true,&quot;emptyMessage&quot;:&quot;Search Password Lists or Folders ...&quot;,&quot;validationText&quot;:&quot;ineos&quot;,&quot;valueAsString&quot;:&quot;ineos&quot;,&quot;lastSetTextBoxValue&quot;:&quot;ineos&quot;}
                            //{"enabled":true,"emptyMessage":"Search Password Lists or Folders ...","validationText":"ineos","valueAsString":"ineos","lastSetTextBoxValue":"ineos"}
                            tlfrm.contentWindow.document.getElementById("SearchButton").click();
                            clearInterval(pwstimer );
                        }
                    }
                }
            }
        },1000);
    }
});
// ==============================================================================================================================================================
//
// Manage Center
//
// ==============================================================================================================================================================

if ( hostn === 'manage.dimensiondata.com' ) {
    var ach = GM_getValue('manage');
    GM_log('# we are on manage ---- ' , ach);
    if ( ach && ach.indexOf('|') > -1 ) {
        GM_log('# we are on manage and have a GMcookie ');
        if ( typeof user !== 'undefined' ) GM_log('# user ', user);
        var id  = ach.split('|')[0];
        var nm  = ach.split('|')[1];
        setCookie('usp.companyId',   id, null);
        setCookie('usp.companyName', nm, null);
        GM_log('# we are on manage setting ' , nm, id );
    }
    if ( location.pathname.indexOf('company_filter') > -1 ) {
        GM_log('# redirecting to /#/,.....  usp.companyId=',   getCookie('usp.companyId'));
        window.location.assign("https://manage.dimensiondata.com/#/");
    }
    GM_log('# manage center stuff done');
    return; // spaghetti coding  :-)
}

var sel_target = '';
var $target = null;
var xoff=0, yoff=0;
var info = ['', '', '', '', '', ''];
var CI_class  = '';
var CI_status = '';
var CIlnk     = '';
var CI_rim    = '';
var CI_ipaddr = '';
var CI_self   = '';
var CI_depl   = '';
var main_ci   = '';
var CI_is_virt = false;
var supportingcontracts = '';
var activeBOcontractID  = '';
var breach_msg = '';
var breach     = 0;
var undoc      = 0;
var nrsla      = 0;
var nrslarun   = 0;
var timeworked = '';
var timeworkedb = '';
var maildet    = '';
var caselinks  = '';
var rmalinks   = '';
var hold       = 0;
var tml        = '';
var u_ext_ref_no_calc = '';
var mnt = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var wkd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var activeBOcontractID = '';
var comchk_from = 0;
var urlstr = [];
var usecountry     = ( GM_getValue('usecountry')  === 'off' ) ? ' ' : 'checked' ;

// casenr = $('#sys_displayValue').val();
if (script.indexOf('$') < 0 ) {
    var casenr= $('#' + script.replace('.do','').replace('/','') + '\\.number').val();
    var curaction   = $('#sys_readonly\\.' + script.replace('.do','').replace('/','') + '\\.state option:selected').val();                                                       //  7 Closed
    var Assigneegrp = $('#sys_display\\.'  + script.replace('.do','').replace('/','') + '\\.assignment_group').val();
}

var prbarea = '';
var prbstat = GM_getValue('prbstat'+casenr,'');
var etadt =   GM_getValue(casenr + '_ETA','');
GM_log('#=#=# stored ETA ', etadt);
var prbdesc = GM_getValue('prbdesc'+casenr,'');
var prbimpt = GM_getValue('prbimpt'+casenr,'');
var prbactp = GM_getValue('prbactp'+casenr,'');
var dt = new Date();
var dd = function(p){ return (''+p).length<2?'0'+p:''+p; };
var rnow = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();

var instance='';
var domain='';

var loggedin = '';
var shortassign = '';
var custnm     = '';
var custfn = '';   // Customer firstname lastname as global vars
var custln = '';
var mlt;
var tolist  = '';
var cclist  = '';
var myemail = '';
var swowentries = 0;
var CustNM = '';
var MyFirstName = '';
var MyLastName  = '';
var Assignee    = '';
var swow    = '';
var siteid     = '';
var client_ref    = '';
var Ushortassign    = '';
var locationname     = '';
var tosub    = '';
var mcc    = '';
var casepriority   = '';
//var mcc    = '';
//var mcc    = '';

var sep1 = '';
var sep2 = '';
var sep3 = '';


// #list_nav_task > div.container-fluid
if ( location.hostname.indexOf('.service-now.com') > -1 ) {
    if ( location.hostname.slice(0,5) !== 'didata' ) {
        instance = location.hostname.slice(13).replace('.service-now.com','');
        domain = location.hostname.slice(0,13);
    } else {
        instance = location.hostname.slice(5).replace('.service-now.com','');
        domain = location.hostname.slice(0,5);
    }
}
var bgcolor = '';
var txtcolor = '';
if ( GM_getValue('ITSMbgcolor' ) ) { GM_log('# ', GM_getValue('ITSMbgcolor' )); bgcolor = GM_getValue('ITSMbgcolor' ); }
if ( GM_getValue('ITSMtxtcolor') ) { GM_log('# ', GM_getValue('ITSMtxtcolor')); txtcolor = GM_getValue('ITSMtxtcolor' ); }

if ( bgcolor !== '' && txtcolor !=='') {
    setcolors( bgcolor,txtcolor );
    GM_log('# colors' ,bgcolor,txtcolor);
} else {
    GM_log('# nocolors');
}

GM_addStyle(' .vt				{ padding:0px 4px 0px 4px !important;	 }');
GM_addStyle(' .navbar			{ padding:0px 4px 0px 4px !important;  }');
GM_addStyle(' .list_nav			{ font-size:12px !important;  }');
GM_addStyle(' .btn-icon			{ font-size:12px !important; line-height:10px !important; padding:0px !important; height:13px !important;	 }');
GM_addStyle(' .mybut 		{ background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff !important;padding:3px 4px 3px 4px;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
GM_addStyle(' .mybut:hover	{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0 !important;padding;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px  rgba(0,255,0,1.0) !important;}');
GM_addStyle(' .mybut:after	{ position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
GM_addStyle(' .phncl            { margin-right:2px; width:14px; height:14px; }');
GM_addStyle(' input[type=checkbox].ch                 { display:none; } ');
GM_addStyle(' input[type=checkbox].ch + label         { background:#999;width:17px;height:17px;display:inline-block;padding:2px 4px 3px 4px;border:solid 1px #000;border-radius:4px; margin-top:4px; }'); //text-align:center;margin-left:auto;margin-right:auto; // min-height:17px;
GM_addStyle(' input[type=checkbox].ch:checked + label { background:#DFE;color:#000 !important;  } ');
GM_addStyle(' input[type=radio].ch                 { display:none; } ');
GM_addStyle(' input[type=radio].ch + label         { background:#888;color:#fff;min-height:17px;width:auto;display:inline-block;padding:2px 4px 4px 4px;border:solid 1px #000;border-radius:4px;} '); //text-align:center;margin-left:auto;margin-right:auto;
GM_addStyle(' input[type=radio].ch:checked + label { background:#DFE;color:#000 !important;  } ');
GM_addStyle(' .form_action_button.btn.btn-default       { background-color:#DFE;background: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff !important;margin-right:6px ;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
GM_addStyle(' .form_action_button.btn.btn-default:hover	{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE) !important;border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0) !important; }');
GM_addStyle(' .form_action_button.btn.btn-default:after { position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
GM_addStyle(' a.normalbg {    color: #000;}');

// ==============================================================================================================================================================
// =                                                    ITSM build-in email                                                                                     =
// =                                                                                                                                                            =
if ( script === '/email_client.do' ) {
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {
        if ( GM_getValue('curlist')) {
            var list = GM_getValue('curlist');
            casenr = $('#subject').val().split(' ')[0];
            GM_log('# email_client', casenr, list );
            var bosprod =$('#MsgFrom').val();
            if ( list.indexOf(casenr) > -1 ) {
                var tolist = list.split('?subject=')[0].replace('mailto://','');
                var cclist = list.split('&CC=')[1];
                var frlist = cclist.split('&FROM=')[1];
                cclist = cclist.split('&FROM=')[0];
                //					alert(frlist + '  ' + tolist + '  ' + cclist  );
                $('#MsgFrom').val(frlist);
                $('#MsgReplyTo').val(frlist);
                $('#sys_display\\.to_block').val(tolist);
                $('#sys_display\\.cc_block').val(cclist);
            }
            $(`<span title="This button will toggle between you in the 'CC', and bosprod in the 'From' and 'Reply-to fields'" class="header-span"><button id="defb" class="mybut">Default</button> &nbsp; </span>`).insertBefore('#emailclient > nav > div > div > div:nth-child(1) > div > span:nth-child(1)'); //#emailclient > nav > div > div #emailclient > nav > div > div > div:nth-child(1) > div > span:nth-child(1)
            $('#defb').click( function() {
                if($('#MsgFrom').val() === bosprod) {
                    $('#MsgFrom').val(frlist);
                    $('#MsgReplyTo').val(frlist);
                    $('#sys_display\\.cc_block').val(cclist);
                } else {
                    $('#MsgFrom').val(bosprod);
                    $('#MsgReplyTo').val(bosprod);
                    $('#sys_display\\.cc_block').val(frlist+';'+cclist);
                }
                return false;
            });
        }
    });
}
// ==============================================================================================================================================================





// ==============================================================================================================================================================
// =                                                    Scram                                                                                                   =
// =                                                                                                                                                            =
if ( window.location.hostname.indexOf('scram.client.') > -1 ) {
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {
        var CustNM = '';

        if ( $('h1:contains("You are authenticated to the Dimension Data SCRAM solution.")').length > 0 ) {
            var qsparam = []; //new Array();
            var query = window.location.search.substring(1);
            var parms = query.split('&');
            for (var i = 0; i < parms.length; i++) {
                var pos = parms[i].indexOf('=');
                if (pos > 0)
                {
                    var key = parms[i].substring(0, pos);
                    var val = parms[i].substring(pos + 1);
                    qsparam[key] = val;
                    if (key === 'cust') {
                        CustNM = decodeURIComponent(val);
                    }
                }

            }
            $('<p id=addhere><font color=blue>ITSM+</font> links for customer:[' + CustNM + '].</p><p>If you cannot find your Scram device checkout this <a title="If you give some time, a filter to search the customer will appear.(No masterdata customer-names.)" href="http://hal.eu.didata.local/nick.bettison/scram/" target="_new">server</a> ').insertAfter('h1:contains("You are authenticated to the Dimension Data SCRAM solution.")');
            CustNM = CustNM.toLowerCase();


            if (CustNM === 'acv/csc'     ) { $('#addhere').append('<p><a href=rdp://10.128.11.81>Nimsoft Server</a></p><p><a href=http://10.128.11.81>Nimsoft UMP</a></p><p><a href=https://10.128.11.83/webacs/pages/common/login.jsp>ACV PI</a></p>'); }
            if (CustNM === 'jsr'         ) { $('#addhere').append('<span id=scramlinks><p><a href=https://10.128.86.131:4434>fw1-jsrmicro</a><br><a href=https://10.128.86.132:4434>Dfw2-jsrmicro</a><br><a href=https://10.128.86.133>FortiAnalyzer</a><br><a href=https://10.128.86.134>ironport1</a><br><a href=https://10.128.86.135>ironport2</a></p></span>'); }
            if (CustNM === 'umicore'     ) { $('#addhere').append('<span id=scramlinks><p><a href=https://10.128.57.37>DD-CLP-FW01</a><br><a href=https://10.128.57.38>DD-CLP-FW01_S</a><br><a href=https://10.128.57.42>DD-GUA-FW01</a><br><a href=https://10.128.57.43>DD-GUA-FW01_S</a><br><a href=https://10.128.57.39>DD-HKC-FW01</a><br><a href=https://10.128.57.40>DD-HKC-FW01_S</a><br><a href=https://10.128.57.35>DD-HOB-FW01</a><br><a href=https://10.128.57.36>DD-HOB-FW01_S</a><br><a href=https://10.128.57.46>DD-SUC-FW01</a><br><a href=https://10.128.57.47>DD-SUC-FW01_S</a><br><a href=https://10.128.57.44>DD-WOL-FW01</a><br><a href=https://10.128.57.45>DD-WOL-FW01_S</a><br><a href=https://10.128.57.33>HOB-FW-SCADA</a><br><a href=https://10.128.57.34>HOB-FW-SCADA_S</a></p><p><a href=RDP://10.128.57.27>Jumpserver</a></p></span>'); }
            if (CustNM === 'ch robinson' ) { $('#addhere').append('<span id=scramlinks><p><a href=ssh://10.128.8.32>G450 Warsaw</a><br><a href=ssh://10.128.8.33>G450 Wroclaw</a><br><a href=ssh://10.128.8.34:222>SBC01</a><br><a href=https://10.128.8.34>SBC01</a><br><a href=ssh://10.128.8.35>CM VIP</a><br><a href=https://10.128.8.35>CM VIP</a><br><a href=ssh://10.128.8.36>CM1</a><br><a href=https://10.128.8.36>CM1</a><br><a href=ssh://10.128.8.37>CM2</a><br><a href=https://10.128.8.37>CM2</a><br><a href=ssh://10.128.8.38>ASM1 Admin</a><br><a href=ssh://10.128.8.39>SMGR</a><br><a href=https://10.128.8.39>SMGR</a><br><a href=ssh://10.128.8.40>Utility</a><br><a href=https://10.128.8.40>Utility</a><br><a href=ssh://10.128.8.41>WebLM</a><br><a href=https://10.128.8.41>WebLM</a><br><a href=ssh://10.128.8.42>G430 Interxion</a><br><a href=ssh://10.128.8.43>G430 Antwerp</a><br><a href=ssh://10.128.8.44>G430 Caen</a><br><a href=ssh://10.128.8.45>G430 Roissy</a><br><a href=ssh://10.128.8.46>G430 Derby</a><br><a href=ssh://10.128.8.47>G430 Schiphol</a><br><a href=ssh://10.128.8.48>G430 London</a><br><a href=ssh://10.128.8.49>G430 S Sebastian</a><br><a href=ssh://10.128.8.50>G450 Amsterdam HQ</a><br><a href=ssh://10.128.8.51>G430 Amsterdam TMC</a><br><a href=ssh://10.128.8.52>G450 Milan</a><br><a href=ssh://10.128.8.53>G450 Manchester</a><br><a href=ssh://10.128.8.54>G430 Budapest</a><br><a href=ssh://10.128.8.55:222>SBC02</a><br><a href=https://10.128.8.55>SBC02</a><br><a href=ssh://10.128.8.56>ASM2</a><br><a href=rdp://10.128.8.57>Windows 2012 SNMP Agent</a></p></span>'); }
            if (CustNM === 'emmaus ict'  ) { $('#addhere').append('<span id=scramlinks><p><a href=rdp://10.128.2.237>Jump Server</a><br></p></span>'); }


            if ( linkslist.length > 0 ) { $('#addhere').append('<span id=scramlinks><p>' + linkslist + '</span>'); }

            $('#addhere').append('&nbsp;<p>&nbsp;<p>&nbsp;<p>Download rdp.bat - <a href=http://www.jjclements.co.uk/wp-content/uploads/2010/02/rdp.zip>HERE</a> to add Remote Desktop support for rdp links.</p>');
            $('#addhere').append('<p>Links for your customer not here? Tell <a href="mailto://michel.hegeraat@global.ntt?subject=Scram customer links&body=ITSM Customer name=%0A%0A<protocol>,<link>,<name>%0A%0AExample:%0ARDP, 10.128.11.81, Nimsoft." >me</a> (ITSM) customer name and a list of links. </p>');

            $('#scramlinks').find('a').each( function() {
                if ( $(this).attr('href').indexOf('http') > -1 ) { GM_log('# href contains HTTP', $(this).attr('href')  ); $(this).prepend('HTTP==> &nbsp; ');  }
                if ( $(this).attr('href').indexOf('rdp:') > -1 ) { GM_log('# href contains RDP' , $(this).attr('href')  ); $(this).prepend('RDP==> &nbsp; '); }
                if ( $(this).attr('href').indexOf('ssh:') > -1 ) { GM_log('# href contains SSH' , $(this).attr('href')  ); $(this).prepend('SSH==> &nbsp; '); }
            });

            //				alert('authenticated');
        }
    });

}
// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    MOVEit                                                                                               =
// =                                                                                                                                                            =
if (  window.location.hostname.indexOf('moveit') > -1 ) {
    // ==============================================================================================================================================================
    GM_log('#=#=#=# MOVEit');
    var casedt = new Date( GM_getValue('casedt') );
    var dt = new Date();

    if ( (dt - casedt) < 36000000 ) {
        GM_log('#=#=#=# cookie OK', (dt - casedt) );
        var casemoveit = GM_getValue('casemoveit').split(';');
        GM_log('#=#=#=# cookie OK', casemoveit );
        var recep = casemoveit[0];
        var subj = decodeURIComponent(casemoveit[1]);
        var body = casemoveit[2];
        GM_log('#=#=#=# ? ---' ,  body);

        var body = casemoveit[2].replace(/%0A%0D%0A%0D%0A%0D%0A%0D/g,'<br></br>').replace(/%0D%0A%0D%0A/g,'<br></br>').replace(/%0A%0D%0A%0D/g,'<br></br>').replace(/%0D%0A/g,'<br></br>').replace(/%0A%0D/g,'<br></br>').replace(/%20/g,' ');
        //			var body  = decodeURIComponent(casemoveit[2]);

        $('input#tofield').val(recep);
        $('input#fieldsubject').val(subj);

        GM_log('#=#=#=# ? ---' );
        GM_log('#=#=#=# ? ', $('iframe#arg04').length );
        GM_log('#=#=#=# ? ', $('iframe#arg04').contents().find() );

        GM_log('#=#=#=# 1 ? ', $('iframe#arg04').contents().find('html#arg04 > body').length                );
        GM_log('#=#=#=# 2 ? ', $('iframe#arg04').contents().find('html#arg04 > body:nth-child(2)').length   );
        $('iframe#arg04').contents().find('html#arg04 > body:nth-child(2)').html(body);

        GM_log('#=#=#=# ? ach' );
    } else {
        GM_log('#=#=#=# cookie too old! ', (dt - casedt), dt  , casedt );
    }

}
// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    Noc Forum                                                                                               =
// =                                                                                                                                                            =
if ( script === '/phpbb3_1/viewforum.php' ) {
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {

        var script = window.location.pathname;
        GM_log('#=#=#=# started script:' + script);

        if ( location.search.indexOf('f=177') > -1 ) {
            $('div#page-body > h2:nth-child(1)').append('<span> Search: <input id="combo1" list="combolist" type="text" /></span><datalist id="combolist"></datalist>');

            $('a.forumtitle').each( function() {
                //					GM_log('# forum ', $(this).text() );
                $('#combolist').append('<option value="' + $(this).attr('href') + '">' + $(this).text() + '</option>');
            });

            $('#combo1').on('input', function () {
                var val = this.value;
                GM_log('#=#=#=# customer ? ' + this.value );
                if ( $('#combolist option').filter( function(){
                    return this.value === val;
                }).length ) {
                    GM_log('#=#=#=# customer ? ' + this.value );
                    location.href = this.value;
                    //						alert(this.value);
                }
            });
        }


        if ( location.search.indexOf('look4=') > -1 ) {
            var cust = decodeURI( location.search.split('look4=')[1].split('&')[0] ).replace('/','-');

            //				if (cust === '' )			{ cust = ''; }

            if (cust) {
                GM_log('#=#=#=# look4 customer:' + cust);
                var t = $('a.forumtitle:contains("' + cust + '")').length ;
                GM_log('#=#=#=# customer found? ', t );
                if (t > 0 ) {
                    $('a.forumtitle:contains("' + cust + '")').each( function() {
                        GM_log('#=#=#=# customer found? ' + $(this).text(), $(this).attr('href') );
                        location.href = $(this).attr('href');
                    });
                } else {
                    $('#combo1').val(cust);
                }
            }
        }


        GM_log('#=#=#=# script ended:' + script);


    });
}

if (script.indexOf('/phpbb3_1/adm/') > -1) {
    GM_addStyle(' tr:hover { background-color: #c8c8cF; }' );
}

// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    Sharepoint Customers                                                                                    =
// =                                                                                                                                                            =
if ( script.indexOf('/communities/eu/be.belgium/Lists/') > -1 || script.indexOf('/Lists/Customers') > -1 ) {
    // ==============================================================================================================================================================


    // https://wired.DD.com/communities/eu/be.belgium/Lists/Cust/AllItems.aspx?&FilterField1=Customer_x0020_Group0&Filter=1&View={598D5911-E1D1-4B5A-95B9-FEF74261AB1C}
    // https://wired.DD.com/communities/eu/be.belgium/cdc/_layouts/viewlsts.aspx?BaseType=1&authToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkI0MEYwa0NkRENGVW93UENITmtta2MxV3d4YyJ9.eyJhdWQiOiJ1cm46QXBwUHJveHk6Y29tIiwiaXNzIjoiaHR0cDovL2F1dGguZGltZW5zaW9uZGF0YS5jb20vYWRmcy9zZXJ2aWNlcy90cnVzdCIsImlhdCI6MTQ3Nzk5MTUxNiwiZXhwIjoxNDc3OTk1MTE2LCJyZWx5aW5ncGFydHl0cnVzdGlkIjoiNTllNjZlY2UtY2UxOS1lNjExLTgwZmEtMDAxNTVkODQxNjBkIiwidXBuIjoibWljaGVsLmhlZ2VyYWF0QGRpbWVuc2lvbmRhdGEuY29tIiwiY2xpZW50cmVxaWQiOiIzZmM3MzgzYi0yNzcwLTAwMDEtYjY0ZC1lNjNmNzAyN2QyMDEiLCJhdXRoX3RpbWUiOiIyMDE2LTExLTAxVDA5OjExOjA5Ljg0MVoiLCJhdXRobWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6UGFzc3dvcmRQcm90ZWN0ZWRUcmFuc3BvcnQiLCJ2ZXIiOiIxLjAifQ.eMGAVMgnfbV1LIIMyoHDCET9-pR7g88GkiYebV2CwIrO0_9k24BWdbIl7d5VP7CT9Bq9m4uzxy0UKgVa9yD2AN63LtwQMBQcolW0C00VlmNHA-CyhhVAfcDAFpPqlBrGzYBPox7HcRmOAl7bYHnTNiXlRmMJ70W25uou4AI1YRhi3qt2QwaJB_HOCc1zB9Pc2oeHuAmk5IsOmP9yqcIWa12t6ZQvJFxw6lriPnth7JS3MHWFwRnF7X0-nN75t5z7k4irwu9ZwrEG0AvhnugLAXiSmrNsPT5R84HqkNwnIE55r9FJF86GOs56PE6jFHlh_H-k3zKjJ-Hx8YJKE_pOiA&client-request-id=3fc7383b-2770-0001-b64d-e63f7027d201

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {
        var cust = '';
        var script = window.location.pathname;
        GM_log('#=#=#=# started script:' + script);

        if (location.search.indexOf('FilterValue1=') > -1 ) {
            cust = decodeURI( location.search.split('FilterValue1=')[1].split('&')[0].toUpperCase() );
            GM_log('#=#=#=# look4 customer:' + cust);
            if ( $('#diidFilterCustomer_x0020_Group0 option').filter( function() { return this.value === cust; } ).length > 0 ) {
                location.href = script+ '?FilterField1=Customer_x0020_Group0&FilterValue1=' + cust ;
            }
            if ( $('#diidFilterCustomer_x0020_Group option').filter( function() { return this.value === cust; } ).length > 0 ) {
                location.href = script+ '?FilterField1=Customer_x0020_Group&FilterValue1=' + cust ;
            }
            if ( $('#diidFilterLinkTitle option').filter( function() { return this.value === cust; } ).length > 0 ) {
                location.href = script+ '?FilterField1=LinkTitle&FilterValue1=' + cust ;
            }
        }

        GM_log('#=#=#=# dropdown x0020_Group0 ' + $('#diidFilterCustomer_x0020_Group0').length + ' x0020_Group ' + $('#diidFilterCustomer_x0020_Group').length );
        var $options;
        //  diidFilterCustomer_x0020_Group0
        if ($('#diidFilterCustomer_x0020_Group0').length > 0 ) {
            $('#diidFilterCustomer_x0020_Group0').hide().parent().prepend('<input id="combo1" list="datalist1"  type="text" size=30 /> <datalist id="datalist1"></datalist>');
            $options = $('#diidFilterCustomer_x0020_Group0').clone();
        } else {
            //  diidFilterCustomer_x0020_Group
            $('#diidFilterCustomer_x0020_Group').hide().parent().prepend('<input id="combo1" list="datalist1"  type="text" size=30 /> <datalist id="datalist1"></datalist>');
            $options = $('#diidFilterCustomer_x0020_Group').clone();
        }
        $('#datalist1').append( $options );

        $('#diidFilterLinkTitle'            ).hide().parent().prepend('<input id="combo2" list="datalist2"  type="text" size=30 /> <datalist id="datalist2"></datalist>');
        $options = $('#diidFilterLinkTitle').clone();
        $('#datalist2').append( $options );
        $('#diidFilterUsual_x0020_Name'     ).hide().parent().prepend('<input id="combo3" list="datalist3"  type="text" size=40 /> <datalist id="datalist3"></datalist>');
        $options = $('#diidFilterUsual_x0020_Name').clone();
        $('#datalist3').append( $options );

        if (cust) {
            $('#combo1').val(cust);
            $('#combo2').val(cust);
            $('#combo3').val(cust);
        }
        $('#combo1').on('input', function () {
            var val = this.value.toUpperCase();
            if ( $('#datalist1 option').filter( function() { return this.value === val; } ).length ) {
                GM_log('#=#=#=# customer ' + val + ' found !! ');
                if ( $('#diidFilterCustomer_x0020_Group0').length > 0 ) {
                    location.href = script+ '?FilterField1=Customer_x0020_Group0&FilterValue1=' + val ;
                } else {
                    location.href = script+ '?FilterField1=Customer_x0020_Group&FilterValue1=' + val ;
                }
                //					location.href = '/communities/eu/be.belgium/Lists/Cust/Summary.aspx?FilterField1=Customer_x0020_Group0&FilterValue1=' + val ;
            }
        });

        $('#combo2').on('input', function () {
            var val = this.value;
            if ( $('#datalist2 option').filter( function() { return this.value === val; } ).length ) {
                GM_log('#=#=#=# customer ' + val + ' found !! ');
                location.href = script+ '?FilterField1=LinkTitle&FilterValue1=' + val ;
            }
        });
        GM_log('#=#=#=# script ended:' + script);

    });
}
// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    ITSM top page                                                                                           =
// =                                                                                                                                                            =
if ( window.location.host.indexOf('.service-now.com') > -1  && ( script === '/u_privacyStatement.do' || script === '/not_allowed.do' || script === '/nav_to_.do' ) ) {
    // script === '/nav_to.do' ||
    // script === '/u_privacyStatement.do' ||
    // script === '/not_allowed.do' ||
    // script === '/home.do'  ||
    // script === '/navpage.do' ||
    // script === '/'  ||
// ==============================================================================================================================================================


    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {
        var cust = '';
        var script = window.location.pathname;
        GM_log('#=#=#=# --top page--  started script:' + script);

        if (typeof unsafeWindow === "undefined") {
            unsafeWindow = window;
        }

        if ( script === '/u_privacyStatement.do' ) {
            GM_log('#=#=#=# redirect ' + script + ' to /task_list.do?sysparm_query=active=true^assigned_to=' + unsafeWindow.NOW.user.userID + '^u_majorISEMPTY^EQ&sysparm_cancelable=true' );
            setTimeout(function() {
                unsafeWindow.window.location.assign('/task_list.do?sysparm_query=active=true^assigned_to=' + unsafeWindow.NOW.user.userID + '^u_majorISEMPTY^EQ&sysparm_cancelable=true');
//                unsafeWindow.window.location.assign('/nav_to.do?uri=%2Ftask_list.do%3Fsysparm_view%3D%26sysparm_query%3Dactive%3Dtrue%5Eassigned_to%3D'
//                                                    + unsafeWindow.NOW.user.userID
//                                                    + '%5Eu_majorISEMPTY%5EEQ%26sysparm_userpref_module%3D1523b8d4c611227b00be8216ec331b9a%26sysparm_clear_stack%3Dtrue');
            },3000);
            return;
        }

        if ( script === '/not_allowed.do' ) {
            GM_log('#=#=#=# redirect ' + script + ' to /');
            setTimeout(function() {
                unsafeWindow.window.location.assign('/');
            },3000);
            return;
        }



        $('div.container-fluid > div.navbar-header').append(`<td colspan=11 style="line-height: 0px !important;height: 0px !important;"><table id=shhd3><tr><td style="line-height: 0px !important;height: 0px !important;width: 0px !important;">
<iframe src="/stats.do" id="externalref3" style="display:none;"></iframe></td></tr></table></td>`);
        GM_log('# ITSM release iframe added ', $('iframe#externalref3').length);
        $('body').append('<div id="floattest" style="position:fixed;right:30px;bottom:20px;"><div>');

        GM_addStyle(' td, input, select	{ padding-top:0px !important; padding-bottom:0px !important;line-height:13px !important;	 }');
        GM_addStyle(' body				{ font-size:12px !important; line-height:13px !important; padding:0px !important;	 }');
        GM_addStyle(' .mybut		{ background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
        GM_addStyle(' .mybut:hover	{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px  rgba(0,255,0,1.0) !important;}');
        GM_addStyle(' .mybut:after	{ position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');

        addScriptNode();

        var ttl = document.title;
        var ttl2 = '';
        if ( ttl.indexOf('#') > -1 ) ttl = ttl.split('#')[1];
        if ( ttl.indexOf('>') > -1 ) ttl2 = ttl.split('>')[1].split('<')[0];
        ttl = ttl.split(';')[0];
        $('body > div > header > div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header').css('margin-top','5px');
        $('body > div > header > div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > a').removeClass('navbar-brand').attr('style','float:left;');
        $('body > div > header > div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > a > img').show();
        $("iframe#externalref3").on("load", function () {
            var snarr = [];
            GM_log('# ITSM release iframe#externalref3 loaded ' , $('iframe#externalref3').length  );
            GM_log('# ITSM release ', $('iframe#externalref3').contents().find('body').text().split('Instance name:')[0].split('Build tag: ')[1] );
            SNrel =  $('iframe#externalref3').contents().find('body').text().split('Instance name:')[0].split('Build tag: ')[1];  ///html/body/text()[7]   find('body > text:contains("Built tag")').text()
            //            alert(SNrel);
            GM_log('# ITSM release var ' , SNrel, SNrel.split('-').length );
            snarr = SNrel.split('-');
            release = snarr[1].charAt(0).toUpperCase() + snarr[1].substring(1);
            SNpatch = snarr[4].split('__')[1].split('-')[0];
            release = release + '  ' +  SNpatch.charAt(0).toUpperCase() + SNpatch.substring(1);
            GM_log('# ITSM release ' , release );
            $('#SNrel').text( release ).css('title', SNrel );
        });

        $('link[rel="shortcut icon"]'). attr('href', 'https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/images/og-images/favicon.ico');
        $('#mainBannerImage16').attr('style','height:28px !important;');
        if( domain === 'nttlimitedint' ) {
            $('#mainBannerImage16').attr('src','/sp/6dad7911dbd77b80aa429475db961904.iix').css('margin-top','-4px');
            $('#mainBannerImage16').attr('style','height:26px !important;margin-top:-4px !important;');
        }
        //https://nttlimitedinternal.service-now.com/sp/6dad7911dbd77b80aa429475db961904.iix
        //https://nttlimitedinternal.service-now.com/0819669ddb1737802a5d9c44db9619b2.iix
        $('body > div > header > div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > a > img').attr('style','height:20px !important;');
        //        release = $('#helpPopover > div > div:nth-child(1) > button').attr('sn-trigger-overview-help');
        //        var Madridtst = $('script[src^="/ConditionalFocus"]').length; // ConditionalFocus.jsdbx === Madrid
        //        GM_log('# ITSM release Madrid test ' + Madridtst );
        //        ServicenowVersion();
        GM_log('# ITSM release  jsvars ' + window.g_keyboard_shortcuts );
        //        GM_log('# ITSM release overview-help ' + release );
        //        release = $('body > overviewhelp').attr('page-name');
        //        GM_log('# ITSM release page-name ' + release );
        //        if ( $('div#edge_east').length === 1 ) release = 'Jakarta';
        //        GM_log('# ITSM release edge_east ' + release );
        //        if ( release === 'helsinki' ) release = 'Helsinki';
        //        if ( Madridtst === 1 ) release = 'Madrid';
        //  release detection is not feasible, hardcoding to Jakarta
        //        if ( release !== 'Helsinki' &&  release !== 'Jakarta' && release !== 'Madrid' &&  release !== undefined   ) alert('New release ' + release + ' detected!!!!');
        var glide_product = $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > h1').text();
        var instcolour = $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > h1 > p').css('color');
        if (!glide_product) {
            glide_product = $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > span > p').text();
            instcolour = $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > span > p').css('color');
        }

        GM_log('# ITSM instance0 ' + glide_product , instcolour);
        if ( glide_product === '' ) {
            glide_product = 'Production';
            $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > h1').text(glide_product).attr('title', release + ' release');
        }
        if ( glide_product === 'Testing' ) {
            glide_product = 'UAT';
        }
        if ( glide_product.indexOf('@') > -1 ) glide_product = glide_product.split('@')[0].trim();
        GM_log('# ITSM instance1 ' + glide_product );
        if ( unsafeWindow.NOW && unsafeWindow.NOW.user_display_name === 'Michel Hegeraat') {
            //            alert('This is ITSM release ' + document.title );
            //            var hold = $('body > div > header > div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header').html();
            if ( glide_product === 'Production' ) $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > h1').text('');
            $('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header').append(` &nbsp; &nbsp; <select id=inst style="height: 20px;margin-top:4px;background-color:#222;color:#fff !important;">
<option>Production</option>
<option>Validation</option>
<option>Support</option>
<option>Sandbox</option>
<option>Orion</option>
<option>UAT</option>
<option>Training</option>
<option>Hydra</option>
<option>Cygnus</option>
<option>Lyra</option>
<option>Dorado</option>
<option>Pegasus</option>
<option>Gemini</option>
</select> &nbsp; &nbsp; <p id="SNrel" title="` + SNrel +  `">` + release + '</p></font>' ); //  title="` + SNrel +  `"



            $('#inst').on('change', function(){
                glide_product = $('#inst').val();
                if ( glide_product === 'Production' ) glide_product = 'services';
                GM_log('# ITSM instance change to ' + domain + glide_product + '.service-now.com' );
                window.top.location = 'https://' + domain + glide_product + '.service-now.com/';
            });
        }
        $('#inst').val(glide_product);

        var instcol = '#e6e8ea';
        if (instance === 'Sandbox')    instcol = '#ffdc73';
        if (instance === 'Orion')      instcol = '#E9967A';
        if (instance === 'Validation') instcol = '#FF8C00';
        if (instance === 'Sandbox')    instcol = '#DDA0DD';
        if (instance === 'Support')    instcol = '#278EFC';
        if (instance === 'UAT')        instcol = '#FFF44F';
        if (instance === 'Hydra')      instcol = '#71E279';
        if (instance === 'Training')   instcol = '#FF8C00';

        if ($('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > span > p').length > 0 ) {
            instcol =$('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > span > p').css('color');
            GM_log('# ITSM colors set to ' ,$('div.navbar.navbar-default.sn-frameset-header > div > div.navbar-header > span > p').css('color') );
        }

        //  #mainBannerImage16
        //
        // _____  top bar ______
        //
        if ( release === 'Jakarta' ) {
            GM_addStyle(' .sn-avatar_v2         { height:19px !important;width: 19px !important; }');
            GM_addStyle(' #sysparm_search       { height:19px !important; }');
            GM_addStyle(' #mainBannerImage16    { margin-top: -8px;}');
            GM_addStyle(' .navbar-divider       { height:0px !important; } ');
        }
        GM_addStyle(' .sn-frameset-header .banner-text { height: 20px; }');
        GM_addStyle(' .sn-frameset-header .navbar-brand { padding:0px 10px !important; }');
        GM_addStyle(' h4, .h4, h5, .h5, h6, .h6 {    margin-top: 7px; }');
        GM_addStyle(' .navbar-brand             { padding:0px !important; background-image:none !important;}');
        GM_addStyle(' #sysparm_search.focus     { margin-top:2px !important;}');
        GM_addStyle(' .icon-search:before       { margin-top: 5px; }');
        GM_addStyle(' .navbar-divider           { height:0px !important; } ');
        GM_addStyle(' .navbar-header            { margin-top:0px !important;height:28px ; }');
        GM_addStyle(' #mainBannerImage16        { height:26px !important;}');
        GM_addStyle(' #user_info_dropdown       { height:25px !important;}');
        GM_addStyle(' .navpage-header           { height:25px !important;}');
        GM_addStyle(' .navpage-header-content   { height:25px !important;}');
        GM_addStyle(' .navpage-main             { top:28px !important;}');
        GM_addStyle(' .avatar-container         { height:22px !important;width:22px !important; background-color: #66f !important; border:1px solid #222;}');
        GM_addStyle(' .sub-avatar               { line-height: 19px !important; }');
        GM_addStyle(' ng-isolate-scope          { line-height: 19px !important; }');
        GM_addStyle(' .banner-text              { padding:0px !important; }');
        GM_addStyle(' #SNrel                    { color:#ccc; line-height: 25px;}');

        //
        // _____ side bar ______
        //
        if ( release === 'Jakarta'  || release === 'Madrid' || release === '' ) {
            GM_addStyle(' .sn-live-search-flex.input-group-transparent { height:28px !important; }');
            GM_addStyle(' .navpage-nav-collapsed .magellan_navigator .sn-widget-list_v2 .sn-widget-list-item .sn-widget-list-content { width:28px;}');
            GM_addStyle(' .navpage-nav-collapsed .magellan_navigator .sn-live-search                                                 { width:28px;}');
            GM_addStyle(' .navpage-nav-collapsed .magellan_navigator .sn-pane-footer .sn-pane-footer-content .sn-pane-action {    left:28% !important; }');
            GM_addStyle(' .sn-pane-footer .sn-pane-action {   width: 20px; !important; }');
            GM_addStyle(' .navpage-nav-collapsed .navpage-main, .navpage-nav-collapsed .navpage-bottom { left:28px; }');                                                                    // move main to the left
        }

        GM_addStyle(' nav.navpage-nav                { top:28px !important;   }');



        if (whatsnew !== '' && script.indexOf('.do') > -1 ){
            if (GM_getValue('ITSMscriptversion')){
                if (GM_getValue('ITSMscriptversion') !== scriptversion ){
                    showpopup(newversion,30);
                    GM_setValue('ITSMscriptversion', scriptversion);
                }
            } else {
                showpopup(newversion,30);
                GM_setValue('ITSMscriptversion',scriptversion);
            }
        }

        GM_setValue('ITSMscriptversion', scriptversion);



        var arry = [];
        arry = GM_listValues();
        var p =  arry.length ;
        var x =0;
        var n = new Date();
        for ( p=arry.length-1; p > -1; p-- ) {
            //         	    GM_log('# koek trommel ', p, arry[p], GM_getValue(arry[p])  );
            if ( arry[p].indexOf('_ETA') > 0 && Date.parse( GM_getValue(arry[p]) ).toString() !==  'Invalid Date' && !isNaN(Date.parse( GM_getValue(arry[p]) ).toString())  ) {
                //           	    GM_log('# Valid date ', p, arry[p], GM_getValue(arry[p]) , Date.parse( GM_getValue(arry[p]) ).toString()  );
                var isnow = Number( Math.round(n.getTime()/3600000));
                var cookdt = Date.parse( GM_getValue(arry[p]) ).toString().replace('/','-') /3600000;
                if ( (isnow - cookdt)/24  > 30 ) {
                    var oldcase = arry[p].split('_ETA')[0];
                    //				GM_log('# Old cookie ',x ,(isnow - cookdt)/24 , oldcase , GM_getValue(arry[p]) );
                    x++;
                    GM_log('# Old cookie for ' +  oldcase + ' deleted');
                    GM_deleteValue(oldcase+'_ETA');
                    GM_deleteValue('cclist'+oldcase);
                    GM_deleteValue('tolist'+oldcase);
                    GM_deleteValue('prbactp'+oldcase);
                    GM_deleteValue('prbdesc'+oldcase);
                    GM_deleteValue('prbimpt'+oldcase);
                    GM_deleteValue('prbstat'+oldcase);
                    GM_deleteValue('recep'+oldcase);
                }
            }
        }
        GM_log('# Cookie monster ate between ', x , ' and ', x*8 , ' cookies. But don\'t worry. There are ', arry.length-x , ' cookies remaining in the jar.'  );

        if ( GM_getValue('updatecheck','') !== '' ) ITSMupdates = checkForUpdate();

        //    ITSMupdates ='ITSM+ Update available: 2.099';



        if (loggedin === 'Michel Hegeraat') {
            $('#floattest').append('<p class="mybut"> ITSM+ TESTING123 </p><p class="mybut">123</p><p class="mybut">TESTING<br>test ing<br>TES TING</p>');
        }

        if ( $('div.collapse.navbar-collapse > div.nav.navbar-right').length > 0 ) {
            $('<div class="navpage-header-content"><a id="ITSMpsettings" title="ITSM+ Settings" data-original-title="ITSM+ Settings" class="normalbg icon-cog"><span class="sr-only">ITSM+ Settings</span></a></div>').insertAfter('div.collapse.navbar-collapse > div.nav.navbar-right > div:nth-child(5)');
            GM_addStyle('a#ITSMpsettings:before { content:"\\f13a"; color: #000 !important;background-color:#DFE;margin: 2px 3px 0px 3px; } '); // background-color:#DFE;
            GM_addStyle(' .normalbg				{ background:#DFE; border:solid 2px #DFE;border-radius:3px; }');

            $('#ITSMpsettings').on('click', function() { showform(3); });
        }


//       if ($('iframe#gsft_main').length > 0 ) {
//           setTimeout(function() {
//               if ( $('iframe#gsft_main').attr('src').indexOf('home_splash.do') > -1  || $('iframe#gsft_main').attr('src').indexOf('u_privacyStatement.do') > -1  ) {
//                   GM_log('#=#=#=#  iframe#gsft_main redirected to task_list 1 ' );
//                   $('iframe#gsft_main').attr('src','task_list.do?sysparm_query=active=true^assigned_to=' + unsafeWindow.NOW.user.userID + '^u_majorISEMPTY^EQ&sysparm_cancelable=true');
//               }
//           },10000);
//           setTimeout(function() {
//               if ( $('iframe#gsft_main').attr('src').indexOf('home_splash.do') > -1  || $('iframe#gsft_main').attr('src').indexOf('u_privacyStatement.do') > -1  ) {
//                   GM_log('#=#=#=#  iframe#gsft_main redirected to task_list 3 ' );
//                   $('iframe#gsft_main').attr('src','task_list.do?sysparm_query=active=true^assigned_to=' + unsafeWindow.NOW.user.userID + '^u_majorISEMPTY^EQ&sysparm_cancelable=true');
//               }
//           },13000);
//       } else GM_log('#=#=#=#  iframe#gsft_main not found,.... realy? ' );



        return;

    });
}
// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    ITSM icon_browse                                                                                        =
// =                                                                                                                                                            =
if ( script === '/icon_browse.do'   ) {
    // ==============================================================================================================================================================

    GM_addStyle(' button 		{ background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff !important;padding:3px 4px 3px 4px;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
    GM_addStyle(' button:hover	{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0 !important;padding;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px  rgba(0,255,0,1.0) !important;}');
    GM_addStyle(' button:after	{ position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');

}
// ==============================================================================================================================================================


// ==============================================================================================================================================================
// =                                                    ITSM sys_user                                                                                        =
// =                                                                                                                                                            =

if ( script === '/sys_user_list.do' || script === '/sys_user.do' ) {
    // ==============================================================================================================================================================


    GM_log('# sys_user ' , $('.form_action_button').length );

    GM_addStyle(' td, input, select	{ padding-top:0px !important; padding-bottom:0px !important;line-height:13px !important;	 }');
    GM_addStyle(' body				{ font-size:12px !important; line-height:13px !important; padding:0px !important;	 }');
    GM_addStyle(' .form-control     { height:16px !important; min-height:16px !important; }');
    GM_addStyle(' .form-field       { min-height:16px !important; }');
    GM_addStyle(' .form-group       { margin-bottom:5px !important; }');
    GM_addStyle(' .vt				{ padding:0px 4px 0px 4px !important;	 }');
    GM_addStyle(' .navbar			{ padding:0px 4px 0px 4px !important;  }');
    GM_addStyle(' .list_nav			{ font-size:10px !important;  }');
    GM_addStyle(' .btn			    { padding:0px !important;}');
    GM_addStyle(' .btn-icon			{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:13px !important;	 }');
    GM_addStyle(' .input-group      { width:200px !important; height: 16px !important; }');
    GM_addStyle(' .input-group-btn  {                         height: 16px !important; padding: 0px !important; }');
    GM_addStyle(' .section_header_content_no_scroll { height:100% !important; }');
    if ( script === '/sys_user_list.do' ) GM_addStyle(' .touch_scroll     { overflow: initial !important; height:initial !important;  }');

    GM_addStyle(' .mybut 		{ background-color:#DFE;background: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff !important;padding:3px 4px 3px 4px;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
    GM_addStyle(' .mybut:hover	{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0 !important;padding;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px  rgba(0,255,0,1.0) !important;}');
    GM_addStyle(' .mybut:after	{ position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
    GM_addStyle(' #slush_left   { height:200px !important; }');
    GM_addStyle(' #slush_right  { height:200px !important; }');
    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {
        $('.form_action_button').addClass('mybut');
        GM_log('# jquery done' , $('#sysverb_new').length );
    });

}

// ==============================================================================================================================================================



// ==============================================================================================================================================================
// =                                                    ITSM Task List                                                                                          =
// =                                                                                                                                                            =
if ( script === '/task_list.do' ) {
    // ==============================================================================================================================================================

    var p = GM_listValues();
    GM_log('#=#=#=#  loading script /task_list.do' );
    GM_log('##=## GM_listValues ' + p.length );


    GM_addStyle(' tr.hover td      { background-color:transparent !important;	 }');
    GM_addStyle(' .my_list_sla_0 { background:rgba(244,255,244,1);color:#000 !important;border-top-left-radius:7px;border-bottom-left-radius:7px; }' );          //  background-color: #F4FFF4       background:rbga(244,255,244,0.9)
    GM_addStyle(' .my_list_sla_1 { background:rgba(224,255,224,1);color:#000 !important; }' );                                                                   //  background-color: #E0FFE0       background:rbga(224,255,224,0.9)
    GM_addStyle(' .my_list_sla_2 { background:rgba(186,255,186,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #BAFFBA       background:rbga(186,255,186,0.9)
    GM_addStyle(' .my_list_sla_3 { background:rgba(144,238,144,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #90EE90       background:rbga(144,238,144,0.9)
    GM_addStyle(' .my_list_sla_4 { background:rgba(240,230,140,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #F0E68C       background:rbga(240,230,140,0.9)
    GM_addStyle(' .my_list_sla_5 { background:rgba(255,255,  0,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #FFFF00       background:rbga(255,255,  0,0.9)
    GM_addStyle(' .my_list_sla_6 { background:rgba(255,208,  4,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );     //  background-color: #FFD004       background:rbga(255,208,  4,0.9)
    GM_addStyle(' .my_list_sla_7 { background:rgba(255,165,  0,1);color:#000; font-weight: bold !important; text-decoration:none !important; }' );     //  background-color: #FFA500       background:rbga(255,165,  0,0.9)
    GM_addStyle(' .my_list_sla_8 { background:rgba(255,  5,  2,1);color:#fff ; font-weight: bold !important; text-decoration:none !important; border-top-right-radius:7px; border-bottom-right-radius:7px; }' );     //  background-color: #FF0502       background:rbga(255,  5,  2,0.9)
    GM_addStyle(' td.P1cell { background-color: tomato !important; }' );
    GM_addStyle(' td.P2cell { background-color: orange !important; }' );
    GM_addStyle(' .list2_cell_background  { border:1px solid #000; }' );
    GM_addStyle(' td.list_decoration_cell { background-color: transparent !important; }' );
    GM_addStyle(' a.linked   { white-space:nowrap !important;}' );  // disable if you need a bigger screen
    GM_addStyle(' .vt { padding:4px !important; }');  // !important
    GM_addStyle(' .redlink { color:red !important;fontWeight:bold !important;' );
    GM_addStyle(' .redlink2 { background-color: rgba(255,240,40,0.2) !important; border:0px !important; ' );

    GM_addStyle(' body				{ font-size:12px !important; line-height:13px !important; padding:0px !important; height:auto;	 }'); // 95%
    GM_addStyle(' .vt				{ padding:0px 4px 0px 4px !important;	 }');
    GM_addStyle(' .navbar			{ padding:0px 4px 0px 4px !important;  }');
    GM_addStyle(' .list_nav			{ 		font-size:10px !important;  }');
    GM_addStyle(' .btn-icon			{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:13px !important;	 }');
    GM_addStyle(' i.btn-icon			{ width:15px !important;	 }');
    GM_addStyle(' a.btn-icon			{ width:15px !important;	 }');
    GM_addStyle(' th.col-control		{ width:15px !important;	 }');

    GM_addStyle(' label.radio-label::before		{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:15px !important; width:15px !important; min-height:8px !important; font-weight:100 !important;	 }');
    GM_addStyle(' label.checkbox-label::before	{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:15px !important; width:15px !important; min-height:8px !important; font-weight:100 !important;	 }');
    GM_addStyle(' .input-group-radio	{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:10px !important; min-height:8px !important; font-weight:100 !important;	 }');
    GM_addStyle(' .input-group-checkbox { font-size:10px !important; line-height:10px !important; padding:0px !important;  min-height:8px !important; font-weight:100 !important;	 }');
    GM_addStyle(' td, input, select	{ padding-top:0px !important; padding-bottom:0px !important;line-height:13px !important;	 }');
    GM_addStyle(' td.drag_section_movearea input { padding-top:5px !important; padding-bottom:5px !important; color:#000;}');
    GM_addStyle(' td.drag_section_movearea input[type=image] { padding-top:0px !important; padding-bottom:0px !important;}');
    GM_addStyle(' .list_popup		{ font-size:10px !important; line-height:10px !important; padding:0px !important;	 }');
    GM_addStyle(' .checkbox			{ font-size:10px !important; line-height:10px !important; padding:0px !important; height:10px !important; min-height:10px !important; font-weight:100 !important;	 }');
    GM_addStyle(' .checkbox-label	{ font-weight:100 !important;	 }');
    GM_addStyle(' div.vcr_controls	{ border-color: #FFF !important; }' );
    GM_addStyle(' div.vcr_controls input	  { min-height: 12px !important; height: 13px !important; }' );
    GM_addStyle(' #task_choice_actions select { min-height: 15px !important; height: 18px !important; }' );
    GM_addStyle(' .mybut                { background-color:#DFE;background: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff;margin-right:6px ;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
    GM_addStyle(' .mybut:hover			{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE) !important;border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0) !important; }');
    GM_addStyle(' .mybut:after          { position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
    GM_addStyle(' .mybuthi              { background-color:#DFE;background: linear-gradient(#fca73d,#6d3c00);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');

    instance='';
    domain='';
    if ( location.hostname.indexOf('.service-now.com') > -1 ) {
        if ( location.hostname.slice(0,5) !== 'didata' ) {
            instance = location.hostname.slice(13).replace('.service-now.com','');
            domain   = location.hostname.slice(0,13);
        } else {
            instance = location.hostname.slice(5).replace('.service-now.com','');
            domain   = location.hostname.slice(0,5);
        }
    }
    // instcolor = ''
    if (instance === 'sandbox') {
        $('#list_nav_task > div.container-fluid').css('background-color','#DDA0DD');
        GM_addStyle('div.container-fluid { background-color:#DDA0DD; }');
    }
    if (instance === 'support') {
        $('#list_nav_task > div.container-fluid').css('background-color','#278EFC');
        GM_addStyle('div.container-fluid { background-color:#278EFC; }');
    }
    if (instance === 'orion') {
        $('#list_nav_task > div.container-fluid').css('background-color','#E9967A');
        GM_addStyle('div.container-fluid { background-color:#E9967A; }');
    }
    if (instance === 'validation') {
        GM_addStyle('div.container-fluid { background-color:#FF8C00; }');
    }
    if (instance === 'uat') {
        GM_addStyle('div.container-fluid { background-color:#FFF44F; }');
    }
    if (instance === 'hydra') {
        GM_addStyle('div.container-fluid { background-color:#71E279; }');
    }
    if (instance === 'training') {
        GM_addStyle('div.container-fluid { background-color:#FF8C00; }');
    }

    //if (instance === 'hydra')      instcol = '#71E279';


    GM_log('## domain ' + domain + ' inSTance ' + instance );

    //GM_addStyle(' #framerow1		{ padding-bottom:5px !important; display:block;  }' );

    var autoreload  = GM_getValue('autoreload')  || 'on';
    var normaltimer = GM_getValue('normaltimer') || 120000;    // reload in 120 sec

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {


        //    $('#task_hide_search').css('display','flex');
        $('span.list_search_title').on('click', function() {
            $('#task_hide_search > div > div').toggle();
            if ( $('#task_hide_search > div > div:visible').length > 0 ) {
                $('span.list_search_title').css('color','#EEF');
            } else {
                $('span.list_search_title').css('color','#888');
            }
        });
        $('#task_hide_search > div > div').hide();
        if (typeof unsafeWindow === "undefined") {
            unsafeWindow = window;
        }
        var myusrid = unsafeWindow.NOW.user.userID;
        GM_log('##=#=# NOW ', unsafeWindow.NOW );


        var observer = new MutationObserver( function(mutations) {
            //		GM_log('##MutObSrvr forEach started');
            mutations.forEach(function(mutation) {
                var str = '##MutObSrvr ' + mutation.type + ' attr ' + mutation.attributeName + ' trgt ' + mutation.target ;
                if ( str.indexOf('HTMLTableCell') < 0  && str.indexOf('HTMLTableRow') < 0  ) {
                    //				GM_log(str);
                }
                if ( str.indexOf('HTMLTableElement') > 0  && str.indexOf('attr style') > 0 ) {
                    colorlist('#fff');
                    //				GM_log(str);
                    setTimeout(function(){ colorlist('#fff'); }, 10);
                }
            });
        });
        var obstarget = document.querySelector('#task');
        var obsconfig = { attributes: true, childList: true, characterData: true, subtree: true };


        var itsmversion = $('#mainBannerImage',unsafeWindow.parent.document).attr('title');
        var loggedin    = unsafeWindow.window.g_user.fullName;


        var row = findcol('task_table','task.assigned_to');
        GM_log('##=#=# row = ' + row,  myusrid );
        var caselist   = [];
        var percentage = [];
        var solaname  = [];
        var timeleft   = [];
        var SOtype     = [];
        var iFrameDoc;


        //	$('#task_filter_toggle_image').parent().parent().attr('id','task_filter').css('display','none');
        $('<td height=6 width=6><a id=tf_clickme><img title="Toggle task filter" src="images/toggle_right.gifx" height=12 width=12></img></a></td>').insertBefore( $('#task_filter_toggle_image').parent().parent() );
        $('#tf_clickme').on('click', function() {
            $('#task_filter').toggle();
            $('#tf_clickme').find('img').attr('src',  ($('#tf_clickme').find('img').attr('src') === 'images/toggle_right.gifx' ) ? 'images/toggle_left.gifx' : 'images/toggle_right.gifx' );
            if ( autoreload === 'on' ) { auto_reload(); }
        });


        var url = '/task_sla_list.do?sysparm_query=u_assignee_groupLIKEEU.BE.^ORu_assignee_groupLIKEEU.TRG.^u_current_stageNOT INmanually_cancelled%2Cachieved%2Cbreached%2Ccancelled&sysparm_first_row=1&sysparm_view=';
        var url2 = window.location.href;
        var slalist = '';
        var unassigenedQueue = false;

        if ( url2.indexOf('assigned_to%3Djavascript%3AgetMyAssignment') > -1 || url2.indexOf('assigned_to=javascript:getMyAssignment') > -1 || url2.indexOf(myusrid) > -1 ) {
            if ( url2.indexOf('opened_by') > -1 ) {
                url = '/task_sla_list.do?sysparm_query=task.opened_by%3D5025a67adbf3b700aa429475db961937%5EORtask.watch_listLIKE5025a67adbf3b700aa429475db^active=true&sysparm_first_row=1&sysparm_view=';
                GM_log('# for user int ');
                slalist = 'userint';
            } else {
                url = '/task_sla_list.do?sysparm_query=^u_assignee=javascript:getMyAssignments()^u_current_stage=in_progress^ORDERBYDESCbusiness_percentage&sysparm_cancelable=true';
                GM_log('# for user ');
                slalist = 'user';
            }
        } else {
            url = '/task_sla_list.do?sysparm_query=active=true^u_assignee_group=javascript:getMyGroups()^u_current_stage=in_progress^ORDERBYDESCbusiness_percentage&sysparm_view=';   // ORDERBYDESCbusiness_percentage
            GM_log('# first 50 ');
            slalist = 'be50';
        }
        if ( url2.indexOf('assigned_toISEMPTY')  > -1 )  {
            unassigenedQueue = true;
            normaltimer = GM_getValue('unass_normaltimer', normaltimer) || 60000;
        }

        GM_log('##=# get slas for ' + url + '\nu2= ' + url2  + '\nref= ' + document.referrer );

        $("body").append('<div id="sla_lijst"></div><p><div id="jq_get"></div>');
        //
        //	= = = = = =		Hide or Show SLA list		= = = = = = //
        //
        $("#sla_lijst").css('display','block');
        //
        //	= = = = = =		Hide or Show SLA list		= = = = = = //
        //

        // make timerbar

        var tmrbar = `<span id="timeframe">
</span> &nbsp; &nbsp;
<div id=takespace0  style="display: inline-flex; height:15px;">
<div id=takespace style="position: relative;width:100px;">
<progress title="Reload in " class="bar" max="100" value="0" data-label="Last reload at:" style="position:absolute;z-index: 1;left: 0;top:0px;">
</progress>
<div class="ontop" style="position:absolute;z-index:999;left:0;right:0;top:6px;text-align:center;color: #fff;">test</div>
</div>
</div> &nbsp; &nbsp;
<span id="framerow0" style="color:#444444;"></span>
<span id="framerow1"> &nbsp; &nbsp; <img class="toggleframe" title="Show/Hide commitments." src="images/arrows_expand_sm.gifx?v=2"></img> <img class="rfrsh" onclick="location.reload();" title="Reload task list." src="images/icons/refresh.gifx"></img> &nbsp; &nbsp;
</span>`;

        var d = new Date();
        GM_log('# delegation ' , ITSMtimeformat(d.toUTCString()) );

        var gr = new GlideRecord('sys_user_delegate');
        gr.addQuery('user', myusrid);
        gr.addQuery('ends' , ">", ITSMtimeformat(d.toUTCString()) );
        gr.addQuery('start', "<", ITSMtimeformat(d.toUTCString()) );
        if (slalist === 'user') gr.query(hopla11);

        //  #=#=#=   insert timer bars
        if ($('.navbar-left').length === 0 ) {
            $('#list_nav_task > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').prepend(tmrbar);

            if ( $('table.list_nav_bottom').length > 0 ) {
                $('table.list_nav_bottom > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').prepend(tmrbar);
            } else {
                $('#sla_lijst').append(tmrbar);
            }
        } else {
            $('.navbar-left').prepend(tmrbar);
            if ( $('table.list_nav_bottom').length > 0 ) {
                $('table.list_nav_bottom > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').prepend(tmrbar);
            } else {
                $('#sla_lijst').append(tmrbar);
            }
        }
        //  #=#=#=   insert sla legend span
        $('<span id="framerows"></span>').insertBefore('#framerow0');

        $('.toggleframe').click(showhideframe).css('cursor','pointer');
        $('.rfrsh').css('cursor','pointer');
        $('.bar').css('width','100px').css('height','15px').css('cursor','pointer').css('border-radius','7px').css('margin-top','5px'); //.css('','')


        // Turns off styling - not usually needed, but good to know.
        // gets rid of default border in Firefox and Opera.
        // Needs to be in here for Safari polyfill so background images work as expected. */	background-size: auto;
        GM_addStyle('progress,progress[role] { appearance:none; -moz-appearance:none; -webkit-appearance:none; border:none; position:relative;   } ');
        GM_addStyle('progress[role] strong                  { display: none; } ');
        GM_addStyle('progress[role][aria-valuenow]          { display: none; } ');
        GM_addStyle('progress,progress[role][aria-valuenow] { border-radius:7px;background: #2a2 } ');
        GM_addStyle('progress::-webkit-progress-bar 		{ border-radius:7px;background: #2a2; } ');  			           // Chrome
        GM_addStyle('progress::-moz-progress-bar            { border-radius:7px;background: #666; } ');                            // Firefox
        GM_addStyle('progress::-webkit-progress-value       { border-radius:7px;background: #666; } ');                            // Chrome
        $('#list_nav_task > div > div.navbar-header > a > h1 > span.list_view').css('background-color','#F00').css('color','#FFF').attr('title','You are using not using the default view!!\nClick this to adjust it.');

        var progressbar = $('.bar'),
            max = progressbar.attr('max'),
            time = (1000/max)*(normaltimer/1000),
            value = progressbar.val();

        $('body').append(`<select id=reloadtime class="form-control" style="border:none;font-size:10px;display:none;position:absolute;width:65px !important;height:15px;min-height:15px;" title="Adjust reload timer time.">
<option title="Keep current timer value"    value=0>keep   </option>
<option title="Reload tasklist in 2 min."   value=2>2 min. </option>
<option title="Reload tasklist in 5 min."   value=5>5 min. </option>
<option title="Reload tasklist in 10 min." value=10>10 min.</option>
</select>`);

        if (unassigenedQueue) {
            var reloadtime = document.getElementById('reloadtime');
            var opt = document.createElement("option");
            opt.value = "1";
            opt.title = "Reload tasklist in 1 min.";
            opt.text  = "1 min.";
            reloadtime.add( opt, reloadtime.options[1] );
        }

        $('.ontop').click( function() {
            GM_log('##=#  progress bar clicked ');
            auto_reload();
        });
        $('.ontop').on("contextmenu",function(e){
            //        GM_addStyle('progress::before { content:"";' );
            $('.ontop').text('');
            var t = reloadtimer/60000; // timer in minutes
            $('#reloadtime option[value='+ t +']').attr('selected','selected');
            GM_log('# reloadtime select set to ', t );
            var clickedElement = $(this).parent().position();
            GM_log('# clickedElement.top set to ', clickedElement.top );
            if (clickedElement.top === 0 ) {
                $('#reloadtime').css({ top: (clickedElement.top + 6 ) + 'px', left:(clickedElement.left + 20) + 'px' , display:"block", zIndex:"1000" });
            } else {
                $('#reloadtime').css({ top: (clickedElement.top + 5 ) + 'px', left:(clickedElement.left + 20) + 'px' , display:"block", zIndex:"1000" });
            }
            $('#reloadtime').focus();
            $('#reloadtime').on('change', function() {
                if ($('#reloadtime option:selected').val() > 0 ) {
                    normaltimer = $('#reloadtime option:selected').val() * 60000 ;
                    reloadtimer = normaltimer;
                    if ( unassigenedQueue ) { GM_setValue('unass_normaltimer', normaltimer); } else { GM_setValue('normaltimer', normaltimer); }
                    GM_log('# normaltimer set to ', normaltimer );
                }
                $('#reloadtime').hide(1000);
            }).on('blur', function() {
                $('#reloadtime').hide(1500);
            });
            return false;
        });

        $("#jq_get").css('display','none');
        //	$("#jq_get").css('display','block');

        GM_log('#=== reached 2.0 ', url2.indexOf('assigned_to'), url2.indexOf('getMyGroups'), url2.indexOf('assignment'),  url2.indexOf('active') );

        if ( url2.indexOf('assigned_to') == -1 && url2.indexOf('getMyGroups') == -1 && url2.indexOf('opened_by') == -1 && url2.indexOf('assignment') == -1 || url2.indexOf('active') == -1  ) {
            GM_log('#=== reached 2.1 No need for SLA');
        } else {
            GM_log('#=== reached 3');
            $('#framerow0').html(' &nbsp;  Loading SLA/OLA\'s.....   &nbsp; ').css('color', '#ff9').css('background-color', '#f88');
            GM_log('#=== reached 3.1');
            getslalist();
            GM_log('#=== reached 3.2' , slalist);

        }


        var Tasklistrows = [];

        var	hopla3 = setInterval(function(){
            var n = new Date();
            if ($('div#u_task_add_comment_work_note').length > 0 ) {   // content menu open
                GM_log('# content menu open. Set mybut class ');
                $('table#infoTable').find('button').attr('style','margin-right:6px;min-width:40px;font-size:12px;').addClass('mybut'); //.css('background-color','#F00');
                var thiscase  =  $('#infoTable > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                var tpcasenr  = '0';
                var tpcaseval = [];
                var vdr = '';
                //	    	GM_log('# content menu open done ', thiscase , Tasklistrows);
                for (i = 0; i < Tasklistrows.length; i++) {
                    if (Tasklistrows[i][0]  === thiscase ) {            // this is the case we right-clicked
                        GM_log('# cases ', Tasklistrows[i][1] );   // these are th tpcases for the case
                        var tpcaselst = [];
                        if ( Tasklistrows[i][1].indexOf(',') > -1 ) {
                            tpcaselst = Tasklistrows[i][1].split(',');
                        } else {
                            tpcaselst[0] = Tasklistrows[i][1];
                        }
                        for (j = 0; j < tpcaselst.length; j++) {
                            GM_log('# cases ',j, tpcaselst[j] );

                            if ( tpcaselst[j].indexOf('SVR') < 1  ) {
                                if ( GM_getValue('tpcase_'+tpcaselst[j].trim() ) ) {
                                    GM_log('# cases value exists', GM_getValue('tpcase_'+tpcaselst[j].trim() )  );
                                } else {
                                    GM_log('# no value exists for', 'tpcase_'+tpcaselst[j].trim() );
                                }
                            } else {
                                GM_log('# hop ', tpcaselst[j].indexOf('SVR') );
                            }
                        }
                        for (j = 0; j < tpcaselst.length; j++) {
                            GM_log('# cases ',j, tpcaselst[j] );
                            var arry = [];
                            arry = GM_listValues();
                            var p =  arry.length ;
                            if ( tpcaselst[j].indexOf('SVR') < 1  ) {
                                for ( p=arry.length-1; p > -1; p-- ) {
                                    //						    	GM_log('# case cookie match? ',p, arry[p] , GM_getValue(arry[p]) , tpcaselst[j]  );
                                    if ( arry[p].indexOf(tpcaselst[j].trim()) > -1 ) {
                                        GM_log('# case cookies ', arry[p], GM_getValue(arry[p])  );
                                        tpcasenr  = arry[p].split('_')[1] || '0';
                                        tpcaseval = GM_getValue(arry[p]).split(';') || [];
                                        if ( tpcaseval[2].indexOf('@dell.')  > -1 ) { vdr= 'Dell/EMC'; }
                                        if ( tpcaseval[2].indexOf('@cisco.') > -1 ) { vdr= 'Cisco';    }
                                        if ( tpcaseval[2].indexOf('@junipe') > -1 ) { vdr= 'Juniper';  }
                                        if ( tpcaseval[2].indexOf('@ca.')    > -1 ) { vdr= 'CA';       }
                                        if ( tpcaseval[2].indexOf('@fortin') > -1 ) { vdr= 'Fortinet'; }
                                        if ( tpcaseval[2].indexOf('@f5.')    > -1 ) { vdr= 'F5';    }
                                        if ( tpcaseval[2].indexOf('@cisco.') > -1 ) { vdr= 'Cisco'; }
                                    }
                                }
                            } else {
                                GM_log('# hop ', tpcaselst[j].indexOf('SVR') );
                            }
                        }
                        clearInterval(hopla3);
                    }
                }
                if ( autoreload === 'on' ) { auto_reload(); }
                if ( $('#existingComments').attr('checked') !== 'checked' ) {
                    $('#existingComments').click();
                    $('#existingComments').attr('checked','checked').css('display','none').next().css('display','none');
                    //				$('#numberOfRows').eq(0).insertBefore( $("<option>0</option>").val(0) );
                    var numberOfRows = document.getElementById('numberOfRows');
                    var opt = document.createElement("option");
                    opt.value = "0";
                    opt.text  = "0";
                    numberOfRows.add( opt, numberOfRows.options[0] );
                }
                if ( tpcaseval.length > 0 ) {
                    GM_log('# tpcasenr ', tpcasenr );
                    $('<span style="color:#000;"> <b>Vendor:</b></span><span> ' + vdr + ' &nbsp; </span><span style="color:#000;"><b>Case:</b></span><span> ' + tpcasenr + '</span> &nbsp; <a id=utv class=mybut>Update To Vendor</a> &nbsp; <a id=ufv class=mybut>Update From Vendor</a>').appendTo( $('#Ok').parent() );
                    $('#ufv').attr('title','Add a mail update from vendor in textarea to work notes');
                    $('#utv').attr('title','Send an email to vendor with text from textarea with a copy to work notes');
                    $('#ufv').on('click', function() {
                        var t = $('#commentText').val();
                        if ( t === '' || typeof t === 'undefined') {
                            alert('paste update first') ;
                        } else {
                            $('#commentText').val('Update From Vendor\n===================\n\n' + t);
                        }
                        //$('#Ok').click();
                    });
                    $('#utv').on('click', function() {
                        var t = $('#commentText').val();
                        var maildet = 'mailto://' + tpcaseval[2] + '?subject=' + tpcaseval[3] + '&body=';
                        if ( t === '' ) { t  = 'Empty Work Notes field'; }
                        maildet = maildet + t;
                        t = 'Update to vendor: ' + vdr +  '\nTo: \t \t' + tpcaseval[2] + '\nSubject: \t' + tpcaseval[3] + '\n=========================\n\n' + t;
                        $('#commentText').val(t);
                        window.top.location = maildet;
                        //$('#Ok').click();
                    });
                } else {
                    GM_log('# tpcasenr not found' );
                }
            }
        },1000);



        GM_log('##=# autoreload is: ', autoreload);
        var reloadtimer = normaltimer ; // reload every two/five/ten minutes
        var hopla;
        var hopla2;

        if ( autoreload === 'on') {

            GM_log('##=# set update timer');

            hopla = setInterval(function(){
                GM_log('##=# update slalist' );
                location.reload();
            }, reloadtimer);
        }

        $('img.list_nav').click( function () {
            GM_log('##=# cnav click ');
            $('img.list_nav').css('background-color', '#f88');
        });

        $('a.linked').click( function(event) {
            GM_log('##=# Link ---- clicked ');
            if ( event.ctrlKey  || event.shiftKey || event.metaKey  || ( event.button && event.button == 1 ) ) { 				// middle click, >IE9 + everyone else.
                GM_log('##=# Link clicked timers not stopped! ');
                event.preventDefault();
                return;
            } else {
                GM_log('##=# Link ++++ clicked timers stopping! ');
                clearInterval(hopla);
                clearInterval(hopla2);
                GM_log('##=# Link ++++ clicked all timers stopped! ');
                //			return false;
            }
        });

        $('input[id$="_first_row"]').change(function () {
            GM_log('##=# changed inputs ');
            colorlist('#fff');
        });

        $('span[id$="_last_row"]').change(function () {
            GM_log('##=# changed span ');
            colorlist('#fff');
        });

        $('table#task_table').change(function () {
            GM_log('##=# changed table ');
            colorlist();
            setTimeout(function(){ colorlist(); }, 1000);
        });

        $(unsafeWindow.document).on('onTableLoad', function () {
            GM_log('##=# onTableLoad event ');
            colorlist('#fff');
        });

        GM_log('#=== reached 1');


        var timericonheigt = 24;
        var iconpad = 8;





        GM_log('#=== starting autoreload ', autoreload );
        if ( autoreload === 'on') {

            var loading = function() {
                value += 1;
                var addValue = progressbar.val(value);		//	    $('.progress-value').html(value + '%');  <span class="progress-value">0%</span>
                if (value == max) { clearInterval(animate); }
            };

            if ( autoreload === 'on') {
                var animate = setInterval(function() { loading(); }, time );
            }

            var time2reload = reloadtimer/60000;
            var h = (reloadtimer/1000) ;
            time2reload = Math.floor(h/60)+ ':' + checkTime(h % 60);
            $('.ontop').attr('title','Reload in ' +  time2reload + ', Right-Click to adjust timer.');
            $('.ontop').text('Reload in ' +  time2reload.split('.')[0]);

            hopla2 = setInterval(function(){
                h --;
                time2reload = Math.floor(h/60)+ ':' + checkTime(h % 60);
                $('.ontop').text('Reload in ' +  time2reload.split('.')[0]).attr('title','Reload in ' +  time2reload + ', Right-Click to adjust timer.');
            }, 1000 );

        } else {
            $('progress.bar').val(100).attr('title','Click to restart auto reload timer');
            GM_addStyle('progress,progress[role][aria-valuenow] { border-radius:7px;background: #FCC !important; } ');   // Firefox, Polyfill   !important is needed by the polyfill
            GM_addStyle('progress::-webkit-progress-value       { border-radius:7px;background: #FCC !important; } ');  			// Chrome
            GM_addStyle('progress::-moz-progress-bar            { border-radius:7px;background: #FCC !important; } ');                            // Firefox
            var tc = 1;
            $('.ontop').text('Refresh Stopped!!').css('color','#000');
        }

        var tl_tit ='';
        $('#task_breadcrumb > a > b').each( function() {
            tl_tit += ' > ' + $(this).text();
        });
        document.title = tl_tit.split('All > ')[1];
        GM_log( tl_tit );
        GM_log('#=== end reached ');


        function hopla11(gr){
            GM_log('# delegations ' , gr.rows.length);
            var endtm = '';
            var delegate_id = '';
            var del_class = 'mybut';
            while ( gr.next() )  {
                endtm = 'Delegation until [ ' + Normaltmformat(gr.ends) + ' ] because of  [ ' +  gr.u_reason_for_leave  + ' ] '; //  +  gr.sys_created_by
                delegate_id = '?sys_id=' + gr.sys_id;
                del_class = 'mybuthi';

            }
            if (endtm) {
                endtm = endtm + ' &nbsp; ';
            } else {
                endtm = 'No current &nbsp; ';
            }
            var bottom_del = endtm +  '<a class="' + del_class + '" href="/sys_user_delegate.do' + delegate_id + '" title="Delegate YOUR cases to someone for a certain period." target="_blank">Delegation</a> &nbsp; ';
            $('table.list_nav_bottom > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').prepend(bottom_del);
            $('div.list_hide_empty').show(); // delegation button visible on empty list.
        }




        function auto_reload() {
            if ( autoreload === 'on') {
                clearInterval(animate);
                clearInterval(hopla);
                clearInterval(hopla2);
                autoreload = 'off';
                GM_log('##=#  reload timer stopped ');
                $('.bar').val(100).attr('title','Click to restart auto reload timer, Right-Click to adjust timer.');
                GM_addStyle('progress, progress[role][aria-valuenow] { border-radius:7px;background: #FCC !important; } ');   // Firefox, Polyfill   !important is needed by the polyfill
                GM_addStyle('progress::-webkit-progress-value        { border-radius:7px;background: #FCC !important; } ');   			// Chrome
                GM_addStyle('progress::-moz-progress-bar             { border-radius:7px;background: #FCC !important; } ');                            // Firefox
                var tc = 1;
                $('.ontop').text('Refresh Stopped!!').css('color','#000');
            } else {
                GM_log('##=#  reload timer started ');
                autoreload = 'on';
                GM_setValue('autoreload',autoreload);
                location.reload();
                GM_log('##=#  reload timer started ');

            }
            GM_setValue('autoreload',autoreload);
        }



        function getslalist() {
            GM_log('##=#  get slalist');
            $.get( url, function( data ) {
                var TableHeaders = [];
                $('#hdr_task_sla', $(data)).each(function() {
                    var arrayOfThisRow = [];
                    var tableData = $(this).find('th');
                    if (tableData.length > 0) {
                        tableData.each(function() { arrayOfThisRow.push($(this).attr('glide_label')); });
                        TableHeaders = arrayOfThisRow;
                    }
                });
                var TableDatarows = [];
                var ctr = 0;
                GM_log('##=#  got data');
                $('#task_sla_table tr', $(data)).each(function() {
                    var arrayOfThisRow = [];
                    var tableData = $(this).find('td');
                    if (tableData.length > 0) {
                        tableData.each(function() { arrayOfThisRow.push($(this).text()); });
                        TableDatarows.push(arrayOfThisRow);
                        ctr++;
                        //					GM_log( "#=#= tbl ", arrayOfThisRow.join(', ') );
                        if ( arrayOfThisRow.join(', ').indexOf('No records to display') > -1 || arrayOfThisRow.join(', ').indexOf(', , , , , , , , , , ,') > -1 ) ctr--;
                    }
                });

                GM_log( "#=#= ctr ", ctr );

                var alertmsg = '';
                var v2 = $('#task_sla_table >  tbody:nth-child(2) >  tr:nth-child(1)', $(data) ).length;
                var f1 = findcol3('Task');                 			// Task =3
                var f2 = findcol3('Business percentage');        	// Business percentage = 4

                if ( f2 == -1)  f2 = findcol3('Business elapsed percentage');

                if ( f2 == -1) {
                    alertmsg = 'Add the <B>"Business percentage"</B> column to Commitment list.';
                    //				alert('Add Business percentage column to commitment list.')
                    f2 = findcol3('Percentage');
                }  	// Percentage = 4   fallback if Business percentage is not there
                var f3 = findcol3('Business time left');            // Timeleft = 5
                if ( f3 == -1) {
                    //				alert('Add Business time left column to commitment list.')
                    if (alertmsg.length > 1) { alertmsg += '\n'; }
                    alertmsg += 'Add the <B>"Business time left"</B> column to Commitment list.';
                    f2 = findcol3('Time left');
                }  	// Percentage = 5   fallback if Business time left is not there
                var f4 = findcol3('Type');                 			// Type = 15
                var f5 = findcol3('Name');                 			// Name = 9
                if (alertmsg.length > 1 && f1 > 1 && ctr > 0) { showpopup(alertmsg + '\n\nClick <a href="/task_sla_list.do?sysparm_query=active=true^u_assignee=javascript:getMyAssignments()^EQ">this</a>, or go to the menu: <font color="red">Service desk</font> -> <font color="yellow"><B>Commitments</B></font> -> <font color="red">Assigned to me</font>.<p><br>Then click on the gear-icon and add the required columns.<p><br>Not clear? <br>Check the <a target=_blank href="https://nttlimited.sharepoint.com/teams/itsm647/_layouts/15/WopiFrame.aspx?sourcedoc=%7B815eb929-dad1-4da3-b502-76ae793a38c4%7D&action=view">FAQ</a>. <p>Still not Clear? <br>Come and see me. :-) \n\nMichel.',15); }


                GM_log( "#=#= v2,  f1, f2, f3 , f4    ", v2,  f1, f2, f3 , f4  );
                GM_log( "#=#= data  ", TableDatarows[1][f1], TableDatarows[1][f2], TableDatarows[1][f3] );

                var tbl = $('#task_sla_table', $(data));
                $("#jq_get").append(tbl);

                GM_log('##=# table to frame done.');

                var p = 0;
                while ( p < ctr ) {
                    var casenr = TableDatarows[p][f1];
                    var perc   = Number(TableDatarows[p][f2].replace(',','.'));
                    var tmlt   = TableDatarows[p][f3];
                    var slat   = TableDatarows[p][f4];
                    var sola   = TableDatarows[p][f5];
                    GM_log('##=# caselist update ', casenr, perc, tmlt , slat );

                    if ( caselist.indexOf(casenr) == -1 ) {
                        caselist.push(casenr);
                        percentage.push(perc);
                        timeleft.push(tmlt);
                        SOtype.push(slat);
                        solaname.push(sola);
                    } else if ( percentage[ caselist.indexOf(casenr) ] < perc ) {
                        percentage[ caselist.indexOf(casenr) ] = perc;
                        timeleft[ caselist.indexOf(casenr) ] = tmlt;
                        SOtype[ caselist.indexOf(casenr) ] = slat;
                        solaname[ caselist.indexOf(casenr) ] = sola;
                    }
                    p++;
                }
                GM_log('##=# reached observer ');

                observer.observe(obstarget, obsconfig);
                var timestring = gettimestr();


                GM_log('##=# calling  colorlist ');
                colorlist('#fff');

                $('#framerow0').css('color', '#ccc').css('background-color', 'initial').attr('title', ' ' + ctr + ' active SLA/OLA\'s ');
                if ( slalist === 'user') {
                    if (ctr == 1) {
                        $('#framerow0').text(' '  + ctr + ' running SLA/OLA '   );  //.css('background-color', '#fff')
                    } else {
                        $('#framerow0').text(' '  + ctr + ' running SLA/OLA\'s ');  //.css('background-color', '#fff')
                    }
                } else {
                    $('#framerow0').text(ctr +' SLA/OLA\'s running.').attr('title', ctr +' active SLA/OLA\'s for BE');  //.css('background-color', '#fff')
                }

                restoretasklistview();

                function findcol3 (str) {
                    return TableHeaders.indexOf(str) ;
                }

            });


            GM_log('##=#  slalist done');

        }

        function restoretasklistview() {
            setTimeout( function() {
                $.get( url2, function( data2 ) {
                    GM_log( "#=#= url2  >0 is OK ",data2.length );
                });
            }, 1000);
        }

        function showhideframe() {
            $('#jq_get').toggle();
        }

        function colorlist(clr) {

            GM_log('##=# loop cases ', caselist.length);
            for ( var cntr = 0; cntr < caselist.length; cntr++ ) {
                var casecolor = '#F4FFF4';
                var stl = '0';
                if ( percentage[cntr] > 10 ) { casecolor = '#E0FFE0';  stl = '1'; }  // 10  #E0FFE0
                if ( percentage[cntr] > 25 ) { casecolor = '#BAFFBA';  stl = '2'; }  // 25  #BAFFBA
                if ( percentage[cntr] > 35 ) { casecolor = '#90EE90';  stl = '3'; }  // 35  #90EE90
                if ( percentage[cntr] > 50 ) { casecolor = 'Khaki';    stl = '4'; }  // 50  #F0E68C
                if ( percentage[cntr] > 75 ) { casecolor = '#FFFF00';  stl = '5'; }  // 75  #FFFF00
                if ( percentage[cntr] > 83 ) { casecolor = '#FFD004';  stl = '6'; }  // 83  #FFD004
                if ( percentage[cntr] > 90 ) { casecolor = 'Orange';   stl = '7'; }  // 90  #FFA500
                if ( percentage[cntr] > 95 ) { casecolor = '#FF0502';  stl = '8'; }  // 95  #FF0502
                colorcase( caselist[cntr], casecolor, stl, percentage[cntr] , timeleft[cntr], SOtype[cntr],  solaname[cntr] );
                GM_log('#=#= ', caselist[cntr], casecolor, percentage[cntr] , timeleft[cntr], SOtype[cntr], solaname[cntr]);
            }
            //		$('img.list_nav').css('background-color', clr).css('border', '0px solid ' + clr);

            $('#framerows').html(`<span class="header" style="border-radius:7px; padding:0px 7px 5px 7px;">\
<span> &nbsp;  Legend: &nbsp; </span>\
<span style="padding:0px 7px 0px 7px;"> SLA/OLA % </span><span \
class="my_list_sla_0" style="padding:0px 7px 0px 7px;"> 0-9</span><span \
class="my_list_sla_1" style="padding:0px 7px 0px 7px;">&ge;10</span><span  \
class="my_list_sla_2" style="padding:0px 7px 0px 7px;">&ge;25</span><span  \
class="my_list_sla_3" style="padding:0px 7px 0px 7px;">&ge;35</span><span  \
class="my_list_sla_4" style="padding:0px 7px 0px 7px;">&ge;50</span><span  \
class="my_list_sla_5" style="padding:0px 7px 0px 7px;">&ge;75</span><span  \
class="my_list_sla_6" style="padding:0px 7px 0px 7px;">&ge;83</span><span  \
class="my_list_sla_7" style="padding:0px 7px 0px 7px;">&ge;90</span><span  \
class="my_list_sla_8" style="padding:0px 7px 0px 7px;">&ge;95 </span> </span>  &nbsp; `);

            $('#task_table td:contains("1 - Critical")').each( function() {
                $(this).addClass('P1cell_');
                $(this).find('div').css('background-color','red');
            });
            $('#task_table td:contains("2 - High")')    .each( function() {
                $(this).addClass('P2cell_');
                $(this).find('div').css('background-color','orange');
            });

            var mrow  = Number($('table#task_table').attr('total_rows'));
            var orow  = findcol('task_table','task.opened_at');
            var urow  = findcol('task_table','task.updated_on');
            var trow  = findcol('task_table','task.number');
            var sdrow = findcol('task_table','task.short_description');
            var extc  = findcol('task_table','task.u_ext_ref_no_calc');
            var row = 1;
            GM_log('##=# swow cases ' , mrow , orow);
            var n = new Date();
            var etadt = '';
            while ( row < (mrow + 1)) {
                var arrayOfTaskRow = [];
                var idcol = '';
                cnr = $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ') > a.linked').text();
                odt = $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + orow + ') > div:nth-child(1)').text().substr(0,11);
                GM_log('##=# caseage 1 ', odt  , row, orow , cnr) ;
                odt = odt.replace(/-/g,' ');
                //				GM_log('##=# caseage 2 ', odt  ) ; #row_task_7951c22bdbd893c068fd7b5a8c961994 > td:nth-child(19) > div.datex.date-calendar
                odt = Date.parse(odt);
                //				GM_log('##=# caseage  ', odt  ) ;
                GM_log('##=# swow case: ' + cnr + ' row: ' + row + ' trow: ' + trow  + ' mrow: ' + mrow  + ' dt: ' + odt );
                if (cnr){
                    if (GM_getValue(cnr + '_ETA')){
                        isnow = Number( Math.round(n.getTime()/3600000));										// /1000 = sec  60000 = min /3600000 = hrs
                        etadt = GM_getValue(cnr + '_ETA','');
                        swdt  = Number( Date.parse(etadt.replace(/-/g,' '))/3600000 );

                        GM_log('#=#=# stored ETA for case '+ cnr + ' ' + ( swdt  - isnow )  + ' hrs ' + etadt ) ;
                        if ( (swdt - isnow) < 0 ) {
                            if ( (swdt - isnow) <   0 ) idcol = '3px solid grey';
                            if ( (swdt - isnow) <  -8 ) idcol = '5px solid yellow';
                            if ( (swdt - isnow) < -12 ) idcol = '5px solid orange';
                            if ( (swdt - isnow) < -16 ) idcol = '5px solid red';
                            $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + sdrow + ')').css('border-left',idcol).attr('title','Do a SWOW update!!'); //.css('padding-left','5px').css('padding-right','5px');
                        }
                    }
                    GM_log('##=# caseage  ', odt  ) ;
                    var caseage = parseInt((n - odt)/(24*3600*1000));
                    if ( caseage > 30 ) {
                        var t = $('#task_table >  tbody:nth-child(2) >  tr:nth-child(' + row + ') > td:nth-child(' + orow + ')').css('color','red').attr('style');
                        if (t) {
                            t = t.replace('red;','red !important;');
                        } else {
                            t = 'color:red !important;';
                        }
                        $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + orow + ')').attr('style', t ).attr('title','Case is in backlog!').addClass('redlink');
                        $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ')').attr('title','Case is in backlog!').find('a').addClass('redlink').attr('style', t );
                    }
                    if ( caseage > 75 ) {
                        //					var t = $('#task_table >  tbody:nth-child(2) >  tr:nth-child(' + row + ') > td:nth-child(' + orow + ')').css('color','red').attr('style').replace('red;','red !important;');
                        $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + orow + ')').attr('title','Case is ancient! (>75d.)').addClass('redlink2');  //.attr('style', t )
                        $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ')').attr('title','Case is ancient! (>75d.)').addClass('redlink2').attr('style', 'background-color: rgba(255,240,40,0.2) !important;');
                    }

                }

                arrayOfTaskRow.push( $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ')').text() );
                arrayOfTaskRow.push( $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + extc + ')').text() );
                row++;
                Tasklistrows.push(arrayOfTaskRow);
            }

            GM_log('##=# colorlist done. ');
        }




        function colorcase (casenr, color, stl, perc, tmlt, slat, sola ) {

            var row = 1;
            tmlt = slat + ': ' + sola + ' is at  ' + perc + '%\nBusiness time left is: ' + tmlt;
            var trow = findcol('task_table','task.number');
            var sdrow = findcol('task_table','task.short_description');
            GM_log('##===# color the case ' , casenr, color , row, trow, sdrow);

            var exst =  $('#task_table >  tbody.list2_body >  tr.list_row ').length;
            GM_log('##=#  ', exst);
            while ( exst > 0 ) {
                //			GM_log('###=# ' , $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ')').text() );
                if ( $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ') > td:nth-child(' + trow + ')').text() == casenr ) {

                    $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ')').find('td').each( function() {
                        $(this).attr('title',tmlt);
                    });
                    GM_log('##=# color case Match' , casenr, color , row, trow);
                    $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ')').attr('title',tmlt).addClass('my_list_sla_' + stl).removeClass('my_list').removeClass('list_even').removeClass('list_odd');
                    //				$('#task_table >  tbody:nth-child(2) >  tr:nth-child(' + row + ') > td:nth-child(' + sdrow + ')').prepend('<div style="background-color:' + color + ';" class="list2_cell_background"></div>');
                }
                row++;
                exst =  $('#task_table >  tbody.list2_body >  tr:nth-child(' + row + ')').length;
            }
            $('#task_table').removeClass('table-hover');
        }


        function findcol (id, str) {
            //		GM_log('##=# findcol ' , id, str);
            if ( $('#' + id).length === 0 ) return -1;
            var trow = 1;
            var res = 0;
            var max = $('#hdr_task > th').length + 1;
            //		GM_log('##=# columns ' , max , trow, res  );
            while (res === 0 && trow < max ) {
                var th_title    = $('#hdr_task > th:nth-child(' + trow + ')').attr('glide_field');
                if ( th_title == str ) {
                    res = trow;
                    //                GM_log('##=# case found ' , th_title );
                }
                trow++;
            }
            //		GM_log('##=# findcol end' );
            return res;
        }


        function gettimestr() {
            var today=new Date();
            var h=today.getHours();
            var m=today.getMinutes();
            var s=today.getSeconds();
            m = checkTime(m);
            var timestring =  h + ":" + m +  "  " ;
            return timestring;
        }

        function checkTime(i) {
            if (i<10) {i = "0" + i;}  // add zero in front of numbers < 10
            return i;
        }

    });

}
// ==============================================================================================================================================================

// ==============================================================================================================================================================
// =                                                    navigation frame                                                                                        =
// =                                                                                                                                                            =
if ( script === '/navigator.do' ) {
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {

        GM_addStyle(' .menu_td            { border: 1px solid #fff; border-radius:3px;  } ');
        GM_addStyle(' .menu_td:hover      { border: 1px solid #000; border-radius:3px; background-color:#DFE; cursor:pointer;} ');
        GM_addStyle(' a.menu:hover        { text-decoration:none !important;} ');
        $('a.menu').each( function() {

            if ( $(this).parent().is('h3') ) {
                $(this).parent().parent().addClass('menu_td').on('click', function () {
                    $(this).find('a')[0].click();
                });
            } else {
                $(this).parent().parent().parent().addClass('menu_td').on('click', function () {
                    $(this).find('a')[0].click();
                });
            }
        });
        $('.menu_td').each( function() {
            $(this).hover( function () {
                $(this).find('a').addClass('colored');
            }, function () {
                $(this).find('a').removeClass('colored');
            });
        });

        setTimeout(function() {
            var x = 0;
            $('a.menu').each( function() {
                var itemurl = ( $(this).is('[href]') ) ? $(this).attr('href') : 'no href';
                x++;
                			GM_log('##=## navigator.do menu urls ', itemurl);
                if ( itemurl.indexOf('getMyAssignments') > -1  && itemurl.indexOf('task_list.do') > -1  && itemurl.indexOf('sysparm_view=') > -1 ) {
                    itemurl = itemurl.replace('^EQ^&sysparm_view=','^u_majorISEMPTY^EQ&sysparm_view=');
                    $(this).attr('href',itemurl);
                    GM_log('##=## Change href ' + x + ' ' + itemurl , $(this).attr('href') );
                }
            });
            $('a.menu_').each( function() {
                var itemurl = ( $(this).is('[href]') ) ? $(this).attr('href') : 'no href';
                x++;
                			GM_log('##=## navigator.do menu urls ', itemurl);
                if ( itemurl.indexOf('getMyAssignments') > -1  && itemurl.indexOf('task_list.do') > -1  && itemurl.indexOf('sysparm_view=') > -1 ) {
                    itemurl = itemurl.replace('^EQ^&sysparm_view=','^u_majorISEMPTY^EQ&sysparm_view=');
                    $(this).attr('href',itemurl);
                    GM_log('##=## Change href ' + x + ' ' + itemurl , $(this).attr('href') );
                }
            });
        }, 2000);

        GM_log('##=## navigator.do done ');

        $('span.icon-star').css('display','none');
        $('span.icon-star-empty').css('display','none');

    });

}
// ==============================================================================================================================================================

// =
// ==============================================================================================================================================================
// =                                                    DD Webex helper                                                                                         =
// =                                                                                                                                                            =
if ( script.indexOf('orion/meeting/schedule') > -1 ){
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {
        var url = window.location.href.split('\?')[1].split('&');
        for ( var x in url ) {
            if ( url[x].indexOf('confName'     ) > -1 ) { $('#input-confName').val( decodeURIComponent( url[1].split('=')[1] )); }
            if ( url[x].indexOf('scheduler-who') > -1 ) { $('#scheduler-who' ).val( url[x].split('=')[1] ); }
        }
    });

}
// ==============================================================================================================================================================

// =
// ==============================================================================================================================================================
// =                                                    New Webex helper                                                                                         =
// =                                                                                                                                                            =
if ( script.indexOf('scheduler/schedule.do') > -1 ){
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {

        var casewbx = GM_getValue('casewbx').split(';');
        GM_log('#=#=#=# New Webex scheduler');
        var casedt  = new Date( casewbx[0] );
        var dt = new Date();

        if ( (dt - casedt)  < 36000000 ) {
            GM_log('#=#=#=# cookie OK', (dt - casedt) );
            GM_log('#=#=#=# cookie OK', casewbx );
            var recep = casewbx[1];
            var subj  = decodeURIComponent(casewbx[2]);
            var body  = casewbx[3];
            GM_log('#=#=#=# subj =' ,  subj);


            $('input#attendees').val(recep);
            $('input#wcc-ipt-ConfName').val(subj).removeClass('form-length-l');
            GM_addStyle(' #wcc-ipt-ConfName.form-control   { width:480px !important; max-width:500px !important; } ');

        } else {
            GM_log('#=#=#=# cookie too old! ', (dt - casedt) );
        }


    });

}
// ==============================================================================================================================================================


// =
// ==============================================================================================================================================================
// =                                                    Fortinet helper                                                                                         =
// =                                                                                                                                                            =
if ( script === '/Main.aspx' || script === '/Ticket/ViewTickets.aspx' || script === '/Ticket/CreateTicket.aspx' ) {
    // ==============================================================================================================================================================

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {
        var h1 = '';
        var ref = document.referrer;
        if(ref.indexOf("ticketId=") > -1) {
            h1 = ref.split('&')[1];
            if ( h1.indexOf("ticketId=") == -1 ) { h1 = ref.split('&')[2]; }
            GM_log('# ', h1);
            //		alert(h1);
            GM_setValue('fortinetcase', h1.split('=')[1] );
            h1 = $('#ctl00_Content_dvTicket > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)').attr('href') + '&' + h1;
            $('#ctl00_Content_dvTicket > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)').attr('href', h1);
            $('#ctl00_Content_dvTicket > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)')[0].click();
        } else {
            if ( GM_getValue('fortinetcase') && script === 'Ticket/ViewTickets.aspx' ) {
                h1 = GM_getValue('fortinetcase');
                GM_log('# ', h1);
                //			alert(h1);
                GM_deleteValue('fortinetcase');
                var ietslater0 = setTimeout( function() { 																// seems input is not there immeadiatly after pageload
                    $('input#ctl00_Content_uc_tickets_txtSN').val(h1);
                    $('a#ctl00_Content_uc_tickets_lbtnSearch')[0].click();
                    var ietslater1 = setTimeout( function() { 															// wait for case list to show before we click it.
                        $('#ctl00_Content_uc_tickets_gvBasic > tbody:nth-child(1) > tr:nth-child(2)')[0].click();
                    }, 4000 );
                }, 1000);
            } else {
                if (script === 'Ticket/CreateTicket.aspx') {
                    if ( GM_getValue('ourcase') ) {
                        var ourcase = GM_getValue('ourcase');
                        var oursubj = GM_getValue('oursubj');
                        var blijfproberen = setInterval( function() {
                            if ($('#ctl00_Content_UC_TicketWizard_BasicStep_UC_TicketInfo_TB_Title') ) { $('#ctl00_Content_UC_TicketWizard_BasicStep_UC_TicketInfo_TB_Title').val(oursubj); }   //.length > 0
                            if ($('#ctl00_Content_UC_TicketWizard_CompleteStep_L_ticketId')          ) {
                                var casenr = $('#ctl00_Content_UC_TicketWizard_CompleteStep_L_ticketId').text();
                                GM_setValue('newcase', 'fortinet,' + casecreated );
                                console.log ('# stored ourcase@fortinet ' + 'fortinet,' + casecreated );
                                alert('Stored case@ ' + 'fortinet,' + casecreated );
                                GM_deleteValue('fortinetcase');
                                GM_deleteValue('ourcase');
                                GM_deleteValue('oursubj');
                            }
                        }, 1000 );
                    }
                }
            }
        }
    });

}
// ==============================================================================================================================================================


var vendor = VendorWebSite();

// ==============================================================================================================================================================
// =                                                    tpcase helper1 add our case                                                                             =
// =                                                                                                                                                            =
if ( vendor !== '' ) {
    // ==============================================================================================================================================================

    var pathname = window.location.pathname;
    var vendor   = VendorWebSite();
    var relevantPage = false;
    if (vendor.length > 1 ) relevantPage = true;
    GM_log('#=#=#=# VendorWebSite : ' , vendor , script );

    if ( pathname.indexOf('/create') > -1        && vendor === 'cisco' )           relevantPage = true;     // cisco    https://mycase.cloudapps.cisco.com/create/start
    if ( pathname.indexOf('/start')  > -1        && vendor === 'cisco' )           relevantPage = true;     // cisco    https://mycase.cloudapps.cisco.com/create/start
    if ( pathname.indexOf('/case')   > -1        && vendor === 'cisco' )           relevantPage = true;     // cisco    https://mycase.cloudapps.cisco.com/case
    if ( pathname.indexOf('/caseSubmitted') > -1 && vendor === 'cisco' )           relevantPage = true;     // cisco    https://mycase.cloudapps.cisco.com/caseSubmitted
    if ( pathname.indexOf('casemanager') > -1    && vendor === 'juniper'  )        relevantPage = true;     // Juniper
    if ( script === '/SRCreate'                  && vendor === 'emc'      )        relevantPage = true;     // EMC
    if ( script === '/app/ask'                   && vendor === 'infoblox' )        relevantPage = true;     // infoblox
    if ( pathname.indexOf('ask_confirm') > -1    && vendor === 'infoblox' )        relevantPage = true;     // infoblox
    if ( pathname.indexOf('500/')    > -1        && vendor === 'ca'       )        relevantPage = true;     // CA
    if ( pathname.indexOf('angora-cp-gui-eu')      > -1                )           relevantPage = true;     //
    if ( pathname.indexOf('TechnicalCaseEditPage') > -1                )           relevantPage = true;     //
    if ( pathname.indexOf('/customer/') > -1     && vendor === 'symantec' )        relevantPage = true;     // Symantec
    if ( pathname.indexOf('supportId%2CCreateServiceRequestId') > -1   )           relevantPage = true;     //
    if ( script === '/WorkOrder.do'                                    )           relevantPage = true;
    if ( pathname.indexOf('CasePremiseCreatePortal') > -1 && vendor === 'genesys') relevantPage = true;     //Genesys


    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {

        if (typeof unsafeWindow === "undefined") {
            unsafeWindow = window;
            GM_log('#=#=#=# unsafeWindow is not defined');
        }

        var casedt  = new Date( GM_getValue('casedt') );
        var dt = new Date();

        GM_addStyle('.ach {	background-color:#888; border-radius:10px; color:#FFF;padding: 0px 3px 1px 3px;line-height: 14px;  } .ach:hover {	background-color:#00F;color:#FF3;}'); // min-width:20px;
        GM_addStyle('#floattest   { background-color:#FFF; opacity:.6; } #floattest:hover {	opacity:1;}');
        GM_addStyle('.itsmtable td{ padding: 0px 5px 0px 5px;  }');
        $('body').append('<div id="floattest" style="z-index:15000;position:fixed;right:30px;bottom:20px;border: 1px solid #000;padding:5px;border-radius:10px;color:#000 !important;"</div>');
        var wait = 0;


        if ( (dt - casedt)  < 36000000 && relevantPage && vendor !== '' ) {
            GM_log('#=#=#=# cookie OK ', (dt - casedt), dt,  casedt);
            var done  = 0;

            var ourcase = GM_getValue('ourcase');
            var oursubj = GM_getValue('oursubj');
            var ourcust = GM_getValue('ourcust');
            var ourseri = GM_getValue('ourseri');
            var ourcont = GM_getValue('ourcont');
            var ourprod = GM_getValue('ourprod');



            GM_log('#=#=#=# cookie OK ', ourcase, oursubj, ourcust, ourseri );  //border=1 style="border:2px solid #000;"
            $('#floattest').append(`<table class=itsmtable>
<tr><td colspan=4><b><font style="color:blue;">ITSM+</font><span style="float:right;"class="ach">x</span></td></tr>
<tr><td><span style="float:left;" class="ach">&laquo;</span></td><td>&nbsp;</td><td>&nbsp;</td><td><span style="float:right;" class="ach">&raquo;</span></td></tr>
<tr><td align=right><b><font style="color:#000;">Vendor</b></td><td>:</td><td>` + vendor  + `</td>&nbsp;</td><td></tr>
<tr><td align=right><b><font style="color:#000;">Case</b></td>  <td>:</td><td>` + ourcase + `</td><td><span style="float:right;"class="ach">x</span></td></tr>
<tr><td align=right><b><font style="color:#000;">Subj</b></td>  <td>:</td><td>` + oursubj + `</td><td><span style="float:right;"class="ach">x</span></td></tr>
<tr><td align=right><b><font style="color:#000;">Cust</b></td>  <td>:</td><td>` + ourcust + `</td><td><span style="float:right;"class="ach">x</span></td></tr>
<tr><td align=right><b><font style="color:#000;">Serial</b></td><td>:</td><td>` + ourseri + `</td><td><span style="float:right;"class="ach">x</span></td></tr>
</table>`);
            $('.ach').on('click', function() {
                GM_log('#= ['+$(this).text()+']' + $(this).text().charCodeAt(0) + ' index=' + $('.ach').index(this) );
                if ( $(this).text().charCodeAt(0) === 171 ) $('#floattest').css('right','auto').css('left','30px');
                if ( $(this).text().charCodeAt(0) === 187 ) $('#floattest').css('right','30px').css('left','auto');
                if ( $('.ach').index(this) === 3 ) { ourcase = ''; $('#floattest > table > tbody > tr:nth-child(4) > td:nth-child(2)').text(''); }
                if ( $('.ach').index(this) === 4 ) { oursubj = ''; $('#floattest > table > tbody > tr:nth-child(5) > td:nth-child(2)').text(''); }
                if ( $('.ach').index(this) === 5 ) { ourcust = ''; $('#floattest > table > tbody > tr:nth-child(6) > td:nth-child(2)').text(''); }
                if ( $('.ach').index(this) === 6 ) { ourseri = ''; $('#floattest > table > tbody > tr:nth-child(7) > td:nth-child(2)').text(''); } //
                if ( $('.ach').index(this) === 0 ) {
                    $('#floattest').remove();
                    clearInterval(tadaa);
                }
            });

            $('#floattest_').click( function() {
                GM_deleteValue('ourcase');
                GM_deleteValue('oursubj');
                GM_deleteValue('ourcust');
                GM_deleteValue('ourseri');
                GM_deleteValue('ourcont');
                $('#floattest').remove();
                clearInterval(tadaa);
            });

            var tadaa = setInterval( function() {
                GM_log('# calling checkformloaded every 1500ms');
                checkformloaded();
            }, 1500);

            console.log ('# ourcase= ' + ourcase , ourcust , ourseri );
        } else {
            GM_log('#=#=#=# cookie too old!! ', (dt - casedt), dt,  casedt);
        }

        function checkformloaded() {

            if (vendor === 'cisco') {
                if ( $("p.ng-binding:contains('has been submitted successfully')").length > 0 )	{ done = 1; getcase_cisco(); } // #framework-content-main > div > section > div.ng-scope > section > div:nth-child(1) > div:nth-child(2) > div > h3 > strong
                if ( $('input#additionalInfoTrackingNumberInput').length > 0 ) 	{ done = 1; addparas_cisco0();	}
                if ( $('input#caseTitle').length > 0 ) 							{ done = 1; addparas_cisco1();	}
                if ( $('input#ProductSerialNumber').length > 0 ) 				{ done = 1; addparas_cisco2();	}
                if ( $('input#contractField').length > 0 ) 						{ done = 1; addparas_cisco3();	}
                if ( $('input#searchSubTech').length > 0 ) 						{ done = 1; addparas_cisco4();	}
            }

            if (vendor === 'emc') {
                if ( $("h2:contains('Thank You')").length > 0 )					{ done = 1; getcase_emc();      }
                if ( $('input[id*=j_id261]').length > 0 )						{ done = 1;	addparas_emc();		}
                if ( $('input[id*=ServiceRequest-Title]').length > 0 )			{ done = 1;	addparas_emc();		}
                if ( $('[id*=j_id163] > div > span > input').length > 0 )		{ done = 1;	addparas_emc();		}
                if ( $('[id*=j_id238] > div > span > input').length > 0 )		{ done = 1;	addparas_emc();		}
            }


            if (vendor === 'infoblox') {
                if ( $("div#rn_PageContent.rn_AskQuestion").length > 0 )		{ done = 1; getcase_infoblox(); }
                if ( $('input[id*=Incident\\.Subject]').length > 0 )			{ done = 1; addparas_infoblox();}
            }

            if (vendor === 'nimsoft') {
                if ( $('input#cas14').length > 0 ) 								{ done = 1; addparas_nimsoft(); }
            }

            if (vendor === 'genesys') {
                if ( $('#j_id0\\:caseForm\\:pgBlk\\:j_id53\\:j_id54').length > 0 ) { done = 1; addparas_genesys(); }
            }

            if (vendor === 'symantec') {
                if ( $('textarea#2023\\:0').length > 0 ) 						{ done = 1; addparas_symantec(); }
            }

            if (vendor === 'juniper') {
                if ( $('input#input_synopsis').length > 0 ) 					{ done = 1; addparas_juniper(); }
            }

            if (vendor === 'evercom') {
                if ( $('input#UDF_CHAR2').length > 0 ) 							{ done = 1; addparas_evercom(); }
            }

            if (vendor === 'f5') {
                if ( $('form#supportCase').length > 0 ) 						{ done = 1; addparas_F5();		}
            }

            if (vendor === 'checkpoint') {
                if ( $('input#srdevice').length > 0 )							{ done = 1; addparas_checkp0(); }
                if ( $('input#srsubject').length > 0 )							{ done = 1; addparas_checkp1(); }
                //			    if ( $('input#srsubject').length > 0 )							{ done = 1; addparas_checkp1(); }
                if ( $('input[name*=customerrefnum]').length > 0 )				{ done = 1; addparas_checkp2(); }
            }

            if (vendor === 'f5') {
                if ( $('input[name*="dbfield:3:__raw_custom"]').length > 0 )	{ done = 1; addparas_ntt() ; }
            }

            if (vendor === 'f5') {
                if ( $('input#caseEditPage\\:csEForm\\:csEPageBlock2\\:csEPageBlockSection1\\:j_id447\\:csCustRefNum').length > 0 )	{ done = 1; addparas_bluecoat(); }
            }
            //			GM_log('# testing form values presence all tried res: ', done );

            if (done > 0) {
                GM_log('# found, try again in 1500ms');
            } else {
                //				GM_log('# not found, try again in 1500ms');
            }
        }

        function addparas_symantec() {
            console.log ('# set ourseri 4 symantec ');
            if ( $('textarea#2023\\:0').val() === '' ) $('textarea#2023\\:0').val(oursubj);
        }

        function addparas_genesys() {
            console.log ('# set oursubj 4 genesys ');
            if ( $('#j_id0\\:caseForm\\:pgBlk\\:j_id53\\:j_id54').val() === '' ) $('#j_id0\\:caseForm\\:pgBlk\\:j_id53\\:j_id54').val(oursubj);
            if ( $('#j_id0\\:caseForm\\:pgBlk\\:j_id66\\:j_id68').val() === '' ) $('#j_id0\\:caseForm\\:pgBlk\\:j_id66\\:j_id68').val(ourcase);
        }


        function addparas_ntt() {
            console.log ('# set ourseri 4 ntt ');
            if ( oursubj ) { $('input[name="dbfield:3:__raw_custom__:__single__:summary"]').val(oursubj); }
            if ( ourseri ) { $('input[name="FPAR_related_configuration_items__filter"]').val(ourseri); }
        }

        function addparas_checkp0() {
            console.log ('# set ourseri 4 checkpoint ');
            if ( ourseri ) { $('input#srdevice').val(ourseri); }
        }
        function addparas_checkp1() {
            console.log ('# set oursubj 4 checkpoint ');
            if ( $('input#srsubject').val() === '') { $('input#srsubject').val(oursubj); }
        }
        function addparas_checkp2() {
            console.log ('# set other 4 checkpoint ');
            $('td.sstFieldTitle:nth-child(2) > input:nth-child(1)').prop('checked');
            // $('input.multiEditInputText').val(oursubj);
            if ( $('input.multiEditInputText').val() === '') { $('input.multiEditInputText').val(oursubj); }
            $('.contactInformation > tbody:nth-child(1) > tr:nth-child(14) > td:nth-child(2) > input:nth-child(1)').val(ourcase);
        }

        function addparas_bluecoat() {
            console.log ('# set ourcase 4 bluecoat ');
            $('input#caseEditPage\\:csEForm\\:csEPageBlock2\\:csEPageBlockSection1\\:j_id447\\:csCustRefNum').val(ourcase);
            if ( $('input#caseEditPage\\:csEForm\\:csEPageBlock2\\:csEPageBlockSection2\\:csSubj').val() === '') { $('input#caseEditPage\\:csEForm\\:csEPageBlock2\\:csEPageBlockSection2\\:csSubj').val(oursubj); }
        }

        function addparas_infoblox() {
            console.log ('# set ourcase 4 infoblox ');
            // rn_TextInput_19_Incident\\.CustomFields\\.CO\\.customer_ticket_reference  rn_TextInput_18_Incident\\.CustomFields\\.CO\\.customer_ticket_reference rn_BloxTextInput_20_Incident.CustomFields.CO.rma_serial_number_txt
            $('input[id*=customer_ticket_reference]').val(ourcase);
            if ( $('input[id*=Incident\\.Subject]').val() === '') { $('input[id*=Incident\\.Subject]').val('[' + ourcust + ']' +oursubj); }
            if ( ourseri && $('input[id*=rma_serial_number_txt]').val() === '' ) { $('input[id*=rma_serial_number_txt]').val(ourseri); }
        }

        function addparas_emc() {
            console.log ('# set ourcase 4 emc ');
            var ietslater = setTimeout( function() {
                if ( $('input[id*=j_id261]').length > 0 ) { if ( $('input[id*=j_id261]').val() === '') { $('input[id*=j_id261]').val(ourcase); } }
                if ( $('input#ext-comp-1030').length > 0 ) { if ( $('input#ext-comp-1030').val() === '') { $('input#ext-comp-1030').val(ourcase); } }
                if ( $('input[placeholder="Customer Tracking Number"]').length > 0 ) { if ( $('input[placeholder="Customer Tracking Number"]').val() === '') { $('input[placeholder="Customer Tracking Number"]').val(ourcase); } }
                if ( $('input[placeholder="Problem Summary *"]').length > 0 ) { if ( $('input[placeholder="Problem Summary *"]').val() === '') { $('input[placeholder="Problem Summary *"]').val(oursubj); } }
                if ( $('input[id*=ServiceRequest-Title]').val() === '') { $('input[id*=ServiceRequest-Title]').val(oursubj); }
                if ( $('[id*=j_id163] > div > span > input').val() === '' ) {
                    $('[id*=j_id163] > div > span > input').focus().val('4290731').blur().focusout().keyup();
                    $('[id*=j_id163] > div > span > input').change();
                }
                if ( $('[id*=prodIdSiteSS]').val() === '' ) $('[id*=prodIdSiteSS]').val('dontknow');
                if ( $('[id*=j_id238] > div.picklistBox > span > input').val() === '' ) $('[id*=j_id238] > div > span > input').val('9.4.1');
            }, 5000);
        }

        function addparas_cisco0() {
            console.log ('# set ourcase 4 cisco0 ');
            $('input#additionalInfoTrackingNumberInput').val( ourcase );
            if ( $('input#problemPageTitle').val() === '') { $('input#problemPageTitle').val(oursubj); }
            var ietslater = setTimeout( function() {
                $('input#additionalInfoTrackingNumberInput').val( ourcase );
                if ( $('input#problemPageTitle').val() === '') { $('input#problemPageTitle').val(oursubj); }
            }, 4000);
            console.log ('# ourcase@cisco set to ' + $('input#additionalInfoTrackingNumberInput').val() );
        }
        function addparas_cisco1() {
            console.log ('# set ourcase 4 cisco1 ');
            $('input[name*=trackingNumber]').val( ourcase );
            console.log ('# caseTitle@cisco set to ' + $('input#caseTitle').val().length );
            if ( $('input#caseTitle').val() === '') { $('input#caseTitle').val(oursubj); }
            var ietslater = setTimeout( function() {
                $('input[name*=trackingNumber]').val( ourcase );
                if ( $('input#caseTitle').val() === '') { $('input#caseTitle').val(oursubj); }
                //				if ( $('input#caseTitle').length == 0 ) { $('input#caseTitle').val(oursubj); }
            }, 4000);
            console.log ('# ourcase@cisco set to ' + $('input[name*=trackingNumber]').val() );
        }

        function addparas_cisco2() {
            console.log ('# set ourcase 4 cisco2 ');
            if (ourseri && ourseri !== ''){
                $('input#ProductSerialNumber').val( ourseri );
                ourseri = '';
                console.log ('# ourseri@cisco set to ' + $('input#ProductSerialNumber').val() );
            }
        }

        function addparas_cisco3() {
            console.log ('# set ourcase 4 cisco3 ');
            if (ourcont && ourcont !== ''){
                $('input#contractField').val( ourcont );
                ourcont = '';
                console.log ('# ourcont@cisco set to ' + $('input#contractField').val() );
            }
        }

        function addparas_cisco4() {
            console.log ('# set ourcase 4 cisco4 ');
            if (ourprod && ourprod !== ''){
                $('input#searchSubTech').val( ourprod );
                ourprod = '';
                console.log ('# ourprod@cisco set to ' + $('input#searchSubTech').val() );
            }
        }

        function addparas_juniper() {
            console.log ('# set ourcase 4 juniper ');
            $('input#customerTrackingNumber').val(ourcase);
            if ( $('input#serialNumber').val() === ''   && ourseri !== '') 	$('input#serialNumber').val(ourseri);
            if ( $('input#input_synopsis').val() === '' && oursubj !== '')  $('input#input_synopsis').val(oursubj);
            var ietslater = setTimeout( function() {
                $('input#customerTrackingNumber').val(ourcase);
                if ( $('input#serialNumber').val() === ''   && ourseri !== '') 	$('input#serialNumber').val(ourseri);
                if ( $('input#input_synopsis').val() === '' && oursubj !== '')  $('input#input_synopsis').val(oursubj);
                $('select#technicalCategory'    ).val('ZTEC'); 	   											// Technical Service Request
                $('select#followUpMethod'       ).val('EFUL'); 	   											// Email full text update
                $('div#srpriority > span.radio_block1:nth-child(3)').find('input').attr('checked',true);	// span.radio_block1:nth-child(3)
                console.log ('# set ourcase 4 juniper radio done');
            }, 5000);
        }

        function addparas_nimsoft() {
            console.log ('# set ourcase 4 nimsoft ');
            $('input#cas14').val(oursubj);
        }

        function addparas_evercom() {
            console.log ('# set ourcase 4 evercom ');
            $('input#title').val(oursubj);
            $('input#UDF_CHAR2').val(ourcust);
        }

        function addparas_F5() {
            console.log ('# set ourcase 4 F5 ');
            $('input#title').val(oursubj);
            $('input#serialNumber').val(ourseri);
        }
        // #yui_3_8_1_9_1492679683980_107

        function getcase_infoblox() {
            console.log ('#  get case infoblox ');
            if ($("div#rn_PageContent.rn_AskQuestion > div.rn_Padding > p:contains('Thanks for submitting your case.')").length > 0 ) {
                var casenr = $("div#rn_PageContent.rn_AskQuestion > div.rn_Padding > p:contains('Thanks for submitting your case.')").find('a').text() || '';
                var caseurl = 'https://support.infoblox.com' + $("div#rn_PageContent > div.rn_Padding > p:contains('Thanks for submitting your case.')").find('a').attr('href') || '' ;
                var casecreated = casenr + ',' + caseurl + ',' + GM_getValue('ourcase');
                if (casecreated) {
                    GM_setValue('newcase', 'infoblox,' + casecreated );
                    console.log ('# stored ourcase@infoblox ' + 'infoblox,' + casecreated );
                }
            }
        }
        function getcase_emc() {
            console.log ('#  get case emc ');
            //			var casecreated = $("h2:contains('Thank You')").parent().find('b').text() || '';
            var casecreated = $('div.Metapro-Light_Link > a.big_text_blue').text() || '';
            if (casecreated) {
                GM_setValue('newcase', 'emc,' + casecreated + ',,' + GM_getValue('ourcase'));
                console.log ('# stored ourcase@emc ' + 'emc,' + casecreated );
            }
        }
        function getcase_cisco() {
            console.log ('#  get case cisco ');
            var casecreated = $("p.ng-binding:contains('has been submitted successfully')").text().split(' ')[1];
            if ( $('#framework-content-main > div > section > div.ng-scope > section > div:nth-child(1) > div:nth-child(2) > div > h3 > strong').length > 0 ) casecreated = $('#framework-content-main > div > section > div.ng-scope > section > div:nth-child(1) > div:nth-child(2) > div > h3 > strong').text();
            if (casecreated) {
                GM_setValue('newcase', 'cisco,' + casecreated + ',,' + GM_getValue('ourcase'));
                console.log ('# stored ourcase@cisco ' + 'cisco1,' + casecreated );
                $('#floattest').html('<b><font style="color:blue;">ITSM+</font><br><font style="color:#000;"> Cisco case: </b>' + casecreated + ' created. ');
                clearInterval(tadaa);
            }
        }

        function getcase_symantec() {
            if ( $('#modalContent > div > div > div > div > div.sfdcProgressBar.cCCMySymcProgressBar.cCCMySymcBaseLC.cCCMySymcBaseLC.cCCMySymcCaseCreateWizard > div > div > div:nth-child(7)').hasClass('isCurrent') ) {
                var t0 = $('body > div.main-content.slds-container--x-large.slds-container--center > div > div.slds-col--padded.contentRegion.comm-layout-column > div > div:nth-child(1) > header > div.slds-page-header.forceHighlightsStencilDesktop > div > div.slds-grid.slds-col.slds-has-flexi-truncate.slds-media--center > div.slds-media__body > p').text();
                var t1 = $('body > div.main-content.slds-container--x-large.slds-container--center > div > div.slds-col--padded.contentRegion.comm-layout-column > div > div:nth-child(1) > header > div.slds-page-header.forceHighlightsStencilDesktop > div > div.slds-grid.slds-col.slds-has-flexi-truncate.slds-media--center > div.slds-media__body > h1 > span').text();
                var t2 = $('body > div.main-content.slds-container--x-large.slds-container--center > div > div.slds-col--padded.contentRegion.comm-layout-column > div > div:nth-child(1) > header > div.slds-page-header.forceHighlightsStencilDesktop > div > div.slds-grid.slds-col.slds-has-flexi-truncate.slds-media--center > div.slds-media__body > h1 > span').attr('title');
                if ( t0 === 'Case' && t1 === t2) {
                    var casenr = t1;
                    var casecreated = t1 + ',' + window.location + ',' + GM_getValue('ourcase');
                    GM_setValue('newcase', 'symantec,' + casecreated );
                    console.log ('# stored ourcase@symantec ' + 'symantec,' + casecreated );
                }
            }
        }
    });



}
// ==============================================================================================================================================================

// ==============================================================================================================================================================
// =                                                    tpcase helper2 capture casenr                                                                           =
// =                                                                                                                                                            =
if ( script.indexOf('/case') > -1                          || // cisco
    script.indexOf('/500') > -1                           || // CA
    script.indexOf('ask_confirm') > -1                    || // Infoblox
    script.indexOf('casemanager') > -1                    || //
    script.indexOf('ServiceRequestTool') > -1             || // cisco old
    script.indexOf('serviceordertool') > -1               || //
    script.indexOf('SRConfirm') > -1                      || // EMC
    script.indexOf('supportId%2CCreateServiceRequestId') > -1 ) {
    // ==============================================================================================================================================================


    console.log ('# ourcase@.. ' + window.location.href );


    if ( window.location.href.indexOf('ServiceRequestTool')  > -1 && window.location.href.indexOf('srId=') > -1 ) {
        var casecreated = window.location.href.split('=')[1];
        if (casecreated) {
            GM_setValue('newcase', 'cisco,' + casecreated );
            console.log ('# stored ourcase@cisco ' + 'cisco,' + casecreated );
        }
    }

    if ( window.location.href.indexOf('/case')  > -1  ) {
        var casecreated = $('p.ng-binding:nth-child(1) > a:nth-child(1)').text() + ',,' + GM_getValue('ourcase');
        if (casecreated) {
            GM_setValue('newcase', 'cisco,' + casecreated );
            console.log ('# stored ourcase@cisco ' + 'cisco1,' + casecreated );
        }
    }

    if ( window.location.href.indexOf('ask_confirm')  > -1 ) {
        console.log ('# storing ourcase@infoblox ');
        var casenr  = $("div#rn_PageContent.rn_AskQuestion > div.rn_Padding > p:contains('Thanks for submitting your case.')").find('a').text().replace('#','') || 'Could not find case nr on page' ;
        var caseurl = 'https://support.infoblox.com' + $("div#rn_PageContent.rn_AskQuestion > div.rn_Padding > p:contains('Thanks for submitting your case.')").find('a').attr('href') || 'Could not find case url on page' ;
        var casecreated = casenr + ',' + caseurl + ',' + GM_getValue('ourcase');
        if (casenr) {
            GM_setValue('newcase', 'infoblox,' + casecreated );
            console.log ('# stored ourcase@infoblox ' + 'infoblox,' + casecreated );
        }
    }

    if ( window.location.href.indexOf('casemanager/create')  > -1 ) {
        var casecreated  = $('div.bodyWrapper').find('a').text() + ',,' + GM_getValue('ourcase');
        if (casecreated) {
            GM_setValue('newcase', 'juniper,' + casecreated );
            console.log ('# stored ourcase@juniper ' + 'juniper,' + casecreated );
        }
    }

    // Bluecoat
    if ( window.location.href.indexOf('na32.sales')  > -1 ) {
        var caseurl =  window.location.href;
        var casenr = $('h2.pageDescription').text()  || 'Could not find case nr on page' ;
        var casecreated = casenr + ',' + caseurl  + ',' + GM_getValue('ourcase');
        if (casenr) {
            GM_setValue('newcase', 'bluecoat,' + casecreated );
            console.log ('# stored ourcase@bluecoat ' + 'bluecoat,' + casecreated );
        }
    }
    //  EMC
    if ( window.location.href.indexOf('SRConfirm')  > -1 ) {
        if ( $("div.Metapro-Light_Link > a.big_text_blue").length > 0 ) { var casecreated = $("div.Metapro-Light_Link > a.big_text_blue").text() + ',,' + GM_getValue('ourcase'); }
        if (casecreated) {
            GM_setValue('newcase', 'emc,' + casecreated );
            console.log ('# stored ourcase@emc ' + 'emc,' + casecreated );
        }
    }

    //  CHECKPOINT
    if ( window.location.href.indexOf('supportId,CreateServiceRequestId') > -1 ) {
        var casecreated = $('.resultSRCreation > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)').text()  || 'Could not find case nr on page' ;
        GM_setValue('newcase', 'checkpoint,' + casecreated );
        console.log ('# stored ourcase@checkpoint ' + 'checkpoint,' + casecreated );
    }

    //  NTT
    if ( window.location.href.indexOf('create-ticket') > -1 ) {
        if ( $('div.section_content:nth-child(1) > div:nth-child(1) > h2:nth-child(1)').length > 0 ) {
            var caseurl = $('div.section_content:nth-child(1) > div:nth-child(1) > h2:nth-child(1)').text();
            var casenr  = $('div.section_content:nth-child(1) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)').attr('href');
            var casecreated = casenr + ',' + caseurl  + ',' + GM_getValue('ourcase');
            if (casecreated) {
                GM_setValue('newcase', 'NTT,' + casecreated );
                console.log ('# stored ourcase@NTT ' + 'NTT,' + casecreated );
            }
        }
    }

    // CATCH CASENR
    var ietslater = setTimeout( function() {
        if ($('#floattest').length ===0 ) {
            $('body').append('<div id="floattest" style="position:fixed;right:30px;bottom:20px;border: 1px solid #000;padding:5px;background-color:#fff;opacity:.6;border-radius:10px;" title="Click to clear" ><b><font style="color:blue;">ITSM+</font><br><div>');
        }
        if ( GM_getValue('newcase') ) {
            if ( !casenr || casenr === '' ) var casenr = casecreated.split(',')[0];
            var inserttxt = ' <b> &nbsp; &nbsp; &nbsp; Case nr ' + casenr + ' found! &nbsp; &nbsp; &nbsp; </b>';
            $(inserttxt).insertAfter('#floattest > table > tbody > tr:nth-child(1) > td > b');   // #floattest > table > tbody > tr:nth-child(1) > td > b
            $('#floattest').css('opacity','1.0').css('left','auto').css('right','auto');
            GM_deleteValue('ourcase');
            GM_deleteValue('oursubj');
            GM_deleteValue('ourcust'); // 		alert('Case can be put into ITSM')
        }
    }, 2000);

    //  infoblox   https://support.infoblox.com/app/ask_confirm/i_id/587954    div#rn_PageContent > a


}
// ==============================================================================================================================================================

// ==============================================================================================================================================================
// =                                                    include exteral reference script                                                                        =
// =                                                                                                                                                            =
if ( script === '/u_ext_ref_no.do' ) {
    // ==============================================================================================================================================================


    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready(function() {
        GM_addStyle(' .mybut                { background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
        GM_addStyle(' .mybut:hover			{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0) !important; }');
        GM_addStyle(' .compact .form-control {     height: 18px; } ');
        GM_addStyle(' HTML[data-doctype=true] .form-group .col-xs-10.col-md-9.form-field {    width: 750px; } ');
        if (typeof unsafeWindow === "undefined") unsafeWindow = window;
        var reftype = $('#u_ext_ref_no\\.u_reference_type option:selected').text().trim();
        GM_log('# tpcase = ' + reftype);
        var wtlbl = 1;                                                                               // new 	#label\.u_ext_ref_no\.u_task > label:nth-child(1).text()
        if ( $('#label\.u_ext_ref_no\.u_task > label:nth-child(2)').text() === 'Task:') wtlbl = 2;   // old 	#label\.u_ext_ref_no\.u_task > label:nth-child(2).text()
        if ( reftype === '' || reftype === '-- None --') {
            $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('Case Reference:');
            $('#label\\.u_ext_ref_no\\.u_description      > label:nth-child(' + wtlbl + ')').text('Vendor:');
            $('sys_original.u_ext_ref_no.u_reference_type').val('Vendor reference number');
            $('#u_ext_ref_no\\.u_reference_type'          ).val('Vendor reference number');
            unsafeWindow.onChange('u_ext_ref_no.u_reference_type');
        }

        $('#u_ext_ref_no\\.u_reference_type').on('change', function() { reftypchng( this.value ); } );
        reftypchng($('#u_ext_ref_no\\.u_reference_type').val());
        $('#u_ext_ref_no\\.u_url').css('display','inline');
        $('#u_ext_ref_no\\.u_url_link').css('display','none');
        $('#u_ext_ref_no\\.u_url_lock').css('display','inline');
        $('#u_ext_ref_no\\.u_url_unlock').css('display','none');

        $('#u_ext_ref_no\\.u_description').after(`Or select from list: <select id="desc" name="desc" style="direction:ltr;height:18px;font-size: 12px;border-radius: 3px;border: solid 1px #666;float:right;width:85%;margin-top:3px;">\
<option value="0" ></option>\
<option value="19">  Alcatel-Lucent Enterprise - ALE</option>\
<option value="24">  Checkmk     </option>\
<option value="1" >  Avaya       </option>\
<option value="2" >  Bluecoat    </option>\
<option value="16">  CA          </option>\
<option value="4" >  Cisco       </option>\
<option value="5" >  Checkpoint  </option>\
<option value="6" >  EMC         </option>\
<option value="15">  Evercom     </option>\
<option value="7" >  F5          </option>\
<option value="8" >  Fortinet    </option>\
<option value="22">  Genesys     </option>\
<option value="9" >  Infoblox    </option>\
<option value="10">  Juniper     </option>\
<option value="11">  Nimsoft     </option>\
<option value="12">  NTT         </option>\
<option value="20">  Nuance      </option>\
<option value="13">  Palo Alto   </option>\
<option value="14">  Pulse Secure</option>\
<option value="17">  Riverbed    </option>\
<option value="18">  Splunk      </option>\
<option value="21">  Symantec    </option>\
</select>`);
        //		<option value="23">  ALE Rainbow </option>\

        $(`<tr><td colspan=2><hr>The fields used in the ITSM scripts are:<p><ul>\
<li><b>reference</b>, holding the external reference. RMA nr, Case nr, Customer reference, etc </li>\
<li><b>Reference type</b>, which is preset to "Vendor reference number".</li>\
<li><b>Vendor</b>, where you can enter any vendor or select one from a list of predefined vendors.</li>\
<li><b>URL</b>, possibly the link to your case that we can display above the comments.</li>\
</ul>The field <b>Company</b> is best not used, since it points to the list of all companies rather than to our vendors.<br>\
We do not know which vendor to choose due to many often indistinguishable duplicates per vendor.<br>
And of course we should be able to log a ticket for every vendor, not just the ones that happen to appear in the all companies list.<br>
I renamed the <b>Description</b> field to <b>Vendor</b>, so we can use that instead.<p><hr>\
Currently I have these vendors in my dropdown list.<ul>\
<li>Avaya</li>\
<li>Bluecoat</li>\
<li>Cisco</li>\
<li>Checkpoint</li>\
<li>EMC</li>\
<li>Evercom</li>\
<li>F5</li>\
<li>Fortinet</li>\
<li>Genesys</li>\
<li>Infoblox</li>\
<li>Juniper</li>\
<li>Nimsoft</li>\
<li>NTT</li>\
<li>Nuance</li>\
<li>Palo Alto</li>\
<li>Pulse Secure</li>\
<li>CA</li>\
<li>Riverbed</li>\
<li>Symantec</li>\
<li>Alcatel-Lucent</li>\
<li>Checkmk</li>\
</ul>\
If you see your vendor missing please tell me, if possible provide me wit the base url for their case management<br>\
<hr>\
</td></tr>`).insertAfter( $('#element\\.u_ext_ref_no\\.u_url') );
        //		<li>ALE Rainbow</li>\

        $('tr#element\\.u_ext_ref_no\\.u_company').css('display','none');
        $('input#u_ext_ref_no\\.u_reference_number').focus().parent().removeClass('flex-row');
        $('input#u_ext_ref_no\\.u_description'     ).parent().removeClass('flex-row');
        var p;
        var vndr;

        $('#desc').on('change', function() {
            GM_log('# chng ' ,  this.value , unsafeWindow.g_form );
            if ( this.value == 19 ) {  // Alcatel-Lucent Enterprise
                unsafeWindow.g_form.setValue('sys_display.u_ext_ref_no.u_company', 'Alcatel-Lucent Enterprise - ALE' );
                unsafeWindow.g_form.setValue('u_ext_ref_no.u_company','4829ce180f8a320019eb079ce1050e84');
                GM_log('# Alcatel-Lucent Enterprise!!  fields set!  ');
            }
            deschng(this.value);                                                                                                                   // F
        });

        if ( GM_getValue('newcase') && GM_getValue('newcase') !== '' && $('#u_ext_ref_no\\.u_reference_number').val() === '' ) {
            p = GM_getValue('newcase').split(',');
            GM_log('# newcase = ' + p[1] +' '+ p[0] +' array=['+ p +']');
            GM_deleteValue('newcase');
            vndr = getVendorID(p[0]);                                                                                                                // F
            if (p[2]) { unsafeWindow.g_form.setValue('u_ext_ref_no.u_url', p[2] ); }
            $('#u_ext_ref_no\\.u_reference_number').val( p[1] );
            $('select#desc').val( vndr );
            deschng(vndr);                                                                                                                           // F
            $('sys_original.u_ext_ref_no.u_reference_type').val('Vendor reference number');
            $('#u_ext_ref_no\\.u_reference_type'          ).val('Vendor reference number');
            $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('Case Reference:');
            $('#label\\.u_ext_ref_no\\.u_description      > label:nth-child(' + wtlbl + ')').text('Vendor:');
        }

        if ( GM_getValue('newrma') ) {
            p = GM_getValue('newrma').split(',');
            vndr = getVendorID(p[0]);                                                                                                                // F
            $('select#desc').val( vndr );
            deschng(vndr);                                                                                                                           // F
            GM_deleteValue('newrma');
            if (p[1]) {$('#u_ext_ref_no\\.u_reference_number').val( p[1] );}
            if (p[2]) { unsafeWindow.g_form.setValue('u_ext_ref_no.u_url', p[2] ); }
            $('sys_original.u_ext_ref_no.u_reference_type').val('Vendor reference number / RMA');
            $('#u_ext_ref_no\\.u_reference_type'          ).val('Vendor reference number / RMA');
            $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('RMA Reference:');
            $('#label\\.u_ext_ref_no\\.u_description      > label:nth-child(' + wtlbl + ')').text('Vendor:');
            GM_log('# newrma done' );
        }

        $('button.action_context').addClass('mybut').css('border-color','#FFF');

        function deschng(opt) {
            var t = $('#desc option:selected').text().trim();
            reftype = $('#u_ext_ref_no\\.u_reference_type option:selected').text().trim();
            GM_log('#=#=#=# opt=' + opt +' t='+  t +' reftype='+  reftype);
            $('#u_ext_ref_no\\.u_description').val(t);
            setURLstr(reftype);
            var cur_url = unsafeWindow.g_form.getValue('u_ext_ref_no.u_url');
            if (opt) {
                GM_log('#=#=#=# u_ext_ref_no.u_url = ' + cur_url.length +  ' [' + urlstr[opt] + '] ' + urlstr[9] );
                if ( urlstr[opt].length >  1 && ( cur_url.length == 7 || cur_url.length === 0 ) )  {
                    var Cref = unsafeWindow.g_form.getValue('u_ext_ref_no.u_reference_number').trim() ;
                    if ( opt == 12 ) { Cref = Cref.replace('TK-EU-',''); }
                    if ( urlstr[opt].indexOf('{case}') > 0 ) unsafeWindow.g_form.setValue('u_ext_ref_no.u_url', urlstr[opt].replace('{case}',Cref)  );
                    else 					                 unsafeWindow.g_form.setValue('u_ext_ref_no.u_url', urlstr[opt] );
                    GM_log('#=#=#=# u_ext_ref_no.u_url set to =' + unsafeWindow.g_form.getValue('u_ext_ref_no.u_url') );
                }
            }

        }

        setTimeout(function(){ $('tr#element\\.u_ext_ref_no\\.u_company').css('display','none'); $('input#u_ext_ref_no\\.u_reference_number').focus(); }, 500);

        function reftypchng(opt) {
            var t = $('#u_ext_ref_no\\.u_reference_type option:selected').text().trim();
            GM_log('#=#=#=# ', opt, t, wtlbl);
            if ( opt === 'Client reference number' ) {     $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('Client Reference:');
                                                      $('#label\\.u_ext_ref_no\\.u_description    > label:nth-child(' + wtlbl + ')').text('Description:'); }
            else                                             $('#label\\.u_ext_ref_no\\.u_description    > label:nth-child(' + wtlbl + ')').text('Vendor:');
            if ( opt === 'Vendor reference number / RMA' ) $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('RMA Reference:');
            if ( opt === 'Vendor reference number' )       $('#label\\.u_ext_ref_no\\.u_reference_number > label:nth-child(' + wtlbl + ')').text('Case Reference:');
        }

    });


}
// ==============================================================================================================================================================




// ==============================================================================================================================================================
// =                                                    ITSM create page                                                                                        =
// =                                                                                                                                                            =
if ( script === '/u_new_call.do' ) {
    // ==============================================================================================================================================================
    GM_addStyle(' .btn			{ padding:0px !important;}');
    GM_addStyle(' .btn-default	{ padding:0px !important; line-height: 8px !important; }'); //height:12px !important; padding:0px !important;
    GM_addStyle(' .btn-ref		{ padding:0px !important; font-weight:normal !important; min-height:10px !important; height:14px !important; line-height:10px !important; width:14px !important; margin-bottom: 1px;  }');   // border: 1px solid blue;
    GM_addStyle(' .btn-icon		{ font-size:12px !important; line-height:10px !important; padding:0px !important; height:14px !important;	 }');
    GM_addStyle(' .itsmplus		{ background-color:#efffff; padding:0px 2px 2px 4px !important;border-radius:5px !important; border:solid 1px #cccccc; }');

    GM_addStyle(' .control-label		{ max-width:230px !important; }');
    GM_addStyle(' .mybut                { background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
    GM_addStyle(' .mybut_               { color:#000;border:solid 0px #000; }');
    GM_addStyle(' .mybut:hover			{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0) !important; }');
    GM_addStyle(' .mybut:after          { position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
    GM_addStyle(' div.annotation-wrapper { background-color:#dfffff;  background:linear-gradient(to right, #32aeae, #ffffff , #dfffff); border-radius:5px !important; border:solid 1px #cccccc;padding:0px 0px 0px 6px !important;margin:0px 10px 0px 10px;color:#fff;font-weight:normal !important; }'); // background: -moz-linear-gradient(right,  #64ceff, #dddddd , #dfffff);
    GM_addStyle(' input.form-control  { height:16px !important; min-height:  14px !important; max-width:270px !important;}'); // height:16px !important;
    GM_addStyle(' select.form-control { height:16px !important; min-height:  14px !important; max-width:270px !important;}');
    GM_addStyle(' .form-field           {  min-height:  14px !important; max-width:300px !important;}');
    GM_addStyle(' HTML[data-doctype=true] .form-group .col-xs-10.col-md-9.form-field ~ .form-field-addons { width: 542px !important; }');


    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {


        $('#u_new_call\\.short_description').removeClass('form-control').css('width','800px').focus();
        GM_log('# know ' , $('#element\\.u_new_call\\.short_description > div.col-xs-2.col-md-1_5.col-lg-2.form-field-addons > a').length );
        $('#u_new_call\\.comments').focus().removeClass('form-control').css('width','800px').css('resize','both');
        $('#u_new_call\\.work_notes').removeClass('form-control').css('width','800px').css('resize','both');
        script = script.replace(/\//,'').replace('.do','');
        var topdiv = $('div.section-content'); //sys_original.u_new_call.company
        GM_log('# topdiv ' , topdiv.length );
        topdiv.find('img').each( function(){
            if ( $(this).attr('data-original-title') || $(this).attr('title')  ) {
                if ( $(this).parent().css('visibility') === 'hidden' ) { $(this).parent().css('display','none'); }
                $(this).parent().addClass('btn').addClass('btn-default');
                $(this).replaceWith('<div class="itsmicons"  style="width: 16px; height: 16px;  background-image: url(' + $(this).attr('src') + '); background-position: -8px -8px; display:inline-block;" title="' + $(this).attr('data-original-title') + '"></div>');
            }
        });
        $('a.btn.btn-default').addClass('height15').css('height','16px').attr('style','height:16px !important;width:16px !important;');
        if ( $('#show_map\\:u_new_call\\.cmdb_ci').css('visibility') === 'hidden' ) $('#show_map\\:u_new_call\\.cmdb_ci').css('display','none');

        $('button.form_action_button').addClass('mybut');
        $('#moreOptionsContainer').hide();
        $('button > span.icon').css('margin-left','-4px');
        //            #show_map\3a u_new_call\2e u_contract_ci

        $('#element\\.u_new_call\\.short_description > div.col-xs-2.col-md-1_5.col-lg-2.form-field-addons > a').attr('style','float:right !important;');

        $('input#sys_display\\.u_new_call\\.company'        ).blur( function() { ach(); } ).focus( function() { ach(); } ).keyup( function() { ach(); });
        $('input#sys_display\\.u_new_call\\.location'       ).blur( function() { ach(); } ).focus( function() { ach(); } ).keyup( function() { ach(); });
        $('input#sys_display\\.u_new_call\\.u_caller'       ).blur( function() { ach(); } ).focus( function() { ach(); } ).keyup( function() { ach(); });
        $('input#sys_display\\.u_new_call\\.u_requested_for').blur( function() { ach(); } ).focus( function() { ach(); } ).keyup( function() { ach(); });

        if ( $('#showcompcase').length < 1) { $('#element\\.u_new_call\\.company         > div:nth-child(3) > span').append('<span id="showcompcase" class="itsmplus"><a href="" target=_blank><img src="images/green_back.gifx" style="width:14px;height:14px;" /></a></span>');}
        if ( $('#showcomploca').length < 1) { $('#element\\.u_new_call\\.location        > div:nth-child(3) > span').append('<span id="showcomploca" class="itsmplus"><a href="" target=_blank><img src="images/green_back.gifx" style="width:14px;height:14px;" /></a></span>');}
        if ( $('#showcompucal').length < 1) { $('#element\\.u_new_call\\.u_caller        > div:nth-child(3) > span').append('<span id="showcompucal" class="itsmplus"><a href="" target=_blank><img src="images/green_back.gifx" style="width:14px;height:14px;" /></a></span>');}
        if ( $('#showcompureq').length < 1) { $('#element\\.u_new_call\\.u_requested_for > div:nth-child(3) > span').append('<span id="showcompureq" class="itsmplus"><a href="" target=_blank><img src="images/green_back.gifx" style="width:14px;height:14px;" /></a></span>');}
        $('#element\\.u_new_call\\.cmdb_ci > div:nth-child(3) > span'      ).append('<span id="ci-lst0" class="itsmplus"><a id="mysrch0" class="btn btn-default btn-ref icon icon-info" title="-= CI search =-"><span class="sr-only"></span></a></span>');
        $('#element\\.u_new_call\\.u_contract_ci > div:nth-child(3) > span').append('<span id="ci-lst"  class="itsmplus"><a id="mysrch"  class="btn btn-default btn-ref icon icon-info" title="-= CI search =-"><span class="sr-only"></span></a></span>');
        $('#mysrch0').click(CIsearch);
        $('#mysrch' ).click(CIsearch);


        GM_addStyle(' .icon-info { width: 15px !important; line-height: 14px !important; height: 15px !important;}');
        GM_addStyle(' .icon-locked { line-height: 14px !important; }');
        GM_addStyle(' HTML[data-doctype=true].compact .btn-ref                           { padding: 0px !important; width: 15px !important; height: 15px !important;}');
        GM_addStyle(' html[data-doctype=true].compact .input-group .input-group-btn .btn { height: 16px !important; width: 16px;line-height: 14px;padding: 0px !important;}');
        GM_addStyle(' .icon-info::before { margin-top: -2px;    margin-left: 1px;}');
        GM_addStyle(' a#mysrch0::before  { content: "\\f1c7";color:red; margin-left:0px !important; margin-top:-1px;}');
        GM_addStyle(' a#mysrch::before   { content: "\\f1c7";color:red; margin-left:0px !important; margin-top:-1px;}');
        GM_addStyle(' .icon-tree:before  { margin-top: -3px; }');


        $('#showcompcase').hide();
        $('#showcomploca').hide();
        $('#showcompucal').hide();
        $('#showcompureq').hide();
        $('body').on('mouseup', function() { ach(); });

        $('#show_map\\:' + script + '\\.cmdb_ci'      ).attr('style','padding: 0px 4px 0px 4px !important; display: inline; margin: 0px; display:inline;');
        $('#show_map\\:' + script + '\\.u_contract_ci').attr('style','padding: 0px 4px 0px 4px !important; display: inline; margin: 0px; display:inline;');

        $('#element\\.u_new_call\\.comments\\.additional').removeClass('form-field');


        function ach() {
            puticons();
            setTimeout(function() { puticons(); },500);
        }

        function puticons() {
            if ( $('input#u_new_call\\.company').val() !== '' ) {
                $('#showcompcase > a').attr('href', '/task_list.do?sysparm_query=company=' + $('input#u_new_call\\.company').val() + '&sysparm_view=' );
                $('#showcompcase > a').attr('title', 'Cases for Customer: ' + $('input#sys_display\\.u_new_call\\.company').val()  );
                $('#showcompcase').show();
                GM_log('#=#_   update link for company:', $('input#u_new_call\\.company').val(),  $('input#sys_display\\.u_new_call\\.company').val()  );
            } else { $('#showcompcase').hide(); }
            if ( $('input#u_new_call\\.location').val() !== '' ) {
                $('#showcomploca > a').attr('href', '/task_list.do?sysparm_query=location=' + $('input#u_new_call\\.location').val() + '&sysparm_view=' );
                $('#showcomploca > a').attr('title', 'Cases for Customer: ' + $('input#sys_display\\.u_new_call\\.location').val()  );
                $('#showcomploca').show();
                GM_log('#=#_   update link for location:', $('input#u_new_call\\.location').val()  );
            } else { $('#showcomploca').hide(); }
            if ( $('input#u_new_call\\.u_caller').val() !== '' ) {
                $('#showcompucal > a').attr('href', '/task_list.do?sysparm_query=u_caller=' + $('input#u_new_call\\.u_caller').val() + '&sysparm_view=' );
                $('#showcompucal > a').attr('title', 'Cases for Customer: ' + $('input#sys_display\\.u_new_call\\.u_caller').val()  );
                $('#showcompucal').show();
                GM_log('#=#_   update link for requester:', $('input#u_new_call\\.u_caller').val()  );
            } else { $('#showcompucal').hide(); }
            if ( $('input#u_new_call\\.u_requested_for').val() !== '' ) {
                $('#showcompureq > a').attr('href', '/task_list.do?sysparm_query=u_requested_for=' + $('input#u_new_call\\.u_requested_for').val() + '&sysparm_view=' );
                $('#showcompureq > a').attr('title', 'Cases for Customer: ' + $('input#sys_display\\.u_new_call\\.u_requested_for').val()  );
                $('#showcompureq').show();
                GM_log('#=#_   update link for Affect contact:', $('input#u_new_call\\.u_requested_for').val()  );
            } else { $('#showcompureq').hide(); }
            //   #element\2e u_new_call\2e company > div.col-xs-2.col-sm-3.col-lg-2.form-field-addons > span  u_requested_for
        }



    });

}
// ==============================================================================================================================================================





// ==============================================================================================================================================================
// =                                                    Normal Use Default_Mail_client                                                                          =
// =                                                                                                                                                            =
if ( script === '/u_request.do' || script === '/incident.do' || script === '/change_request.do' || script === '/problem.do' || script === '/u_rim_event.do' || script === '/u_service_order.do' || script === '/pm_project.do' ||
    script === '/pm_project_task.do' || script === '/u_request_task.do' || script === '/u_incident_task.do' || script === '/change_task.do' ||  script === '/u_problem_task.do' ||         // Tasks
    script === '/sc_request.do' ||  script === '/sc_req_item.do' ) {                                                                                       // NTT internal
    // ==============================================================================================================================================================

    timer1 = new Date();
    GM_addStyle(' span.tabs2_section.section { border-style:solid; padding:0px 5px; border-top-width:0px;border-left-width:1px;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;border-bottom-width:1px;display:block;border-right-width: 1px; }');
    GM_addStyle(' HTML[data-doctype=true] DIV.tabs2_strip     { border-color: #bdc0c4; border-style:solid; border-right-width:1px;border-left-width:1px ;border-top-width:1px;border-top-right-radius:5px; border-top-left-radius: 5px;padding-left: 5px; border-bottom-width: 0px;} ');  //border-color:#666;
    GM_addStyle(' HTML[data-doctype=true] .tab_section > span { border-top:0px;border-left:1px;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;border-color: #bdc0c4;border-style: solid;  }');
    GM_addStyle(' #godown { border-bottom-left-radius: 5px; }');
    GM_addStyle(' #sober  { border-bottom-right-radius:5px; border-right-width: 1px !important; } ');
    GM_addStyle(' HTML[data-doctype=true] .tabs2_strip .tabs2_tab.tabs2_active {border-left: 0px solid #ddd !important;} ');
    GM_addStyle(' .tabs2_activel {border-right-width:1px !important;border-bottom-right-radius: 5px;} ');
    GM_addStyle(' .tabs2_activer {border-bottom-left-radius: 5px;} ');
    GM_addStyle(' .tab_caption_text { padding: 0 2px 2px 2px !important; } ');
    GM_addStyle(' .tabs2_tab        { padding: 0px !important; } ');
    GM_addStyle(' .related-list-trigger-container { border-color: #bdc0c4; border-width: 1px;border-style: solid;border-top: 0px;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px; }');
    GM_addStyle(' .related-list-trigger-container > hr { display:none; }');
    GM_addStyle(' body					{ color:#000 !important; line-height: 16px !important; font-size:12px !important; }');
    GM_addStyle(' a					    { color:#3080b0;  }');
    GM_addStyle(' a:visited				{ color:#8080b0;  }');
    GM_addStyle(' a:hover				{ color:#c08030;  }');
    GM_addStyle(' .compacting			{ height:16px !important; min-height:  14px !important; }');
    GM_addStyle(' .input-group-btn		{ height:10px !important; padding:0px !important; display: block !important; }');
    GM_addStyle(' .btn					{ padding:0px !important;}');
    GM_addStyle(' .btn-default			{ padding:0px !important; line-height: 8px !important; }'); //height:12px !important; padding:0px !important;
    GM_addStyle(' .btn-ref				{ padding:0px !important; font-weight:normal !important; min-height:10px !important; height:14px !important; line-height:10px !important; width:14px !important; }');   // border: 1px solid blue;
    GM_addStyle(' .btn-icon				{ font-size:12px !important; line-height:10px !important; padding:0px !important; height:14px !important;	 }');
    GM_addStyle(' .col-lg-3				{ padding:0px; }');  // label
    GM_addStyle(' .col-lg-4				{ width:130px !important; padding:0px 2px 0px 2px; }');  // label width:130px !important;
    GM_addStyle(' .col-lg-5				{ width:280px !important; }');  // field
    GM_addStyle(' .form-field-addons	{ min-width:205px !important; }');  // icons behind
    GM_addStyle(' .list_popup			{ font-size:12px !important; line-height:10px !important; padding:0px !important;	 }');
    GM_addStyle(' .input-group-checkbox { font-size:12px !important; line-height:10px !important; padding:0px !important; height:20px; min-height:10px !important; font-weight:100 !important;	 }');
    GM_addStyle(' .control-label		{ font-size:12px !important;  padding-bottom:0px !important; line-height:10px !important;	 }');
    GM_addStyle(' .checkbox				{ font-size:12px !important; line-height:10px !important; padding:0px !important; height:10px !important; min-height:10px !important; font-weight:100 !important;	 }');
    GM_addStyle(' .checkbox-label		{ font-weight:100 !important;height:16px !important;  }');
    GM_addStyle(' .required-marker		{ max-width:10px !important; width:10px !important; font-size:6px !important; font-weight:50 !important; padding:0px !important; color:red !important; 	 }');
    GM_addStyle(' .row					{ min-height:10px !important; }');
    GM_addStyle(' .form-field			{ min-height:10px !important; }');
    GM_addStyle(' .form-group			{ padding:0px !important;  }');
    GM_addStyle(' .input-group-addon	{ padding:0px 2px 0px 2px; }');
    GM_addStyle(' .form-group			{ margin-bottom:4px; }');
    GM_addStyle(' input.form-control	{ height:16px !important; min-height:  14px !important; }');
    GM_addStyle(' select.form-control	{ height:16px !important; min-height:  14px !important; width:250px !important;}');
    GM_addStyle(' select.slushselect    { height:300px !important; width:auto !important; }');
    GM_addStyle(' select.list-edit-input  { height:auto !important; width:auto !important; }');
    GM_addStyle(' div.button-column     { padding-left:0px !important; }');
    GM_addStyle(' div.input-group		{ height:16px !important; padding:0px !important;  width:250px !important; }');
    GM_addStyle(' td, input, select		{ padding-top:0px !important; padding-bottom:0px !important;line-height:13px !important;	 }');
    GM_addStyle(' div.section-content   { margin-top:0px !important; padding-top:0px !important; }');
    GM_addStyle(' #header_attachment_line { margin-top:3px !important; margin-bottom:0px !important; }');
    GM_addStyle(' #' + script + '\\.section_header_spacer { margin-top:2px !important; margin-bottom:0px !important; }');
    GM_addStyle(' .vt				{ padding:0px 4px 0px 4px !important;	 }');
    GM_addStyle(' .navbar			{ padding:0px 4px 0px 4px !important; border:none; background-color:transparent;	 }');
    GM_addStyle(' div.navbar-header		{ width:160px !important; padding:1px !important; 	 }'	);
    GM_addStyle(' div.pointerhand		{ width:200px;  	 }'	);
    GM_addStyle(' .itsmplus				{ background-color:#efffff; padding:0px 2px 2px 4px !important;border-radius:5px !important; border:solid 1px #cccccc;min-height:14px; }');
    GM_addStyle(' .itsmplus	a			{ padding:0px 1px 0px 1px;text-decoration: none; }');
    GM_addStyle(' .info_box  			{ background-color:lightyellow !important; border:1px solid orange !important; border-radius:5px !important; margin:0px 10px 0px 10px !important; }' );
    GM_addStyle(' tr.annotation-row		 { background-color:transparent !important; padding:0px !important;}');
    GM_addStyle(' td.annotation			 { background-color:transparent !important; padding:0px !important; }');
    GM_addStyle(' div.annotation-wrapper { background-color:#dfffff;  background:linear-gradient(to right, #32aeae, #ffffff , #dfffff); border-radius:5px !important; border:solid 1px #cccccc;padding:0px 0px 0px 6px !important;margin:0px 10px 0px 10px;color:#fff;font-weight:normal !important; }'); // background: -moz-linear-gradient(right,  #64ceff, #dddddd , #dfffff);
    GM_addStyle(' .tabs2_strip          { margin-top:0px !important; }');
    GM_addStyle(' .tabs2_hover          { border-color:#ffa500 !important; background-color:lightyellow !important; }');
    GM_addStyle(' .redalert             { background-color:#FF9326;color:#FFF;border:solid 1px #444;padding:2px 0px 4px 3px;border-radius:4px;}');
    GM_addStyle(' .boxsizingBorder      { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width:100%; height:100%; max-height:none; }');
    GM_addStyle(' BUTTON:hover			{ box-shadow: initial; box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0); }');
    GM_addStyle(' .mybut                { background-color:#DFE;background-image: linear-gradient(#6D6,#282);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);min-height:15px !important;margin:2px !important;}');
    GM_addStyle(' .mybut_               { color:#000;border:solid 0px #000; }');
    GM_addStyle(' .mybut:hover			{ background-color:#6b6;background: linear-gradient(#FFFFFF, #DFE);border:solid 1px #0F0;color:#000 !important;text-decoration:none !important;box-shadow: 5px 5px 15px 0px rgba(0,255,0,1.0) !important; }');
    GM_addStyle(' .mybuthi              { background-color:#DFE;background-image: linear-gradient(#fca73d,#6d3c00);color:#fff !important;border:solid 1px #fff;padding:3px 4px 3px 4px !important;border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px;box-shadow: 0px 1px 4px -2px #333;box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.3);}');
    GM_addStyle(' .mybut:after          { position:absolute;top:2px;left:2px;width:calc(100%-4px);height:50%;background:linear-gradient(rgba(0,255,0,0.9),rgba(255,255,255,0.1));}');
    GM_addStyle(' A.mybut:visited       { color:#FFF !important; }');
    GM_addStyle(' A.mybut:hover         { color:#000 !important; }');
    GM_addStyle(' .swowhilite           { background-color:#dfffff;  background:linear-gradient(45deg, #dfffff, #dddddd , #64cece) ; background: -moz-linear-gradient(45deg,  #dfffff, #dddddd , #dfffff) ;  color:#000; ;padding:10px 14px 10px 14px !important;border-radius:7px !important;border:solid 1px #cccccc; }');
    GM_addStyle(' .flataera             { border:0;overflow:auto;background-color:#fff;resize:none;color:#000;font-family:Consolas;white-space:pre; word-wrap:normal; overflow-x:scroll; }');
    GM_addStyle(' .hov                  { padding:3px 4px 3px 4px; overflow:scroll; border-radius:3px; font-weight:normal; font-size:12px; line-height:12px; }');
    GM_addStyle(' .hov:hover            { background-color:#DFE; color:#000 !important;  }');
    GM_addStyle(' .previmg              { max-width:100px; height:auto;}');
    GM_addStyle(' .previmg:hover        { max-width:none;  border:solid 3px #000;}');
    GM_addStyle(' .borderon             { border: solid 3px #000}');
    GM_addStyle(' .draghandle      		{ cursor:move; }');
    GM_addStyle(' .draghandle:hover		{ background-color:rgba(221,255,238, 0.4); }');
    GM_addStyle(' .chgnhover:hover      { background:#efffff; }');
    GM_addStyle(' .normalbg				{ background:#DFE; border:solid 2px #DFE;border-radius:3px; }');
    GM_addStyle(' .alertbg				{ background:#FB9; border:solid 2px #FB9;border-radius:3px; }');
    GM_addStyle(' .faultbg				{ background:red;  border:solid 2px red;border-radius:5px;padding:7px;color:#fff;   }');
    GM_addStyle(' .phnlnk_              { border: 2px solid rgb(221,255,238);background-color:rgb(221,255,238);margin-left:auto;margin-right:auto; } ');
    GM_addStyle(' .phnlnk1              { border: 2px solid rgb(221,255,238);background-color:rgb(221,255,238);margin-left:auto;margin-right:auto; } ');
    GM_addStyle(' .telclr				{ color:#600;} ');
    GM_addStyle(' .mypopup				{ background-color:#eee;border:solid 1px #888;border-radius:7px;color:#000;padding:7px 7px 0px 7px; z-index:100;box-shadow: 3px 3px 10px 6px rgba(192,240,240,0.75); }');
    GM_addStyle(' .mypopup	th			{ background-color:#DFE;color:#000; }');
    GM_addStyle(' .redlink 				{ color:red;font-weight:bold;}' );
    GM_addStyle(' .sprite1				{ background-image:url("/images/sprites/i16.pngx"); background-repeat: no-repeat; }');
    GM_addStyle(' .button1				{ width:16px;height:16px;display:block;background-position: -0px -0px; }');
    GM_addStyle(' .button1:hover		{ background-color:#f00; }');
    GM_addStyle(' .button2				{ width:16px;height:16px;display:block;background-position: -0px -16px; }');
    GM_addStyle(' .button2:hover		{ background-color:#f00; }');
    GM_addStyle(' .close-button	        { width:16px;height:16px;display:block;background-position: -0px -208px; }');
    GM_addStyle(' .close-button:hover   { background-color:#f00; }');
    GM_addStyle(' .close-button	        { width:16px;height:16px;display:block;background-position: -0px -208px; }');
    GM_addStyle(' .close-button:hover   { background-color:#f00; }');
    GM_addStyle(' .globe-button	        { width:16px;height:16px;display:block;background-position: -0px -112px; }');
    GM_addStyle(' .globe-button:hover   { background-color:#DFE; }');
    GM_addStyle(' .msg-button	        { width:16px;height:16px;display:block;background-position: -0px -128px; }');
    GM_addStyle(' .msg-button:hover     { background-color:#DFE; }');
    GM_addStyle(' .plus-button	        { width:16px;height:16px;display:block;background-position: -0px -336px; }');
    GM_addStyle(' .plus-button:hover    { background-color:#DFE; }');
    GM_addStyle(' .min-button	        { width:16px;height:16px;display:block;background-position: 0px -352px; }');
    GM_addStyle(' .min-button:hover     { background-color:#DFE; }');
    GM_addStyle(' .up-button	        { width:16px;height:16px;display:block;background-position: -0px -432px; }');
    GM_addStyle(' .up-button:hover		{ background-color:#DFE; }');
    GM_addStyle(' .down-button	        { width:16px;height:16px;display:block;background-position: -0px -448px; }');
    GM_addStyle(' .down-button:hover	{ background-color:#DFE; }');
    GM_addStyle(' .flup-button	        { width:12px;height:8px;display:block;background-position: -2px -196px; }');
    GM_addStyle(' .flup-button:hover	{ background-color:#DFE; }');
    GM_addStyle(' input,select			{ padding:0px 0px 0px 4px  !important; color:#000; }');  // border:1px solid #ccc !important;
    GM_addStyle(' input:focus, textarea:focus { -moz-box-shadow: 0 0 5px 1px rgba(255,255,255,.5); -webkit-box-shadow: 0 0 5px 1px rgba(255,255,255,.5); box-shadow: 0 0 5px 1px rgba(255,255,255,.5); }');
    GM_addStyle(' .label				{ padding:0px 5px 0px 5px  !important; }');
    GM_addStyle(' #sysparm_search.focus { width:120px !important; font-size:13px !important; background-color:#FFF;}');
    GM_addStyle('.input-group-addon		{ padding:0px !important; }'); // background: rgba(0, 0, 0, 0.1);
    GM_addStyle(' .cantclose            { background-color:#FDD; } ');
    GM_addStyle(' .mytab a				{ text-decoration:none !important;color:#343d47;}');
    GM_addStyle(' .mytab a.mybut_		  { text-decoration:none !important;color:#000;}');
    GM_addStyle(' .mytab a.mybut_:visited { text-decoration:none !important;color:#000;}');
    GM_addStyle(' .mytab a.mybut_:hover   { text-decoration:none !important;color:#000 !important;}');
    GM_addStyle(' .mytab a.mybut		{ text-decoration:none !important;color:#FFF;}');
    GM_addStyle(' .mytab a.mybut:hover	{ text-decoration:none !important;color:#000 !important;}');
    GM_addStyle(' a.redlink 			{ color:red !important;font-weight:bold;' );
    GM_addStyle(' a.redlink:hover		{ background:#DFE; ' );
    GM_addStyle(' .sldshw                     { width:auto; max-height:none; margin:250px auto; } ');   // attachment_dialog_list
    GM_addStyle(' input.u                     { position:absolute; left:-9999px; display:none; } ');
    GM_addStyle(' label.tgggle img            { display:block; max-width:300px;height:auto;-webkit-transition: 0.5s ease-in-out;-moz-transition: 0.5s ease-in-out;-o-transition: 0.5s ease-in-out;transition: 0.5s ease-in-out; } ');
    GM_addStyle(' input.u:checked + label img { display:block;z-index:10;position:fixed;top:300px;left:800px; -webkit-transform:scale(4);-moz-transform:scale(4);-o-transform:scale(4);transform:scale(4); } ');
    GM_addStyle(' img.i                       { border:solid 1px #000; } ');
    GM_addStyle(' SPAN.itsm { background:#00BFFF; } ');
    GM_addStyle(' tr.list_b td	{ background-color: #FFCC99 !important;  }');
    GM_addStyle(' td.red_td		{ color: #F00 !important;  }');
    GM_addStyle(' a.linked   { white-space:nowrap !important;}' );  // disable if you need a bigger screen
    GM_addStyle(' .tplink { padding:5px; margin-right:10px; white-space:pre;} ');
    GM_addStyle(' .faketextarea { -moz-appearance:textfield-multiline;-webkit-appearance:textarea;box-shadow:inset 0px 1px 2px #000;font:medium -moz-fixed;font:-webkit-small-control;overflow:auto;padding:2px;resize:both;width:400px;height:80px;} ');
    GM_addStyle(' .dd  { background-color:#DFD;color:#000;} ');
    GM_addStyle(' .blc { background-color:#DDF;color:#000;} ');
    GM_addStyle(' .jun { background-color:#FDD;color:#000;} ');
    GM_addStyle(' .cis { background-color:#FDF;color:#000;} ');
    GM_addStyle(' .emc { background-color:#DDF;color:#000;} ');
    GM_addStyle(' .i14x { width:14px;height:14px; } ');
    GM_addStyle(' .redtext { color:red !important; border:2px solid red !important; } ');  //.css('border','solid 2px red')
    GM_addStyle(' span.label_description { background-color: #f00; color:#fff;  } ');
    GM_addStyle(' .draggable { background-color:rgba(255, 0, 0, 0.4) !important;} ');
    GM_addStyle(' .vt        { padding:0px; }');  // !important
    GM_addStyle(' .list2_cell_background  { border:1px solid #000; }' );
    GM_addStyle(' .myspc  { display:table-cell;width:2px; }' );
    GM_addStyle(' .myfld  { display:table-cell;width:140px !important;border:1px solid #bbb;padding:0px 5px;border-radius:4px !important;margin:3px !important;white-space:pre;background-color:rgba(240, 240, 240, 1); }' );
    GM_addStyle(' .mylbl  { display:table-cell;width: 65px !important;border:1px solid #bbb;padding:0px 5px;border-radius:4px !important;margin:3px !important;white-space:nowrap; text-align:right;background-color:rgba(255, 255, 255, 1);text-transform:capitalize; }' );
    GM_addStyle(' .myfldc { display:table-cell;    width:80px;border:1px solid #bbb;padding:4px;background-color:#EEE; }' );
    GM_addStyle(' .mylblc { display:table-cell;min-width:40px;border:1px solid #bbb;padding:4px; }' );
    GM_addStyle(' .mytr   { padding:0px;margin:3px;border: 0px solid #00f;  }' );
    GM_addStyle(' .mytbl  { background-color:transparent !important;   }' );
    GM_addStyle(' .vsplit_bottom_margin { border-spacing:0px;border-collapse:collapse; } ');   // squeeze table in case header
    GM_addStyle(' .srch_ib				{ background-color:#ffa64c !important; }');
    GM_addStyle(' .srch_ib:hover		{ color:#fff !important; }');
    GM_addStyle(' .tab_header		{ margin-right:4px !important; }');
    GM_addStyle(' .tab2_tab		{ margin-right:4px !important; }');
    GM_addStyle(' .warnbg  { background-color:#fee6e6; } ');
    GM_addStyle(' div.wrapper	{ border-radius:5px !important; border:solid 1px #cccccc;padding:0px 0px 0px 6px !important;margin:0px 10px 0px 10px;color:#000 !important;font-weight:normal !important; }');
    GM_addStyle(' table.myTable  {     background-color: transparent !important;} ');
    GM_addStyle(' TABLE.drag_section_picker { border-color:transparent !important; }');
    GM_addStyle(' .calMonthNavigation { color:unset;} ');
    GM_addStyle(' table.calTable TD.calText {     background-color: transparent !important; border-color: transparent !important;} ');
    GM_addStyle(' table.calTable TD.calCurrentDate {    color: red;} ');
    GM_addStyle(' table.calTable TD.calText:hover {     background-color: rgba(255, 0, 0, 0.4) !important; color:#000 !important; } ');
    GM_addStyle(' table.calTable TD.calText:hover A {   color:#000 !important; } ');
    GM_addStyle(' div.drag_section_part { background:#fff; } ');
    GM_addStyle(' .outputmsg_div                           { visibility:visible !important; display:inline !important; }');
    GM_addStyle(' .tabs2_tab:hover  { border-color:#ffc926;box-shadow: 5px 5px 10px #ffffbf  } ');
    GM_addStyle(' #mailstuff		{ padding-top:0px;padding-bottom:0px; border:none;}'); // opacity: .6;
    GM_addStyle(' #mailstuff:hover { opacity: 1; }');
    GM_addStyle(' select#mailtype  { background-repeat:no-repeat;background-position:0px;background-color:transparent;outline:none;background-image:url(images/drop_down.gifx);color:transparent !important;width:10px;padding:0px 1px 0px 1px;margin:0px;line-height:0.8;font-size:12px;border:0px; } ');
    GM_addStyle(' .mto				{ background-image:url(images/icons/email.gifx);background-repeat:no-repeat;background-position:1px;color:#000; }');
    GM_addStyle(' .phncl            { margin-right:2px; width:14px; height:14px; }');
    GM_addStyle(' div.pointerhand                { width:100px; }');
    GM_addStyle(' div.navbar-title-display-value { width:100px; }');
    GM_addStyle(' td.red_td.list_edit_selected_cell { background-color: #f00 !important; color:#fff !important; }');
    GM_addStyle(' ul                { margin-left:15px !important; }');
    GM_addStyle(' .my_list_sla_0 { background:rgba(255,255,255,1) !important;color:#000 !important;border-top-left-radius:7px;border-bottom-left-radius:7px; }' );          //  background-color: #F4FFF4       background:rbga(244,255,244,0.9)
    GM_addStyle(' .my_list_sla_1 { background:rgba(224,255,224,1) !important;color:#000 !important; }' );                                                                   //  background-color: #E0FFE0       background:rbga(224,255,224,0.9)
    GM_addStyle(' .my_list_sla_2 { background:rgba(186,255,186,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #BAFFBA       background:rbga(186,255,186,0.9)
    GM_addStyle(' .my_list_sla_3 { background:rgba(144,238,144,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #90EE90       background:rbga(144,238,144,0.9)
    GM_addStyle(' .my_list_sla_4 { background:rgba(240,230,140,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #F0E68C       background:rbga(240,230,140,0.9)
    GM_addStyle(' .my_list_sla_5 { background:rgba(255,255,  0,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );                                                                   //  background-color: #FFFF00       background:rbga(255,255,  0,0.9)
    GM_addStyle(' .my_list_sla_6 { background:rgba(255,208,  4,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );     //  background-color: #FFD004       background:rbga(255,208,  4,0.9)
    GM_addStyle(' .my_list_sla_7 { background:rgba(255,165,  0,1) !important;color:#000; font-weight: bold !important; text-decoration:none !important; }' );     //  background-color: #FFA500       background:rbga(255,165,  0,0.9)
    GM_addStyle(' .my_list_sla_8 { background:rgba(255,  5,  2,1) !important;color:#fff !important; font-weight: bold !important; text-decoration:none !important; border-top-right-radius:7px; border-bottom-right-radius:7px; }' );     //  background-color: #FF0502       background:rbga(255,  5,  2,0.9)
    GM_addStyle(' HTML[data-doctype=true] .section_header_content_no_scroll { overflow-x:auto; } ');
    GM_addStyle(' .i14x14 { width:14px !important; height:14px }');
    GM_addStyle(' .select90 { min-height:90px !important;height:90px !important;width:250px; }');
    GM_addStyle(' .icon::before { margin-left: 0px; }');
    GM_addStyle(' .icon-info::before {  margin-top: -2px;margin-left: 0px !important; }');
    GM_addStyle(' .icon-search::before {  margin-top: 1px;margin-left: 2px !important; }');
    GM_addStyle(' .icon-tree::before {  margin-top: -2px;margin-left: -1px !important; }');
    GM_addStyle(' .icon-info { width: 15px !important; line-height: 14px !important; height: 15px !important; }');
    GM_addStyle(' .icon-locked   { line-height: 10px !important; }'); //margin-top: -2px; margin-left: 3px;
    GM_addStyle(' .icon-unlocked { line-height: 10px !important; }'); //margin-top: -2px; margin-left: 3px;
    GM_addStyle(' HTML[data-doctype=true].compact .btn-ref                           { padding: 0px !important; width: 15px !important; height: 15px !important;}');
    GM_addStyle(' html[data-doctype=true].compact .input-group .input-group-btn .btn { height: 16px !important; width: 16px;line-height: 14px;padding: 0px !important;}');
    GM_addStyle(' HTML[data-doctype=true] .form-field-addons .btn { margin-right: 2px; } ');
    GM_addStyle(' .lblpln { background-color:#aaa;color:#000 !important; }');
    GM_addStyle(' .lbllow { background-color:#FFFFFF ;color:#000 !important; }');
    GM_addStyle(' .lblnor { background-color:#afffb0 !important;color:#000 !important; }');
    GM_addStyle(' .lblhi  { background-color:#ffc8a0 !important;color:#000 !important; }');
    GM_addStyle(' .lblcri { background-color:#f98080 !important;color:#FFF !important; }');
    GM_addStyle(' .sdlabel { width:130px !important;padding:2px 16px 2px 2px !important; }');
    GM_addStyle(' div.form-field-addons a img { width:16px;height 16px; }');
    GM_addStyle(' table.mytbl.aggregate_value { width:unset !important; } ');     // Should fix clobbered  info-table updates under log tab.
    GM_addStyle(' .showconf { font-size: 9px;} ');

    this.$ = this.jQuery = jQuery.noConflict(true);
    $(document).ready( function() {
        timer2 = new Date();


        var oooMSG    	= `?subject=Out Of Office\
Dear Customer,%0A%0A&body=I\'m currently out of the office.%0A%0A\
I will not be able to read my mail until I return to the office on .%0A%0A\
Best%20regards,%0A%0A`;

        var domain, domain2, domain3 ;
        if ( location.hostname.slice(0,5) !== 'didata' ) {
            domain = location.hostname.slice(0,13) + location.hostname.slice(-4);
            domain2 = 'eu.' + location.hostname.slice(0,2) + location.hostname.slice(9,13) + location.hostname.slice(-4);
            domain3 = domain2.replace('com','local');
        } else {
            domain = location.hostname.slice(0,5) + location.hostname.slice(-4);
            domain2 = 'au.' + domain + location.hostname.slice(-4);
            domain3 = domain2.replace('com','local');
        }
        var drgstate = false;
        var alertsend = 0;
        var ok2close   = [ 6,7,9,120,130,220,780 ];
        var scriptversion = GM_info.script.version;
        var instance = location.hostname.slice(13).replace('.service-now.com','');
        if (location.hostname.indexOf('nttlimited') > -1)  instance = location.hostname.slice(10).replace('.service-now.com','');
        var bingodone = '';
        var remarks = '';
        script = script.replace('.do','').replace('/','');
        GM_addStyle(' #label.' + script + '.number  { color:#000000 !important; }');
        GM_addStyle(' #show_map:' + script + '.u_contract_ci::before  { position:relative; top:-4px; left:-5px;tezt:set; }');
        $('#' + script + '\\.comments'  ).attr('style','min-height:150px !important;').css('resize','both').css('height','250px').css('width','100%').removeClass('form-control').focus();
        $('#' + script + '\\.work_notes').attr('style','min-height:150px !important;').css('resize','both').css('height','250px').css('width','100%').removeClass('form-control');


        var aff_contact = { name:"", mail:"", phn:"", mob:"", tmp:"" };
        var req_contact = { name:"", mail:"", phn:"", mob:"", tmp:"" };
        GM_log('#=#=# casenr? [' + unsafeWindow.globalContext['genesys\.client\.data\.Number'] + ']    #sys_displayValue = [' + $('#sys_displayValue').val() + ']    #' + script + '.number = [' + $('#' + script + '\\.number').val() + '] ');
        var siteid = $('#' + script + '\\.location\\.u_site_id').val();
        var SiteLocation = $('#sys_display\\.' + script + '\\.location').val();
        casepriority = $('#sys_readonly\\.' + script + '\\.priority').val();
        var ro       = $('span#sys_readonly\\.' + script + '\\.u_banner').length;
        var wl       = $('#l0 > td:nth-child(3)').text().split(' ')[0];
        var sts = '';
        var problem_msg = '';
        var rma_lijst      = [];
        var tabflash       = new Array(30);
        loggedin    = unsafeWindow.window.g_user.fullName;
        shortassign = loggedin.split(' ')[0].substring(0,2) + loggedin.split(' ')[1].substring(0,2);
        MyFirstName = unsafeWindow.window.g_user.firstName;
        MyLastName  = unsafeWindow.window.g_user.lastName;
        MyUserID    = unsafeWindow.window.g_user.userID;
        Ushortassign = shortassign.toUpperCase();
        affectedname  = unsafeWindow.globalContext['affected.name'];
        requestername = unsafeWindow.globalContext["requester.name"];
        locationname  = unsafeWindow.globalContext["location.name"];
        custnm        = unsafeWindow.globalContext["company.name"];
        if ( unsafeWindow.globalContext["company.name"] ) CustNM = unsafeWindow.globalContext["company.name"];
        Assigneegrp = $('#sys_display\\.'  + script + '\\.assignment_group').val();
        if ( !Assigneegrp ) Assigneegrp = 'EU.BE';
        var country = Assigneegrp.split('.')[1];
        GM_log('# country set to ', country );
        //    var country = globalContext["user.primary.group.name"].split('.')[1];
        usecountry     = ( GM_getValue('usecountry')  === 'off' ) ? ' ' : 'checked' ;
        var Assignee    = '';
        if ( unsafeWindow.g_form.getValue('sys_display.' + script + '.assigned_to') !== undefined ) {
            Assignee = unsafeWindow.g_form.getValue('sys_display.' + script + '.assigned_to');
        }
        if ( CustNM === '' ) CustNM = $('#sys_display\\.original\\.' + script + '\\.company').val();
        if ( $('#' + script + '\\.company_label').css('background-color') === 'rgb(255, 0, 0)') {
            $('#' + script + '\\.company_label').attr('title','VIP customer').addClass('lblcri').attr('data-original-title','VIP customer').css('cursor','text');
        }
        //    GM_log('# csv_url len ' , gdc_csv.length );
        //    gdc_csv = atob(gdc_csv.replace('data:application;base64,',''));
        //    if ( gdc_csv.indexOf(CustNM) > -1 ) {
        //        var mgrstr = gdc_csv.substr( gdc_csv.indexOf(';'+CustNM)-2 , 150).split(/\n/)[0];
        //        GM_log('# csv_url 1 ' , mgrstr ,  $('#' + script + '\\.company_label').attr('title'));
        //        var myarr = mgrstr.split(';');
        //        mgrstr=' | ' + myarr[3] + ' | ';
        //        if (myarr[4].length > 1 ) mgrstr += myarr[4] + ' | ';
        //        if (myarr[5].length > 1 ) mgrstr += myarr[5] + ' | ';
        //        if (myarr[6].length > 1 ) mgrstr += myarr[6] + ' | ';
        //        if (myarr[7].length > 1 ) mgrstr += myarr[7] + ' | ';
        //        if ( $('#' + script + '\\.company_label').attr('title') ) mgrstr = $('#' + script + '\\.company_label').attr('title') + '\n' + mgrstr;
        //        GM_log('# csv_url 2 ' , mgrstr );
        //        if (mgrstr !== '') $('#' + script + '\\.company_label').attr('title',mgrstr).attr('data-original-title',mgrstr).attr('style','background-color:#f9f24f;color:#000 !important');
        //        $('#' + script + '\\.company_label').css('cursor','text');
        //        $('#' + script + '\\.company_label').parent().append('<p style="">'+mgrstr+'</p>');//white-space:pre;float:right;
        //    }else GM_log('# csv_url not found ' ,CustNM );

        if (Assignee === '' ) { Assignee = $('#sys_display\\.' + script + '\\.assigned_to').val(); }
        var mycase = false;
        if ( loggedin === Assignee ) mycase = true; // I'm looking at my own case.

        GM_log('#=#=# Mycase? ' ,loggedin ,Assignee, mycase,  casenr);

        var p = 7;
        sep1 = Array(p + 2).join("=");
        sep2 = Array(p + 2).join("/");
        sep3 = Array(p + 2).join("_");



        var glidetbl='';
        var glidefld='';
        var glidesid='';

        //    Default values for RMA screen
        var client_ref     = '';
        var rma_number     = '<ITSM_EXTREF_RMA + ITSM_EXTREF_THIRDPARTY>';
        var vendor_name    = '<ITSM_CIMODEL_MANUFACT>';
        var serial_number  = '<ITSM_CI_SN>';

        var theview = $('div#' + script + '\\.form_header').find('span.section_view').length;
        if (theview) {
            var viewtxt = $('div#' + script + '\\.form_header').find('span.section_view').text();
            $('div#' + script + '\\.form_header').find('span.section_view').css('padding','5px').css('background-color', '#F00').css('color','#FFF').attr('title','You are using ' + viewtxt + ' which is not default view!!\nClick ' + script + ' - ' + casenr + viewtxt + ' to adjust.');
        }
        if ($('input#' + script + '\\.u_custom_text_3').length > 0 ) {
            if ( $('input#' + script + '\\.u_custom_text_3').val().indexOf(';') > -1 ) {
                info = $('input#' + script + '\\.u_custom_text_3').val().split(';');  // u_custom_text_3 contains: CI product, CI version, CI serial, CI contract, CI vendor
            }
            while (info.lengt < 5) {
                info.push('');
            }
        }

        GM_log('#=#=# Add myinfo_box l0 l1 l2 l3 ');

        GM_log('#=#=#=  globalContext : ', unsafeWindow.globalContext  ) ;
//        GM_log('#=#=#=  g_form : ', unsafeWindow.g_form ) ;
//        GM_log('#=#=#=  NOW : ', unsafeWindow.NOW ) ;
        $('#' + script + '\\.short_description').focus();

        var wlstat = '';
        var cfstat = '';
        var mfstat = '';

        $('div#element\\.' + script + '\\.u_effort').after(`\
<div class="form-group wwrapper itsmplus" title="Update Info-Table fields via SWOW">\
<table class="myTable" style="width:80%;border-collapse:initial;border-spacing:2px;">\
<tr class=mytr><td id="myinfo_box" colspan=11 style="width 100%;white-space: nowrap;display:none;"></td></tr>\
<tr class=mytr><td id="myinfo_box2" colspan=11 style="width 100%;white-space: pre;display:none;"></td></tr>\
<tr id="l0" class=mytr><td class=mylbl>Total workload:</td><td class="myspc">&nbsp;</td><td id="tmwkdfld" class=myfld title="Total workload."></td> <td class="myspc">&nbsp;</td><td class=mylbl> Next contact:</td><td class="myspc">&nbsp;</td><td id="ETAfld" class=myfld title="Date to set new ETA."></td><td class="myspc">&nbsp;</td><td class=mylbl> Breaches - SLA's:</td><td class="myspc">&nbsp;</td><td id=breachfld class=myfld title="SLA's breached/undocumented  SLA's existing/running"></td></tr>\
<tr id="l1" class=mytr title="Update Info-Table fields via SWOW"><td class=mylbl>Status: </td><td class="myspc"></td><td class=myfld></td><td class="myspc">&nbsp;</td><td class=mylbl>Vendor:</td><td class="myspc">&nbsp;</td><td class=myfld></td><td class="myspc">&nbsp;</td><td class=mylbl>Contracts:</td><td class="myspc">&nbsp;</td><td id=contrfld class=myfld></td></tr>\
<tr id="l2" class=mytr title="Update Info-Table fields via SWOW"><td class=mylbl>Product:</td><td class="myspc">&nbsp;</td><td class=myfld></td><td class="myspc">&nbsp;</td><td class=mylbl>Serial:</td><td class="myspc">&nbsp;</td><td class=myfld></td><td class="myspc">&nbsp;</td><td class=mylbl>Version:</td><td class="myspc">&nbsp;</td><td class=myfld></td></tr>\
<tr id="l3" style="display:none;"><td class=mylblc>workload:</td><td class="myspc">&nbsp;</td><td class=myfldc>` + wlstat + `</td><td class="myspc">&nbsp;</td><td class=mylblc>Closure Fields:</td><td class="myspc">&nbsp;</td><td class=myfldc>` + cfstat + `</td><td class="myspc">&nbsp;</td><td class=mylblc>Mandatory Fields:</td><td class="myspc">&nbsp;</td><td class=myfldc>` + mfstat + `</td><td class="myspc">&nbsp;</td><td class=mylblc> &nbsp; </td><td class="myspc">&nbsp;</td><td class=myfldc> &nbsp; </td><td> &nbsp; </td></tr>
<tr id="l4" style="height:0px !important;"></tr>
</table>\
</div>`).parent().parent().css('border-spacing','0px').css('border-collapse','collapse');

        var instcol = '#';
        if (instance === 'services')   instcol = '#e6e8ea';
        if (instance === 'orion')      instcol = '#E9967A';
        if (instance === 'validation') instcol = '#FF8C00';
        if (instance === 'sandbox001')    instcol = '#DDA0DD';  //DDA0DD
        if (instance === 'support001')    instcol = '#278EFC';
        if (instance === 'uat')        instcol = '#FFF44F';
        if (instance === 'hydra')      instcol = '#71E279';
        if (instance === 'training001')   instcol = '#FF8C00';

        $('div.container-fluid:first').css('background-color',instcol);
        $('link[rel="shortcut icon"]'). attr('href', 'https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/images/og-images/favicon.ico');

        GM_addStyle(' #pagetm			{ color:' + instcol + '; }'); // padding-top:9px;
        GM_addStyle(' .ptmhover			{ color:#444 !important;}');

        GM_log('# instance ' , instance );

        GM_log('# saved info' , $('input#' + script + '\\.u_custom_text_3').val() );
        GM_log('# saved info' , info );

        GlideGetPartVendor();
        GlideGetSLAOLAbreach();
        GlideGetWorkload();
        GlideGetCiContracts();
        GlideGetCiSerial();

        GM_log('# hidestuff ', GM_getValue('hidestuff') );
        if ( GM_getValue('hidestuff') ) {

            if ( GM_getValue('hidestuff') === 'on' ) {
                hide_stuff(1);
            } else {
                //            hide_stuff(0);
            }
        }

        //        if($('#selectDiv').is(':visible')){
        var ITSIcase = $("span.tabs2_tab:visible > span.tab_caption_text:contains(Integration messages log)").length;
        GM_log('#=#=# Joris Huysmans  ITSM+ Script feature request ITSI ' , ITSIcase);

        var ITSI_ticketNR = trim($('#element\\.incident\\.comments\\.additional > span > div > div:last > table > tbody > tr.list_odd > td:contains(Itelligence Ticket number)').text().substr(27,10));
        var ITSI_AllDone = 0;
        GM_log('ITSI Itelligence Ticket number :', ITSI_ticketNR );
        //	Itelligence Ticket number: 9001979024



        var Cont1ID = unsafeWindow.globalContext.requester;
        var Cont2ID = unsafeWindow.globalContext.affected;


        GM_log('# topdiv ' , $('div#element\\.' + script + '\\.company').parent().parent().length );
        var topdiv = $('div#element\\.' + script + '\\.company').parent().parent();

        $('a.btn.btn-default').attr('style','height:16px !important;width:16px !important;'); // .addClass('height-15').css('height','16px')
        $('span.required-marker').attr('style','color:red !important; width:10px !important;');
        GM_log('# topdiv ' , topdiv.length );
        var ictr = 0;
        topdiv.find('img').each( function(){
            if ( $(this).attr('data-original-title') ||  $(this).attr('title') ) {
                if ( $(this).parent().css('visibility') === 'hidden' ) { $(this).parent().css('display','none'); }
                $(this).parent().addClass('btn').addClass('btn-default');
                $(this).replaceWith('<div class="itsmicons"  style="width: 16px; height: 16px;  background-image: url(' + $(this).attr('src') + '); background-position: -8px -8px; display:inline-block;" title="' + $(this).attr('data-original-title') + '"></div>');
            }
            ictr++;
        });
        GM_log('# topdiv icons ' , ictr );

        if ( $('#show_map\\:' + script + '\\.cmdb_ci').length > 0 ) {
            $('#show_map\\:' + script + '\\.cmdb_ci').attr('style','padding: 0px 4px 0px 4px !important; display: inline; margin: 0px;');
            $('#' + script + '\\.u_equipment_requirements_unlock > span.icon.icon-locked').css('display','inline-table');
        }
        if ( $('#show_map\\:' + script + '\\.u_contract_ci').length > 0 ) {
            $('#show_map\\:' + script + '\\.u_contract_ci').attr('style','padding: 0px 4px 0px 4px !important; display: inline; margin: 0px;');
            $('#' + script + '\\.u_equipment_requirements_unlock > span.icon.icon-locked').css('display','inline-table');
        }



        if ( prbactp === '' ) {
            swowfind();
            prbactp = prbarea;
        }
        if ( etadt === '' ) {
            if ( prbactp.length > 0 ) {
                var n = new Date();
                var i;
                var mt = 0;
                var TM = '';
                var lines = prbarea.split('\n');
                prbactp = '';
                for (i = 0; i < lines.length; i++) {
                    if ( lines[i].toUpperCase().indexOf('> COMPLETE') < 0 ) {
                        GM_log('# eta detect 0 []', lines[i] );
                        prbactp = prbactp + lines[i] + '\n';
                        if ( lines[i].indexOf('=> ETA ') > -1 ) {
                            var T = lines[i].split('=> ETA')[1].replace(/-/g,'/');
                            if ( T.indexOf( '/' + n.getFullYear() ) == -1 && T.indexOf( '/' + ( n.getFullYear() + 1) ) == -1) { T = T + '/' + n.getFullYear(); }
                            var msec = Date.parse( T );
                            GM_log('# eta detect 1 []', msec,  T  ); // , n.getFullYear()
                            if (mt === 0) {
                                mt = msec;
                                TM = T;
                            } else {
                                if ( msec < mt ) {
                                    mt = msec;
                                    TM = T;
                                }
                            }
                        }
                    }
                }
                if ( TM !== '' ) {
                    TM = TM.replace(/\//g,'-');
                    etadt = TM;
                }
            } else {
                etadt = $('#' + script + '\\.u_custom_date_2').val();
            }
        }

        if ( prbstat === '' && $('input#' + script + '\\.u_custom_text_2').length > 0 ) {
            if ( $('input#' + script + '\\.u_custom_text_2').val() !== '' ) {
                prbstat = $('input#' + script + '\\.u_custom_text_2').val().substr(6);
                if (typeof prbstat === 'undefined') { prbstat = ''; }
                if (prbstat === 'undefined')        { prbstat = ''; }
            }
        }

        //  seems we don't have a custom section tab so no custom fields
        if ( $('input#' + script + '\\.u_custom_text_2').length < 1 ) GlideGetCurrentRecord();

        prbactp = prbactp.replace(/\n$/g, '');

        //	if ( script === '/u_request.do' || script === '/incident.do' || script === '/change_request.do' || script === '/problem.do' || script === '/u_rim_event.do' || script === '/u_service_order.do' || script === '/pm_project.do' ||
        //         script === '/pm_project_task.do' || script === '/u_request_task.do' || script === '/u_incident_task.do' || script === '/change_task.do' ||  script === '/u_problem_task.do' ||         // Tasks
        //         script === '/sc_request.do' ||  script === '/sc_req_item.do' ) {                                                                                       // NTT internal

        var swow = '';
        var sep  = '\n====================\n';
        var Z    = '';
        if      ( script === 'u_request'      ) { Z = ' REQUEST';    }
        else if ( script === 'incident'       ) { Z = ' INCIDENT';   }
        else if ( script === 'pm_project'     ) { Z = ' PM PROJECT'; }
        else if ( script === 'problem'        ) { Z = ' PROBLEM';    }
        else if ( script === 'u_rim_event'    ) { Z = ' EVENT';      }
        else if ( script === 'change_task'    ) { Z = ' CHANGE TASK';   }
        else if ( script === 'u_problem_task' ) { Z = ' PROBLEM TASK';  }
        else if ( script === 'pm_project_task') { Z = ' PROJECT TASK';  }
        else if ( script === 'u_request_task' ) { Z = ' REQUEST TASK';  }
        else if ( script === 'u_incident_task') { Z = ' INCIDENT TASK'; }
        else if ( script === 'u_service_order') { Z = ' SERVICE ORDER'; }
        else                                    { Z = ' CHANGE'; }

        swow = Z + ' DESCRIPTION'  + sep + prbdesc;
        if (prbimpt.length > 0) {
            swow += '\n\n IMPACT'  + sep + prbimpt;
        }
        GM_log('# aach1');
        swow += '\n\n ACTION PLAN' + sep + prbactp;
        GM_log('# aach2');


        $('#lijstframe').on('mousemove', function(e) {
            if ($target) { $target.offset( { top:e.pageY - yoff, left:e.pageX - xoff } ); }
            if ($target) GM_log('#=#= mousemove lijstframe' , $target );
        });

        $('#contact_lijst').on('mousemove', function(e) {
            if ($target) { $target.offset( { top:e.pageY - yoff, left:e.pageX - xoff } ); }
            if ($target) GM_log('#=#= mousemove contact_lijst' , $target );
        });

        //
        // Function definitions
        //







        function GlideGetCurrentRecord() {
            var gr = new GlideRecord(globalContext["task.table_name"]);
            gr.get(unsafeWindow.NOW.sysId);
            GM_log('# GlideGetCurrentRecord:', gr);
            prbstat = gr.u_custom_text_2.substr(6);
            if ( gr.u_custom_text_3.indexOf(';') > -1 ) {
                info = gr.u_custom_text_3.split(';');
            }
            etadt = gr.u_custom_date_2;
        }

        function IsTempContact(sysid) {
            var gr = new GlideRecord('sys_user');
            var contact = { name:"", mail:"", phn:"", mob:"", tmp:"" };
            gr.get(sysid);
            contact.name = gr.name;
            contact.mail = gr.email;
            contact.phn  = gr.phone;
            contact.mob  = gr.mobile_phone;
            contact.tmp  = gr.u_temporary_account;
            return contact;
        }




        function GlideGetSLAOLAbreach() {
            var table    = 'task_sla';
            var color    = 'transparent';
            var maxperc   = 0;
            var timeleft = '';
            var slaname  = '';
            var datediff;
            var gr = new GlideRecord(table);
            gr.addQuery('task',unsafeWindow.NOW.sysId);
            gr.query(showgr);
            function showgr(gr) {
                while ( gr.next() ) {
                    nrsla++;
                    if (gr.stage.toString() === 'in_progress'  ) {
                        nrslarun++;
                        if ( Number( gr.business_percentage.toString() ) > maxperc ) {
                            maxperc  = Number( gr.business_percentage.toString() );
                            timeleft = gr.business_time_left.toString();
                            timeleft = gr.business_time_left;
                            slaname =  gr.u_name.toString();
                            var start = new Date(timeleft);
                            var end   = new Date('1970-01-01 00:00:00');
                            datediff  = (start - end)/1000;  // result in seconds
                        }
                    }
                    if (gr.u_current_stage.toString() === 'breached' || gr.u_escalation.toString() === 'overdue' || Number( gr.business_percentage.toString() ) > 99.99 ) {
                        breach++;
                        if ( gr.u_breach_comments.toString().length === 0 || gr.u_breach_reason_code.toString().length === 0 ) {
                            undoc++;
                        }
                    }
                }

                timeleft = SecToDayHrsMinSec(datediff);
                hold = maxperc;
                if ( hold > 0 &&  timeleft !== '' ) {
                    tml = timeleft + ' SLA:' + slaname.replace(casenr,'');
                    if (hold > 0 ) {tml = hold + '%  Time left is : ' + tml;}
                    var fldclass = 'my_list_sla_0';
                    hold = Number(hold);
                    if ( color === 'transparent' ) {
                        //		        	color = '#00001c';
                        txtc = '#FFFFFF';
                        if ( hold > 10 ) { fldclass = 'my_list_sla_1'; }
                        if ( hold > 25 ) { fldclass = 'my_list_sla_2'; }
                        if ( hold > 35 ) { fldclass = 'my_list_sla_3'; }
                        if ( hold > 50 ) { fldclass = 'my_list_sla_4'; }
                        if ( hold > 75 ) { fldclass = 'my_list_sla_5'; }
                        if ( hold > 83 ) { fldclass = 'my_list_sla_6'; }
                        if ( hold > 90 ) { fldclass = 'my_list_sla_7'; }
                        if ( hold > 95 ) { fldclass = 'my_list_sla_8'; }
                        GM_log('#=#=#=#  starting Aloop 4.1.0.0 ' , color , txtc , fldclass, hold  );
                    } else {
                        txtc = '#000';
                        $('#sys_readonly\\.' + script + '\\.number').css('background-color', color);
                        $('#' + script + '\\.short_description'    ).css('background-color', color);
                        GM_log('#=#=#=#  starting Aloop 4.1.0.1 ' , color , txtc );
                    }
                    $('#sys_readonly\\.' + script + '\\.number').addClass(fldclass); //.attr('style','');
                    $('#' + script + '\\.short_description'    ).addClass(fldclass); //.attr('style','');
                    $('#sys_readonly\\.' + script + '\\.number').attr('title',tml );
                    $('#' + script + '\\.short_description'    ).attr('title',tml);
                }
                UpdateTableFields();
                GM_log('# GlideGetSLAOLAbreach ', breach , undoc );
                GM_log('# GlideGetSLAOLAbreach ', hold, tml );
            }
        }

        function GlideGetWorkload() {
            var workloadtm = 0;
            var workloadtmb = 0;
            var entries = 0;
            var gr1 = new GlideRecord('task_time_worked');
            gr1.addQuery('task',unsafeWindow.NOW.sysId);
            gr1.query(showgr);
            function showgr(gr) {
                while ( gr.next() ) {
                    workloadtm += ( Number(gr.time_in_seconds.toString()) );
                    //                GM_log('# GlideGetWorkload ' , workloadminutes , gr1.u_number, gr1.u_billable, globalContext["contract.name"]    ); //["contract.name"]
                    if ( gr.u_billable.toString() === 'true' && unsafeWindow.globalContext["contract.name"]  === 'Uncovered base') {
                        workloadtmb += ( Number(gr.time_in_seconds.toString()) );
                        gr.u_billable = false;
                        if ( gr.user === unsafeWindow.NOW.user_id ) gr.update();
                        if ( $('sys_display\\.' + script + '\\.u_owner_group:contains("GDC2")').length > 0 )  gr.update();
                        GM_log('# GlideGetWorkload update!! ' , workloadtm , gr.u_number, gr.u_billable    );
                    }
                    entries++;
                    if  ( gr.u_approved !== 'Approve' && unsafeWindow.globalContext["contract.name"] && (unsafeWindow.globalContext["contract.name"].indexOf('MACD') > -1  || unsafeWindow.globalContext["contract.name"].indexOf('MSEN Request Fulfilment')) > -1 ) {
                        gr.u_approved = 'Approve';
                        if (mycase) gr.update();
                        GM_log('# GlideGetWorkload update!! ' , unsafeWindow.globalContext["contract.name"] , gr.u_number, gr.u_approved    );
                    }
                    if ( loggedin === 'Benoit Hauris' ||  loggedin === 'Philippe Smeyers' ) {   // RSO only does admin
                        gr.u_activity_type = 'Administration';
                        gr.u_billable = false;
                        if (  gr.sys_created_by.indexOf('philippe.smeyers') > -1 || gr.sys_created_by.indexOf('benoit.hauris') > -1 ) gr.update();
                    }
                }
                GM_log('# GlideGetWorkload ', workloadtm ,workloadtmb , entries);
                timeworked = SecToDayHrsMinSec(workloadtm);
                timeworkedb = SecToDayHrsMinSec(workloadtmb);
                UpdateTableFields();
            }
        }

        function GlideGetCiSerial() {
            var gr0 = new GlideRecord('cmdb_ci');
            gr0.addQuery('sys_id', unsafeWindow.globalContext.ci );
            gr0.query(GGCSgr);

            function GGCSgr(gr) {
                if ( gr.next() ) {
                    if ( gr.u_license_key ) {
                        info[2] = gr.u_license_key;
                        $('#l2 > td:nth-child(5)').text('License/PAK');
                    }
                    if ( gr.serial_number ) {
                        console.log ('#=#= Serial: ' + gr.serial_number, gr.sys_class_name );
                        if ( info[2] === '' && !CI_is_virt ) {
                            info[2] = gr.serial_number.indexOf('VIRT') > -1 ? '' : gr.serial_number;
                        }
                    }
                    serial_number = info[2];
                    GM_log('# GlideGetCiSerial info ', info  );
                    CI_class  = gr.sys_class_name;
                    CI_status = gr.u_status;
                    GM_log('# GlideGetCiSerial   Class:' + CI_class +'  Status:'+ CI_status +'  Name:'+ gr.u_system_name + ' ' + gr.short_description + '  Category:'+ gr.category + ' (' + gr.subcategory + ')'  , serial_number, gr.u_license_key  ) ;
                    if (CI_class === 'cmdb_ci_spkg' && info[2] !== gr.u_license_key ){
                        var gr0 = new GlideRecord('cmdb_ci_spkg');
                        gr0.addQuery('sys_id', unsafeWindow.globalContext.ci );
                        gr0.query(GGCSgr);
                        return;
                    }
                }
                var cat = '';
                if (gr.category) cat = ' ' + gr.category + ' ';
                if (gr.subcategory) cat = cat + '(' + gr.subcategory +') ';
                if (cat === '') cat = ' ';
                if ( $('#ci-lst').length > 0  ) {
                    $('#ci-lst').append('<a title="Show this ' + CapitalFirst(CI_class.replace('cmdb_ci_','').replace(/_/g,' ')) + ' details" href="/' + CI_class + '.do?sys_id=' + unsafeWindow.globalContext.ci + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a>').show();
                }
                if ( $('#ci-lst0').length > 0  ) {
                    $('#ci-lst0').append('<a title="Show this ' + CapitalFirst(CI_class.replace('cmdb_ci_','').replace(/_/g,' ')) + ' details" href="/' + CI_class + '.do?sys_id=' + unsafeWindow.globalContext.ci + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a>').show();
                }
                $('#ci-lst').show().append('<a id="mysrch" class="btn btn-default btn-ref icon icon-info" title="-= CI search =-"><span class="sr-only"></span></a>');
                $('#ci-lst0').show().append('<a id="mysrch0" class="btn btn-default btn-ref icon icon-info" title="-= CI search =-"><span class="sr-only"></span></a>');
                $('#mysrch').click(CIsearch);
                $('#mysrch0').click(CIsearch);
                GM_addStyle(' a#mysrch::before  { content: "\\f1c7";color:red; margin-left:0px !important; margin-top:-2px;}');
                GM_addStyle(' a#mysrch0::before { content: "\\f1c7";color:red; margin-left:0px !important; margin-top:-2px;}');
                if ( info[2] !== '' ) GlideTestSerial();
                GlideGetCiContracts();
            }
        }


        function SecToDayHrsMinSec(secs) {
            var days    = Math.floor(secs / 86400);
            secs -= days * 86400;                         // calculate (and subtract) whole hours
            var hours   = Math.floor(secs / 3600) % 24;
            secs -= hours * 3600;                         // calculate (and subtract) whole minutes
            var minutes = Math.floor(secs / 60) % 60;
            var seconds = secs - minutes * 60;
            // If we need a 00:00:00 display
            // if (hours   < 10) { hours   = '0' + hours.toString();   }
            // if (minutes < 10) { minutes = '0' + minutes.toString(); }
            // if (seconds < 10) { seconds = '0' + seconds.toString(); }
            var result = '';
            if ( days      > 0 ) { result += days    + ' Days '; }
            if ( hours     > 0 ) { result += hours   + ' Hrs ';  }
            if ( minutes   > 0 ) { result += minutes + ' Min ';  }
            if ( seconds   > 0 ) { result += seconds + ' Sec';   }
            //        if ( result === '' ) { result = '0'; }
            return result;
        }

        function global_showgr(gr) {
            var lst = '';
            var reccntr = 1;
            GM_log('#=#= Glide Record :', gr);

            if (gr.rows.length > 0 ) {
                $('#area1').val( 'Table queried: ' + gr.tableName + '  Fields in rec: ' + gr.rows[0].length + '  Records: ' +  gr.rows.length );
            } else {
                $('#area1').val( 'Table queried: ' + gr.tableName );
            }
            $('#area2').val( 'Ach ach');
            if (gr.rows.length > 0 ) {
                for (var key in gr.conditions) {
                    if (gr.conditions.hasOwnProperty(key)) {
                        var obj = gr.conditions[key];
                        for (var prop in obj) {
                            if (obj.hasOwnProperty(prop)) {
                                console.log ('#=#=  Condition: '+ prop + '   Value: ' + obj[prop] );
                                lst += 'Condition: '+ prop + '   Value: ' + obj[prop] + '\n';
                            }
                        }
                    }
                }
                $('#area1').val( $('#area1').val() + '\n'+ lst);
                lst = '_______________________________________________________\n';
                while (gr.next() ){
                    lst += 'Record ' + reccntr + '\n';
                    for (x = 0; x < gr.rows[reccntr -1].length; x++ ) {
                        console.log ('#=#=  Name: '+ gr.rows[reccntr -1][x].name + '   Value: ' + gr.rows[reccntr -1][x].value , x);
                        $('#area2').val(lst).css('font-family','monospace');
                        if ( gr.rows[reccntr -1][x] ) lst += x + '\t' + 'name: '+ gr.rows[reccntr -1][x].name + ' '.repeat(40 -gr.rows[reccntr -1][x].name.length) + ' val: \t ' + gr.rows[reccntr -1][x].value + '\n';
                    }
                    reccntr++;
                    lst += '_______________________________________________________\n';
                }
                $('#area2').val(lst).css('font-family','monospace');
                lst += '\n';
                lst += '\n';
                if ( gr.rows[0].length > 0 ) {
                    if ( gr.rows[0].length > 11 && gr.rows[0][11].name === 'display_name') {
                        lst += 'CI Model: ' + gr.rows[0][11].name + ' = ' + gr.rows[0][11].value + '\n';
                    }
                    if ( gr.rows[0].length > 57 && gr.rows[0][57].name === 'serial_number') {
                        lst += 'CI Serial: ' + gr.rows[0][57].name + ' = ' + gr.rows[0][57].value + '\n';
                    }
                    if ( gr.rows[0].length > 183 && gr.rows[0][183].name === 'u_status') {
                        lst += 'CI Status: ' + gr.rows[0][183].name + ' = ' + gr.rows[0][183].value + '\n';
                    }
                    if ( gr.rows[0].length > 13 && gr.rows[0][13].name === 'category') {
                        lst += 'Category: ' + gr.rows[0][13].name + ' = ' + gr.rows[0][13].value + '\n';
                    }
                    if ( gr.rows[0].length > 64 && gr.rows[0][64].name === 'sys_class_name') {
                        lst += 'Category: ' + gr.rows[0][64].name + ' = ' + gr.rows[0][64].value + '\n';
                    }
                }
                $('#area2').val(lst);
                if ($('#area2').val() === 'Ach ach') { $('#area2').val( 'Ach ach ach. ' + gr.rows[0].length );}
                if ( gr.tableName === 'cmdb_model' ) {
                    console.log ('#=#=  Vendor + Model: ' + gr.rows[0][11].value );
                    var vendorAndPartnr = gr.rows[0][11].value.split(' ');
                    if ( info[0] === '' ) { info[0] = vendorAndPartnr.slice(-1); }
                    if ( info[4] === '' ) { info[4] = vendorAndPartnr.slice(0,vendorAndPartnr.length -1); }
                }
                if ( gr.tableName === 'cmdb_ci' ) {
                    console.log ('#=#=  Serial: ' + gr.rows[0][57].value );
                    if ( info[2] === '' ) { info[2] =gr.rows[0][57].value; }
                }
            } else {
                $('#area2').val( 'Ach ach ach. no record found ' + gr.rows.length );
            }
        }



        function swowfind() {
            var outp = ['','','','',''];
            var p = 3;
            var Tfound = '0';
            var sd = script.toUpperCase().replace('U_','') + ' DESCRIPTION';
            $('#element\\.' + script + '\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:icontains("' + sd + '"):first').each( function() {
                var obj = $(this);
                if ( obj.text().toUpperCase().indexOf('DESCRIPTION') > -1 && obj.text().indexOf('=======') > -1 ) {
                    Tfound = '1';
                    var idx = 0;
                    var spantxt = obj.html();
                    spantxt = spantxt.replace('<br><br>','<br>');
                    GM_log('#=#=#=# '+ spantxt );
                    var t = spantxt.split('<br>');
                    for ( x = 0; x < t.length; x++ ) {
                        if ( t[x] && t[x].toUpperCase().indexOf(' DESCRIPTION') > -1 && idx < 1  ) { idx = 1 ; x++; }
                        if ( t[x] && t[x].toUpperCase().indexOf(' IMPACT')      > -1 && idx < 2  ) { idx = 2 ; x++; }
                        if ( t[x] && t[x].toUpperCase().indexOf('ACTION PLAN')  > -1 && idx < 3  ) { idx = 3 ; x++; }
                        if ( t[x] ) GM_log('#=#=#=# idx=[' + idx + '] = ' +  t[x].replace(/<\/?[^>]+(>|$)/g, '').replace('&gt;','>') );
                        if ( t[x] && t[x].indexOf('========') == -1 && t[x] && t[x] !== ' ' && t[x].indexOf('> COMPLETE') == -1  &&  t[x].indexOf('> CANCEL') == -1  ) {
                            outp[idx] = outp[idx] + '\n' + t[x].replace(/<\/?[^>]+(>|$)/g, '').replace('&gt;','>');
                        }
                        if ( t[x] && t[x].indexOf('========') == -1 && idx > 2 ) {
                            outp[4] = outp[4] + '\n' + t[x].replace(/<\/?[^>]+(>|$)/g, '').replace('&gt;','>');
                        }
                    }
                }
            });
            prbdesc = outp[1].replace('\n','').trim();
            prbimpt = outp[2].replace('\n','').trim();
            prbarea = outp[3].replace('\n','').trim();
            if ( prbarea === '' ) { prbarea = outp[4].replace('\n','').trim(); }

            $("#prbdesc").val(prbdesc);
            $("#prbimpt").val(prbimpt);
            $("#prbarea").val(prbarea);

            GM_log('#=#=#=# outp[3] = '+ outp[3], outp[4] );

        }

        timer3 = new Date();

        GM_log('#=#=#=#  Waiting.....');

        window.setTimeout(Aloop,50);


        function anyonecancallme2(t){
            myalert('function_at_main_level ' + t);
        }





        function Aloop () {

            timer4 = new Date();


            function GlideGetExternalRef() {
                table = 'u_ext_ref_no';
                var gr = new GlideRecord(table);
                gr.addQuery('u_task',unsafeWindow.NOW.sysId);
                //        gr.query();
                gr.query(showgr);
                function showgr(gr) {
                    var row = 0;
                    while ( gr.next() ) {
                        var referencetype = gr.u_reference_type;  // u_reference_type:  | Service cross reference / Internal | Vendor reference number | Client reference number
                        var sys           = gr.sys_id;
                        var lnk           = gr.u_url;
                        var vdr           = gr.u_description;
                        var srnr          = gr.u_reference_number;
                        var company       = gr.u_company;
                        var rmacreate     = gr.sys_created_on;
                        var sys_domain    = gr.sys_domain;
                        if ( vdr.indexOf('Internal') > -1 ) {
                            vdr = 'int';
                        }
                        if ( vdr.toUpperCase().indexOf('ALCATEL') > -1 ) {
                            vdr = 'AL-LU';
                        }
                        if (  lnk.length > 10 && vdr.length > 1 ) {   // lnk.substr(0,4) === 'http' &&
                            if ( srnr.indexOf('CSC') > -1 ) { vdr = 'BUGID'; }
                            var fupload = '';
                            var tpcasedt = GM_getValue('tpcase_'+srnr , '');
                            var casetit = '';
                            if (tpcasedt !== '') casetit = tpcasedt.split(';')[3];
                            var nwlnk = '<span class="tab_header tptab"><span class="tabs2_tab mytab" tabindex="0"><SPAN sys_id="'+ sys +'" id="cases' + row + '" class="tab_caption_text tpcases" title="' + casetit + '" style="">';
                            if (vdr.toUpperCase() === 'CISCO')    { fupload = ' <a class=mybut href=https://cway.cisco.com/csc/index.html?requestID=' + srnr +' title="Upload files to ' + vdr + '" target="_blank"><b>?</b></a>'; }
                            if (vdr.toUpperCase() === 'INFOBLOX') { fupload = ' <a class=mybut href=https://bloxdrop.infoblox.com title="Upload files to ' + vdr + '" target="_blank">?</a>'; }
                            if (vdr.toUpperCase() === 'EMC')      { fupload = ' <a class=mybut href=https://supportfiles.emc.com/SRAttachments/upload4SR.aspx?Usertype=SRM&SRNum=' + srnr + ' title="Upload files to ' + vdr + '" target="_blank"><b>?</b></a>'; }
                            if (srnr.slice(0,3) === '#=#') {
                                nwlnk = nwlnk + vdr.toLowerCase() + ': <a class="" href="' + lnk + '" target="_blank" title="Closed case." >' + srnr.replace('#=#','') + '</a></SPAN></span></span>';

                            } else {
                                nwlnk = nwlnk + vdr.toUpperCase() + ': <a class="mybut" href="' + lnk + '" target="_blank">' + srnr + '</a>' + fupload + '</SPAN></span></span>';
                            }
                            caselinks =  caselinks + nwlnk;
                        }
                        if ( referencetype === 'Vendor reference number / RMA' ){
                            var TableDatarows = [];
                            if (vdr === '') { vdr = company; }
                            if ( vdr !== '' && srnr !== '' ) {
                                rma_number = srnr;
                                vendor_name = vdr;
                                TableDatarows.push(srnr);
                                TableDatarows.push(vdr);
                                TableDatarows.push(rmacreate);
                                rma_lijst.push(TableDatarows);
                            }
                            if ( lnk.substr(0,4) === 'http' && lnk.length > 10) {
                                rmalinks =  rmalinks + '<SPAN id="cases' + row + '" class="tprma" style="">' + vdr.toUpperCase() + ' RMA: <a class="mybut" href="' + lnk + '" target="_blank">' + srnr + '</a></SPAN><p>';
                            } else {
                                rmalinks =  rmalinks + '<SPAN id="cases' + row + '" class="tprma" style="">' + vdr.toUpperCase() + ' RMA: ' + srnr + '</SPAN><p>';
                            }

                        }
                        if ( referencetype === 'Client reference number' ) {
                            if ( srnr !== '' ) { client_ref = 'Customer Reference: ' + srnr + '\n\n'; }
                        }
                        if (ITSI_ticketNR === srnr) ITSI_AllDone=1;
                        row++;
                    }
                    GM_log('# GlideGetExternalRef ', caselinks, row );
                    if (caselinks) {
                        $(caselinks).insertAfter( $('#tabs2_section > span.closdeti' ) ); // + '<img class="tab_spacer" width="4" height="24" src="images/s.gifx" />'
                        $('span.tabs2_tab.mytab' ).hover(
                            function() { $( this ).addClass(    "tabs2_hover" ); } ,
                            function() { $( this ).removeClass( "tabs2_hover" ); }
                        );
                    }
                    tabs_test('NEW',0);
                    $('span#NEW').addClass('new').next().attr('title','Add new thirdparty case-nr/rma-nr , bug-id or customer reference-nr.');
                    GM_log('#=#=#=# tabs NEW');
                    if (rmalinks) {
                        tabs_test('RMA',2);
                        $('#RMA').next().attr('title','Complete RMA form to notify responsible people of RMA number, new serial number and other details.');
                        $('#RMA.changed').next().attr('title','RMA form is completed and send.');
                    }
                    showActivetab();

                    GM_log('#=#=#=# ITSI case ' , ITSIcase , ITSI_ticketNR , ITSI_AllDone);
                    if (ITSIcase == 1) {
                        if (ITSI_ticketNR.length==10 && ITSI_AllDone == 0 ){  //
                            GM_log('Should add ITSI ticket ', ITSI_ticketNR , $('iframe#externalref').contents().find('body').length , $('iframe#externalref').contents().find('#u_ext_ref_no\\.form_header').length , $('iframe#externalref').contents().find('button.form_action_button').length , $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_number').length );
                            tab_alert('NEW', 'on', 'changed')
                            $('#gr1data').val(ITSI_ticketNR);
                            $('#gr2data').val('');
                            $('#gr3data').val('ITSI Ticket Reference');
                            $('#gr4data').val('Customer reference');
                            $('#ln2').hide();
                            $('#ln3 > td.mylbl').text('Description:');
                            //                    insertExtRef_ITSI_1(sys_domain,ITSI_ticketNR);
                        }
                    }
                }
            }

            //    function insertExtRef_ITSI_1(sys_domain,ITSI_ticketNR) {
            //        table = 'u_ext_ref_no';
            //        var exref = new GlideRecord(table);
            //        exref.initialize();
            //        GM_log('# ITSI insertExtRef ', unsafeWindow.NOW.sysId, sys_domain,ITSI_ticketNR );
            //        gr.addQuery('task',unsafeWindow.NOW.sysId);
            //        exref.u_active             = true;
            //        exref.sys_domain           = sys_domain;
            //        exref.u_task               = unsafeWindow.NOW.sysId;
            //        exref.u_reference_type     = 'Vendor reference number';
            //        exref.u_reference_number   = ITSI_ticketNR;
            //        exref.u_description        = 'ITSI - CaseNumber';
            //        exref.u_external_reference = 'DD-SYSID-'+unsafeWindow.NOW.sysId;
            //        exref.u_url                = 'https://';
            //        exref.insert();
            //        GM_log('# ITSI insertExtRef done. ', exref  );
            //    }
            //
            //
            //    function insertExtRef_ITSI_2() {
            //        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_number').val(ITSI_ticketNR);
            //        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_description'     ).val('ITSI CaseNumber');
            //        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_url'             ).val('https://');
            //        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_type'  ).val('Vendor reference number');
            //        if ( $('iframe#externalref').contents().find('#sysverb_insert_and_stay').length > 0 ) {
            //            $('iframe#externalref').contents().find('#sysverb_insert_and_stay')[0].click();            // normal but if not found  #sysverb_insert_and_stay
            //        }
            //        else {
            //            $('iframe#externalref').contents().find('#sysverb_insert')[0].click();                     // submitContinue or sysverb_insert #sysverb_insert
            //        }
            //        GM_log('#=#=#=# ITSI case ');
            //    }


            function chk4nwcs() {
                if ( GM_getValue('newcase') ) {
                    GM_log('# newcase found' , alertsend);
                    if ( alertsend < 1 ) {
                        $('#grdel').show();
                        nwcase = GM_getValue('newcase').split(',');    // [vendor],[url],[casenr],[ourcase]
                        $('#gr1data').val(nwcase[1]);
                        $('#gr2data').val(nwcase[2]);
                        $('#gr3data').val(nwcase[0]);
                        if (nwcase.length === 4) {
                            if (nwcase[3] === casenr ) {
                                tab_alert('NEW','on', 'changed');
                                GM_log('# newcase alert for ', casenr );
                            }
                        } else {
                            tab_alert('NEW','on', 'changed');
                            GM_log('# newcase alert without casenr');
                        }
                        alertsend = 1;
                        GM_log('# alert send if 0=' + alertsend + '\n' +  GM_getValue('newcase').replace(',','\\n'));
                        $('td.column_head > span:contains(HOPLA)').html('New ' + GM_getValue('newcase').split(',')[0]  + ' Case');
                        $('a#hoplabut').attr('href','/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=' + unsafeWindow.NOW.sysId ).attr('target','_blank').text('Add New TP Case').closest('td').find('div.info_box').css('padding','5px').html('<pre>A new TP case is pending to be added to your SVR/ICM<br> &nbsp; Vendor: ' + GM_getValue('newcase').replace(/,/g,'<br> &nbsp; ') + '<br>Click the \'Add New TP Case\' button, to go to the external reference page!</pre>');
                        $('a#hoplabut').closest('p').append(' &nbsp; <a id=delcase class=mybut>Delete TP Case</a>');
                        $('a#delcase').click( function() {
                            GM_deleteValue('newcase');
                            GM_setValue('casedt', 'January 1, 1970 00:00:00' );
                            tab_alert('NEW CASE','off', 'changed');
                            tab_hide('NEW CASE');
                            tab_click('Comments');
                        });
                        if (typeof chk4nwcstmr !== 'undefined') clearInterval(chk4nwcstmr);
                    }
                }
                if ( GM_getValue('newRMA') ) {
                    GM_log('# newcase found' , alertsend);
                    if ( alertsend < 1 ) {
                        tab_rename('HOPLA','NEW RMA ');
                        tab_alert('NEW RMA','on', 'changed');
                        alertsend = 1;
                        GM_log('# alert send if 0=' + alertsend + '\n' +  GM_getValue('newcase').replace(',','\\n'));
                        $('a#hoplabut').text('Add New TP RMA').closest('td').find('div.info_box').css('padding','5px').html('<pre>A new TP case is pending to be added to your SVR/ICM<br> &nbsp; Vendor: ' + GM_getValue('newcase').replace(/,/g,'<br> &nbsp; ') + '<br>Click the \'Add New TP Case\' button, to go to the external reference page!</pre>');
                        clearInterval(chk4nwcstmr);
                    }
                }

                $('#request_manager_output',unsafeWindow.parent.document).css('display','inline');

            }




            function getHTML(node){
                if(!node || !node.tagName) return '';
                if(node.outerHTML) return node.outerHTML;

                // polyfill:
                var wrapper = unsafeWindow.document.createElement('div');
                wrapper.appendChild(node.cloneNode(true));
                return wrapper.innerHTML;
            }



            function anyonecancallme(t){
                myalert('function_at_Aloop_level ' + t);
            }

            function tab_alert(tab,onoff,clr) {
                var d = 0;
                //		GM_log('#=#=#=# Looking for tab ' , $('#tabs2_section span.tab_caption_text').length );
                for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
                    if ( $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().trim() === tab ) {
                        d = c;
                        //				GM_log('#=#=#=# tab ', tab , d );
                    }

                }
                if ( onoff === 'on') {
                    tabflash[d] = setInterval( function () {
                        $('#tabs2_section span.tab_caption_text:eq(' + d + ')').prev().addClass(clr);
                        $('#tabs2_section span.tab_caption_text:eq(' + d + ')').prev().css('visibility', ( $('#tabs2_section span.tab_caption_text:eq(' + d + ')').prev().css('visibility') === 'visible' ? 'hidden' : 'visible' ) );
                    }, 350 );
                } else {
                    clearInterval( tabflash[d] );
                    $('#tabs2_section span.tab_caption_text:eq(' + d + ')').prev().removeClass(clr);
                    $('#tabs2_section span.tab_caption_text:eq(' + d + ')').prev().css('visibility', 'visible');
                }
            }

            function tab_toggle(tab) {
                for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
                    var tabcap = $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().trim().replace(/\s/g,' ');
                    tab = tab.trim().replace(/\s/g,' ');
                    if ( tabcap === tab ) {
                        //				GM_log('#=#=#=# tab ' + c + ' ['+ tab +'] === [' + tabcap + ']' );
                        $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent().parent().toggle().next().toggle();
                        break;
                    } else {
                        //				GM_log('#=#=#=# tab no match ' + c + ' ['+ tab +'] !== [' + tabcap + ']' );
                    }
                }
                if ( c === $('#tabs2_section span.tab_caption_text').length ) {GM_log('#=#=#=# tab '+ tab +' not found'); }
            }


            function showActivetab() {
                if ( GM_getValue('activetab') ) {
                    tab_cap = GM_getValue('activetab');  // .replace('\\','').replace(/\s+/g,' ').replace(/\*/g,' ').trim();
                    tab_cap = tab_cap.replace('*','').replace('\\','');
                    if ($('span.tab_caption_text:contains(' + tab_cap + ')').length > 0 ){
                        var activetab = $('span.tab_caption_text:contains(' + tab_cap + ')').parent();
                        nicetab(activetab);
                        //                var prevtab = activetab.parent().prev();
                        //                var nexttab = activetab.parent().next();
                        //                activetab.addClass('tabs2_active');
                        //                prevtab.find('.tabs2_tab').addClass('tabs2_activel');
                        //                nexttab.find('.tabs2_tab').addClass('tabs2_activer');
                    }
                    GM_log('#> showActivetab start ' + tab_cap , $('span.tab_caption_text:contains("' + tab_cap + '")').length , $("span.tab_caption_text:contains('" + tab_cap + "')").length);
                    tab_cap = tab_cap.replace(/\s+/g,' ');
                    $('span.tabs2_section').hide();
                    $('span.tabs2_section0').show();
                    var tabfound = 0;
                    $('span.tabs2_section').each( function() {
                        var obj = $(this);
                        if (obj.attr('tab_caption').replace(/\s+/g,' ') === tab_cap ) {
                            GM_log('#=#=# showActivetab show section tbl ['+ tab_cap +']'  );
                            //	    			$( this ).show();
                            obj.show();
                            tabfound = 1;
                            if ( tab_cap === 'NEW' ) $('iframe#externalref').attr('src','/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=' + unsafeWindow.NOW.sysId );
                            if ( tab_cap === 'Attachments' ) Attachments_main();
                            $("iframe#externalref").on("load",  function () { document.title = casenr + ' ' + $('#' + script + '\\.short_description').val(); });

                        }
                    });
                    if (tabfound === 0) {
                        $('span.tabs2_section').hide();
                        $('span.tabs2_section0').show();
                        $('span.tab_caption_text:contains("Comments")').parent().addClass('tabs2_active');
                        $('span.tabs2_section[tab_caption~="Comments"]').show();
                    }
                } else {
                    GM_log('#> showActivetab No GM_getValue(\'activetab\').' );
                }
            }


            function tab_click(tab) {
                var tabcap;
                var c;
                for ( c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
                    tabcap = $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().trim().replace(/\s/g,' ');
                    tab = tab.trim().replace(/\s/g,' ');
                    if ( tabcap === tab ) {
                        //				GM_log('#=#=#=# tab click ' + c + ' ['+ tab +'] === [' + tabcap + '] 01' );
                        $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent()[0].click();
                        break;
                    }
                }
                if ( c < $('#tabs2_section span.tab_caption_text').length ) {GM_log('#=#=#=# tab '+ tab +' not found'); }

                for ( c = 0; c < $('#tabs2_list span.tab_caption_text').length; c++ ) {
                    tabcap = $('#tabs2_list span.tab_caption_text:eq(' + c + ')').text().trim().replace(/\s/g,' ');
                    tab = tab.trim().replace(/\s/g,' ');
                    if ( tabcap === tab ) {
                        //				GM_log('#=#=#=# tab click ' + c + ' ['+ tab +'] === [' + tabcap + '] 1' );
                        $('#tabs2_list    span.tab_caption_text:eq(' + c + ')').parent()[0].click();
                        break;
                    }
                }
                if ( c < $('#tabs2_list span.tab_caption_text').length ) {GM_log('#=#=#=# tab '+ tab +' not found'); }

            }

            function tab_rename(tab,tabnew) {

                for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
                    if ( $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().trim() === tab ) {
                        GM_log('#=#=#=# tab ', tab , c );
                        $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text(tabnew);
                        $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent().parent().show().next().show();
                    }

                }
            }

            function hideattachements2() {
                if (hidelist.length === 0) { hidelist = [];}
                GM_log("#=#hidelist add  " + typeof  hidelist  );
                var t = document.getElementById("deleted_sys_ids").value;
                var p = t.split(";");
                t = t.replace(/;/g,"\n");
                for (i = 0; i < p.length ; i++) {
                    if ( hidelist.indexOf(p[i]) == -1 ) {
                        GM_log("#=#hidelist add  " + i + " " + p[i]   );
                        hidelist.push(p[i]);
                        if ( $('#sys_id_' + p[i]).length > 0 ) { $('input#sys_id_' + p[i]).parent().parent().hide(); }
                    }
                }
                GM_setValue('hidelist'+casenr,hidelist.join(','));
                $('#selall').scrollIntoView( { block: "end", behavior: "smooth"} );
                return false;
            }


            function bingo() {
                var dmn  = '@' + domain;
                var dmn1 = '@' + domain2;
                if ( bingodone === '' ) {
                    var att_total = $('a#header_attachment_list_label').find('span').text(); // #attachmentNumber_f37d3f7b6f3eaa0009d151dc5d3ee4b3
                    GM_log('#=#bingo 2 ', $('table#window\\.attachment.drag_section_picker').length );
                    $('div.modal-backdrop.in.stacked').css('z-index', '1');
                    $('.drag_section_movearea').addClass('draghandle');
                    $('div#attachment').css('width','auto').css('max-height','none').css('padding','0px').css('margin','0px').css('background-color','transparent').addClass('mypopup'); //.css('left','1px').css('top','1px')
                    $('div#current_attachments').addClass('sldshw').css('display','inline').css('width','auto').css('min-height','500px').css('max-height','none').find('div').css('height','100%');
                    $('table#window\\.attachment.drag_section_picker').css('border-radius','7px').css('min-width','800px').css('width','100%').css('max-height','none').css('border','solid 1px #0f0'); //.css('background-color','#888');
                    $('div#attachment_dialog_list').css('max-height','none').css('min-height','500px');
                    $('#attachment_table_body').parent().css('border','solid 0px #bbf'); //.css('background-color','#888');
                    $('span#body_attachment > rendered_body:nth-child(1) > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > div:nth-child(2)').append('<span><p> &nbsp; &nbsp; &nbsp;<input type=checkbox id=selall /> Select/Togle all attachments &nbsp; &nbsp; &nbsp; <input type=checkbox id=selallimg /> Select/Togle all image attachments</span> &nbsp; &nbsp; &nbsp; Hidden attachements: <span class="itsmplus"><span id=hidelistrm title="Click to unhide all" >' + (hidelist.length - 1) + '</span> &nbsp; </span>&nbsp;  of ' + att_total + ' <span style="float:right;"><input id="hideButton2" type="submit" value="Hide "></input> &nbsp; &nbsp; <input id="removeButton2" type="submit" value=" Remove "></input></span>');
                    var i = 1;
                    while ( $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(1) > input:nth-child(1) ').length > 0 ) {
                        var link1 = $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(1) > a:nth-child(2) ');
                        var link2 = $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(1) > a:nth-child(3) ');
                        var tit  = link1.attr('title');
                        var href = link1.attr('href');
                        var naam = link2.text();
                        var q ='';
                        if ( link2.text() ) { GM_log('#=#bingo 2 ------  ', naam , tit , href  ); }
                        if ( hidelist.indexOf(href) == -1 ) {
                            if ( link2.text() ) { 	q = naam; }
                            GM_log('#=#bingo loop ', tit, href, q );
                            if ( q.indexOf('image') > -1 ) {
                                $('tbody#attachment_table_body > tr:nth-child(' + i + ')').addClass('chgnhover').find('td').removeAttr('width').before('<td id="ff1' + i + '" width=40></td><td id="ff2' + i + '" width=40></td>').after('<td align="left"> &nbsp; <input class="u" type="checkbox" id="image' + i + '" /> &nbsp; <label for="image' + i + '" class="tgggle"><img class="i" src="/sys_attachment.do?sys_id=' + href + '"></img></label></td><td> &nbsp;  &nbsp;  &nbsp; </td>'); //.attr('width','500px') .css('width','200px') .attr('colspan','1')
                            } else {
                                $('tbody#attachment_table_body > tr:nth-child(' + i + ')').addClass('chgnhover').find('td').removeAttr('width').before('<td id="ff1' + i + '" width=40></td><td id="ff2' + i + '" width=40></td>').after('<td align="left"> &nbsp; <a href="/sys_attachment.do?sys_id=' + href + '"><img src="' + link1.find('img').attr('src') + '"></img></a></td><td> &nbsp; </td>');
                            }
                            $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(3) > input:nth-child(1)').clone(true, true).appendTo('td#ff1' + i).attr('title','Select attachment');
                            $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(3) > input:nth-child(1)').remove();
                            $('td#ff1' + i).click( function(event) {
                                GM_log('#=#=# clicked ' , hop(event.target) );
                                if (event.target.tagName !== 'INPUT' ) { $(this).find('input')[0].click(); }
                                if (event.stopPropagation){ event.stopPropagation(); }else{ event.cancelBubble=true; }
                            });
                            var ttlle = $('tbody#attachment_table_body > tr:nth-child(' + i + ') > td:nth-child(3) > a:nth-child(2)').attr('title').replace('Attached by ','').replace(dmn,'').replace(dmn,'').replace('.',' ') + ' &nbsp; ';
                            $('td#ff1' + i).attr('title','Select attachment').attr('align','center');
                            $('td#ff2' + i).attr('title','Attached by').attr('align','right').html(ttlle);
                        } else {
                            $('tbody#attachment_table_body > tr:nth-child(' + i + ')').css('display','none').find('td').attr('style','').attr('colspan','1');
                        }
                        i++;
                    }
                    $('#removeButton').before('<input id="hideButton" type="submit" value="Hide "></input> &nbsp; &nbsp; ').removeClass('button').removeAttr('style').removeAttr('width').addClass('mybut');  // </script>  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; <span style="display:inline; float:right; right:100px;text-align:right;"></span>
                    $('#attachButton').addClass('mybut');

                    $('#hidelistrm').css('cursor','pointer').click( function() {
                        hidelist = [];
                        document.getElementById("deleted_sys_ids").value = '';
                        GM_deleteValue('hidelist'+casenr);
                    });


                    GM_log('#=#=#=#  Assigneegrp ', Assigneegrp );
                    if ( Assigneegrp.indexOf('EU.BE.RSO.SD') < 0 )  {
                        $('#removeButton').attr('title','You can only remove your own attachments, you can hide all');
                        $('#removeButton2').attr('title','You can only remove your own attachments, you can hide all');
                    }
                    $('#hideButton'  ).addClass('mybut').click(hideattachements2);   //
                    $('#hideButton2' ).addClass('mybut').click(hideattachements2);   //
                    $('#removeButton2').removeClass('button').addClass('mybut').click(function() { $('#removeButton')[0].click(); });
                    $('#attachmentTable').css('width','400px');
                    $('#selall').click( function() {
                        var checkBoxes = $('input[id^="sys_id_"]');
                        checkBoxes.prop("checked", !checkBoxes.prop("checked"));
                        checkBoxes.each( function(){
                            delattachment( $(this).attr('id').replace('sys_id_','') );
                        });
                    });
                    $('#selallimg').click( function() {
                        $('tr.chgnhover').each( function(){
                            GM_log('# ', $(this).find('td:nth-child(3) > a:nth-child(2) > img:nth-child(1)').attr('src') );
                            t = $(this).find('td:nth-child(3) > a:nth-child(2) > img:nth-child(1)').attr('src');
                            if ( t.indexOf('_imag') > -1 ) {
                                $(this).find('td:nth-child(1) > input:nth-child(1)').prop("checked", !$(this).find('td:nth-child(1) > input:nth-child(1)').prop("checked") );
                                delattachment( $(this).find('td:nth-child(1) > input:nth-child(1)').attr('id').replace('sys_id_','') );
                            }
                        });
                    });
                    bingodone = 'done';
                }

                $('#attachmentTable > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > input:nth-child(1)').parent().append('<a onclick="addRowToTable()" title="Add Another Attachment"><img src="images/and.pngx"></img></a>');
                $('#attachmentTable > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > input:nth-child(1)').remove();
            }



            function delattachment(id) {
                //    	GM_log("#=delattachment# " + id   );
                var t = document.getElementById("deleted_sys_ids").value.split(";");
                if ( t.indexOf(id) == -1 ) { t.push(id); } else { t.splice(t.indexOf(id),1); }
                document.getElementById("deleted_sys_ids").value = t.join(";");
                //    	GM_log("#=delattachment# " + id  + "  " + t.join(";")   );
            }

            function attachments() {
                if ($("#attachmantlist").length > 0) {
                    $("#attachmantlist").css('top','100px').css('left','100px').fadeIn(500);
                }
                else {
                    var imgtype = ['jpg','png','gif','bmp' ];
                    var img ;
                    var entries =  $('ul#header_attachment_list').find('li.attachment_list_items').length;
                    var tbl ='';
                    for (i = 1; i <= entries ; i++) {
                        var obj = $('ul#header_attachment_list > li.attachment_list_items:nth-child(' + (i + 2) + ') > span:nth-child(1) > a:nth-child(1) ');
                        tbl +=  '<tr><td> &nbsp; &nbsp; ';

                        if ( typeof obj.find('img').attr('src') !== 'undefined' ) {
                            tbl +=  '<img src="' + obj.find('img').attr('src') + '" class="16x16"></img>';
                        } else { tbl += '.'; }
                        if ( typeof obj.attr('title') !== 'undefined' ) {
                            tbl +=  obj.attr('title').split('on ')[1] + ' &nbsp; ' ;
                        } else { tbl += '.'; }

                        tbl +=  '</td><td>';
                        var t;
                        if ( typeof obj.next().text() !== 'undefined' ) {
                            t = obj.next().text();
                            img = '';
                            p = t.split('.');
                            img = p[p.length - 1];
                        } else { t= '.'; }

                        if ( typeof obj.attr('href') !== 'undefined' )  {
                            href = obj.attr('href').split('=')[1];

                            tbl +=  '<input type="checkbox" class="attachdel" id="sys_id_' + href + '" name="sys_id_' + href + '"> ' + t + '</td><td>';
                            if ( imgtype.indexOf( img ) > -1 )
                            {
                                tbl +=  '<a href="/sys_attachment.do?sys_id=' + href + '"><img src="/sys_attachment.do?sys_id=' + href + '" style="width:50px;height:auto;"></img></a>';
                            } else {
                                tbl += '<a href="/sys_attachment.do?sys_id=' + href + '"><img src="' + obj.find('img').attr('src') + '"></img></a>' ;
                            }
                        } else { tbl += '</td><td>.'; }

                        tbl +=  '&nbsp; &nbsp; </td></tr>';
                    }

                    $("body").append(`<div id="attachmentlist" style="top:100px;left:100px;background-color:#ccc;border: solid 3px #ccc;border-radius:7px;" >  \
<form target="upload_target" onsubmit="return unsafeWindow.startRemoveAttachments()" method="post" action="sys_attachment.do?DELETE" > \
<table id="hop" border=0 width="100%" style="background-color:#ccc;"> \
<tr><td class="drghdl1" colspan="3" align="right" class="draghandle"><a "><img src="images/help.gifx" style="float:right;"/></a></td></tr> \
<tr><td> Date&nbsp; </td><td> Name&nbsp; </td><td> Content&nbsp; </td></tr> \
' + tbl + ' \
<tr><td colspan=3><a id="closeatt" value="Close">Close</a>\
<input id="deleted_sys_ids" type="hidden" value="" name="deleted_sys_ids"></input> &nbsp; &nbsp; &nbsp; \
<input id="removeButton" type="submit" value="Remove" title="Remove"></input>\
<input name="sysparm_nostack" type="hidden" value="yes"></input>\
<input id="sysparm_this_url" type="hidden" value="" name="sysparm_this_url"></input> \
</td></tr> \
</table></form> \
</div><script>\
</script>\
`);
                    $("#attachmantlist").css('position','absolute').css('visibility','visible').udraggable({ handle: '.drghdl1' });
                    $("#closeatt").addClass('mybut').click(closeatt);
                    $("#removeButton").addClass('mybut');
                    $('.attachdel').click(delattachment(this.id));

                }
            }

            function closeatt() {
                $("#attachmantlist").css('top','100px').css('left','100px').fadeOut(500);
                $("#attachmantlist").remove();
            }


            function findcol (id, str) {
                GM_log('##=# findcol ' , id, str);
                id = id.replace(/\./g,'\\.');
                if ( $('#' + id).length === 0 ) return -1;
                var bg = 3; //  start with column 3
                //if ( $('#' + id +' >  thead:nth-child(1) >  tr:nth-child(1) > th:nth-child(' + bg + ')').attr('class').indexOf('list-decoration-table') > -1 ) { bg++;}
                var limit = $('#' + id +' >  thead:nth-child(1) >  tr:nth-child(1) > th').length;
                //			GM_log('#=#=#=#  findcol columns ', limit , bg);
                for (row=bg; row <= limit;row++) {
                    if ( $('#' + id +' >  thead:nth-child(1) >  tr:nth-child(1) > th:nth-child(' + row + ')').attr('glide_field').indexOf(str) > -1 ) {
                        GM_log('#=#=#=#  findcol row ', str, row );
                        return row;
                    }
                }
                GM_log('#=#=#=#  findcol row ' + str + ' not found ' );
                return -1;
            }

            function FirstLUcase(str) { return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }	            // word to lcase first letter upper-case e.g.   Michel

            function managecclist(e){
                GM_log('# New managecclist called!');
                var dmn  =  domain;
                var dmn1 =  domain2;
                var list   = '';
                var list1  = '';
                var list2  = '';
                if (typeof unsafeWindow.globalContext['requester\.contact\.details'] !== "undefined" ) {
                    detailsArr = unsafeWindow.globalContext['requester\.contact\.details'].split(',') || [];                                                            //  Pull array from globalContext
                    if (detailsArr.length > 5 ) {
                        list  = '<option>' + detailsArr[6].toString().toLowerCase() + '</option>\n';                                                                    //  Get requester email
                    }
                }
                if (typeof unsafeWindow.globalContext['affected\.user\.contact\.details'] !== "undefined" ) {
                    detailsArr = unsafeWindow.globalContext['affected\.user\.contact\.details'].split(',') || [];                                                       //  Pull array from globalContext
                    if (detailsArr.length > 5 ) {
                        if ( list.indexOf( detailsArr[6].toString().toLowerCase() ) < 0 ) { list = list + '<option>' + detailsArr[6].toString().toLowerCase() + '</option>\n'; }   //  Get affected user email if not the same as requester
                    }
                }
                var x, y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                }
                x = x - 650;
                y = 35;
                cclist = GM_getValue('cclist'+casenr,'').toLowerCase();
                tolist = GM_getValue('tolist'+casenr,'').toLowerCase();
                var recep  = GM_getValue('recep'+casenr,'');
                var it;
                if ($('#activity-stream-unordered-list-entries').length > 0 ) {
                    it = $('#activity-stream-unordered-list-entries').html();   // Table with all comments
                } else {
                    it = $('#sn_form_inline_stream_entries').html();
                }
                it = it.toLowerCase().replace(/ /g,'\n').replace(/=/g,'\n').replace(/;/g,'\n').replace(/"/g,'\n').replace(/\>/g,'\n').replace(/</g,'\n').replace(/\&/g,'\n').replace(/\(/g,'').replace(/\)/g,'');
                it = it.replace(/<br\>/g,'\n');
                var lines = it.split('\n');

                for ( var i = 0; i < lines.length; i++) {
                    if ( lines[i].indexOf('@') > 0 ) {
                        var t = lines[i].toLowerCase().replace(/'/g,"").replace('mailto:','').replace(']','').replace('[','').replace("cc:","").replace("subject:","").replace(/ /g,"").replace(/,/g,"");
                        if ( t.indexOf('cid:image') < 0 && t.indexOf('xmpp:') < 0 && t.indexOf('sip:') < 0 && t.indexOf('.') > 0 ) {
                            if ( list.indexOf(t) < 0 && t.indexOf(dmn) < 0 && t.indexOf(dmn1) < 0 ) {
                                var addstyl = ' ';
                                if (t.indexOf('bluecoat.com') > -1 ) { addstyl = 'class="blc"'; }
                                if (t.indexOf('juniper.net')  > -1 ) { addstyl = 'class="jun"'; }
                                if (t.indexOf('cisco.com')    > -1 ) { addstyl = 'class="cis"'; }
                                if (t.indexOf('emc.com')      > -1 ) { addstyl = 'class="emc"'; }
                                if ( list.indexOf(t) < 0 && list1.indexOf(t) < 0 && list2.indexOf(t) < 0 && t.indexOf('/') == -1 && t.indexOf(':') == -1 && t.indexOf('\\') == -1 && t.indexOf('#') == -1 ) {
                                    GM_log('#=#= cc ' , list , t);
                                    list = list + '<option' + addstyl + '>' + t + '</option>\n';
                                }
                            }
                            if ( list2.indexOf(t) < 0 && t.indexOf('data.com') > -1 ) {
                                //					GM_log('#=#= cc ' , list , t);
                                list2 = list2 + '<option class="dd">' + t + '</option>\n';
                            }
                        }
                    }
                }
                list =  list + '<option disabled>--------------------</option>\n' + list2;
                list2  = ' ';

                lines = tolist.replace(/;/g,',').split(',');
                for (i = 0; i < lines.length; i++) {
                    if ( lines[i].indexOf('@') > 0 ) {
                        list1 = list1 + '<option>' + lines[i] + '</option>';
                    }
                }
                lines = cclist.replace(/;/g,',').split(',');
                for (i = 0; i < lines.length; i++) {
                    if ( lines[i].indexOf('@') > 0 ) {
                        list2 = list2 + '<option>' + lines[i] + '</option>';
                    }
                }
                if ($("#newwccwindow").length > 0) {
                    $("#newwccwindow").css('top', y + 'px').css('left', x + 'px').fadeIn(500);
                    //			$('#newemail').focus();
                    GM_log('show cc');
                } else {
                    GM_addStyle(".bloc {display:inline-block;vertical-align:top;overflow:hidden;}");
                    GM_addStyle(".bloc select {height:90px;width:180px;padding:1px;margin:-0px -15px -0px -0px;}");
                    GM_log('create cc');
                    $("body").append(`<div id="newwccwindow" style="padding-top:0px;" class="mypopup">  \
<form><table id="hopcc" border=0 padding="0"  class="drghdl1" style="background-color:transparent;" > \
<tr><td colspan="4" id="ccdrag" class="draghandle"><a style="float:right;"><span id="ccCloseDlgBtn" class="sprite1 close-button"></span></a></td></tr> \
<tr><th> &nbsp; Emails</th><th>&nbsp;</th><th> &nbsp; To:</th><th> &nbsp; CC:</th></tr>\
<tr  title="Select one or more addresses and click the buttons to move them"> \
<td valign=top><label class="bloc"><select id="emailList" class="box-sizingBorder" multiple="multiple" size="5">` +  list + `</select></label></td> \
<td align="center"> &nbsp; <button id=toclick class="mybut" style="border: 1px solid #FFF;"> &nbsp; &gt;&gt; TO: &nbsp; </button><br> \
<br>                &nbsp; <button id=ccclick class="mybut" style="border: 1px solid #FFF;"> &nbsp; &gt;&gt; CC: &nbsp; </button></td> \
<td valign=top><label class="bloc"><select id="toList" class="box-sizingBorder" multiple="multiple" size="5">` +  list1 + `</select></label></td> \
<td valign=top><label class="bloc"><select id="ccList" class="box-sizingBorder" multiple="multiple" size="5">` +  list2 + `</select></label></td></tr>\
<tr><td><input id="newemail" size="21" name="newemail" title="Add one or more emails separated by , or ;" value=""></input></td><td align="center"> <button id="addemail" style="border: 1px solid #FFF;" onclick="return false;"> &nbsp; ^Add &nbsp; </button> </td> \
<td> <button id=rem1 class="mybut" style="border: 1px solid #FFF;"> &nbsp; Remove &nbsp; </button> </td> \
<td> <button id=rem2 class="mybut" style="border: 1px solid #FFF;"> &nbsp; Remove &nbsp; </button> </td> </tr> \
<tr><td style="height:35px"> &nbsp; <A id="ccsave" > &nbsp; Save &nbsp; </A></td><td> &nbsp;</td> \
<td colspan="2"> &nbsp; Email Contact Name: &nbsp; <input id="contnm" title="Name of the contact to be used in mail, if different from Requester" value="` + recep + `"></td> \
</tr></table></form> \
</div>`);
                    //			$('#emails').val();
                    $('#ccclick').click( function() {
                        let $opt = $('#emailList option:selected');
                        $opt.appendTo('#ccList');
                        GM_log("#=#= move to CC", emailList.length, emailList  );
                        return false;
                    });
                    $('#toclick').click( function() {
                        let $opt = $('#emailList option:selected');
                        $opt.appendTo('#toList');
                        GM_log("#=#= move to TO", emailList  );
                        return false;
                    });
                    $('#rem1').click( function() {
                        let $opt = $('#toList option:selected');
                        $opt.appendTo('#emailList');
                        GM_log("#=#= move To to list", emailList  );
                        return false;
                    });
                    $('#rem2').click( function() {
                        let $opt = $('#ccList option:selected');
                        $opt.appendTo('#emailList');
                        GM_log("#=#= move CC to list", emailList  );
                        return false;
                    });
                    $('#mybut').attr('style', $('mybut').attr('style') + 'border:1px solid #FFF !important');
                    $("#ccsave").click(save_cc).addClass('mybut');
                    $("#addemail").click(add_email).addClass('mybut');
                    $("#newwccwindow").css('visibility','visible').css('position','absolute').css('top',y + 'px').css('left',x +'px'); //.udraggable({ handle: '.drghdl1' }); .css('position','absolute')
                    $('#ccdrag').on('mousedown', function(e) {
                        GM_log('#=#= drag' , $(e.target).closest('div').attr('id') ,   $(e.target).attr('id') );
                        if ( $(e.target).attr('id') === 'ccCloseDlgBtn') {
                            GM_log('# hide cc 1');
                            $("#newwccwindow").fadeOut(1000);
                        } else {
                            if(e.offsetX===undefined){
                                xoff = e.pageX-$(this).offset().left;
                                yoff = e.pageY-$(this).offset().top;
                            } else {
                                xoff = e.offsetX;
                                yoff = e.offsetY;
                            }
                            $(this).addClass('draggable');
                            $('body').addClass('noselect');
                            $target = $(e.target).closest('div');
                        }
                    });

                }

                function addOption(theSel, theText, theValue) {
                    var newOpt = new Option(theText, theValue);
                    var selLength = theSel.length;
                    theSel.options[selLength] = newOpt;
                }

                function deleteOption(theSel, theIndex) {
                    var selLength = theSel.length;
                    if(selLength > 0) theSel.options[theIndex] = null;
                }

            }

            function add_email(){
                GM_log('add_email');
                var nm=$("#newemail").val();
                nm = nm.replace(/,/g,';');
                var nma = nm.split(';');
                GM_log('add_email ' + nm);
                $.each(nma , function(index, value){
                    $("#emailList").append($("<option>",{ value: value, text: value} ));
                    GM_log('add_email ' + index + ':' + value);
                });
                $("#newemail").val('');
                return false;
            }

            function close_cc(){
                GM_log('# hide cc');
                $("#newwccwindow").fadeOut(1000);
            }


            function save_cc(){
                tolist = '';
                $("#toList option").each(function() {
                    tolist = tolist + $(this).val() + ';';
                });
                GM_log('#save tolist' , tolist);
                GM_setValue('tolist'+casenr,tolist);
                cclist = '';
                $("#ccList option").each(function() {
                    cclist = cclist + $(this).val() + ';';
                });
                GM_log('#save cclist' , cclist);
                GM_setValue('cclist'+casenr,cclist);
                GM_log('#save cc0');
                var recep  = '';                                                                                 //  so we add blanks '' for the required fields
                recep  = $("#contnm").val().trim();
                if (unsafeWindow.globalContext['requester\.contact\.details']) {                                 //  In case of no requester or affected contact we still must be able to do something
                    detailsArr = unsafeWindow.globalContext['requester\.contact\.details'].split(',');           //  Pull array from globalContext
                }
                if (recep === '') {
                    GM_log('#save cc1');
                    recep  = detailsArr[6].toString();                                                           //  Get requester email
                    custfn = detailsArr[0].toString().trim();
                    custln = detailsArr[1].toString().trim();
                } else {
                    GM_setValue('recep'+casenr,recep);
                    custfn = recep.split(' ')[0];
                    custln = recep.split(' ').slice(1).toString();
                    if (detailsArr[6]) {
                        recep  = detailsArr[6].toString();                                                           //  Get requester email
                    } else { recep = '';}
                }
                GM_log('#save cc2');
                MyDear = MyDear.replace('{fn}',custfn).replace('{ln}',custln);
                cclist = cclist.replace('didatabosprod@service-now.com','').replace(/ /g,';').replace(/;;/g,';');
                tolist = tolist.replace(recep,'').replace(/ /g,';').replace(/;;/g,';');
                if (cclist !== '') {cclist = ';'+cclist;}
                tosub =  'mailto://' + recep + ';' + tolist +'?subject=RE: ' + casenr + ' - ' + encodeURIComponent($('#' + script + '\\.short_description').attr('value') );            //  Put the requester email address, [6] in array, in mailto:// and (SVR nr + short description) in subject
                mcc = '&CC=NTT Limited Services <didatabosprod@service-now.com>'+ cclist;
                mlt = tosub + '&body=' + MyDear + MyMGSbody + '%0A%0D' + caseref + tosub + mcc;
                GM_setValue('curlist', mlt + '&FROM=' + myemail );
                GM_log('#save cc3');
                //        $('#n_email').attr('href', mlt);  //  Adjust the link

                $("#newwccwindow").fadeOut(1000); //.udraggable( 'destroy');;
                GM_log('#save cc4');
                return false;
            }

            function write_swow() {
                GM_log('#save swow update' );
                var Y, X, W, C = ' ' ;
                var P = [];
                var prbdesc   = $("#prbdesc").val();
                var prbimpt   = $("#prbimpt").val();
                if (prbimpt === '' && Z.indexOf('INCIDENT') > -1) prbimpt = '[not yet defined]';
                var prbarea   = $("#prbarea").val();
                var cnm = custfn + ' ' + custln;
                prbarea = prbarea.replace('customer ', cnm + ' ').replace('cust ', cnm + ' ').replace('client ', 'client(' + cnm + ') ').replace('CST ', 'CST(' + cnm + ') ').replace('CUCO ', ' ' + cnm + '(' + CustNM + ') ');
                prbarea = replacer(prbarea);
                GM_setValue('prbdesc'+casenr,prbdesc);
                GM_setValue('prbimpt'+casenr,prbimpt);
                var st = ($('input[name=st]:radio:checked').length > 0) ? $('input[name=st]:radio:checked').val() : '';
                if ( st === 'Other' &&  $('#othertxt').val().length > 0) { st += ' ' + $('#othertxt').val(); }
                $('input#' + script + '\\.u_custom_text_2').val( shortassign  + ' - ' + st );
                $('input#' + script + '\\.u_custom_text_3').val($('#ciProd').val()  + ';' + $('#ciVer').val()  + ';' + $('#ciSer').val() + ';' + $('#ciContr').val() + ';' + $('#ciVen').val() );
                GM_setValue('prbstat'+casenr,st);
                $('#l1 > td:nth-child(3) ').text(st);                   // Status
                C   = Z + ' DESCRIPTION' + sep + prbdesc;
                if (prbimpt.length > 0) { C = C +'\n\n IMPACT' + sep + prbimpt; }
                C = C + '\n\n ACTION PLAN' + sep + prbarea ;
                swow = C;
                var ITSInoHTML = GM_getValue('ITSInoHTML','off');       // default to HTML update
                GM_log('#=#=# extra test ITSInoHTML case ', ITSInoHTML );
                if ( !ITSIcase || ITSInoHTML !== 'on') {            // so if  ITSIcase == 0  no integration tab found  AND   ITSInoHTML is not  'on'
                    GM_log('#=#=# extra test NO ITSI case ');
                    C = C.replace(/>/g,'&gt;').replace(/</g,'&lt;');    // replace <> in text to avoid HTML errors
                    P = C.split('\n');
                    C = P.join('<BR>');
                    C = '[code]<div class="swow swowhilite"  style="background: linear-gradient(45deg, #dfffff, #ddd , #64cece) !important;border-radius: 7px;border: solid 1px #ccc;padding: 10px 14px 10px 14px !important;color: #000;margin-top:5px;"><span>' + C + '</span></div>[/code]';
                }

                GM_log('# comment ' , unsafeWindow.g_form.getValue(script + '.comments') );
                GM_log('# log     ' , unsafeWindow.g_form.getValue('activity-stream-comments-textarea') );
                var cnld = 'CANCELED';
                var cmpl = 'COMPLETE';
                if ((country === 'DE' || country === 'AT')     && usecountry !== ' ' ) {
                    cnld = 'ANNULLIERT';
                    cmpl = 'ERLEDIGT';
                }
                var n = new Date();
                var i;
                var mt = 0;
                var Cline = 0;
                var Eline = 0;
                var TM = '';
                var prbactp = '';
                var lines = prbarea.split('\n');
                for (i = 0; i < lines.length; i++) {
                    if ( lines[i].toUpperCase().indexOf('> '+cmpl) < 0  && lines[i].toUpperCase().indexOf('> '+cnld) < 0 ) {
                        GM_log(lines[i]);
                        prbactp = prbactp + lines[i] + '\n';
                        if ( lines[i].indexOf('=> ETA ') > -1 ) {
                            Eline++;
                            var T = lines[i].split('=> ETA ')[1].replace(/-/g,'/');
                            if ( T.indexOf( '/' + n.getFullYear() ) == -1 && T.indexOf( '/' + ( n.getFullYear() + 1) ) == -1) { T = T + '/' + n.getFullYear(); }
                            var msec = Date.parse( T );
                            GM_log('#save swowtime', msec , T  + ' 12:00:00' );
                            if (mt === 0) {
                                mt = msec;
                                TM = T;
                            } else {
                                if ( msec < mt ) {
                                    mt = msec;
                                    TM = T;
                                }
                            }
                        }
                    } else { Cline++; }
                }
                GM_log('#swow update [' + TM + ']', Eline , Cline, lines.length + ' tm [' + mt + ']   n [' + n.getTime() + ']' );
                if ( Eline === 0  &&  Cline < lines.length ) {
                    if ( confirm('No ETA found in SWOW update! Is this OK?') ) {
                        GM_log('# User says SWOW is OK.');
                    } else {
                        return false;
                    }
                }
                if ( Eline > 1 ) {
                    if ( confirm('Multiple ETA lines found!!\nClick "Cancel" if you forgot to put lines to COMPLETE or CANCELED\nClick OK to add this SWOW update.') ) {
                        GM_log('# User says SWOW is OK.');
                    } else {
                        return false;
                    }
                }
                if ( Eline > 0 && mt < n.getTime() ) {
                    alert('All ETA date should be in the future!!\nCurrent ETA=' + TM  + ' is not.');
                    return false;
                }
                if ( cnm === '' && ( prbarea.indexOf('customer ') > -1  || prbarea.indexOf('cust ') > -1  ||  prbarea.indexOf('client ') > -1  ||  prbarea.indexOf('CST') > -1  ||  prbarea.indexOf('CUCO') > -1 ) ) {
                    alert('Cannot replace customer name in update!!\nCurrent customer name is empty.');
                    return false;
                }
                $("#SwoWindow").fadeOut(1000); //.udraggable( 'destroy')
                $('#caldiv').hide();
                GM_setValue('prbactp'+casenr,prbactp);
                if (TM !== '' ) {
                    GM_setValue(casenr + '_ETA',TM);
                    GM_log(casenr + '_ETA set to ['+ TM + '] '  );
                    tdate = n.toString().substr(4,20).replace(' ','-').replace(' ','-');
                    p = tdate.split('-');
                    tdata = p[1] + '-' + p[0] + '-' + p[2].trim();
                    TM = TM.replace(/\//g,'-');
                    p = TM.split(' ');
                    GM_log('# swow write', p);
                    if (p.length == 3 ) {
                        TM = p[1].trim() + ' ' + p[2].trim() + ':00';
                    } else {
                        TM = p[1].trim() + ' 12:00:00';
                    }
                    GM_log('#save swow update to u_custom_date_1 ['+ tdata + '] ' + TM );
                    $('#ETAfld').text(p.join(' ')).css('color','unset').removeClass('warnbg');   // Set the ETA date  NOT set color here, use class !!*fixit*
                } else {
                    GM_log('#swow update ETA = \'\' ');
                    tdate = n.toString().substr(4,20).replace(' ','-').replace(' ','-');
                    p = tdate.split('-');
                    tdata = p[1] + '-' + p[0] + '-' + p[2].trim();
                    $('#ETAfld').text(' ').css('color','unset').removeClass('warnbg');   // Set the ETA date  NOT set color here, use class !!*fixit*
                }
                unsafeWindow.g_form.setValue( script + '.u_custom_date_1', tdata  );
                unsafeWindow.g_form.setValue( script + '.u_custom_date_2', TM  );

                GM_log('# Pending deferred action ', $('#' + script + '\\.u_next_step').val());            // if 1275 Pending deferred action
                GM_log('# Pending deferred action ', $('#' + script + '\\.u_next_step_displayed').val());
                var casestatus = '[code]<table class="mytbl aggregate_value" style="width:60%;border-collapse:initial;border-spacing:2px;" ><tbody><tr>' + $('#l0').html() + '</tr><tr>' + $('#l1').html() + '</tr><tr>' + $('#l2').html() + '</tr><tbody></table>[/code]';
                var mylbl = 'style="display:table-cell;width:65px  !important;border:1px solid #bbb;padding:0px;border-radius:4px !important;margin:3px !important;padding-right:4px;padding-left:4px;white-space:nowrap;text-align:right;"';
                var myfld = 'style="display:table-cell;width:140px !important;border:1px solid #bbb;padding:0px;border-radius:4px !important;margin:3px !important;padding-left:4px;white-space:pre;background-color:rgba(128, 128, 128, 0.2);"';
                mylbl = 'class="mylbl '; //ac_highlight
                myfld = 'class="myfld ';
                casestatus = casestatus.replace(/class="myfld/g,myfld).replace(/class="mylbl/g,mylbl); //.btn-success .btn-warning .btn-danger .panel-default .panel-info

                if ( $('#' + script + '\\.u_next_step').val() == 1275 || $('#' + script + '\\.u_next_step_displayed').val() == 1275 ) {
                    GM_log('# Pending deferred action ');
                    unsafeWindow.g_form.setValue( script + '.expected_start', TM  );                            //			$('#' +  script + '\\.expected_start').text(TM);
                    unsafeWindow.g_form.setValue( script + '.due_date', TM.replace('12:00','16:00')  );         //			$('#' +  script + '\\.due_date').text(TM.replace('12:00','13:00'));
                    $('#ni\\.' + script + '\\.u_use_operational_timezone').prop('checked', true);
                    $('#' +  script + '\\.u_operational_timezone').val('Europe/Paris');
                }
                // NEED TO GET CUrRENT REC FOR INCIDENt/U_REQUEST AND UPDATE
                GM_log('#=#=# add swow data to server record ');
                var tbl = globalContext["task.table_name"];   //    u_request or incident
                var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
                gr.get(unsafeWindow.window.NOW.sysId);
                gr.setValue( 'u_custom_date_1' , ITSMtimeformat(tdata) );
                gr.setValue( 'u_custom_date_2' , ITSMtimeformat(TM) );
                gr.setValue( 'u_custom_text_2' , shortassign  + ' - ' + st );
                gr.setValue( 'u_custom_text_3' , $('#ciProd').val()  + ';' + $('#ciVer').val()  + ';' + $('#ciSer').val() + ';' + $('#ciContr').val() + ';' + $('#ciVen').val() );
                gr.comments = C;
                if (ITSIcase == 0)             gr.work_notes = casestatus;
                GM_log('#=#=# Joris Huysmans  ITSM+ Script feature SWOW update ' , ITSIcase , ITSInoHTML );
                //  Is er iets in de cases dat laat zien dat er ITSI met NBOSS, Itelligence of Virtelaview gebeurd?
                //  Joris Huysmans  ITSM+ Script feature request :)
                // acgrp = unsafeWindow.g_form.getValue('sys_display.' + script + '.u_owner_group');
                //       NTTcomm.CMS = NBOSS
                //       NTTData.itelligence = Itteligence
                // <span class="tab_header"><span class="tabs2_tab default-focus-outline" tabindex="-1" role="tab" style="display: none;" aria-selected="false">
                //        <span mandatory="true" class="label_description" style="display: none; margin-right: 2px; visibility: hidden;" aria-hidden="true">*</span>
                //        <span class="tab_caption_text noselect">Integration messages log</span>
                //</span><span class="sr-only" aria-hidden="true" id="tab2_section_mandatory_text_8">Contains unpopulated mandatory fields</span></span>
                //<span class="tab_header" style="display: inline;">
                //        <span class="tabs2_tab default-focus-outline" tabindex="-1" role="tab" aria-selected="false" aria-controls="section_tab.a4bce99511b6ec006b609da9dad5c323">
                //        <span mandatory="true" class="label_description" style="display: none; margin-right: 2px; visibility: hidden;" aria-hidden="true">*</span>
                //        <span class="tab_caption_text noselect">Integration messages log</span>
                //        </span><span class="sr-only" aria-hidden="true" id="tab2_section_mandatory_text_9">Contains unpopulated mandatory fields</span></span>
                gr.update(updatedone);
                var rtime = ('0'  + dt.getHours()).slice(-2)+':'+('0' + dt.getMinutes()).slice(-2);
                var P1 = '';
                var P2 = '';
                //      fakepostbuttonclick(C,casestatus);
                if (C.length > 0 ) {
                    P1 = '<div><span colspan="2"><hr></span></div><div style=""><span class="tdwrap"><strong>' + rnow + ' ' + rtime + ' - <a style="color:blue" href="sys_user.do?sysparm_view=itil&amp;sysparm_query=user_name=' + unsafeWindow.NOW.user_email + '">' + unsafeWindow.NOW.user_display_name + '</a></strong></span><span style="float:right;"><sup>Additional comments</sup></span></div>';
                    if ( C.indexOf('[code]') === -1 ) { C = C.replace(/\n/g,'<br>'); } else { C = C.replace('[code]','').replace('[/code]',''); }
                    P2 = '<div style=""><span colspan="2"><span style="word-wrap:break-word;display:block;">' + C + '</span></span></div>';
                    $('#element\\.' + script + '\\.comments\\.additional > span > div').prepend(P1 + P2);
                }
                if (casestatus.length > 0 ) {
                    P1 = '<div><span colspan="2"><hr></span></div><div style=""><span class="tdwrap"><strong>' + rnow + ' ' + rtime + ' - <a style="color:blue" href="sys_user.do?sysparm_view=itil&amp;sysparm_query=user_name=' + unsafeWindow.NOW.user_email + '">' + unsafeWindow.NOW.user_display_name + '</a></strong></span><span style="float:right;"><sup>Work notes not visible to the customer</sup></span></div>';
                    if ( casestatus.indexOf('[code]') === -1 ) { casestatus = casestatus.replace(/\n/g,'<br>'); } else { casestatus = casestatus.replace('[code]','').replace('[/code]',''); }
                    P2 = '<div style=""><span colspan="2"><span style="word-wrap:break-word;display:block;">' + casestatus + '</span></span></div>';
                    $('#element\\.' + script + '\\.work_notes\\.additional > span > div').prepend(P1 + P2);
                }
                $('#myinfo_box').hide();
                return false;
            }




            function close_swow(x,y){
                $("#SwoWindow").fadeOut(1000); //.udraggable( 'destroy')
                $('#caldiv').hide();
            }

            function findvendorfromprod(prod){
                var vendor = '';
                var prodinfo = prod.toLowerCase();
                if ( prodinfo.slice(0,3) === 'n5k'    ) { vendor ='Cisco';}
                if ( prodinfo.slice(0,3) === 'n7k'    ) { vendor ='Cisco';}
                if ( prodinfo.slice(0,3) === 'n9k'    ) { vendor ='Cisco';}
                if ( prodinfo.slice(0,3) === 'ws-'    ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('cisco')  > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('prime')  > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('lms')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('nexus')  > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('asa')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('cucm')   > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('ucs')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('ise')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('isr')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('wlc')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('air')    > -1  ) { vendor ='Cisco';}
                if ( prodinfo.indexOf('mcs-')   > -1  ) { vendor ='Cisco';}
                if ( prodinfo.slice(0,4) === 'sma-'   ) { vendor ='EMC';}
                if ( prodinfo.slice(0,3) === 'w4n'    ) { vendor ='EMC';}
                if ( prodinfo.slice(0,3) === 'apg'    ) { vendor ='EMC';}
                if ( prodinfo.indexOf('smarts') > -1  ) { vendor ='EMC';}
                if ( prodinfo.slice(0,3) === 'ib-'    ) { vendor ='Infoblox';}
                if ( prodinfo.indexOf('-ns1gr') > -1  ) { vendor ='Infoblox';}
                if ( prodinfo.slice(0,3) === 'fg-'    ) { vendor ='Fortinet';}
                if ( prodinfo.indexOf('mx')     > -1  ) { vendor ='Juniper';}
                if ( prodinfo.indexOf('srx')    > -1  ) { vendor ='Juniper';}
                if ( prodinfo.slice(0,4) === 'asg-'   ) { vendor ='Bluecoat';}
                if ( prodinfo.slice(0,3) === 'f5-'    ) { vendor ='F5';}
                if ( prodinfo.slice(0,5) === 'cpap-'  ) { vendor ='Checkpoint';}
                if ( prodinfo.slice(0,3) === 'cp-'    ) { vendor ='Checkpoint';}
                if ( vendor !== '' ) {
                    GM_log('# found vendor:' + vendor + ' for product:' +  prodinfo  );
                } else {
                    GM_log('# found NO vendor for product:' +  prodinfo  );
                }
                return vendor;
            }

            function show_swow(e){
                GM_log('# show_swow called!');
                var x, y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
                }
                y = y - 170;
                x = x - 150;
                if ( x < 10 ) { x=10; }

                if ($("#SwoWindow").length > 0) {
                    $("#SwoWindow").css('top',y + 'px').css('left',x + 'px').fadeIn(500);
                    $('table#hop > tbody:nth-child(1)').css('top','0px').css('left','0px');
                    GM_log('# show_swow fadein');
                    if ( Z === ' INCIDENT') {
                        GM_log('# INCIDENT');
                        if ( $('#prbimpt').val().length < 2 ) {
                            $('#prbimpt').addClass('redtext').text('\n  Please enter the business impact!.').on('focus', function() {
                                $('#prbimpt').removeClass('redtext').text('');
                            });

                        }
                    }

                }
                else {
                    if (serial_number) {
                        if ( serial_number.indexOf('ITSM_CI') == -1 && info[2] === '') { info[2] = serial_number; }
                    } else {
                        info[2] = '';
                    }
                    if ( info[4] === '' &&  info[0] !== '' ) {
                        info[4] = findvendorfromprod(info[0]);
                    }
                    if ( $('#sys_display\\.' + script + '\\.u_product').val().length > 0  && info[0] === '' ) {
                        if ( $('#sys_display\\.' + script + '\\.u_product').val().indexOf('VIRT') == -1 ) {
                            info[0] = $('#sys_display\\.' + script + '\\.u_product').val();
                        }
                    }
                    if (custfn) {
                        var cnm = custfn + ' ' + custln;
                        prbactp = prbactp.replace('customer ', cnm + ' ').replace('cust ', cnm + ' ').replace('client ', 'client(' + cnm + ') ').replace('CST ', 'CST(' + cnm + ') ');
                    }

                    if (!prbdesc) { prbdesc = $('#' + script + '\\.short_description').val();  }    // <td background="#fff">` + Z + `Business Impact:<br>
                    $("body").append(`<div id="SwoWindow" class="mypopup" style="padding-top:0px;" >  \
<table id="hop" class="drghdl2" border=0 padding="0" style="background-color:transparent;">\
<tr><td colspan=2 id="swowdrag" class="draghandle"><a style="float:right;"><span id="Closeswow" class="sprite1 close-button"></span></a></td></tr>\
<tr><td valign=top>` + Z + ` Description:</td><td valign=top><textarea class="boxsizingBorder" id="prbdesc" cols="82" rows="2">` + prbdesc + `</textarea></td></tr>\
<tr><td background="#fff">` + Z + `<br>Business Impact:<br><br><br><a style="float:left;"><span id="plus" class="sprite1 plus-button" title="Toggle display of Status and CI Fields."></a></td><td valign=top><textarea class="boxsizingBorder" id="prbimpt" size="82" rows="2">` + prbimpt + `</textarea></td></tr>\
<tr id=pls1 style="display:none;height:25px;"><td valign=top>` + Z + ` Status:</td><td>\
<input class="ch noselect autosave" type="radio" name="st" value="Pending Customer"  id="st1"><label title="Waiting for feedback from the Customer"        for="st1">&nbsp; Pending Customer &nbsp;</label>\
<input class="ch noselect autosave" type="radio" name="st" value="Pending Vendor"    id="st2"><label title="Waiting for feedback from the Vendor"          for="st2">&nbsp; Pending Vendor &nbsp;</label>\
<input class="ch noselect autosave" type="radio" name="st" value="Pending SCT"       id="st3"><label title="Waiting for feedback from Contract Management" for="st3">&nbsp; Pending SCT &nbsp;</label>\
<input class="ch noselect autosave" type="radio" name="st" value="Pending SDM"       id="st5"><label title="Waiting for feedback from SDM"                 for="st5">&nbsp; Pending SDM &nbsp;</label>\
<input class="ch noselect autosave" type="radio" name="st" value="Other"             id="st4"><label title="Waiting for something else"                    for="st4">&nbsp; Other &nbsp;</label> <input class="autosave" id="othertxt" size=10>\
</td></tr>\
<tr id=pls2 style="display:none;height:22px;"><td valign=top>` + Z + ` CI:</td>\
<td>Product: <input class="autosave" id="ciProd"  value="` + info[0] + `" size=10 title="Product for which this case is opened, that has an issue.(or appears to have)"> &nbsp; \
Vendor: <input class="autosave" id="ciVen"   value="` + info[4] + `" size=10 title="Software/Hardware vendor of the product.">&nbsp; \
Version: <input class="autosave" id="ciVer"   value="` + info[1] + `" size=10 title="Software/Hardware version of the product."> &nbsp; \
Serial: <input class="autosave" id="ciSer"   value="` + info[2] + `" size=10 title="Serial or PAK you may need to open vendor case."> &nbsp; \
Contract: <input class="autosave" id="ciContr" value="` + info[3] + `" size=10 title="Contract nr. you may need to open vendor case."> </td></tr>\
<tr id="fndtr" style="display:none;"><td>Found:<p><br><p><br><a style="float:right;"><span id="firstmsg" class="sprite1 msg-button" title="Go to first customer message."></td><td valign=top><textarea class="boxsizingBorder" id="found" size="82" rows="5" title="Some selected text from the case notes that may contain the info we are looking for"></textarea></td></tr>\
<tr><td colspan=2>                                           <textarea class="boxsizingBorder" id="prbarea" cols="100" rows="5">` + prbactp + `</textarea></td></tr>\
<tr style="vertical-align:middle;"><td colspan=2 style="height:25px;">\
<button id="addswow">&nbsp; Post SWOW &nbsp;</button> &nbsp; &nbsp; \
<button id="b1">COMPLETED</button> \
<button id="b8">CANCELED</button> \
<button id="b2">NEW</button> \
<button id="b6">ETA today</button> \
<button id="b3">ETA+1</button> \
<button id="b4">ETA+2</button> \
<button id="b7" class="date_time_trigger" type="button" name="swow_eta_dt" tabindex="-1" data-type="date_time" data-ref="swow_eta_dt" aria-label="Select date and time" data-date_time_format="dd-MMM-yyyy HH:mm:ss"    data-original-title="Select date and time" style="min-height: 9px;padding: 2px 4px !important;"   title="Choose date from Calendar">CAL</button>
&nbsp; &nbsp;  &nbsp; &nbsp;  \
<button id="b5" title="Import Last SWOW entry from notes">Find SWOW</button>\
<input id="swow_eta_dt" type="hidden" class="element_reference_input"  data-type="glide_element_date_time" data-ref="swow_eta_dt" name="swow_eta_dt" value=""/>
</td></tr></table></form>\
</div>`); // margin-right:5px;
                    // <button
                    //     class="btn btn-default btn-ref date_time_trigger"
                    //     type="button"
                    //     name="u_request.work_end.ui_policy_sensitive"
                    //     id="u_request.work_end.ui_policy_sensitive"
                    //     tabindex="-1"
                    //     data-type="date_time"
                    //     data-ref="u_request.work_end"
                    //     title=""
                    //     aria-label="Select date and time"
                    //     data-date_time_format="dd-MMM-yyyy HH:mm:ss"
                    //     data-original-title="Select date and time">
                    //     <span class="icon-calendar icon" aria-hidden="true" style="margin-left: -4px;">
                    //     </span>
                    // </button>

                    GM_log('# INCIDENT?[' + Z + ']');
                    if ( Z === ' INCIDENT') {
                        GM_log('# INCIDENT');
                        if ( prbimpt.length < 2 ) {
                            $('#prbimpt').addClass('redtext').text('\n  Please enter the business impact!.').on('focus', function() {
                                $('#prbimpt').removeClass('redtext').text('');
                            });
                        }
                    }
                    $("#SwoWindow").css('position','absolute').css('top',y + 'px').css('left',x +'px').show(); // .css('z-Index','1000');  //.css('visibility','visible')

                    //			var prbstat = GM_getValue('prbstat'+casenr,'');
                    GM_log('# show_swow 1' );
                    if (typeof prbstat === 'undefined') { prbstat = ''; }
                    GM_log('# show_swow called![' + prbstat + '] x=' + x + ' y=' + y + ' '   );
                    if ((country === 'DE' || country === 'AT') && usecountry !== ' ' ) {
                        $("#b1").text('ERLEDIGT');
                        $("#b8").text('ANNULLIERT');
                        $("#b6").text('ETA heute');
                        $("#b2").text('NEU');
                    }
                    $("#b1"     ).click(f_complete).addClass('mybut').attr('title','Complete SWOW entry.(replaces selected ETA)');
                    $("#b8"     ).click(f_cancel  ).addClass('mybut').attr('title','Cancel SWOW entry.(replaces selected ETA)');
                    $("#b2"     ).click(f_new     ).addClass('mybut').attr('title','Add new SWOW entry.');
                    $("#b6"     ).click(f_eta0    ).addClass('mybut').attr('title','Add SWOW timestamp 2 hours ahead.');
                    $("#b3"     ).click(f_eta1    ).addClass('mybut').attr('title','Add SWOW timestamp 1 day ahead.');
                    $("#b4"     ).click(f_eta2    ).addClass('mybut').attr('title','Add SWOW timestamp 2 days ahead.');
                    $("#b5"     ).click(swowfind  ).addClass('mybut').attr('title','Find last SWOW entry in case notes.');
                    $("#addswow").click(write_swow).addClass('mybut').attr('title','add SWOW notes to case comments.');
                    $("#b7"     ).click(function(e) {
                        if (e.pageX || e.pageY) {
                            x = e.pageX;
                            y = e.pageY;
                        } else {
                            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                            y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
                        }
                        GM_log('#=#= fn show callendar', x, y ); //GwtDateTimePicker
                        setTimeout( function() {
                            $('#GwtDateTimePicker').css('top', (y + 22)+ 'px').css('left', x + 'px').css('z-index','10000').show() ;
                            $('td.calText.calTime').hide();
                            $('#GwtDateTimePicker_ok').parent().hide();
                            $('#GwtDateTimePicker_ok').click(function(){
                                GM_log('#=#= calendar check', $('#swow_eta_dt').val()  );
                                var newdate = $('#swow_eta_dt').val().replace(' selected.','').split(', ');
                                var datestr = newdate[1] + ' ' + newdate[2] + ' 00:00:00'; //.split(' ')[0]
                                var nowdate = new Date();
                                var newdate = new Date(datestr);
                                var timeDiff = newdate.getTime() - nowdate.getTime();
                                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                if (diffDays < 1) { diffDays=1; }
                                GM_log('#t#=#=#  diff.....', diffDays, datestr);
                                add_eta(diffDays);
                            });
                            $('td.calText.calCurrentMonthDate > a').click(function(){
                                GM_log('#=#= calendar clicked', $(this).attr('aria-label'));
                                $('#swow_eta_dt').val($(this).attr('aria-label').replace(' selected.',''));
                                $('#GwtDateTimePicker_ok').click();
                            });
                        },500);
                    }).addClass('mybut').addClass('date_time_trigger').attr('title','Add SWOW timestamp using calendar.');
                    $('#swow_eta_dt').on('change',function(){
                        GM_log('#=#= calendar selection', $('#swow_eta_dt').val()  );
                        alert('swow_eta_dt Changed');
                    });
                    $("#Closeswow").click(close_swow);
                    var swowplus = GM_getValue('swowplus', false);
                    GM_log('# show_swow GM_getValue swowplus' , swowplus  );
                    if (typeof swowplus === 'undefined') { swowplus = false; }
                    if (swowplus) { $('#pls1').show(); $('#pls2').show(); $("#plus").addClass('min-button').removeClass('plus-button');} else { $("#plus").addClass('plus-button'); }
                    GM_log('# show_swow 2' );
                    $("#plus").on('click', function(){
                        GM_log('# show plus clicked '   );
                        $("#fndtr").hide();
                        $('#pls1').toggle();
                        $('#pls2').toggle();
                        swowplus = !swowplus;
                        GM_setValue('swowplus',swowplus);
                        $("#plus").toggleClass('plus-button').toggleClass('min-button');
                        GM_log('# show plus click done '   );
                    });
                    $('#element\\.'+script+'\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:last ').attr('id','firstcumsg');
                    $("#firstmsg").on('click', function(){
                        document.getElementById("firstcumsg").scrollIntoView();
                        $("#SwoWindow").css({ top:'40px',left:'500px' });
                    });

                    GM_log('# show_swow 3' );
                    $("#othertxt").on('keyup', function(){
                        $("input[name=st][value='Other']").prop("checked",true);
                    });
                    GM_log('# show_swow 4' );
                    $('#swowdrag').on('mousedown', function(e) {
                        GM_log('#=#= drag' , $(e.target).closest('div').attr('id') ,   $(e.target).attr('id') );
                        GM_log('#=#= drag' , $(e.target).parent().parent().parent().parent().attr('id') );
                        if ( $(e.target).attr('id') === 'Closeswow') {
                            GM_log('# hide swow 1');
                            $("#SwoWindow").fadeOut(1000);
                        } else {
                            if(e.offsetX===undefined){
                                xoff = e.pageX-$(this).offset().left;
                                yoff = e.pageY-$(this).offset().top;
                            }else{
                                xoff = e.offsetX;
                                yoff = e.offsetY;
                            }
                        }
                        $(this).addClass('draggable');
                        $('body').addClass('noselect');
                        $target = $(e.target).parent().parent().parent().parent();
                    });
                    GM_log('# show_swow 5' );
                    var q = $("#firstmsg").text();
                    GM_log('# show_swow 6' );
                    $("#ciProd").on('focus', function(){
                        sel_target = 'ciProd';
                        $("#found").val(serialsearch('prod'));
                        $("#fndtr").show();
                        GM_log('#=#= ', sel_target  );
                    });
                    $("#ciProd").on('focusout', function(){
                        if ( info[4] === '' && $("#ciProd").val() !== '' ) {
                            info[4] = findvendorfromprod( $("#ciProd").val() );
                            $("#ciVen").val(info[4]);
                        }
                    });
                    $("#ciVer").on('focus', function(){
                        sel_target = 'ciVer';
                        $("#found").val(serialsearch('ver'));
                        $("#fndtr").show();
                        GM_log('#=#= ', sel_target  );
                    });
                    $("#ciSer").on('focus', function(){
                        sel_target = 'ciSer';
                        $("#found").val(serialsearch('ser'));
                        $("#fndtr").show();
                        GM_log('#=#= ', sel_target  );
                    });
                    $("#ciContr").on('focus', function(){
                        sel_target = 'ciContr';
                        $("#found").val(serialsearch('cont') + supportingcontracts);
                        $("#fndtr").show();
                        GM_log('#=#= ', sel_target  );
                    });
                    $("#ciVen").on('focus', function(){
                        sel_target = 'ciVen';
                        $("#found").val(serialsearch('vendor'));
                        $("#fndtr").show();
                        GM_log('#=#= ', sel_target  );
                    });
                    $("#prbarea").on('focus', function(){
                        $("#fndtr").fadeOut(1000);
                        sel_target = '';  // clear to prevent further copying of selected text to info table.
                    });
                    $("#found").on('mouseup', function(){
                        getSelectedText();
                        autosav();
                        GM_log('#=#= mouseup on found 5850' );
                    });
                    GM_log('# show_swow 7' );
                    $('input[name=st]').on('change', function(){
                        var st = $('input[name=st]:radio:checked').val();
                        var vdr = $('#ciVen').val().length > 0 ? $('#ciVen').val() : 'vendor' ;
                        if ( GM_getValue('DefaultSWOW') ) {
                            if ( st.indexOf('Pending Customer') > -1 ) { f_new('Await feedback from CST');    }
                            if ( st.indexOf('Pending Vendor')   > -1 ) { f_new('Await feedback from ' + vdr); }
                            if ( st.indexOf('Pending SCT')      > -1 ) { f_new('Await feedback from ');    }
                        }
                        GM_setValue('prbstat'+casenr,st);
                    });
                    GM_log('# show_swow 8' );
                    if ( prbstat.indexOf('Pending Customer') > -1 ) { $('#st1').prop("checked",true); }
                    if ( prbstat.indexOf('Pending Vendor')   > -1 ) { $('#st2').prop("checked",true); }
                    if ( prbstat.indexOf('Pending SCT')      > -1 ) { $('#st3').prop("checked",true); }
                    if ( prbstat.indexOf('Pending SDM')      > -1 ) { $('#st5').prop("checked",true); }
                    if ( prbstat.indexOf('Other')            > -1 ) { $('#st4').prop("checked",true); $('#othertxt').val( $('#'+ script + '\\.u_custom_text_2').val().split('Other ')[1] ); }
                    GM_log('# show_swow 9' );
                    $('input.autosave').on('change', function() { autosav(); });
                    GM_log('# show_swow end' );

                }
                return false;
            }

            function autosav(){
                GM_log('# autosave changed or mouseup' );
                var st = ($('input[name=st]:radio:checked').length > 0) ? $('input[name=st]:radio:checked').val() : '';
                if ( st === 'Other' &&  $('#othertxt').val().length > 0) st += ' ' + $('#othertxt').val();
                $('input#' + script + '\\.u_custom_text_2').val( shortassign  + ' - ' + st );
                $('input#' + script + '\\.u_custom_text_3').val($('#ciProd').val()  + ';' + $('#ciVer').val()  + ';' + $('#ciSer').val() + ';' + $('#ciContr').val() + ';' + $('#ciVen').val() );
                GM_setValue('prbstat'+casenr,st);
                $('#l1 > td:nth-child(3) ').text(st);                   // Status
                if ( $('#ciContr').val() !== '') $('#l1 > td:nth-child(11)').text();  // Contract
                if ( $('#ciProd ').val() !== '') $('#l2 > td:nth-child(3) ').text();  // Product
                if ( $('#ciVen  ').val() !== '') $('#l1 > td:nth-child(7) ').text();  // Vendor
                if ( $('#ciSer  ').val() !== '') $('#l2 > td:nth-child(7) ').text();  // Serial
                if ( $('#ciVer  ').val() !== '') $('#l2 > td:nth-child(11)').text();  // Versiom
                var tbl = globalContext["task.table_name"];   //    u_request or incident
                var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
                gr.get(unsafeWindow.window.NOW.sysId);
                gr.setValue( 'u_custom_text_2' , shortassign  + ' - ' + st );
                gr.setValue( 'u_custom_text_3' , $('#ciProd').val()  + ';' + $('#ciVer').val()  + ';' + $('#ciSer').val() + ';' + $('#ciContr').val() + ';' + $('#ciVen').val() );
                gr.update(updatedone);
                if (info[2] !== $('#l2 > td:nth-child(7) ').text() ) {
                    info[2] = $('#ciSer  ').val();
                    GlideTestSerial();
                } else info[2] = $('#ciSer  ').val();
                info[0] = $('#ciProd ').val();
                info[4] = $('#ciVen  ').val();
                info[1] = $('#ciVer  ').val();
                info[3] = $('#ciContr').val();
                UpdateTableFields();
            }

            function test123() {

                var t = getSelectedText();
                GM_log('#=#= ', toid , t );
                $("#" + sel_target).val(t);
            }

            function getSelectedText() {
                GM_log('#=#= getSelectedText target', sel_target  );
                var textComponent = document.getElementById('found');
                var selectedText;
                if (textComponent.selectionStart !== undefined) {
                    var startPos = textComponent.selectionStart;
                    var endPos = textComponent.selectionEnd;
                    selectedText = textComponent.value.substring(startPos, endPos);
                } else if (document.selection !== undefined) {
                    textComponent.focus();
                    var sel = document.selection.createRange();
                    selectedText = sel.text;
                }
                if (selectedText.length > 1 ) { $("#" + sel_target).val(selectedText); }
            }




            function f_toggledrag(){
                if ( drgstate === true ) {
                    $("#SwoWindow").udraggable('destroy');
                    $(".drghdl2").css('cursor','auto').css('background-color','initial');
                    drgstate = false;
                } else {
                    $("#SwoWindow").udraggable({ handle:'.drghdl2' });
                    $(".drghdl2").css('cursor','move').css('background-color','#DFE');
                    drgstate = true;
                }
            }

            function f_complete(){
                GM_log('f_complete called');
                var cmpl = 'COMPLETED';
                if ((country === 'DE' || country === 'AT') && usecountry !== ' ' ) cmpl = 'ERLEDIGT';

                String.prototype.replaceBetween = function(start, end, what) {
                    return this.substring(0, start) + what + this.substring(end);
                };

                var curText = $('#prbarea').val();
                var cursorPosition = $('#prbarea').prop("selectionStart");
                var numberOfLineBreaks = ( curText.match(/\n/g)||[] ).length;
                if ( cursorPosition === 0 ) { cursorPosition = curText.length; }
                GM_log('# cursor at:' + cursorPosition + ' in ' + curText.length + ' there are ' + numberOfLineBreaks + ' linebreaks' );
                var startpos = curText.lastIndexOf('\n',cursorPosition -1 ) + 1;
                var end_pos  = curText.indexOf('\n',cursorPosition );
                if ( end_pos  == -1) { end_pos = curText.length; }
                if ( startpos == -1) { startpos = 0; }
                etapos = curText.indexOf('ETA ',startpos );
                GM_log('# the ETA line is ' + curText.substring( etapos, end_pos)   + ' from -- to :', etapos, end_pos);


                var areacontent = $('#prbarea').val();
                var lastLine = areacontent.substr(areacontent.lastIndexOf("\n")+1);
                GM_log('Lastline is :' + lastLine);
                var textComponent = document.getElementById('prbarea');
                var selectedText;
                if (textComponent.selectionStart !== undefined) {
                    var startPos = textComponent.selectionStart;
                    var endPos = textComponent.selectionEnd;
                    selectedText = textComponent.value.substring(startPos, endPos);
                } else if (document.selection !== undefined) {
                    textComponent.focus();
                    var sel = document.selection.createRange();
                    selectedText = sel.text;
                }
                var date2keep = ' [' + curText.substring(etapos + 4  , end_pos) + ']';
                GM_log('Selected :' + selectedText);
                var dt = new Date();
                var eta = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();
                var hrs = dt.getHours()   < 10 ? '0' + dt.getHours()   : dt.getHours();
                var mts = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
                date2keep = ' [' + eta + ' ' + hrs + ':' + mts + ']';
                if(  GM_getValue('DTonCOMP','off') === 'on' ) cmpl = cmpl + date2keep;
                if ( selectedText.length > 0 ) {
                    areacontent = areacontent.replace(selectedText,cmpl);
                } else {
                    if (etapos > -1) {
                        areacontent = areacontent.replaceBetween(etapos, end_pos, cmpl);
                    }
                    else {
                        areacontent += '   =======> '+ cmpl;
                    }

                }
                $('#prbarea').val(areacontent);

            }

            function f_cancel(){
                GM_log('f_cancel called');
                var cnld = 'CANCELED';
                if ((country === 'DE' || country === 'AT') && usecountry !== ' ' ) cnld = 'ANNULLIERT';
                String.prototype.replaceBetween = function(start, end, what) {
                    return this.substring(0, start) + what + this.substring(end);
                };
                var curText = $('#prbarea').val();
                var cursorPosition = $('#prbarea').prop("selectionStart");
                var numberOfLineBreaks = ( curText.match(/\n/g)||[] ).length;
                if ( cursorPosition === 0 ) { cursorPosition = curText.length; }
                GM_log('# cursor at:' + cursorPosition + ' in ' + curText.length + ' there are ' + numberOfLineBreaks + ' linebreaks' );
                var startpos = curText.lastIndexOf('\n',cursorPosition -1 ) + 1;
                var end_pos  = curText.indexOf('\n',cursorPosition );
                if ( end_pos  == -1) { end_pos = curText.length; }
                if ( startpos == -1) { startpos = 0; }
                etapos = curText.indexOf('=> ETA ',startpos );
                if ( etapos == -1 ) { etapos = curText.indexOf('=> COMP',startpos); }
                GM_log('# the ETA line is ' + curText.substring( etapos, end_pos)   + ' from -- to :', etapos, end_pos);
                var areacontent = $('#prbarea').val();
                var lastLine = areacontent.substr(areacontent.lastIndexOf("\n")+1);
                GM_log('Lastline is :' + lastLine);
                var textComponent = document.getElementById('prbarea');
                var date2keep = ' [' + curText.substring(etapos + 4  , end_pos) + ']';
                var dt = new Date();
                var eta = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();
                var hrs = dt.getHours()   < 10 ? '0' + dt.getHours()   : dt.getHours();
                var mts = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
                date2keep = ' [' + eta + ' ' + hrs + ':' + mts + ']';
                if(  GM_getValue('DTonCOMP','off') === 'on' ) cmpl = cmpl + date2keep;
                var selectedText;
                if (textComponent.selectionStart !== undefined) {
                    var startPos = textComponent.selectionStart;
                    var endPos = textComponent.selectionEnd;
                    selectedText = textComponent.value.substring(startPos, endPos);
                } else if (document.selection !== undefined) {
                    textComponent.focus();
                    var sel = document.selection.createRange();
                    selectedText = sel.text;
                }
                GM_log('Selected :' + selectedText);
                if ( selectedText.length > 0 ) {
                    areacontent = areacontent.replace(selectedText,'=> '+cnld);
                } else {
                    if (etapos > -1) {
                        areacontent = areacontent.replaceBetween(etapos, end_pos, '=> '+cnld);
                    }
                    else { 	areacontent += '   =======> '+cnld;	}
                }
                $('#prbarea').val(areacontent);
            }


            function f_new(xtratxt){
                var atxt = xtratxt;
                if ( xtratxt === null || typeof xtratxt === 'object' ) { atxt = ''; }
                var snaputnie = typeof xtratxt;
                GM_log('#=#=#=#  New is called:  arg1 ', atxt , snaputnie);
                if ( snaputnie.toString().indexOf('object') > -1 ) { atxt = ''; }
                GM_log('#=#=#=#  New is called:  arg1 ', atxt);
                var sep;
                var nr = 0;
                var areacontent = $('#prbarea').val();
                lines = areacontent.split('\n');
                p = lines.length;
                GM_log('#=#=#=#  New is called.  lines: ' + p , sep, atxt);
                if ( p > 0 ) {
                    var firstpart ='';
                    do {
                        p = p -1;
                        firstpart = lines[p].split(' ')[0];
                        if ( firstpart.indexOf('.') > -1 ) GM_setValue('SWOW_sep','.');
                        if ( firstpart.indexOf(')') > -1 ) GM_setValue('SWOW_sep',')');
                        nr = Number( firstpart.replace('.','').replace(')','').trim() );
                        if ( isNaN(nr) ) {
                            GM_log('#=#=#=#  New is called.  line: ' + p , firstpart , lines[p] );
                        }
                        if ( isNaN(nr) ) { nr = Number( lines[p].split(' ')[0] ); }
                        if ( isNaN(nr) ) { nr = Number( lines[p].split('/')[0].trim() ); }
                        if ( isNaN(nr) ) { nr = Number( lines[p].split('-')[0].trim() ); }
                    } while ( lines[p].indexOf('.') < 0 && lines[p].indexOf(')') < 0  && p > 0);
                }
                var tnr = 0;
                if ( GM_getValue(casenr + '_ln') ) { tnr = GM_getValue(casenr + '_ln'); }
                if ( nr < 1 || isNaN(nr) ) {
                    nr = ( tnr > 0 ) ? (tnr + 1) : 1;
                } else {
                    if ( nr < tnr ) { nr = tnr; }
                    nr = nr + 1;
                }
                if (areacontent.length > 2 ) {
                    if ( areacontent.slice(-1) == '\n') { areacontent = areacontent.substring(0,areacontent.length - 1); }
                    if ( areacontent.slice(-1) == '\n') { areacontent = areacontent.substring(0,areacontent.length - 1); }
                    nr = '\n' + nr;
                }
                sep = GM_getValue('SWOW_sep','.');
                areacontent = areacontent  + nr + sep + '  ' + atxt;
                var luha = GM_getValue('XtraSWOW','');
                if (luha.indexOf(' test ') > -1) { GM_deleteValue('XtraSWOW'); }
                if (typeof luha !== 'undefined') {
                    if ( luha.length > 0) { areacontent = areacontent  + luha + ' '; }
                    GM_log('#=#=#=#  fNew  XtraSWOW: ' , luha);
                }
                $('#prbarea').val(areacontent);
                GM_log('#=#=#=#  New finished ',  atxt);
                moveCaretToEnd('#prbarea');
                $('#prbarea').focus();
                return false;
            }


            function moveCaretToEnd(el) {
                if (typeof el.selectionStart == "number") {
                    el.selectionStart = el.selectionEnd = el.value.length;
                } else if (typeof el.createTextRange != "undefined") {
                    el.focus();
                    var range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }


            function f_eta0(d){
                GM_log('#=#= f_eta0 called');
                add_eta(0);
            }

            function f_eta1(d){
                GM_log('#=#= f_eta1 called');
                add_eta(1);
            }

            function f_eta2(){
                GM_log('#=#= f_eta2 called');
                add_eta(2);
            }

            function add_eta(d){

                String.prototype.replaceBetween = function(start, end, what) {
                    return this.substring(0, start) + what + this.substring(end);
                };

                var curText = $('#prbarea').val();
                var cursorPosition = $('#prbarea').prop("selectionStart");
                var numberOfLineBreaks = ( curText.match(/\n/g)||[] ).length;
                if ( cursorPosition === 0 ) { cursorPosition = curText.length; }
                GM_log('# cursor at:' + cursorPosition + ' in ' + curText.length + ' there are ' + numberOfLineBreaks + ' linebreaks' );
                var startpos = curText.lastIndexOf('\n',cursorPosition -1 ) + 1;
                var end_pos  = curText.indexOf('\n',cursorPosition );
                if ( end_pos  == -1) { end_pos = curText.length; }
                if ( startpos == -1) { startpos = 0; }
                etapos = curText.indexOf('ETA ',startpos );
                GM_log('# the ETA line is ' + curText.substring( etapos, end_pos)   + ' from -- to :', etapos, end_pos);

                GM_log('# add_eta(' + d + ') cursor at:' + cursorPosition + ' in ' + $('#prbarea').val().length );
                if (typeof d == 'undefined' || isNaN(d) ) { d = 1; }
                var areacontent = $('#prbarea').val();
                var textComponent = document.getElementById('prbarea');
                var selectedText;
                if (textComponent.selectionStart !== undefined) {
                    var startPos = textComponent.selectionStart;
                    var endPos = textComponent.selectionEnd;
                    selectedText = textComponent.value.substring(startPos, endPos);
                } else if (document.selection !== undefined) {
                    textComponent.focus();
                    var sel = document.selection.createRange();
                    selectedText = sel.text;
                }
                GM_log('Selected :' + selectedText);
                GM_log('Calc new date');
                var dt = new Date();
                if ( d === 0 ) { dt.setHours( dt.getHours() + 2 ); }
                dt.setDate( dt.getDate() + d );
                GM_log('#=# day =' + dt.getDay());
                if  ( dt.getDay() == 6  ) { dt.setDate( dt.getDate() + 2 ); }
                if  ( dt.getDay() === 0 ) { dt.setDate( dt.getDate() + 2 ); }
                var eta = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();
                var hrs = dt.getHours()   < 10 ? '0' + dt.getHours()   : dt.getHours();
                var mts = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
                var rtime = hrs + ':' + mts;
                if ( d === 0 ) { eta = eta + ' ' + rtime; }
                GM_log('# new ETA :' + eta + ' dt=' + dt );
                if ( selectedText.length > 0 ) {
                    GM_log('#=# seltxt =' + selectedText);
                    if ( selectedText.indexOf('ETA') > -1 ) { eta = 'ETA ' + eta; }
                    areacontent = areacontent.replace(selectedText,'ETA ' + eta);
                    GM_log('#=# replacing  =' + selectedText + ' by:' + eta);
                } else {
                    if (etapos > -1) {
                        areacontent = areacontent.replaceBetween(etapos, end_pos, 'ETA ' + eta);
                    }
                    else {
                        areacontent += '   ======> ETA ' + eta;
                    }

                }
                $('#prbarea').val(areacontent);
            }

            function colourphnnrs() {
                setTimeout( function() {
                    GM_log('#=#= colourphnnrs');
                    $('#lijstframe').contents().find('a.column_head').click( colourphnnrs );
                    $('#lijstframe').contents().find('td').hlitephnnr();
                    $('#lijstframe').contents().find('a.linked').css('white-space','nowrap');
                    $('#lijstframe').contents().find('.phncl').click(function() {
                        var info = $(this).parent().attr("title");
                        phonecall(info);
                    });
                }, 1000 );
            }


            function show_list(e){
                var x, y;
                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
                }
                if ($("#contact_lijst").length === 0) {
                    $("body").append('<div id="contact_lijst">');
                }
                cust = $('input#sys_original\\.' + script + '\\.company').val();
                cust = '/sys_user_list.do?sysparm_query=u_extension_numberISNOTEMPTY^ORmobile_phoneISNOTEMPTY^ORemailISNOTEMPTY^company%3D' + cust;
                GM_log('lijst voor company ' + cust);
                $("#contact_lijst").html(`<table border=0 width='100%' style='background-color:#6D6E71 !important;'>\
<tr><td id='sleeplijst' align='right' class='draghandle'><a style='float:right;'><span id='Closelijst' class='sprite1 close-button'></span></a></td></tr>\
<tr><td padding='5'><iframe id='lijstframe' src='` + cust + `'></iframe></td></tr> \
</table> \
`).css('top',y + 'px').css('left',x + 'px').css('height','auto').css('width','auto').css('position','absolute').css('z-index','10').show(500);
                //                                     <tr><td align='right'> xxxx <img src='images/pinned.png' /></td></tr> \
                y=+1; x=+2;
                $("#lijstframe").css('height','auto').css('width','auto').css('min-height','200px').css('min-width','500px').css('max-height','800px');
                $("#Closelijst").click( function() { $("#contact_lijst").hide(500); } );
                $('#lijstframe').on('load', function () {
                    $('#lijstframe').contents().find('img.list_nav').click( colourphnnrs );
                    $('#lijstframe').contents().find('a.column_head').click( colourphnnrs );
                    $('#lijstframe').contents().find('td').hlitephnnr();
                    $('#lijstframe').contents().find('.phncl').click(function() {
                        var info = $(this).parent().attr("title");
                        phonecall(info);
                    });
                    var tblwd = Number( $('#lijstframe').contents().find('#sys_user_table').css('width').replace('px','')) + 76 ;
                    var tblht = Number( $('#lijstframe').contents().find('#sys_user_table').css('height').replace('px','')) + 60 ;
                    var htmlht = Number( $('#lijstframe').contents().find('html').css('height').replace('px','')) + 50 ;
                    if ( tblht > 800 ) tblht = 800;
                    GM_log('#  ' , tblwd , tblht , htmlht);

                    $("#lijstframe").css('height', tblht + 'px');
                    $("#lijstframe").css('width', tblwd + 8 + 'px');
                    $("#contact_lijst").css('height', (tblht + 19) + 'px');
                    $("#contact_lijst").css('width', (tblwd + 11) + 'px');
                    $("#contact_lijst").css('background-color', '#fff'); // .css('opacity', '.7') ;
                });
                $('#sleeplijst').on('mousedown', function(e) {
                    if ( $(e.target).attr('id') === 'Closelijst') {
                        GM_log('# hide swow 1');
                        $("#contact_lijst").fadeOut(1000);
                    } else {
                        if(e.offsetX===undefined){
                            xoff = e.pageX-$(this).offset().left;
                            yoff = e.pageY-$(this).offset().top;
                        }else{
                            xoff = e.offsetX;
                            yoff = e.offsetY;
                        }
                    }
                    $(this).addClass('draggable');
                    $('body').addClass('noselect');
                    $target = $(e.target).parent().parent().parent().parent();
                });

            }



            function closequeue(st) {
                //	if (sts !== 'NOK') {
                //		var ag = '';
                //        if (!country || country === '' ) country = 'BE';
                //		acgrp = unsafeWindow.g_form.getValue('sys_display.' + script + '.u_owner_group');
                //
                //		if      (acgrp.indexOf('BE.RSO.SD')    > -1 ) { ag = 'f8f8251a0fecae44990f55d003050ef6'; }   //  EU.BE.RSO.SD.Closure
                //		else if (acgrp.indexOf('EU.GSC.BE.')   > -1 ) { ag = '23a813c80a0a3c78013368c66335c0cc'; }   //  EU.GSC.BE.ServiceDesk.Closure
                //		else if (acgrp.indexOf('EU.GSC.DE.')   > -1 ) { ag = '23c271bb0a0a3c7800d444935fac9aa7'; }   //  EU.GSC.DE.ServiceDesk.Closure  23c271bb0a0a3c7800d444935fac9aa7
                //		else if (acgrp.indexOf('EU.GSC.FR.')   > -1 ) { ag = '23d65de80a0a3c7801727c9cc28b8d72'; }   //  EU.GSC.FR.ServiceDesk.Closure	85ab94220a0a3c07008c9c6c777b9933
                //		else if (acgrp.indexOf('EU.GSC.NL.')   > -1 ) { ag = '319f90c20a0a3c7801d44d6d7cce92c2'; }   //  EU.GSC.NL.ServiceDesk.Closure 	319da1430a0a3c7800742f5dca020e05
                //		else if (acgrp.indexOf('EU.GSC.UK.')   > -1 ) { ag = '31a922d30a0a3c7801b2f56b2fd7e3a8'; }   //  EU.GSC.UK.ServiceDesk.Closure
                //		else if (acgrp.indexOf('EU.GSC.IT.')   > -1 ) { ag = '23dea8d40a0a3c78016a88f805066382'; }   //  EU.GSC.IT.ServiceDesk.Closure
                //		else if (acgrp.indexOf('EU.GSC.LU.')   > -1 ) { ag = '242c7a3c0a0a3c7801028b77d9d75601'; }
                //		else if (acgrp.indexOf('EU.GSC.ES.')   > -1 ) { ag = '23d139b20a0a3c780070b3565e51cb2e'; }
                //		else if (acgrp.indexOf('EU.GSC.CH.')   > -1 ) { ag = '23b6553d0a0a3c780054c964919e6921'; }
                //		else if (acgrp.indexOf('SS.GDC2.SD')   > -1 ) { ag = '511f0e41db050bc046d038fb7c961982'; acgrp = 'SS.GDC2.SD'; }
                //		else if (acgrp.indexOf('SS.GDC1.SD')   > -1 ) { ag = '551f0e41db050bc046d038fb7c961980'; acgrp = 'SS.GDC1.SD'; }
                //        else if (acgrp.indexOf('EU.DE.')       > -1 ) { ag = '41249cfc0ff6fa488f4a7e5ce1050ef1'; acgrp = 'EU.DE.All.BER.SD';  }
                //		else if (acgrp.indexOf('.Monitoring.') > -1 ) { ag = '31b66dfb0a0a3c780063e8ee2196d023'; }   //  EU.GSC.Monitoring.Closure
                //		else if (acgrp.indexOf('.ServiceDesk') <  0 ) { ag = '23a813c80a0a3c78013368c66335c0cc'; acgrp = 'EU.BE.ServiceDesk'; }
                //
                //        if (acgrp.indexOf('SS.GDC') === -1 ) {
                //            GM_log('GDC NOT Found! Normal procedure' , acgrp);
                //            acgrp = acgrp + '.Closure';
                //            unsafeWindow.g_form.setValue(script + '.assignment_group', ag );
                //            unsafeWindow.g_form.setValue(script + '.u_accepted', 'Pending');
                //            unsafeWindow.g_form.setValue('sys_display.' + script + '.assignment_group', acgrp);       // First set assignment_group and then sys_display_assignment_group makes service-now go green  happy
                //            unsafeWindow.g_form.setValue('sys_display.' + script + '.assigned_to', '');
                //
                //        } else {
                //            GM_log('GDC Found!!' , acgrp);
                //            alert('This a GDC ticket.\nYou have to close this one yourself\nSelect "Perform administration tasks", Update/Save\nSelect "Set to closed", Update/Save.');
                //        }


                //            if ( Number($('#ni\\.' + script + '\\.u_effortdur_min').val()) > 0 || Number($('#ni\\.' + script + '\\.u_effortdur_hour').val()) > 0 ) {
                //                $('#element\\.' + script + '\\.u_effort').hide();
                //                var gr1 = new GlideRecord('task_time_worked');
                //                gr1.initialize();
                //                if ( $('#sys_display\\.' + script + '\\.u_contract').val() === 'Uncovered base' ) {
                //                    gr1.task = unsafeWindow.window.NOW.sysId;
                //                    gr1.u_activity_type = 'Support remote';
                //                    gr1.time_worked = '1970-01-01 ' + $('#ni\\.' + script + '\\.u_effortdur_hour').val() + ':' + $('#ni\\.' + script + '\\.u_effortdur_min').val() + ':00';
                //                    gr1.u_billable  = 'false';
                //                    gr1.user = unsafeWindow.window.NOW.user_id;
                //                    gr1.insert();
                //                    GM_log('##==##  closequeue workload added as non billable '  + $('#ni\\.' + script + '\\.u_effortdur_hour').val() + ':' + $('#ni\\.' + script + '\\.u_effortdur_min').val() + ':00' );
                //                    unsafeWindow.g_form.setValue('ni.' + script + '.u_effortdur_hour','00');
                //                    unsafeWindow.g_form.setValue('ni.' + script + '.u_effortdur_min','00');
                //                    unsafeWindow.g_form.setValue( script + '.u_effort','');
                //                }
                //                if ( unsafeWindow.globalContext["contract.name"] && (unsafeWindow.globalContext["contract.name"].indexOf('MACD') > -1  || unsafeWindow.globalContext["contract.name"].indexOf('MSEN Request Fulfilment') > -1 )) {
                //                    gr1.task = unsafeWindow.window.NOW.sysId;
                //                    gr1.u_activity_type = 'Support remote';
                //                    gr1.time_worked = '1970-01-01 ' + $('#ni\\.' + script + '\\.u_effortdur_hour').val() + ':' + $('#ni\\.' + script + '\\.u_effortdur_min').val() + ':00';
                //                    gr1.u_approved = 'Approve';
                //                    gr1.user = unsafeWindow.window.NOW.user_id;
                //                    gr1.insert();
                //                    unsafeWindow.g_form.setValue('ni.' + script + '.u_effortdur_hour','00');
                //                    unsafeWindow.g_form.setValue('ni.' + script + '.u_effortdur_min','00');
                //                    unsafeWindow.g_form.setValue( script + '.u_effort','');
                //                }
                //            }

                // adding work note to indicate record was checked for compliancy

                //       unsafeWindow.g_form.setValue( script + '.work_notes','[code]<div class="notification notification-info">Mandatory fields checked by ITSM+ version: ' + scriptversion + '<P> &nbsp; </P><SUB>CI model<BR>Classification<BR>Technology<BR>Resolution code<BR>Closure notes<BR>Root cause comment<BR>Resolved by<BR>Workload non-billable</SUP></div>[/code]');


                //	if ( st === 'OK' ) 	   $('#sysverb_update_and_stay')[0].click();		//  Update ticket sysverb_update_and_stay
                //	if ( st === 'UPDATE' ) $('#sysverb_update')[0].click();	    			//  Update ticket sysverb_update
                //}
            }

            function  check4change(event) {
                GM_log('##==#=#  change detector ' , hop( event.target ).replace(/\n/g,'  ') );
                if ( event.target.nodeName === 'INPUT' &&  event.target.id.indexOf(script) > -1 ) mandatory_fields();
            }



            function dingdong(me) {
                //    var p = Number($('#' + script + '\\.u_next_step_displayed option:selected').val());
                //    GM_log('#=#=#=#  Button becomes visible if ' + p  + ' in ' + ok2close );                                                                                     //  130    Set to resolved
                //
                //    if ( ok2close.indexOf(p) > 0 ) {
                //
                //		ClosingCase = true;
                //		GM_log('#=#=#=#  ClosingCase = true' );
                //		$('select'  ).on('change', 			function(event) { check4change(event); });
                //		$('input'   ).on('change keypress', function(event) { check4change(event); });
                //		$('textarea').on('change keypress', function(event) { check4change(event); });
                //		$('input#sys_display\\.' + script + '\\.u_task_resolution_code').blur(mandatory_fields).change(mandatory_fields);
                //		$('input#sys_display\\.' + script + '\\.u_task_rootcause      ').blur(mandatory_fields).change(mandatory_fields);
                //		$('input#sys_display\\.' + script + '\\.u_technology          ').blur(mandatory_fields).change(mandatory_fields);
                //		$('input#sys_display\\.' + script + '\\.u_product             ').blur(mandatory_fields).change(mandatory_fields);
                //		$('input#sys_display\\.' + script + '\\.u_classification      ').blur(mandatory_fields).change(mandatory_fields);
                //		$('textarea#'            + script + '\\.close_notes           ').blur(mandatory_fields).change(mandatory_fields);
                //		$('textarea#'            + script + '\\.u_root_cause_comments ').blur(mandatory_fields).change(mandatory_fields);
                //		$('#tabs2_section > span.closdeti > span > span.label_description').attr('id','clodeti');
                //
                //
                //		GM_log('#=#=#=#  Closure fields missing indicator is: ' , $('#clodeti').css('display')  );
                //
                //		var obstarget;
                //		var obsconfig;
                //		if ( $('#clodeti').css('display') !== 'none'  ) {
                //			// Closure Details Tab marker mandatory
                //			$('#tabs2_section > span.closdeti > span')[0].click();   // #tabs2_section > span.tab_header.closdeti > span
                //			// click Closure Details Tab
                //			GM_log('#=#=#=#  Closure Details Tab Clicked ', $('#tabs2_section > span.closdeti > span')[0], $('#tabs2_section > span.closdeti > span').length ,  $('#tabs2_section > span.closdeti > span')[0].length );
                //		} else {
                //			if ( $('div#tabs2_list > span:nth-child(14) > span:nth-child(1) > span:nth-child(1)').css('visibility') === 'visible' ) {
                //				$('div#tabs2_list > span:nth-child(14) > span:nth-child(1)')[0].click();  	// click Workload Tab
                //				document.getElementById("tabs2_list").scrollIntoView( { behavior: "smooth"} );
                //				$('#godown')[0].click();
                //				workloadTabEditing = true;
                //				GM_log('##==#=# workloadTabEditing = true ');
                //
                //			}
                //		}
                //
                //        mandatory_fields();
                //    } else {
                //		ClosingCase = false;
                //		GM_log('#=#=#=#  ClosingCase = false' );
                //		$("#closeq").hide();
                //		$("#closeq2").hide();
                //		$('#l0').removeClass('info_box');
                //		$('.cantclose').removeClass('cantclose');
                //		$('.list_b').removeClass('list_b');
                //		$('.red_td').removeClass('red_td');
                //		$('span.label_description').css('visibility','hidden').css('display','none');
                //		ShowCloseBtns('');
                //	}

            }

            function mandatory_fields() {

                GM_log('##==#=#  mandatory_fields 0' );

                var tit = '';
                sts = 'OK';

                if (ClosingCase) {
                    GM_log('##==#=#  mandatory_fields ClosingCase' );
                    if (wl === 0 && $('#sys_display\\.' + script + '\\.assignment_group') !== 'EU.BE.Operators' ) {
                        tit += '\nWorkload should not be 0';
                        $('#l0').addClass('info_box');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Workload 0 !!' );
                    } else {
                        $('#l0').removeClass('info_box');
                    }
                    if ( $('#tabs2_section > span.closdeti > span > span.label_description').css('display') === 'inline' ) {     // closure_details.css('visibility'), closure_details.hasClass('mandatory')
                        tit +=  '\nClosure fields are not filled out!';
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Closure fields !!', $('#tabs2_section > span.closdeti > span > span.label_description').length, $('#tabs2_section > span.closdeti > span > span.label_description').css('visibility') , $('#tabs2_section > span.closdeti > span > span.label_description').css('display') );
                    } else {
                        if (remarks !== '') {
                            document.getElementById("tabs2_list").scrollIntoView();
                            GM_log('#=#=#=#  goto workload' );
                        }
                        observer.disconnect();
                        var obstarget = document.querySelector( '#' + script + '\\.task_time_worked\\.task_table');
                        var obsconfig = { attributes: true, childList: true, characterData: true, subtree: true };
                        GM_log('##==#=#  observer watch #' + script + '\\.task_time_worked\\.task_table' );
                    }

                    if ($('#sys_display\\.' + script + '\\.u_product').val() === '') {
                        $('#status\\.' + script + '\\.u_product').addClass('mandatory').removeClass('changed');
                        tit += '\nCI Model not filled out!';
                        $('#sys_display\\.' + script + '\\.u_product').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields CI Model !!' );
                    } else {
                        $('#sys_display\\.' + script + '\\.u_product').removeClass('cantclose');
                        $('#status\\.' + script + '\\.u_product').addClass('changed').removeClass('mandatory');
                    }

                    $('#tabs2_section > span.closdeti > span > span.label_description').css('display','none').css('visibility','hidden');
                    if ($('#sys_display\\.' + script + '\\.u_technology').val() === '') {
                        tit += '\nTechnology not filled out!';
                        $('#sys_display\\.' + script + '\\.u_technology').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Technology !!' );
                        $('#tabs2_section > span.closdeti > span > span.label_description').css('display','inline').css('visibility','visible');
                        $('div#tabs2_section > span.closdeti > span')[0].click();
                    }

                    if ($('#sys_display\\.' + script + '\\.u_task_resolution_code').val() === '') {
                        tit += '\nResolution code not filled out!';
                        $('#sys_display\\.' + script + '\\.u_task_resolution_code').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Resolution code !!' );
                    }
                    if ($('#' + script + '\\.close_notes').val() === '') {
                        tit += '\nClosure notes not filled out!';
                        $('#' + script + '\\.close_notes').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields close_notes !!' );
                    }
                    if ($('#' + script + '\\.u_root_cause_comments').val() === '') {
                        tit += '\nRoot Cause comments not filled out!';
                        $('#' + script + '\\.u_root_cause_comments').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields u_root_cause_comments !!' );
                    }
                    if ($('#sys_display\\.' + script + '\\.u_task_rootcause').val() === '') {
                        tit += '\nRoot Cause not filled out!';
                        $('#sys_display\\.' + script + '\\.u_task_rootcause').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Root cause !!' );
                    }

                    if ($('#sys_display\\.' + script + '\\.u_classification').val() === '') {
                        $('#status\\.' + script + '\\.u_classification').addClass('mandatory').removeClass('changed');
                        tit += '\nClassification not filled out!';
                        $('#sys_display\\.' + script + '\\.u_classification').addClass('cantclose');
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields Classification !!' );
                    } else {
                        $('#sys_display\\.' + script + '\\.u_classification').removeClass('cantclose');
                        $('#status\\.' + script + '\\.u_classification').addClass('changed').removeClass('mandatory');
                    }

                    if ( Assignee !== '' && Assignee !== unsafeWindow.g_form.getValue('sys_display.' + script + '.u_resolved_by').toString() && $('#me').length === 0 ) {
                        GM_log('#=#=#=#  Resolvedby != Assignee', Assignee, unsafeWindow.g_form.getValue('sys_display.' + script + '.u_resolved_by').toString() );
                        $('#view\\.' + script + '\\.u_resolved_by').addClass('cantclose').after(' <a><img src=images/green_back.gifx id="me" /></a>'); // .css('cursor','pointer')
                        $('#me').on('click', function() {
                            unsafeWindow.g_form.setValue(script + '.u_resolved_by', unsafeWindow.g_form.getValue(script + '.assigned_to') );
                            unsafeWindow.g_form.setValue('sys_display.' + script + '.u_resolved_by', Assignee);
                            $('#sys_display\\.' + script + '\\.u_resolved_by').css('background-color','initial');
                        });
                    }
                    if ( $('#tabs2_list > span:nth-child(14) > span.label_description').css('visibility') === 'visible' ) {   // #tabs2_list > span:nth-child(14) > span > span.label_description   !! h3.tab_header
                        sts = 'NOK';
                        GM_log('##==#=#  mandatory_fields NOK!' );
                        $('#godown')[0].click();
                    }

                }
                ShowCloseBtns(tit);

            }

            function ShowCloseBtns(tit) {
                //		GM_log('##==#=#  ShowCloseBtns '  +  sts  + ' , ' + tit );
                //
                //		if (ClosingCase) {
                //			$('#ag-lst').show().removeClass('cantclose').css('padding','initial');
                //            // are the values below zero?
                //            if ( $('#sys_display\\.' + script + '\\.u_contract').val() === 'Uncovered base' ) {
                //                $('#element\\.' + script + '\\.u_effort').hide();
                //            }
                //			if (sts == 'NOK') {
                //				tit = 'You cannot reassign to closure queue because:' + tit;
                //				$('#closeq img:first-child').attr('src','/images/issues.gifx').attr('title', tit ).css('width','14px').css('height','14px');
                //				$('#closeq').show();
                //				$("#closeq2").hide();
                //                $('#ag-lst').css('padding', '0px 10px 0px 10px').addClass('cantclose');
                //				$('tr#element\\.' + script + '\\.assignment_group').addClass('cantclose');
                //				$('td#label\\.'   + script + '\\.assignment_group').addClass('cantclose');
                //				$("#closeq" ).on('click', function() { closequeue('NOK'); } );
                //			} else {
                //				$('#closeq  img:first-child').attr('title','Reassign to closure queue and SAVE.').attr('src','/images/request_completed.gifx').css('width','14px').css('height','14px');
                //				$('#closeq2 img:first-child').attr('title','Reassign to closure queue and UPDATE.').css('width','14px').css('height','14px');
                //				$('#closeq').show();
                //				$('#closeq2').show();
                //				$("#closeq" ).on('click', function() { closequeue('OK'); } );
                //				$('#closeq2').on('click', function() { closequeue('UPDATE'); } );
                //			    $('.cantclose').removeClass('cantclose');
                //                smoothScrollIntoView('ag-lst');
                //
                //
                //			}
                //		} else {
                //			$("#closeq").hide();
                //			$("#closeq2").hide();
                //            $('#ag-lst').hide();
                //			$('.cantclose').removeClass('cantclose');
                //			$('.list_b').removeClass('list_b');
                //			$('.red_td').removeClass('red_td');
                //            $('#element\\.' + script + '\\.u_effort').show();
                //		}
            }


            function  dingdong2() {
                var p = Number($('#' + script + '\\.u_accepted option:selected').val());
                GM_log('#=#=#=#  Reject action if ' + p  + ' = 2 '); // 2 = Rejected
                if ( p == 2 ) {
                    var ag = '';
                    GM_log('#=#=#=#  reject action for ' , country);
                    if (!country || country === '' ) country = 'BE';
                    acgrp = unsafeWindow.g_form.getValue('sys_display.' + script + '.u_owner_group');
                    if      (acgrp.indexOf('BE.RSO.SD')    > -1 ) { ag = '6797e9920fecae44990f55d003050e59'; }   //  EU.BE.RSO.SD.Action
                    else if (acgrp.indexOf('EU.MSC.TSD')   > -1 ) { ag = 'df6110d4dbed078870da38fb7c9619d6'; acgrp = 'EU.MSC.TSD.NI.L1';  }
                    //			else if (acgrp.indexOf('EU.MSC.TSD')   > -1 ) { ag = 'd89975e4dbe58f88f2127b5a8c9619d5'; acgrp = 'EU.MSC.TSDAction';  }   //  EU.MSC.TSD.Action
                    else if (acgrp.indexOf('SS.GDC2.SD')   > -1 ) { ag = '511f0e41db050bc046d038fb7c961982'; acgrp = 'SS.GDC2.SD'; }
                    else if (acgrp.indexOf('SS.GDC1.SD')   > -1 ) { ag = '551f0e41db050bc046d038fb7c961980'; acgrp = 'SS.GDC1.SD'; }
                    unsafeWindow.g_form.setValue(script + '.assignment_group', ag );
                    unsafeWindow.g_form.setValue('sys_display.' + script + '.assignment_group', acgrp);       // First set assignment_group and then sys_display_assignment_group makes service-now go green  happy
                    unsafeWindow.g_form.setValue('sys_display.' + script + '.assigned_to', '');

                    GM_log('#=#=#=#  Reject reason ' + $('select#' + script + '\\.u_redirect_reason').val() );   // u_request.u_redirect_reason #u_request\.u_redirect_reason
                    unsafeWindow.g_form.setValue(script + '.u_redirect_reason','Incorrectly assigned');
                    setTimeout( function() {
                        unsafeWindow.g_form.setValue(script + '.u_redirect_reason','Incorrectly assigned');
                    }, 2000);
                }
            }

            function wim0_f( tab , txt) {
                //        GM_log('#=#=#=#  wim0_f ' + tab + ' '+ txt );

                dt = new Date();
                rnow = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();
                var rtime = dt.getHours() + ':' + dt.getMinutes();

                if (tab == 'comments') {
                    cur = $('#' + script + '\\.comments').val();
                } else if ( tab == 'notes') {
                    cur = $('#' + script + '\\.work_notes').val();
                }
                GM_log('#=#=#=#  wim0_f ' + tab + ' '+ txt + ' cur= ' + cur );
                t_arr = txt.split('\n');

                var p = 0;
                for (i = 0; i < t_arr.length; i++) {
                    if ( p < t_arr[i].length ) { p = t_arr[i].length; }
                }

                sep1 = Array(p + 2).join("=");
                sep2 = Array(p + 2).join("/");
                sep3 = Array(p + 2).join("_");

                if ( cur !== '' ) { txt = cur + '\n' + txt; }


                txt = replacer(txt);
                if (tab == 'comments') {
                    $('#' + script + '\\.comments').val(txt);
                    $('textarea#activity-stream-comments-textarea').val(txt);
                } else if (tab == 'notes' ) {
                    $('#' + script + '\\.work_notes').val(txt);
                    $('textarea#activity-stream-work_notes-textarea').val(txt);
                }

                $('#wims1').val('0');
                $('#wims2').val('0');
                $('#wims3').val('0');
                $('#wims4').val('0');
                $('#wims5').val('0');
                $('#wims6').val('0');
                $('#wims7').val('0');
                $('#wims8').val('0');
            }

            function wims_f( f ,p) {
                GM_log('#=#=#=#  wims ' + f + ' '+ p );
                if ( f == 1 ) {
                    tab = 'comments';
                } else if ( f == 2 ) {
                    tab = 'notes';
                }
                //	    var opt = $('#wims').val();
                if ( p > 0 ) {
                    wim0_f( tab , ACT_text[p] );
                }
            }

            function wim1_f() {
                wim0_f(BTN1_text);
            }

            function wim2_f() {
                wim0_f(BTN2_text);
            }

            function wim3_f() {
                wim0_f(BTN3_text);
            }


            function vndrmail(e) {
                e = e.replace('Mail ','');
                wim0_f('comments', 'NTT {sa} {dt} {tm} Mail send to ' +  e + '\n{sp=}\n\n');
            }

            function phonecall(e) {
                GM_log('#=#=#=#  phonecall ' + e );
                var CalledP = '';
                var phnpop_timer;
                if ( e.indexOf(' on ') > -1 ) { CalledP = e.split(' on ')[0]; }
                //		if ( e === '' ) { }
                e = e.replace('Call ','');
                wim0_f('comments', 'NTT {sa} {dt} {tm} Call made to ' +  e + '\n{sp=}\n\n');
                $('#showpic').show().attr('tabindex','0').addClass('mypopup').css('top','550px').css('left','250px').html('<a id="clsshowpic" style="float:right;"><span id="Closeswow" class="sprite1 close-button"></span></a><p>Choose an option below:  &nbsp;  <p><ul><li id=noans><a>No answer.</a></li><li id=voicem><a>Voice mail.</a></li><li id=person><a>Spoke to someone.</a></li></ul><p>&nbsp;</p>');
                setTimeout(function() {
                    $('#showpic').focus();
                },6000 );
                $('#showpic').blur( function() {
                    GM_log('# popup focus lost, time 4 sec');
                    phnpop_timer = setTimeout(function() {
                        $('#showpic').fadeOut(3000);
                    },20000 );
                });
                $('#showpic').focus(function() {
                    GM_log('# popup focus clear timer');
                    $('#showpic').show();
                    clearTimeout( phnpop_timer );
                });
                $('#noans').click( function() {
                    $('#showpic').hide();
                    wim0_f('comments', 'No Answer.\n\n');
                    $('#' + script + '\\.comments').focus();
                });
                $('#voicem').click( function() {
                    $('#showpic').hide();
                    wim0_f('comments', 'Left a voice-mail requesting  .');
                    $('#' + script + '\\.comments').focus();
                });
                $('#person').click( function() {
                    $('#showpic').hide();
                    wim0_f('comments', 'Spoke to ' + CalledP.substr(5) + ' and discussed   .');
                    $('#' + script + '\\.comments').focus();
                });
                $('#clsshowpic').click( function() { $('#showpic').hide(); });
            }

            function other_tab_clicked(e) {
                GM_log( '#> other tab clicked' , $(e.target).text() );
                GM_setValue('activetab', $(e.target).text() ); // .replace('*','')
                $('.tabs2_section.mytab').hide();
                var activetab = $('span.tab_caption_text:contains(' + $(e.target).text() + ')').parent();
                nicetab(activetab);
            }

            function serialsearch(lookfor){
                var it = $('#element\\.' + script + '\\.comments\\.additional').html();   // Table with all comments
                var regex = /(<([^>]+)>)/ig;
                it = it.replace(/<br\>/g,'\n').replace(regex, " ");
                var lines = it.split(/(\s+)/);
                lines = it.split('\n');
                var watch = '' ;
                var t     = 0  ;
                while ( t  < lines.length -1 ) {
                    if (lookfor === 'ser' ) {
                        if ( lines[t].toUpperCase().indexOf('S/N')           > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SERIAL')        > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SER#')          > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('PAK')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SR:')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SR :')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SN:')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SN :')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SR#')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SR #')			 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SERIALNUMBER')  > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SERIAL_NUMBER') > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SERIENUMMER')	 > -1 ) { watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SERIE')		 > -1 ) { watch += lines[t]  + '\n'; }
                    }
                    if (lookfor === 'prod' ) {
                        if ( lines[t].toUpperCase().indexOf('HARDWARE') > -1 )		{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('MODEL') > -1 )			{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('TYPE')  > -1 )			{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('PRODUCT')  > -1 )		{ watch += lines[t]  + '\n'; }
                    }
                    if (lookfor === 'ver' ) {
                        if ( lines[t].toUpperCase().indexOf('VERSION') > -1 )		{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SOFTWARE')  > -1 )		{ watch += lines[t]  + '\n'; }
                    }
                    if (lookfor === 'cont' ) {
                        if ( lines[t].toUpperCase().indexOf('CONTRACT') > -1 )		{ watch += lines[t]  + '\n'; }
                    }
                    if (lookfor === 'vendor' ) {
                        if ( lines[t].toUpperCase().indexOf('VENDOR') > -1 )		{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('SUPPLIER') > -1 )		{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('LEVERANCIER') > -1 )	{ watch += lines[t]  + '\n'; }
                        if ( lines[t].toUpperCase().indexOf('FOURNISSEUR') > -1 )	{ watch += lines[t]  + '\n'; }
                    }
                    t++;
                }
                return watch;
            }


            function tabs_test(tab_cap,color) {
                GM_log('#=#=# Tab adding ' + tab_cap  );
                var clr = '';
                if (color == 1) { clr = 'changed'            ; }             // #0C0
                if (color == 2) { clr = 'read_only'          ; }             // #FFA500
                if (color == 3) { clr = 'mandatory'          ; }             // #E11A2C
                if (color == 4) { clr = 'mandatory_populated'; }             //
                if (color == 5) { clr = 'foreign'            ; }             //
                if (color == 6) { clr = 'itsm'               ; }             // #00BFFF

                var def_mesg = '<p><h2>Nothing usefull in here yet (' + tab_cap + ')</h2></p>';



                if ( tab_cap === 'ITSM+' ) {

                    if ( bgcolor  ) { GM_log('#===# bgc '  , bgcolor);  } else { bgcolor  = '#FFFFFF'; }
                    if ( txtcolor ) { GM_log('#===# txtc ' , txtcolor); } else { txtcolor = '#000000'; }

                    var epxstate = GM_getValue('hideexpstuff',1) === 1 ? 'checked' : '';
                    var experimental = unsafeWindow.window.NOW.user_id.indexOf('cacaedfc0 ') > -1 ? ' &nbsp; &nbsp; <input name=hideexpstuff class="tabchk" type=checkbox ' + epxstate + ' title="Show/Hide Experimental Tabs."/> Hide Experimental Tabs.' : '';
                    var hidestuffstate = ( GM_getValue('hidestuff') === 'off' ) ? ' ' : 'checked' ;
                    GM_log('# hidestuff  ' , GM_getValue('hidestuff') , hidestuffstate);

                    achach = info[4] ? info[4] : '';
                    GM_addStyle(' .my-form { width:250px; } ');
                    def_mesg = `<table width="100%"><tbody><tr><td width="50%" valign="top"><p><br>
<h4>Follow ITSM+ news and comments on Yammer</h4><hr><p>
<p>If you would like to discuss ITSM+, have a question or if you notice a bug, please join me on the
<a href="https://www.yammer.com/dimensiondata.com/#/threads/inGroup?type=in_group&feedId=13943584" target="_new" class=redlink><img width=16 height=16 src=` + GM_getResourceURL("yammer") + `> &nbsp; ITSM+ Yammer Group</a>. <p><p>
<hr><h4>The ITSM+ scripts that are available now :</h4>
<hr><p><ul><font class=redlink>\
<li><a class=redlink target="_blank" href="https://greasyfork.org/scripts/26921-itsm/code/ITSM+.user.js" title=" Send ITSM mails using outlook, Color your tasklist based on running SLA/OLA, and much more. ">ITSM+ script.</a></li>\
<li><a class=redlink target="_blank" href="https://greasyfork.org/en/scripts/10603-themes/code/ITSM%20themes.user.js" title=" ITSM themes script. ">Tired of ITSM's grey on white?</a></li>\
</font></ul><p>Click the script name to install it<p> <hr>
</td><td valign="top"><p><br><h4>Do you want to help?</h4><hr><p>\
What I need is: <ul><li>The url that will take me to the page for the vendor where we can create a new case.</li>\
<li>I need the url of the page(s) where we can fill the various parameters for the case.</li>\
<li>I need the url of the page where we receive the actual case number( and url).</li>\
<li>If possible for each of these pages a \'File -> Save Page As, Type: Web Page, complete\' </li>\
<li>Save me this in an archive and send it to <a href="mailto://michel.hegeraat@global.ntt&subject=URL\'s and pages for vendor:" class=redlink> me </a>.</li><ul>\
<p>&nbsp;</p>
<a class=redlink href="https://nttlimited.sharepoint.com/teams/gtvd4/services/MS/Support/Lists/Spare%20Stock/All%20for%20request.aspx"> Spare stock on sharepoint </a>
<p>&nbsp;</p>
<a class=redlink href="https://cway.cisco.com/sncheck/"> Cisco device coverage </a>	&nbsp;</td></tr>
</tbody></table>
<p>&nbsp<p>\
`;
                }


                if ( tab_cap === 'Tab_2' ) {
                    def_mesg = `<p>&nbsp;</p>
<a id="tab_alert"     class="mybut"><span>Start alert </span></a> &nbsp;
<a id="tab_alert_stp" class="mybut"><span>Stop alert  </span></a> &nbsp;
<a id="t:test:what" class="mybut"><span>Testing  </span></a> &nbsp; <p>&nbsp; <p>&nbsp;</p>
<a id="newtpcase"     class="mybut"><span>newcase     </span></a> &nbsp;
<a id="addcmt2case"   class="mybut"><span>AddComment  </span></a>
<a id="man_age"        class="mybut"><span>Jump to manage</span></a>

<p>&nbsp;</p><hr><p>&nbsp;</p>&nbsp;<p>&nbsp;</p>
<a id="comchk"   class="mybut"><span>Run comm. check </span></a>
`;
                }

                if ( tab_cap === 'Tab_3' ) {
                    def_mesg = '<p><a href="tel:00479982267">call me</a><p><a href="tel:+32479982267">call me2</a><p><textarea id=phpbbarea1 rows=5 cols=120></textarea><hr><p><a id=phpbb1 class="mybut"><span>Get Forum entry</span></a> <a id=phpbb2 class="mybut"><span>Get Forum entry2</span></a><p><textarea id=phpbbarea2 rows=5 cols=120></textarea><hr>';
                }

                if ( tab_cap === 'Tab_4' ) {
                    def_mesg = `<table><tr><td><div id=test123 class=faketextarea contenteditable>Normal text <br><span style="color:red;">Testing red text</span> <br>Normal text <br><span style="color:blue;">Testing blue text</span> </div></td>\
<td><textarea id=area3 rows=5 cols=80></textarea></td></tr>\
<tr><td><a id="clickme" class="mybut"><span>Click me </span></a> &nbsp; <a id="clickme1" class="mybut"><span>Click me 1</span></a> &nbsp; <a id="clickme2" class="mybut"><span>Click me 2</span></a></td></tr></table>`;

                }

                var xmlurl  = '';
                var xmltab  = '';
                var xmltab1 = '';
                var xmldata = '';
                if ( tab_cap === 'Tab_5+' ) {
                    xmltab  = $('table#' + script + '\\.task_time_worked\\.task_table').attr('glide_list_query');
                    xmltab1 = $('table#' + script + '\\.task_time_worked\\.task_table  >  tbody:nth-child(2) >  tr:nth-child(1)').attr('sys_id');
                    xmldata = 'sysparm_processor=com.glide.ui_list_edit.AJAXListEdit&sysparm_type=set_value&sysparm_table=task_time_worked&sysparm_first_field=task_time_worked.u_number&sysparm_omit_links=&sysparm_xml=';
                    xmldata += encodeURI('<record_update table="task_time_worked" field="task" query="' + xmltab + '"><record sys_id="' + xmltab1 + '" operation="update"><field name="u_billable" modified="true" value_set="true" dsp_set="false"><value>true</value></field></record></record_update>').replace(/=/g,'%3D').replace(/\//g,'%2F');
                    xmldata += '&ni.nolog.x_referer=ignore';
                    xmldata += '&x_referer=u_request.do%3Fsys_id%3D' + xmltab1 + '%26sysparm_record_target%3Dtask%26sysparm_record_row%3D2%26sysparm_record_rows%3D2%26sysparm_record_list%3Dactive%253Dtrue%255Eassigned_to%253Djavascript%253AgetMyAssignments%2528%2529%255Esys_domain_number%2521%253D0%255Eu_service_centreIN0b37a5356fcf8d406c265ebd5d3ee462%255EORu_service_centreISEMPTY%255EORassignment_group%253Djavascript%253AgetMyGroups%2528%2529%255EORu_responsible_owner_group%253Djavascript%253AgetMyGroups%2528%2529%255EORu_owner_group%253Djavascript%253AgetMyGroups%2528%2529%255EORDERBYDESCsys_updated_on';
                    def_mesg = `<p><a href="tel:00479982267">call me</a><p><a href="tel:+32479982267">call me2</a><p> &nbsp; </p>\
<span class="input-group"><input type="text" class="form-control text-align-right-ltr element_reference_input" id="my_eta_dt" data-type="glide_element_date_time" data-ref="my_eta_dt" name="my_eta_dt" value="" style="width:250px;">
<a class="btn btn-default btn-ref date_time_trigger" name="my_eta_dt" id="my_eta_dt" tabindex="-1" data-type="date_time" data-ref="my_eta_dt" href="javascript:void(0)" role="button" title="" data-date_time_format="dd-MMM-yyyy HH:mm:ss" data-original-title="Select date and time" style="height:16px !important;width:16px !important;"><span class="icon-calendar icon" aria-hidden="true"></span><span class="sr-only">Select date and time</span></a></span>
<p><textarea id=area1 rows=7 cols=120 style="height: initial;max-height: unset;"></textarea><hr><p>\
<a id=xmlpost class="mybut"><span>XML post test</span></a> \
<a id=xmlhop class="mybut"><span>We zien wel</span></a> \
<a id=xml2get class="mybut"><span>Get</span></a>\
<p><textarea id=area2 rows=15 cols=120 style="height: initial;max-height: unset;"></textarea><p>\
<table><tr><td>Prefill: &nbsp; </td><td colspan=12> &nbsp;  <input list="tbllst" id=grtbl value="" />
<datalist id=tbllst>
<option value="task_time_worked;task;1"       >  task_time_worked    </option>
<option value="u_ext_ref_no;u_task;1"         >  u_ext_ref_no        </option>
<option value="task_sla;task;1"               >  task_sla            </option>
<option value="u_request;sys_id;1"            >  u_request           </option>
<option value="incident;sys_id;1"             >  incident            </option>
<option value="task_ci;task;3"                >  task_ci             </option>
<option value="cmdb_ci;sys_id;3"              >  cmdb_ci             </option>
<option value="sys_user;sys_id;2"             >  sys_user            </option>
<option value="core_company;sys_id;4"         >  core_company        </option>
<option value="contract_rel_ci;ci_item;3"     >  contract_rel_ci     </option>
<option value=""                              >  sys_journal_field   </option>
<option value="sys_attachment;table_sys_id;1" >  sys_attachment      </option>
<option value="contract;u_company;4"          >  contract all        </option>
</datalist></td></tr>
<tr><td colspan=12> &nbsp; </td></tr>
<tr><td> Table: &nbsp; </td><td> &nbsp; <input id=glidetbl />  &nbsp; </td><td> &nbsp; SearchField: &nbsp;</td><td>&nbsp; <input id=glidefld value="" /> &nbsp; : &nbsp;  &nbsp; </td><td> &nbsp;
<input id=glidesid size=35 value="` + unsafeWindow.NOW.sysId + `"/>  </td></tr>
<tr><td colspan=12> &nbsp; </td></tr>
<tr><td>  &nbsp;Condition </td><td> &nbsp; <input id=cond_fld /> &nbsp; </td><td> = </td><td> &nbsp; <input id=cond_val />  </td></tr>
<tr><td colspan=12> &nbsp; </td></tr>
<tr><td> &nbsp; <a id=gld5 class="mybut"><span> Query </span></a></td>
</tr></table>
<p><hr><p>&nbsp;<p><a id="serialsearch" class="mybut"><span>test button</span></a><p>&nbsp;<p><a id="addstuFf" class="mybut"><span>test button2</span></a> &nbsp; &nbsp; &nbsp; &nbsp;<a id="journal" class="mybut"><span>Journal</span></a> &nbsp; &nbsp; &nbsp; &nbsp;<a id="journal1" class="mybut"><span>Journal Ins</span></a><p>\
<span class="sprite1 button1"></span><span id="btnclk" class="sprite1 button2"></span><span id="btnclk2" class="icon-tree"></span> &nbsp; <span id="btnclk3"></span>\
<p><a id="tpcasefix" class="mybut"><span>button3</span></a><a id="tpcaseclosed" class="mybut"><span>button4</span></a><p>\
<img id="replaceme" src="contract1.png" />\
<p>\
<span> unsafeWindow.NOW.user.userID = ` +  unsafeWindow.NOW.user.userID  + '<br>g_lang =' +  unsafeWindow.g_lang  + '<br>window.user_display_name  =' +  unsafeWindow.NOW.user_display_name   + `</span>\
`;
                }

                if ( tab_cap === 'RMA') {
                    achach = info[4] ? info[4] : '';
                    GM_addStyle(' .my-form { width:250px; } ');

                    GM_log('#=#= how many RMA? ' , rma_lijst.length);
                    if ( rma_lijst.length > 0 ) {

                        if ( rma_number === '<ITSM_EXTREF_RMA + ITSM_EXTREF_THIRDPARTY>' ) { clr = 'changed'; } else {  clr = 'mandatory'; } // clr = 'foreign';

                        def_mesg = '';
                        if ( rmalinks !== '' ) { def_mesg = '<p>' + rmalinks + '<p> &nbsp; </p>'; } else { def_mesg = ''; }

                        var note = '';
                        var product = ( $('input#' + script + '\\.u_custom_text_3').val().split(';')[0] !== '' ) ? $('input#' + script + '\\.u_custom_text_3').val().split(';')[0] : ( $('#sys_display\\.' + script + '\\.u_product').val().indexOf('VIRT') == -1 ) ? $('#sys_display\\.' + script + '\\.u_product').val() : '' ;
                        if ( $('input#' + script + '\\.u_custom_text_3').val().split(';')[2] ) {
                            GM_log('# Stored serial  =  ',  $('input#' + script + '\\.u_custom_text_3').val().split(';')[2] );
                            serial_number =  ( serial_number.indexOf('ITSM_') != -1 ) ? $('input#' + script + '\\.u_custom_text_3').val().split(';')[2] : serial_number ;
                        }
                        for (i=0;i<rma_lijst.length;i++) {

                            var RMArec = '';
                            if ( $('#element\\.' + script + '\\.work_notes\\.additional').find('div > span > span:contains("=== RMA REQUEST ' + rma_lijst[i][0] + '")').length > 0 ) {
                                RMArec = $('#element\\.' + script + '\\.work_notes\\.additional').find('div > span:contains("=== RMA REQUEST ' + rma_lijst[i][0] + '")').html();
                                clr = 'changed';
                            }

                            def_mesg = def_mesg + '<p style="color:red">' + note + '</p><p><table><tr><td><pre><div id="rmaarea' + i + '" style="font-family:monospace;width:690px;height:280px;" class=faketextarea contenteditable>';
                            if (client_ref === '') client_ref = '<ITSM_EXTREF_CLIENTREFNUM>';
                            var def_mesg_txt = `\
\nIncident Number                      : ` + casenr + `\
\nCustomer name                        : ` + $('#' + script + '\\.company_label').val() + `\
\nSite                                 : ` + $('#sys_display\\.' + script + '\\.location').val() + `\
\nCustomer name                        : ` + $('#sys_display\\.' + script + '\\.u_caller').val() + `\
\nCustomer Intervention                : ` + client_ref.replace('Customer Reference: ','').replace('\n\n','') + `\
\nProduct Family                       : ` + rma_lijst[i][1] + `\
\nProduct Code                         : ` + product + `\
\nDefect Serial Number                 : ` + serial_number + `\
\nShort problem description            : ` + $('#' + script + '\\.short_description').val() + `\
\nRMA number                           : ` + rma_lijst[i][0] + `\
\nRMA creation date                    : ` + rma_lijst[i][2] + `\n\
\nDirectly delivered to customer       : <MANUAL INPUT>\
\nNew Serial Number (if already known) : <MANUAL INPUT>\n\
\nMore details if necessary/relevant   : <MANUAL INPUT>\n`;

                            def_mesg_txt = def_mesg_txt.replace('<ITSM_CIMODEL_MANUFACT>','<span style="color:red;">&lt;ITSM_CIMODEL_MANUFACT&gt;</span>');
                            def_mesg_txt = def_mesg_txt.replace('<ITSM_EXTREF_CLIENTREFNUM>','<span style="color:red;">&lt;ITSM_EXTREF_CLIENTREFNUM&gt;</span>');
                            def_mesg_txt = def_mesg_txt.replace('<ITSM_CI_SN>','<span style="color:red;">&lt;ITSM_CI_SN&gt;</span>');
                            def_mesg_txt = def_mesg_txt.replace(/<MANUAL INPUT>/g,'<span style="color:red;">&lt;MANUAL INPUT&gt;</span>');

                            if ( RMArec === '') {
                                def_mesg = def_mesg + def_mesg_txt.replace('\n\n','<p>').replace('\n','<br>') + '</div></pre></td><td>&nbsp;</td></table> <hr><p><a id="rmahop_' + i.toString() + '" class="mybut"><span>Send RMA ' + rma_lijst[i][0] + '</span></a><hr>';
                            } else {
                                def_mesg = def_mesg + RMArec  + '</div></pre></td><td>&nbsp;</td></table> <hr><p>';
                            }
                        }
                    } else {
                        clr = '';
                    }
                }

                if ( tab_cap === 'NEW') {
                    achach = info[4] ? info[4] : '';
                    if (ITSI_ticketNR.length==10 && ITSI_AllDone == 0) achach='';

                    //                                        <option value="ALE Rainbow">ale rainbow</option>
                    //            <a class="mybut tplink" target="_blank" href="https://support.openrainbow.com/hc/en-us"														>ALE Rainbow</a>\

                    def_mesg = `<table id=glidesubmit style="width:100%;border-collapse:initial;border-spacing:5px;border:0px solid black;" >
<tr id=ln0><td colspan=5> &nbsp; </td></tr>
<tr id=ln1><td colspan=5>Add a 'Vendor case', RMA, BugID or 'Customer Reference' to your ticket &nbsp; </td></tr>
<tr id=ln1><td colspan=5> &nbsp; </td></tr>
<tr id=ln1><td class=mylbl> &nbsp; Case Nr: &nbsp;</td><td><input class="my-form" id=gr1data></td><td> &nbsp; </td><td> &nbsp; </td><td>Link to the: &quot;add <a class=mybut target=_blank href=/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=` + unsafeWindow.NOW.sysId + `> new </a> &nbsp; external reference&quot; form.</td><td> &nbsp; </td></tr>\
<tr id=ln2><td class=mylbl> &nbsp; URL: &nbsp;</td><td><input class="my-form" id=gr2data></td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td></tr>
<tr id=ln3><td class=mylbl> &nbsp; Vendor: &nbsp;</td><td><input id=gr3data class="my-form" list="vdrlst" value="` + achach  + `"></td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td></tr>\
<datalist id=vdrlst>
<option value="Alcatel-Lucent Enterprise - ALE">alcatel-lucent enterprise - ale</option>
<option value="Checkmk">checkmk</option>
<option value=Avaya>avaya</option>
<option value=Bluecoat>bluecoat</option>
<option value=CA>ca</option>
<option value=Checkpoint>checkpoint</option>
<option value=Cisco>cisco</option>
<option value=EMC>emc</option>
<option value=Evercom>evercom</option>
<option value=F5>f5</option>
<option value=Fortinet>fortinet</option>
<option value=Genesys>genesys</option>
<option value=Infoblox>infoblox</option>
<option value=Nimsoft>nimsoft</option>
<option value=NTT>ntt</option>
<option value=Juniper>juniper</option>
<option value=Pulse Secure>pulse secure</option>
<option value=Riverbed>riverbed</option>
<option value=Splunk>splunk</option>
<option value=Symantec>symantec</option>
</datalist>
<tr id=ln4><td>&nbsp;</td><td><select class="my-form" id=gr4data><option>Vendor Case<option>Vendor RMA<option>Customer reference<option>Vendor BugID/Defect Ref</select></td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td></tr>\
<tr id=ln5><td colspan=5> &nbsp; </td></tr>
<tr><td>&nbsp;</td><td><a id=grsubm class=mybut>Go</a> &nbsp; <a id=grdel class=mybut>Delete case cookie</a></td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td></tr>\
</table>
<hr><p><h2>Open new TP case with our vendors.</h2><hr><p id=vdrlist style="line-height:35px;white-space:pre-line;">	\
<a class="mybut tplink" target="_blank" href="https://alcatel-lucent-enterprise.secure.force.com/servicerequest/TKT_ServiceRequest_NewSR"   >Alcatel-Lucent</a>\
<a class="mybut tplink" target="_blank" href="https://support.checkmk.com/servicedesk/customer/portal/2/"									>Checkmk</a>	\
<a class="mybut tplink" target="_blank" href="https://mycase.cloudapps.cisco.com/start"														>Cisco</a>		\
<a class="mybut tplink" target="_blank" href="https://ibpm.cisco.com/rma/home/"																>Cisco RMA</a>	\
<a class="mybut tplink" target="_blank" href="https://support.emc.com/servicecenter/createSR/"												>EMC</a>		\
<a class="mybut tplink" target="_blank" href="https://genesyspartner.force.com/customercare/CustCarePEPremCases"							>Genesys</a> 	\
<a class="mybut tplink" target="_blank" href="https://support.infoblox.com/app/ask"															>Infoblox</a> 	\
<a class="mybut tplink" target="_blank" href="https://support.ca.com/irj/portal/anonymous/newhome"											>Nimsoft</a>	\
<a class="mybut tplink" target="_blank" href="https://support.avaya.com/service-requests/"													>Avaya</a>		\
<a class="mybut tplink" target="_blank" href="https://bto.bluecoat.com/"																	>Bluecoat</a>	\
<a class="mybut tplink" target="_blank" href=https://usercenter.checkpoint.com/usercenter/portal/media-type/html/role/usercenterUser/page/default.psml/js_pane/supportId%2CCreateServiceRequestId >Checkpoint</a> \
<a class="mybut tplink" target="_blank" href=https://websupport.f5.com/casemanager/supportCaseStepOne.do									>F5</a>			\
<a class="mybut tplink" target="_blank" href="https://partners.fortinet.com/FortiPartnerPortal/Application/Redirect.do?oid=4"				>Fortinet</a>	\
<a class="mybut tplink" target="_blank" href="https://casemanager.juniper.net/casemanager/#/create"											>Juniper</a>	\
<a class="mybut tplink" target="_blank" href="https://portal.ntt.eu/angora-cp-gui-eu?action=create-ticket"									>NTT</a>		\
<a class="mybut tplink" target="_blank" href="https://network.nuance.com/portal/server.pt/community/incidents/203/product_support_incidents">Nuance</a>		\
<span class="tplink"> palo alto </span>\
<a class="mybut tplink" target="_blank" href="https://my.pulsesecure.net/members/redirect/?application=casecenter"							>Pulse Secure</a>\
<a class="mybut tplink" target="_blank" href="https://mysymantec.force.com/customer/s/"							                            >Symantec</a>\
<a class="mybut tplink" target="_blank" href="http://eservice.evercom.be/WorkOrder.do"														>Evercom</a>	\
<a class="mybut tplink" target="_blank" href="https://support.westcon.com/sigma/"															>WestconGroup</a>\
<a class="mybut tplink" target="_blank" href="https://support.ca.com/irj/portal/anonymous/newhome"											>CA</a>			\
<a class="mybut tplink" target="_blank" href="https://www.splunk.com/en_us/support-and-services.html"										>Splunk</a>		\
<a class="mybut tplink" target="_blank" href="https://support.riverbed.com/content/support/my_riverbed/cases_and_rmas/create_case.html"		>Riverbed</a>	\
<p> &nbsp; <p><h4>If you click one of these buttons you will be taken to the page where you can log a vendor case.<br>\
At the same time a cookie is placed that will be used to fill in fields in the vendor page.<br>\
The casenumber of the created case is captured and can be made available here and in the external reference page.<br>\
Let me know if it doesn\'t work or if you have something to add.</h4><p> \<p><hr><img id=shhdframe src=/images/section_hide.gifx /><table id=shhd style="display:none;"><tr><td colspan=5><iframe style="width:1200px;height:300px" id="externalref"></iframe></td><tr></table><p>`;

                } //width:100%;border-collapse:initial;border-spacing:5px;border:2px solid black;

                //
                //      Here we insert the TAB
                //
                GM_log('# tezt1 ' , $('#tabs2_section > img:nth-child(2)').length  );
                GM_log('# tezt2 ' , $('#tabs2_section > img:nth-child(3)').length  );
                GM_log('# tezt3 ' , $('#tabs2_section > span:nth-child(5) > span > span.tab_caption_text.noselect').text() , instance );
                if ( instance !== 'sandbox') {
                    GM_log('#=#=#  #tabs2_section > span:nth-child(12) SS');
                    $(`<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0" style=";padding-right:0px;"><span id="` + tab_cap + `" class="` + clr + `"  style="margin-right:2px"><img src="images/s.gifx" alt="" style="width: 4px; height: 12px; margin: 0px;"></img></span><span class="tab_caption_text"> ` + tab_cap + ` &nbsp;</span></span></span>
`).insertBefore( $('div#tabs2_section > span.insertpoint') );
                    GM_log('#=#=#  #tabs2_section > span:nth-child(12) EE');
                } else {
                    GM_log('#=#=#  #tabs2_section > span:nth-child(5) S');
                    $(`<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0" style=";padding-right:0px;"><span id="` + tab_cap + `" class="` + clr + `"  style="margin-right:2px"><img src="images/s.gifx" alt="" style="width: 4px; height: 12px; margin: 0px;"></img></span><span class="tab_caption_text"> ` + tab_cap + ` </span></span></span>
`).insertBefore( $('div#tabs2_section > span:nth-child(5)') );
                    GM_log('#=#=#  #tabs2_section > span:nth-child(5) E');
                }

                //      ---------------------------------------------------
                //		Here we build the TAB Section annotation-wrapper
                //      ---------------------------------------------------

                var tabsect = `\
<span tab_caption="` + tab_cap + `" class="tabs2_section mytab wide" cellspacing="0" style="display:none;">`;
                //      ---------------------------------------------------
                //		Here we insert the TAB Section
                //      ---------------------------------------------------

                $( tabsect + `<span id="section_tab.` + tab_cap + `" class="tabs2_section mytab section" tab_caption_raw="` + tab_cap + `" tab_caption="` + tab_cap + `" style="display:none;">` + def_mesg + `<p>&nbsp;<p>&nbsp;<p>&nbsp;<p></span></span>
`).insertAfter( $('#tabs2_section') );

                //
                //
                //

                if ( tab_cap === 'Tab_2' ) {
                    $('#tab_alert').on('click', function () {
                        tab_alert('Tab_3', 'on', 'changed');
                    });
                    $('#tab_alert_stp').on('click', function () {
                        GM_log('#=#=# clearInterval tabflash');
                        tab_alert('Tab_3', 'off', 'changed');
                    });
                    $('#t\\:test\\:what').on('click', function () {
                        GM_log('#=#=# t:test:what clicked');
                        alert('#=#=# t:test:what clicked');
                    });


                    $('#newtpcase').on('click', function () {
                        GM_log('#=#=# set newcase "COOKIE" ');
                        GM_setValue('newcase', 'otherTPcomp,123test456,http://didata.be,' + casenr);
                    });
                    $('#addcmt2case').on('click', function () {
                        GM_log('#=#=# addcmt2case ');
                        var tbl = globalContext["task.table_name"];   //    u_request or incident
                        var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
                        gr.get(unsafeWindow.window.NOW.sysId);
                        GM_log('#=#=# addcmt2case table [' + tbl + '] where sysid=' + unsafeWindow.window.NOW.sysId );
                        gr.comments = "TEST COMMENTS";
                        gr.work_notes = "TEST work note COMMENTS";
                        gr.update(updatedone);
                    });
                    $('#comchk').on('click', function () {
                        GM_log('#=#=# comchk clicked');
                        var tga = new GlideAjax('DDRIMAjax');
                        tga.addParam('sysparm_name', 'runCommunicationsCheck');
                        tga.addParam('sysparm_ci_sysid', main_ci);
                        tga.getXML(CheckXMLResponsepop);
                        GM_log('#=#=# comchk clicked' , tga);
                    });
                }

                if ( tab_cap === 'Tab_3' ) {							// ucp.php?mode=login
                    $('#phpbb1').on('click', function () {
                        gm_http();
                    });
                }

                if ( tab_cap === 'Tab_4' ) {
                    $('#clickme').on('click', function () {
                        var z = $('#test123').text();
                        alert(z);
                        $('#area3').val( $('#test123').text() );
                    });
                    $('#clickme1').on('click', function () {
                        $('#area3').val( $('#test123').val() );
                    });
                    $('#clickme2').on('click', function () {
                        $('#area3').val( $('#test123').html().replace(/<br>/ig,'\n').replace(/<p>/ig,'\n\n').replace(/<\/?[^>]+(>|$)/g, '') );
                    });
                }

                if ( tab_cap === 'Tab_5+' ) {
                    $('#grtbl').on('change', function () {
                        GM_log('# tbllst changed', $('#grtbl').val() );
                        var p = $('#grtbl').val().split(';');
                        GM_log('# ', p);
                        glidetbl = p[0];
                        glidefld = p[1];
                        if (p[2] === '1') glidesid = unsafeWindow.NOW.sysId;                // case sys id        field = task/sysid
                        if (p[2] === '2') glidesid = unsafeWindow.NOW.user.userID;          // user sys id
                        if (p[2] === '3') glidesid = unsafeWindow.globalContext.ci;         // ci sys id
                        if (p[2] === '4') glidesid = unsafeWindow.globalContext.company;    // company sys id
                        if (p[2] === '5') glidesid = unsafeWindow.globalContext.requester;  // requester sys id
                        if (p[2] === '6') glidesid = unsafeWindow.globalContext.affected;   // affected sys id
                        if (p[2] === '7') glidesid = unsafeWindow.globalContext.model;      // model sys id
                        if (p[2] === '8') glidesid = unsafeWindow.globalContext.contract_ci;//    dontknow
                        $('#grtbl').val(glidetbl);
                        $('#glidetbl').val(glidetbl);
                        $('#glidefld').val(glidefld);
                        $('#glidesid').val(glidesid);
                    });
                    //  GLD1 Gliderecord7
                    $('#gld7').on('click', function () {
                        var gr1 = new GlideRecord('task_time_worked');
                        gr1.initialize();
                        gr1.task = unsafeWindow.window.NOW.sysId; //   "6c7c32290fe872006fba83dce1050e46"
                        gr1.u_activity_type = 'Support remote';
                        gr1.time_worked = '1970-01-01 00:11:06';
                        gr1.u_billable  = 'false';
                        gr1.user = 'cacaedfc0a0a3c080179d8df6be90416';  // unsafeWindow.window.NOW.user_id
                        gr1.insert();
                        GM_log('# ' , gr1.u_task , gr1.u_activity_type , gr1.time_worked);
                    });
                    $('#gld8').on('click', function () {
                        var gr1 = new GlideRecord('u_ext_ref_no');
                        gr1.initialize();
                        gr1.u_task = unsafeWindow.window.NOW.sysId;
                        gr1.u_reference_type = 'Vendor reference number';
                        gr1.u_description = 'cisco123456';
                        gr1.u_url = 'http://cisco.com';
                        gr1.u_active = true;
                        gr1.insert();
                        GM_log('# ' , gr1.task , gr1.u_reference_type , gr1.u_description , gr1.u_url , gr1.u_active );
                    });
                    $('#replaceme').on('click',function() {
                        $(this).replaceWith('<div style="width: 16px; height: 16px;  background-image: url(' + $(this).attr('src') + '); background-position: -8px -8px;"></div>'); //position: relative; overflow: hidden;
                    });
                    $('#btnclk').on('click', function() {
                        var p = $('#btnclk').css('background-position');
                        GM_log('# ' + p);
                        p = p.replace(/px/g,'').split(' ')[1];
                        GM_log('# ' + p);
                        p = '0px ' +  ( p - 16 ) + 'px';
                        GM_log('# ' + p);
                        $('#btnclk').css('background-position', p ) ;
                    });

                    var iconhex = 'f100';
                    var t = parseInt(iconhex, 16);
                    GM_addStyle(' #btnclk2.icon-tree:before { content: "' + gcontstr(t) + '";}');

                    $('#btnclk2').on('click', function() {
                        var t = parseInt(iconhex, 16) + 16;
                        iconhex = t.toString(16);
                        GM_addStyle(' #btnclk2.icon-tree:before { content: "' + gcontstr(t) + '";}');
                        $('#btnclk3').text(iconhex);
                    });
                    $('#btnclk2').on('contextmenu', function() {
                        var t = parseInt(iconhex, 16) - 16;
                        iconhex = t.toString(16);
                        GM_addStyle(' #btnclk2.icon-tree:before { content: "' + gcontstr(t) + '";}');
                        $('#btnclk3').text(iconhex);
                    });
                    $('#btnclk3').on('click', function() {
                        var t = parseInt(iconhex, 16) + 16;
                        iconhex = t.toString(16);
                        GM_addStyle(' #btnclk2.icon-tree:before { content: "' + gcontstr(t) + '";}');
                        $('#btnclk3').text(iconhex);
                    });
                    $('#btnclk3').on("contextmenu",function(){
                        var t = parseInt(iconhex, 16) - 16;
                        iconhex = t.toString(16);
                        GM_addStyle(' #btnclk2.icon-tree:before { content: "' + gcontstr(t) + '";}');
                        $('#btnclk3').text(iconhex);
                        return false;
                    });
                    function gcontstr(start) {
                        var t = start;
                        var sep = '  _  \\';
                        return '\\' + t.toString(16) + sep + (t+1).toString(16) + sep + (t+2).toString(16) + sep + (t+3).toString(16) + sep + (t+4).toString(16) + sep + (t+5).toString(16) + sep + (t+6).toString(16) + sep + (t+7).toString(16) + sep + (t+8).toString(16) + sep + (t+9).toString(16) + sep + (t+10).toString(16) + sep + (t+11).toString(16) + sep + (t+12).toString(16) + sep + (t+13).toString(16) + sep + (t+14).toString(16) + sep + (t+15).toString(16);
                    };
                    GM_log('#=#=# add text to area1');
                    //  GLD1 Gliderecord1
                    $('#gld1').on('click', function () {
                        var gr1 = new GlideRecord('cmdb_model');
                        gr1.addQuery('sys_id',$('#' + script+ '\\.u_product').val());
                        gr1.query(global_showgr);
                    });
                    //  GLD2 Gliderecord2
                    $('#gld2').on('click', function () {
                        var gr2 = new GlideRecord('cmdb_ci');
                        gr2.addQuery('sys_id',$('#' + script+ '\\.u_contract_ci').val());
                        gr2.query(global_showgr);
                    });
                    //  GLD3 Gliderecord3
                    $('#gld3').on('click', function () {
                        var gr3 = new GlideRecord('contract_rel_ci');
                        gr3.addQuery('sys_id',$('#' + script+ '\\.u_contract_ci').val());
                        gr3.query(global_showgr);
                    });
                    $('#gld4').on('click', function () {
                        var gr4 = new GlideRecord('cmdb_model');
                        gr4.addQuery('sys_id','d011b6f00f23e100cfd783dce1050ed5');
                        //                gr4.addQuery('field_name','u_product');
                        gr4.query(global_showgr);
                    });

                    $('#gld5').on('click', function () {
                        var gr5 = new GlideRecord( $('#glidetbl').val() );
                        gr5.addQuery( $('#glidefld').val() , $('#glidesid').val() );
                        if ( $('#cond_fld').val() !== '' ) gr5.addQuery( $('#cond_fld').val() , $('#cond_val').val() );
                        if ( $('#glidetbl').val() === 'sys_attachment' ) gr5.addOrderBy('size_bytes');
                        gr5.query(global_showgr);
                    });
                    $('#gld6').on('click', function () {
                        var lst = '';
                        var table = $('#glidetbl').val();
                        if ( $('#glidefld').val().length > 0 && $('#glidesid').val().length > 0 ) {
                            var gr6 = new GlideRecord(table);
                            gr6.addQuery($('#glidefld').val(),$('#glidesid').val() );
                            if ( table === 'sys_attachment') gr6.orderByDesc('size_bytes','size_compressed');
                            gr6.query();
                            while ( gr6.next() ) {
                                console.log ('#=#=  Record: ', gr6 );
                                for(var key in gr6) {
                                    if ( !Array.isArray(key) && typeof gr6[key] !== 'object' ) {  // && typeof key !== '[object Object]'
                                        var value = gr6[key];
                                        if ( value.toString().indexOf('function (') == -1 ) {
                                            console.log ('#=#=  Record type: ' + typeof key + ' key: ' + key + ' value: ' + value );
                                        }
                                    }
                                }
                                if (table === 'task_time_worked' ) {
                                    lst += 'u_number: '+ gr6.u_number + '\n';
                                    lst += 'time_worked: '+ gr6.time_worked + '\n';
                                    lst += 'u_activity_type: '+ gr6.u_activity_type + '\n';
                                    lst += 'u_start_time: '+ gr6.u_start_time + '\n';
                                    lst += 'user: '+ gr6.user + '\n';
                                    lst += 'employee_number: '+ gr6.employee_number + '\n';
                                    lst += 'time_in_seconds: '+ gr6.time_in_seconds + '\n';
                                    lst += 'u_approved: '+ gr6.u_approved + '\n';
                                }
                                if (table === 'task_sla' ) {
                                    lst += 'business_percentage : '+ gr6.business_percentage + '\n';
                                    lst += 'business_time_left : '+ gr6.business_time_left + '\n';
                                    lst += 'u_current_stage : '+ gr6.u_current_stage + '\n';
                                    lst += 'stage : '+ gr6.stage + '\n';
                                    lst += 'u_name : '+ gr6.u_name + '\n';
                                    lst += 'active : '+ gr6.active + '\n';
                                    lst += 'u_breach_comments : '+ gr6.u_breach_comments + '\n';
                                    lst += 'u_breach_reason_code  : '+ gr6.u_breach_reason_code  + '\n';
                                    lst += 'u_escalation : '+ gr6.u_escalation  + '\n';
                                }
                                if (table === 'sys_journal_field' ) {
                                    lst += 'sys_id: '+ gr6.sys_id + '\n';
                                    lst += 'element: '+ gr6.element + '\n';
                                    lst += 'sys_created_on: '+ gr6.sys_created_on + '\n';
                                    lst += 'sys_created_by: '+ gr6.sys_updated_by + '\n';
                                    lst += 'value: '+ gr6.value + '\n';
                                }
                                if (table === 'u_ext_ref_no' ) {
                                    lst += 'u_reference_type: '+ gr6.u_reference_type + '\n';
                                    lst += 'u_url: '+ gr6.u_url + '\n';
                                    lst += 'u_description: '+ gr6.u_description + '\n';
                                    lst += 'u_reference_number: '+ gr6.u_reference_number + '\n';
                                    lst += 'u_company: '+ gr6.u_company + '\n';
                                }
                                if ( table !== 'task_time_worked' && table !== 'task_time_worked' && table !== 'u_ext_ref_no' ) {
                                    //                            gr6.query(global_showgr);
                                    for (x = 0; x < gr6.rows[0].length; x++ ) {
                                        console.log ('#=#=  Name: '+ gr6.name + '   Value: ' + gr6.value , x);
                                        lst += 'Name: '+ gr6.name + '   Value: ' + gr6.value + ' ' +  x + '\n';
                                    }
                                }
                                lst += '_______________________________________________________\n';
                            }
                            $('#area2').val(lst);
                        }
                    });
                    //  XML1
                    $('#xmlpost').on('click', function () {
                        GM_log('#=#=# xmlpost clicked ');
                        var responseXML = '';
                        xmldata = 'sysparm_sys_id=9d9a6e3c0fefa100ac179c3be1050e06&sysparm_table_name=u_request&sysparm_field_name=u_product&sysparm_view=&sysparm_refkey=null';
                        xmlurl  = '/popup.do';
                        //                xmlurl  = '/xmlhttp.do';

                        $('#area1').val( xmldata );

                        var httprqst = new XMLHttpRequest();
                        httprqst.open("POST", xmlurl, true);
                        httprqst.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  			 // Send the proper header information along with the request
                        httprqst.setRequestHeader("Content-length", xmldata.length);
                        httprqst.setRequestHeader("Connection", "close");
                        httprqst.onreadystatechange = function() {                                                   // Call a function when the state changes.
                            if ( httprqst.readyState == 4 ) {
                                if ( httprqst.status == 200) {
                                    $('#area2').val(httprqst.responseText);
                                    GM_log(['#=#=# ',
                                            httprqst.status,
                                            httprqst.statusText,
                                            httprqst.readyState,
                                            httprqst.responseHeaders,
                                            httprqst.responseText,
                                            httprqst.finalUrl,
                                            responseXML
                                           ].join("\n"));
                                } else {
                                    $('#area2').val(httprqst.status + '  ' + httprqst.statusText);
                                    GM_log(['#=#=# oeps',
                                            httprqst.status,
                                            httprqst.statusText
                                           ].join("\n"));
                                }
                            }
                        };
                        httprqst.send(xmldata);
                    });
                    //  XML2

                    $('#xmlhop').on('click', function () {
                        GM_log('#=#=# xmlhop clicked ');
                        $('#area1').val( xmldata );

                        var httprqst2 = new XMLHttpRequest();
                        httprqst2.open("POST", xmlurl, true);
                        httprqst2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  			 // Send the proper header information along with the request
                        httprqst2.setRequestHeader("Content-length", xmldata.length);
                        httprqst2.setRequestHeader("Connection", "close");
                        httprqst2.onreadystatechange = function() {                                                   // Call a function when the state changes.
                            if ( httprqst2.readyState == 4 ) {
                                if ( httprqst2.status == 200) {
                                    $('#area2').val(httprqst2.responseText);
                                    GM_log(['#=#=# ',
                                            httprqst2.status,
                                            httprqst2.statusText,
                                            httprqst2.readyState,
                                            httprqst2.responseHeaders,
                                            httprqst2.responseText,
                                            httprqst2.finalUrl,
                                            responseXML
                                           ].join("\n"));
                                } else {
                                    $('#area2').val(httprqst2.status + '  ' + httprqst2.statusText);
                                    GM_log(['#=#=# oeps',
                                            httprqst2.status,
                                            httprqst2.statusText
                                           ].join("\n"));
                                }
                            }
                        };
                        httprqst2.send(xmldata);
                    });

                    //  XML3
                    $('#xml2get').on('click', function () {
                        gm_http2('','');
                    });
                    $('#xmlget').on('click', function () {
                        GM_log('#=#=# xmlget clicked ');
                        $('#area1').val( xmldata );

                        var httprqst = new XMLHttpRequest();
                        httprqst.open("GET", xmlurl, true);
                        httprqst.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  			 // Send the proper header information along with the request
                        httprqst.setRequestHeader("Content-length", xmldata.length);
                        httprqst.setRequestHeader("Connection", "close");
                        httprqst.onreadystatechange = function() {                                                   // Call a function when the state changes.
                            if ( httprqst.readyState == 4 && httprqst.status == 200) {
                                $('#area2').val(httprqst.responseText);
                                GM_log(['#=#=# ',
                                        httprqst.status,
                                        httprqst.statusText,
                                        httprqst.readyState,
                                        httprqst.responseHeaders,
                                        httprqst.responseText,
                                        httprqst.finalUrl,
                                        responseXML
                                       ].join("\n"));
                            } else {
                                $('#area2').val(httprqst.readyState + '  ' + httprqst.status + '  ' + httprqst.statusText);
                                GM_log(['#=#=# oeps ',
                                        httprqst.readyState,
                                        httprqst.status,
                                        httprqst.statusText
                                       ].join("\n"));

                            }
                        };
                        httprqst.send(xmldata);
                    });

                    $('#serialsearch').on('click', function () {
                        if ( $("span.tab_caption_text:contains('Integration messages log')").parent().parent().attr('style') === 'display: inline;') tab_alert('Integration messages log', 'on', 'changed');
                        GM_log('#=#=# serialsearch clicked ' , $("span.tab_caption_text:contains('Integration messages log')").parent().css('display') );
                        var watch = serialsearch();
                        GM_log('#=#=# serialsearch ' , watch);
                        //			$('#area2').val(it);
                        $('#area2').val(it + '\n\n\n' + watch);
                    });


                    $('#addstuFf').on('click', function () {
                        //                update_SWOW_records();
                    });

                    $('#tpcasefix').on('click', function () {
                        var gr = new GlideRecord('u_ext_ref_no');
                        gr.addQuery('u_reference_number','test2' );
                        gr.query(gevonden);

                        function gevonden(gr) {
                            while ( gr.next() ) {
                                gr.setValue('u_task', unsafeWindow.window.NOW.sysId);
                                gr.u_url = gr.u_url.split('#=#')[0];
                                gr.u_external_reference = 'DD-SYSID-' + gr.sys_id;
                                gr.update(fixupd);
                            }
                        }

                        function fixupd(gr){
                            GM_log('# fixupd ' , gr);
                        }
                    });

                    $('#tpcaseclosed').on('click', function () {
                        var gr = new GlideRecord('u_ext_ref_no');
                        gr.addQuery('u_reference_number','test1234' );
                        gr.query(gevonden);

                        function gevonden(gr) {
                            while ( gr.next() ) {
                                GM_log('# gevonden ' , gr);
                                gr.setValue('u_reference_number', '#=#' + gr.u_reference_number);
                                gr.update(closedcase);
                            }
                        }

                        function closedcase(gr){
                            GM_log('# closedcase ' , gr);
                        }
                    });

                    $('#journal').on('click', function () {
                        get_journal_records();
                    });
                    $('#journal1').on('click', function () {
                        ins_journal_records();
                    });

                }

                if ( tab_cap === 'ITSM+' ) {
                    $('A.tplink').on('click' , function() {

                        GM_log('# tplink clicked ' );

                        GM_deleteValue('ourcase');
                        GM_deleteValue('oursubj');
                        GM_deleteValue('ourcust');
                        GM_deleteValue('ourseri');


                        GM_setValue('ourcase', casenr);
                        GM_setValue('oursubj', $('#' + script + '\\.short_description').val()  );
                        GM_setValue('ourcust', CustNM      );
                        GM_log('# ourcase set to: ' + casenr, CustNM  );
                        var tmpser = $('input#' + script + '\\.u_custom_text_3').val();
                        if (  tmpser && tmpser.indexOf(';') > -1) serial_number = $('input#' + script + '\\.u_custom_text_3').val().split(';')[2];
                        if ( typeof serial_number === 'undefined' || serial_number.indexOf('<ITSM') > -1  ) GM_setValue('ourseri', '');
                        else GM_setValue('ourseri', serial_number);
                        var details = unsafeWindow.window.NOW.user_email + ';' + info.join(';');
                        GM_setValue('ourdeta', details);
                        var dt = new Date();
                        GM_setValue('casedt', dt);
                        GM_log('# ourcase set to: ' + casenr , serial_number, CustNM, dt  );
                        var chk4nwcstmr = setInterval(  function() { chk4nwcs(); } ,10000);

                    });
                    $('#bg').on('change', function() {
                        bgcolor = $('#bg').val();
                        setcolors(bgcolor, txtcolor);
                    });
                    $('#txt').on('change', function() {
                        txtcolor = $('#txt').val();
                        setcolors(bgcolor, txtcolor);
                    });

                    $('#rstclrs').on('click', function() {
                        alert('Clearing the bg and txt colors');
                        GM_deleteValue('ITSMbgcolor' );
                        GM_deleteValue('ITSMtxtcolor');
                        parent.top.location = parent.top.location.href;
                    });

                    $('#svclrs').on('click', function() {
                        alert('Saving and applying the bg and txt colors');
                        GM_setValue('ITSMtxtcolor', txtcolor);
                        GM_setValue('ITSMbgcolor' , bgcolor );
                        parent.top.location = parent.top.location.href;
                    });

                }
                if ( tab_cap === 'NEW' ) {
                    if (loggedin !== 'Michel Hegeraat')  $('#shhdframe').hide();
                    $('#shhdframe').on('click' , function() {
                        $('#shhd').toggle();
                        if ( $('#shhdframe').attr('src').indexOf('hide') > -1 ) {
                            $('#shhdframe').attr('src', '/images/section_reveal.gifx');
                        } else {
                            $('#shhdframe').attr('src', '/images/section_hide.gifx');
                        }
                    });

                    $('#grdel').hide();
                    $('#grdel').on('click' , function() {
                        tab_alert('NEW','off', 'changed');
                        GM_deleteValue('newcase');
                        $('#grdel').hide();
                        $('#gr1data').val('');
                        $('#gr2data').val('');
                    });
                    $('#grsubm').on('click' , function() {
                        GM_deleteValue('newcase');
                        tab_alert('NEW','off', 'changed');
                        var wnote = '';
                        var caselink = '';
                        var vdrurl = '';
                        var taskID = unsafeWindow.window.NOW.sysId;
                        var vendor = $('#gr3data').val().toLowerCase();
                        var t = [];
                        t = tpVendorURL( vendor,$('#gr4data').val() );
                        var vid     = t[0];
                        var reftype = t[1];
                        GM_log('# ', vid , urlstr[vid] , vendor);


                        if ( vid > 0 ) {                                                                           //  Do we have a vendor
                            if ( urlstr[vid] ) {                                                                   //  Do we have a url for this vendor
                                if ( $('#gr1data').val().length > 0 ) {                                            //  Do we have a ref nr
                                    vdrurl = urlstr[vid].replace('{case}',$('#gr1data').val());                    //  replace {case} with the case nr
                                    if ($('#gr2data').val().length < 1 ) { $('#gr2data').val(vdrurl); }          //  overwrite url field if it is not filled.
                                }
                            }
                        }
                        GM_log('# ', vid , urlstr[vid] , vendor);


                        if ( $('#gr4data').val() === 'Vendor Case' ) {
                            caselink = '<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0"><SPAN id="cases_new" class="tab_caption_text tpcases" style="">' + vendor.toUpperCase() + ': <a class="mybut" href="' + $('#gr2data').val() + '" target="_blank">' + $('#gr1data').val() + '</a></SPAN></span></span>';
                            $(caselink).insertBefore( $('#tabs2_section > span.insertpoint' ) ); //  + '<img class="tab_spacer" width="4" height="24" src="images/s.gifx" />'
                            wnote = '[code]<div style="border-radius:10px;padding:10px;background-color:#afffb0;color:#000;"> The case <a class="mybut" href="' + $('#gr2data').val() + '" target="_blank">' + $('#gr1data').val() + '</a> is opened with ' + vendor + '<div>[/code]';
                        }
                        if ( $('#gr4data').val() === 'Vendor RMA' ) {
                            if ( $('#gr2data').val().length > 0 ) {
                                wnote = '[code]<div style="border-radius:10px;padding:10px;background-color:#afffb0;color:#000;"> The RMA <a class="mybut" href="' + $('#gr2data').val() + '" target="_blank">' + $('#gr1data').val() + '</a> is opened with ' + vendor + '<div>[/code]';
                            } else {
                                wnote = '[code]<div style="border-radius:10px;padding:10px;background-color:#afffb0;color:#000;"> The RMA ' + $('#gr1data').val() + ' is opened with ' + vendor + '<div>[/code]';
                            }
                        }
                        if ( $('#gr4data').val() === 'Vendor BugID/Defect Ref' ) {
                            wnote = '[code]<div style="border-radius:10px;padding:10px;background-color:#afffb0;color:#000;"> Logged Vendor BugID/Defect Ref <a class="mybut" href="' + $('#gr2data').val() + '" target="_blank">' + $('#gr1data').val() + '</a> with ' + vendor + '<div>[/code]';
                        }
                        if ( $('#gr4data').val() === 'Customer reference' ) {
                            wnote = '[code]<div style="border-radius:10px;padding:10px;background-color:#afffb0;color:#000;"> Logged Customer reference ' + $('#gr1data').val() + ' <div>[/code]';
                            client_ref = $('#gr1data').val();
                        }

                        fakepostbuttonclick('',wnote);
                        var save_url = $('#gr2data').val();
                        insertExtRef_legacy();

                        var gr2 = new GlideRecord(globalContext["task.table_name"]);
                        gr2.get(unsafeWindow.window.NOW.sysId);
                        if (gr2.u_ext_ref_no_calc === '') {
                            gr2.u_ext_ref_no_calc = $('#gr1data').val();
                        } else {
                            gr2.u_ext_ref_no_calc = gr2.u_ext_ref_no_calc + ', ' + $('#gr1data').val();
                        }
                        setTimeout(function(){
                            gr2.update(updatedone);
                            GM_log('# update case ' + globalContext["task.table_name"] + ' ' , gr2);
                        },6000);

                        $('#grdel').hide();
                        $('#gr1data').val('');
                        $('#gr2data').val('');


                        function insertExtRef_legacy() {
                            $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_number').val($('#gr1data').val());
                            $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_description'     ).val($('#gr3data').val());
                            $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_url'             ).val($('#gr2data').val());
                            var  reftype = 'Vendor reference number';
                            if ( $('#gr4data').val() === 'Vendor Case' )             reftype = 'Vendor reference number';
                            if ( $('#gr4data').val() === 'Vendor RMA' )              reftype = 'Vendor reference number / RMA';
                            if ( $('#gr4data').val() === 'Vendor BugID/Defect Ref' ) reftype = 'Vendor known error code';
                            if ( $('#gr4data').val() === 'Customer reference' )      reftype = 'Client reference number';
                            $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_type').val(reftype);
                            if ($('#gr3data').val() === 'Alcatel-Lucent Enterprise - ALE') {
                                $('iframe#externalref').contents().find('#sys_display\\.u_ext_ref_no\\.u_company').val('Alcatel-Lucent Enterprise - ALE');
                                $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_company').val('4829ce180f8a320019eb079ce1050e84');
                            }
                            if ( $('iframe#externalref').contents().find('#sysverb_insert_and_stay').length > 0 )
                            {  $('iframe#externalref').contents().find('#sysverb_insert_and_stay')[0].click(); }  // normal but if not found
                            else { $('iframe#externalref').contents().find('#sysverb_insert')[0].click();}            // submitContinue or sysverb_insert
                        }

                        function insertExtRef_Ajax(u_task, u_reference_type, u_reference_number, u_description, u_url) {
                            GM_log('# insertExtRefAjax ', u_task, u_reference_type, u_reference_number, u_description , u_url );
                            var ga = new GlideAjax('save_list');
                            ga.addParam('sysparm_want_session_messages','true');
                            ga.addParam('sysparm_type','save_list');
                            ga.addParam('sysparm_name','u_ext_ref_no');
                            ga.addParam('sysparm_processor','AJAXGlideRecord');
                            ga.addParam('sysparm_chars', '<record_update table="u_ext_ref_no"><u_ext_ref_no><u_active>true</u_active><u_task>' + u_task + '</u_task><u_reference_type>' + u_reference_type + '</u_reference_type><u_reference_number>' + u_reference_number + '</u_reference_number><u_description>' + u_description + '</u_description><u_url>' + u_url + '</u_url></u_ext_ref_no></record_update>');
                            ga.getXMLAnswer(insertdoneAjax);
                        }
                        function insertdoneAjax(response) {
                            GM_log('# insertdoneAjax ', response );
                        }

                        function insertExtRef(u_task, u_reference_type, u_reference_number, u_description, u_url) {
                            GM_log('# insertExtRef ', u_task, u_reference_type, u_reference_number, u_description , u_url );
                            var gr = new GlideRecord('u_ext_ref_no');
                            gr.initialize();
                            GM_log('# insertExtRef ', gr.sys_id);
                            gr.u_active             = true;
                            gr.u_task               = u_task;
                            gr.u_reference_type     = u_reference_type;
                            gr.u_reference_number   = u_reference_number;
                            gr.u_description        = u_description;
                            gr.u_external_reference = 'DD-SYSID-'+u_task;
                            gr.u_url                = u_url;
                            var insres = gr.insert(insertdone);
                            GM_log('# insertExtRef done. ', gr , insres  );
                        }

                        function insertdone(gr) {
                            GM_log('# grsubm insert "ExtRef" should be done now.' , gr , gr.sys_id );
                        }
                        function foundit(gr) {
                            GM_log('# did I find it? ', gr);
                            while ( gr.next() ) {
                                gr.u_task = taskID;
                                gr.u_url = gr.u_url.split('#=#')[0];
                                gr.u_external_reference = 'DD-SYSID-' + gr.sys_id;
                            }
                            gr.update(updatedtwo);
                        }
                        function updatedtwo(gr) {
                            GM_log('# grsubm update "ExtRef" should be done now.', gr);
                        }
                        function updatedone(gr) {
                            GM_log('# grsubm update "Ext ref no calc" should be done now.', gr);
                        }

                    });

                    $('#gr1data').on('change' , function() {
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_number').val($('#gr1data').val());
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_description').val($('#gr3data').val());
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_url').val($('#gr2data').val());
                        if ( $('#gr4data').val() === 'Vendor Case' )             reftype = 'Vendor reference number';
                        if ( $('#gr4data').val() === 'Vendor RMA' )              reftype = 'Vendor reference number / RMA';
                        if ( $('#gr4data').val() === 'Vendor BugID/Defect Ref' ) reftype = 'Vendor known error code';
                        if ( $('#gr4data').val() === 'Customer reference' )      reftype = 'Client reference number';
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_type').val(reftype);
                    });

                    $('#gr2data').on('change' , function() {
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_number').val($('#gr1data').val());
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_url').val($('#gr2data').val());
                    });

                    $('#gr3data').on('change' , function() {
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_url').val($('#gr2data').val());
                    });

                    $('#gr4data').on('change' , function() {
                        GM_log('#=#=# Glideform gr4data: ' , $('#gr4data').val() );
                        if ( $('#gr4data').val() === 'Customer reference' ) {
                            $('#ln2').hide();
                            $('#ln1 > td.mylbl').text('Cust Ref:');
                        } else {
                            $('#ln2').show();
                        }
                        if ( $('#gr4data').val() === 'Vendor RMA' ) {
                            $('#ln1 > td.mylbl').text('RMA Nr:');
                        }
                        if ( $('#gr4data').val() === 'Vendor Case' ) {
                            $('#ln1 > td.mylbl').text('Case Nr:');
                        }
                        if ( $('#gr4data').val() === 'Vendor BugID/Defect Ref' ) {
                            $('#ln1 > td.mylbl').text('Bug Ref:');
                        }
                        if ( $('#gr4data').val() === 'Vendor Case' )             reftype = 'Vendor reference number';
                        if ( $('#gr4data').val() === 'Vendor RMA' )              reftype = 'Vendor reference number / RMA';
                        if ( $('#gr4data').val() === 'Vendor BugID/Defect Ref' ) reftype = 'Vendor known error code';
                        if ( $('#gr4data').val() === 'Customer reference' )      reftype = 'Vendor known error code';
                        $('iframe#externalref').contents().find('#u_ext_ref_no\\.u_reference_type').val(reftype);
                    });

                    $('#rmabut').on('click', function() {
                        if ($('#rmabut').text() === 'RMA') {
                            GM_setValue('newrma', 'newrma');
                        }

                        GM_log('# External ref exists ', $('H1.navbar-title:contains("External reference")').parent().next().length );

                        GM_setValue('activetab','');
                        window.top.location = '/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=' + unsafeWindow.NOW.sysId;

                    });
                }

                if ( tab_cap === 'RMA' ) {

                    //          RMA mail send

                    for (j=0;j<rma_lijst.length;j++) {
                        var onclickid = '#rmahop_' + j.toString();
                        $( onclickid ).on('click', function () {
                            GM_log('# RMA-REQ Click');
                            var p = $(this);
                            var areaid = '#' + p.attr('id').replace('hop_','area');
                            var rma_t = $( areaid ).html().replace(/<br>/ig,'\n').replace(/<p>/ig,'\n\n').replace(/<\/?[^>]+(>|$)/g, '').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>');
                            var rmanr = $(onclickid).text().replace('Send RMA','').trim();
                            var tmp1 = rma_t.replace(/>/g,'&gt;').replace(/</g,'&lt;').split('\n');
                            GM_log('# RMA-REQ len ', tmp1.length);
                            var tmp3 = '';
                            for (var x=0;x<tmp1.length;x++)  {
                                if ( tmp1[x].indexOf(':') > -1 ) {
                                    var tmp2 = tmp1[x].split(':');
                                    tmp3 = '<tr><td class="label-text mylbl">' + tmp2[0].trim() + '</td><td class=myspc> &nbsp; </td><td class="form-control myfld">' + tmp2.slice(1).toString().trim() + '</td></tr>';
                                } else {
                                    tmp3 = '<tr><td colspan=3> &nbsp; </td></tr>';
                                }
                                GM_log('# RMA-REQ' , tmp3);
                                tmp1[x] = tmp3;
                            }
                            var tmp4 = '==== RMA REQUEST '+ rmanr +' SEND ====\n\n' + '[code]<div><table><tbody>\n' + '<tr><td  colspan=3>' + tmp1.join('\n') + '\n</tbody></table></div>[/code]';
                            $('#' + script + '\\.work_notes').val( tmp4 );
                            unsafeWindow.g_form.setValue(script + '.work_notes', tmp4 );
                            $('#activity-stream-work_notes-textarea').val( tmp4 );
                            unsafeWindow.g_form.setValue('activity-stream-work_notes-textarea', tmp4 );
                            rma_t = rma_t + '\n\nDo not change the info in this mail!!\nInstead change the info in the textarea under the RMA tab.\n\nYou can change the font to a non-proportional one like: Consolas, Courier New or Terminal to align the text in the mail.';
                            var mail_lnk = 'mailto://BE.RSO.RMC@' + domain + '?subject=' + encodeURIComponent('RMA\'s for [' + $('#' + script + '\\.company_label').val() + '] ' + casenr)  + '&body=' + encodeURIComponent( rma_t ); //.split('\n').join('%0D')
                            GM_log('#=#=# mail_lnk', mail_lnk.length, mail_lnk  );
                            window.top.location = mail_lnk;
                            GM_log('#=#=# click rmahop ' ,  rmanr  );
                            return false;  //.replace(/    /g,'\t')
                        });
                    }

                    if ( $('#element\\.' + script + '\\.work_notes\\.additional').find('div > span > span:contains("=== RMA REQUEST ' + rma_lijst[0][0] + '")').length > 0 && $('#rmaarea0').length > 0 ) {
                        $('#rmaarea0').css('height','445');
                    }
                }

                tab_cap = tab_cap.replace('+', '\\+');

                $('img#img\\.' + tab_cap).on('click', function() {
                    GM_log('#=#=# img hide-reveal ' + tab_cap + ' clicked. ' + $('span#section_tab\\.' + tab_cap ).length );
                    if ( $(this).attr('src') === 'images/section_hide.gifx' ) {
                        $(this).attr('src','images/section_reveal.gifx').attr('title','Collapse');
                        GM_log('#=#=#  show span#' + tab_cap );
                        $('span#section_tab\\.' + tab_cap ).slideDown();
                    } else {
                        $(this).attr('src','images/section_hide.gifx').attr('title','Expand');
                        GM_log('#=#=#  hide span#' + tab_cap );
                        $('span#section_tab\\.' + tab_cap ).slideUp();
                    }
                });

                TabClickHover(tab_cap);
                GM_log('#=#=# Tab ' + tab_cap + ' added. tabs_test end.' );
            }

            function TabClickHover(tab_cap){

                $('span#' + tab_cap ).parent().on('click', function() {

                    GM_log('#> TabClickHover ' + tab_cap + ' clicked.' );
                    GM_setValue('activetab', tab_cap);

                    var activetab = $('span#' + tab_cap).parent();
                    nicetab(activetab);

                    if ( tab_cap === 'Attachments' ) Attachments_main();
                    if ( tab_cap === 'NEW' ) {
                        GM_log('#=#=# tab_cap === NEW  ' + $('iframe#externalref').length + ' . '  + $('iframe#gsft_main').length );

                        if ( $('iframe#externalref').length === 1 ) {
                            $('iframe#externalref').attr('src','/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=' + unsafeWindow.NOW.sysId );
                        }
                        if ( $('iframe#gsft_main').length   === 1 ) {
                            $('iframe#gsft_main').contents().find('iframe#externalref').attr('src','/u_ext_ref_no.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=u_ext_ref_no&sysparm_collection=u_request&sysparm_collection_key=u_task&sysparm_collectionID=' + unsafeWindow.NOW.sysId );
                        }
                    }

                    $('span.tabs2_section').hide();
                    $('span.tabs2_section0').show();
                    $('span.tabs2_section').each( function() {
                        var obj = $(this);
                        //				GM_log('#=#=# section ' + obj.attr('tab_caption') + '.' );
                        if (obj.attr('tab_caption') === tab_cap.replace('\\','') ) {
                            GM_log('#=#=# Show section span ' + tab_cap + '.' );
                            if ( $('img#img\\.' + tab_cap).attr('src') !== 'images/section_hide.gifx' ) { $( this ).show(); }
                        }
                    });
                });

                $('span#' + tab_cap ).parent().hover(
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
                GM_log('#=#=# Tab hover added ');
            }


            function hidenohide(obj) {
                if ( obj.attr('tab_caption') !== 'Request'        &&
                    obj.attr('tab_caption') !== 'Request task'   &&
                    obj.attr('tab_caption') !== 'Incident'       &&
                    obj.attr('tab_caption') !== 'Change request' &&
                    obj.attr('tab_caption') !== 'Change task'    &&
                    obj.attr('tab_caption') !== 'Problem'        &&
                    obj.attr('tab_caption') !== 'Service order'  &&
                    obj.attr('tab_caption') !== 'Project'        &&
                    obj.attr('tab_caption') !== 'Project task'   &&
                    obj.attr('tab_caption') !== 'Event'        ) {
                    return true;
                } else {
                    return false;
                }
            }

            function insertTab(tab_cap,color,state){

                var clr = '';
                if (color == 1) { clr = 'changed'            ; }             // #0C0
                if (color == 2) { clr = 'read_only'          ; }             // #FFA500
                if (color == 3) { clr = 'mandatory'          ; }             // #E11A2C
                if (color == 4) { clr = 'mandatory_populated'; }             //
                if (color == 5) { clr = 'foreign'            ; }             //
                if (color == 6) { clr = 'itsm'               ; }             // #00BFFF

                var def_mesg = '<p><h2>Nothing usefull in here yet (' + tab_cap + ')</h2></p>';
                def_mesg = '<table><tr><td><div class="info_box">You must create an External reference entry with a <b>\'Vendor reference number / RMA\'</b>, before the RMA template appears.<p></div><p><a id="hoplabut" class="mybut" >RMA</a></td><td>&nbsp;</td></table>';

                if (   instance !== 'sandbox' ) {
                    $('<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0" style=";padding-right:0px;"><span id="' + tab_cap + '" class="' + clr + '"  style="margin-right:2px"><img src="images/s.gifx" alt="" style="width: 4px; height: 12px; margin: 0px;"></img></span><span class="tab_caption_text"> ' + tab_cap + ' &nbsp;</span></span></span>').insertBefore( $('div#tabs2_section > span.insertpoint') ); //<img class="tab_spacer" width="4" height="24" src="images/s.gifx" />
                } else {
                    GM_log('#=#=#  #tabs2_section > span:nth-child(6) S');
                    $(`<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0" style=";padding-right:0px;"><span id="` + tab_cap + `" class="` + clr + `"  style="margin-right:2px"><img src="images/s.gifx" alt="" style="width: 4px; height: 12px; margin: 0px;"></img></span><span class="tab_caption_text"> ` + tab_cap + ` </span></span></span>
`).insertBefore( $('div#tabs2_section > span.insertpoint') );
                    GM_log('#=#=#  #tabs2_section > span:nth-child(6) E');
                }

                //      ---------------------------------------------------
                //		Here we build the TAB Section annotation-wrapper
                //      ---------------------------------------------------
                var tabsect = `\
<span tab_caption="` + tab_cap + `" class="tabs2_section mytab wide" cellspacing="0" style="display:none;">`;
                //      ---------------------------------------------------
                //		Here we insert the TAB Section
                //      ---------------------------------------------------
                $( tabsect + `<span id="section_tab.' + tab_cap + '" class="tabs2_section mytab section" tab_caption_raw="' + tab_cap + '" tab_caption="' + tab_cap + '" style="display:none;">' + def_mesg + '<p>&nbsp;<p>&nbsp;<p>&nbsp;<p></span></span>
` ).insertAfter( $('#tabs2_section') );

                //
                //
                //
                TabClickHover(tab_cap);

                $('#hoplabut').on('click', function() {

                    GM_setValue('activetab','');

                    GM_log('# External ref exists ', $('H1.navbar-title:contains("External reference")').parent().next().length );
                    $('#' + script + '\\.u_ext_ref_no\\.u_task_list > span:nth-child(1) > div:nth-child(2) > nav:nth-child(1) > div.container-fluid  > div.navbar-header  > button.mybut')[0].click();
                });

                GM_log('#=# Inserted Tab ' + tab_cap , clr, state);
            }

            function Attachments_Tab(){

                var clr = 'foreign';
                if (color == 1) { clr = 'changed'            ; }             // #0C0
                if (color == 2) { clr = 'read_only'          ; }             // #FFA500
                if (color == 3) { clr = 'mandatory'          ; }             // #E11A2C
                if (color == 4) { clr = 'mandatory_populated'; }             //
                if (color == 5) { clr = 'foreign'            ; }             //
                if (color == 6) { clr = 'itsm'               ; }             // #00BFFF

                var tab_cap = 'Attachments';
                var def_mesg = '<p><h2>Nothing usefull in here yet (' + tab_cap + ')</h2></p>';

                //
                //		Here we add the TAB
                //

                $(`<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0" style=";padding-right:0px;"><span id="` + tab_cap + `" class="` + clr + `"  style="margin-right:2px"><img src="images/s.gifx" alt="" style="width: 4px; height: 12px; margin: 0px;"></img></span><span class="tab_caption_text"> ` + tab_cap + ` &nbsp;</span></span></span>`).insertBefore( $('div#tabs2_section > span.insertpoint') ); // <img class="tab_spacer" width="4" height="24" src="images/s.gifx" />

                def_mesg = `<table><tbody>
<tr id=hopach style=""><td><a id=but1 class=mybut> Show attachments </a></td><td><a id=but2 class=mybut> Show/Hide filtered attachments </a></td><td><a id=but3 class=mybut> SortbySize </a></td><td>
<span id=records></span></td><td><span id=recordsdisplayed></span>
</td><td><a id=but4 disabled class="mybut btn" style="float:right;"> Hide Selected</a></td><td align="right"><span id=selvisi style="text-align: right;">0</span></td><td><a id=but5 disabled class="mybut btn" style="float:right;"> Show Selected</a></td><td align="right"><span id=selinvisi style="text-align: right;">0</span>
</td><td><a id=but6 class=mybut style="float:right;"> Undo all hiding</a>
</td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td><td> &nbsp; </td>
</tr>
<tr><td>  &nbsp; </td></tr>
</tbody></table>
<table width=100% ><tbody><tr><td id=attachtbl colspan=20>  &nbsp; </td></tr></tbody></table>`;


                //
                //		Here we build the TAB Section annotation-wrapper
                //
                var tabsect = `\
<span tab_caption="` + tab_cap + `" class="tabs2_section mytab wide" cellspacing="0" style="display:none;">`;
                //
                //		Here we insert the TAB Section
                //
                $( tabsect + '<span id="section_tab.' + tab_cap + '" class="tabs2_section mytab section" tab_caption_raw="' + tab_cap + '" tab_caption="' + tab_cap + '" style="display:none;">' + def_mesg + '<p>&nbsp;<p>&nbsp;<p>&nbsp;<p></span></span>' ).insertAfter( $('#tabs2_section') );

                //
                //      Here we add events and logic
                //
                TabClickHover(tab_cap);

                GM_addStyle('.trhidden                   { background-color:#ccc;color:#000;  ');
                GM_addStyle('.trhidden.notification-info { background-color:#Fcc;color:#000;  ');
                GM_addStyle('#hopach { border:1px solid #aaa;background-color:#eee;color:#000;  ');
                GM_addStyle('#hopach td { padding:5px 15px !important;  ');
                GM_addStyle('.trnodisp { display:none; ');

                $('#but1').on('click', function() {
                    GM_log('# but1 click');
                    Attachments_main();
                });
                $('#but2').on('click', function() {
                    GM_log('# but2');
                    $('.trhidden').toggleClass('trnodisp');
                });
                $('#but3').on('click', function() {
                    GM_log('# but3 click');
                    Attachments_main('size');
                });
                $('#but4').attr('disabled', true );
                $('#but5').attr('disabled', true );
            }


            function gm_http() {

                var sid = '';
                var post_content = '';
                GM_log('#=#=# phpbb1 clicked ');
                GM_xmlhttpRequest({
                    method: "POST",
                    //			data: 'mode=login&username=user.name&password=QAZwsx123',
                    //			user: 'michel.hegeraat', password: 'ZXCsdf456!',    				only works with basic authentication
                    data: 'mode=login&username=michel.hegeraat&password=ZXCsdf456!',
                    url: 'http://eubebruphpbb/phpbb3_1/ucp.php',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onerror: function(response) {
                        GM_log('#=#=# post error response ....', response.readyState, response.status, response.statusText);
                    },
                    onload: function(response) {
                        GM_log('#=#=# post response ....', response.readyState, response.status, response.statusText, response.finalUrl);
                        post_content = response.responseHeaders;
                        var u = post_content.indexOf('sid=') + 4 ;
                        sid = post_content.substr(u,32 );
                        $('#phpbbarea1').val( post_content + '\nsid=' + sid + '\n\n' + response.responseText+ '\n\n' +  response.responseText.indexOf('You have been successfully logged in') );
                        gm_http2( post_content, sid );
                    }
                });
                GM_log('#=#=# done with post  ....' );
            }

            function gm_http2( post_content, sid ) {

                GM_log('#=#=# continue with get ....' , sid);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://greasyfork.org/scripts/26921-itsm/code/ITSM+.user.js' ,
                    headers:  post_content ,
                    onprogress: function(response) {
                        GM_log('#=#=# get onprogress response ....', response.readyState, response.readyState, response.status, response.statusText);
                    },
                    ontimeout: function(response) {
                        GM_log('#=#=# get ontimeout response ....', response.readyState, response.readyState, response.status, response.statusText);
                    },
                    onerror: function(response) {
                        GM_log('#=#=# get onerror response ....', response.readyState, response.readyState, response.status, response.statusText);
                    },
                    onload: function(response) {
                        GM_log('#=#=# get response ....', response.readyState, response.status, response.statusText, response.finalUrl);
                        $('#phpbbarea2').val(response.responseHeaders + '\n\n\n\n' +  response.responseText);
                    }
                });
                GM_log('#=#=# done with get ....' );

            }

            function tabs_move(tab_class,color) {
                $('#tabs2_section > span.tab_header > span.tabs2_tab > span.tab_caption_text:contains("Closure")'        ).parent().parent().addClass('closdeti');
                $('#tabs2_section > span.tab_header > span.tabs2_tab > span.tab_caption_text:contains("Contract")'       ).parent().parent().addClass('contractchange').css('display','none');
                $('#tabs2_section > span.tab_header > span.tabs2_tab > span.tab_caption_text:contains("Closure details")').parent().parent().addClass('closdeti');
                $('#tabs2_section > span.tab_header > span.tabs2_tab > span.tab_caption_text:contains("Planning")'       ).parent().parent().addClass('planning');
                $('#tabs2_section > span.tab_header > span.tabs2_tab > span.tab_caption_text:contains("Contract change")').parent().parent().addClass('contractchange').css('display','none');
                $('span.contractchange').clone().insertBefore( $('span.planning') );
                if ( $('span.contractchange:eq(1)').length > 0 ) {
                    $('span.contractchange:eq(1)').attr('style','').addClass('insertpoint');
                } else {
                    $('span.planning').addClass('insertpoint');
                }
                TabClickHover('contractchange');
                $('span.insertpoint > span:nth-child(1)').on('click', function() {														// if new tab clicked
                    GM_log('#  Contract change clicked');
                    nicetab( $('span.insertpoint > span:nth-child(1)') );
                    $('span.tabs2_section').hide();
                    $('span.tabs2_section0').show();
                    $('span.tabs2_section[tab_caption*="Contract"]').show();
                });
                $('span.contractchange:eq(1)').find('span.tab_caption_text:contains("Contract change")').attr('id','contractchange');
                $('span.insertpoint > span:nth-child(1)').hover(																		// if new tab hovered
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
            }

            function tab_find(tab) {
                for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
                    var tabcap = $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().trim().replace(/\s+/g,' ');
                    tab = tab.trim().replace(/\s/g,' ');
                    GM_log('#=#=#=# findtab ' + c + ' ['+ tab +'] === [' + tabcap + ']' + ' tabindex ' + $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent().parent().index() );
                    if ( tabcap === tab ) {
                        break;
                    }
                }
                if ( c < $('#tabs2_section span.tab_caption_text').length ) {
                    return c;
                } else {
                    GM_log('#=#=#=# findtab '+ tab +' not found -1');
                    return -1;
                }
            }



            function case_tabs_hover() {
                var case_div_timer;
                $('span.tpcases').hover( function(e) {
                    GM_log('# ');
                    var p = e.target;
                    var posi = $('#' + p.id).offset();
                    var Xco, Yco;
                    if ( typeof posi !== 'undefined') {
                        Xco = posi.top + 20;
                        Yco = posi.left;
                    } else {return;}
                    var casetxt = $('#' + p.id).text().split(':');
                    var sys_id  = $('#' + p.id).attr('sys_id');
                    var vdr = casetxt[0].trim();
                    GM_log('##== hovering::', Xco , Yco , casetxt[0] );
                    var phntxt;
                    var mltxt;
                    var mlcc = '';
                    var t4c = '';
                    var shds = $('#' + script + '\\.short_description').val();
                    t4c  = $('#' + script + '\\.work_notes').val();
                    mailaddr = '';
                    subj     = '';
                    phnnr    = '';
                    if ( vdr === 'INT') tit = 'Internal cross reference';
                    if ( vdr.toUpperCase().indexOf('ALCATEL') > -1 ) { vdr = 'AL-LU'; }
                    if ( vdr === 'CISCO') {
                        tit      = 'Cisco TAC';
                        phnnr    = '+3227045555';
                        mailaddr = 'attach@cisco.com';
                        mlcc     = 'attach@cisco.com';
                        subj     = 'SR {case} : ';
                    }
                    if ( vdr === 'EMC') {
                        tit      = 'EMC Support';
                        phnnr    = '0080077179';
                        mailaddr = 'support@emc.com';
                        subj     = 'SR{case} : ';
                    }
                    if ( vdr === 'INFOBLOX') {
                        tit      = 'Infoblox Support';
                        phnnr    = '+3232590440';
                        mailaddr = 'infoblox@mailca.custhelp.com';
                        subj     = '[' + CustNM +'] '+ shds +' [Incident: {case}]';
                    }
                    if ( vdr === 'NIMSOFT') {
                        tit      = 'Nimsoft/CA Support';
                        phnnr    = '0080081175';
                        mailaddr = 'support@nimsoft.com';
                        subj     = 'Nimsoft Case {case} : ';
                    }
                    if ( vdr === 'F5') {
                        tit      = 'F5 Support';
                        phnnr    = '+1180011275435';
                    }
                    if ( vdr === 'AVAYA') {
                        tit      = 'Avaya Support';
                        phnnr    = '+3227106187';
                    }
                    if ( vdr === 'JUNIPER') {
                        tit      = 'Juniper Support';
                        phnnr    = '0080072895';
                        mailaddr = 'support@juniper.net';
                        subj     = 'Case {case} : ';
                    }
                    if ( vdr === 'FORTINET') {
                        tit      = 'Fortinet Support';
                        phnnr    = '+33489870555';
                    }
                    if ( vdr === 'WESTCON') {
                        tit      = 'Fortinet Support';
                        phnnr    = '+3224610170';
                        mailaddr = 'info@westconsecurity.be';
                        subj     = 'Westcon Case {case} : ';
                    }

                    maildet = '';
                    var tpcase = casetxt[1].replace('?','').trim();
                    var mlto = mailaddr;
                    //			mlcc = mailaddr;
                    subj = subj.replace('{case}', tpcase);
                    if ( GM_getValue('tpcase_'+ tpcase ) ) {
                        GM_log('# Found tpcase_'+ tpcase);
                        casedetails = GM_getValue('tpcase_'+ tpcase ).split(';');
                        if ( casedetails[0].length > 1 ) { tit   = casedetails[0]; }
                        if ( casedetails[1].length > 1 ) { phnnr = casedetails[1]; }
                        if ( casedetails[2].length > 1 ) { mlto  = casedetails[2]; }
                        if ( casedetails[3].length > 1 ) { subj  = subj + casedetails[3]; }
                    } else {
                        GM_log('# Not found tpcase_'+ tpcase);
                    }
                    if ( phnnr !== '' ) {
                        phntxt  = '<a class="phnlnk" title="Call ' + tit + ' on ' + phnnr + '" href="tel:' + phnnr + '"><img class="phncl" src="images/mobile/phone.gifx"></a><b> ' + phnnr + ' </b>';
                    } else {
                        phntxt  = '';
                    }
                    if (mlcc !== '') { mlcc = '&CC=' + mlcc; }
                    //			phntxt += '<a class="phnlnk" id=casedet title="Add case details" style="float:right;"><img height="14" width="14"  src=images/icons/business_services.gifx /></a>';  style="background-color:#ccc;border: solid 3px #ccc;border-radius:7px;padding:7px 7px 0px 7px;"
                    if ( mlto !== '' ) {
                        maildet = 'mailto://' + mlto + '?subject=' + subj + mlcc + '&body=Hi ' + tit + ',\n\n';  // onclick="alert(\'clicked\');tpcase_mailclick(\'' + maildet + '\');"
                        mltxt   = '<a id=tpcm class="phnlnk" title="Mail ' + tit + '" ><img height="14" width="14" class="mllnk" src="images/mobile/email.gifx"></img></a><b> ' + mlto + ' </b>';
                        // mltxt = mltxt + '<br><a class="phnlnk" title="Mail ' + tit + '" href="mailto://' + mlto + '?subject=' + subj + '&CC=' + mlcc + '&body=' + t4c + '"><img height="14" width="14" class="mllnk" src="images/mobile/email.gifx"></img></a><b> ' + mlto + ' </b>';



                    } else {
                        mltxt   = '';
                    }


                    if ($("#case-div").length > 0) {
                        $("#case-div").remove();
                        if ($("#tpcase-set").length > 0) {
                            $("#tpcase-set").remove();
                        }
                    }

                    if ( phntxt !== '' || mltxt !== '' || tit !== '' ) {
                        case_div_timer = setTimeout(function() {
                            $("body").append('<div id="case-div" class="mypopup" title="Click to close" ><span>' + phntxt + '</span><p><span>' + mltxt + '</span><br><span id=tpset style="float:right;line-height:10px;font-size:10px;"><a id=tpsetA><img src="images/gear.gifx" title="Change setting for case ' + tpcase + '" /></a></span></div>');
                            $("#case-div").css('top',Xco + 'px').css('left',Yco + 'px').css('position','absolute').css('visibility','visible').on('click', function() { $("#case-div").hide(700).remove(); }  );
                            $('#tpcm').click( function(){
                                t4c  = $('#' + script + '\\.work_notes').val();
                                if ( t4c === '' ) { t4c  = 'Empty Work Notes field'; }
                                maildet = maildet + t4c;
                                t4c = 'Update to vendor: ' + vdr +  '\nTo: \t \t' + casedetails[2] + '\nSubject: \t' + casedetails[3] + '\n=========================\n\n' + t4c;
                                $('#' + script + '\\.work_notes').val(t4c);
                                GM_log('# maildet ', maildet );
                                tpcase_mailclick(maildet);
                            });
                            $('.phncl').click(function() {
                                var info = $(this).parent().attr("title");
                                $("#case-div").hide().remove();
                                phonecall(info);
                            });
                            $('#casedet').click(function() {
                                show_case_detail(e);
                            });
                            $('#tpsetA').click( function() {
                                tpcase_settings(tpcase,vdr,subj);
                            });

                        }, 400);
                    }


                }, function() {
                    clearTimeout(case_div_timer);
                });

                function tpcase_mailclick(mail_det) {
                    var t = parsevars( mail_det );
                    window.top.location = t;
                }


                function tpcase_settings(tpcase,vdr,subj){
                    var casedetails = ['','','',''];
                    GM_log('# tpcase_settings click ',vdr,tpcase);
                    var pos = $('#case-div').offset();
                    var Xco = pos.top + 55;
                    var Yco = pos.left + 90;																												// ' + vdr + '
                    $("body").append('<div id="tpcase-set" class="mypopup"> <table style="background-color:transparent;border-collapse:initial;border-spacing:5px;"><tr><td colspan=2>Settings for <b>' + vdr + '</b> case: <b>' + tpcase + '</b></td></tr><tr><td class="mylbl">Contact:</td><td><input class="my-form" size=40></input></td></tr><tr><td class="mylbl">Phone:</td><td><input class="my-form" size=40></input></td></tr><tr><td class="mylbl">Email:</td><td><input class="my-form" size=40></input></td></tr><tr><td class="mylbl">Subject:</td><td><input class="my-form" size=40></input></td></tr><tr><td></td><td> <a id=tpcaseok class="mybut" style="float:right;">OK</a><a id=tpcancel class="mybut" style="float:right;margin-right:5px;">Cancel</a> </td></tr></table></div>');
                    $("#tpcase-set").css('top',Xco + 'px').css('left',Yco + 'px').css('position','absolute').css('visibility','visible');  // .on('click', function() { $("#case-div").hide(700).remove(); }
                    if ( GM_getValue('tpcase_'+ tpcase ) ) {
                        GM_log('# tpcase_settings click tpcase_' + tpcase + ' exists');
                        casedetails = GM_getValue('tpcase_'+ tpcase ).split(';');
                        for (i = 1; i < casedetails.length + 1; i++ ){
                            $('#tpcase-set > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(' + (i + 1) + ') > td:nth-child(2) > input:nth-child(1)').val( casedetails[i-1] );
                            if ( i === 4 &&  casedetails[i-1] === ''  )  $('#tpcase-set > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(' + (i + 1) + ') > td:nth-child(2) > input:nth-child(1)').val( subj );
                            GM_log('# tpcase_settings ' + casedetails[i-1] );
                        }
                    }
                    $('#tpcancel').click(function(){
                        $("#tpcase-set").remove();
                        $("#case-div").remove();
                    });
                    $('#tpcaseok').click(function(){
                        for (i = 1; i < casedetails.length + 1; i++ ){   // #tpcase-set > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)         > td:nth-child(2) > input:nth-child(1)
                            casedetails[i - 1] =                         $('#tpcase-set > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(' + (i + 1) + ') > td:nth-child(2) > input:nth-child(1)').val();
                            GM_log('# saving ', casedetails[i - 1] );
                        }
                        GM_log('# Saving tpcase_'+ tpcase);
                        GM_setValue('tpcase_'+ tpcase, casedetails.join(';') );
                        $("#tpcase-set").remove();
                        $("#case-div").remove();
                        GM_log('# Saved tpcase_'+ tpcase + ' with: ' + casedetails.join(';') );
                    });
                }

            }
            function tab_PWS() {

                $('<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0"><SPAN id="PWS" class="tab_caption_text" style="padding:4px 1px 4px 1px;"></span><span class="tab_caption_text noselect"><a class="mybut_" title="Direct link to the PWS server." href="https://pws/" target="_blank">PWS</a></SPAN></span></span>').insertBefore( $('#tabs2_section > span.insertpoint' ) ); // <img class="tab_spacer" width="4" height="24" src="images/s.gifx" />
                //			$('<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0"><SPAN id="PWS" class="tab_caption_text" style="padding:4px 1px 4px 1px;"></span><span class="tab_caption_text noselect"><a class="mybut_" title="Direct link to the PWS server." href="https://pws?cust=' + CustNM + '" target="_blank">PWS</a></SPAN></span></span>').insertBefore( $('#tabs2_section > span.insertpoint' ) ); // <img class="tab_spacer" width="4" height="24" src="images/s.gifx" />

                $('span#PWS' ).parent().hover(
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
            }
            // <img width=40 src=https://secret.eu.didata.com/DisplayImage.ashx?name=Logo />


            function tab_moveit() {
                GM_log('# add moveit');
                var dmn  = 'nttltd.global.ntt';   // domain;
                var dmn1 =  domain2;
                var subj ='RE: ' + casenr + ' - ' + encodeURIComponent($('#' + script + '\\.short_description').attr('value'));
                GM_log('# add moveit1' , MyFirstName, MyLastName );
                var body;
                if (MyFirstName) {
                    body = MyDear + '%0D%0A%0D%0APlease upload your big files (>20MB) here.%0D%0A%0D%0APlease send the package to: ' + unsafeWindow.window.g_user.userName + '.' + parsevars(MyMGSbody);
                } else { body = ''; }
                GM_log('# add moveit2');
                GM_log('# moveit add tab');
                $('<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0"><SPAN class="tab_caption_text" style="padding:4px 1px 4px 1px;"></span><span id="moveit" class="tab_caption_text noselect"><a class="mybut_"  title="Direct link to Moveit where ITSM+ can polulate your invite to the customer." href="https://moveit.' + dmn + '/samlsignon.aspx?arg12=secmsgcomposenew" target="_blank">MOVEit</a></SPAN></span></span>').insertBefore( $('#tabs2_section > span.insertpoint' ) );    // &opt01=' + recep + '&opt02=didatabosprod@service-now.com&arg01=' + subj + '&arg04=' + body+ ' <img class="tab_spacer" width="4" height="24" src="images/s.gifx" />
                $('span#moveit > a.mybut_').on('click', function() {
                    var dt = new Date();
                    GM_setValue('casemoveit', recep + ';' + subj + ';' + body );
                    GM_setValue('casedt', dt);
                });

                GM_log('# moveit hover');

                $('span#moveit' ).parent().hover(
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
                GM_log('# moveit done');
            }


            function tab_webex() {
                var dmn  =  domain;
                var dmn1 =  domain2;
                var dmn2 =  domain3;
                var subj =encodeURIComponent('RE: ' + casenr + ' - ' + $('#' + script + '\\.short_description').val() );
                var body = MyDear + parsevars(MyMGSbody);
                var recp = recep;
                if ( recp === '') recp = tolist;
                var wbx_href = 'https://nttlimited.webex.com/mc3200/meetingcenter/mcmeeting.do?siteurl=nttlimited&Action=normal_schedule&confName=' + subj + '&scheduler-who=' + recep ;
                $(`<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0">
<span class="tab_caption_text" style="padding:4px 1px 4px 1px;"></span>
<span id="webex" class="tab_caption_text noselect">
<a class="mybut_" title="Schedule webex meeting." href="` + wbx_href + `" target="_blank">Webex </a>
<a class="mybut" title="MyRoom\nMeet now." href="https://nttlimited.webex.com/meet/` + unsafeWindow.window.g_user.userName.split('@')[0] + `" target="_blank">@</a>
</span>
</span>
</span>`).insertBefore( $('#tabs2_section > span.insertpoint' ) ); //
                $('span#webex > a.mybut_').on('click', function() {
                    GM_log('# webx scheduler click');
                    GM_log('# wbx ' ,tolist );

                    var dt = new Date();
                    GM_setValue('casewbx', dt + ';' + recp + ';' + subj + ';' + body );
                });

                $('span#webex' ).parent().hover(
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
            }

            function tab_scram() {
                $('<span class="tab_header"><span class="tabs2_tab mytab" tabindex="0"><SPAN id="scram" class="tab_caption_text" style="padding:4px 1px 4px 1px;"></span><span class="tab_caption_text noselect"><a class="mybut_" title="Direct link to scram, can show scram IP\'s for some customers." href="https://scram.client.' + dmn2 + '/?cust=' + CustNM + '" target="_blank">Scram</a></SPAN></span></span>').insertBefore( $('#tabs2_section > span.insertpoint' ) );
                $('span#scram' ).parent().hover(
                    function() { $( this ).addClass(    "tabs2_hover" ); } ,
                    function() { $( this ).removeClass( "tabs2_hover" ); }
                );
            }

            function show_case_detail(e) {
                var p = e.target;
                var pos = $('#' + p.id).offset();
                Xco = pos.top + 20;
                Yco = pos.left;
                GM_log('#=#=#=   show_case_detail ' , e , Xco);
            }


            function scrollIntoView(eleID) {
                var e = unsafeWindow.document.getElementById(eleID);
                GM_log('#=#   scrollIntoView ' , e);
                if (!!e && e.scrollIntoView) {
                    e.scrollIntoView();
                }
            }

            function gusertest() {
                var uo = unsafeWindow.gsft.getUser();
                GM_log('#=test1#  FullName'    , uo.getFullName());
                GM_log('#=test1#  DisplayName' , uo.getDisplayName());
                GM_log('#=test1#  Email'       , uo.getEmail());
                GM_log('#=test1#  MobileNumber', uo.getMobileNumber ());
                GM_log('#=test1#  CompanyID'   , uo.getCompanyID());
                GM_log('#=test1#  ManagerName' , uo.getManagerName());
                GM_log('#=test1#  UserRoles'   , uo.getUserRoles());

                unsafeWindow.CustomEvent.observe('user.login', function(user) {
                    unsafeWindow.showObjectInline( unsafeWindow.gel("gsft_login") );
                    alert( user.getFullName() );
                });
            }

            function glidetest() {
                GM_log('#=test#  glidetest!');
                (function() {
                    var preferences = {};
                    var properties = {};
                })();

                var f = function() {
                    GM_log('#=test#  Gstuff function');
                    if (typeof(unsafeWindow.g_listHandlersLoaded) == 'undefined') {
                        unsafeWindow.g_listHandlersLoaded = true;
                        new unsafeWindow.GlideList2NewHandler();
                        new unsafeWindow.GlideList2ChecksHandler();
                        new unsafeWindow.GlideList2SecurityHandler();
                        GM_log('#=test#  new Gstuff');

                        addLoadEvent(function() {
                            unsafeWindow.CustomEvent.observe("toggle.sections", unsafeWindow.GlideList2.toggleAll);
                        });
                    }

                    GM_log('#=test#  do I get to 785?');
                    var list = new unsafeWindow.GlideList2('sys_user', 'sys_user', 'u_extension_numberISNOTEMPTY^ORmobile_phoneISNOTEMPTY^ORemailISNOTEMPTY^company=bb988efd0a0a3c780054ed8cfbc9f79e');
                    list.setListName('sys_user');
                    list.setFields('name,phone,mobile_phone,user_name');
                    list.setTitle('Users');
                    list.setListControlID('bfae77d30a0a3c0850a388367b322f0d');
                    list.setProperties('H4sIAAAAAAAAAJ2TTU/DMAyG/0qUExyAsml0k9YhTQOExJcQHDhFaeNuEW4yxSmwf4/bdWi7wMapsePXj+2448uvCsUHBLLeZfL8NJECXOGNdfNMvr5cnwzl5WR8Zyk+Bb+EEC2QKFHPiaPP09EoHQxGcu1R8dNnsseWL2pS3qkAZQBaZDKGGqRATqMK1MTiG7QGmry9jd+7GDwqazKZlxrS1PQTneh+kQwH/BkO+xdp3u/1ysR0kiaUVqRqgtC5fDAQ8lUmH59nV8/Tt+XCOyY7XcF2bPCfyjoDLrYFR53jzn20sXG8skGdpYhnUqMOa7ecjEsLaISlpk0IPDZWlBqp6VTngJl8YKwUtGAaWve+mUPUYQ5RlT5U29APjTWnaGqVZ/ukn9ZcExCJrsstUBf4O2kt2wt173OL8F9Q1arVAbxmxOJ2Jo6uTiptUWhjeJPo+HB2Y6jNTJc68Cnyq3YrUXhEKKJtlxV1BKPa4n7kf6neYbV3bEvgAy3s8jBRWxbCjuhs96+cfANQUuiqzAMAAA==');
                    list.setOrderBy('ORDERBYphone');

                    list.setView('');
                    list.setSubmitValue('sysparm_list_css', '');
                    list.setSubmitValue('sysparm_target', '');
                    list.setSubmitValue('sysparm_fixed_query', '');
                    list.setSubmitValue('sysparm_group_sort', '');
                    // if rows per page is specified, carry it along
                    if ('')
                        list.setSubmitValue('sysparm_rows_per_page', '');

                    if ('')
                        list.setSubmitValue('sysparm_nameofstack', '');

                    list.setReferringURL('sys_user_list.do?sysparm_query=u_extension_numberISNOTEMPTY%5EORmobile_phoneISNOTEMPTY%5EORemailISNOTEMPTY%5Ecompany%3Dbb988efd0a0a3c780054ed8cfbc9f79e');

                    list.setUserList(true);list.handlePrint(true);list = null;
                };

                if (typeof unsafeWindow.GlideList2 == "undefined") {
                    GM_log('#=test#  addLoadEvent');
                    unsafeWindow.addLoadEvent(f);
                }
                else {
                    GM_log('#=test#  f.call()');
                    f.call();
                }

            }

            function test1() {
                GM_log('#=test1#  test1()');
                var sections = unsafeWindow.g_form.getSections();
                GM_log('#=test1# ', sections);
            }

            function test2() {
                GM_log('#=test2# ' , $('tr.activity_data:nth-child(' + 326 + ') > td:nth-child(1) > span:nth-child(1) > div:nth-child(1)').html(), $("table[id^='activity_detail']").find('tr').length);
                GM_log('#=test2# ' , $("label[for='" + script + "\\.comments']").length ) ;
            }

            function itsm_settings() {
                if ($("#itsmset").length > 0) {
                    $("#itsmset").css('top','100px').css('left','100px').fadeIn(500);
                }
                else {
                    var options = GM_getValue('ITSMsettingsOptions1');
                    if ( typeof options == "undefined" ) { options='email template1\n'; } else { GM_log('#=#  options via GM getvalue'); }
                    var actions = GM_getValue('ITSMsettingsActions2');
                    if ( typeof actions == "undefined" ) {
                        actions='Hi {fn} {ln},\r\n\r\n\r\n\r\nBest regards\r\n\r\n';    ///.replace(/\n/g,'\\n')
                    } else { GM_log('#=#  action via GM_getValue'); }
                    var nrs =' ';
                    for (i = 1; i < 6; i++) {
                        nrs += i.toString();
                        if (i < 5) { nrs += '\n '; }
                    }
                    $("body").append(`<div id="itsmset" style="top:100px;left:100px;" class="mypopup" >  \
<form><table id="hopset" border=0 width="100%" class="drghdl1" style="background-color:transparent;"> \
<tr class=set1><td colspan="3" id="itsmdrag" class="draghandle"><a title=""><img src="images/help.gifx" style="float:left;"/></a>&nbsp;settings<a  style="float:right;"><span id=close-itsmset class="sprite1 close-button"></span></a></td></tr> \
<tr><td class=tbclk>Action Settings</td><td class=tbclk>Mail Template Settings</td><td class=tbclk>Other Settings</td></tr> \
<tr><td> &nbsp; <input class="ch" type="checkbox" name="ch0" value="valuable" id="ch0"/><label for="ch0"></label></td><td colspan=2 title="Check the box to show the blue banners in ITSM\nI have hidden them by default because I want to appear when apprpriate.">Always show banners                  </td></tr><tr> \
<tr><td> &nbsp; <input class="ch" type="checkbox" name="ch1" value="valuable" id="ch1"/><label for="ch1"></label></td><td colspan=2>Auto-submit on SWOW update           </td></tr><tr> \
<tr><td> &nbsp; <input class="ch" type="checkbox" name="ch2" value="valuable" id="ch2"/><label for="ch2"></label></td><td colspan=2>Auto-submit on reassign to closure Q </td></tr><tr> \
<tr><td>Line</td><td>Option</td><td>Action</td></tr><tr> \
<td><textarea disabled id="ta1" cols=1 rows=5>` + nrs + `</textarea></td>\
<td><textarea id="ta2" cols=24 rows=5>` + options + `</textarea></td>\
<td><textarea id="ta3" cols=60 rows=5>` + actions + `</textarea></td></tr> \
<tr class=set1><td colspan=3><label>Combo box:</label><input id=combo type="text" list="comboid">\
<datalist id="comboid">\
<option value="0">\
<option value="-30">\
<option value="30">\
<option value="+50">\
<option value="patat">\
<option value="tochtgat">\
<option value="zomaar">\
<option value="lorum">\
<option value="ipsem">\
<option value="pater">\
<option value="vadim">\
<option value="l">\
</datalist></td></tr> \
<tr><td colspan=3><meter min=0 max=24 value=12>12 units</meter> <progress id="prog" max=100></progress>\
<span id=flup-itsmset class="sprite1 flup-button"></span></td></tr> \
<tr><td colspan=3><a id="saveset">Save</a> &nbsp; &nbsp; &nbsp; <a id="clsSet">Cancel</a> &nbsp; <a id="resSet" title="\
Reset to default values\nSave SVR before using">Reset</a></td></tr> \
</table></form> \
</div>`);
                    $("#saveset").click(saveset).addClass('mybut');
                    $("#ta1").addClass('flataera');
                    $("#ta2").addClass('flataera');
                    $("#ta3").addClass('flataera');
                    $("#itsmset").css('position','absolute').css('visibility','visible'); // .udraggable({ handle: '.drghdl1' });
                    $("#clsSet").click(closeset).addClass('mybut');
                    $("#resSet").click(resetset).addClass('mybut');
                    $('#itsmdrag').on('mousedown', function(e) {
                        GM_log('#=#= drag' , $(e.target).closest('div').attr('id') ,   $(e.target).attr('id') );
                        if ( $(e.target).attr('id') === 'close-itsmset') {
                            GM_log('# hide cc 1');
                            $("#itsmset").hide();
                        } else {
                            if(e.offsetX===undefined){
                                xoff = e.pageX-$(this).offset().left;
                                yoff = e.pageY-$(this).offset().top;
                            } else {
                                xoff = e.offsetX;
                                yoff = e.offsetY;
                            }
                            $(this).addClass('draggable');
                            $('body').addClass('noselect');
                            $target = $(e.target).closest('div');
                        }
                    });

                }
            }

            function saveset() {
            }
            function closeset() {
                $("#itsmset").hide();
            }
            function resetset() {
            }




            function test3() {

                //		Initialize the GlideDialog window
                GM_log('#=test3#  test3()');
                var w = new unsafeWindow.GlideDialogWindow('sys_user');
                w.setSize(750,300);
                w.setTitle('show sys_user_list');
                w.setPreference('table', 'sys_user');
                w.setPreference('sysparm_view', 'sys_user_list');
                //		Set the query for the list
                var customer = 'bb988efd0a0a3c780054ed8cfbc9f79e';
                var query = 'u_extension_numberISNOTEMPTY%5EORmobile_phoneISNOTEMPTY%5EORemailISNOTEMPTY%5Ecompany%3D' + customer;
                w.setPreference('sysparm_query', query);
                //		Open the popup
                GM_log('#=test3#  render()');
                w.render();
            }

            function rfsh() {
                location.reload();
            }

            function test4() {
                var url = 'sys_user' + 'list.do?';
                var customer = 'bb988efd0a0a3c780054ed8cfbc9f79e';
                var query = 'sysparm_query=u_extension_numberISNOTEMPTY^ORmobile_phoneISNOTEMPTY^ORemailISNOTEMPTY^company=' + customer;
                url += query;
                var w = unsafeWindow.getTopWindow();
                w.popupOpenFocus(url, 'related_list',  950, 700, '', false, false);
            }

            function find_refs_in_request_log() {
                var p = $('span.tabs2_section_3').length;
                if (p > 0) {
                    GM_log('#=# ', $('span.tabs2_section_3').attr('tab_caption_raw') );
                    var z = $('span.tabs2_section_3').html();
                    p = 0;
                    while ( z.indexOf('Ref:',p)  > 0 ) {
                        p = z.indexOf('Ref:',p);
                        GM_log('#=# ', z.substr(p, 18)  );
                        p = p + 10;
                    }
                }
            }


            function linkify(inputText) {
                var replacedText, replacePattern1, replacePattern2, replacePattern3;

                //URLs starting with http://, https://, or ftp://
                replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                replacedText = inputText.replace(replacePattern1, '<a class="cnlnk" href="$1" target="_blank">$1</a>');

                //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                replacedText = replacedText.replace(replacePattern2, '<a class="cnlnk" href="http://$2" target="_blank">$2</a>');

                //Change email addresses to mailto:: links.
                replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
                replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

                return replacedText;
            }


            function searchphn() {
                GM_log('#=# color the phones');

                $('#element\\.' + script + '\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:nth-child(3n)').each( function() {
                    $(this).find('span > span').hlitephnnr();
                });

                GM_log('#=# color the phones add images');
                $('.phncl').click(function() {
                    var xinfo = $(this).parent().attr("title");
                    phonecall(xinfo);
                });

            }



            function swowhilite() {
                var f = 0;
                var p = 3;
                var sd = script.toUpperCase().replace('U_','').replace('RIM_','') + ' DESCRIPTION';
                GM_log('# SWOW  ', sd);

                $('#element\\.' + script + '\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:nth-child(3n):icontains("' + sd + '")').each( function() {
                    if ( $(this).find('div > span').text().toUpperCase().indexOf('ACTION PLAN') > 0 ) f++;
                });

                $('#element\\.' + script + '\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:nth-child(3n)').each( function() {
                    if ( $(this).prev().find('a').attr('href').indexOf('dimensiondata') < 0  ) $(this).addClass('itsmplus');
                });

                $('#element\\.' + script + '\\.comments\\.additional > span:nth-child(1) > div:nth-child(1) > div:nth-child(3n+2)').each( function() {
                    $(this).find('span.tdwrap').append(' &nbsp; &nbsp; &nbsp; <span class="itsmplus"><span class="lnky" title="Show clickable links in this update." style="cursor:pointer;color:blue;font-size:15px;"> &#9741; </span> &nbsp; <span class="phny" title="Show clickable phonenumbers in this update." style="cursor:pointer;color:blue;"> &#9990; </span></span>');   //
                });
                //sys_display.original.u_request.          assignment_group original\\.
                //		GM_log('# SWOW  ', script,  unsafeWindow.g_form.getValue('sys_display.original.' +script + '.assignment_group'), $('#sys_display\\.' + script + '\\.assigned_to').val() );
                if ( f === 0  &&  $('#sys_display\\.' + script + '\\.assigned_to').val() !== '' ) {                           //  Swow not just for be.tech?  $('#sys_display\\.' + script + '\\.assignment_group').val() === 'EU.BE.TechSupport' &&
                    if ( unsafeWindow.g_form.getValue('sys_display.original.' +script+ '.assignment_group').indexOf('EU.BE.') > -1 ) $('#myinfo_box').text( '   Add a SWOW Update!!!    ' ).addClass('info_box').css('display','table-cell').show();
                    // if ( $('#sys_display\\.original\\.' + script + '\\assignment_group').val().indexOf('EU.BE') > -1 ) checkGDClist(CustNM);
                    //            checkGDClist(CustNM);
                }
                GM_log('# SWOW entries found ', f );
                swowentries = f;
                $('#element\\.' + script + '\\.work_notes\\.additional > span > div').find('div > span > span:contains("Breached")').addClass('faultbg');
                $('.lnky').on('click', function() {
                    GM_log('# lnky clicked ');
                    if ($(this).hasClass('lnky')) $(this).parent().parent().parent().next().html( linkify( $(this).parent().parent().parent().next().html() ) );
                    $(this).removeClass('lnky');
                });
                $('.phny').on('click', function() {
                    GM_log('# phny clicked ');
                    if ($(this).hasClass('phny')) $(this).parent().parent().parent().next().find('span > span').hlitephnnr();
                    $(this).removeClass('phny');
                    $('.phncl').click(function() {
                        var xinfo = $(this).parent().attr("title");
                        phonecall(xinfo);
                    });
                });
            }


            function swowhilitelog() {
                var f = 0;
                var sd = script.toUpperCase().replace('U_','') + ' DESCRIPTION';
                $('ul#activity-stream-unordered-list-entries').find('li > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1)').each( function() {		//	:contains("' + sd + '")
                    if ( $(this).text().toUpperCase().indexOf('ACTION PLAN') > 0 ) {
                        $(this).toggleClass('swowhilite');
                        $(this).prev().toggleClass('swowhilite');
                        f++;
                    }
                });
                GM_log('# SWOW LOG entries found ', f );
            }






            function wiva_on_off() {
                GM_log('#=#=#=#  Toggle wiva buttons');
                if ( GM_getValue('wivastate') === 'on' ) {
                    $('#wiva').css('display','none');
                    $('#wivaimg').attr('src','images/activity_filter_on.gifx');
                    $('#wiva2').css('display','none');
                    $('#wivaimg2').attr('src','images/activity_filter_on.gifx');
                    GM_setValue('wivastate','off');
                    GM_log("#=#=#=#  wiva buttons hide ",  $('#wivaimg').attr('src') );
                } else {
                    $('#wiva').css('display','inline');
                    $('#wivaimg').attr('src','images/activity_filter_off.gifx');
                    $('#wiva2').css('display','inline');
                    $('#wivaimg2').attr('src','images/activity_filter_off.gifx');
                    GM_setValue('wivastate','on');
                    GM_log("#=#=#=#  wiva buttons show ",  $('#wivaimg').attr('src') );
                }
            }



            function myalert(txt) {
                GM_log('#=#=#=#  myalert called');
                $('span#anotif').before('<span id="toplrt" class="redalert" ><img src="/images/arrows_expand_sm.gifx" title="' + txt.replace(/<p>/ig,'\n').replace(/<br>/ig,'\n').replace(/<hr>/ig,'\n____________________________\n')  + '"/>').text(' &nbsp; ' + txt + ' &nbsp; ');
                setTimeout(function(){ clearmyalert(); }, 700);
                $('#alarmmsg').html(txt);
            }

            function clearmyalert() {
                $('span#anotif').html('').css('padding','0px');
            }

            function Attachments_main(para1) {
                $('#recordsdisplayed').text('This may take a while.');
                var tbl = '';
                var gr = new GlideRecord('sys_attachment');                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
                gr.addQuery('table_sys_id',unsafeWindow.window.NOW.sysId);
                if (para1 === 'size') { gr.orderByDesc('size_bytes'); } else {gr.orderByDesc('sys_created_on');}
                gr.query(gr2tbl);

                function gr2tbl(gr) {
                    GM_log('# gr2tbl' , gr, gr.getLimit());
                    GM_addStyle(' .disp        { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-o-user-select:none; }');
                    GM_addStyle(' .trhidden    { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;-o-user-select:none; }');
                    GM_addStyle(' .dips        { border: 1px solid #ccc; background-color: #eee;}');
                    GM_addStyle(' .dips th     { padding: 4px 15px !important;  }');
                    GM_addStyle(' .disp td     { padding: 4px 15px !important;  }');
                    GM_addStyle(' .trhidden td { padding: 4px 15px !important;  }');
                    GM_addStyle(' .attname     { border-width: 1px solid rgb(189, 192, 196);border-radius: 3px; width: 100% !important;  }');
                    var collst = [2,4,7,8,9,10,13,15,19,20];
                    //            var collst = [2,4,10,15];
                    var reccntr = 0;
                    var bannerlist = GM_getValue(casenr+'hidelist', '');
                    if (bannerlist==='' && gr.rows.length > 100 ) { $('#recordsdisplayed').text('First time run! This may take a while.'); }
                    $('#records').text( 'Total number of attachments: ' + gr.rows.length );

                    var seenlist = '';
                    if ( gr.rows[0] ) {
                        tbl = '<table><tr class=dips>'; // <th>Chk</th>
                        for (x = 0; x < gr.rows[0].length; x++ ) {
                            if ( collst.indexOf(x) > -1) { tbl += '<th>' + gr.rows[0][x].name + '</th>';}
                        }
                        tbl += '<th>Attachment</th></tr>';
                    }
                    while ( gr.next() ) {
                        $('#records').text('Working on record ' +  reccntr + ' out of ' + gr.rows.length);
                        trclass = 'disp';
                        GM_log('# test ', gr.content_type , gr.u_integration_status , gr.size_bytes+'_'+ gr.size_compressed,  gr.sys_id);
                        if ( gr.u_integration_status === 'h') trclass = 'trhidden trnodisp';
                        if ( gr.u_integration_status === '' && gr.content_type.indexOf('image/') > -1 ) {
                            if ( bannerlist.indexOf(gr.size_bytes +'_'+ gr.size_compressed) > -1 || seenlist.indexOf(gr.size_bytes +'_'+ gr.size_compressed) > -1  ) {  // is it on the list of logo's or dup's to be hidden ?
                                GM_log('# Attachments_main  Hide duplicate.');
                                gr.u_integration_status = 'h';
                                if (mycase) gr.update(done);
                                // multupdate?
                                trclass = 'trhidden trnodisp';                                                                                                          // yes, so hide it.
                            } else {
                                seenlist += ',' + gr.size_bytes+'_'+ gr.size_compressed;                                                                               // no, show it
                            }
                            if (trclass === 'disp' && gr.content_type.indexOf('image/') > -1 && blklst(gr.size_bytes, gr.size_compressed) ) {                          // is it a known logo/banner ?
                                GM_log('# Attachments_main  Hide banner.');
                                gr.u_integration_status = 'h';
                                if (mycase) gr.update(done);
                                // multupdate?
                                trclass = 'trhidden trnodisp';
                                bannerlist += ',' + gr.size_bytes+'_'+ gr.size_compressed;                                                                             // yes, so hide it.
                            }
                        }
                        tbl += '<tr id=tr_"' + reccntr + '" class="' + trclass + '">'; //<td> &nbsp; <input class="attachchk" type=checkbox value=' + gr.sys_id + ' id="att_' + reccntr + '" style="padding:15px;" /> &nbsp; </td>
                        for (x = 0; x < gr.rows[0].length; x++ ) {
                            //                    console.log ('#=#=  Name: '+ gr.rows[reccntr][x].name + '   Value: ' + gr.rows[reccntr][x].value , x);
                            if ( collst.indexOf(x) > -1) {
                                if ( x === 4 ) {  // attachment name we may want to alter
                                    tbl += '<td><span class="attname" title="Changed name is updated to database when field looses focus." oldval="'+  gr.rows[reccntr][x].value + '">'+  gr.rows[reccntr][x].value + '</span></td>';
                                } else {
                                    tbl += '<td>'+  gr.rows[reccntr][x].value + '</td>';
                                }
                            }
                        }
                        if (trclass === 'disp') {
                            if (gr.content_type.indexOf('image/') > -1) {
                                tbl += '<td><a class="attachment" href="#" onclick="tearOffAttachment(\'' + gr.sys_id + '\');"><img src=/sys_attachment.do?sys_id=' + gr.sys_id + ' style="max-height:200px;" /></a></td></tr>';
                            } else {
                                tbl += '<td><a class="attachment" href="#" onclick="tearOffAttachment(\'' + gr.sys_id + '\');"><img src="images/icons/attach_text.gifx"></a></td></tr>';
                            }
                        } else {
                            tbl += '<td><a class="attachment" href="#" onclick="tearOffAttachment(\'' + gr.sys_id + '\');">img</a></td></tr>';
                        }
                        reccntr++;
                    }
                    //            if (mycase) gr.updateMultiple();
                    // could this work?
                    tbl += '</table>';
                    $('#attachtbl').html(tbl);
                    $('#records').text( 'Total number of attachments: ' + reccntr );
                    $('#recordsdisplayed').text( 'Number of attachments displayed: ' + $('tr.disp').length );
                    GM_setValue(casenr+'hidelist', bannerlist);
                    console.log ('#=#=  hide list: '+ bannerlist );
                    var mousebut   = 'up';
                    var oldattname = '';
                    $('span.attname').bind('click', function(e) {
                        GM_log('# input changed ['+  $(this).text() + '][' +$(this).parent().prev().prev().find('input').val()+ '][' + $(this).attr('oldval') + ']' );
                        $(this).attr('contentEditable', true);
                        GM_log('# input ',  $(this).val() );
                        oldattname = $(this).val();
                        e.stopPropagation();
                        return false;
                    }).blur( function() {
                        GM_log('# input focus lost');
                        $(this).attr('contentEditable', false);
                        if  ( $(this).text() !==  $(this).attr('oldval') ) {
                            var gr = new GlideRecord('sys_attachment');
                            var sys_id = $(this).parent().prev().prev().find('input').val().toString().trim();
                            gr.get( sys_id );
                            GM_log('# input has changed ' + sys_id + '    ' + gr.file_name + ' should become ' + $(this).text() , gr.sys_id );
                            gr.file_name = $(this).text();
                            gr.update(done);
                        }
                        return false;
                    });

                    $('tr.disp').on('mousedown', function() {
                        $(this).toggleClass('notification-info');
                        mousebut = 'down';
                        $('#selvisi').text($('tr.disp.notification-info').length);
                        if ( $('tr.disp.notification-info').length > 0 ){ $('#but4').attr('disabled', false );} else { $('#but4').attr('disabled', true ); }  // .prop('disabled', 'disabled').prop('disabled', false )
                    }).on('mouseup', function() {
                        mousebut = 'up';
                    });
                    $('tr.disp').on('mouseover', function() {
                        if (mousebut === 'down') $(this).toggleClass('notification-info');
                        $('#selvisi').text($('tr.disp.notification-info').length);
                        if ( $('tr.disp.notification-info').length > 0 ){ $('#but4').attr('disabled', false );} else { $('#but4').attr('disabled', true ); }
                    });
                    $('tr.trhidden').on('mousedown', function() {
                        $(this).toggleClass('notification-info');
                        mousebut = 'down';
                        $('#selinvisi').text($('tr.trhidden.notification-info').length);
                        if ( $('tr.trhidden.notification-info').length > 0 ){ $('#but5').attr('disabled', false );} else { $('#but5').attr('disabled', true ); }
                    }).on('mouseup', function() {
                        mousebut = 'up';
                    });
                    $('tr.trhidden').on('mouseover', function() {
                        if (mousebut === 'down') $(this).toggleClass('notification-info');
                        $('#selinvisi').text($('tr.trhidden.notification-info').length);
                        if ( $('tr.trhidden.notification-info').length > 0 ){ $('#but5').attr('disabled', false );} else { $('#but5').attr('disabled', true ); }
                    });
                    $('#but4').on('click', function() {
                        $('tr.disp.notification-info').each(function(){
                            hideatt( $(this).find('td:nth-child(1) > input.attachchk').val());
                            $(this).addClass('trhidden').removeClass('disp notification-info');
                        });
                    });
                    $('#but5').on('click', function() {
                        $('tr.trhidden.notification-info').each(function(){
                            showatt( $(this).find('td:nth-child(1) > input.attachchk').val());
                            $(this).addClass('disp').removeClass('trhidden notification-info');
                        });
                    });

                    $('#but6').on('click', function() {
                        $('#recordsdisplayed').text('This may take a while.');
                        var gr = new GlideRecord('sys_attachment');
                        gr.addQuery('table_sys_id',unsafeWindow.window.NOW.sysId);
                        gr.addQuery('u_integration_status','!=','');
                        gr.query();
                        $('#records').text( 'Total number of attachments to process: ' + gr.rows.length );
                        gr.u_integration_status = '';
                        if (mycase) gr.updateMultiple();
                        GM_deleteValue(casenr+'hidelist');
                        //                Attachments_main();
                    });

                    $('.attachchk').on('change', function(e) {
                        GM_log('# chk clicked ', $(this)["0"].id ,$(this).val() , $(this) );
                        var gr = new GlideRecord('sys_attachment');
                        gr.get( $(this).val() );
                        GM_log('# ', gr.u_integration_status );
                        //                gr.content_type = 'display/hidden';
                        if ( gr.u_integration_status === 'h' ) {
                            gr.u_integration_status = 's';
                            $(this).closest('tr').removeClass('trhidden').addClass('disp');
                        } else {
                            gr.u_integration_status = 'h';
                            $(this).closest('tr').removeClass('disp').addClass('trhidden');
                        }
                        gr.update(done);
                        function done(gr) { GM_log('# update done ',gr );}
                        e.stopPropagation();
                    });

                    function blklst(size,comprs) {
                        console.log ('#=#=  blklst ',size,comprs);
                        if (size < 750 && comprs < 650 ) return true;                               // too small

                        if (Math.abs(size-113039) < 5 && Math.abs(comprs-78355) < 5 ) return true;  // DD cyclist
                        if (Math.abs(size-94532)  < 5 && Math.abs(comprs-84536) < 5 ) return true;  // DD cyclist
                        if (Math.abs(size-82032)  < 5 && Math.abs(comprs-81618) < 5 ) return true;  // DD cyclist
                        if (Math.abs(size-65955)  < 5 && Math.abs(comprs-65989) < 5 ) return true;  // DD cyclist
                        if (Math.abs(size-1661)   < 5 && Math.abs(comprs-1246)  < 5 ) return true;  // DD blog
                        if (Math.abs(size-1433)   < 5 && Math.abs(comprs-994)   < 5 ) return true;  // DD facebook
                        if (Math.abs(size-1461)   < 5 && Math.abs(comprs-1037)  < 5 ) return true;  // DD twitter
                        if (Math.abs(size-1489)   < 5 && Math.abs(comprs-1050)  < 5 ) return true;  // DD linked
                        if (Math.abs(size-4081)   < 5 && Math.abs(comprs-4104)  < 5 ) return true;  // DD red top
                        if (Math.abs(size-3756)   < 5 && Math.abs(comprs-3779)  < 5 ) return true;  // DD blue top
                        if (Math.abs(size-5822)   < 5 && Math.abs(comprs-5845)  < 5 ) return true;  // DD gold top

                        if (size == 289    && comprs == 312   ) return true;                        // KBC linked
                        if (size == 242    && comprs == 260   ) return true;                        // KBC facebook
                        if (size == 623    && comprs == 646   ) return true;                        // KBC logo
                        if (size == 319    && comprs == 342   ) return true;                        // KBC
                        if (Math.abs(size-1985)   < 3 && Math.abs(comprs-1845)  < 3 ) return true;  // KBC

                        if (Math.abs(size-7630)   < 3 && Math.abs(comprs-7653)  < 3 ) return true;  // Brutele

                        if (Math.abs(size-2645)   < 3 && Math.abs(comprs-2668)  < 3 ) return true;  // Mivb/Stib

                        return false;
                    }
                    function hideatt(sysid){
                        var gr = new GlideRecord('sys_attachment');
                        gr.get(sysid);
                        GM_log('# ', gr.u_integration_status , sysid);
                        gr.u_integration_status = 'h';
                        gr.update(donehide);
                        function donehide() { GM_log('# add h done ');}
                    }
                    function showatt(sysid){
                        var gr = new GlideRecord('sys_attachment');
                        gr.get(sysid);
                        GM_log('# ', gr.u_integration_status  , sysid);
                        gr.u_integration_status = 's';
                        gr.update(doneshow);
                        function doneshow() { GM_log('# remove h done ');}
                    }

                    function done(gr) {
                        GM_log('# update done ', gr);
                    }

                }
            }

            //      MAIN

            timer5 = new Date();


            GM_log('#=#=#=#  starting Aloop 0');
            GlideGetExternalRef();


            var itsmversion = $('#mainBannerImage',unsafeWindow.parent.document).attr('title') || 'VersionNotFound';
            GM_log('#=#=#=#  starting Aloop 0.0');
            //		var Z;
            //	var Z    = '';
            //    if      ( script === 'u_request'      ) { Z = ' REQUEST';    }
            //    else if ( script === 'incident'       ) { Z = ' INCIDENT';   }
            //    else if ( script === 'pm_project'     ) { Z = ' PM PROJECT'; }
            //    else if ( script === 'problem'        ) { Z = ' PROBLEM';    }
            //    else if ( script === 'u_rim_event'    ) { Z = ' EVENT';      }
            //    else if ( script === 'change_task'    ) { Z = ' CHANGE TASK';   }
            //    else if ( script === 'u_problem_task' ) { Z = ' PROBLEM TASK';  }
            //    else if ( script === 'pm_project_task') { Z = ' PROJECT TASK';  }
            //    else if ( script === 'u_request_task' ) { Z = ' REQUEST TASK';  }
            //    else if ( script === 'u_incident_task') { Z = ' INCIDENT TASK'; }
            //    else if ( script === 'u_service_order') { Z = ' SERVICE ORDER'; }
            //    else                                    { Z = ' CHANGE'; }
            //		if ( script == 'u_request' ) { Z = ' REQUEST'; } else if ( script == 'incident' ) { Z = ' INCIDENT'; } else if ( script == 'problem' ) { Z = ' PROBLEM'; } else if ( script == 'u_rim_event' ) { Z = ' EVENT'; } else { Z = ' CHANGE'; }
            var btcol = 'normalbg';
            GM_log('#=#=#=#  starting Aloop 1');
            if (serial_number.indexOf('ITSM_CI') == -1 && info[2] === '') { info[2] = serial_number; }
            if ( $('#sys_display\\.' + script + '\\.u_product').val().length > 0  && info[0] === '' ) {
                if ( $('#sys_display\\.' + script + '\\.u_product').val().indexOf('VIRT') == -1 ) {
                    info[0] = $('#sys_display\\.' + script + '\\.u_product').val();
                }
            }
            if (info[4] && info[4] !== '') {
                GM_log('# Vendor is known: ', info[4] );
                $('#vdrlist > a.tplink').each( function() {
                    if ( $(this).text().toLowerCase() === info[4].toLowerCase() ) $(this).addClass('mybuthi');
                    GM_log('# ' , $(this).text());
                });
            }
            if ( typeof prbstat === 'undefined' ) { prbstat = ''; }
            if ( prbstat === 'undefined' )        { prbstat = ''; }

            UpdateTableFields();


            GM_log('#=#=# Add l1 l2' , prbstat );

            if (etadt) $('#l0 > td:nth-child(7)').text(etadt.replace(/\//g,'-'));
            GM_log('#=#=# Add l1 l2 done');
            var dmn  =  domain;
            var dmn1 =  domain2;
            var dmn2 =  domain3;
            $(`<p><span class="redalert" style="width:50%; display:inline-block;">Find SDM / AM on sharepoint:&nbsp; &nbsp; &nbsp;
<a href=http://eubebrusvsps1.eu.didata.local/Lists/Customers/AllItems.aspx?View={284B3398-8B63-4D62-BEC1-620D0B0DB8AD}&FilterClear=1&Filter=1&FilterValue1=` + encodeURIComponent(CustNM) + ` target=_blank><b>eubebrusvsps1</b></a>
&nbsp; &nbsp; or on &nbsp; &nbsp;
<a href=http://wired.` + dmn + `/communities/eu/be.belgium/Lists/Cust/AllItems.aspx?Filter=1&View={598D5911-E1D1-4B5A-95B9-FEF74261AB1C}&FilterValue1=` + encodeURIComponent(CustNM) + ` target=_blank ><b>Wired</b></a>
</span></span><p>`).insertAfter('span[tab_caption="Stakeholders"] > span.section > nav');
            GM_log('#=#=# anchors');

            var planning_tab = $('#tabs2_section > span:nth-child(11) > span:nth-child(1)');																						// new planning_tab
            if ( planning_tab.length === 0 ) { planning_tab = $('#tabs2_section > h3:nth-child(12) > span:nth-child(1)'); } 															// old
            GM_log('#=#=# anchor planning_tab exists', planning_tab.length );

            var company_anchor = $('#element\\.' + script + '\\.company > div:nth-child(3) > span'); 																				// new company_anchor
            if ( company_anchor.length === 0 ) { company_anchor = $('#' + script + '\\.company'); } 																					// old

            var requester_anchor = $('#element\\.' + script + '\\.u_caller > div:nth-child(3) > span');																				// new requester_anchor
            if ( requester_anchor.length === 0 ) { requester_anchor = $('#lookup\\.' + script + '\\.u_caller').closest('td').find('span.ref_contributions');  }						// old
            requester_anchor.after('&nbsp;<span id="rq-lst" class="itsmplus"></span>'); //.attr('id','rqlst')

            var affected_anchor = $('#element\\.' + script + '\\.u_requested_for > div:nth-child(3) > span');																		// new affected_anchor
            if ( affected_anchor.length === 0 ) { affected_anchor = $('#lookup\\.' + script + '\\.u_requested_for').closest('td').find('span.ref_contributions'); }					// old
            affected_anchor.after('&nbsp;<span id="ac-lst" class="itsmplus" style="display:none;"></span>'); //.attr('id','aclst')

            var location_anchor = $('#element\\.' + script + '\\.location > div:nth-child(3) > span');																		        // new location_anchor
            if ( location_anchor.length === 0 ) { location_anchor = $('#lookup\\.' + script + '\\.location').closest('td').find('span.ref_contributions'); }					// old
            location_anchor.after('&nbsp;<span id="loc-lst" class="itsmplus" style="display:none;"></span>');

            var contract_anchor = $('#element\\.' + script + '\\.u_contract > div:nth-child(3) > span');																			// new contract_anchor
            if ( contract_anchor.length === 0 ) { contract_anchor = $('#lookup\\.' + script + '\\.u_contract').closest('td').find('span.ref_contributions'); }					// old
            contract_anchor.attr('id','infoboxlst').after('<span id="ct-lst" class="itsmplus" style="display:none;"></span>');

            var ci_anchor = $('#element\\.' + script + '\\.u_contract_ci > div:nth-child(3) > span');																			// new contract_anchor
            if ( ci_anchor.length === 0 ) { ci_anchor = $('#lookup\\.' + script + '\\.u_contract_ci').closest('td').find('span.ref_contributions'); }					// old
            ci_anchor.attr('id','cilst').after('<span id="ci-lst" class="itsmplus" style="display:none;"></span>');

            var ci_anchor0 = $('#element\\.' + script + '\\.cmdb_ci > div:nth-child(3) > span');																			// new contract_anchor
            if ( ci_anchor0.length === 0 ) { ci_anchor0 = $('#lookup\\.' + script + '\\.cmdb_ci').closest('td').find('span.ref_contributions'); }					// old
            ci_anchor0.attr('id','cilst0').after('<span id="ci-lst0" class="itsmplus" style="display:none;"></span>');


            GM_log('##==#=# workload_anchor0 ' + $('tr.aggregate > td.aggregate_measure:nth-child(10)').length  );

            var workload_anchor = $('#' + script + '\\.task_time_worked\\.task_table > tbody.list2_body > tr.aggregate > td.aggregate_measure:nth-child(9) > table > tbody > tr > td.aggregate_right > span.aggregate_value');
            GM_log('##==#=# workload_anchor1 ' + workload_anchor.text() );

            if ( workload_anchor.text() === '' ) {
                workload_anchor = $('#' + script + '\\.task_time_worked\\.task_table > tbody.list2_body > tr.aggregate > td.aggregate_measure:nth-child(10) > table > tbody > tr > td.aggregate_right > span.aggregate_value');
                GM_log('##==#=# workload_anchor1 ' + workload_anchor.text() );
            }
            if ( workload_anchor.text() === '' ) {
                workload_anchor = $('td.aggregate_measure:nth-child(10) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)');		// new workload_anchor
                GM_log('##==#=# workload_anchor2 ' + workload_anchor.text() );
            }

            //      #sys_display.u_request.location  #loc-lst
            if ($('#sys_display\\.' + script + '\\.location').val() !== '' ) $("#loc-lst").append('<a title="Show location" href="https://www.google.com/maps/search/?api=1&query=' +  $('#sys_display\\.' + script + '\\.location').val().replace(/ /g,'+') + '" target="_blank"><img class=i14x14 src=' + GM_getResourceURL("googlemaps") + ' /></a>');


            achja = 0;
            $('#' + script + '\\.task_time_worked\\.task_table > tbody.list2_body > tr.aggregate > td.aggregate_measure').each( function() {
                achja++;
                p = $(this).find('table > tbody > tr > td.aggregate_right > span.aggregate_value');
                if ( p.text() ) {
                    GM_log('##==#=# workload_anchoreach ' + p.text(), achja );
                    workload_anchor = p;
                } // else { GM_log('##==#=# workload_anchoreach ', achja ); }
            });



            var assgrp_anchor = $('#element\\.' + script + '\\.assignment_group > div:nth-child(3) > span');																		// new assgroup
            if ( assgrp_anchor.length === 0 ) { affected_anchor = $('#lookup\\.' + script + '\\.assignment_group').closest('td').find('span.ref_contributions'); }					// old
            assgrp_anchor.append(' &nbsp; <span id="ag-lst" class="itsmplus" style="display:none;"></span>');

            var accown_anchor = $('#element\\.' + script + '\\.u_owner > div:nth-child(3) > span');																		// new acc owner
            if ( accown_anchor.length === 0 ) { affected_anchor = $('#lookup\\.' + script + '\\.u_owner').closest('td').find('span.ref_contributions'); }					// old
            accown_anchor.append(' &nbsp; <span id="ao-lst" class="itsmplus" style="display:none;"></span>');

            var timeworked_anchor = $('#myinfo_box'); 																																// old

            var wl_contr = $('#sys_display\\.' + script + '\\.u_contract').attr('value');
            if (wl_contr === 'Uptime Configuration MACD') {
                $('#element\\.' + script + '\\.u_task_resolution_code').parent().parent().parent().next().css('vertical-align','bottom').html(' &nbsp; If the task charge fields below are empty you have not yet entered time.<br>&nbsp; 15 minutes per unit.');
            }
            var remarks = '';
            GM_log('##==#=# timeworked ' + timeworked );
            var CustID = $('#' + script + '\\.company').val();
            GM_log('##==#=# Company ' + CustNM );

            var cases4cust   = '<a title="Show cases for ' + CustNM + '"          href="/task_list.do?sysparm_query=company%3D' + CustID +  '" target="_blank"><img src=images/green_back.gifx style="width:14px;height:14px;" id="showcompcase" /></a>';
            var cis4cust     = '<a title="Show CI\'s for ' + CustNM + '"          href="/cmdb_ci_list.do?sysparm_query=company%3D' + CustID +  '" target="_blank"><img src=images/timer_start.gifx style="width:14px;height:14px;" id="showcis" /></a>';
            var softcis4cust = '<a title="Show Software CI\'s for ' + CustNM + '" href="/cmdb_ci_spkg_list.do?sysparm_query=company%3D' + CustID +  '" target="_blank"><img src=images/timer_stop.gifx style="width:14px;height:14px;" id="showScis" /></a>';
            var contr4cust   = '<a title="Show contracts for ' + CustNM + '"      href="/contract_list.do?sysparm_query=bundle=false^u_company=' + CustID +  '&sysparm_first_row=1" target="_blank"><img src=/images/icons/bsm2.gifx style="width:14px;height:14px;" id="showcompcont" /></a>';

            var con2shapoi = '';
            var con2nocfor = '';
            con2shapoi = '<a title="Look for ' + CustNM + ' on ZRDB" href="https://zrdb.'+ dmn2 +'/index.php?action=customerbyname&filter=' + encodeURIComponent(CustNM.replace(/^A1_/g,'').replace(/&/g,'')) + '" target="_blank"><img class=i16x16 src=' + GM_getResourceURL("zrdb") + ' id="shapoi" /></a>';
            if ( Assigneegrp && Assigneegrp.indexOf('EU.BE') > -1 )  {
                con2shapoi = '<a title="Look for ' + CustNM + ' on ZRDB" href="https://zrdb.'+ dmn2 +'/index.php?action=customerbyname&filter=' + encodeURIComponent(CustNM.replace(/^A1_/g,'').replace(/&/g,'')) + '" target="_blank"><img class=i16x16 src=' + GM_getResourceURL("zrdb") + ' id="shapoi" /></a>';
                con2shapoi += '<a title="Look for ' + CustNM + ' on sharepoint\n(This only works when ITSM and sharepoint use the same customer name :-( )" href="https://nttlimited.sharepoint.com/teams/gtvd4/cdc/default.aspx#k=' + encodeURI(ShPoName(CustNM)) + '" target="_blank"><img class=i16x16 src=' + GM_getResourceURL("sharepicon") + ' id="shapoi" /></a>';
                con2nocfor  = '<a title="NOC Forum" href="http://eubebruphpbb/phpbb3_1/viewforum.php?f=177&look4=' + encodeURIComponent(CustNM.replace(/^A1_/g,'').replace('/','-')) + '" target="_blank"><img class=i16x16 src=' + GM_getResourceURL("phpbbsicon") + ' id="nocfor" /></a>';
            } else{
                con2shapoi += '<a title="Look for ' + CustNM + ' on sharepoint\n(This only works when ITSM and sharepoint use the same customer name :-( )" href="https://nttlimited.sharepoint.com/teams/frk87/Europe/client/Lists/Index/GSC%20Client%20Index1.aspx#k=' + encodeURI(ShPoName(CustNM)) + '" target="_blank"><img class=i16x16 src=' + GM_getResourceURL("sharepicon") + ' id="shapoi" /></a>';
            }
            con2nocfor = '<a title="Check out ' + CustNM + ' on Manage Center\n(See what our customer sees.)" href="#"  id="manage"><span style="border-style:solid;border-width:1px;padding: 0px 3px 1px 3px;line-height: 13px;font-size: 11px;border-radius:5px;" class="my_list_sla_6">MC</span></a>';
            // https://manage.dimensiondata.com/company_filter?_company=" + globalContext.company

            company_anchor.after('<span id="cmp-lst" class="itsmplus">' + cases4cust + cis4cust + softcis4cust + contr4cust + con2shapoi + con2nocfor + '</span>'); // .css('cursor','pointer')


            GM_addStyle(' #manage > span:hover { color:yellow; background:#333 !important; }');
            GM_addStyle(' #manage:focus        { text-decoration: none !important;        }');

            $('#manage').on('click', function () {
                GM_deleteValue('manage');
                GM_setValue('manage', globalContext.company + '|' + CustNM);
                GM_log('# ' , globalContext.company , CustNM , GM_getValue('manage') );
                unsafeWindow.window.open("https://manage.dimensiondata.com/company_filter?_company=" + globalContext.company);
            });

            if ( Assignee === '' ) {
                var xx;
                if ( $('#' + script + '\\.company_label').val() === 'ACV/CSC') {
                    xx = $('#' + script + '\\.short_description').val().replace(/__/g," ").replace(/_/g," ");
                    GM_log('##==#=# ACV/CSC  ' + xx );
                    $('#' + script + '\\.short_description').val(xx);
                }
                if ( $('#' + script + '\\.company_label').val() === 'Ineos Manufacturing') {
                    xx = $('#' + script + '\\.short_description').val().replace(/\[/g,"").replace(/\]/g,"");
                    GM_log('##==#=# Ineos  ' + xx );
                    $('#' + script + '\\.short_description').val(xx);
                }
                if ( $('#' + script + '\\.company_label').val() === 'BASE Company') {
                    xx = $('#' + script + '\\.short_description').val().replace(/\\'/g,"");
                    GM_log('##==#=# BASE  ' + xx );
                    $('#' + script + '\\.short_description').val(xx);
                }

                if ( $('#' + script + '\\.company_label').val() === 'Samsonite') {
                    $('#' + script + '\\.short_description').val( $('#' + script + '\\.short_description').val().replace(/__/g," ").replace(/_/g," ") );
                }
            }

            GM_log('#  going 1' );



            GM_log('#  going 1' , $("table[id^='activity_detail']").length  );
            var activity = '';
            if ( $("table[id^='activity_detail']").attr('id') ) { activity = $("table[id^='activity_detail']").attr('id').split('.')[1]; } else { activity = 'nix';}
            var p = 0;
            var caseref = '';
            var workloadTabEditing = false;
            var workloadTableEdit  = false;
            var ClosingCase        = false;
            var niettevaak1 = '';
            var niettevaak2 = '';

            GM_log('#  going 2' );
            GM_log('#=test2# ' , $("label[for='" + script + "\\.comments']").length ) ;
            GM_log('#=#=#=#  starting Aloop 2');
            var hidelist = [];
            var t = GM_getValue('hidelist'+casenr,'');
            if ( typeof t !== undefined ) {
                hidelist = t.split(',');
                GM_log('#=#=# hidelist' , hidelist.length );
            } else { GM_log('#=#=# hidelist [] '); }

            $('span.tabs2_tab').on('click', function(e) { other_tab_clicked(e); } );
            $('body').append('<div class="redalert" id="alarmmsg" style="padding:10px;display:none;left:670px;top:25px;width:auto;height:auto;position:absolute;"><div>');
            GM_log('#=#=#=#  starting Aloop 3');
            GM_log('#=#=#=#  starting Aloop 4   Getting SLA OLA ');

            var crow   = 1;
            var color = '#FFFFFF';
            var col,col1,col2,col3,col4,col5;
            var exst =  $('#' + script + '\\.task_sla\\.task_table').attr('total_rows');
            var comperc = 0;
            var stage = '';
            GM_log('#=#=#=#  starting Aloop 4.0 Detect SLAs ' , exst);
            if (exst && exst > 0) {
                breach = 0;
                undoc  = 0;
                col  = findcol( script + '.task_sla.task_table','task_sla.u_current_stage');
                col2 = findcol( script + '.task_sla.task_table','task_sla.business_percentage');
                col3 = findcol( script + '.task_sla.task_table','task_sla.business_time_left');
                col4 = findcol( script + '.task_sla.task_table','task_sla.u_breach_reason_code');
                col5 = findcol( script + '.task_sla.task_table','task_sla.sla.name');
                GM_log('#=#= cols=', col, col2, col3 );
            }  else { color = 'transparent'; }
            while ( crow <= exst ) {
                if ( $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col + ') ').text()  === 'In progress' ) {
                    GM_log('#==',$('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col2 + ') ').text() );
                    p = Number($('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col2 + ') ').text().replace(',','.') );
                    if ( p > hold ) {
                        hold = p;
                        color = $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col2 + ') ').css('background-color');
                        tml   = $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col3 + ') ').text();
                    }
                }
                comperc = $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col2 + ') ').text().replace(',','.');
                stage   = $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col + ') ').text();
                GM_log('#== %%=', crow, comperc, stage  );


                if ( Number(comperc) > 100 || stage === 'Breached') {  // VM11605:6813 #== %= 1 NaN Breached
                    breach++;
                    if ( $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col4 + ') ').text() === '' ) {
                        undoc++;
                        breach_msg =  '<p>' + $('#' + script + '\\.task_sla\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col5 + ') ').text() + '<br>Uncommented breach!! <br>You may want to reject this case<hr>';
                    }
                }
                crow++;
                problem_msg = problem_msg + breach_msg;
            }
            //		tml ='';

            if ( exst > 0 ) {
                var n = new Date();
                GM_log('# ETA compare ' ,  (Date.parse(etadt)/3600000) + 8 , (n.getTime()/3600000) );
            }

            GM_log('#=#=#=#  starting Aloop 4.1 Color short decription and number with SLA/OLA priority' , color );
            var serials = '';
            var cihref = '';
            crow   = 1;
            GM_log('#=#=#=#  starting Aloop 4.1.2.0  Detect Serials in CI table' , color );
            exst =  $('#' + script + '\\.task_ci\\.task_table').attr('total_rows');
            GM_log('#=#=#=#  starting Aloop 4.1.2.1 ' , exst );

            if ( exst > 0 ) {
                col  = findcol( script + '.task_ci.task_table','task_ci.ci_item.serial_number');
                col1 = findcol( script + '.task_ci.task_table','task_ci.ci_item');
                GM_log('#=#=#=#  starting Aloop 4.2 get serials' , exst , col , col1 );
            }


            while ( crow <= exst ) {
                t = $('#' + script + '\\.task_ci\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col1 + ') > a.linked').attr('href');
                if ( t && t !== '' ) { cihref = t; }
                t = $('#' + script + '\\.task_ci\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col + ') ').text();
                if ( t.indexOf('VIRT_') == -1  &&  t.length > 2 ) {
                    serials = serials + t;
                }
                t = $('#' + script + '\\.task_ci\\.task_table >  tbody:nth-child(2) >  tr:nth-child(' + crow + ') > td:nth-child(' + col1 + ') ').text();
                if ( t.indexOf(',') > -1 ) {
                    serials = serials + t.split(',')[1].trim();
                    if ( serials.indexOf(' ') > -1 ) {
                        serials = serials.split(' ')[0];
                    }
                    serials = serials + ',';
                }
                crow++;
            }
            if ( $('#sys_display\\.' + script + '\\.u_product').val().indexOf('VIRT') == -1 && exst == 1 && serials !== '') { serial_number = serials.replace(',',''); }
            GM_log('#=#=#=#  starting Aloop 4.3 ' + col + ' ['+  serial_number + '] ' + cihref );

            $('textarea#' + script + '\\.u_redirect_comments').on('change keypress', function(){
                $('textarea#activity-stream-work_notes-textarea').val('Redirect Comments:\n\n' + $('textarea#' + script + '\\.u_redirect_comments').val());
                $('textarea#' + script + '\\.work_notes').val('Redirect Comments:\n\n' + $('textarea#' + script + '\\.u_redirect_comments').val());
            });
            GM_log('#=#=#=#  starting Aloop 5');
            var vci = 'virtual ';
            if ( serials.length > 4 ) { vci = ''; }
            if ( $('#' + script + '\\.task_ci\\.task_table').attr('last_row') === '1' ) {
                $('#ci-lst').append('<a title="Show this ' + vci + 'CI details" href="' + cihref + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a>').show();
                $('#ci-lst0').append('<a title="Show this ' + vci + 'CI details" href="' + cihref + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a>').show();
            }
            GM_log('#=#=#=#  starting Aloop 5.1.0 ', cihref, serials);
            //
            //  Aloop Main part
            //
            //
            GM_log('#=#=#=#  Main part   8607');

            if (typeof unsafeWindow === "undefined") { unsafeWindow = window; }

            $('body').append('<div id="showpic" style="width:auto;height:auto;position:absolute;display:none;"></div>');  // show images in this div

            $('body').append('<div id="caldiv" style="width:230px;height:250px;position:absolute;display:none;"><div id="relposdiv" style="position:relative;"></div></div>');



            if ( typeof unsafeWindow.globalContext['affected\.user\.contact\.details'] === undefined ) {                                                                  //  Loop until we can get requester email from globalContext, no longer undefined
                GM_log('#=#=#=#  Waiting.....');
                window.setTimeout(Aloop,200);
            } else {
                timer6 = new Date();

                GM_log('#=#=#=# ITSM+'  );
                var btbg = '';
                Assignee = $('#sys_display\\.' + script + '\\.assigned_to').attr('value') || '';                                                                          //  Get Assignee of case

                $('#' + script + '\\.u_next_step_displayed').change(dingdong);                                                                                          //  780  Set to completed
                $('#' + script + '\\.u_accepted').change(dingdong2);																									//  2    rejected

                GM_log('#=#=#=#  Assignee is ' + Assignee + ' and resolvedby is ' + unsafeWindow.g_form.getValue('sys_display.' + script + '.u_resolved_by')  );
                var setresolve = GM_getValue('setresolve','off'); // must set it in settings default is off

                if ( Assignee.length > 1 && unsafeWindow.g_form.getValue(script + '.u_resolved_by').length < 1 && setresolve === 'on' && Assignee === loggedin ) {
                    var tq = unsafeWindow.g_form.getValue(script + '.assigned_to');
                    unsafeWindow.g_form.setValue(script + '.u_resolved_by', tq);
                    unsafeWindow.g_form.setValue('sys_display.' + script + '.u_resolved_by', Assignee);
                    GM_log('#=#=#=#  Set Resolvedby to ' + Assignee + '   ' + tq);
                } else {
                    GM_log('#=#=#=#  Resolvedby unchanged');
                }

                if ( $('#ui_macro_task_charge').length ) {
                    t = Number($('#ui_macro_task_charge > td:nth-child(2)').text().replace(/ /g,'') );
                    GM_log('# task_charge ' + t + ' => ' + $('#' + script + '\\.u_actual_charge').val() );
                    if ( $('#' + script + '\\.u_actual_charge').val() === '' && t > 0) {
                        $('#' + script + '\\.u_actual_charge').val(t);
                        $('#' + script + '\\.u_charge_change_reason').val('Same as current task charge.');
                    } else {
                        t = Number($('#' + script + '\\.u_actual_charge').val().replace(/ /g,'')) ;
                        if ( t > 0 ) { $('#' + script + '\\.u_actual_charge').val(t); }
                    }
                }
                GM_log('#=#=#=#  Check customer email etc');


                var affectedname  = unsafeWindow.globalContext['affected.name'];
                var requestername = unsafeWindow.globalContext["requester.name"];
                var locationname  = unsafeWindow.globalContext["location.name"];
                var locationID    = unsafeWindow.globalContext.location;

                if (requestername && Cont1ID ) {
                    $('#rq-lst').append('<a title="Show cases for ' + requestername + '" href="/task_list.do?sysparm_query=u_caller='        + Cont1ID + '" target="_blank"><img src="images/green_back.gifx" style="width:14px;height:14px;" id="showrequcase"></a>').show();
                }
                if (affectedname && Cont2ID ) {
                    $('#ac-lst').append('<a title="Show cases for ' + affectedname  + '" href="/task_list.do?sysparm_query=u_requested_for=' + Cont2ID + '" target="_blank"><img src="images/green_back.gifx" style="width:14px;height:14px;" id="showaffectcase"></a>').show();
                }
                $('#loc-lst').hide();
                if (locationname && locationID ) {
                    $('#loc-lst').append('<a title="Show cases for ' + locationname  + '" href="/task_list.do?sysparm_query=location='    + locationID + '" target="_blank"><img src="images/green_back.gifx" style="width:14px;height:14px;" id="showlocationcase"></a>').show();
                }
                var detailsArr = [];
                var nbr = '';
                var tit;
                if (typeof unsafeWindow.globalContext['requester\.contact\.details'] !== "undefined" ) {
                    detailsArr = unsafeWindow.globalContext['requester\.contact\.details'].split(',') || [];                                                            //  Pull array from globalContext
                    GM_log('#=#= add requester ');
                    console.log ('#=#=#',detailsArr );
                    if (detailsArr[3].toString() !== '' ) {
                        nbr = detailsArr[3].toString().replace(/\s/g,'');
                        $('#rq-lst').append('<a class="phnlnk" title="Call ' + detailsArr[0].toString().replace(/\s/g,'') + ' ' + detailsArr[1].toString().trim() + ' on ' + nbr + '" href="tel:' + nbr + '" ></a>');
                        GM_log('#=#= add requester phone');
                    }
                    if (detailsArr[4].toString() !== '' ) {
                        nbr = detailsArr[4].toString().replace(/\s/g,'');
                        $('#rq-lst').append('<a class="phnlnk" title="Call ' + detailsArr[0].toString().replace(/\s/g,'') + ' ' + detailsArr[1].toString().trim() + ' on ' + nbr + '" href="tel:' + nbr + '" ></a>');
                        GM_log('#=#= add requester mobile');
                    }
                }
                if (typeof unsafeWindow.globalContext['affected\.user\.contact\.details'] !== "undefined" ) {
                    detailsArr = unsafeWindow.globalContext['affected\.user\.contact\.details'].split(',') || [];                                                       //  Pull array from globalContext
                    GM_log('#=#= add affected user ');
                    console.log ('#=#=#',detailsArr );
                    if (detailsArr[3].toString() !== '' ) {
                        // #view\.u_request\.u_caller
                        nbr = detailsArr[3].toString().replace(/\s/g,'').replace('(0)','');

                        $('#ac-lst').append('<a class="phnlnk" title="Call ' + detailsArr[0].toString().replace(/\s/g,'') + ' ' + detailsArr[1].toString().trim() + ' on ' + nbr + '" href="tel:' + nbr + '" ></a>').show();
                        GM_log('#=#= add affected user phone');
                    }
                    if (detailsArr[4].toString() !== '' ) {
                        nbr = detailsArr[4].toString().replace(/\s/g,'').replace('(0)','');
                        $('#ac-lst').append('<a class="phnlnk" title="Call ' + detailsArr[0].toString().replace(/\s/g,'') + ' ' + detailsArr[1].toString().trim() + ' on ' + nbr + '" href="tel:' + nbr + '" ></a>').show();
                        GM_log('#=#= add affected user mobile');
                    }
                }


                GM_log('# globalContext affected  ', unsafeWindow.globalContext.affected  );
                GM_log('# globalContext requester ', unsafeWindow.globalContext.requester );

                var recep = '';
                if (detailsArr.length > 2 ) {
                    recep  = detailsArr[6].toString().toLowerCase();                                                                                                    //  Get requester email
                    custfn = FirstLUcase(detailsArr[0].toString().trim());
                    custln = FirstLUcase(detailsArr[1].toString().trim()); // recep.split(' ').slice(1).toString();
                }

                if ( $('#element\\.' + script + '\\.comments\\.additional > td:nth-child(1) > span:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:last-child > td:nth-child(1) > span:nth-child(1)').length === 0 ) { GM_log("No initial entry ??? !!!\n\nOekandanou ??? !!! "); } else {
                    var it = $('#element\\.' + script + '\\.comments\\.additional > td:nth-child(1) > span:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:last-child > td:nth-child(1) > span:nth-child(1)').html().toLowerCase();
                    if (it.indexOf(recep) < 0) {
                        GM_log('#=#=#=#  Email ' + recep + ' niet gevonden');  // #u_request.u_accepted
                        GM_log('#=#=#=#  Case state, accepted  1  or not  0  : ' + $('#' + script + '\\.u_accepted').val() );        // Has the case been accepted  1  or not  0
                        if ( $('#' + script + '\\.u_accepted').val() === 0 ) { GM_log('Contact  [ ' + recep + ' ]  not found in initial mail \n\n' + it ); }
                        btbg = 'alertbg';
                        tit = '  Bad Contact for case!! \n  Contact [' + recep + '] not found in initial mail!! ';
                    }
                }

                GM_log('#=#=#=#  Create reassign button');
                $('#ag-lst').append(' <A id="closeq" style=""><img src="images/request_completed.gifx" title=""></img></A><A id="closeq2"  style=""><img title="Reassign to closure queue and UPDATE" src="/images/green_back.gifx" title=""></img></A>');

                $('#closeq').hide();
                $('#closeq2').hide();

                GM_log('#=#=#=#  get to and cc list vars');
                var tolist = GM_getValue('tolist'+casenr,'');                                                                                                         //  Must add
                var cclist = GM_getValue('cclist'+casenr,'');                                                                                                         //  Get stored cclist
                var Xrecep = GM_getValue('recep'+casenr,'');
                if ( Xrecep !== '' ) {
                    GM_log('#=#=#=# fn=' +Xrecep.split(' ')[0] +' ln='+ Xrecep.split(' ').slice(1));
                    custfn = Xrecep.split(' ')[0];
                    custln = Xrecep.split(' ').slice(1).toString();
                    if (custln.indexOf(',') > -1) custln = custln.replace(',',' ');
                }
                if (cclist) {
                    if (cclist === '') { GM_setValue('cclist'+casenr,''); } else {cclist = ';' + cclist;}
                } else { cclist = ''; }
                tolist = tolist.replace(recep,'').replace(/ /g,';').replace(/;;/g,';');
                if (Xrecep.indexOf(',') > -1) MyDear = MyDear.indexOf('{fn} {ln}',Xrecep);
                MyDear = MyDear.replace('{fn}',custfn);
                MyDear = MyDear.replace('{ln}',custln);

                var mbody;
                tosub = 'mailto://' + recep + ';' + tolist + '?subject=RE: ' + casenr + ' - ' + encodeURIComponent($('#' + script + '\\.short_description').attr('value') );            //  Put the requester email address, [6] in array, in mailto:// and (SVR nr + short description) in subject
                mbody = '&body=' + MyDear + parsevars(MyMGSbody) + '%0A%0D' + caseref;
                mcc   = '&CC=NTT Limited Services <didatabosprod@service-now.com>'+ cclist;
                mlt = tosub + mbody + mcc;

                if($('#email_client_open').length === 0 ) { myalert("email button not found ??? !!!\n\nOekandanou ??? !!!"); }                                          //  Do we see the email link?
                else {                                                                                                                                                  //  Yes we do
                    if ( recep.indexOf('nomail')>0 || recep.indexOf('donotuse.com')>0  ){                                                                               //  Detect noemail and flag with red envelope
                        btbg = 'faultbg'; tit = 'Bad email address!\nReject case.';}
                    else {
                        if ( btbg === '') {btbg = btcol; tit = 'Default mail client';}
                    }
                }

                var mailoptions = '';
                for (var idx = 0, len = MailTemplName.length; idx < len; idx++) {
                    mailoptions += '<option style="background-image:url(images/icons/email.gifx);background-repeat:no-repeat;background-position:1px; " title="' + MailTemplName[idx] + '" value="' + idx + '" selected>__  ' + MailTemplName[idx] + '</option>';
                }
                GM_log('# titlefix start');
                GM_log('#=#=#=#  Add mail buttons');
                $(`<span id="anotif" style="color:#000;background-color:#FFA500;"></span> &nbsp; &nbsp; <span id="pagetm" class="hov" style="overflow:hidden;"></span> &nbsp; &nbsp; <span class="hov" id="hoptest" style="text-decoration:none;font-weight:normal;color:#343d47;">&nbsp;  Hi ` + loggedin + `, ITSM+ version : ` + scriptversion + ` on ` + instance + ` &nbsp; </span>&nbsp;  &nbsp; \
<span id="mailstuff"><A id="n_email" style="text-decoration:none;padding-left:2px;"><img style="margin-bottom:2px;" src="images/icons/email.gifx"title="`+ tit +`"></img></A><select id="mailtype" style="display:none;"> \
` + mailoptions + `</select></span> &nbsp; <A id="cc" style="text-decoration:none;"><img style="margin-bottom:2px;" class="i16x16" src="images/icons/edit.gifx" title="Mail Client Configuration"></img></A>\
<a id="set" title="ITSM+ Settings" data-original-title="ITSM+ Settings" class="normalbg icon-cog"><span class="sr-only">ITSM+ Settings</span></a>
&nbsp; \
<A class="rfsh" style="text-decoration:none;"><img style="margin-bottom:2px;" class="i16x16" src="images/icons/refresh.gifx" title="Reload"></img></A> &nbsp; ... mailbut ...  &nbsp; ... `).insertBefore('div.container-fluid:first > div.navbar-right > span:nth-child(1)');
                // <A id="set" style="display:none;"><img style="margin-bottom:2px;" class="i16x16" src="images/icons/bsm2.gifx"></img></A>
                $( $('#email_client_open').clone(true).attr('id','new_email_client') ).insertBefore('#header_add_attachment');
                $('#email_client_open').attr('id','email_client_open_menu');
                $('#new_email_client').text('').attr('id','email_client_open').css('padding','0px 5px 0px 5px').css('margin','0px').css('min-height','0px').css('min-width','25px').css('line-height','13px').css('border','none').attr('title','ITSM internal mail').addClass('btn').addClass('btn-icon'); // .addClass('mybut');

                if (instance === 'sandbox') { $('#email_client_open').parent().parent().parent().css('background-color','#DDA0DD'); }
                if (instance === 'orion'  ) { $('#email_client_open').parent().parent().parent().css('background-color','#ff7373'); }


                if (recep === '') {
                    problem_msg = problem_msg + '<p> No requester Email ??? !!! <BR>Perhaps request GSC to add a contact with an emailaddress. <hr>';
                }
                $('#mailstuff').addClass(btbg);
                $('#n_email img:first-child').css('width','14px').css('height','14px');                                                  //  Adjust the image
                $('#n_email').click( function() {
                    GM_log('# n_email clicked');
                    changemailink(0);
                }); //.attr('href', mlt);                                                                                                                 //  Adjust the link
                $('#cc img:first-child').addClass(btcol);
                $('#cc').click(managecclist);
                $('#set').attr('style','text-decoration:none;').on('click', function() { showform(3); });
                GM_addStyle(' #set::before { line-height: 9px; margin-bottom: 1px;     font-size: 12px; }');
                //		$('#set  img:first-child').addClass(btcol);
                $('#mailtype').attr('style','text-decoration:none;margin-left:0px;').val(0).on('change', function () {
                    var msel = this.value;
                    var idx = $('#mailtype option:selected').index();
                    changemailink(msel);
                    GM_log('maillink update idx ' +  msel + '  ' + idx);
                });
                $('#ooo').attr('href', 'mailto://' + recep + oooMSG + MyFirstName);
                var tmpq = $('#email_client_open').attr('query');
                $('#email_client_open').attr('query', tmpq + '^ORmymail=' + unsafeWindow.window.g_user.userName );

                GM_log('#=#=#=#  mail buttons DONE!. ');
                GM_log("#=#=#=#  loggedin = '"+ loggedin + "'");
                if ( loggedin == 'Michel Hegeraat' ) {
                    GM_log('#=#=#=#  adding test1 click listener');
                    $('#hoptest').click(test1);
                }

                GM_log('#=#=#=#  ### LOG  tab ###', $('#label\\.' + script + '\\.\\.formatter\\.activity\\.xml').length);
                $('#label\\.' + script + '\\.work_notes').parent().show();
                GM_log('#=#=#=#  ### WORK NOTES  tab ###', $('#label\\.' + script + '\\.work_notes').length);
                $('#label\\.' + script + '\\.work_notes').each( function(){                                                                                            //### WORK NOTES  tab ###
                    var obj = $(this);
                    obj.append(`<span class="itsmplus" style="display:flow-root;"><A id="wivaonoff2"><IMG id="wivaimg2" class="i16x16" src="images/activity_filter_on.gifx" style="margin-left:15px;"></IMG></A>
<span id="wiva2" style="display:none">
<select id="wims5" style="background-color:#DFE;border:0px solid;"></select> &nbsp;
<select id="wims6" style="background-color:#DFE;border:0px solid;"></select> &nbsp;
<select id="wims7" style="background-color:#DFE;border:0px solid;"></select> &nbsp;
<select id="wims8" style="background-color:#DFE;border:0px solid;"></select>
</span> &nbsp; <a title="ITSM+ Settings" data-original-title="ITSM+ Settings" class="normalbg icon-cog showconf"><span class="sr-only">ITSM+ Settings</span></a>
&nbsp; <A class="rfsh"><IMG title="Reload" src="images/icons/refresh.gifx" style="float:right"></IMG></A>
</span>`);
                });

                $('#label\\.' + script + '\\.comments').parent().show();
                GM_log('#=#=#=#  ### COMMENTS  tab ###', $('#label\\.' + script + '\\.comments').length);
                $("label[for='" + script + "\\.comments']").parent().each( function(){                                                                                              //### COMMENTS  tab ###
                    var obj = $(this);
                    GM_log('#=#=#=#  Add SWOW-hi-lite button');
                    if ( ro === 0 ) {
                        ro = 1;
                        obj = $('#label\\.' + script + '\\.comments');
                        GM_log('#=#=#=#  Add swow button');   // <span class="itsmplus" style="display:flow-root;">
                        var html2add = `<span class="itsmplus" style="display:flow-root;">
<A class="rfsh"><IMG title="Reload" src="images/icons/refresh.gifx" style="float:right"></IMG></A>
&nbsp; <a id="findphns" title="Find and hilite phonenumbers in the case notes."><img width=14 height=14 src="images/mobile/phone.gifx" style="float:right"/></a>
&nbsp; <A id="swow" title="Show the SWOW screen" >&nbsp; SWOW &nbsp;</A>
<A id="wivaonoff"><IMG id="wivaimg" class="i16x16" src="images/activity_filter_on.gifx" style="margin-left:15px;"></IMG></A>
<span id="wiva" style="display:none">\
<select id="wims1" style="background-color:#DFE;border:0px solid;"></select> &nbsp; \
<select id="wims2" style="background-color:#DFE;border:0px solid;"></select> &nbsp; \
<select id="wims3" style="background-color:#DFE;border:0px solid;"></select> &nbsp; \
<select id="wims4" style="background-color:#DFE;border:0px solid;"></select> \
</span> &nbsp; <a title="ITSM+ Settings" data-original-title="ITSM+ Settings" class="normalbg icon-cog showconf"><span class="sr-only">ITSM+ Settings</span></a></span>
`;
                        obj.append(html2add);
                    }
                });
                GM_log('#=#=#=#  Add swow button in 3rd tab', $('span[tab_caption*=" log"]').length );

                $('span[tab_caption*=" log"] > span:nth-child(1)').prepend('<div id="logswowb" style="display:block;width:100%;border solid 1px green;"></div>');   // span tab_caption="Request log" <span style="display:block;width:100%;border solid 1px red;">testing</span>

                $('#logswowb').append('<label class=" col-xs-12 col-md-1_5 col-lg-2 control-label"></label> <span class="itsmplus" style="display:flow-root;left:300px;"> &nbsp; &nbsp; &nbsp; <A id="swowlt" title="Show the SWOW screen" >&nbsp; SWOW &nbsp;</A> &nbsp;<A class="rfsh"><IMG title="Reload" src="images/icons/refresh.gifx" style="float:right"></IMG></A> &nbsp; </span>'); // <A id="swht-log" style="float:right;margin-right: 15px;">&nbsp; SWOW-hi-lite &nbsp;</A>

                $('div[ng-class="labels.contentClass"]').css('padding-left','0px');

                GM_log('#=#=#=#  Activate swow buttons');                                                                                                                // Add list button
                $("#swow").click(show_swow).addClass('mybut');
                $("#swowlt").click(show_swow).addClass('mybut');
                $('a.showconf').attr('title','Configure Actions.\n  Change displayed options and associated actions  \n\nChange Email Templates.\n  Change or define new email templates for the default email client.\n \nOther Settings\n  Other ITSM+ settings.');
                $("a.showconf").on('click', function() { showform(1); });

                GM_log('#=#=#=#  Form options');                                                                                                                // Add list button
                $("#wim1").click(wim1_f).addClass('mybut');
                $("#wim2").click(wim2_f).addClass('mybut');
                $("#wim3").click(wim3_f).addClass('mybut');
                $('#wims1').on('change', function() {  wims_f(1, this.value ); });
                $('#wims2').on('change', function() {  wims_f(1, this.value ); });
                $('#wims3').on('change', function() {  wims_f(1, this.value ); });
                $('#wims4').on('change', function() {  wims_f(1, this.value ); });
                $('#wims5').on('change', function() {  wims_f(2, this.value ); });
                $('#wims6').on('change', function() {  wims_f(2, this.value ); });
                $('#wims7').on('change', function() {  wims_f(2, this.value ); });
                $('#wims8').on('change', function() {  wims_f(2, this.value ); });
                GM_log('#=#=#=#  Activate refresh buttons');
                $(".rfsh").click(rfsh);
                $("#findphns").on('click', function() { searchphn();} );

                if ( loggedin == 'Michel Hegeraat' ) {
                    $("#tst1").click(test1).addClass('mybut');
                    $("#tst2").click(test2).addClass('mybut');
                    $("#tst3").click(test3).addClass('mybut');
                    $("#tst4").click(test4).addClass('mybut');

                }
                $("#wivaonoff").click(wiva_on_off);
                $("#wivaonoff2").click(wiva_on_off);
                if (GM_getValue('wivastate') === 'on' ) {
                    $('#wiva').css('display','inline');
                    $('#wivaimg').attr('src','images/activity_filter_off.gifx');
                    $('#wiva2').css('display','inline');
                    $('#wivaimg2').attr('src','images/activity_filter_off.gifx');
                }

                if( $('#lookup\\.' + script + '\\.u_caller').length === 0 ) { GM_log("#=#=#=#  not found id  #lookup\\." + script + "\\.u_caller !! Whats wrong?  " ); }
                else {

                    GM_log('#=#=#=#  Add list button '  );                                // Add list button
                    $('#lookup\\.' + script + '\\.u_caller').closest('td').find('span.ref_contributions').attr('id','rqlst');


                    $('#rq-lst').append('<A id="lijst" title="Contact list"><img src="images/reference_list.gifx"></img></A>');

                    var cust;
                    $("#lijst").click(show_list); //.css('width', '14px'); // .addClass(btcol)
                }
                $('.phnlnk').append('<img class="phncl" src="images/mobile/phone.gifx"/>');
                $('.phnlnk1').append('<img class="phncl" src="images/mobile/phone.gifx"/>');
                $('.phncl').click(function() {
                    var info = $(this).parent().attr("title");
                    if (info === '') info = $(this).parent().attr("data-original-title");
                    phonecall(info);
                });

                if (problem_msg === '' && loggedin === 'Michel Hegeraat ' ) { problem_msg = '<p>Testing 123<br>nog een lijn<br> nog wat <hr>'; }
                if (problem_msg !== '' ) { myalert( problem_msg ); }

                if ( $('A#lookup\\.' + script + '\\.u_major:visible') ) {
                    $('div.info_box:contains("Possible parent")').hide();
                    $('A#lookup\\.' + script + '\\.u_major').css('border','2px #ffff26 solid');
                    $('A#lookup\\.' + script + '\\.u_major').hover( function() { $('div.info_box:contains("Possible parent")').fadeIn(700); } , function() {  $('div.info_box:contains("Possible parent")').hide(200); } );
                }


                chk4nwcstmr = setInterval(  function() {
                    chk4nwcs();
                } , 120000);

                GM_log('#=#=#=#  Add listener for top alert');
                $('#toplrt').on('click', function() {
                    GM_log('#=#=#=#  Alarm button clicked 0' );
                    var imgpos = document.getElementById('toplrt').getBoundingClientRect();
                    y = imgpos.bottom + 3;
                    x = imgpos.left -10;
                    var t = $('#toplrt img:first-child').attr('src');
                    GM_log('#=#=#=#  Alarm button clicked' , t , t.indexOf('expand_sm') );
                    if ( t.indexOf('expand_sm')  > 0 ) {
                        $('#toplrt').css('paddingBottom','8px').css('borderBottomWidth','0px');
                        $('#toplrt img:first-child').attr('src','/images/arrows_collapse_sm.gifx');
                        GM_log('#=#=#=#  image set to ^ (hide)' , $('#toplrt img:first-child').attr('src') );
                        $('#alarmmsg').css('top',y + 'px').css('left',x + 'px').show(500);

                    } else {
                        $('#toplrt').css('paddingBottom','4px').css('borderBottomWidth','1px');
                        $('#toplrt img:first-child').attr('src','/images/arrows_expand_sm.gifx');
                        GM_log('#=#=#=#  image set to v (show)' , $('#toplrt img:first-child').attr('src') );
                        $('#alarmmsg').hide(500);
                    }
                });





            }
            if ( loggedin == 'Michel  Hegeraat' ) {
                setInterval( function() {
                    GM_log('#=#= wanker call');
                    wanker( Math.floor( Math.random()*(10) ) );
                }, 30000);
            }

            if ( loggedin == 'Hans  Depre' ) {
                setInterval( function() {
                    GM_log('#=#= wanker call');
                    wanker( Math.floor( Math.random()*(10) ) );
                }, 60000);
            }

            $('textarea#' + script + '\\.comments').focus();


            GM_log('#=#=#=# move tabs');

            tabs_move('contractchange',0);

            if ( loggedin == 'Michel Hegeraat' ) {   // Test tabs
                tabs_test('Tab_5+',5);
                tabs_test('Tab_4',1);
                tabs_test('Tab_3',4);
                tabs_test('Tab_2',3);
                if (GM_getValue('hideexpstuff') === 1) {
                    tab_hide('Tab_5+',5);
                    tab_hide('Tab_4',1);
                    tab_hide('Tab_3',4);
                    tab_hide('Tab_2',3);
                }


                $('body').append(`<div id="newfloat">
<a id=goupf class="btn btn-default"><img src=images/arrows_collapse_sm.gifx?v=2 style="padding-right:0px;margin-bottom:6px;padding-top:3px;"></a>
<br>
<a class="btn btn-default icon-chevron-up"></a>
<br>
<A id="swowf" title="Show the SWOW screen">&nbsp; SWOW &nbsp;</A>
<p></p>
<a class="btn btn-default icon-chevron-down"></a>
<br>
<a id=goupf class="btn btn-default"><img id=godownf src=images/arrows_expand_sm.gifx?v=2 style="padding-right:0px;margin-bottom:6px;padding-top:3px;"></a>
</div>`);
                $('#newfloat').css('position','absolute').css('background-color','transparant').css('display','none').css('padding','5px 0px 5px 0px');
                $("#swowf").click(show_swow).addClass('mybut');
                $(".related-list-trigger").addClass('mybut');

            }

            $('span.tab_caption_text:contains("Custom")').parent().show().parent().show().next().show();
            $('span.tabs2_section[tab_caption_raw="Custom section"] > span:nth-child(1)').show().children().show();
            GM_log('#=#=#=# tabs sober');
            $('div#tabs2_section').append('<span class="tab_header"><span id=sober class=tabs2_tab style="padding-right:1px;margin-bottom:6px;padding-top:3px;padding-bottom:2px;"><img id=soberi src=images/activity_filter_off.gifx /></span></span> ');  // padding-right:4px;margin-bottom:4px;padding-top:3px;
            tab_PWS();
            tab_moveit();
            GM_log('#=#=#=# tab MoveIt');
            tab_webex();
            GM_log('#=#=#=# tab Webex');
            tab_scram();
            GM_log('#=#=#=# tab Scram');
            tabs_test('ITSM+',6);
            GM_log('#=#=#=# tab ITSM+');

            insertTab('HOPLA', 2, 1);
            tab_hide('HOPLA');
            Attachments_Tab();
            var secretNoErr = true;
            $('img#secretimg').bind('error', function(e){
                tab_hide('PWS');
                secretNoErr = false;
            });
            if (mytabs.PWS < 1)	    { tab_hide('PWS'); }
            if (mytabs.Scram  < 1)	{ tab_hide('Scram');  }
            if (mytabs.Webex  < 1)	{ tab_hide('Webex');  }
            if (mytabs.MOVEit < 1)	{ tab_hide('MOVEit'); }
            GM_log('#=#=#=# hide tabs escalation ', mytabs.Escalation, mytabs.Stakeholders );
            if (mytabs.Escalation 	 < 1) { tab_hide('Escalation');		}
            if (mytabs.Stakeholders 	 < 1) { tab_hide('Stakeholders');	}
            if (mytabs['Custom section'] < 1) { tab_hide('Custom section');	}

            $('.tab_caption_text').addClass('noselect');  // no text select on buttons

            $('#Attachments').next().attr('title','My attempt to solve the too many attachments issue, hiding duplicates and known logos.');
            $('span#ITSM\\+').next().attr('title','Connect to vendor supportweb from here.\nFor some vendors ITSM+ can prepopulate fields in the supportweb\nand capture your case-reference and bring it to ITSM.');



            if ( loggedin == 'Sebastiaan Noppe' ) {
            }

            $('div#tabs2_section > img:nth-child(1)').remove();

            $('div#tabs2_section').prepend(' &nbsp; <span class="tab_header"><span id=godown class=tabs2_tab style="padding-right:4px;margin-bottom:6px;padding-top:3px;"><img src=images/arrows_expand_sm.gifx?v=2/></span></span> ');
            $('div#tabs2_list').prepend('<span class="tab_header"><span id=goup class=tabs2_tab style="padding-right:4px;margin-bottom:6px;padding-top:3px;"><img src=images/arrows_collapse_sm.gifx?v=2 /></span></span> ');

            GM_log('#=#=#=#  tabs2_list display: ' ,$('div#tabs2_list').css('display') );
            $('div#tabs2_list').show();

            $('#tabs2_spacer').css('min-height','30px').css('height','auto');


            GM_log('#=#=#=# tabs extra');


            $('#godownf').on('click', function() {
                document.getElementById("goup").scrollIntoView( { behavior: "instant"} );
            });
            $('#goupf').on('click', function() {
                document.getElementById( script + ".short_description").scrollIntoView( { block: "end", behavior: "instant"} );
            });

            $('#godown').addClass("tabs_header").on('click', function() {
                document.getElementById("goup").scrollIntoView( { behavior: "instant"} );
            });
            $('#goup').addClass("tabs_header").on('click', function() {
                document.getElementById( script + ".short_description").scrollIntoView( { block: "end", behavior: "instant"} );
            });
            $('#sober' ).on('click', function() {
                if ($('#soberi').attr('src').indexOf('_on') > -1) {
                    $('#soberi').attr('src','images/activity_filter_off.gifx');
                    tab_show('NEW');
                    tab_show('Attachments');
                    if (mytabs.PWS > 0 && secretNoErr ) { tab_show('PWS'); }
                    if (mytabs.Scram > 0) { tab_show('Scram');  }
                    if (mytabs.Webex > 0) { tab_show('Webex');  }
                    if (mytabs.MOVEit > 0) { tab_show('MOVEit'); }
                    if (GM_getValue('hideexpstuff') !== 1) {
                        tab_show('Tab_2');
                        tab_show('Tab_3');
                        tab_show('Tab_4');
                        tab_show('Tab_5+');
                    }
                    tab_show('Bulk CI changes');
                    tab_show('Integration messages log');
                    if (mytabs.Escalation > 0)		{ tab_show('Escalation');		}
                    if (mytabs.Stakeholders > 0)		{ tab_show('Stakeholders');		}
                    if (mytabs['Custom section'] > 0)	{ tab_show('Custom section');	}
                    tab_show('OtherTab');
                    tab_show('ITSM+');
                } else {
                    $('#soberi').attr('src','images/activity_filter_on.gifx');
                    tab_hide('NEW');
                    tab_hide('Attachments');
                    tab_hide('PWS');
                    tab_hide('Scram');
                    tab_hide('Webex');
                    tab_hide('MOVEit');
                    tab_hide('Tab_2');
                    tab_hide('Tab_3');
                    tab_hide('Tab_4');
                    tab_hide('Tab_5+');
                    tab_hide('Bulk CI changes');
                    tab_hide('Integration messages log');
                    tab_hide('Escalation');
                    tab_hide('Stakeholders');
                    tab_hide('Custom section');
                    tab_hide('OtherTab');
                    tab_show('ITSM+');
                }
            });

            $('#godown').hover( function() { $( this ).addClass("tabs2_hover"); },function() { $( this ).removeClass("tabs2_hover"); }	);
            $('#goup'  ).hover( function() { $( this ).addClass("tabs2_hover"); },function() { $( this ).removeClass("tabs2_hover"); }	);
            $('#sober' ).hover( function() { $( this ).addClass("tabs2_hover"); },function() { $( this ).removeClass("tabs2_hover"); }	);
            $('button.action_context').addClass('mybut').css('border-color','#FFF');
            GM_log('#=#=# anchor closure_details exists', $('#tabs2_section > h3:nth-child(10) > span:nth-child(1)').length );
            $('#tabs2_section > h3:nth-child(10) > span:nth-child(1)').attr('tabindex','5').attr('id','clodet');
            var closure_details = $('#tabs2_section > h3:nth-child(10) > span:nth-child(1) > span:nth-child(1)');
            if ( closure_details.length === 0 ) {
                closure_details = $('div#tabs2_section > .tab_header:nth-child(10) > .tabs2_tab:nth-child(1) > span:nth-child(1)');
            } else {
                closure_details.attr('id','clodet_img');
            }
            GM_log('#=#=# anchor closure_details exists', closure_details.length, closure_details.css('visibility'), closure_details.hasClass('mandatory') );

            $('button.btn.btn-default.btn-ref.icon-filter.sn-popover-basic').css('margin-left','20px');

            GM_log('#=#=# Add l1 l2 ===== 1');


            $('#label\\.' + script + '\\.number').css('color',$('#label\\.' + script + '\\.u_submitted_on').css('color')).css('background-color', $('#label\\.' + script + '\\.u_submitted_on').css('background-color') ).css('font-weight','initial');
            $('input#sys_readonly\\.' + script + '\\.u_submitted_on').attr('style','');
            $('input#sys_readonly\\.' + script + '\\.closed_at').attr('style','');

            GM_log('#=#=# Add l1 l2 ===== 2');

            if ( loggedin == 'Michel Hegeraat' ) {

                if ( $('#' + script + '\\.u_next_step').val() === '100' ) {
                    $('#' + script + '\\.u_next_step_displayed').append('<option value="-27" >Pending Third Party</option>');
                }
            }


            GM_log('# infobox ' + $('#element\\.' + script + '\\.u_contract').next().find('div.info_box').text() );
            UpdateTableFields();

            $("a[href^='mailto:']").on("click", function() { window.top.location = $(this).prop("href"); return false;});	//  Helper for Chrome to make mailto href work on https page
            $("a[href^='tel:']"   ).on("click", function() { window.top.location = $(this).prop("href"); return false;});	//  Helper for Chrome to make tel  href work on https page
            $("a[href^='im:']"    ).on("click", function() { window.top.location = $(this).prop("href"); return false;});	//  Helper for Chrome to make im   href work on https page
            $("a[href^='xmpp:']"  ).on("click", function() { window.top.location = $(this).prop("href"); return false;});	//  Helper for Chrome to make xmpp href work on https page


            form2options();


            GM_log('#=#=#=# dingdong');

            GM_log('#=#=#',loggedin, MyFirstName,MyLastName);
            myemail = unsafeWindow.window.g_user.userName;
            GM_setValue('curlist', mlt + '&FROM=' + myemail );


            $('#' + script + '\\.urgency').on('change', function() { colorpri(); });
            $('#' + script + '\\.impact').on('change', function() { colorpri(); });

            GM_log('#=#=#=# infobox hide ');
            bannercontrol();


            GM_log('#=#=#=#  outputmsg hide ');

            setTimeout( function()  {
                $('.outputmsg_div').fadeOut(4000);
                $('.outputmsg').fadeOut(4000);
                $('#output_messages').fadeOut(4000);
                var tabspos = $('#tabs2_section').position();
                $('#newfloat').css('display','block').animate( { top: (tabspos.top - 70) + 'px' },2000);
                GM_log('#floater at ' , tabspos.top - 70 );
                UpdateTableFields();
                case_tabs_hover();
            },9000  );


            $('span#' + script + '\\.u_effort_entry > div:nth-child(1) > div:nth-child(1)').find('input').css('width','30px').css('display','table-cell');	// .addClass('no-left-padding-lg');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(1) > div:nth-child(1)').attr('style','left:15px;width:65px !important;');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(2) > div:nth-child(1)').attr('style','left:15px;width:135px !important;');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(1)').css('display','none'); //.attr('style','width:70px !important;');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(2)').attr('style','width:267px !important;');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > label:nth-child(1)').css('padding','0px 4px 0px 4px');
            $('span#' + script + '\\.u_effort_entry > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > label:nth-child(1)').css('padding','0px 4px 0px 4px');

            $('input#ni\\.' + script + '\\.u_effortdur_hour').attr('style','width:30px !important;');
            $('input#ni\\.' + script + '\\.u_effortdur_min' ).attr('style','width:30px !important;border-top-right-radius:3px;border-bottom-right-radius:3px;border-right:1px solid #bdc0c4;');
            $('input#ni\\.' + script + '\\.u_effortdur_sec' ).attr('style','display:none;');


            var new_tm_url = '?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=' + globalContext["task.table_name"] + '&sysparm_collectionID='+ unsafeWindow.window.NOW.sysId + '&sysparm_collection_key=task&sysparm_collection_label=Workload' ;
            var new_tm_lnk = '<span style=""><a title="Add a workload record other than \'Remote support\', e.g. \'Wasted time\'.\n(Opens in a new tab/window)" href="/task_time_worked.do' + new_tm_url + '" target="_blank">[+]</a><span style="width:25px;"> &nbsp; </span></span>';
            $('#' + script + '\\.u_effort_entry').parent().append(new_tm_lnk);


            GM_log('# IM elements ' ,  	$('td.tdwrap:nth-child(1) > strong:nth-child(1) > a:nth-child(1)[href*="data.com"]').length );
            var ownerIM  = '';
            var AssignIM = '';
            var own_nm = $('#sys_display\\.' + script + '\\.u_owner').val().replace(/\s/g,'');
            var ass_nm = $('#sys_display\\.' + script + '\\.assigned_to').val().replace(/\s/g,'');


            GM_log('# IM elements ow as ' , own_nm , ass_nm );

            swowhilite();
            swowhilitelog();
            $('div.swow').attr('style','').addClass('swowhilite');


            $('span.tab_caption_text').on('click', function(e) { tabclick(e); });

            GM_log('# Current action:  ' + curaction );
            if ( curaction == 7) {                           //  7 Closed
                $('#' + script + '\\.comments'  ).hide();
                $('#' + script + '\\.work_notes').hide();
            }

            $('#' + script + '\\.comments'  ).on('keyup', function() {
                var C = $('#' + script + '\\.comments').val();
                GM_log('# comments update' , C  );
                $('#activity-stream-comments-textarea').val( C );
                unsafeWindow.g_form.setValue(script + '.comments', C );
                unsafeWindow.g_form.setValue('activity-stream-comments-textarea', C );
            });

            $('#' + script + '\\.work_notes'  ).on('keyup', function() {
                var C = $('#' + script + '\\.work_notes').val();
                GM_log('# work_notes update', C  );
                $('#activity-stream-work_notes-textarea').val( C );
                unsafeWindow.g_form.setValue(script + '.work_notes', C );
                unsafeWindow.g_form.setValue('activity-stream-work_notes-textarea', C );
            });

            $('button.pull-right').addClass('mybut').attr('id','postbut');
            $('button.pull-right_').on('click', function() {
                GM_log('# Post button clicked');

                GM_log('# Post button clicked comments done');
                GM_log('# Post button clicked work_notes done');
            });
            var wlasel = `<select id="wla" style="width: 14px;background-color: transparent;padding: 0px !important;margin-bottom: 2px;border:none" title="Change the Activity type of the workload. Use Post, not Save/Update!">
<option value="Administration" title="Select if you spent time doing admnistrative duties e.g. paperwork, email, expenses&nbsp;etc." role="option" data-original-title="Select if you spent time doing admnistrative duties e.g. paperwork, email, expenses&nbsp;etc.">Administration</option>
<option value="Knowledge article" title="Select if you spent time doing knowledge article related activities" role="option" data-original-title="Select if you spent time doing knowledge article related activities">Knowledge article</option>
<option value="Consulting" title="Select if you provided consulting services" role="option" data-original-title="Select if you provided consulting services">Consulting</option>
<option value="Documentation - internal" title="Select if you worked on internal documentation" role="option" data-original-title="Select if you worked on internal documentation">Documentation - internal</option>
<option value="Documentation - external" title="Select if you worked on external [client] documentation" role="option" data-original-title="Select if you worked on external [client] documentation">Documentation - external</option>
<option value="Idle time" title="Select if you had no work assigned" role="option" data-original-title="Select if you had no work assigned">Idle time</option>
<option value="Installation" title="Select if you installed a device or software&nbsp;etc.&nbsp;[which is not not as part of a project]" role="option" data-original-title="Select if you installed a device or software&nbsp;etc.&nbsp;[which is not not as part of a project]">Installation</option>
<option value="Lead Engineer" title="Lead engineering time is purchased by the client/country and we need a method of capturing this work" role="option" data-original-title="Lead engineering time is purchased by the client/country and we need a method of capturing this work">Lead Engineer</option>
<option value="Leave - annual" title="Select if you are taking annual leave" role="option" data-original-title="Select if you are taking annual leave">Leave - annual</option>
<option value="Leave - sick" title="Select if you are taking sick leave" role="option" data-original-title="Select if you are taking sick leave">Leave - sick</option>
<option value="Leave - study" title="Select if you are taking study leave" role="option" data-original-title="Select if you are taking study leave">Leave - study</option>
<option value="Leave - other" title="Select if your leave was not annual, sick or study e.g. compassionate, time in lieu" role="option" data-original-title="Select if your leave was not annual, sick or study e.g. compassionate, time in lieu">Leave - other</option>
<option value="Maintenance" title="Select if you performed a maintenance&nbsp;task e.g. cleaning equipment, servicing generators, preventative maintenance etc.&nbsp;" role="option" data-original-title="Select if you performed a maintenance&nbsp;task e.g. cleaning equipment, servicing generators, preventative maintenance etc.&nbsp;">Maintenance</option>
<option value="Management" title="Select if you were invovled in management/team leader duties e.g. budgets, reviews etc." role="option" data-original-title="Select if you were invovled in management/team leader duties e.g. budgets, reviews etc.">Management</option>
<option value="Meeting - internal" title="Select if you attended an internal meeting" role="option" data-original-title="Select if you attended an internal meeting">Meeting - internal</option>
<option value="Meeting - external" title="Select if you attended an external [client, vendor] meeting" role="option" data-original-title="Select if you attended an external [client, vendor] meeting">Meeting - external</option>
<option value="Out of scope" title="Select if the work you performed was out of scope [and generally billable]" role="option" data-original-title="Select if the work you performed was out of scope [and generally billable]">Out of scope</option>
<option value="Project" title="Select if you worked on a project" role="option" data-original-title="Select if you worked on a project">Project</option>
<option value="Reporting - internal" title="Select if you worked on internal reporting" role="option" data-original-title="Select if you worked on internal reporting">Reporting - internal</option>
<option value="Reporting - external" title="Select if you worked on external [client] reporting" role="option" data-original-title="Select if you worked on external [client] reporting">Reporting - external</option>
<option value="Research" title="Select if the work you performed was research" role="option" data-original-title="Select if the work you performed was research">Research</option>
<option value="Support onsite" title="Select if you provided [technical] support onsite" role="option" data-original-title="Select if you provided [technical] support onsite">Support onsite</option>
<option value="Support remote" title="Select if you provided [technical] support remotely" selected="SELECTED" role="option" data-original-title="Select if you provided [technical] support remotely">Support remote</option>
<option value="Service coordination" title="To track and report of the involvement of EU service coordinators in delivering services to clients" role="option" data-original-title="To track and report of the involvement of EU service coordinators in delivering services to clients">Service coordination</option>
<option value="Testing" title="Select if you performed tests e.g.&nbsp;testing a change, a solution etc." role="option" data-original-title="Select if you performed tests e.g.&nbsp;testing a change, a solution etc.">Testing</option>
<option value="Training - course" title="Select if you attended a formal training course [not self learning or stufy leave]" role="option" data-original-title="Select if you attended a formal training course [not self learning or stufy leave]">Training - course</option>
<option value="Training - self learning" title="Select if&nbsp;you spent time self learning [not a training course or study leave]" role="option" data-original-title="Select if&nbsp;you spent time self learning [not a training course or study leave]">Training - self learning</option>
<option value="Travel time" title="Select if you are recording travel time" role="option" data-original-title="Select if you are recording travel time">Travel time</option>
<option value="TS Express" title="Select if you spent time doing  TS express related activities" role="option" data-original-title="Select if you spent time doing  TS express related activities">TS Express</option>
</select>`;
            var pbtit = 'Keep in mind that only this textarea is saved, no other changed fields are saved/updated';
            var defwkld = GM_getValue('DefaultWorkload','Remote Support');
            GM_addStyle(' .efi { border:solid 1px #aaa;padding:2px 0px 2px 2px !important;width:19px;margin-bottom:1px;height:13px;border-radius:4px; }');
            var effortspan = '<p>&nbsp;</p><div style="display:table;"><span style="padding: 2px 3px 3px 4px !important;" title="Add workload ' + defwkld + ' via Post." class="itsmplus posteff">Effort: <input class="myeff_H efi" maxlength="2" value="00"> : <input class="myeff efi" maxlength="2" value="00"> <a style="color:#000;text-decoration:none;" href="" class="tgleff"> &#x21F3; </a> &nbsp; &nbsp;' + wlasel + '</span></div>'; // + new_tm_lnk
            GM_addStyle(' #wla option { background-color:' + $('body').css('background-color') + '; }');
            $('#' + script + '\\.comments'  ).parent().next().append('<a class="mybut fakepb" title="' + pbtit + '">Post</a>' + effortspan );
            $('#' + script + '\\.work_notes').parent().next().append('<a class="mybut fakepb" title="' + pbtit + '">Post</a>' + effortspan );
            $('#' + script + '\\.comments'  ).parent().next().append('<br><p><br><p><img id=shhdframe2 src=/images/section_hide.gifx /><p>');
            $('#l4').append(`<td colspan=11 style="line-height: 0px !important;height: 0px !important;"><table id=shhd2><tr><td style="line-height: 0px !important;height: 0px !important;"><iframe id="externalref2"></iframe></td></tr></table></td>`);
            $("iframe#externalref2").on("load", function () {
                GM_log('# iframe#externalref2 loaded ');
                document.title = casenr + ' ' + $('#' + script + '\\.short_description').val();
                $('iframe#externalref2').contents().find('input#task_time_worked\\.time_worked').show().attr('type','');
                GlideGetWorkload();
            });
            $('#ni\\.' + script + '\\.u_effortdur_hour').addClass('myeff_H');
            $('#ni\\.' + script + '\\.u_effortdur_min').addClass('myeff');
            $('.fakepb').on('click', function() {
                GM_log('# Post button clicked' , $('.myeff').val(),  $('.myeff_H').val() );
                if ( $('.myeff').val() > 0 || $('.myeff_H').val() > 0 ) {
                    addworkload_legacy( $('.myeff_H').val(), $('.myeff').val() );
                    setTimeout(function() {
                        GM_log('# Post button reset form');
                        $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                    }, 3000 );
                }
                $('.myeff_H').val('00');
                $('.myeff').val('00');
                if ( $('#' + script + '\\.comments').val() !== '' || $('#' + script + '\\.work_notes').val() !== '' ) {
                    fakepostbuttonclick( $('#' + script + '\\.comments').val(), $('#' + script + '\\.work_notes').val() );
                    $('#' + script + '\\.comments').val('');
                    $('#' + script + '\\.work_notes').val('');
                }
            });
            $('#wla').on('change', function(e) {
                if ( !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
                GM_log('# wla change ' , $('#wla').val() );
                $('.itsmplus.posteff').attr('title','Add workload ' + $('#wla').val() + ' via Post.' );
                $('iframe#externalref2').contents().find('#task_time_worked\\.u_activity_type').val( $('#wla').val() );
                GM_log('# u_activity_type changed to  ', $('iframe#externalref2').contents().find('#task_time_worked\\.u_activity_type').val(), $('#wla').val() );
            });
            $('.myeff_H').on('change', function(e) {
                GM_log('# myeff_H change ' , e.target.value , e);
                var t = e.target.value;
                var p = t;
                if (t > 23) p = '23';
                $('.myeff_H').val( p.slice(p.length-2) );
                if ( !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
            });
            $('.myeff').on('change', function(e) {
                GM_log('# myeff change ' , e.target.value , e);
                var t = e.target.value;
                var p = t;
                if (t > 59) {
                    p = (t % 60).toString();
                    $('.myeff_H').val(  (t / 60).toString().split('.')[0]  );
                }
                $('.myeff').val( p.slice(p.length-2) );
                if ( !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
                $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_min' ).val(p.slice(p.length-2));
                $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked').val('0 ' + $('.myeff_H.efi').val() + ':' + p.slice(p.length-2) + ':00');
                GM_log('# myeff change ' , $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_min').val() , $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked').val() );
            });

            $('.myeff_H').on('keyup', function(e) {
                GM_log('# myeff_H keyup ' , e.target.value , e);
                var t = e.target.value;
                if ( t > 0 &&  !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
            });
            $('.myeff').on('keyup', function(e) {
                var t = e.target.value;
                GM_log('# myeff keyup ' , e.target.value , e);
                if ( t > 0 && !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
            });

            $('.tgleff').on('click', function() {
                var t = $('.myeff').val();
                var p = '00';
                if ( t >= 0  ) p = '05';
                if ( t >= 5  ) p = '10';
                if ( t >= 10 ) p = '15';
                if ( t >= 15 ) p = '30';
                if ( t >= 30 ) p = '45';
                if ( t >= 45 ) p = '00';
                $('.myeff').val( p.slice(p.length-2) );
                if ( !$('iframe#externalref2').attr('src') || $('iframe#externalref2').attr('src') === '' ) {
                    $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
                }
                $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_min' ).val(p.slice(p.length-2));
                $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked').val('0 ' + $('.myeff_H.efi').val() + ':' + p.slice(p.length-2) + ':00');
                GM_log('# myeff change ' , $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_min').val() , $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked').val());
                return false;
            });
            $('#externalref2').css('width','0px').css('height','0px').css('border','none');
            if (loggedin !== 'Michel Hegeraat')  $('#shhdframe2').css('width','0px');
            $('#shhdframe2').on('click' , function() {
                if ( $('#shhdframe2').attr('src').indexOf('hide') > -1 ) {
                    $('#externalref2').css('width','700px').css('height','554px').css('border','1px solid #000');
                    $('#shhdframe2').attr('src', '/images/section_reveal.gifx');
                } else {
                    $('#externalref2').css('width','0px').css('height','0px').css('border','unset');
                    $('#shhdframe2').attr('src', '/images/section_hide.gifx');
                }
            });
            $('iframe#externalref2').load( function(){
                if ( $('iframe#externalref2').contents().find('#task_time_worked\\.u_activity_type').length ){
                    $('iframe#externalref2').contents().find('#task_time_worked\\.u_activity_type option').each(function(){
                        GM_log('# ',  $(this),  $(this)[0].value , $(this)[0].text  );
                    });
                }
            });

            if ( $('#sys_display\\.' + script + '\\.assigned_to').val() === loggedin &&  $('#' + script + '\\.u_accepted').val() < 1 && script !== 'change_task' ) {
                GM_log('# auto 5 min ', $('#' + script + '\\.u_accepted').val() , $('#element.u_request.comments').find('a.tgleff').length );
                $('.myeff').val('05');
                $('iframe#externalref2').attr('src','/task_time_worked.do?sys_id=-1&sys_is_list=true&sys_is_related_list=true&sys_target=task_time_worked&sysparm_collection=incident&sysparm_collectionID=' + unsafeWindow.NOW.sysId +'&sysparm_collection_key=task&sysparm_collection_label=Workload');
            }


            if ( GM_getValue('CM_create','off') === 'on' ) {
                var txt = GM_getValue('CM_CI','');
                GM_log('# CM case creation ', txt);
                GM_deleteValue('CM_create');
                GM_setValue('CM_create','off');
                //        var country = globalContext["user.primary.group.name"].split('.')[1];
                unsafeWindow.g_form.setValue('sys_display.' + script + '.assignment_group', 'EU.' + country + '.All.CM.ContractManagement');
                unsafeWindow.g_form.setValue('sys_display.' + script + '.u_contract', 'EU.SCT Inquiry - Internal');
                if (txt !== '' && txt !== ';;;;;' && txt.indexOf(';') > -1 ) {
                    var ar = txt.split(';');
                    txt = '';
                    if (ar[0] !== '') txt +=  'Product:\t'  + ar[0] + '\n';
                    if (ar[2] !== '') txt +=  'Serial:\t\t' + ar[2] + '\n';
                    if (ar[4] !== '') txt +=  'Vendor:\t'   + ar[4] + '\n';
                    if (txt !== '') unsafeWindow.g_form.setValue(script + '.comments',txt);
                }
            }

            GM_log('#=#=#=  globalContext : ', unsafeWindow.globalContext  ) ;
            GM_log('#=#=#=  g_form : ', unsafeWindow.g_form ) ;
            GM_log('#=#=#=  NOW : ', unsafeWindow.NOW ) ;
            titlefix();

            GM_log('#=#  Page perf ' );
            pageperf();

            GM_log('#=#  performance? ' , unsafeWindow.performance.timing , unsafeWindow.performance.navigation );
            var loadTime = unsafeWindow.performance.timing.domContentLoadedEventEnd - unsafeWindow.performance.timing.navigationStart;
            GM_log('#=#  Page load time is ' , loadTime);
            $('#pagetm').hover( function() { $('#pagetm').addClass('ptmhover'); },function() { setTimeout( function() { $('#pagetm').removeClass('ptmhover'); },3000 ); });

            GM_log('# bodycss ',  $('#themeselect').attr('style') );
            //  ==============================================

            var lastMutob = '';
            var observer = new MutationObserver( function(mutations) {
                mutations.forEach(function(mutation) {
                    var myVar;
                    var str = 'MutObSrvr ' + mutation.type + ' attrN ' + mutation.attributeName + ' attrNs ' + mutation.attributeNamespace + ' trgt ' + mutation.target.toString() + ' oldvalue ' + mutation.oldValue;
                    str = str + '#=#=MutObSrvr Target [' + hop( mutation.target ).replace(/\n/g,'] [');
                    GM_log(str + ']');

                    if ( str !== lastMutob ){

                        if ( mutation.target.nodeName === 'SPAN') {
                            if ( niettevaak1 === '') {
                                GM_log('#=#= closure det.');
                                mandatory_fields();
                                niettevaak1 = '!';
                                myVar = setInterval(function () { niettevaak1 = ''; }, 500);
                            }
                        }
                        if ( mutation.target.nodeName === 'TD' && mutation.target.toString().indexOf('HTMLTableCellElement') > -1 ) {  //mutation.target.id.indexOf('row_' + script + '.task_time_worked.task') > -1 &&
                            GM_log('#=#= worload. HTMLTableCellElement');
                            if ( niettevaak2 < 3) {
                                GM_log('#=#= worload.');
                                mandatory_fields();
                                niettevaak2++ ;
                                myVar = setInterval(function () { niettevaak2--; }, 1500);
                            } else{
                                GM_log('#=#= worload. HTMLTableCellElement skiped');
                            }
                        }
                        if ( mutation.target.id === script +'.u_redirect_comments' ) {
                            dingdong2();
                        }
                    }
                    lastMutob = str;
                    myVar = setInterval(function () { lastMutob = ''; }, 1000);
                });
            });
            GM_log('#=#=MutObSrvr ' + $('#sys_original\\.' + script + '\\.u_accepted').val() );
            if ( $('#sys_original\\.' + script + '\\.u_accepted').val() === 0 ) {
                var obstarget = document.querySelector( '#' + script + '\\.u_redirect_comments');
                var obsconfig = { attributes: true, childList: true, characterData: true, subtree: true };
                observer.observe(obstarget, obsconfig);
            }



            var prevaction = Number($('#sys_readonly\\.' + script + '\\.u_next_step option:selected').val());                                                       //  6    Resolved
            GM_log('#=#=#=#  Hide these buttons for now ' + prevaction );
            if ( ok2close.indexOf(prevaction) == -1 ) {                                                                                                             //  9    Review
                $("#closeq").hide();                                                                                                                                //  120  Set to restored
                $("#closeq2").hide();                                                                                                                               //  120  Set to restored
                GM_log('#=#=#=#  Hide this button for now ' + prevaction );                                                                                    //  130  Set to resolved
                ClosingCase = false	;
            } else {                                                                                                                                                //  220  Close or cancel task
                ClosingCase = true;
                $('select'  ).on('change', 			function(event) { check4change(event); });
                $('input'   ).on('change keypress', function(event) { check4change(event); });
                $('textarea').on('change keypress', function(event) { check4change(event); });
                $('input#sys_display\\.' + script + '\\.u_task_resolution_code').blur(mandatory_fields);
                $('input#sys_display\\.' + script + '\\.u_task_rootcause'      ).blur(mandatory_fields);
                $('textarea#'            + script + '\\.close_notes'           ).blur(mandatory_fields);
                $('textarea#'            + script + '\\.u_root_cause_comments' ).blur(mandatory_fields);
                mandatory_fields();
            }

            var divcount;
            $(document).bind('DOMSubtreeModified',function() {
                if ($('div').length !== divcount) {
                    divcount = $('div').length;
                    GM_log("#=#     now there are " + divcount + " divs on this page.");
                    if ( ClosingCase ) {
                        if ( $('div#cell_edit_window').length > 0 ) {
                            workloadTableEdit=true;
                        }
                        if ( Boolean(workloadTableEdit) && $('div#cell_edit_window').length === 0 ) {
                            GM_log('#=# workloadTable Edited!');
                            workloadTableEdit=false;
                            mandatory_fields();
                        }
                    }
                    $("div[id='u_kb_show task related kb']").addClass('mypopup');
                    if ( $('div#context_1').length > 0  &&  $('#context_1 > div.context_item').text().indexOf('Contract Management Validation') === -1 ) {
                        var txt = $('#'+ script + '\\.u_custom_text_3').val();
                        GM_log('#=# Content menu opened!! [' + txt + ']');
                        if ($("#context_1 > div.context_item:contains('Contract Management Validation')").length === 0 ) {
                            gcm.addHref("Contract Management Validation", "gsftSubmit(gel('log_internal'))", null, "", null, "");
                            $("#context_1 > div.context_item:contains('Contract Management Validation')").addClass('itsmplus').on('click', function() {
                                GM_setValue('CM_create','on');
                                GM_setValue('CM_CI', txt );
                                alert('CM case ' + txt );
                            });
                        }
                    }
                    //			if ( $('div.arrow').length > 0 ) {
                    //				GM_log('#=# popover menu opened!!');
                    //                var t = $('#toggleMoreOptions').position();
                    //                var t = 0;
                    //                $('div.popover').css('left', (t.left - 180).toString()  + 'px');
                    //                $('div.arrow').css('left','75%');
                    //                setTimeout( function () {
                    //                    $('div.popover').css('left', (t.left - 180).toString()  + 'px');
                    //                    $('div.arrow').css('left','75%');
                    //                },100 );
                    //                setTimeout( function () {
                    //                    $('div.popover').css('left', (t.left - 180).toString()  + 'px');
                    //                    $('div.arrow').css('left','75%');
                    //                },500 );
                    //				GM_log('#=# popover new position ', t.left -180 , t.top  );
                    //            }
                    if ( $('#GwtDateTimePicker').length > 0 )  $('#GwtDateTimePicker').addClass('mypopup').css('width','auto');
                    if ( $('#sys_user').length > 0 ) { GM_log('#=# calling colorphns'); colourphnnrs(); }
                }
            });

            setTimeout( function(){ chk4nwcs(); },3000);


            //	==================================================
            //
        }	// End of Aloop
        //
        //	==================================================

        GM_log('#=#=#=  End of Aloop ', unsafeWindow.globalContext , g_form ) ;

        UpdateTableFields();

        $('div.annotation-wrapper').each( function(){
            $(this).parent().removeAttr('style').removeClass('annotation');
            if ( $(this).text() ) if ($(this).text() === 'TEst' || $(this).text() === '' ) { $(this).css('display','none');
                                                                                           }
        });
        $('#request_manager_output',unsafeWindow.parent.document).css('display','inline');
        $("div[id='u_kb_show task related kb']").addClass('mypopup');

        GM_addStyle(' .afterhours { border:2px solid #400;padding:2px 10px 2px 10px !important;border-radius:5px;  }');
        $('#activity-stream-unordered-list-entries').find('div.date-calendar.ng-binding').each( function() {
            var t = $(this).text().split(' ')[1].split(':');
            var d = new Date( $(this).text() );  // .toString()
            var t1 = t[0] + t[1];
            if ( d.getDay() > 0 && d.getDay() < 6) {
                if ( t1 > 1800  || t1 < 900 ) $(this).addClass('afterhours').attr('title','Outside business hours.');  // redalert  itsmplus swowhilite .parent().parent() .addClass('itsmplus')
            } else $(this).addClass('afterhours').attr('title','Outside business hours.');
        });

        $('#element\\.' + script + '\\.comments').find('span.tdwrap > strong').each(function(){
            var d = new Date( $(this).text().split(' - ')[0]);
            var t = $(this).text().split(' - ')[0].split(' ')[1].split(':');
            var t1 = t[0] + t[1];
            if ( d.getDay() > 0 && d.getDay() < 6 ) {
                if ( t1 > 1800  || t1 < 900 ) $(this).addClass('afterhours').attr('title','Outside business hours.');
            } else $(this).addClass('afterhours').attr('title','Outside business hours.');
        });

        if ( Cont1ID !== '' ) {
            GM_log('# IsTempContact1(' + Cont1ID +') IsTempContact2(' + Cont2ID +') ');
            req_contact = IsTempContact(Cont1ID);
            if (Cont1ID !== Cont2ID) aff_contact = IsTempContact(Cont2ID);
            else aff_contact = req_contact;
            if ( req_contact.tmp === true ) {
                GM_log('# IsTempContact === TRUE');
                $('#sys_display\\.' + script + '\\.u_caller'       ).css('background-color','#edf97a').attr('title','Temporary contact!\nMay be removed while you work on this case.');
            } else {
                GM_log('# IsTempContact === FALSE');
            }
        }
        if ( Cont2ID && aff_contact.tmp === true ) $('#sys_display\\.' + script + '\\.u_requested_for').css('background-color','#edf97a').attr('title','Temporary contact!\nMay be removed while you work on this case.');

        var hoplaa = $('script[data-comment="submit and load"]').text();
        hoplaa = hoplaa.replace(`return confirm(responseObj.status_message);`,`GM_log('# responseObj.status_message=[' + responseObj.status_message + ']'); return true;`);
        $('script[data-comment="submit and load"]').text(hoplaa);

        $('#' + script + '\\.form_scroll'  ).css('height','auto');
        $('div#element\\.' + script + '\\.u_effort').find('[data-original-title]').each(function() {
            $(this).attr('title',$(this).attr('data-original-title'));
            $(this).attr('data-original-title','');
        });
        GM_log('# titlefix end');


        return 0;
        //	==================================================
        //
    }); //	end off $(document).ready
    GM_log('#GM_ITSM+# end');
    //
    //	==================================================




    // ==============================================================================================================================================================
}
// ==============================================================================================================================================================



function tabclick(e){

    GM_log('#> tabclick ' , e);
    if (tab_cap && tab_cap !== '') {
        tab_cap = tab_cap.replace('\\','');
        $('span.tabs2_section').hide();
        $('span.tabs2_section0').show();
        $('span.tabs2_section').each( function() {
            var obj = $(this);
            if (obj.attr('tab_caption') === tab_cap ) {
                GM_log('#> Show section span ' + tab_cap + '.' );
            }
        });
    }



}


function clearstream(){
    GM_log('# clearstream' ) ;
    if ($('#' + script + '\\.comments').val().indexOf('123STREAMENTRY321') > -1 || $('#' + script + '\\.work_notes').val().indexOf('123STREAMENTRY321') > -1 ) {
        $('#' + script + '\\.comments'  ).val('');
        unsafeWindow.g_form.setValue(script + '.comments', '' );
        unsafeWindow.g_form.setValue(script + '.activity-stream-comments-textarea', '' );
        $('#' + script + '\\.work_notes').val('');
        unsafeWindow.g_form.setValue(script + '.work_notes', '' );
        unsafeWindow.g_form.setValue(script + '.activity-stream-work_notes-textarea', '' );
        GM_log('# clearstream done');
    } else {
        GM_log('# clearstream not needed');
    }
}


function instancecolor(instance) {

    var instcol = '#e6e8ea';
    if (instance === 'sandbox')    instcol = '#ffdc73';
    if (instance === 'orion')      instcol = '#E9967A';
    if (instance === 'validation') instcol = '#FF8C00';
    if (instance === 'sandbox')    instcol = '#DDA0DD';
    if (instance === 'support')    instcol = '#278EFC';
    if (instance === 'uat')        instcol = '#FFF44F';
    if (instance === 'hydra')      instcol = '#71E279';
    if (instance === 'cygnus')     instcol = '#808000';
    if (instance === 'lyra')       instcol = '#ADD8E6';
    if (instance === 'pegasus')    instcol = '#9370DB';
    if (instance === 'lynx')       instcol = '#ADD8E6';
    if (instance === 'dorado')     instcol = '#B74B03';
    if (instance === 'gemini')     instcol = '#FFFFFF';
    return instcol;
}

function titlefix() {
}

function ITSMtimeformat(datestring){
    if (datestring === '') return '';
    datestring = datestring.replace(/-/g,'/');
    var n2 = new Date( Date.parse(datestring) );
    var tmdif = (n2.getTimezoneOffset()/60);
    var n = new Date( n2.setHours(n2.getHours() + tmdif) );
    var gooddate = n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2) + ' ' + ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2) + ':00';
    GM_log('#=#=# ITSMtimeformat  in:['+datestring+']  out:['+ gooddate +']' );
    return gooddate;
}

function Normaltmformat(datestring){
    if (datestring === '') return '';
    datestring = datestring.replace(/-/g,'/');
    var n2 = new Date( Date.parse(datestring) );
    var tmdif = (n2.getTimezoneOffset()/60);
    var n = new Date( n2.setHours(n2.getHours() - tmdif) );
    var gooddate = n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2) + ' ' + ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2) + ':00';
    gooddate = ('0' + n.getDate()).slice(-2) + '-' + ('0' + (n.getMonth() + 1)).slice(-2) + '-' + n.getFullYear() + ' ' + ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2) + ':00';
    GM_log('#=#=# ITSMtimeformat  in:['+datestring+']  out:['+ gooddate +']' );
    return gooddate;
}


function pageperf() {
    var pgperf = unsafeWindow.performance.timing;
    var timerlast = new Date();

    var t0 = pgperf.domainLookupStart;
    var t1 = pgperf.domainLookupEnd;
    var t2 = pgperf.requestStart;
    var t3 = pgperf.responseStart;
    var t4 = pgperf.responseEnd;
    var t5 = pgperf.domContentLoadedEventStart;
    var t6 = timer0.getTime();
    var t7 = pgperf.domContentLoadedEventEnd;
    var t8 = timerlast.getTime();

    GM_log('#=#  Page domainLookupStart is				' , pgperf.domainLookupStart );
    GM_log('#=#  Page domainLookupEnd is 				' , pgperf.domainLookupEnd );
    GM_log('#=#  Page requestStart is 				' , pgperf.requestStart );
    GM_log('#=#  Page responseStart is 				' , pgperf.responseStart );
    GM_log('#=#  Page responseEnd is 				' , pgperf.responseEnd );
    GM_log('#=#  Page domContentLoadedEventStart is	 		' , pgperf.domContentLoadedEventStart );
    GM_log('#=#  timer0 msec 					' , timer0.getTime()  );
    GM_log('#=#  Page domContentLoadedEventEnd is 			' , pgperf.domContentLoadedEventEnd );
    GM_log('#=#  timerlast msec 					' , timerlast.getTime()  );
    GM_log('#=#  Page loadEventStart is 				' , pgperf.loadEventStart );
    GM_log('#=#  Page loadEventEnd is 				' , pgperf.loadEventEnd );

    GM_log('# timerlast msec 0 ' , timerlast - timer0 );
    GM_log('# timerlast msec 1 ' , timerlast - timer1 );
    GM_log('# timerlast msec 2 ' , timerlast - timer2 );
    GM_log('# timerlast msec 3 ' , timerlast - timer3 );
    GM_log('# timerlast msec 4 Aloop' , timerlast - timer4 );
    GM_log('# timerlast msec 5 ' , timerlast - timer5 );
    GM_log('# timerlast msec 6 ' , timerlast - timer6 );
    GM_log('# timer = ' + $('span.timing_span').text() + 'ITSM+: ' + (timerlast - timer4) );
    $('#pagetm').text('Page Timing').attr('title', $('span.timing_span').text().trim().replace('Response time(ms)','total').replace('Toggle browser timing details','').replace(/,\s/g,' ms\n').replace(/:/g,':\t') + ' ms including ITSM+:\t' + (timerlast - timer4) + ' ms.' );
    $(`<div style="display:inline-block;border: solid 1px #bbb;border-radius: 5px;padding: 0px 5px;" class=normalbg>
<form action="text_search_exact_match.do" target="_blank">
<input size="26" name="sysparm_search" style="width:30px;height:15px;font-size:10px;padding-left:0px !important;border:0px;" id="sysparm_search" value="" class=normalbg placeholder="Search" title="Search">
<input src="images/search_glass.gifx" width="18" type="image" class="searchGlass" height="18" title="Search" style="margin:0px -4px -4px -6px;">
</form>
</div> &nbsp; &nbsp; `).insertBefore( $('#pagetm') );
    $('#sysparm_search').on('focus', function(){ $(this).addClass('focus');}).on('focusout', function(){$(this).removeClass('focus');});
    GM_log('# timer done.');
    if (script  === 'pm_project') {
        $('#element\\.pm_project\\.cost > div.col-xs-10.col-sm-9.col-md-6.col-lg-5.form-field.input_controls.btn.btn-default').attr('style','width:265px !important;margin-left:15px;');
        $('#element\\.pm_project\\.cost > div.col-xs-10.col-sm-9.col-md-6.col-lg-5.form-field.input_controls.btn.btn-default > div').css('display','none');
        $('#element\\.pm_project\\.percent_complete > div.col-xs-2.col-sm-3.col-lg-2.form-field-addons.btn.btn-default').css('display','none');
        $('#view\\.pm_project\\.sponsor\\.no').css('display','none');
        $('#view\\.pm_project\\.cmdb_ci\\.no').css('display','none');
        $('#view\\.pm_project\\.location\\.no').css('display','none');
    }


}


function ShPoName(txt) {
    if (txt === 'ACV/CSC' ) 									{ txt = 'ACV-CSC';}
    if (txt === 'Colruyt Group Services' )						{ txt = 'Colruyt';}
    if (txt === 'Emmaüs' ) 										{ txt = 'EMMAUS ZIEKENHUIS';}
    if (txt === 'GlaxoSmithKline' ) 							{ txt = 'GSK';}
    if (txt === 'HOPITAL ERASME' ) 								{ txt = 'HÔPITAL ERASME';}
    if (txt === 'Ineos Manufacturing' ) 						{ txt = 'Ineos';}
    if (txt === 'Vlaamse Radio- en Televisieomroep VRT' ) 		{ txt = 'VRT';}
    if (txt) {
        return txt.toUpperCase();
    } else {
        return '';
    }
}



jQuery.expr[':'].icontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};


jQuery.fn.hlitephnnr = function () {
    var re1 = new RegExp("[0-9( +/\.)\\\-:]{10,22}",'g');
    return this.each(function () {
        $(this).contents().filter(function() {
            var xt = re1.exec(this.nodeValue);
            //            var xu = re1.test(this.nodeValue);
            //            var xv = this.nodeType;
            //            GM_log('#=#= matches ', xv, xu, xt );
            return this.nodeType == 3 && xt != null && xt.input;
        }).replaceWith(function() {
            return (this.nodeValue || "").replace(re1, function(match) { return fixnr(match); });
        });
    });
};

function fixnr(phnnr) {
    var re2 = new RegExp("[0-9]", 'g');
    var fixphnnr = phnnr.replace(/[ \-\:./]/g,'');
    fixphnnr = fixphnnr.replace(/\./g,'');
    fixphnnr = fixphnnr.replace(/\(0\)/g,'').replace(/\)/g,'').replace(/\(/g,'');
    fixphnnr = fixphnnr.replace(/\+\+/g,'').replace(/\-\-/g,'');
    fixphnnr = fixphnnr.replace(/^000/,'');
    fixphnnr = fixphnnr.replace(/^\+0/,'+32');
    fixphnnr = fixphnnr.replace(/^047/,'+3247');
    fixphnnr = fixphnnr.replace(/^048/,'+3248');
    fixphnnr = fixphnnr.replace(/^049/,'+3249');
    fixphnnr = fixphnnr.replace(/^0032/,'+32');
    fixphnnr = fixphnnr.replace(/^32/,'+32');
    fixphnnr = fixphnnr.replace(/^0/,'+32');
    fixphnnr = fixphnnr.replace(/\s/g,'');
    var justnr = fixphnnr.match(re2) || "";
    if ( justnr.length > 9 &&  justnr.length < 13 &&  fixphnnr.substring(1, 0) === '+' ) {
        GM_log('#=#= is phn ', phnnr, fixphnnr );
        if (phnnr.slice(0,1) === ':') {
            return ": <a class='phnlnk1' title='Call number: " + fixphnnr + "' href=\"tel:" + fixphnnr + "\"><img class='phncl' src='images/mobile/phone.gifx'/><span class='telclr'>" + phnnr.slice(1) + "</span> </a>";
        } else {
            return " <a class='phnlnk1' title='Call number: " + fixphnnr + "' href=\"tel:" + fixphnnr + "\"><img class='phncl' src='images/mobile/phone.gifx'/><span class='telclr'>" + phnnr + "</span> </a>";
        }
    } else {
        GM_log('#=#= not phn ', phnnr, fixphnnr );
        return phnnr;
    }
}


jQuery.fn.highlight = function (str) {
    var regex = new RegExp(str, "gi");
    return this.each(function () {
        $(this).contents().filter(function() {
            return this.nodeType == 3 && regex.test(this.nodeValue);
        }).replaceWith(function() {
            return (this.nodeValue || "").replace(regex, function(match) {
                return "<span style='color:#00f;'>" + match + "</span>";
            });
        });
    });
};


function myphnnrhlite(html) {
    GM_log('#=#= myphnnrhlite start', html);
    var p = html.split('<br>');
    GM_log('#=#= myphnnrhlite ' , p.length);
    for (i=0; i<p.length ;i++) {
        var line = p[i];
        GM_log('#=#= line = ', p[i] );

    }
}


function mkphnnmbrclckbl() {
    // This query finds all text nodes with at least 12 non-whitespace characters
    // who are not direct children of an anchor tag
    // Letting XPath apply basic filters dramatically reduces the number of elements
    // you need to process (there are tons of short and/or pure whitespace text nodes
    // in most DOMs)
    var xpr = unsafeWindow.document.evaluate('descendant-or-self::text()[not(parent::A) and string-length(normalize-space(self::text())) >= 12]',unsafeWindow.document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    GM_log('#=#= nodes found ', xpr.snapshotLength );
    for (var i=0, len=xpr.snapshotLength; i < len; ++i) {
        var txt = xpr.snapshotItem(i);
        GM_log('#=#= node  ', txt );
        // Splits with grouping to preserve the text split on
        var numbers = txt.data.split(/([(]?\d{3}[)]?[(\s)?.-]\d{3}[\s.-]\d{4})/);
        // split will return at least three items on a hit, prefix, split match, and suffix
        if (numbers.length >= 3) {
            var parent = txt.parentNode; // Save parent before replacing child
            // Replace contents of parent with text before first number
            parent.textContent = numbers[0];

            // Now explicitly create pairs of anchors and following text nodes
            for (var j = 1; j < numbers.length; j += 2) {
                // Operate in pairs; odd index is phone number, even is
                // text following that phone number
                var anc = document.createElement('a');
                anc.href = 'tel:' + numbers[j].replace(/\D+/g, '');
                anc.textContent = numbers[j];
                parent.appendChild(anc);
                parent.appendChild(document.createTextNode(numbers[j+1]));
            }
            parent.normalize(); // Normalize whitespace after rebuilding
        }
    }
}



function setcolors(bgcolor,txtcolor) {
    if ( window.location.href.indexOf('service-now.com')  > -1 ) {
        GM_log('# Setting colors');
        $('.label').removeClass('label').addClass('label_');
        $('.header').removeClass('header').addClass('label_');
        $('.wideDataList').removeClass('wideDataList');
        $('.list_odd' ).css('opacity','0.8').find('td').css('background-color','transparant').css('color',txtcolor);
        $('.list_even').css('opacity','0.8').find('td').css('background-color','transparant').css('color',txtcolor);
        GM_addStyle(' table           { background-color:' + bgcolor + '; }');
        GM_addStyle(' body            { background-color:' + bgcolor + '; }');
        GM_addStyle(' iframe          { background-color:' + bgcolor + '; }');
        GM_addStyle(' .label          { background-color:' + bgcolor + '; }');
        GM_addStyle(' .label_         { background-color:' + bgcolor + '; }');
        GM_addStyle(' .navpage_header_controls { background-color:' + bgcolor + '; }');
        GM_addStyle(' td.label        { background-color:transparant; }');
        GM_addStyle(' td.label_left   { background-color:transparant; }');
        GM_addStyle(' td.label_right  { background-color:transparant; }');
        GM_addStyle(' .tabs2_strip    { background-color:transparant; }');
        GM_addStyle(' tr.header       { background-color:transparant; }');
        GM_addStyle(' body            { color:' + txtcolor + '; }');
        GM_addStyle(' label           { color:' + txtcolor + '; }');
        GM_addStyle(' table           { color:' + txtcolor + '; }');
        GM_addStyle(' li              { color:' + txtcolor + '; }');
        GM_addStyle(' .vt             { color:' + txtcolor + '; }');
        GM_addStyle(' .list2_body     { color:' + txtcolor + '; }');
        $('tr#banner_row').removeAttr('id');
        $('.list_nav').removeClass('list_nav');
        if ( window.location.href.indexOf('navpage.do')  > -1 || window.location.href.slice(-1) === '/' ) $('div').css('background-color', 'transparent');
    }
}


function wanker(tmr1) {
    //		$('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(1)').css('background-position','right top'   ).css('background-repeat','no-repeat').css('background-image','url(https://s-media-cache-ak0.pinimg.com/originals/21/05/6f/21056fa0930015a43118d54ac3d10646.jpg)');
    //		$('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(2)').css('background-position','right bottom').css('background-repeat','no-repeat').css('background-image','url(https://s-media-cache-ak0.pinimg.com/originals/21/05/6f/21056fa0930015a43118d54ac3d10646.jpg)');

    GM_log('#=#= wanker start');
    setTimeout( function() {
        if ( Math.floor(Math.random()*(10)) > 5 ) {
            $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(1)').css('background-position','right top'   ).css('background-repeat','no-repeat').css('background-image','url(https://s-media-cache-ak0.pinimg.com/originals/21/05/6f/21056fa0930015a43118d54ac3d10646.jpg)');
        } else {
            $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(2)').css('background-position','right bottom').css('background-repeat','no-repeat').css('background-image','url(https://s-media-cache-ak0.pinimg.com/originals/21/05/6f/21056fa0930015a43118d54ac3d10646.jpg)');
        }
        setTimeout( function() {
            $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(1)').css('background-image','none');
            $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(2)').css('background-image','none');
        }, 10000 );
    }, tmr1 * 1000);
    GM_log('#=#= wanker done');
}

function hop(obj) {                                           // Just here for debugging objects
    var msg ='name:\t'       + obj.nodeName +
        '\nid:\t'       + obj.id +
        '\nnodetype:\t' + obj.nodeType +
        '\nval:\t'      + obj.nodeValue +
        '\ntagName:\t'  + obj.tagName +
        '\nnodes:\t'    + obj.length;
    return msg;
}

function data2file (data, filename, type) {
    GM_log('# data2file called ',  data, filename, type );
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function showfiletxt(txt) {
    GM_log('# open showfiletxt : ', text );
}

function showpopup(txt,timeout) {
    var p = timeout + (timeout/5);
    $('body').append(`<div id=sillypop style="position:absolute;z-index:1000;white-space:pre;background:#000;color:#fff;border-radius:8px;padding:30px;border:18px solid #622;top:100px;left:100px;box-shadow: rgba(0, 0, 0, 0.5) 12px 12px 15px 0px;">
` + txt + `
<span id=counter></span><a id=cls style="color:#000;float:right;"> -= OK =- </a><p><br>
<p><span>If you would like to discuss ITSM+, have a question or if you notice a bug, please join me on the <a href="https://www.yammer.com/dimensiondata.com/#/threads/inGroup?type=in_group&feedId=13943584" target="_new">ITSM+ Yammer Group</a>. </span><p>
</div>`);
    setInterval( function() {
        $('#counter').text(p);
        p--;
    },1000);
    setTimeout(function() {
        $('#cls').addClass('mybut').on('click',function() { $('#sillypop').hide(5000); });
    }, ( timeout / 2) * 1000 );
    setTimeout(function() {
        $('#sillypop').hide(5000);
    }, (timeout + (timeout/5)) * 1000 );
}



function smoothScrollIntoView(elem) {
    GM_log('# smoothScrollIntoView ' ,  document.getElementById( elem ).length );
    //    document.getElementById( elem ).scrollIntoView( { behavior: "smooth"} );
}

function get_journal_records() {
    var gr = new GlideRecord('sys_journal_field');
    gr.get('sys_id', 'bea99a6cdb6336448bb5349a7c961966' );
    gr.setValue('sys_updated_by','Michel.Hegeraat@dimensiondata.com');
    gr.setValue('sys_mod_count','1');
    gr.setValue('value','');
    gr.update(updatedone);
}

function ins_journal_records() {
    var gr = new GlideRecord('sys_journal_field');
    gr.initialize();
    gr.setValue('element_id', unsafeWindow.window.NOW.sysId );
    gr.setValue('element','comments');
    gr.setValue('value','testing123');
    gr.insert(updatedone);
}


function update_SWOW_records() {
    GM_log('#=#=# addstuFf clicked ');
    var tbl = globalContext["task.table_name"];   // u_request or incident
    var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
    gr.get(unsafeWindow.window.NOW.sysId);
    GM_log('#=#=# addstuff table [' + tbl + '] where sysid=' + unsafeWindow.window.NOW.sysId );
    GM_log('#=#=# addstuff query done', gr );
    var tmp = gr.short_description;
    gr.short_description = '[Updated]' + tmp;
    gr.u_custom_text_2 = '#Updated#' + unsafeWindow.g_form.getValue( script + '.u_custom_text_2') ;
    gr.setValue( 'u_custom_date_2' , '01-Jan-2000 00:11:02');
    gr.setValue( 'u_custom_date_3' , '01-Jan-2000 00:11:03');
    gr.update(updatedone1);

    GM_log('#=#=# addstuff update done', gr );
}


function update_SWOW_records2(gr) {
    GM_log('#=#= Glide Record update0 :', gr);
    unsafeWindow.g_form.setValue( script + '.u_custom_text_2' , '#==#' + unsafeWindow.g_form.getValue( script + '.u_custom_text_2') );
    unsafeWindow.g_form.setValue( script + '.u_custom_text_3' , '#==#' + unsafeWindow.g_form.getValue( script + '.u_custom_text_3') );
    gr.setValue( 'u_custom_text_2' , '#=#' + unsafeWindow.g_form.getValue( script + '.u_custom_text_2') );
    gr.setValue( 'u_custom_text_3' , '#=#' + unsafeWindow.g_form.getValue( script + '.u_custom_text_3') );
    gr.setValue( 'u_custom_date_2' , '01-Jan-1970 00:11:02');
    gr.setValue( 'u_custom_date_3' , '01-Jan-1970 00:11:03');
    gr.update(updatedone2);
    GM_log('#=#= Glide Record update SWOW :');
}

function updatedone(gr) {
    GM_log('# update_SWOW_records done.' , gr);
}
function updatedone0(gr) {
    GM_log('# update_SWOW_records0 done.' , gr);
}
function updatedone1(gr) {
    GM_log('# update_SWOW_records1 done.' , gr);
}
function updatedone2(gr) {
    GM_log('# update_SWOW_records2 done.' , gr);
}

function addworkload(tm) {
    GM_log('#=#=# addworkload', tm );
    if ( tm > 59 ) tm = 59;
    if ( tm > 0 ) {
        if ( tm < 10 ) { tms = '0' + tm; } else { tms = tm.toString(); }
        var gr1 = new GlideRecord('task_time_worked');
        gr1.initialize();
        GM_log('#=#=# adding workload', tms );
        gr1.task = unsafeWindow.window.NOW.sysId;
        gr1.u_activity_type = 'Support remote';
        gr1.time_worked = '1970-01-01 00:' + tms + ':00';
        gr1.user = unsafeWindow.window.NOW.user_id;

        if ( $('#sys_display\\.' + script + '\\.u_contract').val() === 'Uncovered base' ) gr1.u_billable  = 'false';
        if ( unsafeWindow.globalContext["contract.name"] && (unsafeWindow.globalContext["contract.name"].indexOf('MACD') > -1  || unsafeWindow.globalContext["contract.name"].indexOf('MSEN Request Fulfilment') > -1 )) gr1.u_approved = 'Approve';

        gr1.insert(workloadinsert);
        GM_log('##==##   workload added ' );
    }

    function workloadinsert(gr) {
        GM_log('# workloadinsert done.' , gr);
    }
}



function addworkload_legacy(th, tm) {
    GM_log('#=#=# addworkload_legacy called');
    var tms ='';
    var ths ='';
    if ( th > 8 ) th = 8;
    if ( tm > 59 ) tm = 59;
    ths = '0' + th.toString();
    tms = '0' + tm.toString();
    ths = ths.slice(ths.length-2);
    tms = tms.slice(tms.length-2);
    var reftype = GM_getValue('DefaultWorkload','Remote Support');
    if ( $('#sys_display\\.' + script + '\\.u_contract').val() === 'Uncovered base' ) $('iframe#externalref2').contents().find('#task_time_worked\\.u_billable').val(false);

    var externalrefiframe = $('iframe#externalref2').contents();
    $('iframe#externalref2').contents().find('input#task_time_worked\\.time_worked').show();
    GM_log('#=#=# addworkload legacy sv1 ',  externalrefiframe[0] , $('iframe#externalref2').contents().find('input#task_time_worked\\.time_worked').length );
    $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked').focus().val('0 ' + ths + ':' + tms + ':00').blur();
    $('iframe#externalref2').contents().find('#task_time_worked\\.u_activity_type').val(reftype);
    var min = $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_min' );
    var hrs = $('iframe#externalref2').contents().find('#ni\\.task_time_worked\\.time_workeddur_hour');
    var tmw = $('iframe#externalref2').contents().find('#task_time_worked\\.time_worked');   // task_time_worked.time_worked
    $(min).focus().val(Number(tms));
    $(min).change();
    $(hrs).focus().val(ths);
    $(min).change();
    $(tmw).focus().val('0 ' + ths + ':' + tms + ':00');
    $(tmw).change();
    $('iframe#externalref2').contents().find('#submitContinue')[0].click();
    GM_log('#=#=# addworkload legacy 1 ',  min.length , min.val() );
    GM_log('#=#=# addworkload legacy 2 ',  hrs.length , hrs.val() );
    GM_log('#=#=# addworkload legacy 3 ',  tmw.length , tmw.val() );
    GM_log('#=#=# addworkload legacy 4 ',  $('iframe#externalref2').contents().find('#submitContinue') );
    GM_log('#=#=# addworkload legacy', ths , tms , reftype);
}


function checkForUpdate(){

    var plugin_url = 'https://greasyfork.org/scripts/26921-itsm/code/ITSM+.user.js?'+new Date().getTime();

    if ( parseInt('0') + 86400000 <= new Date().getTime() ) {
        try {
            GM_xmlhttpRequest( {
                method: 'GET',
                url: plugin_url,
                headers: {'Cache-Control': 'no-cache'},
                onload: function(resp){
                    var local_version, remote_version, rt, script_name;

                    rt=resp.responseText;
                    GM_setValue('SUC_last_update', new Date().getTime()+'');
                    remote_version = parseFloat(/@version\s*(.*?)\s*$/m.exec(rt)[1]);
                    local_version = GM_info.script.version;

                    if(local_version!=-1){
                        script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];
                        GM_setValue('SUC_target_script_name', script_name);

                        if (remote_version > local_version){
                            $('div.nav.navbar-right').prepend(`<div class="newversavail" style="display: table-cell;width: 175px;line-height: 19px;margin: 15px 7px 15px 7px;background-color: yellow;border-radius: 15px;max-height: 18px;height: 18px !important;border: 2px solid red;"><a href="https://greasyfork.org/scripts/26921-itsm/code/ITSM+.user.js" target="_new" style="
text-decoration: none;color: black;"> &nbsp; &nbsp;ITSM+ Update available: ` + remote_version + `</a></div>`);

                            GM_log('## An update is available for "'+script_name+'"', $('div.nav.navbar-right').length);
                            return 'ITSM+ Update available: ' + remote_version;
                        }
                        else{
                            GM_log('## No update is available for "'+script_name+'"');
                            return '';
                        }
                    }
                    else{
                        GM_setValue('SUC_current_version', remote_version+'');
                    }
                }
            });
        }
        catch (err){
            GM_log('An error occurred while checking for updates:\n'+err);
        }
        return '';
    }
}


function ServicenowVersion() {
    var csv_url = hostn + '/stats.do?'+new Date().getTime();
    GM_log('### ServicenowVersion ' + csv_url );
    var nm = 'Build tag:';
    if ( parseInt('0') + 86400000 <= new Date().getTime() ) {   // what does this do?
        try {
            GM_xmlhttpRequest( {
                method: 'GET',
                url: csv_url,
                headers: {'Cache-Control': 'no-cache'},
                onload: function(resp){
                    var rt;
                    var str;
                    rt=resp.responseText;
                    GM_log('### ServicenowVersion ' + rt  );
                    if ( rt.indexOf(nm) > - 1 ) {
                        str = rt.substr( rt.indexOf(';'+nm)-2 , 150).split(/\n/)[0];
                        GM_log('### ServicenowVersion ' , nm, ' | ' , str );
                    }
                }
            });
        }
        catch (err){
            GM_log('An error occurred getting url:\n'+err);
        }
        return '';
    }
}


function checkGDClist(nm){

    var csv_url = 'https://nttlimited.sharepoint.com/:x:/r/teams/23vfd/internalsite/Shared%20Documents/Main%20clients%20file/EU%20clients%20list%20guidence%20csv.csv?'+new Date().getTime();
    // https://dimensiondata.sharepoint.com/:x:/r/teams/23vfd/internalsite/Shared%20Documents/Main%20clients%20file/EU%20clients%20list%20guidence%20csv.csv
    if ( parseInt('0') + 86400000 <= new Date().getTime() ) {
        try {
            GM_xmlhttpRequest( {
                method: 'GET',
                url: csv_url,
                headers: {'Cache-Control': 'no-cache'},
                onload: function(resp){
                    var rt;
                    var str;
                    rt=resp.responseText;
                    if ( rt.indexOf(nm) > - 1 ) {
                        str = rt.substr( rt.indexOf(';'+nm)-2 , 150).split(/\n/)[0];
                        GM_log('### checkGDClist ' , nm, ' | ' , str );
                        var myarr = [];
                        myarr = str.split(';');
                        $('#myinfo_box2').text('     ' + myarr[3] + '    ' + myarr[4] + '    ' + myarr[5] + '    ' + myarr[6] + '      ').css('border-radius','5px').show();
                        $('#myinfo_box2').addClass('lblnor');
                        if ( myarr[3].indexOf('GDC') > -1 ) $('#myinfo_box2').addClass('lblhi');  //
                    }
                    str = rt.substr( rt.indexOf(';European Par')-2 , 150).split(/\n/)[0];
                    GM_log('### checkGDClist European Par | ' , str );
                }
            });
        }
        catch (err){
            GM_log('An error occurred while checking for updates:\n'+err);
        }
        return '';
    }
}


function CapitalFirst(str) {
    if (str ==='spkg')     str ='software package';
    if (str ==='netgear')  str ='network gear';
    if (str !== '')   return str.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ').replace('Ip ','IP ');
    else return '';
}

function addScriptNode() {
    var myscriptnode = `<script>
(function() {
itsmurl = 'https://www.yammer.com/dimensiondata.com/#/files/127346546';
$.getJSON( itsmurl, function()     {  GM_log( "# jsonversion success"  );  })
.fail(   function()     {  GM_log( "# jsonversion error"    );  })
.always( function()     {  GM_log( "# jsonversion complete" );  })
.done(   function(json) {
GM_log( "# jsonversion second success" , json );
alert(json);
});
});
</script>`;
    $('body').append(myscriptnode);
}

function GDC_close() {
    GM_log('#=#=# GDC_close ');
    var tbl = globalContext["task.table_name"];   // u_request or incident
    var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
    gr.get(unsafeWindow.window.NOW.sysId);
    if ( gr.u_next_step !== '780' ) {
        GM_log('#=#=# GDC_close update not 780 ', gr.u_next_step );
        gr.u_next_step = 780;
        gr.update(GDCupdate2);
    }
    gr.u_next_step = 230;
    gr.update(GDCupdate1);

    function GDCupdate1(gr) {
        GM_log('#=#=# GDC_close update  ', gr.u_next_step );
        gr.u_next_step = 380;
        GM_log('#=#=# GDC_close update 1 ', gr);
        gr.update(GDCupdate2);
    }

    function GDCupdate2(gr) {
        GM_log('#=#=# GDC_close update  ', gr.u_next_step );
    }
}


function gtseltxt() {
    var t = '';
    if(unsafeWindow.getSelection){
        t = unsafeWindow.getSelection().toString();
    }else if(document.getSelection){
        t = document.getSelection().toString();
    }else if(document.selection){
        t = document.selection.createRange().text;
    }
    return t.trim();
}

$(document).on('mousemove', function(e) {
    if ($target) { $target.offset( { top:e.pageY - yoff, left:e.pageX - xoff } ); }
}         ).on('mouseup'  , function(e) {

    GM_log('#=#= on mouseup line 12537 ' , e, $target);

    if ( $('#tabs2_section').length > 0 ) {
        if ( $('#tabs2_section > span.tab_header.contractchange > span > span.label_description').css('display') !== 'none' ) {
            GM_log("#=# contractchange mandatory " + $('#tabs2_section > span.tab_header.contractchange > span > span.label_description').css('display') + " ");
            $('#tabs2_section > span.tab_header.contractchange.insertpoint > span > span.label_description').show().css('visibility','visible');
            if ( $('#tabs2_section > span.tab_header.contractchange.insertpoint > span > span.label_description').next().length > 0 ) $('#tabs2_section > span.tab_header.contractchange.insertpoint > span > span.label_description').next()[0].click();
        } else {
            $('#tabs2_section > span.tab_header.contractchange.insertpoint > span > span.label_description').hide();
        }
    }

    $target = null;
    $('body').find(".draggable").removeClass('draggable');
    $('body').removeClass('noselect');
    if (sel_target) {
        var t = gtseltxt();
        if (t.length > 1 ) {
            $('#' + sel_target).val(t);
            GM_log('# selected text:' + t  + ' target is: ' + sel_target);
        }
    }
}).dblclick( function(e) {
    if (sel_target) {
        var t = gtseltxt();
        if (t.length > 1 ) {
            $('#' + sel_target).val(t);
            GM_log('# selected text:' + t  + ' target is: ' + sel_target);
        }
    }

});


function CIsearch(e) {
    GM_addStyle(' .mypopup{ background-color:#eee;border:solid 1px #888;border-radius:7px;color:#000;padding:7px 7px 0px 7px; z-index:100;box-shadow: 3px 3px 10px 6px rgba(192,240,240,0.75); }');
    GM_addStyle(' .draghandle      		{ cursor:move; }');
    GM_addStyle(' .draghandle:hover		{ background-color:rgba(221,255,238, 0.4); }');
    GM_addStyle(' .sprite1				{ background-image:url("/images/sprites/i16.pngx"); background-repeat: no-repeat; }');
    GM_addStyle(' .close-button	        { width:16px;height:16px;display:block;background-position: -0px -208px; }');
    GM_addStyle(' .close-button:hover   { background-color:#f00; }');
    GM_addStyle(' .clkme                { cursor:pointer; }');
    GM_addStyle(' .clkme:hover          { background-color:#622 !important; color:#fff; }');
    GM_addStyle(' .clkme2               { cursor:pointer; }');
    GM_addStyle(' .clkme2:hover         { background-color:#622 !important; color:#fff; }');
    GM_addStyle(' .BOcontract           { background-color:#2F6 !important; }');
    GM_addStyle(' #mysearch table td    { padding: 0px 11px 0px 11px !important; }');  // background-color:#eee;
    GM_addStyle(' #mysearch table       { background-color:transparent; }');  // background-color:#eee;
    GM_addStyle(' .ina                  { color:#888; }');
    GM_addStyle(' .act                  { color:#000; }');

    GM_log('# CI Search popup ', e);

    if (typeof unsafeWindow === "undefined") unsafeWindow = window;
    var x, y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }
    y = y + 75;
    x = x - 550;
    if ( x < 10 ) { x=70; }
    var trg_sysid = '';
    var trg_row = '';
    var CIobj = [];
    var COobj = [];
    var cur_comp  = '';
    var cur_compt = '';
    var cur_loca  = '';
    var cur_locat = '';
    var str = '0123456789abcdef';
    var search4 = '';
    var srchfld = '';

    var popup_content =`
<table width="100%"><tbody>
<tr style="height:13px;margin-bottom:6px;"><td colspan="14" id="dragsrch" class="draghandle" style="padding:0px !important; "><a style="float:right;"><span id="Closesrch" class="sprite1 close-button"></span></a></td></tr>
</tr></tbody></table>
<table id="srchtbl"  ><tbody>
<tr><td colspan="14"> &nbsp; </td></tr>
<tr>
<td> Search CI's where </td>
<td><select id="search4" style="width:150px !important;" class="form-control">
<option value="u_system_name"            >System name   </option>
<option value="serial_number"            >Serial number </option>
<option value="u_license_key"            >Licence/PAK   </option>
<option value="ip_address"               >IP Address    </option>
<option value="name"                     >CI Name       </option>
<option value="u_customer_device_name"   >Client CI name</option>
<option value="u_ci_external_system_id"  >ExternalSysID </option>
<option value="asset_tag"                >Asset Tag     </option>
</select></td>
<td><select id="oper" style="width:90px !important;" class="form-control">
<option> is </option>
<option> startswith </option>
</td>
<td><input id="srchfld" class="form-control" value='' style="width:250px;"></td>
<td><a id="dosrch" class="mybut">Go</a></td><td> &nbsp; </td>
<td><a id="addCI" class="mybut" style="display:none;">Add CI to Info-Table</a></td><td colspan=7> &nbsp; </td></tr>
<tr><td icolspan=14> &nbsp; </td></tr>
<tr><td id=res colspan=14></td></tr>
</tbody></table>
<table id="rslttbl" width="100%" style="display: none;"><tbody>
<tr><td colspan="11"> &nbsp; </td></tr>
<tr class="itsmplus">
<td>System name</td>
<td>CI name</td>
<td>Client CI name</td>
<td>Serial number</td>
<td>Company</td>
<td>Location</td>
<td>Status</td>
<td>CI ESID</td>
<td>Asset Tag</td>
</tr>
</tbody></table>
<table id="contrtbl"  style="display: none;"><tbody>
<tr><td colspan="11"> &nbsp; </td></tr>
<tr class="itsmplus">
<td>Contract name</td>
<td>Sales org</td>
<td>Service</td>
<td>Status</td>
<td>Start Date</td>
<td>End Date</td>
</tr>
</tbody></table>
<table><tbody><tr><td colspan="11"> &nbsp; </td></tr></tbody></table>`;

    script = script.replace('.do','');
    cur_comp  = $('#' + script + '\\.company').val(); // is a company loaded?
    cur_loca  = $('#' + script + '\\.location').val(); // is a company loaded?
    cur_compt = $('#sys_display\\.' + script + '\\.company').val();
    cur_locat = $('#sys_display\\.' + script + '\\.location').val();
    GM_log('#=#= company 4 CIsearch found ' , $('#' + script + '\\.company').length , script , x , y);
    if ( $("#mysearch").length == 0 ) $('body').append('<div id="mysearch" class="mypopup" style="position: absolute;">' + popup_content + '</div>');
    if ( $('#sys_display\\.' + script + '\\.u_contract_ci').val() !== '' ) $('#srchfld').val( $('#sys_display\\.' + script + '\\.u_contract_ci').val() );
    if ( $('#sys_display\\.' + script + '\\.cmdb_ci').val() !== ''       ) $('#srchfld').val( $('#sys_display\\.' + script + '\\.cmdb_ci').val() );
    $('#mysearch').show();
    $("#mysearch").css('top',y + 'px').css('left',x + 'px').fadeIn(500);
    $('#dragsrch').on('mousedown', function(e) {
        if ( $(e.target).attr('id') === 'Closesrch') {
            $("#mysearch").fadeOut(1000);
        } else {
            if(e.offsetX===undefined){
                xoff = e.pageX-$(this).offset().left;
                yoff = e.pageY-$(this).offset().top;
            }else{
                xoff = e.offsetX;
                yoff = e.offsetY;
            }
        }
        $(this).addClass('draggable');
        $('body').addClass('noselect');
        $target = $(e.target).parent().parent().parent().parent();
        GM_log('#=#= drag CIsearch' , $target.attr('id') );
    });
    $('#dosrch').click( function() {
        $('#dosrch').addClass('mybuthi');
        $('#rslttbl > tbody').find('tr.clkme').remove();
        $('#contrtbl > tbody').find('tr.clkme2').remove();
        $('#contrtbl > tbody').find('tr.BOcontract').remove();
        search4 = $('#search4').val();
        srchfld = $('#srchfld').val();
        GM_log('# CI Searching for ' + search4 + ' is ' + srchfld );
        $('#res').text('Searching for ' + search4 + ' is ' + srchfld );
        if ( search4 !== 'u_license_key' ) var gr = new GlideRecord('cmdb_ci');
        else {
            var gr = new GlideRecord('cmdb_ci_spkg');
            $('#rslttbl > tbody > tr.itsmplus > td:nth-child(4)').text('License/PAK');
        }
        if ( $('#oper').val() === 'is' ) gr.addQuery(search4, srchfld);
        else gr.addQuery(search4, 'STARTSWITH', srchfld);
        gr.query(qres);
    });

    function qres(gr) {
        GM_log('# CI results  ', gr);
        $('#dosrch').removeClass('mybuthi');
        $('#res').text( 'Found ' + gr.rows.length + ' CI(\'s).' );
        if (gr.rows.length > 0 ) {
            $('#rslttbl').css('display','table');
            if ( script !== 'u_new_call' ) $('#addCI').show();
        }
        $('#rslttbl > tbody').find('tr.clkme').remove();
        var rowcounter = 0;
        while ( gr.next() )  {
            // clear search?
            resln =  gr.u_system_name + '</td><td>';
            resln += gr.name + '</td><td>';
            resln += gr.u_customer_device_name + '</td><td>';
            if ( search4 !== 'u_license_key' ) resln += gr.serial_number + '</td><td class="cmp">';
            else resln += gr.u_license_key + '</td><td class="cmp">';
            if (gr.company !== cur_comp ) resln += gr.company + '</td><td class="loc">';
            else resln += cur_compt + '</td><td class="loc">';
            if (gr.location !== cur_loca ) resln += gr.location + '</td><td>';
            else resln += cur_locat + '</td><td>';
            resln += gr.u_status + '</td><td>';
            resln += gr.u_ci_external_system_id + '</td><td>';
            resln += gr.asset_tag;
            $('#rslttbl > tbody:last-child').append('<tr row="' + rowcounter + '" id="ci-sysid_'+ gr.sys_id +'" class="clkme"><td>'+resln+'</td></tr>');
            CIobj.push({ sys_id:gr.sys_id, company:gr.company, location: gr.location, model:gr.model_id, sys_name:gr.u_system_name, serial:gr.serial_number, lic:gr.u_license_key, manuf:gr.manufacturer, os:gr.u_operating_system, osv:gr.u_os_version });
            GM_log('# CIobj  ', CIobj[rowcounter]);
            rowcounter++;
        }
        if (gr.rows.length == 1) {
            trg_sysid = gr.sys_id;
            trg_row = 0;
            var gr = new GlideRecord('contract_rel_ci');
            gr.addQuery('ci_item', trg_sysid);
            gr.query(contr_res);
        }
        $('.clkme').on('click', function(e) {
            $('#contrtbl > tbody').find('tr.clkme2').remove();
            $('#contrtbl > tbody').find('tr.BOcontract').remove();
            trg_sysid = $(e.target).parent().attr('id').split('_')[1];
            trg_row = $(e.target).parent().attr('row');
            GM_log('#=#  line clicked ' ,  trg_sysid ); // ci sys_id
            var gr = new GlideRecord('contract_rel_ci');
            gr.addQuery('ci_item', trg_sysid);
            gr.query(contr_res);
        });
        $('.cmp').hover( function(e) {
            var t = $(e.target).text();
            if ( t.length == 32 && str.indexOf( t.slice(0,1) ) > -1) {
                var gr = new GlideRecord('core_company');
                gr.get(t);
                GM_log('# Company lookup', $(e.target).text(),  gr.name);
                if ($(e.target).text() === cur_comp) $('td.cmp:contains("' + t + '")').text(gr.name).css('color','green'); else $('td.cmp:contains("' + t + '")').text(gr.name);
            }
        });
        $('.loc').hover( function(e) {
            var t = $(e.target).text();
            if ( t.length == 32 && str.indexOf( t.slice(0,1) ) > -1) {
                var gr = new GlideRecord('cmn_location');
                gr.get(t);
                GM_log('# Location lookup', $(e.target).text(),  gr.name);
                $('td.loc:contains("' + t + '")').text(gr.name);
            }
        });
        $('#addCI').on('click', function() {
            GM_log('# CIobj  ', trg_row, CIobj[trg_row] );
            if ( CIobj[trg_row].serial !== '' ) info[2] = CIobj[trg_row].serial; else info[2] = CIobj[trg_row].lic;
            if ( gr.u_os_version !== '' && gr.u_os_version !== 'unknown' && info[1] === '' ) info[1] = CIobj[trg_row].os +' '+ CIobj[trg_row].osv;
            if ( info[2] !== '' ) GlideTestSerial();
            GlideGetPartVendor(CIobj[trg_row].model);
        });
    }

    function contr_res(gr) {
        GM_log('# Contract for CI results  ', gr);
        if (gr.rows.length > 0 ) $('#contrtbl').css('display','table');
        $('#res').text( $('#res').text().split('CI(\'s)')[0] + 'CI(\'s), and ' + gr.rows.length + ' contract(s).');
        var rowcounter = 0;
        var trtitle = '';
        var classes = 'clkme2';
        while ( gr.next() )  {
            if ( gr.u_contract_item_code.indexOf('-BO') > -1 ) {
                resln = '<td style="color:#11A;">' + gr.u_contract_item_code + '</td><td>';
                trtitle = 'Back out Contract with vendor.\nCannot be selected for case.';
                classes = 'BOcontract';
            } else {
                resln =  '<td>' + gr.u_contract_item_code + '</td><td>';
                trtitle = '';
                classes = 'clkme2';
            }
            if ( gr.u_status.indexOf('servicing') <0 &&  gr.u_status.indexOf('Active') <0 ) classes += ' ina';
            resln += gr.u_sales_organization + '</td><td class="cont" sysid=' + gr.contract + '>';
            resln += gr.u_service + '</td><td>';
            resln += gr.u_status + '</td><td>';
            resln += gr.u_start_date + '</td><td>';
            resln += gr.u_end_date;
            $('#contrtbl > tbody:last-child').append('<tr title="' + trtitle + '" row="' + rowcounter + '" id="co-sysid_'+ gr.sys_id + '_' + trg_sysid + '" class="' + classes + '">'+resln+'</td></tr>');
            COobj.push({ sys_id:gr.sys_id, ci_item:gr.ci_item });
            GM_log('# COobj  ', COobj[rowcounter]);
            rowcounter++;
        }
        $('.clkme2').on('click', function(e) {
            trg_sysid = $(e.target).parent().attr('id').split('_')[1];
            cnt_row = $(e.target).parent().attr('row');
            GM_log('#=#  contr line clicked ' ,  trg_sysid , CIobj[trg_row].sys_name, cnt_row, script  ); // ci sys_id

            if (cur_comp === '' || cur_comp === CIobj[trg_row].company ) {
                unsafeWindow.g_form.setValue( script + '.cmdb_ci',       COobj[cnt_row].ci_item , CIobj[trg_row].sys_name ); //            CIobj[trg_row].ci_item ,
                unsafeWindow.g_form.setValue( script + '.u_contract_ci', COobj[cnt_row].sys_id  , CIobj[trg_row].sys_name ); //            CIobj[trg_row].sys_id  ,
                $('#ci-lst > a').show();
                $('#mysearch').hide(500);
                $('div.form_action_button_container > button:nth-child(3)').show();
                $('div.form_action_button_container > button:nth-child(4)').show();
            } else alert('CI is from different company, can\'t do what you want.\nIf you need to use this CI, you must re-log the case under another company.');
        });
        $('.cont').hover( function(e) {
            var t = $(e.target).attr('sysid');
            if ( t.length == 32 && str.indexOf( t.slice(0,1) ) > -1) {
                var gr = new GlideRecord('contract');
                gr.get(t);
                $(e.target).attr('sysid','');
                GM_log('# Contract lookup', $(e.target).text(),  gr.name);
                $(e.target).text(gr.name);
            }
        });

    }
}




function GlideTestSerial() {
    var onlyonce = 0;
    if (info[2]) {
        GM_log('# GlideTestSerial ', info[4],  info[2] );
        var gr0 = new GlideRecord('cmdb_ci');
        gr0.addQuery('serial_number', info[2] );
        gr0.query(showgr);
    }

    function showgr(gr){
        GM_log('# GlideTestSerial results: ' , gr);
        if ( gr.rows.length === 0 ) {    // no matching record
            if (info[4] === 'Infoblox' && info[2].length < 18 ) {
                info[2] = '0' + info[2];
                gr0.addQuery('serial_number', info[2] );
                gr0.query(showgr);
            } else {
                if ( onlyonce === 0) {
                    onlyonce = 1;
                    var gr0 = new GlideRecord('cmdb_ci_spkg');
                    gr0.addQuery('u_license_key', info[2] );
                    gr0.query(showgr);
                } else return;
            }
        } else {
            if ( gr.rows.length > 1 ) {
                GM_log('#  Multiple records with the same serial number !!!!????', gr.rows.length );
                $('#l2 > td:nth-child(7)' ).attr('title', gr.rows.length + ' records found for query, that should be just one,......I will use the first' ).addClass('warnbg');
            }
            while ( gr.next() ) {
                CI_class        = gr.sys_class_name;
                CI_status       = gr.u_status;
                CI_model        = gr.model_id;
                CI_rim          = gr.u_rim_deployment_status;
                CI_self         = gr.u_hide_in_self_service_view;
                CI_depl         = gr.u_deployment_date;
                CI_ipaddr       = gr.ip_address;
                CI_manufacturer = gr.manufacturer;
                GM_log('# GlideTestSerial   Class:' + CI_class +'  Status:'+ CI_status +'  Name:'+ gr.u_system_name + ' ' + gr.short_description + '  Category:'+ gr.category + ' (' + gr.subcategory + ')'  + gr.u_operating_system +' '+ gr.u_os_version  ) ;
                var cat = ' ';
                if (gr.category) cat = ' ' + gr.category + ' ';
                if (gr.subcategory) cat = cat + '(' + gr.subcategory +') ';
                //                if (cat === '') cat = ' ';
                CIlnk = '<a title="Show this ' + CapitalFirst(CI_class.replace('cmdb_ci_','').replace(/_/g,' ')) +' details" href="/' + CI_class + '.do?sys_id=' + gr.sys_id + '" target="_blank">' + info[2] + '</a>';
                $('#view\\.' + script + '\\.u_technology').parent().append('<span> '+ CapitalFirst(CI_class.replace('cmdb_ci_','').replace(/_/g,' ')) +' </span>');
                $('#l2 > td:nth-child(7)' ).html(CIlnk);
                $('#ciSer').text(info[2]);
                if ( gr.u_os_version !== '' && gr.u_os_version.indexOf('unknown') < 0 && gr.u_os_version.indexOf('N/A') < 0 && info[1] === '' )
                    if (gr.u_operating_system.replace('Cisco ','') !== '' ) info[1] = gr.u_operating_system.replace('Cisco ','') +' '+ gr.u_os_version;
                    else info[1] = gr.u_os_version;
                if ( info[1] === '' && gr.u_version !== '' && gr.u_version.indexOf('unknown') < 0 ) info[1] = gr.u_version;
                main_ci = gr.sys_id;
                GlideGetCiContracts();
            }
        }
    }
}

function GlideGetCiContracts() {
    var gr0 = new GlideRecord('contract_rel_ci');
    if ( main_ci === '' ) main_ci = unsafeWindow.globalContext.ci;
    gr0.addQuery('ci_item',main_ci );
    console.log ('#=#= GlideGetCiContracts: contract_rel_ci  ci_item ' , main_ci );
    gr0.query(showgr);

    function showgr(gr){
        var entries = 0, contracts = 0, activecontracts = 0, BOcontracts = 0, activeBOcontracts = 0, contract_refs = '';
        while ( gr.next() ) {
            console.log ('#=#= status: ' + gr.u_status, gr.u_int_ref_no, gr.u_ext_ref_no  );
            if ( gr.u_int_ref_no.indexOf('BO') > -1 ) {
                if ( gr.u_status.indexOf('Active ') > -1 ) {
                    activeBOcontracts++;
                    if ( gr.u_ext_ref_no !== '' && contract_refs === '' ) contract_refs =  gr.u_ext_ref_no;              else if ( contract_refs.indexOf(gr.u_ext_ref_no) < 0 ) contract_refs = contract_refs + ', ' + gr.u_ext_ref_no;
                    activeBOcontractID = gr.contract;
                } else {
                    if ( gr.u_ext_ref_no !== '' && contract_refs === '' ) contract_refs = 'exp('+ gr.u_ext_ref_no + ')'; else if (contract_refs.indexOf(gr.u_ext_ref_no) < 0 ) contract_refs = contract_refs + ', exp(' + gr.u_ext_ref_no + ')';
                }
                BOcontracts++;
            } else {
                if ( gr.u_status.indexOf('Active ') > -1 ) {
                    activecontracts++;
                }
                contracts++;
            }
            entries++;
        }
        var cntr_tit = '\n Customer contracts: \n __________________________\n Total:\t'+ contracts +'\n Active:\t'+ activecontracts +'\n\n Vendor backout contracts: \n __________________________\n Total:\t'+ BOcontracts +'\n Active:\t'+ activeBOcontracts;
        if (contract_refs !== '') cntr_tit = cntr_tit +'\n __________________________\n\n External references:\n __________________________\n ' + contract_refs.replace(/,/g,'\n');
        $('#contrfld').text( contracts +'/'+ activecontracts +' active\t\t'+ BOcontracts +'/'+ activeBOcontracts +' BO active').attr('title', cntr_tit );
        GM_log('# GlideGetCiContracts contracts ', entries, contracts , activecontracts, BOcontracts , activeBOcontracts +' ref[' + contract_refs +'] tit['+  cntr_tit +']' );
        if ( $('#ct-lst').length > 0 && entries > 0 && $('#ct-lst').html().indexOf('Show contracts (') < 0 ) {
            $('#ct-lst').append('<a title="Show contracts ('+ entries +') for this CI" href="/contract_rel_ci_list.do?sysparm_query=ci_item=' + unsafeWindow.globalContext.ci + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a>').show();
        }
        if ( activeBOcontracts > 1 ) supportingcontracts = 'External references:\n __________________________\n ' + contract_refs.replace(/, /g,'\n');
        if ( contract_refs.indexOf(', ') > 0 ) {
            var p = contract_refs.split(', ');
            for (var x=p.length-1; x > -1; x--) { if (p[x].indexOf('exp(') > -1) p.splice(x,1); }
            contract_refs = p.join(', ');
            if ( contract_refs.length < 5 ) contract_refs = '';
        }
        if ( activeBOcontracts === 1 ) {
            var gr = new GlideRecord('contract');
            gr.addQuery('sys_id',activeBOcontractID);
            gr.query(contgr);
        } else {
            $('#contrfld').text( contracts +'/'+ activecontracts +' active   '+ BOcontracts +'/'+ activeBOcontracts +' BO active     ' );
        }
        UpdateTableFields();
    }

    function contgr(gr){
        while ( gr.next() ) {
            GM_log('# contgr contract found ', gr, activeBOcontractID, gr.u_service_contract_number );
            if (gr.u_service_contract_number && gr.u_service_contract_number !== '') info[3] = gr.u_service_contract_number.replace(/;/g,',');
            else info[3] = 'Back-Out Contract';
            $('#contrfld').text(info[3]);
            $('#l1 > td:nth-child(9)').text('Vendor contract:');
            UpdateTableFields();
        }
    }

}

function UpdateTableFields(){
    if ( timeworked === '' ) { timeworked = '0'; }
    $('#tmwkdfld' ).text( timeworked );
    if ( timeworked === '0' ){ $('#tmwkdfld').css('color','red').addClass('warnbg'); } else { $('#tmwkdfld' ).css('color','unset').removeClass('warnbg'); }
    if ( timeworkedb.length > 0 ) $('#tmwkdfld').addClass('warnbg').css('color','red').attr('title','Billable time: ' + timeworkedb);

    $('#breachfld').text( breach + '/' + undoc + ' undoc.\t\t' + nrsla+ '/' + nrslarun + ' run.' ).attr('title',' Breached SLA/OLA\'s:\n ___________________________\n Breached:\t'+ breach +'\n Undocumented:\t' + undoc + '\n\n SLA/OLA\'s on this ' + casenr.slice(0,3) +'\n ___________________________\n Total:\t\t' + nrsla + '\n Running:\t' + nrslarun );
    if ( undoc > 0 ){ $('#breachfld').css('color','red').addClass('warnbg'); }

    if (etadt) $('#ETAfld').text( etadt.replace(/\//g,'-') );
    if (curaction != 7 ) {
        var n = new Date();
        if ( ((Date.parse(etadt)/3600000) + 8 ) < (n.getTime()/3600000) ) $('#ETAfld').addClass('warnbg').css('color','brown');
        if ( ((Date.parse(etadt)/3600000) + 12) < (n.getTime()/3600000) ) $('#ETAfld').addClass('warnbg').css('color','orange');
        if ( ((Date.parse(etadt)/3600000) + 16) < (n.getTime()/3600000) ) $('#ETAfld').addClass('warnbg').css('color','red');
    }

    $('#l1 > td:nth-child(3)' ).text(prbstat);       // Status
    $('#l1 > td:nth-child(7)' ).text(info[4]);       // Vendor
    if (info[3] !=='') {
        $('#l1 > td:nth-child(9)').text('Vendor contract:');           // Contract
        if ( activeBOcontractID === '' ) {
            $('#l1 > td:nth-child(11)').text(info[3]);                 // Contract
        } else {
            $('#l1 > td:nth-child(11)').html('<a href="/contract.do?sys_id='+activeBOcontractID+'" target="_blank">'+ info[3] +'</a>');                 // Contract
        }
    }
    if (CIlnk === '') { $('#l2 > td:nth-child(7)' ).text(info[2]);       // Serial
                      } else {
                          $('#l2 > td:nth-child(7)' ).html(CIlnk);
                          if ( main_ci !== ''  && $('#l2 > td:nth-child(8)').html() === '&nbsp;' && CI_rim === 'deployed' && CI_ipaddr.indexOf('1.0.0') < 0 ) {   //  #context_1 > div:nth-child(14)
                              $('#l2 > td:nth-child(8)').html('<div id="comchk_l" style="z-index:999;background-color:grey;border-radius:6px;width:12px;height:12px;border:1px solid #000;" title="Right-click to run communications check on IP:[' + CI_ipaddr + ']."></div>');
                              $('#comchk_l').on('contextmenu', function(e) {
                                  var clickedElement = $(this).position();
                                  if (e.pageX || e.pageY) {
                                      x = e.pageX;
                                      y = e.pageY;
                                  } else {
                                      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                                      y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
                                  }
                                  $('#showpic').css({ top: (y ) + 'px', left:(x ) + 'px' , display:"block", zIndex:"1000" });
                                  $('#showpic').show().attr('tabindex','0').addClass('mypopup').html(`
<a id="clsshowpic" style="float:right;"><span id="Closeswow" class="sprite1 close-button"></span></a>
<p>Choose an option below:  &nbsp;  <p>
<ul><li id=redochk1 ><a>Rerun Communication Check</a></li>
<li id=redochk2 ><a>Rerun Communication Check result to Comments</a></li>
<li id=redochk3 ><a>Rerun Communication Check result to Work Notes</a></li>
</ul><p>&nbsp;</p>
`);
                                  setTimeout(function() {
                                      $('#showpic').focus();
                                  },6000 );
                                  $('#showpic').blur( function() {
                                      GM_log('# popup focus lost, time 4 sec');
                                      phnpop_timer = setTimeout(function() {
                                          $('#showpic').fadeOut(3000);
                                      },20000 );
                                  });
                                  $('#clsshowpic').on('click', function(){ $('#showpic').hide(); });
                                  $('#redochk1').on('click', function(){ comchk_from=0; chkcom(); });
                                  $('#redochk2').on('click', function(){ comchk_from=1; chkcom(); });
                                  $('#redochk3').on('click', function(){ comchk_from=2; chkcom(); });
                                  return false;
                              });
                              var comchkstate = GM_getValue('comchkstate','on');
                              if ( comchkstate === 'on' ) chkcom();
                          }
                      }
    $('#l2 > td:nth-child(3)' ).text(info[0]);       // Product
    if (CI_class !== '') $('#l2 > td:nth-child(1)' ).text( CapitalFirst(CI_class.replace('cmdb_ci_','').replace(/_/g,' ')) + ':' );
    $('#l2 > td:nth-child(11)').text(info[1]);       // Version

    GM_log('# TableFields Updated!', prbstat, etadt, timeworked, timeworkedb, breach, undoc );
    GM_log('# TableFields Updated!', info );
    $('input#' + script + '\\.u_custom_text_3').val(info.join(';'));
    if (info[4] && info[4] !== '') {
        $('#vdrlist > a.tplink').each( function() { if ( $(this).text().toLowerCase().startsWith( info[4].toLowerCase() ) ) { $(this).addClass('mybuthi'); } else { $(this).removeClass('mybuthi'); } });
        if ( $('#showScis').length > 0 && $('#showScis').parent().attr('href').indexOf('model_id.manufacturer') === -1 ) {  // add limit to manufacturer to CI view
            var nwtitle = $('#showScis').parent().attr('title');
            if ( nwtitle.indexOf(info[4]) < 0 ) nwtitle = nwtitle.replace('Show ', 'Show ' + info[4] + ' ');
            var nwtitle1 = $('#showcis').parent().attr('title');
            if ( nwtitle1.indexOf(info[4]) < 0 ) nwtitle1 = nwtitle1.replace('Show ', 'Show ' + info[4] + ' ');
            $('#showScis').parent().attr('href',$('#showScis').parent().attr('href') +'^model_id.manufacturer.nameLIKE'+ info[4] ).attr('title',nwtitle);
            $('#showcis' ).parent().attr('href',$('#showcis' ).parent().attr('href') +'^model_id.manufacturer.nameLIKE'+ info[4] ).attr('title',nwtitle1);
        }
    }

}

function GlideGetPartVendor(sys_id) {
    if (!sys_id || sys_id === '') sys_id = $('#' + script+ '\\.u_product').val();
    var gr1 = new GlideRecord('cmdb_model');
    gr1.addQuery('sys_id',sys_id);
    gr1.query(showgr);

    function showgr(gr){
        GM_log('# GlideGetPartVendor rows: ', gr.rows.length, gr );
        if ( gr.next() ) {
            if (gr.display_name.indexOf('VIRTUAL_CI') < 0) {
                var vendorAndPartnr = gr.display_name.split(' ');
                GM_log('# GlideGetPartVendor vendorAndPartnr ', vendorAndPartnr.slice(-1).toString()  , vendorAndPartnr.slice(0,vendorAndPartnr.length -1).toString().replace(/,/g,' ') );
                if ( info[0] === '' ) { info[0] = vendorAndPartnr.slice(-1).toString(); }
                if ( info[0].indexOf('VIRTUAL') > -1 ) {
                    info[0] = '';
                } else {
                    if ( info[4] === '' || info[4] === 'undefined') info[4] = vendorAndPartnr.slice(0,vendorAndPartnr.length -1).toString().replace(/,/g,' ');
                }
                info[4] = info[4].replace(' Networks Inc.','');
                info[4] = info[4].replace(' Systems','');
                info[4] = info[4].replace(' Global','');
                info[4] = info[4].replace('Check Point Software Technologies I','Checkpoint');
                vendor_name = info[4];
                $('#l2 > td:nth-child(3)' ).text(info[0]);       // Product  TE-1415-NS1GD-AC ;8.2.4-366880 ;001405201801700148 ;undefined; Infoblox
                $('#l1 > td:nth-child(7)' ).text(info[4]);       // Vendor
                GM_log('# GlideGetPartVendor info ', info  );
                UpdateTableFields();
            }
            if (gr.display_name.indexOf('VIRTUAL_CI') > -1) CI_is_virt = true;
        }
    }
}

function CheckXMLResponsepop(response){
    var p = HTMLdecode(response.responseText);
    GM_log('# CheckXMLResponse ' , p , response);
    showpopup(p ,5);
}


function chkcom() {
    GM_log('# chkcom ' );
    $('#comchk_l').css('background-color','grey');
    $('#showpic').hide();
    var tga = new GlideAjax('DDRIMAjax');
    tga.addParam('sysparm_name', 'runCommunicationsCheck');
    tga.addParam('sysparm_ci_sysid', main_ci);
    tga.getXML(CheckXMLResponse);
}


function CheckXMLResponse(response){
    var p = HTMLdecode(response.responseText);
    GM_log('# CheckXMLResponse ' , p );
    //    showpopup(p ,5);
    var lines = 0;
    var resp  = 0;
    var tit = 'Communication Check on IP:[' + CI_ipaddr + '] Result:\n';
    var ln   = '';
    var t = p.split('<tr>');
    for ( var x=0; x < t.length; x++ ) {
        ln = t[x].replace(/<[^>]+>/g, ' ');
        GM_log('# CheckXMLResponse ' , ln );
        if ( ln.indexOf('response') > -1  || ln.indexOf('Failed to perform action') > -1 ) {
            lines++;
            tit = tit + ln.trim() + '\n';
            if ( ln.indexOf('is responding') > -1 ) resp++;
        }
    }
    p = p.replace("style='width: 100%'","style='width: 100%;table-layout: auto !important;'");
    tit = tit + '\n\nRight-click to run the check again.';
    if (lines === resp ) $('#comchk_l').css('background-color','#0f0').attr('title',tit);
    else                 $('#comchk_l').css('background-color','#f00').attr('title',tit);
    // callback from  comchk_from
    if (comchk_from == 1) postCommentWorknote(   '[code]<br><b>Run Communications Check</b><p>' + p + '[/code]','' );
    if (comchk_from == 2) postCommentWorknote('','[code]<br><b>Run Communications Check</b><p>' + p + '[/code]' );
}


function HTMLdecode(encodedStr) {
    var parser = new DOMParser;
    encodedStr = encodedStr.replace('<?xml version="1.0" encoding="UTF-8"?><xml answer="{','').replace('sysparm_max="25" sysparm_name="runCommunicationsCheck" sysparm_processor="DDRIMAjax"/>','');
    var dom = parser.parseFromString('<!doctype html><body>' + encodedStr, 'text/html');
    var decodedStr = dom.body.textContent;
    decodedStr = decodedStr.replace('"answer":"','').replace('","error":false}"','');
    return decodedStr;
}


function postCommentWorknote(comment,worknote) {
    GM_log('# postCommentWorknote  ');
    var holdCT = unsafeWindow.g_form.getValue(script + '.comments');
    var holdWN = unsafeWindow.g_form.getValue(script + '.work_notes');
    unsafeWindow.g_form.setValue(script + '.comments',   comment);
    unsafeWindow.g_form.setValue(script + '.work_notes', worknote);
    fakepostbuttonclick(comment,worknote);
    unsafeWindow.g_form.setValue(script + '.comments',   holdCT);
    unsafeWindow.g_form.setValue(script + '.work_notes', holdWN);
}


function fakepostbuttonclick(Ccntnts,Wcntnts ) {
    var  dt = new Date();
    var  rnow = wkd[dt.getDay()] + ' ' + dd(dt.getDate()) + '-' +  mnt[dt.getMonth()] + '-' +  dt.getFullYear();
    GM_log('# fakepostbuttonclick  ');
    var tbl = globalContext["task.table_name"];   //    u_request or incident
    var gr = new GlideRecord(tbl);                //    gr.addQuery('sys_id',unsafeWindow.window.NOW.sysId);
    gr.get(unsafeWindow.window.NOW.sysId);
    rtime = ('0'  + dt.getHours()).slice(-2)+':'+('0' + dt.getMinutes()).slice(-2);
    gr.comments = Ccntnts;
    gr.work_notes = Wcntnts;
    gr.update(updatedone0);
    Ccntnts = Ccntnts.replace('[code]','').replace('[/code]','');
    Wcntnts = Wcntnts.replace('[code]','').replace('[/code]','');
    GM_log('# Fake Post button add post to page [' + Ccntnts + '] [' + Wcntnts +'] ' , Ccntnts.length, Wcntnts.length);
    var rtime = ('0'  + dt.getHours()).slice(-2)+':'+('0' + dt.getMinutes()).slice(-2);
    var P1 = '';
    var P2 = '';
    GM_addStyle(' .newins { border-color: #444;border-style:solid;border-width:0px;opacity:0;border-radius:7px;margin:10px; }');
    if (Ccntnts.length > 0 ) {
        P1 = '<div class="newins alertbg"><div><span colspan="2"><hr></span></div><div><span class="tdwrap"><strong>' + rnow + ' ' + rtime + ' - <a style="color:blue" href="sys_user.do?sysparm_view=itil&amp;sysparm_query=user_name=' + unsafeWindow.NOW.user_email + '">' + unsafeWindow.NOW.user_display_name + '</a></strong></span><span style="float:right;"><sup>Additional comments</sup></span></div>';
        if ( Ccntnts.indexOf('[code]') === -1 ) Ccntnts = Ccntnts.replace(/\n/g,'<br>');
        P2 = '<div><span colspan="2"><span style="word-wrap:break-word;display:block;">' + Ccntnts + '</span></span></div></div>';
        $('#element\\.' + script + '\\.comments\\.additional > span > div').prepend(P1 + P2);
        $('#element\\.' + script + '\\.comments\\.additional > span > div > div.newins').animate({ opacity: '1',  borderWidth: '10px', margin: '0px' }, 4000);
        $('#element\\.' + script + '\\.comments\\.additional > span > div > div.newins').animate({ borderWidth: '0px', margin: '10px'}, 2000);
        $('#element\\.' + script + '\\.comments\\.additional > span > div > div.newins').animate({ margin: '0px'}, 2000);
        setTimeout( function()  {
            $('#element\\.' + script + '\\.comments\\.additional > span > div > div.newins').removeClass('alertbg').removeClass('newins');
        },4000);
    }
    if (Wcntnts.length > 0 ) {
        P1 = '<div class="newins alertbg"><div><span colspan="2"><hr></span></div><div><span class="tdwrap"><strong>' + rnow + ' ' + rtime + ' - <a style="color:blue" href="sys_user.do?sysparm_view=itil&amp;sysparm_query=user_name=' + unsafeWindow.NOW.user_email + '">' + unsafeWindow.NOW.user_display_name + '</a></strong></span><span style="float:right;"><sup>Work notes not visible to the customer</sup></span></div>';
        if ( Wcntnts.indexOf('[code]') === -1 ) Wcntnts = Wcntnts.replace(/\n/g,'<br>');
        P2 = '<div><span colspan="2"><span style="word-wrap:break-word;display:block;">' + Wcntnts + '</span></span></div></div>';
        $('#element\\.' + script + '\\.work_notes\\.additional > span > div').prepend(P1 + P2);
        $('#element\\.' + script + '\\.work_notes\\.additional > span > div > div.newins').animate({ opacity: '1',  borderWidth: '10px', margin: '0px' }, 4000);
        $('#element\\.' + script + '\\.work_notes\\.additional > span > div > div.newins').animate({ borderWidth: '0px', margin: '10px'}, 2000);
        $('#element\\.' + script + '\\.work_notes\\.additional > span > div > div.newins').animate({ margin: '0px'}, 2000);
        setTimeout( function()  {
            $('#element\\.' + script + '\\.work_notes\\.additional > span > div > div.newins').removeClass('alertbg').removeClass('newins');
        },4000);
    }
    return false;
}

function showform(tb) {
    GM_addStyle(' .tbclk            { border:solid 2px #000;padding-left:4px;padding-right:4px;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom:1px;  } ');
    GM_addStyle(' .draghandle      		{ cursor:move; }');
    GM_addStyle(' .draghandle:hover		{ background-color:rgba(221,255,238, 0.4); }');
    GM_addStyle(' .sprite1				{ background-image:url("/images/sprites/i16.pngx"); background-repeat: no-repeat; }');
    GM_addStyle(' .close-button	        { width:16px;height:16px;display:block;background-position: -0px -208px; }');
    GM_addStyle(' .close-button:hover   { background-color:#f00; }');
    GM_addStyle(' .mypopup				{ background-color:#eee;border:solid 1px #888;border-radius:7px;color:#000;padding:7px 7px 0px 7px; z-index:100;box-shadow: 3px 3px 10px 6px rgba(192,240,240,0.75); }');
    GM_addStyle(' .mypopup	th			{ background-color:#DFE;color:#000; }');

    GM_log('#=#= showform Show tab ', tb  );
    GM_log('#=#= showform Show tab user_id ', unsafeWindow.window.NOW.user_id  );
    if ($("#settings").length > 0) {
        $("#settings").css('top','100px').css('left','100px').fadeIn(500);
        $('.set1').hide();
        $('.set2').hide();
        $('.set3').hide();
        $('.set' + tb).show();
        $('#hop > tbody > tr:nth-child(2) > td > span.tabs2_tab').removeClass('tabs2_active');
        $('#hop > tbody > tr:nth-child(2) > td > span:nth-child(' + tb + ')').addClass('tabs2_active');
    }
    else {
        var bannerstate = GM_getValue('ShowBanners');
        var SWOWdefmesg = GM_getValue('DefaultSWOW');
        var updatecheck = GM_getValue('updatecheck');
        var options = GM_getValue('ITSMsettingsOptions');
        if ( !options  ) { options=OPT_text.join('\n');} else { GM_log('#=#  options via GM getvalue'); }
        var actions = GM_getValue('ITSMsettingsActions');
        if ( !actions ) {
            for (i = 0; i < ACT_text.length -1; i++) { ACT_text[ i + 1 ] =  ACT_text[ i + 1 ].replace(/\n/g,'\\n'); }
            actions=ACT_text.join('\r\n');
        } else { GM_log('#=#  action via GM_getValue' , actions); }
        var nrs ='  ';
        for (i = 1; i < 41; i++) {
            nrs += i.toString();
            if (i < 40) { nrs += '\n '; }
            if (i < 9) { nrs += ' '; }
        }
        var options1 = GM_getValue('ITSMsettingsOptions1');
        if ( typeof options1 == "undefined" ) {
            options1=MailTemplName.join('\n'); } else { GM_log('#=#  options via GM getvalue');
                                                      }
        var actions1 = GM_getValue('ITSMsettingsActions2');
        if ( typeof actions1 == "undefined" ) {
            for (i = 0; i < MailTemplate.length; i++) { MailTemplate[i] =  MailTemplate[i].replace(/\n/g,'\\n'); }
            actions1=MailTemplate.join('\r\n');
        }
        var nrs2 =' ';
        for (i = 1; i <= MailTemplate.length; i++) {
            nrs2 += i.toString();
            if (i < 9) { nrs2 += '\n '; } else { nrs2 += '\n'; }
        }
        nrs2 = nrs2.substr(0, nrs2.length -1 );
        if ( shortassign === '' ) shortassign = unsafeWindow.NOW.user.firstName.substring(0,2) + unsafeWindow.NOW.user.lastName.substring(0,2); // .substring(0,2) + loggedin.split(' ')[1].substring(0,2);
        var mydata, filename, ftype;
        mydata   = 'data,data,data,data';
        filename = shortassign + '_export_' + rnow + '.csv';
        ftype    = 'csv';
        var epxstate = GM_getValue('hideexpstuff',1) === 1 ? 'checked' : '';
        //cacaedfc0a0a3c080179d8df6be90416
        var experimental = unsafeWindow.window.NOW.user_id.indexOf('cacaedfc0') > -1 ? '<tr class=set3 title="Hide experimental tabs"><td align=right > &nbsp; <input name=hideexpstuff id="ch4" class="ch tabchk" type=checkbox ' + epxstate + ' title="Show/Hide Experimental Tabs."/><label for="ch4"></label> &nbsp; </td><td colspan=2>  &nbsp;  Hide Experimental Tabs.</td></tr>' : '';
        var hidestuffstate = ( GM_getValue('hidestuff')   === 'off' ) ? ' ' : 'checked' ;
        var comchkstate    = ( GM_getValue('comchkstate') === 'off' ) ? ' ' : 'checked' ;
        var ITSInoHTML     = ( GM_getValue('ITSInoHTML')  === 'off' ) ? ' ' : 'checked' ;
        var setresolve     = ( GM_getValue('setresolve')  === 'on' ) ? 'checked' : ' ' ;
        usecountry         = ( GM_getValue('usecountry')  === 'off' ) ? ' ' : 'checked' ;

        $("body").append(`<div id="settings" class="mypopup" style="top:100px;left:100px;" >  \
<table id="hop" border=0 width="100%" style="background-color:transparent;"> \
<tr><td id="settingsdrag" colspan="3" class="draghandle"><a style="float:right;" id="clsSettings"><span class="sprite1 close-button"></span></a><a title="\n\
Values between {} are replaced in runtime when inserting the command  \n\
{sa} is short Assignee, e.g Kurt Siau becomes kusi \n\
{mf} becomes Kurt, {ml} becomes Siau, {mn} becomes Kurt Siau\n\
{dt} becomes the current date {tm} becomes time in 24h format\n\
{sp=} becomes a separator of ============ \n\
\\n gives a new line  \n\
{tm} gives the time\n\
{dt} gives the date time\n\
{case} gives the casenr\n\
{status} gives the casestatus, {eta} gives the case ETA date\n\
{swow} gives the swow update text, and {product}, {serial}, {version} \n\
and {contract} will give the value of the mentioned fields as shown \n\
in the case notes.\n\
See top of the script for more explanation.\n\n"><img src="images/help.gifx" style="float:left;"/></a></td></td></tr> \
<tr><td colspan=3 class=itsmplus valign=bottom style="height:25px;border-bottom-width: 0px !important;">&nbsp;<span class="tabs2_tab tabs2_active tbclk"> Action Settings </span>&nbsp;<span class="tabs2_tab tbclk"> Mail Template Settings </span>&nbsp;<span class="tabs2_tab tbclk"> Other Settings </span> &nbsp; </td></tr> \
<form><tr class=set1 style="height:25px;"><td>Line</td><td>Option</td><td>Action</td></tr> \
<tr class=set1 style="vertical-align:top;"><td><textarea disabled id="ta1" style="width:100%;height:380px;overflow:hidden" cols=4 rows="`+ ACT_text.length  +`">` + nrs +  `</textarea></td>\
<td><textarea id="ta2" style="width:100%;height:380px;overflow:hidden" cols=24  rows="`+ ACT_text.length +`">` + options  + `</textarea></td>\
<td><textarea id="ta3" style="width:100%;height:400px;" cols=160 rows="`+ ACT_text.length +`" wrap="off">` + actions  + `</textarea>&nbsp;</td></tr> \
<tr class=set2 style="height:25px;"><td>Line</td><td>Option</td><td>Action</td></tr> \
<tr class=set2 style="vertical-align:top;"><td><textarea disabled id="ta4" style="width:100%;height:100%;" cols=4 rows="`+ MailTemplate.length +`">`  + nrs2 + `</textarea></td>\
<td><textarea id="ta5" style="width:100%;height:100%;" cols=24  rows="`+ MailTemplate.length +`" >` + options1 + `</textarea></td>\
<td><textarea id="ta6" style="width:100%;height:100%;" cols=160 rows="`+ MailTemplate.length +`" wrap="off">` + actions1 + `</textarea></td></tr> \
<tr class=set3>\
<td> &nbsp; </td><td colspan=2>  &nbsp;<p> &nbsp;<p></td></tr>
<tr class=set3 title="Check the box to prevent HTML SWOW update. \nThis will put in a plain text update when the 'Integration' Tab is visbilble.">
<td align=right > &nbsp; <input name=hidestuff name="ch9" id="ch9" class="ch" type=checkbox ` + ITSInoHTML + `/><label for="ch9"></label> &nbsp; </td><td colspan=2>  &nbsp; Check the box to prevent HTML SWOW update for e-bonding.</td></tr>\
<tr class=set3 title="Check the box to automatically set the Resolved by field for your cases in ITSM to your name">
<td align=right > &nbsp; <input name=hidestuff name="ch8" id="ch8" class="ch" type=checkbox ` + setresolve + `/><label for="ch8"></label> &nbsp; </td><td colspan=2>  &nbsp; Check the box to auto set the Resolved by field.</td></tr>\
<tr class=set3 title="Check the box to hide useless fields in ITSM">
<td align=right > &nbsp; <input name=hidestuff name="ch5" id="ch5" class="ch" type=checkbox ` + hidestuffstate + `/><label for="ch5"></label> &nbsp; </td><td colspan=2>  &nbsp; Hide useless fields.</td></tr>\
<tr class=set3 title="Check the box to use country specific language in SWOW">
<td align=right > &nbsp; <input name=usecountry name="ch7" id="ch7" class="ch" type=checkbox ` + usecountry + `/><label for="ch7"></label> &nbsp; </td><td colspan=2>  &nbsp; Use country specific language in SWOW.</td></tr>\
<tr class=set3 title="Check the box to auto run the communication check on page load.">\
<td align=right > &nbsp; <input name=comchkauto name="ch6" id="ch6" class="ch" type=checkbox ` + comchkstate + `/><label for="ch6"></label> &nbsp; </td><td colspan=2>  &nbsp; Automatically run communications check on page load.</td></tr>\
` + experimental + `
<tr class=set3 title="Check the box to slowly hide the notification banners in ITSM.\nThe lookup Icon of the associated field will become orange!\nYou can still see the banners in a less intrusive way if you hover the orange Icon.">\
<td align=right> &nbsp; <input class="ch" type="checkbox" name="ch0" id="ch0"/><label for="ch0"></label> &nbsp; </td><td colspan=2> &nbsp; Hide the notification banners</td></tr>
<tr class=set3 title="If you check this, a SWOW line with a default message, will be added when you change the status.">\
<td align=right> &nbsp; <input class="ch" type="checkbox" name="ch1" id="ch1"/><label for="ch1"></label> &nbsp; </td><td colspan=2> &nbsp;  Add default SWOW message on status change.</td></tr>
<tr class=set3 title="Add current datetime to COMPLETED message">\
<td align=right> &nbsp; <input class="ch" type="checkbox" name="ch10" id="ch10"/><label for="ch10"></label> &nbsp; </td><td colspan=2> &nbsp;  Add current datetime to COMPLETED message.</td></tr>
<tr class=set3><td> &nbsp; </td><td colspan=2>  &nbsp; </td></tr>
<tr class=set3 title="Please read!\n\nIf you check this, a popup will appear asking you to allow XHR access to greasyfork.org domain\nPlease allow for this so that the script can indicate when a new version is available."><td align=right> &nbsp; <input class="ch" type="checkbox" name="ch2" id="ch2"/><label for="ch2"></label> &nbsp; </td><td colspan=2> &nbsp;  Allow ITSM+ to check and alert when a new version is available. </td></tr><tr> \
<tr class=set3><td> &nbsp; </td><td colspan=2>  &nbsp; </td></tr>
<tr class=set3 title="Here you can define what string is added to the SWOW line to identify you. "><td align=right> <input id="XS" value="` + GM_getValue('XtraSWOW','')  + `" size=10 /> &nbsp;                    </td><td colspan=2> &nbsp;  SWOW extra text, e.g. ' FrBr (DD) ' &nbsp;  </td></tr><tr> \
<tr class=set3 title="Choose here the separator between the SWOW entry number and the rest of the line."><td align=right> <input id="SS" value="` + GM_getValue('SWOW_sep','.') + `" size=1 style="width:15px;" /> &nbsp; </td><td colspan=2> &nbsp;  SWOW separator '.' or ')' &nbsp;  </td></tr><tr> \
<tr class=set3><td> &nbsp; </td><td colspan=2>  &nbsp; </td></tr>
<tr class=set3 title="Select here the default activity type that will be used in your workload. "><td><select id="defwkld"><option>Remote Support</option><option>Administration</option></select></td><td colspan=2> &nbsp;  Default workload type &nbsp; </td></tr><tr> \
<tr class=set3><td> &nbsp; </td><td colspan=2>  &nbsp; <tr>
<tr class=set3><td align=right> Extra Tabs &nbsp; </td><td colspan=2>
&nbsp;<input name=Scram  class="tabchk" type=checkbox ` + my_tab('Scram')          + ` title="Show/Hide this tab"/> <a href="` + $("span#scram  > a:nth-child(1)").attr("href") + `" target=_blank class="mybut">SCRAM</a>
&nbsp;<input name=PWS class="tabchk" type=checkbox `    + my_tab('PWS')         + ` title="Show/Hide this tab"/> <a href="` + $("span#PWS > a:nth-child(1)").attr("href") + `" target=_blank class="mybut">PWS</a>
&nbsp;<input name=Webex  class="tabchk" type=checkbox ` + my_tab('Webex')          + ` title="Show/Hide this tab"/> <a href="` + $("span#webex  > a:nth-child(1)").attr("href") + `" target=_blank class="mybut">WEBEX</a>
&nbsp;<input name=MOVEit class="tabchk" type=checkbox ` + my_tab('MOVEit')         + ` title="Show/Hide this tab"/> <a href="` + $("span#moveit > a:nth-child(1)").attr("href") + `" target=_blank class="mybut">MOVEIT</a>	<p>
</td></tr>
<tr class=set3><td align=right> ITSM Tabs &nbsp; </td><td colspan=2>
&nbsp;<input name=escal  class="ch tabchk" type=checkbox ` + my_tab('Escalation')     + ` id="chEs" title="Show/Hide this tab"/><label for="chEs"></label> Escalation
&nbsp;<input name=stake  class="ch tabchk" type=checkbox ` + my_tab('Stakeholders')   + ` id="chSt" title="Show/Hide this tab"/><label for="chSt"></label> Stakeholders
&nbsp;<input name=custom class="ch tabchk" type=checkbox ` + my_tab('Custom section') + ` id="chCu" title="Show/Hide this tab"/><label for="chCu"></label> Custom section
&nbsp;<input name=newtab class="ch tabchk" type=checkbox ` + my_tab('NEWtab')         + ` id="chNe" title="Show/Hide this tab"/><label for="chNe"></label> New tab
</td></tr>
<tr class=set3><td> &nbsp; </td><td colspan=2>  &nbsp; </td></tr>
<tr class=set3><td colspan=3>
<a id="resRes" title="Restores your mail and action templates from a file." >Restore</a>
<a id="resSav" title="Saves your mail and action templates to a file.">Backup</a>
</td></tr>
<tr style="height:25px;"><td colspan=3>
<a id="saveset">Save</a> &nbsp; &nbsp;
<input type="file" id="rstr"  onchange="openbfile(event)" style="display:none;font-size:9px;"/><img id='output'>
<script>
var openbfile = function(event) {
GM_log('# open BCKP file');
var input = event.target;
var reader = new FileReader();
reader.onload = function(){
var text = reader.result;
GM_log('# file : ', text );
showfiletxt(text);
};
reader.readAsText(input.files[0]);
};
</script>
<a id="resSetting1" title="Reset Actions to default values\nSave SVR before using">Reset Actions</a> &nbsp; &nbsp;
<a id="resSetting2" title="Reset Mail templates to default values\nSave SVR before using">Reset Mail Templates</a>
</td></tr>
</table></form>
</div>`);

        $("#saveset").click(saveform).addClass('mybut');  //  style="display:none;" <a id="resRes" title="Restore from file." >RSTR</a> \

        if (bannerstate) $('#ch0').attr('checked','checked');
        if (SWOWdefmesg) $('#ch1').attr('checked','checked');
        if (updatecheck) $('#ch2').attr('checked','checked');
        $("#ta1").addClass('boxsizingBorder');
        $("#ta2").addClass('boxsizingBorder');
        $("#ta3").addClass('boxsizingBorder');
        $("#ta4").addClass('boxsizingBorder');
        $("#ta5").addClass('boxsizingBorder');
        $("#ta6").addClass('boxsizingBorder');
        $("#settings").css('position','absolute').css('visibility','visible');
        $("#clsSettings").click(closeform);
        $("#resSetting1").click(resetform1).addClass('mybut');
        $("#resSetting2").click(resetform2).addClass('mybut');
        $("#resSav").addClass('mybut').css('float','right').hide();
        $("#resRes").addClass('mybut').css('float','right').css('margin-left','7px').css('margin-right','7px').hide();
        $("#resRes").on('click', function() {
            GM_log('#=#= restorefile clicked ' );
            $('#rstr')[0].click();
            GM_log('#=#= restorefile clicked done' );
        });
        var defwkld = GM_getValue('DefaultWorkload','Remote Support');
        $("#defwkld").val(defwkld).change();
        GM_log('#=#= DefaultWorkload set to ', defwkld  );
        $("#defwkld").on('change', function() {
            GM_setValue('DefaultWorkload',$("#defwkld").val() );
            GM_log('#=#= DefaultWorkload changed to ', $("#defwkld").val()  );
        });
        $("#ch0").on('change', function() {
            if ( $('input#ch0').is(':checked') ) {
                GM_setValue('ShowBanners', 'hide');
                $('.notification-info').hide(2000);
            } else {
                GM_deleteValue('ShowBanners');
                $('.notification-info').show(2000);
            }
            GM_log('#=#= ShowBanner changed to ', $('#ch0').is(':checked')  );
        });
        $("#ch1").on('change', function() {
            if ( $('input#ch1').is(':checked') ) { GM_setValue('DefaultSWOW', 'add');  } else { GM_deleteValue('DefaultSWOW'); }
            GM_log('#=#= DefaultSWOW changed to ', $('#ch1').is(':checked')  );
        });
        $("#ch2").on('change', function() {
            if ( $('input#ch2').is(':checked') ) {
                GM_setValue('updatecheck', 'check');
                ITSMupdates = checkForUpdate();
            } else { GM_deleteValue('updatecheck'); }
            GM_log('#=#= updatecheck changed to ', $('#ch2').is(':checked')  );
        });
        $("#ch4").on('change', function() {
            if ( $('input#ch4').is(':checked') ) {
                GM_setValue('hideexpstuff', 1);
                hide_exstuff(1);
            } else {
                GM_setValue('hideexpstuff', 0);
                hide_exstuff(0);
            }
            GM_log('#=#= Hide useless fields changed to ', $('#ch5').is(':checked')  );
        });
        $("#ch5").on('change', function() {
            if ( $('input#ch5').is(':checked') ) {
                GM_setValue('hidestuff', 'on');
                hide_stuff(1);
            } else {
                GM_setValue('hidestuff', 'off');
                hide_stuff(0);
            }
            GM_log('#=#= Hide useless fields changed to ', $('#ch5').is(':checked')  );
        });
        $("#ch6").on('change', function() {
            if ( $('input#ch6').is(':checked') ) GM_setValue('comchkstate', 'on');
            else GM_setValue('comchkstate', 'off');
            GM_log('#=#= Auto comchk changed to ', $('#ch6').is(':checked')  );
        });
        $("#ch7").on('change', function() {
            if ( $('input#ch7').is(':checked') ) {
                GM_setValue('usecountry', 'on');
                usecountry = 'checked';
            } else {
                GM_setValue('usecountry', 'off');
                usecountry = ' ';
            }
            GM_log('#=#= usecountry changed to ', $('#ch7').is(':checked')  );
        });
        $("#ch8").on('change', function() {
            if ( $('input#ch8').is(':checked') ) GM_setValue('setresolve', 'on');
            else GM_setValue('setresolve', 'off');
            GM_log('#=#= Auto setresolve changed to ', $('#ch8').is(':checked')  );
        });
        $("#ch9").on('change', function() {
            if ( $('input#ch9').is(':checked') ) GM_setValue('ITSInoHTML', 'on');
            else GM_setValue('ITSInoHTML', 'off');
            GM_log('#=#= Auto ITSInoHTML changed to ', $('#ch9').is(':checked')  );
        });
        $("#ch10").on('change', function() {
            if ( $('input#ch10').is(':checked') ) GM_setValue('DTonCOMP', 'on');
            else GM_setValue('DTonCOMP', 'off');
            GM_log('#=#= Auto DTonCOMP changed to ', $('#ch10').is(':checked')  );
        });
        $("#XS").on('change', function() {
            GM_setValue('XtraSWOW', $("#XS").val() );
            GM_log('#=#= XtraSWOW changed to ', $("#XS").val()  );
        });
        $("#SS").on('change', function() {
            GM_setValue('SWOW_sep', $("#SS").val() );
            GM_log('#=#= SWOW_sep changed to ', $("#SS").val()  );
        });
        $("#resSav").on('click', function() {
            GM_log('#=#= savefile clicked ' );
            MailTemplName = $("#ta5").val().split(/\n/g);
            MailTemplate  = $("#ta6").val().split(/\n/g);
            mydata = '; Email Templates.\n';
            for (i = 0; i < MailTemplName.length; i++) {
                mydata += '"' + MailTemplName[i] + '","' + MailTemplate[i] + '"\n';
            }
            options  = $("#ta2").val().split(/\n/g);
            actions  = $("#ta3").val().split(/\n/g);
            mydata += '; Options and Actions.\n';
            for (i = 0; i < options.length; i++) {
                mydata += '"' + options[i] + '","' + actions[i] + '"\n';
            }

            data2file(mydata, filename, ftype);
        });
        $('#settingsdrag').on('mousedown', function(e) {
            if(e.offsetX===undefined){
                xoff = e.pageX-$(this).offset().left;
                yoff = e.pageY-$(this).offset().top;
            }else{
                xoff = e.offsetX;
                yoff = e.offsetY;
            }
            $(this).addClass('draggable');
            $('body').addClass('noselect');
            $target = $(e.target).parent().parent().parent().parent();  //.parent(); //
        });
        if ( tb && tb !== '' ) {
            GM_log('#=#= showform Show tab ', tb  ); //#hop > tbody > tr:nth-child(2) > td > span:nth-child(3)
            $('.set1').hide();
            $('.set2').hide();
            $('.set3').hide();
            $('.set' + tb).show();
            $('#hop > tbody > tr:nth-child(2) > td > span').removeClass('tabs2_active');
            $('#hop > tbody > tr:nth-child(2) > td > span:nth-child(' + tb + ')').addClass('tabs2_active');
        } else {
            $('.set2').hide();$('.set3').hide();
        }
        $('#resSetting2').hide();
        $('.tbclk').click( function(e) {
            $('.set1').hide();$('.set2').hide();$('.set3').hide();
            $('.tbclk').removeClass('tabs2_active');
            $(this).addClass('tabs2_active');
            if($(this).text().indexOf('Action') > -1) { $('.set1').show(); $('#resSetting2').hide(); $('#resSetting1').show(); $("#resSav").hide();$("#resRes").hide();$("#saveset").show(); }
            if($(this).text().indexOf('Mail')   > -1) { $('.set2').show(); $('#resSetting1').hide(); $('#resSetting2').show(); $("#resSav").hide();$("#resRes").hide();$("#saveset").show(); }
            if($(this).text().indexOf('Other')  > -1) { $('.set3').show(); $('#resSetting2').hide(); $('#resSetting1').hide(); $("#resSav").show();$("#resRes").show();$("#saveset").hide(); }
        });

        if ( tb === 1 ) { $('.set1').show(); $('#resSetting2').hide(); $('#resSetting1').show(); $("#resSav").hide();$("#resRes").hide();$("#saveset").show(); }
        if ( tb === 2 ) { $('.set2').show(); $('#resSetting1').hide(); $('#resSetting2').show(); $("#resSav").hide();$("#resRes").hide();$("#saveset").show(); }
        if ( tb === 3 ) { $('.set3').show(); $('#resSetting2').hide(); $('#resSetting1').hide(); $("#resSav").show();$("#resRes").show();$("#saveset").hide(); }

        $('.tabchk').on('click' , function() {
            var tb = $(this).attr('name');
            var st = $(this).is(':checked');
            GM_log('#=#=  tabchk', tb + ' ' +  st + ' clicked');
            if ( tb === 'PWS') { tb = 'PWS'; }
            if ( tb === 'Scram')  { tb = 'Scram'; }
            if ( tb === 'Webex')  { tb = 'Webex'; }
            if ( tb === 'MOVEit') { tb = 'MOVEit'; }
            if ( tb === 'escal')  { tb = 'Escalation'; }
            if ( tb === 'stake')  { tb = 'Stakeholders'; }
            if ( tb === 'custom') { tb = 'Custom section';}
            if (st && tb) {
                tab_show(tb);
                mytabs[tb] = 1;
            } else 	{
                tab_hide(tb);
                mytabs[tb] = 0;
            }
            GM_setValue('mytabs', JSON.stringify(mytabs) );
        });
    }
    $(function(){
        $('.boxsizingBorder').scroll(function(){
            $('.boxsizingBorder').scrollTop($(this).scrollTop());
        });
    });

}



function closeform() {
    $("#settings").css('top','100px').css('left','100px').fadeOut(500);
}

function resetform1() {
    GM_deleteValue('ITSMsettingsOptions');
    GM_deleteValue('ITSMsettingsActions');
    $("#settings").css('top','100px').css('left','100px').fadeOut(500);
    rfsh();
}
function resetform2() {
    GM_deleteValue('ITSMsettingsOptions1');
    GM_deleteValue('ITSMsettingsActions2');
    $("#settings").css('top','100px').css('left','100px').fadeOut(500);
    rfsh();
}


function saveform() {
    GM_log('# saveform ' );

    GM_setValue('ITSMsettingsOptions' , $("#ta2").val());
    GM_setValue('ITSMsettingsActions' , $("#ta3").val());
    GM_setValue('ITSMsettingsOptions1', $("#ta5").val());
    GM_setValue('ITSMsettingsActions2', $("#ta6").val());

    var jsonActions = [];
    jsonActions = $("#ta3").val().split(/\n/g);
    GM_setValue("jsonActions", JSON.stringify(jsonActions) );
    MailTemplName = $("#ta5").val().split(/\n/g);
    MailTemplate  = $("#ta6").val().split(/\n/g);
    GM_log('# lines in ta6 ' + MailTemplate.length );
    for (i = 0; i < MailTemplate.length; i++) { MailTemplate[i] =  MailTemplate[i].replace(/\n/g,'\\n'); }
    GM_log('# line 5 ' + MailTemplate[4] );
    form2options();
    $("#settings").css('top','100px').css('left','100px').fadeOut(500);
}


function form2options() {
    GM_log('#=#  ITSMsettingsOptions ');
    var stoem;
    if ( typeof GM_getValue('ITSMsettingsOptions') !== 'undefined' ) {
        GM_log('#=#  load ITSMsettingsOptions ');
        stoem = GM_getValue('ITSMsettingsOptions');
        GM_log('#=#  ITSMsettingsOptions defined');
        if ( stoem.split('\n').length > 10 )  {
            var options = GM_getValue('ITSMsettingsOptions');
            if ( options ) {
                OPT_text = options.split('\n');
                GM_log('#=#  split ITSMsettingsOptions ');
                OPT_text.unshift('Action 0');  // need this, because we count from 1 not 0
                GM_log('#=#  shift ITSMsettingsOptions ');
            }
        }
    } else {
        GM_log('#=#  ITSMsettingsOptions undefined' , OPT_text.length);
    }


    if ( typeof GM_getValue('ITSMsettingsActions') !== 'undefined' ) {
        stoem = GM_getValue('ITSMsettingsActions');
        GM_log('#=#  ITSMsettingsActions' , stoem.split('\n').length );
        if ( stoem.split('\n').length > 10 )  {
            if ( typeof GM_getValue('ITSMsettingsActions') !== 'undefined' ) {
                var actions = GM_getValue('ITSMsettingsActions');
                if ( actions ) {
                    ACT_text = actions.split('\n');
                    ACT_text.unshift('Action 0');
                    for (i = 1; i < 41; i++) {
                        ACT_text[i] = ACT_text[i].replace(/\\n/g,'\n');
                    }
                }
            }
        }
    } else {
        GM_log('#=#  ITSMsettingsActions undefined' , ACT_text.length);
    }

    GM_log('#=#  form2options() removing current options OPT_text[1]= ' + OPT_text[1] );
    $('#wims1').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Your Actions     </option>').val(0);
    $('#wims2').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Customer Actions </option>').val(0);
    $('#wims3').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Vendor Actions   </option>').val(0);
    $('#wims4').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Other Actions    </option>').val(0);
    $('#wims5').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Your Actions     </option>').val(0);
    $('#wims6').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Customer Actions </option>').val(0);
    $('#wims7').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Vendor Actions   </option>').val(0);
    $('#wims8').find('option').remove().end().append('<option style="background-color:#DFF" value= 0>  Other Actions    </option>').val(0);

    for (var i = 1; i < 41; i++) {
        if (i < 11) {
            $('#wims1').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
            $('#wims5').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
        } else if ( i < 21 ) {
            $('#wims2').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
            $('#wims6').append ($('<option></option>').attr('value',i).text(OPT_text[i]) );
        } else if ( i < 31 ) {
            $('#wims3').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
            $('#wims7').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
        } else if ( i < 41 ) {
            $('#wims4').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
            $('#wims8').append( $('<option></option>').attr('value',i).text(OPT_text[i]) );
        }
    }

    if ( typeof GM_getValue('ITSMsettingsOptions1') !== 'undefined' ) {
        var options1 = GM_getValue('ITSMsettingsOptions1');
        MailTemplName = options1.split('\n');
        GM_log('#=#  ITSMsettingsOptions1 defined' , MailTemplName.length);
    }else {
        GM_log('#=#  ITSMsettingsOptions1 undefined' , MailTemplName.length);
    }

    if ( typeof GM_getValue('ITSMsettingsActions2') !== 'undefined' ) {
        var actions2 = GM_getValue('ITSMsettingsActions2');
        MailTemplate = actions2.split('\n');
        GM_log('#=#  ITSMsettingsActions2 defined' , MailTemplate.length);
    }else {
        GM_log('#=#  ITSMsettingsActions2 undefined' , MailTemplate.length);
    }


    $('#mailtype').find('option').remove().end().append('mailoptions');
    for (var idx = 0, len = MailTemplName.length; idx < len; idx++) {
        $('#mailtype').append( $('<option class="mto" title="' + MailTemplName[idx] + '"></option>').attr('value',idx).text('__  ' +  MailTemplName[idx] ) );
    }

    GM_log('#=#  ITSMsettingsOptions done. ');

}

function changemailink(idx) {
    var t = parsevars( MailTemplate[idx] );
    t = tosub + '&body=' + t + mcc;
    GM_log('changemailink update ' +  idx + '  ' +  t.length + '  ' +  t  );
    window.top.location = t;
    return false;
}

function parsevars(txt) {
    var rtime = ('0'  + dt.getHours()).slice(-2)+':'+('0' + dt.getMinutes()).slice(-2);
    var t = txt.replace(/{fn}/g,custfn).replace(/{ln}/g,custln);
    t = t.replace(/{mf}/g,MyFirstName).replace(/{ml}/g,MyLastName).replace(/{mn}/g,Assignee);
    t = t.replace(/{product}/g,info[0]).replace(/{serial}/g,info[2]).replace(/{version}/g,info[1]).replace(/{contract}/g,info[3]).replace(/{vend}/g,info[4]);
    t = t.replace(/{swow}/g,swow);
    t = t.replace(/\\n/g,'%0A%0D').replace(/\n/g,'%0A%0D');  // below should not contain newlines CRLF
    t = t.replace(/\\t/g,'%09');
    //		t = t.replace(/\\t/g,'    ');
    t = t.replace(/{dt}/g,rnow);
    t = t.replace(/{sp=}/g,sep1);
    t = t.replace(/{sp\/}/g,sep2);
    t = t.replace(/{sa}/g,shortassign);
    t = t.replace(/{SA}/g,Ushortassign);
    t = t.replace(/{company}/g,CustNM);
    t = t.replace(/{eta}/g,etadt);
    t = t.replace(/{status}/g,prbstat);
    t = t.replace(/{case}/g,casenr);
    t = t.replace(/{cust}/g,custnm);
    if (locationname) t = t.replace(/{loca}/g,locationname);
    t = t.replace(/{siteid}/g,siteid);
    t = t.replace(/{sd}/g, $('#' + script + '\\.short_description').attr('value') );
    if ( client_ref !== '' && client_ref !== '<ITSM_EXTREF_CLIENTREFNUM>') { t = t.replace(/{ctref}/g,client_ref + '%0A%0D%0A%0D'); } else { t = t.replace(/{ctref}/g,''); }
    return t;
}

function replacer(txt) {
    GM_log('#=#=#=# replacer ',t, custfn,  custln , info ,shortassign , Ushortassign);
    //   No .replace(/\n/g,'%0A%0D'); in replacer !! for paste to textarea
    var rtime = ('0'  + dt.getHours()).slice(-2)+':'+('0' + dt.getMinutes()).slice(-2);
    var t = txt.replace(/{fn}/g,custfn).replace(/{ln}/g,custln);
    t = t.replace(/{product}/g,info[0]).replace(/{serial}/g,info[2]).replace(/{version}/g,info[1]).replace(/{contract}/g,info[3]).replace(/{vend}/g,info[4]);
    t = t.replace('{dt}',rnow);
    //		t = t.replace(/\t/g,'%09');
    t = t.replace('{sa}',shortassign);
    t = t.replace('{SA}',Ushortassign);
    t = t.replace(/{status}/g,prbstat);
    t = t.replace(/{siteid}/g,siteid);
    t = t.replace('{sp=}',sep1);
    t = t.replace('{sp/}',sep2);
    t = t.replace('{tm}',rtime);
    t = t.replace('{fn}',custfn);
    t = t.replace('{ln}',custln);
    t = t.replace(/{mf}/g,MyFirstName);
    t = t.replace(/{ml}/g,MyLastName);
    t = t.replace(/{mn}/g,Assignee);
    t = t.replace(/{case}/g,casenr);
    t = t.replace(/{cust}/g,custnm);
    if (locationname) t = t.replace(/{loca}/g,locationname);
    t = t.replace(/{eta}/g,etadt);
    t = t.replace(/{pri}/g,casepriority);
    t = t.replace(/{sd}/g, $('#' + script + '\\.short_description').attr('value') );
    if ( client_ref !== '<ITSM_EXTREF_CLIENTREFNUM>') { t = t.replace(/{ctref}/g,client_ref); } else { t = t.replace(/{ctref}/g,''); }
    return t;
}
function hide_exstuff(p) {
    if ( p == 1 ) {
        tab_hide('Tab_2');
        tab_hide('Tab_3');
        tab_hide('Tab_4');
        tab_hide('Tab_5+');
    } else {
        tab_show('Tab_2');
        tab_show('Tab_3');
        tab_show('Tab_4');
        tab_show('Tab_5+');
    }
}

function tab_hide(tab) {
    for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
        var tabcap = $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().replace('@','').replace(/\s/g,' ').trim().toLowerCase();
        tab = tab.replace(/\s/g,' ').trim().toLowerCase();
        GM_log('#=#=#=# tab ' + c + ' ['+ tab +'] === [' + tabcap + ']' );
        if ( tabcap === tab ) {
            $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent().parent().hide(); // .next().hide();
            break;
        }
    }
    if ( c === $('#tabs2_section span.tab_caption_text').length ) {GM_log('#=#=#=# tab '+ tab +' not found'); }
}

function tab_show(tab) {
    for ( var c = 0; c < $('#tabs2_section span.tab_caption_text').length; c++ ) {
        var tabcap = $('#tabs2_section span.tab_caption_text:eq(' + c + ')').text().replace('@','').replace(/\s/g,' ').trim().toLowerCase();
        tab = tab.replace(/\s/g,' ').trim().toLowerCase();
        if ( tabcap === tab ) {
            $('#tabs2_section span.tab_caption_text:eq(' + c + ')').parent().parent().show(); // .next().show();
            break;
        }
    }
    if ( c === $('#tabs2_section span.tab_caption_text').length ) {GM_log('#=#=#=# tab '+ tab +' not found'); }
}

function hide_stuff(p) {

    if ( script.indexOf('navpage') > -1  ) return;
    GM_log('# hide_stuff [' + p + '] CC=',  $('#' + script + '\\.contact_type option:selected').text() );
    var caseCCtype = 'O';
    if ( p == 1 ) {
        $('#element\\.' + script + '\\.approval').css('display','none');
        $('#element\\.' + script + '\\.u_workflow_stage').css('display','none');
        if ( $('#sys_display\\.' + script + '\\.u_responsible_owner_group').val() === '' ) $('#element\\.' + script + '\\.u_responsible_owner_group').css('display','none');
        if ( $('#sys_display\\.' + script + '\\.u_responsible_owner').val()       === '' ) $('#element\\.' + script + '\\.u_responsible_owner').css('display','none');
        $('#element\\.' + script + '\\.contact_type').css('display','none');
        if ($('#' + script + '\\.contact_type option:selected').text() === 'Email')        caseCCtype = 'f175';
        if ($('#' + script + '\\.contact_type option:selected').text() === 'Phone')        caseCCtype = 'f1be';
        if ($('#' + script + '\\.contact_type option:selected').text() === 'Self-service') caseCCtype = 'f111';
        if ($('#' + script + '\\.contact_type option:selected').text() === 'Monitoring')   caseCCtype = 'f103';
        if ($('#' + script + '\\.contact_type option:selected').text() === 'Scheduled')    caseCCtype = 'f18e';
        if ( $('#caseCC').length === 0 && script !== 'u_rim_event') {
            $('#status\\.' + script + '\\.number').parent().append('<span class="itsmplus icon-tree" id="caseCC" style="float:left;padding-top: 2px !important;padding-bottom: 0px !important;" title="Case opened via: ' + $('#' + script + '\\.contact_type option:selected').text() + '">&nbsp;</span>');
            $('#caseCC').show();
            GM_addStyle(' span#caseCC:before { content: "\\' + caseCCtype + '"; }');
        }
        $('#element\\.' + script + '\\.u_classification\\.u_classification_path').css('display','none');
        $('#element\\.' + script + '\\.u_equipment_requirements').css('display','none');
        $('#element\\.' + script + '\\.u_knowledge_article').css('display','none');
        $('#element\\.' + script + '\\.u_major_task').css('display','none');
        $('#element\\.' + script + '\\.u_is_critical').css('display','none');
        $('#element\\.' + script + '\\.priority').css('display','none');
        if ( $('#sys_readonly\\.' + script + '\\.location\\.u_site_id').val() === ''  ) $('#element\\.' + script + '\\.location\\.u_site_id').css('display','none');
        $('#status\\.' + script + '\\.short_description').css('display','none').removeClass('mandatory_populated').removeClass('required-marker');
        $('div.custom-form-group.form-group').each( function() { if ( $(this).text() === '') $(this).hide(); });
        $('#element\\.' + script + '\\.u_breached').css('display','none');
        $('#element\\.' + script + '\\.u_billable').css('display','none');
        $('#element\\.' + script + '\\.knowledge').css('display','none');
        $('#element\\.' + script + '\\.u_auto_close_milestone').css('display','none');
        $('#element\\.' + script + '\\.u_ac_confirmation_date').css('display','none');
        $('#u_execution_model_annotation').parent().css('display','none');						//
        $('#element\\.' + script + '\\.short_description').prev().css('display','none');
        $('#label\\.' + script + '\\.u_banner').parent().css('display','none');
        if ( $('#view\\.' + script + '\\.u_major').length === 1 && $('#' + script + '\\.u_major').val() !== '') {  // parent field visible
            $('#view\\.' + script + '\\.u_major').parent().append('&nbsp;<span class=itsmplus><a title="" href="/' + script + '.do?sys_id=' + $('#' + script + '\\.u_major').val() + '" target="_blank"><img src="images/timer_start.gifx" style="width:14px;height:14px;"></a></span>');
        }
        $('input').removeAttr('disabled').removeClass('disabled');
        $('#sys_readonly\\.' + script + '\\.number').css('background','transparent').css('color','#000');
        $('#' + script + '\\.short_description').css('background','transparent').css('color','#000');

        $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(1)').parent().find('table.vsplit_bottom_margin').css('background-color','transparent');	// .css('width','50%')
        $('table.wide > tbody:nth-child(1) > tr:nth-child(2) > td.vsplit:nth-child(2)').parent().find('table.vsplit_bottom_margin').css('background-color','transparent');  // .css('width','50%')

        var screenwidth = $('#element\\.' + script + '\\.short_description').css('width');
    } else {
        $('#element\\.' + script + '\\.approval').css('display','inline');
        $('#element\\.' + script + '\\.u_workflow_stage').css('display','inline');
        $('#element\\.' + script + '\\.u_responsible_owner_group').css('display','inline');
        $('#element\\.' + script + '\\.u_responsible_owner').css('display','inline');
        $('tr.annotation-row:nth-child(19) > td:nth-child(1)').css('display','block');
        $('#element\\.' + script + '\\.contact_type').css('display','inline');
        $('#caseCC').hide();
        $('#element\\.' + script + '\\.u_classification\\.u_classification_path').css('display','inline');
        $('#element\\.' + script + '\\.u_equipment_requirements').css('display','inline');
        $('#element\\.' + script + '\\.u_knowledge_article').css('display','inline');
        $('#element\\.' + script + '\\.u_major_task').css('display','inline');
        $('#element\\.' + script + '\\.u_is_critical').css('display','inline');
        $('#element\\.' + script + '\\.location\\.u_site_id').css('display','inline');
        $('#element\\.' + script + '\\.location').css('display','inline');
        $('#element\\.' + script + '\\.priority').css('display','inline');
        $('div.custom-form-group.form-group:first').show();
    }
    colorpri();
    // always adjust
    document.title = casenr + ' ' + $('#' + script + '\\.short_description').val();
    $('select[name$="currency_type"]').css('max-width','75px').css('min-width','75px').css('width','75px');
    $('#pm_project_task\\.cost\\.display').attr('style','padding-right: 10px !important;width:190px;');
    $('#pm_project_task\\.work_cost\\.display').attr('style','padding-right: 10px !important;width:190px;');
    $('#pm_project_task\\.percent_complete').attr('style','direction:ltr;width:263px !important;padding-right:10px !important;');

    $('#element\\.pm_project\\.cost > div.col-xs-10.col-sm-9.col-md-6.col-lg-5.form-field.input_controls.btn.btn-default').attr('style','width:265px !important;margin-left:15px;');
    $('#element\\.pm_project\\.cost > div.col-xs-10.col-sm-9.col-md-6.col-lg-5.form-field.input_controls.btn.btn-default > div').css('display','none');
    $('#element\\.pm_project\\.percent_complete > div.col-xs-2.col-sm-3.col-lg-2.form-field-addons.btn.btn-default').css('display','none');
    $('#select_0' + script + '\\.watch_list').removeClass('form-control').addClass('select90');
    $('#select_0' + script + '\\.group_list').removeClass('form-control').addClass('select90');
    $('button > span.icon').css('margin-left','-4px');
    $('#' + script + '\\.watch_list_edit > div:nth-child(4) > span > button').attr('style','height:14px !important;');
}

function colorpri() {
    $('#label\\.' + script + '\\.short_description > label').addClass('sdlabel');
    $('#label\\.' + script + '\\.short_description > label').css('border','solid 1px #bdc0c4').css('border-radius','3px'); // .css('padding','2px 0px 2px 0px')
    casepriority = $('#' + script + '\\.priority').val();
    $('#sys_readonly\\.' + script + '\\.priority').removeClass('lbllow').removeClass('lblnor').removeClass('lblhi').removeClass('lblcri').attr('style','');
    $('#label\\.' + script + '\\.short_description > label').removeClass('lbllow').removeClass('lblnor').removeClass('lblhi').removeClass('lblcri');
    if ( casepriority === '5'  ) $('#label\\.' + script + '\\.short_description > label').addClass('lblpln');
    if ( casepriority === '4'  ) $('#label\\.' + script + '\\.short_description > label').addClass('lbllow');
    if ( casepriority === '3'  ) $('#label\\.' + script + '\\.short_description > label').addClass('lblnor');
    if ( casepriority === '2'  ) $('#label\\.' + script + '\\.short_description > label').addClass('lblhi' );
    if ( casepriority === '1'  ) $('#label\\.' + script + '\\.short_description > label').addClass('lblcri');
    $('#label\\.' + script + '\\.short_description > label > span.label-text').text('Priority ' + $("#sys_readonly\\." + script + "\\.priority option:selected").text());
    $('#status\\.' + script + '\\.short_description').css('display','none').removeClass('mandatory_populated').removeClass('required-marker');
    GM_log('# colorpri ', $("#sys_readonly\\." + script + "\\.priority option:selected").text()+' === '+ $("#sys_readonly\\." + script + "\\.priority option:selected").val()+' === '+ casepriority );
    bannercontrol();
}

function bannercontrol() {
    if ( GM_getValue('ShowBanners') === 'hide' ) {
        GM_log('#=#=#=# do not show banners all the time ');
        $('div.notification-info.fieldmsg').each( function() {                 // outputmsg outputmsg_info notification notification-info
            var o  = $(this);
            var q  = o.parent().parent().parent();
            var id = q.attr('id');
            var t  = q.find('span.icon-search').parent();
            var u  = q.find('input.element_reference_input');
            var tmri;
            if ( bannertextcontains(o.text()) ) {
                o.addClass('srch_ib');
            } else {
                if (id && o.text() !== '' ) {
                    GM_log('#=#=#=#  found notification-info 2', o.text() );
                    id = id.replace(/\./g,'_');
                    o.attr('id', 'ib_' + id).fadeOut(2000);
                    t.addClass('srch_ib');
                    u.addClass('srch_ib');
                    t.hover( function() {
                        $('div#ib_'+id).fadeIn(300);
                        clearTimeout(tmri);
                    } , function() {
                        tmri = setTimeout( function() { $('div#ib_'+id).hide(2000); }, 3000);
                    });
                    u.hover( function() {
                        $('div#ib_'+id).fadeIn(300);
                        clearTimeout(tmri);
                    } , function() {
                        tmri = setTimeout( function() { $('div#ib_'+id).hide(2000); }, 3000);
                    });
                }
            }
        });
    } else {
        GM_log('#=#=#=# show banners all the time ');
        GM_addStyle(`.fieldmsg  { display:block; }`);
    }
}

function bannertextcontains(bannertxt) {
    if ( bannertxt.indexOf('P1:') > -1 && casepriority === "1" ) return true;    // make banner appear if case is P1  !!!!
    if ( bannertxt.indexOf('P2:') > -1 && casepriority === "2" ) return true;
    if ( bannertxt.indexOf('P3:') > -1 && casepriority === "3" ) return true;

    return false;
}


function my_tab(tb) {
    if ( mytabs[tb] > 0 ) {
        return ' checked ';
    } else {
        return '';
    }
}

var mytabs;
if ( GM_getValue('mytabs') ) {
    mytabs = JSON.parse(GM_getValue('mytabs'));
    GM_log('#=#= mytabs ' , mytabs.Stakeholders, mytabs.Escalation, GM_getValue('mytabs'));
} else {
    mytabs = { 'Scram':1,'MOVEit':1,'Webex':1,'PWS':1,'Escalation':1,'Stakeholders':1,'Custom section':1, 'NEW':1 };
}




var BTN1_text,BTN2_text,BTN3_text;
var OPT_text = [];
var ACT_text = [];
var MailTemplName = [];
var MailTemplate  = [];


BTN1_text = 'NTT {sa} update to customer\n{sp=}\n';
BTN2_text = 'NTT {sa} update to vendor\n{sp=}\n';
BTN3_text = 'NTT {sa} update to SDM\n{sp=}\n';



OPT_text[ 1] = '  Called Cust       ';
OPT_text[ 2] = '  Update to Cust    ';
OPT_text[ 3] = '  Called Vendor     ';
OPT_text[ 4] = '  Update to Vendor  ';
OPT_text[ 5] = '  Called SDM        ';
OPT_text[ 6] = '  Update to SDM     ';
OPT_text[ 7] = '  Called AM         ';
OPT_text[ 8] = '  Update to AM      ';
OPT_text[ 9] = '  Called CM         ';
OPT_text[10] = '  Update to CM      ';
OPT_text[11] = '  Update from Cust  ';
OPT_text[12] = '  Option 2          ';
OPT_text[13] = '  Option 3          ';
OPT_text[14] = '  Option 4          ';
OPT_text[15] = '  Option 5          ';
OPT_text[16] = '  Option 6          ';
OPT_text[17] = '  Option 7          ';
OPT_text[18] = '  Option 8          ';
OPT_text[19] = '  Option 9          ';
OPT_text[20] = '  Option 10         ';
OPT_text[21] = '  Update from Vendor ';
OPT_text[22] = '  Option 2           ';
OPT_text[23] = '  Option 3           ';
OPT_text[24] = '  Option 4           ';
OPT_text[25] = '  Option 5           ';
OPT_text[26] = '  Option 6           ';
OPT_text[27] = '  Option 7           ';
OPT_text[28] = '  Option 8           ';
OPT_text[29] = '  Option 9           ';
OPT_text[30] = '  Option 10          ';
OPT_text[31] = '  Hello      ';
OPT_text[32] = '  ByeBye     ';
OPT_text[33] = '  Option 3   ';
OPT_text[34] = '  Option 4   ';
OPT_text[35] = '  Option 5   ';
OPT_text[36] = '  Option 6   ';
OPT_text[37] = '  Option 7   ';
OPT_text[38] = '  Option 8   ';
OPT_text[39] = '  Option 9   ';
OPT_text[40] = '  Option 10  ';


ACT_text[ 1] = 'NTT {sa} Called to Customer\n{sp=}\n';
ACT_text[ 2] = 'NTT {sa} Update to Customer\n{sp=}\n';
ACT_text[ 3] = 'NTT {sa} Called to Vendor\n{sp=}\n';
ACT_text[ 4] = 'NTT {sa} Update to Vendor\n{sp=}\n';
ACT_text[ 5] = 'NTT {sa} Called to SDM\n{sp=}\n';
ACT_text[ 6] = 'NTT {sa} Update to SDM\n{sp=}\n';
ACT_text[ 7] = 'NTT {sa} Called to Account Mgr\n{sp=}\n';
ACT_text[ 8] = 'NTT {sa} Update to Account Mgr\n{sp=}\n';
ACT_text[ 9] = 'NTT {sa} Called to Contract Mgmt\n{sp=}\n';
ACT_text[10] = 'NTT {sa} Update to Contract Mgmt\n{sp=}\n';
ACT_text[11] = 'Update from Cust\n{sp=}\n';
ACT_text[12] = 'OPT_text[12] {dt} {sa}';
ACT_text[13] = 'OPT_text[13] {dt} {sa}';
ACT_text[14] = 'OPT_text[14] {dt} {sa}';
ACT_text[15] = 'OPT_text[15] {dt} {sa}';
ACT_text[16] = 'OPT_text[16] {dt} {sa}';
ACT_text[17] = 'OPT_text[17] {dt} {sa}';
ACT_text[18] = 'OPT_text[18] {dt} {sa}';
ACT_text[19] = 'OPT_text[19] {dt} {sa}';
ACT_text[20] = 'OPT_text[20] {dt} {sa}';
ACT_text[21] = 'Update from Vendor\n{sp=}\n';
ACT_text[22] = 'OPT_text[22] {dt} {sa}';
ACT_text[23] = 'OPT_text[23] {dt} {sa}';
ACT_text[24] = 'OPT_text[24] {dt} {sa}';
ACT_text[25] = 'OPT_text[25] {dt} {sa}';
ACT_text[26] = 'OPT_text[26] {dt} {sa}';
ACT_text[27] = 'OPT_text[27] {dt} {sa}';
ACT_text[28] = 'OPT_text[28] {dt} {sa}';
ACT_text[29] = 'OPT_text[29] {dt} {sa}';
ACT_text[30] = 'OPT_text[30] {dt} {sa}';
ACT_text[31] = 'Dear {fn} {ln},\n\nMy name is {mf}\n\nI have taken ownership of this case and will be assisting you in resolving this matter.\n\nBest regards,\n\n{mf}\n\n{dt} {sa}';
ACT_text[32] = 'Dear {fn} {ln},\n\nI have not heard back from you regarding this matter.\nI therefore assume you have found a solution, or the problem has gone away.\n\nIf you still require my assistance in this matter, let me know ASAP.\n\nWithout feedback from your side I will close this case at the end of business day.\n\nBest regards,\n\n{mf}\n\n{dt} {sa}';
ACT_text[33] = 'OPT_text[33] {dt} {sa}';
ACT_text[34] = 'OPT_text[34] {dt} {sa}';
ACT_text[35] = 'OPT_text[35] {dt} {sa}';
ACT_text[36] = 'OPT_text[36] {dt} {sa}';
ACT_text[37] = 'OPT_text[37] {dt} {sa}';
ACT_text[38] = 'OPT_text[38] {dt} {sa}';
ACT_text[39] = 'OPT_text[39] {dt} {sa}';
ACT_text[40] = 'OPT_text[40] {dt} {sa}';


var MyDear		= 'Dear {fn} {ln},';																															// How to address customer Dear customer name
var MyMGSbody	= '%0D%0A%0D%0A%0D%0ABest%20regards,%0D%0A%0D%0A';																								//
MyMGSbody 		= '\n\n\n\nBest%20regards,\n\n{mf}';		//

MailTemplName[0]  = 'update';
MailTemplName[1]  = 'intro';
MailTemplName[2]  = 'bye';
MailTemplName[3]  = 'Meetme';
MailTemplName[4]  = 'Field Intervention';
MailTemplName[5]  = 'FR_IN PROGRESS';
MailTemplName[6]  = 'FR_CLOSED';
MailTemplName[7]  = 'ON SITE DISPATCHED';
MailTemplName[8]  = 'NL_IN PROGRESS';
MailTemplName[9]  = 'NL_CLOSED';
MailTemplName[10] = 'NL_UPDATE TO CUST';
MailTemplName[11] = 'UK_IN PROGRESS';
MailTemplName[12] = 'UK_CLOSED';
MailTemplName[13] = 'UK_UPDATE TO CUST';
MailTemplName[14] = 'example1';
MailTemplName[15] = 'example2';

MailTemplate[0]  =  '{ctref}' + MyDear + MyMGSbody;
MailTemplate[1]  =  'Dear {fn} {ln},\n\nMy name is {mf}\n\nI have taken ownership of this case and will be assisting you in resolving this matter.\n\nBest regards,\n\n{mf}';
MailTemplate[2]  =  'Dear {fn} {ln},\n\nI have not heard back from you regarding this matter.\nI therefore assume you have found a solution, or the problem has gone away.\n\nIf you still require my assistance in this matter, let me know ASAP.\n\nWithout feedback from your side I will close this case at the end of business day.\n\nBest regards,\n\n{mf}';
MailTemplate[3]  =  'Dear {fn} {ln},\n\nPlease join my WEBEX room.\n\nhttps://nttlimited.webex.com/meet/{mf}.{ml}\n\nBest regards,\n\n{mf}';
MailTemplate[4]  =  'Send to @BE.RSO.FieldTeam as well as the client.\n\nFieldteam on-site intervention request\n**************************************\n\nITSM task:\\t{case}\nClient\n\\tName:\\t{cust}\n\\tIntervention address:\\t{loca}\nClient requestor\n\\tName:\\t{fn} {ln}\n\\tMobile phone no.:\n\\tFix phone no.:\nTrg engineer\n\\tName: {mn}\n\\tMobile phone no.:\nClient contact on site\n\\tName:\n\\tMobile phone no.:\n\\tFix phone no.:\nPrefered intervention date/time: {dt}\nShort problem description: {sd}\nField activity to be carried out (clear and with sufficient details):\n\\ta.\n\\tb.\n\\tc.\n\\t…\nChecks to be carried out (clear and with sufficient details):\n\\ta.\n\\tb.\n\\tc.\n\\t…\nSpecial remarks:\n\nWarehouse material request\n**************************\n\nItem 1\n**********\nProduct name:\nProduct material code:\nQuantity:\nWarehouse location:\n\nItem 2\n**********\nProduct name:\nProduct material code:\nQuantity:\nWarehouse location:\n\nItem 3\n**********\nProduct name:\nProduct material code:\nQuantity:\nWarehouse location:';
MailTemplate[5]  =  'Cher client, \nCher helpdesk,  \n\n\n\n\nLe statut de votre ticket a été adapté de Ouvert vers “diagnoses in progress”. Mise à jour suivra,\n\n\n Sincères salutations,';
MailTemplate[6]  =  'Cher client, \nCher helpdesk,  \n\n\n\n\nVotre ticket est clôturé.\n\n\n Sincères salutations,';
MailTemplate[7]  =  'Beste klant, Cher client, Dear customer, \n\n\n\nEen collega werd gedispatched op dit ticket en zal ter plaatse komen.\nUn collègue fera une intervention sur site pour cette demande.\n One of my colleagues has been dispatched to go on-site, \n\n\n';
MailTemplate[8]  =  'Beste klant, \nBeste helpdesk, \n\n\n\nDe status van uw ticket werd aangepast naar “diagnosis in progress”. We houden u op de hoogte,\n\n\n\n\n Met vriendelijke groeten,';
MailTemplate[9]  =  'Beste klant, \nBeste helpdesk, \n\n\n\nUw ticket werd afgesloten.\n\n\n\n\n Met vriendelijke groeten,';
MailTemplate[10] =  'Beste klant, \nBeste helpdesk, \n\n\n\nHierbij een status update in verband met uw ticket met referentie: \n\n\n\n\n Met vriendelijke groeten,';
MailTemplate[11] =  'Dear Customer, \nDear Helpdesk, \n\n\n\nStatus of your ticket is adapted from Open to “diagnosis in progress”. Feedback will follow,\n\n\n\n\n Best regards,';
MailTemplate[12] =  'Dear Customer, \nDear Helpdesk, \n\n\n\nYour ticket has been closed. \n\n\n\n\n Best regards,';
MailTemplate[13] =  'Dear Customer, \nDear Helpdesk, \n\n\n\nPlease find below an update regarding your ticket \n\n\n\n\n Best regards,';
MailTemplate[14] =  'Beste {fn} \n\nblabla lblabla blabla blabla blablablabla\n\nblabla blabla blablablabla blabla\n\n{swow}\n\nProduct: {product}\nSerial: {serial}\nVersion: {version}\nContract: {contract}\n\nBye\n\n{mf}\n\nCompany: {company}\nKlant Voornaam: {fn}\nKlant Achternaam: {ln}\n\nMijn Voornaam: {mf}\nMijn Achternaam: {ml}\n\n{sp=}\nShort Assignee: {sa}\nNow: {dt}';
MailTemplate[15] =  'Beste {fn} \n\nMore examples\n\nCase Status: {status}\nCase ETA: {eta}\n\n{swow}\n\nProduct: {product}\nSerial: {serial}\nVersion: {version}\nContract: {contract}\n\nBye\n\n{mf}\n\nCompany: {company}\nKlant Voornaam: {fn}\nKlant Achternaam: {ln}\n\nMijn Voornaam: {mf}\nMijn Achternaam: {ml}\n\n{sp=}\nShort Assignee: {sa}\nNow: {dt}';


function nicetab(activetab) {
    $('.tabs2_tab').removeClass('tabs2_activel').removeClass('tabs2_activer');
    $('.tabs2_active').removeClass('tabs2_active');
    var prevtab = activetab.parent().prev();
    var nexttab = activetab.parent().next();
    activetab.addClass('tabs2_active');
    GM_log('#> next tab ', (nexttab.attr('style') + nexttab.find('.tabs2_tab').attr('style')) );
    GM_log('#> prev tab ', (prevtab.attr('style') + prevtab.find('.tabs2_tab').attr('style')) );
    var tabstyle = (nexttab.attr('style') + nexttab.find('.tabs2_tab').attr('style')).toString();
    while ( tabstyle.indexOf('none') > -1 ) {
        GM_log('#> next tab hidden');
        nexttab = nexttab.next();
        tabstyle = (nexttab.attr('style') + nexttab.find('.tabs2_tab').attr('style')).toString();
    }
    var tabstyle = (prevtab.attr('style') + prevtab.find('.tabs2_tab').attr('style')).toString();
    while ( tabstyle.indexOf('none') > -1 ) {
        GM_log('#> prev tab hidden');
        prevtab = prevtab.prev();
        tabstyle = (prevtab.attr('style') + prevtab.find('.tabs2_tab').attr('style')).toString();
    }

    prevtab.find('.tabs2_tab').addClass('tabs2_activel');
    nexttab.find('.tabs2_tab').addClass('tabs2_activer');
    activetab.blur();

}


function setCookie(c_name, value, expiredays) {
    //  https://stackoverflow.com/questions/13452626/
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + value + ((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
    GM_log('# cookie = ',c_name + "=" + value + ((expiredays==null) ? "" : ";expires="+exdate.toUTCString()) );
}



function getCookie(cname) {
    //  https://www.w3schools.com/js/js_cookies
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(unsafeWindow.document.cookie);
    var ca = decodedCookie.split(';');   for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function tpVendorURL(vendor, rt) {
    var vid = 0;
    var reftype = '';
    vid = getVendorID(vendor);
    if ( rt === 'Vendor Case' )               reftype = 'Vendor reference number';
    if ( rt === 'Vendor RMA' )                reftype = 'Vendor reference number / RMA';
    if ( rt === 'Vendor BugID/Defect Ref' )   reftype = 'Vendor known error code';
    if ( rt === 'Customer reference' )        reftype = 'Client reference number';
    setURLstr(reftype);
    GM_log('# tpVendorURL ', vid , urlstr[vid] , vendor);
    var t = [];
    t[0] = vid;
    t[1] = reftype;
    return t;
}

function getVendorID(vendor) {
    var vid=0;
    var lvendor = vendor.toLowerCase();
    if (lvendor === 'newrma')                    { vid = 0; }
    if (lvendor === 'avaya')                     { vid = 1; }
    if (lvendor === 'bluecoat')                  { vid = 2; }
    if (lvendor === 'cisco')                     { vid = 4; }
    if (lvendor === 'checkpoint')                { vid = 5; }
    if (lvendor === 'emc')                       { vid = 6; }
    if (lvendor === 'evercom')                   { vid = 15;}
    if (lvendor === 'f5')                        { vid = 7; }
    if (lvendor === 'fortinet')                  { vid = 8; }
    if (lvendor === 'infoblox')                  { vid = 9; }
    if (lvendor === 'juniper')                   { vid = 10;}
    if (lvendor === 'nimsoft')                   { vid = 11;}
    if (lvendor === 'ntt')                       { vid = 12;}
    if (lvendor === 'palo alto')                 { vid = 13;}
    if (lvendor === 'pulse secure')              { vid = 14;}
    if (lvendor === 'ca')                        { vid = 16;}
    if (lvendor === 'riverbed')                  { vid = 17;}
    if (lvendor === 'splunk')                    { vid = 18;}
    if (lvendor.indexOf('alcatel-lucent') > -1 ) { vid = 19;}
    if (lvendor === 'nuance')                    { vid = 20;}
    if (lvendor === 'symantec')                  { vid = 21;}
    if (lvendor === 'genesys')                   { vid = 22;}
    //	if (lvendor === 'ale rainbow')               { vid = 23;}
    if (lvendor === 'checkmk')                   { vid = 24;}
    GM_log('# vendor ', vendor , '  vendorID ', vid );
    return vid;
}

function setURLstr(reftype) {
    if ( reftype === 'Vendor reference number' ) {
        urlstr[ 1] = 'https://support.avaya.com/service-requests/ticket.action?srNum={case}';                                                                        // avaya
        urlstr[ 2] = '';                                                                                                                                             // bluecoat
        urlstr[ 4] = 'https://mycase.cloudapps.cisco.com/{case}';									                                                                 // cisco
        urlstr[ 5] = 'https://uc.checkpoint.com/usercenter/portal/media-type/html/role/usercenterUser/page/default.psml/js_pane/supportId%2CserviceRequestDetailsId?srId={case}'; // checkpoint
        urlstr[ 6] = 'https://onlinesupport.emc.com/SRDetails?srNumber={case}';                                                                                      // emc
        urlstr[ 7] = 'https://websupport.f5.com/casemanager/case.do?caseId={case}';                                                                                  // f5
        urlstr[ 8] = 'https://partners.fortinet.com/FortiPartnerPortal/Application/Redirect.do?oid=4&ticketId={case}';                                               // fortinet
        urlstr[ 9] = 'https://support.infoblox.com/app/account/overview';                                                                                            // infoblox
        urlstr[10] = 'https://casemanager.juniper.net/casemanager/#/cmdetails/{case}';                                                                               // juniper
        urlstr[11] = 'https://na4.salesforce.com/secur/login_portal.jsp?orgId=00D3000000001oV&portalId=06060000000D3gX';                                             // nimsoft
        urlstr[12] = 'https://portal.ntt.eu/angora-cp-gui-eu?action=view-tickets&id={case}';						                                                 // NTT
        //		          https://portal.ntt.eu/angora-cp-gui-eu?action=ticket-search&ticket-end-use-now=0&ticket-date-query-type=1&ticket-number=TK-EU-27257201
        urlstr[13] = '';                                                                                                                                             // palo alto
        urlstr[14] = '';                                                                                                                                             // Pulse Secure
        urlstr[15] = 'http://eservice.evercom.be/WorkOrder.do?woMode=viewWO&woID={case}';                                                                            // evercom
        urlstr[16] = 'https://support.ca.com/irj/portal/implsvccasedetails?issueNo={case}';                                                                          // CA
        urlstr[17] = 'https://support.riverbed.com/content/support/my_riverbed/cases_and_rmas/view_case.html?caseId=';                                               // Riverbed
        urlstr[18] = '';                                                                                                                                             // Pulse Secure
        //    urlstr[19] = 'https://eservice-businesspartner.al-enterprise.com/eservicerequest/start.swe?SWECmd=Start';                                                  // Alcatel-Lucent
        urlstr[19] = 'https://alcatel-lucent-enterprise.secure.force.com/servicerequest/TKT_ServiceRequest_MasterSearchSR?q={case}';                                 // Alcatel-Lucent Enterprise - ALE
        urlstr[20] = 'https://network.nuance.com/portal/server.pt/';                                                                                                 // Nuance
        urlstr[21] = 'https://mysymantec.force.com/customer/s/';                                                                                                     // Symantec
        urlstr[22] = 'https://genesyspartner.force.com/customercare/CustCarePEPremCases';                                                                            // Genesys
        //    urlstr[23] = 'https://support.openrainbow.com/hc/en-us/requests/{case}';                                                                                     // ALE Rainbow
        urlstr[24] = 'https://support.checkmk.com/servicedesk/customer/portal/2/{case}';                                                                             // Checkmk

    }
    if ( reftype === 'Vendor reference number / RMA' ) {
        urlstr[ 4] = 'https://ibpm.cisco.com/rma/home/?OrderNumber={case} ';                                                                                         // cisco
        urlstr[10] = 'https://casemanager.juniper.net/casemanager/#/rmadetails/{case}';                                                                              // juniper
    }

    if ( reftype === 'Vendor known error code' ) {
        urlstr[ 4] = 'https://bst.cloudapps.cisco.com/bugsearch/bug/{case}';                                                                                     // cisco
    }
}



function VendorWebSite() {
    var site = window.location.href;
    var vendor = '';
    if ( site.indexOf('.didata.') > -1 )          return '';
    if ( site.indexOf('.dimensiondata.') > -1 )   return '';
    if ( site.indexOf('.service-now.com') > -1 )  return '';
    if ( site.indexOf('.webex.com') > -1 )        return '';
    if ( site.indexOf('scram.client.') > -1 )     return '';
    if ( site.indexOf('eubebruphpbb') > -1 )      return '';
    if ( site.indexOf('meetings-eu.') > -1 )      return '';
    if ( site.indexOf('moveit.') > -1 )           return '';
    if ( site.indexOf('.cisco.com') > -1 )        return 'cisco';
    if ( site.indexOf('.juniper.net') > -1 )      return 'juniper';
    if ( site.indexOf('.emc.com') > -1 )          return 'emc';
    if ( site.indexOf('.infoblox.com') > -1 )     return 'infoblox';
    if ( site.indexOf('.checkpoint.com') > -1 )   return 'checkpoint';
    if ( site.indexOf('.juniper.net') > -1 )      return 'juniper';
    if ( site.indexOf('partner.force.com') > -1 ) return 'genesys';
    if ( site.indexOf('mysymantec.force.') > -1 ) return 'symantec';
    if ( site.indexOf('.salesforce.com') > -1 )   return 'nimsoft';
    if ( site.indexOf('.fortinet.com') > -1 )     return 'fortinet';
    if ( site.indexOf('.ntt.eu/') > -1 )          return 'ntt';
    if ( site.indexOf('.f5.com') > -1 )           return 'f5';
    if ( site.indexOf('.evercom.be') > -1 )       return 'evercom';
    if ( site.indexOf('.avaya.com') > -1 )        return 'avaya';
    if ( site.indexOf('.ca.com') > -1 )           return 'ca';
    if ( site.indexOf('.riverbed.com') > -1 )     return 'riverbed';
    if ( site.indexOf('.nuance.com') > -1 )       return 'nuance';
    if ( site.indexOf('al-enterprise.com') > -1 ) return 'alcatel-lucent';
    //    if ( site.indexOf('openrainbow.com') > -1 )   return 'rainbow';
    if ( site.indexOf('checkmk.com') > -1 )       return 'checkmk';
    return vendor;
}


