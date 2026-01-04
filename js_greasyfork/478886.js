// ==UserScript==
// @name         isTester
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  shows testers badge in requests to comunity
// @author       olejii
// @license      MIT
// @match        https://vk.com/*?act=users&tab=requests
// @match        https://vk.ru/*?act=users&tab=requests
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/478886/isTester.user.js
// @updateURL https://update.greasyfork.org/scripts/478886/isTester.meta.js
// ==/UserScript==

const userNameCSS = `
    .group_u_name {
        display: flex;
    }

    .icon {
        margin-left: 5px;
        font-weight: 700;
        opacity: 0.75;
    }

    .icon:hover {
        opacity: 1;
    }

    .badge {
        height: 15px;
    }
`

async function main() {
    await new Promise((res) => setTimeout(res, 1000))

    getToken();

    function getToken() {
        console.log(JSON.parse(localStorage.getItem("6287487:web_token:login:auth")).access_token)
        localStorage.setItem("access_token", JSON.parse(localStorage.getItem("6287487:web_token:login:auth")).access_token)
    }

    async function checkTester(user_id) {
        const token = localStorage.getItem("access_token")
        let res = await fetch(`https://api.vk.com/method/groups.isMember?access_token=${token}&group_id=134304772&user_id=${user_id}&v=5.154`)
        const resJSON = await res.json()
        return resJSON.response
    }

    async function renderUserIsTesterInfo() {

        const requestsRow = [...document.getElementById("group_u_rows_requests").children]

        for (let i = 0; i<requestsRow.length; i++) {

            const before = requestsRow[i].children[2].children[0].children[0]

            const user_id = requestsRow[i].id.split("group_u_requests")[1]
            const check = await checkTester(user_id)

            const info = document.createElement("a")
            info.className = `group_link user${user_id} icon`
            info.href = `https://vk.com/bugs?act=reporter&id=${user_id}`
            info.target = "_blank"
            info.innerHTML = check === 1 ?
                "<img class='badge' src='https://vk.com/images/icons/favicons/fav_vk_testers.ico?6' alt=' '/>" : ""
            addCSSStyle(userNameCSS)

            const parent = before.parentNode

            parent.append(info)
        }


    }

    renderUserIsTesterInfo()

    function addCSSStyle(css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

}
main();