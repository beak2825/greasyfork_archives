// ==UserScript==
// @name         Installz Script
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  A Script for Installz
// @author       jack@autoloop.com
// @include      *autoloop.us*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/373986/Installz%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/373986/Installz%20Script.meta.js
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





//����������������������������������������������������������������������������������������
//General Book Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Schedule/Settings/Default')) {
    //Installz script by: jack@autoloop.com
    $("#RightContent > h1").append("<br><br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#RightContent > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#RightContent > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#RightContent > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //execute button //change "indexOf" to "includes"
    $("#RightContent > h1").append("<button id='generalBookSettingsBtn' type='button'><font color='black'>Execute</font></button><hr><br>");
    $("#generalBookSettingsBtn").click(function(){
        if((($('#settingsKeyInputField')).val()).includes("~")) {
            MissingItemCheck();
            GeneralBookSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Walkins Consume Capacity" : parsedSettingsString[1], //Walkins Consume Capacity
            "-Use Advisor from Last RO" : parsedSettingsString[2], //Use Advisor from Last RO
            "-Default Dealer Make" : parsedSettingsString[3], //Default Dealer Make
            //"-Appointment Interval in Minutes" : parsedSettingsString[0] //Appointment Interval in Minutes
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }

    function GeneralBookSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        //checkbox key:value
        var checkboxes = {
            "#EnableOCAS" : "true", //Online Customer Appointment Scheduler
            "#FirstApptEnabled" : "true", //First Appointment Scheduler
            "#WelcomeBoardEnabled" : "true", //Welcome Board
            "#KeyTrackingEnabled" : "false", //Key Tracking
            "#ControlPanelEnabled" : "true", //Control Panel
            "#ControlPanelV2Enabled" : "true", //Control Panel V2
            "#RequireAddressAndZip" : "false", //Require Address for New Customers
            "#AllowEmailDeletion" : "true", //Allow Email Deletion
            "#EnableFirstAppointmentAdvsiorNotification" : "true", //Enable First Appointment Advisor Notifications
            "#CheckInWithNoROStatus" : "true", //Enable Status filter on Ledger for Check-Ins with No RO
            "#enableShopLoading" : "true", //Enable "Shop Loading"
            "#EnableCarryOvers" : "true", //Enable Carry-Overs
            "#EnableAutomaticCarryOvers" : "true", //Enable Automatic Carry-Overs
            "#RequireServiceSelectionInBook" : "true", //Require Service Selection
            "#DmsCommentSaveTransportType" : "true", //dms checkbox
            "#DmsCommentSaveCreatedOn" : "true", //dms checkbox
            "#DmsCommentSaveCreatedBy" : "true", //dms checkbox
            "#DmsCommentSaveModifiedOn" : "true", //dms checkbox
            "#DmsCommentSaveModifiedBy" : "true", //dms checkbox
            "#DmsCommentSaveStatus" : "true", //dms checkbox
            "#SendAppointmentSynchronizationFailure" : "true", //Send "Synchronization Failed" Alerts
        };

        //checkbox checker - true & false
        for (var checkbox in checkboxes){
            if (checkboxes[checkbox] == "true") {
                if ($(checkbox).prop("checked") == false) {
                    $(checkbox).click();
                }

            } else if (checkboxes[checkbox] == "false") {
                if ($(checkbox).prop("checked") == true) {
                    $(checkbox).click();
                }
            }
        }

        //set the writeback fail email address
        $('#SendAppointmentSynchronizationFailure').trigger("change"); //trigger changes on this checkbox

        if ($('#SendAppointmentSynchronizationFailure').prop("checked") == false) {
            $('#SendAppointmentSynchronizationFailure').click();
        }

        //works as of 11/23/18
        $('.ng-pristine.ng-valid-pattern.ng-valid-maxlength').click(); //click for listener
        $('.ng-pristine.ng-valid-pattern.ng-valid-maxlength').val("writebackfails@autoloop.com"); //set text value
        $('.ng-pristine.ng-valid-pattern.ng-valid-maxlength').trigger("change");


        //this section is commented per sean on 11/13. this is becasue we can setup all capcities on the 15 minute interval setting
        /*//sets appt interval in minutes
        function apptInterval() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if ((parsedSettingsString[0] == 5) || (parsedSettingsString[0] == 10) || (parsedSettingsString[0] == 15) ||
                (parsedSettingsString[0] == 20) || (parsedSettingsString[0] == 30) || (parsedSettingsString[0] == 60)) {
                $("#AppointmentInterval").val(parsedSettingsString[0]);
                $('#AppointmentInterval').trigger("change");

            } else {
                alert("Error! Appointment Intervals Minutes must be: '5', '10', '15', '20', '30', or '60'");
            }
        }
        apptInterval();*/

        //walkins consume capacity
        function WalkinsConsumeCapacity() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
            var walkinStatus = parsedSettingsString[1].toLowerCase();

            if ((walkinStatus == "y") || (walkinStatus == "yes")) {
                if ($('#WalkinsConsumeCapacity').prop("checked") == false) {
                    $('#WalkinsConsumeCapacity').click();
                }

            } else if ((walkinStatus == "n") || (walkinStatus == "no")) {
                if ($('#WalkinsConsumeCapacity').prop("checked") == true) {
                    $('#WalkinsConsumeCapacity').click();
                }
            }
        }
        WalkinsConsumeCapacity();

        //use last advisor checkbox
        function UseLastAdvisor() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
            var lastAdvisorStatus = parsedSettingsString[2].toLowerCase();


            if ((lastAdvisorStatus == "y") || (lastAdvisorStatus == "yes")) {
                if ($("#EnableLastAdvisor").prop("checked") == false) {
                    $("#EnableLastAdvisor").click();
                }

            } else if ((lastAdvisorStatus == "n") || (lastAdvisorStatus == "no")) {
                if ($("#EnableLastAdvisor").prop("checked") == true) {
                    $("#EnableLastAdvisor").click();
                }
            }
        }
        UseLastAdvisor();

        //preselected vehicle make dropdown
        function VehicleMakeSelecter() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
            var vehicleMake = parsedSettingsString[3];

            $('#DefaultVehicleMake').click(); //to allow save button to be clicked
            $('#DefaultVehicleMake > option:nth-child(2)').click(); //to allow save button to be clicked

            vehicleMake = ("string:" + vehicleMake.substring(0, 1).toUpperCase() + vehicleMake.substring(1)); //caps the first letter and puts it in "string:Make" format
            $('#DefaultVehicleMake').val(vehicleMake);
            $('#DefaultVehicleMake').trigger("change");
        }
        VehicleMakeSelecter();
    }
}


