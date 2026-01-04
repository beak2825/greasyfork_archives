// ==UserScript==
// @name         GGn Infobox Builder
// @namespace    https://gazellegames.net/
// @version      0.7.4
// @description  Add fields to automatically build an infobox in description.
// @author       VGTal
// @license      Unlicense
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php*
// @downloadURL https://update.greasyfork.org/scripts/543815/GGn%20Infobox%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/543815/GGn%20Infobox%20Builder.meta.js
// ==/UserScript==

///////////////////////
// VARIABLES - START //
///////////////////////

const fieldDefinitions = [
  {
    id: 'author',
    label: {
      singular: 'Author',
      plural:   'Authors'
    },
    matches: [ 'Author\\(s\\)' ]
  },
  {
    id: 'translator',
    label: {
      singular: 'Translator',
      plural:   'Translators'
    },
    matches: [ 'Translator\\(s\\)' ]
  },
  {
    id: 'publisher',
    label: {
      singular: 'Publisher',
      plural:   'Publishers'
    },
    matches: [ 'Publisher\\(s\\)' ]
  },
  {
    id: 'published',
    label: {
      singular: 'Published',
      plural:   'Published'
    },
    matches: [ 'Publication date', 'Publication Date' ]
  },
  {
    id: 'pages',
    label: {
      singular: 'Pages',
      plural:   'Pages'
    },
    matches: [ 'Pages count' ]
  },
  {
    id: 'product-code',
    label: {
      singular: 'Product Code',
      plural:   'Product Codes'
    },
    matches: [ 'SKU' ]
  },
  {
    id: 'layout',
    type: 'select',
    label: {
      singular: 'Layout',
      plural:   'Layouts'
    },
    matches: [ 'Page format' ],
    options: [ 'Pages', 'Spreads', 'Poster', 'Tri-fold', 'Pamphlet', 'Cards' ]
  },
  {
    id: 'bookmarks',
    type: 'select',
    label: {
      singular: 'Bookmarks',
      plural:   'Bookmarks'
    },
    matches: [ 'Has bookmarks' ],
    options: [ 'Yes', 'No', 'Bad' ]
  },
  {
    id: 'hyperlinks',
    type: 'select',
    label: {
      singular: 'Hyperlinks',
      plural:   'Hyperlinks'
    },
    matches: [ 'Has hyperlinks' ],
    options: [ 'Yes', 'No', 'Bad' ]
  },

  {
    id: 'architecture',
    label: {
      singular: 'Architecture',
      plural:   'Architectures'
    },
    matches: [ 'arch' ]
  },
  {
    id: 'unity3d',
    label: {
      singular: 'Unity3D',
      plural:   'Unity3D'
    },
    matches: [ 'unity3d' ]
  },
  {
    id: 'languages',
    label: {
      singular: 'Languages',
      plural:   'Languages'
    },
    matches: [ 'locales' ]
  },
  {
    id: 'media',
    type: 'select',
    label: {
      singular: 'Media',
      plural:   'Media'
    },
    matches: [ 'Media' ],
    options: [ 'Digital', 'Scan' ]
  },
  {
    id: 'ocr',
    label: {
      singular: 'OCR',
      plural:   'OCR'
    },
    matches: [ 'ocr' ]
  },
  {
    id: 'dpi',
    label: {
      singular: 'DPI',
      plural:   'DPI'
    },
    matches: [ 'dpi' ]
  },
  {
    id: 'isbn-10',
    label: {
      singular: 'ISBN-10',
      plural:   'ISBN-10'
    },
    matches: [ 'ISBN10' ]
  },
  {
    id: 'isbn-13',
    label: {
      singular: 'ISBN-13',
      plural:   'ISBN-13'
    },
    matches: [ 'ISBN13' ]
  }
]

