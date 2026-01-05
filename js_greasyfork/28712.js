// ==UserScript==
// @name         DuelHelper by szymy
// @namespace    skijumpmania.duelhelper
// @version      0.2
// @description  Simple stats comparison
// @author       szymy
// @match        *://*.skijumpmania.com/report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28712/DuelHelper%20by%20szymy.user.js
// @updateURL https://update.greasyfork.org/scripts/28712/DuelHelper%20by%20szymy.meta.js
// ==/UserScript==

(function(w, jQ) {
    var refs = {
        nameClass : "match_report_name",
        expClass : "match_report_exp",
        contentTableClass : "content_table",
        sumTableClass : "sum_points",
        sumImgClass : "sum_points_element_img",
        sumSpanClass : "sum_points_element_span",
        leftColClass : "two_col_left",
        rightColClass : "two_col_right",
        elementsTableClass : "table_small_content",
        equipmentId : "element4",
        skillsId : "element3",
        facilitiesId : "element2",
        hillClass : "hill_report_div"
    };
    var jumpers = [];
    
    function Jumper(nameRef, lvlRef, takeOffRef, flightRef, landingRef, colClass) {
        this.name = null;
        this.lvl = 0;
        this.takeOff = 0;
        this.flight = 0;
        this.landing = 0;
        this.nameRef = nameRef;
        this.lvlRef = lvlRef;
        this.takeOffRef = takeOffRef;
        this.flightRef = flightRef;
        this.landingRef = landingRef;
        this.sumTakeOff = 0;
        this.sumFlight = 0;
        this.sumLanding = 0;
        this.sumTakeOffRef = null;
        this.sumFlightRef = null;
        this.sumLandingRef = null;
        this.colClass = colClass;
        this.hasEquipment = false;
        this.hasSkills = false;
        this.hasFacilities = false;
        this.hasHill = false;
        this.equipment = {
            takeOff : 0,
            flight : 0,
            landing : 0,
            takeOffRef : null,
            flightRef : null,
            landingRef : null
        };
        this.skills = {
            takeOff : 0,
            flight : 0,
            landing : 0,
            takeOffRef : null,
            flightRef : null,
            landingRef : null
        };
        this.facilities = {
            takeOff : 0,
            flight : 0,
            landing : 0,
            takeOffRef : null,
            flightRef : null,
            landingRef : null
        };
        this.hill = {
            takeOff : 0,
            flight : 0,
            landing : 0,
            takeOffRef : null,
            flightRef : null,
            landingRef : null
        };
        this.setProperties = function() {
            if (this.nameRef) {
                this.name = this.nameRef.innerText.trim();
            }
            this.lvl = this.getPoints(this.lvlRef);
            this.takeOff = this.getPoints(this.takeOffRef);
            this.flight = this.getPoints(this.flightRef);
            this.landing = this.getPoints(this.landingRef);
        };
        this.setElementsProperties = function(hasElements, elementsGroup, elementsId) {
            if (!this[hasElements]) {
                return;
            }
            var sumTable = jQ("." + this.colClass + " div[id*='" + elementsId + "']").parents("." + refs.elementsTableClass).find("." + refs.sumTableClass);
            if (!sumTable.length) {
                return;
            }
            var sumPoints = sumTable.find("." + refs.sumSpanClass);
            if (sumPoints.length == 3) {
                this.setElementsGroup(elementsGroup, sumPoints[0], sumPoints[1], sumPoints[2]);
            }
        };
        this.setElementsGroup = function(elementsGroup, takeOffRef, flightRef, landingRef) {
            this[elementsGroup].takeOffRef = takeOffRef;
            this[elementsGroup].flightRef = flightRef;
            this[elementsGroup].landingRef = landingRef;
            this[elementsGroup].takeOff = this.getPoints(this[elementsGroup].takeOffRef);
            this[elementsGroup].flight = this.getPoints(this[elementsGroup].flightRef);
            this[elementsGroup].landing = this.getPoints(this[elementsGroup].landingRef);
        };
        this.setHillProperties = function() {
            if (!this.hasHill) {
                return;
            }
            var table = 0;
            if (this.colClass === refs.rightColClass) {
                table = 1;
            }
            var hillPoints = jQ("." + refs.hillClass + " table").eq(table).find("td");
            if (hillPoints.length >= 6) {
                this.setElementsGroup("hill", hillPoints[1 - table], hillPoints[3 - table], hillPoints[5 - table]);
            }
        };
        this.setSumPointsRef = function(takeOffRef, flightRef, landingRef) {
            this.sumTakeOffRef = takeOffRef;
            this.sumFlightRef = flightRef;
            this.sumLandingRef = landingRef;
            this.setPoints(this.sumTakeOff, this.sumTakeOffRef);
            this.setPoints(this.sumFlight, this.sumFlightRef);
            this.setPoints(this.sumLanding, this.sumLandingRef);
        };
        this.setPoints = function(points, pointsRef) {
            if (!pointsRef) {
                return;
            }
            pointsRef.innerText = points;
        };
        this.getPoints = function(pointsRef) {
            if (!pointsRef) {
                return 0;
            }
            var txt = pointsRef.innerText;
            var bonusPoints = 0;
            var matchBonusPoints = txt.match(/\(\+\s*\d+\)/);
            if (matchBonusPoints) {
                bonusPoints = parseInt(matchBonusPoints[0].replace(/\D+/g, ""));
                txt = txt.replace(matchBonusPoints[0], "");
            }
            return parseInt(txt.replace(/\D+/g, "")) + bonusPoints;
        };
        this.formatPoints = function(points) {
            if (points > 0) {
                return "+" + points;
            }
            return points;
        };
        this.sumPoints = function() {
            this.sumTakeOff = this.takeOff + this.equipment.takeOff + this.skills.takeOff + this.facilities.takeOff + this.hill.takeOff;
            this.sumFlight = this.flight + this.equipment.flight + this.skills.flight + this.facilities.flight + this.hill.flight;
            this.sumLanding = this.landing + this.equipment.landing + this.skills.landing + this.facilities.landing + this.hill.landing;
        };
        this.updateSumPoints = function(takeOff, flight, landing) {
            this.sumTakeOffRef.innerText += " (" + this.formatPoints(this.sumTakeOff - takeOff) + ")";
            this.sumFlightRef.innerText += " (" + this.formatPoints(this.sumFlight - flight) + ")";
            this.sumLandingRef.innerText += " (" + this.formatPoints(this.sumLanding - landing) + ")";
        };
        this.checkElements = function() {
            this.hasEquipment = jQ("." + this.colClass + " div[id*='" + refs.equipmentId + "']").length > 0;
            this.hasSkills = jQ("." + this.colClass + " div[id*='" + refs.skillsId + "']").length > 0;
            this.hasFacilities = jQ("." + this.colClass + " div[id*='" + refs.facilitiesId + "']").length > 0;
            this.hasHill = jQ("." + refs.hillClass + " table").length > 0;
        };
        this.init = function() {
            this.setProperties();
            this.checkElements();
            this.setElementsProperties("hasEquipment", "equipment", refs.equipmentId);
            this.setElementsProperties("hasSkills", "skills", refs.skillsId);
            this.setElementsProperties("hasFacilities", "facilities", refs.facilitiesId);
            this.setHillProperties();
            this.sumPoints();
        }
    };
    
    function createJumpers() {
        var name = jQ("div[class*='" + refs.nameClass + "']");
        var exp = jQ("." + refs.expClass + " span");
        var stats = jQ("." + refs.contentTableClass + ":first td");
        if (stats.length >= 12 && stats.length <= 20) {
            jumpers[0] = new Jumper(name[0], exp[0], stats[1], stats[5], stats[9], refs.leftColClass);
            jumpers[1] = new Jumper(name[1], exp[1], stats[2], stats[6], stats[10], refs.rightColClass);
        } else if (stats.length == 36) {
            jumpers[0] = new Jumper(name[0], exp[0], stats[17], stats[21], stats[25], refs.leftColClass);
            jumpers[1] = new Jumper(name[1], exp[1], stats[18], stats[22], stats[26], refs.rightColClass);
        }
        if (jumpers.length == 2) {
            jumpers[0].init();
            jumpers[1].init();
        }
    }
    
    function compareJumpers() {
        if (jumpers.length != 2) {
            return;
        }
        var jumper1 = jumpers[0];
        var jumper2 = jumpers[1];
        compareProperties(jumper1, jumper2);
        compareProperties(jumper1.equipment, jumper2.equipment);
        compareProperties(jumper1.skills, jumper2.skills);
        compareProperties(jumper1.facilities, jumper2.facilities);
        compareProperties(jumper1.hill, jumper2.hill);
        comparePoints(jumper1.lvl, jumper1.lvlRef, jumper2.lvl, jumper2.lvlRef);
        comparePoints(jumper1.sumTakeOff, jumper1.sumTakeOffRef, jumper2.sumTakeOff, jumper2.sumTakeOffRef);
        comparePoints(jumper1.sumFlight, jumper1.sumFlightRef, jumper2.sumFlight, jumper2.sumFlightRef);
        comparePoints(jumper1.sumLanding, jumper1.sumLandingRef, jumper2.sumLanding, jumper2.sumLandingRef);
        jumper2.updateSumPoints(jumper1.sumTakeOff, jumper1.sumFlight, jumper1.sumLanding);
    }
    
    function compareProperties(obj1, obj2) {
        comparePoints(obj1.takeOff, obj1.takeOffRef, obj2.takeOff, obj2.takeOffRef);
        comparePoints(obj1.flight, obj1.flightRef, obj2.flight, obj2.flightRef);
        comparePoints(obj1.landing, obj1.landingRef, obj2.landing, obj2.landingRef);
    }
    
    function comparePoints(points1, pointsRef1, points2, pointsRef2) {
        if (points1 == points2) {
            highlightPoints(pointsRef1, "#FFFFFF");
            highlightPoints(pointsRef2, "#FFFFFF");
            return;
        }
        if (points1 < points2) {
            highlightPoints(pointsRef1, "#FF0000", "#FFFFFF");
            highlightPoints(pointsRef2, "#00FF00");
            return;
        }
        highlightPoints(pointsRef1, "#00FF00");
        highlightPoints(pointsRef2, "#FF0000", "#FFFFFF");
    }
    
    function highlightPoints(pointsRef, bgColor, color) {
        if (!pointsRef) {
            return;
        }
        pointsRef.style.backgroundColor = bgColor;
        if (color) {
            pointsRef.style.color = color;
        }
    }
    
    function addSummary() {
        if (jumpers.length != 2) {
            return;
        }
        jQ("." + refs.contentTableClass + ":first table tbody").prepend('<tr><td class="default_td_border jumper1" colspan="2"></td><td class="default_td_border jumper2" colspan="2"></td></tr>');
        jQ("." + refs.leftColClass + " ." + refs.sumTableClass).first().clone().addClass("sum_total_points").appendTo(".jumper1");
        jQ("." + refs.rightColClass + " ." + refs.sumTableClass).first().clone().addClass("sum_total_points").appendTo(".jumper2");
        var jumper1 = jQ(".jumper1 ." + refs.sumSpanClass);
        var jumper2 = jQ(".jumper2 ." + refs.sumSpanClass);        
        jumpers[0].setSumPointsRef(jumper1[0], jumper1[1], jumper1[2]);
        jumpers[1].setSumPointsRef(jumper2[0], jumper2[1], jumper2[2]);
        var style = {
            "width" : "80px",
            "margin-right" : "0px",
            "margin-bottom" : "10px"
        };
        jumper1.css(style);
        jumper2.css(style);
    }
    
    (function() {
        createJumpers();
        addSummary();
        compareJumpers();
    })();
    
})(window, window.jQuery);