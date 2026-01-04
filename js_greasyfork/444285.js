// ==UserScript==
// @name         Krisha.kz phone number copier
// @namespace    http://krisha.kz/
// @license MIT
// @version      0.1
// @description  Krisha.kz mobile phone number copier allow you to copy any Russian/Kazakh mobile phone number to your device's clipboard
// @author       Kenya-West
// @match        https://krisha.kz/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/444285/Krishakz%20phone%20number%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/444285/Krishakz%20phone%20number%20copier.meta.js
// ==/UserScript==

setInterval(function () {
    main()
}, 500)

function main() {

    // Elements that contain phone number in innerText
    const elems = document.querySelectorAll(".offer__container .offer__contacts .offer__contacts-phones");
    // Parent elements a[href] that are parents for elems
    const parentHrefs = document.querySelectorAll(".offer__container .offer__contacts .a-phones");
    // Parent elements that are parents for parentHrefs
    const parentElems = document.querySelectorAll(".offer__container .offer__contacts");
    // Number link like `tel:` containing number. Usually it's the parentHrefs[index]
    const numberLink = document.querySelectorAll(".offer__container .offer__contacts .offer__contacts-phones > p");

    placeIcons(elems, parentElems, parentHrefs, numberLink);

    function placeIcons(elems, parentElems, parentHrefs, numberLink) {
        // console.log(`Got elems: ${elems.length}, parentElems: ${parentElems.length}, parentHrefs: ${parentHrefs.length}, numberLink: ${numberLink.length}`);
        elems
        .forEach((element, index) => {

            // since NodeListOf<Element> got no .filter method, use if()
            if (!parentElems[index].getAttribute("whatsapp-linked")) {

                let whatsappLink = preparePhoneNumber(numberLink[index].innerText.replace(/\s|\+/g, ""), index);
                let phoneLink = preparePhoneNumber(numberLink[index].innerText.replace(/\s|\+/g, ""), index);
                let phoneNumber = preparePhoneNumber(numberLink[index].innerText.replace(/\s|\+/g, ""), index);
                // console.log(`whatsappLink: ${whatsappLink}`);

                if (whatsappLink && parentHrefs[index]) {
                    let whatsapp = "http://wa.me/" + whatsappLink;
                    let button = prepareWhatsappButton(whatsapp, index);
                    parentElems[index].insertBefore(button, parentHrefs[index]);
                    parentElems[index].setAttribute("whatsapp-linked", true);
                    // console.log(`Placed whatsappLink with number: ${whatsapp}`);
                }
                if (phoneLink) {
                    let phone = "tel:+" + phoneLink;
                    // console.log(`Placed phone with number: ${phone}`);
                }
                if (phoneNumber && parentHrefs[index] && !parentElems[index].getAttribute("phone-linked")) {
                    let phone = `+${phoneNumber[0]} ${phoneNumber[1]}${phoneNumber[2]}${phoneNumber[3]} ${phoneNumber[4]}${phoneNumber[5]}${phoneNumber[6]}-${phoneNumber[7]}${phoneNumber[8]}-${phoneNumber[9]}${phoneNumber[10]}`
                    let button = preparePhoneButton(phone, index);
                    parentElems[index].insertBefore(button, parentHrefs[index]);
                    parentElems[index].setAttribute("phone-linked", true);
                    // console.log(`Placed phone with number: ${phone}`);
                }

            }

        });

    }

    function preparePhoneNumber(phone, index) {
        // console.log(`Received phone ${phone} with index ${index} in preparePhoneNumber()`);
        const regex = /7\d+/;
        if (regex.test(phone)) {
            let result = regex.exec(phone);
            if (result[0].length < 11) {
                return null;
            }
            // console.log(`Successfully done regex: ${result[0]} in preparePhoneNumber()`);
            return result[0]
        } else { return null }
    }

    function prepareWhatsappButton(whatsappLink, index) {
        const button = document.createElement('img');
        button.id = "whatsappLink" + index;
        button.src = "https://upload.wikimedia.org/wikipedia/commons/1/19/WhatsApp_logo-color-vertical.svg";
        button.style.width = "24px";
        button.style.height = "24px";
        button.style.display = "inline-block";
        button.style.cursor = "pointer";
        button.style.marginRight = "5px";
        button.setAttribute("whatsapp-link", whatsappLink);
        button.addEventListener('click', (element) => {
            if (element.target && element.target.id === button.id) {
                GM_setClipboard(whatsappLink);
                console.dir(element);
                const target = element.toElement || element.target || element.srcElement || element.targetElement;
                target.style.backgroundImage = "green";
                window.setTimeout(() => {
                    target.style.backgroundImage = "none";
                }, 1000);
            }
        });
        return button;
    }
    function preparePhoneButton(phone, index) {
        const button = document.createElement('img');
        button.id = "phone" + index;
        button.src = "https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg";
        button.style.width = "24px";
        button.style.height = "24px";
        button.style.display = "inline-block";
        button.style.cursor = "pointer";
        button.style.marginRight = "5px";
        button.setAttribute("phone", phone);
        button.addEventListener('click', (element) => {
            if (element.target && element.target.id === button.id) {
                GM_setClipboard(phone);
                const target = element.toElement || element.target || element.srcElement || element.targetElement;
                target.style.backgroundImage = "green";
                window.setTimeout(() => {
                    target.style.backgroundImage = "none";
                }, 1000);
            }
        });
        return button;
    }

}
