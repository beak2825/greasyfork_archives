// ==UserScript==
// @name         CELCAT to .ics
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  This is a custom browser script that converts CELCAT calendar data into iCalendar (.ics) format that can be exported and used in other schedule management applications. based on kokomax24
// @homepageURL  https://github.com/tasye24/CELCAT-to-.ics
// @author       kokomax24, tasye24
// @match        your website here
// @license      MIT LICENCE (c) kokomax24
// @grant
// @downloadURL https://update.greasyfork.org/scripts/526279/CELCAT%20to%20ics.user.js
// @updateURL https://update.greasyfork.org/scripts/526279/CELCAT%20to%20ics.meta.js
// ==/UserScript==

// Change @match to your website calendar
// Chande this variable by finding the depot on the website calls (when you change calendar)
let CALENDAR_url = "https://YOUR_WEBSITE.DOMAIN"; // your url HERE

const CALENDAR = CALENDAR_url+"/calendar/Home/GetCalendarData";

/**
 * conver a json object to a HTML element
 * @param data json object to convert to html
 * @returns HTMLElement from the json object
 */
function jsonToHTML(data) {
    const element = document.createElement(data.elementType)
    for (let [key, object] of Object.entries(data)){
        if (object == undefined) continue
        switch (key) {
            case "elementType":
                break
            case "content":
                element.appendChild(document.createTextNode(object))
                break
            case "class":
                element.classList.add(...object)
                break
            case "childs":
                object.forEach(child => {
					if (child == undefined) return
                    element.appendChild(jsonToHTML(child))
                })
                break
            case "events":
                for (let [event, callback] of Object.entries(object)){
                    element.addEventListener(event, callback)
                }
				break
            default:
                element.setAttribute(key, object)
                break
        }
    }
    return element
}

function filterClick(name) {
	return (event) => {
		if (event.target.classList.contains("modal")) {
			hideDialog(name)
		}
	}
}

const selectedLanguage = document.querySelector('#requestCulture_RequestCulture_UICulture_Name').value;
const messages = {
   'en-US': {
    exportButtonLabel: 'Export',
    errorDialogTitle: 'Error',
    errorDialogMessage: 'An error occurred.',
    okButtonLabel: 'Ok',
    cancelButtonLabel: 'Cancel',
    notConnectedMessage: 'You must be connected to use this script',
  },
  'fr-FR': {
    exportButtonLabel: 'Exporter',
    errorDialogTitle: 'Erreur',
    errorDialogMessage: 'Une erreur s\'est produite.',
    okButtonLabel: 'Ok',
    cancelButtonLabel: 'Annuler',
    notConnectedMessage: 'Vous devez être connecté pour utiliser ce script',
  },
  'en-GB': {
    exportButtonLabel: 'Export',
    errorDialogTitle: 'Error',
    errorDialogMessage: 'An error occurred.',
    okButtonLabel: 'Ok',
    cancelButtonLabel: 'Cancel',
    notConnectedMessage: 'You must be connected to use this script',
  }
};

/**
 * show a dialog with the given name
 * @param name name of the dialog to show
 */
function showDialog(name) {
	const dialog = document.getElementById(`customDialog-${name}`);
	document.body.classList.add("modal-open");
	document.body.appendChild(modalFadeIn);
	dialog.style.display = "block";
	dialog.style.paddingLeft = "0px";

	setTimeout(() => {
		dialog.classList.add("in");
		document.querySelector(`#customDialog-${name} .btn-default`).style.display = "none";
	}, 200);
}

function dialogShowEvent(name) {
	return () => {
		showDialog(name)
	}
}

/**
 * hide a dialog with the given name
 * @param name name of the dialog to hide
 */
function hideDialog(name) {
	// GM_log(`Hiding dialog ${name}`)
	const dialog = document.getElementById(`customDialog-${name}`)
	dialog.classList.remove("in")
	modalFadeIn.classList.remove("in")
	setTimeout(() => {
		dialog.style.display = "none"
		document.body.classList.remove("modal-open")
		document.body.removeChild(modalFadeIn)
		modalFadeIn.classList.add("in")
	}, 200)
}

function dialogHideEvent(name) {
	return () => {
		hideDialog(name)
	}
}

