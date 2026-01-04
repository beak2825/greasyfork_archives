// ==UserScript==
// @name         Trigger Setup Loop
// @namespace    localhost
// @version      0.3.2
// @description  This script is a companion script to run with the "Installz Script"
// @author       jack@autoloop.com
// @include     *autoloop.us*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/374084/Trigger%20Setup%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/374084/Trigger%20Setup%20Loop.meta.js
// ==/UserScript==
'use strict';

/*ItemList
[#] Item
0	Advisor Accept Appt Every
1	Walkins Consume Capacity
2	Use Advisor from Last RO
3	Default Dealer Make
4	Sales Phone
5	Service Phone
6	parsedSettingsString
7	Sales Contact - Email
8	Sales Contact - Title
9	Service Contact - Name
10	Service Contact - Email
11	Service Contact - Title
12	Area Code
13	Appointment Confirmation - Voice
14	Appointment Confirmation - SMS
15	Appointment Confirmation - Email
16	Appointment Confirmation - BDC
17	Parts Department Link
18	Service Department Link
19	New Vehicles Link
20	Used Vehicles Link
21	Sales Specials Link
22	Service Monday Open
23	Service Monday Close
24	Service Tuesday Open
25	Service Tuesday Close
26	Service Wednesday Open
27	Service Wednesday Close
28	Service Thursday Open
29	Service Thursday Close
30	Service Friday Open
31	Service Friday Close
32	Service Saturday Open
33	Service Saturday Close
34	Service Sunday Open
35	Service Sunday Close
36	Sales Monday Open
37	Sales Monday Close
38	Sales Tuesday Open
39	Sales Tuesday Close
40	Sales Wednesday Open
41	Sales Wednesday Close
42	Sales Thursday Open
43	Sales Thursday Close
44	Sales Friday Open
45	Sales Friday Close
46	Sales Saturday Open
47	Sales Saturday Close
48	Sales Sunday Open
49	Sales Sunday Close
50	Missed Appointment - Voice
51	Missed Appointment - SMS
52	Missed Appointment - Email
53	Missed Appointment - BDC
54	Customer Recovery - Voice
55	Customer Recovery - SMS
56	Customer Recovery - Email
57	Customer Recovery - BDC
58	Declined Repairs - Voice
59	Declined Repairs - SMS
60	Declined Repairs - Email
61	Declined Repairs - BDC
62	Parts Arrival - Voice
63	Parts Arrival - SMS
64	Parts Arrival - Email
65	Parts Arrival - BDC
66	Scheduled Maint - Voice
67	Scheduled Maint - SMS
68	Scheduled Maint - Email
69	Scheduled Maint - BDC
70	Service Completion - Voice
71	Service Completion - SMS
72	Service Completion - Email
73	Service Completion - BDC
74	Service FollowUp - Voice
75	Service FollowUp - SMS
76	Service FollowUp - Email
77	Service FollowUp - BDC
78	Service Intro - Voice
79	Service Intro - SMS
80	Service Intro - Email
81	Service Intro - BDC
82	State Inspection Reminder - Voice
83	State Inspection Reminder - SMS
84	State Inspection Reminder - Email
85	State Inspection Reminder - BDC
86	Tires Due - Voice
87	Tires Due - SMS
88	Tires Due - Email
89	Tires Due - BDC
90	Vehicle Accessories - Voice
91	Vehicle Accessories - SMS
92	Vehicle Accessories - Email
93	Vehicle Accessories - BDC
94	Customer Birthday - Voice
95	Customer Birthday - SMS
96	Customer Birthday - Email
97	Customer Birthday - BDC
98	Ext. Service Contract - Voice
99	Ext. Service Contract - SMS
100	Ext. Service Contract - Email
101	Ext. Service Contract - BDC
102	Lease Expiration - Voice
103	Lease Expiration - SMS
104	Lease Expiration - Email
105	Lease Expiration - BDC
106	Sales FollowUp - Voice
107	Sales FollowUp - SMS
108	Sales FollowUp - Email
109	Sales FollowUp - BDC
110	Service Contract FollowUp - Voice
111	Service Contract FollowUp - SMS
112	Service Contract FollowUp - Email
113	Service Contract FollowUp - BDC
114	Service to Sales - Voice
115	Service to Sales - SMS
116	Service to Sales - Email
117	Service to Sales - BDC
118	Trade Cycle - Voice
119	Trade Cycle - SMS
120	Trade Cycle - Email
121	Trade Cycle - BDC
122	Vehicle Anniversary - Voice
123	Vehicle Anniversary - SMS
124	Vehicle Anniversary - Email
125	Vehicle Anniversary - BDC
126	Facebook Link
127	Twitter Link
128	Youtube Link
129	Instagram Link
130	Schedule Appt Link
131	Sales Signatory - Name
132	Sales Signatory - Title
133	Sales Signatory - Phone
134	Sales Signatory - Email
135	Service Signatory - Name
136	Service Signatory - Title
137	Service Signatory - Phone
138	Service Signatory - Email
139	Tire URL
140	Notifications - Voice
141	Notifications - SMS
142	Notifications - Email
143	Show Pricing in OCAS
144	Sales User 1
145	Sales User 2
146	Sales User 3
147	Sales User 4
148	Sales User 5
149	Sales User 6
150	Sales User 7
151	Sales User 8
152	Sales User 9
153	Sales User 10
154	Service User 1
155	Service User 2
156	Service User 3
157	Service User 4
158	Service User 5
159	Service User 6
160	Service User 7
161	Service User 8
162	Service User 9
163	Service User 10
164	Website URL
165	Sales Print Friendly Hours 1
166	Sales Print Friendly Hours 2
167	Sales Print Friendly Hours 3
168	Service Print Friendly Hours 1
169	Service Print Friendly Hours 2
170	Service Print Friendly Hours 3
171	Sales Follow Up Survey
172	Service Follow Up Survey
173	Msging name
174	Sales User 11
175	Sales User 12
176	Sales User 13
177	Sales User 14
178	Sales User 15
179	Sales User 16
180	Sales User 17
181	Sales User 18
182	Service User 11
183	Service User 12
184	Service User 13
185	Service User 14
186	Service User 15
187	Service User 16
188	Service User 17
189	Service User 18
*/


