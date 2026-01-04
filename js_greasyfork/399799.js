// ==UserScript==
// @name         DB9 Better Torrent Detail Page Info Columns
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds uploader, upload date, and file count columns on torrent detail pages.
// @author       ivylab
// @match        https://www.deepbassnine.com/torrents.php?*id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399799/DB9%20Better%20Torrent%20Detail%20Page%20Info%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/399799/DB9%20Better%20Torrent%20Detail%20Page%20Info%20Columns.meta.js
// ==/UserScript==

(() => {
  const doc = document
  const torrents = [...doc.querySelectorAll('.group_torrent')]

  const getUploader = (torrent) => {
    const profileDetails =
      torrent.nextElementSibling.querySelector('a[title="Profile Details"]')

    return profileDetails
      ? `<a href="${profileDetails.href}">${profileDetails.textContent}</a>`
      : 'anonymous'
  }

  const getUploadTime = (torrent) => {
    const uploadTime =
      new Date(torrent.nextElementSibling.querySelector('.time').title)

    return uploadTime.toISOString().slice(0, -8).replace('T', ' ')
  }

  const getFileInfo = (torrent) => {
    const files =
      [...torrent.nextElementSibling.querySelectorAll('[id^="files_"] tr')]
      .slice(1)

    let audioFiles = 0
    let otherFiles = 0
    let otherFilesSize = 0

    files.forEach((file) => {
      const fileName = file.children[0].textContent
      const isAudioFile = !!fileName.match(/\.(flac|mp3|wav)$/i)
      if (isAudioFile) {
        audioFiles++
      } else {
        otherFiles++

        const fileSize = file.children[1].textContent

        if (fileSize.includes('MB')) {
          otherFilesSize += fileSize.slice(0, -3) * 1000 * 1000
        } else if (fileSize.includes('KB')) {
          otherFilesSize += fileSize.slice(0, -3) * 1000
        } else if (fileSize.includes(' B')) {
          otherFilesSize += +fileSize.slice(0, -2)
        }
      }
    })

    if (otherFilesSize > 10000000) {
      otherFilesSize = `Extras: ${Math.round(otherFilesSize / 1000000)} MB`
    } else {
      otherFilesSize = false
    }

    return [
      `${audioFiles}${otherFiles ? `+${otherFiles}` : ''}`,
      otherFilesSize,
    ]
  }

  const addTableColumns = (() => {
    const colHead = doc.querySelector('.torrent_table > tbody > tr')
    const uploaderHead = doc.createElement('td')
    const uploadDateHead = doc.createElement('td')
    const uploadFileCountHead = doc.createElement('td')
    const editionInfo = doc.querySelector('.edition_info > td')

    uploaderHead.innerHTML = '<strong>Uploader</strong>'
    uploadDateHead.innerHTML = '<strong>Date</strong>'
    uploadFileCountHead.innerHTML = '<strong>Files</strong>'
    colHead.insertBefore(uploadFileCountHead, colHead.children[1])
    colHead.insertBefore(uploadDateHead, colHead.children[1])
    colHead.insertBefore(uploaderHead, colHead.children[1])

    editionInfo.colSpan = 8
  })()

  const addTorrentInfos = (() => {
    torrents.forEach((torrent) => {
      const uploader = getUploader(torrent)
      const uploadTime = getUploadTime(torrent)
      const uploadDate = uploadTime.slice(0, 10)
      const [fileCount, otherFilesSize] = getFileInfo(torrent)

      torrent.nextElementSibling.querySelector('.pad > td').colSpan = 8

      const tdUploader = doc.createElement('td')
      tdUploader.className = 'uploader nobr'
      tdUploader.innerHTML = uploader

      const tdUploadDate = doc.createElement('td')
      tdUploadDate.className = 'upload-date nobr'
      tdUploadDate.innerHTML = uploadDate
      tdUploadDate.title = uploadTime

      const tdFileCount = doc.createElement('td')
      tdFileCount.className = 'file-count nobr'
      tdFileCount.innerHTML = fileCount

      if (otherFilesSize) {
        tdFileCount.title = otherFilesSize
        tdFileCount.classList.add('big-extra-files')
      }

      torrent.insertBefore(tdFileCount, torrent.children[1])
      torrent.insertBefore(tdUploadDate, torrent.children[1])
      torrent.insertBefore(tdUploader, torrent.children[1])
    })
  })()

  const addCss = (() => {
    const style = doc.createElement('style')
    style.innerHTML = `
      .group_torrent * + td {
        padding: 5px 8px;
      }

      .file-count,
      .uploader,
      .upload-date,
      td.sign {
        text-align: center;
      }

      .group_torrent > td:nth-last-child(1),
      .group_torrent > td:nth-last-child(2),
      .group_torrent > td:nth-last-child(3),
      .group_torrent > td:nth-last-child(4) {
        text-align: right;
      }

      .big-extra-files {
        background-color: rgba(80, 0, 0, 0.2);
      }
    `

    doc.head.appendChild(style)
  })()
})()
