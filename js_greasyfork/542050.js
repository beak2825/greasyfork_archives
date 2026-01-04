// ==UserScript==
// @name         SenkronizeFilmŞapkaYok
// @namespace    https://github.com/Swempish
// @version      1.3.1
// @description  Arkadaşlarınızla senkronize şekilde dizi/film ve YouTube'dan video izleyin.
// @author       Emirhan ÇOLAK
// @match        https://www.hdfilmcehennemi2.site/*
// @match        https://vidmoly.to/*
// @match        https://vidload.site/*
// @match        https://26efp.com/bkg/*
// @match        https://filemoon.in/e/*
// @match        https://sezonlukdizi6.com/*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/embed/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdfilmcehennemi2.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542050/SenkronizeFilm%C5%9EapkaYok.user.js
// @updateURL https://update.greasyfork.org/scripts/542050/SenkronizeFilm%C5%9EapkaYok.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
        'use strict';
     
        if (location.host == "sezonlukdizi6.com"){
            window.jQuery310 = $.noConflict(true);
        }

        const supportedHosts = ["www.hdfilmcehennemi2.site"];
        const supportedEmbedHosts = ["vidmoly.to", "vidload.site", "26efp.com"];
        var connections = [];
     
        function main() {
     
     
            // redirect to original link
            if (location.host == "filemoon.in" && window === window.top){
                window.location.href = document.querySelector("iframe").src;
            }

            if (location.host == "www.youtube.com" && window.location.href.includes("embed") && window === window.top){
                let b = document.createElement("div");
                let c = document.createElement("br");
                b.innerHTML = `<div id="connectionPanel" style="margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#f39c12;text-transform:uppercase;letter-spacing:2px">SenkronizeFilm<span style="color:#444;font-family:'Courier New',Courier,monospace;font-style:italic;font-size:.8rem">v1.3.1</span></h2><p style="font-size: .8rem;font-style: italic;margin-bottom: 1rem;">made by Emirhan ÇOLAK ( <a href="https://instagram.com/@boriemir" style="color: aqua;">@boriemir</a> )</p><div style="margin-bottom:1.2rem"><label for="userID" style="display:block;margin-bottom:.5rem;font-weight:600;color:#ccc">Senin ID:</label><div style="display:flex;gap:.5rem;align-items:center"><input id="currentUserID" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#f39c12;font-size:1.05rem;box-sizing:border-box;text-align:center;font-weight:700" type="text" disabled="disabled" value="Yükleniyor..."><button id="copyIDButton" style="padding:.7rem .8rem;background-color:#555;color:#fff;border:none;border-radius:.4rem;font-size:.9rem;cursor:pointer;transition:background-color .3s ease;display:flex;align-items:center;justify-content:center" onmouseover='this.style.backgroundColor="#666"' onmouseout='this.style.backgroundColor="#555"' title="ID'yi Kopyala">📋</button></div></div><button style="padding:1rem;width:100%;margin-top:1.3rem;background-color:#2ecc71;color:#fff;border:none;border-radius:.4rem;font-size:1.1rem;cursor:pointer;transition:background-color .3s ease;text-transform:uppercase;font-weight:700" onmouseover='this.style.backgroundColor="#27ae60"' onmouseout='this.style.backgroundColor="#2ecc71"' id="hostSession">Ev sahibi ol</button><hr style="border:0;height:1px;background-color:#555;margin:2.2rem 0"><div style="display:flex;gap:.5rem"><input id="remoteHOST" type="text" placeholder="Oturum Kodu" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#eee;font-size:1rem;box-sizing:border-box"><button style="padding:.7rem 1.2rem;background-color:#e74c3c;color:#fff;border:none;border-radius:.4rem;font-size:1rem;cursor:pointer;transition:background-color .3s ease" onmouseover='this.style.backgroundColor="#c0392b"' onmouseout='this.style.backgroundColor="#e74c3c"' id='joinRemote'>Katıl</button></div></div><div id="sessionPanel" style="display:none;margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#2ecc71;text-transform:uppercase;letter-spacing:2px">Oturum Aktif</h2></div><script>function copyUserID() {const userIDInput = document.getElementById('currentUserID');userIDInput.removeAttribute('disabled');userIDInput.select();document.execCommand('copy');userIDInput.setAttribute('disabled', 'true');}</script>`;
                document.querySelector("body").style.setProperty("background-color", "rgb(66,66,66)");
                document.querySelector("body").style.setProperty("overflow", "auto");
                document.querySelector("#player").style.setProperty("position", "relative", "important");
                document.querySelector("#player").style.setProperty("height", "20rem", "important");
                document.querySelector("#player").style.setProperty("width", "100%");
                document.querySelector("#player").style.setProperty("background-color", "black");
                document.querySelector("#player").after(c);
                document.querySelector("#player").after(b);
                document.querySelector("#copyIDButton").addEventListener("click", function() {
                    const userIDInput = document.getElementById('currentUserID');
                    userIDInput.removeAttribute('disabled');
                    userIDInput.select();
                    document.execCommand('copy');
                    userIDInput.setAttribute('disabled', 'true');
                })
            }

            if (location.host == "www.youtube.com" && window.location.href.includes("watch") && window === window.top){
                let elInterval = setInterval(() => {
                    const el = document.querySelector('#top-level-buttons-computed');
                    if (el) {
                        clearInterval(elInterval);
                        const script = document.createElement('script');
                        script.textContent = `
  function kopyala(link) {
    navigator.clipboard.writeText(link)
      .then(() => alert("İçeriği beraber izlemek için gereken link kopyalandı. İçeriği izlemek için kopyalanan linke girin.")
      .catch(err => console.error("Kopyalama başarısız:", err));
  }
`;
                        document.documentElement.appendChild(script);
                        let a = document.createElement("div");
                        let vidID = new URLSearchParams(location.search).get("v");
                        let embedLink = "https://www.youtube.com/embed/" + vidID;
                        a.innerHTML = `<yt-button-view-model style="margin-left: 0.8rem;" class="ytd-menu-renderer"><button-view-model class="yt-spec-button-view-model style-scope ytd-menu-renderer"><button onclick="navigator.clipboard.writeText('`+ embedLink +`').then(() => alert('İçeriği beraber izlemek için gereken link kopyalandı. İçeriği izlemek için kopyalanan linke girin.'))" class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" title="Beraber izle" aria-label="Beraber izle" aria-disabled="false"> <div aria-hidden="true" class="yt-spec-button-shape-next__icon"> <div style="width: 24px; height: 24px; fill: currentcolor;"><span class="yt-icon-shape style-scope yt-icon yt-spec-icon-shape"> <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z"></path></svg> </span></div> </div> <div class="yt-spec-button-shape-next__button-text-content"> Beraber izle </div> </button></button-view-model></yt-button-view-model>`;
                        document.querySelector("#top-level-buttons-computed").after(a.firstChild);
                    }
                }, 100);
            }
     
            if (location.host == "sezonlukdizi6.com"){
                let a = document.createElement("div");
                a.innerHTML = `<a id="beraberizle" href="" style="font-size: 1.2rem; width: max-content; display: block; margin: 1rem; text-decoration: none; padding: .5rem; border-radius: .3rem; background-color: rgb(45, 113, 116); color: white; font-family: Arial, Helvetica, sans-serif;">Beraber İzle</a><p style="margin-bottom: 1rem; color: white; background-color: red; padding: 0.2rem;" >Butona basmadan önce yukardan oynat tuşuna basın sonra istediğiniz alternatif oynatıcıyı seçin.</p>`;
                document.querySelector("#embed").after(a);
     
                setInterval(function(){
                    try{
                        document.querySelector("#beraberizle").href = document.querySelector("iframe").src;
                    } catch (e) {}
                },400)
     
     
            }
     
     
            // Movie Host Page Section
            if (supportedHosts.includes(location.host)) {
                let a = document.createElement("div");
                let movieFrame = document.querySelector("iframe");
                let movieEmbedLink = movieFrame.getAttribute("data-src");
                a.innerHTML = `<a href="` + movieEmbedLink + `" style="font-size: 1.2rem; width: max-content; display: block; margin: 1rem; text-decoration: none; padding: .5rem; border-radius: .3rem; background-color: rgb(45, 113, 116); color: white; font-family: Arial, Helvetica, sans-serif;">Beraber İzle</a>`;
                document.querySelector("div.col:nth-child(1) > div:nth-child(4) > div:nth-child(2)").after(a);
            }
     
            // Movie Embed section
            if (supportedEmbedHosts.includes(location.host) || window.location.pathname.includes("embed")) {
                let b = document.createElement("div");
                let c = document.createElement("br");
                b.innerHTML = `<div id="connectionPanel" style="margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#f39c12;text-transform:uppercase;letter-spacing:2px">SenkronizeFilm<span style="color:#444;font-family:'Courier New',Courier,monospace;font-style:italic;font-size:.8rem">v1.3.1</span></h2><p style="font-size: .8rem;font-style: italic;margin-bottom: 1rem;">made by Emirhan ÇOLAK ( <a href="https://instagram.com/@boriemir" style="color: aqua;">@boriemir</a> )</p><div style="margin-bottom:1.2rem"><label for="userID" style="display:block;margin-bottom:.5rem;font-weight:600;color:#ccc">Senin ID:</label><div style="display:flex;gap:.5rem;align-items:center"><input id="currentUserID" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#f39c12;font-size:1.05rem;box-sizing:border-box;text-align:center;font-weight:700" type="text" disabled="disabled" value="Yükleniyor..."><button id="copyIDButton" style="padding:.7rem .8rem;background-color:#555;color:#fff;border:none;border-radius:.4rem;font-size:.9rem;cursor:pointer;transition:background-color .3s ease;display:flex;align-items:center;justify-content:center" onmouseover='this.style.backgroundColor="#666"' onmouseout='this.style.backgroundColor="#555"' title="ID'yi Kopyala">📋</button></div></div><button style="padding:1rem;width:100%;margin-top:1.3rem;background-color:#2ecc71;color:#fff;border:none;border-radius:.4rem;font-size:1.1rem;cursor:pointer;transition:background-color .3s ease;text-transform:uppercase;font-weight:700" onmouseover='this.style.backgroundColor="#27ae60"' onmouseout='this.style.backgroundColor="#2ecc71"' id="hostSession">Ev sahibi ol</button><hr style="border:0;height:1px;background-color:#555;margin:2.2rem 0"><div style="display:flex;gap:.5rem"><input id="remoteHOST" type="text" placeholder="Oturum Kodu" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#eee;font-size:1rem;box-sizing:border-box"><button style="padding:.7rem 1.2rem;background-color:#e74c3c;color:#fff;border:none;border-radius:.4rem;font-size:1rem;cursor:pointer;transition:background-color .3s ease" onmouseover='this.style.backgroundColor="#c0392b"' onmouseout='this.style.backgroundColor="#e74c3c"' id='joinRemote'>Katıl</button></div></div><div id="sessionPanel" style="display:none;margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#2ecc71;text-transform:uppercase;letter-spacing:2px">Oturum Aktif</h2></div><script>function copyUserID() {const userIDInput = document.getElementById('currentUserID');userIDInput.removeAttribute('disabled');userIDInput.select();document.execCommand('copy');userIDInput.setAttribute('disabled', 'true');}</script>`;
                if (location.host == "vidmoly.to") {
                    document.querySelector("#vplayer").style.setProperty("position", "absolute", "important");
                    document.querySelector("body").style.setProperty("height", "auto", "important");
                    document.querySelector("#vplayer").style.setProperty("height", "100%", "important");
                    document.querySelector("body").style.setProperty("background-color", "rgb(66,66,66)");
                    document.querySelector("#lo_dlsm").parentElement.after(c);
                    document.querySelector("#lo_dlsm").parentElement.after(b);
                    document.querySelector("#lo_dlsm").parentElement.style.cssText = 'display: block; position: relative; height: 20rem; overflow: auto;border: 2px solid blue;';
                    document.querySelector("#copyIDButton").addEventListener("click", function() {
                        const userIDInput = document.getElementById('currentUserID');
                        userIDInput.removeAttribute('disabled');
                        userIDInput.select();
                        document.execCommand('copy');
                        userIDInput.setAttribute('disabled', 'true');
                    })
                }
                if (location.host == "vidload.site") {
                    document.querySelector("#my-video").style.setProperty("position", "relative", "important");
                    document.querySelector("#my-video").style.setProperty("height", "20rem", "important");
                    document.querySelector("body").style.setProperty("background-color", "rgb(66,66,66)");
                    document.querySelector("body").style.setProperty("overflow", "auto");
                    document.querySelector("#my-video").after(c);
                    document.querySelector("#my-video").after(b);
                    document.querySelector("#copyIDButton").addEventListener("click", function() {
                        const userIDInput = document.getElementById('currentUserID');
                        userIDInput.removeAttribute('disabled');
                        userIDInput.select();
                        document.execCommand('copy');
                        userIDInput.setAttribute('disabled', 'true');
                    })
                }
     
                if (location.host == "26efp.com") {
     
                    document.querySelector("body").style.setProperty("background-color", "rgb(66,66,66)");
                    document.querySelector("#vplayer").style.setProperty("position", "relative", "important");
                    document.querySelector("#vplayer").style.setProperty("height", "20rem", "important");
                    document.querySelector("#vplayer").style.setProperty("width", "100%");
                    document.querySelector("#vplayer").style.setProperty("background-color", "black");
                    document.querySelector("#vplayer").after(c);
                    document.querySelector("#vplayer").after(b);
                    document.querySelector("#copyIDButton").addEventListener("click", function() {
                        const userIDInput = document.getElementById('currentUserID');
                        userIDInput.removeAttribute('disabled');
                        userIDInput.select();
                        document.execCommand('copy');
                        userIDInput.setAttribute('disabled', 'true');
                    })
     
     
                }
     
                let peer = null;
                let currentConnection = null;
                let imHost = false;
                let videoMeta = {
                    "currentTime": 0,
                    "paused": true
                };
     
                peer = new Peer("emocan" + String(Math.floor(Math.random() * 900) + 100));
     
                peer.on('open', (id) => {
                    console.log('Kendi Peer ID\'miz: ' + id);
                    document.querySelector("#currentUserID").value = id;
                });
     
                // Hata durumlarını dinliyoruz
                peer.on('error', (err) => {
                    console.log('Peer hatası:' + err);
                });
     
                // Diğer eşlerden gelen DATA bağlantılarını dinliyoruz
                peer.on('connection', (connection) => {
                    currentConnection = connection;
                    connections.push(connection);
                });
     
                let syncInterval = setInterval(function() {
                    if (imHost) {
                        videoMeta.currentTime = document.querySelector("video").currentTime;
                        videoMeta.paused = document.querySelector("video").paused;
     
                        connections.forEach(connection => {
                            connection.send(JSON.stringify(videoMeta));
                        });
                    }
                }, 1000);
     
                document.querySelector("video").addEventListener("play", (event) => {
                    if (imHost) {
                        videoMeta.currentTime = document.querySelector("video").currentTime;
                        videoMeta.paused = document.querySelector("video").paused;
     
                        connections.forEach(connection => {
                            connection.send(JSON.stringify(videoMeta));
                        });
                    }
                });
     
                document.querySelector("video").addEventListener("pause", (event) => {
                    if (imHost) {
                        videoMeta.currentTime = document.querySelector("video").currentTime;
                        videoMeta.paused = document.querySelector("video").paused;
     
                        connections.forEach(connection => {
                            connection.send(JSON.stringify(videoMeta));
                        });
                    }
                });
     
                document.querySelector("video").addEventListener("seeked", (event) => {
                    if (imHost) {
                        videoMeta.currentTime = document.querySelector("video").currentTime;
                        videoMeta.paused = document.querySelector("video").paused;
     
                        connections.forEach(connection => {
                            connection.send(JSON.stringify(videoMeta));
                        });
                    }
                });
     
                // Become Host
                document.querySelector("#hostSession").addEventListener("click", function() {
                    document.querySelector("#connectionPanel").style.display = "none";
                    document.querySelector("#sessionPanel").style.display = "block";
                    imHost = true;
                });
     
                // Join Remote
                document.querySelector("#joinRemote").addEventListener("click", function() {
                    document.querySelector("#connectionPanel").style.display = "none";
                    document.querySelector("#sessionPanel").style.display = "block";
                    let remotePeerId = document.querySelector("#remoteHOST").value;
     
                    const conn = peer.connect(remotePeerId);
                    currentConnection = conn;
     
                    conn.on('open', () => {
                        alert('Bağlantı kuruldu.');
                    });
     
                    conn.on('data', (data) => {
                        var parsedData = JSON.parse(data);
     
                        if (document.querySelector("video").paused != parsedData.paused) {
                            if (parsedData.paused == false) {
                                document.querySelector("video").play();
                            } else {
                                document.querySelector("video").pause();
                            }
     
     
                        }
                        if (Math.abs(parsedData.currentTime) > 1) {
                            document.querySelector("video").currentTime = parsedData.currentTime;
                        }
     
                    });
     
                    conn.on('close', () => {
                        alert('Bağlantı kesildi!');
                    });
     
                    conn.on('error', (err) => {
     
                    });
     
                });
            }
        }
        $(document).ready(function() {
            main();
        });
    })();