//if on the essentials trigger home page OR on one of a trigger's pages
if ((window.location.href.includes('DMS/App/Default')) || (window.location.href.includes('DMS/App/Notifications/'))) {
    PathSelector()
}

//initializer
function Initializer() {
    //if on the essentials trigger home page then get and set the key before continuing
    if ($('#ctl00_ctl00_Main_Main_lnkCampaignManager').length > 0) {
        var settingsKey = $('#settingsKeyInputField').val(); //settingsKey set equal to text box
        localStorage.setItem("storageSettingsString", settingsKey) //set local variable 'storageSettingsString'

        //selector for TriggerSetup() or TriggerSetupVMS()
        if ((window.location.href.includes('/MakeSettings.aspx')) || (window.location.href.includes('/ViewSettings.aspx')) || (window.location.href.includes('/EditCategorySettings.aspx'))) {
            TriggerSetupVMS();
        } else {
            TriggerSetup();
        }
    }
}

//path selector
function PathSelector() {
    if ($('#ctl00_ctl00_Main_Main_lnkCampaignManager').length > 0) {
        UserTriggerSelector(); //if on the essentials home page (all trigger overview page)

    } else if ((window.location.href.includes('/MakeSettings.aspx')) || (window.location.href.includes('/ViewSettings.aspx')) || (window.location.href.includes('/EditCategorySettings.aspx'))) {
        TriggerSetupVMS(); //if on a trigger's "vehicle make settings" page

    } else {
        TriggerSetup(); //if on a trigger's "edit settings" page
    }
}