//����������������������������������������������������������������������������������������
//Department Contacts
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/DealershipRepDefaultContact')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > fieldset:nth-child(2) > p").append("<br><br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > fieldset:nth-child(2) > p > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > fieldset:nth-child(2) > p").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > fieldset:nth-child(2) > p").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SalesServiceContactInfo() button
    $("#MainContent > div.container_24.clearfix > fieldset:nth-child(2) > p").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button>");
    $("#executeButton").click(function(){
        if(($('#settingsKeyInputField')).val().includes("~")) {
            MissingItemCheck();
            SalesServiceContactInfo();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //copy sales info into the trigger contact section
    $('#MainContent > div.container_24.clearfix > fieldset:nth-child(3) > p').append("<hr><button id='salesTriggerContactPaster' type='button'><font color='black'>Sales Triggers</font></button>");
    $("#salesTriggerContactPaster").click(function(){
        SalesTriggerContactSetter();
    });

    //copy service info into the trigger contact section
    $('#MainContent > div.container_24.clearfix > fieldset:nth-child(3) > p').append("<button id='serviceTriggerContactPaster' type='button'><font color='black'>Service Triggers</font></button>");
    $("#serviceTriggerContactPaster").click(function(){
        ServiceTriggerContactSetter();
    });

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Sales Phone Number" : parsedSettingsString[4], //-Sales Phone Number
            "-Service Phone Number" : parsedSettingsString[5], //Service Phone Number
            "-Sales Contact Name" : parsedSettingsString[6], //Sales Contact Name
            "-Sales Contact Email" : parsedSettingsString[7], //Sales Contact Email
            "-Sales Contact Title" : parsedSettingsString[8], //Sales Contact Title
            "-Service Contact Name" : parsedSettingsString[9], //Service Contact Name
            "-Service Contact Email" : parsedSettingsString[10], //Service Contact Email
            "-Service Contact Title" : parsedSettingsString[11], //Service Contact Title
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }

    function SalesServiceContactInfo() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var salesPhoneNumber= parsedSettingsString[4];
        var servicePhoneNumber= parsedSettingsString[5];
        var salesContactName = parsedSettingsString[6];
        var salesContactEmail = parsedSettingsString[7];
        var salesContactTitle = parsedSettingsString[8];
        var serviceContactName = parsedSettingsString[9];
        var serviceContactEmail = parsedSettingsString[10];
        var serviceContactTitle = parsedSettingsString[11];

        //sales contact information
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfRepName_textBox').val(salesContactName); //sales contact name
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCSREmail_textBox').val(salesContactEmail); //sales contact email
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfRepTitle_textBox').val(salesContactTitle); //sales contact title
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCallerId_textBox').val(salesPhoneNumber); //sales phone number
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCSRCallBack_textBox').val(salesPhoneNumber); //sales phone number
        $('#ctl00_ctl00_Main_Main_SalesDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val(salesPhoneNumber); //sales phone number

        //service contact info
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfRepName_textBox').val(serviceContactName); //service contact name
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCSREmail_textBox').val(serviceContactEmail); //service contact email
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfRepTitle_textBox').val(serviceContactTitle); //service contact title
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCallerId_textBox').val(servicePhoneNumber); //service phone number
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCSRCallBack_textBox').val(servicePhoneNumber); //service phone number
        $('#ctl00_ctl00_Main_Main_ServiceDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val(servicePhoneNumber); //service phone number
    }

    function SalesTriggerContactSetter() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        //populate trigger contacts with sales info & select proper check boxes
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfRepName_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfRepName_textBox').val()); //sales contact name
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCSREmail_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCSREmail_textBox').val()); //sales contact email
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfRepTitle_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfRepTitle_textBox').val()); //sales contact title
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCallerId_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCallerId_textBox').val()); //sales phone number
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCSRCallBack_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_tfCSRCallBack_textBox').val()); //sales phone number
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val($('#ctl00_ctl00_Main_Main_SalesDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val()); //sales phone number

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_lstTriggers > tbody td').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //salesTriggers array
        var salesTriggers = ["Customer Birthday", "Lease Expiration", "Sales Followup", "Service Contract FollowUp", "Service To Sales", "Trade Cycle", "Vehicle Anniversary", "Warranty Expiration"]

        //checks all sales triggers checkboxes
        for (var i = 0; i < salesTriggers.length; i++) {
            var triggerSelector = $("#ctl00_ctl00_Main_Main_lstTriggers > tbody td:contains('" + salesTriggers[i] + "') input:checkbox")
            triggerSelector.prop("checked", true); //customer birthday
        }
    }

    function ServiceTriggerContactSetter() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        //populate trigger contacts with service info & select proper check boxes
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfRepName_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfRepName_textBox').val()); //service contact name
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCSREmail_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCSREmail_textBox').val()); //service contact email
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfRepTitle_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfRepTitle_textBox').val()); //service contact title
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCallerId_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCallerId_textBox').val()); //service phone number
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_tfCSRCallBack_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_tfCSRCallBack_textBox').val()); //service phone number
        $('#ctl00_ctl00_Main_Main_TriggerDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val($('#ctl00_ctl00_Main_Main_ServiceDealershipRep_loopCallTransfer_tfCallTransfer_textBox').val()); //service phone number

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_lstTriggers > tbody td').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //serviceTriggers array
        var serviceTriggers = ["Appointment Confirmation", "Customer Recovery", "Declined Repairs", "Missed Appointment", "Parts Arrived", "Scheduled Maintenance",
                               "Service Completion", "Service Follow-Up", "Service Introduction", "State Inspection Reminder", "Tire Due", "Vehicle Accessories"];

        //checks all service triggers checkboxes
        for (var i = 0; i < serviceTriggers.length; i++) {
            var triggerSelector = $("#ctl00_ctl00_Main_Main_lstTriggers > tbody td:contains('" + serviceTriggers[i] + "') input:checkbox")
            triggerSelector.prop("checked", true);
        }
    }
}

//����������������������������������������������������������������������������������������
//Notification Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/Notifications')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SalesServiceContactInfo() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function(){
        if(($('#settingsKeyInputField')).val() !== "") {
            MissingItemCheck();
            NotificationSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //FormatOpcodes() button
    $("#MainContent > div.container_24.clearfix > div > fieldset:nth-child(13) > legend").append("<button id='FormatOpcodesBtn' type='button'><font color='black'>Format Email List</font></button>");
    $("#FormatOpcodesBtn").click(function() {
        FormatOpcodes();
    });

    //text box to paste the opcodes
    $("#MainContent > div.container_24.clearfix > div > fieldset:nth-child(13) > legend").append("<small style='font-size:12px'> <input type='text' id='SpacedOpcodesInputField' placeholder='seperated by spaces' value=''></small>");

    //actively changes color of 'fake emails' text box based on length
    $('#ctl00_ctl00_Main_Main_txtFakeEmails').keyup(function() {
        if ($('#ctl00_ctl00_Main_Main_txtFakeEmails').val().length <= 0) {
            $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FF9090'); //changes color to red
        } else {
            $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FFFFFF'); //changes color to white
        }
    });

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Service Phone Number" : parsedSettingsString[5], //Service Phone Number
            "-Service Contact Name" : parsedSettingsString[9], //Service Contact Name
            "-Service Contact Email" : parsedSettingsString[10], //Service Contact Email
            "-Service Contact Title" : parsedSettingsString[11], //Service Contact Title
            "-Area Code" : parsedSettingsString[12], //Area Code
            "-Parts Department Link" : parsedSettingsString[17], //Parts Department Link
            "-Service Department Link" : parsedSettingsString[18], //Service Department Link
            "-New Vehicles Link" : parsedSettingsString[19], //New Vehicles Link
            "-Used Vehicles Link" : parsedSettingsString[20], //Used Vehicles Link
            "-Sales Specials Link" : parsedSettingsString[21], //Sales Specials Link
            //"-Facebook Link" : parsedSettingsString[126], //Facebook Link
            //"-Twitter Link" : parsedSettingsString[127], //Twitter Link
            //"-Youtube Link" : parsedSettingsString[128], //Youtube Link
            //"-Instagram Link" : parsedSettingsString[129], //Instagram Link
            "-Schedule Appointment Link" : parsedSettingsString[130], //Schedule Appointment Link
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }

    function NotificationSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        localStorage.setItem("pageWaitStatus", "n"); //store "n" so that the sched service link is only input if it is supposed to be
        localStorage.setItem("storedSettingsString", settingsString); //save it locally to pass after page load

        var areaCode = parsedSettingsString[12];
        var servicePhoneNumber = parsedSettingsString[5];
        var serviceContactName = parsedSettingsString[9];
        var serviceContactEmail = parsedSettingsString[10];
        var serviceContactTitle = parsedSettingsString[11];
        var voice = parsedSettingsString[140];
        var sms = parsedSettingsString[141];
        var email = parsedSettingsString[142];

        //general info
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfDefaultAreaCode_textBox').val(areaCode); //area code
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfCallerId_textBox').val(servicePhoneNumber); //caller ID #
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_loopCallTransfer_tfCallTransfer_textBox').val(servicePhoneNumber); //call transfer #
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfCSRCallBack_textBox').val(servicePhoneNumber); //csr callback #
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfCSREmail_textBox').val(serviceContactEmail); //csr email
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfEmailForward_textBox').val(serviceContactEmail); //forward email responses to:
        $('#ctl00_ctl00_Main_Main_loopNotificationSettings_tfContactName_textBox').val(serviceContactName); //contact name
        $('#ctl00_ctl00_Main_Main_loopSuperAdminSettings_tfJobTitle_textBox').val(serviceContactTitle); //contact title
        $('#ctl00_ctl00_Main_Main_cbUseMakeHeader').click();
        $('#ctl00_ctl00_Main_Main_cbUseMakeHeader').prop("checked", true); //use vehicle make subheader

        //what to send: voice
        if ((voice == "y") || (voice == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("Voice Calls") input:checkbox').prop("checked", true); //voice enabled
        } else if ((voice == "n") || (voice == "N")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("Voice Calls") input:checkbox').prop("checked", false); //voice disabled
        }

        //what to send: sms
        if ((sms == "y") || (sms == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("SMS Text Messages") input:checkbox').prop("checked", true); //sms enabled
        } else if ((sms == "n") || (sms == "N")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("SMS Text Messages") input:checkbox').prop("checked", false); //sms disabled
        }

        //what to send: email
        if ((email == "y") || (email == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("Emails") input:checkbox').prop("checked", true); //email enabled
        } else if ((email == "n") || (email == "N")) {
            $('#ctl00_ctl00_Main_Main_loopNotificationSettings_fsWhatToSend > div > table > tbody div:contains("Emails") input:checkbox').prop("checked", false); //email disabled
        }

        //links (add logic 'if x = ""' then skip)
        (parsedSettingsString[17]) = (parsedSettingsString[17]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfPartsDepartmentUrl_textBox').val(parsedSettingsString[17]); //parts department link
        (parsedSettingsString[18]) = (parsedSettingsString[18]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfServiceDepartmentUrl_textBox').val(parsedSettingsString[18]); //service department link
        (parsedSettingsString[19]) = (parsedSettingsString[19]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfCustomButtonUrl1_textBox').val(parsedSettingsString[19]); //new vehicles link
        (parsedSettingsString[20]) = (parsedSettingsString[20]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfCustomButtonUrl2_textBox').val(parsedSettingsString[20]); //used vehicles link
        (parsedSettingsString[21]) = (parsedSettingsString[21]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfCustomButtonUrl3_textBox').val(parsedSettingsString[21]); //sales specials

        //social media links
        (parsedSettingsString[21]) = (parsedSettingsString[126]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfSocialMediaUrl1_textBox').val(parsedSettingsString[126]); //facebook
        (parsedSettingsString[21]) = (parsedSettingsString[127]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfSocialMediaUrl2_textBox').val(parsedSettingsString[127]); //twitter
        (parsedSettingsString[21]) = (parsedSettingsString[128]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfSocialMediaUrl4_textBox').val(parsedSettingsString[128]); //youtube
        (parsedSettingsString[21]) = (parsedSettingsString[129]).split('?')[0]; //removes utm code
        $('#ctl00_ctl00_Main_Main_tfSocialMediaUrl5_textBox').val(parsedSettingsString[129]); //instagram

        if ($('#ctl00_ctl00_Main_Main_loopServiceAppointmentLink_cbEnable').prop("checked") == false) {
            var pageWaitStatus = localStorage.getItem("pageWaitStatus");
            localStorage.setItem("pageWaitStatus", "y") //store "y" so that the sched service link is only input if it is supposed to be
            $('#ctl00_ctl00_Main_Main_loopServiceAppointmentLink_cbEnable').click();

        } else {
            $('#ctl00_ctl00_Main_Main_loopServiceAppointmentLink_tfLinkUrl_textBox').val(parsedSettingsString[130]);

            //fake emails
            if ($('#ctl00_ctl00_Main_Main_txtFakeEmails').val().length <= 0) {
                $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FF9090'); //changes color to red
            } else {
                $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FFFFFF'); //changes color to white
            }
        }
    }

    //resume after page wait
    function schedServiceAfterPageWait() {
        var settingsString = localStorage.getItem("storedSettingsString"); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var pageWaitStatus = localStorage.getItem("pageWaitStatus");
        var scheduleServiceLink = parsedSettingsString[130];

        if (pageWaitStatus == "y") {
            localStorage.setItem("pageWaitStatus", "n"); //store "n" so that the sched service link is only input if it is supposed to be
            $('#ctl00_ctl00_Main_Main_loopServiceAppointmentLink_tfLinkUrl_textBox').val(scheduleServiceLink);

            //fake emails
            if ($('#ctl00_ctl00_Main_Main_txtFakeEmails').val().length <= 0) {
                $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FF9090'); //changes color to red
            } else {
                $('#ctl00_ctl00_Main_Main_txtFakeEmails').css("background-color", '#FFFFFF'); //changes color to white
            }
        }
    }
    schedServiceAfterPageWait();

    function FormatOpcodes() {
        var spacedOpcodes = $('#SpacedOpcodesInputField').val();
        var semiColonOpcodes = "";
        spacedOpcodes = spacedOpcodes.split(" ");

        for (var i = 0; i < spacedOpcodes.length; i++) {
            semiColonOpcodes += spacedOpcodes[i] + ";";
        }

        if ($('#SpacedOpcodesInputField').val().length <= 0) {
            alert("No email list to format!")
        } else {
            $('#SpacedOpcodesInputField').val("");
            $('#ctl00_ctl00_Main_Main_txtFakeEmails').val(semiColonOpcodes);
        }
    }
}


//����������������������������������������������������������������������������������������
//Company Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/Company')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //CompanySettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button>");
    $("#executeButton").click(function(){
        if(($('#settingsKeyInputField')).val().includes("~")) {
            MissingItemCheck();
            CompanySettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //dealership groups link
    $('#ctl00_ctl00_Main_Main_pnlGroups > fieldset > legend').append('<a href="https://autoloop.us/DMS/App/GlobalSettings/CompanyGroups.aspx" target="_blank"><small style="font-size:12px"> Dealership Groups</small></a>');
    $('#ctl00_ctl00_Main_Main_pnlGroups > fieldset > legend > a > small').css("color", '#FF0000'); //changes color of link to red

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Website URL" : parsedSettingsString[164], //Website URL
            "-Msging name" : parsedSettingsString[173], //Msging name

            "-Service Monday Open" : parsedSettingsString[22], //Service Monday Open
            "-Service Monday Close" : parsedSettingsString[23], //Service Monday Close
            "-Service Tuesday Open" : parsedSettingsString[24], //Service Tuesday Open
            "-Service Tuesday Close" : parsedSettingsString[25], //Service Tuesday Close
            "-Service Wednesday Open" : parsedSettingsString[26], //Service Wednesday Open
            "-Service Wednesday Close" : parsedSettingsString[27], //Service Wednesday Close
            "-Service Thursday Open" : parsedSettingsString[28], //Service Thursday Open
            "-Service Thursday Close" : parsedSettingsString[29], //Service Thursday Close
            "-Service Friday Open" : parsedSettingsString[30], //Service Friday Open
            "-Service Friday Close" : parsedSettingsString[31], //Service Friday Close
            "-Service Saturday Open" : parsedSettingsString[32], //Service Saturday Open
            "-Service Saturday Close" : parsedSettingsString[33], //Service Saturday Close
            "-Service Sunday Open" : parsedSettingsString[34], //Service Sunday Open
            "-Service Sunday Close" : parsedSettingsString[35], //Service Sunday Close

            "-Sales Monday Open" : parsedSettingsString[36], //Sales Monday Open
            "-Sales Monday Close" : parsedSettingsString[37], //Sales Monday Close
            "-Sales Tuesday Open" : parsedSettingsString[38], //Sales Tuesday Open
            "-Sales Tuesday Close" : parsedSettingsString[39], //Sales Tuesday Close
            "-Sales Wednesday Open" : parsedSettingsString[40], //Sales Wednesday Open
            "-Sales Wednesday Close" : parsedSettingsString[41], //Sales Wednesday Close
            "-Sales Thursday Open" : parsedSettingsString[42], //Sales Thursday Open
            "-Sales Thursday Close" : parsedSettingsString[43], //Sales Thursday Close
            "-Sales Friday Open" : parsedSettingsString[44], //Sales Friday Open
            "-Sales Friday Close" : parsedSettingsString[45], //Sales Friday Close
            "-Sales Saturday Open" : parsedSettingsString[46], //Sales Saturday Open
            "-Sales Saturday Close" : parsedSettingsString[47], //Sales Saturday Close
            "-Sales Sunday Open" : parsedSettingsString[48], //Sales Sunday Open
            "-Sales Sunday Close" : parsedSettingsString[49], //Sales Sunday Close

            "-Sales Print Friendly Hours line 1" : parsedSettingsString[165], //Sales Print Friendly Hours 1
            "-Sales Print Friendly Hours line 2" : parsedSettingsString[166], //Sales Print Friendly Hours 2
            "-Sales Print Friendly Hours line 3" : parsedSettingsString[167], //Sales Print Friendly Hours 3

            "-Service Print Friendly Hours line 1" : parsedSettingsString[168], //Service Print Friendly Hours 1
            "-Service Print Friendly Hours line 1" : parsedSettingsString[169], //Service Print Friendly Hours 2
            "-Service Print Friendly Hours line 1" : parsedSettingsString[170], //Service Print Friendly Hours 3
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }


    function CompanySettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var websiteURL = parsedSettingsString[164];
        var msgingName = parsedSettingsString[173];

        $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').val(msgingName); //set msging name

        //set msging name box red if it is empty
        if ($('#ctl00_ctl00_Main_Main_tfSMSName_textBox').val().length <= 0) {
            $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').css("background-color", '#FF9090'); //changes color to red
        }

        //actively changes color of 'msging name' text box based on length
        $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').keyup(function() {
            if ($('#ctl00_ctl00_Main_Main_tfSMSName_textBox').val().length <= 0) {
                $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').css("background-color", '#FF9090'); //changes color to red
            } else {
                $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').css("background-color", '#FFFFFF'); //changes color to white
            }
        });

        $('#ctl00_ctl00_Main_Main_tfWebSiteUrl_textBox').val(websiteURL); //website url

        //this needs to repalce all checkbox "if's"
        /*var checkBoxes = [
            "",
        ];
        //checks all sales triggers checkboxes
        for (var i = 0; i < checkBoxes.length; i++) {
            var checkBox= "$('#" + checkBoxes[i] + "')";
            if (checkBox.prop("checked") == false) {
                checkBox.click();
            }
        }*/

        //checks if 'msging name' box is empty
        if ($('#ctl00_ctl00_Main_Main_tfSMSName_textBox').val().length <= 0) {
            $('#ctl00_ctl00_Main_Main_tfSMSName_textBox').css("background-color", '#FF9090'); //changes color to red
        }

        if($('#ctl00_ctl00_Main_Main_cbTemplatesV2').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_cbTemplatesV2').click(); //checkbox - Use Templates v2
        }

        if($('#ctl00_ctl00_Main_Main_cbOptOutsV2').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_cbOptOutsV2').click(); //checkbox - Use Opt-Outs v2
        }

        if($('#ctl00_ctl00_Main_Main_cbDashboardV2').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_cbDashboardV2').click(); //checkbox - Use Dashboard v2
        }

        if($('#ctl00_ctl00_Main_Main_cbEstimatorLogic').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_cbEstimatorLogic').click(); //checkbox - Use Updated Book Estimator Logic
        }

        if($('#ctl00_ctl00_Main_Main_cbProspectImport').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_cbProspectImport').click(); //checkbox - Enable Conquest Data Prospect Import
        }

        $('#ctl00_ctl00_Main_Main_ddlCDProspectMinMCL_ddlDropDown').val("5"); //dropdown - Conquest Data Prospect Max Match Confidence Level

        if($('#ctl00_ctl00_Main_Main_tfProspectZipRadius_textBox').val().length <= 0) {
            $('#ctl00_ctl00_Main_Main_tfProspectZipRadius_textBox').val("30"); //textbox - Radius (miles)
        }

        //color opt outs v2 red if it is disabled due to protal not being active
        if ($('#ctl00_ctl00_Main_Main_cbOptOutsV2').prop('disabled') == true) {
            $('#MainContent > div.container_24.clearfix > div > fieldset:nth-child(1) > div:nth-child(13) > span:nth-child(19) > label').append('<a href="https://autoloop.us/DMS/App/DealershipSettings/Portal.aspx" target="_blank"><small style="font-size:12px"> - Portal Settings</small></a>')
            $('#MainContent > div.container_24.clearfix > div > fieldset:nth-child(1) > div:nth-child(13) > span:nth-child(19) > label').css("background-color", '#FF9090');
        }

        //colors vehicle makes "red" if no make is selected
        if ($('#lstConquestVehicleMakes_chzn > ul > li > input').val() == "Click to select Makes") {
            $('#MainContent > div.container_24.clearfix > div > fieldset:nth-child(1) > div:nth-child(24) > fieldset > div:nth-child(3) > div').css("background-color", '#FF9090'); //changes color of "vehicle makes search" to red
            $('#MainContent > div.container_24.clearfix > div > div:nth-child(11)').prepend("Set Vehicle Makes!").css("color", 'red');
        }

        //service hours
        $('#ctl00_ctl00_Main_Main_ochMon_ddlOpen').val(parsedSettingsString[22]); //monday open
        $('#ctl00_ctl00_Main_Main_ochMon_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochMon_ddlClose').val(parsedSettingsString[23]); //monday close
        $('#ctl00_ctl00_Main_Main_ochMon_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochTue_ddlOpen').val(parsedSettingsString[24]); //tuesday open
        $('#ctl00_ctl00_Main_Main_ochTue_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochTue_ddlClose').val(parsedSettingsString[25]); //tuesday close
        $('#ctl00_ctl00_Main_Main_ochTue_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochWed_ddlOpen').val(parsedSettingsString[26]); //wednesday open
        $('#ctl00_ctl00_Main_Main_ochWed_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochWed_ddlClose').val(parsedSettingsString[27]); //wednesday close
        $('#ctl00_ctl00_Main_Main_ochWed_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochThu_ddlOpen').val(parsedSettingsString[28]); //thursday open
        $('#ctl00_ctl00_Main_Main_ochThu_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochThu_ddlClose').val(parsedSettingsString[29]); //thursday close
        $('#ctl00_ctl00_Main_Main_ochThu_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochFri_ddlOpen').val(parsedSettingsString[30]); //friday open
        $('#ctl00_ctl00_Main_Main_ochFri_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochFri_ddlClose').val(parsedSettingsString[31]); //friday close
        $('#ctl00_ctl00_Main_Main_ochFri_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSat_ddlOpen').val(parsedSettingsString[32]); //saturday open
        $('#ctl00_ctl00_Main_Main_ochSat_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSat_ddlClose').val(parsedSettingsString[33]); //saturday close
        $('#ctl00_ctl00_Main_Main_ochSat_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSun_ddlOpen').val(parsedSettingsString[34]); //sunday open
        $('#ctl00_ctl00_Main_Main_ochSun_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSun_ddlClose').val(parsedSettingsString[35]); //sunday close
        $('#ctl00_ctl00_Main_Main_ochSun_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_printFriendlyServiceHours_txtPrinterFriendlyHours').val(parsedSettingsString[168] + "\n" + parsedSettingsString[169] + "\n" + parsedSettingsString[170]) //set print friendly hours

        //sales hours
        $('#ctl00_ctl00_Main_Main_ochSalesMon_ddlOpen').val(parsedSettingsString[36]); //monday open
        $('#ctl00_ctl00_Main_Main_ochSalesMon_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesMon_ddlClose').val(parsedSettingsString[37]); //monday close
        $('#ctl00_ctl00_Main_Main_ochSalesMon_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesTue_ddlOpen').val(parsedSettingsString[38]); //tuesday open
        $('#ctl00_ctl00_Main_Main_ochSalesTue_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesTue_ddlClose').val(parsedSettingsString[39]); //tuesday close
        $('#ctl00_ctl00_Main_Main_ochSalesTue_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesWed_ddlOpen').val(parsedSettingsString[40]); //wednesday open
        $('#ctl00_ctl00_Main_Main_ochSalesWed_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesWed_ddlClose').val(parsedSettingsString[41]); //wednesday close
        $('#ctl00_ctl00_Main_Main_ochSalesWed_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesThr_ddlOpen').val(parsedSettingsString[42]); //thursday open
        $('#ctl00_ctl00_Main_Main_ochSalesThr_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesThr_ddlClose').val(parsedSettingsString[43]); //thursday close
        $('#ctl00_ctl00_Main_Main_ochSalesThr_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesFri_ddlOpen').val(parsedSettingsString[44]); //friday open
        $('#ctl00_ctl00_Main_Main_ochSalesFri_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesFri_ddlClose').val(parsedSettingsString[45]); //friday close
        $('#ctl00_ctl00_Main_Main_ochSalesFri_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesSat_ddlOpen').val(parsedSettingsString[46]); //saturday open
        $('#ctl00_ctl00_Main_Main_ochSalesSat_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesSat_ddlClose').val(parsedSettingsString[47]); //saturday close
        $('#ctl00_ctl00_Main_Main_ochSalesSat_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesSun_ddlOpen').val(parsedSettingsString[48]); //sunday open
        $('#ctl00_ctl00_Main_Main_ochSalesSun_ddlOpen').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_ochSalesSun_ddlClose').val(parsedSettingsString[49]); //sunday close
        $('#ctl00_ctl00_Main_Main_ochSalesSun_ddlClose').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_Main_Main_printFriendlySalesHours_txtPrinterFriendlyHours').val(parsedSettingsString[165] + "\n" + parsedSettingsString[166] + "\n" + parsedSettingsString[167]) //set print friendly hours
    }
}


//����������������������������������������������������������������������������������������
//OCAS Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Schedule/Settings/OCAS')) {
    //Installz script by: jack@autoloop.com
    $("#RightContent > h1").append("<br><br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#RightContent > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#RightContent > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#RightContent > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //OcasSettings btn
    $("#RightContent > h1").append("<button id='OcasSettingsBtn' type='button'><font color='black'>Execute</font></button><hr><br>");
    $("#OcasSettingsBtn").click(function() {
        if((($('#settingsKeyInputField')).val()).includes("~")) {
            MissingItemCheck();
            OcasSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //changes to "any advisor" when you click "enable any advisor"
    $('#chkShowAnyAdvisor').click(function() {
        $('#ddlFirstApptDefaultAdv').val("00000000-0000-0000-0000-000000000000"); //set first appt advisor to "any advisor"
    });

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Show Pricing in OCAS" : parsedSettingsString[143], //Show Pricing in OCAS
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }

    function OcasSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var showPricing = parsedSettingsString[143].toLowerCase();

        //checkbox key:value
        var checkboxes = {
            "#ctl00_ctl00_ctl00_Main_Main_Main_chkEnableOCAS" : "true", //Enable OCAS
            "#chkShowAnyAdvisor" : "true", //Enable "Any Advisor"
            "#ctl00_ctl00_ctl00_Main_Main_Main_chkFirstAppointment" : "true", //Enable First Appointment
            "#ctl00_ctl00_ctl00_Main_Main_Main_chkFirstAppointmentTimingOverride" : "true", //First Appointment Default Months
            "#ctl00_ctl00_ctl00_Main_Main_Main_chkRecommendedServices" : "true", //Enable Recommended Services
            "#ctl00_ctl00_ctl00_Main_Main_Main_chkRequireServiceSelection" : "true", //Require Service Selection
            "#ctl00_ctl00_ctl00_Main_Main_Main_cbServiceAdvisor" : "true", //Send an email to the following for every customer-booked appointment (Service Advisor)
        };

        //checkbox checker - true & false
        for (var checkbox in checkboxes){
            if (checkboxes[checkbox] == "true") {
                if ($(checkbox).prop("checked") == false) {
                    $(checkbox).click();
                }

            } else if (checkboxes[checkbox] == "false") {
                if ($(checkbox).prop("checked") == true) {
                    $(checkbox).click();
                }
            }
        }

        //if not set to any advisor, change color to red
        if ($('#ddlFirstApptDefaultAdv').val() !== "00000000-0000-0000-0000-000000000000") {
            $('#ddlFirstApptDefaultAdv').css("background-color", '#FF0000');
        }


        //below code is trying to save the changes to "set any advsior"
        //$('#ddlFirstApptDefaultAdv').val("00000000-0000-0000-0000-000000000000"); //set first appt advisor to "any advisor"
        //$('#ddlFirstApptDefaultAdv').trigger("change");
        //$('#ctl00_ctl00_ctl00_Main_Main_Main_trFirstAppointmentDefaultAdvisor').trigger('change');
        //$('#chkShowAnyAdvisor').trigger('change');


        $("#ctl00_ctl00_ctl00_Main_Main_Main_tbFirstApptDefaultMonths").val("4"); //first appt default months
        $("#ctl00_ctl00_ctl00_Main_Main_Main_tbMinimumVehicleYear").val("1980"); //Earliest vehicle year for user selection

        //show pricing in ocas (and starting at)
        if ((showPricing == "y") || (showPricing == "yes")){
            if ($('#chkShowPrices').prop("checked") == false) {
                $('#chkShowPrices').click();
            }
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_chkApproximatePrices').prop("checked") == false) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_chkApproximatePrices').click();
            }

        } else if ((showPricing == "n") || (showPricing == "no")) {
            if ($('#chkShowPrices').prop("checked") == true) {
                $('#chkShowPrices').click();
            }
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_chkApproximatePrices').prop("checked") == true) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_chkApproximatePrices').click();
            }
        }

        //$('#btnSave').click(function() {
        //$('#ddlFirstApptDefaultAdv').val("00000000-0000-0000-0000-000000000000"); //set first appt advisor to "any advisor"
        //});
    }
}


//����������������������������������������������������������������������������������������
//Easily Edit User
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/EditUser.aspx?UserName')) {
    //add buttons. each one does a quick edit: 'add email alias', etc.

    //service advisor settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<small style='font-size:16px'> </small><button id='ServiceAdvisorSettingsBtn' type='button'>Advisor</button>");
    $("#ServiceAdvisorSettingsBtn").click(function() {
        ServiceAdvisorPermissions();
    });

    //service manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='ServiceManagerSettingsBtn' type='button'>Service Manager</button>");
    $("#ServiceManagerSettingsBtn").click(function() {
        ServiceManagerPermissions();
    });

    //sales person settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='SalesPersonSettingsBtn' type='button'>Sales Person</button>");
    $("#SalesPersonSettingsBtn").click(function() {
        SalesPersonPermissions();
    });

    //sales manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='SalesManagerSettingsBtn' type='button'>Sales Manager</button>");
    $("#SalesManagerSettingsBtn").click(function() {
        SalesManagerPermissions();
    });

    //technician settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='TechnicianSettingsBtn' type='button'>Technician</button>");
    $("#TechnicianSettingsBtn").click(function() {
        TechnicianPermissions();
    });

    //bdc rep settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='BDCRepSettingsBtn' type='button'>BDC Rep</button>");
    $("#BDCRepSettingsBtn").click(function() {
        BDCRepPermissions();
    });

    //bdc manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='BDCManagerSettingsBtn' type='button'>BDC Manager</button>");
    $("#BDCManagerSettingsBtn").click(function() {
        BDCManagerPermissions();
    });

    //employee association reminder (still colors red if if value != '(None)'
    if ($("#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span:contains('(None)')")) {
        $('#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span').css("background-color", '#FF9090'); //changes color to red
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(4)').prepend("Set Employee Association!").css("color", 'red');
    }

    if ($('#ctl00_ctl00_Main_Main_txtInboxAlias').length >= 1) {
        //button to set email alias and save
        $("#MainContent > div.container_24.clearfix > h1").append("<br><button id='aliasBtn' type='button'><font color='black'>Set Msging Alias</font></button>");
        $("#aliasBtn").click(function() {
            var firstName = $('#ctl00_ctl00_Main_Main_tfFirstName_textBox').val();
            var lastName = $('#ctl00_ctl00_Main_Main_tfLastName_textBox').val();
            var alias = (firstName.substring(0, 1)) + lastName;
            $('#ctl00_ctl00_Main_Main_txtInboxAlias').val(alias); //set email alias
            $('#ctl00_ctl00_Main_Main_btnSaveButton').click(); //click save button
        });

        //shows email alias that will be set
        function Alias() {
            var firstName = $('#ctl00_ctl00_Main_Main_tfFirstName_textBox').val();
            var lastName = $('#ctl00_ctl00_Main_Main_tfLastName_textBox').val();
            var alias = (firstName.substring(0, 1)) + lastName;
            $('#MainContent > div.container_24.clearfix > h1').append("<small style='font-size:25px' color='red'> Alias:  </small></u>").append(alias);
        }
        Alias();
    }

    function ServiceAdvisorPermissions() {
        var serviceAdvisorPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Quote Viewer", "Lane App User", "Inspection User",
            "Walkaround User", "Services User", "Service Advisor",
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < serviceAdvisorPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + serviceAdvisorPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function ServiceManagerPermissions() {
        var serviceManagerPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Quote Viewer", "Lane App User", "Inspection User",
            "Walkaround User", "Services User", "Service Coordinator",
            "Campaign Approver", "Appointments Admin", "Quote Admin",
            "Service Manager", "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < serviceManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + serviceManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function SalesPersonPermissions() {
        var salesPersonPresets = [
            "Employee", "Quote Viewer", "Sales Person",
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < salesPersonPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + salesPersonPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(9); //landing page set to quote
    }

    function SalesManagerPermissions() {
        var salesManagerPresets = [
            "Employee", "Quote Viewer", "Sales Person",
            "Campaign Approver", "Quote Admin", "Quote Manager",
            "Sales Manager", "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < salesManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + salesManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(9); //landing page set to quote
    }

    function TechnicianPermissions() {
        var TechnicianPresets = [
            "Employee", "Appointments User", "Chat User",
            "Lane App User", "Inspection User", "MPI Technician",
            "Walkaround User", "Services User", "Technician",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < TechnicianPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + TechnicianPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function BDCRepPermissions() {
        var BDCRepPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Service Coordinator", "BDC Rep", "BDC User", //bdc user gets checked in 2 places
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //for each permission, check the box
        for (var i = 0; i < BDCRepPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + BDCRepPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function BDCManagerPermissions() {
        var BDCManagerPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Service Coordinator", "BDC Rep", "BDC User", //bdc user gets checked in 2 places
            "Chat User", "BDC Admin",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //for each permission, check the box
        for (var i = 0; i < BDCManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + BDCManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }


    //����������������������������������������������������������������������������������������
    //Add New User
    //����������������������������������������������������������������������������������������
} else if (window.location.href.includes('DMS/App/DealershipSettings/UserManagement')) {
    if ($('#ctl00_ctl00_Main_Main_ddlActivityFilter').length > 0) {
        //installz script by: jack@autoloop.com
        $('#MainContent > div.container_24.clearfix > h1').append("<br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
        $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
        $('#MainContent > div.container_24.clearfix > h1').append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

        //text box to paste the settings key
        $("#MainContent > div.container_24.clearfix > h1").append("<pre><small style='font-size:12px'>Settings Key:<input type='text' id='settingsKeyInputField' placeholder='' value=''></small></pre><hr>");

        var activeSettingsKey = localStorage.getItem("settingsKeyStorage");
        $('#settingsKeyInputField').val(activeSettingsKey);

        $('#ctl00_ctl00_Main_Main_btnAddNewUser').click(function(){
            var settingsKey = $('#settingsKeyInputField').val();
            localStorage.setItem("settingsKeyStorage", settingsKey); //store settings key to be used on "add new user" page
        });
    }

} else if ((window.location.href.includes('DMS/App/DealershipSettings/EditUser'))) {
    //installz script by: jack@autoloop.com
    $('#MainContent > div.container_24.clearfix > h1').append("<br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $('#MainContent > div.container_24.clearfix > h1').append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to enter user's name for selection
    $("#MainContent > div.container_24.clearfix > h1").append("<pre><small style='font-size:12px'>First & Last Name: <input type='text' id='userFirstLast' placeholder='Hubert Farnsworth' value=''></small></pre>");

    //service advisor settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<small style='font-size:16px'> </small><button id='ServiceAdvisorSettingsBtn' type='button'>Advisor</button>");
    $("#ServiceAdvisorSettingsBtn").click(function() {
        ServiceAdvisorPermissions();
    });

    //service manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='ServiceManagerSettingsBtn' type='button'>Service Manager</button>");
    $("#ServiceManagerSettingsBtn").click(function() {
        ServiceManagerPermissions();
    });

    //sales person settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='SalesPersonSettingsBtn' type='button'>Sales Person</button>");
    $("#SalesPersonSettingsBtn").click(function() {
        SalesPersonPermissions();
    });

    //sales manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='SalesManagerSettingsBtn' type='button'>Sales Manager</button>");
    $("#SalesManagerSettingsBtn").click(function() {
        SalesManagerPermissions();
    });

    //execute button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr><br>");
    $("#executeButton").click(function() {
        AddNewUser();
    });

    //technician settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='TechnicianSettingsBtn' type='button'>Technician</button>");
    $("#TechnicianSettingsBtn").click(function() {
        TechnicianPermissions();
    });

    //bdc rep settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='BDCRepSettingsBtn' type='button'>BDC Rep</button>");
    $("#BDCRepSettingsBtn").click(function() {
        BDCRepPermissions();
    });

    //bdc manager settings button
    $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) > fieldset > legend").append("<button id='BDCManagerSettingsBtn' type='button'>BDC Manager</button>");
    $("#BDCManagerSettingsBtn").click(function() {
        BDCManagerPermissions();
    });

    /*//actively changes color of 'employee association' text box based on value
    $('#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span').change(function() {
        if ($("#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span:contains('(None)')")) {
      $('#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span').css("background-color", '#FF9090'); //changes color to red
        } else {
            $('#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span').css("background-color", '#FFFFFF'); //changes color to white
        }
    });*/

    function AddNewUser() {
        var settingsString = localStorage.getItem("settingsKeyStorage");//$('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        localStorage.setItem("pageWaitStatus", "n");

        var unsplitName;
        var name;
        var email;
        var permissions;

        var salesUser1 = parsedSettingsString[144].split("*");
        var salesUser2 = parsedSettingsString[145].split("*");
        var salesUser3 = parsedSettingsString[146].split("*");
        var salesUser4 = parsedSettingsString[147].split("*");
        var salesUser5 = parsedSettingsString[148].split("*");
        var salesUser6 = parsedSettingsString[149].split("*");
        var salesUser7 = parsedSettingsString[150].split("*");
        var salesUser8 = parsedSettingsString[151].split("*");
        var salesUser9 = parsedSettingsString[152].split("*");
        var salesUser10 = parsedSettingsString[153].split("*");
        var salesUser11 = parsedSettingsString[174].split("*");
        var salesUser12 = parsedSettingsString[175].split("*");
        var salesUser13 = parsedSettingsString[176].split("*");
        var salesUser14 = parsedSettingsString[177].split("*");
        var salesUser15 = parsedSettingsString[178].split("*");
        var salesUser16 = parsedSettingsString[179].split("*");
        var salesUser17 = parsedSettingsString[180].split("*");
        var salesUser18 = parsedSettingsString[181].split("*");

        var serviceUser1 = parsedSettingsString[154].split("*");
        var serviceUser2 = parsedSettingsString[155].split("*");
        var serviceUser3 = parsedSettingsString[156].split("*");
        var serviceUser4 = parsedSettingsString[157].split("*");
        var serviceUser5 = parsedSettingsString[158].split("*");
        var serviceUser6 = parsedSettingsString[159].split("*");
        var serviceUser7 = parsedSettingsString[160].split("*");
        var serviceUser8 = parsedSettingsString[161].split("*");
        var serviceUser9 = parsedSettingsString[162].split("*");
        var serviceUser10 = parsedSettingsString[163].split("*");
        var serviceUser11 = parsedSettingsString[182].split("*");
        var serviceUser12 = parsedSettingsString[183].split("*");
        var serviceUser13 = parsedSettingsString[184].split("*");
        var serviceUser14 = parsedSettingsString[185].split("*");
        var serviceUser15 = parsedSettingsString[186].split("*");
        var serviceUser16 = parsedSettingsString[187].split("*");
        var serviceUser17 = parsedSettingsString[188].split("*");
        var serviceUser18 = parsedSettingsString[189].split("*");



        //send to user input to lowercase
        var userInputNameTrimmed = $('#userFirstLast').val()//.trim(" ");
        var userInputNameSplit = userInputNameTrimmed.split(" ");
        var userInputNameToLowerCase = (userInputNameSplit[0].toLowerCase() + " " + userInputNameSplit[1].toLowerCase());

        //sales user 1
        if (userInputNameToLowerCase.trim() == salesUser1[0].toLowerCase().trim()) {
            unsplitName = salesUser1[0];
            name = unsplitName.split(" ");
            email = salesUser1[1];
            permissions = salesUser1[2];

            //sales user 2
        } else if (userInputNameToLowerCase.trim() == salesUser2[0].toLowerCase().trim()) {
            unsplitName = salesUser2[0];
            name = unsplitName.split(" ");
            email = salesUser2[1];
            permissions = salesUser2[2];

            //sales user 3
        } else if (userInputNameToLowerCase.trim() == salesUser3[0].toLowerCase()) {
            unsplitName = salesUser3[0];
            name = unsplitName.split(" ");
            email = salesUser3[1];
            permissions = salesUser3[2];

            //sales user 4
        } else if (userInputNameToLowerCase.trim() == salesUser4[0].toLowerCase().trim()) {
            unsplitName = salesUser4[0];
            name = unsplitName.split(" ");
            email = salesUser4[1];
            permissions = salesUser4[2];

            //sales user 5
        } else if (userInputNameToLowerCase.trim() == salesUser5[0].toLowerCase().trim()) {
            unsplitName = salesUser5[0];
            name = unsplitName.split(" ");
            email = salesUser5[1];
            permissions = salesUser5[2];

            //sales user 6
        } else if (userInputNameToLowerCase.trim() == salesUser6[0].toLowerCase().trim()) {
            unsplitName = salesUser6[0];
            name = unsplitName.split(" ");
            email = salesUser6[1];
            permissions = salesUser6[2];

            //sales user 7
        } else if (userInputNameToLowerCase.trim() == salesUser7[0].toLowerCase().trim()) {
            unsplitName = salesUser7[0];
            name = unsplitName.split(" ");
            email = salesUser7[1];
            permissions = salesUser7[2];

            //sales user 8
        } else if (userInputNameToLowerCase.trim() == salesUser8[0].toLowerCase().trim()) {
            unsplitName = salesUser8[0];
            name = unsplitName.split(" ");
            email = salesUser8[1];
            permissions = salesUser8[2];

            //sales user 9
        } else if (userInputNameToLowerCase.trim() == salesUser9[0].toLowerCase().trim()) {
            unsplitName = salesUser9[0];
            name = unsplitName.split(" ");
            email = salesUser9[1];
            permissions = salesUser9[2];

            //sales user 10
        } else if (userInputNameToLowerCase.trim() == salesUser10[0].toLowerCase().trim()) {
            unsplitName = salesUser10[0];
            name = unsplitName.split(" ");
            email = salesUser10[1];
            permissions = salesUser10[2];

            //sales user 11
        } else if (userInputNameToLowerCase.trim() == salesUser11[0].toLowerCase().trim()) {
            unsplitName = salesUser11[0];
            name = unsplitName.split(" ");
            email = salesUser11[1];
            permissions = salesUser11[2];

            //sales user 12
        } else if (userInputNameToLowerCase.trim() == salesUser12[0].toLowerCase().trim()) {
            unsplitName = salesUser12[0];
            name = unsplitName.split(" ");
            email = salesUser12[1];
            permissions = salesUser12[2];

            //sales user 13
        } else if (userInputNameToLowerCase.trim() == salesUser13[0].toLowerCase().trim()) {
            unsplitName = salesUser13[0];
            name = unsplitName.split(" ");
            email = salesUser13[1];
            permissions = salesUser13[2];

            //sales user 14
        } else if (userInputNameToLowerCase.trim() == salesUser14[0].toLowerCase().trim()) {
            unsplitName = salesUser14[0];
            name = unsplitName.split(" ");
            email = salesUser14[1];
            permissions = salesUser14[2];

            //sales user 15
        } else if (userInputNameToLowerCase.trim() == salesUser15[0].toLowerCase().trim()) {
            unsplitName = salesUser15[0];
            name = unsplitName.split(" ");
            email = salesUser15[1];
            permissions = salesUser15[2];

            //sales user 16
        } else if (userInputNameToLowerCase.trim() == salesUser16[0].toLowerCase().trim()) {
            unsplitName = salesUser16[0];
            name = unsplitName.split(" ");
            email = salesUser16[1];
            permissions = salesUser16[2];

            //sales user 17
        } else if (userInputNameToLowerCase.trim() == salesUser17[0].toLowerCase().trim()) {
            unsplitName = salesUser17[0];
            name = unsplitName.split(" ");
            email = salesUser17[1];
            permissions = salesUser17[2];

            //sales user 18
        } else if (userInputNameToLowerCase.trim() == salesUser18[0].toLowerCase().trim()) {
            unsplitName = salesUser18[0];
            name = unsplitName.split(" ");
            email = salesUser18[1];
            permissions = salesUser18[2];



            //service user 1
        } else if (userInputNameToLowerCase.trim() == serviceUser1[0].toLowerCase().trim()) {
            unsplitName = serviceUser1[0];
            name = unsplitName.split(" ");
            email = serviceUser1[1];
            permissions = serviceUser1[2];

            //service user 2
        } else if (userInputNameToLowerCase.trim() == serviceUser2[0].toLowerCase().trim()) {
            unsplitName = serviceUser2[0];
            name = unsplitName.split(" ");
            email = serviceUser2[1];
            permissions = serviceUser2[2];

            //service user 3
        } else if (userInputNameToLowerCase.trim() == serviceUser3[0].toLowerCase().trim()) {
            unsplitName = serviceUser3[0];
            name = unsplitName.split(" ");
            email = serviceUser3[1];
            permissions = serviceUser3[2];

            //service user 4
        } else if (userInputNameToLowerCase.trim() == serviceUser4[0].toLowerCase().trim()) {
            unsplitName = serviceUser4[0];
            name = unsplitName.split(" ");
            email = serviceUser4[1];
            permissions = serviceUser4[2];

            //service user 5
        } else if (userInputNameToLowerCase.trim() == serviceUser5[0].toLowerCase().trim()) {
            unsplitName = serviceUser5[0];
            name = unsplitName.split(" ");
            email = serviceUser5[1];
            permissions = serviceUser5[2];

            //service user 6
        } else if (userInputNameToLowerCase.trim() == serviceUser6[0].toLowerCase().trim()) {
            unsplitName = serviceUser6[0];
            name = unsplitName.split(" ");
            email = serviceUser6[1];
            permissions = serviceUser6[2];

            //service user 7
        } else if (userInputNameToLowerCase.trim() == serviceUser7[0].toLowerCase().trim()) {
            unsplitName = serviceUser7[0];
            name = unsplitName.split(" ");
            email = serviceUser7[1];
            permissions = serviceUser7[2];

            //service user 8
        } else if (userInputNameToLowerCase.trim() == serviceUser8[0].toLowerCase().trim()) {
            unsplitName = serviceUser8[0];
            name = unsplitName.split(" ");
            email = serviceUser8[1];
            permissions = serviceUser8[2];

            //service user 9
        } else if (userInputNameToLowerCase.trim() == serviceUser9[0].toLowerCase().trim()) {
            unsplitName = serviceUser9[0];
            name = unsplitName.split(" ");
            email = serviceUser9[1];
            permissions = serviceUser9[2];

            //service user 10
        } else if (userInputNameToLowerCase.trim() == serviceUser10[0].toLowerCase().trim()) {
            unsplitName = serviceUser10[0];
            name = unsplitName.split(" ");
            email = serviceUser10[1];
            permissions = serviceUser10[2];

            //service user 11
        } else if (userInputNameToLowerCase.trim() == serviceUser11[0].toLowerCase().trim()) {
            unsplitName = serviceUser11[0];
            name = unsplitName.split(" ");
            email = serviceUser11[1];
            permissions = serviceUser11[2];

            //service user 12
        } else if (userInputNameToLowerCase.trim() == serviceUser12[0].toLowerCase().trim()) {
            unsplitName = serviceUser12[0];
            name = unsplitName.split(" ");
            email = serviceUser12[1];
            permissions = serviceUser12[2];

            //service user 13
        } else if (userInputNameToLowerCase.trim() == serviceUser13[0].toLowerCase().trim()) {
            unsplitName = serviceUser13[0];
            name = unsplitName.split(" ");
            email = serviceUser13[1];
            permissions = serviceUser13[2];

            //service user 14
        } else if (userInputNameToLowerCase.trim() == serviceUser14[0].toLowerCase().trim()) {
            unsplitName = serviceUser14[0];
            name = unsplitName.split(" ");
            email = serviceUser14[1];
            permissions = serviceUser14[2];

            //service user 15
        } else if (userInputNameToLowerCase.trim() == serviceUser15[0].toLowerCase().trim()) {
            unsplitName = serviceUser15[0];
            name = unsplitName.split(" ");
            email = serviceUser15[1];
            permissions = serviceUser15[2];

            //service user 16
        } else if (userInputNameToLowerCase.trim() == serviceUser16[0].toLowerCase().trim()) {
            unsplitName = serviceUser16[0];
            name = unsplitName.split(" ");
            email = serviceUser16[1];
            permissions = serviceUser16[2];

            //service user 17
        } else if (userInputNameToLowerCase.trim() == serviceUser17[0].toLowerCase().trim()) {
            unsplitName = serviceUser17[0];
            name = unsplitName.split(" ");
            email = serviceUser17[1];
            permissions = serviceUser17[2];

            //service user 18
        } else if (userInputNameToLowerCase.trim() == serviceUser18[0].toLowerCase().trim()) {
            unsplitName = serviceUser18[0];
            name = unsplitName.split(" ");
            email = serviceUser18[1];
            permissions = serviceUser18[2];

        } else {
            alert("User not found!");
        }

        localStorage.setItem("permissions", permissions); //store this for the user adding script. for setting up existing users

        name[0] = (name[0].substring(0, 1).toUpperCase() + name[0].substring(1)); //capitalize first letter of first name
        name[1] = (name[1].substring(0, 1).toUpperCase() + name[1].substring(1)); //capitalize first letter of last name

        $("#ctl00_ctl00_Main_Main_tfUserName_textBox").val(email); //set username
        $("#ctl00_ctl00_Main_Main_tfEmailAddress_textBox").val(email); //set email address
        $("#ctl00_ctl00_Main_Main_tfFirstName_textBox").val(name[0]); //set first name
        $("#ctl00_ctl00_Main_Main_tfLastName_textBox").val(name[1]); //set last name

        var permissionsCheck = {
            "ServiceAdvisorSettingsBtn" : "Advisor",
            "ServiceManagerSettingsBtn" : "Service Manager",
            "SalesPersonSettingsBtn" : "Sales Person",
            "SalesManagerSettingsBtn" : "Sales Manager",
            "TechnicianSettingsBtn" : "Technician",
            "BDCRepSettingsBtn" : "BDC Rep",
            "BDCManagerSettingsBtn" : "BDC Manager",
        }

        for (var permission in permissionsCheck) {
            if (permissions == permissionsCheck[permission]) {
                $("#" + permission).click();
                break;
            }
        }

        if ($('#ctl00_ctl00_Main_Main_cbAllowUserPassword').prop("checked") == true) {
            localStorage.setItem("lastName", name[1]); //store the last name to be used in the password after the page load
            localStorage.setItem("pageWaitStatus", "y"); //store "y" so that this code only runs when it is supposed to
            $('#ctl00_ctl00_Main_Main_cbAllowUserPassword').click(); //uncheck "user chooses password"
        }

        //inbox email alias
        if ($('#ctl00_ctl00_Main_Main_txtInboxAlias').length >= 1) {
            function Alias() {
                var firstName = $('#ctl00_ctl00_Main_Main_tfFirstName_textBox').val();
                var lastName = $('#ctl00_ctl00_Main_Main_tfLastName_textBox').val();
                var alias = (firstName.substring(0, 1)) + lastName;
                $('#ctl00_ctl00_Main_Main_txtInboxAlias').val(alias);
            }
            Alias();
        }
        localStorage.setItem("settingsKeyStorage", settingsString);
    }

    function AddNewUserAfterPageWait() {
        var pageWaitStatus = localStorage.getItem("pageWaitStatus");
        var lastName = localStorage.getItem("lastName");
        var password = (lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase() + "1");
        var settingsString = localStorage.getItem("settingsKeyStorage");

        if (pageWaitStatus == "y") {
            if($('#ctl00_ctl00_Main_Main_cbWelcomeEmail').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_cbWelcomeEmail').click();
            }

            $('#ctl00_ctl00_Main_Main_tfNewPassword_textBox').val(password).prop("type", "text");
            $('#ctl00_ctl00_Main_Main_tfConfirmPassword_textBox').val(password).prop("type", "text");
            localStorage.setItem("pageWaitStatus", "n"); //store "n" so that this code only runs when it is supposed to
        }
        localStorage.setItem("settingsKeyStorage", settingsString);

        //employee association reminder (still colors red if if value != '(None)'
        if ($("#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span:contains('(None)')")) {
            $('#ctl00_ctl00_Main_Main_ddlEmployee_chzn > a > span').css("background-color", '#FF9090'); //changes color to red
            $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(4)').prepend("Set Employee Association!").css("color", 'red');
        }
    }
    AddNewUserAfterPageWait();

    function ServiceAdvisorPermissions() {
        var serviceAdvisorPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Quote Viewer", "Lane App User", "Inspection User",
            "Walkaround User", "Services User", "Service Advisor",
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //for each permission, check the box
        for (var i = 0; i < serviceAdvisorPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + serviceAdvisorPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function ServiceManagerPermissions() {
        var serviceManagerPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Quote Viewer", "Lane App User", "Inspection User",
            "Walkaround User", "Services User", "Service Coordinator",
            "Campaign Approver", "Appointments Admin", "Quote Admin",
            "Service Manager", "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < serviceManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + serviceManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function SalesPersonPermissions() {
        var salesPersonPresets = [
            "Employee", "Quote Viewer", "Sales Person",
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < salesPersonPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + salesPersonPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(9); //landing page set to quote
    }

    function SalesManagerPermissions() {
        var salesManagerPresets = [
            "Employee", "Quote Viewer", "Sales Person",
            "Campaign Approver", "Quote Admin", "Quote Manager",
            "Sales Manager", "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < salesManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + salesManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(9); //landing page set to quote
    }

    function TechnicianPermissions() {
        var TechnicianPresets = [
            "Employee", "Appointments User", "Chat User",
            "Lane App User", "Inspection User", "MPI Technician",
            "Walkaround User", "Services User", "Technician",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //checks all service triggers checkboxes
        for (var i = 0; i < TechnicianPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + TechnicianPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function BDCRepPermissions() {
        var BDCRepPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Service Coordinator", "BDC Rep", "BDC User", //bdc user gets checked in 2 places
            "Chat User",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //for each permission, check the box
        for (var i = 0; i < BDCRepPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + BDCRepPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }

    function BDCManagerPermissions() {
        var BDCManagerPresets = [
            "Employee", "Appointments User", "First Appointment",
            "Service Coordinator", "BDC Rep", "BDC User", //bdc user gets checked in 2 places
            "Chat User", "BDC Admin",
        ];

        //unchecks all boxes
        $('#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span').each(function() {
            $(this).find('input:checkbox').prop("checked", false);
        });

        //for each permission, check the box
        for (var i = 0; i < BDCManagerPresets.length; i++) {
            var thisPermission = $("#ctl00_ctl00_Main_Main_pnlEdit > div:nth-child(2) span:contains('" + BDCManagerPresets[i] + "') input:checkbox")
            thisPermission.prop("checked", true);
        }

        $('#ctl00_ctl00_Main_Main_ddlLandingPage').val(3); //landing page set to scheduling
    }
}


//����������������������������������������������������������������������������������������
//Service Advisors (book settings)
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('DMS/App/Schedule/Settings/ServiceAdvisors')) {
    $('#firstTextBox').keyup(function(){
        $('secondTextBox').val(this.value);
    });
}*/


//����������������������������������������������������������������������������������������
//Service Department Hours
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Schedule/Settings/Hours')) {
    //Installz script by: jack@autoloop.com
    $("#RightContent > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#RightContent > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#RightContent > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#RightContent > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //execute button //change "indexOf" to "includes"
    $("#RightContent > h1").append("<button id='generalBookSettingsBtn' type='button'><font color='black'>Execute</font></button><hr><br>");
    $("#generalBookSettingsBtn").click(function(){
        if((($('#settingsKeyInputField')).val()).includes("~")) {
            MissingItemCheck();
            ServiceDepartmentHours();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function MissingItemCheck() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var missingItemCounter = 0;
        var missingItemMsg = "Missing Items!\n";

        var missingItemsList = {
            "-Service Monday Open" : parsedSettingsString[22], //Service Monday Open
            "-Service Monday Close" : parsedSettingsString[23], //Service Monday Close
            "-Service Tuesday Open" : parsedSettingsString[24], //Service Tuesday Open
            "-Service Tuesday Close" : parsedSettingsString[25], //Service Tuesday Close
            "-Service Wednesday Open" : parsedSettingsString[26], //Service Wednesday Open
            "-Service Wednesday Close" : parsedSettingsString[27], //Service Wednesday Close
            "-Service Thursday Open" : parsedSettingsString[28], //Service Thursday Open
            "-Service Thursday Close" : parsedSettingsString[29], //Service Thursday Close
            "-Service Friday Open" : parsedSettingsString[30], //Service Friday Open
            "-Service Friday Close" : parsedSettingsString[31], //Service Friday Close
            "-Service Saturday Open" : parsedSettingsString[32], //Service Saturday Open
            "-Service Saturday Close" : parsedSettingsString[33], //Service Saturday Close
            "-Service Sunday Open" : parsedSettingsString[34], //Service Sunday Open
            "-Service Sunday Close" : parsedSettingsString[35], //Service Sunday Close
        };

        //missing item checker
        for (var missingItem in missingItemsList) {
            if (!missingItemsList[missingItem]) {
                missingItemCounter++;
                missingItemMsg += "\n" + missingItem;
            }
        }

        //missing item alert msg
        if (missingItemCounter >= 1) {
            alert(missingItemMsg);
        }
    }

    function ServiceDepartmentHours() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        //service hours
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl02_txtStartTime').val(parsedSettingsString[22]); //monday open
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl02_txtStartTime').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl02_txtEndTime').val(parsedSettingsString[23]); //monday close
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl02_txtEndTime').trigger("change"); //trigger event listeners

        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl03_txtStartTime').val(parsedSettingsString[24]); //tuesday open
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl03_txtStartTime').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl03_txtEndTime').val(parsedSettingsString[25]); //tuesday close
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl03_txtEndTime').trigger("change"); //trigger event listeners

        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl04_txtStartTime').val(parsedSettingsString[26]); //wednesday open
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl04_txtStartTime').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl04_txtEndTime').val(parsedSettingsString[27]); //wednesday close
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl04_txtEndTime').trigger("change"); //trigger event listeners

        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl05_txtStartTime').val(parsedSettingsString[28]); //thursday open
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl05_txtStartTime').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl05_txtEndTime').val(parsedSettingsString[29]); //thursday close
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl05_txtEndTime').trigger("change"); //trigger event listeners

        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl06_txtStartTime').val(parsedSettingsString[30]); //friday open
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl06_txtStartTime').trigger("change"); //trigger event listeners
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl06_txtEndTime').val(parsedSettingsString[31]); //friday close
        $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl06_txtEndTime').trigger("change"); //trigger event listeners

        var saturdayOpen = parsedSettingsString[32].toLowerCase();
        var saturdayClose = parsedSettingsString[33].toLowerCase();

        //saturday
        if ((saturdayOpen == "closed") && (saturdayClose == "closed")) {
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_ckbClosed').prop("checked") == false) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_ckbClosed').click();
            }

        } else {
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_ckbClosed').prop("checked") == true) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_ckbClosed').click();
            }
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_txtStartTime').val(parsedSettingsString[32]); //saturday open
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_txtStartTime').trigger("change"); //trigger event listeners
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_txtEndTime').val(parsedSettingsString[33]); //saturday close
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl07_txtEndTime').trigger("change"); //trigger event listeners
        }

        var sundayOpen = parsedSettingsString[34].toLowerCase();
        var sundayClose = parsedSettingsString[35].toLowerCase();

        //sunday
        if ((sundayOpen == "closed") && (sundayClose == "closed")) {
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_ckbClosed').prop("checked") == false) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_ckbClosed').click();
            }

        } else {
            if ($('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_ckbClosed').prop("checked") == true) {
                $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_ckbClosed').click();
            }
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_txtStartTime').val(parsedSettingsString[34]); //sunday open
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_txtStartTime').trigger("change"); //trigger event listeners
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_txtEndTime').val(parsedSettingsString[35]); //sunday close
            $('#ctl00_ctl00_ctl00_Main_Main_Main_StoreHoursGrid_ctl08_txtEndTime').trigger("change"); //trigger event listeners
        }
    }
}


//����������������������������������������������������������������������������������������
//Third Party ID's
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/ThirdPartyIDs')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<br><br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //SetThirdPartIDs() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr><br>");
    $("#executeButton").click(function(){
        if(($('#settingsKeyInputField')).val() !== "") {
            SetThirdPartIDs();
            //emptyAlert();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetThirdPartIDs() {
        //set id's
        $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Amms )").find("input:text").val() //amms
        $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Amms  Generic )").find("input:text").val('AL' + loop.companyId) //amms generic
        $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Documation )").find("input:text").val('AL' + loop.companyId) //documentation
        $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Salem  One )").find("input:text").val('AL' + loop.companyId) //salem one
        $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Subaru  United  Mail )").find("input:text").val('AL' + loop.companyId) //suburu united mail

        //amms check
        if ($("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Amms )").find("input:text").val().length <= 0) {
            $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Amms )").css("background-color", '#FF9090'); //changes color to red
            $("#MainContent > div.container_24.clearfix > div > div > fieldset:contains( Amms  Generic )").css("background-color", '#FFFFFF'); //changes color to white
        }

        //set red "!" for all the other commonly used ID's
        /*$("").keyup(function() {
            //amms
            if ($("").val().length <= 0) {
                $().css("background-color", '#FF9090'); //changes color to red
            } else if ($().val().length >= 1) {
                $().css("background-color", '#FFFFFF'); //changes color to white
            }
        });*/
    }
}


//����������������������������������������������������������������������������������������
//'Test Test' Appt Creater (needed?)
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('DMS/App/')) {

}*/


//����������������������������������������������������������������������������������������
//Edit Images
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('DMS/App/')) {

}*/


//����������������������������������������������������������������������������������������
//Portal Page
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('DMS/App/DealershipSettings/Portal')) {
    //make something to automatically insert the dealer�s name into �Landing Page News�
    //sets time slot color to green
    $('#ctl00_ctl00_Main_Main_lblTimeSlotsColor').append("<button id='greenBtn' type='button'><font color='black'>Green</font></button>");
    $("#greenBtn").click(function() {
        //not working becasue the selectors change everytime
        $('#div.colorpicker_hex > input[type="text"]').val('74cd3a');
        $('#div.colorpicker_hex > input[type="text"]').trigger("change");
    });
}*/


//����������������������������������������������������������������������������������������
//Highlight Used WIQs
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/WiqInitiators')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > div > div:nth-child(4) > h4").append("<br><br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > div > div:nth-child(4) > h4 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > div > div:nth-child(4) > h4").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //execute button
    $("#MainContent > div.container_24.clearfix > div > div:nth-child(4) > h4 > em > small").append("<br><button id='checkWIQsBtn' type='button'><font color='black'>Highlight WIQ's</font></button><hr><br>");
    $("#checkWIQsBtn").click(function(){
        CheckWIQs();
    });

    function CheckWIQs() {
        var missingMsg = "Missing WIQ's"
        var missingCounter = 0;
        var pendingPortalAccountDupeCounter = 0;

        //BDCControlPanelProcessor
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('BDCControlPanelProcessor')").length >= 1) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('BDCControlPanelProcessor')").css("background-color", "#6cbf36");
        } else {
            missingCounter++;
            missingMsg += "\n-BDCControlPanelProcessor";
        }

        //LaraGoldDataProspectImporter
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataProspectImporter')").length >= 1) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataProspectImporter')").css("background-color", "#6cbf36");
        } else {
            missingCounter++;
            missingMsg += "\n-LaraGoldDataProspectImporter";
        }

        //LaraGoldDataTitleAlterationImporter
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataTitleAlterationImporter')").length >= 1) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataTitleAlterationImporter')").css("background-color", "#6cbf36");
        } else {
            missingCounter++;
            missingMsg += "\n-LaraGoldDataTitleAlterationImporter";
        }

        //PendingPortalAccounts
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingPortalAccounts')").length >= 1) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingPortalAccounts')").css("background-color", "#6cbf36");
        } else {
            missingCounter++;
            missingMsg += "\n-PendingToActiveAppointments";
        }

        //PendingToActiveAppointments
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingToActiveAppointments')").length >= 1) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingToActiveAppointments')").css("background-color", "#6cbf36");
        } else {
            missingCounter++;
            missingMsg += "\n-PendingToActiveAppointments";
        }

        $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('Parts Arrived')").css("background-color", "#6cbf36"); //highlight 'parts arrival' wiq
        $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('Service Completion')").css("background-color", "#6cbf36"); //highlight 'service completion' wiq
        $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('Service Introduction')").css("background-color", "#6cbf36"); //highlight 'service introduction' wiq

        //if more than one of a certain wiq, color red
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('BDCControlPanelProcessor')").size() >= 2) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('BDCControlPanelProcessor')").css("background-color", "#FF9090");
        }
        //if more than one of a certain wiq, color red
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataProspectImporter')").size() >= 2) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataProspectImporter')").css("background-color", "#FF9090");
        }
        //if more than one of a certain wiq, color red
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataTitleAlterationImporter')").size() >= 2) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('LaraGoldDataTitleAlterationImporter')").css("background-color", "#FF9090");
        }
        //if more than one of a certain wiq, color red
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingPortalAccounts')").size() >= 2) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingPortalAccounts')").css("background-color", "#FF9090");
        }
        //if more than one of a certain wiq, color red
        if ($("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingToActiveAppointments')").size() >= 2) {
            $("#ctl00_ctl00_Main_Main_gvInitiators > tbody td:contains('PendingToActiveAppointments')").css("background-color", "#FF9090");
        }

        //check missingCounter
        if (missingCounter >= 1) {
            alert(missingMsg);
        }
    }
}