/**
 * Generate a new dialog with all the appropriate styles, events and animations and add it to the page
 *
 * @param name name of the dialog to create
 * @param title title to display in the dialog header
 * @param description description which is displayer above the dialog content
 * @param dataValidation function to call when the user click on the validation button
 * @param jsonHTMLContent dialog body content
 * @returns HTMLElement the created dialog
 */

function buildDialog(name, title, description, dataValidation, jsonHTMLContent) {
	const dialog = jsonToHTML({
		elementType: "div",
		class: ["modal", "fade"],
		tabindex: -1,
		role: "dialog",
		"aria-labelledby": "eventFilterModalLabel",
		id: `customDialog-${name}`,
		events: {
			"click": filterClick(name)
		},
		childs: [
			{
				elementType: "div",
				class: ["modal-dialog"],
				role: "document",
				childs: [
					{
						elementType: "div",
						class: ["modal-content"],
						childs: [
							{
								elementType: "div",
								class: ["modal-header"],
								childs: [
									{
										elementType: "button",
										class: ["close"],
										type: "button",
										"data-dismiss": "modal",
										"aria-label": "Close",
										events: {
											"click": dialogHideEvent(name)
										},
										childs: [
											{
												elementType: "span",
												"aria-hidden": "true",
												content: "×"
											}
										]
									},
									{
										elementType: "h4",
										class: ["modal-title"],
										content: title
									}
								]
							},
							{
								elementType: "div",
								class: ["modal-body"],
								childs: [
									{
										elementType: "p",
										content: description
									},
									jsonHTMLContent
								]
							},
							{
								elementType: "div",
								class: ["modal-footer"],
								childs: [
									{
										elementType: "button",
										class: ["btn", "btn-default"],
										type: "button",
										"data-dismiss": "modal",
										content: selectedLanguage === 'fr-FR' ? "Exporter" : "Export",
										events: {
											"click": () => {
												if (!dataValidation()) return
												hideDialog(name)
											}
										}
									},
									{
										elementType: "button",
										class: ["btn", "btn-default"],
										type: "button",
										"data-dismiss": "modal",
										content: selectedLanguage === 'fr-FR' ? "Annuler" : "Cancel",
										events: {
											"click": dialogHideEvent(name)
										}
									}
								]
							}
						]
					}
				]
			}
		]
	})
	document.getElementById("mainContentDiv").appendChild(dialog)
	return dialog
}

const mainDialog = buildDialog(
	"mainDialog",
	selectedLanguage === 'fr-FR' ? "Exporter en .ics" : "Export to .ics",
	selectedLanguage === 'fr-FR' ? "Sélectionner les dates de l'export que vous voulez faire." : "Select the export dates you want to use.",
	exportData,
	{
		elementType: "form",
		role: "form",
		events: {
			"submit": (event) => {
				event.preventDefault()
				return false
			}
		},
		childs: [
			{
				elementType: "div",
				class: ["form-group"],
				childs: [
					{
						elementType: "label",
						for: "startDate",
						content: selectedLanguage === 'fr-FR' ? "Date de début:" : "Start Date:",
					},
					{
						elementType: "input",
						class: ["form-control"],
						tabindex: -1,
						"aria-hidden": true,
						type: "date",
						id: "startDate",
						name: "startDate",
						value: new Date().toISOString().split("T")[0]
					}
				]
			},
			{
				elementType: "div",
				class: ["form-group"],
				childs: [
					{
						elementType: "label",
						for: "endDate",
						content: selectedLanguage === 'fr-FR' ? "Date de fin:" : "End Date:",
					},
					{
						elementType: "input",
						class: ["form-control"],
						tabindex: -1,
						"aria-hidden": true,
						type: "date",
						id: "endDate",
						name: "endDate",
						value: new Date().toISOString().split("T")[0]
					}
				]
			},
			{
				elementType: "div",
				class: ["errorMessage", "alert", "alert-danger", "hidden"],
				role: "alert",
				childs: [
					{
						elementType: "span",
						class: ["glyphicon", "glyphicon-exclamation-sign"],
						"aria-hidden": "true"
					},
					{
						elementType: "span",
						class: ["sr-only"],
						content: "Error:"
					},
					{
						elementType: "span",
						class: ["errorMessageContent"],
						content: selectedLanguage === 'fr-FR' ? "Message d'erreur" : "Error message",
					}
				]
			}
		]
	}
)