const linkDefinitions = [
  {
    id: 'official-shop',
    label: 'Official Shop',
    matches: [ 'Official Website' ],
    searchTemplate: 'https://www.google.com/search?q=[SEARCH_STRING] official shop'
  },
  {
    id: 'drivethrurpg',
    label: 'DriveThruRPG',
    matches: [ 'DTRPG' ],
    searchTemplate: 'http://drivethrurpg.com/browse.php?keywords=[SEARCH_STRING]'
  },
  {
    id: 'itchio',
    label: 'Itch.io',
    matches: [ 'itch.io' ],
    searchTemplate: 'https://www.google.com/search?q=site:itch.io+[SEARCH_STRING]'
  },
  {
    id: 'rpggeek',
    label: 'RPGGeek',
    matches: [ 'RPGG' ],
    searchTemplate: 'https://rpggeek.com/geeksearch.php?action=search&objecttype=rpgitem&q=[SEARCH_STRING]'
  },
  {
    id: 'pathfinder-wiki',
    label: 'Pathfinder Wiki',
    matches: [ 'PF Wiki' ],
    searchTemplate: 'https://pathfinderwiki.com/w/index.php?search=[SEARCH_STRING]'
  },
  {
    id: 'lexicanum-wiki',
    label: 'Lexicanum Wiki',
    matches: [ 'Lexicanum' ],
    searchTemplate: 'https://wh40k.lexicanum.com/mediawiki/index.php?search=[SEARCH_STRING]'
  },
  {
    id: 'goodreads',
    label: 'GoodReads',
    matches: [ 'goodreads' ],
    searchTemplate: 'https://www.goodreads.com/search?utf8=%E2%9C%93&query=[SEARCH_STRING]'
  }
]

const metadataTemplates = [
  {
    id: 'ttrpg',
    rows: [
      [ 'author', 'publisher', 'published', 'pages', 'product-code' ],
      [ 'layout', 'bookmarks', 'hyperlinks' ]
    ],
    links: [ 'official-shop', 'drivethrurpg','itchio','rpggeek' ]
  },
  {
    id: 'ttrpg-translated',
    rows: [
      [ 'translator', 'publisher', 'published', 'pages', 'product-code' ],
      [ 'layout', 'bookmarks', 'hyperlinks' ]
    ],
    links: [ 'official-shop', 'drivethrurpg','itchio','rpggeek' ]
  },
  {
    id: 'ttrpg-bundling',
    rows: [
      [ 'author', 'publisher', 'published', 'pages', 'product-code' ],
      [ 'media', 'ocr', 'dpi', 'layout', 'bookmarks', 'hyperlinks', 'isbn-10', 'isbn-13' ]
    ],
    links: [ 'official-shop', 'drivethrurpg','itchio','rpggeek' ]
  },
  {
    id: 'ttrpg-pathfinder',
    rows: [
      [ 'author', 'publisher', 'published', 'pages', 'product-code' ],
      [ 'layout', 'bookmarks', 'hyperlinks' ]
    ],
    links: [ 'official-shop', 'drivethrurpg','itchio','rpggeek', 'pathfinder-wiki' ]
  },
  {
    id: 'ttrpg-warhammer',
    rows: [
      [ 'author', 'publisher', 'published', 'pages', 'product-code' ],
      [ 'layout', 'bookmarks', 'hyperlinks' ]
    ],
    links: [ 'official-shop', 'drivethrurpg','itchio','rpggeek', 'lexicanum-wiki' ]
  },
  {
    id: 'ebook',
    rows: [
      [ 'author', 'publisher', 'published', 'pages' ]
    ],
    links: [ 'goodreads' ]
  },
  {
    id: 'games',
    rows: [
      [ 'architecture', 'unity3d', 'languages' ]
    ]
  }
]

let metadataTemplateId = 'ttrpg'
let metadataTemplate = metadataTemplates.find(t => t.id === metadataTemplateId)


/////////////////////
// VARIABLES - END //
/////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////
// INJECTOR - START //
//////////////////////
// The injector is used to target an element and use it as "anchor" to our component.
// As long as this element exist, and the component doesn't, the injector will launch the init.
// This notably mean the component DOM can be deleted to re-init it.


