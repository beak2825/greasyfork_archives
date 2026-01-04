// ==UserScript==
// @name         Squire Manager
// @version      0.2
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @namespace https://greasyfork.org/users/449752
// @downloadURL https://update.greasyfork.org/scripts/457822/Squire%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/457822/Squire%20Manager.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }

    let clowns = get("squires", {})


    if (location.href.includes("pl_info")) {
        let target = document.querySelectorAll("td[align=right]")[1].parentElement;
        let nickname = document.body.innerText.match(/([А-Яа-яёЁa-zA-Z0-9_*  -]+)  \[\d{1,3}]/)[1].trim()
        target.insertAdjacentHTML('afterend', `<tr><td id="clown-target" colspan="2" style="text-align: center;"></td></tr>`)
        if (!clowns[nickname]) {
            setClown(nickname)
        } else {
            removeClown(nickname)
        }
    }

    function setClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Любимый оруженосец</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = true
            set('squires', clowns)
            set("current_fav_squire", heroId)
            removeClown(heroId)
        })
    }

    function removeClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Убрать из оруженосцев</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = false
            set('squires', clowns)
            setClown(heroId)
        })
    }


    if (location.href.includes("inventory")) {
        unsafeWindow.getArtInfo1 = getArtInfo1

        let nickname = get("current_fav_squire", null)
        if (nickname != null && nickname in clowns) {
            $(`container_inventory_outside`).insertAdjacentHTML(`afterbegin`, `
                <select id="fav_squires" style="margin: 10px"></select>
            `)
            for (const [key, value] of Object.entries(clowns)) {
                $(`fav_squires`).insertAdjacentHTML("beforeend", `
                    <option value="${key}" ${nickname === key ? "selected" : ""}>${key}</option>
            `)
            }
            $(`fav_squires`).addEventListener("change", (e) => {
                nickname = e.target.value
                set("current_fav_squire", nickname)
            });
        }
        setInterval(main, 100)

        function main() {
            Array.from(document.getElementsByClassName(" inventory_item_div inventory_item2 ")).forEach((art, index) => {
                let id = art.id.match(/\d{1,3}/)
                let artInfo = arts[parseInt(id)]
                if (artInfo.durability1 !== 0 && artInfo.transfer_ok === 1) {
                    if (!art.querySelector(`#repair_${index}`)) {
                        art.insertAdjacentHTML("beforeend", `
                        <div class="inventory_item_nadet_button inv_item_select inv_item_select_return_small" id="repair_${index}" inv_idx="15" no_menu="1" style="display: block !important;">
                            <img no_menu="1" class="inv_100mwmh inv_item_select_img show_hint" onclick="getArtInfo1('${artInfo.id}');event.preventDefault();" hint="В ремонт!" src="https://dcdn.heroeswm.ru/i/inv_im/btn_art_transfer.png" hwm_hint_added="1">
                        </div>
                    `)
                    }
                }
            })
        }

        function getArtInfo1(artId) {
            sendToRepair(getRepairFormData(artId))
        }

        function sendToRepair(repairFormData) {
            let http = new XMLHttpRequest;
            http.open('POST', '/art_transfer.php', !0)
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            http.setRequestHeader('Content-Type', 'text/plain; charset=windows-1251')
            http.send(repairFormData);
            http.onload = () => {
                setTimeout(() => {
                    location.reload()
                }, 3000)
            }
        }

        function getRepairFormData(artId) {
            let formData = new FormData()
            formData.append('id', artId)
            formData.append('art_id', artId)
            formData.append('sendtype', "2")
            formData.append('dtime', "100")
            formData.append('bcount', "0")
            formData.append('gold', "0")
            formData.append('sign', unsafeWindow.sign)
            formData.append('nick', encode(nickname.replaceAll(" ", " ")))
            const data = [...formData.entries()];
            let str = data
                .map(x => `${x[0]}=${x[1]}`)
                .join('&')

            return str
        }
    }



    function $(id) {
        return document.querySelector(`#${id}`);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function encode(str) {
        let customEncode = (e) => {
            return "%" +
                (parseInt(e.charAt(1) + e.charAt(5), 16) + 16 * ((x) => -(2 * x ** 3) / 3 + 20 * x ** 2 - (595 * x) / 3 + 650)(parseInt(e.charAt(4), 16)).toFixed())
                    .toString(16)
        };
        return Array.from(str)
            .map(c => c.charCodeAt(0) >= 1040 && c.charCodeAt(0) <= 1103 ? customEncode(encodeURIComponent(c)) : encodeURIComponent(c))
            .join("")
    }
})(window);