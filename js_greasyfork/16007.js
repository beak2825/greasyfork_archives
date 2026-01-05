// ==UserScript==
// @name            WME Road Selector Highlights
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         2024.03.08.01
// @description     Create custom highlighters to colorize segments based on your selection criteria. Requires WME Road Selector to function.
// @author          TheLastTaterTot, WazeDev
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://greasyfork.org/scripts/17641-rsel-exprparser-basic/code/rsel-exprparser-basic.js
// @run-at          document-end
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAKpWlDQ1BJQ0MgUHJvZmlsZQAASMetlndQU+kaxr9z0hstEOmE3pEiEEB6Db03GyEJEEoIKSjYlcUVrIiIgLqUVYqCawFkURFRbItiw75BFgV1XSzYUNkDXMK9c2f/uDP3zXw5v3nnPU+e7+R8Mw8A5NssgSATVgAgiy8WRvp70eMTEuk4KYCQDwBmALDYIoFneHgw+Mf6cHd6FtyynNIC/1spcrgiNgBQOMLJHBE7C+ETyOpkC4RiAFACpK+/XCyY4lKElYWIQYTrpzh1hjunOHmGb0zPREd6I/wHAHgyiyVMBYA0hvTpuexURIeM7BZY8zk8PsIeCLux01gchNchbJGVlT3FhxE2Sf43ndT/0EyWabJYqTKe2ct04X14IkEmKw/8vysrUzL7G3rIIqcJAyKn9ow8s/qM7CAZ85NDw2aZx5men+Y0SUDMLLNF3omzzGH5BM2yJCPGc5ZZwrl7eWJm9CwLsyNl+lyRb5RMn8sMlnnIDJVxCs+POcv5adFxs5zLiw2dZVFGVNDcjLesL5REyjynCP1ke8wSzXljs+Y8iNOiA+a8xcs8cLg+vrI+P0Y2LxB7yTQFmeGyeW6mv6wvyo2S3StGXrBZTmcFhs/phMueD4gCeYAP2CAEsIAIiAEXCMXcFeIpw97ZgjwhLzVNTPdETgyXzuSzrSzottY2DgBMnb+Zv/cdbfpcQbQrc71sZwAYl5D3cPdcL3kEgLb7AKiR5noGyBmSXwZA61a2RJg700NPfWEAEcgjDtWANtAHJsAS2AIH4AI8gC8IBGEgGiSApYjrNJAFhGA5WAXWg0JQDHaA3aACHAC1oB4cAcdAG+gE58BFcBXcAHfAQyAFw+AlGAMfwAQEQTiIAlEhNUgHMoTMIVuIAblBvlAwFAklQElQKsSHJNAqaCNUDJVAFVA11AD9Ap2CzkGXoX7oPjQIjUJvoS8wCibDyrAWbATPhxmwJxwER8NL4FQ4B86HC+BtcDlcAx+GW+Fz8FX4DiyFX8LjKIAioWgoXZQlioHyRoWhElEpKCFqDaoIVYaqQTWjOlC9qFsoKeoV6jMai6ai6WhLtAs6AB2DZqNz0GvQW9AV6Hp0K7oHfQs9iB5Df8dQMJoYc4wzhomJx6RilmMKMWWYg5iTmAuYO5hhzAcsFkvDGmMdsQHYBGw6diV2C3YftgXbhe3HDmHHcTicGs4c54oLw7FwYlwhbi/uMO4s7iZuGPcJT8Lr4G3xfvhEPB+/AV+Gb8Sfwd/EP8dPEBQIhgRnQhiBQ8gjbCfUEToI1wnDhAmiItGY6EqMJqYT1xPLic3EC8RHxHckEkmP5ESKIPFI60jlpKOkS6RB0meyEtmM7E1eTJaQt5EPkbvI98nvKBSKEcWDkkgRU7ZRGijnKU8on+SoclZyTDmO3Fq5SrlWuZtyr+UJ8obynvJL5fPly+SPy1+Xf6VAUDBS8FZgKaxRqFQ4pTCgMK5IVbRRDFPMUtyi2Kh4WXFECadkpOSrxFEqUKpVOq80REVR9aneVDZ1I7WOeoE6rIxVNlZmKqcrFysfUe5THlNRUlmgEquyQqVS5bSKlIaiGdGYtEzadtox2l3al3la8zzncedtntc87+a8j6oaqh6qXNUi1RbVO6pf1OhqvmoZajvV2tQeq6PVzdQj1Jer71e/oP5KQ1nDRYOtUaRxTOOBJqxpphmpuVKzVvOa5riWtpa/lkBrr9Z5rVfaNG0P7XTtUu0z2qM6VB03HZ5Oqc5ZnRd0FbonPZNeTu+hj+lq6gboSnSrdft0J/SM9WL0Nui16D3WJ+oz9FP0S/W79ccMdAxCDFYZNBk8MCQYMgzTDPcY9hp+NDI2ijPaZNRmNGKsasw0zjduMn5kQjFxN8kxqTG5bYo1ZZhmmO4zvWEGm9mbpZlVml03h80dzHnm+8z7LTAWThZ8ixqLAUuypadlrmWT5aAVzSrYaoNVm9Xr+QbzE+fvnN87/7u1vXWmdZ31Qxslm0CbDTYdNm9tzWzZtpW2t+0odn52a+3a7d4sMF/AXbB/wT17qn2I/Sb7bvtvDo4OQodmh1FHA8ckxyrHAYYyI5yxhXHJCePk5bTWqdPps7ODs9j5mPNfLpYuGS6NLiMLjRdyF9YtHHLVc2W5VrtK3ehuSW4/uUnddd1Z7jXuTz30PTgeBz2ee5p6pnse9nztZe0l9Drp9dHb2Xu1d5cPysffp8inz1fJN8a3wveJn55fql+T35i/vf9K/64ATEBQwM6AAaYWk81sYI4FOgauDuwJIgdFBVUEPQ02CxYGd4TAIYEhu0IehRqG8kPbwkAYM2xX2ONw4/Cc8F8jsBHhEZURzyJtIldF9kZRo5ZFNUZ9iPaK3h79MMYkRhLTHSsfuzi2IfZjnE9cSZw0fn786virCeoJvIT2RFxibOLBxPFFvot2LxpebL+4cPHdJcZLViy5vFR9aebS08vkl7GWHU/CJMUlNSZ9ZYWxaljjyczkquQxtjd7D/slx4NTyhnlunJLuM9TXFNKUkZSXVN3pY6muaeVpb3iefMqeG/SA9IPpH/MCMs4lDGZGZfZkoXPSso6xVfiZ/B7srWzV2T3C8wFhQJpjnPO7pwxYZDwoAgSLRG1i5WRoHNNYiL5QTKY65Zbmftpeezy4ysUV/BXXMszy9uc9zzfL//nleiV7JXdq3RXrV81uNpzdfUaaE3ymu61+msL1g6v819Xv564PmP9bxusN5RseL8xbmNHgVbBuoKhH/x/aCqUKxQWDmxy2XTgR/SPvB/7Nttt3rv5exGn6EqxdXFZ8dct7C1XttpsLd86uS1lW992h+37d2B38Hfc3em+s75EsSS/ZGhXyK7WUnppUen73ct2Xy5bUHZgD3GPZI+0PLi8fa/B3h17v1akVdyp9KpsqdKs2lz1cR9n3839HvubD2gdKD7w5SfeT/eq/atba4xqymqxtbm1z+pi63p/ZvzccFD9YPHBb4f4h6T1kfU9DY4NDY2ajdub4CZJ0+jhxYdvHPE50t5s2VzdQmspPgqOSo6++CXpl7vHgo51H2ccbz5heKLqJPVkUSvUmtc61pbWJm1PaO8/FXiqu8Ol4+SvVr8e6tTtrDytcnr7GeKZgjOTZ/PPjncJul6dSz031L2s++H5+PO3eyJ6+i4EXbh00e/i+V7P3rOXXC91Xna+fOoK40rbVYerrdfsr538zf63k30Ofa3XHa+333C60dG/sP/MTfeb52753Lp4m3n76p3QO/13Y+7eG1g8IL3HuTdyP/P+mwe5DyYernuEeVT0WOFx2RPNJzW/m/7eInWQnh70Gbz2NOrpwyH20Ms/RH98HS54RnlW9lznecOI7UjnqN/ojReLXgy/FLyceFX4p+KfVa9NXp/4y+Ova2PxY8NvhG8m3255p/bu0PsF77vHw8effMj6MPGx6JPap/rPjM+9X+K+PJ9Y/hX3tfyb6beO70HfH01mTU4KWELWdBRAIQtOSQHg7SEAKAkAUJHcTJSbycfTNZP/Zwj8E89k6OlCkkttFwDRSIYORq57kasRsuSRfD0Vj6I9AGxnJ1v/KlGKne2MFhlJmZhPk5PvtADAdQDwTTg5ObFvcvJbHWIWyTZdOTO5fKqCLZEsoxOSYGvX8+3pf+XjvwGcpQW/OgjcfQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+ADGAQ4KVq5OMkAAAOHSURBVGje7ZpNTFNZFMf/99730SlgawsIxQ86GnHEYUJCmBA1RhfGGDPGzWQSNhMTE6MLWelmklm4cQlB3ExmFjMyC1wZlY0hKjXGjwQXQqIxQw2WSsWiLdS+1/dunwsoAkPLZAY6r4/7X57ce5LfPeee+3/JA4SEhOwkslxQ1yebstknTZT2lzP2+ApjzwGkFq05f2PQFgAuiSHgKcP2Ss/pxhpfrM5Tfr0gpK6/22IY8W8JuRJ0uy+fBLArX3K7QC4BvnS4Yevw/u2B3mUhNW2iWdOiu1yuM6dU9cnBlRLaEXJOnY01vqc/tn71ey5A5ypYpWnRzUBX7z8BtLk6Riammgf/Gm9fBGkY8S8N494pj+cqccis6bj94vXX44mZ4wBAdX2yLpN551WUO8ecNFE1k18YfjO1CQAo56mAaU7/pCgjBA7TaDzhmoPUJM61vYoSddz7GE2kOi3LItSyOAU4KM04DlIzOZkbPBaxLMvRjofmcz1OkrRWiU/sa0HbRgkG/3yeMjSE7g/hRrLQTh/OHtmJbRQwciFGYSYm8PPgqL0gZUmaBWMLowoq3ACShfd+QSnAAHlRz0n/qV1tJ3MN7qTjJSDFEyIqud4ryVdakC0dM5DvTAPbduBEDZa8n58BDS6jgpU0JFBdW41qMXjE4BGQhe5kUds1PT2NqJl/GJig2LqxbLE5XwXIIn4xZzEy9Ax9Bb9CvOg4uhsBtrrtWtRKSu7i3yBa3EoK7yqmq4AUkOJO/r8OpTQgs8sH03zlrabND21efYMP0fevdk6hs/+BGDwCcj3buvUASTghzn4qKSGMAwzJpOw4OJXNFo8y5jIZcz0Ih+scB5k1MznIsqgkVVw0jEYrFALS6dKHM02OsVhMr/dvOE0IsaiqVkUUpfKDz3fw5syMgoEBIBQCwmEgHgeSSftDZQwDaT2DD6kZjMViCMfeALC6jjftjMw7Hln2j/r9B36prf3+WCRylSQSQCJROPHL8YidubvbW/cMb9pQfmveDKhq5aTLFYgEg+favd6WuyXerd2t9YGh775p+CMXWPor6GbDiLe9etUTHBv77STn6YZ8mX6N/Gk3ON2tyF0/tDQOLwT8m0FX1coIgGu6PtlUVXVk4u3b/rL37x/1pFLPiWl+tGXZ3IqMoN+LPXXVHYca6l/nWnShVnQB2axJcktnTYM9jQMhxPHOTegTKxol34KpvCMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/16007/WME%20Road%20Selector%20Highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/16007/WME%20Road%20Selector%20Highlights.meta.js
// ==/UserScript==
//---------------------------
// Add option to turn off RSel Highlights (not just hide the layer) √
//   (DONE: RSel Highlights will now unregister unnecessary OL event listeners when the layer is not visible)

// DEBUG:
//RSelEP = RSelExprParser;
//rsh = {};
//---------------------------

var RSel, rsh, rsh_seg, rsh_OL, rsh_OLu,
    isFirefox = /\bfirefox\b/i.test(navigator.userAgent),
    stylesVersion = 1, zoomLevel, haltBit = false,
    userTraceBgRoads, userEditableOnly, userSuppressRoad, userFallback, userNoOverlapScaling; //roadsZIndex

const updateMessage = "Dusted off the cobwebs that have accumulated since 2020. I'm sure there's more hiding in deeper corners.";


