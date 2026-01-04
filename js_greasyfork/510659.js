(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.clsx = factory());
})(this, (() => {
    function r(e) {
        var t, f, n = "";
        if ("string" == typeof e || "number" == typeof e)
            n += e;
        else if ("object" == typeof e)
            if (Array.isArray(e)) {
                var o = e.length;
                for (t = 0; t < o; t++)
                    e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
            } else
                for (f in e)
                    e[f] && (n && (n += " "), n += f);
        return n;
    }
    function clsx() {
        for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
            (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
        return n;
    }
    return clsx;
}));