// ==UserScript==
// @name         Ludus Colors
// @namespace    http://tampermonkey.net/
// @version      0.5.15.1
// @description  Ludus colors; gør Ludus bare lidt sjovere!
// @author       Rasmus Stenholt Jakobsen
// @license      Do What The F*ck You Want To Public License
// @match        https://ludus.sde.dk/ui/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_info
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/484380/Ludus%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/484380/Ludus%20Colors.meta.js
// ==/UserScript==
/* eslint-disable */

let fagListObj = JSON.parse(GM_getValue('keyFagListObj', JSON.stringify({ size: 0 })));

const classNames = ["ugeskema-skemabrik-element", "ugeskema-begivenhed-element", "ugeskema-aendret-lektion-element"];

//linear-gradient(rgb(178, 224, 255) 0%, rgb(155, 208, 238) 18px, rgb(107, 172, 209) 19px, rgb(239, 247, 253) 20px, rgb(239, 247, 253) 100%);
//linear-gradient(rgb(214, 214, 214) 0%, rgb(196, 196, 196) 18px, rgb(157, 157, 157) 19px, rgb(245, 245, 245) 20px, rgb(245, 245, 245) 100%);

(function () {
    'use strict';

    function customizeColors() {
        let fagListObj = JSON.parse(GM_getValue('keyFagListObj', JSON.stringify({ size: 0 })));
        let opacity = fagListObj.opacity || 1;

        for (let i = 0; i < classNames.length; i++) {
            $('div.' + classNames[i]).each(function () {
                let fag = $(this).find(".v-label-text-ellipsis").first().text().replace(/ /g, "_"); //maybe loop through every index here?
                const color = getColor(fag).toString();
                const rgb = hexToRgb(color);
                const op = ".6"

                if (!color) {
                    updateColor(fag, getRandomColor());
                    GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
                }

                $(this).css("background", "linear-gradient(rgba(214, 214, 214, "+op+") 0%, rgba(196, 196, 196, "+op+") 18px, rgba(157, 157, 157, "+op+") 19px, rgba(245, 245, 245, "+op+") 20px, rgba(245, 245, 245, "+op+") 100%), "+color);
                $(this).css("background-blend-mode","luminosity");
                $(this).css("border-radius","10px");
                //$(this).css("background", "linear-gradient(rgba(214, 214, 214, .5), rgba(196, 196, 196, .5)), "+color);
                //getColor(fag) + opacityToString(opacity)
                //$(this).css("background-image", "none");
                //$(this).css("background", color);
            });
        }
    }

    function lerp(v1, v0, t) {
        return (1 - t) * v0 + t * v1;
    }

    function underlineCurrentDate() {
        const ugeDage = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
        const currentDate = new Date();
        const day = currentDate.getDate().toString();
        const month = (currentDate.getMonth() + 1).toString();
        const formattedDate = `${day}.${month}`;  //Formated as DD/MM

        $("div.v-slot").each(function () {
            if ($(this).text().includes("(" + formattedDate) && $(this).text().includes(ugeDage[currentDate.getDay()])) {
                $(this).css("text-decoration-line", "underline");
            }
        });
    }

    underlineCurrentDate();

    function getColor(fag) {
        let color = fagListObj[fag];
        if (!fagListObj[fag]) {
            color = getRandomColor()
            updateColor(fag, color);
            GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
        }
        return fagListObj[fag] || color;
    }

    function updateColor(fag, color) {
        fagListObj[fag] = color;
        GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
    }

    function opacityToString(opacity) {
        return Math.round(opacity * 255).toString(16).padStart(2, '0');
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function hexToRgb(hex) {
        hex = hex.toString().replace(/^#/, '');
        if (hex.length === 3)
            hex = hex.replace(/(.)/g, '$1$1');
        return hex.match(/.{2}/g).map(function (c) { return parseInt(c, 16); });
    };

    function showColorSettings() {
        if ($('#color-settings-panel').length > 0) {
            $('#color-settings-panel').toggle();
            return;
        }

        let settingsPanel = $('<div>', {
            id: 'color-settings-panel',
            css: {
                position: 'fixed',
                bottom: '40px',
                right: '10px',
                zIndex: 9999,
                backgroundColor: 'white',
                border: "medium solid #0B72D8",
                padding: '10px',
                borderRadius: '7px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'right',
            },
        });

        let closeButton = $('<button>', {
            text: 'Luk',
            css: { marginLeft: '5px' }
        });

        closeButton.on('click', function () {
            settingsPanel.hide();
        });
        let visibleSubjects = new Set();

        const radInput = $('<input>', {
            type: 'number',
            step: "1",
            value: getColor("size"),
            css: { width: '50px' },
            min: "0",
            max: "34",
            change: function () {
                updateColor("size", $(this).val());
            },
        });
        const radLabel = $('<span>', {
            text: "Radius:",
            css: {
                marginRight: '10px',
                marginLeft: "4px",
                padding: '3px',
                borderRadius: '3px',
                color: 'black',
                fontWeight: "bold",
            },
        });

        const radContainer = $('<div>', {
            css: {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px',
            },
        });

        radContainer.append(radLabel, radInput);

        const opInput = $('<input>', {
            type: 'number',
            step: "0.01",
            value: getColor("opacity") || 1,
            css: { width: '50px' },
            min: "0",
            max: "1",
            change: function () {
                updateColor("opacity", $(this).val());
            },
        });

        const opLabel = $('<span>', {
            text: "Opacity:",
            css: {
                marginRight: '10px',
                marginLeft: '1px',
                padding: '3px',
                borderRadius: '3px',
                color: 'black',
                fontWeight: "bold",
            },
        });

        const opContainer = $('<div>', {
            css: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '10px'
            },
        });
        /*
        $('div.ugeskema-skemabrik-element').each(function () {
            let fag = $(this).find('div[v-label]').first().text().replace(/ /g, "_");
            visibleSubjects.add(fag);
        });
        */
        for (let i = 0; i < classNames.length; i++) {
            $('div.' + classNames[i]).each(function () {
                //let fag = $(this).find('div[v-label]').first().text().replace(/ /g, "_");
                let fag = $(this).find(".v-label-text-ellipsis").first().text().replace(/ /g, "_");

                visibleSubjects.add(fag);
            });
        }
        visibleSubjects.forEach((fag) => {
            let key = fag;
            let color = getColor(fag);
            let colorPickerContainer = $('<div>', {
                css: { marginBottom: '10px' }
            });

            let name = key.split(/_/g)[key.split(/_/g).length - 1];

            if (key.split(/_/g)[key.split(/_/g).length - 1].length <= 1) {
                name = key.split(/_/g)[key.split(/_/g).length - 2] + key.split(/_/g)[key.split(/_/g).length - 1];
            }

            if (!name || name == "undefined") {
                name = "andet";
            }

            let subjectNameSpan = $('<span>', {
                //splitter fagnavnet ved hvert mellemrum, og tager den sidste del og sætter
                text: name || "Andet",
                css: {
                    marginRight: '10px',
                    padding: '3px',
                    borderRadius: '3px',
                    backgroundColor: color,
                    color: 'black'
                }
            });

            let input = $('<input>', {
                type: 'text',
                value: color,
                css: { width: '65px' },
                change: function () {
                    fagListObj[key] = $(this).val();
                },
                maxlength: 7
            });

            let randomButton = $('<button>', {
                text: 'Random',
                css: { marginLeft: '10px' }
            });
            randomButton.on('click', function (e) {
                e.preventDefault();
                let newColor = getRandomColor();
                fagListObj[key] = newColor;
                input.val(newColor);
                subjectNameSpan.css('backgroundColor', newColor);
                GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
                customizeColors();
            });
            colorPickerContainer.append(subjectNameSpan, input, randomButton);
            settingsPanel.append(colorPickerContainer);
        });

        let buttonsContainer = $('<div>', {
            css: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px'
            }
        });

        let updateButton = $('<button>', {
            text: 'Opdater',
            css: { marginRight: '5px' }
        });

        const versionLabel = $('<label>', {
            html: '<a style="color:grey;">v' + GM_info.script.version + '</a>' //href="https://rasj.dk/LectioColors++" target="_blank"
        });

        updateButton.on('click', function () {
            // Update the fagListObj object with the new values from the input fields
            settingsPanel.find('input[type="text"]').each(function () {
                let key = $(this).prev('label').text().replace(/ /g, '_');
                fagListObj[key] = $(this).val();

                // Update the background color of the subject name label
                $(this).siblings('span').css('backgroundColor', fagListObj[key]);
            });
            // Save the updated fagListObj to GM storage
            GM_setValue('keyFagListObj', JSON.stringify(fagListObj));
            // Apply the new colors to the elements
            customizeColors();
        });
        // Append the "Update" and "Close" buttons to the container
        buttonsContainer.append(updateButton, versionLabel, closeButton);

        // Append the buttons container to the settings panel
        settingsPanel.append(buttonsContainer);
        $('body').append(settingsPanel);
    }

    // Add a settings button
    let settingsButton = $('<button>', {
        text: 'Farve indstillinger',
        css: {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            backgroundColor: '#0b72d8',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
    });

    settingsButton.on('click', function () {
        showColorSettings();
    });
    $('body').append(settingsButton);

    //runs the colors
    $(document).ready(function() {
        customizeColors(fagListObj);
    });
})();