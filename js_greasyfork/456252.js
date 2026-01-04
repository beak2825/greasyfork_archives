// ==UserScript==
// @name         WhatsApp Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simple contacts hider for WhatsApp WEB.
// @author       Ege S
// @match        https://web.whatsapp.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456252/WhatsApp%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/456252/WhatsApp%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hide = localStorage.getItem("hide") ? eval(localStorage.getItem("hide")) : true;
    var hideBlocks = localStorage.getItem("hideBlocks") ? eval(localStorage.getItem("hideBlocks")) : true;
    var secureScroll = false;
    var transition = localStorage.getItem("transition") ? eval(localStorage.getItem("transition")) : true;
    setInterval(() => {
        if(!hide) return;
        (hideBlocks ? [...document.querySelectorAll("#pane-side > div > div > div > div")] : [...document.querySelectorAll("#pane-side > div > div > div > div > div > div > div > div._2EU3r > div > div > div > img"), ...document.querySelectorAll("#pane-side > div > div > div > div > div > div > div > div._2EU3r > div > div > img"), ...document.querySelectorAll(("#pane-side > div > div > div > div > div > div > div > div._3OvU8 > div._37FrU > div._1qB8f")), ...document.querySelectorAll("#pane-side > div > div > div > div > div > div > div > div > div._3vPI2 > div.zoWT4 > span")]).forEach(a => {
            if(a.id != "changed") {
                a.id = "changed";
                a.style.filter = "blur(5px)";
                transition && (a.style.transition = "filter 50ms");
                a[secureScroll ? "onmousemove" : "onmouseenter"] = (e) => {
                    if(secureScroll && e.clientX > (a.clientWidth / 10 * 9)) return;
                    a.style.filter = "";
                };
                a.onmouseleave = () => {
                    a.style.filter = "blur(5px)";
                };
            }
        });
    }, 10);
    window.addEventListener("keydown", (e) => {
        if(e.keyCode == 65 && e.altKey) {
            e.preventDefault();
            hide = !hide;
            if(!hide) {
                document.querySelectorAll("#changed").forEach(a => {
                    a.style.filter = "";
                    a.id = "";
                    a.onmouseenter = () => {};
                    a.onmouseleave = () => {};
                });
            }
        }
    });

    var menu = document.createElement("div");
    var show = false;

    menu.innerHTML = `
    <p id="sheader" style="text-align:center;color:white!important;">WhatsApp Hider</p>
    <div id="scontainer" style="display: none;">
    <br>
    <input type="checkbox" checked="true">
    <span>Hide</span><br>
    <input type="checkbox">
    <span>Group Private Elements</span><br>
    <input type="checkbox">
    <span>Transition</span><br><br>
    <input oninput="document.querySelector('#apply').style.display='block'" id="pss" type="password" placeholder="Password" style="background-color: rgba(255, 255, 255, 0); border: 1px white solid; color: white; padding: 3px; border-radius: 3px;">
    <a onmouseenter="document.querySelector('#pss').type = 'text'" onmouseleave="document.querySelector('#pss').type = 'password'">Show</a><br>
    <a id="apply" onclick="localStorage.setItem('pss', document.querySelector('#pss').value); document.querySelector('#apply').innerHTML = 'Applied Changes.'; setTimeout(() => {document.querySelector('#apply').style.display='none'; document.querySelector('#apply').innerHTML = 'Apply';}, 2000);" style="display: none; text-align: center; margin-top: 5px;">Apply</a><br>
    </div>

    `;
    var style = {
        display: "block",
        color: "white",
        backgroundColor: "#111b21",
        position: "fixed",
        top: "0",
        left: "50%",
        zIndex: "999999",
        transform: "translateX(-50%)",
        padding: "5px",
        borderRadius: "5px",
        opacity: "0.6"
    };
    for(let [property, value] of Object.entries(style)) {
        menu.style[property] = value;
    }
    document.body.appendChild(menu);
    var to;
    /*document.querySelector("#sheader").addEventListener("mousedown", () => {
        show = !show;
        if(show) {
            document.querySelector("#scontainer").style.display = "block";
            menu.style.opacity = "1";
            menu.style.transition = "";
            menu.style.color = "transparent";
            clearTimeout(to);
            to = setTimeout(() => {
                menu.style.transition = "color 100ms";
                menu.style.color = "white";
            });
        } else {
            menu.style.color = "transparent";
            clearTimeout(to);
            to = setTimeout(() => {
                document.querySelector("#scontainer").style.display = "none";
                menu.style.opacity = "0.6";
            }, 100);
        }
    });*/

    menu.addEventListener("mouseenter", () => {
        show = true;
        document.querySelector("#scontainer").style.display = "block";
        menu.style.opacity = "1";
        menu.style.transition = "";
        menu.style.color = "transparent";
        clearTimeout(to);
        to = setTimeout(() => {
            menu.style.transition = "color 100ms";
            menu.style.color = "white";
        });
    });

    menu.addEventListener("mouseleave", () => {
        show = false;
        menu.style.color = "transparent";
        clearTimeout(to);
        to = setTimeout(() => {
            document.querySelector("#scontainer").style.display = "none";
            menu.style.opacity = "0.6";
        }, 100);
    });

    window.addEventListener("mousedown", (e) => {
        console.log(e.button);
        if(e.button == 1) {
            e.preventDefault();
            var el = document.querySelector("#main > footer > div._2BU3P.tm2tP.copyable-area > div > span:nth-child(2) > div > div._2lMWa > div.p3_M1 > div > div > p > span");
            el.innerHTML = el.innerHTML.split("").reverse().join("");
            console.log(el);
        }
    });

    document.querySelectorAll("input[type=checkbox]").forEach((el, i) => {
        if(i == 0) el.checked = hide;
        else if(i == 1) el.checked = hideBlocks;
        else if(i == 2) el.checked = transition;
        el.onchange = (e) => {
            var v = el.checked;
            switch(i) {
                case 0:
                    hide = v;
                    localStorage.setItem("hide", hide);
                    if(!hide) {
                        document.querySelectorAll("#changed").forEach(a => {
                            a.style.filter = "";
                            a.id = "";
                            a.onmouseenter = () => {};
                            a.onmouseleave = () => {};
                        });
                    }
                    break;
                case 1:
                    hideBlocks = v;
                    localStorage.setItem("hideBlocks", hideBlocks);
                    document.querySelectorAll("#changed").forEach(a => {
                        a.style.filter = "";
                        a.id = "";
                        a.onmouseenter = () => {};
                        a.onmouseleave = () => {};
                    });
                    break;
                case 2:
                    transition = v;
                    localStorage.setItem("transition", transition);
                    document.querySelectorAll("#changed").forEach(a => {
                        a.style.transition = "";
                        a.id = "";
                    });
                    break;
            }
        };
    });

    var password = localStorage.getItem("pss");
    var pss = true;

    document.querySelector("#pss").value = password;

    if(!pss || !password) return;
    var ps = document.createElement("div");
    ps.style = `
    position: fixed;
    display: block;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999999999999;
    background: rgba(0, 0, 0, 0.3);
    `;
    ps.innerHTML = `
    <div style="position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%); text-align: center; background-color: #0a1014; box-shadow: 0 0 10px rgba(150, 255, 180, 0.5); padding: 10px; border-radius: 10px;">
    <svg viewBox="0 0 212 212" height="50" style="margin-bottom: 5px;" width="100%" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212" xml:space="preserve"><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg>
    <h1>Enter Password</h1>
    <br>
    <input style="text-align: center; background-color: #111; color: white; border: 1px white solid; padding: 5px; border-radius: 5px;" placeholder="Password Here" type="password" id="inp">
    </div>
    `;
    document.body.appendChild(ps);
    const inp = document.querySelector("#inp");
    var focusIt = setInterval(() => {
        if(pss && document.activeElement.id != "inp") {
            inp.focus();
        }
    }, 10);
    inp.addEventListener("input", () => {
        var u = inp.value;
        if(u == password) {
            ps.style.display = "none";
            document.querySelector("#app").style.filter = "";
            document.querySelector("#app").style.pointerEvents = "all";
            clearInterval(focusIt);
        }
    });
    window.addEventListener("keydown", (e) => {
        if(e.repeat) return;
        if(e.keyCode == 13 && pss) {
            // submit password
            var u = inp.value;
            inp.value = "";
            if(u == password) {
                ps.style.display = "none";
                document.querySelector("#app").style.filter = "";
                document.querySelector("#app").style.pointerEvents = "all";
                clearInterval(focusIt);
            }
        }
    });
    document.querySelector("#app").style.filter = "blur(15px)";
    document.querySelector("#app").style.pointerEvents = "none";
})();