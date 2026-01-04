// ==UserScript==
// @name         User Setup Loop
// @namespace    localhost
// @version      0.1.3
// @description  This script is a companion script to run with the "Installz Script"
// @author       jack@autoloop.com
// @include     *autoloop.us*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/375639/User%20Setup%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/375639/User%20Setup%20Loop.meta.js
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


//user management home page
if ((window.location.href == ('https://autoloop.us/DMS/App/DealershipSettings/UserManagement.aspx')) || (window.location.href == ('https://autoloop.us/DMS/App/DealershipSettings/UserManagement.aspx#!'))) {
    var userLoopStatus = localStorage.getItem("userLoopStatus");

    if (userLoopStatus == "y") {
        $("[data-tip='Add New User']").click(); //click "add new user"

    } else if (userLoopStatus == "n") {
        var errorCount = localStorage.getItem("errorCount");
        var errorMsg = localStorage.getItem("errorMsg");

        alert("User Setup Complete \n\nNOTE: Remember to disable the User Loop!");

        if (errorCount.length >= 1) {
                    alert(errorMsg);
        }
    }

    function UserManagementHomePage() {
        $("pre").append("<button id='startUserLoopBtn' type='button'><font color='black'>Start User Setup Loop</font></button>"); //("<br>User Loop Enabled? <input type= 'checkbox' id= 'enableUserLoop' value= 'enableUserLoop'>");
        $("#startUserLoopBtn").click(function(){
            var userDataGraveyard = "";
            var pageWaitStatus = "n";
            var completeUserStatus = "n";
            var userLoopStatus = "y";
            var userSlotGraveyard = "";
            var errorCount;
            var errorMsg = "Some Users Could Not Be Added Due to Errors: \n";

            localStorage.setItem("userDataGraveyard", userDataGraveyard);
            localStorage.setItem("userLoopStatus", userLoopStatus);
            localStorage.setItem("pageWaitStatus", pageWaitStatus);
            localStorage.setItem("completeUserStatus", completeUserStatus);
            localStorage.setItem("userSlotGraveyard", userSlotGraveyard);
            localStorage.setItem("errorCount", errorCount);
            localStorage.setItem("errorMsg", errorMsg);

            $("[data-tip='Add New User']").click();
        });
    }
    UserManagementHomePage();
}




