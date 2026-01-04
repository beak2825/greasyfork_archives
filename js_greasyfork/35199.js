// ==UserScript==
// @name           EMBT Add TS-Tickets Link
// @namespace      embarcadero.com
// @include        https://cs*.salesforce.com*
// @include        https://na*.salesforce.com/*
// @include        http://vmsfjira:8665/*
// @description	Script for Salesforce
// @grant       GM.log
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlhttpRequest
// @grant       GM.getValue
// @grant       GM.xmlhttpRequest
// @grant 			GM.setValue
// @version 0.0.1.20171115195659
// @downloadURL https://update.greasyfork.org/scripts/35199/EMBT%20Add%20TS-Tickets%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/35199/EMBT%20Add%20TS-Tickets%20Link.meta.js
// ==/UserScript==

//Updates
//12/16/2010	Changed Jira button so it loads 'Create Issue' page in Jira.  Also some fields automatically prefilled in Jira.	
//12/21/2010	Added TS-Tickets links to Inbound Email Message page.
//12/21/2010	Added Live Meeting button.
//12/22/2010	Added links for attachments so they are near top of Inbound Email GM.setValueMessage page.
//01/05/2011	Added FTP button to Send An Email page.
//01/07/2011	Added Advanced Search link below 'Back to List: Cases' link.
//
//01/11/2011	When a template called ERTECH is chosen, adds ertech@embarcadero.com; myemailaddress@embarcadero.com 
//		to the Additional To field.  Also, clears the 'To:' field so it's blank.
//
//01/12/2011	Modified script from http://userscripts.org/scripts/show/5858.  
//		This script brings up a quick look up on highlighted text
//01/14/2010	When ERTECH template is loaded, TS-Tickets file location is added to body of email.		

var myArea1st = document.createElement("text");
var myLink2nd = document.createElement("table");

var myAttachment = document.createElement("table");
myAttachment.setAttribute('class', 'list');
myAttachment.setAttribute('cellspacing', '0');
myAttachment.setAttribute('cellpadding', '0');
myAttachment.setAttribute('border', '0');

myLink2nd.setAttribute('class', 'detailList');
myLink2nd.setAttribute('cellspacing', '0');
myLink2nd.setAttribute('cellpadding', '0');
myLink2nd.setAttribute('border', '0');

var myEmailLink = document.createElement("table");
myEmailLink.setAttribute('class', 'detailList');
myEmailLink.setAttribute('cellspacing', '0');
myEmailLink.setAttribute('cellpadding', '0');
myEmailLink.setAttribute('border', '0');

var myLink2ndb = document.createElement("a");
var myCell = document.createElement("td");

var myTH = document.createElement("th");
var myTH2;
var isChecked = '';
myTH.setAttribute('class', '');
myTH.setAttribute('scope', 'col');

var jiraArray = new Array();

var HIDDEN_DIV_ID = 'embtdiv';

var caseHistoryLocation;


//TO DO:
//Create "permalink" for each comment.
//Add new folder creation link on new case page.
//Add link to Sanctuary for serial numbers and license numbers.
//Add customer email links that go directly to Sanctuary
//Notes for each company
//Description field too large
//Customize Advanced Searches
//Add Subject change suggestions when Subject is 'New General case'

/*
//Add Subject change suggestion

var tdLocation = document.evaluate("//td[@id='cas14_ilecell']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

tdLocation = tdLocation.snapshotItem(0);

newTDLocation = document.createElement("td");
newTDLocation.setAttribute('class', 'dataCol col02 inlineEditWrite');

//tdLocation.parentNode.replaceChild(newTDLocation, tdLocation);

var descriptionLocation = document.evaluate("//div[@id='cas15_ileinner']/text()",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

descriptionLocation = descriptionLocation.snapshotItem(0);

//descriptionLocation = descriptionLocation.textContent;

var subjectLocation = document.evaluate("//div[@id='cas14_ileinner']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var subjectText = document.evaluate("//div[@id='cas14_ileinner']/text()",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

subjectLocation = subjectLocation.snapshotItem(0);
subjectText = subjectText.snapshotItem(0);


mySubject = document.createElement("text");

//mySubject.innerHTML = '<div id="cas14_ileinner">' + descriptionLocation.nodeValue + '</div>';

mySubject.innerHTML = '<div id="cas14_ileinneredit" class="inlineEditRequiredDiv" style="display: block;"><input id="cas14" type="text" maxlength="255" size="20" value="'+descriptionLocation.nodeValue+'">';


if(subjectText.nodeValue == 'New General case'){

	//subjectLocation.parentNode.replaceChild(mySubject, subjectLocation);
}

*/
var thisURL = document.URL;


