/** Finds the React Component from given dom. */
const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"))
    const domFiber = dom[key]
    if (domFiber == null) return null
    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return
        }
        return parentFiber
    }
    let compFiber = getCompFiber(domFiber)
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber)
    }
    return compFiber?.stateNode
}

/** Create a Console Logger with some prefixing. */
const createLogger = (namespace) => {
    const logPrefix = (prefix = "") => {
        const formatMessage = `%c[${namespace}]${prefix ? `%c[${prefix}]` : ""}`
        let args = [console, `${formatMessage}%c`, "background-color: #D62F3A; color: #fff; font-weight: bold"]
        if (prefix) {
            args = args.concat("background-color: #4f505e; color: #fff; font-weight: bold")
        }
        return args.concat("color: unset")
    }
    return {
        info: (prefix) => Function.prototype.bind.apply(console.info, logPrefix(prefix)),
        warn: (prefix) => Function.prototype.bind.apply(console.warn, logPrefix(prefix)),
        error: (prefix) => Function.prototype.bind.apply(console.error, logPrefix(prefix)),
        log: (prefix) => Function.prototype.bind.apply(console.log, logPrefix(prefix)),
        debug: (prefix) => Function.prototype.bind.apply(console.debug, logPrefix(prefix)),
    }
}
