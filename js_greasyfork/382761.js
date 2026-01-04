var h = (function () {
    function deref(fn) {
        return Function.call.bind(fn);
    }

    var slice = deref(Array.prototype.slice);

    // Lodash code starts here
    var MAX_SAFE_INTEGER = 9007199254740991;

    function isObject(value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
    }

    function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    function isObjectLike (value) {
        return value != null && typeof value == "object";
    }
    // Lodash code ends here

    function isFunction(value) {
        return value instanceof Function;
    }

    function makeArray(v) {
        return (isArrayLike(v) && typeof v !== "string") ? slice(v) : [v];
    }

    function isNode(el) {
        return el instanceof Node;
    }

    function isObjectLikeNotArray(value) {
        return isObjectLike(value) && !isArrayLike(value);
    }

    /**
     * 深度对象合并
     * @param {Object} src 需要扩展的对象。
     * @param {Object} [...ext] 待扩展的属性。
     */
    function merge(src) {
        slice(arguments, 1).forEach(function (ext) {
            if (isObjectLikeNotArray(ext)) {
                Object.keys(ext).forEach(function (key) {
                    var value = ext[key];
                    if (isObjectLikeNotArray(value)) {
                        if (!src[key]) {
                            src[key] = {};
                        }
                        merge(src[key], value);
                    } else {
                        src[key] = value;
                    }
                });
            }
        });

        return src;
    }

    /**
     * 建立一个 HTML 元素
     * @param {String|Function} tag 元素标签，或传入 Stateless 组件函数。
     * @param {Object.<String.String|Bool|Number>} [attrs = {}] 元素属性集合。
     * @param {Array.<String|Node>|String|Node} [...children] 子元素集合。
     */
    function h(tag, attrs) {
        var children = slice(arguments, 2);

        // Stateless 组件建立
        if (isFunction(tag)) {
            return tag(Object.assign({ children }, attrs));
        }

        var el = merge(document.createElement(tag), attrs);
        children.forEach(function (children) {
            makeArray(children).forEach(function (child) {
                el.appendChild(isNode(child) ? child : document.createTextNode(child));
            });
        });
        return el;
    }

    return h;
})();

/**
 * 将建立的元素挂载到一个 HTML 节点 (会先暴力清空节点内容)。
 * @param {HTMLElement} mnt 挂载点。
 * @param {Node} node HTML 元素或节点。
 */
function mount(mnt, node) {
    mnt.innerHTML = "";
    mnt.appendChild(node);
}