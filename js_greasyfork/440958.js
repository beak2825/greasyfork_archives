// ==UserScript==
// @name					Goodreads Libby Results
// @namespace			https://github.com/Dylancyclone/goodreads-libby-userscript
// @version				1.2.1
// @description		Searches for the book you are looking at on Goodreads across all your libby libraries
// @author				Dylancyclone
// @match					https://libbyapp.com/interview/menu
// @include				/^https?://.*\.goodreads\.com/book/show.*$/
// @icon					https://www.google.com/s2/favicons?sz=64&domain=libbyapp.com
// @grant					GM.setValue
// @grant					GM.getValue
// @license				MIT
// @downloadURL https://update.greasyfork.org/scripts/440958/Goodreads%20Libby%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/440958/Goodreads%20Libby%20Results.meta.js
// ==/UserScript==
window.addEventListener(
	"load",
	function () {
		;(function () {
			"use strict"

			const syncLibraries = () => {
				// Grab libraries from libby and remove circular references
				let libraries = unsafeWindow.APP.libraries.all.map((library) => {
					return {
						baseKey: library.baseKey,
						_: { activeKey: library._.activeKey, name: library._.name },
					}
				})
				libraries = JSON.stringify(libraries)
				GM.setValue("libraries", libraries)
			}

			const createLibbyButton = () => {
				let builderDiv = document.createElement("div")
				builderDiv.innerHTML = `
					<div class="summary-list-action">
						<button class="summary-list-action-add-library halo" role="button" type="button">
								<span role="text">Save Libraries (userscript)</span>
						</button>
					</div>
				`.trim()
				let libbySyncButton = builderDiv.firstChild
				libbySyncButton.onclick = syncLibraries
				return libbySyncButton
			}

			const renderSearchResults = async (
				libraries,
				searchString,
				targetDiv,
				openInOverdrive
			) => {
				targetDiv.innerHTML = ""
				if (libraries.length === 0) {
					targetDiv.innerHTML = `No libraries found, please visit <a href="https://libbyapp.com/interview/menu" target="_blank">here</a> to sync your libraries.`
				}

				libraries.map((library) => {
					let libraryKey = library._.activeKey || library.baseKey
					let url = `https://thunder.api.overdrive.com/v2/libraries/${libraryKey}/media?query=${searchString}`
					fetch(url)
						.then((response) => response.json())
						.then((result) => {
							let ebookCount = result.items.filter(
								(item) => item.type.id === "ebook"
							).length
							let audiobookCount = result.items.filter(
								(item) => item.type.id === "audiobook"
							).length
							let link = openInOverdrive
								? `https://${library.baseKey}.overdrive.com/search?query=${searchString}`
								: `https://libbyapp.com/search/${library.baseKey}/search/query-${searchString}/page-1`
							targetDiv.innerHTML += `
								<tr>
									<td style="padding-right: 20px;">${library._.name}</td>
									<td>
										<a href="${link}" target="_blank">
											${ebookCount || "-"} 📕 / ${audiobookCount || "-"} 🎧
										</a>
									</td>
								</tr>`
						})
				})
			}

			const createGoodreadsResults = async () => {
				let builderDiv = document.createElement("div")

				let bookTitle = document
					.querySelector("[data-testid='bookTitle']")
					.innerHTML.trim()
				let bookAuthor = document
					.querySelector("[data-testid='name']")
					.innerHTML.trim()
				let searchString = encodeURIComponent(`${bookTitle} ${bookAuthor}`)
				let libraries = JSON.parse(await GM.getValue("libraries", "[]"))
				let openInOverdrive = JSON.parse(
					await GM.getValue("openInOverdrive", "false")
				)
				builderDiv.innerHTML = `
					<div style="
						background-color: #ececec;
						border: 1px solid black;
						margin-top: 25px;
						padding: 1em;"
					>
						<h3>Libby results</h3>
						<table id="libby-results">
							<tr>
								<th style="margin-right: 20px;">Library</th>
								<th>Results</th>
							</tr>
						</table>
						<div style="margin-top: 10px;">
							<p> Open links in: </p>
							<input type="radio" id="openInLibbyButton" name="openLinksIn" value="libby" ${
								!openInOverdrive ? "checked" : ""
							}>
							<label for="libby">Libby</label>
							<input type="radio" id="openInOverdriveButton" name="openLinksIn" value="overdrive" ${
								openInOverdrive ? "checked" : ""
							}>
							<label for="overdrive">Overdrive</label>
						</div>
					</div>
				`.trim()

				let libbyResults = builderDiv.querySelector("#libby-results")
				let openInLibbyButton = builderDiv.querySelector("#openInLibbyButton")
				openInLibbyButton.onclick = () => {
					GM.setValue("openInOverdrive", "false")
					renderSearchResults(libraries, searchString, libbyResults, false)
				}
				let openInOverdriveButton = builderDiv.querySelector(
					"#openInOverdriveButton"
				)
				openInOverdriveButton.onclick = () => {
					GM.setValue("openInOverdrive", "true")
					renderSearchResults(libraries, searchString, libbyResults, true)
				}

				renderSearchResults(
					libraries,
					searchString,
					libbyResults,
					openInOverdrive
				)

				return builderDiv.firstChild
			}

			/**
			 * Add the buttons
			 * Might outrun the rest of the dom,
			 * so keep retrying until the container is ready
			 */
			const addLibbyButton = () => {
				let container = document.getElementsByClassName("summary-list-section-actions")
				if (container && container[0]) {
					container[0].parentNode.insertBefore(
						createLibbyButton(),
						container[0].nextSibling
					)
				} else {
					setTimeout(addLibbyButton, 10)
				}
			}

			const addGoodreadsResults = async () => {
				let container = document.getElementsByClassName("BookDetails")
				if (container && container[0]) {
					createGoodreadsResults().then((goodreadsResults) => {
						let test = container[0].parentNode.insertBefore(
							goodreadsResults,
							container[0].nextSibling
						)
					})
				} else {
					setTimeout(addGoodreadsResults, 10)
				}
			}

			if (unsafeWindow.location.host == "libbyapp.com") {
				addLibbyButton()
			} else if (unsafeWindow.location.host == "www.goodreads.com") {
				addGoodreadsResults()
			}
		})()
	},
	false
)
