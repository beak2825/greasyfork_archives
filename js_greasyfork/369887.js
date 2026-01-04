/* global $ */
/* global I18n */
/* global W */

// ==UserScript==
// @name        Restriction Manager
// @version     1.6
// @description Save, and load, restrictions from local storage.
// @namespace   mailto:waze.kjg53@gmail.com
// @include     https://www.waze.com/editor
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAjCAIAAABzZz93AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABV0lEQVRIiWP8//8/A70ACxl6vm6JgjC4fZaRpJGRVJ/BbYID4q1kotAmkgBpllHoAhIso9BbJFiG3yYi3UFyarx39rRewx0IO6nBZ5IxL/F6ifIZisOffoAzrzzFrub/v7/kW0YqYGRiJtMy4tMFQZUELKM8BZJgGSZQkhbAI4vfcfgsI+gtHWksSRGPLpokEJItoyS2cOnFbhl10wUByygHWJ2LxTIC3pLiMyPXBeiWkRKAIupS+KQxjaJtakSzjwmPHA7AqwNlCKiSaDdKG4RGiRDeSEH4jEY2IQMmkm16fjOvdDmP73Ie391TnxOlA244yQnk3ulH825AmG/K1z0jSS8TA4kBeOfxG5IsgACIFST7TEVWhAzLIID0+sxULkkDwhTpDMKbqzEA4////+mQDhkYGLh9ljExkN4/IM8mhoGpPGnqObjh6F0m6sYfmh9I7p9RAgAFyXyizju5WQAAAABJRU5ErkJggg==
// @resource    jqUI_CSS  https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @grant       none
// @copyright   2018, kjg53
// @author      kjg53
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/369887/Restriction%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/369887/Restriction%20Manager.meta.js
// ==/UserScript==


