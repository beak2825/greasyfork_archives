// ==UserScript==
// @name         Combined RatioTracker v4.4.0 with Flexible Rank-Up (Dropdown + Condition Arrays)
// @namespace    http://tampermonkey.net/
// @version      4.4.0
// @license      MIT
// @description  Tracks daily stats for ANT, GGn, RED, OPS, TS, BLU; supports custom data points, long-term stats, and flexible Rank-Up with condition arrays + field dropdown.
// @match        https://anthelion.me/*
// @match        https://gazellegames.net/*
// @match        https://redacted.sh/*
// @match        https://orpheus.network/*
// @match        https://torrent-syndikat.org/userdetails.php?id=*
// @match        https://blutopia.cc/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521018/Combined%20RatioTracker%20v440%20with%20Flexible%20Rank-Up%20%28Dropdown%20%2B%20Condition%20Arrays%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521018/Combined%20RatioTracker%20v440%20with%20Flexible%20Rank-Up%20%28Dropdown%20%2B%20Condition%20Arrays%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------------------------------------
    // 1) CONSTANTS & STORAGE KEYS
    // -----------------------------------------------------------
    const SETTINGS_KEY = "ratioTrackerSettings";
    const USERNAMES_KEY = "ratioTrackerUsernames";
    const REGDATES_KEY = "ratioTrackerRegistrationDates";
    const RANKUP_KEY = "rankUpRequirements_Conditions";

    // Unified style
    const baseFontSize = "12px";
    const sectionTitleFontSize = "13px";
    const panelTitleFontSize = "14px";
    const mainBgColor = "#1e1e1e";
    const headerBgColor = "#2a2a2a";
    const textColor = "#ddd";
    const highlightColor = "#5daedc";
    const buttonBgColor = "#333";
    const buttonHoverBgColor = "#444";
    const sectionHoverBg = "#2a2a2a";

    // User friendly Labels
    const fieldLabelMap = {
        daysSinceReg:    "Days since Registration",
        ratio:           "Ratio",
        orbs:            "Orbs",
        bonusPoints:     "Bonus Points",
        uploadBytes:     "Uploaded",
        downloadBytes:   "Downloaded",
        bufferBytes:     "Buffer",
        freeleechTokens: "Freeleech Tokens",
        // ...and so on

        // optional custom fields if you like:
        // "myCustomNumber": "Custom Metric"
    };
    function getFriendlyFieldName(fieldName) {
        // Fallback: if field is not in the map, show the raw field name
        return fieldLabelMap[fieldName] || fieldName;
    }


    // -----------------------------------------------------------
    // 2) SETTINGS, USERNAMES, REG-DATES
    // -----------------------------------------------------------
    function loadSettings() {
        let def = {
            historyEntriesCount: 5,
            customDataPoints: {}
        };
        let saved = JSON.parse(localStorage.getItem(SETTINGS_KEY))||{};
        return {...def, ...saved};
    }
    function saveSettings(s) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    }

    function loadUsernames() {
        let def = { ANT:'', OPS:'', GGn:'', RED:'', BLU:'', TS:'' };
        let saved = JSON.parse(localStorage.getItem(USERNAMES_KEY))||{};
        let valid = ['ANT','OPS','GGn','RED','BLU','TS'];
        let ret={};
        valid.forEach(k=>{
            if (saved[k]!==undefined) ret[k]= saved[k];
        });
        return {...def, ...ret};
    }
    function saveUsernames(u) {
        localStorage.setItem(USERNAMES_KEY, JSON.stringify(u));
    }

    function loadRegistrationDates() {
        let def = { ANT:'', OPS:'', GGn:'', RED:'', BLU:'', TS:'' };
        let saved = JSON.parse(localStorage.getItem(REGDATES_KEY))||{};
        let valid= ['ANT','OPS','GGn','RED','BLU','TS'];
        let ret={};
        valid.forEach(k=>{
            if(saved[k]!==undefined) ret[k]=saved[k];
        });
        return {...def, ...ret};
    }
    function saveRegistrationDates(r) {
        localStorage.setItem(REGDATES_KEY, JSON.stringify(r));
    }

    // -----------------------------------------------------------
    // 3) PARSING & FORMATTING
    // -----------------------------------------------------------
    function parseSize(str) {
        let match = str.match(/([\d.,]+)\s*(TiB|GiB|MiB|KiB|TB|GB|MB|KB|B)?/i);
        if(!match) return 0;
        let numStr= match[1];
        let unit  = match[2] ? match[2].toLowerCase():'b';

        let lastComma= numStr.lastIndexOf(',');
        let lastDot  = numStr.lastIndexOf('.');
        let decSep   = '';
        if(lastComma>lastDot) decSep=',';
        else if(lastDot>lastComma) decSep='.';
        if(decSep===',') {
            numStr= numStr.replace(/\./g,'').replace(',', '.');
        } else if(decSep==='.'){
            numStr= numStr.replace(/,/g,'');
        }
        let val= parseFloat(numStr);
        if(isNaN(val)) return 0;

        let factor=1;
        if (unit.includes("t") && unit.includes("i")) factor= 1024**4; // TiB
        else if(unit.includes("t")) factor= 1000**4; // TB
        else if(unit.includes("g") && unit.includes("i")) factor= 1024**3; // GiB
        else if(unit.includes("g")) factor= 1000**3; // GB
        else if(unit.includes("m") && unit.includes("i")) factor= 1024**2; // MiB
        else if(unit.includes("m")) factor= 1000**2; // MB
        else if(unit.includes("k") && unit.includes("i")) factor= 1024;    // KiB
        else if(unit.includes("k")) factor= 1000;       // KB
        else factor=1;
        return val*factor;
    }

    function formatBytes(bytes) {
        const sizes= ['B','KB','MB','GB','TB','PB','EB'];
        if(bytes===0)return "0 B";
        let i= Math.floor(Math.log(bytes)/Math.log(1024));
        if(i===0) return `${bytes} ${sizes[i]}`;
        return `${(bytes/(1024**i)).toFixed(2)} ${sizes[i]}`;
    }

    function getDelta(cur,prev,unit) {
        let d= cur-prev;
        if(d===0) return `<span style="color:gray;">No change</span>`;
        let sign= d>0?'+':'-';
        let abs= Math.abs(d);

        let f;
        if(unit==='bytes') {
            f= formatBytes(abs);
        } else if(unit==='ratio'||unit==='number'){
            f= abs.toFixed(2);
        } else {
            f= abs;
        }
        let color= sign==='+'?'#78c478':'#ff6666';
        return `<span style="color:${color};">${sign}${f}</span>`;
    }

    function getDaysSinceRegistration(ddmmYYYY) {
        if(!ddmmYYYY)return 0;
        let parts= ddmmYYYY.split('/');
        if(parts.length!==3) return 0;
        let d= parseInt(parts[0],10);
        let m= parseInt(parts[1],10);
        let y= parseInt(parts[2],10);
        let dateObj= new Date(y,m-1,d);
        if(isNaN(dateObj.getTime()))return 0;
        let now= new Date();
        let diffMs= now - dateObj;
        return Math.floor(diffMs/(1000*60*60*24));
    }

    // -----------------------------------------------------------
    // 4) HISTORY
    // -----------------------------------------------------------
    function saveDailyEntry(key, entry){
        let hist= JSON.parse(localStorage.getItem(key))||[];
        let now= new Date();
        let ds= `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
        let already= hist.some(e=>{
            let dd= new Date(e.date);
            let ddS= `${dd.getFullYear()}-${dd.getMonth()+1}-${dd.getDate()}`;
            return ddS===ds;
        });
        let newEntryCreated=false;
        if(!already){
            hist.push(entry);
            localStorage.setItem(key, JSON.stringify(hist));
            newEntryCreated=true;
        }
        return {history:hist,newEntryCreated};
    }
    function removeEntry(storageKey, dateStr) {
        let hist= JSON.parse(localStorage.getItem(storageKey))||[];
        hist= hist.filter(e=> e.date!==dateStr);
        localStorage.setItem(storageKey, JSON.stringify(hist));
        alert("Entry removed. Reload the page to see updates.");
    }

    // -----------------------------------------------------------
    // 5) CHANGES & CURRENT
    // -----------------------------------------------------------
    function generateChangesAndCurrent(fields, entry, prevEntry, customDP) {
        let changesHtml='';
        if(prevEntry){
            // Standard
            fields.forEach(f=>{
                if(entry[f.key]!==undefined && prevEntry[f.key]!==undefined){
                    let d= getDelta(entry[f.key], prevEntry[f.key], f.unit);
                    changesHtml+= `<p style="margin:2px 0; font-size:${baseFontSize};">
                      <strong>${f.label} Change:</strong> ${d}
                    </p>`;
                }
            });
            // Custom
            for(let ck in customDP){
                let dp= customDP[ck];
                let label= dp.label;
                if(entry[label]!==undefined && prevEntry[label]!==undefined){
                    let cVal= parseFloat(entry[label])||0;
                    let pVal= parseFloat(prevEntry[label])||0;
                    let unit= dp.type.trim().toLowerCase();
                    let dd= getDelta(cVal,pVal,unit);
                    changesHtml+= `<p style="margin:2px 0; font-size:${baseFontSize};">
                      <strong>${label} Change:</strong> ${dd}
                    </p>`;
                }
            }
        } else {
            changesHtml=`<p style="margin:2px 0; font-size:${baseFontSize};">No previous data to compare.</p>`;
        }

        let currentValuesHtml='';
        fields.forEach(f=>{
            if(entry[f.key]!==undefined){
                let val= entry[f.key];
                if(f.unit==='bytes') val= formatBytes(val);
                else if(f.unit==='ratio') val= val.toFixed(2);
                currentValuesHtml+= `<p style="margin:2px 0; font-size:${baseFontSize};">
                  <strong>${f.label}:</strong> ${val}
                </p>`;
            }
        });
        for(let ck in customDP){
            let dp= customDP[ck];
            let label= dp.label;
            let val= entry[label];
            if(val!==undefined){
                if(dp.type.trim().toLowerCase()==='bytes'){
                    val= formatBytes(val);
                } else if(dp.type.trim().toLowerCase()==='number'){
                    val= parseFloat(val).toFixed(2);
                }
                currentValuesHtml+= `<p style="margin:2px 0; font-size:${baseFontSize};">
                  <strong>${label}:</strong> ${val}
                </p>`;
            }
        }

        return {changesHtml, currentValuesHtml};
    }

    // -----------------------------------------------------------
    // 6) LONG-TERM AVERAGES
    // -----------------------------------------------------------
    function computeExactAverages(history, fields, days){
        if(history.length<days+1) return null;
        let slice= history.slice(-(days+1));
        let avg={};
        fields.forEach(f=>{
            let total=0;
            for(let i=1; i<slice.length; i++){
                let diff= slice[i][f.key]- slice[i-1][f.key];
                total+= diff;
            }
            avg[f.key]= total/days;
        });
        return avg;
    }
    function computeExactAveragesCustomData(history, numericLabels, days){
        if(history.length<days+1) return null;
        let slice= history.slice(-(days+1));
        let avg={};
        numericLabels.forEach(lbl=>{
            let total=0; let valid=true;
            for(let i=1; i<slice.length;i++){
                let c= parseFloat(slice[i][lbl]);
                let p= parseFloat(slice[i-1][lbl]);
                if(isNaN(c)||isNaN(p)){ valid=false; break;}
                total+=(c-p);
            }
            if(valid) avg[lbl]= total/days;
        });
        return avg;
    }

    function computeDayMonthYearAverages(history, fields){
        let a7= computeExactAverages(history, fields,7);
        let a30=computeExactAverages(history, fields,30);
        let a365=computeExactAverages(history,fields,365);

        let res={};
        fields.forEach(f=>{
            let dayVal=null, monthVal=null, yearVal=null;
            if(a7 && a7[f.key]!==undefined) { dayVal= a7[f.key]; }
            if(a30&& a30[f.key]!==undefined){ monthVal= a30[f.key]; }
            else if(dayVal!==null) {
                monthVal= (30/7)*dayVal;
            }
            if(a365&& a365[f.key]!==undefined){ yearVal= a365[f.key]; }
            else if(dayVal!==null){
                yearVal= (365/7)*dayVal;
            }
            res[f.key]= { dayVal, monthVal, yearVal };
        });
        return res;
    }
    function computeDayMonthYearAveragesCustomDataPoints(history, customDP){
        let numericLabels=[];
        for(let ck in customDP){
            let dp= customDP[ck];
            let t= dp.type.trim().toLowerCase();
            if(t==='bytes'|| t==='number') {
                numericLabels.push(dp.label);
            }
        }
        if(numericLabels.length===0)return {};

        let a7   = computeExactAveragesCustomData(history, numericLabels,7);
        let a30  = computeExactAveragesCustomData(history, numericLabels,30);
        let a365 = computeExactAveragesCustomData(history, numericLabels,365);

        let res={};
        numericLabels.forEach(lbl=>{
            let dayVal=null, monthVal=null, yearVal=null;
            if(a7 && a7[lbl]!==undefined) {
                dayVal= a7[lbl];
            }
            if(a30&& a30[lbl]!==undefined) {
                monthVal= a30[lbl];
            } else if(dayVal!==null){
                monthVal= (30/7)*dayVal;
            }
            if(a365&& a365[lbl]!==undefined){
                yearVal= a365[lbl];
            } else if(dayVal!==null){
                yearVal= (365/7)*dayVal;
            }
            res[lbl]= { dayVal, monthVal, yearVal};
        });
        return res;
    }

    function formatLongTermValue(val, unitType){
        if(val===null|| val===undefined) return "N/A";
        let sign= val>=0?'+':'-';
        let abs= Math.abs(val);
        if(unitType==='bytes'){
            return sign+ formatBytes(abs);
        } else if(unitType==='ratio'|| unitType==='number'){
            return sign+ abs.toFixed(2);
        }
        return sign+ abs.toFixed(2);
    }

    function buildLongTermStatsTable(fields, fAvg, customDP, cAvg){
        let html=`
         <table style="border-collapse:collapse; width:100%; font-size:${baseFontSize};">
          <thead>
            <tr style="border-bottom:1px solid #666;">
              <th style="padding:6px; text-align:left;">Stat</th>
              <th style="padding:6px; text-align:left;">Day</th>
              <th style="padding:6px; text-align:left;">Month</th>
              <th style="padding:6px; text-align:left;">Year</th>
            </tr>
          </thead>
          <tbody>
        `;
        // built-in
        fields.forEach(f=>{
            let {dayVal,monthVal,yearVal}= fAvg[f.key]||{};
            let ds= formatLongTermValue(dayVal, f.unit);
            let ms= formatLongTermValue(monthVal,f.unit);
            let ys= formatLongTermValue(yearVal,f.unit);
            html+=`
              <tr style="border-bottom:1px solid #444;">
                <td style="padding:6px;">${f.label}</td>
                <td style="padding:6px;">${ds}</td>
                <td style="padding:6px;">${ms}</td>
                <td style="padding:6px;">${ys}</td>
              </tr>
            `;
        });
        // custom numeric
        for(let ck in customDP){
            let dp= customDP[ck];
            let t= dp.type.trim().toLowerCase();
            if(t!=='bytes' && t!=='number') continue;
            let {dayVal,monthVal,yearVal}= cAvg[dp.label]||{};
            let ds= formatLongTermValue(dayVal, t);
            let ms= formatLongTermValue(monthVal,t);
            let ys= formatLongTermValue(yearVal,t);
            html+=`
              <tr style="border-bottom:1px solid #444;">
                <td style="padding:6px;">${dp.label}</td>
                <td style="padding:6px;">${ds}</td>
                <td style="padding:6px;">${ms}</td>
                <td style="padding:6px;">${ys}</td>
              </tr>
            `;
        }
        html+=`</tbody></table>`;
        return html;
    }

    // -----------------------------------------------------------
    // 7) STYLE
    // -----------------------------------------------------------
    const style= document.createElement("style");
    style.textContent=`
     .ratioTrackerButton {
       background:${buttonBgColor};
       color:${textColor};
       border:none;
       border-radius:4px;
       cursor:pointer;
       font-size:${baseFontSize};
       padding:6px 10px;
       transition:background 0.2s;
     }
     .ratioTrackerButton:hover {
       background:${buttonHoverBgColor};
     }
     h4[style*="cursor:pointer;"] {
       transition: background 0.2s;
     }
     h4[style*="cursor:pointer;"]:hover {
       background:${sectionHoverBg};
     }
     #changesContainer, #currentStatsContainer, #longTermContainer, #rankUpContainerSummary, #historyContainer {
       transition:max-height 0.3s ease-out, opacity 0.3s ease-out;
       overflow:auto;
     }
     .historyDetails {
       transition: max-height 0.2s ease-out, opacity 0.2s ease-out;
       overflow:hidden;
     }
     .historyToggle:hover {
       background:${sectionHoverBg};
     }
     .toggleIcon {
       transition: transform 0.2s;
     }
    `;
    document.head.appendChild(style);

    // -----------------------------------------------------------
    // 8) DRAGGABLE
    // -----------------------------------------------------------
    function makeDraggable(dragHandle, moveElem){
        let pos1=0,pos2=0,pos3=0,pos4=0;
        dragHandle.onmousedown= dragMouseDown;

        function dragMouseDown(e){
            e=e||window.event;
            e.preventDefault();
            pos3=e.clientX; pos4=e.clientY;
            document.onmouseup= closeDragElement;
            document.onmousemove= elementDrag;
        }
        function elementDrag(e){
            e=e||window.event;
            e.preventDefault();
            pos1= pos3 - e.clientX;
            pos2= pos4 - e.clientY;
            pos3= e.clientX;
            pos4= e.clientY;
            moveElem.style.top =(moveElem.offsetTop - pos2)+"px";
            moveElem.style.left=(moveElem.offsetLeft- pos1)+"px";
            moveElem.style.right="auto";
        }
        function closeDragElement(){
            document.onmouseup=null;
            document.onmousemove=null;
        }
    }

    // -----------------------------------------------------------
    // 9) EXTRACT USER IDENTIFIER
    // -----------------------------------------------------------
    function extractUserIdentifier(trackerKey){
        let path= window.location.pathname;
        let sp= new URLSearchParams(window.location.search);
        switch(trackerKey){
            case 'ANT':
            case 'OPS':
            case 'GGn':
                if(sp.has('id')) return sp.get('id');
                return '';
            case 'TS':
                if(sp.has('id')) return sp.get('id');
                return '';
            case 'BLU': {
                let parts= path.split('/');
                return parts[parts.length-1];
            }
            case 'RED':
                if(sp.has('id')) return sp.get('id');
                return '';
            default: return '';
        }
    }

    // -----------------------------------------------------------
    // 10) TOGGLE SECTIONS
    // -----------------------------------------------------------
    function setupToggleSection(headerId, containerId, content){
        const headerEl   = content.querySelector(`#${headerId}`);
        const containerEl= content.querySelector(`#${containerId}`);
        if(headerEl&&containerEl){
            let arrow= headerEl.querySelector('span:last-child');
            containerEl.style.maxHeight="0";
            containerEl.style.opacity="0";
            headerEl.addEventListener("click",()=>{
                if(containerEl.style.display==="none"|| containerEl.style.maxHeight==="0px"){
                    containerEl.style.display="block";
                    setTimeout(()=>{
                        containerEl.style.maxHeight="500px";
                        containerEl.style.opacity="1";
                    },10);
                    arrow.textContent="▲";
                } else {
                    containerEl.style.maxHeight="0";
                    containerEl.style.opacity="0";
                    setTimeout(()=>{
                        containerEl.style.display="none";
                    },300);
                    arrow.textContent="▼";
                }
            });
        }
    }

    // -----------------------------------------------------------
    // 11) RANK-UP (ARRAY-OF-CONDITIONS) with DROPDOWN
    // -----------------------------------------------------------

    // built-in numeric fields you want in the dropdown:
    const builtInFields = [
        "daysSinceReg",
        "ratio",
        "uploadBytes",
        "downloadBytes",
        "bufferBytes",
        "freeleechTokens",
        "bonusPoints",
        "orbs"
    ];

    function loadRankUpRequirements() {
        return JSON.parse(localStorage.getItem(RANKUP_KEY))||{};
    }
    function saveRankUpRequirements(obj) {
        localStorage.setItem(RANKUP_KEY, JSON.stringify(obj));
    }

    // Evaluate single condition: (actualVal operator requiredVal)
    function evaluateCondition(actual, op, required){
        switch(op){
            case ">=": return (actual>= required);
            case "<=": return (actual<= required);
            case ">":  return (actual>  required);
            case "<":  return (actual<  required);
            case "==": return (actual===required);
            default:   return false;
        }
    }

    // Parse user-provided "value" to numeric (especially if the field is bytes)
    function parseReqValue(field, valStr){
        let lf= field.toLowerCase();
        if(lf.includes("bytes") || lf==="uploadbytes"|| lf==="downloadbytes"|| lf==="bufferbytes"){
            return parseSize(valStr);
        }
        // otherwise parse as float
        let x= parseFloat(valStr);
        return isNaN(x)? 0:x;
    }

    /**
     * Evaluate all conditions for a single rank
     */
    function meetsAllConditions(conditionArray, userStats) {
        // userStats might have ratio, uploadBytes, daysSinceReg, plus custom data point labels
        for(let cond of conditionArray){
            let field   = cond.field||"";
            let operator= cond.operator||"==";
            let valStr  = cond.value||"0";

            // actualVal from userStats:
            let actualVal= 0;
            if(field==="daysSinceReg"){
                actualVal= userStats.daysSinceReg||0;
            } else {
                if(typeof userStats[field]==='number'){
                    actualVal= userStats[field];
                } else {
                    let possible= parseFloat(userStats[field]);
                    actualVal= isNaN(possible)? 0 : possible;
                }
            }
            let reqVal= parseReqValue(field,valStr);
            if(!evaluateCondition(actualVal,operator,reqVal)){
                return false;
            }
        }
        return true;
    }

    // We'll show a short summary in the main panel:
    function buildRankUpSummary(rankMap, userStats, rankResults) {
        let rankNames = Object.keys(rankMap);
        if (rankNames.length === 0) {
            return `<p style="font-size:${baseFontSize};">No rank requirements defined.</p>`;
        }

        let html = ``;
        rankNames.forEach(rankName => {
            let condArr = rankMap[rankName];
            let pass = rankResults[rankName]; // true/false

            // Choose different colors
            let rankColor = pass ? "#78c478" : "#ccc";
            // Green if fulfilled, neutral gray if not.

            // Symbol instead of "Not yet..."
            let rankSymbol = pass ? "✓" : "✖";
            // A check mark if fulfilled, otherwise a cross.

            // Text for the heading
            let headingText = pass
            ? `User Class: ${rankName} ${rankSymbol}` // if achieved
            : `User Class: ${rankName} ${rankSymbol}`; // if not achieved

            // Build the final HTML
            html += `
        <div style="
            margin-bottom:15px;
            padding:10px;
            border:1px solid #444;
            border-radius:5px;
            background:#2a2a2a;
        ">
          <!-- Rank heading -->
          <div style="
              font-size:${sectionTitleFontSize};
              font-weight:bold;
              color:${rankColor};
              margin-bottom:8px;
          ">
            ${headingText}
          </div>

          <!-- Table of rank-up conditions -->
          <table style="width:100%; border-collapse:collapse; font-size:${baseFontSize};">
            <thead>
              <tr style="border-bottom:1px solid #555;">
                <th style="padding:4px; text-align:left; color:${highlightColor};">Field</th>
                <th style="padding:4px; text-align:left; color:${highlightColor};">Requirement</th>
                <th style="padding:4px; text-align:left; color:${highlightColor};">Current</th>
                <th style="padding:4px; text-align:left; color:${highlightColor};">Status</th>
              </tr>
            </thead>
            <tbody>
        `;

            condArr.forEach(cond => {
                let field = cond.field;
                let op = cond.operator;
                let reqVal = cond.value;
                let actualVal = parseFloat(userStats[field]) || 0;
                // or handle 'daysSinceReg' or parseSize if needed

                let displayActual = String(actualVal);
                if (field.toLowerCase().includes("bytes")) {
                    // If it's a bytes field
                    displayActual = formatBytes(actualVal);
                }
                let numericReq = parseReqValue(field, reqVal);
                let conditionMet = evaluateCondition(actualVal, op, numericReq);
                let condColor = conditionMet ? "#78c478" : "#ff6666";
                let condText = conditionMet ? "OK" : "Missing";

                html += `
            <tr style="border-bottom:1px solid #444;">
              <td style="padding:4px;">${getFriendlyFieldName(field)}</td>
              <td style="padding:4px;">${op} ${reqVal}</td>
              <td style="padding:4px;">${displayActual}</td>
              <td style="padding:4px; color:${condColor};">${condText}</td>
            </tr>
            `;
            });

            html += `
            </tbody>
          </table>
        </div>
        `;
        });

        return html;
    }

    /**
     * We want a dropdown of possible fields:
     * - built-in numeric fields (like ratio, daysSinceReg, etc.)
     * - numeric custom data point labels from user settings
     */
    function getAvailableFields(customDataPoints){
        // Start with builtInFields
        let arr = builtInFields.slice(); // copy
        // Add numeric custom DPs:
        for(let cKey in customDataPoints){
            let dp= customDataPoints[cKey];
            let t= dp.type.trim().toLowerCase();
            if(t==='bytes'|| t==='number'){
                arr.push(dp.label);
            }
        }
        return arr;
    }

    // -----------------------------------------------------------
    // 12) SETTINGS PANEL
    // -----------------------------------------------------------
    function loadRankUpRequirementsAll() {
        return JSON.parse(localStorage.getItem(RANKUP_KEY))||{};
    }

    function setupSettingsPanel(currKey, settingsBtn, infoBox){
        let settings   = loadSettings();
        let unames     = loadUsernames();
        let regDates   = loadRegistrationDates();
        let rankMap    = loadRankUpRequirementsAll();

        let panel= infoBox.querySelector("#ratioTrackerSettingsPanel");
        if(!panel){
            panel= document.createElement("div");
            panel.id= "ratioTrackerSettingsPanel";
            panel.style.display= "none";
            panel.style.marginTop="15px";
            panel.style.padding="10px";
            panel.style.background="#2a2a2a";
            panel.style.borderRadius="5px";
            panel.style.fontSize= baseFontSize;
            panel.style.color= textColor;
            panel.style.position="relative";
            let c= infoBox.querySelector('div[style*="flex-grow: 1"]');
            if(c) c.appendChild(panel);
        }

        panel.innerHTML=`
          <div style="font-size:${baseFontSize}; color:${textColor};">
            <h4 style="margin:0; font-size:${panelTitleFontSize}; color:${highlightColor};
                       border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
              Settings
            </h4>

            <div style="margin:10px 0;">
              <div style="display:flex; align-items:center; margin-bottom:5px;">
                <div style="width:60%; color:#aaa;">History entries to show:</div>
                <div style="width:40%;">
                  <input type="number" id="historyCountInput"
                         style="width:50px; margin-left:5px; background:#333; border:1px solid #444;
                                color:#ddd; border-radius:3px;"
                         value="${settings.historyEntriesCount}" min="1" max="50">
                </div>
              </div>
            </div>

            <h5 style="margin:10px 0 5px 0; font-size:${sectionTitleFontSize}; font-weight:bold;
                       color:${highlightColor}; border-bottom:1px solid rgba(255,255,255,0.1);
                       padding-bottom:4px;">
              Tracker Username/ID
            </h5>
            <div style="font-size:11px; color:#aaa; margin-bottom:10px;">
              Enter user ID/username exactly as in the URL.
            </div>
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:30%; color:#aaa;">Username/ID:</div>
              <div style="width:70%;">
                <input type="text" id="username_${currKey}"
                       style="width:150px; margin-left:5px; background:#333; border:1px solid #444;
                              color:#ddd; border-radius:3px;"
                       value="${unames[currKey]||''}" placeholder="Enter ID/Username">
              </div>
            </div>

            <h5 style="margin:10px 0 5px 0; font-size:${sectionTitleFontSize}; font-weight:bold;
                       color:${highlightColor}; border-bottom:1px solid rgba(255,255,255,0.1);
                       padding-bottom:4px;">
              Registration Date
              <span style="color:${highlightColor}; cursor:help; margin-left:5px;"
                    title="Enter your registration date in DD/MM/YYYY format.">❓</span>
            </h5>
            <div style="font-size:11px; color:#aaa; margin-bottom:10px;">
              Format: DD/MM/YYYY
            </div>
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:30%; color:#aaa;">Registration Date:</div>
              <div style="width:70%;">
                <input type="text" id="registrationDate_${currKey}"
                       style="width:150px; margin-left:5px; background:#333; border:1px solid #444;
                              color:#ddd; border-radius:3px;"
                       value="${regDates[currKey]||''}" placeholder="DD/MM/YYYY">
              </div>
            </div>

            <h5 style="margin:10px 0 5px 0; font-size:${sectionTitleFontSize}; font-weight:bold;
                       color:${highlightColor}; border-bottom:1px solid rgba(255,255,255,0.1);
                       padding-bottom:4px;">
              Custom Data Points
            </h5>
            <div id="customDataPointsContainer" style="margin-bottom:10px;"></div>
            <div style="display:flex; gap:5px; margin-top:5px;">
              <button id="addCustomDataPointBtn" class="ratioTrackerButton">Add Data Point</button>
              <button id="saveSettingsBtn" class="ratioTrackerButton">Save Settings</button>
            </div>

            <h5 style="margin:20px 0 5px 0; font-size:${sectionTitleFontSize}; font-weight:bold;
                       color:${highlightColor}; border-bottom:1px solid rgba(255,255,255,0.1);
                       padding-bottom:4px;">
              Rank-Up Requirements (Conditions)
            </h5>
            <div id="rankUpContainer" style="margin-bottom:10px;"></div>
            <button id="addRankBtn" class="ratioTrackerButton" style="margin-top:5px;">Add New Rank</button>
          </div>
        `;

        // 1) Render custom data points
        function renderCustomDP(){
            let ctn= panel.querySelector("#customDataPointsContainer");
            ctn.innerHTML='';
            let dp= settings.customDataPoints||{};
            Object.keys(dp).forEach(k=>{
                let item= dp[k];
                let d= document.createElement("div");
                d.style.marginBottom="5px";
                d.innerHTML=`
                  <div style="display:flex; align-items:center; gap:5px; font-size:${baseFontSize};">
                    <input type="text" data-key="${k}" class="cdpLabel" placeholder="Label"
                           style="width:25%; background:#333; color:#ddd; border:1px solid #444;
                                  border-radius:3px; padding:2px;"
                           value="${item.label}"/>
                    <input type="text" data-key="${k}" class="cdpSelector" placeholder="CSS Selector"
                           style="width:25%; background:#333; color:#ddd; border:1px solid #444;
                                  border-radius:3px; padding:2px;"
                           value="${item.selector}"/>
                    <select data-key="${k}" class="cdpType"
                            style="width:20%; background:#333; color:#ddd; border:1px solid #444;
                                   border-radius:3px; padding:2px;">
                      <option value="Bytes"  ${item.type.trim().toLowerCase()==='bytes' ?'selected':''}>Bytes</option>
                      <option value="Number" ${item.type.trim().toLowerCase()==='number' ?'selected':''}>Number</option>
                      <option value="Text"   ${item.type.trim().toLowerCase()==='text' ?'selected':''}>Text</option>
                    </select>
                    <button data-key="${k}" class="cdpRemoveBtn ratioTrackerButton"
                            style="padding:2px 5px; background:#333; color:#ff6666;">
                      🗑
                    </button>
                  </div>
                `;
                ctn.appendChild(d);
            });

            // events
            const labelInps= ctn.querySelectorAll(".cdpLabel");
            labelInps.forEach(inp=>{
                inp.addEventListener("change",(e)=>{
                    let k= e.target.getAttribute("data-key");
                    let newVal= e.target.value.trim();
                    if(!newVal){
                        alert("Label cannot be empty.");
                        return;
                    }
                    let oldVal= settings.customDataPoints[k].label;
                    // check uniqueness
                    let existing= Object.values(settings.customDataPoints).map(x=> x.label);
                    if(existing.includes(newVal) && newVal!== oldVal){
                        alert("Label must be unique.");
                        e.target.value= oldVal;
                        return;
                    }
                    settings.customDataPoints[k].label= newVal;
                    saveSettings(settings);
                });
            });
            const selectorInps= ctn.querySelectorAll(".cdpSelector");
            selectorInps.forEach(inp=>{
                inp.addEventListener("change",(e)=>{
                    let k= e.target.getAttribute("data-key");
                    let newVal= e.target.value.trim();
                    if(!newVal){
                        alert("CSS Selector cannot be empty.");
                        return;
                    }
                    settings.customDataPoints[k].selector= newVal;
                    saveSettings(settings);
                });
            });
            const typeSels= ctn.querySelectorAll(".cdpType");
            typeSels.forEach(sel=>{
                sel.addEventListener("change",(e)=>{
                    let k= e.target.getAttribute("data-key");
                    settings.customDataPoints[k].type= e.target.value;
                    saveSettings(settings);
                });
            });
            const removeBtns= ctn.querySelectorAll(".cdpRemoveBtn");
            removeBtns.forEach(btn=>{
                btn.addEventListener("click",(e)=>{
                    let k= e.target.getAttribute("data-key");
                    if(confirm(`Remove custom data point "${settings.customDataPoints[k].label}"?`)){
                        delete settings.customDataPoints[k];
                        saveSettings(settings);
                        renderCustomDP();
                    }
                });
            });
        }

        // 2) Render rank-up requirements
        function renderRankUp() {
            let container= panel.querySelector("#rankUpContainer");
            container.innerHTML='';
            let rankNames= Object.keys(rankMap);
            let availableFields= getAvailableFields(settings.customDataPoints);

            rankNames.forEach(rName=>{
                let condArr= rankMap[rName];
                let div= document.createElement("div");
                div.style.borderBottom="1px solid rgba(255,255,255,0.1)";
                div.style.marginBottom="8px";
                div.style.paddingBottom="5px";

                div.innerHTML=`
                  <div style="margin-bottom:5px; display:flex; align-items:center;">
                    <span style="width:25%; color:#aaa;">Rank Name:</span>
                    <input type="text" data-rank="${rName}" class="rankNameInput"
                           style="width:60%; background:#333; color:#ddd; border:1px solid #444;
                                  border-radius:3px; padding:2px; margin-left:5px;"
                           value="${rName}">
                  </div>
                  <div id="condContainer_${rName}" style="margin-left:15px;"></div>
                  <button data-rank="${rName}" class="addCondBtn ratioTrackerButton"
                          style="margin-top:5px;">+ Add Condition</button>
                  <button data-rank="${rName}" class="removeRankBtn ratioTrackerButton"
                          style="padding:2px 5px; background:#333; color:#ff6666; margin-left:5px;">
                    🗑 Remove Rank
                  </button>
                `;
                container.appendChild(div);

                let condCtn= div.querySelector(`#condContainer_${rName}`);
                condCtn.innerHTML='';

                condArr.forEach((cObj, idx)=>{
                    let cDiv= document.createElement("div");
                    cDiv.style.display="flex";
                    cDiv.style.alignItems="center";
                    cDiv.style.gap="5px";
                    cDiv.style.marginBottom="3px";

                    // Build the <select> for field
                    let fieldSelectHtml= `<select class="condFieldSelect" data-rank="${rName}" data-idx="${idx}"
                           style="width:25%; background:#333; color:#ddd; border:1px solid #444; border-radius:3px; padding:2px;">
                    `;
                    availableFields.forEach(fld=>{
                        let sel= (fld=== cObj.field)? "selected":"";
                        fieldSelectHtml+= `<option value="${fld}" ${sel}>${fld}</option>`;
                    });
                    fieldSelectHtml+= `</select>`;

                    // Operator select
                    let opSelectHtml= `
                      <select class="condOpSelect" data-rank="${rName}" data-idx="${idx}"
                              style="width:20%; background:#333; color:#ddd; border:1px solid #444;
                                     border-radius:3px; padding:2px;">
                        <option value=">="  ${cObj.operator==='>='?'selected':''}>&ge;</option>
                        <option value="<="  ${cObj.operator==='<='?'selected':''}>&le;</option>
                        <option value=">"   ${cObj.operator==='>'?'selected':''}>&gt;</option>
                        <option value="<"   ${cObj.operator==='<'?'selected':''}>&lt;</option>
                        <option value="=="  ${cObj.operator==='=='?'selected':''}>=</option>
                      </select>
                    `;
                    cDiv.innerHTML=`
                      ${fieldSelectHtml}
                      ${opSelectHtml}
                      <input type="text" class="condValueInput" data-rank="${rName}" data-idx="${idx}"
                             style="width:25%; background:#333; color:#ddd; border:1px solid #444;
                                    border-radius:3px; padding:2px;"
                             value="${cObj.value}" placeholder="e.g. 500 or 500 GB"/>
                      <button class="removeCondBtn ratioTrackerButton"
                              data-rank="${rName}" data-idx="${idx}"
                              style="padding:2px 5px; background:#333; color:#ff6666;">
                        🗑
                      </button>
                    `;
                    condCtn.appendChild(cDiv);
                });
            });

            // events
            // rank name rename
            let rankNameInputs= container.querySelectorAll(".rankNameInput");
            rankNameInputs.forEach(inp=>{
                inp.addEventListener("change",(e)=>{
                    let oldName= e.target.getAttribute("data-rank");
                    let newName= e.target.value.trim();
                    if(!newName){
                        alert("Rank name cannot be empty.");
                        e.target.value= oldName;
                        return;
                    }
                    if(newName!==oldName && rankMap[newName]){
                        alert(`Another rank with name "${newName}" already exists.`);
                        e.target.value= oldName;
                        return;
                    }
                    rankMap[newName]= rankMap[oldName];
                    delete rankMap[oldName];
                    e.target.setAttribute("data-rank", newName);
                    saveRankUpRequirements(rankMap);
                    renderRankUp();
                });
            });

            // addCondBtn
            let addCondBtns= container.querySelectorAll(".addCondBtn");
            addCondBtns.forEach(btn=>{
                btn.addEventListener("click",(e)=>{
                    let r= e.target.getAttribute("data-rank");
                    rankMap[r].push({ field:"daysSinceReg", operator:">=", value:"0" });
                    saveRankUpRequirements(rankMap);
                    renderRankUp();
                });
            });

            // removeRankBtn
            let removeRankBtns= container.querySelectorAll(".removeRankBtn");
            removeRankBtns.forEach(btn=>{
                btn.addEventListener("click",(e)=>{
                    let r= e.target.getAttribute("data-rank");
                    if(confirm(`Remove entire rank "${r}"?`)){
                        delete rankMap[r];
                        saveRankUpRequirements(rankMap);
                        renderRankUp();
                    }
                });
            });

            // removeCondBtn
            let removeCondBtns= container.querySelectorAll(".removeCondBtn");
            removeCondBtns.forEach(btn=>{
                btn.addEventListener("click",(e)=>{
                    let r= btn.getAttribute("data-rank");
                    let idx= parseInt(btn.getAttribute("data-idx"),10);
                    rankMap[r].splice(idx,1);
                    saveRankUpRequirements(rankMap);
                    renderRankUp();
                });
            });

            // condFieldSelect
            let fieldSelects= container.querySelectorAll(".condFieldSelect");
            fieldSelects.forEach(sel=>{
                sel.addEventListener("change",(e)=>{
                    let r= e.target.getAttribute("data-rank");
                    let idx= parseInt(e.target.getAttribute("data-idx"),10);
                    rankMap[r][idx].field= e.target.value.trim();
                    saveRankUpRequirements(rankMap);
                });
            });

            // condOpSelect
            let opSelects= container.querySelectorAll(".condOpSelect");
            opSelects.forEach(sel=>{
                sel.addEventListener("change",(e)=>{
                    let r= e.target.getAttribute("data-rank");
                    let idx= parseInt(e.target.getAttribute("data-idx"),10);
                    rankMap[r][idx].operator= e.target.value;
                    saveRankUpRequirements(rankMap);
                });
            });

            // condValueInput
            let valInps= container.querySelectorAll(".condValueInput");
            valInps.forEach(inp=>{
                inp.addEventListener("change",(e)=>{
                    let r= e.target.getAttribute("data-rank");
                    let idx= parseInt(e.target.getAttribute("data-idx"),10);
                    rankMap[r][idx].value= e.target.value.trim();
                    saveRankUpRequirements(rankMap);
                });
            });
        }

        function renderAll(){
            renderCustomDP();
            renderRankUp();
        }

        renderAll();

        // event: add custom DP
        let addCdpBtn= panel.querySelector("#addCustomDataPointBtn");
        addCdpBtn.addEventListener("click",()=>{
            let dpKey= `custom_${Date.now()}`;
            settings.customDataPoints[dpKey]= { label:"", selector:"", type:"Text" };
            saveSettings(settings);
            renderCustomDP();
        });

        // event: add rank
        let addRankBtn= panel.querySelector("#addRankBtn");
        addRankBtn.addEventListener("click",()=>{
            let rankName= `NewRank_${Date.now()}`;
            rankMap[rankName]= [ { field:"daysSinceReg", operator:">=", value:"0" } ];
            saveRankUpRequirements(rankMap);
            renderRankUp();
        });

        // event: save main settings
        let saveBtn= panel.querySelector("#saveSettingsBtn");
        saveBtn.addEventListener("click",()=>{
            let histInp= panel.querySelector("#historyCountInput");
            let newCount= parseInt(histInp.value,10);
            if(isNaN(newCount)|| newCount<1){
                alert("Invalid number for history entries count.");
                return;
            }
            settings.historyEntriesCount= newCount;

            let unameInp= panel.querySelector(`#username_${currKey}`);
            if(unameInp){
                let val= unameInp.value.trim();
                let us= loadUsernames();
                us[currKey]= val;
                saveUsernames(us);
            }

            let regInp= panel.querySelector(`#registrationDate_${currKey}`);
            if(regInp){
                let rd= regInp.value.trim();
                if(rd!==""){
                    let regx= /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
                    if(!regx.test(rd)){
                        alert("Invalid date format. Use DD/MM/YYYY.");
                        return;
                    }
                }
                let rds= loadRegistrationDates();
                rds[currKey]= rd;
                saveRegistrationDates(rds);
            }
            saveSettings(settings);
            alert("Settings saved. Reload the page to see changes.");
        });

        settingsBtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            panel.style.display= (panel.style.display==="none") ? "block":"none";
        });
    }

    // -----------------------------------------------------------
    // 13) SHOW MAIN PANEL
    // -----------------------------------------------------------
    function showMainPanel(title, contentHtml){
        let infoBox= document.createElement("div");
        infoBox.style.position="fixed";
        infoBox.style.top="20px";
        infoBox.style.right="20px";
        infoBox.style.padding="0";
        infoBox.style.background= mainBgColor;
        infoBox.style.color= textColor;
        infoBox.style.fontFamily="Inter, sans-serif";
        infoBox.style.fontSize= baseFontSize;
        infoBox.style.zIndex="9999";
        infoBox.style.borderRadius="8px";
        infoBox.style.width="320px";
        infoBox.style.boxSizing="border-box";
        infoBox.style.maxHeight="500px";
        infoBox.style.overflowY="auto";
        infoBox.style.opacity="0";
        infoBox.style.transition="opacity 0.5s, height 0.5s";
        infoBox.style.boxShadow="0 2px 8px rgba(0,0,0,0.5)";
        infoBox.style.display="flex";
        infoBox.style.flexDirection="column";

        let header= document.createElement("div");
        header.style.padding="10px 15px";
        header.style.background= headerBgColor;
        header.style.position="relative";
        header.style.display="flex";
        header.style.justifyContent="space-between";
        header.style.alignItems="center";
        header.style.cursor="move";
        header.style.borderRadius="8px 8px 0 0";

        let titleElem= document.createElement("span");
        titleElem.style.fontSize= panelTitleFontSize;
        titleElem.style.color= highlightColor;
        titleElem.textContent= title;
        header.appendChild(titleElem);

        let btnContainer= document.createElement("div");
        btnContainer.style.display="flex";
        btnContainer.style.alignItems="center";

        // toggle
        let toggleBtn= document.createElement("span");
        toggleBtn.textContent="▼";
        toggleBtn.style.marginRight="10px";
        toggleBtn.style.cursor="pointer";
        toggleBtn.style.fontSize="14px";
        toggleBtn.style.color="#ccc";
        toggleBtn.title="Expand/Collapse";
        btnContainer.appendChild(toggleBtn);

        // settings
        let settingsBtn= document.createElement("span");
        settingsBtn.textContent="⚙";
        settingsBtn.style.marginRight="10px";
        settingsBtn.style.cursor="pointer";
        settingsBtn.style.fontSize="16px";
        settingsBtn.style.color="#ccc";
        settingsBtn.title="Settings";
        btnContainer.appendChild(settingsBtn);

        // close
        let closeBtn= document.createElement("span");
        closeBtn.textContent="✕";
        closeBtn.style.cursor="pointer";
        closeBtn.style.fontSize="16px";
        closeBtn.style.color="#ccc";
        closeBtn.title="Close";
        btnContainer.appendChild(closeBtn);

        header.appendChild(btnContainer);
        infoBox.appendChild(header);

        let content= document.createElement("div");
        content.style.padding="15px";
        content.style.display="none";
        content.style.flexGrow="1";
        content.style.overflowY="auto";
        content.innerHTML= contentHtml;
        infoBox.appendChild(content);

        document.body.appendChild(infoBox);
        setTimeout(()=>{ infoBox.style.opacity="1"; },100);

        toggleBtn.addEventListener("click",(e)=>{
            e.stopPropagation();
            if(content.style.display==="none"){
                content.style.display="block";
                toggleBtn.textContent="▲";
            } else {
                content.style.display="none";
                toggleBtn.textContent="▼";
            }
        });
        closeBtn.addEventListener("click",()=>{
            infoBox.style.opacity="0";
            setTimeout(()=>{
                if(infoBox.parentNode) document.body.removeChild(infoBox);
            },500);
        });
        makeDraggable(header, infoBox);
        return { infoBox, content, settingsBtn, infoBoxHeader:header };
    }

    // -----------------------------------------------------------
    // 14) MAIN INITIALIZATION
    // -----------------------------------------------------------
    function initializeTracker() {
        let host= window.location.hostname;
        let settings= loadSettings();
        let customDP= settings.customDataPoints||{};
        let rankMap= loadRankUpRequirements();

        // Identify tracker
        let tracker= { name:'', key:'' };
        if     (host.includes("anthelion.me"))        { tracker.name='anthelion.me';      tracker.key='ANT'; }
        else if(host.includes("gazellegames.net"))    { tracker.name='gazellegames.net';  tracker.key='GGn'; }
        else if(host.includes("redacted.sh"))         { tracker.name='redacted.sh';       tracker.key='RED'; }
        else if(host.includes("orpheus.network"))     { tracker.name='orpheus.network';   tracker.key='OPS'; }
        else if(host.includes("torrent-syndikat.org")){ tracker.name='torrent-syndikat';  tracker.key='TS'; }
        else if(host.includes("blutopia.cc"))         { tracker.name='blutopia.cc';       tracker.key='BLU'; }
        else return; // unknown

        let path= window.location.pathname;
        let search= window.location.search;
        let isUserPage=false;
        switch(tracker.key){
            case 'ANT':
            case 'GGn':
            case 'OPS':
                isUserPage= (
                    (path==="/user.php" && search.includes("id="))||
                    (path==="/userdetails.php" && search.includes("id="))||
                    (path.startsWith("/users/"))
                );
                break;
            case 'RED':
                isUserPage= (
                    (path==="/user.php" && search.includes("id="))||
                    (path.startsWith("/userdetails.php") && search.includes("id="))
                );
                break;
            case 'TS':
                isUserPage= (path.startsWith("/userdetails.php")&& search.includes("id="));
                break;
            case 'BLU':
                isUserPage= (path.startsWith("/users/"));
                break;
            default:
                isUserPage=false;
        }

        let panel= showMainPanel(`${tracker.key} RatioTracker`, "<p style='font-size:12px;'>Loading...</p>");
        let content= panel.content;
        let settingsBtn= panel.settingsBtn;
        let infoBox= panel.infoBox;

        let unames= loadUsernames();
        let configuredUser= (unames[tracker.key]||'').trim();

        let regDates= loadRegistrationDates();
        let regDate= (regDates[tracker.key]||'').trim();

        let extracted="";
        if(isUserPage){
            extracted= extractUserIdentifier(tracker.key).trim();
        }

        if(!isUserPage){
            content.innerHTML= `<p style="font-size:${baseFontSize}; color:#ff6666;">
              Not a user profile page. The script won't run here.
            </p>`;
            setupSettingsPanel(tracker.key, settingsBtn, infoBox);
            return;
        }
        if(!configuredUser){
            content.innerHTML= `<p style="font-size:${baseFontSize}; color:#ff6666;">
              No user ID/username set. Click ⚙ to configure.
            </p>`;
            content.style.display="block";
            setupSettingsPanel(tracker.key, settingsBtn, infoBox);
            return;
        }
        if(extracted.toLowerCase()!== configuredUser.toLowerCase()){
            content.innerHTML= `<p style="font-size:${baseFontSize}; color:#ff6666;">
              Profile does not match your configured ID/username. Click ⚙ to check settings.
            </p>`;
            content.style.display="block";
            setupSettingsPanel(tracker.key, settingsBtn, infoBox);
            return;
        }

        let daysSinceReg= getDaysSinceRegistration(regDate);

        // Step: parse stats per tracker
        let fields=[];
        let newEntry={};
        let storageKey="";
        let username= configuredUser;

        // ---------------------------------
        // 1) ANT (example)
        if(tracker.key==='ANT'){
            fields= [
                { key:'uploadBytes',   label:'Current Upload',   unit:'bytes' },
                { key:'downloadBytes', label:'Current Download', unit:'bytes' },
                { key:'ratio',         label:'Current Ratio',    unit:'ratio' },
                { key:'orbs',          label:'Current Orbs',     unit:'number'}
            ];
            const statsList= document.querySelector(".stats.nobullet");
            if(!statsList){
                content.innerHTML= `<p style="font-size:${baseFontSize}; color:#ff6666;">Unable to find stats on this page.</p>`;
                content.style.display="block";
                setupSettingsPanel(tracker.key, settingsBtn, infoBox);
                return;
            }
            let listItems= statsList.querySelectorAll("li");
            let uploadedText="", downloadedText="", ratioText="";
            let orbs=0;
            listItems.forEach(li=>{
                let text= li.textContent.trim();
                if(text.startsWith("Uploaded:")){
                    uploadedText= text.replace("Uploaded:","").trim();
                } else if(text.startsWith("Downloaded:")){
                    downloadedText= text.replace("Downloaded:","").trim();
                } else if(text.startsWith("Ratio:")){
                    let ratioSpan= li.querySelector("span.tooltip.r50");
                    if(ratioSpan) ratioText= ratioSpan.textContent.trim();
                }
            });
            const bonusPointsEl= document.querySelector("#bonus_points .stat a");
            if(bonusPointsEl){
                let orbsText= bonusPointsEl.textContent.trim().replace(/,/g,'');
                orbs= parseInt(orbsText,10)||0;
            }
            let uploadBytes = parseSize(uploadedText);
            let downloadBytes= parseSize(downloadedText);
            let ratio= parseFloat(ratioText.replace(',','.'))||0;

            newEntry= {
                date:new Date().toISOString(),
                uploadBytes,
                downloadBytes,
                ratio,
                orbs
            };
            storageKey="anthelion_history";
        }
        // 2) GGn
        else if(tracker.key==='GGn'){
            fields= [
                { key:'uploadBytes',   label:'Current Upload',   unit:'bytes' },
                { key:'downloadBytes', label:'Current Download', unit:'bytes' },
                { key:'ratio',         label:'Current Ratio',    unit:'ratio' },
                { key:'gold',          label:'Current Gold',     unit:'number'}
            ];
            let uploadElem= document.querySelector("#stats_seeding .stat.tooltip");
            let uploadedText= uploadElem? uploadElem.textContent.trim():"";
            let downloadElem= document.querySelector("#stats_leeching .stat.tooltip");
            let downloadedText= downloadElem? downloadElem.textContent.trim():"";
            let ratioElem= document.querySelector("#stats_ratio .stat.tooltip");
            let ratioText= ratioElem? ratioElem.textContent.trim():"0";
            let goldElem= document.querySelector("#stats_gold .stat.tooltip");
            let goldText= goldElem? goldElem.textContent.trim().replace(/,/g,''):"0";
            let gold= parseInt(goldText,10)||0;
            let ratio= parseFloat(ratioText.replace(',','.'))||0;
            let uploadBytes= parseSize(uploadedText);
            let downloadBytes= parseSize(downloadedText);
            newEntry= {
                date:new Date().toISOString(),
                uploadBytes,
                downloadBytes,
                ratio,
                gold
            };
            storageKey="ggn_history";
        }
        // 3) RED
        else if(tracker.key==='RED'){
            fields= [
                { key:'uploadBytes', label:'Current Upload', unit:'bytes' },
                { key:'downloadBytes', label:'Current Download', unit:'bytes' },
                { key:'bufferBytes', label:'Current Buffer', unit:'bytes' },
                { key:'ratio', label:'Current Ratio', unit:'ratio' },
                { key:'tokens', label:'Current Tokens', unit:'number'}
            ];
            const uploadEl = document.querySelector("div.box_info:nth-child(2) > ul:nth-child(2) > li:nth-child(3)");
            const downloadEl= document.querySelector("div.box_info:nth-child(2) > ul:nth-child(2) > li:nth-child(4)");
            const bufferEl = document.querySelector("div.box_info:nth-child(2) > ul:nth-child(2) > li:nth-child(5)");
            const ratioEl = document.querySelector("div.box_info:nth-child(2) > ul:nth-child(2) > li:nth-child(6) > span:nth-child(1)");
            const tokensEl = document.querySelector("div.box_info:nth-child(2) > ul:nth-child(2) > li:nth-child(8)");

            if(!uploadEl||!downloadEl||!bufferEl||!ratioEl){
                content.innerHTML= `<p style='font-size:12px; color:#ff6666;'>Unable to find necessary stats on this RED profile page.</p>`;
                content.style.display="block";
                setupSettingsPanel(tracker.key, settingsBtn, infoBox);
                return;
            }
            let uploadText= uploadEl.textContent.trim().replace("Uploaded:","").trim();
            let downloadText= downloadEl.textContent.trim().replace("Downloaded:","").trim();
            let bufferText= bufferEl.textContent.trim().replace("Buffer:","").trim();
            let ratioText= ratioEl.textContent.trim();
            let tokens=0;
            if(tokensEl){
                let tokTxt= tokensEl.textContent.trim().replace("Tokens:","").trim();
                tokens= parseInt(tokTxt.replace(/\D/g,''),10)||0;
            }
            let uploadBytes= parseSize(uploadText);
            let downloadBytes= parseSize(downloadText);
            let bufferBytes= parseSize(bufferText);
            let ratio= parseFloat(ratioText)||0;

            newEntry= {
                date:new Date().toISOString(),
                uploadBytes,
                downloadBytes,
                bufferBytes,
                ratio,
                tokens
            };
            storageKey="red_history";
        }
        // 4) OPS
        else if(tracker.key==='OPS'){
            fields= [
                { key:'uploadBytes', label:'Current Upload', unit:'bytes' },
                { key:'downloadBytes', label:'Current Download', unit:'bytes' },
                { key:'bufferBytes', label:'Current Buffer', unit:'bytes' },
                { key:'ratio', label:'Current Ratio', unit:'ratio' },
                { key:'bonusPoints', label:'Current Bonus Points', unit:'number'}
            ];
            const statsList= document.querySelector(".stats.nobullet");
            if(!statsList){
                content.innerHTML= `<p style='font-size:12px; color:#ff6666;'>Unable to find stats on this page.</p>`;
                content.style.display="block";
                setupSettingsPanel(tracker.key, settingsBtn, infoBox);
                return;
            }
            let listItems= statsList.querySelectorAll("li");
            let uploadedText="", downloadedText="", bufferText="", ratioText="", bonusPointsText="";
            listItems.forEach(li=>{
                let text= li.textContent.trim();
                if(text.startsWith("Uploaded:")){
                    uploadedText= text.replace("Uploaded:","").trim();
                } else if(text.startsWith("Downloaded:")){
                    downloadedText= text.replace("Downloaded:","").trim();
                } else if(text.startsWith("Buffer:")){
                    bufferText= text.replace("Buffer:","").trim();
                } else if(text.startsWith("Ratio:")){
                    let ratioSpan= li.querySelector("span.tooltip.r10");
                    if(ratioSpan) ratioText= ratioSpan.textContent.trim();
                } else if(text.startsWith("Bonus Points:")){
                    bonusPointsText= text.replace("Bonus Points:","").split('•')[0].trim().replace(/,/g,'');
                }
            });
            let uploadBytes= parseSize(uploadedText);
            let downloadBytes= parseSize(downloadedText);
            let bufferBytes= parseSize(bufferText);
            let ratio= parseFloat(ratioText)||0;
            let bonusPoints= parseInt(bonusPointsText,10)||0;

            newEntry= {
                date:new Date().toISOString(),
                uploadBytes,
                downloadBytes,
                bufferBytes,
                ratio,
                bonusPoints
            };
            storageKey="orpheus_history";
        }
        // 5) TS
        else if(tracker.key==='TS'){
            fields= [
                { key:'uploadBytes',     label:'Current Upload',           unit:'bytes' },
                { key:'downloadBytes',   label:'Current Download',         unit:'bytes' },
                { key:'ratio',           label:'Current Ratio',            unit:'ratio' },
                { key:'freeleechTokens', label:'Current Freeleech Tokens', unit:'number'}
            ];
            const statsList= document.querySelectorAll("ul.dList.nsStatusList");
            if(!statsList.length){
                content.innerHTML= `<p style='font-size:12px; color:#ff6666;'>Unable to find stats on this page.</p>`;
                content.style.display="block";
                setupSettingsPanel(tracker.key, settingsBtn, infoBox);
                return;
            }
            let uploadedText="", downloadedText="", ratioText="";
            let freeleechTokens=0;
            statsList.forEach(ul=>{
                let liItems= ul.querySelectorAll("li");
                liItems.forEach(li=>{
                    let text= li.textContent.trim();
                    if(text.startsWith("Heruntergeladen")){
                        downloadedText= text.replace("Heruntergeladen","").trim().split('(')[0].trim();
                    } else if(text.startsWith("Hochgeladen")){
                        uploadedText= text.replace("Hochgeladen","").trim().split('(')[0].trim();
                    } else if(text.startsWith("Gesamtratio")){
                        let ratioSpan= li.querySelector("span.rcGood, span.rcBad, span.rcNeutral");
                        ratioText= ratioSpan? ratioSpan.textContent.trim():"0";
                    }
                });
            });
            const freeleechIcon= document.querySelector("ul.dList.nsStatusList li i.fas.fa-coin[title='Freeleech-Tokens']");
            if(freeleechIcon){
                let freeleechLi= freeleechIcon.closest("li");
                if(freeleechLi){
                    let nextLi= freeleechLi.nextElementSibling;
                    if(nextLi){
                        let tokensText= nextLi.textContent.trim();
                        let match= tokensText.match(/\d+/);
                        if(match) freeleechTokens= parseInt(match[0],10)||0;
                    }
                }
            }
            let uploadBytes= parseSize(uploadedText);
            let downloadBytes= parseSize(downloadedText);
            let ratio= parseFloat(ratioText.replace(',','.'))||0;

            newEntry= {
                date:new Date().toISOString(),
                uploadBytes,
                downloadBytes,
                ratio,
                freeleechTokens
            };
            storageKey="ts_history";
        }
        // 6) BLU
        else if(tracker.key==='BLU'){
            fields= [
                { key:'ratio',                label:'Current Ratio',            unit:'ratio' },
                { key:'bufferBytes',          label:'Current Buffer',           unit:'bytes' },
                { key:'uploadBytes',          label:'Current Upload',           unit:'bytes' },
                { key:'downloadBytes',        label:'Current Download',         unit:'bytes' },
                { key:'torrentDownloadBytes', label:'Current Torrent Download', unit:'bytes'},
                { key:'freeleechTokens',      label:'Current Freeleech Tokens', unit:'number'},
                { key:'bon',                  label:'Current BON',              unit:'number'}
            ];
            const statsList= document.querySelectorAll("dl.key-value");
            if(!statsList.length){
                content.innerHTML= "<p style='font-size:12px; color:#ff6666;'>Unable to find stats on this page.</p>";
                content.style.display="block";
                setupSettingsPanel(tracker.key, settingsBtn, infoBox);
                return;
            }
            let ratioText="", bufferText="", uploadText="", downloadText="";
            let torrentDownloadText="", freeleechTokens=0, bon=0;
            statsList.forEach(dl=>{
                const divs= dl.querySelectorAll("div.key-value__group, div.key-value_group");
                divs.forEach(div=>{
                    let dt= div.querySelector("dt");
                    let dd= div.querySelector("dd");
                    if(dt&&dd){
                        let key= dt.textContent.trim();
                        let val= dd.textContent.trim();
                        if     (key==="Ratio") ratioText= val;
                        else if(key==="Buffer") bufferText= val;
                        else if(key==="Account Upload (Total)") uploadText= val;
                        else if(key==="Account Download (Total)") downloadText= val;
                        else if(key==="Torrent Download") torrentDownloadText= val;
                        else if(key==="Freeleech tokens") freeleechTokens= parseInt(val.replace(/\D/g,''),10)||0;
                        else if(key==="BON") bon= parseInt(val.replace(/\s/g,''),10)||0;
                    }
                });
            });
            let ratio= parseFloat(ratioText)||0;
            let bufferBytes= parseSize(bufferText);
            let uploadBytes= parseSize(uploadText);
            let downloadBytes= parseSize(downloadText);
            let torrentDownloadBytes= parseSize(torrentDownloadText);

            newEntry= {
                date:new Date().toISOString(),
                ratio,
                bufferBytes,
                uploadBytes,
                downloadBytes,
                torrentDownloadBytes,
                freeleechTokens,
                bon
            };
            storageKey="blutopia_history";
        }

        // add custom data point extraction:
        for(let ck in customDP){
            let dp= customDP[ck];
            let val="";
            try{
                let el= document.querySelector(dp.selector);
                if(el){
                    val= el.textContent.trim();
                    if(dp.type.trim().toLowerCase()==='bytes'){
                        val= parseSize(val);
                    } else if(dp.type.trim().toLowerCase()==='number'){
                        val= parseFloat(val.replace(',','.'))||0;
                    }
                } else {
                    val= "N/A";
                }
            } catch(err){
                console.error(`Error extracting custom data point "${dp.label}":`,err);
                val="Error";
            }
            newEntry[dp.label]= val;
        }

        let {history, newEntryCreated}= saveDailyEntry(storageKey, newEntry);
        let prevEntry= (history.length>1)? history[history.length-2]:null;
        let {changesHtml, currentValuesHtml}= generateChangesAndCurrent(fields,newEntry,prevEntry,customDP);

        let hCount= settings.historyEntriesCount;
        let histEntries= history.slice(-hCount);

        // compute long-term
        let fieldsAvg= computeDayMonthYearAverages(history,fields);
        let customAvg= computeDayMonthYearAveragesCustomDataPoints(history, customDP);
        let longTermHtml= buildLongTermStatsTable(fields, fieldsAvg, customDP, customAvg);

        // rank-up
        let userStats= {
            ratio:        newEntry.ratio||0,
            uploadBytes:  newEntry.uploadBytes||0,
            daysSinceReg,
            orbs:         newEntry.orbs || 0
            // if you want "perfectFlacCount", user must define that custom data point, script puts numeric value in newEntry, we can add userStats.perfectFlacCount= ...
        };
        let rankNames= Object.keys(rankMap);
        let rankResults={};
        rankNames.forEach(rName=>{
            let condArr= rankMap[rName];
            let pass= meetsAllConditions(condArr,userStats);
            rankResults[rName]= pass;
        });
        let rankUpHtml= buildRankUpSummary(rankMap, userStats, rankResults);

        // Build final
        let html=`
          <h4 id="toggleChangesSection"
              style="margin:10px 0; font-size:${sectionTitleFontSize}; color:${highlightColor};
                     border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; cursor:pointer;">
            Changes Since Last Update <span style="font-size:0.9em; color:#aaa;">▼</span>
          </h4>
          <div id="changesContainer" style="display:none;">
            ${changesHtml}
          </div>

          <h4 id="toggleCurrentSection"
              style="margin:10px 0; font-size:${sectionTitleFontSize}; color:${highlightColor};
                     border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; cursor:pointer;">
            Current Statistics <span style="font-size:0.9em; color:#aaa;">▼</span>
          </h4>
          <div id="currentStatsContainer" style="display:none;">
            ${currentValuesHtml}
            ${username? `<p style="margin:2px 0; font-size:${baseFontSize};">
              <strong>Username/ID:</strong> ${username}</p>`:''}
            ${regDate? `<p style="margin:2px 0; font-size:${baseFontSize};">
              <strong>Registration Date:</strong> ${regDate}</p>`:''}
          </div>

          <h4 id="toggleLongTermSection"
              style="margin:10px 0; font-size:${sectionTitleFontSize}; color:${highlightColor};
                     border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; cursor:pointer;">
            Long-Term Stats <span style="font-size:0.9em; color:#aaa;">▼</span>
          </h4>
          <div id="longTermContainer" style="display:none;">
            ${longTermHtml}
          </div>

          <h4 id="toggleRankUpSection"
              style="margin:10px 0; font-size:${sectionTitleFontSize}; color:${highlightColor};
                     border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; cursor:pointer;">
            Rank-Up <span style="font-size:0.9em; color:#aaa;">▼</span>
          </h4>
          <div id="rankUpContainerSummary" style="display:none;">
            ${rankUpHtml}
          </div>

          <h4 id="toggleHistorySection"
              style="margin:10px 0; font-size:${sectionTitleFontSize}; color:${highlightColor};
                     border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; cursor:pointer;">
            History <span style="font-size:0.9em; color:#aaa;">▼</span>
          </h4>
          <div id="historyContainer" style="display:none;">
            <ul id="ratioTrackerEntries" style="list-style:none; padding:0; margin:0;">
        `;
        histEntries.forEach(entry=>{
            let d= new Date(entry.date);
            let ds= d.toLocaleString();
            let lines=[];
            fields.forEach(f=>{
                if(entry[f.key]!==undefined){
                    let val= entry[f.key];
                    if(f.unit==='bytes') val= formatBytes(val);
                    else if(f.unit==='ratio') val= val.toFixed(2);
                    lines.push(`<strong>${f.label}:</strong> ${val}`);
                }
            });
            for(let ck in customDP){
                let dp= customDP[ck];
                let v= entry[dp.label];
                if(v!==undefined){
                    if(dp.type.trim().toLowerCase()==='bytes'){
                        v= formatBytes(v);
                    } else if(dp.type.trim().toLowerCase()==='number'){
                        v= parseFloat(v).toFixed(2);
                    }
                    lines.push(`<strong>${dp.label}:</strong> ${v}`);
                }
            }
            let joined= lines.join(' | ');
            html+=`
              <li data-date="${entry.date}"
                  style="border-bottom:1px solid rgba(255,255,255,0.1); padding:5px 0; margin:0;">
                <div style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                     class="historyToggle">
                  <span style="color:#66ccff; font-size:${baseFontSize}; display:flex; align-items:center;">
                    <span class="toggleIcon" style="margin-right:5px;">▼</span>${ds}
                  </span>
                  <button class="ratioTrackerRemove ratioTrackerButton"
                          style="background:#333; color:#ff6666; font-size:12px;"
                          data-date="${entry.date}" title="Remove this entry">
                    🗑
                  </button>
                </div>
                <div class="historyDetails" style="display:none; margin-top:5px; font-size:${baseFontSize};">
                  ${joined}
                </div>
              </li>
            `;
        });
        html+= `</ul></div>`;

        if(newEntryCreated){
            html+= `<p style="margin:10px 0; font-style:italic; font-size:${baseFontSize};
                            color:${highlightColor};">
                      New daily entry created.
                    </p>`;
        } else {
            html+= `<p style="margin:10px 0; font-style:italic; font-size:${baseFontSize};
                            color:${highlightColor};">
                      Today's entry already exists. No new entry.
                    </p>`;
        }

        html+=`
          <button id="ratioTrackerClearBtn" class="ratioTrackerButton" style="margin-top:15px;">Clear All Data</button>
          <button id="ratioTrackerExportBtn" class="ratioTrackerButton" style="margin-top:5px; margin-left:5px;">
            Export Data
          </button>
          <button id="ratioTrackerImportBtn" class="ratioTrackerButton" style="margin-top:5px; margin-left:5px;">
            Import Data
          </button>
          <input type="file" id="ratioTrackerImportFile" accept="application/json" style="display:none;" />
        `;

        content.innerHTML= html;
        content.style.display="block";

        setupToggleSection("toggleChangesSection", "changesContainer", content);
        setupToggleSection("toggleCurrentSection","currentStatsContainer",content);
        setupToggleSection("toggleLongTermSection","longTermContainer",content);
        setupToggleSection("toggleRankUpSection","rankUpContainerSummary",content);
        setupToggleSection("toggleHistorySection","historyContainer",content);

        setupSettingsPanel(tracker.key, settingsBtn, infoBox);

        // history toggles
        let hToggles= content.querySelectorAll("#historyContainer .historyToggle");
        hToggles.forEach(tg=>{
            tg.addEventListener("click",(e)=>{
                e.preventDefault();
                let details= tg.nextElementSibling;
                if(!details.style.display|| details.style.display==="none"){
                    details.style.display="block";
                    let ic= tg.querySelector(".toggleIcon");
                    if(ic) ic.textContent="▲";
                } else {
                    details.style.display="none";
                    let ic= tg.querySelector(".toggleIcon");
                    if(ic) ic.textContent="▼";
                }
            });
        });
        // remove entry
        let removeBtns= content.querySelectorAll("#historyContainer .ratioTrackerRemove");
        removeBtns.forEach(btn=>{
            btn.addEventListener("click",(e)=>{
                e.stopPropagation();
                e.preventDefault();
                let dStr= btn.getAttribute("data-date");
                if(confirm("Remove this entry?")){
                    removeEntry(storageKey, dStr);
                    btn.closest("li").remove();
                }
            });
        });

        // CLEAR
        let clrBtn= content.querySelector("#ratioTrackerClearBtn");
        clrBtn.addEventListener("click",()=>{
            if(confirm("Clear all stored data for this tracker?")){
                localStorage.removeItem(storageKey);
                alert("All data cleared. Reload the page.");
            }
        });
        // EXPORT
        let expBtn= content.querySelector("#ratioTrackerExportBtn");
        expBtn.addEventListener("click",()=>{
            let h= JSON.parse(localStorage.getItem(storageKey))||[];
            let s= JSON.stringify(h,null,2);
            let blob= new Blob([s],{type:"application/json"});
            let url= URL.createObjectURL(blob);
            let a= document.createElement('a');
            a.href= url;
            a.download= storageKey+".json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        // IMPORT
        let impBtn= content.querySelector("#ratioTrackerImportBtn");
        let impFile= content.querySelector("#ratioTrackerImportFile");
        impBtn.addEventListener("click",()=>{
            impFile.value="";
            impFile.click();
        });
        impFile.addEventListener("change",()=>{
            let f= impFile.files[0];
            if(!f)return;
            let reader= new FileReader();
            reader.onload=(e)=>{
                try{
                    let arr= JSON.parse(e.target.result);
                    if(!Array.isArray(arr)){
                        alert("Invalid format. Expected an array of entries.");
                        return;
                    }
                    localStorage.setItem(storageKey,JSON.stringify(arr));
                    alert("Data imported. Reload the page.");
                }catch(err){
                    alert("Error parsing JSON: "+ err.message);
                }
            };
            reader.readAsText(f);
        });
    }

    // Finally run
    initializeTracker();
})();