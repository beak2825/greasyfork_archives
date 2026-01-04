// ==UserScript==
// @name         Red Wheelbarrow 2.0 Beta
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  This Script Enhances all of the Red Wheelbarrow Sites to make working through Puzzles much easier!
// @author       Eizak
// @match        https://www.red-wheelbarrow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39301/Red%20Wheelbarrow%2020%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/39301/Red%20Wheelbarrow%2020%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var Site=AdobeTracking.pageName.slice(18);
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    if(Site=="Cornelius")
    {
        var form=document.forms[0];
        form[1].value="Cicero";
        form[2].value="rashnessisthecharacteristicofyouthprudencethatofmellowedageanddiscretionthebetterpartofvalor";
        form.submit();
    }

    if(Site=="ProboscisMonkey")
    {
        var form=document.forms[0];
        form[1].value="admin";
        form[2].value="plasticforks".replace(/[a-zA-Z]/g, function (c) {return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + (new Date).getDate()) ? c : c - 26);});
        form.submit();
    }
    if(Site=="ProboscisMonkey : Network Map")
    {
        document.querySelector('#pm > div > div.network-map > a.cistern').href = "https://www.red-wheelbarrow.com/vincent/theWolf/Cistern";
        document.querySelector('#pm > div > div.network-map > a.harvey').href = "https://www.red-wheelbarrow.com/vincent/theWolf/Harvey";
    }
    if(Site=="ProboscisMonkey : Harvey")
    {
        document.querySelector('#pm > div > div.error > img').onclick = function(){window.location.href = "https://www.red-wheelbarrow.com/vincent/theRunningMan";};
        document.querySelector('#pm > div > div.error > img').style.cursor = "pointer";
        document.querySelector('#pm > div > div.header > h1 > img').onclick = function(){window.location.href = "https://www.red-wheelbarrow.com/vincent/theWolf/";};
        document.querySelector('#pm > div > div.header > h1 > img').style.cursor = "pointer";
    }
    if(Site=="ProboscisMonkey : Cistern")
    {
        document.querySelector('#pm > div > div.header > h1 > img').onclick = function(){window.location.href = "https://www.red-wheelbarrow.com/vincent/theWolf/";};
        document.querySelector('#pm > div > div.header > h1 > img').style.cursor = "pointer";
        var Tex = document.querySelector('#pm > div > div.error > h2');
        Tex.appendChild(document.createElement("br"));
        Tex.appendChild(document.createElement("br"));
        var node = document.createElement("a");
        var textnode = document.createTextNode("Click to Skip");
        node.appendChild(textnode);
        Tex.appendChild(node,Tex.childNodes[1]);
        var Skip = Tex.childNodes[5];
        Skip.style.textDecoration= "underline";
        Skip.style.cursor="pointer";
        Skip.onclick = function(){document.cookie="red_wheelbarrow_Q2wqPyvt6Sc5FtNNqxna=Q2wqPyvt6Sc5FtNNqxna";
                                  window.location.reload();};
    }
    if(Site=="ProboscisMonkey : Cistern Message")
    {
        document.cookie="red_wheelbarrow_Q2wqPyvt6Sc5FtNNqxna=;Max-Age=0";
    }
    if(Site=="Octo Proxy")
    {
        var form=document.forms[0];
        form[1].value="WKRP";
        form[2].value="HACKJAMTOR";
        form.submit();
    }
    if(Site=="Octo Proxy : Console")
    {
        var form=document.forms[0];
        form[0].value="mirror";
    }
    if(Site==("DHCP/RTR"))
    {
        var form=document.forms[0];
        form[1].value="joemoncoblondie";
        form[2].value="hellfollowedwithhim";
        form.submit();
    }
    if(Site==("Admin"))
    {
        var form=document.forms[0];
        form[1].value="admin";
        form[2].value="reindeerflotilla";
        form.submit();
    }
    if(Site=="Home" || Site=="News" || Site=="About" || Site.startsWith("Catering") || Site=="Kid Wheelbarrow")
    {
        var Tabs = document.querySelector('body > div.header > nav > ul');
        var Add = ["Clock","Vincent"];
        var AddLinks = ["https://www.red-wheelbarrow.com/j8la7m3uxkdi/clock/","https://www.red-wheelbarrow.com/vincent/"];
        var tabList= document.querySelector('body > div.header > nav > ul').getElementsByTagName('li');
        for(var i=0;i<(Add.length);i++){
            if(Site=="News"){
                Tabs.appendChild(document.querySelector('body > div.header > nav > ul > li:nth-child(1)').cloneNode(true));
            }else{
                Tabs.appendChild(document.querySelector('body > div.header > nav > ul > li:nth-child(2)').cloneNode(true));
            }
            tabList[tabList.length-1].childNodes[0].textContent = Add[i];
            tabList[tabList.length-1].childNodes[0].href = AddLinks[i];
        };
        var tabList= document.querySelector('body > div.header > nav > ul').getElementsByTagName('li');
        for(var i=0;i<tabList.length;i++){
            tabList[i].style.margin="0em 1em 0em 1em";
        }
        if(document.getElementsByClassName('admin-bar').length<1)
        {
            document.cookie="red_wheelbarrow_clock=89a99f15953fd291778e445b25c51a3c;path=/;domain=www.red-wheelbarrow.com;";
        }else{
            document.querySelector('body > div.header > div.admin-bar > div > div').childNodes[0].textContent = "HELLO, ADMIN (and welcome to Red Wheelbarrow 2.0 by Eizak)";
            document.querySelector('body > div.header > div.admin-bar > div > div').style.textTransform = "none";
        }
    }
    else{
        if(document.getElementsByClassName('admin-bar').length<1)
        {

            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('script');

            script.onload = function() {
                $('head').append('<link rel="stylesheet" href="/css/admin.css">');
                addGlobalStyle('.admin-bar>a:before{background:url(https://www.red-wheelbarrow.com/admin/images/user.png) no-repeat !important;background-size:cover;content:"";display:none !important;height:2em;margin:0 .8em 0 0;vertical-align:top;width:2em}');
                $('body').prepend('<div class="admin-bar"><a>Directory</a><div><div class="admin-bar__login-info">Hello, admin</div><a href="/admin/logout.php">Log out</a></div></div>');
                document.querySelector('body > div.admin-bar > div > a').textContent = "Go to Homepage";
                document.querySelector('body > div.admin-bar > div > a').href = "https://www.red-wheelbarrow.com";
                var AdBar = document.querySelector('body > div.admin-bar');
                var node = document.createElement("a");
                node.href = "https://www.red-wheelbarrow.com/admin";
                AdBar.childNodes[0].insertBefore(node.cloneNode(true),AdBar.childNodes[0].childNodes[0]);
                addGlobalStyle('.admin-bar>a>a:nth-child(1){background:url(https://www.red-wheelbarrow.com/admin/images/map.png) no-repeat;background-size:cover;content:"";display:inline-block;height:2em;margin:0 .8em 0 0;vertical-align:top;width:2em}');
                node.style.background="url(https://www.red-wheelbarrow.com/admin/images/map-full.png)";
                node.style.margin="0px 2em";
                var IcoBackX = [1576,1397,1169,518];
                var IcoHref = ["theWolf","theRunningMan","bradPitt","preacher"];
                var IcoText = ["IDS","Proxy","Honeypot","DHCP/RTR"];
                AdBar.childNodes[0].style.display = "flex";
                AdBar.childNodes[0].style.alignItems = "center";
                for(var i=0;i<4;i++){
                    node.style.backgroundPositionX= IcoBackX[i] +"px";
                    node.style.backgroundPositionY= "605px";
                    node.style.height="110px";
                    node.style.width="110px";
                    node.style.zoom="41%";
                    node.href = ("https://www.red-wheelbarrow.com/vincent/" + IcoHref[i]);
                    AdBar.childNodes[0].appendChild(node.cloneNode(true));
                    //document.querySelector('body > div.admin-bar > a').append(document.querySelector('body > div.admin-bar > a').childNodes[0].cloneNode(true));
                    var MapNode = document.querySelector('body > div.admin-bar > a').childNodes[1].cloneNode(true);
                    AdBar.childNodes[0].appendChild(MapNode);
                    AdBar.childNodes[0].childNodes[(((i+1)*2)+1)].textContent = IcoText[i];
                    //AdBar.childNodes[0].childNodes[((i+1)*2)].href = ("https://www.red-wheelbarrow.com/vincent/" + IcoHref[i]);

                }

                if(Site=="Cornelius : Firewall Rules"){

                    $('#toggle').trigger('click');
                    if(document.getElementsByClassName('footer')[0].childNodes[3].childNodes[2].data==" is available. ")
                    {
                        document.querySelector('body').insertBefore(document.querySelector('#cornelius > div.footer').cloneNode(true),document.querySelector('body > div.admin-bar').nextSibling);
                    document.querySelector('body > div.footer > span:nth-child(2) > a.update-link').onclick = function() {document.querySelector('#cornelius > div.footer > span:nth-child(2) > a.update-link').click();};
                    }else
                    {
                        var Ver = document.querySelector('#cornelius > div.footer > span:nth-child(2)');
                        var node = document.createElement("a");
                        var textnode = document.createTextNode("Press to Downgrade | ");
                        node.appendChild(textnode);
                        Ver.insertBefore(node,Ver.childNodes[1]);
                        Ver.childNodes[1].onclick = function(){document.cookie="version_token=;Max-Age=0";window.location='https://www.red-wheelbarrow.com/vincent/firewall_rules.php';};
                        document.querySelector('body').insertBefore(document.querySelector('#cornelius > div.footer').cloneNode(true),document.querySelector('body > div.admin-bar').nextSibling);
                        document.querySelector('body > div.footer > span:nth-child(2) > a:nth-child(1)').onclick = function(){document.cookie="version_token=;Max-Age=0";window.location='https://www.red-wheelbarrow.com/vincent/firewall_rules.php';};
                    }
                }
                //^^ jQuery is available script
            };

            script.type = 'text/javascript';
            script.src = 'https://code.jquery.com/jquery-3.2.1.min.js';

            head.appendChild(script);

        }
    }
})();
