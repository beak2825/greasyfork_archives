// ==UserScript==
// @name         [AO3-PAC] Boiler generator
// @namespace    http://tampermonkey.net/
// @description  Automatically insert info into boilers that can be copied
// @match        *://*.archiveofourown.org/*
// @license      MIT
// @version      1.2.2
// @author       You
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/487492/%5BAO3-PAC%5D%20Boiler%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/487492/%5BAO3-PAC%5D%20Boiler%20generator.meta.js
// ==/UserScript==

(function (ui, web, solidJs) {
    function logDebug(message) {
        // Uncomment the following three lines to enable informational messages:
        //       var now = new Date();
        //       var millis = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
        //       console.log(millis + ": " + message);
    }

    async function getMenuRules() {
        var rules = {};

        let userHeight = await GM.getValue('mainHeight','600px')
        if (!userHeight.includes('px')) userHeight = '600px'
        userHeight = userHeight.trim().split('px')[0]*1
        if (userHeight < 450) userHeight = 450

        const mainHeight = Math.min(userHeight, window.innerHeight),
              halfHeight = mainHeight / 2,
              adjHeight = mainHeight - 600

        rules['.PAC-boilers-open'] = {
            'position': 'fixed',
            'background-color': 'lightgray',
            'padding': '5px',
        };

        rules['.PAC-boilers-open a'] = {
            'display': 'inline-block',
            'text-decoration': 'none',
            'border': 'none',
            'color': 'black',
        };

        rules['.PAC-boilers-inline-block'] = {
            'display': 'inline-block',
        };

        rules['.PAC-boilers-cbCont'] = {
            'position': 'relative',
        };

        rules['.PAC-boilers-cbCont.PAC-boilers-indent'] = {
            'padding-left': '30px',
            'padding-right': '24px',
        };

        rules['.PAC-boilers-cbLabel'] = {
            'position': 'relative',
            'top': '-2px',
            'left': '24px',
            'margin-Left': '-37px',
        };

        rules['#PAC-boilers-Boilers'] = {
            [await GM.getValue('menuTopPolarity','top')]: await GM.getValue("menuTop","80px"),
            [await GM.getValue('menuLeftPolarity','left')]: await GM.getValue("menuLeft","10px"),
        };

        rules['.PAC-boilers-window'] = {
            'background-color': 'white',
            'color': 'black',
            'display': 'none',
            'position': 'fixed',
            'inset': 'calc(50% - ' + halfHeight + 'px) auto auto calc(50% - 550px)',
            'width': '800px',
            'height': mainHeight + 'px',
            'box-shadow': '10px 10px 20px rgba(0, 0, 0, 0.5)',
            'z-index': '4010',
            'border': '1px solid darkgrey',
            'font-size': '14px',
        };

        rules['.PAC-boilers-sideWindow'] = {
            'background-color': 'white',
            'color': 'black',
            'display': 'none',
            'position': 'fixed',
            'width': '300px',
            'height': halfHeight + 'px',
            'box-shadow': '10px 10px 20px rgba(0, 0, 0, 0.5)',
            'z-index': '4011',
            'border': '1px solid darkgrey',
            'font-size': '14px',
        };

        rules['#PAC-boilers-multiWindow'] = {
            'inset': 'calc(50% - ' + halfHeight + 'px) auto auto calc(50% + 251px)',
        };

        rules['#PAC-boilers-sourceWindow'] = {
            'inset': 'calc(50%) auto auto calc(50% + 251px)',
        };

        rules['#PAC-boilers-boilerWindow'] = {
            'z-index': '4030',
        };

        rules['#PAC-boilers-title'] = {
            'position': 'absolute',
            'padding': '10px',
            'left': '0px',
            'right': '0px',
            'text-align': 'center',
            'font-size': '30px',
        };

        rules['.PAC-boilers-usefulLinks'] = {
            'position': 'absolute',
            'top': '8px',
            'left': '8px',
            'width': '50px',
            'font-size': '14px',
            'z-index': '4020',
        };

        rules['.PAC-boilers-usefulLinks a'] = {
            'display': 'block',
            'text-decoration': 'none',
            'border': 'none',
            'margin': '2px',
        };

        rules['.PAC-boilers-usefulLink-dd'] = {
            // 'width': '250px',
        };

        rules['.PAC-boilers-usefulLink-dd-content'] = {
            'display': 'none',
            'position': 'absolute',
            'background-color': 'white',
            'border': '1px solid darkgrey',
            'padding': '3px',
            'z-index': '4100',
        };

        rules['.PAC-boilers-usefulLink-dd-content a,'] = {
            'display': 'block',
            'text-decoration': 'none',
        };

        rules['.PAC-boilers-usefulLink-dd-content a:hover'] = {
            'color': darkmode? '#ddd' : 'black',
        };

        rules['.PAC-boilers-usefulLink-dd:hover .PAC-boilers-usefulLink-dd-content'] = {
            'display': 'block',
        };

        rules['#PAC-boilers-tablist'] = {
            'position': 'absolute',
            'right': '0px',
            'left': '0px',
            'top': '50px',
            'bottom': '0px',
            'width': '210px',
            'text-align': 'center',
            'border-right': '1px solid darkgrey',
            'border-top': '1px solid darkgrey',
        };

        rules['.PAC-boilers-tab'] = {
            'position': 'relative',
            'display': 'inline-block',
            'padding': '5px',
            'height': '19px',
            'width': '200px',
            'line-height': '19px',
            'background': 'darkgray',
            'color': 'black', // changing this away from black doesn't do anything. Hm. What is overriding it?
            'border-bottom': '1px solid darkgrey',
            'box-size': 'border-box',
        };

        rules['.PAC-boilers-darkMode .PAC-boilers-tab'] = {
            'background': '#404040',
            'color': '#d2d2d2', //...but here it works. Hm.
        };

        rules['#PAC-boilers-viewport'] = {
            'position': 'absolute',
            'top': '50px',
            'left': '210px',
            'width': '590px',
            'height': (mainHeight - 51) + 'px',
            'border-top': '1px solid darkgrey',
            'border-bottom': '1px solid darkgrey',
        };

        rules['#PAC-boilers-pickerLeftTop'] = {
            'position': 'relative',
            'display': 'inline-block',
            'width': '100%',
        };

        rules['.PAC-boilers-optionTitle'] = {
            'display': 'inline-block',
            'vertical-align': 'top',
            'margin-top': '2px',
            'width': '90px',
            'font-weight': 'bold',
        };

        rules['#PAC-boilers-replies,#PAC-boilers-rejectOptions'] = {
            'padding': '5px 10px',
            'border-bottom': '1px solid darkgrey',
        };

        rules['.PAC-boilers-reply'] = {
            'display': 'inline-block',
        };

        rules['#PAC-boilers-outcomes'] = {
            'position': 'relative',
            'padding': '5px 10px 0px',
            'border-bottom': '1px solid darkgrey',
        };

        rules['#PAC-boilers-outcomeType'] = {
            'padding-bottom': '5px',
            'border-bottom': '1px solid darkgrey',
        };

        rules['.PAC-boilers-radioContainer'] = {
            'display': 'inline-block',
        };

        rules['.PAC-boilers-radio-label'] = {
            'display': 'inline-block',
            'top': '0px',
            'vertical-align': 'top',
            'margin-top': '3px',
            'padding': '0px !important',
        };

        rules['#PAC-boilers-priorType'] = {
            'padding-top': '7px',
        };

        rules['.PAC-boilers-priors-subbox'] = {
            'display': 'inline-block',
            'width': '130px',
            'padding': '0px 25px 5px 5px',
        };

        rules['#PAC-boilers-priors-misc'] = {
            'padding': '4px 0px',
            'margin-left': '90px',
            'width': '480px',
            'border-top': '1px solid darkgrey',
        };

        rules['#PAC-boilers-orphans'] = {
            'position': 'relative',
            'padding': '5px 10px',
            'max-width': '100%',
            'border-bottom': '1px solid darkgrey',
        };

        rules['.PAC-boilers-orphans-subbox'] = {
            'display': 'inline-block',
            'width': '240px',
        };

        rules['.PAC-boilers-view'] = {
            'display': 'none',
        };

        rules['.PAC-boilers-view[halfview="true"]'] = {
            'max-height': (337 + adjHeight) + 'px',
        };

        rules['.PAC-boilers-view[noorphan="true"]'] = {
            'max-height': (367 + adjHeight) + 'px',
        };

        rules['.PAC-boilers-view[noban="true"]'] = {
            'max-height': (396 + adjHeight) + 'px',
        };

        rules['.PAC-boilers-active.PAC-boilers-view'] = {
            'display': 'block',
            'overflow-y': 'auto',
        };

        rules['#PAC-boilers-fandomTab'] = { // has a separate scroll system
            'overflow-y': 'hidden',
        };

        rules['.PAC-boilers-active.PAC-boilers-tab'] = {
            'background-color': darkmode? '#2a2a2a' : '#ddd',
            'border-bottom': 'none',
        };

        rules['.PAC-boilers-tab:hover'] = {
            'font-weight': 'bold',
            'color': darkmode? '#ddd' : 'black',
        };

        rules['.PAC-boilers-stdTabOptions'] = {
            'margin': '10px 10px 20px',
        };

        rules['.PAC-boilers-halfTab-left'] = {
            'display': 'inline-block',
            'width': '271px',
            'vertical-align': 'top',
        };

        rules['.PAC-boilers-halfTab-right'] = {
            'display': 'inline-block',
            'margin-left': '10px',
            'width': '271px',
            'vertical-align': 'top',
        };

        rules['.PAC-boilers-subTab-left'] = {
            'display': 'inline-block',
            'vertical-align': 'top',
            'width': '135px',
        };

        rules['.PAC-boilers-subTab-right'] = {
            'display': 'inline-block',
            'vertical-align': 'top',
            'width': '135px',
        };

        rules['.PAC-boilers-header'] = {
            'left': '0px',
            'right': '0px',
            'top': '10px',
            'height': '20px',
            'line-height': '20px',
            'font-size': '20px',
            'text-align': 'center',
            'margin': '10px 0px',
        };

        rules['.PAC-boilers-flag1D'] = {
            'position': 'relative',
            'top': '-27px',
            'left': '495px',
            'width': '50px',
            'text-align': 'center',
            'font-size': '14px',
            'background-color': 'lightgrey',
            'border': '1px solid darkgrey',
            'padding': '5px',
        }

        rules['.PAC-boilers-flag1D-1D'] = {
            'background-color': 'lightgreen',
        }

        rules['.PAC-boilers-dropdown'] = {
            'min-width': '50px'
        }

        rules['.PAC-boilers-action'] = {
            'font-size': '12px',
            'margin-left': '5px',
            'color': 'blue !important',
        };

        rules['.PAC-boilers-action:before'] = {
            'content': '"("',
        };

        rules['.PAC-boilers-action:after'] = {
            'content': '")"',
        };

        rules['.PAC-boilers-buttonArea,.PAC-boilers-buttonAreaBottom'] = {
            'left': '0px',
            'right': '0px',
            'height': '30px',
            'padding': '3px',
            'text-align': 'center',
            'margin': 'auto',
        };

        rules['.PAC-boilers-buttonAreaBottom'] = {
            'position': 'absolute',
            'bottom': '0px',
        };

        rules['.PAC-boilers-button'] = {
            'position': 'relative',
            'display': 'inline',
            'width': '80px',
            'margin': 'auto',
            'box-size': 'border-box',
            'box-shadow': '2px 1px 2px gray',
        };

        rules['.PAC-boilers-button:active'] = {
            'box-shadow': '2px 1px 2px white',
        };

        rules['.PAC-boilers-button:hover'] = {
            'font-weight': 'bold',
        };

        rules['.PAC-boilers-smalltextbox'] = {
            'position': 'relative',
            'top': '-1px',
            'height': '15px',
            'width': '120px',
        };

        rules['.PAC-boilers-boilertext'] = {
            'position': 'relative',
            'resize': 'none',
            'margin': '0px 10px',
            'height': (510 + adjHeight) + 'px',
            'width': '775px',
            'font-size': '12px',
        };

        rules['.PAC-boilers-sidewindowText'] = {
            'resize': 'none',
            'margin': '0px 10px',
            'height': (215 + (adjHeight/2)) + 'px',
            'min-height': (215 + (adjHeight/2)) + 'px',
            'width': '275px',
            'font-size': '12px',
        };

        rules['.PAC-boilers-sidewindowText-worklist'] = {
            'height': (188 + (adjHeight/2)) + 'px',
            'min-height': (188 + (adjHeight/2)) + 'px',
        };

        rules['#PAC-boilers-fandomTab .PAC-boilers-buttonAreaBottom .PAC-boilers-button'] = {
            'width': '135px',
            'margin-right': '5px',
        };

        rules['.PAC-boilers-fandom-groupHolder'] = {
            'height': (270 + adjHeight) + 'px',
            'overflow-y': 'scroll',
            'overflow-x': 'hidden',
            'border-top': '1px solid gray',
        };

        rules['.PAC-boilers-fandom-group'] = {
            'height': '90px',
            'border-bottom': '1px solid',
        };

        rules['.PAC-boilers-fandom-group-subbox'] = {
            'display': 'inline-block',
            'padding': '5px 5px 0px',
            'font-size': '12px',
            'scrollbar-width': 'thin',
            'border-right': '1px solid gray',
            'min-height': '84px',
            'height': '84px',
            'resize': 'none',
        };

        rules['#PAC-boilers-ftcolumns'] = {
            'display': 'inline-block',
            'border-bottom': '1px solid',
        };

        rules['#PAC-boilers-ftcolumns div'] = {
            'display': 'inline-block',
            'text-align': 'center',
            'padding': '5px 5px 3px',
            'margin-left': '1px',
            'border-right': '1px solid gray',
        };

        rules['.PAC-boilers-fandom-group-links'] = {
            'width': '252px',
        };

        rules['.PAC-boilers-fandom-group-tags'] = {
            'width': '124px',
        };

        rules['.PAC-boilers-fandom-group-suggestions'] = {
            'width': '124px',
        };

        rules['.PAC-boilers-fandom-group-buttons'] = {
            'display': 'inline-block',
            'padding': '0px 5px',
            'width': '25px',
            'min-width': '25px',
            'vertical-align': '16px',
        };

        rules['.PAC-boilers-fandom-group-buttons button'] = {
            'vertical-align': 'middle',
        };

        rules['#PAC-boilers-ftInstructions'] = {
            'padding-left': '10px',
            'color': 'grey',
        };

        rules['#PAC-boilers-ftInstructions ol li'] = {
            'list-style': 'decimal inside',
        };

        rules['#PAC-boilers-ftInstructions ul li'] = {
            'list-style': 'square inside',
        };

        rules['#PAC-boilers-rwInstructions'] = {
            'position': "absolute",
            'background-color': 'white',
            'left': "10px",
            'right': "10px",
            'bottom': "1px",
            'padding-bottom': '3px',
            'font-size': '12px',
            'text-align': 'center',
        }

        rules['#PAC-boilers-configWindow .PAC-boilers-smalltextbox'] = {
            'margin-right': '10px',
            //'width': '80px',
        };

        rules['#PAC-boilers-configWindow .PAC-boilers-dropdown'] = {
            'margin-right': '10px',
            'width': '70px',
        };

        rules['.PAC-boilers-darkMode,.PAC-boilers-darkMode div,'+
              '#PAC-boilers-rwInstructions.PAC-boilers-darkMode'] = {
            'background': '#181818',
            'color': '#ddd'
        };

        rules['.PAC-boilers-darkMode input,.PAC-boilers-darkMode select,.PAC-boilers-darkMode option,'+
              '.PAC-boilers-darkMode textarea,.PAC-boilers-darkMode textarea:focus'] = {
            'background': '#404040',
            'color': '#ddd'
        };

        rules['#PAC-boilers-picker textarea'] = {
            'font-size': '12px',
        }

        return rules;
    }

    function makeStyleCode(rules) {
        var contents = "";

        for (var descriptor in rules) {
            if (! rules.hasOwnProperty(descriptor)) continue;

            contents += descriptor + " {\n";

            for (var property in rules[descriptor]) {
                if (! rules[descriptor].hasOwnProperty(property)) continue;

                contents += "    " + property + ": " + rules[descriptor][property] + ";\n";
            }

            contents += "}\n";
        }

        contents += "@media print {.PAC-boilers-open, .PAC-boilers-open * {display: none !important;}}";
        // Makes the button go away on print

        return contents;
    }

    function makeStyleSheet(str) {
        var sheet = document.createElement('style');
        sheet.innerHTML = str;
        document.body.appendChild(sheet);
    }

    var outcome = "warning",

        // Grammar for the works being actioned
        numWorks = 1,
        oneSeveral = "one",
        aSpace = "a ",
        sEnd = "", // used for work/works
        itThey = "it",
        doEs = "does",
        sEd = "s", // used to differentiate on things like contain/contains/contained
        // for this setup, if any are not deleted/orphaned then it goes to present tense
        isWere = "is", // covers is, are, was, were
        thisTheseWorks = "his work", // covers 'this work' and 'these works' ... without a 't' in front, to allow for capitalization
        thisThese = "his", // covers 'this' or 'these' (without the t in front, for capitalization) -- for bookmarks, icons, etc

        // Grammar for the remaining works: assumes singular, none deleted
        numRem = 1,
        remaining = "",
        sRem = "",
        itTheyRem = "it",
        itThemRem = "it",
        isAreRem = "is",

        // Object to contain secondary work list grammar
        g2 = {},

        // Grammar for sources/examples:
        sSource = "",

        // Tracking for fandom tags
        ftGroupNum = 0,

        // darkmode tracking without async yay
        darkmode = '',

        // Allowances for Teyris's ease of turning on/off
        devMode = false


    function setUpGrammar() {

        if (document.querySelector('.PAC-boilers-active.PAC-boilers-view').hasAttribute('quarterview')
            || (gTabActive() === "Wrong rating/warning" && cbVal("ratwarNo-multi")) ) { // grammar for rejection letters
            if (cbVal('reject-multi') || cbVal("ratwarNo-multi")) {
                numWorks = 2
                oneSeveral = "several"
                aSpace = ""
                sEnd = "s"
                itThey = "they"
                doEs = "do"
                sEd = ""
                isWere = "are"
                thisTheseWorks = "hese works"
                thisThese = 'hese'
            } else { // assume singular
                numWorks = 1
                oneSeveral = "one"
                aSpace = "a "
                sEnd = ""
                itThey = "it"
                doEs = "does"
                sEd = "s"
                isWere = "is"
                thisTheseWorks = "his work"
                thisThese = 'his'
            }
        } else { // Grammar for the works being actioned

            // Determine outcome
            if (rdVal('note') || rdVal('none')) {outcome = 'note'}
            else if (rdVal('warning')) {outcome = 'warning'}
            else if (rdVal('suspension')) {outcome = 'suspension'}

            // figure out how many works there are and how many remain
            let workList = document.querySelector('#PAC-boilers-text-multiWindow').value.split('\n')

            // Need special cases for multi-list categories
            if (gTabActive() === "Fandom Tags") { // fandom tags may have any number of lists!
                let tempList = ''
                document.querySelectorAll('#PAC-boilers-fandomTab .PAC-boilers-fandom-group .PAC-boilers-fandom-group-links').forEach (b => {
                    tempList += b.value + '\n'
                })
                tempList = tempList.trim()
                workList = tempList.split('\n')
            } else if (gTabActive() === "Commercial Promotion") { // comprom may have a must-delete secondary work list
                let editableComp = cbVal('comp-work') || cbVal('comp-series')
                let workList2 = document.querySelector("#PAC-boilers-comp-deletelist").value.trim();
                [g2.numWorks, g2.oneSeveral, g2.aSpace, g2.sEnd, g2.itThey, g2.doEs, g2.sEd, g2.isWere, g2.thisTheseWorks, g2.thisThese, g2.numRem, g2.remaining, g2.sRem, g2.itTheyRem, g2.itThemRem, g2.isAreRem] = determineActionVerbs (workList2.split('\n'))
                if (!workList2) {
                    g2.numWorks = 0
                    g2.numRem = 0
                }
                if (g2.numWorks && !editableComp) {
                    workList = workList2.split('\n')
                }
            }

            [numWorks, oneSeveral, aSpace, sEnd, itThey, doEs, sEd, isWere, thisTheseWorks, thisThese, numRem, remaining, sRem, itTheyRem, itThemRem, isAreRem] = determineActionVerbs (workList)

            // Figure out whether to pluralize sources, tags, etc
            let sourceList = document.querySelector('#PAC-boilers-text-sourceWindow').value.split('\n')
            if (gTabActive() === "Fandom Tags") {
                let tempList = ''
                document.querySelectorAll('#PAC-boilers-fandomTab .PAC-boilers-fandom-group .PAC-boilers-fandom-group-tags').forEach (b => {
                    tempList += b.value
                })
                sourceList = tempList.split('\n')
            }
            if (sourceList.length > 1) {
                sSource = "s"
            } else {
                sSource = ""
            }
        }
    }

    function determineActionVerbs (_workList) {

        let _numWorks = 0,
            _numRem = 0

        _workList.forEach(lineItem => {
            if(lineItem.includes('archiveofourown.org/works/') || lineItem.includes('archiveofourown.org/bookmarks/')) {
                _numWorks++
                if(lineItem.includes(', formerly located at ')) {
                    _numRem++
                }
            }
        })

        if (gTabActive() === 'Icon') {
            _numWorks = 1
            if (cbVal('i-pseud') && tbVal('i-pseud').trim().includes(' ')) _numWorks = 2
            _numRem = 0
        }

        _numRem = _numWorks - _numRem

        if ((cbVal('orphan-one') && _numRem > _numWorks -1) || (cbVal('orphan-multi') && _numRem > _numWorks-2)) {
            _numRem -= 1
        }

        let pastTense = (_numRem < _numWorks)
        // To use present tense if any remain: pastTense = !_numRem
        // To use past tense if any deleted: pastTense = (_numRem < _numWorks)

        let _oneSeveral = "one",
            _aSpace = "a ",
            _sEnd = "",
            _itThey = "it",
            _doEs = "does",
            _sEd = "s",
            _isWere = "is",
            _thisTheseWorks = "his work",
            _thisThese = 'his'

        if (_numWorks > 1) {
            _oneSeveral = "several"
            _aSpace = ""
            _sEnd = "s"
            _itThey = "they"
            _doEs = "do"
            _sEd = ""
            _isWere = "are"
            _thisTheseWorks = "hese works"
            _thisThese = 'hese'

            if (pastTense) {
                _sEd = "ed"
                _isWere = "were"
            }
        } else if (pastTense) {
            _sEd = "ed"
            _isWere = "was"
        }


        let _remaining = "",
            _sRem = "",
            _itTheyRem = "it",
            _itThemRem = "it",
            _isAreRem = "is"

        if (_numRem > 0 && _numWorks > _numRem) {
            _remaining = "remaining "
        }

        if (_numRem > 1) {
            _sRem = "s"
            _itTheyRem = "they"
            _itThemRem = "them"
            _isAreRem = "are"
        }

        return [_numWorks, _oneSeveral, _aSpace, _sEnd, _itThey, _doEs, _sEd, _isWere, _thisTheseWorks, _thisThese, _numRem, _remaining, _sRem, _itTheyRem, _itThemRem, _isAreRem]
    }

    function gTabActive() {
        return document.querySelector("#PAC-boilers-title").innerText
    }

    function gSignOff() {
        return tbVal("catName") + " \n" +
            "AO3 Policy & Abuse ";
    }

    function makeListFromArray(theArray, andOr) {
        var aStr = "";
        if (theArray) {
            if (theArray.length == 1) {
                aStr = theArray[0]
            } else if (theArray.length == 2) {
                aStr = theArray[0] + " " + andOr + " " + theArray[1]
            } else if (theArray.length > 2) {
                aStr = theArray.slice(0, theArray.length - 1).join(", ") + ", " + andOr + " " + theArray[theArray.length - 1];
            }
        }
        return aStr;
    }

    function gSectionTos(tabName) {
        if (!tabName) tabName = gTabActive()

        switch(tabName) {
            case "Non-fanwork":
                return "II.B"
            case "Commercial Promotion":
                return "II.C"
            case "Copyright Infringement":
                if (cbVal("cright-PDR")) {
                    return "II.B"
                } else {
                    return "II.D"
                }
            case "Plagiarism":
                return "II.E."
            case "Harassment (work)":
            case "Harassment (other)":
                return "II.H"
            case "Icon":
                return "II.I"
            case "Wrong rating/warning":
            case "Fandom Tags":
                return "II.J"
        }
    }

    function gCategoryTos(tosSection) {
        if (!tosSection) tosSection = gSectionTos(gTabActive())

        tosSection = tosSection.trim().toUpperCase()

        // add something so that if it ends in a . it crops that off

        switch(tosSection) {
            case "II.B":
                return "non-fanwork"
            case "II.C":
                return "non-commercialization"
            case "II.D":
                return "copyright infringement"
            case "II.E":
                return "plagiarism"
            case "II.G":
                return "impersonation"
            case "II.H":
                return "harassment"
            case "II.I":
                return "icon"
            case "II.J":
                return "mandatory tags"
            default:
                return "general content"
        }
    }

    function gNumPriors() {
        let num = 0;
        if (rdVal("DATE1-warning") || rdVal("DATE1-suspension")) {++num}
        if (rdVal("DATE2-warning") || rdVal("DATE2-suspension")) {++num}
        if (rdVal("DATE3-warning") || rdVal("DATE3-suspension")) {++num}
        if (num == 1) {return "second "}
        else if (num == 2) {return "third "}
        else if (num == 3) {return "fourth "}
        return "";
    }

    function gCountWarningTypes() {
        let count = 0;
        if(cbVal("ratwar-MCD")) {++count};
        if(cbVal("ratwar-UA")) {++count};
        if(cbVal("ratwar-RNC")) {++count};
        if(cbVal("ratwar-GDOV")) {++count};

        return count;
    }

    function gSubjectLine(subjectLine) {
        let str = "Subject line: \n"+
            "[AO3] " + subjectLine;
        return str;
    }

    function gSubject() {
        let str = ""

        if (outcome == "warning") {str += "Warning: "}
        else if (outcome == "suspension") {str += "Suspension: "}

        switch(gTabActive()) {
            case "Non-fanwork":
                if(cbVal("nfw-empty")) {
                    if (ddVal("nfw-brokenlock") == "broken") {
                        str += "Missing Content"
                    } else {str += "Restricted Content"}
                } else {
                    str += "Non-fanwork" + sEnd
                }
                break;
            case "Commercial Promotion":
                str += "Commercial Promotion Violation";
                break;
            case "Plagiarism":
                str += "Plagiarism";
                break;
            case "Copyright Infringement":
                if (cbVal("cright-utrans")) {str += "Unauthorized Translation"}
                else if (cbVal("cright-PDR")) {str += "Terms of Service Violation"}
                else {str += "Copyright Infringement"};
                break;
            case "Harassment (work)":
                if (!cbVal("hw-comment") && !cbVal("hw-profile") && !cbVal("hw-delete")) {
                    if (cbVal("hw-note") || cbVal("hw-summary")) {
                        str += "Harassing Content in Your Work" + sEnd;
                    } else if (cbVal("hw-tag")) {
                        str += "Harassing Tag"
                        if (sSource || sEnd) str += "s"
                        str += " on Your Work" + sEnd;
                    } else {
                        str += "Harassment Violation";
                    }
                } else {
                    str += "Harassment Violation";
                }
                break;
            case "Harassment (other)":
                str += "Harassment Violation";
                break;
            case "Wrong rating/warning":
                if (gCountWarningTypes() > 0) {str += "Insufficient "}
                else {str += "Incorrect "}
                if (cbVal("ratwar-rating")) {
                    str += "Rating" + sEnd + " ";
                    if (gCountWarningTypes() > 0) {str += "and Warnings "};
                } else {str += "Warnings "};
                str += "on Your Work" + sEnd;
                break;
            case "Fandom Tags":
                str += "Inapplicable Fandom Tag"
                if (sSource || sEnd) str += "s"
                str += " on Your Work" + sEnd;
                break;
            case "Icon":
                str += "Icon Violation"
                break;
            case "Misc":
                if (cbVal('misc-ruoknfw') || cbVal('misc-ruokfw')) str = "Are You Okay?" // remove the warning or suspension header
                break;
            default:
                str += "Terms of Service Violation" + sEnd;
        };
        return str;
    }

    async function gParaGreetUser() {
        // Must be async: contains the search for harassment victim name code
        let mWindowContainer = document.querySelector('#PAC-boilers-text-multiWindow')
        let mWindow = mWindowContainer.value
        let str = "\n\nHi, \n\n"+
            "The AO3 Policy & Abuse committee has received a complaint that "

        switch(gTabActive()) {
            case "Non-fanwork":
                if (cbVal("nfw-empty")) {
                    // broken and locked images
                    str += "the " + ddVal("nfw-linkembed") + " images in " + oneSeveral + " of your works "+
                        (ddVal("nfw-brokenlock") == "broken" ? "are no longer visible: " : "cannot be accessed: ")
                } else if (cbVal("nfw-1Dnfw") && cbVal("nfw-spam")) {
                    str += "you have posted non-fanwork content on AO3: "
                } else {
                    // ordinary NFWs: [one/several] of your works [gIsWere] not [a fanwork/fanworks]:
                    str += oneSeveral + " of your works " + isWere + " not " + aSpace + "fanwork" + sEnd + ": ";
                }
                break;
            case "Commercial Promotion":
                // Check for editable works and non-work Content, which must be listed in the main works list box (mWindow)
                if (/\/users\/.*\/profile/.test(mWindow) && !cbVal('comp-profile')) {cbClick('comp-profile')}
                if (mWindow.includes("/works/") && !cbVal('comp-work')) {cbClick('comp-work')}
                if (mWindow.includes("/series/") && !cbVal('comp-series')) {cbClick('comp-series')}
                if (mWindow.includes("/comments/") && !cbVal('comp-comment')) {cbClick('comp-comment')}
                if (/\/users\/.*\/pseuds/.test(mWindow) && !cbVal('comp-pseuds')) {cbClick('comp-pseuds')}
                var editableComp = cbVal('comp-work') || cbVal('comp-series')

                var locsArray = []
                if (cbVal('comp-profile')) {locsArray.push('profile page')}
                if (cbVal('comp-pseuds')) {locsArray.push('pseuds page')}
                if (cbVal('comp-series')) {locsArray.push('series')}
                if (cbVal('comp-comment')) {locsArray.push(mWindow.split('/comments/').length === 2 ? 'comment' : 'comments')}
                if (cbVal('comp-work')) {locsArray.push(oneSeveral + ' of your works')}

                // Can check for the existence of must-delete works with: if(g2.numWorks) --- this will be 0 if no must-delete works
                // or if it's only must-delete works (which have been added into the main list)
                if (g2.numWorks && editableComp) {
                    str += g2.oneSeveral + " of your works " + g2.isWere + " commercial in nature: \n\n" +
                        document.querySelector('#PAC-boilers-comp-deletelist').value.trim() + ' \n\n' +
                        "This is a violation of Section " + gSectionTos("Commercial Promotion") + " of our Terms of Service. "+
                        "Previews for paywalled content constitute advertisement of commercial products and are not allowed to be uploaded to AO3. \n\n"
                    if (cbVal('comp-NFW') && locsArray.length) {
                        str += "T" + g2.thisTheseWorks + " " + g2.isWere + " also not " + g2.aSpace + "fanwork" + g2.sEnd +
                            ", which is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                            "Works that are not fanworks may not be uploaded to AO3. \n\n";

                    }
                    str += "Additionally, "
                }

                if (locsArray.length) {
                    if (g2.numWorks && !editableComp) {locsArray.push(g2.oneSeveral + ' of your works')}
                    if (locsArray.length === 1 && (cbVal('comp-work') || g2.numWorks)) {
                        str += oneSeveral + " of your works contain"
                    } else if (locsArray.length) {
                        str += "your " + makeListFromArray(locsArray, "and") + " contain"
                    }
                    if (locsArray.length === 1 && !locsArray.includes('comments') && mWindow.split('/series/').length < 3) str += sEd

                    if (locsArray.length) str += " references to commercial activities: "
                } else {
                    str += g2.oneSeveral + " of your works " + g2.isWere + " commercial in nature: "
                }
                break;
            case "Plagiarism":
                str += oneSeveral + " of your works contain" + sEd + " plagiarized material: ";
                break;
            case "Copyright Infringement":
                if (cbVal("cright-delete")) {
                    str += "you have posted " + (sEnd ? "several works" : "a work") + " in violation of someone else's copyright: "
                } else if (cbVal("cright-utrans")) {
                    str += "you have posted " + aSpace + "translation" + sEnd + " of someone else's work" + sEnd + " without their permission: ";
                } else if (cbVal("cright-cite")) {
                    str += oneSeveral + " of your works lack" + sEd + " " + aSpace + "required citation" + sSource;
                    if (cbVal("cright-cite-SA")) {str += " and license" + sEnd}
                    str += ": ";
                } else if (cbVal("cright-PDR")) {
                    str += oneSeveral + " of your works " + isWere + " not " + aSpace + "transformative fanwork" + sEnd + ": ";
                } else if (cbVal("cright-art")) {
                    str += "you have reproduced someone else's artwork in " + oneSeveral + " of your works: "
                } else if (cbVal("cright-piracy")) {
                    str += oneSeveral + " of your works contain" + sEd + " links to unauthorized reproductions of copyrighted material: ";
                } else { // default to allowing edits
                    str += oneSeveral + " of your works contain" + sEd + " an excessive amount of copyrighted material: ";
                }
                break;
            case "Wrong rating/warning":
                str += oneSeveral + " of your works "
                if (cbVal("ratwar-rating")) {
                    str += isWere + " incorrectly rated"
                    if (gCountWarningTypes() > 0) str += " and "
                }
                if (gCountWarningTypes() > 0) str += "lack" + sEd + " sufficient Archive warnings"
                str += ": "
                break;

            case "Fandom Tags":
                str += "there " + (sSource ? "are " : "is an ") + "inapplicable fandom tag" + sSource + " on " + oneSeveral + " of your works: "
                break;
            case "Harassment (work)":
                // Check for what is listed in the box
                if (mWindow.includes("/profile/") && !cbVal('hw-profile')) {cbClick('hw-profile')}
                if (mWindow.includes("/series/") && !cbVal('hw-series')) {cbClick('hw-series')}
                if (mWindow.includes("/comments/") && !cbVal('hw-comment')) {cbClick('hw-comment')}

                str += "you have engaged in harassment "
                if (cbVal("hw-username")) {
                    str += "via your username" + (cbVal("hw-profile")? ", " : " and ")
                }
                if (cbVal("hw-profile")) {
                    str += "on your profile page and "}
                str += "in ";
                // tags, notes, summary, body
                var countHarassmentLocs = (cbVal("hw-tag")) +
                    (cbVal("hw-note")) +
                    (cbVal("hw-summary")) +
                    (cbVal("hw-comment"));
                if (countHarassmentLocs > 0 && countHarassmentLocs < 4) {
                    let hLocsArray = [];
                    if (cbVal("hw-tag")) {hLocsArray.push("tags")}
                    if (cbVal("hw-note")) {hLocsArray.push("notes")}
                    if (cbVal("hw-summary")) {sEnd ? hLocsArray.push("summaries") : hLocsArray.push("summary")}
                    if (cbVal("hw-comment")) {hLocsArray.push("comments")}
                    str += "the " + makeListFromArray(hLocsArray, "and") + " of "
                }
                str += "your work" + sEnd;
                if (cbVal("hw-series")) {
                    str += " and series"
                }
                str += ": ";
                break;
            case "Harassment (other)":
                // Check for what is listed in the box
                if (mWindow.includes("/profile/") && !cbVal('ho-profile')) {cbClick('ho-profile')}
                if (mWindow.includes("/bookmarks/") && !cbVal('ho-bookmark')) {cbClick('ho-bookmark')}

                str += "you have engaged in harassment"

                var commentStr = ''
                if (cbVal("ho-comment-own") || cbVal("ho-comment-anon") || cbVal("ho-comment-BE")
                    || cbVal("ho-comment-multi") || cbVal("ho-comment-multitar")) {
                    commentStr += " in the comments of "
                    if (cbVal("ho-comment-multitar")) {
                        commentStr += "multiple works in " +
                            (cbVal("ho-multitar-several") ? "several fandoms" : "the " + tbVal('ho-multitar-fandom') + " fandom")
                    } else if (cbVal("ho-comment-multi")) {
                        commentStr += "works"
                    } else {
                        let nameChkStr = mWindow.split('", located at ')[0].split('", formerly located at ')[0] + '"'
                        if (nameChkStr == '"' || nameChkStr.length < 1) {
                            nameChkStr = '"WORK_TITLE'
                        } else {
                            if (nameChkStr.substring(0,1) == '"') nameChkStr = nameChkStr.substring(1)
                            nameChkStr = '"' + nameChkStr
                        }
                        commentStr += nameChkStr
                    }
                    if (cbVal("ho-comment-BE") || cbVal("ho-comment-multi")) {
                        commentStr += " by " + await getBEtargetname()
                    }
                }
                var hPlaces = []
                if (commentStr) hPlaces.push(commentStr)
                if (cbVal("ho-username")) hPlaces.push("via your username")
                if (cbVal("ho-bookmark")) hPlaces.push("in your bookmarks")
                if (cbVal("ho-profile")) hPlaces.push("on your profile page")

                str += makeListFromArray(hPlaces, 'and') + (cbVal("ho-profile") || cbVal("ho-bookmark") ? ": " : ". ")
                break;
            case "Icon":
                str = str.slice(0, -5) + "about "
                if (cbVal('i-pseud')) {
                    str += 'the icon' + sEnd + ' for your pseud' + sEnd + ' ' + tbVal('i-pseud').trim() + '.'
                } else {
                    str += 'your user icon.'
                }
                break;
            default:
                str += "you have violated the Terms of Service. ";
        };

        str += " \n\n"

        return str;
    }

    function gLinks() {
        const mWindowHolder = document.querySelector('#PAC-boilers-text-multiWindow')
        let str = "",
            mWindow = mWindowHolder.value.trim()

        let nameStr = getUsers()
        if (nameStr.length > 0) {
            if (nameStr[0].includes(' ')) {
                nameStr = []
                if (document.querySelector('h3.byline')) {
                    document.querySelectorAll('h3.byline')[0].querySelectorAll('a[rel="author"]').forEach(u => {
                        let user = u.href.split("users/")[1].split("/pseuds")[0]
                        if (!nameStr.includes(user)) nameStr.push(user)
                    })
                }
            }
        }

        function removeProfilePseudLines(ptype) {
            let nWindow = ''
            const re = new RegExp(`\/users\/.*\/${ptype}`,'g')
            for (const line of mWindow.split('\n')) {
                if (!re.test(line)) nWindow += line + '\n'
            }
            mWindow = nWindow.trim()
        }

        if (/\/users\/.*\/pseuds/.test(mWindow) ||
            (gTabActive() == "Commercial Promotion" && cbVal("comp-pseuds")) ) {
            removeProfilePseudLines('pseuds')
            if (nameStr.length === 1) {
                mWindow = "Your pseuds page, located at https://archiveofourown.org/users/" + nameStr[0] + "/pseuds \n" + mWindow
            } else {
                mWindow = "Your pseuds page, located at INSERT_PSEUDS_LINK_HERE \n" + mWindow
            }
        }

        if (/\/users\/.*\/profile/.test(mWindow) ||
            (gTabActive() == "Harassment (other)" && cbVal("ho-profile")) ||
            (gTabActive() == "Commercial Promotion" && cbVal("comp-profile")) ||
            (gTabActive() == "Harassment (work)" && cbVal("hw-profile"))
           ) {
            removeProfilePseudLines('profile')
            if (nameStr.length === 1) {
                mWindow = "Your profile page, located at https://archiveofourown.org/users/" + nameStr[0] + "/profile \n" + mWindow
            } else {
                mWindow = "Your profile page, located at INSERT_PROFILE_LINK_HERE \n" + mWindow
            }
        }

        let deleteList = ''
        if (gTabActive() == "Commercial Promotion" && g2.numWorks && !cbVal("comp-work") && !cbVal("comp-series")) {
            deleteList = '\n' + document.querySelector('#PAC-boilers-comp-deletelist').value.trim()
        }

        if ( (gTabActive() != "Harassment (other)" || cbVal("ho-bookmark")) &&
            (gTabActive() != "Commercial Promotion" || cbVal("comp-work") || cbVal("comp-series") || cbVal("comp-comment") || mWindow || deleteList)
           ) {
            mWindow = mWindow.trim() + deleteList
            str += mWindow.trim() + "\n\n"
        } else if ( (gTabActive() != "Harassment (other)" || cbVal("ho-profile")) &&
                   gTabActive() != "Commercial Promotion"
                   ) {
            str += "\n"
        }
        return str;
    }

    function gParaTosBlock() {
        let str = "",
            sourceWindow = document.getElementById("PAC-boilers-text-sourceWindow")

        // Common phrases
        let iieBase = "Minor alterations (such as replacing names, substituting synonyms, or rearranging a few words) are insufficient to make a work your own."

        const explainAlsoNotFanwork = ", which is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                            "Works that are not fanworks may not be uploaded to AO3. \n\n";

        switch(gTabActive()) {
            case "Non-fanwork":
                if (cbVal("nfw-empty")) {
                    if (ddVal("nfw-brokenlock") == "broken") {
                        str += "As there is no longer any fanwork content, your work" + sEnd + " " + isWere +
                            " currently in violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                            "We understand, however, that this might not be your fault due to the unreliability of image and video hosting websites.\n\n";
                    } else {
                        str += "The images are locked " +
                            (ddVal("nfw-filtermembers") == 'membership requirement' ? 'to members of the general public' : 'behind a content filter' )+
                            ", which prevents them from being accessed on AO3. "+
                            "Works on AO3 must contain fanwork content that is visible to all registered users. "+
                            "As yours " + doEs + " not, " + itThey + " " + isWere + " currently in violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service.\n\n"
                    }
                } else {
                    // note that this is completely ignoring locked/broken links/embeds at the moment
                    str += "This is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                        "AO3 is an archive for the preservation of fanfiction and other transformative fanworks. "+
                        "Non-fanworks may not be uploaded to AO3. "+
                        "Examples of non-fanworks include social media posts, fic searches, ads, prompts or requests, "
                    if (cbVal("nfw-1Dnfw") && cbVal("nfw-spam")) {
                        str += "personal messages, and any other non-transformative content. "
                    } else {
                        str += "lists of other works, personal messages, empty works, and any other non-transformative content. \n\n"
                    }
                    if (cbVal("nfw-spam")) {
                        str += "A single word or phrase repeated multiple times is not a fanwork, "+
                            "and we consider it to be spam, regardless of its potential fandom connection. \n\n"
                    }
                    if (cbVal("nfw-prompt")) {
                        str += "Prompts, ideas for fanworks, and requests for inspiration are not fanworks and should not be posted as works. "+
                            "Instead, please use our prompt challenge feature to post or solicit prompts. "+
                            "For more information about prompt challenges, please refer to our FAQ: https://archiveofourown.org/faq/prompt-meme \n\n"
                    }
                    if (cbVal("nfw-bookmark")) {
                        str += "Please use bookmarks to save or share other fanworks instead of posting them as works. "+
                            "AO3 bookmarks can be created for fanworks hosted on any site and customized with tags, notes, and collections. "+
                            "For more information about bookmarks, please refer to our FAQ: https://archiveofourown.org/faq/bookmarks \n\n"
                    }
                    if (cbVal("nfw-testpost")) {
                        str += "If you wish to experiment with posting or editing a work, please do not use the regular fandom tags or create new ones. "+
                            "Instead, you may temporarily post your work in the Testing fandom: https://archiveofourown.org/tags/Testing/works \n\n"
                    }
                    if (cbVal("nfw-placeholder")) {
                        str += "Placeholders and notes about works you plan to create are not themselves fanworks. "+
                            "Works in progress should not be posted until there is at least one chapter of fanwork content. "+
                            "If you want to edit your tags or preview your work before posting it publicly, you can upload your work as a draft for 30 days. "+
                            "For more information about drafts, please refer to our FAQ: https://archiveofourown.org/faq/posting-and-editing#savedraft \n\n"
                    }
                }
                break;
            case "Commercial Promotion":
                var editableComp = cbVal("comp-work") || cbVal("comp-profile") || cbVal("comp-pseuds") || cbVal("comp-series") || cbVal("comp-comment")

                if (g2.numWorks) {
                    if (cbVal("comp-work") || cbVal("comp-series")) {
                        str += "You may not include links or references to "
                    } else {
                        str += "This is a violation of Section " + gSectionTos("Commercial Promotion") + " of our Terms of Service. "+
                            "Previews for paywalled content constitute advertisement of commercial products and are not allowed to be uploaded to AO3. "+
                            "You may not include links or references to "
                    }
                } else {
                    str += "This is a violation of Section " + gSectionTos("Commercial Promotion") + " of our Terms of Service, which states: "+
                        '"Promotion, solicitation, and advertisement of commercial products or activities are not allowed." '+
                        "This includes any mention of "
                }

                str += "commercial sites (e.g. Amazon), paid memberships or donations (e.g. Patreon or Ko-fi), sales, paid commissions, "+
                    "or any other language which one might interpret as requesting or having requested financial contributions, whether for yourself or others. "+
                    "For more examples of commercial activities, please refer to our Terms of Service FAQ: "+
                    "https://archiveofourown.org/tos_faq#commercial_examples \n\n"

                if (editableComp) {
                    str += "We have determined that the following content is commercial in nature: \n\n"+
                        sourceWindow.value + "\n\n"+
                        "However, this is not necessarily a comprehensive list. "+
                        "It is your responsibility to ensure that your account and the works posted on it are in compliance with our Terms of Service. \n\n";
                }
                if (cbVal("comp-NFW") & !cbVal("comp-work") && !cbVal("comp-series")) {
                    // if there is also editable work or series, then this will have been placed ahead of the editableComp links list instead
                    str += "Furthermore, t" + g2.thisTheseWorks + " " + g2.isWere + " not " + g2.aSpace + "fanwork" + g2.sEnd +
                        ", which is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                        "Works that are not fanworks may not be uploaded to AO3. \n\n"
                }

                break;

            case "Plagiarism":
                str += 'Section ' + gSectionTos("Plagiarism") + ' of our Terms of Service states: "'+
                    "Plagiarism is the use of someone else's words, or their expressions of their ideas, without attribution. " + iieBase + '" '
                if (!cbVal("plag-cite")) {
                    str += "Works that reproduce large portions of other works are not allowed to be uploaded to AO3 without permission from the original creator of that work. "+
                        "Saying a work is not yours or crediting the original creator does not give you the right to upload it. ";
                } else {
                    str += '[…] Deliberately creating a work using the same general idea as another work is not plagiarism, but citation may be appropriate." '
                }
                str += "\n\nWe have determined that your work" + sEnd + " contain" + sEd + " material plagiarized from the following source" +
                    sSource + ": \n\n"+
                    sourceWindow.value + "\n\n"
                if (cbVal("plag-cite")) {
                    str += "The amount of quoted material that you have included is only acceptable if you include " + (sSource ? "a " : "")+
                        "proper citation" + sSource + ".\n\n"
                }
                break;
            case "Copyright Infringement":
                var iidViolation = "This is a violation of Section " + gSectionTos("Copyright Infringement") + " of our Terms of Service",
                    iidBase = 'Reproductions of large excerpts of copyrighted works are not allowed without the consent of the copyright owner.',

                    cInfringed = "We have determined that your work" + sEnd + " infringe" + (sEd == "ed" ? "d" : sEd) +
                    " upon the following material: \n\n"+
                    sourceWindow.value + "\n\n"

                // by default, it goes to cright-edit if nothing at all is clicked
                if(cbVal("cright-delete")) {
                    str += iidViolation + ', which states: "' + iidBase + '" ' +
                        "Saying a work is not yours or crediting the original creator does not give you the right to upload it. \n\n"+
                        (cbVal("cright-delete-plag") ? 'Additionally, Section ' + gSectionTos("Plagiarism") + ' states: "' + iieBase + '" \n\n' : '')+
                        cInfringed
                    if(cbVal("cright-delete-NFW")) str += 'T' + thisTheseWorks + ' ' + isWere + " also not " + aSpace + "fanwork" + sEnd + explainAlsoNotFanwork
                } else if(cbVal("cright-cite")) {
                    str += iidViolation + ', which states: "' + iidBase +
                        ' […] Epigraphs and short quotations are allowed." \n\n'+
                        ((sSource || !sourceWindow.value) ? "The material you have quoted" : sourceWindow.value.trim()) + " was released under a "+
                        (cbVal("cright-cite-perm") ? "blanket permission statement" : (tbVal("cright-cite-name") + " license"))+
                        " which permits " + ddVal("cright-cite-type")+
                        "s and other derivative works so long as the original source is appropriately cited"+
                        (cbVal("cright-cite-SA") ? " and the new work is also released under the same license" : "")+
                        ". Without this attribution" + (cbVal("cright-cite-SA") ? " and license" : "")+
                        ", the work" + sEnd + " " + isWere + " considered copyright infringement. You can "+
                        (cbVal("cright-cite-perm") ? "find the creator's permission statement" : "read more about this license") + " here: "+
                        tbVal("cright-cite-link") + " \n\n";
                } else if(cbVal("cright-utrans")) {
                    str += iidViolation + ', which states: "' + iidBase + '" \n\n'+
                        "Because a translation is a reproduction of the original work in a different language, "+
                        "it can only be posted to AO3 with permission from the original work's creator. "+
                        "Saying a work is not yours or crediting the original creator does not give you the right to upload a translation of their work. \n\n";
                    if(cbVal("cright-utrans-plag")) {
                        str += 'In addition, plagiarism is a violation of Section ' + gSectionTos("Plagiarism") + ', which states: '+
                            `"Plagiarism is the use of someone else's words, or their expressions of their ideas, without attribution. `+
                            iieBase + '" '+
                            "You may not post someone else's work, whether a translation or in the original language, under your own name. \n\n"
                    }
                    str += cInfringed
                } else if(cbVal("cright-PDR")) {
                    str += "This is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                        "AO3 is an archive for the preservation of fanfiction and other transformative fanworks. "+
                        "Works that are not fanworks may not be uploaded to AO3. \n\n"+
                        "Your work" + sEnd + " reproduce" + (sEd == "ed" ? "d" : sEd) + " the following source" + sSource + ": \n\n"+
                        sourceWindow.value + "\n\n"+
                        "While this does not constitute copyright infringement, as the original material is in the public domain, "+
                        "you have not created " + aSpace + "transformative fanwork" + sEnd + ". "+
                        'Transformative use is defined as adding something new, with a further purpose or different character, '+
                        'altering the source with new expression, meaning, or message.  \n\n';
                    if(cbVal("cright-PDR-nameswap")) {
                        str += 'Additionally, Section ' + gSectionTos("Plagiarism") + ' states: "' + iieBase + '" \n\n'
                    }
                } else if(cbVal("cright-art")) {
                    str += iidViolation + '. Photographs, artwork, and other images are subject to the same copyright protections as text. '+
                        "Works that reproduce large portions of other works are not allowed to be uploaded to AO3 "+
                        "without permission from the original creator of that work. \n\n"+
                        "Reproducing someone else's artwork or photos with only slight alterations to the composition is not transformative, "+
                        "and crediting the original creator is not enough to give you the right to upload it. "+
                        "Changing the colors, varying the linework, or making minor adjustments to a character's position does not make the work original to you. \n\n"
                    str += cInfringed
                } else if(cbVal("cright-piracy")) {
                    str += iidViolation + ". Distributing copies of songs, books, movies, or other content uploaded without the original creator's permission is copyright infringement. "+
                        "Sharing links to access or download such content is not permitted on AO3. \n\n"
                    if (cbVal("cright-piracy-playlist")) {
                        str += "If you wish to link to songs from a playlist, we suggest linking to licensed streaming sites such as Spotify, 8tracks, or YouTube. \n\n"
                    }
                } else { // defaults to allowing the user to edit
                    str += iidViolation + ', which states: "' + iidBase +
                        ' This includes stories, artwork, songs, poems, transcripts, and other copyrighted material. […] '+
                        'Epigraphs and short quotations are allowed, as is Content that is set within or based on an existing work."'
                    var crightEditArray = [];
                    if (cbVal ("cright-edit-song")) {crightEditArray.push("song")}
                    if (cbVal ("cright-edit-novel")) {crightEditArray.push("short chapter of a novel")}
                    if (cbVal ("cright-edit-movie")) {crightEditArray.push("10 minutes of a TV episode or movie")}
                    if (crightEditArray.length) str += '\n\n'
                    str += "Crediting the original creator does not give you the right to upload large portions of their work. "
                    if (crightEditArray.length) {
                        str += "In general, it is acceptable to include approximately two or three lines per "+
                            makeListFromArray(crightEditArray,"or") + ". "
                    }
                    str += "\n\n"+
                        "We have determined that you have included too much material from the following source" + sSource + ": \n\n"+
                        sourceWindow.value + "\n\n"
                }
                break;
            case "Wrong rating/warning":
                var warningArray = []
                if (cbVal("ratwar-rating")) {
                    if (!gCountWarningTypes()) {
                        str += 'We have determined that t' + thisTheseWorks +
                            ' contain' + sEd + ' content that requires a "Mature" or "Explicit" rating. \n\n'
                    }
                    str += 'It is important that the rating of a fanwork is accurate '+
                        'so that users will be properly informed before encountering adult content. '
                    if (gCountWarningTypes()) {str += 'In addition, the '}
                }
                if (gCountWarningTypes()) {
                    if (cbVal("ratwar-MCD")) warningArray.push('"Major Character Death"')
                    if (cbVal("ratwar-UA")) warningArray.push('"Underage Sex"')
                    if (cbVal("ratwar-RNC")) warningArray.push('"Rape/Non-Con"')
                    if (cbVal("ratwar-GDOV")) warningArray.push('"Graphic Depictions Of Violence"')

                    if (!cbVal("ratwar-rating")) {str += 'The '}
                    str += 'Archive Warnings are designed to inform users that they may encounter the following types of content: '+
                        'underage sex, rape/non-consensual sex, graphic violence, and major character death. '
                    if (cbVal("ratwar-additional")) {
                        str += "We appreciate your effort to warn users about the content in your work" + sEnd +
                            " using the Additional Tags feature, but these tags do not replace Archive Warnings. ";
                    }
                    str += "\n\n" +
                        "We have determined that t" + thisTheseWorks + " contain" + sEd + " content that "
                    if (!cbVal("ratwar-rating")) {
                        str += 'warrants '
                    } else {
                        str += 'requires a "Mature" or "Explicit" rating, as well as '
                    }
                    str += 'the ' + makeListFromArray(warningArray,"and") + ' Archive Warning'
                    if (warningArray.length > 1) str += 's'
                    str += '. '
                    if (cbVal("ratwar-UA")) {
                        str += (gCountWarningTypes() > 1 ? 'The "Underage Sex"' : 'This') +
                            ' warning is required for works that depict or describe sexual activity involving characters under the age of eighteen (18). '
                    }
                    if (cbVal("ratwar-rating")) str += "\n\n"
                }
                str += 'If you prefer not to specify the nature of your work' + sEnd + ', you may use '
                if (cbVal("ratwar-rating")) {
                    str += 'the "Not Rated" ' + (gCountWarningTypes()? 'and/or ' : '')
                }
                if (gCountWarningTypes()) {
                    str += '"Creator Chose Not To Use Archive Warnings" ' + (cbVal("ratwar-rating")? 'options ' : '')
                } else {str += 'rating '}
                str += 'instead. This indicates that you have chosen to opt out of the '
                if (cbVal("ratwar-rating")) {
                    str += 'ratings ' + (gCountWarningTypes()? 'and/or warnings ' : '')
                } else {str += 'Archive warnings '}
                str += 'system' + (gCountWarningTypes() && cbVal("ratwar-rating") ? 's' : '')+
                    ' for a particular work, and lets users know to "read at their own risk". \n\n'
                break;
            case "Fandom Tags":
                if (ftGroupNum === 1) {
                    str += document.querySelector('#PAC-boilers-fandomTab [groupNum="0"] .PAC-boilers-fandom-group-links').value.trim() + ' \n\n'
                }
                if (sSource || ftGroupNum > 1) { // multiple tags on a single group or multiple groups
                    str += "We have determined that not all of the fandoms you have tagged are represented in " + (sEnd ? "each" : "the") + " work. "+
                        "Accordingly, the " + (sEnd ? "incorrect" : "following") + " fandom tags should be removed"
                    if (ftGroupNum > 1) {
                        str += ": \n\n"
                        for (let i = 0; i < ftGroupNum; i++) {
                            str += ftAssemble(i).str
                        }
                    } else {
                        const zeroGroup = ftAssemble(0,true)
                        str += zeroGroup.suggestions + ': \n' + zeroGroup.tags + '\n\n'
                    }
                } else {
                    str += "We have determined that you have applied the "+
                        '"' + document.querySelector('#PAC-boilers-fandomTab [groupNum="0"] .PAC-boilers-fandom-group-tags').value.trim() + '"'+
                        " tag, when this fandom is not represented in the work. Accordingly, the incorrect fandom tag should be removed"
                    let suggestionTag = document.querySelector('#PAC-boilers-fandomTab [groupNum="0"] .PAC-boilers-fandom-group-suggestions').value.trim()
                    if (suggestionTag === "(Optional)") suggestionTag = ''
                    if (suggestionTag) str += ' or replaced by the "' + suggestionTag + '" tag'
                    str += ". \n\n"
                }
                if (cbVal('ft-rpf')) {
                    str += "RPF stands for Real Person Fiction. When it comes to fandom tagging, "+
                        "AO3 differentiates between RPF fandoms and their non-RPF counterparts. "+
                        "RPF fandom tags are used only for works that do not take place in or involve characters from the fictional universe. "+
                        "If your work is about the actors and not the characters they are playing, only RPF tags should be used. "+
                        "If your work is only about the characters, RPF tags should not be used. \n\n"
                    if (cbVal('ft-actorname')) {
                        str += "Fandom tags that consist of one or more actors' names are RPF tags. "+
                            "They should not be used when your work is about the characters. \n\n"
                    }
                }
                if (cbVal('ft-oneshot')) {
                    str += "We understand that you added these tags to indicate the fandoms "
                    if (cbVal('ft-oneshot-prompt')) str += "you are willing to write for and "
                    str += "that may eventually appear in the work. However, when it comes to fandom tagging on AO3, "+
                        "we do require that the work itself currently contains fanwork content pertaining to that fandom. "+
                        "Once you post a chapter featuring characters from or set in the universe of that fandom, "+
                        "you may add the fandom tag back to the work. \n\n"
                    if (cbVal('ft-nfw')) {
                        str += "Please also note that AO3 is an archive for fanworks, so only stories, art, and other fanworks should be posted here as works. "+
                            "Posting an empty work just to list or ask for prompts, ideas, or other requests "+
                            "is a violation of Section " + gSectionTos("Non-fanwork") + " of our Terms of Service. "+
                            "In future, please use our prompt challenge feature to post or solicit prompts. "+
                            "For more information about prompt challenges, please refer to our FAQ: https://archiveofourown.org/faq/prompt-meme \n\n"
                    }
                }
                break;
            case "Harassment (work)":
                str += hTOS()+
                    hTypes(cbVal('hw-severe'),cbVal('hw-doxxing'),cbVal('hw-slurs'),cbVal('hw-callout'),false,cbVal('hw-gift'),false)+
                    hReasons('work',cbVal('hw-offended'),cbVal('hw-ccforbids'),cbVal('hw-ccforbids-RPF'),cbVal('hw-counter'))
                hExamples('partial');

                if (cbVal("hw-cright")) {
                    str += "T" + thisTheseWorks + " also contain" + sEd + " an excessive amount of copyrighted material. "+
                        'This is a violation of Section ' + gSectionTos("Copyright Infringement") + ' of our Terms of Service. '+
                        'Large portions of copyrighted works may not be uploaded to AO3 without permission from the copyright owner. \n\n'
                }
                if (cbVal("hw-nfw")) {
                    str += "Furthermore, t" + thisTheseWorks + ' ' + isWere + ' not ' + aSpace + 'fanwork' + sEnd + explainAlsoNotFanwork
                }
                break;
            case "Harassment (other)":
                str += hTOS()+
                    hTypes(cbVal('ho-severe'),cbVal('ho-doxxing'),cbVal('ho-slurs'),cbVal('ho-callout'),cbVal('ho-bullyout'),false,cbVal('ho-self'))+
                    hReasons('other',cbVal('ho-offended'),cbVal('ho-ccforbids'),cbVal('ho-ccforbids-RPF'),cbVal('ho-counter'))
                hExamples();

                if (cbVal("ho-comment-anon")) {
                    str += "You are required to follow the Terms of Service at all times when using AO3, "+
                        "regardless of whether or not you are logged into an account. "+
                        "Commenting anonymously does not protect your account from the consequences of your violations. \n\n"
                }
                if (cbVal("ho-comment-BE")) str += hBlockEvasion()
                break;
            case "Icon":
                str += "We have determined that t" + thisThese + " icon" + sEnd + " " + isWere + " not suitable for general audiences. "+
                    "This is a violation of Section II.I of our Terms of Service. "
                if (cbVal('i-sexy')) str += 'User icons must not depict genital nudity or explicit sexual activity. '
                if (cbVal('i-epilepsy')) str += 'User icons must not contain strong flashing lights or contrasting patterns, as these images can cause nausea or seizures. '
                str += '\n\n'
                if (cbVal('i-hateSymbol')) {str += 'User icons must not contain hate symbols. '+
                    `Commenting on other users' works with an icon that contains a hate symbol is also a violation of our harassment policy, `+
                    `which is explained in Section II.H of our Terms of Service. \n\n`}
                break;
        };


        function ftAssemble(num, vertical) {
            let substr = ''
            let tags = document.querySelector('[groupNum="' + num + '"] .PAC-boilers-fandom-group-tags').value.trim().split("\n")
            let suggestions = document.querySelector('[groupNum="' + num + '"] .PAC-boilers-fandom-group-suggestions').value.trim().split("\n")

            for (let i = 0; i < tags.length; i++) {
                tags[i] = vertical? tags[i].trim() : ('"' + tags[i].trim() + '"')
                if (tags[i] == '""') tags.splice(i, 1)
            }
            tags = [...new Set(tags)]

            for (let i = 0; i < suggestions.length; i++) {
                suggestions[i] = '"' + suggestions[i].trim() + '"'
                if (suggestions[i] == '""') suggestions.splice(i,1)
            }
            suggestions = [...new Set(suggestions)]
            if (suggestions.length < 2 && suggestions[0] == '"(Optional)"') suggestions = []

            const tagList = vertical? tags.join('\n') : makeListFromArray(tags, 'and')

            let suggestionList = ''
            if (suggestions.length) {
                suggestionList = " or replaced by the " + makeListFromArray(suggestions, 'and/or') + " tag"
                if (suggestions.length > 1) suggestionList += "s"
            }

            substr += tagList + " should be removed from the following work" + sEnd + suggestionList + ": \n"
            substr += document.querySelector('[groupNum="' + num + '"] .PAC-boilers-fandom-group-links').value.trim() + ' \n\n'

            return {'str': substr,
                    'tags': tagList,
                    'suggestions': suggestionList}
        }

        /*
[AS NEEDED] "FANDOM" should be removed from the following work:
"TITLE", located at LINK

[AS NEEDED] "FANDOM" and "FANDOM" should be removed from the following works:
"TITLE", located at LINK
"TITLE", located at LINK

[AS NEEDED] "FANDOM" and "FANDOM" should be removed from the following works or replaced by the "SUGGESTION" tag:
"TITLE", located at LINK
"TITLE", located at LINK
*/

        // Common harassment sets
        function hTOS () {
            return 'Section ' + gSectionTos("Harassment (work)") + ' of our Terms of Service states: ' +
                '"Harassment is any behavior that produces a generally hostile environment for its target. '+
                'Examples include bullying, threats, and personal attacks by or towards individuals or groups of people." \n\n';
        }
        function hBlockEvasion(giftwork) {
            return "All users have the right to refuse interaction with other individuals. "+
                "Forcing interaction on someone who has blocked you or told you to go away is harassment. "+
                "Using " + (giftwork ? "the gifting system " : "anonymous comments or an alternate account ") +
                "to evade a block is not acceptable. \n\n"
        }
        function hTypes(severe,doxxing,slurs,callout,bullyout,gift,self) {
            let substr = ''

            if (severe) substr += "Threatening or wishing death, violence, or bodily harm on other users is severe harassment. "

            let hOtherReasons = [],
                calloutOnly = callout

            if (doxxing) {hOtherReasons.push("threatening or attempting to doxx another user");calloutOnly = false}
            if (slurs) {hOtherReasons.push("directing slurs at other users");calloutOnly = false}
            if (callout) {hOtherReasons.push("posting a call-out")}
            if (bullyout) {hOtherReasons.push("trying to bully someone into removing their fanworks or leaving AO3");calloutOnly = false}

            let hOtherReasonsList = makeListFromArray(hOtherReasons, "or")
            if (hOtherReasonsList) {
                if (calloutOnly) {
                    substr += "Call-out posts are "
                } else {
                    substr += hOtherReasonsList[0].toUpperCase() + hOtherReasonsList.substring(1) + " is "
                }
                if (severe) substr += "also "
                substr += "harassment. "
            }
            if (severe || doxxing || slurs || callout || bullyout || (!gNumPriors() && outcome == 'suspension')) {
                substr += "This behavior is not permitted on AO3. "
            }
            if (!gNumPriors() && outcome == 'suspension') {
                substr += "Engaging in harassment is grounds for suspension on a first offense. "
            }
            if (substr) substr += '\n\n'
            if (gift) {
                if (cbVal('hw-gift-BE')) {
                    substr += hBlockEvasion(true)
                } else {
                    substr += "Using AO3 to gift someone a work that you know they don't want is harassment. "+
                        "Abuse of the gifting system is not allowed. \n\n"
                }
            }
            if (self) {
                substr += "That you have directed this language toward yourself does not make it acceptable behavior on AO3. \n\n"
            }
            return substr
        }

        function hReasons(workOther,offended,ccforbids,isRPF,counter) {
            let substr = ''

            if (offended) {
                if (workOther == 'work') {
                    substr += "It doesn't matter what kind of fictional content someone else enjoys. "+
                        "There is no user or group of users that you are allowed to harass. "
                } else if (workOther == 'other') {
                    substr += "Harassment is never acceptable. If you encounter content on AO3 that you find unpleasant or upsetting, "+
                        "you should leave the page. "+
                        "You can then filter or mute the content to avoid encountering it again. "+
                        "More information on filters and muting is available in the Terms of Service FAQ: \n"+
                        "https://archiveofourown.org/tos_faq#filters \n"+
                        "https://archiveofourown.org/tos_faq#muting "
                }
                substr += "\n\n"
            }
            if (ccforbids) {
                substr += "The Archive of Our Own, and our parent organization the Organization for Transformative Works, "+
                    "believe that fanworks " + (isRPF ? "(including RPF) " : "") + "are transformative, fair use, and legal. "+
                    "Therefore, we allow fanworks for any fandom or subject, including romantic or sexual content. "+
                    "AO3 users may upload any non-commercial, transformative fanwork without violating our Terms of Service. "+
                    "Regardless of the stance of the canon's original creators" + (isRPF ? " or the real person figures portrayed" : "")+
                    ", neither they nor you may forbid others from posting fanworks on AO3. \n\n"
            }
            if (counter) {
                substr += "Harassment in response to other harassment is not allowed. "+
                    "If you experience or witness harassment on AO3, you should instead file an Abuse report. "+
                    "You can do so by selecting the 'Policy Questions & Abuse Reports' link that is available at the bottom of every page on AO3. \n\n"
            }
            return substr
        }

        function hExamples(lType) {
            if (sourceWindow.value || (cbVal("hw-tag")) && gTabActive() == "Harassment (work)") {
                str += "We have determined that you have posted the following harassing content: \n\n"+
                    sourceWindow.value + "\n\n"
                if (lType == 'partial') {
                    str += "However, this may not be a comprehensive list. "+
                        "It is your responsibility to ensure your entire account is in compliance with our Terms of Service. \n\n"
                }
            }
        }

        // Lastly, check if it needs the 'deleting/orphaning is still a violation' line.
        if (numRem < numWorks && !["Harassment (other)","Wrong rating/warning","Fandom Tags"].includes(gTabActive())) {
            if (outcome != 'suspension') str += gDoNotOrphan()
            str += "Posting and then "
            if (!cbVal('orphan-one') && !cbVal('orphan-multi')) {
                str += "deleting"
            } else {
                if ((cbVal('orphan-multi') && numWorks - numRem > 2) || (cbVal('orphan-one') && numWorks - numRem > 1)) str += "deleting or "
                str += "orphaning"
            }
            str += " this content is still a violation of the Terms of Service. \n\n"
        }

        return str;
    }

    function gDoNotOrphan(suspended) {
        if (cbVal('orphan-one') || cbVal('orphan-multi')) {
            return "We have deleted the work" + ((cbVal('orphan-multi')) ? "s":"") +
                " you orphaned, as you are no longer able to do so yourself. " + (suspended ? '\n\n' : '')
        }
        return ''
    }

    function gParaPriors() {
        let str = "",
            priors = []

        for (let i = 1; i < 4; i++) {
            priors.push({'date': tbVal("priorDate-DATE" + i),
                         'type': rdVal("DATE" + i +"-warning")? "warning" : (rdVal("DATE" + i +"-suspension")? "suspension" : "none"),
                         'category': gCategoryTos(tbVal("priorDate-DATE" + i +"category"))
                        })
        }

        if (priors[0].type == "none" && priors[1].type == "none" && priors[2].type == "none") return str;

        function dString (type) {
            let dateArray = [],
                categoryArray = []

            for (let i = 0; i < priors.length; ++i) {
                if (priors[i].type == type) {
                    dateArray.push(priors[i].date)

                    if (!categoryArray.includes(priors[i].category)) categoryArray.push(priors[i].category)
                }
            }
            return {'num': dateArray.length,
                    'sCat': (categoryArray.length > 1 ? "s" : ""),
                    'dates': makeListFromArray(dateArray, "and"),
                    'categories': makeListFromArray(categoryArray, "and") + (categoryArray.length > 1 ? " policies" : " policy")}
        }

        let wPriors = dString("warning");
        let sPriors = dString("suspension");

        str += "On "
        if (wPriors.num) {
            str += wPriors.dates + ", you were formally warned for violating our " + wPriors.categories +
                (sPriors.num? "; and on " : ". ")
        }
        if (sPriors.num) {
            str += sPriors.dates + ", you were temporarily suspended for "
            if (sPriors.categories == wPriors.categories) {str += "the same offense" + sPriors.sCat + ". "}
            else {str += "violating our " + sPriors.categories + ". "}
        }
        if (outcome == "suspension" && !sPriors.num) {
            str += "You were also told that additional violations could result in your suspension. "
        }

        str += "\n\n";
        return str;
    }

    function gParaSuspended() {
        var str = "";
        if (outcome != "suspension") {return str;}

        str += "As a result of this " + gNumPriors() + "violation, you have been suspended for "+
            tbVal("suspendedFor") + " days"
        if (gTabActive() == "Harassment (other)" &&
            (cbVal("ho-comment-own") || cbVal("ho-comment-anon")) ) {
            if (cbVal("ho-bookmark")) {
                str += ", and the comments found in violation have been removed"
            } else {
                str += ", and the violating content you posted has been removed"
            }
        } else if (gTabActive() == "Commercial Promotion") {
            let ppArray = []
            if (cbVal("comp-profile")) ppArray.push('profile')
            if (cbVal("comp-pseuds")) ppArray.push('pseuds')
            if (ppArray.length) {
                let profilePseudsPages = makeListFromArray(ppArray, 'and') + ' page' + (ppArray.length > 1 ? 's' : '')
                str += ", and the violating content on your " + profilePseudsPages + " has been removed"
            }
        } else if (gTabActive() == "Icon") {
            str += ", and your icon has been deleted"
        }
        str += ". While you are suspended, you cannot post, edit, or delete content on AO3.\n\n";
        return str;
    }

    function gParaHiding() {
        let str = "",
            openTab = gTabActive(),
            suspended = (outcome == "suspension") // boolean

        // First, check if they're suspended and orphaned it
        if (suspended) str += gDoNotOrphan(true)

        // If it's all deleted, then can skip the rest
        // ...Except for commercial promotion, because then we're telling them to clean their account.
        // ...And harassment (other), because there's other things they could be doing there...
        if (numRem == 0 && openTab != "Commercial Promotion" && openTab != "Harassment (other)") return str

        let deadline = " within 7 days";
        suspended ? deadline += " after the end of your suspension. " : deadline += ". "

        // Then use the switch to determine which set of actions is being taken
        switch(openTab) {
            case "Non-fanwork":
                if (cbVal("nfw-empty")) {
                    if (ddVal("nfw-brokenlock") == "broken") {
                        wait7HideIndefinite("nfw-broken")
                    } else {
                        wait7HideIndefinite("nfw-locked")
                    }
                } else {
                    if (cbVal("nfw-allDelete")) {
                        hide7("","")
                    } else if (cbVal("nfw-allEdit") || cbVal("nfw-placeholder")) {
                        hide7("add fanwork content or ","edit or ",false);
                    } else {
                        hide7("","")
                    }
                }
                break;
            case "Commercial Promotion":
                // var editableComp = cbVal("comp-work") || cbVal("comp-profile") || cbVal("comp-pseuds") || cbVal("comp-series") || cbVal("comp-comment")
                if (g2.numRem && !cbVal("comp-work") && !cbVal("comp-series")) g2hide7('','')
                compHide7()
                break;
            case "Copyright Infringement":
                if (cbVal("cright-delete") || cbVal("cright-utrans") || cbVal("cright-PDR")) {
                    hide7("","");
                } else if (cbVal("cright-cite")) {
                    wait7Hide7("ccite")
                } else if (cbVal("cright-art")) {
                    wait7Hide7("cart")
                } else if (cbVal("cright-piracy")) {
                    wait7Hide7("cpiracy")
                } else {
                    wait7Hide7("cedit")
                }
                break;
            case "Plagiarism":
                if (cbVal("plag-delete")) {
                    hide7("","")
                } else if (cbVal("plag-cite")) {
                    wait7Hide7("pcite")
                } else { // default to allowing edits
                    hide7("edit out the plagiarized material or ","sufficiently edit or ")
                }
                break;
            case "Harassment (work)":
                if (cbVal("hw-delete")) {
                    hide7("","")
                } else {
                    let hIncludeExamples = (document.getElementById("PAC-boilers-text-sourceWindow").value || cbVal("hw-tag"));
                    let hTagsComments = "";
                    if (cbVal("hw-tag")) {
                        hTagsComments = "tags";
                        if (cbVal("hw-comment")) {hTagsComments += " and "}
                    }
                    if (cbVal("hw-comment")) {
                        hTagsComments += "comments"
                    }
                    let notAWork = "";
                    if (cbVal("hw-series")) {notAWork = "work" + sRem + " and series"}
                    harassHide7Edit(hIncludeExamples,hTagsComments,true,notAWork);
                }
                if (cbVal("hw-profile")) harassProfileEdit(true)
                if (cbVal("hw-username")) harassNameEdit()
                break;
            case "Harassment (other)":
                var hoProfileMV = false;
                if (cbVal("ho-profile") && (!suspended || cbVal("ho-bookmark") ||
                                            (!cbVal("ho-comment-own") && !cbVal("ho-comment-anon") && !cbVal("ho-comment-BE") && !cbVal("ho-comment-multi") && !cbVal("ho-comment-multitar"))
                                           )) {
                    harassProfileEdit(hoProfileMV)
                    // If there were also comments and no bookmarks, then violating content is taken care of in the suspension bit
                }
                if (cbVal("ho-bookmark")) {
                    hoProfileMV = true;
                    var hBookmarkMulti = "bookmark";
                    if ( document.querySelector('#PAC-boilers-text-multiWindow').value.split('/bookmarks/').length > 2) {hBookmarkMulti += "s"}
                    if (cbVal("ho-bookmark-delete")) {
                        hide7('','',false,hBookmarkMulti)
                    } else {
                        harassHide7Edit(false,false,false,hBookmarkMulti)
                    }
                }
                if (cbVal("ho-username")) harassNameEdit()
                break;
            case "Wrong rating/warning":
                ratwarEdit();
                break;
            case "Fandom Tags":
                fandomEdit(cbVal("ft-tagwall")); // When testing, don't forget that '"TITLE", located at LINK' won't work -- it needs the https://
                break;
            case "Icon":
                if ((cbVal('i-epilepsy') || cbVal('i-hateSymbol')) && !suspended) {
                    str += "Accordingly, an AO3 administrator has removed the icon" + sEnd + ". \n\n"
                } else if (!suspended) {
                    str += "We require you to change t" + thisThese + " icon" + sEnd + deadline +
                        "For instructions on how to do so, please refer to our FAQ: https://archiveofourown.org/faq/profile#changeicon \n\n"+
                        "If you don't remove the icon" + sEnd + " by this deadline, an AO3 administrator will delete " + itThemRem + ". \n\n"
                }
                break;
        };

        function wait7HideIndefinite(hideType) {
            str += "We require you to ";
            if (hideType == "nfw-broken") {
                str += "restore fanwork content to your work" + sRem + " by replacing the images" + deadline +
                    "If you do not know how to embed images within a work, please refer to our FAQ: "+
                    "https://archiveofourown.org/faq/posting-and-editing#embedimage \n\n"
            } else if (hideType == "nfw-locked") {
                str += "change the links or add other fanwork content to your work" + sRem + deadline
            }

            str += "If you don't " + (hideType == "nfw-broken" ? "restore the missing content" : ("edit the work" + sRem)) +
                " by this deadline, we will hide the work" + sRem + " from public view. "+
                "You will be able to access the hidden work" + sRem + " using the link" + sRem + " provided above, or through the automatic email" + sRem +
                " you will receive when " + itTheyRem + " " + isAreRem + " hidden. Once the work" + sRem + " "+
                (sRem? "have" : "has") + " been edited, you can contact us to unhide " + itThemRem + ".\n\n"
        }

        function harassProfileEdit(multiViolations) {
            if (suspended) {
                str += "An AO3 administrator has removed the violating content from your profile page. \n\n"
            } else {
                str += "You are " + (multiViolations? "also " : "") +
                    "required to remove all violating content from your profile page" + deadline +
                    "If you do not do so, an AO3 administrator will edit your profile to remove it. \n\n"
            }
        }

        function harassNameEdit() {
            if (suspended) {
                str += "An AO3 administrator will reset the username of your account. "+
                    "You will still be able to login using your email address. "+
                    "When you choose a new username, it must be one that does not violate our Terms of Service. \n\n";
            } else {
                str += "You are required to choose a new username that complies with our Terms of Service" + deadline +
                    "If you do not do so, you will be suspended until you inform us you are ready to comply. \n\n"
            }
        }

        function harassHide7Edit(includeExamples,tagsComments,willUnhide,notAWork) {
            let work = "work" + sRem;
            if (notAWork) {
                work = notAWork;
                remaining = "";
            }
            str += "We have hidden the " + remaining + work + " and require you to remove all violating content" + deadline +
                "You can access the hidden " + work + " using the link" + sRem + " provided above. "
            if(tagsComments) {
                str += "If you don't remove all harassing " + tagsComments + " by this deadline, "+
                    "an AO3 administrator will delete them. "+
                    "If you don't remove all other harassing content from your " + work + " by this deadline, "+
                    "an AO3 administrator will delete the "+
                    (sRem? "violating " : '') + work + ". "
            } else {
                str += "If you don't remove all harassing content by this deadline, an AO3 administrator will delete the " + work + ". "
            }
            if(willUnhide) weWillUnhide(work)
            str += "\n\n";
        }

        // NFWs (regular), cright must delete / utrans / PDR, plag
        function hide7(editStr1,editStr2,willUnhide,notAWork) {
            let work = notAWork ? notAWork : ("work" + sRem)
            str += "We have hidden the " + remaining + work + " and require you to " + editStr1 + "delete "+
                (['','edit or '].includes(editStr1)? itThemRem : ("the " + work)) + deadline +
                "You can access the hidden " + work + " using the link" + sRem + " provided above. "+
                "If you don't " + editStr2 + "remove the " + work + " by this deadline, "+
                "an AO3 administrator will delete " + itThemRem + ". "
            if(willUnhide) weWillUnhide(work)
            str += "\n\n";
        }

        // Commercial promotion must-delete
        function g2hide7(editStr1,editStr2,willUnhide) {
            let work = "work" + g2.sRem;
            str += "We have hidden the " + g2.remaining + work + " and require you to " + editStr1 + "delete "+
                (['','edit or '].includes(editStr1)? g2.itThemRem : ("the " + work)) + deadline +
                "You can access the hidden " + work + " using the link" + g2.sRem + " provided above. "+
                "If you don't " + editStr2 + "remove the " + work + " by this deadline, "+
                "an AO3 administrator will delete " + g2.itThemRem + ". "
            if(willUnhide) weWillUnhide(work)
            str += "\n\n";
        }

        // For use in categories that often receive early-unhide appeals
        function weWillUnhide(work) {
            str += "Otherwise, your " + work + " will be unhidden after the deadline. "
        }

        // cright may edit, cright must cite, plag may cite
        function wait7Hide7(type) {
            let sourceSample = document.getElementById("PAC-boilers-text-sourceWindow").value.split('\n')[0].trim()
            if (!sourceSample) sourceSample = "SOURCE_NAME"
            let yourWorks = "your " + remaining + "work" + sRem

            str += "We "
            if (suspended) str += "have hidden the " + remaining + "work" + sRem + " and "
            str += "require you to "
            if (["cedit", "cart", "cpiracy"].includes(type)) {
                if (type == "cedit") {str += "reduce the amount of copyrighted material in "}
                else if (type == "cart") {str += "remove all infringing images from "}
                else if (type == "cpiracy") {str += "remove all infringing links from "}
                str += (suspended ? itThemRem : yourWorks) + deadline
            } else if (type == "ccite") {
                str += "edit " + (suspended ? itThemRem : yourWorks) + " to include this citation"+
                    (cbVal("cright-cite-SA")? " and its license" : '')+
                    deadline + 'An example of an appropriate attribution would be: "This work '+
                    (cbVal("cright-cite-SA")? "is licensed under " + tbVal("cright-cite-name") + " and " : '')+
                    'is a ' + ddVal("cright-cite-type") + ' of ' + sourceSample + ", which is "+
                    (cbVal("cright-cite-SA") ? "also " : '')+
                    'released under ' + (cbVal("cright-cite-SA") ? "this license" : tbVal("cright-cite-name")) + '." \n\n'
            } else if (type == "pcite") {
                str += "edit " + (suspended ? itThemRem : yourWorks) + " to include " + (sSource? '' : 'an ')+
                    "appropriate citation" + sSource + " or else remove the plagiarized material" +
                    deadline + 'For example, a citation along these lines would suffice: "This work includes quotations from '+
                    sourceSample + '." '
                if (cbVal("plag-cite-inspired")) {
                    str += "You may also use the Inspired By feature: https://archiveofourown.org/faq/posting-and-editing#archivelink "
                }
                str += "\n\n"
            }
            if (suspended) str += "You can access the hidden work" + sRem + " using the link" + sRem + " provided above. "
            str += "If you don't sufficiently edit your work" + sRem + " by this deadline, "
            if (!suspended) {
                str += "we'll hide your work" + sRem + " so that only you can access " + itThemRem + ". "+
                    "If the work" + sRem + " " + isAreRem + " still not in compliance with our Terms of Service after a week of being hidden, "
            }
            str += "an AO3 administrator will delete " + itThemRem + ".\n\n";
        }

        function ratwarEdit() {
            str += 'We require you to update the '
            if (cbVal("ratwar-rating")) {
                str += "rating" + sEnd + ' ' + (gCountWarningTypes()? 'and ' : 'of ')
            } else {
                str += "Archive "
            }
            if (gCountWarningTypes()) str += 'warnings on '
            str += 'your work' + sEnd + " to accurately reflect the content" + deadline + "If you don't edit the "
            if (cbVal("ratwar-rating")) {
                str += "rating" + sEnd + ' '+ (gCountWarningTypes()? 'and warnings ' : '')
            } else {
                str += "Archive warnings "
            }
            str += "by this deadline, an AO3 administrator will "
            if (gCountWarningTypes()) {
                str += 'add "Creator Chose Not To Use Archive Warnings" '+
                    (cbVal("ratwar-rating")? 'and set the work' + sRem + ' to "Not Rated". ' : 'to the work' + sRem + '. ')
            } else {
                str += 'set ' + itThemRem + ' to "Not Rated". '
            }
            str += '\n\n'
        }

        function fandomEdit(tagwall) {
            str += "We require you to update the fandom tags on your work" + sRem + " to accurately reflect the content"
            if (tagwall) {
                str += `. However, your work` + sRem + ` ` + isWere + ` currently tagged with more than 75 user-defined `+
                    `(fandom, character, relationship, and additional) tags, which means that you will be unable to edit t`+
                    thisTheseWorks + ` to bring ` + itThemRem + ` into compliance with our Terms of Service `+
                    `without also removing enough tags to bring your work` + sRem + ` under the 75-tag limit. \n\n`+

                    `Accordingly, we require you to remove the listed fandom(s), as well as reduce the total number of `+
                    `fandom, character, relationship, and additional tags on t` + thisTheseWorks + ` to no more than 75 such tags,` + deadline +
                    `If you don't edit the work` + sRem + ` by this deadline, we will hide the work` + sRem + ` from public view. `+
                    `You will be able to access the hidden work` + sRem + ` using the link` + sRem + ` provided above, `+
                    `or through the automatic email` + sRem + ` you will receive when the work` + sRem + ` ` + isWere + ` hidden. \n\n`+

                    `Once you have edited your work` + sRem + `, you can reply to this email to let us know, and we will unhide ` + itThemRem + ` at that time. \n\n`
            } else {
                str += ' ' + deadline.trim() + " If you don't do so by this deadline, an AO3 administrator will remove any incorrect fandom tags. "+
                    'If there are no other fandom tags on the work' + sRem + ', we will add the "Unspecified Fandom" tag. \n\n'
            }
        }

        // Commprom of all types. ...I'm not sure I like how it handles all the variants but eh.
        function compHide7() {
            let ppArray = []
            if (!suspended) {
                if (cbVal("comp-profile")) ppArray.push('profile')
                if (cbVal("comp-pseuds")) ppArray.push('pseuds')
            }
            const profilePseuds = makeListFromArray(ppArray, 'and'),
                  profilePseudsPages = profilePseuds + ' page' + (ppArray.length > 1 ? 's' : '')

            let editProfile = "If you don't sufficiently edit your " + profilePseudsPages + " within this time, an AO3 administrator will edit your "+
                profilePseuds + " to remove any commercial content. ",
                editComments = "If you don't edit or remove all violating comments by this deadline, an AO3 administrator will delete the comments. "

            // determine what fills in 'work' in the paragraph below
            let work = ''
            if (numRem && cbVal("comp-work") && cbVal("comp-series")) {
                work += 'work' + sRem + ' and series'
            } else if (numRem && cbVal("comp-work")) {
                work = 'work' + sRem
            } else if (cbVal("comp-series")) {
                work = 'series'
            } else if (ppArray.length && cbVal("comp-comment")) {
                work = profilePseudsPages + ' and comments'
            } else if (ppArray.length) {
                work = profilePseudsPages
            } else if (cbVal("comp-comment")) {
                work = "comments"
            }

            let unhideWorks = work
            if (work.includes('work') || work.includes('series')) { // use includes to avoid thinking about sRem again
                if (g2.numRem && (numRem || work.includes('series'))) {
                    unhideWorks = 'non-violating ' + unhideWorks
                    let previewNFW = ''
                    if (cbVal("comp-NFW")) {
                        previewNFW = "non-fan" + (cbVal('comp-preview')? "work" + g2.sRem + " and " : '')
                    }
                    previewNFW += (cbVal('comp-preview') || !cbVal("comp-NFW"))? "preview " : ''
                    str += "We have hidden the works " + (cbVal("comp-series")? 'and series ' : '' ) +
                        "and require you to delete the " + previewNFW + "work" + g2.sRem+
                        " and edit out all instances of commercial promotion from your "+
                        (cbVal("comp-work")? 'other ' : '') + work + deadline +
                        "You can access the hidden works using the links provided above. "+
                        "If you don't remove the " + previewNFW + "work" + g2.sRem + " or sufficiently edit your " +
                        (cbVal("comp-work")? 'other ' : '') + work +
                        " by this deadline, an AO3 administrator will delete the violating works. "
                } else {
                    str += "We have hidden the " + remaining + work + " and require you to edit out all instances of commercial promotion" + deadline+
                        "You can access the hidden " + work + " using the link" + sRem + " provided above. "
                    if (cbVal("comp-work")) {
                        if (cbVal('comp-tag') || cbVal('comp-comment')) {
                            str += "If you do not remove all commercial " +
                                (cbVal("comp-tag") ? 'tags' + (cbVal('comp-comment')? ' and comments' : '') : 'comments') +
                                ", an AO3 administrator will delete them. "+
                                "If the work" + sRem + ' ' + isAreRem + " not otherwise sufficiently edited"
                        } else {
                            str += "If you don't sufficiently edit the work" + sRem
                        }
                        str += " by this deadline, an AO3 administrator will delete the " + (sRem? "violating ": "") + "work" + sRem + ". "

                    }
                }
                if (cbVal("comp-series")) {
                    str += "If you don't sufficiently edit the series by this deadline, an AO3 administrator will delete the series, "+
                        "though any non-violating works in the series will remain as-is. "
                }
                weWillUnhide(unhideWorks)
                str += '\n\n'
                if (ppArray.length) str+= editProfile + "\n\n"

            } else if (ppArray.length || cbVal("comp-comment")) {
                if (!g2.numRem) str += "We require you to edit out all instances of commercial promotion" + deadline
                str += (ppArray.length? editProfile : '') + (cbVal('comp-comment')? editComments : '') + ' \n\n'
            }
            if (cbVal("comp-extension")) {
                str += "If you believe that this deadline is not enough time for you to make the required edits, "+
                    "you can request more time by replying to this email.\n\n"
            }

        }
        return str;
    }

    function gParaReviewAccount() {
        var str = "",
            priorWillBan = cbVal("priorWillBan")
        if (rdVal('none')) {return str;}

        /* At some point I need to fix this so that 'other works' can be adjusted to 'other content' ('all your other content?')
    is in compliance -- for commprom where it's not in a work. ...No idea what to do about harassment, hm.
    */

        if (outcome == "warning") {
            str += "A " + gNumPriors() + "warning has been placed on your account as a result of this violation"
            if (gTabActive() == "Harassment (other)" &&
                (cbVal("ho-comment-own") || cbVal("ho-comment-anon")) ) {
                if (cbVal("ho-profile") || cbVal("ho-bookmark")) {
                    str += ", and the comments found in violation have been removed. "
                } else {
                    str += ", and the violating content you posted has been removed. "
                }
            } else {str += ". "}
        } else if (rdVal('note')) {
            str += "We will not be issuing a formal warning against your account; however, we have noted this ruling in our records. "
        }

        switch (gTabActive()) {
            case "Harassment (other)":
                str += "Do not engage in harassment again. "+
                    (cbVal("ho-comment-BE")? "Do not comment again, anonymously or under any account, on any works by this creator or in reply to any of their comments. " : '')+
                    "Further violations of the Terms of Service may result in a "
                if (!priorWillBan) {
                    str += (outcome == "suspension" ? "longer " : "") + "temporary suspension or a "
                }
                str += "permanent ban. \n\n";
                break;
            default:

                str += (gTabActive() == "Harassment (work)"? "Do not engage in harassment again. " : '')+
                    "We recommend that you review your account and ensure your other "+
                    (["Commercial Promotion", "Harassment (work)", "Icon"].includes(gTabActive()) ? "content is " : "works are ")+
                    "in compliance"

                if (outcome == "warning" || rdVal('note')) {
                    str += " with our Terms of Service. If you do not "
                    if ((gTabActive() == "Plagiarism" && cbVal('plag-cite')) ||
                        gTabActive() == "Copyright Infringement" && cbVal('cright-cite') ||
                        gTabActive() == "Wrong rating/warning") {str += "edit or "}
                    str += "remove all violating content, or if you violate the Terms of Service again, you may be "+
                        (outcome == "warning" ? "temporarily or permanently" : "formally warned or") + " suspended. \n\n"
                } else if (outcome == "suspension") {
                    str += ", and that you do not violate the Terms of Service again. " +
                        "If we learn that you have posted other violating content, " +
                        "or that you have created or used another account during this time, " +
                        "you may be " + (priorWillBan? '' : "suspended again or ")+
                        "permanently banned. \n\n"
                }
        }
        return str;
    }

    function gParaTOSFAQ() {
        let str = ""

        switch (gTabActive()) {
            case "Non-fanwork":
                if ((outcome == "none" || outcome == "note") && cbVal("nfw-empty")) return str;
                break;
            case "Fandom Tags":
                if (outcome == "none" || outcome == "note") return str;
                break;
            case "Wrong rating/warning":
                str += "For more information about our Ratings and Warnings policies, "+
                    "please refer to our Content Policy and Terms of Service FAQ: \n"+
                    "https://archiveofourown.org/content#tags. \n"+
                    "https://archiveofourown.org/tos_faq#ratings_warnings_faq \n\n"
                return str;
                break;
        }

        str = "For more information about content and behaviors that are not permitted on AO3, " +
            "and the penalties you may receive for a violation, " +
            "please refer to our Content Policy and Terms of Service FAQ: \n" +
            "https://archiveofourown.org/content \n" +
            "https://archiveofourown.org/tos_faq#policy_procedures_faq \n\n"
        return str;
    }

    function gParaClose(type) {

        switch (type) {
            case "toUser":
                return "If you have any questions, " + (gTabActive() == "Non-fanwork" && cbVal('nfw-empty') ? "" : "or if you wish to appeal this decision, ") +
                    "please reply to this email. \n\n"
            case "toReporter":
                return "If you have any questions, please reply to this email. Otherwise, this matter is now closed. \n\n"
            case "insufficientReport":
                return "If you would like to provide additional information, please reply to this email. "+
                    "If you do not reply, then we will consider this matter closed, as we are unable to investigate further.  \n\n"
            case "moreInfo":
                return "If you have any questions, or if you have any further information you wish to share at this time, " +
                    "please reply to this email. Otherwise, this matter is now closed. \n\n"
            case "RUOK":
                return "We hope this alleviates your concerns. If you have any questions, please reply to this email. \n\n"
        }
        return ''
    }

    function gGreetReporter() {
        return "Hi, \n\n"+
            "Thank you for contacting the AO3 Policy & Abuse committee. "
    }

    function gUpholdReporter(multi) {
        let users = getWorkInfo("name"),
            orphaned = (users == 'the orphan account'),
            multiusers = (users.includes(' and ')),
            anon = (users == 'an anonymous creator'),
            str = ""

        let sMulti = (multi? 's' : '')

        let multiStr1 = orphaned? "an orphaned work" : "a work by " + users,
            multiStr2 = "this work was in";

        if (multi) {
            multiStr1 = orphaned? "several orphaned works" : "several works by " + users
            multiStr2 = "these works were in";
        }

        let defaultMulti2 = multiStr2,
            defaultResult = ". Accordingly, the violating content has been removed. ",
            violationResult = defaultResult

        function takeAction() {
            violationResult = ", and have taken action to resolve this matter. "
        }
        function itIsHarassment(nBE) {
            multiStr2 = "this is a case of harassment, which is a"
            violationResult = ". Accordingly, " + (!nBE ? "the violating content has been removed and " : "") +
                "we are taking the appropriate steps to deal with the matter. "
        }

        switch(gTabActive()) {
            case "Non-fanwork":
                if (cbVal("nfw-empty") || cbVal("nfw-placeholder")) {
                    takeAction()
                } else {
                    multiStr2 = (multi? "these works were not fanworks": "this work was not a fanwork")+
                        ", which is a"
                }
                if (!cbVal("nfw-empty")) orphaned = true // bit of a workaround to make use of the no-username-given
                break;
            case "Commercial Promotion":
                orphaned = true // bit of a workaround to make use of the no-username-given
                multiStr2 = (!anon && multiusers ? "these users were" : "this user was") +
                    " engaging in commercial activities, which is a"
                break;
            case "Plagiarism":
                // Delete/edit works fine but citations don't
                if (cbVal("plag-cite")) takeAction()
                break;
            case "Copyright Infringement":
                // Delete/edit works fine but citations don't
                if (cbVal("cright-cite")) {
                    takeAction();
                    violationResult += "Please note that "
                    if (document.getElementById("PAC-boilers-text-sourceWindow").value && !multi) {
                        violationResult += document.getElementById("PAC-boilers-text-sourceWindow").value
                    } else {violationResult += "the source material"}
                    violationResult += " was released under a " + tbVal("cright-cite-name")+
                        ", which permits " + ddVal("cright-cite-type") + "s"+
                        " and other derivative works so long as the original source is appropriately cited";
                    if(cbVal("cright-cite-SA")) {violationResult += " and the new work is also released under the same license"};
                    violationResult += ". You can " + (cbVal("cright-cite-perm") ? "find the creator's permission statement" : "read more about this license") + " here: "+
                        tbVal("cright-cite-link");
                }
                break;
            case "Wrong rating/warning":
                multiStr2 = multi ? "these works " : "this work "
                if (!gCountWarningTypes()) { // rating only
                    multiStr2 += (multi ? "were " : "was ") + "incorrectly rated, which is a"
                    violationResult = ". Accordingly, the rating" + (multi ? "s have" : " has")
                } else if (cbVal("ratwar-rating")) { // rating and warning(s)
                    multiStr2 += "lacked " + (multi ? "" : "a ") + "sufficient rating" + sMulti + " and Archive Warnings, which is a"
                    violationResult = ". Accordingly, the rating" + sMulti + " and warnings have"
                } else { // warning only
                    multiStr2 += "lacked sufficient Archive Warnings, which is a"
                    violationResult = ". Accordingly, the warnings have"
                }
                violationResult += " been edited. " +
                    (cbVal('ratwar-offended')? '\n\n' + gRatwarOffended() : '')
                break;
            case "Fandom Tags":
                multiStr2 = (multi ? "these works were " : "this work was ") + 'tagged with one or more inapplicable fandoms, which is a'
                violationResult = ". Accordingly, the fandom tags have been edited. "
                break;
            case "Harassment (work)":
                if (anon) {
                    multiStr1 = users
                } else if (multiusers) {
                    multiStr1 = "the users " + users
                } else {
                    multiStr1 = "the user " + users
                }
                itIsHarassment()
                break;
            case "Harassment (other)":
                multiStr1 = cbVal("ho-comment-anon")? "an anonymous commenter" : ("the user " + users)
                itIsHarassment(cbVal("ho-comment-BE"))
                if (cbVal("ho-comment-own")) {
                    violationResult += "If you do not wish to ever receive any comments (of any kind) from this individual, "+
                        "then we advise that you also block them. For instructions on how to block someone, please refer to the Terms of Service FAQ: "+
                        "https://archiveofourown.org/tos_faq#blocking "
                }
                if (cbVal("ho-comment-BE")) {
                    violationResult += "You should not receive any further comments from this user, "+
                        "but if you do (or if you receive comments that you believe to be from this individual), "+
                        "please let us know by filing a new Abuse report. "
                }
                break;
            case "Icon":
                multiStr1 = "about the icon" + sMulti + " of the user " + users
                multiStr2 = (multi? "these icons were" : "this icon was") + " not suitable for general audiences, which is a"
                break;

        };

        if (multiStr2 == defaultMulti2 && violationResult == defaultResult) {
            violationResult = ", and accordingly, the violating content has been removed. "
        }

        str = "\n\n---\n\nTo reporter(s)"
        // I should restructure this function so that I don't have to also have the below conditions in the assembly function
        if (sEnd && !["Commercial Promotion","Harassment (work)","Harassment (other)","Icon"].includes(gTabActive())) {
            str += " of " + (multi ? "multiple works" : "single works")
        } else if (sEnd && gTabActive() === "Icon") {
            str += " of " + (multi ? "multiple icons" : "single icon")
        }
        str += ': \n\n' + gGreetReporter() +
            "We appreciate your concerns and have reviewed your complaint" + (!orphaned ? " about " + multiStr1 : "") + ". \n\n"+
            "We have determined that " + multiStr2 + " violation of Section " + gSectionTos() + " of our Terms of Service"+
            violationResult + "\n\n"
        str += gParaClose("toReporter") + gSignOff()

        return str;
    }

    function gUpholdInformalReporter() {

        return "\n\n---\n\nTo reporter (informal reply): \n\n"+
            "Hi, \n\n"+
            "Thanks for your report. We're taking care of it. \n\n"+
            "If you have any questions, please feel free to reply to this email. \n\n"+
            "Best, \n"+
            gSignOff()
    }

    function gRatwarOffended() {
        let str = `However, this type of content does not violate our Terms of Service. `+
            `Therefore, we will not be taking any further action. \n\n`+

            // from here down to the closing paragraph it's just the OU boiler
            `AO3's Terms of Service are designed to comply with United States law. `+
            `It is legal in the U.S. to create and share fictional content about murder, theft, assault, or other such crimes. `+
            `It is also legal in the U.S. to create and share fictional content `+
            `about topics such as child sexual abuse, rape, incest, or bestiality. `+
            `AO3 allows users to post and access fiction about all of these topics. \n\n`

        if (cbVal('ratwar-UA')) {str += `In accordance with U.S. law, `+
            `AO3 prohibits sexually explicit or suggestive photographic or photorealistic images of real children. `+
            `However, stories and non-photorealistic artwork are allowed, both under U.S. law and on AO3. \n\n`}

        if (cbVal('ratwar-offended-RPF')) {str += `We also permit real-person fiction (RPF), `+
            `regardless of the person's age in the work or in real life. `+
            `As our Terms of Service explains, RPF is not harassment. `+
            `This applies whether or not the subjects would approve of the work. `+
            `Fiction about real people is still fiction, and therefore it is allowed on AO3. \n\n`}

        str += `We will not remove content that does not violate our Terms of Service. `+
            `However, we do provide options to help users avoid topics they do not wish to encounter `+
            `or content that is illegal to access in their local jurisdiction. \n\n`+

            `Archive warnings are required for any works that depict the following types of content: `+
            `underage sex, rape/non-consensual sex, graphic depictions of violence, and major character death. `+
            `If you do not want to encounter one of these topics, `+
            `you should avoid all works that use the specific Archive warning `+
            `or the blanket "Creator Chose Not To Use Archive Warnings" label. \n\n`+

            `For more information about required ratings and warnings, please refer to our Terms of Service FAQ: `+
            `https://archiveofourown.org/tos_faq#ratings_warnings_faq \n\n`+

            `You can exclude works from your search results by filtering out Archive warnings, ratings, or other tags. `+
            `More information on filtering is available here: https://archiveofourown.org/tos_faq#filters \n\n`+

            `You can mute specific users to permanently remove them from your search results. `+
            `You can also use a site skin to mute specific works. `+
            `To learn how to mute content, please refer to the Terms of Service FAQ: https://archiveofourown.org/tos_faq#muting `
        return str
    }

    // For upheld complaints
    async function assembleUpheldBoiler() {
        let bstr = ''
        if (rdVal('note') || rdVal('none')) {bstr += 'Will note on the account \n\n'}
        bstr += gSubjectLine(gSubject()) +
            await gParaGreetUser() +
            (['Fandom Tags', 'Icon'].includes(gTabActive())? '' : gLinks()) +
            gParaTosBlock() +
            gParaPriors() +
            gParaSuspended() +
            gParaHiding() +
            gParaReviewAccount() +
            gParaTOSFAQ() +
            gParaClose("toUser") +
            gSignOff()
        if (cbVal("reply-formal")) {
            bstr += gUpholdReporter()
        }
        if (cbVal("reply-formal") && sEnd && !["Commercial Promotion","Harassment (work)","Harassment(other)"].includes(gTabActive())) {
            bstr += gUpholdReporter(true)
        }
        if (cbVal("reply-informal")) {
            bstr += gUpholdInformalReporter()
        }

        return bstr;
    }

    function assembleRatWarRejection() {
        let ratNo = cbVal("ratwar-rating"),
            warNo = gCountWarningTypes(),
            warOptions

        document.querySelectorAll('[id^="PAC-boilers-cb-warNo-"]').forEach(cb => {
            if(cb.checked) warOptions = true
        })
        warNo = warNo || warOptions

        let detectG = false
        if (document.querySelector('dd.rating.tags')) {
            detectG = document.querySelector('dd.rating.tags').innerText === 'General Audiences'
        }

        let str = gGreetReporter() +
            "We appreciate your concerns and have reviewed your complaint"
        if (cbVal('ratNo-ratReject') || cbVal('ratNo-GvsT') || cbVal('warNo-warReject')) {
            if (sEnd) {
                str += " that several works by " + getWorkInfo('name')
            } else {
                str += " that the work " + getWorkInfo('title by name')
            }
            if (ratNo) {
                str += " " + isWere + " incorrectly rated"
                if (warNo) {str += " and"}
            }
            if (warNo) {
                str += " " + doEs + " not use the appropriate Archive Warnings"
            }
        }
        str += ". \n\n"

        // Handle the options lists
        let warNames1 = [],
            warNames2 = [],
            insuffNames = [],
            warExplain = ''

        // Set up helper strings
        let MENR = 'Users who access fanworks rated "Mature", "Explicit", or "Not Rated" must agree to potentially encounter adult content. '+
            'We do not enforce any distinctions between these three ratings, '+
            "and will defer to the creator's discretion in choosing which one to use on their work. "
        let MisHigh = `our Terms of Service FAQ explains, `+
            `"The creator's discretion to choose between 'Mature' and 'Explicit' is absolute: `+
            `we will not mediate any disputes about those decisions." `

        if (cbVal('warNo-warReject') || cbVal('ratwarNo-insufficient')) {

            if (ratNo) insuffNames.push('explicit content')
            if (warNo) insuffNames.push('content requiring an Archive warning')

            if (cbVal('ratwar-UA') || cbVal('warNo-warUAunclear') || cbVal('warNo-warUAdating')) {
                warNames1.push('underage sexual activity')
                warNames2.push('underage sexual content')

                let explainUAdating = ', as our Terms of Service FAQ states, "Sexual activity does not include dating activities such as kissing." '

                warExplain += 'The "Underage Sex" Archive Warning (or the "Creator Chose Not To Use Archive Warnings" label) '+
                    'is required for works that depict or describe sexual activity involving characters under the age of eighteen (18). '
                if (!cbVal('warNo-warUAdating') || cbVal('warNo-warUAunclear') || cbVal('ratwarNo-insufficient')) { // if UA without selection, defaults to this
                    warExplain += 'However, we do not require the "Underage Sex" Archive Warning unless the work clearly indicates that a character is younger than 18. '+
                        "If the characters' ages in the fanwork are ambiguous, then we will assume the characters have been "+
                        '"aged up", even if they are underage in canon. ' + (cbVal('warNo-warUAdating') ? 'In addition' + explainUAdating : '') + '\n\n'
                } else if (cbVal('warNo-warUAdating')) {
                    warExplain += 'However' + explainUAdating + '\n\n'
                }
            }
            if (cbVal('ratwar-RNC')) {
                warNames1.push('clearly non-consensual sexual activity')
                warNames2.push('non-consensual sexual content')

                warExplain += 'The "Rape/Non-Con" Archive Warning (or the "Creator Chose Not To Use Archive Warnings" label) '+
                    'is required for works that depict or describe non-consensual sex. '+
                    'However, we do not require the "Rape/Non-Con" Archive Warning if consent was given in complicated or ambiguous circumstances, '+
                    'nor for works involving dubious consent ("dubcon"). \n\n'
            }
            if (cbVal('ratwar-GDOV')) {
                warNames1.push('graphic violence')
                warNames2.push('explicit violence')
            }
            if (cbVal('ratwar-MCD')) {
                warNames1.push('major character death')
                warNames2.push('the death of a major character')

                warExplain += 'The "Major Character Death" Archive Warning (or the "Creator Chose Not To Use Archive Warnings" label) '+
                    'is required for works that depict or describe the death of a major character in the work. '+
                    'However, we do not require the "Major Character Death" Archive Warning if the death is merely referenced '+
                    ' or if the character is not prominently featured in the work. \n\n'
            }
        }

        // Handle the ratings rejections (if needed)
        if (ratNo) {
            if (cbVal("ratNo-ratNotYet")) {
                str += 'At the time of our investigation, t' + thisTheseWorks + ' did not contain graphic adult content. '+
                    'As ' + (warNo ? 'such, ' : '') + 'the work' + sEnd + ' ' + isWere + " not currently in violation of our ratings policy"+
                    (warNo ? '' : ', we will not be taking any action') + '. \n\n'

                str += 'A work that contains adult content must have a rating of "Mature", "Explicit", or "Not Rated". '+
                    'However, higher ratings are not required if the work does not contain adult content, '+
                    'regardless of what other tags or notes may be on the work. '+
                    'Please do not report a work simply based on the tags or summary, as these may be inaccurate or misleading. \n\n'+
                    'If t' + thisTheseWorks + ' ' + isWere + ' later updated to contain adult content, and the creator does not change the rating' + sEnd +
                    ' to "Mature", "Explicit", or "Not Rated", you are welcome to report the work' + sEnd + ' to us at that time. \n\n'
            } else if (cbVal("ratNo-ratReject")) {
                str += ((warNo) ? 'T' : 'After investigation, we have determined that t')+
                    thisTheseWorks + ' ' + isWere + ' not in violation of our ratings policy, because ' + itThey + ' ' + doEs + ' not contain graphic adult content. '+
                    (warNo ? '' : '\n\n')

                str += `Our Terms of Service FAQ states: "In response to valid complaints about a misleading rating, `+
                    `the Policy & Abuse committee may redesignate a fanwork marked 'General' or 'Teen' to 'Not Rated', `+
                    `but in other cases, we will defer to the creator's decision. `+
                    `In general, we will not recategorize a fanwork in response to a complaint when the content at issue is a reference or is otherwise not graphic."`

                if (cbVal('ratNo-ratIsG') || detectG) {
                    str += ' \n\nIn addition, we will not mediate any disputes about whether a work should be rated "General" or "Teen". '+
                        'The decision to choose between "General" and "Teen" is left entirely up to the creator.'
                }

                str += ' \n\n'
            } else if (cbVal("ratNo-GvsT")) {
                str += 'T' + thisTheseWorks + ' ' + doEs + ' not contain graphic adult content, so ' +
                    itThey + ' ' + isWere + " not in violation of our ratings policy. "+
                    'We will only require a rating change if a work rated "General" or "Teen" contains adult content. \n\n'+
                    'Our Terms of Service FAQ states: "The creator'+
                    "'s discretion to choose between 'General' and 'Teen' is absolute: "+
                    'we will not mediate any disputes about those decisions." \n\n'
                if (cbVal('ratNo-GvsTnoAdult')) {
                    str += 'Any instances of adult content in t' + thisTheseWorks +
                        ' are brief or non-descriptive enough to not require the "Mature" or "Explicit" rating on the work as a whole. \n\n'
                }
            } else if (cbVal("ratNo-NRisHigh")) {
                str += (warNo? 'After investigation, we have determined that the content you reported does not violate our Terms of Service. Accordingly, ' :
                        'However, this content is not in violation of our ratings policy. Therefore, ')+
                    'we will not be taking any action. \n\n'

                if (warNo && !cbVal("ratNo-MisHigh")) {
                    str += 'T' + thisTheseWorks + ' ' + isWere + ` rated "Not Rated", so ` + itThey + ' ' + isWere + ` not in violation of our ratings policy. `+
                        (cbVal("ratNo-MisHigh")? `"Not Rated"` : `This rating`) + ` means "may contain content of any rating", `+
                        `so a more specific rating is not required. `
                } else {
                    str += `When a work is labelled "Not Rated", a more specific rating is not required. `+
                        `This rating essentially means "read at your own risk". `
                }

                str += (cbVal("ratNo-MisHigh")? `In addition, as ` + MisHigh : '')+
                    MENR + '\n\n'

            } else if (cbVal("ratNo-MisHigh")) {
                str += (warNo? 'After investigation, we have determined that the content you reported does not violate our Terms of Service. Accordingly, ' :
                        'However, this content is not in violation of our ratings policy. Therefore, ')+
                    'we will not be taking any action. \n\n'+

                    MENR + `As ` + MisHigh + '\n\n'
            } else if (cbVal('ratwarNo-insufficient')) {
                str += 'The Policy & Abuse committee will take action if a work rated "General" or "Teen" contains highly explicit content. '+
                    'If the content is a reference or is otherwise not graphic, we will not require the rating to be changed. '
                if (cbVal('ratNo-ratIsG') || detectG) {
                    str += 'Please note that we do not enforce any distinctions between the "General" and "Teen" ratings. '
                }
                str += '\n\n'
            } else {
                str += (warNo ? "T" : "However, t") + "his content is not in violation of our ratings policy. "
            }
            if (cbVal("ratNo-lowerRat")) {
                str += "While the Policy & Abuse committee may require a higher rating to be applied to a work, "+
                    "we will not require a rating to be lowered even if the work does not currently contain explicit content. \n\n"
            }
        }

        // Handle the warnings side of things (if needed)
        if (cbVal("warNo-warReject")) {
            str += (ratNo? `T` : `After investigation, we have determined that t`) + thisTheseWorks + ` ` + doEs + ` not contain `+
                makeListFromArray(warNames1,"or") + ". "+
                'As ' + (ratNo ? 'such, ' : '') + 'the work' + sEnd + ' ' + isWere + " not in violation of our warnings policy"+
                (ratNo ? '' : ', we will not be taking any action') + '. \n\n'
            str += warExplain
            if (cbVal('warNo-indicator')) {
                str += "The presence of " + tbVal('warNo-indicator-text') + " does not necessarily mean that the work requires a warning. "+
                    "An Archive warning is only required if the work clearly features " + makeListFromArray(warNames2,"or") + ". \n\n"
            }
        } else if (warNo && cbVal("ratwarNo-insufficient")) {
            str += warExplain
        } else if (cbVal("warNo-CNTW")){
            if (!cbVal("ratNo-NRisHigh")) {
                str += (cbVal("ratNo-MisHigh")? "This content also" : "After investigation, we have determined that the content you reported")+
                    " does not violate our "+
                    (ratNo ? 'warnings policy. ' : "Terms of Service. Accordingly, we will not be taking any action. \n\n")+
                    'When a work is tagged with "Creator Chose Not To Use Archive Warnings", no further warnings are required. '+
                    'This tag essentially means "read at your own risk". '
            } else {
                str += `Similarly, t` + thisTheseWorks + ` ` + isWere + ` tagged with "Creator Chose Not To Use Archive Warnings". `+
                    `As this tag essentially means "read at your own risk", no further warnings are required. `
            }
            str += 'Fanworks with "Creator Chose Not To Use Archive Warnings" may contain depictions or descriptions of underage sex, '+
                'rape/non-consensual sex, graphic violence, or major character death. '+
                'Users who do not wish to encounter these topics should avoid accessing fanworks marked with "Creator Chose Not To Use Archive Warnings". \n\n'
        } else if (warNo) {
            str += (ratNo ? "T" : "However, t") + "his content is " + (ratNo? "also " : "") + "not in violation of our warnings policy. "+
                (ratNo ? '' : "Therefore, we will not be taking any action. \n\n")

            if (cbVal("warNo-NAWA")) {
                str += 'Our policy is that the selection of "No Archive Warnings Apply" does not exclude the selection of other Archive warnings. '+
                    'If a work is tagged with both "No Archive Warnings Apply" and any additional Archive warnings, then the other Archive warnings have precedence. \n\n'+
                    'If you do not want to encounter one of the topics covered by the Archive warnings, '+
                    'it is best to filter to exclude all of the Archive warnings you wish to avoid (including the blanket "Creator Chose Not To Use Archive Warnings" label). '+
                    'We do not recommend solely relying upon filtering to include "No Archive Warnings Apply".'
            }
            if (cbVal("warNo-removeWar")) {
                str += "The Policy & Abuse committee may require a particular Archive warning to be applied to a work when we determine it is clearly needed. "+
                    "However, we will not require a warning to be removed from a work, even if the work does not contain the content that the warning indicates."
            }
            str += ' \n\n'
        }

        if (cbVal("ratwarNo-insufficient")) {
            if (!insuffNames.length && !ratNo && !warNo) {
                insuffNames.push('explicit content')
                insuffNames.push('content requiring an Archive warning')
            }
            str += "In order to investigate your report, "+
                "we ask that you please specify where in the work" + sEnd + " the " + makeListFromArray(insuffNames, ratNo || warNo ? 'and' : 'or') +
                " occurs, such as by providing quotes or chapter numbers. We will then be able to proceed with our investigation. \n\n"+
                gParaClose("insufficientReport")
        } else {
            str += gParaTOSFAQ()
            str += gParaClose("toReporter")
        }
        str += gSignOff()
        return str
    }

    function assembleRUOK() {
        let chapters = tbVal('misc-ruokfw-chapters').trim()

        let locations = []
        if (cbVal('misc-ruoknfw')) locations.push(sEnd? 'several': 'one')
        if (cbVal('misc-ruokfw-tags')) locations.push('tags')
        if (cbVal('misc-ruokfw-notes')) locations.push('notes')
        if (cbVal('misc-ruokfw-summary')) locations.push(sEnd? 'summaries': 'summary')
        let locList = (cbVal('misc-ruoknfw')? '' : 'the ') + makeListFromArray(locations, 'and')

        if (cbVal('misc-ruokfw-chapters')) {
            if (locList.length > 4) locList += ' and '
            locList += 'Chapter' + (chapters.includes(' ')? 's ' : ' ') + chapters
        }

        let delLocations = []
        if (cbVal('misc-ruoknfw')) delLocations.push(itThemRem)
        if (cbVal('misc-ruokfw-notes') || cbVal('misc-ruokfw-summary')) delLocations.push('note' + sRem)
        if (cbVal('misc-ruokfw-chapters')) {
            let bstr = 'chapter'
            if (chapters.includes(' ')) bstr += 's'
            delLocations.push(bstr)
        }
        let delList = (cbVal('misc-ruoknfw')? '' : 'the ') + makeListFromArray(delLocations, 'and')

        let str = gSubjectLine(gSubject()) + ' \n\n'+
            'Hi, \n\n'+
            'A concerned user recently pointed us to ' + locList + ' of your work' +
            ((cbVal('misc-ruoknfw') || sEnd)? 's' : '') + ': \n\n'+
            gLinks()+

            `We wanted to check and make sure you are okay. If you are struggling, please talk to someone. `+
            `If you don't know who to talk to, please reach out to counselors at one of these services: `+
            `http://www.suicide.org/international-suicide-hotlines.html \n\n`+

            `AO3 is not a safe place to post this, so we have ` +
            (cbVal('misc-ruokfw-tags')? 'deleted the tags ' + (locations.length>1 || cbVal('misc-ruokfw-chapters')? 'and ' : '') : '') +
            `hidden the work` + sEnd + `. `+
            (sRem? 'They' : 'It') + ` will stay hidden until you are ready to delete ` + delList + `. `+
            `If there is anything we can do to help you, please let us know. \n\n`+

            gSignOff()+
            "\n\n---\n\nTo reporter(s)\n\n"+
            gGreetReporter() +
            "In cases such as these, we will reach out to the user and try to provide resources to help them if they are struggling. \n\n"+
            gParaClose("RUOK")+
            gSignOff()

        return str
    }

    function togglePicker(caseName) {

        var picker = document.getElementById("PAC-boilers-picker");
        var boilerWindow = document.getElementById("PAC-boilers-boilerWindow");
        var configWindow = document.getElementById("PAC-boilers-configWindow");
        var multiWindow = document.getElementById("PAC-boilers-multiWindow");
        var sourceWindow = document.getElementById("PAC-boilers-sourceWindow");

        if (picker === null) return;

        switch(caseName) {
            case "Boilers":
                if (picker.style.display == "block") {
                    picker.style.display = "none";
                    boilerWindow.style.display = "none";
                    configWindow.style.display = "none";
                    multiWindow.style.display = "none";
                    sourceWindow.style.display = "none";
                } else {
                    picker.style.display = "block";
                    titleSourceWindow(document.getElementById("PAC-boilers-title").textContent);
                }
                break;
            case "Main only":
                if (picker.style.display == "block") {
                    picker.style.display = "none";
                    boilerWindow.style.display = "none";
                    configWindow.style.display = "none";
                } else {
                    picker.style.display = "block";
                }
                break;
        }
    }

    function br(cont) {
        cont.appendChild(document.createElement("br"));
    }

    function boldText (text, cont) {
        let x = document.createElement("div")
        x.innerHTML = text
        x.style.fontWeight = "bold"
        cont.appendChild(x)
    }

    function dist(item,x) {
        item.style.marginTop = x + "px"
    }

    function setPickerTop(viewElement) {
        document.getElementById("PAC-boilers-pickerLeftTop").style.display = viewElement.hasAttribute("halfview") ? "block" : "none"
        // document.getElementById("PAC-boilers-rejectOptions").style.display = viewElement.hasAttribute("halfview") ? "none" : "block"
        document.getElementById("PAC-boilers-orphans").style.display = viewElement.hasAttribute("noOrphan") ? "none" : "block"
        document.getElementById("PAC-boilers-priors-misc").style.display = viewElement.hasAttribute("noBan") ? "none" : "block"
    }

    function addTab(container, name, view, active, action, hidden) {
        var classView = "PAC-boilers-view";
        var classActive = "PAC-boilers-active";
        var classTab = "PAC-boilers-tab";

        var link = document.createElement("a");
        link.className = classTab;
        link.href = "javascript:void(0)";
        var text = document.createTextNode(name);
        link.appendChild(text)

        if (!hidden) {
            container.appendChild(link);
            br(container)
        }

        var viewElement = document.getElementById(view);
        viewElement.className = classView;

        link.onclick = function(e) {
            var views = document.getElementsByClassName(classView);
            for (var i = 0; i < views.length; ++i)
            {views[i].className = classView};

            var tabs = document.getElementsByClassName(classTab);
            for (i = 0; i < tabs.length; ++i)
            {tabs[i].className = classTab};

            viewElement.className += " " + classActive;
            link.className += " " + classActive;

            // check if it is a full or a half-size tab...
            setPickerTop(viewElement)

            GM.setValue("bTabActive",name);
            document.getElementById("PAC-boilers-title").textContent = name;
            titleSourceWindow(name);

            if (action !== undefined && action !== null)
            {action()};
        };

        if (active === name) {
            viewElement.className += " " + classActive;
            link.className += " " + classActive;
            document.getElementById("PAC-boilers-title").textContent = name;
        }
    }

    function makeActionLink(text, action) {
        var link = document.createElement("a");
        link.href = "javascript:void(0)";
        link.className = "PAC-boilers-action";
        link.onclick = action;
        link.appendChild(document.createTextNode(text));
        return link;
    }

    function ddVal(identifier) {
        return document.querySelector('#PAC-boilers-dd-' + identifier).value
    }

    async function addDropdown(container, identifier, caption, values, initial) {
        // values must be an array
        // ex. var values = ["dog", "cat", "parrot", "rabbit"];

        let select = document.createElement("select");
        select.name = "PAC-boilers-dd-" + identifier;
        select.id = "PAC-boilers-dd-" + identifier;
        select.className = "PAC-boilers-dropdown"

        for (const val of values)
        {
            let option = document.createElement("option");
            option.value = val;
            option.text = val;
            select.appendChild(option);
        }

        container.appendChild(document.createTextNode(caption + " "));
        container.appendChild(select);

        if (initial) select.value = initial

        return select;
    }

    function addButton(container,identifier,label) {
        let newButton = document.createElement("input");
        newButton.id = "PAC-boilers-button-" + identifier;
        newButton.className = "PAC-boilers-button"
        newButton.type = "button";
        newButton.value = label;
        container.appendChild(newButton);

        return newButton;
    }

    function cbVal(identifier) {
        if (document.querySelector('#PAC-boilers-cb-' + identifier) === null) return false // return null if error checking
        return document.querySelector('#PAC-boilers-cb-' + identifier).checked
    }

    function cbClick(identifier) {
        document.querySelector('#PAC-boilers-cb-' + identifier).click()
    }

    function groupCheckBoxes(cbs) {
        cbs.forEach(cb => {

            cb.onclick = async function () {
                await GM.setValue(cb.id.split("PAC-boilers-cb-")[1], cb.checked)

                if (cb.checked) {
                    cbs.forEach(c => {
                        if (cb != c && c.checked) {c.click()}
                    })
                }
            }

        })
    }

    function indentCB(cb) {
        cb.parentNode.classList.add('PAC-boilers-indent')
    }

    function primaryCheckBox(mainCB, subordinates, group, extraFunction) {
        let popGroup = []
        if (group) {
            popGroup = group.slice(0)
            if (popGroup.indexOf(mainCB) > -1) {
                popGroup.splice(popGroup.indexOf(mainCB), 1)
            }
        }

        mainCB.onclick = async function() {
            await GM.setValue(mainCB.id.split("PAC-boilers-cb-")[1], mainCB.checked)
            if (!mainCB.checked) {
                subordinates.forEach(cb => {
                    if (cb.checked) {cb.click()}
                })
            } else if (group) {
                popGroup.forEach(cb => {
                    if (cb.checked) {cb.click()}
                })
            }

            if (extraFunction) {extraFunction()}
        }

        subordinates.forEach(cb => {
            indentCB(cb)
            cb.onclick = async function() {
                await GM.setValue(cb.id.split("PAC-boilers-cb-")[1], cb.checked);
                if (cb.checked && !mainCB.checked) {mainCB.click()}
            }
        })
    }

    function setCBclick(pcb,offWhenOn,onWhenOn,offWhenOff,onWhenOff,extraFunction) {

        pcb.onclick = async function() {
            await GM.setValue(pcb.id.split("PAC-boilers-cb-")[1], pcb.checked)

            if (pcb.checked) {
                offWhenOn.forEach(cb => {
                    if (cb.checked) cb.click()
                })
                onWhenOn.forEach(cb => {
                    if (!cb.checked) cb.click()
                })
            } else {
                offWhenOff.forEach(cb => {
                    if (cb.checked) cb.click()
                })
                onWhenOff.forEach(cb => {
                    if (!cb.checked) cb.click()
                })
            }

            if (extraFunction) {extraFunction()}
        }
    }


    // Consider the differences between this and the adminInfo addCheckbox -- might want to update this one
    // ...or that one, if I can ever get the divs working properly over here
    async function addCheckbox(container, identifier, caption, persistent, hover) {
        var item = document.createElement("div");
        item.id = "PAC-boilers-cbCont-" + identifier;
        item.className = "PAC-boilers-cbCont"

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "PAC-boilers-cb-" + identifier;

        if (persistent) {
            checkbox.checked = await GM.getValue(identifier,false)
            checkbox.onclick = async function() {
                await GM.setValue(identifier, checkbox.checked);
            }
        }

        var label = document.createElement("label");
        label.appendChild(document.createTextNode(caption));
        label.id = "PAC-boilers-cbLabel-" + identifier;
        label.className = "PAC-boilers-cbLabel"

        label.setAttribute('for', "PAC-boilers-cb-" + identifier);
        if (hover) {label.setAttribute('title', hover)};

        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);

        return checkbox;
    }

    function tbVal(identifier) {
        return document.querySelector("#PAC-boilers-textbox-" + identifier).value
    }

    async function addSmallTextbox(container, identifier, initialValue, width) {
        var textbox = document.createElement("input");
        textbox.setAttribute("type","text");
        textbox.id = "PAC-boilers-textbox-" + identifier;
        textbox.className = "PAC-boilers-smalltextbox"
        container.appendChild(textbox);

        //  textbox.style.position = "static";
        if (width) textbox.style.width = width

        textbox.readOnly = false;
        textbox.value = initialValue;

        return textbox;
    }


    function rdVal(identifier) {
        return document.querySelector("#PAC-boilers-rdID-" + identifier).checked
    }

    // I need to add in here an option to set a persistant setting (if actioning a bunch of deleted works in a row, for example)
    // Should I make the positioning work like checkbox so that it returns the radioDial itself instead of item (which is a wrapper)?
    // Then I could set a default in the main work without both 'persistant' and 'initialvalue' in the function pass
    // Also figure out the positioning so I can do this without needing setPos constantly. See addCheckbox for how that worked
    async function addRadioDial(container, rdGroup, dialID, initialValue, label, hover, allowUncheck) {
        var item = document.createElement("div");
        item.id = "PAC-boilers-rdc-" + dialID;
        item.className = "PAC-boilers-radioContainer";

        var radioDial = document.createElement("input");
        radioDial.type = "radio";
        radioDial.id = "PAC-boilers-rdID-" + dialID;
        radioDial.name = "PAC-boilers-rd-" + rdGroup;
        radioDial.value = dialID;

        var radioLabel = document.createElement("label");
        radioLabel.appendChild(document.createTextNode(label));
        radioLabel.setAttribute('for',"PAC-boilers-rdID-" + dialID);
        radioLabel.className = "PAC-boilers-radio-label"
        if(hover) {radioLabel.setAttribute('title',hover)};

        item.appendChild(radioDial);
        item.appendChild(radioLabel);

        if (initialValue) {
            radioDial.checked = true; // set as true at initialization... hopefully won't cause issue?
            await GM.setValue("rd-" + rdGroup, dialID);
        } else if (allowUncheck) {
            await GM.setValue("rd-" + rdGroup, 'none');
        }

        if (allowUncheck) {
            radioDial.onclick = async function() {
                if (await GM.getValue("rd-" + rdGroup) == dialID) {
                    radioDial.checked = false
                    await GM.setValue("rd-" + rdGroup, 'none');
                } else {
                    await GM.setValue("rd-" + rdGroup, dialID);
                }
            };
        } else {
            radioDial.onclick = async function() {
                await GM.setValue("rd-" + rdGroup, dialID);
            };
        }

        container.appendChild(item);

        return radioDial;
    }

    async function priorDates(container,identifier,textDesc) {
        var item = document.createElement("div");
        item.className = "PAC-boilers-priors-subbox";
        container.appendChild(item);

        var priorDate = await addSmallTextbox(item,"priorDate-" + identifier,textDesc);

        var priorWarning = await addRadioDial(item,"priorDate-" + identifier,identifier + "-warning",false,"Warning","Select if user was previously warned on "+textDesc,true);
        var priorSuspension = await addRadioDial(item,"priorDate-" + identifier,identifier + "-suspension",false,"Suspension","Select if user was previously suspended on "+textDesc,true);

        var tabName = await GM.getValue("bTabActive")
        if (!tabName) {
            GM.setValue("bTabActive","Non-fanwork")
            tabName = "Non-fanwork"
        }

        var priorCategory = await addSmallTextbox (item, "priorDate-" + identifier + "category", gSectionTos(tabName))

        priorDate.onfocus = function() {
            if (!priorWarning.checked && !priorSuspension.checked) priorWarning.click()
        }
        priorCategory.onfocus = function() {
            if (!priorWarning.checked && !priorSuspension.checked) priorWarning.click()
        }

        document.querySelector("#PAC-boilers-tablist").addEventListener("click", function (e) {
            if (!priorWarning.checked && !priorSuspension.checked) priorCategory.value = gSectionTos(gTabActive())
        })

        return item;
    }

    function setPos(item, top, left, width) {
        item.style.position = "absolute";
        item.style.top = top + "px";
        item.style.left = left + "px";
        if(width) {item.style.width = width + "px"};
    }

    function optionTitle(text,paddingHeight) {
        var title = document.createElement("div")
        title.className = "PAC-boilers-optionTitle"
        title.appendChild(document.createTextNode(text))
        // title.style.padding = paddingHeight + " 15px"
        return title
    }

    async function makeReplies(replies) {
        logDebug("Make the reporter reply options")

        replies.appendChild(optionTitle("Reporter:","8px"))

        let formalReply = document.createElement("div")
        formalReply.className = "PAC-boilers-reply"
        replies.appendChild(formalReply)
        formalReply.style.width = "180px"
        //setPos(formalReply,5,100)

        let informalReply = document.createElement("div")
        informalReply.className = "PAC-boilers-reply"
        replies.appendChild(informalReply)
        informalReply.style.width = "180px"
        //setPos(informalReply,5,280)

        await addCheckbox(formalReply, "reply-formal", "Formal reply",true)
        await addCheckbox(informalReply, "reply-informal", "Informal reply",true)
    }

    async function makeOutcomes(outcomes) {
        logDebug("Make the outcomes options")

        // Decide whether it's a warning, suspension, or for how long
        let outcomeType = document.createElement("div");
        outcomeType.id = "PAC-boilers-outcomeType";
        outcomes.appendChild(outcomeType);

        outcomeType.appendChild(optionTitle("Penalty:","10px"))

        if (!await GM.getValue("rd-outcomeType")) {await GM.setValue("rd-outcomeType","warning")}

        let outcomeTypeNone = await addRadioDial(outcomeType,"outcomeType","none",(await GM.getValue("rd-outcomeType")=="none"),"None","No admin");
        let outcomeTypeNote = await addRadioDial(outcomeType,"outcomeType","note",(await GM.getValue("rd-outcomeType")=="note"),"Note",
                                                 "Note -- produces the same boiler as 'None' but adds a line at the top to seconders, letting them know you intend to note the account");
        let outcomeTypeWarning = await addRadioDial(outcomeType,"outcomeType","warning",(await GM.getValue("rd-outcomeType")=="warning"),"Warning","Warn user");
        let outcomeTypeSuspension = await addRadioDial(outcomeType,"outcomeType","suspension",(await GM.getValue("rd-outcomeType")=="suspension"),"Suspend for","Suspend user");

        outcomeTypeNone.parentElement.style.width = '90px'
        outcomeTypeNote.parentElement.style.width = '90px'
        outcomeTypeWarning.parentElement.style.width = '103px'
        outcomeTypeSuspension.parentElement.style.width = '112px'

        // create a text box to enter the number of days that they're suspended for in
        let outcomeDays = await addSmallTextbox(outcomeType,"suspendedFor",await GM.getValue("daysSuspend",30),"30px");

        let outcomeDaysLabel = document.createElement("label");
        outcomeDaysLabel.appendChild(document.createTextNode("days"));
        outcomeDaysLabel.setAttribute('for',"PAC-boilers-textbox-suspendedFor");
        outcomeDaysLabel.setAttribute('title',"Days they will be suspended");
        outcomeDaysLabel.style.paddingLeft = "4px";
        outcomeType.appendChild(outcomeDaysLabel);

        outcomeDays.onfocus = async function() {
            await GM.setValue("rd-outcomeType", "suspension");
            document.getElementById("PAC-boilers-rdID-suspension").checked = true;
        };

        // Decide what paragraph to add in to the boiler
        let priorType = document.createElement("div")
        priorType.id = "PAC-boilers-priorType"
        outcomes.appendChild(priorType)

        let priorTitle = optionTitle("User Priors:","7px")
        priorType.appendChild(priorTitle)

        let priorDates1 = await priorDates(priorType,"DATE1","Prior 1 Date")
        let priorDates2 = await priorDates(priorType,"DATE2","Prior 2 Date")
        let priorDates3 = await priorDates(priorType,"DATE3","Prior 3 Date")

        // A couple more priors-related options:
        let priorMisc = document.createElement("div")
        priorMisc.id = "PAC-boilers-priors-misc"
        priorType.appendChild(priorMisc)

        let priorsWillBan = await addCheckbox(priorMisc,"priorWillBan","User is likely to be banned on next offense",
                                              false, "'Further violations may result in a ban' rather than 'suspension or ban'");
        GM.setValue("priorWillBan",false)
    }

    async function makeOrphans(orphans) {
        logDebug("Make the options to allow specifying if orphaned.")

        let title = optionTitle("Orphaned:","8px")
        orphans.appendChild(title)

        let orphanOne = document.createElement("div");
        orphanOne.className = "PAC-boilers-orphans-subbox";
        orphans.appendChild(orphanOne);

        let orphanMulti = document.createElement("div");
        orphanMulti.className = "PAC-boilers-orphans-subbox";
        orphans.appendChild(orphanMulti);

        let bOrphanedOne = await addCheckbox(orphanOne, "orphan-one", "User orphaned 1 work",false,
                                             "User orphaned one violating work referred to in this letter");
        let bOrphanedMulti = await addCheckbox(orphanMulti, "orphan-multi", "User orphaned multiple works",false,
                                               "User orphaned several violating works referred to in this letter");
        groupCheckBoxes([bOrphanedOne,bOrphanedMulti])
    }


    function makeHeader(container, text) {
        let header = document.createElement("div")
        header.className = "PAC-boilers-header"
        header.appendChild(document.createTextNode(text))
        container.appendChild(header)
        return header
    }

    function makeStandardTab(container) {
        let optionsStd = document.createElement("div")
        optionsStd.className = "PAC-boilers-stdTabOptions"
        container.appendChild(optionsStd)
        return optionsStd
    }

    function makeStandardHalftabs(container) {
        let optionsStd = document.createElement("div")
        optionsStd.className = "PAC-boilers-stdTabOptions"
        container.appendChild(optionsStd)

        let optionsLeft = document.createElement("div")
        optionsLeft.className = "PAC-boilers-halfTab-left"
        optionsStd.appendChild(optionsLeft)

        let optionsRight = document.createElement("div")
        optionsRight.className = "PAC-boilers-halfTab-right"
        optionsStd.appendChild(optionsRight)

        return [optionsStd, optionsLeft, optionsRight]
    }

    async function makeNfwTab(viewport) {
        logDebug ("Make the tab with options for NFW violations")
        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-nfwTab"
        tabWrapper.setAttribute("halfview",true)
        viewport.appendChild(tabWrapper)

        let header = makeHeader(tabWrapper, "Standard NFW boiler options")
        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        let bPrompt = await addCheckbox(optionsLeft, "nfw-prompt", "NFW(s) include prompts",true,
                                        "Prompts, ideas for fanworks, and requests for inspiration should use a prompt meme");
        let bPlaceholder = await addCheckbox(optionsLeft, "nfw-placeholder", "NFW(s) include placeholder(s)",true,
                                             "Placeholders and notes about works they plan to create");
        let bBookmark = await addCheckbox(optionsLeft, "nfw-bookmark", "NFW(s) include bookmarks or reclists",true,
                                          "Bookmarks should be used instead for saving or sharing other fanworks");
        let bSpam = await addCheckbox(optionsLeft, "nfw-spam", "NFW(s) include repeat word/phrase spam",true,
                                      "A word or phrase repeated hundreds or thousands of times");
        let bTestpost = await addCheckbox(optionsLeft, "nfw-testpost", "NFW(s) are test posts",true,
                                          "They can post test posts temporarily in the Testing fandom, but not regular fandom tags");

        br(optionsLeft)

        let bAllEdit = await addCheckbox(optionsRight, "nfw-allEdit", "Allow edits to all", true,
                                         "Allow the user to edit all NFWs, even if they're usually must-deletes")
        let bAllDelete = await addCheckbox(optionsRight, "nfw-allDelete", "Deny edits to all", true,
                                           "Require the user to delete all NFWs, even if they're usually may-edits")


        let header2 = makeHeader(tabWrapper, "Broken links and embeds (no penalties apply)")
        let nfwOptions2 = makeStandardTab(tabWrapper)

        let bEmpty = await addCheckbox(nfwOptions2, "nfw-empty", "Work has ",true);
        bEmpty.parentElement.style.width = "100px";
        bEmpty.parentElement.style.margin = "0px";
        bEmpty.parentElement.style.top = "2px";
        bEmpty.parentElement.style.display = "inline";
        let bLinkEmbed = await addDropdown(nfwOptions2, "nfw-linkembed", "", ['linked','embedded']);
        bLinkEmbed.style.margin = "1px 0px 3px 20px";
        bLinkEmbed.style.width = "90px";
        let bBrokenLock = await addDropdown(nfwOptions2, "nfw-brokenlock", " content that is ", ['broken','locked']);
        bBrokenLock.style.margin = "1px 0px";
        bBrokenLock.style.width = "70px";
        let bFilterMembers = await addDropdown(nfwOptions2, "nfw-filtermembers", "; if locked, lock is due to ", ['content filter','membership requirement']);
        bFilterMembers.style.marginLeft = "24px";
        bFilterMembers.style.width = "180px";

        let primaryGroup = [bPrompt,bPlaceholder,bBookmark,bSpam,bTestpost]

        function setToNote() {
            if(bEmpty.checked) document.getElementById("PAC-boilers-rdID-note").click()
        }

        if (await GM.getValue('c-nfw1Droster',false)) {

            br(optionsRight)

            var b1Dnfw = await addCheckbox(optionsRight, "nfw-1Dnfw", "Use a 1D letter",true,
                                           "Available if you are actively on the 1D NFW roster, for:\n"+
                                           "- Warning, fic search or rp ad\n"+
                                           "- Warning, clear placeholder\n"+
                                           "- Warning, clear prompts request\n"+
                                           "- 30 or 90 suspension, single-work repeat phrase spam");

            function noMultitype1D() {
                if (b1Dnfw.checked) {
                    if (1*bPrompt.checked + 1*bPlaceholder.checked + 1*bSpam.checked > 1) {
                        for (const cb of [bPrompt,bPlaceholder,bSpam]) {
                            if (cb.checked) cb.click()
                        }
                    }
                }
            }

            b1Dnfw.onclick = async function() {
                await GM.setValue("nfw-1Dnfw", b1Dnfw.checked);
                if (b1Dnfw.checked) {
                    for (const cb of [bBookmark,bTestpost,bAllEdit,bAllDelete,bEmpty]) {
                        if (cb.checked) cb.click()
                    }
                }
                noMultitype1D()
            }

            for (const cb of [bBookmark,bTestpost,bEmpty]) {
                primaryCheckBox(cb,[],[bEmpty,b1Dnfw])
            }
            for (const cb of [bPrompt,bPlaceholder,bSpam]) {
                primaryCheckBox(cb,[],[bEmpty],noMultitype1D)
            }
            primaryCheckBox(bEmpty,[],[bPrompt,bPlaceholder,bBookmark,bSpam,bTestpost,bAllEdit,bAllDelete,b1Dnfw],setToNote)
            primaryCheckBox(bAllEdit,[],[bAllDelete,bEmpty,b1Dnfw])
            primaryCheckBox(bAllDelete,[],[bAllEdit,bEmpty,b1Dnfw])

        } else {
            primaryGroup.forEach(cb => primaryCheckBox(cb,[],[bEmpty]))
            primaryCheckBox(bEmpty,[],[bPrompt,bPlaceholder,bBookmark,bSpam,bTestpost,bAllEdit,bAllDelete,b1Dnfw],setToNote)
            primaryCheckBox(bAllEdit,[],[bAllDelete,bEmpty])
            primaryCheckBox(bAllDelete,[],[bAllEdit,bEmpty])
        }

        for (const dd of [bLinkEmbed,bBrokenLock,bFilterMembers]) {
            dd.onclick = function() {
                if (!bEmpty.checked) bEmpty.click()
            }
        }
    }

    async function makeCommpromTab(viewport) {
        logDebug ("Make the tab with options for commprom violations")
        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-commpromTab"
        tabWrapper.setAttribute("halfview",true)
        viewport.appendChild(tabWrapper)

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        let headerEditable = makeHeader(optionsLeft, "Editable comprom")

        let bWork = await addCheckbox(optionsLeft, "comp-work", "Comprom is in work(s)",true)
        let bTag = await addCheckbox(optionsLeft, "comp-tag", "Comprom is in tag(s)",true)

        primaryCheckBox(bWork, [bTag])

        let bProfile = await addCheckbox(optionsLeft, "comp-profile", "Comprom is in profile",true)
        let bPseuds = await addCheckbox(optionsLeft, "comp-pseuds", "Comprom is on pseuds page",true)
        let bSeries = await addCheckbox(optionsLeft, "comp-series", "Comprom is in (a) series",true)
        let bComment = await addCheckbox(optionsLeft, "comp-comment", "Comprom is in comment(s)",true)
        br(optionsLeft)
        let bExtension = await addCheckbox(optionsLeft, "comp-extension", "Offer extension",true,
                                           'Extensions should generally be offered upfront if there is a lot of comprom to remove,\n'+
                                           'e.g. if there are more than 10 works to edit or if the comprom is scattered throughout the body of long works.')

        let headerDelete = makeHeader(optionsRight, "Must-delete comprom")

        let bNFW = await addCheckbox(optionsRight, "comp-NFW", "Non-fanwork(s)",true)
        let bPreview = await addCheckbox(optionsRight, "comp-preview", "Previews/teasers",true)

        br(optionsRight)
        boldText("Must-delete works list:", optionsRight)

        let deleteList = document.createElement("textarea")
        deleteList.id = "PAC-boilers-comp-deletelist"
        optionsRight.appendChild(deleteList)

        let buttonArea = document.createElement("div")
        buttonArea.className = "PAC-boilers-buttonArea"
        optionsRight.appendChild(buttonArea)

        let saveButton = addButton(buttonArea,"save-" + name,"Save");
        saveButton.style.width = "50px"
        saveButton.onclick = async function() {
            await GM.setValue("saved-text-comprom-dellist", deleteList.value);
        }

        let loadButton = addButton(buttonArea,"load-" + name,"Load");
        loadButton.style.width = "50px"
        loadButton.onclick = async function() {
            deleteList.value = await GM.getValue("saved-text-comprom-dellist");
        };

        let clearButton = addButton(buttonArea,"clear-" + name,"Clear");
        clearButton.style.width = "50px"
        clearButton.onclick = function() {
            deleteList.value = ''
        };

    }

    async function makeCrightBoilerTab(viewport) {
        logDebug ("Make the tab with options for copyright violations")
        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-crightTab"
        tabWrapper.setAttribute("halfview",true)
        viewport.appendChild(tabWrapper)

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        // Create the groups of checkboxes and options
        let bEdit = await addCheckbox(optionsLeft, "cright-edit", "User may edit to reduce quotes",true,
                                      "User may edit (there's just too many quotes)");
        let bEditSong = await addCheckbox(optionsLeft, "cright-edit-song", "from song lyrics",true,
                                          "User has too many lyrics");
        let bEditNovel = await addCheckbox(optionsLeft, "cright-edit-novel", "from novel",true,
                                           "User has too many quotes from novel");
        let bEditMovie = await addCheckbox(optionsLeft, "cright-edit-movie", "from TV or movie",true,
                                           "User has too many quotes from TV show or movie");

        let bDelete = await addCheckbox(optionsLeft, "cright-delete", "Standard must-delete infringement",true,
                                        "Work is entirely copyright infringement")
        dist(bDelete.parentElement,8)
        let bDeletePlag = await addCheckbox(optionsLeft, "cright-delete-plag", "Minor edits aren't sufficient",true,
                                            "Additionally, Section II.E states: 'Simply finding and replacing names, substituting synonyms,"+
                                            "or rearranging a few words is not enough to make the work original to you.'")
        let bDeleteNFW = await addCheckbox(optionsLeft, "cright-delete-NFW", "It's also a NFW",true,
                                           "This work is also not a fanwork, which is a violation of Section II.B of our Terms of Service. "+
                                           "Works that are not fanworks may not be uploaded to AO3.")

        let bUTrans = await addCheckbox(optionsLeft, "cright-utrans", "Unauthorized translation",true,
                                        "Translator does not have permission to post")
        dist(bUTrans.parentElement,8)
        let bUTransPlag = await addCheckbox(optionsLeft, "cright-utrans-plag", "Not their own translation",true,
                                            "In addition, plagiarism is a violation of Section II.E [...] You may not post someone else's work, "+
                                            "whether a translation or in the original language, under your own name.")

        let bPiracy = await addCheckbox(optionsLeft, "cright-piracy", "External piracy link(s)",true,
                                        "Work contains link(s) to unauthorized reproductions of copyrighted material")
        dist(bPiracy.parentElement,8)
        let bPiracyPlaylist = await addCheckbox(optionsLeft, "cright-piracy-playlist", "Playlist",true,
                                                "User is linking to songs for a playlist")

        let bArt = await addCheckbox(optionsRight, "cright-art", "Too-minor art/photo adjustments",true,
                                     "User has embedded traced art or other art that is copied from someone else's art or photo "+
                                     "without undergoing sufficient transformation to be their own work")

        let bPDR = await addCheckbox(optionsRight, "cright-PDR", "Public domain repost",true,
                                     "Not a copyright violation, but it is a NFW")
        dist(bPDR.parentElement,8)
        let bPDRnameswap = await addCheckbox(optionsRight, "cright-PDR-nameswap", "Nameswap or other minor edits",true,
                                             "Minor non-transformative edits, such as nameswaps, are not sufficient to make it a fanwork")

        let bCite = await addCheckbox(optionsRight, "cright-cite", "User can add citation for their ",true,
                                      "For cases where CC or blanket permission requirements aren't met")
        dist(bCite.parentElement,8)

        let bCiteType = await addDropdown(optionsRight, "cright-cite-type", "", ['repost','adaptation','translation','podfic'])
        bCiteType.style.margin = "1px 0px 3px 20px"
        bCiteType.style.width = "70px"
        optionsRight.appendChild(document.createTextNode(" per:"))
        let bCiteNameBox = await addCheckbox(optionsRight,"cright-cite-name","",true)
        let bCiteName = await addSmallTextbox(labelOf('cright-cite-name'), "cright-cite-name", "LICENSE_NAME","200px")
        let bCitePerm = await addCheckbox(optionsRight,"cright-cite-perm","blanket permission statement",true)
        let bCiteSA = await addCheckbox(optionsRight, "cright-cite-SA", "License requires ShareAlike",true,
                                        "To meet license terms, user must license their own work under the same license")
        dist(bCiteSA.parentElement,8)
        let lisenseInstruction = document.createElement('div')
        lisenseInstruction.style.margin = "8px 0px 0px 20px"
        lisenseInstruction.appendChild(document.createTextNode("User can learn more at: "))
        optionsRight.appendChild(lisenseInstruction)
        var bCiteLink = await addSmallTextbox(optionsRight, "cright-cite-link", "https://creativecommons.org/licenses/#licenses","232px")
        bCiteLink.style.margin = "2px 0px 5px 20px"

        bCiteType.onclick = function() {
            if (!bCite.checked) {bCite.click()}
        }
        bCiteName.onfocus = function() {
            if (!bCiteNameBox.checked) {bCiteNameBox.click()}
        }
        lisenseInstruction.onclick = function() {
            if (!bCite.checked) {bCite.click()}
        }
        bCiteLink.onfocus = function() {
            if (!bCite.checked) {bCite.click()}
        }

        if (devMode) {
            let bDMCA = await addCheckbox(optionsRight,"cright-dmca","Work has been DMCA'd",true)
            dist(bDMCA.parentElement,12)
        }

        function defaultPermType() {
            if (bCite.checked && !bCiteNameBox.checked && !bCitePerm.checked) bCiteNameBox.click()
        }

        // Adjust the onclicks to prevent conflicts. Each of the main has a subgroup
        let mainCRgroup = [bEdit, bDelete, bUTrans, bArt, bPiracy, bPDR, bCite]

        primaryCheckBox(bEdit, [bEditSong, bEditNovel, bEditMovie], mainCRgroup)
        primaryCheckBox(bDelete, [bDeletePlag,bDeleteNFW], mainCRgroup)
        primaryCheckBox(bUTrans, [bUTransPlag], mainCRgroup)
        primaryCheckBox(bArt, [], mainCRgroup)
        primaryCheckBox(bPiracy, [bPiracyPlaylist], mainCRgroup)
        primaryCheckBox(bPDR, [bPDRnameswap], mainCRgroup)
        primaryCheckBox(bCite, [bCitePerm,bCiteNameBox,bCiteSA], mainCRgroup, defaultPermType)

        bCiteNameBox.onclick = async function() {
            await GM.setValue("cright-cite-name", bCiteNameBox.checked)
            if (bCiteNameBox.checked) {
                if (!bCite.checked) bCite.click()
                if (bCitePerm.checked) bCitePerm.click()
            } else {
                if (bCite.checked && !bCitePerm.checked) bCitePerm.click()
            }
        }
        bCitePerm.onclick = async function() {
            await GM.setValue("cright-cite-perm", bCitePerm.checked)
            if (bCitePerm.checked) {
                if (!bCite.checked) bCite.click()
                if (bCiteSA.checked) bCiteSA.click()
                if (bCiteNameBox.checked) bCiteNameBox.click()
            } else {
                if (bCite.checked && !bCiteNameBox.checked) bCiteNameBox.click()
            }
        }
        bCiteSA.onclick = async function() {
            await GM.setValue("cright-cite-SA", bCiteSA.checked)
            if (bCiteSA.checked) {
                if (!bCite.checked) bCite.click()
                if (bCitePerm.checked) bCitePerm.click()
            }
        }
    }

    async function makePlagBoilerTab(viewport) {
        logDebug ("Make the tab with options for plagiarism violations");
        let tabWrapper = document.createElement("div");
        tabWrapper.id = "PAC-boilers-plagTab";
        tabWrapper.setAttribute("halfview",true);
        viewport.appendChild(tabWrapper);

        let stdOptions = makeStandardTab(tabWrapper)

        let bDelete = await addCheckbox(stdOptions, "plag-delete", "User must delete work(s), cannot edit",true,
                                        "If unchecked, they're allowed to edit. Use this option for cases where if they edited, "+
                                        "there'd be no work; or repeat offenses etc");
        let bCite = await addCheckbox(stdOptions, "plag-cite", "User may add a citation",true,
                                      "Borderline cases (5-10%, <500 words)");
        let bInspired = await addCheckbox(stdOptions, "plag-cite-inspired", "User may use the Inspired by function to cite",true,
                                          "Recommended for items that are online");

        groupCheckBoxes([bDelete,bCite])
        primaryCheckBox(bCite, [bInspired], [bDelete])
    }

    async function makeRatwarBoilerTab(viewport) {
        logDebug ("Make the tab with options for Ratings & Warnings violations")
        var tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-ratwarTab"
        tabWrapper.setAttribute("halfview",true)
        tabWrapper.setAttribute("noOrphan",true)
        tabWrapper.setAttribute("noBan",true)
        viewport.appendChild(tabWrapper)

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        let subLeft = document.createElement("div")
        subLeft.className = "PAC-boilers-subTab-left"
        optionsLeft.appendChild(subLeft)
        let subRight = document.createElement("div")
        subRight.className = "PAC-boilers-subTab-right"
        optionsLeft.appendChild(subRight)

        let bRat = await addCheckbox(subLeft, "ratwar-rating", "Rating",true,"Complaint about Rating")
        let bMCD = await addCheckbox(subRight, "ratwar-MCD", "MCD",true,"Major Character Death")
        let bUA = await addCheckbox(subRight, "ratwar-UA", "UAS",true,"Underage Sex")
        let bRNC = await addCheckbox(subRight, "ratwar-RNC", "RNC",true,"Rape/Non-Con")
        let bGDOV = await addCheckbox(subRight, "ratwar-GDOV", "GDOV",true,"Graphic Depictions of Violence")

        let bAddTags = await addCheckbox(optionsRight, "ratwar-additional", "User used Additional tags",true)
        let offended = await addCheckbox(optionsRight,"ratwar-offended","Upheld, but Reporter is Offended",true,
                                         "Reporter is offended but there is still a problem")
        let offendedRPF = await addCheckbox(optionsRight,"ratwar-offended-RPF","RPF",true,
                                            "The work is RPF or the ticket mentions RPF")
        indentCB(offendedRPF)

        let headerReject = makeHeader(tabWrapper, "Rejection Options")

        const graduatedCat = await GM.getValue('c-graduatedCat',false)
        if (graduatedCat) {
            var flag1D = document.createElement("div")
            flag1D.id = "PAC-boilers-ratwar-flag1D"
            flag1D.classList.add("PAC-boilers-flag1D")
            flag1D.innerText = "Not 1D"
            headerReject.appendChild(flag1D)
        }

        let [rejectionsDetails, rejectionsLeft, rejectionsRight] = makeStandardHalftabs(tabWrapper)

        let insufficient = await addCheckbox(rejectionsLeft,"ratwarNo-insufficient","Insufficient info",true,
                                             "Insufficient information -- the work is 20k long and they don't say where it is, what it is, etc")

        br(rejectionsLeft)
        boldText("Rating rejections",rejectionsLeft)
        let ratIsG = await addCheckbox(rejectionsLeft,"ratNo-ratIsG","Work is rated G",true,
                                       "Click this for the optionals to head off complaints that it might need T. Auto-applies if the current page is a G-rated work.")
        let ratReject = await addCheckbox(rejectionsLeft,"ratNo-ratReject","Work doesn't need higher rating",true,
                                          "We found what they complained about and it doesn't need M/E/NR")
        let notYetRat = await addCheckbox(rejectionsLeft,"ratNo-ratNotYet","...Yet (despite tags/etc)",true,
                                          "Tags/summary indicate it will be M/E/NR, but it isn't yet")
        indentCB(notYetRat)
        let GvsT = await addCheckbox(rejectionsLeft,"ratNo-GvsT","Complaint is about G/T divide",true,
                                     "PAC does not rule on G vs T complaints")
        let GvsTnoAdult = await addCheckbox(rejectionsLeft,"ratNo-GvsTnoAdult","This G work does not need M",true,
                                            "If it appears that reporter might argue for M")
        indentCB(GvsTnoAdult)
        let MisHigh = await addCheckbox(rejectionsLeft,"ratNo-MisHigh","Work is rated M",true,
                                        "PAC makes no distinctions between M, E, NR")
        let NRisHigh = await addCheckbox(rejectionsLeft,"ratNo-NRisHigh","Work is rated NR",true,
                                         "PAC makes no distinctions between M, E, NR")
        let lowerRat = await addCheckbox(rejectionsLeft,"ratNo-lowerRat","We don't lower ratings",true,
                                         "For complaints about there being no explicit content in an M/E work")


        let rejectMulti = await addCheckbox(rejectionsRight,"ratwarNo-multi","Reject multiple works",true,
                                            "Will fire automatically if multiple titles are entered in the 'List works/bookmarks/series' box")
        br(rejectionsRight)
        boldText("Warning rejections",rejectionsRight)
        let warReject = await addCheckbox(rejectionsRight,"warNo-warReject","Work doesn't need the warning(s)",true,
                                          "We found what they complained about and it doesn't need to be warned for")
        let warUAunclear = await addCheckbox(rejectionsRight,"warNo-warUAunclear","Underage (age is unclear)",true,
                                             "If the characters' ages in the fanwork are ambiguous, then we will assume the characters have been 'aged up', even if they are underage in canon")
        indentCB(warUAunclear)
        let warUAdating = await addCheckbox(rejectionsRight,"warNo-warUAdating","Underage (no sexual activity)",true,
                                            "Underage sexual activity does not include dating activity such as kissing")
        indentCB(warUAdating)
        let ratwarIndicator = await addCheckbox(rejectionsRight,"warNo-indicator","Report says warning needed due to presence of:",true,
                                                "The presence of [blood/incest/necrophilia/suicidal thoughts/sexual tags/the word 'teenager'/etc] "+
                                                "does not necessarily mean that the work requires a warning.")
        indentCB(ratwarIndicator)
        let indicatorText = await addSmallTextbox(rejectionsRight, "warNo-indicator-text", "blood, the word 'teen', etc","270px");
        indicatorText.style.width = "200px";
        indicatorText.style.margin = "2px 0px 3px 48px";
        indicatorText.onfocus = function () {
            if (!ratwarIndicator.checked) {ratwarIndicator.click()}
        }

        let CNTW = await addCheckbox(rejectionsRight,"warNo-CNTW","Work is CNTW",true,
                                     "CNTW is the blanket warning")
        let NAWA = await addCheckbox(rejectionsRight,"warNo-NAWA","NAWA + other warnings is okay",true,
                                     "NAWA may be present with other warnings; it doesn't mean anything");
        let removeWar = await addCheckbox(rejectionsRight,"warNo-removeWar","We do not remove warnings",true,
                                          "For complaints of 'This is MCD but there is no MCD in the story' etc");

        let rejectionCBs = [insufficient, rejectMulti, ratIsG, ratReject, notYetRat, GvsT, MisHigh, NRisHigh, lowerRat,
                            warReject, CNTW, NAWA, removeWar]
        rejectionCBs.forEach(cb => {
            cb.classList.add("PAC-boilers-ratwar-rejectCB")
        })

        function set1Dflag() {

            if (graduatedCat) {
                function testFlag() {
                    let no1D = offended.checked || ratReject.checked || notYetRat.checked || GvsT.checked || warReject.checked || bAddTags.checked
                    if (no1D) return false
                    if (bRat.checked) {
                        if (gCountWarningTypes()) return false
                        if (1*insufficient.checked + 1*MisHigh.checked + 1*NRisHigh.checked + lowerRat.checked !== 1) return false
                        if (CNTW.checked || NAWA.checked || removeWar.checked) return false
                    } else {
                        if (1*insufficient.checked + 1*CNTW.checked + 1*NAWA.checked + 1*removeWar.checked !== 1) return false
                        if (insufficient.checked && !gCountWarningTypes()) return false
                    }
                    return true
                }

                if (testFlag()) {
                    if (!flag1D.classList.contains("PAC-boilers-flag1D-1D")) flag1D.classList.add("PAC-boilers-flag1D-1D")
                    flag1D.innerText = "\* 1D \*"
                } else {
                    if (flag1D.classList.contains("PAC-boilers-flag1D-1D")) flag1D.classList.remove("PAC-boilers-flag1D-1D")
                    flag1D.innerText = "Not 1D"
                }
            }
        }

        // function setCBclick(pcb,offWhenOn,onWhenOn,offWhenOff,onWhenOff,extraFunction)
        setCBclick(bRat,[],[],[ratIsG,ratReject,GvsT,MisHigh,NRisHigh,lowerRat],[],set1Dflag)
        setCBclick(bMCD,[],[],[],[],set1Dflag)
        setCBclick(bUA,[],[],[],[],set1Dflag)
        setCBclick(bRNC,[],[],[],[],set1Dflag)
        setCBclick(bGDOV,[],[],[],[],set1Dflag)

        setCBclick(bAddTags, rejectionCBs,[],[],[],set1Dflag)
        setCBclick(offended, rejectionCBs,[],[offendedRPF],[],set1Dflag)
        setCBclick(offendedRPF,[],[offended],[],[])

        setCBclick(insufficient, rejectionCBs.toSpliced(0, 2, bAddTags, offended), [], [], [], set1Dflag)
        // toSpliced (temporarily) removes insufficient & rejectMulti, adds the other two

        let ratRejectionCBs = [insufficient, MisHigh, NRisHigh, lowerRat, bAddTags, offended]
        let ratRejectionCBs1D = [insufficient, ratReject, ratIsG, GvsT, bAddTags, offended]

        setCBclick(ratIsG,[MisHigh,NRisHigh,lowerRat,bAddTags,offended],[bRat],[],[],set1Dflag)
        setCBclick(ratReject, ratRejectionCBs.toSpliced(1, 0, GvsT), [bRat], [notYetRat], [], set1Dflag)
        setCBclick(notYetRat,[],[ratReject],[],[])
        setCBclick(GvsT, ratRejectionCBs.toSpliced(1, 0, ratReject), [bRat], [GvsTnoAdult], [], set1Dflag)
        setCBclick(GvsTnoAdult,[],[GvsT],[],[])
        setCBclick(MisHigh, ratRejectionCBs1D, [bRat], [], [], set1Dflag)
        setCBclick(NRisHigh, ratRejectionCBs1D, [bRat], [], [], set1Dflag)
        setCBclick(lowerRat, ratRejectionCBs1D, [bRat], [], [], set1Dflag)

        let warRejectionCBs = [insufficient, warReject, bAddTags, offended]

        setCBclick(warReject,[insufficient,CNTW,NAWA,removeWar,bAddTags,offended],[],[warUAunclear,warUAdating,ratwarIndicator],[],set1Dflag)
        setCBclick(warUAunclear, [], [warReject], [], [], set1Dflag)
        setCBclick(warUAdating, [], [warReject], [], [], set1Dflag)
        setCBclick(ratwarIndicator, [], [warReject], [], [], set1Dflag)
        setCBclick(CNTW, warRejectionCBs, [], [], [], set1Dflag)
        setCBclick(NAWA, warRejectionCBs, [], [], [], set1Dflag)
        setCBclick(removeWar, warRejectionCBs, [], [], [], set1Dflag)

        set1Dflag()

        let instructionalNote = document.createElement("div")
        instructionalNote.id = "PAC-boilers-rwInstructions"
        instructionalNote.className = darkmode
        tabWrapper.appendChild(instructionalNote)
        instructionalNote.appendChild(document.createTextNode("Rating/warnings penalties start at noting, prior to warning."))
    }

    async function makeFandomBoilerTab(viewport) {
        logDebug ("Make the tab with options for Fandom Tags violations")

        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-fandomTab"
        tabWrapper.setAttribute("halfview",true)
        tabWrapper.setAttribute("noOrphan",true)
        tabWrapper.setAttribute("noBan",true)
        viewport.appendChild(tabWrapper);

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        let bRPF = await addCheckbox(optionsLeft, "ft-rpf", "RPF/FPF",true,"User's confused RPF and FPF tags")
        let bActorName = await addCheckbox(optionsLeft, "ft-actorname", "Actor name fandom tag",true,"Actor name (an RPF tag) on an FPF work")

        let bTagwall = await addCheckbox(optionsLeft, "ft-tagwall", "Tagwall",true,"User has more than 75 freeform tags")
        dist(bTagwall.parentElement,8)

        let bOneshot = await addCheckbox(optionsRight, "ft-oneshot", "Oneshot collection",true,"Work is a oneshot collection tagged with many different fandoms")
        let bPrompts = await addCheckbox(optionsRight, "ft-oneshot-prompt", "Willing to write",true,"User tagged the fandoms they are willing to write when given a prompt")
        let bNFW = await addCheckbox(optionsRight, "ft-nfw", "Formerly NFW",true,"Work used to be a NFW; user has since added FW content")

        primaryCheckBox(bRPF,[bActorName])
        primaryCheckBox(bOneshot,[bPrompts,bNFW])

        let buttonArea = document.createElement("div");
        buttonArea.className = "PAC-boilers-buttonAreaBottom";
        tabWrapper.appendChild(buttonArea)

        let addNew = addButton(buttonArea,"addNewFTGroup","Add new group")
        addNew.onclick = function() {
            const gr = {'links': '"TITLE", located at https://archiveofourown.org/works/',
                        'tags': 'INCORRECT_TAG1\nINCORRECT_TAG2\netc',
                        'suggestions': '(Optional)'}
            addftGroupDiv(gr)
        }

        var deleteAll = addButton(buttonArea,"deleteAllFTGroup","Delete all groups")
        deleteAll.onclick = function() {
            groupHolder.querySelectorAll('.PAC-boilers-fandom-group').forEach(g => {
                g.remove()
            })
            ftGroupNum = 0
            ftInstructionsVisible(true)
        }

        var saveGroups = addButton(buttonArea,"deleteAllFTGroup","Save group list")
        saveGroups.onclick = async function() {
            let ftGroupList = []
            groupHolder.querySelectorAll('.PAC-boilers-fandom-group').forEach(g => {
                const tempGroup = {'links': g.querySelector('.PAC-boilers-fandom-group-links').value,
                                   'tags': g.querySelector('.PAC-boilers-fandom-group-tags').value,
                                   'suggestions': g.querySelector('.PAC-boilers-fandom-group-suggestions').value}
                ftGroupList.push(tempGroup)
            })
            await GM.setValue('fandomTagGroupList',ftGroupList)
        }

        var loadGroups = addButton(buttonArea,"deleteAllFTGroup","Load saved list")
        loadGroups.onclick = async function() {
            deleteAll.click()
            let ftGroupList = await GM.getValue('fandomTagGroupList',[])
            for (let i = 0; i < ftGroupList.length; i++) {
                addftGroupDiv(ftGroupList[i])
            }
            ftGroupNum = ftGroupList.length
        }

        let groupHolder = document.createElement("div");
        groupHolder.className = 'PAC-boilers-fandom-groupHolder'
        tabWrapper.appendChild(groupHolder)

        let ftcolumns = document.createElement('div')
        ftcolumns.id = "PAC-boilers-ftcolumns"
        groupHolder.appendChild(ftcolumns)

        let linksCol = document.createElement('div')
        linksCol.className = "PAC-boilers-fandom-group-links"
        ftcolumns.appendChild(linksCol)
        linksCol.innerText = "Work(s) affected"

        let tagsCol = document.createElement('div')
        tagsCol.className = "PAC-boilers-fandom-group-tags"
        ftcolumns.appendChild(tagsCol)
        tagsCol.innerText = "Incorrect tag(s)"

        let suggestionsCol = document.createElement('div')
        suggestionsCol.className = "PAC-boilers-fandom-group-suggestions"
        ftcolumns.appendChild(suggestionsCol)
        suggestionsCol.innerText = "Suggested tag(s)"

        let ftInstructions = document.createElement("div")
        ftInstructions.id = "PAC-boilers-ftInstructions"
        groupHolder.appendChild(ftInstructions)

        ftInstructions.innerHTML += `<p><strong>Instructions:</strong></p>`+
            `<ul><li>Use a 'group' to list all of the user's works that have the same type of incorrect fandom tag(s) in a block in the user letter.</li>`+
            `<li>If they have works that have different incorrect fandom tag(s), click 'Add new group' to add another group.</li>`+
            `<li>You can edit any group just by typing in the boxes.</li>`+
            `<li>To delete a group, click the 'X' button on that group.</li>`+
            `<li>When you've created multiple groups, you can rearrange the order they'll be listed in the letter using the ↑ and ↓ buttons.</li>`+
            `<li>If you want to save your group arrangement and come back to this boiler later, use the 'Save group list' button to save it, `+
            `and the 'Load saved list' button to reload it when you come back again.</li></ul>`

        const newGroup = {'links': document.querySelector("#PAC-boilers-text-multiWindow").value,
                          'tags': 'INCORRECT_TAG1\nINCORRECT_TAG2\netc',
                          'suggestions': '(Optional)'}

        addftGroupDiv(newGroup)
    }

    function ftInstructionsVisible(showHide) {
        document.querySelector("#PAC-boilers-ftInstructions").style.display = showHide ? "block" : "none"
        document.querySelector('#PAC-boilers-ftcolumns').style.display = showHide ? "none" : "block"
    }

    function addftGroupDiv(ftGroup) {
        let parentElement = document.querySelector("#PAC-boilers-fandomTab .PAC-boilers-fandom-groupHolder")
        ftInstructionsVisible(false)

        let holder = document.createElement('div')
        parentElement.appendChild(holder)
        holder.className = 'PAC-boilers-fandom-group'
        holder.setAttribute('groupNum', ftGroupNum++)

        let links = document.createElement('textarea')
        holder.appendChild(links)
        links.className = 'PAC-boilers-fandom-group-subbox PAC-boilers-fandom-group-links'
        //links.contentEditable = true
        links.value = ftGroup.links

        let tags = document.createElement('textarea')
        holder.appendChild(tags)
        tags.className = 'PAC-boilers-fandom-group-subbox PAC-boilers-fandom-group-tags'
        //tags.contentEditable = true
        tags.value = ftGroup.tags

        let suggestions = document.createElement('textarea')
        holder.appendChild(suggestions)
        suggestions.className = 'PAC-boilers-fandom-group-subbox PAC-boilers-fandom-group-suggestions'
        //suggestions.contentEditable = true
        suggestions.value = ftGroup.suggestions

        let buttonDiv = document.createElement('div')
        holder.appendChild(buttonDiv)
        buttonDiv.className = 'PAC-boilers-fandom-group-buttons'

        let upButton = addButton(buttonDiv,'ft-' + ftGroup + '-moveUp','↑')
        upButton.style.width = "25px"
        let downButton = addButton(buttonDiv,'ft-' + ftGroup + '-moveDown','↓')
        downButton.style.width = "25px"
        let deleteButton = addButton(buttonDiv,'ft-' + ftGroup + '-delete','X')
        deleteButton.style.width = "25px"

        function swapGroups(num) {
            const tempGroup = {'links': links.value,
                               'tags': tags.value,
                               'suggestions': suggestions.value}

            let nextGroupDiv = parentElement.querySelector('[groupNum="' + num + '"]'),
                nextLinks = nextGroupDiv.querySelector(".PAC-boilers-fandom-group-links"),
                nextTags = nextGroupDiv.querySelector(".PAC-boilers-fandom-group-tags"),
                nextSuggestions = nextGroupDiv.querySelector(".PAC-boilers-fandom-group-suggestions")

            links.value = nextLinks.value
            tags.value = nextTags.value
            suggestions.value = nextSuggestions.value

            nextLinks.value = tempGroup.links
            nextTags.value = tempGroup.tags
            nextSuggestions.value = tempGroup.suggestions
        }

        upButton.onclick = function() {
            let num = 1*holder.getAttribute('groupNum')
            if (num < 1) return;
            swapGroups(num - 1)
        }
        downButton.onclick = function() {
            let num = 1*holder.getAttribute('groupNum')
            if (num > (ftGroupNum - 2)) return;
            swapGroups(num + 1)
        }

        deleteButton.onclick = function() {
            holder.remove()
            ftGroupNum--

            let groupDivs = parentElement.querySelectorAll(".PAC-boilers-fandom-group")
            if (groupDivs.length) {
                for (let i = 0; i < groupDivs.length; i++) {
                    groupDivs[i].setAttribute('groupNum', i)
                }
            } else {
                ftInstructionsVisible(true)
            }
        }
    }


    function labelOf(cbName) {
        return document.querySelector('#PAC-boilers-cbLabel-' + cbName)
    }

    async function makeHarassWorkBoilerTab(viewport) {
        logDebug ("Make the tab with options for harassment occuring in works");
        let tabWrapper = document.createElement("div");
        tabWrapper.id = "PAC-boilers-harassworkTab";
        tabWrapper.setAttribute("halfview",true);
        viewport.appendChild(tabWrapper);

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        let bDelete = await addCheckbox(optionsLeft, "hw-delete", "User must delete work",true,
                                        "If unchecked, they may edit it into compliance")
        let bNfw = await addCheckbox(optionsLeft, "hw-nfw", "Work is also a NFW",true,
                                     "Dedicated call-out posts, harassing shit-posts, harassing rick-rolls, etcetc")
        primaryCheckBox(bDelete,[bNfw])

        let bCright = await addCheckbox(optionsLeft, "hw-cright", "Work also violates cright",true,
                                        "E.g. a rickroll with a death threat at the end")

        br(optionsLeft)
        boldText("Location (generic if unchecked)", optionsLeft)
        let bTag = await addCheckbox(optionsLeft, "hw-tag", "Tag(s)",true)
        let bNote = await addCheckbox(optionsLeft, "hw-note", "Notes",true,
                                      "Front notes, end notes, or chapter notes")
        let bSummary = await addCheckbox(optionsLeft, "hw-summary", "Summary",true)
        let bComment = await addCheckbox(optionsLeft, "hw-comment", "Comments (by creator)",true,
                                         "The creator is harassing other users in the comments; if it is self-harassment, "+
                                         "use that option on the 'Harassment (other)' tab instead")

        br(optionsLeft)
        let bSeries = await addCheckbox(optionsLeft, "hw-series", "Also hiding series",true,
                                        "If there is harassing content in the series or if it is a work tag and the work is in a series")
        let bProfile = await addCheckbox(optionsLeft, "hw-profile", "Also profile harassment",true,
                                         "In addition to work harassment, there is harassing content on the profile")
        let bUsername = await addCheckbox(optionsLeft, "hw-username", "Also harassing username",true,
                                          "Account also has a harassing username")

        boldText("Types & reasons (generic if unchecked)", optionsRight)
        let bSevere = await addCheckbox(optionsRight, "hw-severe", "Default severe",true,
                                        "Threatening or wishing death, violence, or bodily harm on other users")
        let bDoxxing = await addCheckbox(optionsRight, "hw-doxxing", "Doxxing",true,
                                         "Doxxing and threats of doxxing")
        let bSlurs = await addCheckbox(optionsRight, "hw-slurs", "Slurs",true,
                                       "Directing slurs or other bigoted rhetoric at other users")
        let bCallout = await addCheckbox(optionsRight, "hw-callout", "Call-out post",true,
                                         "'So-and-so is terrible because x, y, z!' works/notes")
        let bGift = await addCheckbox(optionsRight, "hw-gift", "Malicious gift",true,
                                      "Deliberately unwanted gift")
        let bGiftBE = await addCheckbox(optionsRight, "hw-gift-BE", "Block evasion",true,
                                        "Gifted work was used to evade a block")
        primaryCheckBox(bGift,[bGiftBE])

        br(optionsRight)
        let bOffended = await addCheckbox(optionsRight, "hw-offended", "Harasser is Offended",true,
                                          "Harasser is an Offended User who doesn't like what their targets ship or enjoy in fiction")
        let bCCForbids = await addCheckbox(optionsRight, "hw-ccforbids", "Canon creator forbids",true,
                                           "Canon creator dislikes these types of works")
        let bCCForbidsRPF = await addCheckbox(optionsRight, "hw-ccforbids-RPF", "RPF",true,
                                              "RPF subjects don't like (certain types of) RPF of them")
        primaryCheckBox(bCCForbids,[bCCForbidsRPF])
        let bCounter = await addCheckbox(optionsRight, "hw-counter", "Counter-harassment",true,
                                         "User is harassing in response to other harassment (still not acceptable)")


        // Not including full doxxing or celebrity doxxing on this tab
        }

    async function makeHarassOtherBoilerTab(viewport) {
        logDebug ("Make the tab with options for harassment occuring someplace other than a work")
        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-harassotherTab"
        tabWrapper.setAttribute("halfview",true)
        tabWrapper.setAttribute("noOrphan",true)
        viewport.appendChild(tabWrapper)

        let header = makeHeader(tabWrapper, "Non-Work Harassment")
        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        boldText ("Comment harassment", optionsLeft)
        let bCommentsOwn = await addCheckbox(optionsLeft,"ho-comment-own","Comments (all under same account)",true,
                                             "All comments were left from the same registered account, not sock or anon")
        let bCommentsAnon = await addCheckbox(optionsLeft,"ho-comment-anon","Anon comments (not block-evasion)",true,
                                              "User has a registered account but is commenting anon (not block evasion)")
        let bCommentsBE = await addCheckbox(optionsLeft,"ho-comment-BE","Block evasion comment",true,
                                            "Block evasion via anon or a sock")
        bCommentsBE.style.marginBottom = '10px'
        groupCheckBoxes([bCommentsOwn,bCommentsAnon,bCommentsBE])

        //br(optionsLeft)
        let bCommentsMulti = await addCheckbox(optionsLeft,"ho-comment-multi","Multiple works by 1 user",true,
                                               "Harasser is targetting one creator over multiple works")
        let bCommentsMultiTar = await addCheckbox(optionsLeft,"ho-comment-multitar","Works by multiple users in:",true,
                                                  "Harasser is targetting multiple people across multiple works")
        groupCheckBoxes([bCommentsMulti,bCommentsMultiTar])

        let bMultiTarSeveral = await addCheckbox(optionsLeft,"ho-multitar-several","several fandoms",true,
                                                 "Harasser is targetting works in multiple fandoms")
        let bMultiTarFandom = await addCheckbox(optionsLeft,"ho-multitar-fandom","",true)
        let bMultiTarFandomName = await addSmallTextbox(labelOf('ho-multitar-fandom'), "ho-multitar-fandom", "SPECIFIC_FANDOM","200px");

        function defaultMultitarSeveral() {
            if (bCommentsMultiTar.checked && !bMultiTarFandom.checked && !bMultiTarSeveral.checked) bMultiTarSeveral.click()
        }

        primaryCheckBox(bCommentsMultiTar, [bMultiTarSeveral, bMultiTarFandom], [bCommentsMulti], defaultMultitarSeveral)
        bMultiTarFandomName.onfocus = function() {
            if (!bMultiTarFandom.checked) bMultiTarFandom.click()
        }

        bMultiTarFandom.onclick = function() {
            if (bMultiTarFandom.checked) {
                if (!bCommentsMultiTar.checked) bCommentsMultiTar.click()
                if (bMultiTarSeveral.checked) bMultiTarSeveral.click()
            } else {
                if (bCommentsMultiTar.checked && !bMultiTarSeveral.checked) bMultiTarSeveral.click()
            }
        }
        bMultiTarSeveral.onclick = function() {
            if (bMultiTarSeveral.checked) {
                if (!bCommentsMultiTar.checked) bCommentsMultiTar.click()
                if (bMultiTarFandom.checked) bMultiTarFandom.click()
            } else {
                if (bCommentsMultiTar.checked && !bMultiTarFandom.checked) bMultiTarFandom.click()
            }
        }


        br(optionsLeft)
        boldText ("Other harassment locations", optionsLeft)
        let bBookmark = await addCheckbox(optionsLeft, "ho-bookmark", "Bookmarks",true,
                                          "Harassment in bookmarks")
        let bBookmarkDelete = await addCheckbox(optionsLeft, "ho-bookmark-delete", "User must delete bookmarks",true,
                                          "For when editing would not be sufficient to render bookmark(s) non-harassing")

        primaryCheckBox(bBookmark,[bBookmarkDelete])
        let bProfile = await addCheckbox(optionsLeft, "ho-profile", "Profile",true,
                                         "Profile harassment and other non-work harassment; if harassment is also in a work, go use the 'Harassment (work)' boiler")
        let bUsername = await addCheckbox(optionsLeft, "ho-username", "Username",true,
                                          "Username harassment and other non-work harassment; if harassment is also in a work, go use the 'Harassment (work)' boiler")


        boldText ("Types & reasons (generic if unchecked)", optionsRight)
        let bSevere = await addCheckbox(optionsRight, "ho-severe", "Default severe",true,
                                        "Threatening or wishing death, violence, or bodily harm on other users")
        let bDoxxing = await addCheckbox(optionsRight, "ho-doxxing", "Doxxing",true,
                                         "Doxxing and threats of doxxing")
        let bSlurs = await addCheckbox(optionsRight, "ho-slurs", "Slurs",true,
                                       "Directing slurs or other bigoted rhetoric at other users")
        let bCallout = await addCheckbox(optionsRight, "ho-callout", "Call-out post",true,
                                         "'So-and-so person is terrible because x, y, z!' in bookmark, profile, etc")
        let bBullyout = await addCheckbox(optionsRight, "ho-bullyout", "Bullying to remove/delete",true,
                                          "Trying to bully someone into removing their fanworks or leaving AO3")
        let bSelf = await addCheckbox(optionsRight, "ho-self", "Self-harassment",true,
                                      "User is harassing themselves with a sock or anon comments")

        br(optionsRight)

        let bOffended = await addCheckbox(optionsRight, "ho-offended", "Harasser is Offended",true,
                                          "User is harassing because they find content offensive (tell them how to mute)")
        let bCCForbids = await addCheckbox(optionsRight, "ho-ccforbids", "Canon creator forbids",true,
                                           "Canon creator dislikes these types of works")
        let bCCForbidsRPF = await addCheckbox(optionsRight, "ho-ccforbids-RPF", "RPF",true,
                                              "RPF subjects don't like (certain types of) RPF of them")
        primaryCheckBox(bCCForbids,[bCCForbidsRPF])
        let bCounter = await addCheckbox(optionsRight, "ho-counter", "Counter-harassment",true,
                                         "User is harassing in response to other harassment (still not acceptable)")

        }

    async function makeIconBoilerTab(viewport) {
        logDebug ("Make the tab with options for icon  violations")
        let tabWrapper = document.createElement("div")
        tabWrapper.id = "PAC-boilers-iconTab"
        tabWrapper.setAttribute("halfview",true)
        tabWrapper.setAttribute("noOrphan",true)
        viewport.appendChild(tabWrapper)

        let [optionsStd, optionsLeft, optionsRight] = makeStandardHalftabs(tabWrapper)

        boldText("Icon location", optionsLeft)
        let mainIcon = await addCheckbox(optionsLeft, "i-mainIcon", "User's main icon",true)
        dist(mainIcon.parentElement,8)
        let pseud = await addCheckbox(optionsLeft, "i-pseud", "",true,
                                      "If two pseuds, list as: Pseud1 and Pseud2\n"+
                                      "If three pseuds, list as: Pseud1, Pseud2, and Pseud3\n"+
                                      "(etc)")
        let pseudBox = await addSmallTextbox(labelOf('i-pseud'), "i-pseud", "PSEUD","200px")

        groupCheckBoxes([mainIcon,pseud])
        pseudBox.onfocus = function() {
            if (!pseud.checked) pseud.click()
        }

        boldText("Type of icon violation", optionsRight)
        let sexy = await addCheckbox(optionsRight, "i-sexy", "Genital nudity or explicit sex",true)
        dist(sexy.parentElement,8)
        let epilepsy = await addCheckbox(optionsRight, "i-epilepsy", "Epilepsy trigger",true)
        // should include an instructional note here ala Ratwar about when to use II.H instead?
        let hateSymbol = await addCheckbox(optionsRight, "i-hateSymbol", "Hate symbol",true,
                                           "Use only if you don't think the user knows what the symbol is.\n"+
                                           "If they do know, use a boiler from the Harassment (Other) tab instead")
        }

    async function makeMiscBoilerTab(viewport) {
        logDebug ("Make the tab with options for miscellaneous items");
        let tabWrapper = document.createElement("div");
        tabWrapper.id = "PAC-boilers-miscTab";
        viewport.appendChild(tabWrapper);

        let headerRuok = makeHeader(tabWrapper, "At-risk user / RUOK")

        let optionsRuok = makeStandardTab(tabWrapper)

        let RUOKnfw = await addCheckbox(optionsRuok, "misc-ruoknfw", "Non-fanwork RUOK: must delete work",true,
                                        "")
        let RUOKfw = await addCheckbox(optionsRuok, "misc-ruokfw", "Fanwork: RUOK content is in:",true,
                                       "")
        let rfwTags = await addCheckbox(optionsRuok, "misc-ruokfw-tags", "Tags",true,
                                        "")
        let rfwNotes = await addCheckbox(optionsRuok, "misc-ruokfw-notes", "Work notes",true,
                                         "")
        let rfwSummary = await addCheckbox(optionsRuok, "misc-ruokfw-summary", "Summary",true,
                                           "")
        let rfwChapters = await addCheckbox(optionsRuok, "misc-ruokfw-chapters", "Chapter(s) ",true,
                                            "")
        let rfwChaptersNum = await addSmallTextbox(labelOf('misc-ruokfw-chapters'), "misc-ruokfw-chapters", "1, 2, and 3","80px");
        rfwChaptersNum.onclick = function() {
            if (!rfwChapters.checked) rfwChapters.click()
        }

        let miscPrimary = [RUOKnfw, RUOKfw]

        primaryCheckBox(RUOKnfw, [], miscPrimary)
        primaryCheckBox(RUOKfw, [rfwTags, rfwNotes, rfwSummary, rfwChapters], miscPrimary)
    }
    // Illegal content? Age violations?

    function makeP(container) {
        let p = document.createElement('p')
        container.appendChild(p)
        return p
    }

    async function makeConfigWindow() {
        logDebug("Building a window to create persistent settings ...")

        let configWindow = document.createElement("div")
        configWindow.id = "PAC-boilers-configWindow"
        configWindow.className = "PAC-boilers-window" + darkmode

        let header = makeHeader(configWindow, "Boiler generator configuration options")

        let optionsArea = makeStandardTab(configWindow)

        let p = makeP(optionsArea)
        br(p)
        p.appendChild(document.createTextNode("Refresh the window after saving to make all changes take effect."));

        p = makeP(optionsArea)
        br(p)
        boldText("About you:",p)

        p = makeP(optionsArea)
        let catName = await addSmallTextbox(p,"catName",await GM.getValue("catName","Your Name"));
        p.appendChild(document.createTextNode("Your PAC sign-off"));

        p = makeP(optionsArea)
        // Graduated cats: show 1D flag on Ratwar
        let graduatedCat = await addCheckbox(p,"c-graduatedCat",
                                             "I have fully graduated from training and am no longer on probation", true)
        //1DNFW roster: show 1D option on NFW
        let nfw1Droster = await addCheckbox(p,"c-nfw1Droster",
                                            `I am actively on the NFW 1D roster`, true)

        p = makeP(optionsArea)
        br(p)
        boldText("Generator preferences:",p)

        p = makeP(optionsArea)
        let daysSuspend = await addSmallTextbox(p,"daysSuspend",await GM.getValue("daysSuspend",30));
        p.appendChild(document.createTextNode("Default days to suspend"));

        p = makeP(optionsArea)
        let autoSelectText = await addCheckbox(p,"c-autoSelectText",
                                               "When generating boilers, automatically select all (highlight) the generated text.", true)

        p = makeP(optionsArea)
        let colorMode = await addDropdown(p,"darkmode",'',['Auto', 'Lightmode', 'Darkmode'], await GM.getValue("darkmode", "Lightmode"))
        colorMode.style.width = '126px'
        p.appendChild(document.createTextNode("Colour scheme"))

        p = makeP(optionsArea)
        let mainHeight = await addSmallTextbox(p,"mainHeight",await GM.getValue("mainHeight","600px"));
        p.appendChild(document.createTextNode("Height of main window"));

        p = makeP(optionsArea)
        p.appendChild(document.createTextNode("Position of the open button ('Boilers') on page: "))
        br(p)
        let menuTop = await addSmallTextbox(p,"menuTop",await GM.getValue("menuTop","80px"))
        let menuTopPolarity = await addDropdown(p,"menuTopPolarity",'',['top', 'bottom'], await GM.getValue("menuTopPolarity", "top"))

        br(p)
        let menuLeft = await addSmallTextbox(p,"menuLeft",await GM.getValue("menuLeft","10px"));
        let menuLeftPolarity = await addDropdown(p,"menuLeftPolarity",'',['left', 'right'], await GM.getValue("menuLeftPolarity", "left"))


        /* Things I should include in the config settings:

- font size for the text boxes
*/


        let buttonArea = document.createElement("div");
        buttonArea.className = "PAC-boilers-buttonAreaBottom";
        configWindow.appendChild(buttonArea)

        let closeButton = addButton(buttonArea,"closeConfig","Close");
        closeButton.onclick = toggleConfigWindow;
        let saveButton = addButton(buttonArea,"saveConfig","Save");
        saveButton.onclick = configSaveSettings;
        let saveAndCloseButton = addButton(buttonArea,"saveAndCloseConfig","Save & Close");
        saveAndCloseButton.onclick = function() {
            configSaveSettings();
            toggleConfigWindow();
        }
        saveAndCloseButton.style.width = "120px";

        document.body.appendChild(configWindow);

        makeMovable(configWindow, [catName, daysSuspend, mainHeight, menuTop, menuTopPolarity, menuLeft, menuLeftPolarity, colorMode])
    }

    async function configSaveSettings() {
        // Save configuration settings
        logDebug("Saving config settings ... ");
        await GM.setValue("catName",tbVal("catName"));
        await GM.setValue("daysSuspend",tbVal("daysSuspend"));
        await GM.setValue("mainHeight",tbVal("mainHeight"));
        await GM.setValue("menuTop",tbVal("menuTop"));
        await GM.setValue("menuLeft",tbVal("menuLeft"));
        await GM.setValue("menuTopPolarity",ddVal("menuTopPolarity"));
        await GM.setValue("menuLeftPolarity",ddVal("menuLeftPolarity"));
        await GM.setValue("darkmode",ddVal("darkmode"));

        document.querySelector("#PAC-boilers-textbox-suspendedFor").value = tbVal("daysSuspend")
    }

    function toggleBoilerWindow() {
        let boilerWindow = document.getElementById("PAC-boilers-boilerWindow");
        let boilerText = document.getElementById("PAC-boilers-boilertext");
        if (boilerWindow === null) return;

        if (boilerWindow.style.display == "block") {
            boilerWindow.style.display = "none";
        } else {
            boilerWindow.style.display = "block";
            if(document.getElementById("PAC-boilers-cb-c-autoSelectText").checked) {
                boilerText.select();
                boilerText.focus();
            }
        }
    }

    function toggleConfigWindow() {
        let configWindow = document.getElementById("PAC-boilers-configWindow");

        if (configWindow === null) return;

        if (configWindow.style.display == "block") {
            configWindow.style.display = "none";
        } else {
            configWindow.style.display = "block";
        }
    }

    function makePromiseRequest(method, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.responseType = "document";
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    async function getBEtargetname() {

        let page = document,
            tar = '',
            parts = window.location.pathname.split('/')

        if (parts[1] == 'comments' || (parts[3] == 'comments' && !isNaN(parts[4])) ) {
            tar = document.querySelector('h3.heading a').href
        } else if ((parts[1] == 'works' || parts[1] == 'chapters') && parts.includes('comments')) {
            tar = document.querySelector('h2.heading a').href
        }
        if (tar) {
            tar = tar.split(window.location.host)[1]
            page = await makePromiseRequest("GET", tar);
        }
        return makeListFromArray(getUsers(page),"and")
    }

    function isWorkPage(parts) {
        // tests to check that it is a work or chapter page showing
        return ([parts[1],parts[3]].some(p => ['works','chapters'].includes(p)) &&
                parts[2] &&
                !parts.some(p => ['edit_tags','comments','users'].includes(p)))
    }

    function getUsers(page) {
        if (!page) page = document

        let parts = window.location.pathname.split('/')
        let users = []

        if (isWorkPage(parts) || page !== document) {
            if (page.querySelectorAll('h3.byline')[0].innerText.split(' [').length > 1) {
                users.push("an anonymous creator")
            } else {
                page.querySelectorAll('h3.byline')[0].querySelectorAll('a[rel="author"]').forEach(u => {
                    let user = u.href.split("users/")[1].split("/pseuds")[0]
                    if (!users.includes(user)) users.push(user)
                })
            }
        } else if (parts[1] == 'series') {
            if (page.querySelector('.series a[rel="author"]')) {
                document.querySelectorAll('.series a[rel="author"]').forEach(u => {
                    let user = u.href.split("users/")[1].split("/pseuds")[0]
                    if (!users.includes(user)) users.push(user)
                })
            } else {
                users.push("an anonymous creator")
            }
        } else if (parts[1] == 'bookmarks') {
            if (page.querySelector('.bookmark .byline a')) {
                let user = page.querySelector('.bookmark .byline a').href.split("users/")[1].split("/pseuds")[0]
                if (!users.includes(user)) users.push(user)
            }
        } else if (parts[1] == 'users' && (!parts[4] || isNaN(parts[4]))) {
            users.push(parts[2])
        } else if ([parts[1],parts[3],parts[5]].includes('comments')) {
            let c = page.querySelector('li.comment')
            if (c.querySelectorAll('h4.heading a').length > 1) {
                users.push(c.querySelector('h4.heading a').href.split('users/')[1].split('/pseuds')[0])
            } else {
                users.push("an anonymous commenter")
            }
        }

        if (users.includes("orphan_account")) {
            users[users.indexOf("orphan_account")] = "the orphan account"
        }
        return users;
    }

    function subdomain() {
        if (window.location.host == 'test.archiveofourown.org') return 'test.';
        return ''
    }

    function getWorkInfo(outputType) {
        logDebug("Grab the primary work info: title, link, username");

        let names = makeListFromArray(getUsers(), "and")

        let title = "",
            workID = "",
            workAnon = "";

        let parts = window.location.pathname.split('/');
        if (isWorkPage(parts)) {
            workAnon = document.querySelector('.byline').textContent.trim().startsWith('Anonymous [')
            title = document.querySelector('h2.title.heading').textContent.trim()
            workID = document.querySelector("li.reindex a").href.split('/')[4] // should work even on hidden works
        } else if (parts[1] == 'users' && (!parts[4] || isNaN(parts[4]))) {
            // ...I don't think there's anything to do in this case
        } else if (parts[1] == 'comments') {
            title = document.querySelector('h3.heading').textContent.split('Comment on ')[1].trim()
            workID = document.querySelector('h3.heading a').href.split('works/')[1]
        } else if ([parts[3],parts[5]].includes('comments')) {
            if (document.querySelector('h2.heading')) {
                title = document.querySelector('h2.heading').textContent.split('Comments on ')[1].trim()
                workID = document.querySelector('h2.heading a').href.split('/')[4]
            } else if (document.querySelector('h3.heading')) { // Comment thread
                title = document.querySelector('h3.heading').textContent.split('Comment on ')[1].trim()
                workID = document.querySelector('h3.heading a').href.split('/')[4]
            }
        }

        let workLink = "https://" + subdomain() + "archiveofourown.org/works/" + workID + " ";
        if (parts[1] == 'bookmarks') {
            workLink = "https://" + subdomain() + "archiveofourown.org/bookmarks/" + parts[2]
        }

        switch(outputType) {
            case "title":
                return '"' + title + '"';
            case "title at location":
                return '"' + title + '", ' + (names == "the orphan account"? 'formerly ' : '') + 'located at ' + workLink;
            case "title by name":
                if (names == "the orphan account") {
                    return 'the orphaned work "' + title + '"'
                } else {
                    return '"' + title + '" by ' + names;
                }
            case "name":
                return names;
            case "location":
                return workLink;
            case "title at location by name":
                if (names == "the orphan account") {
                    return 'the orphaned work "' + title + '", formerly located at ' + workLink;
                } else {
                    return '"' + title + '" by ' + names + ', located at ' + workLink;
                }
            default:
                return "That's not a valid work information request format";
        }
    }

    function makeMovable(moveObj, stopObj) {
        let movement = new ui.Movable(
            document.getElementById(moveObj.id)
        )
        movement.enable()

        function moveOn() {
            movement.enable()
        }

        function moveOff() {
            movement.disable()
        }

        if (stopObj) {
            for (const i of stopObj) {
                i.addEventListener('mouseover', moveOff);
                i.addEventListener('mouseout', moveOn);
            }
        }
    }

    function makeSideWindow(name, title, margin) {
        logDebug("Pop up a small window off to the side to contain links");
        let sidewindow = document.createElement("div");
        sidewindow.id = "PAC-boilers-" + name;
        sidewindow.className = "PAC-boilers-sideWindow" + darkmode
        document.body.appendChild(sidewindow);

        let header = document.createElement("div")
        header.className = "PAC-boilers-header"
        header.id = "PAC-boilers-header-" + name
        header.appendChild(document.createTextNode(title))
        sidewindow.appendChild(header)

        let textArea = document.createElement("textarea")
        textArea.id = "PAC-boilers-text-" + name
        textArea.className = "PAC-boilers-sidewindowText"
        textArea.readOnly = false
        sidewindow.appendChild(textArea)

        let buttonArea = document.createElement("div")
        buttonArea.className = "PAC-boilers-buttonAreaBottom"
        sidewindow.appendChild(buttonArea)

        let saveButton = addButton(buttonArea,"save-" + name,"Save");
        saveButton.style.width = "50px"
        saveButton.onclick = async function() {
            await GM.setValue("saved-text-" + name, textArea.value);
        }

        let loadButton = addButton(buttonArea,"load-" + name,"Load");
        loadButton.style.width = "50px"
        loadButton.onclick = async function() {
            textArea.value = await GM.getValue("saved-text-" + name);
        }

        let clearButton = addButton(buttonArea,"clear-" + name,"Clear");
        clearButton.style.width = "50px"
        clearButton.onclick = function() {
            textArea.value = ''
            if (name == "multiWindow" && cbVal("comp-work")) document.querySelector('#PAC-boilers-cb-comp-work').click()
        };

        let hideButton = addButton(buttonArea,"hide-" + name,"Hide other windows");
        hideButton.style.width = "155px"
        hideButton.onclick = function() {
            document.querySelector('#PAC-boilers-Boilers a').click()
            if (hideButton.value === "Hide other windows") {
                hideButton.value = "Show other windows"
                sidewindow.style.display = "block";
            } else {
                hideButton.value = "Hide other windows"
            }
        }

        makeMovable(sidewindow, [textArea])

        let hover = ''
        if (name == "multiWindow") {
            hover = "You don't need to list profile links here; if left out, they will be automatically generated as needed.\n"+
                "If you list multiple works here (one work per line), the boiler grammar will adjust automatically.\n"+
                "If you list works as 'formerly located at', the boiler will account for deleted works."
        } else if (name == "sourceWindow") {
            hover = "Generally, it's a good idea to quote from profiles, pseuds pages, and editable works or bookmarks.\n"+
                "Non-editable content usually doesn't need quotes."
        }

        header.setAttribute('title', hover)
        textArea.classList.add("PAC-boilers-sidewindowText-worklist")

        buttonArea.style.height = '55px'

        if (name == "multiWindow") {
            buttonArea.insertBefore(hideButton, clearButton)
            let markAllDeleted = addButton(buttonArea,"markDeleted-" + name,"Mark deleted");
            markAllDeleted.style.width = "105px"
            markAllDeleted.onclick = function() {
                textArea.value = textArea.value.replaceAll('", located at https://','", formerly located at https://')
            };

            let removeAllDeleted = addButton(buttonArea,"markDeleted-" + name,"Mark extant");
            removeAllDeleted.style.width = "105px"
            removeAllDeleted.onclick = function() {
                textArea.value = textArea.value.replaceAll('", formerly located at https://','", located at https://')
            };
        }
    }

    function makeBoilerWindow() {
        logDebug("Building a window that will contain a boiler ...");

        // Create the overall window.
        var boilerWindow = document.createElement("div");
        boilerWindow.id = "PAC-boilers-boilerWindow";
        boilerWindow.className = "PAC-boilers-window" + darkmode
        document.body.appendChild(boilerWindow)

        var buttonArea = document.createElement("div");
        buttonArea.className = "PAC-boilers-buttonAreaBottom";
        boilerWindow.appendChild(buttonArea)

        var boilerCloseButton = addButton(buttonArea,"closeBoiler","Close");
        boilerCloseButton.onclick = toggleBoilerWindow;
        var boilerRefreshButton = addButton(buttonArea,"refreshBoiler","Refresh");
        boilerRefreshButton.onclick = updateBoilerText;
        var boilerSaveButton = addButton(buttonArea,"saveBoiler","Save");
        boilerSaveButton.onclick = saveBoiler;
        var boilerLoadButton = addButton(buttonArea,"loadBoiler","Load last save");
        boilerLoadButton.style.width = "120px";
        boilerLoadButton.onclick = loadBoiler;
        var boilerHideButton = addButton(buttonArea,"hideBoiler","Hide window");
        boilerHideButton.style.width = "110px";
        boilerHideButton.onclick = function() {
            togglePicker("Main only");
        };

        document.body.appendChild(boilerWindow);

        var boilerContainerHeader = document.createElement("div");
        boilerContainerHeader.id = "PAC-boilers-boilerWindow-header";
        boilerContainerHeader.className = "PAC-boilers-header";
        boilerContainerHeader.appendChild(document.createTextNode("Specific boiler title"));
        boilerWindow.appendChild(boilerContainerHeader);

        var boilerText = document.createElement("textarea");
        boilerText.id = "PAC-boilers-boilertext";
        boilerText.className = "PAC-boilers-boilertext"
        boilerWindow.appendChild(boilerText);

        makeMovable(boilerWindow, [boilerText])
    }

    async function saveBoiler() {
        logDebug ("Save the boiler text (storage = 1) ...");
        const boilerText = document.getElementById("PAC-boilers-boilertext");
        await GM.setValue("saved-boilerText",boilerText.value);
    }

    async function loadBoiler() {
        logDebug ("Load the boiler text (storage = 1) ...");
        let getText = await GM.getValue("saved-boilerText");
        if (getText == null) {return null;}

        let boilerText = document.getElementById("PAC-boilers-boilertext");
        boilerText.value = getText;
    }

    // This is being called by setPos and I am really unsure why...
    async function updateBoilerText() {
        let boilerText = document.getElementById("PAC-boilers-boilertext"),
            openTab = document.querySelector('.PAC-boilers-tab.PAC-boilers-active').innerText,
            str = "",
            proceed = true

        // Update the global grammar variables
        setUpGrammar()

        // Add note at the top if it's a 1D NFW
        if (gTabActive() === "Non-fanwork" && cbVal("nfw-1Dnfw")) {
            str = "1D NFW "
            if (cbVal("nfw-prompt")) {str += "request for prompts"}
            else if (cbVal("nfw-placeholder")) {str += "placeholder"}
            else if (cbVal("nfw-spam")) {str += "repeat word/phrase spam"}
            else {str += "rp ad/fic search/keysmash"}
            if (sEd === "ed") {
                str += ", " + (cbVal('orphan-one') ? "orphaned" : "deleted")
            }
            str += "\n\n"
        }

        // so at some point I need to do something to make it work for multiple violation types but this'll do for now
        switch (openTab) {
            case "Non-fanwork":
            case "Commercial Promotion":
            case "Plagiarism":
            case "Copyright Infringement":
            case "Harassment (work)":
            case "Harassment (other)":
            case "Icon":
                await initUpheld(true)
                break;
            case "Fandom Tags":
                if (ftGroupNum) {
                    await initUpheld(true)
                } else {
                    alert('You must specify at least one work and tag that is incorrect. Use the "Add new group" button.')
                    proceed = false
                }
                break;
            case "Wrong rating/warning":
                var i = 0
                document.querySelectorAll('.PAC-boilers-ratwar-rejectCB').forEach(cb => {
                    cb.checked ? i++ : null
                })
                i ? initRejectRatwar() : await initUpheld(true)
                break;
            case "Misc":
                await initUpheld()
                str += assembleRUOK()
                break;
        }

        async function initUpheld(defaultType) {
            // If the PAC-adminInfo extension is running, grab the info off of that
            if(document.querySelectorAll("#PAC-adminInfo-infoTextArea a").length) {
                // this is a hacky work-around because for some reason when display == none the \n elements go wonky
                document.getElementById("PAC-adminInfo-infoWindow").style.display = "block"
                str += document.getElementById("PAC-adminInfo-infoTextArea").innerText.replaceAll('\n\n\n','\n\n').replaceAll('\n',' \n').replaceAll('\n \n','\n\n') + ' \n\n'
                document.getElementById("PAC-adminInfo-infoWindow").style.display = "none"
            }
            document.getElementById("PAC-boilers-boilerWindow-header").textContent = gSubject()
            if (defaultType) str += await assembleUpheldBoiler()
        }

        function initRejectRatwar() {
            let warNo = gCountWarningTypes()
            if (!warNo && cbVal("warNo-warReject")) {
                alert("You must specify the type of warning you are rejecting")
                proceed = false
                return
            }

            str += assembleRatWarRejection()
            let boilerTitle = "Rating / Warning rejection"
            if (document.querySelector('.PAC-boilers-flag1D-1D')) {
                boilerTitle = '1D: '
                if (cbVal('ratwarNo-insufficient')) {
                    boilerTitle += (cbVal('ratwar-rating')? "Rating" : "Warnings") + " complaint, insufficient info"
                } else if (cbVal('ratNo-MisHigh')) {
                    boilerTitle += "M is a high rating"
                } else if (cbVal('ratNo-NRisHigh')) {
                    boilerTitle += "NR is a high rating"
                } else if (cbVal('ratNo-lowerRat')) {
                    boilerTitle += "We don't lower a rating"
                } else if (cbVal('warNo-CNTW')) {
                    boilerTitle += "Work is already CNTW"
                } else if (cbVal('warNo-NAWA')) {
                    boilerTitle += "NAWA means nothing"
                } else if (cbVal('warNo-removeWar')) {
                    boilerTitle += "We don't remove warnings"
                }
            }
            document.getElementById("PAC-boilers-boilerWindow-header").textContent = boilerTitle
            // for 1Ds, this should change to be the name of the 1D boiler
        }

        boilerText.value = str
        if(cbVal("c-autoSelectText").checked) {
            boilerText.select()
            boilerText.focus()
        }

        return proceed
    }

    async function testAssembly() {
        let mWindow = document.querySelector('#PAC-boilers-text-multiWindow')

        const bWindow = document.querySelector('#PAC-boilers-boilertext'),
              warnOption = document.querySelector('#PAC-boilers-rdc-warning input'),
              suspOption = document.querySelector('#PAC-boilers-rdc-suspension input'),
              prior1warn = document.querySelector('#PAC-boilers-rdc-DATE1-warning input'),
              catName = document.querySelector('#PAC-boilers-textbox-catName'),
              catNameStorage = catName.value

        const singleWork = '"Test Work 1", located at https://archiveofourown.org/works/1000001 ',
              multiWork = singleWork + '\n"Test Work 2", located at https://archiveofourown.org/works/2000002 ',
              singleWork2 = '"Test Work 3", located at https://archiveofourown.org/works/3000003 ',
              multiWork2 = singleWork2 + '\n"Test Work 4", located at https://archiveofourown.org/works/400004 '

        const testEditCompProfile = gTabActive() && false,
              dWindow = document.querySelector('#PAC-boilers-comp-deletelist'),
              compEditWork = document.querySelector('#PAC-boilers-cbLabel-comp-work'),
              compProfile = document.querySelector('#PAC-boilers-cbLabel-comp-profile')


        let testStr = ''
        catName.value = "NAME"
        if (prior1warn.checked) prior1warn.click()
        warnOption.click()

//         mWindow.value = ''
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'

        mWindow.value = singleWork
//         dWindow.value = singleWork2
        await updateBoilerText()
        testStr += bWindow.value + '\n\n\n\n'

        mWindow.value = multiWork
        await updateBoilerText()
        testStr += bWindow.value + '\n\n\n\n'

//         dWindow.value = singleWork2
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'


//         mWindow.value = singleWork
//         dWindow.value = multiWork2
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'

//         mWindow.value = multiWork
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'


        suspOption.click()
        prior1warn.click()

//         mWindow.value = ''
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'

        mWindow.value = singleWork
//         dWindow.value = singleWork2
        await updateBoilerText()
        testStr += bWindow.value + '\n\n\n\n'

        mWindow.value = multiWork
        await updateBoilerText()
        testStr += bWindow.value + '\n\n\n\n'

//         dWindow.value = singleWork2
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'


//         mWindow.value = singleWork
//         dWindow.value = multiWork2
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'

//         mWindow.value = multiWork
//         await updateBoilerText()
//         testStr += bWindow.value + '\n\n\n\n'

        bWindow.value = testStr
        catName.value = catNameStorage
    }

    async function makeUsefulLinks(linkArea) {

        function makeLink(ls, la) {
            ls = ls.split('|')
            if (ls.length < 1) {return null}
            else if (ls.length < 2) {ls.push(ls[0])}

            let a = document.createElement('a')

            a.innerText = ls[0]
            a.href = ls[1]
            a.target = "_blank"
            la.appendChild(a)
        }

        var linkDrop = document.createElement('div'),
            linkDropButton = document.createElement('div'),
            linkDropContent = document.createElement('div')

        linkDrop.className = 'PAC-boilers-usefulLink-dd'
        linkDropContent.className = 'PAC-boilers-usefulLink-dd-content'
        linkDropButton.innerText = "Boilers"

        linkDrop.appendChild(linkDropButton)
        linkDrop.appendChild(linkDropContent)
        linkArea.appendChild(linkDrop)

        let linkList = "Wiki Primary|https://wiki.transformativeworks.org/mediawiki/Category:Policy_%26_Abuse_Boilers\n"+
            "Misc|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Miscellaneous\n"+
            "Harassment|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Harassment\n"+
            "Non-fanworks|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Non-fanworks\n"+
            "Plagright|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Plagiarism_%26_Copyright\n"+
            "Tagging|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Tagging\n"+
            "Drafting|https://wiki.transformativeworks.org/mediawiki/PAC:Extended_boiler_library:_Drafting\n"+
            "Teyke's trello|https://trello.com/b/R43ddaKE/pac-teyke\n"+
            "Lydia's trello|https://trello.com/b/JHSyEtXU/pac-lydia\n"+
            "Wick's trello|https://trello.com/b/fi2sINrq/pac-wick\n"
        linkList = linkList.split('\n')
        linkList.forEach(li => {
            makeLink(li,linkDropContent)
        })
    }

    async function makePicker() {
        logDebug("Building a window to select boilers in ...");

        // Create the picker window.
        var picker = document.createElement("div");
        picker.id = "PAC-boilers-picker";
        picker.className = "PAC-boilers-window" + darkmode
        document.body.appendChild(picker)

        var headerContainer = document.createElement("div")
        picker.appendChild(headerContainer);
        headerContainer.style.display = "block"

        var header = document.createElement("div");
        header.id = "PAC-boilers-title";
        header.appendChild(document.createTextNode("Non-fanwork"));
        headerContainer.appendChild(header);

        var configButtonArea = document.createElement("div");
        picker.appendChild(configButtonArea);

        configButtonArea.style.position = "absolute";
        configButtonArea.style.top = "10px";
        configButtonArea.style.right = "10px";
        configButtonArea.style.height = "30px";

        var linkArea = document.createElement("div");
        linkArea.className = "PAC-boilers-usefulLinks"
        picker.appendChild(linkArea);
        await makeUsefulLinks(linkArea);

        var configOpenButton = addButton(configButtonArea,"openConfig","Settings");
        configOpenButton.onclick = toggleConfigWindow;

        var tabs = document.createElement("div");
        tabs.id = "PAC-boilers-tablist";
        picker.appendChild(tabs);

        var buttonArea = document.createElement("div");
        buttonArea.className = "PAC-boilers-buttonAreaBottom";
        buttonArea.style.height = "57px";
        tabs.appendChild(buttonArea)

        if (devMode) {
            let testBoilerButton = addButton(buttonArea, "testBoilers", "Test Boilers")
            buttonArea.style.height = "77px";
            testBoilerButton.style.width = "150px"
            testBoilerButton.onclick = async function() {
                await testAssembly()
                toggleBoilerWindow()
            }
        }

        let boilerOpenButton = addButton(buttonArea,"openBoiler","Open Boiler");
        boilerOpenButton.style.width = "150px";
        boilerOpenButton.onclick = async function() {
            let proceed = null
            if (!document.getElementById("PAC-boilers-boilertext").value) {
                await updateBoilerText();
            }
            toggleBoilerWindow();
        }

        let boilerRefreshButton = addButton(buttonArea,"openAndRefreshBoiler","Refresh Boiler");
        boilerRefreshButton.style.width = "150px";
        boilerRefreshButton.onclick = async function() {
            let proceed = await updateBoilerText();
            if (proceed) toggleBoilerWindow();
        }

        var viewport = document.createElement("div")
        viewport.id = "PAC-boilers-viewport"
        picker.appendChild(viewport)

        var pickerLeftTop = document.createElement("div")
        pickerLeftTop.id = "PAC-boilers-pickerLeftTop"
        viewport.appendChild(pickerLeftTop)

        var replies = document.createElement("div")
        replies.id = "PAC-boilers-replies"
        pickerLeftTop.appendChild(replies)

        var outcomes = document.createElement("div")
        outcomes.id = "PAC-boilers-outcomes"
        pickerLeftTop.appendChild(outcomes)

        var orphans = document.createElement("div")
        orphans.id = "PAC-boilers-orphans"
        pickerLeftTop.appendChild(orphans)

        document.body.appendChild(picker)

        // Create the options for formal/informal (or no) reporter replies
        await makeReplies(replies)

        // Create the outcomes (warning, suspension, # of offenses, etc) div
        await makeOutcomes(outcomes)

        // Create the option to set whether user orphaned any works
        await makeOrphans(orphans)

        // Create the tabs for boiler types
        var nfwBoilerRefresh = await makeNfwTab(viewport)
        var commpromBoilerRefresh = await makeCommpromTab(viewport)
        var crightBoilerRefresh = await makeCrightBoilerTab(viewport)
        var plagBoilerRefresh = await makePlagBoilerTab(viewport)
        var harassworkBoilerRefresh = await makeHarassWorkBoilerTab(viewport)
        var harassotherBoilerRefresh = await makeHarassOtherBoilerTab(viewport)
        var iconBoilerRefresh = await makeIconBoilerTab(viewport)
        var ratwarBoilerRefresh = await makeRatwarBoilerTab(viewport)
        var fandomBoilerRefresh = await makeFandomBoilerTab(viewport)
        var miscBoilerRefresh = await makeMiscBoilerTab(viewport)

        var loadTab = await GM.getValue("bTabActive")
        if (!loadTab) {
            GM.setValue("bTabActive","Non-fanwork")
            loadTab = "Non-fanwork"
        }

        addTab(tabs, "Non-fanwork", "PAC-boilers-nfwTab", loadTab, nfwBoilerRefresh)
        addTab(tabs, "Commercial Promotion", "PAC-boilers-commpromTab", loadTab, commpromBoilerRefresh)
        addTab(tabs, "Copyright Infringement", "PAC-boilers-crightTab", loadTab, crightBoilerRefresh)
        addTab(tabs, "Plagiarism", "PAC-boilers-plagTab", loadTab, plagBoilerRefresh)
        addTab(tabs, "Harassment (work)", "PAC-boilers-harassworkTab", loadTab, harassworkBoilerRefresh)
        addTab(tabs, "Harassment (other)", "PAC-boilers-harassotherTab", loadTab, harassotherBoilerRefresh)
        addTab(tabs, "Icon", "PAC-boilers-iconTab", loadTab, iconBoilerRefresh)
        addTab(tabs, "Wrong rating/warning", "PAC-boilers-ratwarTab", loadTab, ratwarBoilerRefresh)
        addTab(tabs, "Fandom Tags", "PAC-boilers-fandomTab", loadTab, fandomBoilerRefresh)
        addTab(tabs, "Misc", "PAC-boilers-miscTab", loadTab, miscBoilerRefresh)

        setPickerTop(document.querySelector('.PAC-boilers-active.PAC-boilers-view'))
        makeMovable(picker, [tabs, viewport])
    }

    function titleSourceWindow(name) {
        var sourceWindow = document.getElementById("PAC-boilers-sourceWindow"),
            multiWindow = document.getElementById("PAC-boilers-multiWindow"),
            needSources = ["Plagiarism","Copyright Infringement"],
            needExamples = ["Commercial Promotion","Harassment (work)","Harassment (other)"],
            needMulti = ["Non-fanwork","Commercial Promotion","Plagiarism","Copyright Infringement","Wrong rating/warning","Harassment (work)","Harassment (other)","Misc"]

        if (needSources.includes(name)) {
            sourceWindow.style.display = "block"
            sourceWindow.querySelector('.PAC-boilers-header').innerText = "List sources"
        } else if (needExamples.includes(name)) {
            sourceWindow.style.display = "block"
            sourceWindow.querySelector('.PAC-boilers-header').innerText = "List examples"
        } else {
            sourceWindow.style.display = "none"
        }

        if (needMulti.includes(name)) {
            multiWindow.style.display = "block"
            if (name == "Commercial Promotion") {
                multiWindow.querySelector('.PAC-boilers-header').innerText = "Editable works/etc"
            } else {
                multiWindow.querySelector('.PAC-boilers-header').innerText = "Works/bookmarks/series"
            }
        } else {
            multiWindow.style.display = "none"
        }
    }

    function makeMenu(title) {
        logDebug("Create menu popup buttons ...");

        var menuOpen = document.createElement("div");
        var menuLink = document.createElement("a");

        menuOpen.className = "PAC-boilers-open PAC-adminInfo-open" + darkmode
        menuOpen.id = "PAC-boilers-" + title
        menuOpen.appendChild(menuLink)

        menuLink.href = "javascript:void(0)";
        menuLink.appendChild(document.createTextNode(title));
        menuLink.onclick = function() {
            togglePicker(title);
        };

        document.body.appendChild(menuOpen);
    }

    async function init() {
        var parts = window.location.pathname.split('/');

        const colormode = await GM.getValue('darkmode', 'Lightmode')
        if (colormode == 'Darkmode' ||
            (colormode == 'Auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            darkmode = " PAC-boilers-darkMode"
        }

        logDebug("Creating style sheets ...")
        makeStyleSheet(makeStyleCode(await getMenuRules()))

        if (!document.querySelector('h2') || (document.querySelector('h2').textContent != 'Error 404' && document.querySelector('h2').textContent != 'Error 500')) {
            if (([parts[1],parts[3]].some(p => ['works','chapters'].includes(p)) && !parts.includes('edit_tags')) || parts[1] == 'comments' ||
                (parts[1] == 'users' && (!parts[4] || isNaN(parts[4]))) ||
                (['bookmarks','series'].includes(parts[1]) && !isNaN(parts[2])) ) {

                makePicker()
                makeMenu("Boilers")
                makeBoilerWindow()
                makeConfigWindow()
                makeSideWindow("multiWindow", "List works/bookmarks/series")
                makeSideWindow("sourceWindow", "List sources")

                if ((parts[1] == 'users' && parts[3] == 'profile') || parts[1] == 'bookmarks') {
                    document.getElementById("PAC-boilers-text-multiWindow").value = window.location.href
                } else {
                    document.getElementById("PAC-boilers-text-multiWindow").value = getWorkInfo("title at location")
                }

            };
        };
    }

    init();

})(VM, VM.solid.web, VM.solid);