//����������������������������������������������������������������������������������������
//Dealership Service Intervals - Importing (remove "can (km)" and "custom")
//����������������������������������������������������������������������������������������
//add a feature to select all service plans that DO NOT include '*CUSTOM' or canadian service plans
if (window.location.href.includes('DMS/App/DealershipSettings/ServicePlans/Dealership/ServicePlans')) {


    //pasting below code into console works, just need to figure out how to apply it to the pop up modal on page load

    /*$("[data-tip='Search service plans']").click(function(){
        // $(window).load(function() {
        alert("yo")
        $('#ngdialog2-aria-labelledby').append("yo")
        //});
    });*/

    /*$("#MainContent .ng-scope:nth-of-type(1) [data-tip='Import service plans']").click(function(){
        $("#ngdialog3 > div.ngdialog-content").load(function() {
            $(".ng-touched").click(function(){
                alert("yo")
            });
        });
    });



    $("[data-tip='Search service plans']").click(function(){
        $(window).load(function() {
            alert("yo");


        });
    });*/




    $("#ngdialog1 > div.ngdialog-content > div.left-pane > ul li").each(function() {
        if ($('#selectAll').prop("checked") == false) {
            $('#selectAll').click();
        }
        if ($(this).text().includes("Can (km)")) {
            $(this).find('input:checkbox').click(); //prop("checked", false);
        } else {
            //$(this).find('input:checkbox').prop("checked", true);
        }
    });





}


