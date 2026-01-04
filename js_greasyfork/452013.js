// ==UserScript==
// @name         DAT Loads Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  assistant on power.dat.com/search/loads (only Google Chrome Browser)
// @author       Dilik S
// @match        https://power.dat.com/search/loads
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dat.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452013/DAT%20Loads%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452013/DAT%20Loads%20Helper.meta.js
// ==/UserScript==


function copyValue(value) {
    let temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = `${value}`;
    temp.select();
    document.execCommand("copy");
    temp.remove();
}


function starter(dhd_check) {
    const elem = document.getElementsByClassName("dtp ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope")[0].getElementsByClassName("ng-scope")[0];
    elem.innerHTML = "RPM";
    function rpm(elem) {

        const dh = elem.getElementsByClassName("do")[0].textContent;
        const dd = elem.getElementsByClassName("dd")[0].textContent;
        const trp = elem.getElementsByClassName("trip")[0].textContent;
        const rate = elem.getElementsByClassName("rate")[0].textContent;

        let dhd = Number(dd.replace(/^\((.+)\)$/,"$1"));
        let d = Number(dh.replace(/^\((.+)\)$/,"$1"));
        let trip = Number(trp.replace(/^\((.+)\)$/,"$1").replace(",", ""));
        let price = Number(rate.replace("$", "").replace(/\.00$/,"").replace(",", ""));

        let checked_dhd = dhd_check ? (dhd || 0): 0;

        let check = (price / (checked_dhd + (d || 0) + trip)).toFixed(2);
        const result = check !== "NaN" ? `$${check}`: "—";


        const dtp = elem.getElementsByClassName("dtp")[0];
        dtp.innerHTML = `${result}`;
        if (check > 2.9) {
            dtp.style.backgroundColor = "#009933";
            dtp.style.color = "white";
        } else if (check > 2.2) {
            dtp.style.backgroundColor = "#ffff00";
            dtp.style.color = "black";
        }
    }

    function contact_copy(elem) {
        const contact = elem.getElementsByClassName("contact")[0];
        let newElement = document.createElement("button");
        newElement.innerHTML = contact.textContent;
        newElement.onclick = () => {
            copyValue(newElement.innerHTML);
        }
        contact.textContent = "";
        contact.appendChild(newElement);

    }

    const targets = document.getElementsByClassName("resultItem");
    for (let target of targets) {
        rpm(target);
        contact_copy(target);
    }
}



function copyOrigintoDest(ele_first, ele_second, ele_third) {
    let temp = document.createElement("textarea");
    document.body.appendChild(temp);
    temp.value = `${ele_first.textContent} ${ele_second.textContent} ${ele_third.textContent}`;
    temp.select();
    document.execCommand("copy");
    temp.remove();
}

function mcDetails(ele) {
    let docket = ele.getElementsByClassName("docket")[0];

    let mc_number = docket.textContent.replace( /^\D+/g, '');

    if (ele.getElementsByClassName("mc_num").length === 0) {

        let newElement = document.createElement("button");
        newElement.innerHTML = mc_number.trim();
        newElement.className = "mc_num";

        newElement.onclick = () => {
            copyValue(newElement.innerHTML);
        }

        docket.appendChild(newElement);


    }

}

function originToDest(ele) {

    if (ele.getElementsByClassName("origin-to-dest").length === 0) {

        let newElement = document.createElement("button");
        newElement.innerHTML = "OrigToDest";
        newElement.className = "origin-to-dest";

        newElement.onclick = () => {
            copyOrigintoDest(ele.getElementsByClassName("origin")[0], ele.getElementsByClassName("trip")[0], ele.getElementsByClassName("dest")[0]);
        }

        let docket = ele.getElementsByClassName("docket")[0];
        docket.appendChild(newElement);

    }
}
function mapGooglePlace(place) {
    return place.replace(" ", "+").replace(",", "%2C")

}

