// ==UserScript==
// @name        Metso Desk helper
// @description Desk helper
// @namespace   https://hclmt.service-now.com/
// @match       https://hclmt.service-now.com/*
// @match       https://hclMetsoqa.service-now.com/*
// @version     2.4
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @charset "utf-8"
// @downloadURL https://update.greasyfork.org/scripts/390856/Metso%20Desk%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390856/Metso%20Desk%20helper.meta.js
// ==/UserScript==
//
//
// Own name, team and signature to be used in messages sent via Metso Environment.

var CompanyVal = 'Default Value';

// If recipient set, when emailing only that person, will auto-use the email below

// General settings

// Delay in seconds for automatically refreshing ticket lists. E.g. 3 minutes: 180
var refreshRateSeconds          = 120;

// Default assignment group for new tickets and to know when a ticket is in "own" queue
var defaultAssignmentGroup      = 'METSO-HCL-Swedish-SD';

// Default assigned to for new tickets
// var defaultAssignedTo           = ownName;

// When assigning a ticket to provider, the provider notes will be auto-filled with below if not empty
var defaultMessageToProvider    = 'Kindly assist the user.';

var defaultNoteBaswareAuth      = 'Assigning Basware authorization ticket to TCS Service Desk with appropriate classes as per dispatch rules.';

var defaultNotePDMLinkKey       = 'Assigning PDMLink ticket from service manager / key user to PDMLink HIAB Support as per dispatch rules.';

var assignHRTicketFIMessage     = 'Assigning HR ticket to ITCOORDINATOR_FI as per Tero Laaksonen\'s instructions.';

var assignDriveFolderMessage    = "Assigning drive mapping / folder access related ticket to Onsite as per Tero Laaksonen's instructions.";

// Default close code (leave empty to disable)
var defaultCloseCode            = 'Solved (Permanently)';
var defaultCloseNotesFI            = 'Hei,\n\nTämä viesti on vahvistus työpyyntönne ratkaisusta.\n\nRatkaisu: \n\nKiitos, että käytitte Metso IT Service Deskin palveluita.';
var defaultCloseNotesSE         = 'Hej,\n\nVill meddela att ditt ärende nu är löst och kommer att stängas.\n\nLösning: \n\nTack för att du kontaktat Metso IT Service Desk.';
var defaultCloseNotesEN         = 'Hi,\n\nThis is a message to inform you that your incident has been resolved\n\nSolution: \n\nThank you for contacting Metso IT Service Desk.';

var ServerCloseNotesEN         = 'Dear user, \n\nThis message is to confirm you that your request at Metso Service Desk has been resolved. \n\nSolution: No responsible person/group could be located and no other incidents have been raised regarding device hence closing the ticket as per process. \n\nThank you for using Metso Service Desk.';

var threeSdefaultCloseNotesEN         = "Dear user, \n \nThis message is to confirm you that your Incident at Service Desk has been resolved. \n \nSolution:  No reply from the user to emails (3 sent) and phone calls. Putting this case in closed status. Please be advised that you can reopen the case within 7 days or contact us to open a new ticket for further assistance. \n \nThank you for using Metso Service Desk.";
var threeSdefaultCloseNotesFI         = "Hei,\n\nTämä viesti on vahvistus työpyyntönne sulkemisesta. \n\nRatkaisu: Olemme sulkeneet työpyyntönne koska emme ole saaneet vastausta yhteydenottoihimme puhelimella / sähköpostitse (3 yritystä). Jos tarvitsette vielä apua tässä asiassa voitte avata uudelleen työnpyynnön seitsemän (7) päivän sisällä sulkemisesta. Voitte myös ottaa yhteyttä meihin avataksenne uuden työpyynnön ongelmaan liittyen. \n\nKiitos, että käytitte Metso Service Deskin palveluita.";
var threeSdefaultCloseNotesSE         = "Vill meddela att ditt ärende kommer att stängas. \nLösning:  Då vi inte fått något svar efter 3 kontaktförsök via E-post och telefon kommer ärendet stängas.  Ärendet går att återöppna inom 7 dagar. Du kan också kontakta oss så öppnar vi ett nytt ärende. \n\nTack för att du kontaktat Metso Service Desk.";

var SAPpwCloseNotesEN         = 'Dear user,  \n\nThis message is to confirm you that your request at Metso Service Desk has been resolved. \n\nSolution: SAP password reset and sent to the user  \n\nThank you for using Metso Service Desk.';
var SAPpwCloseNotesFI         = 'Hei,\n\nTämä viesti on vahvistus työpyyntönne ratkaisusta.\n\nRatkaisu: Uusi SAP salasana lähetetty käyttäjälle. \n\nKiitos, että käytitte Metso Service Deskin palveluita.';
var SAPpwCloseNotesSE         = 'Hej,\n\nVill meddela att ditt ärende nu är löst och kommer att stängas.\n\nLösning: Skickade ett nyt SAP lösenord till användaren. \n\nTack för att du kontaktat Metso Service Desk.';

// Default AUF reply notes
var defaultEnReply                = 'Hi,\n\n\n\nBest Regards\n\nAlex\nOneDesk Support Team';
var defaultSeReply                = 'Hej,\n\n\n\nMed Vänliga Hälsningar\n\nAlex\nOneDesk Support Team';
var defaultFiReply                = 'Hei,\n\n\n\nYstävällisin Terveisin\n\nAlex\nOneDesk Support Team';

// Texts to fill in based on specified triggers while creating a new ticket
var trigger1ShortDescription    = 'AD käyttäjätili lukossa';
var trigger1OriginalDescription = 'Käyttäjä soittaa ja hänen käyttäjätilinsä on mennyt lukkoon. Avaan lukitun käyttäjätilin joka ratkaisi ongelman.';
var trigger2InteralWorkNotes    = 'Unlocked/reset the password for the users SAP account which resolved the issue';
var trigger2CloseNotes          = 'Hei,\n\nTämä viesti on vahvistus siitä, että OneDesk-tukipyyntösi on ratkaistu.\n\nRatkaisu: Avattu AD-tunnuksen lukitus ja saatu vahvistus puhelimitse, että kirjautuminen onnistui.\n\nKiitos että otit yhteyttä OneDeskiin. Hyvää päivänjatkoa!';
var updateReqIntWorkNotes       = 'Asking provider for update.';
var updateReqProviderNotes      = 'Any update on this?';
var trigger1CloseNotes          = 'Avasin lukitun käyttäjätilin joka ratkaisi ongelman.';
var triggerSWE1CloseNotes       = 'Öppnade låsta AD kontot som löste problemet.' ;

// Background colors for fields. Empty value uses default colors
var closeNotesBgColor           = 'rgb(250, 250, 255)'; // In activity: 'rgb(238, 238, 255)'
var originalDescriptionBgColor  = 'rgb(252, 252, 252)'; // In activity: 'rgb(245, 245, 245)'
var commentsToCallerBgColor     = 'rgb(245, 245, 255)'; // In activity: 'rgb(238, 238, 255)'
var internalWorkNotesBgColor    = 'rgb(250, 250, 230)'; // In activity: 'rgb(250, 250, 210)'
var providerNotesBgColor        = 'rgb(250, 250, 250)'; // In activity: 'rgb(245, 245, 245)'

// Background color for fields that have been changed by this script
var changedBgColor              = 'rgb(250, 250, 240)';

//
//
// ***** Do not change anything below unless you know what you're doing *****
//
//

/* State reference
1    New
2    Active
3    Awaiting Problem
4    Awaiting User Feedback
6    Resolved
21    Awaiting Provider
22    Provider Resolved
24    Awaiting Approval
25    Pending with other internal provider
26    Pending with other external provider
30    Awaiting User Availability
*/

// Delay in milliseconds for automatic changes so that OneDesk can keep up
var defaultDelay                 = 140; //old 140
var defaultDelay2                = 400;
var valWithDelayQueue           = new Array();
var valWithDelayInProcess       = false;



this.$ = this.jQuery = jQuery.noConflict(true);





$.fn.extend({
    valWithDelay: function( newValue, delay ) {
        if ( valWithDelayQueue.length && this === valWithDelayQueue[0]['target'] ) {
            // Running the first queued entry, remove it from queue
            valWithDelayQueue.splice( 0, 1 );
        }
        var target = this;
        if ( delay === undefined ) {
            delay = defaultDelay;
            if ( target.is( 'textarea' ) ) {
                delay = 0;
            }
        };
        var oldValue = this.val()
        if ( newValue !== oldValue ) {
            // Support queueing
            if ( valWithDelayInProcess ) {
                valWithDelayQueue.push( { target: this, newValue: newValue, delay: delay } );
            } else {
                valWithDelayInProcess = true;
                var wasFocused = $( ':focus' );
                target.focus();
                target.prop( 'disabled',  true ); // Disable user-editability to avoid
//                target.val( '' );
                setTimeout(function(){
                    target.val( newValue );
                    setTimeout(function(){
    //                    target.triggerHandler( 'focus' ); // Trigger OneDesk handlers without switching focus
                        target.css( 'background-color', changedBgColor );
                        target.prop( 'disabled',  false ); // Restore user-editability a bit before blur
                        setTimeout(function(){
                            target.blur();
                            target.prop( 'disabled',  true ); // Disable user-editability
                            wasFocused.focus(); // Restore focus
                            setTimeout(function(){
                                target.change();
                                target.prop( 'disabled',  false ); // Restore user-editability finally
                                valWithDelayInProcess = false;
                                if ( valWithDelayQueue.length ) {
                                    // There is a queue, continue with the next one
                                    setTimeout(function(){
                                        valWithDelayQueue[0]['target'].valWithDelay( valWithDelayQueue[0]['newValue'], valWithDelayQueue[0]['delay'] );
                                    }, delay );
                                }
                            }, delay );
                        }, delay );
                    }, delay );
                }, delay );

            }
        }
    }
});

$.fn.extend({
    valWithDelay2: function( newValue, delay ) {
        if ( valWithDelayQueue.length && this === valWithDelayQueue[0]['target'] ) {
            // Running the first queued entry, remove it from queue
            valWithDelayQueue.splice( 0, 1 );
        }
        if ( delay === undefined ) {
            delay = defaultDelay2;
        }
        var target = this;
        var oldValue = this.val();
        if ( newValue !== oldValue ) {
            // Queue support
            if ( valWithDelayInProcess ) {
                valWithDelayQueue.push( { target: this, newValue: newValue, delay: delay } );
            } else {
                valWithDelayInProcess = true;
                target.focus();
                setTimeout(function(){
                    target.val( newValue );
                    target.css( 'background-color', changedBgColor );
                    setTimeout(function(){
                        target.blur();
                        setTimeout(function(){
                            target.change();
                            valWithDelayInProcess = false;
                            if ( valWithDelayQueue.length ) {
                                valWithDelayQueue[0]['target'].valWithDelay2( valWithDelayQueue[0]['newValue'], valWithDelayQueue[0]['delay'] );
                            }
                        }, delay );
                    }, delay );
                }, delay );

            }
        }
    }
});


var isCtrl = false;$(document).keyup(function (e) {
if(e.which == 112) isCtrl=false;
}).keydown(function (e) {
    if(e.which == 112) isCtrl=true;
    if(e.which == 112 && isCtrl == true) {
window.open('https://metsa.service-now.com/sc_task.do?sys_id=-1&sysparm_query=active=true&sysparm_stack=sc_task_list.do?sysparm_query=active=true');
 }
});

var isCtrl = false;$(document).keyup(function (e) {
if(e.which == 113) isCtrl=false;
}).keydown(function (e) {
    if(e.which == 113) isCtrl=true;
    if(e.which == 113 && isCtrl == true) {
window.open('https://metsa.service-now.com/sc_task.do?sys_id=-1&sysparm_query=active=true&sysparm_stack=sc_task_list.do?sysparm_query=active=true');
 }
});

var isCtrl2 = false;$(document).keyup(function (e) {
if(e.which == 119) isCtrl2=false;
}).keydown(function (e) {
    if(e.which == 119) isCtrl2=true;
    if(e.which == 119 && isCtrl2 == true) {


    //         window.open( 'https://metsa.service-now.com/nav_to.do?uri=sc_task.do?sys_id='+ incidentID +');

          searchWindow = window.open("https://metsa.service-now.com/textsearch.do", "searchWindow", "width=600,height=500");
   //     reloadWindow(window);
      //    return;
 }
});


// OneDesk refresh test

//
// OneDesk Homepage header
//


