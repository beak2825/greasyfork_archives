// ==UserScript==
// @name              Notion.so v3 Trash Cleaner
// @namespace         https://github.com/bjxpen
// @version           0.4
// @description       Provides a pop up where you can select a workspace in Notion.so to clear its trash
// @author            Jiaxing Peng
// @license           MIT
// @match             *://www.notion.so/*
// @require           https://cdn.jsdelivr.net/npm/redom@3.24.0/dist/redom.min.js
// @require           https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @run-at            document-idle
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388344/Notionso%20v3%20Trash%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/388344/Notionso%20v3%20Trash%20Cleaner.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
class Component {
    setState(state) {
        if (this.state === undefined) {
            this.state = {}
        }
        Object.assign(this.state, state)
        this.update()
    }

    update() {}
}

class Menu extends Component {
    constructor() {
        super()
        this.state = {
            msg: ""
        }
        this.render()
        this.fetchSpaces()
    }

    fetchSpaces() {
        this.setState({
            fetchSpaceState: "fetching"
        })
        postJSON('/api/v3/loadUserContent')
            .catch(err => {
                console.log(err)
                this.setState({
                    fetchSpaceState: "error"
                })
            })
            .then(res => [... function*() {
                const spaceView = res.recordMap.space_view
                for (let _ in spaceView) {
                    yield res.recordMap.space[spaceView[_].value.space_id].value
                }
            }()])
            .then(spaces => {
                this.spaces = spaces
                this.setState({
                    fetchSpaceState: "fetched"
                })
            })
    }

    render() {
        this.el = redom.el("div#_del-trash-menu")
    }

    setMsg(msg) {
        setTimeout(() => this.setState({
            msg
        }), 0)
    }

    update() {
        const msg = (() => {
            if (this.state.fetchSpaceState === "fetched" && this.state.msg !== "") {
                return this.state.msg
            }
            switch (this.state.fetchSpaceState) {
                case "fetching":
                    return "Fetching workspace metadata..."
                case "fetched":
                    return "Choose workspace to delete:"
                case "error":
                    return "Network error: Failed fetching workspace data"
                default:
                    return this.state.msg
            }
        })()

        redom.setChildren(this.el, [
            redom.el("div", "(Turn off this script to close the pop up)"),
            redom.el("pre", msg),
            this.state.fetchSpaceState === "fetched" &&
            redom.el("ul", this.spaces.map(space => new Space({
                space,
                setMsg: this.setMsg.bind(this)
            }))),
        ]);
    }
}

class Space extends Component {
    constructor({
        space,
        setMsg
    }) {
        super()
        this.space = space
        this.setMsg = setMsg
        this.render()
    }

    render() {
        this.el = redom.el("li", this.space.name)
        this.el.addEventListener("click", this.onClick.bind(this))
    }

    deleteBlocks(query, currentQueryCount, totalQueryCount) {
        return new Promise(res => {
            this.setMsg(`Workspace "${this.space.name}":\nFetching block ids in trash for block query "${query}" (${currentQueryCount}/${totalQueryCount}) ...`)
            postJSON("/api/v3/searchTrashPages", {
                    query: query,
                    limit: 0,
                    spaceId: this.space.id
                }, {
                    onDownloadProgress: (ev) => {
                        this.setMsg(`Workspace "${this.space.name}":\nFetching block ids in trash (${ev.loaded/1024} KB) for block query "${query}" ...`)
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.setMsg(`Workspace "${this.space.name}":\nNetwork error: Failed fetching trash posts for block query "${query}"`)
                })
                .then(res => res.results)
                .then(blockIds => {
                    if (blockIds.length === 0) {
                        this.setMsg(`Workspace "${this.space.name}":\nTrash is cleared for block query "${query}"`)
                        return res()
                    }
                    const total = blockIds.length
                    const chunkSize = 1000
                    const recurDel = () => {
                        if (blockIds.length > 0) {
                            const deleted = total - blockIds.length
                            this.setMsg(`Workspace "${this.space.name}":\nDeleting blocks for block query "${query}" (${deleted}/${total}) ...`)
                            postJSON("/api/v3/deleteBlocks", {
                                    blockIds: blockIds.splice(0, chunkSize),
                                    permanentlyDelete: true
                                })
                                .catch(err => {
                                    console.log(err)
                                    this.setMsg(`Workspace "${this.space.name}":\nNetwork error: Failed deleting posts for block query "${query}"`)
                                })
                                .then(_ => {
                                    recurDel()
                                })
                        } else {
                            this.setMsg(`Workspace "${this.space.name}":\nRetry to delete leftover posts for block query "${query}" ...`)
                            setTimeout(() => this.deleteBlocks(query, currentQueryCount, totalQueryCount).then(res), 300)
                        }
                    }
                    recurDel()
                })
        })
    }

    onClick(ev) {
        const queries = ["", ..." abcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?]"]
        runSerial(queries.map((query, index) => () => this.deleteBlocks(query, index + 1, queries.length)))
            .then(() => this.setMsg("Done"))
    }
}

function runSerial(promises) {
    let result = Promise.resolve()
    for (let i = 0; i < promises.length; i++) {
        result = result.then(() => promises[i]())
    }
    return result
}

function loadScript(url) {
    return new Promise((res, rej) => {
        const script = document.createElement("script")
        document.body.appendChild(script)
        script.addEventListener("load", (ev) => {
            res(url)
        })
        script.src = url
    })
}

function loadCSS(css) {
    const elm = document.createElement("style")
    elm.innerHTML = css
    document.body.appendChild(elm)
}

function postJSON(url, jsonPayload = null, config = {}) {
    return axios.post(url, jsonPayload, config).then(res => res.data)
}

Promise.all([
        window.redom || loadScript("https://cdn.jsdelivr.net/npm/redom@3.24.0/dist/redom.min.js"),
        window.axios || loadScript("https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js")
    ])
    .then(() => {
        loadCSS(`
		#_del-trash-menu {
		  position: absolute;
		  color: rgba(55, 53, 47, 0.6);
		  background: rgb(247, 246, 243);
		  padding: 1em;
		  top: 0;
		  left: calc(50% - 200px);
		  width: 400px;
		  min-height: 200px;
		  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
		  font-size: 14px;
		  z-index: 9999;
		}
		
		#_del-trash-menu ul, #_del-trash-menu li {
		  color: black;
		  list-style: none;
		  margin: 0;
		  padding: 0;
		}
		
		#_del-trash-menu li {
		  margin: 12px 0;
		  padding: 6px;
		}
		
		#_del-trash-menu li:hover {
		  cursor: pointer;
		  background: white;
		}
    `)
        const root = document.querySelector("#_del-trash-menu")
        root && root.remove()
        document.body.appendChild(new Menu().el)
    })