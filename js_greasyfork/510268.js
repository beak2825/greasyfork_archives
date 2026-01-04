// ==UserScript==
// @name         إرسال نقاط للرافع
// @namespace    https://www.arabp2p.net/index.php?page=userdetails&id=84413
// @version      1.2
// @description  تستطيع الآن إرسال نقاط لرافع أي تورنت من صفحة التورنت
// @author       حمـد
// @license MIT
// @match        https://www.arabp2p.net/index.php?page=torrent-details&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arabp2p.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510268/%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20%D9%84%D9%84%D8%B1%D8%A7%D9%81%D8%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/510268/%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20%D9%84%D9%84%D8%B1%D8%A7%D9%81%D8%B9.meta.js
// ==/UserScript==

// Examples:
// https://www.arabp2p.net/index.php?page=torrent-details&id=65565
// https://www.arabp2p.net/index.php?page=torrent-details&id=12905
// https://www.arabp2p.net/index.php?page=torrent-details&id=62860
const options = [500, 1000, 5000, 10000, 50000];

(function() {
    'use strict';

    const pointsDiv = document.createElement('div');
    pointsDiv.style.border = '1px solid #ccc';

    const title_text = document.createElement('p');
    title_text.textContent = 'إرسال نقاط للرافع';
    title_text.style.fontSize = 'medium';
    title_text.style.marginTop = '0';
    title_text.style.marginBottom = '0';
    pointsDiv.appendChild(title_text);

    const up_selector = document.querySelector("#uploader_name > a");
    const user_selector = document.querySelector('div.dropdown:nth-child(2) > a');
    const cur_url = window.location.href;

    const user_href = new URL(user_selector.href);
    const user_href_params = new URLSearchParams(user_href.search);
    const user_id = user_href_params.get('id').trim();

    const uploader_name = up_selector.text.trim();
    const uploader_href = new URL(up_selector.href);
    const uploader_href_params = new URLSearchParams(uploader_href.search);
    const uploader_id = uploader_href_params.get('id').trim();

    const toFormUrlEncoded = (params) => {
        return Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
    };

    const sendPointsRequest = (points, userid) => {
        const url = `/index.php?page=userdetails&id=${userid}&tab=13`;

        const params = {
            points: points,
            user_msg: `شكرا لرفعك هذا التورنت! ${cur_url} - تم الإرسال بواسطة سكريبت https://www.arabp2p.net/smf/index.php/topic,27596.0.html`,
            submit: `ارسال`
        };
        title_text.textContent = 'جاري الإرسال...'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: toFormUrlEncoded(params),
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                title_text.textContent = "حدث خطأ ما!";
                title_text.style.color = "red";
                throw new Error("حدث خطأ ما!");
            }
            return response.text();
        })
        .then(data => {
            console.log("تم الإرسال بنجاح!");
            title_text.textContent = `تم إرسال ${points} نقطة بنجاح!`;
            title_text.style.color = "green";
        })
        .catch((error) => {
            console.error("حدث خطأ ما!: ", error);
            title_text.textContent = "حدث خطأ ما!";
            title_text.style.color = "red";
        });

        const thanksBtn = document.querySelector("button#ty");
        if (thanksBtn) {
            if (typeof thanksBtn.getAttribute("disabled") === "object") {
                thanksBtn.click();
            };
        };
    };

    if (uploader_name === "زائر" || uploader_name === "" || user_id === uploader_id) {
        console.log("لا يمكن!!!");
    } else {
        const aftselect = document.querySelector(".tor_desc");

        options.forEach(item => {
            const button = document.createElement('button');
            button.className = 'button-15';
            button.textContent = item.toLocaleString();
            button.style.margin = '5px';
            button.onclick = () => sendPointsRequest(item, uploader_id);
            pointsDiv.appendChild(button);
        });

        if (aftselect) {
            aftselect.insertBefore(pointsDiv, aftselect.firstChild);
        } else {
            console.log(`لم أجد ${aftselect}`);
        }


        const style = document.createElement('style');
        style.textContent = `
        .button-15 {
            background-image: linear-gradient(#42A1EC, #0070C9);
            border: 1px solid #0077CC;
            border-radius: 4px;
            box-sizing: border-box;
            color: #FFFFFF;
            cursor: pointer;
            display: inline-block;
            font-family: "SF Pro Text", "SF Pro Icons", "AOS Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 17px;
            font-weight: 400;
            letter-spacing: -.022em;
            line-height: 1.47059;
            min-width: 30px;
            overflow: visible;
            padding: 4px 15px;
            text-align: center;
            vertical-align: baseline;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            white-space: nowrap;
        }

        .button-15:disabled {
            cursor: default;
            opacity: .3;
        }

        .button-15:hover {
            background-image: linear-gradient(#51A9EE, #147BCD);
            border-color: #1482D0;
            text-decoration: none;
        }

        .button-15:active {
            background-image: linear-gradient(#3D94D9, #0067B9);
            border-color: #006DBC;
            outline: none;
        }

        .button-15:focus {
            box-shadow: rgba(131, 192, 253, 0.5) 0 0 0 3px;
            outline: none;
        }
    `;
        document.head.appendChild(style);
    }
})();

