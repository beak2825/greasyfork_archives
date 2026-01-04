// ==UserScript==
// @name        CMS links
// @namespace   urn://com.typeform.cms-links
// @include     *
// @exclude     none
// @version     1.0.4
// @description:en	Provides links from your site to Contentful.
// @grant    		none
// @description Provides links from your site to Contentful.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446787/CMS%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/446787/CMS%20links.meta.js
// ==/UserScript==

const CLASSNAME_NAMESPACE = 'cms-links'
const CONTENTFUL_LINK_CLASSNAME = `${CLASSNAME_NAMESPACE}__contentful-link`
const CONTENTFUL_BUTTON_CLASSNAME = `${CLASSNAME_NAMESPACE}__activation-button`
const MIN_POSITION = { left: 0, top: 85 }
const CONTENT_TAG_NAMES = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'div',
  'img',
]
const PROPERTIES_OF_INTEREST = [
  'title',
  'name',
  'description',
  'headline',
  'quote',
  'message',
  'alt',
]
let CONTENTFUL_ENTRY_URL_FORMAT =
  'https://app.contentful.com/spaces/{{space}}/entries/{{id}}'
let CONTENTFUL_ASSET_URL_FORMAT =
  'https://app.contentful.com/spaces/{{space}}/assets/{{id}}'
let contentfulEntryUrlSchema = null
let contentfulAssetUrlSchema = null
let zendeskUrlSchema = null
let entries = []
let matchingElements = []
let siteExcluded = false
let siteForceIncluded = false

const cmsDataAvailable = () =>
  contentfulEntryUrlSchema || contentfulAssetUrlSchema || zendeskUrlSchema

const cmsNames = () => {
  const cmsNameList = []
  if (contentfulEntryUrlSchema || contentfulAssetUrlSchema) {
    cmsNameList.push(`Contentful`)
  }
  if (zendeskUrlSchema) {
    cmsNameList.push(`Zendesk`)
  }

  if (cmsNameList.length === 0) {
    return 'no CMS'
  }
  return cmsNameList.join(' and ')
}

// const pause = (duration) =>
//   new Promise((res) => setTimeout(() => res(), duration));

// Leaving this here for now as it's a really useful util:
// const waitFor = async (getterFunction, options = {}, numberOfTries = 0) => {
//   const { wait = 200, maxRetries = 150 } = options;
//   const { conditionMet, output } = getterFunction();
//   if (conditionMet) {
//     return output;
//   }
//   if (numberOfTries > maxRetries) {
//     return null;
//   }
//   await pause(wait);
//   return await waitFor(getterFunction, options, numberOfTries + 1);
// };

const objectTraverseModify = (obj, objModifier, valueModifier) => {
  const objClone = JSON.parse(JSON.stringify(obj))

  if (Array.isArray(objClone)) {
    return objClone.map(item =>
      objectTraverseModify(item, objModifier, valueModifier)
    )
  }

  if (objClone instanceof Object) {
    const newValue = objModifier ? objModifier(objClone) : objClone
    Object.keys(newValue).forEach(key => {
      newValue[key] = objectTraverseModify(
        newValue[key],
        objModifier,
        valueModifier
      )
    })
    return newValue
  }

  // is a simple value
  return valueModifier ? valueModifier(objClone) : objClone
}

const insertCSS = text => {
  let styleElement = document.getElementById('typeform-contentful-styles')
  if (styleElement) {
    styleElement.innerText += `\n${text}`
    return
  }

  styleElement = document.createElement('style')
  styleElement.id = 'typeform-contentful-styles'
  styleElement.type = 'text/css'
  styleElement.innerText = text
  document.head.appendChild(styleElement)
}

