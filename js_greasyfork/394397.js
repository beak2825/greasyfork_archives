// ==UserScript==
// @name                YouTube Comment Pin
// @description         Move comments by specific users to the top of the comments section.
// @version             1.2.4
// @author              stinkrock
// @license             MIT
// @namespace           patchmonkey
// @match               https://www.youtube.com/*
// @run-at              document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/394397/YouTube%20Comment%20Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/394397/YouTube%20Comment%20Pin.meta.js
// ==/UserScript==


const conf = { id: 'pin-button', innerHTML: `<div>📌</div>`, ariaLabel: 'Pin this user' }

const style = `cursor:pointer;font-size:14px;margin:0 8px 0 -8px;padding:var(--yt-button-icon-padding,8px);`


const YTNEXT = 'yt-next-continuation-data-updated'

const YTNAVIGATE = 'yt-navigate-start'


const YTDSECTION = 'ytd-comments ytd-item-section-renderer'

const YTDTHREAD = 'ytd-comment-thread-renderer'


const CONTENTS = '#contents'

const TOOLBAR = '#toolbar'

const AUTHOR = '#author-thumbnail a'

const BUTTON = '#' + conf.id


const PIN = 'pinned'

const KEY = 'youtube-pin-comments'


const tree = `<div><slot name="${PIN}"></slot></div><slot></slot>`

const rot = `${YTDTHREAD}[slot="${PIN}"] ${BUTTON} div { transform: rotate(-45deg); }`


const users = new Set()

const comments = new Set()

const containers = new WeakSet()

const buttons = new WeakMap()

const thumbs = new WeakMap()


const comp = (f, g) => x => g(f(x))

const compose = (...f) => f.reduce(comp)


const or = (f, g) => x => f(x) || g(x)

const either = (...f) => f.reduce(or)


const cond = (f, g) => x => Promise.resolve(x).then(f).catch(g)

const condition = (f, g) => x => f(x) ? g(x) : null

const tern = (f, g, h) => x => f(x) ? g(x) : h(x)


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

const del = x => y => x.delete(y)

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

const div = () => elem('div')


const shadow = x => x.attachShadow({ mode: 'open' })

const attr = x => y => y.getAttribute(x)

const html = x => y => y.innerHTML = x

const css = x => y => (y.style.cssText = x, y)

const slot = ([x, y]) => x.slot = y

const data = x => y => x.data = y


const children = x => [...x.children]

const added = x => [...x.addedNodes]

const removed = x => [...x.removedNodes]

const first = x => x.firstElementChild

const current = x => x.currentTarget

const target = x => x.target

const type = x => x.nodeType


const array = x => [...x]

const value = x => () => x

const equal = x => y => x == y

const assign = x => y => Object.assign(y, x)


const sheet = append(document.documentElement, elem('style'))

const rules = append(sheet, text(''))

const layout = data(rules)


const read = compose(getitem(localStorage, KEY), opt('[]'), parse)

const write = compose(stringify, setitem(localStorage, KEY))


const load = compose(read, map(add(users)))

const reset = compose(value(users), clear, load)

const save = compose(value(users), array, write)


const name = compose(attr('href'), tern(has(users), value(PIN), value('')))

const pin = compose(list(get(thumbs), name), slot)

const tag = compose(query(AUTHOR), pin)


const toggle = compose(attr('href'), tern(has(users), del(users), add(users)))

const rehash = compose(value(comments), array, map(tag))

const onclick = compose(current, get(buttons), toggle, rehash, save)

const button = compose(div, assign(conf), assign({ onclick }), css(style))


const action = compose(query(TOOLBAR), list(id, button, first), insert)

const auth = compose(list(query(BUTTON), query(AUTHOR)), set(buttons))

const tool = compose(list(query(AUTHOR), id), set(thumbs))

const configure = foreach(action, auth, tool)


const change = compose(map(target), flat, map(pin))

const observe = compose(query(AUTHOR), attribute(observer(change)))


const matches = filter(match(YTDTHREAD))

const elements = filter(compose(type, equal(Node.ELEMENT_NODE)))

const content = condition(match(YTDSECTION), query(CONTENTS))


const process = foreach(configure, tag, observe)

const track = condition(compose(query(BUTTON), equal(null)), process)

const watch = compose(matches, map(foreach(track, add(comments))))

const ignore = compose(matches, map(del(comments)))


const scope = compose(shadow, html(tree))

const init = foreach(add(containers), scope, compose(children, watch))

const contain = condition(compose(has(containers), equal(false)), init)


const keep = compose(map(added), flat, elements, watch)

const discard = compose(map(removed), flat, elements, ignore)

const mutations = foreach(keep, discard)


const follow = foreach(contain, childlist(observer(mutations)))

const capture = compose(content, follow)

const run = compose(query(YTDSECTION), query(CONTENTS), follow)


window.addEventListener(YTNEXT, compose(target, cond(capture, e => e)))

window.addEventListener(YTNAVIGATE, reset)


layout(rot)

reset()


Promise.resolve(document.body).then(run).catch(e => e)
