// ==UserScript==
// @name         Shortstack
// @namespace    https://i.adaptavist.com/pages/viewpage.action?pageId=190254508
// @version      2.0
// @description  Smart Snippets - Refactored
// @author       Hazwan
// @grant        none
// @icon         https://static.wixstatic.com/media/2f6c37_c95825a169d344b591125793ed5b9ccc~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01/the%20stack%20Logo.webp
// @noframes
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/401165/Shortstack.user.js
// @updateURL https://update.greasyfork.org/scripts/401165/Shortstack.meta.js
// ==/UserScript==

/*
 * SHORTSTACK USER GUIDE
 *
 * HOW TO USE:
 * 1. Type any shortcut (e.g., ;hi, ;sign, ;rep) in any text field
 * 2. The shortcut will automatically expand to the full template
 * 3. Works in Jira Cloud, Confluence, and other web applications
 *
 * ADDING NEW TEMPLATES:
 * - Static templates: Add to 'templates' section below
 * - Dynamic templates (with prompts): Add to 'dynamicTemplates' section
 *
 * TEMPLATE VARIABLES:
 * - {% SITE.contactName %} - Extracts reporter's first name
 * - {% SITE.myName %} - Your configured name
 * - {% SITE.contactEmail %} - Reporter's email address
 * - [[Option1||Option2||Option3]] - Random selection from options
 *
 * EXAMPLES:
 * ;hi → "Hi John" (uses reporter's name)
 * ;sign → "Thanks!\nHazwan" (your signature)
 * ;rep → "John" (just the reporter's name)
 */

