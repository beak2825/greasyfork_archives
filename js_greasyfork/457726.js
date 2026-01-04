// ==UserScript==
// @name         Hash Scanner
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  YARA scan file from VT
// @author       SRI
// @match        https://www.virustotal.com/*
// @connect      virustotal.com
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-end
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADwElEQVR4nO2dwU4UQRCGfy+6RiRixAMYn8H4AipvQHwAhYdQA5ooHBgfRiBijHdPagRv6FV3MdED4HLVMm2ahBimd2e6uqu7p/6krj3V/zddPbs72wWoVCqVSqXKQpcBLALYBPAZwBEA8owBgArA2YjzMNd6DmCPIf8j68UGgAUAUyESPg9gGcAhQ8J1USGeqoDzOACwZD1j0QyA9wETJhvfEU8cd/6o2AFw3TfRawD6EZIlW4piaRBpTt8AzLZN0iyhj5ESJQBrKKME/R8fAPTaJLkc8c6vBDbhKuJKeNTmace14ZqnoFsALoTxJysZD24DeDliY270dLToGOxhuLlkryWHb/ebDLTpuPNVbm3VeLeOBvpSM4gpOyq37tR4Zz6sja1hzSATTQbpqC7WeGc8HVt1dUwVyT8F4CcFICwFICwFIKykAUwDWAWwzfR7QooPB8kCuAvgF5PpNEZe5yCjJAEY8/8EMJ8c13wtBCE5AFcD3fk0Ii8SgpAcgNWA5tMY84gNITkAn4QBUGQIyQEYJgCAALxp++tU7gAoEQAUCYICGGFEaAgKwIqEICgAKxKC4A3gtLcF+oXsARQBgrd/FfN7OykDoAAQvP07+d4Mx3s7qQMgZgjc/nkrBwAU8XNCcQAmaq77tsVYUl/gZQ3ghvQEuw7gifQEuw7gB4BJ6Ul2GQABeAHgjPREuwyALARdCYIACMBPuyfc1NfnZQAQYxQjaSNJAcibSboC5A0lLUF5RTGSNpIUgLyZpCtA3lDSEpRXFCNpI0kByJtJugLkDSUtQXlFMZI2khSAvJmkK0DeUNISlFcUI2kjKTcAJ8/VzOHVREoMgLd/FfO5nl0DUPn6t8d8rmfXAOz5+sedUNcAkO94CgAKgHQFaAkqpgSFPCeCAoU5uLYYADsJGEoNw5ybXQyAlQQMpYbxtCQA04GbPxBzmLOer5QEIPSBTcQYvwHMe841SQDHEA4Tv/PnGeaZLIDjcrRiN7lhAqYPbS7PPMtONgC6IFIAslIAwlIAwlIAuQPQBg7tNcnx3VJdCxPTLUjl1hxHC5ONmkFMqyaVW68cfyIfWwuOOmZaNalO12OHb/fQsJHbgWOwLdstSJv64J8Hc44738Q+gEtgbErGGYPM+wmPEw/aJNmzjSgpUlQos5nnO59j0GZtS9ZYKyGWYjXx/Gr7MXtpxlIMnWwfZQHY5mjofKyebcnq2ph9Yw1llKB9W/ODHPw3ZbuCms8Ju0zf5w8y7yc8tF6s20fNxk87KpVKpVKpEF9/AQHZrawJAd7EAAAAAElFTkSuQmCC
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457726/Hash%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/457726/Hash%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function menuItemClicked(){
        let url = window.location.href;
        if (url.includes("file")) {
            url = url.split('/');
            let file = url.indexOf("file");
            let sha256 = url[file + 1];
            GM.openInTab("https://mvtotal01.internet.np/fastapi/valhalla/" + sha256);
        }
    }

    GM_registerMenuCommand("Scan file", menuItemClicked);

})();