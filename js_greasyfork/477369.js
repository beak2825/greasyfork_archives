// ==UserScript==
// @name        Прави учебниците безплатни
// @namespace   https://greasyfork.org
// @match       https://ebook.domino.bg/books/*
// @grant       GM_addStyle
// @version     1.5
// @author      RedTTG
// @description Сменя от демо сървъра, към пълната тетрадка. Видеята не работят, липсва функцията и трябва да разгадая дали може да се хакнат
// @run-at      document-start
// @grant       GM.xmlHttpRequest
// @connect     *
// @downloadURL https://update.greasyfork.org/scripts/477369/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%20%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%B8%D1%86%D0%B8%D1%82%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/477369/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%20%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%B8%D1%86%D0%B8%D1%82%D0%B5%20%D0%B1%D0%B5%D0%B7%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D0%B8.meta.js
// ==/UserScript==

const STYLE = `.tophead._demo {
  background-color: rgba(0, 66, 99, 0.5);
}
.tophead._demo div.txt {
  background-color: rgba(11, 222, 162, 0.4);
}`

const initialText = "(v1.5) Хакнато от RedTTG";

const regexIdentifier = /\/books\/([^\/]+\/[^\/]+)\//;

let hacked = false;
let added_styles = false;

function replaceDemo(script) {
    //return script.replaceAll("docs_demo", "docs");
    return script.replaceAll("docs_demo", `https://ugiu8fgifh2wduy1dhsuidhisudahgs8i.free.bg${window.location.pathname}`)

}

window.addEventListener('beforescriptexecute', function(e) {  // FIREFOX ONLY
    if (e.target.innerHTML.search("FlowPaperViewer") != -1) {
        e.target.innerHTML = replaceDemo(e.target.innerHTML);
        console.log("Switched from demo server to complete book! Enjoy ;)")
        hacked = true;
    } else if (e.target.innerHTML.search("ebookLoginPrompt") != -1) {
        e.target.innerHTML = e.target.innerHTML.replace("ebookLoginPrompt()", `console.log("Removed prompt to buy book!")`)
    }
})

function extractConfig(scriptText) {
    const match = scriptText.match(/FlowPaperViewer\(([\s\S]*?)\)/);

    if (match) {
        const configString = match[1];
        try {
            const configObject = eval('(' + replaceDemo(configString) + ')');
            return configObject;
        } catch (error) {
            console.error('Error parsing config config:', error);
            return null;
        }
    }

    return null;
}

function try_hack_1_2(demo_text) {  // CHROME // NON FIREFOX
    let buyOverlay = document.getElementById("simplemodal-overlay");
    let buyContainer = document.getElementById("simplemodal-container");

    demo_text.innerHTML = "Oпит за non Firefox..."

    buyOverlay.remove();
    buyContainer.remove();

    let flowpaper = FlowPaperViewer_InstancedocumentViewer;
    console.log(flowpaper);
    if (flowpaper.initialized){
      flowpaper.dispose();
    } else {
      let flowpaperLoader = document.querySelectorAll(".flowpaper_loader")[0];
      flowpaperLoader.remove();
    }

    const scripts = document.querySelectorAll('script');

    scripts.forEach((script) => {
        const scriptText = script.textContent || script.innerText;

        const config = extractConfig(scriptText);

        if (config) {
            $('#documentViewer').FlowPaperViewer(config);
            hacked = true;
            demo_text.innerHTML = initialText + " - non Firefox";
            finalize_hack();
            return;
        }
    });


    if (!hacked) {
        demo_text.innerHTML = initialText + " - грешка";
        finalize_hack();
    }
}

window.addEventListener("load", () => {
    let demo_text = document.getElementsByClassName("demo")[0];
    if (demo_text) {
        if (hacked) {
            demo_text.innerHTML = initialText + " - Firefox"
        } else {
            demo_text.innerHTML = "Грешка, опит за non Firefox след 2 секунди..."
            setTimeout(() => {
                try_hack_1_2(demo_text)
            }, 2000)
        }
        console.log("Leaving a positive text")
    } else {
        console.error("Couldn't find the negative demo text :(")
    }
    finalize_hack();
})

function finalize_hack() {
    var tocButtons = document.getElementsByClassName("flowpaper_toc_close");
    if (tocButtons.length > 0) {
        tocButtons[0].dispatchEvent(new Event('mousedown'));
        setTimeout(load_pages, 100);
    } else {
        setTimeout(finalize_hack, 100);
    }
    if (hacked && !added_styles) {
        GM_addStyle(STYLE);
        added_styles = true;
    }
  if (hacked) {
    let i = 2 / 0;
  }
}

function get_local_storage() {
  var url = window.location.href;
  var match = url.match(regexIdentifier);
  return `page-+-${match ? match[1] : "BLANK"}`;
}

function load_pages() {
  const pageN = localStorage.getItem(get_local_storage(), 1);
  let flowpaper = FlowPaperViewer_InstancedocumentViewer;

  $('body').click(function (event) {
    setTimeout(function () {
      localStorage.setItem(get_local_storage(), flowpaper.getCurrPage());
    }, 100);
  })

  if (pageN === null) {
    return null;
  }


  flowpaper.gotoPage(pageN);
}

(function() {
    // Store the original XMLHttpRequest open method
    const originalOpen = XMLHttpRequest.prototype.open;

    // Override XMLHttpRequest.open
    XMLHttpRequest.prototype.open = function(method, url) {
        console.log("Intercepting XHR:", method, url);

        // Store the request method and URL
        this._url = replaceDemo(url);
        this._method = method;

        // Prevent further execution of original XHR open
        return originalOpen.apply(this, arguments);
    };

    // Override send to use GM.xmlHttpRequest
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;

        // Use GM.xmlHttpRequest to bypass CORS restrictions
        GM.xmlHttpRequest({
            method: xhr._method,
            url: xhr._url,
            data: body,
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if needed
            },
            onload: function(response) {
                // Simulate successful response to the original XHR request
                Object.defineProperty(xhr, 'responseText', { value: response.responseText });
                Object.defineProperty(xhr, 'status', { value: response.status });
                Object.defineProperty(xhr, 'readyState', { value: 4 });

                // Trigger the original event listeners, pretending the XHR finished
                if (typeof xhr.onreadystatechange === 'function') {
                    xhr.onreadystatechange();
                }
            },
            onerror: function(error) {
                console.error("Request failed:", error);
            }
        });
    };
})();