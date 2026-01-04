// ==UserScript==
// @name         erai-raws sub preview Image
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Show image preview next to the anime subtitles.
// @author       dr.bobo0
// @match        https://www.erai-raws.info/subs/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAMFBMVEVHcEy3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISFbcynrAAAAD3RSTlMA1OaywnKHOhgNXPQmnEsN6GgJAAACVUlEQVRYhe1WSYKEIAyUfZf//3YgLAbEbpzrTJ1EKbJVIsfxj78Ck/BLqj4lI9TF6Ci3r8mW0YjBX7EliTeIbfo5sAkPQQaWHjbp6qKTYH07NEa6x5eNzawuB6YzfHIghi1+qBmztXI21UBleqRbtVRAD7qtxRXOnhZ49h1tbXS6K4NUejmtc0DnJv04UgU8XvvAgtVPuxcQ2dvfKh/AS/2F8otjjLJCJlh//9bRdZBbiBLCawBKcoc+fdI1OiJD5sbit854ELa2gbpx57lgx7UwtRh70FHCGcdNTa3y2mh/ZsHOiTiRIcrkCVkUzZ3i1xW5mgRz2G7IsavwtTNc8JAYhghkWPUWdkHhY8EssTWxw0wiOI0t72RWfIqKqWPF97gONfiF4o2ATIkbP2u+vyh8oo4nnPe6B5TR4v8HZak7HzhV6xqK9KHhPGwYXjFsUqxl6V0NUedKOGxA0aGkKQPu3nhnc9HAbiQ6mK9YEmQV/xUjCOTKb5mvQyPMMyhb5d0GPLXyatHkivXCsAFAmcQQF9gjUsB/toudmWk7zqGpVqAu02So9Mlhk3cLaD3je+uz7kpgmM3FveD13+HQIKEQta0CpuUzYUKtx+3saJ13IMD8P8sldUtmw/A7b1cRUGgEh8dKLuFF4GkApznUX9GLlrMgn6hP4Kjcdq32j4BZ1qxCNO/4YpQ7/Z6EEaUA1/ptElABLofeJIHMdVPvkgAJHFrc4J78CjUmsPvE1tvvoPF+I5OlHbauKmol3JLWuHWAnxNQ3jJKw+ZdybLXN/t//HX8ACejMFAROu21AAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476119/erai-raws%20sub%20preview%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/476119/erai-raws%20sub%20preview%20Image.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const FLAG_URL_PREFIX = "https://www.erai-raws.info/wp-content/themes/generatepress_child/flags/4x3/";
    const ICON_STYLE = {
        width: "20px",
        height: "20px",
        marginRight: "5px"
    };

    // Language code to flag mapping
    const languageFlags = {
        ".ara": "sa.svg",
        ".eng": "us.svg",
        "hrv.ass": "hr.svg",
        ".por": "br.svg",
        ".spa.ass": "es.svg",
        ".fre": "fr.svg",
        ".ita": "it.svg",
        ".may": "my.svg",
        ".cat": "es-ct.svg",
        ".baq": "es-pv.svg",
        ".glg": "es-ga.svg",
        ".fil": "ph.svg",
        ".tam": "lk.svg",
        ".rus": "ru.svg",
        ".ger": "de.svg",
        ".pol": "pl.svg",
        ".dut": "nl.svg",
        ".nob": "no.svg",
        ".fin": "fi.svg",
        ".tur": "tr.svg",
        ".swe": "se.svg",
        ".gre": "gr.svg",
        ".rum": "ro.svg",
        ".kor": "kr.svg",
        ".dan": "dk.svg",
        ".chi": "cn.svg",
        ".hun": "hu.svg",
        ".cze": "cz.svg",
        ".slo": "sk.svg",
        ".jpn": "jp.svg",
        ".heb": "il.svg",
        ".ind": "id.svg",
        ".hin": "in.svg",
        ".ukr": "ua.svg",
        ".tha": "th.svg",
        ".vie": "vn.svg"
    };

    // Add an icon before the text in span.file-name
    function addIconBeforeFileName() {
        const fileNameElements = document.querySelectorAll("span.file-name");

        fileNameElements.forEach((element) => {
            const fileName = element.textContent;

            // Check if it matches a language code and insert the corresponding flag icon
            for (const [langCode, flagFile] of Object.entries(languageFlags)) {
                if (fileName.includes(langCode)) {
                    // Create icon element
                    const icon = document.createElement("img");
                    icon.src = FLAG_URL_PREFIX + flagFile;

                    // Apply icon styles
                    Object.assign(icon.style, ICON_STYLE);

                    // Insert the icon before the text
                    element.insertBefore(icon, element.firstChild);
                    break; // Stop after inserting the first matching flag
                }
            }

            // Special case for Latin American Spanish
            if (fileName.includes("5.spa") || fileName.includes("la.spa")) {
                const icon = document.createElement("img");
                icon.src = `${FLAG_URL_PREFIX}mx.svg`;

                Object.assign(icon.style, ICON_STYLE);

                element.insertBefore(icon, element.firstChild);
            }
        });
    }

    // Run the function to add icons
    addIconBeforeFileName();

})();