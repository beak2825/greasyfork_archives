
// ==UserScript==
// @name         Rave Plug-in plus
// @version      2.4.9
// @description  Customized UI for Rave
// @author       zhiyin && Bruce Lu
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://rave.office.net
// @match        https://rave.office.net/*
// @match        https://rave.office.net/cases/*
// @match        https://servicedesk.microsoft.com/home#/customer/case/*
// @match        http://purussvr.fareast.corp.microsoft.com/PurusReview/ReviewDetails.aspx?ticket=*
// @namespace    https://greasyfork.org/en/scripts/416031/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416031/Rave%20Plug-in%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/416031/Rave%20Plug-in%20plus.meta.js
// ==/UserScript==


(function () {
  'use strict';
  var executed = false
  var lastPath = ""
  var lastUrlType = ""
  var isOnPremCase = false
  var soapTemplate = ''
  var timer



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
    var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

    return a.filter(function (item) {
      var type = typeof item;
      if (type in prims)
        return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
      else
        return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  }



  var executeOrDelayUntilConditionMeet = function (condition, callback, timeout) {
    if (!timeout) { timeout = 100 }
    setTimeout(function () {
      if (condition()) {
        callback();
      } else {
        executeOrDelayUntilConditionMeet(condition, callback);
      }
    }, timeout);
  }


  var getCurrentUrlType = function () {
    var path = window.location.pathname;
    if (path == '/' || path.startsWith('/cases/my')) {
      return 'MyCases'
    } else if (path.startsWith('/cases/unassigned')) {
      return 'UnassignedCases'
    } else {
      return 'Case'
    }
  }

  var showDialog = function (dialogObj = {
    title: 'Alert',
    content: 'Alert default content',
    size: '4',
    okText: 'OK'
  }) {
    var homeController = angular.element($('#raveMainApp')).data().$scope.homeController
    if (homeController) {
      homeController.modalDialogService.Open(dialogObj.size, dialogObj.title, dialogObj.content, dialogObj.okText)
    }
  }


  var review = function () {
    /* add timestamp to the head of each history reply item */
    var setHistoryItem = function (element) {
      var timeString = $(element).find('.chat-footer > .pull-right').first().text().trim()
      var time = Date.parse(timeString) || 0
      //var dateString = time.toLocaleDateString()
      $(element).before('<div class="menu-bar text-center" style="margin:0;height:auto"><h4>' + timeString + '</h4></div>')
    }
    var setCaseHistory = function () {
      $('case-history').find('[ng-repeat^="historyItem"]').each(function () {
        setHistoryItem(this)
      })
    }

    /* formate the breadcrumb menu */
    var reviewCase = function (showNewerFirst) {
      var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
      addGlobalStyle('.feedback-bar { display: none !important; }'); /*hide bottom float feedback bar*/
      addGlobalStyle('.absoluteLeftPane { display: none !important; }'); /*hide left float panel (customer profile, quick facts)*/
      addGlobalStyle('.absoluteRightPane { display: none !important; }'); /*hide right float panel*/
      addGlobalStyle('.floatingLeftPane { display: none !important; }'); /*hide left float panel (customer profile, quick facts)*/
      addGlobalStyle('#incorrect-user-div { display: none !important; }');
      addGlobalStyle('.chat-bubble-ViewMore { display: none !important; }');
      addGlobalStyle('.solutions { display: none !important; }');
      showNewerFirst ? caseController.ShowNewerFirstCaseHistory() : caseController.ShowOlderFirstCaseHistory()
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
        () => { }
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
      var mailArray = mails ? mails.split(';') : []
      var newMailArray = newMails ? newMails.split(';') : []
      return unique(mailArray.concat(newMailArray)).toString().replace(/,/g, ';');
    }
    var init = function () {
      executeOrDelayUntilConditionMeet(
        function () {
          return $('#compose-email').length && $('#switch-to-email').length
        },
        function () {
          var emailCustomerBtn = $('#switch-to-email')
          emailCustomerBtn.click(function () {
            $('#RaveEx-Soap').hide()
            $('#RaveEx-Load-Summary').hide()
            $('#RaveEx-Save-Summary').hide()
            if (!$('#RaveEx-InitialResponse').length) {
              $('#compose-email > div.panel-heading').append(`
              <button id="RaveEx-InitialResponse" class="btn btn-attach pull-right ng-scope" onclick="Javascript:RaveEx.initialResponse()">
                <span translate="" class="ng-scope">IR</span>
              </button>
              `)
            }
            $('#RaveEx-InitialResponse').show()
          })
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
        var contactName = caseController.Request.RequestData.UserFirstName + ' ' + caseController.Request.RequestData.UserLastName
        var title = caseController.appContext.SelectedRequest.RequestData.Title
        var description = caseController.appContext.SelectedRequest.RequestData.UserDescription
        var emailCc = caseController.EmailCc
        var subject = title ? title : description.slice(0, 100)
        var irTemplate = `
          <div>
            <span>
              Hello ${contactName},
              <br>
            </span>
            <div>
              <br>
            </div>
            <div>
              Thank you for contacting Microsoft Support. My name is ${ownerName}. &nbsp;I am the Support Professional who will be working with you on this Service Request. You may reach me using the contact information listed below, referencing the ${caseNumber}.
              <br>
            </div>
            <div>
              <br>
            </div>
            <div>
              If you have any questions or concerns, please let me know. 
              <br>
            </div>
            <div>
              <br>
            </div>
            <div>
              Best Regards,
            <br>
            </div>
            <span></span>
            <br>
          </div>`
        caseController.EmailCc = addEmail(emailCc, ownerEmail + ';' + tamEmail)
        caseController.EmailSubject ? null : (caseController.EmailSubject = subject)
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
          return $('#breadcrumb').length && $('button[ng-click^="caseController.EnableInternalNote"]').length && $('#compose-email').length
        },
        function () {
          var addInternalNoteBtn = $('button[ng-click^="caseController.EnableInternalNote"]')
          addInternalNoteBtn.click(function () {
            $('#RaveEx-InitialResponse').hide()
            if (!$('#RaveEx-Soap').length) {
              $('#compose-email > div.panel-heading').append(`
                <button id="RaveEx-Soap" class="btn btn-attach pull-right ng-scope"  onclick="Javascript:RaveEx.Soap()">
                  <span translate="" class="ng-scope">SOAP</span>
                </button>
              `)
            }
            $('#RaveEx-Soap').show()
            $('#RaveEx-Load-Summary').show()
            $('#RaveEx-Save-Summary').show()
          })

          addInternalNoteBtn.click()
        }
      )
    }
    var exec = function () {
      var emailComposeBox = $('[editor-manager="caseController.InternalNotesEditorManager"] div[contenteditable="true"]')
      if (emailComposeBox.text().trim() === '') {
        soapTemplate = `
          <div id='issue-description'>
            <h4>SCOPE</h4>
            <div>Issue Description: </div>
            <div>Business Impact: </div>
            <div>Expected Outcome: </div>
          </div>
          <div>===================================</div>
          <div id='resolution-steps'>
            <h4>ACTION PLAN</h4>
            <div>Case Status: </div>
            <div>Next Action: </div>
            <div>Next Contact: </div>
            <div>===================================</div>
            <h4>CASE SUMMARY</h4>
            <div>Environment: </div>
            <div>Troubleshooting: </div>
          </div>
          `
        emailComposeBox.first().html(soapTemplate)
      } else {
        showDialog({
          title: `SOAP Warning`,
          content: `You've already added content in the internal notes, if you want to add a SOAP template, please make sure it's empty`
        })
      }
    }
    return {
      'init': init,
      'exec': exec
    }
  }

  function convertTextToHTML(str, splitor = '\n') {
    const TITLES = ['SCOPE', 'RESOLUTION STEPS', 'ACTION PLAN', 'CASE SUMMARY']
    const htmlArray = str.split(splitor).map(element => {
      if (TITLES.indexOf(element) !== -1) {
        return `<h4>${element}</h4>`
      } else if (element) {
        return `<div>${element}</div>`
      } else {
        return `<br>`
      }
    });

    return htmlArray.join('')
  }

  var LoadSummary = function () {
    var init = function () {
      executeOrDelayUntilConditionMeet(
        function () {
          return $('#compose-email').length && $('div[ng-if^="caseController.RequestDetails"]').length
        },
        function () {
          if (!$('#RaveEx-Load-Summary').length) {
            $('#RaveEx-Save-Summary').before(`
            <button id="RaveEx-Load-Summary" class="btn btn-attach pull-right ng-scope"  onclick="RaveEx.loadSummary()">
                <span translate="" class="ng-scope">Load Summary</span>
            </button>
            `
            )
          }
        }
      )
    }

    var exec = function () {
      let summary = '';
      var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
      /* Copy summary to the emailComposeBox if existed */
      var issueDetails = caseController.RequestDetails.RequestDetailsData.IssueDetails;
      var resolutionSteps = caseController.RequestDetails.RequestDetailsData.ResolutionSteps;
      var internalNotesEditor = $('[editor-manager="caseController.InternalNotesEditorManager"] div[contenteditable="true"]').first()
      var isFormattedSummary = (issueDetails && issueDetails.contains('SCOPE')) || (resolutionSteps && issueDetails.contains('RESOLUTION STEPS'))
      if (internalNotesEditor.text().trim()) {
        showDialog({ title: 'Load Summary Warning', content: 'The internal note is not empty, please make sure it is empty before load summary!' })
        return
      }
      if (isFormattedSummary) {
        summary = `
          <div id='issue-description'>
            <div style="white-space: pre-wrap;">${convertTextToHTML(issueDetails)}</div>
          </div>
          <div>===================================</div>
          <div id='resolution-steps'>
            <div style="white-space: pre-wrap;">${convertTextToHTML(resolutionSteps)}</div>
          </div>
        `
      } else {
        summary = `
          <div id='issue-description'>
            <h4>SCOPE</h4>
            <div style="white-space: pre-wrap;">Issue Description: ${convertTextToHTML(issueDetails)}</div>
            <div>Business Impact: </div>
            <div>Expected Outcome: </div>
          </div>
          <div>===================================</div>
          <div id='resolution-steps'>
            <h4>RESOLUTION STEPS</h4>
            <div style="white-space: pre-wrap;">${convertTextToHTML(resolutionSteps)}</div>
          </div>
        `
      }
      internalNotesEditor.html(summary)
    }

    return {
      init,
      exec
    }
  }


  var SaveToSummary = function () {
    var init = function () {
      executeOrDelayUntilConditionMeet(
        function () {
          return $('#breadcrumb').length && $('#compose-email button[data-automation-id="SaveInternalNote"]').length
        },
        function () {
          if (!$('#RaveEx-Save-Summary').length) {
            $('#compose-email > div.panel-heading').append(`
            <div class="button-container btn drop-button pull-right" tabindex="0" id="RaveEx-Save-Summary" >
              <span translate="" class="ng-scope">Save to Summary</span>
              <label class="switch save-as-summary-switch expand-all-messages-switch">
                  <input type="checkbox" aria-label="Save to Summary" checked/>
                  <span class="slider expand-all-messages-slider save-as-summary-slider"></span>
              </label>
            </div>
            `
            )

            var internalNoteSaveBtn = $('#compose-email button[data-automation-id="SaveInternalNote"]')
            internalNoteSaveBtn.on('click', function () {
              var saveToSummarySwitch = $('#RaveEx-Save-Summary > label > input[type=checkbox]')
              if (saveToSummarySwitch[0].checked) {
                var internalNotes = $('#compose-email > div.panel-body .form-control.composeBox')
                var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
                var issueDetails = internalNotes.children('#issue-description')[0] && internalNotes.children('#issue-description')[0].innerText;
                var resolutionSteps = internalNotes.children('#resolution-steps')[0] && internalNotes.children('#resolution-steps')[0].innerText;
                if (issueDetails && resolutionSteps) {
                  caseController.RequestDetails.RequestDetailsData.IssueDetails = issueDetails;
                  caseController.RequestDetails.RequestDetailsData.ResolutionSteps = resolutionSteps;
                } else if (internalNotes.text().trim() !== '') {
                  showDialog({ title: 'Save To Summary Warning', content: 'The internal note is not a SOAP template, please using the SOAP template!' })
                }
              }
            })
          }

        }
      )
    }

    return {
      init
    }
  }

  var tagReminder = function () {
    var init = function () {
      executeOrDelayUntilConditionMeet(
        function () {
          return $('#summary-tags').length
        },
        function () {
          if (!$('#RaveEx-Tag-Reminder').length) {
            var hasTag = function () {
              var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
              var tagsArray = caseController.Tags;
              var hasTag = false;
              hasTag = tagsArray && tagsArray.some(function (tag) {
                return tag.text !== ''
              })
              return hasTag
            }

            if (!hasTag()) {
              $('#editorSection > div.form-group.dao-content-margin').prepend(`
                <div id="RaveEx-Tag-Reminder" class="alert alert-danger">
                  You don't have "Tags" set. Please go to
                  <a class="cursor-pointer standout" onclick="RaveEx.switchToSummary()">
                    Summary Tab
                  </a> ->Tags.
                </div>`)

              function toggleTagReminder() {
                /* has reminder but has no tags, pass*/
                var reminderDisplay = $('#RaveEx-Tag-Reminder').css('display')
                if (reminderDisplay === 'block' && !hasTag()) {
                  return
                } else if (reminderDisplay === 'none' && !hasTag()) {
                  /** no reminder and no tags, show reminder */
                  $('#RaveEx-Tag-Reminder').show()
                } else if (reminderDisplay === 'block' && hasTag()) {
                  $('#RaveEx-Tag-Reminder').hide()
                }
              }

              $('#summary-tags > div > div > input').on('blur', function () {
                setTimeout(toggleTagReminder, 1000)
              })
            }
          }
        }
      )
    }

    var exec = function () {
      var summaryTab = $('#summary-tab')
      var summaryTags = $('#summary-tags')
      if (summaryTab.attr('aria-expanded') === 'true') return
      summaryTab.on('click', function () {
        setTimeout(() => {
          summaryTags[0].scrollIntoView(false)
        }, 500)
      })
      summaryTab[0].click()
    }

    return {
      init,
      exec
    }
  }

  var openSDTicket = function () {
    var init = function () {
      executeOrDelayUntilConditionMeet(
        function () {
          return $('rct-case-summary label:contains("Secondary ticket")').length
        },
        function () {
          if (!$('#RaveEx-OpenSDTicket').length) {
            $('rct-case-summary label:contains("Secondary ticket")').after(`<button input type="button" id="RaveEx-OpenSDTicket" class="align-right btn btn-success" onclick="RaveEx.openSD()"><span translate="" class="ng-scope">Open</span></button>`)
          }
        }
      )
    }

    var exec = function (tag) {
      var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
      var sdTicket = caseController.Request.RequestData.SecondaryTicketNumber
      window.open('https://servicedesk.microsoft.com/home#/customer/case/' + sdTicket)
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
        function () {
          if (!$('#RaveEx-OpenCasenumber').length) {
            $('rct-case-summary label:contains("Case number")').after(`<button input type="button" id="RaveEx-OpenCasenumber" class="align-right btn btn-success" onclick="RaveEx.openCase()"><span translate="" class="ng-scope">Purus</span></button>`)
          } 1
        }
      )
    }

    var exec = function (tag) {
      var caseController = angular.element($('#breadcrumb')).data().$scope.caseController
      var Casenumber = caseController.Request.RequestData.ParatureTicketNumber
      window.open('http://purussvr.fareast.corp.microsoft.com/PurusReview/CaseReview.aspx?region=ASIA&ticket=' + Casenumber)
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
        function () {
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
        function () {
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
          updateCaseStatus().init()
          setResolutionDefault().init()
          openSDTicket().init()
          openCasenumber().init()
          tagReminder().init()
          Soap().init()
          LoadSummary().init()
          SaveToSummary().init()
          initialResponse().init()
        }
        break;
      default:
    }
  }


  window.RaveEx = {
    "review": review(true).exec,
    "initialResponse": initialResponse().exec,
    "Soap": Soap().exec,
    "openSD": openSDTicket().exec,
    "openCase": openCasenumber().exec,
    "switchToSummary": tagReminder().exec,
    "loadSummary": LoadSummary().exec
  };

  timer = setInterval(appInit, 3000);
})();