function RSH() {
    this._clone = function(obj) {
        if (!obj) {
            return structuredClone(this);
        } else {
            return structuredClone(obj);
        }
    };

    this._seq = function(b) {
        return Array.apply(null, Array(b)).map(function(_, c) {
            return c;
        });
    };

    this._sum = function(arr) {
        return arr.reduce(function(a, b) {
            return a + b
        });
    };

    this.presets = {
        linePropObjKeys: [
            'strokeColor',
            'strokeOpacity',
            'strokeDashstyle',
            'strokeLinecap',
            'strokeWidthScale',
            'strokeDashSizeScale',
            'strokeGapScale',
        ],
        linePropIds: ['selRSHColors', 'numRSHOpacity', 'selRSHDash',
            'selRSHCap', 'numRSHScaleWidth', 'numRSHDashSizeScale',
            'numRSHGapScale'
        ],
        linePropAttrType: ['value', 'valueAsNumber', 'selectedIndex',
            'selectedIndex', 'valueAsNumber', 'valueAsNumber', 'valueAsNumber'
        ],
        lineAttributes: {
            strokeWidth: [3, 4.5, 6.5, 7.2, 8.5, 10.5, 13, 12, 12, 13, 13],
            strokeDashstyle: ["solid", "- - - - -", "– ‧ – ‧"],
            strokeDasharray: [
                ["solid"],
                [1, 1],
                [2, 1, 1, 1]
            ],
            strokeLinecap: ["butt", "round", "square"],
            underRoads: false
        },
        lineStyles: {
            Default: {
                strokeColor: "#FFFF00",
                strokeOpacity: 0.5,
                strokeDashstyle: 0,
                strokeLinecap: 0,
                strokeWidthScale: 1,
                strokeDashSizeScale: 1,
                strokeGapScale: 1
            },
            "Small Dots": {
                strokeColor: "#FFFF00",
                "strokeOpacity": 0.8,
                "strokeDashstyle": 1,
                "strokeLinecap": 1,
                "strokeWidthScale": 0.4,
                "strokeDashSizeScale": 0.1,
                "strokeGapScale": 2.4
            },
            "Large Dots": {
                strokeColor: "#FFFF00",
                "strokeOpacity": 0.5,
                "strokeDashstyle": 1,
                "strokeLinecap": 1,
                "strokeWidthScale": 1.5,
                "strokeDashSizeScale": 0.01,
                "strokeGapScale": 1.5
            },
            "Fuzzy Lines": {
                strokeColor: "#FFFF00",
                "strokeOpacity": 0.8,
                "strokeDashstyle": 1,
                "strokeLinecap": 0,
                "strokeWidthScale": 1,
                "strokeDashSizeScale": 0.1,
                "strokeGapScale": 0.1
            },
            Ticks: {
                strokeColor: "#FFFF00",
                "strokeOpacity": 0.7,
                "strokeDashstyle": 1,
                "strokeLinecap": 0,
                "strokeWidthScale": 1,
                "strokeDashSizeScale": 0.2,
                "strokeGapScale": 0.3
            }
        },
    };

    this.STYLES = this._clone(this.presets.lineStyles);

    this.getNewRuleObject = function() {
        return {
            expr: {},
            text: null,
            isValidated: null,
            tryOnce: false
        };
    };

    this.getDefaultStyleObject = function() {
        return this._clone(this.STYLES.Default);
    };

    this.HIGHLIGHTS = [{
        rule: this.getNewRuleObject(),
        style: this.getDefaultStyleObject()
    }];

    this.lastIdx = 0;
    this.idx = 0;
    this.rulesStack = [0];
    this.prevZoom = null;
    this.doNotDrawRshIdx = true;
    this.triggerUpdate = true;
    this.showSessionHighlights = false;
    this.loadedSavedSession = false;
    this.stylesVersion = 1;
    this.highlighterName = undefined;

    this.clearStoredExpression = function(idx) {
        if (!idx) idx = this.idx;
        this.HIGHLIGHTS[idx].rule = this.getNewRuleObject()
    };

    this.storeExprText = function(idx) {
        if (!idx) idx = this.idx;
        this.HIGHLIGHTS[idx].rule.text = RSel.getExpressionText(RSel.getCurrentExpression());
        this.HIGHLIGHTS[idx].rule.isValidated = null;
        this.HIGHLIGHTS[idx].rule.tryOnce = false;
    };

    this.storeCurrentExpression = function(idx) {
        var force = false;
        switch (true) {
            case idx:
                force = true;
            case !idx: //usually undefined
                idx = this.idx;
                break;
        }

        if (force || this.HIGHLIGHTS[idx].rule.isValidated === true ||
            (this.HIGHLIGHTS[idx].rule.isValidated === null && !this.doNotDrawRshIdx)) {
            var currExpr = RSel.getCurrentExpression();

            this.HIGHLIGHTS[idx].rule = {
                expr: (currExpr) ? currExpr : {},
                text: (currExpr) ? RSel.getExpressionText(currExpr) : null,
                isValidated: this.HIGHLIGHTS[idx].rule.isValidated,
                tryOnce: false //note that once saved, tryOnce is always set to false... thus, if it is true, that means it failed the second time.
            };
        } //else { console.debug('Expression parsing was invalid. Expression not stored.')}
    };

    this.validateExprText = function(idx, clearExprBox) {
        if (!idx) idx = this.idx;
        document.getElementById('outRSExpr').style.display = 'none';

        if (idx === this.idx) { //save whatever expression is active in RSel
            if (this.HIGHLIGHTS[this.idx].rule.isValidated === false) {
                if (this.HIGHLIGHTS[this.idx].rule.tryOnce === true &&
                        document.getElementById('rshExprWarn') === null) {
                    this.storeCurrentExpression(true); //force save
                }
            //} else if (!this.HIGHLIGHTS[this.idx].rule.text) {
            //    this.storeCurrentExpression();
            }
        }

        if (rsh.HIGHLIGHTS[idx].rule.text) {
            //console.debug(rsh.HIGHLIGHTS[idx].rule.text);
            RSelExprParser.updateExpression(rsh.HIGHLIGHTS[idx].rule.text);
            var currExprText = document.getElementById('outRSExpr').value;

            if (currExprText === rsh.HIGHLIGHTS[idx].rule.text) {
                this.storeCurrentExpression(idx); // update the expr obj in case it needs to be
                this.HIGHLIGHTS[idx].rule.isValidated = true;

                //$('#outRSExpr').wrap('<div id="divRSExpr" style="padding: 4px; border: 1px solid transparent;"></div>');
                //document.getElementById('outRSExpr').style.padding = '2px 0';
                //document.getElementById('outRSExpr').style.border = '1px solid transparent';
                //document.getElementById('outRSExpr').style.borderColor = '#8000FF';
            } else {
                this.HIGHLIGHTS[idx].rule.isValidated = false;
                if (!clearExprBox) {
                    document.getElementById('outRSExpr').innerHTML = '\
                    <div id="rshExprWarn" style="padding: 4px; background: repeating-linear-gradient(45deg, rgba(251,255,0,0.2), rgba(251,255,0,.2) 10px, rgba(255,224,0,0.4) 10px, rgba(255,224,0,0.4) 20px)">' +
                        document.getElementById('outRSExpr').innerHTML + '</div>' +
                        '<div style="font-size: 10px; color: crimson; font-weight: 600; outline: darkgray dotted 1px; margin-top: 5px; padding: 3px 5px;">' +
                        '<i class="fa fa-exclamation-triangle"></i> <b>RSel Highlights</b> was unable to parse the saved expression text to exactly match the original expression.' +
                        '<div style="font-size: 10px; font-weight: 600; margin-top: 4px;">' +
                        'RSH will try to use your original selection for highlighting, but it cannot be edited – only deleted. ' +
                        '<b>Please make a bug report <a href="https://www.waze.com/forum/posting.php?mode=reply&f=819&t=173107" target="_blank">here</a></b>.' +
                        '</div></div>';
                }
            }
        } // else nothing saved to validate
        if (clearExprBox) RSelExprParser.rselButtons.clear();
        document.getElementById('outRSExpr').style.display = 'block';

        return this.HIGHLIGHTS[idx].rule.isValidated;
    };

    this.recreateExpressionText = function(idx) {
        if (!idx) idx = rsh.idx;

        var exprIsValidated = this.validateExprText(idx);
        if (exprIsValidated) {
            return this.HIGHLIGHTS[idx].rule.text;
        //} else if (exprIsValidated === null) { //empty
        //    return RSel.getExpressionText(rsh.HIGHLIGHTS[idx].rule.expr);
        } else {
            this.HIGHLIGHTS[this.idx].rule.tryOnce = true; //try again
            if (this.validateExprText(idx)) { // -- this time alllowing expr save/update if no parse warning is present in DOM
                return this.HIGHLIGHTS[idx].rule.text; //new expression text
            } else if (this.HIGHLIGHTS[idx].rule.text) { //resort to using
                return RSel.getExpressionText(rsh.HIGHLIGHTS[idx].rule.expr);
            } else {
                return null;
            }
        }
    };

    this.addHighlighter = function() {
        //RSelExprParser.rselButtons.clear();

        this.idx = this.HIGHLIGHTS.length; //next index
        this.HIGHLIGHTS[this.idx] = {
            rule: this.getNewRuleObject(),
            style: this.getDefaultStyleObject()
        };
        this.lastIdx = this.idx;
        this.rulesStack[this.idx] = this.idx;
        this.triggerUpdate = true;
        this.doNotDrawRshIdx = true;
    };

    this.deleteHighlighter = function(idx) {
        if (idx === undefined) idx = this.idx;
        //RSelExprParser.rselButtons.clear();

        this.HIGHLIGHTS.splice(idx, 1);
        if (this.idx === idx) {
            ((this.idx - 1) > 0) ? this.idx-- : this.idx = 0;
        } else if (this.idx > idx) {
            this.idx--;
        }
        this.lastIdx = this.HIGHLIGHTS.length - 1;
        this.rulesStack = this._seq(this.HIGHLIGHTS.length);
        this.triggerUpdate = true;
    };

    this.importHighlights = function(addThis) {
        this.HIGHLIGHTS = addThis.HIGHLIGHTS;
        if (addThis.rulesStack && addThis.rulesStack.length)
            this.rulesStack = addThis.rulesStack;
        else this.rulesStack = this._seq(this.HIGHLIGHTS.length);

        this.lastIdx = addThis.HIGHLIGHTS.length - 1;
        this.idx = this.lastIdx;
        this.triggerUpdate = true;
        this.loadedSavedSession = true;
        this.showSessionHighlights = !!addThis.showSessionHighlights;
        this.doNotDrawRshIdx = !!addThis.doNotDrawRshIdx;
        this.highlighterName = addThis.highlighterName;
        this.HIGHLIGHTS.forEach(function(a){a.rule.tryOnce = false;})
    };

    this.addStyles = function() {
        try {
            var rshStyles = JSON.parse(localStorage.RSHighlights_Styles);

            if (rshStyles.constructor === Object) {
                if (this.stylesVersion !== stylesVersion) {
                    $.extend(true, rshStyles, this.presets.lineStyles);
                    this.STYLES = rshStyles;
                    this.stylesVersion = stylesVersion;
                    localStorage.RSHighlights_Styles = JSON.stringify(this.STYLES);
                } else {
                    this.STYLES = rshStyles;
                }
            }
        } catch (err) { /* ignore */ }
    };

    this.getCurrentExprText = RSelExprParser.getCurrentExprText;
}

//------------------------------------------------------------------------------

