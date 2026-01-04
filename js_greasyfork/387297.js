// ==UserScript==
// @name         Embeddable Framework - Club Med
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Load the embeddable framework in a floating window in Microsoft Dynamics for the Club Med POC
// @author       You
// @resource     customCSS https://gist.githubusercontent.com/PierrickI3/fc870ccb2d630c67c5a6dd0a9c4f4e8c/raw/5095372059ad7df56116885b3de1a9ab39eeeb98/EmbbedableFrameworkDiv.css
// @match        https://genesys.crm.dynamics.com
// @match        https://cxouatfix.crm4.dynamics.com
// @include      https://genesys.crm.dynamics.com*
// @include      https://cxouatfix.crm4.dynamics.com*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/387297/Embeddable%20Framework%20-%20Club%20Med.user.js
// @updateURL https://update.greasyfork.org/scripts/387297/Embeddable%20Framework%20-%20Club%20Med.meta.js
// ==/UserScript==

// ***********************
// * Begin Configuration *
// ***********************

// PureCloud
var pureCloudEnvironment = "mypurecloud.de"; // Change this to .com, ie, .jp, etc. based on your PureCloud region
var localUrls = ["https://genesys.crm.dynamics.com", "https://home.dynamics.com", `https://apps.${pureCloudEnvironment}`]; // URL where this script is running. This is useful to allow this site to communicate with the Embeddable Framework
var width = "300px"; // Width of the floating window containing the embeddable framework
var height = "500px"; // Height of the floating window containing the embeddable framework

// Dynamics
var dynamicsEnvironment = "https://cxouat.crm4.dynamics.com";
var dynamicsLoginUrl = "https://login.microsoftonline.com/clubmed.com/oauth2/v2.0/token";
var dynamicsClientId = "c39a920e-21aa-494e-a6b8-9efc46d898b7";
var dynamicsClientSecret = "mntS48avzZI/zr+qVMNkNZsz7xErHkWr4p+w83BX43U=";
var dynamicsGrantType = "client_credentials";
var dynamicsScope = `${dynamicsEnvironment}/.default`;

var dynamicsPhoneCallUrl = `${dynamicsEnvironment}/api/data/v8.2/phonecalls`;

// List of colors used when changing statuses. You can find color names here: https://www.w3schools.com/colors/colors_names.asp
var iconColors = {
    onqueue: "aqua",
    available: "limegreen",
    busy: "red",
    away: "orange",
    break: "orange",
    meal: "orange",
    meeting: "red",
    training: "orange",
    outofoffice: "deeppink"
}

// *********************
// * End Configuration *
// *********************

// Add custom CSS to page
GM_addStyle(GM_getResourceText("customCSS"));

// Don't run this script on iframes
if (window.top != window.self) {
  return;
}
else {
  init();
}

// Add Embeddable Framework iFrame & button
function init() {
      console.log("Adding embeddable framework...");
      $("body").append(`
        <div class="fabs">
          <div class="chat" style="display: none;">
            <iframe id="purecloud" allow="camera *; microphone *; autoplay *" src="https://apps.${pureCloudEnvironment}/crm/embeddableFramework.html" style="border: 0; width: ${width}; height: ${height}">Your browser doesn't support iframes</iframe>
          </div>
          <a id="prime" class="fab"><i class="prime zmdi zmdi-comment-outline"></i></a>
        </div>
      `);
    hideChat();
}

$("#prime").click(function() {
  toggleFab();
});

//Toggle chat and links
function toggleFab() {
  $(".prime").toggleClass("zmdi-comment-outline");
  $(".prime").toggleClass("zmdi-close");
  $(".prime").toggleClass("is-active");
  $(".prime").toggleClass("is-visible");
  $("#prime").toggleClass("is-float");
  $(".chat").toggleClass("is-visible");
  $(".fab").toggleClass("is-visible");
  if ($(".chat").is(":visible")) {
      $(".chat").hide();
  } else {
      $(".chat").show();
  }
}

function hideChat() {
  $("#chat_converse").css("display", "none");
  $("#chat_body").css("display", "none");
  $("#chat_form").css("display", "none");
  $(".chat_login").css("display", "block");
  $(".chat_fullscreen_loader").css("display", "none");
  $("#chat_fullscreen").css("display", "none");
}

