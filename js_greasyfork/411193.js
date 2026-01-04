// ==UserScript==
// @name         Auto select mail.ustc.edu.cn
// @namespace    xuzikuan12@qq.com
// @version      0.1.1
// @description  Auto select mail.ustc.edu.cn for students.
// @author       xuzikuan12
// @match        http://mail.ustc.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411193/Auto%20select%20mailustceducn.user.js
// @updateURL https://update.greasyfork.org/scripts/411193/Auto%20select%20mailustceducn.meta.js
// ==/UserScript==

(function() {
    document.getElementById('domainVal').innerText = "mail.ustc.edu.cn";
    document.getElementById('domain').value = "mail.ustc.edu.cn";
})();