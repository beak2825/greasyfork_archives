// ==UserScript==
// @name         Panel check Gmail
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Упрощение работы по чеку и фильтрации писем gmail
// @author       Bladhard
// @match        https://mail.google.com/mail/u/*
// @icon         https://cdn.icon-icons.com/icons2/652/PNG/128/gmail_icon-icons.com_59877.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445541/Panel%20check%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/445541/Panel%20check%20Gmail.meta.js
// ==/UserScript==

window.onload = function () {
    setTimeout(() => {
        var fil = 'aeD',
            imp = 'aD',
            del = 'aD'
        var acc_number = document.location.href.split('/')[5]

        function formHref() {
            try {
                var mail_cont = document.getElementsByClassName('go')[0].previousElementSibling.attributes[0].textContent
                var fromhref = 'https://mail.google.com/mail/u/' + acc_number + '/#create-filter/from=',
                    end_href = '&sizeoperator=s_sl&sizeunit=s_smb',
                    r_mail = mail_cont.replace('@', '%40'),
                    good_href = fromhref + r_mail + end_href
                return good_href
            } catch (err) {
                return document.location.href
            }
        }

        function simulateClick_Reload(element) {
            console.log('Обновление страницы')
            setTimeout(() => {
                trigger(element, 'mousedown')
                setTimeout(() => {
                    trigger(element, 'click')
                    setTimeout(() => {
                        trigger(element, 'mouseup')
                    }, 100)
                }, 100)
            }, 100)

            function trigger(elem, event) {
                elem.dispatchEvent(new MouseEvent(event))
            }
        }
        function click_reload() {
            var array = document.querySelectorAll('div.D.E.G-atb')
            var numCallbackRuns = 0
            array.forEach(element => {
                // console.log(element)
                var ok_butt = element.getAttribute('gh')
                if (ok_butt == 'tm') {
                    // console.log(numCallbackRuns)
                    var reload_b = document.querySelectorAll('div.T-I.J-J5-Ji.nu.T-I-ax7.L3')[numCallbackRuns]
                    simulateClick_Reload(reload_b)
                    numCallbackRuns = -1
                }
                numCallbackRuns++
            })
        }
        function set(clas, number) {
            document.getElementsByClassName(clas)[number].click()
        }

        // function link_target(obj, site) {
        //     var el = document.getElementById(obj)
        //     el.onclick = function () {
        //         platform(site)
        //     }
        // }

        function link_target(obj, site) {
            var el = document.getElementById(obj)
            el.onclick = function (e) {
                e.preventDefault() // Cancel the native event
                platform(site)
            }
        }

        let steam = 'https://mail.google.com/mail/u/' + acc_number + '/#create-filter/from=noreply%40steampowered.com&sizeoperator=s_sl&sizeunit=s_smb',
            epic =
                'https://mail.google.com/mail/u/' +
                acc_number +
                '/#create-filter/has=%7B+from%3Aepic-support%40epicgames.com+from%3Ahelp%40epicgames.com+from%3Ahelp%40acct.epicgames.com+from%3Afortnite%40epicgames.com+from%3Afortnite%40mail.epicgames.com+from%3Ahelp%40accts.epicgames.com+from%3Asupport%40epicgames.mail.helpshift.com+from%3Ahelp%40mail.epicgames.com+from%3Acreator-support%40epicgames.com+from%3Astore%40mail.epicgames.com+from%3Anoreply%40epiclootboxsettlement.com+from%3Ahelp%40support.epicgames.com+%7D&sizeoperator=s_sl&sizeunit=s_smb'

        // var obj1 = document.getElementsByClassName('ZF-Av')[1]
        // var vision = window.getComputedStyle(obj1, null).getPropertyValue('visibility')

        function platform(form) {
            var url = document.location.href
            console.log(url, form)
            if (url == form) {
                try {
                    var obj1 = document.getElementsByClassName('ZF-Av')[0]
                    var vision = window.getComputedStyle(obj1, null).getPropertyValue('visibility')
                } catch (error) {
                    var obj1 = document.getElementsByClassName('gb_rf')[0]
                    var vision = window.getComputedStyle(obj1, null).getPropertyValue('display')
                }

                if (vision == 'hidden' || vision != 'none') {
                    console.log('Открываем none')
                    document.getElementsByClassName('gb_rf')[0].click()
                    setTimeout(() => {
                        try {
                            document.getElementsByClassName('acM')[1].click()
                            setTimeout(() => {
                                set(fil, 0)
                                set(imp, 8)
                                set(del, 5)
                                document.getElementsByClassName('Zx')[1].click()
                            }, 600)
                            setTimeout(() => {
                                click_reload()
                            }, 1000)
                        } catch (err) {
                            console.log('Ошибка')
                            document.getElementsByClassName('acM')[1].click()
                            setTimeout(() => {
                                set(fil, 0)
                                set(imp, 8)
                                set(del, 5)
                                document.getElementsByClassName('Zx')[1].click()
                            }, 600)
                        }
                    }, 600)
                } else {
                    url = document.location.href
                    console.log('Окно открыто')
                    document.getElementsByClassName('acM')[1].click()
                    setTimeout(() => {
                        set(fil, 0)
                        set(imp, 8)
                        set(del, 5)
                        document.getElementsByClassName('Zx')[1].click()
                    }, 600)
                    setTimeout(() => {
                        click_reload()
                    }, 1000)
                }
            } else {
                document.location.href = form
                setTimeout(() => {
                    url = document.location.href
                }, 1000)
                console.log('Перешли по ссылке')
            }
        }

        // STEAM
        document.getElementsByClassName('gb_De')[0].insertAdjacentHTML(
            'afterend',
            `<style>
        .game {
            display: flex;
            justify-content: center;
            position: relative;
            margin: 0 3px;
            cursor: pointer;
            width: 40px;
            height: 40px;
        }
        .game:active {
            border-radius: 30px;
            background-color: #fff;
            border: .5px #f00 solid;
        }

    </style>
    <a href="#" data-tooltip="Steam" id="steam">
    <div class="game">
    <?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="100px" y="100px"
	 viewBox="0 0 1024 1024" style="enable-background:new 0 0 1024 1024;" xml:space="preserve">
<style type="text/css">
	.st3{fill:#FFFFFF;
         width: 20px;
         height: 20px;}
</style>
<g id="Guides">
</g>
<g id="Icon">
	<circle class="st0" cx="512" cy="512" r="512"/>
	<g>
		<path class="st3" d="M511.6,256c-134.4,0-244.6,103.7-255.1,235.4l137.2,56.7c11.6-7.9,25.7-12.6,40.8-12.6c1.3,0,2.7,0.1,4,0.1
			l61-88.4v-1.3c0-53.2,43.3-96.5,96.5-96.5c53.2,0,96.5,43.3,96.5,96.6s-43.3,96.5-96.5,96.5h-2.2l-87,62.1c0,1.1,0.1,2.2,0.1,3.4
			c0,40-32.3,72.4-72.3,72.4c-34.9,0-64.3-25-71.1-58.2l-98.2-40.7C295.7,689.2,394.4,768,511.6,768c141.4,0,256-114.6,256-256
			S652.9,256,511.6,256z M416.9,644.5l-31.4-13c5.6,11.6,15.2,21.3,28,26.7c27.7,11.5,59.6-1.6,71.1-29.3
			c5.6-13.4,5.6-28.1,0.1-41.6c-5.5-13.4-16-23.9-29.4-29.5c-13.3-5.5-27.5-5.3-40.1-0.6l32.5,13.4c20.4,8.5,30.1,32,21.5,52.4
			C460.8,643.3,437.3,653,416.9,644.5L416.9,644.5z M660.4,446c0-35.5-28.9-64.3-64.3-64.3c-35.5,0-64.3,28.9-64.3,64.3
			c0,35.5,28.8,64.3,64.3,64.3C631.5,510.3,660.4,481.5,660.4,446z M547.9,445.9c0-26.7,21.6-48.3,48.3-48.3
			c26.6,0,48.3,21.6,48.3,48.3c0,26.7-21.7,48.3-48.3,48.3C569.5,494.2,547.9,472.6,547.9,445.9z"/>
	</g>
</g>
</svg>

    </div></a>`
        )
        link_target('steam', steam)

        // EPIC
        document.getElementsByClassName('gb_De')[0].insertAdjacentHTML(
            'afterend',
            `<style>
        .game {
            display: flex;
            justify-content: center;
            position: relative;
            margin: 0 3px;
            cursor: pointer;
            width: 40px;
            height: 40px;
        }
        .game:active {
            border-radius: 30px;
            background-color: #fff;
            border: .5px #f00 solid;
        }

    </style>
    <a href="#" data-tooltip="Epic Games" id="epic">
    <div class="game">

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="100px" y="100px"
	 viewBox="0 0 1024 1024" style="enable-background:new 0 0 1024 1024;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#4e4e4e;}
	.st1{fill:#FFFFFF;}
</style>
<g id="Guides">
</g>
<g id="Icon">
	<circle class="st0" cx="512" cy="512" r="512"/>
	<g>
		<path class="st1" d="M331.4,276c-29.3,0-40.1,10.8-40.1,40.1v353.4c0,3.3,0.1,6.4,0.4,9.2c0.7,6.4,0.8,12.7,6.8,19.7
			c0.6,0.8,6.6,5.2,6.6,5.2c3.2,1.6,5.5,2.7,9.2,4.3l177.8,74.5c9.2,4.2,13.1,5.9,19.8,5.7h0.1c6.8,0.2,10.6-1.5,19.8-5.7
			l177.8-74.5c3.7-1.5,5.9-2.6,9.2-4.3c0,0,6.1-4.5,6.6-5.2c6-7,6-13.2,6.8-19.7c0.3-2.8,0.4-5.9,0.4-9.2V316
			c0-29.3-10.8-40-40.1-40H331.4z M616.4,342.3h14.5c24.2,0,36,11.8,36,36.2v40.1h-29.3v-38.5c0-7.8-3.6-11.5-11.2-11.5h-5
			c-7.8,0-11.5,3.6-11.5,11.5v124c0,7.8,3.6,11.4,11.5,11.4h5.5c7.5,0,11.1-3.6,11.1-11.4v-44.4h29.4v45.7c0,24.4-12,36.4-36.3,36.4
			h-14.8c-24.3,0-36.3-12.1-36.3-36.4V378.8C580.1,354.4,592.1,342.3,616.4,342.3z M356.4,343.9h66.4v27.2h-36.6v55.6h35.2v27.2
			h-35.2v59.2h37.1v27.2h-66.9L356.4,343.9z M437.8,343.9h46.9c24.3,0,36.3,12.1,36.3,36.5v52.2c0,24.4-12,36.5-36.3,36.5h-16.9
			v71.2h-29.9L437.8,343.9z M534.4,343.9h29.8v196.4h-29.8V343.9z M467.6,370.4v72.3H480c7.5,0,11.1-3.6,11.1-11.5v-49.3
			c0-7.9-3.6-11.5-11.1-11.5H467.6z M385.4,587h4.4l1,0.1h1.6l0.8,0.3h0.8l0.8,0.2l0.8,0.2l0.7,0.1l0.7,0.2l0.7,0.1l0.8,0.3l0.6,0.1
			l0.6,0.3l0.8,0.2l0.6,0.3l0.8,0.3l0.7,0.3l0.6,0.4l0.8,0.3l0.6,0.4l0.8,0.4l0.6,0.4l0.7,0.4l0.6,0.5l0.6,0.4l0.6,0.5l0.7,0.5
			l0.6,0.6l0.6,0.5l-0.5,0.6l-0.6,0.6l-0.5,0.6l-0.6,0.6l-0.5,0.6l-0.5,0.6l-0.6,0.6l-0.5,0.6l-0.5,0.6l-0.6,0.6l-0.5,0.6l-0.6,0.6
			l-0.5,0.6l-0.5,0.6l-0.6,0.6l-0.5,0.7l-0.6,0.6l-0.5,0.6l-0.6-0.5l-0.6-0.6l-0.6-0.4l-0.7-0.5l-0.6-0.4l-0.7-0.4l-0.6-0.4
			l-0.7-0.4l-0.6-0.3l-0.6-0.3l-0.6-0.2l-0.7-0.3l-0.8-0.2l-0.6-0.2l-0.8-0.2l-0.8-0.2l-0.8-0.1h-0.9l-1-0.2h-1.6l-0.8,0.1h-0.8
			l-0.8,0.2l-0.7,0.2l-0.7,0.2l-0.8,0.2l-0.6,0.3l-0.8,0.3l-0.6,0.4l-0.6,0.4l-0.6,0.4l-0.6,0.5l-0.6,0.5l-0.6,0.5l-0.5,0.6
			l-0.6,0.6l-0.4,0.6l-0.4,0.6l-0.5,0.6l-0.3,0.7l-0.4,0.6l-0.4,0.7l-0.2,0.7l-0.3,0.7l-0.2,0.8l-0.1,0.8l-0.2,0.7l-0.2,0.9v0.8
			l-0.1,0.8v1.9l0.1,0.8l0.1,0.7l0.1,0.8l0.2,0.8l0.2,0.6l0.1,0.8l0.2,0.6l0.3,0.6l0.3,0.8l0.4,0.8l0.3,0.6l0.4,0.6l0.5,0.7l0.5,0.6
			l0.4,0.6l0.6,0.6l0.5,0.6l0.6,0.5l0.6,0.5l0.6,0.5l0.7,0.4l0.6,0.4l0.7,0.3l0.8,0.3l0.6,0.3l0.8,0.2l0.8,0.3l0.8,0.1l0.8,0.2
			l0.8,0.1l1,0.1h2.6l1-0.1h0.8l0.8-0.3l0.8-0.1l0.8-0.3l0.7-0.1l0.7-0.3l0.6-0.3l0.8-0.3l0.5-0.3l0.6-0.4v-7.4h-11.8v-11.9h26.6
			v26.6l-0.6,0.5l-0.6,0.5l-0.6,0.4l-0.6,0.5l-0.6,0.4l-0.6,0.5l-0.6,0.4l-0.7,0.4l-0.8,0.4l-0.7,0.4l-0.6,0.4l-0.8,0.3l-0.6,0.4
			l-0.8,0.3l-0.8,0.3l-0.8,0.3l-0.7,0.3l-0.7,0.2l-0.7,0.3l-0.8,0.2l-0.7,0.2l-0.8,0.3l-0.7,0.1l-0.8,0.2l-0.8,0.2l-0.8,0.1
			l-0.8,0.1l-0.8,0.1l-0.8,0.1l-1,0.1l-0.8,0.1l-0.9,0.1h-4.2L384,648h-0.8l-0.8-0.1h-0.8l-0.8-0.3l-0.8-0.1l-0.8-0.2l-0.8-0.1
			l-0.6-0.3l-0.8-0.1l-0.8-0.3l-0.7-0.3l-0.7-0.2l-0.8-0.3l-0.7-0.3l-0.8-0.3l-0.6-0.3l-0.8-0.4l-0.6-0.4l-0.8-0.4l-0.6-0.4
			l-0.6-0.4l-0.6-0.5l-0.6-0.5l-0.7-0.5l-0.5-0.5l-0.6-0.5l-0.6-0.6l-0.6-0.5l-0.6-0.6L363,638l-0.6-0.6l-0.5-0.6l-0.5-0.6l-0.4-0.6
			l-0.5-0.6l-0.4-0.6l-0.4-0.6l-0.4-0.7l-0.4-0.6l-0.3-0.7l-0.3-0.7l-0.3-0.7l-0.3-0.7l-0.2-0.6l-0.3-0.7l-0.2-0.7l-0.2-0.7
			l-0.2-0.8l-0.2-0.7l-0.2-0.8l-0.1-0.7l-0.2-0.8l-0.1-0.7l-0.1-0.8l-0.1-0.8l-0.1-0.8v-4.4l0.2-0.8v-0.9l0.2-0.8v-0.8l0.3-0.8
			l0.3-0.8l0.1-0.8l0.2-0.7l0.3-0.8l0.2-0.7l0.3-0.8l0.3-0.7l0.3-0.7l0.3-0.7l0.3-0.7l0.4-0.7l0.4-0.6l0.4-0.6l0.4-0.6l0.4-0.6
			l0.5-0.7l0.5-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.6-0.5l0.6-0.6l0.6-0.5l0.6-0.5l0.6-0.4l0.6-0.5l0.6-0.4
			l0.7-0.4l0.7-0.4l0.8-0.4l0.6-0.4l0.8-0.3l0.7-0.3l0.8-0.4l0.6-0.2l0.8-0.3l0.7-0.3l0.7-0.2l0.7-0.2l0.8-0.2l0.7-0.2l0.8-0.2h0.8
			l0.8-0.2h0.8l0.8-0.2h0.8L385.4,587z M641.2,587.2h4.4l1,0.2h1.6l0.8,0.2h1l0.8,0.3l0.7,0.1l0.8,0.2l0.8,0.1l0.7,0.2l0.8,0.2
			l0.8,0.3l0.6,0.1l0.8,0.3l0.8,0.3l0.6,0.3l0.8,0.3l0.8,0.3l0.7,0.4l0.6,0.3l0.8,0.4l0.7,0.4l0.6,0.4l0.7,0.5l0.6,0.4l0.6,0.5
			l0.6,0.5l0.6,0.5l-0.5,0.6l-0.4,0.7l-0.5,0.6l-0.5,0.6l-0.5,0.7l-0.4,0.6l-0.5,0.6l-0.5,0.7l-0.4,0.6l-0.5,0.6l-0.5,0.6l-0.5,0.7
			l-0.4,0.7l-0.5,0.6l-0.6,0.6l-0.4,0.6l-0.5,0.7l-0.6-0.5l-0.7-0.4l-0.6-0.4l-0.6-0.5l-0.7-0.3l-0.6-0.4l-0.8-0.3l-0.6-0.3
			l-0.8-0.3l-0.6-0.3l-0.6-0.2l-0.7-0.3l-0.8-0.2l-0.8-0.3l-0.8-0.2l-0.9-0.2l-0.8-0.1l-0.8-0.2l-0.8-0.1l-0.8-0.1l-0.7-0.1h-1.8
			l-0.9,0.1l-0.8,0.2l-0.8,0.1l-0.6,0.3l-0.6,0.3l-0.7,0.6l-0.5,0.7l-0.3,0.7v2l0.4,0.9l0.3,0.5l0.6,0.6l0.8,0.4l0.6,0.4l0.8,0.3
			l0.8,0.3l1,0.3l0.6,0.2l0.6,0.2l0.8,0.2l0.6,0.2l0.8,0.2l0.9,0.2l0.9,0.2l0.9,0.3l0.9,0.1l0.8,0.3l0.9,0.2l0.8,0.2l0.8,0.2
			l0.8,0.2l0.8,0.3l0.8,0.2l0.7,0.2l0.8,0.3l0.8,0.3l0.8,0.4l0.8,0.3l0.8,0.4l0.8,0.4l0.6,0.4l0.6,0.4l0.7,0.5l0.6,0.4l0.7,0.6
			l0.6,0.6l0.6,0.6l0.6,0.6l0.4,0.6l0.6,0.8l0.4,0.6l0.3,0.8l0.4,0.6l0.2,0.8l0.3,0.6l0.1,0.8l0.2,0.8l0.1,0.8l0.1,0.8l0.1,0.8v2
			l-0.1,0.9l-0.1,0.8l-0.1,0.9l-0.2,0.8l-0.2,0.8l-0.2,0.8l-0.2,0.8l-0.3,0.7l-0.3,0.6l-0.3,0.7l-0.4,0.6l-0.5,0.6l-0.4,0.6
			l-0.4,0.7l-0.6,0.6l-0.5,0.6l-0.6,0.5l-0.6,0.6l-0.6,0.5l-0.6,0.5l-0.6,0.4l-0.7,0.5l-0.8,0.4l-0.6,0.3l-0.8,0.4l-0.8,0.3
			l-0.8,0.3l-0.8,0.3l-0.8,0.2l-0.6,0.2l-0.8,0.2l-0.8,0.2l-0.6,0.1l-0.8,0.2H650l-0.8,0.1h-0.8l-0.8,0.2h-6l-0.8-0.1l-0.8-0.1
			l-0.9-0.1l-0.8-0.2l-0.8-0.1l-0.8-0.1l-0.8-0.2l-0.9-0.2l-0.8-0.2l-0.8-0.2l-0.8-0.2l-0.8-0.2l-0.8-0.3l-0.8-0.3l-0.7-0.2
			l-0.8-0.2l-0.8-0.3l-0.6-0.3l-0.8-0.3l-0.6-0.4l-0.8-0.3l-0.7-0.4l-0.6-0.4l-0.8-0.4l-0.6-0.4l-0.7-0.4l-0.6-0.5l-0.6-0.5
			l-0.6-0.5l-0.6-0.5l-0.6-0.5l-0.6-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.6-0.6
			l0.5-0.6l0.5-0.6l0.6-0.6l0.5-0.6l0.6-0.6l0.6-0.6l0.6,0.5l0.8,0.5l0.6,0.5l0.8,0.5l0.6,0.4l0.7,0.5l0.6,0.4l0.7,0.3l0.6,0.4
			l0.7,0.3l0.8,0.3l0.6,0.3l0.8,0.2l0.6,0.3l0.8,0.2l0.8,0.3l0.8,0.3l0.8,0.1l0.8,0.2l0.8,0.1h0.9l0.8,0.3h4.4l0.8-0.2l0.8-0.2
			l0.6-0.1l0.6-0.2l0.6-0.3l0.7-0.5l0.4-0.6l0.4-0.6l0.2-0.8v-1.9l-0.3-0.8l-0.5-0.6l-0.5-0.5l-0.7-0.5l-0.6-0.3l-0.8-0.3l-0.8-0.3
			l-1-0.4l-0.6-0.1l-0.6-0.2l-0.8-0.2l-0.6-0.2l-0.8-0.3l-0.8-0.1l-0.9-0.3l-0.8-0.1l-0.9-0.3l-0.8-0.1l-0.8-0.3l-0.8-0.1l-0.8-0.3
			l-0.8-0.2l-0.8-0.2l-0.7-0.3l-0.7-0.2l-0.7-0.3l-0.8-0.3l-0.9-0.3l-0.8-0.3l-0.8-0.3l-0.8-0.4l-0.8-0.4l-0.6-0.4l-0.8-0.4
			l-0.6-0.5l-0.7-0.4l-0.5-0.5l-0.6-0.6l-0.6-0.6l-0.5-0.6l-0.5-0.6l-0.4-0.6l-0.4-0.6l-0.4-0.7l-0.3-0.6l-0.3-0.6l-0.2-0.7
			l-0.2-0.6l-0.2-0.8l-0.1-0.7v-0.8l-0.2-0.8v-3.5l0.1-0.8l0.1-0.8l0.1-0.6l0.2-0.8l0.2-0.6l0.2-0.8l0.3-0.6l0.3-0.8l0.3-0.6
			l0.4-0.8l0.4-0.6l0.6-0.6l0.4-0.6l0.6-0.6l0.6-0.6l0.5-0.6l0.7-0.6l0.5-0.4l0.7-0.5l0.6-0.5l0.6-0.4l0.8-0.4l0.6-0.3l0.8-0.4
			l0.6-0.3l0.8-0.3l0.8-0.3l0.8-0.2l0.6-0.2l0.8-0.1l0.6-0.2l0.8-0.1l0.8-0.2l0.8-0.1l0.8-0.1l0.8-0.1L641.2,587.2z M444.1,587.8
			h15.1l0.3,0.7l0.3,0.7l0.3,0.7l0.2,0.8l0.3,0.7l0.3,0.7l0.3,0.7l0.3,0.7l0.2,0.7l0.4,0.8l0.3,0.7l0.3,0.7l0.2,0.7l0.3,0.7l0.4,0.7
			l0.3,0.8l0.3,0.7l0.2,0.7l0.3,0.7l0.4,0.7l0.2,0.7l0.3,0.8l0.2,0.8l0.3,0.6l0.4,0.8l0.3,0.6l0.3,0.8l0.3,0.8l0.2,0.6l0.4,0.8
			l0.3,0.6l0.3,0.8l0.2,0.6l0.3,0.8l0.4,0.8l0.3,0.7l0.2,0.7l0.2,0.7l0.3,0.7l0.4,0.7l0.3,0.8l0.3,0.7l0.2,0.7l0.3,0.7l0.3,0.7
			l0.3,0.7l0.3,0.8l0.3,0.7l0.3,0.7l0.4,0.7l0.3,0.7l0.3,0.7l0.2,0.8l0.3,0.7l0.4,0.7l0.3,0.7l0.2,0.7l0.3,0.7l0.3,0.8l0.4,0.8
			l0.2,0.6l0.3,0.8l0.2,0.6l0.3,0.8l0.4,0.8l0.3,0.6l0.2,0.8l0.3,0.6l0.2,0.8l0.4,0.6l0.3,0.8l0.2,0.8l0.3,0.6l0.3,0.8l0.4,0.6
			l0.3,0.8l0.2,0.8l0.3,0.6l0.3,0.8l0.4,0.6h-16.7l-0.4-0.7l-0.2-0.7l-0.3-0.7l-0.3-0.8l-0.2-0.7l-0.3-0.7l-0.3-0.7l-0.3-0.7
			l-0.3-0.7l-0.3-0.7l-0.2-0.7l-0.3-0.8l-0.3-0.7l-0.3-0.7l-0.3-0.7h-23.2l-0.3,0.8l-0.2,0.6l-0.3,0.8l-0.4,0.8l-0.2,0.6l-0.3,0.8
			l-0.3,0.6l-0.2,0.8l-0.3,0.6l-0.3,0.8l-0.3,0.6l-0.3,0.8l-0.3,0.8l-0.3,0.6l-0.2,0.8h-16.5l0.3-0.8l0.3-0.7l0.3-0.7l0.3-0.8
			l0.2-0.7l0.4-0.7l0.3-0.7l0.3-0.7l0.2-0.7l0.3-0.8l0.4-0.7l0.3-0.7l0.3-0.7l0.2-0.7l0.3-0.7l0.4-0.8l0.3-0.7l0.3-0.7l0.3-0.7
			l0.3-0.7l0.3-0.7l0.3-0.8l0.3-0.8l0.3-0.6l0.3-0.8l0.4-0.6l0.3-0.8l0.2-0.8l0.2-0.6l0.3-0.8l0.4-0.6l0.3-0.8l0.3-0.6l0.2-0.8
			l0.3-0.8l0.4-0.6l0.2-0.8l0.3-0.6l0.3-0.8l0.3-0.8l0.4-0.6l0.3-0.8l0.2-0.6l0.3-0.8l0.3-0.6l0.4-0.8l0.3-0.8l0.3-0.7l0.2-0.7
			l0.3-0.7l0.4-0.7l0.3-0.7l0.2-0.8l0.3-0.7l0.3-0.7l0.4-0.7l0.3-0.7l0.2-0.7l0.3-0.8l0.3-0.8l0.3-0.6l0.3-0.8l0.2-0.6l0.3-0.8
			l0.3-0.8l0.4-0.6l0.3-0.8l0.3-0.6l0.2-0.8l0.3-0.6l0.4-0.8l0.3-0.8l0.3-0.6l0.3-0.8l0.3-0.6l0.4-0.8l0.2-0.8l0.2-0.6l0.3-0.8
			L444.1,587.8z M490.9,588.2h16.5l0.5,0.6l0.4,0.7l0.5,0.6l0.4,0.7l0.4,0.6l0.4,0.7l0.4,0.6l0.5,0.7l0.4,0.6l0.4,0.6l0.4,0.7
			l0.4,0.6l0.6,0.7l0.3,0.6l0.4,0.7l0.5,0.6l0.5,0.6l0.3,0.7l0.5,0.6l0.4,0.7l0.3,0.6l0.6,0.7l0.4,0.6l0.4,0.7l0.4,0.6l0.4,0.6
			l0.5,0.7l0.4,0.6l0.4,0.7l0.4,0.6l0.4,0.7l0.5,0.6l0.4,0.7l0.4,0.6l0.5-0.6l0.3-0.8l0.5-0.6l0.5-0.8l0.4-0.6l0.3-0.8l0.6-0.6
			l0.4-0.8l0.3-0.6l0.5-0.6l0.5-0.8l0.4-0.6l0.4-0.8l0.4-0.6l0.5-0.8l0.4-0.6l0.4-0.8l0.4-0.6l0.4-0.6l0.5-0.8l0.4-0.6l0.4-0.8
			l0.5-0.6l0.4-0.8l0.4-0.6l0.5-0.6l0.4-0.8l0.5-0.6l0.4-0.8l0.4-0.6l0.4-0.8l0.5-0.6l0.4-0.8l0.4-0.6H553v59.5h-15.7v-35l-0.4,0.6
			l-0.5,0.8l-0.4,0.6l-0.5,0.6l-0.4,0.8l-0.5,0.6l-0.4,0.6l-0.5,0.8l-0.4,0.6l-0.4,0.6l-0.6,0.6l-0.4,0.8l-0.5,0.6l-0.4,0.6
			l-0.4,0.8l-0.5,0.6l-0.4,0.6l-0.5,0.8l-0.4,0.6l-0.5,0.6l-0.4,0.8l-0.4,0.6l-0.5,0.6l-0.4,0.8l-0.5,0.6l-0.5,0.6l-0.4,0.6
			l-0.4,0.8l-0.5,0.6l-0.5,0.6l-0.3,0.8l-0.6,0.6l-0.4,0.6l-0.5,0.8l-0.4,0.6h-0.3l-0.5-0.7l-0.4-0.6l-0.5-0.7l-0.4-0.6l-0.5-0.7
			l-0.4-0.6l-0.5-0.7l-0.4-0.6l-0.5-0.7l-0.4-0.6l-0.6-0.7l-0.3-0.6l-0.5-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.8l-0.5-0.6
			l-0.4-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.7l-0.5-0.6l-0.4-0.7
			l-0.6-0.6l-0.3-0.7l-0.5-0.6v35.1H491v-58.9L490.9,588.2z M564.9,588.2h46.9v13.4h-31.4v9.5h28.2v12.7h-28.2v10.2h31.8v13.5H565
			v-58.9L564.9,588.2z M451.4,606.4l-0.3,0.8l-0.3,0.6l-0.3,0.8l-0.3,0.8l-0.2,0.7l-0.3,0.7l-0.3,0.8l-0.3,0.8l-0.2,0.6l-0.3,0.8
			l-0.3,0.6l-0.3,0.8l-0.3,0.8l-0.3,0.6l-0.2,0.8l-0.3,0.6l-0.3,0.8L446,620l-0.2,0.6l-0.3,0.8l-0.3,0.8l-0.2,0.6l-0.3,0.8h13.7
			l-0.3-0.8l-0.3-0.7l-0.3-0.8l-0.3-0.7l-0.2-0.7l-0.3-0.7l-0.3-0.8l-0.3-0.7l-0.3-0.7l-0.3-0.7l-0.2-0.7l-0.3-0.8l-0.3-0.7
			l-0.3-0.7l-0.3-0.7l-0.2-0.7l-0.3-0.8l-0.3-0.8l-0.3-0.6l-0.3-0.8l-0.3-0.8l-0.2-0.7L451.4,606.4z M426.9,717.8h171l-87.3,28.8
			L426.9,717.8z"/>
	</g>
</g>
</svg>
    </div></a>`
        )
        link_target('epic', epic)

        // TRASH
        document.getElementsByClassName('gb_De')[0].insertAdjacentHTML(
            'afterend',
            `<style>
        .game {
            display: flex;
            justify-content: center;
            position: relative;
            margin: 0 3px;
            cursor: pointer;
            width: 40px;
            height: 40px;
        }
        .game:active {
            border-radius: 30px;
            background-color: #fff;
            border: .5px #f00 solid;
        }

    </style>
    <a href="#" data-tooltip="Корзина" id="trash">
    <div class="game">
<?xml version="1.0" ?>
<!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg enable-background="new 0 0 512 512" id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g>
<path d="M493.8,257.5c0,131.4-106.6,238-238,238s-238-106.6-238-238s106.6-238,238-238S493.8,126.1,493.8,257.5z"
fill="#ff3a3a"/></g><g><polygon fill="none" points="310.9,381.1 201.1,381.1 180.6,170.3 331.4,170.3 " stroke="#FFFFFF" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="16"/>
<line fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="16" x1="180.6" x2="160" y1="170.3" y2="170.3"/><line fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="16" x1="331.4" x2="352" y1="170.3" y2="170.3"/>
<rect fill="none" height="27.4" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="16" width="51.4" x="230.1" y="142.9"/></g></svg>
    </div></a>`
        )
        function trash() {
            var url_trash = 'https://mail.google.com/mail/u/' + acc_number + '/#trash'
            console.log(url_trash, '==', document.location.hash)
            var url_hash = document.location.hash
            try {
                if (url_hash == '#trash') {
                    console.log('Удаляем')
                    document.getElementsByClassName('x2')[0].click()
                    document.getElementsByClassName('J-at1-atl')[0].click()
                } else {
                    console.log('Корзина')
                    document.location.href = url_trash
                    setTimeout(() => {
                        click_reload()
                    }, 1000)
                }
            } catch (e) {
                console.log('Корзина пустая!')
            }
        }
        el = document.getElementById('trash')
        el.onclick = function (e) {
            e.preventDefault() // Cancel the native event
            trash()
        }

        // BLOCK
        document.getElementsByClassName('gb_De')[0].insertAdjacentHTML(
            'afterend',
            `<style>
        .game {
            display: flex;
            justify-content: center;
            position: relative;
            margin: 0 3px;
            cursor: pointer;
            width: 40px;
            height: 40px;
        }
        .game:active {
            border-radius: 30px;
            background-color: #fff;
            border: .5px #f00 solid;
        }

    </style>
    <a href="#" data-tooltip="Создать Фильтр" id="block">
    <div class="game">
<?xml version="1.0" ?>
<!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg enable-background="new 0 0 512 512" id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="Layer_1_1_">
<path d="M494,256c0,131.4-106.6,238-238,238S18,387.4,18,256S124.6,18,256,18S494,124.6,494,256z" fill="#ff3a3a"/></g>
<g id="Layer_2">
<g><line fill="none" stroke="#FFFFFF" stroke-miterlimit="10" stroke-width="20" x1="161.2" x2="350.8" y1="354.8" y2="165.2"/>
<circle cx="256" cy="260" fill="none" r="134.1" stroke="#FFFFFF" stroke-miterlimit="10" stroke-width="20"/></g></g></svg>
    </div></a>`
        )
        var el = document.getElementById('block')
        el.onclick = function () {
            const lnk = formHref()
            platform(lnk)
        }

        // =================================================================| MAIL BUTTON |===============================================

        var site = document.location.host
        var gmail = 'mail.google.com'

        function copypast(copy) {
            // copy
            var copyTextareaBtn = document.querySelector('.mail-textareacopybtn')
            copyTextareaBtn.addEventListener('click', function (event) {
                navigator.clipboard
                    .writeText(copy)
                    .then(() => {
                        // Получилось!
                    })
                    .catch(err => {
                        console.log('Something went wrong', err)
                    })
            })
        }

        // gmail
        if (site == gmail) {
            var e = document.getElementsByClassName('gb_A')[1].ariaLabel || document.getElementsByClassName('gb_A')[1].attributes['1'].nodeValue
            var i_1 = e.indexOf('(')
            var i_2 = e.indexOf(')')
            var gm = e.slice(i_1 + 1, i_2)

            document.getElementById('steam').insertAdjacentHTML(
                'afterEnd',
                `<style>
          a.mail-textareacopybtn {
              display: inline-block;
              cursor: pointer;
              border-radius: 3px;
              margin: 0px 8px;
              font-weight: 600;
              color: rgb(205,216,228);
              text-decoration: none;
              padding: .2em .8em;
              outline: none;
              border-right: 1px solid rgba(13,20,27,.5);
              border-top: 1px solid rgba(270,278,287,.01);
              background-color: rgb(64,73,82);
              background-image:
              radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
              radial-gradient(1px 60% at 100% 50%, rgba(255,255,255,.3), transparent),
              linear-gradient(rgb(64,73,82), rgb(72,81,90));
        }
          a.mail-textareacopybtn:hover {
             background-image:
             radial-gradient(1px 60% at 0% 50%, rgba(255,255,255,.3), transparent),
             radial-gradient(1px 60% at 100% 50%, rgba(255,255,255,.3), transparent),
             linear-gradient(rgb(51,60,67), rgb(58,65,72));
          }
          a.mail-textareacopybtn:focus {
            color: rgb(245,247,250);
            border-top: 1px solid rgb(67,111,136);
            background-image:
            linear-gradient(rgb(46,95,122), rgb(36,68,92));
          }
          a.mail-textareacopybtn:active {
            border-top: 1px solid rgb(49,87,107);
            background-image:
            linear-gradient(rgb(33,77,98), rgb(29,57,77));
          }
        }
    </style>
    <div class="qwe">
        <a data-tooltip="Копировать Email" class="mail-textareacopybtn">${gm}</a>
    </div>`
            )

            copypast(gm)
        }
    }, 500)
}