const injectStyles = () => {
  insertCSS(`
@keyframes ${CLASSNAME_NAMESPACE}-link-appear {
  from {
    padding: 0px;
    font-size: 0rem;
  }
  to {
    padding: 2px;
    font-size: .8rem;
  }
}

@keyframes ${CLASSNAME_NAMESPACE}-link-inner-appear {
  from {
    padding: 0rem 0rem;
  }
  to {
    padding: .4rem .8rem;
  }
}

@keyframes ${CLASSNAME_NAMESPACE}-button-appear {
  from { top: -2rem; }
  to { top: 0rem; }
}

@keyframes ${CLASSNAME_NAMESPACE}-button-disappear {
  from { top: 0rem; }
  to { top: -2rem; }
}

.${CONTENTFUL_BUTTON_CLASSNAME} {
  position: fixed;
  border: none;
  left: 1rem;
  top: 0rem;
  z-index: 100000;
  border-radius: 0 0 0.4rem 0.4rem;
  padding: 1rem 2rem;
  font-weight: bold;
  color: #1e1e1e;
  background-color: white;
  overflow: hidden;
  transform: scale(.5) translate(0, -50%);
  transition: .2s transform, .2s border-radius;
  animation: .8s link-appear;
  cursor: pointer;
  box-shadow: rgba(0,0,0, .1) .1rem .1rem 1rem .4rem;
}
@supports (backdrop-filter: blur(1rem)) or (-webkit-backdrop-filter: blur(1rem)) {
  .${CONTENTFUL_BUTTON_CLASSNAME}-blur {
    background-color: rgba(255,255,255,0.2);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
  }
}
.${CONTENTFUL_BUTTON_CLASSNAME}:hover {
  transform: scale(1) translate(0, 0) !important;
  border-radius: 0 0 0.2rem 0.2rem;
}

.${CONTENTFUL_LINK_CLASSNAME}--hidden {
  display: none;
}

.${CONTENTFUL_LINK_CLASSNAME} {
  position: absolute;
  border-radius: 0.4rem;
  font-weight: bold;
  font-size: .8rem;
  color: #1e1e1e;
  text-decoration: none;
  padding: 2px;
  background: linear-gradient(0.4turn, #4FACD6, #ECE616, #E24A4E);
  overflow: hidden;
  transition: .2s padding, .2s font-size, .2s border-radius, .2s top, .2s left;
  animation: .8s ${CLASSNAME_NAMESPACE}-link-appear;
}

.${CONTENTFUL_LINK_CLASSNAME}>div {
  border-radius: 0.32rem;
  padding: .4rem .8rem;
  background: white;
  transition: .2s padding, .2s border-radius;
  animation: .8s ${CLASSNAME_NAMESPACE}-link-inner-appear;
}

.${CONTENTFUL_LINK_CLASSNAME}>div:hover {
  background: rgba(255,255,255,0.8);
}

.${CONTENTFUL_LINK_CLASSNAME}>div:active {
  background: rgba(255,255,255,0.2);
}
  `)
}

let linkIndex = -1

const getRelativeBoundingRect = element => {
  const elementRect = element.getBoundingClientRect()
  const bodyRect = document.body.getBoundingClientRect()
  return {
    ...elementRect,
    top: elementRect.top - bodyRect.top,
    left: elementRect.left - bodyRect.left,
  }
}

const adjustElementPosition = (matchingElement, linkElement) => {
  const boundingRect = getRelativeBoundingRect(matchingElement)
  const left = Math.max(MIN_POSITION.left, boundingRect.left)
  const top = Math.max(MIN_POSITION.top, boundingRect.top)
  const documentWidth = document.documentElement.clientWidth
  linkElement.style.left = `${left}px`
  linkElement.style.top = `${top}px`
  linkElement.style.display = left >= documentWidth ? 'none' : 'initial'
}

const addLink = (entry, element) => {
  linkIndex += 1
  const newElement = document.createElement('a')
  newElement.href = entry.urlSchema.replaceAll('{{id}}', entry.id)
  newElement.target = '_blank'
  newElement.rel = 'noopener'
  newElement.className = `${CONTENTFUL_LINK_CLASSNAME}--hidden`
  newElement.setAttribute('data-id', getLinkDataId(entry.id))
  const newElementInner = document.createElement('div')
  newElementInner.innerText = `View in ${entry.cmsName}`
  newElement.appendChild(newElementInner)
  adjustElementPosition(element, newElement)
  setTimeout(() => {
    newElement.className = `${CONTENTFUL_LINK_CLASSNAME}`
  }, Math.min(3000, linkIndex * 200))
  document.body.appendChild(newElement)
}