var thisURLPrefix = thisURL.substring(thisURL.indexOf('//') + 2,thisURL.indexOf('.'));


//Remove Gmail link
var gmailLinks = document.evaluate("//div[@class='gmailLink']",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

gmailLinks = gmailLinks.snapshotItem(0);
gmailLinks.innerHTML = gmailLinks.innerHTML.substring(0,gmailLinks.innerHTML.indexOf('['));


//Add Advanced Search link
var breadCrumbLocation = document.evaluate("//div[@class='ptBreadcrumb']/a",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

breadCrumbLocation = breadCrumbLocation.snapshotItem(0);

var mySearchLink = document.createElement("div");

mySearchLink.class = 'ptBreadcrumb';

mySearchLink.innerHTML = '<br>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://' + thisURLPrefix + '.salesforce.com/search/AdvancedSearch">Advanced Search</a>';

if(breadCrumbLocation != null){

	breadCrumbLocation.parentNode.insertBefore(mySearchLink,breadCrumbLocation.nextSibling);

}

//Convert serial number to upper case
//var serialNumberLocation = document.evaluate("//div[@id='00NA0000004J7uU_ileinner']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var serialNumberLocation = document.evaluate("//div[@id='00Nf0000001CJpy_ileinner']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);//idera server


serialNumberLocation = serialNumberLocation.snapshotItem(0);

if(serialNumberLocation != null){

	var serialNumberLocationText = serialNumberLocation.textContent

	var myDiv = document.createElement("div");
	//myDiv.id = '00NA0000004J7uU_ileinner'; 
	myDiv.id = '00Nf0000001CJpy_ileinner'; //idera server

	myDiv.innerHTML = serialNumberLocationText.toUpperCase();
	


	serialNumberLocation.parentNode.replaceChild(myDiv,serialNumberLocation);
}



//Preload favorite template when ET SEND EMAIL button is clicked.


var myToolBar = window.toolbar.visible;





//Add FTP button to Send An Email page.
var cancelLocation;
var myFTPButton;

var cancelLocations = document.evaluate("//input[@onclick='cancelForm();']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i < cancelLocations.snapshotLength;i++)
{

	cancelLocation = cancelLocations.snapshotItem(i);

	myFTPButton = document.createElement("input");
	myFTPButton.type = 'button';

	myFTPButton.setAttribute('onclick', 'openIntegration(\'http://etukftp01.embarcadero.com/eftadhoc/\', \'height=600,location=no,resizable=yes,toolbar=no,status=no,menubar=no,scrollbars=1\', 1)');
	myFTPButton.name = "file_attachment_system";
	myFTPButton.title = "File Attachment System";
	myFTPButton.value = "File Attachment System";
	myFTPButton.setAttribute('class', 'btn');	

	//cancelLocation.parentNode.insertBefore(myFTPButton,cancelLocation.nextSibling);

}

//Add NetMeeting button disabled
var caseHistoryLocations = document.evaluate("//input[@value='Case History']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i < caseHistoryLocations.snapshotLength;i++)
{

	caseHistoryLocation = caseHistoryLocations.snapshotItem(i);

	myNetMeetingButton = document.createElement("input");
	myNetMeetingButton.type = 'button';
	myNetMeetingButton.setAttribute('onclick', 'openIntegration(\'https://www.livemeeting.com/cc/embarcadero/loginPage\', \'height=600,location=no,resizable=yes,toolbar=yes,status=no,menubar=no,scrollbars=1\', 1)');
	myNetMeetingButton.name = "live_meeting";
	myNetMeetingButton.title = "Live Meeting";
	myNetMeetingButton.value = "Live Meeting";
	myNetMeetingButton.setAttribute('class', 'btn');	

	//caseHistoryLocation.parentNode.insertBefore(myNetMeetingButton,caseHistoryLocation.nextSibling);	



}

//Inbound Email Page
var inboundEmailTitles = document.evaluate("//div[@class='content']/h1[text()='Inbound Email Message']/text()",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var inboundEmailTitle = inboundEmailTitles.snapshotItem(0);


if(inboundEmailTitle != null){

	
	var inboundEmailCases = document.evaluate("//td[@class='dataCol col02']/a/@href",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var inboundEmailCase = inboundEmailCases.snapshotItem(0);

	var inboundEmailCaseNumbers = document.evaluate("//td[@class='dataCol col02']/a/text()",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var inboundEmailCaseNumber = inboundEmailCaseNumbers.snapshotItem(0);

	var createdDates = document.evaluate("//td[@class='dataCol col02']/text()",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	var createdDateEmail = createdDates.snapshotItem(0);
 
	if(createdDateEmail != null){

		createdDateEmail = createdDateEmail.nodeValue;
		createdDateEmail = createdDateEmail.slice(createdDateEmail.lastIndexOf('/'),createdDateEmail.indexOf(" "));
	}
	else
	{
		createdDateEmail = '';
	}	



	var inboundEmailCaseURL = "https://" + window.location.hostname + inboundEmailCase.nodeValue;

GM.xmlhttpRequest({
    method: 'GET',
    url: inboundEmailCaseURL ,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload:function(details) {
           var s2 = new String(details.responseText);
	   var document = appendToDocument2(s2);
	   s2 = s2.replace(/\r\n/g,'');

	   s2 = s2.substring(s2.indexOf('<div id="00NA0000004J7uS_ileinner">'),s2.indexOf('</div></td><td class="labelCol"><span class="helpButton" id="Case.00NA0000004J7uP-_help">'));
	   //s2 = Product name
	   s2 = s2.substring(s2.indexOf('>')+1); 

if(s2 == "DT/Studio"){

	s2 = s2.replace("/","");

}
else if(s2 == "ER/STUDIO"){

	s2 = s2.replace("/"," ");

}
else if(s2 == "ER/Studio"){

	s2 = s2.replace("/"," ");

}
else if(s2 == "ER/Studio Data Architect"){

	s2 = "ER Studio";

}
else if(s2 == "ER/Studio Portal"){

	s2 = "ERPortal";

}
else if(s2 == "DBArtisan"){

	s2 = "DBArtisan";

}
else if(s2 == "Rapid SQL"){

	s2 = "Rapid SQL";

}
else if(s2 == "Repo"){

	s2 = "ER Studio";

}




	var emailLinkLocations = document.evaluate("//table[@class='detailList']",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	var emailLinkLocation = emailLinkLocations.snapshotItem(0);	 

	//myEmailLink.innerHTML = "<br><tr><td class='labelCol'>Open Folder: </td><td class='dataCol'>" + "<a href=\"file://///etsfnas04/TS-Tickets" + createdDateEmail + "/" + s2 + "/" + inboundEmailCaseNumber.nodeValue + "\">"+ "\\\\etsfnas04\\TS-Tickets" + createdDateEmail.replace("/","\\") + "\\" + s2 + "\\" + inboundEmailCaseNumber.nodeValue + "</td><td class='labelCol'>Create Folder: </td><td class='dataCol'><a href=\"file://///etsfnas04/TS-Tickets" + createdDateEmail + "/" + s2 + "\">" + "\\\\etsfnas04\\TS-Tickets" + createdDateEmail.replace("/","\\") + "\\" + s2 + "\\" + '<input onMouseover="this.select()" style="text-align: center" class="border: none;overflow: hidden;" size="7" value="'+ inboundEmailCaseNumber.nodeValue + '" type="text" WRAP=OFF  />' + "</td></tr>";
	
	myEmailLink.innerHTML = "<br><tr><td class='labelCol'>Open Folder: </td><td class='dataCol'>" + "<a href=\"file://///S:/TechSupport" + createdDateEmail + "/" + s2 + "/" + inboundEmailCaseNumber.nodeValue + "\">"+ "\S:\\TechSupport" + createdDateEmail.replace("/","\\") + "\\" + s2 + "\\" + inboundEmailCaseNumber.nodeValue + "</td><td class='labelCol'>Create Folder: </td><td class='dataCol'><a href=\"file://///S:/TechSupport" + createdDateEmail + "/" + s2 + "\">" + "\S:\\TechSupport" + createdDateEmail.replace("/","\\") + "\\" + s2 + "\\" + '<input onMouseover="this.select()" style="text-align: center" class="border: none;overflow: hidden;" size="7" value="'+ inboundEmailCaseNumber.nodeValue + '" type="text" WRAP=OFF  />' + "</td></tr>";	

	emailLinkLocation.parentNode.insertBefore(myEmailLink,emailLinkLocation.nextSibling);	

	//Move attachments to top
	var attachmentLinkLocations = document.evaluate("//div[@class='listHoverLinks']",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	var attachmentLinkLocation = attachmentLinkLocations.snapshotItem(0);	
		
	var attachmentLocations = document.evaluate("//table[@class='list']",
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);	

	var attachmentLocation = attachmentLocations.snapshotItem(0);


	myAttachment.innerHTML = attachmentLocation.innerHTML+'<br>';

	//Comment out this line to disable this change.
	attachmentLinkLocation.parentNode.insertBefore(myAttachment,attachmentLinkLocation.nextSibling);



    }
});




	

}//if(inboundEmailTitle != null){








//Comment out for folks who aren't doing ER/Studio
//While Jira is current page.

setTimeout( delay, 5000);


function delay(){

//console.log(thisURL);
}


if(thisURL.indexOf('http://vmsfjira:8665/secure/') != -1){



}

//if(thisURL.indexOf('http://vmsfjira:8665/secure/') != -1 && myToolBar == false){
if(thisURL.indexOf('http://vmsfjira:8665/secure/') != -1){

	var d = GM.getValue("Jira");
	if (d != "") jiraArray = d.split("*");

	if(jiraArray[0] == 'ER Studio'){

		jiraArray[0] = 'ER/Studio Data Architect';

	}

console.log(d);


//preselect project dropdown with product name
var optionValue0 = document.evaluate("//td/select/option[text()='" + jiraArray[0] + "']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
optionValue0 = optionValue0.snapshotItem(0);

if(optionValue0)
	optionValue0.selected=true

//Fill out Summary with SalesForce Subject
var summaryField = document.evaluate("//td/input[@id='summary']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);	
summaryField = summaryField.snapshotItem(0);	

if(summaryField)

	if(jiraArray[1] != undefined){
		summaryField.value=jiraArray[1];
	}
//Fill out customer field with customer email
var customerField = document.evaluate("//input[@id='customfield_10011']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);	
customerField = customerField.snapshotItem(0);	

if(customerField)
	if(jiraArray[3] != undefined){
		customerField.value=jiraArray[3];	
	}
//Fill out incident field with case number
var incidentField = document.evaluate("//input[@id='customfield_10070']",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);	
incidentField = incidentField.snapshotItem(0);	

if(incidentField)
	if(jiraArray[4] != undefined){
		incidentField.value=jiraArray[4];	
	}




//Preselect Assignee
var issueType = document.evaluate("//td[@class='fieldValueArea']/img/@alt",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);	
issueType = issueType.snapshotItem(0);	

if(issueType.nodeValue == 'Bug' && jiraArray[0] == 'ER/Studio Data Architect'){


	var assignee = document.evaluate("//td/select[@id='assignee']",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	assignee = assignee.snapshotItem(0);

	assignee.value = 'pmgroup';
	assignee.selected = true;


}
if(issueType.nodeValue != 'Bug' && jiraArray[0] == 'ER/Studio Data Architect'){

	var assignee = document.evaluate("//td/select[@id='assignee']",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	assignee = assignee.snapshotItem(0);

	assignee.value = 'jason.tiret';
	assignee.selected = true;


}
	
}	//While Jira is current page.
//Comment out for folks who aren't doing ER/Studio

if(thisURL.indexOf('?setupid=EmailTemplates') != -1){

//Add title default column
var emailTemplateTitles = document.evaluate("//th[@class='']",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var emailTemplateTitle = emailTemplateTitles.snapshotItem(0);

myTH.innerHTML = "<th>Default</th>";


emailTemplateTitle.parentNode.insertBefore(myTH,emailTemplateTitle.nextSibling);

//Add default columns
var emailTemplateNames = document.evaluate("//th[@class=' dataCell  ']",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var emailTemplateLinks = document.evaluate("//th/a[contains(@href,'?setupid=EmailTemplates')]/@href",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0;i < emailTemplateNames.snapshotLength;i++)
{

	emailTemplateName = emailTemplateNames.snapshotItem(i);

	emailTemplateLink = emailTemplateLinks.snapshotItem(i);
	emailTemplateLink = emailTemplateLink.nodeValue;
	emailTemplateLink = emailTemplateLink.substring('1',emailTemplateLink.indexOf('?'));

	var d = GM.getValue("emailTemplateID",'');


		if(d == emailTemplateLink){

			isChecked = "checked";

		}
		else
		{
			isChecked = "";
		}


	myTH2 = document.createElement("th");
	myTH2.innerHTML = '<input type="radio" '+ isChecked + ' name="emailTemplate" id="' + emailTemplateLink + '">';
	emailTemplateName.parentNode.insertBefore(myTH2,emailTemplateName.nextSibling);

}

}//if(thisURL.indexOf('?setupid=EmailTemplates') != -1){



document.addEventListener('click', function(event) {


	if (event.target.getAttribute('type') == "radio" && (event.target.getAttribute('name') == "emailTemplate")){
			
		
			if(event.target.checked == true){


				GM.setValue("emailTemplateID", event.target.getAttribute('id'));
			}
			else{

				GM.setValue("emailTemplateID", "");
			}			
			


	}


	if (event.target.getAttribute('value') == " Jira "){

	
		GM.setValue("Jira", Jira);
		
		
	
	}


	if (event.target.getAttribute('value') == "ET SEND EMAIL" ||event.target.getAttribute('value') == "Send An Email" ||event.target.getAttribute('value') == "Reply To All" || event.target.text == "Reply" || event.target.text == "To All" ||event.target.getAttribute('title') == "Reply"){


		GM.setValue("distribution",'');

	}

	if(thisURL.indexOf('templateselector.jsp') != -1){

		if(event.target.href == 'https://'+thisURLPrefix+'.salesforce.com/email/author/templateselector.jsp#' && event.target.text == 'ERTECH'){

			GM.setValue("distribution",'ERTECH');
			

		}

		
		if(event.target.href == 'https://'+thisURLPrefix+'.salesforce.com/email/author/templateselector.jsp#' && event.target.text == 'Expired Maintenance-Internal'){

			GM.setValue("distribution",'Expired Maintenance-Internal');
			

		}
		
		

	}	




}, true);

if(thisURL.indexOf('00XA0000001AdmT') != -1)
{

	

	var d = GM.getValue("emailTemplateID",'');
	



	if (d != ""){
		thisURL = thisURL.replace('00XA0000001AdmT',d);
		location.href = thisURL;
	}


}

//Fill in Additional To: fields
if(thisURL.indexOf('EmailAuthor') != -1)
{

	var e = GM.getValue("distribution",'');
	

	if(e == 'Expired Maintenance-Internal'){	

		var selects = document.evaluate("//select[@id='p26']/option/@value",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		selects = selects.snapshotItem(0);
		selects = selects.nodeValue
		selects = selects.substring(0,selects.indexOf(":"));	


		var inputs = document.getElementsByTagName('input');

		for (var i = 0; i < inputs.length; i++) {

		  var input = inputs[i];	

			if (input.getAttribute('id')) {	  

				var matchp2 = input.getAttribute('id').match('p2');

				if (matchp2)
         				input.setAttribute('value', '');

			}

		}

		var textareas = document.getElementsByTagName('textarea');

		for (var i = 0; i < textareas.length; i++) {

			var textarea = textareas[i];
			
			if (textarea.getAttribute('id')) {

				var matchp24 = textarea.getAttribute('id').match('p24');

				if (matchp24)
         				textarea.value = "dl-embtmaintteam@embarcadero.com ";


			}	

		}		


	}

	if(e == 'ERTECH'){

		
		var d = GM.getValue("folderURL",'');


		var selects = document.evaluate("//select[@id='p26']/option/@value",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		selects = selects.snapshotItem(0);
		selects = selects.nodeValue
		selects = selects.substring(0,selects.indexOf(":"));	


		var inputs = document.getElementsByTagName('input');

		for (var i = 0; i < inputs.length; i++) {

		  var input = inputs[i];	

			if (input.getAttribute('id')) {	  

				var matchp2 = input.getAttribute('id').match('p2');

				if (matchp2)
         				input.setAttribute('value', '');

			}

		}


		var textareas = document.getElementsByTagName('textarea');

		for (var i = 0; i < textareas.length; i++) {

			var textarea = textareas[i];
			
			if (textarea.getAttribute('id')) {

				var matchp24 = textarea.getAttribute('id').match('p24');

				if (matchp24)
					//old textarea.value = "ertech@embarcadero.com; " + selects;
         				textarea.value = "ertech@embarcadero.com";

				//added ts-tickets file location to email body
				var matchp7 = textarea.getAttribute('id').match('p7');

				if (matchp7){

					var body = textarea.value;
					body = body.replace("Files:", "Files:" + '\r\n' + d);
					textarea.value = body;

				}

			}	

		}
	}

}




/*
//Add link to my favorite view.
var theCases = document.evaluate("//td[@class='currentTab primaryPalette']",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var theCase = theCases.snapshotItem(0);

myCell.innerHTML = '<td class="currentTab primaryPalette" nowrap="nowrap"><div id="Case_Tab"><a href="https://na7.salesforce.com/500?fcf=00BA0000005Dctd\" title="Cases Tab - Selected">My View</a></div></td>';

//theCase.parentNode.insertBefore(myCell,theCase.nextSibling);
*/



//Widen subject line for emails
var inputs = document.getElementsByTagName('input');

for (var i = 0; i < inputs.length; i++) {
  var input = inputs[i];

	if (input.getAttribute('size')) {
      		var match70 =    input.getAttribute('size').match('70');
      			if (match70)
         			input.setAttribute('size', '100');

		var match100 =    input.getAttribute('maxlength').match('100');			
      			if (match100)
         			input.setAttribute('maxlength', '200');
			
    	}

	if (input.getAttribute('onclick')) {
	
		var matchname = input.getAttribute('onclick').match('sendEmail');
			//http://www.codingforums.com/archive/index.php/t-36374.html
			//if (matchname)
			//	input.setAttribute('onClick', 'sendEmail(); window.close();');
			//	'Done' Button from file attachment page:
			//	<input type="submit" title="Done" onclick="doDone();" name="cancel" class="btn" value=" Done ">

				

	}

	if (input.getAttribute('name')) {

		//Change Jira button so it opens 'Create Issue' page in Jira.
		var matchJira = input.getAttribute('name').match('jira');
		if (matchJira){
				input.setAttribute('onClick', 'openIntegration(\'http://vmsfjira:8665/secure/CreateIssue!default.jspa\', \'height=600,location=no,resizable=yes,toolbar=no,status=no,menubar=no,scrollbars=1\', 1)');
				input.setAttribute('value',' Jira ');
		}
		

	}
  

}


var textareas = document.getElementsByTagName('textarea');

for (var i = 0; i < textareas.length; i++) {
  var textarea = textareas[i];

	if (textarea.getAttribute('cols')) {

		//Widen body for emails
      		var match93 =    textarea.getAttribute('cols').match('93');
      			if (match93)
         			textarea.setAttribute('cols', '125');

		//Widen comments	
      		var match80 =    textarea.getAttribute('cols').match('80');
      			if (match80)
         			textarea.setAttribute('cols', '125');	
				//textarea.setAttribute('rows', '30');		


    	}

	//Widen description field when creating a new case
	if (textarea.getAttribute('id') == 'cas15') {

         			textarea.setAttribute('cols', '125');	
				textarea.setAttribute('rows', '30');

	}
		
  

}


//For TS-Tickets link creation

var caseNumbers = document.evaluate("//h2[@class='pageDescription']/text()",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var caseNumber = caseNumbers.snapshotItem(0);

if(caseNumber != null){

	caseNumber = caseNumber.nodeValue;
	caseNumber = caseNumber.replace(" ","");
}
else
{
	//caseNumber = 0;
}

//caseNumber = "2454401";//temp for testing

var createdDates = document.evaluate("//div[contains(@id,'CreatedDate')]/text()",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var createdDate = createdDates.snapshotItem(0);


if(createdDate != null){

	createdDate = createdDate.nodeValue;
	createdDate = createdDate.slice(createdDate.lastIndexOf('/'),createdDate.indexOf(" "));
}
else
{
	//createdDate = '';
}



//createdDate = "/2010";//temp for testing



//var theProducts = document.evaluate("//td/div[@id='00N30000000dVao_ileinner']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var theProducts = document.evaluate("//td/div[@id='00N33000002QIOa_ileinner']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);//changed for idera server

var theProduct = theProducts.snapshotItem(0);

if(theProduct != null){

	theProduct = theProduct.textContent;
}
else
{

	//theProduct = '';
}


if(theProduct == "DT/Studio"){

	theProduct = theProduct.replace("/","");

}
else if(theProduct == "ER/STUDIO"){

	theProduct = theProduct.replace("/"," ");

}
else if(theProduct == "ER/Studio"){

	theProduct = theProduct.replace("/"," ");

}
else if(theProduct == "ER/Studio Data Architect"){

	theProduct = "ER Studio";

}
else if(theProduct == "ER/Studio Team Server"){

	theProduct = "Team Server";

}
else if(theProduct == "ER/Studio Portal"){

	theProduct = "ERPortal";

}
else if(theProduct == "DBArtisan"){

	theProduct = "DBArtisan";

}
else if(theProduct == "Rapid SQL"){

	theProduct = "Rapid SQL";

}
else if(theProduct == "Repo"){

	theProduct = "ER Studio";

}



//For possible Jira integration
var theSubjects = document.evaluate("id('cas14_ileinner')/text()",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var theSubject = theSubjects.snapshotItem(0);

if(theSubject != null){

	theSubject = theSubject.nodeValue;
}
else
{
	theSubject = '';

}

//var theVersions = document.evaluate("id('00NA0000004J7uR_ileinner')/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var theVersions = document.evaluate("id('00N33000002QGsS_ileinner')/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);//idera server

var theVersion = theVersions.snapshotItem(0);

if(theVersion != null){

	theVersion = theVersion.nodeValue;
}

//var theEmails = document.evaluate("//div[@id='cas10_ileinner']/a/text()",document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var theEmails = document.evaluate("//div[@class='gmailLink']/a/text()",document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var theEmail = theEmails.snapshotItem(0);

if(theEmail != null){
	theEmail = theEmail.nodeValue;
}

var Jira = theProduct + "*" + theSubject + "*" + theVersion + "*" + theEmail + "*" + caseNumber;

var linkLocations2nd = document.evaluate("//table[@class='detailList']",
document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);


var linkLocation2nd = linkLocations2nd.snapshotItem(0);


//New folder
//\\etsffile02\San Francisco\Site\TechSupport

var folderURL = "\\\\etsffile02\\San Francisco\\Site\\TechSupport" + createdDate + "\\" + theProduct + "\\" + caseNumber;
folderURL = folderURL.replace("/", "\\");

//GM.log(createdDate);

GM.setValue("folderURL",folderURL);

//var licenseLink = modCompURL();
//var accountName = getAccountName();

if(createdDate != null){

	myLink2nd.innerHTML = "<br><tr><td class='labelCol'>Open Folder: </td><td class='dataCol'>" + "<a href=\"file://///S:/TechSupport" + createdDate + "/" + theProduct + "/" + caseNumber + "\">"+ "\S:\\TechSupport" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + caseNumber + "</td><td class='labelCol'>Create Folder: </td><td class='dataCol'><a href=\"file://///S:/TechSupport" + createdDate + "/" + theProduct + "\">" + "\S:\\TechSupport" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + '<input onMouseover="this.select()" style="text-align: center" class="border: none;overflow: hidden;" size="7" value="'+ caseNumber + '" type="text" WRAP=OFF  />' + "</td></tr>";

}
/*
+
						"<tr><td class='labelCol'>"+accountName+" Licenses: </td><td class='dataCol'><a href="+licenseLink+" target=_BLANK>Maintenance Check</a></td></tr>";

						*/

/*
myLink2nd.innerHTML = "<br><tr><td class='labelCol'>Open Folder: </td><td class='dataCol'>" + "<a href=\"file://///etsffile02/San Francisco/Site/TechSupport" + createdDate + "/" + theProduct + "/" + caseNumber + "\">"+ "\\\\etsffile02\\San Francisco\\Site\\TechSupport" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + caseNumber + "</td><td class='labelCol'>Create Folder: </td><td class='dataCol'><a href=\"file://///etsffile02/San Francisco/Site/TechSupport" + createdDate + "/" + theProduct + "\">" + "\\\\etsffile02\\San Francisco\\Site\\TechSupport" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + '<input onMouseover="this.select()" style="text-align: center" class="border: none;overflow: hidden;" size="7" value="'+ caseNumber + '" type="text" WRAP=OFF  />' + "</td></tr>";
*/

/*
myLink2nd.innerHTML = "<br><tr><td class='labelCol'>Open Folder: </td><td class='dataCol'>" + "<a href=\"file://///etsfnas04/TS-Tickets" + createdDate + "/" + theProduct + "/" + caseNumber + "\">"+ "\\\\etsfnas04\\TS-Tickets" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + caseNumber + "</td><td class='labelCol'>Create Folder: </td><td class='dataCol'><a href=\"file://///etsfnas04/TS-Tickets" + createdDate + "/" + theProduct + "\">" + "\\\\etsfnas04\\TS-Tickets" + createdDate.replace("/","\\") + "\\" + theProduct + "\\" + '<input onMouseover="this.select()" style="text-align: center" class="border: none;overflow: hidden;" size="7" value="'+ caseNumber + '" type="text" WRAP=OFF  />' + "</td></tr>";
*/

if(linkLocation2nd != null){

	linkLocation2nd.parentNode.insertBefore(myLink2nd,linkLocation2nd.nextSibling);

}


/* FUNCTION TO OPEN COMPANY LICENSES*/

function modCompURL()
{
	/* This redirects the page to the full list of licenses
	var compID = document.getElementById("cas4_ileinner").childNodes[0].id;
	var str = compID.substring(6,21);
	
	var listing = "02i?rlid=RelatedAssetList&id=";
	var modURL = window.location.protocol +"//"+window.location.host + "/"+ listing + "" + str;
	return modURL;
	//*/
	
	//* This redirects the page to a specific page based on the Product in the case
	var prodName = getProductName();
	var accountNum = getAccountNumber();
	
	//var modURL = determineFilteredPage(prodName, accountNum);
	
	//return modURL;
	//*/
}

function getAccountNumber()
{
	//var compID = document.getElementById("cas4_ileinner").childNodes[0].id;
	//var str = compID.substring(6,21);
	
	//return str;
}

function getAccountName()
{
	//*
	//var accountName = document.getElementById("cas4_ileinner").childNodes[0].innerHTML;
	//return accountName;
	//*/
}

function getProductName()
{
	//*
	//var accountName = document.getElementById("00NA0000004J7uS_ileinner").innerHTML;
	//return accountName;
	//*/
}

function determineFilteredPage(prodName, accountNum)
{
	switch (prodName){
	
		//DATABASE PRODUCTS
		case "All-Access":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=0";
			break;
		case "ChangeManager":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=2";
			break;
		case "DBArtisan":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=3";
			break;
		case "DB Optimizer":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=3";
			break;
		case "DT/Studio":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=3";
			break;
		case "ER/Studio Business Architect":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "ER/Studio Data Architect":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "ER/Studio Software Architect":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "ER/Studio Portal":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "ER/Studio Viewer":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "ER Studio":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "Repo":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=4";
			break;
		case "Performance Center":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=15";
			break;
		case "Rapid SQL","Rapid SQL Developer":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=17";
			break;
		case "Rapid SQL Developer":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=17";
			break;
			
		//DEVELOPER PRODUCTS
		case "Blackfish":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=1";
			break;
		case "C++ Builder":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=2";
			break;
		case "Delphi", "Delphi Prism":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=3";
			break;
		case "InterBase":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=8";
			break;
		case "JBuilder","JDataStore","J Optimizer":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=9";
			break;
		case "RadPHP","RAD Studio":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=1&rlid=RelatedAssetList&lsc=9";
			break;
		
		//ELC
		case "ELC":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=4&rlid=RelatedAssetList";
			break;
			
		//TOOLCLOUD
		case "ToolBox":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=4&rlid=RelatedAssetList&lsc=19";
			break;
		case "ToolCloud":
			return window.location.protocol +"//"+window.location.host + "/02i?id="+ accountNum +"&lsi=4&rlid=RelatedAssetList&lsc=19";
			break;
		
		//OTHERS [ELC, APPWAVE...]
		default : 
			return window.location.protocol +"//"+window.location.host + "/02i?rlid=RelatedAssetList&id="+ accountNum;
			break;
	}
	
	//input[@name='share']

	//ADD BUTTON TO ACCESS LICENSES FROM ACCOUNT
	var shareButton;
	var accountButton;

	var shareButtonLoc = document.evaluate("id('topButtonRow')/x:input[5]",
	document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for (var i=0;i < shareButtonLoc.snapshotLength;i++)
	{

		shareButton = shareButtonLoc.snapshotItem(i);

		accountButton = document.createElement("input");
		accountButton.type = 'button';
		accountButton.setAttribute('onclick', 'openIntegration(\'http://etukftp01.embarcadero.com/eftadhoc/\', \'height=600,location=no,resizable=yes,toolbar=no,status=no,menubar=no,scrollbars=1\', 1)');
		accountButton.name = "account_licenses";
		accountButton.title = "Account Licenses";
		accountButton.value = "Account Licenses";
		accountButton.setAttribute('class', 'btn');	

		//shareButton.parentNode.insertBefore(accountButton,shareButton.nextSibling);

	}
}

//*/END COMPANY FUNCTIONS

//Change color for case comments
var colSpans = document.getElementsByTagName('TD');
for (var i = 0; i < colSpans.length; i++) {
  var colSpan = colSpans[i];
  	var name = colSpan.textContent;

	if(name.indexOf("Created By:") != -1)
			{
				if(name.indexOf("ref:") == -1){
				
					//colSpan.setAttribute('BGCOLOR','#FFFFCC');

				}

			}

}


function appendToDocument2(html) {
        var div = document.getElementById(HIDDEN_DIV_ID);
        if (!div) {
            div = document.createElement("div");
            document.body.appendChild(div);
            div.id = HIDDEN_DIV_ID;
            div.style.display = 'none';
        }
        div.innerHTML = html;

        return document;
}




