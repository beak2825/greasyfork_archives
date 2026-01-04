// ==UserScript==
// @name         Old Facebook Home/Profile Page (2018)
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  Brings back the old home/profile pages from Facebook (2018)
// @author       Avolition
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @match        https://apps.facebook.com/*
// @exclude      https://www.instagram.com/*
// @icon         https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/social-facebook-icon.png
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524987/Old%20Facebook%20HomeProfile%20Page%20%282018%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524987/Old%20Facebook%20HomeProfile%20Page%20%282018%29.meta.js
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    function createThirdColumnWrapper() {

        let div = document.createElement('div');

        if (!document.querySelector('.ThirdColumnWrapper')
            && document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93')) {

            let style = document.createElement('style');
            div.className = "ThirdColumnWrapper";
            document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93').append(div);
            style.innerHTML = `
                .ThirdColumnWrapper {
                    height: 100%;
                    width: 308px;
                    display: block;
                    position: sticky;
                    top: -267px;
                    margin-left: 11px;
                    margin-top: 23px;

                }

            `;

            document.head.appendChild(style);

        }

    }

    function createSidebarWrapper() {

        if (!document.querySelector('.SidebarWrapper')) {

            if (document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76')) {

                let div = document.createElement('div');
                let style = document.createElement('style');
                div.className = "SidebarWrapper";
                document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1iplk16.x1mfogq2.xsfy40s.x1wi7962.xpi1e93').prepend(div);
                style.innerHTML = `
                    .SidebarWrapper {
                        position: sticky;
                        height: 100%;
                        background: transparent;
                        top: 43px;

                    }

                `;

                document.head.appendChild(style);

            }

            if (document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76')) {

                let sourceElement = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xedcshv.x1t2pt76');
                let targetElement = document.querySelector('.SidebarWrapper');

                targetElement.prepend(sourceElement);

            }

            setTimeout(() => {

                if (document.querySelector('.SidebarWrapper') && !document.querySelector('.SidebarButtonList')) {

                    let ul = document.createElement('ul');
                    let style = document.createElement('style');
                    ul.className = "SidebarButtonList";
                    document.querySelector('.x78zum5.xdt5ytf.x1iyjqo2.x1us19tq div ul:first-child li:first-child').append(ul);
                    style.innerHTML = `
                        .SidebarButtonList {
                            display: block;
                            position: relative;
                            height: auto;
                            width: auto;
                            margin-bottom: 10px;
                            margin-top: 10px;

                        }

                    `;

                    document.head.appendChild(style);

                }

                if (!document.querySelector('.SidebarExtraButton')) {

                    const numberOfElements = 3;
                    const className = 'SidebarExtraButton';

                    Array.from({ length: numberOfElements }).forEach(() => {

                        let li = document.createElement('div');
                        li.style.display = "flex";
                        li.style.position = "relative";
                        li.style.width = "186px";
                        li.style.height = "28px";
                        li.style.bottom = "0px";

                        li.classList.add(className);

                        document.querySelector('.SidebarButtonList')?.append(li);

                    });

                    setTimeout(() => {

                        $('.SidebarWrapper .x78zum5.xdt5ytf.x1iyjqo2.x1us19tq ul li:nth-child(2) > :first').remove().appendTo($('.SidebarButtonList .SidebarExtraButton').eq(1));

                        $('.SidebarWrapper .x78zum5.xdt5ytf.x1iyjqo2.x1us19tq ul li:nth-child(3) > :first').remove().appendTo($('.SidebarButtonList .SidebarExtraButton').eq(2));

                    }, 1500);

                    if (!document.querySelector('.NewsFeedButton') && document.querySelector('.SidebarExtraButton')) {

                        let a = document.createElement('a');
                        let style = document.createElement('style');
                        a.className = "NewsFeedButton";
                        a.href = "#";
                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child').append(a);
                        style.innerHTML = `
                            .NewsFeedButton {
                                display: list-item;
                                position: absolute;
                                width: 168px;
                                height: 26px;
                                background: #f6f7f9;
                                border: 1px solid #dddfe2;
                                border-radius: 2px;
                                padding: 0 8px;
                                margin-bottom: 1px;

                            }

                        `;

                        document.head.appendChild(style);

                        let img = document.createElement('img');
                        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAWCAYAAADAQbwGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTEwLTA1VDAzOjUwOjQ0KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wNFQwMjoxNDoxMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wNFQwMjoxNDoxMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyZGFlN2FmOS00YzFiLTczNDEtYmZlMC1lMTNmNjQzMzdhOWUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxNTE1NWNiYy01NjkwLWMzNDAtOWIyMC1hMjRlNmNkOGJkYjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphZDM4N2ViMC0wYmM1LWRkNDktYjJjNy0xNDY2MzYyNmRjYzYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFkMzg3ZWIwLTBiYzUtZGQ0OS1iMmM3LTE0NjYzNjI2ZGNjNiIgc3RFdnQ6d2hlbj0iMjAyMy0xMC0wNVQwMzo1MDo0NCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOTNmNGNjOS00NmEyLThlNDctOTQ0OC1lMTIxNmZhNmI4YjUiIHN0RXZ0OndoZW49IjIwMjMtMTAtMDVUMTc6MTI6MDErMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmRhZTdhZjktNGMxYi03MzQxLWJmZTAtZTEzZjY0MzM3YTllIiBzdEV2dDp3aGVuPSIyMDI1LTAyLTA0VDAyOjE0OjEzKzA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+q8veoQAAAJ5JREFUOBFj+P//PwM1MQPVDVywdK3/mUu3n928dfc/JRhkBsgshnWbd/z7TyUAMgvFwJa1//9XLoNgEJtiA2GGwTBMESFMkoFU9zIhV+E1kOqRQtNYJhYjpwaCkUIsHjWQhgZSPZaplg4/fPxEsWEgM8AGggpFYkoUYjC4gF3ZVML69dt3KZ/MQgZKMMgMkFlgzrSFa8sodR3IDJBZAMf+uhe7zMH/AAAAAElFTkSuQmCC";
                        img.style.backgroundPosition = "0px 0px";
                        img.style.width = "20px";
                        img.style.height = "20px";
                        img.style.marginTop = "2px";
                        img.style.marginRight = "5px";

                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child .NewsFeedButton').append(img);

                        let span = document.createElement('span');
                        let style2 = document.createElement('style');
                        span.innerText = "News Feed"
                        span.className = "NewsFeedText";
                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child .NewsFeedButton').append(span);
                        style2.innerHTML = `
                            .NewsFeedText {
                                display: inline-block;
                                position: relative;
                                bottom: 5px;
                                font-size: 13px;
                                font-weight: bold;
                                color: #1d2129;

                            }

                        `;

                        document.head.appendChild(style2);

                        let btn = document.createElement('a');
                        let style3 = document.createElement('style');
                        btn.className = "SortingOptions";
                        btn.href = "#"
                        document.querySelector('.SidebarButtonList .SidebarExtraButton:first-child .NewsFeedButton .NewsFeedText').append(btn);
                        style3.innerHTML = `
                            .SortingOptions {
                                display: inline-block;
                                position: relative;
                                width: 20px;
                                height: 20px;
                                border-radius: 2px;
                                float: right;
                                left: 57px;
                                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA4VDAzOjAxOjM5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wOFQwMzowNDowNCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wOFQwMzowNDowNCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MTUyZjNkMi05YzJiLWY4NGEtODBhNy0zMmI3MWRjZDdhZmIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MzZjNzcwOC04OGIwLWU0NGItODUyNy0wOTk0M2E3YzE5YTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YTM2YzZiZS1mN2ZmLWNhNGYtOGU0YS0wODk5MTc1YmU1N2QiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjhhMzZjNmJlLWY3ZmYtY2E0Zi04ZTRhLTA4OTkxNzViZTU3ZCIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wOFQwMzowMTozOSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTUyZjNkMi05YzJiLWY4NGEtODBhNy0zMmI3MWRjZDdhZmIiIHN0RXZ0OndoZW49IjIwMjUtMDItMDhUMDM6MDQ6MDQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ysBU0AAAAYUlEQVQ4EWP4//8/AzUxw6iBg9RAn8xCMA6acEEKhGF8UsVRDFywdK3/hClzboAwiA1TRIo43MCJU+cagiRmzl36D4RBbJgL0MVhLkIXB5lBOwOp7mWqR8poThk1cIANBAAv2DbJfKo7EgAAAABJRU5ErkJggg==);

                                                      }

                        `;

                        document.head.appendChild(style3);

                        let menu = document.createElement('ul');
                        let style4 = document.createElement('style');
                        menu.className = "SortingOptionsDropdown";
                        document.querySelector('.SidebarButtonList .NewsFeedButton .SortingOptions').append(menu);
                        style4.innerHTML = `
                            .SortingOptionsDropdown {
                                display: none;
                                position: absolute;
                                height: auto;
                                max-width: 99px;
                                width: auto;
                                padding: 5px 0px;
                                background-color: #fff;
                                border: 1px solid rgba(0, 0, 0, .15);
                                border-radius: 3px;
                                box-shadow: 0 3px 8px rgba(0, 0, 0, .3);
                                transform: translate(-74px, 20px);
                                z-index: 200;

                            }

                        `;

                        document.head.appendChild(style4);

                        const numberOfElements2 = 2;
                        const className2 = 'SortingMenuListItem';
                        const items = [
                            {text: "Top Stories", href: "https://www.facebook.com/?sk=h_nor"},
                            {text: "Most Recent", href: "https://www.facebook.com/?sk=h_chr"},

                        ];

                        Array.from({ length: numberOfElements2 }).forEach((_, index) => {

                            let text = document.createElement('a');
                            text.href = items[index].href;
                            text.style.display = "block";
                            text.style.position = "relative";
                            text.style.width = "76px";
                            text.style.height = "24px";
                            text.style.padding = "0px 12px";
                            text.style.cursor = "pointer";
                            text.style.textDecoration = "none";

                            text.classList.add(className2);

                            document.querySelector('.SortingOptionsDropdown').append(text);

                            const span = document.createElement('span');
                            span.textContent = items[index].text;
                            span.style.fontSize = "12px";
                            span.style.fontWeight = "normal"
                            span.style.lineHeight = "22px";
                            span.style.cursor = "pointer";
                            span.style.color = "rgb(29, 33, 41)";
                            span.style.textDecoration = "none";

                            span.className = "SortingOptionsText";

                            text.appendChild(span);

                        });

                        const SortingButton = document.querySelector('.SortingOptions');
                        const SortingMenu = document.querySelector('.SortingOptionsDropdown');

                        SortingButton.addEventListener('click', () => {
                            SortingMenu.style.display = "block";

                        });

                        document.addEventListener('click', e => {
                            if(!SortingMenu.contains(e.target) && e.target !== SortingButton) {
                                SortingMenu.style.display = "none";

                            }

                        });

                        if (!document.querySelector('.ExploreText')) {

                            let span3 = document.createElement('span');
                            let style = document.createElement('style');
                            span3.innerText = "Explore";
                            span3.className = "ExploreText";
                            document.querySelector('.x78zum5.xdt5ytf.x1iyjqo2.x1us19tq div ul li:first-child').append(span3);
                            style.innerHTML = `
                                .ExploreText {
                                    display: block;
                                    position: relative;
                                    margin: -2px 0 -1px;
                                    top: 5px;
                                    left: 5px;
                                    font-size: 13px;
                                    font-weight: bold;
                                    line-height: 17px;
                                    color: #616770;

                                }

                            `;

                            document.head.appendChild(style);

                        }

                    }

                }

            }, 1000);

            setTimeout(() => {

                document.querySelectorAll('.SidebarWrapper .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84').forEach((span) => {

                    span.textContent = span.textContent.replace(/Your shortcuts/g, "Shortcuts");

                });

            }, 1000);

        }

    }

    function centerBlueBar() {

        if (!document.querySelector('.TopBarContentWrapper')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "TopBarContentWrapper";
            document.querySelector('.xuk3077.x78zum5.x1iyjqo2.xl56j7k.xe11lzi.x1vy8oqc.x88anuq').prepend(div);
            style.innerHTML = `
                .TopBarContentWrapper {
                    display: flex;
                    justify-content: space-between;
                    position: absolute;
                    margin-right: 202.5px;
                    width: 1012px;
                    height: 43px;

                }

                            `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            let style2 = document.createElement('style');
            div2.className = "FirstTopBarContentContainer";
            document.querySelector('.TopBarContentWrapper').append(div2);
            style2.innerHTML = `
                .FirstTopBarContentContainer {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;

                }

                            `;

            document.head.appendChild(style2);

            let div3 = document.createElement('div');
            let style3 = document.createElement('style');
            div3.className = "SecondTopBarContentContainer";
            document.querySelector('.TopBarContentWrapper').append(div3);
            style3.innerHTML = `
                .SecondTopBarContentContainer {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;
                    margin-left: 8px;

                }

            `;

            document.head.appendChild(style3);

            let div4 = document.createElement('div');
            let style4 = document.createElement('style');
            div4.className = "TopBarButtonsWrapper";
            document.querySelector('.SecondTopBarContentContainer').append(div4);
            style4.innerHTML = `
                .TopBarButtonsWrapper {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;
                    margin-left: 8px;
                    margin-right: 8px;

                }

            `;

            document.head.appendChild(style4);

            let a = document.createElement('a');
            a.innerText = "Find Friends";
            a.style.display = "block";
            a.style.position = "relative";
            a.style.height = "27px";
            a.style.lineHeight = "27px";
            a.style.padding = "0px 10px 1px";
            a.style.fontSize = "12px";
            a.style.fontWeight = "bold";
            a.style.color = "#fff";
            a.style.cursor = "pointer";
            a.style.borderRadius = "2px";
            a.style.textDecoration = "none";
            a.style.top = "8px";

            a.className = "FindFriends";

            a.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "https://www.facebook.com/friends";;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            if (document.querySelector('.TopBarButtonsWrapper')) {

                document.querySelector('.TopBarButtonsWrapper').append(a);

            }

            a.addEventListener('mouseover', () => {
                a.style.background = 'rgba(0, 0, 0, .1)';

            });

            a.addEventListener('mouseout', () => {
                a.style.background = 'transparent';

            });

            let btn = document.createElement('div');
            btn.innerText = "Home";
            btn.style.display = "block";
            btn.style.position = "relative";
            btn.style.height = "27px";
            btn.style.lineHeight = "27px";
            btn.style.padding = "0px 10px 1px";
            btn.style.fontSize = "12px";
            btn.style.fontWeight = "bold";
            btn.style.color = "#fff";
            btn.style.cursor = "pointer";
            btn.style.borderRadius = "2px";
            btn.style.top = "8px";

            btn.className = "HomeButton";

            if (document.querySelector('.TopBarButtonsWrapper')) {

                document.querySelector('.TopBarButtonsWrapper').prepend(btn);

            }

            btn.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "/";;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(0, 0, 0, .1)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = 'transparent';

            });

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            svgElement.setAttribute("width", "22");
            svgElement.setAttribute("height", "22");
            svgElement.setAttribute("viewBox", "0 0 24 24");

            const NotificationIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

            NotificationIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTAyVDE4OjM1OjQ5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wMlQxODozODowMSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wMlQxODozODowMSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MmRiNmZiOS01ZTE0LWE3NDctYTMxMC0yYzdjM2I0ZGZmYjQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5N2IwM2EwMS1kYWJlLWYyNDItYTZlYi1lMzI2YTI4OTFmYjciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxYzE0Yjc4Zi0yYTdjLWJhNDEtYWE3NC04M2I3NmYzMzIyZjQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFjMTRiNzhmLTJhN2MtYmE0MS1hYTc0LTgzYjc2ZjMzMjJmNCIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wMlQxODozNTo0OSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MmRiNmZiOS01ZTE0LWE3NDctYTMxMC0yYzdjM2I0ZGZmYjQiIHN0RXZ0OndoZW49IjIwMjUtMDItMDJUMTg6Mzg6MDErMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Ts813AAABaklEQVQ4y62ULU8DQRCGG8JHgASSKhLI5QyiAnECgcHhCJKEBIOsrEPVVZ3pT6jC1lSQIDAnLsEgMJjKCgy2SROWd8h7yXY6u6zoJU/b3M4+3d3ZmZZzrrVu/j6uu70V8GTgEbyCGZjzu+L7zJpnSvf2D3YxYUjJBHTBC/gAzmMhcRIfleJpg3fwBgq+Kyg8BWdgrOQS3zalW9s7mxiswaf+dzyHMs7fl2CqxHUzviTlliVgbJ0VYy64bWcwXJIyKU1wZQmPz+82mCgXQObnvrTvDf7o7XOVvYiwoe9LKzV4RVHZnDOv0X/S2pfqbc2YkA54YoZdAt++dB4IkizfgIdEqYutVCOrHYBb3oAyZaVVwiqmKnGFscM6lP0QpXEjpMKeQ9nPIpfaXKknLs17qioqxkAJpR98mRWlaj8mHXnCIy/ern3VpULSe8ZNkrqU0U+tMz7xEpPWT9V55SzNivd4oTp/Hu386+YXOxwpzqc0wVYAAAAASUVORK5CYII=");
            NotificationIcon.setAttribute("width", "24");
            NotificationIcon.setAttribute("height", "24");
            NotificationIcon.setAttribute("opacity", "0.6");
            NotificationIcon.setAttribute("class", "OldNotificationIcon");

            svgElement.appendChild(NotificationIcon);

            const targetElement = document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(3) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');

            if (targetElement) {
                targetElement.parentNode.replaceChild(svgElement, targetElement);

            }

            const svgElement2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            svgElement2.setAttribute("width", "22");
            svgElement2.setAttribute("height", "22");
            svgElement2.setAttribute("viewBox", "0 0 24 24");

            const MessengerIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

            MessengerIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAYAAABCIB6VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTAyVDE4OjM1OjQ5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wM1QxMjowNDowOCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wM1QxMjowNDowOCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMmUxMDg4OC0yNDU4LWYxNDktODQ4Ni00MjUzNTk0YWI3YzgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmY2U2ZDE4YS1hOTFkLWZmNGUtYmNmZC00MTAyNmJkOTBjNDgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmNDgzNWRlZS0wYzU1LTNhNDItYjQ4Zi0wNDA1ZjI1MWNjNDEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY0ODM1ZGVlLTBjNTUtM2E0Mi1iNDhmLTA0MDVmMjUxY2M0MSIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wMlQxODozNTo0OSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMmUxMDg4OC0yNDU4LWYxNDktODQ4Ni00MjUzNTk0YWI3YzgiIHN0RXZ0OndoZW49IjIwMjUtMDItMDNUMTI6MDQ6MDgrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6IEt1aAAABFklEQVQ4y7WUvQ2DMBBGUbokUgq3YQXKFN4hC2QEynTswBLewCPQegA69/R07pwjOkuH8Q8BYulRgO/p4D5cWGuLf/C9POv3AlgMqAEJaMAgGu9Nz1ioNii+P14nKGiAEbAZpj3NVJMUY5fdCqFPR7ufiS/X2xkeqg1Sh5ocCzEssUPqEDMxrOoAqaOi4jazuY680Yj36aBbKu4T0oakxckNNsOBwdvfU3EsWm0kiiUyBGoMFZuQFJPSYFqYF0sdaWYm9jcJ/K60I4VClvl0morpYIZEoVqRdUHF/MC4cf8HkQdIZejPSw1kDb0bcOgQKjODSUnL5LGJEVsrNC6W2fMYO6eFHSZl30FPxJK+3i+kxHyLkIo/9GkqPm4aSYsAAAAASUVORK5CYII=");
            MessengerIcon.setAttribute("width", "24");
            MessengerIcon.setAttribute("height", "24");
            MessengerIcon.setAttribute("opacity", "0.6");
            MessengerIcon.setAttribute("class", "OldMessengerIcon");

            svgElement2.appendChild(MessengerIcon);

            const targetElement2 = document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(2) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');

            if (targetElement2) {
                targetElement2.parentNode.replaceChild(svgElement2, targetElement2);

            }

            const svgElement3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            svgElement3.setAttribute("width", "22");
            svgElement3.setAttribute("height", "22");
            svgElement3.setAttribute("viewBox", "0 0 24 24");

            const FriendsIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");

            FriendsIcon.setAttribute("href", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA0VDEzOjQwOjI0KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wNFQxMzo0MToyNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wNFQxMzo0MToyNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NWEyNDE2OS0xYzllLWE3NDAtOTBkNy1iNDM5ZWM4NjAyMDIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZThmZjA1Yy1mYmZjLTdmNGYtOWEzOS0yYWY4NDUzNmFlOGEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplNTJlNjhlMi02YTI1LWNhNGYtYTgxZi01NDkxOWUxNGJiM2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmU1MmU2OGUyLTZhMjUtY2E0Zi1hODFmLTU0OTE5ZTE0YmIzZSIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wNFQxMzo0MDoyNCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NWEyNDE2OS0xYzllLWE3NDAtOTBkNy1iNDM5ZWM4NjAyMDIiIHN0RXZ0OndoZW49IjIwMjUtMDItMDRUMTM6NDE6MjcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ZlREMAAABEUlEQVQ4y52UIRKDQAxFn93pYCo5AhfoBZD1nKG4alzPgOAGXAFZux6LZIYboHaoSWfozm4WKmJI8gg/P3B/PDkTwBVogAVYgTdQBGv9B+aSGaAGOmmsPXgHbF7M5pKZJFyAfnOTyG9AqcKBMtK4AlcFPiVlAfoIfAMqqbF/yQKMCryRfayRfJ6CWwVeKwsdjsjSKfBSaoqYZFE4kCtO2PaWBKaUJD9w0bOQ6Zdd4wi8vocS0f126IgCk3XedYYcZUNXGgJXXuPybZQv6wEXeIGTXPEDl4lqxYoOGHZevwGzUtuKfORKYSiG3X6cUvcCaE+Afc9r7hpDtjo0/YG7WFHOWYtJ4G0K3v8Bt4kfnQPaD7vkgI6AgwoKAAAAAElFTkSuQmCC");
            FriendsIcon.setAttribute("width", "24");
            FriendsIcon.setAttribute("height", "24");
            FriendsIcon.setAttribute("opacity", "0.6");
            FriendsIcon.setAttribute("class", "OldFriendsIcon");

            svgElement3.appendChild(FriendsIcon);

            const targetElement3 = document.querySelector('.x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw:nth-child(1) .x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1 .x14rh7hd.x1lliihq.x1tzjh5l.x1k90msu.x2h7rmj.x1qfuztq');

            if (targetElement3) {
                targetElement3.parentNode.replaceChild(svgElement3, targetElement3);

            }

            let div5 = document.createElement('div');
            let style5 = document.createElement('style');
            div5.className = "NewButtonsWrapper";
            document.querySelector('.SecondTopBarContentContainer').append(div5);
            style5.innerHTML = `
                .NewButtonsWrapper {
                    display: flex;
                    position: relative;
                    width: auto;
                    height: 43px;
                    margin-left: 8px;

                }

            `;

            document.head.appendChild(style5);

            let btn2 = document.createElement('a');
            btn2.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAJGSURBVEhLvdW7a1RBFIDxjUbFqCHGFBaLWgVEJFgI4gsUxRDSBotgkT8gKlb2NjZ2YmfjAyzEwlSCjSiCIIqKFjaaSERJyIP1Fd/ft5lzmVx2kzR64Me92b07d+bMOZPKv4qWdG0UO3AMh9N9J4wPuI+buIevWFZswSW8w3f8xG/8Sbz/gW9w4KNYh0VjFx7iE34hBmvGF4xjGJvRMJypg7q0mOEMRjCEfclJvEG82OsYTiPStSBcvjONQSdxHjvRgdXJJhzAKzjjGNxJDaIeK9PVzTkH37jCD4jbuAaXuh+n0Ie3eIJV2I02WAQbUcMLuNJ6nIEb5duDn3XBzbkDf6TrcObb4Uvy3zzAAIrZWVJxH7EGW2FeXfr6ZC98dgKmII8qLIBiMFNRHvgg3LRD8CVu6ntYw+6DVdCKPMz/tvnb+ZhFvqQyU/AYF2D1mAqrwA3OnzOdVlERSw3sLPM63QNLrFzrxcCxfNvUL5rFHHzGuIy7MJ/l9H3BlDfxhTMqb0QeluER9OMEbOFG54x7YLkV0Qt7P19WzkawNpdKmWmwtotYCw+U6KScK3mK40mzCYziLKygBWEj2GXlDaHMWkbaq9VO8bf1m5926ZnKRdg09YiWNj7iMzwbNiBy6LV1rlbrgq1ts9jOEa7gBq7gJep7lQ9sGiwha9ZDx963Xt1gO64bPfC7CJ+PQZ+hOPTzgQ1Pt9eYhi+IfJo3V+GB4zMem49wC1fhTItBjcX+Ndma7rC9770DG9apJeVmP4c1/r+iUvkLuOfRo1q+fpIAAAAASUVORK5CYII=)";
            btn2.style.display = "block";
            btn2.style.position = "relative";
            btn2.style.height = "22px";
            btn2.style.width = "22px";
            btn2.style.margin = "11px 0 9px";
            btn2.style.opacity = "0.6";

            btn2.className = "QuickHelp";

            document.querySelector('.NewButtonsWrapper').append(btn2);

            let btn3 = document.createElement('a');
            btn3.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAYAAADN5B7xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF62lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA1VDAxOjMxKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wNVQwMjowMDoxNiswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wNVQwMjowMDoxNiswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MGQyMzRkZi00OWYyLTFjNGYtYmRkYy1kODkxM2YwOWQ5YjEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0OGM3NWFiZS1lNmI0LWUzNDEtOGJlYi1iN2M3N2UzOGMxYjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNWY1NjBhNC0zMWFhLWNjNDgtYTE5MC01MzQ4OTg3NmRhOTYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1ZjU2MGE0LTMxYWEtY2M0OC1hMTkwLTUzNDg5ODc2ZGE5NiIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wNVQwMTozMSswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MGQyMzRkZi00OWYyLTFjNGYtYmRkYy1kODkxM2YwOWQ5YjEiIHN0RXZ0OndoZW49IjIwMjUtMDItMDVUMDI6MDA6MTYrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6869SqAAAAnElEQVQYlWP4//8/AykYQjAw3AbiL0D8EQf+CsRXkDX0APEPIP6PAz8G4gpkDdxAXAM1CV3xayCOAWJWZA0MjIxMvFw8ItOAzN8wxYxMzJ94BCRLmVnYWUFqUDSISKoxGNoliHLziiyCavglIqHaauKcwcLKzs2AocHcLYfBMbieQVJGVQXIXc/MzDhdVdtGyNwtj4GFjRNVAykYACU8lSBQkyRnAAAAAElFTkSuQmCC)";
            btn3.style.backgroundRepeat = "no-repeat";
            btn3.style.display = "block";
            btn3.style.position = "relative";
            btn3.style.height = "14px";
            btn3.style.width = "14px";
            btn3.style.margin = "18px 0px 9px 15px";
            btn3.style.opacity = "0.6";

            btn3.className = "SettingsButton";

            document.querySelector('.NewButtonsWrapper').append(btn3);

            let ul = document.createElement('ul');
            ul.style.display = "none";
            ul.style.position = "absolute";
            ul.style.height = "216px";
            ul.style.maxWidth = "200px";
            ul.style.width = "200px";
            ul.style.height = "auto";
            ul.style.padding = "5px 0px";
            ul.style.background = "#fff";
            ul.style.border = "1px solid rgba(100, 100, 100, .4)";
            ul.style.borderRadius = "0 0 2px 2px";
            ul.style.boxShadow = "0 3px 8px rgba(0, 0, 0, .25)";
            ul.style.transform = "translate(-148px, 46px)";

            ul.className = "SettingsDropdownMenu";

            document.querySelector('.NewButtonsWrapper').prepend(ul);

            let div6 = document.createElement('div')
            div6.style.display = "block";
            div6.style.position = "absolute";
            div6.style.width = "20px";
            div6.style.height = "11px";
            div6.style.top = "-11px";
            div6.style.right = "0px";
            div6.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA2VDIwOjMxOjQ5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wNlQyMDozMzowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wNlQyMDozMzowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMDEwZjZmYS1jNTllLTE0NDMtYTE3Ni1lOTY3YWJmZjZiNDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTAxMGY2ZmEtYzU5ZS0xNDQzLWExNzYtZTk2N2FiZmY2YjQ0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTAxMGY2ZmEtYzU5ZS0xNDQzLWExNzYtZTk2N2FiZmY2YjQ0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMDEwZjZmYS1jNTllLTE0NDMtYTE3Ni1lOTY3YWJmZjZiNDQiIHN0RXZ0OndoZW49IjIwMjUtMDItMDZUMjA6MzE6NDkrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6GRwLQAAAAXklEQVQokWPwySxkIISTk5NbQZgYtUQZdujQodMgTIyhRBn2HwqIMZRow4g1lCTDiDGUZMMIGUqWYfgMRTasghTD0AytQDEQKJBDjmFohuaADSTXZbhcykANw5ANBQBHxSyZWqRR1AAAAABJRU5ErkJggg==)";

            document.querySelector('.SettingsDropdownMenu').prepend(div6);

            const numberOfElements = 8;
            const className = 'SettingsMenuListItem';
            const items = [
                {text: "Create Page", href: "https://www.facebook.com/pages/create/"},
                {text: "Manage Pages", href: "https://www.facebook.com/pages/?category=your_pages&ref=bookmarks"},
                "separator",
                {text: "Create Group", href: "https://www.facebook.com/groups/create/"},
                {text: "Manage Groups", href: "http://www.facebook.com/bookmarks/groups?ref_type=logout_gear"},
                "separator",
                {text: "Activity Log", href: "https://www.facebook.com/you/allactivity/?category_key=ALL&entry_point=profile_shortcut&should_load_landing_page=1"},
                {text: "News Feed Preferences", href: "#"},
                {text: "Settings", href: "https://www.facebook.com/settings"},
                "separator",
                {text: "Log Out", href: "#"}
            ];

            const menu = document.querySelector('.SettingsDropdownMenu');

            items.forEach((item) => {

                if (item === "separator") {

                    let div = document.createElement('div');
                    div.style.display = "block";
                    div.style.height = "1px";
                    div.style.backgroundColor = "#e9ebee";
                    div.style.margin = "5px 7px 6px";
                    div.className = "Separator";
                    menu.appendChild(div);
                    return;

                }

                let a = document.createElement('a');
                a.href = item.href;
                a.style.display = "block";
                a.style.position = "relative";
                a.style.maxWidth = "200px";
                a.style.height = "24px";
                a.style.padding = "0px 22px";
                a.style.cursor = "pointer";
                a.style.textDecoration = "none";
                a.classList.add(className);

                const span = document.createElement('span');
                span.textContent = item.text;
                span.style.padding = "0 12px";
                span.style.lineHeight = "22px";
                span.style.cursor = "pointer";
                span.style.color = "rgb(29, 33, 41)";
                span.style.textDecoration = "none";
                span.className = "SettingsListItemText";

                a.appendChild(span);

                if (item.text === "Log Out") {
                    a.setAttribute("role", "button");

                }

                menu.appendChild(a);

            });

            const SettingsButton = document.querySelector('.SettingsButton');
            const SettingsMenu = document.querySelector('.SettingsDropdownMenu');

            SettingsButton.addEventListener('click', () => {
                if (SettingsMenu.style.display === "block") {
                    SettingsMenu.style.display = "none";
                    SettingsButton.setAttribute("aria-expanded", "false");

                } else {

                    SettingsMenu.style.display = "block";
                    SettingsButton.setAttribute("aria-expanded", "true");

                }

            });

            document.addEventListener('click', e => {
                if(!SettingsMenu.contains(e.target) && e.target !== SettingsButton) {
                    SettingsMenu.style.display = "none";
                    SettingsButton.setAttribute("aria-expanded", "false");

                }

            });

            $('[role="banner"] .x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1fmog5m.xu25z0z.x140muxe.xo1y3bh.x1q0g3np.x87ps6o.x1lku1pv.x1rg5ohu.x1a2a7pz.x1hc1fzr.x1k90msu.x6o7n8i.xbxq160:first').detach().appendTo('.FirstTopBarContentContainer:first');

            $('[role="banner"] .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x9f619.xdt5ytf.xh8yej3.x1lliihq.x1n2onr6.xhq5o37.x1qxoq08.x1cpjm7i.xtyp5od.x1682cnc.x124lp2h.x1hmns74.x1y3wzot').detach().appendTo('.FirstTopBarContentContainer:First');

            $('[role="banner"] .x6s0dn4.x78zum5.x5yr21d.xl56j7k.x1xegmmw').detach().appendTo('.TopBarButtonsWrapper');

            $('[aria-label="Account Controls and Settings"] .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j').detach().prependTo('.TopBarButtonsWrapper');

            $('[aria-label="Account controls and settings"] .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j').detach().prependTo('.TopBarButtonsWrapper');

        }

    }

    function getUserName() {

        if(document.querySelector('.TopBarButtonsWrapper')
           && !document.querySelector('.Username')) {

            setTimeout(() => {

                const getUserName = () => {

                    const profileLink = document.querySelector(`a[aria-label$="Timeline"]`);

                    if (!profileLink) return null;

                    const ariaLabel = profileLink.getAttribute("aria-label");

                    const name = ariaLabel.split(" ")[0];

                    return name;

                };

                let a = document.createElement('a');
                a.textContent = `${getUserName()}`;
                a.style.fontSize = "12px";
                a.style.fontWeight = "bold";
                a.style.color = "#fff";
                a.style.padding = "13px 6px";
                a.style.cursor = "pointer";
                a.style.pointerEvents = "auto";

                a.className = "Username";

                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    let newUrl = "/me";
                    window.history.pushState({}, '', newUrl);

                    window.dispatchEvent(new PopStateEvent('popstate'));

                });

                document.querySelector('.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j').append(a);

            }, 1000);

        }

    }

    function createStoriesContainerAndMakeAdjustments() {

        if (!document.querySelector('.StoriesContainer')
            && document.querySelector('.ThirdColumnWrapper')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "StoriesContainer";
            document.querySelector('.ThirdColumnWrapper').append(div);
            style.innerHTML = `
                .StoriesContainer {
                    background: #fff;
                    border: 1px solid #dddfe2;
                    border-radius: 3px;
                    width: auto;
                    height: fit-content;
                    position: relative;
                    padding: 12px;
                    display: block;

                }

            `;

            document.head.appendChild(style);

            let span = document.createElement('span');
            span.innerText = 'Stories';
            span.style.fontSize = "13px";
            span.style.fontWeight = "bold";
            span.style.color = "#616770";
            span.style.display = "block";
            span.style.paddingBottom = "12px"

            span.className = "StoriesText";

            document.querySelector('.StoriesContainer').append(span);

            let div2 = document.createElement('div');
            div2.style.display = "flex";
            div2.style.position = "relative";
            div2.style.minHeight = "56px";
            div2.style.marginBottom = "8px";

            div2.className = "StoryButtonsWrapper";

            document.querySelector('.StoriesContainer').append(div2);


            let btn = document.createElement('div');
            btn.style.background = "#f5f6f7";
            btn.style.border = "1px solid #dadde1";
            btn.style.borderRadius = "50%";
            btn.style.width = "52px";
            btn.style.height = "52px";
            btn.style.display = "flex";
            btn.style.boxSizing = "border-box";
            btn.style.position = "relative";
            btn.style.left = "2px";
            btn.style.top = "1px";
            btn.style.cursor = "pointer";
            btn.style.justifyContent = "center";

            btn.className = "StoryButton";

            btn.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "https://www.facebook.com/stories/create";;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.05)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = '#f5f6f7';

            });

            document.querySelector('.StoryButtonsWrapper').append(btn);

            let div3 = document.createElement('div');
            div3.style.display = "block";
            div3.style.position = "relative";
            div3.style.minHeight = "56px";
            div3.style.marginLeft = "8px";
            div3.style.width = "220px";

            div3.className = "StoryTextWrapper";

            document.querySelector('.StoryButtonsWrapper').append(div3);

            setTimeout(() => {

                if (document.querySelectorAll('[aria-label="Stories"]').length > 0) {

                    const numberOfElements = 3;
                    const className = 'StoriesWrapper';

                    Array.from({ length: numberOfElements }).forEach(() => {

                        let div = document.createElement('div');
                        div.style.display = "flex";
                        div.style.position = "relative";
                        div.style.width = "284px";
                        div.style.minHeight = "56px";
                        div.style.height = "fit-content";
                        div.style.marginBottom = "8px";

                        div.classList.add(className);

                        document.querySelector('.StoriesContainer').append(div);

                    });

                    const numberOfElements2 = 3;
                    const subClassName = 'StoryNamesWrapper';

                    const wrappers = document.querySelectorAll('.StoriesWrapper');

                    Array.from({ length: numberOfElements2 }).forEach((_, i) => {

                        let div2 = document.createElement('div');
                        div2.style.display = "block";
                        div2.style.position = "relative";
                        div2.style.width = "220px";
                        div2.style.minHeight = "56px";
                        div2.style.height = "fit-content";

                        div2.classList.add(subClassName);

                        wrappers[i].append(div2);

                    });

                }

            }, 1000);

            setTimeout(() => {

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo('.StoriesContainer .StoriesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo('.StoriesContainer .StoryNamesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo($('.StoriesContainer .StoryNamesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x1wpzbip.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1gp4ovq.x9p2oo0.x1h2mt7u.x56jcm7.x1tz4bnf.x1yqjg3l.x25epmt.xkkygvr:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(2));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().prependTo($('.StoriesContainer .StoryNamesWrapper').eq(2));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(3) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo('.StoriesContainer .StoriesWrapper:first');

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(4) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(1));

                $('[aria-label="Stories"] .x78zum5.x1iyjqo2.x1n2onr6.x1q0g3np :nth-child(5) .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x6s0dn4.x1wpzbip.xlid4zk.x13tp074.x1qns1p2.xipx5yg.x9f619.x78zum5.x1vqgdyp.xl56j7k.x6ikm8r.x10wlt62.x100vrsf.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1gp4ovq.xdio9jc.x1h2mt7u.x7g060r.xsdn2ir.x16rfsbj.x13awxeq.x16sykr7:first').detach().prependTo($('.StoriesContainer .StoriesWrapper').eq(2));

            }, 1000);

            let span2 = document.createElement('span');
            span2.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTIzVDExOjA2OjM0KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yM1QxMTowNzozNSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wMS0yM1QxMTowNzozNSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZDYzZmY3NS0wMGYyLTlmNGUtODY2Ny1lOTcxZDI4MjdjNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YWQ2M2ZmNzUtMDBmMi05ZjRlLTg2NjctZTk3MWQyODI3YzQxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWQ2M2ZmNzUtMDBmMi05ZjRlLTg2NjctZTk3MWQyODI3YzQxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDYzZmY3NS0wMGYyLTlmNGUtODY2Ny1lOTcxZDI4MjdjNDEiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjNUMTE6MDY6MzQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6yBic+AAAAPElEQVQ4EWP4//8/A6WY4d/f/zixSOXvrSCMTw0xhvwH4VFDBsoQaDT+JxNvpZ4ho7EzhA0hriigRqEEADc2clS7a4lrAAAAAElFTkSuQmCC')";
            span2.style.backgroundPosition = "0px 0px";
            span2.style.width = "16px";
            span2.style.height = "17px";
            span2.style.position = "relative";
            span2.style.top = "15px";

            span2.className = "StoryPlusIcon";

            document.querySelector('.StoryButton').append(span2);

            let btn2 = document.createElement('a');
            btn2.innerText = "Add to Your Story";
            btn2.style.color = "#365899";
            btn2.style.fontSize = "13px";
            btn2.style.cursor = "pointer";
            btn2.style.fontWeight = "bold";
            btn2.style.padding = "1px 4px";

            btn2.className = "AddToStory";

            document.querySelector('.StoryTextWrapper').prepend(btn2);

            btn2.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "https://www.facebook.com/stories/create";;
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            let span3 = document.createElement('span');
            span3.innerText = "Share a photo, video or write something";
            span3.style.fontSize = "13px";
            span3.style.color = "#8d949e";
            span3.style.wordBreak = "break-word";
            span3.style.fontWeight = "400";
            span3.style.display = "block";
            span3.style.position = "relative";
            span3.style.width = "167px";
            span3.style.marginTop = "3px";
            span3.style.left = "4px";

            document.querySelector('.StoryTextWrapper').append(span3);

        }

    }

    let birthdaysContainerRemoved = false;

    function createBirthdaysContainer() {

        const thirdColumn = document.querySelector('.ThirdColumnWrapper');
        const birthdaysContainer = document.querySelector('.BirthdaysContainer');

        if (!thirdColumn || birthdaysContainer || birthdaysContainerRemoved) return;

        let div = document.createElement('div');
        let style = document.createElement('style');
        div.className = "BirthdaysContainer";
        document.querySelector('.ThirdColumnWrapper').append(div);
        style.innerHTML = `
            .BirthdaysContainer {
                background: #fff;
                border: 1px solid #dddfe2;
                border-radius: 3px;
                width: auto;
                height: fit-content;
                min-height: 40px;
                position: relative;
                margin-top: 11px;
                display: block;

            }

        `;

        document.head.appendChild(style);

        setTimeout(() => {

            if (document.querySelector('[href*="/events/birthdays/"]')) {

                $('[role="complementary"] [href*="/events/birthdays/"] .x6s0dn4.xkh2ocl.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x1n2onr6.x1ja2u2z').detach().appendTo('.BirthdaysContainer');

                $('.BirthdaysContainer .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h:contains(have birthdays today.)').html(function(index, oldhtml) {
                    return oldhtml.replace('have birthdays today.', '');

                });

                let img = new Image();
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA3LTEwVDE2OjEzOjU3KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNy0xMFQxNjo1MzowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNy0xMFQxNjo1MzowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNTBjMGUyYi1kNzMxLThjNDktODEyYy0wZDEwMWRjMGU4OWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZjk0YjZjZC02OThlLTI1NDYtYjhhMi01ODA0NWVjZGQ4NGYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMTE3NDk3Zi1mYjg1LTU5NDYtODFmOS1mY2EzMmJiY2M5ZDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIxMTc0OTdmLWZiODUtNTk0Ni04MWY5LWZjYTMyYmJjYzlkMCIgc3RFdnQ6d2hlbj0iMjAyNC0wNy0xMFQxNjoxMzo1NyswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozNTBjMGUyYi1kNzMxLThjNDktODEyYy0wZDEwMWRjMGU4OWMiIHN0RXZ0OndoZW49IjIwMjQtMDctMTBUMTY6NTM6MDcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Xf7dnAAACk0lEQVRIie2UXUhTcRjGRTY107a13Jxr4WhIpUlUSA4jIiMkIigGgtJV0EVehDFQk+gLL1YLSgXTPkQZelONkJG12UBkGPTlaShTt5xjrG0pZqGp9LbnH4tlwpnGbqKLh3M4HJ7f+z7v//8mEVFSIpVQ838QIBAI/tD3OU60NHnWOPGw+KXPWHMxVFVlHDtf3fDR+V60/N9VA4JNTZWuuoP2kH4PuUr30rOCfOpQb2FqPlYyMPWuq3RNgMXQo/2hB0d6R/dpvDekYmqRZVF/roLuKuSkl2ZQS66ELCc2kL85jfz38zzBJxXtgPEConEsulThub4cmjl9mF5rtazigcKdrAMA8ERHjgoRuQ2p5L6VSZ7OkgFewMKHoz1LbjlBn80SinTAjGEKNRatZ9Xj2+NsOZm3SunVGQm5DCk03llm4QeMlFkW3ogJmm5REZevZtHcKxbR83PprFKuWkh95WlkPZDNIPaT62j4UjJNPq2v5QXMu+vq5x1igoLXsuhtjpJBYDxlllGg7ScEQjztm8RkPZ5CXG0yBfobK/k7CLTqUH0sAB0gZ5hjqDB3XRWyymMBcQ0ZpwfmgIRuR/JVKqhXLWWGMPfdTGWw4QvJ7BRFAUM16fRpyKyNGwABgOoxSAwRHQCAd2SOObTJRb8A0yO27XEArAVfX2wkaCUAiwgdLANwVzTeL35nBi/gW9ChigxzFkcU1SIekzrzt4g8DUIWURRgO6XxIp64b/KMXdcd7pbNwgjmECqOmgOGoQLQtXvHqM/eW7jqVYFO/D36y6aibeO4WKg4ao533IXB6jxPrPmalh02ptN0R+fu0HWPX98chjnkNOziZicGlX+9TWMFQ3Q11nrItpJ5XIBE6D+AVz8AAM+o4xqSjREAAAAASUVORK5CYII=';
                img.style.backgroundPosition = "0 0";
                img.style.position = "relative";
                img.style.width = "24px";
                img.style.height = "24px";
                img.style.marginLeft = "10px";

                document.querySelector('.BirthdaysContainer .x6s0dn4.xkh2ocl.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.x2lwn1j.xeuugli.x18d9i69.xyri2b.x1c1uobl.xexx8yu.x1n2onr6.x1ja2u2z').prepend(img);

            } else if (!document.querySelector('[href*="/events/birthdays/"]')) {

                const elementToRemove = document.querySelector('.BirthdaysContainer');

                if (elementToRemove) {
                    elementToRemove.remove();
                    document.querySelector('.ThirdColumnWrapper').style.top = "-267px";

                    birthdaysContainerRemoved = true;

                }

            }

        }, 1000);

    }

    let sponsoredContainerRemoved = false;

    function createSponsoredContainer() {

        const thirdColumn = document.querySelector('.ThirdColumnWrapper');
        const sponsoredContainer = document.querySelector('.SponsoredContainer');
        if (!thirdColumn || sponsoredContainer || sponsoredContainerRemoved) return;

        let div = document.createElement('div');
        let style = document.createElement('style');
        div.className = "SponsoredContainer";
        document.querySelector('.ThirdColumnWrapper').append(div);
        style.innerHTML = `
            .SponsoredContainer {
                background: #fff;
                border: 1px solid #dddfe2;
                border-radius: 3px;
                width: auto;
                height: fit-content;
                display: block;
                position: relative;
                padding: 12px;
                margin-top: 11px;

            }

        `;

        document.head.appendChild(style);

        let span = document.createElement('span');
        span.innerText = 'Sponsored';
        span.style.fontSize = "13px";
        span.style.lineHeight = "13px";
        span.style.fontWeight = "bold";
        span.style.color= "#616770";
        span.style.display= "block";

        span.className = "SponsoredText";

        document.querySelector('.SponsoredContainer').append(span);

        let div2 = document.createElement('div');
        div2.style.width = "286px";
        div2.style.height = "fit-content";
        div2.style.display = "block";
        div2.style.position = "relative";

        div2.className = "WrapperForAds";

        document.querySelector('.SponsoredContainer').append(div2);

        setTimeout(() => {

            if (document.querySelector('[role="complementary"] .xwib8y2.x1y1aw1k')) {

                $('[role="complementary"] .xwib8y2.x1y1aw1k:first').detach().appendTo('.WrapperForAds');

                $('.SponsoredContainer .xwib8y2.x1y1aw1k :last-child .x78zum5.xdt5ytf.xz62fqu.x16ldp7u').detach().appendTo('.WrapperForAds div ~ div .x1n2onr6:first');

                $('.WrapperForAds div ~ div .x1n2onr6:first .x78zum5.xdt5ytf.xz62fqu.x16ldp7u:first').detach().appendTo('.WrapperForAds div :first .x1n2onr6:first');

            } else if (!document.querySelector('[role="complementary"] .xwib8y2.x1y1aw1k')) {

                const elementToRemove = document.querySelector('.SponsoredContainer');

                if (elementToRemove) {
                    elementToRemove.remove();

                    sponsoredContainerRemoved = true;

                }

            }

        }, 1000);

    }

    function createLanguageContainer() {

        if (!document.querySelector('.LanguageContainer')
            && document.querySelector('.ThirdColumnWrapper')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "LanguageContainer";
            style.innerHTML = `
                .LanguageContainer {
                    background: #fff;
                    border: 1px solid #dddfe2;
                    border-radius: 3px;
                    width: auto;
                    height: fit-content;
                    display: flex;
                    position: relative;
                    margin-top: 11px;
                    padding: 12px;

                }

            `;

            document.head.appendChild(style);

            document.querySelector('.ThirdColumnWrapper').append(div);

            let div2 = document.createElement('div');
            div2.style.display = "block";
            div2.style.position = "relative";
            div2.style.flex = "1 0 0px";
            div2.style.margin = "1px";
            div2.style.maxWidth = "244px";
            div2.style.width = "244px";

            div2.className = "LanguageButtonsWrapper";

            document.querySelector('.LanguageContainer').append(div2);

            const texts = ["English (US) ·", "Español ·", "Português (Brasil) ·", "Français (France) ·", "Deutsch"];
            const container = document.querySelector('.LanguageButtonsWrapper');

            texts.forEach(text => {
                let div = document.createElement('a');
                div.className = "Language";
                div.textContent = text;
                div.style.display = "inline-block";
                div.style.background = "transparent";
                div.style.border = "none";
                div.style.color = "#365899";
                div.style.fontSize = "13px";
                div.style.cursor = "pointer";
                div.style.position = "relative";
                div.style.boxSizing = "border-box";
                div.style.lineHeight = "normal";
                div.style.padding = "1px 2px";

                container.appendChild(div);

            });

            let btn = document.createElement('button');
            btn.style.background = "#f6f7f9";
            btn.style.border = "1px solid #ced0d4";
            btn.style.cursor = "pointer";
            btn.style.height = "28px";
            btn.style.width = "34px";
            btn.style.position = "absolute";
            btn.style.bottom = "20px";
            btn.style.right = "-37px";

            btn.className = "LanguageButton";

            document.querySelector('.LanguageButtonsWrapper').prepend(btn);

            btn.addEventListener("click", function() {
                window.location.href = "https://www.facebook.com/settings?tab=language";

            });

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(0, 0, 0, 0.05)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = '#f6f7f9';

            });

            let span = document.createElement('i');
            span.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTE3VDAxOjQxOjI4KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0xN1QwMTo0Mjo0MCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wMS0xN1QwMTo0Mjo0MCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxYzg5YWQ5YS0xNmU1LTE3NDEtYjA4NC1kYWE2YzM0MGY5NmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjMGJmMzFmZS1jNmVhLTVjNDAtODc3ZS1iYzBhMjljN2Y0Y2YiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3MzQ4NDRiNy1hMDkyLWYxNDktYmVhZi0yZjU2OTk0NWUwOTQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjczNDg0NGI3LWEwOTItZjE0OS1iZWFmLTJmNTY5OTQ1ZTA5NCIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0xN1QwMTo0MToyOCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxYzg5YWQ5YS0xNmU1LTE3NDEtYjA4NC1kYWE2YzM0MGY5NmMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMTdUMDE6NDI6NDArMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4F25qEAAAAVUlEQVQoFWP4//8/A6kYTPhkFqLg0Jjs/yCMLo5XU2xK8X8QJklTUmbFfxCmviaYH0AY5CyYJhAbWQ5FE7JCEM4sqAdjZDGQGrzOg2kaJAFBliZSMQBUQ0Dy8TiUUwAAAABJRU5ErkJggg==')";
            span.style.backgroundPosition = "0px 0px";
            span.style.display = "inline-block";
            span.style.height = "12px";
            span.style.width = "12px";
            span.style.position = "relative";
            span.style.bottom = "1px";
            span.style.verticalAlign = "middle";

            span.className = "MoreLanguages";

            document.querySelector('.LanguageButton').append(span);


        }

    }

    function makeFurtherAdjustments() {

        if (!document.querySelector('.CreatePost') &&
            document.querySelector('[role="main"] .x193iq5w.xvue9z.xq1tmr.x1ceravr') &&
            !document.querySelector('[aria-label="Feeds"]')) {

            let div = document.createElement('div');
            div.style.background = '#f5f6f7';
            div.style.width = '500px';
            div.style.height = 'auto';
            div.style.border = '1px solid #dddfe2';
            div.style.borderRadius = '2px 2px 0 0';
            div.style.position = 'relative';
            div.style.left = '-1px';
            div.style.padding = "8px";

            div.className = "CreatePost";

            document.querySelector('[role="main"] .x1n2onr6.x1ja2u2z.x1jx94hy.xw5cjc7.x1dmpuos.x1vsv7so.xau1kf4.x9f619.xh8yej3.x6ikm8r.x10wlt62.xquyuld').prepend(div);

            let span = document.createElement('span');
            span.innerText = 'Create Post';
            span.style.fontSize = "12px";
            span.style.fontWeight = "bold";
            span.style.color= "#4b4f56";
            span.style.display= "block";

            span.className = "PostText";

            document.querySelector('.CreatePost').append(span);

            setTimeout(() => {

                $('.x2lah0s.xyamay9.xv54qhq.x1l90r2v.xf7dkkf:first').detach().appendTo('.ThirdColumnWrapper');

            }, 1000);

            $('.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa:contains(Meta © 2025)').html(function(index, oldhtml) {
                return oldhtml.replace('Meta © 2025', 'Facebook © 2018');

            });

            if(document.querySelector('[aria-label="Messenger"]')) {

                setInterval(() => {

                    $('[aria-label="Messenger"] span:contains(Chats)').html(function(index, oldhtml) {
                        return oldhtml.replace('Chats', 'Recent');

                    });

                }, 1000);


            }

            $('[placeholder="Search Facebook"]').attr('placeholder','Search');

            if (document.querySelector('.BirthdaysContainer')) {

                document.querySelector('.ThirdColumnWrapper').style.top = "-321px";

            }

        }

    }

    function moveProfilePageElements() {

        if (!document.querySelector('[aria-label="Event Permalink"]')
            && !document.querySelector('[aria-label="Cover photo"]')
            && !document.querySelector('.xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Liked"]')
            && !document.querySelector('.xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Like"]')
            && !document.querySelector('[aria-label="Professional dashboard"]')
            && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6')) {

            $('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6 .x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz:first').detach().appendTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0:first');

        }

        if (document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy') &&
            !document.querySelector('.xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Liked"]') &&
            !document.querySelector('.xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Like"]') &&
            !document.querySelector('[aria-label="Professional dashboard"]')) {

            $('.x1ifrov1.x1i1uccp.x1stjdt1.x1yaem6q.x4ckvhe.x2k3zez.xjbssrd.x1ltux0g.xrafsqe.xc9uqle.x17quhge:first').detach().appendTo('.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.xde0f50.x15x8krk.x1qq2va3.x1qpcq7s');

            $('.x1f96rhh.xig2yid.x1csz39x.xs42yjr.x1cdhp0d.x1obogrm.x1f1051q.x1ty54ac.x1v6bbt2.xfk785k.xsc10am:first').detach().appendTo('.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.xde0f50.x15x8krk.x1qq2va3.x1qpcq7s');

            $('.x78zum5 [aria-label="Profile settings see more options"]').detach().appendTo('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy:first');

            $('[aria-label="See recommendations"]:first').detach().appendTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0:first');

            $('[aria-label="See Recommendations"]:first').detach().appendTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0:first');

            $('span [href*="/followers/"]').detach().prependTo('.x7wzq59 .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.x1icxu4v.x25sj25.x10b6aqq.x1yrsyyn ul');

        }

        setTimeout(() => {

            if (!document.querySelector('.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1l90r2v.x1ve1bff [href*="/friends_likes/"]') &&
                !document.querySelector('[aria-label="Event Permalink"]') &&
                !document.querySelector('[aria-label="Cover photo"]') &&
                !document.querySelector('.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1l90r2v.x1ve1bff [href*="/following/"]')) {

                $('.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1l90r2v.x1ve1bff .x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1sur9pj.xkrqix3.xi81zsa.x1s688f:first').detach().appendTo('.x78zum5.x15sbx0n.x5oxk1f.x1jxijyj.xym1h4x.xuy2c7u.x1ltux0g.xc9uqle .x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz [href*="/friends"] .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x18d9i69.x6s0dn4.x9f619.x78zum5.x2lah0s.x1hshjfz.x1n2onr6.xng8ra.x1swvt13.x1pi30zi:first');

            }

            if (document.querySelector('.x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz [href*="/friends"]')
                && document.querySelector('.x192njpj.x1ilu3uo.x10l6tqk.x13vifvy')
                && !document.querySelector('.LeftColumnContainer')) {

                document.querySelector('.x192njpj.x1ilu3uo.x10l6tqk.x13vifvy').style.insetInlineStart = "436px";

            }

        }, 1000);

    }

    function addTimelineAndRecentButtons() {

        setTimeout(() => {

            if (document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli .x6s0dn4.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.xeuugli.x18d9i69.xf159sx.xmzvs34.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh')
                && !document.querySelector('[data-pagelet="Stories"]')
                && !document.querySelector('.TimelineButton')
                && !document.querySelector('.RecentButton')) {

                let btn = document.createElement('button');
                btn.innerText = "Timeline";
                btn.style.position = "relative";
                btn.style.background = "rgba(0, 0, 0, 0.0195312)";
                btn.style.border = "1px solid #a5a5a5";
                btn.style.borderRadius = "0px";
                btn.style.height = "23px";
                btn.style.color = "rgb(75, 79, 86)";
                btn.style.fontSize = "13px";
                btn.style.fontWeight = "bold";
                btn.style.bottom = "1px";
                btn.style.right = "3px";
                btn.style.padding = "2px 12px 2px 6px";
                btn.style.cursor = "pointer";

                btn.className = "TimelineButton";

                document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli .x6s0dn4.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.xeuugli.x18d9i69.xf159sx.xmzvs34.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh').append(btn);

                btn.addEventListener('mouseover', () => {
                    btn.style.backgroundColor = 'rgba(0, 0, 0, .08)';

                });

                btn.addEventListener('mouseout', () => {
                    btn.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';

                });

                let btn2 = document.createElement('button');
                btn2.innerText = "Recent";
                btn2.style.position = "relative";
                btn2.style.background = "rgba(0, 0, 0, 0.0195312)";
                btn2.style.border = "1px solid #a5a5a5";
                btn2.style.borderRadius = "0px 2px 2px 0px";
                btn2.style.height = "23px";
                btn2.style.padding = "2px 12px 2px 6px";
                btn2.style.color = "rgb(75, 79, 86)";
                btn2.style.fontSize = "13px";
                btn2.style.fontWeight = "bold";
                btn2.style.bottom = "1px";
                btn2.style.right = "4px";
                btn2.style.cursor = "pointer";

                btn2.className = "RecentButton";

                document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli .x6s0dn4.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.xeuugli.x18d9i69.xf159sx.xmzvs34.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh').append(btn2);

                btn2.addEventListener('mouseover', () => {
                    btn2.style.backgroundColor = 'rgba(0, 0, 0, .08)';

                });

                btn2.addEventListener('mouseout', () => {
                    btn2.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';

                });

            }

            const originalbtn = document.querySelector('.x9f619.x1ja2u2z.x1xzczws.x7wzq59 a');

            const btn3 = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli .x1qjc9v5.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x9f619.x78zum5.x1r8uery.xdt5ytf.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.x2lwn1j.xeuugli.x4uap5.xkhd6sd.xz9dl7a.xsag5q8.x1n2onr6.x1ja2u2z');

            if (btn3) {

                btn3.addEventListener("click", function() {
                    originalbtn.click();

                });

                btn3.addEventListener('mouseover', () => {
                    btn3.style.backgroundColor = 'rgba(0, 0, 0, .08)';
                });

                btn3.addEventListener('mouseout', () => {
                    btn3.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';

                });

            }

        }, 1000);


        if (document.querySelector('.TimelineButton')) {

            document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.xamitd3 a').removeAttribute('href');

            const button = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xeuugli.xamitd3 a');

            button.addEventListener('click', function(event) {
                event.stopPropagation();

            });

        }

    }

    function appendDropdownMenu(id) {

        setTimeout(() => {

            if (document.querySelector('.TimelineButton') && !document.querySelector('.TimelineButtonDropdown')) {

                let ul = document.createElement('ul');
                ul.style.display = "none";
                ul.style.position = "absolute";
                ul.style.height = "auto";
                ul.style.maxWidth = "107px";
                ul.style.width = "107px";
                ul.style.padding = "3px 0px 4px";
                ul.style.background = "#fff";
                ul.style.border = "1px solid #777";
                ul.style.borderBottom = "2px solid #293e6a";
                ul.style.borderRadius = "0px";
                ul.style.transform = "translate(-7px, 3px)";

                ul.className = "TimelineButtonDropdown";

                document.querySelector('.TimelineButton').append(ul);

                let btn = document.querySelector('.TimelineButton');

                btn.addEventListener('click', () => {
                    if (ul.style.display === "block") {

                        ul.style.display = "none";
                        btn.setAttribute("aria-expanded", "false");

                    } else {

                        ul.style.display = "block";
                        btn.setAttribute("aria-expanded", "true");

                    }

                });

                document.addEventListener('click', e => {

                    if(!ul.contains(e.target) && e.target !== btn) {

                        ul.style.display = "none";
                        btn.setAttribute("aria-expanded", "false");

                    }

                });

                const numberOfElements = 2;
                const className = 'TimelineDropdownListItem';
                const items = [

                    { text: "Timeline", href: `/profile.php?id=${id}` },
                    { text: "About", href: `/profile.php?id=${id}&sk=about` }

                ];

                Array.from({ length: numberOfElements }).forEach((_, index) => {

                    let text = document.createElement('a');
                    text.href = items[index].href;
                    text.style.display = "block";
                    text.style.position = "relative";
                    text.style.width = "auto";
                    text.style.height = "18px";
                    text.style.padding = "1px 16px 1px 22px";
                    text.style.cursor = "pointer";
                    text.style.textDecoration = "none";

                    text.classList.add(className);

                    document.querySelector('.TimelineButtonDropdown').append(text);

                    const span = document.createElement('span');
                    span.textContent = items[index].text;
                    span.style.fontSize = "12px";
                    span.style.fontWeight = "normal"
                    span.style.lineHeight = "18px";
                    span.style.cursor = "pointer";
                    span.style.color = "rgb(29, 33, 41)";
                    span.style.textDecoration = "none";

                    span.className = "TimelineButtonDropdownText";

                    text.appendChild(span);

                });

                let i = document.createElement('i');
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTEwVDE4OjUwOjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0xMFQxODo1MTozMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0xMFQxODo1MTozMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiN2JhZDg4Yi1iMDNkLWYyNDQtYTNiMC0wMWIxN2EwNDdlNzAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2MjM1OWRmMS1iZGY0LTk4NDYtYjkwZC1jZDZhNDZhYjMyNDciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjYjA5NTBlMy00Nzk4LTc0NGMtOGI1Ni1iNTgyNGYyNTdlOWEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNiMDk1MGUzLTQ3OTgtNzQ0Yy04YjU2LWI1ODI0ZjI1N2U5YSIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0xMFQxODo1MDoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiN2JhZDg4Yi1iMDNkLWYyNDQtYTNiMC0wMWIxN2EwNDdlNzAiIHN0RXZ0OndoZW49IjIwMjUtMDItMTBUMTg6NTE6MzMrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4AetIhAAAA/ElEQVQoFWPwySxkIAb3tOR0Lp7b+RRI34WJEaPJBYjPPrh34z8IFOVEPIVrBnJWN1Rn/kfH06ZNA+GYvo6S/8igJC8KLA/SB9L8Hxu4e/fu/71798L5W/ZeANMgjVAX/Mep+dOnT3DNe45c/X/41E3cmkEmwzBIIUzz5y/f/588fxe/zScuPILjyzdfwDV//f5zgG3+8OkbeTZ/+vwdHpAkhfbfv39RxEmOKhAAJs3/i2Z3/D9+ZAeq5n271mJgUCLZtGkTWOHUvvL/G1bPRpEHaza3CfiPjuOTi/9vWT//PzBNgzWC+NjUMQABDxQLwTBQohFNYSOyPEwPAIOKd+X+WIShAAAAAElFTkSuQmCC)";
                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.verticalAlign = "middle";
                i.style.width = "16px";
                i.style.height = "16px";
                i.style.marginRight = "5px";

                document.querySelector('.TimelineButtonDropdown a:first-child').prepend(i);

                let i2 = document.createElement('i');
                i2.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAIAAAAv2XlzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTEwVDE4OjUwOjI2KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0xMFQyMDoxNzozOSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0xMFQyMDoxNzozOSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NTBmOThmNi0xYjg2LWMwNDItYmYyZS01ZjJmNzAxNWYxMmEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NDhmM2I2ZC02MDdkLTkyNGQtYjg1Yy05NTBhNzExMGY5NjUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzhmMDc2NC1iNGZjLTFiNGMtODA4Mi0zMzE2MDM2YzE5NzQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjOGYwNzY0LWI0ZmMtMWI0Yy04MDgyLTMzMTYwMzZjMTk3NCIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0xMFQxODo1MDoyNiswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NTBmOThmNi0xYjg2LWMwNDItYmYyZS01ZjJmNzAxNWYxMmEiIHN0RXZ0OndoZW49IjIwMjUtMDItMTBUMjA6MTc6MzkrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5IP6h7AAAA+ElEQVQokZWSTQsBQRzGfS9fwlU+gouD8g2cfACFi4uTgwmtUnIQB2/tagh52TgqYW0zu5ZnGjvrgJh+7WzN8/s/s7UhQkj854VwCNvdc7/ieD4ICyEczYJKUy/kc2/Bkcw8hU/zntyYjx0I9fZUUm1NytrQMMaNRq3X7SzmdL2aSwIBYxCNJUsoxRPC1TqC/W4DkFO8ClTeEqAEZxg5m+ro2axmEs+1fOHGIKgGKYCrdTD0PnIS17kowYaQytQhJNKkrA0QPdGR2W0De0kRdbggECLxoroS3jEYmNsFvgQ5zgSMKcEvlb1qnsophPD3r8E5P/+8EH4A+7bOM2Y6igwAAAAASUVORK5CYII=)";
                i2.style.display = "inline-block";
                i2.style.position = "relative";
                i2.style.verticalAlign = "middle";
                i2.style.width = "16px";
                i2.style.height = "14px";
                i2.style.marginRight = "-7px";
                i2.style.right = "13px";

                document.querySelector('.TimelineButtonDropdown a:nth-child(2)').prepend(i2);

            }

        }, 1000);

    }

    function getId() {

        if (location.pathname == '/profile.php') {

            appendDropdownMenu(new URLSearchParams(location.search).get('id'));

        } else if (location.pathname == '/friends/suggestions/') {

            appendDropdownMenu(new URLSearchParams(location.search).get('profile_id'));

        } else {

            GM.xmlHttpRequest({
                method: 'get',
                url: location.origin + location.pathname,
                onload: response => {

                    const userId = response.responseText?.match(/(?<=userID":")\d*/g)?.[0];
                    if (userId) appendDropdownMenu(userId);

                }

            });

        }

    }

    var url;

    setInterval(() => {

        if (url != location.href) {
            url = location.href;

            setTimeout(() => {

                if (!document.querySelector('#mpLink') &&

                    !location.pathname.match(/^\/$|\/groups*|\/messages*|\/marketplace*|\/watch*|\/reel*|\/events*|\/gaming*|\/memories*|\/saved*|\/fundraisers*|\/pages*|\/settings*|\/help*|\/ads*/g) &&
                    document.querySelectorAll('circle[cx="84"]')) {

                    getId();

                }

            }, 900);

        }

    }, 200);

    function createProfilePageButtons() {

        if (document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3')
            && !document.querySelector('[aria-label="Suggestions"]')
            && !document.querySelector('[aria-label="temp heading"]')
            && !document.querySelector('.UpdateInfo')
            && !document.querySelector('.ActivityLog')
            && !document.querySelector('[aria-label="Message"]')
            && !document.querySelector('[aria-label="Search"]')) {

            let btn = document.createElement('button');
            btn.innerText = "Update Info";
            btn.style.display = "block";
            btn.style.position = "relative";
            btn.style.border = "1px solid #ced0d4";
            btn.style.background = "#f6f7f9";
            btn.style.height = "26px";
            btn.style.padding = "0 10px";
            btn.style.boxSizing = "content-box";
            btn.style.borderRadius = "2px";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = "bold";
            btn.style.color = "#4b4f56";

            btn.className = "UpdateInfo";

            document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:first-child').append(btn);

            btn.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "/me/about";
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = 'rgb(233, 235, 238)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = '#f6f7f9';

            });

            let btn2 = document.createElement('button');
            btn2.innerText = "Activity Log";
            btn2.style.display = "block";
            btn2.style.position = "relative";
            btn2.style.border = "1px solid #ced0d4";
            btn2.style.background = "#f6f7f9";
            btn2.style.height = "26px";
            btn2.style.padding = "0 10px";
            btn2.style.boxSizing = "content-box";
            btn2.style.borderRadius = "2px";
            btn2.style.cursor = "pointer";
            btn2.style.lineHeight = "23px";
            btn2.style.fontWeight = "bold";
            btn2.style.color = "#4b4f56";

            btn2.className = "ActivityLog";

            document.querySelector('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy .xdwrcjd.x2fvf9.x1xmf6yo.x1w6jkce.xusnbm3:nth-child(2)').append(btn2);

            btn2.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "https://www.facebook.com/you/allactivity/?category_key=ALL&entry_point=profile_shortcut&should_load_landing_page=1";
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            btn2.addEventListener('mouseover', () => {
                btn2.style.backgroundColor = 'rgb(233, 235, 238)';

            });

            btn2.addEventListener('mouseout', () => {
                btn2.style.backgroundColor = '#f6f7f9';

            });

        }

    }

    function createProfilePageIcons() {

        if (document.querySelector('.x78zum5.x1a02dak.x139jcc6.xcud41i.x9otpla.x1ke80iy')
            && document.querySelector('.ActivityLog')
            && !document.querySelector('.ActivityLogIcon')
            && !document.querySelector('[aria-label="fundraiser image"]')
            && !document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Liked"]')
            && !document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Like"]')
            && !document.querySelector('.LeftColumnContainer')) {

            if (!document.querySelector('.ActivityLogIcon')) {

                let i = document.createElement('i');
                i.style.display = "inline-block";
                i.style.position = "relative";
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAyLTA3VDIyOjAwOjQwKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMi0wN1QyMjowMTo0NCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMi0wN1QyMjowMTo0NCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGJmZjU0Ny02YjMwLTI0NDYtOGQ0OS02YzAwNjJkZGIyM2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxN2VhNTJkNy1iM2I0LWE4NDQtYTgxMi0xYTE2YjU0YTFjYjMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMTQwMzcyZC0yYTJhLWRkNGEtOGY2ZS0yN2RjNTJlYmZkZTIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjExNDAzNzJkLTJhMmEtZGQ0YS04ZjZlLTI3ZGM1MmViZmRlMiIgc3RFdnQ6d2hlbj0iMjAyNS0wMi0wN1QyMjowMDo0MCswNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NGJmZjU0Ny02YjMwLTI0NDYtOGQ0OS02YzAwNjJkZGIyM2YiIHN0RXZ0OndoZW49IjIwMjUtMDItMDdUMjI6MDE6NDQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz534nRSAAAAKUlEQVQokWOor6//DcL//v5nIAYzoGsAsv/jw0SZimID7TWMepoWngYAWPOayPHLkmYAAAAASUVORK5CYII=)";
                i.style.backgroundRepeat = "no-repeat";
                i.style.width = "16px";
                i.style.height = "16px";
                i.style.marginRight = "4px";
                i.style.top = "6px";

                i.className = "ActivityLogIcon";

                document.querySelector('.ActivityLog').prepend(i);

            }

        }

        setTimeout(() => {

            if (document.querySelector('.TimelineIcon') && document.querySelector('.RecentIcon')) {
                return;

            }

            if (document.querySelector('.TimelineButton')
                && document.querySelector('.RecentButton')) {

                let img = new Image();
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAICAYAAAAvOAWIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI1VDE5OjU5OjI3KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yNVQyMDowMDo1OCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0yNVQyMDowMDo1OCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYzAxOTdlMi1mY2U3LTg2NDUtOTMxOS0xODc0YTJkOGM0OGUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YWMwMTk3ZTItZmNlNy04NjQ1LTkzMTktMTg3NGEyZDhjNDhlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWMwMTk3ZTItZmNlNy04NjQ1LTkzMTktMTg3NGEyZDhjNDhlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYzAxOTdlMi1mY2U3LTg2NDUtOTMxOS0xODc0YTJkOGM0OGUiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjVUMTk6NTk6MjcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5w3IKBAAAAOUlEQVQYGWP4//8/A7EYTATlLftPCMMV+2QW4tUAkkdRjEsDTA5DMboGZHGsimEa0MXgikkKDWIxAKV601WOJhzBAAAAAElFTkSuQmCC';
                img.style.backgroundPosition = "0px 0px";
                img.style.position = "relative";
                img.style.left = "4px";

                img.className = "TimelineIcon";

                document.querySelector('.TimelineButton').append(img);

                let img2 = new Image();
                img2.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAICAYAAAAvOAWIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI1VDE5OjU5OjI3KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yNVQyMDowMDo1OCswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0yNVQyMDowMDo1OCswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYzAxOTdlMi1mY2U3LTg2NDUtOTMxOS0xODc0YTJkOGM0OGUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YWMwMTk3ZTItZmNlNy04NjQ1LTkzMTktMTg3NGEyZDhjNDhlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWMwMTk3ZTItZmNlNy04NjQ1LTkzMTktMTg3NGEyZDhjNDhlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYzAxOTdlMi1mY2U3LTg2NDUtOTMxOS0xODc0YTJkOGM0OGUiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjVUMTk6NTk6MjcrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5w3IKBAAAAOUlEQVQYGWP4//8/A7EYTATlLftPCMMV+2QW4tUAkkdRjEsDTA5DMboGZHGsimEa0MXgikkKDWIxAKV601WOJhzBAAAAAElFTkSuQmCC';
                img2.style.backgroundPosition = "0px 0px";
                img2.style.position = "relative";
                img2.style.left = "4px";

                img2.className = "RecentIcon";

                document.querySelector('.RecentButton').append(img2);

                if (document.querySelector('.x7wzq59 ul [href*="/followers/"]')) {

                    let img = new Image();
                    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEVMaXGQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJxriGMlAAAAEXRSTlMA8AjarOTBLm76gRqyWEeYzqjHFOsAAACYSURBVHherZFLDsMgDAULGGzn02Tuf9nKoi1VwzJvB+PHWOJxb7YqpjNApFi+gEaEZBeiJgmgTR7MVoD0nKkWB58SrX+kJenHtUBaBwA49UPaABsRC6IONogeDixBFkj519venVyIiZEs4OExKN9xDXKChN9B3yC5da/HqjL0wB7Ldf8OMkDtNy2aQ3LUKmFp1fq/RfHGvABvKwe8Rh49UQAAAABJRU5ErkJggg==';
                    img.style.backgroundPosition = "0px 0px";
                    img.style.position = "relative";
                    img.style.width = "16px";
                    img.style.height = "16px";
                    img.style.marginRight = "8px";

                    img.className = "FollowIcon";

                    document.querySelector('.x7wzq59 ul [href*="/followers/"]').prepend(img);

                }

            }

        }, 1000);

        setTimeout(() => {

            if (document.querySelector('.x7wzq59')
                && !document.querySelector('.IconContainer')
                && !document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Liked"]')
                && !document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Like"]')
                && !document.querySelector('[aria-label="fundraiser image"]')
                && !document.querySelector('[aria-label="Professional dashboard"]')
                && !document.querySelector('.LeftColumnContainer')) {

                let IconContainers = [];
                for (let i = 0; i < 4; i++) {
                    let IconContainer = document.createElement('div');
                    IconContainer.style.display = "inline-block";
                    IconContainer.style.position = "relative";
                    IconContainer.style.height = "24px";
                    IconContainer.style.width = "24px";
                    IconContainer.style.top = "6px";
                    IconContainer.style.marginRight = "7px";
                    IconContainer.className = "IconContainer";
                    IconContainers.push(IconContainer);

                }

                if (document.querySelector('.x7wzq59 .x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xjkvuk6.x1cnzs8 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i')) {
                    document.querySelector('.x7wzq59 .x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xjkvuk6.x1cnzs8 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i').prepend(IconContainers[0]);

                }

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"]')) {
                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"]').prepend(IconContainers[1]);

                }

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"]')) {
                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"]').prepend(IconContainers[2]);

                }

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/about?section=year-overviews"]')) {
                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/about?section=year-overviews"]').prepend(IconContainers[3]);

                }

            }

            if (document.querySelector('.IconContainer')
                && !document.querySelector('.IntroIcon')
                && !document.querySelector('.PhotoIcon')
                && !document.querySelector('.FriendsIcon')
                && !document.querySelector('.LifeEventsIcon')) {

                let introIcon = document.createElement('i');
                introIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA3LTEyVDIwOjIzOjI0KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNy0xMlQyMDoyNDowNyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNy0xMlQyMDoyNDowNyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMjVhYjAwNC01ZTUzLTlkNGMtOWFlZi04YjdiZTY5MGIzNzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTI1YWIwMDQtNWU1My05ZDRjLTlhZWYtOGI3YmU2OTBiMzc2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTI1YWIwMDQtNWU1My05ZDRjLTlhZWYtOGI3YmU2OTBiMzc2Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMjVhYjAwNC01ZTUzLTlkNGMtOWFlZi04YjdiZTY5MGIzNzYiIHN0RXZ0OndoZW49IjIwMjQtMDctMTJUMjA6MjM6MjQrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6/jUgMAAABlElEQVRIib1WsUrEQBDd7/BfBJMP8ApLS3EFC8FCGzt/QGw9LK0sTNKcwtWHoI2FyBU22oiFIFqIEtd9c0xY1plN4DQDwyWZzXszb2Y3Z75rZzRfXDtbWLLFZm6rUW7LaWbLNziu8QwxrElhqMAeYOiB6nyjcknHGr9WI/r1IFsvlynLNuDIqTr/bpIgs8VWp6wT1QBDJAD7XOAhSVBJo3lKlpWdC7d7eOkOTm7IcT3YHiXl4p4QATVUWQzA88mjOy7u6Jft4emdYnol1ZAIZhMjS3M6vifnbPePrukeZGy416QCtqE5VzK/un0W5QJoaFolwDa0iaIAMn55/RAJQplgvE7sicc2tCujAJoIYwKAImtkGhvk4sYLMk2NND0MhOzwIgjQVHhsiPGESdOUJIB9ftVNBSBEDM0OyRBXCVIShQbA1b1xswbX3A+uVJRIa7IkB/SOx5jJ1SanxlQyzhQyQb7WMW3baBIB5OEKWzdal6MilAujC807HxVdDjvoO9dh9+/HdS8fnF4+mb189P/6b8sP5GX4J5ExXk0AAAAASUVORK5CYII=)';
                introIcon.style.display = "block";
                introIcon.style.position = "relative";
                introIcon.style.height = "24px";
                introIcon.style.width = "24px";

                introIcon.className = "IntroIcon";

                document.querySelector('.x7wzq59 .x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xjkvuk6.x1cnzs8 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i .IconContainer').append(introIcon);

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"] .IconContainer')) {

                    let photoIcon = document.createElement('i')
                    photoIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA3LTEyVDIwOjA0OjA4KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNy0xMlQyMDowNDo0NiswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNy0xMlQyMDowNDo0NiswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNDcwODI1OC03MWJiLTIyNDAtYTlmOS0zOTAzZjA2N2EzY2EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZjQ3MDgyNTgtNzFiYi0yMjQwLWE5ZjktMzkwM2YwNjdhM2NhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjQ3MDgyNTgtNzFiYi0yMjQwLWE5ZjktMzkwM2YwNjdhM2NhIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmNDcwODI1OC03MWJiLTIyNDAtYTlmOS0zOTAzZjA2N2EzY2EiIHN0RXZ0OndoZW49IjIwMjQtMDctMTJUMjA6MDQ6MDgrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4mAZJeAAABW0lEQVRIx72WzUrEMBDH+xyyL7QgbV9jQQ8+gXcv+wBFL9s+gYInT4I3QW/pTRCpnvZQlgWljPmnTdgNyaRFm4Gh0Ezml/nIR3K6ukh8Wr4uF2WdnZUiv69EXlcia3vNa/xTY9KG80FEiXPgWqQn0llR1XknlQLawRZzRkM2Ik3VasPOj1XOwdwgBOFPdm5FBR9eiIpgXHqCoMOIDGSoQfsPAJM6XSMDGYp8ZPj8dUM/3Z5CAhvYOkCFgaAFXWnC5Gb3Qo8fV6zCBrbO+kjfPcRTbAic3L2dk9je0sP7pTM1T81a2brG4LuHYKMxEAAg7ffndIj0rSBqJzMQRAAAYHoM0SFNGOMg8D1A3F2lIfZ/AHRD4Ksj9XXZKAhWikiw6kOALQGIP11Iid2uPmHTxRV+irCF51r4zxDTwsxmHCvBzRjlWIl2QEY56q1Lq5vt0op2/UZ7SMzxJPoFrtVVhiTeYqIAAAAASUVORK5CYII=)';
                    photoIcon.style.display = "block";
                    photoIcon.style.position = "relative";
                    photoIcon.style.height = "24px";
                    photoIcon.style.width = "24px";

                    photoIcon.className = "PhotoIcon";

                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/photos"] .IconContainer').append(photoIcon);

                }

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"] .IconContainer')) {

                    let friendsIcon = document.createElement('i')
                    friendsIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAUVBMVEVMaXHtCWT0DWrrCmLzDWv0DWvyDWnzDGr1Dmr0Dmr1DWr1DWv////1Dmv4Yp73T5P93On1GXH6j7r2LH75cKf9y9/+9vn8s9D7oMX+7PP2O4Z+FX8rAAAADHRSTlMAHLYam9lObPPy/P2dzFy9AAAAuElEQVR4XnWS2w6EIAxEC6J4GUBQV93//9CNOkbihvN6yLS0FaKsrtu21lZJTmV6R3pTPaLpXEbXCLGOkMHy/eDepjnzmZPTHXWMO4lhcmEcp8sYEcV+RuxxBWb2pu7KAYBfAc8wK/oSHsC8AYFCS/0IH/BxpJaWtRO2OAMTRXuLacHy3YBPipdg1IyDlACsjNJs9iQALKPFZmL3ABa2yw++6BVH8sYUh1gc+4kd/hZVXm35GIrn8wMMIhb7l6O9sgAAAABJRU5ErkJggg==)';
                    friendsIcon.style.backgroundPosition = "0px 0px";
                    friendsIcon.style.display = "block";
                    friendsIcon.style.position = "relative";
                    friendsIcon.style.width = "24px";
                    friendsIcon.style.height = "24px";

                    friendsIcon.className = "FriendsIcon";

                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"] .IconContainer').append(friendsIcon);

                }

                if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/about?section=year-overviews"] .IconContainer')) {

                    let lifeEventsIcon = document.createElement('i')
                    lifeEventsIcon.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTA0VDEyOjQ4OjUyKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wNFQxMjo1MDowNSswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wNFQxMjo1MDowNSswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDM4YjU5Yi0wMjMyLTIzNDctOTlhNy03ZTIxY2U0MzAxNTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZmQzOGI1OWItMDIzMi0yMzQ3LTk5YTctN2UyMWNlNDMwMTUyIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZmQzOGI1OWItMDIzMi0yMzQ3LTk5YTctN2UyMWNlNDMwMTUyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZDM4YjU5Yi0wMjMyLTIzNDctOTlhNy03ZTIxY2U0MzAxNTIiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDRUMTI6NDg6NTIrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Trt5rAAAB4UlEQVRIx71WS0sCURSe3xH9pn6IixZjCAXVplU4Gx9UFhRtFJJWwSyCFm2CZtSMzAehgUEQFtr08DHT6X4XNNO592qEBz44znnde15XTZNQJJSfN/RMIBy0TCNolQ3ddjgYz78xGXS0aSkays4ZQXvX0C0vrFskA3SgC5uJnBt6doGdzlE5HgOzga3c+ZK9GA7a3tTOB0FsDz4kJ5c7z188cSiDjN4E+VOl5dAoUK/rcYBXpetXTVAk1fULVoP6VLAbynTB51Ar+ndLZDlL+5s3ZCar1O14gwC4hZmscRl0RN3FW5j3+YgwsXFNtVKLWs9tan+6JCLIoANd2IwHyQQ0DMyo4ICdbPjEKoIubHxqYWp8Kn2umN4p07vTUzqHztF2WVAHq6xh9EWFSsVK9NbqCp07TJaKFSVTbjvSAMBD1REGgEy+RhBAkCIgvpYjp9kR34DJ4qs5SauyFPkVuY9ktEiu+zVwiI5pvfwEhAw6koEzfdu0j+O9CnfUZI7PT+oUWclygEcwEHTEKWJtqhq0dKJCW+tX/Pdp+p4DPL5Bphy0SVcFyye1P1wO8BOvitFld3n2SNXb5hgwrR7LOQDeTwe2vstueF3X717prwRb33U9kwdnJk/mTB79//7b8g0Tjqra/4BZ4gAAAABJRU5ErkJggg==)';
                    lifeEventsIcon.style.backgroundPosition = "0px 0px";
                    lifeEventsIcon.style.display = "block";
                    lifeEventsIcon.style.position = "relative";
                    lifeEventsIcon.style.width = "24px";
                    lifeEventsIcon.style.height = "24px";

                    lifeEventsIcon.className = "LifeEventsIcon";

                    document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/about?section=year-overviews"] .IconContainer').append(lifeEventsIcon);

                }

            }

        }, 1000);

        setTimeout(() => {

            if (document.querySelector('.x7wzq59 .IconContainer')) {

                document.querySelectorAll('.x7wzq59 .x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.xjkvuk6.x1cnzs8').forEach(element => {

                    element.setAttribute("style", "padding-top: 12px;");

                });

            }

        }, 1000);

        setTimeout(() => {

            if (document.querySelector('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i [href*="/friends"] .IconContainer')) {

                document.querySelector('.xzueoph.x1k70j0n .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x1lkfr7t.x1lbecb7.xo1l8bm.xi81zsa.x1yc453h .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84').style.left = "96px";

            }

        }, 1000);

    }

    function renameProfilePageElements() {

        if (!document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Liked"]')
            && !document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 [aria-label="Like"]')
            && !document.querySelector('[aria-label="Professional dashboard"]')
            && !document.querySelector('[aria-label="temp heading"]')) {

            setTimeout(() => {

                if(document.querySelector('[href*="/followers/"]')) {

                    setTimeout(() => {

                        document.querySelectorAll('ul a').forEach(link => {

                            link.textContent = link.textContent.replace(/(\d[\d,]*)\s*followers/i, 'Followed by $1 people');

                        });

                    }, 1000);

                }

                $('.x78zum5.x15sbx0n.x5oxk1f.x1jxijyj.xym1h4x.xuy2c7u.x1ltux0g.xc9uqle .x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1sur9pj.xkrqix3.xi81zsa.x1s688f:contains(friends)').html(function(index, oldhtml) {
                    return oldhtml.replace('friends', '');

                });

                document.querySelectorAll('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1j85h84').forEach((span) => {

                    span.textContent = span.textContent.replace(/friends/g, "");

                });

            }, 500);

        }

    }

    function createPageSidebar() {

        if (!document.querySelector('.LeftColumnContainer')
            && document.querySelector('.x6s0dn4.x78zum5.xdt5ytf.x193iq5w')
            && document.querySelector('[href*="/friends_likes/"]')
            || document.querySelector('[aria-label="Professional dashboard"]')) {

            setTimeout(() => {

                let div = document.createElement('div');
                let container = document.querySelector('.x6s0dn4.x78zum5.xdt5ytf.x193iq5w')
                div.className = "LeftColumnContainer";
                container.insertBefore(div, container.children[0]);
                let style = document.createElement('style');
                style.innerHTML = `
                    .LeftColumnContainer {
                        width: 180px;
                        height: 100%;
                        padding-left: 8px;
                        padding-top: 12px;
                        display: block;
                        position: fixed;
                        background: transparent;
                        top: 27px;
                        transform: translate(-696px, 5px);
                        z-index: 1;

                    }

                `;

                document.head.appendChild(style);

                let div2 = document.createElement('div');
                div2.className = "PageSidebar";
                document.querySelector('.LeftColumnContainer').prepend(div2);
                let style2 = document.createElement('style');
                style2.innerHTML = `
                    .PageSidebar {
                        width: 180px;
                        height: fit-content;
                        display: block;
                        position: fixed;
                        background: transparent;
                        padding: 12px 0px;

                    }

                `;

                document.head.appendChild(style2);

                let div3 = document.createElement('div');
                div3.className = "SidebarButtonContainer";
                document.querySelector('.PageSidebar').append(div3);
                let style3 = document.createElement('style');
                style3.innerHTML = `
                    .SidebarButtonContainer {
                        width: 180px;
                        height: fit-content;
                        display: block;
                        background: transparent;
                        position: relative;
                        left: 4px;

                    }

                `;

                document.head.appendChild(style3);

            }, 1000);

        }

    }

    function createContainerForReviews() {

        const leftColumn = document.querySelector('.LeftColumnContainer');
        const targetElement = document.querySelector('.x9f619.x193iq5w.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9.x1xwk8fm .x9f619.x1ja2u2z.x2lah0s.x1n2onr6.x1qjc9v5.x78zum5.x1q0g3np.x1a02dak.xl56j7k.x9otpla.x1n0m28w.x1wsgfga.xp7jhwk');
        const sortButton = document.querySelector('[aria-label="Sort"]');

        if (!leftColumn || !targetElement || sortButton) {
            setTimeout(createContainerForReviews, 1000);
            return;

        }

        if (document.querySelector('.ContainerForReviews')) {
            return;

        }

        let div4 = document.createElement('div');
        div4.className = "ContainerForReviews";
        document.querySelector('.x9f619.x193iq5w.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9.x1xwk8fm .x9f619.x1ja2u2z.x2lah0s.x1n2onr6.x1qjc9v5.x78zum5.x1q0g3np.x1a02dak.xl56j7k.x9otpla.x1n0m28w.x1wsgfga.xp7jhwk').prepend(div4);
        let style4 = document.createElement('style');
        style4.innerHTML = `
            .ContainerForReviews {
                width: 308px;
                height: 100%;
                display: block;
                position: sticky;
                transform: translate(-179px, 8px);
                top: 102px;

            }

        `;

        document.head.appendChild(style4);

    }

    function createCommunityContainer() {

        if (!document.querySelector('.CommunityContainer')
            && document.querySelector('.LeftColumnContainer')
            && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59')) {

            let div = document.createElement('div');
            let container = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59')
            div.className = "CommunityContainer";
            container.insertBefore(div, container.children[0]);
            let style = document.createElement('style');
            style.innerHTML = `
                .CommunityContainer {
                    width: 310px;
                    height: auto;
                    display: block;
                    margin-bottom: 10px;
                    margin-top: -1px;
                    margin-left: -1px;

                }

            `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            div2.className = "CommunityTab";
            document.querySelector('.CommunityContainer').append(div2);
            let style2 = document.createElement('style');
            style2.innerHTML = `
                .CommunityTab {
                    background: #fff;
                    border: 1px solid #dddfe2;
                    border-radius: 3px;
                    height: auto;
                    display: block;
                    position: relative;

                }

            `;

            document.head.appendChild(style2);

            let div3 = document.createElement('div');
            div3.className = "CommunityTextWrapper";
            document.querySelector('.CommunityTab').append(div3);
            let style3 = document.createElement('style');
            style3.innerHTML = `
                .CommunityTextWrapper {
                    background: transparent;
                    position: relative;
                    height: 16px;
                    padding: 12px 0px;
                    overflow: hidden;

                }

            `;

            document.head.appendChild(style3);

            let span = document.createElement('span');
            span.className = "CommunityText";
            span.innerText = "Community"
            document.querySelector('.CommunityTextWrapper').append(span);
            let style4 = document.createElement('style');
            style4.innerHTML = `
                .CommunityText {
                    font-size: 14px;
                    font-weight: bold;
                    margin-left: 12px;

                }

            `;

            document.head.appendChild(style4);

            let div5 = document.createElement('div');
            div5.className = "LikeWrapper";
            document.querySelector('.CommunityTab').append(div5);
            let style5 = document.createElement('style');
            style5.innerHTML = `
                .LikeWrapper {
                    padding-bottom: 4px;
                    padding-top: 4px;
                    padding-right: 12px;
                    padding-left: 12px;
                    height: 20px;

                }

            `;

            document.head.appendChild(style5);

            let div6 = document.createElement('div');
            div6.className = "FollowWrapper";
            document.querySelector('.CommunityTab').append(div6);
            let style6 = document.createElement('style');
            style6.innerHTML = `
                .FollowWrapper {
                    padding-bottom: 4px;
                    padding-top: 4px;
                    padding-right: 12px;
                    padding-left: 12px;
                    height: 20px;

                }

            `;

            document.head.appendChild(style6);

            let img = new Image();
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAKlBMVEVMaXGQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJxHoMRvAAAADXRSTlMA+t5o4SFJt5gSLuYG2tR0cwAAAGNJREFUGFdjYMAEkwOQOLU6yJxrCDbP3ssIDsddJBnbu5JwNpfs3QY4Z9JdEHAFspjuKvSCOSAzeO9e2AvmXINwwOy7UsgcqDJZuAFwTgEyxwGZk4DMMYBwakHsKwEQFzBQAADIelM8LpGB7gAAAABJRU5ErkJggg==';
            img.style.backgroundPosition = "0px 0px";
            img.style.position = "relative";
            img.style.width = "16px";
            img.style.height = "16px";

            img.id = "LikeIcon";

            document.querySelector('.LikeWrapper').append(img);

            let img2 = new Image();
            img2.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEVMaXGQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJyQlJxriGMlAAAAEXRSTlMA8AjarOTBLm76gRqyWEeYzqjHFOsAAACYSURBVHherZFLDsMgDAULGGzn02Tuf9nKoi1VwzJvB+PHWOJxb7YqpjNApFi+gEaEZBeiJgmgTR7MVoD0nKkWB58SrX+kJenHtUBaBwA49UPaABsRC6IONogeDixBFkj519venVyIiZEs4OExKN9xDXKChN9B3yC5da/HqjL0wB7Ldf8OMkDtNy2aQ3LUKmFp1fq/RfHGvABvKwe8Rh49UQAAAABJRU5ErkJggg==';
            img2.style.backgroundPosition = "0px 0px";
            img2.style.position = "relative";
            img2.style.width = "16px";
            img2.style.height = "16px";

            img2.id = "FollowIcon";

            document.querySelector('.FollowWrapper').append(img2);

        }

    }

    function movePageElements() {

        if (document.querySelector('.LeftColumnContainer')
            && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6 .x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz')) {

            $('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6 .x1itg65n.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.x1ja2u2z.x1a2a7pz').detach().appendTo('.SidebarButtonContainer');

            $('.x78zum5.xdt5ytf.x1wsgfga.x9otpla:first').detach().prependTo('.PageSidebar:first');

            $('.x15sbx0n.x1xy773u.x390vds.x13bxmoy.x14xzxk9.xmpot0u.xs6kywh.x5wy4b0:first').detach().prependTo('.PageSidebar:first');

            $('.xxi82k7.xyihs7y.xq6rjws.x1e4dcdm.x17wtha7.xwrhaq0.xs6kywh.xwvxrgu:first').detach().prependTo('.PageSidebar:first');

            $('.x7wzq59 div > div:nth-child(2) .x1yztbdb').detach().prependTo('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv');

            $('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv .x1yztbdb .x9f619.x1n2onr6.x1ja2u2z.x2lah0s.x193iq5w.xeuugli.xqcrz7y.x78zum5.xdt5ytf.xl56j7k.x13fj5qh:first').detach().appendTo('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv .x1yztbdb .xieb3on');

            setTimeout(() => {

                $('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59 footer').detach().appendTo('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59');

            }, 1500);

            if (document.querySelector('.LeftColumnContainer')
                && document.querySelector('.x9f619.x193iq5w.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9.x1xwk8fm .x1yztbdb')
                && document.querySelector('.ContainerForReviews')
                && !document.querySelector('[aria-label="See recommendations"]')
                && !document.querySelector('[aria-label="See Recommendations"]')) {

                $('.x9f619.x193iq5w.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9.x1xwk8fm .x1yztbdb:first').detach().appendTo('.ContainerForReviews');

            }

            if (document.querySelector('.LeftColumnContainer')
                && document.querySelector('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0')
                && !document.querySelector('[aria-label="See recommendations"]')
                && !document.querySelector('[aria-label="See Recommendations"]')) {

                $('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy').detach().prependTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0');

                $('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy [aria-label="Message"]').detach().appendTo('.x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0');

            } else {

                $('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy').detach().prependTo('.x6s0dn4.x78zum5.x9wm9x2.xs9i9mj.x12k03ys.x1fst9g5.x1wwn1hn');

                $('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy [aria-label="Message"]').appendTo('.x6s0dn4.x78zum5.x9wm9x2.xs9i9mj.x12k03ys.x1fst9g5.x1wwn1hn');

                $('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy [aria-label="Professional dashboard"]').detach().appendTo('.x6s0dn4.x78zum5.x9wm9x2.xs9i9mj.x12k03ys.x1fst9g5.x1wwn1hn');

            }

            $('[aria-label="Profile settings see more options"]:first').detach().appendTo('.x78zum5.x1a02dak.x165d6jo.x1lxpwgx.x9otpla.x1ke80iy');

            $('[aria-label="See Options"]:first').detach().appendTo('.x78zum5.x1a02dak.x139jcc6.xcud41i.x9otpla.x1ke80iy');

            if (document.querySelector('[aria-label="Message"]')) {

                let messageElement = document.querySelector('[aria-label="Message"] .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft');

                if (messageElement && messageElement.textContent.trim() === 'Message') {
                    messageElement.textContent = 'Send Message';

                }

            }

            $('.x1i10hfl.xjbqb8w.x1ejq31n.x18oe1m7.x1sy0etr.xstzfhl.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xt0psk2.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f:contains(likes)').html(function(index, oldhtml) {
                return oldhtml.replace('likes', 'people like this');

            });

            $('.x1i10hfl.xjbqb8w.x1ejq31n.x18oe1m7.x1sy0etr.xstzfhl.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1ypdohk.xt0psk2.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xi81zsa.x1s688f:contains(followers)').html(function(index, oldhtml) {
                return oldhtml.replace('followers', 'people follow this');

            });

            $('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i:contains(Intro)').html(function(index, oldhtml) {
                return oldhtml.replace('Intro', 'About');

            });

        }

    }

    function moveLikesAndFollows() {

        if (document.querySelector('.LeftColumnContainer')
            && document.querySelector('.CommunityContainer')) {

            let likeLink = document.querySelector('[href*="/friends_likes/"], [href*="sk=friends_likes"]');
            let followLink = document.querySelector('[href*="/followers/"], [href*="sk=followers"]');

            let likeWrapper = document.querySelector('.LikeWrapper');
            let followWrapper = document.querySelector('.FollowWrapper');

            if (likeLink && followLink && likeWrapper && followWrapper) {

                if (!likeWrapper.querySelector('a')) likeWrapper.appendChild(likeLink.cloneNode(true));
                if (!followWrapper.querySelector('a')) followWrapper.appendChild(followLink.cloneNode(true));

            } else {

                setTimeout(moveLikesAndFollows, 500);

            }

        }

    }

    function createContainerForPageTransparency() {

        if (document.querySelector('.LeftColumnContainer')
            && !document.querySelector('.PageTransparencyWrapper')
            && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59')) {

            setTimeout(() => {

                let div = document.createElement('div');
                let style = document.createElement('style');
                div.className = "PageTransparencyWrapper"
                document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59').append(div);
                style.innerHTML = `
                    .PageTransparencyWrapper {
                        display: block;
                        position: relative;
                        width: 310px;
                        height: auto;
                        margin-bottom: 10px;
                        margin-top: -1px;
                        margin-left: -1px;

                    }

                `;

                document.head.appendChild(style);

                let div2 = document.createElement('div');
                let style2 = document.createElement('style');
                div2.className = "PageTransparencyContainer"
                document.querySelector('.PageTransparencyWrapper').append(div2);
                style2.innerHTML = `
                    .PageTransparencyContainer {
                        display: block;
                        position: relative;
                        height: auto;
                        background: #fff;
                        border: 1px solid #dddfe2;
                        border-radius: 3px;

                    }

                `;

                document.head.appendChild(style2);

                let div3 = document.createElement('div');
                let style3 = document.createElement('style');
                div3.className = "PageTransparencyContentWrapper"
                document.querySelector('.PageTransparencyContainer').append(div3);
                style3.innerHTML = `
                    .PageTransparencyContentWrapper {
                        padding: 10px 0 9px 0;
                        margin-left: 12px;
                        align-items: center;
                        display: flex;
                        justify-content: flex-start;

                    }

                `;

                document.head.appendChild(style3);

                let div4 = document.createElement('div');
                let style4 = document.createElement('style');
                div4.className = "PageTransparencyTextWrapper"
                document.querySelector('.PageTransparencyContainer').append(div4);
                style4.innerHTML = `
                    .PageTransparencyTextWrapper {
                        padding-bottom: 12px;
                        padding-left: 12px;
                        padding-right: 12px;
                        display: block;

                    }

                `;

                document.head.appendChild(style4);

                let i = document.createElement('i');
                i.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI1LTAzLTAxVDE3OjEzOjIxKzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNS0wMy0wMVQxNzoxNDozMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNS0wMy0wMVQxNzoxNDozMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMjE4YTVkZC0zYmQ3LTU5NDItYjYwYi0zNGQyNDY4MmM3NjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZTIxOGE1ZGQtM2JkNy01OTQyLWI2MGItMzRkMjQ2ODJjNzYxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTIxOGE1ZGQtM2JkNy01OTQyLWI2MGItMzRkMjQ2ODJjNzYxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMjE4YTVkZC0zYmQ3LTU5NDItYjYwYi0zNGQyNDY4MmM3NjEiIHN0RXZ0OndoZW49IjIwMjUtMDMtMDFUMTc6MTM6MjErMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7KKTZdAAABPklEQVRIDWP49/c/Ay7slL5JCoizgHg7EN8E4s9QfBMqBpKTwmcGLoMlgHg2EP8F4v8E8F+oWgmiLAAq9IG68j+JGKTHB68FQAU5RLoan29ysFoAdTklhiNb4oNiATTMP1PBcOTgkkC2YDaJBnwF4mYg9gBiPSA2AWIXNDWzwRYAGTIkBs17IFbAkfrQg0qKAZqWSXF9Dp58g642iwGaYUixQAvJQBEgngnEW3GYs50BmitJsYAFyYIiAmpvMpCaetCCpJFQaqK1BV+JCiJ8hRmSZTFY9D4kKpKJtKAGi96tRCVTIi2Yi0VvEbEZrRGG0Qx1QJK7jabnNzijkVpUkBDJi8kq7Ii04CNKYUdKcU2EBT8ximtSKhwCFnwHlbAUVZl4LADpcaK40sdiASi1LCa60ifUbEGTN8BlMAwDAPOZfO3pGzzhAAAAAElFTkSuQmCC)";
                i.style.backgroundPosition = "0px 0px";
                i.style.display = "flex";
                i.style.position = "relative";
                i.style.width = "24px";
                i.style.height = "24px";
                i.style.marginRight = "8px";

                i.id = "FacebookIcon";

                document.querySelector('.PageTransparencyContentWrapper').append(i);

                let span = document.createElement('div');
                let style5 = document.createElement('style');
                span.className = "PageTransparencyText";
                span.innerText = "Page Transparency";
                document.querySelector('.PageTransparencyContentWrapper').append(span);
                style5.innerHTML = `
                    .PageTransparencyText {
                        font-size: 14px;
                        font-weight: bold;
                        color: #000;
                        flex-grow: 1;

                    }

                `;

                document.head.appendChild(style5);

                let span2 = document.createElement('div');
                let style6 = document.createElement('style');
                span2.className = "PageTransparencyInformation";
                span2.innerText = "Facebook is showing information to help you better understand the purpose of a Page. See actions taken by the people who manage and post content.";
                document.querySelector('.PageTransparencyTextWrapper').append(span2);
                style6.innerHTML = `
                    .PageTransparencyInformation {
                        font-size: 11px;
                        color: #606770;

                    }

                `;

                document.head.appendChild(style6);

                let btn = document.createElement('a');
                let style7 = document.createElement('style');
                btn.className = "SeeMore";
                btn.innerText = "See More";
                document.querySelector('.PageTransparencyContentWrapper').append(btn);
                style7.innerHTML = `
                    .SeeMore {
                        display: block;
                        float: right;
                        line-height: 13px;
                        margin: 0 12px;
                        color: #385898;
                        font-size: 12px;
                        cursor: pointer;
                    }

                `;

                document.head.appendChild(style7);

                let originalbtn = document.querySelector('.xieb3on .x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xkrqix3.x1sur9pj.xzsf02u.x1s688f');

                btn.addEventListener("click", function() {
                    originalbtn.click();

                });

            }, 1000);

        }

    }

    function modifyPageCss() {

        if (document.querySelector('.LeftColumnContainer')) {

            setTimeout(() => {

                if (!document.querySelector('.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad [role="navigation"]')
                    && !document.querySelector('[role="region"]')
                    && document.querySelector('.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6')) {

                    let element = document.querySelector('.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6');

                    if (element) {
                        element.style.marginLeft = "351px";

                    }

                }

            }, 500);

            let element = document.querySelector('.x78zum5.xdt5ytf.x1t2pt76 .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws');

            if (element) {
                element.style.setProperty('max-width', '308px', 'important');
                element.style.setProperty('right', '183px', 'important');
                element.style.setProperty('order', '1', 'important');

            }

            let element2 = document.querySelector('.x78zum5.xdt5ytf.x1t2pt76 .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv');

            if (element2) {
                element2.style.setProperty('max-width', '500px', 'important');
                element2.style.setProperty('right', '179px', 'important');

            }

            let element3 = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z .x78zum5.xdt5ytf.x1t2pt76 .x6ikm8r.x10wlt62.x1n2onr6.xh8yej3.xde0f50.x15x8krk.x1qq2va3.x1qpcq7s')

            if (element3) {
                element3.style.setProperty('max-width', '820px', 'important');
                element3.style.setProperty('right', '181px', 'important');
                element3.style.setProperty('height', '303px', 'important');

            }

            let element4 = document.querySelector('[aria-label="Message"]')

            if (element4) {
                element4.style.setProperty('width', '288px');
                element4.style.setProperty('left', '3px');

            }

            let element5 = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z .x78zum5.xdt5ytf.x1t2pt76 .x1y5dvz6.x1y5dvz6');

            if (element5) {
                element5.style.setProperty('max-width', '820px', 'important');
                element5.style.setProperty('right', '181px', 'important');
                element5.style.setProperty('height', '53px', 'important');

            }

            let element6 = document.querySelector('[aria-label="Professional dashboard"]')

            if (element6) {
                element6.style.width = "288px";

            }

            let element7 = document.querySelector('.x78zum5.x1a02dak.x139jcc6.xcud41i.x9otpla.x1ke80iy');

            if (element7) {
                element7.style.setProperty('position','relative');
                element7.style.setProperty('bottom', '1px', 'important');
                element7.style.setProperty('right', '5px');

            }

            let element9 = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.x1iyjqo2.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x1l7klhg.x193iq5w');

            if (element9) {
                element9.style.setProperty('max-width', '820px', 'important');
                element9.style.setProperty('right', '181px', 'important');

            }

            let element10 = document.querySelector('.x7wzq59 footer');

            if (element10) {
                element10.style.setProperty('width', '284px');
                element10.style.setProperty('padding', '0px 12px');
                element10.style.setProperty('position', 'relative');
                element10.style.setProperty('margin-top', '16px');

            }

            let element11 = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1emribx.x1e56ztr.x1i64zmx.xnp8db0.x1d1medc.x7ep2pv.x1xzczws .x7wzq59');

            if (element11) {
                element11.style.setProperty('top', '106px');

            }

            let elements = document.querySelectorAll('.x9f619.x1n2onr6.x1ja2u2z .x78zum5.xdt5ytf.x1t2pt76 .x1y5dvz6.x1y5dvz6, .x9f619.x1n2onr6.x1ja2u2z .x78zum5.xdt5ytf.x1t2pt76 .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.x1swvt13.x1pi30zi.xqdwrps.x16i7wwg.x1y5dvz6, .xyamay9.xcaxvl9.x12tpw83.x1srbbgq.xkxa9zd');

            if (elements.length > 0) {
                elements.forEach(el => {

                    el.style.setProperty('max-width', '820px', 'important');
                    el.style.setProperty('right', '181px', 'important');

                });

            }

            let elements2 = document.querySelectorAll('[aria-label="Message"] .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft, [aria-label="Professional dashboard"] .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft')

            if (elements2.length > 0) {
                elements2.forEach(el => {
                    el.style.setProperty('font-size', '14px', 'important');
                    el.style.setProperty('font-weight', 'normal', 'important');

                });

            }

            let elements3 = document.querySelectorAll('.x78zum5.x1a02dak.x139jcc6.xcud41i.x9otpla.x1ke80iy .xw3qccf');

            if (elements3.length > 0) {
                elements3.forEach(el => {
                    el.style.setProperty('margin-right', '-5px', 'important');

                });

            }

            let elements4 = document.querySelectorAll('.x7wzq59 .x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x1120s5i, .x7wzq59 .x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.x1sur9pj.xkrqix3.x1xlr1w8');

            if (elements4.length > 0) {
                elements4.forEach(el => {
                    el.style.setProperty('right', '0px', 'important');
                    el.style.setProperty('font-size', '14px', 'important');
                    el.style.setProperty('font-weight', 'bold', 'important');
                    el.style.setProperty('margin-left', '-2px');
                    el.style.setProperty('overflow', 'visible');
                    el.style.setProperty('margin-bottom', '6px');

                });

            }

            let elements5 = document.querySelectorAll('[aria-label="temp heading"] .x6s0dn4.x78zum5.x9wm9x2.xs9i9mj.x12k03ys.x1fst9g5.x1wwn1hn, .x78zum5.xdt5ytf.x1t2pt76 .x6s0dn4.x78zum5.xvrxa7q.x9w375v.xxfedj9.x1roke11.x1es02x0');

            if (elements5.length > 0) {
                elements5.forEach(el => {
                    el.style.setProperty('height', '53px', 'important');

                });

            }

            let elements6 = document.querySelectorAll('[style*="min-width: 280px"], [style*="min-width: 278px"]')

            if (elements6.length > 0) {
                elements6.forEach(el => {
                    el.style.setProperty('min-width', '196px', 'important');

                });

            }

            let elements7 = document.querySelectorAll('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1emribx.x1e56ztr.x1i64zmx.x19h7ccj.xu9j1y6.x7ep2pv .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xtoi2st.x3x7a5m.x1603h9y.x1u7k74.x1xlr1w8.xzsf02u.x1yc453h')

            if (elements7.length > 0) {
                elements7.forEach(el => {
                    el.style.setProperty('font-size', '14px');

                });

            }

            let elements8 = document.querySelectorAll('.xyamay9.xqmdsaz.x1gan7if.x1swvt13 .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x676frb.x1lkfr7t.x1lbecb7.x1s688f.xzsf02u')

            if (elements8.length > 0) {
                elements8.forEach(el => {
                    el.style.setProperty('font-size', '14px');
                    el.style.setProperty('color', '#999');

                });

            }

        }

    }

    function createPageTopBar() {

        if (!document.querySelector('.PageTopbar')
            && document.querySelector('.x9f619.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.x78zum5.x1iyjqo2.x1t2pt76.x1n2onr6.x1ja2u2z.x1h6rjhl')
            && document.querySelector('[aria-label="temp heading"]')) {

            let div = document.createElement('div');
            div.className = "PageTopbar";
            document.querySelector('.x9f619.x2lah0s.x1nhvcw1.x1qjc9v5.xozqiw3.x1q0g3np.x78zum5.x1iyjqo2.x1t2pt76.x1n2onr6.x1ja2u2z.x1h6rjhl').append(div);
            let style = document.createElement('style');
            style.innerHTML = `
                .PageTopbar {
                    background: #fff;
                    height: 43px;
                    width: 100%;
                    display: flex;
                    position: fixed;
                    justify-content: center;

                }

                `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            div2.className = "PageTopbarWrapper";
            document.querySelector('.PageTopbar').append(div2);
            let style2 = document.createElement('style');
            style2.innerHTML = `
                .PageTopbarWrapper {
                    display: flex;
                    position: absolute;
                    height: 43px;
                    width: 1000px;
                    transform: translate(-112px, 0px);

                }

                `;

            document.head.appendChild(style2);

            document.querySelector('[role="main"]').setAttribute('style', 'margin-top: 43px');
            document.querySelector('.x9f619.x1ja2u2z.x78zum5.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1ve1bff.xvo6coq.x2lah0s').setAttribute('style', 'display: none');

            setTimeout(() => {

                if (document.querySelector('.LeftColumnContainer')) {

                    document.querySelector('.LeftColumnContainer').setAttribute('style', 'margin-top: 48px');

                }

            }, 500);

            $('[aria-label="temp heading"]:first-child .x6s0dn4.x1q0q8m5.x1qhh985.x18b5jzi.x10w94by.x1t7ytsu.x14e42zd.x13fuv20.x972fbf.x9f619.x78zum5.x1q0g3np.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x14z9mp.x1lziwak.xdj266r.xeuugli.x18d9i69.xf159sx.xmzvs34.xexx8yu.x1n2onr6.x1ja2u2z.x1gg8mnh').detach().appendTo('.PageTopbarWrapper:first');

        }

    }

    function modifyEventsLayout() {

        if(document.querySelector('[aria-label="Event Permalink"]')
           && !document.querySelector('.EventsLeftColumnContainer')
           && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6')
           && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws')
           && document.querySelector('.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xyri2b.x1c1uobl.x1l90r2v.xyamay9 [role="listitem"]')) {

            let div = document.createElement('div');
            let style = document.createElement('style');
            div.className = "EventsLeftColumnContainer";
            document.querySelector('[aria-label="Event Permalink"] .x6s0dn4.x78zum5.xdt5ytf.x193iq5w').prepend(div);
            style.innerHTML = `
                .EventsLeftColumnContainer {
                    width: 180px;
                    height: 100%;
                    padding-left: 8px;
                    padding-top: 12px;
                    display: block;
                    position: fixed;
                    background: transparent;
                    top: 27px;
                    transform: translate(-696px, 5px);
                    z-index: 1;

                }

            `;

            document.head.appendChild(style);

            let div2 = document.createElement('div');
            div2.className = "EventsSidebar";
            document.querySelector('.EventsLeftColumnContainer').prepend(div2);
            let style2 = document.createElement('style');
            style2.innerHTML = `
                .EventsSidebar {
                    width: 180px;
                    height: fit-content;
                    display: block;
                    position: fixed;
                    background: transparent;
                    padding: 12px 0px;

                }

            `;

            document.head.appendChild(style2);

            let div3 = document.createElement('div');
            div3.className = "EventsSidebarButtonsWrapper";
            document.querySelector('.EventsSidebar').append(div3);
            let style3 = document.createElement('style');
            style3.innerHTML = `
                .EventsSidebarButtonsWrapper {
                    width: 180px;
                    height: fit-content;
                    display: block;
                    background: transparent;
                    position: relative;
                    right: 5px;

                }

            `;

            document.head.appendChild(style3);

            let span = document.createElement('span');
            span.className = "EventsTitle";
            span.textContent = "Events";
            document.querySelector('.EventsSidebar').prepend(span);
            let style4 = document.createElement('style');
            style4.innerHTML = `
                .EventsTitle {
                    display: block;
                    font-size: 20px;
                    font-weight: normal;
                    line-height: 24px;
                    margin-bottom: 16px;
                    margin-top: 0px;
                    color: rgb(29, 33, 41);

                }

            `;

            document.head.appendChild(style4);

            let img = document.createElement('img');
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA5LTE2VDA4OjQ0OjQ5KzA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wOS0xNlQwODo0NjowMyswNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wOS0xNlQwODo0NjowMyswNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4YWQ2OWMyYy1hNTdiLTg3NDktODZkOC0xOWFlOWMzNDA3YzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OGFkNjljMmMtYTU3Yi04NzQ5LTg2ZDgtMTlhZTljMzQwN2M2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OGFkNjljMmMtYTU3Yi04NzQ5LTg2ZDgtMTlhZTljMzQwN2M2Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YWQ2OWMyYy1hNTdiLTg3NDktODZkOC0xOWFlOWMzNDA3YzYiIHN0RXZ0OndoZW49IjIwMjQtMDktMTZUMDg6NDQ6NDkrMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4zEruMAAAAiUlEQVQ4EWP4//8/AzUxg09mIcOLvLofn7Pr/lOCQWaAzAIbiC75oX06QQOwqQEbWF7T/hVd4bVHz/AaiksNyCyQgf+p5UKQWVgNJBfDDaQWGDgDj546/4UYdUQZ+PDF2/8dPdP+U8VAmMtgmGpeXrd5x6iBg83Agc8poKKIGphmBn5Fzg0U4q8A6QmSLoGDQ10AAAAASUVORK5CYII=";
            img.style.backgroundPosition = "0px 0px";
            img.style.width = "20px";
            img.style.height = "20px";
            img.style.margin = "4px 12px 0px 0px";
            img.style.top = "3px";
            img.style.position = "relative";

            document.querySelector('.EventsTitle').prepend(img);

            let ul = document.createElement('ul');
            ul.className = "EventsSidebarButtonContainer";
            document.querySelector('.EventsSidebarButtonsWrapper').append(ul);
            let style5 = document.createElement('style');
            style5.innerHTML = `
                .EventsSidebarButtonContainer {
                    width: 180px;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    overflow: visible;
                    position: relative;

                }

            `;

            document.head.appendChild(style5);

            const numberOfElements = 4;
            const className = 'EventsButton';

            const linkData = [
                { text: "Events", href: "https://www.facebook.com/events" },
                { text: "Calendar", href: "https://www.facebook.com/events/calendar" },
                { text: "Birthdays", href: "https://www.facebook.com/events/birthdays" },
                { text: "Past", href: "https://www.facebook.com/events/past/" }

            ];

            Array.from({ length: numberOfElements }).forEach((_, index) => {

                let li = document.createElement('div');
                li.style.display = "flex";
                li.style.position = "relative";
                li.style.width = "176px";
                li.style.height = "20px";
                li.style.bottom = "0px";
                li.style.marginBottom = "4px";
                li.style.padding = "5px 4px 5px 0px";

                li.classList.add(className);

                let a = document.createElement('a');
                a.textContent = linkData[index].text;
                a.href = linkData[index].href;
                a.style.textDecoration = "none";
                a.style.fontSize = "14px";
                a.style.color = "inherit";

                li.appendChild(a);

                document.querySelector('.EventsSidebarButtonContainer')?.append(li);

            });

            let div4 = document.createElement('div');
            div4.className = "EventsThirdColumnWrapper";
            document.querySelector('[aria-label="Event Permalink"] .x6s0dn4.x78zum5.xdt5ytf.x193iq5w').append(div4);
            let style6 = document.createElement('style');
            style6.innerHTML = `
                .EventsThirdColumnWrapper {
                    width: 323px;
                    height: 100%;
                    display: block;
                    position: fixed;
                    top: 35px;
                    transform: translate(73px, 10px);

                }

            `;

            document.head.appendChild(style6);

            let div5 = document.createElement('div');
            div5.className = "CurrentEventTitle";
            document.querySelector('[aria-label="Event Permalink"] .EventsSidebarButtonContainer').append(div5);
            let style7 = document.createElement('style');
            style7.innerHTML = `
                .CurrentEventTitle {
                    display: flex;
                    position: relative;
                    width: 160px;
                    bottom: 0px;
                    margin-bottom: 4px;
                    padding: 5px 4px 5px 14px;

                }

            `;

            document.head.appendChild(style7);

            let div6 = document.createElement('div');
            div6.className = "CurrentEventTitleBorder";
            document.querySelector('[aria-label="Event Permalink"] .CurrentEventTitle').append(div6);
            let style8 = document.createElement('style');
            style8.innerHTML = `
                .CurrentEventTitleBorder {
                    border-left: 2px solid rgb(64, 128, 255);
                    bottom: 6px;
                    display: block;
                    left: 4px;
                    position: absolute;
                    top: 6px;
                    z-index: 1;

                }

            `;

            document.head.appendChild(style8);

            let btn = document.createElement('button');
            btn.innerText = "Create Event";
            btn.style.display = "block";
            btn.style.position = "relative";
            btn.style.border = "1px solid rgb(66, 103, 178)";
            btn.style.background = "rgb(66, 103, 178)";
            btn.style.height = "22px";
            btn.style.padding = "0 8px";
            btn.style.marginTop = "16px";
            btn.style.boxSizing = "content-box";
            btn.style.borderRadius = "2px";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = "bold";
            btn.style.color = "rgb(255, 255, 255)";

            btn.className = "CreateEvent";

            document.querySelector('.EventsSidebarButtonContainer').append(btn);

            btn.addEventListener('click', (e) => {

                e.preventDefault();
                let newUrl = "https://www.facebook.com/events/create/";
                window.history.pushState({}, '', newUrl);

                window.dispatchEvent(new PopStateEvent('popstate'));

            });

            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = 'rgb(54, 88, 153)';

            });

            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = 'rgb(66, 103, 178)';

            });

            $('[aria-label="Event Permalink"] .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x6s0dn4.x78zum5.xng8ra.xh8yej3').detach().appendTo('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6:first');

            $('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xyri2b.x1c1uobl.x1l90r2v.xyamay9 [role="listitem"]').detach().appendTo('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xf7dkkf.xv54qhq.xqdwrps.x16i7wwg.x1y5dvz6:first');

            $('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.xnp8db0.x1d1medc.x7ep2pv.x1xzczws:first').detach().appendTo('[aria-label="Event Permalink"] .EventsThirdColumnWrapper');

            $('[aria-label="Event Permalink"] .x7wzq59 .html-div.xdj266r.x14z9mp.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1yztbdb:nth-child(2)').detach().prependTo('[aria-label="Event Permalink"] .x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.xjl7jj.x1xmf6yo.x1xegmmw.x1e56ztr.x13fj5qh.x19h7ccj.xu9j1y6.x7ep2pv');

            $('[aria-label="Event Permalink"] h1 span:first').clone().appendTo('[aria-label="Event Permalink"] .CurrentEventTitle');

        }

    }

    function appendChatSidebar() {

        if (document.querySelector('[role="complementary"]')
            && !document.querySelector('.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 [role="complementary"]')) {

            const element = document.querySelector('[role="complementary"]');

            document.querySelector('.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4').prepend(element);

            element.style.setProperty('position', 'fixed', 'important');
            element.style.setProperty('z-index', '1', 'important');
            element.style.setProperty('right', '0px', 'important');

        }

    }

    let isProcessing = false;

    function processMutations() {

        if (isProcessing) return;
        isProcessing = true;

        createThirdColumnWrapper();
        createSidebarWrapper();
        centerBlueBar();
        getUserName();
        createStoriesContainerAndMakeAdjustments();
        createBirthdaysContainer();
        createSponsoredContainer();
        createLanguageContainer();
        makeFurtherAdjustments();
        moveProfilePageElements();
        addTimelineAndRecentButtons();
        getId();
        createProfilePageButtons();
        createProfilePageIcons();
        renameProfilePageElements();
        createPageSidebar();
        createContainerForReviews();
        createCommunityContainer();
        movePageElements();
        modifyPageCss();
        moveLikesAndFollows();
        createContainerForPageTransparency()
        createPageTopBar();
        modifyEventsLayout();

        setTimeout(() => {
            isProcessing = false;

        }, 1000);

    }

    const observer = new MutationObserver(() => {
        if (!isProcessing) processMutations();

    });

    const config = { childList: true, subtree: true };
    const page = document.querySelector('.x9f619.x1n2onr6.x1ja2u2z');

    processMutations();
    observer.observe(page, config);

    GM_addStyle ( `

    div [class="SidebarWrapper"] div [class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck x1l7klhg x1iyjqo2 xs83m0k x2lwn1j xx8ngbg xwo3gff x1oyok0e x1odjw0f x1e4zzel x1n2onr6 xq1qtft"] div [class="x1iyjqo2"] {
        top: 5px;
        position: relative;

    }

    div [class="SidebarWrapper"] div [class="xb57i2i x1q594ok x5lxg6s x78zum5 xdt5ytf x6ikm8r x1ja2u2z x1pq812k x1rohswg xfk6m8 x1yqm8si xjx87ck x1l7klhg x1iyjqo2 xs83m0k x2lwn1j xx8ngbg xwo3gff x1oyok0e x1odjw0f x1e4zzel x1n2onr6 xq1qtft"] div [class="x1iyjqo2"] ul:first-child li:first-child {
        bottom: 10px;
        position: relative;

    }

    div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xg01cxk xexx8yu x150jy0e x18d9i69 x1e558r4 x47corl x10l6tqk x13vifvy x1n4smgl x1d8287x x19991ni xwji4o3 x1kky2od"],
        div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xexx8yu x150jy0e x18d9i69 x1e558r4 x47corl x10l6tqk x13vifvy x1n4smgl x19991ni xwji4o3 x1kky2od x1hc1fzr x1p6kkr5"],
            div [class="SidebarWrapper"] div [class="x14nfmen x1s85apg x5yr21d xds687c xg01cxk x10l6tqk x13vifvy x1wsgiic x19991ni xwji4o3 x1kky2od x1sd63oq"] {
                display: none!important;

            }

    a[class="AddToStory"]:hover {
        text-decoration: underline;

    }

    div [class="WrapperForAds"] img {
        max-width: 284px;
        width: 284px;
        height: 149px;
        right: 16px;
        border-radius: 0px;
        position: relative;
        object-fit: contain;
        border: none;

    }

    div [class="SponsoredContainer"] div [class="html-div x78zum5 x6umtig x12wdn4z xaqea5y x1f0uuog x1i5p2am x1whfx0g xr2y4jy x1ihp6rs x1ypdohk xjb2p0i xdj266r x1xegmmw xat24cr x13fj5qh x1yc453h x1y1aw1k xf159sx xwib8y2 xmzvs34 x1164lod x8du52y"] {
        width: 252px;

    }

    div [class="SponsoredContainer"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xk50ysn xzsf02u x1yc453h"] {
        width: 284px!important;
        word-wrap: break-word;

    }

    *[class*="fb-dark-mode"] div [class="StoriesContainer"],
        *[class*="fb-dark-mode"] div [class="SponsoredContainer"],
            *[class*="fb-dark-mode"] div [class="LanguageContainer"] {
                background: #252728!important;
                border: 1px solid #222!important;

            }

    *[class*="fb-dark-mode"] button[class="LanguageButton"] {
        background: #4B4C4F!important;
        border: 1px solid #393939!important;

    }

    *[class*="fb-dark-mode"] div [class="StoryButton"] {
        background: #242424!important;
        border: 1px solid #393939!important;

    }

    *[class*="fb-dark-mode"] button[class="LanguageButton"] i[class="MoreLanguages"] {
        filter: brightness(0) invert(1);

    }

    *[class*="fb-dark-mode"] div [class="StoriesContainer"] > span[class="StoriesText"],
        *[class*="fb-dark-mode"] div [class="SponsoredContainer"] > span[class="SponsoredText"] {
            color: #B0B3B8!important;

        }

    div [class="LanguageContainer"] button:hover {
        text-decoration: underline;

    }

    button[class="LanguageButton"]:active,
        div [class="StoryButton"]:active {
            background: rgba(0, 0, 0, 0.05);
            transform: scale(0.95);

        }

    div [class="x2lah0s xyamay9 xv54qhq x1l90r2v xf7dkkf"] {
        padding: 0 12px;
        margin-top: 12px;

    }

    div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np xykv574 xbmpl8g x4cne27 xifccgj"] {
        right: 25px;

    }

    div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd"] div [class="x6s0dn4 xi81zsa x78zum5 x6prxxf x13a6bvl xvq8zen xdj266r xat24cr x1d52u69 xktsk01 x889kno x1a8lsjc xkhd6sd x4uap5 x80vd3b x1q0q8m5 xso031l"] {
        width: 500px;

    }

    *[class*="fb-light-mode"] div [class="SidebarWrapper"] div [class="x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]:hover {
        background-color: #f6f7f9;
        border: 1px solid #dddfe2;
        border-radius: 2px;
        left: -1px;
        right: -1px;
        transition: 400ms cubic-bezier(.08,.52,.52,1) background-color, 400ms cubic-bezier(.08,.52,.52,1) border-color, 400ms cubic-bezier(.08,.52,.52,1) opacity;
    }

    *[class*="fb-light-mode"] div [class="SidebarWrapper"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none;

    }

    div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x9f619 xdt5ytf xh8yej3 x1lliihq x1n2onr6 xhq5o37 x1qxoq08 x1cpjm7i x1ryaae9 x124lp2h x1hmns74 x1mhyesy x1y3wzot"],
        div [class="html-div xe8uvvx xdj266r x11i5rnm x1mh8g0r xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x1s65kcs x1wsgfga x1pi30zi x1swvt13"] {
            background: none!important;

        }

    div [class="html-div xe8uvvx xdj266r x11i5rnm x1mh8g0r xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x1s65kcs x1wsgfga x1pi30zi x1swvt13"] {
        bottom: 44px;
        position: relative;

    }

    .xmy5rp.xmy5rp {
        display: none;

    }

    div [class="x1jx94hy x30kzoy x9jhf4c x9f619 x78zum5 xdt5ytf x1iyjqo2 x1iofjn4 x1y1aw1k x1sxyh0 xwib8y2 xurb0ha"] {
        width: 446px!important;
        position: relative;
        bottom: 24px;
        left: 26px!important;

    }

    a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x1q0g3np x87ps6o x1lku1pv x1rg5ohu x1a2a7pz x1hc1fzr x1k90msu x6o7n8i xbxq160"] {
        z-index: 1;
        top: 10px;
        margin-left: 0px!important;

    }

    label[class="x1a2a7pz x1qjc9v5 xal68kn x51dqfy x1w4cqa3 x1byqp33 x9f619 x78zum5 x1fns5xo x1n2onr6 xh8yej3 x1ba4aug xmjcpbm"] {
        left: -24px!important;
        z-index: 1;

    }

    div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x9f619 xdt5ytf xh8yej3 x1lliihq x1n2onr6 xhq5o37 x1qxoq08 x1cpjm7i x1ryaae9 x1hmns74 x1mhyesy x1y3wzot xaqea5y x30kzoy x9jhf4c x1b1mbwd xav7gou x6umtig x9lpf2z x1eqyvvh xfbg1o9 x1kphnah x1de4urk xyt8op7"] {
        top: -20px;

    }

    div [aria-label="Account Controls and Settings"],
        div [aria-label="Account controls and settings"] {
            z-index: 1;
            flex: 0 0 auto;
            justify-content: flex-end;

        }

    div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x9f619 xdt5ytf xh8yej3 x1lliihq x1n2onr6 xhq5o37 x1qxoq08 x1cpjm7i x1ryaae9 x1hmns74 x1mhyesy x1y3wzot xaqea5y x30kzoy x9jhf4c x1b1mbwd xav7gou x6umtig x9lpf2z x1eqyvvh xfbg1o9 x1kphnah x1de4urk xyt8op7"] {
        bottom: 21px;

    }

    .xkreb8t.xkreb8t {
        display: none;

    }

    div [class="SidebarWrapper"] div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xc9qbxq x14qfxbe"] {
        height: 20px;
        width: 20px;
        background: none;

    }

    div [aria-label="Shortcuts"] {
        display: none;

    }

    div [class="x9f619 x1s65kcs x16xn7b0 xixxii4 x17qophe x13vifvy xoegz02 x1cvmir6 x1jx94hy"] {
        display: none;

    }

    div [class="TopBarContentWrapper"] div [class="x1iyjqo2 xmlsiyf x1hxoosp x1l38jg0 x1awlv9s x1gz44f"] {
        position: relative!important;
        bottom: 1px;
        right: 0px!important;

    }

    .x1ceravr.x1ceravr {
        width: 500px!important;

    }

    div [role="complementary"] a[href*="/events/birthdays/"] {
        display: none;

    }

    div [class="BirthdaysContainer"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h"] {
        font-size: 13px!important;
        top: 1px;
        left: 2px;
        position: relative;
        width: 260px;
        cursor: pointer;

    }

    div [class="BirthdaysContainer"] div [class="x1qjc9v5 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1r8uery xdt5ytf x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r x2lwn1j xeuugli xz9dl7a xsag5q8 x4uap5 xkhd6sd x1n2onr6 x1ja2u2z"] {
        padding-top: 16px;
        padding-bottom: 16px;

    }

    *[class*="fb-light-mode"] div [class="BirthdaysContainer"] strong,
        *[class*="fb-light-mode"] div [class="BirthdaysContainer"] b {
            color: #365899;

        }

    *[class*="fb-dark-mode"] div [class="BirthdaysContainer"] strong,
        *[class*="fb-dark-mode"] div [class="BirthdaysContainer"] b {
            color: #5AA7FF!important;

        }

    *[class*="fb-light-mode"] span[class="xzsf02u x1ypdohk x1s688f"] {
        font-weight: 400;

    }

    div [class="x1yztbdb"] div [class="xqmpxtq x13fuv20 x178xt8z x78zum5 x1a02dak x1vqgdyp x1l1ennw x14vqqas x6ikm8r x10wlt62 x1y1aw1k xh8yej3"] {
        justify-content: start;

    }

    *[class*="fb-light-mode"] div [class="x78zum5 x1n2onr6 xh8yej3"] div [class="xqmpxtq x13fuv20 x178xt8z x78zum5 x1a02dak x1vqgdyp x1l1ennw x14vqqas x6ikm8r x10wlt62 x1y1aw1k"] {
        justify-content: start;

    }

    div [class="x1y1aw1k"] > div > span div [class="x1n2onr6"] {
        display: none;

    }

    *[class*="fb-dark-mode"] div [class="BirthdaysContainer"] {
        background: #252728!important;
        border: 1px solid #222!important;

    }

    *[class*="fb-dark-mode"] div [class="CreatePost"] {
        border: 1px solid #393939!important;
        background: #4B4C4F!important;

    }

    *[class*="fb-dark-mode"] span[class="PostText"] {
        color: #E4E6EB!important;

    }

    *[class*="fb-dark-mode"] div [class="AddToStory"],
        *[class*="fb-dark-mode"] div [class="StoriesContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84"],
            *[class*="fb-dark-mode"] div [class="SponsoredContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6"],
                *[class*="fb-dark-mode"] div [class="SponsoredContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84"] {
                    color: #5AA7FF!important;

                }

    *[class*="fb-dark-mode"] .TimelineButton,
        *[class*="fb-dark-mode"] .RecentButton {
            border: 1px solid #333!important;
            color: #E4E6EB!important;

        }

    div [class="SidebarWrapper"] svg[class="x3ajldb"]:has([style^="height: 36px"]),
        div [class="SidebarWrapper"] svg[aria-hidden="true"],
            div [class="SidebarWrapper"] image[style*="height: 36px"],
                div [class="SidebarWrapper"] image[preserveAspectRatio*="xMidYMid slice"] {
                    height: 20px!important;
                    width: 20px!important;

                }

    div [class="html-div xdj266r x11i5rnm x1mh8g0r xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x1s65kcs x1wsgfga x1pi30zi x1swvt13"],
        div [class="x9f619 x1s65kcs x17qophe x16xn7b0 xixxii4 x13vifvy xoegz02 x1cvmir6 x1jx94hy"] {
            background: transparent!important;

        }

    div [class="SponsoredContainer"] div [class="xamitd3 x1r8uery x1iyjqo2 xs83m0k xeuugli"] {
        width: 276px;
        right: 16px;
        position: relative;

    }

    div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r x1jx94hy x30kzoy x9jhf4c x9f619 x78zum5 xdt5ytf x1iyjqo2 x1iofjn4 x1y1aw1k x1sxyh0 xwib8y2 xurb0ha"] {
        width: 446px!important;
        left: -7px!important;
        top: 1px;

    }

    div [class="SponsoredContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6"] {
        color: #365899;
        font-weight: bold;
        font-size: 13px!important;

    }

    div [class="SponsoredContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84"] {
        color: #365899;
        font-size: 13px;

    }

    div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xg01cxk xexx8yu x18d9i69 x1e558r4 x150jy0e x47corl x10l6tqk x13vifvy x1n4smgl x1d8287x x19991ni xwji4o3 x1kky2od"],
        div [class="SidebarWrapper"] div [class="x9f619 x1s85apg xds687c xexx8yu x18d9i69 x1e558r4 x150jy0e x47corl x10l6tqk x13vifvy x1n4smgl x19991ni xwji4o3 x1kky2od x1hc1fzr x1p6kkr5"] {
            display: none!important;

        }

    div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(2),
        div [class="x1y1aw1k"] div [class="x1n2onr6"]:nth-child(3) {
            display: none;

        }

    div [class="WrapperForAds"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] {
        padding-top: 10px;
        padding-bottom: 10px;
        left: 3px;
        position: relative;

    }

    div [class="WrapperForAds"] div [class="xamitd3 x2lah0s x1kmanbg"] {
        width: 284px;

    }

    div [class="StoriesContainer"] img[class="xz74otr x15mokao x1ga7v0g x16uus16 xbiv7yw"],
        div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"],
            div [class="StoriesContainer"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x6s0dn4 x1wpzbip xlid4zk x13tp074 x1qns1p2 xipx5yg x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1gp4ovq xdio9jc x1h2mt7u x7g060r xsdn2ir x16rfsbj x13awxeq x16sykr7"],
                div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
                    width: 48px;
                    height: 48px;

                }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"] {
        border: none;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #0866ff;

    }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 x1tz4bnf x1yqjg3l x25epmt xkkygvr"],
        div [class="StoriesContainer"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x6s0dn4 x1wpzbip xlid4zk x13tp074 x1qns1p2 xipx5yg x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x1gp4ovq xdio9jc x1h2mt7u x7g060r xsdn2ir x16rfsbj x13awxeq x16sykr7"],
            div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
                left: 3px;
                position: relative;
                cursor: pointer;
            }

    div [role="main"] div [aria-label="Stories"] {
        display: none;

    }

    div [class="StoriesContainer"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84"] {
        color: #365899;
        padding: 1px 9px;
        top: 4px;
        cursor: pointer;

    }

    div [class="StoriesContainer"] span[class="html-span xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs x65k6ix x193iq5w x1ua5tub x104kibb x6ikm8r x10wlt62"]:hover {
        text-decoration: underline;

    }

    div [class="StoriesContainer"] div [class="x9f619 x1n2onr6 x1ja2u2z x6zyg47 x1xm1mqw xpn8fn3 xtct9fg xyi19xy x1ccrb07 xtf3nb5 x1pc53ja x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi xamhcws xol2nv xlxy82 x19p7ews x78zum5 x1kgmq87 xwrv7xz xmgb6t1 x8182xy x1kpxq89 xsmyaan xv9rvxn"] {
        display: none;

    }

    div [class="TopBarContentWrapper"] span[class="x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j"] > div[class="x78zum5 x1n2onr6"] {
        margin-right: 10px!important;

    }

    div [class="TopBarContentWrapper"] div [class="xds687c x1pi30zi x1e558r4 xixxii4 x13vifvy xzkaem6"],
        div [class="TopBarContentWrapper"] div [class="x6s0dn4 x78zum5 x1s65kcs x1n2onr6 x1ja2u2z"] {
            right: 0px!important;
            margin-right: 2px;

        }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x1wpzbip xvs2etk xg3wpu6 x1jwbhkm xgg4q86 x9f619 x78zum5 x1vqgdyp xl56j7k x6ikm8r x10wlt62 x100vrsf x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x1gp4ovq x9p2oo0 x1h2mt7u x56jcm7 xsdn2ir xpkn66y x13awxeq xuxekev"] {
        border: none;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #84878b;

    }

    div [class="StoriesContainer"] div [class="x78zum5 xdt5ytf xz62fqu x16ldp7u"] {
        padding: 1px 4px;
        left: 3px;
        position: relative;

    }

    div [class="SidebarWrapper"] div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xedcshv x1t2pt76"] {
        width: 194px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x1n2onr6 x1iyjqo2 xs83m0k xeuugli xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1iplk16 x1mfogq2 xsfy40s x1wi7962 xpi1e93"] {
        bottom: 9px;

    }

    div [class="SponsoredContainer"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none!important;

    }

    div [class="SponsoredContainer"] .x8du52y:hover {
        background: transparent!important;

    }

    div [class="SponsoredContainer"] a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1q0g3np x87ps6o x1lku1pv x1rg5ohu x1a2a7pz x1pdlv7q"] {
        width: 284px;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1t2pt76 x17upfok"] div [role="main"] div [class="x1yztbdb"] {
        position: relative;
        top: 7px;
        margin-bottom: 20px;

    }

    div [role="banner"] li[class="x1iyjqo2 xmlsiyf x1hxoosp x1l38jg0 x1awlv9s x1gz44f"] {
        display: none;

    }

    div [class="HomeButton"]:before,
        div [class="FindFriends"]:before {
            content: '';
            display: block;
            height: 18px;
            left: -1px;
            position: absolute;
            top: 4px;
            width: 1px;
            background: rgba(0, 0, 0, .1);

        }

    div [class="QuickHelp"]:after {
        content: '';
        display: block;
        height: 18px;
        left: -18px;
        position: absolute;
        top: 2px;
        width: 1px;
        background: rgba(0, 0, 0, .1);

    }

    div [class="TopBarButtonsWrapper"] div [aria-expanded="true"] image[class="OldNotificationIcon"],
        div [class="TopBarButtonsWrapper"] div [aria-expanded="true"] image[class="OldMessengerIcon"],
            div [class="TopBarButtonsWrapper"] div [aria-expanded="true"] image[class="OldFriendsIcon"] {
                filter: invert(1);
                opacity: 1!important;

            }

    div [class="TopBarButtonsWrapper"] div [class="x6s0dn4 x78zum5 x5yr21d xl56j7k x1xegmmw"]:nth-child(3) {
        right: 8px;

    }

    div [class="SidebarWrapper"] ul a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1lliihq"] {
        width: 186px;

    }

    div [class="SidebarWrapper"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
        padding-bottom: 0px;

    }

    div [class="SidebarWrapper"] div [class="x1iyjqo2"] div [class="xwib8y2"] {
        padding-bottom: 4px;

    }

    *[class*="fb-dark-mode"] a[class="NewsFeedButton"] {
        background: #4B4C4F!important;
        border: #393939!important;

    }

    *[class*="fb-dark-mode"] a[class="NewsFeedButton"] span[class="NewsFeedText"] {
        color: #e2e5e9!important;

    }

    div [class="x78zum5 xdt5ytf x1iyjqo2 x1us19tq"] a[href*="https://www.facebook.com/?filter=all&sk=h_chr"] {
        display: none;

    }

    *[class*="fb-dark-mode"] div [class="Language"] {
        color: #5AA7FF!important

    }

    div [class="Language"]:first-child {
        color: #90949c!important;

    }

    ul[class="SettingsDropdownMenu"] a[class="SettingsMenuListItem"]:hover,
        ul[class="SortingOptionsDropdown"] a[class="SortingMenuListItem"]:hover {
            background: #4267b2;

        }

    ul[class="SettingsDropdownMenu"] a[class="SettingsMenuListItem"]:hover span[class="SettingsListItemText"],
        ul[class="SortingOptionsDropdown"] a[class="SortingMenuListItem"]:hover span[class="SortingOptionsText"] {
            color: #fff!important;

        }

    div [class="NewButtonsWrapper"] a[aria-expanded="true"] {
        filter: invert(1);
        opacity: 1!important;

    }

    div [class="TopBarButtonsWrapper"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1hc1fzr x1mq3mr6 x1wpzbip xzolkzo x12go9s9 x1rnf11y xprq8jg"] {
        display: none;

    }

    image[class="OldNotificationIcon"]:hover,
        image[class="OldMessengerIcon"]:hover,
            image[class="OldFriendsIcon"]:hover {
                opacity: 0.8!important;

            }

    a[class="QuickHelp"]:hover,
        a[class="SettingsButton"]:hover {
            opacity: 0.8!important;

        }

    a[class="QuickHelp"]:active,
        a[class="SettingsButton"]:active {
            transform: scale(0.96);

        }

    div [aria-label="Account Controls and Settings"] .x1lxk4cn,
        div [aria-label="Account controls and settings"] .x1lxk4cn {
            display: none!important;

        }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] .xng8ra {
        height: 43px!important;
        padding: 0 17px;
        bottom: 1px;

    }

    div [aria-label="Edit cover photo"] {
        bottom: 261px!important;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] a[class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 x1kmio9f x1itg65n x16dsc37"] {
        height: 43px;
        border-left: 1px solid #e9eaed;
        top: 8px;
    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] div [class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x1o0tod x10l6tqk x13vifvy"] {
        height: 43px;
        border-left: 1px solid #e9eaed;
        border-right: 1px solid #e9eaed;
        top: 8px;

    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] a[class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 x1kmio9f x1itg65n x16dsc37"] {
        height: 43px;
        border-left: 1px solid #393939;
        top: 8px;
    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] div [class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x1o0tod x10l6tqk x13vifvy"] {
        height: 43px;
        border-left: 1px solid #393939;
        border-right: 1px solid #393939;
        top: 8px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff"] {
        background: transparent;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k xf7dkkf xv54qhq xqdwrps x16i7wwg x1y5dvz6"] div [class="x1exxf4d xpv9jar x1nb4dca x1nmn18 x1obq294 x5a5i1n xde0f50 x15x8krk x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x178xt8z x1lun4ml xso031l xpilrb4 xev17xk x1xmf6yo"] {
        top: -8px!important;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z xhb22t3 x11xpdln x1jrttnq"] {
        display: none;

    }

    div [aria-label="Profile settings see more options"],
        div [aria-label="See Options"] {
            width: 34px;
            right: 5px;
            top: 4px;

        }

    div [aria-label="See recommendations"],
        div [aria-label="See Recommendations"] {
            width: 34px;
            right: 7px;

        }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1cy8zhl"] {
        display: none;

    }

    div [aria-label="Suggestions"] div [class="xxi82k7 xyihs7y xq6rjws x1e4dcdm x17wtha7 xwrhaq0 xs6kywh xwvxrgu"] {
        bottom: 14px!important;

    }

    div [aria-label="Suggestions"] div [class="x78zum5 xxi82k7 x63k596 x9a2f9n x1xwl533 xq4m25b x1ty54ac xfk785k"] {
        height: 0px;

    }

    div [aria-label="Suggestions"] div [role="main"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xi81zsa"] {
        display: none;

    }

    div [aria-label="temp heading"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"],
        div [aria-label="Suggestions"] div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] {
            width: 560px;
            top: 8px;

        }

    div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [aria-label="temp heading"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x1iyjqo2 x2lwn1j"] div [class="x1e56ztr x1xmf6yo"],
        div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [aria-label="Suggestions"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x1iyjqo2 x2lwn1j"] div [class="x1e56ztr x1xmf6yo"] {
            bottom: 55px!important;

        }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"],
        div [aria-label="temp heading"] div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"],
            div [aria-label="temp heading"] div [class="x6s0dn4 x78zum5 x9wm9x2 xs9i9mj x12k03ys x1fst9g5 x1wwn1hn"],
                div [aria-label="Suggestions"]:nth-child(2) div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"],
                    div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [class="x1l90r2v"] div[class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] {
                        height: 43px;

                    }

    div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [class="x1l90r2v"] div[class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] {
        bottom: 22px;

    }

    div [aria-label="temp heading"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] .xng8ra {
        bottom: 0px!important;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x78zum5 x15sbx0n x5oxk1f x1jxijyj xym1h4x xuy2c7u x1ltux0g xc9uqle"] div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] {
        width: 560px;
        top: 9px;
        height: 43px;

    }

    div [aria-label="temp heading"] div [class="xxi82k7 xyihs7y xq6rjws x1e4dcdm x17wtha7 xwrhaq0 xs6kywh xwvxrgu"] {
        bottom: 14px!important;

    }

    div [aria-label="temp heading"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"] {
        height: 69px;

    }

    div [aria-label="temp heading"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w"] {
        height: 0px;

    }

    div [class="x2bj2ny x1afcbsf x78zum5 xdt5ytf x1t2pt76 x1n2onr6 x1cvmir6 xcoz2nd xxzkxad xh78kpn xojf56a x1r98mxo"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w"],
        div [class="x78zum5 xdt5ytf x1t2pt76"] div > div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"]:nth-child(2) {
            height: auto!important;

        }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] a[class="x1i10hfl xe8uvvx xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1heor9g x1ypdohk xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 xrbpyxo x1itg65n x16dsc37"] {
        height: 43px;
        border-left: 1px solid #393939!important;

    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] div [class="x1i10hfl xe8uvvx xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x10l6tqk x17qophe x13vifvy"] {
        height: 43px;
        border-left: 1px solid #393939!important;
        border-right: 1px solid #393939!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1cy8zhl xyamay9"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xi81zsa"] {
        display: none;

    }

    div [class="x1ifrov1 x1i1uccp x1stjdt1 x1yaem6q x4ckvhe x2k3zez xjbssrd x1ltux0g xrafsqe xc9uqle x17quhge"] {
        position: absolute!important;
        bottom: -6px!important;
        right: 22px;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"],
        div [aria-label="Suggestions"] div [class="x6s0dn4 x78zum5 x9wm9x2 xs9i9mj x12k03ys x1fst9g5 x1wwn1hn"] {
            height: 43px;

        }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x6s0dn4 xozqiw3 x1q0g3np xcud41i x139jcc6"] {
        top: 8px;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x6s0dn4 x78zum5 xdt5ytf xwib8y2 xh8yej3"] {
        bottom: 42px!important

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x2lah0s x1qjc9v5 x78zum5 x1q0g3np x1a02dak xl56j7k x9otpla x1n0m28w x1wsgfga xp7jhwk"] {
        bottom: 14px!important;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x2lah0s x1qjc9v5 x78zum5 x1q0g3np xl56j7k x8hhl5t x9otpla x1n0m28w x1wsgfga xp7jhwk"] {
        top: 15px;

    }

    div [class="xyamay9 xcaxvl9 x12tpw83 x1srbbgq xkxa9zd"] {
        bottom: 0px!important;

    }

    div [class="x6s0dn4 x78zum5 xdt5ytf"] {
        bottom: 16px!important;

    }

    div [class="html-div xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd xkink6s x1ciixi xfvmy8p x1r1yd6y x78zum5 xdt5ytf x1iyjqo2"] div [class="x78zum5"] {
        display: none;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w"] {
        height: 0px;

    }

    div [class="x6s0dn4 x78zum5 xdt5ytf xwib8y2 xh8yej3"] {
        bottom: 43px!important;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1sur9pj xkrqix3 xi81zsa x1s688f"] {
        font-size: 12px!important;
        font-weight: 400!important;
        position: relative;
        left: 6px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="/friends_likes/"],
        div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="friends_likes"],
            div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="/followers/"] {
                position: relative;
                left: 8px!important;
                padding-bottom: 8px;
                display: flex;
                color: #1d2129!important;

            }

    *[class*="fb-dark-mode"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="/friends_likes/"],
        *[class*="fb-dark-mode"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="friends_likes"],
            *[class*="fb-dark-mode"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="/followers/"],
                *[class*="fb-dark-mode"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="=followers"] {
                    color: #e2e5e9!important;

                }

    div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none;

    }

    *[class*="fb-light-mode"] div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] div [class="x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra x1pi30zi x1swvt13"]:hover {
        background: #f6f7f9;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1cy8zhl xyamay9"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 xk50ysn xi81zsa x1yc453h"] {
        display: none;

    }

    div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x5yr21d x10l6tqk xdsb8wn xh8yej3 x1hc1fzr xnpuxes x2r5gy4 x1jl3cmp xu06nn8"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none;

    }

    div [aria-label="Link preview"] div [aria-label="Profile settings see more options"],
        div [aria-label="Link preview"] div [aria-label="See Options"] {
            width: auto!important;
            right: 0px!important;
            top: 0px!important;

        }

    div [aria-label="Suggestions"]:nth-child(2) div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1sur9pj xkrqix3 xi81zsa x1s688f"] {
        font-size: 12px!important;
        font-weight: 400;
        left: 5px;
        position: relative;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] div [class="x1i10hfl xe8uvvx xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x17qophe x10l6tqk x13vifvy"] {
        height: 43px;
        border-left: 1px solid #e9eaed;
        border-right: 1px solid #e9eaed;
        border-radius: 0px;

    }

    *[class*="fb-dark-mode"] div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] div [class="x1i10hfl xe8uvvx xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x17qophe x10l6tqk x13vifvy"] {
        border-left: 1px solid #393939!important;
        border-right: 1px solid #393939!important;
        border-radius: 0px;

    }

    div [class="x6s0dn4 x78zum5 xdt5ytf x193iq5w"] {
        bottom: 19px!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xsyo7zv x16hj40l x10b6aqq x1yrsyyn"] ul a[href*="/friends_likes/"] div [class="x7wzq59"] a[href*="/friends"]:after {
        display: none;

    }

    div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [class="x1l90r2v"] div [class="x1e56ztr x1xmf6yo"] {
        bottom: 74px!important;

    }

    div [class="__fb-light-mode x1n2onr6 x1vjfegm"] div [class="x1l90r2v"] div [class="x1e56ztr x1xmf6yo"],
        div [class="__fb-dark-mode x1n2onr6 x1vjfegm"] div [class="x1l90r2v"] div [class="x1e56ztr x1xmf6yo"] {
            bottom: 48px!important;

        }

    *[class*="fb-dark-mode"] .TimelineButton {
        border: 1px solid #333!important;
        color: #E4E6EB!important;
    }

    *[class*="fb-dark-mode"] .RecentButton {
        border: 1px solid #333!important;
        color: #E4E6EB!important;
    }

    div [class="x78zum5 xdt5ytf x1n2onr6 x1ja2u2z"] div [class="x1l90r2v"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra x1swvt13 x1pi30zi"] {
        height: 43px;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [role="main"] div [class="x15sbx0n x1xy773u x390vds xmpot0u x13bxmoy x14xzxk9 xs6kywh x5wy4b0"] {
        bottom: 14px !important;

    }

    div [class="x15sbx0n x1xy773u x390vds xmpot0u x13bxmoy x14xzxk9 xs6kywh x5wy4b0"] {
        bottom: 14px!important;

    }

    div [class="__fb-light-mode x1n2onr6 x1vjfegm"] div [class="x1e56ztr x1xmf6yo"], div [class="__fb-dark-mode x1n2onr6 x1vjfegm"] div [class="x1e56ztr x1xmf6yo"] {
        bottom: 48px!important;
        left: 11px!important;
    }

    div [class="__fb-light-mode x1n2onr6 x1vjfegm"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq"], div [class="__fb-dark-mode x1n2onr6 x1vjfegm"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1ve1bff xvo6coq"] {
        bottom: 20px!important;

    }

    div [class="x7wzq59"] footer[aria-label="Facebook"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1sur9pj xkrqix3 xi81zsa x1s688f"] {
        font-size: 12px!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf xeuugli x1r8uery x1iyjqo2 xs83m0k x1swvt13 x1pi30zi xqdwrps x16i7wwg x1y5dvz6"] div [class="xw7yly9"] {
        margin-top: 0px;
        bottom: 0px!important;

    }

    *[class*="fb-dark-mode"] div [class="UpdateInfo"],
        *[class*="fb-dark-mode"] div [class="ActivityLog"] {
            border: 1px solid #393939!important;
            background: #4b4c4f!important;
            color: #e8eaee!important;

        }

    div [class="UpdateInfo"]:active,
        div [class="ActivityLog"]:active {
            transform: scale(0.96);

        }

    *[class*="fb-dark-mode"] i[class="ActivityLogIcon"] {
        filter: brightness(0) invert(1);

    }

    div [class="ActivityLog"] {
        left: 8px;

    }

    div [class="UpdateInfo"] {
        left: 4px;

    }

    div [aria-label="Page home content"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1cy8zhl"] {
        display: block!important;

    }

    div [class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div [aria-label="Add to story"],
        div [class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div [aria-label="Edit profile"] {
            display: none;

        }

    div [class="x9f619 x1ja2u2z x6ikm8r x10wlt62 x1n2onr6"] {
        overflow: visible;

    }

    div [class="x9f619 x1ja2u2z x1xzczws x7wzq59"] a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1lliihq"] .x1iutvsz {
        background: none!important;

    }

    ul[class="TimelineButtonDropdown"] a[class="TimelineDropdownListItem"]:hover {
        background: #4267b2!important;

    }

    ul[class="TimelineButtonDropdown"] a[class="TimelineDropdownListItem"]:hover span[class="TimelineButtonDropdownText"] {
        color: #fff!important;

    }

    div [class="LeftColumnContainer"] h1[class="html-h1 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1vvkbs x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz"] {
        width: 180px!important;
        text-shadow: none!important;
        color: #1d2129!important;
        font-size: 20px!important;
        font-weight: 400!important;
        white-space: wrap!important;
        line-height: 24px!important;
        top: 0px!important;
        word-wrap: break-word;
        margin: 0px;
        padding: 0px;
        left: 5px;
        position: relative;
        cursor: pointer;

    }

    a[class="x1jx94hy x14yjl9h xudhj91 x18nykt9 xww2gxu x1iorvi4 x150jy0e xjkvuk6 x1e558r4"] {
        background: none!important;
        border: none!important;
        box-shadow: none!important;
        top: -8px;

    }

    div [class="LeftColumnContainer"] div [class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x14qwyeo xw06pyt x579bpy xjkpybl x1xlr1w8 xzsf02u x1yc453h"]:hover {
        text-decoration: underline;

    }

    *[class*="fb-dark-mode"] div [class="LeftColumnContainer"] h1[class="html-h1 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1vvkbs x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz"] {
        text-shadow: none!important;
        color: #fff!important;
        font-size: 20px!important;
        font-weight: 400!important;
        white-space: wrap!important;
        line-height: 24px!important;
        top: 0px!important;
        word-wrap: break-word;
        margin: 0px;
        padding: 0px;
        left: 5px;
        position: relative;

    }

    div [class="PageSidebar"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu x18d9i69 x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra xf7dkkf xv54qhq"] {
        height: 30px;
        width: 180px;
        margin-bottom: 4px;
        padding: 5px 4px 5px 0px;

    }

    div [class="PageSidebar"] a[class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg x1vjfegm x3nfvp2 x1kmio9f x1itg65n x16dsc37"],
        div [class="PageSidebar"] div [class="x1i10hfl x3ct3a4 xggy1nq x1fmog5m xu25z0z x140muxe xo1y3bh x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x1o0tod x10l6tqk x13vifvy"] {
            height: 30px;
            width: 180px;
            cursor: pointer;
            left: -5px;
            right: -1px;
            bottom: -1px;
            margin-bottom: 2px;

        }

    div [class="PageSidebar"] div [class="x11t77rh x146dn1l x1ey2m1c xds687c xuoj239 x10l6tqk x17qophe"],
        div [class="PageSidebar"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x91jh78 xkqq1k2 x1ey2m1c x13np604 xtijo5x x1o0tod x10l6tqk xl8spv7"] {
            display: none;

        }

    div [class="LeftColumnContainer"] div [class="x1itg65n x6ikm8r x10wlt62 x1n2onr6 xh8yej3 x1ja2u2z x1a2a7pz"] {
        display: flex;
        overflow: visible;

    }

    div [class="LeftColumnContainer"] div [class="x78zum5 xdt5ytf x1wsgfga x9otpla"] {
        margin-bottom: 16px;
        margin-top: 0px;
        padding-top: 12px;

    }

    div [class="LeftColumnContainer"] div [class="x1ey2m1c xds687c x17qophe x47corl x10l6tqk x13vifvy x19991ni x1dhq9h x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1hc1fzr x1mq3mr6 x1wpzbip"] {
        display: none;

    }

    div [class="PageSidebar"] .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.x1s688f.xi81zsa {
        font-size: 14px;
        font-weight: 400;
        color: #1d2129;
        flex: 1 1 0px;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 28px;
        margin-left: 8px;

    }

    *[class*="fb-dark-mode"] div [class="PageSidebar"] .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.x1s688f.xi81zsa {
        font-size: 14px;
        color: #e4e6eb!important;
        font-weight: 400;
        color: #1d2129;
        flex: 1 1 0px;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 28px;
        margin-left: 8px;

    }

    div [class="SidebarButtonContainer"] .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.x1s688f.x1qq9wsj {
        color: #1d2129!important;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1 1 0px;
        margin-left: 4px;

    }

    *[class*="fb-dark-mode"] div [class="SidebarButtonContainer"] .x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.x1s688f.x1qq9wsj {
        color: #e4e6eb!important;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1 1 0px;
        margin-left: 4px;

    }

    div [class="LeftColumnContainer"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1s688f x1fey0fg"] {
        margin-left: 8px;

    }

    div [class="PageTopbar"] div [class="x78zum5 xdt5ytf x1xmf6yo x1e56ztr xbmvrgn x1n2onr6 xamitd3"],
        div [class="LeftColumnContainer"] div [class="x6s0dn4 x9f619 x78zum5 x2lah0s x1hshjfz x1n2onr6 xng8ra x1pi30zi x1swvt13"] svg[class="x19dipnz x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"],
            div [class="LeftColumnContainer"] div [class="html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x11t77rh x146dn1l x1ey2m1c x13np604 xds687c x17qophe x10l6tqk xr5ldyu"],
                div [class="LeftColumnContainer"] div [class="html-div xdj266r x11i5rnm xat24cr xexx8yu x18d9i69 xkhd6sd x14ju556 xs413o2 xzv607s"],
                    div [class="LeftColumnContainer"] .x1iutvsz {
                        display: none;

                    }

    div [class="PageTopbar"] div [class="x6s0dn4 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x14z9mp x1lziwak xdj266r xeuugli x18d9i69 xf159sx xmzvs34 xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]:nth-child(9),
        div [class="PageTopbar"] div [class="x6s0dn4 x1q0q8m5 x1qhh985 x18b5jzi x10w94by x1t7ytsu x14e42zd x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x14z9mp x1lziwak xdj266r xeuugli x18d9i69 xf159sx xmzvs34 xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]:nth-child(10) {
            display: none;

        }

    div [class="LeftColumnContainer"] div [class="x15sbx0n x1xy773u x390vds xmpot0u x13bxmoy x14xzxk9 xs6kywh x5wy4b0"],
        div [class="LeftColumnContainer"] div [class="xxi82k7 xyihs7y xq6rjws x1e4dcdm x17wtha7 xwrhaq0 xs6kywh xwvxrgu"] {
            width: 178px;
            position: static!important;

        }

    div [class="LeftColumnContainer"] div [class="x1i10hfl xe8uvvx xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct xjbqb8w x18o3ruo x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1heor9g x1ypdohk x78zum5 xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg x1vjfegm x1itg65n x17qophe x10l6tqk x13vifvy"],
        div [class="LeftColumnContainer"] div [class="x1itg65n x1n2onr6 x16dsc37 x192njpj x3nfvp2 xg01cxk"] {
            height: 30px !important;
            width: 180px;
            margin-left: -5px;

        }

    div [aria-label="temp heading"]:first-child {
        visibility: hidden;

    }

    div [class="CommunityTab"] a[class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj xi81zsa x1s688f"] {
        font-size: 12px !important;
        font-weight: normal;
        color: #1d2129;
        padding-left: 12px;
        padding-right: 12px;
        position: relative;
        bottom: 4px;

    }

    div [class="PageTopbar"] div [class="x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"] {
        white-space: nowrap;
        cursor: pointer;

    }

    div [class="PageTopbar"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 xk50ysn xzsf02u x1yc453h"],
        div [class="PageTopbar"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 xk50ysn x1dntmbh x1yc453h"],
            div [class="PageTopbar"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lkfr7t x1lbecb7 xk50ysn xzsf02u"] {
                font-size: 14px;

            }

    *[class*="fb-dark-mode"] div [class="CommunityTab"] {
        background: #252728!important;
        border: none!important;

    }

    *[class*="fb-dark-mode"] div [class="CommunityTab"] a[class="x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj xi81zsa x1s688f"],
        *[class*="fb-dark-mode"] div [class="CommunityText"] {
            color: #e2e5e9!important;

        }

    div [class="PageSidebar"] a[aria-selected="false"]:hover,
        div [class="PageSidebar"] a[aria-selected="true"] {
            background-color: #f6f7f9;
            border: 1px solid #dddfe2;
            border-radius: 2px;
            left: -5px;
            bottom: -1px;
            transition: 400ms cubic-bezier(.08,.52,.52,1) background-color, 400ms cubic-bezier(.08,.52,.52,1) border-color, 400ms cubic-bezier(.08,.52,.52,1);

        }

    *[class*="fb-dark-mode"] div [class="PageSidebar"] a[aria-selected="false"]:hover,
        *[class*="fb-dark-mode"] div [class="PageSidebar"] a[aria-selected="true"] {
            background-color: #4b4c4f;
            border: 1px solid #393939!important;
            border-radius: 2px;
            left: -5px;
            bottom: -1px;
            transition: 400ms cubic-bezier(.08,.52,.52,1) background-color, 400ms cubic-bezier(.08,.52,.52,1) border-color, 400ms cubic-bezier(.08,.52,.52,1);

        }

    div [class="LeftColumnContainer"] div [aria-label="Loading..."] {
        display: none;

    }

    *[class*="fb-dark-mode"] span[class="ExploreText"] {
        color: #b0b3b8!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] a[href*="/photos"] {
        font-size: 14px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
        padding: 12px 0px;
        height: 39px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib x1qjc9v5 xozqiw3 x1q0g3np x1pi30zi x1swvt13 xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"] {
        padding: 0px!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(4),
        div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(5),
            div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(6),
                div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(7),
                    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(8),
                        div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(9) {
                            display: none;

                        }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:first-child {
        width: 100%;
        height: 249px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:first-child img[class="x1ga7v0g x16uus16 xbiv7yw x5yr21d xl1xv1r xh8yej3 x1obq294"] {
        height: 249px;
        width: 100%;
        object-fit: contain;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"] img[class="x1ga7v0g x16uus16 xbiv7yw x5yr21d xl1xv1r xh8yej3 x1obq294"] {
        height: 249px;

    }


    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(2),
        div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k x1icxu4v x25sj25 x10b6aqq x1yrsyyn"] div [class="x78zum5 x12nagc x1n2onr6 x1s6qhgt"]:nth-child(3) {
            width: 50%;
            height: 249px;

        }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1n2onr6 x1ja2u2z x2lah0s x193iq5w xeuugli xqcrz7y x78zum5 xdt5ytf xl56j7k x13fj5qh"] {
        margin-left: 0px;
        top: 10px;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib x6s0dn4 xozqiw3 x1q0g3np"] {
        justify-content: center;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] a[aria-label="See all photos"] span {
        font-size: 12px!important;
        color: #385898;

    }

    div [class="x78zum5 x15sbx0n x5oxk1f x1jxijyj xym1h4x xuy2c7u x1ltux0g xc9uqle"] a[class="x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xkrqix3 x1sur9pj xi81zsa x1s688f"] {
        font-size: 12px!important;
        font-weight: normal!important;
        left: 5px;
        position: relative;

    }

    div [class="x9f619 x193iq5w x1sltb1f x3fxtfs x1swvt13 x1pi30zi xw7yly9 x1xwk8fm"]:first-child div [class="x1yztbdb"] {
        width: 308px;
        position: absolute;
        left: 9px;
        top: 8px;

    }

    div [class="ContainerForReviews"] + .x7ep2pv {
        right: 175px!important;

    }

    div [class="ContainerForReviews"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u"],
        div [class="ContainerForReviews"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u x1yc453h"] {
            font-size: 14px;

        }

    div [class="ContainerForReviews"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np xn6708d x1ye3gou xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"] :first-child div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou x1qhmfi1 x1fq8qgq"] {
        background: #4267b2!important;
        border: 1px solid #4267b2!important;

    }

    div [class="ContainerForReviews"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np xn6708d x1ye3gou xyamay9 xykv574 xbmpl8g x4cne27 xifccgj"] :first-child div [class="x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou x1qhmfi1 x1fq8qgq"] span[class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84"] {
        color: #fff!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1emribx x1e56ztr x1i64zmx xnp8db0 x1d1medc x7ep2pv x1xzczws"] div [class="LanguageContainer"] a[class="Language"] {
        font-size: 12px!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1emribx x1e56ztr x1i64zmx xnp8db0 x1d1medc x7ep2pv x1xzczws"] div [class="LanguageContainer"] div [class="LanguageButton"] {
        bottom: 5px!important;

    }

    div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1emribx x1e56ztr x1i64zmx xnp8db0 x1d1medc x7ep2pv x1xzczws"] div [class="x1yztbdb"] {
        margin-bottom: 10px;

    }

    *[class*="fb-dark-mode"] div [class="PageTransparencyContainer"] {
        background: #252728;
        border: none;

    }

    *[class*="fb-dark-mode"] div [class="PageTransparencyText"] {
        color: #e2e5e9;

    }

    *[class*="fb-dark-mode"] div [class="PageTransparencyInformation"] {
        color: #b0b3b8;

    }

    *[class*="fb-dark-mode"] div [class="PageTransparencyContainer"] a[class="SeeMore"] {
        color: #5aa7ff;

    }

    *[class*="fb-dark-mode"] ul[class="SettingsDropdownMenu"],
        *[class*="fb-dark-mode"] ul [class="SortingOptionsDropdown"],
            *[class*="fb-dark-mode"] ul[class="TimelineButtonDropdown"] {
                background: #252728!important;

            }

    *[class*="fb-dark-mode"] ul[class="SettingsDropdownMenu"] a[class="SettingsMenuListItem"] span[class="SettingsListItemText"],
        *[class*="fb-dark-mode"] ul[class="SortingOptionsDropdown"] a[class="SortingMenuListItem"] span[class="SortingOptionsText"],
            *[class*="fb-dark-mode"] ul[class="TimelineButtonDropdown"] a[class="TimelineDropdownListItem"] span[class="TimelineButtonDropdownText"] {
                color: #e2e5e9!important;

            }

    *[class*="fb-dark-mode"] div [class="Separator"] {
        background-color: rgba(100, 100, 100, .4)!important;

    }

    div [role="main"] div [data-pagelet="Stories"] {
        display: none;

    }

    div [class="x1y1aw1k"] div:first-child div [class="x1n2onr6"] {
        display: none;

    }

    div [class="SidebarWrapper"] div [class="x1iyjqo2"] > div [class="html-div x1qjc9v5 x9f619 x78zum5 xdt5ytf x1iyjqo2 xl56j7k xeuugli xifccgj x4cne27 xw01apr x1ws5yxj xbktkl8 x1tr5nd9 x3su7b9 x12pbpz1 x1gtkyd9 x1r8uycs"] {
        right: 8px;
        position: relative;

    }

    div [class="x78zum5 xdt5ytf x1t2pt76"] div [class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x1cy8zhl xyamay9"] span[class="x6zurak x18bv5gf x184q3qc xqxll94 x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x193iq5w xeuugli x13faqbe x1vvkbs x1lliihq xi81zsa xlh3980 xvmahel x1x9mg3 xo1l8bm"] {
        display: none;

    }

    div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [class="x1n2onr6 x1uc6qws xyen2ro"]:nth-child(2),
        div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
            display: none;

        }

    div [role="complementary"] div [class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] div [data-visualcompletion="ignore-dynamic"] div [class="x1n2onr6 x1ja2u2z x9f619 x78zum5 xdt5ytf x2lah0s x193iq5w xjkvuk6 x1cnzs8"] {
        display: block!important;

    }

    div [role="complementary"] div [class="x1y1aw1k"] {
        width: 205px;
        padding: 0px;

    }

    div [class="StoriesContainer"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl xn0vg7t xys98vm x10l6tqk"] {
        display: none;

    }

    span[class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j"] > div[class="x78zum5 x1n2onr6"]:after {
        display: none!important;

    }

    svg[aria-label="Your profile"] {
        margin: 0px!important;

    }

    div [class="TopBarButtonsWrapper"] span[class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j"] {
        right: 3px;
        position: relative;

    }

    div [class="TopBarButtonsWrapper"] div [aria-label="Menu"] {
        left: 8px;

    }

    div [class="TopBarButtonsWrapper"] :nth-child(6) {
        right: 8px;
        position: relative;

    }

    div [class="html-div xdj266r x14z9mp xat24cr x1lziwak x1jx94hy xde0f50 x15x8krk x9f619 x78zum5 xdt5ytf x1iyjqo2 x1iofjn4 x1y1aw1k xf159sx xwib8y2 xmzvs34"] {
        width: 421px!important;
        left: -7px!important;

    }

    ul[class="SidebarButtonList"] div [class="html-div x1qjc9v5 x9f619 x78zum5 xdt5ytf x1iyjqo2 xl56j7k xeuugli xifccgj x4cne27 xw01apr x1ws5yxj xbktkl8 x1tr5nd9 x3su7b9 x12pbpz1 x1gtkyd9 x1r8uycs"] {
        width: 190px;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] div[class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div[class="xdwrcjd x2fvf9 x1xmf6yo x1w6jkce xusnbm3"] {
        margin: 0px;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] div[class="x78zum5 x1a02dak x165d6jo x1lxpwgx x9otpla x1ke80iy"] div [aria-label="Search"] {
        right: 1px;

    }

    div [class="x6s0dn4 x78zum5 xvrxa7q x9w375v xxfedj9 x1roke11 x1es02x0"] div [aria-label="Profile settings see more options"], div [aria-label="See Options"] {
        top: 0px!important;

    }

    *[class*="fb-light-mode"] div [class="SidebarWrapper"] a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lliihq"]:hover {
        background-color: #f6f7f9;
        border: 1px solid #dddfe2;
        border-radius: 2px;
        left: -8px;
        right: -1px;
        transition: 400ms cubic-bezier(.08, .52, .52, 1) background-color, 400ms cubic-bezier(.08, .52, .52, 1) border-color, 400ms cubic-bezier(.08, .52, .52, 1);

    }

    div [class="SidebarWrapper"] a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xc5r6h4 xqeqjp1 x1phubyo x13fuv20 x18b5jzi x1q0q8m5 x1t7ytsu x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xdl72j9 x2lah0s x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak x2lwn1j xeuugli xexx8yu xyri2b x18d9i69 x1c1uobl x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1fmog5m xu25z0z x140muxe xo1y3bh x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lliihq"] {
        width: 186px;
        padding-right: 8px;
        padding-left: 8px;
        right: 8px;

    }

    div [class="x7wzq59"] div [class="xieb3on"] a[href*="/followers/"] {
        right: 8px;

    }

    div [class="SidebarWrapper"] div[class="x78zum5 xdt5ytf x1iyjqo2 x1n2onr6"] {
        height: 650px;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] {
        justify-content: flex-start;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] div[class="html-div xdj266r x14z9mp xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x13fj5qh"]:first-child {
        display: none;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] div[class="html-div xdj266r x14z9mp xat24cr xexx8yu xyri2b x18d9i69 x1c1uobl x13fj5qh"]:nth-child(2) {
        margin: 0px;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1qughib xuk3077 xozqiw3 x1q0g3np xpdmqnj x1g0dm76 xyamay9 x1w5wx5t x1qfufaz x1wsgfga x9otpla"] {
        padding: 16px 12px!important;

    }

    div [aria-label="Event Permalink"] div [role="listitem"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 x1nhvcw1 x1cy8zhl xozqiw3 x1q0g3np xv54qhq xf7dkkf xexx8yu x1ws5yxj xw01apr x4cne27 xifccgj"] {
        padding: 0px 2px 0px 2px;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1ja2u2z x78zum5 x2lah0s x1n2onr6 xl56j7k x1qjc9v5 xozqiw3 x1q0g3np x1l90r2v x1ve1bff"] {
        padding-bottom: 26px;

    }

    div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] {
        border-bottom: 1px solid rgb(242, 242, 242);

    }

    div [aria-label="Event Permalink"] .x78zum5 > .x78zum5:nth-child(1) > div > .x9f619:nth-child(3) > .x9f619 > .x9f619 {
        height: 43px;
        border-top: 1px solid rgb(242, 242, 242);
        padding: 0px;

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 xng8ra xh8yej3"] {
        border-bottom: 1px solid rgba(100, 100, 100, .4);

    }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] .x78zum5 > .x78zum5:nth-child(1) > div > .x9f619:nth-child(3) > .x9f619 > .x9f619 {
        border-top: 1px solid rgba(100, 100, 100, .4);

    }

    div [aria-label="Event Permalink"] div [aria-orientation="horizontal"] {
        width: 500px;
        height: 43px;

    }

    div [aria-label="Event Permalink"] div [aria-orientation="horizontal"] a {
        width: 250px;
        justify-content: center;
        height: 43px;

    }

    div [aria-label="Event Permalink"] .xng8ra,
        div [aria-label="Event Permalink"] .x879a55 {
            height: 43px!important;

        }

    div [aria-label="Event Permalink Left Rail"] {
        visibility: hidden;

    }

    div [aria-label="Event Permalink"] div [class="EventsLeftColumnContainer"] div [class="EventsButton"] a {
        margin-left: 8px;

    }

    div [aria-label="Event Permalink"] div [class="CurrentEventTitle"] span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1ill7wo x1x48ksl x1q74xe4 xyesn5m x1xlr1w8 xzsf02u x1yc453h"] {
        font-size: 14px;
        line-height: 18px;
        margin-left: 8px;

    }

    div [aria-label="Event Permalink"] div [class="CurrentEventTitle"] span {
        overflow: visible;

    }

    div [aria-label="Event Permalink"] div [class="EventsLeftColumnContainer"] div [class="EventsButton"]:hover,
        div [aria-label="Event Permalink"] div [class="EventsLeftColumnContainer"] div [class="CurrentEventTitle"] {
            background-color: #f6f7f9;
            border: 1px solid #dddfe2;
            border-radius: 2px;
            transition: 400ms cubic-bezier(.08,.52,.52,1) background-color, 400ms cubic-bezier(.08,.52,.52,1) border-color, 400ms cubic-bezier(.08,.52,.52,1);
            cursor: pointer;

        }

    *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="EventsLeftColumnContainer"] div [class="EventsButton"]:hover,
        *[class*="fb-dark-mode"] div [aria-label="Event Permalink"] div [class="EventsLeftColumnContainer"] div [class="CurrentEventTitle"] {
            background-color: #4b4c4f;
            border: 1px solid #393939!important;
            border-radius: 2px;
            transition: 400ms cubic-bezier(.08,.52,.52,1) background-color, 400ms cubic-bezier(.08,.52,.52,1) border-color, 400ms cubic-bezier(.08,.52,.52,1);
            cursor: pointer;

        }

    *[class*="fb-dark-mode"] span[class="EventsTitle"],
        *[class*="fb-dark-mode"] div [class="EventsButton"] a {
            color: #fff!important;

        }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh xnp8db0 x1d1medc x7ep2pv x1xzczws"] {
        right: auto!important;

    }

    div [aria-label="Event Permalink"] div [class="x9f619 x1n2onr6 x1ja2u2z xeuugli xs83m0k xjl7jj x1xmf6yo x1xegmmw x1e56ztr x13fj5qh x19h7ccj xu9j1y6 x7ep2pv"] {
        right: 343px!important;

    }

    div [aria-label="Event Permalink"] div [class="x7wzq59"] div[class="html-div xdj266r x14z9mp x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1yztbdb"]:first-child {
        display: none;

    }

    ` );

})();