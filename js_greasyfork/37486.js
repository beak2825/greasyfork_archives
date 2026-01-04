// ==UserScript==
// @name            WME Utils - HoursParser
// @namespace       WazeDev
// @version         2024.06.16.000
// @description     Parses a text string into hours, for use in Waze Map Editor scripts
// @author          MapOMatic (originally developed by bmtg)
// @license         GNU GPLv3
// ==/UserScript==

// eslint-disable-next-line no-unused-vars
class HoursParser {
    constructor() {
        this.DAYS_OF_THE_WEEK = {
            SS: ['saturdays', 'saturday', 'satur', 'sat', 'sa'],
            UU: ['sundays', 'sunday', 'sun', 'su'],
            MM: ['mondays', 'monday', 'mondy', 'mon', 'mo'],
            TT: ['tuesdays', 'tuesday', 'tues', 'tue', 'tu'],
            WW: ['wednesdays', 'wednesday', 'weds', 'wed', 'we'],
            RR: ['thursdays', 'thursday', 'thurs', 'thur', 'thu', 'th'],
            FF: ['fridays', 'friday', 'fri', 'fr']
        };
        this.MONTHS_OF_THE_YEAR = {
            JAN: ['january', 'jan'],
            FEB: ['february', 'febr', 'feb'],
            MAR: ['march', 'mar'],
            APR: ['april', 'apr'],
            MAY: ['may', 'may'],
            JUN: ['june', 'jun'],
            JUL: ['july', 'jul'],
            AUG: ['august', 'aug'],
            SEP: ['september', 'sept', 'sep'],
            OCT: ['october', 'oct'],
            NOV: ['november', 'nov'],
            DEC: ['december', 'dec']
        };
        this.DAY_CODE_VECTOR = ['MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF','SS','UU','MM','TT','WW','RR','FF'];
        this.THRU_WORDS = ['through', 'thru', 'to', 'until', 'till', 'til', '-', '~'];
        // eslint-disable-next-line global-require
        this.OpeningHours = require('Waze/Model/Objects/OpeningHour');
    }