(function() {
    'use strict';

    // ========================================
    // USER CONFIGURATION - EDIT THIS SECTION
    // ========================================

    // Personal Details
    const USER_CONFIG = {
        name: "Hazwan",
        emailaddress: "hariffin@adaptavist.com"
    };

    // Static Templates - Add your shortcuts here
    const TEMPLATES = {
            ";hi": "[[Hi||Hey||Hello]] {% SITE.contactName %}",
            ";sign": "[[Thanks!\n{% SITE.myName %}||Cheers!\n{% SITE.myName %}]]",
            ";rep": "{% SITE.contactName %}",
            ";erp": "{% SITE.contactEmail %}",
            ";close": "[[Awesome! Great to hear that. Since this is resolved, I'll proceed to close this now.\n\nHave a great day!\n\nThanks!\n{% SITE.myName %}||Perfect! Glad we got that sorted out. I'll go ahead and close this ticket now.\n\nTake care!\n\nThanks,\n{% SITE.myName %}||Excellent! Happy to hear everything is working. Closing this ticket now.\n\nHave a wonderful day!\n\nCheers,\n{% SITE.myName %}]]",
            ";tri": "[[[[Hi||Hey||Hello]] there,\n\nThank you for opening this ticket. We are currently looking into this and will get back to you with an update.\n\nThanks!\n{% SITE.myName %}||[[Hi||Hey||Hello]],\n\nThanks for reaching out! We've received your ticket and are reviewing it now. I'll update you shortly with our findings.\n\nThanks,\n{% SITE.myName %}||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nAppreciate you submitting this ticket. Our team is investigating and we'll have an update for you soon.\n\nCheers,\n{% SITE.myName %}]]",
            ";reminder": "[[Hi there,\nJust following up to see how things are going with this case. We want to make sure everything is on track for you.\nHave you had a chance to look over our last update? Let us know if there's anything you need. We're happy to help.\nThanks,\n{% SITE.myName %}||Hey,\nJust checking in to see how you're getting on with this.\nDid you get a chance to go through our last update? Let me know if you need a hand with anything.\nCheers,\n{% SITE.myName %}||Hi,\nI wanted to follow up and make sure everything is progressing as expected.\nHave you had a chance to review our last message? Let us know if there's anything else we can assist with.\nThanks,\n{% SITE.myName %}||Hi there,\nJust touching base to check if everything is going smoothly on your end. We want to make sure this is fully resolved.\nLet me know if you've reviewed the last update or if you need anything from us.\nThanks,\n{% SITE.myName %}||Hi,\nHope you're doing well. Just wanted to check in on this case.\nHave you had a chance to go through our previous message? If there's anything you need, we're here to help.\nThanks,\n{% SITE.myName %}]]",
            ";noupd": "[[Hey there,\nJust checking in. Since we haven't heard back, we'll go ahead and close this ticket.\nIf anything comes up, feel free to reach out. Always happy to help.\nThanks,\n{% SITE.myName %}||Hi!\nLooks like things are all good on your end, so we'll close this ticket for now.\nNeed anything else? Just give us a shout.\nCheers,\n{% SITE.myName %}||Hi there,\nWe haven't heard from you in a bit, so we'll close this one for now.\nReach out anytime if you need a hand with anything.\nTake care,\n{% SITE.myName %}||Hey,\nJust a heads-up that we'll be closing this ticket since we haven't had a reply.\nLet us know if you still need help.\nThanks,\n{% SITE.myName %}||Hi,\nSince it's been a while without a response, we'll go ahead and close this ticket.\nFeel free to reach out again if anything pops up.\nThanks,\n{% SITE.myName %}]]",
            ";fol": "[[Followed up with the user||Checked in with the customer||Reached out to the reporter]]",
            ";am": "[[Working on access management ticket||Handling user access request||Processing permission changes]]",
            ";code": "{code}\n{code}",
            ";quote": "{quote}\n{quote}",
            ";hando": "{panel:title=Handover|borderStyle=solid|borderColor=#ff7f7f|titleBGColor=#ff7f7f|bgColor=#e5e5e5 }\n(x) *Problem Summary:*\n- \n\n(/) *Completed:*\n* \n\n(!) *Next Steps*:\n# \n\n{panel}\n----\n",
            ";call": "{panel:title=Call Summary|borderStyle=solid|borderColor=#ff7f7f|titleBGColor=#ff7f7f|bgColor=#e5e5e5}\n\nOverall Results:\n*\n\nTopic Discussed:\n*\n*\n*\n\nNext Steps:\n#\n#\n#\n\n{panel}",
            ";arr": "→",
            ";lar": "←",
            ";rpenna": "[~accountid:5f7c90e095fe8e0069932f1c]",
            ";chad": "[~accountid:5e8ca358e8b3c50b7cf07bd1]",
            ";proj": "[[[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nThe project has been created\n\nHave a look and please double-check all is as you'd like it. Let us know if there are any issues with it.\n\nThanks!\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nYour project is now ready to go!\n\nPlease review the setup and let me know if anything needs adjusting.\n\nThanks,\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nAll set! Your project has been successfully created.\n\nTake a look and confirm everything looks good. Feel free to reach out if you need any changes.\n\nCheers,\nHazwan]]",
            ";createproj": "[[[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nCan you provide us with the following details:\n\n# Name of JIRA Project: i.e Test Project\n# Project key: i.e TP\n# Existing project whose set up you would like to copy (if applicable. Choose none if the project will be unique and managed individually): i.e None.\n# How will you use this project and what will you be tracking in this project?: i.e This is a test project.\n# Who will serve as the project lead?: i.e Hazwan\n# Any access restrictions needed?: i.e Only accessible to sbc-users group\n\nThanks!\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nTo set up your project, I'll need these details:\n\n• Project Name: (e.g., Marketing Campaign)\n• Project Key: (e.g., MC)\n• Template to copy from: (or None for custom setup)\n• Project purpose: (what you'll be tracking)\n• Project Lead: (who will manage it)\n• Access restrictions: (any specific groups or users)\n\nThanks,\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nLet's get your project created! Please share:\n\n1. Project name and key\n2. Any existing project to use as template\n3. What this project will be used for\n4. Who should be the project lead\n5. Any access limitations needed\n\nCheers,\nHazwan]]",
            ";spaceadmin": "[[[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nWhilst we have the ability to grant you the space admin access, it's best to reach out to the space admin of the space first to get an approval for the request. Here's the list of the space admin of the space:\n\n\nIs there anyone that you know from the list here that you or we can reach out to, in order to get this ticket reviewed and approve this request?\n\nThanks!\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nFor space admin access, we need approval from the current space administrators first. Here are the space admins:\n\n\nDo you know any of these admins who could approve your request? We can reach out to them on your behalf.\n\nThanks,\nHazwan||[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nI can help with space admin access, but we'll need sign-off from an existing space admin. The current admins are:\n\n\nCan you connect with any of them, or would you like me to contact them for approval?\n\nCheers,\nHazwan]]",
            ";lib": "/*\n* @author: Hazwan Ariffin\n* @Date: Dec 2022\n* @Description: Setting CS Opportunity Conversion Date Endpoint\n*\n*\n* @Last update by: \n* @Updated date: \n* @Change made : \n*/\nimport com.atlassian.jira.component.ComponentAccessor\nimport com.atlassian.jira.user.util.UserManager\nimport com.atlassian.jira.issue.IssueManager\nimport com.atlassian.jira.issue.Issue\nimport com.atlassian.jira.user.ApplicationUser\n\nIssue issue = ComponentAccessor.getIssueManager().getIssueObject(\"SUP-255\")\nApplicationUser user = ComponentAccessor.getComponent(UserManager).getUserByName(\"admin\")\nApplicationUser loggedInUser = ComponentAccessor.getJiraAuthenticationContext().getLoggedInUser()\n",
            ";author": "/*\n* @author: Hazwan Ariffin\n* @Date: \n* @Description:\n*/",
            ";sdcomment": "// Comment Library\n\nimport com.atlassian.jira.bc.issue.comment.property.CommentPropertyService\nimport groovy.json.JsonSlurper\nimport com.atlassian.jira.issue.comments.Comment\n\n//----Check if comment is internal----//\nfinal SD_PUBLIC_COMMENT = \"sd.public.comment\"\n//def comment = event.comment?.getComment()\ndef comment = event.getComment()\ndef commentPropertyService = ComponentAccessor.getComponent(CommentPropertyService)\ndef isInternal = { Comment c ->\n    def commentProperty = commentPropertyService.getProperty(user, c.id, SD_PUBLIC_COMMENT)\n            .getEntityProperty().getOrNull()\n    if (commentProperty) {\n        def props = new JsonSlurper().parseText(commentProperty.getValue())\n        props['internal'].toBoolean()\n    }\n    else {\n        null\n    }\n}",
            ";group": "ComponentAccessor.getGroupManager().getGroupNamesForUser(loggedInUser).contains(\"assist-admins\")",
            ";rest": "def postContent = \"\"\ndef auths = \"aGFyaWZmaW46SWM5MDAzMjIu\"\n\nHttpURLConnection connection = new URL(\"${url}/rest\").openConnection() as HttpURLConnection\nconnection.addRequestProperty(\"Authorization\", \"Basic ${auths}\")\nconnection.setRequestProperty(\"Accept\", \"application/json\")\nconnection.setRequestProperty(\"Content-Type\", \"application/json\")\nconnection.setRequestMethod(\"POST\")\nconnection.doOutput = true\nconnection.outputStream.withWriter{\n    it.write(postContent)\n    it.flush()\n}\nconnection.connect()\nconnection.getInputStream().getText()",
            ";issueupdate": "import com.atlassian.jira.issue.MutableIssue\nimport com.atlassian.jira.event.type.EventDispatchOption\n\nMutableIssue mutableIssue = issueManager.getIssueObject(event.issue)\nmutableIssue.setAssignee(ComponentAccessor.getComponent(UserManager).getUserByName(\"admin\"))\nComponentAccessor.getIssueManager().updateIssue(user, mutableIssue, EventDispatchOption.ISSUE_UPDATED, false)",
            ";cache": "# [Clear browser's cache and cookies|https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DDesktop&hl=en] to check if cache or Atlassian's cookie is the cause of the issue\n# Run in incognito mode to rule out the possibility of the browser's addon/extension causing the issue.\n# Run in a different browser to see if it works on other browsers. Let us which browser are you using and what version\n# Test it on a different network or machine\n\nIf you're still having the issue, would you be able to generate a HAR file of the affected pages and default application page? Here's a guide on how to generate a HAR file:\n - [https://confluence.atlassian.com/kb/generating-har-files-and-analysing-web-requests-720420612.html]\n\n{quote}\nh4. Providing Information to Support\n # Bring up the developer tools using one of these methods:\n ** Using *Keyboard Shortcut* (⌘⌥I on OS X, Ctrl + Shift + i on Linux, F12 on Windows)\n ** From *Chrome Menu*!https://developer.chrome.com/devtools/images/chrome-menu.png! at the top-right of your browser window, then select *Tools > Developer Tools*.\n # Navigate to the *Network* tab on the *Development Tool*\n # Check *[Disable Cache|https://developer.chrome.com/devtools/docs/settings#disable-cache]* option to prevent caching of resources for this specific page.\n # *Refresh* the page to start capturing the traffic between the browser to the server.\n Please capture a full page load so we can see the requests made prior to the problem we're analyzing.\n # Complete the steps that trigger or demonstrate your issue.\n # *Right Click* in the area where the network records are shown and select *Save as HAR with content*\n*!https://confluence.atlassian.com/kb/files/720420612/939688350/1/1509029768604/save-as-har.png|width=215,height=250!*\n # Before sending the HAR file to Atlassian, ensure to remove/censor any sensitive information using a text editor (i.e. remove passwords, secrets, etc).{quote}\nThis information will give us a clear picture of the situation from your end.\n\nThanks!\n{% SITE.myName %}",
            ";perf": "[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nWe are sorry to hear you are experiencing performance issues.\n\nDifferent factors may cause this. For example:\n\n1.Browser performance. Using outdated browsers will experience a slowdown or plugin/javascript loading issues. If this is the case, check browser version to see if it is up to date and supported. Check for extensions that check or disable javascript.\n2. ISP or Network issues\nThis is most likely a factor if you are experience load-time issues on one machine, but not another.\n3. Issues with the backend itself. Such as bottleneck in the database or very high usage.\n\nTo gather more information, would you be able to answer the following questions:\n1. Are you experiencing slow load times on other websites as well?\n2. Has your ISP reported any issues/outages in the area?\n3. Does your connection to your modem/router drop frequently?\n\nThat said, I just had a look at the project and I don't experience any delays from our end. So to collect more information to troubleshoot, could you please provide us the following information:\n\n1. When was the slowness first noticed?\n2. Is it affecting all users or just your user?\n3. What sections are affected? Does it affect all?\n4. What actions are being done when the slowness is experienced? Can you list sequence of steps done?\n5. Can you provide a full screenshot showing errors or the pages where the slowness is more noticeable? Please include the full screen with URL.\n6. Could you provide us a HAR files of the affected pages. Here's how to generate a HAR file - https://confluence.atlassian.com/kb/generating-har-files-and-analyzing-web-requests-720420612.html\n7. Could you provide us the output of a TCP trace-route from your computer to the site while the site is experiencing performance problems capture:\nWindows: tracert <your-site>\nOS X: sudo traceroute <your-site>\nLinux: sudo traceroute -T <your-site> 2800\n\nThis information will give us a clear picture of the situation from your end.",
            ";spaceperm": "[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nPermissions are dealt with by the specific space admin, as per this KB: https://arm.service-now.com/kb_view.do?sysparm_article=KB0014965.\n\nAs you are a contingent worker (CW), it may simply be that the relevant cw group that you are in does not have the relevant permissions, as CW users are no longer in the confluence_users group, as per these two pages: \n\n - https://confluence.arm.com/display/TSGSI/Information+for+Contingent+Workers\n - https://confluence.arm.com/pages/viewpage.action?pageId=361038829\n\nAs per the documentation, you would need to contact the relevant Space administrator - https://confluence.arm.com/display/AtlassianInARM/Confluence+Space+Administrators if you need to have the user added to the space.\n\nHope that explains. Let me know if you have any further questions on this.\n\n;sign",
            ";jiraperm": "[[Hi||Hey||Hello]] {% SITE.contactName %},\n\nPermissions are dealt with by the specific JIRA admin, as per this KB: https://arm.service-now.com/kb_view.do?sys_kb_id=1dcadc63db6280182227980adb9619aa.\n\nAs you are a contingent worker (CW), it may simply be that the relevant cw group that you are in does not have the relevant permissions, as CW users are no longer in the jira_users group, as per these two pages: \n\n - https://confluence.arm.com/display/TSGSI/Information+for+Contingent+Workers\n - https://confluence.arm.com/pages/viewpage.action?pageId=361038829\n\nAs per the documentation, you would need to contact the relevant Jira project administrator - https://confluence.arm.com/display/AtlassianInARM/Jira+Project+Administrators if you need to have the user added to the project.\n\nHope that explains. Let me know if you have any further questions on this.\n\n;sign"
    };

    // Dynamic Templates - Templates with prompts
    const DYNAMIC_TEMPLATES = {
            ";reuse": function() {
                var reusePrompt = prompt("Field[1] / Status[2]");
                var reuseText = reusePrompt === "1" ? "custom field" : "Status";
                return `Ideally, we would want to re-use the existing ${reuseText} over creating a new ${reuseText} as it can impact the system's overall performance and usability across all users. By maintaining a streamlined set of ${reuseText}, we ensure that the system remains efficient and easy to navigate for all users.`;
            },
            ";snow": function() {
                var snow = prompt("Please select: image[1] / link[2]");
                var link = prompt("Paste the link here");
                return snow === "1" || snow === "image"
                    ? `[code]<img src="${link}" width="200">[/code]`
                    : `[code]<a href="${link}">link</a>[/code]`;
            },
            ";lic": function() {
                var jsmCount = prompt("JSM");
                var jswCount = prompt("JSW");
                var opsCount = prompt("Enter Opsgenie's license count");
                return `Hi there,\n\nHere is the current license count:\n\nJira Service Desk (JSM) - ${jsmCount} of 800 agents (${800-jsmCount} users left)\nJira Software - ${jswCount} of 400 users (${400-jswCount} users left)\nOpsgenie - ${opsCount}. Note that blocked users don't count towards active users.\n\nThanks!`;
            },
            ";um": function() {
                var promptPortalName = prompt("Enter the portal's name");
                var promptPortalId = prompt("Enter the portal's id");
                var promptEmail = prompt("Enter users email address");
                return `[[Hi||Hey||Hello]] there,\n\nI have added the following user/s to the portal - [${promptPortalName}|https://spinnakersupport.atlassian.net/servicedesk/customer/portal/${promptPortalId}]\n\n${promptEmail}\n\nThe user/s should now receive the invitation to join and access the [portal|https://spinnakersupport.atlassian.net/servicedesk]. Please make sure that the user/s is logging in through the [portal|https://spinnakersupport.atlassian.net/servicedesk], not [Jira|https://spinnakersupport.atlassian.net/] directly.\n\nHope that helps!\n\nThanks!`;
            },
            ";estac": function() {
                var promptOption = prompt("New User[1] / Reactivate[2]");
                var promptEsteeAccess = prompt("Enter the user's Email Address");
                var promptApp = prompt("Jira[1] / Confluence[2] / All[3]");
                var promptReporter = prompt("Is the issue reported by ELCSNOWIntegration? Yes[1] / No[2]");

                var apps = {
                    "1": { name: "Jira", link: "* {*}Jira{*}: [https://jira.esteeonline.com/]" },
                    "2": { name: "Confluence", link: "* {*}Confluence{*}: [https://confluence.esteeonline.com/]" },
                    "3": { name: "Jira and Confluence", link: "* {*}Jira{*}: [https://jira.esteeonline.com/]\n * {*}Confluence{*}: [https://confluence.esteeonline.com/]" }
                };

                var app = apps[promptApp];

                if (promptOption === "1") {
                    return promptReporter === "1"
                        ? `[[Hi||Hey||Hello]] [~${promptEsteeAccess}],\n\nYour *${app.name}* account/s account has been successfully created. The following URLs can be used to access the applications. Select the ELC Corporate Users login option.\n\n${app.link}\n\nMake sure to first *connect to VPN or Corporate network* before accessing the URL.\n\nMake sure to select the *ELC Corporate Users login* option for Corporate (non-Online) Jira projects.\n\nThank you.`
                        : `[[Hi||Hey||Hello]] [~${promptEsteeAccess}],\n\nTo ensure access is properly set up, please follow the steps below to send a request to the AD team here: [Employee Center|https://servicenow.elcompanies.com/esc?id=sc_cat_item&sys_id=b30fcd34db54c8543b471517489619e2]\n\n*Fields to fill on the AD form:*\n * *Request Type:* Modify Group\n * *Group Scope:* Universal\n * *Name of Group:* U-ELC JiraConfluence Users\n * *Description:* Please add the listed user(s) to the appropriate global group within \"U-ELC JiraConfluence Users\"\n * *Special Permissions:* None\n * *Owner:* John Farese\n * *Secondary Owner:* Paul Micali\n * *Members:* Select up to 20 users to be added to the group. If more are needed, attach an Excel file with user email addresses.\n * *Type of Access:* Read\n * *Sensitive Data:* No\n * *Secondary Approval Needed:* No\n\nA *${app.name}* account/s has been created for this user - [~${promptEsteeAccess}]\n\nThe following URL can be used to access the application. They should select the ELC Corporate Users login option.\n\n${app.link}\n\nMake sure to first *connect to VPN or Corporate network* before accessing the URL.\n\nMake sure to select the *ELC Corporate Users login* option for Corporate (non-Online) Jira projects.\n\nThanks!`;
                } else {
                    return `[[Hi||Hey||Hello]] [~${promptEsteeAccess}],\n\nThe ${app.name} account/s for ${promptEsteeAccess} have been successfully reactivated. The following URLs can be used to access the applications. Select the ELC Corporate Users login option:\n\n${app.link}\n\nMake sure to first *connect to VPN or Corporate network* before accessing the URL.\n\nMake sure to select the *ELC Corporate Users login* option for Corporate (non-Online) Jira projects.\n\nThanks!`;
                }
            }
    };

    // ========================================
    // SYSTEM CODE - DO NOT EDIT BELOW
    // ========================================

    var name = USER_CONFIG.name;
    var emailaddress = USER_CONFIG.emailaddress;



    if (typeof(shortstack) == "undefined") {
        (function (shortstack) {
            function toTitleCase(str) {
                if (!str) return '';
                if (str == str.toUpperCase() || str == str.toLowerCase()) {
                    return str.split(' ').map(i => i && i[0] ? i[0].toUpperCase() + i.substr(1).toLowerCase() : '').join(' ');
                }
                else {
                    return str;
                }
            }



            function randomString(textArray) {
                var randomNumber = Math.floor(Math.random() * textArray.length);
                return textArray[randomNumber];
            }

            var PROF = {
                get myName() {
                    return name;
                },
                get myEmail() {
                    return emailaddress;
                },
                get mySignature() {
                    return "Cheers,\n\nHazwan";
                }
            }


            var h = location.href;
            var SITE = {

                get myName() {
                    switch (true) {
                        case /.*/i.test(h):
                            return PROF.myName;
                        default:
                            return "";
                    }
                },


                get contactName() {
                    var reporterName = "";
                    switch (true) {
                        case /community\.atlassian\.com/i.test(h):
                            var elem = document.querySelector('.atl-avatar-name-date__username');
                            if (elem) {
                                var fullName = elem.textContent;
                                var firstName = fullName.split(' ')[0];
                                return firstName;
                            }
                            return 'team';
                        case /greasyfork\.org/i.test(h):
                            var descElem = document.querySelector('#script-description');
                            return descElem ? descElem.innerHTML : 'team';
                        case /arm\.service-now\.com/i.test(h):
                            var armElem = document.querySelector('.activities-form .h-card_comments:last-child .sn-card-component-createdby');
                            if (armElem) {
                                var fullNameArm = armElem.innerHTML;
                                var firstNameArm = fullNameArm.split(' ');
                                return firstNameArm[0];
                            }
                            return 'team';
                        case /.*/i.test(h):
                            var invalidNames = ["Unknown", "undefined", "Software", "Supercomputing", "Admin", "Devtools", "Technology", "IT", "Application", "Config", "Platform", "Operations", "Automation for Jira"];

                            // Try Jira Cloud reporter field
                            var cloudReporter = document.querySelector('[data-testid="issue.views.field.user.reporter"] span:last-child');
                            if (cloudReporter) {
                                reporterName = cloudReporter.textContent.trim();
                                if (reporterName) {
                                    var name = toTitleCase(reporterName.split(/[\s,_@.]+/)[0]);
                                    return invalidNames.indexOf(name) > -1 ? 'team' : name;
                                }
                            }

                            // Fallback to old selector
                            var reporterElem = document.querySelector('#reporter-val');
                            if (reporterElem) {
                                var reporterValue = reporterElem.textContent.trim();
                                var lastNameFirst = /.*, (.*)/.exec(reporterValue)
                                if (lastNameFirst) {
                                    reporterName = toTitleCase(lastNameFirst[1]);
                                } else {
                                    reporterName = toTitleCase(reporterValue.split(/[\s,_@.]+/)[0]);
                                }
                                if (invalidNames.indexOf(reporterName) > -1) {
                                    reporterName = 'team';
                                }
                                return reporterName;
                            }

                            return 'team';
                        default:
                            return "";
                    }
                },

                get contactEmail() {
                    switch (true) {
                        case /.*/i.test(h):
                            var emailElem = document.querySelector('#reporter-val > span.user-hover');
                            return emailElem ? emailElem.getAttribute('rel') : '';
                        default:
                            return "";
                    }
                }
            }

            var ShortStack = function () {
                this.snippets = {};
                this.smartCapsExclusions = [];
                this.http = new XMLHttpRequest();
            }

            ShortStack.prototype.add = function (shortcut, snippet) {
                if (typeof snippet == "function") {
                    this.snippets[shortcut] = {
                        'body': snippet
                    };
                }
                else {
                    this.snippets[shortcut] = {
                        'body': function () {
                            return snippet;
                        }
                    };
                }
            }

            ShortStack.prototype.get = function (shortcut) {
                if (this.snippets[shortcut]) {
                    var snippetId = this.snippets[shortcut].id;
                    var snippetText = this.snippets[shortcut].body();
                    return snippetText
                }
                else {
                    return "";
                }
            }

            ShortStack.prototype.list = function () {
                return this.snippets;
            }

            ShortStack.prototype.parseAlternates = function (snippetText) {
                var alternatesRegex = /\[\[([^\[\]]*?)\]\]/;
                while (snippetText.search(alternatesRegex) > -1) {
                    var match = alternatesRegex.exec(snippetText);
                    var alternate = randomString(match[1].split("||"));
                    snippetText = snippetText.replace(match[0], alternate);
                }
                return snippetText;
            }

            ShortStack.prototype.parseAlternatesForProseMirror = function (snippetText) {
                var alternatesRegex = /\[\[([^\[\]]*?)\]\]/;
                while (snippetText.search(alternatesRegex) > -1) {
                    var match = alternatesRegex.exec(snippetText);
                    var alternate = randomString(match[1].split("||"));
                    snippetText = snippetText.replace(match[0], alternate);
                }

                // Convert Jira-style links [text|url] to HTML links for ProseMirror
                var linkRegex = /\[([^\[\]]*?)\|([^\[\]]*?)\]/g;
                snippetText = snippetText.replace(linkRegex, '<a href="$2">$1</a>');

                return snippetText;
            }

            ShortStack.prototype.parseEmbeds = function (snippetText) {
                var embedsRegex = /\{% (.*?) %\}/;
                while (snippetText.search(embedsRegex) > -1) {
                    var match = embedsRegex.exec(snippetText);
                    if (match[1].substring(0, 5) == "SITE.") {
                        var matchText = SITE[match[1].substring(5)];
                        this.addSmartCapsExclusion(matchText);
                    }
                    else {
                         matchText = this.get(match[1]).trim();
                    }
                    snippetText = snippetText.replace(match[0], matchText);
                }
                return snippetText;
            }

            ShortStack.prototype.smartCaps = function (content, s, snippetText) {
                var excludeLength = this.smartCapsExclusions.length;
                while (excludeLength--) {
                    if (snippetText.indexOf(this.smartCapsExclusions[excludeLength]) == 0) {
                        return snippetText;
                    }
                }
                var priorChar = content.charAt(content.indexOf(s) - 1)
                var priorPriorChar = content.charAt(content.indexOf(s) - 2)
                if (priorChar == " " && priorPriorChar.match(/[,;a-z]/i)) {
                    var snippetStart = snippetText.slice(0, 2);
                    if (snippetStart != snippetStart.toUpperCase() || snippetStart == "A ") {
                        snippetText = snippetText.charAt(0).toLowerCase() + snippetText.slice(1);
                    }
                }
                return snippetText;
            }

            ShortStack.prototype.addSmartCapsExclusion = function (excludeText) {
                if (this.smartCapsExclusions.indexOf(excludeText) == -1) {
                    this.smartCapsExclusions.push(excludeText);
                }
            }

            ShortStack.prototype.insertSnippet = function (elem) {
                var content = elem.value;
                for (var s in this.list()) {
                    if (content.indexOf(s) > -1) {
                        var cursorPos = elem.selectionStart;
                        var snippetText = this.get(s);
                        snippetText = this.parseEmbeds(snippetText);
                        snippetText = this.parseAlternates(snippetText);
                        snippetText = this.smartCaps(content, s, snippetText);
                        if (snippetText.indexOf("%|") > -1) {
                            var cursorDiff = s.length - snippetText.indexOf("%|");
                            snippetText = snippetText.replace("%|", "");
                        }
                        else {
                            cursorDiff = s.length - snippetText.length;
                        }
                        var cursorNewPos = cursorPos - cursorDiff;
                        content = content.replace(s, snippetText)
                        elem.value = content;
                        elem.focus();
                        elem.selectionStart = cursorNewPos;
                        elem.selectionEnd = cursorNewPos;
                        break;
                    }
                }
            }

            // Auto-load templates from configuration
            function loadTemplates() {
                shortstack.snippets = new ShortStack();

                // Load static templates
                Object.keys(TEMPLATES).forEach(function(key) {
                    shortstack.snippets.add(key, TEMPLATES[key]);
                });

                // Load dynamic templates (functions)
                Object.keys(DYNAMIC_TEMPLATES).forEach(function(key) {
                    shortstack.snippets.add(key, DYNAMIC_TEMPLATES[key]);
                });
            }

            // Universal editor detection with fallback to mutation observer
            function findActiveEditor() {
                var elem = document.activeElement;

                // Standard input/textarea
                if (elem && ["INPUT", "TEXTAREA"].indexOf(elem.tagName) > -1) {
                    return { element: elem, type: 'standard' };
                }

                // Jira Cloud ProseMirror editor (priority check)
                var proseMirror = document.querySelector('.ProseMirror[contenteditable="true"]');
                if (proseMirror && (proseMirror === elem || proseMirror.contains(elem))) {
                    return { element: proseMirror, type: 'prosemirror' };
                }

                // Contenteditable elements
                if (elem && (elem.isContentEditable || elem.contentEditable === 'true')) {
                    return { element: elem, type: 'contenteditable' };
                }

                // Check for iframe editors (ServiceNow, etc.)
                if (elem && elem.tagName === 'IFRAME') {
                    try {
                        var iframeDoc = elem.contentDocument || elem.contentWindow.document;
                        var body = iframeDoc.body;
                        if (body && body.isContentEditable) {
                            return { element: body, type: 'iframe', iframe: elem };
                        }
                    } catch (e) {}
                }

                // Fallback: look for common editor selectors
                var selectors = [
                    '.ProseMirror[contenteditable="true"]', // Jira Cloud ProseMirror
                    'div[contenteditable="true"]',
                    '.ak-editor-content-area', // Atlassian editor
                    '.ck-editor__editable', // CKEditor
                    '.tox-edit-area', // TinyMCE
                    '[data-testid="comment-textbox"]' // Jira comment box
                ];

                for (var i = 0; i < selectors.length; i++) {
                    var found = document.querySelector(selectors[i]);
                    if (found && (found.contains(elem) || found === elem)) {
                        return { element: found, type: found.classList.contains('ProseMirror') ? 'prosemirror' : 'contenteditable' };
                    }
                }

                return null;
            }

            function handleTextInput(event) {
                if (!shortstack.enabled || shortstack.inserting) return;

                var editor = findActiveEditor();
                if (!editor) return;

                var elem = editor.element;
                var content = editor.type === 'standard' ? elem.value : (elem.textContent || elem.innerText || '');

                var cursorPos = editor.type === 'standard' ? elem.selectionStart : content.length;
                var checkStart = Math.max(0, cursorPos - 20);
                var recentText = content.substring(checkStart, cursorPos);

                for (var s in shortstack.snippets.list()) {
                    if (recentText.endsWith(s)) {
                        shortstack.enabled = false;

                        // Remove shortcut immediately to prevent re-detection
                        if (editor.type === 'standard') {
                            var newContent = content.substring(0, cursorPos - s.length) + content.substring(cursorPos);
                            elem.value = newContent;
                            elem.selectionStart = elem.selectionEnd = cursorPos - s.length;
                        } else if (editor.type === 'prosemirror') {
                            // For ProseMirror, select the shortcut and delete it
                            for (var i = 0; i < s.length; i++) {
                                document.execCommand('delete', false, null);
                            }
                        } else {
                            var newContents = content.substring(0, cursorPos - s.length) + content.substring(cursorPos);
                            elem.textContent = newContents;
                        }

                        var snippetText = shortstack.snippets.get(s);
                        snippetText = shortstack.snippets.parseEmbeds(snippetText);

                        // Use special parsing for ProseMirror
                        if (editor.type === 'prosemirror') {
                            snippetText = shortstack.snippets.parseAlternatesForProseMirror(snippetText);
                        } else {
                            snippetText = shortstack.snippets.parseAlternates(snippetText);
                        }

                        snippetText = shortstack.snippets.smartCaps(content, s, snippetText);

                        // Insert at the position where shortcut was removed
                        if (editor.type === 'standard') {
                            var pos = cursorPos - s.length;
                            elem.value = elem.value.substring(0, pos) + snippetText + elem.value.substring(pos);
                            elem.selectionStart = elem.selectionEnd = pos + snippetText.length;
                        } else if (editor.type === 'prosemirror') {
                            // ProseMirror text insertion with line breaks
                            elem.focus();
                            var htmlContent = snippetText.replace(/\n/g, '<br>');
                            //var htmlContent = snippetText.replace(/\n/g, '</p><p>');
                            //htmlContent = '<p>' + htmlContent + '</p>';
                            document.execCommand('insertHTML', false, htmlContent);
                        } else {
                            // For other contenteditable elements
                            var processedText = snippetText.replace(/\\n/g, '\n');
                            elem.textContent = elem.textContent.substring(0, cursorPos - s.length) + processedText + elem.textContent.substring(cursorPos - s.length);
                        }

                        setTimeout(function() { shortstack.enabled = true; }, 100);
                        break;
                    }
                }
            }

            document.addEventListener('input', handleTextInput, { once: false, passive: true });

            shortstack.enabled = true;

            // Initialize templates
            loadTemplates();

        }(window.shortstack = window.shortstack || {}));
    }
})();