// ==UserScript==
// @name         KİNG WHOWHERE V2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Garti.io da olan otaqları rahatlıqla izləmənizi təmin edər
// @author       KİNG
// @match        https://gartic.io/?king2
// @icon         data:image/gif;https://lh3.googleusercontent.com/a/ACg8ocI2MjKyE-4hqdU3u44cGzhdfkAW8I7JhUUAr1U0O6JFAB8Pqg4r=s300
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510678/K%C4%B0NG%20WHOWHERE%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/510678/K%C4%B0NG%20WHOWHERE%20V2.meta.js
// ==/UserScript==

if (window.location.href.indexOf("?king2") !== -1) {
    let leftContent = document.createElement("div");
    leftContent.setAttribute("style", "position:fixed; top:0; left:0; width:30%; height:100vh; background:#111; border-right:5px solid silver; padding:10px; box-sizing:border-box; overflow-y:auto; color:#f1f1f1; z-index:9999;");
    leftContent.classList.add("leftcontent");

    let rightContent = document.createElement("div");
    rightContent.setAttribute("style", "position:fixed; top:0; left:30%; width:70%; height:100vh; background:#111; padding:10px; box-sizing:border-box; z-index:9999;");
    rightContent.classList.add("rightcontent");

    let header = `<div style="background-color:#000; color:#FFD700; padding:10px; text-align:center; font-weight:bold;">Developer by King</div>`;
    let iframeBorderStyle = "border:5px solid gold;";
    let headerIframe = `<div style="text-align:center; color:blue; font-weight:bold; margin-bottom:10px;">WhoWhere by King</div>`;

    let themeSelect = `
        <select style='width:100%; padding:10px; margin-bottom:10px; background:#333; color:#f1f1f1; border-radius:5px;' onchange='window.refreshrooms()' class='themeselect'>
            <option value="">Tema Seç</option>
            <option value="&subject[]=1">Ümumi</option>
            <option value="&subject[]=2">Heyvanlar</option>
            <option value="&subject[]=3">Obyektlər</option>
            <option value="&subject[]=4">Yeməklər</option>
            <option value="&subject[]=5">Feillər</option>
            <option value="&subject[]=6">Peşələr</option>
            <option value="&subject[]=7">Pokemon</option>
            <option value="&subject[]=8">Filmlər</option>
            <option value="&subject[]=9">Cizgi Filmləri</option>
            <option value="&subject[]=10">Mahnılar</option>
            <option value="&subject[]=11">LoL</option>
            <option value="&subject[]=12">Oyunlar</option>
            <option value="&subject[]=13">Məşhurlar</option>
            <option value="&subject[]=14">Marvel / DC</option>
            <option value="&subject[]=15">TV serialları</option>
            <option value="&subject[]=16">Bayraqlar</option>
            <option value="&subject[]=17">Futbol</option>
            <option value="&subject[]=18">Harry Potter</option>
            <option value="&subject[]=19">Clash Royale</option>
            <option value="&subject[]=20">Lord of Rings</option>
            <option value="&subject[]=21">Game of Thrones</option>
            <option value="&subject[]=22">Dragon Ball</option>
            <option value="&subject[]=23">Dota</option>
            <option value="&subject[]=24">Youtuberlər</option>
            <option value="&subject[]=25">Yayımçılar</option>
            <option value="&subject[]=26">Loqo</option>
            <option value="&subject[]=27">Qruplar</option>
            <option value="&subject[]=28">Animelər</option>
            <option value="&subject[]=29">İdman</option>
            <option value="&subject[]=30">Başqaları / Ümumi</option>
            <option value="&subject[]=31">Minecraft</option>
            <option value="&subject[]=32">Fortnite</option>
            <option value="&subject[]=33">FNAF</option>
            <option value="&subject[]=34">Star Wars</option>
            <option value="&subject[]=35">Naruto</option>
            <option value="&subject[]=36">The Sims</option>
            <option value="&subject[]=37">Hallowem</option>
            <option value="&subject[]=38">Anorma Tema</option>
        </select>`;

    let searchInput = "<input type='text' style='width:100%; padding:10px; margin-bottom:10px; background:#333; color:#f1f1f1; border-radius:5px;' placeholder='Otaq axtar' oninput='window.refreshrooms(this.value)' class='searchparam' />";
    let roomList = "<div class='rooms' style='overflow-y:scroll; height:80%;'></div>";

    leftContent.innerHTML = themeSelect + searchInput + roomList;
    document.body.appendChild(leftContent);
    document.body.appendChild(rightContent);

    function _(x) { return document.querySelector(x); }
    function _a(x) { return document.querySelectorAll(x); }

    window.filterRooms = (rooms, search) => {
        return rooms.filter(room => room.code.toLowerCase().includes(search.toLowerCase()));
    }

    window.refreshrooms = (search = "") => {
        const themeValue = _(".themeselect").value;
        fetch("https://gartic.io/req/list?search=" + search + "&language[]=23" + themeValue).then(response => response.json()).then(data => {
            let roomdatas = window.filterRooms(data, search);

            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            let favoriteRooms = roomdatas.filter(room => favorites.includes(room.code));
            let otherRooms = roomdatas.filter(room => !favorites.includes(room.code));

            _(".rooms").innerHTML = "";

            const createRoomElement = (room) => `
                <div class="room" style="position:relative; display:flex; flex-direction:column; background:#222; font-size:11pt; color:#f1f1f1; border-radius:20px; margin-top:10px; padding:20px; font-weight:bold; cursor:pointer;" onclick='window.openInIframe("https://gartic.io/${room.code}/viewer", "${room.code}")' data-code="${room.code}">
                    <img class="roomico" src="https://gartic.io/static/images/subjects/${room.subject}.svg" style="width:40px; height:40px; margin-right:10px;" />
                    <div class="roominfo">#${room.code.slice(-3)} ${room.quant}/${room.max}</div>
                    <input type="checkbox" id="favorite-${room.code}" style="position:absolute; top:10px; right:10px;" ${favorites.includes(room.code) ? 'checked' : ''} title="Sevimli olaraq seç" onclick='window.toggleFavorite("${room.code}", event)'/>
                    <button style="position:absolute; bottom:10px; right:10px; padding:5px 10px; background:red; color:black; border:none; border-radius:5px; cursor:pointer;" onclick='window.openRoom("${room.code}", event)'>►</button>
                </div>`;

            _(".rooms").innerHTML += favoriteRooms.map(createRoomElement).join('');
            _(".rooms").innerHTML += otherRooms.map(createRoomElement).join('');
        });
    }

    window.openInIframe = (url, roomCode) => {
        _(".rightcontent").innerHTML = `${headerIframe}<iframe src="${url}" style="width:100%; height:90%; border:none; border-radius:20px; box-shadow:10px 10px 10px black; ${iframeBorderStyle}"></iframe>`;
        document.querySelectorAll('.room .watching-indicator').forEach(el => el.remove());
        const roomElement = document.querySelector(`.room[data-code="${roomCode}"]`);
        if (roomElement) {
            roomElement.insertAdjacentHTML('beforeend', '<div class="watching-indicator" style="color: gold; margin-top: 10px;">Otaq İzlənilir</div>');
        }
    }

    window.openRoom = (roomCode, event) => {
        event.stopPropagation();
        window.open(`https://gartic.io/${roomCode}`, '_blank');
    }

    window.toggleFavorite = (roomCode, event) => {
        event.stopPropagation();
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(roomCode)) {
            favorites = favorites.filter(code => code !== roomCode);
            _(`#favorite-${roomCode}`).checked = false;
        } else {
            favorites.push(roomCode);
            _(`#favorite-${roomCode}`).checked = true;
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.refreshrooms();
    }

    window.addEventListener('load', () => {
        window.refreshrooms();
    });
}
