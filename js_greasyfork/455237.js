// ==UserScript==
// @name            Participants: Students' lists
// @name:ca         Participants: Llistes d'estudiants
// @name:en         Participants: Students' lists
// @name:es         Participantes: Listas de estudiantes
// @version         0.7.3
// @author          Antonio Bueno <antonio.bueno@udg.edu>
// @description     Generates student/group and student/teacher lists
// @description:ca  Genera llistes estudiant/grup i estudiant/professor
// @description:en  Generates student/group and student/teacher lists
// @description:es  Genera listas estudiante/grupo y estudiante/profesor
// @license         MIT
// @namespace       https://github.com/buenoudg/Ajudant-UdGMoodle
// @supportURL      https://github.com/buenoudg/Ajudant-UdGMoodle/issues
// @match           https://moodle.udg.edu/user/index.php?*
// @match           https://moodle2.udg.edu/user/index.php?*
// @icon            https://raw.githubusercontent.com/buenoudg/Ajudant-UdGMoodle/master/udgmoodle_icon_38x38@2x.png
// @require         https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/toastify-js@1/src/toastify.min.js
// @resource        toastifyCSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/455237/Participants%3A%20Students%27%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/455237/Participants%3A%20Students%27%20lists.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const langs = { // localization of text in buttons and downloaded file names
        "ca": {
            "ALL_TEXT": "Mostra'ls tots",
            "SGL_TEXT": "Llista estudiant/grup",
            "SPL_TEXT": "Llista estudiant/professor",
            "SGL_FILE": "estudiant_grup",
            "SPL_FILE": "estudiant_professor"
        },
        "en": {
            "ALL_TEXT": "Show them all",
            "SGL_TEXT": "Student/group list",
            "SPL_TEXT": "Student/professor list",
            "SGL_FILE": "student_group",
            "SPL_FILE": "student_professor"
        },
        "es": {
            "ALL_TEXT": "Mostrarlos todos",
            "SGL_TEXT": "Lista estudiante/grupo",
            "SPL_TEXT": "Lista estudiante/profesor",
            "SGL_FILE": "estudiante_grupo",
            "SPL_FILE": "estudiante_profesor"
        },
    };

    const info = {}; // to be filled with static page details once the DOM is ready

    const tableToCsvDataUrl = (table, lang="en") => { // used to generate the downloadable files
        const delimiter = new Intl.NumberFormat(lang).format(1.1).charAt(1) == '.' ? ',' : ';';
        // This assumes the data doesn't contain double quotes or line breaks
        const csv = table.map(row => row.map(c => c.includes(delimiter) ? `"${c}"` : c).join(delimiter)).join("\r\n");
        return `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csv)}`; // MS Excel needs the \uFEFF
    };

    const getUserData = () => { // used to extract all the relevant data from the main table
        let users = [];
        $(".userinitials:not([alt])").attr("alt", function() { return $(this).text() }).text("");
        $("#participants tbody tr").not(".emptyrow").each(function () {
            const $cells = $(this).children();
            let user = { "name": $cells.eq(info.column.fullname).text().trim() };
            if (info.column.email >= 0) user.mail = $cells.eq(info.column.email).text().trim();
            user.groups = $cells.eq(info.column.groups).text().trim().split(", ").filter(g=>info.groups.includes(g));
            if (info.column.idnumber >= 0) user.id = $cells.eq(info.column.idnumber).text().trim();
            user.role = $cells.eq(info.column.roles).text().trim();
            if (user.role == info.noRole) user.role = undefined;
            users.push(user);
        });
        return users;
    };

    const updateLists = () => { // called everytime the table changes

        // (Re-)generate the lists
        let users = getUserData(), obj;
        const professors = users.filter(user => user.role && (user.role != info.studentRole) && user.groups.length);
        const groups = professors.reduce(
            (obj, p) => (p.groups.map(g => { if (!obj[g]) obj[g] = []; obj[g].push([p.name, p.id]); }), obj), {}
        );
        const students = users.filter(user => user.role == info.studentRole);
        const SGList = students.map(student => student.groups
            .map(group => [info.courseId, student.name, student.id, student.mail, group])
        ).flat();
        const SPList = students.map(student => student.groups
            .filter(group => group in groups)
            .map(group => groups[group].map(professor => [info.courseId, student.name, student.id, professor].flat()))
            .flat()
        ).flat().filter((obj = {}, item => !(obj[item] = item in obj)));

        // Also update the UdGMoodle buttons
        if (!$("#udgmoodle_buttons").length) { // button container
            $("h2+div").prepend('<div id="udgmoodle_buttons">');
        }
        $("#udgmoodle_buttons .showall, #udgmoodle_buttons .sglist, #udgmoodle_buttons .splist").remove();
        if ($("nav.pagination").length) { // not the full list? link to it
            $("#udgmoodle_buttons").append(`<a class="showall" href="${info.fullListUrl}">${info.lang.ALL_TEXT}</a>`);
        } else { // already in the full list
            if (SGList.length) {
                $("#udgmoodle_buttons").append(`<a class="sglist" download="${info.courseId}_${info.lang.SGL_FILE}.csv"
                    href="${tableToCsvDataUrl(SGList, info.lang.code)}">${info.lang.SGL_TEXT}</a>`);
            }
            if (SPList.length) {
                $("#udgmoodle_buttons").append(`<a class="splist" download="${info.courseId}_${info.lang.SPL_FILE}.csv"
                    href="${tableToCsvDataUrl(SPList, info.lang.code)}">${info.lang.SPL_TEXT}</a>`);
            }
        }

    };

    // CSS for the UdGMoodle buttons
    GM_addStyle('' + `
        #udgmoodle_buttons { text-align: right; width: 100% }
        #udgmoodle_buttons a { background-color: #568; border-radius: 1.2em; color: white; display: inline-block;
            margin: 4px 8px 0 0; padding: 0.425rem 1.25rem; text-decoration: none !important }
        #udgmoodle_buttons a:hover { background-color: #78A; color: white; text-shadow: 0 1px 2px #000A }
    `);

    // CSS for the user initials
    GM_addStyle('' + `
        .userinitials:not([alt]) { color: red }
        .userinitials[alt]:before { content: attr(alt) }
    `);

    /*
     * DOM manipulation courtesy of jQuery
     */

    // Modifications applied once the DOM has been build (images may be still loading)
    $(document).ready(function () {

        // Makes clear what script is running and its version
        notification(GM.info.script[`name:${navigator.language.slice(0,2)}`] + " " + GM.info.script.version, "hello", 3);

        // Watches for changes in the page's main table
        const targetNode = document.getElementById("participantsform"); // node to watch
        const config = { attributes: false, childList: true, subtree: true }; // observer parameters
        const callback = () => { // called when changes are detected
            clearTimeout(timer);
            timer = setTimeout(updateLists, 1000); // limit calls to once per second
        };
        const observer = new MutationObserver(callback); // associate the callback to an observer
        observer.observe(targetNode, config); // start monitoring the target for changes

        // Static details from the initial DOM
        info.column = { "fullname": $("#participants tbody tr th").index() };
        ["idnumber", "email", "roles", "groups"].forEach(i =>
            info.column[i] = $(`#participants thead [data-column="${i}"]`).parents("th").index()
        );
        info.courseId = document.title.split("/")[0];
        info.fullListUrl = String(document.location).replace(/(&perpage=\d+|perpage=\d+&)/img, "") + "&perpage=5000";
        info.lang = $("html").attr("lang").slice(0,2) || "en";
        info.lang = Object.assign({code: info.lang}, langs[info.lang]);
        info.noRole = $("select[data-field-name='roles'] option[value='-1']").text();
        info.studentRole = $("select[data-field-name='roles'] option[value='5']").text();
        info.groups = [...$("select[data-field-name='groups'] option:not([value='-1']")].map(i=>i.text);

        // Initial list generation
        let timer = setTimeout(updateLists);

    });

    /*
     * Notifications courtesy of Toastify JS (see https://apvarun.github.io/toastify-js/)
     */

    GM_addStyle(GM_getResourceText("toastifyCSS") + `
        div.toastify { margin: inherit; width: inherit; border-radius: 1.5em; font-family:
            -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif }
    `);
    function notification(message, type = "info", timeout = 5) {
        // The "type" parameter accepts four values: "info", "warning", "error" and "hello"
        // The "timeout" parameter is expressed in seconds although Toastify uses milliseconds
        let color, icon;
        switch (type) {
            case "warning": color = "rgba(201, 201, 0, 0.8)"; icon = "⚠️"; break;
            case "error": color = "rgba(201, 51, 51, 0.8)"; icon = "🛑"; break;
            case "hello": color = "rgba(51, 153, 51, 0.8)"; icon = "👋🏼"; break;
            default: color = "rgba(51, 51, 153, 0.8)"; icon = "📢";
        }
        Toastify({
            text: icon + " " + message, duration: timeout * 1000, gravity: "bottom", style: { background: color }
        }).showToast();
    }

})();
