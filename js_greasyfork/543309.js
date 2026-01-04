// ==UserScript==
// @name         Auto TokyoTech Portal Login 東工大ポータルログイン
// @version      0.0.2
// @description  A login script for old TokyoTech Portal.
// @author       WUHUDSM
// @match        https://portal.nap.gsic.titech.ac.jp/GetAccess/Login?Template=*
// @namespace    https://portal.nap.gsic.titech.ac.jp/
// @match        https://portal.nap.gsic.titech.ac.jp/GetAccess/Login*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543309/Auto%20TokyoTech%20Portal%20Login%20%E6%9D%B1%E5%B7%A5%E5%A4%A7%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/543309/Auto%20TokyoTech%20Portal%20Login%20%E6%9D%B1%E5%B7%A5%E5%A4%A7%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.meta.js
// ==/UserScript==


(() => {
    /* ──── ✂  EDIT THESE  ✂ ──── */
    const USER  = '00A00000';          // 学籍番号
    const PASS  = 'yourpassword';          // Web‑SSO password
    /* card[row‑1][col‑1]  …row = 1‑7,  col = A‑J (⇒ 1‑10) */
    const CARD  = [
        'AAAAAAAAAA', // row 1
        'BBBBBBBBBB', // row 2
        'CCCCCCCCCC', // row 3
        'DDDDDDDDDD', // row 4
        'EEEEEEEEEE', // row 5
        'FFFFFFFFFF', // row 6
        'GGGGGGGGGG'  // row 7
    ];
    /* ─────────────────────────── */

    const tpl = new URLSearchParams(location.search).get('Template');

    /*****************************************************************
     *  STEP‑1: normal user/password                                  *
     *****************************************************************/
    if (tpl === 'userpass_key') {
        const form = document.forms.login;
        if (!form) { return; }
        form.usr_name.value     = USER;
        form.usr_password.value = PASS;
        form.submit();
        return;   // nothing else to do on this page
    }

    /*****************************************************************
     *  STEP‑2: matrix‑card challenge                                 *
     *****************************************************************/
    if (tpl === 'idg_key') {
        /* the three password inputs are named message3, message4, …  */
        const inputs = [...document.querySelectorAll('input[name^="message"]')];

        inputs.forEach(input => {
            /* the challenge ([A,5] or [5, A] or [6,6]) is in the <th>
               belonging to the same <tr>.  */
            const th = input.closest('tr')?.querySelector('th');
            if (!th) { return; }

            const match = th.textContent.trim()
                            .match(/\[([A-J]|\d)\s*,\s*([1-7]|[A-J])]/i);
            if (!match) { return; }

            // Normal case is something like "[B,4]"  (letter,number)
            let [ , first , second ] = match;
            first  = first.toUpperCase();
            second = second.toUpperCase();

            let row, col;   // both zero‑based
            if (isNaN(first)) {          // first = letter (A‑J)
                col = first.charCodeAt(0) - 65;   // A→0 … J→9
                row = +second - 1;                // "1"→0 … "7"→6
            } else if (isNaN(second)) {  // second = letter
                col = second.charCodeAt(0) - 65;
                row = +first - 1;
            } else {                     // both numbers ("[6,6]" format)
                row = +first  - 1;
                col = +second - 1;
            }

            input.value = CARD[row]?.charAt(col) ?? '';
        });

        // all three filled → send the form
        document.forms.login.submit();
        return;
    }

    /*****************************************************************
     *  Fallback (e.g. wireless‑LAN portal)                           *
     *****************************************************************/
    if (location.hostname === 'wlanauth.noc.titech.ac.jp') {
        document.getElementById('username').value = USER;
        document.getElementById('password').value = PASS;
        // that page already defines submitAction()
        window.submitAction();
        return;
    }

    /* If we land anywhere else, jump straight to the first template. */
    window.open(
        'https://portal.nap.gsic.titech.ac.jp/GetAccess/Login?Template=userpass_key&AUTHMETHOD=UserPassword',
        '_blank'
    );
})();