if ( $('#incident\\.do').length ) {

 var ownName = ''+ g_user.firstName +' '+ g_user.lastName +'';
var signatureEN                    = '\n\nBest Regards,\n' + ownName + ' | Metso IT Service Desk | ITServiceDesk@metso.com\nMetso IT Service Desk Chat: itservicedesk@metsoitsd.com\nMetso IT Service Desk contact number:\nTel. +358 2048 4114 (Finnish)\nTel. +46 850516360 Swedish';
var signatureFI                  = '\n\nYstävällisin Terveisin,\n' + ownName + ' | Metso IT Service Desk | ITServiceDesk@metso.com\nMetso IT Service Desk Chat: itservicedesk@metsoitsd.com\nMetso IT Service Desk contact number:\nTel. +358 2048 4114 (Finnish)';
var signatureSE                  = '\n\nMvH,\n' + ownName + '  | Metso IT Service Desk | ITServiceDesk@metso.com\nMetso IT Service Desk Chat: itservicedesk@metsoitsd.com\nMetso IT Service Desk contact number:\nTel. +46 850516360 Swedish';

    var companyCookie = getCookie( "companycookie" );
    var incSysidValcookie = getCookie( "incsysidvalcookie" );
    var incidentNrcookie = getCookie( "incidentnrcookie" );
    var SRQorICTcookie = getCookie( "srqorict" );
    var locationCookie = getCookie( "locationcookie" );
var AntiLoopcookie = getCookie( "antiloopcookie" );
    var SRQorICTvar = "sc_task"
    var SRQorICTChildButtonVal = "c59a561b75415100d2865a986d2ae463"

    var ResolutionCheckBox          = $('#element\\.incident\\.u_propose_knowledge_article');
    var dueDate                 = $('#element\\.incident\\.due_date');
    var maincatEl                 = $('#element\\.incident\\.u_main_category');
    var openedEl                 = $('#element\\.incident\\.opened_at');
    var openedbyEl                 = $('#element\\.incident\\.opened_by');
    var contacttypeEl                 = $('#element\\.incident\\.contact_type');
    var createdonEl                 = $('#element\\.incident\\.sys_created_on');
    var stateEl                 = $('#element\\.incident\\.incident_state'); //changed for INC
    var type                    = $('select#incident\\.u_incident_type');
    var state                    = $('select#incident\\.incident_state');
    var subStatus                    = $('select#incident\\.u_sub_status');
    var userId                     = $('sys_display.incident.caller_id');
    var myUserObject               = $('gs.getUser');
    var myUserObjectGFN              = $('.gs.getFullName').val();
    var userIdtext                 = $('input#incident\\.caller_id').val();
    var userEmail                = $('select#\\.sys_user\\.email').val();
    var incidentNr                = $('input#incident\\.number').val();
    var ritmNr                = $('input#sys_display\\.incident\\.request_item').val();
    var userInfoButton             = $('a[data-ref=incident\\.caller_id]');
    var attachmentButton         = $('a#header_add_attachment');
    var attachmentList           = $('li#attachment_list_items');
    var caller                   = $('input#sys_display\\.incident\\.caller_id');
    var callerVal                  = $('input#sys_display\\.incident\\.caller_id').val();
var originaldescval           = $('input#sys_display\\.incident\\.description');
    var callerEl                   = $('#element\\.incident\\.caller_id');
    var callerFirstName          = ''; // Set by a function below to be able to follow changes
    var callerLastName           = ''; // Set by a function below to be able to follow changes
var OriginalDescVal1 = ''; // Set by a function below to be able to follow changes
    var location                 = $('input#sys_readonly\\.sys_user\\.city');
    var locationMail = $('input#sys_display\\.incident\\.location').val();
    var country                 = $('select#sys_readonly\\.incident\\.u_country');
    var urgency                 = $('select#incident\\.urgency');
    var includeAttachments       = $('input#ni\\.incident\\.u_include_attachments');
    var callerWatchList          = $('#incident\\.watch_list');
    var callerWatchListNonEdit   = $('#incident\\.watch_list_nonedit');
    var internalWatchList        = $('#select_0incident\\.u_internal_watch_list');
    var internalWatchListNonEdit = $('#select_0incident\\.u_internal_watch_list_nonedit');
    var category                 = $('select#incident\\.category');
    var subcategory              = $('select#incident\\.subcategory');
    var class1                   = $('select#incident\\.u_class_1');
    var class2                   = $('select#incident\\.u_class_2');
    var class3                   = $('select#incident\\.u_class_3');
    var class4                   = $('input#incident\\.u_class_3');
    var class5                   = $('select#incident\\.u_class_5');
    var class6                   = $('select#incident\\.u_class_6');
    var class7                   = $('select#incident\\.u_class_7');
    var class8                   = $('select#incident\\.u_class_8');
    var class9                   = $('select#incident\\.u_class_9');
    var languageLabel            = $('#label\\.incident\\.u_language_new');
    var language                 = $('#sys_display\\.incident\\.u_language_new');
    var lang                     = ''; // Set by a function below to be able to follow changes
    var groupLabel                 = $('#element\\.incident\\.assignment_group');

    var confEl                    = $('#element\\.incident\\.cmdb_ci')
    var impactEl                    = $('#element\\.incident\\.impact')
    var majorIncident             = $('#element\\.incident\\.u_major_incident')
    var ProjectRelated            = $('#element\\.incident\\.u_project_related')
    var CommentsBar               = $('#div\\.incident\\.comments');
    var WatchlistElement              = $('#element\\.incident\\.watch_list');
    var WorkNotesBar               = $('#label\\.incident\\.work_notes');

    var CC_Knowledge             = $('#element\\.incident\\.closed_at')
    var CC_ClosedBy              = $('#element\\.incident\\.closed_by')
    var commentsLabel            = $('#element\\.incident\\.u_new_comments')
    var group                    = $('input#sys_display\\.incident\\.assignment_group');
    var configurationItem          = $('input#sys_display\\.incident\\.cmdb_ci');
    var businessService          = $('input#sys_display\\.incident\\.u_business_service');
    var company                   = $('input#sys_display\\.incident\\.company');
    var companyMail               = $('input#sys_display\\.incident\\.company').val();
    var toLabel                  = $('#label\\.incident\\.assigned_to');

    var statusLabel              = $('#label\\.incident\\.state');
    var contactType              = $('select#incident\\.contact_type');
    var to                       = $('input#sys_display\\.incident\\.assigned_to');
    var provider                 = $('input#sys_display\\.incident\\.u_provider');
    var closeCode                = $('select#incident\\.close_code');
    var closeNotes               = $('textarea#incident\\.close_notes');
    var shortDescription         = $('input#incident\\.short_description');
    var shortDescriptionText     = $('input#incident\\.short_description').val();
    var commentsToCallerRow      = $('tr#element\\.incident\\.comments');
    var commentsToCaller         = $('textarea#incident\\.comments');
    var originalDescription      = $('textarea#incident\\.description');
    var sendWorkNotes            = $('input#ni\\.incident\\.u_send_work_notes');
    var internalWorkNotes        = $('textarea#incident\\.work_notes');
    var providerNotesRow         = $('tr#element\\.incident\\.u_provider_notes');
    var providerNotes            = $('textarea#incident\\.u_provider_notes');
    var lastActivityFrom         = $('tr.activity_header span.user').filter(':first').html();
    var lastActivityAttachment   = $('tr.activity_header span.user').filter(':first').closest('tr.activity_header').next('tr.activity_data').find('div[name=u_attachment_notes]');
    var lastActivityFrom2        = $('tr.activity_header span.user').eq(2).html();
    var lastActivityAttachment2  = $('tr.activity_header span.user').eq(2).closest('tr.activity_header').next('tr.activity_data').find('div[name=u_attachment_notes]');
    var RCA                      = $('input#sys_display\\.incident\\.u_sap_rca'); //Added
 //   var IncidentStateButton      = $('#label\\.incident\\.state'); //u_class_4
    var ButtonC1                 = $('#label\\.incident\\.u_class_1');
var ButtonC3                = $('#label\\.incident\\.u_class_3');
    var RCA_Button                 = $('#label\\.incident\\.u_sap_rca');
var BomgarKey                     = $('sys_display.incident.dummy_local_action');
var CallerValueINC = {}; // Globally scoped object following User inspect changes
} else if (window.location.href.indexOf("servicecatalog_checkout_view") > -1) {
//var link                = $('#a\\.linked').val();

var href = $(".linked").attr('href');
href = href.replace("sc_req_item.do?sys_id=", "").replace("&sysparm_view=ess", "");

// alert(""+ href +"");

//var link = document.getElementsByClassName("linked");
//alert( " "+ link +" " );

var gr = new GlideRecord('sc_task');

gr.addQuery('request_item', ''+ href +'');

gr.query();

while (gr.next()) {

// gs.print('Sys Id of sc_task is -->'+gr.sys_id);
// alert( " "+ gr.sys_id +" " );

window.open('https://hclMetso.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D'+ gr.sys_id +'%26sysparm_stack%3D%26sysparm_view%3D', '_top');

}
 /*OLD setTimeout(function(){
       window.location.reload(1);
    }, 180000);
*/

   } else {

 var ownName = ''+ g_user.firstName +' '+ g_user.lastName +'';
var signatureEN                    = '\n\nBest Regards,\n' + ownName + '  | Metso IT Service Desk | itservicedesk@Metso.com\nMetso IT Service Desk | P.O Box 380, FI-00101 Helsinki, Finland | www.Metso.com\nMetso IT Service Desk contact number:\nTel. +358 2041 46000 (Finnish)\nTel. +358 9 876 6600 (English, Finnish, German, French, Russian and Polish)\nTel. +1 630 922 8650 (Option for users in the Americas)\nTel. +86 512 5229 5119 Ext. 3196 (Mandarin)\nhttps://intranet.Metso.com/services/itservices/get_support/pages/four-ways-to-contact-it-service-desk.aspx';
var signatureFI                  = '\n\nYstävällisin Terveisin,\n' + ownName + '  | Metso IT Service Desk | itservicedesk@Metso.com\nMetso IT Service Desk | P.O Box 380, FI-00101 Helsinki, Finland | www.Metso.com\nMetso IT Service Desk contact number:\nTel. +358 2041 46000 (Finnish)\nTel. +358 9 876 6600 (English, Finnish, German, French, Russian and Polish)\nTel. +1 630 922 8650 (Option for users in the Americas)\nTel. +86 512 5229 5119 Ext. 3196 (Mandarin)\nhttps://intranet.Metso.com/services/itservices/get_support/pages/four-ways-to-contact-it-service-desk.aspx';


    var companyCookie = getCookie( "companycookie" );
    var incSysidValcookie = getCookie( "incsysidvalcookie" );
    var incidentNrcookie = getCookie( "incidentnrcookie" );
    var SRQorICTcookie = getCookie( "srqorict" );
    var locationCookie = getCookie( "locationcookie" );
var AntiLoopcookie = getCookie( "antiloopcookie" );

    var SRQorICTvar = "sc_task"
    var SRQorICTChildButtonVal = "a261997a0f08160037b8fe5ce1050e9c"

    var maincatEl                 = $('#element\\.sc_task\\.u_main_category')
    var openedEl                 = $('#element\\.sc_task\\.opened_at');
    var openedbyEl                 = $('#element\\.sc_task\\.opened_by');
    var createdonEl                 = $('#element\\.sc_task\\.sys_created_on');
    var stateEl                 = $('#element\\.sc_task\\.state');
    var contacttypeEl                 = $('#element\\.sc_task\\.contact_type');
    var type                    = $('select#sc_task\\.u_request_type');
    var state                    = $('select#sc_task\\.state');
    var subStatus                    = $('select#sc_task\\.u_sub_status');
    var userId                     = $('sys_display.sc_task.caller_id');
    var incidentNr                = $('input#sc_task\\.number').val();
    var ritmNr                = $('input#sys_display\\.sc_task\\.request_item').val();
    var userInfoButton             = $('a[data-ref=incident\\.caller_id]');
    var attachmentButton         = $('a#header_add_attachment');
    var attachmentList           = $('li#attachment_list_items');
    var caller                   = $('input#sys_display\\.sc_task\\.u_caller_id');
    var callerVal                  = $('input#sys_display\\.sc_task\\.u_caller_id').val();
    var requestedFor                  = $('input#sc_task\\.request_item\\.request\\.requested_for_label').val();
    var callerEl                   = $('#element\\.sc_task\\.u_caller_id');
var originaldescval           = $('input#sys_display\\.sc_task\\.description');
    var callerFirstName          = ''; // Set by a function below to be able to follow changes
    var callerLastName           = ''; // Set by a function below to be able to follow changes
var OriginalDescVal1 = ''; // Set by a function below to be able to follow changes
    var location                 = $('input#sys_display\\.sc_task\\.location');
    var locationMail = $('input#sys_display\\.sc_task\\.location').val();
    var country                 = $('select#sys_readonly\\.sc_task\\.u_country');
    var urgency                 = $('select#sc_task\\.urgency');
    var includeAttachments       = $('input#ni\\.incident\\.u_include_attachments');
    var callerWatchList          = $('#select_0incident\\.watch_list');
    var callerWatchListNonEdit   = $('#incident\\.watch_list_nonedit');
    var internalWatchList        = $('#select_0incident\\.u_internal_watch_list');
    var internalWatchListNonEdit = $('#select_0incident\\.u_internal_watch_list_nonedit');
    var category                 = $('select#incident\\.category');
    var subcategory              = $('select#incident\\.subcategory');
    var class1                   = $('select#incident\\.u_class_1');
    var class2                   = $('select#incident\\.u_class_2');
    var class3                   = $('select#incident\\.u_class_3');
    var class4                   = $('input#incident\\.u_class_3');
    var class5                   = $('select#incident\\.u_class_5');
    var class6                   = $('select#incident\\.u_class_6');
    var class7                   = $('select#incident\\.u_class_7');
    var class8                   = $('select#incident\\.u_class_8');
    var class9                   = $('select#sc_task\\.u_class_9');
    var languageLabel            = $('#label\\.sc_task\\.u_language_new');
    var language                 = $('#sys_display\\.sc_task\\.u_language_new');
    var lang                     = ''; // Set by a function below to be able to follow changes
    var groupLabel                 = $('#label\\.sc_task\\.assignment_group');
    var commentsLabel             = $('#element\\.sc_task\\.u_new_comments')

    var TransportTime             = $('input#sc_task\\.u_requested_transport_date_and').val();
    var TransportSchedule         = $('select#sc_task\\.u_transport_schedule').val();
    var CompanyValue             = $('input#sys_display\\.sc_task\\.company').val();
    var confEl                    = $('#element\\.sc_task\\.cmdb_ci')
    var impactEl                    = $('#element\\.sc_task\\.impact')
    var majorIncident             = $('input#ni\\.sc_task\\.u_major_incident')
    var ProjectRelated             = $('#element\\.sc_task\\.u_project_related')
    var CommentsBar                   = $('#div\\.sc_task\\.comments');
    var WatchlistElement             = $('#label\\.sc_task\\.request_item\\.comments'); //changed for Task
    var WorkNotesBar               = $('#label\\.sc_task\\.work_notes');

    var CC_Knowledge             = $('#element\\.sc_task\\.closed_at')
    var CC_ClosedBy              = $('#element\\.sc_task\\.closed_by')
    var company                    = $('input#sys_display\\.sc_task\\.company');
    var companyMail         = $('input#sys_display\\.sc_task\\.company').val();
    var group                    = $('input#sys_display\\.sc_task\\.assignment_group');
    var configurationItem          = $('input#sys_display\\.sc_task\\.cmdb_ci');
    var businessService          = $('input#sys_display\\.sc_task\\.u_business_service');
    var toLabel                  = $('#label\\.sc_task\\.assigned_to');
    var statusLabel              = $('#label\\.sc_task\\.state');
    var contactType              = $('#label\\.sc_task\\.contact_type');
    var to                       = $('input#sys_display\\.sc_task\\.assigned_to');
    var toVal                    = $('input#sys_display\\.sc_task\\.assigned_to').val();
    var provider                 = $('input#sys_display\\.sc_task\\.u_provider');
    var closeCode                = $('select#sc_task\\.u_close_code');
    var closeNotes               = $('textarea#sc_task\\.close_notes');
    var shortDescription         = $('input#sc_task\\.short_description');
    var shortDescriptionText     = $('input#sc_task\\.short_description').val();
    var commentsToCallerRow      = $('tr#element\\.sc_task\\.comments');
    var commentsToCaller         = $('textarea#sc_task\\.request_item\\.comments');
    var originalDescription      = $('textarea#sc_task\\.description');
    var originalDescriptionText      = $('textarea#sc_task\\.description').val();
    var sendWorkNotes            = $('input#ni\\.sc_task\\.u_send_work_notes');
    var internalWorkNotes        = $('textarea#sc_task\\.work_notes');
    var providerNotesRow         = $('tr#element\\.sc_task\\.u_provider_notes');
    var providerNotes            = $('textarea#sc_task\\.u_provider_notes');
    var lastActivityFrom         = $('tr.activity_header span.user').filter(':first').html();
    var lastActivityAttachment   = $('tr.activity_header span.user').filter(':first').closest('tr.activity_header').next('tr.activity_data').find('div[name=u_attachment_notes]');
    var lastActivityFrom2        = $('tr.activity_header span.user').eq(2).html();
    var lastActivityAttachment2  = $('tr.activity_header span.user').eq(2).closest('tr.activity_header').next('tr.activity_data').find('div[name=u_attachment_notes]');
    var RCA                      = $('input#sys_display\\.sc_task\\.u_sap_rca'); //Added
  //  var IncidentStateButton      = $('#label\\.sc_task\\.state'); //u_class_4
    var ButtonC1                 = $('#label\\.sc_task\\.u_class_1');
var ButtonC3                = $('#label\\.incident\\.u_class_3');
    var RCA_Button                 = $('#label\\.sc_task\\.u_sap_rca');
var BomgarKey                     = $('sys_display.sc_task.dummy_local_action');
var CallerValueSRQ = {}; // Globally scoped object following User inspect changes
    var TrasnsportState = $('#label\\.sc_task\\.u_transport_state');

 }

    function setCookie (cname, cvalue, exdays){
       var d = new Date();
       d.setTime(d.getTime() + (exdays*1000));
       var expires = "expires=" + d.toUTCString();
document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
 }


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
}

           if ( companyCookie.length > 2 && shortDescription.val().match( /Transport request/i ) ) {

   // if ( shortDescription.val().match( /Transport request/i ) && to.val() === 'Kjell-Åke (ICT) Nilsson' ) {
       //     var companyCookie = getCookie( "companycookie" );


            company.valWithDelay2( "not defined" );
            to.valWithDelay2( "not defined" );
setTimeout(function(){
// alert( companyCookie );
                   to.valWithDelay2( g_user.userName );
                   urgency.valWithDelay2( 2 );
                   to.focus();
                   company.valWithDelay2( companyCookie );


          }, 3000);

 /* under beta testing stage
               setTimeout(function(){

                                var incSysid = g_form.getUniqueValue();

            setCookie("incsysidvalcookie", incSysid, 10);
                                var incSysidValcookie = getCookie( "incsysidvalcookie" );

                        setCookie("incidentnrcookie", incidentNr, 10);
                                var incidentNrcookie = getCookie( "incidentnrcookie" );

                                setCookie("srqorict", SRQorICTvar, 10);
                                var SRQorICTcookie = getCookie( "srqorict" );

           $("#sysverb_insert").click();
           // return gsftSubmit(this);
          }, 6000);
           */


            /* setTimeout(function(){
// alert( companyCookie );
      $("#SubmitReturn-button").click();

          }, 5000);
          */
}

                     //          alert('Onload Function is reading');

    // WORKING




    // Update refreshtrigger


var isCtrl = false;$(document).keyup(function (e) {
if(e.which == 115) isCtrl=false;
}).keydown(function (e) {
    if(e.which == 115) isCtrl=true;
    if(e.which == 115 && isCtrl == true) {
//alert("Hello! I am an alert box!! 3");
gsftSubmit(this);
 }
});


// Make textareas larger when focused for better visibility



  /*

    */
    // checkticket button trigger

    //


    //
    // On-click, on-focus and on-blur functions
    //

    // Make textareas larger when focused for better visibility
    /*
$( 'textarea' ).click( function() {
//        alert( 'textarea focused, rows: ' + $( this ).attr( 'rows' ) );
//        $( this ).css( 'background-color', 'red' );
        var rows = $( this ).attr( 'rows' );
        if ( rows != 10 ) {
            $( this ).attr( 'rows', 10 );
            $( this ).blur( function() {
                $( this ).attr( 'rows', rows );
            });
        }
    });
    */
/*
     setCallerNames();

        function getUniqueValue() {
    var incSysid = g_form.getUniqueValue();
  //  alert(incSysid);
}
*/
   // alert ("it runs!");

  //  getUniqueValue();

    // WORKING

/* BETA BETA BETA
           if ( incSysidValcookie.length > 2 && incidentNrcookie.length > 2 ) {
         //      alert("it runs");
               if ( incidentNr !== incidentNrcookie ) {

                   if ( incidentNr.val().match( /ICT/i ) ) {
                       alert("ICT DETECTED");
                     //      alert('IncidentNr Value is not the same as incidentNr');
            //   setTimeout(function(){

               window.open('https://metsa.service-now.com/nav_to.do?uri=sc_task.do?sys_id='+ incSysidValcookie +'',"self");

         // }, 1000);
                   } else if ( incidentNr.val().match( /SRQ/i ) )  {
                       alert("SRQ DETECTED");
                         //         setTimeout(function(){

               window.open('https://metsa.service-now.com/nav_to.do?uri=sc_task.do?sys_id='+ incSysidValcookie +'',"self");

     //     }, 1000);

                   }

               }
           }
          BETA BETA BETA */


//TEXTAREA CLICK FUNCTION DISABLED



    //
    // On-load functions
    //

  //  checkHRTicketFI();
 //   commentsToCallerShowHide();
 //  providerNotesShowHide();
//    checkProviderResolved();

    // Set background colors for textareas
/*
    closeNotes.css(          'background-color', closeNotesBgColor );
    originalDescription.css( 'background-color', originalDescriptionBgColor );
    commentsToCaller.css(    'background-color', commentsToCallerBgColor );
    internalWorkNotes.css(   'background-color', internalWorkNotesBgColor );
    providerNotes.css(       'background-color', providerNotesBgColor );

*/
    // On each page load, default "Send work notes" to unchecked to avoid unintended usage
/*
    if ( sendWorkNotes.is( ':checked' ) ) {
        sendWorkNotes.removeAttr( 'checked' );
    }
 */

 /*
    setTimeout( function() { // -start- Wait to avoid conflict with default auto-focus script (important)


    }, defaultDelay ); // -end- Wait to avoid conflict with default auto-focus script (important)
   */
    //
    // On-change functions
    //
/*
    caller.change( function() {
        setCallerNames();
    });
*/

 //REMOVE   state.change( function() {
     /*   commentsToCallerShowHide(); */
    //    providerNotesShowHide();

        //Automatic Default close Code (Disabled due to close code button.
       /* if ( defaultCloseCode != '' ) {
            if ( state.val() === '6' && closeCode.val() === ''  ) { // 6 = Resolved
                closeCode.valWithDelay( defaultCloseCode );
                var closeNoteToUse = '';
                closeNoteToUse = eval( 'defaultCloseNotes' + lang ); // Eval safety: lang has been filtered earlier to be able to have only two A-Z alphabets
                if ( closeNotes.val() === '' ) {
                    closeNotes.valWithDelay( closeNoteToUse );
                }
            } else if ( state.val() !== '6' && closeCode.val() === defaultCloseCode ) {
                closeCode.valWithDelay( '' ); // Don't set close code if not resolved after all
            }
        }
        */
   /*
        if ( state.val() === '21' && shortDescription.val().match( /Sovelia/i ) && provider.val() === '' ) { // 21 = Awaiting Provider
//            Disabled due to dispatch rule update 2014-07-29
//            group.valWithDelay( 'PDM Sovelia Service Manager' );
//            to.valWithDelay( 'Ari Hiltunen' );
        }
        checkProviderResolved();
        if ( class2.val() === 'lvl2_erp_sap_all' && provider.val() === '' ) {
            if ( ( class5.is( ':visible') && class5.val() === 'lvl5_sa_user_administration_basis' )
                || ( class6.is( ':visible') && class6.val() === 'lvl6_sa_user_administration' )
            ) {
                provider.valWithDelay( 'SAP User Administraton Support' );
            } else if ( ( class5.is( ':visible') && class5.val() === 'lvl5_sa_finance_and_controlling' )
                || ( class6.is( ':visible') && class6.val() === 'lvl6_sa_finance_and_controlling' )
            ) {
                provider.valWithDelay( 'SAP Finance and Controlling Support Provider' );
            }  else if ( ( class5.is( ':visible') && class5.val() === 'lvl5_sa_material_management' )
                || ( class6.is( ':visible') && class6.val() === 'lvl6_sa_material_management' )
            ) {
                provider.valWithDelay( 'SAP Material Management Support Provider' );
            }  else if ( ( class5.is( ':visible') && class5.val() === 'lvl5_sa_sales_and_distribution' )
                || ( class6.is( ':visible') && class6.val() === 'lvl6_sa_sales_and_distribution' )
            ) {
            }


        }
    });

*/ // REMOVE State change function
/*
    priority.change( function() {
        QlikviewPriorityCheck();
    });
    */
  /*  subcategory.change( function() {
        checkHRTicketFI();
    }); */




    /*
    $( groupLabel ).append(
            '<div class="me-button" style="display:inline-block; margin: 0 2px; border: 1px solid black; padding: 0 2px; cursor: pointer;">Me</div>'
        );

    */

    // Company value function, sets transport manager ICT company value

   //     alert ("it runs!");


 // Setting variables this way instead of making them functions keeps the syntax for all variables the same: callerFirstName instead of callerFirstName()
    function setCallerNames() {
        var callerWords     = caller.val().split(/[ ,]+/); // Defined as functions so their value changes when caller is changed
        callerFirstName     = callerWords[0];
        callerLastName      = callerWords[callerWords.length - 1]; // Required callerWords variable to work
    }

    function setRequesterNames() {
        var requesterWords     = requestedFor.val().split(/[ ,]+/); // Defined as functions so their value changes when caller is changed
        requesterFirstName     = requesterWords[0];
        requesterLastName      = requesterWords[requesterWords.length - 1]; // Required RequesterWords variable to work
    }

    function setShortDescription() {
        var SummaryWords     = shortDescription.val().split(/[ ,]+/); // Defined as functions so their value changes when caller is changed
        summaruFirstWord     = SummaryWords[0];
        summaryLastWord      = SummaryWords[SummaryWords.length - 1]; // Required RequesterWords variable to work
    }

     //   alert ("it runs!");

        function EmailCreationName() {

                var requesterName = requestedFor.replace(/å|ä|Å|Ä/g, 'a').replace(/Ö|ö/g, 'o').replace(/Ó|ó/g, 'o').replace(/Ń|ń/g, 'n').replace(/É|é/g, 'e').replace(/Ü|ü/g, 'u').replace(/Ł|ł/g, 'l').replace(/ę|Ę/g, 'e').replace(/ą|Ą/g, 'a').replace(/ż|Ż/g, 'z')


    var fullName = requesterName.split(' ');
    firstName = fullName[0];
    lastName = fullName[fullName .length - 1];
            }

        // Insert caller's first name into standard templates (replace "user" etc.)
    function useCallersNameInTemplates( template ) {
        if ( template.match( /^Dear (?:(user)|(customer))\b/ ) ) {
            template = template.replace( /^Dear (?:(user)|(customer))\b/, 'Dear ' + callerFirstName );
        } else if ( template.match( /^Hei\b/ ) ) {
            template = template.replace( /^Hei(\n|,)/, 'Hei ' + callerFirstName + "$1" );
        } else if ( template.match( /^Hej\b/ ) ) {
            template = template.replace( /^Hej(\n|,|!)/, 'Hej ' + callerFirstName + "$1" );
        }
         else if ( template.match( /^Hi\b/ ) ) {
            template = template.replace( /^Hi(\n|,|!)/, 'Hi ' + callerFirstName + "$1" );
        }
        return( template );
    }

        closeNotes.change( function() {
        var callersNameTemp = useCallersNameInTemplates( closeNotes.val() );
        if ( closeNotes.val() !== callersNameTemp ) {
            closeNotes.valWithDelay( callersNameTemp );
        }
    });

    commentsToCaller.change( function() {
        var callersNameTemp = useCallersNameInTemplates( commentsToCaller.val() );
        if ( commentsToCaller.val() !== callersNameTemp ) {
            commentsToCaller.valWithDelay( callersNameTemp );
        }
    });

/*
function onChange(control, oldValue, newValue, isLoading) {
   if (newValue == '') {
      g_form.setValue('short_description', ''); //if there is nothing in the requested_for field, empty the short description field
      return;
   }
   var email = g_form.getReference('sys_user', email); //get reference is used with reference fields to get a value; use a function to get the value.
    alert( email );
}

onChange();

function setEmail(email) { //this is the function that runs on the variable email
   if (email)
       g_form.setValue('short_description', email.email); //this sets the email into the short description field
}

*/
/* INCIDENT email WORKS
function onLoad() {

var email = g_form.getReference('caller_id', setEmail);

function setEmail(email) {
if (email)
alert('email is '+ email.email);
g_form.setValue('short_description', email.email); //this changes the short_description, but change it to populate the right field, or remove it if you do not need it.
}
}
onLoad();
setEmail(email);
*/