//add new user page
if (window.location.href == ('https://autoloop.us/DMS/App/DealershipSettings/EditUser.aspx')) {
    var completeUserStatus = localStorage.getItem("completeUserStatus");
    userLoopStatus = "n";
    localStorage.setItem("userLoopStatus", userLoopStatus);

    //if user already exists
    if ($(".notificationError .messageContents").text().includes("There was a problem with your submission.That Username already exists in the system. Either choose a different Username or add this User from the Add Existing User screen.Show Errors")) {
        var existingUserEmail = $("[name='ctl00\$ctl00\$Main\$Main\$tfEmailAddress\$textBox']").val();
        userLoopStatus = "y";
        localStorage.setItem("userLoopStatus", userLoopStatus);
        localStorage.setItem("existingUserEmail", existingUserEmail);
        window.location.href = "https://autoloop.us/DMS/App/DealershipSettings/AddExistingUser.aspx";

    } else if (($(".notificationError .messageContents").text().includes("'Email Address' contains an invalid email address.")) || ($(".notificationError .messageContents").text().includes("'First Name' is a required field.")) || ($(".notificationError .messageContents").text().includes("'Last Name' is a required field."))) {
        errorCount = localStorage.getItem("errorCount");
        errorMsg = localStorage.getItem("errorMsg");
        userLoopStatus = localStorage.getItem("userLoopStatus");;

        errorCount += "i"; //instead of errorCount++, i am adding one character per time and will count the length of the string
        errorMsg += "\n" + $("[onkeypress] tr:nth-of-type(1) .invalidField").val();
        userLoopStatus = "y";

        localStorage.setItem("errorCount", errorCount);
        localStorage.setItem("errorMsg", errorMsg);
        localStorage.setItem("userLoopStatus", userLoopStatus);

        window.location.href = "https://autoloop.us/DMS/App/DealershipSettings/UserManagement.aspx";

    } else {
        if (completeUserStatus == "n") {
            function UserSetup() {
                var settingsString = localStorage.getItem("settingsKeyStorage"); //get stored settings key from user management home page
                var parsedSettingsString = settingsString.split('~'); //settings key parsed, using '~' as delimiter
                var userDataGraveyard = localStorage.getItem("userDataGraveyard"); //get stored settings key from user management home page
                var userSlotGraveyard = localStorage.getItem("userSlotGraveyard"); //store "n" so that this code only runs when it is supposed to

                var UserItemNumbers = {
                    "salesUser1" : parsedSettingsString[144],
                    "salesUser2" : parsedSettingsString[145],
                    "salesUser3" : parsedSettingsString[146],
                    "salesUser4" : parsedSettingsString[147],
                    "salesUser5" : parsedSettingsString[148],
                    "salesUser6" : parsedSettingsString[149],
                    "salesUser7" : parsedSettingsString[150],
                    "salesUser8" : parsedSettingsString[151],
                    "salesUser9" : parsedSettingsString[152],
                    "salesUser10" : parsedSettingsString[153],
                    "salesUser11" : parsedSettingsString[174],
                    "salesUser12" : parsedSettingsString[175],
                    "salesUser13" : parsedSettingsString[176],
                    "salesUser14" : parsedSettingsString[177],
                    "salesUser15" : parsedSettingsString[178],
                    "salesUser16" : parsedSettingsString[179],
                    "salesUser17" : parsedSettingsString[180],
                    "salesUser18" : parsedSettingsString[181],

                    "serviceUser1" : parsedSettingsString[154],
                    "serviceUser2" : parsedSettingsString[155],
                    "serviceUser3" : parsedSettingsString[156],
                    "serviceUser4" : parsedSettingsString[157],
                    "serviceUser5" : parsedSettingsString[158],
                    "serviceUser6" : parsedSettingsString[159],
                    "serviceUser7" : parsedSettingsString[160],
                    "serviceUser8" : parsedSettingsString[161],
                    "serviceUser9" : parsedSettingsString[162],
                    "serviceUser10" : parsedSettingsString[163],
                    "serviceUser11" : parsedSettingsString[182],
                    "serviceUser12" : parsedSettingsString[183],
                    "serviceUser13" : parsedSettingsString[184],
                    "serviceUser14" : parsedSettingsString[185],
                    "serviceUser15" : parsedSettingsString[186],
                    "serviceUser16" : parsedSettingsString[187],
                    "serviceUser17" : parsedSettingsString[188],
                    "serviceUser18" : parsedSettingsString[189],
                }

                for (var user in UserItemNumbers) {
                    var currentUser = UserItemNumbers[user];
                    var userDataGraveyardArray = userDataGraveyard.split(">");
                    var findUserStatus = "n";
                    var matchCounter = 0;
                    var userLoopStatus = localStorage.getItem("userLoopStatus");

                    if (userSlotGraveyard.includes(user) == true) {
                        //do nothing

                    } else {
                        for (var i = 0; i < userDataGraveyardArray.length; i++) {
                            if ((userDataGraveyardArray[i] == currentUser) && (currentUser !== "**")) { //(userDataGraveyardArray[i] !== currentUser) {
                                matchCounter++;
                            }
                        }

                        if (currentUser == "**") { //if the user slot is empty
                            userSlotGraveyard += "~" + user;
                            localStorage.setItem("userSlotGraveyard", userSlotGraveyard);

                        } else if (matchCounter <= 0) { //if the user is not empty or a repeat
                            userSlotGraveyard += "~" + user;
                            localStorage.setItem("userSlotGraveyard", userSlotGraveyard);
                            doo();
                            break;

                        } else if (matchCounter >= 1) { //if
                            userSlotGraveyard += "~" + user;
                            localStorage.setItem("userSlotGraveyard", userSlotGraveyard);
                        }
                    }

                    if (userSlotGraveyard.split("~").length >= 37) {
                        userLoopStatus = "n";
                        localStorage.setItem("userLoopStatus", userLoopStatus);
                        window.location.href = "https://autoloop.us/DMS/App/DealershipSettings/UserManagement.aspx";
                    }
                }

                function doo() {
                    findUserStatus = "y";
                    var userDataGraveyardPlus = userDataGraveyard + ">" + currentUser;
                    completeUserStatus = "y";
                    userLoopStatus = "y";
                    localStorage.setItem("userLoopStatus", userLoopStatus);
                    localStorage.setItem("userDataGraveyard", userDataGraveyardPlus);
                    localStorage.setItem("completeUserStatus", completeUserStatus);
                    currentUser = currentUser.split("*");
                    $("[placeholder]").val(currentUser[0].trim());
                    $("#executeButton").click();
                }
            }
            UserSetup();

        } else if (completeUserStatus == "y") {
            completeUserStatus = "n";
            localStorage.setItem("completeUserStatus", completeUserStatus);
            $("[onkeypress] > div:nth-of-type(4) .GeneratedButtonLink:nth-of-type(1)").click();
        }
    }
}




//add existing user page
if (window.location.href == ('https://autoloop.us/DMS/App/DealershipSettings/AddExistingUser.aspx')) {
    $(window).load(function() {
        var existingUserEmail = localStorage.getItem("existingUserEmail");

        if ($("#ctl00_ctl00_MasterPageBodyTag > div.barWrapper > div.notificationSuccess.notificationMessage > div > ul > li").text().includes(" to this Company.  You can add more users, return to your company's settings screen or Edit ")) {
            window.location.href = "https://autoloop.us/DMS/App/DealershipSettings/EditUser.aspx?UserName=" + existingUserEmail;

        } else {
            $("[name='ctl00\$ctl00\$Main\$Main\$tfUserName\$textBox']").val(existingUserEmail);
            $("[onkeypress] div .GeneratedButtonLink:nth-of-type(2)").click();
        }
    });
}




//edit existing user page
if (window.location.href.includes('https://autoloop.us/DMS/App/DealershipSettings/EditUser.aspx?UserName=')) {
    var permissions = localStorage.getItem("permissions");

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

    $("[onkeypress] > div:nth-of-type(4) .GeneratedButtonLink:nth-of-type(1)").click(); //save
}