const updateLink = (entry, element) => {
  const matchingLinkElements = getLinks().filter(
    link => link.getAttribute('data-id') === getLinkDataId(entry.id)
  )
  if (matchingLinkElements.length < 1) {
    return
  }
  const linkElement = matchingLinkElements[0]

  adjustElementPosition(element, linkElement)
}

const getLinks = () => {
  return [...document.getElementsByTagName('A')]
}

const furthestDescendantWithText = (element, text) => {
  const matchingChildElements = [...element.childNodes].filter(
    e => e.innerText === text
  )
  if (matchingChildElements.length === 0) {
    return element
  }
  return furthestDescendantWithText(matchingChildElements[0], text)
}

const getLinkDataId = entryID => `cms-link-${entryID}`

const findElementsMatchingData = () => {
  const allElements = CONTENT_TAG_NAMES.flatMap(tagName => [
    ...document.body.getElementsByTagName(tagName),
  ])
  allElements.forEach(element => {
    const innerText = element.innerText?.trim()
    const altText = element.getAttribute('alt')?.trim()
    entries.forEach(entry => {
      // Filter out `null` values as these will give a false-positive:
      entry.texts
        .filter(t => !!t)
        .forEach(text => {
          // Don't create multiple links for one entry:
          if (matchingElements.some(match => match.entry.id === entry.id))
            return
          if ([innerText, altText].includes(text)) {
            matchingElements.push({
              entry,
              element: furthestDescendantWithText(element, text),
            })
          }
        })
    })
  })
}

const makeLinks = () => {
  matchingElements.forEach(({ entry, element }) => {
    if (
      !getLinks().some(
        link => link.getAttribute('data-id') === getLinkDataId(entry.id)
      )
    ) {
      addLink(entry, element)
    }
  })
}

const updateLinks = () => {
  matchingElements.forEach(({ entry, element }) => {
    updateLink(entry, element)
  })
}

const findCtflSpaceIdInData = data => {
  let spaceId = null
  objectTraverseModify(data, null, value => {
    if (!value || !value.startsWith) {
      return value
    }

    if (
      value.startsWith('//images.ctfassets.net/') ||
      value.startsWith('https://images.ctfassets.net/')
    ) {
      spaceId = value.split('/')[3]
    }

    return value
  })
  return spaceId
}

findZendeskDomainInData = data => {
  let zendeskDomain = null
  let locale = null

  objectTraverseModify(
    data,
    obj => {
      if (!obj || typeof obj?.url !== 'string') {
        return obj
      }

      if (obj.url.match(/^https:\/\/([a-z]+)\.zendesk\.com\/.*$/gm)) {
        const splitUrl = obj.url.split('/')
        zendeskDomain = splitUrl[2]
        locale = splitUrl[6]
      }

      return obj
    },
    null
  )

  return { zendeskDomain, locale }
}

const extractIdAndTextsFromObject = obj => {
  const hasSysAndFields = !!obj.sys?.id && !!obj.fields
  const id = hasSysAndFields ? obj.sys.id : obj.id
  const entryTexts = hasSysAndFields
    ? PROPERTIES_OF_INTEREST.map(property => obj.fields[property])
        .filter(s => !!s && !!s.trim)
        .map(s => s.trim())
    : PROPERTIES_OF_INTEREST.map(property => obj[property])
        .filter(s => !!s && !!s.trim)
        .map(s => s.trim())

  // Determine whether contentful entry, contentful asset, or zendesk
  let urlSchema = null
  let cmsName = null
  if (contentfulEntryUrlSchema) {
    urlSchema = contentfulEntryUrlSchema
    cmsName = 'Contentful'
  }
  if (contentfulAssetUrlSchema && obj.fields?.file?.url) {
    urlSchema = contentfulAssetUrlSchema
  }
  if (zendeskUrlSchema && obj.url?.includes('zendesk.com/')) {
    urlSchema = zendeskUrlSchema
    cmsName = 'Zendesk'
  }
  return { id, texts: entryTexts, urlSchema, cmsName }
}
const findEntries = data => {
  objectTraverseModify(
    data,
    obj => {
      if (!obj) return obj
      const newEntry = extractIdAndTextsFromObject(obj)
      const { id, texts } = newEntry
      if (id && texts.length) {
        entries.push(newEntry)
      }
      return obj
    },
    null
  )
}

