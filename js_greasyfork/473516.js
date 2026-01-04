// ==UserScript==
// @name                Add log signature
// @version				0.0.1
// @namespace	        https://github.com/todeit02/geocaching-com_add_log_signature
// @description	        Automatically adds your signature when creating logs on geocaching.com. With configurable content and desired log types.
// @grant				GM_registerMenuCommand
// @require             https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant               GM_getValue
// @grant               GM_setValue
// @grant				GM_notification
// @grant               GM.getValue
// @grant               GM.setValue
// @grant				GM.notification
// @include				/^https:\/\/www\.geocaching\.com\/seek\/log\.aspx.*$/
// @include				/^https:\/\/www\.geocaching\.com\/play\/geocache\/.+\/log$/
// @run-at              document-end
// @connect				*
// @downloadURL https://update.greasyfork.org/scripts/473516/Add%20log%20signature.user.js
// @updateURL https://update.greasyfork.org/scripts/473516/Add%20log%20signature.meta.js
// ==/UserScript==


"use strict";

const OLD_LOG_PAGE_PATHNAME = "/seek/log.aspx"
const NEW_LOG_PAGE_PATHNAME_REGEX = /\/play\/geocache\/.+\/log/;

const LOG_TYPES = [
    {
        id: 2,
        name: "Found it"
    },
    {
        id: 3,
        name: "Didn't find it"
    },
    {
        id: 4,
        name: "Write note"
    },
    {
        id: 7,
        name: "Needs Archived"
    },
    {
        id: 9,
        name: "Will attend"
    },
    {
        id: 45,
        name: "Needs Maintenance"
    }
];
const LOG_TYPE_CONFIG_FIELD_PREFIX = "logType";

(async () =>
{
    const isNewLogPage = NEW_LOG_PAGE_PATHNAME_REGEX.test(window.location.pathname);
    const isOldLogPage = (window.location.pathname === OLD_LOG_PAGE_PATHNAME);
    if(!isNewLogPage && !isOldLogPage) throw new Error("Unrecognized log page.");

    let logInputElement = null;
    let logTypeSelect = null;
    if(isNewLogPage)
    {
        logInputElement = document.querySelector("#LogText");
        logTypeSelect = await waitForNewLogTypeSelect();
    }
    else if(isOldLogPage)
    {
        logInputElement = document.querySelector("#ctl00_ContentBody_LogBookPanel1_uxLogInfo");
        logTypeSelect = document.querySelector("#ctl00_ContentBody_LogBookPanel1_ddLogType");
    }

	const configPanel = await initializeConfigurability(LOG_TYPES);    
    
    GM_registerMenuCommand("Configuration", () =>
    {
        configPanel.open();
    });

	if(!configPanel.get("configHasBeenOpen"))
	{
		showMissingConfigurationNotification(configPanel);
		return;
	}

	const signature = configPanel.get("signature");
	const onlyInNewLogs = configPanel.get("onlyInNewLogs");

    const logInput = LogInput(logInputElement, signature);

    logTypeSelect.addEventListener("change", handleLogTypeChange);

    const selectedLogTypeId = parseInt(logTypeSelect.value);
    if(isNaN(selectedLogTypeId)) throw new UnrecognizedLogTypeError(logTypeSelect.value);

    const currentText = logInput.domElement.value;
    if(shouldSignLog(selectedLogTypeId, currentText, onlyInNewLogs)) logInput.appendSignature();


    function shouldSignLog(currentLogTypeId, currentText, onlyInNewLogs)
    {
        return shouldSignLogType(currentLogTypeId) && shouldSignLogText(currentText, onlyInNewLogs);
    }


    function shouldSignLogType(logTypeId)
    {
        const logTypeIsUnselected = logTypeId < 0;
        if(logTypeIsUnselected) return true;

        return configPanel.get(LOG_TYPE_CONFIG_FIELD_PREFIX + logTypeId);
    }


    function shouldSignLogText(logText, onlyInNewLogs)
    {
        return !logInput.logIsSigned() && (!onlyInNewLogs || (logText.length === 0));
    }


    function handleLogTypeChange()
    {
        const logTypeId = parseInt(logTypeSelect.value);
        if(isNaN(logTypeId)) throw new UnrecognizedLogTypeError(logTypeSelect.value);

        if(logInput.containsOnlySignature()) logInput.domElement.value = ''

        const currentText = logInput.domElement.value;
        if(shouldSignLog(logTypeId, currentText, onlyInNewLogs)) logInput.appendSignature();
    }


	function showMissingConfigurationNotification(configPanel)
	{
		const notificationOptions = Object.freeze(
		{
			title: "Missing Signature Text",
			text: "You haven't specified a signature yet.\n\nClick here to configure.",
			silent: true,
			onclick: () => void configPanel.open(),
		});
		
		GM_notification(notificationOptions);
	}


    function LogInput(inputElement, signature)
    {
        function containsOnlySignature()
        {
            return (inputElement.value === signature);
        }

        function appendSignature()
        {
            const currentText = inputElement.value;
            const texts = [currentText, signature].filter(text => !!text);
            inputElement.value = texts.join("\n");
        }

        function logIsSigned()
        {
            const currentText = inputElement.value;
            currentText.endsWith(signature);
        }

        return {
            appendSignature,
            logIsSigned,
            containsOnlySignature,
            domElement: inputElement,
        };
    }


    function waitForNewLogTypeSelect()
    {
        return new Promise(resolve =>
        {
            const intervalId = window.setInterval(() =>
            {
                const element = document.querySelector("select.log-types");
                if(element)
                {
                    window.clearInterval(intervalId);
                    resolve(element);
                }
            }, 100);
        });
    }


    function initializeConfigurability(logTypes)
    {
        const logTypeFieldEntries = logTypes.map((logType, i) =>
        {
            const fieldName = LOG_TYPE_CONFIG_FIELD_PREFIX + logType.id;
            const fieldEntry =
            {
                section: (i === 0) ? ["Log types to sign"] : undefined,
                label: logType.name,
                type: "checkbox",
                default: true,
            };

            return [fieldName, fieldEntry];
        });
        const logTypeFields = Object.fromEntries(logTypeFieldEntries);

        const fields = Object.freeze(
        {
            "signature":
            {
                "label": 'Signature',
                "type": 'textarea',
                "section": ["General settings"],
            },
            "onlyInNewLogs":
            {
                "label": 'Insert only for new logs',
                "type": 'checkbox',
                "default": true,
            },
            ...logTypeFields,
            "configHasBeenOpen":
            {
                'type': 'hidden',
                'value': '',
            },
        });

        return new Promise(resolve =>
        {
            const gmConfigConfig =
            {
                id: 'geocaching-log-singature',
                title: "Log Signature Settings",
                fields,
                events:
                {
                    open: () => configPanel.set("configHasBeenOpen", "yes"),
                    init: () => resolve(configPanel),
                },
            };
        
            const configPanel = new GM_config(gmConfigConfig);
        });
    }


    class UnrecognizedLogTypeError extends Error
    {
        constructor(logType)
        {
            super(`Unrecognized log type ID "${logType}".`);
        }
    }
})();