function TriggerSetup() {
    //if "Success" notification is present and if on "Edit Settings" page
    if ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Trigger Settings were successfully saved.") && ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopApprovalQueueSettings_fsApprovalQueues').length >= 1)) {
        var storageLink = localStorage.getItem("storageLink"); //get local variable "storageLink"

        //if "storageLink" is empty, go to TriggerSetupVMS
        if (storageLink.length == 56) {
            TriggerSetupVMS();
        } else {
            //alert(storageLink);
            window.location.href = storageLink; //set href to go to next trigger page
        }

        //else setup the page
    } else {
        var storageSettingsString = localStorage.getItem("storageSettingsString"); //get local variable "storageSettingsString"
        var storagePages = localStorage.getItem("storagePages"); //get local variable "storagePages"

        var storagePagesArray = storagePages.split('~'); //split settings key
        var link = "https://autoloop.us/DMS/App/Notifications/" + storagePagesArray[0] + "/Settings.aspx"; //set the link address for the next page we will go to
        var pageRemoved = storagePagesArray.splice(0, 1); //remove old page item

        //for loop to re-add delimiters
        var recontructedPages = "";
        storagePagesArray.forEach(function(page) {
            recontructedPages += page + "~";
        });

        storagePages = recontructedPages; //set storagePages equal to the new reconstructed pages
        localStorage.setItem("storagePages", storagePages); //set local variable "storagePages"
        localStorage.setItem("storageLink", link); //set local variable "storageLink"
        console.log(storagePages)

        //if on a trigger "edit settings" page, setup the trigger (looking for the batch checkbox)
        if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopApprovalQueueSettings_fsApprovalQueues').length >= 1) {
            $(window).load(function() {
                $('#settingsKeyInputField').val(storageSettingsString);
                $('#executeButton').click();
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_btnSubmit').click(); //click save btn, will take you to the trigger default page
            });
        }

        //if at the essentials trigger home page (this will only run when the user initial starts the loop)
        if (window.location.href.includes('DMS/App/Default')) {
            window.location.href = link; //set href to go to next page
        }
    }
}