/* OLD WERKING
function onLoad() {

var caller = g_form.getReference('caller_id', setEmail);

function setEmail(caller) {
if (caller){
//alert('email is '+ caller.email);
//window.location.href = "mailto:"+ caller.email +"?subject=Test&body=Hi"+ ownName +"%20";
}
var user = new GlideRecord('sys_user');
user.addQuery('sys_id', caller.manager);
user.query();
while(user.next()){



alert('manager name is ' + user.name + ' email: ' + user.email);

g_form.setValue('SOME_FIELD', user.manager) // do not forget to add / change this line
}
g_form.setValue('short_description', caller.email); //change this...
}
}
onLoad();

*/
            if ( $('#incident\\.do').length ) {
function onLoad() {

var email = g_form.getReference('caller_id', setEmail);

function setEmail(email) {
if (email)
CallerValueINC.CallerEmail = (email.email);
}
}

   } else {


function onLoad() {

var caller = g_form.getReference('request_item.request.requested_for', setEmail);

function setEmail(caller) {
if (caller){
// alert('email is '+ caller.email);
}
var user = new GlideRecord('sys_user');
user.addQuery('sys_id', caller.manager);
user.query();
while(user.next()){
CallerValueSRQ.ManagerFirstName = (user.first_name);
CallerValueSRQ.ManagerEmail = (user.email);
CallerValueSRQ.CallerEmail = (caller.email);
CallerValueSRQ.CallerTitle = (caller.title);
CallerValueSRQ.CallerUsername = (caller.user_name);
CallerValueSRQ.MobilePhone = (caller.mobile_phone);
//g_form.setValue('SOME_FIELD', user.manager) // do not forget to add / change this line
}
}
}

}


onLoad();
// alert('Global Function test: '+ CallerValueSRQ.ManagerName +' < should display managername');

/*
function onLoad() {
   //Type appropriate comment here, and begin script below

var ri = g_form.getValue('request_item');

var ga = new GlideAjax('getEmail'); //this is the script include
ga.addParam('sysparm_name', 'userEmail'); //this is the function within the script include
ga.addParam('sysparm_ri', ri);
ga.getXML(getResponse);

function getResponse(response) {
var values = response.responseXML.documentElement.getAttribute('answer');

alert(values);

}
}

onLoad();
getResponse(response);

*/
      //
    // On-change functions
    //
/*
    caller.change( function() {
        setCallerNames();
    });
*/


    //Add me Button

    /* encode converter
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}


    encode_utf8();
    */

    //    alert ("it runs so far!");

              function toAddMeIcon() {

        if ( groupLabel.length ) {


               $( groupLabel ).append(

                   '<img style="margin-left: 5px; cursor: pointer;" src="/images/icons/user_obj.gifx" alt="Add me" title="Add me" width="16" height="16" border="0" id="to-add-me-button" />'

               );

               $( '#to-add-me-button' ).click( function() {

                   var LoginUserVal = ( g_user.userName );

                     if ( to.val() === ownName) {

                     } else if ( group.val() === 'HCL Service Desk Vendor Rivo One Safety support') {
            group.valWithDelay( 'HCL Service Desk Vendor Rivo One Safety support' );
 /*                        to.focus();
100
                         group.focus();
100 */
            internalWorkNotes.val( 'Assigning ticket' );
            to.valWithDelay2( ownName );
                                 to.slice(1, -1);
                     } else if ( group.val() !== 'HCL Service Desk Finland UAM') {


            group.valWithDelay( 'METSO-HCL-Finnish-SD' );
 /*                        to.focus();
100
                         group.focus();
100 */
            internalWorkNotes.val( 'Assigning ticket' );
            to.valWithDelay2( ownName );
                                 to.slice(1, -1);

//            to.focus();


        } else {
                        group.valWithDelay2( 'HCL Service Desk Finland UAM' );
                        internalWorkNotes.valWithDelay( 'Assigning ticket' );
            to.valWithDelay2( ownName );
                                 to.slice(1, -1);
                   }


               });

        }

    }

    function RivoCaseNr() {
        var data = shortDescription.val();
var    RivoCase = console.log(data.split(" ").splice(-1));
    }
RivoCaseNr();