//����������������������������������������������������������������������������������������
//Dealership Service Intervals
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/ServicePlans/Dealership/ServiceIntervals')) {
    //let us start off by pooping down a shute into a dumbpster.
    //make the checkbox trigger when MY save buttton gets clicked

    //Installz script by: jack@autoloop.com
    $("#divUpdateBySearchWrapper > h2").append("<br><hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#divUpdateBySearchWrapper > h2 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#divUpdateBySearchWrapper > h2").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //moves 'save changes' button to the top of the page
    $('#divUpdateGridResults').prepend("<button id='saveButton' type='button'> Apply and Save </button>");
    $("#saveButton").click(function() {
        $('#opCodeUpdate').val($("#opcodeInput").val()); //sets value of the 'opcode' text equal to the opcode input text box
        $('#cbUpdateOpCode').prop("checked", true); //selects opcode checkbox
        $('#divUpdateResults > div.task_nav > a').click();
        $('#opcodeInput').val(""); //clear opcode textbox value
    });

    //moved 'opcode' input text box to top of page
    $('#divUpdateGridResults').prepend("<br><br><hr><font color='red'> OpCode: </font> <input type='text' id='opcodeInput' placeholder='>_<'value=''>");

    //set intervals btn
    $("#divSearchServiceIntervals > h3").prepend("<br><button id='setIntervalsBtn' type='button'> set interval </button><br>");
    $("#setIntervalsBtn").click(function(){
        $('#opCodeUpdate').val("");
        IntervalChecker();
        //$('#divUpdateBySearchContent > div.float_right > a').click(); //clicks serch button
    });

    //set plans btn
    $("#divSearchServicePlans > h3").prepend("<button id='planSetterBtn' type='button'> set plans </button><hr>");
    $("#planSetterBtn").click(function() {
        PlanSetter();
    });

    //exclude text box
    $("#divSearchServicePlans > h3").prepend("<br><small style='font-size:12px'>Exclude: <input type='text' id='excludePlanInput' placeholder='seperate;values;like;this' value=''></small><br>");

    //include text box
    $("#divSearchServicePlans > h3").prepend("<br><small style='font-size:12px'>Include: <input type='text' id='includePlanInput' placeholder='seperate;values;like;this' value=''></small>");

    //other mileage interval checkbox
    $('#divSearchServiceIntervals > h3').prepend("<small style='font-size:12px'>Other: <input type='text' id='customIntervalInput' placeholder='5k or 5000' value=''></small>"); //checks all boxes to do with 60k

    //interval checkboxes
    $('#divSearchServiceIntervals > h3').prepend(" 60k<input type= 'checkbox' id= 'myCheckBox60k' value= '60kCheckbox'><br>"); //checks all boxes to do with 60k
    $('#divSearchServiceIntervals > h3').prepend(" 30k<input type= 'checkbox' id= 'myCheckBox30k' value= '30kCheckbox'>"); //checks all boxes to do with 30k
    $('#divSearchServiceIntervals > h3').prepend(" 15k<input type= 'checkbox' id= 'myCheckBox15k' value= '15kCheckbox'>"); //checks all boxes to do with 15k
    $('#divSearchServiceIntervals > h3').prepend(" 10k<input type= 'checkbox' id= 'myCheckBox10k' value= '10kCheckbox'>"); //checks all boxes to do with 60k
    $('#divSearchServiceIntervals > h3').prepend(" 7.5k<input type= 'checkbox' id= 'myCheckBox7point5k' value= '7point5kCheckbox'>"); //checks all boxes to do with 7.5k
    $('#divSearchServiceIntervals > h3').prepend(" 5k<input type= 'checkbox' id= 'myCheckBox5k' value= '5kCheckbox'>"); //checks all boxes to do with 5k

    //makes sure all checkboxes get unchecked
    function IntervalChecker() {
        if ($('#cbSelectAllServiceIntervals').prop("checked", true)) {
            $('#cbSelectAllServiceIntervals').click(); //click to make all checkboxes false
        } else if ($('#cbSelectAllServiceIntervals').prop("checked", false)) {
            $('#cbSelectAllServiceIntervals').click(); //click to make all checkboxes true
            $('#cbSelectAllServiceIntervals').click(); //click to make all checkboxes false
        }

        //limits to only one interval to be checked at a time, defaults to the largest
        if ($('#customIntervalInput').val() !== "") {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            textBoxIntervals();

        } else if($("#myCheckBox60k").prop('checked') == true) {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            checkBoxIntervals();

        } else if($("#myCheckBox30k").prop('checked') == true) {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            checkBoxIntervals();

        } else if($("#myCheckBox15k").prop('checked') == true) {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            checkBoxIntervals();

        } else if($("#myCheckBox10k").prop('checked') == true) {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            checkBoxIntervals();

        } else if($("#myCheckBox7point5k").prop('checked') == true) {
            $('#myCheckBox5k').prop('checked', false); //disable 5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            checkBoxIntervals();

        } else if($("#myCheckBox5k").prop('checked') == true) {
            $('#myCheckBox7point5k').prop('checked', false); //disable 7.5k
            $('#myCheckBox10k').prop('checked', false); //disable 10k
            $('#myCheckBox15k').prop('checked', false); //disable 15k
            $('#myCheckBox30k').prop('checked', false); //disable 30k
            $('#myCheckBox60k').prop('checked', false); //disable 60k
            checkBoxIntervals();
        } else if ($('#customIntervalInput').val().length >= 1) {
            textBoxIntervals();
        }

        function checkBoxIntervals() {
            //interval key:value
            var intervals = {
                "#myCheckBox5k" : 5000,
                "#myCheckBox7point5k" : 7500,
                "#myCheckBox10k" : 10000,
                "#myCheckBox15k" : 15000,
                "#myCheckBox30k" : 30000,
                "#myCheckBox60k" : 60000,
            };

            //interval setter
            for (var interval in intervals){
                if($(interval).prop('checked') == true) {
                    $("#ulServiceIntervalsServiceIntervals li").each(function(){
                        if ($(this).text() % intervals[interval] == 0) {
                            $(this).find('input:checkbox').prop("checked", true);
                        } else if ($(this).text() % intervals[interval] !== 0) {
                            $(this).find('input:checkbox').prop("checked", false);
                        }
                    });
                }
            }
        }

        function textBoxIntervals() {
            var textboxInterval = $('#customIntervalInput').val();
            if (($('#customIntervalInput').val().includes("k")) || $('#customIntervalInput').val().includes("K")) { //this if statement allows a user to enter the interval as"20k" instead of "20000"
                textboxInterval = textboxInterval.replace("K", "000");
                textboxInterval = textboxInterval.replace("k", "000");
            }

            $("#ulServiceIntervalsServiceIntervals li").each(function(){
                if ($(this).text() % textboxInterval == 0) {
                    $(this).find('input:checkbox').prop("checked", true);
                } else if ($(this).text() % textboxInterval !== 0) {
                    $(this).find('input:checkbox').prop("checked", false);
                }
            });
        }
    }

    //plan setter
    function PlanSetter() {
        var includePlanSearch = $('#includePlanInput').val().toLowerCase(); //to include in search
        var excludePlanSearch = $('#excludePlanInput').val().toLowerCase(); //to exclude in search
        var includePlanSearchArray = includePlanSearch.split(";");
        var excludePlanSearchArray = excludePlanSearch.split(";");

        if ($('#includePlanInput').val() == $('#excludePlanInput').val()) {
            alert("Your include and excludes values cannot be equal!");

        } else {
            $('#cbSelectAllServicePlans').prop("checked", false); //unchecks "check all"
            $("#ulServiceIntervalsServicePlans li").each(function() {
                $(this).find('input:checkbox').prop("checked", false);
            });

            //include
            if ($('#includePlanInput').val().length >= 1) {
                $("#ulServiceIntervalsServicePlans li").each(function() {
                    for (var i = 0; i < includePlanSearchArray.length; i++) {
                        if ($(this).text().toLowerCase().includes(includePlanSearchArray[i])) {
                            $(this).find('input:checkbox').prop("checked", true);
                        }
                    }
                });
            }

            //exclude
            if ($('#excludePlanInput').val().length >= 1) {
                $("#ulServiceIntervalsServicePlans li").each(function() {
                    for (var i = 0; i < excludePlanSearchArray.length; i++) {
                        if ($(this).text().toLowerCase().includes(excludePlanSearchArray[i])) {
                            console.log(excludePlanSearchArray[i])
                            $(this).find('input:checkbox').prop("checked", false);
                        }
                    }
                });
            }
        }
    }
}