// Process messages received from framework.js
window.addEventListener("message", function (event) {
    console.log("Message received in TamperMonkey:", event);

    // If origin is not allowed, ignore the message
    if (!localUrls.includes(event.origin)) {
        return;
    }

    // User Action?
    if (event.data && event.data.eventName === 'UserAction' && event.data.body) {
        console.log('## new useraction event');
        console.log(event.data);

        var eventData = event.data.body;

        // Status or RoutingStatus?
        switch(eventData.category) {
            case 'routingStatus': {
                console.log("New routing status:", eventData.data);
                break;
            }
            case "status": {
                // User's status info
                console.log("User status:", eventData.data.status);
                setStatusIcon(eventData.data.status);
                break;
            }
            default: {
                // Ignore other categories
                break;
            }
        }
    }

    // Notification?
    else if (event.data && event.data.eventName === 'Notification' && event.data.body) {
        console.log('## new notification event');
        console.log(event.data);
        let eventInfo = event.data.body;
    }

    // Interaction?
    else if (event.data && event.data.eventName === 'Interaction' && event.data.body) {
        console.log('## new interaction event');
        console.log(event.data);
        let eventInfo = event.data.body;
        // Alerting? Show the frame
        if (eventInfo.data.state === "ALERTING") {
            if (!$(".chat").is(":visible")) {
                // Show window
                toggleFab();
            }
        }
        // Inbound interactions
        else if (!eventInfo.data.isDialer) {
            switch(eventInfo.data.state) {
                case "CONNECTED":
                case "INTERACTING":
                    // Popup contact
                    console.log("Popping up contact:", eventInfo.data.attributes);
                    Xrm.Utility.openEntityForm("contact", eventInfo.data.attributes.contactid, null, { openInNewWindow: false });
                    break;
                case "DISCONNECTED":
                    if (eventInfo.category !== "disconnect") {
                        return; //Only popup if the interaction just disconnected
                    }
                    console.log("=========== INTERACTION IS DISCONNECTED:", eventInfo.data);

                    var accountId = eventInfo.data.attributes.accountid;
                    var contactId = eventInfo.data.attributes.contactid;
                    var connectedDateTime = new Date(eventInfo.data.connectedTime).toLocaleString();
                    var endDateTime = new Date(eventInfo.data.endTime).toLocaleString();

                    var entityFormOptions = {}, formParameters = {};

                    entityFormOptions.entityName = "phonecall";

                    formParameters.cxo_genesys_callid = eventInfo.data.id;
                    formParameters.cxo_phonecall_motif = "6";
                    //formParameters["regardingobjectid_account@odata.bind"] = `/accounts(${accountId})`;
                    formParameters.phonenumber = eventInfo.data.ani;
                    formParameters.actualdurationminutes = eventInfo.data.interactionDurationSeconds > 0 ? Math.floor(eventInfo.data.interactionDurationSeconds/60) : 0;
                    formParameters.directioncode = false; // Inbound call
                    formParameters.cxo_routing_code = "2";
                    formParameters.cxo_phone_call_status = "1";
                    //formParameters["ownerid@odata.bind"] = "/systemusers(008CFAC9-2810-E911-A978-000D3A3950FE)";
                    //formParameters["cxo_agency_id_PhoneCall@odata.bind"] = "/cxo_agencies(cxo_agent_code='OPERA')";
                    formParameters.description = `Call from ${eventInfo.data.name} | ANI: ${eventInfo.data.ani} | Called Number: ${eventInfo.data.calledNumber} | End Time: ${endDateTime} | Flagged: ${eventInfo.data.flagged} | Is Callback? ${eventInfo.data.isCallback} | Is Chat? ${eventInfo.data.isChat} | Is CoBrowsing? ${eventInfo.data.isCoBrowsing} | Is Dialer? ${eventInfo.data.isDialer} | Is Email? ${eventInfo.data.isEmail} | Is Voicemail? ${eventInfo.data.isVoicemail} | Is Message? ${eventInfo.data.isMessage} | Recording State: ${eventInfo.data.recordingState}`;
                    formParameters.subject = `${eventInfo.data.name} - ${connectedDateTime}`;

                    console.log("Calling openForm");
                    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                        function (success) {
                            console.log(success);
                        },
                        function (error) {
                            console.log(error);
                        });
                    break;
                default:
                    console.log("Interaction state is:", eventInfo.data.state);
            }
        }
    }
});

function setStatusIcon(status) {
    console.log("Setting status icon to:", status);
    switch(status) {
        case "ON_QUEUE": {
            $(".fab").css("background-color", iconColors.onqueue);
            break;
        }
        case "AVAILABLE": {
            $(".fab").css("background-color", iconColors.available);
            break;
        }
        case "BUSY": {
            $(".fab").css("background-color", iconColors.busy);
            break;
        }
        case "AWAY": {
            $(".fab").css("background-color", iconColors.away);
            break;
        }
        case "BREAK": {
            $(".fab").css("background-color", iconColors.break);
            break;
        }
        case "MEAL": {
            $(".fab").css("background-color", iconColors.meal);
            break;
        }
        case "MEETING": {
            $(".fab").css("background-color", iconColors.meeting);
            break;
        }
        case "TRAINING": {
            $(".fab").css("background-color", iconColors.training);
            break;
        }
        case "OUT_OF_OFFICE": {
            $(".fab").css("background-color", iconColors.outofoffice);
            break;
        }
    }
}