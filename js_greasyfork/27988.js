// ==UserScript==
// @name         HTTPTunnelGEProxyClicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://httptunnel.ge/ProxyChecker.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27988/HTTPTunnelGEProxyClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/27988/HTTPTunnelGEProxyClicker.meta.js
// ==/UserScript==

function createScript(src){
    var _script = document.createElement('script');
    _script.src = src;
    _script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(_script);

}

var ihandler = null;
var url = "https://docs.google.com/forms/d/e/1FAIpQLScxyHDbknnhS5GmvBkZnTf0Sd0EJSgeppZHrkfA6vIh-oMqOw/formResponse";

(function() {
    createScript("https://rawgit.com/rwaldron/8720084/raw/699692986f1aedc64614c746bf2eec5997b1cdfe/jquery.js");
    var btn_chk = document.getElementById('ctl00_ContentPlaceHolder1_bCheckProxy');
    var query = window.location.search.substring(1);
    var pp = query.split("&");
    var o = {};
    for(var each in pp){
        if(pp.hasOwnProperty(each)){
            var p = pp[each].split("=");
            o[p[0]] = p[1];
        }
    }
    if(o.p){
        btn_chk.click();
    }
    ihandler = setInterval(function(){
        var result = document.getElementById('ctl00_ContentPlaceHolder1_lResult');
        if(result.textContent !== ''){
            clearInterval(ihandler);
            var data = {};
            $("#ctl00_ContentPlaceHolder1_lResult").find("table tr").each(function(){
                var x = $.trim($(this).find("td:eq(0)").text().replace(":", ""));
                var y = $(this).find("td:eq(1)").text();
                data[x] = y;
            });
            
            data.SPEED = data.SPEED.split(" ")[0];
            var arr = {
                "entry.1119411157":$("#ctl00_ContentPlaceHolder1_lResult > center > span").text(), // PROXY:PORT
                "entry.162078414": data.ALIVE, // ALIVE
                "entry.1549063818": data.GET, // GET
                "entry.1774331775":data.POST, // POST
                "entry.1150283492": data.CONNECT, // CONNECT
                "entry.102728116": data.STREAMING, // STREAMING
                "entry.781385759": data.PROXY, // PROXY
                "entry.1446048049": data.DATING, // DATING
                "entry.1345596824": data.TRANSPARENCY, // TRANSPARENCY
                "entry.1311846256": data.SPEED, // SPEED
            };

            $.post(url, arr).error(function(x, y, z){
                console.log(x,y,z);
                var ww = window.open(window.location, '_blank');
                window.close();
            });



        }

    }, 300);
    // Your code here...
})();