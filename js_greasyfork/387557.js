// ==UserScript==
// @name         RaveEx
// @version      1.3.0
// @description  Customized UI for Rave
// @author       leqin
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://rave.office.net
// @match        https://rave.office.net/*
// @match        https://rave.office.net/cases/*
// @match        https://microsoftapc.sharepoint.com/teams/ShanghaiSharePointTeam/Lists/Case%20Follow%20Up/NewForm.aspx
// @grant        none
// @namespace    https://greasyfork.org/users/318347
// @downloadURL https://update.greasyfork.org/scripts/387557/RaveEx.user.js
// @updateURL https://update.greasyfork.org/scripts/387557/RaveEx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //debugger;
    alert("RaveEx tampermonkey script has been retired. Please contact author for updated version.");
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
                function(){
                    if (!$('#RaveEx-Review').length) {
                        $('.menu-bar').append(`<div id="RaveEx-Review" class="dropdown filter-dropdown" style="width:340px"><div class="button-container"><button onclick="RaveEx.review(false)" class="drop-button btn btn-success"><span class="ng-scope">*** Older First</span></button><button class="drop-button btn btn-success"><span class="ng-scope">RaveEx: Review</span></button><button onclick="RaveEx.review(true)" class="drop-button btn btn-success"><span class="ng-scope">Newer First ***</span></button></div></div>`)
                    }
                }
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
                        $('#compose-email > div.panel-heading').append(`<button id="RaveEx-InitialResponse" class="btn btn-attach pull-right ng-scope hidden" onclick="Javascript:RaveEx.initialResponse()"><span translate="" class="ng-scope">RaveEx: Initial Response</span></button><style>.ng-valid-maxlength #RaveEx-InitialResponse {display: block !important;}</style>`)
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
                var ownerEmail = caseController.AgentInfo.PartnerData.Email+";"
                var tamEmail = caseController.TAMEmail ? caseController.TAMEmail+";" : ""
                var bamEmail = caseController.BAMEmail ? caseController.BAMEmail+";" : ""
                var caseNumber = caseController.DefaultTicketSubject
                var contactName = caseController.Request.RequestData.UserFirstName+' '+caseController.Request.RequestData.UserLastName
                var title = caseController.appContext.SelectedRequest.RequestData.Title
                var description = caseController.appContext.SelectedRequest.RequestData.UserDescription
                var emailCc = caseController.EmailCc
                var subject = title ? title : description.slice(0,100)
                var irTemplate = '<div><span>Hello '+contactName+',<br></span><div><br></div><div>Thank you for contacting Microsoft Support. My name is '+ownerName+'. &nbsp;I am the Support Professional who will be working with you on this Service Request. You may reach me using the contact information listed below, referencing the '+caseNumber+'.<br></div><div><br></div><div>If you have any questions or concerns, please let me know. <br></div><div><br></div><div>Best Regards,<br></div><span></span><br></div>'
                caseController.EmailCc = addEmail(emailCc, ownerEmail)
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
                        $('rct-case-summary label:contains("Secondary ticket")').after(`<button id="RaveEx-OpenSDTicket" class="align-right btn btn-success" onclick="RaveEx.openSD()"><span translate="" class="ng-scope">Open</span></button>`)
                    }
                }
            )
        }
        var exec = function (tag) {
            var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
            var sdTicket = caseController.Request.RequestData.SecondaryTicketNumber
            window.open('https://servicedesk.microsoft.com/#/customer/case/'+sdTicket)
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
                submitMCE().init()
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
                $('select[name="resolution"]').parent().parent().after(`<div id="Rave-SubmitMCE" class="col-xs-2 col-sm-2"><button class="align-right btn btn-success full-width" onclick="RaveEx.MCE()"><span translate="" class="ng-scope">Submit MCE</span></button></div>`)
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
            mceJson.team = "SharePoint"
            var mceWindow = window.open("https://microsoftapc.sharepoint.com/teams/ShanghaiSharePointTeam/Lists/Case%20Follow%20Up/NewForm.aspx", JSON.stringify(mceJson))
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
            setReactNativeValue($('[aria-label^="Title,"]')[0], mceJson.caseId)
            setReactNativeValue($('[aria-label^="Cu-Name"]')[0], mceJson.cxName)
            setReactNativeValue($('[aria-label^="Cu-Phone"]')[0], mceJson.cxPhone)
            setReactNativeValue($('[aria-label^="Cu-Email"]')[0], mceJson.cxEmail)
            setReactNativeValue($('textarea[aria-label^="Actual Customer Name"]')[0], mceJson.cxRealName)
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
        "openSD": openSDTicket().exec
    };
    if (getCurrentUrlType() == 'MCE') {
        fillMCE().init()
    } else {
        setInterval(appInit, 3000);
    }


})();