//����������������������������������������������������������������������������������������
//Trigger Status Page (Ned's)
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('csa.autoloop.us/CustomerTrigger/Customer/')) {
    //Make Button
    $('.form-actions').prepend('<a class="btn btn-primary" id="tsdCopy"><img src="https://dl.dropboxusercontent.com/u/188331/Kirby-small.png"/> Match All</a>').click(function() {
        //Fix Dropdowns
        $("#trigger-status tr td:nth-child(4)").each(function(index) {
            var loopStatus = $(this).text().trim();
            if ($(this).hasClass('loop-setting-differs')) {
                _changeStatus(loopStatus, index);
            }
            if ($(this).hasClass('loop-setting-unknown')) { //NA
                _changeStatus('', index);
            }
            _changeTextbox(loopStatus, index);
        });
        function _changeStatus(loopStatus, index) {
            $("#trigger-status select").each(function(selectIndex) {
                if (selectIndex == index) {
                    if (loopStatus == 'Declined')
                        $(this).val(5);
                    if (loopStatus == 'Active')
                        $(this).val(2);
                    if (loopStatus == 'Batched')
                        $(this).val(1);
                    if (loopStatus == '')
                        $(this).val(8);
                }
            });
        }
        function _changeTextbox(loopStatus, index) {
            $("#trigger-status input[type='text']").each(function(textIndex) {
                if (textIndex == index && $(this).val().length<=0) {
                    if (loopStatus == '') {
                        $(this).val('-N/A');
                    }
                    else {
                        $(this).val('-Per Enrollment');
                    }
                }
            });
        }
        //Fix CheckBoxes
        $("#trigger-status :checkbox").each(function(index) {
            if ($(this).parent().hasClass('loop-setting-differs')) {
                if($(this).prop('checked'))
                    $(this).prop('checked', false);
                if(!$(this).prop('checked'))
                    $(this).prop('checked', true);
            }
        });
    });
    //Move bar to above table
    $('.key').append($('.form-actions'))
}*/


//����������������������������������������������������������������������������������������
//Tigger Overview Page
//����������������������������������������������������������������������������������������



//����������������������������������������������������������������������������������������
//DealerShip Amenities
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/DealershipSettings/DealershipAmenities')) {
    //master amenities link
    $('#MainContent > div.container_24.clearfix > h1').append('<a href="https://autoloop.us/DMS/App/GlobalSettings/MasterAmenities.aspx" target="_blank"><small style="font-size:12px"> Master Amenities List</small></a>');
    $('#MainContent > div.container_24.clearfix > h1 > a > small').css("color", '#FF0000'); //changes color of link to red
}


