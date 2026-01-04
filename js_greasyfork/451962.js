// ==UserScript==
// @name         meaningful titles for human design charts from jovianarchive
// @description  This script adds the name, profile and type of a requested chart to the title tag. This is helpful when you want to use your browsers history to find a specific chart.
// @version      1
// @grant        none
// @license      Do what you want, but don't blame me.
// @include      https://www.jovianarchive.com/Get_Your_Chart?data=*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @namespace https://greasyfork.org/users/770178
// @downloadURL https://update.greasyfork.org/scripts/451962/meaningful%20titles%20for%20human%20design%20charts%20from%20jovianarchive.user.js
// @updateURL https://update.greasyfork.org/scripts/451962/meaningful%20titles%20for%20human%20design%20charts%20from%20jovianarchive.meta.js
// ==/UserScript==

// which fields do you want to see? check chartProperties for options
const fields = [
    'name',
    //'date',
    'profile',
    'type',
    //'strategy',
    //'inner authority',
];
const separator = " | ";
// ---- do not edit below this line ------------------------

const chartProperties = [ 'type', 'strategy', 'not-self theme', 'inner authority', 'profile',
                          'definition', 'incarnation cross', 'date', 'place', 'name' ];

function getFieldValue(fieldIndex) {
    const index = chartProperties.indexOf(fieldIndex);
    return document.querySelectorAll(".chart_properties")[0].querySelectorAll('li')[index].innerHTML.replace(/.*> (.*)/i, "$1").trim();
}

const l = console.log;

const updateTitle = function () {
    //l("updateTitle");
    const newTitle = fields
        .map(function (field) {
            return getFieldValue(field);
        })
        .filter(function (value) {
            return value;
        })
        .join(separator);
    document.title = newTitle;
    //l({newTitle});
}

function check() {
    //l('check');

    if (!location.href.startsWith("https://www.jovianarchive.com/Get_Your_Chart?data=")) {
        //l("no profile")
        return;
    }
    if (!document.querySelectorAll(".chart_bodygraph_container").length) {
        //l("no graph visible") // this happens when the form is not yet submitted
        return;
    }
    if (!document.title.includes("Your Chart")) {
        //l("no default title")
        return;
    }

    updateTitle();
}

check();
