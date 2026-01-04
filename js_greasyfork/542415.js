// ==UserScript==
// @name         Amazon PPA Monthly Report Extractor (Parallel + Support TPH)
// @namespace    http://tampermonkey.net/
// @version         1.3
// @description   Pull TPH data for a month by shift in parallel under 30 seconds, with Support TPH
// @author       Kjwong
// @match        https://fclm-portal.amazon.com/ppa/inspect/node*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      fclm-portal.amazon.com
// @downloadURL https://update.greasyfork.org/scripts/542415/Amazon%20PPA%20Monthly%20Report%20Extractor%20%28Parallel%20%2B%20Support%20TPH%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542415/Amazon%20PPA%20Monthly%20Report%20Extractor%20%28Parallel%20%2B%20Support%20TPH%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Shift definitions
    const shifts = [
        { name: 'Shift 1', start: { hour:'6',  minute:'30' }, end: { hour:'11', minute:'0'  } },
        { name: 'Shift 2', start: { hour:'11', minute:'0'  }, end: { hour:'15', minute:'30' } },
        { name: 'Shift 3', start: { hour:'15', minute:'30' }, end: { hour:'21', minute:'0'  } },
        { name: 'Shift 4', start: { hour:'21', minute:'0'  }, end: { hour:'1',  minute:'45' } },
        { name: 'Shift 5', start: { hour:'1',  minute:'45' }, end: { hour:'6',  minute:'30' } }
    ];
    // Added 'Support TPH' as the new column
    const headers = ['Date','Shift','Inbound TPH','Outbound TPH','DS TPH','Building TPH','Support TPH'];

    // Date utilities
    function parseDateYMD(str) {
        if (!str) return new Date(NaN);
        const [Y,M,D] = str.includes('/') ? str.split('/') : str.split('-');
        return new Date(+Y, +M - 1, +D);
    }
    function fmtDateYMD(d) {
        const Y = d.getFullYear(),
              M = String(d.getMonth()+1).padStart(2,'0'),
              D = String(d.getDate()).padStart(2,'0');
        return `${Y}/${M}/${D}`;
    }
    function makeDates(start,end,last7) {
        const out = [];
        if (last7) {
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                out.push(fmtDateYMD(d));
            }
        } else {
            let cur = parseDateYMD(start), endD = parseDateYMD(end);
            if (isNaN(cur) || isNaN(endD)) return out;
            while (cur <= endD) {
                out.push(fmtDateYMD(cur));
                cur.setDate(cur.getDate() + 1);
            }
        }
        return out;
    }

    // Loading overlay
    function showLoading(){
        if (document.getElementById('ppaLoadingOverlay')) return;
        const ov = document.createElement('div');
        ov.id = 'ppaLoadingOverlay';
        Object.assign(ov.style,{
            position:'fixed', top:0, left:0, width:'100%', height:'100%',
            background:'rgba(0,0,0,0.4)', display:'flex',
            alignItems:'center', justifyContent:'center',
            color:'#fff', fontSize:'24px', zIndex:10000
        });
        ov.textContent = 'Loading report...';
        document.body.appendChild(ov);
    }
    function hideLoading(){
        const ov = document.getElementById('ppaLoadingOverlay');
        if (ov) ov.remove();
    }

    // Parse row by <th> label (loose matching)
    function parseRowData(doc, label) {
        const th = Array.from(doc.querySelectorAll('th'))
                        .find(t => t.textContent.trim().startsWith(label));
        if (!th) return { units:0, quantity:0, hours:0, tph:0 };
        const cells = th.closest('tr').querySelectorAll('td');
        const getNum = i => {
            const c = cells[i];
            if (!c) return 0;
            const n = parseFloat(c.textContent.replace(/,/g,'').trim());
            return isNaN(n) ? 0 : n;
        };
        return {
            units:    getNum(0),
            quantity: getNum(1),
            hours:    getNum(2),
            tph:      getNum(4)
        };
    }

    // Fetch page via GM_xmlhttpRequest
    async function fetchPage(date, shift, nodeType) {
        return new Promise((resolve,reject) => {
            let endD = parseDateYMD(date);
            const si = +shift.start.hour, ei = +shift.end.hour;
            if (ei < si || (ei===si && +shift.end.minute<=+shift.start.minute)) {
                endD.setDate(endD.getDate() + 1);
            }
            const params = new URLSearchParams({
                nodeType,
                warehouseId: nodeType==='DS'?'VAZ1':'SAZ1',
                spanType: 'Intraday',
                startDateIntraday: date,
                startHourIntraday: shift.start.hour,
                startMinuteIntraday: shift.start.minute,
                endDateIntraday: fmtDateYMD(endD),
                endHourIntraday: shift.end.hour,
                endMinuteIntraday: shift.end.minute
            });
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${window.location.origin}/ppa/inspect/node?${params}`,
                withCredentials: true,
                onload(res) {
                    if (res.status !== 200) return reject(new Error('Fetch failed'));
                    resolve(new DOMParser().parseFromString(res.responseText, 'text/html'));
                },
                onerror() { reject(new Error('Request error')); }
            });
        });
    }

    // Fetch metrics for one shift with retries, now including Support TPH
    async function fetchShiftMetrics(date, shift, attempt = 1) {
        try {
            const [fcDoc, dsDoc] = await Promise.all([
                fetchPage(date, shift, 'FC'),
                fetchPage(date, shift, 'DS')
            ]);

            const fcTotal       = parseRowData(fcDoc, 'Warehouse Total');
            const supportTotal  = parseRowData(fcDoc, 'Support Total');
            const inboundData   = parseRowData(fcDoc, 'Inbound Total');
            const outboundData  = parseRowData(fcDoc, 'Outbound Total');
            const dsTotal       = parseRowData(dsDoc, 'Warehouse Total');

            const inboundTPH    = inboundData.tph.toFixed(2);
            const outboundTPH   = outboundData.tph.toFixed(2);
            const dsTPH         = dsTotal.tph.toFixed(2);

            const buildingQty   = fcTotal.quantity - supportTotal.quantity;
            const buildingHours = fcTotal.hours   + dsTotal.hours;
            const buildingTPH   = buildingHours > 0
                ? (buildingQty / buildingHours).toFixed(2)
                : '0.00';

            // New: Support TPH = total outbound quantity / total support hours
            const supportTPH    = supportTotal.hours > 0
                ? (outboundData.quantity / supportTotal.hours).toFixed(2)
                : '0.00';

            return [
                inboundTPH,
                outboundTPH,
                dsTPH,
                buildingTPH,
                supportTPH
            ];
        } catch (e) {
            console.warn(`Error on ${date} ${shift.name} (try ${attempt}):`, e);
            if (attempt < 3) {
                await new Promise(r => setTimeout(r, 500 * attempt + Math.random() * 200));
                return fetchShiftMetrics(date, shift, attempt + 1);
            }
            return ['ERROR','ERROR','ERROR','ERROR','ERROR'];
        }
    }

    // Parallel generateReport
    async function generateReport(dates, btn) {
        showLoading();
        btn.textContent = 'Loading…';

        // Build task list
        const tasks = [];
        dates.forEach(date => shifts.forEach(shift => tasks.push({ date, shift })));

        const results = [headers];
        let idx = 0;
        const maxWorkers = 8;
        async function worker() {
            while (true) {
                const i = idx++;
                if (i >= tasks.length) break;
                const { date, shift } = tasks[i];
                const row = await fetchShiftMetrics(date, shift);
                results.push([date, shift.name, ...row]);
            }
        }
        await Promise.all(Array.from({ length: maxWorkers }, () => worker()));

        // CSV and download
        const csv = results.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `monthly_report_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        hideLoading();
        btn.textContent = 'Generate Report';
    }

    // UI initialization
    function initUI() {
        const panel = document.createElement('div');
        panel.className = 'tm-ppa-panel';
        const start = Object.assign(document.createElement('input'), { type:'date', id:'ppaStart' });
        const end   = Object.assign(document.createElement('input'), { type:'date', id:'ppaEnd' });
        const chk   = Object.assign(document.createElement('input'), { type:'checkbox', id:'ppaLast7' });
        const lbl   = Object.assign(document.createElement('label'), { htmlFor:'ppaLast7', textContent:'Last 7 Days' });
        const btn   = document.createElement('button');
        btn.textContent = 'Generate Report';
        btn.addEventListener('click', () => {
            const s = start.value, e = end.value, l = chk.checked;
            if (!l && (!s || !e)) return alert('Select dates or Last 7 Days');
            const dates = makeDates(s, e, l);
            if (!dates.length) return alert('Invalid range');
            btn.disabled = true;
            generateReport(dates, btn).finally(() => btn.disabled = false);
        });
        [start, end, chk, lbl, btn].forEach(el => panel.appendChild(el));
        document.body.appendChild(panel);
    }

    // Styles
    GM_addStyle(`
        .tm-ppa-panel { position: fixed; bottom:20px; right:20px;
            background:#fff; border:2px solid #0073bb; padding:8px;
            border-radius:6px; z-index:9999; box-shadow:0 2px 6px rgba(0,0,0,0.2);
        }
        .tm-ppa-panel input, .tm-ppa-panel button {
            border:1px solid #0073bb; border-radius:3px;
            padding:4px; margin-right:6px;
        }
        .tm-ppa-panel button {
            background:#0073bb; color:#fff; cursor:pointer;
        }
    `);

    initUI();

})();
