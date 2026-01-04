// ==UserScript==
// @name         57575757 WHOWHERE  Gartic.io 02-07-2024
// @name:en      57575757 WHOWHERE  Gartic.io 02-07-2024
// @version      1.1
// @description  Arkadaşlarınızın hangi Gartic.io odalarında olduğunu anında görün, doğrudan katılın veya izleyin! Kullanıcı arama, favori oyuncu listesi, filtreleme ve daha fazlasıyla oyun deneyiminizi zenginleştirin. Eklentiyi çalıştırmak için https://gartic.io/?fako adresini ziyaret edin.
// @description:en Instantly see which Gartic.io rooms your friends are in, join or spectate directly! Enhance your gameplay with user search, favorite player list, filtering, and much more. To activate the extension, visit https://gartic.io/?fako.
// @author       57575757
// @match        gartic.io/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😆</text></svg>
// @grant        none
// @namespace    57575757whowhere
// @downloadURL https://update.greasyfork.org/scripts/523130/57575757%20WHOWHERE%20%20Garticio%2002-07-2024.user.js
// @updateURL https://update.greasyfork.org/scripts/523130/57575757%20WHOWHERE%20%20Garticio%2002-07-2024.meta.js
// ==/UserScript==

if (window.location.href.indexOf("?57575757") != -1) {
    window.lang = window.location.href.indexOf("&lang=") != -1 ? window.location.href.split("&lang=")[1] : 8;
    document.body.classList.add("57575757-viewer");

    document.body.innerHTML = `
        <div class="kullanicilar-container">
            <h1 class="57575757_logo">57575757 WHOWHERE <span id="online">Online: <b>0</b><span></h1>
            <div class="arama-alani">
                <input type="text" id="searchInput" placeholder="Kullanıcı ara" class="search-input">
                <button id="yenile"><i class="gg-redo"></i></button>
            </div>
            <div class="57575757_filter">
                <label for="fotografli">
                    <input type="checkbox" id="fotografli"> Fotoğraflı
                </label>
                <label for="fotografsiz">
                    <input type="checkbox" id="fotografsiz"> Fotoğrafsız
                </label>
                <label for="userlar">
                    <input type="checkbox" id="userlar"> User Gizle
                </label>
                <label for="favoriler">
                    <input type="checkbox" id="favoriler"> Favoriler
                </label>
            </div>
            <div class="kullanicilar"></div>
        </div>`;

    let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
    let oyuncular = [];
    let filtreler = {
        fotografli: localStorage.getItem('fotografli') === 'true',
        fotografsiz: localStorage.getItem('fotografsiz') === 'true',
        userlar: localStorage.getItem('userlar') === 'true',
        favoriler: localStorage.getItem('favorilerGoster') === 'true'
    };

    document.getElementById('fotografli').checked = filtreler.fotografli;
    document.getElementById('fotografsiz').checked = filtreler.fotografsiz;
    document.getElementById('userlar').checked = filtreler.userlar;
    document.getElementById('favoriler').checked = filtreler.favoriler;

    function kullanicilariGuncelle() {
        const searchValue = document.getElementById("searchInput").value.toLowerCase();
        document.querySelector(".kullanicilar").innerHTML = "";
        let filteredPlayers = oyuncular.filter(oyuncu => {
            if (filtreler.fotografli && !oyuncu.foto) return false;
            if (filtreler.fotografsiz && oyuncu.foto) return false;
            if (filtreler.userlar && oyuncu.nick.toLowerCase().includes('user')) return false;
            if (filtreler.favoriler && !favoriler.includes(oyuncu.id)) return false;
            if (!oyuncu.nick.toLowerCase().includes(searchValue)) return false;
            return true;
        });

        filteredPlayers.sort((a, b) => {
            const aFavori = favoriler.includes(a.id);
            const bFavori = favoriler.includes(b.id);
            if (aFavori && !bFavori) return -1;
            if (!aFavori && bFavori) return 1;
            return 0;
        });

        filteredPlayers.forEach(oyuncu => {
            const isFavori = favoriler.includes(oyuncu.id);
            const oyuncuDivi = `
                <div class="oyuncu ${isFavori ? 'favori' : ''}" data-id="${oyuncu.id}">
                    <div class="gg-heart ${isFavori ? 'activex' : ''}"></div>
                    <a href="${oyuncu.foto || 'https://gartic.io/static/images/avatar/svg/' + oyuncu.avatar + '.svg'}">
                        <img src="${oyuncu.foto || 'https://gartic.io/static/images/avatar/svg/' + oyuncu.avatar + '.svg'}">
                    </a>
                    <div class="oyuncu-text">
                        <b>${oyuncu.nick}</b>
                        <i>ID: ${oyuncu.id}</i>
                        <span>ODA: ${oyuncu.odasi.slice(18)}</span>
                        <div class="linkler">
                            <a target="_blank" class="oyuncu-link" href="${oyuncu.odasi}">ODAYA GİR</a>
                            <a target="_blank" class="oyuncu-link" href="${oyuncu.odasi}/viewer">İZLE</a>
                        </div>
                    </div>
                </div>`;
            document.querySelector(".kullanicilar").innerHTML += oyuncuDivi;
        });

        document.getElementById("online").querySelector("b").textContent = filteredPlayers.length;

        document.querySelectorAll('.gg-heart').forEach(button => {
            button.addEventListener('click', (e) => {
                const oyuncuDiv = e.target.closest('.oyuncu');
                const oyuncuId = oyuncuDiv.getAttribute('data-id');
                if (favoriler.includes(oyuncuId)) {
                    favoriler = favoriler.filter(id => id !== oyuncuId);
                    e.target.classList.remove('activex');
                    oyuncuDiv.classList.remove('favori');
                } else {
                    favoriler.push(oyuncuId);
                    e.target.classList.add('activex');
                    oyuncuDiv.classList.add('favori');
                }
                localStorage.setItem('favoriler', JSON.stringify(favoriler));
                kullanicilariGuncelle();
            });
        });
    }

    function sunucuKontrol(sunucuNo, odaKodu) {
        let ws = new WebSocket(`wss://server0${sunucuNo}.gartic.io/socket.io/?EIO=3&transport=websocket`);
        ws.onopen = () => ws.send(`42[12,{"v":20000,"platform":0,"sala":"${odaKodu.slice(-4)}"}]`);
        ws.onmessage = (mesaj) => {
            if (mesaj.data[4] == "5") {
                let veri = JSON.parse(mesaj.data.slice(2));
                if (veri[0] == 5) {
                    veri[5].forEach(oyuncu => {
                        oyuncular.push({
                            "puan": oyuncu.pontos,
                            "zafer": oyuncu.vitorias,
                            "id": oyuncu.id.toString(),
                            "avatar": oyuncu.avatar,
                            "odasi": `https://gartic.io/${odaKodu}`,
                            "nick": oyuncu.nick,
                            "foto": oyuncu.foto
                        });
                    });
                    kullanicilariGuncelle();
                    ws.close();
                }
            }
        }
    }

    function veriCek(odaKodu) {
        for (let i = 1; i <= 6; i++) {
            sunucuKontrol(i, odaKodu);
        }
    }

    fetch(`https://gartic.io/req/list?search=&language[]=${window.lang}`)
        .then(yanit => yanit.json())
        .then(veri => {
            oyuncular = [];
            veri.forEach(oda => {
                if (oda.quant > 0) {
                    veriCek(oda.code);
                }
            });
        });

    document.getElementById("searchInput").addEventListener("input", kullanicilariGuncelle);
    document.getElementById("yenile").addEventListener("click", () => {
        fetch(`https://gartic.io/req/list?search=&language[]=${window.lang}`)
            .then(yanit => yanit.json())
            .then(veri => {
                oyuncular = [];
                veri.forEach(oda => {
                    if (oda.quant > 0) {
                        veriCek(oda.code);
                    }
                });
            });
    });

    const filters = ['fotografli', 'fotografsiz', 'userlar', 'favoriler'];
    filters.forEach(filter => {
        document.getElementById(filter).addEventListener('change', (e) => {
            filtreler[filter] = e.target.checked;
            localStorage.setItem(filter, e.target.checked);
            setTimeout(kullanicilariGuncelle, 15);
        });
    });

    const style = document.createElement('style');
    style.innerHTML = `
.fako-viewer {
	background: #111620;
	color: white;
	font-family: Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	background: rgb(17, 22, 32);
	background: linear-gradient(177deg, rgba(17, 22, 32, 1) 24%, rgba(38, 55, 89, 1) 82%);
}

.kullanicilar-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	overflow-y: auto;
	padding: 15px;
}

.search-input {
	margin: 10px;
	padding: 10px;
	font-size: 18px;
	border: 1px solid #ccc;
	border-radius: 5px;
	width: 100%;
	max-width: 500px;
}

.kullanicilar {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	width: 100%;
	gap: 8px;
}

.oyuncu {
	border: 1px solid #555;
	display: flex;
	align-items: center;
	background-color: #19233491;
	color: white;
	flex: 1 1 calc(25% - 20px);
	box-sizing: border-box;
	max-width: 200px;
	transition: 300ms all;
	position: relative;
	border-radius: 5px 18px 5px 5px;
}

.oyuncu:hover {
	background-color: #31528bcf;
	border: 1px solid #c4c4c4;
	transition: 300ms all;
}

.oyuncu img {
	width: 60px;
	height: 60px;
	object-fit: cover;
	border-radius: 50%;
	border: 2px solid #ddd;
	margin-right: 10px;
	margin-left: 5px;
	margin-top: 4px;
	margin-bottom: 2px;
	transition: 300ms all;
}

.arama-alani {
	display: flex;
}

/*
.oyuncu img:hover {
	transform: scale(2);
	transition: 300ms all;
}
*/
.oyuncu-text {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}

.oyuncu b,
.oyuncu i,
.oyuncu span {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 13px;
	margin-top: 2px;
	margin-bottom: 2px;
}

.oyuncu i {
	font-size: 12px;
}

.linkler {
	display: flex;
	gap: 10px;
	align-items: center;
	font-size: 12px;
	font-weight: normal;
}

.oyuncu-link {
	color: #24ccff;
	text-decoration: none;
	font-weight: bold;
	  margin-top: 2px;
}

#searchInput {
	background: #3d2aa3;
	border: solid 1px #405d60;
	color: #fff;
	outline: none;
	display: flex;
	margin-top: 5px;
	padding: 10px;
	max-width: 280px;
}

.fako_filter {
	display: flex;
	gap: 5px;
	margin-bottom: 15px;
	margin-top: 5px;
}

.fako_filter label {
	border: solid 1px #2c279a;
	border-radius: 5px;
	padding: 8px 8px;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.fako_filter label:has(input[type="checkbox"]:checked) {
	background-color: #2551a2;
}

.fako_logo {
	font-size: 18px;
	background: linear-gradient( to right, hsl(320.6, 100%, 56.1%), hsl(204 100% 59%));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-align: center;
	margin-bottom: 5px;
}




@media (max-width: 768px) {
	.oyuncu {
		flex: 1 1 calc(50% - 20px);
	}
	.fako_filter {
		padding: 0px 10px;
		flex-wrap: wrap;
		justify-content: space-around;
		gap: 8px;
	}

	.fako_filter label {
		flex: 1 1 38%;
		text-align: center;
	}
}

@media (max-width: 480px) {
	.oyuncu {
		flex: 1 1 100%;
		max-width: 46%;
	}
}

#yenile {
	background: #2551a2;
	color: #fff;
	margin-top: 5px;
	padding: 10px 15px;
	height: 46px;
	border-radius: 6px;
}



.gg-redo {
	box-sizing: border-box;
	position: relative;
	display: block;
	transform: scale(var(--ggs, 1.3));
	width: 14px;
	height: 14px;
	border: 2px solid;
	border-right-color: transparent;
	border-radius: 100px
}
.gg-redo::before {
	content: "";
	display: block;
	box-sizing: border-box;
	position: absolute;
	width: 6px;
	height: 6px;
	border-top: 2px solid;
	border-right: 2px solid;
	top: -3px;
	right: -1px;
	transform: rotate(68deg)
}


.gg-heart,
.gg-heart::after {
	cursor: pointer;
	border: 2px solid;
	border-top-left-radius: 100px;
	border-top-right-radius: 100px;
	width: 10px;
	height: 8px;
	border-bottom: 0
}
.gg-heart {
	box-sizing: border-box;
	transform: translate( calc(-10px / 2 * var(--ggs, 1)),
	calc(-6px / 2 * var(--ggs, 1))) rotate(-45deg) scale(var(--ggs, 1.3));
	display: block;
	top: -3px;
	right: -3px;
	position: absolute;
	color: #e6e6e6;
}
.gg-heart::after,
.gg-heart::before {
	content: "";
	display: block;
	box-sizing: border-box;
	position: absolute
}
.gg-heart::after {
	right: -9px;
	transform: rotate(90deg);
	top: 5px
}
.gg-heart::before {
	width: 11px;
	height: 11px;
	border-left: 2px solid;
	border-bottom: 2px solid;
	left: -2px;
	top: 3px
}

.gg-heart.activex {
	color: #FF3366;
	border-color: #FF3366;
	background: #FF9CB5;
}

.gg-heart.activex::after,
.gg-heart.activex::before {
	color: #FF3366;
	background: #FF3366;
	border-color: #FF3366;
}

.gg-heart:hover {
	color: #FF3366;
	background: #FF3366;
	border-color: #FF3366;
}

.gg-heart:hover::after,
.gg-heart:hover::before {
	color: #FF3366;
	background: #FF3366;
	border-color: #FF3366;
}
    `;
    document.head.appendChild(style);

}