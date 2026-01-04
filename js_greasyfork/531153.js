// ==UserScript==
// @name         Event Report Query Tool (fixed)
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Event Report Query Tool – dokładniejsze obliczanie czasu użycia bram wraz z obsługą uszkodzeń
// @match        https://trans-logistics-eu.amazon.com/yms/eventHistory*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531153/Event%20Report%20Query%20Tool%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531153/Event%20Report%20Query%20Tool%20%28fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ------------------------------------------------------------------
       0.  KONFIGURACJA / STYLE
    ------------------------------------------------------------------ */
    GM_addStyle(`
        #queryTool {
            position: fixed; top: 20px; right: 20px;
            background: white; padding: 15px;
            border: 1px solid #ccc; border-radius: 5px;
            z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 25%;
            font-family: Arial,Helvetica,sans-serif;
            font-size: 12px;
        }
        #queryTool.minimized{width:30px;height:30px;overflow:hidden;}
        #toggleButton{
            position:absolute;top:5px;right:5px;cursor:pointer;
            background:#f0f0f0;border:none;border-radius:3px;padding:2px 6px;
        }
        #resultArea,#dockAnalysisArea,#damagedDocksArea{
            width:100%;min-height:200px;margin-top:10px;resize:vertical;
        }
        .input-group{margin:10px 0;}
        .input-group label{display:block;margin-bottom:5px;}
    `);

    /* ------------------------------------------------------------------
       1.  INTERFEJS
    ------------------------------------------------------------------ */
    const toolDiv = document.createElement('div');
    toolDiv.id = 'queryTool';
    toolDiv.innerHTML = `
        <button id="toggleButton">−</button>
        <h3>Event Report Query Tool</h3>
        <div class="input-group">
            <label for="startDate">Start Date:</label>
            <input type="datetime-local" id="startDate">
        </div>
        <div class="input-group">
            <label for="endDate">End Date:</label>
            <input type="datetime-local" id="endDate">
        </div>
        <button id="lastWeek">Zeszły tydzień</button>
        <button id="runQuery">Run Query</button>
        <textarea id="resultArea" placeholder="Results will appear here..."></textarea>
        <button id="analyzeDocks">Analyze Dock Usage</button>
        <textarea id="dockAnalysisArea" placeholder="Dock usage analysis will appear here..."></textarea>
        <button id="analyzeDamaged">Analyze Damaged Docks</button>
        <textarea id="damagedDocksArea" placeholder="Damaged docks analysis will appear here..."></textarea>
    `;
    document.body.appendChild(toolDiv);

    document.getElementById('toggleButton').addEventListener('click', () => {
        toolDiv.classList.toggle('minimized');
        document.getElementById('toggleButton').textContent = toolDiv.classList.contains('minimized') ? '+' : '−';
    });

    /* ------------------------------------------------------------------
       2.  POMOCNICZE
    ------------------------------------------------------------------ */
    function pad(n){return n.toString().padStart(2,'0');}
    function formatLocalDateTime(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
    function sanitizeComment(c){return (!c?'':c).replace(/[,;\n\r\t]/g,' ').replace(/\s+/g,' ').trim();}

    /* szybki ISO-format bez przecinka */
    function fmtDateTime(ts){
        const d = new Date(ts);
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
            `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    /* ------------------------------------------------------------------
       3.  "Zeszły tydzień"
    ------------------------------------------------------------------ */

    document.getElementById('lastWeek').addEventListener('click', () => {
        const now = new Date();

        // Znajdujemy poniedziałek z zeszłego tygodnia
        const lastSunday = new Date(now);
        lastSunday.setDate(now.getDate() - now.getDay() - 7); // cofamy do poprzedniej niedzieli
        lastSunday.setHours(7, 0, 0, 0);

        const nextSunday = new Date(lastSunday);
        nextSunday.setDate(lastSunday.getDate() + 7);
        nextSunday.setHours(5, 0, 0, 0);


        // Dla debugowania - wyświetl w konsoli
        console.log('Start:', lastSunday);
        console.log('End:', nextSunday);

        document.getElementById('startDate').value = formatLocalDateTime(lastSunday);
        document.getElementById('endDate').value = formatLocalDateTime(nextSunday);
    });


    // document.getElementById('lastWeek').addEventListener('click',()=>{
    //     const now=new Date();
    //     const dow=now.getDay(); // 0 = niedziela
    //     const thisSun=new Date(now);thisSun.setHours(0,0,0,0);thisSun.setDate(thisSun.getDate()-dow);
    //     const lastSun=new Date(thisSun);lastSun.setDate(thisSun.getDate()-7);
    //     const start=new Date(lastSun);start.setHours(7,0,0,0); // DS 07:00
    //     const end=new Date(lastSun);end.setDate(end.getDate()+7);end.setHours(5,0,0,0); // NS kończy 05:00
    //     document.getElementById('startDate').value=formatLocalDateTime(start);
    //     document.getElementById('endDate').value=formatLocalDateTime(end);
    // });

    /* ------------------------------------------------------------------
   ANALYZE DAMAGED DOCKS  – raport TSV z poprawnym formatem daty
------------------------------------------------------------------ */
    function analyzeDamagedDocks(events, reportStartTs, reportEndTs){
        const damageInt = buildDamageIntervals(events, reportStartTs, reportEndTs);
        let rpt = "Dock\tStart Date-Time\tEnd Date-Time\tDuration (Hours)\tComment\n";

        for(const [dock, arr] of Object.entries(damageInt)){
            arr.forEach(iv=>{
                const durH = (iv.end - iv.start) / 3_600_000;
                rpt += `${dock}\t${fmtDateTime(iv.start)}\t${fmtDateTime(iv.end)}` +
                    `\t${durH.toFixed(2)}\t${sanitizeComment(iv.comment||'')}\n`;
            });
        }
        return rpt;
    }



    /* ------------------------------------------------------------------
   BUDOWANIE OKRESÓW USZKODZEŃ
   • START  → ADD_EQUIPMENT          (vehicleType === "AIRPLANE")
   • END    → REMOVE_EQUIPMENT       (po vehicleId – lokalizacja może być inna)
   • fallback → LOCATION_AUDIT       (gdy AIRPLANE stoi już przy raporcie)
------------------------------------------------------------------ */
    function buildDamageIntervals(events, reportStartTs, reportEndTs) {
        const gateRx = /^DD\d+$/;               // interesują nas tylko doki

        const open = {};    // gate -> {vid,start,comment}
        const byVid = {};   // vid  -> gate (z otwartym incydentem)
        const out  = {};    // gate -> [{start,end,comment}]

        // chronologicznie
        events.sort((a, b) => a.timestamp - b.timestamp);

        events.forEach(ev => {
            const evt = ev.eventType;
            const vid = (ev.vehicleId || '').trim();
            const ts  = ev.timestamp * 1000;

            /* ---------- END (może być w dowolnej lokalizacji) ---------- */
            if (evt === "REMOVE_EQUIPMENT" && vid) {
                const gateWithOpen = byVid[vid];
                if (gateWithOpen && open[gateWithOpen]) {
                    out[gateWithOpen][out[gateWithOpen].length - 1].end = ts;
                    delete open[gateWithOpen];
                    delete byVid[vid];
                }
                return;                         // koniec obsługi tego eventu
            }

            /* ---------- dalej analizujemy tylko doki DD… ---------------- */
            const gate = (ev.location || '').trim();
            if (!gateRx.test(gate)) return;

            /* --- uzupełnianie brakującego komentarza ------------------- */
            if (open[gate]                             // incydent trwa
                && !open[gate].comment                 // brak komentarza
                && (ev.comment || '').trim() !== '') { // a teraz się pojawił
                open[gate].comment = ev.comment;
                const arr = out[gate];
                if (arr && arr.length) arr[arr.length - 1].comment = ev.comment;
                // analizujemy event dalej
            }

            const vType = (ev.vehicleType || '').trim();
            if (vType !== "AIRPLANE" || !vid) return;  // zależy nam tylko na AIRPLANE

            /* ---------- START ------------------------------------------ */
            if (evt === "ADD_EQUIPMENT") {
                if (!open[gate]) {
                    if (!out[gate]) out[gate] = [];
                    open[gate] = { vid, start: ts, comment: ev.comment || '' };
                    byVid[vid] = gate;
                    out[gate].push({ start: ts, end: null, comment: ev.comment || '' });
                }
                return;
            }

            /* fallback – samolot był już przy bramie na początku raportu */
            if (evt === "LOCATION_AUDIT" && !open[gate]) {
                if (!out[gate]) out[gate] = [];
                open[gate] = { vid, start: reportStartTs, comment: ev.comment || '' };
                byVid[vid] = gate;
                out[gate].push({ start: reportStartTs, end: null, comment: ev.comment || '' });
            }
        });

        /* --- domknięcie incydentów wybiegających za koniec raportu ------ */
        for (const g in open) {
            const arr = out[g];
            if (arr && arr[arr.length - 1].end == null) {
                arr[arr.length - 1].end = reportEndTs;
            }
        }
        return out;
    }




    /* ------------------------------------------------------------------
       6.  ANALYZE DOCK USAGE  – zintegrowane uszkodzenia
    ------------------------------------------------------------------ */
    function analyzeDockUsage(events){
        const MIN_MS   = 3*60*1000;   // 3 minuty
        const MAX_H    = 10.5;        // długość zmiany
        const LOOKA    = 240*60*1000; // 4h okno na HOSTLER_COMPLETE → TDR_DOCK
        const ddRx     = /^DD\d+$/;
        const START_E  = new Set(["TDR_DOCK","ADD_EQUIPMENT"]);
        const END_E    = new Set(["TDR_RELEASE","REMOVE_EQUIPMENT","ADD_EQUIPMENT"]);
        const SELF_E   = "MOVE_SELF";

        const fmtDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

        /* ----- struktura doków ----- */
        const dockInt={};
        for(let i=101;i<=164;i++){
            if([106,107,113,114,115,130,131,142].includes(i)) continue;
            dockInt[`DD${i}`]=[];
        }

        /* ----- sortowanie ----- */
        events.sort((a,b)=>a.timestamp-b.timestamp);

        /* ----- zakres analizy ----- */
        const sIn = new Date(document.getElementById('startDate').value);
        const eIn = new Date(document.getElementById('endDate').value);
        const sDay= new Date(sIn); sDay.setHours(0,0,0,0);
        const cut05=new Date(eIn); cut05.setHours(5,0,0,0);
        let eDay  = new Date(eIn);
        if(eIn.getTime()<=cut05.getTime()) eDay.setDate(eDay.getDate()-1);
        eDay.setHours(0,0,0,0);

        /* ----- przygotowanie usage ----- */
        const days=[];
        for(let d=new Date(sDay);d<=eDay;d.setDate(d.getDate()+1)) days.push(fmtDate(d));
        const usage={};
        Object.keys(dockInt).forEach(g=>{
            usage[g]={};
            days.forEach(d=>usage[g][d]={DS:0,NS:0});
        });

        /* ----- pomocnicze ----- */
        function hasNextDock(idx){
            const base=events[idx], limit=base.timestamp*1000+LOOKA;
            for(let j=idx+1;j<events.length;j++){
                const n=events[j];
                if(n.timestamp*1000>limit) break;
                if(n.eventType==="TDR_DOCK" && n.vehicleId===base.vehicleId && (n.location||'').trim()===(base.location||'').trim()) return true;
            }
            return false;
        }

        /* ----- budowanie interwałów START → END ----- */
        const active={};
        for(let i=0;i<events.length;i++){
            const ev=events[i];
            const ts=ev.timestamp*1000;
            const vid=ev.vehicleId;
            if(!vid) continue;
            const loc=(ev.location||'').trim();
            if(ev.eventType==="ADD_EQUIPMENT" && ev.vehicleType==="TRACTOR") continue;

            /* ---- korekta zmiany vehicleId na tej samej bramie ------------------ */
            if (ev.eventType === "UPDATE_LICENSE_PLATE" || ev.eventType === "UPDATE_EQUIPMENT")
            {
                console.log("test1: " + vid);
                const loc = (ev.location || '').trim();
                if (ddRx.test(loc) && vid) {
                    console.log("test1: " + vid);
                    // Czy na tej bramie mamy otwarty cykl z innym vehicleId?
                    for (const oldVid in active) {
                        if (active[oldVid].gate === loc && oldVid !== vid) {
                            // Przepisz cykl pod nowe vehicleId
                            active[vid] = active[oldVid];
                            delete active[oldVid];
                            break;
                        }
                    }
                }
                // UPDATE_LICENSE_PLATE nie jest ani STARTem, ani ENDem – lecimy dalej
            }


            /* --- END trigger --- */
            if(active[vid])
            {
                const {gate,start}=active[vid];
                const byGateEvent   = END_E.has(ev.eventType) && gate===loc;
                const bySelfEvent   = ev.eventType===SELF_E;
                const byOtherLoc    = !ddRx.test(loc);
                const byCheckOut    = ev.eventType==="CHECK_OUT"; // nowy warunek


                if(vid == "040ebc9a-5fb5-4e9f-9d72-492fc1d9e11f" || vid == "84dc960d-a1ec-47da-961c-b55b69c8f0ae")
                {
                    console.log("byGateEvent: " + byGateEvent);
                    console.log("bySelfEvent: " + bySelfEvent);
                    console.log("byOtherLoc: " + byOtherLoc);
                    console.log("byCheckOut: " + byCheckOut);
                }


                if(byGateEvent || bySelfEvent || byOtherLoc || byCheckOut){ // dodany nowy warunek
                    const dur=ts-start;
                    if(dur>=MIN_MS && (gate in dockInt)) dockInt[gate].push({start,end:ts});
                    delete active[vid];
                }
            }

            /* --- START trigger --- */
            let isStart=false;
            if(START_E.has(ev.eventType))
            {
                isStart=true;

                // wyjątek – ADD_EQUIPMENT, ale tylko jeśli TDR_DOCK wystąpi w 4h
                if (ev.eventType === "ADD_EQUIPMENT" && ddRx.test(loc)) {
                    isStart = hasNextDock(i);
                }
            }
            else if(ev.eventType==="HOSTLER_COMPLETE" && ddRx.test(loc) && hasNextDock(i)) isStart=true;

            // Dodaj logging przed sprawdzeniem START
            if(vid == "040ebc9a-5fb5-4e9f-9d72-492fc1d9e11f"  || vid == "84dc960d-a1ec-47da-961c-b55b69c8f0ae") {
                console.log("Event:", {
                    timestamp: new Date(ts).toISOString(),
                    type: ev.eventType,
                    location: loc,
                    isStart,
                    isInSTART_E: START_E.has(ev.eventType),
                    currentlyActive: !!active[vid]
                });
            }


            if(isStart){
                if(active[vid]){
                    const prev=active[vid];
                    const d=ts-prev.start;
                    if(d>=MIN_MS && (prev.gate in dockInt)) dockInt[prev.gate].push({start:prev.start,end:ts});
                }
                active[vid]={gate:loc,start:ts};

                // Dodaj logging po dodaniu do active
                if(vid == "040ebc9a-5fb5-4e9f-9d72-492fc1d9e11f"  || vid == "84dc960d-a1ec-47da-961c-b55b69c8f0ae") {
                    console.log("Added to active:", {
                        vid: vid,
                        gate: loc,
                        start: new Date(ts).toISOString()
                    });
                }
            }
        }

        /* ----- domknięcie otwartych cykli końcem zakresu ----- */
        const endTs=eIn.getTime();
        for(const vid in active){
            const {gate,start}=active[vid];
            const dur=endTs-start;
            if(dur>=MIN_MS && (gate in dockInt)) dockInt[gate].push({start,end:endTs});
        }

        /* ----- scalanie przerw < MIN_MS ----- */
        function merge(arr){
            if(!arr.length) return [];
            arr.sort((a,b)=>a.start-b.start);
            const out=[arr[0]];
            for(let i=1;i<arr.length;i++){
                const L=out[out.length-1], C=arr[i];
                if(C.start<=L.end+MIN_MS) L.end=Math.max(L.end,C.end);
                else out.push(C);
            }
            return out;
        }
        for(const g in dockInt) dockInt[g]=merge(dockInt[g]);

        /* ----- przypisywanie DS / NS ----- */
        function overlap(s1,e1,s2,e2){const s=Math.max(s1.getTime(),s2.getTime());const e=Math.min(e1.getTime(),e2.getTime());return e>s?(e-s)/3600000:0;}
        for(const gate in dockInt){
            dockInt[gate].forEach(iv=>{
                const sL=new Date(iv.start); const eL=new Date(iv.end);
                let cur=new Date(sL); cur.setHours(0,0,0,0); if(cur<sDay) cur=new Date(sDay);
                const last=new Date(eL); last.setHours(0,0,0,0); if(last>eDay) last.setTime(eDay.getTime());
                for(let d=new Date(cur);d<=last;d.setDate(d.getDate()+1)){
                    const day=fmtDate(d);
                    const dsS=new Date(d); dsS.setHours(7,0,0,0);
                    const dsE=new Date(d); dsE.setHours(17,30,0,0);
                    const nsS=new Date(d); nsS.setHours(18,30,0,0);
                    const nsE=new Date(d); nsE.setDate(nsE.getDate()+1); nsE.setHours(5,0,0,0);
                    usage[gate][day].DS+=overlap(sL,eL,dsS,dsE);
                    usage[gate][day].NS+=overlap(sL,eL,nsS,nsE);
                }
            });
        }

        /* ----- OBSŁUGA USZKODZEŃ ----- */
        const damageInt = buildDamageIntervals(events, sIn.getTime(), endTs);
        function dmgOverlap(gate,s,e){
            const arr=damageInt[gate]||[];
            return arr.reduce((sum,iv)=>sum+overlap(s,e,new Date(iv.start),new Date(iv.end)),0);
        }

        /* ------------------------------------------------------------------
           9.  GENEROWANIE CSV  – ujemne wartości za uszkodzenie
        ------------------------------------------------------------------ */
        let report="Dock,Date,Shift,Usage Hours\n";
        for(const gate in usage){
            days.forEach(day=>{
                /* ramy zmian */
                const dsS=new Date(`${day}T07:00`);
                const dsE=new Date(`${day}T17:30`);
                const nsS=new Date(`${day}T18:30`);
                const nsE=new Date(`${day}T05:00`); nsE.setDate(nsE.getDate()+1);

                /* czasy użycia */
                const usedDS=Math.min(usage[gate][day].DS,MAX_H);
                const usedNS=Math.min(usage[gate][day].NS,MAX_H);

                /* uszkodzenia */
                const dmgDS=dmgOverlap(gate,dsS,dsE);
                const dmgNS=dmgOverlap(gate,nsS,nsE);

                /* jeśli cała zmiana wyłączona → -MAX_H */
                const valDS = dmgDS>=MAX_H*0.95 ? (-MAX_H) : (usedDS-dmgDS);
                const valNS = dmgNS>=MAX_H*0.95 ? (-MAX_H) : (usedNS-dmgNS);

                report+=`${gate},${day},DS,${valDS.toFixed(2)}\n`;
                report+=`${gate},${day},NS,${valNS.toFixed(2)}\n`;
            });
        }
        return report;
    }

    /* ------------------------------------------------------------------
       7.  LISTENERY UI
    ------------------------------------------------------------------ */
    document.getElementById('analyzeDocks').addEventListener('click',()=>{
        const data=JSON.parse(document.getElementById('resultArea').value||'{}');
        if(data.events){
            document.getElementById('dockAnalysisArea').value=analyzeDockUsage(data.events);
        }else{
            document.getElementById('dockAnalysisArea').value='Brak danych. Najpierw Run Query.';
        }
    });

    document.getElementById('analyzeDamaged').addEventListener('click',()=>{
        const data = JSON.parse(document.getElementById('resultArea').value||'{}');
        if(data.events){
            const eStart = new Date(document.getElementById('startDate').value).getTime();
            const eEnd   = new Date(document.getElementById('endDate').value).getTime();
            document.getElementById('damagedDocksArea').value =
                analyzeDamagedDocks(data.events, eStart, eEnd);
        }else{
            document.getElementById('damagedDocksArea').value =
                'Brak danych. Najpierw Run Query.';
        }
    });

    /* ------------------------------------------------------------------
       8.  RUN QUERY  (bez zmian poza numerem wersji)
    ------------------------------------------------------------------ */
    async function runEventReport(startDate,endDate){
        const ROWS_PER_REQUEST=3000;
        let allEvents=[], firstRow=0, totalRowCount=null;
        const token=await(new Promise((resolve,reject)=>{
            if(typeof unsafeWindow!=='undefined'&&unsafeWindow.ymsSecurityToken) return resolve(unsafeWindow.ymsSecurityToken);
            let tries=0;
            const iv=setInterval(()=>{
                tries++;
                if(unsafeWindow.ymsSecurityToken){clearInterval(iv);return resolve(unsafeWindow.ymsSecurityToken);}if(tries>50){clearInterval(iv);reject('Nie znaleziono window.ymsSecurityToken');}
            },200);
        }));
        const endpoint=(typeof unsafeWindow!=='undefined'&&unsafeWindow.yardConsoleServiceEndpoint)?unsafeWindow.yardConsoleServiceEndpoint:'https://jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com/';

        do{
            const payload={
                firstRow:firstRow,
                rowCount:ROWS_PER_REQUEST,
                yard:"KTW1",
                eventType:null,location:null,vehicleType:null,vehicleOwner:null,
                vehicleNumber:null,loadIdentifierType:null,loadIdentifier:null,
                seal:null,userId:null,
                fromDate:Math.floor(startDate.getTime()/1000),
                toDate:Math.floor(endDate.getTime()/1000),
                visitReason:null,licensePlateNumber:null,annotation:null,systemName:null,
                requester:{system:"YMSWebApp"}
            };
            await new Promise((resolve,reject)=>{
                GM_xmlhttpRequest({
                    method:"POST",url:`${endpoint}call/getEventReport`,
                    headers:{"User-Agent":navigator.userAgent,"Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=utf-8","api":"getEventReport","method":"POST","token":token},
                    data:JSON.stringify(payload),
                    onload:r=>{
                        let d;try{d=JSON.parse(r.responseText);}catch(err){return reject(`JSON parse error: ${err}`);}if(totalRowCount===null) totalRowCount=d.totalRowCount;if(Array.isArray(d.events)) allEvents.push(...d.events);
                        document.getElementById('resultArea').value=`Fetching ${Math.min(firstRow+ROWS_PER_REQUEST,totalRowCount)} / ${totalRowCount}`;
                        resolve();
                    },
                    onerror:e=>reject(`Request error: ${e.error}`)
                });
            });
            firstRow+=ROWS_PER_REQUEST;
        }while(firstRow<totalRowCount);

        allEvents.sort((a,b)=>a.timestamp-b.timestamp);
        return JSON.stringify({events:allEvents},null,2);
    }

    document.getElementById('runQuery').addEventListener('click',async()=>{
        const sd=new Date(document.getElementById('startDate').value);
        const ed=new Date(document.getElementById('endDate').value);
        document.getElementById('resultArea').value='Running…';
        const res=await runEventReport(sd,ed);
        document.getElementById('resultArea').value=res;
    });

})();
