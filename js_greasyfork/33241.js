// ==UserScript==
// @name         New Userscript
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.neobux.com/c/rs*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @noframes
// @namespace https://greasyfork.org/users/152867
// @downloadURL https://update.greasyfork.org/scripts/33241/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/33241/New%20Userscript.meta.js
// ==/UserScript==

function callAjaxRow(data)
{
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://script.google.com/macros/s/AKfycbwLPvfMZss9_SyeRXBzg-Qnvmw5-MuLvAvq6qVH7VcnnVZniKkE/exec?testo="+data[data.length - 1],
        onload: function(response) {
            var res;
            try{
                res = JSON.parse(response.response);
            }catch(e){}

            if (!res || res.result != "success") alert(response.response);

        },
        onerror: function(response) {
            alert(response);
        }
    });
}

(function() {
    var funz = $("script").last().text().split(';')[2].match(/w\((.*)\)?$/g)[0];
    var funzcorr = funz.substr(0,funz.length-1);
    var funzdef = eval(funzcorr);
    var arrpar = eval("var "+ funzdef.toString().match(/data:(.*)/g)[0].replace(/\:/,'=')); 
    //alert(data[data.length - 1]);
    /*var win = window.open("https://script.google.com/macros/s/AKfycbwLPvfMZss9_SyeRXBzg-Qnvmw5-MuLvAvq6qVH7VcnnVZniKkE/exec?testo="+data[data.length - 1],'_blank','toolbar=0,location=0,menubar=0');

    win.moveTo(20000, 20000);

    win.setTimeout(function(){
        win.close();
    },5000);*/
    callAjaxRow(data);

    setTimeout((function () {
        window.location.reload();
    }), 15000);

})();

