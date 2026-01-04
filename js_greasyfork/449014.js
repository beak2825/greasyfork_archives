// ==UserScript==
// @name         Case Clicker 2 Importing & Exporting save Tool (By Lapide)
// @namespace    https://github.com/nonumbershere/
// @version      1.00.3
// @license      MIT
// @description  A CS:GO/Case Clicker 2 tool focused on save exporting and importing.
// @author       Lapide
// @homepage     https://discord.gg/6eaDrx5J9s
// @match        *://csgo.mtsl.dk/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/449014/Case%20Clicker%202%20Importing%20%20Exporting%20save%20Tool%20%28By%20Lapide%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449014/Case%20Clicker%202%20Importing%20%20Exporting%20save%20Tool%20%28By%20Lapide%29.meta.js
// ==/UserScript==
(function() {
    if (location.pathname == '/') {
        try {
            // Settings
            var config = {
                hotkeys: {
                    togglemenu: "j"
                }
            };
            var info = {
                version: GM_info.script.version,
                description: GM_info.script.description,
                name: GM_info.script.name,
                runAt: GM_info.script.runAt,
            };
            // Saving System
            function m(e) {
                return encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, (function e(t, o) {
                    return String.fromCharCode("0x" + o)
                }))
            }

            function f(e) {
                return decodeURIComponent(e.split("").map((function(e) {
                    return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
                })).join(""))
            }

            function h(e) {
                e = m(e);
                let t = {};
                let o = (e + "").split("");
                let a = [];
                let r;
                let l = o[0];
                let n = 256;
                for (let e = 1; e < o.length; e++) {
                    r = o[e];
                    if (t[l + r] != null)
                        l += r;
                    else {
                        a.push(l.length > 1 ? t[l] : l.charCodeAt(0));
                        t[l + r] = n;
                        n++;
                        l = r
                    }
                }
                a.push(l.length > 1 ? t[l] : l.charCodeAt(0));
                return a.map((e => {
                    let t = e.toString(36);
                    return t.substring(0, t.length - 1) + (t[t.length - 1].match(/[0-9]/) ? v[t[t.length - 1]] : t[t.length - 1].toUpperCase())
                })).join("")
            }
            window.lzw_encode = h;
            let v = {
                0: "=",
                1: "!",
                2: "?",
                3: "$",
                4: "%",
                5: "&",
                6: "/",
                7: "\\",
                8: "-",
                9: "+"
            };
            let S = {
                "=": "0",
                "!": "1",
                "?": "2",
                $: "3",
                "%": "4",
                "&": "5",
                "/": "6",
                "\\": "7",
                "-": "8",
                "+": "9"
            };
            let w = Object.keys(S).join("");

            function b(e) {
                let t = {};
                let o = (e + "").split("");
                let a = o[0];
                let r = a;
                let l = [a];
                let n = 256;
                let i;
                for (let e = 1; e < o.length; e++) {
                    let s = o[e].charCodeAt(0);
                    if (s < 256)
                        i = o[e];
                    else
                        i = t[s] ? t[s] : r + a;
                    l.push(i);
                    a = i.charAt(0);
                    t[n] = r + a;
                    n++;
                    r = i
                }
                return l.join("")
            }

            function j(e) {
                try {
                    if (e === "1") {
                        localStorage.v1SaveSnapshot = localStorage.localsave;
                        let e = b(localStorage.localsave).split("").map((e => e.charCodeAt(0) - 1));
                        let t = new TextDecoder;
                        return JSON.parse(t.decode(new Uint8Array(e)))
                    } else if (e === "2") {
                        return JSON.parse(y(localStorage.localsave))
                    }
                } catch (e) {
                    console.error(e);
                    delete localStorage._cbid;
                    return user
                }
            }

            function save(m) {
                localStorage.localsave_trading = m;
                localStorage.backup = localStorage.localsave_trading;
                localStorage.localsave = localStorage.localsave_trading;
                localStorage.do_trading = true;
                location.reload();
            }
            // Detections
            if (localStorage.joineddis != 'true') {
                var dis = confirm("[Trading]: Do you wanna join our Discord?");
                if (dis) {
                    GM_openInTab("https://discord.gg/6eaDrx5J9s", {
                        active: true,
                        insert: true,
                        setParent: true,
                        incognito: false
                    })
                    localStorage.joineddis = true;
                } else {
                    alert("[Trading]: We'll ask you next time!");
                }
            }

            // UI
            var StylePanel = document.createElement('style');
            StylePanel.innerHTML = `
        .tradingshow button {
    background: none;
    border: solid 1px #a7a7ff;
    color: #a7a7ff;
    padding: 7px;
    transition: 0.5s;
    cursor: pointer;
    border-radius: 20px;
    padding-left: 18px;
    padding-right: 18px;

        }
        .tradingshow button:hover {
    border: solid 1px #7d7dff;
    transition: 0.5s;
    color: #8080ff;
        }
        .tradingshow input::placeholder {
           color: #8272bf;
           opacity:0.8;
           transition:1s;
        }
        .tradingshow input:focus::placeholder {
    color: #86c7ff;
           transition:1s;
        }
        .tradingshow input:focus {
    border-color: #86c7ff;
    transition: 1s;
}
        .tradingshow input {
          padding: 7px;
    transition: 1s;
          border-radius: 20px;
       border: solid 1px #a7a7ff;
       color: #a7a7ff;
    background: transparent;
    }
        .tradingtab {
    font-weight: 700;
    height: -webkit-fill-available;
    width: 100px;
    font-family: system-ui;
    background: transparent;
    font-size: 15px;
    cursor: pointer;
    border: none;
    border-left: solid 1px #9191ff;
    border-right: solid 1px #9191ff;
    color: #855dff;
}
.tradingpage {
    z-index: -1;
    display: none;
}
.tradingshow {
    z-index: 1;
    padding: 10px;
    font-weight: 400;
    display: block;
}
.tradinginputset {
   display: inline;
}
.tradinginputset button {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}
#tradingborder {
    background: linear-gradient(45deg, #a9b8ff, #4b10ff);
    height: 2px;
   animation: an 30s ease infinite;
   background-size: 1000% 1000%;
}


.tradinginputset input {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
}
.tradingactive {
 filter: brightness(1.2);
 font-weight: 400;
}`;

            var Panel = document.createElement('div');
            Panel.innerHTML = `<div style="top: 98px; position: absolute; left: 309px; z-index: 2147483647;" id="tradingmenu">
  <div style="
    height: 353px;
    font-weight: bolder;
    width: 599px;
    background: #1a1a1a;
">
    <div style="">
      <div style="
    font-size: 20px;
    font-family: revert;
    padding-top: 6px;
    padding-left: 6px;
    padding-bottom: 4px;
" id="tradingmenuheader">Trading - <i style="
    font-size: 16px;
">${info.version} [By Lapide]</i><a href="https://discord.gg/6eaDrx5J9s" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 11px;
">Discord</a><a href="https://github.com/Case-Clicker-2-Utilities/Trading-Save-Editor/" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 10px;
">Github</a><a href="https://www.youtube.com/channel/UCRA3KXViuDmsmfuP0RF45_w?sub_confirmation=1" style="
    font-size: 17px;
    color: lightblue;
    float: right;
    margin-right: 10px;
">YouTube</a>
      </div>
      <div id="tradingborder" style="
"></div>
      <div id="trading_contents" style="">
        <div style="
    height: 44px;
    background: #222222;
">
          <button tab="main" class="tradingtab tradingactive">Main</button>
          <button tab="settings" class="tradingtab">Settings</button>
        </div>
        <div style="
    background: #161616;
    height: 265px;
    overflow-y: auto;
" id="tradingtabs">

          <div class="tradingshow" id="tradingpagemain" style="">
<button id="getsave" title="Get/export your current save, you can import it.">Get current Save</button> <div class="tradinginputset"><button id="setsave" title="Import/sets your current save. It will override it so be careful!">Import Save</button><input id="savetext" placeholder="Enter Save Here..."></div>
 <button id="wipesave" title="Erase's your current save, unreversable unless you already made a backup.">Wipe Save</button>
          </div>

          <div class="tradingpage" id="tradingpagesettings" style="">
          <p>Coming Soon</p><br><a href="https://github.com/Case-Clicker-2-Utilities/Trading-Save-Editor/issues/new">Report an issue</a>
          </div>

        </div>
      </div>
    </div>
  </div>
  <div style="
    height: 359px;
    width: 603px;
    top: -3px;
    left: -2px;
    z-index: -1;
    position: inherit;
    background: linear-gradient(45deg, #a9b8ff, #4b10ff);
"></div>
</div>`;
            document.body.prepend(Panel);
            document.body.prepend(StylePanel);

            function dragElement(elmnt) {
                var pos1 = 0,
                    pos2 = 0,
                    pos3 = 0,
                    pos4 = 0;
                if (document.getElementById(elmnt.id + "header")) {
                    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                } else {
                    elmnt.onmousedown = dragMouseDown;
                }

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
            for (var i = 0; i < document.getElementsByClassName('tradingtab').length; ++i) {
                document.getElementsByClassName('tradingtab')[i].addEventListener('click', function() {
                    for (var gg = 0; gg < document.getElementsByClassName('tradingshow').length; ++gg) {
                        document.getElementsByClassName('tradingshow')[gg].className = ('tradingpage');
                    }
                    for (var bb = 0; bb < document.getElementsByClassName('tradingactive').length; ++bb) {
                        document.getElementsByClassName('tradingactive')[bb].className = ('tradingtab');
                    }
                    // console.log(this);
                    this.classList.add('tradingactive')
                    document.getElementById('tradingpage' + this.getAttribute('tab')).className = ('tradingshow');
                })
            }
            dragElement(Panel.children[0]);
            var show = false;
            document.addEventListener('keydown', function(e) {
                if (e.key == config.hotkeys.togglemenu) {
                    show = !show;
                    Panel.style.display = show ? 'block' : 'none';
                }
            })

            // Options
            document.getElementById('setsave').addEventListener('click', function() {
                var savetxt = document.getElementById('savetext').value;
                if (savetxt.length > 999) {
                        try {
                            save(savetxt);
                            alert("Sucessfully exported save, now reloading.");
                        } catch (e) {
                            if (e instanceof Error) {
                                alert("Failed to export save due to an unexpected error [SEND THIS TO THE DEVELOPER]: " + e.message);
                            }
                        } finally {}
                } else {
                    alert("The save is too low or possibly blank.");
                }
            });
            document.getElementById('getsave').addEventListener('click', function() {
                alert("Copied save!");
                GM_setClipboard(localStorage.localsave);
            });
            document.getElementById('wipesave').addEventListener('click', function() {
                var confirmation = confirm('Are you sure you wan\'t to erase your save? (WILL ALSO COPY YOUR SAVE TO YOUR CLIPBOARD JUST INCASE)');
                if (confirmation) {
                    GM_setClipboard(localStorage.localsave);
                    delete localStorage._cbid;
                    delete localStorage.localsave;
                    delete localStorage.shop;
                    delete localStorage.flags;
                    delete localStorage.backup;
                    delete localStorage.backupid;
                    window.location.reload()
                    alert("Wipe save. Also copied the save to your clipboard.");
                } else {
                    alert("Okay!");
                }
            });

            // Loading
            if (localStorage.do_trading == 'true') {
                localStorage.backup = localStorage.localsave_trading;
                localStorage.localsave = localStorage.localsave_trading;
                localStorage.do_trading = false;
            }
        } catch (err) {
            if (err) location.reload();
        }
    }
})();