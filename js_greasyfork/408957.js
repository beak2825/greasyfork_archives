// ==UserScript==
// @name         הודעות להגהות
// @namespace    https://hagaa.remixn.xyz/
// @version      0.24
// @description  מוסיף שלושה כפתורים חדשים לצד פרסום הודעה: הגהה בדרך, הגהה מוכנה והגהה מוכנה + הערות
// @author       RemixN1V - Niv
// @match        https://www.fxp.co.il/showthread.php*
// @license      MIT
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_log
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @include       https://openuserjs.org/scripts/sizzle/The_GM_config_Unit_Test
// @downloadURL https://update.greasyfork.org/scripts/408957/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%94%D7%92%D7%94%D7%95%D7%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/408957/%D7%94%D7%95%D7%93%D7%A2%D7%95%D7%AA%20%D7%9C%D7%94%D7%92%D7%94%D7%95%D7%AA.meta.js
// ==/UserScript==

/* globals GM_config, GM_configStruct */

var fieldDefs = {
    'start': {
        'label': 'תחילת הגהה',
        'section': [GM_config.create('הודעות להגהות'), 'כאן ניתן לערוך את ההודעות שיישלחו בתחילת ובסיום ההגהות שלך.'],
        'type': 'text',
        'default': 'הגהה בדרך.'
    },
    'end': {
        'label': 'סוף הגהה',
        'type': 'text',
        'default': 'הגהה מוכנה.'
    },
    'font': {
        'label': 'פונט להודעות',
        'type': 'select',
        // 'labelPos': 'below',
        'options': ['None', 'Arial', 'Arial Black', 'Arial Narrow', 'Book Antiqua', 'Century Gothic', 'Comic Sans MS', 'Courier New', 'Fixedsys', 'Franklin Gothic Medium', 'Garamond', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype', 'System', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'rancho', 'almoni-dl', 'Open Sans Hebrew'],
        'default': 'None'
    }
};

var frame = document.createElement('div');
document.body.appendChild(frame);

GM_config.init(
    {
        id: 'GM_config',
        title: 'הגדרות – הודעות להגהות',
        fields: fieldDefs,
        css: `#GM_config_section_1 .config_var, #GM_config_section_2 .config_var, #GM_config_section_3 .config_var { margin: 5% !important;display: inline !important; } #GM_config .field_label:after {content: ': ';}`,
        frame: frame,
        events:
        {
            open: function(doc) {

            },
            save: function(values) {
                // All the values that aren't saved are passed to this function
                // for (i in values) alert(values[i]);
                GM_config.close();
            }
        },
        'types':
        {
            'date': {
                'default': null,
                toNode: function(configId) {
                    var field = this.settings,
                        value = this.value,
                        id = this.id,
                        create = this.create,
                        format = (field.format || 'mm/dd/yyyy').split('/'),
                        slash = null,
                        retNode = create('div', { className: 'config_var',
                                                 id: configId + '_' + id + '_var',
                                                 title: field.title || '' });

                    // Save the format array to the field object so
                    // it's easier to hack externally
                    this.format = format;

                    // Create the field lable
                    retNode.appendChild(create('label', {
                        innerHTML: field.label,
                        id: configId + '_' + id + '_field_label',
                        for: configId + '_field_' + id,
                        className: 'field_label'
                    }));

                    // Create the inputs for each part of the date
                    value = value ? value.split('/') : this['default'];
                    for (var i = 0, len = format.length; i < len; ++i) {
                        var props = {
                            id: configId + '_field_' + id + '_' + format[i],
                            type: 'text',
                            size: format[i].length,
                            value: value ? value[i] : '',
                            onkeydown: function(e) {
                                var input = e.target;
                                if (input.value.length >= input.size)
                                    input.value = input.value.substr(0, input.size - 1);
                            }
                        };

                        // Jump to the next input once one is complete
                        // This saves the user a little work
                        if (i < format.length - 1) {
                            slash = create(' / ');
                            props.onkeyup = function(e) {
                                var input = e.target,
                                    inputs = input.parentNode.getElementsByTagName('input'),
                                    num = 0;

                                for (; num < inputs.length && input != inputs[num]; ++num);
                                if (input.value.length >= input.size)
                                    inputs[num + 1].focus();
                            };
                        } else slash = null;

                        // Actually create and append the input element
                        retNode.appendChild(create('input', props));
                        if (slash) retNode.appendChild(slash);
                    }

                    return retNode;
                },
                toValue: function() {
                    var rval = null;
                    if (this.wrapper) {
                        var inputs = this.wrapper.getElementsByTagName('input');
                        rval = '';

                        // Join the field values together seperated by slashes
                        for (var i = 0, len = inputs.length; i < len; ++i) {
                            // Don't save values that aren't numbers
                            if (isNaN(Number(inputs[i].value))) {
                                alert('Date is invalid');
                                return null;
                            }
                            rval += inputs[i].value + (i < len - 1 ? '/' : '');
                        }
                    }

                    // We are just returning a string to be saved
                    // If you want to use this value you'll want a Date object
                    return rval;
                },
                reset: function() {
                    // Empty all the input fields
                    if (this.wrapper) {
                        var inputs = this.wrapper.getElementsByTagName('input');
                        for (var i = 0, len = inputs.length; i < len; ++i)
                            inputs[i].value = '';
                    }
                }
            }
        }
    });

(function() {
    'use strict';

    let start = GM_config.get('start'); //x משפט/מילה לתחילת הגהה
    let end = GM_config.get('end'); //x משפט/מילה לסיום הגהה
    let font = GM_config.get('font');

    let time = 500;


    function writeAsend(t) {
        vB_Editor["vB_Editor_QR"].editor.insertHtml(font == 'None' ? t : `[FONT=${font}]${t}[/FONT]`);
        setTimeout(function(){ $('#qr_submit').click(); }, time);
    }
    function write(t) {
        t = font == 'None' ? t : `[FONT=${font}]${t}[/FONT]`;
        console.log(t);
        vB_Editor["vB_Editor_QR"].editor.insertHtml(t);
    }

    let group = document.getElementsByClassName("group")[2];
    let Mahlaka = $( ".navbit:contains('חדר עבודה')" );

    if (Mahlaka.length > 0) {
        group.innerHTML += `<br>
<input style="margin-top: 3px" type="button" class="button" value="הגהה בדרך" title="הגהה בדרך" name="HBadereh" tabindex="1" id="qr_hagaha_badereh">
<input type="button" class="button" value="הגהה מוכנה" title="הגהה מוכנה" name="HMuhana" tabindex="1" id="qr_hagaha_muhana">
<input type="button" class="button" value="הגהה מוכנה + הערות" title="הגהה מוכנה" name="HMuhana" tabindex="1" id="qr_hagaha_muhana_h">
<br>
<input style="margin-top: 3px" type="button" class="button" value="ערוך הודעות" title="ערוך הודעות" name="eha" tabindex="1" id="qr_edit_ha">`;

        let url = "https://www.fxp.co.il/showthread.php?t=21360826";
        console.log(url);
        fetch(url)
            .then(response => response.text())
            .then(data => {

            let supervisors = {};
            let teams = $(data).find('.content').eq(0).find('tr').eq(1).find('td').map(function (i) {
                if (i == 0) return;
                supervisors[$(this).text().trim()] = i;
                return $(this).text().trim();
            });
            let t = teams.map(function () {
                let sup = $(data).find('.content').eq(0).find('tr').eq(2).find('td').eq(supervisors[this]).find('a').map(function () {
                    return `[taguser]${$(this).attr('href').split('=')[1]}[/taguser]`;
                }).get().join('\n');
                supervisors[this] = sup;
                return sup;
            });

            document.getElementById("qr_hagaha_badereh").addEventListener("click", async function() {
                writeAsend(start);
            });

            document.getElementById("qr_hagaha_muhana").addEventListener("click", async function() {
                //document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append("סבתאל'ה סיימה להגיה");
                for(const key of Object.keys(supervisors)) {
                    if (Mahlaka.text().includes(key)) {
                        writeAsend(end+'\n'+supervisors[key]);
                    }
                }
            });

            document.getElementById("qr_hagaha_muhana_h").addEventListener("click", function() {
                //document.querySelector('#cke_contents_vB_Editor_QR_editor > iframe').contentWindow.document.body.append("סבתאל'ה סיימה להגיה");
                console.log(Object.keys(supervisors));

                for(const key of Object.keys(supervisors)) {
                    if (Mahlaka.text().includes(key)) {
                        write(end+'\n'+supervisors[key]);
                    }
                }
            });

            $('#qr_edit_ha').click(function () {
                GM_config.open()
            });
        });
    }
    /*
*/
    //};
})();