/*////////////////////////////////////////////////////////////////////////////*/
//
//  TODO: Organize code...convert some functions to methods and prototypes
//
function RSelHighlights() {
    var updatePrefsFromPanel = function() {
        rsh.HIGHLIGHTS[rsh.idx].style.strokeColor = document.getElementById("selRSHColors").value;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeOpacity = document.getElementById("numRSHOpacity").valueAsNumber;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeDashstyle = document.getElementById("selRSHDash").selectedIndex;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeLinecap = document.getElementById("selRSHCap").selectedIndex;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeWidthScale = document.getElementById("numRSHScaleWidth").valueAsNumber/10;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeDashSizeScale = document.getElementById("numRSHDashSizeScale").valueAsNumber/10;
        rsh.HIGHLIGHTS[rsh.idx].style.strokeGapScale = document.getElementById("numRSHGapScale").valueAsNumber/10;
        rsh.HIGHLIGHTS[rsh.idx].style.underRoads = document.getElementById('cbRSHUnderRoads').checked;
        //rsh.storeCurrentExpression();
    };

    var updateHighlighterColorButton = function() {
        // -----------------------------------------------------------------
        // Recolor background of Highlight button
        //$("#selRSHColors").val(hex).change();
        haltBit = true;
        document.getElementById('selRSHColorBtn').style.backgroundColor =
            rsh.HIGHLIGHTS[rsh.idx].style.strokeColor;
        document.getElementById('selRSHColors').value =
            rsh.HIGHLIGHTS[rsh.idx].style.strokeColor;
        haltBit = false;
    };

    var updateDashButtons = function() {
        // Check to enable or disable line option input boxes
        var dashSizeScaleObj = document.getElementById("numRSHDashSizeScale"),
            strokeGapScaleObj = document.getElementById("numRSHGapScale");

        if (rsh.HIGHLIGHTS[rsh.idx].style.strokeDashstyle !== 0) {
            dashSizeScaleObj.disabled = false;
            strokeGapScaleObj.disabled = false;
            dashSizeScaleObj.style.backgroundColor = "#FFF";
            strokeGapScaleObj.style.backgroundColor = "#FFF";
        } else {
            dashSizeScaleObj.disabled = true;
            strokeGapScaleObj.disabled = true;
            dashSizeScaleObj.style.backgroundColor = "#E0E0E0";
            strokeGapScaleObj.style.backgroundColor = "#E0E0E0";
        }
    };

    var disableEraseButton = function(disableBtn) {
        if (disableBtn === undefined) {
            disableBtn = false;
            try {
                if (!rsh.showSessionHighlights || rsh.doNotDrawRshIdx) {
                    disableBtn = true;
                } else if (rsh.HIGHLIGHTS[rsh.idx].rule.expr &&
                    Object.keys(rsh.HIGHLIGHTS[rsh.idx].rule.expr).length === 0) {
                    disableBtn = true;
                }
            } catch (err) {
                disableBtn = true;
            }
        }
        if (disableBtn) {
            $("a#btnRSHClearTop").addClass('disabled');
        } else {
            $("a#btnRSHClearTop").removeClass('disabled');
        }
    };

    var updateLayerCountButtons = function() {
        if (rsh.lastIdx !== 0) {
            $("a#btnRSHSubtract").removeClass('disabled');
            //$("a#btnRSHClearAll").removeClass('disabled')
            //disableEraseButton(false);
        } else {
            $("a#btnRSHSubtract").addClass('disabled');
            //$("a#btnRSHClearAll").addClass('disabled');
            disableEraseButton();
        }

        $("#txtRSHCount").html(rsh.idx + 1);
    };

    var updatePanelFromPrefs = function() {
        //console.debug('updatePanelFromPrefs()')
        haltBit = true;
        //rsh.storeCurrentExpression(); //update rsh obj with current expression
        // Apply panel settings from saved preferences
        //$("#selRSHColors").val(rsh.HIGHLIGHTS[rsh.idx].style.strokeColor).change();
        $("#numRSHOpacity").val(rsh.HIGHLIGHTS[rsh.idx].style.strokeOpacity).change();
        $("#selRSHDash").val(rsh.presets.lineAttributes.strokeDashstyle[rsh.HIGHLIGHTS[rsh.idx].style.strokeDashstyle]).change();
        $("#selRSHCap").val(rsh.presets.lineAttributes.strokeLinecap[rsh.HIGHLIGHTS[rsh.idx].style.strokeLinecap]).change();
        $("#numRSHScaleWidth").val(rsh.HIGHLIGHTS[rsh.idx].style.strokeWidthScale*10).change();
        $("#numRSHDashSizeScale").val(rsh.HIGHLIGHTS[rsh.idx].style.strokeDashSizeScale*10).change();
        $("#numRSHGapScale").val(rsh.HIGHLIGHTS[rsh.idx].style.strokeGapScale*10).change();
        document.getElementById('cbRSHUnderRoads').checked = rsh.HIGHLIGHTS[rsh.idx].style.underRoads;

        updateHighlighterColorButton();
        updateDashButtons();
        updateLayerCountButtons();
        haltBit = false;
    };

    // ---------------------------------------------------------------------
    var setupLineStyles = function() {
        var traceRoadColor = document.getElementById('selRSHTraceColor').value,
            numHighlights = rsh.rulesStack.length;

        updatePrefsFromPanel();

        // adjust some UI stuff for enhancing usability
        /*
        if (!!document.getElementById('selRSHighlighter').value && document.getElementById('selRSHighlighter').value !== '') {
        document.getElementById('saveRSHighlighter').style.color = "#ed503b";
        }*/


        // preset line attributes for each zoom level
        var z = 11;
        while (z--) { // for each zoom level
            rsh_seg[z] = {
                lineStyle: [],
                lineStyleOvrlp: [],
                traceLineStyle: {}
            };

            var underRoadsScaler = 0.5,
                strokeWidthAtZoom = rsh.presets.lineAttributes.strokeWidth[z],
                traceStrokeWidthAtZoom = strokeWidthAtZoom - parseInt(strokeWidthAtZoom * 0.5),
                hl, numUnderlights = 0;

            for (hl = numHighlights; hl--;) {
                if (rsh.HIGHLIGHTS[hl].style.underRoads) numUnderlights++;
            }

            hl = numHighlights;
            while (hl--) {
                if (rsh.HIGHLIGHTS[hl].style.underRoads === undefined) rsh.HIGHLIGHTS[hl].style.underRoads = false;
                else if (rsh.HIGHLIGHTS[hl].style.underRoads) numUnderlights--;

                // Stroke width (line thickness)
                var separationAmt = ((strokeWidthAtZoom) / (numHighlights-numUnderlights)).toFixed(2),
                    strokeWidthScale = (rsh.HIGHLIGHTS[hl].style.strokeWidthScale + (underRoadsScaler * rsh.HIGHLIGHTS[hl].style.underRoads * (0.4 + (z>0)*0.3 + (z>2)*0.1 + (z>6)*0.2))).toFixed(2),
                    strokeWidthAtZoomScaledOvrlp = (((strokeWidthAtZoom + 2) - ((hl - ((hl>numUnderlights-1)*numUnderlights)) * separationAmt)) * strokeWidthScale).toFixed(2),
                    strokeWidthAtZoomScaled = (strokeWidthAtZoom * strokeWidthScale).toFixed(2),
                    strokeOpacity = rsh.HIGHLIGHTS[hl].style.strokeOpacity,
                    strokeOpacityOvrlp = strokeOpacity;

                // Dash style and customized gap size
                var dashSpecs = rsh.presets.lineAttributes.strokeDasharray[rsh.HIGHLIGHTS[hl].style.strokeDashstyle],
                    dashSizeScale = rsh.HIGHLIGHTS[hl].style.strokeDashSizeScale,
                    gapScale = rsh.HIGHLIGHTS[hl].style.strokeGapScale,
                    dashSize = dashSizeScale * strokeWidthAtZoomScaled,
                    gap = gapScale * strokeWidthAtZoomScaled,
                    dashSizeOvrlp = dashSizeScale * strokeWidthAtZoomScaledOvrlp,
                    gapOvrlp = gapScale * strokeWidthAtZoomScaledOvrlp,
                    strokeDashstyle, strokeDashstyleOvrlp;

                // Make width 1 if the strokeWidth is less than 1 at this zoom
                // Also increase opacity to compensate for the small strokeWidth
                if (strokeWidthAtZoomScaled <= 1) {
                    strokeWidthAtZoomScaled = 1;
                    if (strokeOpacity < 0.9) strokeOpacity = 0.9;
                }

                // adjust strokeWidth for multiple highlights
                strokeOpacityOvrlp = rsh.HIGHLIGHTS[hl].style.strokeOpacity;
                if (strokeWidthAtZoomScaledOvrlp <= 1) {
                    strokeWidthAtZoomScaledOvrlp = 1;
                    if (strokeOpacityOvrlp < 0.9) strokeOpacityOvrlp = 0.9;
                }

                switch (rsh.HIGHLIGHTS[hl].style.strokeDashstyle) {
                    case 0:
                        strokeDashstyle = dashSpecs[0];
                        strokeDashstyleOvrlp = dashSpecs[0];
                        break;
                    case 1:
                        strokeDashstyle = dashSpecs[0] * dashSize + ' ' + dashSpecs[1] * gap;
                        strokeDashstyleOvrlp = dashSpecs[0] * dashSizeOvrlp + ' ' + dashSpecs[1] * gapOvrlp;
                        break;
                    case 2:
                        strokeDashstyle = dashSpecs[0] * dashSize + ' ' + dashSpecs[1] * gap +
                            ' ' + dashSpecs[2] * strokeWidthAtZoomScaled + ' ' + dashSpecs[3] * gap;
                        strokeDashstyleOvrlp = dashSpecs[0] * dashSizeOvrlp + ' ' + dashSpecs[1] * gapOvrlp +
                            ' ' + dashSpecs[2] * strokeWidthAtZoomScaledOvrlp + ' ' + dashSpecs[3] * gapOvrlp;
                        break;
                }

                rsh_seg[z].lineStyle[hl] = {
                    strokeColor: rsh.HIGHLIGHTS[hl].style.strokeColor,
                    strokeOpacity: strokeOpacity,
                    strokeDashstyle: strokeDashstyle,
                    strokeLinecap: rsh.presets.lineAttributes.strokeLinecap[rsh.HIGHLIGHTS[hl].style.strokeLinecap],
                    strokeWidth: strokeWidthAtZoomScaled,
                    graphicZIndex: hl + 1
                };

                if (userNoOverlapScaling) {
                    rsh_seg[z].lineStyleOvrlp[hl] = rsh_seg[z].lineStyle[hl];
                } else {
                    rsh_seg[z].lineStyleOvrlp[hl] = {
                        strokeColor: rsh_seg[z].lineStyle[hl].strokeColor,
                        strokeOpacity: strokeOpacityOvrlp,
                        strokeDashstyle: strokeDashstyleOvrlp,
                        strokeLinecap: rsh_seg[z].lineStyle[hl].strokeLinecap,
                        strokeWidth: strokeWidthAtZoomScaledOvrlp,
                        graphicZIndex: hl + 1
                    };
                }
            }

            // lineStyle for tracing/"background (bg) highlighting"
            if (traceStrokeWidthAtZoom < 1) traceStrokeWidthAtZoom = 1;

            rsh_seg[z].traceLineStyle = {
                strokeColor: traceRoadColor,
                strokeOpacity: 0.9,
                strokeWidth: traceStrokeWidthAtZoom,
                strokeLinecap: "butt",
                strokeDashstyle: "solid",
                graphicZIndex: 0
            };
        }
        rsh.triggerUpdate = false;
    };

    // ---------------------------------------------------------------------
    // Use this function if there is a chance that layers or highlighters may be set to off
    // ...this will reset them. If that is not necessary, call Highlights(optionalArg) directly instead.
    function drawHighlights(ev,optionalArg) {
        var importDraw = false;
        rsh.doNotDrawRshIdx = false;
        //console.debug(ev,optionalArg);
        if (optionalArg === 'import') {
            optionalArg = true;
            importDraw = true;
        } else {
            var currExpr = RSel.getCurrentExpression();
            if (currExpr !== null) {
                rsh.storeCurrentExpression(true); //force save
            }
            requestAnimationFrame(updateExprMenu);
        }

        if (rsh.HIGHLIGHTS.length) {
            if (optionalArg === undefined) {
                optionalArg = rsh.idx;
                rsh_OL.destroyFeaturesByMapKey(rsh.idx);
                rsh_OLu.destroyFeaturesByMapKey(rsh.idx);
            } else if (optionalArg) {
                if (optionalArg.constructor === Number) {
                    rsh_OL.destroyFeaturesByMapKey(optionalArg);
                    rsh_OLu.destroyFeaturesByMapKey(optionalArg);
                } else if (optionalArg === 'trace') {
                    rsh_OL.destroyFeaturesByMapKey('trace');
                }
            }

            if (rsh.HIGHLIGHTS[rsh.idx].rule.expr &&
                Object.keys(rsh.HIGHLIGHTS[rsh.idx].rule.expr).length === 0) {
                rsh.doNotDrawRshIdx = true;
            } else if (importDraw &&
                rsh.HIGHLIGHTS[rsh.idx].rule.isValidated === false &&
                rsh.HIGHLIGHTS[rsh.idx].rule.tryOnce === true) {
                if (document.getElementById('rshExprWarn') === null)
                    RSelExprParser.rselButtons.clear();
            }

            rsh.showSessionHighlights = true;
            rsh_OL.setVisibility(true);
            rsh_OLu.setVisibility(true);

            disableEraseButton(false);
            //console.info(optionalArg);
            requestAnimationFrame(function() {
                Highlight(optionalArg); //if rsh.triggerUpdate, this will also be assoc with an expr save
                sessionStorage.RSHighlights = JSON.stringify(rsh);
            });
        }
    }

    var eraseHighlight = function(idx) {
        if (idx === undefined || (idx && idx.target)) idx = rsh.idx;
        rsh.doNotDrawRshIdx = true;
        rsh.clearStoredExpression();

        if (!rsh.HIGHLIGHTS[idx].style.underRoads)
            rsh_OL.destroyFeaturesByMapKey(idx);
        else rsh_OLu.destroyFeaturesByMapKey(idx);

        updateExprMenu();
        requestAnimationFrame(Highlight);
        disableEraseButton(true);
    }

    function clearAllHighlights() {
        var confirmDelete = confirm("Are you sure you want to clear all highlighting rules?");
        if (confirmDelete) {
            //RSelExprParser.rselButtons.clear();
            rsh = new RSH();
            rsh.triggerUpdate = true;
            rsh.doNotDrawRshIdx = true;
            rsh_OL.destroyAllFeatureMaps();
            rsh_OLu.destroyAllFeatureMaps();
            rsh_OL.setVisibility(false);
            rsh_OLu.setVisibility(false);

            updatePanelFromPrefs();
            updateExprMenu(); //reset expressions menu -- also updates panel with settings from rsh.HIGHLIGHTS[].style
            setupLineStyles(); //reset line attributes saved in rsh.HIGHLIGHTS[].style

            sessionStorage.RSHighlights = null;
        }
    }

    // ---------------------------------------------------------------------
    function addNewHighlighter() {
        var currExpr = RSel.getCurrentExpression(),
            clearExpr = false;

        if (document.getElementById('rshExprWarn')) clearExpr = true;

        if (rsh.HIGHLIGHTS[rsh.idx].rule.text === null || rsh.HIGHLIGHTS[rsh.idx].rule.text.length === 0) {
            // add rule to current empty index and then adds a new index
            if (currExpr !== null) {
                drawHighlights([],rsh.idx)
                rsh.addHighlighter();
                rsh.doNotDrawRshIdx = true;
                updateExprMenu(); // -- also updates panel with settings from rsh.HIGHLIGHTS[].style
                sessionStorage.RSHighlights = JSON.stringify(rsh);
                if (clearExpr) RSelExprParser.rselButtons.clear();
            }
        } else {
            // adds an empty index and then stores the current selection rule into new index if currExpr is not empty
            rsh.addHighlighter();
            rsh.doNotDrawRshIdx = true;
            //rsh.storeCurrentExpression(true);
            updateExprMenu(); // -- also updates panel with settings from rsh.HIGHLIGHTS[].style
            sessionStorage.RSHighlights = JSON.stringify(rsh);
            if (clearExpr) RSelExprParser.rselButtons.clear();
        }
    }

    var deleteHighlighter = function(idx) {
        if (idx === undefined || (idx && idx.target)) idx = rsh.idx;
        if (rsh.lastIdx > 0) {
            //var confirmDelete = confirm("Are you sure you want to delete the selected highlighter?");
            //if (confirmDelete) {
                if (rsh.HIGHLIGHTS[idx].style && rsh.HIGHLIGHTS[idx].style.underRoads)
                    rsh_OLu.destroyFeaturesByMapKey(idx);
                else rsh_OL.destroyFeaturesByMapKey(idx);

                rsh.deleteHighlighter(idx);
                //updatePanelFromPrefs();
                updateExprMenu(true); // -- also updates panel with settings from rsh.HIGHLIGHTS[].style

                sessionStorage.RSHighlights = JSON.stringify(rsh);
            //}
        } else {
            eraseHighlight(idx);
        }
    };

    var exportRSelHighlighter = function(ev, str) {
        var rsh_saved, highlighterName, htmlStr, msgStr, uniqueName, style, idx, node;

        if (str === undefined) {
            rsh_saved = JSON.parse(localStorage.RSHighlights);
            highlighterName = document.getElementById("selRSHighlighter").value;
            exportStr = '{"' + highlighterName + '":' + JSON.stringify(rsh_saved[highlighterName]).replace(/("#[\w\d]{6})\s?/ig, '$1') + '}';
            style = 'position: absolute; bottom: 110%; width: 100px; left: -44px;';

            if (ev.target.classList.contains('rsh-btn2')) node = ev.target;
            else node = ev.target.parentNode;
        } else {
            if (ev && ev.target) {
                idx = parseInt(ev.target.parentNode.parentNode.getAttribute('value'));
                node = ev.target;
            }

            var dateName = new Date(),
                hrs = (dateName.getHours().length===1)? '0'+dateName.getHours() : dateName.getHours(),
                mins = (dateName.getMinutes().length===1)? '0'+dateName.getMinutes() : dateName.getMinutes(),
                secs = (dateName.getSeconds().length===1)? '0'+dateName.getSeconds() : dateName.getSeconds(),
                d = 'Highlight ' + dateName.getFullYear()+ '-' + dateName.getMonth()+ '-' + dateName.getDate() + ' ' + hrs + ':' + mins + ':' + secs;

            highlighterName = prompt('Please provide a unique name for the highlighter', d);
            if (highlighterName !== null) {
                exportStr = '{"' + highlighterName + '":{"HIGHLIGHTS":[' + JSON.stringify(rsh.HIGHLIGHTS[idx]).replace(/("#[\w\d]{6})\s?/ig, '$1') + ']}}';
                rsh_saved = {};
                rsh_saved[highlighterName] = true;
                style = 'position: absolute; width: 200px; bottom: 0; left: 20px;';
            }
        }

        if (rsh_saved[highlighterName]) {
            htmlStr = '<div id="rshMenuNote" style="' + style + '">';
            msgStr = '"' + highlighterName + '" was copied to clipboard';
            copyToClipboard(exportStr);
        } else {
            htmlStr = '<div id="rshMenuNote" style="' + style + '">';
            msgStr = "Select a highlighter to export";
            document.getElementById('selRSHighlighter').style.border = '1px solid #2196F3';
        }

        setTimeout(function() {
            $(node).append(htmlStr + msgStr + '</div>');
            document.getElementById('rshMenuNote').onclick = function(e){e.stopPropagation(); this.remove()};
        }, 300);
        setTimeout(function() {
            $('#rshMenuNote').remove()
        }, 5000);
    };

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    var findNodeIndex = function(attr, val) {
        for (var i = 0, iLength = this.length; i < iLength; i++) {
            if (this[i].querySelector('[' + attr + '="' + String(val) + '"]')) return i;
        }
        return null;
    };

    var dragEndExpr = function(ev) {
        //$(this.children).each(function(i,node){node.style.opacity = 1;});
        //console.debug('DragEnd:',ev.target)

        $('div.rsh-expr-item').css('opacity', '');
        $('div.rsh-expr-item').prop('draggable', false);
        $('.rsh-expr-menu').css('pointer-events', 'auto');
        $('.rsh-expr-menu').removeClass('rsh-dragging');
        $('div.rsh-expr-item').removeClass('rsh-drag');
        //$('.rsh-expr-dragicn').each(function(i,node){node.style.pointerEvents = 'auto';});
        //$('div.rsh-expr-item').each(function(i,node){node.removeEventListener('dragstart',dragStartExpr,false)});
        $('.rsh-expr-text').each(function(i, node) {
            node.removeEventListener('dragover', allowDropExpr, false);
        });
        $('.rsh-expr-text').each(function(i, node) {
            node.removeEventListener('dragenter', dragEnterExpr, false);
        });
        $('div.rsh-expr-item').each(function(i, node) {
            node.removeEventListener('drop', dropExpr, false);
        });
        $('div.rsh-expr-item').each(function(i, node) {
            node.removeEventListener('dragend', dragEndExpr, false);
        });
        window.removeEventListener('mouseup', dragEndExpr, false);
    };

    var dropExpr = function(ev) {
        //console.debug('Drop:',this);

        if (ev.preventDefault()) ev.preventDefault();
        //ev.stopPropagation();

        var exprListEl = document.getElementsByClassName('rsh-expr-menu')[0],
            draggedExprID = ev.dataTransfer.getData('text'),
            draggedExprEl = document.querySelector('.rsh-expr-item[value="' + draggedExprID + '"]').parentNode,
            targetExprID = this.getAttribute('value'),
            refNode = exprListEl.childNodes[findNodeIndex.call(exprListEl.childNodes, 'value', targetExprID)];

        exprListEl.insertBefore(draggedExprEl, refNode);
        exprListEl.insertBefore(refNode, draggedExprEl);

        //$('.rsh-expr-item:not([value="' + draggedExprID + '"]>.rsh-expr-text)').each(function(i,node){node.removeEventListener('drop',dropExpr,false)});

        var draggedExprIdx = parseInt(draggedExprID),
            targetExprIdx = parseInt(targetExprID),
            shiftIdx = 0,
            rulesLength = rsh.rulesStack.length,
            rulesIndex = rsh._seq(rulesLength);


        if ((draggedExprIdx !== targetExprIdx) && (draggedExprIdx + 1 !== targetExprIdx)) {
            //console.debug('Expression inserted at position',targetExprIdx);
            var draggedExpr = rsh.HIGHLIGHTS[draggedExprIdx];

            if (targetExprIdx !== 100) {
                if (draggedExprIdx > targetExprIdx) shiftIdx = 1; //moved to earlier pos in array

                rsh.HIGHLIGHTS.splice(targetExprIdx, 0, draggedExpr); //inert expression after target position
                rsh.HIGHLIGHTS.splice(draggedExprIdx + shiftIdx, 1); //remove expression from previous position
                rulesIndex.splice(targetExprIdx, 0, draggedExprIdx);
                rulesIndex.splice(draggedExprIdx + shiftIdx, 1);
                rsh.rulesStack.splice(targetExprIdx, 0, draggedExprIdx);
                rsh.rulesStack.splice(draggedExprIdx + shiftIdx, 1);
            } else {
                rsh.HIGHLIGHTS.push(draggedExpr);
                rsh.HIGHLIGHTS.splice(draggedExprIdx, 1); //remove expression from previous position
                rulesIndex.push(draggedExprIdx);
                rulesIndex.splice(draggedExprIdx, 1);
                rsh.rulesStack.push(draggedExprIdx);
                rsh.rulesStack.splice(draggedExprIdx, 1);
            }

            rsh.idx = rulesIndex.findIndex(function(r) {
                if (r === rsh.idx) return true;
            });
            rsh.rulesStack = rsh.rulesStack.map(function(a, i) {
                return (a[i] !== false) ? i : false;
            });
            document.getElementById('btnRSHmenu').click(); //fix this... why separate eventlisteners?
            document.getElementById('btnRSHCount').click(); //fix this... why separate eventlisteners?
            rsh.triggerUpdate = true;
            requestAnimationFrame(function() {
                Highlight(true);
            });
        } else {
            console.debug('Not inserted after expression', targetExprID);
        }
    };

    var allowDropExpr = function(ev) {
        if (ev.preventDefault()) ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        return false;
    };

    var dragEnterExpr = function(ev) {
        //console.debug('DragEnter:',ev.target);
        $('div.rsh-expr-item:not([value="' + this.parentNode.value + '"])').removeClass('rsh-drag');
        this.parentNode.classList.add('rsh-drag');
    };

    var dragStartExpr = function(ev) {
        //console.debug('DragStart:',this);

        var draggedExprID = this.getAttribute('value');
        //console.debug('Dragging expression',parseInt(draggedExprID)+1);

        ev.dataTransfer.setData('text', draggedExprID);
        $('div.rsh-expr-item:not([value="' + draggedExprID + '"]>.rsh-expr-text)').each(function(i, node) {
            node.addEventListener('drop', dropExpr, false);
        });
        $('.rsh-expr-menu').css('pointer-events', 'none');
        $('.rsh-expr-menu').addClass('rsh-dragging');
        //$('.rsh-expr-dragicn').each(function(i,node){node.style.pointerEvents = 'none';});
        //$(this.children).each(function(i,node){node.style.opacity = 0.2;});
        this.style.opacity = 0.4;
    };

    function updateExprMenu(doExpr) {
        //console.debug('updateExprMenu()')
        // Dropup menu for selecting layers
        var e = rsh.HIGHLIGHTS.length,
            htmlText = '<li class="rsh-hidden"><div value="100" class="rsh-expr-item"><span class="rsh-expr-text"></span></div></li>',
            exprText, selStatus, showExpr;

        while (e-- > 0) {
            if (e === rsh.idx) {
                selStatus = ' active';
                if (doExpr) exprText = rsh.recreateExpressionText(e);
                else exprText = RSel.getExpressionText(rsh.HIGHLIGHTS[e].rule.expr);
            } else {
                selStatus = '';
                exprText = RSel.getExpressionText(rsh.HIGHLIGHTS[e].rule.expr);
            }
            if (!exprText) {
                exprText = '&nbsp;';
                //if (e === rsh.idx) RSelExprParser.rselButtons.clear();
            } else {
                showExpr = (rsh.rulesStack[e] !== false) ? 'fa-eye' : 'fa-eye-slash';
                exprText = '<i title="Export highlighter" class="rsh-expr-export fa fa-share-square-o fa-fw"></i>' +
                            '<i title="Hide/Show" class="rsh-expr-hide fa ' + showExpr + '"></i>' +
                            exprText;
            }

            htmlText += '<li><div value="' + e + '" ' +
                'class = "rsh-expr-item' + selStatus + '">' +
                '<span class="rsh-expr-del fa fa-times"></span><span class="fa fa-square rsh-expr-color fa-pull-left" style="color:' +
                rsh.HIGHLIGHTS[e].style.strokeColor + '"></span>' +
                '<span class="rsh-expr-text">' + exprText +
                '<span class="rsh-expr-spacer"></span></span>' +
                '<span class="rsh-expr-dragicn"><i class="fa fa-ellipsis-v" style="padding: 1px;"></i><i class="fa fa-ellipsis-v"></i></span>' +
                '</div></li>';
        }

        $(".rsh-expr-menu").html(htmlText);
        requestAnimationFrame(updatePanelFromPrefs);

        //------
        if (rsh.HIGHLIGHTS[rsh.idx].rule.expr &&
            Object.keys(rsh.HIGHLIGHTS[rsh.idx].rule.expr).length === 0)
            rsh.doNotDrawRshIdx = true;
        else rsh.doNotDrawRshIdx = false;

        $('div.rsh-expr-item').click(function(e) {
            if (rsh.triggerUpdate) Highlight(); //do not make async
            rsh.idx = parseInt(this.getAttribute('value'));
            //console.debug(this); console.debug(e);
            updateExprMenu(true); //updates expression in RSel as well as saves it in a highlighter slot
            disableEraseButton();
            //if (!rsh.HIGHLIGHTS[rsh.idx].rule.text) RSelExprParser.rselButtons.clear();
        });

        $('.rsh-expr-export').click(function(e) {
            e.stopPropagation();
            exportRSelHighlighter(e, true);
        });

        $('.rsh-expr-hide').click(function(e) {
            e.stopPropagation();
            var idx = parseInt(this.parentNode.parentNode.getAttribute('value'));
            if (rsh.rulesStack[idx] === false) {
                rsh.rulesStack[idx] = idx;
                requestAnimationFrame(Highlight);
            } else {
                rsh.rulesStack[idx] = false;
                rsh_OL.destroyFeaturesByMapKey(idx);
                rsh_OLu.destroyFeaturesByMapKey(idx);
            }
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

        $('.rsh-expr-del').click(function(e) {
            e.stopPropagation();
            //console.debug(this);
            var idx = parseInt(this.parentNode.getAttribute('value'));
            deleteHighlighter(idx)
            setTimeout(function(){
                document.getElementById('btnRSHCount').click();
            }, 14);
        });

        $('div.rsh-expr-item').each(function(i, node) {
            node.addEventListener('dragstart', dragStartExpr, false)
        });
        $('.rsh-expr-dragicn').each(function(i, node) {
            node.addEventListener('mousedown', function(e) {
                //console.debug('hi');
                e.stopPropagation();
                $('div.rsh-expr-item').prop('draggable', true);
                $('.rsh-expr-text').each(function(i, node) {
                    node.addEventListener('dragover', allowDropExpr, false)
                });
                $('.rsh-expr-text').each(function(i, node) {
                    node.addEventListener('dragenter', dragEnterExpr, false)
                });
                $('div.rsh-expr-item').each(function(i, node) {
                    node.addEventListener('dragend', dragEndExpr, false)
                });
                window.addEventListener('mouseup', dragEndExpr, false);
            }, false)
        });
    }


    // -----------------------------------------------------------------------------
    var toggleDropBarMenu = function(hide) {
        var dropbarPanel = document.getElementById("divRSHdropbarPanel"),
            dropbarHeader = document.getElementById("divRSHdropbarHeader"),
            dropbarContents = document.getElementById("divRSHdropbarContents"),
            mainPanel = document.getElementById("divRSHmainPanel");

        if (hide) {
            mainPanel.style.borderBottomLeftRadius = "5px";
            mainPanel.style.borderBottomRightRadius = "5px";
            dropbarPanel.style.borderWidth = 0;
            //dropbarPanel.style.backgroundColor = "transparent";
            dropbarHeader.style.backgroundColor = "transparent";
            dropbarHeader.style.bottomBorderWidth = 0;
            document.getElementById('aRSHdropbarLinkShow').style.display = 'inline-block';
            document.getElementById('aRSHdropbarLinkHide').style.display = 'none';
            $('div.rsh-styles-menu').css('display', 'none');
            dropbarContents.style.display = "none";
        } else {
            mainPanel.style.borderBottomLeftRadius = 0;
            mainPanel.style.borderBottomRightRadius = 0;
            dropbarPanel.style.borderWidth = "2px";
            //dropbarPanel.style.backgroundColor = "#F9F9F9";
            dropbarHeader.style.backgroundColor = "#DAEBF1";
            dropbarHeader.style.bottomBorderWidth = "1px";
            document.getElementById('aRSHdropbarLinkShow').style.display = 'none';
            document.getElementById('aRSHdropbarLinkHide').style.display = 'inline-block';
            $('div.rsh-styles-menu').css('display', 'inline-block');
            dropbarContents.style.display = "block";
        }
    };

    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------
    function Highlight(optionalArg) {
        var checkAllSegs = false,
            redrawFeats = false,
            recheckRules = false, //Note: for both recheck and redraw, remove the featureMapping...
            lineStylesUpdate = rsh.triggerUpdate;

        if (rsh_OL.visibility) {
            if (lineStylesUpdate) {
                setupLineStyles();
                //rsh_OL.destroyFeaturesByMapKey(rsh.idx);
                //checkAllSegs = true;
            } //      Pass Boolean true or rsh.idx. TODO: Allow specifying rsh.idx

            var currentZoom = W.map.getZoom()-12;
            if (currentZoom < 0) return;
            var lineStyle = rsh._clone(rsh_seg[currentZoom].lineStyle),
                lineStyleOvrlp = rsh_seg[currentZoom].lineStyleOvrlp,
                traceLineStyle = rsh_seg[currentZoom].traceLineStyle,
                segments = W.model.segments.objects, //***********
                ids = Object.keys(segments),
                highlighterRuleIndexes,
                newFeatureArray = [], newFeatureArrayu = [],
                newTraceFeatureArray = [],
                delFeatureArray = [], delFeatureArrayu = [],
                seg, highlightIsTrue, countHighlighted, redraw, featureExists;

            if (rsh.doNotDrawRshIdx) {
                if (userSuppressRoad) optionalArg = true; //must redraw because highlight style with this setting enabled might change depending on which highlight rules are active
                highlighterRuleIndexes = rsh.rulesStack.filter(function(a) {
                    return (a !== false || a !== rsh.idx)
                });
                rsh_OL.destroyFeaturesByMapKey(rsh.id);
                rsh_OLu.destroyFeaturesByMapKey(rsh.idx);
            } else {
                 highlighterRuleIndexes = rsh.rulesStack.filter(function(a) {
                    return (a !== false)
                });
            }

            if (!userTraceBgRoads)
                requestAnimationFrame(function() {
                    rsh_OL.destroyFeaturesByMapKey('trace')
                });

            if (optionalArg === true) { //rechecks and redraws everything
                rsh_OL.destroyAllFeatureMaps();
                rsh_OLu.destroyAllFeatureMaps();
                //console.debug('Reset requested: rsh_OL.destroyAllFeatureMaps();')
            } else {
                if (zoomLevel !== currentZoom) {
                    redrawFeats = highlighterRuleIndexes.map(function(a) {return a});
                    rsh_OL.destroyFeatures();
                    rsh_OLu.destroyFeatures();
                }

                if (optionalArg === null) { //checks all available segs – not just the ones on-screen, but does not recheck rules nor redraws
                    checkAllSegs = true;
                } else if (optionalArg === 'd') { //does not recheck rules, but redraws all already existing highlights
                    redrawFeats = highlighterRuleIndexes.map(function(a) {return a});
                     //  (e.g., for line style changes, changes to seg geometry, ZOOM CHANGES)
                    rsh_OL.destroyFeatures(); //---destroy all features, but don't remove featureMapping
                    rsh_OLu.destroyFeatures();
                } else if (optionalArg === 'a') { //recheck all the rules, but does not redraw if no assignment change
                    recheckRules = true; //  (e.g., for rule changes or changes to seg properties other than geometry & style)
                    checkAllSegs = true;
                } else if (optionalArg &&
                    optionalArg.constructor === Number &&
                    rsh.rulesStack.includes(optionalArg)) { //recheck and redraw all for specified rsh.idx

                    //if (lineStylesUpdate) {
                    if (!redrawFeats) redrawFeats = highlighterRuleIndexes.map(function() {
                        return optionalArg
                    });
                    checkAllSegs = true;
                    //} else {
                    rsh_OL.destroyFeaturesByMapKey(optionalArg);
                    rsh_OLu.destroyFeaturesByMapKey(optionalArg);
                    if (userTraceBgRoads) rsh_OL.destroyFeaturesByMapKey('trace');
                    //}
                } else if (lineStylesUpdate) {
                    if (!redrawFeats) redrawFeats = highlighterRuleIndexes.map(function() {
                        return rsh.idx
                    });
                    checkAllSegs = true;
                    rsh_OL.destroyFeaturesByMapKey(rsh.idx);
                    rsh_OLu.destroyFeaturesByMapKey(rsh.idx);
                    if (userTraceBgRoads) rsh_OL.destroyFeaturesByMapKey('trace');
                }
            }

            if (!redrawFeats) redrawFeats = highlighterRuleIndexes.map(function() {
                return false
            });

            //Define separate objects to store features for each highlight rule
            highlighterRuleIndexes.map(function(h) {
                if (rsh_OL._featureMap[String(h)] === undefined) rsh_OL._featureMap[String(h)] = {}
                if (rsh_OLu._featureMap[String(h)] === undefined) rsh_OLu._featureMap[String(h)] = {}
            });

            var s = ids.length,
                h, H;
            while (s--) {
                if (checkAllSegs || rsh_OL.isOnScreen(ids[s])) { //only care about onscreen segments
                    seg = segments[ids[s]]; //segments.get(ids[s]),

                    countHighlighted = 0;
                    for (h of highlighterRuleIndexes) {
                        if (Object.keys(rsh.HIGHLIGHTS[h].rule.expr).length === 0) {
                            rsh_OL.destroyFeaturesByMapKey(h);
                            rsh_OLu.destroyFeaturesByMapKey(h);
                            redraw = redrawFeats.shift();
                            break;
                        }

                        redraw = redrawFeats.shift();
                        H = String(h);

                        if (!rsh.HIGHLIGHTS[h].style.underRoads) {

                            if (rsh_OL._featureMap[H][ids[s]]) {
                                highlightIsTrue = rsh_OL._featureMap[H][ids[s]].highlight;
                                //featureExists = (rsh_OL._featureMap[H][ids[s]].feature) ? true : false;
                                featureExists = (rsh_OL._featureMap[H][ids[s]].feature && rsh_OL._featureMap[H][ids[s]].feature.id) ? true : false;
                            } else {
                                highlightIsTrue = undefined;
                                featureExists = false;
                            }
                            try {
                                if (highlightIsTrue === undefined) { //if highlight feature has not been drawn nor checked or everything was destroyed...
                                    if ((!userEditableOnly || seg.arePropertiesEditable()) &&
                                        RSel.checkSegment(rsh.HIGHLIGHTS[h].rule.expr, seg)) { //test against selection criteria
                                        countHighlighted++;

                                        if (countHighlighted === 1) {
                                            newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyle[h], h, countHighlighted * userSuppressRoad));
                                        } else {
                                            newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyleOvrlp[h], h));
                                        }
                                    } else {
                                        rsh_OL._featureMap[H][ids[s]] = {
                                            highlight: false
                                        };
                                    }

                                } else if (recheckRules) { //just the rules need to be rechecked
                                    if ((!userEditableOnly || seg.arePropertiesEditable()) &&
                                        RSel.checkSegment(rsh.HIGHLIGHTS[h].rule.expr, seg)) { //test against selection criteria
                                        countHighlighted++;
                                        if (!featureExists) { //wasn't highlighted or feature has been destroyed, but now passes rule...
                                            if (countHighlighted === 1) {
                                                newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyle[h], h, countHighlighted * userSuppressRoad));
                                            } else {
                                                newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyleOvrlp[h], h));
                                            }
                                        }
                                    } else { //seg fails selection criteria,
                                        //but it is still drawn...
                                        if (highlightIsTrue) delFeatureArray.push(rsh_OL._featureMap[H][ids[s]].feature);
                                        //delFeatureArray.concat(rsh_OL.getFeaturesByAttribute('rshID', 'h'+h+'-'+ids[s])); //flag it for removal
                                    } //TODO: add in 'false' assignment to highlight property

                                } else if (highlightIsTrue) {
                                    countHighlighted++;

                                    if (redraw === h || !featureExists) { //feature has been deleted by OL
                                        //if (!featureExists) {
                                        if (countHighlighted === 1) {
                                            newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyle[h], h, countHighlighted * userSuppressRoad));
                                        } else {
                                            newFeatureArray.push(rsh_OL.createLineFeature(seg, lineStyleOvrlp[h], h));
                                        }
                                        //}

                                        //if (featureExists) { //redraw all previously highlighted segs...
                                        //delFeatureArray.concat(rsh_OL.getFeaturesByAttribute('rshID', 'h'+h+'-'+ids[s])); //flag it for removal
                                        //    delFeatureArray.push(rsh_OL._featureMap[H][ids[s]].feature);
                                        //}
                                            /*if (countHighlighted === 1) { //TODO: Optimize this later...
                                                rsh_OL.redrawLineFeature(rsh_OL._featureMap[H][ids[s]].feature, lineStyle[h], countHighlighted * userSuppressRoad);
                                            } else {
                                                rsh_OL.redrawLineFeature(rsh_OL._featureMap[H][ids[s]].feature, lineStyleOvrlp[h]);
                                            }
                                        }*/
                                    }
                                }
                            } catch (err) {}
                        } else {
                            if (rsh_OLu._featureMap[H][ids[s]]) {
                                highlightIsTrue = rsh_OLu._featureMap[H][ids[s]].highlight;
                                //featureExists = (rsh_OL._featureMap[H][ids[s]].feature) ? true : false;
                                featureExists = (rsh_OLu._featureMap[H][ids[s]].feature && rsh_OLu._featureMap[H][ids[s]].feature.id) ? true : false;
                            } else {
                                highlightIsTrue = undefined;
                                featureExists = false;
                            }
                            try {
                                if (highlightIsTrue === undefined) { //if highlight feature has not been drawn nor checked or everything was destroyed...
                                    if ((!userEditableOnly || seg.arePropertiesEditable()) &&
                                        RSel.checkSegment(rsh.HIGHLIGHTS[h].rule.expr, seg)) { //test against selection criteria
                                        countHighlighted++;
                                        newFeatureArrayu.push(rsh_OLu.createLineFeature(seg, lineStyle[h], h));
                                    } else {
                                        rsh_OLu._featureMap[H][ids[s]] = {
                                            highlight: false
                                        };
                                    }
                                } else if (recheckRules) { //just the rules need to be rechecked
                                    if ((!userEditableOnly || seg.arePropertiesEditable()) &&
                                        RSel.checkSegment(rsh.HIGHLIGHTS[h].rule.expr, seg)) { //test against selection criteria
                                        countHighlighted++;
                                        if (!featureExists) newFeatureArrayu.push(rsh_OLu.createLineFeature(seg, lineStyle[h], h));
                                    } else { //seg fails selection criteria,
                                        //but it is still drawn...
                                        if (highlightIsTrue) delFeatureArrayu.push(rsh_OLu._featureMap[H][ids[s]].feature);
                                    } //TODO: add in 'false' assignment to highlight property
                                } else if (highlightIsTrue) {
                                    countHighlighted++;
                                    if (redraw === h || !featureExists) newFeatureArrayu.push(rsh_OLu.createLineFeature(seg, lineStyle[h], h));
                                }
                            } catch (err) {}
                        }
                    }
                    // TODO: add a feature changed check and redraw rather than destroy+draw
                    //--------------------------------------------------------------------------------------
                    // Check if script should highlight "background roads" (i.e., roads that don't meet any of the other highlight criteria)
                    if (userTraceBgRoads) {
                        if (rsh_OL._featureMap.trace[ids[s]]) {
                            //highlightIsTrue = rsh_OL._featureMap.trace[ids[s]].highlight;
                            featureExists = (rsh_OL._featureMap.trace[ids[s]].feature && rsh_OL._featureMap.trace[ids[s]].feature.id);
                        } else {
                            //highlightIsTrue = undefined;
                            featureExists = false;
                        }

                        if (countHighlighted === 0 && (!featureExists || redraw===true)) {
                            newTraceFeatureArray.push(rsh_OL.createLineFeature(seg, traceLineStyle, 'trace'));
                        } else if (countHighlighted !== 0 && featureExists) {
                            requestAnimationFrame(function() {
                                rsh_OL.destroyFeaturesBy('id', parseInt(ids[s]))
                            });
                        }
                    } //------------------------------------------------------------------------------------
                } //isOnScreen
            } //while
            rsh_OL.destroyFeatureArray(delFeatureArray);
            rsh_OLu.destroyFeatureArray(delFeatureArrayu);

            if (newTraceFeatureArray.length) //requestAnimationFrame(function() {
                rsh_OL.addFeatures(newTraceFeatureArray);
            //});

            if (newFeatureArray.length) rsh_OL.addFeatures(newFeatureArray);
            if (newFeatureArrayu.length) rsh_OLu.addFeatures(newFeatureArrayu);

            if (userFallback) rsh_OLu.setZIndex(W.map.roadLayers[0].getZIndex()-1);

            //----------------------------------------------------------------------------------------------
            // Check if time to perform cleanup
            var H;
            for (h of highlighterRuleIndexes) {
                H = String(h);
                if (rsh_OL._featureMap[H] && Object.keys(rsh_OL._featureMap[H]).length > 10000) rsh_OL.cleanupFeatureMap(H);
                if (rsh_OLu._featureMap[H] && Object.keys(rsh_OLu._featureMap[H]).length > 10000) rsh_OLu.cleanupFeatureMap(H);

            }
            if (Object.keys(rsh_OL._featureMap.trace).length > 10000) rsh_OL.cleanupFeatureMap('trace');

            zoomLevel = currentZoom;

        } else {
            rsh.showSessionHighlights = false;
        }
    }

    // -----------------------------------------------------------------------------

    var addStuffToLayerObject = function(layer) {
        layer._clone = rsh._clone;

        layer._getFeatureMapCounts = function() {
            var fTotal, fKey, idCounter, id;

            for (fKey in this._featureMap) {
                fTotal = Object.keys(this._featureMap[fKey]).length;
                console.debug('# of unique segs logged in _featureMap["' + fKey + '"] =', fTotal);
                idCounter = 0;
                for (id in this._featureMap[fKey]) {
                    if (this._featureMap[fKey][id].feature && this._featureMap[fKey][id].feature.id) idCounter++;
                }
                console.debug('# of drawn highlights on map from _featureMap["' + fKey + '"] =', idCounter);
            }
            console.debug('Total segments in data extent =', W.map.segmentLayer.features.length);
            console.debug('OL features array length =', this.features.length);
        };

        layer.redrawLineFeature = function(feature, lineOptions, stack) {
            if (stack === undefined) { /* do nothing */ } else if (stack === 1) {
                lineOptions.strokeOpacity = 0.9;
            }
            this.drawFeature(feature, lineOptions);
        };

        layer.createLineFeature = function(seg, lineOptions, rshIndex, stack) {
            var segID = parseInt(seg.attributes.id),
                vertices = seg.getOLGeometry().components,
                rshID = 'h' + rshIndex + '-' + segID,
                feature;

            if (stack === undefined) { /* do nothing */ } else if (stack === 1) {
                lineOptions.strokeOpacity = 0.9;
            }
            //this._featureMap[String(rshIndex)][segID] = { highlight: true, bounds: seg.getOLGeometry().bounds};
            feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(vertices), {
                id: segID,
                rshIndex: rshIndex,
                rshID: rshID,
                stack: stack
            }, lineOptions);
            //this._featureMap[String(rshIndex)][segID] = { highlight: true, bounds: feature.attributes.geometry.bounds};
            //this._featureMap[String(rshIndex)][segID] = { highlight: true, feature: {attributes: {geometry: {bounds: feature.attributes.geometry.bounds}}}};
            this._featureMap[String(rshIndex)][String(segID)] = {
                highlight: true,
                feature: feature
            };
            return feature;
        };

        layer.unsetFeatureMappings = function(featArray) {
            //var numRemoved = 0;
            try {
                featArray.map(function(a, i) {
                    //numRemoved++;
                    this._featureMap[String(a.attributes.rshIndex)][String(a.attributes.id)] = undefined;
                });
            } catch (err) {}
            //console.info('WMERSH:','Feature(s) unmapped =',numRemoved);
        };

        layer.destroyFeatureArray = function(featArray) {
            if (featArray.length) {
                this.destroyFeatures(featArray);
                this.unsetFeatureMappings(featArray);
            }
        };

        layer.destroyFeaturesBy = function(attrName, attrVal) {
            var destroyThese = this.getFeaturesByAttribute(attrName, attrVal);
            this.destroyFeatureArray(destroyThese);
        };

        layer.destroyFeaturesByMapKey = function(featMapKey) {
            var destroyThese;
            if (featMapKey === undefined) featMapKey = rsh.idx;
            if (featMapKey === 'trace') destroyThese = this.getFeaturesByAttribute('rshIndex', 'trace');
            else destroyThese = this.getFeaturesByAttribute('rshIndex', parseInt(featMapKey));

            if (destroyThese.length) {
                this._featureMap[String(featMapKey)] = {};
                this.destroyFeatures(destroyThese);
            }
        };

        layer.destroyAllFeatureMaps = function() {
            this.destroyFeatures();
            this._featureMap = {
                trace: {}
            };
        };

        layer.cleanupFeatureMap = function(featMapKey) {
            if (featMapKey === undefined) featMapKey = String(rsh.idx);
            console.debug('cleanupFeatureMap("' + featMapKey + '")');
            requestAnimationFrame(function() {
                //calculate current active bounds at same scale
                var currentCenter = W.map.getCenter(), //lon-lat
                    scalingFactor = W.map.getOLMap().getResolutionForZoom(3), //OpenLayers.Util.getScaleFromResolution(W.map.getResolutionForZoom(zoomOfDataExtent), W.map.baseLayer.units),
                    newDataBounds = W.map.getExtent().scale(scalingFactor, currentCenter),
                    featKeysSegID = Object.keys(layer._featureMap[String(featMapKey)]),
                    nfeatKeysSegID = featKeysSegID.length,
                    f, segID, segBounds, _featureMapSaver = {};

                for (f = featKeysSegID; f--;) {
                    segID = featKeysSegID[f];
                    segBounds = (layer._featureMap[String(featMapKey)][segID].feature && layer._featureMap[String(featMapKey)][segID].feature.id) ? layer._featureMap[String(featMapKey)][segID].feature.attributes.getOLGeometry().bounds : undefined;
                    //segBounds = this._featureMap[String(featMapKey)][segID].bounds;

                    if (segBounds !== undefined &&
                        newDataBounds.intersectsBounds(segBounds)) {
                        //_featureMapSaver[segID] = { highlight: true, bounds: segBounds};
                        _featureMapSaver[segID] = layer._featureMap[String(featMapKey)][segID];
                    }
                }
                console.debug(Object.keys(_featureMapSaver).length);
                layer._featureMap[String(featMapKey)] = _featureMapSaver;
            });
        };

        layer.isOnScreen = function(segID) {
            return W.map.getExtent().toGeometry().intersects(W.model.segments.objects[segID].getOLGeometry());
        };

        return layer;
    };

    var initHighlightsLayer = function() {
        var rsh_ol = new OpenLayers.Layer.Vector("Road Selector Highlights", { //W.map.getLayersByName("Road Selector Highlights")[0]
            rendererOptions: {
                zIndexing: true
            },
            uniqueName: '__RSel_Highlights',
            displayInLayerSwitcher: true,
            draggable: false
        });

        I18n.translations[I18n.currentLocale()].layers.name.__RSel_Highlights = 'Road Selector Highlights';
        W.map.addLayer(rsh_ol);
        W.map.addControl(new OpenLayers.Control.DrawFeature(rsh_ol, OpenLayers.Handler.Path));
        rsh_ol.setZIndex(501);
        rsh_ol.setVisibility(false);
        rsh_ol._featureMap = {
            trace: {}
        };
        rsh_ol = addStuffToLayerObject(rsh_ol);

        return rsh_ol;
    };

    var initUnderRoadsLayer = function() {
        var rsh_olu = new OpenLayers.Layer.Vector("Road Selector Highlights (Under)", { //W.map.getLayersByName("Road Selector Highlights")[0]
            rendererOptions: {
                zIndexing: true
            },
            uniqueName: '__RSel_Highlights_Under',
            displayInLayerSwitcher: false,
            draggable: false
        });

        I18n.translations[I18n.currentLocale()].layers.name.__RSel_Highlights_Under = 'Road Selector Highlights (Under)';
        W.map.addLayer(rsh_olu);
        W.map.addControl(new OpenLayers.Control.DrawFeature(rsh_olu, OpenLayers.Handler.Path));

        if (userFallback) rsh_olu.setZIndex(W.map.roadLayers[0].getZIndex()-1);
        else W.map.getOLMap().setLayerIndex(rsh_olu, W.map.getOLMap().getLayerIndex(W.map.roadLayers[0])-1);

        rsh_olu.setVisibility(false);
        rsh_olu._featureMap = {
            "0": {}
        };
        rsh_olu = addStuffToLayerObject(rsh_olu);

        return rsh_olu;
    };

    // -----------------------------------------------------------------------------

    var styleMenuDelete = function(that) {
        delete rsh.STYLES[that.parentNode.name];
        that.parentNode.parentNode.remove();
        localStorage.RSHighlights_Styles = JSON.stringify(rsh.STYLES);
    };

    var populateStylesMenu = function() {
        var styleNames = Object.keys(rsh.STYLES).sort(),
            numStyles = styleNames.length,
            stylesHTML = '',
            sn, styleName;

        // The following is for when populateStylesMenu() is being called for the purpose of resetting the presets
        $('.rsh-styles-menu li>a>span.fa-times').parents('li').remove();

        // Add styles to menu
        for (sn = 0; sn < numStyles; sn++) {
            styleName = styleNames[sn];
            if (!/^Default$/.test(styleName)) {
                stylesHTML += '<li><a name="' + styleName + '">' + styleName + '<span class="fa fa-times fa-pull-right fa-lg"></span></a></li>';
            }
        }
        $('.rsh-styles-menu ul').append(stylesHTML);

        // Add event listeners
        $('.rsh-styles-menu li>a').click(stylesMenuActions);
        $('.rsh-styles-menu li>a>span.fa-times').click(function(e) {
            e.stopPropagation();
            styleMenuDelete(this);
        });
    };

    var stylesMenuActions = function(e) {
        switch (this.name) {
            case 'saveas':
                e.stopPropagation();
                var inputName = prompt("Please enter a name for your style:"),
                    styleNames = Object.keys(rsh.STYLES);

                if (inputName !== null) {
                    rsh.STYLES[inputName] = rsh.HIGHLIGHTS[rsh.idx].style;

                    if (!styleNames.contains(inputName)) {
                        $('.rsh-styles-menu ul').append('<li><a name="' + inputName + '">' + inputName + '<span class="fa fa-times fa-pull-right fa-lg"></span></a></li>');
                        $('.rsh-styles-menu li>a[name="' + inputName + '"]').click(stylesMenuActions);
                        $('.rsh-styles-menu li>a[name="' + inputName + '"]>span.fa-times').click(function(e) {
                            e.stopPropagation();
                            styleMenuDelete(this);
                        });
                    }

                    localStorage.RSHighlights_Styles = JSON.stringify(rsh.STYLES);
                }
                break;
            case 'saveasdefault':
                rsh.STYLES.Default = rsh._clone(rsh.HIGHLIGHTS[rsh.idx].style);
                rsh.STYLES.Default.strokeColor = '#FFFF00';
                localStorage.RSHighlights_Styles = JSON.stringify(rsh.STYLES);
                break;
            case 'resetdefault':
                rsh.STYLES.Default = rsh._clone(rsh.presets.defaultLineStyle);
                localStorage.RSHighlights_Styles = JSON.stringify(rsh.STYLES);
                break;
            case 'resetpresets':
                $.extend(rsh.STYLES, rsh.presets.lineStyles);
                localStorage.RSHighlights_Styles = JSON.stringify(rsh.STYLES);
                populateStylesMenu();
                break;
            default:
                var strokeColor = rsh.HIGHLIGHTS[rsh.idx].style.strokeColor;
                rsh.HIGHLIGHTS[rsh.idx].style = rsh._clone(rsh.STYLES[this.name]);
                rsh.HIGHLIGHTS[rsh.idx].style.strokeColor = strokeColor;
                updatePanelFromPrefs();
                rsh.triggerUpdate = true;
                requestAnimationFrame(Highlight);
        }
    };

    var copyToClipboard = function(str) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(str).select();
        document.execCommand("copy");
        $temp.remove();
    };

    var pasteFromClipboard = function() {
        var $temp = $("<input>"),
            str;

        $("body").append($temp);
        $temp.focus();
        $temp.val('.').select();
        document.execCommand("paste");
        str = $temp.val();
        $temp.remove();
        console.debug(str);
        return str;
    }

    // -----------------------------------------------------------------------------
    var InitRSelHighlights = function() { // return rsh

        var checkForSessionSave = function() { // return rsh
            rsh = new RSH();

            // Load autosaved parameters from sessionStorage
            if (sessionStorage.RSHighlights) {
                rsh.importHighlights(JSON.parse(sessionStorage.RSHighlights));
                //console.debug("WMERSH: Imported data from previous session.")

                if (rsh.HIGHLIGHTS.length === 0 ||
                    (rsh.HIGHLIGHTS.length !== 0 && rsh.HIGHLIGHTS[0].rule.text === undefined)) rsh = new RSH();
            }
            //if (rsh.loadedSavedSession) {if (rsh.HIGHLIGHTS[rsh.lastIdx].rule !== null) rsh.addHighlighter(); }
            if (rsh.showSessionHighlights === undefined) rsh.showSessionHighlights = false;


            if (localStorage.RSHighlights === undefined) localStorage.RSHighlights = '{}';

            if (localStorage.RSHighlights_Styles === undefined) {
                localStorage.RSHighlights_Styles = '';
            } else {
                rsh.addStyles();
            }

            if (localStorage.RSHighlights_Prefs === undefined) {
                localStorage.RSHighlights_Prefs = '';
            } else {
                var prefs = localStorage.RSHighlights_Prefs;
                document.getElementById('cbRSHSuppRoad').checked = /&s/.test(prefs); //suppress
                document.getElementById('cbRSHTraceBgRoads').checked = /&t/.test(prefs); //trace

                if (/#[\d\w]{6}/.exec(prefs)) document.getElementById('selRSHTraceColor').value = /#[\d\w]{6}/.exec(prefs)+'';
                document.getElementById('cbRSHIgnoreEditableChkBx').checked = /&e/.test(prefs); //ignore editable only
                document.getElementById('cbRSHLayerIndexFallback').checked = /&f/.test(prefs); //fallback to old layer indexing
                document.getElementById('cbRSHNoOverlapScaling').checked = /&a/.test(prefs); //autoscaling of overlaps
            }

            return rsh;
        };

        var setupRSHInterface = function() {
            // CSS for RSel Highlights
            var rshCSS = document.createElement("style");
            rshCSS.type = "text/css";
            // UI panel
            rshCSS.innerHTML =
                '.rsh-main-panel { min-width: 285px; width: 100%; background-color: #BEDCE5; border-style: solid; border-width: 2px; border-collapse: collapse; ' +
                '   padding: 5px; border-color: #93C4D3; margin-top: 15px; border-radius: 5px; vertical-align: middle; }\n' +
                '.rsh-dropbar-panel { color: #444; background: transparent; border-style: inset; margin-top: 0; border-width: 2px; border-color: rgba(146,194,209,.60); ' +
                '   border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; }\n' + // border-bottom-left-radius: 5px; border-bottom-right-radius: 5px0
                '.rsh-dropbar-panel table { border: 0; width: 100%; display: inline-table;}\n' +
                '.rsh-dropbar-panel td { font-size: 7pt; font-weight: 600; line-height: 6px; padding: 0px 4px 4px 4px; margin: 0; vertical-align: middle; color: #59899E;}\n' +
                '.rsh-arrow-up { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid black; }\n' +
                '.rsh-arrow-down { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid black; }\n' +
                'div.rsh-vcentered { position: relative; padding: 2px 5px 3px; width: 100%; display: inline-block; vertical-align: middle; text-align: left; }\n' +
                '.rsh-dropbar-contents {display: block; padding: 8px 0px 0px; margin: 0; border: 0; background-color: rgba(216, 231, 236, 0.3); }\n' +
                'select.rsh-dropbar-panel { height:20px; width: 100px; background-color: #FFF; border: 1px solid #B4B4B4; margin: 0px 0px 2px 2px; padding: 0; }\n' +
                'input.rsh-dropbar-panel { height:20px; width: 36px; background-color: #FFF; border: 1px solid #C1C1C1; border-radius: 0; margin: 0px 0px 2px 2px; padding: 0; }\n' +
                '.rsh-dropbar-header { color: #000; border-bottom: 1px solid #c0c0c0; }\n' +
                'a.rsh-link { font-weight: 600; text-decoration: none; width: 130%; padding: 1px 3px;}' +
                '.rsh-btn-container>label { padding-left: 4px; }' +
                '.rsh-btn-row { position: relative; display: block; vertical-align: middle; margin: auto; padding: 0; }\n' +
                '.rsh-btn-container { height: 25px; position: relative; display: inline-block; padding: 0; margin: 0px; vertical-align: middle; }\n' +
                '.rsh-checkbox-row { margin-top: -3px; padding: 1px 10px 2px; }\n' +
                '.rsh-checkbox-row label { margin: 3px 0px 1px; color: #F5F5F5; font-size: 11px; line-height: 1.2; font-weight: 400; }\n' +
                '.rsh-checkbox-row:hover, .rsh-checkbox-row:focus {background-color: rgba(255, 255, 255, 0.18); }\n';

            // Buttons
            rshCSS.innerHTML +=
                '.rsh-btn-color {width: 24px; height: 25px; position: absolute; top: 0px; left: 0px; margin-right: -3px; padding: 0; z-index: 0; }\n' +
                '.rsh-btn.rsh-btn-color { border-radius: 5px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; z-index: 0; padding: 2px; padding-left: 4px; border-bottom: 2px solid rgba(0,0,0,0.3); }\n' +
                '.rsh-btn.rsh-btn-highlight { border-radius: 4px; width: 75px; border-top-left-radius: 0px; border-bottom-left-radius: 0px; }\n' + //border-bottom: solid 2px #E4E4E4; border-top: 0; border-right: 0; border-left: 0; }' +
                '.rsh-btn-counter { z-index: 0 !important; height: 25px; width: 25px; padding: 3px 4px; font-size: 14px; line-height: 1.4; cursor: pointer; ' +
                '   color: #88888E; background-color: #CFE0E6; border-left: solid 1px #7AB0BE; border-bottom: 0; ' +
                '   box-shadow: inset 0px 2px 4px -1px rgba(0,0,0,0.2), inset 0px -2px 4px -2px rgba(0,0,0,0.2) }\n' +
                '.rsh-btn-counter:hover, .rsh-btn-counter:active, .rsh-btn-counter.active, .rsh-btn-counter:focus {opacity: 0.7;}\n' +
                '.rsh-btn-inner { border-radius: 5px; background-color: white; display: inline-block; }\n' +
                '.rsh-btn { border-radius: 4px; font-size: 12px; line-height: 1.5; height: 25px; font-weight: bold; color: #396179; padding: 3px;}\n' + //background-color: #93C1D3;
                '.rsh-btn:hover { opacity: 0.95; color: #08648E; }\n' + //color: #48758C;
                '.rsh-btn.disabled { color: #6C9AAE; cursor: not-allowed !important; opacity: .85;}\n' + //box-shadow: inset 0px 0px 0px 1px rgba(0,0,0,0.05);
                '.rsh-btn:active, .rsh-btn:focus, .rsh-btn.active { background-image: none; outline: 0; -webkit-box-shadow: none; box-shadow: none; }\n' +
                'a#btnRSHClearAll.rsh-btn { padding-top: 2px; border-left: solid 1px #B099B1; color: white; width: 25px;}\n' +
                'a#btnRSHClearAll.rsh-btn.disabled { background-color: #ff8383; color: #FFE0E0 !important; opacity: 0.75;}\n' +
                '.rsh-btn>.tooltip-inner { font-weight: bold; }\n' +
                '.fa-bars.rsh-icn, .rsh-styles-menu .fa-caret-square-o-down { margin-left: 0; margin-right: -1%; line-height: 0.9; padding: 4px; height: 25px; display: inline-block; vertical-align: middle; color: #59899E; font-size: 17px; text-shadow: 0px 1px 0px rgba(255,255,255,0.5); border: 1px solid transparent; }\n' +
                '.rsh-icn:hover, .rsh-icn:active, .rsh-icn:focus { border: 1px solid rgb(132, 174, 191); border-radius: 3px; cursor: pointer; }\n' +
                '.rsh-styles-menu>ul>li>a { padding: 2px 15px; padding-right: 10px; white-space: normal; cursor: pointer; }\n' +
                '.rsh-styles-menu .fa-times:hover, .rsh-styles-menu .fa-times:focus, .rsh-styles-menu .fa-times:active {color: #ed503b;}\n' +
                '.rsh-styles-menu .fa-times { margin-top: 2.5px; color: lightgray; }\n' +
                '.btn-group .rsh-btn2 { font-size: 1.4em; width: 21px; height: 22px; padding: 0; text-align: center; vertical-align: middle; border-width: 1px; border-radius: 3px; color: #396179; background: transparent; }\n' +
                '.btn-group .rsh-btn2:hover { background-color: #CAE5EC; }\n' +
                '.btn-group .rsh-btn2>.fa.fa-times:hover { color: red; }\n' +
                '.btn-group .rsh-btn2:focus, .btn-group .rsh-btn2:active { border: 1px solid #00BCD4; z-index: 2; }\n' +
                '.rsh-text-covertip { opacity: 0; transition: opacity .2s linear 0s; pointer-events: none; position: absolute; margin: 4px; padding-left: 7px; width: 50%; line-height: 1.2; font-size: 1.3em; font-weight: 600; text-align: left; background-color: white; color: gray; }\n' +
                '.rsh-text-covertip.rsh-show { opacity: 1; }';

            rshCSS.innerHTML += // Dropup expressions menu
                '.dropdown-menu.rsh-expr-menu { background-color: inherit; right: -92px; padding: 1px; border-radius: 2px; font-size: 10px; max-height: 400px; width: 301px; overflow-x: hidden; overflow-y: auto;}\n' +
                '.dropdown-menu.rsh-expr-menu>li { background-color: inherit; border-bottom: 1px solid #93C4D3; margin: 0; padding: 0; }\n' +
                '.rsh-expr-item { opacity: 1; background-color: white; word-wrap: break-word; white-space: normal; padding-top: 8px; padding-bottom: 8px; padding-left: 10px; padding-right: 10px; position: relative;}\n' +
                '.dropdown-menu.rsh-expr-menu .rsh-expr-item:active, .rsh-expr-item.active, .rsh-expr-item:focus { background-color: #BEDCE5; }\n' +
                '.rsh-expr-item:hover { opacity: 1; cursor: pointer; background-color: #D4e7ed; }\n' +
                '.rsh-expr-menu.rsh-dragging .rsh-expr-item:hover { background-color: white; }\n' +
                '.rsh-expr-item>.rsh-expr-color { pointer-events: none; text-shadow: 0px 0px 1px gray; margin-left: 2px; margin-right: 6px; margin-top: 2px; position: absolute; font-size: 11px; }\n' +
                '.rsh-expr-item>.rsh-expr-text { pointer-events: auto; z-index: 1; position: relative; left: 20px; display: inline-block; width: 265px; margin-right: -10px; padding-right: 22px; margin-bottom: -8px}\n' +
                '.rsh-expr-item>.rsh-expr-dragicn { z-index: 10; font-size: 14px; color: #BBB; margin-top: -3px; font-weight: normal; width: 25px; text-align: center; position: absolute; padding-right: 5px; right: 2px;}\n' +
                '.rsh-expr-item.active>.rsh-expr-dragicn { color: #8FB3C1; }\n' +
                '.rsh-expr-item>.rsh-expr-dragicn:hover, .rsh-expr-item>.rsh-expr-dragicn:focus { cursor: move; color: #81ABBB }\n' +
                '.dropdown-menu.rsh-expr-menu .rsh-expr-item.rsh-drag { box-shadow: inset 0px -8px 0px #93C4D3 }\n' +
                '.rsh-expr-menu>li.rsh-hidden {display: none; height: 9px; }\n' +
                '.rsh-expr-menu.rsh-dragging>li.rsh-hidden { z-index: 1; display: block; height: auto;}\n' +
                '.rsh-expr-menu>li.rsh-hidden>.rsh-expr-item { width: 100%; padding: 0; }\n' +
                '.rsh-expr-menu>li.rsh-hidden>.rsh-expr-item>.rsh-expr-text { pointer-events: auto; display: block; height: 8px; margin: 0; padding: 0}\n' +
                '.rsh-expr-menu>li.rsh-hidden>.rsh-expr-item.rsh-drag { box-shadow: inset 0px -20px 0px #93C4D3; }\n' +
                '.rsh-expr-menu>li.rsh-hidden>.rsh-expr-item.rsh-drag>.rsh-expr-text { pointer-events: auto; height: 20px;}\n' +
                '.rsh-expr-item .rsh-expr-spacer { pointer-events: none; width: 100%; display: block; height: 8px;  }\n' +
                '.rsh-expr-item.rsh-drag .rsh-expr-spacer { height: 16px; }\n' +
                '.rsh-expr-menu.rsh-dragging>li:nth-child(2)>div.rsh-expr-item { margin-top: -9px;}\n' +
                '#rshMenuNote { white-space: normal; background-color: rgba(0,0,0,0.85); border-radius: 5px; color: white; font-size: 10px; padding: 5px; font-weight: 600; font-family: "Open Sans", "Alef", helvetica, sans-serif;}\n' +
                '.rsh-expr-del { pointer-events: auto; opacity: 0; background-color: inherit; display: inline-block; position: absolute; font-size: 16px; line-height: 0.9; color: crimson; z-index: 1;}\n' +
                '.rsh-expr-del:hover, .rsh-expr-del:active, .rsh-expr-del:focus, .rsh-expr-item:hover .rsh-expr-del {opacity: 1;}\n' +
                '.rsh-expr-text>.fa { float: right; margin-left: 4px; cursor: pointer; color: #58889E; font-size: 11px; }\n' +
                '.rsh-expr-text>.fa:hover { color: #2196F3 }\n' +
                '.rsh-expr-export { line-height: 1.3; margin-right: 3px; }\n' + //'.rsh-expr-hide.fa-eye { vertical-align: middle; }\n' +
                '.rsh-expr-hide.fa-eye-slash { color: #9FC2D0; }\n' +
                '';

                rshCSS.innerHTML +=
                '.rsh-minimenu { display: none; position: absolute; bottom: 100%; margin-bottom: 4px; width: 112px; left: -48px; white-space: normal; background-color: rgba(204, 225, 232, 0.9); font-size: 10px; box-shadow: 0px 3px 10px rgba(0,0,0,0.4); }\n' +
                '.rsh-minimenu.rsh-show { display: block; } \n' +
                '.rsh-minimenu>.fa-caret-down {background-color: transparent; position: absolute; top: 100%; left: 50%; margin: 0px -2px; margin-top: -1px; font-size: 16px; line-height: 0.4; text-shadow: 0px 2px 4px rgba(0,0,0,0.4); color: rgba(204, 225, 232, 0.95); z-index: 0; }\n' +
                '.rsh-minimenu ul { list-style: none; padding: 2px 0px; margin: 0; z-index: 1;}\n' +
                '.rsh-minimenu li { padding: 5px 0px; border-bottom: 1px solid rgba(89, 137, 158, 0.9); font-weight: bold; color: #396179; }\n' +
                '.rsh-minimenu ul>li:last-of-type { border: 0; }\n' +
                '.rsh-minimenu li:hover, .rsh-minimenu li:focus { background-color: rgba(147, 196, 211, 0.9); color: white; }\n';

            // CSS-generated icons
            rshCSS.innerHTML +=
                '.rsh-icn-outerbox { display: inline-block; width: 13px; height: 11px; margin: 5px 3px 6px 3px; padding: 0; font-size: 0; border: 0; vertical-align: middle; line-height: 0px; }\n' +
                '.rsh-icn-indark { display: inline-block; margin: 0; padding: 0; background-color: #555; }\n' +
                '.rsh-icn-inwhite { display: inline-block; margin: 0; padding: 0; background-color: #FFF; }\n' +
                '.rsh-icn-inclear { display: inline-block; margin: 0; padding: 0; background-color: transparent; }\n' +
                '.rsh-icn-brdark { display: block; margin: 0; padding: 0; background-color: #555; }\n' +
                '.rsh-icn-brclear { display: block; margin: 0; padding: 0; background-color: transparent; }\n' +
                '.rsh-icn-ingray { display: inline-block; margin: 0; padding: 0; background-color: #bbbbbb; }\n' +
                '.rsh-icn-2x2 { width: 2px; height: 2px }\n' +
                '.rsh-icn-3x2 { width: 3px; height: 2px }\n' +
                '.rsh-icn-2x1 { width: 2px; height: 1px }\n' +
                '.rsh-icn-1x2 { width: 1px; height: 2px }\n' +
                '.rsh-icn-1x1 { width: 1px; height: 1px }\n' +
                '.rsh-icn-3x3 { width: 3px; height: 3px }\n' +
                '.rsh-icn-4x3 { width: 4px; height: 3px }\n' +
                '.rsh-icn-13x1 { width: 13px; height: 1px }\n';

            document.body.appendChild(rshCSS);

            //------------------------------------------------------------------
            // CSS-HTML Icons
            // 		[weight, opacity, stroke type, end cap, dash size, dash gap]
            var rshIcons = [
                '<div class="rsh-icn-outerbox"><div class="rsh-icn-brdark" style="width: 13px; height: 3px"></div><div class="rsh-icn-brclear" style="width: 13px; height: 2px"></div><div class="rsh-icn-brdark" style="width: 13px; height: 2px"></div><div class="rsh-icn-brclear" style="width: 13px; height: 3px"></div><div class="rsh-icn-brdark" style="width: 13px; height: 1px"></div></div>',
                '<div class="rsh-icn-outerbox"><div class="rsh-icn-indark rsh-icn-3x3"></div><div class="rsh-icn-inwhite rsh-icn-3x3"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #ababab !important"></div><div class="rsh-icn-inwhite rsh-icn-3x3" style="background-color: #f1f1f1 !important"></div><div class="rsh-icn-inwhite rsh-icn-3x3"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #999999 !important"></div><div class="rsh-icn-inwhite rsh-icn-3x3" style="background-color: #f1f1f1 !important"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #CCCCCC !important"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #888888 !important"></div><div class="rsh-icn-inwhite rsh-icn-3x3" style="background-color: #fafafa !important"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #bbbbbb !important"></div><div class="rsh-icn-inclear rsh-icn-3x3"></div><div class="rsh-icn-inwhite rsh-icn-3x3" style="background-color: #fbfbfB !important"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #bbbbbb !important"></div><div class="rsh-icn-inclear rsh-icn-3x3"></div><div class="rsh-icn-indark rsh-icn-3x3" style="background-color: #dddddd !important"></div></div>',
                '<div class="rsh-icn-outerbox"><div class="rsh-icn-brdark" style="width: 13px; height: 2px"></div><div class="rsh-icn-brclear" style="width: 13px; height: 2px"></div><div class="rsh-icn-indark" style="width: 6px; height: 2px"></div><div class="rsh-icn-inclear" style="width: 1px; height: 2px"></div><div class="rsh-icn-indark" style="width: 6px; height: 2px"></div><div class="rsh-icn-brclear" style="width: 13px; height: 2px"></div><div class="rsh-icn-indark" style="width: 3px; height: 3px"></div><div class="rsh-icn-inclear" style="width: 2px; height: 3px"></div><div class="rsh-icn-indark" style="width: 3px; height: 3px"></div><div class="rsh-icn-inclear" style="width: 2px; height: 3px"></div><div class="rsh-icn-indark" style="width: 3px; height: 3px"></div></div>',
                '',
                '<div class="rsh-icn-outerbox" style="width: 13px !important"><div class="rsh-icn-indark rsh-icn-1x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-1x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-1x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-1x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-1x2"></div><!-->>--><div class="rsh-icn-brclear" style="width: 13px; height: 3px"></div><!--<<--><div class="rsh-icn-indark rsh-icn-3x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-3x2"></div><div class="rsh-icn-inclear rsh-icn-2x2"></div><div class="rsh-icn-indark rsh-icn-3x2"></div><!-->>--><div class="rsh-icn-brclear" style="width: 13px; height: 2px"></div><!--<<--><div class="rsh-icn-indark" style="width: 6px; height: 2px"></div><div class="rsh-icn-inclear" style="width: 2px; height: 2px"></div><div class="rsh-icn-indark" style="width: 5px; height: 2px"></div></div>',
                '<div class="rsh-icn-outerbox"><div class="rsh-icn-brclear" style="width: 13px; height: 1px"></div><div class="rsh-icn-indark rsh-icn-4x3"></div><div class="rsh-icn-inclear" style="width: 5px; height: 3px"></div><div class="rsh-icn-indark rsh-icn-4x3"></div><div class="rsh-icn-brclear" style="width: 13px; height: 3px"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-ingray rsh-icn-1x1"></div><div class="rsh-icn-inclear" style="width: 7px; height: 1px"></div><div class="rsh-icn-ingray rsh-icn-1x1"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-ingray" style="width: 9px; height: 1px"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-ingray rsh-icn-1x1"></div><div class="rsh-icn-inclear" style="width: 7px; height: 1px"></div><div class="rsh-icn-ingray rsh-icn-1x1"></div><div class="rsh-icn-inclear rsh-icn-2x1"></div><div class="rsh-icn-brclear" style="width: 13px; height: 2px"></div></div>'
            ];
            //------------------------------------------------------------------
            // Main RSel Highlights panel
            $("#RSselection").append(
                '<div class="rsh-main-panel" id="divRSHmainPanel">' +
                '<div class="rsh-btn-row">' +
                '	<div class="rsh-btn-container">' +
                '   <div class="rsh-btn-inner" style="margin-right: 6px;">' +
                '		<input type="color" id="selRSHColors" value="#FFFF00" class="btn rsh-btn-color" style="opacity: 0; float: left; position: relative; padding: 0; -webkit-appearance: none; -moz-appearance: none;" ' +
                '			   list="colors" data-toggle="tooltip" title="Highlighter color"></input>' + // highlight color
                '       <datalist id="colors">' +
                '			<option>#CCFF66</option><option>#28F311</option><option>#CCFFCC</option><option>#00F2F2</option><option>#0037D1</option>' +
                '			<option>#FFFF00</option><option>#F5950E</option><option>#E1201B</option><option>#FF00FF</option><option>#8000FF</option>' +
                '		</datalist>' +
                '       <div id="selRSHColorBtn" class="btn rsh-btn rsh-btn-color" style="pointer-events: none; z-index: 1; background-color: rgb(128, 0, 255);">' +
                '<span class="fa fa-caret-down fa-lg"></span>' +
                '</div>' +
                '		<button id="btnRSHighlight" class="btn btn-primary rsh-btn rsh-btn-highlight active" data-toggle="tooltip" title="Update map highlights"> Highlight</button>' + // HIGHLIGHT
                '   </div><div class="rsh-btn-inner" style="margin-right: 6px;">' +
                '		<a id="btnRSHClearTop" style="width: 26px;" class="btn btn-primary rsh-btn disabled"  data-toggle="tooltip" title="Erase highlights of current selection" role="button">' + // undo eraser
                '		    <span class="fa fa-eraser fa-lg"></span></a>' +
                '	</div></div>' +
                '	<div class="rsh-btn-container"><div class="btn-group rsh-btn-inner">' +
                '		<a id="btnRSHAdd" style="width: 24px;" class="btn btn-primary rsh-btn" data-toggle="tooltip" title="Add another highlighter" role="button">' + // Add layer
                '			<span class="fa fa-plus"></span></a>' +
                '		<div id="btnRSHmenu" class="btn-group dropup">' +
                '			<div id="btnRSHCount" class="btn rsh-btn-counter" title="View highlighting rules" data-toggle="tooltip">' + // layer counter
                '			<span id="txtRSHCount">0</span></div>' + // [#]
                '			<ul class="dropdown-menu pull-right dropdown-menu-right list-group rsh-expr-menu">' +
                '				<li></li>' +
                '			</ul>' +
                '		</div>' +
                '		<a id="btnRSHSubtract" style="width: 24px;" class="btn btn-primary rsh-btn disabled" data-toggle="tooltip" title="Delete highlighter" role="button">' + // border-right: solid 1px #7AB0BE;
                '			<span class="fa fa-minus"></span></a>' +
                '		<a id="btnRSHClearAll" class="btn btn-danger rsh-btn" data-toggle="tooltip" title="Delete all highlighters" role="button">' +
                '			<span class="fa fa-trash fa-lg"></span></a>' +
                '   </div></div>' +
                '   <div id="icnRSHmoreOpts" class="fa fa-bars pull-right rsh-icn" title="More options" data-toggle="tooltip"></div>' +
                '</div></div>');

            $("#divRSHmainPanel").append(
                '<div id="rshMoreOptions" style="display: none;">' +
                '<div class="rsh-btn-row" style="margin: 6px -8px 0px; padding: 6px 0px; border-top: 1px solid #93C4D3; border-bottom: 1px solid #93C4D3; background-color: rgba(89, 137, 158, 0.7);">' +
                '	<div class="rsh-checkbox-row"><div class="checkbox-inline">' +
                '		<input type="checkbox" id="cbRSHSuppRoad" class="btn" style="margin-right: 5px; margin-bottom: 7px;"></input>' + // Suppress roads
                '       <label for="cbRSHSuppRoad" data-toggle="tooltip" title="Hides roads by making highlights opaque, while still allowing highlights drawn over the same segment to have an overlapping colors effect.">Suppress apperance of roads under highlights</label>' +
                '   </div></div>' +
                '	<div class="rsh-checkbox-row">' +
                '   <div class="checkbox-inline" style="width: 210px;">' +
                '       <input type="checkbox" id="cbRSHTraceBgRoads" class="btn">' +
                '       <label for="cbRSHTraceBgRoads" data-toggle="tooltip" title="Activate this option to visually block irrelevant segments that do not meet the selection criteria. You can turn off the Roads layer to give all non-highlighted segments a uniform appearance.">Trace over non-highlighted roads with a single color</label>' + // Trace background roads checkbox
                '   </div>' +
                '   <div style="display: inline-block">' +
                '       <input type="color" id="selRSHTraceColor" value="#c0c0c0" class="btn rsh-btn-drop" ' + // trace color
                '           list="trcolors" style="position: relative; right: -5px; width: 44px; height: 21px; padding: 0px; background-color: rgba(255,255,255,0.3); border: 1px solid transparent; " ' +
                '           data-toggle="tooltip" title="Tracing color for non-highlighted roads"></input>' +
                '       <datalist id="trcolors">' +
                '           <option>#FFFFFF</option><option>#c0c0c0</option><option>#000000</option><option>#264B01</option><option>#634D41</option>' +
                '       </datalist>' +
                '   </div></div>' +
                '   <div class="rsh-checkbox-row"><div class="checkbox-inline">' +
                '       <input type="checkbox" id="cbRSHIgnoreEditableChkBx" class="btn" style="margin-right: 5px; margin-bottom: 7px;"></input>' + // Ignore editable only checkbox
                '       <label for="cbRSHIgnoreEditableChkBx" data-toggle="tooltip" title="Checking this option will make RSel Highlights ignore the Editable only checkbox.">Always highlight both editable and noneditable segments</label>' +
                '   </div></div>' +
                '   <div class="rsh-checkbox-row"><div class="checkbox-inline">' +
                '       <input type="checkbox" id="cbRSHLayerIndexFallback" class="btn" style="margin-right: 5px; margin-bottom: 7px;"></input>' + // Ignore editable only checkbox
                '       <label for="cbRSHLayerIndexFallback" data-toggle="tooltip" title="<b>Do not use unless you are having issues with other highlighting scripts.</b><br>This setting will force RSel Highlights to fallback and use a less efficient method, but might <i>unbreak</i> some highlighting scripts that use fixed layer indexes. However, rather than relying on this option, it is better to ask the developers of any affected scripts if they could query for the layer index instead, which would make their code more robust.">Play nice with other highlighting scripts <br><i>(Please read help popup first!)</i></label>' +
                '   </div></div>' +
                '   <div class="rsh-checkbox-row"><div class="checkbox-inline">' +
                '       <input type="checkbox" id="cbRSHNoOverlapScaling" class="btn" style="margin-right: 5px; margin-bottom: 7px;"></input>' + // Ignore editable only checkbox
                '       <label for="cbRSHNoOverlapScaling" data-toggle="tooltip" title="By default, highlights that overlap on top of another highlight are drawn thinner to make it visually easier to see those overlaps. Non-overlapping highlights are not affected by auto-scaling.">Disable auto-scaling of line thickness for overlapping highlights</label>' +
                '   </div></div>' +
                '</div>' +
                '<div id="btnRSHhideSettings" class="btn btn-primary rsh-btn-row" style="opacity: 0.5; margin: 0px -8px -3px -8px; border-radius: 0; height: 9px; border-bottom-width: 1px; background-color: rgba(255, 255, 255, 0.498039);"><span class="fa fa-caret-up" style="position: absolute; color: #26485D; top: -2px; text-shadow: 0px 1px 0px rgba(255,255,255,0.5);"></span></div>' +
                '<div class="form-inline" style="vertical-align: middle; margin: 6px -2px -1px -2px; position: relative;">' +
                '<div id="textRSHCoverTip" class="rsh-text-covertip"></div>' +
                '<select id="selRSHighlighter" class="form-control" style="font-weight: normal; font-size: 12px; padding: 0; width: 55%; max-width: 145px; height: 24px;"><option value="" selected>(Saved Highlighters)</option></select>' +
                '<div class="btn-group" style="position: absolute; right: 1px; top: 1px; text-align: center;">' +
                '<a id="applyRSHighlighter" data-covertip="Load Selected" style="width: 23px;" class="btn btn-primary rsh-btn2"><i class="fa fa-upload"></i></a>' +
                '<a id="saveRSHighlighter" data-covertip="Save Highlights As..." class="btn btn-primary rsh-btn2"><i class="fa fa-save" style="font-size: 1.2em; margin-top: 2px;"></i></a>' +
                '<a id="delRSHighlighter" data-covertip="Delete Selected" class="btn btn-primary rsh-btn2"><i class="fa fa-times" style="font-size: 1.2em;"></i></a>' +
                '<a id="importRSHighlighter" data-covertip="Import Highlighters" class="btn btn-primary rsh-btn2"><i class="fa fa-sign-in fa-flip-horizontal" style="font-size: 1.3em; margin-top: 1px;"></i></a>' +
                '<a id="exportRSHighlighter" data-covertip="Export Selected" class="btn btn-primary rsh-btn2"><i class="fa fa-reply fa-flip-horizontal"></i></a>' +
                '<a id="exportAllRSHighlighter" data-covertip="Export All" class="btn btn-primary rsh-btn2"><i class=" fa fa-reply-all fa-flip-horizontal"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>');

            //if (isFirefox) $('#cbRSHTraceBgRoads').parent().css('padding-left','28px');

            // Additional style options drop menu
            $("#RSselection").append('\
                <div id="divRSHdropbarPanel" class="rsh-dropbar-panel" style="min-width: 285px; width: 100%;">\
                <div id="divRSHdropbarHeader" class="rsh-vcentered">\
                <div style="display: inline-block">\
                  <a id="aRSHdropbarLinkShow" class="rsh-link" role="button" style="display: none;"><i class="fa fa-chevron-down"></i>&nbsp;Show additional style options</a>\
                  <a id="aRSHdropbarLinkHide" style="display: inline-block;" class="rsh-link" role="button"><i class="fa fa-chevron-up"></i>&nbsp;Hide additional style options</a>\
                </div>\
                <div class="dropdown fa-pull-right rsh-styles-menu open" style="display: none;">\
                    <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" style="height: 100%; padding: 0; background: transparent; border: 0;">\
                    <span class="fa fa-caret-square-o-down" style="font-size: 11px; height: 100%; line-height: 0.5;"></span></button>\
                    <ul class="dropdown-menu" style="top: 80%; left: initial; right: -3px; border-radius: 2px; font-size: 10px; min-width: 142px; max-width: 142px;">\
                      <li><a name="saveas" href="#">Save Style As...</a></li>\
                      <li><a name="saveasdefault" href="#">Save As Default</a></li>\
                      <li><a name="resetdefault" href="#">Reset Default Style</a></li>\
                      <li><a name="resetpresets" href="#">Reinstall Sample Presets</a></li>\
                      <li class="divider"></li>\
                      <li class="dropdown-header" style="padding: 2px 15px; font-size: 9px; text-transform: uppercase;">Apply Style Preset</li>\
                      <li><a name="Default" href="#">Default*</a></li>\
                    </ul>\
                </div>\
                </div>' + //closing for divRSHdropbarHeader
                '<div id="divRSHdropbarContents" class="rsh-dropbar-contents">' +
                // table for additional style options within dropbar panel
                '<table>' +
                '<tr><td style="vertical-align: bottom">Thickness</td><td style="vertical-align: bottom">Opacity</td>' +
                '<td rowspan=4>' +
                // inner table for dash style options
                '<table style="padding-left: 3px; padding-right: 3px; border-left: 1px solid #CBE1E8 !important">' +
                '<tr><td colspan=2 style="vertical-align: bottom">Dash style</td>' +
                '</tr><tr><td colspan=2>' + rshIcons[2] +
                '<select id="selRSHDash" class="rsh-dropbar-panel" style="border-color: #B4B4B4"></select></td>' +
                '</tr><tr>' +
                '<td style="vertical-align: bottom">Dash length</td><td style="vertical-align: bottom">Gap size</td>' +
                '</tr><tr>' +
                '<td>' + rshIcons[4] +
                '<input type="number" id="numRSHDashSizeScale" style="border-radius: 3px; background-color: #EFEFEF;" class="rsh-dropbar-panel" min="0" max="100" value="10" step="1" title="Relative length of dash" disabled \></td>' +
                '<td>' + rshIcons[5] +
                '<input type="number" id="numRSHGapScale" style="border-radius: 3px; background-color: #EFEFEF;" class="rsh-dropbar-panel" min="0" max="100" value="10" step="1" title="Relative distance between dashes" disabled \></td>' +
                '</tr></table></td>' +
                '</tr><tr>' +
                '<td>' + rshIcons[0] +
                '<input type="number" id="numRSHScaleWidth" style="border-radius: 3px" class="rsh-dropbar-panel" min="1" max="50" value="10" step="1" title="Line weight (relative)"></td>' +
                '<td>' + rshIcons[1] +
                '<input type="number" id="numRSHOpacity" style="border-radius: 3px" class="rsh-dropbar-panel" min="0" max="1" value="0.5" step="0.1" title="Color opacity (0–1)"></td>' +
                '</tr><tr>' +
                '<td colspan=2 style="vertical-align: bottom">End cap</td>' +
                '<tr><td>' + '' +
                '<select id="selRSHCap" class="rsh-dropbar-panel" style="border-color: #B4B4B4; width: 69px;"></select></td>' +
                '<td><input type="checkbox" id="cbRSHUnderRoads" class="btn" style="margin: 0px 7px 7px 5px;"><label for="cbRSHUnderRoads" class="fa fa-road fa-2x" data-toggle="tooltip" title="Draw highlight color under segments rather than on top" style="color: #333; background-color: gold; padding: 1px 0px 1px;"></label></td>' +
                '</tr></table>' +
                '</div></div>');


            $("div#divRSHmainPanel [data-toggle=tooltip], div#divRSHdropbarPanel [data-toggle=tooltip]").tooltip({
                placement: 'auto top',
                delay: {
                    show: 1100,
                    hide: 100
                },
                html: true,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="my-tooltip-header"><b></b></div><div class="my-tooltip-body tooltip-inner" style="font-weight: 600; !important"></div></div>'
            });
        };
        //---------------------------------------
        // Insert UI into side-panel of WME under RSel tab
        setupRSHInterface();
        toggleDropBarMenu(true);
        //---------------------------------------
        // Retrieve any data from saved sessionStorage
        var rsh = checkForSessionSave();
        //---------------------------------------

        var rsh_saved = JSON.parse(localStorage.RSHighlights),
            highlighterNames = Object.keys(rsh_saved).sort();

        for (var k of highlighterNames) {
            document.getElementById("selRSHighlighter").add(new Option(k));
        }

        // select from highlighter list if name is present
        if (rsh.highlighterName)
            document.getElementById("selRSHighlighter").value = rsh.highlighterName;

        //---------------------------------------

        var d, c, dashSelection = document.getElementById("selRSHDash"),
            capSelection = document.getElementById("selRSHCap");

        for (d = 0; d < rsh.presets.lineAttributes.strokeDashstyle.length; d++) {
            dashSelection.add(new Option(rsh.presets.lineAttributes.strokeDashstyle[d]));
        }

        for (c = 0; c < rsh.presets.lineAttributes.strokeLinecap.length; c++) {
            capSelection.add(new Option(rsh.presets.lineAttributes.strokeLinecap[c]));
        }

        return rsh;
    }; //end setup
    //--------------------------------------------------------------------------
    rsh = InitRSelHighlights();
    //--------------------------------------------------------------------------
    // Update panel
    updatePanelFromPrefs();
    //rsh.recreateExpressionText();
    updateExprMenu(rsh.loadedSavedSession);
    if (rsh.loadedSavedSession) disableEraseButton();
    populateStylesMenu();
    rsh_seg = [];
    //----------------------------------------------
    userTraceBgRoads = document.getElementById('cbRSHTraceBgRoads').checked;
    userEditableOnly = !(!document.getElementById('cbRSEditable').checked || document.getElementById('cbRSHIgnoreEditableChkBx').checked);
    userSuppressRoad = document.getElementById('cbRSHSuppRoad').checked;
    userFallback = document.getElementById('cbRSHLayerIndexFallback').checked;
    userNoOverlapScaling = document.getElementById('cbRSHNoOverlapScaling').checked;
    //----------------------------------------------
    // Add Road Selector Highlights layer to map
    rsh_OL = initHighlightsLayer();
    rsh_OLu = initUnderRoadsLayer();

    // Setup event listeners/triggers
    //--------------------------------------------------------------------------
    // Main panel
    //--------------------------------------------------------------------------
    var closeExprMenu = function() {
        document.getElementById('btnRSHmenu').classList.remove('open');
        window.removeEventListener('click', closeExprMenu, false);
        //$('.rsh-expr-menu').css('display','');
        //document.getElementsByClassName('rsh-expr-menu')[0].removeEventListener('mouseleave', closeExprMenu, false);
    };

    document.getElementById('btnRSHCount').addEventListener('click', function(e) {
        if (document.getElementById('btnRSHmenu').classList.toggle('open')) {
            updateExprMenu();
            setTimeout(function() {
                window.addEventListener('click', closeExprMenu, false);
            }, 100);
        } else {
            setTimeout(function() {
                window.removeEventListener('click', closeExprMenu, false);
                //$('.rsh-expr-menu').css('display','');
                //document.getElementsByClassName('rsh-expr-menu')[0].addEventListener('mouseleave', closeExprMenu, false);
            }, 100);
        }
    }, false);
/*
    document.getElementById('btnRSHCount').addEventListener('mouseenter', function() {
        updateExprMenu();
        //document.getElementById('btnRSHmenu').classList.add('open');
        document.getElementsByClassName('rsh-expr-menu')[0].style.display = 'block';
        setTimeout(function() {
            document.getElementsByClassName('rsh-expr-menu')[0].addEventListener('mouseleave', closeExprMenu, false);
            //window.addEventListener('click', closeExprMenu, false);
        }, 100);
    }, false);
*/

    //--------
    document.getElementById("selRSHColors").addEventListener('click', function() {
        document.getElementById("selRSHColors").onchange = function(e) {
            if (!haltBit) {
                //console.debug(e);
                rsh.triggerUpdate = true;
                updatePrefsFromPanel();
                updateHighlighterColorButton();
                drawHighlights([],rsh.idx);
            } else {
                document.getElementById("selRSHColors").onchange = null;
            }
        };
    }, false);
    //-----
    document.getElementById('btnRSHighlight').onclick = function() {
        if (userTraceBgRoads) {
            document.getElementById('selRSHTraceColor').setAttribute('value',document.getElementById('selRSHTraceColor').value);
            rsh.triggerUpdate = true;
            //updatePrefsFromPanel();
            drawHighlights([],true);
        } else {
            rsh.triggerUpdate = true;
            drawHighlights([],rsh.idx);
        }
        updateHighlighterColorButton();
    };
    document.getElementById('btnRSHighlight').ondblclick = function() {
        requestAnimationFrame(function() {
            Highlight(true);
        })
    }; //destroy all features then highlight
    //--------
    document.getElementById('btnRSHAdd').onclick = addNewHighlighter;
    document.getElementById('btnRSHSubtract').onclick = deleteHighlighter;
    document.getElementById('btnRSHClearTop').onclick = eraseHighlight;
    document.getElementById('btnRSHClearAll').onclick = clearAllHighlights;
    document.getElementById('icnRSHmoreOpts').onclick = function() {
        ($('#rshMoreOptions').css('display') === 'none') ? $('#rshMoreOptions').css('display', 'block') : $('#rshMoreOptions').css('display', 'none');
    };
    document.getElementById('aRSHdropbarLinkHide').onclick = function() {
        toggleDropBarMenu(true);
    };
    document.getElementById('aRSHdropbarLinkShow').onclick = function() {
        toggleDropBarMenu(false);
    };
    //--------------------------------------------------------------------------
    // Middle additional options panel
    //--------------------------------------------------------------------------
    document.getElementById('cbRSHSuppRoad').onclick = function() {
        userSuppressRoad = this.checked;
        if (this.checked) localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&s|$/, '&s'); //suppress
        else localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&s/, '');
        rsh.triggerUpdate = true;
        requestAnimationFrame(function() {
            Highlight(true);
        });
    };

    document.getElementById('cbRSHTraceBgRoads').onclick = function() {
        userTraceBgRoads = this.checked;
        if (userTraceBgRoads) localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&t|$/, '&t'); //trace
        else localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&t/, '');
        document.getElementById('selRSHTraceColor').setAttribute('value',document.getElementById('selRSHTraceColor').value);
        rsh.triggerUpdate = true;
        //updatePrefsFromPanel();
        requestAnimationFrame(function() {
            Highlight(true);
        });
    };

    document.getElementById('selRSHTraceColor').addEventListener('click', function() {
        this.onchange = function(e) {
            var trcolor = this.value;
            localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/=#[\w\d]{6}/g,'').replace(/(&t)(?:=#[\w\d]{6})?|$/, '$1=' + trcolor); //trace trace color
            rsh.triggerUpdate = true;
            drawHighlights([],'trace');
            this.onchange = null;
        };
    }, false);

    document.getElementById('cbRSHIgnoreEditableChkBx').onclick = function() {

        userEditableOnly = !(!document.getElementById("cbRSEditable").checked || this.checked);
        if (!userEditableOnly) localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&e|$/, '&e'); //ignore editable only
        else localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&e/, '');
        requestAnimationFrame(function() {
            Highlight('a');
        }); //recheck all rules and only draw if feature does not exist
    };

    document.getElementById("cbRSEditable").addEventListener('click', function() {
        userEditableOnly = !(!this.checked || document.getElementById('cbRSHIgnoreEditableChkBx').checked);
        requestAnimationFrame(function() {
            Highlight('a');
        }); //recheck all rules and only draw if feature does not exist
    }, false);

    document.getElementById('cbRSHLayerIndexFallback').onclick = function() {
        userFallback = this.checked;
        if (userFallback) {
            localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&f|$/, '&f'); //fallback
            W.map.getOLMap().setLayerIndex(rsh_OLu, W.map.getOLMap().getLayerIndex(rsh_OL)-1);
            rsh_OLu.setZIndex(W.map.roadLayers[0].getZIndex()-1);
        } else {
            localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&f/, '');
            W.map.getOLMap().setLayerIndex(rsh_OLu, W.map.getOLMap().getLayerIndex(W.map.roadLayers[0])-1);
        }
        rsh.triggerUpdate = true;
        requestAnimationFrame(function() {
            Highlight(true);
        });
    };

    document.getElementById('cbRSHNoOverlapScaling').onclick = function() {
        userNoOverlapScaling = this.checked;
        if (this.checked) localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&a|$/, '&a'); //auto-scaling of overlaps
        else localStorage.RSHighlights_Prefs = localStorage.RSHighlights_Prefs.replace(/&a/, '');
        rsh.triggerUpdate = true;
        requestAnimationFrame(function() {
            Highlight(true);
        });
    };

    document.getElementById('btnRSHhideSettings').onclick = function() {
        this.children[0].classList.toggle('fa-caret-up');
        this.children[0].classList.toggle('fa-caret-down');

        if (this.children[0].classList.contains('fa-caret-up')) {
            this.parentNode.children[0].style.display = 'block';
            this.style.marginTop = '0px';
            this.style.height = '9px';
        } else {
            this.parentNode.children[0].style.display = 'none';
            this.style.marginTop = '4px';
            this.style.height = '7px';
        }
    };

    //--------------------------------------------------------------------------
    // Middle additional features panel
    //--------------------------------------------------------------------------

    var closeMiniMenu = function (ev, node) {
        if ((ev === undefined && node === undefined) || ev)
            node = document.querySelector('.rsh-minimenu.rsh-show');

        if (node) node.classList.remove('rsh-show');
        window.removeEventListener('click', closeMiniMenu, false);
    };

    var showMiniMenu = function (node) {
        node.classList.add('rsh-show');
        setTimeout(function(){ window.addEventListener('click', closeMiniMenu, false); }, 200);
    };

    var toggleMiniMenu = function (node) {
        var toggleVal = node.classList.toggle('rsh-show');
        if (toggleVal)
            setTimeout(function(){ window.addEventListener('click', closeMiniMenu, false); }, 200);
        else
            window.removeEventListener('click', closeMiniMenu, false);
        return toggleVal;
    };

    var addMiniMenu = function(obj) {
        var miniMenu = document.createElement('div');

        miniMenu.id = 'rshMiniMenu_' + obj.suffix;
        miniMenu.className = 'rsh-minimenu';
        miniMenu.innerHTML = obj.html + '<span class="fa fa-caret-down"></span>';
        obj.parent.appendChild(miniMenu);

        return miniMenu;
    };

    document.getElementById('selRSHighlighter').onchange = function() {
        if (!!this.value && this.value !== '') {
            $('#applyRSHighlighter').css('color', '#2196F3');
        } else {
            $('#applyRSHighlighter').css('color', '');
        }
    };

    var rshBtn2Elements = document.getElementsByClassName('rsh-btn2'), btn;
    for (btn = rshBtn2Elements.length; btn--;) {
        rshBtn2Elements[btn].addEventListener('mouseenter', function(){
            var btnName = this.getAttribute('data-covertip'),
                coverTipEl = document.getElementById('textRSHCoverTip');

            coverTipEl.innerHTML = btnName;
            coverTipEl.classList.add('rsh-show');

            setTimeout(function(){
                document.getElementById('textRSHCoverTip').classList.remove('rsh-show');
            }, 1000);
        }, false);

        rshBtn2Elements[btn].addEventListener('mouseleave', function(){
            document.getElementById('textRSHCoverTip').classList.remove('rsh-show');
        }, false);
    }

    document.getElementById('selRSHighlighter').addEventListener('mouseenter',function(){
        document.getElementById('textRSHCoverTip').classList.remove('rsh-show');
        setTimeout(function(){
            document.getElementById('textRSHCoverTip').innerHTML = '';
        },200);
    }, false);

    //--------------------
    var applyRSHighlighter = function(mergeSet) {
        var rsh_saved = JSON.parse(localStorage.RSHighlights.replace(/("#[\w\d]{6})\s?/ig, '$1')),
            highlighterName = document.getElementById("selRSHighlighter").value,
            numInSet;

        if (mergeSet) {
            numInSet = rsh.HIGHLIGHTS.length;
            rsh.HIGHLIGHTS = rsh.HIGHLIGHTS.concat(rsh_saved[highlighterName].HIGHLIGHTS);
            rsh.lastIdx = rsh.HIGHLIGHTS.length - 1;
            //rsh.idx = rsh.lastIdx;
            for (var i = numInSet, iLength = rsh.lastIdx; i<=iLength; i++) {
                rsh.rulesStack.push(i);
            }

            rsh.loadedSavedSession = true;
            rsh.triggerUpdate = true;
            rsh.HIGHLIGHTS.forEach(function(a){a.rule.tryOnce = false;});
        } else {
            RSelExprParser.rselButtons.clear();
            rsh.importHighlights(rsh_saved[highlighterName]);
            rsh.addStyles();
        }
         $('#applyRSHighlighter').css('color', '');
        rsh.highlighterName = highlighterName;
        updatePanelFromPrefs();
        drawHighlights([],'import');

        if (document.getElementById('btnRSHhideSettings').children[0].classList.contains('fa-caret-up'))
            document.getElementById('btnRSHhideSettings').click();

        setTimeout(function(){document.getElementById('btnRSHCount').click()}, 100);
    };

    var applyNode = addMiniMenu({parent: document.getElementById('applyRSHighlighter'), suffix: 'apply', html: '<ul><li>Add to Current Set</li><li>Load as New Set</li></ul>'});
    document.getElementById('applyRSHighlighter').onclick = function() {
        if (document.getElementById("selRSHighlighter").selectedIndex !== 0) {
            var toggleVal = toggleMiniMenu(applyNode),
                applyOptionNodes = document.querySelectorAll('#rshMiniMenu_apply>ul>li');

            if (toggleVal) {
                applyOptionNodes[0].onclick = function() {
                    applyRSHighlighter(true);
                    setTimeout(closeMiniMenu, 100);
                    this.onclick = null;
                };
                applyOptionNodes[1].onclick = function() {
                    applyRSHighlighter(false);
                    setTimeout(closeMiniMenu, 100);
                    this.onclick = null;
                };
            }
        } else {
            closeMiniMenu(null, applyNode);
        }
    };

    document.getElementById('saveRSHighlighter').onclick = function() {
        $('#applyRSHighlighter').css('color', '');
        var rsh_saved = JSON.parse(localStorage.RSHighlights),
            selectedName = document.getElementById('selRSHighlighter').value;

        var highlighterName = prompt('Please enter a name for this highlighter:', selectedName),
            addHighlighterOpt = document.createElement('option');

        if (highlighterName !== null && highlighterName !== '') {
            rsh_saved[highlighterName] = { HIGHLIGHTS: rsh.HIGHLIGHTS };
            localStorage.RSHighlights = JSON.stringify(rsh_saved).replace(/("#[\w\d]{6})\s?/ig, '$1');

            var highlighterSelectEl = document.getElementById('selRSHighlighter'),
                matchIndex = null, o,
                highlighters = highlighterSelectEl.options;

            for (o = highlighters.length; o--;) {
                if (new RegExp('^' + highlighterName + '$').test(highlighters[o].value)) {
                    matchIndex = o;
                    break;
                }
            }
            if (matchIndex !== null) {
                highlighterSelectEl.options[matchIndex].remove();
            }

            addHighlighterOpt.appendChild(document.createTextNode(highlighterName));
            highlighterSelectEl.appendChild(addHighlighterOpt);
            highlighterSelectEl.selectedIndex = highlighterSelectEl.options.length - 1;
            $('#applyRSHighlighter').css('color', '');

            rsh.highlighterName = highlighterName;
        }
    };

    document.getElementById('delRSHighlighter').onclick = function() {
        $('#applyRSHighlighter').css('color', '');
        var rsh_saved = JSON.parse(localStorage.RSHighlights),
            highlighterSelectEl = document.getElementById("selRSHighlighter"),
            highlighterName = highlighterSelectEl.value,
            selIdx = highlighterSelectEl.selectedIndex,
            userConfirm;

        if (selIdx) { //prevent the first option from being deleted
            userConfirm = confirm('Are you sure that you want to delete "' + highlighterName + '"?');
            if (userConfirm) {
                highlighterSelectEl.removeChild(highlighterSelectEl.options[selIdx]);
                delete rsh_saved[highlighterName];
                highlighterSelectEl.selectedIndex = 0;
                localStorage.RSHighlights = JSON.stringify(rsh_saved);
            }
        }
    };

    document.getElementById('importRSHighlighter').onclick = function() {
        var str = prompt('Paste exported RSel Highlights text string:'),
            rsh_import, rsh_saved, msgStr, importedSomething = false,
            selectedName = document.getElementById('selRSHighlighter').value,
            htmlStr = '<div id="rshMenuNote" style="position: absolute;bottom: 110%;width: 100px;left: -44px;white-space: normal;background-color: rgba(0,0,0,0.85);border-radius: 5px;color: white;font-size: 10px;padding: 5px;">';

        if (str !== null && str !== '') {
            rsh_import = JSON.parse(str.replace(/("#[\w\d]{6})\s?/ig, '$1')); //remove space after color HEX, in case it was copied from slack
            if (rsh_import.constructor === Object) {
                for (var r in rsh_import) { //do a quick check
                    if (!rsh_import[r].HIGHLIGHTS) {
                        importedSomething = false;
                        break;
                    } else {
                        importedSomething = true;
                    }
                }

                if (importedSomething) {
                    // Check for pre-existing names
                    var matchIndex = [],
                        o, i,
                        importNames = Object.keys(rsh_import),
                        highlighters = document.getElementById('selRSHighlighter').options;

                    for (o = highlighters.length; o--;) {
                        for (i = importNames.length; i--;) {
                            if (new RegExp('^' + importNames[i] + '$').test(highlighters[o].value)) {
                                matchIndex.push(o);
                            }
                        }
                    }
                    //remove duplicate names
                    if (matchIndex.length) {
                        for (var m = 0, mLength = matchIndex.length; m < mLength; m++) {
                            highlighters[matchIndex[m]].remove();
                        }
                    }
                    //add names for all imported highlighters
                    for (var n of importNames) {
                        document.getElementById("selRSHighlighter").add(new Option(n));
                    }

                    //get saved data from localStorage
                    rsh_saved = JSON.parse(localStorage.RSHighlights);

                    //merge saved data
                    $.extend(true, rsh_saved, rsh_import);
                    console.debug(rsh_saved);

                    // save to localStorage
                    localStorage.RSHighlights = JSON.stringify(rsh_saved);

                    //put up import note
                    var numImported = importNames.length;
                    msgStr = 'Imported ' + numImported + ' set(s) of highlighters';
                    setTimeout(function() {
                        $(this).append(htmlStr + msgStr + '</div>');
                        document.getElementById('rshMenuNote').onclick = function(){this.remove()};
                    }, 300);
                    setTimeout(function() {
                        $('#rshMenuNote').remove()
                    }, 5000);

                    $('#applyRSHighlighter').css('color', '#2196F3');
                    document.getElementById("selRSHighlighter").selectedIndex = Object.keys(rsh_saved).length;
                }
            } else {
                htmlStr = '<div id="rshMenuNote" style="position: absolute; bottom: 110%; width: 100px; left: -44px; white-space: normal; background-color: rgba(0,0,0,0.85); border-radius: 5px; color: red; font-size: 10px; padding: 5px;">';
                msgStr = 'Import unsuccessful. The pasted string did not contain the expected data.';
                setTimeout(function() {
                    $(this).append(htmlStr + msgStr + '</div>');
                    document.getElementById('rshMenuNote').onclick = function(){this.remove()};
                }, 300);
                setTimeout(function() {
                    $('#rshMenuNote').remove()
                }, 5000);
            }

        } //else prompt was cancelled
    };

    document.getElementById('exportRSHighlighter').onclick = function(ev){
        $('#applyRSHighlighter').css('color', '');
        exportRSelHighlighter(ev);
    };

    document.getElementById('exportAllRSHighlighter').onclick = function() {
        $('#applyRSHighlighter').css('color', '');
        var rsh_saved = JSON.parse(localStorage.RSHighlights),
            htmlStr = '<div id="rshMenuNote" style="position: absolute;bottom: 110%;width: 100px;left: -52px;white-space: normal;background-color: rgba(0,0,0,0.85);border-radius: 5px;color: white;font-size: 10px;padding: 5px;">';

        copyToClipboard(JSON.stringify(rsh_saved).replace(/("#[\w\d]{6})\s?/ig, '$1'));

        setTimeout(function() {
            $('#exportAllRSHighlighter').append(htmlStr + 'Data for all saved highlighters were copied to your clipboard</div>');
            document.getElementById('rshMenuNote').onclick = function(){this.remove()};
        }, 300);
        setTimeout(function() {
            $('#rshMenuNote').remove()
        }, 5000);

    };

    //--------------------------------------------------------------------------
    // Line style panel
    //--------------------------------------------------------------------------
    document.getElementById("selRSHDash").addEventListener('click', function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            updatePrefsFromPanel();
            updateDashButtons();
            requestAnimationFrame(Highlight);
            this.onchange = null;
        };
    }, false);
    //--------
    document.getElementById("selRSHCap").addEventListener('click', function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            //updatePrefsFromPanel();
            requestAnimationFrame(Highlight);
            this.onchange = null;
        };
    }, false);
    //--------
    document.getElementById('cbRSHUnderRoads').onclick = function() {
        document.getElementById('numRSHOpacity').value = 0.8;
        document.getElementById('selRSHCap').selectedIndex = 1;
        rsh.triggerUpdate = true;
        setTimeout(function(){
            updatePrefsFromPanel();
            Highlight();
        },50);
    };

    document.getElementById("numRSHOpacity").onfocusin = function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            this.onblur = function() {
                //updatePrefsFromPanel();
                requestAnimationFrame(Highlight);
                this.onchange = null;
                this.onblur = null;
            };
        };
    };
    //--------
    document.getElementById("numRSHScaleWidth").onfocusin = function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            this.onblur = function() {
                //updatePrefsFromPanel();
                requestAnimationFrame(Highlight);
                this.onchange = null;
                this.onblur = null;
            };
        };
    };

    //--------
    document.getElementById("numRSHDashSizeScale").onfocusin = function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            this.onblur = function() {
                //updatePrefsFromPanel();
                requestAnimationFrame(Highlight);
                this.onchange = null;
                this.onblur = null;
            };
        };
    };
    //--------
    document.getElementById("numRSHGapScale").onfocusin = function() {
        this.onchange = function() {
            rsh.triggerUpdate = true;
            this.onblur = function() {
                //updatePrefsFromPanel();
                requestAnimationFrame(Highlight);
                this.onchange = null;
                this.onblur = null;
            };
        };
    };

    //------------------------------------------------------------------------
    window.addEventListener("beforeunload", function() {
        sessionStorage.RSHighlights = JSON.stringify(rsh);
    }, false);


    //------------------------------------------------------------------------
    // Event listeners to refresh map highlights
    //------------------------------------------------------------------------
    var timeoutCanceller;
    var updateMapExtentHighlights = function(evt) {
        clearTimeout(timeoutCanceller);
        //console.debug('WMERSH','********* Timeout Cancelled **********');
        setTimeout(function() {
            //console.debug('WMERSH','Highlight() - 1');
            Highlight(); //assumes no changes in rules, highlight styles, etc
            timeoutCanceller = setTimeout(function() {
                //console.debug('WMERSH','Highlight() - 2');
                Highlight();
                timeoutCanceller = setTimeout(function() {
                    //console.debug('WMERSH','Highlight() - 3');
                    Highlight();
                    /*timeoutCanceller = setTimeout(function() {
                        Highlight(null)
                    }, 800);*/
                }, 800);
            }, 800);
        }, 100);
    };

    var updateUndoHighlights = function(evt) {
        //console.debug(evt);
        evt.object.actions.map(function(a) {
            if (a.changedSegStates) {
                a.changedSegStates.map(function(segID) {
                    if (segID && segID.constructor === Number) {
                        rsh_OL.destroyFeaturesBy('id', segID);
                        rsh_OLu.destroyFeaturesBy('id', segID);
                    }
                });
                Highlight();
            } else if (a.segment && a.segment.attributes && a.segment.attributes.id) {
                rsh_OL.destroyFeaturesBy('id', a.segment.attributes.id);
                rsh_OLu.destroyFeaturesBy('id', a.segment.attributes.id);
                Highlight();
            }
        });
    };

    var updateAfterSaveHighlights = function(evt) {
        Highlight(true);
        if (userFallback) rsh_OLu.setZIndex(W.map.roadLayers[0].getZIndex()-1);
    };

    var updateModifiedHighlights = function(evt) {
        var segID = evt.feature.model.attributes.id;
        rsh_OL.destroyFeaturesBy('id', segID);
        rsh_OLu.destroyFeaturesBy('id', segID);
        Highlight();
    };

    var toggleHighlightEvents = function(evt) {
        if (!evt.object.getVisibility()) { // layer has been hidden
            evt.object.destroyAllFeatureMaps();
            rsh_OLu.setVisibility(false); //yolked layer
            rsh_OLu.destroyAllFeatureMaps();
            rsh.showSessionHighlights = false;
            W.map.events.unregister('moveend', W.map, updateMapExtentHighlights);
            W.model.actionManager.events.unregister('afterundoaction', null, updateUndoHighlights);
            W.model.actionManager.events.unregister('afterclearactions', null, updateAfterSaveHighlights);
            W.map.segmentLayer.events.unregister('featuremodified', W.model.segments.objects, updateModifiedHighlights);
        } else {
            rsh_OLu.setVisibility(true); //yolked layer
            rsh.showSessionHighlights = true;
            W.map.events.register('moveend', W.map, updateMapExtentHighlights);
            W.model.actionManager.events.register('afterundoaction', null, updateUndoHighlights);
            W.model.actionManager.events.register('afterclearactions', null, updateAfterSaveHighlights);
            W.map.segmentLayer.events.register('featuremodified', W.model.segments.objects, updateModifiedHighlights);
        }
    };

    rsh_OL.events.register('visibilitychanged', W.map.layers, toggleHighlightEvents);

    rsh_OL.setVisibility(rsh.showSessionHighlights);
    rsh_OLu.setVisibility(rsh.showSessionHighlights);
    //------------------------------------------------------------------------
    zoomLevel = W.map.getZoom();
    setTimeout(Highlight, 4000);
}

/*//////////////////////////////////////////////////////////////////////////*/
var waitForWMERSel = function() {
    var waitCount = 0,
        tryInitRSH = function() {
            try {
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.RoadSelector && WazeWrap.Ready) {
                    RSel = unsafeWindow.RoadSelector;
                    if (typeof $ === 'undefined') {
                        $ = unsafeWindow.$;
                        W = unsafeWindow.W;
                    }
                    WazeWrap.Interface.ShowScriptUpdate("WME Road Selector Highlights", GM_info.script.version, updateMessage, "", "https://www.waze.com/forum/viewtopic.php?f=819&t=215990");
                    RSelHighlights(RSel);

                } else {
                    if (waitCount++ < 35)
                        setTimeout(tryInitRSH, 600);
                    else
                        console.error('WME RSel Highlights: Could not link up with WME Road Selector.');
                }
            } catch (err) {
                console.error(err)
            }
        };
    tryInitRSH();
};

setTimeout(waitForWMERSel, 500);
