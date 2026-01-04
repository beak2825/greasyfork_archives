// ==UserScript==
// @name         MarsColony land locator
// @namespace    http://chninkel/marscolony/landlocator
// @version      8.0
// @description  Search any plot by number and enhanced UI
// @match        https://app.marscolony.io/
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://pbs.twimg.com/profile_images/1471052569820766210/ulB7Ou7g_200x200.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438262/MarsColony%20land%20locator.user.js
// @updateURL https://update.greasyfork.org/scripts/438262/MarsColony%20land%20locator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLNYaddress = "0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0"

    window.POI = {
        curiosity: [137.39398922771218, -4.751091782006921],
        perseverence: [77.44137704372407, 18.43264977668947],
    }
    window.goToCuriosity = function () {
        window.goToLongLat(...window.POI.curiosity, 7);
    }
    window.goToPerseverence = function () {
        window.goToLongLat(...window.POI.perseverence, 7);
    }

    /////////////////////// CNNY / ONE / USD /////////////////////////////
    window.clny_usd_rate = NaN
    window.clny_one_rate = NaN
    async function updateRate() {
        const USDC = ['0xbf255d8c30dbab84ea42110ea7dc870f01c0013a', 1666600000];
        const CLNY = ['0xcd818813f038a4d1a27c84d24d74bbc21551fa83', 1666600000];

        const get = async ([ticker, chainId]) => {
            const resp = await fetch(`https://api2.sushipro.io/?action=get_pair&chainID=${chainId}&pair=${ticker}`)
            if (!resp.ok) return
            const data = await resp.json()
            return data[0]
        }

        const [harmonyData, clnyData] = await Promise.all([
            get(USDC),
            get(CLNY)
        ])

        if (!harmonyData.Token_1_reserve || !clnyData.Token_1_reserve) {
            return
        }
        window.clny_one_rate = clnyData.Token_2_reserve / clnyData.Token_1_reserve
        window.one_usd_rate = harmonyData.Token_1_reserve / harmonyData.Token_2_reserve
        window.clny_usd_rate = window.clny_one_rate * window.one_usd_rate
    }
    window.setInterval(updateRate, 30 * 1000)
    updateRate()
    ////////////////////////////////////////////////////////////////


    const cos = (val) => Math.cos(val * Math.PI / 180)
    const acos = (val) => Math.acos(val) / Math.PI * 180
    const long = (value) => (value - 150 / 2) / 150 * 360
    const lat = (value) => {
        if (value === 70) {
            return 0
        } else if (value < 70) {
            return 90 - acos(cos(90) + (70 - value) * (cos(10) - cos(90)) / 70)
        } else {
            return 1 - lat(140 - value)
        }
    }
    window.goToLongLat = function (longitude, latitude, zoom = 5) {
        return window.view.goTo({
                target: [longitude, latitude],
                zoom: zoom,
                tilt: 0,
                heading: 0
            })
            .catch(function (error) {
                if (error.name != "AbortError") {
                    console.error(error);
                }
            })
    }
    window.goToLand = function (landNumber) {
        const x = (0 + landNumber) % 150
        const y = Math.floor((0 + landNumber) / 150)
        const longitude = long(x - .25);
        const latitude = lat(y + .5);
        return window.goToLongLat(longitude, latitude)
    }


    window.totalCLNY = function () {
        const statsDiv = $('a:contains(Account)').parent().find('> div > div > div')
        const clnyEarnedMC = parseFloat(statsDiv.eq(0).find('> div:eq(1) > span').text())
        const clnyEarnedSLP = parseFloat(statsDiv.eq(1).find('>div:eq(0) aside > span').text())
        const totalEarned = clnyEarnedMC + clnyEarnedSLP
        if (!totalEarned) return
        return totalEarned
    }


    window.updateTotalCLNY = function () {
        const sibling = $('.mars_nav__menu_item--desktop:eq(0)')
        if (!sibling) {
            window.updateTotalEarned(null)
        } else {
            window.updateTotalEarned(window.totalCLNY())
        }
    }
    window.setInterval(window.updateTotalCLNY, 1000)


    // search bar
    function injectSearchLand() {
        const sibling = $('.mars_nav__menu_item--desktop:eq(0)')[0]
        if (!sibling) return

        const existingNode = document.getElementById('searchLand')
        if (existingNode) {
            existingNode.parentNode.removeChild(existingNode)
        }

        const newNode = document.createElement('div')
        newNode.id = 'searchLand'
        newNode.className = 'mars_nav__menu_item mars_nav__menu_item--desktop'
        newNode.innerHTML = `<label for="landSearchInput">Search Land #</label><input type="search" id="landSearchInput" name="landSearchInput" placeholder="00000" pattern="\\d{1,5}" data-valid-example="12345" maxlength="5" size="7">`
        sibling.parentNode.insertBefore(newNode, sibling.nextSibling)

        var input = document.getElementById("landSearchInput")

        // Execute a function when the user releases a key on the keyboard
        input.addEventListener("keyup", function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                event.preventDefault();
                if (/\d{1,5}/.test(input.value)) {
                    window.goToLand(input.value)
                }
            }
        });
    }
    injectSearchLand()

    // total earnings in usd
    window.updateTotalEarned = function (totalClny) {
        const sibling = document.getElementById('searchLand')
        if (!sibling) return

        let targetNode = document.getElementById('totalEarned')
        if (!totalClny) {
            if (targetNode) {
                targetNode.parentNode.removeChild(targetNode)
            }
            return
        }

        let text = `Earned ${totalClny.toLocaleString("en", {minimumFractionDigits: 3, maximumFractionDigits: 3})} CLNY`
        if (window.clny_one_rate) {
            const one = window.clny_one_rate * totalClny
            text += `&nbsp;|&nbsp;<small title="1 CLNY = ${window.clny_one_rate.toLocaleString("en", {maximumFractionDigits: 2})} ONE">${one.toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})} ONE</small>`
        }
        if (window.clny_usd_rate) {
            const usd = window.clny_usd_rate * totalClny
            text += `&nbsp;|&nbsp;<small title="1 CLNY = ${window.clny_usd_rate.toLocaleString("en", {maximumFractionDigits: 2})} USD">${usd.toLocaleString("en", {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD</small>`
        }
        if (!targetNode) {
            targetNode = document.createElement('div')
            targetNode.id = 'totalEarned'
            targetNode.className = 'mars_nav__menu_item mars_nav__menu_item--desktop'
            targetNode.setAttribute("style", "font-family: monospace; margin-right: 20px")
            sibling.parentNode.insertBefore(targetNode, sibling.nextSibling)
        }
        targetNode.innerHTML = text
    }

    window.totalClnySupply = async () => await window.CLNY.methods.totalSupply().call() / 10 ** 18


    async function balancesOfAddr(addr) {
        const balanceOne = await window.xweb3.eth.getBalance(addr)
        const balanceClny = parseFloat(window.xweb3.utils.fromWei(await window.CLNY.methods.balanceOf(addr).call()))
        return [balanceOne / 10 ** 18, balanceClny, addr]
    }

    window.treasuryBalance = async function () {
        const addr = await window.GM.methods.treasury().call()
        return balancesOfAddr(addr)
    }

    window.liquidityBalance = async function () {
        const [CLNY_LIQUIDITY, CLNY_LIQUIDITY_BUFFER] = await Promise.all([
            window.GM.methods.liquidity().call(),
            window.LM.methods.clnyPool().call()
        ])
        return (await Promise.all([balancesOfAddr(CLNY_LIQUIDITY), balancesOfAddr(CLNY_LIQUIDITY_BUFFER)]))
          .reduce((acc, [one, clny]) => {
            return [acc[0]+one, acc[1]+clny]
          }, [0, 0])
    }

    window.updateTokenomics = async function () {
        const sibling = document.getElementById('navDiv')
        if (!sibling) return

        let targetNode = document.getElementById('treasury')
        if (!targetNode) {
            targetNode = document.createElement('div')
            targetNode.id = 'treasury'
            targetNode.className = 'panel'
            targetNode.setAttribute("style", "z-index: 999; font-family: monospace; position: fixed; bottom: 15px; left: 5px; background: linear-gradient(rgb(40, 40, 48) 0%, rgb(0, 0, 0) 100%); color: white; padding: 5px;")
            sibling.parentNode.insertBefore(targetNode, sibling.nextSibling)
        }

        const [
            [treasuryONE, treasuryCLNY, treasuryAddr],
            [liquidityONE, liquidityCLNY],
            totalsupply
        ] = await Promise.all([
            window.treasuryBalance(),
            window.liquidityBalance(),
            window.totalClnySupply()
        ])
        const circulatingSupply = totalsupply - treasuryCLNY - liquidityCLNY
        let treasuryTotalOneTxt = ""
        let liquidityTotalOneTxt = ""
        let totalsupplyUsdTxt = ""
        let marketcap = ""
        if (window.clny_one_rate && window.clny_usd_rate && window.one_usd_rate) {
            const treasuryTotalOne = (treasuryCLNY * window.clny_one_rate) + treasuryONE
            treasuryTotalOneTxt = `<small> | ${treasuryTotalOne.toLocaleString("en", {maximumFractionDigits: 0})} ONE | ${(treasuryTotalOne * window.one_usd_rate).toLocaleString("en", {maximumFractionDigits: 0})} USD</small>`
            const liquidityTotalOne = liquidityCLNY * window.clny_one_rate + liquidityONE
            liquidityTotalOneTxt = `<small> | ${liquidityTotalOne.toLocaleString("en", {maximumFractionDigits: 0})} ONE | ${(liquidityTotalOne * window.one_usd_rate).toLocaleString("en", {maximumFractionDigits: 0})} USD</small>`
            const totalsupplyUsd = totalsupply * window.clny_usd_rate
            totalsupplyUsdTxt = `<small> | ${totalsupplyUsd.toLocaleString("en", { maximumFractionDigits: 0 })} USD</small>`
            marketcap = circulatingSupply * window.clny_usd_rate
        }
        targetNode.innerHTML = `<p style="text-align: left">
            <a href="https://explorer.harmony.one/address/${treasuryAddr}"
            target="_blank" style="color: white">Treasury</a>: ${Math.round(treasuryONE).toLocaleString()} ONE + ${Math.round(treasuryCLNY).toLocaleString("en", {maximumFractionDigits: 3})} CLNY ${treasuryTotalOneTxt}
            <br/>
            Liquidity: ${Math.round(liquidityCLNY).toLocaleString("en", {maximumFractionDigits: 3})} CLNY ${liquidityTotalOneTxt}
            <br/>
            Total CLNY supply: ${totalsupply.toLocaleString("en", { maximumFractionDigits: 0 })} ${totalsupplyUsdTxt}
            <br/>
            Circulating CLNY supply : ${circulatingSupply.toLocaleString("en", { maximumFractionDigits: 0 })}
            <br/>
            Market Cap : ${marketcap.toLocaleString("en", { maximumFractionDigits: 0 })} USD
        </p>
        `
    }
    window.setInterval(window.updateTokenomics, 60 * 1000)
    window.setTimeout(window.updateTokenomics, 30 * 1000)

})();