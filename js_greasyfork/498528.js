// ==UserScript==
// @name          Kinozal Magnetizer + TorrServer
// @description   Magnet link-icon maker for kinozal.(tv|me|guru) + "Add to TorrServer" button
// @version       1.12
// @match         *://kinozal.tv/details.php*
// @match	      *://kinozal.me/details.php*
// @match	      *://kinozal.guru/details.php*
// @match         *://kinozal.tv/browse.php*
// @match	      *://kinozal.me/browse.php*
// @match	      *://kinozal.guru/browse.php*
// @run-at        document-end

// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle

// @copyright     2024, MSerj
// @license       MIT
// @namespace     https://greasyfork.org/en/users/1321619-mserj
// @icon          data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTkgNTkiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIHN0eWxlPSJmaWxsOiM0MjRBNjA7IiBkPSJNNDYsNDEuNUgyNmMtNi42MjcsMC0xMi01LjM3My0xMi0xMnYwYzAtNi42MjcsNS4zNzMtMTIsMTItMTJoMjB2LTE0SDI2Yy0xNC4zNTksMC0yNiwxMS42NDEtMjYsMjYJdjBjMCwxNC4zNTksMTEuNjQxLDI2LDI2LDI2aDIwVjQxLjV6Ij48L3BhdGg+PGc+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTMsNy41aDFjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTNTIuNDQ4LDcuNSw1Myw3LjV6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNDksNy41aDFjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTNDguNDQ4LDcuNSw0OSw3LjV6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTcsNy41aDFjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTNTYuNDQ4LDcuNSw1Nyw3LjV6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTQsMTMuNWgtMWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgxYzAuNTUyLDAsMS0wLjQ0NywxLTFTNTQuNTUyLDEzLjUsNTQsMTMuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik00OSwxNS41aDFjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTNDguNDQ4LDE1LjUsNDksMTUuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik01OCwxMy41aC0xYy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDFjMC41NTIsMCwxLTAuNDQ3LDEtMVM1OC41NTIsMTMuNSw1OCwxMy41eiI+PC9wYXRoPgk8cGF0aCBzdHlsZT0iZmlsbDojQzdDQUM3OyIgZD0iTTUwLDEwLjVjMCwwLjU1MywwLjQ0OCwxLDEsMWgxYzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xaC0xQzUwLjQ0OCw5LjUsNTAsOS45NDcsNTAsMTAuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik01NCwxMC41YzAsMC41NTMsMC40NDgsMSwxLDFoMWMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMWgtMUM1NC40NDgsOS41LDU0LDkuOTQ3LDU0LDEwLjV6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTQsNDQuNWgtMWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgxYzAuNTUyLDAsMS0wLjQ0NywxLTFTNTQuNTUyLDQ0LjUsNTQsNDQuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik00OSw0Ni41aDFjMC41NTIsMCwxLTAuNDQ3LDEtMXMtMC40NDgtMS0xLTFoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTNDguNDQ4LDQ2LjUsNDksNDYuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik01OCw0NC41aC0xYy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDFjMC41NTIsMCwxLTAuNDQ3LDEtMVM1OC41NTIsNDQuNSw1OCw0NC41eiI+PC9wYXRoPgk8cGF0aCBzdHlsZT0iZmlsbDojQzdDQUM3OyIgZD0iTTU0LDUyLjVoLTFjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMWMwLjU1MiwwLDEtMC40NDcsMS0xUzU0LjU1Miw1Mi41LDU0LDUyLjV6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTAsNTIuNWgtMWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgxYzAuNTUyLDAsMS0wLjQ0NywxLTFTNTAuNTUyLDUyLjUsNTAsNTIuNXoiPjwvcGF0aD4JPHBhdGggc3R5bGU9ImZpbGw6I0M3Q0FDNzsiIGQ9Ik01OCw1Mi41aC0xYy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDFjMC41NTIsMCwxLTAuNDQ3LDEtMVM1OC41NTIsNTIuNSw1OCw1Mi41eiI+PC9wYXRoPgk8cGF0aCBzdHlsZT0iZmlsbDojQzdDQUM3OyIgZD0iTTUzLDQ5LjVjMC0wLjU1My0wLjQ0OC0xLTEtMWgtMWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgxQzUyLjU1Miw1MC41LDUzLDUwLjA1Myw1Myw0OS41CQl6Ij48L3BhdGg+CTxwYXRoIHN0eWxlPSJmaWxsOiNDN0NBQzc7IiBkPSJNNTcsNDkuNWMwLTAuNTUzLTAuNDQ4LTEtMS0xaC0xYy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDFDNTYuNTUyLDUwLjUsNTcsNTAuMDUzLDU3LDQ5LjUJCXoiPjwvcGF0aD48L2c+PHJlY3QgeD0iMzIiIHk9IjMuNSIgc3R5bGU9ImZpbGw6I0VCQkExNjsiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCI+PC9yZWN0PjxyZWN0IHg9IjMyIiB5PSI0MS41IiBzdHlsZT0iZmlsbDojRUJCQTE2OyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0Ij48L3JlY3Q+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/498528/Kinozal%20Magnetizer%20%2B%20TorrServer.user.js
// @updateURL https://update.greasyfork.org/scripts/498528/Kinozal%20Magnetizer%20%2B%20TorrServer.meta.js
// ==/UserScript==

