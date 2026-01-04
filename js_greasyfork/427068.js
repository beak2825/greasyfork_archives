// ==UserScript==
// @name         Google Colab Stay Alive
// @namespace    https://gist.github.com/mcakici/e418862ca6b448bb04f8aacf680478c0
// @version      1.1.1
// @description  Keeps alive Colab session (Adds a button for activation.) / Colab oturumunu aktif tutar.
// @include      /^https?:\/\/colab\.research\.google\.com\/.*$/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427068/Google%20Colab%20Stay%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/427068/Google%20Colab%20Stay%20Alive.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var isEnabled = false;
        var colabKeepAlive = null;
        //Keep Page Active
        Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: true});
        Object.defineProperty(document, 'hidden', {value: false, writable: true});
        document.dispatchEvent(new Event("visibilitychange"));

        //Define MutationObserver to automatically reconnect
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        var observer = new MutationObserver(function(mutations) {
            setTimeout(function () {
                if(isEnabled === true && document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect") !== null){
                    console.log('> Colab Stay Alive Detected DOM changes.');
                    var ok = document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect");
                    var okTXT = ok.textContent
                    if(okTXT.indexOf("Reconnect") !== -1 || okTXT.indexOf("RECONNECT") !== -1 || okTXT.indexOf("Connect") !== -1 || okTXT.indexOf("connect") !== -1 || okTXT.indexOf("CONNECT") !== -1 || okTXT.indexOf("Yeniden bağlan") !== -1 || okTXT.indexOf("Bağlan") !== -1 || okTXT.indexOf("Yeniden Bağlan") !== -1) {
                        console.log('> Colab Stay Alive Reconnecting...');
                        ok.click();
                        console.log('> Colab Stay Alive Connected.');
                    }

                    if(typeof document.getElementsByTagName('colab-recaptcha-dialog')[0] !== 'undefined'){
                        document.getElementsByTagName('iron-overlay-backdrop')[0].click();
                    }

                    if(typeof document.getElementsByTagName('colab-dialog')[0] !== 'undefined' && typeof document.getElementsByTagName('colab-dialog')[0].textContent !== 'undefined'){
                        var dialogTXT = document.getElementsByTagName('colab-dialog')[0].textContent;
                        if(dialogTXT.indexOf("Çalışma zamanının bağlantısı kesildi") !== -1 || dialogTXT.indexOf("runtime has timed out") !== -1){
                            document.getElementsByTagName('iron-overlay-backdrop')[0].click();
                        }
                    }
                }
            }, 3000);
        });
        observer.observe(document.body, {childList: true});

        function Colab_KeepAlive(){
            if(document.querySelector("#check_KeepAliveColab").checked && colabKeepAlive == null){
                colabKeepAlive = setInterval(function(){
                    if(document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.getElementById('connect') !== null){
                        document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.getElementById('connect').click();
                        console.log("> Colab Stay Alive Connect Button Clicked Successfully.");
                    }
                }, 60000);
                isEnabled = true;
                console.log("> Colab Stay Alive Activated.");
            }else{
                clearInterval(colabKeepAlive);
                colabKeepAlive = null;
                isEnabled = false;
                console.log("> Colab Stay Alive Disabled.");
            }
            document.getElementById('check_KeepAliveColab').blur();
        }

        console.log("> Colab Keep Alive Started.");
        var mydiv = document.createElement('div');
        mydiv.style = 'position:fixed;top:0;left:47%;background:rgba(0,0,0,0.65);color:#000;z-index:999;padding:8px 10px;';
        mydiv.innerHTML = '<paper-checkbox id="check_KeepAliveColab" role="checkbox"><span style="color:#fff">Keep-alive</span></paper-checkbox>';
        document.getElementsByTagName('body')[0].appendChild(mydiv);
        document.getElementById("check_KeepAliveColab").addEventListener("click", Colab_KeepAlive);
    });
})();