//����������������������������������������������������������������������������������������
//Edit Settings - All Triggers
//����������������������������������������������������������������������������������������
if ((window.location.href.includes('/DMS/App/Notifications/')) && (window.location.href.includes('/Settings'))) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //apptConfirmationEditSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            TriggerEditSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function TriggerEditSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
        var phoneNumber;
        var contactName;
        var contactTitle;
        var contactEmail;
        var voice;
        var sms;
        var email;
        var bdc;

        //service trigger pages
        if ((window.location.href.includes('/Notifications/AppointmentConfirmation/Settings')) || (window.location.href.includes('/Notifications/CustomerRecovery/Settings')) || (window.location.href.includes('/Notifications/DeclinedRepairs/Settings'))
            || (window.location.href.includes('/Notifications/MissedAppointment/Settings')) || (window.location.href.includes('/Notifications/PartsArrival/Settings')) || (window.location.href.includes('/Notifications/ScheduledMaintenance/Settings'))
            || (window.location.href.includes('/Notifications/ServiceCompletion/Settings')) || (window.location.href.includes('/Notifications/ServiceFollowup/Settings')) || (window.location.href.includes('/Notifications/ServiceIntroduction/Settings'))
            || (window.location.href.includes('/Notifications/StateInspectionReminder/Settings')) || (window.location.href.includes('/Notifications/TireDue/Settings')) || (window.location.href.includes('/Notifications/VehicleAccessories/Settings'))) {
            phoneNumber = parsedSettingsString[5];
            contactName = parsedSettingsString[9];
            contactTitle = parsedSettingsString[11];
            contactEmail = parsedSettingsString[10];
        }

        //sales trigger pages
        if ((window.location.href.includes('/Notifications/CustomerBirthday/Settings')) || (window.location.href.includes('/Notifications/WarrantyExpiration/Settings')) || (window.location.href.includes('/Notifications/LeaseExpiration/Settings'))
            || (window.location.href.includes('/Notifications/PurchaseFollowUp/Settings')) || (window.location.href.includes('/Notifications/ServiceContractFollowup/Settings')) || (window.location.href.includes('/Notifications/ServiceToSales/Settings'))
            || (window.location.href.includes('/Notifications/TradeCycle/Settings')) || (window.location.href.includes('/Notifications/VehicleAnniversary/Settings')) || (window.location.href.includes('/Notifications/TradeUpAdvantage/Settings'))
            || (window.location.href.includes('/Notifications/TradeUpWelcome/Settings'))) {
            phoneNumber = parsedSettingsString[4];
            contactName = parsedSettingsString[6];
            contactTitle = parsedSettingsString[8];
            contactEmail = parsedSettingsString[7];
        }



        //service trigger variables
        //AppointmentConfirmation
        if (window.location.href.includes('/AppointmentConfirmation/Settings')) {
            voice = parsedSettingsString[13];
            sms = parsedSettingsString[14];
            email = parsedSettingsString[15];
            bdc = parsedSettingsString[16];
        }
        //CustomerRecovery
        if (window.location.href.includes('/CustomerRecovery/Settings')) {
            voice = parsedSettingsString[54];
            sms = parsedSettingsString[55];
            email = parsedSettingsString[56];
            bdc = parsedSettingsString[57];
        }
        //DeclinedRepairs
        if (window.location.href.includes('/DeclinedRepairs/Settings')) {
            voice = parsedSettingsString[58];
            sms = parsedSettingsString[59];
            email = parsedSettingsString[60];
            bdc = parsedSettingsString[61];
        }
        //MissedAppointment
        if (window.location.href.includes('/MissedAppointment/Settings')) {
            voice = parsedSettingsString[50];
            sms = parsedSettingsString[51];
            email = parsedSettingsString[52];
            bdc = parsedSettingsString[53];
        }
        //PartsArrival
        if (window.location.href.includes('/PartsArrival/Settings')) {
            voice = parsedSettingsString[62];
            sms = parsedSettingsString[63];
            email = parsedSettingsString[64];
            bdc = parsedSettingsString[65];
        }
        //ScheduledMaintenance
        if (window.location.href.includes('/ScheduledMaintenance/Settings')) {
            voice = parsedSettingsString[66];
            sms = parsedSettingsString[67];
            email = parsedSettingsString[68];
            bdc = parsedSettingsString[69];
        }
        //ServiceCompletion
        if (window.location.href.includes('/ServiceCompletion/Settings')) {
            voice = parsedSettingsString[70];
            sms = parsedSettingsString[71];
            email = parsedSettingsString[72];
            bdc = parsedSettingsString[73];
        }
        //ServiceFollowup
        if (window.location.href.includes('/ServiceFollowup/Settings')) {
            voice = parsedSettingsString[74];
            sms = parsedSettingsString[75];
            email = parsedSettingsString[76];
            bdc = parsedSettingsString[77];
        }
        //ServiceIntroduction
        if (window.location.href.includes('/ServiceIntroduction/Settings')) {
            voice = parsedSettingsString[78];
            sms = parsedSettingsString[79];
            email = parsedSettingsString[80];
            bdc = parsedSettingsString[81];
        }
        //StateInspectionReminder
        if (window.location.href.includes('/StateInspectionReminder/Settings')) {
            voice = parsedSettingsString[82];
            sms = parsedSettingsString[83];
            email = parsedSettingsString[84];
            bdc = parsedSettingsString[85];
        }
        //TireDue
        if (window.location.href.includes('/TireDue/Settings')) {
            voice = parsedSettingsString[86];
            sms = parsedSettingsString[87];
            email = parsedSettingsString[88];
            bdc = parsedSettingsString[89];
        }

        //VehicleAccessories
        if (window.location.href.includes('/VehicleAccessories/Settings')) {
            voice = parsedSettingsString[90];
            sms = parsedSettingsString[91];
            email = parsedSettingsString[92];
            bdc = parsedSettingsString[93];
        }



        //sales trigger variables
        //CustomerBirthday
        if (window.location.href.includes('/CustomerBirthday/Settings')) {
            voice = parsedSettingsString[94];
            sms = parsedSettingsString[95];
            email = parsedSettingsString[96];
            bdc = parsedSettingsString[97];
        }
        //WarrantyExpiration
        if (window.location.href.includes('/WarrantyExpiration/Settings')) {
            voice = parsedSettingsString[98];
            sms = parsedSettingsString[99];
            email = parsedSettingsString[100];
            bdc = parsedSettingsString[101];
        }
        //LeaseExpiration
        if (window.location.href.includes('/LeaseExpiration/Settings')) {
            voice = parsedSettingsString[102];
            sms = parsedSettingsString[103];
            email = parsedSettingsString[104];
            bdc = parsedSettingsString[105];
        }
        //PurchaseFollowUp
        if (window.location.href.includes('/PurchaseFollowUp/Settings')) {
            voice = parsedSettingsString[106];
            sms = parsedSettingsString[107];
            email = parsedSettingsString[108];
            bdc = parsedSettingsString[109];
        }
        //ServiceContractFollowup
        if (window.location.href.includes('/ServiceContractFollowup/Settings')) {
            voice = parsedSettingsString[110];
            sms = parsedSettingsString[111];
            email = parsedSettingsString[112];
            bdc = parsedSettingsString[113];
        }
        //ServiceToSales
        if (window.location.href.includes('/ServiceToSales/Settings')) {
            voice = parsedSettingsString[114];
            sms = parsedSettingsString[115];
            email = parsedSettingsString[116];
            bdc = parsedSettingsString[117];
        }
        //TradeCycle
        if (window.location.href.includes('/TradeCycle/Settings')) {
            voice = parsedSettingsString[118];
            sms = parsedSettingsString[119];
            email = parsedSettingsString[120];
            bdc = parsedSettingsString[121];
        }
        //VehicleAnniversary
        if (window.location.href.includes('/VehicleAnniversary/Settings')) {
            voice = parsedSettingsString[122];
            sms = parsedSettingsString[123];
            email = parsedSettingsString[124];
            bdc = parsedSettingsString[125];
        }

        //TradeUpAdvantage
        if (window.location.href.includes('/TradeUpAdvantage/Settings')) {
            voice = "na";
            sms = "na";
            email = "na";
            bdc = "na";
        }
        //TradeUpWelcome
        if (window.location.href.includes('/TradeUpWelcome/Settings')) {
            voice = "na";
            sms = "na";
            email = "na";
            bdc = "na";
        }

        voice.toLowerCase();
        sms.toLowerCase();
        email.toLowerCase();
        bdc.toLowerCase();

        function MissingItemCheck() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
            var missingItemCounter = 0;
            var missingItemMsg = "Missing Items!\n";

            var missingItemsList = {
                "-Phone number" : phoneNumber, //Walkins Consume Capacity
                "-Area Code" : parsedSettingsString[12], //Area Code
                "-Contact name" : contactName, //Contact name
                "-Contact email" : contactEmail, //Contact email
                "-Contact Title" : contactTitle, //Contact Title
                "-What to send: voice" : voice, //What to send: voice
                "-What to send: sms" : sms, //What to send: sms
                "-What to send: email" : email, //What to send: email
            };

            //missing item checker
            for (var missingItem in missingItemsList) {
                if (!missingItemsList[missingItem]) {
                    missingItemCounter++;
                    missingItemMsg += "\n" + missingItem;
                }
            }

            //missing item alert msg
            if (missingItemCounter >= 1) {
                alert(missingItemMsg);
            }
        }
        MissingItemCheck();

        //general info
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfCallerId_textBox').val(phoneNumber); //caller id #
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_loopCallTransfer_tfCallTransfer_textBox').val(phoneNumber); //call transfer #
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfCSRCallBack_textBox').val(phoneNumber); //csr callback #
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfDefaultAreaCode_textBox').val(parsedSettingsString[12]); //area code
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfCSREmail_textBox').val(contactEmail); //csr email
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfEmailForward_textBox').val(contactEmail); //forward email responses to:
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_tfContactName_textBox').val(contactName); //contact name
        $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopSuperAdminSettings_tfJobTitle_textBox').val(contactTitle); //contact title

        //show amenities and select amenities category
        if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbShowAmenities').prop("checked", false)) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbShowAmenities').click();
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbShowAmenities').prop("checked", true); //show amenities
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_ddlAmenityCategory').val(1); //amenites category set to service
        }

        //enable multi-analyzer
        if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').prop("checked") == false) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').click();
        }

        //what to send: voice
        if ((voice == "y") || (voice == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("Voice Calls") input:checkbox').prop("checked", true); //voice enabled
        } else if ((voice == "n") || (voice == "N")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("Voice Calls") input:checkbox').prop("checked", false); //voice disabled
        }

        //what to send: sms
        if ((sms == "y") || (sms == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("SMS Text Messages") input:checkbox').prop("checked", true); //sms enabled
        } else if ((sms == "n") || (sms == "N")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("SMS Text Messages") input:checkbox').prop("checked", false); //sms disabled
        }

        //what to send: email
        if ((email == "y") || (email == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("Emails") input:checkbox').prop("checked", true); //email enabled
        } else if ((email == "n") || (email == "N")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("Emails") input:checkbox').prop("checked", false); //email disabled
        }

        //what to send: bdc
        /*if ((bdc == "y") || (bdc == "Y")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("BDC") input:checkbox').prop("checked", true); //bdc enabled
        } else if ((bdc == "n") || (bdc == "N")) {
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopNotificationSettings_fsWhatToSend > div > table > tbody > tr > td div:contains("Voice") input:checkbox').prop("checked", false); //bdc disabled
        }*/
    }
}


//����������������������������������������������������������������������������������������
//Edit Settings - Special Trigger Pages
//����������������������������������������������������������������������������������������
if ((window.location.href.includes('/DMS/App/Notifications/')) && (window.location.href.includes('/Settings'))) {
    if (window.location.href.includes('/DMS/App/Notifications/ServiceCompletion/Settings')) { //Service Completion
        $("#executeButton").click(function() {
            ServiceCompletionWIQ();
        });

        function ServiceCompletionWIQ() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').click(); //wiq enabled
            }

            //multi analyzer disabled
            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').click();
            }

            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbMondayOk').prop("checked", true); //monday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbTuesdayOk').prop("checked", true); //tuesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbWednesdayOk').prop("checked", true); //wednesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbThursdayOk').prop("checked", true); //thursday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbFridayOk').prop("checked", true); //friday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSaturdayOk').prop("checked", true); //saturday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSundayOk').prop("checked", false); //sunday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_rbInterval').click(); //interval radio switch
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_txtFrequency').val(15); //interval minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlHour').val(7); //not before hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlMinute').val(0); //not before minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlAmPm').val("AM"); //not before am/pm
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlHour').val(11); //not afer hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlMinute').val(45); //not afer minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlAmPm').val("PM"); //not afer am/pm
        }



    } else if (window.location.href.includes('/DMS/App/Notifications/ServiceIntroduction/Settings')) { //service introduction
        $("#executeButton").click(function() {
            ServiceIntroductionWIQ();
        });

        function ServiceIntroductionWIQ() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').click(); //wiq enabled
            }

            //multi analyzer disabled
            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').click();
            }

            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbMondayOk').prop("checked", true); //monday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbTuesdayOk').prop("checked", true); //tuesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbWednesdayOk').prop("checked", true); //wednesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbThursdayOk').prop("checked", true); //thursday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbFridayOk').prop("checked", true); //friday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSaturdayOk').prop("checked", true); //saturday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSundayOk').prop("checked", false); //sunday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_rbInterval').click(); //interval radio switch
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_txtFrequency').val(15); //interval minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlHour').val(7); //not before hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlMinute').val(0); //not before minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlAmPm').val("AM"); //not before am/pm
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlHour').val(11); //not afer hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlMinute').val(45); //not afer minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlAmPm').val("PM"); //not afer am/pm
        }



    } else if (window.location.href.includes('/DMS/App/Notifications/TireDue/Settings')) { //tires due
        //$('#ctl00_ctl00_Main_Main_loopServiceSettings_txtTireURL_textBox').val(parsedSettingsString[]); //tire link
        $("#executeButton").click(function() {
            tiresDue();
        });

        function tiresDue() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            $('#ctl00_ctl00_Main_Main_loopServiceSettings_txtTireURL_textBox').val(parsedSettingsString[139]);
        }



    } else if (window.location.href.includes('/DMS/App/Notifications/PartsArrival/Settings')) { //parts arrival
        $("#executeButton").click(function() {
            PartsArrivalWIQ();
        });

        function PartsArrivalWIQ() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbIsActive').click(); //wiq enabled
            }

            //multi analyzer disabled
            if ($('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopBaseTriggerSettings_cbEnableMulti').click();
            }

            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbMondayOk').prop("checked", true); //monday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbTuesdayOk').prop("checked", true); //tuesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbWednesdayOk').prop("checked", true); //wednesday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbThursdayOk').prop("checked", true); //thursday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbFridayOk').prop("checked", true); //friday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSaturdayOk').prop("checked", true); //saturday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_cbSundayOk').prop("checked", false); //sunday
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_rbInterval').click(); //interval radio switch
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_txtFrequency').val(300); //interval minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlHour').val(7); //not before hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlMinute').val(0); //not before minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeBefore_ddlAmPm').val("AM"); //not before am/pm
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlHour').val(11); //not afer hours
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlMinute').val(45); //not afer minutes
            $('#ctl00_ctl00_Main_Main_loopServiceSettings_loopDmsCacheSettings_lvWiqSettings_ctrl0_selectTimeAfter_ddlAmPm').val("PM"); //not afer am/pm
        }



    } else if (window.location.href.includes('/DMS/App/Notifications/ServiceFollowup/Settings')) { //service introduction
        $("#executeButton").click(function() {
            ServiceFollowUp();
        });

        function ServiceFollowUp() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if (parsedSettingsString[172].toLowerCase() == "y") {
                $("fieldset:nth-child(12) td:nth-of-type(3) [type]").click();

            } else if (parsedSettingsString[172].toLowerCase() == "n") {
                $("fieldset:nth-child(12) td:nth-of-type(1) [type='radio']").click();
            }
        }



    } else if (window.location.href.includes('/DMS/App/Notifications/PurchaseFollowUp/Settings')) { //service introduction
        $("#executeButton").click(function() {
            SalesFollowUp();
        });

        function SalesFollowUp() {
            var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
            var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

            if (parsedSettingsString[171].toLowerCase() == "y") {
                $("td:nth-of-type(3) [type]").click();

            } else if (parsedSettingsString[171].toLowerCase() == "n") {
                $("fieldset:nth-child(14) td:nth-of-type(1) [type='radio']").click();
            }
        }
    }
}


//not saving as of 11/30
//����������������������������������������������������������������������������������������
//Appointment Confirmation - Make Settings
//����������������������������������������������������������������������������������������
/*if (window.location.href.includes('DMS/App/Notifications/AppointmentConfirmation/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //apptConfirmationVehicleMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            apptConfirmationVehicleMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function apptConfirmationVehicleMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[14].toLowerCase();
        var emailStatus = parsedSettingsString[15].toLowerCase();
        var voiceStatus = parsedSettingsString[13].toLowerCase();

        //interval in days
        if (smsStatus == "y" || emailStatus == "y" || voiceStatus == "y") {
            $('#ctl00_ctl00_Main_Main_ddlSendReminder1').val("7"); //interval 1
            $('#ctl00_ctl00_Main_Main_ddlSendReminder1').trigger("change");
            $('#ctl00_ctl00_Main_Main_ddlSendReminder2').val("1"); //interval 2
            $('#ctl00_ctl00_Main_Main_ddlSendReminder2').trigger("change");
        } else if (smsStatus == "n" && emailStatus == "n" && voiceStatus == "n") {
            $('#ctl00_ctl00_Main_Main_ddlSendReminder1').val("-1"); //interval 1
            $('#ctl00_ctl00_Main_Main_ddlSendReminder1').trigger("change");
            $('#ctl00_ctl00_Main_Main_ddlSendReminder2').val("-1"); //interval 2
            $('#ctl00_ctl00_Main_Main_ddlSendReminder2').trigger("change");
        }

        //email
        if (emailStatus == "y") {
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(1) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').val('f5876a24-f8a1-479b-8587-758556b6ec11'); //email template - first notification
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(1) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').trigger("change");
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(2) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').val('e2a11577-0ccd-40c2-bec6-37d706367727'); //email template - second notification
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(2) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').trigger("change");
        } else if (emailStatus == "n") {
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(1) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').val('Do not send email'); //email template - first notification
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(1) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').trigger("change");
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(2) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').val('Do not send email'); //email template - second notification
            $('.float_center.text_left > div:nth-child(3) > div:nth-child(2) > .ctrlHolder:nth-child(4) .ng-scope .text_left .ddl-template-edit').trigger("change");
        }

        //interval 1 - sms
        if (emailStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSms1').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSms1').click(); //interval 1 - sms checkbox
            }
            $('#ctl00_ctl00_Main_Main_defaultSms1_ddlTemplate').val('Do not send sms'); //interval 1 - sms template
            $('#ctl00_ctl00_Main_Main_defaultSms1_ddlTemplate').trigger("change");
        } else if (emailStatus == "n" && smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSms1').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSms1').click(); //interval 1 - sms checkbox
            }
            $('#ctl00_ctl00_Main_Main_defaultSms1_ddlTemplate').val('5f8cfd3b-4916-4cce-948c-de193e53ad2e'); //interval 1 - sms template
            $('#ctl00_ctl00_Main_Main_defaultSms1_ddlTemplate').trigger("change");
        }

        //interval 2 - sms
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSms2').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSms2').click();
            }
            $('#ctl00_ctl00_Main_Main_defaultSms2_ddlTemplate').val('5f8cfd3b-4916-4cce-948c-de193e53ad2e'); //sms template - second notification
            $('#ctl00_ctl00_Main_Main_defaultSms2_ddlTemplate').trigger("change");
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableSms2').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSms2').click();
            }
            $('#ctl00_ctl00_Main_Main_defaultSms2_ddlTemplate').val('Do not send SMS'); //sms template - second notification - do not send
            $('#ctl00_ctl00_Main_Main_defaultSms2_ddlTemplate').trigger("change");
        }

        //interval 1 - voice
        if (emailStatus == "y" || smsStatus == "y" || voiceStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableVoice1').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableVoice1').click(); //interval 1 - voice
            }
        } else if (emailStatus == "n" && smsStatus == "n" && voiceStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableVoice1').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableVoice1').click(); //interval 1 - voice
            }
        }

        //interval 2 - voice
        if (voiceStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableVoice2').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableVoice2').click(); //interval 2 - voice
            }
        } else if (voiceStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableVoice2').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableVoice2').click(); //interval 2 - voice
            }
        }
    }
}*/