/*
 if ( groupLabel.length ) {
        $( groupLabel ).append(
            '<div class="me-button" style="display:inline-block; margin: 0 2px; border: 1px solid black; padding: 0 2px; cursor: pointer;">Me</div>'
        );
        $( '.me-button' ).click( function() {
            group.valWithDelay2( 'Metso Group Service Desk Finland (24X7)' );
       //     group.focus();
            to.valWithDelay2( ownName );
         //   group.focus();
         //   to.focus();
       });
    }
*/
// alert ("it runs so far also!");




    toAddMeIcon();


    /*

                // New Button
        if ( groupLabel.length ) {
        $( groupLabel ).append(
            '<div class="me-button" style="display:inline-block; margin: 0 2px; border: 1px solid black; padding: 0 2px; cursor: pointer;">Me</div>'
        );
        $( '.me-button' ).click( function() {
            group.valWithDelay2( 'Metso Group Service Desk Finland (24X7)' );
       //     group.focus();
            to.valWithDelay2( ownName );
         //   group.focus();
         //   to.focus();
       });
    }
    */
    // New Button

    /*
    STATE:
    '2' - Active
    '4' - Awaiting user info
    '8' - Awaiting Vendor
    '5' Awaiting
    '6' Resolved



    */


        // New Button AutoFill

           if ( openedbyEl.length ) {
        $( openedbyEl ).append(
            '<div class="AutoFill-button" style="display:inline-block; border-radius: 3px;  margin: 7px 0px 0px 5px; border: 1px solid black; background-color: #2693ff; padding: 0 2px; cursor: pointer;">AutoFill</div>'
        );
        $( '.AutoFill-button' ).click( function() {

  if ( caller.val().match( /Tieto COD/ ) ) {

                if ( originalDescription.val().match( /Company:Metsa Board/i ) ) {
                company.valWithDelay2( 'Metsa Boar' );

                    } else if ( originalDescription.val().match( /Metsa Tissue/i ) ) {
                    company.valWithDelay2( 'Metso Tissu' );
                    } else if ( originalDescription.val().match( /Metsa Wood/i ) ) {
                    company.valWithDelay2( 'Metso Woo' );
                    } else if ( originalDescription.val().match( /Metsa Fibre/i ) ) {
                    company.valWithDelay2( 'Metso Fibr' );
                    } else if ( originalDescription.val().match( /Metsa Group/i ) ) {
                    company.valWithDelay2( 'Metso Grou' );
                    } else if ( originalDescription.val().match( /Metsa company/i ) ) {
                    company.valWithDelay2( 'Metso Grou' );
                    } else if ( originalDescription.val().match( /Metsa forest/i ) ) {
                    company.valWithDelay2( 'Metsa Fores' );


            } if ( originalDescription.val().match( /Business Service: Integration/ ) ) {
                    businessService.valWithDelay2( 'Integratio' );
                    } else if ( originalDescription.val().match( /ICT Internal Only/ ) ) {
                    businessService.valWithDelay2( 'Integratio' );

            } if ( originalDescription.val().match( /SAP PI/ ) ) {
                    configurationItem.valWithDelay2( 'SAP P' );
                    } else if ( originalDescription.val().match( /Batch&Interface monitoring/ ) || ( originalDescription.val().match( /Batch & Interface monitoring/ ) ) ) {

                    configurationItem.valWithDelay2( 'Batch&Interface monitorin' );

            } if ( originalDescription.val().match( /Urgency: 2/ ) || originalDescription.val().match( /Urgency:2/ ) ) {
                    urgency.valWithDelay2( '2' );
                    } else if ( originalDescription.val().match( /Urgency: 1/ ) || originalDescription.val().match( /Urgency:1/ ) ) {
                    urgency.valWithDelay2( '1' );


            } if ( originalDescription.val().match( /AMS Integration Support/ ) ) {
                    group.valWithDelay2( 'AMS Integration Suppor' );
                    } else if ( originalDescription.val().match( /Group2/ ) ) {
                    group.valWithDelay2( 'Group2' );
                    } else if ( originalDescription.val().match( /based on default routing visible in ServeMe/ ) ) {
                    group.valWithDelay2( 'AMS Unclassifie' );


}
            }
       });
    }







    /* NOT IN USE IN Metso

     // New Button Check Ticket
        if ( contacttypeEl.length ) {
        $( contacttypeEl ).append(
            '<div class="CheckTicket-button" style="display:inline-block; border-radius: 3px; margin: 1px 0px 0px 5px; border: 1px solid black; background-color: #D1F9F5; padding: 0 2px; cursor: pointer;">CheckTicket</div>'
        );
        $( '.CheckTicket-button' ).click( function() {
    if ( originalDescription.val().match( /folder access/i)
    || shortDescription.val().match( /folder access/i )
    || originalDescription.val().match( /shared folder/i )
    || shortDescription.val().match( /shared folder/i )
    || originalDescription.val().match( /shared drive/i )
    || shortDescription.val().match( /shared drive/i )
    || originalDescription.val().match( /\\/i )
    || shortDescription.val().match( /\\/i )
    || originalDescription.val().match( /kansio/i )
    || shortDescription.val().match( /kansio/i )


            ) {        alert("Shared drive/Folder access match found \n\nRead or write access?(ask if not mentioned in the ticket.)\n\nFolder access changes need to be Approved by the users LIM\n\nAfter these steps the ticket should be sent to the GAM team \n\n 22.2.2016");

            } if ( originalDescription.val().match( /DL/i )
                    || originalDescription.val().match( /distributionlist/i )
                    || originalDescription.val().match( /distribution list/i )
                    || shortDescription.val().match( /distribution list/i )
                    || shortDescription.val().match( /distributionlist/i )
                    || shortDescription.val().match( /DL/i )
            ) {        alert("DL list match found\n\nIf the user requests a new DL list the request should be sent to HCL Global account management \n\nDL List Modification is handled by Metso group SD\n\nChanges need to be approved by the owner (if there's no owner ask local IT manager for approval.)\n\nChanges can be done in AD\n\(In swedish folder access cases assign to Swedish Onsite)\n\n 14.4.2016");

            } if ( originalDescription.val().match( /shared mailbox/i )
                    || shortDescription.val().match( /shared mailbox/i )
                    || originalDescription.val().match( /mailbox access/i )
                    || shortDescription.val().match( /mailbox access/i )
                    || originalDescription.val().match( /shared email box/i )
                    || shortDescription.val().match( /shared email box/i )
                    || originalDescription.val().match( /shared email-box/i )
                    || shortDescription.val().match( /shared email-box/i )
            ) {        alert("New shared Mailboxes are created by the HCL Global account management team (LIM approval is needed)\n\nChanges in existing mailboxes need to be approved by the owner If there's no owner ask local IT manager for approval\n\nChanges in existing mailboxes is done by Metso SD in the OFFICE 365 portal (See shared drive for instructions)\n\n 14.4.2016");

            } if ( originalDescription.val().match( /email license/i )
                    || shortDescription.val().match( /email license/i )
                    || originalDescription.val().match( /mail license/i )
                    || shortDescription.val().match( /mail license/i )
            ) {        alert("Email license match found\n\nEmail licenses are handled by HCL Global account Management\n\n22.3.2016");

            } if ( originalDescription.val().match( /kotka/i )
                    || shortDescription.val().match( /kotka/i )
            ) {        alert("Kotka match found\n\nKotka issues are managed by AMS Forest systems support\n\Kotka access issues are managed by AMS SAP Authorization\n\nIf Kotka does not start Remove kotka.db3 based on the instructions\n(See Routing matrix for the instructions)\n\n9.5.2016");

           } if ( originalDescription.val().match( /New Laptop/i )
                    || shortDescription.val().match( /New Laptop/i )
                    || originalDescription.val().match( /image/i )
                    || shortDescription.val().match( /image/i )
            ) {        alert("New Laptop/Image match found\n\nthese tickets should be sent to: HCL Imaging and Installation Center\n\n9.5.2016");

            } if ( originalDescription.val().match( /Bitlocker/i )
                    || shortDescription.val().match( /Bitlocker/i )
                    || originalDescription.val().match( /computer locked/i )
                    || shortDescription.val().match( /computer locked/i )
                    || originalDescription.val().match( /kone lukossa/i )
                    || shortDescription.val().match( /kone lukossa/i )
            ) {        alert("Bitlocker match found\n\nBitlocker unlocking is done by MGSD\n(See shared drive for instructions)\n\nEncrypting a Existing Machine is done by HCL Active Directory & Printer Support\n\nIf Bitlocker key is invalid contact HCL Endpoint Security Services\n\n22.3.2016");

            } if ( originalDescription.val().match( /SAP/i )
                    || shortDescription.val().match( /SAP/i )
                    || originalDescription.val().match( /P07/i )
                    || shortDescription.val().match( /P07/i )
|| originalDescription.val().match( /AP7/i )
                    || shortDescription.val().match( /AP7/i )
|| originalDescription.val().match( /P09/i )
                    || shortDescription.val().match( /P09/i )
|| originalDescription.val().match( /P02/i )
                    || shortDescription.val().match( /P02/i )
|| originalDescription.val().match( /P2A/i )
                    || shortDescription.val().match( /P2A/i )
|| originalDescription.val().match( /P2I/i )
                    || shortDescription.val().match( /P2I/i )
|| originalDescription.val().match( /P50/i )
                    || shortDescription.val().match( /P50/i )
|| originalDescription.val().match( /P6R/i )
                    || shortDescription.val().match( /P6R/i )
                    || originalDescription.val().match( /P6A/i )
                    || shortDescription.val().match( /P6A/i )
|| originalDescription.val().match( /MYP/i )
                    || shortDescription.val().match( /MYP/i )
|| originalDescription.val().match( /P12/i )
                    || shortDescription.val().match( /P12/i )
|| originalDescription.val().match( /FSP/i )
                    || shortDescription.val().match( /FSP/i )
|| originalDescription.val().match( /P80/i )
                    || shortDescription.val().match( /P80/i )
|| originalDescription.val().match( /MyCube/i )
                    || shortDescription.val().match( /MyCube/i )
|| originalDescription.val().match( /Vesuri/i )
                    || shortDescription.val().match( /Vesuri/i )
|| originalDescription.val().match( /One+/i )
                    || shortDescription.val().match( /One+/i )
            ) {
    var txt;
    var r = confirm('SAP match found.\n\nPassword Reset and unlocking is done by Metso SD\n(SAP password reset and ID unlock instructions are found on the Shared Drive)\n\nSAP Password reset/unlock can be done for the following systems by SD:\n-----\nFibre mbSAP P07\nFibre SCM AP7\nBMS P09\nBoard Runboard P02\nBoard Planboard P2A\nBoard TM P2I\nForest Vesuri P50\nTissue One+ P6R\nTissue One+ P6A\nWood MyCube MYP\nWood SCM P12\nGroup Finance FSP\nGroup HR P80\n-----\n\nSAP account access/validity extension > AMS authorization\nFSQ SAP TEST pw reset > AMS Authorization support \n\nSAP Printing is managed by AMS Unclassified\n\nPress OK for SAP dispatching rules\n\n14.4.2016');
    if (r == true) {
        window.open('https://collaboration.metsagroup.com/en/Collaboration/gs-new-eus-coop/default.aspx?RootFolder=%2Fen%2FCollaboration%2Fgs-new-eus-coop%2FLists%2Fdocuments%2FService%20Desk%20Operations%2FService%20Desk%20SOP%2FApplications%20SOP%27s%2FSAP&FolderCTID=0x01200079932935EEF4C049B7582EFFC42CFE9E&View={2F578C0A-5016-46B2-B899-BFE3E8E37543}');
        return;
    };

          } if ( originalDescription.val().match( /tips/i )
                    || shortDescription.val().match( /tips/i )
            ) {
    var txt;
    var r = confirm('TIPS match found.\n\nTips Password = AD Password MES tips incidents should be concidered CRITICAL\n\nAsk the following questions:\n---\nWhat application are you using, is it MES TIPS?\nPlease describe the problem and the impact to production\nIs there a problem with a office or production PC?\nWhat factory/location\n\nWho is the Metso onsite contact for further contacts on this incident?\n- Ask the phone number for the contact.\n---\n\nMain Category:Mill Systems\nSub Category:MES Tips\n\nPROCESS:\nAssing the ticket first to Tieto, then call them at +420597158402 to ensure incident has reached Tieto in their ticket tool (TONE).\n\nAlso Send a ticket to Onsite and call them. (See Onsite List)\n\n[Backup number for TIPS/MES support +358 2072 69444]\n\nSee instructions for new TIPS SMS process');
    if (r == true) {
        window.open("https://collaboration.metsagroup.com/en/Collaboration/gs-new-eus-coop/Lists/documents/Service Desk Operations/Service Desk SOP/Applications SOP's/MES TIPS/TIPS incidents_quick guide.pptx");
        return;
    };


            } if ( originalDescription.val().match( /WLAN/i )
                    || shortDescription.val().match( /WLAN/i )
                    || originalDescription.val().match( /VLAN/i )
                    || shortDescription.val().match( /VLAN/i )
            ) { alert("WLAN/VLAN match found. If problems with WLAN/VLAN assign ticket to Cygate 16.11.2015 ");

            } if ( originalDescription.val().match( /ServeMe/i )
                    || shortDescription.val().match( /ServeMe/i )
            ) { alert("ServeMe match found.\n\nServeMe external account access and Group Creation is managed by HCL Global account management\n\nServeMe group modification is done by SD\nServeMe > Skills > Groups\n\nServeMe user access modification is done by SD\nServeMe Home > ServeMe Users\n\n18.4.2016");

            } if ( originalDescription.val().match( /Exchange/i )
                    || shortDescription.val().match( /Exchange/i )
            ) { alert("Exchange match found.\n\nExchange related issues are handled by HCL Messaging Support Noida\n\n17.3.2016");

            } if ( originalDescription.val().match( /Communication/i )
                    || shortDescription.val().match( /Communication/i )
                    || originalDescription.val().match( /communication list/i )
                    || shortDescription.val().match( /communication list/i )
            ) { alert("Communication match found.\n\nCommunications are done by SD\n\nCommunication list is managed by SD\n\n17.3.2016");

            } if ( originalDescription.val().match( /Address change/i )
                    || shortDescription.val().match( /Address change/i )
                    || originalDescription.val().match( /email address/i )
                    || shortDescription.val().match( /email address/i )
            ) { alert("Email Address/Email Address change match found.\n\nChanges in email address is done by HCL Messaging Support Noida\n\n17.3.2016");

            } if ( originalDescription.val().match( /E3/i )
                    || shortDescription.val().match( /E3/i )
            ) { alert("E3 Match found\n\nOffice Licenses for E3 are granted by HCL Global Account Management\n\n17.3.2016");

            } if ( originalDescription.val().match( /Firewall/i )
                    || shortDescription.val().match( /Firewall/i )
            ) { alert("Firewall match found\n\nCygate is responsible for Metso Firewall changes/modification\n\n17.3.2016");

            } if ( originalDescription.val().match( /sitebase/i )
                    || shortDescription.val().match( /sitebase/i )
            ) { alert("Sitebase match found\n\nSitebase is a application mainly managed by Onsite\n\n17.3.2016");

            } if ( originalDescription.val().match( /WAN connection/i )
                    || shortDescription.val().match( /WAN connection/i )
                    || originalDescription.val().match( /wide area network/i )
                    || shortDescription.val().match( /wide area network/i )
            ) { alert("WAN match found\n\nSonera and Cygate are responsible for Metso WAN changes/modification\n\n17.3.2016");

            } if ( originalDescription.val().match( /Termos/i )
                    || shortDescription.val().match( /Termos/i )
                    || originalDescription.val().match( /laskun mitätöinti/i )
                    || shortDescription.val().match( /laskun mitätöinti/i )
            ) { alert("Termos/laskun mitätöinti match found\n\Termos issues are managed by AMS Finance support\n\n18.4.2016");

            } if ( originalDescription.val().match( /MDS/i )
                    || shortDescription.val().match( /MDS/i )
                    || originalDescription.val().match( /loading order/i )
                    || shortDescription.val().match( /loading order/i )
            ) { alert("Loading order/MDS match found\n\Loading order - prelisting (date selection) (MDS) is managed by AMS reporting support\n\n3.5.2016");

            } if ( originalDescription.val().match( /Amazon/i )
                    || shortDescription.val().match( /Amazon/i )
            ) { alert("Amazon match found\n\nAmazon Workspaces are managed by HCL Global Account Management\n\n14.4.2016");

            } if ( originalDescription.val().match( /desktop shortcut/i )
                    || shortDescription.val().match( /desktop shortcut/i )
            ) { alert("desktop shortcut match found\n\nDefault desktop shortcut change/modification is done by COMMS Digital Channels\n\n19.4.2016");

            } if ( originalDescription.val().match( /parking request/i )
                    || shortDescription.val().match( /parking request/i )
            ) { alert("parking request match found\n\H02 parking request is managed by Tieto Basis -> Sakari Hörkkö's team\n\n19.4.2016");

            } if ( originalDescription.val().match( /sonera verkko/i )
                    || shortDescription.val().match( /sonera verkko/i )
            ) { alert("Sonera verkko match found\n\changes in Sonera verkko are done by Infra Service Owners / Juha Viljamaa\n\n19.4.2016");

            } if ( originalDescription.val().match( /Printer queue/i )
                    || shortDescription.val().match( /Printer queue/i )
            ) { alert("Printer queue match found\n\nBasic printer queue troubleshooting is done by MGSD\n\nPrinter queue management is done by by HCL Active Directory & Printer Support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Druva/i )
                    || shortDescription.val().match( /Druva/i )
            ) { alert("Druva match found\n\Druva in Sync Backup is troubleshooted by MGSD\n\nIf More Space is required / Major issue escalate to HCL End Point Backup\n\n14.4.2016");

            } if ( originalDescription.val().match( /CMT/i )
                    || shortDescription.val().match( /CMT/i )
            ) { alert("CMT match found\n\nCMT Application/access issues are managed by GP Category Support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Citrix/i )
                    || shortDescription.val().match( /Citrix/i )
            ) { alert("Citrix match found\n\nCitrix session troubleshooting (kill Citrix session) is done by MGSD.\n\nCitrix servers are hosted by Tieto\n\n27.4.2016");

            } if ( originalDescription.val().match( /mekunet/i )
                    || shortDescription.val().match( /mekunet/i )
            ) { alert("mekunet match found\n\nmekunet is managed by: AMS Forest systems support\n\n27.4.2016");

            } if ( originalDescription.val().match( /phone plan/i )
                    || shortDescription.val().match( /phone plan/i )
                    || originalDescription.val().match( /liittymä/i )
                    || shortDescription.val().match( /liittymä/i )
            ) { alert("Phone Plan match found\n\changes in phone plans are done by Onsite\n\n2.5.2016");

            } if ( originalDescription.val().match( /FIM/i )
                    || shortDescription.val().match( /FIM/i )
                    || originalDescription.val().match( /Forefront Identity Management/i )
                    || shortDescription.val().match( /Forefront Identity Management/i )
            ) { alert("FIM match found\n\nAdvanced FIM (Forefront Identity Management) issues are managed by Infra Service Owners / Jarkko Lehtola\n\n FIM Finance:\nIf Wrong title in FIM assign to: AMS HR Support14.4.2016");

            } if ( originalDescription.val().match( /AirWatch/i )
                    || shortDescription.val().match( /AirWatch/i )
            ) { alert("AirWatch match found\n\nAirWatch Application is troubleshooted by MGSD and Tieto\n(See routing Matrix)\n\n14.4.2016");

            } if ( originalDescription.val().match( /Innolink/i )
                    || shortDescription.val().match( /Innolink/i )
                    || originalDescription.val().match( /asiakaspalautejärjestelmä/i )
                    || shortDescription.val().match( /asiakaspalautejärjestelmä/i )
            ) { alert("Innolink/asiakaspalautejärjestelmä match found\n\Innolink is managed by AMS Purchasing support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Metso Web/i )
                    || shortDescription.val().match( /Metso Web/i )
                    || originalDescription.val().match( /website/i )
                    || shortDescription.val().match( /website/i )

            ) { alert("Metso Web/Website match found\n\nMetso websites are handled by COMMS Digital Channels\n\n17.3.2016");

            } if ( originalDescription.val().match( /Account/i )
                    || shortDescription.val().match( /Account/i )
            ) {
    var txt;
    var r = confirm('Account match found\n\nAD, ServeMe Account and SD Chat acc. is done by HCL Global account management. 17.2.2016) \n (Blue caller, Shared Account, Temporary Account and External Account) \n\nBasic AD user account modification can be done by SD (otherwise GAM)\n\n Ask Users Line Manager for approval \n\n Press OK to open request form which needs to be filled in before sending to GAM');
    if (r == true) {
        window.open('https://metsa.service-now.com/sys_attachment.do?sys_id=05becc2dd12442001e9fb04e4dd8a7da');
        return;
    };

            } if ( originalDescription.val().match( /endpoint protection/i )
                  || shortDescription.val().match( /endpoint protection/i )
                  || originalDescription.val().match( /endpoint exclusion/i )
                  || shortDescription.val().match( /endpoint exclusion/i )
            ) { alert("System Center Endpoint Protection is handled by HCL Endpoint Security Services (old:Tieto)\n\n24.5.2016");

            } if ( originalDescription.val().match( /Vaunun poistaminen/i )
                  || shortDescription.val().match( /Vaunun poistaminen/i )
                  || originalDescription.val().match( /VR transport/i )
                  || shortDescription.val().match( /VR transport/i )
                  || originalDescription.val().match( /VR-transport/i )
                  || shortDescription.val().match( /VR-transport/i )

            ) { alert("Vr Transport match found.\n\nVr transport requests are handled by AMS Forest systems support\n\n11.3.2016");

            } if ( originalDescription.val().match( /Porstua/i )
                  || shortDescription.val().match( /Porstua/i )

            ) { alert("Porstua IP-planning is done by AMS Reporting support\n\n14.3.2016");

            } if ( originalDescription.val().match( /Patikka/i )
                  || shortDescription.val().match( /Patikka/i )

            ) { alert("Patikka match found\n\n Patikka is supported by: AMS Forest systems support\n\nPatikka installation is done by MGSD:\nadd OR value at Pager field (telephone tab) in AD\n\n5.5.2016");

            } if ( originalDescription.val().match( /Maximo/i )
                  || shortDescription.val().match( /Maximo/i )

            ) { alert("Maximo match found\n\n Maximo Tissue Maximo plant maintenance is managed by IBM support resolvers\n\n9.5.2016");

            } if ( originalDescription.val().match( /documentum/i )
                  || shortDescription.val().match( /documentum/i )

            ) { alert("documentum match found\n\n documentum group (COMMON_APP_archivist) is added by MGSD\n\n27.4.2016");


            } if ( originalDescription.val().match( /inter call/i )
                    || shortDescription.val().match( /inter call/i )
            ) { alert("inter call access management is handled by HCL Global account management\n\n10.3.2016");

            } if ( originalDescription.val().match( /federation/i )
                    || shortDescription.val().match( /federation/i )
            ) { alert("Federation can be enabled for the user using AD");

            } if ( originalDescription.val().match( /power meeting/i )
                    || shortDescription.val().match( /power meeting/i )
            ) { alert("Power Meeting can be enabled for the user using AD:\n\Communicatons tab > Meeting Settings\n\nPower Meeting size limit is 250");

            } if ( originalDescription.val().match( /VPN/i )
                    || shortDescription.val().match( /VPN/i )
            ) { alert("VPN troubleshooting is done by MGSD (See Shared drive for instructions)\nInternal access/modification is done by MGSD (See Shared drive for instructions)\n\nExternal/Partner access/modification is done by Cygate");

            } if ( originalDescription.val().match( /trust relationship/i )
                    || originalDescription.val().match( /trust relationship/i )
            ) {
    var txt;
    var r = confirm('Incase there is trust relationship issues try to firs enabale the users computer in AD if this does not help follow the instructions (swe)');
    if (r == true) {
        window.open('https://extranet.cargotec.com/sites/ext122/GSD%20%20Global%20Service%20Desk/GSD%20Finland/Swedish%20local%20specific%20documentation/Trust%20relationship.docx');
        return;
    };


            } if ( originalDescription.val().match( /STM/i )
                    || shortDescription.val().match( /STM/i )
                    || shortDescription.val().match( /Smart Test Manager/i )
                    || originalDescription.val().match( /Smart Test Manager/i )
            ) { alert("Smart Test Manager (STM) tickets should be resolved using the following template:\n---\nDear User,\n\nThis message is to confirm you that your incident at OneDesk has been resolved.\n\nSolution: STM tickets are handled by Rakesh Kulkarni and Parijat Saxena directly without OneDesk. They should be contacted directly by emailing ext.rakesh.kulkarni@cargotec.com.\n\nThank you for using OneDesk and we wish you a nice day.\n---");

            } if ( originalDescription.val().match( /SMTP relay/i )
                    || shortDescription.val().match( /SMTP relay/i )
            ) { alert("SMTP relay order match found\n\nSMTP relay orders are managed by csc.fi@tieto.com (Tieto) once a SMTP relay order form is filled out\n(See routing matrix/shared drive for the form)\n\n19.4.2016");


            } if ( originalDescription.val().match( /comma to dot/i )
                    || shortDescription.val().match( /comma to dot/i )
                    || shortDescription.val().match( /comma till dot/i )
                    || originalDescription.val().match( /comma till dot/i )
            ) { alert("Mekko graphics installation is done by OneDesk (see exceptions tracker)");

                                                } if ( originalDescription.val().match( /manusearch/i )
                    || shortDescription.val().match( /manusearch/i )
            ) { alert("Mekko graphics installation is done by OneDesk (see exceptions tracker)");

            } if ( originalDescription.val().match( /image/i )
                    || shortDescription.val().match( /image/i )
            ) { alert("Image match found\n\nIf problems with Image/image issues contact HCL Image Management\n\n21.3.2016");


            } if ( originalDescription.val().match( /Mobility/i )
                    || shortDescription.val().match( /Mobility/i )
            ) { alert('If problems with One-Mobility re-install via application catalog \n\nand remove .odb files from \nC:\Users\"username"\AppData\Local\VirtualStore\Program Files (x86)\Microsoft\Mobility_Install');

            } if ( originalDescription.val().match( /DHCP/i )
                    || shortDescription.val().match( /DHCP/i )
            ) { alert('DHCP match found\n\nDHCP (if not MLG.FIN) is managed by HCL Active Directy and Printer Support\n\nMLG.FIN is managed by Onsite (according to IP location)\n\n21/3/2016');

            } if ( originalDescription.val().match( /Telex/i )
                    || shortDescription.val().match( /Telex/i )
            ) { alert('Telex match found\n\nTelex number change is done by HCL Global Account Management\n\n20.4.2016');

            } if ( originalDescription.val().match( /new user/i )
                    || shortDescription.val().match( /new user/i )
                    || originalDescription.val().match( /account creation/i )
                    || shortDescription.val().match( /account creation/i )
                    || originalDescription.val().match( /ad account/i )
                    || shortDescription.val().match( /ad account/i )
                    || originalDescription.val().match( /uusi työntekijä/i )
                    || shortDescription.val().match( /uusi työntekijä/i )
                    || originalDescription.val().match( /active directory account/i )
                    || shortDescription.val().match( /active directory account/i )
            ) { alert('AD account match found\n\nBasic Modification of user information/groups is done by SD\n\nAD account Creation/Deletion & new user account is done by HCL GAM team\nattach user access request form for creation (See Routing Matrix for path)\n\n20.4.2016');

            } if ( originalDescription.val().match( /identity/i )
                    || shortDescription.val().match( /identity/i )
            ) { alert('Identity match found\n\nThe identity manager for Metso is: Jarkko Lehtola\n\n1/4/2016');

            } if ( originalDescription.val().match( /Concur/i )
                    || shortDescription.val().match( /Concur/i )
            ) { alert('Concur match found\n\nConcur is managed by TM Global TST\n\n4/4/2016');

            } if ( originalDescription.val().match( /BitApps/i )
                    || shortDescription.val().match( /BitApps/i )
            ) { alert('BitApps match found\n\BitApps is managed by AMS Forest systems support\n\n2/5/2016');

            } if ( originalDescription.val().match( /Logforce/i )
                    || shortDescription.val().match( /Logforce/i )
            ) { alert('Logforce match found\n\Logforce is managed by AMS Forest systems support\n\n4/4/2016');

            } if ( originalDescription.val().match( /thinclient/i )
                    || shortDescription.val().match( /thinclient/i )
            ) { alert('thinclient match found\n\thinclient invoice is managed by AMS Finance support\n\n4/4/2016');

            } if ( originalDescription.val().match( /autocad/i )
                    || shortDescription.val().match( /autocad/i )
            ) { alert('autocad match found\n\autocad licenses are managed by OSS / Jimmy andersson\n\n6/4/2016');

            } if ( originalDescription.val().match( /Palo Alto/i )
                    || shortDescription.val().match( /Palo Alto/i )
            ) { alert('Palo Alto match found\n\Palo Alto Firewall openings are done by Cygate\n\n12/4/2016');

            } if ( originalDescription.val().match( /license/i )
                    || shortDescription.val().match( /license/i )
                    || shortDescription.val().match( /lisens/i )
                    || originalDescription.val().match( /lisens/i )
            ) { alert('License match found\n\nThe license manager for Metso is: Alf Burge\n\n1/4/2016');

            } if ( originalDescription.val().match( /PCR/i )
                    || shortDescription.val().match( /PCR/i )
                    || shortDescription.val().match( /MCR/i )
                    || originalDescription.val().match( /MCR/i )
                    || shortDescription.val().match( /CCR/i )
                    || originalDescription.val().match( /CCR/i )
                    || shortDescription.val().match( /eXCR/i )
                    || originalDescription.val().match( /eXCR/i )
            ) { alert('PCR/MCR/CCR/eXCR match found\n\nThese issues are handled by: AMS MDM Support\n\n1/4/2016');

            } if ( originalDescription.val().match( /Security Group/i )
                    || shortDescription.val().match( /Security Group/i )
            ) { alert('Security group match found\n\nSecurity groups are created by HCL Global Account Management\n\n22/3/2016');

            } if ( originalDescription.val().match( /email account/i )
                    || shortDescription.val().match( /email account/i )
                    || shortDescription.val().match( /mail account/i )
                    || originalDescription.val().match( /mail account/i )
            ) { alert('email account match found\n\nEmail accounts are created by HCL Global Account Management\n\n22/3/2016');

            } if ( originalDescription.val().match( /Tuntilehti/i )
                    || shortDescription.val().match( /Tuntilehti/i )
            ) { alert('Tuntilehti match found\n\nIf problems with Tuntilehti Login:\n Ulock the AD account/password reset (Uncheck "user must change password")\n\nTuntilehti access is managed by:\nHR Payroll/Palkanlaskenta Finland\n\n22/3/2016');

            } if ( originalDescription.val().match( /ADFS/i )
                    || shortDescription.val().match( /ADFS/i )
            ) { alert('ADFS match found\n\nADFS is managed by Tieto\n\n23/3/2016');

            } if ( originalDescription.val().match( /eDocs/i )
                    || shortDescription.val().match( /eDocs/i )
            ) { alert('eDocs match found\n\eDocs issues are handled by Onsite\n\n23/3/2016');

            } if ( originalDescription.val().match( /otso/i )
                    || shortDescription.val().match( /otso/i )
            ) { alert('otso match found\n\otso issues are handled by AMS SUPPLY CHAIN FOREST\n\1/4/2016');

            } if ( originalDescription.val().match( /varian/i )
                    || shortDescription.val().match( /varian/i )
            ) { alert('varian match found\n\Varian space reservation issues are handled by ADM Varian\n\1/4/2016');

            } if ( originalDescription.val().match( /xerox/i )
                    || shortDescription.val().match( /xerox/i )
            ) { alert('Xerox match found\n\nXerox user related printing Issues are handled by MGSD (See Shared Drive for instructions)\n\nIf Printer has a ID tag escalate ticket to Xerox otherwise contact Onsite regarding the issue.\n\n23/3/2016');

              } if ( originalDescription.val().match( /mgvd/i )
                    || shortDescription.val().match( /mgvd/i )
                    || shortDescription.val().match( /virtual desktop/i )
                    || originalDescription.val().match( /virtual desktop/i )
            ) { alert('MGVD match found\n\nMGVD account modification / Access is done by MGSD (RDS)\n\nMGVD password reset is done in Active directory by MGSD\n\n23/3/2016');

            } if ( originalDescription.val().match( /Software Center/i )
                    || shortDescription.val().match( /Software Center/i )
            ) { alert('Software Center match found\n\nIf Software Center updates are stuck please follow the instructions on Shared drive.\n\nIf there are SC problems we are unable to resolve send a detailed description of the issue to HCL SCCM\n\n22/3/2016');

            } if ( originalDescription.val().match( /Duty Ring Roster/i )
                    || shortDescription.val().match( /Duty Ring Roster/i )
            ) { alert('Duty Ring Roster match found\n\nThe DRR is managed by MGSD on Extranet (see routing matrix for link)\n\nDocuments > OSS Operations > Duty ring roster ---> [...] <---  > Edit\n\n31/3/2016');

            } if ( originalDescription.val().match( /Intranet/i )
                    || shortDescription.val().match( /Intranet/i )
                    || shortDescription.val().match( /Extranet/i )
                    || originalDescription.val().match( /Extranet/i )
                    || shortDescription.val().match( /Sharepoint/i )
                    || originalDescription.val().match( /Sharepoint/i )
                    || shortDescription.val().match( /teamsite/i )
                    || originalDescription.val().match( /teamsite/i )
                    || shortDescription.val().match( /Team Site/i )
                    || originalDescription.val().match( /team site/i )
            ) { alert('Intranet/Extranet/Sharepoint match found\n\nThese are managed by COMMS Digital Channels\n\n30/3/2016');

                           } if ( originalDescription.val().match( /bunkerworld/i )
                    || shortDescription.val().match( /bunkerworld/i )
            ) { alert('bunkerworld match found\n\nIf there are issues with bunkerworld contact: Contact: Ravi Kashap\n\n30/3/2016');

            } if ( originalDescription.val().match( /ICT Shop/i )
                    || shortDescription.val().match( /ICT Shop/i )
            ) {
    var txt;
    var r = confirm('ICT Shop match found\n\n ICT shop problems are handled by HCL Active Directy and Printer Support\n\nPress OK to be redirected to the ICT shop\n\n21/3/2016');
    if (r == true) {
        window.open('http://ictshop.metsagroup.com.mgr.ads/shopping/');
        return;
    };

                          } if ( originalDescription.val().match( /SKF/i )
                    || shortDescription.val().match( /SKF/i )
            ) { alert('SKF match found\n\n For SKF server issues contact joni.kirtola@skf.com\n\n10/5/2016');

                          } if ( originalDescription.val().match( /APF/i )
                    || shortDescription.val().match( /APF/i )
            ) { alert('APF match found\n\n For APF FTP issues contact HCL SCCM\n\n11/5/2016');

                            } if ( originalDescription.val().match( /ecoonline/i )
                    || shortDescription.val().match( /ecoonline/i )
                    || originalDescription.val().match( /eco online/i )
                    || shortDescription.val().match( /eco online/i )
                    || originalDescription.val().match( /KTT/i )
                    || shortDescription.val().match( /KTT/i )
                    || originalDescription.val().match( /eplus/i )
                    || shortDescription.val().match( /eplus/i )
                    || originalDescription.val().match( /e plus/i )
                    || shortDescription.val().match( /e plus/i )
            ) {
    var txt;
    var r = confirm('Eco Online match found\n\n Eco Online problem steps can be seen in the Routing Matrix\n\nPress OK to be redirected to the Routing Matrix\n\n21/4/2016');
    if (r == true) {
        window.open('https://docs.google.com/spreadsheets/d/1ei7GD1bq3fjlIxtFI5uDOhv2bH8gNqzFj966zqSLT0Y');
        return;
    };

           } if ( originalDescription.val().match( /Phone to voice/i )
                    || shortDescription.val().match( /Phone to voice/i )
            ) {
    var txt;
    var r = confirm('Phone to voice match found\n\nPhone to voice feature is enabled by SD\nOffice 365 > Admin\n\nPress OK to be redirected to Office 365 portal\n\n22.3.2016');
    if (r == true) {
        window.open('https://login.microsoftonline.com/login.srf');
        return;
    };


            } if ( originalDescription.val().match( /print/i )
                    || shortDescription.val().match( /printer/i )
                    || originalDescription.val().match( /printer/i )
                    || shortDescription.val().match( /print/i )
            ) {
    var txt;
    var r = confirm('Printer match found\n\nWLAN Printer hosting is done by Cygate\n\nif printer problem check printerspool in addtion to normal troubleshooting. Press OK to open printer instructions\n\n18/4/2016');
    if (r == true) {
        window.open('https://extranet.cargotec.com/sites/ext122/GSD%20%20Global%20Service%20Desk/GSD%20Finland/Swedish%20local%20specific%20documentation/Printer%20instructions.docx');
        return;
    };

            } if ( originalDescription.val().match( /KeyUser list/i )
                    || shortDescription.val().match( /KeyUser list/i )
                    || originalDescription.val().match( /SuperUser list/i )
                    || shortDescription.val().match( /SuperUser list/i )
                    || originalDescription.val().match( /Super User list/i )
                    || shortDescription.val().match( /Super User list/i )
                    || originalDescription.val().match( /Key User list/i )
                    || shortDescription.val().match( /Key User list/i )
                    || originalDescription.val().match( /SU list/i )
                    || shortDescription.val().match( /SU list/i )
            ) { alert('Key User/Super user match found\n\nThese lists are updated by MGSD under:\nKnowledge Base > Authorized Requestors >  BIZ Application super users, Group and BA 2016\n\n22/3/2016');

                           } if ( originalDescription.val().match( /Virus/i )
                    || shortDescription.val().match( /Virus/i )
                    || originalDescription.val().match( /infection/i )
                    || shortDescription.val().match( /infection/i )
            ) { alert('Virus/Infection match found\n\nadvanced workstation virus troubleshooting is done by:\nHCL Endpoint Security Services\n\n22/3/2016');


            } else {
                alert("No other match found"); //+ originalDescription.val()
            }
       });

    }


    //END Check ticket

    */

    //Start Autofill

    /*
        if ( toLabel.length ) {
        $( toLabel ).append(
            '<div class="AutoFill-button" style="display:inline-block; margin: 0 2px; border: 1px solid black; background-color: #D1F9F5; padding: 0 2px; cursor: pointer;">AutoFill</div>'
        );
        $( '.AutoFill-button' ).click( function() {



            if ( shortDescription.val() === '' ) {
    greeting = "Good morning";
} else if (time < 20) {
    greeting = "Good day";
} else {
    greeting = "Good evening";
}

          */          //End autofill




    /* DISABLED FOR THE TIME BEING (Automatically fills in SAP tickets)

        if ( ProjectRelated.length ) {
        $( ProjectRelated ).append(
            '<div class="SAPunlock-button"  style="display:inline-block; margin: -80 1px; border: 1px solid black; background-color: #d1e9f9; padding: 0 2px; cursor: pointer;">SAPunlock</div>'
        );
        $( '.SAPunlock-button' ).click( function() {


             if ( shortDescription.val() === '' ) {
                 shortDescription.valWithDelay('SAP account locked');
                if ( originalDescription.val() === '' ) {
                    originalDescription.valWithDelay('The user called in reporting hes SAP account was locked out. I have unlocked the account which solved the issue.');
                }
                 }

            state.valWithDelay( '6' );
            internalWorkNotes.valWithDelay('The user called and the SAP account has been locked. The account has now been unlocked');
            group.valWithDelay2( defaultAssignmentGroup );
to.valWithDelay2( ownName );
            type.valWithDelay2( '8' );
            closeNotes.valWithDelay( trigger2InteralWorkNotes );
closeCode.valWithDelay( defaultCloseCode );
});
    }


    */





        if ( dueDate.length ) {
        $( dueDate ).append(
            '<div class="Phone-button" style="display:inline-block; border-radius: 3px; margin: 10px 0px 0px 10px; border: 1px solid black; background-color: #D3D3D3; padding: 0 9px; cursor: pointer;">Phone</div>'
        );
        $( '.Phone-button' ).click( function() {
           contactType.valWithDelay( 'phone' );
        //   group.valWithDelay( 'HCL Service Desk India HD' );

         });
    }

        if ( dueDate.length ) {
        $( dueDate ).append(
            '<div class="Chat-button" style="display:inline-block; border-radius: 3px; margin: 10px 0px 0px 5px; border: 1px solid black; background-color: #D3D3D3; padding: 0 9px; cursor: pointer;">Chat</div>'
        );
        $( '.Chat-button' ).click( function() {
           contactType.valWithDelay( 'chat' );
        //   group.valWithDelay( 'HCL Service Desk India HD' );

         });
    }

        if ( stateEl.length ) {
        $( stateEl ).append(
            '<div class="PendingVendor-button" style="display:inline-block; border-radius: 3px; margin: 5px 0px 0px 10px; border: 1px solid black; background-color: #add8e6; padding: 0 8px; cursor: pointer;">Pending Vendor</div>'
        );
        $( '.PendingVendor-button' ).click( function() {
           state.valWithDelay( '-5' );
           g_form.setValue('work_notes','Pending vendor' );
           g_form.setValue('comments','Pending vendor');
           subStatus.valWithDelay( 'Vendor' );
        //   group.valWithDelay( 'HCL Service Desk India HD' );

         });
    }

        if ( contacttypeEl.length ) {
        $( contacttypeEl ).append(
            '<div class="WorkinProgress-button" style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 8px; border: 1px solid black; background-color: #FFFFE0; padding: 0 8px; cursor: pointer;">Work in Progress</div>'
        );
        $( '.WorkinProgress-button' ).click( function() {
           state.valWithDelay( '2' );

         });
    }

        if ( maincatEl.length ) {
        $( maincatEl ).append(
            '<div class="Gclose-button" style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 10px; border: 1px solid black; background-color: #add8e6; padding: 0 4px; cursor: pointer;">Generic Action</div>'
        );
        $( '.Gclose-button' ).click( function() {
    if ( shortDescription.val().match( /griffin password/i)
    || originalDescription.val().match( /griffin password/i )

            ) {                   state.valWithDelay( '3' );
           commentsToCaller.val( 'Uusi salasana lähetetty.' );
                 } if ( shortDescription.val().match( /Griffin account locked/i )
                    || shortDescription.val().match( /Griffin account locked/i )
            ) {           state.valWithDelay( '3' );
           commentsToCaller.val( 'Käyttäjätili avattu.' );
            } else if ( shortDescription.val().match( /Checkpoint - Grant Access/i )
            ) {           state.valWithDelay( '3' );
           commentsToCaller.val( 'Access granted' ); //Metso Mailbox creation starts
            } else if ( internalWorkNotes.val().match( /Proxy Address Collection/i )
            ) {            state.valWithDelay( '3' );
           commentsToCaller.val( 'Access Granted.' );
           g_form.setValue('work_notes','Access Granted.');

                }             else if ( shortDescription.val().match( /Applications Delivery - Remove Access for/i )
            ) {           state.valWithDelay( '3' );
           commentsToCaller.val( 'Access Removed.' );
           g_form.setValue('work_notes','Access Removed.');
                } else if ( originalDescription.val().match( /External/i ) && CallerValueSRQ.CallerUsername.match( /k/i )
            ) {
    var fullName = requestedFor.split(' ');
    firstName = fullName[0];
           state.valWithDelay( '3' );
           g_form.setValue('work_notes','Email Sent to the Users Manager to recreate the request.' );
           commentsToCaller.val( 'K user-id detected on a External user account request. Kindly rise a new request for Internal Access' );
           window.location.href = "mailto: "+ CallerValueSRQ.ManagerEmail +" ?subject=Invalid access request for "+ fullName +"&body=Hi%20"+ CallerValueSRQ.ManagerFirstName +",%0A%0AInternal%20user-id%20detected%20on%20a%20Visitor%20user%20account%20request.%0A%0AKindly%20Re-create%20the%20request%20for%20Internal%20access.%0A%0A%0A%0A";

                }
            else if ( originalDescription.val().match( /Internal/i ) && CallerValueSRQ.CallerUsername.match( /v/i )
            ) {
    var fullName = requestedFor.split(' ');
    firstName = fullName[0];
           state.valWithDelay( '3' );
           g_form.setValue('work_notes','Email Sent to the Users Manager to recreate the request.' );
           commentsToCaller.val( 'V user-id detected on a Internal user account request. Kindly rise a new request for External Access' );
                     var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            window.location.href = "mailto: "+ CallerValueSRQ.ManagerEmail +" ?subject=Invalid access request for "+ fullName +"&body=Hi%20"+ CallerValueSRQ.ManagerFirstName +",%0A%0AVisitor%20user-id%20detected%20on%20a%20Internal%20user%20account%20request.%0A%0AKindly%20Re-create%20the%20request%20for%20visitor%20access.%0A%0A%0A%0A";
// NO longer disabled
                } else if ( originalDescription.val().match( /Metso External Full Suite User/i ) && CallerValueSRQ.CallerEmail.match( /tieto.com/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+290)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nTIETO EMAIL DETECTED assign to Comms (Sandeep) for final evaluation\n\n1.1 Change E-Mail to: \n'+ CallerValueSRQ.CallerEmail +'\n\n1.2  Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\nNOTES:'+ firstName +' '+ lastName +'/TE/Metso External@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWLIC\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso External Deskless User/i ) && CallerValueSRQ.CallerEmail.match( /tieto.com/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+290)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nTieto EMAIL DETECTED assign F1 license NO YAMMER\n\n1.1 Change E-Mail to: \n'+ CallerValueSRQ.CallerEmail +'\n\n1.2  Metso Target Address:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\n\n2. Proxy Address Collection:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\nNOTES:'+ firstName +' '+ lastName +'TE/Metso External@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWLIC\n\n4. Metso Lync Entitlement:\n0' );

                } else if ( originalDescription.val().match( /Metso External Full Suite User/i ) && CallerValueSRQ.CallerEmail.match( /hcl.com/i ) && CallerValueSRQ.ManagerEmail.match( /marja.varri@Metso.com/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+290)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nHCL EMAIL DETECTED and Marja Varri is the Manager assign E3 License - [x] Microsoft Forms (Plan E3) - NO YAMMER\n\n1.1 Change E-Mail to: \n'+ CallerValueSRQ.CallerEmail +'\n\n1.2  Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\nNOTES:'+ firstName +' '+ lastName +'/USC/Metso External@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWMBX\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso External Deskless User/i ) && CallerValueSRQ.CallerEmail.match( /hcl.com/i ) && CallerValueSRQ.ManagerEmail.match( /marja.varri@Metso.com/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+290)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nHCL EMAIL DETECTED and Marja Varri is the Manager assign F1 license NO YAMMER\n\n1.1 Change E-Mail to: \n'+ CallerValueSRQ.CallerEmail +'\n\n1.2  Metso Target Address:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\n\n2. Proxy Address Collection:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\nNOTES:'+ firstName +' '+ lastName +'/USC/Metso External@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWLIC\n\n4. Metso Lync Entitlement:\n0' );

                } else if ( originalDescription.val().match( /Metso External Full Suite User/i ) && CallerValueSRQ.CallerEmail.match( /genpact.com/i )
            ) {
                //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();


           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nE3 License - Include Microsoft Forms (Plan E3). - NO YAMMER\n\n1.1 Change E-Mail to:\n'+ firstName +'.'+ lastName +'@Metso.com\n\n1.2  Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'/GHO/Metso@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWMBX\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso External Deskless User/i ) && CallerValueSRQ.CallerEmail.match( /genpact.com/i )
            ) {
 //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+680)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nAssign to Comms team (Deepak) for final evaluation\n\n1.1 Change E-Mail to:\n'+ firstName +'.'+ lastName +'@Metso.com\n\n1.2  Metso Target Address:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'/GHO/Metso@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWLIC\n\n4. Metso Lync Entitlement:\n0' );


                }  else if ( originalDescription.val().match( /Metso internal full suite/i )
            ) {
//DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+310)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nE3 License - Include Microsoft Forms (Plan E3). -\n\n1. Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'*****@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWMBX\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso Internal 25GB Size Mailbox/i )
            ) {//DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+310)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nE3 License - Include Microsoft Forms (Plan E3). -\n\n1. Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'*****@\n\n3. Metso Mailbox Type:\nMBX=50GB;TYPE=EP2D;\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso Internal Deskless User/i )
            ) {//DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+310)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nassign F1 license, NO YAMMER\n\n1. Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'*****@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWMBX\n\n4. Metso Lync Entitlement:\n0' );

                } else if ( originalDescription.val().match( /Metso External Full Suite User/i )
            ) {
                //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+370)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();


           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nE3 License - Include Microsoft Forms (Plan E3). - NO YAMMER\n\n1.1 Change E-Mail to:\n'+ firstName +'.'+ lastName +'@visitor.Metso.com\n\n1.2  Metso Target Address:\nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@visitor.Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@visitor.Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'/Metso External@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWMBX\n\n4. Metso Lync Entitlement:\n15' );

                } else if ( originalDescription.val().match( /Metso External Deskless User/i )
            ) {
 //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+680)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nassign F1 license NO YAMMER\n\n1.1 Change E-Mail to: \n'+ CallerValueSRQ.CallerEmail +'\n\n1.2  Metso Target Address:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\n\n2. Proxy Address Collection:\nSMTP:'+ CallerValueSRQ.CallerEmail +'\nNOTES:'+ firstName +' '+ lastName +'/Metso External@\n\nMetso Mailbox Type:\ntype=DESKLESS;status=NEWLIC' );


                }  else if ( originalDescription.val().match( /Metso Raflatac Internal Full Suite User/i )
                    || originalDescription.val().match( /Metso Raflatac External Full Suite User/i )
            ) {//DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+350)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
                    g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nE3 License - Include Microsoft Forms (Plan E3). - - If External (v-id user) No Yammer\n\n1.1 Change E-Mail to: \n'+ firstName +'.'+ lastName +'@Metsoraflatac.com\n\n1.2 Metso Target Address: \nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nNOTES:'+ firstName +' '+ lastName +'/RAF/Metso@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWMBX\n\n4. Metso Lync Entitlement:\n15');

                } else if ( originalDescription.val().match( /Metso Raflatac 25GB Size Mailbox/i )
            ) {
                //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\n1.1 Change E-Mail to: \n'+ firstName +'.'+ lastName +'@Metsoraflatac.com\n\n1.2 Metso Target Address: \nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metsoraflatac.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'*****@\n\n3. Metso Mailbox Type:\nMBX=50GB;TYPE=EP2D;\n\n4. Metso Lync Entitlement:\n15' );


                } else if ( originalDescription.val().match( /Metso Raflatac Internal Deskless User/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nassign F1 license, - If External (v-id user) No Yammer\n\n1.1 Change E-Mail to: \n'+ firstName +'.'+ lastName +'@Metsoraflatac.com\n\n1.2 Metso Target Address: \nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metsoraflatac.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'/RAF/Metso@\n\n3. Metso Mailbox Type:\ntype=FULL;status=NEWMBX\n\n4. Metso Lync Entitlement:\n0' );


                } else if ( originalDescription.val().match( /Metso Raflatac External Deskless User/i )
            ) {//DEFINE Height

                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
var referenceText = 'User name:';
var Userid = originalDescriptionText.match(new RegExp(referenceText + '\\s(\\w+)'))[1];

EmailCreationName();
           g_form.setValue('work_notes','Copy the user account name to AD to check if there are duplicate accounts\n\nassign F1 license, - If External (v-id user) No Yammer\n\n1.1 Change E-Mail to: \n'+ firstName +'.'+ lastName +'@Metsoraflatac.com\n\n1.2 Metso Target Address: \nMetso Target Address: [DO NOT TOUCH (if empty assign to MDS communications for investigation)]\n\n2. Proxy Address Collection:\nSMTP:'+ firstName +'.'+ lastName +'@Metsoraflatac.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso.com\nsmtp:'+ firstName +'.'+ lastName +'@Metso-kymmene.com\nNOTES:'+ firstName +' '+ lastName +'/RAF/Metso@\n\n3. Metso Mailbox Type:\ntype=DESKLESS;status=NEWLIC\n\n4. Metso Lync Entitlement:\n0' );


                }


            // EMAIL END
            else if ( shortDescription.val().match( /Remove Access/i )
                    || shortDescription.val().match( /Remove Access/i )
            ) {           state.valWithDelay( '3' );
           commentsToCaller.val( 'Access Removed.' );
           g_form.setValue('work_notes','Access Removed.');
                } else if ( shortDescription.val().match( /- Grant Access/i )
                    && originalDescription.val().match( /Manual provisioning information/i ) || originalDescription.val().match( /Entitlement: Condeco User/i ) || originalDescription.val().match( /Entitlement: AutoCAD/i )
            ) {
                    state.valWithDelay( '-5' );
                          subStatus.valWithDelay2( 'Customer Action' );

                    var fullName = requestedFor.split(' ');
    firstName = fullName[0];

           commentsToCaller.valWithDelay( 'Hi '+ firstName +',\n\nWe would need to install the requested application for you.\n\nIn order for us to be able to install this for you we need your workstation name e.g. W3435754 and your computer has to be connected to the Metso internal network.\n\nFeel free to call us on +358 2041 46000 when you find the time and have the computer connected to the network.' );
/* onLoad()  needed? */
            } else {
               // alert("No other match found"); //+ originalDescription.val()
            }
       });

    }

        /*

        {
              if ( shortDescription.val() === 'New Griffin password') {
           state.valWithDelay( '3' );
           commentsToCaller.val( 'Uusi salasana lähetetty.' );
        } else if ( shortDescription.val().match( /Applications Delivery - Remove Access/i )

                    {
           state.valWithDelay( '3' );
           commentsToCaller.val( 'Removed.' );

                    } else {
                        alert("No Match found");
                   }

         });
    }
  */
            //Submit and return

      if ( maincatEl.length ) {
        $( maincatEl ).append(
            '<div class="SubmitReturn-button"  style="display:inline-block; border-radius: 3px; margin:  5px; border: 1px solid black; background-color: #88E188; padding: 0 2px; cursor: pointer;">Submit&Return</div>'
        );
        $( '.SubmitReturn-button' ).click( function()   {
    if ( originalDescription.val().match( /folder access/i)
    || shortDescription.val().match( /folder access/i )
    || originalDescription.val().match( /shared folder/i )
    || shortDescription.val().match( /shared folder/i )
    || originalDescription.val().match( /shared drive/i )
    || shortDescription.val().match( /shared drive/i )
    || originalDescription.val().match( /\\/i )
    || shortDescription.val().match( /\\/i )
    || originalDescription.val().match( /kansio/i )
    || shortDescription.val().match( /kansio/i )


            ) {        alert("Shared drive/Folder access match found \n\nRead or write access?(ask if not mentioned in the ticket.)\n\nFolder access changes need to be Approved by the users LIM\n\nAfter these steps the ticket should be sent to the GAM team \n\n 22.2.2016");

            } if ( originalDescription.val().match( /DL/i )
                    || originalDescription.val().match( /distributionlist/i )
                    || originalDescription.val().match( /distribution list/i )
                    || shortDescription.val().match( /distribution list/i )
                    || shortDescription.val().match( /distributionlist/i )
                    || shortDescription.val().match( /DL/i )
            ) {        alert("DL list match found\n\nIf the user requests a new DL list the request should be sent to HCL Global account management \n\nDL List Modification is handled by Metso group SD\n\nChanges need to be approved by the owner (if there's no owner ask local IT manager for approval.)\n\nChanges can be done in AD\n\(In swedish folder access cases assign to Swedish Onsite)\n\n 14.4.2016");

            } if ( originalDescription.val().match( /shared mailbox/i )
                    || shortDescription.val().match( /shared mailbox/i )
                    || originalDescription.val().match( /mailbox access/i )
                    || shortDescription.val().match( /mailbox access/i )
                    || originalDescription.val().match( /shared email box/i )
                    || shortDescription.val().match( /shared email box/i )
                    || originalDescription.val().match( /shared email-box/i )
                    || shortDescription.val().match( /shared email-box/i )
            ) {        alert("New shared Mailboxes are created by the HCL Global account management team (LIM approval is needed)\n\nChanges in existing mailboxes need to be approved by the owner If there's no owner ask local IT manager for approval\n\nChanges in existing mailboxes is done by Metso SD in the OFFICE 365 portal (See shared drive for instructions)\n\n 14.4.2016");

            } if ( originalDescription.val().match( /email license/i )
                    || shortDescription.val().match( /email license/i )
                    || originalDescription.val().match( /mail license/i )
                    || shortDescription.val().match( /mail license/i )
            ) {        alert("Email license match found\n\nEmail licenses are handled by HCL Global account Management\n\n22.3.2016");

            } if ( originalDescription.val().match( /kotka/i )
                    || shortDescription.val().match( /kotka/i )
            ) {        alert("Kotka match found\n\nKotka issues are managed by AMS Forest systems support\n\Kotka access issues are managed by AMS SAP Authorization\n\nIf Kotka does not start Remove kotka.db3 based on the instructions\n(See Routing matrix for the instructions)\n\n9.5.2016");

           } if ( originalDescription.val().match( /New Laptop/i )
                    || shortDescription.val().match( /New Laptop/i )
                    || originalDescription.val().match( /image/i )
                    || shortDescription.val().match( /image/i )
            ) {        alert("New Laptop/Image match found\n\nthese tickets should be sent to: HCL Imaging and Installation Center\n\n9.5.2016");

            } if ( originalDescription.val().match( /Bitlocker/i )
                    || shortDescription.val().match( /Bitlocker/i )
                    || originalDescription.val().match( /computer locked/i )
                    || shortDescription.val().match( /computer locked/i )
                    || originalDescription.val().match( /kone lukossa/i )
                    || shortDescription.val().match( /kone lukossa/i )
            ) {        alert("Bitlocker match found\n\nBitlocker unlocking is done by MGSD\n(See shared drive for instructions)\n\nEncrypting a Existing Machine is done by HCL Active Directory & Printer Support\n\nIf Bitlocker key is invalid contact HCL Endpoint Security Services\n\n22.3.2016");

            } if ( originalDescription.val().match( /SAP/i )
                    || shortDescription.val().match( /SAP/i )
                    || originalDescription.val().match( /P07/i )
                    || shortDescription.val().match( /P07/i )
|| originalDescription.val().match( /AP7/i )
                    || shortDescription.val().match( /AP7/i )
|| originalDescription.val().match( /P09/i )
                    || shortDescription.val().match( /P09/i )
|| originalDescription.val().match( /P02/i )
                    || shortDescription.val().match( /P02/i )
|| originalDescription.val().match( /P2A/i )
                    || shortDescription.val().match( /P2A/i )
|| originalDescription.val().match( /P2I/i )
                    || shortDescription.val().match( /P2I/i )
|| originalDescription.val().match( /P50/i )
                    || shortDescription.val().match( /P50/i )
|| originalDescription.val().match( /P6R/i )
                    || shortDescription.val().match( /P6R/i )
                    || originalDescription.val().match( /P6A/i )
                    || shortDescription.val().match( /P6A/i )
|| originalDescription.val().match( /MYP/i )
                    || shortDescription.val().match( /MYP/i )
|| originalDescription.val().match( /P12/i )
                    || shortDescription.val().match( /P12/i )
|| originalDescription.val().match( /FSP/i )
                    || shortDescription.val().match( /FSP/i )
|| originalDescription.val().match( /P80/i )
                    || shortDescription.val().match( /P80/i )
|| originalDescription.val().match( /MyCube/i )
                    || shortDescription.val().match( /MyCube/i )
|| originalDescription.val().match( /Vesuri/i )
                    || shortDescription.val().match( /Vesuri/i )
|| originalDescription.val().match( /One+/i )
                    || shortDescription.val().match( /One+/i )
            ) {
    var txt;
    var r = confirm('SAP match found.\n\nPassword Reset and unlocking is done by Metso SD\n(SAP password reset and ID unlock instructions are found on the Shared Drive)\n\nSAP Password reset/unlock can be done for the following systems by SD:\n-----\nFibre mbSAP P07\nFibre SCM AP7\nBMS P09\nBoard Runboard P02\nBoard Planboard P2A\nBoard TM P2I\nForest Vesuri P50\nTissue One+ P6R\nTissue One+ P6A\nWood MyCube MYP\nWood SCM P12\nGroup Finance FSP\nGroup HR P80\n-----\n\nSAP account access/validity extension > AMS authorization\nFSQ SAP TEST pw reset > AMS Authorization support \n\nSAP Printing is managed by AMS Unclassified\n\nPress OK for SAP dispatching rules\n\n14.4.2016');
    if (r == true) {
        window.open('https://collaboration.metsagroup.com/en/Collaboration/gs-new-eus-coop/default.aspx?RootFolder=%2Fen%2FCollaboration%2Fgs-new-eus-coop%2FLists%2Fdocuments%2FService%20Desk%20Operations%2FService%20Desk%20SOP%2FApplications%20SOP%27s%2FSAP&FolderCTID=0x01200079932935EEF4C049B7582EFFC42CFE9E&View={2F578C0A-5016-46B2-B899-BFE3E8E37543}');
        return;
    };

          } if ( originalDescription.val().match( /tips/i )
                    || shortDescription.val().match( /tips/i )
            ) {
    var txt;
    var r = confirm('TIPS match found.\n\nTips Password = AD Password MES tips incidents should be concidered CRITICAL\n\nAsk the following questions:\n---\nWhat application are you using, is it MES TIPS?\nPlease describe the problem and the impact to production\nIs there a problem with a office or production PC?\nWhat factory/location\n\nWho is the Metso onsite contact for further contacts on this incident?\n- Ask the phone number for the contact.\n---\n\nMain Category:Mill Systems\nSub Category:MES Tips\n\nPROCESS:\nAssing the ticket first to Tieto, then call them at +420597158402 to ensure incident has reached Tieto in their ticket tool (TONE).\n\nAlso Send a ticket to Onsite and call them. (See Onsite List)\n\n[Backup number for TIPS/MES support +358 2072 69444]\n\nSee instructions for new TIPS SMS process');
    if (r == true) {
        window.open("https://collaboration.metsagroup.com/en/Collaboration/gs-new-eus-coop/Lists/documents/Service Desk Operations/Service Desk SOP/Applications SOP's/MES TIPS/TIPS incidents_quick guide.pptx");
        return;
    };


            } if ( originalDescription.val().match( /WLAN/i )
                    || shortDescription.val().match( /WLAN/i )
                    || originalDescription.val().match( /VLAN/i )
                    || shortDescription.val().match( /VLAN/i )
            ) { alert("WLAN/VLAN match found. If problems with WLAN/VLAN assign ticket to Cygate 16.11.2015 ");

            } if ( originalDescription.val().match( /ServeMe/i )
                    || shortDescription.val().match( /ServeMe/i )
            ) { alert("ServeMe match found.\n\nServeMe external account access and Group Creation is managed by HCL Global account management\n\nServeMe group modification is done by SD\nServeMe > Skills > Groups\n\nServeMe user access modification is done by SD\nServeMe Home > ServeMe Users\n\n18.4.2016");

            } if ( originalDescription.val().match( /Exchange/i )
                    || shortDescription.val().match( /Exchange/i )
            ) { alert("Exchange match found.\n\nExchange related issues are handled by HCL Messaging Support Noida\n\n17.3.2016");

            } if ( originalDescription.val().match( /Communication/i )
                    || shortDescription.val().match( /Communication/i )
                    || originalDescription.val().match( /communication list/i )
                    || shortDescription.val().match( /communication list/i )
            ) { alert("Communication match found.\n\nCommunications are done by SD\n\nCommunication list is managed by SD\n\n17.3.2016");

            } if ( originalDescription.val().match( /Address change/i )
                    || shortDescription.val().match( /Address change/i )
                    || originalDescription.val().match( /email address/i )
                    || shortDescription.val().match( /email address/i )
            ) { alert("Email Address/Email Address change match found.\n\nChanges in email address is done by HCL Messaging Support Noida\n\n17.3.2016");

            } if ( originalDescription.val().match( /E3/i )
                    || shortDescription.val().match( /E3/i )
            ) { alert("E3 Match found\n\nOffice Licenses for E3 are granted by HCL Global Account Management\n\n17.3.2016");

            } if ( originalDescription.val().match( /Firewall/i )
                    || shortDescription.val().match( /Firewall/i )
            ) { alert("Firewall match found\n\nCygate is responsible for Metso Firewall changes/modification\n\n17.3.2016");

            } if ( originalDescription.val().match( /sitebase/i )
                    || shortDescription.val().match( /sitebase/i )
            ) { alert("Sitebase match found\n\nSitebase is a application mainly managed by Onsite\n\n17.3.2016");

            } if ( originalDescription.val().match( /WAN connection/i )
                    || shortDescription.val().match( /WAN connection/i )
                    || originalDescription.val().match( /wide area network/i )
                    || shortDescription.val().match( /wide area network/i )
            ) { alert("WAN match found\n\nSonera and Cygate are responsible for Metso WAN changes/modification\n\n17.3.2016");

            } if ( originalDescription.val().match( /Termos/i )
                    || shortDescription.val().match( /Termos/i )
                    || originalDescription.val().match( /laskun mitätöinti/i )
                    || shortDescription.val().match( /laskun mitätöinti/i )
            ) { alert("Termos/laskun mitätöinti match found\n\Termos issues are managed by AMS Finance support\n\n18.4.2016");

            } if ( originalDescription.val().match( /MDS/i )
                    || shortDescription.val().match( /MDS/i )
                    || originalDescription.val().match( /loading order/i )
                    || shortDescription.val().match( /loading order/i )
            ) { alert("Loading order/MDS match found\n\Loading order - prelisting (date selection) (MDS) is managed by AMS reporting support\n\n3.5.2016");

            } if ( originalDescription.val().match( /Amazon/i )
                    || shortDescription.val().match( /Amazon/i )
            ) { alert("Amazon match found\n\nAmazon Workspaces are managed by HCL Global Account Management\n\n14.4.2016");

            } if ( originalDescription.val().match( /desktop shortcut/i )
                    || shortDescription.val().match( /desktop shortcut/i )
            ) { alert("desktop shortcut match found\n\nDefault desktop shortcut change/modification is done by COMMS Digital Channels\n\n19.4.2016");

            } if ( originalDescription.val().match( /parking request/i )
                    || shortDescription.val().match( /parking request/i )
            ) { alert("parking request match found\n\H02 parking request is managed by Tieto Basis -> Sakari Hörkkö's team\n\n19.4.2016");

            } if ( originalDescription.val().match( /sonera verkko/i )
                    || shortDescription.val().match( /sonera verkko/i )
            ) { alert("Sonera verkko match found\n\changes in Sonera verkko are done by Infra Service Owners / Juha Viljamaa\n\n19.4.2016");

            } if ( originalDescription.val().match( /Printer queue/i )
                    || shortDescription.val().match( /Printer queue/i )
            ) { alert("Printer queue match found\n\nBasic printer queue troubleshooting is done by MGSD\n\nPrinter queue management is done by by HCL Active Directory & Printer Support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Druva/i )
                    || shortDescription.val().match( /Druva/i )
            ) { alert("Druva match found\n\Druva in Sync Backup is troubleshooted by MGSD\n\nIf More Space is required / Major issue escalate to HCL End Point Backup\n\n14.4.2016");

            } if ( originalDescription.val().match( /CMT/i )
                    || shortDescription.val().match( /CMT/i )
            ) { alert("CMT match found\n\nCMT Application/access issues are managed by GP Category Support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Citrix/i )
                    || shortDescription.val().match( /Citrix/i )
            ) { alert("Citrix match found\n\nCitrix session troubleshooting (kill Citrix session) is done by MGSD.\n\nCitrix servers are hosted by Tieto\n\n27.4.2016");

            } if ( originalDescription.val().match( /mekunet/i )
                    || shortDescription.val().match( /mekunet/i )
            ) { alert("mekunet match found\n\nmekunet is managed by: AMS Forest systems support\n\n27.4.2016");

            } if ( originalDescription.val().match( /phone plan/i )
                    || shortDescription.val().match( /phone plan/i )
                    || originalDescription.val().match( /liittymä/i )
                    || shortDescription.val().match( /liittymä/i )
            ) { alert("Phone Plan match found\n\changes in phone plans are done by Onsite\n\n2.5.2016");

            } if ( originalDescription.val().match( /FIM/i )
                    || shortDescription.val().match( /FIM/i )
                    || originalDescription.val().match( /Forefront Identity Management/i )
                    || shortDescription.val().match( /Forefront Identity Management/i )
            ) { alert("FIM match found\n\nAdvanced FIM (Forefront Identity Management) issues are managed by Infra Service Owners / Jarkko Lehtola\n\n FIM Finance:\nIf Wrong title in FIM assign to: AMS HR Support14.4.2016");

            } if ( originalDescription.val().match( /AirWatch/i )
                    || shortDescription.val().match( /AirWatch/i )
            ) { alert("AirWatch match found\n\nAirWatch Application is troubleshooted by MGSD and Tieto\n(See routing Matrix)\n\n14.4.2016");

            } if ( originalDescription.val().match( /Innolink/i )
                    || shortDescription.val().match( /Innolink/i )
                    || originalDescription.val().match( /asiakaspalautejärjestelmä/i )
                    || shortDescription.val().match( /asiakaspalautejärjestelmä/i )
            ) { alert("Innolink/asiakaspalautejärjestelmä match found\n\Innolink is managed by AMS Purchasing support\n\n14.4.2016");

            } if ( originalDescription.val().match( /Metso Web/i )
                    || shortDescription.val().match( /Metso Web/i )
                    || originalDescription.val().match( /website/i )
                    || shortDescription.val().match( /website/i )

            ) { alert("Metso Web/Website match found\n\nMetso websites are handled by COMMS Digital Channels\n\n17.3.2016");

            } if ( originalDescription.val().match( /Account/i )
                    || shortDescription.val().match( /Account/i )
            ) {
    var txt;
    var r = confirm('Account match found\n\nAD, ServeMe Account and SD Chat acc. is done by HCL Global account management. 17.2.2016) \n (Blue caller, Shared Account, Temporary Account and External Account) \n\nBasic AD user account modification can be done by SD (otherwise GAM)\n\n Ask Users Line Manager for approval \n\n Press OK to open request form which needs to be filled in before sending to GAM');
    if (r == true) {
        window.open('https://metsa.service-now.com/sys_attachment.do?sys_id=05becc2dd12442001e9fb04e4dd8a7da');
        return;
    };

            } if ( originalDescription.val().match( /endpoint protection/i )
                  || shortDescription.val().match( /endpoint protection/i )
                  || originalDescription.val().match( /endpoint exclusion/i )
                  || shortDescription.val().match( /endpoint exclusion/i )
            ) { alert("System Center Endpoint Protection is handled by HCL Endpoint Security Services (old:Tieto)\n\n24.5.2016");

            } if ( originalDescription.val().match( /Vaunun poistaminen/i )
                  || shortDescription.val().match( /Vaunun poistaminen/i )
                  || originalDescription.val().match( /VR transport/i )
                  || shortDescription.val().match( /VR transport/i )
                  || originalDescription.val().match( /VR-transport/i )
                  || shortDescription.val().match( /VR-transport/i )

            ) { alert("Vr Transport match found.\n\nVr transport requests are handled by AMS Forest systems support\n\n11.3.2016");

            } if ( originalDescription.val().match( /Porstua/i )
                  || shortDescription.val().match( /Porstua/i )

            ) { alert("Porstua IP-planning is done by AMS Reporting support\n\n14.3.2016");

            } if ( originalDescription.val().match( /Patikka/i )
                  || shortDescription.val().match( /Patikka/i )

            ) { alert("Patikka match found\n\n Patikka is supported by: AMS Forest systems support\n\nPatikka installation is done by MGSD:\nadd OR value at Pager field (telephone tab) in AD\n\n5.5.2016");

            } if ( originalDescription.val().match( /Maximo/i )
                  || shortDescription.val().match( /Maximo/i )

            ) { alert("Maximo match found\n\n Maximo Tissue Maximo plant maintenance is managed by IBM support resolvers\n\n9.5.2016");

            } if ( originalDescription.val().match( /documentum/i )
                  || shortDescription.val().match( /documentum/i )

            ) { alert("documentum match found\n\n documentum group (COMMON_APP_archivist) is added by MGSD\n\n27.4.2016");


            } if ( originalDescription.val().match( /inter call/i )
                    || shortDescription.val().match( /inter call/i )
            ) { alert("inter call access management is handled by HCL Global account management\n\n10.3.2016");

            } if ( originalDescription.val().match( /federation/i )
                    || shortDescription.val().match( /federation/i )
            ) { alert("Federation can be enabled for the user using AD");

            } if ( originalDescription.val().match( /power meeting/i )
                    || shortDescription.val().match( /power meeting/i )
            ) { alert("Power Meeting can be enabled for the user using AD:\n\Communicatons tab > Meeting Settings\n\nPower Meeting size limit is 250");

            } if ( originalDescription.val().match( /VPN/i )
                    || shortDescription.val().match( /VPN/i )
            ) { alert("VPN troubleshooting is done by MGSD (See Shared drive for instructions)\nInternal access/modification is done by MGSD (See Shared drive for instructions)\n\nExternal/Partner access/modification is done by Cygate");

            } if ( originalDescription.val().match( /trust relationship/i )
                    || originalDescription.val().match( /trust relationship/i )
            ) {
    var txt;
    var r = confirm('Incase there is trust relationship issues try to firs enabale the users computer in AD if this does not help follow the instructions (swe)');
    if (r == true) {
        window.open('https://extranet.cargotec.com/sites/ext122/GSD%20%20Global%20Service%20Desk/GSD%20Finland/Swedish%20local%20specific%20documentation/Trust%20relationship.docx');
        return;
    };


            } if ( originalDescription.val().match( /STM/i )
                    || shortDescription.val().match( /STM/i )
                    || shortDescription.val().match( /Smart Test Manager/i )
                    || originalDescription.val().match( /Smart Test Manager/i )
            ) { alert("Smart Test Manager (STM) tickets should be resolved using the following template:\n---\nDear User,\n\nThis message is to confirm you that your incident at OneDesk has been resolved.\n\nSolution: STM tickets are handled by Rakesh Kulkarni and Parijat Saxena directly without OneDesk. They should be contacted directly by emailing ext.rakesh.kulkarni@cargotec.com.\n\nThank you for using OneDesk and we wish you a nice day.\n---");

            } if ( originalDescription.val().match( /SMTP relay/i )
                    || shortDescription.val().match( /SMTP relay/i )
            ) { alert("SMTP relay order match found\n\nSMTP relay orders are managed by csc.fi@tieto.com (Tieto) once a SMTP relay order form is filled out\n(See routing matrix/shared drive for the form)\n\n19.4.2016");


            } if ( originalDescription.val().match( /comma to dot/i )
                    || shortDescription.val().match( /comma to dot/i )
                    || shortDescription.val().match( /comma till dot/i )
                    || originalDescription.val().match( /comma till dot/i )
            ) { alert("Mekko graphics installation is done by OneDesk (see exceptions tracker)");

                                                } if ( originalDescription.val().match( /manusearch/i )
                    || shortDescription.val().match( /manusearch/i )
            ) { alert("Mekko graphics installation is done by OneDesk (see exceptions tracker)");

            } if ( originalDescription.val().match( /image/i )
                    || shortDescription.val().match( /image/i )
            ) { alert("Image match found\n\nIf problems with Image/image issues contact HCL Image Management\n\n21.3.2016");


            } if ( originalDescription.val().match( /Mobility/i )
                    || shortDescription.val().match( /Mobility/i )
            ) { alert('If problems with One-Mobility re-install via application catalog \n\nand remove .odb files from \nC:\Users\"username"\AppData\Local\VirtualStore\Program Files (x86)\Microsoft\Mobility_Install');

            } if ( originalDescription.val().match( /DHCP/i )
                    || shortDescription.val().match( /DHCP/i )
            ) { alert('DHCP match found\n\nDHCP (if not MLG.FIN) is managed by HCL Active Directy and Printer Support\n\nMLG.FIN is managed by Onsite (according to IP location)\n\n21/3/2016');

            } if ( originalDescription.val().match( /Telex/i )
                    || shortDescription.val().match( /Telex/i )
            ) { alert('Telex match found\n\nTelex number change is done by HCL Global Account Management\n\n20.4.2016');

            } if ( originalDescription.val().match( /new user/i )
                    || shortDescription.val().match( /new user/i )
                    || originalDescription.val().match( /account creation/i )
                    || shortDescription.val().match( /account creation/i )
                    || originalDescription.val().match( /ad account/i )
                    || shortDescription.val().match( /ad account/i )
                    || originalDescription.val().match( /uusi työntekijä/i )
                    || shortDescription.val().match( /uusi työntekijä/i )
                    || originalDescription.val().match( /active directory account/i )
                    || shortDescription.val().match( /active directory account/i )
            ) { alert('AD account match found\n\nBasic Modification of user information/groups is done by SD\n\nAD account Creation/Deletion & new user account is done by HCL GAM team\nattach user access request form for creation (See Routing Matrix for path)\n\n20.4.2016');

            } if ( originalDescription.val().match( /identity/i )
                    || shortDescription.val().match( /identity/i )
            ) { alert('Identity match found\n\nThe identity manager for Metso is: Jarkko Lehtola\n\n1/4/2016');

            } if ( originalDescription.val().match( /Concur/i )
                    || shortDescription.val().match( /Concur/i )
            ) { alert('Concur match found\n\nConcur is managed by TM Global TST\n\n4/4/2016');

            } if ( originalDescription.val().match( /BitApps/i )
                    || shortDescription.val().match( /BitApps/i )
            ) { alert('BitApps match found\n\BitApps is managed by AMS Forest systems support\n\n2/5/2016');

            } if ( originalDescription.val().match( /Logforce/i )
                    || shortDescription.val().match( /Logforce/i )
            ) { alert('Logforce match found\n\Logforce is managed by AMS Forest systems support\n\n4/4/2016');

            } if ( originalDescription.val().match( /thinclient/i )
                    || shortDescription.val().match( /thinclient/i )
            ) { alert('thinclient match found\n\thinclient invoice is managed by AMS Finance support\n\n4/4/2016');

            } if ( originalDescription.val().match( /autocad/i )
                    || shortDescription.val().match( /autocad/i )
            ) { alert('autocad match found\n\autocad licenses are managed by OSS / Jimmy andersson\n\n6/4/2016');

            } if ( originalDescription.val().match( /Palo Alto/i )
                    || shortDescription.val().match( /Palo Alto/i )
            ) { alert('Palo Alto match found\n\Palo Alto Firewall openings are done by Cygate\n\n12/4/2016');

            } if ( originalDescription.val().match( /license/i )
                    || shortDescription.val().match( /license/i )
                    || shortDescription.val().match( /lisens/i )
                    || originalDescription.val().match( /lisens/i )
            ) { alert('License match found\n\nThe license manager for Metso is: Alf Burge\n\n1/4/2016');

            } if ( originalDescription.val().match( /PCR/i )
                    || shortDescription.val().match( /PCR/i )
                    || shortDescription.val().match( /MCR/i )
                    || originalDescription.val().match( /MCR/i )
                    || shortDescription.val().match( /CCR/i )
                    || originalDescription.val().match( /CCR/i )
                    || shortDescription.val().match( /eXCR/i )
                    || originalDescription.val().match( /eXCR/i )
            ) { alert('PCR/MCR/CCR/eXCR match found\n\nThese issues are handled by: AMS MDM Support\n\n1/4/2016');

            } if ( originalDescription.val().match( /Security Group/i )
                    || shortDescription.val().match( /Security Group/i )
            ) { alert('Security group match found\n\nSecurity groups are created by HCL Global Account Management\n\n22/3/2016');

            } if ( originalDescription.val().match( /email account/i )
                    || shortDescription.val().match( /email account/i )
                    || shortDescription.val().match( /mail account/i )
                    || originalDescription.val().match( /mail account/i )
            ) { alert('email account match found\n\nEmail accounts are created by HCL Global Account Management\n\n22/3/2016');

            } if ( originalDescription.val().match( /Tuntilehti/i )
                    || shortDescription.val().match( /Tuntilehti/i )
            ) { alert('Tuntilehti match found\n\nIf problems with Tuntilehti Login:\n Ulock the AD account/password reset (Uncheck "user must change password")\n\nTuntilehti access is managed by:\nHR Payroll/Palkanlaskenta Finland\n\n22/3/2016');

            } if ( originalDescription.val().match( /ADFS/i )
                    || shortDescription.val().match( /ADFS/i )
            ) { alert('ADFS match found\n\nADFS is managed by Tieto\n\n23/3/2016');

            } if ( originalDescription.val().match( /eDocs/i )
                    || shortDescription.val().match( /eDocs/i )
            ) { alert('eDocs match found\n\eDocs issues are handled by Onsite\n\n23/3/2016');

            } if ( originalDescription.val().match( /otso/i )
                    || shortDescription.val().match( /otso/i )
            ) { alert('otso match found\n\otso issues are handled by AMS SUPPLY CHAIN FOREST\n\1/4/2016');

            } if ( originalDescription.val().match( /varian/i )
                    || shortDescription.val().match( /varian/i )
            ) { alert('varian match found\n\Varian space reservation issues are handled by ADM Varian\n\1/4/2016');

            } if ( originalDescription.val().match( /xerox/i )
                    || shortDescription.val().match( /xerox/i )
            ) { alert('Xerox match found\n\nXerox user related printing Issues are handled by MGSD (See Shared Drive for instructions)\n\nIf Printer has a ID tag escalate ticket to Xerox otherwise contact Onsite regarding the issue.\n\n23/3/2016');

              } if ( originalDescription.val().match( /mgvd/i )
                    || shortDescription.val().match( /mgvd/i )
                    || shortDescription.val().match( /virtual desktop/i )
                    || originalDescription.val().match( /virtual desktop/i )
            ) { alert('MGVD match found\n\nMGVD account modification / Access is done by MGSD (RDS)\n\nMGVD password reset is done in Active directory by MGSD\n\n23/3/2016');

            } if ( originalDescription.val().match( /Software Center/i )
                    || shortDescription.val().match( /Software Center/i )
            ) { alert('Software Center match found\n\nIf Software Center updates are stuck please follow the instructions on Shared drive.\n\nIf there are SC problems we are unable to resolve send a detailed description of the issue to HCL SCCM\n\n22/3/2016');

            } if ( originalDescription.val().match( /Duty Ring Roster/i )
                    || shortDescription.val().match( /Duty Ring Roster/i )
            ) { alert('Duty Ring Roster match found\n\nThe DRR is managed by MGSD on Extranet (see routing matrix for link)\n\nDocuments > OSS Operations > Duty ring roster ---> [...] <---  > Edit\n\n31/3/2016');

            } if ( originalDescription.val().match( /Intranet/i )
                    || shortDescription.val().match( /Intranet/i )
                    || shortDescription.val().match( /Extranet/i )
                    || originalDescription.val().match( /Extranet/i )
                    || shortDescription.val().match( /Sharepoint/i )
                    || originalDescription.val().match( /Sharepoint/i )
                    || shortDescription.val().match( /teamsite/i )
                    || originalDescription.val().match( /teamsite/i )
                    || shortDescription.val().match( /Team Site/i )
                    || originalDescription.val().match( /team site/i )
            ) { alert('Intranet/Extranet/Sharepoint match found\n\nThese are managed by COMMS Digital Channels\n\n30/3/2016');

                           } if ( originalDescription.val().match( /bunkerworld/i )
                    || shortDescription.val().match( /bunkerworld/i )
            ) { alert('bunkerworld match found\n\nIf there are issues with bunkerworld contact: Contact: Ravi Kashap\n\n30/3/2016');

            } if ( originalDescription.val().match( /ICT Shop/i )
                    || shortDescription.val().match( /ICT Shop/i )
            ) {
    var txt;
    var r = confirm('ICT Shop match found\n\n ICT shop problems are handled by HCL Active Directy and Printer Support\n\nPress OK to be redirected to the ICT shop\n\n21/3/2016');
    if (r == true) {
        window.open('http://ictshop.metsagroup.com.mgr.ads/shopping/');
        return;
    };

                          } if ( originalDescription.val().match( /SKF/i )
                    || shortDescription.val().match( /SKF/i )
            ) { alert('SKF match found\n\n For SKF server issues contact joni.kirtola@skf.com\n\n10/5/2016');

                          } if ( originalDescription.val().match( /APF/i )
                    || shortDescription.val().match( /APF/i )
            ) { alert('APF match found\n\n For APF FTP issues contact HCL SCCM\n\n11/5/2016');

                            } if ( originalDescription.val().match( /ecoonline/i )
                    || shortDescription.val().match( /ecoonline/i )
                    || originalDescription.val().match( /eco online/i )
                    || shortDescription.val().match( /eco online/i )
                    || originalDescription.val().match( /KTT/i )
                    || shortDescription.val().match( /KTT/i )
                    || originalDescription.val().match( /eplus/i )
                    || shortDescription.val().match( /eplus/i )
                    || originalDescription.val().match( /e plus/i )
                    || shortDescription.val().match( /e plus/i )
            ) {
    var txt;
    var r = confirm('Eco Online match found\n\n Eco Online problem steps can be seen in the Routing Matrix\n\nPress OK to be redirected to the Routing Matrix\n\n21/4/2016');
    if (r == true) {
        window.open('https://docs.google.com/spreadsheets/d/1ei7GD1bq3fjlIxtFI5uDOhv2bH8gNqzFj966zqSLT0Y');
        return;
    };

           } if ( originalDescription.val().match( /Phone to voice/i )
                    || shortDescription.val().match( /Phone to voice/i )
            ) {
    var txt;
    var r = confirm('Phone to voice match found\n\nPhone to voice feature is enabled by SD\nOffice 365 > Admin\n\nPress OK to be redirected to Office 365 portal\n\n22.3.2016');
    if (r == true) {
        window.open('https://login.microsoftonline.com/login.srf');
        return;
    };


            } if ( originalDescription.val().match( /print/i )
                    || shortDescription.val().match( /printer/i )
                    || originalDescription.val().match( /printer/i )
                    || shortDescription.val().match( /print/i )
            ) {
    var txt;
    var r = confirm('Printer match found\n\nWLAN Printer hosting is done by Cygate\n\nif printer problem check printerspool in addtion to normal troubleshooting. Press OK to open printer instructions\n\n18/4/2016');
    if (r == true) {
        window.open('https://extranet.cargotec.com/sites/ext122/GSD%20%20Global%20Service%20Desk/GSD%20Finland/Swedish%20local%20specific%20documentation/Printer%20instructions.docx');
        return;
    };

            } if ( originalDescription.val().match( /KeyUser list/i )
                    || shortDescription.val().match( /KeyUser list/i )
                    || originalDescription.val().match( /SuperUser list/i )
                    || shortDescription.val().match( /SuperUser list/i )
                    || originalDescription.val().match( /Super User list/i )
                    || shortDescription.val().match( /Super User list/i )
                    || originalDescription.val().match( /Key User list/i )
                    || shortDescription.val().match( /Key User list/i )
                    || originalDescription.val().match( /SU list/i )
                    || shortDescription.val().match( /SU list/i )
            ) { alert('Key User/Super user match found\n\nThese lists are updated by MGSD under:\nKnowledge Base > Authorized Requestors >  BIZ Application super users, Group and BA 2016\n\n22/3/2016');

                           } if ( originalDescription.val().match( /Virus/i )
                    || shortDescription.val().match( /Virus/i )
                    || originalDescription.val().match( /infection/i )
                    || shortDescription.val().match( /infection/i )
            ) { alert('Virus/Infection match found\n\nadvanced workstation virus troubleshooting is done by:\nHCL Endpoint Security Services\n\n22/3/2016');


            } else {
                alert("No other match found"); //+ originalDescription.val()
            }
       });

    }

        //serveme search check

      if ( openedEl.length ) {
        $( openedEl ).append(
            '<div class="CCT-button"  style="display:inline-block; border-radius: 3px;  margin: 0px 0px 0px 5px; border: 1px solid black; background-color: #ccddff; padding: 0 2px; cursor: pointer;">New Child Ticket</div>'
        );
        $( '.CCT-button' ).click( function() {
setCookie("companycookie", companyMail, 12);
            setCookie("locationcookie", locationMail, 12);

                        var companyCookie = getCookie( "companycookie" );
                        var locationCookie = getCookie( "locationcookie" );

                       $("#"+ SRQorICTChildButtonVal +"").click();

        });
    }
     //LIM check

            if ( ProjectRelated.length ) {
        $( ProjectRelated ).append(
            '<div class="LIM-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px -75px; border: 1px solid black; background-color: #F0FFFF; padding: 0 2px; cursor: pointer;">LIM Contacts</div>'
        );
        $( '.LIM-button' ).click( function() {
            window.open('https://collaboration.metsagroup.com/en/Collaboration/gs-new-eus-coop/Lists/documents/OSS%20Operations/Metsa%20Group%20LIM%20Site%20Responsibles%20Contact%20List_04_2014.xlsx');
});
    }


    //VIP check
 /* NOT in use due to automatic checks
            if ( ProjectRelated.length ) {
        $( ProjectRelated ).append(
            '<div class="KeyUserCheck-button"  style="display:inline-block; border-radius: 3px; margin:  1px; border: 1px solid black; background-color: #f9f5d1; padding: 0 2px; cursor: pointer;">VIPuserCheck</div>'
        );
        $( '.KeyUserCheck-button' ).click( function() {
                if ( caller.val().match( /Jouko Wacklin/i )
                  || caller.val().match( /Andreas Euler/i )
                  || caller.val().match( /Markku Romano/i )
                  || caller.val().match( /Anders Ståhlberg/i )
                  || caller.val().match( /Anu Jasola/i )
                  || caller.val().match( /Ari Kiviranta/i )
                  || caller.val().match( /Eeva Kokkonen/i )
                  || caller.val().match( /Henri Sederholm/i )
                  || caller.val().match( /Jari Vuori/i )
                  || caller.val().match( /Kai Vikman/i )
                  || caller.val().match( /Katri Kauppila/i )
                  || caller.val().match( /Kenneth Hernberg/i )
                  || caller.val().match( /Maija Varpula/i )
                  || caller.val().match( /Markus Holm/i )
                  || caller.val().match( /Matti Ketonen/i )
                  || caller.val().match( /Mikko Helander/i )
                  || caller.val().match( /Niina Niskanen/i )
                  || caller.val().match( /Pasi Piiparinen/i )
                  || caller.val().match( /Petri Vakkilainen/i )
                  || caller.val().match( /Sari Pajari/i )
                  || caller.val().match( /Soili Hietanen/i )
                  || caller.val().match( /Veijo Korkalainen/i )
                  || caller.val().match( /Veli-Pekka Turunen/i )
                  || caller.val().match( /Anders Ek/i )
                  || caller.val().match( /Carin Enevang/i )
                  || caller.val().match( /Håkan Eriksen/i )
                  || caller.val().match( /Mattias Kronberg/i )
                  || caller.val().match( /Seppo Puotinen/i )
                  || caller.val().match( /Jari Tikkanen/i )
                  || caller.val().match( /Olli Haaranoja/i )
                  || caller.val().match( /Mika Paljakka/i )
                  || caller.val().match( /Veli-Pekka Kyllönen/i )
                  || caller.val().match( /Mika Manninen/i )
                  || caller.val().match( /Jani Suomalainen/i )
                  || caller.val().match( /Pertti Hietaniemi/i )
                  || caller.val().match( /Camilla Wikström/i )
                  || caller.val().match( /Antti Kiljunen/i )
                  || caller.val().match( /Ari Harmaala/i )
                  || caller.val().match( /Ilkka Hämälä/i )
                  || caller.val().match( /Ismo Nousiainen/i )
                  || caller.val().match( /Juha Pesonen/i )
                  || caller.val().match( /Jyrki Merisalo/i )
                  || caller.val().match( /Jyrki Ranki/i )
                  || caller.val().match( /Kaija Pehu-Lehtonen/i )
                  || caller.val().match( /Mikael Westerlund/i )
                  || caller.val().match( /Niklas von Weymarn/i )
                  || caller.val().match( /Pirjo Nousiainen/i )
                  || caller.val().match( /Sari Mäkelä/i )
                  || caller.val().match( /Sirkka-Liisa Fagerlund/i )
                  || caller.val().match( /Tarja Nousiainen/i )
                  || caller.val().match( /Timi Hyppänen/i )
                  || caller.val().match( /Tuija Holopainen/i )
                  || caller.val().match( /Jouko Kotilainen/i )
                  || caller.val().match( /Timo Merikallio/i )
                  || caller.val().match( /Jaakko Anttila/i )
                  || caller.val().match( /Jari Tikkanen/i )
                  || caller.val().match( /Ilkka Poikolainen/i )
                  || caller.val().match( /Hannu Alarautalahti/i )
                  || caller.val().match( /Heikki Karhunen/i )
                  || caller.val().match( /Helle Näär/i )
                  || caller.val().match( /Juha Mäntyla/i )
                  || caller.val().match( /Markku Luhtasela/i )
                  || caller.val().match( /Olli Laitinen/i )
                  || caller.val().match( /Sini Nevalainen/i )
                  || caller.val().match( /Yrjö Perälä/i )
                  || caller.val().match( /Aino Pitkänen/i )
                  || caller.val().match( /Susanna Vilén/i )
                  || caller.val().match( /Tuula Palviainen/i )
                  || caller.val().match( /Martti Asunta/i )
                  || caller.val().match( /Hannu Antilla/i )
                  || caller.val().match( /Kari Jordan/i )
                  || caller.val().match( /Vesa-Pekka Takala/i )
                  || caller.val().match( /Ralph Streit/i )
                  || caller.val().match( /Anneli Karhula/i )
                  || caller.val().match( /Hannu Havanka/i )
                  || caller.val().match( /Irene Leppänen/i )
                  || caller.val().match( /Jari Voutilainen/i )
                  || caller.val().match( /Jarmo Toikka/i )
                  || caller.val().match( /Juhani Pitkänen/i )
                  || caller.val().match( /Jukka Tuloisela/i )
                  || caller.val().match( /Jussi Noponen/i )
                  || caller.val().match( /Karin Silen/i )
                  || caller.val().match( /Kimmo Helle/i )
                  || caller.val().match( /Mervi Suuronen/i )
                  || caller.val().match( /Miika Arola/i )
                  || caller.val().match( /Mika Parviainen/i )
                  || caller.val().match( /Panu Hannula/i )
                  || caller.val().match( /Reetta Kaukiainen/i )
                  || caller.val().match( /Reetta Lyytikäinen-Isonen/i )
                  || caller.val().match( /Riikka Joukio/i )
                  || caller.val().match( /Kari Tunttu/i )
                  || caller.val().match( /Katrin Bunner/i )
                  || caller.val().match( /Juha Starck/i )
                  || caller.val().match( /Juha Tilli/i )
                  || caller.val().match( /Kari Muttilainen/i )
                  || caller.val().match( /Mika Joukio/i )
                  || caller.val().match( /Mikko Forsell/i )
                  || caller.val().match( /Moona Pohjola/i )
                  || caller.val().match( /Noora Lahti/i )
                  || caller.val().match( /Pirita Penttilä/i )
                  || caller.val().match( /Saku Mäihäniemi/i )
                  || caller.val().match( /Simo Schulz/i )
                  || caller.val().match( /Tommi Vainio/i )
                  || caller.val().match( /Jaroslaw Urban/i )
                  || caller.val().match( /Mariusz Jedrzejewski/i )
                  || caller.val().match( /Peter Simo/i )
                  || caller.val().match( /Rene Steiger/i )
                  || caller.val().match( /Ari Vehviläinen/i )
                  || caller.val().match( /Kari Karttunen/i )
                  || caller.val().match( /Anna Stjärnvy/i )
                  || caller.val().match( /Hans Bergström/i )
                  || caller.val().match( /Mark Watkins/i )
                  || caller.val().match( /Patrik Karlsson/i )
                  || caller.val().match( /Peter Lindgren/i )
                  || caller.val().match( /Yuriy Hudziy/i )
                  || caller.val().match( /Håkan Johansson/i )
                  || caller.val().match( /Christoph Zeiler/i )
                  || caller.val().match( /Gerd Scharfenstein/i )
                  || caller.val().match( /Guido Bröcker/i )
                  || caller.val().match( /Hubert Schönbein/i )
                  || caller.val().match( /Ingo Scheen/i )
                  || caller.val().match( /Markus Classen/i )
                  || caller.val().match( /Alexander Reichelt/i )
                  || caller.val().match( /Gero Kronen/i )
                  || caller.val().match( /Markus Lehne/i )
                  || caller.val().match( /Jan Kucharcik/i )
                  || caller.val().match( /Lubomir Kotulac/i )
                  || caller.val().match( /Zsolt Toth/i )
                  || caller.val().match( /Armel Chaumont/i )
                  || caller.val().match( /Jan Finnila/i )
                  || caller.val().match( /Ari Tiukkanen/i )
                  || caller.val().match( /Arto Salo/i )
                  || caller.val().match( /Atte Ailio/i )
                  || caller.val().match( /Esa Kaikkonen/i )
                  || caller.val().match( /Henrik Söderström/i )
                  || caller.val().match( /Jani Riisanen/i )
                  || caller.val().match( /Jani Rissanen/i )
                  || caller.val().match( /Jukka Oinonen/i )
                  || caller.val().match( /Kalle Parviainen/i )
                  || caller.val().match( /Liisa Jonninen/i )
                  || caller.val().match( /Mia Kekäläinen/i )
                  || caller.val().match( /Mikko Saavalainen/i )
                  || caller.val().match( /Oliver Becker/i )
                  || caller.val().match( /Olli Mannisto/i )
                  || caller.val().match( /Perttu Hartikainen/i )
                  || caller.val().match( /Saku Pänkäläinen/i )
                  || caller.val().match( /Sari Sillanpää/i )
                  || caller.val().match( /Seppo Virtanen/i )
                  || caller.val().match( /Juha Virtanen/i )
                  || caller.val().match( /Sebastien Levenez/i )
                  || caller.val().match( /Riku Iisakkala/i )
                  || caller.val().match( /Mauri Korpela/i )
                  || caller.val().match( /Jari Juutilainen/i )
                  || caller.val().match( /Ilkka Satta/i )
                  || caller.val().match( /Jarkko Vihervuori/i )
                  || caller.val().match( /Eero Lampola/i )
                  || caller.val().match( /Mika Heikkonen/i )
                  || caller.val().match( /Jari Vakevainen/i )
                  || caller.val().match( /Robert Loew/i )
                  || caller.val().match( /Matti Pajula/i )
                  || caller.val().match( /Jouni Hanninen/i )
                  || caller.val().match( /Matti Sipila/i )
                  || caller.val().match( /Harri Haapaniemi/i )
                  || caller.val().match( /Jaakko Vierola/i )
                  || caller.val().match( /Mike Lomas/i )
                  || caller.val().match( /Mark Dewick/i )

                ) { alert('User is a VIP user. Rise the priority to High (or higher if necessairy)');

                    } else {
                     alert('User is not a VIP user');


}
       });
    }

*/

    // Business Application / Service button



  /*      USING OF ADDITIONAL comments bar prohitibed hance buttons are disabled

                   if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="sFin-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">sFIN</div>'
        );
        $( '.sFin-button' ).click( function() {
             setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay( "Hei,\n\n\n\n"+ signatureFI +" " );
});
    }

                   if ( CommentsBar.length ) {
        $( CommentsBar ).append(
            '<div class="sEng-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">sENG</div>'
        );
        $( '.sEng-button' ).click( function() {
             setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay( "Hi,\n\n\n\n"+ signature +" " );
});
    }

                   if ( CommentsBar.length ) {
        $( CommentsBar ).append(
            '<div class="sSwe-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">sSWE</div>'
        );
        $( '.sSwe-button' ).click( function() {
            setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay( "Hej,\n\n\n\n"+ signatureSE +" " );
});
    }

*/
    /*

                       if ( CommentsBar.length ) {
        $( CommentsBar ).append(
            '<div class="RemoteFI-button"  style="display:inline-block; margin: 0px 0px 0px 50px; border: 1px solid black; background-color: #d1d5f9; padding: 0 2px; cursor: pointer;">RemoteFI</div>'
        );
        $( '.RemoteFI-button' ).click( function() {
             setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay2( "Hei,\n\nKatsomme mielellämme ongelmaanne tarkemmin etätyöpöytäyhteyden avulla. Mikäli tämä sopii sinulle milloin olisi sopiva aikaväli tälle?\n\nVoit myös ottaa meihin suoraan yhteyttä milloin vain soittamalla numeroon +358800917677\n\n"+ signatureFI +" " );
});
    }

                   if ( CommentsBar.length ) {
        $( CommentsBar ).append(
            '<div class="RemoteEN-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; background-color: #d1d5f9; padding: 0 2px; cursor: pointer;">RemoteEN</div>'
        );
        $( '.RemoteEN-button' ).click( function() {
             setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay2( "Hi,\n\nWe would be happy to look into this for you in a remote session. When would be a suitable time for us to contact you and look into this?\n\nYou can also contact us anytime by calling +448007563363\n\n"+ signature +" " );
});
    }


                       if ( CommentsBar.length ) {
        $( CommentsBar ).append(
            '<div class="RemoteSE-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; background-color: #d1d5f9; padding: 0 2px; cursor: pointer;">RemoteSE</div>'
        );
        $( '.RemoteSE-button' ).click( function() {
            setCallerNames();
                state.valWithDelay( '4' );
                commentsToCaller.valWithDelay2( "Hej,\n\nVi skulle gärna koppla upp oss för att se om vi kan lösa detta. Vilken tid skulle passa dig som bäst att vi tar kontakt för att se nogrannare på detta?\n\nDu kan också ringa oss på numret +358800917677\n\n"+ signatureSE +" " );
});
    }
    */
    /* NOT IN Metso USE

                            if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="BaSeFI-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 50px; border: 1px solid black; background-color: #f9f5d1; padding: 0 2px; cursor: pointer;">SAP PW reset FI</div>'
        );
        $( '.BaSeFI-button' ).click( function() {
              if ( configurationItem.val().match( /SAP - VESURI/ ) ) {
                   internalWorkNotes.valWithDelay2( 'Sending SAP password to the user and resolving the issue.' );
            state.valWithDelay( '6' );
            type.valWithDelay( '8' );
            closeCode.valWithDelay( defaultCloseCode );
            closeNotes.valWithDelay( SAPpwCloseNotesEN );
            window.location.href = "mailto: "+ callerVal +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hei%20"+ callerFirstName +",%0D%0A%0D%0AUusi SAP salasanasi vesuriin on: ---%0D%0A%0D%0AMUISTUTUS: Sulje Kotka ensin ja vaihda salasana Vesurissa uuteen ennen kuin avaat Kotkan uudelleen. %0D%0AVaihda Vesurissa uudeksi salasanaksi sellainen 8 merkkiä sisältävä salasana, jossa EI OLE ÄÄKKÖSIÄ TAI ERIKOISMERKKEJÄ, jotta se toimisi myös Kotkassa. %0D%0A%0D%0AMikäli sinulla on edelleen ongelmia kirjautua sisään ota yhteys Servicedeskiin soittamalla numeroon +358800917677 tai ottamalla yhteyttä chatin välityksellä ServiceDesk@sdmetsagroup.com.";
                 } else {
            internalWorkNotes.valWithDelay2( 'Sending SAP password to the user and resolving the issue.' );
            state.valWithDelay( '6' );
            type.valWithDelay( '5' );
            closeCode.valWithDelay( defaultCloseCode );
            closeNotes.valWithDelay( SAPpwCloseNotesFI );
            window.location.href = "mailto: "+ callerVal +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hei%20"+ callerFirstName +",%0D%0A%0D%0AUusi SAP salasanasi on: ---%0D%0A%0D%0AMikäli sinulla on edelleen ongelmia kirjautua sisään ota yhteys Servicedeskiin soittamalla numeroon +358204146000 tai ottamalla yhteyttä chatin välityksellä ServiceDesk@sdmetsagroup.com.";}
                 });
    }

                   if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="BaSeEN-button"  style="display:inline-block; border-radius: 3px; margin: 0 1px; border: 1px solid black; background-color: #f9f5d1; padding: 0 2px; cursor: pointer;">SAP PW reset EN</div>'
        );
        $( '.BaSeEN-button' ).click( function() {
            internalWorkNotes.valWithDelay2( 'Sending SAP password to the user and resolving the issue.' );
            state.valWithDelay( '6' );
            type.valWithDelay( '5' );
            closeCode.valWithDelay( defaultCloseCode );
            closeNotes.valWithDelay( SAPpwCloseNotesSE );
            window.location.href = "mailto: "+ callerVal +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hi%20"+ callerFirstName +",%0D%0A%0D%0AYour new SAP password is: ---%0D%0A%0D%0AIf you still are experiencing issues with the login contact Servicedesk by calling +358204146000 or by contacting us using chat: itservicedesk@metsoitsd.com";


});
    }

                   if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="BaSeSE-button"  style="display:inline-block; border-radius: 3px; margin: 0 1px; border: 1px solid black; background-color: #f9f5d1; padding: 0 2px; cursor: pointer;">SAP PW reset SE</div>'
        );
        $( '.BaSeSE-button' ).click( function() {
            internalWorkNotes.valWithDelay2( 'Sending SAP password to the user and resolving the issue.' );
            state.valWithDelay( '6' );
            type.valWithDelay( '5' );
            closeCode.valWithDelay( defaultCloseCode );
            closeNotes.valWithDelay( SAPpwCloseNotesEN );
            window.location.href = "mailto: "+ callerVal +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hej%20"+ callerFirstName +",%0D%0A%0D%0ADitt nya SAP lösenord är: ---%0D%0A%0D%0AOm du har fortfarande problem att komma in kontakta Service Desk med att ringa till +46200330951 eller med att kontakta oss via Chat: ServiceDesk@sdmetsagroup.com.";
});
    }
*/

                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="AUFfi-button"  style="display:inline-block; border-radius: 3px; margin: 0px 200px 0px 0px; border: 1px solid black; background-color:  #99ddff; padding: 0 2px; cursor: pointer;">AUF FI</div>'
        );
        $( '.AUFfi-button' ).click( function() {
            if ( $('#incident\\.do').length && commentsToCaller.val().match( /Hei/i ) ) {
                state.valWithDelay( '-5' );
                subStatus.valWithDelay2('Customer Action');
            }  else if ( $('#incident\\.do').length ) {
            setCallerNames();
             g_form.setValue('comments','Hei '+ callerFirstName +',\n\n'+ signatureFI +'');


   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            commentsToCaller.valWithDelay( 'Hei '+ firstName +',\n\n'+ signatureFI +'' );
            subStatus.valWithDelay2('Customer Action');

}




});
    }

  /*                if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="AUFse-button"  style="display:inline-block; border-radius: 3px; margin:  margin: 0px 0px 0px -196px; border: 1px solid black; background-color:  #99ddff; padding: 0 2px; cursor: pointer;">SE</div>'
        );
        $( '.AUFse-button' ).click( function() {
            if ( $('#incident\\.do').length && commentsToCaller.val().match( /Hej/i ) ) {
                state.valWithDelay( '-5' );
                subStatus.valWithDelay2('Customer Action');
            }  else if ( $('#incident\\.do').length ) {
            setCallerNames();
             g_form.setValue('comments','Hej '+ callerFirstName +',\n\n'+ signatureSE +'');


   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            commentsToCaller.valWithDelay( 'Hej '+ firstName +',\n\n'+ signatureSE +'' );
            subStatus.valWithDelay2('Customer Action');

}




});
    }

*/


                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="AUFse-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px -196px; border: 1px solid black; background-color: #99ddff; padding: 0 2px; cursor: pointer;">SE</div>'
        );
        $( '.AUFse-button' ).click( function() {
            if ( $('#incident\\.do').length && commentsToCaller.val().match( /Hej/i ) ) {
                state.valWithDelay( '-5' );
                subStatus.valWithDelay2('Customer Action');
            }  else if ( $('#incident\\.do').length ) {
            setCallerNames();
             g_form.setValue('comments','Hej '+ callerFirstName +',\n\n'+ signatureSE +'');


   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            commentsToCaller.valWithDelay( 'Hej '+ firstName +',\n\n'+ signatureSE +'' );
            subStatus.valWithDelay2('Customer Action');

}




});
    }

