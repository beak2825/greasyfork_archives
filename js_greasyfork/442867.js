// ==UserScript==
// @name         OL: showWholeTrainingPlan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Verbesserung der Wochenplananzeige des Trainings durch eine kompaktere Darstellung
// @author       König von Weiden
// @match        https://www.onlineliga.de/*
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442867/OL%3A%20showWholeTrainingPlan.user.js
// @updateURL https://update.greasyfork.org/scripts/442867/OL%3A%20showWholeTrainingPlan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;
        let interval = setInterval(showWholeTrainingPlan, timeInterval);

        // WICHTIG: Funktioniert aktuell nur für Wochenpläne mit einem Trainingsplatz!!!

        /* Unser Skript soll nicht auf jeder Seite ausgeführt werden.
        Aus diesem Grund haben wir ein Element <div id="trainingWeektableContainer"> in der Trainingsplanansicht von Onlineliga gewählt, welches nur im Untermenüpunkt Training vorkommt.
        Mit Hilfe der Funktion waitForKeyElements, die mit dem Link unter require im Kopfbereich des Skriptes eingebunden wird, überprüfen wir, ob der entsprechende Div vorhanden ist.
        Falls ja, wird die Funktion showWholeTrainingPlan aufgerufen und unserer Skript startet.*/

        function showWholeTrainingPlan(){
            if($(".ol-scroll-overlay-left").length==1 || $(".ol-scroll-overlay-right").length==1){
                // Zuerst werden die Pfeile zum nach links und nach rechts scrollen entfernt, da wir diese später nicht mehr brauchen werden.
                $(".ol-scroll-overlay-left").remove();
                $(".ol-scroll-overlay-right").remove();

                // Im zweiten Schritt fixieren wir die Zeitleiste neben dem Wochenplan, um eine Layout-Überlappung zu verhinden.
                $(".ol-training-time-labels-left :first-child").attr("style","position:relative;top:11px;");

                /* Beim Wochenplan sind bestimmte Klassen-Namen der Divs für die Breite (1 enstpricht dabei 48px) in der Darstellung des Wochenplans verantwortlich.
                    Aus diesem Grund löschen wir die alte Klasse-Namen und ersetzen diese durch eine niedrigere, damit der Wochenplan kompakter dargestellt wird.
                    Bevor wir die Breiten anpassen, lesen wir noch ein paar Informationen aus, die wir später noch brauchen werden:*/

                // Wir lesen die Div-Spaltenbreite des ursprünglichen Wochenplans aus.
                let lengthOriginalWeektable = String($(".ol-training-weektable-head").attr("class"));
                let lengthOriginalWeektableAsInt = parseInt(lengthOriginalWeektable.match(/\d+/gi));

                // Zusätzlich lesen wir noch die Div-Spaltenbreiten für das ursprüngliche Raster des Wochenplans aus, damit wir es später anpassen können.
                const numberOfDays = $(".ol-training-day-column-head").length;
                let lengthOriginalRasterAsInt = new Array(numberOfDays+1);
                let i;
                for (i=0;i<numberOfDays+1;i++){
                    let lengthOriginalRaster = String($(".ol-training-day-column-sep").eq(i).attr("class"));
                    lengthOriginalRasterAsInt[i] = parseInt(lengthOriginalRaster.match(/\d+/gi));
                }

                // Wir beginnen mit den einzelnen Trainingsblöcken und den dazugehörigen Tagesspalten, in denen sich die Trainingsblöcke befinden.
                $(".ol-training-weektable-block.column-width-3").addClass("column-width-2").removeClass("column-width-3");
                $(".ol-training-weektable-block.column-width-4").addClass("column-width-2").removeClass("column-width-4");
                $(".ol-training-day-column.column-width-3").addClass("column-width-2").removeClass("column-width-3");
                $(".ol-training-day-column.column-width-4").addClass("column-width-2").removeClass("column-width-4");
                $(".ol-training-day-column-edit.column-width-3").addClass("column-width-2").removeClass("column-width-3");
                $(".ol-training-day-column-edit.column-width-4").addClass("column-width-2").removeClass("column-width-4");
                $(".ol-training-day-column-edit.column-width-6").addClass("column-width-2").removeClass("column-width-6");

                /* Dadurch haben wir leider auch die Spalten für die Ligaspiel- und Friendlyaufstellung überschrieben.
                    Im Gegensatz zu den Trainingstagen, wirkt sich eine kompaktere Darstellung dieser Spalten negativ aus, da nun die Gegner- und Spielernamen nicht mehr richtig gelesen werden können.
                    Aus diesem Grund setzen wir die Klassen-Namen dieser Spalten wieder zurück.*/
                $(".ol-training-day-column.column-width-2").eq(0).addClass("column-width-3").removeClass("column-width-2");
                $(".ol-training-day-column.column-width-2").eq(0).addClass("column-width-3").removeClass("column-width-2");

                /* Neben den Trainingsblöcken und Tagesspalten müssen wir noch die Größe der Divs für die Wochentage anpassen.
                    Ausgenommen werden wieder die Spalten für Ligaspiel- und Friendlyaufstellung.*/
                $(".ol-training-day-column-head.column-width-3").addClass("column-width-2").removeClass("column-width-3");
                $(".ol-training-day-column-head.column-width-4").addClass("column-width-2").removeClass("column-width-4");
                $(".ol-training-day-column-head.column-width-6").addClass("column-width-4").removeClass("column-width-6");
                $(".ol-training-day-column-head").eq(0).addClass("column-width-3").removeClass("column-width-2");
                $(".ol-training-day-column-head").eq(1).addClass("column-width-3").removeClass("column-width-2");
                $(".ol-training-day-column-head").eq(8).addClass("column-width-3").removeClass("column-width-2");

                // Höhen der Trainingsblöcke anpassen
                const heightElement = 80;
                const numberTrainingBlocks = $(".ol-training-weektable-block").length;
                for (i=0;i<numberTrainingBlocks;i++){
                    let colorTrainingBlock = $(".ol-training-weektable-block").eq(i).css("background-color");
                    let heightOldTrainingBlock = $(".ol-training-weektable-block").eq(i).outerHeight();
                    let heightNewTraingBlock = (heightOldTrainingBlock/94)*heightElement;
                    $(".ol-training-weektable-block").eq(i).attr("style","height:"+heightNewTraingBlock+"px;background-color:"+colorTrainingBlock+";");
                }

                // Höhe geblockten Trainingsblöcke
                const numberBlockedTrainingBlocks = $(".ol-training-weektable-lockblock").length;
                for (i=0;i<numberBlockedTrainingBlocks;i++){
                    let heightOldBlockedTrainingBlock = $(".ol-training-weektable-lockblock").eq(i).height();
                    let heightNewBlockedTraingBlock;
                    if (heightOldBlockedTrainingBlock==90){
                        heightNewBlockedTraingBlock = heightElement;
                    }
                    else {
                        heightNewBlockedTraingBlock = ((heightOldBlockedTrainingBlock+4)/94)*heightElement;
                    }
                    $(".ol-training-weektable-lockblock").eq(i).attr("style","height:"+heightNewBlockedTraingBlock+"px;");
                }
                $(".ol-training-timetable-lockblock-info").attr("style","top:calc(50% - 20.5px);");

                // Höhen der Zeitleiste anpassen, außer der Ersten
                const numberOfTimeLines = $(".ol-training-weektable-timelabel").length;
                for (i=1;i<numberOfTimeLines;i++){
                    let heightOldTimeLines = $(".ol-training-weektable-timelabel").eq(i).position();
                    let heightNewTimeLines = (((heightOldTimeLines.top-10)/94)*heightElement)+10;
                    $(".ol-training-weektable-timelabel").eq(i).attr("style","top:"+heightNewTimeLines+"px;");
                }

                // In diesem Abschnitt erfolgt die Anpassung des Rasters, der Bearbeitungselemente sowie die Gesamtgröße des Divs für den Wochenplan
                const widthElement = 40;
                var lengthNewWeektable = 0;
                let lengthNewRasterAsInt = new Array(numberOfDays);
                $(".ol-training-day-column-sep.column-left-"+lengthOriginalRasterAsInt[0]).addClass("column-left-"+lengthNewWeektable).removeClass("column-left-"+lengthOriginalRasterAsInt[0]);
                for (i=0;i<numberOfDays;i++){
                    let lengthNewRaster = String($(".ol-training-day-column-head").eq(i).attr("class"));
                    lengthNewRasterAsInt[i] = parseInt(lengthNewRaster.match(/\d+/gi));
                    lengthNewWeektable += lengthNewRasterAsInt[i];
                    $(".ol-training-day-column-sep").eq(i+1).removeClass("column-left-"+lengthOriginalRasterAsInt[i+1]);
                    $(".ol-training-day-column-sep").eq(i+1).addClass("column-left-"+lengthNewWeektable);
                    $(".ol-training-day-column-sep").eq(i+1).attr("style","left:"+lengthNewWeektable*widthElement+"px;");
                    if (i>0 && i<8){
                        $(".ol-training-day-column-edit.column-left-"+lengthOriginalRasterAsInt[i+1]).css("left", widthElement*lengthNewWeektable+"px");
                    }
                }
                $(".ol-training-weektable-head").addClass("column-width-"+lengthNewWeektable).removeClass("column-width-"+lengthOriginalWeektableAsInt);

                // Anpassung der Schriftgrößen
                $(".ol-training-weektable-block-headline").attr("style","font-size:10pt;");
                $(".ol-training-weektable-matchblock-date").attr("style","font-size:10pt;");
                $(".ol-training-weektable-block-text").attr("style","font-size:10pt;position:static;");
                $(".ol-training-weektable-block-time").attr("style","font-size:10pt;position:static;");
                $(".ol-training-day-column-head").attr("style","font-size:11pt;");
                $(".ol-training-weektable-matchblock-headline").attr("style","font-size:12pt;");
                $(".ol-training-weektable-matchblock-text").attr("style","font-size:10pt;");
                $(".ol-training-weektable-matchblock-usages-cell-name-text").attr("style","font-size:10pt;");
                $(".ol-training-weektable-matchblock-friendlies-info").attr("style","font-size:10pt;");
                $(".ol-team-name").attr("style","font-size:10pt;");
                $(".ol-training-weektable-block-edit-text").attr("style","font-size:10pt;");
                $(".ol-training-weektable-matchblock-usages-cell.ol-training-weektable-matchblock-usages-cell-minutes.ol-training-weektable-matchblock-usages-cell-minutes1").attr("style","font-size:10pt;");

                // Da die Warnungs- und Verletzungssymbole nicht mehr ganz zum neuen Layout passen, müssen wir hier noch kurz die Abstände und die Größe anpassen.
                $(".ol-training-timetable-block-injury").attr("style","margin-right:4px;height:12px;width:12px;");
                $(".ol-training-timetable-block-injury-plus").attr("style","top:-8.5px;left:-8.5px;transform:scale(.4);");
                $(".ol-training-timetable-block-warning").attr("style","margin-right:4px;height:12px;width:12px;");
                $(".ol-training-timetable-block-warning-exclam").attr("style","top:-7.5px;transform:scale(.7);");

                $(".ol-training-weektable-days").attr("style","height:987px;");

                // ToDo
                $(document).ready(function(){
                    $(".column-width-2").css("width", widthElement*2+"px");
                    $(".column-width-3").css("width", widthElement*3+"px");
                    $(".column-width-4").css("width", widthElement*4+"px");
                    $(".column-width-"+lengthNewWeektable).css("width", widthElement*lengthNewWeektable+"px");
                });

                /* Trotz Verkleinerung der Trainingsblöcke kann es vorkommen, dass die von Onlineliga zur Verfügung gestellte Breite für die Trainingsplanansicht nicht ausreicht.
                    Deshalb fragen wir hier die notwenige Breite ab und erweitern das verantwortliche Div entsprechend.*/
                $("#trainingWeektableContainer.ol-training-overview-table-container.ol-scroll-overlay-content").attr("style","width:"+(widthElement*lengthNewWeektable+55)+"px;border-bottom: 1px solid #b5b5b5;");
            }
        }
    })
})();