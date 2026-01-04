// ==UserScript==
// @name         Harmony Explorer tweaks
// @namespace    http://chninkel/explorer.harmony.one/tweaks
// @version      0.18
// @description  Improve UX 
// @match        https://explorer.harmony.one/*
// @match        https://beta.explorer.harmony.one/*
// @icon         https://pbs.twimg.com/profile_images/1042602345979211776/HGlJ9PPI_400x400.jpg
// @grant        none
// @license      MIT
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require       https://cdn.jsdelivr.net/npm/ethereum-blockies@0.1.1/blockies.min.js
// @downloadURL https://update.greasyfork.org/scripts/438988/Harmony%20Explorer%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/438988/Harmony%20Explorer%20tweaks.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let myWalletAddr = null

    const dexscreenerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="#fff" fill-rule="evenodd" viewBox="0 0 252 300" focusable="false" class="chakra-icon css-euf446"><path d="M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 003.84 5.845zM126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589-.012-.005-.02-.012-.029-.018-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197"></path><path d="M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a41.926 41.926 0 015.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a41.865 41.865 0 015.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z"></path></svg>`
    const iconSushiSwap = "https://fastly.dexscreener.io/img/dexes/sushiswap.png"
    const iconViperSwap = "https://fastly.dexscreener.io/img/dexes/viperswap.png"
    const harmonApeBananaIconSvg = `<path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="4.909" d=" M37.2400016784668,-36.7859992980957 C36.00199890136719,-35.553001403808594 34.02299880981445,-33.49800109863281 31.81399917602539,-30.774999618530273 C25.819000244140625,-23.382999420166016 22.756000518798828,-16.77400016784668 22.047000885009766,-15.317000389099121 C17.368000030517578,-5.693999767303467 2.9709999561309814,10.295999526977539 -11.401000022888184,19.40399932861328 C-35.180999755859375,34.472999572753906 -60.07500076293945,31.451000213623047 -65.31800079345703,43.58000183105469 C-65.86699676513672,44.849998474121094 -67.5469970703125,48.736000061035156 -66.22699737548828,52.821998596191406 C-64.9800033569336,56.685001373291016 -61.61000061035156,58.99599838256836 -58.27799987792969,60.74599838256836 C-44.821998596191406,67.81199645996094 -28.847000122070312,67.37699890136719 -25.854000091552734,67.26599884033203 C-19.04400062561035,67.01499938964844 -8.329999923706055,65.92400360107422 4.619999885559082,61.40999984741211 C13.001999855041504,58.487998962402344 25.518999099731445,54.125 36.93000030517578,43.9379997253418 C54.69900131225586,28.07699966430664 67.5469970703125,-0.6620000004768372 59.38199996948242,-25.665000915527344 C57.29399871826172,-32.060001373291016 54.27299880981445,-36.84600067138672 52.104000091552734,-39.83100128173828 C50.909000396728516,-47.99399948120117 48.902000427246094,-54.340999603271484 47.20600128173828,-58.750999450683594 C46.029998779296875,-61.810001373291016 45.22999954223633,-63.34600067138672 43.59199905395508,-64.36699676513672 C38.06700134277344,-67.81199645996094 27.344999313354492,-62.79499816894531 26.85099983215332,-57.96200180053711 C26.54199981689453,-54.94599914550781 30.41200065612793,-53.92100143432617 33.88100051879883,-47.67100143432617 C36.10499954223633,-43.6619987487793 36.92399978637695,-39.73899841308594 37.2400016784668,-36.7859992980957z"></path>`

    const knownSushiSwapPairs = {
        "0xcd818813f038a4d1a27c84d24d74bbc21551fa83": "CLNY/WONE",
        "0x194f4a320cbda15a0910d1ae20e0049cdc50916e": "WONE/1DAI",
        "0xbf255d8c30dbab84ea42110ea7dc870f01c0013a": "WONE/1USDC",
        "0xeb049f1ed546f8efc3ad57f6c7d22f081ccc7375": "1ETH/WONE",
        "0xc5b8129b411ef5f5be22e74de6fe86c3b69e641d": "1ETH/1DAI",
        "0x02f4d0021e3cb8736108e11c8df02fbbd6eeedbf": "1ETH/1USDT",
    }
    const knownViperSwapPairs = {
        "0x4db87db6eadb02c5612eb4cf522d8188fb80a9ad": "ROY/WONE",
        "0xbbdcb6445b06df78db0b67ea3a0a03e16dc59936": "PLTS/1DAI",
        "0xf170016d63fb89e1d559e8f87a17bcc8b7cd9c00": "WONE/1USDC",
        "0xf8f306122438fa9a4356ad61d0b1d56bd31e7b3e": "WONE/1DAI",
        "0x529be44dc5379ce49cd91141740f6b11d9246757": "APE/WONE",
        "0xe1ec7f78877860d7ab6e59dc415f54aa0a764f99": "bscBNB/VIPER",
        "0x54c59cc0ad2ec1de3c5b7057d900d306f16453ef": "IRIS/WONE",
        "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3": "PLTS/WONE",
    }

    const knownHRC20 = {
        "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a": {
            name: "Wrapped One",
            imgsrc: "https://assets.coingecko.com/coins/images/18183/small/wonelogo.png"
        },
        "0x6b175474e89094c44da98b954eedeac495271d0f": {
            name: "Dai",
            imgsrc: "https://assets.coingecko.com/coins/images/9956/small/4943.png"
        },
        "0xef977d2f931c1978db5f6747666fa1eacb0d0339": {
            name: "1DAI",
            imgsrc: "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/harmony/assets/0xEf977d2f931C1978Db5F6747666fa1eACB0d0339/logo.png"
        },
        "0x985458e523db3d53125813ed68c274899e9dfab4": {
            name: "USD Coin (1USDC)",
            imgsrc: "https://raw.githubusercontent.com/sushiswap/logos/main/network/harmony/0x985458E523dB3d53125813eD68c274899e9DfAb4.jpg"
        },
        "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f": {
            name: "Tether USD (1USDT)",
            imgsrc: "https://raw.githubusercontent.com/sushiswap/logos/main/network/harmony/0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f.jpg",
        },
        "0xb1f6e61e1e113625593a22fa6aa94f8052bc39e0": {
            name: "Binance Coin",
            imgsrc: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png"
        },
        "0x44ced87b9f1492bf2dcf5c16004832569f7f6cba": {
            name: "USD Coin (bscUSDC)",
            imgsrc: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png"
        },
        "0x6983d1e6def3690c4d616b13597a09e6193ea013": {
            name: "Wrapped ETH (1ETH)",
            imgsrc: "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/harmony/assets/0x6983D1E6DEf3690C4d616b13597A09e6193EA013/logo.png"
        },
        "0xd32858211fcefd0be0dd3fd6d069c3e821e0aef3": {
            name: "Plutus",
            imgsrc: "https://plutus.hermesdefi.io/plutus-logo.png"
        },
        "0x85fd5f8dbd0c9ef1806e6c7d4b787d438621c1dc": {
            name: "IRIS",
            imgsrc: "https://plutus.hermesdefi.io/hermes-logo-1.png"
        },
        "0xcf1709ad76a79d5a60210f23e81ce2460542a836": {
            name: "TRANQ Token (Tranquil Finance)",
            imgsrc: "https://assets.coingecko.com/coins/images/18708/large/tranquil.png?1633060587"
        },
        "0x22d62b19b7039333ad773b7185bb61294f3adc19": {
            name: "stONE (Tranquil stONE)",
            imgsrc: "https://1364360076-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MklS-PpDkzIpV8b2QzU%2Fuploads%2FMRfuMS0GHPn7DcUS6xLB%2Fimage.png?alt=media&token=66323093-6dc8-4844-b2c1-9f93e8c4c622"
        },
        "0xfe1b516a7297eb03229a8b5afad80703911e81cb": {
            name: "Royale",
            imgsrc: "https://assets.coingecko.com/coins/images/20668/small/ROY_logo_new_design_small.png"
        },
        "0x0d625029e21540abdfafa3bfc6fd44fb4e0a66d0": {
            name: "CLNY",
            imgsrc: "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/harmony/assets/0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0/logo.png",
        },
        "0x9b68bf4bf89c115c721105eaf6bd5164afcc51e4": {
            name: "Freyala (XYA)",
            imgsrc: "https://dashboard-assets.dappradar.com/document/11173/freyala-dapp-games-harmony-logo-166x166_d0bfe10ec80e2f0ea97d266c0737552f.png"
        },
        "0x0dc78c79b4eb080ead5c1d16559225a46b580694": {
            name: "Euphoria (WAGMI)",
            imgsrc: "https://cdn.isthiscoinascam.com/logo/w/wagmi-128xe0daff26e177b454577cf27d8248b338.png"
        },
        "0x72cb10c6bfa5624dd07ef608027e366bd690048f": {
            name: "DeFi Kingdoms (JEWEL)",
            imgsrc: "https://assets.coingecko.com/coins/images/18570/small/fAisLIV.png?1632449282"
        },
        "0xd3a50c0dce15c12fe64941ffd2b864e887c9b9e1": {
            name: "HarmonApe",
            imgsrc: "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/tokens/APE.png"
        }
    }
    const knownConstracts = {
        "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506": {
            name: "SushiSwap",
            imgsrc: iconSushiSwap
        },
        "0xf012702a5f0e54015362cbca26a26fc90aa832a3": {
            name: "ViperSwap",
            imgsrc: iconViperSwap
        },
        "0x8c8dca27e450d7d93fa951e79ec354dce543629e": {
            name: "Hermes DeFi (Masterchef)",
            imgsrc: "https://www.hermesdefi.io/favicon.png"
        },
        "0xdc01ac238a0f841a7750f456bfcf1ede486ce7a1": {
            name: "Hermes DeFi PlutusMinChefVault (pSushiUSDC-ONE)",
            imgsrc: "https://www.hermesdefi.io/favicon.png"
        },
        "0x3074cf20ecd1cfe96b3ee43968d0c426f775171a": {
            name: "Hermes DeFi (Bank contract)",
            imgsrc: "https://www.hermesdefi.io/favicon.png"
        },
        "0xae3b27d1d16b5364398266ac1dcafcdd22fe471f": {
            name: "Hermes DeFi (IDO contract)",
            imgsrc: "https://www.hermesdefi.io/favicon.png"
        },
        "0x148f943e639fb32fd2899e1fa545b9350ace3d11": {
            name: "Plutus Sushi USDT-USDC (pSushiUSDT-USDC)",
            imgsrc: "https://www.hermesdefi.io/favicon.png"
        },
        "0x42813a05ec9c7e17af2d1499f9b0a591b7619abf": {
            name: "NFTKEY",
            imgsrc: "https://nftkey.app/favicon-32x32.png?v=2fc77898ace59ed67c2f0d8bc51bfc8c"
        },
        "0x0d112a449d23961d03e906572d8ce861c441d6c3": {
            name: "MarsColony game manager",
            imgsrc: "https://app.marscolony.io/favicon.ico"
        },
        "0xe3ff96e6020b8606f923518704970a7afa73dc3f": {
            name: "ColonyChef (MarsColony LP)",
            imgsrc: "https://app.marscolony.io/favicon.ico"
        },
        "0x64fb4d2e9fb7c0b363372e5b67744bb6c164c405": {
            name: "Harmony World",
            imgsrc: "https://harmonyworld.one/favicon.ico"
        },
        "0x5d1eb6f7311338cd137e78c89efff75a00a9765a": {
            name: "Harmonapes NFT",
            imgsrc: "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/tokens/APE.png"            
        }
    }

    function makeDexscreenerLink({
        address,
        content
    }) {
        return `
        <a 
          href="https://dexscreener.com/harmony/${address}" 
          target="_blank"
         >
          ${content}
        </a>
      `
    }

    function makeAddrInfo(address) {
        let data = null
        if (myWalletAddr && address == myWalletAddr) {
            data = {
                name: "my wallet",
                imgsrc: "https://metamask.io/icons/icon-48x48.png"
            }
        } else if (address in knownHRC20) {
            data = knownHRC20[address]
        } else if (address in knownConstracts) {
            data = knownConstracts[address]
        } else if (address in knownSushiSwapPairs) {
            data = {
                name: knownSushiSwapPairs[address],
                details: knownSushiSwapPairs[address],
                imgsrc: iconSushiSwap,
                wrapper: makeDexscreenerLink
            }
        } else if (address in knownViperSwapPairs) {
            data = {
                name: knownViperSwapPairs[address],
                details: knownViperSwapPairs[address],
                imgsrc: iconViperSwap,
                wrapper: makeDexscreenerLink
            }
        } else {
            return
        }
        const content = `
        <img style="
              border-width: 0;
              box-sizing: border-box;
              position: relative;
              width: 16px;
              height: 16px;
              margin-top: 0px;
              margin-inline: 2px 0px;
              margin-bottom: 0px;
              margin-inline-start: 4px;          
          " 
           src="${data.imgsrc}" 
           title="${data.name}"
          />
        ${data.details || ""}
      `
        return `<span class="userscripts-stuff" style="margin-right: 4px;">
          ${data.wrapper && data.wrapper({address, content}) || content}
        </span>`
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function getAttributeCell(attrName) {
        const row = $(`#scrollBody header + div:first-of-type > div > div:last-child > div:first > div > div:has(span:contains(${attrName}))`)
        //const row = addrDescriptionElement.find(`> div:has(span:contains(${attrName}))`)
        //console.debug("row", row.get(0))

        const cell = row.find('> span:last-child')
        //console.debug("cell", cell.get(0))

        const text = cell.text()
        //console.info(`${attrName} :`, text)
        return cell
    }

    function enhancedLinks(jqElements) {
        const addrLinks = $('a:not(.userscript-enhanced)[href^="/address/"]', jqElements)
        //console.log("addrLinks", addrLinks.get())

        addrLinks.each(function () {
            const address = $(this).attr("href").split('/address/')[1]
            //console.log(this, address)
            const additionalInfo = makeAddrInfo(address)
            if (additionalInfo) {
                $(this).append(additionalInfo).addClass("userscript-enhanced")
            }
        })
    }

    function enhanceAddressPage() {
        //console.debug("enhanceAddressPage") 
        const address0x = document.location.pathname.split('/address/')[1]
        const tokenNameCell = getAttributeCell("Name")

        if ([
                "SushiSwap LP Token",
                "Venom LP Token"
            ].includes(tokenNameCell.text())) {
            tokenNameCell.append(makeAddrInfo(address0x))
        }

        enhancedLinks()
        $('tr > th + td div>span>div:contains(42aa65f4)').text('MarsColony:claimEarned')
        $('tr > th + td div>span>div:contains(feb88406)').text('NFTKey:TokenDeListed (feb88406)')
        $('tr > th + td div>span>div:contains(b43d901d)').text('NFTKey:TokenListed (b43d901d)')
    }

    function enhanceTransactionPage() {
        //console.debug("enhanceTransactionPage")
        enhancedLinks()
    }

    let lastUrl = window.document.location.pathname
    let lastWalletAddr = myWalletAddr

    function onNewContent() {
        console.debug("onNewContent, lastWalletAddr, myWalletAddr :", lastWalletAddr, myWalletAddr)
        $('#connectWalletButton').prop('disabled', !!myWalletAddr)
        if (window.document.location.pathname != lastUrl || lastWalletAddr != myWalletAddr) {
            // cleaning
            $('.userscripts-stuff').remove()
            lastUrl = window.document.location.pathname
            lastWalletAddr = myWalletAddr
        }


        if (document.location.pathname.startsWith('/address/')) {
            enhanceAddressPage()
        } else if (document.location.pathname.startsWith('/tx/')) {
            enhanceTransactionPage()
        } else {
            enhanceTransactionPage()
        }
        fixMaxWidth()
        injectGoToMyAddr()
        watchForChanges()
    }

    function watchForChanges() {
        $('#scrollBody header + div:first-of-type').one('DOMSubtreeModified', debounce(onNewContent, 500))
    }

    function injectGoToMyAddr() {
        if (window.ethereum && window.ethereum.selectedAddress) {
            if ($('#goToMyAddr').length == 0) {
                const button = $(`<a id="goToMyAddr" href="/address/${window.ethereum.selectedAddress}" title="Go to my address" class="userscripts-stuff">&nbsp;</a>`)
                button.appendTo($('header'))
            }
        } else {
            $('#goToMyAddr').remove()
        }

    }

    function fixMaxWidth() {
        $('#scrollBody > div:last > div:first > div:first')
            .css('max-width', '100%')
            .find('> div').css("max-width", "100%")
    }


    ///////////////// METAMASK STUFF ////////////////////
    if (typeof window.ethereum != 'undefined') {

        window.ethereum.on('accountsChanged', function (accounts) {
            //console.info("metamask accountsChanged", accounts)
            myWalletAddr = window.ethereum.selectedAddress
            $('#connectWalletButton').prop('disabled', !!myWalletAddr)
            onNewContent()
        })

        async function connectWallet() {
            //console.info("trying to connect wallet")
            try {
                await window.ethereum.request({
                    method: 'eth_requestAccounts'
                })
                myWalletAddr = window.ethereum.selectedAddress
                $('#connectWalletButton').prop('disabled', !!myWalletAddr)
            } catch (error) {
                console.warn(error)
            }
        }

        if ($('#connectWalletButton').length == 0) {
            const button = $(`<button id="connectWalletButton">Connect wallet</button>`)
            if (!myWalletAddr) {
                button.on('click', connectWallet)
            } else {
                button.prop('disabled', true)
            }
            //console.info("creating Connect wallet button", window.ethereum.selectedAddress)
            button.appendTo($('header'))
        }

        window.setTimeout(() => {
            if (myWalletAddr != window.ethereum.selectedAddress) {
                myWalletAddr = window.ethereum.selectedAddress
                onNewContent()
            }
        }, 500)
    }


    watchForChanges()


})();