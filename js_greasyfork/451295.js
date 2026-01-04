// ==UserScript==
// @name         Swagger UI
// @namespace    http://localhost:3000/api
// @version      0.3.5
// @description  try to take over the world! (See patch notes at the bottom)
// @author       Audren Guillaume
// @match        http://localhost:3000/api/*
// @match        http://itt-ddc.private.list.lu:3000/api/*
// @match        http://erd-must.private.list.lu:3000/api/*
// @icon         https://static1.smartbear.co/swagger/media/assets/swagger_fav.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @resource     bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css
// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451295/Swagger%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/451295/Swagger%20UI.meta.js
// ==/UserScript==

/**
 * Inject CSS element in the page.
 * In this case, it added Bootstrap CSS link to the header of the page.
 */
function cssElement(url) {
    let link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    link.type = "text/css";
    return link;
}
document.head.appendChild(cssElement(GM_getResourceURL ("bootstrapCSS")));

/**
 * Some constants
 * - route: Your custom authentication path.
 * - url: Your custom authentication path (baseUrl).
 * - oidcTokenUrl: Your Keycloak authentication url
 * - oidcClientId: Your Keycloak client id
 * - oidcClientSecret: Your Keycloak client secret
 * - refreshTokenIntervalId: The interval id, used to refresh the access_token (intervale = expires_time *1000ms -100ms, with expires_time in seconds).
 */
const route = "/auth/login";
const url = `${window.location.origin}${route}`
const oidcTokenUrl = `http://erd-must.private.list.lu:8080/realms/master/protocol/openid-connect/token`
const oidcClientId = "must-secure"
const oidcClientSecret = "caVmiie7xjCrUEVQydPkRPfBiuy3i7Nt"
let refreshTokenIntervalId = undefined;
let idleIntervalId = undefined;

/**
 * A list of users
 * @param {string} name: The user username
 * @param {string} password: The user password
 * @param {string[]} urls: A list of Swagger URLs, only display the user when window.location.origin if found in urls.
 * @param {string} type: The type of authentication (default: empty).
 */
const defaultUsers = [
    { name: 'audren', password: 'Passw0rd!', urls: ['http://localhost:3000', 'http://erd-must.private.list.lu:3000/'], type: 'oauth2' },
    { name: 'mick', password: 'mick123', urls: ['http://localhost:3000', 'http://erd-must.private.list.lu:3000/'], type: 'oauth2' },
    { name: 'admin', password: 'admin', urls: ['http://localhost:3000', 'http://erd-must.private.list.lu:3000/'], type: 'oauth2' },
]
/* localStorage.setItem('users', JSON.stringify([
    { name: 'elie', password: 'daher', urls: ['http://localhost:3000', 'http://erd-must.private.list.lu:3000/'], type: 'oauth2' },
])) */

const localUsersString = localStorage.getItem('users')
let localUsers = []
if (localUsersString){
    localUsers = JSON.parse(localUsersString)
}

const users = [...new Set(localUsers.concat(defaultUsers))].sort((a, b) => a.name.localeCompare(b.name))

/**
 * Swagger UI expose the Redux store in an object called "ui".
 * Get the store and dispatch the access_token to the Redux Store.
 *
 * Based on the authentication type, the dispatch message + payload is different.
 *
 * Note: you can use Redux toolkit to see what's going on under the hook.
 */
async function dispatchAccessToken(accessToken, type='http'){
    const dispatch = unsafeWindow.ui.getStore().dispatch;
    switch(type){
        case 'http':
            return dispatch({
                type: 'authorize',
                payload: {
                    bearer: {
                        name: 'Bearer',
                        value: accessToken,
                        schema: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            description: 'Enter the access token (JWT format only)'
                        },
                    }
                }
            })
        case 'oauth2':
            return dispatch({
                type: "authorize_oauth2",
                payload: {
                    auth: {
                        name: 'openid',
                    },
                    token: {
                        access_token: accessToken,
                        token_type: 'Bearer',
                    }
                }

            })
        default:
            return
    }
}

/**
 * Fetch an access_token from a Oauth2 provider (ATM: Keycloak specific)
 */
