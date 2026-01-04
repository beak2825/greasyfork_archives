// ==UserScript==
// @name         PCI Training Quick Pass
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  PCI Training Quick Pass Tool 2025 (Internal Usage Only)
// @author       Leo Bi
// @match        https://sans.contentcontroller.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/503617/PCI%20Training%20Quick%20Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/503617/PCI%20Training%20Quick%20Pass.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    function viewAnswer() {
        //console.log("clicked view answer button");

        //console.log("question title: " + $("h2#questionTitle").text());

        const question = $("h2#questionTitle").text();

        //GM_log("Question: " + question);

        if(answerMap.has(question)) {
            const answer = answerMap.get(question);

            GM_log("answer: " + answer);

            $("span.answerText").each(function() {
                if($(this).text() == answer) {
                    $(this).css("background-color","green");
                }
            });
        } else {
            $("span.answerText").each(function() {
                if($(this).parent().find("input").is(':checked')) {
                    console.log('answerMap.set("' + question + '", "' + $(this).text() + '");');
                }
            });

        }
    }

    // append button
    let div = document.createElement("div");
    div.className = "myPlaceholder"
    div.innerHTML='<span id="answerSpan"></span> <input type="button" id="myViewAnswerButton" name="myViewAnswerButton" style="color: green;" value="View Answer"/>';
    $("div.panel-heading").append(div);

    $("#myViewAnswerButton").on('click',function(e){
        viewAnswer();
    });


    // put questions & answers here
    let answerMap = new Map();


    // TDF Defense In Depth - Quiz
    answerMap.set("The defense in depth principle requires IT teams to provide not only preventative controls, but which additional type of security controls?", "Detective controls");
    answerMap.set("When following the defense in depth design principle, what must IT teams assume an individual security control will do?", "Fail and allow some attacks");
    answerMap.set("Consider the following defensive techniques. Which one was added as a layer of defense to protect the fictional social networking website?", "Output encoding");
    answerMap.set("When following the defense in depth design principle, what must IT teams assume an individual security control will do?", "Fail and allow some attacks");
    answerMap.set("What single layer of defense was bypassed in the fictional social networking website?", "Blacklist cross-site scripting filter");
    answerMap.set("When following the defense in depth design principle, what should be done to account for situations where an attacker discovers a way to circumvent a single layer of defense?", "Add multiple layers of defense between the attacker and target");

    // TDF Separation of Concerns - Quiz
    answerMap.set("Which of the following statements follows the separation of concerns design principle?", "A development team creates a standalone database service which can be called by multiple applications");
    answerMap.set("What vulnerability discovered during the security audit of the Cloud-based file storage application violated the separation of concerns design principle?", "The user and administrative interfaces were deployed together on a public access server");
    answerMap.set("What is the term used to describe the interdependence between software components?", "Coupling");
    answerMap.set("In cases where two modules have a large amount of interactions, what should be done to reduce complexity?", "Create a wrapper to broker the interactions between the modules");
    answerMap.set("How did the Cloud-based file storage application use the separation of concerns principle to fix its vulnerability?", "The administrative interface was extracted from the user interface and placed on a VPN-accessible network");


    // TDF Single Responsibility - Quiz
    answerMap.set("What should be done to components with multiple responsibilities?", "Break the components up into smaller, individual responsibilities");
    answerMap.set("Which of the following statements follows the single responsibility design principle?", "A new module is created, separating authentication checks from access control checks");
    answerMap.set("In the human resource application, how was the single responsibility design principle applied to fix the annual review access vulnerability?", "Access control checks were removed from UI pages and added to a new component that could be called by the UI pages");
    answerMap.set("Which of the following is a benefit of the single responsibility design principle", "Code reusability");
    answerMap.set("In the human resources application, how was the single responsibility design principle violated, leading to a vulnerability?", "The user view data screen was combined with annual review data access, resulting in complex access control checks that were not implemented properly");


    // TDF Least Knowledge - Quiz
    answerMap.set("Failing to follow the design principle of least knowledge created what kind of vulnerability in the medical advice website?", "Information leakage");
    answerMap.set("What is a benefit for an application that follows the design principle of least knowledge?", "The application is more adaptable to change");
    answerMap.set("How did the medical advice website fix its information leakage vulnerability?", "The direct access to the owner object was removed from the account object");
    answerMap.set("Consider the following statements. Which one follows the design principle of least knowledge?", "A UI page makes a call to the application’s business tier to request user data stored in the database");
	// 2025-10-17
	answerMap.set("Which of the following items are allowed to be accessed by an object according to the design principle of least knowledge?", "Parameters passed into the object’s methods");


    // TDF Don't Repeat Yourself - Quiz
    answerMap.set("Consider the following statements. Which one follows the don’t repeat yourself design principle?", "A web service is created to allow multiple applications to access a user database");
    answerMap.set("What does the don’t repeat yourself design principle state?", "Every piece of knowledge must have a single, unambiguous representation within a system");
    answerMap.set("In the DaaS provider example, how did failing to follow the don’t repeat yourself design principle allow the testing team to exploit the global sales data feed and access all users in the database?", "The global sales development team provided an insecure customization of the shared authentication source code");
    answerMap.set("What is the term for the improper duplication and re-use of code?", "Clone and modify programming");
    answerMap.set("In the DaaS provider example, how was the global sales data feed login vulnerability exposure resolved?", "A centralized authentication service was created to provide single sign-on capabilities");



    // Agile Development - Quiz
    answerMap.set("In a secure Agile lifecycle, how often should static analysis results be reviewed by members of the development team?", "Each sprint, when source code is committed to the source control repository.");
    answerMap.set("Which of the following project team members should create or modify high-risk libraries that perform authentication, password management and encryption? ", "Experienced developers with security knowledge");
    answerMap.set("Iteration Zero allows for which of the following security-specific tasks to be completed?", "Reviewing the framework's security features and libraries");
    answerMap.set("How does the Agile model correct the communication gap between the customer and the project team that is commonly encountered when using traditional SDLC models?", "The customer and project team review the software after each short sprint.");
    answerMap.set("How can security adapt to each short sprint without slowing down the development team?", "Implement continuous security through integration and monitoring");

    // DevOps - Quiz
    answerMap.set("Which of the following is a security concern when using a continuous deployment framework, which automates deployments into the production environment?", "Continuous deployment may violate some regulatory compliance laws.");
    answerMap.set("In a DevOps process, how can security experts assess the security of an application when the environment changes frequently?", "Completing automated, system-wide security testing before code is allowed to move between each environment");
    answerMap.set("What important Secure DevOps process should be implemented to provide real-time monitoring and reporting to the project team, which helps identify attacks or problems that may be occurring?", "Continuous Feedback");
    answerMap.set("What security-specific issue does DevOps try to address by streamlining the deployment and release phases of the development lifecycle?", "Enabling development teams to react quickly to security incidents");



    // Broken Access Control - Quiz
    answerMap.set("Which of the following is a solution to help address access control issues?", "Centralized authentication and authorization function");
    answerMap.set("Which of the following best describes the concept of access control?", "Roles that given users have and their levels of permission to the resources being requested")
    answerMap.set("Which of the following may occur if access control fails?", "Unwanted data modification or destruction, unauthorized information disclosure, or unintended business functions being performed");
    answerMap.set("Which of the following parts of the URL www.example.org/prod/admin-portal?perm=admin shows an example of broken access control?", "perm=admin");
    answerMap.set("What is a common characteristic of broken access control?", "Users can read or modify data that they should not be able to access.");
	// 2025-10-17
	answerMap.set("What does a deny-by-default posture in access control mean?", "Access to resources is explicitly granted rather than implicitly allowed.");
	answerMap.set("What does it mean to enforce record ownership?", "Permissions are set so that a user can only perform tasks on the record associated with their own user ID rather than allowing the user to perform tasks on any records.");
	answerMap.set("What is a significant risk associated with lateral movement in a compromised system?", "Unauthorized access to additional services and sensitive data.");


    // Cryptographic Failures - Quiz
    answerMap.set("Which change introduced in 2021 affects the default communications of popular internet browsers?", "Most popular internet browsers now default communications to HTTPS instead of HTTP.");
    answerMap.set("Which of the following statements is true?", "Encryption should be employed at every point in the communication channel.");
    answerMap.set("Which of the following is the best way to ensure that client requests to an application are always encrypted?", "Enable HTTP Strict Transport Security (HSTS) Policy");
    answerMap.set("Which types of communications should be encrypted?", "Web, WAF, server, database, function, storage container, and API");
    answerMap.set("Which of the following topics are included in the OWASP category \"Cryptographic Failures\"?", "Data encryption, password hashing algorithms, and tokenization");
	// 2025-10-17
    answerMap.set("What is the process of guessing a password, hashing it, and comparing the resulting password hash with the legitimate password hash known as?", "Password cracking");
    answerMap.set("In which of the following situations should encryption be invoked?", "In transit and at rest");
    answerMap.set("What is a key reason for implementing rotation policies for encryption keys?", "To minimize the risk of key compromise over time");


    // Injection - Quiz
    answerMap.set("Which of the following best describes an injection attack?", "Malicious, specially crafted input is submitted into the application or its layer(s)");
    answerMap.set("Which of the following are commonly targeted for injection attacks?", "SQL and NoSQL attack strings; system commands for code injection attacks; scripting languages for XSS");
    answerMap.set("How would input filtering be used as a defense strategy against injection attacks?", "Validate all incoming data and ensure that all input submitted to the application is pre-processed and rendered benign before it is used for any type of queries, code execution, further processing, or decision-making.");
    answerMap.set("What should you understand about your application's attack surface in order to determine whether it is vulnerable to injection attack?", "How and where data will enter the system and be processed within your application");
	// 2025-10-17
    answerMap.set("Which of the following is an example of an injection vector?", "User-supplied input through HTML form fields.");
    answerMap.set("Which of the following is an example of a layered security approach being used to prevent injection vulnerabilities in an application?", "A web application firewall (WAF) coupled with a secured API, complemented with regular expressions");
    answerMap.set("What does it mean to \"inject\" into an application?", "To submit malicious, specially crafted input into the application or any of its layers");
    answerMap.set("Which of the following represents a key aspect of securely handling authentication tokens like JWT?", "All claims within the token should be validated before processing.");
    answerMap.set("What type of injection attack primarily targets databases like Couchbase?", "NoSQL injection.");


    // Insecure Design - Quiz
    answerMap.set("Which of the following describes the process of threat modeling?", "A means by which logical attack scenarios are thought through from the lens of a motivated adversary.");
    answerMap.set("Why is it risky to allow anonymous visitors to initiate the password reset process in an application?", "If anonymous visitors can initiate the password reset process and confirm whether a user exists in the database, they can essentially \"trick\" the application into confirming valid user accounts.");
    answerMap.set("Which design feature is recommended as part of the user registration process?", "Requiring two-factor authentication");
    answerMap.set("At what point in the Software Development Life Cycle (SDLC) should security controls be established?", "Security controls should be established from the very beginning planning phases.");
    answerMap.set("Why is it useful to map data flows?", "Understanding the flow of data within our environment can lead to identifying gaps in security controls.");
	// 2025-11-12
    answerMap.set("Which of the following solutions could potentially be used to account for an attack scenario on an airline ticket purchasing website at the point in the transaction where flight seats are selected and placed into a state of no longer being available for other passengers to purchase but also not yet purchased by the visitor?", "Devising anti-bot technology, enforcing only authenticated and validated user sessions, and using CAPTCHA prior to authentication");
    answerMap.set("What is the advantage of leveraging plausibility checks and range checks within the example airline ticket purchase application?", "Leveraging plausibility checks and range checks will help gauge the validity of requests to the application.");
    answerMap.set("What is the main purpose of threat modeling in secure design?", "To identify potential threats and vulnerabilities from an attacker's perspective before development.");


    // Security Misconfiguration - Quiz
    answerMap.set("Which of the following aspects do we need to be aware of regarding security misconfiguration vulnerabilities across the spectrum?", "Codebase, secure coding principles, webserver settings, CMS configuration, firewall rules, cloud-based service implementation, and operating system patching and hardening");
    answerMap.set("Which of the following represents an example of using the SecDevOps CI/CD pipeline to check for and address security misconfigurations?", "Leveraging Nmap to scan the application to ascertain what ports are listening or exposed to the internet, then utilizing resources from all involved teams to address and rectify identified weaknesses");
    answerMap.set("Why are web application security misconfigurations a significant security concern?", "Security misconfigurations create the potential for the application or user session to be completely compromised.");
    answerMap.set("Which of the following flaws would be considered security misconfigurations?", "Missing security headers, lack of network segmentation or isolation, unnecessary services or functionality being enabled, lack of system or stack hardening, poor patch management, and default account settings");
    answerMap.set("Which of the following represents an effective approach to dealing with security misconfigurations?", "Implementing a SecDevOps CI/CD pipeline");
	// 2025-11-12
    answerMap.set("Why is it important to manually perform penetration testing?", "Penetration testing can illuminate the true risk a given vulnerability poses, since automated scanning can result in false positives or negatives and may fail to contextualize a weakness or account for compensating controls. Both methods should be used.");
    answerMap.set("What is a key benefit of implementing secure defaults in application security?", "Reduces the risk of misconfigurations leading to vulnerabilities");
    answerMap.set("What is the primary goal of patch management in cybersecurity?", "To address vulnerabilities in software and systems");


    // Vulnerable and Outdated Components - Quiz
    answerMap.set("Which of the following is the correct definition of the term component?", "The pieces of code and interworking software that collectively make up a web application");
    answerMap.set("Which of the following actions should automatically be taken regarding vulnerable and outdated components?", "Patch known issues, update our dependencies, and establish a process to make ourselves aware of published weaknesses in our components");
    answerMap.set("Which of the following correctly describes a web application firewall (WAF)?", "A WAF is designed specifically to inspect incoming traffic and block malicious payloads before those payloads make it to the application.");
    answerMap.set("Why would a virtual patch be used on a flawed component?", "A virtual patch buys us time by allowing us to block known exploit code at the web application firewall (WAF), even though the components comprising our application may still be vulnerable to the exploit.");
    answerMap.set("How is it possible to be prepared for an unknown threat or vulnerability in a component?", "We should design and implement multiple layers of security, so we have other controls in place to mitigate the threat in the event that one of those layers is compromised.");
	// 2025-11-12
    answerMap.set("In an example application comprised of custom code in conjunction with internally facing third-party libraries and client-facing third-party JavaScript, which of the following statements is true?", "The third-party code needs to be continuously vetted, updated, and scanned to ensure that as vulnerabilities are identified, flaws are addressed.");
    answerMap.set("Why is it important to use more than one scanning tool when scanning components?", "Scanning tools are not always completely accurate and no one tool adequately scans all components for vulnerabilities.");
    answerMap.set("What is a key benefit of implementing effective security patching practices?", "Reducing the risk of exploitation by known vulnerabilities.");


    // Identification and Authentication Failures - Quiz
    answerMap.set("Which of the following best describes the account enumeration weakness?", "It allows an adversary to use the functionality of the application to confirm the existence of an arbitrary user within the application's system of record.");
    answerMap.set("Which of the following factors contribute to the prevalence of identification and authentication failures in applications?", "It is difficult to develop a robust identity and authentication solution that is both hardened against attack and user-friendly.");
    answerMap.set("What are the three potential vulnerabilities associated with the account creation process if users are allowed to create their own accounts?", "Account enumeration, weak passwords, and injection");
    answerMap.set("Which of the following error messages presents the basis of the account enumeration flaw?", "\"Sorry, the email address you provided already exists.\"");
	// 2025-11-12
    answerMap.set("What is out-of-band verification best used for?", "To provide additional security during the authentication process.");
	answerMap.set("Which of the following is recommended when using password-less authentication methods such as biometrics?", "At least two separate factors should be used to validate the identity of a given user and the process should be implemented with security as the top priority.");
	answerMap.set("Which of the following vulnerabilities may occur if a user forgets to log out of an application and the application does not automatically time out their session?", "The same authenticated session can be used by anyone with access to the browser, whether it's the legitimate user or another individual.");


    // Software and Data Integrity Failures - Quiz
    answerMap.set("What is one method to conduct a basic software integrity check?", "Check the hashing algorithm by utilizing a tool such as the MD5 Utility; the hash value returned by the tool should match the hash value communicated by the vendor.");
    answerMap.set("Which of the following represents a potential solution to lacking trust with third-party components?", "Evaluate third-party software, host it locally, and proceed with this process as updates to the code are made.");
    answerMap.set("How does the use of digital signatures help ensure that only trusted code is introduced into our build process?", "A digital signature is a cryptographically sound mechanism we can rely on to validate the integrity of a given component.");
    answerMap.set("Why is it important to verify the integrity of each software component as part of our build process?", "Verifying the integrity of each component will help to ensure that we are not inadvertently incorporating malicious software into our application.");
	// 2025-11-12
	answerMap.set("How does the concept of mandatory code reviews contribute to software integrity?", "It ensures that multiple trusted individuals assess the code for vulnerabilities.");
    answerMap.set("Which of the following are examples of weaknesses included in the Software and Data Integrity Failures category of the OWASP Top Ten List?", "Relying on Content Delivery Networks (CDNs) to deliver content to users, relying on untrusted or unvetted modules and libraries, and failing to verify the integrity of serialized data");
    answerMap.set("Which process should be followed to better vet the security of code used in our applications?", "Validate components based on the vendor-provided hash, in order to confirm that the code we have obtained matches the code the vendor has released.");
    answerMap.set("Which of the following security features allows us to specify the hash of a given JavaScript file or stylesheet within our application's HTML and validate that the fetched resource matches what we have specified?", "Sub resource integrity checking");
    answerMap.set("What role does static code analysis play in maintaining software integrity?", "It helps detect potential vulnerabilities before the code is executed.");



    // Security Logging and Monitoring Failures - Quiz
    answerMap.set("Which statement accurately describes the events custom logging should focus on?", "Custom logging should focus on events deemed important from a security perspective.");
    answerMap.set("Which of the following systems must be in place along with custom logging?", "Monitoring and alerting");
    answerMap.set("Which of the following best describes how effective logging and monitoring defends the organization?", "It creates the potential for us to detect misuse and abuse early.");
    answerMap.set("Which of the following best defines the term \"log\"?", "Logs are typically text-based entries appended to a file and then stored on a system for retrieval or for local access.");
	// 2025-11-12
    answerMap.set("Which system is often used for aggregating logs and detecting potential threats?", "Security Information and Event Management (SIEM) system.");
    answerMap.set("What is a key component of effective security logging?", "Capturing context-rich security events.");
    answerMap.set("Why is a runbook needed to provide guidance to applicable teams on how to handle detected threats to an application?", "There is often a gap between generating a log of an event, this event being of security importance, and human action being taken based on the context of the event.");


    // Server-Side Request Forgery (SSRF) - Quiz
    answerMap.set("Why would it be beneficial to disable support for unnecessary services and schemes in our application?", "HTTP is not the only protocol that can be invoked in an attack scenario.");
    answerMap.set("Which of the following are network-layer security controls that can protect against SSRF attacks?", "Firewalls, access control lists, segmentation, and alerting capabilities");
    answerMap.set("How is a Server-Side Request Forgery (SSRF) attack able to trick a web application server?", "The underlying server makes a request via an application layer vulnerability to an arbitrary resource, and the source of the request appears as if it came from the server it should have come from.");
    answerMap.set("Why was Server-Side Request Forgery (SSRF) added to the 2021 OWASP Top 10 List?", "Community feedback indicated that SSRF has been gaining traction as both a tool for adversaries and a threat for defenders.");
	// 2025-11-12
    answerMap.set("Which of the following are additional recommended defense strategies against SSRF attacks?", "Network segmentation and traffic isolation");
    answerMap.set("Why is it important to follow the principle of least privilege with cloud-based applications and functions?", "With the tight integration of the underlying cloud service provider's API, the risk of exposure is significant, so the services, IAM accounts, and functional access levels defined by roles must be carefully scrutinized.");
    answerMap.set("Which of the following may result in an application becoming vulnerable to server-side request forgery (SSRF) attacks?", "User input is not properly sanitized and validated and then is used in fetching a remote resource.");


    // Memory Inspection - Quiz
    answerMap.set("What memory inspection defense does a mutable object type, such as a character array, provide to development teams?", "Mutable objects allow their values to be destroyed ");
    answerMap.set("What is the first step towards reducing the risk of memory inspection?", "Avoid handling sensitive information whenever possible");
    answerMap.set("Which of the following options can be used to protect symmetric encryption keys from memory inspection issues?", "Storing keys in a location separate from the data being protected");
    answerMap.set("Which of the following options can prevent malware from inspecting sensitive data in memory?", "Using object types that encrypt sensitive values in memory");


    // Buffer Overflow - Quiz
    answerMap.set("What operating system based buffer overflow defense places code and application data into separate memory locations? ", "Data Execution Prevention (DEP)");
    answerMap.set("If your application encounters input data that is too large for its destination buffer, which of the following defenses can be used to prevent buffer overflow?", "Validate the input data fits into the destination buffer");
    answerMap.set("What operating system based buffer overflow defense makes it difficult for an attacker to predict where malicious code will be placed into the memory stack?", "Address Space Layout Randomization (ASLR)");
    answerMap.set("Buffer overflow vulnerabilities are commonly found in applications that perform which of the following responsibilities? ", "Memory management");



    // Improper Error Handling - Quiz
    answerMap.set("Which of the following keywords allow development teams to automatically close resources when they are no longer needed?", "using");
    answerMap.set("Adding multiple exception-handling blocks to critical sections of code can provide what benefit to the development team?", "Exception details are kept as close to their source as possible");
    answerMap.set("Applications that show users a stack trace or exception message are vulnerable to which of the following issues?", "Missing error handling");
    answerMap.set("Sections of code that do not use exception handling blocks, such as try-catch, to trap and log errors are vulnerable to which of the following improper error handling issues?", "Uncaught exceptions");
	// 2025-11-12
    answerMap.set("Sections of code that do not use finally statements to handle unexpected error conditions are vulnerable to which of the following issues?", "Unreleased resources");


    // Cross Site Request Forgery - Quiz
    answerMap.set("CSRF attacks:", "May occur without the user ever realizing it, as a result of hidden frames or image tags.");
    answerMap.set("Which of the following is a possible method for protecting against CSRF attacks?", "Require that the user reauthenticate before allowing any significant action to be processed.");
    answerMap.set("Which of the following is a possible method for protecting against CSRF attacks?", "Including a random token specifically for CSRF protection in every request. ");
	// 2025-11-12
    answerMap.set("CSRF is also referred to as:", "Confused Deputy.");
    answerMap.set("Which of the following is a possible method for protecting against CSRF attacks?", "Require that the user reauthenticate before allowing any significant action to be processed.");



    // Unvalidated Redirects and Forwards - Quiz
    answerMap.set("If our application implements a redirect function it is important to:", "Ensure that the function will only redirect users to specific URLs.");
    answerMap.set("What is the best way to avoid unvalidated forward and redirect issues?", "Don’t use them.");
    answerMap.set("Which of the following is a primary reason for the use of a redirect or forward function in an application?", "The application has evolved over time and resources have moved to new locations within the site.");
    answerMap.set("Since unvalidated redirects and forwards rarely results in ______________________, some organizations fail to address the problem.", "A direct compromise of the application itself.");
	// 2025-11-12
    answerMap.set("One of the main ways that unvalidated redirects and forwards can be used against our users is:", "Social engineering and phishing attacks.");


})(jQuery);