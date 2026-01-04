// ==UserScript==
// @name                YouTube Comment Snub
// @description         Hide comments by specific users in the comments section.
// @version             1.4.3
// @author              stinkrock
// @namespace           patchmonkey
// @license             MIT
// @match               https://www.youtube.com/*
// @run-at              document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/375573/YouTube%20Comment%20Snub.user.js
// @updateURL https://update.greasyfork.org/scripts/375573/YouTube%20Comment%20Snub.meta.js
// ==/UserScript==


const conf = { id: 'snub-button', innerText: '🤐', ariaLabel: 'Snub this user' }

const style = `cursor:pointer;font-size:14px;margin:0 8px 0 -8px;padding:var(--yt-button-icon-padding,8px);`


const YTNEXT = 'yt-next-continuation-data-updated'

const YTNAVIGATE = 'yt-navigate-start'


const YTDSECTION = 'ytd-comments ytd-item-section-renderer'

const YTDREPLIES = 'ytd-comments ytd-comment-replies-renderer'

const YTDTHREAD = 'ytd-comment-thread-renderer'

const YTDCOMMENT = 'ytd-comment-renderer'


const CONTENTS = '#contents'

const TOOLBAR = '#toolbar'

const AUTHOR = '#author-thumbnail a'

const SNUB = '#' + conf.id


const key = 'youtube-comment-snub'

const users = new Set()

const containers = new WeakSet()

const buttons = new WeakMap()

const thumbs = new WeakMap()


const comp = (f, g) => x => g(f(x))

const compose = (...f) => f.reduce(comp)


const or = (f, g) => x => f(x) || g(x)

const either = (...f) => f.reduce(or)


const cond = (f, g) => x => Promise.resolve(x).then(f).catch(g)

const condition = (f, g) => x => f(x) ? g(x) : null


const each = x => f => f(x)

const list = (...f) => x => f.map(each(x))

const foreach = (...f) => x => f.forEach(each(x))

const flatmap = (...f) => x => f.flatMap(each(x))

const filter = f => x => x.filter(f)

const map = f => x => x.map(f)

const flat = x => x.flat()

const join = x => y => y.join(x)


const id = x => x

const opt = x => y => y != null ? y : x

const getitem = (x, y) => () => x.getItem(y)

const setitem = (x, y) => z => x.setItem(y, z)

const stringify = x => JSON.stringify(x)

const parse = x => JSON.parse(x)


const set = x => ([...y]) => x.set(...y)

const get = x => y => x.get(y)

const add = x => y => x.add(y)

const has = x => y => x.has(y)

const clear = x => x.clear()


const observer = f => new MutationObserver(f)

const childlist = x => y => x.observe(y, { childList: true })

const attribute = x => y => x.observe(y, { attributeFilter: ['href'] })

const subtree = x => y => x.observe(y, { childList: true, subtree: true })


const elem = x => document.createElement(x)

const text = x => document.createTextNode(x)

const append = (x, y) => x.appendChild(y)

const insert = ([x, y, z]) => x.insertBefore(y, z)

const match = x => y => y.matches(x) ? y : null

const query = x => y => y.querySelector(x)

const clone = x => y => x.cloneNode(y)

const attr = x => y => y.getAttribute(x)

const div = () => elem('div')


const children = x => [...x.children]

const added = x => [...x.addedNodes]

const first = x => x.firstElementChild

const current = x => x.currentTarget

const target = x => x.target

const type = x => x.nodeType

const number = x => isNaN(x) ? 0 : x

const lower = x => x.toLowerCase()


const array = x => [...x]

const value = x => () => x

const equal = x => y => x == y

const assign = x => y => Object.assign(y, x)


const data = x => y => x.data = y

const rule = x => `[data-snub="${x}"]`

const body = x => x.length ? `${x} { display: none !important; }` : ''

const css = x => y => (y.style.cssText = x, y)

const snub = ([x, y]) => x.dataset.snub = y


const sheet = append(document.documentElement, elem('style'))

const rules = append(sheet, text(''))

const compile = compose(map(rule), join(',\n'), body)


const read = compose(getitem(localStorage, key), opt('[]'), parse)

const write = compose(stringify, setitem(localStorage, key))


const update = compose(compile, data(rules))

const load = compose(read, foreach(map(add(users)), update))

const reset = compose(value(users), clear, load)

const save = compose(value(users), array, foreach(write, update))


const tag = compose(list(id, compose(query(AUTHOR), attr('href'))), snub)

const link = compose(list(get(thumbs), attr('href')), snub)

const change = compose(map(target), flat, map(link))

const observe = compose(query(AUTHOR), attribute(observer(change)))


const quarantine = compose(get(buttons), attr('href'), add(users))

const onclick = compose(current, foreach(quarantine, save))

const button = compose(div, assign(conf), assign({ onclick }), css(style))


const action = compose(query(TOOLBAR), list(id, button, first), insert)

const auth = compose(list(query(SNUB), query(AUTHOR)), set(buttons))

const tool = compose(list(query(AUTHOR), id), set(thumbs))

const configure = foreach(action, auth, tool)


const matches = flatmap(filter(match(YTDTHREAD)), filter(match(YTDCOMMENT)))

const elements = filter(compose(type, equal(Node.ELEMENT_NODE)))

const content = condition(match(YTDSECTION), query(CONTENTS))

const replies = condition(match(YTDREPLIES), query(CONTENTS))


const process = foreach(configure, tag, observe)

const track = condition(compose(query(SNUB), equal(null)), process)

const all = compose(matches, map(track))

const init = foreach(add(containers), compose(children, all))

const contain = condition(compose(has(containers), equal(false)), init)


const mutations = compose(map(added), flat, elements, all)

const follow = foreach(contain, childlist(observer(mutations)))

const capture = compose(either(content, replies), follow)

const run = compose(query(YTDSECTION), query(CONTENTS), follow)


window.addEventListener(YTNEXT, compose(target, cond(capture, e => e)))

window.addEventListener(YTNAVIGATE, reset)


reset()


Promise.resolve(document.body).then(run).catch(e => e)
