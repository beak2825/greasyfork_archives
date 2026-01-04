// ==UserScript==
// @name           Knesset Agendas Editor Addon
// @name:he        עורכי מדד החירות
// @description    Help Knesset Agendas Editors And Reviewers
// @description:he סקריפט עזר למדרגי חוקים עבור מדד החרות.
// @version        1.5.1
// @namespace      ohadcn-kneset-agendas
// @author         Ohad Cohen
// @include          https://main.knesset.gov.il/Activity/Legislation/Laws/Pages/LawBill.aspx*
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/391881/Knesset%20Agendas%20Editor%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/391881/Knesset%20Agendas%20Editor%20Addon.meta.js
// ==/UserScript==

if ('undefined' == typeof __PAGE_SCOPE_RUN__) {
    (function page_scope_runner() {
        var my_src = "(" + page_scope_runner.caller.toString() + ")();";
        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.textContent = "var __PAGE_SCOPE_RUN__ = true;\n" + my_src;
        setTimeout(function () {
            document.head.appendChild(script);
            //document.head.removeChild(script);
        }, 3000);
    })();
    return;
}



function valElement(value, content) {
    var ret = document.createElement("option");
    ret.innerText = content;
    ret.value = value;
    return ret;
}

function elementWithStyle(name, style) {
    var ret = document.createElement(name)
    ret.style = style;
    return ret;
}

const showBtn = "padding-right: 10px;"
const hideBtn = "display: none;";

var choose;
var sendBtn;
var userMail = "";

function btn(text, style) {
    var ret = document.createElement("button")
    ret.innerText = text;
    ret.style = showBtn;
    ret.classList.add("btn");
    return ret;
}

function sendData(ev) {
    ev.preventDefault();
    var lawName = $(".LawDarkBrownTitleH2").text();
    var billNum = $("strong:contains(מספר הצ\"ח)").parent().next().text().trim();
    var derug = $("#derug").val();
    var initiators = $("strong:contains(חברי הכנסת היוזמים)").parent().parent().next().text().trim().split(", ")
        .concat($("strong:contains(חברי הכנסת המצטרפים)").parent().parent().next().text().trim().split(", "));
    if (derug < -50) {
        alert("בחר דירוג מספרי!");
        return;
    }
    if (!billNum) {
        billNum = $(".LawSecondaryDetailsTd:contains(פרסום ברשומות)").next().text().trim().match(/הצ"ח הממשלה .{10,20} - (\d+)/)[1];
        if (!billNum) return alert("failed");
        billNum = "מ/" + billNum + "/34";
        initiators = ["ממשלתית"];
    }
    // send data to liberty.oodi.co.il/api/send/laws25/123 using fetch
    fetch('https://li.oodi.co.il/api/send/laws' + (Number(billNum.split("/")[2])) + '/' + (Number(billNum.split("/")[1]) + 1), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: [[lawName, userMail, billNum, derug,
                location.href, description.value,
                /* comment */
                , /* is voted? */, /* is passed? */,
            ].concat(initiators)]
        })
    }).then(response => response.json())
        .then(data => {
            var text = "נשלח";
            if (data.error)
                text = data.error;
            sendBtn.innerText = text;
        })
        .catch((error) => {
            console.error('Error:', error);
            sendBtn.innerText = error;
        });
    sendBtn.innerText = "שולח...";
}