/*
                      if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="mailFI-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 190px; border: 1px solid black; background-color: #2693ff; padding: 0 2px; cursor: pointer;">Mail FI</div>'
        );
        $( '.mailFI-button' ).click( function() {
            if ( $('#incident\\.do').length ) {
            setCallerNames();
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hei%20"+ callerFirstName +",";
            subStatus.valWithDelay2('Customer Action');
   } else {
       var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            subStatus.valWithDelay2('Customer Action');
            window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hei%20"+ firstName +",";
   }
});
    }
*/
                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="AUFen-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 3px; border: 1px solid black; background-color: #99ddff; padding: 0 2px; cursor: pointer;">EN</div>'
        );
        $( '.AUFen-button' ).click( function() {
            if ( $('#incident\\.do').length && commentsToCaller.val().match( /Hi/i ) ) {
                state.valWithDelay( '-5' );
                subStatus.valWithDelay2('Customer Action');
            }  else if ( $('#incident\\.do').length ) {
            setCallerNames();
             g_form.setValue('comments','Hi '+ callerFirstName +',\n\n'+ signatureEN +'');


   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            commentsToCaller.valWithDelay( 'Hi '+ firstName +',\n\n'+ signatureEN +'' );
            subStatus.valWithDelay2('Customer Action');

}




});
    }

                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="mailFI-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 20px; border: 1px solid black; background-color: #2693ff; padding: 0 2px; cursor: pointer;">Mail FI</div>'
        );
        $( '.mailFI-button' ).click( function() {
            if ( $('#incident\\.do').length ) {
            setCallerNames();
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +""+ shortDescriptionText +"&body=Hei%20"+ callerFirstName +",";
            subStatus.valWithDelay2('Customer Action');
   } else {
       var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            subStatus.valWithDelay2('Customer Action');
            window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +" ?subject="+ ritmNr +" - ["+ incidentNr +"] - "+ shortDescriptionText +"&body=Hei%20"+ firstName +",";
   }
});
    }

                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="mailEN-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 5px; border: 1px solid black; background-color: #2693ff; padding: 0 2px; cursor: pointer;">EN</div>'
        );
        $( '.mailEN-button' ).click( function() {
            if ( $('#incident\\.do').length ) {
            setCallerNames();
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hi%20"+ callerFirstName +",";
            subStatus.valWithDelay2('Customer Action');

   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +"?subject="+ ritmNr +" - ["+ incidentNr +"] - "+ shortDescriptionText +"&body=Hi%20"+ firstName +",";
            subStatus.valWithDelay2('Customer Action');

}

});
    }

                  if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="mailSE-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px 5px; border: 1px solid black; background-color: #2693ff; padding: 0 2px; cursor: pointer;">SE</div>'
        );
        $( '.mailSE-button' ).click( function() {
            if ( $('#incident\\.do').length ) {
            setCallerNames();
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hej%20"+ callerFirstName +",";
            subStatus.valWithDelay2('Customer Action');

   } else {
                               var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +"?subject="+ ritmNr +" - ["+ incidentNr +"] - "+ shortDescriptionText +"&body=Hej%20"+ firstName +",";
            subStatus.valWithDelay2('Customer Action');

}

});
    }




                              if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="FUmailFI-button"  style="display:inline-block; border-radius: 3px; margin: 3px 0px 0px 20px; border: 1px solid black; background-color: #D3D3D3; padding: 0 2px; cursor: pointer;">Remote session FI</div>'
        );
        $( '.FUmailFI-button' ).click( function() {
             if ( $('#incident\\.do').length ) {
            setCallerNames();
            state.valWithDelay( '-5' );
            subStatus.valWithDelay2('Customer Action');
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hei%20"+ callerFirstName +",%0D%0A%0D%0AMetso Service Desk on yrittänyt ottaa teihin yhteyttä liittyen tapaukseen: "+ incidentNr +"%0D%0A%0D%0AHaluaisimme tutkia tapaustasi tarkemmin etäyhteyden avulla%0D%0A%0D%0AVoit ottaa meihin yhteyttä milloin vain soittamalla numeroon: +358 2048 4114 tai ottamalla yhteyttä Service Desk chattiin: itservicedesk@metsoitsd.com";

            } else {
    var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
            window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +" ?subject="+ ritmNr +" - ["+ incidentNr +"] - "+ shortDescriptionText +"&body=Hei%20"+ firstName +",%0D%0A%0D%0AMetso Service Desk on yrittänyt ottaa teihin yhteyttä liittyen tapaukseen: "+ incidentNr +"%0D%0A%0D%0AHaluaisimme tutkia tapaustasi tarkemmin etäyhteyden avulla%0D%0A%0D%0AVoit ottaa meihin yhteyttä milloin vain soittamalla numeroon: +358 2048 4114 tai ottamalla yhteyttä Service Desk chattiin: itservicedesk@metsoitsd.com";
            subStatus.valWithDelay2('Customer Action');
            }
             });
    }

                          if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="FUmailEN-button"  style="display:inline-block; border-radius: 3px; margin: 0 5px; border: 1px solid black; background-color: #D3D3D3; padding: 0 2px; cursor: pointer;">EN</div>'
        );
        $( '.FUmailEN-button' ).click( function() {
            if ( $('#incident\\.do').length ) {


            setCallerNames();
            state.valWithDelay( '-5' );
            subStatus.valWithDelay2('Customer Action');
            window.location.href = "mailto: "+ CallerValueINC.CallerEmail +" ?subject="+ incidentNr +" "+ shortDescriptionText +"&body=Hi%20"+ callerFirstName +",%0D%0A%0D%0AMetsoService Desk has tried to contact you Regarding ticket: "+ incidentNr +"%0D%0A%0D%0AWe would need to look into your issue remotely.%0D%0A%0D%0AYou can contact Service Desk at any time on +358 2041 46000 or by the Service Desk chat: itservicedesk@metsoitsd.com";

            } else {
     var fullName = requestedFor.split(' ');
    firstName = fullName[0];
            state.valWithDelay( '-5' );
                      window.location.href = "mailto: "+ CallerValueSRQ.CallerEmail +" ?subject="+ ritmNr +" - ["+ incidentNr +"] - "+ shortDescriptionText +"&body=Hi%20"+ firstName +",%0D%0A%0D%0AMetsoService Desk has tried to contact you Regarding ticket: "+ incidentNr +"%0D%0A%0D%0AWe would need to look into your issue remotely.%0D%0A%0D%0AYou can contact Service Desk at any time on +358 2048 4114 or by the Service Desk chat: itservicedeskchat@sdMetsochat.com%0D%0AWe are available 24/7 and will gladly assist you with this issue.%0D%0A%0D%0A";
            subStatus.valWithDelay2('Customer Action');
            }

            });
    }




