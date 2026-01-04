// ==UserScript==
// @name         Pixel Downloader
// @version      2025-07-04
// @description  Downloader for pixel sites
// @author       small bee
// @match        *://*.fun/*
// @grant        none
// @namespace https://pixuniverse.fun/
// @downloadURL https://update.greasyfork.org/scripts/537628/Pixel%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537628/Pixel%20Downloader.meta.js
// ==/UserScript==

(async () => {
    const apiBase = window.location.origin;
    const hostname = window.location.hostname;
    const backupBase = `${window.location.protocol}//backup.${hostname}`;

    let me;
    try {
        const response = await fetch(`${apiBase}/api/me`, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        me = await response.json();
    } catch (error) {
        console.warn('Could not fetch /api/me from this site:', error);
        return;
    }

    const parts = hostname.split('.');
    const domain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    const siteName = domain.charAt(0).toUpperCase() + domain.slice(1);

    const ui = document.createElement('div');
    Object.assign(ui.style, {
        position: 'fixed', top: '10px', right: '10px',
        width: '260px', background: 'rgba(0,0,0,0.8)',
        color: '#fff', borderRadius: '8px',
        fontFamily: 'sans-serif', zIndex: 999999,
        userSelect: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    });

    ui.innerHTML = `
        <div id="pv_header" style="cursor:move;padding:8px;background:rgba(255,255,255,0.1);display:flex;justify-content:space-between;border-top-left-radius:8px;border-top-right-radius:8px">
            <strong>${siteName} DL</strong><span id="pv_close" style="cursor:pointer">×</span>
        </div>
        <div style="padding:8px">
            <label>Canvas:<select id="pv_canvas" style="width:100%"></select></label><br><br>
            <label>Mode:<select id="pv_mode" style="width:100%"><option value="area">Area</option><option value="history">History (1 fps, laggy)</option></select></label><br><br>
            <label>Top-Left (x_y):<br><input id="pv_tl" style="width:100%" placeholder="-128_64"></label><br><br>
            <label>Bot-Right (x_y):<br><input id="pv_br" style="width:100%" placeholder="128_0"></label><br><br>
            <div id="pv_dates" style="display:none">
                <label>Start Date:<br><input type="date" id="pv_start" style="width:100%"></label><br><br>
                <label>End Date:<br><input type="date" id="pv_end" style="width:100%"></label><br><br>
            </div>
            <button id="pv_btn" style="width:100%;padding:6px">Download</button>
            <div id="pv_msg" style="margin-top:6px;font-size:12px;min-height:16px"></div>
        </div>
    `;
    document.body.appendChild(ui);

    const select = ui.querySelector('#pv_canvas');
    if (me.canvases) {
        Object.entries(me.canvases).forEach(([cid, canvas]) => {
            const opt = document.createElement('option');
            opt.value = cid;
            opt.textContent = `${cid} - ${canvas.title}`;
            select.append(opt);
        });
        if (select.options.length) select.selectedIndex = 0;
    }

    ui.querySelector('#pv_close').onclick = () => ui.remove();

    (() => {
        const header = ui.querySelector('#pv_header');
        let dx, dy, ox, oy, dragging = false;
        header.onmousedown = e => { dragging = true; ox = ui.offsetLeft; oy = ui.offsetTop; dx = e.clientX; dy = e.clientY; e.preventDefault(); };
        document.onmousemove = e => { if (!dragging) return; ui.style.left = ox + (e.clientX - dx) + 'px'; ui.style.top = oy + (e.clientY - dy) + 'px'; ui.style.right = 'auto'; };
        document.onmouseup = () => dragging = false;
    })();

    ui.querySelector('#pv_mode').onchange = e => ui.querySelector('#pv_dates').style.display = e.target.value === 'history' ? '' : 'none';

    ui.querySelector('#pv_btn').onclick = async () => {
        const msg = ui.querySelector('#pv_msg');
        const displayMsg = m => msg.textContent = m;
        displayMsg('Loading…');
        try {
            const cid = select.value;
            if (!cid || !me.canvases[cid]) throw 'Invalid canvas';
            const canvas = me.canvases[cid];
            const parseXY = str => { const [x, y] = str.split('_').map(Number); if (isNaN(x) || isNaN(y)) throw 'Invalid coordinates'; return [x, y]; };
            const [x1, y1] = parseXY(ui.querySelector('#pv_tl').value);
            const [x2, y2] = parseXY(ui.querySelector('#pv_br').value);
            const width = x2 - x1 + 1, height = y2 - y1 + 1;
            const getOffset = s => -Math.sqrt(s) * Math.sqrt(s) / 2 | 0;
            const toTile = (v, off) => Math.floor((v - off) / 256);

            if (ui.querySelector('#pv_mode').value === 'area') {
                displayMsg('Fetching tiles…');
                const off = getOffset(canvas.size);
                const ix0 = toTile(x1, off), ix1 = toTile(x2, off);
                const iy0 = toTile(y1, off), iy1 = toTile(y2, off);
                const cvs = document.createElement('canvas'); cvs.width = width; cvs.height = height;
                const ctx = cvs.getContext('2d'); const imgData = ctx.createImageData(width, height);
                const data = imgData.data;
                const jobs = [];
                for (let ty = iy0; ty <= iy1; ty++) for (let tx = ix0; tx <= ix1; tx++) {
                    const path = `/chunks/${cid}/${tx}/${ty}.bmp`;
                    jobs.push(
                        fetch(`${apiBase}${path}`)
                            .catch(() => fetch(`${backupBase}${path}`))
                            .then(r => r.arrayBuffer())
                            .then(buf => ({ buf, tx, ty }))
                    );
                }
                const parts = await Promise.all(jobs);
                displayMsg('Stitching image…');
                parts.forEach(({ buf, tx, ty }) => {
                    const bytes = new Uint8Array(buf);
                    if (!bytes.length) return;
                    const bx = tx * 256 + off;
                    const by = ty * 256 + off;
                    bytes.forEach((b, i) => {
                        const gx = bx + (i % 256), gy = by + (i / 256 | 0);
                        if (gx < x1 || gx > x2 || gy < y1 || gy > y2) return;
                        const color = (Array.isArray(canvas.colors) ? canvas.colors : Object.values(canvas.colors))[b & 0x7F];
                        if (!color) return;
                        const idx = ((gy - y1) * width + (gx - x1)) * 4;
                        data[idx] = color[0]; data[idx+1] = color[1]; data[idx+2] = color[2]; data[idx+3] = 255;
                    });
                });
                ctx.putImageData(imgData, 0, 0);
                displayMsg('Preparing download…');
                cvs.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${cid}_${x1}_${y1}_${x2}_${y2}.png`; a.click(); displayMsg('Done!'); });

            } else {
                const startDate = ui.querySelector('#pv_start').value;
                if (!startDate) throw 'Start date missing';
                const endDate = ui.querySelector('#pv_end').value;
                let current = new Date(startDate);
                const end = endDate ? new Date(endDate) : new Date();
                if (end < current) throw 'Invalid date range';
                const fps = 5;
                displayMsg('Recording video…');
                const vcan = document.createElement('canvas'); vcan.width = width; vcan.height = height;
                const vctx = vcan.getContext('2d');
                const recorder = new MediaRecorder(vcan.captureStream(fps), { mimeType: 'video/webm' });
                const chunks = [];
                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.start();

                while (current <= end) {
                    const Y = current.getFullYear(), M = String(current.getMonth()+1).padStart(2,'0'), D = String(current.getDate()).padStart(2,'0');
                    const dayStr = `${Y}${M}${D}`;
                    displayMsg(`Fetching full tiles for ${dayStr}…`);
                    let size = canvas.size;
                    if (canvas.historicalSizes) for (const [d, s] of canvas.historicalSizes) if (dayStr <= d) { size = s; break; }
                    const off2 = getOffset(size);
                    const ix0 = toTile(x1, off2), ix1 = toTile(x2, off2);
                    const iy0 = toTile(y1, off2), iy1 = toTile(y2, off2);
                    const fullJobs = [];
                    for (let ty = iy0; ty <= iy1; ty++) for (let tx = ix0; tx <= ix1; tx++) {
                        const path = `/${Y}/${M}/${D}/${cid}/tiles/${tx}/${ty}.png`;
                        fullJobs.push(
                            fetch(`${apiBase.replace('://','://storage.')}${path}`)
                                .catch(() => fetch(`${backupBase}${path}`))
                                .then(r => r.blob())
                                .then(b => createImageBitmap(b))
                                .then(bmp => ({ bmp, tx, ty }))
                                .catch(() => null)
                        );
                    }
                    const fullTiles = await Promise.all(fullJobs);
                    vctx.clearRect(0,0,width,height);
                    fullTiles.forEach(t => t && vctx.drawImage(t.bmp, t.tx*256+off2-x1, t.ty*256+off2-y1));
                    await new Promise(r => setTimeout(r, 1000/fps));
                    displayMsg(`Applying incremental updates for ${dayStr}…`);
                    let times = [];
                    try {
                        times = await fetch(`${apiBase}/history?day=${dayStr}&id=${cid}`)
                            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
                    } catch (e) {
                        console.warn(`Skipping ${dayStr} – history not available or broken:`, e);
                        current.setDate(current.getDate() + 1);
                        continue;
                    }
                    for (const t of times) {
                        if (t === '0000') continue;
                        const incJobs = [];
                        for (let ty = iy0; ty <= iy1; ty++) for (let tx = ix0; tx <= ix1; tx++) {
                            const incPath = `/${Y}/${M}/${D}/${cid}/${t}/${tx}/${ty}.png`;
                            incJobs.push(
                                fetch(`${apiBase.replace('://','://storage.')}${incPath}`).catch(() => fetch(`${backupBase}${incPath}`)).then(r => r.blob()).then(b => createImageBitmap(b)).then(bmp => ({ bmp, tx, ty })) .catch(() => null)
                            );
                        }
                        const incTiles = await Promise.all(incJobs);
                        incTiles.forEach(t2 => t2 && vctx.drawImage(t2.bmp, t2.tx*256+off2-x1, t2.ty*256+off2-y1));
                        await new Promise(r => setTimeout(r, 1000/fps));
                    }
                    current.setDate(current.getDate() + 1);
                }
                recorder.onstop = () => {
                    displayMsg('Finalizing video…');
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                    a.download = `${cid}_${x1}_${y1}_${x2}_${y2}_timelapse.webm`; a.click(); displayMsg('Done!');
                };
                recorder.stop();
            }
        } catch (err) {
            displayMsg('Error: ' + err);
            console.error(err);
        }
    };
})();