// Element presence/absence observer.
const waitForElement = (selector, elementMustExist = true) => {
  const isResolvable = () => {
    if (elementMustExist) {
      return document.querySelector(selector)
    } else {
      return !document.querySelector(selector)
    }
  }

  return new Promise(resolve => {
    if (isResolvable()) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      if (isResolvable()) {
        observer.disconnect()
        resolve(document.querySelector(selector))
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

// Start watcher for the release description presence (the "anchor").
const watchReleaseDescForInit = () => {
  logDebug('Watching for release description textarea presence...')
  waitForElement('#release_desc, #torrent_link [name="description"]', true).then((element) => {
    logDebug('Found release description textarea.')
    initInfobox()

    logDebug('Watching for Infobox description row destruction...')
    waitForElement('#infobox-row', false).then((element) => {
      logDebug('Infobox description row destruction observed.')
      watchReleaseDescForInit()
    })
  })
}

////////////////////
// INJECTOR - END //
////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////
// MAIN - START //
//////////////////

// Build and inject the description infobox row in the main DOM.
const initInfobox = () => {
  logDebug('Initializing infobox row...')

  const releaseDescriptionTextarea = getDescriptionTextarea()
  const releaseDescriptionRow = releaseDescriptionTextarea.closest('tr')
  const releaseInformationTBody = releaseDescriptionRow.closest('tbody')

  const infoboxRow = buildInfoboxRow()

  releaseInformationTBody.insertBefore(infoboxRow, releaseDescriptionRow)

  releaseDescriptionTextarea.addEventListener('input', syncFromDescription)
  syncFromDescription()

  reloadTemplate()

  logDebug('Initialized infobox row.')
}

// Rebuild the infobox form following a specific template.
const loadTemplate = (templateKey) => {
  metadataTemplateId = templateKey
  metadataTemplate = metadataTemplates.find(t => t.id === metadataTemplateId)

  document.getElementById('infobox-template-switch-container').querySelectorAll('button').forEach((btn) => {
    btn.style.outline = btn.innerHTML === metadataTemplateId ? '1px solid chartreuse' : ''
  })

  // METADATA /////

  // Reset all metadatum fields.
  forEachFieldDefinition('all', (fieldDefinition) => {
    const fieldInputHolder = document.querySelector(`#infobox-${fieldDefinition.id}`).closest('.infobox-input-holder')
    fieldInputHolder.style.display = 'none'
    fieldInputHolder.style.outline = ''
  })

  // Show template metadatum fields.
  metadataTemplate.rows.forEach((fields) => {
    forEachFieldDefinition(fields, (fieldDefinition) => {
      const fieldInputHolder = document.querySelector(`#infobox-${fieldDefinition.id}`).closest('.infobox-input-holder')
      fieldInputHolder.style.display = 'flex'
    })
  })

  // Show foreign metadatum fields.
  forEachFieldDefinition('all', (fieldDefinition) => {
    const fieldInput = document.querySelector(`#infobox-${fieldDefinition.id}`)
    const fieldInputHolder = fieldInput.closest('.infobox-input-holder')
    const hasValue = findValuesForFieldDefinitionInDescription(fieldDefinition).length > 0
    const isForeign = fieldInputHolder.style.display !== 'flex'

    if (hasValue && isForeign) {
      fieldInputHolder.style.display = 'flex'
      fieldInputHolder.style.outline = '3px dashed red'
    }
  })

  // LINKS //////

  // Reset all link fields.
  forEachLinkDefinition('all', (linkDefinition) => {
    const fieldInputHolder = document.querySelector(`#infobox-${linkDefinition.id}`).closest('.infobox-input-holder')
    fieldInputHolder.style.display = 'none'
    fieldInputHolder.style.outline = ''
  })

  // Show template link fields.
  if (!!metadataTemplate.links) {
    forEachLinkDefinition(metadataTemplate.links, (linkDefinition) => {
      const fieldInputHolder = document.querySelector(`#infobox-${linkDefinition.id}`).closest('.infobox-input-holder')
      fieldInputHolder.style.display = 'flex'
    })
  }

  // Show foreign link fields.
  forEachLinkDefinition('all', (linkDefinition) => {
    const fieldInput = document.querySelector(`#infobox-${linkDefinition.id}`)
    const fieldInputHolder = fieldInput.closest('.infobox-input-holder')
    const hasValue = findValuesForLinkDefinitionInDescription(linkDefinition).length > 0
    const isForeign = fieldInputHolder.style.display !== 'flex'

    if (hasValue && isForeign) {
      fieldInputHolder.style.display = 'flex'
      fieldInputHolder.style.outline = '3px dashed red'
    }
  })
}

const reloadTemplate = () => {
  loadTemplate(metadataTemplateId)
}

////////////////
// MAIN - END //
////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////
// DOM BUILDER - START //
/////////////////////////

// Build the DOM for the infobox.
const buildInfoboxRow = () => {
  // Build the row holding everything.
  const infoboxRow = buildElement('tr', {
    id: 'infobox-row',
    styles: {
      border: '1px solid var(--c-main-brdr)'
    }
  })

  // Build row label cell.
  infoboxRow.appendChild(buildElement('td', { classes: [ 'label' ], innerHTML: 'Infobox' }))

  // Build cell holding all inputs (span all the remaining columns).
  const mainCell = buildElement('td', { colSpan: 100 })
  infoboxRow.appendChild(mainCell)

  mainCell.appendChild(buildTemplateSwitcher())
  mainCell.appendChild(buildInfoboxForm())
  mainCell.appendChild(buildInfoboxToolbar())

  return infoboxRow
}

// Build the DOM for the template switch buttons.
const buildTemplateSwitcher = () => {
  // Build the container holding all fields.
  const templateSwitchContainer = buildElement('div', {
    id: 'infobox-template-switch-container',
    classes: [ 'pad' ]
  })

  // Build template switcher buttons.
  metadataTemplates.forEach(templateDefinition => {
    templateSwitchContainer.appendChild(buildElement('button', {
      type: 'button',
      innerHTML: templateDefinition.id,
      styles: {
        margin: '1em 1em 1em 0'
      },
      onClick: () => { loadTemplate(templateDefinition.id) }
    }))
  })

  return templateSwitchContainer
}

// Build the DOM for the infobox form.
const buildInfoboxForm = () => {
  // Build the container holding all fields.
  const formContainer = buildElement('div')

  formContainer.appendChild(buildMetadataForm())

  // Title between meta and links.
  formContainer.appendChild(buildElement('h3', {
    innerHTML: 'Links',
    styles: {
      textAlign: 'center',
      marginTop: '1em'
    }
  }))

  formContainer.appendChild(buildLinksForm())

  return formContainer
}

// Build the DOM for the infobox metadata form.
const buildMetadataForm = () => {
  // Build the container holding all the metadata fields.
  const metadataContainer = buildElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: '1em'
    }
  })

  // Build all metadatum fields.
  forEachFieldDefinition('all', (fieldDefinition) => {
    metadataContainer.appendChild(buildMetadataField(fieldDefinition))
  })

  return metadataContainer
}

// Build the DOM for a metadatum field.
const buildMetadataField = ({ id, label, type, options }) => {
  const fieldContainer = buildElement('div', {
    classes: [ 'infobox-input-holder' ],
    styles: {
      display: 'flex',
      flexDirection: 'column'
    }
  })

  fieldContainer.appendChild(buildElement('span', {
    classes: [ 'infobox-input-label' ],
    innerHTML: `${label?.singular}:`
  }))

  if (type === 'select') {
    const select = buildElement('select', {
      id: `infobox-${id}`,
      classes: [ 'infobox-input' ],
      onInput: syncToDescription
    })

    ;['', ...(options ?? [])].forEach(option => {
      select.appendChild(buildElement('option', {
        innerHTML: option,
        value: option
      }))
    })

    fieldContainer.appendChild(select)
  } else {
    fieldContainer.appendChild(buildElement('input', {
      type: 'text',
      id: `infobox-${id}`,
      classes: [ 'infobox-input' ],
      onInput: syncToDescription
    }))
  }

  return fieldContainer
}

// Build the DOM for the infobox form.
const buildLinksForm = () => {
  // Build the container holding all the link fields.
  const linksContainer = buildElement('div', {
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: '1em'
    }
  })

  // Build all link fields.
  forEachLinkDefinition('all', (linkDefinition) => {
    linksContainer.appendChild(buildLinkField(linkDefinition))
  })

  return linksContainer
}