function onGoogleMap(ele) {

    if (ele.getElementsByClassName("on-google-map").length === 0) {
        let my_origin = document.getElementsByClassName("searchItem ng-scope isView currentSearch")[0].getElementsByClassName("origin ng-binding")[0].textContent;
        let to_pickup = ele.getElementsByClassName("origin")[0].textContent;
        let to_delivery = ele.getElementsByClassName("dest")[0].textContent;
        let link = `https://www.google.com/maps/dir/?api=1&origin=${mapGooglePlace(my_origin)}&waypoints=${mapGooglePlace(to_pickup)}&destination=${mapGooglePlace(to_delivery)}&travelmode=driving`;
        let newElement = document.createElement("a");
        newElement.textContent = "On Map 🗺️";
        newElement.href = link;
        newElement.target = "_blank";
        newElement.className = "on-google-map";

        let docket = ele.getElementsByClassName("docket")[0];
        docket.appendChild(newElement);
    }

}

function sort_by_rpm() {
    const regex = /[+-]?\d+(\.\d+)?/g;
    const exactMatch = document.getElementsByClassName("resultItem            exactMatch");
    const parent = document.getElementsByClassName("searchResultsTable")[0];
    const before_elem = document.getElementById("noExactMatchesMessage");

    const list_items = [];

    function get_value_rpm(value) {

        if (value !== "—") {
            return value.match(regex).map(function(v) { return parseFloat(v); })[0];
        } else {
            return 0;
        }

    }

    for (let element of exactMatch) {
        let value_element = element.getElementsByClassName("dtp")[0].textContent;
        list_items.push([element, get_value_rpm(value_element)]);

    }

    list_items.sort(function(first, second) {
        return second[1] - first[1];
    });


    Array.from(exactMatch).forEach(element => {
        element.remove();
    });

    list_items.forEach(element => {
        parent.insertBefore(element[0], before_elem);

    });
}



document.addEventListener("keydown", function(event) {
    if (event.code == "KeyD" && (event.ctrlKey || event.metaKey || event.shiftKey )) {

        const dhd_checkbox = document.getElementById('include_dhd').checked
        starter(dhd_checkbox);

        const targets = document.getElementsByClassName("resultItem");
        for (let target of targets) {

            let this_target = target.getElementsByClassName("resultDetails");


            if (this_target.length > 0) {

                if (this_target[0].getElementsByClassName("primary-data").length > 0) {
                    let elem = this_target[0].getElementsByClassName("primary-data")[0].getElementsByClassName("primary-data")[0];
                    mcDetails(elem);
                    originToDest(target);
                    onGoogleMap(target);
                } else if (this_target[0].getElementsByTagName("td").length > 0) {
                    let elem = this_target[0].getElementsByTagName("td")[0];
                    mcDetails(elem);
                    originToDest(target);
                    onGoogleMap(target);
                }

            }}
    }
})


window.addEventListener("load", function(event) {
    const top_page = document.getElementsByClassName("freightMatching")[0].getElementsByTagName("ul")[0];

    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = ".hotkey { color: #277BC0;}";
    document.getElementsByTagName('head')[0].appendChild(style);

    const user_name = document.getElementById("user-salutation").textContent;
    let new_element = document.createElement("li");
    new_element.innerHTML = `${user_name.replace(" ", ", ")}. My name is Dilik, it has been a pleasure working with you. Use <span class="hotkey">Shift + D</span>, in case you need help)`;
    top_page.appendChild(new_element);

    let second_new_element = document.createElement("li");
    let new_input = document.createElement("input");
    new_input.type = "checkbox";
    new_input.id = "include_dhd";
    let new_label = document.createElement("label");
    new_label.for = "include_dhd";
    new_label.textContent = "Include DH-D";

    second_new_element.appendChild(new_input);
    second_new_element.appendChild(new_label);
    top_page.appendChild(second_new_element);

    let rpm_btn_sort = document.createElement("button");
    rpm_btn_sort.innerHTML = "rpm sort";
    rpm_btn_sort.onclick = () => {sort_by_rpm();}
    top_page.appendChild(rpm_btn_sort);


})