// Styles for the download button
GM_addStyle(`.mserj-download-btn {
    display: inline-block;
    height: 32px;
    width: 32px;
    border: none;
    background-image: url(data:image/webp;base64,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);
    background-size: 32px 32px;
  }`)

// Styles for setting modal
GM_addStyle('#mserj_settings { width: 400px; min-height: 150px; position: fixed; left: 0; top: 0; background-color: #fff; border: 1px solid #a00; }')
GM_addStyle(`#mserj_settings .header {\tbackground: #f1d29c;\tpadding: 10px;\tfont-weight: bold; text-align: center; }`)
GM_addStyle('#mserj_settings .fields { padding: 5px; }')
GM_addStyle('#mserj_settings .fields .row { display: flex; margin-bottom: 10px; }')
GM_addStyle('#mserj_settings .fields .row .label { display: flex; align-items: center; }')
GM_addStyle('#mserj_settings .fields .row .label span { margin-right: 10px; }')
GM_addStyle('#mserj_settings .fields .row .label span:first-child { width: 100px; }')

// Magnet icon SVG data
const magnetIcon = `
  <svg width="25" height="25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 59 59" xml:space="preserve">
    <path style="fill:#424A60;" d="M46,41.5H26c-6.627,0-12-5.373-12-12v0c0-6.627,5.373-12,12-12h20v-14H26c-14.359,0-26,11.641-26,26 v0c0,14.359,11.641,26,26,26h20V41.5z"/>
    <g>
      <path style="fill:#C7CAC7;" d="M53,7.5h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1S52.448,7.5,53,7.5z"/>
      <path style="fill:#C7CAC7;" d="M49,7.5h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1S48.448,7.5,49,7.5z"/>
      <path style="fill:#C7CAC7;" d="M57,7.5h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1S56.448,7.5,57,7.5z"/>
      <path style="fill:#C7CAC7;" d="M54,13.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S54.552,13.5,54,13.5z"/>
      <path style="fill:#C7CAC7;" d="M49,15.5h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1S48.448,15.5,49,15.5z"/>
      <path style="fill:#C7CAC7;" d="M58,13.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S58.552,13.5,58,13.5z"/>
      <path style="fill:#C7CAC7;" d="M50,10.5c0,0.553,0.448,1,1,1h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1C50.448,9.5,50,9.947,50,10.5z"/>
      <path style="fill:#C7CAC7;" d="M54,10.5c0,0.553,0.448,1,1,1h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1C54.448,9.5,54,9.947,54,10.5z"/>
      <path style="fill:#C7CAC7;" d="M54,44.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S54.552,44.5,54,44.5z"/>
      <path style="fill:#C7CAC7;" d="M49,46.5h1c0.552,0,1-0.447,1-1s-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1S48.448,46.5,49,46.5z"/>
      <path style="fill:#C7CAC7;" d="M58,44.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S58.552,44.5,58,44.5z"/>
      <path style="fill:#C7CAC7;" d="M54,52.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S54.552,52.5,54,52.5z"/>
      <path style="fill:#C7CAC7;" d="M50,52.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S50.552,52.5,50,52.5z"/>
      <path style="fill:#C7CAC7;" d="M58,52.5h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1c0.552,0,1-0.447,1-1S58.552,52.5,58,52.5z"/>
      <path style="fill:#C7CAC7;" d="M53,49.5c0-0.553-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1C52.552,50.5,53,50.053,53,49.5z"/>
      <path style="fill:#C7CAC7;" d="M57,49.5c0-0.553-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1s0.448,1,1,1h1C56.552,50.5,57,50.053,57,49.5z"/>
    </g>
    <rect x="32" y="3.5" style="fill:#EBBA16;" width="14" height="14"/>
    <rect x="32" y="41.5" style="fill:#EBBA16;" width="14" height="14"/>
  </svg>
`

