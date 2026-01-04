// ==UserScript==
// @name         ServiceNow - ITSM - Add Markdown Preview
// @namespace    https://www.fruitionpartners.nl/
// @version      0.4
// @description  Add a Preview as Markdown below textarea fields in a ServiceNow form.
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/incident.do?*
// @match        https://*.service-now.com/change_request.do?*
// @match        https://*.service-now.com/rm_story.do?*
// @match        https://*.service-now.com/sys_update_set.do?*
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js#sha256=jl1+DOsSs9uABTKppOJ2GF8kXoc3XQzBtFFyS0i9Xoo
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js#sha256=Uv3H6lx7dJmRfRvH8TH6kJD1TSK1aFcwgx+mdg3epi8=
// @resource     css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/406039/ServiceNow%20-%20ITSM%20-%20Add%20Markdown%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/406039/ServiceNow%20-%20ITSM%20-%20Add%20Markdown%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof g_form === 'undefined') return;

    // True if Preview should be shown instead of the normal textarea field on page load
    const DEFAULT_ENABLED = true;
    // Fields to add Markdown Preview to.
    // Supports '<fieldName>' as well as '<tableName>.<fieldName>' syntax so it only adds a Preview for that field in a specific table's form.
    const FIELDS_MAP = [
        'description',
        'incident.u_steps_to_reproduce',
        'comments_and_work_notes'
    ];

    GM_addStyle(GM_getResourceText("css"));
    GM_addStyle(`
.__preview {
  border: 1px solid #bbb;
  margin: 0em 0;
  padding: 0em 0.5em;
  border-radius: 0.3em;
  background: #eee;
  min-height: 64px;
  max-height: 435px;
  overflow: auto;
}
html.compact .__preview {
  min-height: 48px;
}
.__preview > * { max-width: 720px }
.__md_button {
  margin-right: 0.3em;
  color: green;
}
`);

    showdown.extension('snownumber', function() {
        return [
            {
                type: 'lang',
                regex: /(?<!\[.+)STRY(0*)(\d+)(?!.*\])/,
                replace: '[$&](/rm_story.do?sysparm_query=number=$&^ORnumberCONTAINS$1$2^ORnumberENDSWITH$2)'
            }, {
                type: 'lang',
                regex: /(?<!\[.+)INC(0*)(\d+)(?!.*\])/g,
                replace: '[$&](/incident.do?sysparm_query=number=$&^ORnumberCONTAINS$1$2^ORnumberENDSWITH$2)'
            }, {
                type: 'lang',
                regex: /(?<!\[.+)CHG(0*)(\d+)(?!.*\])/g,
                replace: '[$&](/change_request.do?sysparm_query=number=$&^ORnumberCONTAINS$1$2^ORnumberENDSWITH$2)'
            }, {
                type: 'lang',
                regex: /(?<!\[.+)PRJ(0*)(\d+)(?!.*\])/g,
                replace: '[$&](/pm_project.do?sysparm_query=number=$&^ORnumberCONTAINS$1$2^ORnumberENDSWITH$2)'
            }, {
                type: 'lang',
                regex: /(?<!\[.+)PRJTASK(0*)(\d+)(?!.*\])/g,
                replace: '[$&](/pm_project_task.do?sysparm_query=number=$&^ORnumberCONTAINS$1$2^ORnumberENDSWITH$2)'
            }
        ];
    });

    showdown.extension('codehighlight', function() {
        function htmlunencode(text) {
            return (
                text
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
            );
        }
        return [
            {
                type: 'output',
                filter: function (text, converter, options) {
                    // use new shodown's regexp engine to conditionally parse codeblocks
                    var left  = '<pre><code\\b[^>]*>',
                        right = '</code></pre>',
                        flags = 'g',
                        replacement = function (wholeMatch, match, left, right) {
                            // unescape match to prevent double escaping
                            match = htmlunencode(match);
                            return left + hljs.highlightAuto(match).value + right;
                        };
                    return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
                }
            }
        ];
    });

    const showdownOpts = {
        omitExtraWLInCodeBlocks: true,
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        simpleLineBreaks: true,
        underline: true,
        tasklists: true,
        disableForced4SpacesIndentedSublists: true,
        extensions: ['codehighlight', 'snownumber'],
    };

    let sd = new showdown.Converter(showdownOpts);

    FIELDS_MAP.forEach(createPreview);

    function createPreview(fieldName) {
        if (fieldName === 'comments_and_work_notes') return replaceActivityBody();
        if (!g_form.hasField(fieldName)) return;
        // Support 'table.field' syntax as well as 'field'.
        fieldName = fieldName.split('.').pop();
        let element = g_form.getElement(fieldName);
        // field is not a textarea
        if (element.type !== 'textarea') return;
        // If Preview for this field doesn't exist yet, create it
        if (!document.querySelector('#preview_'+fieldName)) {
            let previewElement = document.createElement('div');
            previewElement.id = 'preview_'+fieldName;
            previewElement.classList.add('__preview');
            if (!DEFAULT_ENABLED && !element.readOnly) {
                previewElement.hide();
            } else {
                element.hide();
            }
            element.insertAdjacentElement('afterend', previewElement);
            element.addEventListener('input', updatePreview);

            let button = document.createElement('button');
            button.id = 'button_'+fieldName;
            button.addEventListener('click', showHidePreview);
            button.setAttribute('class', 'btn btn-default icon-script __md_button');
            g_form.getLabel(fieldName).insertAdjacentElement('afterbegin', button);
        }
        updatePreview({target: g_form.getElement(fieldName)});
    }
    function replaceActivityBody() {
        document.querySelectorAll('span.sn-widget-textblock-body.sn-widget-textblock-body_formatted').forEach(element => {
            element.innerHTML = sd.makeHtml(element.innerText);
        });
    }
    function updatePreview(event) {
        if (!event || !event.target) return;
        let element = event.target;
        let fieldName = typeof element.id === 'string' ? element.id.split('.')[1] : '';
        if (!fieldName) return;
        let previewElement = document.querySelector('#preview_'+fieldName);
        previewElement.innerHTML = sd.makeHtml(element.value);
    }
    function showHidePreview (event) {
        if (!event || !event.target) return;
        let element = event.target;
        let fieldName = typeof element.id === 'string' ? element.id.split('button_')[1] : '';
        if (!fieldName) return;
        let formElement = g_form.getElement(fieldName);
        let previewElement = document.querySelector('#preview_'+fieldName);
        if (!previewElement) return;
        formElement.toggle();
        previewElement.toggle();
    }
})();