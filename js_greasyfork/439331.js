// ==UserScript==
// @name         Orange DHCP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Orange Script
// @author       Emanuel Farinha
// @match        http://sondadhcp.orange.es/dhcpMonitor/Dashboard/*
// @icon         https://www.google.com/s2/favicons?domain=213.211
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439331/Orange%20DHCP.user.js
// @updateURL https://update.greasyfork.org/scripts/439331/Orange%20DHCP.meta.js
// ==/UserScript==



var protocol
var link

function loop_alarms(id, loop) {
    document.getElementById(id).style.height = '120px'
    document.getElementById(id).children[2].children[1].style.display = "none"
    for (let i = 0; i < loop.length; i++) {
        let paragraf = document.createElement('p')
        paragraf.className = 'alarms_hpe_1'
        let content = document.createTextNode(loop[i]);
        paragraf.appendChild(content)
        document.getElementById(id).children[2].insertAdjacentElement('afterend', paragraf)
    }
}

function toogle_alarms(event, array_id) {
    for (let j = 0; j < array_id.length; j++) {
        if (document.getElementById(array_id[j]).children[2].children[1].style.display == 'none') {
            document.getElementById(array_id[j]).style.height = '85px'
            document.getElementById(array_id[j]).children[2].children[1].style.display = 'block'
            for (let i = 3; i < 6; i++) {
                document.getElementById(array_id[j]).children[i].style.display = 'none'
            }
        } else {
            document.getElementById(array_id[j]).children[2].children[1].style.display = 'none'
            document.getElementById(array_id[j]).style.height = '120px'
            for (let i = 3; i < 6; i++) {
                document.getElementById(array_id[j]).children[i].style.display = 'block'
            }
        }
    }
    event.preventDefault()
}

let btn = document.createElement("button");
btn.innerHTML = "Hide/Show";

document.body.appendChild(btn);
document.getElementById('loginContainer').insertAdjacentElement('beforeend', btn)


for (var i = 0; i < 3; i++) {
    if (document.getElementById("ddlProtocol").children[i].selected) {
        protocol = document.getElementById("ddlProtocol").children[i].text
    }
}

for (var i = 0; i < 3; i++) {
    if (document.getElementById('ddlLinkId').children[i].selected) {
        link = document.getElementById("ddlLinkId").children[i].text
    }
}

if (protocol === 'DHCP v4' && link == 'Jazztel') {
    let init_success = ['Critical: Bellow 30%', 'Major: Bellow 45%', 'Minor: Bellow 55%']
    loop_alarms('kpi-30', init_success)
    let rebind_success = ['Critical: Bellow 85%', 'Major: Bellow 90%', 'Minor: Bellow 95%']
    loop_alarms('kpi-32', rebind_success)

    let init_time = ['Critical: Up to 1000ms', 'Major: Up to 750ms', 'Minor: Up to 600ms']
    loop_alarms('kpi-40', init_time)
    let rebind_time = ['Critical: Up to 50ms', 'Major: Up to 40ms', 'Minor: Up to 30ms']
    loop_alarms('kpi-42', rebind_time)

    btn.addEventListener("click", (ev) => {
        toogle_alarms(ev, ['kpi-30', 'kpi-32', 'kpi-40', 'kpi-41'])
    })
}

if (protocol === 'DHCP v6' && link == 'Jazztel') {
    let request_success = ['Critical: Bellow 80%', 'Major: Bellow 85%', 'Minor: Bellow 95%']
    loop_alarms('kpi-91', request_success)
    let renew_success = ['Critical: Bellow 80%', 'Major: Bellow 85%', 'Minor: Bellow 95%']
    loop_alarms('kpi-93', renew_success)
    let solicit_success = ['Critical: Bellow 15%', 'Major: Bellow 20%', 'Minor: Bellow 30%']
    loop_alarms('kpi-90', solicit_success)

    let renew_time = ['Critical: Up to 40ms', 'Major: Up to 30ms', 'Minor: Up to 20ms']
    loop_alarms('kpi-101', renew_time)

    btn.addEventListener("click", (ev) => {
        toogle_alarms(ev, ['kpi-91', 'kpi-93', 'kpi-90', 'kpi-101'])
    })
}

if (protocol === 'DHCP v4' && link == 'Orange') {
    let init_success = ['Critical: Bellow 20%', 'Major: Bellow 25%', 'Minor: Bellow 30%']
    loop_alarms('kpi-30', init_success)
    let renew_success = ['Critical: Bellow 80%', 'Major: Bellow 85%', 'Minor: Bellow 95%']
    loop_alarms('kpi-31', renew_success)

    let init_time = ['Critical: Up to 1000ms', 'Major: Up to 750ms', 'Minor: Up to 600ms']
    loop_alarms('kpi-40', init_time)
    let renew_time = ['Critical: Up to 40ms', 'Major: Up to 30ms', 'Minor: Up to 20ms']
    loop_alarms('kpi-41', renew_time)

    btn.addEventListener("click", (ev) => {
        toogle_alarms(ev, ['kpi-30', 'kpi-31', 'kpi-40', 'kpi-41'])
    })
}

if (protocol === 'DHCP v6' && link == 'Orange') {
    let request_success = ['Critical: Bellow 80%', 'Major: Bellow 85%', 'Minor: Bellow 95%']
    loop_alarms('kpi-91', request_success)
    let renew_success = ['Critical: Bellow 80%', 'Major: Bellow 85%', 'Minor: Bellow 95%']
    loop_alarms('kpi-93', renew_success)
    let solicit_success = ['Critical: Bellow 3%', 'Major: Bellow 5%', 'Minor: Bellow 7%']
    loop_alarms('kpi-90', solicit_success)

    let renew_time = ['Critical: Up to 40ms', 'Major: Up to 30ms', 'Minor: Up to 20ms']
    loop_alarms('kpi-101', renew_time)

    btn.addEventListener("click", (ev) => {
        toogle_alarms(ev, ['kpi-91', 'kpi-93', 'kpi-90', 'kpi-101'])
    })

}