// TorrServer icon
const torrServerIcon = `<img src="data:image/png;base64,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" width="25px" height="25px"  alt="TorrServer" />`

/**
 * Settings stuff
 */
let settings = {}
const loadSettings = () => {
	settings = {
		showMagnetButton: GM_getValue('showMagnetButton', true),
		showDownloadButton: GM_getValue('showDownloadButton', false),
		showAddToTorrServerButton: GM_getValue('showAddToTorrServerButton', false),
		torrServerIp: GM_getValue('torrServerIp', 'localhost'),
		torrServerPort: GM_getValue('torrServerPort', 8090),
		torrServerLogin: GM_getValue('torrServerLogin', ''),
		torrServerPassword: GM_getValue('torrServerPassword', '')
	}
}

// modal to configure settings
const toggleSettings = () => {
	const $sett_wnd = $('#mserj_settings'),
		x = parseInt(($(window).width() - $sett_wnd.width()) / 2),
		y = parseInt(($(window).height() - $sett_wnd.height()) / 2)

	$('#mserj_showMagnetButton').attr('checked', !!settings.showMagnetButton)
	$('#mserj_showDownloadButton').attr('checked', !!settings.showDownloadButton)

	$('#mserj_showAddToTorrServerButton').attr('checked', !!settings.showAddToTorrServerButton)
	$('#mserj_torrServerIp').val(settings.torrServerIp)
	$('#mserj_torrServerPort').val(settings.torrServerPort)
	$('#mserj_torrServerLogin').val(settings.torrServerLogin)
	$('#mserj_torrServerPassword').val(settings.torrServerPassword)

	$('#mserj_settings').css({ left: x, top: y }).toggle('fast')
}

