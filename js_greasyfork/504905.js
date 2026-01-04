// ==UserScript==
// @name        Scripthub
// @description Basically a userscript manager but smaller and also it only shows scripts made by me.
// @namespace   https://userscripts.org
// @include     *
// @version     1.1.4
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/504905/Scripthub.user.js
// @updateURL https://update.greasyfork.org/scripts/504905/Scripthub.meta.js
// ==/UserScript==

function showmessagefromscripthub(msg) {
    const message = document.createElement("div");
    message.textContent = msg;
    message.style.position = "fixed";
    message.style.top = "0";
    message.style.right = "0";
    message.style.zIndex = "9999";
    message.style.backgroundColor = "#333";
    message.style.color = "#fff";
    message.style.padding = "10px";
    message.style.opacity = "0";
    message.style.transition = "opacity 0.5s";
    message.style.pointerEvents = "none";
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = "0.7";
    }, 1000);
    setTimeout(() => {
        message.style.opacity = "0";
    }, 4000);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 4600);
}

try {
    if (window.location.hostname === 'userscripts.org') {
        var scr = "https://pooiod7.neocities.org/projects/scripthub/pages" + (window.location.pathname=="/"?"/home":window.location.pathname) + ".js";

        var script = document.createElement('script');
        script.src = scr;
        document.body.append(script);
    } else {
        (function() { var isblocked =
            window.location.href.includes("replit.dev") ||
            window.location.href.includes("replit.co") ||
            window.location.href.includes("unpkg.com") ||
            window.location.origin == "flashloader.pages.dev" || window.location.origin == "https://flashloader.pages.dev" ||
            window.location.href.includes("accounts.google.com") ||
            window.location.href.includes("api.") || window.location.href.includes("auth");

                     const urlParams = new URLSearchParams(window.location.search);
                     const userscripts = urlParams.get('userscripts');
                     const cookieName = 'scripthub_scripts';
                     const getCookie = (name) => document.cookie.split('; ').find(row => row.startsWith(name + '='));
                     const setCookie = (name, value, hours) => {
                         const date = new Date();
                         date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
                         document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
                     };
                     const clearCookie = (name) => {
                         document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
                     };

                     var num = getCookie("unabletoloadinguserscripts") || "unabletoloadinguserscripts=0";
                     num = num.replace(/\D+/g, '');

                     if (!getCookie("unabletoloadinguserscripts") || num <= 2 || userscripts) {
                         num = parseInt(num, 10) + 1;
                         setCookie("unabletoloadinguserscripts", num);
                         if (!getCookie("unabletoloadinguserscripts") || getCookie("unabletoloadinguserscripts").replace(/\D+/g, '') == "") {
                             showmessagefromscripthub("Unable to load userscripts - website does not support cookies");
                             document.addEventListener('keydown', function(event) {
                                 if (event.ctrlKey && event.key === 'r') {
                                     event.preventDefault();
                                     clearCookie("unabletoloadinguserscripts");
                                     window.location.reload();
                                 }
                             });
                             return;
                         }
                     } else {
                         showmessagefromscripthub("Unable to load userscripts - website does not support url querys");
                         document.addEventListener('keydown', function(event) {
                             if (event.ctrlKey && event.key === 'r') {
                                 event.preventDefault();
                                 clearCookie("unabletoloadinguserscripts");
                                 window.location.reload();
                             }
                         });
                         return;
                     }

                     if (new URLSearchParams(window.location.search).get('noscripts')) {
                         clearCookie("unabletoloadinguserscripts");
                         document.addEventListener('keydown', function(event) {
                             if (event.ctrlKey && event.key === 'q') {
                                 event.preventDefault();
                                 const url = new URL(window.location);
                                 url.searchParams.delete('noscripts');
                                 window.location.href = url;
                             }
                         });
                         clearCookie(cookieName);
                         return;
                     } else if (new URLSearchParams(window.location.search).get('forcescripts')) {
                         isblocked = false;
                         // document.addEventListener('keydown', function(event) {
                         // if (event.ctrlKey && event.key === 'q') {
                         // event.preventDefault();
                         clearCookie("unabletoloadinguserscripts");
                         const url = new URL(window.location);
                         url.searchParams.delete('forcescripts');
                         window.location.href = url;
                         // }
                         // });
                         clearCookie(cookieName);
                         return;
                     }

                     if (window.location.href.toLowerCase().includes("recaptcha")) {
                         const message = document.createElement("div");
                         clearCookie("unabletoloadinguserscripts");
                         message.textContent = "//Scripthub does not work with reCAPTCHA";
                         document.body.appendChild(message);
                         console.log("Scripthub disabled for reCAPTCHA embed");
                         return;
                     }

                     const cookieValue = getCookie(cookieName);

                     if (cookieValue) {
                         clearCookie("unabletoloadinguserscripts");
                         const scriptUrls = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
                         scriptUrls.forEach(url => {
                             const script = document.createElement('script');
                             script.src = url;
                             document.body.appendChild(script);
                         });
                     }

                     document.addEventListener('keydown', function(event) {
                        if (event.ctrlKey && event.altKey && event.key === 'e') {
                          window.open('https://userscripts.org/manager', '_blank', 'width=800,height=600,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 400));
                          event.preventDefault();
                        }
                         if (event.ctrlKey && event.key === 'r') {
                             event.preventDefault();
                             clearCookie(cookieName);
                             window.location.reload();
                             // window.location.replace(`https://userscripts.org/?tosite=${encodeURIComponent(window.location.href)}`);
                         } else if (event.ctrlKey && event.altKey && event.key === 'q') {
                            window.open('https://userscripts.org', '_blank', 'width=800,height=600,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 400));
                            event.preventDefault();
                         } else if (event.ctrlKey && event.key === 'q') {
                             event.preventDefault();
                             let ctrlQPressed = false;
                             if (ctrlQPressed) {
                                 window.location.href = 'https://userscripts.org/';
                             } else {
                                 ctrlQPressed = true;
                                 setTimeout(() => {
                                     const url = new URL(window.location);
                                     url.searchParams.set('noscripts', 'true');
                                     window.location.href = url;
                                 }, 300);
                             }
                         }
                     });

                     if (!cookieValue && userscripts) {
                         try {
                             clearCookie("unabletoloadinguserscripts");
                             const scriptUrls = JSON.parse(userscripts);
                             scriptUrls.forEach(url => {
                                 var scriptloaderscripttmp = document.createElement('script');
                                 scriptloaderscripttmp.src = url;
                                 document.body.appendChild(scriptloaderscripttmp);
                             });
                             setCookie(cookieName, encodeURIComponent(userscripts), 1);

                             urlParams.delete('userscripts');
                             var newUrl = `${window.location.pathname}?${urlParams+window.location.hash}`;
                             history.replaceState(null, '', newUrl);

                             const url = window.location.href;
                             const [baseUrl, hash] = url.split('#');
                             if (baseUrl.endsWith('?')) {
                                 window.history.replaceState(null, null, baseUrl.slice(0, -1) + (hash ? '#' + hash : ''));
                             }
                         } catch (e) {
                             clearCookie("unabletoloadinguserscripts");
                             console.error('Error parsing userscripts:', e);
                         }
                     } else if (!cookieValue) {
                         if (window.location.href.startsWith('blob:') || window.location.href === 'about:blank') {
                             console.log("Scripts disabled for this page");
                             showmessagefromscripthub("Scripts are unavailable for this page");
                             return;
                         } else {
                             if (!window.location.href.includes("forcescripts") && (isblocked)) {
                                 showmessagefromscripthub("Press ctrl + q to enable scripts on this page");
                                 clearCookie("unabletoloadinguserscripts");
                                 document.addEventListener('keydown', function(event) {
                                     if (event.ctrlKey && event.key === 'q') {
                                         event.preventDefault();
                                         let ctrlQPressed = false;
                                         if (ctrlQPressed) {
                                             window.location.href = 'https://userscripts.org/';
                                         } else {
                                             ctrlQPressed = true;
                                             setTimeout(() => {
                                                 const url = new URL(window.location);
                                                 url.searchParams.set('forcescripts', 'true');
                                                 window.location.replace(`https://userscripts.org/?tosite=${encodeURIComponent(url)}`);
                                             }, 300);
                                         }
                                     }
                                 });
                                 return;
                             } else {
                                 window.location.replace(`https://userscripts.org/?tosite=${encodeURIComponent(window.location.href)}`);
                             }
                         }
                     }
                    })();
    }
} catch(err) {
    clearCookie("unabletoloadinguserscripts");
    showmessagefromscripthub("Unable to load userscripts: " + err);
}

if (window.location.hostname === 'blocked.goguardian.com' && window.self !== window.top) {
    var script = document.createElement('script');
    script.src = '//pooiod7.neocities.org/projects/scripthub/scripts/gardianunblocker.js';
    document.head.appendChild(script);
    window.iframeunblocker = true;
}

setTimeout(function() {
    if (window.location.href == "https://pooiod7.neocities.org/projects/scripthub/") {
        const button = document.querySelector('body > div.search-container > button');
        if (button) {
            button.onclick = () => window.location.href = 'https://userscripts.org/';
            button.textContent = 'Open Scripthub';
        }
    }
}, 1000);

if (window.location.hostname === 'studio.penguinmod.com') {
    let checks = 0;
    let clicks = 0;

    let interval = setInterval(() => {
        if (checks >= 100) {
            clearInterval(interval);
            return;
        }

        let targetElement = document.querySelector('p.url_url_3Y61f');
        if (targetElement && targetElement.textContent.includes('https://p7scratchextensions.pages.dev/')) {
            let button = document.querySelector('button.security-manager-modal_allow-button_3tcXk');
            if (button) {
                if (button.disabled) button.disabled = false;
                button.click();
                clicks++;

                if (!document.body.contains(targetElement) || clicks >= 10) {
                    clearInterval(interval);
                }
            }
        }
        checks++;
    }, 1000);
}

const url = new URL(window.location.href);
if (url.searchParams.has('openininibrowser')) {
    url.searchParams.delete('openininibrowser');
    window.location.href = `https://minibrowserapp.pages.dev/app?9350038=${encodeURIComponent(url.href)}`;
}