function TriggerSetupVMS() {
    //if "Success" notification is present and on a trigger's "vehicle make settings" page
    if ((($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Default settings have been saved.")) || ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Default - Standard Followup settings have been saved.")) || ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Category Settings settings have been saved.")) || ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Default - Both settings have been saved."))) && ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopApprovalQueueSettings_fsApprovalQueues').length <= 0)) {
        var storageLinkVMS = localStorage.getItem("storageLinkVMS"); //get local variable "storageLinkVMS"

        console.log("StorageLinkVMS: " + storageLinkVMS)
        //if "storageLinkVMS" is empty, alert "trigger loop complete", else go to the next trigger and continue the loop
        if (storageLinkVMS.length == 60) {
            //get local item 'triggersCompletedMsg'
            var storageTriggersCompletedMsg = localStorage.getItem("storageTriggersCompletedMsg");

            alert("Trigger Loop Complete \nNOTE: Remember to disable the Trigger Loop!" + "\n\n" + storageTriggersCompletedMsg);
            //window.location.href = "https://autoloop.us/DMS/App/Default.aspx"; //go to trigger overview page
        } else {
            window.location.href = storageLinkVMS; //set href to go to next trigger page
        }

        //if "Success" notification is absent
        //} else if (($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Trigger Settings were successfully saved.")) && ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopApprovalQueueSettings_fsApprovalQueues').length <= 0)) {

        //else setup the page
    } else {
        var storageSettingsString = localStorage.getItem("storageSettingsString"); //get local variable "storageSettingsString"
        var storagePagesVMS = localStorage.getItem("storagePagesVMS"); //get local variable "storagePagesVMS"
        var storagePagesArrayVMS = storagePagesVMS.split('~'); //split settings key
        console.log("storagePagesArrayVMS: " + storagePagesArrayVMS)
        var linkEnderVMS = "";

        if ((storagePagesArrayVMS[0] == "AppointmentConfirmation") || (storagePagesArrayVMS[0] == "MissedAppointment") || (storagePagesArrayVMS[0] == "PartsArrival")
            || (storagePagesArrayVMS[0] == "VehicleAnniversary") || (storagePagesArrayVMS[0] == "ServiceCompletion") || (storagePagesArrayVMS[0] == "ServiceFollowup")
            || (storagePagesArrayVMS[0] == "ServiceIntroduction") || (storagePagesArrayVMS[0] == "StateInspectionReminder") || (storagePagesArrayVMS[0] == "TireDue")
            || (storagePagesArrayVMS[0] == "VehicleAccessories") || (storagePagesArrayVMS[0] == "LeaseExpiration") || (storagePagesArrayVMS[0] == "PurchaseFollowUp")
            || (storagePagesArrayVMS[0] == "CustomerBirthday") || (storagePagesArrayVMS[0] == "WarrantyExpiration") || (storagePagesArrayVMS[0] == "ServiceContractFollowup")
            || (storagePagesArrayVMS[0] == "ServiceToSales") || (storagePagesArrayVMS[0] == "")) {
            linkEnderVMS = "/MakeSettings.aspx";

        } else if ((storagePagesArrayVMS[0] == "CustomerRecovery") || (storagePagesArrayVMS[0] == "") || (storagePagesArrayVMS[0] == "")) {
            linkEnderVMS = "/ViewSettings.aspx";

        } else if ((storagePagesArrayVMS[0] == "DeclinedRepairs") || (storagePagesArrayVMS[0] == "") || (storagePagesArrayVMS[0] == "")) {
            linkEnderVMS = "/EditCategorySettings.aspx";

        } else if ((storagePagesArrayVMS[0] == "TradeCycle")) {
            linkEnderVMS = "/MakeSettings.aspx?type=cash";

        } else if ((storagePagesArrayVMS[0] == "TradeCycle2")) {
            storagePagesArrayVMS[0] = storagePagesArrayVMS[0].replace('2', '');
            linkEnderVMS = "/MakeSettings.aspx?type=loan";

        } else if ((storagePagesArrayVMS[0] == "ScheduledMaintenance")) {
            linkEnderVMS = "/MakeSettings.aspx?type=s2s";

        } else if ((storagePagesArrayVMS[0] == "ScheduledMaintenance2")) {
            storagePagesArrayVMS[0] = storagePagesArrayVMS[0].replace('2', '');
            linkEnderVMS = "/MakeSettings.aspx?type=rr";
        } else {
            linkEnderVMS = "/MakeSettings.aspx";
        }

        var linkVMS = "https://autoloop.us/DMS/App/Notifications/" + storagePagesArrayVMS[0] + linkEnderVMS; //set the link address for the next page we will go to
        var pageRemoved = storagePagesArrayVMS.splice(0, 1); //remove old page item
        console.log("linkVMS: " + linkVMS)
        console.log("pageRemoved: " + pageRemoved)

        //for loop to re-add delimiters
        var recontructedPages = "";
        storagePagesArrayVMS.forEach(function(page) {
            recontructedPages += page + "~";
        });
        console.log("recontructedPages: " + recontructedPages)

        storagePagesVMS = recontructedPages; //set storagePages equal to the new reconstructed pages
        localStorage.setItem("storagePagesVMS", storagePagesVMS); //set local variable "storagePages"
        localStorage.setItem("storageLinkVMS", linkVMS); //set local variable "storageLinkVMS"
        console.log(storagePagesVMS);
        //alert("Console Read")

        //if on a trigger "vehicle make settings" page, setup the trigger
        if (((window.location.href.includes('/MakeSettings.aspx')) || (window.location.href.includes('/ViewSettings.aspx')) || (window.location.href.includes('/EditCategorySettings.aspx'))) && ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').length <= 0)) {
            $(window).load(function() {
                $('#settingsKeyInputField').val(storageSettingsString);
                $('#executeButton').click();

                //save btns
                if ($('#ctl00_ctl00_Main_Main_btnSubmit').length > 0) {
                    $('#ctl00_ctl00_Main_Main_btnSubmit').click(); //click save btn, will make success notification appear
                }
                if ($('#ctl00_ctl00_Main_Main_btnSaveDefault').length > 0) {
                    $('#ctl00_ctl00_Main_Main_btnSaveDefault').click(); //click save btn, will make success notification appear
                }
                if ($('#ctl00_ctl00_Main_Main_btnSaveDefault').length > 0) {
                    $('#ctl00_ctl00_Main_Main_btnSubmit').click(); //click save btn, will make success notification appear
                }

            });
        }

        //if success notification is present and on a trigger's "edit settings" page
        if ($('#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li').text().includes("Trigger Settings were successfully saved.") && ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopApprovalQueueSettings_fsApprovalQueues').length >= 1)) {
            //loop completed msg
            if (linkVMS.length <= 60) {
                alert("Trigger Setup Complete \n\nNOTE: Remember to disable the Trigger Loop!");

                //continue the loop
            } else {
                window.location.href = linkVMS; //set href to go to next page
            }
        }
    }
}

