// ==UserScript==
// @name            WME Road Selector Expression Editor
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         2019.02.07.01
// @description     Allows easier editing of the selection criteria by converting the expressions into editable text
// @author          TheLastTaterTot
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/editor*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/17613/WME%20Road%20Selector%20Expression%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/17613/WME%20Road%20Selector%20Expression%20Editor.meta.js
// ==/UserScript==

/* global __EXPR_DEBUGINFO */

__EXPR_DEBUGINFO = [];

var ExprEditor = function() {
    var _rsel, rselButtons, rselConditions, updateHi = false;

    //$('#cmEditExprBox').val($('#outRSExpr').html().replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
    $('#cmEditExprBox').val($('#outRSExpr').val());

    $('#cmCopyToRSelExpr').click(function() {
        $('#cmEditExprBox').val($('#outRSExpr').val());
    });

    $('#cmParseRSelExpr').click(function() {
        updateHi = false;
        document.getElementById('cmParseRSelExpr').style.color = '';
        updateExpr();
    });

    $('#cmCloseExprEditor').click(function() {
        document.getElementById('cmExprEditor').remove();
    });

    document.getElementById('cmEditExprBox').addEventListener('focus', function(){
        updateHi = true;
    }, false);

    document.getElementById('cmEditExprBox').addEventListener('blur', function(){
        if (this.value !== '' && updateHi) {
            document.getElementById('cmParseRSelExpr').style.color = '#2196F3';
        }
    }, false);

    _rsel = {
        getSelectionIndex: function(selector, selText) {
            return selector.map(function(i) {
                if (new RegExp(selText, 'i').test(this.innerText)) return this.value
            }).get(0);
        },
        getSelectOptions: function(selector) {
            var opts = [];
            selector.map(function(i, a) {
                opts.push(a.innerText.toLowerCase());
            });
            return opts;
        },
        getNewExprBuild: function() {
            return {
                cond: null,
                op: null,
                op2: null,
                val: null,
                val2: null,
                condmod: null
            }
        }
    };/*Using RSel DOM elements rather than requesting dev to provide direct modifiction of RSel's expr object.
        This is so the RSel dev can feel free to significantly change his object storage structure if needed. */

    rselButtons = {
        lfParens: function() {
            try {
                $('#btnRSLBkt').click();
            } catch (err) {}
        },
        rtParens: function() {
            try {
                $('#btnRSRBkt').click();
            } catch (err) {}
        },
        and: function() {
            try {
                $('#btnRSAnd').click()
            } catch (err) {}
        },
        or: function() {
            try {
                $('#btnRSOr').click()
            } catch (err) {}
        },
        not: function() {
            try {
                $('#btnRSNot').click()
            } catch (err) {}
        },
        clear: function() {
            try {
                $('#btnRSClear').click()
            } catch (err) {}
        }
    };

    rselConditions = {
        country: {
            op: function(selText) {
                $('#opRSCountry').val(_rsel.getSelectionIndex($('#opRSCountry option'), selText));
            },
            val: function(selText) {
                $('#selRSCountry').val(_rsel.getSelectionIndex($('#selRSCountry option'), selText));
            },
            add: function() {
                $('#btnRSAddCountry').click();
            }
        },
        state: {
            op: function(selText) {
                $('#opRSState').val(_rsel.getSelectionIndex($('#opRSState option'), selText));
            },
            val: function(val) {
                $('#inRSState').val(val);
            },
            add: function() {
                $('#btnRSAddState').click();
            }
        },
        city: {
            op: function(selText) {
                $('#opRSCity').val(_rsel.getSelectionIndex($('#opRSCity option'), selText));
            },
            val: function(val) {
                $('#inRSCity').val(val);
            },
            condmod: function(val) {
                $('#selRSAltCity').val(val);
            },
            add: function() {
                $('#btnRSAddCity').click();
            }
        },
        street: {
            op: function(selText) {
                $('#opRSStreet').val(_rsel.getSelectionIndex($('#opRSStreet option'), selText));
            },
            val: function(val) {
                $('#inRSStreet').val(val);
            },
            condmod: function(val) {
                $('#selRSAlttStreet').val(val);
            },
            add: function() {
                $('#btnRSAddStreet').click();
            }
        },
        unnamed: {
            op: function(chkVal) {
                $('#cbRSNoName').prop('checked', chkVal);
            }, //checked - has no name
            op2: function(chkVal) {
                $('#cbRSAltNoName').prop('checked', chkVal);
            }, //checked - alt name
            add: function() {
                $('#btnRSAddNoName').click();
            }
        },
        road: {
            op: function(selText) {
                $('#opRSRoadType').val(_rsel.getSelectionIndex($('#opRSRoadType option'), selText));
            },
            val: function(selText) {
                $('#selRSRoadType').val(_rsel.getSelectionIndex($('#selRSRoadType option'), selText));
            },
            add: function() {
                $('#btnRSAddRoadType').click();
            }
        },
        direction: {
            op: function(selText) {
                $('#opRSDirection').val(_rsel.getSelectionIndex($('#opRSDirection option'), selText));
            },
            val: function(selText) {
                $('#selRSDirection').val(_rsel.getSelectionIndex($('#selRSDirection option'), selText));
            },
            add: function() {
                $('#btnRSAddDirection').click();
            }
        },
        elevation: {
            op: function(selText) {
                $('#opRSElevation').val(_rsel.getSelectionIndex($('#opRSElevation option'), selText));
            },
            val: function(selText) {
                $('#selRSElevation').val(_rsel.getSelectionIndex($('#selRSElevation option'), selText));
            },
            add: function() {
                $('#btnRSAddElevation').click();
            }
        },
        manlock: {
            op: function(selText) {
                $('#opRSManLock').val(_rsel.getSelectionIndex($('#opRSManLock option'), selText));
            },
            val: function(val) {
                $('#selRSManLock').val(val);
            },
            add: function() {
                $('#btnRSAddManLock').click();
            }
        },
        traflock: {
            op: function(selText) {
                $('#opRSTrLock').val(_rsel.getSelectionIndex($('#opRSTrLock option'), selText));
            },
            val: function(val) {
                $('#selRSTrLock').val(val);
            },
            add: function() {
                $('#btnRSAddTrLock').click();
            }
        },
        speed: {
            opOptNodes: $('#opRSSpeed option'),
            op: function(selText) {
                $('#opRSSpeed').val(_rsel.getSelectionIndex($('#opRSSpeed option'), selText));
            },
            val: function(val) {
                $('#inRSSpeed').val(val);
            },
            add: function() {
                $('#btnRSAddSpeed').click();
            }
        },
        closure: {
            op: function(checked) {
                $('#cbRSClsr').prop('checked', checked);
            },
            op2: function(selText) {
                $('#opRSClsrStrtEnd').val(_rsel.getSelectionIndex($('#opRSClsrStrtEnd option'), selText));
            },
            val: function(val) {
                $('#inRSClsrDays').val(val);
            },
            condmod: function(selText) {
                $('#opRSClsrBeforeAter').val(_rsel.getSelectionIndex($('#opRSClsrBeforeAter option'), selText));
            },
            add: function() {
                $('#btnRSAddClsr').click();
            }
        },
        updatedby: {
            op: function(selText) {
                $('#opRSUpdtd').val(_rsel.getSelectionIndex($('#opRSUpdtd option'), selText));
            },
            val: function(val) {
                $('#inRSUpdtd').val(val);
            },
            add: function() {
                $('#btnRSAddUpdtd').click();
            }
        },
        createdby: {
            op: function(selText) {
                $('#opRSCrtd').val(_rsel.getSelectionIndex($('#opRSCrtd option'), selText));
            },
            val: function(val) {
                $('#inRSCrtd').val(val);
            },
            add: function() {
                $('#btnRSAddCrtd').click();
            }
        },
        last: {
            op: function(selText) {
                $('#opRSLastU').val(_rsel.getSelectionIndex($('#opRSLastU option'), selText));
            },
            val: function(val) {
                $('#inRSLastU').val(val);
            },
            add: function() {
                $('#btnRSAddLastU').click();
            }
        },
        length: {
            op: function(selText) {
                $('#opRSLength').val(_rsel.getSelectionIndex($('#opRSLength option'), selText));
            },
            val: function(val) {
                $('#inRSLength').val(val);
            },
            condmod: function(selText) {
                $('#unitRSLength').val(_rsel.getSelectionIndex($('#unitRSLength option'), selText));
            },
            add: function() {
                $('#btnRSAddLength').click();
            }
        },
        id: {
            op: function(selText) {
                $('#opRSSegId').val(_rsel.getSelectionIndex($('#opRSSegId option'), selText));
            },
            val: function(val) {
                $('#inRSSegId').val(val);
            },
            add: function() {
                $('#btnRSAddSegId').click();
            }
        },
        roundabout: {
            op: function(checked) {
                $('#cbRSIsRound').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddIsRound').click();
            }
        },
        toll: {
            op: function(checked) {
                $('#cbRSIsToll').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddIsToll').click();
            }
        },
        tunnel: {
            op: function(checked) {
                $('#cbRSTunnel').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddTunnel').click();
            }
        },
        new: {
            op: function(checked) {
                $('#cbRSIsNew').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddIsNew').click();
            }
        },
        changed: {
            op: function(checked) {
                $('#cbRSIsChngd').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddIsChngd').click();
            }
        },
        screen: {
            op: function(checked) {
                $('#cbRSOnScr').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddOnScr').click();
            }
        },
        restriction: {
            op: function(checked) {
                $('#cbRSRestr').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddRestr').click();
            }
        },
        editable: {
            op: function(checked) {
                $('#cbRSEdtbl').prop('checked', checked);
            },
            add: function() {
                $('#btnRSAddEdtbl').click();
            }
        }
    };

    rselConditions.autolock = rselConditions.traflock;
    rselConditions.lock = {
            op: rselConditions.manlock.op,
            val: rselConditions.manlock.val,
            add: rselConditions.manlock.add,
            op2: rselConditions.traflock.op,
            val2: rselConditions.traflock.val,
            add2: rselConditions.traflock.add
        };
    ////////////////////////////////////////////////////////////////////////////////
    // On error
    var derp = function(errdebug, err) {
        var errorMsg;
        if (err !== undefined) console.error(err);
        if (errdebug.constructor === Number) {
            switch (errdebug) {
                case 1:
                    errorMsg = 'Warning: Open and close paretheses may be unmatched.';
                    break;
                case 2:
                    errorMsg = 'Error: Try wrapping the names with quotes?';
                    break;
                case 3:
                    errorMsg = 'Error: Selection condition was not recognized.';
                    break;
                case 4:
                    errorMsg = 'Error: Binary selector condition assumed, but found no match.';
                    break;
                default: //error 101
                    errorMsg = 'Error: Unable to parse expression text.';
            }
        } else {
            errorMsg = 'Error: Unable to parse expression text.';
            console.debug(errdebug);
        }

        if (document.getElementById('cmExprError') === null) {
            $('#cmEditExprBox').css('border-color', 'red');
            $('#cmEditExprBox').after('<span id="cmExprError" style="text-align: center; color: crimson; width: 100%; font-size: 10px; float: right;">' + errorMsg +
                '</span>');

            document.getElementById('cmEditExprBox').onfocus = function() {
                $('#cmEditExprBox').css('border-color', '');
                $('#cmExprError').remove();
                document.getElementById('cmEditExprBox').onfocus = null;
            };
        }
    };

    var translateNaturalLang = function(exprFragPhrase) {
        var exprPhraseStr;

        exprPhraseStr = exprFragPhrase.join(' ').replace(/\bcontains?/i, 'contains').replace(/(?:\bdo(?:es)?\s?n[o']t\s|!\s?)(contains|have|has)/i, '! $1');  //.replace(/\b(?:do(?:es)?\s?n[o']t\s|!\s?)contains?/i, '!^').replace(/\bcontains?/i,'\u220b');
        exprPhraseStr = exprPhraseStr.replace(/\b(?:is\s|are\s|was\s|were\s|has\s|have\s)?(?:less|fewer|<)(?:\sthan\b)?|\bbefore\b/i, '<');
        exprPhraseStr = exprPhraseStr.replace(/\b(?:is\s|are\s|was\s|were\s|has\s|have\s)?(?:greater|more|>)(?:\sthan\b)?|\bafter\b/i, '>');
        exprPhraseStr = exprPhraseStr.replace(/\b(?:does|has|is|was|were|are)(?:\s?n[o']?t)(?:\sequal)?(?:\sto)?(?:\sat)?/i, '!=');
        exprPhraseStr = exprPhraseStr.replace(/\b(?:is|was|were|are)(?:\sequal)?|\bat\b|={1,3}|\bin\b/i, '=');
        exprPhraseStr = exprPhraseStr.replace(/\b(has|have)\b/i,'contains');//check last bc other phrases may also use "has"/"have"

        return exprPhraseStr;
    };

    var detectRoadType = function(phrase) {
        phrase = phrase.replace(/^fwy?$/i,'^freeway');
        phrase = phrase.replace(/hwy/i,''); //not important bc not a unique keyword
        phrase = phrase.replace(/^MH$/,'^major');
        phrase = phrase.replace(/^(mH|mh)$/,'^minor');
        phrase = phrase.replace(/^ps$|^prim.*/i,'^primary');
        phrase = phrase.replace(/^st.*/i,'^street');
        phrase = phrase.replace(/^dirt.*|.*4[\s-]?x[\s-]?4.*/i,'^dirt');
        phrase = phrase.replace(/^plr?$|^park.*/i,'^parking');
        phrase = phrase.replace(/^pr$|^pvtr$|^pvr$|^priv.*/i,'^private');
        phrase = phrase.replace(/^wt$|^walk.*|.*trl/i,'^walking');
        phrase = phrase.replace(/^pb$|^ped.*|.*b(?:oard)?w(?:alk)?/i,'^pedestrian');
        phrase = phrase.replace(/^sw$|^stair.*/i,'^stairway');
        phrase = phrase.replace(/^rr$|^rail.*/i,'^railroad');
        phrase = phrase.replace(/^rw$|^tw$|.*run.*|.*taxi.*/i,'^runway');

        return phrase;
    };

    ////////////////////////////////////////////////////////////////////////////////
    function updateExpr() {

       console.info('*** Begin parsing expression... ***');
        rselButtons.clear();
        $('#cmEditExprBox').css('border-color', '');
        $('#cmExprError').remove();
        document.getElementById('cmEditExprBox').onfocus = null;

        //---------------------------------------------------------------
        var addExpr = function(eb) {
            var checkKeys = false;
            Object.keys(rselConditions).map(function(a, i) {
                if (a === eb.cond) checkKeys = true;
            });
            if (checkKeys) {
                try {
                    rselConditions[eb.cond].op(eb.op);
                    if (eb.op2 !== null) rselConditions[eb.cond].op2(eb.op2);
                    if (eb.condmod !== null) rselConditions[eb.cond].condmod(eb.condmod);

                    if (eb.val2 === null) {
                        if (eb.val !== null) rselConditions[eb.cond].val(eb.val);
                        rselConditions[eb.cond].add();
                    } else {
                        rselButtons.lfParens();
                        rselConditions[eb.cond].val(eb.val);
                        rselConditions[eb.cond].add();
                        rselButtons.or();
                        rselConditions[eb.cond].val(eb.val2);
                        rselConditions[eb.cond].add();
                        rselButtons.rtParens();
                    }
                    return true;
                } catch (err) {
                    __EXPR_DEBUGINFO[__EXPR_DEBUGINFO.length-1].eb = eb;
                    derp(__EXPR_DEBUGINFO, err);
                    return false;
                }
            } else {
                __EXPR_DEBUGINFO[__EXPR_DEBUGINFO.length-1].eb = eb;
                derp(3, __EXPR_DEBUGINFO);
                return false;
            }
        };
        //---------------------------------------------------------------
        var parseThis = $('#cmEditExprBox').val();

        //Ensure there is a space after a comparator
        //parseThis = parseThis.replace(/([^-])([!=<>~]{1,2})([("'\w])/g,'$1$2 $3');

        //replace some multi-word conditions with unique single words - note: they cannot overlap with potential selection condition names
        parseThis = parseThis.replace(/\bpri?m?(?:ary|\.)?\s?(?:or|and|\|\||\||&|&&|\/)\s?alt(?:ern|s)?(?:\.)?/gim, 'any');
        parseThis = parseThis.replace(/\b((?:un)?name[ds]?)(?:[-\s]?seg[a-z]*)?\b|\b(road)(?:.?(?:type))?\b/gim, '$1$2')
        parseThis = parseThis.replace(/\b(man)[ually]*[\s-]?(lock)(?:ed|s)?\b|\b(traf)[fic]*[\s-]?(lock)(?:ed|s)?\b|\b(auto)-?(?:matic[ally]*)?[\s-]?(lock)(?:ed|s)?\b|\b(lock)(?:ed|s)?(?:\sat)?\b/gim,'$1$2$3$4$5$6$7');
        parseThis = parseThis.replace(/\b(created)[\s-]?(by)\b/gim, 'createdby');
        parseThis = parseThis.replace(/\b(?:update[ds]?|edite?d?s?)[\s-]?by\b/gim, 'updatedby');
        parseThis = parseThis.replace(/\blast(?:[\s-]?(?:update[ds]?|edite?d?s?))?\b/gim,'last');
        parseThis = parseThis.replace(/\b(?:in|on)[- ]?screen/gim, 'onscreen');  //\b(?:in|on|off|out|outside)(?: of)?[- ]?screen\b
        parseThis = parseThis.replace(/\b(?:off|out|outside)(?: of)?[- ]?screen/gim, 'offscreen');
        parseThis = parseThis.replace(/\b(?:speed[\s-]?(?:limits?)?|sls?)\b/gim, 'speed');
        parseThis = parseThis.replace(/\bbut\b/gim, 'and');
        parseThis = parseThis.replace(/\b(?:is\s|are\s|was\s|were\s|has\s|have\s)?(?:less|fewer)\s(?:than\s)?or\sequal\sto/i, '<=');
        parseThis = parseThis.replace(/\b(?:is\s|are\s|was\s|were\s|has\s|have\s)?(?:greater|more)\s(?:than\s)?or\sequal\sto/i, '>=');

        //The following regex pattern is for ensuring certain phrases will be parsed out together
        var parseExprArray = parseThis.match(
            /(\(['"].*?['"]\)|".*?"|'.*?'|\/.+?\/)|\bno[\s-]alt|\b(?:street[\s-]?)?name\(s\)|\bstreet(?:\snames?)\b|\btoll(?:[-\s]?ro?a?d)?\b|\bdoes(?:\s?n[o']t)\b|(?:!\s?)?contains?\b|\w+n't\b|!=|>=|<=|([ab](<-|->)[ab])|&&|\|\||!=|[|&<>=()!~]|[\u0023-\u0027\u002A-\u003B-\u003F-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+|\b\w+\b/gim),
            parseExprHistory = [], //condMatches = [], condMatchPhrases = [],
            exprMatches = [],
            exprMatchPhrases = [],
            exprBuild, exprFragment, exprFragPhrase, exprPhraseStr, unwantedWordsSearch,
            e, f, b, fLength, m, mLength, moreParsing, numMore, //closeParens,
            success = false;

        // The following parses the expression text into unique chunks within separate array elements
        e = parseExprArray.length;
        while (e-- > 0) {
            try {
                exprFragment = parseExprArray.shift();
                //console.info(exprFragment);

                // Find operators that join individual expressions (AND|OR|!|parenthesis) and separate them as their own array element
                if (/^(and|or|&&|\|\||!=|[=&|()!])$/i.test(exprFragment)) {
                    exprMatches.push(exprFragment.toLowerCase());
                    exprMatchPhrases.push(exprFragment.toLowerCase());
                    parseExprHistory.push(exprFragment);
                }
                // Identify elements that contain selection condition names
                else if (/^country|^state|^city|^street|^(?:un|street[\s-]?)?name|^road|^type|^round|^rotary|^ra\b|^toll|^speed|^dir|^elevation|^tun|^manlock|^traflock|^autolock|^lock|^speed|^new|^changed|screen$|^restrict|^clos|^createdby|^last|^updatedby|^length|^id|^editable/i
                    .test(exprFragment)) {

                    //condMatches.push(exprFragment.toLowerCase()); //lists specific selection conditions - debugging purposes
                    exprMatches.push(exprFragment.toLowerCase()); //same as condMatches, but includes operations as separate array elements

                    /* Separate the phrase associated with the selection condition
                     IMPORTANT: Make sure that any expressions which match the below regex are not in an element by itself if they are part of another phrase
                     (e.g., "greater than OR equal to" should be changed to >=, otherwise the OR will be parsed as a separate selection condition) */
                    try {
                        fLength = parseExprArray.length;
                        // Separate numbers from conjunctors -- (TODO: think of a better way to parse this from original string perhaps)
                        // This is mostly important when using the & conjunctor since it is more likely to forget the space between words/numbers when using & than 'and'
                        f = 0;
                        while (f < fLength) {
                            moreParsing = parseExprArray[f].match(/(\d+|.+?)[^\w](and|or|&&?)[^\w](.*?)/);
                            if (moreParsing && moreParsing.length>2) {
                                numMore = moreParsing.length-2; //-2 to exclude the first element (see next comment) and the original element that we have split into separate elements
                                moreParsing = moreParsing.slice(1); //remove the first element, since it's just the whole matched expr
                                moreParsing.forEach(function(a,i){parseExprArray.splice(f+i+1,0,a)}); //insert newly parsed subArray into parseExprArray
                                parseExprArray.splice(f,1); //remove the original array element...
                                fLength = parseExprArray.length;
                                e += numMore;
                                break;
                            }
                            f++;
                        }

                        //search phrase fowards
                        f = 0;
                        while (!(/^(and|or|&&|\|\||[&|)])$/i.test(parseExprArray[f])) && (++f < fLength)) {}
                        //search phrase backwards
                        b = parseExprHistory.length;
                        while (!(/^(and|or|&&|\|\||[&|(])$/i.test(parseExprHistory[b - 1])) && (--b > 0)) {}

                        //condMatchPhrases.push(parseExprHistory.slice(b).concat(exprFragment, parseExprArray.slice(0, f))); //list specific selection conditions and its criteria - debugging purposes

                        // The following block removes leading words that are being proccessed within this iteration and/or words that are related to =, i.e., the default operation assumption
                        unwantedWordsSearch = parseExprHistory.slice(b);
                        if (unwantedWordsSearch && unwantedWordsSearch.length) {
                            unwantedWordsSearch = unwantedWordsSearch.filter(function(a){return !/\b(h?as|have|is|=|are|does|was|were)\b/i.test(a)});
                            /*for (m = unwantedWordsSearch.length; m--;) {  //same as using filter
                                if (/\b(has|have|is|=|are|does|was|were)\b/i.test(unwantedWordsSearch[m])) {
                                    unwantedWordsSearch.splice(m,1);
                                }
                            }*/
                        }
                        if (/!|!=/.test(unwantedWordsSearch[0])) unwantedWordsSearch.splice(0,1);

                        exprMatchPhrases.push(unwantedWordsSearch.concat(parseExprArray.slice(0, f))); //excludes the match cond

                        //parseExprHistory.push(exprFragment);
                        parseExprHistory = parseExprHistory.concat(exprFragment, parseExprArray.slice(0, f));
                        parseExprArray = parseExprArray.slice(f);
                        e -= f;
                    } catch (err) {
                        derp('Error parsing expression at ' + exprFragment, err);
                    }
                } else {
                    parseExprHistory.push(exprFragment);
                }
            } catch (err) {
                derp('Error parsing expression at ' + exprFragment, err);
            }
        } //while


        //---------------------------------------------------------------
        // Quick crude check for unmatched parentheses
        var nOpenParens = exprMatches.toString().match(/\(/g),
            nCloseParens = exprMatches.toString().match(/\)/g);
        if (!nOpenParens) nOpenParens = [];
        if (!nCloseParens) nCloseParens = [];
        if (nOpenParens.length !== nCloseParens.length) derp(1);
        //---------------------------------------------------------------

        //closeParens = 0;
        __EXPR_DEBUGINFO = [];
        mLength = exprMatchPhrases.length;
        for (m = 0; m < mLength; m++) {
            __EXPR_DEBUGINFO.push({
                m: m,
                exprMatches: exprMatches[m],
                exprMatchPhrases: exprMatchPhrases[m]
            }); //reset for error debugging
            dbIdx = __EXPR_DEBUGINFO.length-1;

            exprFragment = exprMatches[m];
            exprFragPhrase = exprMatchPhrases[m];
            if (exprFragPhrase.constructor !== Array) exprFragPhrase = [exprFragPhrase];

            exprBuild = _rsel.getNewExprBuild();
            exprBuild.cond = exprFragment;

            //if (m===10) debugger;

            //if (closeParens === 1) closeParens = 2;

            //============================================================
            // Where the magic happens... sort of.
            //============================================================
            switch (true) {
                case (exprFragment === '('):
                    rselButtons.lfParens();
                    success = true;
                    break;
                case (exprFragment === ')'):
                    rselButtons.rtParens();
                    success = true;
                    break;

                // 'AND' OPERATOR
                case /^(&|&&|and)$/.test(exprFragment):
                    rselButtons.and();
                    //console.info(exprFragment.toLowerCase());
                    success = true;
                    break;

                // 'OR' OPERATOR
                case /^(\||\|\||or)$/.test(exprFragment):
                    //console.info(exprFragment.toLowerCase());
                    rselButtons.or();
                    success = true;
                    break;

                //---NO ALT STREET NAMES---
                case /no[\s-]alt/i.test(exprFragPhrase):
                    rselConditions.unnamed.op(true);
                    rselConditions.unnamed.op2(true);
                    rselConditions.unnamed.add();
                    success = true;
                    break;

                // 'NOT' OPERATOR
                case /^(!|!=|not)$/.test(exprFragment):
                    rselButtons.not();/*
                    if (exprMatches[m + 1] !== '(') {
                        rselButtons.lfParens();
                        closeParens = 1;
                    }*/
                    success = true;
                    break;

                //---UNNAMED SEGMENT---
                case /^unnamed/.test(exprBuild.cond):
                    rselConditions.unnamed.op(true);
                    rselConditions.unnamed.op2(false);
                    rselConditions.unnamed.add();
                    success = true;
                    break;

                //---SPEED LIMIT---
                case /^speed.*|^sls?/.test(exprBuild.cond):
                    try {
                        if (exprFragPhrase.length < 2 && /\bnot?\b|!|!=/i.test(exprFragPhrase[0])) {
                            exprBuild.op = 'none';
                        } else {
                            exprFragPhrase = exprFragPhrase.join(' ');

                            if (/\bnot?\b|!|!=/i.test(exprFragPhrase)) rselButtons.not();

                            var optionText = _rsel.getSelectOptions(rselConditions.speed.opOptNodes);
                            optionText = RegExp(optionText.join('|'), 'i').exec(exprFragPhrase);
                            if (optionText) exprBuild.op = optionText[0];
                            else exprBuild.op = 'any';
                        }

                        if (exprFragPhrase.length > 1) {
                            exprBuild.val = exprFragPhrase.replace(/.*?(\d+)\s?mph.*|.*?(\d+)\s?km.*/i,'$1$2');
                        } else {
                            exprBuild.val = '';
                        }
                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
                    success = addExpr(exprBuild);
                    break;

                //---ADD BOTH (manual & auto) LOCKS---
                case /^locks?$/.test(exprBuild.cond):
                    exprPhraseStr = translateNaturalLang(exprFragPhrase);
                    exprBuild.op = /(?:! )?contains|[!<>=~]{1,2}/i.exec(exprPhraseStr)+'';
                    exprBuild.val = exprPhraseStr.match(/\b\d+/)+'';
                    rselButtons.lfParens();
                    rselConditions.manlock.op(exprBuild.op);
                    rselConditions.manlock.val(exprBuild.val);
                    rselConditions.manlock.add();
                    rselButtons.or();
                    rselConditions.traflock.op(exprBuild.op);
                    rselConditions.traflock.val(exprBuild.val);
                    rselConditions.traflock.add();
                    rselButtons.rtParens();
                    success = true;
                    break;

                //---ALL OTHER BINARY CONDITIONS---
                case exprFragPhrase.length === 0 || //suggests binary
                    /^(?:screen|roundabout|ra|toll|tun|new|changed|restr|editable)/.test(exprBuild.cond) || //binary selection conditions
                    (/^(?:street[\s-]?)?name.*|^city|^clos.*/i.test(exprBuild.cond) && exprFragPhrase.length <= 1): //selection conditions that have both binary and multiple options

                    exprFragPhrase = exprFragPhrase.join(' ');

                    exprBuild.cond = exprBuild.cond.replace(/^(?:street[\s-]?)?name.*/, 'name');
                    exprBuild.cond = exprBuild.cond.replace(/^ra\b|^rotary|^round.*/, 'roundabout');
                    exprBuild.cond = exprBuild.cond.replace(/^toll.*/, 'toll');
                    exprBuild.cond = exprBuild.cond.replace(/^tun.*/, 'tunnel');
                    exprBuild.cond = exprBuild.cond.replace(/^restr.*/, 'restriction');

                    if (/\bnot?\b|!|!=/i.test(exprFragPhrase)) {
                        exprBuild.op = false;
                    } else {
                        exprBuild.op = true;
                    }
                    try {
                        switch (exprBuild.cond) {
                            case 'name':
                                try {
                                    if (/alt/i.test(exprFragPhrase)) {
                                        rselConditions.unnamed.op(false);
                                        rselConditions.unnamed.op2(true);
                                        rselConditions.unnamed.add();
                                        success = true;
                                    } else {
                                        if (exprBuild.op === false) {
                                            exprBuild.cond = 'street';
                                            exprBuild.op = '=';
                                            exprBuild.val = '';
                                            exprBuild.condmod = 0;
                                            success = addExpr(exprBuild);
                                        } else {
                                            rselConditions.unnamed.op(false);
                                            rselConditions.unnamed.op2(false);
                                            rselConditions.unnamed.add();
                                            success = true;
                                        }
                                    }
                                } catch (err) { derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err) }
                                break;
                            case 'city':
                                if (exprBuild.op === false) {
                                    exprBuild.cond = 'city';
                                    exprBuild.op = '=';
                                    exprBuild.val = '';
                                    exprBuild.condmod = 0;
                                    success = addExpr(exprBuild);
                                } else {
                                    __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                                    derp(4, __EXPR_DEBUGINFO);
                                }
                                break;
                            case 'closure':
                                exprBuild.op2 = '---';
                                exprBuild.val = '';
                                success = addExpr(exprBuild);
                                break;
                            case 'onscreen':
                                exprBuild.cond = 'screen';
                                exprBuild.op = true;
                                success = addExpr(exprBuild);
                                break;
                            case 'offscreen':
                                exprBuild.cond = 'screen';
                                exprBuild.op = false;
                                success = addExpr(exprBuild);
                                break;
                            case 'roundabout':
                            case 'toll':
                            case 'tunnel':
                            case 'new':
                            case 'changed':
                            case 'restriction':
                            case 'editable':
                                success = addExpr(exprBuild);
                                break;
                        } //switch

                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
                    break;

                //---SEGMENTS WITH CLOSURE---
                case /^closure/.test(exprBuild.cond):
                    try {
                        exprFragPhrase = exprFragPhrase.join().toLowerCase();
                        exprBuild.op = !(/does\s?n['o]t|!|!=/.test(exprFragPhrase)); //checkbox
                        exprBuild.op2 = /start|end/.exec(exprFragPhrase) + 's'; //starts/ends
                        exprBuild.condmod = /before|after|\bin\b/.exec(exprFragPhrase) + ''; //in/before/after
                        if (!exprBuild.condmod) exprBuild.condmod = 'in';
                        exprBuild.val = /\d+/.exec(exprFragPhrase) + ''; //days ago
                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
                    success = addExpr(exprBuild);
                    break;

                //---EVERYTHING ELSE---
                default:
                    //**********************************************
                    // CONDITION NAME MATCHING (TYPE OF SELECTION)
                    try {
                        if (/^(name|str|cit)/.test(exprBuild.cond)) {
                            exprBuild.cond = exprBuild.cond.replace(/^name.*/, 'street');
                            exprBuild.cond = exprBuild.cond.replace(/^str.*/, 'street');
                            exprBuild.cond = exprBuild.cond.replace(/^cit.*/, 'city');

                            var exprStart = exprFragPhrase.slice(0, -1), //don't include last element bc it should be the name itself
                                prim, alt, any; //exprStartStr,

                            if (exprStart) {
                                //exprStartStr = exprStart.toString().toLowerCase();
                                prim = /\bpri?m?(?:ary|\.)?\b/i.test(exprStart);
                                alt = /\balt(?:ern\w*|\.)?\b/i.test(exprStart);
                                any = /\bany\b/i.test(exprStart);
                                exprFragPhrase = exprStart.filter(function(a){return !/^pr|^alt|^any/i.test(a)}).concat(exprFragPhrase.slice(-1));
                            } else {
                                prim = false;
                                alt = false;
                            }
                            if ((prim && alt) || any) exprBuild.condmod = 2;
                            else if (prim) exprBuild.condmod = 0;
                            else if (alt) exprBuild.condmod = 1;
                            else exprBuild.condmod = 0;
                        } else {
                            //exprBuild.cond = exprBuild.cond.replace(/^traf.*|^auto.*/, 'traflock');
                            //exprBuild.cond = exprBuild.cond.replace(/^man.*/, 'manlock');
                            exprBuild.cond = exprBuild.cond.replace(/^dir.*/, 'direction');
                            exprBuild.cond = exprBuild.cond.replace(/^(?:road)(?:.?(?:type))?|^type/, 'road');
                            //exprBuild.cond = exprBuild.cond.replace(/^created? by/, 'createdby');
                            //exprBuild.cond = exprBuild.cond.replace(/^(?:update[ds]?|edite?d?s?) by/, 'updatedby');
                            //exprBuild.cond = exprBuild.cond.replace(/^last (?:update[ds]?|edite?d?s?)\b|^(?:update[ds]?|edite?d?s?)\b/,'last')
                        }
                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
                    //**********************************************
                    // COMPARATOR OPERATION MATCHING
                    try {
                        // Convert natural lang representation to standard comparator operations
                        exprPhraseStr = translateNaturalLang(exprFragPhrase);

                        // Comparator operations with standard representation
                        exprBuild.op = /(?:! )?contains|[!<>=~]{1,2}/i.exec(exprPhraseStr)+'';
                        //console.info(exprBuild.op);
                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
                    //**********************************************
                    // SELECTION VALUE MATCHING
                    try {
                        if (/^length|^last/.test(exprBuild.cond)) { // TIME
                            exprPhraseStr = exprPhraseStr.replace(/\btoday\b/,0);
                            exprPhraseStr = exprPhraseStr.replace(/\byesterday|tomorrow\b/,1);
                            exprBuild.val = exprPhraseStr.match(/\b\d+/)+'';

                        } else if (/^id/.test(exprBuild.cond)) { // IDs
                            exprBuild.cond = /id/.exec(exprBuild.cond)+'';

                            if (/!/.test(exprBuild.op)) exprBuild.op = '!=';
                            else exprBuild.op = '=';

                            exprBuild.val = exprPhraseStr.match(/\d{3,12}/g).join(', ');

                        } else if (/lock/.test(exprBuild.cond)) { // LOCKS
                            exprBuild.val = exprPhraseStr.match(/\b\d+/)+'';

                        } else { //non-numeric, western and non-western alphabetic selection values
                            var blackmagic = '[\u0023-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+',
                                whitemagic = '^\\(["\'](.*?)[\'"]\\)$|^\\s?["\'](.*)["\']$|^["\'](.*)[\'"]$|\\b(';

                            exprBuild.val = exprPhraseStr.replace(new RegExp('^(?:\\s?' + exprBuild.op + '\\s)(.*)','i'),'$1').replace(new RegExp(whitemagic + blackmagic + '?)\\b','ig'),'$1$2$3$4').replace(new RegExp('(") (' + blackmagic + ') (")','ig'),'$1$2$3');

                            // regex allowed selection conditions
                            if (/^(state|city|street|updatedby|createdby)/.test(exprBuild.cond)) {
                                if (exprBuild.cond === 'street' && /no[\s-]name|not\snamed/.test(exprFragPhrase.join(' '))) {
                                    exprBuild.cond = 'street';
                                    exprBuild.op = '=';
                                    exprBuild.val = '';
                                    //exprBuild.condmod = 0;
                                    //success = addExpr(exprBuild);
                                    //break;
                                } else if (exprBuild.cond === 'city' && /no[\s-](city|name)|not\snamed/.test(exprFragPhrase.join(' '))) {
                                    exprBuild.cond = 'city';
                                    exprBuild.op = '=';
                                    exprBuild.val = '';
                                    //exprBuild.condmod = 0;
                                    //success = addExpr(exprBuild);
                                    //break;
                                } else if (/^\/.*?\/$/.test(exprBuild.val)) { // if regex delimiter was specified
                                    //strip regex delimiter
                                    exprBuild.val = exprBuild.val.replace(/^\/(.*?)\/$/,'$1');

                                    if (!/~/.test(exprBuild.op)) { //regex op is not being used...
                                        if (/!/.test(exprBuild.op)) rselButtons.not();
                                        exprBuild.op = '~'; //change the operation to regex
                                    }

                                // if wildcard is used, but regex delimiter and op is not being used, assume user did not enter in regex form and convert to regex
                                } else if (/\*/.test(exprBuild.val) && !/~/.test(exprBuild.op)) {
                                    if (/!/.test(exprBuild.op)) rselButtons.not();
                                    exprBuild.op = '~'; //change the operation to regex

                                    if (/^[^*]/.test(exprBuild.val)) //no beginning wildcard
                                        exprBuild.val = '^' + exprBuild.val;

                                    if (/[^*]$/.test(exprBuild.val)) //no end wildcard
                                        exprBuild.val = exprBuild.val + '$';

                                    exprBuild.val = exprBuild.val.replace(/\.?\*/g,'.*');
                                }

                            // Add flexility to value for direction selection; also allow user to specify 'oneway' without direction and auto add expr for both directions
                            } else if (/^direction/.test(exprBuild.cond)) {
                                exprBuild.val = exprBuild.val.match(/A[<>-\s]*B|B[<>-\s]*A|^"?one[\s-]?ways?"?$|unknown|\btwo/i)+''; //reduce to unique key words... last option will automatically input both one ways
                                exprBuild.val = exprBuild.val.replace(/B[\s<-]*A/, 'A->B');
                                exprBuild.val = exprBuild.val.replace(/A[\s<-]*B/, 'B->A');
                                if (/^one[\s-]?ways?$/.test(exprBuild.val)) {
                                    exprBuild.val = 'A->B';
                                    exprBuild.val2 = 'B->A';
                                }

                            } else {
                                exprBuild.val = exprBuild.val.replace(/^"(.+)"$|^'(.+)'$/, '$1$2');

                                if (/^road/.test(exprBuild.cond)) {
                                    exprBuild.val = detectRoadType(exprBuild.val);
                                }
                            }
                        }
                        success = addExpr(exprBuild);

                    } catch (err) {
                        __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                        derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases}, err);
                    }
            } //end switch
            /*
            if (closeParens === 2) {
                rselButtons.rtParens();
                closeParens = 0;
            }*/
            if (__EXPR_DEBUGINFO[dbIdx] === undefined) {
                __EXPR_DEBUGINFO.push(exprMatchPhrases);
            } else {
                __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
                if (!success) {
                    derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases});
                }
            }
        } //for each condition matched

        if (__EXPR_DEBUGINFO[dbIdx] === undefined) {
            __EXPR_DEBUGINFO.push(exprMatchPhrases);
            derp(__EXPR_DEBUGINFO);
        } else {
            __EXPR_DEBUGINFO[dbIdx].exprBuild = exprBuild;
            if (!success) {
                derp({__EXPR_DEBUGINFO: __EXPR_DEBUGINFO, exprMatchPhrases: exprMatchPhrases});
            } else {
                parseThis = null;
                parseExprArray = null;
                parseExprHistory = null;
            }
        }
    } //updateExpr()
}; //ExprEditor


var insertEditorIcon = function() {
    if (document.getElementById('cmBtnEdit') === null) {
        $('#RSselection>font').append('<a id="cmBtnEdit" class="fa fa-edit" style="text-decoration: none; padding-left: 5px; color: #003366; background: transparent; padding: 0px 8px; font-size: 18px; margin: -5px 0px; font-weight: 400;" href="javascript:void(0)"></a>');
    } else {
        $('#cmBtnEdit').remove();
        $('#cmExprEditor').remove();
        $('#RSselection>font').append('<a id="cmBtnEdit" class="fa fa-edit" style="text-decoration: none; padding-left: 5px; color: #003366; background: transparent; padding: 0px 8px; font-size: 18px; margin: -5px 0px; font-weight: 400;" href="javascript:void(0)"></a>');
    }

    document.getElementById('cmBtnEdit').addEventListener('click', function() {
        if (document.getElementById('cmExprEditor') === null) {
            $('#outRSExpr').after(
                '<div id="cmExprEditor" style="width:106%; color: #888; background-color: #F5F5F5; margin: 5px -3% 0px; padding: 0px 1% 4px; border-radius: 4px; border: 1px solid lightgray; font-size: 14px;" class="btn-group">\
                <div id="cmCopyToRSelExpr" class="btn cm-rsel-editor" style="width: 33%; font-weight: 500; padding: 0; border-top: 2px solid transparent;"><i class="fa fa-arrow-circle-down" style="font-size: 11px; padding: 4px;"></i>Copy</div>\
                <div id="cmParseRSelExpr" class="btn cm-rsel-editor" style="width: 34%; font-weight: 500; padding: 0; border-left: 1px dotted #DDD; border-right: 1px dotted #DDD; border-top: 2px solid transparent;"><i class="fa fa-arrow-circle-up" style="font-size: 11px; padding: 4px;"></i>Update</div>\
                <div id="cmCloseExprEditor" class="btn cm-rsel-editor" style="width: 33%; font-weight: 500; padding: 0; border-top: 2px solid transparent;"><i class="fa fa-times-circle" style="font-size: 11px; padding: 4px;"></i>Close</div>\
                <textarea style="max-width: 100%; margin: 0; min-height: 75px; padding: 5px 1%;" id="cmEditExprBox" class="form-control"></textarea></div>'
            );
            ExprEditor();

        } else {
            document.getElementById('cmExprEditor').remove();
        }
    }, false);
};


/*//////////////////////////////////////////////////////////////////////////*/
var waitForWMERSel = function() {
    var waitCount = 0,
        tryInitRSelExprEditor = function() {
            try {
                if (document.getElementById('RSselection') !== null) {
                    insertEditorIcon();
                } else {
                    if (waitCount++ < 35) {
                        setTimeout(tryInitRSelExprEditor, 600);
                    } else {
                        console.error(
                            'WME RSel Expression Editor: Could not link up with WME Road Selector.');
                    }
                }
            } catch (err) {
                console.error(err)
            }
        };
    tryInitRSelExprEditor();
}

setTimeout(waitForWMERSel, 500);
