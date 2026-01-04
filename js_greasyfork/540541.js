// ==UserScript==
// @name         SenkronizeFilm
// @namespace    https://github.com/Swempish
// @version      1.3.0
// @description  Arkadaşlarınla senkronize film izle.
// @author       Emirhan ÇOLAK
// @match        https://www.hdfilmcehennemi2.site/*
// @match        https://vidmoly.to/*
// @match        https://vidload.site/*
// @match        https://26efp.com/bkg/*
// @match        https://filemoon.in/e/*
// @match        https://sezonlukdizi6.com/*
// @match        https://www.pornhub.com/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdfilmcehennemi2.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540541/SenkronizeFilm.user.js
// @updateURL https://update.greasyfork.org/scripts/540541/SenkronizeFilm.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    if (location.host == "sezonlukdizi6.com"){
        window.jQuery310 = $.noConflict(true);
    }

    const supportedHosts = ["www.hdfilmcehennemi2.site"];
    const supportedEmbedHosts = ["vidmoly.to", "vidload.site", "26efp.com", "www.pornhub.com"];
    var connections = [];

    function main() {


        // redirect to original link
        if (location.host == "filemoon.in" && window === window.top){
            window.location.href = document.querySelector("iframe").src;
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

        if(location.host == "www.pornhub.com"){

            if(window.location.href.includes("view_video")){
                let viewkey = new URLSearchParams(location.search).get("viewkey")
                let beraberizleButtonHTML = `<a href="https://www.pornhub.com/embed/`+ viewkey +`" class="tab-menu-wrapper-cell videoCtaPill"><div class="gtm-event-video-underplayer flag-btn tab-menu-item tooltipTrig" data-event="video_underplayer" data-label="report" data-tab="report-tab" role="button" tabindex="0" data-title="Beraber izle" aria-label="beraber izle" style="stroke: #c6c6c6;"><svg width="21px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="shareIcon"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z"></path> </g></svg><span>Beraber İzle</span> </div></a>`;
                let wrapper = document.createElement("div");
                wrapper.innerHTML = beraberizleButtonHTML;
                let a = wrapper.firstElementChild;
                document.querySelector(".videoCtaPill").after(a);
            }
            if(window.location.href.includes("embed")){
                let b = document.createElement("div");
                let c = document.createElement("br");
                b.innerHTML = `<div id="connectionPanel" style="margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#f39c12;text-transform:uppercase;letter-spacing:2px">SenkronizeFilm<span style="color:#444;font-family:'Courier New',Courier,monospace;font-style:italic;font-size:.8rem">v1.0.0</span></h2><p style="font-size: .8rem;font-style: italic;margin-bottom: 1rem;">made by Emirhan ÇOLAK ( <a href="https://instagram.com/@boriemir" style="color: aqua;">@boriemir</a> )</p><div style="margin-bottom:1.2rem"><label for="userID" style="display:block;margin-bottom:.5rem;font-weight:600;color:#ccc">Senin ID:</label><div style="display:flex;gap:.5rem;align-items:center"><input id="currentUserID" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#f39c12;font-size:1.05rem;box-sizing:border-box;text-align:center;font-weight:700" type="text" disabled="disabled" value="Yükleniyor..."><button id="copyIDButton" style="padding:.7rem .8rem;background-color:#555;color:#fff;border:none;border-radius:.4rem;font-size:.9rem;cursor:pointer;transition:background-color .3s ease;display:flex;align-items:center;justify-content:center" onmouseover='this.style.backgroundColor="#666"' onmouseout='this.style.backgroundColor="#555"' title="ID'yi Kopyala">📋</button></div></div><button style="padding:1rem;width:100%;margin-top:1.3rem;background-color:#2ecc71;color:#fff;border:none;border-radius:.4rem;font-size:1.1rem;cursor:pointer;transition:background-color .3s ease;text-transform:uppercase;font-weight:700" onmouseover='this.style.backgroundColor="#27ae60"' onmouseout='this.style.backgroundColor="#2ecc71"' id="hostSession">Ev sahibi ol</button><hr style="border:0;height:1px;background-color:#555;margin:2.2rem 0"><div style="display:flex;gap:.5rem"><input id="remoteHOST" type="text" placeholder="Oturum Kodu" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#eee;font-size:1rem;box-sizing:border-box"><button style="padding:.7rem 1.2rem;background-color:#e74c3c;color:#fff;border:none;border-radius:.4rem;font-size:1rem;cursor:pointer;transition:background-color .3s ease" onmouseover='this.style.backgroundColor="#c0392b"' onmouseout='this.style.backgroundColor="#e74c3c"' id='joinRemote'>Katıl</button></div></div><div id="sessionPanel" style="display:none;margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#2ecc71;text-transform:uppercase;letter-spacing:2px">Oturum Aktif</h2></div><script>function copyUserID() {const userIDInput = document.getElementById('currentUserID');userIDInput.removeAttribute('disabled');userIDInput.select();document.execCommand('copy');userIDInput.setAttribute('disabled', 'true');}</script>`;

                document.querySelector("body").style.setProperty("background-color", "rgb(66,66,66)");
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
        if (supportedEmbedHosts.includes(location.host)) {
            let b = document.createElement("div");
            let c = document.createElement("br");
            b.innerHTML = `<div id="connectionPanel" style="margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#f39c12;text-transform:uppercase;letter-spacing:2px">SenkronizeFilm<span style="color:#444;font-family:'Courier New',Courier,monospace;font-style:italic;font-size:.8rem">v1.0.0</span></h2><p style="font-size: .8rem;font-style: italic;margin-bottom: 1rem;">made by Emirhan ÇOLAK ( <a href="https://instagram.com/@boriemir" style="color: aqua;">@boriemir</a> )</p><div style="margin-bottom:1.2rem"><label for="userID" style="display:block;margin-bottom:.5rem;font-weight:600;color:#ccc">Senin ID:</label><div style="display:flex;gap:.5rem;align-items:center"><input id="currentUserID" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#f39c12;font-size:1.05rem;box-sizing:border-box;text-align:center;font-weight:700" type="text" disabled="disabled" value="Yükleniyor..."><button id="copyIDButton" style="padding:.7rem .8rem;background-color:#555;color:#fff;border:none;border-radius:.4rem;font-size:.9rem;cursor:pointer;transition:background-color .3s ease;display:flex;align-items:center;justify-content:center" onmouseover='this.style.backgroundColor="#666"' onmouseout='this.style.backgroundColor="#555"' title="ID'yi Kopyala">📋</button></div></div><button style="padding:1rem;width:100%;margin-top:1.3rem;background-color:#2ecc71;color:#fff;border:none;border-radius:.4rem;font-size:1.1rem;cursor:pointer;transition:background-color .3s ease;text-transform:uppercase;font-weight:700" onmouseover='this.style.backgroundColor="#27ae60"' onmouseout='this.style.backgroundColor="#2ecc71"' id="hostSession">Ev sahibi ol</button><hr style="border:0;height:1px;background-color:#555;margin:2.2rem 0"><div style="display:flex;gap:.5rem"><input id="remoteHOST" type="text" placeholder="Oturum Kodu" style="flex-grow:1;padding:.7rem;border-radius:.4rem;border:1px solid #555;background-color:#444;color:#eee;font-size:1rem;box-sizing:border-box"><button style="padding:.7rem 1.2rem;background-color:#e74c3c;color:#fff;border:none;border-radius:.4rem;font-size:1rem;cursor:pointer;transition:background-color .3s ease" onmouseover='this.style.backgroundColor="#c0392b"' onmouseout='this.style.backgroundColor="#e74c3c"' id='joinRemote'>Katıl</button></div></div><div id="sessionPanel" style="display:none;margin: 1rem auto;max-width:19rem;padding:1.6rem;border-radius:.6rem;background-color:#333;color:#eee;font-family:'Open Sans',sans-serif;box-shadow:0 6px 12px rgba(0,0,0,.4)"><h2 style="text-align:center;margin-bottom:1.8rem;color:#2ecc71;text-transform:uppercase;letter-spacing:2px">Oturum Aktif</h2></div><script>function copyUserID() {const userIDInput = document.getElementById('currentUserID');userIDInput.removeAttribute('disabled');userIDInput.select();document.execCommand('copy');userIDInput.setAttribute('disabled', 'true');}</script>`;
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