const attachSettingsModal = () => {
	const $tab = $('<li><a href="javascript:;" title="Настройки скрипта Kinozal Magnetizer"><div>Настройки</div></a></li>')

	$tab.click(toggleSettings)
	$('.menu > ul').append($tab)

	const modal = $(`
	  <div id="mserj_settings" style="display: none">
	    <div class="header">Настройка скрипта</div>
	    <div class="fields">
	      <div class="row">
	        <label class="label">
	          <input type="checkbox" id="mserj_showMagnetButton">
	          <span>Показывать кнопку "magnet"</span>
	          ${magnetIcon}
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <input type="checkbox" id="mserj_showDownloadButton">
	          <span>Показывать кнопку "скачать"</span>
	          <button class="mserj-download-btn"></button>
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <input type="checkbox" id="mserj_showAddToTorrServerButton">
	          <span>Показывать кнопку "TorrServer"</span>
	          ${torrServerIcon}
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <span>TorrServer IP</span>
	          <input type="text" id="mserj_torrServerIp">
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <span>TorrServer Port</span>
	          <input type="text" id="mserj_torrServerPort">
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <span>TorrServer Login</span>
	          <input type="text" id="mserj_torrServerLogin">
	        </label>
	      </div>
	      <div class="row">
	        <label class="label">
	          <span>TorrServer Password</span>
	          <input type="password" id="mserj_torrServerPassword">
	        </label>
	      </div>
	      <div class="row" style="justify-content: center">
	        <input type="button" value="Сохранить настройки" id="mserj_save_settings" />
	      </div>
	    </div>
	  </div>
	`)
	$('body').append(modal)

	$('#mserj_save_settings').on('click', () => {
		GM_setValue('showMagnetButton', $('#mserj_showMagnetButton').is(':checked'))
		GM_setValue('showDownloadButton', $('#mserj_showDownloadButton').is(':checked'))

		GM_setValue('showAddToTorrServerButton', $('#mserj_showAddToTorrServerButton').is(':checked'))
		GM_setValue('torrServerIp', $('#mserj_torrServerIp').val())
		GM_setValue('torrServerPort', $('#mserj_torrServerPort').val())
		GM_setValue('torrServerLogin', $('#mserj_torrServerLogin').val())
		GM_setValue('torrServerPassword', $('#mserj_torrServerPassword').val())

		loadSettings()
		$('#mserj_settings').toggle('fast')
		location.reload()
	})
}

/**
 * TorrServer stuff
 */
function addToTorrServer(data) {
	$.ajax({
		method: 'POST',
		url: `${settings.torrServerIp}:${settings.torrServerPort}/torrents`,
		dataType: 'json',
		data: JSON.stringify({ action: 'add', save_to_db: true, ...data }),
		headers: {
			'Content-Type': 'application/json',
			...(settings.torrServerLogin &&
				settings.torrServerPassword && { Authorization: 'Basic ' + btoa(settings.torrServerLogin + ':' + settings.torrServerPassword) })
		},
		success: () => {
			alert('Успешно добавлено в TorrServer')
		},
		error: response => {
			if (response.status === 401) {
				alert('Авторизация не удалась! Проверьте ( соединение / логин / пароль )')
			} else {
				alert('Не удалось отправить запрос на TorrServer')
			}
		}
	})
}

// Fetch torrent poster
async function fetchTorrentPoster(url) {
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const htmlString = await response.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(htmlString, 'text/html')

		const poster = doc.querySelector('img.p200')
		if (poster) {
			return poster.src
		} else {
			return null
		}
	} catch (error) {
		console.error('Error fetching or parsing HTML:', error)
		return null
	}
}

/**
 * handle search page case
 */
