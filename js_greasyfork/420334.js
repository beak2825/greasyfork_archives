// ==UserScript==
// @name        qwiklabs.com - Remove repetitive setup instructions and copyright
// @namespace   gerrywastaken
// @match       https://*.qwiklabs.com/focuses/*
// @grant       none
// @version     1.0
// @author      Gerry
// @description Every lab repeats the same setup instructions and copyright info and what's worse is that it hides unique info within all the clutter. This script attempts to remove the repeating instructions and keeps the unique things.
// @downloadURL https://update.greasyfork.org/scripts/420334/qwiklabscom%20-%20Remove%20repetitive%20setup%20instructions%20and%20copyright.user.js
// @updateURL https://update.greasyfork.org/scripts/420334/qwiklabscom%20-%20Remove%20repetitive%20setup%20instructions%20and%20copyright.meta.js
// ==/UserScript==

var labs = document.getElementById('markdown-lab-instructions').innerHTML

// Make the setup section selectable
labs = labs.replace(/(<h2 id="step\d">Setup and Requirements<\/h2>)/g,'<div id="setup">$1').replace(/(<h2 id="step\d">Setup<\/h2>)/g,'<div id="setup">$1').replace(/gcloud command-line tool overview<\/a>.\n\n<\/aside>/g, 'gcloud command-line tool overview<\/a>.\n\n<\/aside></div>')

// Make training section selectable
labs = labs.replace(/<h3>Google Cloud Training &amp; Certification/g,'<div id="training"><h3>Google Cloud Training &amp; Certification').replace(/trademarks of the respective companies with which they are associated.<\/p>/g, 'trademarks of the respective companies with which they are associated.<\/p></div>')

document.getElementById('markdown-lab-instructions').innerHTML = labs


// document.querySelector("#setup").setAttribute('style', 'display:none;');
document.querySelector("#training").setAttribute('style', 'display:none;');


var setupContent = document.querySelector('#setup').innerText;

var shitContent = `Setup and Requirements
Qwiklabs setup
Before you click the Start Lab button

Read these instructions. Labs are timed and you cannot pause them. The timer, which starts when you click Start Lab, shows how long Google Cloud resources will be made available to you.

This Qwiklabs hands-on lab lets you do the lab activities yourself in a real cloud environment, not in a simulation or demo environment. It does so by giving you new, temporary credentials that you use to sign in and access Google Cloud for the duration of the lab.

What you need

To complete this lab, you need:

Access to a standard internet browser (Chrome browser recommended).
Time to complete the lab.

Note: If you already have your own personal Google Cloud account or project, do not use it for this lab.

Note: If you are using a Pixelbook please open an Incognito window to run this lab.
Note: If you are using a Pixelbook, open an Incognito window to run this lab

Google Cloud Platform Console
How to start your lab and sign in to the Google Cloud Console

Click the Start Lab button. If you need to pay for the lab, a pop-up opens for you to select your payment method. On the left is a panel populated with the temporary credentials that you must use for this lab.

Copy the username, and then click Open Google Console. The lab spins up resources, and then opens another tab that shows the Sign in page.

Tip: Open the tabs in separate windows, side-by-side.

If you see the Choose an account page, click Use Another Account. 

In the Sign in page, paste the username that you copied from the Connection Details panel. Then copy and paste the password.

Important: You must use the credentials from the Connection Details panel. Do not use your Qwiklabs credentials. If you have your own Google Cloud account, do not use it for this lab (avoids incurring charges).

Click through the subsequent pages:

Accept the terms and conditions.
Do not add recovery options or two-factor authentication (because this is a temporary account).
Do not sign up for free trials.

After a few moments, the Cloud Console opens in this tab.

Note: You can view the menu with a list of Google Cloud Products and Services by clicking the Navigation menu at the top-left. 
Activate Google Cloud Shell

Google Cloud Shell is a virtual machine that is loaded with development tools. It offers a persistent 5GB home directory and runs on the Google Cloud. Google Cloud Shell provides command-line access to your Google Cloud resources.

In the Google Cloud Console, on the top right toolbar, click the Activate Cloud Shell button.

Click Continue. 

It takes a few moments to provision and connect to the environment. When you are connected, you are already authenticated, and the project is set to your PROJECT_ID. For example:

gcloud is the command-line tool for Google Cloud. It comes pre-installed on Cloud Shell and supports tab-completion.

You can list the active account name with this command:

gcloud auth list

content_copy

Output:

Credentialed accounts:
 - <myaccount>@<mydomain>.com (active)
content_copy

Example output:

Credentialed accounts:
 - google1623327_student@qwiklabs.net
content_copy

You can list the project ID with this command:

gcloud config list project

content_copy

Output:

[core]
project = <project_ID>
content_copy

Example output:

[core]
project = qwiklabs-gcp-44776a13dea667a6
content_copy
For full documentation of gcloud, see gcloud command-line tool overview.


Note: If you are using a Pixelbook, open an Incognito window to run this lab.
Now that you've started your lab, you'll log in to the Google Cloud Shell console, then launch the command line tool.
Activate Cloud Shell
Cloud Shell is a virtual machine that is loaded with development tools. It offers a persistent 5GB home directory and runs on the Google Cloud. Cloud Shell provides command-line access to your Google Cloud resources.
In the Cloud Console, in the top right toolbar, click the Activate Cloud Shell button.
Click Continue.
(Output)
(Example output)
(Output)
(Example output)
For full documentation of gcloud see the gcloud command-line tool overview.
Setup`

shitContent.split("\n").forEach(function(line){
  if(line != "\n" && line != ''){
    line = line.replace('(', '\\(').replace(')', '\\)').replace('[','\\[').replace(']', '\\]');;
    let re = new RegExp("^"+line+"$","gm");
    setupContent = setupContent.replace(re, '');
  }
});

let re = new RegExp("\n\n+","gm");
setupContent = setupContent.replace(re, "\n")


document.querySelector('#setup').innerText = setupContent;

document.querySelector('#setup').innerHTML = '<h2>Setup</h2> [Redacted repeditive nonsense. Once is enough Qwiklabs!]' + document.querySelector('#setup').innerHTML