const getPropData = () => {
  const rawData = document.getElementById('__NEXT_DATA__')?.innerText
  if (!rawData) {
    return {}
  }
  return JSON.parse(rawData)
}

const getEntryDataFromProps = () => {
  const data = getPropData()
  findEntries(data)
}

const setContentfulCms = contentfulSpaceId => {
  contentfulEntryUrlSchema = CONTENTFUL_ENTRY_URL_FORMAT.replace(
    '{{space}}',
    contentfulSpaceId
  )
  contentfulAssetUrlSchema = CONTENTFUL_ASSET_URL_FORMAT.replace(
    '{{space}}',
    contentfulSpaceId
  )
}

const getUrlSchemaFromProps = () => {
  const data = getPropData()
  const contentfulSpaceId = findCtflSpaceIdInData(data)
  if (contentfulSpaceId) {
    setContentfulCms(contentfulSpaceId)
  }

  const { zendeskDomain, locale } = findZendeskDomainInData(data)
  if (zendeskDomain) {
    zendeskUrlSchema = `https://${zendeskDomain}/knowledge/articles/{{id}}/${locale}`
  }
}

const fetchAndShowLinks = async () => {
  getEntryDataFromProps()
  findElementsMatchingData()
  makeLinks()
  setInterval(updateLinks, 1000)
}

const addButton = () => {
  const newElement = document.createElement('button')
  newElement.className = `${CONTENTFUL_BUTTON_CLASSNAME} ${CONTENTFUL_BUTTON_CLASSNAME}-blur`
  newElement.innerText = `Show CMS links`
  newElement.id = `cms-button`
  newElement.onclick = () => {
    newElement.style.animation = `.8s ${CLASSNAME_NAMESPACE}-button-disappear`
    newElement.style.top = `-2rem`
    fetchAndShowLinks()
  }

  document.body.appendChild(newElement)
}

const parseCommaSeparatedStrings = value =>
  (value || '')
    .split(' ')
    .join('')
    .split(',')
    .filter(x => !!x)

const readExtensionExcludeOptions = async () => {
  if (typeof chrome === 'undefined') {
    return
  }

  let options = await new Promise(res => {
    chrome.storage.sync.get(['excludeSites'], data => res(data))
  })

  const excludeSitesList = parseCommaSeparatedStrings(options.excludeSites)

  if (
    excludeSitesList.some(domain => document.location.origin.endsWith(domain))
  ) {
    siteExcluded = true
  }
}
const readExtensionForceIncludeOptions = async () => {
  if (typeof chrome === 'undefined') {
    return
  }

  let options = await new Promise(res => {
    chrome.storage.sync.get(
      ['includeSites', 'includeSitesContentfulSpaceID'],
      data => res(data)
    )
  })

  const includeSitesList = parseCommaSeparatedStrings(options.includeSites)
  const contentfulSpaceID = (options.includeSitesContentfulSpaceID || '').trim()

  if (
    contentfulSpaceID &&
    includeSitesList.some(domain => document.location.origin.endsWith(domain))
  ) {
    setContentfulCms(contentfulSpaceID)
    siteForceIncluded = true
  }
}

const work = async () => {
  try {
    await readExtensionExcludeOptions()
    if (siteExcluded) {
      console.log(
        `This site has been excluded in CMS links options. CMS links will get some rest for now 💤`
      )
      return
    }
    getUrlSchemaFromProps()
    if (cmsDataAvailable()) {
      injectStyles()
      addButton()
      console.log(
        `Found CMS assets. CMS links is now configured to take you to ${cmsNames()} 🎉`
      )
    } else {
      await readExtensionForceIncludeOptions()
      if (siteForceIncluded) {
        console.log(
          `This site has been included in CMS links options. CMS links is now configured to take you to ${cmsNames()} 🎉`
        )
        injectStyles()
        addButton()
        return
      }
      console.log(
        `No CMS assets identified. CMS links will get some rest for now 💤`
      )
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`CMS links error:`, e)
  }
}

work()