const processSearchPage = () => {
	// Function to fetch torrent hash and add download/magnet links
	async function processTorrentRow(row) {
		const torrentUrl = $(row).find('.nam a').attr('href')
		const uArgs = torrentUrl.split('?')[1].split('&')

		// Find torrent id
		let id = uArgs.find(el => el.startsWith('id='))?.split('=')[1]

		if (id) {
			if (settings.showDownloadButton) {
				// Create download button
				const downloadCell = document.createElement('td')
				const link = document.createElement('a')
				link.className = 'mserj-download-btn'
				link.href = `${location.origin}/download.php?id=${id}`
				downloadCell.appendChild(link)
				row.insertBefore(downloadCell, row.firstChild)
			}

			if (settings.showMagnetButton || settings.showAddToTorrServerButton) {
				// Fetch torrent hash
				const response = await fetch(`/get_srv_details.php?id=${id}&action=2`)
				const html = await response.text()
				const dom = new DOMParser().parseFromString(html, 'text/html')
				const torrentHash = dom.querySelector('ul > li:first-child')?.innerText.substr(10)

				if (settings.showMagnetButton && torrentHash) {
					// Create magnet link
					const magnetCell = document.createElement('td')
					const magnetLink = document.createElement('a')
					magnetLink.title = 'Magnet-ссылка' // Assuming 'ссылка' means 'link'
					magnetLink.href = `magnet:?xt=urn:btih:${torrentHash}`
					magnetLink.style.display = 'block'
					magnetLink.style.fontSize = '0px'
					magnetLink.innerHTML = magnetIcon

					magnetCell.appendChild(magnetLink)
					row.insertBefore(magnetCell, row.firstChild)
				}

				// Adding "add to torrServer" button to the page.
				if (settings.showAddToTorrServerButton && torrentHash) {
					// Create torrServer button
					const torrServerCell = document.createElement('td')
					const torrServerButton = document.createElement('button')
					torrServerButton.id = `add_to_torrserver-${id}`
					torrServerButton.title = 'Добавить в TorrServer'
					torrServerButton.style.display = 'block'
					torrServerButton.style.fontSize = '0px'
					torrServerButton.style.border = 'none'
					torrServerButton.style.padding = '0px'
					torrServerButton.style.cursor = 'pointer'
					torrServerButton.innerHTML = torrServerIcon

					torrServerCell.appendChild(torrServerButton)
					if (settings.showMagnetButton) {
						row.firstChild.parentNode.insertBefore(torrServerCell, row.firstChild.nextSibling) // something like row.insertAfter(torrServerCell, row.firstChild)
					} else {
						row.insertBefore(torrServerCell, row.firstChild)
					}

					$(`#add_to_torrserver-${id}`).on('click', () => {
						;(async () => {
							const poster = await fetchTorrentPoster(torrentUrl)
							addToTorrServer({
								link: `magnet:?xt=urn:btih:${torrentHash}`,
								poster
							})
						})()
					})
				}
			}
		}
	}

	const table = $('.t_peer')
	const tableHeader = table.find('.mn')

	// Add empty cells for download and magnet links in the table header
	settings.showDownloadButton && tableHeader.prepend('<td class="z"></td>')
	settings.showMagnetButton && tableHeader.prepend('<td class="z"></td>')
	settings.showAddToTorrServerButton && tableHeader.prepend('<td class="z"></td>')

	// Process each row in the table (excluding the header row)
	table
		.find('tr')
		.not(tableHeader)
		.each((i, row) => {
			processTorrentRow(row)
		})
}

/**
 * handle details page case
 */
const processDetailsPage = async () => {
	// Finding download button cell.
	const downloadCell = document.querySelector('.w100p td:first-of-type')

	// Fetching torrent hash string.
	const response = await (await fetch(`/get_srv_details.php?id=${new URL(location.href).searchParams.get('id')}&action=2`)).text()

	// Converting response text to dom element, so we can easily traverse and extract torrent hash with querySelector.
	const dom = new DOMParser().parseFromString(response, 'text/html')
	const torrentHash = dom.documentElement.querySelector('ul > li:first-child').innerText.substr(10)

	// Adding magnet link to the page.
	if (settings.showMagnetButton) {
		downloadCell.insertAdjacentHTML(
			'beforebegin',
			`<td style="width: 30px;"><a title="Magnet-ссылка" href="magnet:?xt=urn:btih:${torrentHash}" style="display: block; font-size: 0;">${magnetIcon}</a></td>`
		)
	}

	// Adding "add to torrServer" button to the page.
	if (settings.showAddToTorrServerButton) {
		downloadCell.insertAdjacentHTML(
			'beforebegin',
			`<td style="width: 30px;"><button class="add_to_torrserver" title="Добавить в TorrServer" style="display: block; font-size: 0; border: none; padding: 0; cursor: pointer;">${torrServerIcon}</button></td>`
		)
		const poster = $('.p200').attr('src')
		$('.add_to_torrserver').on('click', e => {
			addToTorrServer({
				link: `magnet:?xt=urn:btih:${torrentHash}`,
				poster: poster.startsWith('http') ? poster : `${location.origin}/${poster}`
			})
		})
	}
}

/**
 * Main script starts here after page is ready
 */
$(document).ready(function () {
	loadSettings()
	attachSettingsModal()
	switch (location.pathname) {
		case '/details.php':
			processDetailsPage()
			break
		case '/browse.php':
			processSearchPage()
			break
	}
})