//����������������������������������������������������������������������������������������
//Customer Recovery - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/CustomerRecovery/ViewSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $("#MainContent > div.container_24.clearfix > h1 > u > small").css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //CustomerRecoveryNotificationSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/CustomerRecovery/ViewSettings.aspx#all"; //"show all"
            CustomerRecoveryNotificationSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function CustomerRecoveryNotificationSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[55].toLowerCase();
        var emailStatus = parsedSettingsString[56].toLowerCase();

        //interval in months
        $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val(7); //interval 1
        $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val(8); //interval 2
        $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val(9); //interval 3
        $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val(10); //interval 4
        $('#ctl00_ctl00_Main_Main_loopSched5_ddlDelay').val(11); //interval 5
        $('#ctl00_ctl00_Main_Main_loopSched6_ddlDelay').val(12); //interval 6
        $('#ctl00_ctl00_Main_Main_loopSched7_ddlDelay').val(13); //interval 7
        $('#ctl00_ctl00_Main_Main_loopSched8_ddlDelay').val(14); //interval 8
        $('#ctl00_ctl00_Main_Main_loopSched9_ddlDelay').val(15); //interval 9
        $('#ctl00_ctl00_Main_Main_loopSched10_ddlDelay').val(16); //interval 10

        //sms templates - enabled
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 6
            $('#ctl00_ctl00_Main_Main_loopSched7_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 7
            $('#ctl00_ctl00_Main_Main_loopSched8_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 8
            $('#ctl00_ctl00_Main_Main_loopSched9_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 9
            $('#ctl00_ctl00_Main_Main_loopSched10_sms_ddlTemplate').val('f85470f9-b4c8-474b-927d-6275442480d1'); //interval 10

            //sms templates - disabled
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('Do not send SMS'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_sms_ddlTemplate').val('Do not send SMS'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_sms_ddlTemplate').val('Do not send SMS'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_sms_ddlTemplate').val('Do not send SMS'); //interval 6
            $('#ctl00_ctl00_Main_Main_loopSched7_sms_ddlTemplate').val('Do not send SMS'); //interval 7
            $('#ctl00_ctl00_Main_Main_loopSched8_sms_ddlTemplate').val('Do not send SMS'); //interval 8
            $('#ctl00_ctl00_Main_Main_loopSched9_sms_ddlTemplate').val('Do not send SMS'); //interval 9
            $('#ctl00_ctl00_Main_Main_loopSched10_sms_ddlTemplate').val('Do not send SMS'); //interval 10
        }

        //email templates - enabled
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('e00442a6-14f4-4d1b-8d69-d6548e931504'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('aaae2f52-bff0-4a94-aa3f-bf97bf788c29'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('080b5944-82cd-43e3-969e-f68baeddd01d'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('596d15a3-b653-4a59-8096-9bea09e6a112'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('989acd8a-1bfc-4842-a98b-a991157f249c'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('7f617bc1-0a9e-40b3-8835-8704c574b15a'); //interval 6
            $('#ctl00_ctl00_Main_Main_loopSched7_emailSelector_ddlTemplate').val('fd73652a-c219-498b-8f59-a79331ac2daa'); //interval 7
            $('#ctl00_ctl00_Main_Main_loopSched8_emailSelector_ddlTemplate').val('269456a9-4616-49d3-88ae-7a499799eec0'); //interval 8
            $('#ctl00_ctl00_Main_Main_loopSched9_emailSelector_ddlTemplate').val('50ba2d0a-38f1-48d0-b390-6ffb11c25a2b'); //interval 9
            $('#ctl00_ctl00_Main_Main_loopSched10_emailSelector_ddlTemplate').val('07a40825-4db6-49fa-b22b-30aba4d295e6'); //interval 10

            //email templates - disabled
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('Do not send email'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('Do not send email'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('Do not send email'); //interval 6
            $('#ctl00_ctl00_Main_Main_loopSched7_emailSelector_ddlTemplate').val('Do not send email'); //interval 7
            $('#ctl00_ctl00_Main_Main_loopSched8_emailSelector_ddlTemplate').val('Do not send email'); //interval 8
            $('#ctl00_ctl00_Main_Main_loopSched9_emailSelector_ddlTemplate').val('Do not send email'); //interval 9
            $('#ctl00_ctl00_Main_Main_loopSched10_emailSelector_ddlTemplate').val('Do not send email'); //interval 10
        }

        /*//interval 1 - coupons
        $('#ctl00_ctl00_Main_Main_loopSched1_coupon1').val('b32f8f8c-8b74-461b-9310-ecb770c60439'); //coupon 1_1
        $('#ctl00_ctl00_Main_Main_loopSched1_coupon2').val('54a116f2-2a05-4820-9047-653ffdd5505a'); //coupon 1_2
        $('#ctl00_ctl00_Main_Main_loopSched1_coupon3').val('9a340532-3b86-418d-ad3c-c49752f3044d'); //coupon 1_3
        //interval 2 - coupons
        $('#ctl00_ctl00_Main_Main_loopSched2_coupon1').val('deaf02c8-b528-4cc5-a1ae-d20b682c9218'); //coupon 2_1
        $('#ctl00_ctl00_Main_Main_loopSched2_coupon2').val('1bcece0a-5084-461d-96c8-380b3cf4e22f'); //coupon 2_2
        $('#ctl00_ctl00_Main_Main_loopSched2_coupon3').val('cba31d45-f2bc-429a-bbd2-a23f8230d040'); //coupon 2_3
        //interval 3 - coupons
        $('#ctl00_ctl00_Main_Main_loopSched3_coupon1').val('fc671475-ae88-4e99-b4f8-9d7407f0db55'); //coupon 3_1
        $('#ctl00_ctl00_Main_Main_loopSched3_coupon2').val('c341a431-7fc0-4a3d-8c03-3a80d2ef0723'); //coupon 3_2
        $('#ctl00_ctl00_Main_Main_loopSched3_coupon3').val('7ad30a70-1833-4143-8bfd-2d0585fd0ef6'); //coupon 3_3
        //interval 4 - coupons
        $('#ctl00_ctl00_Main_Main_loopSched4_coupon1').val('326b55a0-0362-4902-a367-654a5bb4e2bc'); //coupon 4_1
        $('#ctl00_ctl00_Main_Main_loopSched4_coupon2').val('07d9649a-4730-4ed9-a2ba-07a0e90f0e3c'); //coupon 4_2
        $('#ctl00_ctl00_Main_Main_loopSched4_coupon3').val('1ad0f259-2ebb-41ea-bbe8-ef524870b388'); //coupon 4_3
        //interval 5 - coupons
        $('').val(''); //coupon 5_1
        $('').val(''); //coupon 5_2
        $('').val(''); //coupon 5_3
        //interval 6 - coupons
        $('').val(''); //coupon 6_1
        $('').val(''); //coupon 6_2
        $('').val(''); //coupon 6_3
        //interval 7 - coupons
        $('').val(''); //coupon 7_1
        $('').val(''); //coupon 7_2
        $('').val(''); //coupon 7_3
        //interval 8 - coupons
        $('').val(''); //coupon 8_1
        $('').val(''); //coupon 8_2
        $('').val(''); //coupon 8_3
        //interval 9 - coupons
        $('').val(''); //coupon 9_1
        $('').val(''); //coupon 9_2
        $('').val(''); //coupon 9_3
        //interval 10 - coupons
        $('').val(''); //coupon 10_1
        $('').val(''); //coupon 10_2
        $('').val(''); //coupon 10_3*/
    }
}


//����������������������������������������������������������������������������������������
//Declined Repairs - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/DeclinedRepairs/EditCategorySettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetDeclinedRepairsMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetDeclinedRepairsMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetDeclinedRepairsMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[59].toLowerCase();
        var emailStatus = parsedSettingsString[60].toLowerCase();

        if (smsStatus == "y" || emailStatus == "y") { //set delay for all intervals
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayYellow').val('7'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayYellow2').val('30'); //interval 2

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayRed').val('3'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayRed2').val('14'); //interval 2

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayYellow').val('7'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayYellow2').val('30'); //interval 2

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayRed').val('3'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayRed2').val('14'); //interval 2

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayYellow').val('7'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayYellow2').val('30'); //interval 2

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayRed').val('3'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayRed2').val('14'); //interval 2

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayYellow').val('7'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayYellow2').val('30'); //interval 2

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayRed').val('3'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayRed2').val('14'); //interval 2

        } else if (smsStatus == "n" && emailStatus == "n") {
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayYellow').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayYellow2').val('-1'); //interval 2

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayRed').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_ddlDelayRed2').val('-1'); //interval 2

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayYellow').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayYellow2').val('-1'); //interval 2

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayRed').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_ddlDelayRed2').val('-1'); //interval 2

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayYellow').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayYellow2').val('-1'); //interval 2

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayRed').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_ddlDelayRed2').val('-1'); //interval 2

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayYellow').val('-1'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayYellow2').val('-1'); //interval 2

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayRed').val('1'); //interval 1 (set to "1" to be able to save)
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_ddlDelayRed2').val('-1'); //interval 2
        }

        //email templates - enabled
        if (emailStatus == "y") {
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow_ddlTemplate').val('00780df1-1479-4332-a3aa-b7268fa6f98f'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow2_ddlTemplate').val('00780df1-1479-4332-a3aa-b7268fa6f98f'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow2_ddlTemplate').trigger("change");

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed_ddlTemplate').val('978d8435-3655-4bcf-ba08-dabff8127162'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed2_ddlTemplate').val('978d8435-3655-4bcf-ba08-dabff8127162'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed2_ddlTemplate').trigger("change");

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow_ddlTemplate').val('4669d081-5ab3-40d7-b313-01d26ce82b76'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow2_ddlTemplate').val('4669d081-5ab3-40d7-b313-01d26ce82b76'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow2_ddlTemplate').trigger("change");

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed_ddlTemplate').val('b2677497-c6dd-4c84-aa60-fd64164af8cb'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed2_ddlTemplate').val('b2677497-c6dd-4c84-aa60-fd64164af8cb'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed2_ddlTemplate').trigger("change");

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow_ddlTemplate').val('4f63755e-daa2-404e-9108-4adba6fc52b4'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow2_ddlTemplate').val('4f63755e-daa2-404e-9108-4adba6fc52b4'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow2_ddlTemplate').trigger("change");

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed_ddlTemplate').val('bf814bee-209b-4a01-b381-17fbf66c029b'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed2_ddlTemplate').val('bf814bee-209b-4a01-b381-17fbf66c029b'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed2_ddlTemplate').trigger("change");

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow_ddlTemplate').val('f34f6013-f44a-42fc-bf56-bfcd069f8a9e'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow2_ddlTemplate').val('f34f6013-f44a-42fc-bf56-bfcd069f8a9e'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow2_ddlTemplate').trigger("change");

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed_ddlTemplate').val('de9f6c75-a3b7-41ec-8002-1b62e2607b25'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed2_ddlTemplate').val('de9f6c75-a3b7-41ec-8002-1b62e2607b25'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed2_ddlTemplate').trigger("change");

        } else if (emailStatus == "n") { //email templates - disabled
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailYellow2_ddlTemplate').trigger("change");

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_emailRed2_ddlTemplate').trigger("change");

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailYellow2_ddlTemplate').trigger("change");

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_emailRed2_ddlTemplate').trigger("change");

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailYellow2_ddlTemplate').trigger("change");

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_emailRed2_ddlTemplate').trigger("change");

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailYellow2_ddlTemplate').trigger("change");

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_emailRed2_ddlTemplate').trigger("change");
        }

        //sms templates - enabled
        if (smsStatus == "y") {
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow2_ddlTemplate').trigger("change");

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed2_ddlTemplate').trigger("change");

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow2_ddlTemplate').trigger("change");

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed2_ddlTemplate').trigger("change");

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow2_ddlTemplate').trigger("change");

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed2_ddlTemplate').trigger("change");

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow2_ddlTemplate').trigger("change");

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed2_ddlTemplate').val('4a9ae300-1b9d-4f56-b8fa-54f2289158f9'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed2_ddlTemplate').trigger("change");

        } else if (smsStatus == "n") { //sms templates - disabled
            //yellow brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsYellow2_ddlTemplate').trigger("change");

            //red brakes
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBrakes_smsRed2_ddlTemplate').trigger("change");

            //yellow tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsYellow2_ddlTemplate').trigger("change");

            //red tires
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed2_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsTires_smsRed2_ddlTemplate').trigger("change");

            //yellow batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow2_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsYellow2_ddlTemplate').trigger("change");

            //red batteries
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed2_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsBatteries_smsRed2_ddlTemplate').trigger("change");

            //yellow additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow2_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsYellow2_ddlTemplate').trigger("change");

            //red additional items
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed_ddlTemplate').trigger("change");
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed2_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopCategorySettingsAdditional_smsRed2_ddlTemplate').trigger("change");
        }
    }
}


//����������������������������������������������������������������������������������������
//Missed Appointment - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/MissedAppointment/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //missedapptVehicleMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function(){
        if(($('#settingsKeyInputField')).val().includes("~")) {
            missedApptVehicleMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //MissedApptVehicleMakeSettingsOverride() button
    $("#MainContent > div.container_24.clearfix > div > div > h3:nth-child(3)").append("<button id='addOverride' type='button'><font color='black'>Add Override</font></button>");
    $("#addOverride").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            MissedApptVehicleMakeSettingsOverride();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //vehicle make settings
    function missedApptVehicleMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[51].toLowerCase();
        var emailStatus = parsedSettingsString[52].toLowerCase();

        $('#ctl00_ctl00_Main_Main_ddlDefaultEnabled').val("True"); //'enabled for all makes' set to yes

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('7cce6426-1ad9-4090-a374-38d2652b4c57'); //email template
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('Do not send email'); //email template
        }

        //sms checkbox and template
        if (smsStatus == "y") {
            if ( $('#ctl00_ctl00_Main_Main_enableSmsDefault').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSmsDefault').click(); //'enable sms' checkbox
            }
            $('#ctl00_ctl00_Main_Main_smsDefault_ddlTemplate').val('1fd78c33-8675-44d0-839a-89b61fdbc4ab'); //sms template

        } else if (smsStatus == "n") {
            if ( $('#ctl00_ctl00_Main_Main_enableSmsDefault').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSmsDefault').click(); //'enable sms' checkbox
            }
            $('#ctl00_ctl00_Main_Main_smsDefault_ddlTemplate').val('Do not send SMS'); //sms template
        }
    }

    //override
    function MissedApptVehicleMakeSettingsOverride() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[51].toLowerCase();
        var emailStatus = parsedSettingsString[52].toLowerCase();

        $('#ctl00_ctl00_Main_Main_ddlMakeEnabled').val("True"); //enabled make: set to yes

        //override - email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('7cce6426-1ad9-4090-a374-38d2652b4c57'); //email template
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('Do not send email'); //email template
        }

        //override - sms checkbox and template
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsNewMake').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSmsNewMake').click();
            }
            $('#ctl00_ctl00_Main_Main_smsNewMake_ddlTemplate').val('1fd78c33-8675-44d0-839a-89b61fdbc4ab'); //sms template

        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsNewMake').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSmsNewMake').click();
            }
            $('#ctl00_ctl00_Main_Main_smsNewMake_ddlTemplate').val('Do not send SMS'); //sms template
        }
    }
}


//����������������������������������������������������������������������������������������
//Parts Arrival - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/PartsArrival/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //apptConfirmationEditSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/PartsArrival/MakeSettings.aspx#all"; //"show all"
            SetPartsArrivalMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetPartsArrivalMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[63].toLowerCase();
        var emailStatus = parsedSettingsString[64].toLowerCase();

        //set intervals in days
        $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val("0");
        $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val("5");
        $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val("10");

        //sms - enabled
        if (smsStatus == "y") {
            //interval 1
            if ($('#ctl00_ctl00_Main_Main_loopSched1_cbEnableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopSched1_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched1_smsSelector_ddlTemplate').val('735eb8d9-0bd2-47b6-8c49-3c58b4c0d978'); //sms template

            //interval 2
            if ($('#ctl00_ctl00_Main_Main_loopSched2_cbEnableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopSched2_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched2_smsSelector_ddlTemplate').val('735eb8d9-0bd2-47b6-8c49-3c58b4c0d978'); //sms template

            //interval 3
            if ($('#ctl00_ctl00_Main_Main_loopSched3_cbEnableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_loopSched3_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched3_smsSelector_ddlTemplate').val('735eb8d9-0bd2-47b6-8c49-3c58b4c0d978'); //sms template

            //sms - disabled
        } else if (smsStatus == "n") {
            //interval 1
            if ($('#ctl00_ctl00_Main_Main_loopSched1_cbEnableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopSched1_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched1_smsSelector_ddlTemplate').val('Do not send SMS'); //sms template

            //interval 2
            if ($('#ctl00_ctl00_Main_Main_loopSched2_cbEnableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopSched2_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched2_smsSelector_ddlTemplate').val('Do not send SMS'); //sms template

            //interval 3
            if ($('#ctl00_ctl00_Main_Main_loopSched3_cbEnableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_loopSched3_cbEnableSms').click(); //'sms enabled' checkbox
            }
            $('#ctl00_ctl00_Main_Main_loopSched3_smsSelector_ddlTemplate').val('Do not send SMS'); //sms template
        }

        //email - enabled
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('2f56ee74-235b-4282-bd1d-45fc6acbd03d'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('20c6b8b9-a54e-434e-916a-5e0dfbf18d97'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('85a29574-b9cd-4062-9451-a88e65f2cf1c'); //interval 3

            //email - disabled
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
        }

        //set default coupons?

    }
}


//����������������������������������������������������������������������������������������
//Scheduled Maintenance - Sales to Service
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ScheduledMaintenance/MakeSettings.aspx?type=s2s')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //apptConfirmationEditSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetScheduledMaintMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetScheduledMaintMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[63].toLowerCase();
        var emailStatus = parsedSettingsString[64].toLowerCase();

        //interval in months
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_NotificationSettings_ddlDefaultMonthsAfterSale').val("6");
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_NotificationSettings_ddlDefaultMonthsAfterSale').val("-1");
        }

        //email
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_defaultEmails_ddlTemplate').val('e5dae8db-95d4-43e7-899b-00811e2a221b'); //email template - enabled
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_defaultEmails_ddlTemplate').val('Never Send Email'); //email template - disabled
        }

        //sms
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_sms_ddlTemplate').val('c712da9f-d123-4b0a-adef-8ebb276a6b3e'); //sms template - enabled
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_sms_ddlTemplate').val('Do not send SMS'); //sms template - enabled
        }

        //coupons
        //1
        //2
        //3
    }
}


//����������������������������������������������������������������������������������������
//Scheduled Maintenance - Return Reminder
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ScheduledMaintenance/MakeSettings.aspx?type=rr')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //apptConfirmationEditSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetScheduledMaintMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetScheduledMaintMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[63].toLowerCase();
        var emailStatus = parsedSettingsString[64].toLowerCase();

        //interval in months
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_NotificationSettings_ddlDefaultMonthsAfterSale').val("6");
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_NotificationSettings_ddlDefaultMonthsAfterSale').val("-1");
        }

        //email
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_defaultEmails_ddlTemplate').val('e5dae8db-95d4-43e7-899b-00811e2a221b'); //email template - enabled
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_defaultEmails_ddlTemplate').val('Never Send Email'); //email template - disabled
        }

        //sms
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_sms_ddlTemplate').val('c712da9f-d123-4b0a-adef-8ebb276a6b3e'); //sms template - enabled
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_NotificationMailSettings_ContentSettings1_sms_ddlTemplate').val('Do not send SMS'); //sms template - enabled
        }

        //coupons
        //1
        //2
        //3
    }
}


//����������������������������������������������������������������������������������������
//Service Completion - Make Settings
//����������������������������������������������������������������������������������������

//add something to read if there should be a survey?

if (window.location.href.includes('DMS/App/Notifications/ServiceCompletion/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetServiceCompletionMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceCompletionMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //SetServiceCompletionMakeSettingsOverride() button
    $("#MainContent > div.container_24.clearfix > div > div > h3:nth-child(3)").append("<button id='executeBtnOverride' type='button'><font color='black'>Add Override</font></button>");
    $("#executeBtnOverride").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceCompletionMakeSettingsOverride();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetServiceCompletionMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[71].toLowerCase();
        var emailStatus = parsedSettingsString[72].toLowerCase();

        //interval in hours
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_ddlDelayMinutes').val("1");
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_ddlDelayMinutes').val("-1");
        }

        //sms checkbox and template
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsDefault').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSmsDefault').click();
            }
            $('#ctl00_ctl00_Main_Main_smsSelectorDefault_ddlTemplate').val('c92ce82f-4ed2-4296-90f5-238e006fd80f');
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsDefault').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSmsDefault').click();
            }
            $('#ctl00_ctl00_Main_Main_smsSelectorDefault_ddlTemplate').val('Do not send SMS');
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('47affdcd-27ba-4c62-b9d6-46c69899a8ff');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('Do not send email');
        }
    }

    function SetServiceCompletionMakeSettingsOverride() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[71].toLowerCase();
        var emailStatus = parsedSettingsString[72].toLowerCase();

        //interval in hours
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_ddlMakeDelayMinutes').val("1");
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_ddlMakeDelayMinutes').val("-1");
        }

        //sms checkbox and template
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsNewMake').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_enableSmsNewMake').click();
            }
            $('#ctl00_ctl00_Main_Main_smsSelectorNewMake_ddlTemplate').val('c92ce82f-4ed2-4296-90f5-238e006fd80f');
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_enableSmsNewMake').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_enableSmsNewMake').click();
            }
            $('#ctl00_ctl00_Main_Main_smsSelectorNewMake_ddlTemplate').val('Do not send SMS');
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('47affdcd-27ba-4c62-b9d6-46c69899a8ff');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('Do not send email');
        }
    }
}


//����������������������������������������������������������������������������������������
//Service FollowUp - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ServiceFollowup/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetServiceFollowUpMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceFollowUpMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetServiceFollowUpMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[75].toLowerCase();
        var emailStatus = parsedSettingsString[76].toLowerCase();
        var surveyStatus = parsedSettingsString[172].toLowerCase();

        //interval in days
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_seFirst_delayHours').val("1");
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_seFirst_delayHours').val("-1");
        }

        //sms checkbox and template
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_seFirst_enableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_seFirst_enableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_seFirst_smsSelector_ddlTemplate').val('a5a94dd7-b59c-47dd-be23-11cbf06c07e5');
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_seFirst_enableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_seFirst_enableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_seFirst_smsSelector_ddlTemplate').val('Do not send SMS');
        }

        //email template
        if (emailStatus == "y") {
            if (surveyStatus == "y") {
                $('#ctl00_ctl00_Main_Main_seFirst_emailSelector_ddlTemplate').val('01873725-3482-4581-9c76-1cca0516d982');
            } else {
                $('#ctl00_ctl00_Main_Main_seFirst_emailSelector_ddlTemplate').val('271054c3-67f6-4418-8929-521142fbc3cd');
            }
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_seFirst_emailSelector_ddlTemplate').val('Do not send email');
        }
    }
}