// Build the DOM for an infobox link field.
const buildLinkField = ({ id, label, searchTemplate }) => {
  const releaseTitleInput = document.querySelector('#release_title, #torrent_link [name="title"]')

  const fieldContainer = buildElement('div', {
    classes: [ 'infobox-input-holder' ],
    styles: {
      display: 'flex',
      flexDirection: 'column'
    }
  })

  const inputLabel = buildElement('span', {
    classes: [ 'infobox-input-label' ],
    innerHTML: `${label}:`
  })

  if (!!searchTemplate) {
    const searchShortcut = buildElement('a', {
      classes: [ 'infobox-field-search-link' ],
      innerHTML: ' [S]',
      target: '_blank',
      href: searchTemplate.replace('[SEARCH_STRING]', releaseTitleInput?.value)
    })

    inputLabel.appendChild(searchShortcut)

    // Update the search shortcut when the release title is modified.
    releaseTitleInput?.addEventListener('change', (event) => {
      searchShortcut.href = searchTemplate.replace('[SEARCH_STRING]', event.target.value)
    })
  }

  fieldContainer.appendChild(inputLabel)

  fieldContainer.appendChild(buildElement('input', {
    type: 'text',
    id: `infobox-${id}`,
    classes: [ 'infobox-input' ],
    onInput: syncToDescription
  }))

  return fieldContainer
}