mainDialog.setErrorMessage = (message) => {
	if (!message) {
		mainDialog.querySelector(".errorMessage").classList.add("hidden")
		return
	}
	mainDialog.querySelector(".modal-body p").textContent = messages[selectedLanguage].errorDialogMessage;
	mainDialog.querySelector(".errorMessage").classList.remove("hidden")
}

const errorDialog = buildDialog(
	"errorDialog",
	messages[selectedLanguage].errorDialogTitle,
	messages[selectedLanguage].notConnectedMessage,
	() => true,
	{}
);
errorDialog.show = (message) => {
	errorDialog.querySelector(".modal-body p").textContent = message
	showDialog("errorDialog")
}

const modalFadeIn = jsonToHTML({
	elementType: "div",
	class: ["modal-backdrop", "fade", "in"]
})

/************
* MAIN CODE *
************/

/**
 * check if the user is logged in
 * @returns true if the user is logged in, false otherwise
 */
function isConnected() {
    const textContent = document.querySelector(".logInOrOut").innerText;
    return /Déconnexion - [0-9]+|Log Out - [0-9]+/i.test(textContent);
}

function getFederalId() {
    const textContent = document.querySelector(".logInOrOut").innerText;
    const match = textContent.match(/Déconnexion - ([0-9]+)|Log Out - ([0-9]+)/i);
    if (match) {
        return match[1] || match[2];
    }
    return null;
}

/**
 * reset error visual and message in the main dialog
 */
function resetMainDialogError() {
	mainDialog.setErrorMessage()
	document.getElementById("startDate").parentElement.classList.remove("has-error")
	document.getElementById("startDate").parentElement.classList.remove("has-error")
}

/**
 * fetch json data of the user CELCAT calendar
 * @param startDate the start date of the export
 * @param endDate the end date of the export
 * @returns the json data fetched from the CELCAT api
 */
async function getData(startDate, endDate) {
	const headers = new Headers()
	headers.append("Content-Type", "application/x-www-form-urlencoded")

	const params = {
		method: "POST",
		headers: headers,
		mode: "cors",
		body: new URLSearchParams({
			start: startDate.toISOString().split("T")[0],
			end: endDate.toISOString().split("T")[0],
			resType: "104",
			calView: "agendaWeek",
			"federationIds[]": getFederalId(),
			colourScheme: "3"
		})
	}

	const result = await fetch(CALENDAR, params)
	return result.json()
}

/**
 * clean the data fetched from the CELCAT api by removing <br/> tags and repetitive \n or \r
 * @param description the description of the event
 * @returns cleaned description
 */