//link list creator
function linkCreator() {
    var pages = "";
    var pagesVMS = "";
    var triggersCompletedMsg = "Triggers Completed:";

    //service triggers
    if($('#AppointmentConfirmationInput').prop("checked") == true) { //AppointmentConfirmation
        pages += "AppointmentConfirmation" + "~";
        pagesVMS += "AppointmentConfirmation" + "~";
        triggersCompletedMsg += "\n-Appointment Confirmation"
    }
    if($('#CustomerRecoveryInput').prop("checked") == true) { //CustomerRecovery
        pages += "CustomerRecovery" + "~";
        pagesVMS += "CustomerRecovery" + "~";
        triggersCompletedMsg += "\n-Customer Recovery"
    }
    if($('#DeclinedRepairsInput').prop("checked") == true) { //DeclinedRepairs
        pages += "DeclinedRepairs" + "~";
        pagesVMS += "DeclinedRepairs" + "~";
        triggersCompletedMsg += "\n-Declined Repairs"
    }
    if($('#MissedAppointmentInput').prop("checked") == true) { //MissedAppointment
        pages += "MissedAppointment" + "~";
        pagesVMS += "MissedAppointment" + "~";
        triggersCompletedMsg += "\n-Missed Appointment"
    }
    if($('#PartsArrivalInput').prop("checked") == true) { //PartsArrival
        pages += "PartsArrival" + "~";
        pagesVMS += "PartsArrival" + "~";
        triggersCompletedMsg += "\n-Parts Arrival"
    }
    if($('#ScheduledMaintenanceInput').prop("checked") == true) { //ScheduledMaintenance
        pages += "ScheduledMaintenance" + "~";
        pagesVMS += "ScheduledMaintenance" + "~";
        pagesVMS += "ScheduledMaintenance2" + "~";
        triggersCompletedMsg += "\n-Scheduled Maintenance"
    }
    if($('#ServiceCompletionInput').prop("checked") == true) { //ServiceCompletion
        pages += "ServiceCompletion" + "~";
        pagesVMS += "ServiceCompletion" + "~";
        triggersCompletedMsg += "\n-Service Completion"
    }
    if($('#ServiceFollowupInput').prop("checked") == true) { //ServiceFollowup
        pages += "ServiceFollowup" + "~";
        pagesVMS += "ServiceFollowup" + "~";
        triggersCompletedMsg += "\n-Service FollowUp"
    }
    if($('#ServiceIntroductionInput').prop("checked") == true) { //ServiceIntroduction
        pages += "ServiceIntroduction" + "~";
        pagesVMS += "ServiceIntroduction" + "~";
        triggersCompletedMsg += "\n-Service Introduction"
    }
    if($('#StateInspectionReminderInput').prop("checked") == true) { //StateInspectionReminder
        pages += "StateInspectionReminder" + "~";
        pagesVMS += "StateInspectionReminder" + "~";
        triggersCompletedMsg += "\n-State Inspection Reminder"
    }
    if($('#TireDueInput').prop("checked") == true) { //TireDue
        pages += "TireDue" + "~";
        pagesVMS += "TireDue" + "~";
        triggersCompletedMsg += "\n-Tires Due"
    }
    if($('#VehicleAccessoriesInput').prop("checked") == true) { //VehicleAccessories
        pages += "VehicleAccessories" + "~";
        pagesVMS += "VehicleAccessories" + "~";
        triggersCompletedMsg += "\n-Vehicle Accessories"
    }


    //sales triggers
    if($('#CustomerBirthdayInput').prop("checked") == true) { //CustomerBirthday
        pages += "CustomerBirthday" + "~";
        pagesVMS += "CustomerBirthday" + "~";
        triggersCompletedMsg += "\n-Customer Birthday"
    }
    if($('#WarrantyExpirationInput').prop("checked") == true) { //WarrantyExpiration
        pages += "WarrantyExpiration" + "~";
        pagesVMS += "WarrantyExpiration" + "~";
        triggersCompletedMsg += "\n-Warranty Expiration"
    }
    if($('#LeaseExpirationInput').prop("checked") == true) { //LeaseExpiration
        pages += "LeaseExpiration" + "~";
        pagesVMS += "LeaseExpiration" + "~";
        triggersCompletedMsg += "\n-Lease Expiration"
    }
    if($('#PurchaseFollowUpInput').prop("checked") == true) { //PurchaseFollowUp
        pages += "PurchaseFollowUp" + "~";
        pagesVMS += "PurchaseFollowUp" + "~";
        triggersCompletedMsg += "\n-Sales FollowUp"
    }
    if($('#ServiceContractFollowupInput').prop("checked") == true) { //ServiceContractFollowup
        pages += "ServiceContractFollowup" + "~";
        pagesVMS += "ServiceContractFollowup" + "~";
        triggersCompletedMsg += "\n-Service Contract Followup"
    }
    if($('#ServiceToSalesInput').prop("checked") == true) { //ServiceToSales
        pages += "ServiceToSales" + "~";
        pagesVMS += "ServiceToSales" + "~";
        triggersCompletedMsg += "\n-Service to Sales"
    }
    if($('#TradeCycleInput').prop("checked") == true) { //TradeCycle
        pages += "TradeCycle" + "~";
        pagesVMS += "TradeCycle" + "~";
        pagesVMS += "TradeCycle2" + "~";
        triggersCompletedMsg += "\n-Trade Cycle"
    }
    if($('#VehicleAnniversaryInput').prop("checked") == true) { //VehicleAnniversary
        pages += "VehicleAnniversary" + "~";
        pagesVMS += "VehicleAnniversary" + "~";
        triggersCompletedMsg += "\n-Vehicle Anniversary"
    }

    //set local item 'storagePages'
    localStorage.setItem("storagePages", pages)

    //set local item 'storagePagesVMS'
    localStorage.setItem("storagePagesVMS", pagesVMS)

    //set local item 'triggersCompletedMsg'
    localStorage.setItem("storageTriggersCompletedMsg", triggersCompletedMsg)

    //if the user has not selected any triggers
    if (pages.length <= 0) {
        alert("You must select at least one trigger");
    } else {
        Initializer();
    }
}