(function() {
    var initialized = false;
    var lsPrefix = "rtmgr:";

    // Map the css class used to identify the three restriction blocks to the direction constants used in the data.
    var classToDirection={"forward-restrictions-summary": "FWD",
                          "reverse-restrictions-summary": "REV",
                          "bidi-restrictions-summary": "BOTH"};

    // Convert the segment's default type to the driving modality that implied the type.  Creating a Toll Free restriction
    // implies that the segment is otherwise (i.e. defaults) to tolled which is what is then stored in the model.
    // Finding the tolled default thereby implies that the current restriction is specifying a toll free rule.
    var defaultType2drivingModality = {"TOLL": "DRIVING_TOLL_FREE",
                           "FREE":"DRIVING_BLOCKED",
                           "BLOCKED":"DRIVING_ALLOWED"};

    // Map the single bit constants used in the weekdays property to the integer numbers encoded in each week days HTML display.
    var weekdayBit2Idx = {
        1:1,
        2:2,
        4:3,
        8:4,
        16:5,
        32:6,
        64:0
    };

    var clipboardTarget = "*Clipboard*";

    // Get a sorted list of saved restrictions found in local storage.
    function allSavedRestrictions() {
        var all = [];
        for(var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);

            if (key.indexOf(lsPrefix) == 0) {
                key = key.substring(lsPrefix.length);

                all.push(key);
            }
        }
        all.sort();

        return all;
    }

    function extractRestrictions() {
        var extracted = {};
        for(var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);

            if (key.indexOf(lsPrefix) == 0) {
                var name = key.substring(lsPrefix.length);

                extracted[name] = localStorage.getItem(key);
            }
        }

        return extracted;
    }

    // Convert list of saved restrictions into a string of HTML option elements.
    function allSavedRestrictionAsOptions() {
        var all = allSavedRestrictions();
        return all.length == 0 ? "" : "<option selected></option><option>" + all.join("</option><option>") + "</option>";
    }

    // Update all restriction selectors to display the saved restrictions returned by allSavedRestrictions
    function updateSavedRestrictionSelectors(root) {
        $("div.rtmgr div.name select", root).html(allSavedRestrictionAsOptions()).each(resizeDivName);
    }

    // The content of the div.name element are positioned relative to its location.  As a result, the
    // div normally collapses to a point in the screen layout.  This function expands the div to enclose
    // its contents such that other elements are laid out around them.
    function resizeDivName(idx, child) {
        var div = $(child).parents("div.name").first();
        var height = 0;
        var width = 0;

        div.children().each(function(idx, child) {
            child = $(child);
            height = Math.max(height, child.height());
            width = Math.max(width, child.width());
        });

        div.width(width).height(height);
    }


    // Identify the direction of the restrictions associated with the specified button.
    function direction(btn) {
        var classes = btn.parents("div.restriction-summary-group").attr('class').split(' ');

        while(classes.length) {
            var cls = classes.pop();
            var dir = classToDirection[cls];

            if (dir) {
                return dir;
            }
        }
    }


    function setValue(selector, model, value) {
        if (value != null) {
            var sel = $(selector, model);
            var oldValue = sel.val();
            if (oldValue != value) {
                sel.val(value);
                sel.change();
            }
        }
    }

    function setCheck(selector, model, value) {
        if (value != null) {
            value = !!value;
            var sel = $(selector, model);
            var oldValue = sel.prop('checked');
            if (oldValue != value) {
                sel.prop('checked', value);
                sel.change();
            }
        }
    }

    function setSelector(name, model, value) {
        setValue('select[name="' + name + '"]', model, value);
    }

    function lastFaPlus(modal) {
        return $("i.fa-plus", modal).last();
    }

    function clearMessages() {
        $("div.modal-header-messages div.rtmgr").remove();
    }
    function addMessage(text, icon, color) {
        var rvr = $("div.modal-header-messages");
        if (icon) {
            icon = '<i class="fa fa-' + icon + '"/> ';
        } else {
            icon = "";
        }
        if (color) {
            color = ' style="color: ' + color + '"';
        } else {
            color = "";
        }
        rvr.append('<div class="modal-header-message"' + color + '>' + icon + text + '</div>');
    }

    var timeRegexp = /(\d\d?):(\d\d?)/

    function time2Int(time, ifNull) {
        var m = timeRegexp.exec(time);

        return m == null ? -1 : (m[1] * 60) + m[2];
    }

    function compareTimeFrames(a, b) {
        if (a == null) {
            return (b == null ? 0 : -1);
        } else if (b == null) {
            return 1;
        } else {
            a = a[0];
            b = b[0];

            var c = time2Int(a.fromTime, -1) - time2Int(b.fromTime, -1);
            if (c == 0) {
                c = time2Int(a.toTime, 1440) - time2Int(b.toTime, 1440);
            }

            return c;
        }
    }

    function compareRestrictions(a, b) {
        var c = compareTimeFrames(a.timeFrames, b.timeFrames);
        if (c == 0) {
            c = a.defaultType.localeCompare(b.defaultType);
        }
        return c;
    }

    function handleImportDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
    }

    function handleImportFile(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var restrictions = JSON.parse(e.target.result);

            for(var restriction in restrictions) {
                localStorage.setItem(lsPrefix + restriction, restrictions[restriction]);
            }
        };

        reader.readAsText(file);
    }

    function handleImportDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var i, f, item, seen = {};
        for(i = 0; item = evt.dataTransfer.items[i]; i++) {
            if (item.kind === 'file') {
                f = item.getAsFile();
                handleImportFile(f);
                seen[f.name] = true;
            }
        }
        for(i = 0; f = evt.dataTransfer.files[i]; i++) {
            if (seen[f.name] !== true) {
                handleImportFile(f);
            }
        }
    }

    function initializeRestrictionManager() {
        if (initialized) {
            return;
        }

        var observerTarget = document.getElementById("dialog-region");

        if (!observerTarget) {
            window.console.log("Restriction Manager: waiting for WME...");
            setTimeout(initializeRestrictionManager, 1015);
        }

        // Inject my stylesheet into the head
        var sheet = $('head').append('<style type="text/css"/>').children('style').last();
        sheet.append('div.rtmgr-column {display: flex; flex-direction: column; align-items: center}');
        sheet.append('div.rtmgr-row {display: flex; flex-direction: row; justify-content: space-around}');
        sheet.append('div.rtmgr button.btn {margin-top: 5px; border-radius: 40%}');
        sheet.append('div.rtmgr div.name input {width: 250px; position: absolute; left: 0px; top: 0px; z-index: 1}');
        sheet.append('div.rtmgr div.name select {width: 275px; position: absolute; left: 0px; top: 0px}');
        sheet.append('div.rtmgr div.name {width: 275px; position: relative; left: 0px; top: 0px}');
        sheet.append('div.modal-dialog div.modal-header .modal-title img.icon {float:right;height:20px;width:20px}');
        sheet.append('dialog.rtmgr span.cmd {text-decoration: underline}');
        sheet.append('dialog.rtmgr .import, dialog.rtmgr .export {width:30px; height: 30px}');

        // create an observer instance
        var observer = new MutationObserver(function(mutations) {
            var si = W.selectionManager.getSelectedFeatures();

            mutations.forEach(function(mutation) {
                if("childList" == mutation.type && mutation.addedNodes.length) {
                    var restrictionsModal = $("div.modal-dialog.restrictions-modal", observerTarget);

                    if (restrictionsModal) {
                        var modalTitle = $(restrictionsModal).find("div.modal-header .modal-title").first();
                        var title = modalTitle.text().trim();

                        if (I18n.translations[I18n.locale].restrictions.modal_headers.restriction_summary == title) {
                            if (modalTitle.data('rtmgr') === undefined) {
                                // Flag this modal as having already augmented
                                modalTitle.data('rtmgr', true);
                                modalTitle.append("<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAjCAIAAABzZz93AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABV0lEQVRIiWP8//8/A70ACxl6vm6JgjC4fZaRpJGRVJ/BbYID4q1kotAmkgBpllHoAhIso9BbJFiG3yYi3UFyarx39rRewx0IO6nBZ5IxL/F6ifIZisOffoAzrzzFrub/v7/kW0YqYGRiJtMy4tMFQZUELKM8BZJgGSZQkhbAI4vfcfgsI+gtHWksSRGPLpokEJItoyS2cOnFbhl10wUByygHWJ2LxTIC3pLiMyPXBeiWkRKAIupS+KQxjaJtakSzjwmPHA7AqwNlCKiSaDdKG4RGiRDeSEH4jEY2IQMmkm16fjOvdDmP73Ie391TnxOlA244yQnk3ulH825AmG/K1z0jSS8TA4kBeOfxG5IsgACIFST7TEVWhAzLIID0+sxULkkDwhTpDMKbqzEA4////+mQDhkYGLh9ljExkN4/IM8mhoGpPGnqObjh6F0m6sYfmh9I7p9RAgAFyXyizju5WQAAAABJRU5ErkJggg==' class='icon'>"
                                                  + "<dialog class='rtmgr'>"
                                                  + "<p style='text-align: center; font-weight: bold; font-size: 1.3em'>Restriction Manager</p>"
                                                  + "<p style='font-style: italic; font-size: .7em'>Stores restrictions in your browser's local storage so that they may be easily applied to other segments.</p>"
                                                  + "<p style='padding-left: 3em; text-indent: -3em;'>"
                                                  + "<span class='cmd'>Save</span>: Saves these restrictions to the selected key.<br>"
                                                  + "<span style='font-style: italic; font-size: .7em'>Note: Newly edited restrictions must be applied to the segment before the manager can save them.</span>"
                                                  + "</p>"
                                                  + "<p>"
                                                  + "<span class='cmd'>Apply</span>: Replaces the current restrictions with the restrictions associated with the selected key.</p>"
                                                  + "<p>"
                                                  + "<span class='cmd'>Delete</span>: Delete the selected key from your browser's local storage.</p>"
                                                  + "</dialog>");
                                if (window.File && window.FileReader && window.FileList && window.Blob) {
                                    $('dialog.rtmgr', modalTitle)
                                        .append("<p>Offline Storage: "
                                                + "<a download='restrictions.txt'><img title='Click here to export all saved restrictions' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABBVJREFUeJzt3btqVFEUh/FPDXiLJIhooYENKUQrqxQitrYiGgufQfENBBG08AnEWkGwsUojFhbeQFBUsBNBRBGJsZBg4lgMBzRkkrPO7NvM+v/gdJl9lrM+MqOFB/zZB9wA3gO/gSXgITBfcijJYw74AvQGXPeB7cWmk6QOAt8YvPzmul1qQEnrFpsvv7mOFZpREtkKLNI+gOtlxsxva+kBMjkATBl+/kiqQWrjJQDrF7sdSaaokJcAZAAF4JwCcE4BOKcAnFMAzikA5xSAcwrAOQXgnAJwTgE4pwCcUwDOKQDnFIBzCsA5BeCcAnBOATinAJxTAM4pAOcUgHMKwDkF4JwCcE4BOKcAnFMAzikA5xSAcwrAOQXgnAJwTgE4pwCcUwDOKQDnFIBzCsA5BeCcAnBOATg3kfj8WWAG+Am8AZYT328c7ALOAseBSeAj8AB4WnIoqzPAO/7/P/iXgJvA7gLzBNo/K6AHLBSYEeAU8HnATA+AvYXmMrnKxm/ua2B/5pnCJjPVEMA5+g+x2miul8DOArO1dpp2b/Bb8kYQWs5VKoA2y2+ua5lnM3lF+zc5ZwTBMFfuACzL79F/8FWVX94PYXuTc0YQjHPlCsC6/OY6HGuAmCXNdHjNUeAR+b8T1OAccIdufxObjDVEzAB+dHydxwiGWT7Ah3ijxLMN+Ir911mOj4NgnCXlR0DXX/vN9TjhbEO7Qvc/WMoIgnGOVAHMM9zyV4GTiWaLYjvwhPoiCMYZUgQw7PJ7wMUEc0U3DbygrgiC8f6xA4ix/MuRZ0qqtgiC8d4xA3C3/EZNEQTjfWMF4Hb5jVoiCMZ7xgjA/fIbNUQQjPcbNgAtf43SEQTjvYYJQMsfoGQEwXifrgHMAyvGe7lYfqNUBMF4jy4BaPktlYggGM+3BqDlG00Dz8kXQTCebQlAy+8oZwTBeG7bALT8IeWKIBjPbBOAlh9JjgiC8bzNAtDyI0sdQTCetVEA59Hyk0gZQTCeMygALT+xVBEE4xnrBaDlZ5IigmB8/doAtPzMYkcQjK/9NwAtv5CYEQTj65oAtPzCpogTwZzxNQto+dWIEcEn489/QcuvSowIcl5afgKjEoGWn1DtEWj5GdQagZafUW0RaPkF1BKBll9Q6Qi0/AqUikDLr8gU8Awt37VcEWj5FUsdgZY/AlJFoOWPkNgRaPkjKFYEWv4IGzYCLX8MdI1Ayx8j1gi0/DE0Rf+hCxst/g9wqdSAkt4e4B7rL38RuFButDK2lB6gkDn6TzWZBX7R/3i4C3wvOZSIiIiIiIiIiIhIGjH/KfgElT/RakwsAztiHVblI0glHwXgnAJwTgE4pwCcUwDOKQDnFIBzCsA5BeCcAnBOATinAJybiHhWD1iNeJ6sbyXmYX8BhFf7gV3QQHIAAAAASUVORK5CYII=' class='export' download='restrictions.txt'></a>"
                                                + "<img title='Drag file here to import restrictions' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA61JREFUeJzt3U+LjWEcxvHvDEJKhIVslNlYSZGsiKJmUPZ2lpaaF8DGglfA5uQNKOIVyChRLCkLf2qyUEaTGSkWx6TJzJnzPM9937/7nOv61NmdGb9xfZmaOmcgrSngtx9ZH1eGXmMIkyk/mY0eByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIC4zYk/3yLwOPHntNU+RR9gZmZmZmZmZmYjaFP0AYEmgIPAfvo/wfwVeo0Vsx24Cczz78UWP4EHwOHAu6yAvcAr1n/VzSIwHXadZbUPeMPGL71aAmaCbrRMhh3fEYyhpuM7gjHSdnxHMAa6ju8IRliq8R3BCEo9viMYIbnGdwQjIPf4jqBipcZfeSzjCKpRenxHUJGo8R1BBaLHdwSBahnfEQSobXxHUFCt4zuCAmof3xFklGL8hczPdwSZpBj/NtBr+DEn6R7BhfR/HVpSjQ/NAwBHECrl+NAuAHAEIVKPD+0DAEdQVI7xoVsA4AiKyDU+dA8AHEFWOceHNAGAI8gi9/iQLgBwBEmVGB/SBgCOIIlS40P6AMARdFJyfMgTAKSJ4GKDP28slB4f8gUAjqCRiPEhbwDgCIYSNT7kDwAcwUCR40OZAMARrCl6fCgXADiCVWoYH8oGAI4AqGd8KB8AiEdQ0/gQEwCIRlDb+BAXAIhFsBN4TV3jQ2wA0D2CJeBYhruSu0t940N8ANA9grlMdyWzh/67btY2PtQRAHSPYCrjbZ3NUOf4UE8A0C2CyykPSf17A3e3/Lg7wGzKQyo3B5wHvrf42NxxdnKa+v7lr+g1vKuENv8THCp0Wytbga/UNz7UGQA0i+Bpwbtam6W+8aHeAGC4CH4ARwvf1cokcJ/BX8ytgLt6G9wUGQDAceDDOrd8Ac4G3NTJVeAtq7+Ql8CloHt61B0AwA7gGvAQeAE8Aa4Du4LuSeIAcIT+j4cj9ag/gOJS//bwtXz++7AKpf45gI0YByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIM4BiHMA4hyAOAcgzgGIcwDiHIA4ByDOAYhzAOIcgDgHIE4pAJn3/21CKYCFBs/9lu2KyigF8LzBc59lu8LCbAM+MtxbxU8H3WiZnaH/a1gHjX8v7Dor4hTwnv+HXwZuoPVtkYnoA4JsAc4BJ+h/a3gHPALmI48yMyvrD75JO5BlUd2tAAAAAElFTkSuQmCC' class='import'>"
                                                + "</p>");
                                }
                                $('dialog.rtmgr', modalTitle).append("<p style='text-align: right; font-style: italic; font-size: .5em'>Click anywhere to close.</p>");
                                $("img.icon", modalTitle).click(function(evt) {
                                    $("dialog.rtmgr", modalTitle)[0].showModal();
                                });
                                $("dialog.rtmgr", modalTitle).click(function(evt) {
                                    evt.currentTarget.close();
                                });
                                if (window.File && window.FileReader && window.FileList && window.Blob) {
                                    $("img.export", modalTitle).click(function(evt) {
                                        var data = JSON.stringify(extractRestrictions());
                                        evt.target.parentNode.href = "data:text/plain;base64," + btoa(data);
                                    });

                                    var imgImport = $("img.import", modalTitle)[0];

                                    imgImport.addEventListener('dragover', handleImportDragOver, false);
                                    imgImport.addEventListener('drop', handleImportDrop, false);
                                }

                                // Add the UI elements to the modal
                                // Original, single, jquery statement split up after it stopped working.
                                var restrictionSummaryGroups = $("div.restriction-summary-group div.restriction-summary-title", restrictionsModal);
                                restrictionSummaryGroups.before ("<div class='rtmgr rtmgr-column'>"
                                            +   "<div class='name'>"
                                            +     "<input type='text'/>"
                                            +     "<select/>"
                                            +   "</div>"
                                            + "</div>");
                                var rtmgrColumns = restrictionSummaryGroups.parent().children("div.rtmgr-column");
                                rtmgrColumns.append ("<div class='rtmgr-row'>"
                                            +     "<button class='btn save'>Save</button>"
                                            +     "<button class='btn apply'>Apply</button>"
                                            +     "<button class='btn delete'>Delete</button>"
                                            + "</div>");

                                // Initialize the saved restriction selectors
                                updateSavedRestrictionSelectors(restrictionsModal);

                                // When a selection is made copy it to the overlapping input element to make it visible.
                                $("div.rtmgr select").change(function(evt) {
                                    var tgt = evt.target;
                                    var txt = $(tgt).parent().children("input");
                                    var opt = tgt.options[tgt.selectedIndex];
                                    txt.val(opt.text);

                                    $(opt).prop('selected', false);
                                    $(opt).parent().children("option:first").prop("selected", "selected");
                                });

                                // Delete action
                                $("div.rtmgr button.delete", restrictionsModal).click(function(evt) {
                                    var tgt = $(evt.target);
                                    var inp = tgt.parents('div.rtmgr').find("input");
                                    var name = inp.val();
                                    if (name == "") {
                                        addMessage("Specify the name of the restrictions being deleted.", 'ban', 'red');
                                    } else {
                                        localStorage.removeItem(lsPrefix + name);
                                        updateSavedRestrictionSelectors(restrictionsModal);
                                        inp.val("");
                                    }
                                });

                                // Save action (only one segment currently selected)
                                if (si.length == 1) {
                                    $("div.rtmgr button.save", restrictionsModal).click(function(evt) {
                                        var tgt = $(evt.target);
                                        var input = tgt.parents('div.rtmgr').find("input");
                                        var name = input.val();
                                        if (name == "") {
                                            addMessage("The restrictions require a name before they can be saved.", 'ban', 'red');
                                        } else {
                                            var dir = direction(tgt);
                                            var attrs = si[0].model.attributes;
                                            var src = attrs.restrictions;

                                            // Checking for pending updates to the selected segment's restrictions.  If found, save a copy of them.
                                            // This is a convenience feature that enables an editor to Apply a restriction change to a segment and then store it for re-use without first having to save it on the original segment.
                                            var actions = W.model.actionManager.getActions();
                                            for(var i = actions.length; i-- > 0;) {
                                                var action = actions[i];
                                                if (action.model.hasOwnProperty('subActions') && action.subActions[0].attributes.id == si[0].model.attributes.id && action.subActions[0].newAttributes.hasOwnProperty('restrictions')) {
                                                    src = action.subActions[0].newAttributes.restrictions;
                                                    break;
                                                }
                                            }

                                            var restrictions = [];
                                            for (i = 0;  i< src.length; i++) {
                                                var restriction = src[i];
                                                if (restriction._direction == dir) {
                                                    restrictions.push(restriction);
                                                }
                                            }

                                            restrictions = JSON.stringify(restrictions);

                                            clearMessages();
                                            if (clipboardTarget == name) {
                                                input.val(restrictions).select();
                                                document.execCommand('copy');
                                                input.val(clipboardTarget).blur();
                                                addMessage("Restrictions copied to clipboard");
                                            } else {
                                                localStorage.setItem(lsPrefix + name, restrictions);
                                                addMessage("Restrictions saved to " + name);
                                            }
                                            input.val("");

                                            updateSavedRestrictionSelectors(restrictionsModal);
                                        }
                                    });
                                } else {
                                    $("div.rtmgr button.save", restrictionsModal).click(function(evt) {
                                        clearMessages();
                                        addMessage("Save is only enabled when displaying the restrictions for a SINGLE segment", 'ban', 'red');
                                    });
                                }

                                // Apply saved restrictions to the current segment
                                $("div.rtmgr button.apply", restrictionsModal).click(function(evt) {
                                    var tgt = $(evt.target);
                                    var input = tgt.parents('div.rtmgr').find("input");
                                    var name = input.val().trim();
                                    if (name == "") {
                                        addMessage("Specify the name of the restrictions being applied.", 'ban', 'red');
                                    } else {
                                        var restrictions;

                                        input.val("");

                                        if (name.startsWith('[') & name.endsWith(']')) {
                                            restrictions = name;
                                        } else {
                                            restrictions = localStorage.getItem(lsPrefix + name);
                                        }
                                        restrictions = JSON.parse(restrictions).sort(compareRestrictions);

                                        var rsg = $(evt.target).parents("div.restriction-summary-group").first();
                                        var classes = rsg.attr('class').split(' ');
                                        classes.splice(classes.indexOf('restriction-summary-group'), 1);

                                        // Delete all current restrictions associated with the action's direction
                                        while (true) {
                                            var doDelete = "." + classes[0] + " .restriction-editing-actions i.do-delete";
                                            var deleteRestrictions = $(doDelete, restrictionsModal);

                                            if (deleteRestrictions.length == 0) {
                                                break;
                                            }

                                            deleteRestrictions.eq(0).click();
                                        }

                                        // Create new restrictions
                                        while (restrictions.length) {
                                            var restriction = restrictions.shift();

                                            $("." + classes[0] + " button.do-create", restrictionsModal).click();

                                            setSelector('disposition', restrictionsModal, restriction.disposition);
                                            setSelector('laneType', restrictionsModal, restriction.laneType);
                                            setValue('textarea[name="description"]', restrictionsModal, restriction.description);

                                            if (restriction.timeFrames != null && restriction.timeFrames.length != 0) {
                                                var weekdays = restriction.timeFrames[0].weekdays;

                                                var bit = 1;
                                                for(var idx = 0; idx < 7; idx++) {
                                                    var set = weekdays & bit;
                                                    set = (set != 0);
                                                    setCheck('input#day-ordinal-' + weekdayBit2Idx[bit] + '-checkbox', restrictionsModal, set);
                                                    bit <<= 1;
                                                }

                                                if (restriction.timeFrames[0].fromTime && restriction.timeFrames[0].toTime) {
                                                    setCheck("input#is-all-day-checkbox", restrictionsModal, false);
                                                    setValue("input.timepicker-from-time", restrictionsModal, restriction.timeFrames[0].fromTime);
                                                    setValue("input.timepicker-to-time", restrictionsModal, restriction.timeFrames[0].toTime);
                                                }

                                                if (restriction.timeFrames[0].startDate && restriction.timeFrames[0].endDate) {
                                                    setCheck("input#is-during-dates-on-radio", restrictionsModal, true);

                                                    // Ref: http://www.daterangepicker.com/
                                                    var drp = $('input.btn.datepicker', restrictionsModal).data('daterangepicker');

                                                    var re = /(\d{4})-(\d{2})-(\d{2})/;
                                                    var match = re.exec(restriction.timeFrames[0].startDate);
                                                    var startDate = match[2] + "/" + match[3] + "/" + match[1];

                                                    match = re.exec(restriction.timeFrames[0].endDate);
                                                    var endDate = match[2] + "/" + match[3] + "/" + match[1];

                                                    // WME's callback is fired by drp.hide().
                                                    drp.show();
                                                    drp.setStartDate(startDate);
                                                    drp.setEndDate(endDate);
                                                    drp.hide();

                                                    setCheck("input#repeat-yearly-checkbox", restrictionsModal, restriction.timeFrames[0].repeatYearly);
                                                }
                                            }

                                            var drivingModality;
                                            // if ALL vehicles are blocked then the default type is simply BLOCKED and the modality is blocked.
                                            if ("BLOCKED" == restriction.defaultType && !restriction.driveProfiles.hasOwnProperty("FREE") && !restriction.driveProfiles.hasOwnProperty("BLOCKED")) {
                                                drivingModality = "DRIVING_BLOCKED";
                                            } else {
                                                drivingModality = defaultType2drivingModality[restriction.defaultType];
                                            }

                                            setValue("select.do-change-driving-modality", restrictionsModal, drivingModality);

                                            var driveProfiles, driveProfile, i, j, vehicleType, plus, driveProfileItem, subscription;
                                            if (restriction.driveProfiles.hasOwnProperty("FREE")) {
                                                driveProfiles = restriction.driveProfiles.FREE;
                                                for(i = 0; i < driveProfiles.length; i++) {
                                                    driveProfile = driveProfiles[i];
                                                    var numDriveProfileItems = Math.max(1, driveProfile.vehicleTypes.length);

                                                    for(j = 0; j < numDriveProfileItems; j++) {
                                                        $("div.add-drive-profile-item.do-add-item", restrictionsModal).click();

                                                        vehicleType = driveProfile.vehicleTypes[j];

                                                        if (vehicleType !== undefined) {
                                                            plus = lastFaPlus(restrictionsModal);
                                                            plus.click();
                                                            driveProfileItem = plus.parents("div.drive-profile-item");
                                                            $("div.btn-group.open a.do-init-vehicle-type", driveProfileItem).click();

                                                            $("div.vehicle-type span.restriction-chip-content", driveProfileItem).click();

                                                            $('a.do-set-vehicle-type[data-value="' + vehicleType + '"]', driveProfileItem).click();
                                                        }

                                                        if (driveProfile.numPassengers > 0) {
                                                            plus = lastFaPlus(restrictionsModal);
                                                            plus.click();
                                                            driveProfileItem = plus.parents("div.drive-profile-item");
                                                            $("div.btn-group.open a.do-init-num-passengers", driveProfileItem).click();

                                                            if (driveProfile.numPassengers > 2) {
                                                                $("a.do-set-num-passengers[data-value='" + driveProfile.numPassengers + "']", driveProfileItem).click();
                                                            }
                                                        }

                                                        for(var k = 0; k < driveProfile.subscriptions.length; k++) {
                                                            subscription = driveProfile.subscriptions[k];

                                                            plus = lastFaPlus(restrictionsModal);
                                                            plus.click();
                                                            driveProfileItem = plus.parents("div.drive-profile-item");
                                                            $("div.btn-group.open a.do-init-subscription", driveProfileItem).click();


                                                            $("div.subscription span.restriction-chip-content", driveProfileItem).click();

                                                            $('a.do-set-subscription[data-value="' + subscription + '"]', driveProfileItem).click();
                                                        }
                                                    }
                                                }
                                            } else if (restriction.driveProfiles.hasOwnProperty("BLOCKED")) {
                                                driveProfiles = restriction.driveProfiles.BLOCKED;

                                                for(i = 0; i < driveProfiles.length; i++) {
                                                    driveProfile = driveProfiles[i];

                                                    if (driveProfile.vehicleTypes.length > 0) {
                                                        setCheck('input#all-vehicles-off-radio', restrictionsModal, true);

                                                        for(j = 0; j < driveProfile.vehicleTypes.length; j++) {
                                                            vehicleType = driveProfile.vehicleTypes[j];

                                                            setCheck('input#vehicle-type-' + vehicleType + '-checkbox', restrictionsModal, true);
                                                        }
                                                    }
                                                }
                                            }

                                            $("div.modal-footer button.do-create", restrictionsModal).click();
                                        }
                                        clearMessages();
                                        addMessage("Restrictions from " + name + " applied to current selection.");
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });

        // configuration of the observer:
        var config = { attributes: false, childList: true, characterData: false, subtree: true };

        // pass in the target node, as well as the observer options
        observer.observe(observerTarget, config);

        initialized = true;
    }

     setTimeout(initializeRestrictionManager, 1000);
 })();
