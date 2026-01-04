// ==UserScript==
// @name         aahMyEyes
// @namespace    https://www.ohshiftlabs.com
// @version      0.1
// @description  Page Color Invertor, good for reading light background pages at night.
// @author       Koray K.
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409980/aahMyEyes.user.js
// @updateURL https://update.greasyfork.org/scripts/409980/aahMyEyes.meta.js
// ==/UserScript==

(function() {

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }


    var aahMyEyes = getCookie("aahMyEyes");

    function saveMyEyes(){

        var style = document.createElement('style');
        style.id="aahMyEyes";

        style.innerHTML =
            'html {' +
            '    filter: invert(1);' +
            '}' +
            'video, img {' +
            '    filter: invert(1);' +
            '}';
        var ref = document.querySelector('script');
        ref.parentNode.insertBefore(style, ref);

        setCookie("aahMyEyes",true);

    }

    function eyesToggle(){
        if(!getCookie("aahMyEyes")){
            saveMyEyes();
        }else{
            setCookie("aahMyEyes",false)
            document.getElementById('aahMyEyes').remove()
        }
    }

    if(aahMyEyes){
        saveMyEyes();
    }

    var toggle = document.createElement('a')
    toggle.style = 'width:25px;height:25px;background:transparent;position:fixed;bottom:15px;right:15px;z-index:99;border-radius: 50%; box-shadow:rgb(0 4 216) 6px 4px 0px 0px';
    toggle.addEventListener('click',eyesToggle);
    toggle.title="Aah My Eyes!"
    document.body.append(toggle);
})();