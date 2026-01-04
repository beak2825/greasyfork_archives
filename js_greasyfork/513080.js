// ==UserScript==
// @name        AFF Downloader
// @namespace   Violentmonkey Scripts
// @match       https://www.asianfanfics.com/*
// @description Scrape a story and save as EPUB with the full text.
// @version     1.0.1
// @author      zhuzhu309
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513080/AFF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513080/AFF%20Downloader.meta.js
// ==/UserScript==

const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

const toXml = (text) => {
    var doc = new DOMParser().parseFromString(text, 'text/html');
    var result = new XMLSerializer().serializeToString(doc);
    return result.replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '').replace('</body></html>', '')
}

const toValidFilename = (text) => {
    return (text.replace(/[\/|\\:*?"<>]/g, " "));
}

(function() {
  'use strict'

  var head = document.head;
  var body = document.body;

  let ficMeta = document.querySelector('.main-meta .title-meta')
  ficMeta.innerHTML += `<span>
  <a id="fic-download-btn" href="#"><i class="icon-arrow-down">Download</i></a>
</span>`

  document.getElementById('fic-download-btn').addEventListener('click', (e) => {
    e.preventDefault()

    let url = window.location.href
    const storyId = url.match(/view\/(\d+)/)[1];
    window.location.href = 'https://www.asianfanfics.com/story/view/' + storyId
    sessionStorage.setItem('aff-fic-export-progress', 0)
  })

  function exportPopup() {
    const style = document.createElement('style')
    style.textContent = `.modal {
  position: fixed;
  top: 10%;
  padding: 0 30px 30px 30px;
  border-radius: 8px;
  background-color: #3d3d3d;
  z-index: 60000;
  width: 400px;
  min-height: 100px;
  display: none;
  left: 50%;
  margin-left: -200px;
  max-height: 80%;
  box-sizing: border-box;
  color: #ccc!important;
}

.modal.on {
  display: block;
}
.modal-js-overlay {
  background: #444;
  opacity: .8;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 1000px;
  z-index: 20000;
  left: 0px;
}
.modal-js-close {
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: black;
  color: white;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  text-align: center;
  padding: 1px;
  top: -10px;
  right: -10px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}`
    head.appendChild(style)

    let title = document.getElementById('story-title').innerText
    let descEl = document.getElementById('story-description')
    let description = descEl == null ? '' : descEl.innerText

    const html = `<div class='modal'>
  <h3 style="color:#ccc">Export `+title+`</h3>
Book description:<br>
  <textarea id="epub-description">`+description+`</textarea>
  <button id="export-epub" class="button button--dark">Export as EPUB</button>
</div>`
    const popupContainer = document.createElement('div')
    popupContainer.innerHTML = html
    body.appendChild(popupContainer)

    let bg = document.createElement("div");
    bg.className = "modal-js-overlay";
    body.appendChild(bg);

    let el = document.querySelector('.modal')

    let close = document.createElement("span");
    close.className = "modal-js-close";
    close.innerHTML = "x";
    close.addEventListener('click', function () {
      let overlay = body.querySelector(".modal-js-overlay");
      let closebtn = body.querySelector(".modal-js-close");
      body.removeChild(overlay);

      el.classList.remove('on');
      el.removeChild(closebtn);

      sessionStorage.removeItem('aff-fic-export-progress')
    });
    el.appendChild(close)

    document.getElementById('export-epub').addEventListener('click', (e) => {
      e.preventDefault()

      scrapeChapter()
    })
    el.classList.add('on');

    // store most important metadata temporarily in the browser
    // as we are going to be switching the page
    let author, updatedDate, publishedDate, matureStatus, twStatus, completeStatus, tags, characters, wordCount, link
    let rows = document.querySelectorAll('.main-meta > .row-meta')
    rows.forEach(row => {
      let label = row.querySelector('.text--info.text--info--desc')
      if (label == undefined) return
      label = label.innerText
      if (label == "Author(s)") {
        author = row.querySelector('a').innerText
      } else if (label == "Updated") {
        updatedDate = row.querySelector('time').innerText
      } else if (label == "Published") {
        publishedDate = row.querySelector('time').innerText
      } else if (label == "Status") {
        let completed = row.querySelector('span.completed')
        if (completed != undefined) {
          completeStatus = true
        }
        let warnings = row.querySelectorAll('span.text--negative')
        warnings.forEach(warn => {
          if (warn.innerText == "[M]") {
            matureStatus = true
          } else if (warn.innerText == "[TW]") {
            twStatus = true
          }
        })
      } else if (label == "Tags") {
        tags = row.innerText.replace("Tags\n", "").replaceAll("\n", ", ")
      } else if (label == "Characters") {
        characters = row.innerText.replace("Characters", "").replaceAll("\n", ", ")
      } else if (label == "Total Word Count") {
        wordCount = row.innerText.replace("Total Word Count", "").replace(" words", "")
      }
    })

    let metadata = {
      "title": escapeHtml(title),
      "description": escapeHtml(description),
      "author": author,
      "updated": updatedDate,
      "published": publishedDate,
      "m": matureStatus,
      "tw": twStatus,
      "complete": completeStatus,
      "tags": tags,
      "characters": characters,
      "wordcout": parseInt(wordCount),
      "link": window.location.href
    }
    sessionStorage.setItem('aff-fic-export-metadata', JSON.stringify(metadata))
  }

  function scrapeChapter() {
    let chapterTitle = document.getElementById('chapter-title')
    let bodyText = document.getElementById('bodyText')
    let exportChapter = parseInt(sessionStorage.getItem('aff-fic-export-progress'))
    let nextChapterBtn = document.querySelector('footer.main-meta > div:last-child > span > a:not(.right-spacer)')

    if (exportChapter > 0) {
      // store chapter temporarily
      let chapter = {
        "title": chapterTitle.innerText,
        "text": toXml(bodyText.innerHTML)
      }
      sessionStorage.setItem('aff-fic-export-chapter-' + exportChapter, JSON.stringify(chapter))
    }
    sessionStorage.setItem('aff-fic-export-progress', exportChapter + 1)

    if (nextChapterBtn !== null) {
      // when finished, go to the next chapter
      setTimeout(() => {
        nextChapterBtn.click()
      }, 50)
    } else {
      console.log("Scraping finished.")

      epub()
      reset()
    }
  }

  function reset() {
    const chaptersCount = parseInt(sessionStorage.getItem('aff-fic-export-progress'))
    if (chaptersCount)
      for (let i=1; i<chaptersCount; i++)
        sessionStorage.removeItem('aff-fic-export-chapter-' + i)

    sessionStorage.removeItem('aff-fic-export-progress')
    sessionStorage.removeItem('aff-fic-export-metadata')
  }

  let exportChapter = parseInt(sessionStorage.getItem('aff-fic-export-progress'))
  if (exportChapter === 0) {
    exportPopup()
  } else if (exportChapter > 0) {
    scrapeChapter()
  }

  function getStatusString(meta) {
    var tags = []
    if (meta.m) {
      tags.push('[M]')
    }
    if (meta.tw) {
      tags.push('[TW]')
    }
    if (meta.complete) {
      tags.push('Complete')
    } else {
      tags.push('Incomplete')
    }
    return tags.join(', ')
  }

  function epub() {
    let ficMetadata = sessionStorage.getItem('aff-fic-export-metadata')
    if (ficMetadata == null) {
      alert('No metadata set. Try downloading again.')
      return
    }

    try {
      ficMetadata = JSON.parse(ficMetadata)
    } catch(error) {
      console.error(error)
      alert('No metadata set. Try downloading again.')
      return
    }

    let author = ficMetadata.author
    let title = ficMetadata.title
    let description = ficMetadata.description
    let tags = ficMetadata.tags
    let link = ficMetadata.link

    // thanks stackoverflow https://stackoverflow.com/questions/74870022/how-to-create-an-epub-from-javascript
    var zip = new JSZip();
    function uuidv4() {
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
      );
    }
    var book_uuid = uuidv4().toUpperCase()
    var chaptersCount = parseInt(sessionStorage.getItem('aff-fic-export-progress'))

    // Set the metadata for the book
    var mimetype = 'application/epub+zip';
    zip.file("mimetype", mimetype);

    var container = '<?xml version="1.0"?>' +
        '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">' +
        '  <rootfiles>' +
        '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />' +
        '  </rootfiles>' +
        '</container>';
    zip.file("META-INF/container.xml", container);

    var metadata = '<?xml version="1.0"?>' +
        '<package version="3.0" xml:lang="en" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id">' +
        '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        '    <dc:identifier id="book-id">urn:uuid:'+book_uuid+'</dc:identifier>' +
        '    <meta refines="#book-id" property="identifier-type" scheme="xsd:string">uuid</meta>' +
        '    <meta property="dcterms:modified">2000-03-24T00:00:00Z</meta>' +
        '    <dc:language>en</dc:language>' +
        '    <dc:title>' + title + '</dc:title>' +
        '    <dc:creator opf:role="aut" opf:file-as="' + author + '">' + author + '</dc:creator>' +
        '    <dc:description>' + description + '</dc:description>' +
        '    <dc:publisher>Asianfanfics</dc:publisher>' +
        '    <dc:subject>Fanworks</dc:subject>'
    tags.split(", ").forEach(tag => metadata += `    <dc:subject>${tag}</dc:subject>`)
    metadata += '  </metadata>' +
        '  <manifest>';
    for (let num=0;num < chaptersCount; num++)
      metadata += ' <item id="text_' + num + '" href="text_' + num + '.xhtml" media-type="application/xhtml+xml"/>'
    metadata += '   <item id="toc" href="../OEBPS/toc.ncx" media-type="application/x-dtbncx+xml"/>' +
        '  </manifest>' +
        '  <spine toc="toc">'
    for (let num=0;num < chaptersCount; num++)
      metadata += '    <itemref idref="text_' + num + '"/>'
    metadata += '  </spine>' +
        '</package>'
    zip.file("OEBPS/content.opf", metadata);

    // Set the table of contents for the book
    var toc = '<?xml version="1.0"?>' +
        '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">' +
        '  <head>' +
        '    <meta name="dtb:uid" content="urn:uuid:'+book_uuid+'"/>' +
        '    <meta name="dtb:depth" content="1"/>' +
        '    <meta name="dtb:totalPageCount" content="0"/>' +
        '    <meta name="dtb:maxPageNumber" content="0"/>' +
        '  </head>' +
        '  <docTitle>' +
        '    <text>' + title + '</text>' +
        '  </docTitle>' +
        '  <navMap>' +
        '    <navPoint id="navpoint-0" playOrder="0">' +
        '      <navLabel>' +
        '        <text>Preface</text>' +
        '      </navLabel>' +
        '      <content src="text_0.xhtml#preface"/>' +
        '    </navPoint>'
    for (let num=1;num < chaptersCount; num++) {
      let chapter = JSON.parse(sessionStorage.getItem('aff-fic-export-chapter-' + num))

      toc += '    <navPoint id="navpoint-'+num+'" playOrder="'+num+'">' +
        '      <navLabel>' +
        '        <text>' + chapter.title + '</text>' +
        '      </navLabel>' +
        '      <content src="text_' + num + '.xhtml#chapter'+num+'"/>' +
        '    </navPoint>'
    }
    toc += '  </navMap></ncx>';
    zip.file("OEBPS/toc.ncx", toc);

    // Add a preface
    var statusString = getStatusString(ficMetadata)
    var text = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
        '<!DOCTYPE html>' +
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">' +
        '  <head>' +
        `    <title>${title} - ${author}</title>` +
        '  </head>' +
        '  <body>' +
        '   <section id="preface">' +
        `   <p style="text-align:center"><b>${title}</b><br/>Posted originally on Asianfanfics at <a href="${link}">${link}</a>.</p>` +
        '   <dl class="tags">' +
        '     <dt>Author(s):</dt>' +
        `     <dd>${author}</dd>` +
        '     <dt>Updated:</dt>' +
        `     <dd>${ficMetadata.updated}</dd>` +
        '     <dt>Published:</dt>' +
        `     <dd>${ficMetadata.published}</dd>` +
        '     <dt>Status:</dt>' +
        `     <dd>${statusString}</dd>` +
        '     <dt>Characters:</dt>' +
        `     <dd>${ficMetadata.characters}</dd>` +
        '     <dt>Tags:</dt>' +
        `     <dd>${tags}</dd>` +
        '   </dl>' +
        `   <p><b>Description:</b><br/>${description}</p>` +
        '   </section>' +
        '  </body>' +
        '</html>';
    zip.file(`OEBPS/text_0.xhtml`, text);

    // Add the text of the book to the ZIP file
    for (let num=1;num < chaptersCount; num++) {
      let chapter = JSON.parse(sessionStorage.getItem('aff-fic-export-chapter-' + num))

      var text = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
        '<!DOCTYPE html>' +
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">' +
        '  <head>' +
        `    <title>${title} - ${author}</title>` +
        '  </head>' +
        '  <body>' +
        `    <section id="chapter${num}">` +
        `     <h1>${chapter.title}</h1>${chapter.text}` +
        '    </section>' +
        '  </body>' +
        '</html>';
      zip.file(`OEBPS/text_${num}.xhtml`, text);
    }

    // Generate a downloadable EPUB file from the ZIP file
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      const epubFilename = toValidFilename(title).substring(0,50) + '.epub';
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = epubFilename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
})()