/*
if ( WatchlistElement.length ) {
        $( WatchlistElement ).append(
            '<div class="NoServerResponsible-button"  style="display:inline-block; margin: 0 1px; border: 1px solid black; background-color: #d3d3d3 ; padding: 0 2px; cursor: pointer;">N/A system Responsible</div>'
        );
        $( '.NoServerResponsible-button' ).click( function() {
                        setCallerNames();
                       state.valWithDelay( '6' );
           closeCode.valWithDelay( defaultCloseCode );
           closeNotes.valWithDelay( ServerCloseNotesEN );
        });
    }

    */

// Automated close notes

                           if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="ResolveFin-button"  style="display:inline-block; border-radius: 3px; margin: 0 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">ResolveFin</div>'
        );
        $( '.ResolveFin-button' ).click( function() {
if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
            setCallerNames();
                                   state.valWithDelay( '6' );
      //     closeCode.valWithDelay( defaultCloseCode );
           subStatus.valWithDelay( 'Permanently Resolved' );
           closeNotes.valWithDelay( 'Hei,\n\nTämä viesti on vahvistus työpyyntönne ratkaisusta.\n\nRatkaisu: \n\nKiitos, että käytitte Metso IT Service Deskin palveluita.'+ signatureFI +'' );
      //     closeCode.valWithDelay( 'Other' );
             //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height

                     }
});
    }


                   if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="ResolveEng-button"  style="display:inline-block; border-radius: 3px; margin: 1 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">ResolveEng</div>'
        );
        $( '.ResolveEng-button' ).click( function() {
            if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
            setCallerNames();
                                   state.valWithDelay( '6' );
           closeNotes.valWithDelay( 'Hi,\n\nThis is a message to inform you that your incident has been resolved\n\nSolution: \n\nThank you for contacting Metso IT Service Desk.'+ signatureEN +'' );
           subStatus.valWithDelay( 'Permanently Resolved' );
       //    closeCode.valWithDelay( 'Other' );
  //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
                     }
});
    }

                   if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="ResolveSe-button"  style="display:inline-block; border-radius: 3px; margin: 1 1px; border: 1px solid black; padding: 0 2px; cursor: pointer;">ResolveSe</div>'
        );
        $( '.ResolveSe-button' ).click( function() {
            if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
            setCallerNames();
                                   state.valWithDelay( '6' );
           closeNotes.valWithDelay( 'Hej,\n\nVill meddela att ditt ärende nu är löst och kommer att stängas.\n\nLösning: \n\nTack för att du kontaktat Metso IT Service Desk.'+ signatureSE +'' );
           subStatus.valWithDelay( 'Permanently Resolved' );
       //    closeCode.valWithDelay( 'Other' );
  //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
                     }
});
    }


                           if ( CC_ClosedBy.length ) {
        $( CC_ClosedBy ).prepend(
            '<div class="ResolveSwe-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px -115px; border: 1px solid black; padding: 0 2px; cursor: pointer;">ResolveSwe</div>'
        );
        $( '.ResolveSwe-button' ).click( function() {
            if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
            setCallerNames();
                                   state.valWithDelay( '6' );
           closeNotes.valWithDelay( defaultCloseNotesSE );
           subStatus.valWithDelay( 'Permanently Resolved' );
     //      closeCode.valWithDelay( defaultCloseCode );
     //      closeCode.valWithDelay( 'Other' );

                           //DEFINE Height
                    $(function () {
    $("textarea").each(function () {
        this.style.height = (this.scrollHeight+300)+'px';
    });
});
// END DEFINE Height
                     }
});
    }

                   if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="Resolve3Fin-button"  style="display:inline-block; border-radius: 3px; margin: 0 1px; border: 1px solid black; background-color: #FFC0CB; padding: 0 2px; cursor: pointer;">3sResFin</div>'
        );
        $( '.Resolve3Fin-button' ).click( function() {
                        if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
            setCallerNames();
                                   state.valWithDelay( '6' );
            subStatus.valWithDelay( 'No User Response' );
           closeNotes.valWithDelay( threeSdefaultCloseNotesFI );
    //       closeCode.valWithDelay( defaultCloseCode );
     //      closeCode.valWithDelay( 'Other' );
                     }
});
    }


                   if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="Resolve3Eng-button"  style="display:inline-block; border-radius: 3px; margin: 1 1px; border: 1px solid black; background-color: #FFC0CB; padding: 0 2px; cursor: pointer;">3sResEng</div>'
        );
        $( '.Resolve3Eng-button' ).click( function() {
                        if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
           setCallerNames();
                                   state.valWithDelay( '6' );
            subStatus.valWithDelay( 'No User Response' );
           closeNotes.valWithDelay( threeSdefaultCloseNotesEN );
  //         closeCode.valWithDelay( defaultCloseCode );
                     }
});
    }


                           if ( ResolutionCheckBox.length ) {
        $( ResolutionCheckBox ).prepend(
            '<div class="Resolve3Swe-button"  style="display:inline-block; border-radius: 3px; margin: 0px 0px 0px -100px; border: 1px solid black; background-color: #FFC0CB; padding: 0 2px; cursor: pointer;">3sResSwe</div>'
        );
        $( '.Resolve3Swe-button' ).click( function() {
                        if ( state.val() == 1) {
alert ("You need to change the status to Work in progress and save before resolving the ticket");
                     } else {
           setCallerNames();
            state.valWithDelay( '6' );
            subStatus.valWithDelay( 'No User Response' );
           closeNotes.valWithDelay( threeSdefaultCloseNotesSE );
    //       closeCode.valWithDelay( defaultCloseCode );
                     }
});
    }

        //Transport request ICT creation button (functions(buttons) created below will not be visible in ICT)

            if ( TrasnsportState.length ) {
        $( TrasnsportState ).prepend(
            '<div class="transport-button" style="display:inline-block; border-radius: 3px; border: 1px solid black; background-color: #FFD8B1; padding: 0 7px; cursor: pointer;">Create Transport Incident</div>'
        );
        $( '.transport-button' ).click( function() {
                    var WatchlistVal = company.val().split(' ');
                    var companyword = WatchlistVal[1];
                    var to                       = $('input#sys_display\\.sc_task\\.assigned_to');


setCookie("companycookie", companyMail, 30);

           var myWindow =   window.open('https://metsa.service-now.com/sc_task.do?sysparm_stack=sc_task_list.do&sys_id=-1&sysparm_query=u_business_service=03053fb9b5004100b3867101f04a9ed5^cmdb_ci=03053fb9b5004100b3867101f04a9ed5^assignment_group=7aa1803785219d00addc4801251f0c29^contact_type=self-service^watch_list='+ companyword +'.ict transport^company='+ CompanyValue +'^description=update company to: '+ CompanyValue +' and add%20yourself%20as%20caller once done "UPDATE"%20%20%20 --->%20%20%20 once update is completed update transport info by pressing%20%20"Update%20Transport%20Incident" %20%20%20 --->%20%20%20 when the information has been retrieved Assign the Ticket to Tieto^short_description='+ TransportSchedule +'%20Transport%20request%20-%20'+ CompanyValue +'%20%20%20'+ TransportTime +'(EET)^state=2^EQ&sysparm_view=Transport&sysparm_cancelable=true',"MsgWindow", "width=2000,height=1000");
var companyCookie = getCookie( "companycookie" );

            // ^assigned_to=b637ecd738b5c1401e9f1388160b29db
// myWindow.alert( companyCookie );




});

    }