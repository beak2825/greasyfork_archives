
var handleKey = function (a, b, c) {
    var d = allElement.filter(function (t) {
        if (t.hasAttribute && t.hasAttribute('accesskey') && t.getAttribute('accesskey') == a ||
            t.classList.contains(b)) {
            if (t.offsetParent !== null) {
                if (!t.classList.contains(b)) {
                    t.classList.add(b);
                    t.removeAttribute('accesskey', '*');
                }
                c.push(allElement.indexOf(t));
                return t;
            }
        }
    });
    return d;
}