async function oidcRequest({name, password}) {
    try {
        document.title = name;

        const searchParams = new URLSearchParams({
            grant_type: 'password',
            client_id: oidcClientId,
            client_secret: oidcClientSecret,
            scope: 'openid roles',
            username: name,
            password: password,
        });

        const res = await fetch(oidcTokenUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"

            },
            body: searchParams
        });

        if (res.status === 200){
            const {access_token, expires_in, refresh_token} = await res.json();

            dispatchAccessToken(access_token, 'oauth2')

            unsafeWindow.sessionStorage.setItem('swagger-refresh-token', refresh_token)

            refreshTokenIntervalId = setInterval(async() => {
                const refreshToken = unsafeWindow.sessionStorage.getItem('swagger-refresh-token')

                if (!refreshToken){

                    clearInterval(refreshTokenIntervalId)
                    return
                }

                const searchParams2 = new URLSearchParams();


                searchParams2.set("grant_type", "refresh_token")
                searchParams2.set("client_id", oidcClientId)
                searchParams2.set("client_secret", oidcClientSecret)
                searchParams2.set("scope", "openid roles")
                searchParams2.set("refresh_token", refreshToken)


                const refreshResponse = await fetch(oidcTokenUrl, {
                    method: 'POST',
                    body: searchParams2,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });

                if (refreshResponse.status === 200){
                    const refreshPayload = await refreshResponse.json();
                    console.log(refreshPayload)
                    dispatchAccessToken(refreshPayload.access_token, 'oauth2')
                }


            }, (expires_in * 1000) -100);
        }
        else {
            // TODO throw a notification
        }
        return true
    } catch(error){
        console.log("error", error)
        return false
    }
}


/**
 * On inactivity, remove refresh token interval. Duration: 10min
 */
function idle(){
    let timer = 0;
    /* eslint-disable */
    $(this).mousemove(function(){timer = 0});
    $(this).keypress(function(){timer = 0});
    /** eslint-enable */

    idleIntervalId = setInterval(() => {
        timer++
        if (timer >= 10){
            const idleBadge = document.createElement('span');
                idleBadge.className = "position-absolute top-10 end-0 translate-middle p-1 bg-warning border border-light rounded-circle"
                $('#success-badge').remove()
                $('#connected-user-text').append(idleBadge)
                clearInterval(idleIntervalId)
                clearInterval(refreshTokenIntervalId)
        }
    }, 60000 /* 1min */)
}

/**
 * Fetch on your custom auth provider with username/password as credentials.
 */
async function basicRequest({ name, password }) {
    try {
        // rename the title of the tab with the user login name
        document.title = name;

        // make the login request to the api / backend
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login:name, password })
        });

        // get the token from the request response
        let payload = await res.json();


        // get the Redux store and dispatch an event to insert the token
        // TamperMonkey: use unsafeWindow instead of window to get full object
        dispatchAccessToken(payload.token, 'oauth2')
        return true
    } catch (e) {
        console.log("Error", e);
        return false
    }
}

/**
 * The main function contains the main logic and the HTML templates/components to inject in the page.
 * @requires JQuery
 * @requires TamperMonkey unsafeWindow object.
 */
function main () {
    // Components to display at the top of Swagger UI (displayed in reverse-order, deepest child to parent: child3 > child 2 > child 1 > root)

    const filteredUsers = users
    .filter(user => {
        let include = user.urls.find(url => url.includes(window.location.origin))
        return !!include;
    })

    const selectHtml = `
<div>
  <select id="select-user" class="form-select">
    ${filteredUsers.length > 0
    ? filteredUsers.map(user => `<option value="${user.name}">${user.name}</option>`)
    : '<option value="no-">No users</option>'
    }
  </select>
</div>
`

    const selected = document.createElement('div')
    selected.id = 'connected-user-text'
    selected.style = "color: white; margin-left: 10px; position: relative; padding-right: 16px;"


    const badge = document.createElement('span');
    badge.id = 'success-badge'
    badge.className = "position-absolute top-10 end-0 translate-middle p-1 bg-success border border-light rounded-circle"

    const connectBtn = document.createElement('button')
    connectBtn.innerText = "connect"
    connectBtn.type = "button"
    connectBtn.className = "btn btn-outline-success mx-2"
    connectBtn.active = true

    connectBtn.onclick = async function (event) {
        const username = document.getElementById("select-user").value;
        const user = users.find(u => u.name === username);

        const isOk = await (user.type === 'oauth2' ? oidcRequest(user) : basicRequest(user))
        if (isOk){
            console.log("A user was selected")
                idle();
            selected.innerText = `Connected as "${user.name}"`
            $('#idle-badge').remove()
            selected.appendChild(badge)
        }
        else {
            // eslint-disable-next-line
            $(".topbar-wrapper").removeChild(selected)
        }
    }

    const topbar = document.getElementsByClassName("topbar")[0]
    topbar.style = "position: sticky; top: 0; z-index: 999;"

    //--- Add nodes to page
    /* eslint-disable */
    $(".topbar-wrapper").append(selectHtml);
    $(".topbar-wrapper").append(connectBtn);
    $(".topbar-wrapper").append(selected);
    /* eslint-enable */
}

// The setTimeout is important to wait the load of the react app before manipulating DOM.
setTimeout(() => {
    main();
},500)

/** PATCH NOTES */

// 0.3.5
// - fix: dispatch access token on refresh
// - add localStorage users
// - add an inactivity function (duration: 10min)

// 0.3.4
// - add user: mick

// 0.3.3
// - share the script on GreasyFork: https://greasyfork.org/fr/scripts/451295-swagger-ui

// 0.3.2
// - add documentation
// - fix oauth2 refresh: fetch missing "POST" method