// ==UserScript==
// @name        Rewards fetch coinbase.com
// @namespace   Violentmonkey Scripts1
// @match       https://www.coinbase.com/*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @grant       GM_addElement
// @grant       GM_addStyle
// @author      -
// @description 12/30/2024, 1:46:44 PM
// @downloadURL https://update.greasyfork.org/scripts/522429/Rewards%20fetch%20coinbasecom.user.js
// @updateURL https://update.greasyfork.org/scripts/522429/Rewards%20fetch%20coinbasecom.meta.js
// ==/UserScript==
const tabs = 30


setTimeout(async () => {
    const variableCredentials = {}
    const dbName = "keyval-store"
    const storeName = "keyval"

    function getCookie(cname) {
        const name = cname + "="
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        throw new Error("Cannot get coinbase_device_id from Cookie")
    }

    const getAnalyticsDB = () => new Promise((resolve, reject) => {
        // DB is not always populated.
        // Disabling cache fixed it. Still risky
        const request = unsafeWindow.indexedDB.open(dbName)

        request.onerror = function (event) {
            reject(new Error("Error opening database: " + event.target.error))
        }

        request.onsuccess = function (event) {
            const db = event.target.result
            console.log("Database opened successfully!")

            // Read the value from the object store
            let transaction
            try {
                // Attempt to start a transaction
                transaction = db.transaction(storeName, "readonly")
            } catch (error) {
                console.warn(`Object store "${storeName}" not found. Deleting the database...`)
                db.close() // Close the database before deleting it.

                // Delete the database
                const deleteRequest = unsafeWindow.indexedDB.deleteDatabase(dbName)

                deleteRequest.onerror = function (event) {
                    reject(new Error("Error deleting the database: " + event.target.error))
                }

                deleteRequest.onsuccess = function () {
                    console.log(`Database "${dbName}" deleted successfully.`)
                    reject(new Error(`Object store "${storeName}" was missing, so the database was deleted.`))
                }

                return
            }
            // const transaction = db.transaction(storeName, "readonly")
            const objectStore = transaction.objectStore(storeName)

            const getAnalytics = objectStore.get("analytics-db")

            getAnalytics.onerror = function (event) {
                reject(new Error("Error reading from object store: " + event.target.error))
            }

            getAnalytics.onsuccess = function (event) {
                resolve(getAnalytics.result) // Resolve with the result of the key
            }
        }
    })

    const getIncentiveUUID = () => new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        responseType: "json",
        url: "https://www.coinbase.com/graphql/query?&operationName=SpinTheWheelGameScreenQuery&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22dcd9e5df69f98468e59e187294c270299f766518589dbd8994afb9caafc757f1%22%7D%7D&variables=%7B%7D",
        headers: {
            "User-Agent": navigator.userAgent,
            "Accept": "multipart/mixed;deferSpec=20220824, application/json",
            "Accept-Language": "en",
            "X-CB-Is-Logged-In": "true",
            "X-CB-Pagekey": "spin_the_wheel",
            "X-CB-Platform": "web",
            "X-CB-Project-Name": "consumer",
            "X-CB-Version-Name": "unknown",
            "CB-CLIENT": "CoinbaseWeb",
            "cb-version": "2021-01-11",
            "redirect": "follow",
            "Content-Type": "application/json",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "X-CB-UJS": "",
            "Referrer": "https://www.coinbase.com/rewards/spin-the-wheel",
            "Origin": "https://www.coinbase.com",
            ...variableCredentials
        },
        onload: (response) => {
            if (response.status === 200) {
                try {
                    const jsonResponse = JSON.parse(response.responseText)
                    console.log("SpinTheWheelGameScreenQuery", jsonResponse)
                    resolve(jsonResponse?.data?.viewer?.incentiveCampaigns?.at(0)?.userIncentive?.uuid)
                } catch (error) {
                    console.error("Failed to parse JSON response:", error)
                    reject(error)
                }
            } else {
                console.error(`SpinTheWheelGameScreenQuery ${response.status}: ${response.statusText}`)
                reject(response)
            }
        },
        onerror: (res) => {
            console.error("Error fetching SpinTheWheelGameScreenQuery", res)
            reject(res)
        }
    }))

    const initiateSpin = (userIncentiveId) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            responseType: "json",
            url: "https://www.coinbase.com/graphql/query?&operationName=useUserIncentiveRedeemerMutation",
            headers: {
                "User-Agent": navigator.userAgent,
                "Accept": "multipart/mixed;deferSpec=20220824, application/json",
                "Accept-Language": "en",
                "Content-Type": "application/json",
                "X-CB-Is-Logged-In": "true",
                "X-CB-Pagekey": "spin_the_wheel",
                "X-CB-Platform": "mobile_web",
                "X-CB-Project-Name": "consumer",
                "X-CB-Version-Name": "unknown",
                "CB-CLIENT": "CoinbaseWeb",
                "cb-version": "2021-01-11",
                "redirect": "follow",
                "Sec-GPC": "1",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "X-CB-UJS": "",
                "Priority": "u=4",
                ...variableCredentials,
                "Referer": "https://www.coinbase.com/rewards/spin-the-wheel",
                "Origin": "https://www.coinbase.com",
            },
            data: JSON.stringify({
                "query": "mutation useUserIncentiveRedeemerMutation($input:IncentivesRedeemInput!){incentivesRedeem(input:$input){__typename,...on IncentivesRedeemSuccess{success,userIncentive{uuid,id,userIncentiveStatus,redemptionMetadata{isRedeemed,redeemedAt,reward{__typename,...on IncentivePayout{targetAmount{value,currency},payoutCurrency,paymentStatus}}}}},...on IncentivesRedeemError{message,code}}}",
                "operationName": "useUserIncentiveRedeemerMutation",
                "variables": {
                    "input": {
                        "userIncentiveId": userIncentiveId,
                        "dryRun": false
                    }
                }
            }),
            onload: (response) => {
                if (response.status !== 400) {
                    resolve(JSON.parse(response.responseText))
                } else {
                    // console.error(`SpinTheWheelGameScreenQuery ${response.status}: ${response.statusText}`)
                    reject(response)
                }
            },
            onerror: reject
        })
    })

    // Starts here
    try {
        const dbResult = await getAnalyticsDB()

        variableCredentials["X-CB-Session-UUID"] = dbResult.sessionUUID
        variableCredentials["X-CB-User-ID"] = dbResult.userId
        variableCredentials["X-CB-Device-ID"] = getCookie("coinbase_device_id")

        console.log("creds: ", variableCredentials)


    } catch (error) {
        alert("Failed getting important data. Reload the page and see if this error disappears. If not, clear browser cache and try again.")
        throw new Error(error)
    }



    GM_addStyle(`
        .custom-spinner-form{
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 6px;
            align-items: center;
            position: fixed;
            top: 6rem;
            left: 50%;
            transform: translateX(-50%);
            border: 2px solid white;
            border-radius: 50px;

        }
        .custom-spinner-form input{
            appearance: none;
            min-width: 0;
            background: transparent;
            text-align: center;
            font-size: inherit;
            outline: none;
            font-weight: 500;
        }
        .custom-spinner-form button{
            padding: 12px 24px;
            background-color: #4CAF50;
            border-radius: 50px;
            font-size: 16px;
            cursor: pointer;
        }
        .custom-spinner-button:disabled{
            background-color: #ccc;
        }
        [data-testid="spin-the-wheel-content-testid"]{
            display: none !important;
        }
    `)

    const form = GM_addElement("form", { class: "custom-spinner-form" })
    const inputField = GM_addElement(form, "input", { type: "number", value: tabs, min: 1, max: 100, step: 1 })
    const button = GM_addElement(form, "button", { textContent: "Spin", type: "submit" })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        button.disabled = true
        console.log("Initiating spin...")
        const userIncentiveId = await getIncentiveUUID()
        if (!userIncentiveId) {
            throw new Error("Failed to get userIncentiveId")
        }
        const res = await Promise.allSettled(Array.from({ length: !!inputField?.value ? parseInt(inputField.value) : tabs }, () => initiateSpin(userIncentiveId)))
        console.table(res)

        const result = {
            succeeded: 0,
            failed: 0,
            totalAmount: 0,
            errors: []
        }

        res.forEach(({ status, value, reason }) => {
            if (status !== "fulfilled") {
                console.error("Failed to spin", reason)
                result.failed++
                result.errors.push(reason)
                return
            }
            const { data, errors } = value

            if (errors) {
                console.error("Validation error", errors)
                result.failed++
                result.errors.push(errors.join(", "))
                return
            }

            if (!data.incentivesRedeem?.success) {
                console.error("Rejected from server", data.incentivesRedeem?.code)
                result.failed++
                result.errors.push(data.incentivesRedeem?.code)
                return
            }

            console.log("Spin result", data?.userIncentive?.redemptionMetadata)
            result.succeeded++
            result.totalAmount += parseInt(data?.userIncentive?.redemptionMetadata?.reward?.targetAmount?.value)


        })
        console.table(result)
        alert(JSON.stringify(result))

    })

}, 3000)