//for initializer, only on the essentials trigger home page. Adds the settings key text box and all the checkboxes on the triggers
function UserTriggerSelector() {
    $('#MainContent > div.container_24.clearfix').prepend("<button id='startTriggerLoopBtn' type='button'><font color='black'> Start Trigger Loop </font></button>"); //start trigger loop btn
    $('#MainContent > div.container_24.clearfix').prepend("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small>"); //settings key input feild
    $("#startTriggerLoopBtn").click(function(){
        if ($('#settingsKeyInputField').val().includes("~")) {
            linkCreator();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //remove service hrefs
    $("[href='Notifications/AppointmentConfirmation/Default.aspx']").removeAttr("href"); //AppointmentConfirmation
    $("[href='Notifications/CustomerRecovery/Default.aspx']").removeAttr("href"); //CustomerRecovery
    $("[href='Notifications/DeclinedRepairs/Default.aspx']").removeAttr("href"); //DeclinedRepairs
    $("[href='Notifications/MissedAppointment/Default.aspx']").removeAttr("href"); //MissedAppointment
    $("[href='Notifications/PartsArrival/Default.aspx']").removeAttr("href"); //PartsArrival
    $("[href='Notifications/ScheduledMaintenance/Default.aspx']").removeAttr("href"); //ScheduledMaintenance
    $("[href='Notifications/ServiceCompletion/Default.aspx']").removeAttr("href"); //ServiceCompletion
    $("[href='Notifications/ServiceFollowup/Default.aspx']").removeAttr("href"); //ServiceFollowup
    $("[href='Notifications/ServiceIntroduction/Default.aspx']").removeAttr("href"); //ServiceIntroduction
    $("[href='Notifications/StateInspectionReminder/Default.aspx']").removeAttr("href"); //StateInspectionReminder
    $("[href='Notifications/TireDue/Default.aspx']").removeAttr("href"); //TireDue
    $("[href='Notifications/VehicleAccessories/Default.aspx']").removeAttr("href"); //VehicleAccessories

    //remove service hrefs
    $("[href='Notifications/CustomerBirthday/Default.aspx']").removeAttr("href"); //CustomerBirthday
    $("[href='Notifications/WarrantyExpiration/Default.aspx']").removeAttr("href"); //WarrantyExpiration
    $("[href='Notifications/LeaseExpiration/Default.aspx']").removeAttr("href"); //LeaseExpiration
    $("[href='Notifications/PurchaseFollowUp/Default.aspx']").removeAttr("href"); //PurchaseFollowUp
    $("[href='Notifications/ServiceContractFollowup/Default.aspx']").removeAttr("href"); //ServiceContractFollowup
    $("[href='Notifications/ServiceToSales/Default.aspx']").removeAttr("href"); //ServiceToSales
    $("[href='Notifications/TradeCycle/Default.aspx']").removeAttr("href"); //TradeCycle
    $("[href='Notifications/VehicleAnniversary/Default.aspx']").removeAttr("href"); //VehicleAnniversary

    /*//AppointmentConfirmation
    $("[data-tip='Alert customers to an upcoming appointment'] .title").prepend("<input type= 'checkbox' id= 'AppointmentConfirmationInput' value= ''>")
    $("a[data-tip='Alert customers to an upcoming appointment']").click(function(){
        $(this).find('input:checkbox').click();
    });*/
    //CustomerRecovery
    $("[data-tip='Contact customers that are overdue for service'] .title").prepend("<input type= 'checkbox' id= 'CustomerRecoveryInput' value= ''>")
    $("a[data-tip='Contact customers that are overdue for service']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //DeclinedRepairs
    $("[data-tip='Remind customers that decline recommended service about the importance of proper maintenance'] .title").prepend("<input type= 'checkbox' id= 'DeclinedRepairsInput' value= ''>");
    $("a[data-tip='Remind customers that decline recommended service about the importance of proper maintenance']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //MissedAppointment
    $("[data-tip='Contact customers that have missed appointments'] .title").prepend("<input type= 'checkbox' id= 'MissedAppointmentInput' value= ''>");
    $("a[data-tip='Contact customers that have missed appointments']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //PartsArrival
    $("[data-tip='Notify customer of ordered parts arrival and recommend service for installation'] .title").prepend("<input type= 'checkbox' id= 'PartsArrivalInput' value= ''>");
    $("a[data-tip='Notify customer of ordered parts arrival and recommend service for installation']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ScheduledMaintenance
    $("[data-tip='Recommend service scheduling based on information our system collects'] .title").prepend("<input type= 'checkbox' id= 'ScheduledMaintenanceInput' value= ''>");
    $("a[data-tip='Recommend service scheduling based on information our system collects']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ServiceCompletion
    $("[data-tip='Notify customer that service is complete on their vehicle'] .title").prepend("<input type= 'checkbox' id= 'ServiceCompletionInput' value= ''>");
    $("a[data-tip='Notify customer that service is complete on their vehicle']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ServiceFollowup
    $("[data-tip='After a service\, contact a customer with a satisfaction feedback survey'] .title").prepend("<input type= 'checkbox' id= 'ServiceFollowupInput' value= ''>");
    $("a[data-tip='After a service\, contact a customer with a satisfaction feedback survey']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ServiceIntroduction
    $("[data-tip='Introduction of the Service Advisor to a customer when an RO is opened for the customer'] .title").prepend("<input type= 'checkbox' id= 'ServiceIntroductionInput' value= ''>");
    $("a[data-tip='Introduction of the Service Advisor to a customer when an RO is opened for the customer']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //StateInspectionReminder
    $("[data-tip='Alert customers that their vehicle will be due for its yearly\/biannual inspection soon'] .title").prepend("<input type= 'checkbox' id= 'StateInspectionReminderInput' value= ''>");
    $("a[data-tip='Alert customers that their vehicle will be due for its yearly\/biannual inspection soon']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //TireDue
    $("[data-tip='Suggest tire service for customers at defined intervals'] .title").prepend("<input type= 'checkbox' id= 'TireDueInput' value= 'triggerLoop'>");
    $("a[data-tip='Suggest tire service for customers at defined intervals']").click(function(){
        $(this).find('input:checkbox').click();
    });
    /*//VehicleAccessories
            $("[data-tip='Send customers accessory offers after they purchase a new or used vehicle'] .title").find('span').prepend("<input type= 'checkbox' id= 'VehicleAccessoriesInput' value= ''>");
            $("a[data-tip='Send customers accessory offers after they purchase a new or used vehicle']").click(function(){
                $(this).find('input:checkbox').click();
            });*/



    //CustomerBirthday
    $("[data-tip='Contact a customer wishing them a happy birthday and soliciting a referral'] .title").prepend("<input type= 'checkbox' id= 'CustomerBirthdayInput' value= ''>");
    $("a[data-tip='Contact a customer wishing them a happy birthday and soliciting a referral']").click(function(){
        $(this).find('input:checkbox').click();
    });

    //WarrantyExpiration
    $("[data-tip='Alerts customers that their Warranty may soon expire'] .title").prepend("<input type= 'checkbox' id= 'WarrantyExpirationInput' value= ''>");
    $("a[data-tip='Alerts customers that their Warranty may soon expire']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //LeaseExpiration
    $("[data-tip='Notify customers that their lease will expire soon'] .title").prepend("<input type= 'checkbox' id= 'LeaseExpirationInput' value= ''>");
    $("a[data-tip='Notify customers that their lease will expire soon']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //PurchaseFollowUp
    $("[data-tip='After a purchase\, contact a customer with a satisfaction feedback survey'] .title").prepend("<input type= 'checkbox' id= 'PurchaseFollowUpInput' value= ''>");
    $("a[data-tip='After a purchase\, contact a customer with a satisfaction feedback survey']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ServiceContractFollowup
    $("[data-tip='Solicits extended warranty benefits to recent purchasers'] .title").prepend("<input type= 'checkbox' id= 'ServiceContractFollowupInput' value= ''>");
    $("a[data-tip='Solicits extended warranty benefits to recent purchasers']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //ServiceToSales
    $("[data-tip='Contact recently serviced customers that have never purchased from the dealership'] .title").prepend("<input type= 'checkbox' id= 'ServiceToSalesInput' value= ''>");
    $("a[data-tip='Contact recently serviced customers that have never purchased from the dealership']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //TradeCycle
    $("[data-tip='Recover customers who have owned their vehicle for an extended amount of time'] .title").prepend("<input type= 'checkbox' id= 'TradeCycleInput' value= ''>");
    $("a[data-tip='Recover customers who have owned their vehicle for an extended amount of time']").click(function(){
        $(this).find('input:checkbox').click();
    });
    //VehicleAnniversary
    $("[data-tip='Annual deal date message to customers with solicitation for referral'] .title").prepend("<input type= 'checkbox' id= 'VehicleAnniversaryInput' value= ''>");
    $("a[data-tip='Annual deal date message to customers with solicitation for referral']").click(function(){
        $(this).find('input:checkbox').click();
    });

    //remove second scheduled maint V2 checkbox
    $("[data-tip='Recommend service scheduling based on information our system collects'][class='linkMatrix ServiceDisabled ApprovalQueueDisabled ScheduledMaintenanceV2']").find('input:checkbox').remove();

    //remove the "Mercedes ELW checkbox
    $(".fixedOpsLmCol #WarrantyExpirationInput").remove()
}