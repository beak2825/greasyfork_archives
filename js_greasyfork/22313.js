    var parseSelector = window.Parser.parse

    window.funcs = []
    window.nodeCache = {}
    var observer

    // observe dom mutations to make it run every time an item is opened / closed
    function start () {
        GM_addStyle(`
.project .content {
  display: inline-block !important;
  padding-right: 27px;
}

.project .result {
  display: inline;
  color: blue;
  margin-left: 10px;
}
.project .result:first-child {
  margin-left: 0;
}
        `)


        document.body.addEventListener('click', function (e) {
            if (e.target.id === 'expandButton') {
                setTimeout(itemOpenedOrClosed, 1000)
            }
        })

        window.addEventListener('hashchange', throttle(itemOpenedOrClosed, 2000))

        itemOpenedOrClosed()
    }

    function throttle (callback, limit) {
        var wait = false
        return function () {
            if (!wait) {
                wait = true
                setTimeout(function () {
                callback.call()
                    wait = false
                }, limit)
            }
        }
    }

    function itemOpenedOrClosed () {
        for (let i = 0; i < funcs.length; i++) {
            let script = funcs[i]
            execScript(script)
        }
    }

    function execScript ({script, selector, id, color}) {
        let items = findItems(selector)
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            execForItem(item, script, id, color)
        }
    }

    function execForItem (item, fun, id, color) {
        var children = []
        let par = item.querySelector('.children')
        for (let p = 0; p < par.children.length; p++) {
            if (par.children[p].classList.contains('project')) {
                children.push(par.children[p])
            }
        }

        var args = []
        for (let i = 0; i < children.length; i++) {
            let child = children[i]
            arg = nodeToArg(child)
            args.push(arg)
        }

        var result = item.querySelector('.result.script-' + id)
        if (!result) {
            let content = item.querySelector('.name .content')
            result = document.createElement('span')
            result.className = 'result script-' + id
            result.title = id
            result.style.color = color
            content.parentNode.insertBefore(result, content.nextSibling)
        }
        let resultvalue = fun(args, nodeToArg(item))
        result.innerHTML = (resultvalue || '').toString()
    }

    function nodeToArg (node) {
        let name = node.querySelector('.name .content').innerText.trim()
        let note = node.querySelector('.notes').innerText.trim()

        var arg = {name, note}

        let results = node.querySelector('.name').querySelectorAll('.result')
        for (let r = 0; r < results.length; r++) {
            let result = results[r]
            arg[result.classList.item(1)] = result.innerText.trim()
        }

        return arg
    }

    function findItems (selector) {
        let parsed = parseSelector(selector)
        var items = null
        for (let l = 0; l < parsed.length; l++) {
            let layer = parsed[l]
            items = select(layer, items)
        }
        return items || []
    }

    function select (layer, base) {
        if (!base) {
            base = document.querySelectorAll('.mainTreeRoot')
        }

        let [connector, selector] = layer
        return getChildren(base, selector, connector === 'directchild')
    }

    function getChildren (base, selector, onlydirect=false) {
        var filter
        switch (selector.type) {
            case 'id':
                filter = node =>
                node.getAttribute('projectid') === selector.val ||
                    node.querySelector('.bullet').href.split('#/')[1] === selector.val
                break
            case 'regex':
                filter = node =>
                node.querySelector('.name .content').innerText.search(selector.val) !== -1
                break
            case 'name':
                filter = node =>
                node.querySelector('.name .content').innerText.trim() === selector.val
                break
            case 'any':
                filter = () => true
                break
            default:
                throw new Error('INVALID SELECTOR: ', selector)
        }

        var children = []
        for (let i = 0; i < base.length; i++) {
            if (onlydirect) {
                let par = base[i].querySelector('.children')
                for (let p = 0; p < par.children.length; p++) {
                    if (par.children[p].classList.contains('project') && par.children[p].classList.contains('open')) {
                        children.push(par.children[p])
                    }
                }
            } else {
                let all = base[i].querySelectorAll('.children > .project.open')
                for (let i = 0; i < all.length; i++) {
                    children.push(all[i])
                }
            }
        }

        return children.filter(filter)
    }

    function registerScript (s) {
        funcs.push(s)
    }

    function waitFor (selector, callback) {
        let res = document.querySelector(selector)
        if (res) return callback()

        setTimeout(() => {
            waitFor(selector, callback)
        }, 1000)
    }