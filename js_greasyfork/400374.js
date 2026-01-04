// ==UserScript==
// @name         JiraRoboScript
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Jira helper to preselect some fields when creating dialog is shown
// @author       Robo
// @homepage     https://greasyfork.org/sk/scripts/400374-jiraroboscript
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @match        https://sd.intranet.st.sk/*
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400374/JiraRoboScript.user.js
// @updateURL https://update.greasyfork.org/scripts/400374/JiraRoboScript.meta.js
// ==/UserScript==

(function () {
	'use strict';
	//due to conflicts with page scripts
	let $myJQuery = jQuery.noConflict(true);

	// Starts listening for changes in the target HTML element of the page.
	let target = document.getElementById('jira');

    if(target) {
        let bodyMutationObserver = new MutationObserver(function (mutations) {
            for (let i = 0; i < mutations.length; i++) { //faster than forEach
                let mutation = mutations[i];
                //console.log(mutation);
                if (mutation.addedNodes.length > 0
                    && (mutation.addedNodes[0].id === "create-issue-dialog" || mutation.addedNodes[0].id === "create-subtask-dialog")) {
                    //add inner dialog mutationObserver
                    initializeDialogMutationObserver(mutation.addedNodes[0]);
                }
            }
        });

        bodyMutationObserver.observe(target, {
            childList: true
        });
    }


    ////////////////

	function initializeDialogMutationObserver(dialog) {
		let dialogMutationObserver = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) { //faster than forEach
				let mutation = mutations[i];
				console.log(mutation);
				if (mutation.target.className.includes("jira-dialog-content-ready") || (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className.includes("aui-dialog2-footer"))) {
					//dialog is ready
					//don't disconnect observer, because changing project type cause reload of inner content and dialog panel class change is triggered
					//makeMiracle(mutation.target);
					createMiracleButtons(mutation.target);
				}
			}
		});

		dialogMutationObserver.observe(dialog, {
			childList: true,
            attributes: true,
			attributeFilter: ["class"]
		});
	}

    function createMiracleButtons(dialog) {
		let dialogHeader = $myJQuery(dialog).find(".jira-dialog-core-heading h2");
		if (dialogHeader.find(".miracleButton").length === 0) {
			let oneAppMiracleButton = $myJQuery("<a class='aui-button aui-button-primary aui-style miracleButton' title='Prefil form' href='#' style='margin-left:20px;'>OneApp miracle</a>")
            .on("click", {team:"oneApp"}, miracleButtonHandler);
            let oneShopMiracleButton = $myJQuery("<a class='aui-button aui-button-primary aui-style miracleButton' title='Prefil form' href='#' style='margin-left:20px;'>OneShop miracle</a>")
            .on("click", {team:"oneShop"}, miracleButtonHandler);
            //let debtMiracleButton = $myJQuery("<a class='aui-button aui-button-primary aui-style miracleButton' title='Prefil form' href='#' style='margin-left:20px;'>Tech debt labels</a>")
            //.on("click", {labels:["DG_techdebt"]}, debtButtonHandler);
			dialogHeader.append(oneAppMiracleButton);
			dialogHeader.append(oneShopMiracleButton);
            dialogHeader.append(debtMiracleButton);

            $myJQuery(dialog).find("#create-issue-submit").on("click", verifyInputs);
		}
	}

	function miracleButtonHandler(event) {
        let dialog = $myJQuery(event.target).parents(".jira-dialog-core");
        let dialogContent = (dialog).find(".jira-dialog-core-content");

        makeMiracle(dialogContent, event.data.team);
	}

    function makeMiracle(dialogContent, team) {
		let prefilledFields = getPrefilledFieldsByIssueType(dialogContent, team);

		prefilledFields.forEach(function(prefilledField) {
            prefilledField.check(dialogContent);
			prefilledField.apply(dialogContent);

            //epic hack, fill hidden select with selected option
            if (prefilledField.readableName == "Epic") {
                let epicHiddenSelect = dialogContent.find("#customfield_24502");
                epicHiddenSelect.find("option").remove();
                if (prefilledField.value == "OA - Tech. Debts") {
                    epicHiddenSelect.append("<option value='key:DGSTR-434' title='undefined' selected='selected'>OA - Tech. Debts</option>");
                } else {
                    epicHiddenSelect.append("<option value='key:DGSTR-433' title='undefined' selected='selected'>OS - Tech. Debts</option>");
                }

                dialogContent.find("#customfield_24502-field, #customfield_24502-single-select .drop-menu").one("click", function() {
                    dialogContent.find("#customfield_24502-field").val("");
                    dialogContent.find("#customfield_24502 option").remove();
                });
            }
		});
	}

    function debtButtonHandler(event) {
        let dialog = $myJQuery(event.target).parents(".jira-dialog-core");
        let dialogContent = (dialog).find(".jira-dialog-core-content");

        addLabels(dialogContent, event.data.labels);
	}

    function addLabels(dialogContent, labels) {
        let labelsTextArea = dialogContent.find("#labels-textarea");
        labels.forEach(function(label){
            //set value, simulate click and then lost focus
            labelsTextArea.val(label).click().blur();
        });
    }

    function verifyInputs(event) {
        let dialog = $myJQuery(event.target).parents(".jira-dialog-core");
        let dialogContent = (dialog).find(".jira-dialog-core-content");

        let prefilledFields = getPrefilledFieldsByIssueType(dialogContent);

        let project = dialogContent.find("#project-field").val();
        let issueType = dialogContent.find("#issuetype-field").val();
        if (project == "Digital SK Tribe (DGSTR)") {

            if (issueType == "Task") {
                if(!confirm("I am not sure that you realy need 'Task' type, maybe 'Story' will be better. Continue?")) {
                    return false;
                }
            }
        }

        let fieldsFilled = true;
        prefilledFields.forEach(function(prefilledField) {
            if(!prefilledField.check(dialogContent)) {
                fieldsFilled = false;
                alert("Please fill value in " + prefilledField.readableName);
            }
		});

        return fieldsFilled;
    }

    function getPrefilledFieldsByIssueType(dialogContent, team) {
        let newSquadNameValue;
        let epic;

        if (team == "oneApp") {
            newSquadNameValue = "46604"; //SQUAD: OneApp 1 (DGSTR);
            epic = "OA - Tech. Debts";
        } else {
            newSquadNameValue = "46606"; //SQUAD: OneShop 1 (DGSTR);
            epic = "OS - Tech. Debts";
        }

        let descriptionTextArea = new ElementConfig("#description", null, "Description"); //empty
        let componentsTextArea = new ElementConfig("#components-textarea", null, "Components"); //empty

		let epicInput = new ElementConfig("#customfield_24502-field", epic, "Epic");
        let squadNameSelect = new ElementConfig("#customfield_26901", newSquadNameValue, "Squad Name");

		let issueTypeToFieldMap = {
			//Epic
            "11200": [descriptionTextArea, epicInput, squadNameSelect],
            //Task
            "10003": [descriptionTextArea, epicInput, squadNameSelect],
			//Sub-task
            "10300": [descriptionTextArea, squadNameSelect],
			//Story
            "11221": [descriptionTextArea, epicInput, squadNameSelect],
			//Bug
            "10301": [descriptionTextArea, epicInput, squadNameSelect]
		};

		let issueType = dialogContent.find("#issuetype").val();
		return issueTypeToFieldMap[issueType];
    }

	function ElementConfig(selector, value, readableName) {
		this.selector = selector;
		this.value = value;
		this.readableName = readableName;
		this.apply = function (parentElement) {
			if (this.value == null) {
                return;
            }
            let element = parentElement.find(this.selector);
			if (element.is(":checkbox, :radio")) {
				element.prop('checked', this.value);
			} else if (element.is("input, textarea")) {
				element.val(this.value);
			} else if (element.is("select")) {
				element.val(this.value);
			}
		};
        this.check = function (parentElement) {
			let element = parentElement.find(this.selector);
			if (element.parents(".qf-form.qf-configurable-form").length === 1 && element.parents(".qf-field-active").length === 0) {
				alert("Missing required field '" + this.readableName + "'");
                return false;
			}
			if (element.is(":checkbox, :radio")) {
				return parentElement.find("[name='"+element.attr("name")+"']:checked").length != 0;
			} else if (element.is("input, textarea")) {
				return element.val().length != 0;
			} else if (element.is("select")) {
				return element.val() != null;
			} else {
                return true;
            }
		}
	}
})();
