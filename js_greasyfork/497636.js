// ==UserScript==
// @name         IMDb TMDB Letterboxd Linker
// @description  Opens the corresponding IMDb, TMDB, or Letterboxd page for movies, TV shows and people with a single click. Additionally, it also displays IMDb ratings on both TMDB and Letterboxd pages.
// @author       Tetrax-10
// @namespace    https://github.com/Tetrax-10/imdb-tmdb-letterboxd-linker
// @version      2.6
// @license      MIT
// @match        *://*.imdb.com/title/tt*
// @match        *://*.imdb.com/name/nm*
// @match        *://*.themoviedb.org/movie/*
// @match        *://*.themoviedb.org/tv/*
// @match        *://*.themoviedb.org/person/*
// @match        *://*.letterboxd.com/film/*
// @include      /^https?:\/\/(?:www\.)?letterboxd\.com\/(actor|additional-photography|camera-operator|cinematography|composer|costume-design|director|editor|executive-producer|hairstyling|makeup|original-writer|producer|set-decoration|sound|story|visual-effects|writer)\/.*$/
// @connect      imdb.com
// @connect      themoviedb.org
// @homepageURL  https://github.com/Tetrax-10/imdb-tmdb-letterboxd-linker
// @supportURL   https://github.com/Tetrax-10/imdb-tmdb-letterboxd-linker/issues
// @icon         https://tetrax-10.github.io/imdb-tmdb-letterboxd-linker/assets/icon.png
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/497636/IMDb%20TMDB%20Letterboxd%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/497636/IMDb%20TMDB%20Letterboxd%20Linker.meta.js
// ==/UserScript==

