// ==UserScript==
// @name The-West Calc
// @version 1.37
// @description The-West Battle Calc, Notepad, Battle stats, Duel Calc, Duel list, Craft list, Job list, Wardrobe, Tombola analyser
// @author theTim, Tom Robert
// @website http://tw-calc.net
// @include	https://*.the-west.*/game.php*
// @include	https://*.the-west.com.*/game.php*
// @include	https://*.tw.innogames.*/game.php*
// @exclude https://classic.the-west.net*
// @grant none
// @namespace https://greasyfork.org/users/219347
// @downloadURL https://update.greasyfork.org/scripts/373245/The-West%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/373245/The-West%20Calc.meta.js
// ==/UserScript==

window.TWCalc_inject = function () {

    if (document.getElementById('TWCalc_js')) return;

    window.TWCalcjs = document.createElement('script');
    TWCalcjs.setAttribute('type', 'text/javascript');
    TWCalcjs.setAttribute('language', 'javascript');
    TWCalcjs.setAttribute('id', 'TWCalc_js');
    TWCalcjs.innerHTML = "var _TWCalc_int = setInterval(" + (function () {

        clearInterval(_TWCalc_int);

        Array.min = function (array) {
            return Math.min.apply(Math, array);
        };

        window.TWCalc_updaterCallback = function (data) {

            try {

                var currentVersion = TW_Calc.version;

                if ((data.version != currentVersion) && (data.beta_version != currentVersion)) {

                    if (west.gui.Dialog !== undefined) {

                        new west.gui.Dialog(TW_Calc.getTranslation(78), '<div class="txcenter">' + TW_Calc.getTranslation(77) + '</div><div><br />' + TW_Calc.getTranslation(79) + ': ' + currentVersion + '<br />' + TW_Calc.getTranslation(111) + ': ' + data.version + '<br/></br><b>' + TW_Calc.getTranslation(112) + '?</b></br>' + data.news + '</div>', west.gui.Dialog.SYS_WARNING)
                        .addButton('Download', function () {
                            window.open(TW_Calc.updateURL);
                        }).addButton(TW_Calc.getTranslation(80), function () {}).show();

                    } else {

                        var update = confirm(TW_Calc.getTranslation(77) + '\n\n' + TW_Calc.getTranslation(79) + ': ' + TW_Calc.version + '\n' + TW_Calc.getTranslation(111) + ': ' + data.version);

                        if (update) {
                            window.open(TW_Calc.updateURL);
                        }

                    }

                }

                if (TW_Calc.storage.get("LANG_PACK_RESET") === null || TW_Calc.storage.get("LANG_PACK_RESET") !== data.resetLangPack) {
                    TW_Calc.storage.remove("LANG_PACK_LAST_UPDATE");
                    TW_Calc.storage.add("LANG_PACK_RESET", data.resetLangPack);
                    console.log("TW CALC LANG PACK RESET");
                }

            } catch (e) {

                new TW_Calc.Error(e, 'UPDATER ERROR! IMPORTANT, YOUR WESTCALC MAY BE OUTDATED, CHECK THE LATEST VERSION NOW!').show();

            }

        };

        window.TW_Calc = {
            scriptName: "The-West Calc",
            version: "1.37",
            gameMAX: Game.version.toString(),
            author: ["MarcusJohnyEvans", "Tom Robert"],
            gameMIN: "1.36",
            website: "https://tw-calc.net",
            updateURL: "https://tw-calc.net/script/TW-Calc.user.js",
            updateURL_SPONSORED: "http://adf.ly/1INaPB",
            shortName: "tw-calc",
            birthday_enabled: true,
            birthday: {
                month: 11,
                day: 16
            },
            Wardrobe_bannedLocales: ["hu_HU"],
            ShowUntranslated: false,
            UseLocalLanguagePack: false,
            ShowLogs: false,
            bottomImg: 'iVBORw0KGgoAAAANSUhEUgAAAEMAAABDCAMAAADwFEhBAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAL9UExURQAAAAMAAAcEAwUCAgUCAgMAAAQBAQMAAAMAAAMAAAMAAAUCAQMBAAMAAAQBAQUCAgQBAAMAAAQBAQMAAAYDAgYDAgMAAAMAAAMAAHZcU2VPRREMCINgXbaimCogG2ZJRk88MiAXFB4TDjMnIg0IBSIZFBUNCEU3KDgqHyMbElNBOWpRTDoqJUg4MVRAOTYnGkouG6KBc2NCJs+2n3RiT2hVSiUdGDMjGlNBJS4iFzYmF6qUjoRpWishHFxJPnBcUF1GM62Me452YKqTf0o4N15LPkk5MMi0pIdvXWNQSEIyIyAbGKOMcL6biZh3bIdwZMyslHpgK4RuXk48M72Mg39YUb2Mhc2mkmtlVFtHPg4KCGxVSqaZfKOWeJ+SdaSYeZ+WdaaZeGmQK46CaGyUMHCYNHScOXegPHukQUdBNGWMKHJoUlZ8F5yPci8mHmddTFF2EIl+ZUk3LnCFOExDN6WYe1FJO4J1XmuAM1FBODw1LHxyW1+HImN4KlpDPUQ+MJK9W11VRFlQQY++TqCTd3huWFE8N4CqR6OWdVRNPkM1LUM4LzgwKDkrKGxkUIZ8YqmZfJmMbpyPdZmPcpGFajUpJUIvLCkgGoN4YYu2UXxnWLWbf5OJbGFYR1lJQF9FQmlUTHZjUYJrXIWvS2V6LFuBHJh+aU8wHUs9NlM/P29aUTwpHW5URCEbFY9taZaJbnVrVpaMbk5GOH90XUAzK0k5NUItIV9MRYx+ZXxaWlA6M1w8JoFnUI64V4iyUE5zDUtwC5XAX0drBpl/dWVbR0s2NFtCNG1OSbWfiIlhYYJpY6GWd5mMclQ6LD4vKUw4KXVQTo50XnRWUWFKOI92bYlxYTglFp2DbqaIeHWGPaLQaFN2FWuUK52SdGJSR4xoXnRaSXViTHttW5Z2ZH6JSWlPPn9eTqaObn1hWGBLP4tqUrKXdoZuZnFNL5yEd1BwEmFbR0Q+NJ+MgMWkhZF9cqDNZp+PdWZCQYx7VMq9tr2sq2WMJ5aFWKaWgoOFTKjYpjkAAABcdFJOUwAiPEgoGi4GFA6RjJc0cEJofE5iV6Bcg3b+/bX+/Fr+nt7Qeqvtwa3itPHZ7dvE7PX5/fXav5Py3MfV/vWn3avv3e/xJBBMyi6X8PbzpRrMafaBefz8Yu0GcHz06vg14gAACfJJREFUWMOdmAdUWlkaxyMg2MXeSzTV9N4nPZPMzuzstC3nvPeAvG0sAoEoBNzgwiCDIBpR0VjRbOwVe9lqd2KJJZp1E9PLpJepu3vO3vd4gCmmzN+j5/Dw/s7/++53v3vvmzfvlaKZNe/Haf/BA786tGHZsvUbwj8JpTo4vjXolwc/fjdk+/bOzur7nePVawKiVkaS3g7z05+9u+7T70MmqzsHjNX9/QPgNzh4fKXbm7vBCHeufrptqnLi7kDY6EhwdWtYWNjAturgdyLfjLL/57vX5eT05YT8MHXpfy3G0da7wY/Hy1TdAZ3lA63VyyIpgPIaxMEPfpHzJOcOoPxwdSxGmlmVyZMm5hsMurLWsrKCkZnPVnrav9rK/o93P7l55785T24WK6SZvKT4eDabHcNma6UZkuay7u6yb7/t37WR+ior+z5YVzx5s+/mncfxVUlgeEyMySRKTBSJRCaTKV7aaCyQhYX1hi0mzW1l3841ndn3+76f0vKkj9gmU6JCntfV1cXnd+XlKRQiE7u0tbd1ZGQ8ZKe7vcPLIfvC9/YH3yqeGuBJ49kmkULelZxcmxAHlJDA4STz5QqRRNXbP2qcPLOYbPdSCC18z9StW+WTbB5O4CfXxmUJUIEARVvQlpSsuDgOn69IlIzO3EBzchaTXgoJ3ZMzdWugWIqZSExOSckSCATpdfq0um/S0upyc2tyc9HaZLnCdKnjbMfN7eGuAPI8gvLhur6pmWodyIQoLzkdghiQUq9PTb2AcBFEjyAQrlq+XD42dr1jcn0k1f752aEdCumbLASIeLaIH2ceADG4EAQjagSBYeIJlADSUjR+O3vN+tAXIOS9xWfTs7XS+JhEvhiyCmYyIBbL9hlCQVoKz/Z8dXbNYndQsrMRDhtyisUTJlAUiQ85AtsQJQtmMoEP64MagZjDr7x6/Ubf+sjnUhL6/neFRYU84OIhR1xjGXDt8L9xHb5mZSDpaD1HXlxZCYyQn4nGYUPfd5cLpVqQTk4WmmYZcP7rf+H6+s+xlkdfKlNRMefypcrKq+9EkiizjBx4f9vVQmMSWyRPjhOkKq2MfxCyMRgXuLmCuOSOmZ7egB2es4zQdhaPFxkbQCRdCYIzaUwr40+EbAwmDMJJiSucaTMErKC724zY7+koLMpOYpvkHDF6hoswiAFHX2QwYITLTRdzZoy6gignb2CEsBG69/LliXxtjCK5HtXb5gA6/xdCVsYJCHyt1KP1o/2ytsAgOskyNQ6Htk0UFUnjTXkccTooTKYlmKMnCeEMRAkrEWymkVS0PqBfVta6wplMJRiUD0Me378rjVHw69EzShiyOjn6V0I4QwmzzPUGw3UoJ7igOyBqqberOau0A7tDQkIGpDFyMK96JsyC1Qwz5ugpQmYfMIPBYMJqBGbqcxMCRlTNUVt8iazSPtn+9GmnUSt6mJCSewHYuHaU0PSpL3CdenAMfDoG/oBiA/+A6NPFASMGSf4SOgjGEW8cgeXNtx/FJ/Lj0DQYZkCnT35u1skvCFkefH4aZBWEA+vR7BGDULHcHwsGMBxXGpvLLyaxFcliNA1kjBH9+zkVDZYwkwkzuWjRZ20aodDDl2QHEkJzXDYaWF6UxJbXptTo1TATjv7dnIpWI0w1DKvT0rNv9A4KhX5eeEJoDssKVLJyKVvOScnlwiwWHP3bORXNwGoEioVrsmfutRt0znQywQhWCWVJ7DxQ5zA2/dO/mVPToEqB0lIF2QE9g+2Dzm54hdAcNrS2CVU6wGhJ1QMf0PSv59Q0CJXFYDERQflE0+Da96yM8N4ClTCDnVebUgcyymROH55TR1gsBraa4KzCoqHh9lVWRmRUQYEwI15eK6jhwqBpTf/nD3PpCFgJIFokLeFSduWl4SVWRugKmaxRJwWx1CHQiRPQtWOEHvyR0APLk2vga/ADK2svXW+v3BVhyakjaaVKotLoFJysXKw+rO2DcdzCOG7pBkqQdLD6kbrkQklTxapFfkQLcbQLl6hkqqRE0Em/gWc1ccbx04SsDBjfZ1gwKqhsaqqYv8DDyx1f/Y72oYGqUmMjmy9GU2d1D8CIJmRlgDXLwEpV3NLTNLxpkYu/uU5BQlzf6RHK8jVdCVitq1/JAJsepIbP1BdW8M6tXuDs5mnuZDQHu/Ch6zJhgwgUO8KEZzGOELIxECYLhuGss8KqqqqtLn5eZKKjgmCiAo0ajRb0oFQk9pWMXGzjTL3SwcusWL3UCQvFzKA5UBf3CDVJUlGCoE45Ox9/I2RjxMKgpWYVA0b7Zh9rKHgw3sslGp1G01WffmE24++EbAyQED1aNHGvqWLtUicPL9vm4GjvulQjbDDkS2oFqTZG7Pl/Ejpve8hlIuKnbSUlH2E2LO0UN0LxXlJapmmTJCags3IKFg/W+hixsyY8Ny2u8waPV/IRZoNs26NowIhzqXBIZyhViOvTrXureRoYLLUNgrZcKQ64Pty+eouLM2iEdrZNGxghbxkbztAJJfLhtYQTJoSVEyh+tXXjg1o4/LMdPWurzm31wWxQZ51AgBGq1+YeIU+olcQ3DYrxlQEaBcQyH4FYFiOVeZMdTSXtVasWuPi5ec62gU8NaeMSjUaok+Rrz5nk/JQzCOg1EAPb19QwC/kSp1zm3C8ea+/4amEQiMTXnfLMGQYzQt7xXv5wQ2lp4yOwW6WkYsWEME+w4BMnQG9jqhlK7pXsq5Xtmbx7u4Jc8EieO5BhafXcseTi7QZtfkFZMz+uDmHFwhhFjXcdGEoXF01kD1WUVGUuwRB0zxdPl1g03htXjGkamwcLWu9e4cS1pHOxg1gsaBncmpQrhYGVbWMlFSX31u9wcfKje5NePKDSHB0oGIQdI2oLEzZ3jgfUczhXsrJSBFniBA7faLwly+SdKzm3eusCgHDzJr3sImOGeAQtv63TZBhUpeXZF/NFFy8ay8ubVY0yia5k7RBYaAsX+WCBvByBpwRA6C5bFxq6DTJJo0SiEuXLCkZl3brMzCZeRcnw4KoIYMIZ5IJEsX/5HQaHeHp5LIhYrgoskDVrSxt1PE1zRqYus6KJ11SxKSLIBcTh7+VJmvtGBsKxcyX7uvn5LJq/XCUbbBzSasoMGTxd0+pNCzdvWeCCm/AlgxmZ+yaFQajAipuHU1DE/FUZQ5puFa+q6icL50cEgTwAgpuvJ4lq98p7IY3mYE9xdff2wrxEzF+4SWtoAIT5i4J8nJz9/N28PN1dKfavu58CKxjF05fu7+Hs5OLigwkPwp/uixNefzkFVjAKlUQGZvw9/JydQAh+HsCCN5lExQlvctW2UIAZLzrdzc2NTvcCFkAe7N/izo9T7ChUV3d3MiZ3kiuV8lYEgoJh7CgUKpVKodhhgLd/fWHGWPRjAM+8hXndm5j/Axq+Sjd4ZUOgAAAAAElFTkSuQmCC',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAMAAABEio12AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQ4BAFtKL2pSN0IqEDcjDTQgDDAdBxQCACcSABsSCmVMNVc3IA8DAEw+MRcMBmBJMSEYDychGUUoFh0KAHNcP0EvHwoAAFpKOFVBJVRCKHxlUYhwV081GzAlGzghFB4VDGBHIy0XA1A3J3hQJ41oQlxJKCYfFYx3ZSwcDm9FJIBXMHlQH6B7VopoPE1BOj0qE1pFJ5RmKhoSC083H2ZNPHZcOZt3TpRmRWRSQV1OMVlKMFZEJzEiBlNDKUU1LW1XPZZ8bIhWNigXD5l0RHlYMXNILYRjOqp7RZh/YYVtU6iGXZRlNI1eLT4cA3BNMraEUGA+FJV3X5RlPYlcOWBMLEg4HmtbRGJFI0gyHYVTNW1ROZd0TKCNZaaTa2dBGlAsEpFzW4x2XnlVO3RHJl1HKF1INKJ+V3piQYJdN////000FR8GABoGAPn18kgxF/X08i8bBNHJwTIdCPPx8DYcAyELAR4UCkYgAlQ7HjQcDsm1omJPNDkeE9rV0FQ0FdrOwx0OA2NKLFAuFlQ6IywTBCITBUcmCy0XCTAWAquek0kwIT8nEXJHJSYYDHNnWmJBIlw7ITokCycTBEkpEunm49/TyOTb1KGVh11DKl9ILl5IJ3ZSLjsoGZGDdjwiG6+SejQiFDoeBVk/Jlg2HVAzJScKAC8bDkgqGhMAAIRrT19IOVA7NIdwW8rBtmU9G2lOMGtKIkwrDeTh4HJCG7uUdJhjNNTLxINPKryvpWhELLCZhZtyTUQdBKGFZeDX0Laqn9TNyHhdRFQoGkEqHm9JNIxdLY11XlU1Gp6MgXxVL2A8Gd3Y1GA4HaWZjtLGunpKJntHHsO7tGY4FcKvm4JZL2QvCkweBqyYipJdPX1jSNPPzDkpFbixrNG+qNnRy1lDM21VR5WJg7CAUYd2aXlwaFw2E72hiXhjTmpMKlVGN8bBvJdoPYRZPXFTPL+SZK6ln4JtYPLs5urbz8qslXBPItC9r5R5aL+1rYhdSqCLdm1CIquDaV4lCujg1mVJJMWpjVXPAa8AAADcdFJOU+v+/v7s/uvs7P6vr/2v/uz+/a/rr/7rr8j+r6+t/q/rr+z+r6/s66/9r3jO6+uvyO2v6/3+66qvr+3tr8jtr6/rr6+vocivyNnr68jI7a+v6uui68jI7aLtyOvr6evZ6/2h6+v49fbr9v/////////////////////////////////////+///////////////////////////+///////////////////////////+//////////////////////////////////////////////////////////5vmyxZAAAEkElEQVQYGQXBeUxTBwAH4N+7etGbtlBKLUWq6ISJaBSELVwuLioaJJku02k8NhPMnDrFzSsSnZubV7Y5/9hkW7LFIwuTaSaSaQaoEfFEDqEFKi09aOn5aPvat+8j5ha0x4qmABfMtigASGaP5GEIKblbGmZVplHTOEwP5QBQRgzKEAJRTT8MKwC4AQAAdIGYMJZe4NEH2MK/AR3SIm6YbYUcG9FSHJHtJiScgAQSYD5lEme2nW8433AhBeDnlo5NOedWxY8fEOi1dd8Ta7UXPrrmPjKRic3E2/cPNQENyJgGRC7g4raML4Qpkltzc+CERcyOCQo90UAGPDoxbBl24HgDJXI5Lkrnx+O+9bl3Pg5tyK45uaQqqzmjpIOt9JE9E2x4eJ75QSPpWmwN5Ne1LE3sUlKE+HDaEACM9CT6Vl5tH2qeqLp/7+IroXdtj9IDAGmdSVmfpNVjcfS6rcVDLBmNvLydD2xNY5rgfUsMTPachuazRq2iAq8PA7qzlRtxJWch8Gb5cxTUlNaTSpzFAPBrueoScMgB/LIXkNo3q4jfNWIdgHOtXoD/D2gOA+W3HQ9IAuAAAP65wKAXiH4LzOS2PwM4+V8AqmcTQOdzIN4PuCmTlYR+OzQAHnECCaYh0GAa8NE/wmSk4QFgN82n4QZdgBeA1MwsI/lxWk4BtVPM01IAy1cDqLZeAU8lvOsAAFS3GoBsNYBT3lGOIkH8EGSBaLFzZArAyywA7uiO+TOQSfykBXTZY5l7AJT2ALhsgHOMlAFZ0kIUOIzTz49iN/31Qmxm8mj/mHWymAnshKVbnRxYiVpdfCfq1z0UVJOUZYIvTB2seTTNcUQH02l2eRgJTTtMo0Rxt0/6FDaf/JaBGre0VnsrpIzCNGSnEnSDLjc/N2n0p8tkNb0WubbsxtJJVYB/3RRbEvMxkuI2tSiaoFldbDDZTlwNPiaVYYWzX2TVuJJCp/OuGB5Ph6RDJIkO61pxI35EVRHUIPk5kkY4bWmhLuEsPSVi25bPsAfjqgWd7zPWfdpwUXeECR5951loxUSlSOvYGim71bjIF5ujfKPtyfKldfkbSD935IPuqhzp+ha4J8iTV0qaU/uleRifzdTz439W7Tk45xSCxv5+o+vYMdVtaqiPJpUKfzv6XfwIdt+kAQcB429Tz87OUsr/GMxGtK/0FE7ubwckOlzbVTEswWOSiNytg33l4nv4Bgs4lCqwYseyInrVFIylr6Hu6tqHfYgCl9yIns4tsT9ZRPIp/6395GWDLafy+Is10X9HN353gFhE3FFMmu1f5rT4txzKea+W38UNt+4c9BMvk4lGQh3ZImE18AK8BKyYLenSesWAcvB6o/GRQj5mjNvkc/pQ+wA+kZE24H6K1gabsyMhAoD0k3TBRrSEwcvS3pUG8npF7Bnl3qYTX8n++RBzeeIYwVvrUWYgNjkHHJkQxoTSXtNkRO/MgFCKHrpG22/AdUUIKYAkUzDMQxsHWu9YE6Diene05AUdId18KEuVmkeIBWqXuoziHLSv6BVJasl0pKhyNafMnmkxR9QC/n+f2e8W3vECWAAAAABJRU5ErkJggg==',
            imgUrl: "//westzz.innogamescdn.com/",
            loadedPack: false
        };

        TW_Calc.inject = function () {

            window.setVal = setInterval(function () {

                if (Character && Character.playerId) {

                    try {

                        clearInterval(window.setVal);

                        TW_Calc.Settings.list = [
                            ["topBar", TW_Calc.getTranslation(185), true],
                            ["duelBar", TW_Calc.getTranslation(191), true],
                            ["Wardrobe", TW_Calc.getTranslation(175)],
                            ["MenuCraftButton", TW_Calc.getTranslation(153)],
                            ["TransferFeeCalc", TW_Calc.getTranslation(108)],
                            ["XpHpEnergyCalc", TW_Calc.getTranslation(109)],
                            ["WestCalc", TW_Calc.getTranslation(184)]
                        ];

                        TW_Calc.registerGameApi();
                        TW_Calc.Wardrobe.init();
                        TW_Calc.Craft.init();
                        TW_Calc.BattleCalc.init();
                        TW_Calc.Interface.init();
                        if (Game.environment != 'alpha')
                            TW_Calc.Chests.init();
                        TW_Calc.Quests.init();
                        TW_Calc.TombolaExporter.init();

                        TW_Calc.TombolaExporter.wof = {
                            1: TW_Calc.getTranslation(174),
                            11: TW_Calc.getTranslation(198),
                            12: TW_Calc.getTranslation(194),
                            13: TW_Calc.getTranslation(195),
                            14: TW_Calc.getTranslation(196),
                            15: TW_Calc.getTranslation(197),
                            16: TW_Calc.getTranslation(197),
                            17: TW_Calc.getTranslation(198),
                            18: TW_Calc.getTranslation(194),
                            19: TW_Calc.getTranslation(195),
                        };

                        window.TW_Calc_AlarmClock = setInterval(TW_Calc.AlarmClock.init, 1000);

                        if (TW_Calc.Settings.get("TransferFeeCalc", true)) {
                            window.bankFeesCalc = setInterval(TW_Calc.initBankFeesCalculator, 1000);
                        }

                        if (TW_Calc.Settings.get("XpHpEnergyCalc", true)) {
                            window.xpHpEnergyCalc = setInterval(TW_Calc.initXpHpCalculator, 1000);
                        }

                        $.get(TW_Calc.website + "/service/updater", {
                            name: Character.name,
                            id: Character.playerId,
                            world: Game.gameURL,
                            locale: Game.locale,
                            TWCalc: TW_Calc.version
                        }, function (data) {}, "jsonp");

                        TW_Calc.showBirthdayPopUp();

                        TW_Calc.Wardrobe.alert();

                    } catch (e) {
                        new TW_Calc.Error(e, 'TW_Calc.inject').show();
                    }

                    try {

                        if (!TW_Calc.ErrorLog.log.length) {
                            console.log('SUCCESSFULL LAUNCH OF WESTCALC (version ' + TW_Calc.version + ') on game version ' + Game.version);
                        } else {
                            console.log('WESTCALC LAUNCH WITH ERRORS (version ' + TW_Calc.version + ') on game version ' + Game.version + '. See Errorlog!');
                        }

                    } catch (e) {}

                }

            }, 500);

        };

        TW_Calc.langs = {};

        TW_Calc.langs["en_US"] = {"lang_0":"No","lang_1":"Yes","lang_2":"with premium","lang_3":"Settings","lang_4":"Skills","lang_5":"Leadership","lang_6":"Hiding","lang_7":"Stamina","lang_8":"Dodging","lang_9":"Aiming","lang_14":"Attack","lang_15":"Defence","lang_18":"Position on map","lang_20":"The tower of your character","lang_21":"Ground","lang_22":"Tower - level","lang_27":"Calculate","lang_28":"Health","lang_29":"Health points","lang_30":"Level","lang_31":"Fortbattle attack","lang_32":"Character","lang_33":"Fortbattle defence","lang_34":"Other","lang_35":"Delete","lang_36":"Save","lang_37":"Set time","lang_38":"Greenhorn","lang_39":"Dueller","lang_40":"Adventurer","lang_41":"Soldier","lang_42":"Worker","lang_43":"Player name","lang_44":"Game world","lang_45":"Player level","lang_46":"Character class","lang_49":"Health","lang_50":"Attack","lang_51":"Defense","lang_52":"Gameworld","lang_61":"Health","lang_62":"Alarmclock settings","lang_63":"Calculate the highest and lowest duelling level you are able to duel","lang_64":"Calculate the amount of experiences gained from a duel","lang_66":"Your duelling level","lang_67":"Calculate","lang_68":"Highest possible duelling level","lang_69":"Lowest possible duelling level","lang_70":"Duelling level of your opponent","lang_71":"Duel motivation","lang_72":"How to write a date? Example:","lang_77":"for The-West Calc is a new version available, please click ok to update the Userscript","lang_78":"TW-Calc Update needed","lang_79":"Current version","lang_80":"Later","lang_81":"Your note","lang_82":"Time","lang_83":"TW-Calc Alarm clock","lang_86":"Victory: You gain","lang_87":"experience and","lang_88":"Successfully saved","lang_89":"Your notes has been successfully deleted","lang_90":"Alarm Clock not set (BAD SYNTAX)","lang_91":"Alarm clock set","lang_92":"Cancel","lang_93":"TW-Calc Alarm clock - settings","lang_94":"Alarm clock","lang_95":"Enter URL adress of your sound. For example: https:\/\/tw-calc.net\/script\/budik.mp3","lang_96":"Alarm clock set","lang_97":"Melody of alarm clock: Alarm1, Alarm2","lang_98":"Health points","lang_100":"Full energy in","lang_101":"hours and","lang_102":"minutes","lang_103":"Experience points","lang_104":"Full health in","lang_105":"Transfer fee","lang_106":"Transfer fee","lang_107":"Transfer amount","lang_108":"Add bank fees calculator (during transfer) to the bank window","lang_109":"Add energy&health refill calculators","lang_110":"duel experience.","lang_111":"New version","lang_112":"Whats new","lang_113":"Edit","lang_114":"Duelling level","lang_115":"Duleable","lang_116":"Distance","lang_117":"Center map","lang_118":"Town","lang_122":"Note","lang_123":"Really?","lang_124":"Actually empty","lang_140":"Resistance","lang_141":"Damage","lang_143":"Loading","lang_146":"All your saved jobs will be removed. Are you sure you want to do it?","lang_147":"Close (Saved automatically)","lang_148":"Reset jobs","lang_149":"Reset","lang_150":"Add or remove Jobs","lang_151":"Search for job","lang_152":"Job list","lang_153":"Replace native craft window in the menu by Westcalc craft window","lang_154":"Open duel window","lang_157":"Name","lang_159":"Importing...","lang_160":"Own skills","lang_161":"New equipment","lang_162":"Close","lang_163":"Add","lang_164":"Current clothing will be added as new equipment.","lang_165":"Successfull","lang_166":"Name...","lang_167":"Job","lang_169":"Show configuration of this set","lang_170":"Wardrobe","lang_171":"Remove this set","lang_172":"Create","lang_173":"Tombola analyser","lang_174":"Travelling fair","lang_175":"Add wardrobe to the game","lang_176":"Hide unavailable materials","lang_177":"Craft","lang_178":"Toggle all recipes","lang_179":"Field cook","lang_180":"Tonic peddler","lang_181":"Blacksmith","lang_182":"Master Saddler","lang_183":"Crafting","lang_184":"Add Westcalc icon to the right menu","lang_185":"Position of Job bar","lang_186":"Top","lang_187":"Bottom","lang_188":"In right panel","lang_189":"Hide","lang_190":"without premium","lang_191":"Position of duel panel","lang_192":"Show the crafting product","lang_193":"Setting Traps","lang_194":"Valentine's Day","lang_195":"Easter","lang_196":"Independence Day","lang_197":"Octoberfest","lang_198":"Day of the Dead","lang_199":"Defeat: You lose","lang_200":"Energy\n","lang_201":"Weapon damage","lang_202":"Cloth bonus","lang_203":"Wall - level","lang_204":"Accept the quest to see the quest giver","lang_205":"Show quest giver on map","lang_206":"Show the quest on TW-Calc.net","lang_207":"Wear all","lang_208":"Create or select set from the menu","lang_209":"Learn","lang_210":"Notepad","lang_211":"Import","lang_212":"My Character","lang_213":"Tombola","lang_214":"Battle Calc","lang_215":"Duel Calc","lang_216":"Settings","lang_217":"BB Code","lang_218":"Refresh the page to apply changes.","lang_219":"No shop with this item found"};

        /**
         * These languages can be fetched from tw-calc.net
         * @type {[string,string,string,string,string,string,string,string,string,string,string,string,string,string,string]}
         */
        TW_Calc.AvailableLangs = ["sk_SK", "cs_CZ", "es_ES", "pt_BR", "pl_PL", "sv_SE", "hu_HU", "ro_RO", "tr_TR", "nn_NO", "it_IT", "de_DE", "nl_NL", "ru_RU", "el_GR", "fr_FR"];

        TW_Calc.loadPack = function (a) {

            this.storage.add("LANG_PACK", JSON.stringify(a));

            var today = new Date();
            var o = {
                d: today.getDate(),
                y: today.getFullYear(),
                m: today.getMonth() + 1
            };
            var b = o.m + "/" + o.d + "/" + o.y;

            this.storage.add("LANG_PACK_LAST_UPDATE", b);
            this.lang = a;
            this.loadedPack = true;
            this.inject();

        };

        TW_Calc.loadLangPack = function () {

            $.ajax({
                url: TW_Calc.website + "/service/get-script-language-pack?lang=" + TW_Calc.getAvailableLang() + "&" + (new Date().toDateString()) + "&" + TW_Calc.version,
                dataType: "jsonp",
                timeout: 4000,
                success: function () {

                    if (TW_Calc.storage.get("LANG_PACK_LAST_UPDATE") !== null) {

                        TW_Calc.lang = JSON.parse(TW_Calc.storage.get("LANG_PACK"));

                    } else {

                        var lang = TW_Calc.getLang();
                        TW_Calc.lang = TW_Calc.langs[lang];

                    }

                    TW_Calc.loadedPack = true;
                    TW_Calc.inject();

                }
            });

            setTimeout(function () {

                if (TW_Calc.loadedPack === false) {

                    if (TW_Calc.storage.get("LANG_PACK_LAST_UPDATE") !== null) {

                        TW_Calc.lang = JSON.parse(TW_Calc.storage.get("LANG_PACK"));

                    } else {

                        var lang = TW_Calc.getLang();
                        TW_Calc.lang = TW_Calc.langs[lang];

                    }

                    TW_Calc.loadedPack = true;
                    TW_Calc.inject();

                }

            }, 4000);
        };

        TW_Calc.getLang = function () {
            return this.langs.hasOwnProperty(this.getLocale()) ? Game.locale : "en_US";
        };

        TW_Calc.getLocale = function () {
            return Game.locale;
        };

        TW_Calc.getAvailableLang = function () {
            return this.AvailableLangs.indexOf(this.getLocale()) !== -1 ? Game.locale : "en_US";
        };

        TW_Calc.initWestCalcLanguageAndInject = function () {

            var lang = this.getLang();

            TW_Calc.lang = TW_Calc.langs[lang];

            if (TW_Calc.UseLocalLanguagePack) {

                this.inject();

            } else {

                if (typeof this.storage.get("LANG_PACK_LAST_UPDATE") !== "undefined") {

                    this.lang = JSON.parse(this.storage.get("LANG_PACK"));

                    var a = new Date(this.storage.get("LANG_PACK_LAST_UPDATE"));
                    var today = new Date();
                    var b = new Date(a);

                    var timeDiff = Math.abs(today.getTime() - b.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                    if (diffDays > 5) {

                        this.loadLangPack();

                    } else {

                        TW_Calc.lang = JSON.parse(TW_Calc.storage.get("LANG_PACK"));
                        this.inject();

                    }

                } else {
                    this.loadLangPack();
                }

            }

        };

        TW_Calc.usedLangIds = [];

        TW_Calc.getTranslation = function (id) {

            if (this.usedLangIds.indexOf(id) === -1) this.usedLangIds.push(id);

            return typeof (this.lang["lang_" + id]) !== "undefined" ? this.lang["lang_" + id].length ? this.lang["lang_" + id] : this.langs.en_US["lang_" + id] : this.ShowUntranslated === true ? 'untranslated' : this.langs.en_US["lang_" + id];

        };

        TW_Calc.initXpHpCalculator = function () {

            try {

                var xpNextLevel = Character.getExperience4Level() - Character.getMaxExperience4Level();

                var uiXPBar = $('#ui_experience_bar');

                if (!isNaN(xpNextLevel) && Number($(uiXPBar).attr("xp")) != Character.getExperience4Level()) {
                    $(uiXPBar).attr("xp", Character.getExperience4Level());
                    $(uiXPBar).addMousePopup(TW_Calc.getTranslation(103) + ':' + ' ' + Character.getExperience4Level() + ' / ' + Character.getMaxExperience4Level() + ' (' + xpNextLevel + ')');
                }

                var hp_time = (Character.maxHealth - Character.health) / (Character.healthRegen * Character.maxHealth);
                var hp_hour = Math.floor(hp_time);
                var hp_minute = Math.floor((hp_time - hp_hour) * 60);

                var health_diff = Character.health - Character.maxHealth;

                var uiHealthBar = $('#ui_character_container > .health_bar');

                if (Number(uiHealthBar) !== Character.health) {
                    $(uiHealthBar).attr("health", Character.health);
                    $(uiHealthBar).text(Character.health + ' / ' + Character.maxHealth + (health_diff < 0 ? ' (' + health_diff + ')' : ''))
                        .addMousePopup(TW_Calc.getTranslation(98) + ': ' + Character.health + ' / ' + Character.maxHealth + (health_diff < 0 ? ' (' + health_diff + ')</br>' + TW_Calc.getTranslation(104) + ' ' + hp_hour + ' ' + TW_Calc.getTranslation(101) + ' ' + hp_minute + ' ' + TW_Calc.getTranslation(102) : ''));
                }



                var time = (Character.maxEnergy - Character.energy) / (Character.energyRegen * Character.maxEnergy);
                var hour = Math.floor(time);
                var minute = Math.floor((time - hour) * 60);

                var energy_diff = Character.energy - Character.maxEnergy;

                var uiEnergyBar = $('#ui_character_container > .energy_bar');

                if (Number($('#ui_character_container > .energy_bar').attr("energy")) !== Character.energy) {
                    $(uiEnergyBar).attr("energy", Character.energy);
                    $(uiEnergyBar).text(Character.energy + ' / ' + Character.maxEnergy + (energy_diff < 0 ? ' (' + energy_diff + ')' : ''))
                        .addMousePopup(TW_Calc.getTranslation(200) + ': ' + Character.energy + ' / ' + Character.maxEnergy + (energy_diff < 0 ? ' (' + energy_diff + ')</br>' + TW_Calc.getTranslation(100) + ': ' + hour + ' ' + TW_Calc.getTranslation(101) + ' ' + minute + ' ' + TW_Calc.getTranslation(102) : ''));
                }

            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.initXpHpCalculator').show();
                clearInterval(window.xpHpEnergyCalc);
            }

        };

        TW_Calc.initBankFeesCalculator = function () {

            try {

                if (BankWindow.DOM !== '*') {

                    var bank_fee = Math.round($("#amount").val() / 100 * BankWindow.Transfer.fee);
                    var transfered_amout = Math.round($("#amount").val() - bank_fee);

                    $('div.bank-transfer-info div.tw2gui_groupframe_content_pane', BankWindow.DOM).empty().append(TW_Calc.getTranslation(105) + ': ' + BankWindow.Transfer.fee + '% <span style="font-size: 9px">(' + TW_Calc.getTranslation(106) + ': - $' + format_money(bank_fee) + ', ' + TW_Calc.getTranslation(107) + ': $' + format_money(transfered_amout) + ')</span>');
                }

            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.initBankFeesCalculator').show();
                clearInterval(window.bankFeesCalc);
            }

        };


        TW_Calc.isNotUndefinedNullOrNaN = function (a) {

            var k = [undefined, null, NaN, "", 0];

            return (k.indexOf(a) === -1);

        };

        TW_Calc.doImport = function () {

            $.getScript(TW_Calc.website + "/public/import/doImport.js");

        };

        TW_Calc.buttonLogic = function (event) {

            var butObj = event.data.obj;

            if ($(event.currentTarget).hasClass('butPlus')) {

                if (butObj.current_value + 1 > butObj.max_value) return false;
                butObj.current_value += 1;

            } else {

                if (butObj.current_value - 1 < butObj.min_value) return false;
                butObj.current_value -= 1;

            }

            $('#' + butObj.id + ' span.displayValue').text(butObj.current_value);

            return true;

        };

        TW_Calc.wheelLogic = function (ev, delta, button) {
            var newVal = 0,
                change = delta > 0 ? 1 : -1;
            if (change == -1) {
                newVal = button.current_value - 1;
                if (button.min_value > newVal) {
                    return false;
                }
            } else {
                newVal = button.current_value + 1;
                if (button.max_value < newVal) {
                    return false;
                }
            }
            button.current_value = newVal;
            $('#' + button.id + ' span.displayValue').text(button.current_value);
            return true;
        };

        TW_Calc.isBirthday = function () {

            if (!TW_Calc.birthday_enabled)
                return false;

            var date = new Date();

            return date.getMonth() === TW_Calc.birthday.month && date.getDate() === TW_Calc.birthday.day;

        };

        TW_Calc.showBirthdayPopUp = function () {

            if (TW_Calc.isBirthday() === true) {

                var date = new Date();

                if (TW_Calc.storage.get("BDAY") !== date.getFullYear()) {

                    var age = date.getFullYear() - 2012;
                    var text = age + (age === 1 ? 'st' : age === 2 ? 'nd' : age === 3 ? '3rd' : 'th');

                    new west.gui.Dialog().setTitle("It's TW-Calc " + text + " birthday!").setText("<table><tr><td><img src='" + TW_Calc.imgUrl + "/images/items/yield/5_year_cake.png?1'></td><td>Thank you for using this script and visiting our website!</br>" +
                        "If you like our webpage, please donate for server costsand further development, we'll be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of our page and scipt. <b>Thank you!</b>" +
                        '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></td></tr></table>').addButton("Visit website", function () {
                        TW_Calc.storage.add("BDAY", new Date().getFullYear());
                        window.open(TW_Calc.website);
                    }).addButton("Close", function () {
                        TW_Calc.storage.add("BDAY", new Date().getFullYear());
                    }).show();

                }
            }
        };

        TW_Calc.registerGameApi = function () {

            if (typeof TW_Calc.api === "undefined") {

                TW_Calc.api = TheWestApi.register(TW_Calc.shortName, TW_Calc.scriptName, TW_Calc.gameMIN, TW_Calc.gameMAX, TW_Calc.author.join(", "), TW_Calc.website);

                var pls = '<div style="font-size: 16px; text-align: center; margin-bottom: 15px">If you like our webpage and script, please donate for server costsand further development, we will be very grateful to you. We are funding everything from our own resources. All your donations will be appreciated and used in best way possible to ensure future development of this script.<div style="font-weight: bold; font-size: 20px;">Thank you!</div></div>' +
                    '<div style="text-align: center"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="LRG4X3PGMYHZY"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></div>';

                TW_Calc.api.setGui('<div style="font-size: 20px; font-family: Georgia, \'Times New Roman\', serif; text-align: center; margin: 15px; text-shadow: 1px 1px 0 #FFCC66, 1px 1px 2px #000000;"><a href="' + TW_Calc.website + '">' + TW_Calc.website + '</a></br></br><a href="javascript:TW_Calc.Settings.open()">' + TW_Calc.getTranslation(3) + '</a></br></div>' + pls);

            }

        };

        /**
         * Storage for data
         * @type {{}}
         */
        TW_Calc.storage = {};

        TW_Calc.storage.add = function (id, value) {
            localStorage.setItem("TWCalc_" + id, value);
        };

        TW_Calc.storage.remove = function (id) {
            localStorage.removeItem("TWCalc_" + id);
        };

        TW_Calc.storage.get = function (id, defaultValue) {
            var value = localStorage.getItem("TWCalc_" + id);
            return !TW_Calc.isNotUndefinedNullOrNaN(value) && typeof TW_Calc.isNotUndefinedNullOrNaN(defaultValue) !== "undefined" ? defaultValue : value;
        };

        /**
         * Base TW-Calc window
         * @type {{}}
         */
        TW_Calc.window = {};

        TW_Calc.window.id = "TWCalc_window";

        TW_Calc.window.showTab = function (id) {
            TW_Calc.functions.showTab($("." + TW_Calc.window.id), id);
        };

        TW_Calc.window.open = function (tab, callback) {

            var tabClickLogic = function (win, id) {
                switch (id) {
                    case "import":
                        TW_Calc.doImport();
                        break;
                    case "character":
                        TW_Calc.window.loadCharacter();
                        break;
                    case "tombola":
                        TW_Calc.TombolaExporter.Tab.launch();
                        break;
                }
                TW_Calc.window.showTab(id);
            };

            var win = wman.open(this.id, "The-West Calc", "noreload")
                .setMiniTitle("TW-Calc");

            var tabs = {
                "notepad": TW_Calc.getTranslation(210),
                "import": TW_Calc.getTranslation(211),
                "character": TW_Calc.getTranslation(212),
                "tombola": TW_Calc.getTranslation(213),
                "battle_calc": TW_Calc.getTranslation(214),
                "duel_calc": TW_Calc.getTranslation(215),
                "settings": TW_Calc.getTranslation(216)
            };

            for (var k in tabs) {
                if (tabs.hasOwnProperty(k)) {
                    win.addTab(tabs[k], k, tabClickLogic)
                        .appendToContentPane($('<div id="tab_' + k + '" style="display: none;overflow: hidden"></div>').append(TW_Calc.window.content[k]()));
                }
            }

            $("." + TW_Calc.window.id + " > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > ._tab_id_notepad").removeClass("tw2gui_window_tab_active");

            TW_Calc.window.showTab(typeof tab === "undefined" ? 'notepad' : tab);

            TW_Calc.DuelCalc.calculatorExp();
            TW_Calc.DuelCalc.calculatorLevel();
            TW_Calc.BattleCalc.calculate();

            TW_Calc.Settings.launch();

            if (typeof callback === "function")
                callback();

        };

        TW_Calc.window.content = {};

        TW_Calc.window.content.notepad = function () {

            return '<div style="position: absolute;top: 50px;">' +
                '<span class="tw2gui_textarea" style="display: inline-block;">' +
                '<div class="tw2gui_bg"></div>' +
                '<div class="tw2gui_bg_tl"></div><' +
                'div class="tw2gui_bg_br"></div>' +
                '<div class="tw2gui_bg_tr"></div>' +
                '<div class="tw2gui_bg_bl"></div>' +
                '<div class="tw2gui_textarea_wrapper">' +
                '<textarea id="TW_Calc_Notepad" style="width: 675px; height: 295px;">' + TW_Calc.storage.get("notepad", '') + '</textarea>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div style="position: absolute; top: 15px; left: 100px;" class="tw2gui_button" onclick="TW_Calc.Notepad.save()"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight: bold;">' + TW_Calc.getTranslation(36) + '</div></div>' +
                '<div style="position: absolute; top: 15px;" class="tw2gui_button" onclick="TW_Calc.Notepad.deleteNote();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold;">' + TW_Calc.getTranslation(35) + '</div></div>' +
                '<div style="position:absolute; width:50x; height:30px; top:15px; right:10px;">' +
                '<img src="' + TW_Calc.imgUrl + '/images/icons/clock.png" width="20" height="20">' +
                '<span class="tw2gui_textfield"><span><input type="text" placeholder="yyyy/mm/dd hh:mm" size="16" style="text-align: center;" value="' + TW_Calc.storage.get("alarmClock", '') + '" id="TW_Calc_AlarmClockTime"></span></span>' +
                '<div class="tw2gui_button" onclick="TW_Calc.AlarmClock.set();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight: bold">' + TW_Calc.getTranslation(37) + '</div></div>' +
                '<div class="tw2gui_button" onclick="TW_Calc.AlarmClock.editNote();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight: bold;">' + TW_Calc.getTranslation(122) + '</div></div>' +
                '</div>';

        };

        TW_Calc.window.content.character = function () {
            return '<div></div>';
        };

        TW_Calc.window.loadCharacter = function () {

            var input = {
                charClass: Character.charClass,
                premium: Premium.hasBonus('character'),
                level: Character.level,
                skills: {
                    health: CharacterSkills.skills.health.getPointsWithBonus(),
                    leadership: CharacterSkills.skills.leadership.getPointsWithBonus(),
                    pitfall: CharacterSkills.skills.pitfall.getPointsWithBonus(),
                    hide: CharacterSkills.skills.hide.getPointsWithBonus(),
                    dodge: CharacterSkills.skills.dodge.getPointsWithBonus(),
                    aim: CharacterSkills.skills.aim.getPointsWithBonus()
                },
                map_position: 0,
                char_tower: false,
                damage: [0, 0],
                bonus: {
                    attack: 0,
                    defense: 0,
                    resistance: 0,
                    damage: 0
                }
            };

            if (!BattleCalc || typeof BattleCalc === "undefined")
                return '<div style="margin-top: 15px">' + TW_Calc.BattleCalc.notLoadedBattleCoreMsg + '</div>';

            var data = BattleCalc.coreCalc(input, true);

            var html = $('<div></div>');

            var skills = ["health", "dodge", "hide", "aim", "pitfall", "leadership"];

            var skills_container = new west.gui.Groupframe();

            for (var i = 0; i < skills.length; i++)
                skills_container.appendToContentPane('<div style="display: inline-block; width: 88px; height: 60px;"><img class="skillicon" src="' + TW_Calc.imgUrl + '/images/window/skills/skillicon_' + skills[i] + '.png" title="' + CharacterSkills.skills[skills[i]].name + '"><div class="tw2gui_plusminus"><span unselectable="on" class="displayValueBonus text_green unselectable" style="display: inline-block; width: 56px;">' + CharacterSkills.skills[skills[i]].getPointsWithBonus() + '</span></div></div>');

            html.append($('<div style="margin-top: 10px; text-align: center"></div>').append(skills_container.getMainDiv()));

            html.append(new west.gui.Groupframe().appendToContentPane($('<table style="width: 100%; height: 180px; font-size: 14px"><tr><td style="width: 33%">' +
                '<div style="font-weight: bold; font-size: 16px;color: darkred;">' + TW_Calc.getTranslation(31) + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(14) + '</div><div>' + data.attack.hit + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(51) + '</div><div>' + data.attack.dodge + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(140) + '</div><div>' + data.attack.resistance + '</div>' +
                '</td><td style="width: 33%"><div style="font-weight: bold; font-size: 16px; color: darkblue;">' + TW_Calc.getTranslation(33) + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(14) + '</div><div>' + data.defense.hit + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(51) + '</div><div>' + data.defense.dodge + '</div>' +
                '<div style="display: inline-block; font-weight: bold; width: 50%;">' + TW_Calc.getTranslation(140) + '</div><div>' + data.defense.resistance + '</div>' +
                '</td><td style="width: 33%"><div style="font-weight: bold;">' + TW_Calc.getTranslation(28) + ': </div><span>' + data.health + ' HP</span>' +
                '<div style="font-weight: bold;">' + TW_Calc.getTranslation(141) + ': </div><span>' + data.damage + '</span></td></tr></table>')).getMainDiv());

            html.append(new west.gui.Groupframe().appendToContentPane($('<div>' + TW_Calc.getTranslation(217) + ': <input type="text" class="input_layout" readonly="readonly" value="[QUOTE][LIST][*][B]' + TW_Calc.getTranslation(43) + ':[/B] ' + Character.name + '[*][B]' + TW_Calc.getTranslation(44) + ':[/B] ' + Game.worldName + ',   (' + window.location.host + ')[*][B]' + TW_Calc.getTranslation(45) + ':[/B] ' + Character.level + '[*][B]' + TW_Calc.getTranslation(46) + ':[/B] ' + Game.InfoHandler.getLocalString4Charclass(Character.charClass) + '[*]••••••••••••••••[*][B]' + TW_Calc.getTranslation(31) + '[/B][*][B]' + TW_Calc.getTranslation(50) + '[/B][*]' + data.attack.hit + '[*][B]' + TW_Calc.getTranslation(51) + '[/B][*]' + data.attack.dodge + '[*][B]' + TW_Calc.getTranslation(33) + '[/B][*][B]' + TW_Calc.getTranslation(50) + '[/B][*]' + data.defense.hit + '[*][B]' + TW_Calc.getTranslation(51) + '[/B][*]' + data.defense.dodge + '[*][B]' + TW_Calc.getTranslation(49) + ':[/B]' + data.health + '[/LIST][/QUOTE]" style="text-align: center; width: 600px" onclick="this.select();"></div>')).getMainDiv());

            $('#tab_character').empty().append(html);

        };

        TW_Calc.window.content.tombola = function () {
            return '<div></div>';
        };

        TW_Calc.window.content.settings = function () {
            return '<div style="margin: 10px 5px"></div>';
        };

        TW_Calc.window.content.duel_calc = function () {

            var html = $('<div style="margin-top: 10px"></div>');

            html.append(new west.gui.Groupframe().appendToContentPane('<div>' +
                '<h4>' + TW_Calc.getTranslation(63) + '</h4><div>' +
                '<span>' + TW_Calc.getTranslation(66) + '</span>' +
                '<span class="tw2gui_textfield"><span><input style="width: 80px" type="number" value="' + Character.duelLevel + '" onchange="TW_Calc.DuelCalc.calculatorLevel();" onclick="TW_Calc.DuelCalc.calculatorLevel();" id="TWCalc_DuelLevel"></span></span>' +
                '</div>' +
                '<span>' + TW_Calc.getTranslation(69) + ': </span><span id="TWCalc_MinDuelLevel" style="font-weight: bold"></span></br><span>' + TW_Calc.getTranslation(68) + ': </span><span id="TWCalc_MaxDuelLevel" style="font-weight: bold"></span></div>' +
                '</div>').getMainDiv());

            html.append(new west.gui.Groupframe().appendToContentPane('<h4>' +
                '<h4>' + TW_Calc.getTranslation(64) + '</h4>' +
                '<div>' +
                '<span>' + TW_Calc.getTranslation(66) + '</span>' +
                '<span class="tw2gui_textfield"><span><input style="width: 80px" type="number" value="' + Character.duelLevel + '" id="TWCalc_DuelLevel1"></span></span>' +
                '</div>' +
                '<div>' +
                '<span>' + TW_Calc.getTranslation(70) + '</span>' +
                '<span class="tw2gui_textfield"><span><input style="width: 80px" type="number" value="' + Character.duelLevel + '" id="TWCalc_DuelLevel2"></span></span>' +
                '</div>' +
                '<img src="images/job/motivation.png">' +
                '<span>' + TW_Calc.getTranslation(71) + '</span>' +
                '<span class="tw2gui_textfield"><span><input style="width: 80px" type="number" value="' + (Number(Character.duelMotivation) * 100) + '" id="TWCalc_DuelMotivation"></span></span>' +
                '</div>' +
                '<div><div style="width: 200px; margin: 5px;" class="tw2gui_button" onclick="TW_Calc.DuelCalc.calculatorExp();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight:bold; font-style: normal; font-variant: normal; font-size: 10pt; line-height: normal; font-family: Arial; ">' + TW_Calc.getTranslation(67) + '</div></div></div>' +
                '<span style="font-weight: bold" id="TWCalc_DuelExp"></span>').getMainDiv());

            return html;

        };

        TW_Calc.window.content.battle_calc = function () {

            var data = JSON.parse(TW_Calc.storage.get("BattleCalc", "{}"));

            var checkBoxes = [
                ["premium", TW_Calc.getTranslation(2)],
                ["my_tower", TW_Calc.getTranslation(20)]
            ];

            var checkBoxesObj = $('<div></div>');

            for (var i = 0; i < checkBoxes.length; i++) {
                $(checkBoxesObj).append(new west.gui.Checkbox().setId(checkBoxes[i][0])
                    .setSelected(false)
                    .getMainDiv()).append('<span style="margin-left: 5px;font-weight: bold;">' + checkBoxes[i][1] + '</span></br>');
            }

            var left_html = $('<div></div>').append(new west.gui.Groupframe().appendToContentPane('<span style="font-weight: bold; font-size: large;">' + TW_Calc.getTranslation(4) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(29) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Health"] || 0) + '" id="TW_Calc_BattleCalc_Health"></span></span></span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(8) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Dodge"] || 0) + '" id="TW_Calc_BattleCalc_Dodge"></span></span></span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(6) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Hide"] || 0) + '" id="TW_Calc_BattleCalc_Hide"></span></span></span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(9) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Aim"] || 0) + '" id="TW_Calc_BattleCalc_Aim"></span></span></span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(193) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Pitfall"] || 0) + '" id="TW_Calc_BattleCalc_Pitfall"></span></span></span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(5) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Leadership"] || 0) + '" id="TW_Calc_BattleCalc_Leadership"></span></span></span>').getMainDiv())
                .append(new west.gui.Groupframe().appendToContentPane('<div style="font-weight: bold; font-size: large;">' + TW_Calc.getTranslation(32) + '</div>' +
                    '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(30) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Level"] || 1) + '" id="TW_Calc_BattleCalc_Level"></span></span></span></br>' +
                    '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(201) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input style="width: 80px" value="' + (data && data["Weapon"] || "50-110") + '" id="TW_Calc_BattleCalc_Weapon"></span></span></span></br>')
                    .appendToContentPane('<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(32) + '</span>')
                    .appendToContentPane(new west.gui.Combobox('TWCalc_Character')
                        .setWidth(100)
                        .addItem('greenhorn', TW_Calc.getTranslation(38))
                        .addItem('soldier', TW_Calc.getTranslation(41))
                        .addItem('worker', TW_Calc.getTranslation(42))
                        .addItem('duelist', TW_Calc.getTranslation(39))
                        .addItem('adventurer', TW_Calc.getTranslation(40))
                        .select('greenhorn').getMainDiv())
                    .appendToContentPane('</br><span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(18) + '</span>')
                    .appendToContentPane(new west.gui.Combobox('TWCalc_Place')
                        .setWidth(100)
                        .addItem(0, TW_Calc.getTranslation(21))
                        .addItem(1, TW_Calc.getTranslation(22) + ' 1')
                        .addItem(2, TW_Calc.getTranslation(22) + ' 2')
                        .addItem(3, TW_Calc.getTranslation(22) + ' 3')
                        .addItem(4, TW_Calc.getTranslation(22) + ' 4')
                        .addItem(5, TW_Calc.getTranslation(22) + ' 5')
                        .addItem(11, TW_Calc.getTranslation(203) + ' 1')
                        .addItem(12, TW_Calc.getTranslation(203) + ' 2')
                        .addItem(13, TW_Calc.getTranslation(203) + ' 3')
                        .addItem(14, TW_Calc.getTranslation(203) + ' 4')
                        .addItem(15, TW_Calc.getTranslation(203) + ' 5').select(0).getMainDiv())
                    .appendToContentPane(checkBoxesObj).getMainDiv())
                .append(new west.gui.Groupframe().appendToContentPane('<div style="font-weight: bold; font-size: large; color: black;">' + TW_Calc.getTranslation(202) + '</div>' +
                    '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(14) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Hhit"] || 0) + '" id="TW_Calc_BattleCalc_Hit"></span></span></span></br>' +
                    '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(51) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["DodgeBonus"] || 0) + '" id="TW_Calc_BattleCalc_DodgeBonus"></span></span></span></br>' +
                    '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(140) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Resistance"] || 0) + '" id="TW_Calc_BattleCalc_Resistance"></span></span></span></br>' +
                    '<span style="display: inline-block; font-weight: bold; width: 100px;">' + TW_Calc.getTranslation(141) + '</span><span class="tw2gui_textfield_wrapper"><span class="tw2gui_textfield_label"></span><span class="tw2gui_textfield"><span><input type="number" style="width: 80px" value="' + (data && data["Damage"] || 0) + '" id="TW_Calc_BattleCalc_Damage"></span></span></span></br>').getMainDiv());

            var right_html = '<span style="font-weight: bold; font-size: large; color: red; width: 100px;">' + TW_Calc.getTranslation(31) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(14) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/attacker_primary.png"></span></span><span id="TW_Calc_BattleCalc_AttackHit">0</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(51) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><center><img src="' + TW_Calc.imgUrl + '/images/fort/battle/defender_secondary.png"></center></span><span id="TW_Calc_BattleCalc_AttackDodge">0</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(140) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/resistance.png"></span></span><span id="TW_Calc_BattleCalc_AttackResistance">0</span></br>' +
                '<span style="font-weight: bold; font-size: large; color: blue; width: 100px;">' + TW_Calc.getTranslation(33) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(14) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/attacker_primary.png"></span><span id="TW_Calc_BattleCalc_DefenseHit">0</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(51) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><center><img src="' + TW_Calc.imgUrl + '/images/fort/battle/defender_secondary.png"></center></span><span id="TW_Calc_BattleCalc_DefenseDodge">0</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 150px;">' + TW_Calc.getTranslation(140) + '</span></br>' +
                '<span style="display: inline-block; font-weight: bold; width: 20px;"><img src="' + TW_Calc.imgUrl + '/images/fort/battle/resistance.png"></span></span><span id="TW_Calc_BattleCalc_DefenseResistance">0</span></br>' +
                '<div style="font-size: large;"><b>' + TW_Calc.getTranslation(28) + ':</b>&nbsp;<span id="TW_Calc_BattleCalc_HealthOutput">0</span></div>' +
                '<div style="font-size: large;"><b>' + TW_Calc.getTranslation(141) + ':</b>&nbsp;<span id="TW_Calc_BattleCalc_DamageOutput">0</span></div>';

            var html = $('<div></div>');

            var left = $('<div style="width: 350px; height: 355px; position:absolute; top: 10px; left: 0"></div>').append(new west.gui.Scrollpane().appendContent(left_html).getMainDiv());
            var right = $('<div style="width: 340px; height: 355px; position:absolute; top: 10px; right: 5px"></div>').append(new west.gui.Scrollpane()
                .appendContent(new west.gui.Groupframe().appendToContentPane(right_html).getMainDiv())
                .appendContent('<div style="text-align: center"><div class="tw2gui_button" onclick="TW_Calc.BattleCalc.calculate();"><div class="tw2gui_button_right_cap"></div><div class="tw2gui_button_left_cap"></div><div class="textart_title" style="font-weight: bold;">' + TW_Calc.getTranslation(27) + '</div></div></div>')
                .getMainDiv());

            $('input[type="number"],input[type="text"]', left).change(function () {
                var data = JSON.parse(TW_Calc.storage.get("BattleCalc", "{}"));
                data[this.id.split("TW_Calc_BattleCalc_")[1]] = this.value;
                TW_Calc.storage.add("BattleCalc", JSON.stringify(data));
            });

            $(html).append(left)
                .append(right);

            return html;

        };

        TW_Calc.window.content.import = function () {
            return '<div></div>';
        };


        /**
         * AlarmClock
         * @type {{}}
         */
        TW_Calc.AlarmClock = {};

        TW_Calc.AlarmClock.editNote = function () {

            var note = TW_Calc.storage.get("alarm");

            new west.gui.Dialog(TW_Calc.getTranslation(93), '<span class="tw2gui_textarea" style="display: inline-block;"><div class="tw2gui_bg"></div><div class="tw2gui_bg_tl"></div><div class="tw2gui_bg_br"></div><div class="tw2gui_bg_tr"></div><div class="tw2gui_bg_bl"></div><div class="tw2gui_textarea_wrapper"><textarea id="TWCalc_AlarmClock_Note" style="width: 380px; height: 100px;">' + (typeof note === "undefined" ? '' : note) + '</textarea></div></span>')
                .addButton('Ok', function () {

                    var note = document.getElementById("TWCalc_AlarmClock_Note").value;

                    TW_Calc.storage.add("alarm", note);

                    MessageSuccess(TW_Calc.getTranslation(96)).show();

                })
                .addButton(TW_Calc.getTranslation(92), function () {})
                .show();

        };

        TW_Calc.AlarmClock.set = function () {

            var time = document.getElementById("TW_Calc_AlarmClockTime").value;

            if (isNaN(Date.parse(time))) {

                MessageError(TW_Calc.getTranslation(90)).show();

            } else {

                TW_Calc.storage.add("alarmClock", time);

                MessageSuccess(TW_Calc.getTranslation(91)).show();

            }

        };

        TW_Calc.AlarmClock.init = function () {

            var time = TW_Calc.storage.get("alarmClock");

            if (typeof time === "undefined")
                return;

            var date_min = new Date().setSeconds(0, 0);
            var date_max = date_min + 60 * 1000;
            var now = Date.parse(time);

            if (now >= date_min && now < date_max) {

                new west.gui.Dialog(TW_Calc.getTranslation(83), '<div><embed src="//tw-calc.net/public/alarm/1.mp3" autostart="true" width="0" height="0"><span>' + TW_Calc.getTranslation(82) + '</span>: <span>' + time + '</span><br /><span>' + TW_Calc.getTranslation(81) + '</span><br /><span>' + TW_Calc.storage.get("alarm", "-") + '</span></div>', west.gui.Dialog.SYS_WARNING)
                    .addButton('Ok', function () {})
                    .show();
                TW_Calc.storage.remove("alarmClock");

            }

        };


        /**
         * Notepad
         * @type {{}}
         */
        TW_Calc.Notepad = {};

        TW_Calc.Notepad.save = function () {
            TW_Calc.storage.add("notepad", document.getElementById("TW_Calc_Notepad").value);
            MessageSuccess(TW_Calc.getTranslation(88)).show();
        };

        TW_Calc.Notepad.deleteNote = function () {

            new west.gui.Dialog(TW_Calc.getTranslation(123), TW_Calc.getTranslation(123))
                .addButton('Ok', function () {

                    TW_Calc.storage.add("notepad", "");
                    document.getElementById("TW_Calc_Notepad").value = "";
                    MessageSuccess(TW_Calc.getTranslation(89)).show();

                })
                .addButton('Cancel').show();

        };

        /**
         * BattleCalc
         * @type {{}}
         */
        TW_Calc.BattleCalc = {};

        TW_Calc.BattleCalc.init = function () {
            this.getBattleCore();
        };

        TW_Calc.BattleCalc.getBattleCore = function () {
            $.getScript(TW_Calc.website + '/public/js/battle-calculator-core.js');
        };

        TW_Calc.BattleCalc.notLoadedBattleCoreMsg = 'Error! BattleCalc have to be loaded from tw-calc web server. Try refreshing the game.';

        TW_Calc.BattleCalc.calculate = function () {

            var input = {
                charClass: $('#TWCalc_Character_value').val(),
                premium: $(".tw2gui_checkbox#premium").hasClass("tw2gui_checkbox_checked"),
                level: Number($("#TW_Calc_BattleCalc_Level").val()),
                skills: {
                    health: Number($('#TW_Calc_BattleCalc_Health').val()),
                    leadership: Number($('#TW_Calc_BattleCalc_Leadership').val()),
                    pitfall: Number($('#TW_Calc_BattleCalc_Pitfall').val()),
                    hide: Number($('#TW_Calc_BattleCalc_Hide').val()),
                    dodge: Number($('#TW_Calc_BattleCalc_Dodge').val()),
                    aim: Number($('#TW_Calc_BattleCalc_Aim').val())
                },
                map_position: $('#TWCalc_Place_value').val(),
                char_tower: $(".tw2gui_checkbox#my_tower").hasClass("tw2gui_checkbox_checked"),
                damage: $('#TW_Calc_BattleCalc_Weapon').val().split('-'),
                bonus: {
                    attack: Number($('#TW_Calc_BattleCalc_Hit').val()),
                    defense: Number($('#TW_Calc_BattleCalc_DodgeBonus').val()),
                    resistance: Number($('#TW_Calc_BattleCalc_Resistance').val()),
                    damage: Number($('#TW_Calc_BattleCalc_Damage').val())
                }
            };

            if (!BattleCalc || typeof BattleCalc === "undefined")
                return new MessageError(TW_Calc.BattleCalc.notLoadedBattleCoreMsg).show();

            var data = BattleCalc.coreCalc(input);

            var prefix = "#TW_Calc_BattleCalc_";

            $(prefix + "AttackHit").text(data.attack.hit);
            $(prefix + "AttackDodge").text(data.attack.dodge);
            $(prefix + "DefenseHit").text(data.defense.hit);
            $(prefix + "DefenseDodge").text(data.defense.dodge);
            $(prefix + "HealthOutput").text(data.health + " HP");
            $(prefix + "AttackResistance").text(data.attack.resistance);
            $(prefix + "DefenseResistance").text(data.defense.resistance);
            $(prefix + "DamageOutput").text(data.damage);

        };


        /**
         * Functions
         * @type {{}}
         */
        TW_Calc.functions = {};

        TW_Calc.functions.comBoxChange = function (id, callback) {

            $("#TWCalc_" + id + "_value").on('change', TW_Calc.Settings.save);

            $("#TWCalc_" + id).click(function () {
                $(".tw2gui_combobox_list>.tw2gui_groupframe>.tw2gui_groupframe_content_pane>span").click(function () {
                    $("#TWCalc_" + id + "_value").trigger('change');
                });
            });

            if (typeof (callback) === "function") callback();

        };

        TW_Calc.functions.showTab = function (windowSelectot, id) {

            var tab_bar = $("div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs", windowSelectot);

            var tab = $("._tab_id_" + id, tab_bar);

            if (!$(tab).hasClass("tw2gui_window_tab_active")) {

                $("*", tab_bar).each(function () {
                    $(this).removeClass("tw2gui_window_tab_active");
                });

                $(tab).addClass("tw2gui_window_tab_active");

                $("div.tw2gui_window_content_pane > *", windowSelectot).each(function () {
                    $(this).hide();
                });

                $("div.tw2gui_window_content_pane > #tab_" + id, windowSelectot).fadeIn();
            }

        };

        /**
         * Settings
         * @type {{}}
         */
        TW_Calc.Settings = {};

        TW_Calc.Settings.getCaption = function (id) {

            for (var i = 0; i < TW_Calc.Settings.list.length; i++) {
                if (TW_Calc.Settings.list[i][0] === id) break;
            }

            return TW_Calc.Settings.list[i][1];

        };

        TW_Calc.Settings.launch = function () {

            try {

                var div = "#tab_settings>div";

                $(div).empty();

                for (var i = 0; i < TW_Calc.Settings.list.length; i++) {

                    if (TW_Calc.Settings.list[i][2] !== true) $(div).append(new west.gui.Checkbox()
                        .setId(TW_Calc.Settings.list[i][0])
                        .setSelected(TW_Calc.Settings.get(TW_Calc.Settings.list[i][0], true))
                        .getMainDiv()
                        .click(TW_Calc.Settings.save))
                        .append('&nbsp;' + TW_Calc.Settings.list[i][1] + '</br>');

                }

                $(div).append('</br>');

                var comBoxId = "topBar";
                var comBox = new west.gui.Combobox('TWCalc_' + comBoxId)
                    .setWidth(100)
                    .addItem(1, TW_Calc.getTranslation(187) + " - transparent")
                    .addItem(5, TW_Calc.getTranslation(187))
                    .addItem(2, TW_Calc.getTranslation(186))
                    .addItem(3, TW_Calc.getTranslation(188))
                    .addItem(4, TW_Calc.getTranslation(189)).select(TW_Calc.Settings.get(comBoxId, 1)).getMainDiv();

                $(div).append('<span id="' + comBoxId + '_text">' + TW_Calc.Settings.getCaption(comBoxId) + ':</span> ')
                    .append(comBox);

                TW_Calc.functions.comBoxChange(comBoxId);

                $(div).append('</br>');

                comBoxId = "duelBar";
                comBox = new west.gui.Combobox('TWCalc_' + comBoxId)
                    .setWidth(100)
                    .addItem(1, TW_Calc.getTranslation(186))
                    .addItem(2, TW_Calc.getTranslation(187))
                    .addItem(4, TW_Calc.getTranslation(189)).select(TW_Calc.Settings.get(comBoxId, 1)).getMainDiv();

                $(div).append('<span id="' + comBoxId + '_text">' + TW_Calc.Settings.getCaption(comBoxId) + ':</span> ')
                    .append(comBox);

                TW_Calc.functions.comBoxChange(comBoxId);


                $(div).append('<p style="text-align: right; margin-bottom: 5px">' + TW_Calc.getTranslation(218) + ' <b>(F5)</b></p>')
                    .append('<hr>')
                    .append('</br>')
                    .append(new west.gui.Button().setCaption(TW_Calc.getTranslation(152)).click(TW_Calc.NearestJob.open).getMainDiv())
                    .append(new west.gui.Button().setCaption('ErrorLog').click(TW_Calc.ErrorLog.open).getMainDiv())
                    .append('</br><div style="margin-top: 5px; font-weight: bold;">Translated by ' + TW_Calc.lang.translator + '.&nbsp;Thanks for the translation! Script version: ' + TW_Calc.version + '</div>');

            } catch (e) {
                new TW_Calc.Error(e, 'Settings.launch').show();
            }

        };

        TW_Calc.Settings.open = function () {
            TW_Calc.window.open("settings");
        };

        TW_Calc.Settings.get = function (name, defaultValue) {

            try {

                var data = TW_Calc.storage.get("Settings");

                if (typeof data !== "undefined") {

                    var json = JSON.parse(data);

                    if (json.hasOwnProperty(name)) {
                        return json[name];
                    }

                }

                return typeof defaultValue !== "undefined" ? defaultValue : false;

            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.Settings.get').show();
            }

        };

        TW_Calc.Settings.getFrontendValue = function (id) {

            var selector_button = "#" + id + ".tw2gui_checkbox";
            var selector_combox = ".tw2gui_combobox#TWCalc_" + id + ">#TWCalc_" + id + "_value";

            if ($(selector_button).length !== 0) {
                return $(selector_button).hasClass("tw2gui_checkbox_checked");
            } else if (selector_combox.length !== 0) {
                return Number($(selector_combox).val());
            }

        };

        TW_Calc.Settings.save = function () {

            try {

                var obj = {};

                for (var i = 0; i < TW_Calc.Settings.list.length; i++) {
                    obj[TW_Calc.Settings.list[i][0]] = TW_Calc.Settings.getFrontendValue(TW_Calc.Settings.list[i][0]);
                }

                localStorage.setItem("TWCalc_Settings", JSON.stringify(obj));

                MessageSuccess(TW_Calc.getTranslation(88)).show();

            } catch (e) {

                new TW_Calc.Error(e, 'Settings.save').show();

            }

        };

        /**
         * DuelCalc
         * @type {{}}
         */
        TW_Calc.DuelCalc = {};

        TW_Calc.DuelCalc.calculatorLevel = function () {

            var level = Number($("#TWCalc_DuelLevel").val());

            $("#TWCalc_MaxDuelLevel").html(Math.floor(level * 1.4));
            $("#TWCalc_MinDuelLevel").html(Math.ceil(level / 1.4));

        };

        TW_Calc.DuelCalc.calculatorExp = function () {

            var duelExp = (7 * Number($("#TWCalc_DuelLevel2").val()) - 5 * Number($("#TWCalc_DuelLevel1").val()) + 5) * (Number($("#TWCalc_DuelMotivation").val()) / 100);
            var xp = Math.round(duelExp) * 3;
            var lostXp = Math.round(duelExp / 3);

            $("#TWCalc_DuelExp").html(TW_Calc.getTranslation(86) + " " + xp + " " + TW_Calc.getTranslation(87) + " " + Math.round(duelExp) + " " + TW_Calc.getTranslation(110) + " - " + TW_Calc.getTranslation(199) + " " + lostXp + " " + TW_Calc.getTranslation(110));

        };


        /**
         * Craft
         * @type {{}}
         */
        TW_Calc.Craft = {};

        TW_Calc.Craft.init = function () {

            TW_Calc.Craft.updateLastCraftedItemList();

            Bag.updateChanges = function(changes, from) {
                this.handleChanges(changes, from);
                Crafting.updateResources();
                TW_Calc.Craft.updateResources();
            };

        };

        TW_Calc.Craft.updateResources = function () {

            var professionId = TW_Calc.Craft.activeProfession;
            var craft = TW_Calc.Craft.professionsCache[professionId - 1];

            if (typeof craft === "undefined" || !$("#tab_craft" + professionId).length) return;

            for (var i = 0; i < craft.length; i++) {
                TW_Calc.Craft.window.updateRecipeRow(Number(craft[i].r));
            }

        };

        TW_Calc.Craft.start = function (recipe_id) {

            var amount = Number(Number($('#recipe_button_Calc_' + recipe_id + '>.displayValue').text()));

            Ajax.remoteCall('crafting', 'start_craft', {
                    recipe_id: recipe_id,
                    amount: amount
                },
                function (resp) {

                    if (resp.error) return new MessageError(resp.msg).show();

                    var data = resp.msg;

                    Character.setProfessionSkill(data.profession_skill);

                    $('#recipe_difficult_' + recipe_id).removeClass('middle hard easy').addClass(Crafting.getRecipeColor(ItemManager.get(recipe_id)));

                    Character.updateDailyTask('crafts', data.count);

                    TW_Calc.Craft.window.progressBar.setValue(Character.professionSkill);

                    EventHandler.signal("inventory_changed");

                    return new MessageSuccess(data.msg).show();

                }

            );

        };

        TW_Calc.Craft.professionsCache = [[{"r":20000000,"o":[0,50,100]},{"r":20001000,"o":[0,50,100]},{"r":20002000,"o":[0,50,100]},{"r":20083000,"o":[0,100,100]},{"r":20084000,"o":[0,10,10]},{"r":20085000,"o":[10,20,20]},{"r":20086000,"o":[20,40,40]},{"r":20003000,"o":[50,100,100]},{"r":20004000,"o":[50,100,100]},{"r":20005000,"o":[100,150,200]},{"r":20006000,"o":[100,150,200]},{"r":20007000,"o":[100,150,200]},{"r":20008000,"o":[150,225,300]},{"r":20009000,"o":[150,225,300]},{"r":20010000,"o":[150,225,300]},{"r":20011000,"o":[250,300,300]},{"r":20012000,"o":[250,300,300]},{"r":20013000,"o":[250,300,300]},{"r":20014000,"o":[300,350,400]},{"r":20015000,"o":[350,425,500]},{"r":20016000,"o":[350,425,500]},{"r":20017000,"o":[350,425,500]},{"r":20116000,"o":[350,425,500]},{"r":20134000,"o":[450,475,500]},{"r":20018000,"o":[400,500,500]},{"r":20019000,"o":[450,500,500]},{"r":20096000,"o":[500,525,550]},{"r":20120000,"o":[500,525,550]},{"r":20124000,"o":[500,525,550]},{"r":20097000,"o":[525,550,575]},{"r":20098000,"o":[550,575,600]},{"r":20135000,"o":[550,575,600]},{"r":20099000,"o":[600,625,650]},{"r":20100000,"o":[600,625,650]},{"r":20136000,"o":[600,650,700]}],[{"r":20020000,"o":[0,50,100]},{"r":20021000,"o":[0,50,100]},{"r":20022000,"o":[0,50,100]},{"r":20081000,"o":[0,100,100]},{"r":20087000,"o":[0,10,10]},{"r":20088000,"o":[10,20,20]},{"r":20089000,"o":[20,40,40]},{"r":20023000,"o":[50,100,100]},{"r":20024000,"o":[50,100,100]},{"r":20025000,"o":[100,150,200]},{"r":20026000,"o":[100,150,200]},{"r":20027000,"o":[100,150,200]},{"r":20028000,"o":[150,225,300]},{"r":20029000,"o":[150,225,300]},{"r":20030000,"o":[150,225,300]},{"r":20031000,"o":[250,300,300]},{"r":20032000,"o":[250,300,300]},{"r":20033000,"o":[250,300,300]},{"r":20034000,"o":[300,350,400]},{"r":20035000,"o":[350,425,500]},{"r":20036000,"o":[350,425,500]},{"r":20037000,"o":[350,425,500]},{"r":20119000,"o":[350,425,500]},{"r":20038000,"o":[400,500,500]},{"r":20123000,"o":[450,475,500]},{"r":20128000,"o":[450,475,500]},{"r":20039000,"o":[450,500,500]},{"r":20101000,"o":[500,525,550]},{"r":20127000,"o":[500,525,550]},{"r":20102000,"o":[525,550,575]},{"r":20103000,"o":[550,575,600]},{"r":20129000,"o":[550,575,600]},{"r":20104000,"o":[600,625,650]},{"r":20105000,"o":[600,625,650]},{"r":20130000,"o":[600,650,700]}],[{"r":20040000,"o":[0,50,100]},{"r":20041000,"o":[0,50,100]},{"r":20042000,"o":[0,50,100]},{"r":20082000,"o":[0,100,100]},{"r":20090000,"o":[0,10,10]},{"r":20091000,"o":[10,20,20]},{"r":20092000,"o":[20,40,40]},{"r":20043000,"o":[50,100,100]},{"r":20044000,"o":[50,100,100]},{"r":20045000,"o":[100,150,200]},{"r":20046000,"o":[100,150,200]},{"r":20047000,"o":[100,150,200]},{"r":20048000,"o":[150,225,300]},{"r":20049000,"o":[150,225,300]},{"r":20050000,"o":[150,225,300]},{"r":20051000,"o":[250,300,300]},{"r":20052000,"o":[250,300,300]},{"r":20053000,"o":[250,300,300]},{"r":20054000,"o":[300,350,400]},{"r":20055000,"o":[350,425,500]},{"r":20056000,"o":[350,425,500]},{"r":20057000,"o":[350,425,500]},{"r":20118000,"o":[350,425,500]},{"r":20058000,"o":[400,500,500]},{"r":20122000,"o":[450,475,500]},{"r":20131000,"o":[450,475,500]},{"r":20059000,"o":[450,500,500]},{"r":20111000,"o":[500,525,550]},{"r":20126000,"o":[500,525,550]},{"r":20112000,"o":[525,550,575]},{"r":20113000,"o":[550,575,600]},{"r":20132000,"o":[550,575,600]},{"r":20114000,"o":[600,625,650]},{"r":20115000,"o":[600,625,650]},{"r":20133000,"o":[600,650,700]}],[{"r":20060000,"o":[0,50,100]},{"r":20061000,"o":[0,50,100]},{"r":20062000,"o":[0,50,100]},{"r":20080000,"o":[0,100,100]},{"r":20093000,"o":[0,10,10]},{"r":20094000,"o":[10,20,20]},{"r":20095000,"o":[20,40,40]},{"r":20063000,"o":[50,100,100]},{"r":20064000,"o":[50,100,100]},{"r":20065000,"o":[100,150,200]},{"r":20066000,"o":[100,150,200]},{"r":20067000,"o":[100,150,200]},{"r":20068000,"o":[150,225,300]},{"r":20069000,"o":[150,225,300]},{"r":20070000,"o":[150,225,300]},{"r":20071000,"o":[250,300,300]},{"r":20072000,"o":[250,300,300]},{"r":20073000,"o":[250,300,300]},{"r":20074000,"o":[300,350,400]},{"r":20075000,"o":[350,425,500]},{"r":20076000,"o":[350,425,500]},{"r":20077000,"o":[350,425,500]},{"r":20117000,"o":[350,425,500]},{"r":20078000,"o":[400,500,500]},{"r":20121000,"o":[450,475,500]},{"r":20137000,"o":[450,475,500]},{"r":20079000,"o":[450,500,500]},{"r":20106000,"o":[500,525,550]},{"r":20125000,"o":[500,525,550]},{"r":20107000,"o":[525,550,575]},{"r":20108000,"o":[550,575,600]},{"r":20138000,"o":[550,575,600]},{"r":20109000,"o":[600,625,650]},{"r":20110000,"o":[600,625,650]},{"r":20139000,"o":[600,650,700]}],[1855000,1862000,1856000,1940000,1941000,1942000,1943000,1863000,1864000,1865000,1866000,1867000,1868000,1869000,1870000,1871000,1872000,1873000,1874000,1875000,1876000,1877000,2516000,2736000,1878000,1879000,1980000,2517000,2518000,1981000,1982000,2737000,1999000,2001000,2738000,1861000,1881000,1880000,1939000,1944000,1945000,1946000,1882000,1883000,1884000,1885000,1886000,1887000,1888000,1889000,1890000,1891000,1892000,1893000,1894000,1895000,1896000,2525000,1897000,2526000,2730000,1898000,1983000,2527000,1984000,1985000,2731000,2002000,2004000,2732000,1859000,1899000,1858000,1938000,1947000,1948000,1949000,1900000,1901000,1902000,1903000,1904000,1905000,1906000,1907000,1908000,1909000,1910000,1911000,1912000,1913000,1914000,2522000,1915000,2523000,2733000,1916000,1989000,2524000,1990000,1991000,2735000,2008000,2010000,2734000,1857000,1917000,1860000,1937000,1950000,1951000,1952000,1918000,1919000,1920000,1921000,1922000,1923000,1924000,1925000,1926000,1927000,1928000,1929000,1930000,1931000,1932000,2519000,1933000,2520000,2739000,1934000,1986000,2521000,1987000,1988000,2740000,2005000,2007000,2741000],[]];

        TW_Calc.Craft.updateLastCraftedItemList = function () {

            $.get("game.php", {
                window: "crafting"
            }, function (resp) {

                TW_Calc.Craft.dataLastCraft = {};

                var recipes = resp.recipes_content;

                if (typeof recipes !== "undefined") {
                    for (var i = 0; i < recipes.length; i++) {
                        var reci = recipes[i].item_id;
                        TW_Calc.Craft.dataLastCraft[reci] = recipes[i].last_craft;
                        if (TW_Calc.Craft.professionsCache[5].indexOf(reci) === -1)
                            TW_Calc.Craft.professionsCache[5].push(reci);
                    }
                }

            });

        };

        TW_Calc.Craft.window = {};
        TW_Calc.Craft.window.id = "TWCALC_Craft";

        TW_Calc.Craft.window.showTab = function (id) {
            TW_Calc.functions.showTab($("." + TW_Calc.Craft.window.id), id);
        };

        TW_Calc.Craft.window.open = function (craft_id) {

            try {

                if ([1, 2, 3, 4].indexOf(craft_id) === -1)
                    craft_id = 1;

                var tabClick = function (win, id) {

                    TW_Calc.Craft.window.launch(Number(id.toString()[5]));

                    TW_Calc.Craft.window.showTab(id);
                };

                wman.open( TW_Calc.Craft.window.id, TW_Calc.getTranslation(183), "noreload")
                    .setMiniTitle(TW_Calc.getTranslation(183))
                    .addTab(TW_Calc.getTranslation(179), "craft1", tabClick)
                    .addTab(TW_Calc.getTranslation(180), "craft2", tabClick)
                    .addTab(TW_Calc.getTranslation(181), "craft3", tabClick)
                    .addTab(TW_Calc.getTranslation(182), "craft4", tabClick)
                    .appendToContentPane($('<div id="tab_craft1" style="display: none; margin: 8px 5px"></div><div id="tab_craft2" style="display: none; margin: 8px 5px"></div><div id="tab_craft3" style="display: none; margin: 8px 5px"></div><div id="tab_craft4" style="display: none; margin: 8px 5px"></div>'));

                $("." + TW_Calc.Craft.window.id + " > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > .tw2gui_window_tab_active").removeClass("tw2gui_window_tab_active");

                TW_Calc.Craft.window.launch(craft_id);

                TW_Calc.Craft.window.showTab('craft' + craft_id);

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.Craft.window.open').show();

            }

        };

        TW_Calc.Craft.window.filter = function (by, value) {

            $("#tab_craft" + TW_Calc.Craft.activeProfession + ">div>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane>div>.TWCalcRecipe").each(function () {

                var show = false, data = $(this).data()[by];

                if (typeof data === "undefined") return $(this).show();

                if (by === "name") {
                    show = data.toLowerCase().search(value.toLowerCase()) !== -1;
                } else {
                    show = data === value;
                }

                if (show) {
                    return $(this).show();
                }

                return $(this).hide();

            });

        };

        TW_Calc.Craft.window.updateRecipeRow = function (reciepeId) {

            var craft_recipe_data = {
                "inventory": {},
                "required": {}
            };

            var recipe = ItemManager.get(reciepeId);

            if (typeof recipe === "undefined")
                return;

            try {

                var myProfession = recipe.profession_id === Character.professionId;
                var productId = ItemManager.get(reciepeId).craftitem;
                var hasProducts = true;

                var items = [];

                if (typeof recipe.resources !== "undefined") {

                    for (var j = 0; j < recipe.resources.length; j++) {

                        var itemObj = recipe.resources[j];
                        var item = {};

                        if (typeof (itemObj.item) === "object") {
                            item.item = itemObj.item.item_id;
                        } else {
                            item.item = itemObj.item;
                        }

                        item.count = itemObj.count;
                        var bag_count = Bag.getItemCount(item.item);
                        var itemWidget = new tw2widget.CraftingItem(ItemManager.get(item.item)).setRequired(bag_count, item.count).getMainDiv();

                        craft_recipe_data.inventory[item.item] = bag_count;
                        craft_recipe_data.required[item.item] = item.count;

                        $(itemWidget).append($('<div></div>').append($(Quest.getMinimapLink({
                            id: item.item,
                            type: 'inventory_changed'
                        })).css({
                            'display': 'block',
                            'width': '16px',
                            'position': 'relative',
                            'opacity': '1',
                            'left': '4px'
                        })).css({
                            'width': '16px',
                            'right': '7px',
                            'bottom': '10px',
                            'position': 'absolute'
                        }));

                        if (hasProducts)
                            hasProducts = bag_count >= item.count;

                        items.push(itemWidget);

                    }

                }

                var calc_amount = {};
                var amount_data = [];

                for (var id in craft_recipe_data.inventory) {
                    calc_amount.id = id;
                    calc_amount.inventory = craft_recipe_data.inventory[id];
                    calc_amount.required = craft_recipe_data.required[id];
                    calc_amount.craftable = Math.floor(calc_amount.inventory / calc_amount.required);
                    amount_data.push(calc_amount.craftable);
                }

                var maxCraftable = Array.min(amount_data);
                var isLearned = TW_Calc.Craft.professionsCache[5].indexOf(reciepeId) !== -1;
                var craftable = myProfession && hasProducts && isLearned;
                var parent = $("#TWCalcRecipe_" + reciepeId);
                var difficult = Crafting.getRecipeColor(ItemManager.get(reciepeId));
                var lastCraft = TW_Calc.Craft.dataLastCraft[reciepeId];
                var canBeLearned = myProfession && Bag.items_by_id.hasOwnProperty(reciepeId) && !isLearned;

                $(parent).data("craftable", craftable);
                $(parent).data("difficulty", difficult);

                $(".recipe_title>.recipe_craft_amount", parent).empty().html(hasProducts ? new west.gui.Plusminusfield('recipe_button_Calc_' + reciepeId, 1, 1, maxCraftable, 1, TW_Calc.buttonLogic, TW_Calc.buttonLogic, TW_Calc.wheelLogic).getMainDiv() : $('<div></div>'));
                $(".recipe_title>.recipe_craft", parent).html(typeof lastCraft === "undefined" || lastCraft === null ? (craftable ? TW_Calc.getTranslation(177) : (canBeLearned ? TW_Calc.getTranslation(209) : '')) : '<span style="color: yellow; cursor: default;">' + lastCraft.formatDurationBuffWay() + '</span>')
                    .off("click");

                if (craftable) {
                    $(".recipe_title>.recipe_craft", parent).click(function () {
                        TW_Calc.Craft.start(Number($(this).data("id")));
                    });
                } else if (canBeLearned) {
                    $(".recipe_title>.recipe_craft", parent).click(function () {
                        ItemUse.use(Number($(this).data("id")), null, 'recipe');
                    });
                }

                var resources = $(".recipe_content>.recipe_resources", parent);
                resources.empty();

                for (var i = 0; i < items.length; i++) {
                    $(resources).append(items[i]);
                }

                $(".recipe_content>.recipe_craftitem", parent).empty().append(new tw2widget.CraftingItem(ItemManager.get(productId)).setCount(Bag.getItemCount(productId)).getMainDiv());

                if (myProfession) {
                    $('.recipe_title>.recipe_title_inner>.recipe_difficult', parent).css('opacity', isLearned ? 1 : 0).removeClass('middle hard easy').addClass(difficult);
                    $('.recipe_title>.recipe_title_inner>.recipe_name', parent).css("color", isLearned ? "white" : "gray");
                }

            } catch (e) {

                new TW_Calc.Error(e, 'updateRecipeRow ' + reciepeId).show();

            }

        };

        TW_Calc.Craft.window.showRecipe = function (crafting_product) {

            try {

                var profession_id = Math.floor(TW_Calc.Craft.professionsCache[4].indexOf(crafting_product) / 35) + 1;

                TW_Calc.Craft.window.open(profession_id);

                var recipe = $('#recipe_title_' + crafting_product).parent();

                $('.recipe_content', recipe).slideDown();

                setTimeout(function () {
                    var y = (TW_Calc.Craft.window.scrollPane.clipPane[0].clientHeight - 30) / TW_Calc.Craft.window.scrollPane.contentPane[0].clientHeight * $('.recipe_title', recipe)[0].offsetTop;
                    TW_Calc.Craft.window.scrollPane.scrollTo(0, y, true);
                }, 500);

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.Craft.showRecipe').show();

            }

        };

        TW_Calc.Craft.window.launch = function (craft_id) {

            try {

                if (typeof TW_Calc.Craft.dataLastCraft === "undefined") TW_Calc.Craft.dataLastCraft = {};

                TW_Calc.Craft.activeProfession = craft_id = Number(craft_id);

                var craft = TW_Calc.Craft.professionsCache[craft_id - 1];

                var parent = $("<div></div>");

                var myProfession = Character.professionId === craft_id;

                var groupFrame = new west.gui.Groupframe();
                var filter = $("<div style='margin-top: 2px'></div>");

                if (myProfession) {

                    TW_Calc.Craft.updateLastCraftedItemList();
                    
                    TW_Calc.Craft.window.progressBar = new west.gui.Progressbar()
                        .setValue(Character.professionSkill)
                        .setMaxValue(700);

                    groupFrame.appendToContentPane(TW_Calc.Craft.window.progressBar.getMainDiv());

                    var radioButtonCallback = function (changed) {
                        var value = this.getValue();
                        TW_Calc.Craft.window.filter(value[0], value[1]);
                    };

                    filter.append($('<div style="margin-top: 4px; float: right"></div>')
                        .append(new west.gui.Checkbox('', 'TWCalc_CraftFilter', radioButtonCallback).setValue([null, null]).setRadiobutton().setTooltip('Reset').setSelected(true).getMainDiv())
                        .append(new west.gui.Checkbox('', 'TWCalc_CraftFilter', radioButtonCallback).setValue(["craftable", true]).setRadiobutton().setTooltip(TW_Calc.getTranslation(176)).getMainDiv())
                        .append(new west.gui.Checkbox('', 'TWCalc_CraftFilter', radioButtonCallback).setValue(["difficulty", "easy"]).setRadiobutton().setTooltip('<div class="recipe_difficult easy" style="margin: 0; padding: 0; float: left"></div>').getMainDiv())
                        .append(new west.gui.Checkbox('', 'TWCalc_CraftFilter', radioButtonCallback).setValue(["difficulty", "middle"]).setRadiobutton().setTooltip('<div class="recipe_difficult middle" style="margin: 0; padding: 0; float: left"></div>').getMainDiv())
                        .append(new west.gui.Checkbox('', 'TWCalc_CraftFilter', radioButtonCallback).setValue(["difficulty", "hard"]).setRadiobutton().setTooltip('<div class="recipe_difficult hard" style="margin: 0; padding: 0; float: left"></div>').getMainDiv()));

                }

                filter.prepend(new west.gui.Textfield().setWidth(myProfession ? 535 : 638).setPlaceholder('Search...').setId('TWCalc_CraftSort_Name').getMainDiv().on('input', function () {
                    TW_Calc.Craft.window.filter("name", $('span>span>input', this).val());
                }));


                groupFrame.appendToContentPane(filter);
                parent.append(groupFrame.getMainDiv());

                var scrollPane = TW_Calc.Craft.window.scrollPane = new west.gui.Scrollpane();

                var recipes = $('<div></div>');

                $(recipes).append($('<div id="recipe_title_" class="recipe_title" style="display: inline-block; text-align: left;"><div class="recipe_title_inner"><div id="recipe_collapse_all" class="recipe_collapse">+' + '</div><div id="recipe_difficult_" class="recipe_difficult"></div><div id="recipe_name" class="recipe_name">' + TW_Calc.getTranslation(178) + '</div></div></div>')
                    .click(function () {

                        var collapse = $(".recipe_title_inner>.recipe_collapse", this);
                        var recipes = $(".tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane>div>.TWCalcRecipe>.recipe_content");
                        collapse.text(collapse.text() === "+" ? "-" : "+");

                        if (collapse.text() === "-") {
                            recipes.slideDown();
                            return;
                        }

                        recipes.slideUp();

                    }));

                for (var i = 0; i < craft.length; i++) {

                    var recipe = craft[i];

                    var reciepeId = Number(recipe.r);
                    var reciepe = ItemManager.get(reciepeId);

                    if (typeof recipe === "undefined")
                        continue;

                    var productId = ItemManager.get(reciepeId).craftitem;
                    var reciepeName = reciepe.name;

                    $(recipes).append(

                        $('<div id="TWCalcRecipe_' + reciepeId + '" data-id="' + reciepeId + '" data-name="' + reciepeName + '" class="TWCalcRecipe"></div>').append(

                            $('<div id="recipe_title_' + productId + '" class="recipe_title" style="display: inline-block; text-align: left;">')

                                .append(

                                    $('<div class="recipe_title_inner">' +
                                        '<div class="recipe_collapse">+</div>' +
                                        '<div class="recipe_difficult" id="recipe_difficult_' + reciepeId + '"></div>' +
                                        '<div class="recipe_name" style="width: 235px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" title="' + reciepeName + '">' + reciepeName.split(':').pop() + '</div>' +
                                        '<div class="recipe_colors" style="margin-top: 3px; color: white; font-size: 12px; font-family: monospace; ">' +
                                        '|&nbsp;<span style="color: rgb(196, 163, 103">' + reciepe.min_level + '</span>/<span style="color: rgb(88, 185, 88)">' + recipe.o[1] + '</span>/<span style="color:#55CDDD">' + reciepe.max_level + '</span>' +
                                        '</div>' +
                                        '</div>').click(function () {

                                        var collapse = $(".recipe_collapse", this);
                                        collapse.text(collapse.text() === "+" ? "-" : "+");
                                        $(".recipe_content", $(this).parent().parent()).slideToggle();

                                    })
                                )

                                .append('<div class="recipe_craft_amount"></div>')
                                .append($('<div data-id="' + reciepeId + '" class="recipe_craft" style="color: white"></div>'))
                        )
                            .append('<div class="recipe_content" style="margin-left: auto; margin-right: auto; display: none">' +
                                '<div class="recipe_craftitem"></div>' +
                                '<div class="recipe_resources"></div>' +
                                '</div>'));

                }

                scrollPane.appendContent(recipes);

                parent.append($(scrollPane.getMainDiv()).css({"height": myProfession ? 278 : 295, "text-align": "center"}));

                parent.append($('<a href="//tw-calc.net/craft/' + craft_id + '" target="_blank" title="Show this profession on tw-calc.net"><div style="background-position: 0 0; background-image: url(' + TW_Calc.icon + '); width: 25px; height: 25px; position: absolute; bottom: 0; left: 5px"></div></a>'));
                $("#tab_craft" + craft_id).empty().append(parent);

                for (i = 0; i < craft.length; i++) {
                    TW_Calc.Craft.window.updateRecipeRow(Number(craft[i].r));
                }

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.Craft.window.launch').show();

            }

        };

        /**
         * Quests
         * @type {{}}
         */
        TW_Calc.Quests = {
            loading: false,
            townsList: null,
        };

        TW_Calc.Quests.questEmployer = function (nr) {

            try {
                TW_Calc.NearestJob.getMap(function (map) {
                    var tmpObj = map.quest_locations[nr];
                    if (isDefined(tmpObj))
                        Map.center(tmpObj[0][0], tmpObj[0][1]);
                    else
                        new UserMessage(TW_Calc.getTranslation(204), 'hint').show();
                });

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.QuestsquestEmployer').show();

            }

        };

        TW_Calc.Quests.findShop = function (id, shop) {

            try {
                var that = this;
                if (that.loading)
                    return;
                that.loading = true;
                var processShop = function (pt) {
                    var town = that.townsList[pt];
                    if (town[shop].includes(id)) {
                        Trader.open(shop, town.town_id, town.x, town.y);
                        that.loading = false;
                    } else
                        loadShop(++pt);
                }
                var requestShop = function (rt) {
                    var town = that.townsList[rt];
                    $.get('game.php?window=building_' + shop + '&town_id=' + town.town_id, function (json) {
                        town[shop] = [];
                        for (var i = 0; i < json.trader_inv.length; i++)
                            town[shop].push(json.trader_inv[i].item_id);
                        processShop(rt);
                    });
                }
                var loadShop = function (lt) {
                        var town = that.townsList[lt];
                        if (!town) {
                            that.loading = false;
                            return new UserMessage(TW_Calc.getTranslation(219)).show();
                        }
                        if (!town[shop])
                            requestShop(lt);
                        else
                            processShop(lt);
                };
                var loadTowns = function (map) {
                    new UserMessage(TW_Calc.getTranslation(143), 'success').show();
                    if (that.townsList)
                        return loadShop(0);
                    that.townsList = [];
                    var home = Character.homeTown.town_id;
                    for (var x in map.towns) {
                        var town = map.towns[x];
                        if (town.member_count && town.town_points > 2000 && town.town_id != home)
                            that.townsList.push({
                              town_id: town.town_id,
                              x: town.x,
                              y: town.y,
                              dist: Map.calcWayTime(Character.position, town)
                            });
                    }
                    that.townsList.sort(function(a, b){return a.dist - b.dist;});
                    if (home)
                        that.townsList.unshift(Character.homeTown);
                    loadShop(0);
                };
                var mapData = TW_Calc.NearestJob.map;
                if (!mapData)
                    TW_Calc.NearestJob.getMap(loadTowns);
                else
                    loadTowns(mapData);

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.findShop').show();

            }

        };

        TW_Calc.Quests.init = function () {

            try {

                Quest.calc_getMinimapLink = Quest.getMinimapLink;

                Quest.getMinimapLink = function (jsRequirement) {

                    var mmLink = '';
                    var tmpObj = null;
                    var reqtypes = ['inventory_changed', 'wear_changed'];
                    var shops = {
                        head: 'tailor',
                        body: 'tailor',
                        foot: 'tailor',
                        pants: 'tailor',
                        right_arm: 'gunsmith',
                        left_arm: 'gunsmith',
                        neck: 'general',
                        animal: 'general',
                        belt: 'general',
                    };
                    
                    if (jsRequirement && jsRequirement.id && reqtypes.indexOf(jsRequirement.type) > -1) {

                        tmpObj = ItemManager.get(jsRequirement.id);
                        var inShop = shops[tmpObj.type];
                        
                        if (tmpObj.spec_type === 'crafting') {
                            return '<span class="quest_craftlink" style="cursor: pointer;" title=\'' + TW_Calc.getTranslation(192) + '\' onclick="TW_Calc.Craft.window.showRecipe(' + tmpObj.item_id + ')"><img src="/images/items/yield/toolbox.png" width="16"/></span>&nbsp;';
                        } else if (tmpObj.spec_type === 'mapdrop') {
                            mmLink += '<span class="tw2gui-iconset tw2gui-icon-hammer" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.NearestJob.findByProductId(' + tmpObj.item_id + ')"></span>';
                        } else if (tmpObj.traderlevel && tmpObj.traderlevel < 21 && inShop) {
                            mmLink += '<span class="tw2gui-iconset tw2gui-icon-home" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.Quests.findShop(' + tmpObj.item_id + ',\'' + inShop + '\')"></span>';
                        }

                    } else if (jsRequirement && jsRequirement.type === 'task-finish-walk') {
                        return '<span class="quest_employerlink" style="cursor: pointer;" title=\'' + TW_Calc.getTranslation(205) + '\' onclick="TW_Calc.Quests.questEmployer(' + jsRequirement.value + ')"><img src="/images/map/minimap/icons/miniicon_quests.png"/></span>&nbsp;';
                    } else if (jsRequirement && jsRequirement.type === 'task-finish-job') {
                        mmLink += '<span class="tw2gui-iconset tw2gui-icon-hammer" style="display: inline-block; cursor: pointer; vertical-align: middle; margin-right: 2px;" onclick="TW_Calc.NearestJob.addTask(' + jsRequirement.id + ', {})"></span>';
                    }

                    return mmLink + Quest.calc_getMinimapLink(jsRequirement);

                };

                Quest.calc_render = Quest.render;

                Quest.render = function () {
                    Quest.calc_render.apply(this, arguments);
                    this.el.find('.quest_description_container .strong').append('<a class="quest_calclink" style="float: right;" title="' + TW_Calc.getTranslation(206) + '" href="' + TW_Calc.website + '/quests/quest/' + this.id + '" target="_blank"><img src="/images/items/yield/book_plain.png" width="22"/></a>');
                };

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.Quests.init').show();

            }

        };

        OnGoingWestcalcErrorEntry = function (f) {

            this.init("", f);
            this.setTooltip("Westcalc error");
            this.setImageClass("hint");

        };

        OnGoingWestcalcErrorEntry.prototype = new OnGoingEntry();

        TW_Calc.Error = function (error, d) {
            this.e = error;
            this.d = d;
            this.show = function () {
                var that = this;
                TW_Calc.ErrorLog.add(that.e.message, that.d);
                WestUi.NotiBar.add(new OnGoingWestcalcErrorEntry(function () {
                    wman.open("TW-Calc-Error").appendToContentPane(that.e.message + '</br>' + that.d).setTitle("TW-Calc Error").setMiniTitle("TW-Calc Error").setSize(400, 300);
                }, "TW Calc Error accoured", "hint"));
                console.log('TW-Calc Error: ' + that.e.message + ' - ' + that.d);
            };
        };

        /**
         * Error Log
         * @type {{}}
         */
        TW_Calc.ErrorLog = {};

        TW_Calc.ErrorLog.sendError = function (errorCode) {
            if (/*TW_Calc.Settings.get("sendErrors") && */!TW_Calc.ShowLogs) {
                $.get(TW_Calc.website + "/service/send-error", {
                    errorCode: errorCode,
                    name: Character.name,
                    id: Character.playerId,
                    server: Game.gameURL,
                    locale: Game.locale,
                    WestcalcVersion: TW_Calc.version,
                    GameVersion: Game.version
                }, function (data) {}, "jsonp");
            }
        };

        TW_Calc.ErrorLog.create = function () {
            TW_Calc.ErrorLog.log = [];
        };

        TW_Calc.ErrorLog.add = function (e, d) {
            TW_Calc.ErrorLog.sendError(e + ' | ' + d);
            TW_Calc.ErrorLog.log.push([e, d]);
        };

        TW_Calc.ErrorLog.open = function () {

            var text = 'ErrorLog:\n';

            for (var k = 0; k < TW_Calc.ErrorLog.log.length; k++) {
                text += TW_Calc.ErrorLog.log[k][0] + ' | ' + TW_Calc.ErrorLog.log[k][1] + '\n';
            }

            wman.open("TW-Calc Errorlog")
                .appendToContentPane(new west.gui.Textarea()
                    .setReadonly()
                    .setContent(text)
                    .setWidth(675)
                    .setHeight(355)
                    .getMainDiv())
                .setTitle("TW-Calc Errorlog")
                .setMiniTitle("TW-Calc Errorlog");
        };

        TW_Calc.ErrorLog.create();


        /**
         *  Nearest Job
         * @type {{}}
         */
        TW_Calc.NearestJob = {};

        TW_Calc.NearestJob.selector = '#Westcalc_bottomBar';

        TW_Calc.NearestJob.MainDiv = '';

        TW_Calc.NearestJob.list = [];

        TW_Calc.NearestJob.map = null;

        TW_Calc.NearestJob.getMap = function (callback) {

            Ajax.get("map", "get_minimap", {}, function (data) {
                if (data.error)
                    return new UserMessage(data.msg).show();

                TW_Calc.NearestJob.map = data;

                if (typeof callback === "function") {
                    callback(data);
                }

            });

        };

        TW_Calc.NearestJob.lastPos = function () {

            var e = Character.position.x;
            var t = Character.position.y;
            var n = TaskQueue.queue;

            for (var r = 0; r < n.length; r++) {

                var i = n[r].wayData;

                if (i.x) {
                    e = i.x;
                    t = i.y;
                }

            }

            return [e, t];

        };

        TW_Calc.NearestJob.rightMenuButtonLogic = function (e) {

            TW_Calc.NearestJob.Selectbox = new west.gui.Selectbox()
                .setHeader(TW_Calc.getTranslation(152));
            TW_Calc.NearestJob.Selectbox.divMain.find(".arrow").remove();

            var sBox = TW_Calc.NearestJob.Selectbox;
            var data = TW_Calc.NearestJob.list;

            sBox.addItem(0, TW_Calc.getTranslation(150));

            for (var i = 0; i < data.length; i++) {
                sBox.addItem(data[i], JobList.getJobById(data[i]).name);
            }

            sBox.addListener(function (id) {
                if (id) {
                    TW_Calc.NearestJob.search(id);
                } else {
                    TW_Calc.NearestJob.open();
                }
            });

            sBox.show(e);

        };

        TW_Calc.NearestJob.findByProductId = function (id) {

            this.use(function () {

                var jobs = JobList.getJobsIdsByItemId(id);

                var getJobsRecursive = function (productId, jobs, job_data) {

                    var job;

                    if (!jobs.length) {

                        var max = 0;

                        for (var i = 0; i < job_data.length; i++) {

                            var items = job_data[i]["durations"][2]["items"];

                            for (var j = 0; j < items.length; j++) {
                                var luck = items[j].prop + items[j].probBonus;
                                if (luck > max) {
                                    job = job_data[i].id;
                                    max = luck;
                                }
                            }

                        }

                        return job && TW_Calc.NearestJob.addTask(job);

                    }

                    var id = jobs[0];
                    jobs.splice(0, 1);
                    job = TW_Calc.NearestJob.find(id);

                    Ajax.remoteCallMode("job", "job", {"jobId": id, "x": job.x, "y": job.y}, function (data) {

                        job_data.push(data);

                        getJobsRecursive(productId, jobs, job_data);

                    });

                };

                getJobsRecursive(id, jobs, []);

            }.bind(this));

        };

        TW_Calc.NearestJob.find = function (jobId) {

            var obj = TW_Calc.NearestJob;

            if (!obj.map)
                return;

            var u = obj.map.job_groups;
            var n = JobList.getJobById(jobId);
            var r = u[n.groupid];

            if (!r) return [];

            var i = [];

            var s = obj.lastPos();

            for (var o = 0; o < r.length; o++) {

                var a = r[o][0] - s[0];
                var f = r[o][1] - s[1];
                var l = Math.sqrt(a * a + f * f);
                i.push({
                    dist: l,
                    x: r[o][0],
                    y: r[o][1]
                });

            }

            var p = function (e, t) {
                return e.dist * 1 > t.dist * 1 ? 1 : -1;
            };

            i.sort(p);

            return i[0];

        };

        TW_Calc.NearestJob.use = function (callback) {

            if (!TW_Calc.isNotUndefinedNullOrNaN(this.map)) {

                new UserMessage(TW_Calc.getTranslation(143), "success").show();

                return this.getMap(callback.bind(this));

            }

            return callback();

        };

        TW_Calc.NearestJob.addTask = function (jobId, dataType) {

            this.use(function () {

                var job = this.find(jobId);

                if (dataType) {
                    switch (dataType.type) {
                        case "startJob":
                            return TaskQueue.add(new TaskJob(jobId, Number(job.x), Number(job.y), dataType.duration));
                            break;
                    }
                }

                return JobWindow.open(jobId, Number(job.x), Number(job.y));

            }.bind(this));

        };

        TW_Calc.NearestJob.search = function (id) {
            this.addTask(id, {
                type: "window"
            });
        };

        TW_Calc.NearestJob.save = function (node) {

            var data = TW_Calc.storage.get("jobList", "");

            data = data.length ? TW_Calc.storage.get("jobList").split(",") : [];

            var job_id = Number(node.attr("job_id"));

            if (Number(node.css("opacity")) === 1) {
                data.splice(data.indexOf(job_id), 1);
            } else if (data.indexOf(job_id) === -1) {
                data.push(job_id);
            }

            if (data.length) {
                TW_Calc.storage.add("jobList", data.join());
            } else {
                TW_Calc.storage.remove("jobList");
            }

            TW_Calc.NearestJob.build();
            TW_Calc.NearestJob.fade(node);
            TW_Calc.NearestJob.loadBottomBar();

        };

        TW_Calc.NearestJob.build = function () {

            var jobList = TW_Calc.storage.get("jobList");

            if (typeof jobList !== "undefined" && jobList.length) {
                this.list = TW_Calc.storage.get("jobList").split(",");
            } else {
                this.list = [];
            }

        };

        TW_Calc.NearestJob.fade = function (node) {
            node.css("opacity", Number(node.css("opacity")) === 1 ? 0.5 : 1);
        };

        TW_Calc.NearestJob.searchInWindow = function (name) {

            var jobs = $("#TWCalc_NearestJob_Jobs>div>div>.tw2gui_scrollpane_clipper_contentpane>.job");

            jobs.hide();

            for (var i = 0; i < jobs.length; i++) {

                var job = JobList.getJobById(Number($(jobs[i]).attr("job_id")));

                if (job.name.toLowerCase().search(name.toLowerCase()) != -1) {
                    $(jobs[i]).show();
                }

            }

        };

        TW_Calc.escapeHTML = function escapeHtml(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        };

        TW_Calc.NearestJob.reset = function () {
            TW_Calc.storage.add('jobList', '');
            TW_Calc.NearestJob.build();
            TW_Calc.NearestJob.loadBottomBar();
        };

        TW_Calc.NearestJob.open = function (index) {

            new west.gui.Dialog(TW_Calc.getTranslation(152), '<div id="TWCalc_NearestJob_Jobs" style="width: 615px; height: 325px"></div><div id="TWCalc_NearestJob_Search" style="width:615px;"></div>')
                .addButton(TW_Calc.getTranslation(149), function () {

                    new west.gui.Dialog(TW_Calc.getTranslation(148), TW_Calc.getTranslation(146))
                        .addButton(TW_Calc.getTranslation(149), TW_Calc.NearestJob.reset)
                        .addButton(TW_Calc.getTranslation(92), function () {})
                        .show();

                })
                .addButton(TW_Calc.getTranslation(147), function () {})
                .show();

            var selector = $("#TWCalc_NearestJob_Jobs");

            var scrollPane = new west.gui.Scrollpane();

            for (var i = 0; i < JobList.getSortedJobs("id").length; i++) {

                var job = JobList.getSortedJobs("id")[i];

                scrollPane.appendContent('<div class="job twcalc_job" style="opacity:' + (TW_Calc.NearestJob.list.indexOf(job.id.toString()) != -1 ? '1' : '0.5') + '; position: relative !important; display: inline-block !important" title="' + TW_Calc.escapeHTML(TW_Calc.NearestJob.jobPopup(job.id)) + '" job_id="' + job.id + '" onclick="TW_Calc.NearestJob.save($(this));">' + '<img src="/images/jobs/' + job.shortname + '.png" class="job_icon" /></div>');

            }

            selector.append(scrollPane.getMainDiv());

            $('#TWCalc_NearestJob_Search').append(new west.gui.Textfield()
                .setId('TWCalc_NearestJobDialog_Search')
                .setWidth(600)
                .setPlaceholder(TW_Calc.getTranslation(151))
                .getMainDiv());

            $('#TWCalc_NearestJobDialog_Search').keyup(function () {
                TW_Calc.NearestJob.searchInWindow($(this).val());
            });

        };

        TW_Calc.NearestJob.jobPopup = function (el) {

            if (ItemManager.isLoaded() === true) {
                TW_Calc.NearestJob.bottomBarPopups = true;
                return Map.PopupHandler.getJobPopup(JobList.getJobById(el));
            } else {
                return JobList.getJobById(el).name;
            }

        };

        TW_Calc.NearestJob.start = function (jobid, duration) {

            TW_Calc.NearestJob.addTask(jobid, {
                type: "startJob",
                duration: duration
            });

        };

        TW_Calc.NearestJob.posY = 97;

        TW_Calc.NearestJob.JobBarEnabled = (Number(TW_Calc.Settings.get("topBar", 1)) === 1) || (Number(TW_Calc.Settings.get("topBar", 1)) === 2) || (Number(TW_Calc.Settings.get("topBar", 1)) === 5);

        TW_Calc.NearestJob.loadBottomBar = function () {

            if (TW_Calc.NearestJob.JobBarEnabled) {

                TW_Calc.NearestJob.bottomBar = new west.gui.Scrollpane();
                TW_Calc.NearestJob.bottomBar.verticalBar.hide();

                $("#Westcalc_JobBar").remove();

                var topBar = Number(TW_Calc.Settings.get("topBar", 1));

                if (topBar === 1 || topBar === 2 || topBar === 5) {
                    var jobBarDiv = $('<div id="Westcalc_JobBar" style="overflow: hidden; width: 510px; height: 61px; margin-left: auto; margin-right: auto; text-align: left"></div>');
                    if (topBar === 5)
                        jobBarDiv.css({
                            "background": "rgba(29, 28, 28, 0.8)",
                            "border": "1px solid rgb(100, 100, 100)",
                            "border-radius": "2px",
                            "box-shadow": "rgb(0, 0, 0) 0px 0px 1px 1px",
                            "padding-left": "5px"
                        });

                    $(TW_Calc.NearestJob.MainDiv).append(jobBarDiv);
                }

                var bottomBar = $('#Westcalc_JobBar');
                var data = TW_Calc.NearestJob.list;
                var selector = TW_Calc.NearestJob.bottomBar;

                for (var i = 0; i < data.length; i++) {
                    var job = JobList.getJobById(data[i]);
                    selector.appendContent('<div class="job twcalc_job" style="position: relative !important; display: inline-block !important; margin-top: 5px; margin-bottom: 2px;" job_id="' + job.id + '"><div class="featured" title="' + TW_Calc.escapeHTML(TW_Calc.NearestJob.jobPopup(job.id)) + '" onclick="TW_Calc.NearestJob.search($($(this).parent()).attr(&quot;job_id&quot;));"></div>' + (Premium.hasBonus("automation") === true ? '<div class="instantwork-short" title="15s - ' + job.name + '" onclick="TW_Calc.NearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),15);"></div><div class="instantwork-middle" title="10m - ' + job.name + '" onclick="TW_Calc.NearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),600);"></div><div class="instantwork-long" title="1h - ' + job.name + '" onclick="TW_Calc.NearestJob.start($($(this).parent()).attr(&quot;job_id&quot;),3600);"></div>' : '') + '<img src="/images/jobs/' + job.shortname + '.png" class="job_icon" /></div>');
                }

                selector.appendContent('<div class="job twcalc_job" style="position: relative !important; display: inline-block !important; margin-top: 5px; margin-bottom: 2px" title="' + TW_Calc.getTranslation(150) + '" onclick="TW_Calc.NearestJob.open()"><div class="featured"></div>' + '<img src="data:image/png;data:;base64,' + TW_Calc.bottomImg + '" class="job_icon" /></div>');

                bottomBar.append(TW_Calc.NearestJob.bottomBar.getMainDiv());

            }

            if (ItemManager.isLoaded() === true) {
                TW_Calc.NearestJob.bottomBarPopups = true;
            }

        };

        TW_Calc.NearestJob.loadedPopups = function () {

            if (TW_Calc.NearestJob.bottomBarPopups === false || TW_Calc.NearestJob.bottomBarPopups === undefined) {

                TW_Calc.NearestJob.loadBottomBar();

                setTimeout(TW_Calc.NearestJob.loadedPopups, 1000);

            } else {

                TW_Calc.NearestJob.bottomBarPopups = true;

            }
        };

        TW_Calc.NearestJob.init = function () {

            try {

                this.build();

                if (TW_Calc.NearestJob.JobBarEnabled) {

                    TW_Calc.NearestJob.loadBottomBar();
                    TW_Calc.NearestJob.loadedPopups();

                    TW_Calc.NearestJob.getMap();

                }

            } catch (e) {

                new TW_Calc.Error(e, 'TW_Calc.NearestJob.init').show();

            }

        };

        TW_Calc.NearestJob.bottomBarMover = function () {

            TW_Calc.NearestJob.intTimer = 500;

            TW_Calc.NearestJob.int = setInterval(function () {

                var topBar = Number(TW_Calc.Settings.get("topBar", 1));

                if (topBar === 1 || topBar === 5 || Number(TW_Calc.Settings.get("duelBar", 1)) === 2) {

                    var n = $("div#ui_bottombar").height() + 5 + (Game.version <= 2.06 ? 0 : 14) + ($(".friendsbar").height() > 0 ? $(".friendsbar").height() : 0);

                    if ($("#ui_windowdock").css("display") == "none" || $('.windowbar_frames').html() == '') n += 15; else n += 47;

                    $('#WESTCALC_BOTTOM_BAR').stop();
                    TW_Calc.NearestJob.posY = n;
                    $('#WESTCALC_BOTTOM_BAR').animate({
                        "bottom": n
                    }, TW_Calc.NearestJob.intTimer);

                }

            }, TW_Calc.NearestJob.intTimer);


        };

        /**
         * Wardrobe
         * @type {{}}
         */
        TW_Calc.Wardrobe = {};

        TW_Calc.Wardrobe.id = 'TW_Calc_Wardrobe';
        TW_Calc.Wardrobe.img = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDAQcHBw0MDRgQEBgUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCAAaADIDAREAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAQQFAgMG/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAB8VhsZeWVooyAGk0rmihNVse3LUUi3P1yeh8WBtiTrLn6GGk7VPOhJO0T8lvHT//EACIQAAICAQMEAwAAAAAAAAAAAAIDAQQAEhMhEBQVMyQxMv/aAAgBAQABBQJhWWO270RJ3QI+WwqcKDzVlRnyAtyLLbBlKGj5CLJyLXg1e8jFOBb+65tvSyIcsbUOmcZYWcagy37l4r3W/wBh99P/xAAoEQABAwIEBAcAAAAAAAAAAAAAAREhAqEDIkFREBKxwTFhgZHR4vD/2gAIAQMBAT8BV1MxJKiIpJOwgv29M0ftkNDUa/h5Nyv791MORxFPl+sXsOOg3azdWuOxBiFBSVFPH//EACURAAIABQMDBQAAAAAAAAAAAAABAhESIfAQMUEDUWEikaHR4f/aAAgBAgEBPwGyKocYqSckVITWkaEp25dk+zb3FuNenO4nL5+v0cLTlyrexSyJCXjMsQJok5CtnjGUvTp7EWkOw9f/xAAxEAABAgIHBQYHAAAAAAAAAAABAAIRMQMSISIyQYE0QkNRYTNxgsHR8AQkkaGx0uH/2gAIAQEABj8CcGyFkAIyW9oz+IOc59mRi1OZDDYOeqwkaKJrgahb+CviM/rLrNU0ItspLw8paSTXmnpi2INXnDLHmqIueXXXXnzxa/lEC0VxA6IfM0/L3fReXuqmkcRXylAZ2D2F2nBj79FSGsWm+IwMbc1EfEUn3Pmt6wQibZ9+XIRPei8m8CDhMZLaKSXX9kK9Z0LY9enIawjKAli4VTDl6p+CQnikuH4lR7PNNwYc/LpyW54k3Z5rh9ov/8QAJRABAAICAQQBBAMAAAAAAAAAAREhADFBUWGB8HGRscHhEKHR/9oACAEBAAE/IUlVE3g4m5b3ep4MCEDHEH2wT4WLw5KhJ1JeSISLkkIPlwxUmCK+M/wYGIBqd31Mh09b9frkaqzN5uHqG7W5w52Y1gXf0Mf/AHLLtu7xRao+DYAsa13ixwE5d9cXyzFUohvcqIufl+ge/niRRYBFbt1uYrxgd8ESQK7MWejXXCUzVEkN3ZbMMoRKbyoccgRHng6VeCESkJ+7DVPm1MaEhWolJSMGDHd+s7+jPYP1/Wbe3nP8/vx36d89Ld5PY98Zz2/3/g//2gAMAwEAAgADAAAAEDRH2Tok62DYDCLP/8QAHxEAAgMAAgIDAAAAAAAAAAAAAAERITFBURAggaHx/9oACAEDAQE/EBJdvoaW9G6HQkQJ/QWmQv5NFCsTaCzgkjJJ4fgobXYK1gSGx6vQFJojsaMGkcfR/8QAIBEBAAICAgEFAAAAAAAAAAAAAQARITEQYUFRcYHB4f/aAAgBAgEBPxArzHrm0xAWRTaVPCnzKa941jUZQqqPSYzFjIP46R50CHVHQxKBG1n3CmYsSpmyXuBC3i0jp3yDj//EACQQAQACAgAFBAMAAAAAAAAAAAEAESExEFFhcZFBocHwsdHh/9oACAEBAAE/EDXBqGkBrQBwfoDTsesSlAQBYswiBzIu6ogVs3gQPBYVAt9b+SHYmqYgya5mOCrUNWjmjCqSsUIxyfEhVaApTFylgzIFHKBMAwCA2AX82ekIJgrIVnwxCzAoJFdLQ/o37gpwqJQFhjSeShgglN5oW1EEdWr8k1yAJfESYGBiJV1JBaFAgVVX8UZ1g6L8IGE/AFSYT+k+G51dffqPDvehfQ9kHu+7cHyPt4H/2Q==';

        TW_Calc.Wardrobe.bannedLocales = TW_Calc.Wardrobe_bannedLocales;

        TW_Calc.Wardrobe.window = {};

        TW_Calc.Wardrobe.undefined = 'Unnamed';

        TW_Calc.Wardrobe.init = function () {

            TW_Calc.Wardrobe.window.title = {
                Wardrobe: TW_Calc.getTranslation(170),
                OwnCalc: TW_Calc.getTranslation(160)
            };

        };

        TW_Calc.Wardrobe.window.launch = function () {

            if (typeof (wman.getById('wear')) === "undefined") {
                Wear.open();
            } else {
                wman.getById('wear').bringToTop();
            }

            if (typeof (wman.getById('inventory')) !== "undefined") {
                wman.getById('inventory').destroy();
            }

            TW_Calc.Wardrobe.window.open();

        };

        TW_Calc.Wardrobe.window.getPos = function (pos) {

            var win = $('.tw2gui_window.tw2gui_win2.tw2gui_window_notabs.wear');

            return {
                x: Number(win.css("left").split('px')[0]) + Number(win.css("width").split('px')[0]),
                y: Number(win.css("top").split('px')[0])
            }[pos];

        };

        TW_Calc.Wardrobe.window.moveTo = function (x, y) {
            $('.tw2gui_window.tw2gui_win2.' + TW_Calc.Wardrobe.id)
                .css('left', this.getPos('x'))
                .css('top', this.getPos('y'));
        };

        TW_Calc.Wardrobe.alert = function () {

            if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) !== -1 && typeof TW_Calc.storage.get("WardrobeBannedLocaleAlert") === "undefined") {
                new west.gui.Dialog().setText("TW-Calc Wardrobe is disabled because is not allowed by your game admin in your game locale.")
                    .setTitle("TW-Calc Wardrobe is disabled").show().addButton("ok");
                TW_Calc.storage.add("WardrobeBannedLocaleAlert", 1);
            }

        };

        TW_Calc.Wardrobe.window.iconPlusHmtl = '<div style="background: url(/images/tw2gui/iconset.png); width: 16px; height: 16px; display: inline-block; background-position: -16px 80px; cursor: pointer; margin: 2px 4px;" class="hasMousePopup"></div>';
        TW_Calc.Wardrobe.window.iconSelectBoxHmtl = '<div style="background: url(/images/window/character/title_editbtn.jpg) no-repeat; width: 24px; height: 18px; cursor: pointer; background-position: -2px -1px; border: 1px solid; margin: 0 2px; display: inline-block"></div>';

        TW_Calc.Wardrobe.window.showTab = function (id) {

            TW_Calc.functions.showTab($("." + TW_Calc.Wardrobe.id), id);

            wman.getById(TW_Calc.Wardrobe.id)
                .setTitle(TW_Calc.Wardrobe.window.title[id])
                .setMiniTitle(TW_Calc.Wardrobe.window.title[id]);

        };


        TW_Calc.Wardrobe.window.open = function () {

            var win = wman.open(TW_Calc.Wardrobe.id, TW_Calc.getTranslation(170), "noreload")
                .setSize(328, 363);

            var tabClick = function (win, id) {

                TW_Calc.Wardrobe[id].launch(id == "Wardrobe" ? 0 : null);

                this.showTab(id);

            }.bind(this);

            if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) === -1) {
                win.addTab(TW_Calc.getTranslation(170), 'Wardrobe', tabClick);
            }

            win.addTab(TW_Calc.getTranslation(160), 'OwnCalc', tabClick);

            var wardrobe = $('<div id="Wardrobe"></div>')
                .append($('<div style="margin: 15px 5px 5px 5px; height: 20px"><span class="TW_Calc_WardrobeCaption" style="font-size: 20px; font-family: Georgia, \'Times New Roman\', serif; text-shadow: 1px 1px 0 #FFCC66, 1px 1px 2px #000000;"></span></div>')
                    .append($('<div style="float: right"></div>')
                        .append($(this.iconPlusHmtl).attr("title", TW_Calc.getTranslation(161)).click(TW_Calc.Wardrobe.Wardrobe.addDialog))
                        .append($(this.iconSelectBoxHmtl).attr("title", TW_Calc.getTranslation(172)).click(function (el) {

                            var selectBox = new west.gui.Selectbox()
                                .setHeader(TW_Calc.getTranslation(170));

                            var items = TW_Calc.Wardrobe.getObject("Wardrobe");

                            for (var i = 0; i < items.length; i++) {
                                var name = items[i][items[i].length - 1];
                                selectBox.addItem(i, name.length ? name : TW_Calc.Wardrobe.undefined);
                            }

                            selectBox.addListener(TW_Calc.Wardrobe.Wardrobe.launch);

                            selectBox.show(el);

                        }))
                    ))
                .append('<div class="TW_Calc_WardrobeContent"></div>');

            var ownCalc = $('<div id="OwnCalc"></div>')
                .append($('<div style="margin: 15px 5px 5px 5px; height: 20px"><span class="TW_Calc_WardrobeCaption" style="font-size: 20px; font-family: Georgia, \'Times New Roman\', serif; text-shadow: 1px 1px 0 #FFCC66, 1px 1px 2px #000000;"></span></div>')
                    .append($('<div style="float: right"></div>')
                        .append($(this.iconPlusHmtl).attr("title", TW_Calc.getTranslation(161)).click(TW_Calc.Wardrobe.OwnCalc.addDialog))
                        .append($(this.iconSelectBoxHmtl).attr("title", TW_Calc.getTranslation(172)).click(function (el) {

                            var selectBox = new west.gui.Selectbox()
                                .setHeader(TW_Calc.getTranslation(160));

                            var items = TW_Calc.Wardrobe.getObject("OwnCalc");

                            for (var i = 0; i < items.length; i++) {
                                var name = items[i].name;
                                selectBox.addItem(i, name.length ? name : TW_Calc.Wardrobe.undefined);
                            }

                            selectBox.addListener(TW_Calc.Wardrobe.OwnCalc.launch);

                            selectBox.show(el);

                        }))
                    ))
                .append('<div class="TW_Calc_WardrobeContent"></div>');

            win.appendToContentPane($('<div id="tab_Wardrobe" style="display: none; margin: 2px;"></div>').html(wardrobe))
                .appendToContentPane($('<div id="tab_OwnCalc" style="display: none; margin: 2px;"></div>').html(ownCalc));

            $("." + TW_Calc.Wardrobe.id + " > div.tw2gui_window_tabbar > .tw2gui_window_tabbar_tabs > .tw2gui_window_tab_active").removeClass("tw2gui_window_tab_active");

            this.moveTo(this.getPos('x'), this.getPos('y'));

            var activeTab = "Wardrobe";

            if (TW_Calc.Wardrobe.bannedLocales.indexOf(Game.locale) !== -1) {
                activeTab = "OwnCalc";
            }

            TW_Calc.Wardrobe[activeTab].launch(activeTab === "Wardrobe" ? 0 : null);

            this.showTab(activeTab);

        };

        TW_Calc.Wardrobe.getObject = function (type) {

            var data = '[]';

            if (typeof TW_Calc.storage.get(type) !== "undefined") {
                data = TW_Calc.storage.get(type);
            }

            return JSON.parse(data);

        };

        TW_Calc.Wardrobe.saveObject = function (type, data) {
            TW_Calc.storage.add(type, JSON.stringify(data));
        };

        TW_Calc.Wardrobe.removeFromObject = function (type, index) {
            var item = TW_Calc.Wardrobe.getObject(type);
            item.splice(index, 1);
            TW_Calc.Wardrobe.save(item);
        };

        TW_Calc.Wardrobe.fadeWearItems = function () {
            if (Bag.loaded) {
                for (var k in Wear.wear) {
                    var item = Wear.wear[k].obj;
                    $('.TW_Calc_WardrobeContent>.tw2gui_groupframe>.tw2gui_groupframe_content_pane>.item.item_inventory[item_id=' + item.item_id + ']')
                        .css('opacity', '0.5');
                }
            }
        };

        TW_Calc.Wardrobe.wear = function (input) {

            var items;

            if (typeof input === "number")
                items = [input];
            else if (typeof input === "object")
                items = input;
            else return;

            if (Bag.loaded) {

                for (var i = 0; i < (items.length); i++) {

                    var id = items[i];

                    if (typeof Bag.getItemByItemId(Number(id)) !== "undefined") {
                        Wear.carry(Bag.getItemByItemId(Number(id)));
                    }

                    $('.TW_Calc_WardrobeContent>.tw2gui_groupframe>.tw2gui_groupframe_content_pane>.item.item_inventory[item_id=' + id + ']').css('opacity', '0.5');

                }

            } else {
                Bag.loadItems();
            }

        };

        TW_Calc.Wardrobe.remove = function (type, index) {

            var items = TW_Calc.Wardrobe.getObject(type);
            items.splice(index, 1);
            TW_Calc.Wardrobe.saveObject(type, items);

            new UserMessage(TW_Calc.getTranslation(165), UserMessage.TYPE_SUCCESS).show();

            TW_Calc.Wardrobe[type].launch();

        };

        TW_Calc.Wardrobe.Wardrobe = {};

        TW_Calc.Wardrobe.Wardrobe.launch = function (index) {

            var groupFrame = new west.gui.Groupframe();

            var set = TW_Calc.Wardrobe.getObject("Wardrobe");
            var caption = $("#Wardrobe>div>.TW_Calc_WardrobeCaption");
            var content = $("#Wardrobe>.TW_Calc_WardrobeContent");
            caption.empty();

            if (typeof index !== "undefined" && typeof set[index] !== "undefined") {

                var name = set[index][set[index].length - 1];

                $(caption).append($('<span data-index="' + index + '" style="background: url(/images/tw2gui/iconset.png); display: inline-block; width: 16px; height: 16px; background-position: -48px 0px; cursor: pointer; margin: 2px" title="' + TW_Calc.getTranslation(171) + '"></span>')
                    .click(function () {
                        TW_Calc.Wardrobe.remove("Wardrobe", $(this).data("index"))
                    })).append(name.length ? name : TW_Calc.Wardrobe.undefined);

                if (Bag.loaded) {

                    for (var i = 0; i < set[index].length - 1; i++) {
                        if (Number(set[index][i])) {
                            var item = new tw2widget.InventoryItem(ItemManager.get(set[index][i]));
                            groupFrame.appendToContentPane($(item.getMainDiv())
                                .attr('item_id', set[index][i]).click(function () {
                                    TW_Calc.Wardrobe.wear(Number($(this).attr('item_id')));
                                }));
                        }
                    }

                } else {
                    Bag.loadItems();
                }

                if (Premium.hasBonus("automation")) {
                    groupFrame.appendToContentPane(new west.gui.Button().setCaption(TW_Calc.getTranslation(207)).click(function () {
                        var items = set[index];
                        items.splice(items.length - 1, 1);
                        TW_Calc.Wardrobe.wear(items);
                    }.bind(this)).getMainDiv());
                }

                var groupFrameDiv = groupFrame.getMainDiv();

                $(".tw2gui_groupframe_background", groupFrameDiv).css("background", "url('/images/interface/wood_texture_dark.jpg')");
                $(".tw2gui_groupframe_content_pane", groupFrameDiv).css("height", "180px");

                $(content).html(groupFrameDiv);

                TW_Calc.Wardrobe.fadeWearItems();

            } else {

                $(content).html('<div style="margin: 15px; text-align: center; font-weight: bold">' + TW_Calc.getTranslation(208) + '</div>');

            }

        };

        TW_Calc.Wardrobe.Wardrobe.saveWear = function (name) {

            var data = [];
            var slots = ['animal', 'belt', 'body', 'foot', 'head', 'left_arm', 'neck', 'pants', 'right_arm', 'yield', 'name'];

            for (var i = 0; i < slots.length; i++) {

                if (slots[i] !== 'name') {
                    if (typeof Wear.wear[slots[i]] !== "undefined") {
                        data.push(Wear.wear[slots[i]].getId());
                    } else {
                        data.push(null);
                    }
                } else {
                    data.push(name);
                }

            }

            var wardrobe = TW_Calc.Wardrobe.getObject("Wardrobe");
            wardrobe.push(data);
            TW_Calc.Wardrobe.saveObject("Wardrobe", wardrobe);

            new UserMessage(TW_Calc.getTranslation(165), UserMessage.TYPE_SUCCESS).show();

            TW_Calc.Wardrobe.Wardrobe.launch(wardrobe.length - 1);

        };

        TW_Calc.Wardrobe.Wardrobe.addDialog = function () {

            new west.gui.Dialog()
                .setTitle(TW_Calc.getTranslation(161))
                .setId('TW_Calc_WardrobeDialog')
                .setText(TW_Calc.getTranslation(164))
                .addButton(TW_Calc.getTranslation(163), function () {
                    TW_Calc.Wardrobe.Wardrobe.saveWear($('#TW_Calc_Wardrobe_Wardrobe_Add').val());
                })
                .addButton(TW_Calc.getTranslation(162), function () {})
                .show();

            $('#TW_Calc_WardrobeDialog > .tw2gui_dialog_content > .tw2gui_dialog_text').append('</br>')
                .append(new west.gui.Textfield()
                    .setWidth("400px")
                    .setPlaceholder(TW_Calc.getTranslation(166))
                    .setId("TW_Calc_Wardrobe_Wardrobe_Add").getMainDiv());

        };

        TW_Calc.Wardrobe.OwnCalc = {};

        TW_Calc.Wardrobe.OwnCalc.getBestItems = function (skills) {

            var set = west.item.Calculator.getBestSet(skills), items = set && set.getItems() || [],
                invItems = Bag.getItemsByItemIds(items),
                result = {},
                invItem,
                wearItem,
                _wear = {},
                i;

            for (i = 0; i < items.length; i++) {
                _wear[ItemManager.get(items[i]).type] = items[i];
            }

            for (i = 0; i < invItems.length; i++) {

                invItem = invItems[i];
                wearItem = Wear.get(invItem.getType());

                if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                    result[invItem.getType()] = invItem.getId();
                }

            }

            var output = [];

            for (i = 0; i < Wear.slots.length; i++) {

                var type = Wear.slots[i];

                if (result.hasOwnProperty(type)) {
                    output.push(result[type]);
                } else if (Wear.wear.hasOwnProperty(type)) {
                    output.push(Wear.wear[type].obj.item_id);
                } else if (_wear.hasOwnProperty(type)) {
                    output.push(_wear[type]);
                }

            }

            return output;

        };

        TW_Calc.Wardrobe.OwnCalc.launch = function (index) {

            var groupFrame = new west.gui.Groupframe();

            var set = TW_Calc.Wardrobe.getObject("OwnCalc");
            var caption = $("#OwnCalc>div>.TW_Calc_WardrobeCaption");
            var content = $("#OwnCalc>.TW_Calc_WardrobeContent");
            caption.empty();

            if (typeof index !== "undefined" && typeof set[index] !== "undefined") {

                var name = set[index].name;

                $(caption).append($('<span data-index="' + index + '" style="background: url(/images/tw2gui/iconset.png); display: inline-block; width: 16px; height: 16px; background-position: -48px 0px; cursor: pointer; margin: 2px" title="' + TW_Calc.getTranslation(171) + '"></span>')
                    .click(function () {
                        TW_Calc.Wardrobe.remove("OwnCalc", $(this).data("index"))
                    }))
                    .append($('<div data-index="' + index + '" style="background: url(/images/tw2gui/iconset.png); width: 16px; height: 16px; display: inline-block; background-position: -32px 80px; cursor: pointer; margin: 2px 4px 2px 0px" title="' + TW_Calc.getTranslation(169) + '"></div>')
                        .click(function () {
                            TW_Calc.Wardrobe.OwnCalc.showConfig($(this).data("index"))
                        }))
                    .append(name.length ? name : TW_Calc.Wardrobe.undefined);

                if (Bag.loaded) {

                    var items = TW_Calc.Wardrobe.OwnCalc.getBestItems(set[index]);

                    for (var i = 0; i < items.length; i++) {
                        if (Number(items[i])) {
                            var item = new tw2widget.InventoryItem(ItemManager.get(Number(items[i])));
                            groupFrame.appendToContentPane($(item.getMainDiv())
                                .attr('item_id', items[i]).click(function () {
                                    TW_Calc.Wardrobe.wear(Number($(this).attr('item_id')));
                                }));
                        }
                    }

                } else {
                    Bag.loadItems();
                }

                groupFrame.appendToContentPane(new west.gui.Button().setCaption(TW_Calc.getTranslation(207)).click(function () {
                    TW_Calc.Wardrobe.wear(items);
                }.bind(this)).getMainDiv());

                var groupFrameDiv = groupFrame.getMainDiv()

                $(".tw2gui_groupframe_background", groupFrameDiv).css("background", "url('/images/interface/wood_texture_dark.jpg')");
                $(".tw2gui_groupframe_content_pane", groupFrameDiv).css("height", "180px");

                $(content).html(groupFrameDiv);

                TW_Calc.Wardrobe.fadeWearItems();

            } else {

                $(content).html('<div style="margin: 15px; text-align: center; font-weight: bold">' + TW_Calc.getTranslation(208) + '</div>');

            }

        };

        TW_Calc.Wardrobe.OwnCalc.showConfig = function (index) {

            var data = TW_Calc.Wardrobe.getObject("OwnCalc")[index];

            new west.gui.Dialog((!data.name.length ? 'Unnamed' : data.name))
                .setId('TW_Calc_WardrobeOwnCalcDialog')
                .addButton(TW_Calc.getTranslation(162), function () {})
                .show();

            var skillsFrame = $('<div style="width: 432px; margin-left: auto; margin-right: auto; text-align: center;"></div>');
            var skills = CharacterSkills.allSkillKeys;

            for (var k = 0; k < skills.length; k++) {

                $(skillsFrame).append(CharacterSkills.getSkill(skills[k]).getSkillPMBox("TW_Calc_Wardrobe_OwnCalc_" + skills[k], {}, {
                    id: "TW_Calc_Wardrobe_OwnCalc_" + skills[k] + "_id",
                    min_value: 0,
                    start_value: data[skills[k]],
                    max_value: data[skills[k]],
                    extra_points: 0,
                    callbackPlus: function () {},
                    callbackMinus: function () {}
                }));

            }

            $("#TW_Calc_WardrobeOwnCalcDialog>.tw2gui_dialog_content").append(new west.gui.Groupframe()
                .appendToContentPane(skillsFrame).getMainDiv());

            $('#TW_Calc_WardrobeOwnCalcDialog').css('top', (($('body').height() - $('#TW_Calc_WardrobeOwnCalcDialog').height()) / 2));

        };

        TW_Calc.Wardrobe.OwnCalc.addDialog = function () {

            new west.gui.Dialog(TW_Calc.getTranslation(172))
                .setId('TW_Calc_WardrobeOwnCalcDialog')
                .addButton(TW_Calc.getTranslation(36), TW_Calc.Wardrobe.OwnCalc.add)
                .addButton(TW_Calc.getTranslation(92), function () {})
                .show();

            var logicPlusMinus = function (event) {

                var butObj = $(".tw2gui_plusminus#" + event.data.obj.id + ">.displayValue");
                var value = Number($(butObj).html());

                if ($(event.currentTarget).hasClass('butPlus')) {
                    $(butObj).html(value + 1);
                } else if ($(event.currentTarget).hasClass('butMinus')) {
                    $(butObj).html(Math.max(value - 1, 0));
                }

            };

            var skillsFrame = $('<div style="width: 432px; margin-left: auto; margin-right: auto; text-align: center;"></div>');
            var skills = CharacterSkills.allSkillKeys;

            for (var k = 0; k < skills.length; k++) {

                $(skillsFrame).append(CharacterSkills.getSkill(skills[k]).getSkillPMBox("TW_Calc_Wardrobe_OwnCalc_" + skills[k], {}, {
                    id: "TW_Calc_WardrobeOwnCalc" + skills[k] + "Id",
                    min_value: 0,
                    start_value: 0,
                    max_value: 1000,
                    extra_points: 0,
                    callbackPlus: logicPlusMinus,
                    callbackMinus: logicPlusMinus
                }));

            }

            $("#TW_Calc_WardrobeOwnCalcDialog>.tw2gui_dialog_content").append(new west.gui.Groupframe()
                .appendToContentPane(skillsFrame)
                .getMainDiv()).append($('<div></div>').append(new west.gui.Textfield()
                .setWidth(440)
                .setPlaceholder(TW_Calc.getTranslation(157))
                .setId("TW_Calc_WardrobeOwnCalcName")
                .getMainDiv()));


            $('#TW_Calc_WardrobeOwnCalcDialog').css('top', (($('body').height() - $('#TW_Calc_WardrobeOwnCalcDialog').height()) / 2));

        };

        TW_Calc.Wardrobe.OwnCalc.add = function () {

            var skills = CharacterSkills.allSkillKeys;
            var data = {};

            for (var i = 0; i < skills.length; i++) {
                data[skills[i]] = Number($("#TW_Calc_WardrobeOwnCalc" + skills[i] + "Id>.displayValue").text());
            }

            data.name = $('#TW_Calc_WardrobeOwnCalcName').val();

            var wardrobe = TW_Calc.Wardrobe.getObject("OwnCalc");
            wardrobe.push(data);
            TW_Calc.Wardrobe.saveObject("OwnCalc", wardrobe);

            new UserMessage(TW_Calc.getTranslation(165), UserMessage.TYPE_SUCCESS).show();

            TW_Calc.Wardrobe.OwnCalc.launch(wardrobe.length - 1);

        };


        /**
         * TombolaExporter
         * @type {{}}
         */
        TW_Calc.TombolaExporter = {};
        try {

            var cYear = '_' + new Date().getFullYear();

            TW_Calc.TombolaExporter.init = function () {

                //west.wof.WofManager.wofs
                west.wof.WheelofFortune.prototype.process = function (action, data, callback, context, window) {

                    data = data || {};
                    data.action = action;
                    data.wofid = this.id;
                    var that = this;

                    Ajax.remoteCall("wheeloffortune", "gamble", data, function (resp) {

                        if (resp.error) {
                            return new UserMessage(resp.msg, UserMessage.TYPE_ERROR).show();
                        }

                        TW_Calc.TombolaExporter.createData(resp, data);

                        EventHandler.signal("inventory_changed");
                        typeof callback === "function" && callback.call(context || this, resp);

                    }, window);

                };

                west.wof.WofDotdCardgameWindow.__proto__.requestData = function (action, data, callback) {

                    data = data || {};

                    var that = this,
                        wnd = this.getWindow(),
                        model = this.getModel(),
                        view = this.getView();
                    wnd.showLoader();
                    data.action = action;
                    data.wofid = model.getWofId();

                    Ajax.remoteCall('wheeloffortune', 'gamble', data, function (response) {

                        if (response.error) {
                            return new UserMessage(response.msg, UserMessage.TYPE_ERROR).show();
                        }

                        TW_Calc.TombolaExporter.createData(response, data);

                        if (undefined !== response.nuggets) {
                            Character.setNuggets(parseInt(response.nuggets));
                        }

                        wnd.hideLoader();
                        model.setGameStateData(response.game).setStagesData(response.stages);
                        view.updateView();
                        that.notifyNewItem(action);

                        if (callback) {
                            callback(response);
                        }

                    }, wnd);

                    return this;

                };

            };

            TW_Calc.TombolaExporter.eventTypes = {
                Easter: {},
                Independence: {},
                Hearts: {},
                Octoberfest: {},
                DayOfDead: {}
            };

            TW_Calc.TombolaExporter.getCurrentEvent = function () {
                for (var event in this.eventTypes) {
                    if (this.eventTypes.hasOwnProperty(event) && Game.sesData.hasOwnProperty(event)) {
                        return event;
                    }
                }
                return false;
            };

            TW_Calc.TombolaExporter.createData = function (a, z) {

                if (TW_Calc.ShowLogs) {
                    console.log(z, a);
                }

                try {

                    $.extend(a, z);

                    var prize,
                        category,
                        tombolaId = a.wofid,
                        eventType = this.getCurrentEvent(),
                        level = -1;

                    console.log(tombolaId, eventType);
                    // Travelling circus
                    if (tombolaId === 1) {

                        prize = a.picked[0];
                        category = a.picked[1];

                        TW_Calc.TombolaExporter.exportData(prize, tombolaId, category);
                        TW_Calc.TombolaExporter.saveData(prize, tombolaId, category);

                    } else if (eventType === 'Hearts') {

                        prize = a.prize.itemId;
                        category = 0;
                        var isFree = (west.wof.WofManager.wofs.heartswof.mode.free ? 1 : 0);

                        TW_Calc.TombolaExporter.Spins(tombolaId, isFree, true);

                        TW_Calc.TombolaExporter.exportData(prize, tombolaId, category);
                        TW_Calc.TombolaExporter.saveData(prize, tombolaId, category);

                    } else if (eventType === 'DayOfDead') {

                        category = a.stages.length - 1;
                        prize = a.stages[category].rewards.item;

                        if (a.action === 'gamble') {
                            level = Number(a.card) === 1 ? 'Left_card' : 'Right_card'; //a.card: left card is 1 and right card is 0
                            localStorage.setItem('TWCalc_Tombola_currentStage', category);
                            this.exportData(prize, tombolaId, category, level);
                        } else if (a.action === 'bribe' || a.action === 'change') {
                            level = 'After_bribe';
                            this.Spins(tombolaId, 1, false);
                            this.exportData(prize, tombolaId, category, level);
                        } else if (a.action === 'end') {
                            this.Spins(tombolaId, 0, true);
                            category = localStorage.getItem('TWCalc_Tombola_currentStage');
                            this.saveData(prize, tombolaId, category);
                        }

                    } else if (eventType === 'Easter' || eventType === 'Independence' || eventType === 'Octoberfest') {

                        //easter & independence: a.outcome & a.enhance
                        //octoberfest: a.failed, normal: without outcome, after bribe: a.outcome ...& a.enhance
                        if (a && !a.failed && (a.itemId || a.outcome)) {

                            var c = a.itemEnhance || a.outcome && a.outcome.itemEnhance;
                            prize = a.itemId || a.outcome && a.outcome.itemId;
                            level = a.construction_id || a.enhance;

                            category = 0;

                            switch (c) {
                                case 25:
                                    category = 1;
                                    break;
                                case 150:
                                    category = 2;
                                    break;
                                case 800:
                                    category = 3;
                                    break;
                            }

                            this.exportData(prize, tombolaId, category, level);
                            this.saveData(prize, tombolaId, category);
                        }

                    }

                } catch (e) {
                    new TW_Calc.Error(e, 'TombolaExporter.createData').show();
                }

            };

            TW_Calc.TombolaExporter.Spins = function (id, s, t) {

                var a = {
                    total: 0,
                    free: 0
                };

                var l_key = "TWCalc_Tombola_Spins_" + id + cYear;

                if (localStorage.getItem(l_key) !== null)
                    a = JSON.parse(localStorage.getItem(l_key));

                if (t === true) {
                    a.total++;
                }

                a.free += s;

                localStorage.setItem(l_key, JSON.stringify(a));

            };

            TW_Calc.TombolaExporter.exportData = function (prize, id, category, level) {

                if (TW_Calc.ShowLogs) console.log('Level: ', level);

                if (typeof(level) !== "undefined" && level !== -1) {

                    $.get(TW_Calc.website + '/service/tombola-export', {
                        tombolaId: id,
                        prize: prize,
                        category: category,
                        level: level
                    }, function (data) {}, "jsonp");

                } else {

                    $.get(TW_Calc.website + '/service/tombola-export', {
                        tombolaId: id,
                        prize: prize,
                        category: category
                    }, function (data) {}, "jsonp");

                }

            };

            TW_Calc.TombolaExporter.createObjectFromStorage = function (tombolaId) {

                var d = localStorage.getItem('TWCalc_Tombola_' + tombolaId);
                return (d ? JSON.parse(d) : null);

            };

            TW_Calc.TombolaExporter.saveData = function (prize, tombolaId, category) {

                try {

                    if ([1, 11, 12, 13, 14, 15, 16, 17, 18, 19].indexOf(tombolaId) !== -1) {

                        var okey = tombolaId + (tombolaId == 1 ? '' : cYear);
                        var o = TW_Calc.TombolaExporter.createObjectFromStorage(okey) || [{}, {}, {}, {}, {}];

                        if (o[category].hasOwnProperty(prize))
                            o[category][prize] ++;
                        else
                            o[category][prize] = 1;

                        localStorage.setItem('TWCalc_Tombola_' + okey, JSON.stringify(o));
                    }

                } catch (e) {
                    new TW_Calc.Error(e, 'TombolaExporter.saveData').show();
                }

            };

            TW_Calc.TombolaExporter.convertOldTombola = function (prize, tombolaId, category) {

                try {

                    if (!localStorage.getItem('TWCalc_TombolaConverted')) {
                        localStorage.setItem('TWCalc_TombolaConverted', 'done');
                        var tomb = {
                            1: '',
                            15: '_2016',
                            11: '_2016'
                        };
                        for (var u in tomb) {
                            var obj = TW_Calc.TombolaExporter.createObjectFromStorage(u);
                            if (obj) {
                                localStorage.removeItem('TWCalc_Tombola_' + u);
                                var newObj = [{}, {}, {}, {}, {}];
                                for (var i = 0; i < obj.length; i++) {
                                    var oi = obj[i];
                                    for (var k = 0; k < oi.length; k++)
                                        if (oi[k].id)
                                            newObj[i][oi[k].id] = oi[k].count;
                                }
                                localStorage.setItem('TWCalc_Tombola_' + u + tomb[u], JSON.stringify(newObj));
                            }
                        }
                    }

                } catch (e) {
                    new TW_Calc.Error(e, 'TombolaExporter.convertOldTombola').show();
                }

            }();

            TW_Calc.TombolaExporter.Tab = {};

            TW_Calc.TombolaExporter.Tab.load = function (wofId, year) {

                try {

                    var tombolaId = wofId + (year ? '_' + year : '');
                    var obj = TW_Calc.TombolaExporter.createObjectFromStorage(tombolaId);

                    if (obj && TW_Calc.TombolaExporter.wof.hasOwnProperty(wofId)) {

                        var valentines = [12, 18];
                        var valentine = valentines.indexOf(wofId) > -1;
                        var dotds = [11, 17];
                        var dotd = dotds.indexOf(wofId) > -1;


                        $('#tab_tombola>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane').append('<h2 style="margin-left: 0; padding-top: 0;"><span id="TW_Calc_TombolaExporter_Tab_Groupframe_' + tombolaId + '"><a target="_blank" href="' + TW_Calc.website + '/tombola/' + tombolaId + '">' + TW_Calc.TombolaExporter.wof[wofId] + (year ? ' ' + year : '') + '</a>:</span></h2>');

                        var getBackground = function (bg, i) {
                            var html = '<div id="TW_Calc_TombolaExporter_Tab_' + tombolaId + '_Items_' + i + '" style="background:' + bg + '; float: left; width: 636px; margin: 5px; padding: 10px; border: 3px solid #a49e97; border-radius: 8px; box-shadow: 0 0 20px inset; opacity: 0.9; left: 0; right: 0; top: 0; bottom: 0;"></div>';
                            $('#tab_tombola>.tw2gui_scrollpane>.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane').append(html);
                        };

                        var getItem = function (ID, COUNT, i) {
                            var oldId = Number(ID);
                            var id = oldId < 3700 ? oldId * 1000 : oldId;
                            var itemObj = ItemManager.get(id);
                            var count = Number(COUNT);
                            var item = new tw2widget.InventoryItem(itemObj).setCount(count).setShowcompare(false).getMainDiv();
                            $('#TW_Calc_TombolaExporter_Tab_' + tombolaId + '_Items_' + i).append(item);
                        };

                        if (valentine) {
                            var a = JSON.parse(localStorage.getItem("TWCalc_Tombola_Spins_" + tombolaId)) || {
                                total: 0,
                                free: 0
                            };
                            $('#TW_Calc_TombolaExporter_Tab_Groupframe_' + tombolaId).append('<span style="font-size: 15px;text-align: right;margin-left: 35px;">' + a.free + ' free spins of ' + a.total + ' total spins</span></h2>');
                        } else if (dotd) {
                            var a2 = JSON.parse(localStorage.getItem("TWCalc_Tombola_Spins_" + tombolaId)) || {
                                total: 0,
                                free: 0
                            };
                            $('#TW_Calc_TombolaExporter_Tab_Groupframe_' + tombolaId).append('<span style="font-size: 15px;text-align: right;margin-left: 35px;">' + a2.free + ' times bribed at ' + a2.total + ' total games</span></h2>');
                        }
                        for (var i = 0; i < obj.length; i++) {

                            var oi = obj[i];

                            if (Object.keys(oi).length > 0) {
                                var bg = '';
                                switch (i) {
                                    case 0:
                                        bg = 'rgba(128, 128, 128, 0.4)';
                                        break;
                                    case 1:
                                        bg = 'rgba(0, 128, 0, 0.4)';
                                        break;
                                    case 2:
                                        bg = 'rgba(0, 0, 255, 0.4)';
                                        break;
                                    case 3:
                                        bg = 'rgba(255, 215, 0, 0.4)';
                                        break;
                                    case 4:
                                        bg = 'rgba(255, 0, 0, 0.4)';
                                        break;
                                }

                                getBackground(bg, i);

                                for (var l in oi) {
                                    getItem(l, oi[l], i);
                                }

                            }
                        }

                    }

                } catch (e) {
                    new TW_Calc.Error(e, 'TombolaExporter.Tab.load').show();
                }
            };

            TW_Calc.TombolaExporter.Tab.launch = function () {

                try {

                    this.Scrollpane = new west.gui.Scrollpane();

                    $('.tw2gui_scrollpane_clipper>.tw2gui_scrollpane_clipper_contentpane', this.Scrollpane.getMainDiv()).css('float', 'left');

                    $(this.Scrollpane.getMainDiv()).css({
                        "height": "360px",
                        "top": "10px",
                        "left": "5px",
                        "width": "688px"
                    });

                    $('#tab_tombola').html(this.Scrollpane.getMainDiv());


                    for (var key in localStorage) {
                        if (localStorage.hasOwnProperty(key)) {
                            var match = key.match(/TWCalc_Tombola_(\d+)(_(\d+))?/);
                            console.log(match);
                            if (match) {
                                this.load(Number(match[1]), match[3] || '');
                            }
                        }
                    }

                } catch (e) {
                    new TW_Calc.Error(e, 'TombolaExporter.Tab.launch').show();
                }

            };

        } catch (e) {
            new TW_Calc.Error(e, 'TW_Calc.TombolaExporter').show();
        }

        /**
         * Chests
         * @type {{}}
         */
        TW_Calc.Chests = {};

        TW_Calc.Chests.send = function (chestId, resObj) {

            try {
                if (TW_Calc.ShowLogs) console.log({
                    chest: chestId,
                    result: resObj.msg.effects
                });

                for (var i = 0; i < resObj.msg.effects.length; i += 1) {
                    var res = resObj.msg.effects[i];
                    if (res.type == 'lottery' || res.type == 'content') {
                        var cont = {};
                        res.items.each(function (e) {
                            cont[e.item_id] = e.count;
                        });

                        $.get(TW_Calc.website + '/service/chest-export', {
                            chest: chestId,
                            count: 1,
                            content: cont,
                            version: Game.version
                        }, function (data) {}, "jsonp");
                    }
                }
            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.Chests.send').show();
            }

        };

        TW_Calc.Chests.init = function () {

            try {
                var toolkit = ItemUse.doItOrigin ? 'doItOrigin' : 'doIt',
                str = ItemUse[toolkit].toString(),
                pos = str.indexOf('EventHandler.signal(\'item_used\''),
                inject = str.substr(0, pos) + 'TW_Calc.Chests.send(itemId,res);' + str.substr(pos);

                eval('ItemUse.' + toolkit + ' = ' + inject);

            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.Chests.init').show();
            }

        };

        /**
         * DuelBar
         * @type {{}}
         */
        TW_Calc.DuelBar = {};

        TW_Calc.DuelBar.init = function () {
          
            TW_Calc.DuelBar.int = setInterval(TW_Calc.DuelBar.update, 1000);

        };

        TW_Calc.DuelBar.loadedData = [];

        TW_Calc.DuelBar.selector = '#Westcalc_DuelBar';

        TW_Calc.DuelBar.MainDiv = '';

        TW_Calc.NearestJob.DuelBarEnabled = (Number(TW_Calc.Settings.get("duelBar", 1)) === 2) || (Number(TW_Calc.Settings.get("topBar", "duelBar")) === 1);

        TW_Calc.DuelBar.loadPlayerData = function () {

            if (TW_Calc.ShowLogs) console.log("LOADING PLAYER DATA...");

            TW_Calc.DuelBar.loadedData = [];

            $.getJSON("/game.php?window=duel&action=search_op&h=" + Player.h, complete = function (xhr) {

                var u = xhr.oplist.pclist;

                for (var i = 0; i < u.length; i++) {
                    TW_Calc.DuelBar.loadedData.push(u[i]);
                }

                if (TW_Calc.DuelBar.loadedData.length !== 0) {

                    if (TW_Calc.DuelBar.loadedData.length <= 4) {

                        $.post("/game.php?window=duel&action=search_op&h=" + Player.h, {
                            page: 1
                        }, complete = function (xhr) {

                            var u = xhr.oplist.pclist;

                            for (var i = 0; i < u.length; i++) {

                                var player = u[i];

                                TW_Calc.DuelBar.loadedData.push(player);

                            }

                            TW_Calc.DuelBar.InsertContent();

                        }, "json");

                    } else if (TW_Calc.DuelBar.loadedData.length !== 0) {

                        TW_Calc.DuelBar.InsertContent();

                    }

                } else {

                    if (Number(TW_Calc.Settings.get("topBar", 1)) !== 2)
                        if (!$("#WESTCALC_TOP_BAR>#Westcalc_DuelBar").html().length) $("#WESTCALC_TOP_BAR").remove();

                }

            });

        };

        TW_Calc.DuelBar.InsertContent = function () {

            if (TW_Calc.ShowLogs) console.log("INSERING DUEL DATA...");

            TW_Calc.DuelBar.loadedData.sort(function (a, b) {

                var way_time_1 = Map.calcWayTime(Character.position, {
                    x: a.character_x,
                    y: a.character_y
                });
                var way_time_2 = Map.calcWayTime(Character.position, {
                    x: b.character_x,
                    y: b.character_y
                });

                return way_time_1 - way_time_2;

            });

            if (TW_Calc.ShowLogs) console.log(TW_Calc.DuelBar.loadedData);


            $(TW_Calc.DuelBar.selector).empty();

            for (var i = 0; i < TW_Calc.DuelBar.loadedData.length; i++) {

                var p = TW_Calc.DuelBar.loadedData[i];

                var way_time = Map.calcWayTime(Character.position, {
                    x: p.character_x,
                    y: p.character_y
                });

                var title = 'Duel - ' + p.player_name + ' - ' + way_time.formatDuration();

                var ava = $('<div style="display:inline-block;margin-right:5px;cursor:pointer;position:relative;float:left;" id="TWCalc_Quick_duel_' + p.player_id + '" player_id="' + p.player_id + '">' + p.avatar + '<div style="color:#F8C57C;top:5px;position:absolute;text-align:center;width:100%;font-weight:bold;text-shadow: 1px 1px 1px black;font-size:11px;">' + p.duellevel + '</div><img onclick="SaloonWindow.startDuel(' + p.player_id + ')" title="' + title + '" style="position:absolute;bottom:-22px;left:11px;width:50px;" src="/images/window/duels/charclass_' + p.class + '.png"><div class="open_profile" title="' + p.player_name + '" onclick="PlayerProfileWindow.open(' + p.player_id + ')" style="z-index:3;width:20px;height:20px;display:none;cursor:pointer;position:absolute;left:-10px;top:20px;background-image:url(/images/map/icons/instant-work-1.png);"></div><!--<div class="open_profile" title="Loading..." style="z-index:3;width:20px;height:20px;display:none;cursor:pointer;position:absolute;right:-10px;top:20px;background-image:url(/images/map/icons/instant-work-1.png);o-transform:scaleX(-1);-webkit-transform:scaleX(-1);transform:scaleX(-1);filter:FlipH;-ms-filter: &quot;FlipH";&quot;></div>!--></div>').hover(function () {

                    $(this).find(".open_profile").show();

                }, function () {

                    $(this).find(".open_profile").hide();

                });

                $(TW_Calc.DuelBar.selector).append(ava);

                $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find('.avatar_pic').attr("title", title).click(function () {
                    var id = $(this).parent().attr("player_id");
                    SaloonWindow.startDuel(id);
                });

                $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find('img').click(function () {
                    var id = $(this).parent().attr("player_id");
                    SaloonWindow.startDuel(id);
                });

                function flipBackgroundHover() {

                    $(this).css({
                        "background-image": "url(/images/map/icons/instant-work-1_hover.png)",
                        "margin-top": "-2px",
                        "margin-left": "-2px",
                        "width": "24px",
                        "height": "25px"
                    });

                }

                function flipBackgroundHoverOut() {

                    $(this).css({
                        "background-image": "url(/images/map/icons/instant-work-1.png)",
                        "margin-top": "0px",
                        "margin-left": "0px",
                        "width": "20px",
                        "height": "20px"
                    });

                }

                $(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_' + p.player_id).find(".open_profile").hover(flipBackgroundHover, flipBackgroundHoverOut);
                //$(TW_Calc.DuelBar.selector).find('#TWCalc_Quick_duel_'+p.player_id).find(".player_info").hover(flipBackgroundHover, flipBackgroundHoverOut);

            }

            $('#Westcalc_DuelBar').append('<div class="tw2gui_window_buttons_close" style="position:absolute;right:-15px;top:0px;" title="' + TW_Calc.getTranslation(189) + ' DuelBar"></div>').find(".tw2gui_window_buttons_close").click(function () {
                TW_Calc.window.open("settings", function() {
                    $('#duelBar_text').css({
                        "background-color": "yellow",
                        "font-weight": "bold"
                    });
                });

            });

        };

        TW_Calc.DuelBar.lastPos = {
            x: -1,
            y: -1
        };

        TW_Calc.DuelBar.update = function () {

            if ((TW_Calc.DuelBar.lastPos.x !== Character.position.x) && (TW_Calc.DuelBar.lastPos.y !== Character.position.y)) {
              
                try {
                    TW_Calc.DuelBar.loadPlayerData();
                } catch (e) {
                    new TW_Calc.Error(e, 'TW_Calc.DuelBar.update').show();
                }

                TW_Calc.DuelBar.lastPos = {
                    x: Character.position.x,
                    y: Character.position.y
                };

                if (TW_Calc.ShowLogs) console.log("DUEL BAR UPDATED");

            }

        };

        TW_Calc.Interface = {};

        TW_Calc.Interface.init = function () {

            try {

                var topBar = Number(TW_Calc.Settings.get("topBar", 1));
                var duelBar = Number(TW_Calc.Settings.get("duelBar", 1));

                if (topBar === 1 || topBar === 5) {
                    TW_Calc.NearestJob.MainDiv = '#WESTCALC_BOTTOM_BAR';
                } else if (topBar === 2) {
                    TW_Calc.NearestJob.MainDiv = '#WESTCALC_TOP_BAR';
                }

                if (duelBar === 2) {
                    TW_Calc.DuelBar.MainDiv = '#WESTCALC_BOTTOM_BAR';
                } else if (duelBar === 1) {
                    TW_Calc.DuelBar.MainDiv = '#WESTCALC_TOP_BAR';
                }

                if (duelBar === 1 || topBar === 2) {
                    $("#user-interface").append('<div id="WESTCALC_TOP_BAR" class="bottom" style="text-align: center; left: 50%; margin-top: 10px; max-width: 620px; position: absolute; top: 44px; z-index: 2; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); -o-transform: translateX(-50%); transform: translateX(-50%);"></div>');
                    $('#user-interface>.first-purchase').remove();
                }

                if (duelBar === 2 || topBar === 1 || topBar === 5) {
                    $("#ui_bottombar").append('<div id="WESTCALC_BOTTOM_BAR" style="left: 50%; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); -o-transform: translateX(-50%); transform: translateX(-50%); text-align: center; max-width: 620px; position: absolute; bottom:' + TW_Calc.NearestJob.posY + 'px;"></div>');
                    TW_Calc.NearestJob.bottomBarMover();
                }

                if (duelBar !== 3) {
                    $(TW_Calc.DuelBar.MainDiv).append('<div id="Westcalc_DuelBar" class="bottom" style="text-align: center; width: 620px; height: 88px;"></div>');
                }

                if (topBar !== 3) {
                    $(TW_Calc.NearestJob.MainDiv).append('<div id="Westcalc_JobBar" class="bottom" style="width: 510px; height: 61px; margin-left: auto; margin-right: auto; text-align: left"></div>');
                }


                TW_Calc.DuelBar.init();
                TW_Calc.NearestJob.init();

                if (TW_Calc.Settings.get("WestCalc", true) || topBar === 3 || TW_Calc.Settings.get("Wardrobe", true)) {

                    var rightMenuButtonLogicIn = function () {
                        $(this).css('background-position', '-25px 0');
                    };

                    var rightMenuButtonLogicOut = function () {
                        $(this).css('background-position', '0 0');
                    };

                    var container = $('<div class="ui_menucontainer" id="TWCalcButtons"></div>');

                    if (TW_Calc.Settings.get("WestCalc", true)) {
                        $(container).append($('<div class="menulink" title="The-West Calc" ' + 'onclick="TW_Calc.window.open();" ' + 'style="background-position: 0 0; background-image: url(' + TW_Calc.icon + ');"' + '"></div>')
                            .hover(rightMenuButtonLogicIn, rightMenuButtonLogicOut));
                    }

                    if (topBar === 3) {
                        $(container).append($('<div class="menulink" title="' + TW_Calc.getTranslation(152) + '" ' + 'style="background-position: 0 0; background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDAQcHBw0MDRgQEBgUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCAAaADIDAREAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAQYC/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAB4jHZ5CYVM7ZcjmjS4Os9dJKYoq6aGNkdNLXLBhG4g8vVSdz4aTtU86ySdon5LeOn/8QAIRABAAICAAYDAAAAAAAAAAAAAwIEAAEFEBESEzMjMTL/2gAIAQEAAQUCZHko0eKJGcrpKm/kGmqRY2Ofdkpb2lYSonfuQsYja09cY61dtafPMGBYIbKW0Wctj44sUbTW5om51endDLfuPC91v9w++X//xAAeEQACAwABBQAAAAAAAAAAAAAAEQECIQMQUWFxwf/aAAgBAwEBPwGWOTfZsjRpvYgmBIengrRfRkSMcIwZNjDkKFSxXr//xAAdEQACAgMBAQEAAAAAAAAAAAAAAQIRECExEgNR/9oACAECAQE/AUka/ConCrOYaPWy7EtFjlZ5ZJCiVsp0UVj58JYjwef/xAAxEAAABAMEBwcFAAAAAAAAAAAAAQIRITEyAxIiQTNDUWFxkdE0QoGCscHwBBMUI+H/2gAIAQEABj8CVFkkbcgSrIjjTSQxqU6JpOHoFJyTDf4h7NHDIXV30mnKI79F+o585b5hRJJ8Z+oL6m2P980om39+Sn9y1w2u3dwFo0cRMfgQ/ItsBno07ePT3karUygbJV1Gk1L/ADoFrMnN1TTm8wZqxPz9xEjJTMDWuMSNrpxgLz3tge6pyyyFWquU5dQuiRTqkNX5hZ9nmE0U5+27YO55gns8xq9IP//EACUQAAIBBAICAgIDAAAAAAAAAAERIQAxQVFh8HGRgbEQocHR4f/aAAgBAQABPyFIuAgAEI05Zm82eBR3ITAA5F4BRnHFQSmuvMWJjIxLpkh6EuBAOV8FQxTkCGkTHiz1GaSuWYh9H97pNdb6+6k9rMudhvQpSo0EAjxEhljzdSAAVuaIWCZ5Uryy6PmQO7s1Ys5blZjpxL70GhsKcDQDPsi0hL/Ad/nS22sEYKBPPHsKhjkGRtLmhF3DJoH072VTXQ3YCqcB2Wr0hUBEEgNIWjGhjZjRgeTZLeNqViuX1jf0rsH1+qu7fNf1+/xzrmulm9Tsd+Kzx/v8H//aAAwDAQACAAMAAAAQMMKaHs76QLgMIs//xAAfEQADAAICAgMAAAAAAAAAAAAAAREhMRBBIFFhcfH/2gAIAQMBAT8QZyXZrUG8DwfIJsX9BH9lEKDzgcNCVQU74EcWBOmJkxCRPY2NDZHXwf/EAB4RAQACAgEFAAAAAAAAAAAAAAEAESExEEFhcYHx/9oACAECAQE/EARPpOlUEFy22oke5RB4GorAJiPmNW5TwZnajpArdQQm5YSpWLdMt4tI6d8g4//EACMQAQEAAwABAwQDAAAAAAAAAAERACExQRBxkVFhofDB0eH/2gAIAQEAAT8QnOx0YGngwAXlaEKGiOlMKZ/N0mkUsUAfFRlEG61uAUeKTrp09MDGIlGpxpj9I9CrUpHcvAgeRWDaU2wUdprgGQih+YKpMCdzCIu4iOlwM7MV2gBAlKq8MBqcJsHhpXXzlT/o394EOGVInRcZExJEYMraD8ZFh60KUbcSEpxxhqJEYFk64cmtiCIMAqdEhAeSfL0Awn+k+nc8vv8AfzHw782F+h9MH5fu7g/kft9D/9k=)"' + '></div>')
                            .hover(rightMenuButtonLogicIn, rightMenuButtonLogicOut)
                            .click(TW_Calc.NearestJob.rightMenuButtonLogic));
                        TW_Calc.NearestJob.getMap();
                    }

                    if (TW_Calc.Settings.get("Wardrobe", true)) {
                        $(container).append($('<div class="menulink" id="' + TW_Calc.Wardrobe.id + '" title="' + TW_Calc.getTranslation(170) + '" ' + 'style="background-position:0 0; background-image: url(data:image/png;data:;base64,' + TW_Calc.Wardrobe.img + ')"' + '></div>')
                            .hover(rightMenuButtonLogicIn, rightMenuButtonLogicOut)
                            .click(TW_Calc.Wardrobe.window.launch));
                    }

                    $(container).append('<div class="menucontainer_bottom"></div>');


                    $('#ui_menubar').append(container);

                }

                if (TW_Calc.Settings.get("MenuCraftButton", true) && Character.professionId !== null) {
                    $('.button.crafting.background').off('click').click(function() {
                        TW_Calc.Craft.window.open(Character.professionId);
                    });
                }

            } catch (e) {
                new TW_Calc.Error(e, 'TW_Calc.Interface.init').show();
            }

        };

        TW_Calc.initWestCalcLanguageAndInject();


    }).toString() + ", 100); ";

    document.getElementsByTagName('body')[0].appendChild(TWCalcjs);

};

if ((location.href.indexOf(".the-west.") != -1 || location.href.indexOf(".tw.innogames.") != -1) && location.href.indexOf("game.php") != -1)
    TWCalc_inject();