const buildInfoboxToolbar = () => {
  const infoboxToolbarContainer = buildElement('div', {
    id: 'infobox-toolbar-container',
    classes: [ 'pad' ]
  })

  infoboxToolbarContainer.appendChild(buildTtrpgBundleFinalizeButton())

  return infoboxToolbarContainer
}

// Build the DOM for the button to finalize the description into a bundling friendly format.
const buildTtrpgBundleFinalizeButton = () => {
  const ttrpgBundleFinalizeButton = buildElement('button', {
    type: 'button',
    innerHTML: 'TTRPG - Convert to bundling format',
    styles: {
      margin: '1em 1em 1em 0'
    },
    onClick: ttrpgBundleFinalize
  })

  return ttrpgBundleFinalizeButton
}


///////////////////////
// DOM BUILDER - END //
///////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////
// ACTIONS - START //
/////////////////////


const syncToDescription = () => {
  const startTime = performance.now()
  logDebug('Building infobox code...')

  const getFieldContent = (fieldName) => document.querySelector(`#infobox-${fieldName}`)?.value
  const getFieldLabel = (fieldName) => document.querySelector(`#infobox-${fieldName}`)?.closest('.infobox-input-holder')?.querySelector('.infobox-input-label')?.innerHTML

  let infoboxCode = ''

  // METADATA /////////////////////

  const buildMetadataRow = (fieldNames) => {
    const metadataFields = []

    fieldNames.forEach((fieldName) => {
      const fieldContent = getFieldContent(fieldName)
      const fieldLabel = getFieldLabel(fieldName)

      if (!!fieldContent) {
        metadataFields.push(`${fieldLabel} [b]${fieldContent}[/b]`)
      }
    })

    return metadataFields.join(' | ')
  }

  buildMetadataRows = (fieldNamesRows) => (
    fieldNamesRows.map(fieldNames => buildMetadataRow(fieldNames)).filter(i => !!i).join('\r')
  )

  const templateRows = []

  // Template rows
  metadataTemplate.rows.forEach((fields) => {
    const templateRow = []

    forEachFieldDefinition(fields, (fieldDefinition) => {
      templateRow.push(fieldDefinition.id)
    })

    templateRows.push(templateRow)
  })

  // Foreign row
  const foreignRow = fieldDefinitions.filter(fd => !metadataTemplate.rows.flat().includes(fd.id)).map(fd => fd.id)
  templateRows.push(foreignRow)

  infoboxCode += buildMetadataRows(templateRows)

  if (infoboxCode.length !== 0) {
    infoboxCode = `[align=center][quote]${infoboxCode}[/quote][/align]`
  }

  // LINKS /////////////////////

  const buildLinkRow = () => {
    const linkFields = []

    forEachLinkDefinition('all', (linkDefinition) => {
      const fieldContent = getFieldContent(linkDefinition.id)
      const fieldLabel = getFieldLabel(linkDefinition.id)

      if (!!fieldContent) {
        linkFields.push(`[url=${fieldContent}]${linkDefinition.label}[/url]`)
      }
    })

    return linkFields.join(' | ')
  }

  linksCode = buildLinkRow()

  if (linksCode.length !== 0) {
    infoboxCode += `[align=center]${linksCode}[/align]`
  }

  // FINAL COMPOSITION /////////////////////

  logDebug('Infobox code', infoboxCode)

  const releaseDescriptionTextarea = getDescriptionTextarea()

  // Remove current infobox.
  releaseDescriptionTextarea.value = releaseDescriptionTextarea.value.trim().replace(/^(\[align=center\]\[quote\]([\S\s]*?)\[\/quote\]\[\/align\])/g, '').trim()
  // Remove current links.
  releaseDescriptionTextarea.value = releaseDescriptionTextarea.value.trim().replace(/^(\[align=center\]([\S\s]*?)\[\/align\])/g, '').trim()
  // Prepend new infobox & links.
  if (infoboxCode.length !== 0) {
    releaseDescriptionTextarea.value = infoboxCode + "\r" + releaseDescriptionTextarea.value
  }

  const endTime = performance.now()
  logDebug(`Infobox built in ${endTime - startTime}ms.`)
}

