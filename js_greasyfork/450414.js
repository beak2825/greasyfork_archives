// ==UserScript==
// @name         SmithManager
// @version      0.2
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(inventory|pl_info).+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @namespace https://greasyfork.org/users/449752
// @downloadURL https://update.greasyfork.org/scripts/450414/SmithManager.user.js
// @updateURL https://update.greasyfork.org/scripts/450414/SmithManager.meta.js
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


    let my_sign = get("my_sign", null)
    if (my_sign == null) {
        alert("Set sign")
    }

    if (location.href.includes("pl_info")) {
        let smiths = get("fav_smiths", {})
        let target = document.querySelectorAll("td[align=right]")[1].parentElement;
        let nickname = document.body.innerText.match(/([А-Яа-яёЁa-zA-Z0-9_*  -]+)  \[\d{1,3}]/)[1].trim()
        target.insertAdjacentHTML('afterend', `<tr><td id="smith-target" colspan="2" style="text-align: center;"></td></tr>`)
        if (!(nickname in smiths)) {
            smith1()
        } else {
            smith3()
        }

        function smith1() {
            $('smith-target').innerHTML = `
              <span id="smith-1">Любимый кузнец?</span>
              <span>%<input id="smith-percent" type="text" style="width: 30px"><button id="smith-2">OK</button></span>
            `
            $('smith-2').addEventListener('click', e => {
                processSmith2()
            })
            $('smith-percent').addEventListener('keyup', e => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    processSmith2()
                }
            })
        }

        function processSmith2() {
            let inputValue = $('smith-percent').value - 0
            if (!isNaN(inputValue)) {
                if (inputValue > 0) {
                    if(!(nickname in smiths)) {
                        smiths[nickname] = {}
                    }
                    smiths[nickname]["percent"] = inputValue
                    set("fav_smiths", smiths)
                    set("current_fav_smith", nickname)
                    smith3()
                } else {
                    delete smiths[nickname]
                    set("fav_smiths", smiths)
                    smith1()
                }
            }
        }

        function smith3() {
            $('smith-target').innerHTML = `
              <span style=" position: relative">Любимый кузнец ${smiths[nickname]["percent"]}%</span>
             <img id="smith-3" style="cursor: pointer;" src="https://webstockreview.net/images250_/how-to-edit-png-images.png" height="16" alt="" title="Edit">`
            $('smith-3').addEventListener('click', e => {
                smith1()
            })
        }
    }

    if (location.href.includes("inventory")) {
        unsafeWindow.getArtInfo = getArtInfo

        let nickname = get("current_fav_smith", null)
        let smiths = get("fav_smiths", {})
        if (nickname != null && nickname in smiths) {
            $(`container_inventory_outside`).insertAdjacentHTML(`afterbegin`, `
                <select id="fav_smiths" style="margin: 10px"></select>
            `)
            for (const [key, value] of Object.entries(smiths)) {
                $(`fav_smiths`).insertAdjacentHTML("beforeend", `
                    <option value="${key}" ${nickname === key ? "selected" : ""}>${key} ${value["percent"]}%</option>
            `)
            }
            $(`fav_smiths`).addEventListener("change", (e) => {
                nickname = e.target.value
                set("current_fav_smith", nickname)
            });
        }
        setInterval(main, 100)

        function main() {
            Array.from(document.getElementsByClassName(" inventory_item_div inventory_item2 ")).forEach((art, index) => {
                let id = art.id.match(/\d{1,3}/)
                let artInfo = arts[parseInt(id)]
                if (artInfo.durability1 === 0 && artInfo.transfer_ok === 1) {
                    if (!art.querySelector(`#repair_${index}`)) {
                        art.insertAdjacentHTML("beforeend", `
                        <div class="inventory_item_nadet_button inv_item_select inv_item_select_return_small" id="repair_${index}" inv_idx="15" no_menu="1" style="display: block !important;">
                            <img no_menu="1" class="inv_100mwmh inv_item_select_img show_hint" onclick="getArtInfo('${artInfo.art_id}', '${artInfo.id}');event.preventDefault();" hint="В ремонт!" src="https://dcdn.heroeswm.ru/i/inv_im/btn_blacksmith.png" hwm_hint_added="1">
                        </div>
                    `)
                    }
                }
            })
        }

        function getArtInfo(link, artId) {
            fetch("/art_info.php?id=" + link)
                .then(res => res.text())
                .then(data => {
                    sendToRepair(getRepairFormData(findRepairPrice(new DOMParser().parseFromString(data, "text/html")), artId))
                })
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

        function findRepairPrice(doc) {
            return Array.from(doc
                .querySelectorAll('[src*="gold.png"]')).slice(-1)[0]
                .parentNode
                .nextSibling
                .innerText
                .replaceAll(",", "") - 0
        }

        function getRepairFormData(repairPrice, artId) {
            let formData = new FormData()
            formData.append('id', artId)
            formData.append('art_id', artId)
            formData.append('sendtype', "5")
            formData.append('dtime', "0")
            formData.append('bcount', "0")
            formData.append('rep_price', Math.ceil(repairPrice * smiths[nickname]["percent"] / 100 + 1).toString())
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