;(() => {
    const TMDB_API_KEY = GM_getValue("TMDB_API_KEY", null)?.trim()

    GM_registerMenuCommand("Settings", showPopup)

    function showPopup() {
        GM_addStyle(`
#linker-settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}
#linker-settings-popup {
    background-color: rgb(32, 36, 44);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10001;
    font-family: Source Sans Pro, Arial, sans-serif;
    font-feature-settings: normal;
    font-variation-settings: normal;
    font-size: 100%;
    font-weight: inherit;
    line-height: 1.5;
    letter-spacing: normal;
    width: 60%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
}
#linker-settings-popup input {
    color: #cfcfcf;
}
#linker-settings-popup label {
    color: rgb(207, 207, 207);
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 10px;
}
#linker-settings-popup input {
    background-color: rgb(32, 36, 44);
    border: 1px solid rgb(207, 207, 207);
    color: rgb(207, 207, 207);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
}
`)

        // Create overlay
        const overlay = document.createElement("div")
        overlay.id = "linker-settings-overlay"
        overlay.onclick = (e) => {
            if (e.target === overlay) closePopup(overlay)
        }

        // popup element
        const popup = document.createElement("div")
        popup.id = "linker-settings-popup"

        // popup content
        const label = document.createElement("label")
        label.textContent = "Enter your TMDB API key:"

        // input element
        const input = document.createElement("input")
        input.type = "text"
        input.value = GM_getValue("TMDB_API_KEY", "")
        input.oninput = (e) => {
            try {
                GM_setValue("TMDB_API_KEY", e.target?.value?.trim())
            } catch (error) {
                console.error("Failed to set TMDB API key", error)
            }
        }

        // inject popup
        popup.appendChild(label)
        popup.appendChild(input)
        overlay.appendChild(popup)
        document.body.appendChild(overlay)

        input.focus()
    }

    function closePopup(overlay) {
        document.body.removeChild(overlay)
    }

    const imdbPageCss = `
#linker-parent {
    display: flex;
    align-self: center;
}
#linker-letterboxd-link {
    align-self: center;
}
#linker-letterboxd {
	height: 27px;
	width: 53px;
	margin-top: 7px;
}
#linker-divider {
    border-left: 3px solid rgba(232, 230, 227, 0.5) !important;
    height: 25px;
    border-radius: 10px;
    margin-left: 10px;
    align-self: center;
}
#linker-loading {
    height: 20px;
    align-self: center;
    text-align: center;
    margin-left: 10px;
    margin-right: 40px;
}
#linker-tmdb-link {
    height: 27px;
    width: 60px;
    background: #022036 !important;
    color: #51b4ad !important;
    border: solid #51b4ad 2px !important;
    border-radius: 6px;
    align-self: center;
    margin-left: 10px;
    margin-right: 20px;
    font-weight: bold;
    text-align: center;
    align-content: center;
}
@media only screen and (max-width: 767px) {
    #linker-loading {
        margin-right: 6px;
    }
    #linker-tmdb-link {
        width: 48px;
        margin-left: 10px;
        margin-right: 10px;
        font-size: smaller;
    }
}    
`
    const tmdbTitlePageCss = `
#linker-parent {
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
}
#linker-imdb-svg-bg {
    fill: #c59f00 !important;
}
#linker-divider {
    border-left: 2px solid rgba(232, 230, 227, 0.5) !important;
    height: 23px;
    border-radius: 10px;
    margin-left: 10px;
}
#linker-loading {
    height: 20px;
    margin-left: 10px;
}
#linker-imdb-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
}
#linker-imdb-rating {
    margin-left: 10px;
}
html.k-mobile #linker-parent {
    margin-top: unset;
    margin-left: auto;
    margin-right: auto;
}    
`

    const tmdbPersonPageCss = `
#linker-imdb-svg,
#linker-letterboxd-svg path {
    --darkreader-inline-fill: #d0d0d0 !important;
}
`

    const letterboxdTitlePageCss = `
#linker-loading {
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-top: 2px solid #cfcfcf !important;
    height: 8px !important;
    width: 8px !important;
    margin-left: 4px;
}
`

    const commonUtils = (() => {
        const ImdbSvg = `<svg id="linker-imdb-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 575 289.83" width="40" height="20"><defs><path d="M575 24.91C573.44 12.15 563.97 1.98 551.91 0H23.32C10.11 2.17 0 14.16 0 28.61v232.25c0 16 12.37 28.97 27.64 28.97h519.95c14.06 0 25.67-11.01 27.41-25.26z" id="d1pwhf9wy2"/><path d="M69.35 58.24h45.63v175.65H69.35z" id="g5jjnq26yS"/><path d="M201.2 139.15c-3.92-26.77-6.1-41.65-6.53-44.62-1.91-14.33-3.73-26.8-5.47-37.44h-59.16v175.65h39.97l.14-115.98 16.82 115.98h28.47l15.95-118.56.15 118.56h39.84V57.09h-59.61z" id="i3Prh1JpXt"/><path d="M346.71 93.63c.5 2.24.76 7.32.76 15.26v68.1c0 11.69-.76 18.85-2.27 21.49-1.52 2.64-5.56 3.95-12.11 3.95V87.13c4.97 0 8.36.53 10.16 1.57 1.8 1.05 2.96 2.69 3.46 4.93m20.61 137.32c5.43-1.19 9.99-3.29 13.69-6.28 3.69-3 6.28-7.15 7.76-12.46 1.49-5.3 2.37-15.83 2.37-31.58v-61.68c0-16.62-.65-27.76-1.66-33.42-1.02-5.67-3.55-10.82-7.6-15.44q-6.09-6.93-17.76-9.96c-7.79-2.02-20.49-3.04-42.58-3.04H287.5v175.65h55.28c12.74-.4 20.92-.99 24.54-1.79" id="a4ov9rRGQm"/><path d="M464.76 204.7c-.84 2.23-4.52 3.36-7.3 3.36-2.72 0-4.53-1.08-5.45-3.25-.92-2.16-1.37-7.09-1.37-14.81v-46.42c0-8 .4-12.99 1.21-14.98.8-1.97 2.56-2.97 5.28-2.97 2.78 0 6.51 1.13 7.47 3.4.95 2.27 1.43 7.12 1.43 14.55v45.01c-.29 9.25-.71 14.62-1.27 16.11m-58.08 26.51h41.08c1.71-6.71 2.65-10.44 2.84-11.19 3.72 4.5 7.81 7.88 12.3 10.12 4.47 2.25 11.16 3.37 16.34 3.37 7.21 0 13.43-1.89 18.68-5.68 5.24-3.78 8.58-8.26 10-13.41 1.42-5.16 2.13-13 2.13-23.54V141.6c0-10.6-.24-17.52-.71-20.77s-1.87-6.56-4.2-9.95-5.72-6.02-10.16-7.9q-6.66-2.82-15.72-2.82c-5.25 0-11.97 1.05-16.45 3.12-4.47 2.07-8.53 5.21-12.17 9.42V55.56h-43.96z" id="fk968BpsX"/></defs><use id="linker-imdb-svg-bg" xlink:href="#d1pwhf9wy2" opacity="1" fill="#c59f00" fill-opacity="1"/><use xlink:href="#d1pwhf9wy2" fill-opacity="0" stroke="#000" stroke-opacity="0"/><use xlink:href="#g5jjnq26yS" fill="#000000 !important"/><use xlink:href="#g5jjnq26yS" fill-opacity="0" stroke="#000" stroke-opacity="0"/><use xlink:href="#i3Prh1JpXt" fill="#000000 !important"/><use xlink:href="#i3Prh1JpXt" fill-opacity="0" stroke="#000" stroke-opacity="0"/><use xlink:href="#a4ov9rRGQm" fill="#000000 !important"/><use xlink:href="#a4ov9rRGQm" fill-opacity="0" stroke="#000" stroke-opacity="0"/><use xlink:href="#fk968BpsX" fill="#000000 !important"/><use xlink:href="#fk968BpsX" fill-opacity="0" stroke="#000" stroke-opacity="0"/></svg>`
        const ImdbSvgWithoutBg = `<svg id="linker-imdb-svg" fill="#262626" width="50" height="50" viewBox="0 0 32 27" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M8.4 21.1H5.9V9.9h3.8l.7 4.7h.1l.5-4.7h3.8v11.2h-2.5v-6.7h-.1l-.9 6.7H9.4l-1-6.7zm7.4-11.3c.4 0 3.2-.1 4.7.1 1.2.1 1.8 1.1 1.9 2.3.1 2.2.1 4.4.1 6.6 0 .2 0 .5-.1.8-.2.9-.7 1.4-1.9 1.5-1.5.1-3 .1-4.4.1h-.2V9.8zm3 2.1v7.2c.5 0 .8-.2.8-.7v-5.9c0-.5-.2-.7-.8-.6M2 21.1V9.9h2.9v11.2zm27.9-7c-.1-.8-.6-1.2-1.4-1.4-.8-.1-1.6 0-2.3.7V9.9h-2.8v11.2H26c.1-.2.1-.4.2-.5h.1l.3.3c.7.5 1.5.6 2.3.3.7-.3 1-.9 1-1.6 0-.8.1-1.7.1-2.6 0-1 0-2-.1-2.9m-2.8 5c0 .2-.2.4-.4.4s-.4-.2-.4-.4v-4.3c0-.2.2-.4.4-.4s.4.2.4.4z"/></svg>`

        const letterboxdSvg = `<svg id="linker-letterboxd" width="43" height="23" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M0 0h129.847v141.389H0z"/><path id="c" d="M0 0h129.847v141.389H0z"/></defs><g fill="none" fill-rule="evenodd"><rect width="500" height="250" fill="#202830" rx="40" ry="40"/><g transform="translate(61 50)"><ellipse fill="#00E054" cx="189" cy="69.973" rx="70.079" ry="69.973"/><g transform="translate(248.153)"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><g/><ellipse fill="#40BCF4" mask="url(#b)" cx="59.769" cy="69.973" rx="70.079" ry="69.973"/></g><mask id="d" fill="#fff"><use xlink:href="#c"/></mask><g/><ellipse fill="#FF8000" mask="url(#d)" cx="70.079" cy="69.973" rx="70.079" ry="69.973"/><path d="M129.54 107.022c-6.73-10.744-10.619-23.443-10.619-37.049s3.89-26.305 10.618-37.049c6.73 10.744 10.618 23.443 10.618 37.05 0 13.605-3.889 26.304-10.618 37.048M248.46 32.924c6.73 10.744 10.619 23.443 10.619 37.05 0 13.605-3.89 26.304-10.618 37.048-6.73-10.744-10.618-23.443-10.618-37.049s3.889-26.305 10.618-37.049" fill="#FFF"/></g></g></svg>`
        const LetterboxdSvgWithoutBg = `<svg id="linker-letterboxd-svg" width="42" height="42" viewBox="0 0 550 430" xmlns="http://www.w3.org/2000/svg"><path fill="#262626" d="M165 103v280h189.156v-69.9H237.724V103z" fill-rule="evenodd"/></svg>`

        function isMobile() {
            const data = navigator.userAgent || navigator.vendor || window.opera

            // Check for userAgentData mobile status (newer browsers)
            // prettier-ignore
            if (navigator.userAgentData?.mobile || /Mobi/i.test(navigator.userAgent) || 'ontouchstart' in document.documentElement || /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(data) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(data.substr(0, 4))) {
                return true
            } else {
                return false
            }
        }

        async function waitForElement(selector, timeout = null, nthElement = 1) {
            // wait till document body loads
            while (!document.body) {
                await new Promise((resolve) => setTimeout(resolve, 10))
            }

            nthElement -= 1

            return new Promise((resolve) => {
                if (document.querySelectorAll(selector)?.[nthElement]) {
                    return resolve(document.querySelectorAll(selector)?.[nthElement])
                }

                const observer = new MutationObserver(async () => {
                    if (document.querySelectorAll(selector)?.[nthElement]) {
                        resolve(document.querySelectorAll(selector)?.[nthElement])
                        observer.disconnect()
                    } else {
                        if (timeout) {
                            async function timeOver() {
                                return new Promise((resolve) => {
                                    setTimeout(() => {
                                        observer.disconnect()
                                        resolve(undefined)
                                    }, timeout)
                                })
                            }
                            resolve(await timeOver())
                        }
                    }
                })

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                })
            })
        }

        async function getImdbRating(imdbId) {
            if (!imdbId) return [undefined, undefined]

            return new Promise((resolve) => {
                try {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://www.imdb.com/title/${imdbId}/ratings`,
                        onload: function (response) {
                            try {
                                const parser = new DOMParser()
                                const dom = parser.parseFromString(response.responseText, "text/html")

                                const rating = dom.querySelector(`div[data-testid="rating-button__aggregate-rating__score"] > span`)?.innerText
                                const numRating = dom.querySelector(`div[data-testid="rating-button__aggregate-rating__score"] + div`)?.innerText

                                resolve([rating, numRating])
                            } catch (parsingError) {
                                console.error("Error parsing IMDb rating data", parsingError)
                                resolve([undefined, undefined])
                            }
                        },
                        onerror: function (error) {
                            console.error(`Can't scrape IMDb: ${imdbId}`, error)
                            resolve([undefined, undefined])
                        },
                    })
                } catch (requestError) {
                    console.error("Failed to initiate IMDb request", requestError)
                    resolve([undefined, undefined])
                }
            })
        }

        function createDividerElement() {
            const divider = document.createElement("div")
            divider.id = "linker-divider"

            return divider
        }

        function createParentContainer() {
            const parentContainer = document.createElement("div")
            parentContainer.id = "linker-parent"

            return parentContainer
        }

        function createLoadingElement() {
            const loadingElement = document.createElement("div")
            loadingElement.id = "linker-loading"

            // Add loading animation CSS
            try {
                GM_addStyle(`
                #linker-loading {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 4px solid #cfcfcf;
                    width: 22px;
                    height: 22px;
                    animation: spin 1s linear infinite;
                }
        
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `)
            } catch (styleError) {
                console.error("Failed to add styles for loading element", styleError)
            }

            return loadingElement
        }

        return {
            isMobile: isMobile,
            waitForElement: waitForElement,
            getImdbRating: getImdbRating,
            svg: {
                ImdbSvg: ImdbSvg,
                ImdbSvgWithoutBg: ImdbSvgWithoutBg,
                letterboxdSvg: letterboxdSvg,
                LetterboxdSvgWithoutBg: LetterboxdSvgWithoutBg,
            },
            element: {
                createDividerElement: createDividerElement,
                createParentContainer: createParentContainer,
                createLoadingElement: createLoadingElement,
            },
        }
    })()

    const imdbPageUtils = (() => {
        function createLetterboxdElement(imdbId) {
            const linkElement = document.createElement("a")
            linkElement.id = "linker-letterboxd-link"
            linkElement.href = imdbId.startsWith("https") ? imdbId : `https://letterboxd.com/imdb/${imdbId}/`
            linkElement.target = "_blank"

            linkElement.innerHTML = commonUtils.svg.letterboxdSvg

            return linkElement
        }

        function createTmdbElement(tmdbData) {
            const linkElement = document.createElement("a")
            linkElement.id = "linker-tmdb-link"
            linkElement.target = "_blank"
            linkElement.innerText = "TMDB"

            try {
                if (tmdbData["media_type"] === "tv_episode") {
                    linkElement.href = `https://www.themoviedb.org/tv/${tmdbData["show_id"]}/season/${tmdbData["season_number"]}/episode/${tmdbData["episode_number"]}`
                } else if (typeof tmdbData === "object") {
                    linkElement.href = `https://www.themoviedb.org/${tmdbData["media_type"]}/${tmdbData.id}`
                } else if (typeof tmdbData === "string") {
                    linkElement.href = tmdbData
                }
            } catch (error) {
                console.error("Failed to create TMDB element", error)
            }

            return linkElement
        }

        function mirrorElements(parentContainer, isMobile, rootElementSelector) {
            const observer = new MutationObserver(() => {
                try {
                    const clonedContainer = parentContainer?.cloneNode(true)

                    commonUtils.waitForElement(rootElementSelector, 10000, !isMobile ? 2 : 1).then((element) => {
                        if (!element) return
                        for (const parentEle of element.querySelectorAll("#linker-parent")) {
                            parentEle?.remove()
                        }
                        element.insertBefore(clonedContainer, element.firstChild)
                    })
                } catch (error) {
                    console.error("Error while mirroring elements", error)
                }
            })

            observer.observe(parentContainer, { childList: true, subtree: true, attributes: true })
        }

        return {
            element: {
                createLetterboxdElement: createLetterboxdElement,
                createTmdbElement: createTmdbElement,
                mirrorElements: mirrorElements,
            },
        }
    })()

    async function imdbTitlePageInjector() {
        const isMobile = location.host.includes("m.imdb")

        const path = location.pathname.split("/")
        const imdbId = path[2] || null

        const parentContainer = commonUtils.element.createParentContainer()
        const letterboxdElement = imdbPageUtils.element.createLetterboxdElement(imdbId)
        const dividerElement = commonUtils.element.createDividerElement()
        const loadingElement = commonUtils.element.createLoadingElement()

        const mobileSelector = 'section.ipc-page-section[data-testid="hero-parent"] > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div > div'
        const desktopSelector = 'section.ipc-page-section[data-testid="hero-parent"] > div:nth-child(2) > div:nth-child(2) > div'

        const rootElementSelector = isMobile ? mobileSelector : desktopSelector

        window.addEventListener("load", () => {
            try {
                commonUtils.waitForElement(rootElementSelector, 10000).then((element) => {
                    element.insertBefore(parentContainer, element.firstChild)
                    imdbPageUtils.element.mirrorElements(parentContainer, true, isMobile ? desktopSelector : mobileSelector)

                    parentContainer.appendChild(letterboxdElement)
                    parentContainer.appendChild(dividerElement)
                    if (!TMDB_API_KEY) return
                    parentContainer.appendChild(loadingElement)
                })
            } catch (error) {
                console.error("Error during element injection on IMDb title page", error)
            }
        })

        // inject parent element if not present
        function injectParentElement() {
            try {
                if (!document.querySelectorAll("#linker-parent")[isMobile ? 1 : 0]) {
                    commonUtils.waitForElement(rootElementSelector, 10000).then((element) => {
                        element.insertBefore(parentContainer, element.firstChild)
                    })
                }
                if (!document.querySelectorAll("#linker-parent")[isMobile ? 0 : 1]) {
                    imdbPageUtils.element.mirrorElements(parentContainer, true, isMobile ? desktopSelector : mobileSelector)
                }
            } catch (error) {
                console.error("Failed to inject parent element", error)
            }
        }

        // inject the parent element every 100ms. Since IMDb sometimes re-renders its components, the parent element may occasionally be removed.
        const intervalId = setInterval(injectParentElement, 100)

        setTimeout(() => {
            clearInterval(intervalId)
        }, 5000)

        if (!TMDB_API_KEY) {
            await commonUtils.waitForElement("#linker-divider")

            try {
                const tmdbElement = imdbPageUtils.element.createTmdbElement(`https://www.themoviedb.org/redirect?external_source=imdb_id&external_id=${imdbId}`)
                parentContainer.appendChild(tmdbElement)
            } catch (error) {
                console.error("Failed to create TMDB element for title page", error)
            }

            return
        }

        try {
            const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`)
            const tmdbRes = await tmdbRawRes.json()
            const tmdbData = tmdbRes["movie_results"]?.[0] || tmdbRes["tv_results"]?.[0] || tmdbRes["tv_episode_results"]?.[0]

            if (tmdbData && (await commonUtils.waitForElement("#linker-loading", 10000))) {
                const tmdbElement = imdbPageUtils.element.createTmdbElement(tmdbData)
                parentContainer.removeChild(loadingElement)
                parentContainer.appendChild(tmdbElement)
            } else {
                parentContainer.removeChild(dividerElement)
                parentContainer.removeChild(loadingElement)
            }
        } catch (error) {
            console.error("Failed to fetch or process TMDB data for title page", error)
            parentContainer.removeChild(dividerElement)
            parentContainer.removeChild(loadingElement)
        }
    }

    async function imdbPersonPageInjector() {
        const isMobile = location.host.includes("m.imdb")

        const path = location.pathname.split("/")
        const imdbId = path[2] || null

        const parentContainer = commonUtils.element.createParentContainer()
        const loadingElement = commonUtils.element.createLoadingElement()

        const rootElementSelector = "div:has( > .starmeter-logo)"

        window.addEventListener("load", () => {
            try {
                commonUtils.waitForElement(rootElementSelector, 10000, isMobile ? 2 : 1).then((element) => {
                    element.insertBefore(parentContainer, element.firstChild)
                    imdbPageUtils.element.mirrorElements(parentContainer, isMobile, rootElementSelector)

                    parentContainer.appendChild(loadingElement)
                })
            } catch (error) {
                console.error("Error during element injection on IMDb person page", error)
            }
        })

        // inject parent element if not present
        function injectParentElement() {
            try {
                if (!document.querySelectorAll("#linker-parent")[isMobile ? 1 : 0]) {
                    commonUtils.waitForElement(rootElementSelector, 10000, isMobile ? 2 : 1).then((element) => {
                        element.insertBefore(parentContainer, element.firstChild)
                    })
                }
                if (!document.querySelectorAll("#linker-parent")[isMobile ? 0 : 1]) {
                    imdbPageUtils.element.mirrorElements(parentContainer, isMobile, rootElementSelector)
                }
            } catch (error) {
                console.error("Failed to inject parent element on person page", error)
            }
        }

        // inject the parent element every 100ms. Since IMDb sometimes re-renders its components, the parent element may occasionally be removed.
        const intervalId = setInterval(injectParentElement, 100)

        setTimeout(() => {
            clearInterval(intervalId)
        }, 5000)

        if (!TMDB_API_KEY) {
            await commonUtils.waitForElement("#linker-loading")

            try {
                const tmdbElement = imdbPageUtils.element.createTmdbElement(`https://www.themoviedb.org/redirect?external_source=imdb_id&external_id=${imdbId}`)
                parentContainer.removeChild(loadingElement)
                parentContainer.appendChild(tmdbElement)
            } catch (error) {
                console.error("Failed to create TMDB element for person page", error)
            }

            return
        }

        try {
            const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`)
            const tmdbRes = await tmdbRawRes.json()
            const tmdbData = tmdbRes["movie_results"]?.[0] || tmdbRes["tv_results"]?.[0] || tmdbRes["tv_episode_results"]?.[0] || tmdbRes["person_results"]?.[0]

            if (tmdbData && (await commonUtils.waitForElement("#linker-loading", 10000))) {
                const tmdbElement = imdbPageUtils.element.createTmdbElement(tmdbData)
                const letterboxdElement = imdbPageUtils.element.createLetterboxdElement(`https://letterboxd.com/tmdb/${tmdbData.id}/person`)
                const dividerElement = commonUtils.element.createDividerElement()

                parentContainer.removeChild(loadingElement)

                parentContainer.appendChild(letterboxdElement)
                parentContainer.appendChild(dividerElement)
                parentContainer.appendChild(tmdbElement)
            } else {
                parentContainer.removeChild(loadingElement)
            }
        } catch (error) {
            console.error("Failed to fetch or process TMDB data for person page", error)
            parentContainer.removeChild(loadingElement)
        }
    }

    const tmdbTitlePageUtils = (() => {
        function createLetterboxdElement(tmdbId, type) {
            try {
                const linkElement = document.createElement("a")
                linkElement.href = `https://letterboxd.com/tmdb/${tmdbId}/${type === "movie" ? "" : type}`
                linkElement.target = "_blank"
                linkElement.innerHTML = commonUtils.svg.letterboxdSvg
                return linkElement
            } catch (error) {
                console.error("Failed to create Letterboxd element:", error)
                return null
            }
        }

        function createImdbContainer() {
            try {
                const imdbContainer = document.createElement("div")
                imdbContainer.id = "linker-imdb-container"
                return imdbContainer
            } catch (error) {
                console.error("Failed to create IMDb container:", error)
                return null
            }
        }

        function createImdbElement(imdbId) {
            try {
                const linkElement = document.createElement("a")
                linkElement.href = `https://imdb.com/title/${imdbId}`
                linkElement.target = "_blank"
                linkElement.innerHTML = commonUtils.svg.ImdbSvg
                return linkElement
            } catch (error) {
                console.error("Failed to create IMDb element:", error)
                return null
            }
        }

        function createImdbRatingElement(rating, numRatings) {
            try {
                const text = rating !== undefined ? `${rating}${numRatings !== undefined ? ` ( ${numRatings} )` : ""}` : null
                const ratingElement = document.createElement("div")
                ratingElement.id = "linker-imdb-rating"
                ratingElement.innerText = text
                return text ? ratingElement : null
            } catch (error) {
                console.error("Failed to create IMDb rating element:", error)
                return null
            }
        }

        return {
            element: {
                createLetterboxdElement: createLetterboxdElement,
                createImdbContainer: createImdbContainer,
                createImdbElement: createImdbElement,
                createImdbRatingElement: createImdbRatingElement,
            },
        }
    })()

    async function tmdbTitlePageInjector() {
        try {
            const isMobile = commonUtils.isMobile()

            const path = location.pathname.split("/")
            const tmdbId = path[2].match(/\d+/)?.[0] || null
            if (!tmdbId) throw new Error("TMDB ID could not be extracted from the URL")

            const parentContainer = commonUtils.element.createParentContainer()
            const letterboxdElement = tmdbTitlePageUtils.element.createLetterboxdElement(tmdbId, path[1])
            const dividerElement = commonUtils.element.createDividerElement()
            const imdbContainer = tmdbTitlePageUtils.element.createImdbContainer()
            const loadingElement = commonUtils.element.createLoadingElement()

            commonUtils.waitForElement(`.header.poster${isMobile ? " > .title" : ""}`, 10000).then((element) => {
                try {
                    if (isMobile) {
                        element.insertBefore(parentContainer, element?.firstChild?.nextSibling?.nextSibling)
                    } else {
                        element.appendChild(parentContainer)
                    }

                    parentContainer.appendChild(letterboxdElement)
                    if (!TMDB_API_KEY) return
                    parentContainer.appendChild(dividerElement)
                    parentContainer.appendChild(imdbContainer)
                    imdbContainer.appendChild(loadingElement)
                } catch (error) {
                    console.error("Error during element injection on TMDB title page:", error)
                }
            })

            if (!TMDB_API_KEY) return

            // Fetch IMDb ID
            const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/${path[1]}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`).catch((error) => {
                console.error("Failed to fetch external IDs from TMDB:", error)
            })
            if (!tmdbRawRes) return

            const tmdbRes = await tmdbRawRes.json()
            const imdbId = tmdbRes["imdb_id"] || null

            if (!imdbId) {
                parentContainer.removeChild(dividerElement)
                parentContainer.removeChild(imdbContainer)
                return
            }

            // Inject IMDb element
            const imdbElement = tmdbTitlePageUtils.element.createImdbElement(imdbId)
            commonUtils.waitForElement(`.header.poster${isMobile ? " > .title" : ""}`, 10000).then(async () => {
                try {
                    await commonUtils.waitForElement("#linker-imdb-container", 5000)
                    imdbContainer.insertBefore(imdbElement, loadingElement)
                } catch (error) {
                    console.error("Error while waiting to inject IMDb element:", error)
                }
            })

            // Scrape IMDb ratings
            const [imdbRating, imdbNumRating] = await commonUtils.getImdbRating(imdbId).catch((error) => {
                console.error("Failed to fetch IMDb rating:", error)
            })

            // Inject IMDb rating element
            const imdbRatingElement = tmdbTitlePageUtils.element.createImdbRatingElement(imdbRating, imdbNumRating)
            await commonUtils.waitForElement("#linker-loading", 10000).catch((error) => {
                console.error("Failed to wait for linker loading:", error)
            })
            try {
                imdbContainer.removeChild(loadingElement)
                if (imdbRatingElement) imdbContainer.appendChild(imdbRatingElement)
            } catch (error) {
                console.error("Failed to inject IMDb rating element:", error)
            }
        } catch (error) {
            console.error("Error in tmdbTitlePageInjector:", error)
        }
    }

    const tmdbPersonPageUtils = (() => {
        function createLogoElement(id, type = "imdb") {
            try {
                const linkContainer = document.createElement("div")

                const linkElement = document.createElement("a")
                linkElement.className = "social_link"
                linkElement.href = type === "imdb" ? `https://www.imdb.com/name/${id}` : `https://letterboxd.com/tmdb/${id}/person`
                linkElement.target = "_blank"
                linkElement.title = `Visit ${type === "imdb" ? "IMDb" : "Letterboxd"}`
                linkElement.rel = "noopener"
                if (type !== "imdb") linkElement.style.width = "38px"

                const svgContainer = document.createElement("div")
                svgContainer.className = "glyphicons_v2"
                svgContainer.style.width = "50px"
                svgContainer.innerHTML = type === "imdb" ? commonUtils.svg.ImdbSvgWithoutBg : commonUtils.svg.LetterboxdSvgWithoutBg

                linkElement.appendChild(svgContainer)
                linkContainer.appendChild(linkElement)

                return linkContainer
            } catch (error) {
                console.error("Failed to create logo element:", error)
                return null
            }
        }

        return {
            element: {
                createLogoElement: createLogoElement,
            },
        }
    })()

    async function tmdbPersonPageInjector() {
        try {
            // Extract TMDB ID from URL
            const path = location.pathname.split("/")
            const tmdbId = path[2].match(/\d+/)?.[0] || null
            if (!tmdbId) throw new Error("TMDB ID could not be extracted from the URL")

            // Create and inject Letterboxd element
            const letterboxdElement = tmdbPersonPageUtils.element.createLogoElement(tmdbId, "letterboxd")

            commonUtils.waitForElement(".social_links", 10000).then((element) => {
                try {
                    element.insertBefore(letterboxdElement, element.firstChild)
                } catch (error) {
                    console.error("Failed to inject Letterboxd element:", error)
                }
            })

            if (!TMDB_API_KEY) return

            // Fetch IMDb ID
            const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/${path[1]}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`).catch((error) => {
                console.error("Failed to fetch external IDs from TMDB:", error)
            })
            if (!tmdbRawRes) return

            const tmdbRes = await tmdbRawRes.json()
            const imdbId = tmdbRes["imdb_id"] || null

            // Inject IMDb element
            if (imdbId) {
                const imdbElement = tmdbPersonPageUtils.element.createLogoElement(imdbId)

                commonUtils.waitForElement(`.social_links`, 10000).then(async (element) => {
                    try {
                        await commonUtils.waitForElement("#linker-letterboxd-svg")
                        element.insertBefore(imdbElement, letterboxdElement.nextElementSibling)
                    } catch (error) {
                        console.error("Failed to inject IMDb element:", error)
                    }
                })
            }
        } catch (error) {
            console.error("Error in tmdbPersonPageInjector:", error)
        }
    }

    function letterboxdTitlePageInjector() {
        commonUtils.waitForElement(`.micro-button.track-event[data-track-action="IMDb"]`, 10000).then(async (element) => {
            try {
                // Preserve original display style
                const originalDisplayStyle = element.style.display

                // Inject loading element
                const loadingElement = commonUtils.element.createLoadingElement()
                element.style.display = "inline-flex"
                element.appendChild(loadingElement)

                // Fetch IMDb ID and get ratings
                const imdbId = element.href?.match(/\/title\/(tt\d+)\/?/)?.[1] ?? null
                if (!imdbId) throw new Error("IMDb ID could not be extracted from the element href")

                const [imdbRating, imdbNumRating] = await commonUtils.getImdbRating(imdbId).catch((error) => {
                    console.error("Failed to fetch IMDb ratings:", error)
                    return [null, null]
                })

                // Remove loading element
                await commonUtils.waitForElement("#linker-loading", 10000)
                element.removeChild(loadingElement)
                element.style.display = originalDisplayStyle

                // Update IMDb button with fetched rating information
                element.innerText = `IMDb${imdbRating ? ` | ${imdbRating}` : ""}${imdbNumRating !== undefined ? ` (${imdbNumRating})` : ""}`
            } catch (error) {
                console.error("Error in letterboxdTitlePageInjector:", error)
            }
        })
    }

    function letterboxdPersonPageInjector() {
        commonUtils.waitForElement(`.micro-button[href^="https://www.themoviedb.org/person/"]`, 10000).then(async (element) => {
            try {
                // open tmdb link in new tab
                element.target = "_blank"

                // To make sure other scripts didn't inject imdb link
                if (document.querySelector(`.micro-button[href^="https://www.imdb.com/name/nm"]`)) return

                // Fetch TMDB ID
                const tmdbId = element.href?.match(/\/person\/(\d+)\/?/)?.[1] ?? null

                if (tmdbId) {
                    // Fetch external IDs
                    const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/person/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`).catch((error) => {
                        console.error("Failed to fetch external IDs from TMDB:", error)
                    })
                    if (!tmdbRawRes) return

                    // Extract IMDb ID
                    const tmdbRes = await tmdbRawRes.json()
                    const imdbId = tmdbRes["external_ids"]["imdb_id"] || null

                    if (imdbId && !document.querySelector(`.micro-button[href^="https://www.imdb.com/name/nm"]`)) {
                        // create IMDb element
                        const imdbElement = element.cloneNode(true)
                        imdbElement.href = `https://www.imdb.com/name/${imdbId}`
                        imdbElement.innerText = "IMDB"
                        imdbElement.target = "_blank"
                        imdbElement.setAttribute("data-track-action", "IMDb")
                        imdbElement.style.marginRight = "5px"

                        // inject IMDb element
                        element.parentElement.insertBefore(imdbElement, element)
                    }
                }
            } catch (error) {
                console.error("Error in letterboxdPersonPageInjector:", error)
            }
        })
    }

    const currentURL = location.protocol + "//" + location.hostname + location.pathname

    if (/^(https?:\/\/[^.]+\.imdb\.com\/title\/tt[^\/]+(?:\/\?.*)?\/?)$/.test(currentURL)) {
        // IMDb title page
        GM_addStyle(imdbPageCss)
        imdbTitlePageInjector()
    } else if (/^(https?:\/\/[^.]+\.imdb\.com\/name\/nm[^\/]+(?:\/\?.*)?\/?)$/.test(currentURL)) {
        // IMDb person page
        GM_addStyle(imdbPageCss)
        imdbPersonPageInjector()
    } else if (/^(https?:\/\/[^.]+\.themoviedb\.org\/(movie|tv)\/\d[^\/]+(?:\/\?.*)?\/?)$/.test(currentURL)) {
        // TMDB title page
        GM_addStyle(tmdbTitlePageCss)
        tmdbTitlePageInjector()
    } else if (/^(https?:\/\/[^.]+\.themoviedb\.org\/person\/\d[^\/]+(?:\/\?.*)?\/?)$/.test(currentURL)) {
        // TMDB person page
        GM_addStyle(tmdbPersonPageCss)
        tmdbPersonPageInjector()
    } else if (/^(https?:\/\/letterboxd\.com\/film\/[^\/]+\/?(crew|details|releases|genres)?\/)$/.test(currentURL)) {
        // Letterboxd title page
        GM_addStyle(letterboxdTitlePageCss)
        letterboxdTitlePageInjector()
    } else if (
        /^(https?:\/\/letterboxd\.com\/(actor|additional-photography|camera-operator|cinematography|composer|costume-design|director|editor|executive-producer|hairstyling|makeup|original-writer|producer|set-decoration|sound|story|visual-effects|writer)\/[A-Za-z0-9-_]+(?:\/(by|language|country|decade|genre|on|year)\/[A-Za-z0-9-_\/]+)?\/(?:page\/\d+\/?)?)$/.test(
            currentURL
        )
    ) {
        // Letterboxd person page
        letterboxdPersonPageInjector()
    }
})()
