// ==UserScript==
// @name         Travian VillageLinks
// @namespace    http://tampermonkey.net/
// @license MIT
// @author       bbbkada@gmail.com
// @version      1.1
// @description  Direct links to own villages for sending troops and resources!
// @include        https://*.travian.*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509412/Travian%20VillageLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/509412/Travian%20VillageLinks.meta.js
// ==/UserScript==


var loadServerTime = 0;

var acss = "#side_info .listing ul li:hover a {background-color:white;}";

GM_addStyle(acss);

(function() {


    // position_details.php?x=-111&y=120
    var RunTime = [Date.now()];

    var Images = {
	//VillaLink : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAChElEQVQ4y6WTu2sUYRTFf9/M7MvsbhLdkOdG2IAoRlAQFcVG0UZUtLMSbGz9BxQECdY2KrZamE5QETWaIj5RCwsVXdC4McHJ7sZk9jHzzfewSMQHCIIHLvdRHC7ncIS1lv+Bw3/CO33l2cP0qtyWahB3NELlGAsGizYWYy3aWoxZ3lfKInQctxarlXflstfT3Vk8eXhdPoqtSKfc39jFn7NY7u1Iue1IDxw7H4WOv6RKUhlx7eEclaqkGVmma4ZK3TDzzTC3aPADS7VpiTXM1CQXbs6x0IycXE9xxGlGWqQSDoP9ee6+9PnWiOnNCxIuJF1B0hMkPejKCGpLkvGpr3StzrOmKwUgnFaoACj1ZRnqzXPnhc9CEFPIOiQ9SLrQmRbUA8n4lE9hTZ7SYBaxYp7TDPWymi6UBrL0dK/i+mSFeiDpTAtyaUEtkJy/fYB3C4coDWTJeL/Y2GwvfyAEqFiR9gzDg13ceu4zUw2ZqYbceOoTW8VQYQMXJ0ZJej+V9VqRxgJSKr7WA4q9OZLJBJcfHOHNfY00CqkVA90jbOjbThA2OXtjLVdPlMEKvFakrDZW+LWAYk+OTDoBFpSR7Nt4HG0N2mgMltnFCpuGdtGQbQ5eLNDn3LNes/7lUyTV2vVDGZHNOEI4GgcIlURbw3TtA7FRKBMT65ilKGBzcTeNuMXzj7vxZGN+eu+pO92pXEeHl3KF57k4rqC/GHpKK3rzwyij0dYwt/iZ1dk+XlUe8axcjhNvzz0RfwvT0UslHUqJNJJQSUYKG50dpf28+PyYifd3X0vFttkxG4l/TePoOWd+6/CewuT7iZfSsHN2zEqAfyYonRHz2riFttEJf8yqH/fvachWhEc1GPkAAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII='
    VillaLink : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI/SURBVDhP3ZHPS1RRFMe/9743M29snqM442/H/LGxUciNCWkLpQiiyE2LyoT+gdobYhRhES1qIbWLWkQ7s6IkNYpCQwoKhrKRUMOB0RmzcfTNnXvf7b7xtfAvCPrA4fzgfM893IN/Drl0b0Yziky6lsnLTYsLW0KzIeEEtpRSSOVVoHLHCvXxoS7piKN9twhxAosJYng1mc1JkmWSaAQy4CN07Tcjj94mtdJSk1eVB0hHLUeZafDMVl7bzgl6emTcps4Axm1cfxwn6QxrDhpEMw2ipzKMjDw/lvu6fiLdWB1o8+vYq1qLT96cIbefJrCuXguE61AY4PNQRGpKPM8+JBM/16wKZebYTLIsLzmtDbUUjU62fvLqMFWrHwR08FRElJX4bJXb+s4ATcYSInh3qi8ZeyXAbA4mOKpLm9BSeQAZK4vLY/XTD8/H+yHJhJKIUMBwBoCeuTZLcnlB/DoR3GboiZ7F4dZzONo2gNbag1jZWEab8g3haPD4aOgJpChs/Rea3eaOJw1hmrY4g5A2FlPf8SM1j4XVGH5tp7CYXsD+um40V7Qjlu1eKShd6FZOqKOB9gy98VjcAlerVxRHUFlcj6pgIzyaH2GzBh+X32E2Hl/Xv1wtd7UFSNeFKfLyxiG6x6eLvtEGYTGm/oDB2aYpFKWdjUcwt/Qek98mPns20BG/g5yr3aG9/4E6n6W56S6iV8jqwP1eWT+IuX3D8LrlXVC2uYreiy/cdDdbTGJ6/jUWPeiMDYO55f8L4A/d/AEgARBYJQAAAABJRU5ErkJggg=='
    };
    window._test = "Ohoy";

    function runMain() {

        var villageBox = Doc.Element('sidebarBoxVillageList');
        //var villaLinks = villageBox.getElementsByClassName("name");
        var villaLinks = villageBox.getElementsByClassName("dropContainer");

        console.log(villaLinks.length);
        for (var i = 0 ; i < villaLinks.length ; i++){
/*             var span = document.createElement("span");
             span.innerHTML = "1:17:12";
            // span.setAttribute("style", "width:10px;");
            span.setAttribute("class", "timer");
            span.setAttribute("counting", "up");
            span.setAttribute("value", "1554509813"); */
            //console.log(villaLinks[i].getElementsByClassName("coordinateX").lenght);
            //debugger;
            var villaX = villaLinks[i].getElementsByClassName("coordinateX")[0].innerText.replace("(","").replace(/\u2212/, "-").toString();
            var villaY = villaLinks[i].getElementsByClassName("coordinateY")[0].innerText.replace(")","").replace(/\u2212/, "-").toString();
            if (villaX.length > 0 && villaY.length > 0) {
                var villaCoords = villaX+"|"+villaY;
                var rect = villaLinks[i].getBoundingClientRect();
                console.log(rect.top, rect.right, rect.bottom, rect.left-20);
                console.log(villaX, villaY);
                var villaImg = Doc.New("img",[['src',Images.VillaLink],['width','14px'],['height','14px'],["id",villaCoords]]);
                var cntDiv = document.createElement('div');
                cntDiv.setAttribute("style", "position:absolute;left:-13px;top:3px;width:14px;height:14px;z-index:99;");
                cntDiv.appendChild(villaImg);
                villaLinks[i].appendChild(cntDiv);
                // villageBox.appendChild(span);
                //villaLinks[i].parentNode.parentNode.insertBefore(villaImg, villaLinks[i].parentNode.parentNode.getElementsByTagName("A")[0]);
                villaImg.addEventListener("click",function(){openVilla(this.id)},false);
                //villaImg.addEventListener("click",function(){document.location.href = 'position_details.php?x=-111&y=120';},false);

                // 313 1571.5 329 1421.5
                // 334 1571.5 350 1421.5
            }
        }
        console.log(user_id);

    };


function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
    // example of splitting url:  var newURL  = window.location.protocol + "//" + window.location.host + oldUrlPath + window.location.search + window.location.hash;
}
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

    function openVilla(villaCoords){
        var coords = unescape(villaCoords.split("|"));
        var x = villaCoords.substr(0,villaCoords.indexOf("|"))
        var y = villaCoords.substr(villaCoords.indexOf("|")+1,villaCoords.length)
        //alert(villaCoords);
        
        if (coords.length > 1) {
            var link = location.origin + "/position_details.php?x="+ x.toString() +"&y=" + y.toString();
            //r link = location.origin + "/position_details.php?x=40&y=-84";
            //console.log(link);
            //alert("?x=" + x + "&y=" + y)
            //document.location.href = link;
            link = link.replace(/[^\x00-\x7F]/g, "") // tar bort allt utom ASCII 0-127
            //alert(link);
            window.location.href = encodeURI(link);
        }
    }

    var Doc = {
        New : function(tt,attrs){
            var newElement = document.createElement(tt);
            if (attrs !== undefined) {
                for(var xi = 0; xi < attrs.length; xi++) {
                    newElement.setAttribute(attrs[xi][0], attrs[xi][1]);
                }
            }
            return newElement;
        },

        Element : function(eid){
            return document.getElementById(eid);
        }
    }

    var crtPage = window.location.href;

    function checkCrop(){
        var cCount = document.getElementById('lbar4');
        if (cCount) alert(cCount.style.width);
    }

    function getUserId(){
        var navi = document.getElementById("sidebarBoxActiveVillage");
        var navi_p = navi.getElementsByClassName("playerName")[0];
        // var profile_link = navi_p.getElementsByTagName("a")[1].innerText;
        // alert(profile_link);
        return navi_p.innerText;
    };

     // window.setTimeout( function(){ window.location = "build.php?tt=99&id=39"; }, 600000 );
    // window.setTimeout( function(){ window.location = "dorf1.php?newdid=42290&"; }, 5060000 );
    //window.setTimeout( function(){ checkCrop(); }, 600000 );

    var user_id = getUserId();
    var userHost = window.location.hostname.split(".")[0]+"_"+user_id;
    // alert(userHost);

    runMain();
})();