//����������������������������������������������������������������������������������������
//Service Introduction - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ServiceIntroduction/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h2").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $("#MainContent > div.container_24.clearfix > h2 > u > small").css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h2").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h2").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetServiceIntroMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h2").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceIntroMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetServiceIntroMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[79].toLowerCase();
        var emailStatus = parsedSettingsString[80].toLowerCase();

        $('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_emailSelector_ddlTemplate').val('Do not send email');//always sets email to "do not send" (this trigger is sms only as of 10/30/18)

        //sms checkbox and template
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_cbEnableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_cbEnableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_smsSelector_ddlTemplate').val('523598e3-7f53-451e-86ec-09455007912b');
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_cbEnableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_cbEnableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_rptSchedule_ctl00_schedule_smsSelector_ddlTemplate').val('Do not send SMS');
        }
    }
}


//����������������������������������������������������������������������������������������
//State Inspection Reminder - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/StateInspectionReminder/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetStateInspectionMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/StateInspectionReminder/MakeSettings.aspx#all"; //show all intervals
            SetStateInspectionMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetStateInspectionMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[83].toLowerCase();
        var emailStatus = parsedSettingsString[84].toLowerCase();

        $('#ctl00_ctl00_Main_Main_loopSched1_ddlReminderTime').val('30'); //interval 1 set in days
        $('#ctl00_ctl00_Main_Main_loopSched2_ddlReminderTime').val('15'); //interval 2 set in days

        //sms template
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_smsDefault_ddlTemplate').val('d4f45912-ca87-4793-99ac-f66278e98836'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_smsDefault_ddlTemplate').val('d4f45912-ca87-4793-99ac-f66278e98836'); //interval 2
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_smsDefault_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_smsDefault_ddlTemplate').val('Do not send SMS'); //interval 2

        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailDefault_ddlTemplate').val('f36e5e16-a0ba-4f16-9541-734a8825b7ae'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailDefault_ddlTemplate').val('bfaf19dd-a5e1-4f2a-8b98-1c46fbee3695'); //interval 2
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailDefault_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailDefault_ddlTemplate').val('Do not send email'); //interval 2
        }
    }
}


//����������������������������������������������������������������������������������������
//Tires Due - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/TireDue/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetTiresDueMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/TireDue/MakeSettings.aspx#all"; //show all intervals
            SetTiresDueMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetTiresDueMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[87].toLowerCase();
        var emailStatus = parsedSettingsString[88].toLowerCase();

        //interval in miles
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlMiles').val('30000'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlMiles').val('40000'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlMiles').val('50000'); //interval 3
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlMiles').val('N/A'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlMiles').val('N/A'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlMiles').val('N/A'); //interval 3
        }

        //sms template
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('f6913357-8c9f-4484-98de-65a88b8fff36'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('f6913357-8c9f-4484-98de-65a88b8fff36'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('f6913357-8c9f-4484-98de-65a88b8fff36'); //interval 3
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('Do not send SMS'); //interval 3
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('97b06ef1-6a9d-478c-a185-cf7a57908308'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('996f59c4-60a0-4343-98d1-2621433169ac'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('6048414d-f250-4879-a229-fb79894f89eb'); //interval 1
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
        }
    }
}


//����������������������������������������������������������������������������������������
//Customer Birthday - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/CustomerBirthday/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetCustomerBirthdayMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/CustomerBirthday/MakeSettings.aspx#all"; //show all intervals
            SetCustomerBirthdayMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetCustomerBirthdayMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[95].toLowerCase();
        var emailStatus = parsedSettingsString[96].toLowerCase();

        $('#ctl00_ctl00_Main_Main_loopMakeSettingsEditor1_ddlDelay').val('0'); //set to "on birthday"

        //sms template
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopMakeSettingsEditor1_smsSelector_ddlTemplate').val('4adf1896-c142-4b20-a9f4-5305b6371060');
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopMakeSettingsEditor1_smsSelector_ddlTemplate').val('Do not send SMS');
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopMakeSettingsEditor1_emailSelector_ddlTemplate').val('5a0a1e61-4beb-45d8-aaa9-26bba789b25d');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopMakeSettingsEditor1_emailSelector_ddlTemplate').val('Do not send email');
        }

        //coupons
        //1
        //2
        //3
    }
}


//����������������������������������������������������������������������������������������
//Extended Service Contract - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/WarrantyExpiration/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetExtendedContractMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetExtendedContractMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //SetExtendedContractMakeSettingsOverride() button
    $("#MainContent > div.container_24.clearfix > div > div > h3:nth-child(3)").append("<button id='executeBtnOverride' type='button'><font color='black'>Add Override</font></button>");
    $("#executeBtnOverride").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetExtendedContractMakeSettingsOverride();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetExtendedContractMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[100].toLowerCase();

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('e6bb6bac-3e12-4182-920c-4be7a0eb11fc');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailDefault_ddlTemplate').val('Do not send email');
        }
    }

    function SetExtendedContractMakeSettingsOverride() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[100].toLowerCase();

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('e6bb6bac-3e12-4182-920c-4be7a0eb11fc');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_emailNewMake_ddlTemplate').val('Do not send email');
        }
    }
}


//����������������������������������������������������������������������������������������
//Lease Expiration - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/LeaseExpiration/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetLeaseExpirationMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/LeaseExpiration/MakeSettings.aspx#all"; //show all intervals
            SetLeaseExpirationMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetLeaseExpirationMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[103].toLowerCase();
        var emailStatus = parsedSettingsString[104].toLowerCase();

        //interval in months
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('9'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('6'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('3'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('1'); //interval 4
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('N/A'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('N/A'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('N/A'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('N/A'); //interval 4
        }

        //sms template
        if (smsStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('e90c4fce-9cbb-476d-9adc-973a65bd1207'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('e90c4fce-9cbb-476d-9adc-973a65bd1207'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('e90c4fce-9cbb-476d-9adc-973a65bd1207'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_sms_ddlTemplate').val('e90c4fce-9cbb-476d-9adc-973a65bd1207'); //interval 4
        } else if (smsStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_sms_ddlTemplate').val('Do not send SMS'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_sms_ddlTemplate').val('Do not send SMS'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_sms_ddlTemplate').val('Do not send SMS'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_sms_ddlTemplate').val('Do not send SMS'); //interval 4
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('f512c25d-313a-4714-a887-2a8f45966e32'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('aefd1ea0-f3c5-4ef6-861e-db8260393b07'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('a97e5de0-c992-4b93-ac2e-11202467db16'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('0b15f6f9-4210-46ce-b988-d6f19e04bf44'); //interval 4
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('Do not send email'); //interval 4
        }
    }
}


//����������������������������������������������������������������������������������������
//Sales Follow Up - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/PurchaseFollowUp/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetSalesFollowUpMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetSalesFollowUpMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetSalesFollowUpMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var smsStatus = parsedSettingsString[107].toLowerCase();
        var emailStatus = parsedSettingsString[108].toLowerCase();
        var surveyStatus = parsedSettingsString[171].toLowerCase();

        //interval in miles
        if (smsStatus == "y" || emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_mseFirst_delayHours').val('24'); //set dalay to "1 day"
        } else if (smsStatus == "n" && emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_mseFirst_delayHours').val('-1'); //set delay to "never send"
        }

        //sms template & checkbox
        if (smsStatus == "y") {
            if ($('#ctl00_ctl00_Main_Main_mseFirst_enableSms').prop("checked") == false) {
                $('#ctl00_ctl00_Main_Main_mseFirst_enableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_mseFirst_smsSelector_ddlTemplate').val('1fd49ac2-4c39-413d-9bb9-7fdfb8729113'); //sms template
            $('#ctl00_ctl00_Main_Main_mseFirst_smsSelector_ddlTemplate').trigger("change"); //this is to allow "view" to not be grayed out
        } else if (smsStatus == "n") {
            if ($('#ctl00_ctl00_Main_Main_mseFirst_enableSms').prop("checked") == true) {
                $('#ctl00_ctl00_Main_Main_mseFirst_enableSms').click();
            }
            $('#ctl00_ctl00_Main_Main_mseFirst_smsSelector_ddlTemplate').val('Do not send SMS'); //sms template
            $('#ctl00_ctl00_Main_Main_mseFirst_smsSelector_ddlTemplate').trigger("change"); //this is to allow "view" to not be grayed out
        }

        //email template
        if (emailStatus == "y") {
            if (surveyStatus == "y") {
                $('#ctl00_ctl00_Main_Main_mseFirst_emailSelector_ddlTemplate').val('f58e48f8-786b-4a0c-9900-cb423261ac17');
            } else {
                $('#ctl00_ctl00_Main_Main_mseFirst_emailSelector_ddlTemplate').val('41cf380a-018b-4ea6-9e5c-e35fb04977ba');
            }
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_mseFirst_emailSelector_ddlTemplate').val('Do not send email');
        }

        //interval 2 - set to do not send
        $('#ctl00_ctl00_Main_Main_mseSecond_delayHours').val('----'); //delay set to "----"
        if ($('#ctl00_ctl00_Main_Main_mseSecond_enableSms').prop("checked") == true) {
            $('#ctl00_ctl00_Main_Main_mseSecond_enableSms').click(); //sms checkbox set to false
        }
        $('#ctl00_ctl00_Main_Main_mseSecond_smsSelector_ddlTemplate').val('Do not send SMS'); //set sms template to "Do not send SMS"
        $('#ctl00_ctl00_Main_Main_mseSecond_emailSelector_ddlTemplate').val('Do not send email'); //set email template to "Do not send email"
    }
}


//����������������������������������������������������������������������������������������
//Service Contract Follow Up - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ServiceContractFollowup/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetServiceContractFollowUpMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceContractFollowUpMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetServiceContractFollowUpMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[112].toLowerCase();

        //interval in months
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('6'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('12'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('18'); //interval 3
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('Disabled'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('Disabled'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('Disabled'); //interval 3
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emlFirstEmail_ddlTemplate').val('5ef4c0af-4ac6-4397-a2a8-b9441702b25c'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emlFirstEmail_ddlTemplate').val('5ef4c0af-4ac6-4397-a2a8-b9441702b25c'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emlFirstEmail_ddlTemplate').val('5ef4c0af-4ac6-4397-a2a8-b9441702b25c'); //interval 3
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emlFirstEmail_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emlFirstEmail_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emlFirstEmail_ddlTemplate').val('Do not send email'); //interval 3
        }
    }
}


//����������������������������������������������������������������������������������������
//Service to Sales - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/ServiceToSales/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetServiceToSalesMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceToSalesMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    //SetServiceToSalesMakeSettingsOverride() button
    $("#ctl00_ctl00_Main_Main_makeWrapper > div > h4:nth-child(5)").append("<button id='addOverride' type='button'><font color='black'>Add Override</font></button>");
    $("#addOverride").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetServiceToSalesMakeSettingsOverride();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetServiceToSalesMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[116].toLowerCase();

        //set interval in days
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_MakeSettings_ddlDelayDays').val('10');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_MakeSettings_ddlDelayDays').val('-1'); //set interval in days
        }

        $('#ctl00_ctl00_Main_Main_MakeSettings_ddlMinimumVehicleAge').val('3'); //minimum vehicle age
        $('#ctl00_ctl00_Main_Main_MakeSettings_txtMinimumVehicleMileage').val('36000'); //minimum vehicle odometer

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_MakeSettings_defaultEmails_ddlTemplate').val('12416d47-928a-4137-aaad-6c2f3e08cee9');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_MakeSettings_defaultEmails_ddlTemplate').val('Never Send Email');
        }
    }

    function SetServiceToSalesMakeSettingsOverride() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[116].toLowerCase();

        //set interval in days
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_MakeSettings2_ddlDelayDays').val('10');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_MakeSettings2_ddlDelayDays').val('-1'); //set interval in days
        }

        $('#ctl00_ctl00_Main_Main_MakeSettings2_ddlMinimumVehicleAge').val('3'); //minimum vehicle age
        $('#ctl00_ctl00_Main_Main_MakeSettings2_txtMinimumVehicleMileage').val('36000'); //minimum vehicle odometer

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_MakeSettings2_defaultEmails_ddlTemplate').val('12416d47-928a-4137-aaad-6c2f3e08cee9');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_MakeSettings2_defaultEmails_ddlTemplate').val('Never Send Email');
        }
    }
}


//����������������������������������������������������������������������������������������
//Trade Cycle - Cash - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/TradeCycle/MakeSettings.aspx?type=cash')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetTradeCycleCashMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            window.location.href = "https://autoloop.us/DMS/App/Notifications/TradeCycle/MakeSettings.aspx?type=cash#all";
            SetTradeCycleCashMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetTradeCycleCashMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[120].toLowerCase();

        //interval in months
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('24'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('30'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('36'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('42'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_ddlDelay').val('48'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_ddlDelay').val('54'); //interval 6
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('N/A'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('N/A'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('N/A'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('N/A'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_ddlDelay').val('N/A'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_ddlDelay').val('N/A'); //interval 6
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('7325f925-3d37-4abd-a316-44e856412db3'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('f1c1b7f8-29b0-41e6-bd0a-c10946f9bdf5'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('7b6d8b12-7bf9-4d12-bbc1-9f805d77fb6d'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('d0299397-1e82-4017-9e81-94651349d493'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('e01b6237-aa28-4167-b9bd-e8b567f5904c'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('d5cd8405-931c-49d4-bb43-5b5707708dbb'); //interval 6
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('Do not send email'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('Do not send email'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('Do not send email'); //interval 6
        }
    }
}


//����������������������������������������������������������������������������������������
//Trade Cycle - Loan - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/TradeCycle/MakeSettings.aspx?type=loan')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetTradeCycleLoanMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetTradeCycleLoanMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetTradeCycleLoanMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[112].toLowerCase();

        //interval in months
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('-18'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('-12'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('-10'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('-6'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_ddlDelay').val('-3'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_ddlDelay').val('0'); //interval 6
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_ddlDelay').val('N/A'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_ddlDelay').val('N/A'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_ddlDelay').val('N/A'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_ddlDelay').val('N/A'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_ddlDelay').val('N/A'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_ddlDelay').val('N/A'); //interval 6
        }

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('f2bf9269-b6cb-477c-9b0a-e259aac93b0e'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('8ccfd475-055c-4f0f-a733-ed28f33a8c1e'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('10c46049-f085-41fb-b699-a3b25c1462a2'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('c3a09e78-d137-434b-bc64-90675f652c46'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('74599faa-aad2-4887-83b4-107efa95cd16'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('fe4aefca-d72e-4d48-8340-9596a9398edf'); //interval 6
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_loopSched1_emailSelector_ddlTemplate').val('Do not send email'); //interval 1
            $('#ctl00_ctl00_Main_Main_loopSched2_emailSelector_ddlTemplate').val('Do not send email'); //interval 2
            $('#ctl00_ctl00_Main_Main_loopSched3_emailSelector_ddlTemplate').val('Do not send email'); //interval 3
            $('#ctl00_ctl00_Main_Main_loopSched4_emailSelector_ddlTemplate').val('Do not send email'); //interval 4
            $('#ctl00_ctl00_Main_Main_loopSched5_emailSelector_ddlTemplate').val('Do not send email'); //interval 5
            $('#ctl00_ctl00_Main_Main_loopSched6_emailSelector_ddlTemplate').val('Do not send email'); //interval 6
        }
    }
}


//����������������������������������������������������������������������������������������
//Vehicle Anniversary - Make Settings
//����������������������������������������������������������������������������������������
if (window.location.href.includes('DMS/App/Notifications/VehicleAnniversary/MakeSettings')) {
    //Installz script by: jack@autoloop.com
    $("#MainContent > div.container_24.clearfix > h1").append("<hr><u><small style='font-size:25px' color='red'>Installz Script  </small></u>");
    $('#MainContent > div.container_24.clearfix > h1 > u > small').css("color", '#FF0000'); //changes color of title to red
    $("#MainContent > div.container_24.clearfix > h1").append("<em><small style='font-size:10px' color='gray'>  by: jack@autoloop.com</small></em><br>");

    //text box to paste the settings key
    $("#MainContent > div.container_24.clearfix > h1").append("<small style='font-size:12px'>Settings Key: <input type='text' id='settingsKeyInputField' placeholder='' value=''></small><br>");

    //SetVehicleAnniversaryMakeSettings() button
    $("#MainContent > div.container_24.clearfix > h1").append("<button id='executeButton' type='button'><font color='black'>Execute</font></button><hr>");
    $("#executeButton").click(function() {
        if(($('#settingsKeyInputField')).val().includes("~")) {
            SetVehicleAnniversaryMakeSettings();
        } else {
            alert("Error! There is no Settings Key");
        }
    });

    function SetVehicleAnniversaryMakeSettings() {
        var settingsString = $('#settingsKeyInputField').val(); //set varible to settings key text box
        var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter

        var emailStatus = parsedSettingsString[124].toLowerCase();

        $('#ctl00_ctl00_Main_Main_mseFirst_delay').val('0'); //set to "on anniversary"

        //email template
        if (emailStatus == "y") {
            $('#ctl00_ctl00_Main_Main_mseFirst_emailSelector_ddlTemplate').val('e4a881fb-a55c-4406-8be5-316ce748aaf8');
        } else if (emailStatus == "n") {
            $('#ctl00_ctl00_Main_Main_mseFirst_emailSelector_ddlTemplate').val('Do not send email');
        }

        //interval 2 - set to do not send
        $('#ctl00_ctl00_Main_Main_mseSecond_delay').val('-1'); //delay set to "never"
        $('#ctl00_ctl00_Main_Main_mseSecond_smsSelector_ddlTemplate').val('Do not send SMS'); //set sms template to "Do not send SMS"
        $('#ctl00_ctl00_Main_Main_mseSecond_emailSelector_ddlTemplate').val('Do not send email'); //set email template to "Do not send email"

        //coupons
        //1
        //2
        //3
    }
}



/*
   $('.check_all').on('click', function () {
    $("#student_id").prop('checked', $(this).prop('checked'));
   });*/

/*//Change Password fields to Text
		$('#ctl00_ctl00_Main_Main_tfNewPassword_textBox').get(0).type='text';
		$('#ctl00_ctl00_Main_Main_tfConfirmPassword_textBox').get(0).type='text';
	*/ //also see user acount multi-tool / helper

//Highlight Enabled Checkboxes
//--to be added...
/*
		$(':checkbox').change(function() {
			if($(this).attr('checked'))
				$(this).css('background-color', '#A9F5BC');
		});
	*/ //can use to higlight things

//see fast checkbox