var description;
var mailText;
var connectBtn;
var disconnectBtn;
if ((col = $("#tblMainProp tr"))) {
    var row = elementWithStyle("td", "padding-right: 10px;");
    var title = elementWithStyle("div", "padding-bottom: 5px;");
    var titleText = document.createElement("strong");
    titleText.innerText = "דירוג:";
    title.appendChild(titleText);
    row.appendChild(title);

    description = elementWithStyle("textarea", "padding-right: 10px;");
    description.id = "gradeDesc";
    description.style.height = "1.5vh";
    row.appendChild(description);

    choose = document.createElement("select");
    choose.dir = "ltr";
    choose.autofocus = true;
    choose.id = "derug";
    choose.appendChild(valElement("-100", "בחר"));
    choose.appendChild(valElement("3", "3"));
    choose.appendChild(valElement("2", "2"));
    choose.appendChild(valElement("1", "1"));
    choose.appendChild(valElement("0", "0"));
    choose.appendChild(valElement("-1", "-1"));
    choose.appendChild(valElement("-2", "-2"));
    choose.appendChild(valElement("-3", "-3"));
    row.appendChild(choose);

    sendBtn = btn("שלח");
    sendData.id = "sendBtn";
    sendBtn.addEventListener("click", sendData);
    sendBtn.disabled = true;

    sendBtn.classList.add("btn-success");
    sendBtn.classList.add("btn-sm");
    row.appendChild(sendBtn);

    row.appendChild(elementWithStyle("br", "clear: both;"));

    mailText = elementWithStyle("input", "padding-right: 10px;");
    mailText.id = "mailText";
    row.appendChild(mailText);
    mailText.value = userMail;
    mailText.placeholder = "אימייל (לכניסה)";
    mailText.style.width = "20vh";
    mailText.addEventListener("change", function () {
        if (!mailText.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            connectBtn.disabled = true;
            return;
        }
        connectBtn.disabled = false;
    });

    connectBtn = btn("התחבר");
    connectBtn.id = "gSigninBtn";
    connectBtn.addEventListener("click", handleAuthClick);
    connectBtn.classList.add("btn-success");
    connectBtn.disabled = true;
    row.appendChild(connectBtn);

    disconnectBtn = btn("התנתק");
    disconnectBtn.id = "gSignoutBtn";
    disconnectBtn.addEventListener("click", handleSignoutClick);
    disconnectBtn.classList.add("btn-danger");
    disconnectBtn.classList.add("btn-sm");
    row.appendChild(disconnectBtn);

    col.append(row)
}

document.body.appendChild(function () {
    var ret = document.createElement("pre");
    ret.id = "content";
    return ret;
}());

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    let myMail = localStorage.getItem("userMail");
    if (myMail) userMail = myMail;
    updateSigninStatus(myMail != null);
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        connectBtn.style.display = 'none';
        mailText.style.display = 'none';
        disconnectBtn.style.display = 'block';
        disconnectBtn.innerHTML = "התנתק מ" + userMail;
        sendBtn.disabled = false;
        var billNum = $("strong:contains(מספר הצ\"ח)").parent().next().text().trim().split("/");
        if (billNum.length <= 1) {
            billNum = $(".LawSecondaryDetailsTd:contains(פרסום ברשומות)").next().text().trim().match(/הצ"ח הממשלה .{10,20} - (\d+)/)[1];
            if (!billNum) return alert("failed");
            billNum = ["מ", billNum, "34"];
        }
        var billN = Number(billNum[1]) + 1;
        fetch(`https://li.oodi.co.il/api/read/laws${billNum[2]}/${billN}`, {
            method: 'GET',
        }).then(response => response.json())
            .then(function (res) {
                console.log(res, res.data);
                $("#derug").val(res[0]) || -100;
                description.value = res[2] || "";

            })
    } else {
        connectBtn.style.display = 'block';
        disconnectBtn.style.display = 'none';
        sendBtn.disabled = true;
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    event.preventDefault();
    fetch('https://li.oodi.co.il/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: mailText.value })
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                userMail = data.email;
                localStorage.setItem("userMail", userMail);
                updateSigninStatus(true);
            } else {
                appendPre(`Login failed ${data.message}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            appendPre(`Login error: ${error}`);
        });
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    event.preventDefault();
    localStorage.removeItem("userMail");
    userMail = "anonymous";
    updateSigninStatus(false);
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

handleClientLoad();