const syncFromDescription = () => {
  logDebug('Updating fields from raw description...')

  // Search for current template metadata in description.
  forEachFieldDefinition('all', (fieldDefinition) => {
    const values = findValuesForFieldDefinitionInDescription(fieldDefinition)
    const field = document.querySelector(`#infobox-${fieldDefinition.id}`)

    if (!!field) {
      field.value = values[0] ?? ''
    }
  })

  // Search for current template links in description.
  forEachLinkDefinition('all', (linkDefinition) => {
    const values = findValuesForLinkDefinitionInDescription(linkDefinition)
    const field = document.querySelector(`#infobox-${linkDefinition.id}`)

    if (!!field) {
      field.value = values[0] ?? ''
    }
  })
}

const ttrpgBundleFinalize = () => {
  logDebug('Preparing description for bundling...')

  const releaseDescriptionTextarea = getDescriptionTextarea()

  const releaseName = document.getElementById('release_title').value
  const isBook      = document.getElementById('miscellaneous').value === 'E-Book'
  const isDigital   = document.getElementById('digital').checked
  const dpi         = document.getElementById('scan_dpi').value
  const otherDpi    = document.getElementById('other_dpi').value
  const isOcr       = document.getElementById('scan_ocr').checked
  const isbn        = document.getElementById('isbn').value

  loadTemplate('ttrpg-bundling')

  if (isBook) {
    setFieldValue('media', isDigital ? 'Digital' : 'Scan')
    setFieldValue('isbn-13', isbn)

    if (!isDigital) {
      setFieldValue('dpi', dpi === 'Other' ? otherDpi : dpi)
      setFieldValue('ocr', isOcr ? 'Yes' : 'No')
    }
  }

  syncToDescription()

  // Wrap description in spoiler tags.
  releaseDescriptionTextarea.value = `[hide=${releaseName}]${releaseDescriptionTextarea.value}[/hide]`

  syncFromDescription()
}

