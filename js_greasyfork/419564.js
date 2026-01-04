// ==UserScript==
// @name         SIS001 TXTDOWN
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  SIS001 小说下载
// @author       brackrock12
// @match        http://38.103.161.134/forum/viewthread.php?tid=*
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/419564/SIS001%20TXTDOWN.user.js
// @updateURL https://update.greasyfork.org/scripts/419564/SIS001%20TXTDOWN.meta.js
// ==/UserScript==

(function () {
    'use strict';




    function down() {
        const h1 = document.querySelector('.mainbox > h1:nth-child(2)')
        console.log(h1)
        let ce = document.createElement('a');
        ce.id = 'CDownBtn';
        ce.textContent = '单章下载';
        ce.style.color = 'blue';
        ce.style.textDecoration = "underline";
        // ce.href='javascript:void(0)'
        ce.onclick = function () { downtext(document); };
        h1.append(ce);


        function removeElement(doc, ele) {
            var elelist = doc.querySelectorAll(ele);
            for (const e of elelist) {
                e.remove()
            }
        }

        function downtext() {
            const con = document.querySelector('div.t_msgfont:nth-child(1)')
            console.log(con)
            removeElement(con, 'strong')
            removeElement(con, 'table')
            removeElement(con, 'strong')


            let btitle = h1.innerText.replace('[同人衍生]', '').replace('单章下载', '')
            let str = con.innerText
            let blob = new Blob([btitle + '\r\n', str], { type: "text/plain;charset=utf-8" });
            saveAs(blob, btitle + ".txt");
            ce.style.color = 'red';
        }



        setTimeout(downtext, 600);

    }


    down()


})();