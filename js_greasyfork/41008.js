// ==UserScript==
// @name         Link between Github Pages and their repos
// @namespace    https://jonas.ninja
// @version      1.0.0
// @description  Adds a link to the DOM to quickly switch between github repos and their deployed Github Pages.
// @author       @iv_njonas
// @match        https://*.github.io/*
// @match        https://*.github.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/41008/Link%20between%20Github%20Pages%20and%20their%20repos.user.js
// @updateURL https://update.greasyfork.org/scripts/41008/Link%20between%20Github%20Pages%20and%20their%20repos.meta.js
// ==/UserScript==
/* jshint asi: true, multistr: true */

(function() {
    var imgs = {
        small: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAqpJREFUSEuNlTtrVFEUha+DioKFoI0aER8pBMVCCwstxCKFIqI/wU7BKhCw1Eq0CGn0T2ihhSRVJJn3+/1OSpEYC4kiSSbj+m72nRwnk8ks2HDu3muts/c59854g1CrN44kU+nr8URyUvElHIl+X1gMbxKsyVGDA9dkw5EvFE/F4onXMmjIaEvR3SO24MBFY/LdqFRrB1PpzC2RcxLR3SCzQcEUObR4mN0O0pnsbRFKIg7rcq+g+xIeZrcNjXJahTyExXBkTeN91PNXrVfJKdbJE6yNtwoHruUxz+Plm3L4Kr5RwR9fpHa5Ur2ksY7qch5ForG3EnCJTwjW5KjBgYsGLR54+Rcqwg2RW1bAuFGt1c+yabPVPlBvNA+3l5b9JgBrctR4hosm0OOFp6cuppTonasKhVK5cs53GQFw0QR6vPD01Pqck+xqtyl1EzLdvoCLxvXA09NuK0FCI/1Vctw0IwMN2sAHT0+LjpP4EY3Fx4w/MtCgDXzwxNj9GNZFumj8kYEGreOzyVF8cxJdveQPjD8y0LgeePJWfHKTekfnsrn8CdPsC7hoXA88MX6uh9456xL+6DLe6Qs6Y9o9Ic4YXDSBHi88GeOqWi+quKIfklc6rw9a/1aulUimpnP5wn19FP7HALQOqcuHqs2Ix4flni3HUMTTazRbh7TDCyU3lKxmsrm7Mv+sZ/9SVZvu//KUmwmM+mIDLzx9skY6rnOaV6Gj0d5rx3F1/1QxqY7P+yQH4jzuMyQ6eOBltG3I7IoKqkd+ateXGvdmoVi6ViyV/ycKmujeANMFPIyyA7UfUoeXJZqV+S8dy7KCf4g7Rumhz5h3fxYtHkbZDXV4TBfzTB1EtMGaRBNW6oEcNThw0VhpOFrtJW7+goQTMjlp6R7IUYMD19IOPO8fPoW0c/VPyNAAAAAASUVORK5CYII=',
        medium: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMTZCRDY3REIzRjAxMUUyQUQzREIxQzRENUFFNUM5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMTZCRDY3RUIzRjAxMUUyQUQzREIxQzRENUFFNUM5NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUxNkJENjdCQjNGMDExRTJBRDNEQjFDNEQ1QUU1Qzk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxNkJENjdDQjNGMDExRTJBRDNEQjFDNEQ1QUU1Qzk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SM9MCAAAA+5JREFUeNrEV11Ik1EY3s4+ddOp29Q5b0opCgKFsoKoi5Kg6CIhuwi6zLJLoYLopq4qsKKgi4i6CYIoU/q5iDAKs6syoS76IRWtyJ+p7cdt7sf1PGOD+e0c3dygAx/67ZzzPM95/877GYdHRg3ZjMXFxepQKNS6sLCwJxqNNuFpiMfjVs4ZjUa/pmmjeD6VlJS8NpvNT4QQ7mxwjSsJiEQim/1+/9lgMHgIr5ohuxG1WCw9Vqv1clFR0dCqBODElV6v90ogEDjGdYbVjXhpaendioqK07CIR7ZAqE49PT09BPL2PMgTByQGsYiZlQD4uMXtdr+JxWINhgINYhGT2MsKgMrm2dnZXgRXhaHAg5jEJodUAHxux4LudHJE9RdEdA+i3Juz7bGHe4mhE9FNrgwBCLirMFV9Okh5eflFh8PR5nK5nDabrR2BNJlKO0T35+Li4n4+/J+/JQCxhmu5h3uJoXNHPbmWZAHMshWB8l5/ipqammaAf0zPDDx1ONV3vurdidqwAQL+pEc8sLcAe1CCvQ3YHxIW8Pl85xSWNC1hADDIv0rIE/o4J0k3kww4xSlwIhcq3EFFOm7KN/hUGOQkt0CFa5WpNJlMvxBEz/IVQAxg/ZRZl9wiHA63yDYieM7DnLP5CiAGsC7I5sgtYKJGWe2A8seFqgFJrJjEPY1Cn3pJ8/9W1e5VWsFDTEmFrBcoDhZJEQkXuhICMyKpjhahqN21hRYATKfUOlDmkygrR4o4C0VOLGJKrOITKB4jijzdXygBKixyC5TDQdnk/Pz8qRw6oOWGlsTKGOQW6OH6FBWsyePxdOXLTgxiyebILZCjz+GLgMIKnXNzc49YMlcRdHXcSwxFVgTInQhC9G33UhNoJLuqq6t345p9y3eUy8OTk5PjAHuI9uo4b07FBaOhsu0A4Unc+T1TU1Nj3KsSSE5yJ65jqF2DDd8QqWYmAZrIM2VlZTdnZmb6AbpdV9V6ec9znf5Q7HjYumdRE0JOp3MjitO4SFa+cZz8Umqe3TCbSLvdfkR/kWDdNQl5InuTcysOcpFT35ZrbBxx4p3JAHlZVVW1D/634VRt+FvLBgK/v5LV9WS+10xMTEwtRw7XvqOL+e2Q8V3AYIOIAXQ26/heWVnZCVfcyKHg2CBgTpmPmjYM8l24GyaUHyaIh7XwfR9ErE8qHoDfn2LTNAVC0HX6MFcBIP8Bi+6F6cdW/DICkANRfx99fEYFQ7Nph5i/uQiA214gno7K+guhaiKg9gC62+M8eR7XsBsYJ4ilam60Fb7r7uAj8wFyuwM1oIOWgfmDy6RXEEQzJMPe23DXrVS7rtyD3Df8z/FPgAEAzWU5Ku59ZAUAAAAASUVORK5CYII='
    }
    function insertLinks() {
        var username
        var appname
        var url
        // detect whether we're on github.io or github.com and insert the appropriate markup

        if ('io' === window.location.host.split('.')[2]) {
            username = window.location.origin.split(/[\.\/]/)[2]
            appname = window.location.pathname.split('/')[1]
            url = '//www.github.com/' + username + '/' + appname
            document.body.append(createLink(url, "Go to this project's repo", false, 'ijg-ghPagesToRepo'))
        } else {
            // ensure that this is a repo and not some other github page
            var repoHeadActions = document.querySelector('.repohead-details-container .pagehead-actions')
            if (!repoHeadActions) return

            username = window.location.pathname.split('/')[1]
            appname = window.location.pathname.split('/')[2]
            url = '//' + username + '.github.io/' + appname
            var li = document.createElement('li')
            li.append(createLink(url, "Go to Github Pages", true))
            repoHeadActions.prepend(li)
        }
    }

    function createLink(url, title, isSmall, optLinkClass) {
        var link = document.createElement('a')
        link.className = 'ijg-link ' + (optLinkClass || '')
        link.href = url

        var img = document.createElement('img')
        img.src = isSmall ? imgs.small : imgs.medium
        img.title = title

        link.append(img)
        return link
    }

    var styles = '\
a.ijg-link:hover {\
    background-color: gray;\
}\
a.ijg-link {\
    background-color: black;\
    padding: 3px;\
    line-height: 0;\
    border-radius: 4px;\
    display: inline-block;\
    text-decoration: none;\
    transition: background-color 150ms;\
}\
a.ijg-ghPagesToRepo {\
    top: 20px;\
    right: 20px;\
    border-radius: 6px;\
    position: absolute;\
}'

    GM_addStyle(styles)

    insertLinks()
    document.addEventListener('pjax:complete', insertLinks)
})();