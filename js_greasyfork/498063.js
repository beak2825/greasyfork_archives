// ==UserScript==
// @name         Nexus Mods - Download Mod Faster - Improved UX (All Games)
// @namespace    https://bitbucket.org/antonolsson91/nexus-mods-stardew-valley-improved-ux/
// @version      1.6
// @description  Improves the user experience for nexusmods.com visitors by adding Insta-DL buttons in various places like |1) categories mod tiles |2) mod description/file page
// @author       Anton Olsson, TetteDev
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://www.nexusmods.com/*/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/498063/Nexus%20Mods%20-%20Download%20Mod%20Faster%20-%20Improved%20UX%20%28All%20Games%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498063/Nexus%20Mods%20-%20Download%20Mod%20Faster%20-%20Improved%20UX%20%28All%20Games%29.meta.js
// ==/UserScript==

(($) => {
	const resolveGameId = () => {
		try { return parseInt(Object.keys(window.GlobalModStats)[0]); }
		catch (err) { debugger; console.error("Could not derive the current game id, please inform the author of this script!", err); return -1; }
	};
        let DMF = {
            STVGameId: resolveGameId(),
            startDownload: function (file_id, game_id, btn) {
                console.log(`Called startDownload(${file_id},${game_id}, ${btn})`)
                $.ajax(
                    {
                        type: "POST",
                        url: "/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl",
                        data: {
                            fid: file_id,
                            game_id: game_id,
                        },
                        success: function (data, error) {
                            if (data && data.url) {
                                console.log('Success');
                                //window.location.href = data.url;
                                window.open(data.url)
                                btn.attr("disabled", "true").append(`✅`)
                                $('.donation-wrapper > p').html('<p>Your download has started</p><p>If you are having trouble, <a href="' + data.url + '">click here</a> to download manually</p>');
                            } else {
                                console.trace("Error posting:", error);
                            }
                        },
                        error: function (e) {
                            console.trace(e);
                        }
                    }
                );
            },
            loader: function(){
                return $(`
                <span><img alt="" width="64" height="64" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K" /></span>
                `)
            },
            initiateDownload: function ( btn_manualDl ) {
                console.log("initiateDownload got", btn_manualDl, $(btn_manualDl).attr("href"), $(btn_manualDl).prop("tagName"))

                let linkParamString = $(btn_manualDl).prop("tagName").toLowerCase() == "a"
                ? $(btn_manualDl).attr("href").split("?")[1]
                : $(btn_manualDl).find('a').attr("href").split("?")[1]

                let searchParams = new URLSearchParams(linkParamString)
                let id = searchParams.has('file_id')
                ? searchParams.get('file_id')
                : searchParams.get('id');

                if( !id) {
					id = new URLSearchParams(window.location.href).get("file_id");
					if (!id) return false;
				}

                this.startDownload(id, this.STVGameId, btn_manualDl);
            },
            btn: function(){
				this.btn_extended();

                let btn = $(`<button class="rj-vortex-button">Insta-DL</button>`)
                btn.on("click", async (event) => {
                    event.preventDefault()
                    let btn_manualDl;

                    if(document.location.href.includes("mods/categories/")){
                        let current = $(event.target).parents('.mod-tile');
                        let modUrl = current.find('h3 a').attr('href')

                        let loader = this.loader()
                        loader.appendTo(current.parent())

                        await $.get(modUrl, source => {
                            loader.hide()

                            btn_manualDl = $(`<div>${source}</div>`).find('#action-manual');
                            initiateDownload(btn_manualDl)
                        });
                    } else {
                        let $this = $( event.target )

                        btn_manualDl = $this.data('button')
                        ? $this.data('button')[0]
                        : $('#action-manual')
                    }

                    this.initiateDownload(btn_manualDl)

                })
                return btn;
            },
			btn_extended: function() {
				if (document.querySelector("#bypassFastDownloadButton")) return;

				let btn = document.createElement("td");
				btn.innerHTML = `<button class="rj-vortex-button" id="bypassFastDownloadButton"><span>Insta-DL</span></button>`;
				btn.onclick = async (event) => {
					event.preventDefault()
                    let btn_manualDl;

                    if(document.location.href.includes("mods/categories/")){
                        let current = $(event.target).parents('.mod-tile');
                        let modUrl = current.find('h3 a').attr('href')

                        let loader = this.loader()
                        loader.appendTo(current.parent())

                        await $.get(modUrl, source => {
                            loader.hide()

                            btn_manualDl = $(`<div>${source}</div>`).find('#action-manual');
                            initiateDownload(btn_manualDl)
                        });
                    } else {
                        let $this = $( event.target )

                        btn_manualDl = $this.data('button')
                        ? $this.data('button')[0]
                        : $('#action-manual')
                    }

                    this.initiateDownload(btn_manualDl)
				};

				try {
					const insertionNode = (document.querySelector("#slowDownloadButton") || document.querySelector("#fastDownloadButton")).parentNode.parentNode;
					if (!insertionNode) { console.warn("Could not add fast-download button next to the existing download buttons!"); return; }
					insertionNode.appendChild(btn);
				} catch (err) { }

			},
            main: function(){
				// TODO: make this check better in the future
				if (!window.location.pathname.includes("/mods/") || window.location.pathname.includes("categories")) return;

				if (window.DMF.STVGameId == -1) { return; }

				const isLoggedIn = window["USER_ID"] !== undefined;
				if (!isLoggedIn) return;

                let dl = document.querySelector("#slowDownloadButton");
                if (dl) {
                    dl.removeAttribute("data-download-url");
                    dl.onclick = () => {
                        let dlButton = document.querySelector(".rj-vortex-button");
                        if (!dlButton) {
                            this.btn();
                            dlButton = document.querySelector(".rj-vortex-button");
                            if (!dlButton) { alert("Please use the Insta-Download button instead"); return; }
                        }
                        dlButton.click();
                    };
                }

                if(document.location.href.includes("mods/categories/")){
                    $('.mod-tile').each( (i, e) => {
                        $(e).find(".tile-data ul").append(
                            $(`<li class="inline-flex"></li>`).append(
                                this.btn()
                            )
                        )
                    } );
                } else {
                    // Header, download latest file
                    $('#action-manual').parent().append(this.btn())


                    // Files tab
                    $(`.tabcontent-mod-page a.btn.inline-flex`).each((i, e) => {
                        let p = $(e).parent()
                        if($(e).html().includes("Manual download")){
                            p.append(this.btn().data('button', $(e)))
                        }
                    })
                }

            }

        }

		try {
			window.DMF = DMF;
			window.DMF.main();
		} catch (error) {
			debugger;
			console.error("Please disable the 'Nexus Mods - Download Mod Faster' userscript as it failed!", error)
			alert("Please disable the 'Nexus Mods - Download Mod Faster' userscript as it failed!");
		}
})(jQuery);