function cleanDescription(description) {
	return description.replace(/(<br \/>|[\r])/g, "")
			  .replace(/[\n]+/g, "\n")
			  .replace(/&#232;/g,"è")
			  .replace(/&#233;/g,"è")
			  .replace(/&#226;/g,"â")
}

/**
 * take and iso date given by the CELCAT api or javascript date and convert it to ISO 8601 format
 * @param dateString the date in ISO format
 * @returns the date in the format YYYYMMDDTHHmmss (ISO 8601)
 */
function formatDate(dateString) {
	return dateString.replace(/([-:]|\.[0-9]+)/g, "")
}

/**
 * parse event description to get the location, the event type, the room, and the couse id and name
 * @param description the description of the event
 * @returns the parsed data
 */
function parseDescription(description) {
	const details = description.split("\n")
	return {
		type: details[0],
		title: details[1].split(" - ")[0],
		course: details[1].split(" - ")[1],
		room: details[2],
		group: details[3]
	}
}

function dataToIcal(data) {
    let result = "BEGIN:VCALENDAR\r\n"
    result += "VERSION:2.0\r\n"
    result += "PRODID:-//Robotechnic//Univ Toulouse III//CELCAT//FR\r\n"
    result += "CALSCALE:GREGORIAN\r\n"
    result += "METHOD:PUBLISH\r\n"
    result += "X-WR-CALNAME:CELCAT-EDT\r\n"
    result += "X-WR-TIMEZONE:Europe/Paris\r\n"

    const dstamp = `DTSTAMP:${formatDate(new Date().toISOString())}\r\n`
    for (const event of data) {
        if (event.eventCategory == "CONGES" || event.eventCategory == "FERIE" || event.eventCategory == "PONT") continue
        event.description = cleanDescription(event.description)

        debugger
        const details = parseDescription(event.description)

        const categoryColor = getCategoryColor(event.type || event.eventCategory);
        result += "BEGIN:VEVENT\r\n"
        result += `UID:${event.id}\r\n`
        result += dstamp
        result += `DTSTART:${formatDate(event.start)} \r\n`
        result += `DTEND:${formatDate(event.end)} \r\n`
        result += `SUMMARY:${details.course || details.room || 'Undefined Event'} \r\n`
        result += `DESCRIPTION:${event.description.replace(/\n/g,"\\n")}\r`
        result += `LOCATION:${details.group  || details.room} \r\n`
        result += `CATEGORIES:${event.eventCategory} \r\n`
        result += `COLOR:${categoryColor}\r\n`;
        result += "END:VEVENT\r\n"
    }
    result += "END:VCALENDAR\r\n"
    return result
}


// Change based on your colors
function getCategoryColor(category) {
    switch (category) {
        case "COURS":
            return "ff0000";
        case "TD":
            return "4a4aff";
        case "TP":
            return "#408080";
        case "REUNION / RENCONTRE":
            return "a953ff";
        case "CONTROLE CONTINU":
            return "#808000";
        default:
            return "#ffc4c4";
    }
}


/**
 * export dat to iCalendar format and download it
 * @returns true if the exportation is a success, false otherwise
 */
function exportData() {
	const startElement = document.getElementById("startDate")
	const startDate = new Date(startElement.value)
	const endElement = document.getElementById("endDate")
	const endDate = new Date(endElement.value)

	resetMainDialogError()

	if (startDate == "Invalid Date") {
		mainDialog.setErrorMessage("La date de début est invalide.")
		startElement.parentElement.classList.add("has-error")
		startElement.focus()
		return false
	}

	if (endDate == "Invalid Date") {
		mainDialog.setErrorMessage("La date de fin est invalide.")
		endElement.parentElement.classList.add("has-error")
		endElement.focus()
		return false
	}

	if (startDate > endDate) {
		mainDialog.setErrorMessage("La date de début doit être avant la date de fin.")
		startElement.parentElement.classList.add("has-error")
		endElement.parentElement.classList.add("has-error")
		startElement.focus()
		return false
	}

	resetMainDialogError()

	//GM_log(`Exporting data from ${startDate} to ${endDate}`)

	getData(startDate, endDate)
		.then(data => {
			const ical = dataToIcal(data)
			const link = document.createElement("a")
			link.setAttribute("href", `data:text/calendar;charset=utf-8,${encodeURIComponent(ical)}`)
			link.download = `export-${startDate.toISOString().split("T")[0]}-${endDate.toISOString().split("T")[0]}.ics`
			link.click()
		})
		.catch(error => {
			errorDialog.show(error)
			//GM_log(error)
		})

	return true;
}

/**
 * Add the export button to the page interface
 */
function addButton() {
    const navBar = document.querySelector("#main-navbar-collapse .navbar-nav");
    const button = jsonToHTML({
        elementType: "li",
        class: ["navbar-link"],
        childs: [
            {
                elementType: "a",
                id: "iCalendarGeneration",
                content: messages[selectedLanguage].exportButtonLabel,
                style: "cursor:pointer;",
                events: {
                    "click": () => {
                        if (isConnected()) {
                            showDialog("mainDialog");
                        } else {
                            errorDialog.show(messages[selectedLanguage].notConnectedMessage);
                        }
                    }
                }
            }
        ]
    });
    navBar.appendChild(button);
    mainDialog.querySelector(".modal-footer").prepend(
        jsonToHTML({
            elementType: "button",
            class: ["btn", "btn-default"],
            type: "button",
            "data-dismiss": "modal",
            content: messages[selectedLanguage].exportButtonLabel,
            events: {
                "click": () => {
                    if (!exportData()) return;
                    hideDialog("mainDialog");
                }
            }
        })
    );
}

(function() {
    addButton()
})();