    parseHours(inputHours, locale) {
        let returnVal = {
            hours: [],
            parseError: false,
            overlappingHours: false,
            sameOpenAndCloseTimes: false
        };

        let tfHourTemp, tfDaysTemp, newDayCodeVec = [];
        let tempRegex, twix, tsix;
        let inputHoursParse = inputHours.toLowerCase().trim();
        if (inputHoursParse.length === 0 || inputHoursParse === ',') {
            return returnVal;
        }
        if (/24\s*[\\/*x]\s*7/g.test(inputHoursParse)) {
            inputHoursParse = 'mon-sun 00:00-00:00';
        } else {
            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            inputHoursParse = inputHoursParse.replace(/\btoday\b/g, today.toLocaleDateString(locale, {weekday:'short'}).toLowerCase())
                .replace(/\btomorrow\b/g, tomorrow.toLocaleDateString(locale, {weekday:'short'}).toLowerCase())
                .replace(/\u2013|\u2014/g, "-")  // long dash replacing
                .replace(/[^a-z0-9\:\-\. ~]/g, ' ')  // replace unnecessary characters with spaces
                .replace(/\:{2,}/g, ':')  // remove extra colons
                .replace(/closed|not open/g, '99:99-99:99')  // parse 'closed'
                .replace(/by appointment( only)?/g, '99:99-99:99')  // parse 'appointment only'
                .replace(/weekdays/g, 'mon-fri').replace(/weekends/g, 'sat-sun')  // convert weekdays and weekends to days
                .replace(/(12(:00)?\W*)?noon/g, "12:00").replace(/(12(:00)?\W*)?mid(night|nite)/g, "00:00")  // replace 'noon', 'midnight'
                .replace(/every\s*day|daily|(7|seven) days a week/g, "mon-sun")  // replace 'seven days a week'
                .replace(/(open\s*)?(24|twenty\W*four)\W*h(ou)?rs?|all day/g, "00:00-00:00")  // replace 'open 24 hour or similar'
                .replace(/(\D:)([^ ])/g, "$1 $2");  // space after colons after words

            // replace thru type words with dashes
            this.THRU_WORDS.forEach(word => {
                inputHoursParse = inputHoursParse.replace( new RegExp(word, 'g'), '-');
            });
        }

        inputHoursParse = inputHoursParse.replace(/\-{2,}/g, "-");  // replace any duplicate dashes

        // kill extra words
        let killWords = 'paste|here|business|day of the week|days of the week|operation|times|time|walk-ins|walk ins|welcome|dinner|lunch|brunch|breakfast|regular|weekday|weekend|opening|open|now|from|hours|hour|our|are|and|&'.split("|");
            // Remove timezone abbreviations. See https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations
        killWords.push('acdt','acst','act','act','acwst','adt','aedt','aest','aft','akdt','akst','amst','amt','amt','art','ast','ast','awst','azost','azot','azt','bdt','biot','bit','bot','brst','brt','bst','bst','bst','btt','cat','cct','cdt','cdt','cest','cet','chadt','chast','chot','chost','chst','chut','cist','cit','ckt','clst','clt','cost','cot','cst','cst','cst','ct','cvt','cwst','cxt','davt','ddut','dft','easst','east','eat','ect','ect','edt','eest','eet','egst','egt','eit','est','fet','fjt','fkst','fkt','fnt','galt','gamt','get','gft','gilt','git','gmt','gst','gst','gyt','hdt','haec','hst','hkt','hmt','hovst','hovt','ict','idlw','idt','iot','irdt','irkt','irst','ist','ist','ist','jst','kalt','kgt','kost','krat','kst','lhst','lhst','lint','magt','mart','mawt','mdt','met','mest','mht','mist','mit','mmt','msk','mst','mst','mut','mvt','myt','nct','ndt','nft','npt','nst','nt','nut','nzdt','nzst','omst','orat','pdt','pet','pett','pgt','phot','pht','pkt','pmdt','pmst','pont','pst','pst','pyst','pyt','ret','rott','sakt','samt','sast','sbt','sct','sdt','sgt','slst','sret','srt','sst','sst','syot','taht','tha','tft','tjt','tkt','tlt','tmt','trt','tot','tvt','ulast','ulat','utc','uyst','uyt','uzt','vet','vlat','volt','vost','vut','wakt','wast','wat','west','wet','wit','wst','yakt','yekt');
        for (twix=0; twix<killWords.length; twix++) {
            tempRegex = new RegExp('\\b'+killWords[twix]+'\\b', "g");
            inputHoursParse = inputHoursParse.replace(tempRegex,'');
        }

        // replace day terms with double caps
        for (let dayKey in this.DAYS_OF_THE_WEEK) {
            if (this.DAYS_OF_THE_WEEK.hasOwnProperty(dayKey)) {
                let tempDayList = this.DAYS_OF_THE_WEEK[dayKey];
                for (var tdix=0; tdix<tempDayList.length; tdix++) {
                    tempRegex = new RegExp(tempDayList[tdix]+'(?!a-z)', "g");
                    inputHoursParse = inputHoursParse.replace(tempRegex,dayKey);
                }
            }
        }

        // Replace dates
        for (let monthKey in this.MONTHS_OF_THE_YEAR) {
            if (this.MONTHS_OF_THE_YEAR.hasOwnProperty(monthKey)) {
                let tempMonthList = this.MONTHS_OF_THE_YEAR[monthKey];
                for (var tmix=0; tmix<tempMonthList.length; tmix++) {
                    tempRegex = new RegExp(tempMonthList[tmix]+'\\.? ?\\d{1,2}\\,? ?201\\d{1}', "g");
                    inputHoursParse = inputHoursParse.replace(tempRegex,' ');
                    tempRegex = new RegExp(tempMonthList[tmix]+'\\.? ?\\d{1,2}', "g");
                    inputHoursParse = inputHoursParse.replace(tempRegex,' ');
                }
            }
        }

        // replace any periods between hours with colons
        inputHoursParse = inputHoursParse.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2');
        // remove remaining periods
        inputHoursParse = inputHoursParse.replace(/\./g, '');
        // remove any non-hour colons between letters and numbers and on string ends
        inputHoursParse = inputHoursParse.replace(/(\D+)\:(\D+)/g, '$1 $2').replace(/^ *\:/g, ' ').replace(/\: *$/g, ' ');
        // replace am/pm with AA/PP
        inputHoursParse = inputHoursParse.replace(/ *pm/g,'PP').replace(/ *am/g,'AA');
        inputHoursParse = inputHoursParse.replace(/ *p\.m\./g,'PP').replace(/ *a\.m\./g,'AA');
        inputHoursParse = inputHoursParse.replace(/ *p\.m/g,'PP').replace(/ *a\.m/g,'AA');
        inputHoursParse = inputHoursParse.replace(/ *p/g,'PP').replace(/ *a/g,'AA');
        // tighten up dashes
        inputHoursParse = inputHoursParse.replace(/\- {1,}/g,'-').replace(/ {1,}\-/g,'-');
        inputHoursParse = inputHoursParse.replace(/^(00:00-00:00)$/g,'MM-UU$1');

        //  Change all MTWRFSU to doubles, if any other letters return false
        if (inputHoursParse.match(/[bcdeghijklnoqvxyz]/g) !== null) {
            returnVal.parseError = true;
            return returnVal;
        } else {
            inputHoursParse = inputHoursParse.replace(/m/g,'MM').replace(/t/g,'TT').replace(/w/g,'WW').replace(/r/g,'RR');
            inputHoursParse = inputHoursParse.replace(/f/g,'FF').replace(/s/g,'SS').replace(/u/g,'UU');
        }

        // tighten up spaces
        inputHoursParse = inputHoursParse.replace(/ {2,}/g,' ');
        inputHoursParse = inputHoursParse.replace(/ {1,}AA/g,'AA');
        inputHoursParse = inputHoursParse.replace(/ {1,}PP/g,'PP');
        // Expand hours into XX:XX format
        for (var asdf=0; asdf<5; asdf++) {  // repeat a few times to catch any skipped regex matches
            inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{1})([^0-9\:])/g, '$10$2:00$3');
            inputHoursParse = inputHoursParse.replace(/^(\d{1})([^0-9\:])/g, '0$1:00$2');
            inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{1})$/g, '$10$2:00');

            inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{2})([^0-9\:])/g, '$1$2:00$3');
            inputHoursParse = inputHoursParse.replace(/^(\d{2})([^0-9\:])/g, '$1:00$2');
            inputHoursParse = inputHoursParse.replace(/([^0-9\:])(\d{2})$/g, '$1$2:00');

            inputHoursParse = inputHoursParse.replace(/(\D)(\d{1})(\d{2}\D)/g, '$10$2:$3');
            inputHoursParse = inputHoursParse.replace(/^(\d{1})(\d{2}\D)/g, '0$1:$2');
            inputHoursParse = inputHoursParse.replace(/(\D)(\d{1})(\d{2})$/g, '$10$2:$3');

            inputHoursParse = inputHoursParse.replace(/(\D\d{2})(\d{2}\D)/g, '$1:$2');
            inputHoursParse = inputHoursParse.replace(/^(\d{2})(\d{2}\D)/g, '$1:$2');
            inputHoursParse = inputHoursParse.replace(/(\D\d{2})(\d{2})$/g, '$1:$2');

            inputHoursParse = inputHoursParse.replace(/(\D)(\d{1}\:)/g, '$10$2');
            inputHoursParse = inputHoursParse.replace(/^(\d{1}\:)/g, '0$1');
        }

        // replace 12AM range with 00
        inputHoursParse = inputHoursParse.replace( /12(\:\d{2}AA)/g, '00$1');
        // Change PM hours to 24hr time
        while (inputHoursParse.match(/\d{2}\:\d{2}PP/) !== null) {
            tfHourTemp = inputHoursParse.match(/(\d{2})\:\d{2}PP/)[1];
            tfHourTemp = parseInt(tfHourTemp) % 12 + 12;
            inputHoursParse = inputHoursParse.replace(/\d{2}(\:\d{2})PP/,tfHourTemp.toString()+'$1');
        }
        // kill the AA
        inputHoursParse = inputHoursParse.replace( /AA/g, '');

        // Side check for tabular input
        var inputHoursParseTab = inputHoursParse.replace( /[^A-Z0-9\:-]/g, ' ').replace( / {2,}/g, ' ');
        inputHoursParseTab = inputHoursParseTab.replace( /^ +/g, '').replace( / {1,}$/g, '');
        if (inputHoursParseTab.match(/[A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-? [A-Z]{2}\:?\-?/g) !== null) {
            inputHoursParseTab = inputHoursParseTab.split(' ');
            var reorderThree = [0,7,14,1,8,15,2,9,16,3,10,17,4,11,18,5,12,19,6,13,20];
            var reorderTwo = [0,7,1,8,2,9,3,10,4,11,5,12,6,13];
            var inputHoursParseReorder = [], reix;
            if (inputHoursParseTab.length === 21) {
                for (reix=0; reix<21; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
                }
            } else if (inputHoursParseTab.length === 18) {
                for (reix=0; reix<18; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
                }
            } else if (inputHoursParseTab.length === 15) {
                for (reix=0; reix<15; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderThree[reix]]);
                }
            } else if (inputHoursParseTab.length === 14) {
                for (reix=0; reix<14; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
                }
            } else if (inputHoursParseTab.length === 12) {
                for (reix=0; reix<12; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
                }
            } else if (inputHoursParseTab.length === 10) {
                for (reix=0; reix<10; reix++) {
                    inputHoursParseReorder.push(inputHoursParseTab[reorderTwo[reix]]);
                }
            }

            if (inputHoursParseReorder.length > 9) {
                inputHoursParseReorder = inputHoursParseReorder.join(' ');
                inputHoursParseReorder = inputHoursParseReorder.replace(/(\:\d{2}) (\d{2}\:)/g, '$1-$2');
                inputHoursParse = inputHoursParseReorder;
            }

        }


        // remove colons after Days field
        inputHoursParse = inputHoursParse.replace(/(\D+)\:/g, '$1 ');

        // Find any double sets
        inputHoursParse = inputHoursParse.replace(/([A-Z \-]{2,}) *(\d{2}\:\d{2} *\-{1} *\d{2}\:\d{2}) *(\d{2}\:\d{2} *\-{1} *\d{2}\:\d{2})/g, '$1$2$1$3');
        inputHoursParse = inputHoursParse.replace(/(\d{2}\:\d{2}) *(\d{2}\:\d{2})/g, '$1-$2');

        // remove all spaces
        inputHoursParse = inputHoursParse.replace( / */g, '');

        // Remove any dashes acting as Day separators for 3+ days ("M-W-F")
        inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5$6$7');
        inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5$6');
        inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4$5');
        inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3$4');
        inputHoursParse = inputHoursParse.replace( /([A-Z]{2})-([A-Z]{2})-([A-Z]{2})/g, '$1$2$3');

        // parse any 'through' type terms on the day ranges (MM-RR --> MMTTWWRR)
        while (inputHoursParse.match(/[A-Z]{2}\-[A-Z]{2}/) !== null) {
            tfDaysTemp = inputHoursParse.match(/([A-Z]{2})\-([A-Z]{2})/);
            var startDayIX = this.DAY_CODE_VECTOR.indexOf(tfDaysTemp[1]);
            newDayCodeVec = [tfDaysTemp[1]];
            for (var dcvix=startDayIX+1; dcvix<startDayIX+7; dcvix++) {
                newDayCodeVec.push(this.DAY_CODE_VECTOR[dcvix]);
                if (tfDaysTemp[2] === this.DAY_CODE_VECTOR[dcvix]) {
                    break;
                }
            }
            newDayCodeVec = newDayCodeVec.join('');
            inputHoursParse = inputHoursParse.replace(/[A-Z]{2}\-[A-Z]{2}/,newDayCodeVec);
        }

        // split the string between numerical and letter characters
        inputHoursParse = inputHoursParse.replace(/([A-Z])\-?\:?([0-9])/g,'$1|$2');
        inputHoursParse = inputHoursParse.replace(/([0-9])\-?\:?([A-Z])/g,'$1|$2');
        inputHoursParse = inputHoursParse.replace(/(\d{2}\:\d{2})\:00/g,'$1');  // remove seconds
        inputHoursParse = inputHoursParse.split("|");

        var daysVec = [], hoursVec = [];
        for (tsix=0; tsix<inputHoursParse.length; tsix++) {
            if (inputHoursParse[tsix][0].match(/[A-Z]/) !== null) {
                daysVec.push(inputHoursParse[tsix]);
            } else if (inputHoursParse[tsix][0].match(/[0-9]/) !== null) {
                hoursVec.push(inputHoursParse[tsix]);
            } else {
                returnVal.parseError = true;
                return returnVal;
            }
        }

        // check that the dayArray and hourArray lengths correspond
        if ( daysVec.length !== hoursVec.length ) {
            returnVal.parseError = true;
            return returnVal;
        }

        // Combine days with the same hours in the same vector
        var newDaysVec = [], newHoursVec = [], hrsIX;
        for (tsix=0; tsix<daysVec.length; tsix++) {
            if (hoursVec[tsix] !== '99:99-99:99') {  // Don't add the closed days
                hrsIX = newHoursVec.indexOf(hoursVec[tsix]);
                if (hrsIX > -1) {
                    newDaysVec[hrsIX] = newDaysVec[hrsIX] + daysVec[tsix];
                } else {
                    newDaysVec.push(daysVec[tsix]);
                    newHoursVec.push(hoursVec[tsix]);
                }
            }
        }

        const hoursObjectArray = [];
        const hoursObjectArrayMinDay = [];
        const hoursObjectArraySorted = [];
        let hoursObjectAdd;
        let daysObjArray;
        let toFromSplit;
        for (tsix=0; tsix<newDaysVec.length; tsix++) {
            hoursObjectAdd = {};
            daysObjArray = [];
            toFromSplit = newHoursVec[tsix].match(/(\d{2}\:\d{2})\-(\d{2}\:\d{2})/);
            if (toFromSplit === null) {
                returnVal.parseError = true;
                return returnVal;
            } else {  // Check for hours outside of 0-23 and 0-59
                var hourCheck = toFromSplit[1].match(/(\d{2})\:/)[1];
                if (hourCheck>23 || hourCheck < 0) {
                    returnVal.parseError = true;
                return returnVal;
                }
                hourCheck = toFromSplit[2].match(/(\d{2})\:/)[1];
                if (hourCheck>23 || hourCheck < 0) {
                    returnVal.parseError = true;
                return returnVal;
                }
                hourCheck = toFromSplit[1].match(/\:(\d{2})/)[1];
                if (hourCheck>59 || hourCheck < 0) {
                    returnVal.parseError = true;
                return returnVal;
                }
                hourCheck = toFromSplit[2].match(/\:(\d{2})/)[1];
                if (hourCheck>59 || hourCheck < 0) {
                    returnVal.parseError = true;
                return returnVal;
                }
            }
            // Make the days object
            if ( newDaysVec[tsix].indexOf('MM') > -1 ) {
                daysObjArray.push(1);
            }
            if ( newDaysVec[tsix].indexOf('TT') > -1 ) {
                daysObjArray.push(2);
            }
            if ( newDaysVec[tsix].indexOf('WW') > -1 ) {
                daysObjArray.push(3);
            }
            if ( newDaysVec[tsix].indexOf('RR') > -1 ) {
                daysObjArray.push(4);
            }
            if ( newDaysVec[tsix].indexOf('FF') > -1 ) {
                daysObjArray.push(5);
            }
            if ( newDaysVec[tsix].indexOf('SS') > -1 ) {
                daysObjArray.push(6);
            }
            if ( newDaysVec[tsix].indexOf('UU') > -1 ) {
                daysObjArray.push(0);
            }
            // build the hours object
            hoursObjectAdd.fromHour = toFromSplit[1];
            hoursObjectAdd.toHour = toFromSplit[2];
            hoursObjectAdd.days = daysObjArray.sort();
            hoursObjectArray.push(new this.OpeningHours(hoursObjectAdd));
            // track the order
            if (hoursObjectAdd.days.length > 1 && hoursObjectAdd.days[0] === 0) {
                hoursObjectArrayMinDay.push( hoursObjectAdd.days[1] * 100 + parseInt(toFromSplit[1][0])*10 + parseInt(toFromSplit[1][1]) );
            } else {
                hoursObjectArrayMinDay.push( (((hoursObjectAdd.days[0]+6)%7)+1) * 100 + parseInt(toFromSplit[1][0])*10 + parseInt(toFromSplit[1][1]) );
            }
        }
        this._sortWithIndex(hoursObjectArrayMinDay);
        for (var hoaix=0; hoaix < hoursObjectArrayMinDay.length; hoaix++) {
            hoursObjectArraySorted.push(hoursObjectArray[hoursObjectArrayMinDay.sortIndices[hoaix]]);
        }
        if ( !this._checkHours(hoursObjectArraySorted) ) {
            returnVal.hours = hoursObjectArraySorted;
            returnVal.overlappingHours = true;
            return returnVal;
        } else if ( this._hasSameOpenCloseTimes(hoursObjectArraySorted) ) {
            returnVal.hours = hoursObjectArraySorted;
            returnVal.sameOpenAndCloseTimes = true;
            return returnVal;
        } else {
            for ( var ohix=0; ohix<hoursObjectArraySorted.length; ohix++ ) {
                if ( hoursObjectArraySorted[ohix].days.length === 2 && hoursObjectArraySorted[ohix].days[0] === 0 && hoursObjectArraySorted[ohix].days[1] === 1) {
                    // separate hours
                    hoursObjectArraySorted.push(new this.OpeningHours({days: [0], fromHour: hoursObjectArraySorted[ohix].fromHour, toHour: hoursObjectArraySorted[ohix].toHour}));
                    hoursObjectArraySorted[ohix].days = [1];
                }
            }
        }
        returnVal.hours = hoursObjectArraySorted;
        return returnVal;
    }

    // function to check overlapping hours
    _checkHours(hoursObj) {
        if (hoursObj.length === 1) {
            return true;
        }
        var daysObj, fromHourTemp, toHourTemp;
        for (var day2Ch=0; day2Ch<7; day2Ch++) {  // Go thru each day of the week
            daysObj = [];
            for ( var hourSet = 0; hourSet < hoursObj.length; hourSet++ ) {  // For each set of hours
                if (hoursObj[hourSet].days.indexOf(day2Ch) > -1) {  // pull out hours that are for the current day, add 2400 if it goes past midnight, and store
                    fromHourTemp = hoursObj[hourSet].fromHour.replace(/\:/g,'');
                    toHourTemp = hoursObj[hourSet].toHour.replace(/\:/g,'');
                    if (toHourTemp <= fromHourTemp) {
                        toHourTemp = parseInt(toHourTemp) + 2400;
                    }
                    daysObj.push([fromHourTemp, toHourTemp]);
                }
            }
            if (daysObj.length > 1) {  // If there's multiple hours for the day, check them for overlap
                for ( var hourSetCheck2 = 1; hourSetCheck2 < daysObj.length; hourSetCheck2++ ) {
                    for ( var hourSetCheck1 = 0; hourSetCheck1 < hourSetCheck2; hourSetCheck1++ ) {
                        if ( daysObj[hourSetCheck2][0] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][0] < daysObj[hourSetCheck1][1] ) {
                            return false;
                        }
                        if ( daysObj[hourSetCheck2][1] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][1] < daysObj[hourSetCheck1][1] ) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    _hasSameOpenCloseTimes(hoursObj) {
        var fromHourTemp, toHourTemp;
        for ( var hourSet = 0; hourSet < hoursObj.length; hourSet++ ) {  // For each set of hours
            fromHourTemp = hoursObj[hourSet].fromHour;
            toHourTemp = hoursObj[hourSet].toHour;
            if (fromHourTemp !== '00:00' && fromHourTemp === toHourTemp) {
                // If open and close times are the same, don't parse.
                return true;
            }
        }
        return false;
    }

    _sortWithIndex(toSort) {
        for (var i = 0; i < toSort.length; i++) {
            toSort[i] = [toSort[i], i];
        }
        toSort.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });
        toSort.sortIndices = [];
        for (var j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            toSort[j] = toSort[j][0];
        }
        return toSort;
    }
    
}
