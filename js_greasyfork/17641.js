// ==UserScript==
// @name            rsel-exprparser-basic
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         2024.03.08.01
// @description     Parses RSel-specific expression text and rebuilds it in the UI.
// @author          TheLastTaterTot, jangliss, fuji2086
// @include         https://editor-beta.waze.com/*editor/*
// @include         https://www.waze.com/*editor/*
// @exclude         https://www.waze.com/*user/editor/*
// @grant           none
// ==/UserScript==

// Main usage: RSelExprParser.updateExpression(<rsel expression text>)

var RSelExprParser = {
    version: '2024.04.28.01',
    new__EXPR_DEBUGINFO: function(m, exprWord, exprPhrase) {
        return {
            m: m,
            exprMatches: exprWord,
            exprMatchPhrases: exprPhrase,
            exprBuild: {},
            err: null ,
            errorMsg: null
        };
    },
    escapeRegExp(s) {
        return s.replace(/[.*+?{}()|[\]\\\/]/g, '\\$&'); // $& means the whole matched string
    },
    _getSelectionIndex: function(selector, selText) {
        for (var s = 0, sLength = selector.length; s < sLength; s++) {
            if (new RegExp(RSelExprParser.escapeRegExp(selText),'i').test(selector[s].text) && !selector[s].disabled) {
                return selector[s].value;
            }
        }
    },
    _getSelectOptions: function(selector) {
        for (var opts = [], s = 0, sLength = selector.length; s < sLength; s++) {
        	if (!selector[s].disabled) {
            	opts[s] = selector[s].text.toLowerCase();
        	}
        }
        return opts;
    },
    _getNewExprBuild: function() {
        return {
            cond: null ,
            op: null ,
            op2: null ,
            val: null ,
            val2: null ,
            condmod: null ,
            errorCode: 0

        }
    },
    getCurrentExprText: function(){
        return document.getElementById('outRSExpr').value;
    },
    /*Using RSel DOM elements rather than requesting dev to provide direct modifiction of RSel's expr object.
        This is so the RSel dev can feel free to significantly change his object storage structure if needed. */
    rselButtons: {
        lfParens: function() {
            try {
                document.getElementById('btnRSLBkt').click();
            } catch (err) {}
        },
        rtParens: function() {
            try {
                document.getElementById('btnRSRBkt').click();
            } catch (err) {}
        },
        and: function() {
            try {
                document.getElementById('btnRSAnd').click()
            } catch (err) {}
        },
        or: function() {
            try {
                document.getElementById('btnRSOr').click()
            } catch (err) {}
        },
        not: function() {
            try {
                document.getElementById('btnRSNot').click()
            } catch (err) {}
        },
        clear: function() {
            try {
                document.getElementById('btnRSClear').click()
            } catch (err) {}
        }
    },
    rselConditions: {
        country: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSCountry').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSCountry').options, selText);
            },
            val: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('selRSCountry').value = RSelExprParser._getSelectionIndex(document.getElementById('selRSCountry').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddCountry').click();
            }
        },
        state: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSState').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSState').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSState').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddState').click();
            }
        },
        city: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSCity').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSCity').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSCity').value = val;
            },
            condmod: function(val) {
                document.getElementById('selRSAltCity').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddCity').click();
            }
        },
        street: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSStreet').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSStreet').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSStreet').value = val;
            },
            condmod: function(val) {
                document.getElementById('selRSAlttStreet').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddStreet').click();
            }
        },
        unnamed: {
            op: function(checked) {
                document.getElementById('cbRSNoName').checked = checked;
            },
            //checked - has no name
            op2: function(checked) {
                document.getElementById('cbRSAltNoName').checked = checked;
            },
            //checked - alt name
            add: function() {
                document.getElementById('btnRSAddNoName').click();
            }
        },
        road: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSRoadType').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSRoadType').options, selText);
            },
            val: function(selText) {
            	selText = '^' + selText.replace("/", "\/") + '$';
                document.getElementById('selRSRoadType').value = RSelExprParser._getSelectionIndex(document.getElementById('selRSRoadType').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddRoadType').click();
            }
        },
        direction: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSDirection').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSDirection').options, selText);
            },
            val: function(selText) {
                document.getElementById('selRSDirection').value = RSelExprParser._getSelectionIndex(document.getElementById('selRSDirection').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddDirection').click();
            }
        },
        elevation: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSElevation').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSElevation').options, selText);
            },
            val: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('selRSElevation').value = RSelExprParser._getSelectionIndex(document.getElementById('selRSElevation').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddElevation').click();
            }
        },
        manlock: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSManLock').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSManLock').options, selText);
            },
            val: function(val) {
                document.getElementById('selRSManLock').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddManLock').click();
            }
        },
        traflock: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSTrLock').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSTrLock').options, selText);
            },
            val: function(val) {
                document.getElementById('selRSTrLock').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddTrLock').click();
            }
        },
        speed: {
            opOptNodes: function() { return document.getElementById('opRSSpeed').options },
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSSpeed').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSSpeed').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSSpeed').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddSpeed').click();
            }
        },
        closure: {
            op: function(checked) {
                document.getElementById('cbRSClsr').checked = checked;
            },
            op2: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSClsrStrtEnd').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSClsrStrtEnd').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSClsrDays').value = val;
            },
            condmod: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSClsrBeforeAter').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSClsrBeforeAter').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddClsr').click();
            }
        },
		routingpreference: {
			op: function(selText) {
			},
			val: function(val) {
				document.getElementById('opRSRoutePrf').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSRoutePrf').options, val);
			},
            add: function() {
                document.getElementById('btnRSAddRoutePrf').click();
            }
		},
        updatedby: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSUpdtd').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSUpdtd').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSUpdtd').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddUpdtd').click();
            }
        },
        createdby: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSCrtd').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSCrtd').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSCrtd').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddCrtd').click();
            }
        },
        last: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSLastU').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSLastU').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSLastU').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddLastU').click();
            }
        },
        length: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSLength').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSLength').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSLength').value = val;
            },
            condmod: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('unitRSLength').value = RSelExprParser._getSelectionIndex(document.getElementById('unitRSLength').options, selText);
            },
            add: function() {
                document.getElementById('btnRSAddLength').click();
            }
        },
        id: {
            op: function(selText) {
            	selText = '^' + selText + '$';
                document.getElementById('opRSSegId').value = RSelExprParser._getSelectionIndex(document.getElementById('opRSSegId').options, selText);
            },
            val: function(val) {
                document.getElementById('inRSSegId').value = val;
            },
            add: function() {
                document.getElementById('btnRSAddSegId').click();
            }
        },
        roundabout: {
            op: function(checked) {
                document.getElementById('cbRSIsRound').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddIsRound').click();
            }
        },
        toll: {
            op: function(checked) {
                document.getElementById('cbRSIsToll').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddIsToll').click();
            }
        },
        tunnel: {
            op: function(checked) {
                document.getElementById('cbRSTunnel').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddTunnel').click();
            }
        },
        unpaved: {
            op: function(checked) {
                document.getElementById('cbRSUnpaved').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddUnpaved').click();
            }
        },
		hov: {
            op: function(checked) {
                document.getElementById('cbRSHOV').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddHOV').click();
            }
        },
		headlights: {
            op: function(checked) {
                document.getElementById('cbRSHeadlights').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddHeadlights').click();
            }
        },
        new: {
            op: function(checked) {
                document.getElementById('cbRSIsNew').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddIsNew').click();
            }
        },
        changed: {
            op: function(checked) {
                document.getElementById('cbRSIsChngd').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddIsChngd').click();
            }
        },
        screen: {
            op: function(checked) {
                document.getElementById('cbRSOnScr').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddOnScr').click();
            }
        },
        restriction: {
            op: function(checked) {
                document.getElementById('cbRSRestr').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddRestr').click();
            }
        },
        editable: {
            op: function(checked) {
                document.getElementById('cbRSEdtbl').checked = checked;
            },
            add: function() {
                document.getElementById('btnRSAddEdtbl').click();
            }
        }
    },
    addExpr: function(eb) {
        var checkKeys = false;
        Object.keys(this.rselConditions).map(function(a, i) {
            if (a === eb.cond)
                checkKeys = true;
        });
        if (checkKeys) {
            try {
                this.rselConditions[eb.cond].op(eb.op);
                if (eb.op2 !== null )
                    this.rselConditions[eb.cond].op2(eb.op2);
                if (eb.condmod !== null )
                    this.rselConditions[eb.cond].condmod(eb.condmod);

                if (eb.val2 === null ) {
                    if (eb.val !== null )
                        this.rselConditions[eb.cond].val(eb.val);
                    this.rselConditions[eb.cond].add();
                } else {
                    this.rselButtons.lfParens();
                    this.rselConditions[eb.cond].val(eb.val);
                    this.rselConditions[eb.cond].add();
                    this.rselButtons.or();
                    this.rselConditions[eb.cond].val(eb.val2);
                    this.rselConditions[eb.cond].add();
                    this.rselButtons.rtParens();
                }

            } catch (err) {
                return {
                    errorCode: 101,
                    errorMsg: 'Error: Unable to parse expression text.',
                    err: err
                };
            }
        } else {
            return {
                errorCode: 3,
                errorMsg: 'Selection condition was not recognized'
            };
            //
        }
        return {
            errorCode: 0
        };
    },
    //=============================================================================
    parseExpr: function(parseThis) {
        //---------------------------------------------------------------
        parseThis = parseThis.replace(/\bpri?m?(?:ary|\.)?\s?(?:or)\s?alt(?:ern|s)?(?:\.)?/ig, 'any');
        parseThis = parseThis.replace(/\b((?:un)?name[ds]?)\b|\b(road) type\b|\b(last) update\b|\b(speed) limits?\b/ig, '$1$2$3$4')
        parseThis = parseThis.replace(/\b(man)ual (lock)s?\b|\b(traf)[fic]* (lock)s?\b/ig, '$1$2$3$4');
        parseThis = parseThis.replace(/\b(created|updated)\s(by)\b/ig, '$1$2');
		parseThis = parseThis.replace(/\b(routing)\s(preference)\b/ig, '$1$2');
        parseThis = parseThis.replace(/\bon screen/ig, 'onscreen');
        //\b(?:in|on|off|out|outside)(?: of)?[- ]?screen\b
        parseThis = parseThis.replace(/\b(?:off|out)(?: of)?[- ]?screen/ig, 'offscreen');

        var parseExprArray = parseThis.match(
            /(\(['"].*?['"]\)|".*?"|'.*?'|\/.+?\/)|\bno[\s-]alt|\b(?:street[\s-]?)?name\(s\)|\bstreet(?:\snames?)\b|\btoll(?:[-\s]?ro?a?d)?\b|\bdoes(?:\s?n[o']t)\b|(?:!\s?)?contains?\b|\w+n't\b|!=|>=|<=|([ab](<-|->)[ab])|&&|\|\||!=|[|&<>=()!~]|[\u0023-\u0027\u002A-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/gim),
            parseExprHistory = [],
            condMatches = [],
            condMatchPhrases = [],
            exprMatches = [],
            exprMatchPhrases = [],
            exprFragment, unwantedWordsSearch,
            e, f, b, fLength;

        // The following parses the expression text into unique chunks within separate array elements
        e = parseExprArray.length;
        while (e-- > 0) {
            try {
                exprFragment = parseExprArray.shift();
                //console.info(exprFragment);

                // Find operators that join individual expressions (AND|OR|!|parenthesis)
                if (/^(?:and|or|&&|\|\||!=|[=&|()!])$/i.test(exprFragment)) {
                    exprMatches.push(exprFragment.toLowerCase());
                    exprMatchPhrases.push(exprFragment.toLowerCase());
                }

                // Identify elements that contain selection condition names
                if (
                /^country|^state|^city|^street|^(?:un|street[\s-]?)?name|^road|^round|^toll|^speed|^dir|^elevation|^tun|^unpaved|^carpool|^headlights|^manlock|^traflock|^speed|^new|^changed|screen$|^restrict|^clos|^createdby|^last|^updatedby|^length|^routingpreference|^id|^editable/i
                .test(exprFragment)) {
                    condMatches.push(exprFragment.toLowerCase());
                    // lists specific selection conditions
                    exprMatches.push(exprFragment.toLowerCase());
                    //same as condMatches, but includes operations as separate array elements

                    try {
                        //search phrase fowards
                        fLength = parseExprArray.length;
                        f = 0;
                        while (!(/^(and|or|&&|\|\||[&|)])$/i.test(parseExprArray[f])) && (++f < fLength)) {}
                        //search phrase backwards
                        b = parseExprHistory.length;
                        while (!(/^(and|or|&&|\|\||[&|(])$/i.test(parseExprHistory[b - 1])) && (--b > 0)) {}

                        condMatchPhrases.push(parseExprHistory.slice(b).concat(exprFragment, parseExprArray.slice(0, f)));
                        //list specific selection conditions and its criteria

                        unwantedWordsSearch = parseExprHistory.slice(b);
                        if (unwantedWordsSearch && unwantedWordsSearch.length) {
                            unwantedWordsSearch = unwantedWordsSearch.filter(function(a) {
                                return !/\b(has|have|is|=|are|does|was|were)\b/i.test(a)
                            });
                        }
                        if (/!|!=/.test(unwantedWordsSearch[0]))
                            unwantedWordsSearch.splice(0, 1);

                        exprMatchPhrases.push(unwantedWordsSearch.concat(parseExprArray.slice(0, f)));
                        //excludes the match cond

                        parseExprHistory = parseExprHistory.concat(exprFragment, parseExprArray.slice(0, f));
                        parseExprArray = parseExprArray.slice(f);
                        e -= f;
                    } catch (err) {
                        return {
                            errorCode: 101,
                            errorMsg: 'Error parsing expression at ' + exprFragment,
                            err: err
                        };
                    }
                } else {
                    parseExprHistory.push(exprFragment);
                }
            } catch (err) {
                return {
                    errorCode: 101,
                    errdebug: 'Error parsing expression at ' + exprFragment,
                    err: err
                };
            }
        }
        //while


        //---------------------------------------------------------------
        // Quick crude check for unmatched parentheses
        var nOpenParens = exprMatches.toString().match(/\(/g),
            nCloseParens = exprMatches.toString().match(/\)/g);
        if (!nOpenParens) nOpenParens = [];
        if (!nCloseParens) nCloseParens = [];
        if (nOpenParens.length !== nCloseParens.length)
            return {
                errorCode: 1,
                errorMsg: 'Warning: Open and close paretheses may be unmatched.'
            };

        //---------------------------------------------------------------

        return {
            errorCode: 0,
            exprMatches: exprMatches,
            exprMatchPhrases: exprMatchPhrases,
            condMatches: condMatches,
            condMatchPhrases: condMatchPhrases
        };
    },
    buildExpr: function(exprWord, exprPhrase) {

        var exprBuild = RSelExprParser._getNewExprBuild();
        exprBuild.cond = exprWord;

        //if (m===10) debugger;

        //============================================================
        // Where the magic happens... sort of.
        //============================================================
        switch (true) {
        case exprWord === '(':
            this.rselButtons.lfParens();
            return false;
        case exprWord === ')':
            this.rselButtons.rtParens();
            return false;
        case 'and' === exprWord:
            this.rselButtons.and();
            return false;
        case 'or' === exprWord:
            this.rselButtons.or();
            return false;
        case /no alt/i.test(exprPhrase):
            exprBuild.cond = 'unnamed';
            exprBuild.op = true;
            exprBuild.op2 = true;
            return exprBuild;
        case '!' === exprWord:
            this.rselButtons.not();
            return false;
        case /^unnamed/.test(exprBuild.cond):
            exprBuild.cond = 'unnamed';
            exprBuild.op = true;
            exprBuild.op2 = false;
            return exprBuild;

            // SPEED LIMITS
        case 'speed' === exprBuild.cond:
            try {
                if (exprPhrase.length < 2 && /\bnot?\b|!|!=/i.test(exprPhrase[0])) {
                    exprBuild.op = 'none';
                } else {
                    exprPhrase = exprPhrase.join(' ');

                    if (/\bnot?\b|!|!=/i.test(exprPhrase)) {
                        RSelExprParser.rselButtons.not();
                    }

                    var optionText = RSelExprParser._getSelectOptions(RSelExprParser.rselConditions.speed.opOptNodes());
                    optionText = RegExp(optionText.join('|'), 'i').exec(exprPhrase);
                    if (optionText) exprBuild.op = optionText[0];
                    else exprBuild.op = 'any';
                }

                if (exprPhrase.length > 1) {
                    exprBuild.val = exprPhrase.replace(/.*?(\d+)\s?mph.*|.*?(\d+)\s?km.*/i,'$1$2');
                } else {
                    exprBuild.val = '';
                }
            } catch (err) {
                exprBuild.errorCode = 101;
                exprBuild.err = err;
                return exprBuild;
            }
            return exprBuild;

            // BINARY CONDITIONS:
        case exprPhrase.length === 0 || //suggests binary
        /^(screen|roundabout|toll|tun|unpaved|carpool|headlights|new|changed|restrict|editable)/.test(exprBuild.cond) || //binary selection conditions
        (/^name.*|^closure/i.test(exprBuild.cond) && exprPhrase.length <= 1):
            //selection conditions that have both binary and multiple options

            exprPhrase = exprPhrase.join(' ');

            exprBuild.cond = exprBuild.cond.replace(/^name.*/, 'name');
            exprBuild.cond = exprBuild.cond.replace(/^toll\s.*/, 'toll');

            if (/\bnot?\b|!|!=/i.test(exprPhrase)) {
                exprBuild.op = false;
            } else {
                exprBuild.op = true;
            }
            switch (exprBuild.cond) {
            case 'name':
                try {
                    if (/alt/i.test(exprPhrase)) {
                        exprBuild.cond = 'unnamed';
                        exprBuild.op = false;
                        exprBuild.op2 = true;
                    } else {
                        exprBuild.cond = 'unnamed';
                        exprBuild.op = false;
                        exprBuild.op2 = false;
                    }
                    return exprBuild;
                } catch (err) {
                    exprBuild.errorCode = 101;
                    exprBuild.err = err;
                    return exprBuild;
                }
            case 'closure':
                exprBuild.op2 = '---';
                exprBuild.val = '';
                return exprBuild;
            case 'onscreen':
                exprBuild.cond = 'screen';
                exprBuild.op = true;
                return exprBuild;
            case 'offscreen':
                exprBuild.cond = 'screen';
                exprBuild.op = false;
                return exprBuild;
            case 'roundabout':
            case 'toll':
            case 'tunnel':
            case 'unpaved':
			case 'headlights':
            case 'new':
            case 'changed':
            case 'restriction':
            case 'editable':
                return exprBuild;
			case 'carpool/hov/bus':
				exprBuild.cond = "hov";
				return exprBuild;
            default:
                exprBuild.errorCode = 101;
                exprBuild.errorMsg = 'Error: Presumed binary selector had no match.';
                return exprBuild;
            }
            //switch

            //--------------------------------------------------------------------

        case /^closure/.test(exprBuild.cond):
            try {
                exprPhrase = exprPhrase.join().toLowerCase();
                exprBuild.op = !(/does\s?n['o]t|!|!=/.test(exprPhrase));
                //checkbox
                exprBuild.op2 = /start|end/.exec(exprPhrase) + 's';
                //starts/ends
                exprBuild.condmod = /before|after|\bin\b/.exec(exprPhrase) + '';
                //in/before/after
                if (!exprBuild.condmod)
                    exprBuild.condmod = 'in';
                exprBuild.val = /\d+/.exec(exprPhrase) + '';
                //days ago
            } catch (err) {
                exprBuild.errorCode = 101;
                exprBuild.err = err;
                return exprBuild;
            }
            return exprBuild;

        default:
            // CONDITION NAME MATCHING (TYPE OF SELECTION)
            try {
                if (/^(str.*|cit.*)/.test(exprBuild.cond)) {
                    exprBuild.cond = exprBuild.cond.replace(/^str.*/, 'street');
                    exprBuild.cond = exprBuild.cond.replace(/^cit.*/, 'city');
                    var exprStart = exprPhrase.slice(0, -1), //don't include last element bc it should be the name itself
                    prim, alt;
                    if (exprStart) {
                        //exprStart = exprStart.toString().toLowerCase();
                        prim = /\bprim?(?:ary|\.)?\b/i.test(exprStart);
                        alt = /\balt(?:ern\w*|\.)?\b/i.test(exprStart);
                        any = /\bany\b/i.test(exprStart);
                        exprPhrase = exprStart.filter(function(a) {return !/^pr|^alt|^any/i.test(a)}).concat(exprPhrase.slice(-1));
                    } else {
                        prim = false;
                        alt = false;
                    }
                    if ((prim && alt) || any)
                        exprBuild.condmod = 2;
                    else if (prim)
                        exprBuild.condmod = 0;
                    else if (alt)
                        exprBuild.condmod = 1;
                    else
                        exprBuild.condmod = 0;
                }
            } catch (err) {
                exprBuild.errorCode = 101;
                exprBuild.err = err;
                return exprBuild;
            }

            // COMPARATOR OPERATION MATCHING
            try {
                // Convert to standard comparator operations
                var exprPhraseStr = exprPhrase.join(' ').replace(/\bcontains?/i, 'contains').replace(/(?:\bdo(?:es)?\s?n[o']t\s|!\s?)(contains)/i, '! $1');
                //.replace(/\b(?:do(?:es)?\s?n[o']t\s|!\s?)contains?/i, '!^').replace(/\bcontains?/i,'\u220b');

                // Comparator operations with standard representation
                exprBuild.op = /(?:! )?contains|[!<>=~]{1,2}/i.exec(exprPhraseStr) + '';

            } catch (err) {
                exprBuild.errorCode = 101;
                exprBuild.err = err;
                return exprBuild;
            }

            // SELECTION VALUE MATCHING
            if (/^length|^last/.test(exprBuild.cond)) {
                exprBuild.val = exprPhraseStr.match(/\b\d+/) + '';
            } else {
                try {
                    var blackmagic = '[\u0023-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+',
                        whitemagic = '^\\(["\'](.*?)[\'"]\\)$|^\\s?["\'](.*)["\']$|^["\'](.*)[\'"]$|\\b(';

                    // The following line is kind of elaborate bc it needed to grab text between parens/quotes while keeping the inner quotes
                    exprBuild.val = exprPhraseStr.replace(new RegExp('^(?:\\s?' + exprBuild.op + '\\s)(.*)','i'),'$1').replace(new RegExp(whitemagic + blackmagic + '?)\\b','ig'),'$1$2$3$4').replace(new RegExp('(") (' + blackmagic + ') (")','ig'),'$1$2$3');

                    if (!/^street|^city/.test(exprBuild.cond)) {
                        exprBuild.val = exprBuild.val.replace(/"(.*)"|'(.*)'/, '$1$2');
                    }
                } catch (err) {
                    exprBuild.errorCode = 2;
                    exprBuild.err = err;
                    return exprBuild;
                }

                if (/^direction/.test(exprBuild.cond)) {
                    exprBuild.val = exprBuild.val.match(/A[<>‹›-\s]*B|B[<>‹›-\s]*A|^"?one[\s-]?ways?"?$|unknown|\btwo/i)+''; //reduce to unique key words... last option will automatically input both one ways
                    //reduce to unique key words...
                }
            }

            return exprBuild;
        }
        //switch
    },
    //parseExpr()
    updateExpression: function(parseThis) {
        this.rselButtons.clear();
        if (parseThis) {
            //console.info('*** Begin parsing expression... ***');


            var parsed = this.parseExpr(parseThis);

            if (parsed && !parsed.errorCode) {
                var exprMatches = parsed.exprMatches,
                exprMatchPhrases = parsed.exprMatchPhrases,
                exprFragment, exprFragPhrase, mLength, m;

                mLength = exprMatchPhrases.length;
                for (m = 0; m < mLength; m++) {
                    RSelExprParser.__EXPR_DEBUGINFO = this.new__EXPR_DEBUGINFO(m, exprMatches[m], exprMatchPhrases[m]);

                    //if (m > 3) debugger;

                    exprFragment = exprMatches[m];
                    exprFragPhrase = exprMatchPhrases[m];

                    if (exprFragPhrase.constructor !== Array) exprFragPhrase = [exprFragPhrase];

                    var exprBuild = this.buildExpr(exprFragment, exprFragPhrase);

                    if (exprBuild && !exprBuild.errorCode) {
                        RSelExprParser.__EXPR_DEBUGINFO.errorStatus = this.addExpr(exprBuild);

                        if (RSelExprParser.__EXPR_DEBUGINFO.errorStatus && RSelExprParser.__EXPR_DEBUGINFO.errorStatus.errorCode) {
                            console.warn('updateExpression() may have partly failed. Check results.');
                            RSelExprParser.__EXPR_DEBUGINFO.exprBuild = exprBuild;
                            console.debug(RSelExprParser.__EXPR_DEBUGINFO);
                            return false;
                        }
                    } else if (exprBuild && exprBuild.errorCode) {
                        console.warn('updateExpression() may have partly failed. Check results.');
                        RSelExprParser.__EXPR_DEBUGINFO.exprBuild = exprBuild;
                        console.debug(RSelExprParser.__EXPR_DEBUGINFO);
                        return false;
                    }
                } //for each condition matched

                return this.getCurrentExprText();
            } else {
                console.debug(parsed);
                return false;
            }
        } else {
            return null;
        }
    }
};