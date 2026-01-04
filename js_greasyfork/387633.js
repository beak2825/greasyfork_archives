// ==UserScript==
// @name         2GIS phone number copier
// @namespace    http://2gis.ru/
// @license MIT
// @version      0.5.0
// @description  2GIS mobile phone number copier allow you to copy any Russian mobile phone number to your device"s clipboard
// @author       Kenya-West
// @include      https://2gis.ru/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/387633/2GIS%20phone%20number%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/387633/2GIS%20phone%20number%20copier.meta.js
// ==/UserScript==

// store url on load
let currentPage = location.href;
let recordList = getFromGM("recordList");
let tableMode = recordList.length ? true : false;
urlCheckCounter = 0;

// listen for changes
setInterval(function()
{
    if (currentPage !== location.href || urlCheckCounter === 0)
    {
        // page has changed, set new page as "current"
        currentPage = location.href;

        main();
    }
    urlCheckCounter++;
}, 175);

function main() {

    // Grand-parent for parentElems
    const phoneContainer = document.querySelector("._172gbf8:has(>._49kxlr>._b0ke8)");
    // Parents for hrefs
    const phoneContainerChild = document.querySelector("._172gbf8 ._49kxlr:has(>._b0ke8)");

    //
    // INIT FUNCTION SET
    //

    if (expandTels()) {
        placeTableMode();
        addListenersOnRender();
        setTimeout(() => {
            placeIcons();
        }, 100);
        // placeIcons(elemsMedia, parentElemsMedia, parentHrefsMedia, numberLinkMedia);
    }

    /**
     * Expands "Показать телефоны" button
     *
     * The top-level checking function
     *
     * @returns `boolean`
     */
    function expandTels() {
        const event = new Event("click", {bubbles: true})

        const expandElem = document.querySelector("._1ns0i7c");

        if (expandElem) {
            expandElem.dispatchEvent(event);
            return true;
        } else {
            return false;
        }
    }

    //
    // PLACE FUNCTION SET
    //

    function placeIcons() {
        // Parents for hrefs
        const parents = document.querySelectorAll("._49kxlr > ._b0ke8");
        // Parent elements a[href] that are parents for elems
        const hrefs = document.querySelectorAll("._49kxlr > ._b0ke8 > a");
        // Number link like `tel:` containing number. Usually it"s the hrefs[index]
        const telLink = document.querySelectorAll("._49kxlr ._b0ke8 > a");
        // Elements that contain phone number in innerText
        const elems = document.querySelectorAll("._49kxlr > ._b0ke8 > a");

        elems.forEach((element, index) => {

            let whatsappLink = preparePhoneNumber(telLink[index].href, index);
            let phoneLink = preparePhoneNumber(telLink[index].href, index);
            let phoneNumber = preparePhoneNumber(telLink[index].href, index);

            if (whatsappLink && !parents[index].getAttribute("whatsapp-linked")) {
                let whatsapp = "https://wa.me/" + whatsappLink;
                let button = prepareWhatsappButton(whatsapp, index);
                parents[index].insertBefore(button, hrefs[index]);
                parents[index].setAttribute("whatsapp-linked", true);
                storePhoneOrLink("whatsappLink", whatsapp);
            }
            if (phoneLink) {
                let phone = "tel:+" + phoneLink;
            }
            if (phoneNumber && !parents[index].getAttribute("phone-linked")) {
                let phone = `+${phoneNumber[0]} ${phoneNumber[1]}${phoneNumber[2]}${phoneNumber[3]} ${phoneNumber[4]}${phoneNumber[5]}${phoneNumber[6]}-${phoneNumber[7]}${phoneNumber[8]}-${phoneNumber[9]}${phoneNumber[10]}`
                let button = preparePhoneButton(phone, index);
                parents[index].insertBefore(button, hrefs[index]);
                parents[index].setAttribute("phone-linked", true);
                storePhoneOrLink("phone", phone);
            }

            updateState();
        });

    }

    function placeCounter() {
        let counter = prepareCounter();

        if(counter) {
            // let element = prepareCounter();
            phoneContainerChild.appendChild(counter);
        }

        updateState();
    }

    function placeTableMode() {
        let tableModeButton = prepareTableModeButton();
        phoneContainerChild.appendChild(tableModeButton);

        tableModeCheckbox.checked = tableMode;
    }

    function tableAddRemoveButtonManager(value) {
        if (value) {
            placeTableAddRemoveButton();
        } else {
            removeTableAddRemoveButton();
        }
    }
    function placeTableAddRemoveButton() {
        const host = phoneContainerChild.querySelector("#tableModeAddRemoveButtonHost");

        if (!host) {
            let tableModeAddRemoveButton = prepareTableModeAddRemoveButton();
            phoneContainerChild.appendChild(tableModeAddRemoveButton);

            phoneContainer.querySelector("#tableModeAddRemoveButton").addEventListener("click", (element) => {
                pushOrRemoveRecord();
            })
        }
    }
    function removeTableAddRemoveButton() {
        const elem = phoneContainerChild.querySelector("#tableModeAddRemoveButtonHost");

        if (elem) {
            elem.parentNode.removeChild(elem)
        }
    }

    function tableCopyButtonManager(value) {
        if (value) {
            placeTableCopyButton();
        } else {
            removeTableCopyButton();
        }
    }
    function placeTableCopyButton() {
        const host = phoneContainerChild.querySelector("#tableCopyButtonHost");

        if (!host) {
            let tableCopyButton = prepareTableCopyButton();
            phoneContainerChild.appendChild(tableCopyButton);

            phoneContainer.querySelector("#tableCopyButton").addEventListener("click", (element) => {
                copyTable();
            })
        }
    }
    function removeTableCopyButton() {
        const elem = phoneContainerChild.querySelector("#tableCopyButtonHost");

        if (elem) {
            elem.parentNode.removeChild(elem)
        }
    }

    function placeTable() {
        const data = recordList;

        // {
        //             id: firmId ?? recordList.length,
        //             name: firmName,
        //             shortUrl: value.shorturl ?? "",
        //             fullUrl: location.href,
        //             phones: [...getPhonesOrLinks("phone")],
        //             whatsappLinks: [...getPhonesOrLinks("whatsappLink")]
        //         }

        phoneContainer.insertAdjacentHTML(
            `beforeend`,
            `
        <table id="contactsTable" bordercolor="gray" border="2">
        <thead>
            <tr>
            <th>📄 Название</th>
            <th>📞 Номер</th>
            <th>🔗 Ссылка</th>
            <th>💭 Комментарий</th>
            </tr>
        </thead>
        <tbody>
            ${[...data]
            .map(
                (_, i) => `<tr>${[...Array(4)]
                .map(
                    (_, j) =>
                    {
                        if (j===1) { return `<td><a href="${data[i].shortUrl ?? data[i].fullUrl}">${data[i].name}</a></td>`}
                        if (j===2) { return `<td>${data[i].phones.map((_, k) => {
                            return `${_}<br>`
                        }).join("")}</td>`}
                        if (j===3) { return `<td>${data[i].whatsappLinks.map((_, k) => {
                            return `<a href="${_}">${_}</a><br>`
                        }).join("")}</td>`}
                        if (j===4) { return `<td></td>`}
                    }
                )
                .join("")}
            </tr>`
            )
            .join("")}
        </tbody>
        </table>
        `
        );
    }
    function removeTable() {
        const elem = phoneContainer.querySelector("#contactsTable");
        elem.parentNode.removeChild(elem);
    }

    //
    // PREPARE FUNCTION SET
    //

    function preparePhoneNumber(phone, index) {
        const regex = /79\d+/;
        if (regex.test(phone)) {
            let result = regex.exec(phone);
            if (result[0].length < 11) {
                return null;
            }
            return result[0]
        } else { return null }
    }

    function prepareWhatsappButton(whatsappLink, index) {
        const button = document.createElement("img");
        button.id = "whatsappLink" + index;
        button.src = "https://upload.wikimedia.org/wikipedia/commons/1/19/WhatsApp_logo-color-vertical.svg";
        button.style.width = "18px";
        button.style.height = "18px";
        button.style.display = "inline-block";
        button.style.cursor = "pointer";
        button.style.marginRight = "5px";
        button.setAttribute("whatsapp-link", whatsappLink);
        button.addEventListener("click", (element) => {
            if (element.target && element.target.id === button.id) {
                GM_setClipboard(whatsappLink);
                element.toElement.style.backgroundImage = "green";
                window.setTimeout(() => {
                    element.toElement.style.backgroundImage = "none";
                }, 1000);
            }
        });
        return button;
    }
    function preparePhoneButton(phone, index) {
        const button = document.createElement("img");
        button.id = "phone" + index;
        button.src = "https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg";
        button.style.width = "18px";
        button.style.height = "18px";
        button.style.display = "inline-block";
        button.style.cursor = "pointer";
        button.style.marginRight = "5px";
        button.setAttribute("phone", phone);
        button.style.tra
        button.addEventListener("click", (element) => {
            if (element.target && element.target.id === button.id) {
                GM_setClipboard(phone);
                element.toElement.style.backgroundImage = "green";
                window.setTimeout(() => {
                    element.toElement.style.backgroundImage = "none";
                }, 1000);
            }
        });
        return button;
    }

    function prepareTableModeButton() {
        let innerHTML = `<ul>
    <li class="_gyromm" id="tableMode">
      <label class="_vvxysz1" title="Режим таблицы"
        ><div class="_okzfjf">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="black">
            <path d="M19 18V6H5v15a5 5 0 0 0 5 5h12a5 5 0 0 0 5-5v-3zm-6 3a3 3 0 0 1-6 0V8h10v10h-4zm12 0a3 3 0 0 1-3 3h-8a5 5 0 0 0 1-3v-1h10z"></path>
            <path d="M9 10h6v2H9zM9 14h4v2H9z"></path>
          </svg>
        </div>
        <input id="tableModeCheckbox" class="_1u9fru1" type="checkbox" value=0 /><span
          class="_1iurgbx"
          >Режим таблицы</span
        ></label
      >
    </li>
</ul>
`
        const button = document.createElement("div");
        button.classList.add("_b0ke8");
        button.innerHTML = innerHTML;
        return button;
    }

    function prepareTableModeAddRemoveButton() {
        let innerHTML = `<div class="_rtsy3" id="tableModeAddRemoveButtonHost" >
  <div class="_jro6t0">
    <div class="_11pijuk">
      <button id="tableModeAddRemoveButton" class="_1uwefnfu" type="button">Добавить</button>
    </div>
  </div>
</div>
`
        const button = document.createElement("div");
        button.innerHTML = innerHTML;
        return button;
    }

    function prepareTableCopyButton() {
        let innerHTML = `<div class="_rtsy3" id="tableCopyButtonHost" >
  <div class="_jro6t0">
    <div class="_11pijuk">
      <button id="tableCopyButton" class="_1uwefnfu" style="background-color: #f2f2f2;color: black;margin-top: 5px;" type="button">Копировать</button>
    </div>
  </div>
</div>
`
        const button = document.createElement("div");
        button.innerHTML = innerHTML;
        return button;
    }

    function prepareCounter() {
        const counter = document.createElement("div");
        counter.classList.add("_b0ke8");
        counter.setAttribute("id", "recordListCounter");
        return counter;
    }

    //
    // LISTENERS AND SERVICES
    //

    function updateState() {
        updateCounter();
        changeTableModeAddRemoveButtonState(phoneContainerChild.querySelector("#tableModeAddRemoveButton"));
        storeValue("recordList", recordList);
        tableModeValueChangeHandler(tableMode);
        tableAddRemoveButtonManager(tableMode);
        tableCopyButtonManager(recordList.length > 0);
    }

    function updateCounter() {
        const counter = phoneContainer.querySelector("#recordListCounter");
        if (counter) {
            counter.innerText = `Количество материалов: ${recordList.length}`;

            if (!tableMode) {
                counter.parentNode.removeChild(counter)
            }
        } else if (!counter && tableMode) {
            placeCounter();
        }

    }

    function changeTableModeAddRemoveButtonState(elem) {
        const firmId = /firm\/(\d+)/gi.exec(location.href)[1];
        if (phoneContainerChild.querySelector("#tableModeAddRemoveButtonHost")) {
            if (recordList.find((record) => record.id === firmId)) {
                elem.textContent = "Удалить";
                elem.style.backgroundColor = "#299400";
                elem.style.color = "white";
            } else {
                elem.textContent = "Добавить";
                elem.style.backgroundColor = "#f2f2f2";
                elem.style.color = "black";
            }
        }
    }

    function addListenersOnRender() {
        const tableModeHost = phoneContainer.querySelector("#tableMode");
        const tableModeCheckbox = phoneContainer.querySelector("#tableModeCheckbox");

        if (tableModeHost) {
            tableModeHost.addEventListener("click", (element) => {
                    tableModeCheckbox.checked = !tableModeCheckbox.checked;
                    tableMode = tableModeCheckbox.checked;
                    updateState();
                });
        }
    }

    function tableModeValueChangeHandler(checked) {
        // change view
        const host = phoneContainer.querySelector("#tableMode");
        const label = host?.querySelector("._vvxysz1, ._1t53cmw5");
        const icon = host?.querySelector("._okzfjf, ._1laf6tw8");

        if (host && label && icon) {
            if (checked) {
                label.style.backgroundColor = "rgb(48, 173, 0)";
                label.style.color = "white";
                icon.querySelector("svg").setAttribute("fill", "white");
            } else {
                label.style.backgroundColor = "inherit";
                label.style.color = "initial";
                icon.querySelector("svg").setAttribute("fill", "back");
            }
        }
    }

    function storeValue(key, value) {
        GM_setValue(JSON.stringify(key, value));
    }

    // DATA PARSING
    const _phones = [];
    const _whatsappLinks = [];
    /**
     * Sets phones or links to a runtime var
     * @param {string} mode "phone", "whatsappLink"
     * @param {string} data string value (phone or link)
     */
    function storePhoneOrLink(mode, data) {
        switch (mode) {
            case "phone":
                _phones.push(data)
                break;
            case "whatsappLink":
                _whatsappLinks.push(data)
                break;
        }
    }
    /**
     * Returns phones or links from a runtime var
     * @param {string} mode "phone", "whatsappLink"
     */
    function getPhonesOrLinks(mode) {
        switch (mode) {
            case "phone":
                return _phones;
            case "whatsappLink":
                return _whatsappLinks;
        }
    }

    async function fetchData() {
        let response = await fetch(`https://go.2gis.com/add/?mode=json&encoded=true&url=${encodeURI(location.href)}`);
        return response.json();
    }

    function pushOrRemoveRecord() {
        const firmId = /firm\/(\d+)/gi.exec(location.href)[1];
        const firmName = document.querySelector("._6htn2u ._oqoid").innerText;

        // removes a record
        if (recordList.find((record) => record.id === firmId)) {
            recordList = recordList.filter((record) => record.id !== firmId);
        }
        // adds a record
        else {
            fetchData().then((value) => {
                recordList.push({
                    id: firmId ?? recordList.length,
                    name: firmName,
                    shortUrl: value.shorturl ?? "",
                    fullUrl: location.href,
                    phones: [...getPhonesOrLinks("phone")],
                    whatsappLinks: [...getPhonesOrLinks("whatsappLink")]
                });
            })
            .finally(() => updateState())
        }

        updateState();
    }

    function copyTable() {
        placeTable();
        const table = phoneContainer.querySelector("#contactsTable");

        try {
            // create a Range object
            var range = document.createRange();
            var sel = window.getSelection();
            // set the Node to select the "range"
            range.selectNode(table);
            sel.removeAllRanges();
            sel.addRange(range);
            // add the Range to the set of window selections
            // window.getSelection().addRange(range);

            // execute 'copy', can't 'cut' in this case
            document.execCommand('copy');
        }
        catch(e) {}


        removeTable();
    }
}

//
// FUNCTIONS THAT NEED GLOBAL SCOPE
//

function getFromGM(key) {
    try {
        return JSON.parse(GM_getValue(key));
    } catch (error) {
        return []
    }
    }
