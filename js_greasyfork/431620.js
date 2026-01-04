// ==UserScript==
// @name        ServiceNow Improvements
// @namespace   https://github.com/FiggChristian/PTS-Scripts
// @match       *://stanford.service-now.com/ticket.do*
// @match       *://stanford.service-now.com/incident.do*
// @match       *://stanford.service-now.com/sc_task.do*
// @version     1.0
// @description Adds macros, replacements, and Markdown support to ServiceNow tickets.
// @require     https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/431620/ServiceNow%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/431620/ServiceNow%20Improvements.meta.js
// ==/UserScript==

!function() {
    const MAX_RECURSION_DEPTH = 10;
    const START_DELIMITER = "{{";
    const END_DELIMITER = "}}";
    const AUTOFILL_REPLACEMENT = true;

    const PUBLIC = Symbol.for("PUBLIC");
    const PRIVATE = Symbol.for("PRIVATE");

    const MACROS = [
        {
            name: "Ask for MAC Address",
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},
                    
                Could you please provide the hardware address (also known as a MAC address) for this device? Here are instructions on how to find it: ${START_DELIMITER}link.mac_address${END_DELIMITER}
                
                With this information we'll be able to look into your issue further.
                
                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Ask user to provide the MAC address for the device in question.",
            type: PUBLIC
        },
        {
            name: "Upgrade to Windows 10 Education",
            value: `
                Hello ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                You can upgrade your version of Windows 10 to Windows 10 Education (which is compatible with Stanford's encryption software and BitLocker) by following these steps:
                
                1. Go to [Stanford's Software Licensing Webstore](https://stanford.onthehub.com/WebStore/OfferingDetails.aspx?o=bb702eb6-cbf8-e811-810d-000d3af41938) to get your free product key of Windows 10 Education (one per student).
                2. Right click the **Start Menu** from your desktop.
                3. Select **System**.
                4. Click **Change product key**.
                5. Copy & paste the 25-digit license key from step 1.
                6. Allow the system to reboot (may take 5–10 minutes).
                
                Hope this helps. Lets us know if you have any questions or issues.
                
                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Gives the user step-by-step instructions for upgrading to Windows 10 Education.",
            type: PUBLIC
        },
        {
            name: "Bad WiFi Connection",
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                Our first recommendation is that you "forget" all of the Stanford wireless networks (Stanford Visitor, Stanford, eduroam, Stanford Secure) from any affected device's remembered networks, and then "Rejoin" only the Stanford network.  Please do not connect to other networks until we complete our troubleshooting process with you.
                
                If you continue to experience trouble, please glance at the clock and note the time, what program you were using, and where you were sitting in your apartment.  We can use this information to open a report with networking to investigate the performance of the wireless system in your apartment.  Three of these notes will be enough information for networking to create a very comprehensive picture of what the trouble might be and get a faster resolution.
                
                It is best to troubleshoot one wireless device at a time, as any adjustments made to the wireless system may improve the connections for other devices nearby.
                
                Thank you,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Asks the user for more information when their WiFi is bad.",
            type: PUBLIC
        },
        {
            name: "Manual MyDevices Enrollment",
            value: `
                Hello ${START_DELIMITER}ticket.requester.first_name${END_DELIMITER},
                
                We have manually enrolled this device into the encryption compliance program and have indicated that you will not use this device to manage high risk data. The MyDevices website updates approximately every 12 hours so it may be awhile before you see the device listed.  

                This should resolve the issue regarding "${START_DELIMITER}ticket.title${END_DELIMITER}", and aside from waiting 12-24 hours before confirming the change showing up in your MyDevices, there should be no further action required on your part.
                
                Please do let us know if you have any issues in the future.
                
                Thanks!
                [code]<!-- Delete this line: ${CURSOR("https://web.stanford.edu/dept/its/cgi-bin/services/endpoints/web/enter_enrollment_data.php")} -->[/code]
            `,
            description: "Indicates that a device has been manually enrolled into MyDevices.",
            type: PUBLIC
        },
        {
            name: "Time Stamps",
            value: `
                Hello ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                If you are still experiencing connection issues, could you please send us three times and dates of exactly when you’ve had trouble, each with a brief description of your activity at the time and how it behaved in a way that was less than desirable, as well as the MAC address of the device you were using?
                
                Thank you so much for your continued patience and cooperation while we work to resolve the issue.
                
                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "To request timestamps from customer for Net Trouble ticket.",
            type: PUBLIC
        },
        {
            name: "TSO Information",
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                Thank you for reaching out to PTS! Our first recommendation is to try the other ports in the room—a room often has multiple ports and usually at least one of them is working properly. If that does not work, could you please provide some additional info:
                
                1. The hardware address for your device that you regularly connect to this port: link.mac_address.
                2. A photo where you're plugging in (this should include the number on the panel, usually found on a sticker).
                3. Exact and specific date and times of when you've had trouble, what your activity was at that moment, and how the trouble manifested itself.
                
                With this information we can check the status of that port.
                
                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Asks the user for the MAC address, a picture of the ethernet port, and whether they've tried the other ports in the room.",
            type: PUBLIC
        },
        {
            name: "Dubious Node",
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},
                
                It looks like the device associated with this record has been blocked from using the on-campus network. The default at Stanford is that devices that connect to the network should be encrypted unless you actively indicate why it should be exempt. Common conditions in which a device will get blocked are when the owner does not complete the process, or when the owner indicates a condition in which it should be encrypted, but do not encrypt the device, specifically that the device is used to manage "high-risk data".

                Whether or not you handle "high-risk data", you'll need to indicate that through the Encryption Enrollment app from here: ${START_DELIMITER}link.enrollment_questionnaire${END_DELIMITER}. If you don't deal with high-risk data, or any of the other conditions, this should clear your device from having to encrypt and will reinstate the device's ability to use the on-campus network.
                
                We have temporarily restored this device's access to the network so you can complete this process. At some point in the next couple of hours, it will get blocked again. 
                
                Please let us know how everything goes regardless.
                
                Thanks,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Lets the user know that the device has been blocked due to compliance and gives them instructions for how to resolve it.",
            type: PUBLIC
        },
        {
            name: "DNS Check",
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                We suspect that your computer's current DNS settings are preventing it from reaching the Stanford network properly. While you should receive an appropriate DNS address simply by connecting to the network, your computer may be set so that is not happening automatically. You can manually set the DNS addresses for your computer to the following:

                \`171.64.1.234\` and \`171.67.1.234\`
                
                If this does not resolve the issue, we recommend that you can schedule a virtual appointment through ${START_DELIMITER}link.appointment${END_DELIMITER} to have live assistance to help you get a further troubleshooting.

                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `,
            description: "Explains to the user how to reset a device's DNS record.",
            type: PUBLIC
        }
    ];

    const REPLACEMENTS = [
        {
            triggers: [
                ""
            ],
            value: `
                Hi ${START_DELIMITER}ticket.requester.name.first${END_DELIMITER},

                ${CURSOR("[Your message here]")}

                Best,
                ${START_DELIMITER}current_user.name.first${END_DELIMITER}
            `
        },
        {
            triggers: [
                "ticket.requester.name.first",
                "ticket.requester.first_name"
            ],
            value: _ => {
                let input = document.getElementById("sys_display.ticket.u_requested_for") ||
                    document.getElementById("sys_display.incident.u_requested_for") ||
                    document.getElementById("sc_task.request_item.requested_for_label");
                if (input) {
                    let index = input.value.indexOf(" ");
                    return ~index ? input.value.substring(0, index) : input.value;
                }
                return null;
            },
            description: "The requester's first name"
        },
        {
            triggers: [
                "ticket.requester.name.full",
                "ticket.requester.full_name",
                "ticket.requester.name",
            ],
            value: _ => {
                let input = document.getElementById("sys_display.ticket.u_requested_for") ||
                    document.getElementById("sys_display.incident.u_requested_for") ||
                    document.getElementById("sc_task.request_item.requested_for_label");
                if (input) {
                    return input.value;
                }
                return null;
            },
            description: "The requester's full name"
        },
        {
            triggers: [
                "ticket.requester.email"
            ],
            value: _ => {
                let input = document.getElementById("ticket.u_guest_email") ||
                    document.getElementById("incident.u_guest_email") ||
                    document.getElementById("sys_readonly.sc_task.request_item.u_email");
                if (input) {
                    return input.value;
                }
                return null;
            },
            description: "The requester's email"
        },
        {
            triggers: [
                "ticket.requester.number",
                "ticket.requester.phone",
                "ticket.requester.phone_number"
            ],
            value: _ => {
                let input = document.getElementById("ticket.u_phone_number") ||
                    document.getElementById("incident.u_phone_number") ||
                    document.getElementById("sys_readonly.sc_task.request_item.u_phone_number");
                if (input) {
                    let number = input.value.replace(/\D/g, "");
                    if (number.length == 10) {
                        return `(${number.substring(0,3)}) ${number.substring(3,6)}-${number.substring(6,10)}`;
                    } else {
                        return input.value;
                    }
                }
                return null;
            },
            description: "The requester's phone number"
        },
        {
            triggers: [
                "ticket.number",
                "ticket.id"
            ],
            value: _ => {
                let input = document.getElementById("sys_readonly.ticket.number") ||
                    document.getElementById("sys_readonly.incident.number") ||
                    document.getElementById("sys_readonly.sc_task.number");
                if (input) {
                    return input.value;
                }
                return null;
            },
            description: "The ticket's number"
        },
        {
            triggers: [
                "ticket.title",
                "ticket.name",
                "ticket.description",
                "ticket.short_description"
            ],
            value: _ => {
                let input = document.getElementById("ticket.short_description") ||
                    document.getElementById("incident.short_description") ||
                    document.getElementById("sc_task.short_description");
                if (input) {
                    return input.value;
                }
                return null;
            },
            description: "The ticket's title"
        },
        {
            triggers: [
                "current_user.name.first",
                "current_user.first_name"
            ],
            value: _ => {
                let elem = window.parent.document.getElementsByClassName("user-name")[0];
                if (elem) {
                    let index = elem.innerText.indexOf(" ");
                    return ~index ? elem.innerText.substring(0, index) : elem.innerText;
                }
                return null;
            },
            description: "Your first name"
        },
        {
            triggers: [
                "current_user.name.full",
                "current_user.full_name",
                "current_user.name"
            ],
            value: _ => {
                let elem = window.parent.document.getElementsByClassName("user-name")[0];
                if (elem) {
                    return elem.innerText;
                }
                return null;
            },
            description: "Your full name"
        },
        {
            triggers: [
                "current_date",
                "today"
            ],
            value: _ => {
                const now = new Date();
                const month = now.getMonth() + 1 + "";
                const day = now.getDate() + "";
                const year = now.getFullYear() + "";
                return `${("00" + month).substring(month.length)}/${("00" + day).substring(day.length)}/${year}`;
            },
            description: "Today's date as MM/DD/YYYY"
        },
        {
            triggers: [
                "current_time"
            ],
            value: _ => {
                const now = new Date();
                const hour = now.getHours() + "";
                const min = now.getMinutes() + "";
                return `${(hour <= 12 ? hour || 12 : hour - 12)}:${("00" + min).substring(min.length)} ${hour < 12 ? "AM" : "PM"}`
            },
            description: "The current time as HH:MM AM/PM"
        },
        {
            triggers: [
                "link.mac_address",
                "link.macaddress",
                "link.mac"
            ],
            value: `https://stanford.service-now.com/student_services?id=kb_article&number=KB00018475\n`,
            description: "Link for finding MAC addresses"
        },
        {
            triggers: [
                "link.mydevices",
                "link.my_devices"
            ],
            value: `https://mydevices.stanford.edu`,
            description: "Link to MyDevices page"
        },
        {
            triggers: [
                "link.iprequest"
            ],
            value: `https://iprequest.stanford.edu`,
            description: "Link to IPRequest page"
        },
        {
            triggers: [
                "link.snsr"
            ],
            value: `https://snsr.stanford.edu`,
            description: "Link to SNSR download page"
        },
        {
            triggers: [
                "link.mdm"
            ],
            value: `https://uit.stanford.edu/service/mobiledevice/management`,
            description: "Link to MDM page for all devices"
        },
        {
            triggers: [
                "link.mdm.ios",
                "link.mdm.iphone"
            ],
            value: `https://uit.stanford.edu/service/mobiledevice/management/enroll_ios`,
            description: "Link to MDM page for iOS devices"
        },
        {
            triggers: [
                "link.mdm.android"
            ],
            value: `https://uit.stanford.edu/service/mobiledevice/management/enroll_android`,
            description: "Link to MDM page for Android devices"
        },
        {
            triggers: [
                "link.swde"
            ],
            value: `https://uit.stanford.edu/service/encryption/wholedisk`,
            description: "Link to SWDE page for all devices"
        },
        {
            triggers: [
                "link.swde.mac",
                "link.swde.macbook",
                "link.swde.macos",
                "link.swde.osx"
            ],
            value: `https://uit.stanford.edu/service/encryption/wholedisk/install_mac`,
            description: "Link to SWDE page for MacBooks"
        },
        {
            triggers: [
                "link.swde.windows",
                "link.swde.pc"
            ],
            value: `https://uit.stanford.edu/service/encryption/wholedisk/install_windows`,
            description: "Link to SWDE page for Windows PCs"
        },
        {
            triggers: [
                "link.appointment",
                "link.book_appointment"
            ],
            value: `https://bit.ly/bookPTSappt`,
            description: "Link to book appointments with PTS"
        },
        {
            triggers: [
                "link.enrollment_questionnaire",
                "link.enrollment_quiz",
                "link.enrollment"
            ],
            value: `https://uit.stanford.edu/service/enrollment`,
            description: "Link to Enrollment Questionnaire page"
        },
        {
            triggers: [
                "link.enrollment_questionnaire.mac",
                "link.enrollment_questionnaire.macbook",
                "link.enrollment_questionnaire.macos",
                "link.enrollment_questionnaire.osx",
                "link.enrollment_quiz.mac",
                "link.enrollment_quiz.macbook",
                "link.enrollment_quiz.macos",
                "link.enrollment_quiz.osx",
                "link.enrollment.mac",
                "link.enrollment.macbook",
                "link.enrollment.macos",
                "link.enrollment.osx"
            ],
            value: "https://uit.stanford.edu/service/enrollment/mac",
            description: "Link to Enrollment Questionnaire for MacBooks"
        },
        {
            triggers: [
                "link.enrollment_questionnaire.windows",
                "link.enrollment_questionnaire.pc",
                "link.enrollment_quiz.windows",
                "link.enrollment_quiz.pc",
                "link.enrollment.windows",
                "link.enrollment.pc",
            ],
            value: "https://uit.stanford.edu/service/enrollment/windows",
            description: "Link to Enrollment Questionnaire for Windows PCs"
        },
        {
            triggers: [
                "link.enrollment_questionnaire.mobile",
                "link.enrollment_questionnaire.ios",
                "link.enrollment_questionnaire.iphone",
                "link.enrollment_questionnaire.android",
                "link.enrollment_quiz.mobile",
                "link.enrollment_quiz.ios",
                "link.enrollment_quiz.iphone",
                "link.enrollment_quiz.android",
                "link.enrollment.mobile",
                "link.enrollment.ios",
                "link.enrollment.iphone",
                "link.enrollment.android"
            ],
            value: "https://uit.stanford.edu/service/enrollment/mobiledevice",
            description: "Link to Enrollment Questionnaire for Mobile Device"
        }
    ];

    const CSS_PREFIX = "pts_injected_script";

    const _MACROS = {};
    for (const macro of MACROS) {
        if ("name" in macro) {
            macro.name = macro.name + "";
        } else {
            console.warn(`Skipping macro found with no name.`);
            continue;
        }

        if (typeof macro.description != "string") {
            macro.description = typeof macro.value == "function" ?
                "<i>No description</i>" :
                [Symbol.for("truncated-description"), sanitizeHTML(macro.value) + ""];
        } else {
            macro.description = dedent(macro.description);
        }

        if (!("type" in macro)) {
            console.warn(`Macro with name "${macro.name}" does not have a "type" key. Defaulting to PUBLIC.`);
            macro.type = PUBLIC;
        } else if (macro.type != PUBLIC && macro.type != PRIVATE) {
            console.warn(`Macro with name "${macro.name}" has an invalid "type". Defaulting to PUBLIC.`);
            macro.type = PUBLIC;
        }

        if (typeof macro.value != "function") {
            if (!"value" in macro) {
                console.warn(`Macro with name "${macro.name}" does not have a "value" key. Defaulting to "".`);
                macro.value = "";
            }
            macro.value = dedent(macro.value + "");
        }
        macro.value = dedent(macro.value + "");

        _MACROS[macro.name] = macro;
    }

    const _REPLACEMENTS = {};
    for (const replacement of REPLACEMENTS) {
        if (!("triggers" in replacement)) {
            console.warn(`Skipping replacement with no "triggers" key.`);
            continue;
        } else if (!Array.isArray(replacement.triggers)) {
            replacement.triggers = [replacement.triggers];
        }

        if (typeof replacement.value != "function") {
            if (!"value" in replacement) {
                console.warn(`Replacement with trigger "${replacement.mainTrigger}" does not have a "value" key.`);
            }
            replacement.value = dedent(replacement.value + "");
        }

        replacement.mainTrigger = (replacement.triggers[0] + "").trim().toLowerCase();
        if (typeof replacement.description != "string") {
            if (!("description" in replacement)) {
                console.warn(`Replacement with trigger "${replacement.mainTrigger}" does not have a "description" key.`);
            } else {
                console.warn(`Replacement with trigger "${replacement.mainTrigger}" has a non-string "description" key.`);
            }
            replacement.description = typeof replacement.value == "function" ?
                "<i>No description</i>" :
                [Symbol.for("truncated-description"), sanitizeHTML(replacement.value) + ""];
        } else {
            replacement.description = dedent(replacement.description);
        }

        for (const trigger of (replacement.triggers || [])) {
            _REPLACEMENTS[(trigger + "").trim().toLowerCase()] = replacement;
        }
    }

    function parseMarkdownText(text) {
        // First, we go through the text looking for [code] ... [/code] delimiters. Delimiters that
        // are empty or only have spaces in between them are unwrapped and replaced with its inner
        // contents since there is no code inside them that matters, and it will allow the markdown
        // parser to read them as spaces instead of "[code][/code]" text. Any [code] blocks that
        // were not removed because they have non-space content inside them is completely emptied
        // out to leave only "[code][/code]". When Marked parses the text, that will allow it to
        // ignore all the text inside the [code] blocks and treat it as a regular span of text. Once
        // it has been parsed, we go back through and replace each "[code][/code]" marker with all
        // the text was original inside them so that the text inside remains unparsed. 

        // filteredText is the text once all the [code] blocks have been filtered out.
        let filteredText = "";
        // Keeps track of the text we find inside [code] blocks so we can insert it back into the
        // text at the end.
        let codeBlocks = [];
        let startIndex;
        while (~(startIndex = text.indexOf("[code]"))) {
            // Add all the text up to the "[code]".
            filteredText += text.substring(0, startIndex);
            // Remove the text up to and including the "[code]".
            text = text.substring(startIndex + 6);
            // Keep track of the text inside the current code block.
            let codeBlock = "";
            
            // Keep track of how many nested "[code] ... [/code]" blocks we find. Start at 1 since
            // we just found the first "[code]".
            let codeInstances = 1;
            // Keep going until we get to 0 codeInstances to indicate we found a matching closing
            // "[/code]".
            while (codeInstances) {
                // Get the indices for the next "[code]" and "[/code]".
                let startIndex = text.indexOf("[code]");
                let endIndex = text.indexOf("[/code]");

                // If there is no "[/code]" block, it means we've reached the end of the string
                // without being able to close it. Add on an extra "[/code]" to the end so we can
                // parse it on the next iteration.
                if (!~endIndex) {
                    text += "[/code]";
                    continue;
                }

                if (~startIndex && startIndex < endIndex) {
                    // If there is a "[code]" that comes before a "[/code]", it means we found a
                    // nested "[code]", and will need to find an extra "[/code]". Nested [code]s
                    // are ignored by ServiceNow, so we can just remove the "[code]" and "[/code]"
                    // altogether.
                    // Add the text up to the "[code]" to the code block's text.
                    codeBlock += text.substring(0, startIndex);
                    // Remove the text up to and including the "[code]" so we can parse inside of
                    // it.
                    text = text.substring(startIndex + 6);
                    // Increment codeInstances we know to look for an extra "[/code]" block.
                    codeInstances++;
                } else {
                    // If we found a closing "[/code]", we add all the text up to the "[/code]" to
                    // the code block.
                    codeBlock += text.substring(0, endIndex);
                    // Remove the "[/code]" from the text so we can parse after it now.
                    text = text.substring(endIndex + 7);
                    // Decrement codeInstances so we know how many more "[/code]" blocks to look
                    // for/
                    codeInstances--;
                }
            }

            // Now we've parsed all the text inside a "[code][/code]" block and removed any nested
            // "[code][/code]" blocks that may have been inside. If the content of the code block
            // is just spaces, or nothing, we don't need to add this [code] block to the filtered-
            // Text so that Marked will just treat it as space instead of text.
            if (codeBlock.replace(/ +/, "") == "") {
                // Just add the spaces directly.
                filteredText += codeBlock;
            } else {
                // Otherwise, we will add a "[code][/code]" to serve as a marker for when we need to
                // go back and insert the text again.
                filteredText += "[code][/code]";
                codeBlocks.push(codeBlock.replace(/\n/g, "<br/>"));
            }
        }
        // Now we need to add any remaining text to filteredText.
        filteredText += text;

        // We also want to escape any ampersands so that HTML entities are rendered as-is.
        filteredText = filteredText.replace(/&/g, "&amp;");

        // Pass the filteredText to the markdown parser.
        filteredText = marked(
            filteredText,
            {
                mangle: false,
                headerIds: false,
                smartLists: true
            }
        );

        // Get rid of any HTML entities that were produced by Marked.
        filteredText = filteredText.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

        // Now we go back through and replace instances of "[code][/code]" with the corresponding
        // code block.
        let codeIndex;
        while (~(codeIndex = filteredText.lastIndexOf("[code][/code]"))) {
            filteredText = filteredText.substring(0, codeIndex + 6) + (codeBlocks.pop() || "") + filteredText.substring(codeIndex + 6);
        }

        // Sometimes, newlines ("\n") seem to slip in sometimes, even though new lines in text are
        // *supposed* to be converted to <br>s. We just replace any lingering newlines into "" to
        // get rid of these.
        filteredText = filteredText.replace(/\n/g, "");

        // Now, to shorten the text a bit, get rid of any "[/code][code]" substrings (i.e., the end
        // of a [code] block followed immediately by the start of a code block) so that we can just
        // collapse adjacent [code] blocks.
        filteredText = filteredText.replace(/\[\/code\]\[code\]/g, "");

        return filteredText
    }
    marked.use({
        renderer: {
            code: function(code, infostring, escaped) {
                return `[code]<pre><code>[/code]${code.replace(/\n/g, "[code]<br>[/code]")}[code]</code></pre>[/code]`;
            },
            blockquote: function(quote) {
                return `[code]<blockquote>[/code]${quote}[code]</blockquote>[/code]`;
            },
            // HTML is treated as plain text instead of trying to render it, so we don't wrap it in
            // [code] ... [/code] blocks.
            // html: function(html) {},
            heading: function(text, level, raw, slugger) {
                return `[code]<h${level}>[/code]${text}[code]</h${level}>[/code]`;
            },
            hr: function() {
                return `[code]<hr/>[/code]`;
            },
            list: function(body, ordered, start) {
                return `[code]<${ordered ? `ol${start == 1 ? "" : ` start="${start}"`}` : "ul"}>[/code]\n${body}[code]</${ordered ? "o" : "u"}l>[/code]`;
            },
            listitem: function(text, task, checked) {
                return `[code]<li>[/code]${text}[code]</li>[/code]`;
            },
            checkbox: function(checked) {
                return `[code]<input type="checkbox" disabled${checked ? " checked" : ""}>[/code] `;
            },
            paragraph: function(text) {
                return `[code]<p>[/code]${text}[code]</p>[/code]`;
            },
            table: function(header, body) {
                return `[code]<table><thead>[/code]${header}[code]</thead><tbody>[/code]${body}[code]</tbody></table>[/code]`;
            },
            tablerow: function(content) {
                return `[code]<tr>[/code]${content}[code]</tr>[/code]`;
            },
            tablecell: function(content, flags) {
                return `[code]<td${flags.align ? ` style="text-align:${flags.align}"` : ""}>[/code]${content}[code]</td>[/code]`
            },
            strong: function(text) {
                return `[code]<strong>[/code]${text}[code]</strong>[/code]`;
            },
            em: function(text) {
                return `[code]<em>[/code]${text}[code]</em>[/code]`;
            },
            codespan: function(code) {
                return `[code]<code>[/code]${code}[code]</code>[/code]`
            },
            br: function() {
                return "[code]<br/>[/code]";
            },
            del: function(text) {
                return `[code]<span style="text-decoration:line-through"><del>[/code]${text}[code]</del></span>[/code]`
            },
            link: function(href, title, text) {
                return `[code]<a href="${href}"${title ? ` title="${title}"`: ""}>[/code]${text}[code]</a>[/code]`;
            },
            image: function(src, title, text) {
                return `[code]<img style="max-width:100%" src="${src}"${text ? ` alt="${text}"` : ""}${title ? ` title="${title}"` : ""}/>[/code]`
            },
            text: function(text) {
                return text.replace(/\n/g, "[code]<br/>[/code]");
            }
        },
        extensions: [
            // This extension ensures [code][/code] blocks are kept intact. "[code][/code](link)"
            // for example would be parsed as "[code]" followed by a link "[/code](link)", so this
            // extension prevents that from happening so that "[code][/code]" blocks that are passed
            // in will always come out as normal.
            {
                name: "codeBlock",
                level: "inline",
                start: function(src) {
                    let index = src.indexOf("[code][/code]");
                    return ~index ? index : src.length;
                },
                tokenizer: function(src, tokens) {
                    if (src.startsWith("[code][/code]")) {
                        return {
                            type: "codeBlock",
                            raw: "[code][/code]",
                            tokens: []
                        };
                    } else return false;
                },
                renderer: function(token) {
                    if (token.type == "codeBlock") {
                        return token.raw;
                    } else return false;
                }
            }
        ]
    });

    function dedent(string) {
        let lines = string.split("\n");
        let longestCommonPrefix = null;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (!lines[i].trim().length) {
                lines[i] = "";
                continue;
            }
            let prefix = lines[i].substring(0, lines[i].length - lines[i].trimLeft().length);
            if (longestCommonPrefix == null) {
                longestCommonPrefix = prefix;
                continue;
            }
            if (prefix == longestCommonPrefix) {
                continue;
            }
            let shorter = prefix.length < longestCommonPrefix.length ? prefix : longestCommonPrefix;
            let longer = prefix.length < longestCommonPrefix.length ? longestCommonPrefix : prefix;
            for (let i = 1; i < shorter.length; i++) {
                if (shorter.substring(0, i) != longer.substring(0, i)) {
                    longestCommonPrefix = shorter.substring(0, i - 1);
                    if (i == 1) {
                        break;
                    }
                    continue;
                }
            }
            longestCommonPrefix = shorter;
        }
        if (longestCommonPrefix) {
            for (let i = lines.length - 1; i >= 0; i--) {
                lines[i] = lines[i].substring(longestCommonPrefix.length);
            }
        }
        while (lines[lines.length - 1] == "") {
            lines.pop();
        }
        while (lines[0] == "") {
            lines.shift();
        }
        return lines.join("\n");
    }

    const CURSOR_REGEX = /\$\{CURSOR\((?:"((?:[^"]|\\")*)")?\)\}/;
    function CURSOR(defaultValue) {
        return defaultValue === undefined || defaultValue === null || defaultValue === "" ?
            "${CURSOR()}" :
            '${CURSOR("' + defaultValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '")}'; // Encode as URI to prevent nested "}"
    }

    let textareaDatas = new Map();
    function updateTextareas() {
        for (const [textarea, textareaData] of textareaDatas) {
            if (!document.body.contains(textarea)) {
                textareaDatas.delete(textarea);
                if (textareaData.mirror.parentNode) textareaData.mirror.parentNode.removeChild(textareaData.mirror);
                if (textareaData.autoFiller.parentNode) textareaData.autoFiller.parentNode.removeChild(textareaData.autoFiller);
                if (textareaData.markdownPreviewer.parentNode) textareaData.markdownPreviewer.parentNode.removeChild(textareaData.markdownPreviewer);
                textareaData.elementParent.removeEventListener("focusout", textareaData.elementParentFocusOutListener);
            }
        }
    }

    function getIncompleteTrigger(textareaData) {
        // If there are less characters in the textarea than there are characters in START_DELIMITER,
        // there's no way that our caret is positioned after a start delimiter.
        if (textareaData.element.selectionStart < START_DELIMITER.length) {
            return null;
        }
        // Determine if our caret is positioned after a starting delimiter, but not if there is an end-
        // ing delimiter that closes it.
        let startDelimIndex = textareaData.element.value.lastIndexOf(START_DELIMITER, textareaData.element.selectionStart - START_DELIMITER.length);
        let endDelimIndex = textareaData.element.value.lastIndexOf(END_DELIMITER, textareaData.element.selectionStart - 1);
        if (!~startDelimIndex || (~endDelimIndex && startDelimIndex < endDelimIndex)) {
            return null;
        }

        // Return the text from the starting delimiter up to the caret.
        return textareaData.element.value.substring(startDelimIndex + START_DELIMITER.length, textareaData.element.selectionStart);
    }

    function focusAutoFillItem(textareaData) {
        let index = textareaData.autoFillerFocusedIndex;
        let children = textareaData.autoFiller.children;
        // If the index is out of bounds, do nothing.
        if (index < 0 || index >= children.length) {
            return;
        }
        // Reset other elements that previously had artificial-focusing set to true.
        for (const elem of textareaData.autoFiller.querySelectorAll(`[data-${CSS_PREFIX}-artificial-focusing="true"]`)) {
            elem.setAttribute(`data-${CSS_PREFIX}-artificial-focusing`, "false");
            if (elem.getAttribute(`data-${CSS_PREFIX}-focusing`) != "true" && elem.getAttribute(`data-${CSS_PREFIX}-hovering`) != "true") {
                elem.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
            }
        }
        // Set the now-focused element to artificial-focusing=true
        children[index].setAttribute(`data-${CSS_PREFIX}-artificial-focusing`, "true");
        children[index].firstElementChild.classList.add("sn-card-component_accent-bar_dark");
        // Scroll it into view to appear as if it is focused.
        if (typeof children[index].scrollIntoViewIfNeeded == "function") {
            children[index].scrollIntoViewIfNeeded();
        }
    }

    function showOrHideAutoFiller(textareaData) {
        let incompleteMacro = getIncompleteTrigger(textareaData);

        // If we are not currently typing out a macro, we can hide the autoFiller and return.
        if (incompleteMacro === null || document.activeElement != textareaData.element) {
            textareaData.autoFiller.style.display = "none";
            textareaData.autoFilling = false;
            return;
        }

        // Otherwise, we want to show the autoFiller and calculate where to show it.
        textareaData.autoFiller.style.display = "block";

        // Copy the textarea's content to the mirror. We first paste all the text up to the starting
        // delimiter. Then, we insert a <span> with the start delimiter, as well as the word that
        // follows it (i.e., everything up to the next space). Then we calculate the vertical and
        // horizontal position of the span to determine where to place the autoFiller box.
        let startDelimIndex = textareaData.element.value.lastIndexOf(START_DELIMITER, textareaData.element.selectionStart - START_DELIMITER.length);
        textareaData.mirror.innerText = textareaData.element.value.substring(0, startDelimIndex);
        let caret = document.createElement("span");
        let spaceIndex = textareaData.element.value.indexOf(" ", startDelimIndex);
        // We count a newline or tab as whitespace too since the browser may wrap at those points.
        let newlineIndex = textareaData.element.value.indexOf("\n", startDelimIndex);
        let tabIndex = textareaData.element.value.indexOf("\t", startDelimIndex);
        let whiteSpaceIndex = textareaData.element.selectionStart;
        if (~spaceIndex) {
            whiteSpaceIndex = Math.min(spaceIndex, whiteSpaceIndex);
        }
        if (~newlineIndex) {
            whiteSpaceIndex = Math.min(newlineIndex, whiteSpaceIndex);
        }
        if (~tabIndex) {
            whiteSpaceIndex = Math.min(tabIndex, whiteSpaceIndex);
        }
        caret.innerText = textareaData.element.value.substring(startDelimIndex, whiteSpaceIndex);
        textareaData.mirror.appendChild(caret);
        textareaData.caretTop = textareaData.mirror.getBoundingClientRect().height;
        textareaData.caretLeft = caret.offsetLeft;

        // Now we can position the autoFiller directly underneath the opening delimiter.
        textareaData.autoFiller.style.left =
            Math.min(
                textareaData.caretLeft,
                parseFloat(textareaData.mirror.style.width) - 200 
            ) +
            parseFloat(textareaData.styles.paddingLeft) +
            parseFloat(textareaData.styles.borderLeftWidth) +
            textareaData.element.offsetLeft + "px";
        textareaData.autoFiller.style.top =
            textareaData.caretTop +
            parseFloat(textareaData.styles.paddingTop) +
            parseFloat(textareaData.styles.borderTopWidth) +
            textareaData.element.offsetTop + "px";

        // Set the autoFiller's artificial focus index to 0 (the first item in the list).
        textareaData.autoFillerFocusedIndex = 0;

        textareaData.autoFilling = true;
    }

    function sanitizeHTML(string) {
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function selectAutoFillerItem(e, textareaData) {
        let item = e.currentTarget;
        let name = item.getAttribute(`data-${CSS_PREFIX}-replacement-name`);

        let previousStartDelimIndex = textareaData.element.value.lastIndexOf(START_DELIMITER, textareaData.element.selectionStart - START_DELIMITER.length);
        let nextStartDelimIndex = textareaData.element.value.indexOf(START_DELIMITER, textareaData.element.selectionStart);
        let nextEndDelimIndex = textareaData.element.value.indexOf(END_DELIMITER, textareaData.element.selectionStart);

        let newValue;
        let newCaretPos;
        if (~nextEndDelimIndex && (!~nextStartDelimIndex || nextEndDelimIndex > nextStartDelimIndex)) {
            // If there is a closing delimiter after the current selection, and it is not the closing
            // delimiter for another opening delimiter, we can replace up to that point.
            newValue = textareaData.element.value.substring(0, previousStartDelimIndex + START_DELIMITER.length) +
                name +
                textareaData.element.value.substring(nextEndDelimIndex);
            newCaretPos = previousStartDelimIndex + START_DELIMITER.length + name.length + END_DELIMITER.length;
        } else {
            // Otherwise, we just want to replace from the start delimiter up to the caret, and insert
            // the closing delimiter ourself.
            newValue = textareaData.element.value.substring(0, previousStartDelimIndex + START_DELIMITER.length) +
                name +
                (AUTOFILL_REPLACEMENT ? END_DELIMITER : "") +
                textareaData.element.value.substring(Math.max(textareaData.element.selectionStart, textareaData.element.selectionEnd));
            newCaretPos = previousStartDelimIndex + START_DELIMITER.length + name.length + (AUTOFILL_REPLACEMENT ? END_DELIMITER.length : 0);
        }

        // Select all the text in the <textarea>.
        setTextareaValue(textareaData, newValue, true);
        // Set the selection back to where it should be.
        textareaData.element.setSelectionRange(newCaretPos, newCaretPos);
        // Check if there are any new replacements to make.
        checkReplacements(textareaData);
    }

    function setTextareaValue(textareaData, value, suppressInputs) {
        if (suppressInputs) {
            textareaData.suppressInputs = true;
        }
        textareaData.element.focus();
        if (document.queryCommandSupported("insertHTML") && document.queryCommandEnabled("insertHTML")) {
            // We set the textarea's value using insertHTML to allow for undoing/redoing, and
            // because insertHTML seems to perform much faster than insertText in some browsers.
            textareaData.element.setSelectionRange(0, textareaData.element.value.length);
            document.execCommand("insertHTML", false, sanitizeHTML(value) + (value[value.length - 1] == "\n" ? "<br>" : ""));
        } else if (document.queryCommandSupported("insertText") && document.queryCommandEnabled("insertText")) {
            // Fall back to insertText if insertHTML is not enabled (Firefox).
            textareaData.element.setSelectionRange(0, textareaData.element.value.length);
            document.execCommand("insertText", false, value);
        } else {
            // Set the value directly if all else fails.
            textareaData.value = value;
        }
        textareaData.suppressInputs = false;
    }

    function checkReplacements(textareaData, customValue, customCaret) {
        let value = customValue || textareaData.element.value;
        let lastIndex = value.length;
        let startIndex;
        let caretPosition = customCaret || Math.min(textareaData.element.selectionStart, textareaData.element.selectionEnd);

        while (~(startIndex = value.lastIndexOf(START_DELIMITER, lastIndex)) && lastIndex >= 0) {
            let endIndex = value.indexOf(END_DELIMITER, startIndex);
            // No end delimiter indicates there are no more replacements to make.
            if (!~endIndex) {
                break;
            }

            let nestedString = value.substring(startIndex + START_DELIMITER.length, endIndex);
            let [expansion, gotExpanded] = expandString(nestedString, 0);

            if (endIndex + END_DELIMITER.length <= caretPosition && gotExpanded) {
                // If the caret position is after the current replacement, we need to move it to account
                // for the new characters.
                caretPosition += expansion.length - (endIndex + END_DELIMITER.length - startIndex);
            } else if (startIndex < caretPosition && gotExpanded) {
                // If the caretPosition is in between the starting end ending delimiters, we move the
                // caret position to be right after the replacement.
                caretPosition = startIndex + expansion.length;
            }

            value = value.substring(0, startIndex) + expansion + value.substring(endIndex + END_DELIMITER.length);
            lastIndex = startIndex - 1;
        }

        let caretPositions = [];

        // Now we look for any ${CURSOR()} markers to indicate where we should place the caret.
        let match;
        while (match = CURSOR_REGEX.exec(value)) {
            let selection = (match[1] || "").replace(/\\"/g, '"').replace(/\\\\/g, "\\");

            value = value.substring(0, match.index) + selection + value.substring(match.index + match[0].length);
            caretPositions.push([match.index, match.index + selection.length]);
            if (match.index < caretPosition) {
                if (caretPosition < match.index + match[0].length) {
                    // If our current caretPosition is somehow found in the middle of a ${CURSOR()}
                    // marker, we want it to be at the end of where ${CURSOR()} gets replaced.
                    caretPosition = match.index + selection.length;
                } else {
                    // If our caret position is after the ${CURSOR()} marker, we move it up by the
                    // amount of characters we are removing.
                    caretPosition += selection.length - match[0].length;
                }
            }
        }

        // Add the default caretPosition on to the end so that the cursor will always end up there.
        caretPositions.push([caretPosition, caretPosition]);

        // caretPositions may have multiple positions where we can place the caret. For now, we just
        // look at the first one, although this may change in the future.

        setTextareaValue(textareaData, value, true);
        // Set the selection back to where it should be.
        textareaData.element.setSelectionRange(...caretPositions[0]);
    }

    function expandString(string, level) {
        if (level >= MAX_RECURSION_DEPTH) {
            return ["[Maximum recursion depth exceeded]", true];
        }
        let unchanged = string;

        // We remove all ${CURSOR()} markers from the string to see if the string's raw value, without
        // cursors, matches any replacements.
        let index = 0;
        let match;
        while (match = CURSOR_REGEX.exec(string.substring(index))) {
            index += match.index;
            string = string.substring(0, index) + string.substring(index + match[0].length);
        }

        string = string.trim().toLowerCase();

        // If this string is a valid trigger, replace it with its replacement value.
        let replacement;
        if (string in _REPLACEMENTS) {
            if (typeof _REPLACEMENTS[string].value == "function") {
                let value = _REPLACEMENTS[string].value();
                if (value == null) {
                    // If the function returns null, it means we shouldn't expand to anything.
                    return [START_DELIMITER + unchanged + END_DELIMITER, false];
                }
                replacement = dedent(value + "");
            } else {
                replacement = _REPLACEMENTS[string].value; // Already dedented.
            }
        } else {
            // No trigger with this name; return the value unchanged.
            return [START_DELIMITER + unchanged + END_DELIMITER, false];
        }
        
        // Now that we have the replaced value, we need to check to see if there were any nested
        // replacements.
        let lastIndex = replacement.length;
        let startIndex;
        while (~(startIndex = replacement.lastIndexOf(START_DELIMITER, lastIndex)) && lastIndex >= 0) {
            let endIndex = replacement.indexOf(END_DELIMITER, startIndex);
            if (!~endIndex) {
                break;
            }
            let nestedString = replacement.substring(startIndex + START_DELIMITER.length, endIndex);
            let [expansion, _] = expandString(nestedString, level + 1);
            replacement = replacement.substring(0, startIndex) + expansion + replacement.substring(endIndex + END_DELIMITER.length);
            lastIndex = startIndex - 1;
        }

        return [replacement, true];
    }

    function populateAutoFiller(textareaData) {
        let incompleteMacro = getIncompleteTrigger(textareaData).trim().toLowerCase();

        let filteredIndices = [];
        for (let i = 0, l = REPLACEMENTS.length; i < l; i++) {
            if (REPLACEMENTS[i].mainTrigger.startsWith(incompleteMacro)) {
                filteredIndices.push(i)
            }
        }

        // If there are no results to show, hide the autoFiller entirely.
        if (filteredIndices.length == 0) {
            textareaData.autoFillerIndices = [];
            textareaData.autoFilling = false;
            textareaData.autoFiller.style.display = "none";
        }

        if (textareaData.autoFillerVisibleIndices.join("|") == filteredIndices.join("|")) {
            // The same macros as before are going to be shown. No need to update the menu.
            focusAutoFillItem(textareaData);
            return;
        }

        // Make a fragment where we will add all the results.
        let fragment = document.createDocumentFragment();

        for (const index of filteredIndices) {
            let replacement = REPLACEMENTS[index];
            // Each entry is a <li>.
            let li = document.createElement("li");
            li.innerHTML = `
                <div class="sn-card-component_accent-bar"></div>
                <strong>${START_DELIMITER}${sanitizeHTML(replacement.mainTrigger).replace(/(\.|_)/g, "$1<wbr>") || ""}${END_DELIMITER}</strong>
                ${
                    typeof replacement.description == "string" ?
                        `<small>${replacement.description || '""'}</small>` :
                        `<small class="${CSS_PREFIX}-desc-flex">"<span>${replacement.description[1]}</span>"</small>`
                }
            `;
            li.setAttribute(`data-${CSS_PREFIX}-replacement-name`, replacement.mainTrigger);
            if (typeof replacement.value != "function") {
                li.title = replacement.value;
                li.setAttribute("data-original-title", replacement.value);
            }
            li.tabIndex = 0;
            li.role = "button";

            // Add a click listener to make it autocomplete the replacement.
            li.addEventListener("click", e => selectAutoFillerItem(e, textareaData));
            // Also add a keydown listener for Enter and Spacebar to activate the click listener like
            // how a button would.
            li.addEventListener("keydown", function(e) {
                if (e.code == "Enter" || e.code == " ") selectAutoFillerItem(e, textareaData);
            });
            // Hover-in listener to left-align the tooltip, as well as make the item highlighted.
            li.addEventListener("mouseenter", function(e) {
                li.setAttribute(`data-${CSS_PREFIX}-hovering`, "true");
                li.firstElementChild.classList.add("sn-card-component_accent-bar_dark");
                document.documentElement.setAttribute(`data-${CSS_PREFIX}-left-align-tooltip`, "true");
                document.documentElement.setAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`, "true");
                for (const tooltip of document.getElementsByClassName("tooltip")) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            });
            // Hover-out listener to make the tooltip return to normal, as well as un-highlight the
            // item.
            li.addEventListener("mouseleave", function(e) {
                li.setAttribute(`data-${CSS_PREFIX}-hovering`, "false");
                if (li.getAttribute(`data-${CSS_PREFIX}-focusing`) != "true" && li.getAttribute(`data-${CSS_PREFIX}-artificial-focusing`) != "true") {
                    li.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
                    document.documentElement.setAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`, "false");

                    // The tooltip lingers even after hovering out, so we need to wait for the tooltip
                    // to actually disappear before we can return the center alignment is normally has.
                    let tooltip = document.getElementsByClassName("tooltip")[0];
                    if (tooltip) {
                        new MutationObserver(function(_, self) {
                            self.disconnect();
                            if (document.documentElement.getAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`) != "true") {
                                document.documentElement.setAttribute(`data-${CSS_PREFIX}-left-align-tooltip`, "false");
                            }
                        }).observe(tooltip.parentNode, {
                            childList: true,
                            characterData: true,
                            subtree: true
                        });
                    }
                }
            });
            // Focusing on the item is treated the same same as hovering in.
            li.addEventListener("focus", function(e) {
                li.setAttribute(`data-${CSS_PREFIX}-focusing`, "true");
                li.firstElementChild.classList.add("sn-card-component_accent-bar_dark");
                document.documentElement.setAttribute(`data-${CSS_PREFIX}-left-align-tooltip`, "true");
                document.documentElement.setAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`, "true");
                for (const tooltip of document.getElementsByClassName("tooltip")) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                // Also update the focusedIndex we have saved to match.
                textareaData.autoFillerFocusedIndex = Array.prototype.indexOf.call(li.parentNode.children, li);
                focusAutoFillItem(textareaData);
            });
            // Blurring the item is the same as hovering out.
            li.addEventListener("blur", function(e) {
                li.setAttribute(`data-${CSS_PREFIX}-focusing`, "false");
                if (li.getAttribute(`data-${CSS_PREFIX}-hovering`) != "true" && li.getAttribute(`data-${CSS_PREFIX}-artificial-focusing`) != "true") {
                    li.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
                    document.documentElement.setAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`, "false");
                    let tooltip = document.getElementsByClassName("tooltip")[0];
                    if (tooltip) {
                        new MutationObserver(function(_, self) {
                            self.disconnect();
                            if (document.documentElement.getAttribute(`data-${CSS_PREFIX}-hovering-auto-filler-option`) != "true") {
                                document.documentElement.setAttribute(`data-${CSS_PREFIX}-left-align-tooltip`, "false");
                            }
                        }).observe(tooltip.parentNode, {
                            childList: true,
                            characterData: true,
                            subtree: true
                        });
                    }
                }
            });
            fragment.appendChild(li);
        }

        // Replace the content of the autoFiller with the new items.
        textareaData.autoFiller.innerText = "";
        textareaData.autoFiller.appendChild(fragment);
        textareaData.autoFillerVisibleIndices = filteredIndices;
    }

    function selectMacroItem(e) {
        let name = e.currentTarget.getAttribute(`data-${CSS_PREFIX}-macro-name`);
        let macro = _MACROS[name];

        // First get the macro's value.
        let value;
        if (typeof macro.value == "function") {
            value = macro.value();
            value = value === null ? "" : value; // null expands to an empty string
            value = dedent(value + "");
        } else {
            value = macro.value; // Already dedented.
        }

        // Check what kind of textarea(s) is/are currently showing.
        let textarea = document.getElementById("activity-stream-textarea");
        // .offsetParent can be used to check if the element is actually visible.
        if (textarea && textarea.offsetParent) {
            let textareaType = textarea.getAttribute("data-stream-text-input");
            // Check if we need to switch to the other type of <textarea>
            if ((textareaType == "comments" && macro.type == PRIVATE) || (textareaType == "work_notes" && macro.type == PUBLIC)) {
                // Manually click the checkbox to toggle work notes.
                let checkbox = document.querySelector(".sn-controls.row .pull-right input[type='checkbox'][name='work_notes-journal-checkbox'], .sn-controls.row .pull-right input[type='checkbox'][name='comments-journal-checkbox']");
                if (checkbox) {
                    checkbox.click();
                }
            }
        } else {
            // If there was no textarea found above, we must be in the mode where both textareas are
            // showing, in which case, we can target the desired one by an ID.
            textarea = macro.type == PUBLIC ? document.getElementById("activity-stream-comments-textarea") : document.getElementById("activity-stream-work_notes-textarea");
        }

        if (!textarea) {
            return;
        }

        // Instead of insertHTML-ing it like we normally do to update the <textarea> value, we pass the
        // value directly to checkReplacements() instead so that it can handle the insertHTML. If we
        // we tried to do it here, it would insert the HTML, call the "input" handler on the <textarea>,
        // go to checkReplacements(), and eventually re-insert HTML. This isn't much of a problem since
        // it adds very little extra runtime, but Chrome has a "feature" where if it detects one
        // insertHTML triggers another insertHTML, it thinks it's going to cause an infinite recursion
        // and doesn't execute the second insertHTML, so we can only stick to one insertHTML instead.
        checkReplacements(textareaDatas.get(textarea), value, value.length);
    }

    function focusMacroItem(macroContainer) {
        let index = +macroContainer.getAttribute(`data-${CSS_PREFIX}-focused-index`);
        let children = macroContainer.lastElementChild.children;
        // If the index is out of bounds, do nothing.
        if (index < 0 || index >= children.length) {
            return;
        }
        // Reset other elements that previously had artificial-focusing set to true.
        for (const elem of macroContainer.lastElementChild.querySelectorAll(`[data-${CSS_PREFIX}-artificial-focusing="true"]`)) {
            elem.setAttribute(`data-${CSS_PREFIX}-artificial-focusing`, "false");
            if (elem.getAttribute(`data-${CSS_PREFIX}-focusing`) != "true" && elem.getAttribute(`data-${CSS_PREFIX}-hovering`) != "true") {
                elem.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
            }
        }
        // Set the now-focused element to artificial-focusing=true
        children[index].setAttribute(`data-${CSS_PREFIX}-artificial-focusing`, "true");
        children[index].firstElementChild.classList.add("sn-card-component_accent-bar_dark");
        children[index].focus();
        // Scroll it into view to appear as if it is focused.
        if (typeof children[index].scrollIntoViewIfNeeded == "function") {
            children[index].scrollIntoViewIfNeeded();
        }
    }

    function updateTextareaSelection(textareaData) {
        showOrHideAutoFiller(textareaData);
        if (textareaData.autoFilling) {
            populateAutoFiller(textareaData);
        }
    }

    window.addEventListener("resize", updateTextareas);

    document.addEventListener("input", function(e) {
        updateTextareas();
        let textareaData = textareaDatas.get(e.target);
        if (textareaData) {
            if (!textareaData.suppressInputs) {
                checkReplacements(textareaData);
            }
            showOrHideAutoFiller(textareaData);
            if (textareaData.autoFilling) {
                populateAutoFiller(textareaData);
            }
        }
    });

    document.addEventListener("selectionchange", function(e) {
        let textareaData = textareaDatas.get(document.activeElement);
        if (textareaData) {
            updateTextareaSelection(textareaData);
        }
    });

    function f() {
        let textareaElements = document.querySelectorAll(`textarea:not([data-${CSS_PREFIX}-found-textarea])`);
        for (const textarea of textareaElements) {
            textarea.setAttribute(`data-${CSS_PREFIX}-found-textarea`, "true");

            let styles = getComputedStyle(textarea);
            let mirror = document.createElement("div");
            mirror.classList.add(`${CSS_PREFIX}-textarea-mirror`);
            mirror.style.width =
                textarea.getBoundingClientRect().width -
                parseFloat(styles.paddingLeft) -
                parseFloat(styles.paddingRight) -
                parseFloat(styles.borderLeftWidth) -
                parseFloat(styles.borderRightWidth) + "px";
            mirror.style.fontFamily = styles.fontFamily;
            mirror.style.fontWeight = styles.fontWeight;
            mirror.style.fontStyle = styles.fontStyle;
            mirror.style.fontSize = styles.fontSize;
            mirror.style.lineHeight = styles.lineHeight;
            document.body.appendChild(mirror);

            let autoFiller = document.createElement("ul");
            autoFiller.classList.add(`${CSS_PREFIX}-auto-filler`, "h-card");
            autoFiller.style.display = "none";
            textarea.parentNode.insertBefore(autoFiller, textarea.nextElementSibling);

            let markdownPreviewer = document.createElement("div");
            markdownPreviewer.classList.add(`${CSS_PREFIX}-textarea-md-preview`, "form-control");
            markdownPreviewer.setAttribute(`data-${CSS_PREFIX}-is-previewing`, "false");
            markdownPreviewer.style.display = "none";
            let markdownPreviewerRoot = markdownPreviewer.attachShadow({mode: "open"});
            markdownPreviewerRoot.innerHTML = `<link href="styles/activity_encapsulated.css" rel="stylesheet" type="text/css"><style>:host img{max-width:100%;height:auto;overflow:hidden}</style><div style="max-height:100%;overflow:auto;padding:0 18px"></div>`;
            textarea.parentNode.insertBefore(markdownPreviewer, textarea.nextElementSibling);

            function parentFocusOut(e) {
                if (e.relatedTarget === null || (e.relatedTarget instanceof HTMLElement && !e.currentTarget.contains(e.relatedTarget))) {
                    showOrHideAutoFiller(textareaData);
                }
            }
            textarea.parentNode.addEventListener("focusout", parentFocusOut);

            let textareaData = {
                element: textarea,
                mirror: mirror,
                autoFiller: autoFiller,
                autoFilling: false,
                autoFillerVisibleIndices: [],
                markdownPreviewer: markdownPreviewer,
                markdownPreviewerRoot: markdownPreviewerRoot.lastElementChild,
                caretTop: null,
                caretLeft: null,
                styles: styles,
                elementParent: textarea.parentNode,
                elementParentFocusOutListener: parentFocusOut
            };
            textareaDatas.set(textarea, textareaData);

            textarea.addEventListener("keydown", function(e) {
                // Only intercept keypresses when the autFiller is open.
                if (textareaData.autoFilling) {
                    if (e.code == "ArrowDown") {
                        // An arrow down should move the focus down one.
                        e.preventDefault();
                        if (textareaData.autoFillerFocusedIndex < textareaData.autoFiller.children.length - 1) {
                            textareaData.autoFillerFocusedIndex++;
                            focusAutoFillItem(textareaData);
                        }
                    } else if (e.code == "ArrowUp") {
                        // An arrow up should move the focus up one.
                        e.preventDefault();
                        if (textareaData.autoFillerFocusedIndex > 0) {
                            textareaData.autoFillerFocusedIndex--;
                            focusAutoFillItem(textareaData);
                        }
                    } else if (e.code == "Tab" || e.code == "Enter") {
                        // A Tab or Enter is used to "click" on the currently selected item from the
                        // list. Normally, a button only activates on Spacebar and Enter, but Tab is
                        // more natural for auto-completing, and Spacebar instead should insert an
                        // actual space.
                        e.preventDefault();
                        textareaData.autoFiller.children[textareaData.autoFillerFocusedIndex].click();
                    }
                }
            });

            textarea.addEventListener("mousedown", function(e) {
                updateTextareaSelection(textareaData);
            });

            textarea.addEventListener("mouseup", function(e) {
                updateTextareaSelection(textareaData);
            });
        }

        let pullRightSections = document.querySelectorAll(`.sn-controls.row .pull-right:not([data-${CSS_PREFIX}-macro-btn-inserted])`);
        for (const section of pullRightSections) {
            section.setAttribute(`data-${CSS_PREFIX}-macro-btn-inserted`, "true");
            let macroContainer = document.createElement("span");
            macroContainer.classList.add(`${CSS_PREFIX}-macro-list-container`);
            macroContainer.addEventListener("keydown", function(e) {
                if (macroContainer.firstElementChild.getAttribute(`data-${CSS_PREFIX}-list-expanded`) == "true") {
                    let index = +macroContainer.getAttribute(`data-${CSS_PREFIX}-focused-index`);
                    if (e.code == "ArrowDown") {
                        // An arrow down should move the focus down one.
                        e.preventDefault();
                        if (index < macroContainer.lastElementChild.children.length - 1) {
                            macroContainer.setAttribute(`data-${CSS_PREFIX}-focused-index`, index + 1);
                            focusMacroItem(macroContainer);
                        }
                    } else if (e.code == "ArrowUp") {
                        // An arrow up should move the focus up one.
                        e.preventDefault();
                        if (index > 0) {
                            macroContainer.setAttribute(`data-${CSS_PREFIX}-focused-index`, index - 1);
                            focusMacroItem(macroContainer);
                        } else if (index == 0) {
                            // Close the menu and focus the button if we are already at the top.
                            macroContainer.firstElementChild.setAttribute(`data-${CSS_PREFIX}-list-expanded`, "true");
                            macroContainer.firstElementChild.click();
                            macroContainer.firstElementChild.focus();
                        }
                    } else if (e.code == " " || e.code == "Enter") {
                        // A Tab or Enter is used to "click" on the currently selected item from the
                        // list. Normally, a button only activates on Spacebar and Enter, but Tab is
                        // more natural for auto-completing, and Spacebar instead should insert an
                        // actual space.
                        e.preventDefault();
                        macroContainer.lastElementChild.children[index].click();
                    }
                } else if (document.activeElement == macroContainer.firstElementChild && e.code == "ArrowDown") {
                    // If the menu is closed, and the button is focused, and we hit ArrowDown, we open
                    // the menu.
                    e.preventDefault();
                    macroContainer.firstElementChild.click();
                }
            });
            macroContainer.addEventListener("focusout", function(e) {
                if (e.relatedTarget === null || (e.relatedTarget instanceof HTMLElement && !macroContainer.contains(e.relatedTarget))) {
                    // Set to true so we can toggle it to false.
                    macroContainer.firstElementChild.setAttribute(`data-${CSS_PREFIX}-list-expanded`, "true");
                    macroContainer.firstElementChild.click();
                }
            });

            let btn = document.createElement("button");
            btn.classList.add(`${CSS_PREFIX}-macro-btn`, "btn", "btn-default");
            btn.setAttribute(`data-${CSS_PREFIX}-list-expanded`, "false");
            btn.setAttribute("type", "button");
            btn.tabIndex = 0;
            btn.innerText = "Apply Macro";
            btn.addEventListener("mousedown", function(e) {
                // The <button> is receiving focus. Safari and Firefox have a bug where a <button> won't
                // be focused when you click on it
                // (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus)
                // so we have to do that ourselves.
                if (document.activeElement != btn) {
                    btn.focus();
                    e.preventDefault();
                }
            });
            btn.addEventListener("click", function(e) {
                let expanded = btn.getAttribute(`data-${CSS_PREFIX}-list-expanded`) != "true";
                btn.setAttribute(`data-${CSS_PREFIX}-list-expanded`, expanded);
                if (expanded) {
                    macroContainer.lastElementChild.style.display = "block";
                    macroContainer.setAttribute(`data-${CSS_PREFIX}-focused-index`, 0);
                    focusMacroItem(macroContainer);
                    let previewBtn = section.querySelector(`.${CSS_PREFIX}-preview-btn[data-${CSS_PREFIX}-is-previewing="true"]`);
                    if (previewBtn) {
                        previewBtn.click();
                    }
                } else {
                    macroContainer.lastElementChild.style.display = "none";
                }
            });
            macroContainer.appendChild(btn);

            let macroList = document.createElement("ul");
            macroList.classList.add(`${CSS_PREFIX}-macro-list`, "h-card");
            macroList.style.display = "none";
            for (const macro of MACROS) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <div class="sn-card-component_accent-bar"></div>
                    <strong>${sanitizeHTML(macro.name).replace(/(\.|_)/g, "$1<wbr>") || "<i>[Empty Name]</i>"}</strong>
                    ${
                        typeof macro.description == "string" ?
                            `<small>${macro.description || '""'}</small>` :
                            `<small class="${CSS_PREFIX}-desc-flex">"<span>${macro.description[1]}</span>"</small>`
                    }
                `;
                li.setAttribute(`data-${CSS_PREFIX}-macro-name`, macro.name);
                li.tabIndex = 0;
                li.role = "button";

                li.addEventListener("click", selectMacroItem);
                li.addEventListener("keydown", function(e) {
                    if (e.code == "Enter" || e.code == " ") selectMacroItem(e);
                });
                li.addEventListener("mouseenter", function(e) {
                    li.setAttribute(`data-${CSS_PREFIX}-hovering`, "true");
                    li.firstElementChild.classList.add("sn-card-component_accent-bar_dark");
                });
                li.addEventListener("mouseleave", function(e) {
                    li.setAttribute(`data-${CSS_PREFIX}-hovering`, "false");
                    if (li.getAttribute(`data-${CSS_PREFIX}-focusing`) != "true" && li.getAttribute(`data-${CSS_PREFIX}-artificial-focusing`) != "true") {
                        li.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
                    }
                });
                li.addEventListener("focus", function(e) {
                    li.setAttribute(`data-${CSS_PREFIX}-focusing`, "true");
                    li.firstElementChild.classList.add("sn-card-component_accent-bar_dark");
                    macroContainer.setAttribute(`data-${CSS_PREFIX}-focused-index`, Array.prototype.indexOf.call(li.parentNode.children, li));
                    focusMacroItem(macroContainer);
                });
                li.addEventListener("blur", function(e) {
                    li.setAttribute(`data-${CSS_PREFIX}-focusing`, "false");
                    if (li.getAttribute(`data-${CSS_PREFIX}-hovering`) != "true" && li.getAttribute(`data-${CSS_PREFIX}-artificial-focusing`) != "true") {
                        li.firstElementChild.classList.remove("sn-card-component_accent-bar_dark");
                    }
                });
                macroList.appendChild(li);
            }
            macroContainer.appendChild(macroList);

            section.insertBefore(macroContainer, section.firstElementChild);
        }

        pullRightSections = document.querySelectorAll(`.sn-controls.row .pull-right:not([data-${CSS_PREFIX}-preview-btn-inserted])`);
        for (const section of pullRightSections) {
            section.setAttribute(`data-${CSS_PREFIX}-preview-btn-inserted`, "true");
            
            let postBtn = section.querySelector(".activity-submit");
            if (!postBtn) {
                continue;
            }

            // Make a copy of the Post button so that we can parse the markdown first, and then push
            // the actual post button ourself.
            let prePostBtn = document.createElement("button");
            prePostBtn.classList.add(`${CSS_PREFIX}-prepost-btn`, "btn", "btn-default");
            prePostBtn.innerText = postBtn.innerText
            prePostBtn.addEventListener("click", function(e) {
                e.preventDefault();
                // Get the visible textareas.
                let textareas = [
                    document.getElementById("activity-stream-textarea"),
                    document.getElementById("activity-stream-comments-textarea"),
                    document.getElementById("activity-stream-work_notes-textarea")
                ];

                // Go through each textarea and replace its contents with the markdown-parsed
                // version, but only if the textarea is visible (by checking. offsetParent), and if
                // the markdown-parsed text is any different from the textarea's actual text.
                for (const textarea of textareas) {
                    if (!textarea || !textarea.offsetParent) continue;
                    let parsedText = parseMarkdownText(textarea.value);
                    if (textarea.value != parsedText) {
                        setTextareaValue(textareaDatas.get(textarea), parsedText, false);
                    }
                }

                // Wait a little bit of time before clicking the post button to ensure the textarea
                // has had enough time to update.
                setTimeout(function() {
                    postBtn.click();
                }, 250);
            });

            // Make a Preview button to toggle previewing a textarea's markdown.
            let previewBtn = document.createElement("button");
            previewBtn.classList.add(`${CSS_PREFIX}-preview-btn`, "btn", "btn-default");
            previewBtn.innerText = "Preview";
            previewBtn.setAttribute(`data-${CSS_PREFIX}-is-previewing`, "false");
            previewBtn.addEventListener("click", function(e) {
                e.preventDefault();
                let previewing = previewBtn.getAttribute(`data-${CSS_PREFIX}-is-previewing`) != "true";
                previewBtn.setAttribute(`data-${CSS_PREFIX}-is-previewing`, previewing);
                // Get the visible textareas.
                let textareas = [
                    document.getElementById("activity-stream-textarea"),
                    document.getElementById("activity-stream-comments-textarea"),
                    document.getElementById("activity-stream-work_notes-textarea")
                ];

                // For each of the textareas, show its Markdown previewer div.
                for (const textarea of textareas) {
                    if (!textarea) continue;
                    let textareaData = textareaDatas.get(textarea);

                    // Parse the textarea's value as Markdown to turn it into HTML.
                    let parsed = parseMarkdownText(textarea.value);
                    // Now we have to sanitize all the text outside of [code][/code] blocks, while
                    // leaving text inside [code][/code] blocks as-is.

                    // Most of the code below is taken directly from parseMarkdownText().
                    let escaped = "";
                    let startIndex;
                    while (~(startIndex = parsed.indexOf("[code]"))) {
                        escaped += sanitizeHTML(parsed.substring(0, startIndex));
                        parsed = parsed.substring(startIndex + 6);
                        
                        let codeInstances = 1;
                        while (codeInstances) {
                            let startIndex = parsed.indexOf("[code]");
                            let endIndex = parsed.indexOf("[/code]");

                            if (!~endIndex) {
                                parsed += "[/code]";
                                continue;
                            }

                            if (~startIndex && startIndex < endIndex) {
                                escaped += parsed.substring(0, startIndex);
                                parsed = parsed.substring(startIndex + 6);
                                codeInstances++;
                            } else {
                                escaped += parsed.substring(0, endIndex);
                                parsed = parsed.substring(endIndex + 7);
                                codeInstances--;
                            }
                        }
                    }
                    escaped += sanitizeHTML(parsed);

                    textareaData.markdownPreviewerRoot.innerHTML = escaped;
                    textareaData.markdownPreviewer.style.display = previewing ? "block" : "none";

                    textarea.tabIndex = previewing ? -1 : 0;
                    textarea.blur();
                }

                
            });

            // Hide the post button away from view and make it un-clickable so that only we can
            // click it.
            postBtn.style.position = "absolute";
            postBtn.style.opacity = 0;
            postBtn.style.pointerEvents = "none";

            section.insertBefore(prePostBtn, postBtn);
            section.insertBefore(previewBtn, prePostBtn);
        }
    }
    f();
    new MutationObserver(f).observe(document, {
        childList: true,
        subtree: true
    });

    let stylesheet = document.createElement("style");
    stylesheet.innerHTML = `
        .${CSS_PREFIX}-auto-filler,
        .${CSS_PREFIX}-macro-list {
            list-style: none;
            padding: 0 !important;
            margin: 0;
            overflow-y: auto !important;
            position: absolute !important;
            max-height: 120px;
            width: 200px;
            box-sizing: border-box;
            z-index: 1;
        }

        .${CSS_PREFIX}-auto-filler li,
        .${CSS_PREFIX}-macro-list li {
            position: relative;
            padding: 0 5px 0 10px;
            cursor: pointer;
        }

        .${CSS_PREFIX}-auto-filler li .sn-card-component_accent-bar,
        .${CSS_PREFIX}-macro-list li .sn-card-component_accent-bar {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .${CSS_PREFIX}-auto-filler li strong,
        .${CSS_PREFIX}-macro-list li strong {
            display: block;
            word-break: break-word;
        }

        .${CSS_PREFIX}-auto-filler li small,
        .${CSS_PREFIX}-macro-list li small {
            color: #777;
        }

        .${CSS_PREFIX}-auto-filler li small.${CSS_PREFIX}-desc-flex,
        .${CSS_PREFIX}-macro-list li small.${CSS_PREFIX}-desc-flex {
            display: inline-flex;
            max-width: 100%;
        }

        .${CSS_PREFIX}-auto-filler li small.${CSS_PREFIX}-desc-flex span,
        .${CSS_PREFIX}-macro-list li small.${CSS_PREFIX}-desc-flex span {
            white-space: nowrap;
            overflow: hidden;
            max-width: 100%;
            text-overflow: ellipsis;
        }

        .${CSS_PREFIX}-textarea-mirror {
            opacity: 0;
            pointer-events: none;
            position: fixed;
            top: 200vh;
            left: 200vw;
            white-space: pre-wrap;
        }

        .${CSS_PREFIX}-macro-list-container {
            position: relative;
            margin: 0 8px 0 0;
        }

        .${CSS_PREFIX}-macro-btn {
            margin: 0 !important;
        }

        .${CSS_PREFIX}-macro-list {
            right: 0;
            width: 300px !important;
        }

        .${CSS_PREFIX}-preview-btn,
        .${CSS_PREFIX}-prepost-btn,
        .${CSS_PREFIX}-macro-btn {
            vertical-align: top;
        }

        .${CSS_PREFIX}-preview-btn[data-${CSS_PREFIX}-is-previewing="true"] {
            background-color: #e6e9eb !important;
        }

        .${CSS_PREFIX}-textarea-md-preview {
            position: absolute;
            top: 0;
            left: 0;
            height: 100% !important;
            width: 100%;
            z-index: 3;
            padding: 0 !important;
        }

        :root[data-${CSS_PREFIX}-left-align-tooltip="true"] .tooltip-inner {
            text-align: left;
        }
    `;
    document.head.appendChild(stylesheet);
}();