///////////////////
// ACTIONS - END //
///////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////
// HELPERS - START //
/////////////////////

const logDebug = (...messages) => {
  const css = 'background: #222; color: #57d8a7; font-weight: 900;'
  console.debug('%c[GGn Infobox]', css, ...messages)
}

// Generic elements builder.
const buildElement = (tag, { id, classes, styles, datasets, innerHTML, type, onClick, onInput, target, href, colSpan, value } = {}) => {
  const element = document.createElement(tag)

  if (id) { element.id = id }
  if (type) { element.type = type }
  if (target) { element.target = target }
  if (href) { element.href = href }
  if (colSpan) { element.colSpan = colSpan }
  if (value) { element.value = value }
  if (innerHTML) { element.innerHTML = innerHTML }

  if (onClick) {
    element.addEventListener('click', onClick)
  }

  if (onInput) {
    element.addEventListener('input', onInput)
  }

  if (classes) {
    classes.forEach((klass) => {
      element.classList.add(klass)
    })
  }

  if (styles) {
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value
    }
  }

  if (datasets) {
    for (const [key, value] of Object.entries(datasets)) {
      element.dataset[key] = value
    }
  }

  return element
}

const forEachFieldDefinition = (fields, callback) => {
  if (fields === 'all') {
    fields = fieldDefinitions.map(fd => fd.id)
  }

  fields.forEach((fieldId) => {
    const fieldDefinition = fieldDefinitions.find(fd => fd.id === fieldId)
    callback(fieldDefinition)
  })
}

const forEachLinkDefinition = (links, callback) => {
  if (links === 'all') {
    links = linkDefinitions.map(ld => ld.id)
  }

  links.forEach((linkId) => {
    const linkDefinition = linkDefinitions.find(ld => ld.id === linkId)
    callback(linkDefinition)
  })
}

const findValuesForFieldDefinitionInDescription = (fieldDefinition) => {
  const matches = [ fieldDefinition.label.singular, fieldDefinition.label.plural, ...fieldDefinition.matches ]

  const releaseDescription = getDescriptionTextarea().value

  const values = matches.map(matchValue => {
    // Regex capture the bolded text right after the expected label.
    const metaRegex = new RegExp(String.raw`^\[align=center\]\[quote\][\S\s]*?${matchValue}: \[b\]([\S\s]*?)\[\/b\][\S\s]*?\[\/quote\]\[\/align\]`, 'g')
    const results = metaRegex.exec(releaseDescription)
    return results?.[1]
  }).filter(v => !!v)

  return values
}

const findValuesForLinkDefinitionInDescription = (linkDefinition) => {
  const matches = [ linkDefinition.label, ...linkDefinition.matches ]

  const releaseDescription = getDescriptionTextarea().value

  const values = matches.map(matchValue => {
    // Regex capture the bolded text right after the expected label.
    const metaRegex = new RegExp(String.raw`^\[align=center\][\S\s]*?\[url=([^\]]*?)\]${matchValue}\[\/url\][\S\s]*?[\S\s]*?\[\/align\]`, 'g')
    const results = metaRegex.exec(releaseDescription)
    return results?.[1]
  }).filter(v => !!v)

  return values
}

// Set the value in the input for the field corresponding to the definition id.
const setFieldValue = (fieldName, value) => {
  logDebug(`Set field ${fieldName} to ${value}`)
  const field = document.getElementById(`infobox-${fieldName}`)
  field.value = value
  return value
}

const getDescriptionTextarea = () => {
  return document.querySelector('#release_desc, #torrent_link [name="description"]')
}


///////////////////
// HELPERS - END //
///////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////
// INIT - START //
//////////////////


watchReleaseDescForInit()


////////////////
// INIT - END //
////////////////
