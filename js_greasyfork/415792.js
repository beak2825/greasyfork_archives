// ==UserScript==
// @name         Rave Plug-in
// @version      2.5.1
// Change History: Hide MCE, update SOAP Template. Based on Zhiyin's 2.4.0.
// Change History: update new Purus URL
// @description  Customized UI for Rave
// @author       zhiyin
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://rave.office.net
// @match        https://rave.office.net/*
// @match        https://rave.office.net/cases/*
// @match        https://servicedesk.microsoft.com/home#/customer/case/*
// @match        http://purussvr.fareast.corp.microsoft.com/PurusReview/ReviewDetails.aspx?ticket=*
// @grant        none
// @namespace    https://greasyfork.org/users/703052
// @downloadURL https://update.greasyfork.org/scripts/415792/Rave%20Plug-in.user.js
// @updateURL https://update.greasyfork.org/scripts/415792/Rave%20Plug-in.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //debugger;
    var NAME = 'RaveEx'
    var enabled = false
    var executed = false
    var tempHistoryItemDate = Date.MinValue
    var lastPath = ""
    var lastUrlType = ""
    var isOnPremCase = false

    var setFeature = function (featureName, enabled) {
        setCookie (NAME+'_'+featureName, enabled, 365)
    }
    var getFeature = function (featureName) {
        getCookie (NAME+'_'+featureName)
    }
    var getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
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

    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    var addGlobalStyle = function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    var unique = function (a) {
        var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

        return a.filter(function(item) {
            var type = typeof item;
            if(type in prims)
                return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
            else
                return objs.indexOf(item) >= 0 ? false : objs.push(item);
        });
    }
    var setReactNativeValue = function(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}

    var executeOrDelayUntilConditionMeet = function (condition, callback, timeout) {
        if(!timeout) { timeout = 100 }
        setTimeout(function(){
            if (condition()) {
                callback();
            }else {
                executeOrDelayUntilConditionMeet(condition, callback);
            }
        }, timeout);
    }
    var executeInterval = function (callback, timeout) {
        if(!timeout) { timeout = 1000 }
        setInterval(function(){
            callback();
        }, timeout);
    }
    var getCurrentUrlType = function () {
        var path = window.location.pathname;
        if (path == '/' || path.startsWith('/cases/my')) {
            return 'MyCases'
        } else if (path.startsWith('/cases/unassigned')) {
            return 'UnassignedCases'
        } else if (path.startsWith('/teams/ShanghaiSharePointTeam/Lists/Case%20Follow%20Up/NewForm.aspx')) {
            return 'MCE'
        } else {
            return 'Case'
        }
    }
    var review = function () {
        var setHistoryItem = function (element) {
            var timeString = $(element).find('.chat-footer > .pull-right').first().text().trim()
            var time = Date.parse(timeString) || 0
            //var dateString = time.toLocaleDateString()
            $(element).before('<div class="menu-bar text-center" style="margin:0;height:auto"><h4>'+timeString+'</h4></div>')
        }
        var setCaseHistory = function () {
            $('case-history').find('[ng-repeat^="historyItem"]').each(function () {
                setHistoryItem(this)
            })
        }
        var reviewCase = function (showNewerFirst) {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            addGlobalStyle('.feedback-bar { display: none !important; }'); /*hide bottom float feedback bar*/
            addGlobalStyle('.absoluteLeftPane { display: none !important; }'); /*hide left float panel (customer profile, quick facts)*/
            addGlobalStyle('.absoluteRightPane { display: none !important; }'); /*hide right float panel*/
            addGlobalStyle('.floatingLeftPane { display: none !important; }'); /*hide left float panel (customer profile, quick facts)*/
            addGlobalStyle('#incorrect-user-div { display: none !important; }');
            addGlobalStyle('.chat-bubble-ViewMore { display: none !important; }');
            addGlobalStyle('.solutions { display: none !important; }');
            showNewerFirst? caseController.ShowNewerFirstCaseHistory(): caseController.ShowOlderFirstCaseHistory()
            //caseController.ExpandAllMessages()
            if (!caseController.ShowExpandedMessages) { caseController.ToggleExpandAllMessagesButton() }
            $('[ng-if^="comController.CommunicationData.ToEmailAddresses"]').hide()
            $('[ng-if^="comController.CommunicationData.CcEmailAddresses"]').hide()
            $('[ng-if^="comController.CommunicationData.Subject"]').hide()
            /*hide case attachments*/
            $('[ng-if^="caseController.CaseAttachments"]').hide()
            $('[ng-repeat^="attachment in caseController.CaseAttachments"]').hide()
            addGlobalStyle('.sync-attachment-btn { display: none !important; }');
            $('[ng-if^="comController.ShowAttachments"]').hide()
            $('[ng-repeat^="attachment in comController.CommunicationData.Attachments"]').hide()
            $('#editorSection').hide()
            $('#rightPane').hide()
            $('#centerPane').removeClass('col-xs-8').addClass('col-xs-10')
            $('.attachment-container').hide()
            if (!executed) {
                setCaseHistory()
                executed = true
            }
        }
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('.menu-bar').length
                },
            )
        }
        var exec = function (showNewerFirst) {
            if (lastUrlType == 'Case') {
                reviewCase(showNewerFirst)
            }
        }
        return {
            'init': init,
            'exec': exec
        }
    }

 var initialResponse = function () {
        var addEmail = function (mails, newMails) {
            var mailAaray = mails ? mails.split(';') : []
            var newMailArray = newMails ? newMails.split(';') : []
            return unique(mailAaray.concat(newMailArray)).toString().replace(/,/g, ';');
        }
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#compose-email') && $('#compose-email').length
                },
                function(){
                    if (!$('#RaveEx-InitialResponse').length) {
                        $('#compose-email > div.panel-heading').append(`<button id="RaveEx-InitialResponse" class="btn btn-attach pull-right ng-scope hidden" onclick="Javascript:RaveEx.initialResponse()"><span translate="" class="ng-scope">IR</span></button><style>.ng-valid-maxlength #RaveEx-InitialResponse {display: block !important;}</style>`)
                    }
                }
            )
        }
        var exec = function () {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            if (!caseController.IsAddingInternalNote) {
                if (!caseController.IsEmailCc) {
                    caseController.ShowEmailCc()
                }
                var ownerName = caseController.AgentInfo.FullName
                var ownerEmail = caseController.AgentInfo.PartnerData.Email
                var tamEmail = caseController.TAMEmail
                var caseNumber = caseController.DefaultTicketSubject
                var contactName = caseController.Request.RequestData.UserFirstName+' '+caseController.Request.RequestData.UserLastName
                var title = caseController.appContext.SelectedRequest.RequestData.Title
                var description = caseController.appContext.SelectedRequest.RequestData.UserDescription
                var emailCc = caseController.EmailCc
                var subject = title ? title : description.slice(0,100)
                var irTemplate = '<div><span>Hello '+contactName+',<br></span><div><br></div><div>Thank you for contacting Microsoft Support. My name is '+ownerName+'. &nbsp;I am the Support Professional who will be working with you on this Service Request. You may reach me using the contact information listed below, referencing the '+caseNumber+'.<br></div><div><br></div><div>If you have any questions or concerns, please let me know. <br></div><div><br></div><div>Best Regards,<br></div><span></span><br></div>'
                caseController.EmailCc = addEmail(emailCc, ownerEmail+';'+tamEmail)
                caseController.EmailSubject ? null : (caseController.EmailSubject = subject)
                //$('#emailComposeBox').prepend(irTemplate)
                $('[editor-manager="caseController.EmailEditorManager"] div[contenteditable="true"]').first().prepend(irTemplate)
            }
        }
        return {
            'init': init,
            'exec': exec
        }
    }
     var Soap = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#compose-email') && $('#compose-email').length
                },
                function(){
                    if (!$('#RaveEx-Soap').length) {
                        $('#compose-email > div.panel-heading').append(`<button id="RaveEx-Soap" class="btn btn-attach pull-right ng-scope"  onclick="Javascript:RaveEx.Soap()"><span translate="" class="ng-scope">SOAP</span></button><style>.ng-valid-maxlength #RaveEx-Soap {display:none;}</style>`)
                    }
                }
            )
        }
        var exec = function () {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
                var blank = ""
                var irTemplate = '<div><span>Problem Description '+ blank + '</span><div></div><div>========================'+ blank +'<br></span><div><br></div><div>Environment and Configuration'+blank+ '</span><div></div><div>========================'+ blank+'<br></div><div><br></div><div>Troubleshooting and Analysis'+blank+ '</span><div></div><div>========================'+ blank+'<br></div><div><br></div><div>Next Plan'+blank+ '</span><div></div><div>========================'+ blank
                //$('#emailComposeBox').prepend(irTemplate)
                $('[editor-manager="caseController.InternalNotesEditorManager"] div[contenteditable="true"]').first().prepend(irTemplate)
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var FTS = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#compose-email') && $('#compose-email').length
                },
                function(){
                    if (!$('#RaveEx-FTS').length) {
                        $('#compose-email > div.panel-heading').append(`<button id="RaveEx-FTS" class="btn btn-attach pull-right ng-scope" onclick="Javascript:RaveEx.FTS()"><span translate="" class="ng-scope">FTS</span></button><style>.ng-valid-maxlength #RaveEx-FTS {display:none;}</style>`)
                    }
                }
            )
        }
        var exec = function () {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
                var blank = ":"
                var kong = " "
                var irTemplate = '<div><span>+++++++++++++++++++++++++++++++'+ kong +'</span><div></div><div>Customer Contact'+ kong +'</span><div></div><div>Handoff type: Warm/Callback/POC'+kong+'</span><div></div><div>+++++++++++++++++++++++++++++++'+kong+'<br></div><div><br></div><div>Case Summary'+blank+'<br></div><div><br></div><div>Plan'+blank+'<br></div><div><br></div><div>Actions on Microsoft'+blank+'<br></div><div><br></div><div>Actions on Customer'+blank
                //$('#emailComposeBox').prepend(irTemplate)
                 $('[editor-manager="caseController.InternalNotesEditorManager"] div[contenteditable="true"]').first().prepend(irTemplate)
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var laborReminder = function () {
        var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
        var historyController = angular.element($('[ng-if^="historyController.showFullHistory"]')).data().$scope.historyController
        var ownerId = historyController.appContext.PartnerData.PartnerId
        }
    var openSDTicket = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('rct-case-summary label:contains("Secondary ticket")').length
                },
                function(){
                    if (!$('#RaveEx-OpenSDTicket').length) {
                        $('rct-case-summary label:contains("Secondary ticket")').after(`<button input type="button" id="RaveEx-OpenSDTicket" class="align-right btn btn-success" onclick="RaveEx.openSD()"><span translate="" class="ng-scope">Open</span></button>`)
                    }
                }
            )
        }
        var exec = function (tag) {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            var sdTicket = caseController.Request.RequestData.SecondaryTicketNumber
            window.open('https://servicedesk.microsoft.com/home#/customer/case/'+sdTicket)
        }
        return {
            'init': init,
            'exec': exec
        }
    }

    var openCasenumber = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('rct-case-summary label:contains("Case number")').length
                },
                function(){
                    if (!$('#RaveEx-OpenCasenumber').length) {
                        $('rct-case-summary label:contains("Case number")').after(`<button input type="button" id="RaveEx-OpenCasenumber" class="align-right btn btn-success" onclick="RaveEx.openCase()"><span translate="" class="ng-scope">Purus</span></button>`)
                    }1
                }
            )
        }
        var exec = function (tag) {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            var Casenumber = caseController.Request.RequestData.ParatureTicketNumber
            window.open('http://purussvr.fareast.corp.microsoft.com/PurusReview/CaseReview.aspx?region=ASIA&ticket='+Casenumber)
        }
        return {
            'init': init,
            'exec': exec
        }
    }

    var updateCaseStatus = function () {
        var init = function () {
            /*add case internal status monitor*/
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#case-internal-status select > option') && $('#case-internal-status select > option').length
                },
                function(){
                    $('#case-internal-status select').on('change', function (e) { exec() })
                }
            )
        }
        var exec = function () {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            caseController.UpdateInternalState()
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var setResolutionDefault = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('select[name="resolution"]').length
                },
                function(){
                    $('select[name="resolution"]').on('change', function (e) { exec() })
                }
            )
        }
        var exec = function () {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            var resolution = caseController.RequestDetails.RequestDetailsData.Resolution
            isOnPremCase = caseController.IsOnPremCase
            if (resolution) {
                caseController.RequestDetails.RequestDetailsData.ContactOutcome = 'Contacted'
                caseController.RequestDetails.RequestDetailsData.ResolutionOutcome = 'Customer'
                caseController.AlchemyProposedSolutionHelp = false
                //submitMCE().init()
                if (isOnPremCase) {
                    caseController.RequestDetails.RequestDetailsData.CaseType = "ReactiveIncident"
                    caseController.RequestDetails.RequestDetailsData.IssueType = "TechnicalIssue"
                }
            }
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var submitMCE = function () {
        var init = function () {
            if (!$('#Rave-SubmitMCE').length) {
                $('select[name="resolution"]').parent().after(`<div id="Rave-SubmitMCE" class="col-xs-2 col-sm-2"><button class="align-right btn btn-success full-width" onclick="RaveEx.MCE()"><span translate="" class="ng-scope">Submit MCE</span></button></div>`)
            }
        }
        var exec = function () {
            var mceJson = {}
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            mceJson.caseId = caseController.Request.RequestData.ParatureTicketNumber
            mceJson.cxName = caseController.Request.RequestData.UserFirstName+' '+caseController.Request.RequestData.UserLastName
            mceJson.cxPhone = caseController.Request.RequestData.UserPhone
            mceJson.cxEmail = caseController.Request.RequestData.UserEmail
            mceJson.cxRealName = caseController.Request.RequestData.UserFirstName+' '+caseController.Request.RequestData.UserLastName
            mceJson.caseDescription = caseController.RequestDetails.RequestDetailsData.IssueDetails
            mceJson.resolution = caseController.RequestDetails.RequestDetailsData.Resolution
            mceJson.callingCountry = ""
            mceJson.team = "Exchange"
            var mceWindow = window.open("https://microsoft.sharepoint.com/teams/EXO_Premier/Lists/Closure%20Follow%20Up/NewForm.aspx", JSON.stringify(mceJson))
            }
        return {
            'init': init,
            'exec': exec
        }
    }
    var fillMCE = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('.ReactClientForm-Root').length
                },
                function(){
                    exec()
                }
            )
        }
        var exec = function () {
            var mceJson = JSON.parse(window.name)
            setReactNativeValue($('[aria-label^="Title Required Field"]')[0], mceJson.caseId)
            setReactNativeValue($('[aria-label^="Cu-Name"]')[0], mceJson.cxName)
            setReactNativeValue($('[aria-label^="Cu-Phone"]')[0], mceJson.cxPhone)
            setReactNativeValue($('[aria-label^="Cu-Email"]')[0], mceJson.cxEmail)
            setReactNativeValue($('textarea[aria-label^="Actual Customer Name Required Field"]')[0], mceJson.cxRealName)
            setReactNativeValue($('textarea[aria-label^="Case Description"]')[0], mceJson.caseDescription)
            //mceJson.resolution == 'Unresolved' ? setReactNativeValue($('[aria-label^="Case Resolution Required Field"]')[0], 'Not resolved') : setReactNativeValue($('[aria-label^="Case Resolution Required Field"]')[0], 'MS Resolved')
            //setReactNativeValue($('input:radio[value="70-90 VSAT"]')[0], 'checked')
            //setReactNativeValue($('input:radio[value="No"]')[0], mceJson.caseId)
            //setReactNativeValue($('input:radio[value="SEA"]')[0], mceJson.caseId)
            //setReactNativeValue($('[aria-label^="Team Required Field"]')[0], mceJson.team)
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var skipReInit = function () {
        var skip = false
        var pathChanged = false
        var currentPath = window.location.pathname;
        var urlTypeChanged = false
        var currentUrlType = getCurrentUrlType();
        if (!lastPath || lastPath != currentPath) {
            pathChanged = true
            lastPath = currentPath;
        }
        if (!lastUrlType || lastUrlType != currentUrlType) {
            urlTypeChanged = true
            lastUrlType = currentUrlType;
        }

        switch (currentUrlType) {
            case 'MyCases':
                skip = !urlTypeChanged
                break;
            case 'Case':
                skip = !pathChanged
                break;
            case 'MCE':
                skip = !urlTypeChanged
                break;
            default:
        }
        return skip
    }
    var appInit = function () {
        switch (getCurrentUrlType()) {
            case 'MyCases':
                break;
            case 'Case':
                if (!skipReInit()) {
                    review().init()
                    initialResponse().init()
                    updateCaseStatus().init()
                    setResolutionDefault().init()
                    openSDTicket().init()
                    openCasenumber().init()
                    FTS().init()
                    Soap().init()
                }
                break;
            case 'MCE':
                break;
            default:
        }
    }
    window.RaveEx = {
        "review": review().exec,
        "initialResponse": initialResponse().exec,
        "MCE": submitMCE().exec,
        "Soap":Soap().exec,
        "FTS":FTS().exec,
        "openSD": openSDTicket().exec,
        "openCase":openCasenumber().exec
    };
    if (getCurrentUrlType() == 'MCE') {
        fillMCE().init()
    } else {
        setInterval(appInit, 3000);
    }

    function myFunction() {
            function getClass(RaveEx){
	if (document.getElementsByClassName) {

		return document.getElementsByClassName("RaveEx");
	}else{

		var results = new Array();
		var elem = document.getElementsByTagName("modality-sm vertical-align-3 ng-scope");
		for (var i = 0; i < elem.length; i++) {
			if (elem[i].className.indexOf("RaveEx") != -1) {
				results[results.length] = elem[i];
			}
		}
		return results;
	}
}
        alert("我是一个警告框！");
    }
})();