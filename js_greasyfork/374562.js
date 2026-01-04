// ==UserScript==
// @name        OiNKPlus
// @author      Indieana AKA interonaut, indieana@mailpuppy.com
// @namespace   http://www.myspace.com/interonaut
// @description Enables easy artist discovery by adding similar artists, tags, short bio and search links to torrent details pages.
//
// @version     29.2
// @date        2017/02/20
// @since       2007/04/25
// @icon        data:image/png;base64,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
// @icon64      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABXxSURBVHhe1VsHWFRX2ib/80cGTSwxJmqiButaVpO4xmQTNWU3MdnYGwwg2AApNoqAhd4Fpc8MvXcQELGDoKASpYrSVEBFmgWTzWaT5f2/c++dYUYn2fzPlsB5nvdh5t4755z3Pd/3ne98M2j8J5thtIZIHKa5RVeqma4n1aoyCB/WJpaJ7utKNFvEUlGDWCK6IabXdL+b3j+l9z/oSkV/o/tt9DpfLNM0MpZqvCh0N7jaOqlool64Vr3b2flIadRB/v1tyG/fimP3tyL37ibk3DVCTpshjrYZILtVH1mtYmS26CKjZQOSmlYhsHwRLFLHgQQqXpuqoSV0O2jaC7SiBb7FH+JkhxlOdBjheOcq5HctJXyGY10fE5YQFiOvcxFhCeET5HZ8idz2Nci5p4ej98TIaF0Py7Tx0JVpegj9Do62NuClMYaRw38qaN+O40Q4t2cKQfv/AXq+613kdC6EtHo+SMzbQteDo+nJtN63yZ6KM12WyOuZhlNdRoTNONmlhxNd6wlrCWtQ0LmasIasYy2Od6xDfsd6HHugg7x2feTeN+BEyHowB/rhQ/+xzlFjiND9wG86YaL17mcW4GyXOa3mZJzsXk6v9xB2E3aRMDtxunMHwRKnOsx5N3lgioIHxjhOcSK/fTPy7hsht/v3yOmeii2xo7BOqjFC6H7gN4r8Rn4lS3C225Qz6YKez1DYbc3hXLcVzgliyIU41WkhxIp+EY6RCLndszl3ME4YBdpRRgrdD/xG29gm/5KPca7HWBBgMc737EVRjy2Kum0VQjCrOEMWoSKCYAn57VtIgN9xFmScMHxwCUBBy+DQ+cUkwDZBgA9R/NABxT32JIQdCUFidNvwQnDWoCpCwQMTHH/APjuN+7xxwsuDzAKkWmt8ihah8CGtIhE43rMQFx4eQMnD/YR9/ULIrUFhCXxMONGxnbOCQSuAWDrkS48zH6BIEKCABLj4yJFwUCEEswhlEbiY0MligqXCFXJ7pg9OASidXeJ8Yj7OPxJc4OEHKHvsgtLHziSCEy6QEKoi2AgxQXAFwQpye2YQWAwYMcgECNd6b1/e71H8mA+CJx5+hEtP3HHpsSsvhEIE3h1YTOCtgFyBrEAeC/J6ZtLnB+EusF6qtcAhdw5KHptwApx8uARXnnji8hMPEsGNE4G5BO8ODii674BTJU7Ij/VC3mE/5Hj7ITfYG0czDJBT+RGM48YMPgHsSYALTyw4AU4/+hzlvT4kgpcggitZgTNK2p1QEOeHLGMpMjfJkOMUiLwQX+SFeyI3wAdZdt7INJIhxtQVKduO6FDXL/AjDPDGCZAzG6VPdnMCnH28DFefHiIRvHH5kSfO33bD2TIPHN0lQaZhOJJNgpB7/CBONtrgbAdzAxYHLJBHmWBu1ccIs99Jz8n66NnUNGPpwM8ImQB2JMClXhvkdEzF0UtiJEW4IMTmANzX2MFvtRPSN9KqE3nZBh+4Lt/LY8Veur8XAda2iJJYIaVsEXIevAvj+FcRZeoiztgo+z7TKLwie2f0wHYHJoBt/NtIDD8AT73d/QQJXiv3IW0jv/JRuv5wW2GngPJzcnjqW8HK9nPYbd0wPdMwQieDswRZLjTw33UHz1X757mttDvkvMzW332V/c/6o/ta+zHOa/bEuqy0eY6M+0p7xIoDOPL5loloPd+Czqtd6KroxoPyDtwpuo1raeUo8MuBdPuRZ0Sx/Y4sJCDVUFrKPp9mKDH2XLN/t+tyu0Pe6w98Igz/n2luK22/pAn86LqMsHzv39mEPNce+ItwW9E8V9mto3s9/ZPmcWiDE3IPxKE84ARHnqEy4hJ6677F05vf/Szult7FMd8seK87oOjLY4VDX4z4CJL0Q/py9sfiRtwFpFpLf/Jat89QmMa/tzmuc3zJZbntA7fldtWeq+0me6yyW8om4rLM1l54RENqbPwiWUUQXe+TT5SBrXi2QzTqEy6iKfkSig5kKgRgYFbQmFWnlrwyOr7pRLpToqJfhtD1XqiWnOP6bUgshb+uc2faOsd/qWbwguNX1mONpRpDN4SIJmyQDZmuGzZkmqOB+S4SADZ7vl6pL9PUdhJb2rMJ2G81sGTvN/qMmeK8zCZReXIMNCFcCTnBTZCBTTZ7cyTKPM/Q+zoU7stVCFGbcE0t8WdxLf0bsoaDijHiLILQmFTG9U9WgL0ma1awOTGIQzUnb4zRnKIfrjl1o0RzijhCNEknSGu8o6PG/wh8+5t+nMYwXYloj4OZTrdJxLifdqa/2WeV/RassrVxwFIPbmttYJHyRp95hHafo4453LZYYGfKJFimTOiztVilsuoMwYYeqI0+ryDPJnnMLA6X3E7hx5vg8EPtTzhjy1sEE6aj7IFa0s/iduEt+Om5KsZK2h3GjcFczCr4HVimj+3bmcnDMuN1WKSPgVnqaGyJG963MXJYn55U9FBHoulsGaChyZP31RhGx9dy+/xpkOXowt96J1KvGiHnrgHy7m+En5ktXFfaIqVgB3w223DIr9tBaetOJKY8H+gOi11wPaZYQZ7hWuApZBlFoDu9QSEAQ2vOLYUVlAedV0tYHZrPNYMCoGLMApdkZNlHIa7sM6TcfQ/JbQuQ1DofCS3zEXfnXcTcehsRTfMQVj8Xh6tmYnfOGIilmmlE/wUNHYnIam/eZKS1rkJ2+xIknP0M3pst4W24G4EHtsJTt59kgP0WZN1m+bk20uvm0Z6tKoDHKnuUh55UIc9wwf0YCswS8DSzSUWA76v/rhDgpHWaWrJysN0i2y0FCXsjcLPgBq4klinG9Vy9D0GGrshu5ef2S8jsnIL41mkwSR7ZJw4TfahBpn9aUr0EGXf/jJzu3yH7wR8peXmbhPgUMul6HLE14QZxW2ONlMsLqRN2Rp+OIBd9xQTkyLSLfI58c8plXPQ6icI96XiaVo+/E2llEfJM4jgBck1i8bRePXmGVDJxj1UOCNrsDX99NzysfoxYK6libN8dpki//y7S7r2DlHtvI/nuPCS1zUNC61zEt8xB7J05iLo1C5HNM4mnNpyK34RumCiQCVAd37QUme0fILd7KjLa1iLr7gZk39Xl6vOZ1zfBfT25AQ3iQX+T8i1wtMKcy9rkgzN4rdmHutiS5wS4RYGr7NBZnNtNK5xaj++Le1QEyDWO5QQ4Zk4WIpBlUT/JPhrBW3y5lWbXksjEW4pbuNftl9vRU/kQTWca++dAbhpd/hVimz9GdPNiRDV9iIjG9xHe8B6kDfMhqX8boTfnIoIEYJYQWDuZfelyiZWvGhKav0QWpZzsRkbbamS2rScBdLgvJ3LuGSDhhDHcV/eTZemsYmAByXskz5FnuHO0EjWx3yCfVro3pR5PM5rwQ8X3HPlvr/5V4QJFTnkKATLJp9kWejroOJFs4q49qn2C7soelCdfRq5XBhLtojhRlGNBYIgBYpqXILppESKb/sgJIGtYAGn9u+T/80iA3yPmDqsxaEPSMAUGEVrtrIDZEt/8BbI75goCLFexgqNkBbkUDFNLjeFnafXcystx8UieWgFuZ15F56UOZG2KwL3wq5wVPM1oxN9Kn9D9OoUAN9OqFQIwP892T1W8f1L3FIWS0/ASEiJ3cgW2E/hRwHUjoeRz8DHbgZimJbT6HyGy8QOENy4kAf5Aq/8Owm7OQ8jNOYhr4atM4U2TsTFq6A8aulLN9vjmz5HdyUrQFNza/oKM1jVkBesEEZgVsC8qNiLvnhHSL5nCdZkqeRb8bsZfeI48Q3PqFfTe+JaL8md3peFJ8g1OhO64GhwT/P+UTTplhU8VhFmQq8qq4F6z6ymU8bFxfHWcUBxxjkudWZ8MLIVmliK3hMM+RohqVDL/+n7zD7kxmwuAjGdE82QYRg/9UYP8oCeu6c8kwCzuRlrbV0inHYFZAXOFLIUr8CJk1WxVIc9NbP1BteTleFz9CE9qe1HiXoCTFom4cjCfyPO+f2J3KjovdyrIP4uLlE+wMfz1XXGv9J7aZxhYPPBay4sQmr1cWH3B/Gn1mfkH35hFAkzlLaBZGwaRQ//GguC3sU1/6hegdSlhJYmwWiFCfzzQR3r5NhXyDIfFzmqJy9F16b5ios159bjkfw6lPqdxPbGCE0aZiDLYCgdu8uLGKIsr4a71VD3EZUqtmRjsPosXEZbBdG64h5PkhuxZ3z1mSsHvHWH15yDoxkyFALKmt6AfodVNFiD6IabpUxKAj44pJEBqy3IVEbLu9ouQVrFJhTyDH5mmOuJy3Dvd8By5X4Oeqkfc1sfGaCm+w13Lck3h3gdv9UVrSatiDufCTqI6u5J77a6/Syn4MfNnqz8bQXW/IwH4L2olDZOgF651i1nAj9GNnygESG75AiktXz8ngtwdspqf3/9ZIlKfUKqWPAPbCpV9/NeCBT+fDY7cGDU5Vdy1Av9c7n3kjmDOAliwjN4Vintl9xXu4mlqrrr6FPyCafUD62YgThAg9OZE9q1zFbOAn6IalyCrgw+CSXe+QPKdr35BhA3w3vR8CnxVckoteTnaKX19luCvQZ53Jtd/5M4QPL7ey5FuPFWPRzWPVZ7rruhBkOAuh8PWqV39gLrpiG2ZzPEMrKVESKJ5gVnA95ENi5Dezm+DCbc/R+KdpT8jAr87BHubqZBnOLovRi1xBSgjfEjprPKkfw26rnUj0IgnFkO5RtuFNtVnSJDms82QmPpzz3iZ0+rXvafi+/LVD7g+FRG3eAH8KsZTIiQ6wbbBjsiGj+gQ8S6liJMRf+tPPyPCChKBdgfaIuPObFQhz3BEzwXnaLXSbGQo9MlSK8KtjKsU9J6oEvgVYJkfC3RsHLbvy8wDKBYkI8M5CWHGfoo5+NgaQ1L1vtK+z0d+fvWn4cj1KQit588E3t+MYy6Qz2WCEfV/pJPTQu67+Lhbn/aLcHspucRXJMTXJMQyEmIFbw131sDHdJdiYDnCaTLHnRMRaXqYE0KdCK3519WS/Gdgpl9BAiY7ROOwgTtteZQUKSVlnqYWkNUrBz5+32eRn63+EVr9w9cnEyYhhwRwu/Q6S4UzWCZYFlw9n/LnDykQTqc0cgkiyCJkJIrk5gcIrXsfIYSwOvaert9cjIj6jxF0dIUK+WizI4riRFNyGeIpSP1cdvhsPGAnvet5teigpEb5+s+BiwO0s7B0mRufhDiU9QmO1M7G4dqZ8K+ZgUPV0+BbNQU+VdqEtwiT6NpEHKqZgLQHb8Hh3GiKAaIAJsChvccncrmzrHEazM5oweTUkF8FB+tV3ATYRKooQ1MmWRNVxImifE0ZXUJSwzI+b0qkgrf4cNUeVvV5lvCzYAGPPS8X38Fmpdr5qYPFWS2E1I/D9vSXIZYNWaGhJxk6jkRoszn2JkKvL0BA7Ty4lGtjX+l47L3wGqyLR8PqPA+bkjGwvzgO+8smwOmyNtxLZ8HbZCfC6IiqjmScZRBXr1N3jwXFWyducubcdLqRI3aLLIO9Z8XQZ0nL8ZCyypjdYQry7sam2Fs4lub6Ks1tDBxKX8N+Mu+Dl8fC8cpYOJWPhevV8fCseIOsgGE8rApGMfMvWeKo8b9cVYhy4rFkDtF6MlGXafLoPtv8iXA8Ow3uxbPgUTKb/s6Ga9EsuBTOxMHTM2B/fAqscybCMm1c307/t/+RZhOuliQriFZHqlqGMlKtZbhAlqJM8DLlE6zwoXxNjgdXOhBuHqgg76hjhh0xb2FH5hgOlpmvEkbDgiHjFcIomBMsMglZI7E9bTg7Af5VVyqK3hyh8TJHXrmxX2XqRg2ZpifR/Ews1VpH28QGsWTIah2J5lJ6vVhPqrVAJ/zFuXoRQ2awwuOGKNGEA0bbzFg9Th1BVqoq8lW/IzTQOf8wnehYYUOZJHsfYOjJ+bnydRYAD+k6K8gTuncf+PQTfYnWwn8G9m21jkTrD/qhL85RS/xfaW7L9278JQHYlxsJlMQ8myhVRxYimkxZmaQc8WRRXK5f9y1u0K7B9n85cdYf2wI9Vu9rE6bw2za3VQ5bU6ykKuTkYIVK5YmHUqZ2zDGBqxsyy2B5vToBWMGD7fHBFFvkn2cIofy/NreGK47Q8bdJmMJv29xX2a8NMfJUK4B0m68KAWUwQXI809UKcNzvqMqzrA5whbZYdjZg96uzK9ghSSZM4bdtrqv3TSI3+MdVyWkV8pXhZ+Hg+gV2xk2Gu8daeG2jxGklX1uUI5nS52fJM2Q4JcJz6w7YOy7FbukcuG7YxQVLViusO1ZLO4Vbp6/YdZIwhd++UR6QIiXzlG957G+UtTeci2Zwe69v5UxKsBYj6vonkJz4GsExG+B3YBtX4X1OAAp+oWZekN1YCMtzL8H0tCZMgifCZaXVKa+1+zvdV9gd91hpN10YemA0T7HdKNfltkeDDD36mN+HmLo+so6aBecrkzgBvCtmcFVaBpZwRTZS0nXlU84i2N6vLACr/B46uJkrZckF2BT70uD4iUy0dfDYwK2+2rrhw9+zzHiNkqUJnABeFdO4Gl0/FiK8YSF8bEy4iC/f8tjfpP2RCC5czNXxdggCbI4fZD+TYz+QsMgYA8fLb/ICXJtKhBdwVRoef+AQVroE7nq7EG8bgXJynaR9UfCPXibU8OZyAmwnAbYlDrKfynICpL9K6egbggVM5UyandQYJBze4Y+tle/hSNJfcDhqBYKLFnEFDFbBYSc5ToAzIpimjIQ4dMQoofuB35gA5umjyQLGCwJM4Y6oHGh1eczlVplHP2lWveHO8HSM3XFuGMzp8LI9bSTYV/ZC9wO/PS/AZI6kgihHVpUwq9ow0qx4wc7vgXXTKQgOIwylfH4kdGQvzha6H/iNF+AVOo0JAlRqCyTlEMiqEOZJs8oNK12x6g0jv7OQrIAEYDm90P3Ab0wAs7RRcLoyThBgkhJJZbJywqxcxZM+wlVtCLXasCABdhW9BPPMEaCT6iKh+4Hf2MnLjPzWuVwuwETFyvKrKyerRPi6NvyJtH/tW/CrnUSYSAJoYc95XgAdmeanQvcDv7Ejs1n6SLh8wwvgXTlBIMkTZavLwMjyYIR50qxkdajmTfjWvEEuoAXrkpdhmvYy+9e5L4TuB35jEZv5rfs1QYCqNwWC/UQ51MgJ95P2rRkPn2qGcdhROBR7Lw7H1sRh0AvVel/ofuC3pQEamtvThn/nVTmey+S8q8ZzBJXBk+UJ+wqEGbyrxxJeh1fVa+T/Q2FfNhxGMUP71gUPHSt0PzjaprihFxghM0pkvKt4cqpgROV4nZ55jSPtVTUGnlWvEkbDqngY9pEAehGiW0K3g6fpykR69oWvwKFshEBQmWQ/2X7CPGmPylc4uFeOwsHy4diRN4x9g+ModDuIGjReMIjQjLUqGNHncmU0xQMiV0F/BXhUysEIj+IIu1eOhFsFC54j4FD8MkzShjLytf/2Ot5/q4FEYP9BRiRy9MNFDXrhoke0n/fS616DSFHvxmhR76Y4rd4tCVq9W5O0ejfHa31nGCX6QSwTfasrEdWIpZpeevEaw4Xu/gNNQ+P/AOGLe8yR5jbtAAAAAElFTkSuQmCC
//
// @connect     img2-ak.lst.fm
// @connect     lastfm-img2.akamaized.net
// @connect     secure-img2.last.fm
// @connect     ws.audioscrobbler.com
//
// Preference window for userscripts, hosted by greasyfork:
// @require     https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
//
// @include     /https://orpheus\.network/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /http://arenabg\.(ch|com)/torrent(-download.+|s/search:.+/type:music/)/
// @include     /https://www\.deepbassnine\.com/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /http://efectodoppler\.pw/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https?://(www\.)?indietorrents\.com/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https?://(www\.)?jpopsuki\.eu/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https://karagarga\.in/(details\.php\?id=\d+(?!&page=)|browse\.php\?(dirsearch=.+|(search=).+&(search_type=director)|\2&\1.+))/
// @include     /https://kraytracker\.com/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https://libble\.me/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https?://(www\.)?music-vid\.com/(details\.php.+|browse\.php\?search=.+&searchtype=1)/
// @include     /https?://notwhat\.cd/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https?://psychocydd\.co\.uk/(details\.php\?id=[0-9a-f]{40}|torrents\.php(\?|\?active=1&)search=.+)/
// @include     /https://redacted\.ch/(artist|torrents)\.php(\?|\?page=\d+&)(id=\d+|(artistname|searchstr)=.+)/
// @include     /https?://rutracker\.org/forum/(viewtopic\.php\?t=\d+(?!&start=\d+)|tracker\.php\?nm=.+)/
// @include     /http://www\.secret-cinema\.net/(viewtopic\.php\?id=\d+(?!&p=\d+)|browse\.php\?cat16=on&search=.+)/
// @include     /http://shellife\.eu/(details\.php\?id=\d+|browse\.php\?search=.+&cat=1)/
// @include     /https://(www\.)?thepiratebay\.org/(torrent/\d+/.+|search/.+/\d+/\d+/(100|101|104|199))/
// @include     /https?://(www\.)?torrent(z((-proxy)?\.com|\.eu)|smirror\.com)/([0-9a-f]{40}|search\?q=.+\+music)/
// @include     /https://waffles\.ch/(details\.php\?id=\d+(?!&page=\d+)|browse\.php\?artist=.+)/
//
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/374562/OiNKPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/374562/OiNKPlus.meta.js
// ==/UserScript==
//
// ------------------------------------------------------------------------
//
// CHANGELOG
//
// 29.3         2018/11/19
//
//      change: Renamed Apollo.rip to Orpheus.network
//
// 29.2         2017/02/20
//
//      change: Tracker PassTheHeadphones renamed Redacted.
//      remove: NoStream (RIP.)
//
// 29.1         2016/12/26
//
//      remove: Tracker What.CD (RIP.)
//         add: Trackers orpheus.network, DEEPBASSNiNE, Efecto Doppler, NoStream, NotWhat.CD and PassTheHeadphones.
//         fix: Resolved bug with >4 custom trackers crashing script.
//
// 29.0         2016/07/31
//
//              THIS IS THE LAST TIME YOU WILL HAVE TO MANUALLY ADD/UPDATE YOUR API KEY! I PROMISE! ~newstarshipsmell
//
//         add: GM_config settings menus: All settings are now stored in the browser localStorage; script editing is no longer required to customize OiNKPlus.
//              The menu can be accessed from the Greasemonkey/Tampermonkey menus, listed under "OiNKPlus Settings", or from the icon in the upper-right corner of
//              the OiNKPlus panel. Setting selections (including the API Key) will persist across version updates, except for advanced settings for OiNKPlus itself,
//              as well as the advanced settings for predefined Trackers and External Sites (so I can put out updates that fix broken settings, without affecting
//              users' other setting selections.)
//         add: One-time warning prompt upon installation regarding the API Key, and offer to open settings.
//         add: Button/link to Last.fm API Key application page in the main menu.
//         add: Similar Artists threshhold and minimum settings - for finer control over the quantity and similarity of the displayed artists.
//      change: Shift+clicking/middle-clicking a similar artist will load a search for that artist on the current site, in a separate background tab. For Firefox,
//              if the switch to new tab immediately setting is enabled (under Options > General > Tabs), middle-clicking will focus the new tab(s); shift+clicking
//              will keep the current tab focused.
//         add: Artist Colors menu, to customize the similar artist colorization - default settings color them from green through yellow to red from most to least
//              similar. This feature no longer breaks the script from reloading Last.fm metadata when you click on the similar artists.
//         add: Highlighted Artists menu, to highlight similar artists that match a list of artists stored in settings. This could be your Gazelle tracker Artist
//              Notifications filter list, a list of artists from your media player, or any combination thereof.
//         add: Artist names can be parsed for 'English (native/non-English)' entries and load Last.fm metadata for the English spelling only. An additional setting
//              will add a link beside the artist name, which reloads data for the native/non-English spelling. This feature is a little buggy and needs some further
//              tweaking.
//         add: Tag threshhold and minimum settings - for finer control over the quantity and weight of the displayed tags. The tag weights (percentages relative to the
//              most popular tag's weight) can be added to tooltips on the tags.
//         add: Tags can be linked to tag searches on the current site, if it supports tagging and tag searches.
//         add: "Useless" tags, e.g. "awesome," "seen live," etc., can be hidden. Current version comes with a very short list of some more common useless tags.
//         add: The artist image can be linked to the gallery page on Last.fm.
//         add: Site Settings menu, which controls which trackers and external sites have searchlinks added, and which trackers OiNKPlus will run on and insert itself.
//              Descriptions of the external sites can be enabled in the tooltips, and a country selector for Qobuz can be set to a particular country/language.
//              The ordering of trackers and groups of external sites and sites within each group can all be configured here as well.
//         add: Advanced settings menus for trackers and external sites, including all of their variables/functions. This allows modifying them without editing the script,
//              in case one of them changes their layout, search URL, etc., so a quick fix can be made by the user before an updated version is released to fix it.
//              This also allows for adding custom trackers and external sites not predefined by the script, for those users who wish to add more sites and know how to.
//         add: Advenced settings menu for OiNKPlus itself, where various things can be changed. Most of these there's probably no reason to change, but they're there,
//              just in case. Some of them, like the Explore Similar image, aren't even used anywhere in the script.
//         add: An icon for OiNKPlus. (The settings link in the panel can be removed if you get tired of looking at it.)
//      change: Updated URL Directives with regular expressions, for precise site/page matching, and checked sites for protocols/subdomains.
//         fix: Tracker URL matching patterns fixed to match paginated Gazelle torrent/artist pages - so OiNKPlus will now load properly on all comment pages, and is
//              compatible with Infinite Scroll.
//      change: Updated a few of the searchlink icons.
//         add: Karagarga and Secret Cinema (search only for the latter.)
//      change: Waffles.fm updated to Waffles.ch, and OiNKPlus panel repositioned immediately below the description.
//      remove: KickassTorrents (RIP.)
//      change: 7Digital, Boomkat, Digital Tunes, JunoDownload, Magnatunes, Qobuz and Rate Your Music all link directly to the relevant artist page, rather than searches,
//              but ONLY if the artist name is not entirely non-letters (e.g. !!!) and does not contain any non-Latin characters that aren't diacritically-marked
//              Latin characters (e.g. Χείλια Λουλούδια, but not François Béranger.) Aforementioned artist names will link to a search results page, as normal. This may
//              sometimes prevent the script from linking to the desired artist. I will try to tweak it some more in the future. This behavior can be disabled (and link
//              to search results instead) on a per-site basis in the External Site Advanced menu (untick the checkbox next to Use alternate URL.)
//         add: Metacritic, Pitchfork and Spin searchlinks, under "Review Sites." I can't believe it never occurred to me in all this time that OiNKPlus was completely
//              missing any review site searchlinks (though I suppose AMG could be considered one.)
//              Seems like a glaring omission. I'll add more sites in the coming updates.
//         add: Encyclopaedia Metallum and LyricWikia.
//         add: fnd - it lets you search/browse the iTunes Store without launching iTunes, but it's limited to a single country, and only has a mobile device layout...
//      change: The iTunes Store only has one searchlink now - the external sites which use Google site:domain searches have checkboxes to enable/disable Google Lucky.
//      change: CD Baby searchlink goes directly to the site instead of googling the artistname + site:cdbaby.com.
//      change: YouTube filters to channels; can be easily unticked on results page to show all results.
//         fix: Beatport, Myspace and WhatPeoplePlay search URLs work again.
//      remove: WiMP country sites (I left play.wimpmusic.com in there, but disabled, since it serves the same content as listen.tidal.com.)
//      remove: The Chrome localstorage redefinitions for GM_getValue/GM_setValue functions - I presume everyone's going to run this in Greasemonkey or Tampermonkey,
//              since Google made it difficult to install native scripts in Chrome a while ago. This makes that code wholly redundant, as far as I know.
//      change: Removed some obsolete and/or commented out code, and corrected all the syntax errors.
//
//         bug: On Waffles, Similar Artists colors don't work (probably due to CSS.)
//         bug: On indietorrents and Libble, OiNKPlus still inserts itself above torrent/artist info boxes, when collage lists are present - I'll fix that in the next
//              minor update.
//         bug: On Libble, it still doesn't work well with the july4v2 or july4v2r stylesheets - I'll ty to fix this soon.
//         bug: On indietorrents, artist searches from OiNKPlus don't encode correctly, or get decoded incorrectly (not sure which) and land on torrent search pages
//              with percent-encoded special characters, for artist names with special characters in them. It isn't happening on any other Gazelle trackers.
//              I added a cheap fix that just checks whether a search page on indietorrents has loaded with percent-encoded characters in the searchstring - if so, it
//              copies the string, decodes it, pastes it into the artist searchbar, and submits the search. This "fixes" the problem, for now.
//         bug: OiNKPlus doesn't load at all on TPB now, and still doesn't work on ArenaBG and RuTracker (but the searchlinks work.) I am told it is broken on
//              Kraytracker, and I assume it is probably broken on MusicVidz and RockBox as well. I will try to fix it up on the trackers I have access to, in the next
//              minor update.
//         bug: On Gazelle trackers, if OiNKplus's content ends above the last box in the right sidebar, it will extend itself with a bunch of deadspace.
//              I'll try to fix this soon.
//
//              FUTURE PLANS:
//
//         fix: Bugs listed above.
//         fix: Clean up my own code and variable names, and determine what all of the commented out code I inherited can be permanently removed.
//         add: Caching of Similar Artist and Tag metadata, for up to a week. This is actually required by Last.fm's API ToS, and OiNKPlus has been continuously
//              violating these terms for years now... There's code throughout the script for some sort of caching, but it's mostly commented out - so I'm unsure whether
//              it was completed and disabled at some point, or never implemented to begin with.
//         add: Detect and handle API error messages, rather than simply breaking on them. Replace failed content with some sort of visual indicator. Errors could include
//              an invalid key, a suspended key, or service outage. Lack of a response should be handled too.
//      change: Improve the menu layout - add collapsible sections, collapsed by default, on the longer menus, and use CSS to make them less awful-looking.
//      change: Add validation to the menu string inputs - currently there are none, though I've tried to implement other checks elsewhere to prevent the script breaking
//              over malformed settings strings.
//         add: Option to import/export menu settings, to facilitate backing them up / migrating between browsers.
//         fix: The basic layout, so it is firmly divided into three columns that don't spill into each other.
//      change: Add options to set maximum heights on the various widgets, and make the content within scrollable (i.e. the similar artists and biography widgets.)
//      change: Modify the hook and findArtist functions to add OiNKPlus to torrent search results page - the match patterns are already modified to account for this.
//      change: Format the tags so they are modified/colorized by the Gazelle Tag Colors script, or implement an equivalent feature in OiNKPlus.
//      change: Expand the default list of useless tags to be as comprehensive as possible.
//         add: Some sort of action like shift+clicking a tag automatically adds it to the useless tags list and hides it.
//      change: Detect variations of common biography openers for multiple-artists-with-the-same-name, and try to parse numbered sections and separate them more clearly,
//              or add left/right buttons to cycle through them.
//      change: Minor tweak to the artist colors settings, so you can curve the range of colors rather than having them change linearly with similarity.
//      change: Add the option to parse featured artists in the track artist and/or track title tags, and either include or exclude them from the list of artists imported
//              into the Highlighted Artists list. This will include an additional fb2k Text Tools command for copying the data.
//         add: An option to add your Last.fm account, and add settings to highlight Similar Artists based on minimum playcounts, loved tracks, etc.
//         fix: Hide the alternate title next to the artist title, that reloads data for the parsed-out native-spelling, when you click on other artists. Currently, it
//              remains there indefinitely, after you've reloaded metadata for other artists. It's a nuisance, but doesn't break anything. I plan to make a separate
//              widget for some of the additional buttons I want to add, and move the settings icon there so it isn't offsetting the searchbar/artist image.
//      change: Add left/right buttons to the artist image widget to cycle through the image gallery on Last.fm - and possibly add an option to cycle them automatically
//              every x seconds. Possibly add a lightbox viewer as well - though currently the image displayed is at maximum size, as it's the largest image returned in
//              the API result; this would require scraping the site html gallery pages to obtain larger images.
//         add: Additional music trackers and trackers that have music categories.
//         add: Additional external sites (more review sites, maybe some more webstores, and anything else I can think of.)
//         add: Support for album title detection, which seems to have been partially worked into the original version, but never finished. This would include updates to
//              all of the searchlinks, dividing them into three URLs, artist, album, and artist+album, and defaulting in reverse order when the site in question doesn't
//              support that particular combination for searching. It would add a button/slider/etc. somewhere that toggles between which mode you want the searchlinks to
//              perform searches in.
//         add: Embedded music players for Spotify, SoundCloud and Bandcamp. I can easily figure out how to get/add them, I'm just not sure how to work them into
//              OiNKPlus's framework, so I need to figure out how the rest of the script works before I can proceed. I need to fix the layout so they stay in the center
//              and don't crowd into the right side.
//         add: Support for detecting multiple artists and artist roles on Gazelle trackers, and add a widget above the Similar Artists that displays these artists. This
//              would include a menu to color-code them depending upon role as well. It should basically work just like the Similar Artists list, reloading tags/bio/image
//              when you click on each artist, and updating the searchlinks. Should probably update the similar artists on each click too, and then hide the multiple
//              artists widget if you reload data for a similar artist, but show the multiple artists widget again if you click on the Various Artists entry in the
//              Browsing History.
//      change: Possibly eliminate the distinction between trackers and other sites, so the OiNKPlus panel can be added to any site, rather than just trackers. Possibly
//              with an option to add an abbreviated panel on a per-site basis, with just searchlinks to search other sites.
//
// 28.5         2015/01/03
//         add: 7Digital and HDtracks.
//
// 28.4         2015/12/31
//         add: Deezer, eMusic and CDBaby.
//      remove: GEMM (RIP).
//
// 28.3         2015/12/20
//         add: Search link to ArenaBG, doesn't load script there yet
//      change: Now loads on TPB Audio > FLAC and Audio > Other, but the search icons still don't appear on any pages.
//      change: What.CD artist truncation variable was not working, commented it out at line 386 and hardcoded feature into What.CD Hydra code at lines 669-671.
//      change: URLs updated
//      remove: IP addresses
//
// 28.2         2015/12/03
//      change: Added an option (default on) that on What.CD truncates ' (string)' from artist names, so artists with 'englishname (foreignname)' will typically load the desired results from Last.fm. Option to turn it off since it will interfere with other artist names that include ()s.
//      change: Changed the more link for What.CD (when you click the artist name next to '[ load similar ]') it will now perform a torrents.php search instead of artist.php search - since the relevant artist page is already linked to the artist name at the top of the page, and this way you can easily search the torrents if you landed on an undesired artist page.)
//         fix: Fixed the previous fix so it doesn't break on artist.php
//
// 28.1         2015/12/02
//         fix: Fixed the What.CD widget so it always inserts OiNKPlus below the Info box (Collage listings would mess this up previously.)
//
// 28           2015/11/27
//         add: re-added Shellife (it was added before but wouldn't run on Shellife.)
//         add: added search links for RuTracker and Kickass Torrents.
//      change: moved the API key variable up with the rest of the "settings." Someday I'll figure out how to add these as menu options...
//              This key must be obtained/added by each user.
//      change: added SIMILAR_ARTISTS_COLOR setting
//      change: added color to similar artist list - more green, more similar, more red, less similar. But it breaks the script from reloading tags/bio/picture/similar artists
//              when clicking on similar artists, so by default it's turned off until I can figure out how to make it work properly.
//      change: various variable/setting names
//         fix: updated the Last.fm API calls to 2.0 so they work again.
//      remove: The SSL setting for What.CD, since it's obsolete.
//
// 27           2015/06/07
//         add: Setting for Qobuz search to set country/language, rather than UK/English.
//      change: Updated the include URLs/IPs
//      change: Updated some of the favicons, commented out some of the excess search links (but left the code in for them.)
//         fix: Cleaned up some search urls that were passing ampersands improperly, tweaked some others for better results.
//      remove: defunct sites.
//
// 26           2014/11/07
//         add: boolean variable USE_SPOTIFY_APP to set whether the Spotify link opens in the browser or the application.
//         add: boolean variable WHATSSL to set whether the Trackers: link for What.CD uses SSL or not.
//         add: links for Tidal, Magnatune, ScnLog, Plixid and AllLossless.
//      change: updated most favicons with higher quality 32x32 icons.
//      change: removed anonymizing link.
//         fix: SoundCloud link.
//
// 25           2014/10/01
//         add: External Links for Spotify, WiMP, Qobuz, Beatport, Bleep, Boomkat, Digital Tunes, Juno Download, whatpeopleplay, eBay, GEMM, MusicStack, CDandLP, Big Cartel,
//              Int'l Amazons, Google+, Twitter, Tumblr, Vimeo, freedb, ReverbNation, Filestube, IsraBox, Exystence, Kwezz, MusicDL, New Album Releases, No Data.
//         add: string variable ICON_SIZE to set favicons to display at any size; default is 16.
//         add: string variable ICON_PADDING to set favicons' padding to any size; default is 1.
//         add: string variable SITES_SPACING to add extra linebreaks between External Links' groups if desired.
//      change: Updated the @include *xxx.xxx.xxx.xxx/* lines to all active trackers' current IPs.
//              ac-d-l-u-ge.org.uk.
//      change: Commented out the site_functions for trackers that were never enabled, but are still active: ArenaBG, FunkyTorrents, and Romanian Metal Torrents.
//      change: Updated External Links' Search URLs and Favicons as needed.
//      change: Replaced External Links' tooltip titles with site summaries from Wikipedia or the respective sites' About Us pages.
//      change: Moved the sites'/trackers' faviconized links underneath the Last.fm biography.
//      change: Grouped the External Links under Streaming, Webstores, CD Stores, Amazon, Social Media, Music Databases, Music Blogs, and Other.
//      change: Replaced 16x16 base64 favicons with resized 32x32 favicons.
//      change: Cleaned up/alphabetized the External Links' var defs.
//      remove: Completely removed the Last.fm and Myspace players, since neither of them will ever work again.
//      remove: All the @include lines and site_functions for defunct trackers: Mininova, scenetorrents, scenesound, christiantorrents, tracker.vipv2.org, exodusmusic,
//      remove: External Links: Imeem, Seeqpod, RIAARadar (defunct) and Foxytunes (defunct, redirects to Yahoo)
//              I have not tested Kraytracker, Libble, MusicVids, Torrentz or Rockbox - any or all of them may not work correctly or at all.
//
// 24           2014/09/29
//         fix: Added @grant GM_getValue, GM_setValue, GM_xmlhttpRequest so script would run again in Firefox/Greasemonkey. see http://wiki.greasespot.net/@grant
//         add: JPopsuki site_function/Hydra Link
//         fix: indietorrents site_function (Gazelle upgrade for indietorrents previously broke OiNKPlus on indietorrents; it's fixed now, but the Search URL to indietorrents
//              passes spaces as %20 and their site does not process them correctly, so artist names including spaces will return zero results. Not sure how to fix it.)
//
// Script development abandoned by Sepulcrum; adopted by newstarshipsmell
//
// 23           2011/11/23
//         fix: Parsing songs from myspace page.
//
// 22           2011/08/05
//      change: Myspace search results parsing use the first result that contains the search term in the myspace page title rather than the first result on the page
//              Display the found artist and link to the myspace profile that the songs were extracted from
//
// 21           2011/08/04
//              newstarshipsmell:
//      remove: Shellife.eu/67.228.39.196 from the inclusion list (shellife site update broke the script long ago; they have their own site-specific OiNKPlus fork now.)
//      change: Updated favicons for MySpace, Hypem, Shellife and Libble
//      change: Searchlinks for AllMusic (old google:site string was broken, replaced with regular artist search), What.CD (artists.php instead of torrents.php),
//              Waffles.fm (sorts results by year descending), and Shellife.eu (exact matches only.)
//         add: External links for Facebook (only searches Music Pages, i.e. won't return Groups for older/inactive bands), BandCamp (onsite search is just a
//              google:site+"query" string, same here), and MusicBrainz (artist search.)
//
// 20           2011/07/21
//      change: Exclude myspace charts tracks
//
// 19           2011/07/15
//      change: Changed to get the songs from the artists Songs page so we get them all
//
//              gondaba:
//         fix: Got MySpace functionality back by adding the tracks as links that can be played/paused on click
//
// 18           2011/04/06
//         add: External links for Grooveshark and Soundcloud
//      change: Commented out lastfm player code as it hasn't worked in a long time
//      change: Updated update-notifier link so there should now be update notifications
//      change: Chrome: Use localstorage instead of cookes for GM_getValue, GM_setValue functions
//         fix: Parsing myspace results page
//      remove: metalbits and stmusic links
//
// 17           2011/02/25
//      change: The myspace player scraper to just pull the div tag for bandMusicPlayer and inject that into the page rather than extracting the flashvars and using
//              the swf hosted on naptoon
//
// 16           2011/01/11
//         fix: Not finding artist page correctly from results
//
// 15           2010/11/22
//      change: Myspace search url to search music artists rather than the whole of myspace
//
// 14           2010/11/16
//              Fixed myspace player support
//              Changed to use myspace search instead of google as google keeps focing us to use captchas every now and then
//
// 13           2010/04/16
//         add: support for music-vid.com
//      change: Removed ScT (R.I.P.)
//         fix: replaced what.cd artist search (it's it's now ID based) with torrent search
//
// Script development abandoned by Indiana; adopted by Sepulcrum
//
// 12           2009/01/28
//         fix: MySpace player fix, thanks gondaba for the fix
//
// 11           2008/09/30
//         fix: yet another MySpace player fix (these guys change their player code like panties)
//         add: site support for Rockbox, Shellife/MBT and Acid-Lounge
//
// 10           2008/09/19
//         fix: MySpace player broken
//
// 9            2008/09/03
//      change: tidied up layout
//      change: switched to new last.fm api
//         add: What.cd SSL support
//      change: Use exact artist search where possible
//
// 8            2008/06/13
//         fix: indietorrents.com domain recognition
//         add: OiNKPlus shown on artist pages on What.cd
//         add: what.cd https browsing
//         add: support for torrentz
//         fix: OiNKPlus shown above comments on What
//         fix: OiNKPlus shown above artist info on TPB
//
// 7            2008/04/16
//         fix: phrase quotes on The Pirate Bay
//         add: Gazelle support
//         fix: fixed Google search since MySpace player wouldn't show in rare cases
//
// 6            2008/03/21
//         add: support for indietorrents, metalbits finally
//         fix: ct support
//         fix: MySpace player working again
//      change: read more abstract is now shown inline instead of external page
//         fix: load similar will now not reload present artist information
//
// 4            2008/02/06
//              Same as 3.02, considered stabe now
//
// 3.0.2        2008/01/21
//              New site support
//         add: support for SceneTorrents, SoftMp3.org, KrayTracker, arenabg.com, MetalTorrents, TheMusik.org, WLM, vipv2.org
//         fix: Improved MySpace google search query
//         fix: oinkplus not showing up on unrcognzied artists
//      change: update ip addresses of several trackers, welcome to sweden!
//      change: TPB allows phrase search
//      change: new categories on waffles
//         fix: extreme lag caused by caching, caching disabled now
//      change: More on these sites
//         add: external link to PureVolume
//      change: shorten external links names
//         fix: search query on waffles changed
//         fix: what.cd suppport, what.cd details page structure changed
//      change: removed prototype framework at cost of ugly code
//
// 3.0.1        2007/11/20
//              small bugfix
//         fix: what.cd site layout changed
//
// 3            2007/11/08
//              Second beta, the HyDrA Release
//         add: support for various sites including Waffles.fm, What.cd, Stmusic.org, Libble.com, ThePirateBay.org, Mininova.org and FunkyTorrents.com
//         add: search bar to lookup artist with Oinkplus
//         add: new browsing capabilities by navigating deep into similar artists (browsing history)
//         add: new external links to Hypemachine, SeeqPod, RIAA Radar and Pandora
//         fix: avoid sending referer for flash content and artist logo
//              Thanks and credits to Drew McLellan for Flash Satay and Marcus Granado for binary XHR [http://mgran.blogspot.com]
//         fix: speed up by not loading unneccessary images and objects in fetched html,intepret code as plain text instead
//         fix: remove script tags or embedded stuff in abstracts, less ressource consuming and better security
//         fix: small toggle icons are now hard-coded base64 encoded data streams
//         fix: abstracts now showing up again
//         fix: don't show Oinkplus in Apps etc.
//         fix: smaller bugfixes and code improvements
//
// 2            2007/06/03
//              Beta test ended, first stable version
//              minor bugfixes, added display toggle
//              added more external links
//
// 1            2007/04/25
//              Original version - beta
//
// This script is for use with several torrent trackers
// It adds information to torrent details pages.
//
// ------------------------------------------------------------------------
//
// Copyright (c) 2007-2008, indieana  AKA interonaut, indieana@mailpuppy.com
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// ------------------------------------------------------------------------
//
// FEATURES
//
// - data from last.fm
//  similar artists,
//  tags,
//  short bio,
//  preview player
//
// - data from Myspace.com
//  preview player
//
// - links to external ressources
//  last.fm, myspace, imeem, foxytunes, allmusic, wikipedia, discogs, google, amazon and others
//
// ------------------------------------------------------------------------
//
// IMPORTANT NOTICE
// The script does not and will not do automatic searches on the site it runs on,
// because it is very harmful to the site's performance. If you had the
// great idea of implementing such a feature you are STRONGLY advised not to do so.
// OiNKPlus is not related to the supported sites in any way. Use at own risk.
// Some functions were created by the Platypus extension.
// The script may frequently break, therefore it will automatically check for updated
// versions every now and then.
// The author does not claim the code to be elegant.
// Ok? Fine.
// Suggestions, feedback and contributions welcome.
//
//
// FUTURE DEVELOPMENT
// If you would like to see this script to work with another site not supported yet,
// like another public or private tracker, get in contact with me (indieana@mailpuppy.com),
// I will gladly port it to that site. Please remind, that I need to be invited, if
// the site is private, though.
// Please refrain from simple tinkering to make it work with other sites, in case you
// don't want to seriously maintain the script. This rushing ahead attitude has shown to
// result in a lot of confusion among users and unsupported or even buggy code in the past.
// On the other hand, the GPL license gives you all the freedom, for example if you seriously want
// to improve the script. Please let me know, I would love that and I'm curious!
//
//
// CREDITS
// * My greatest respect goes to oinkylicious Alan, for selflessly driving the amazing
// community that OiNK was. His excellent vision and talent of leadership have impressed
// and motivated me eversince I have been a proud member of the site. It was for his
// generous front paging to get the word about Oinkplus spread and opening it up to
// a broader audience.
// * Many thanks go also out to the fellow OiNKers, that provided suggestions, bug fixes,
// spread the word or even went as far as porting the script to other browsers. Thanks go to
// Eighty, ar33ome3, )deckstream(, evilman, lhnz, the_e_male among all the other dedicated users
// that found very nice words and placed themselves in a 1000 replies O+ thread :)
// * Thanks to the codemonkeys, that open up their code, especially those,
// that code/libraries the script makes use of. The is remarked in the code.
// * Love is sent out to the wonderful people over at Last.fm that provide the excellent, reliable
// webservice, this script relies on. Sign up for their great subscription service!
// * At last lovely greetings to everyone supporting the hydra!
//
// Enough pathos,
// have fun!
//
// ------------------------------------------------------------------------
// Developed under Kubuntu Linux, Kate
// ------------------------------------------------------------------------

var VERSION = 29.2;
var includesUpdated = true;

var oinkplusImageType = 'png';
var oinkplusImageData = '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';
var oinkplusIcon = '<img src="data:image/' + oinkplusImageType + ';base64,' + oinkplusImageData + '" style="width: 32px; height: 32px; border-width: 0px; padding: 0px 0px 0px 0px;">';

function main() {
  EventNotifier = {
    observers: new Array(),

    /*
      Function: addObserver
        Registers a new object as observer

      Parameters:
        observer - Observer (should implement message function to be notified)
        sender   - Sender object (default:null) If not null, observer will only received message from this object
    */
    addObserver: function(observer, sender) {
      sender = sender || null;
      this.removeObserver(observer);
      this.observers.push({observer:observer, sender:sender});
    },

    /*
      Function: removeObserver
        Unregisters an observer

      Parameters:
        observer - Observer
    */
    removeObserver: function(observer) {
      //this.observers = this.observers.reject( function(o) { return o.observer == observer });
      var results = [];
      this.observers.forEach(
        function(o) {
          if (o.observer != observer) {
            results.push(o);
          }
        });
      this.observers = results;
    },

    /*
      Function: send
        Send a new message to all registered observers

      Parameters:
        sender    - Sender object (can be null)
        eventName - Event name (observers have to implement this method)
        options   - Object or Hash table (for multiple options) of sending event  (default null)
    */
    send: function(sender, eventName, options) {
      options = options || null;
      this.observers.forEach( function(o) {
        if ((o.sender === null || o.sender == sender) && o.observer[eventName])
          o.observer[eventName](sender, options);
      });
    }
  };

  function deserialize(name, def) {
    return eval(GM_getValue(name, (def || '({})')));
  }

  function serialize(name, val) {
    GM_setValue(name, uneval(val));
  }

  var CACHE_NAME           = "OINKPLUS_CACHE";
  GM_setValue(CACHE_NAME,0);
  var CACHE_SIZE           = 75;    //does this still do anything?
  var M_RE                 = 0;
  var R_STRING             = 1;
  var TYPE_HTML            = 0;
  var TYPE_XML             = 1;
  var TYPE_BINARY          = 2;
  var UNLOADED             = 0;
  var LOADING              = 1;
  var LOADED               = 2;
  var CACHED               = 3;
  var FAILED               = 4;
  var TOGGLEABLE           = true;
  var NON_TOGGLEABLE       = false;
  var NAME                 = 'OiNKPlus';

  /*
  var oinkplusCache;
  if (!GM_getValue('oinkplusCache')) {
    GM_setValue('oinkplusCache', JSON.stringify({
    });
  } else {
    oinkplusCache = JSON.parse(GM_getValue('oinkplusCache'));
  }
  //604800000 milliseconds per week
  //msSinceTimeZero = new Date().getTime();
  */

  var lastfmApiKey         = GM_config.get('lastfm_api_key').replace('Click on "Get API Key" below!', '').toLowerCase();
  var artistUrlVariable    = gmc_opadv.get('oinkplus_var_artist');
  var albumUrlVariable     = gmc_opadv.get('oinkplus_var_album');
  var tagUrlVariable       = gmc_opadv.get('oinkplus_var_tag');
  var apiKeyVariable       = gmc_opadv.get('oinkplus_var_apikey');
  var lastfmArtistUrl      = gmc_opadv.get('lastfm_artist_url');
  var lastfmBioUrl         = gmc_opadv.get('lastfm_bio_url');
  var lastfmBioLink        = gmc_opadv.get('lastfm_bio_link');
  var lastfmGalleryUrl     = gmc_opadv.get('lastfm_gallery_url');
  var apiKeyWarning        = 'OiNKPlus is installed, but no Last.fm API Key has been stored in the settings. No Last.fm metadata can be loaded until you add one.\nTo get a key, open the OiNKPlus Settings window. Either click on the OiNKPlus Settings button in the upper-right corner of the OiNKPlus box, or open it via the script menu while on any supported tracker\'s torrent/artist page.\nFirefox: Options > Greasemonkey > User Script Commands > OiNKPlus Settings.\nChrome: Click on the Tampermonkey button, and click OinkPlus Settings in the left column.\n\nOnce the Settings window is open, click on the "Get API Key" button at the top. This will open the key application page in a new window/tab - if you are not currently logged into Last.fm, you will be prompted to log in.\n\nThe only fields you need to fill in are your contact email and application name. You do not need to open your email to confirm the application - when you submit it, the next page will give you your new API key.\n\nOnce you have obtained a key, copy it from the page, paste it into the box at the top of the OiNKPlus options window, scroll to the bottom and click "Save." The page will automatically reload to apply any changes made to the settings.\n\nWould you like to open the OiNKPlus Settings window right now?';
  if (/[a-f0-9]{32}/.test(lastfmApiKey)) {
    GM_setValue('apiKeyWarned', false);
  } else {
    lastfmApiKey = '00000000000000000000000000000000';
    if (!GM_getValue('apiKeyWarned'))
      if (confirm(apiKeyWarning))
        GM_config.open();
    GM_setValue('apiKeyWarned', true);
  }
  var lastfmInfoUrl        = gmc_opadv.get('lastfm_info_url').replace(apiKeyVariable, lastfmApiKey);
  var lastfmTagsUrl        = gmc_opadv.get('lastfm_tags_url').replace(apiKeyVariable, lastfmApiKey);
  var lastfmSimilarUrl     = gmc_opadv.get('lastfm_similar_url').replace(apiKeyVariable, lastfmApiKey);
  var lastfmAlbumsUrl      = gmc_opadv.get('lastfm_albums_url').replace(apiKeyVariable, lastfmApiKey);
  var resourceLoadTimeout  = Math.floor(1000 * gmc_opadv.get('resourceLoadTimeout'));
  var togglePlusImage      = 'data:image/' + gmc_opadv.get('oinkplus_plus_icontype') + ';base64,' + gmc_opadv.get('oinkplus_plus_icondata');
  var toggleMinusImage     = 'data:image/' + gmc_opadv.get('oinkplus_minus_icontype') + ';base64,' + gmc_opadv.get('oinkplus_minus_icondata');
  var spinnerImage         = 'data:image/' + gmc_opadv.get('oinkplus_spinner_icontype') + ';base64,' + gmc_opadv.get('oinkplus_spinner_icondata');
  var searchImage          = 'data:image/' + gmc_opadv.get('oinkplus_search_icontype') + ';base64,' + gmc_opadv.get('oinkplus_search_icondata');
  //var exploreSimilarImage  = 'data:image/' + gmc_opadv.get('oinkplus_explore_icontype') + ';base64,' + gmc_opadv.get('oinkplus_explore_icondata');
  var maxSimArtists        = GM_config.get('max_sim_artists');
  var minSimArtists        = GM_config.get('min_sim_artists');
  var minArtistThresh      = GM_config.get('min_artist_thresh');
  var simArtistsColor      = gmc_opcol.get('col_sim_artists');
  var highlightArtists     = gmc_opart.get('sim_artists_notif');
  var showDescriptions     = gmc_opsit.get('show_descriptions');//
  var iconSize             = GM_config.get('icon_size');
  var iconPadding          = GM_config.get('icon_padding');
  var groupPadding         = GM_config.get('group_padding');
  var qobuzCountries       = {
    'Austria (German)': 'at-de', 'Belgium (Français)': 'be-fr', 'Belgium (Nederlands)': 'be-nl', 'France (Français)': 'fr-fr', 'Germany (Deutsch)': 'de-de',
    'Great Britain (English)': 'gb-en', 'Ireland (English)': 'ie-en', 'Luxembourg (Deutsch)': 'lu-de', 'Luxembourg (Français)': 'lu-fr',
    'Netherlands (Nederlands)': 'nl-nl', 'Spain (English)': 'es-en', 'Switzerland (Deutsch)': 'ch-de'
  };
  var shellifeTagArray     = gmc_optra.get('tra_shellife_taglist').split('\n');
  var shellifeTags         = {};
  var shellifeTagName, shellifeTagCat;
  for (var i = 0, len = shellifeTagArray.length; i < len; i++) {
    shellifeTagName        = shellifeTagArray[i].split(':')[0];
    shellifeTagCat         = shellifeTagArray[i].split(':')[1];
    shellifeTags[shellifeTagName] = shellifeTagCat;
  }
  shellifeTagArray         = null;

  var artist;
  var siteFunctions        = {};
  for (i = 0, len = trackers.length; i < len; i++) {
    var tname = trackers[i];
    siteFunctions[tname] = {};
    siteFunctions[tname].addlink = gmc_opsit.get('show_' + tname);
    siteFunctions[tname].addtosite = gmc_opsit.get('addop_' + tname);
    siteFunctions[tname].name = gmc_optra.get('tra_' + tname + '_name');
    siteFunctions[tname].label = gmc_optra.get('tra_' + tname + '_label');
    siteFunctions[tname].isGazelle = gmc_optra.get('tra_' + tname + '_isGazelle');
    siteFunctions[tname].searchurl = gmc_optra.get('tra_' + tname + '_searchurl');
    siteFunctions[tname].urlpatterns = [gmc_optra.get('tra_' + tname + '_searchpatt'), gmc_optra.get('tra_' + tname + '_torrentpatt'),
                                        gmc_optra.get('tra_' + tname + '_artistpatt')];
    siteFunctions[tname].urlreplace = [];
    siteFunctions[tname].tagurl = gmc_optra.get('tra_' + tname + '_tagurl');
    siteFunctions[tname].tagreplace = gmc_optra.get('tra_' + tname + '_tagreplace').split('\n');
    siteFunctions[tname].css = gmc_optra.get('tra_' + tname + '_css').replace(/\n/, '');
    siteFunctions[tname].version = gmc_optra.get('tra_' + tname + '_version');
    siteFunctions[tname].isAudioRelease = gmc_optra.get('tra_' + tname + '_isAudioRelease').replace(/\n/, '');
    siteFunctions[tname].hook = gmc_optra.get('tra_' + tname + '_hook').replace(/\n/, '');
    siteFunctions[tname].findArtist = gmc_optra.get('tra_' + tname + '_findArtist').replace(/\n/, '');
    siteFunctions[tname].findAlbum = gmc_optra.get('tra_' + tname + '_findAlbum').replace(/\n/, '');
    siteFunctions[tname].morelink = gmc_optra.get('tra_' + tname + '_morelink');
    siteFunctions[tname].icontype = gmc_optra.get('tra_' + tname + '_icontype');
    siteFunctions[tname].icondata = gmc_optra.get('tra_' + tname + '_icondata');
    siteFunctions[tname].matchUrls = function(url) {
      var pageType = ['search', 'torrent', 'artist'];
      for (var i = 0; i < 3; i++) {
        if (this.urlpatterns[i] == 'null') continue;
        if (new RegExp(this.urlpatterns[i]).test(url)) return pageType[i];
      }
      return false;
    };

    siteFunctions[tname].getLink = function(artist) {
      artist = encodeURIComponent(artist.replace(/\?/g,"%3F")).replace(/%20/g, '+');
      var newImage = makeImage(this.name, this.icontype, this.icondata, iconSize, iconPadding);
      var newLink = makeLink(this.searchurl.replace(artistUrlVariable, artist), newImage);
      for (var i = 0, len = this.urlreplace.length; i < len; i++) {
        if (!/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/.test(this.urlreplace[i])) continue;
        var toMatchPatt = this.urlreplace[i].replace(/^\/(.+)\/(|g|i|gi|ig), ?('|").*\3$/, '$1');
        var toMatchMod = this.urlreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/, '$1');
        var toReplace = this.urlreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|")(.*)\2$/, '$3');
        newLink = newLink.replace(((toMatchMod === '') ? new RegExp(toMatchPatt) : new RegExp(toMatchPatt, toMatchMod)), toReplace);
      }
      return newLink;
    };
    siteFunctions[tname].getTagLink = function(tag, weight) {
      if (!this.tagurl.includes(tagUrlVariable)) return tag;
      var tagMod = tag;
      for (var i = 0, len = this.tagreplace.length; i < len; i++) {
        if (!/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/.test(this.tagreplace[i])) continue;
        var toMatchPatt = this.tagreplace[i].replace(/^\/(.+)\/(|g|i|gi|ig), ?('|").*\3$/, '$1');
        var toMatchMod = this.tagreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/, '$1');
        var toReplace = this.tagreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|")(.*)\2$/, '$3');
        tagMod = tagMod.replace((toMatchMod === '' ? new RegExp(toMatchPatt) : new RegExp(toMatchPatt, toMatchMod)), toReplace);
      }
      if (this.name == 'Shellife') {
        tagMod = tagMod.toLowerCase();
        if (shellifeTags[tagMod] === undefined)
          return tag;
        tagMod = shellifeTags[tagMod];
      }
      return '<a href="' + this.tagurl.replace(tagUrlVariable, tagMod) + (weight !== null ? '" title="' + weight + '%' : '') + '" target="_blank">' + tag + '</a>';
    };
  }

  var externalSites = {};
  for (i = 0, len = externals.length; i < len; i++) {
    var ename = externals[i];
    externalSites[ename] = {};
    externalSites[ename].addlink = (gmc_opsit.get('show_' + ename) === undefined) ? true : gmc_opsit.get('show_' + ename);
    externalSites[ename].name = gmc_opext.get('ext_' + ename + '_name');
    externalSites[ename].label = gmc_opext.get('ext_' + ename + '_label');
    externalSites[ename].searchurl = gmc_opext.get('ext_' + ename + '_searchurl');
    externalSites[ename].lucky = gmc_opext.get('ext_' + ename + '_lucky');
    externalSites[ename].urlreplace = gmc_opext.get('ext_' + ename + '_urlreplace').split('\n');
    externalSites[ename].usealt = gmc_opext.get('ext_' + ename + '_usealt');
    externalSites[ename].alturl = gmc_opext.get('ext_' + ename + '_alturl');
    externalSites[ename].altreplace = gmc_opext.get('ext_' + ename + '_altreplace').split('\n');
    externalSites[ename].description = gmc_opext.get('ext_' + ename + '_description');
    externalSites[ename].icontype = gmc_opext.get('ext_' + ename + '_icontype');
    externalSites[ename].icondata = gmc_opext.get('ext_' + ename + '_icondata');
    externalSites[ename].getLink = function(artist) {
      var thisUrl = this.searchurl, thisUseAlt = this.usealt, toMatchPatt, toMatchMod, toReplace;
      var newLink, newImage = makeImage((showDescriptions ? this.description : this.name), this.icontype, this.icondata, iconSize, iconPadding);
      var latinArtist = removeDiacritics(artist);
      thisUseAlt = (!/[\u00A0-\uFFFF]/.test(latinArtist) && latinArtist !== latinArtist.replace(/[0-9a-zA-Z]/g, '')) ? thisUseAlt : false;
      switch (thisUseAlt) {
        case false:
          var thisLucky = this.lucky;
          thisUrl += (/google\.com\/search\?q=.+&as_q=site%3A.+/.test(thisUrl) && thisLucky) ? '&btnI' : '';
          if (this.name == 'CD Baby') {
            artist = encodeURIComponent(window.btoa(unescape(encodeURIComponent(artist)))).replace(/%2F/g, '!');
          } else {
            artist = encodeURIComponent(artist.replace(/\?/,"%3F")).replace(/%25/, '%');
          }
          newLink = makeLink(thisUrl.replace(artistUrlVariable, artist), newImage);
          for (var i = 0, len = this.urlreplace.length; i < len; i++) {
            if (!/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/.test(this.urlreplace[i])) continue;
            toMatchPatt = this.urlreplace[i].replace(/^\/(.+)\/(|g|i|gi|ig), ?('|").*\3$/, '$1');
            toMatchMod = this.urlreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/, '$1');
            toReplace = this.urlreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|")(.*)\2$/, '$3');
            newLink = newLink.replace((toMatchMod === '') ? new RegExp(toMatchPatt) : new RegExp(toMatchPatt, toMatchMod), toReplace);
          }
          break;
        case true:
          thisUrl = this.alturl;
          for (i = 0, len = this.altreplace.length; i < len; i++) {
            switch (this.altreplace[i].replace(/toBase64.+/, 'toBase64')) {
              case 'removeDiacritics':
                artist = removeDiacritics(artist);
                break;
              case 'toLowerCase':
                artist = artist.toLowerCase();
                break;
              case 'toBase64':
                var lastThree = ['+', '/', '='];
                var b64LastThree = this.altreplace[i];
                b64LastThree = (/toBase64\([^,\)]*(,[^,\)]*){0,2}\)$/.test(b64LastThree)) ? b64LastThree.replace(/toBase64\(/, '').replace(/\)$/, '').split(',') : lastThree;
                while (b64LastThree.length < 3) b64LastThree.push(lastThree[b64LastThree.length]);
                while (b64LastThree.length > 3) b64LastThree.pop();//probably superfluous due to previous regexp test
                artist = window.btoa(unescape(encodeURIComponent(artist)));
                artist = (b64LastThree[0] !== '') ? artist.replace(/\+/g, b64LastThree[0]) : artist;
                artist = (b64LastThree[1] !== '') ? artist.replace(/\//g, b64LastThree[1]) : artist;
                artist = (b64LastThree[2] !== '') ? artist.replace(/=/g, b64LastThree[2]) : artist;
                break;
              case 'qobuzCountries':
                thisUrl = thisUrl.replace(/\/fr-fr\//, '/' + qobuzCountries[gmc_opsit.get('qobuz_country')] + '/');
                break;
              default:
                if (!/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/.test(this.altreplace[i])) continue;
                toMatchPatt = this.altreplace[i].replace(/^\/(.+)\/(|g|i|gi|ig), ?('|").*\3$/, '$1');
                toMatchMod = this.altreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|").*\2$/, '$1');
                toReplace = this.altreplace[i].replace(/^\/.+\/(|g|i|gi|ig), ?('|")(.*)\2$/, '$3');
                artist = artist.replace((toMatchMod === '') ? new RegExp(toMatchPatt) : new RegExp(toMatchPatt, toMatchMod), toReplace);
            }
          }
          newLink = makeLink(thisUrl.replace(artistUrlVariable, artist), newImage);
          break;
        default:
      }
      return newLink;
    };
  }

  var RessourceLoader = {
    ressources: [],
    index: 0,
    callback: "",
    addRessource: function(res, save) {
      save = (save === false) ? false : true;
      this.ressources.push(res);
      window.setTimeout( function () {EventNotifier.send(null, "removeOnTimeout", {ressource: res });}, resourceLoadTimeout, false);
    },
    isRessourceLoading: function(res) {
      for (var i = 0, length = this.ressources.length; i < length; i++){
        if (res.url == this.ressources[i].url) {
          return true;
        }
      }
      return false;
    },
    load: function(callback) {
      this.callback = callback;
      this.loadRessource(this.ressources[this.index++]);
    },
    loadNext: function() {
      if(this.index < this.ressources.length) this.loadRessource(this.ressources[this.index++]);
      else this.callback();
    },
    loadRessource: function(res, res_type) {
      if (!this.isRessourceLoading(res)){
        this.addRessource(res, true);

        if(!GM_getValue("ressource_"+res.url, "")) {
          GM_xmlhttpRequest({
            method: 'GET',
            overrideMimeType: "text/plain;" + ((res_type == TYPE_BINARY)?" charset=x-user-defined":""),
            url: res.url,
            headers: {'Accept-Language': 'en-us,en;q=0.5' },
            onload: function(data) {
              if(res.save) {
                GM_setValue("ressource_"+res.url,  data.responseText );
              }
              RessourceLoader.announceLoad(res, data.responseText );
            }
          });
        } else {
          //console.('Error: ' + res.url + ' is cached?!');

          RessourceLoader.announceLoad(res, GM_getValue("ressource_"+res.url));
        }
      }
      else {
        //console.(res.url + ' is already loading');
      }
    },
    announceLoad: function(res, data) {
      //console.(res.url + ' announcing load');
      //this.ressources = this.ressources.reject( function(o) { return (o.url == res.url); });
      var results = [];
      this.ressources.forEach(
        function(o) {
          if (o.url == res.url) {
            results.push(o);
          }
        });
      this.ressources = results;

      EventNotifier.send(null, "onRessourceLoaded", {ressource: res, content: data  });
      //this.loadNext();
    },
    removeOnTimeout: function (sender, e){
      //this.ressources = this.ressources.reject( function(o) {  return (o.url == e.ressource.url)});
      var results = [];
      this.ressources.forEach(
        function(o) {
          if (o.url == e.ressource.url) {
            results.push(o);
          }
        });
      this.ressources = results;
    }
  };
  EventNotifier.addObserver(RessourceLoader);

  // class Widget
  function Widget(name, res, toggleable){
    this._name = name;
    this._ressource = res;
    this._toggleable = toggleable;
    this._state = UNLOADED;
    this._content = '';
    this._scrapedObject;
    this._currentArtist = '';
    this._contentNode;
    if (toggleable) {
      var togglelink = document.createElement('a');
      if (this.isVisible())
        togglelink.innerHTML = "<img src=\""+toggleMinusImage +"\" border=0>";
      else {
        togglelink.innerHTML = "<img src=\""+togglePlusImage +"\" border=0>";
        this.hide();
      }
      togglelink.href= '#';
      togglelink.id = "toggle"+this._name;
      togglelink.addEventListener("click", function (e) {EventNotifier.send(null, "onToggle", {toggleId: this.id }); e.preventDefault();}, false);
      $("toggle"+this._name).parentNode.replaceChild(togglelink, $("toggle"+this._name));
    }
    EventNotifier.addObserver(this);

    this.load();
  }

  Widget.prototype.getName = function() {
    return this._name;
  };

  Widget.prototype.onToggle =  function(sender, e) {
    if (e.toggleId == "toggle"+this._name ){
      this.toggle();
    }
  };

  Widget.prototype.prepareRessourceUrl = function (artistname) {
    // should be implemented by the Widget
  };

  Widget.prototype.isVisible = function() {
    return (GM_getValue('visible'+this._name+'', 1) == 1);
  };

  Widget.prototype.isEnabled = function() {
    return (GM_getValue('enable'+this._name+'', 1) == 1);
  };

  Widget.prototype.Enable = function() {
    GM_setValue('enable'+this._name+'', 1);
  };

  Widget.prototype.Disable = function() {
    GM_setValue('enable'+this._name+'', 0);
  };

  Widget.prototype.toggle = function() {
    if (this.isVisible()){
      this.hide();
      $("toggle"+this._name).innerHTML = "<img src=\""+togglePlusImage +"\" border=0>";
    } else {
      this.show();
      $("toggle"+this._name).innerHTML = "<img src=\""+toggleMinusImage +"\" border=0>";
    }
  };

  Widget.prototype.hide = function (){
    $(this._name).style.display = 'none';
    GM_setValue('visible'+this._name+'', 0);
  };

  Widget.prototype.show = function (){
    $(this._name).style.display = 'block';
    GM_setValue('visible'+this._name+'', 1);
    this.render();
  };

  Widget.prototype.load = function (){
    this._state = LOADING;
    // implement data request here
  };

  Widget.prototype.onArtistChange = function(sender, e) {
    if(sender != this._name && this._currentArtist != e.artistname) {
      this._state = LOADING;
      this.render();
      this._currentArtist = e.artistname;
      var cachedContent;
      if (this._ressource !== null) {
        var tempRessource = {key: this._ressource.key, url: this._ressource.url, save: this._ressource.save, artistname: e.artistname};
        tempRessource.url = this.prepareRessourceUrl(e.artistname);
        //cachedContent = cache.getItem("cache_widget_" + this._name + "_" + this._currentArtist);
        cachedContent = null;
        if (cachedContent === null){
          //console.(this._name + " contentUnCached for " + this._currentArtist);
          RessourceLoader.loadRessource(tempRessource);
        }
        else {
          //console.(this._name + " contentCached for " + this._currentArtist);
          this._state = CACHED;
          this._scrapedObject = cachedContent;
          this.createNodeFromScrapedContent();
          this.render();
        }
      }
      else {
        this._state = LOADED;
        this._scrapedObject = cachedContent;
        this.createNodeFromScrapedContent();
        this.render();
      }
    }
  };

  Widget.prototype.onRessourceLoaded = function (sender, e){
    if (this._ressource !== null && this._ressource.key == e.ressource.key && this._currentArtist == e.ressource.artistname) {
      //alert(this._name + " contentLoaded for " + this._currentArtist);
      this._state = LOADED;
      this._content = e.content;
      this._scrapedObject = this.scraperImpl();
      //cache.setItem("cache_widget_" + this._name + "_" + this._currentArtist, this._scrapedObject);
      this.createNodeFromScrapedContent();
      this.render();
    }
  };

  Widget.prototype.render = function (){
    if (this._state == CACHED || this._state == LOADED) {
      if ($(this._name).hasChildNodes()){
        //console.(this._name  + 'has Child node, state' + this._state);
        $(this._name).replaceChild(this._contentNode, $(this._name).firstChild);
      }
      else $(this._name).appendChild(this._contentNode);
    }
    if (this._state == LOADING) {
      $(this._name).innerHTML = "<img src=\""+ spinnerImage +"\" border=0>";
    }
    if (this._state == FAILED) {
      $(this._name).innerHTML = "n/a";
    }
  };

  Widget.prototype.createNodeFromScrapedContent = function (){
    var node = document.createElement("div");
    node.innerHTML = this._scrapedObject;
    this._contentNode = node;
  };

  // end of class Widget

  function a(artist){
    EventNotifier.send("global", "onArtistChange", {artistname: artist, albumname: null });
  }

  function addWidgets(artist){

    // +------------------------------------------------------------------------------+
    // |                        Widget for OiNKPlus container                         |
    // +------------------------------------------------------------------------------+
    OiNKPlusRessource = null;
    wOiNKPlus = new Widget("OiNKPlus", OiNKPlusRessource, TOGGLEABLE );
    wOiNKPlus.createNodeFromScrapedContent = function () {
      var tagIcon = 'data:image/' + gmc_opadv.get('oinkplus_tag_icontype') + ';base64,' + gmc_opadv.get('oinkplus_tag_icondata');
      tempContent = gmc_opadv.get('oinkplus_basic_layout').replace(/%TAGICON%/, tagIcon);
      var node = document.createElement("div");
      node.innerHTML = tempContent;
      this._contentNode = node;
    };
    wOiNKPlus.onArtistChange = function () {
      // overwritten to do nothing
    };
    wOiNKPlus.createNodeFromScrapedContent();
    wOiNKPlus._state = LOADED;
    wOiNKPlus.render();
    // +------------------------------------------------------------------------------+
    // |                      end Widget for OiNKPlus container                       |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                            Widget for Artist Name                            |
    // +------------------------------------------------------------------------------+
    ArtistNameRessource = null;
    wArtistName = new Widget("ArtistName", ArtistNameRessource, NON_TOGGLEABLE );
    wArtistName.createNodeFromScrapedContent = function () {
      var myLink = document.createElement('a');
      myLink.innerHTML = this._currentArtist;
      myLink.id = this._currentArtist;
      myLink.href = '#';
      myLink.addEventListener("click", function (e) {EventNotifier.send("LastFMSimilar", "onArtistChange", {artistname: this.id, albumname: null  }); e.preventDefault();} , false);
      this._contentNode = myLink;
    };
    wArtistName.onArtistChange = function (sender, e) {
      if(sender == "global") {
        this._currentArtist = e.artistname;
        this.createNodeFromScrapedContent();
        this._state = LOADED;
        this.render();
      }
    };
    wArtistName._currentArtist = artist;
    wArtistName.createNodeFromScrapedContent();
    wArtistName._state = LOADED;
    wArtistName.render();
    // +------------------------------------------------------------------------------+
    // |                          end Widget for Artist Name                          |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                    Widget for Artist Title and More Link                     |
    // +------------------------------------------------------------------------------+
    ArtistTitleRessource = null;
    wArtistTitle =  new Widget("ArtistTitle", ArtistTitleRessource, NON_TOGGLEABLE );
    wArtistTitle.createNodeFromScrapedContent = function () {
      // TODO encodeURIComponent
      //var tempContent = '<h1>' + this._currentArtist + '</h1>';
      artistHeadline = document.createElement("h2");
      artistHeadline.className = "artistHeadline";
      var myArtistLink = document.createElement('a');
      myArtistLink.innerHTML = this._currentArtist + " ";
      myArtistLink.href = MORE_LINK.replace(artistUrlVariable, this._currentArtist.replace(/&/g, '%26'));
      //myArtistLink.href = MORE_LINK[0] + this._currentArtist.replace(/&/g, '%26') + MORE_LINK[1];
      artistHeadline.appendChild(myArtistLink);
      if (ARTIST_ALT) {
        var altLink = document.createElement('a');
        altLink.innerHTML = '<font size=-2>[' + ARTIST_ALT + ']</font>';
        altLink.id = ARTIST_ALT;
        altLink.href = '#';
        altLink.className = "explore";
        altLink.addEventListener("click", function (e) {EventNotifier.send("global", "onArtistChange", {artistname: ARTIST_ALT, albumname: null  }); e.preventDefault();} , false);
        artistHeadline.appendChild(altLink);
      }
      var myLink = document.createElement('a');
      myLink.innerHTML = "<font size=-2>[load similar]</font>";
      myLink.id = this._currentArtist;
      myLink.href = '#';
      myLink.className = "explore";
      myLink.addEventListener("click", function (e) {EventNotifier.send("global", "onArtistChange", {artistname: this.id, albumname: null  }); e.preventDefault();} , false);
      artistHeadline.appendChild(myLink);

      var node = document.createElement("div");
      node.appendChild(artistHeadline);
      this._contentNode = node;
    };
    // +------------------------------------------------------------------------------+
    // |                  end Widget for Artist Title and More Link                   |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                        Widget for artist search field                        |
    // +------------------------------------------------------------------------------+
    ArtistSearchFieldRessource = null;
    wArtistSearchField =  new Widget("ArtistSearchField", ArtistSearchFieldRessource, NON_TOGGLEABLE);
    wArtistSearchField.createNodeFromScrapedContent = function () {
      logmsg('artist search field widget');
      var node = document.createElement("div");
      node.style.textAlign = "right";
      if (GM_config.get('add_settings')) {
        var optionsLink = document.createElement('a');
        optionsLink.innerHTML = '' + makeImage('OiNKPlus Settings', oinkplusImageType, oinkplusImageData, iconSize, 0) + '<br><br>';
        optionsLink.id = 'OiNKPlus_Options';
        optionsLink.href = '#';
        optionsLink.className = "options";
        optionsLink.addEventListener("click", function (e) { GM_config.open(); e.preventDefault();} , false);
        node.appendChild(optionsLink);
      }
      var searchField = document.createElement("input");
      searchField.value = 'search for artist';
      var baseStyle = 'background:#FFFFFF url('+searchImage+') no-repeat scroll left center; border:1px solid #7E1325; font-size:11px;padding:1px 4px 2px 16px;width:150px;';
      searchField.setAttribute('style', baseStyle + 'color:grey');
      searchField.addEventListener("click", function (e) { if (this.value == 'search for artist') {this.value = ''; searchField.setAttribute('style',baseStyle);}}, false);
      searchField.addEventListener("keypress", function (e) { if (e.keyCode == 13) EventNotifier.send("global", "onArtistChange", {artistname: this.value.replace(/^\s+|\s+$/g,""), albumname: null  });}, false);
      node.appendChild(searchField);
      this._contentNode = node;

    };
    wArtistSearchField.onArtistChange(null, {artistname: null, albumname: null  });
    // +------------------------------------------------------------------------------+
    // |                      end Widget for artist search field                      |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                       Widget for Last.fm Artist Image                        |
    // +------------------------------------------------------------------------------+
    LFMArtistInfoRessource = {key: "LastFMArtistInfo", url: lastfmInfoUrl, save: false};

    LFMArtistPageRessource = {key: "LastFMArtistPage", url: lastfmArtistUrl, save: false};
    wLFMArtistImage = new Widget("ArtistImage", LFMArtistInfoRessource, NON_TOGGLEABLE);
    wLFMArtistImage.prepareRessourceUrl = function (artistname) {
      return this._ressource.url.replace(artistUrlVariable, artistname.replace(/&/g, '%26').replace(/\//g, '%2F').replace(/\?/,"%3F"));
    };
    wLFMArtistImage.scraperImpl = function () {
      var image = '<img src="' + buildDataScheme(this._content, 'data:image/jpeg;base64,') + '" border=1>';
      if (GM_config.get('link_artist_image')) {
        var link = lastfmGalleryUrl.replace(artistUrlVariable, this._currentArtist);
        image = image.replace('<img src="', '<img title="Click to open Artist gallery on Last.fm" src="');
        image = makeLink(link, image);
      }
      return image;
    };
    wLFMArtistImage.onRessourceLoaded = function (sender, e){
      if (this._ressource !== null && e.ressource.key == 'LastFMArtistInfo' && this._currentArtist == e.ressource.artistname) {
        //var imgUrl = e.content.extract("<div class=\"imgHolder\">","</div>").replace(/.*src=\"(.*)\" alt=.*/,'$1');
        var parser = new DOMParser();
        result = parser.parseFromString(e.content, "application/xml");
        var entries = result.getElementsByTagName('image');
        var arr = [];
        for (var i = 0, len = entries.length; i < len; i++)
          if (entries[i].getAttribute("size") == "large" ) {
            arr.push(entries[i].textContent);
          }
        var imgUrl = arr[0];
        logmsg('imgUrl: ' + imgUrl);
        // Subsequent Ressource
        if (imgUrl.search(/^http/) >= 0) {
          LFMArtistImageRessource = {key: "LastFMArtistImage", url: imgUrl, save: false, artistname: e.ressource.artistname};
          RessourceLoader.loadRessource(LFMArtistImageRessource, TYPE_BINARY);
        } else {
          this._state = FAILED;
          this.render();
        }
      }
      if (this._ressource !== null &&  e.ressource.key == 'LastFMArtistImage' && this._currentArtist == e.ressource.artistname) {
        this._state = LOADED;
        this._content = e.content;
        this._scrapedObject = this.scraperImpl();
        //cache.setItem("cache_widget_" + this._name + "_" + this._currentArtist, this._scrapedObject);
        this.createNodeFromScrapedContent();
        this.render();
      }

    };
    // +------------------------------------------------------------------------------+
    // |                     end Widget for Last.fm Artist Image                      |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                         Widget for Last.fm Abstracts                         |
    // +------------------------------------------------------------------------------+
    wLFMBio =  new Widget("LastFMBio", LFMArtistInfoRessource, TOGGLEABLE);
    wLFMBio.prepareRessourceUrl = function (artistname) {
      return this._ressource.url.replace(artistUrlVariable, artistname.replace(/&/g, '%26').replace(/\//g, '%2F').replace(/\?/,"%3F"));
    };
    wLFMBio.scraperImpl = function () {
      var parser = new DOMParser();
      result = parser.parseFromString(this._content, "application/xml");
      var entries = result.getElementsByTagName('summary');
      var arr = [];
      for (var i = 0, len = entries.length; i < len; i++)
        arr.push(entries[i].textContent);
      var summary = arr[0];
      cleanedBio = basicClean(summary);
      return cleanedBio;
    };
    wLFMBio.createNodeFromScrapedContent = function (){
      logmsg('Last.fm Abstracts widget');
      var node = document.createElement("div");
      node.innerHTML = this._scrapedObject;
      encodedArtistName = this._currentArtist.replace(/&/g, '%252526').replace(/\//g, '%25252F').replace(/\?/,"%25253F");
      textContent = node.textContent;
      var maxBioLen = GM_config.get('max_bio_len');
      if (textContent.length > maxBioLen){
        logmsg('\tBio longer than maximum length\n\tmaxBioLen: ' + maxBioLen + '\n\tBio length: ' + textContent.length);
        textContent = textContent.replace(/\(read more\)/, "");
        sentences = textContent.split(".");
        var out = "";
        logmsg('\tGot ' + sentences.length + ' sentences.');
        for (var i = 0, olen = out.length, slen = sentences.length; olen < maxBioLen && i < slen; i++){
          out += sentences[i] + ".";
        }
        //textContent = out + new String(" (read more)");
        textContent = out;
      }
      //textContent = textContent.replace(/read more/, lastfmBioLink.replace(artistUrlVariable, encodedArtistName));
      node.innerHTML = textContent;
      if (textContent.length > maxBioLen) {
        var readmorelink = document.createElement('a');
        readmorelink.innerHTML = "read more";
        readmorelink.href= '#';
        readmorelink.id = this._currentArtist;
        readmorelink.addEventListener("click", function (e) { EventNotifier.send("LastFMBio", "onReadMore", {artistname: this.id, albumname: null  }); e.preventDefault();}, false);
        node.appendChild(document.createTextNode(" ("));
        node.appendChild(readmorelink);
        node.appendChild(document.createTextNode(")"));
        node.appendChild(document.createElement("br"));
      }
      this._contentNode = node;
    };
    wLFMBio.scraperImplBio = function () {
      var parser = new DOMParser();
      result = parser.parseFromString(this._content, "application/xml");
      var entries = result.getElementsByTagName('content');
      var arr = [];
      for (var i = 0, len = entries.length; i < len; i++)
        arr.push(entries[i].textContent);

      var bio = arr[0];
      cleanedBio = basicClean(bio);
      return cleanedBio;
    };

    wLFMBio.onRessourceLoaded = function (sender, e){
      if (this._ressource !== null && this._ressource.key == e.ressource.key && this._currentArtist == e.ressource.artistname) {
        this._state = LOADED;
        this._content = e.content;
        this._scrapedObject = this.scraperImpl();
        this.createNodeFromScrapedContent();
        this.render();
      }
      if (this._ressource !== null && e.ressource.key == "LastFMArtistBio" ) {

      }
    };
    wLFMBio.onReadMore =  function (sender, e){
      this._state = LOADED;
      this._scrapedObject = this.scraperImplBio();
      //this.createNodeFromScrapedContent();
      var node = document.createElement("div");
      node.innerHTML = this._scrapedObject.replace(/<br \/>/g, "%%br%%");
      logmsg('\tnode.textContent:\n' + node.textContent);
      textContent = node.textContent;
      node.innerHTML = textContent.replace(/%%br%%/g, "<br />");
      this._contentNode = node;
      this.render();
    };
    // +------------------------------------------------------------------------------+
    // |                       end Widget for Last.fm Abstracts                       |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                           Widget for Last.fm Tags                            |
    // +------------------------------------------------------------------------------+
    LFMTagsWebserviceRessource = {key: "LastFMTagsWebservice", url: lastfmTagsUrl, save: false};
    wLFMTags =  new Widget("LastFMTags", LFMTagsWebserviceRessource, NON_TOGGLEABLE);
    wLFMTags.prepareRessourceUrl = function (artistname) {
      return this._ressource.url.replace(artistUrlVariable, artistname.replace(/&/g, '%26').replace(/\//g, '%252F').replace(/\?/,"%3F"));
    };
    wLFMTags.scraperImpl = function () {
      var parser = new DOMParser();
      result = parser.parseFromString(this._content, "application/xml");
      var entries = result.getElementsByTagName('tag');
      var arr = [];
      var tag, tagWeight;
      var maxTags = GM_config.get('max_tags');
      var minTags = GM_config.get('min_tags');
      var minThresh = GM_config.get('min_tag_thresh');
      var titleTags = GM_config.get('title_tags');
      var uselessTags = GM_config.get('useless_tags').toLowerCase().replace(/[ \-\.]/g, '').split(',');
      var hideUselessTags = GM_config.get('hide_useless_tags');
      var hiddenTags = 0;
      for (var i = 0, len = entries.length; i - hiddenTags < maxTags && i < len; i++) {
        tag = entries[i].getElementsByTagName('name')[0].textContent;
        tagWeight = parseInt(entries[i].getElementsByTagName('count')[0].textContent);
        if (hideUselessTags && uselessTags.indexOf(tag.replace(/[ \-\.]/g, '').toLowerCase()) > -1) {
          hiddenTags++;
          continue;
        }
        if (tagWeight < minThresh && i - hiddenTags >= minTags) break;
        if (GM_config.get('link_tags'))
          tag = mySITE.getTagLink(tag, (titleTags ? tagWeight : null));
        else tag = titleTags ? '<abbr title="' + tagWeight + '%">' + tag + '</abbr>' : tag;
        arr.push(tag);
      }
      var text = arr.join(', ') + '';
      return text;
    };
    // +------------------------------------------------------------------------------+
    // |                         end Widget for Last.fm Tags                          |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                      Widget for Last.fm Similar Artists                      |
    // +------------------------------------------------------------------------------+
    LFMSimilarWebserviceRessource = {key: "LastFMSimilarWebservice", url: lastfmSimilarUrl, save: false};
    wLFMSimilar =  new Widget("LastFMSimilar", LFMSimilarWebserviceRessource, TOGGLEABLE);
    wLFMSimilar.prepareRessourceUrl = function (artistname) {
      return this._ressource.url.replace(artistUrlVariable, artistname.replace(/&/g, '%26').replace(/\//g, '%2F').replace(/\?/,"%3F"));
    };
    wLFMSimilar.scraperImpl = function () {
      var parser = new DOMParser();
      result = parser.parseFromString(this._content, "application/xml");
      var entries = result.getElementsByTagName('artist');
      var arr = [];
      var thingToPush, iName, iMatch, artistList;
      if (highlightArtists) artistList = gmc_opart.get('artist_list').toLowerCase().split('\n');
      for (var i = 0, len = entries.length; i < maxSimArtists && i < len; i++) {
        iName = entries[i].getElementsByTagName('name')[0].textContent;
        thingToPush = {artistName: iName};
        if (simArtistsColor) {
          iMatch = parseFloat(entries[i].getElementsByTagName('match')[0].textContent);
          thingToPush.similarMatch = iMatch;
        }
        if (thingToPush.similarMatch * 100 < minArtistThresh && i > minSimArtists) return arr;
        if (highlightArtists && artistList.length > 0) thingToPush.artistNotified = (artistList.indexOf(iName.toLowerCase()) >= 0);
        arr.push(thingToPush);
      }
      return arr;
    };
    wLFMSimilar.createNodeFromScrapedContent = function () {
      var node = document.createElement("div");
      var hueCurve, satCurve, valCurve, minHue, maxHue, hueDirPos, hueRange, minSat, maxSat, satRange, minVal, maxVal, valRange, valMod, modVals;
      if (simArtistsColor) {
        /*hueCurve = gmc_opcol.get('sim_artists_hue_curve');
        satCurve = gmc_opcol.get('sim_artists_sat_curve');
        valCurve = gmc_opcol.get('sim_artists_val_curve');*/
        minHue = gmc_opcol.get('sim_artists_least_hue') / 360 % 1;
        maxHue = gmc_opcol.get('sim_artists_most_hue') / 360 % 1;
        hueDirPos = (gmc_opcol.get('sim_artists_hue_dir') == 'Positive') ? true : false;
        hueRange = maxHue - minHue;
        hueRange = (hueDirPos && maxHue < minHue) ? hueRange + 1: hueRange;
        hueRange = (!hueDirPos && maxHue > minHue) ? hueRange - 1: hueRange;
        minSat = gmc_opcol.get('sim_artists_least_sat') / 100;
        maxSat = gmc_opcol.get('sim_artists_most_sat') / 100;
        satRange = maxSat - minSat;
        minVal = gmc_opcol.get('sim_artists_least_val') / 100;
        maxVal = gmc_opcol.get('sim_artists_most_val') / 100;
        valRange = maxVal - minVal;
        valMod = gmc_opcol.get('col_sim_artists_valmod');
        modVals = (~gmc_opcol.get('col_sim_artists_sites').split('\n').indexOf(mySITE.label));
      }
      var simArtB, simArtI, simArtU, simArtA, simArtImg;
      if (highlightArtists) {
        simArtB = gmc_opart.get('sim_artists_b');
        simArtI = gmc_opart.get('sim_artists_i');
        simArtU = gmc_opart.get('sim_artists_u');
        simArtA = gmc_opart.get('sim_artists_img');
        simArtImg = makeImage('', gmc_opadv.get('oinkplus_similar_icontype'), gmc_opadv.get('oinkplus_similar_icondata'), gmc_opart.get('sim_artists_imgsize'), 0).replace(' title=""', '');
      }
      for (var i = 0, len = this._scrapedObject.length; i < len; i++) {
        var artistname = this._scrapedObject[i].artistName;
        var artistlink = document.createElement('a');
        var artistHTML = artistname;
        if (this._scrapedObject[i].similarMatch) {
          var similarity = parseFloat(this._scrapedObject[i].similarMatch);
          //var simArtHue = (minHue + hueRange * curveSimilarity(similarity, hueCurve)) % 1;
          var simArtHue = (minHue + hueRange * similarity) % 1;
          simArtHue = (simArtHue < 0) ? 1 + simArtHue : simArtHue;
          //var simArtSat = minSat + satRange * curveSimilarity(similarity, satCurve);
          //var simArtVal = minVal + valRange * curveSimilarity(similarity, valCurve);
          var simArtSat = minSat + satRange * similarity;
          var simArtVal = minVal + valRange * similarity;
          simArtVal = (modVals) ? simArtVal * valMod : simArtVal;
          var simArtRGB = HSVtoRGB(simArtHue, simArtSat, simArtVal);
          var percentMatch = ((this._scrapedObject[i].similarMatch * 100) - (this._scrapedObject[i].similarMatch * 100 % 1)) + "% similar";
          artistHTML = '<font color="' + simArtRGB + '" title="' + percentMatch + '">' + artistHTML + '</font>';
        }
        if (highlightArtists && this._scrapedObject[i].artistNotified) {
          artistHTML = (simArtB) ? '<b>' + artistHTML + '</b>' : artistHTML;
          artistHTML = (simArtI) ? '<i>' + artistHTML + '</i>' : artistHTML;
          artistHTML = (simArtU) ? '<u>' + artistHTML + '</u>' : artistHTML;
          artistHTML = (simArtA) ? artistHTML + ' ' + simArtImg : artistHTML;
        }
        artistlink.innerHTML = artistHTML;
        artistlink.id = artistname;
        artistlink.href = mySITE.getLink(artistname).replace(/^<a href="(.+)" target=.+$/, '$1');
        artistlink.addEventListener("click", function (e) {
          e.preventDefault();
          if (e.shiftKey || e.which == 2)
            GM_openInTab(mySITE.getLink(this.id).replace(/^<a href="(.+)" target=.+$/, '$1'), true);
          else
            EventNotifier.send("LastFMSimilar", "onArtistChange", {artistname: this.id, albumname: null  });
        }, false);
        node.appendChild(artistlink);
        node.appendChild(document.createElement("br"));
      }
      this._contentNode = node;
    };
    // +------------------------------------------------------------------------------+
    // |                    end Widget for Last.fm Similar Artists                    |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                         Widget for Browsing History                          |
    // +------------------------------------------------------------------------------+
    BrowsingHistoryRessource = null;
    wBrowsingHistory =  new Widget("History", BrowsingHistoryRessource, TOGGLEABLE);
    wBrowsingHistory.onArtistChange = function(sender, e) {
      if(sender == "global") {
        this._currentArtist = e.artistname;
        this._state = LOADED;
        this.createNodeFromScrapedContent();
        this.render();
      }
    };
    wBrowsingHistory.createNodeFromScrapedContent = function () {
      // init
      logmsg('Browsing History widget');
      if(this._scrapedObject == null) {
        logmsg('\tScraped Object null');
        this._scrapedObject = [];
      }
      logmsg('\tGot artist: ' + this._currentArtist);
      var found = false;
      this._scrapedObject.forEach(function (o) { if (o == this._currentArtist) {found = true;}}, this);
      if (!found)
        this._scrapedObject.push(this._currentArtist);
      var node = document.createElement("div");
      for (var i = 0, len = this._scrapedObject.length; i < len; i++) {
        var artistname = this._scrapedObject[i];
        var artistlink = document.createElement('a');
        artistlink.innerHTML = artistname;
        artistlink.href= '#';
        artistlink.id = artistname;
        artistlink.addEventListener("click", function (e) { EventNotifier.send("global", "onArtistChange", {artistname: this.id, albumname: null  }); e.preventDefault();}, false);
        node.appendChild(artistlink);
        node.appendChild(document.createElement("br"));
      }
      this._contentNode = node;
      this._cachedContent = this._scrapedObject;
    };
    // +------------------------------------------------------------------------------+
    // |                       end Widget for Browsing History                        |
    // +------------------------------------------------------------------------------+

    // +------------------------------------------------------------------------------+
    // |                          Widget for External Links                           |
    // +------------------------------------------------------------------------------+
    ExternalLinksRessource = null;
    wExternalLinks =  new Widget("ExternalLinks", ExternalLinksRessource, NON_TOGGLEABLE);
    wExternalLinks.prepareRessourceUrl = function (artistname) {
      // nothing to do
    };
    wExternalLinks.createNodeFromScrapedContent = function () {
      logmsg('\tExternal Links widget');
      var arr = [];
      var artist = this._currentArtist;
      var groups = (gmc_opsit.get('add_favorites') && gmc_opsit.get('favorites_order') !== '') ? ['Favorites']: [];
      var groupsToAdd = gmc_opsit.get('group_order').split('\n');
      for (var i = 0, len = groupsToAdd.length; i < len; i++)
        groups.push(groupsToAdd[i]);
      var groupSites = [];
      var firstGroup = true;
      for (i = 0, len = groups.length; i < len; i++) {
        if (groups[i] === '') continue;
        try {
          groupSites = gmc_opsit.get(groups[i].toString().replace(/ /g, '_').toLowerCase() + '_order').split('\n');
        }
        catch (e) {
          continue;
        }
        if (groupSites === '') continue;
        if (groups[0] == 'Favorites' && groupsToAdd == []) {
          //do nothing ^ this isn't working i don't think...
        } else {
          arr.push((firstGroup ? '' : '<br>'.repeat(parseInt(groupPadding) + 1)) + '<b>' + groups[i] + ':</b><br>');
        }
        for (var j in groupSites) {
          if (!groupSites.hasOwnProperty(j)) continue;
          if (externalSites[groupSites[j]] === undefined) continue;
          if (externalSites[groupSites[j]].addlink === false) continue;
          arr.push(externalSites[groupSites[j]].getLink(artist));
        }
        firstGroup = false;
      }
      var node = document.createElement("div");
      node.innerHTML = arr.join('') + '';
      this._contentNode = node;
    };
    // +------------------------------------------------------------------------------+
    // |                        end Widget for External Links                         |
    // +------------------------------------------------------------------------------+

    // +----------------------------------------------------------------------------+
    // |                           Widget for Hydra Links                           |
    // +----------------------------------------------------------------------------+
    HydraLinksRessource = null;
    wHydraLinks = new Widget("HydraLinks", HydraLinksRessource, NON_TOGGLEABLE);
    wHydraLinks.prepareRessourceUrl = function (artistname) {
      // nothing to do
    };
    wHydraLinks.createNodeFromScrapedContent = function () {
      var arr = [];
      var artist = this._currentArtist;
      var trackerList = gmc_opsit.get('tracker_order').replace(/[^\w\n]/g, '').split('\n');
      if (trackerList !== '') arr.push('<b>Trackers:</b><br>');
      for (var i = 0, len = trackerList.length; i < len; i++){
        if (siteFunctions[trackerList[i]] === undefined) continue;
        if (gmc_opsit.get('show_' + trackerList[i]) === false) continue;
        if (siteFunctions[trackerList[i]].searchurl !== null) {
          arr.push(siteFunctions[trackerList[i]].getLink(artist));
        }
      }
      var node = document.createElement("div");
      node.innerHTML = arr.join('') + '';
      this._contentNode = node;
    };
    // +------------------------------------------------------------------------------+
    // |                          end Widget for Hydra Links                          |
    // +------------------------------------------------------------------------------+

  } //end Widgets

  // +------------------------------------------------------------------------------+
  // |                               helper functions                               |
  // +------------------------------------------------------------------------------+
  function $() {
    var elements = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
      var element = arguments[i];
      if (typeof element == 'string')
        element = document.getElementById(element);
      if (arguments.length == 1)
        return element;
      elements.push(element);
    }
    return elements;
  }

  function basicClean(myString) {

    do {
      oldstring = myString;
      //var regexp0 = new RegExp("<(object)[^>]*>.*<\/(object)>","i");
      var regexp0 = new RegExp("<script[^>]*>[^<]*<\/script>","gi");
      var regexp1 = new RegExp("<span class=\"wiki_continued\".*","i");
      var regexp2 = new RegExp("<object[^>]*>.*<\/object>","i");
      //var regexp1 = new RegExp("<(span).*?<\/(span)>","i");
      //regexp2 = new RegExp('<script.*?.*?</script>',"gi");
      //myString = myString.replace(regexp0,"");
      myString = myString.replace(regexp0,"");
      myString = myString.replace(regexp1,"");
      //myString = myString.replace(regexp1,"");
      myString = myString.replace(regexp2,"");
    } while (oldstring != myString);
    return myString;
  }

  function translateToBinaryString(text){
    var out = '';
    for (var i = 0, len = text.length ; i < len ; i++){
      //*bugfix* by Marcus Granado 2006 [http://mgran.blogspot.com] adapted by Thomas Belot
      out += String.fromCharCode(text.charCodeAt(i) & 0xff);
    }
    return out;
  }

  function buildDataScheme(responseText, dataScheme){
    //translating the text to a valid binary stream
    var stream = translateToBinaryString(responseText);
    //translating the binaryStream to Base64
    dataScheme += window.btoa(stream);
    return dataScheme;
  }

  // aaBBBcccDDDee.extract('BB','DD') returns BBBcccDD
  String.prototype.extract = function(startString, endString){
    var start = this.indexOf(startString);
    if (start == -1) {
      return '';
    }
    var choppedContent = this.substr(start);
    var end = choppedContent.indexOf(endString, startString.length);
    if (end == -1) {
      return '';
    }
    var extractedContent = choppedContent.substring(0, end+endString.length);
    if (extractedContent.length > 0) return extractedContent;
    else return '';
  };

  // aaBBBcccDDDee.extractInner('BB','DD') returns Bccc
  String.prototype.extractInner = function(startString, endString){
    var outerContent = this.extract(startString, endString);
    if (outerContent !== '')
      return outerContent.substring(startString.length, outerContent.length-endString.length);
    return '';
  };

  // Platypus functions and other html modification functions

  function modify_single_url(doc, match_re, replace_string, node) {
    if (node.href)
      node.href = node.href.replace(match_re, replace_string);
  }

  function do_modify_url_it(doc, node, match_re, replace_string, global_flag) {
    match_re = new RegExp(match_re);
    if (global_flag) {
      var allurls = doc.getElementsByTagName('A');
      for (var i = 0, url, len = allurls.length; i < len; i++) {
        url = allurls[i];
        modify_single_url(doc, match_re, replace_string, url);
      }
    } else modify_single_url(doc, match_re, replace_string, node);
  }

  function insertAfter(newNode, target) {
    var parent = target.parentNode;
    var refChild = target.nextSibling;
    if(refChild !== null)
      parent.insertBefore(newNode, refChild);
    else parent.appendChild(newNode);
  }

  function find_table(){
    var tds = document.getElementsByTagName("td");
    for (var i = 0, len = tds.length; i < len; i++)
      if (tds[i].className == "rowhead")
        return tds[i].parentNode.parentNode;
  }

  function find_it(doc, node, match_re, replace_string) {
    match_re = new RegExp(match_re);
    if (node !== null)
      return node.innerHTML.replace(match_re, replace_string);
    else return null;
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head)
      return;
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  var DEBUG = gmc_opadv.get('oinkplus_debug');
  function logmsg(message) {
    if (DEBUG) {
      console.log(message);
    }
  }

  // +------------------------------------------------------------------------------+
  // |                             end helper functions                             |
  // +------------------------------------------------------------------------------+

  // +------------------------------------------------------------------------------+
  // |                              Find Matching Site                              |
  // +------------------------------------------------------------------------------+
  function findMatchingSite(){
    logmsg('Find Matching Site function');
    SITES = siteFunctions;
    var truncParenths = GM_config.get('truncate_parenths');
    var addAltLink = GM_config.get('add_alt_link');
    var pageType;
    Finish: for (var sitename in SITES){
      if (!SITES.hasOwnProperty(sitename)) continue;
      logmsg('\tsitename: ' + sitename);
      mySITE = SITES[sitename];
      var found = false;
      pageType = mySITE.matchUrls(location.href);
      if (pageType) {
        logmsg('\tMatched mySITE.name: ' + mySITE.name);
        if (mySITE.addtosite === false) {
          logmsg('\tSite "' + sitename + '" is disabled in settings.');
          break Finish;
        }
        if (pageType == 'search') {
          logmsg('\tSite "' + sitename + '" search pages are not supported yet.');
          break Finish;
        }
        find_artist_name = new Function(mySITE.findArtist);
        logmsg('\tfunction find_artist_name: ' + find_artist_name());
        MORE_LINK = mySITE.morelink;
        logmsg("\tfunction MORE_LINK: " + MORE_LINK);
        hook = new Function(mySITE.hook);
        isAudioRelease = new Function(mySITE.isAudioRelease);
        if (isAudioRelease()) {
          logmsg('\tThis is an Audio release.');
          hook();
          logmsg('\tHook installed.');
          addGlobalStyle(gmc_opadv.get('oinkplus_css_code'));
          addGlobalStyle(mySITE.css);
          artist = find_artist_name();
          artist = (artist !== null) ? artist.replace(/&amp;/,"&") : artist;
          if (truncParenths && /.+ \(.+\)$/.test(artist)) {
            var artistA = removeParentheses(artist);
            artist = artistA[0];
            ARTIST_ALT = (addAltLink) ? artistA[1] : null;
          } else ARTIST_ALT = null;
          if (artist === null || artist.toLowerCase().indexOf('various') > -1 || artist.match(new RegExp("^VA.*"))) {
            logmsg('\tNo artist to process.');
            artist = null;
            addWidgets(artist);
            // TODO
            $("ArtistTitle").innerHTML = "<b>Sorry, the artist name could not be parsed.<br>However, you can still use the search box to the right.</b>";
            return;
          }
          addWidgets(artist);
          a(artist);
          break Finish;
        }
        else logmsg('\tThis is not an audio release.');
        found = true;
        break Finish;
      }
      if (!found) logmsg('\tNo match for mySITE.name: ' + mySITE.name);
    }
  }
  // +------------------------------------------------------------------------------+
  // |                            end Find Matching Site                            |
  // +------------------------------------------------------------------------------+

  function do_it_baby() { findMatchingSite(); }

  if (/https?:\/\/(www.)?indietorrents\.com\/torrents\.php\?searchstr=.+/.test(window.location.href)) decodeIndietorrentsSearch();

  do_it_baby();

}// main

function makeLink(aLink, anImage) {
  return '<a href="' + aLink + '" target="_blank">' + anImage + '</a>';
}

function makeImage(title, type, data, size, padding) {
  return '<img title="' + title + '" src="data:image/' + type + ';base64,' + data + '" style="width: ' + size + 'px; height: ' + size + 'px; border-width: 0px; padding: ' +
    (padding + 'px ').repeat(4).trim() + ';">';
}

function removeParentheses(artistName) {
  var artistL = artistName.split(' (')[0];
  var artistR = artistName.split(' (')[1].replace(/\)$/, '');
  var artistLSum = 0;
  var artistRSum = 0;
  for (var i = 0, len = artistL.length; i < len; i++) {
    artistLSum += artistL.charCodeAt(i);
  }
  for (i = 0, len = artistR.length; i < len; i++) {
    artistRSum += artistR.charCodeAt(i);
  }
  var artistLAvg = artistLSum / (artistL.length);
  var artistRAvg = artistRSum / (artistR.length);
  if (artistLAvg < 256 && artistRAvg > 256) {
    return [artistL, artistR, artistName];
  } else if (artistLAvg > 256 && artistRAvg < 256) {
    return [artistR, artistL, artistName];
  }
  return [artistName, artistName, artistName];
}

function decodeIndietorrentsSearch() {
  var searchStr = document.querySelector('.inputtext').value;
  var searchStrDecoded = decodeURIComponent(searchStr);
  if (searchStrDecoded !== searchStr) {
    var artistSearch = document.querySelector('#artistsearch');
    artistSearch.focus();
    artistSearch.value = searchStrDecoded;
    var artistForm = artistSearch.form;
    artistForm.submit();
  } else return;
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  r = Math.round(r / 16 - r % 16 / 16).toString(16) + (r % 16).toString(16);
  g = Math.round(g / 16 - g % 16 / 16).toString(16) + (g % 16).toString(16);
  b = Math.round(b / 16 - b % 16 / 16).toString(16) + (b % 16).toString(16);
  return '#' + r + g + b;
}

function sortPruneArtists(artistList) {//artistList = string with \n between artists
  var artists = artistList.toLowerCase().split('\n');
  artists.sort();
  while (artists[0] === '') artists.shift();
  var artistsPruned = false;
  for (var i = 1, len = artists.length, artistsSplit; i < len; i++) {
    artists[i] = (artists[i] == artists[i - 1]) ? '' : artists[i];
    artistsSplit = (/.+ \(.+\)$/.test(artists[i])) ? removeParentheses(artists[i]) : [artists[i], '', ''];
    if (artistsSplit[0] !== artists[i]) {
      if (artists.indexOf(artistsSplit[0]) == -1) artists.push(artistsSplit[0]);
      if (artists.indexOf(artistsSplit[1]) == -1) artists.push(artistsSplit[1]);
    }
  }
  artists.sort();
  while (artists[0] === '') artists.shift();
  artists = artists.join('\n');
  return artists;//returns string with \n between artists
}

//function parseFeatArtists(artistList, parseTracks) {//artistList = string, \n-joined list of artists; parseTracks = trackprefix or boolean false
//  var artists = artistList.split('\n');
//  var prefixPatt = parseTracks ? new RegExp('^' + parseTracks) : /^\0$/;
//  var newArtists = [], newFeats = [];
//  for (var i = 0, len = artists.length; i < len; i++) {
//    var iArtist = artists[i], iNewArt, iNewFeat;
//    if (/.+ [\(\[]?(F|f)ea(t |t\. |turing ).+[\)\]]?.*/.test(iArtist)) {
//      var featMatch = iArtist.match(/[\(\[]?(F|f)ea(t |t\. |turing )/)[0];
//      var featMatch0 = featMatch[0];
//      var splitArtist = iArtist.split(featMatch);
//      iNewArt = splitArtist[0].trim();
//      iNewFeat = splitArtist[1].trim();
//      if (prefixPatt.test(iNewArt)) iNewArt = '';
//      if (featMatch0 == '(' || featMatch0 == '[') {
//        var nestCnt = 0;
//        var watchFor = featMatch0 == '(' ? '(' : '[';
//        var lookFor = featMatch0 == '(' ? ')' : ']';
//        for (i = 0, len = iNewFeat.length; i < len; i++) {
//          if (iNewFeat[i] == watchFor) nestCnt++;
//          if (iNewFeat[i] == lookFor) nestCnt--;
//          if (nestCnt < 1) break;
//        }
//        iNewFeat = iNewFeat.substring(0,i);
//      }
//      var iNewFeatCSplit = iNewFeat.split(', ');
//      var iNewFeatCLen = iNewFeatCSplit.length;
//      var iNewAndMatch = (iNewFeatCSplit[iNewFeatCLen - 1]).replace(/(.+ )(and|&|\+)( .+)/, '$2');
//      var iNewFeatASplit = iNewFeatCSplit[iNewFeatCLen - 1].split(iNewAndMatch);
//      var iNewFeatALen = iNewFeatCSplit.length;
//      if (iNewFeatALen > 1) {
//        iNewFeatCSplit[iNewFeatCLen - 1] = iNewFeatASplit[0];
//        iNewFeatCSplit.push(iNewFeatASplit[1]);
//      }
//      for (i = 0, len = iNewFeatCSplit.length; i < len; i++) {
//        newFeats.push(iNewFeatCSplit[i].trim());
//      }
//      iNewArt = iArtist;
//    } else {
//      iNewArt = iArtist;
//    }
//    newArtists.push(iNewArt);
//  }
//  return [newArtists, newFeats];//[unsorted/unpruned list of artists array, /unsorted/unpruned list of feat artists array]
//}

/*
function curveSimilarity(x, z) {
  x = parseFloat(x);
  z = parseFloat(z);
  if (z == 0) return x; // not ===, that fails
  //if (i == 1) console.log(': ' + );
  console.log('x = ' + x + ', z = ' + z);
  var y1 = x;
  console.log('y1 = ' + y1);
  y1 = y1 - 1;
  console.log('y1 = ' + y1);
  y1 = Math.pow(y1, 2);
  console.log('y1 = ' + y1);
  y1 = 1 - y1;
  console.log('y1 = ' + y1);
  y1 = Math.sqrt(y1);
  console.log('y1 = ' + y1);
  var y2 = x;
  console.log('y2 = ' + y2);
  y2 = Math.pow(y2, 2);
  console.log('y2 = ' + y2);
  y2 = y2 * 4;
  console.log('y2 = ' + y2);
  y2 = 4 - y2;
  console.log('y2 = ' + y2);
  y2 = Math.sqrt(y2);
  console.log('y2 = ' + y2);
  y2 = y2 / 2;
  console.log('y2 = ' + y2);
  y2 = 1 + y2;
  console.log('y2 = ' + y2);
  var y = (y1 + (y1 * z) - y2 + (y2 * z)) / 2;
  console.log('y = ' + y);
  return y;
  //return ((Math.sqrt(1 - Math.pow((x - 1), 2)) * (1 + z)) + (()1 + ((Math.sqrt(4 - (4 * Math.pow(x, 2)))) / 2) * (-1 + z))) / z;
}
*/

/*
  Remove diacritics (accents) from a string
  @param {string} str The input string from which we will remove strings with diacritics
  @returns {string}
  @see http://goo.gl/zCBxkM
  */
function removeDiacritics(str) {
  var diacriticsMap = {
    A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
    AA: /[\uA732]/g,
    AE: /[\u00C6\u01FC\u01E2]/g,
    AO: /[\uA734]/g,
    AU: /[\uA736]/g,
    AV: /[\uA738\uA73A]/g,
    AY: /[\uA73C]/g,
    B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
    C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
    D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
    DZ: /[\u01F1\u01C4]/g,
    Dz: /[\u01F2\u01C5]/g,
    E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
    F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
    G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
    H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
    I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
    J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
    K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
    L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
    LJ: /[\u01C7]/g,
    Lj: /[\u01C8]/g,
    M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
    N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
    NJ: /[\u01CA]/g,
    Nj: /[\u01CB]/g,
    O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
    OI: /[\u01A2]/g,
    OO: /[\uA74E]/g,
    OU: /[\u0222]/g,
    P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
    Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
    R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
    S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
    T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
    TZ: /[\uA728]/g,
    U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
    V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
    VY: /[\uA760]/g,
    W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
    X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
    Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
    Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
    a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
    aa: /[\uA733]/g,
    ae: /[\u00E6\u01FD\u01E3]/g,
    ao: /[\uA735]/g,
    au: /[\uA737]/g,
    av: /[\uA739\uA73B]/g,
    ay: /[\uA73D]/g,
    b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
    c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
    d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
    dz: /[\u01F3\u01C6]/g,
    e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
    f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
    g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
    h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
    hv: /[\u0195]/g,
    i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
    j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
    k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
    l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
    lj: /[\u01C9]/g,
    m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
    n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
    nj: /[\u01CC]/g,
    o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
    oi: /[\u01A3]/g,
    ou: /[\u0223]/g,
    oo: /[\uA74F]/g,
    p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
    q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
    r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
    s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
    ss: /[\u00DF]/g,
    t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
    tz: /[\uA729]/g,
    u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
    v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
    vy: /[\uA761]/g,
    w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
    x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
    y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
    z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
  };
  for (var x in diacriticsMap) {
    if (!diacriticsMap.hasOwnProperty(x)) continue;
    str = str.replace(diacriticsMap[x], x);
  }
  return str;
}

// +------------------------------------------------------------------------------+
// |                                 OINKPLUS MENUs                               |
// +------------------------------------------------------------------------------+

var valuesSaved = false;
// +------------------------------------------------------------------------------+
// |                                   MAIN MENU                                  |
// +------------------------------------------------------------------------------+
var mainFields = {
  'lastfm_api_key': {
    'type': 'text', 'label': '<b>Last.fm API Key</b> (required for Last.fm API calls)', 'labelPos': 'below', 'size': 48, 'default': '',
    'title': 'Your Last.fm API Key', 'section': ['', '<b><u>Last.fm API Key</u></b>']
  },
  'get_lastfm_api_key': {
    'label': 'Get API Key', 'type': 'button', 'click': function() { GM_openInTab('http://www.last.fm/api/account/create', false); },
    'title': 'Click to open the Last.fm API Key application page in a new tab\nYou only need to fill in the Contact email and Application name fields on the application page - the rest are optional',
  },
  'max_sim_artists': {
    'type': 'unsigned int', 'label': ' <b>Maximum similar artists</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 25,
    'section': ['', '<b><u>Last.fm Similar Artists</u></b>'], 'title': 'Maximum number of similar artists to display\nMust be an integer (0-100)'
  },
  'min_artist_thresh': {
    'type': 'unsigned int', 'label': ' <b>Similarity threshhold</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 0,
    'title': 'Similar artists less similar than this will not be displayed\nMust be an integer (0-100 percentage)'
  },
  'min_sim_artists': {
    'type': 'unsigned int', 'label': ' <b>Minimum similar artists</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 0,
    'title': 'Minimum number of similar artists to display, regardless of similarity\nMust be an integer (0-100)'
  },
  'artist_colors': {
    'label': 'Colorize Similar Artists', 'title': 'Artist Colors Menu', 'type': 'button', 'click': function() { gmc_opcol.open(); }
  },
  'artist_list': {
    'label': 'Highlight Similar Artists', 'title': 'Highlighted Artist Menu', 'type': 'button', 'click': function() { gmc_opart.open(); }
  },
  'truncate_parenths': {
    'type': 'checkbox', 'label': 'Parse foreign artist names', 'default': false, 'section': ['', '<b><u>Last.fm Artist Title</u></b>'],
    'title': 'Intended to obtain better Last.fm Metadata for non-English artists with non-English names\nIf enabled, OiNKPlus will parse artist names formatted as "string1 (string2)" and discard whichever string contains predominantly non-latin alphabet characters.\n\ne.g. "Hi-Posi (ハイポジ)" or "ハイポジ (Hi-Posi)" will be parsed as "Hi-Posi" only\nEnabling the "Add native name link" option below will include a bracketed link next to the Artist name - clicking this link will reload OiNKPlus with Last.fm metadata for the artist\s native name'
  },
  'add_alt_link': {
    'type': 'checkbox', 'label': 'Add native name link', 'default': false,
    'title': 'Adds a link between the artist more link and load similar link if the artist name has been parsed for a non-English native name\nThis feature is buggy'
  },
  'max_tags': {
    'type': 'unsigned int', 'label': ' <b>Maximum tags</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 5, 'section': ['', '<b><u>Last.fm Tags</u></b>'],
    'title': 'Maximum number of tags to display\nMust be an integer (0-100)'
  },
  'min_tag_thresh': {
    'type': 'unsigned int', 'label': ' <b>Tag weight threshhold</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 0,
    'title': 'Tags weighted less than this percent (compared to the top tag) will not be displayed\nMust be an integer (0-100 percentage)'
  },
  'min_tags': {
    'type': 'unsigned int', 'label': ' <b>Minimum tags</b>', 'size' : 1, 'min': 0, 'max': 100, 'default': 0,
    'title': 'Minimum number of tags to display, regardless of weight\nMust be an integer (0-100)'
  },
  'title_tags': {
    'type': 'checkbox', 'label': 'Tag weight tooltips', 'default': false,
    'title': 'Add a tooltip for each tag displaying its relative weight percentage (in comparison to the top tag)'
  },
  'link_tags': {
    'type': 'checkbox', 'label': 'Link tags', 'default': false,
    'title': 'Link tags to a tag search on the respective tracker, when tracker tag searches are supported'
  },
  'hide_useless_tags': {
    'type': 'checkbox', 'label': 'Hide useless tags', 'default': false,
    'title': 'Useless Last.fm tags listed below will be omitted from the displayed tags\nThey will not count towards the Maximum Tags limit'
  },
  'useless_tags': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'amazing, animal cruelty, awesome, beautiful, bimbo, bootylicious, boring, check later, check this out, constant lip syncher, cool, crap, cunt, cute, drugs, faves, favorite, favorites, favorite albums, favorite artists, fun, genius, great voice, guilty pleasure, guilty pleasures, happy, hot, iwasrecommendedthis, lesser known yet streamable artists, indielove, love this, mainstream, mislabel, need to rate, officially shallow, officially shit, overrated, party, playmoreonlastfm, potential, rap, seen live, sexy, shit, slsk, talentless, the pricipal picture is shit, to check out, to see it, want to see live, weed, whore, your ears will bleed',
    'title': 'Useless Last.fm tags listed below will be omitted from the displayed tags\nThey will not count towards the Maximum Tags limit'
  },
  'max_bio_len': {
    'type': 'unsigned int', 'label': ' <b>Maximum bio length</b>', 'size' : 1, 'min': 0, 'default': 450, 'section': ['', '<b><u>Last.fm Biography</u></b>'],
    'title': 'Maximum number of characters to display in the biography\nMust be an integer\nBiographies exceeding this length will be truncated, with a "read more" link to expand it'
  },
  'add_settings': {
    'type': 'checkbox', 'label': 'Add OiNKPlus settings button', 'default': true, 'section': ['', '<b><u>Last.fm Artist Search/Image</u></b>'],
    'title': 'Adds a link to the settings Main Menu in the upper-right corner of the OiNKPlus box\nIf disabled, this menu can still be accessed from the Greasemonkey/Tampermonkey menus, under "OiNKPlus Settings"\n(But you must be on a supported tracker\'s torrent/artist page for it to appear)'
  },
  'link_artist_image': {
    'type': 'checkbox', 'label': 'Link artist image', 'default': false,
    'title': 'Link the artist image to that artist\'s image gallery page on Last.fm'
  },
  'icon_size': {
    'type': 'select', 'label': ' <b>Icon size</b>', 'options': ['12', '16', '20', '24', '28', '32'], 'size': 4, 'default': '24',
    'title': 'Icon size in pixels for trackers and external sites', 'section': ['', '<b><u>Tracker/External Site Searchlinks</u></b>']
  },
  'icon_padding': {
    'type': 'select', 'label': ' <b>Icon Padding</b>', 'options': ['0', '1', '2', '3', '4', '5', '6', '7', '8'], 'size': 4, 'default': '4',
    'title': 'Width in pixels of padding around icons'
  },
  'group_padding': {
    'type': 'select', 'label': ' <b>Group Padding</b>', 'options': ['0', '1', '2', '3', '4'], 'size': 4, 'default': '0',
    'title': 'Extra rows between site groups',
  },
  'site_settings': {
    'label': 'Site Settings', 'title': 'Tracker / External Site Menu', 'type': 'button', 'click': function() { gmc_opsit.open(); }
  },
  /*  'embedded_players': {
    'label': 'Embedded Players', 'type': 'button', 'title': 'Embedded Players Menu\nDisabled - not implemented (yet)', 'click': function() { gmc_oppla.open(); }
  },*/
  'ext_menu': {
    'label': 'External Site Settings', 'title': 'External Sites Advanced Settings Menu', 'type': 'button', 'section': ['', '<b><u>Advanced Settings</u></b>'],
    'click': function() { gmc_opext.open(); }
  },
  'tra_menu': {
    'label': 'Tracker Settings', 'title': 'Trackers Advanced Settings Menu', 'type': 'button', 'click': function() { gmc_optra.open(); }
  },
  'oinkplus_menu': {
    'label': 'OiNKPlus Settings', 'title': 'OiNKPlus Advanced Settings Menu', 'type': 'button', 'click': function() { gmc_opadv.open(); }
  }
};
// +------------------------------------------------------------------------------+
// |                                 end MAIN MENU                                |
// +------------------------------------------------------------------------------+

GM_config.init({
  'id': 'MainMenu', 'title': oinkplusIcon + ' OiNKPlus Main Menu', 'fields': mainFields,
  'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'open': function(doc) {
      valuesSaved = false;
      var config = this;
      doc.getElementById(config.id + '_resetLink').title =
        'Reset fields to default values\nMake sure you copy your existing Last.fm API Key before you click this - it will be reset as well';
    },
    'save': function() { location.reload(); },
    'close': function() { if (valuesSaved) location.reload(); }
  }
});
// +------------------------------------------------------------------------------+
// |                                init MAIN MENU                                |
// +------------------------------------------------------------------------------+

GM_registerMenuCommand('OiNKPlus Settings', function() {GM_config.open();});

// +------------------------------------------------------------------------------+
// |                               ARTIST LIST MENU                               |
// +------------------------------------------------------------------------------+
var artFields = {
  'sim_artists_notif': {
    'type': 'checkbox', 'label': 'Highlight similar artists',
    'title': 'Highlight similar artists listed in your Artist List\nYou must manually add a list of artists to the list below',
    'default': false, 'section': ['', '<b><u>Similar Artists Settings</u></b>']
  },
  'sim_artists_b': {
    'type': 'checkbox', 'label': '<b>Embolden</b>', 'title': 'Embolden highlighted similar artists', 'default': false
  },
  'sim_artists_i': {
    'type': 'checkbox', 'label': '<i>Italicize</i>', 'title': 'Italicize highlighted similar artists', 'default': false
  },
  'sim_artists_u': {
    'type': 'checkbox', 'label': '<u>Underline</u>', 'title': 'Underline highlighted similar artists', 'default': false
  },
  'sim_artists_img': {
    'type': 'checkbox', 'label': 'Append image <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHISURBVChTVZHdS1oBGMbPfzBqRLsRWjCIDt3vwsL1cSKzIqIaUuqy0s6CIizTzmpizhs3yciojVoXx0N0IbHNIipYZASLirQIImksK+ysTh8Yp6AnlSbsuXlvfvweeF6CeMwrVRepMrs40/B3ocM9C/qjV6g2OLliFUP+YxK3QG2usrNL4mTgFi7/Nd75eOg9v6EcCaKSYcVcpaEiAcaNlomf4ujaLWyLV2j3RlA3HkKRYwM53YuQ9c0hjx6KUuq+LOK10cU5V0QYZy6h5U6gcO/hhWkVKc0+mLlNLAXDoIwsSnVWltB9+ibQXgE1X48gc+4irX0ZT5p8oL/8QuCAh2chgMxaOwqb+nmixv4DJSOH8KydY3rjFE/1M1AO+BE6vsDCeghkvQOSUiPyVAyI8t4pgbRuY37nDPcA5reOEf57ja39E7zUuRJgBkWDamB4Qt7q4NJj1c/ezmJ5N4Ib8Q5h/hIlhs9JMFuuR5nuPUsUNzKktG1MTNVM4rl2Av7gH2hsXAzsShgzC7Qo1JijiubYGvHEd5S1uqMZdYOQVNmSYLa8JV4fldZ2Kv57DKU2ZZXRH7j8RiufW9+DojcMX95iYZPGGP0AZecJAEoHq2IAAAAASUVORK5CYII=">',
    'title': 'Append an image after highlighted similar artists\nDefault image is a checkmark\nCan be changed in the Advanced Settings Menu',
    'default': false
  },
  'sim_artists_imgsize': {
    'type': 'unsigned int', 'label': ' <b>Image size</b>', 'title': 'Size of image (pixels x pixels) to append\nMust be an integer (≥1)', 'size': 1, 'min': 1, 'default': 11
  },
  'artist_list': {
    'label': '<b>Highlighted Artist List</b>',
    'title': 'The Highlighted Artist List contains a list of artists which, if "Highlight similar artists" is enabled above, will highlight Last.fm similar artists matching entries in this list, per the settings above\nEach artist in this list should be on a separate line\nDo not paste comma-separated lists of artists in here, or it will treat the entire row as a single artist! You can manually copy/paste such lists into the "Artists to add" field below',
    'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '', 'section': ['', '<b><u>Highlighted Artist List</u></b>']
  },
  'sort_list': {
    'label': 'Sort & Prune List', 'type': 'button',
    'title': 'Sort the Artist List and remove duplicate entries\n\nThis is only useful if you directly modify the list above\nLists of artists added via the "Artists to add" field below will automatically be sorted in and pruned when added',
    'click': function() {
      var ArtistList = gmc_opart.fields.artist_list.toValue();
      var newList = sortPruneArtists(ArtistList);
      gmc_opart.fields.artist_list.value = newList;
      //gmc_opart.fields.artist_list.reload();
      var listDifference = newList.split('\n').length - ArtistList.split('\n').length;
      alert('Artist List sorted\nLength of Artist List changed by ' + (listDifference > -1 ? '+' : '') + listDifference +
            ' entries.\n\nMAKE SURE YOU CLICK SAVE TO APPLY THESE CHANGES');
      gmc_opart.close();
      gmc_opart.open();
    }
  },
  'artist_import': {
    'label': '<b>Artists to add</b>', 'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '', 'save': false, 'section': ['', '<b><u>Add Artists</u></b>'],
    'title': 'Copy/paste your comma- or newline-separated list of artists here, to append to or replace the list above'
  },
  'comma_newline': {
    'label': '<b>List is:</b>', 'labelPos': 'left', 'type': 'radio', 'options': ['comma-separated', 'newline-separated'], 'default': 'comma-separated', 'save': false,
    'title': 'You can enter a list of comma-separated artists (like your Artist Notifications filter list) or a newline-separated list (with each artist on a separate line)'
  },
  /*  'parse_feat': {
    'label': 'Parse Featured Artists in', 'labelPos': 'left', 'type': 'radio', 'options': ['artists and track title tags', 'artists only', 'do not parse feat artists'],
    'default': 'do not parse feat artists', 'save': false,
    'title': 'Parse variants of "feat." artists in the artist and/or tracktitle values/tags\nThis feature is intended for importing lists of artists from a media player,\
e.g. foobar2000\nIt is intended to parse out featured artists\' names from artist tags and/or track title tags\nRefer to the features below for more info\nThis setting is\
disabled if you select comma-separated above'
  },
  'track_prefix': {
    'label': 'Track prefix', 'type': 'text', 'size': 16, 'default': '!track:',
    'title': 'Track title tag prefix\nShould be prepended to track title tags pasted or imported into the Artist List\nShould be a string that is unlikely to occur at the\
beginning of a tag, e.g. "!track: " (the default value)'
  },*/
  'append_replace': {
    'label': '<b>Import mode:</b>', 'labelPos': 'left', 'type': 'radio', 'options': ['append imported artists to the current list', 'replace the current list with imported artists'],
    'default': 'append imported artists to the current list', 'save': false, 'title': ''
  },
  'import_artists': {
    'label': 'Add Artists', 'type': 'button',
    'title': 'Add the list of Artists above into the Artist List\nList added will overwrite the stored Artist List if import mode is "replace", otherwise it will append it',
    'click': function() {
      var newList = gmc_opart.fields.artist_import.toValue();
      var commaSplit = (gmc_opart.fields.comma_newline.toValue() == 'comma-separated') ? true : false;
      if (newList.split('\n').length > 1 && commaSplit) {
        alert('You cannot import more than one line of text if you select comma-separated!');
        return;
      }
      var importMode = gmc_opart.fields.append_replace.toValue() == 'append imported artists to the current list' ? 'append' : 'replace';
      var curList = gmc_opart.fields.artist_list.toValue().split(/ *\n */);
      curList = (importMode == 'append') ? curList : [];
      newList = newList.toLowerCase();
      newList = (commaSplit) ? newList.split(/ *, */) : newList.split(/ *\n */);

      //if (newList.length == 1 && newList == [''] && curList.length > 0 && importMode == 'replace')
      //  if (!confirm('You are attempting to replace a populated list with an empty list - is this really what you want to do?')) return;
      //      var curFeat = gmc_opart.fields.feat_added.toValue().split(/ *\n */);
      //      var parsedList = [newList, []], trackPrefix = false, alertMessage = '';
      var trackPrefix = false, alertMessage = '';
      newList = sortPruneArtists(newList.join('\n')).split('\n');
      var oldLength = curList.length;
      for (i = 0, len = newList.length; i < len; i++)
        curList.push(newList[i]);
      curList = sortPruneArtists(curList.join('\n'));
      gmc_opart.fields.artist_list.value = curList;
      //gmc_opart.fields.artist_list.reload();
      gmc_opart.fields.artist_import.value = '';
      //gmc_opart.fields.artist_import.reload();
      alertMessage = 'The artists to add ' +
        (importMode == 'append' ? 'have been appended to the' : 'have replaced the current') + ' Artist List, and have been sorted, with duplicate entries pruned.\n' +
        '\nMAKE SURE YOU CLICK SAVE TO APPLY THESE CHANGES';
      //        (curList.split('\n').length - oldLength) + ' new entries were added.\n\nMAKE SURE YOU CLICK SAVE TO APPLY THESE CHANGES';

      //      switch (gmc_opart.fields.comma_newline.toValue() == 'comma-separated' ? 'do not parse feat artists' : gmc_opart.fields.parse_feat.toValue()) {
      //        case 'artists and track title tags':
      //          trackPrefix = gmc_opart.fields.track_prefix.toValue();

      /* falls through */
      //        case 'artists only':
      //          parsedList = parseFeatArtists(newList.join('\n'), trackPrefix);
      //          var newFeat = sortPruneArtists(parsedList[1].join('\n')).split('\n');
      //          for (var i = 0, len = newFeat.length; i < len; i++)
      //            curFeat.push(newFeat[i]);
      //          gmc_opart.fields.feat_added.value = curFeat.join('\n');
      //          //gmc_opart.fields.feat_added.reload();
      //          alertMessage = 'List parsed for featured artists; ' + newFeat.length + ' featured artists added\nYou may review the new additions below\n\n';

      /* falls through */
      //        case 'do not parse feat artists':
      //          parsedList[0] = sortPruneArtists(parsedList[0].join('\n')).split('\n');
      //          var oldLength = curList.length;
      //          for (i = 0, len = parsedList[0].length; i < len; i++)
      //            curList.push(parsedList[0][i]);
      //          curList = sortPruneArtists(curList.join('\n')).split('\n');
      //          gmc_opart.fields.artist_list.value = curList.join('\n');
      //          //gmc_opart.fields.artist_list.reload();
      //          gmc_opart.fields.artist_import.value = '';
      //          //gmc_opart.fields.artist_import.reload();
      //          alertMessage = 'The artists to add ' +
      //            (importMode == 'append' ? 'have been appended to the' : 'have replaced the current') + ' Artist List, and have been sorted, with duplicate entries pruned.\n' +
      //            (curList.length - oldLength) + ' new entries were added.\n\n' + alertMessage + 'MAKE SURE YOU CLICK SAVE TO APPLY THESE CHANGES';
      //          break;
      //        default:
      //      }

      alert(alertMessage);
      gmc_opart.close();
      gmc_opart.open();
    }
  },
  /*  'feat_added': {
    'label': 'Featured Artists added to list', 'type': 'textarea', 'rows': 6, 'cols': 96, 'default': '', 'section': ['', '<b><u>Featured Artists in Artist List</u></b>'],
    'title': 'List of artists added to Artists List\nParsed from variants of "feat." in the artist and/or tracktitle values/tags'
  },
  'clear_feat': {
    'label': 'Clear', 'type': 'button',
    'title': 'Clear the list of Featured Artists above\nClick this if none of the entries are invalid',
    'click': function() {
      if (confirm('OiNKPlus will clear the list of Featured Artists added to your Artist List.\n\nContinue?')) {
        gmc_opart.fields.feat_added.value = '';
        gmc_opart.close();
        gmc_opart.open();
      }
    }
  },
  'remove_feat': {
    'label': 'Remove', 'title': 'Remove the list of Featured Artists above from your Artists List\nClick this after deleting valid entries from the Featured Artists list above, so it only contains invalid entries that should be removed from the Artist List', 'type': 'button',
    'click': function() {
      if (confirm('OiNKPlus will remove the current list of Featured Artists from your Artist List.\n\nContinue?')) {
        var curList = gmc_opart.fields.artist_list.toValue();
        curList = curList.toLowerCase().split(/ *\n *///\);
  /*        var curFeat = gmc_opart.fields.feat_added.toValue();
        curFeat = curFeat.toLowerCase().split(/ *\n *///);
  /*        var featCount = 0;
        for (var i = 0, len = curFeat.length, featIndex; i < len; i++) {
          featIndex = curList.indexOf(curFeat[i]);
          if (featIndex > -1) {
            curList[featIndex] = '';
            featCount++;
          }
        }
        curList.sort();
        while (curList[0] === '') curList.shift();
        gmc_opart.fields.artist_list.value = curList.join('\n');
        gmc_opart.fields.feat_added.value = '';
        gmc_opart.close();
        gmc_opart.open();
        alert(featCount + ' Featured Artists ' + (featCount !== 1 ? 'were' : 'was') + ' removed.\n\nList of Featured Artists cleared.\n\nMAKE SURE YOU CLICK SAVE TO APPLY THESE CHANGES');
      }
    }
  },*/
  'fb2k_artists': {
    'label': '<b>OiNKPlus Artists list</b>',
    'title': 'Add this pattern to your foobar2000 Text Tools Quick copy commands\nIt will copy a newline-separated list of artists, with multiple artists on the same track split to separate lines\n',
    'type': 'textarea', 'rows': 1, 'cols': 48, 'save': false, 'default': '$replace($meta_sep(artist,;newline;),;newline;,$crlf())',
    'section': ['', '<b><u>foobar2000 Text Tools</u></b>']
  },
  /*  'fb2k_tracks': {
    'label': 'OiNKPlus Artists & Tracks list', 'title': 'OiNKPlus Artists & Tracks list', 'type': 'textarea', 'rows': 4, 'cols': 96, 'save': false,
    'default': '$puts(prefix,\'!track:\')$replace($meta_sep(artist,;newline;),;newline;,$crlf())$if($or($strstr(%title%, Featuring ),$strstr(%title%, featuring ),$strstr(%title%, Feat. ),$strstr(%title%, feat. ),$strstr(%title%, Feat ),$strstr(%title%, feat ),$strstr(%title%, \'(\'Featuring ),$strstr(%title%, \'(\'featuring ),$strstr(%title%, \'(\'Feat. ),$strstr(%title%, \'(\'feat. ),$strstr(%title%, \'(\'Feat ),$strstr(%title%, \'(\'feat )),$crlf()$get(prefix)%title%,)'
  },*/
  'fb2k_texttools': {
    'label': 'Text Tools', 'title': 'Click to open the foobar2000 Text Tools component page in a new tab', 'type': 'button', 'click': function() {
      GM_openInTab('http://www.foobar2000.org/components/view/foo_texttools', false);
    }
  }
};
// +------------------------------------------------------------------------------+
// |                             end ARTIST LIST MENU                             |
// +------------------------------------------------------------------------------+

var gmc_opart = new GM_configStruct(
  {
    'id': 'ArtistList',
    'title': oinkplusIcon + ' Highlighted Artist Menu',
    'fields': artFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function(doc) {
        doc.getElementById('ArtistList_field_fb2k_artists').addEventListener('click', function(){ this.select(); });
        //doc.getElementById('ArtistList_field_fb2k_tracks').addEventListener('click', function(){ this.select(); });
      },
      'save': function() {
        valuesSaved = true;
        var config = this;
        config.close();
      }
    }
  });
gmc_opart.init();
// +------------------------------------------------------------------------------+
// |                            init ARTIST LIST MENU                             |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                              ARTIST COLORS MENU                              |
// +------------------------------------------------------------------------------+
var colFields = {
  'col_sim_artists': {
    'type': 'checkbox', 'label': 'Colorize similar artists', 'default': false, 'section': ['', '<b><u>Similar Artist Colors</u></b>'],
    'title': 'Colorize similar artists based on similarity\nSimilar Artist names will be colorized along a range of colors, determined by the settings below\nDefault settings display most similar as green and least similar as red, shading through yellow and orange between'
  },
  'sim_artists_least_hue': {
    'type': 'unsigned int', 'label': ' <b>Least similar hue</b>', 'size': 1, 'min': 0, 'max': 360, 'default': 0,
    'title': 'Hue for least similar artists (0%)\n0° = red, 120° = green and 240° = blue\nMust be an integer (0-360 degrees)'
  },
  'sim_artists_most_hue': {
    'type': 'unsigned int', 'label': ' <b>Most similar hue</b>', 'size': 1, 'min': 0, 'max': 360, 'default': 120,
    'title': 'Hue for most similar artists (100%)\n0° = red, 120° = green and 240° = blue\nMust be an integer (0-360 degrees)'
  },
  /*  'sim_artists_hue_curve': {
    'type': 'signed float', 'label': ' Hue curvature', 'size': 1, 'min': -1, 'max': 1, 'default': 0,
    'title': 'Hue range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)'
  },*/
  'sim_artists_hue_dir': {
    'type': 'select', 'options': ['Positive', 'Negative'], 'default': 'Positive', 'label': ' <b>Hue direction</b>',
    'title': 'Direction (positive or negative) to scale colors from least to most similar'
  },
  'sim_artists_least_sat': {
    'type': 'unsigned int', 'label': ' <b>Least similar saturation</b>', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
    'title': 'Saturation for least similar artists (0%)\n0% = white, 100% = fully saturated\nMust an integer (0-100 percentage)'
  },
  'sim_artists_most_sat': {
    'type': 'unsigned int', 'label': ' <b>Most similar saturation</b>', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
    'title': 'Saturation for most similar artists (100%)\n0% = white, 100% = fully saturated\nMust be an integer (0-100 percentage)'
  },
  /*  'sim_artists_sat_curve': {
    'type': 'signed float', 'label': ' <b>Saturation curvature</b>', 'size': 1, 'min': -1, 'max': 1, 'default': 0,
    'title': 'Saturation range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)'
  },*/
  'sim_artists_least_val': {
    'type': 'unsigned int', 'label': ' <b>Least similar value</b>', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
    'title': 'Value (brightness) for least similar artists (0%)\n0% = black, 100% = full color\nMust be an integer (0-100 percentage)'
  },
  'sim_artists_most_val': {
    'type': 'unsigned int', 'label': ' <b>Most similar value</b>', 'size': 1, 'min': 0, 'max': 100, 'default': 100,
    'title': 'Value (brightness) for most similar artists (100%)\n0% = black, 100% = full color\nMust be an integer (0-100 percentage)'
  },
  /*  'sim_artists_val_curve': {
    'type': 'signed float', 'label': ' <b>Value curvature</b>', 'size': 1, 'min': -1, 'max': 1, 'default': 0,
    'title': 'Value range will be curved per the following\n1: curved like the upper-left quadrant of a circle\n0: straight line\n-1: curved like the lower-right quadrant of a circle\nMust be a number (-1 to 1)'
  },*/
  'col_sim_artists_valmod': {
    'type': 'unsigned float', 'label': ' <b>Value modifier</b> (for light themes)', 'size' : 1, 'min': 0, 'max': 1, 'default': 0.66,
    'title': 'On trackers added to the list below, the value (brightness) will be multiplied by this modifier\n(for better visibility on light themes, if you use both light and dark themes, and customize the other settings for a darker theme)'
  },
  'col_sim_artists_sites': {
    'label': '<b>Trackers with light themes</b>', 'type': 'textarea', 'rows': 10, 'cols': 28, 'default': '',
    'title': 'List of trackers with light themes\nPut each tracker name on a separate line'
  },
  'hsv_wiki': {
    'label': 'HSV Wiki', 'title': 'Click to open the Wikipedia page on "HSL and HSV" in a new tab', 'type': 'button',
    'click': function() { GM_openInTab('https://en.wikipedia.org/wiki/HSL_and_HSV', false); }
  }/*,
  'col_var_artists': {
    'type': 'checkbox', 'label': 'Colorize various artists', 'title': 'Colorize various artists based on artist role\nThis feature is not yet implemented, and will only work on Gazelle trackers with the multiple Artist feature',
    'default': false, 'save': false, 'section': ['', '<b><u>Various Artists Colors</u></b>']
  },
  'col_role_main': {
    'type': 'text', 'size': 3, 'default': '#00ff00', 'label': ' Main artist', 'title': 'Color for Main artists\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_guest': {
    'type': 'text', 'size': 3, 'default': '#ffff00', 'label': ' Guest', 'title': 'Color for Guest artists\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_composer': {
    'type': 'text', 'size': 3, 'default': '#00ffff', 'label': ' Composer', 'title': 'Color for Composers\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_conductor': {
    'type': 'text', 'size': 3, 'default': '#007fff', 'label': ' Conductor', 'title': 'Color for Conductors\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_compiler': {
    'type': 'text', 'size': 3, 'default': '#00ff00', 'label': ' DJ / Compiler', 'title': 'Color for DJ / Compiler\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_remixer': {
    'type': 'text', 'size': 3, 'default': '#ff0000', 'label': ' Remixer', 'title': 'Color for Remixers\nShould be in hexidecimal #rrggbb format'
  },
  'col_role_producer': {
    'type': 'text', 'size': 3, 'default': '#ff00ff', 'label': ' Producer', 'title': 'Color for Producers\nShould be in hexidecimal #rrggbb format'
  },*/
};
// +------------------------------------------------------------------------------+
// |                            end ARTIST COLORS MENU                            |
// +------------------------------------------------------------------------------+

var gmc_opcol = new GM_configStruct(
  {
    'id': 'ArtistColors',
    'title': oinkplusIcon + ' Artist Colors Menu',
    'fields': colFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'save': function() {
        valuesSaved = true;
        var config = this;
        config.close();
      }
    }
  });
gmc_opcol.init();
// +------------------------------------------------------------------------------+
// |                           init ARTIST COLORS MENU                            |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                             EMBEDDED PLAYERS MENU                            |
// +------------------------------------------------------------------------------+
/*var plaFields = {
  'add_players': {
    'type': 'checkbox', 'label': 'Add embedded players', 'title': 'Add embedded players for Bandcamp, SoundCloud and Spotify to OiNKPlus\nNot implemented yet',
    'default': false, 'save': false
  },
  'player_order': {
    'label': '<b>Player Order</b>', 'title': 'The order in which the players will be displayed\nPut each site on a separate line', 'type': 'textarea', 'rows': 3,
    'cols': 16, 'default': 'Bandcamp\nSoundCloud\nSpotify'
  },
  'player_bandcamp_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥120)', 'size': 1, 'min': 120, 'default': 120,
    'section': ['', '<b><u>Bandcamp Player</u></b>']
  },
  'player_bandcamp_color': {
    'type': 'text', 'label': ' Link color', 'title': 'Color of the link, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': '0687f5'
  },
  'player_bandcamp_backcolor': {
    'type': 'text', 'label': ' Background color', 'title': 'Color of the background, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': 'ffffff'
  },
  'player_bandcamp_transparent': {
    'type': 'checkbox', 'label': 'Transparency', 'title': 'Allow transparency', 'default': true
  },
  'player_soundcloud_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥166)', 'size': 1, 'min': 166, 'default': 166,
    'section': ['', '<b><u>SoundCloud Player</u></b>']
  },
  'player_soundcloud_color': {
    'type': 'text', 'label': ' Color', 'title': 'Color of the play button, in RGB hex\nMust be a six-digit hexidecimal number', 'size': 3, 'default': 'ff5500'
  },
  'player_soundcloud_autoplay': {
    'type': 'checkbox', 'label': 'Autoplay', 'title': 'Autoplay on load', 'default': false
  },
  'player_soundcloud_hiderelated': {
    'type': 'checkbox', 'label': 'Hide related', 'title': 'Hide related playlist', 'default': true
  },
  'player_soundcloud_comments': {
    'type': 'checkbox', 'label': 'Show comments', 'title': 'Show comments', 'default': false
  },
  'player_soundcloud_user': {
    'type': 'checkbox', 'label': 'Show user', 'title': 'Show user', 'default': true
  },
  'player_soundcloud_reposts': {
    'type': 'checkbox', 'label': 'Show reposts', 'title': 'Show reposts\nThis cannot be changed', 'default': false, 'save': false
  },
  'player_spotify_height': {
    'type': 'unsigned int', 'label': ' Height', 'title': 'Height of player in pixels\nMust be an integer (≥80)', 'size': 1, 'min': 80, 'default': 80,
    'section': ['', '<b><u>Spotify Player</u></b>']
  },
  'player_spotify_transparent': {
    'type': 'checkbox', 'label': 'Transparency', 'title': 'Allow transparency', 'default': true
  }
};*/
// +------------------------------------------------------------------------------+
// |                           end EMBEDDED PLAYERS MENU                          |
// +------------------------------------------------------------------------------+

/*var gmc_oppla = new GM_configStruct(
  {
    'id': 'EmbeddedPlayers',
    'title': oinkplusIcon + ' Embedded Players Menu',
    'fields': plaFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'save': function() {
        valuesSaved = true;
        var config = this;
        config.close();
      }
    }
  });
gmc_oppla.init();*/
// +------------------------------------------------------------------------------+
// |                          init EMBEDDED PLAYERS MENU                          |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                         TRACKER / EXTERNAL SITE MENU                         |
// +------------------------------------------------------------------------------+
var sitFields = {
  'tracker_order': {
    'label': '<b>Tracker order</b>', 'title': 'Order to display the Tracker links\nEach tracker should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 24,
    'default': 'orpheus\narenabg\ndeepbassnine\nefectodoppler\nindietorrents\njpopsuki\nkaragarga\nkraytracker\nlibble\nmusicvids\nnotwhat\nredacted\nrockbox\nrutracker\nsecretcinema\nshellife\nthepiratebay\ntorrentz\nwaffles',
    'section': ['', '<b><u>Trackers</u></b>']
  },
  'show_orpheus': {'type': 'checkbox', 'label': 'Add orpheus.network', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_orpheus': {'type': 'checkbox', 'label': 'Add OiNKPlus to orpheus.network', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_arenabg': {'type': 'checkbox', 'label': 'Add ArenaBG', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'addop_arenabg': {'type': 'checkbox', 'label': 'Add OiNKPlus to ArenaBG', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_deepbassnine': {'type': 'checkbox', 'label': 'Add DEEPBASSNiNE', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_deepbassnine': {'type': 'checkbox', 'label': 'Add OiNKPlus to DEEPBASSNiNE', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_efectodoppler': {'type': 'checkbox', 'label': 'Add Efecto Doppler', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_efectodoppler': {'type': 'checkbox', 'label': 'Add OiNKPlus to Efecto Doppler', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_indietorrents': {'type': 'checkbox', 'label': 'Add indietorrents', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_indietorrents': {'type': 'checkbox', 'label': 'Add OiNKPlus to indietorrents', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_jpopsuki': {'type': 'checkbox', 'label': 'Add JPopsuki', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_jpopsuki': {'type': 'checkbox', 'label': 'Add OiNKPlus to JPopsuki', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_karagarga': {'type': 'checkbox', 'label': 'Add Karagarga', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_karagarga': {'type': 'checkbox', 'label': 'Add OiNKPlus to Karagarga', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_kraytracker': {'type': 'checkbox', 'label': 'Add Kraytracker', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'addop_kraytracker': {'type': 'checkbox', 'label': 'Add OiNKPlus to Kraytracker', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_libble': {'type': 'checkbox', 'label': 'Add Libble', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_libble': {'type': 'checkbox', 'label': 'Add OiNKPlus to Libble', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_musicvids': {'type': 'checkbox', 'label': 'Add MusicVids', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'addop_musicvids': {'type': 'checkbox', 'label': 'Add OiNKPlus to MusicVids', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_nostream': {'type': 'checkbox', 'label': 'Add NoStream', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_nostream': {'type': 'checkbox', 'label': 'Add OiNKPlus to NoStream', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_notwhat': {'type': 'checkbox', 'label': 'Add NotWhat.CD', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_notwhat': {'type': 'checkbox', 'label': 'Add OiNKPlus to NotWhat.CD', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_redacted': {'type': 'checkbox', 'label': 'Add Redacted', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_redacted': {'type': 'checkbox', 'label': 'Add OiNKPlus to Redacted', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_rockbox': {'type': 'checkbox', 'label': 'Add RockBox', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'addop_rockbox': {'type': 'checkbox', 'label': 'Add OiNKPlus to RockBox', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_rutracker': {'type': 'checkbox', 'label': 'Add RuTracker', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_rutracker': {'type': 'checkbox', 'label': 'Add OiNKPlus to RuTracker', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_secretcinema': {'type': 'checkbox', 'label': 'Add Secret Cinema', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_secretcinema': {'type': 'checkbox', 'label': 'Add OiNKPlus to Secret Cinema', 'default': false, 'title': 'Add OiNKPlus to the tracker'},
  'show_shellife': {'type': 'checkbox', 'label': 'Add Shellife', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_shellife': {'type': 'checkbox', 'label': 'Add OiNKPlus to Shellife', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_thepiratebay': {'type': 'checkbox', 'label': 'Add The Pirate Bay', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_thepiratebay': {'type': 'checkbox', 'label': 'Add OiNKPlus to The Pirate Bay', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_torrentz': {'type': 'checkbox', 'label': 'Add Torrentz', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_torrentz': {'type': 'checkbox', 'label': 'Add OiNKPlus to Torrentz', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_waffles': {'type': 'checkbox', 'label': 'Add Waffles', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'addop_waffles': {'type': 'checkbox', 'label': 'Add OiNKPlus to Waffles', 'default': true, 'title': 'Add OiNKPlus to the tracker'},
  'show_descriptions': {
    'type': 'checkbox', 'label': 'Site descriptions', 'title': 'Show site descriptions (if available) instead of the site names in the icon tooltips',
    'default': false, 'section': ['', '<b><u>External Links</u></b>']
  },
  'qobuz_country': {
    'type': 'select', 'options': ['Austria (German)', 'Belgium (Français)', 'Belgium (Nederlands)', 'France (Français)', 'Germany (Deutsch)', 'Great Britain (English)',
                                  'Ireland (English)', 'Spain (English)', 'Switzerland (Deutsch)', 'Switzerland (Français)'],
    'label': ' <b>Qobuz country</b>', 'title': 'Country/Language to link Qobuz searches to', 'default': 'Great Britain (English)'
  },
  'group_order': {
    'label': '<b>Group order</b>', 'title': 'Order to display the External site groups\nEach group should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'Streaming Sites\nWebstores\nMusic Databases\nSocial Media\nMusic Blogs\nCD Stores\nReview Sites\nGeneral'
  },
  'add_favorites': {
    'type': 'checkbox', 'label': 'Add Favorites row', 'title': 'Add a row of favorite External sites below the Trackers, above the other External site groups', 'default': false
  },
  'favorites_order': {
    'label': '<b>Favorites order</b>',
    'title': 'Order to display the External site links in the Favorites row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': ''
  },
  'streaming_sites_order': {
    'label': '<b>Streaming Sites order</b>',
    'title': 'Order to display the External site links in the Streaming Sites row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'deezer\npandora\npurevolume\nsoundcloud\nspotify\ntidal\nwimp', 'section': ['', '<b><u>Streaming Sites</u></b>']
  },
  'show_deezer': {'type': 'checkbox', 'label': 'Add Deezer', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_pandora': {'type': 'checkbox', 'label': 'Add Pandora', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_purevolume': {'type': 'checkbox', 'label': 'Add PureVolume', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_soundcloud': {'type': 'checkbox', 'label': 'Add SoundCloud', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_spotify': {'type': 'checkbox', 'label': 'Add Spotify', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_tidal': {'type': 'checkbox', 'label': 'Add Tidal', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_wimp': {'type': 'checkbox', 'label': 'Add WiMP', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'webstores_order': {
    'label': '<b>Webstores order</b>',
    'title': 'Order to display the External site links in the Webstores row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'sevendigital\nbandcamp\nbeatport\nbleep\nboomkat\ndigitaltunes\nemusic\nfnd\ngoogleplay\nhdtracks\nitunes\njunodownload\nmagnatune\nqobuz\nwhatpeopleplay',
    'section': ['', '<b><u>Webstores</u></b>']
  },
  'show_sevendigital': {'type': 'checkbox', 'label': 'Add 7Digital', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_bandcamp': {'type': 'checkbox', 'label': 'Add Bandcamp', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_beatport': {'type': 'checkbox', 'label': 'Add Beatport', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_bleep': {'type': 'checkbox', 'label': 'Add Bleep', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_boomkat': {'type': 'checkbox', 'label': 'Add Boomkat', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_digitaltunes': {'type': 'checkbox', 'label': 'Add Digital Tunes', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_emusic': {'type': 'checkbox', 'label': 'Add eMusic', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_fnd': {'type': 'checkbox', 'label': 'Add fnd', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_googleplay': {'type': 'checkbox', 'label': 'Add Google Play Music', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_hdtracks': {'type': 'checkbox', 'label': 'Add HDtracks', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_itunes': {'type': 'checkbox', 'label': 'Add itunes', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_junodownload': {'type': 'checkbox', 'label': 'Add JunoDowndload', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_magnatune': {'type': 'checkbox', 'label': 'Add Magnatune', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_qobuz': {'type': 'checkbox', 'label': 'Add Qobuz', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_whatpeopleplay': {'type': 'checkbox', 'label': 'Add WhatPeoplePlay', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'music_databases_order': {
    'label': '<b>Music Databases order</b>',
    'title': 'Order to display the External site links in the Music Databases row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'allmusic\ndiscogs\nfreedb\nlastfm\nlyricwikia\nmetalarchives\nmusicbrainz\nrateyourmusic\nreverbnation',
    'section': ['', '<b><u>Music Databases</u></b>']
  },
  'show_allmusic': {'type': 'checkbox', 'label': 'Add AllMusic', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_discogs': {'type': 'checkbox', 'label': 'Add Discogs', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_freedb': {'type': 'checkbox', 'label': 'Add freedb', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_lastfm': {'type': 'checkbox', 'label': 'Add Last.fm', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_lyricwikia': {'type': 'checkbox', 'label': 'Add LyricWikia', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_metalarchives': {'type': 'checkbox', 'label': 'Add Encyclopaedia Metallum', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_musicbrainz': {'type': 'checkbox', 'label': 'Add MusicBrainz', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_rateyourmusic': {'type': 'checkbox', 'label': 'Add Rate Your Music', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_reverbnation': {'type': 'checkbox', 'label': 'Add ReverbNation', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'social_media_order': {
    'label': '<b>Social Media order</b>',
    'title': 'Order to display the External site links in the Social Media row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'facebook\ngoogleplus\nmyspace\ntwitter\ntumblr\nvimeo\nyoutube',
    'section': ['', '<b><u>Social Media</u></b>']
  },
  'show_facebook': {'type': 'checkbox', 'label': 'Add Facebook', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_googleplus': {'type': 'checkbox', 'label': 'Add Google+', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_myspace': {'type': 'checkbox', 'label': 'Add Myspace', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_tumblr': {'type': 'checkbox', 'label': 'Add Tumblr', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_twitter': {'type': 'checkbox', 'label': 'Add Twitter', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_vimeo': {'type': 'checkbox', 'label': 'Add Vimeo', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_youtube': {'type': 'checkbox', 'label': 'Add YouTube', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'music_blogs_order': {
    'label': '<b>Music Blogs order</b>',
    'title': 'Order to display the External site links in the Music Blogs row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'hypemachine\nscnlog', 'section': ['', '<b><u>Music Blogs</u></b>']
  },
  'show_hypemachine': {'type': 'checkbox', 'label': 'Add The Hype Machine', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_scnlog': {'type': 'checkbox', 'label': 'Add Scnlog', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'cd_stores_order': {
    'label': '<b>CD Stores order</b>',
    'title': 'Order to display the External site links in the CD Stores row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16,
    'default': 'amazon\namazonau\namazonbr\namazonca\namazoncn\namazonde\namazones\namazonfr\namazonin\namazonit\namazonjp\namazonmx\namazonuk\nbigcartel\ncdandlp\ncdbaby\nebay\nmusicstack',
    'section': ['', '<b><u>CD Stores</u></b>']
  },
  'show_amazon': {'type': 'checkbox', 'label': 'Add Amazon', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonau': {'type': 'checkbox', 'label': 'Add Amazon Australia', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonbr': {'type': 'checkbox', 'label': 'Add Amazon Brazil', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonca': {'type': 'checkbox', 'label': 'Add Amazon Canada', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazoncn': {'type': 'checkbox', 'label': 'Add Amazon China', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonde': {'type': 'checkbox', 'label': 'Add Amazon Germany', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazones': {'type': 'checkbox', 'label': 'Add Amazon Spain', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonfr': {'type': 'checkbox', 'label': 'Add Amazon France', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonin': {'type': 'checkbox', 'label': 'Add Amazon India', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonit': {'type': 'checkbox', 'label': 'Add Amazon Italy', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonjp': {'type': 'checkbox', 'label': 'Add Amazon Japan', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonmx': {'type': 'checkbox', 'label': 'Add Amazon Mexico', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_amazonuk': {'type': 'checkbox', 'label': 'Add Amazon UK', 'default': false, 'title': 'Add the search link to OiNKPlus'},
  'show_bigcartel': {'type': 'checkbox', 'label': 'Add Big Cartel', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_cdandlp': {'type': 'checkbox', 'label': 'Add CDandLP', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_cdbaby': {'type': 'checkbox', 'label': 'Add CD Baby', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_ebay': {'type': 'checkbox', 'label': 'Add eBay', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_musicstack': {'type': 'checkbox', 'label': 'Add MusicStack', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'review_sites_order': {
    'label': '<b>Review Sites order</b>',
    'title': 'Order to display the External site links in the Review Sites row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'metacritic\npitchfork\nspin', 'section': ['', '<b><u>Streaming Sites</u></b>']
  },
  'show_metacritic': {'type': 'checkbox', 'label': 'Add Metacritic', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_pitchfork': {'type': 'checkbox', 'label': 'Add Pitchfork', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_spin': {'type': 'checkbox', 'label': 'Add Spin', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'general_order': {
    'label': '<b>General order</b>',
    'title': 'Order to display the External site links in the General row\nEach site should be a on separate line\nDo not change the spellings or they will not load',
    'type': 'textarea', 'rows': 8, 'cols': 16, 'default': 'googlesearch\nwikipedia', 'section': ['', '<b><u>General</u></b>']
  },
  'show_googlesearch': {'type': 'checkbox', 'label': 'Add Google Search', 'default': true, 'title': 'Add the search link to OiNKPlus'},
  'show_wikipedia': {'type': 'checkbox', 'label': 'Add Wikipedia', 'default': true, 'title': 'Add the search link to OiNKPlus'}
};
var customTrackersToAdd;
if (GM_getValue('custom_trackers') === undefined) {
  GM_setValue('custom_trackers', 0);
  customTrackersToAdd = 0;
} else customTrackersToAdd = GM_getValue('custom_trackers');
for (var i = 1; i <= customTrackersToAdd; i++) {
  sitFields['show_customtra' + i] = {
    'type': 'hidden', 'default': true
  };
  sitFields['addop_customtra' + i] = {
    'type': 'hidden', 'default': true
  };
}
var customExternalsToAdd;
if (GM_getValue('custom_externals') === undefined) {
  GM_setValue('custom_externals', 0);
  customExternalsToAdd = 0;
} else customExternalsToAdd = GM_getValue('custom_externals');
for (var i = 1; i <= customExternalsToAdd; i++) {
  sitFields['show_customext' + i] = {
    'type': 'hidden', 'default': true
  };
}
// +------------------------------------------------------------------------------+
// |                       end TRACKER / EXTERNAL SITE MENU                       |
// +------------------------------------------------------------------------------+

var gmc_opsit = new GM_configStruct(
  {
    'id': 'SitesMenu',
    'title': oinkplusIcon + ' Tracker/External Site Menu',
    'fields': sitFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      /*'open': function(doc) {//attempt to collapse toggleable section headers
        var sectionHeaders = doc.querySelectorAll('p.section_desc');
        for (var i = 0, len = sectionHeaders.length; i < len; i++)
          sectionHeaders[i].addEventListener('click', function() {
            var something = this.parentNode.children;
            var somethingelse = this;
            $('#' + this.id + ' ~ div').toggle();
            for (var i = 1, len = something.length - 1; i < len; i++) {
              var somethingSelect = '#' + something[i].id.toString();
            $(this ~ div).toggle();
            }
          });
      },//ended in failure*/
      'save': function() {
        valuesSaved = true;
        var config = this;
        config.close();
      }
    }
  });
gmc_opsit.init();
// +------------------------------------------------------------------------------+
// |                      init TRACKER / EXTERNAL SITE MENU                       |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                     EXTERNAL SITES ADVANCED SETTINGS MENU                    |
// +------------------------------------------------------------------------------+
var extData = [
  ['7Digital', 'sevendigital', 'https://7Digital.com/search/artist?q=%ARTIST%&f=17%2C16%2C12%2C9%2C2', false, '',
   true, 'https://www.7digital.com/artist/%ARTIST%', 'removeDiacritics\ntoLowerCase\n/[^\\w]/g, \'-\'\n/-{2,}/g, \'-\'\n/(^-|-$)/g, \'\'',
   '7Digital Group Plc is a publicly listed digital music and radio services platform. 7Digital offers both B2B services for digital media partners as well as 7Digital branded direct to consumer (D2C) music download stores. 7Digital\'s platform and API have been used to power digital music services for businesses like Guvera, Onkyo, Rok Mobile, Samsung, BlackBerry, and HMV. 7Digital\'s group companies Smooth Operations, Unique Production and Above The Title, produce independent content for broadcasters like BBC Radio 1, Radio 1Xtra, BBC Radio 2 and BBC Radio 3. 7Digital music download stores are available globally and have major label catalogue in over 40 countries. They also have a mobile web-store, smartphone apps for Android, BlackBerry 10 devices, Firefox OS, Windows and iOS.',
   'png', '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'],
  ['AllMusic', 'allmusic', 'http://www.allmusic.com/search/artists/%22%ARTIST%%22', false, '',
   false, '', '',
   'AllMusic (previously known as All Music Guide or AMG) is an online music guide service website, owned by All Media Network, LLC. AllMusic was founded in 1991 by popular culture archivist Michael Erlewine as a guide for consumers. Its first reference book was published the following year. When first released onto the Internet, AMG predated the World Wide Web and was first available as a Gopher site. In late 2007, Macrovision (now Rovi Corporation) acquired AMG for a reported $72 million.',
   'png', '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'],
  ['Amazon', 'amazon', 'https://www.amazon.com/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   'Amazon.com, Inc. is an American international electronic commerce company with headquarters in Seattle, Washington, United States. It is the world\'s largest internet company, based on revenue and number of employees. Amazon.com started as an online bookstore, but soon diversified, selling DVDs, VHSs, CDs, video and MP3 downloads/streaming, software, video games, electronics, apparel, furniture, food, toys, and jewelry. The company also produces consumer electronics-notably, Amazon Kindle e-book readers, Kindle Fire tablets, Fire TV and Fire Phone - and is a major provider of cloud computing services. Jeff Bezos incorporated the company (as Cadabra) on July 5, 1994 and the site went online as Amazon.com in 1995. Bezos changed the name cadabra.com to amazon.com because it sounded too much like cadaver. Additionally, a name beginning with "A" was preferential due to the probability it would occur at the top of any list that was alphabetized. Amazon has separate retail websites for United States, United Kingdom, France, Canada, Germany, Italy, Spain, Australia, Brazil, Japan, China, India and Mexico, with sites for Sri Lanka and South East Asian countries coming soon. Amazon also offers international shipping to certain other countries for some of its products. In 2011, it had professed an intention to launch its websites in Poland, Netherlands, and Sweden, as well. An Austrian website operates as part of the German website.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAARkSURBVFhHtVdLSyRXFO4fEYaQ1yoYskp8RXtUEkHBrAU3YXBUomgUYYgBdy50IWQWunDU2CEQp1VwoTGBtK1maMiDDGKMAZWBxOD4fratdnXX4+R8t6o6VZbVXRkqHxy76t5b5/vuOede7w3cxMXFxduXl5dN8Xj8gZ/GPhv4N8+gceLq6uqV8/Pz6YODA21vb492d3d9NfiEbxYxzWJeNmh1gPzk5OQvHkCSJJGmaeQ34BO+wcFcz/j9jkEfCPDMY+j4P4hvQlVVIYIjERXkyDlCA3VeAJFwwlGjo6MjOj4+pmQyKdq8TgDjmVNF5AMoOOTHy8enp6c0MjJCdXV1FAwGqaioSFh5eTk1NjbS3NwcybJsjHYHuFAXzH0/gArFSzbgg+XlZaqsrKTCwsKs1tnZKXKdCzs7O5RIJB54EoDBFRUVDrL8/HxHGwxRyhVR+AR3TgFw1NfXZyNAJMLhMK2urtLk5KRIgbW/trZW1EQ2eBYAR9XV1TaCxcXFzAzxOzo6ausvKyvLWQueBQBra2s0MzNDQ0ND1N/fL6rYBAREo1EqKCjICCgpKclZB/9JgAmQISKYHZbg+vo6xWIxIcoagdLSUv8FgHxzc5N6e3uppqaGiouLbaRW812Aoig0MDAg1ryVCGG3ht40XwVg5mNjYw6Sjo4OWlhYoO3tbbEBWYX4KoD/cQiHVvKenh7bMrtZhL4KWFpaspHDNjY2jF49QhMTE7Z+X1fB1NSUzTlsa2vL6NX3ifb29qxjboNnAbOzsw7noVBIzBwWiUQc/TCkCf1u8CwAS++mc6yGtrY2am1tdfSZhjHYqt3gWQBC3NLSciuJaVVVVdTV1WVra2hoID5rGF6ccBWgJU/xV38xgJXQ1NSUqXRzP8B7c3OzcHZ9fU319fWivbu7Wy9CpCl5RurOT6T8+T2pJyhe3fftAviD9A+fkrw6SpqM/f5fIYjEysqK2BMGBwdpfHxcrAbrcuQDBs3Pz2fa1L2nlP7uHqUjH1Nq+kOSQm+x32vR5x4BReIPWig1+YFQTaoihL0IRKEmnpOy9iWpR3+Q9DhImqr/l8xeAzxI/rmXpOE3KDXxPsm/DZMa52WlsRgBN0FoZ9JUgpS/Fykd/YSkL94k+elDkn8PCZ/mZLILAHiguh0jKVzGQl4XlgqXU/rJZ2JGylZUhFg9WCH1+Y+kPJsl+dfPKf3tRySN5enffP0eqTwOs0YaNCluONcFiCMZbizZDqXImcLqU4/vkvToVREV4fzRa3YbhnEfP6fGgyJqWvrKcMJRMZ8Z4MKkmfseIpCX+1jO4rgW1N1fRBhT39RxPjkyX73L9g4/3xVt6MMYDXXjmqbMsVxmAfoNiS8mT3BZsFa0O9gxooV64IIVhmcRQXdSE+DY399H/iOCHIASXJcgAuqybaEvCvg0Zo77xTpvUi8Z9Dp4wJ2zs7MwD1CRHxSJnwafh4eHMjgc5FbgusQRuY8KxQrxw+ALBZfJeQaBwD/EtTEAOD/fOwAAAABJRU5ErkJggg=='],
  ['Amazon Australia', 'amazonau', 'https://www.amazon.com.au/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   'Amazon Australia did not contain a music section as of the last script update, and probably won\'t return a useful result.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQpSURBVFhHtVdLS+RYGM1PmFVT9DzoVcPsyhfqqEwEBfeCW1sFRVFsmnHAXRa6cDe6sFvRwYVdKvRC281I+Whq0TMwiO24UBmYKRBf+H5WlUnq6+/cJJpUTCUzpA8c6+be5Dsn3/3uNVfKxeXl5ffX19ctFxcXr8Ikx2zi3+emjBs3NzdPz8/P3x0cHGT39/dpb28vVCImYrOJd2wmYsoagPjx8fG/h4eHlE6nKZvNUthATMSGxsnJyd/c9cSUlyR+8wQGvoRwLnRdFyY4E3EhjjlHauAuCGASQThrdHR0RJw5SqVSoi/oC+B+1tSReQkFh/kJ8vDp6SmNjIxQQ0MDlZeXU3FxsWBlZSU1NzfT/Pw8qapq3u0NaKEuWPuFhArFRT7ggdXVVaqurqaioqK87O7uFnPth93dXbq6unoVyABurqqqcokVFBS4+kBkyS+jiAltXwMI1N/f7xBAJmKxGK2vr9P09LSYAvt4fX29qIl8CGwAgWprax0CS0tL92+I39HRUcd4RUWFby0ENgBsbGzQ7OwsDQ8P08DAgKhiCzAQj8epsLDw3kBpaalvHfwnAxYghozg7bAENzc3KZFICFP2DJSVlYVvAOLb29vU19dHdXV1VFJS4hC1M3QDmqbR4OCgWPN2IaTdnnqLoRrAm4+NjblEurq6aHFxkXZ2dsQGZDcSqgH+xyEC2sUVRXEss9wiDNXA8vKyQxzc2toyR40MTU1NOcZDXQUzMzOO4GAymTRHjX2is7Mz7z2PIbCBubk5V/Dx8XHx5uDCwoJrHMQ0YdwLgQ1g6eUGx2ro6Oig9vZ215hF3IOt2guBDSDFbW1tj4pYrKmpoZ6eHkdfU1MT8beGGcUNTwPZ1Cn+GhcmsBJaWlruK93aD3Dd2toqgt3e3lJjY6Po7+3tNYoQ05Q6I333I2n//Eb6CYrXiP24AX7gbuUnUtdHKativ38wgkysra2JPWFoaIgmJyfFapAliWRZIUlSSJFlQbTRJ0tG25s87sqAlqa7hTbKTMvCNemaMOaFaFSh5AuFVliQK08QbfRFo8QiD8y9FiZyDQjoKqm/91H6zXeUmfqR1E9vSL/gZZVlMwIPhpTIVxz5mUG0bddK5BeH4MRErgkvAwC/tb6ToHSsgo18K5iJVdLdh59J2/iVtGSc9P0/A2fAauMXRu4N4MSS76M0q96S9tc4Zd7+QOnXX4usCEOvvxHEPPO0i4CKvCKINvpkyWg7Re1ZMDLw3P+znM1xLeh7f4ipybxvoPRbzsxE1AhiBo5EHkS8aDdiPMvgg8kHHBbs/2C8wWaQLdQDF6xlAOL8fUIvX9oF/GgawFkNxyWYwOdWvi00F/YMQDxfFh4tQgsc68nZ2VkMJxYUJTaKILQb8KNTHLQZsIDjEk4sODRghfhRbCYi0P+hTJ8BPT9PBCvDTQ8AAAAASUVORK5CYII='],
  ['Amazon Brazil', 'amazonbr', 'https://www.amazon.com.br/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   'Amazon Brazil did not contain a music section as of the last script update, and probably won\'t return a useful result.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAQmSURBVFhHtVdNSBtdFJ1ll12V8n1tcVXorv6hVqURFFwWBLdWBa2iCKWWunOhUJe6sCpaXNio0IXWTSX+lCzaQhFrXah88FUQDeJP/E/izOT2nTsZfZPJJFM6PXCSzLw395x3330v85RknJycPDg7O6s/Pj5+7iVFzFrxfT8hY8f5+fk/R0dH73d3d+OhUIh2dnY8JWIitjDxXpi5nZA1APGDg4OfogNFo1GKx+PkNRATsaEhtP4T17cS8ooiRh5Ew98QToau62xCZCLA4phzpAbu3AAmEURkjfb29mh/f58ikQjfczsA9BeaOjKvoOAwP24ePjw8pMHBQaqurqaioiLKy8tjlpSUUF1dHc3MzJCqqonezoAW6kJoP1VQobhIBzywtLREZWVllJubm5ZtbW0815mwvb1Np6enz10ZQOfS0lKbWHZ2tu0eiCxlyihiQjujAQTq7u62CCATfr+fVlZWaGJigqdAbq+qquKaSAfXBhCooqLCIjA/P381QnwPDQ1Z2ouLizPWgmsDwOrqKk1NTVF/fz/19PRwFZuAgUAgQDk5OVcGCgoKMtbBbxkwATFkBKPDElxbW6NgMMim5AwUFhZ6bwDiGxsb1NXVRZWVlZSfn28Rlem5AU3TqLe3l9e8LIS0y6k36akBjHx4eNgm0traSnNzc7S1tcUbkGzEUwPij4MDyuKdnZ2WZZZchJ4aWFhYsIiD6+vriVYjQ+Pj45Z2T1fB5OSkJTi4ubmZaDX2iZaWlrR9UsG1genpaVvwkZERHjk4OztrawcxTWh3gmsDWHrJwbEampubqampydZmEn2wVTvBtQGkuLGxMaWIyfLycmpvb7fcq62tJfGukYhih6OBeOQQn8ZFAlgJ9fX1V5Vu7ge4bmho4GAXFxdUU1PD9zs6OowixDRFwqRvfybt/4+kH6B4jdipDYgHLhdfkLoyRHEV+/21EWRieXmZ94S+vj4aGxvj1aBkKaT4UvNmpcFUbUw8a8uAFqXL2UaKTfjYNekaG3MCB+q08uZrhV59VCgUNojfuJfcj59NNsDQVVK/dFF04B7Fxh+T+n2A9GOxrOLCDOPakGxAFv4SzuKV8HrqKXqlNuJoABCj1reCFPUXCyN3mTF/CV1+ekna6lvSNgOkh75xEFkYYouLPiFO5POJK3HrxsOfbMhmBAZwYkn3UhpXL0j7MUKxd48o+uZfzgobenOH+eTZtbDJrKxFFoYBGDEoPqQ+eAbPIgP3M7+WC3OiFvSdrzw1sQ/VFH0nMjP6MK0B0wS+R0fFD6nPlQFAHEw+4bAg/8E4Q5hBtlAPomCdpkAWhyHHKQBwVsNxCSbwupVuC00GB0lThBg5fluE5SI0IURvhcNhP04sKEpsFG4oGzApG0kpbFI2YALHJZxYcGjACsnEP9uIFPoFsnxGBn8/F/4AAAAASUVORK5CYII='],
  ['Amazon Canada', 'amazonca', 'https://www.amazon.ca/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAARBSURBVFhHtVddTCNVGO3TPhijDxqykVVjYjbok/wFWEAlQsI7Ca8IJBAISLIRE15WTMCER3hglwb8ZVvQjeFnTcQCbvqgJoawiAYQd5eVACH8tfy1pTM93nM77c60M+1srCc5befeO985893v3s51JOL4+PiN09PTRr/ffz2TFDHrxfdVTSYZZ2dnL/l8vju7u7uRnZ0dbG9vZ5SMydjCxB1h5rImGwXFDw4OHokBCAaDiEQiyDQYk7GpIbTWxXWWJu9wiCf3suP/EE6EqqrShMiER4pzzpkaurMDmmQQkTXs7e1hf38fgUBAttl9AI4Xmioz72DBcX7s3Hx4eIihoSHU1taipKQEBQUFkmVlZWhoaMD09DTC4bA22hrUYl0I7fcdrFBepAJvWFhYQEVFBfLz81Oyo6NDznU6bG1t4eTk5LotAxxcXl6eJJabm5vURjJL6TLKmNROa4CBent7DQLMhMvlwtLSEsbGxuQU6PtrampkTaSCbQMMVFVVZRCYm5uLPyG/nU6nob+0tDRtLdg2QCwvL2NiYgKDg4Po6+uTVRwDDXg8HuTl5cUNFBUVpa2DpzIQA8WYET4dl+DKygq8Xq80pc9AcXFx5g1QfG1tDT09PaiurkZhYaFBVM+MG1AUBf39/XLN64WYdn3qY8yoAT758PBwkkh7eztmZ2exubkpNyC9kYwaEH8cMqBevLu727DMEoswowbm5+cN4uTq6qrWG82Q2+029Gd0FYyPjxuCkxsbG1pvdJ9oa2tLOcYMtg1MTk4mBR8ZGZFPTs7MzCT1k5wm9lvBtgEuvcTgXA2tra1oaWlJ6ouRY7hVW8G2Aaa4ubnZVCTGyspKdHZ2Gtrq6+sh3jW0KMmwNBAJHPIzeqGBK6GxsTFe6bH9gNdNTU0y2Pn5Oerq6mR7V1dXtAg5TYEjqFs/Q3n4A9QDFm80trkBccPFTx8ivOREJMz9/okRZmJxcVHuCQMDAxgdHZWroeiZS/jgxWfjvPHxjZTUj+W9yRlQgriYaUZo7F3pGqoijVmBgf7OuRynElHi9H/nxumPdw1t+rG817wG1DDCv/QgeOsVhNzvIHz/FlS/WFYiQBRPDFkZCP55Hw9zXpMMrf3xlAYI8dTqphdBV6kw8rJkyFWGi3sfQVn+DMqGB+rOb6YGfO7P4bs7hfUrz0uefD8F3zdfmxvgiSXVS2kkfA7l9xGEbl9D8Ga2zIo0dPOKpJmBx9fy8eB1re3NbDzIycbjt4stM3A1/Wu5MCdqQd3+VU5NaKoWwdsiM1+8ZWrgn+r3sP7qC/E2/mabqQFCHEzu8bCg/4OxhjDDbIlgEAVrZiBm4q+s5yQfaeKWBnhW43GJJvi6lWoLTYSVgb1PP4HvSyeOx7+Sv1MaIIRo1tHRkYsnFhYlNwo7tDJAshj930aLL0b9WIOBGHhc4omFhwaukHT8bxvRJfwLyfmYizsmtAgAAAAASUVORK5CYII='],
  ['Amazon China', 'amazoncn', 'https://www.amazon.cn/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPRSURBVFhHtVdLSxtRGJ2f0JWUvuhK6K6+UJtIFRTcC9lqFBRFEaQW3GWhC5e68BG0uNCo4ELrphK1kkVbKGJtFiqFKoiKaOI7mTiPr/fczJiZjEnGdnrgZJi5d75z7ne/ezNXSMfl5eWr6+vrpouLiy4nyWJ62TVfk7Hi5ubmyfn5+dzx8bF6dHREh4eHjhIxEZuZmGNmHmuySUA8Eonssg4kiiKpqkpOAzERGxpM6xe7z9PkBYGNPISG/yGcDkVRuAmWiSAXx5wjNXBnBzCJICxrdHJyQqenpxSPx/kzuwNAf6apIPMCCg7zY+flaDRKo6Oj5PF4qLy8nIqLizndbjc1NjbS4uIiSZKk9c4MaKEumHaDgArFTTbghfX1daqqqqKioqKs7Ozs5HOdCwcHB3R1ddVlywA6V1RUWMQKCgosz0BkKVdGERPaOQ0gUF9fn0kAmQgEArS5uUkzMzN8CoztdXV1vCaywbYBBKqpqTEJrKys3I0QV7/fb2p3uVw5a8G2ASAcDtP8/DwNDQ1Rf38/r2IdMBAMBqmwsPDOQGlpac46eJABHRBDRjA6LMGtrS0KhULclDEDZWVlzhuA+M7ODvX29lJtbS2VlJSYRI103IAsyzQwMMDXvFEIaTemXqejBjDysbExi0hHRwctLy/T/v4+34CMRhw1wP44eECjuM/nMy2z9CJ01MDq6qpJHNze3tZakxmanp42tTu6CmZnZ03Bwb29Pa01uU+0t7dn7XMfbBtYWFiwBB8fH+cjB5eWliztIKYJ7Zlg2wCWXnpwrIa2tjZqbW21tOlEH2zVmWDbAFLc0tJyr4jO6upq6u7uNj3zer3EvjW0KFZkNKDGo/hN3mjASmhqarqrdH0/wH1zczMPFovFqL6+nj/v6elJFiGmKX5GysEXkn9/IiWC4k3Gvt8Ae+H28zuSNv2kStjvU0aQiY2NDb4nDA4O0uTkJF8NlYJAvr8k3rVmQBbpdqmFEjOV3DUpMjeWCQhEOiu1a8Oj1LMsxLv314AikfS1l8SRF5SYfkvSjxFSLtiyUpkZjpQhbgDCE0x0l9GnCdgwkdkAwEat7IdIDLiYkeeciYCbbtfekxz+QPJekJSj76kM6AZeasJ2DeDEku2jVJViJP8cp8TUGxKHn/KscEPDzzjvDEAQ4sjGA6cgP/dnOTPHakE5/ManJvHRQ+IUy8zE65SBvyA3ALCDyRoOC8Y/mMxgZpAt1AMrWEcM4KyG4xJM4HMr2xaaDkcMAEw07+zsLIATC4oSG4UdOmZAB45LOLHg0IAVkov/thEJ9AdN+Dh+5wMkvQAAAABJRU5ErkJggg=='],
  ['Amazon Germany', 'amazonde', 'https://www.amazon.de/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPISURBVFhHtVdLSxtRGM2vkNLXUuiuvlCbSCMouBeytTGgKIogteAui7hwqQutwZQuNEZwoXVTiVrJoi0UsWkWKoU2EJIgGjU+8nBm8vWem0RnMnmMcXrgKDP33u+c+93v3sw1FOLi4uLF1dWVLR6Pj+pJFtPK/tfmZNS4vr5+fH5+vnJ0dJSJRqMUiUR0JWIiNjOxwsw8yslmAfFYLPaXdaBUKkWZTIb0BmIiNjSY1m/2XJOTNxjYzH1o+B/ChZAkiZtgmfBycaw5UgN3WgCTCMKyRsfHx3RyckLJZJK/0zoB9GeaEjJvQMFhfbQMPj09pbm5ObJYLNTa2kqNjY2cJpOJent7aX19nQRByPUuDWihLpj2GwMqFA/lgAG7u7vU3t5ODQ0NZTkyMsLXuhLC4TBdXl6OajKAzm1tbSqxuro61TsQWaqUUcSEdkUDCDQxMaEQQCbcbjf5/X7yeDx8CeTt3d3dvCbKQbMBBOrs7FQIbG1t3c4Q/51Op6LdaDRWrAXNBoBAIECrq6s0MzNDk5OTvIrzgAGv10v19fW3BpqbmyvWwb0M5AExZASzwxbc398nn8/HTckz0NLSor8BiB8eHpLD4aCuri5qampSiMqpuwFRFGlqaorvebkQ0i5PfZ66GsDM5+fnVSLDw8O0ublJoVCIH0ByI7oaYD8cPKBc3G63K7ZZYRHqamB7e1shDh4cHORasxlaWlpStOu6C5aXlxXBwWAwmGvNnhNDQ0Nl+xSDZgNra2uq4C6Xi88c3NjYULWDWCa0l4JmA9h6hcGxGwYHB2lgYEDVlif64KguBc0GkOL+/v6iInl2dHTQ2NiY4p3VaiX2rZGLokZJA5nkKf5mH3LATrDZbLeVnj8P8NzX18eDJRIJ6unp4e/Hx8ezRYhlSp6RFP5K4p/PJMVQvNnYxQ2wATdf3pLgd1JGwHl/ZwSZ2Nvb42fC9PQ0LSws8N3APqoeRlUGxBTdbPRT2mPmrkkSubFSKBr0Piw0wCEJJHxzUOr9c0ovvSbh53uS4mxbZZgZjjtDRYPeh0UNAGzWUshHKbeRGXnGmXab6GbnHYmBDyQGvSRFf5CZBbFXSYzFR6m13EdpRkiQ+MtF6cVXlJp9wrPCDc0+5UQgNpWqiLHIQG3lz3JmjtWCFPnOlyb9yUKpRZaZjy8fbgBgF5MdXBbkPzClwcwgW6gHVrB2Mwtmr44Yyw3grobrEkzgc6vcEVoIO4JRdcRYbgBgojVnZ2du3FhQlDgotFA3A3nguoQbCy4N2CGVaGZpRKBqaDYb6B9ovzF+fnpAXwAAAABJRU5ErkJggg=='],
  ['Amazon Spain', 'amazones', 'https://www.amazon.es/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAP4SURBVFhHtVdLSxtRGJ1fIaWvpdBdfaFWpREU3AtuNQqKoghSC+6y0IVLXfhCiwuNCi60bhriI2TRFopY60Kl0ASCivh+JnFm8vU7NxOdyeQx1emBk2Hmzv3Oud/97s1cKRmXl5dvrq+vmy4uLrrsJMd08jVXkzHj5ubm+fn5+fzh4WHs4OCA9vf3bSViIjabmGczzzTZOCB+cnIS4BcoEolQLBYju4GYiA0N1vrN9zmavCTxyP1o+B/CyVBVVZjgTHiFOOYcqYE7K4BJBOGs0dHRER0fH1M4HBbPrA4A77OmisxLKDjMj5XOp6enNDo6SnV1dVRaWkqFhYWC5eXl1NjYSEtLSyTLsvZ2ekALdcHaDRIqFDeZgA7r6+tUWVlJBQUFGdnZ2SnmOhv29vbo6uqqy5IBvFxRUWESy8vLMz0DkaVsGUVMaGc1gEB9fX0GAWTC7XbT5uYmzc7OiinQt9fW1oqayATLBhCourraILCysnI/QlzHxsYM7WVlZVlrwbIBYGtrixYWFmhoaIj6+/tFFScAA16vl/Lz8+8NFBcXZ62DfzKQAMSQEYwOS3B7e5v8fr8wpc9ASUmJ/QYgvru7S729vVRTU0NFRUUGUT1tN6AoCg0MDIg1rxdC2vWpT9BWAxj5+Pi4SaSjo4OWl5cpFAqJDUhvxFYD/MchAurFXS6XYZklF6GtBlZXVw3i4M7OjtYaz9DMzIyh3dZVMDc3ZwgOBoNBrTW+T7S3t2d8JxUsG1hcXDQFn5iYECMHPR6PqR3ENKE9HSwbwNJLDo7V0NbWRq2traa2BPEOtup0sGwAKW5paUkpkmBVVRV1d3cbnjmdTuJvDS2KGWkNxMKn+I3faMBKaGpquq/0xH6A++bmZhHs9vaW6uvrxfOenp54EWKawmek7n0l5c8XUk9QvPHYqQ1wh7u1DyRvjlFMxn7/YASZ2NjYEHvC4OAgTU1NidXgkCRyPZLoa86AEqE7TwtFZx3CNamKMJYOCESPJPqmrgFVJvlbL0VGXlN05j3JP0dIveBlFWMzAg+GXA4O5noc0Td9EfKo1ZCfIu4yNvJKMOoupzvfR1K2PpES9JJ68IOXGwejOAMBvq5J5OPAgQbtXmtLRfTFR6kz00dpTL4l5dcERaffUWT4hciKMDT8UlBvwOdj0Um+Njh4hC5xrxdMpjDAGcjN/lnO5rgW1P3vYmqin+soMs2ZmXxrzIAQl2jS1UABh4N8urZUFAYAPpj4cFjQ/8GkB5tBtlAPXLCmDCDtXFyYAksZAHBWw3EJJvC5lWkLTUaqIoR48rNUFEWYAIvmnJ2duXFiQVFio7DCJy/DZOC4hBMLDg1YIdn4tI1Ior+EQnEx4H1MygAAAABJRU5ErkJggg=='],
  ['Amazon France', 'amazonfr', 'https://www.amazon.fr/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPBSURBVFhHtVdLSxtRGJ1fIaWvpdBdfaE2kUZQcC+4tTGgKIogteAui7hwqQutwZQuNIngQuumErWSRVsoYtMsVAptIKiIz/hIJs7j6z03E81k8pjieOBkmLl3vnPud797M1fIx8XFxYurqytXIpEYspIsppNdKzUZI66vrx+fn58vHB4eqgcHB7S/v28pEROxmYkFZuaRJpsBxE9OTv6yDiSKIqmqSlYDMREbGkzrN7uv0OQFgY08jIaHEM6HoijcBMtEiItjzpEauDMDmEQQljU6Ojqi4+NjSqVS/JnZAaA/01SQeQEFh/kx8/Lp6SlNT09TR0cHNTY2Um1tLafdbqeuri5aXl4mSZK03sUBLdQF034joEJxUwp4YXNzk5qbm6mmpqYkBwcH+VyXw97eHl1eXg6ZMoDOTU1NBrGqqirDMxBZKpdRxIR2WQMINDo6qhNAJvx+P0UiEQoGg3wKctvb29t5TZSCaQMI1NraqhNYW1u7HSGuXq9X126z2crWgmkDQDQapcXFRZqcnKSxsTFexVnAQCgUourq6lsD9fX1ZevgvwxkATFkBKPDEtze3qZwOMxN5WagoaHBegMQ393dJY/HQ21tbVRXV6cTzaXlBmRZpvHxcb7mc4WQ9tzUZ2mpAYx8ZmbGIDIwMECrq6sUj8f5BpRrxFID7I+DB8wVd7vdumWWX4SWGlhfX9eJgzs7O1prJkOBQEDXbukqmJ+f1wUHY7GY1prZJ/r7+0v2KQTTBpaWlgzBfT4fHzm4srJiaAcxTWgvBtMGsPTyg2M19PX1UW9vr6EtS/TBVl0Mpg0gxT09PQVFsmxpaaHh4WHdM6fTSexbQ4tiRFEDauoUv5kbDVgJLpfrttKz+wHuu7u7ebBkMkmdnZ38+cjISKYIMU2pM1L2vpL85zMpJyjeTOzCBtgLN1/ekhTxkiphv78zgkxsbW3xPWFiYoJmZ2f5ahAEB6NbR4fDzWtAR4eD3IKgo4PRmAFZpJuVHkoHHdw1KTI3VgwZUVzvyPSMwMO8jjBRuAYUiaRvHhLfP6d04DVJP9+TkmDLSmVmOO4MPYwBgI1aiYdJ9NuYkWecab+dbjbekRz9QHIsRMrBDxbnngZwYin1UapKSZJ/+Sg994rEqSc8K9zQ1FNOKzJQWf6znJljtaDsf+dTk/7UQeIcy8zHlyzOPQ0A7GCygcNC7h9McTAzyBbqgRWsJQZwVsNxCSbwuVVqC82HJQYAJlpxdnbmx4kFRYmNwgwtM5AFjks4seDQgBVSjvfbiAT6B8ZdizDEXhtSAAAAAElFTkSuQmCC'],
  ['Amazon India', 'amazonin', 'https://www.amazon.in/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPjSURBVFhHtVdLSxtRGJ2f4KqUvnAldFdfqE2kERRcCoJbEwOKoghSC+6y0IU7deELLS40ieBC66YStZJFWyhiUxcqhSpIIqLxrUmcmXy952aimcwkmdrxwEmYuXO/c+53v3tnrpCOi4uL11dXV87z8/MuM8liOth/gSKjxfX19bOzs7O5w8PD+MHBAYVCIVOJmIjNTMwxM08V2QQgHg6Hd9kDFI1GKR6Pk9lATMSGBtP6za6fKPKCwEbuR8NjCKdDlmVugmXCx8Ux50gN3BkBTCIIyxodHR3R8fExRSIRfs/oAPA805SReQEFh/kx0vnk5ITGxsaooaGBKioqqKSkhNNqtVJTUxMtLi6SKIrK05kBLdQF07YLqFBcZAM6rK+vU1VVFRUXF2dlZ2cnn+tcCAaDdHl52WXIAB6urKzUiBUWFmrugchSrowiJrRzGkCgvr4+lQAy4Xa7KRAIkNfr5VOQ2l5fX89rIhsMG0CgmpoalcDKysrdCPE/Pj6uardYLDlrwbABYHNzk+bn52l4eJj6+/t5FScBAz6fj4qKiu4MlJWV5ayDfzKQBMSQEYwOS3Bra4v8fj83lZqB8vJy8w1AfGdnh3p7e6m2tpZKS0tVoqk03YAkSTQ4OMjXfKoQ0p6a+iRNNYCRT0xMaEQ6OjpoeXmZ9vf3+QaUasRUA+zFwQOmirtcLtUySy9CUw2srq6qxMHt7W2lNZEhj8ejajd1FczOzqqCg3t7e0prYp9ob2/P+oweDBtYWFjQBJ+cnOQjB5eWljTtIKYJ7Zlg2ACWXnpwrIa2tjZqbW3VtCWJZ7BVZ4JhA0hxS0uLrkiS1dXV1N3drbrncDiIfWsoUbTIaCAeOcFv4kIBVoLT6byr9OR+gOvm5mYe7ObmhhobG/n9np6eRBFimiKnJAe/kvTnM8lhFG8itr4B1uH2y3sSA+MUF7Hf3xtBJjY2NvieMDQ0RNPT03w12PLzyGXLfxDRV5sBKUq3Sy0U89q4a5IlbiwTEIj9PIjoq18Dskjit16Kjr6imOcdiT9HST5nyyrOzHDcG3ocAwAbtbzvp6jbwoy85Iy5rXS79oGkzY8k7flIPvhBLnsd0dqULgfqXJx6bSD64qPUke2jNC7ekPRrkmIzbyk68pxnhRsaecGJ9a6HgYFdFfWAvshAQe7PcmaO1YIc+s6nJvapgaIzLDNTb/7fAMAOJms4LKS+YDKDmUG2UA+sYG12NpdrLl3m1dk59dpA9OUGcFbDcQkm8LmVbQtNh2ATSHA9kOibBBN9cnp66saJBUWJjcIITTOQBI5LOLHg0IAVkotCvhLoIcwX6C+VWYq0/AaO1AAAAABJRU5ErkJggg=='],
  ['Amazon Italy', 'amazonit', 'https://www.amazon.it/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPCSURBVFhHtVdLSxtRGJ1fIaUvuhK6qy/URmkEBfdCtj4CBkURpBbcZaELl7rQGkzpQpMILrRuKlErWbSFItZmoVJoA8EE0cR3Hs5Mvt5zM9GZTB5THA+chJl75zvnfve7d+YK+bi4uHh5dXVlPz8/HzaTLGY3+69UZPS4vr5+fHZ2tnR0dJSJRqMUiURMJWIiNjOxxMw8UmSzgHgsFvvLOlAqlaJMJkNmAzERGxpM6ze7rlDkBYGNPICGhxDOhyzL3ATLhJ+LY86RGrgzAphEEJY1Oj4+ppOTE0omk/ye0QGgP9OUkXkBBYf5MfJwPB6n2dlZstls1NjYSLW1tZxNTU3U09NDq6urJIqi0rs4oIW6YNpdAioUF6WAB7a3t6mlpYVqampKcmhoiM91ORweHtLl5eWwIQPo3NzcrBOrqqrS3QORpXIZRUxolzWAQOPj4xoBZMLj8dDu7i75fD4+Ber2jo4OXhOlYNgAArW1tWkENjY2bkeIf5fLpWm3WCxla8GwASAYDNLy8jJNT0/TxMQEr+IcYMDv91N1dfWtgfr6+rJ18F8GcoAYMoLRYQnu7e1RIBDgptQZaGhoMN8AxA8ODmhsbIza29uprq5OI6qm6QYkSaLJyUm+5tVCSLs69TmaagAjn5ub04kMDg7S+vo6hcNhvgGpjZhqgL04eEC1uNPp1Cyz/CI01cDm5qZGHNzf31dasxnyer2adlNXweLioiY4GAqFlNbsPjEwMFCyTyEYNrCysqIL7na7+cjBtbU1XTuIaUJ7MRg2gKWXHxyrob+/n/r6+nRtOaIPtupiMGwAKXY4HAVFcmxtbaWRkRHNve7ubmLfGkoUPYoayCTj+M1eKMBKsNvtt5We2w9w3dvby4MlEgnq7Ozk90dHR7NFiGlKnpJ8+JWkP59JjqF4s7ELG2AP3Hx5S+KuizIi9vs7I8jEzs4O3xOmpqZofn6erwbhhUCCVUtrl5XXgIZWdk8QNLQy6jMgpehmzUFpn5W7JlnixoqBizq1dG45lVYVmAligmrCROEakEUSv41R6v1zSnvfkPjzPcnnbFllmBmOO0MPYwBgo5bDAUp5LMzIM860p4lutt6RFPxAUshPcvTH/Q3gxFLqozQjJkj65ab0wmtKzTzhWeGGZp5ympGByvKf5cwcqwU58p1PTfqTjVILLDMfX93fAMAOJls4LKhfMMXBzCBbqAdWsKYYwFkNxyWYwOdWqS00H6YYAJhoxenpqQcnFhQlNgojNM1ADjgu4cSCQwNWSDnebyMS6B+k6HTYPVbYKwAAAABJRU5ErkJggg=='],
  ['Amazon Japan', 'amazonjp', 'https://www.amazon.co.jp/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPpSURBVFhHtVdLSxtRGM1P6KpIX0uhu/pCrZFGUHAvuLUaMCiKILXgzkVcuKsufKGlC40KLrRuGuKLLNpCEWuzUCnUQEiCaBLjK4kzk6/33GR0HnmMdXrgSzJz73zn3HO/ezPXosX5+fnLy8tLezwe7zczWM529l2apdHj6urqydnZ2fLx8XE6HA5TKBQyNZATuZmIZSamJEubAcgjkcgR60DJZJLS6TSZDeREbnAwrt/s+nGW3mJhI/ei4X8QayFJEhfBnPBwcsw5rIE6I4BIJGGu0cnJCZ2enlIikeD3jA4A/RmnBOctKDjMj5GHo9EoTU1NUWtrK9XW1lJlZSUPq9VKHR0dtLa2RoIgZHvnB7hQF4z7rQUViotCwAM7OzvU0NBAFRUVBaOvr4/PdTEEg0G6uLjoNyQAnevr63VkZWVlunsIuFTMUeQEd1EBSDQ8PKwigBMul4v29vZocXGRT4GyvaWlhddEIRgWgERNTU0qgo2NjdsR4nt6elrVXldXV7QWDAsAfD4frays0Pj4OI2MjPAqlgEBHo+HysvLbwVUV1cXrYN7CZABMjiC0WEJ7u/vk9fr5aKUDtTU1JgvAOSHh4fkdDqpubmZqqqqVKTKMF2AKIo0OjrK17ySCLYrrZfDVAEY+czMjI6kt7eX1tfXKRAI8A1IKcRUAeyPgydUkg8NDamWmbYITRWwubmpIkccHBxkWzMOLSwsqNpNXQVLS0uq5Ai/359tzewTPT09BfvkgmEBq6uruuSzs7N85Ai3261rR2Ca0J4PhgVg6WmTYzV0d3dTV1eXrk0O9MFWnQ+GBcBih8ORk0SOxsZGGhgYUN1rb28n9q6RzaJHXgHpRBSfmYsssBLsdvttpcv7Aa47Ozt5suvra2pra+P3BwcHM0WIaUrESAp+JfHPF5IiKN5M7twC2AM3W+9I2JumtID9/k4InNjd3eV7wtjYGM3NzfHVYLPZ+Hz/S+BZvQNikm7cDkot2rhqkkQuLB+QKCfCR0STHzKB3zmAZ3PXgCSQ8M1JyckXlFp4Q8LPSZLibFmlmRiOO0E5BWxtEZU8IrJYMoHfuKdBfgEAG7UU8FLSVceEPOeRclnpZvs9ib6PJPo9JIV/6AVgtEpypQiNE1wATiyFXkrTwjWJv2YpNf+akhNPuStc0MQzHjoBsFxLLgfaFJAdKC3+Ws7EsVqQQt/51KQ+t1Jynjnz6dXDBQDsYLKNw4LyDyY/mBi4hXpgBasTcN8pAHBWw3EJIvC6VWgL1UInALhPEcpgpI9jsZgLJxYUJTYKI5FTAIDRwnKEZuQyVAJk4LiEEwsODVghxeJhG5GN/gINnfWgc7N/5AAAAABJRU5ErkJggg=='],
  ['Amazon Mexico', 'amazonmx', 'https://www.amazon.com.mx/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   'Amazon Mexico did not contain a music section as of the last script update, and probably won\'t return a useful result.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAPnSURBVFhHtVdLS9xQGM2vkNIXXQnd1RdqVRpBwb3g1hcoiiJILbibhS5c6kKraOlCRwUXWjeVUUdm0RaKWOtCpVAFURHfz5kxyXz9zp2MJpNJJsV44ExI7s13zv3ud+/kSsm4uLh4fXV1VX9+ft7uJTlmLV8zdRkrrq+vn56dnU0dHBzE9vf3aW9vz1MiJmKziSk280SXjQPix8fHW9yBIpEIxWIx8hqIidjQYK0/fJ+hy0sSjzyEhscQToamacIEZyIgxDHnSA3cuQFMIghnjQ4PD+no6IjC4bB45nYA6M+aGjIvoeAwP25ePjk5ocHBQaqqqqLCwkLKzc0VLC4uprq6OpqdnSVFUfTe9oAW6oK1ayRUKG6cgBeWl5eptLSUcnJyHNnW1ibmOh12d3fp8vKy3ZUBdC4pKbGIZWVlWZ6ByFK6jCImtNMaQKDu7m6TADLh9/tpdXWVJiYmxBQY2ysrK0VNOMG1AQQqLy83CSwsLNyNENehoSFTe1FRUdpacG0AWFtbo+npaerv76eenh5RxQnAQCAQoOzs7DsD+fn5aevgvwwkADFkBKPDElxfX6dQKCRMGTNQUFDgvQGIb25uUldXF1VUVFBeXp5J1EjPDaiqSr29vWLNG4WQdmPqE/TUAEY+PDxsEWltbaX5+Xna2dkRG5DRiKcG+I9DBDSK+3w+0zJLLkJPDSwuLprEwY2NDb01nqHx8XFTu6erYHJy0hQc3N7e1lvj+0RLS4tjn1RwbWBmZsYSfGRkRIwcnJubs7SDmCa028G1ASy95OBYDc3NzdTU1GRpSxB9sFXbwbUBpLixsTGlSIJlZWXU0dFhelZbW0v8raFHscLWQCx8gt/4jQ6shPr6+rtKT+wHuG9oaBDBbm5uqLq6Wjzv7OyMFyGmKXxK2u43Uv9+Je0YxRuPndoAv3AbfE/K6hDFFOz390aQiZWVFbEn9PX10ejoqFgN0iuJJNlMuUYWNWCizM8kyUSZac2AGqHbuUaKTsjCNWmqMGYHIeoz07fk01sNYBPEgkbCROoa0BRSvndR5ONLio6/I+XXR9LOeVnF2IzAvaHHMQDwqLWdEEX8RWzkhWDUX0y3Sx9IXftE6naAtP2fjgZkPe1bwaC9AZxYnD5KY8oNqb9HKDr2liIDz0RWhKGB54J2BmpQB2wA84xrkO9TGuAMZKb/LGdzXAva3g8xNdEvVRQZ48x8fmNrAIUo+2RhBLTNAMAHkyUcFox/MPZgM8gW6oEL1nEKdBNBpykAcFbDcQkm8LnltIUm48FFmACLZpyenvpxYkFRYqNwQ88MJIDjEk4sODRghaTjwzYiif4B1oFZPHSFSXEAAAAASUVORK5CYII='],
  ['Amazon UK', 'amazonuk', 'https://www.amazon.co.uk/gp/search?ie=UTF8&keywords=%ARTIST%&index=music', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAQlSURBVFhHtVdLSyNZFK6f0KtGpnsaVw2za1+oozIRFFwKgltfoCiK0rQD7mqh0O7Uha2iQxYaI/RCx01L1JEsZgYGUceFSsMoiIr4iO8kVlVOn++mSqtSeVSTmg9O6tZ9nO+75557U1dKxM3NzU93d3ct19fX79009tnEz7c6jR339/c/XF1dfT49PY2dnJzQ8fGxqwaf8M0iPrOYHJ02DpBfXFzscweKRCIUi8XIbcAnfIODub7y+0udXpJ45kE0/B/EidA0TYjgSAQEOdYcoYE6J4BIOOGo0dnZGZ2fn1M4HBZ1TieA/sypIfISEg7r42Tw5eUljY+PU319PZWWllJhYaGw8vJyam5upsXFRVIURe+dGuBCXjB3o4QMxUs6YMD6+jpVVlZSQUFBWuvu7hZrnQlHR0d0e3v73pEAdK6oqLCR5eXl2epgiFKmiMInuDMKgKOBgQELASLh8/loa2uL/H6/WAJze11dnciJdHAsAI6qq6stBCsrK08zxHNiYsLSXlZWljEXHAsAtre3aX5+nkZHR2lwcFBksQEICAQClJ+f/ySguLg4Yx58lwADIENEMDtswZ2dHQoGg0KUOQIlJSXuCwD53t4e9ff3U01NDRUVFVlIzea6AFVVaXh4WOx5MxHCbg69Ya4KwMwnJydtJF1dXbS8vEyHh4fiADILcVUA/3EIh2ZyWZYt2ywxCV0VsLq6aiGH7e7u6q3xCM3OzlraXd0Fc3NzFuewg4MDvTV+TnR2dqbtkwyOBSwsLNicT01NiZnDlpaWbO0wLBPaU8GxAGy9ROfYDR0dHdTe3m5rMwx9cFSngmMBCHFbW1tSEsOqqqqot7fXUtfU1ET8raF7sSOlgFj4Er/xFx3YCS0tLU+ZbpwHeG9tbRXOHh4eqKGhQdT39fXFkxDLFA6RdvQnqf99Ie0CyRv3nVwAD3j84wMpWxMUU3DePwtBJDY2NsSZMDIyQtPT02I3eHJeUE+PTLm5MkmS58k8nkaSJUkYyuY2SWqk2lqZ67lsi4AaocelNor6PUI1aaoQlgo9NbX800ihj0M0NEQsZI0JZE7CNeKCMJRRJ0leJt6nTf+GGCMnEyCgKaT81U+RsTcUnf2FlM0x0q55W8VYjMCzoPhsnp0aQrzefZOA/aR9cnM5MkkFADxr7TBIEV8ZC/lRWNRXTo9rv5K6/RupBwHSTv6Jh5pnCJLNTR63wyRjQxQKcVkXIMqmeq+XxBixNLixpPsojSkPpP47RdGZnyny6ZWIihD06bUwrLFB9L2GsYjA28yf5SyOc0E7/lssTfT3eorMcGS877IXAPDFZA2XBfMfTGqwGEQL+cAJm/USALir4boEEfjcSneEJiLrJDTApC9DoZAPNxYkJQ4KJ5b1NkwErku4seDSgB2SybI6iHJe0DcKHnsUO/9EFgAAAABJRU5ErkJggg=='],
  ['Bandcamp', 'bandcamp', 'http://bandcamp.com/search?q=%ARTIST%', false, '',
   false, '', '',
   'Bandcamp is a privately held company founded in 2007 by former Oddpost co-founders Ethan Diamond and Shawn Grunberger, together with programmers Joe Holt and Neal Tucker; providing an online music store launched in 2008, as well as a platform for artist promotion, that caters mainly to independent artists. Artists who use Bandcamp are provided with a customizable microsite where the music they create can be uploaded and shared. All tracks can be played for free on the website and users are most often provided with the option to purchase the album or a specific track at flexible prices. The site also allows for artists to offer free music downloads with the option to donate to the artist or to receive a free track or album by joining the artist\'s email list. Other options include sending purchased music as a gift, viewing lyrics and saving individual songs or albums in a wish list. These options can be toggled by the artist depending on how they plan to price their music. The options provide smaller and independent artists with a free online presence for their music, while making the process of selling their music easier. Uploading music to Bandcamp is free, but the company takes a 15% cut of sales made from their website (in addition to payment processing fees), which drops to 10% after an artist\'s sales surpass $5000. Bandcamp\'s website offers user with access to an artist\'s page featuring information on the artist, social media links, merchandising links and listing the artist\'s available music. These options can be toggled and customized on the artist\'s page allowing artists to change the look of their page, and to customize its features. In 2010 the site enabled embedded/shared links in other microblogging sites such as Facebook, Twitter, WordPress, Google+, and Tumblr with options for email. In 2013 Bandcamp launched mobile apps for iOS and Android devices, with compatibility for Blackberry 10 devices through app sideloading, providing the ability to download music straight from the app and allowing access to artist pages which have been optimized for mobile viewing.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNkNENTcxOTBGMjA2ODExQTk2MUFFOUU1QjE3OEVDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MTA0NzhDRTY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MTA0NzhDRDY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIi8+IDwvcmRmOkRlc2NyaXB0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'],
  ['Beatport', 'beatport', 'https://www.beatport.com/search/artists?q=%ARTIST%', false, '/%26/g, \'%2526\'',
   false, '', '',
   'Beatport is an online music store specializing in electronic music and culture. Beatport is a privately held company owned and operated by Beatport LLC and based in Denver, Colorado with offices in Los Angeles, California, San Francisco, Tokyo, Japan and Berlin, Germany. It was founded in 2004, and in 2013 bought by Robert F. X. Sillerman\'s company SFX Entertainment, for a reported price of slightly over $50 million. Its annual revenue for 2012 was reportedly around $15-18 million, with losses of $2 million.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABONJREFUeNq8V0tsVFUY/s69dzqvPmg7pSStdDSUYCu1C9oSEhvExChsjERCYmOmxkQi0YibxhUSFwY3LlBkRSvaRCHEGKXdGITEGGrFVFSCxcgU2kUfUzrtPNqZe+/x/GeenbkzbXQyf/LPnbnnP//3/Y/zGIakNJ7o8XnrjJNtjYa33s1R7zJRSglEFATCDLdnVb9/UT01+9HYEL1n9NH6btfgkc4q39GeZ1BXvVO+ZSit8OTH4vIkvvn1e3w2Hhq6+8F4P2t8u9v3+j518MWup2CyAMJrfuhmCLoRKikBTa2EplTCbfdC4fUY/ulHXBjX+9W257Z93b9v25Y47iG4Oom4EYZhxgVZVlIln+Q7HJsRAS7BW1uLm1PBTq3VY3gNtoRILCh4qiiHRGKLYMwAYWs1Toa4GYailgc8JabAJGytxi7aTdFg8s1NDEcV/DHpxD/TFeveP9YcwxM7o3A7N7l6FKDGHodmckWAaxvazwU0fHmlBldvVBa1O7A3hKOHgthar2+cBW4QARUmihP44YYLZy7UbiowIkj65isP8fTeyAYEdGhcZIDz4vX/9ur6qB9t1tHdsQa32KxcTo75gIqfb9lxbzoTyFdXqrG/Z6343iCwBQFWlMAnX1TBP22T39tb4zhyMCyfufLSwQj+vGvDxRG3fM4JUh9/vgXH+1aKEBBNyE1FMrGSa2N2kX6HjOR4X2gdcytp22HgvbeWk8Qr5dyWJgOH9q9aExDYikkZEOs/V8NRDUOX3fA2G/AdXrW0KaZv9EXl3EsjLunLyoawRfhiGVJEWUrpuzjiEBMZunbrcDnybUjHf6uQajVGSnPJB/kin/k2VILkVpmS+UUFA6ddciLJpVE72loNmd5cOTvslM/zHfnnxu2/VTmXZOSaHdfHKnB6IIKGOjPrgBIZ4DklGL9lS4Nn19y6TEyqZRly+oTsyPd6G0kgfSqnmedLYjwSYZiaVgp29XyASZvsOblZyfZJ2JKAbAW5HEVEEWZ5ltPY2eEKDHzoEOnU5O/s5eQXxGiMbBJZtdjGIyyNk8BEYh9gjBrETLIsHOGe3SZ++V3FpwSCWPq9f0bB+2cqEBFpJptCku2bMJMl4FCYlj63G+q4ZQlorLfHwLGXE5vQueHMYZQCpzGySTR1fiZbmngaR2ISdsJ9hpk1gYz0dmdIpM/3FHi3UXSu28mzQkpgygwwRUlVGo+3GgVudBnt7dYFYKYE9J3e5drlSsJ3YowwCVvjaTY8WWcDl0dtOfD5DgnQk1zTbTtMC8rcooeMtB/ZhJBNaEIhNiwR+Xaxfb7zGsfUjJpVFlFXZhaICJYdT6U8/Hwsq/6G8K2nbSUmp4sAEWCKYJQB2NMRE/r/rlwN9aYgUPhSQpiELUpgiB/UmUZZ74QpTG0tboorM+0FXKakLODiDkqYy1FBYD5kghsMNtWBNX2lLAQ0xSUxl1fFKri/aPqXgmFvw1YPYkawLATcFR7Mz4VB2CpvbwyqZviFXU3NqHLXirrEZW04j1us6/+uTDSdw1Yt/gu0IBa147uxO5h4EDsh98vtxzoHn213+w48uQsNHg9UVVwUtNL+PdV1EZYhLrALCxi9eQfX/woP3T830Z9G8bza6WusxslHarm3ygGQllJWVhP64CHzzy7j1ML5Cfn3/F8BBgD35aA+vllSYAAAAABJRU5ErkJggg=='],
  ['Big Cartel', 'bigcartel', 'http://www.google.com/search?q=site%3Abigcartel.com%20%22%ARTIST%%22', false, '',
   false, '', '',
   'Big Cartel - Founded in 2005 to help our co-founder sell his band\'s merch, Big Cartel is now home to over 500,000 independent artists worldwide, and growing like crazy. Like our stores, we are designers, musicians, crafters, painters, and technology nerds, spread across the globe. Our team is small but mighty, and we love what we do.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAShSURBVFhHvZdbKG1bGMeHe657u9vk8uASik1u2wNLnFwKodxPdq6lLMrJPccjRwo74kHZtR0eiFJSknbqdDjTOQ/ECw+oQYfcI7l85xtzz7UW07DWsrXPv/4Pa441xu8bc4zxjW8SpoWFBeOpqanqurq6vyorK2lFRQUtKSmhHz8W0cLCQpqTk0OzsrJoWloaTUlJpgkJCTQ2NpZGR3+g4eHhNDg4mAYEBFAfHx/q5eVF3dzcqLOzM7Wzs6M2NjbU3NycmpqaUmNjY2pgYPA3IhvR5iJ8cHDQpK+vb768rBzGxsZgenoaJiYmYHR0FD4PDwO2Q09PD3R0dEBbWxvUN9SDUqmEsrIywOAAA4OUlBSIi4uDqKgoeB/8Hvz8/AADgXcu7wCDACsrKzAzMwNDQ0NApMoC2oJMTk7+UlpaCrOzs7rh9S+Bu2iDq/wbqa2t/Wfky5dH8GG94JkIT1bDcRlEuKenF7jIZo6vnwdnFghbbx58Z2dH/M2FZyI8GeEKHlwzc0tLS6ipqYHu7m4enFkgOCjlzfzi4gKYlpaWoKGhQQ3PRHgywhUKhQzu+QgeEREBKysr4hhDQ0M8OLNAiouL6dPX3q4OgOns7Aw+ferVDbe1A9z90NnZCbe3t1JvHQEUFRXRh/D29nbxtZ+fn0vdNVpeXob8/HyIjOTPPCMjA7a2tqR/a6Q1AByQyuFszXkBMF1eXkJXVxcEBgaq4f7+/uIRfk4tLS08OLNAsrOzqRyuVFaJr12bVldXIT09Haqrq+Ho6Eh6+lQzMzOAyYgHZxYIrit9DFcCywu6AtCl3d1dyMvL40EfWiCpqam0re1X9cwZvKCgAE5PT6WhXqa7uztxP9nb24uQxMREaGpqkoNVFkhSchKtr6+DqioNnO327wlgY2MDYmJixMEdHBxgZGQE7u/vtW/C+Ph4Koezo/aSAK6vr8UltLCwALxsAE8WHPx7ILXqOAUYMZXD2Tk/OTmRumsXS1R4E4oD4m0Ic3NzUotGWgOI+hBFv8EzEJ4EithYPOeRegXANuqbN2/AxMQEGhsb4ebmRmp5LK0BhIWFUQZPSmJwhQgPCgrSK4Dt7W2Ijo6G9fV16QlfWgNAGGVwLDDUcF9fX9jf35e6Py+Wbtkm06X+/n4enFkgmMVYdQORERq4p4cnLC4uSt1fL5ZbOHBmgXh7e9PHcA+8UFxgYGBA6v56sZqBA2cWCOZzqoJ7iHBnsLW1Baz7pO6v08HBgbhJOXBmgbi6ulI5nBUSrJJht99r1draygOrLBAnJycqh7MSiiUUltVYav1ebW5ugrW1NQ+sskAQykroJ3DVn1iW1Geny8VuyJCQkIcwngWCEVLbt2+/wU0ew1XOzc2F4+NjaWjdWltbE+sF+TgcC4R9NPBmLre7uzuMj49LCL6urq6gublZWxUst0BM8IvluZnzzMquvb09CanR/Py8eJJ4fbRYIEZGRuxzidf4rFmF09vbK27Qw8NDKC8v13sCMgsEO/7BadDLoaGh4OjoyG3T03+iyc8PHvzfrkOL6kXz/vAjPYo2Rqv1E/oz+it65QeZjf07OgONIuQ/QybBz76OsmEAAAAASUVORK5CYII='],
  ['Bleep', 'bleep', 'https://bleep.com/search/query?q=%ARTIST%', false, '',
   false, '', '',
   'Bleep Limited is a British online music store focusing on the independent music sector. Created by Warp Records and launched in January 2004, Bleep was one of the UK\'s first legal music download businesses and the only one to originate from within the music industry. The store offers single track or whole album DRM-free mp3 and WAV downloads alongside vinyl records, CDs, DVDs, T-shirts and other merchandise. Since its launch, the range of music offered by Bleep has grown and now provides music from independent labels including Rough Trade, Domino, Beggars Banquet, One Little Indian, XL Recordings, Ninja Tune, Stones Throw, Hyperdub, Planet Mu, Tempa, and many more. In addition, a large catalogue of rare titles has been acquired from many small labels from all over the world.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMzRGMjgwNzUwNzYxMUUzOENBRUI1MTJEM0Y4QjMzNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMzRGMjgwODUwNzYxMUUzOENBRUI1MTJEM0Y4QjMzNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzNEYyODA1NTA3NjExRTM4Q0FFQjUxMkQzRjhCMzM1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIzNEYyODA2NTA3NjExRTM4Q0FFQjUxMkQzRjhCMzM1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gSYwrwAAAdFJREFUeNpiNDe3PsDAwKAMxDIM9AVPgPguywBZzgCzk2mALIc7golhgMGoA1gIKag80UTQkP///jH8+PSD4e3jNwwPT99juLDxLMOnlx/pFwKMTEwMnAJcDDK6cgzWSQ4MaSvzGDRddAYuClg5WBn8m0IYJDSkBi4NgELFMMCE8jSADn5+/ckwLaAPRYxHhIfBtcibQcFUCUVcVFmc+g5g+P+f4cfn7yhCIP6hWXsxHEDXNMDMwowh9vjCQ+qHACMTI4OAtCCKGK8oH4NzgSeK2LcPXxnOrDpBfQewcbEzZK4txKvm04uPDOurVzJ8fv1pYHLBn99/GPjE+QeuHBCSFWYIbAtnMA41p34U/P7+i2FN2XIUMQ4+DgYVK3UGXW8DFHGHLFeGa7suM3z/+I16Dvj39x/Dg9N3McRv7L3KwMzGzKDlqotIL5xsDOoOmuC6gS5R8Oj8AwwxQWB00C0NCEoLYc22NC8HQFlTyVyFwTjEDEP9hyfv6V8OINoJ/xnuHr81cC2i8xtOM3x8/mFgHHB52wWGPf3baVAb4sqef/4yfHj2AVgBPWC4vP0iw2MsOQJrmgL2jP6PNstHvAOeDKD9T0AOuDtAjgB3zwECDADaL4gW9nGVswAAAABJRU5ErkJggg=='],
  ['Boomkat', 'boomkat', 'http://boomkat.com/products?q%5Bkeywords%5D=%ARTIST%', false, '',
   true, 'https://boomkat.com/artists/%ARTIST%', 'removeDiacritics\ntoLowerCase\n/[^\\w]/g, \'-\'\n/-{2,}/g, \'-\'\n/(^-|-$)/g, \'\'',
   'Boomkat - A specialist music website brought to you by a dedicated team who have been operating in this field for over 7 years now - building up a huge resource of information and opinion about music that exists beyond the radar. Our product extends to cover the most underground forms of Electronic music, Hip Hop, Post-Folk, Alt.Country, IDM, Electro, Acoustica, Post-Rock, Ambient, Micro House, Detroit Techno, Mentalism, Electropop, Indiepop, Grime, Free Jazz, Modern Composition, Cologne Techno, Future Disco, Drone, Sublow, Soundtracks, Noise and out and out post-generic objects of wonder.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzhBOUNGNjcxRjUyMTFFMUE1RTRDNkJBODFBMjQ2Q0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzhBOUNGNjgxRjUyMTFFMUE1RTRDNkJBODFBMjQ2Q0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OEE5Q0Y2NTFGNTIxMUUxQTVFNEM2QkE4MUEyNDZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3OEE5Q0Y2NjFGNTIxMUUxQTVFNEM2QkE4MUEyNDZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv9ew7UAAAP+SURBVHjatJdpSFRRFMfPvLmjlrYJfagox7CCaIGIEoJog760fxAtmyW1zT6VFvQh8WPpGFGo0TKmaWBBhC30IaigNIgyRdqgpn2xbDGdeaPv3e65M296M/PebE5/vD7ve/ee37nnnnfu0wB+1ThbbOPGjqmYmDnBPCotDUanpUIyNegRwe3xQG/fD9ev3/2Ve+2bGwIPTzRfct552En7B91UpvS/NmTcf9xNkYlsg+Nss23R/LnOhXNmsZ4BJEkGNhDYz4hkK9kCDaeaA31mGgT2y2gUAI23d/bA456ndmFsRkbFDPNUGJYoiN5hdmUOyOhA4g3hTaeb+VW5hzbRto9BYXZONiCbZI4fZ04hJnZT0l3Nth1b4ezJpojP1Wo6fR5woY3saikuDJuLLGQim6SmpLCQyyBQQdN40U5LwNCZ+kbeD1XjqfNAjIZAf/Gyxfz64PYD/sxS4purFjKRzRwwsf0x8DCFw61sNU2wZEUu3LvVAVuZE9gnRiHi/iNY7cj07Jww+8hENmFbown3iQZgS1bmcsNoVAFoSYGqnSmwb9ZkIJvwJImS0XrAUFiksVoMZBMlS+OReo+jjVPGaDH8DshxOxANHArXd0BmOcA2YkepPeGCo5UTyr3gCITPRTZzQIYLzpawh+fazkGtozZuuDpCarislYQyvv4J1lz1KmORXtVM2IHQVeq9FdGcIvJIT52Y4FSzEMk8AnJyHIj2ZoSGHgs3soVkRUDLCSUqVCcHZF4H5OQ5ELoVkeoA9UeA4Kn0v6BqWlgO+E9EQkewBdFKcv+gB4p32aOVYprUxHOLXrBttwb6x2rqE3sNrWutEaudWt4hiX8rKDrqqA86cvXEkxDLoZ7UToSu2DssQWHRln/Q6vqIB49aOVMnwcfePl6KifqU0PqYUJxQnmdlZUOeNd/3v0RVXcxQRTOmTYaXbz/C5ImZ0Hj5+r8twMNH63NKHQnUtYs3wFFVGxd0X/luPmdm1hR48eYDn/fpWx/cvNsOxCuKkG8rgNeuV0GTsqaxlVrydZMnVpXtL4W21iv87+eu974DSBD4lzGyiej18l2orqmGsr1lQZOrDp+Iy4HyA3vC7ilw5Yo225/cgaULlgOyye8/Ay5Jksxa33DxvKAIv+qHqDUvdx50dXTBmrz1cITBO7ruwqrc1fDl23dAtjDodlduyivRPcFiaeUHSsPgCEb54Ov4yk3EyOFuFvruZy8B2XzQoaN1zoZLbZRNom6Pm7cNBRvp176fURuOUwUsqKE95e/1+Rvou8+99FHPC3qm9QpFplKSuQ5WHbelpaZWZKSnm1NMBEwmU1IPqaGhIVawhuHPwIDLI4qVosHV4ChzwF8BBgApiWk4tODWVQAAAABJRU5ErkJggg=='],
  ['CDandLP', 'cdandlp', 'http://www.cdandlp.com/en/search/?a=%ARTIST%', false, '',
   false, '', '',
   'CDandLP.com enables you to buy and sell musical items at fixed price proposed by different sellers either private or professional. CDandLP.com does not sell anything, it\'s a marketplace, and we are intermediary of payment and third-party during the whole ordering process between buyers and sellers. You can easily find the music you like with the search engine and the categories. You can also register your wants list, we will inform you as soon as the wanted items are listed for sale on CDandLP.com',
   'png', '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'],
  ['CD Baby', 'cdbaby', 'http://www.cdbaby.com/Search/%ARTIST%/2', false, '',
   false, 'http://www.cdbaby.com/Artist/%ARTIST%', '/ /, \'\'',
   'CD Baby, Inc. is an online music store specializing in the sale of CDs and music downloads from independent musicians to consumers. The company is also a digital aggregator of independent music recordings, distributing content to several online music retailers. CD Baby is one of the few sources of information on physical CD sales in the independent music industry.',
   'png', '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'],
  ['Deezer', 'deezer', 'http://www.deezer.com/search/%ARTIST%', false, '/%26/g, \'%2526\'',
   false, '', '',
   'Deezer is a web-based music streaming service. It allows users to listen to music content from record labels including EMI, Sony, Universal Music Group, and Warner Music Group on various devices online or offline. Created in Paris, France, Deezer currently has 35 million licensed tracks in its library, over 30,000 radio channels, 16 million monthly active users, and 5 million paid subscribers as of 6 November 2013. The service is available for Web, Android, Kindle Fire HDX, OS X, BlackBerry, iOS, Windows Phone and Symbian.0',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKNSURBVFhH7dfvSxNxHAdw/4p6Hj2ydjftrt3Nu1UTIirBSItl5s+VurTNprPpbE1xM9ZkaitTKyVMk9iTIRkUpYjSk7IQeuCTwp4UZESE0IN3uyuaH08RJLaCPXhxx32+3Pd9n+99H3wzMllev4vhopk6bjl+RTL8niuqzJ2h3KwuJlk0I5lfvpYyt9KBdYvJkg6QDpCUAN7xSfTNvyOKXT61lpQAjuvD6IhNEQU1TrW2pQDNJ2ux0PGQeGDvWnes4tJwFOGZBcJS71FrWwrgLKjCnPceMWQLrDtWcbFvBFcfzxEnal1q7f8M8NeXINcoYdpl1eCyDZqXKRzHz+J5yx1ioLodzb5KjMe8hMtTtvlPeEiSseS3axg4QTO54kqRA++vTRCxhgiCvXWYnQ8TgS7b5tvwgJCDCUepxkYdsOWXI9YYIborPXC6S3B31E3YG4thC95E6+gEkW+tU9+lBjgsm/A15NTYqAP+Mw1Y7n1GPG0eRE9/PV4v3iBCkQvxlk9jaPEzUdry66dVA+xjsjDG7NA4dYzD2G2RGOwRYWXzMcLaiQBbhrLzInxhiSipFrHXFYQYuk9kWaoSAY4wLFZ02zWazvFYWZKJD28kdLLl+KaPEFN6D9p6JDx6ZSYuhyTIIzMwv/hC8M7ORACZycYAs1OjMI/DQLdIhAMCSpg83GJriFb2NIqsIpr8EmGpEMDb2yC09xNZhRWJAEfjHYBum4a7mgc+ysSntxKCbAV+6PuIWb0XHREZTxbMhLIM8tgccl9+J5RlSXfgTwAmTtkJa2Vz8ef7eUI28eAYASbGRBiZHHACDzFeX22PgYfOaIZOPkjs5qVEgFRKB0h9gH/haJbiw2lKj+e8/if7hYp3VOy3mwAAAABJRU5ErkJggg=='],
  ['Digital Tunes', 'digitaltunes', 'https://www.digital-tunes.net/search/%ARTIST%', false, '',
   true, 'https://www.digital-tunes.net/artists/%ARTIST%', 'removeDiacritics\ntoLowerCase\n/[^\\w]/g, \'_\'\n/_{2,}/g, \'_\'\n/(^_|_$)/g, \'\'',
   'Digital Tunes - The best download store on the planet for underground dance music: from Drum & Bass and Bass Music to House and Techno. Cheapest WAV/FLAC/ALAC prices in the universe. Pay with Bitcoin, Credit Card or Paypal.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEVSURBVFhHY/j//z8y1gDi40BMKwAyG2QH3E4YgwWIS4D4OxDTGoDsANmF4gCQAL0B2BEgy0FBQg+fowOQnRoM1o7Of01t7P4Tg7fv3AnRCgUuVzb8t7m8jmzsfHnDXwZsFuHCS1eshFoNAdgMJRUPLQf4h4b/T83O+V9WXUN7B8yaOw+MscmBMAgc+fjs/5a391Fwwq09WC0CiaOrBenH6YDrN2+CMTY5EMYFyu8fw+oAkDg2MOqAUQeMOmDUAaMOGHXA4HUAMdUxNkA1B2DDsAZJQWk5VDsmoKkD0Jtk2MDQcwAlzXJsoOPxWawOaHp0CqoCBZwf6I6JwaDomoHwgHdOYRgUHeeBmFYAZLYBEEPt+88AAP0oK7ZzU1r5AAAAAElFTkSuQmCC'],
  ['Discogs', 'discogs', 'https://www.discogs.com/search/?q=%ARTIST%&type=artist&strict=true', false, '',
   false, '', '',
   'Discogs, short for discographies, is a website and database of information about audio recordings, including commercial releases, promotional releases, and bootleg or off-label releases. The Discogs servers, currently hosted under the domain name discogs.com, are owned by Zink Media, Inc., and are located in Portland, Oregon, US. While the site lists releases in all genres and on all formats, it is especially known as one of the largest online databases of electronic music releases, and of releases on vinyl media. Discogs currently contains more releases than there are English-language Wikipedia pages, at 5 million releases, by 3.4 million artists, across over 600,000 labels, contributed from over 195,000 contributor user accounts - with these figures constantly growing as users continually add previously unlisted releases to the site over time.',
   'png', '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'],
  ['eBay', 'ebay', 'http://www.ebay.com/sch/i.html?_nkw=%ARTIST%&_sacat=11233', false, '',
   false, '', '',
   'eBay is an American multinational corporation and e-commerce company, providing consumer-to-consumer sales services via Internet. It is headquartered in San Jose, California, United States. eBay was founded by Pierre Omidyar in 1995, and became a notable success story of the dot-com bubble; it is a multi-billion dollar business with operations localized in over thirty countries. The company manages eBay.com, an online auction and shopping website in which people and businesses buy and sell a broad variety of goods and services worldwide. In addition to its auction-style sales, the website has since expanded to include "Buy It Now" shopping; shopping by UPC, ISBN, or other kind of SKU (via Half.com); online classified advertisements (via Kijiji or eBay Classifieds); online event ticket trading (via StubHub); online money transfers (via PayPal) and other services.',
   'png', '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'],
  ['eMusic', 'emusic', 'http://www.emusic.com/search/artist/?s=%ARTIST%', false, '',
   false, '', '',
   'eMusic is an online music and audiobook store that operates by subscription. In exchange for a monthly subscription eMusic users can download a fixed number of tracks to their MP3 players per month. eMusic was established in 1998, is headquartered in New York City with an office in London, and is owned by Dimensional Associates.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAYHSURBVFhHlVdbSBdpFB/NtLxlkZpZamZZKmrK4t1uhmiptV182NDyIZ8VHyRkK7fdAjOXQquH7WYlJosikqCua6xEdxHNB80VcQ2SxPVGadbZ+R1n5v/N/EdzD/xg5vvObc53zvnOSAqlyPhNBi0FTk5OFBsbSwcPHmTEx8fzmhnvAiiSESeDKVXGjAwzRlNERUVRRkaG5gCQmJhoyrsIJmQEypB+VRaWDKNxYP/+/eTo6GjKvwgKZFhvrF27lrKysujEiRO0atUqq/3U1FQ2mp2dTSdPntQccHBw0PG5ubnR8ePHmcfd3V23J8DyYmtrS5mZmTQ6OkoqdXR00Pbt20UB2rdvH1VUVNC9e/cY5eXlHBWRBzLd3d2KFmKdR48e1fEosLzga/v6+hQRCz1+/JhWrFih8TU1NdGrV6+oqqqKHXj58iXD3t5e44GMkcbHx8nZ2VnjUWB5QehF+vTpE719+5YaGxspLCxMy/QvX74oHBaamJggf39/5tm0aRM9efKE+vv7WYdI4eHhmj0Flpc1a9awl6C5uTlqbm6m+/fvc4iPHDlCe/bsYQOTk5PMIxLktm3bRklJSZSenk7Xr19nWeiYnZ1VuIh8fHxE44DlZfny5VRWVsbGBwcH6cGDB3Tnzh0qKCjQsj0wMJDOnz9Pnz9/VlTOO3v16lXeUyskLy+Pbt++zcc0PDzMTly5coVsbGxE44Duhc8oJyeHbt26RRcuXKBTp07RoUOHNAd27NjBPPn5+dTb28s5U1hYSK6urnxMKh9kIAsdyJPc3Fyz8wesFhienp6UlpamKQQQ2i1btpjyA1u3bmUeUebAgQOcW2b8CkwXuSTxtaKynTt36qrBCPSB3bt362QiIyPNwi5i/uxXr17NSQgD69at416P9oqsxZchw8GnCnpKdhRt60yxMjzkZxtlHTx+fn4sgw+ADtwVXl5erBs2YEsrWSziy9Dd0M0OHz5ML1684KxGafX09FBAQIBmGPC3caC/HENoyDmS/pHRLj/7SJYewDyyw2hiqBjoefr0KTci2AASEhLmoykmDoyXlJRQXV2drn7RZMQE+n1lIP3rGqXDn47BZKfs4+vQqFRC36ivr+cKExMal5q0a9cubQEe3rhxgx4+fEgfPnxQxImGhoZ0yTfi8p2VA4jEBmn+iFDraj8B4RklXVlZqXMACSvhjEQHrl27RjU1NTQ2NqaIEw0MDOgaCEJvdOBv5wjOC+x7eHjoPmBqaor7AfqC6ACOXULCqKWDzbNnz1Jra6uu3SIqqArVgR/tN1g5UOrgqyUiUFpaqkgTff36ldrb2+nMmTOacYBzC4rRQhEJHEdERARdvnyZnj9/zrh06RJnrVhKrjbL6Cf7jfSHYxC1ymf/i4MPrZQs+9AJGchCx7Nnz/g5OjqaEx62YNPOjiM2L4TyUcsMxqBg/fr1FBcXx9cvBFFKKr+tDFfJltxkZ5YJxhF+GIBMTEwMeXt781ygRlC0o0B70AGZvHfvXl3IUlJS2DEzfgA1jhITZdCYjIOKAaaLnHTGtgqEhoZqPKh1hBLPiFpISIgVP3SIkTOBfgGTTEtLC08zd+/epXPnzvGUpCpEZwwKCqK2tjYlxYgTLDg4mJ1T+Y4dO0bFxcV8m+JmffToEcsZ7cmwvGCoVCvg/fv32sSD61dVjMg0NDRYDSWvX7/mQUSNGqoJstXV1TQyMsL8nZ2dumpSYHnBrTUzM6OoJHrz5g3V1tZyb8A9j96OzDUaB6Hdqv0fuYLrHLJdXV1chiqpRyZA74BIEJyenuZWjGxWvVcnonfv3jEwkKDboWqQC4gkwg5Z0Tho0ZEMgjgrI2EkE/lwJPg6hBjAM5qVyHPx4kV2TCQMqoseAbB582ZWCPr48SNfTsZJBqV1+vRpunnzJrfXoqIiSk5O1jUrFxcXllVHN1xGqBpRjwKrBQZmgoX+dP7PnxGu3G9NRPg9MttYEOqfkdGBbzQcM3wvg/9SJ5WFJQHZLs6LeDb+PS0BwzJ8ZTAFyPhZhhmjFXDWvr6+PNVg3EL9myTXYvhBxkZJkqT/AJD8RFdJrfbdAAAAAElFTkSuQmCC'],
  ['Facebook', 'facebook', 'https://www.facebook.com/search/pages/?q=%ARTIST%', false, '',
   false, 'https://www.google.com/?q=%ARTIST%+Musician%2FBand&as_q=site%3Afacebook.com', '',
   'Facebook is an online social networking service headquartered in Menlo Park, California. Its name comes from a colloquialism for the directory given to students at some American universities. Facebook was founded on February 4, 2004, by Mark Zuckerberg with his college roommates and fellow Harvard University students Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes. The founders had initially limited the website\'s membership to Harvard students, but later expanded it to colleges in the Boston area, the Ivy League, and Stanford University. It gradually added support for students at various other universities and later to their high-school students. Facebook now allows anyone who claims to be at least 13 years old worldwide to become a registered user of the website, although proof is not required.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAOLSURBVFhH5Zf5TxNBFMeX+Jv+H8ZEf9Oo0HIZUUyUGBOkBzdisEgwCCIYUBCIIomGa7ccFQtqueQURBQUBESwHCJHOUUICOWSQzCY58yyFNquwoY1aPwmn/6yb9777szsdB5hKNOzifvMJKSrUEzK+EQgIT2EIuoQQYAJU0pfQoek3ZaO8tc34l/Ay7oeaO0agQ+aUd6obuyHGEUVHHVLaTN1SDBjyq7IVCzfc8orTduGAiem5kGR2wgB0SXgG1nEC5dvPYWEh3XweWSaRuKvWjQVJR5hyhOEhZR6i12q24fhhOd9EEqoP4K1SzKUvdHAyPhXsD2nGNp/Ur6TMBeTB0Njy2FyeoGX4uZSCryu50Fcei2kF6hBiZBn1tOzgJ9bOiVB94AWkrPfgZmIciTQj89z5EqZrzZKxhX34Bzo+aQFNuF9tRoXSVVAR+8YoI0ZSwhEZJD64zAE3y3TS8YVqb8K5haWmHLGelat0cU6XckC7eQ8NqBYMYDWHm+69Qm5UqMeYEqxq6iyQxcr8nsMWrTZeTNg45YKy8s/mFIrGh2fhbS89/T6Y/zX5efdAJ5+QwXGlLLGYng3gNfUUJ4hT1hjMbwbcP4vDeAkVQ39NI1tQ0zZNTWhnKvPMZSqXm/slg3gN+Si8ppu3dhtMVBY0a4buy0GVCUturG8GLCTKSEuoxbiEY+Km5kya8oqbdU9x8jC8nVjsQH8t78lA+v5Jz/Dv28G8F3QQipnHbARXA24BmXrG8CHBj4oZOEF9Ll+5mIG2KLbkbVzMmsCQ35nAF10wcY9FewuKOk39wzJg/DECuMZwAZ8IoqM8L5ZCOdD88D9Wi64XM0GR1RM4p8J4ssqlHCFgDulTNk1RclfoZ1fwJqT1QD5CwObARczVIyimjUWY2wAXcmSsxtYgzcDVwM4XmcAdSs++JzGdza24M3A1YCyoAk6+8bATELFEQJp0uEw9AXMzC7Sa8k2YCO4GPCNKoZB1Jzg5kcgJp1xX2KCdmpjR+8X2lVANHcTEWQlzM4v6XE7pcoo7hIqXtc8CGMTc6gHSRuxcVTuojsj3JCelimnOvvGYWrmG32DjUet1L0HNbwQi5qUnLI2uiPCOAVmfjcXJx6ni69KIIrfa+WUVB8lr6QbyS5kRtPPD12I+pZB2sgxj1SNwIG0YsoaC3VKBxBeQjHlxycCCeUtFCdY2ttn7WBKIRHET6FyW6fa52ppAAAAAElFTkSuQmCC'],
  ['fnd', 'fnd', 'https://fnd.io/#/search?mediaType=artists&term=%ARTIST%', false, '',
   false, '', '',
   'Experience the App Store and iTunes Anywhere with fnd.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURT61STy0Sj21Sz62Sz21TD61TT62TGu9M2++MG++Mmy+NG++N26+PnG+PUC1SUK2SUG2SkC2S0W2SES2SUW2Skm2SEm3SU24R0i4SUy4SE24SVG5R1a6RVS6Rla6R1C4SFK6SFS6SFm6RVm7R1y7RF68RF68RV68Rly8R2G8RGC8RWG8RmW8RGa9RmS9SGq9Q2m9RGi9Rmm+Rm++Qm2+Q22+RHC/QXC+QnC/Q3C/RHPAP3fAOXXAP3nAMXnAMnjANHnANnzBNXjAO33EOXLAQnLARHTAQHXAQXXAQnXAQ3XCQnXARHfCRHnBQXnBQnrCQHnCQ37CQX3CQn3CQ33CRHzEQnjCTXvETnzESoPDP4XDP4jDP4nEP4HDQIDDQYHCQoDCQ4bDQITDQoTFQIXEQoXGRYPGSofHSITGTIXIT4rEQIjEQYjEQo3GQofHUILHWoTIXJTOZpbPb5jPbJjQbJrRdJjRd5zScZ7Sd57SeKXWgqbXiq7ajbrfn7zfnbzfoL7gocDhpsTksMjmtsvnutPrxuHw1eLx1+f03ur14uv14+z25u336PD47PL57/T68PX68vf79Pf89Pr8+Pz++vz+/P3+/f7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHeuP3kAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHKSURBVDhPfdP5X9JgHMDxr2geZYIKKFgqAqEcWsbMq9Qcslwqj8MDbLLZuubR4VGplR1WpqmVbv+u35HpTLb9+v48z/N9ttdgXpbl2TlJkmYygsBxXCJxn2VjsQ6KolpvRCLNID+YEtOimOJ5nhAyMsQwDE23R6PRluvhcLgpBDJ6Op1K8dOEjCaH4/E4o3MtEDFA50myt+vpyzdvX03ovCkAs399Wrjz6MP3P8ru55Xxmyce9Adg7th73+8rys/1wYttp+uDfl8jSKLmmYdfVeXgU9flmG7/4DVfgxckXnPph6LuLRWz+vk0zwY8L/R9U9TtxwNn5s86BjN4v9sbqrrTz+rvf+xXaiGD93vyW9l/ltOvekAgpOejevi6M6fX1GMwenfr8EtJjvPRMeBIcuFgb+z8/FmvqQNuZHhReXfJwKtcwA11r/6a/P/9/PMqNySY7tXNIiN3aUF8ea1U933OuMMJLEO/eI4b5HYM7tH0LcP1Dkc1Bobno1fYwXD+rGuBqVfaocPUrXagTN1qA8rUyzAwdQxaTR3KtcDEoRAipp5ngQj+X35DzyuA5lAoEGj0er21Hk99ncvtdlY77fjYbLbyfIvlwhH4ycdmqLcbIQAAAABJRU5ErkJggg=='],
  ['freedb', 'freedb', 'http://www.freedb.org/freedb_search.php?page=1&words=%ARTIST%&allfields=NO&fields%5B%5D=artist&allcats=YES&grouping=none', false, '',
   false, '', '',
   'freedb is a database of compact disc track listings, where all the content is under the GNU General Public License. To look up CD information over the Internet, a client program calculates a hash function from the CD table of contents and uses it as a disc ID to query the database. If the disc is in the database, the client is able to retrieve and display the artist, album title, tracklist and some additional information. Because it inherited the CDDB limitations, there is no data field in the freedb database for composer. This limits its usefulness for classical music CDs. Furthermore, CDs in a series are often introduced in the database by different people, resulting in inconsistent spelling and naming conventions across discs. It was originally based on the now-proprietary CDDB (compact disc database). As of April 24, 2006, the database holds just under 2,000,000 CDs. As of 2007, MusicBrainz - a project with similar goals - has a freedb gateway that allows access to their own database.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAF5SURBVFhHzZUBjoMwEAN5Ok/rz3o4dKhZHOAqNXeWTBqvs2vSSp3AczBeY1dIeDwez3mel8JKff42tuECgxk+IoBwCKCbGInt+v3tCaHV6TUBreoVeJJvksBwJ82rLk1INdEH9HrTQzi9gTRENfezdy9gT896rnnac0EtCKmpgKa6w70+zEFPzt4K0BtEDaKphwdIHrH1as8FiJ8EYIXqgV7pvtarPRdg+E2AqvtZvwGHdPd9FADd/a4B9pz3UGinAarZQa3Sz/vASrAF0BCxNqiag3o6C6pHdGwB/grL31G+onGM4khGsU++a61o2ovuu88o9skPjYH+o6ree4xin8MD1Cu/ClD914ziSoYlpAAJteeRUdw35m08UC8AXoCvzygerxqCFIDhVUfLjOI7gDd1PQVwnwhqjz2j+I8CMAiCFMAHnQXbM4q5sWspgMD53gscGcWVNElIAZKf8H1G8U01UGMfCN3DXqv7r9mQCiO4QzJ8k8I0/QDachmIpR1kNgAAAABJRU5ErkJggg=='],
  ['Google Search', 'googlesearch', 'http://www.google.com/search?q=%ARTIST%', false, '',
   false, '', '',
   'Google Search, commonly referred to as Google Web Search or just Google, is a web search engine owned by Google Inc. It is the most-used search engine on the World Wide Web, handling more than three billion searches each day.',
   'png', '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'],
  ['Google Play Music', 'googleplay', 'https://play.google.com/store/search?q=%ARTIST%&c=music&docType=3', false, '',
   false, '', '',
   'Google Play Music is a music streaming service and online music locker operated by Google. Users with standard accounts can upload and listen to up to 50,000 songs at no cost. An "All Access" subscription, available for US$9.99 per month, entitles users to on-demand streaming of any song in the Google Play Music catalogue and the ability to create custom radio stations. Users can purchase individual tracks through the music store section of Google Play. In addition to offering music streaming for Internet-connected devices, the Google Play Music mobile app allows music to be stored and listened to offline. The service was announced on May 10, 2011, and after a six-month, invitation-only beta period, it was publicly launched on November 16. Google Play Music offers more than 30 million tracks for purchase or streaming. It is currently available in 58 countries for Android and iOS devices, web browsers, and various media players (such as Sonos and Chromecast).',
   'png', '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'],
  ['Google+', 'googleplus', 'https://plus.google.com/s/%ARTIST%/people', false, '',
   false, '', '',
   'Google+ is a social networking and identity service that is owned and operated by Google Inc. Google has described Google+ as a "social layer" that enhances many of its online properties, and that it is not simply a social networking website, but also an authorship tool that associates web-content directly with its owner/author. It is the second-largest social networking site in the world after Facebook. 540 million monthly active users are part of the Identity service site, by interacting socially with Google+\'s enhanced properties, like Gmail, +1 button, and YouTube comments. In October 2013, Google counted 540 million active users who used at least one Google+ service, of which 300 million users are active in "the stream".',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOTkyQjA3NThERDAxMUUyOUEyN0Y4NjY2QTExNDU1NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyOTkyQjA3NjhERDAxMUUyOUEyN0Y4NjY2QTExNDU1NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5REZCMkEwOERDMDExRTI5QTI3Rjg2NjZBMTE0NTU2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5OTJCMDc0OEREMDExRTI5QTI3Rjg2NjZBMTE0NTU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vThexgAABFxJREFUeNrEV31oG2UY/10+2qZtmnSr++oS13ZTWyWdC0KLbmvnKP5ThzqpUtn+kFnBjwnaDRQc8w9BOtAJzgmKutqhIPsQEYqTDelQi6Oakm51XSltOje3NulHvu5y7/nchaS55i5tA03f8Evu8rzv8/zufT7e5zhJkrCSw4AVHqbUm7HnGlwSz3fQZSPBvAz2BMJFLi+v3fHtJY/8B5dwwehTdS4pGvmdLi05ePAwV2Cpc575zZN0AYuGOyRIFkIuPhYWCXXMj4HGHLu/URUD5ImMPo+Rp4IxEVH6FSVGUGePmeNgM5lQYOQWS8A8Lwj10zEYY+DLK+BsboG1phZmxyYYiq3qSURo4uQxTP/QmV0aMkkbPAPym/Zi2xdnYbj7H8bf3I+Rlkb4T30atxsTMPheO64/4ULgfKeuHi3MiwFJE1J5Jba8dQSzXg/8Z7+ExARIYhSTp09gqvscOJMZW95+H+Lqtbo69JFKQGeOrWkPJSuH8NhImizQdTKuhEiU7GrOxv4cAbkeaKGg3KnIOVspbZtaJtzyISITkyOqqDhtrS/M6+pN1J85AmCaQGBCkdtr3QgZzSqZSN+8f1KRi9e9aWt3/jqoq1fRrd4BThOzF36M12xrCUr2vIBZQYLIOMQIU5IBlo1OBHsvY+byz2lrM+lNyBd0Qcj7J+6c+IDClqHiwBtY9cx++M0WzKzfhKojxxHu+wM3j74GJorK/HHa9gTkkXqv5YLkWXBtd03GcznfUQXr9iaY125A/tZHlNiY7O3B7XfaZCXJeQ9cGNDVQTZU9zSXM6XuQKYRGR1CpGtIuXZ82AUQASYy+KlI2cijBkN8S68+Xp1cU/3LVdV95n5AJpABPNXioCBimhcxeuozMIFHWf0O1Bz/BjP2NYgRmbR1C+lVnQU6DMkeAkxE6cOPwrF9F4o334+8deUkiFLu5cHucsNNVbL/8MswDPXLJUNdoRcoxckY8DbclzaXp3rJHqpD9aGjMIo87n73FUKeXvCU/+AMWPVkK9a9chjUYEAMBXGtbS91NTcWfQ48eOkfLmMlNLh3wP3J12DTfgy3PYtA9xnw//ricsqKyXOdGDm4D4yMGwuLsKblxewrodaMqlcPKU96+3s6ZISI5pzQwBXcOv25oiHPZl9yLTbNnYbp3iq6tzLeyFkK6fwnLjoenaZyvIF+Q/1XNPUsMgu4NIQGlL4RztYDCFjsCBILgclkOdkDFKAcJui/e3Y3I3xjkFzSpalHFwu5YPzYuxAm7qDQWYG6rp+w+vmXwFfWYMpaimDZehTUN2DbR50wsxiGD7aChUNLdkEyC/5+bLPm3plKbCh7eh9K6ncqnZCpsBhicIaC8SaC3j74u8/TTvVl1RTW9gxxKQQqc/6KVNszPFeKaUeEZXoZyfSSktITgruYy6dP2EsSGCuytwtMCi+lqcwWsh0f2VMFoTw+3rrRRef6sr8bGozG9tf/8nnSCKzE+F+AAQDcLn22XOtb+AAAAABJRU5ErkJggg=='],
  ['HDtracks', 'hdtracks', 'http://www.hdtracks.com/catalogsearch/result/index/?dir=desc&order=artist&q=%ARTIST%', false, '',
   false, '', '',
   'HDtracks is a high-resolution digital music store offering DRM-free music in multiple formats as well as cover art (and liner notes via PDF file downloads for a majority of catalog offerings) with Audio CD-quality and high definition audio master recording quality download selections.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOBSURBVFhH7ZddUxJRHMb7Ks30YqllvqRCYYpIo5iIooy8uKYiqSgiiAgKuwJpU2YWRS+jZU05ky/VTXVR0411WX4SP8LT7qKHPXvMxhvtoovf7Jnnef7nPMscLvZYLBYrisfjGyLbIjgkpLM2pLOPSQuFcdhsSAUO883VbEsF9jIOjf8F/p0CT5dWsPRqneL2XJoE05klxp+//wTJ1E1GV/IgsyhndvdRQwq8+fADa59/UczOL5Lgq7Vvoral8Lew8HQVN2fvKDQlUjbL248/8fjFe0wnUmS/XUiB9MuvyKx8p4imHpHgg+efGH967iUSqdviepPxaCR/E+nlLxCSM2RPCVJg+v4HJNKfKHyReRJMLqwzfoB/gnjiFqPvh3DvHeL8NFtgJLECX3INvkSO3pFZEhxLvmZ8d3ABk/wMpcmZ5Kr8HJHXOyj8kJBhC3QFF+EKLlPYPQIJ9oWfMX5H/ywmplIq/QVsA/fAuf1wemJw+FVzgWVwweeYjPG5AjzPo8XzEM2eDI37LnoD8zKt/Y8Y38wJCEUTMKt0a98dUtw/zosaPSvlh8eyF1IuIAgCjK451HbePRDGjigCEwIMLlpv4Ojbbh+4hVrV/p0D2XtAClS1z+DyAalpDWFUfEO1bujIHS5xfSjBZFq7Y3SByhYBFRaacgsvPtXkfJ3ZD38oLuboueq2CFXAcYNXZXhcc4boAmWmCEoaaIpr+1FrdkPf5MbFhhDja01e+MamUFJP6zrzGFVAbxV1RaZUpMXppwsU1flxvm6UcE6kqrGPbFJtCVG+RMVVD4aDk4yuMfnkmalYHM0udu68IYDOHi9doFDvRUHNECG/2ovL9T2kgK5pVNRov8zQg+HAFPJVc4U1g9BbRlFi9FEzBTVe2T9ziUM4PEEXOFvlQZ6uj0J7lSMFtKYhxi/Rc/D6o4z+N4xNTrIvKZCn7cJpGY6gNeaCmnoP4xdfscM7EqG0fdF0Ib+8WXz78B4FKh04VWGn0Bg6SLDS2MP4F3Q2DPomcFKlS0iaWs8rbcDQcPZ+7EIKnC634WRZO07sIK01+nYSrDBwxNv1iy5ZxQJhef0nTpS24nhhHa4YmjA+nv3rKZELSFhtnTCZ29AoIj1N5nbYnV0k6HB1K7wsbTYHItFJWKyOPWlpc4DjuqmfXA0pcFT8L/BPFDjyT7Oj/Tg92s/zWNFvSc6DvcohrKoAAAAASUVORK5CYII='],
  ['The Hype Machine', 'hypemachine', 'http://hypem.com/search/%ARTIST%', false, '',
   false, '', '',
   'The Hype Machine is an MP3 blog aggregator created by Anthony Volodkin. The Hype Machine is a music database created in 2005 by Anthony Volodkin, a sophomore computer science major at Hunter College. The site was born out of Volodkin\'s frustration with music magazines and radio stations. He said, "I discovered MP3 blogs like Stereogum and Music for Robots. I couldn\'t believe there were people spending their time writing about music, putting up tracks so you could hear them. And I thought, there has to be a way to bring this all together." In 2005, Volodkin sent his site address to pioneers in the online music domain, including Lucas Gonze of Webjay, in order to gain feedback. Instead of sending a response, Gonze and others posted the link online. Volodkin observed, "[Hype Machine] got launched without ever being launched."',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAASSSURBVFhHrVf9T1tVGO5foD9P47+gTn5RE7WE1uE6hwNJNJNF5xITF0iMxmSufKelbKPUYVnZ0M1NIpQ1EJiUAZbNbm3tx5gwxiY2Fk0Gi6lxA0qnvX097+257bm3p1/i0zw595z7nud5b8+5556jKhajS51PWG/Ufdjlr7KfCOwNH/fvSRi8FYDE6xOBqnBXoGoIYzCWdts+vl6s32kO1IwYvRqh3aOGYkhiE2Z/zQj2pTKlYzpserw7WNOPT8gzKYakb7I7UHPGTrSobHE4eeOdZzq8uyI80f9Ck++1X62hA09T+fywzR0sN3g06+3XSWceUZS9Zut5iJqoTW346PUf3Gn0ajfTHQuJl5AA0ujRbp6eO/QstZMDx7zTV7mS7qAU5hnlM5fuKWKO/ahbsQc5cwInHBtYMnMlo2wndfSitil89dPh59KznQ1WsOUq4eg++NLVCKO+0zAVGgRn8BuweyzQM1UP+glNJj5PQuiFntRepbIEa8d4mUrXTS419Do/hfk7IUgmk5AL6xvrMBO6CIaJWrkOq03rluCbY6L55LL1qQ6vNrXISEEMmy/pwL/gphbFYWsrBuddJmj9gaNJEzD6tImZ3049qbLdfK9BalQm0TS+G36J3KWyJYL8Uw63DdquUT1Jm/FCb/L3VzvYRskcx/uK30nVMkiSn/AoDkJsM9OSFMR2JQTSfvJyfVpTmQAZBocKPyxsoxTYan+bO97xpVuwqlPDPc0LsDE9AX9aTHCv8iWIdhnEp1bi1nII2twZXdYLvVXkvUzIzGn57bSVSsgRNTTC2itlKVY8D2svp65XSRkPL9OoDAQhAfrxXdwE0Fsl+9hIQdfLYcQ5SCXkiHY0p0wJ79NExJLUtxbnaRSLJJgm92eZI9E7RwJqODfURwXkiC/fgVXy90vGkvn9D+ogKQg0KgMcxqZxXUZbmYBsCJA0sKW3gUpkY8PtglXti6lhoOb/RP+gd+WI/B6GliuMNuMlDoFsEkoBpGx0VIFr1kVlshG/exvW6qrhr7M2EP5+RFuVSMKFKXP6oZQJiJMQXwW2kQ0+Yn0X5hcWqJgS+PrhrM+9MvpCHtB/p5Vpsl7ia5hvIWq7Vg5H+w/A0PAgPHj4gMoWBs5858wl0Dtel+mJZLzEhQiX4vR+jxdMytbJPTDr/p7KpyYWD9FoFGavzoKx/xNom9mdrYek5rhvFJdiBPdjxHKsFmKxGCzeXoS+AQt81nMIDNYjYLvwOZwd7IMvzh2H9r6PoPH8fmi5XCnvK+myJSF6iuYI8XPsqUjykygHQ89RaLIeBv3wG+KwKO/L6wVIPNAra8fcHag+w+0gsoCJMnGpjiV7TUv0orYZ4Na5A7dknA5iyZLXxjLP/WM+3crEz82PUVs5em+STSnZOPI6clkoEQWN3lc3cm5KJWRty0s0yUWDV/Pw1Nz7amqTH3iI6CSHCdH8fyBqWUNvFXcwkYBb520fzchsxwmXc8yLwcBSQ5l4OCV7OJ4Jj9LhdGDp4zIqs304I7YdePQ2B/Zd5B/P94a7g9XDGOOMmHfQbgWgUv0LCIZS8Clax6YAAAAASUVORK5CYII='],
  ['The iTunes Store', 'itunes', 'http://www.google.com/search?q=%ARTIST%+on+iTunes&as_q=site%3Aitunes.apple.com/*/artist', false, '',
   false, '', '',//https://itunes.apple.com/search?term=%ARTIST%&country=us&media=music&entity=musicArtist
   'The iTunes Store, originally the iTunes Music Store, is a software-based online digital media store operated by Apple Inc. It opened on April 28, 2003, and has been the largest music vendor in the United States since April 2008, and the largest music vendor in the world since February 2010. It offers over 37 million songs, 700,000 apps, 190,000 TV episodes and 45,000 films as of September 12, 2012. The iTunes Store\'s revenues in the first quarter of 2011 totalled nearly US$1.4 billion; by February 6, 2013, the store had sold 25 billion songs worldwide. While most downloaded files initially included usage restrictions enforced by FairPlay, Apple\'s implementation of digital rights management (DRM), iTunes later initiated a shift into selling DRM-free music in most countries, marketed as iTunes Plus. On January 6, 2009, Apple announced that DRM had been removed from 80% of its music catalog in the US. Full iTunes Plus availability was achieved in the US on April 7, 2009, coinciding with the introduction of a three-tiered pricing model; however, television episodes, many books, and films are still FairPlay-protected. As of June 2013, the iTunes Store possesses 575 million active user accounts, and serves over 315 million mobile devices, including iPods, iPhones and iPads.',
   'png', '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'],
  ['Juno Records', 'junodownload', 'http://www.junodownload.com/search/?q%5Bartist%5D=%ARTIST%&solrorder=relevancy', false, '',
   true, 'http://www.junodownload.com/artists/%ARTIST%/releases/', 'encodeURIComponent\n/%/g, \'%25\'',
   'Juno Records is a UK-based online dance music retail store, selling vinyl records, CDs, music downloads and music accessories, founded by Richard Atherton and Sharon Boyd. The website was created in 1996 as an information-only site called The Dance Music Resource Pages, listing new dance music titles each day as they were released. In 1997 the site changed into the commercial store Juno Records, allowing users to buy the records and CDs listed. During the e-commerce boom of the late 1990s, the site differentiated itself from other dance music stores by maintaining a text-based presentation. In December 2004, version 2 of Juno Records\' web site was launched, adding graphics, and more flexible navigation to the original site design. In February 2006, Juno Records added MP3 and WAV downloads to its catalogue, and in July 2006 launched Juno Download as a standalone site. In the same year, the web site also won Best Entertainment site in the Website Of The Year awards. In September 2006, a Spanish-language version of the web site was added.',
   'png', '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'],
  ['Last.fm', 'lastfm', 'http://www.last.fm/search?q=%ARTIST%', false, '',
   true, 'http://www.last.fm/music/%ARTIST%', '',
   'Last.fm is a music website, founded in the United Kingdom in 2002. Using a music recommender system called "Audioscrobbler", Last.fm builds a detailed profile of each user\'s musical taste by recording details of the tracks the user listens to, either from Internet radio stations, or the user\'s computer or many portable music devices. This information is transferred ("scrobbled") to Last.fm\'s database either via the music player itself (Rdio, Spotify, Clementine, Amarok, MusicBee) or via a plugin installed into the user\'s music player. The data are then displayed on the user\'s profile page and compiled to create reference pages for individual artists. By April 2011, Last.fm had reported more than 50 billion scrobbles. It claimed 30 million active users in March 2009, and on 30 May 2007, it was acquired by CBS Interactive for UK£140 million (US$280 million). The site offers numerous social networking features and can recommend and play artists similar to the user\'s favourites; it also features a wiki system analogous to Wikipedia, wherein registered users can collaborate on hyperlinked information about tracks, releases (albums, etc.), artists, bands, tags, and record labels.',
   'png', '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'],
  ['LyricWikia', 'lyricwikia', 'http://lyrics.wikia.com/wiki/Special:Search?search=%ARTIST%&fulltext=Search', false, '',
   false, '', '',
   'LyricWikia is an online wiki-based lyrics database and encyclopedia. In March 2013, it was the seventh largest MediaWiki installation with over 1,800,000 content pages including 1.5 million songs. Users on the site can view, edit, and discuss the lyrics of songs, which are also available for purchase from links on the site. The site is searchable by song, artist, album, genre, hometown, label, and language. Users are told to be mindful of copyright while contributing, and copyright violations are removed upon request. All the lyrics on LyricWikia are licensed through LyricFind.',
   'png', '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'],
  ['Magnatune', 'magnatune', 'http://my.magnatune.com/search?w=%ARTIST%', false, '',
   true, 'http://magnatune.com/artists/%ARTIST%', 'removeDiacritics(artist)\ntoLowerCase()\n/[^\\w]/g, \'_\'\n/_{2,}/g, \'_\'\n/(^_|_$)/g, \'\'',
   'Magnatune is an American independent record label based in Berkeley, California, founded in spring 2003. It originally only sold music for download through its website, but added a print-CDs-on-demand service in late 2004, and in October 2007 began selling complete albums and individual tracks through Amazon.com. In May 2008, Magnatune launched all-you-can-eat membership plans. From March 2010 Magnatune dropped the CD printing service and moved exclusively to all-you-can-eat membership plans. Magnatune was the first record label to license music online and as of August 2014 had sold over 5,000 licenses in its five years of existence.',
   'png', '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'],
  ['Metacritic', 'metacritic', 'http://www.metacritic.com/search/person/%ARTIST%/results?cats%5Balbum%5D=1&search_type=advanced', false, '',
   false, '', '',
   'Metacritic is a website that aggregates reviews of music albums, games, movies, TV shows, DVDs, and formerly, books. For each product, a numerical score from each review is obtained and the total is averaged. It was created and founded by Jason Dietz, Marc Doyle, and Julie Doyle Roberts. An excerpt of each review is provided along with a hyperlink to the source. Three color codes of Green, Yellow and Red summarize the critic\'s recommendation, giving an idea of the general appeal of the product among reviewers and, to a lesser extent, the public. It is regarded as the video game industry\'s foremost review aggregator. Metacritic\'s method of scoring converts each review into a percentage that the site decides for itself, before taking a weighted average based on the critic\'s fame or stature, and listing different numbers of reviews. Many review websites give a review grade out of five, out of ten, out of a hundred, or even an alphabetical score. Metacritic converts such a grade into a percentage. For reviews with no explicit scores (for example, The New York Times reviews), Metacritic manually assesses the tone of the review before assigning a relevant grade.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAYNDgAJFAEOGQQQGgURGwYRHAgTHQoUHA0VHBIXGBUZGxYaGhcbGxcbHRUaHhgcHBodHRseHhwfHw8YIBMbJBYcIRcdIhQcJBMcKBUdKBYeKRcfKh0gIB0gIR8iIhkgKhohKxwjKx0jLB8lKh4kLB4kLSAjIyEkJCMlJiQmJiUnJyAmLSInLiYoKCYoKicqLykqKikqKyssLCwtLS4uLi8vLygrMCgrMSksMCsvNiwtMS0vMS4vMi4wMzAwMDAxMTAwMjIyMjMzMzMzNTM0NDU0NDY1NTc2NTY2NjA0PTk3Njg3Nzo5Njg4ODk5OTs6Oj49PUA9OEM/OkZAM0FAPkVAOUhCOkpEOkxGO09IPFFJPFBKPVNMPFRLPVVMPVdOPlxRPmJUNENBQUNCQkRDQkhGRUhGRkpIR01LSlBMTFFOTVJQT1RRUFVSUllWVVtXVlxZWGJXQGhZQWlbQWteQWxcQmJfXm9gQW5gQmNgX3hmQ3poQnxpQ2RhYGVhYWdjYmllZGxpaG1qaXFtbXNvb3VxcHdzcnh0dHp2doFsQYRvRIVxRI94RJN8RZd+RZh/RYB8fIF9fZ6DRYSAf6KGRaSHRKeMQ6qLRaqOQ7ORRrCUQ7WWQriVRLmZQ7+bRL+bR+C3POO3PuW9OcGfQcWhQsynQNqvQNyxQP/bHf/bH//cG//cHevCNe/ENe3BOPHHNPfHNvbHN/TFOPXEOfrNMf/PMv/OM//MNf/MN//ONP/XJv/TLf/SL//UKv/WKP/WKv/ULP/YIv/aIP/aIv/YJP/YJv/RMImFhYyHh42JiY+LipGNjZiUlLCsrLSxsLu4uLy5uMPAv8vIyMzJyc3Ly9DOzdPQ0NXT0tfV1NnW1trY2Nza2d3b293c297c3ODe3evq6u3s7O/u7fT09Pf29ff39/j39/r6+////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADq5vHQAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC2UlEQVQ4T23T91vTQBgHcHCLVEFcjACtgohFKavgLK1erFRwFnDgprgV9wDFjVsE997VuiFtIgRDinEv3HuAen9FvbuUPvg83E/3vN/Pk3tzw8v13+DwcM/l0QSgyC5VVUnMf8YDOAcniLXS7TscL9YyrIc0Ao7lrWf2LptoNmdOLzjJix4iA45lbOdWAZUyJrZ7+1Yte00+4uTdggCOlayHDEFaQOtCLcWli/u3icyvqJUFAQ7GtjtcDQAwUJshGs8ndAwyX5MFBhxn2xeSgnIQugTnEP7K8w8xV9xjZcCxzgsRWpwnxb2RAfxr8Q9cWsOgT2AgCZkqI8oT/dIh/P3gGRZ/cjsoj1rRIgg4rGXhKNaHGTLmQljoTW3HoiG3RbaAPuHl4hg+pyfKQ9e8rv8BIYhK9N2KRf2sdqdrCOAv6QYBQK3EVQj3++h1im1kOnKGSIBYFgGGa+h6UoRwo69+qAKv8n7A+EqGQ8C5U2WM916ESl+JKMKiGNYldBtXXolBbYE6dHZJKawvjC4kYoOvIanPpplRQ0acFWTQdcxbVH/h19dnHhHrfQ2G3nHGgW7g3NH6FS6/0/SjFfOJ2BKnQz+uHVtehYF4sIflEy4/7RxPKxbg2WdNEgLqHLlJ/vKwTvQHXH+CxUII62gNykH4Wvk3meqpkRT9EYvHWBS9zAjDO6+POUU2ysVeOaykKSNZ5ZF/Ah2XpME5UGXzZKvRYfHZShNl+oLFw2idHq8PQKryhCgfFsfWXIyJTQtI/4ZFCWUgOQhcIbqPG12YqweCU0wBGd9R/xbSHwBBWYLgvjDkyu2JUJsCRjf8NFJk/cGBWTfve64c6pOxHUsLTg6bk0f6T1Wqlwty7gYu1m69vm5UTNsuybFqlVI75bgoyHkjQJ0Kthtlq6dlmSfl7zpf7bS7cw9AT89RKdYI3C2pWrzbzNNDAz9sRqqS7M0/Xnlg1CR1uVz/AFwSl44FFeVoAAAAAElFTkSuQmCC'],
  ['Encyclopaedia Metallum', 'metalarchives', 'http://www.metal-archives.com/search?searchString=%ARTIST%&type=band_name', false, '',
   false, '', '',
   'Encyclopaedia Metallum: The Metal Archives (commonly known as Metal Archives per the URL or just MA) is a website which lists bands from various forms of heavy metal music. Encyclopaedia Metallum was described by Matt Sullivan of Nashville Scene as "the Internet\'s central database for all that is \'tr00\' in the metal world." Terrorizer described the site as "a fully-exhaustive list of pretty much every metal band ever, with full discographies, an active forum and an interlinking members list that shows the ever-incestuous beauty of the metal scene". Nevertheless, there are exceptions for bands which fall under disputed genres not accepted by the website.',
   'png', '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'],
  ['MusicBrainz', 'musicbrainz', 'http://musicbrainz.org/search?query=%ARTIST%&type=artist', false, '',
   false, '', '',
   'MusicBrainz is a project that aims to create an open content music database. Similar to the freedb project, it was founded in response to the restrictions placed on the CDDB. However, MusicBrainz has expanded its goals to reach beyond a compact disc metadata storehouse to become a structured open online database for music. MusicBrainz captures information about artists, their recorded works, and the relationships between them. Recorded works entries capture at a minimum the album title, track titles, and the length of each track. These entries are maintained by volunteer editors who follow community written style guidelines. Recorded works can additionally store information about the release date and country, the CD ID, cover art, acoustic fingerprint, free-form annotation text and other metadata. As of 6 February 2014, MusicBrainz contained information about roughly 850,000 artists, 1.3 million releases, and 13.5 million recordings. End-users can use software that communicates with MusicBrainz to add metadata tags to their digital media files, such as MP3, Ogg Vorbis or AAC.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFWSURBVFhH7dctUgNBGIThiAhERA6AQEYgcSBwcAREDpAD5AYRCEQkkgNwAKpAIpAcAoHYAyAQk16gqzqdb3ay4acQI54qMjuz71eJYHeQUtrJ/dlyHK33FS6WID4F/Pn5uZkf38GEn/sIF3MQncBDG7cBErzDFfT6ZsJFh9geLBgmXv8agBqYwZDXu4SLCqFzDxP3SFw9wyn35ISLLQT2Pei418LuFg64120s4MZDmGsoh2csGHmDBYx4htY+4KYnHunCcxIqeYUpz7U0fuOBEp61yDaeeFYHCCNdeDYIFPFsHaAOUAeoA9QB6gD/aoDGAyU8GwUKwn/HY7jWQAnPBoGc/AMJ4cZH8KihHJ6xSGS7RzKFwMfLRxfulVCk30OpQqT9WZYaVdxnQfreY7lC7BA2fhZet/DPvpgoRC/gJTPA772aKYRHcGkD/M3LqcIAOwXXpcEKYYLRyiFtp7gAAAAASUVORK5CYII='],
  ['MusicStack', 'musicstack', 'http://www.musicstack.com/show.cgi?find=%ARTIST%&search_type=artist&find_focus=0', false, '',
   false, '', '',
   'MusicStack was started in 1997 out of my Ohio State University college dorm room (pre-google) when finding anything on the internet was hard to do and other resources for finding and buying music were just plain terrible. Nearly 20 years later MusicStack is still one of the best sites on the net for finding vinyl records, LPs and CDs.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaXUAAAC2NJREFUWEelVwdQ1HcW3vHMTUz0jDFEUVkQENRIXVh6L4L0JqISQZEiRFBRRJqg4IIgiID0GooUGygi0hWlWIiAYslRbElQnJjLTe6SfPd+fxYzmcvdJHdv5s2yO8P/fa993/vzfq+Njj4yfTQ6hfqLw0irvomtovPwPHSa/Ay2Ha7F0cQ8FBQ3Y/jBPzExAVPxv/3/9nh0Yiqi+MbU4fLeN/tzO+G6vxR6nnHQcAsnPwCBy34oaNtBUcsGsqomWCEwx0or/zcJRyumxicwJX7MH7ehwcn26rqb49dvv0J48XUcq+pHXu0teERXwdg3FWZ+x9+6kbcIKvYhWGXuDRlFTcxfshoS0qqQWaULx7Cy8bGxH9rFj/19Jqq6lRGQcunHkYcTqLv4YFlb39eIKrmBIxX98D/WCOudObDYkQHLwExYBmVCY30EBK4HoGTtBzmBJWTULLBYURuz/iKFDyXlITRy+rG29urdN2+wWxzit+3pl3+3zDl9t3NnVuub3Lov0NwyiNbO8eb+m0+RXHAFaaf6cZwq4bivCOYBJ7A26CSEG6Kg7rwPKnbBUNB1hLyWLRR0HLhPaVVzfMRfgz/NlcQqJU0kpJ/96ulrWIrD/dp+/uGVyqWuoaFdmW2obBpBV/cTJJb3ILt+BC0t93Gh7UscLOlG8ik2gOdg9Vk2tDxioOoUStnvh7JNIOQ0rbCC5oFVQFrFlD7NIbXGCEtX62HOnHngy67CkcTioTv3p5aLw/5i8UUX9ELSGuCVcAZFF4aRe24Q5Rfv4+SpPmTU3EJP/zc4eXYA0WU98E1uhPmOTOh7iWBI/WcVULYJgqzmOgJgD76yCQXVx7JPDAiAIZYTkKUrNPDOnPlYvVoN2bnnmnNyct4Rh+ZsdkRi9Sld7xRsT6pH0PFm+Kc1oajhHs433EEmlZ6BudzxV6SdGYaIKhGc1oh1u/LJ87gZ0HTaDWUdGyq9HZf9TPBlzAkMf6UWB+rdeQvh6OSFm7e/ygMwm9fW1ja779Zg0qc7j8JhbxHco6rgcbCG+lxK1TiNpMJO5NfdwgkC0Xh1FDUtg1VNHWPDUQXdULOjrPU8sEjZiguioGoKRT1nDgALNgOAv0IAKUUh+DQTiqpGWLZMAanHK8Cl3t3dPaf7xjAULbbDW9TA9dZxXzFNeBZMfNPgEFaGA/lXUUAreOn6GF5N/pR8KLmqR+C4C8ra1lBWM4KSmiEkJWXx7gIpSMqpgs8CUwW44AqakJZXgxSt5JJV+lDTtoKBgQ20dazR0NDlx4EIji6CtuchClxC053BrdjMmrFpX09ViczrwLlL95BfcAlmtl6wd9+B6JhMxKdVISG1ChGR6dAysMWcuQvwwSIZDsBScr68Kv2tDxlZJUiuNoCShjmcnH3g4LQNrW1D4FWe6TRTtA6C/pYEmPmnw2R7CozJ3+45Ofvdbnc+NoccxdLla3DocA56B75DZnE7dtAs7MloRlXDMIovjWHt5n147/15tH6fgM9aQVWQoi3gy6sTIKqWpgXcPXbAa2soystbwGtrH4SEoj4sqfS6nx6GimMo+R4YbUuGqV8a56wdQrcwvL9YER57TqC97yW2xNVAsCEaVj4i6G6OhbrHQYSfaEJNxzOYu/hj9uw/Q07dElJK1HNxO6RpPdX17bDePQCBgRFobR0AL7fgIhYRMnViMnWXMG6nOaceq9F6qTmHcSBkNO2xUseOVvQxHANTCORebIw7PdHe/Ww8vODauN6WxK9V3aIQn9OC+PIvME+CD6ll8pAnXmADKa1qxpGTgaUHNm0Oxs7gWPT0jYOXfKwSMkI7CBiduuzjXM0tAvrGTgSIvhMYVYcQysQYtt4RCM29Cu2NsTSwF6anWGwh6e0GruFlpA2piPn8JoQ2PvhggQRWECsyMpInflDWtoGV9QZ4bNqJ4JBDGL43At7BuEws17KHgIJqrfPhXJ0UTp1VgSrCqqJGANgKeQcdRiIJk5AYMKqkB4lnr84Tx+d1906aJ+a30eakIpoArHPwxpyFcpRAOOSF67jslXVsCYAHNmwMwhFRKQF4BF4KTTBXASatrhSQPvXM1kPDORSGxg4cterRdC8gddNzDEDKufuw8E2C/tZkXO568g9xfJ7/0QumTmElsAw4joMEQGDlRWunQ8OcSXS9l0tEhdq5bmMoAvzDkJNzFoPD34FXWnUN70goQrjxIKdmnJhQUFY6BW1bDgD7vkRRC3MlpHHkxBnsP9nOVUx7QyTpQv1UdMn1Kb0tojcC9yj4Ha1HaH4vFiziQ4no2YK2iAHQpKo5+hzGp3vS4RZdi7pz1zB073vwem+9AG+OJFYbuXNBGYAZZ8E5MqH+y1EZ31uwGFJqlqhvG0dSZT+taypXOS0CIqS5SKu8iYLGMSxXMYKEjAo2RFZwLdBy2QuPbZEwCciC9+4U7I9IQ1vHg+kZaGzsU9fWd8B8aTUCYM8FnXG+sjFHsbIaVkSvZjTJppg9dyFMjGyRUN6HmLI+hOd3ISyvk7sXEvKaYWRsD2lNR/iJarCJzjVlh90w90+DVUAa3AKT4LM/C9GicgwMjEzPANms4+k1mPXeQqzUd36bOVM1FpxlLie04baAVYiBmL9AEny5NdBc6wlDlyA4enzG9fwjWQ3sCRMhJCrLt6ju1mhhVQ+sSbBMfOlyIoZ12pUNT+KPSFEVnjx5MT0DMTGYFReX7btw0XKiSkPumGB6zrKfztyUGM2EExbGbPIMzBoDSMiqEbOx/abflI2wXGiPoIOl6Oh4kMKyarry6Hkq3Q7FZ+7C68gZGPulYyOJnEfcaZwobMHI0Mg6bgaYxcTkL/ksJIEul8Vc5oy9ZGjtmLMqcEzGuH2VHgdOnkBqEqPpbjgAHfdwWPkfheveXNR2PEdd23hr043J3NaOMYeS+iFkn72LSpLyiIzLcI2qhht5cfVVPH78U3ZHJ2kBs9u3pz7IyjlfJNA0wqIVwunDgnR9JjBzBoodGuzKYZqvREqoR/phHZwH14hKEqxK7CJdyKq5g/LWJ7j34G8JtbX9XqWNj1BMd8WVjlEcKuzCNjpmai7ewdeTQE1t1y9kVpRRvXjbtl0d0nQ4SCmbcnPAArOAS0nFZAVW3DywtrA5UdKygippBhMxppimdB1b7MxFalEniuhyauh5idcvX/jWXxhMKrz4CDVND9B2bZyOnGG035igAXz9KyblLDg4QcvQzO3RQikVTji4chMQ1gp5oS0Ft+aAyRIQbXMPjqq1N8W+lW270EKEkSBdaH6I1Io+9I18wwWpbxqpzaHbsrF9FA9HJnF/5DU6u+7/OwBmWzxDPLUNHV5/uGwVpGnY2FCy9WTBGSAGQI6qoOq0hxMqdsDM3A+2dJ45UjsK2fHSNIzIkl7Elt2wYc+tbxntrm5/hs7rI+jtf9xW+vmVb7mAv2VpaWUiHR2zHz/8mE96Pk1C0xzBnFWClX9aLY19UrgKMACsDfZ7i5GQ24rG1sfIpXLHnxrAq1dQ+fkllJp6XyG56AoyUjLkxaH+s12+fK/ewnkrpBSEkFTQ4sRIXnO6BYpCa6gRAPZOwA5SBmBtUBa9sGTDLaICLjTpdZce4u7Ai9vHaCi7er+ZLCptcEsqbJ0qb+y/S8eogjjMf7cXL74aiY/PnlBW1YUkUesKJbps1K2goWUJgW0gdylZ0ssJO+NsQvLFL6un4R5Tg7orY+AJRPPr28bgHVuFE/nnEVUxECl+9B+zZ88np2Ljcqd0TV2+/5jYTlJRB3p61lCnU9wygEAEZmAtfZqTFDuTInJA4mrhRyu3MbZmqqLs4tTTp89rxI/7323o3rf+V6+NIuFILlzX+8PBcSsdlz6wDkyH56YguK/3g8P2eDhFVCExtRqdHYO/Pelvjcf7F5WBkL2r9Qb3AAAAAElFTkSuQmCC'],
  ['Myspace', 'myspace', 'https://myspace.com/search/artists?q=%ARTIST%', false, '',
   false, '', '',
   'Myspace is a social networking service with a strong music emphasis owned by Specific Media LLC and pop music singer and actor Justin Timberlake. Myspace was launched in August 2003 and is headquartered in Beverly Hills, California. In April 2014, Myspace had 1 million unique U.S. visitors. Myspace was founded in 2003 by Chris DeWolfe and Tom Anderson, and was later acquired by News Corporation in July 2005 for $580 million. From 2005 until early 2008, Myspace was the most visited social networking site in the world, and in June 2006 surpassed Google as the most visited website in the United States. In April 2008, Myspace was overtaken by Facebook in the number of unique worldwide visitors, and was surpassed in the number of unique U.S. visitors in May 2009, though Myspace generated $800 million in revenue during the 2008 fiscal year. Since then, the number of Myspace users has declined steadily in spite of several redesigns. As of May 2014, Myspace was ranked 982 by total web traffic, and 392 in the United States. Myspace had a significant influence on pop culture and music and created a gaming platform that launched the successes of Zynga and RockYou, among others. The site also started the trend of creating unique URLs for companies and artists.',
   'png', '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'],
  ['Pandora', 'pandora', 'http://www.pandora.com/music/artist/%ARTIST%', false, '/%26/g, \'%252526\'\n/%2F/g, \'%252F\'',
   false, '', '',
   'Pandora Internet Radio (also known as Pandora Radio or simply Pandora) is a music streaming and automated music recommendation service that serves as "custodian" of the Music Genome Project. The service, operated by Pandora Media, Inc., is only available in the United States, Australia and New Zealand. The service plays musical selections of a certain genre based on the user\'s artist selection. The user then provides positive or negative feedback for songs chosen by the service, which are taken into account when Pandora selects future songs. While listening, users are offered the ability to buy the songs or albums at various online retailers. Over 400 different musical attributes are considered when selecting the next song. These 400 attributes are combined into larger groups called focus traits. There are 2,000 focus traits. Examples of these are rhythm syncopation, key tonality, vocal harmonies, and displayed instrumental proficiency. The Pandora media player is based on OpenLaszlo. Pandora can also be accessed through many media streaming devices, such as the Roku, Reciva-based radios (from companies like Grace Digital, Sanyo, and Sangean), Frontier Silicon-based connected audio systems, Slim Devices, and Sonos product(s). On July 11, 2008, Pandora launched a mobile version of their software for the Apple iPhone and iPod Touch through the iTunes App Store. Pandora is also available for Windows Phone, Android phones, BlackBerry platforms, HP webOS (used on the Palm Pre, Palm Pixi, Palm Pre 2, and HP Veer). Pandora was the provider for MSN Radio until MSN discontinued their internet radio service on June 18, 2008. A modified version of Pandora has been made available for Sprint Nextel. Pandora is available on Comcast\'s X1/X2 cable TV products. A GNU/Linux based application, called Pithos, which is available for accessing Pandora Radio and is available for most distributions via their repositories and is also available to build from source at https://pithos.github.io/ The service has two subscription plans: a free subscription supported by advertisements, and a fee-based subscription without ads. There are also ads in Pandora Mobile for mobile phones and the Pandora in The Home computer appliance. Most users choose the free subscription.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAQ1SURBVFhH7ZZ7TNNXFMeLmYMNnJmNMiUxW5DhDJsPRmEE3VDHiIzIgszphGy4PixjgaDhZaYzmzLdlqGutFVBmLIsVgRhujnDQF0k9QljgzoeKuVR+uSfJSPhd3bObWtbWuqSFv/ZTvJNm97fud9P7z3n3h/vvxQBtk/vEVpQE5z8UVmCaM9xkXBvtVTsgyhf9Em1ZF3WjsS5SzJCcHqvEAHRazMWphVWVabkV+gzihQTm4oVnK/aWKTkUvJkptQCuYqfvTOSfKx2kyI09PXg1bkVlRsKFeNNzW3cvYFB0A4O+6z72iG4eOU6wUys3HqgcV7U6lC0c4eIeGPHylXSCsP5Szc4s9kMRqPRb6L5Ll/r5BJzZH8tiFn3Htq5A0S9/bE4vbRm4j5SU5LJZPKbjEYTjOj0kLWnllsY/87XixblBtpsHbH4rRLppt21nHZI5wIwrBuF7j4t3Lk7CN39qD5XafC3/oFh0I0aYMxCK+cOQNLp9SAsU3FhcRuO8eOzZ9lsHTEVwNWOHpB80QBJ22sg6n3ZA0VmHoaILYeYYsRKSC05CWUnWhiQ2cnYLgbwOQGkV84RvPuUzdYRUwGQaA/vakcg8zMVRIsUIJAo4eCpK9B6UwOtNzTw7Y/XIaXoBBtbX1ILbR29LvkknwBIZrOJmZJJ7DYlNFzqYGD28RYEScw/zsaz9p7GrdO75PsMYEGzul/aIVroDGAdo30f1RtAdKAeVgjlEJ9zlG2dwWkevwCcvfybRwDS2JgFtsvOw3IEoFVQNd8Co1P+tAOQWW55EwMQSI5A87XuR7cCtAW/9wxYCxHHU4tPstZ0nsfvAPWtCIC/k/nNrn4QY6vS0r8iPQrfX7zl1op+A6AiI6NlH8hhaXYF03L8Tq255dNTcKGty//nAMkBoGAHz84jF6DqnBqqflBDXUs7qDv72Gk4Oc+uadoC6zlABehc8Z40rUX4b+QXAPrXtAUEQMtueZQAVFjKhjZYgQVINSA/c5XdfpOfm0o+AZD5EJ7twv31rANeFisgu6yO3fGeKt6THgqwJL00Z/Pu79wA1J29rOLplnsRW875Sk4rrYVdx36GP3oHXMw86aEAL6QWbtu4y74CjsShET0aaEGDLyR01z94GcHvd1Bd+LLirf1I1CH0zNZ9Km6+IA0Bkt0B5kYnJ62Syiy/3v6Ts7eXPdmEQATlTc6GbsJibdfcg6Q85Tg/PPYrjwC8mDX88DWinyT7T3O38WG9wWCT0QdZ82kF8w82QvhaUc/MoFmZ6Pak1dQ1AgJnh732bMJmdfKH5X/nl5+FYvk5rsQHUX7B4UZ4M++b8edezeoNnD1vH/q8hJrBHD1EEC/o6YSQ+ZFfzomIO8N/Pq7JZ4XHNYYsiKye8XhwHs4fi3qCOXmJmbhCz+DHUh7vMYEfFINzLkOFWef+P5yDx/sHpsOr7DVpJL4AAAAASUVORK5CYII='],
  ['Pitchfork', 'pitchfork', 'http://pitchfork.com/search/?query=%ARTIST%', false, '',
   false, '', '',
   'Pitchfork, formerly known as Pitchfork Media, is a Chicago, United States-based online music magazine devoted to music journalism, news, album reviews, and feature stories. Founded in 1995 by Ryan Schreiber, who was working in a record store at the time, the magazine developed a reputation for its extensive focus on independent music, but it has since expanded with a variety of coverage on both indie and popular music artists. The site generally concentrates on new music, but Pitchfork journalists have also reviewed reissued albums and box sets. The site has also published "best-of" lists – such as the best albums of the 1970s, 1980s and 1990s, and the best songs of the 1960s – as well as annual features detailing the best albums and tracks of each year since 1999.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKNSURBVFhHxZe9jtNAEMfvDUIT5aOiSX9FUtHcM0SioYooqPMAFLRISHSIHqF0x9GCUJr0lFdHut66BziW+dle3+x41rGDgJH+kjOzO//ZnQ87FyGE/wpX6WEymTydzWZbwV5QzOfzYFHbtqz1fHhwlRrj8fhyOp1+8Qi7QDASyJXnU8NVRgjxe8/5EOBjNBo98fwDV8kGOcFPz2HEYrF4WK/XAfDsrYnAVy6IlqKLHLLdbheOx6MsTaUoitLGGm9vLojkB/DIl8vlw+FwEHM/YS17rB8viITcyzkn4nRh/yOEjx9SfL2Rbb6wZ7PZJL4AHGJuB0C128WQN3J/H8KL5yGsLh/x6mVtzIsXhO6OJgDbalxheXItb177AXA7Wh8hgg+bDknFXkyPATA49ALQyrklB/oGPn9q22vBl/Ufh1UZgES01cbk6hFLfvWsSkcMwEsPUGK7A05RNwHstZF2asQjv72tSN+9zZMDJfjUHDENMYBktjd9niOP4pGzhg7hWQm1oDmASBWAVjLVsJxNHtdQmEbsxBRpB1Dm3xbUUPKM2Dqg9f0A4hUOJacmKEwNNax6BVCmgE1DyXN2DlNLNgWtIvz+bTg5wjM6vaYOoLMI3Ta8u2NBJeeSgzqAU22YH0TnktNF7KsDsPmHU9RVANlR/CfkCPulHU+OYmBfRqvV6ldxc506HkJeC7nHl/Ydrx80AWRfx7mO6EGO9H4dg+wHCTdxxskHfZBEyPW0Psm4wub1THecIGetvXaA785PMtDro5Q5QWqocMa2CCfGZqs9wiMHyY+IriAimGqQATvhLHLkoKXQ8GpiKPCRIweuUoPukBMkk7IP2KOrPQdX6YHBIU7//Z/Tv4tw8RtIL8hIbdg2SQAAAABJRU5ErkJggg=='],
  ['PureVolume', 'purevolume', 'http://www.purevolume.com/search?keyword=%ARTIST%', false, '/%26/g, \'%2526\'',
   false, '', '',
   'PureVolume (formerly Unborn Media) was the first independently run website of its type, allowing for the upload and stream of music files. PureVolume was created by Unborn Media, Inc; Mitchell Pavao, Brett Woitunski, and Nate Hudson all from the University of Massachusetts. PureVolume is a website for the discovery and promotion of new music and emerging artists. The mission was to give artists a new promotion tool. Each artist had a profile that typically contains basic info, updates, photos, shows and music for streaming. Artists had the option of making each of their songs available for free download. Listeners and fans were also able to create profiles to interact with artists and each other, as well as track and share music they like. PureVolume went through several layout changes and a change from orange to blue in their color, however the layout from the homepage to the artist profiles remained essentially the same since 2003. The focus is on promoting "indie" music groups and artists, meaning those who are not in the mainstream, although has also seen the rise of many of the previously "indie" bands they were promoting.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVBMTJGMTBERjBGRDExREY5NTQ2OUQ1Q0I5ODZEMjg3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVBMTJGMTBFRjBGRDExREY5NTQ2OUQ1Q0I5ODZEMjg3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUExMkYxMEJGMEZEMTFERjk1NDY5RDVDQjk4NkQyODciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUExMkYxMENGMEZEMTFERjk1NDY5RDVDQjk4NkQyODciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6bn0yNAAAE/0lEQVR42rRXzW4cRRCunp+149hrIRlHICH8BMicOKAQpEiIE8qRo/0ICCHBkRNIIPEI8Rtw4wAHQEoOnIx4gRgkJJwQYq+t2Ls73UVVV1V3z+yGCITHGk93T039fPVVda9DROCrbds7VVV9tToa7aBz4Gi9fPLlVJYvW7P1/jxK9Nbsms1mR977T+fz+YF+i2z87ks3tvduv/0W7LzyKq2qEVLEOsRJJ8umU5YA1ZgjwShfyNh39gHLHP32K/zw4z34/fj4gJzZd03T3Hlxa+vr9959B04mE3j05+O+hd4Y1alCKc2DRe768iUy7AwPt7e2YDwewzfffgd/PHy070Zte3j71s3d6eUlnJ6fi7aqwKyc25iejp6oltO4kItrz/hmvLkOK6NV+P7e/aOmHY12L8j4yenE4gDwElnKoU864juRkUgrGvvemiLgIaGW1vV5enJGTsTU7zS8cDY5gxAwKQxJT9A50q3KBlcwp+PI9XQ4hxF602EBBvo7m5zD9bVVaFhg1nVg1RCWGvh31/N0MFfYZiDkyAFPEAZhu+OykCiY87gkYpHpj9FZ+SlKn9yXhc/eHBhWnIKQmYNuOLvsBESD/L1kO5uu+nFgkQgbY+Z+lNd1RynsOazPQINA6jz9a9ATAuQRM7TiD4OHUGXTAbroXBXZXCASnPpWlitfHVsQ8iMWDucUo5GWIGmEa0IgXyQtpiDBS5GgsDyorYqjCxoVhVhZP1A+sm8ptZgDwqhXCM/BN9YkMAzbDiqMUpI+tmV16OOfBJfP31AZqTAbMwJeMS+6t2KJWnEQg2qiPKfAGeW04xWkixMsmOetSkMG1xWcMChDGZV2RHXAKbKxDIMn32qOsDIqEtQhRZxZLyByhC6y2UvUzG76toqpYscK1qHocfzWmV8+9oZYBRibGyn03DAwNboqwl6SkRV2Yk07oxnyUcazX2Sk7Hy+4GhX7lLgAa0MJRpW1sV+51L3tN3Nf3QouHzxuix6YTlBp1tiLgwnEYndEBIvrBKclmFdVfHZxLzR3YUgUZF0wMVWVkkBawoMSoRekWHegIK1chQ6y54kY6kuzCkQpV5qNLLdRShTaXkL0esDJS0oO4T78JeImPvyNdHmNVIf8l6RSsi2R0lHYxsEN6NYNi4TMfUFGsz5Mysfb2zHAesxyYdC3lDyaf/2UNMfV1EjtRqit9phFncAVRRyL1XIsW94MA840GQOoEvV2URW0+2jcNANBXqbLxrrMSNgZ0GXM5POjDiYp81I01zF/cc4gAp96MoTZQ8FH3JXBOjXOep7vmp9z/OqRAQyae1oBgkB3Se9ttyqwqUbfNpcFEks5mmj1LkbyOcMoB64cpBNyp1GibjkDJB6NxblV6TkOe8zlcRzp2mPqNJvAXz5xjY8OT0RSNoVuKqrm0/TGeOFzTE8pBN4SkGKZgkC/9eVU+QTAo3VaVO3MJ/PrtaBoAcUlwnaQD6MQ8CrRcCKp6krIb4eSH6+vJzurtIR+el0CrPpdNHzQV9wvf7WP5At+254baytw9OLSx4e1cTI4+ls/v54fR2urYygo7OB1euzlP4jzEvmsWQp4pW2hc2NDajbGh7/9YRffxB/nNZ1fZcc2duk32zX164tNBBnJZN+47kFVMpUJrIpue3JsF9cXFDFTXh+QCnYTy2RypF/nh+SMA5v2SQXx//lJhsP6N4zu38LMABbc58tQ/iNogAAAABJRU5ErkJggg=='],
  ['Qobuz', 'qobuz', 'http://www.qobuz.com/fr-fr/search?q=%ARTIST%&i=boutique', false, '/%26/g, \'%2526\'',
   true, 'http://www.qobuz.com/fr-fr/interpreter/%ARTIST%/download-streaming-albums', 'removeDiacritics\ntoLowerCase\n/[^\\w]/g, \'-\'\n/-{2,}/g, \'-\'\n/(^-|-$)/g, \'\'',
   'Qobuz is the first music service that provides online access to all labels (majors and independents) and all artists in all genres of music in High Fidelity. Qobuz offers: Subscriptions unlimited music streaming True CD quality (16 bit / 44.1 kHz). Download in lossless True CD quality (16 bit / 44.1 kHz) on its entire catalog. Download HD to 24-bit / 192 kHz over 12,000 albums "Qobuz Studio Masters". Qobuz also offers extensive documentation on albums including tens of thousands of digital books, biographies and interviews with artists, and many exclusive editorial content. The purpose of Qobuz: offer the best music service in the world!',
   'png', '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'],
  ['Rate Your Music', 'rateyourmusic', 'http://rateyourmusic.com/search?searchtype=a&searchterm=%ARTIST%', false, '/%26/g, \'%2526\'',
   true, 'http://rateyourmusic.com/artist/%ARTIST%', 'removeDiacritics(artist)\ntoLowerCase()\n/[^\\w]/g, \'_\'\n/_{2,}/g, \'_\'\n/(^_|_$)/g, \'\'',
   'Rate Your Music (or RYM) is an online collaborative metadata database of musical and non-musical releases and films which can be cataloged, rated and reviewed by users. Rate Your Music was founded on December 24, 2000 by Seattle resident Hossein Sharifi. Unlike Discogs, focusing on electronic music, Rate Your Music was in its beginning more rock oriented, before gradually integrating every other genre. The main idea of the website is to allow the users to add albums, EPs, singles, videos and bootlegs to the database and to rate them. The rating system uses a scale of minimum a half-star (or 0.5 points) to maximum five stars (or 5 points). In this manner, Rate Your Music bears resemblance to a Wiki, as all of the databases content is generated jointly by the registered user community (artists, releases, biographies,...); however, the majority of new, edited content must be approved by a moderator to prevent virtual vandalism.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAXDSURBVFhHvZd7UFR1FMf3H236NxFZdkF6+dZ1RssepqCCYKNmWvhWMBEhUUpGwQIUy1eWrKMVkegKCviCeAkEvpIFXGYEsQxKce/ulRaY8Q/TP7+d89u7wLoLLup0Zr7Dj3vPOZ9zzv3tfag8NQCDZVkOlS2WPaQKUossSR1CvLYf28M+7KuEPbvZbDZ1u9W6757V2kkAeCL25RiOVdIM3Ewm0yBKkkQJHzwOGIAecA7OpaT1zDo6Onxlq7XGkejCjTs4ZmzF+eu3YZVcIE8W5eKcSvr+jcY2gq6rmQNNf95F+MkbGHOoAWMVzTE0opoKcoE8SZTTZrGMUDDurbOzU0PVCvj5xjsIymrCmxmNLnonsxF59X+7B/Unys0MBedstHMHkUMtO1Y2tWG24SZmHm3uU7NIJ+tvuwf1J2IwS8H2WLvFkswO11vNWJx3Cx/keKATt5B/beCXg1kK1m4Wi8WPKntopZNJZbex/NRfA1JWTdvANiexmKngqXtZTucTpdfNiCq481RKrWxDVbOEu2Y3QDdipoCbzeYX6cB97n57lYSNpeZnUnyZhLRqCfrfJGQYJRyps+snWh+6KuFwjeQo4j6zVXSjmM8HTK1WJFbJ/4uYJaZAbBUtxPgLmu4h7YrNIyVXWhFraMaqg/VYmV6HGFqnXvA8vpBYzGQ2F3CZ/znS8A9213T0qV1XbYih+8LsTUWY+OFR6BZkOemNJdlYsb8GOy+1u43vrSxiKQVcVvHNgf85UGdz68xi8NTIfBeok7go0lsrc7FaX4+USotLntRfLYg+0oTFadW4xwUQmyfwiAvYa3R2Zm0raUPIxiIXiG4h6xh0i0gfGez6+Dh04dnQLWblYOKSHLwddRYz4ksQuKkYU2itW5EL3co8TIrId0zgUZ8FrDlswiRO5gIhKRAdQXRLTwhNWJqDceFU2PKTBLGDJqzKx4TVpIhTGE8aF3ka49acgY6K6S6Ant3iEqQrlyCNNtP7SRVKN84Q3TJKzgDRSQ9kdPjP8JmeAO+p8fANSsSoZQaMJdCYT85i9NqzGBV1TmjkugKMiC7AlM2l4hIwW0WL7k2YRCOfGlvYA1FG1t3J6t6dnO6G+AZvh/e0LaStpESog3fg9ehCvLb+F7waQ4otwiuklz8tRsCGEszbUSImwGx+Boif4dHqFkym0Tgg4xlCcupkrXMnDoj3jFQMDUwmpcArMBVeQdvhv/4c/ONK4b+xFH6byqCNJ9Ff30UHkLD7uCiA2ar29nZxIyq/+kc/kMJenRQrnRRjOHXDkGHz9PCa8TW8ZrJ2YeisPdAQULO5AlpWQiW0cYXwCU2B97sbUFxhtBdAbHErpmtxnx8mQdvKCdR7XASJzIF2wX6oQ5LhE5ggpA5NhWZZhr2rz8uh2VCEoXP0GBL8LYaEfAd1RC78tlbBL7EK/iTNqkwMm/YZweMweWEKPbgkvv72WzEbVaPnijLKmmhcpWJU2qh8qMN2wvu9zX3KJzgZ2nW5BKmGPwG1ccXwS6jA8C8uIuDLi/CP4Rw7nGK+zy53/AL0As7W1dXlRxU9tNAUZu+7At8lGfCenuSx1HP3QhtpIOApDF+fB+2KTBo3Ff+YX1DEAVjMovuHzFTwdqOKUrgyY8PvCAj7yr6ZnqM4p/HaTUf3KQq2x5qbmwfTiTp2OFNWD9+Q3faN9RzEuTinAq9jloJ1tk5J0pKDJIo4b0LA3HR4zfrmmcQ5OJcCl5ih4NwbvSqN5DsUB9Q23EJQ9HHa2bTDn0Icyzk4F+fk3Aqmf1Nez40cyD+ZH/NrMTkiGy+F/uCR2JdjOFZ0Trn6fB3vy8SnmSxvow+Kf0USUtmlG9iir0JY/GmMWWqAZn6mEK/5GJ9jH369EzEUyzkG/GnW2/iTisa3n9TlKIQlHia95HSOfDnG488xT6ylpeUFmyyHUWL+Uq4kUCt12ClEaz7G59iHfZWwJ5hK9R8U62xhemfwPQAAAABJRU5ErkJggg=='],
  ['ReverbNation', 'reverbnation', 'https://www.reverbnation.com/main/search?utf8=%E2%9C%93&filter_type=artist&q=%ARTIST%&use_postal_code=0&geo=Global&sort=relevance', false, '',
   false, '', '',
   'ReverbNation.com is an online platform, launched in 2006, that develops technology used by the music industry, including artists, managers, labels, venues and festivals, for promotion, content management and cross-media licensing opportunities.',
   'png', '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'],
  ['Scnlog', 'scnlog', 'http://scnlog.eu/?s=%ARTIST%&cat=8', false, '',
   false, '', '',
   '',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAQHSURBVFhH7VdrTNVlGP9/87LUtaYtdV0+pEvzgpemYqEtdVqrlfNCo1RQmRdEUETQgYAgQmUhIAqoFWQIaoiB4i1QcDD1JJApKjABFVG8kBwPt1/v8/zf/8s5wNbpQ9AHfttv4zyX93nOcztDM4AuhgyrQ8q6HN0a3EBPAj0J/H8SKCwqw4zF2/HaNK9O6RPxMyyNTYhOOgnHhSGd2rw+3Rs3Ku5hx77j/HnKgmAcOHYBTc0tMoqO+mdmjPrIH5EJmXoCDWYLBk9dg15vuzLJeW9aDq7erFasrqnDjCXblc2YjzfhgummjQ0Fp7feeN9b2RFHzvHD3kO5MFsaOYHY5FPo57AM5VW1egKU0ZB3PW2c+o5eikW+e1B1r46d1ocfsNEfzy1ieXskpefZ2FnzzZk+XMGRH/rB2TuW7VULqkUgN/8E9BntZuM0aPJq/mbWCY79ZDNaWmzLSmhtbcXk+UGYvfQrDjRs5gabtwz2HuWKvEul7KNRye7WPtZ5/zHST1/GiDkblfELY5dxeQdOWqVkLuvj2nwkqc85hX+Kx91w4nwxP97Y1IzkjHxMnBuofImOziGsJ2irgr5H/3HLO+Vbs315iAhRP2bj5SmrO7V71WktntQ34AufOEyaF4TmdtVpFsll5V7hIR8wzh0HswqkRiRAZSOcyi/BsbMmZr7pBsva41mDBecuXld2Bk/mlbDOAL1ZUloldL93sCWWipYa4AQulZRz6YwShe/OkGodZJOYmoOh7+lzMHzWBkz/chsmfBagfJxcQtmuuLQSU523qvdoW8jWmoVFt+TLcgiXbIxXD704cQVq656y0sBOUf7eUj/+0wA0PNfX6VrZHeVHpFtivc5zPaK4HdSCw9kXkZJZgGw5Hwa0yrsPRR/dlZNH8A9SpePBo3q89M5KpU/NKpQa8HEy5LT78z2j1WfaJtPVCrbLOGNSct/IFJYZ0MLijrY5ibIVX6+UKh3UX0NPB+q5pYnl1TWPxIrqm0FrlZD6Gw+jYTvNJUy0hE0xyzWCZbRR5ZX3daGEtiJwv3KiBNaF/4StsemKBVdusSPpX3H0QHDML0wHcQtI1s9hOSLif+VgTiKo8RZtUIjw9/v6oJqHhV4xMmwbNDqxW3YegVdYcgcGRh3mHlIVKLH2+sjETJRZfSNqZ8B3hzrYGSy6dltatkFdQntwXlyvDxaHw9UvHv7fpCIo+gjcA/bxZaRjRPAMTYJZDqk9sCsBmvqaB08wSFzDYeKe048JJZAofrCoPZ+v28V2l/+owKYdafy3vfjHBGi3F6yNwZ6Us/x7QHtNwUN3HeWTSzNAA7f52zSe8Kd/maWnffhXLfgv0JNATwLdn0B3/n/IwQ1IWZdBj6ppfwONaZ4VPY21VAAAAABJRU5ErkJggg=='],
  ['SoundCloud', 'soundcloud', 'http://soundcloud.com/search/people?q=%ARTIST%', false, '',
   false, '', '',
   'SoundCloud is an online audio distribution platform based in Berlin, Germany that enables its users to upload, record, promote and share their originally-created sounds. In July 2013, it had 40 million registered users and 200 million listeners.',
   'png', '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'],
  ['Spin', 'spin', 'http://www.spin.com/?s=%ARTIST%', false, '',
   false, '', '',
   'Spin is a music magazine founded in 1985 by publisher Bob Guccione, Jr. The magazine stopped running in print in 2012 and currently runs as a webzine.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOySURBVFhHxZd7aJNXGMYPJGkVxL/GNrTabs62M4piFRVkZrJVYauWKYhFEKsWFMQL3m/I1CGb4KYVxi7VyVjqqq1W8NaCYvFaezGtpjU1Tc2laZOm2i/9stTKs/c98H02EBBE+hV+D+9zznvyPJD8U8F/yErNgDXVNqxQph4+aE1RCAwziizxKivV9mpSCgyBskWMJE7GCDhbFlDJGIEsoJBEP0+BEXC26CV5ScYIOJsKmGyRbAuMgLNFiCRExhC4QCdJMMuC90HfwY0IL85JepcMzhZeEn+mBe+DaFkJwisXJL1LBmeLdpLnZIyAs0X7BJPNPdECDd/CKYheLUfc+Qj9VRfRtbEA7swUdG9didC+9Qgst0G9dR3xNieUSju8uVb97YtTv8D/3Ww5R6+chy8vB0r5Gbmr3q6mt1/quwxnCxeJi4xG3NOG4O4iuOemw1f4LSJ/HoOLCvQUH0bMUYtozXV4l30BT+5k9Jz8AYO9PfB8lS3fxpoewr9mkZwH+xWo9XfhL8qnXSvCPx/A6/4o2ulz9Twu4CRxfmYB05I9Eq8HBuD+Zrr0QwlRgbjXg9bJoxPOI/bf8eLcaTmrVMBLBXjmAt51SxN21YZ7COwqenPGBZpImslodB7ZicGogpfVlfBtXYXHk0bJ8y4qED5zUt/T8KzOQ8zllLPqeEh+kZy5wNP52Qm7vZWlCBzconvOFg0kjRMsGErzzDHo2LEGffduQnU64LCORpAL/PNbwh7jXpsPtaVJzv1UwE0FeOYCT2yZCbsRKuCjAprnbFGbbrLVfWqGRv3EEfpcR0uxZ61oWTIXgROHMRAKonH6h2/uiXDF3+j6q1jOUSrgKsyTMxdoogJDd3voR/v8+82652xxl+Q+GcaROwUqBbbvXY/mxbPg3laIeHcn6qZ9AN+JQ+iruwOl8QHaNhSgZUUuukv/wH/+DtTPSpPvuUArFeCZv8bGeZly1ghftMNDBTTP2aKG5M4nZmg8yp+DwOliRG5eRfBsCRoWTJXn3uOH5HnDwmkI/nsKvTVV8P36E2pnjNHfen7co+/7S47jQc7H+h3j2r4WzQVf656zZYFbGWa8jQ4q4KcCye7eFVngBskNMm/j6YFNcB/dn/TuneECVSTV6WYYAWeLKyTXyBgBZ4tLJJfHm2EEnC0LXGJjBFygYqzJdmGcGUbA2aKMpJyMEXC2LFCWZoIhcAE7yVkyRsDZwp4uMuxpJqWUDoYTzuRs+R+y/SMqQW2GFcoUQoj/AcYuEhTfQmjrAAAAAElFTkSuQmCC'],
  ['Spotify', 'spotify', 'https://play.spotify.com/search/%ARTIST%/artists', false, '',
   false, 'spotify:search:artist:%ARTIST%', '',
   'Spotify is a commercial music streaming service providing digital rights management-restricted content from record labels including Sony, EMI, Warner Music Group and Universal. Music can be browsed or searched by artist, album, genre, playlist, or record label. Paid "Premium" subscriptions remove advertisements and allow users to download music to listen to offline. On computers, a link allows users to purchase selected material via partner retailers.',
   'png', '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'],
  ['Tidal', 'tidal', 'https://listen.tidal.com/search/artists/%ARTIST%', false, '/%26/g, \'%2526\'',
   false, 'http://tidal.com/us/store/search/', '',
   'TIDAL offers true High Fidelity lossless sound quality, a prerequisite to enjoying music the way it was intended by the artists. For a single monthly subscription, TIDAL is the first to offer both quantity and quality with an extensive music library of 25 million-plus tracks, streaming at more than twice the bit rate of competitive services. TIDAL subscribers will also be able to watch music videos, all ad-free. TIDAL\'s editors hand pick the music presented in the service, personally selecting and showcasing the best new albums and tracks across all genres every day.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAKESURBVFhHvZVJaiphFIVLAyEDJ4qjBKPo1BayhDg0CCoqToJkG4HY4QZMJARFcAUiuAqbsQ1RHIQQp1FjQ27e/R+/qeZW6UNe/fCBde6pOsdqBdECnZEsyqAHbFEDPSFFPSFFPVGKTqdToVGcnp7CxcUFOZPjcDjAaDRSM6mQyWTg8/MTrq+vJbocDG80GjAej/cW9nq98P7+DtVqlSrxu5HL5eD7+5sxn89VS2B4s9nceSeTiWoJDP/4+Nh5a7WavMTfH/l8fmfiYIlgMCg2K8I5VAmfzycJ58hKCFAoFBQmjrjE2dkZtFot0odMp1NwuVzM6/f7YTabkT6kXq/DyckJCMVikTSIwRKhUEgznIMlotGoZjgHSwh3d3ew3W5JAwdPI57O5+dnci6m1+tBIBCA0WhEzsXgZWeXIJ1Oq5bAcLyR0GcwGKBcLpM+pNvtgtVqZd7Ly0sYDoekD8lms8zHCiBUCXx0PB4PNzKwxNPTk8SHdDodsFgsEi++IwaDgcKLj7rI97vD7e0tbDYbZsJwt9stNu7AEo+Pj7sDUuEceYmHhwe5R7LBSry9vamGiymVStBut8FsNpNzzvn5OfT7fbi/v6fmCgFMJpNCo8DrHIlEyJkcjWOS4l5sNhu70xeLBXtEKc+BkKIm+M9fX19313W5XB5TghRVkYeLS9zc3JD77IEUSex2O/v6ycM5X19fEA6HyX01IEUF+B045O2GJa6urshjqECKJKlUCtbrNRnMUfnma0GKqiSTSdUSlUrlX8MRUtQkkUgoSry8vLA3JOXfAynuJR6Pw2q1OjYcIcWDiMVi7JtwRDhCinpCinpCinrCFjXQA8miDP+TP0sQfgAbiI7MBa0d0QAAAABJRU5ErkJggg=='],
  ['Tumblr', 'tumblr', 'https://www.tumblr.com/search/%ARTIST%', false, '',
   false, '', '',
   'Tumblr is a microblogging platform and social networking website founded by David Karp and owned by Yahoo! Inc. The service allows users to post multimedia and other content to a short-form blog. Users can follow other users\' blogs, as well as make their blogs private. Much of the website\'s features are accessed from the "dashboard" interface, where the option to post content and posts of followed blogs appear.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDRjVDRjVGRkNEMjA2ODExOTk0Q0JENjYyMjkyMDY0NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0OUE5MzczQzJDNzUxMUUwODZENEY1QzQ4MzY2ODM0MiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0OUE5MzczQjJDNzUxMUUwODZENEY1QzQ4MzY2ODM0MiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNGNUNGNUZGQ0QyMDY4MTE5OTRDQkQ2NjIyOTIwNjQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNGNUNGNUZGQ0QyMDY4MTE5OTRDQkQ2NjIyOTIwNjQ3Ii8+IDwvcmRmOkRlc2NyaXB0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'],
  ['Twitter', 'twitter', 'https://twitter.com/search?q=%ARTIST%&vertical=default&f=users', false, '',
   false, '', '',
   'Twitter is an online social networking service that enables users to send and read short 140-character messages called "tweets". Registered users can read and post tweets, but unregistered users can only read them. Users access Twitter through the website interface, SMS, or mobile device app. Twitter Inc. is based in San Francisco and has more than 25 offices around the world. Twitter was created in March 2006 by Jack Dorsey, Evan Williams, Biz Stone and Noah Glass and by July 2006 the site was launched. The service rapidly gained worldwide popularity, with more than 100 million users who in 2012 posted 340 million tweets per day. The service also handled 1.6 billion search queries per day. In 2013 Twitter was one of the ten most-visited websites, and has been described as "the SMS of the Internet."',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADeElEQVR4nL2XP2wbVRzHP2f7znHv4j/BMY5cqzJYYqkgTEg0C1O9wAAL6gBIHdkYEBKoiI7e6VAJqclQJndADEZIsAQJTynIHVIsjNRacR3HvpzvmuSefWZI7OD4znHS4O90er937/u59+f3fie98/1fCnAL+ARIMRvVgHvA7QDwjaxFv5C1KJI/MBP3fq+bEqb+pTB1vw+4Kc/HZmYOIPkDyPMxgJs+YFHy+WdmPoQ49Fz0zdz5hC5+3vv942dJmh3A860qfac31q5E4shaFNvYQXTahBJpfHJwMsBe4wmOOBgZwEu9fYv9nS1ymTAfXY2RVOVhrFg1uLPRxNxtspwI8caVBVbLT1BT2ckAjjjg7vU0Ff2AfKkB4Amxv7PFp2/G+eC18XguE2Y5EQIgqcrcWt8icGl+pM84wNEaZmNBsrHDqcqXGnSfdwgl0iNdbWOH5UTI1XygwYxU2ge8nVIBi99bzwjGXgbg1FOQy4S5ez1NQnGwahWEqQ9jotPmWko9bYjhB1m2w/pTa2gObjNwtHNN20FTfMOX7797hWLV4MHjXSq15rD7q7Hg2BBu+najSWFTZ+6lpZF2z1NQeKzz8dWFkbZcJkwuE6ZuCX57amEKB02eLpUUNnUuLWU4mfQ8AVbLLa6l1OE++K+Sqjxx3b0kSeOwnpvwlw+zY6HzyrSdAcFYbBzpqNPDxt6FAUway3UBAyGNtXLrwgD+2N7zvG1dAYILSR429siXGsfT9wL6qWoQirvXOp5bWE1lKVYN3nvw9wuZF6sGpu0gBWTXuCdAvyvQFB8/vP/Kuc1N22Gt3EaJxD37eAJIARnTdvjs19q5l2H1UYu6JSZeZhOziJrKUmkfcOPHfyhs6tQtMbV5sWoMk88kTQSwd49T7mHWm650K1YN8qUGSiQ+lvlOyvVsCFMfmt9eWWLl8nQXjmk7rD5qUdjUT60jJgLYu00+fytBLhOeyhgOv3qt3KZuCdecfyYAJRInX2pwZ6PJSkrj9cQcSVUmGw2iKT7qlqBudalbgj8b+6zXTEzbQYnEUVNnuyNcAWQtiqxFcbqCn2vPKFYNzwH8yhzBWBrV45yfC2AgKSAzt3h5tLHfn6ranVZn/y+4QPMBwLZbOf1/68hz2wd8Jzpt+r3u7Mx7XUSnDXAvAHwtTF0Rpn4DSM6IoQ7cB776F2hFQPDrlggRAAAAAElFTkSuQmCC'],
  ['Vimeo', 'vimeo', 'https://vimeo.com/search/people?advanced=1&q=%ARTIST%', false, '',
   false, '', '',
   'Vimeo is a U.S.-based video-sharing website on which users can upload, share and view videos. Vimeo was founded in November 2004 by Jake Lodwick and Zach Klein. Vimeo was founded in November 2004 by Jake Lodwick and Zach Klein, who left the company in 2007. The name Vimeo was created by Lodwick, as a play on the words video and me. Vimeo is also an anagram of the word movie. IAC/InterActiveCorp purchased Vimeo in August 2006, as part of its acquisition of Connected Ventures. In January 2009, Dae Mellencamp joined IAC as General Manager of Vimeo. She served as the CEO of Vimeo until March 19, 2012 when Kerry Trainor joined Vimeo as the CEO. As of September 2013, Vimeo\'s search feature requires Google Analytics to work properly and users of Firefox and Chrome web browsers cannot search on Vimeo without disabling privacy protection. As of December 2013, Vimeo attracts over 100 million unique visitors per month and more than 22 million registered users. Fifteen percent of Vimeo\'s traffic comes from mobile devices. As of February 2013, Vimeo accounted for 0.11% of all Internet bandwidth, following fellow video sharing sites YouTube and Facebook. The community of Vimeo includes indie filmmakers and their fans. The Vimeo community has adopted the name "Vimeans", meaning a member of the Vimeo community, usually one who is active and engaged with fellow users on a regular basis. Numerous popular entertainers have used Vimeo to host content. In 2009, Britney Spears used Vimeo as a platform to premier the music video for her single "Radar". The White House posts high-definition versions of its broadcasts to Vimeo. Vimeo has helped to offload traffic from Improv Everywhere\'s servers after new pranks are announced, and continues to host most of their videos. Vimeo was also the original location of Noah Kalina\'s "everyday" video, a popular viral video.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M0BrLToAAAABV0RVh0Q3JlYXRpb24gVGltZQA2LzI0LzA59sFr4wAAAjpQTFRF////////AAAAAAAAKioqAAAAAAAAAAAAAAAAAAAAFBQUSbHNRq3KH3mmHmaNR7XVGHWwTLrZR7PVJIK7Em6tDHC3DnW7E4nFFHq8Fo7GFpTKGZnMGaDQG5rMG6HQHaPRH6TRIKXSIqbTJJPIJKjTJYzEJZXJJqnUJ6rUKI7FKYjDKavVKorFKqDPKqPRK43GK6zVLKDPLZDHLaTRLarULazWLa7WLpLILq/XL5TJL6PRL6XSMJbLMLDXMafSMazVMpjLMqrVMrHYM5vNM67WNJ3PNK7WNK/WNLLYNZPHNZfKNa3VNbTZNp/PNq7WNrDXN5bIN7XaOKHQOLDXOaPQObbaOqbSOrTZOrXZOrfbPKjUPLjbPbHYPqrUPrXZPrrcP6vWP7bZQJfIQLfaQLvcQa3WQbzdQrDXQ73eRLLXRb7eRrTYR7zdR8DfSLXaTJzJTq3TT6HMT73eUMPhU7TXV7DWV77cWcDeWr3dWsHfW6bPW7fYXLfYXLfZXbjYXr/dYK3TYMPhYr/cYsDdYsHdZajNZajOZqnPa8PebMvlca3Pcszld7TXfdLnfrPRf9LogMPbgMTdgszlg8nfi8bdkNLnmtDhm9PlntfrpMXYp9fnqNjqqsvertLhr8rYuODuwd7rx97lx+jzydzoytfezubtz+fv0N7k0enw19zg2N7i2ujv3ePn4Ofq4uLi4ujt5OTk5ubm5uzw6Ojo6urq7Ozs7e3t7+/v8fHx8/Pz9fX19/f3+fn5+/v7bd+UPAAAABV0Uk5TAAIDCgwNDiUwMTORkqK12uXn6O7x7LQiJwAAActJREFUGBl1wc9LFGEcwOHPO/N1NDNbrDQsyIo8SFSXqHunqEMEHeoWRIeCLv0dEQR1lYIunrpF16ioi4foEKTlsFhp6yKLuuv74zvN7Gg/cOd5DJjB5Ca9TNuNDIMZvjMSReyk2nzSygxDd0eWLb0ko83Ha0IymNJbOx1LMNxTTxWJHglhM6JKpx9BUSopgjq2NL5PDpDr1Jc4dJRCjKCerjB78cJrARaGr+znx4c95BTBKYWV+v0DjD7bx89Lx/ug9muJnEMIntzX07cSGDqVcmaKwsQiOUEIHpi7MUVh0DevGgotTy4geAfcnmiOUHDn5mtHgM3UketDUA/Mrr69Ngao/8j5CWB5kYIiqAXSlLWDgLE0DhvovLcUFME5upZPAOral8eBL9/ocggdR5cYwHZGzxpYeEGpQ4RueWlyY6vXdxlTn9ZtCMFSMsDkg35ovLJsCQjeUWrthQGgMTPHNo8QAqX1GoWVpyl/BATNKDlDrv68zl+K4AKl+WPA54f8yyEEpTQzXtt4847/BAwn16m2+5OgPqZKUGLUxFRxrbZg+3xMbyGzSNSOEx9H7KQhs+1ITGw1UXrJrI8zAXWOChmYyESGKplmvwFhk85THbgQpwAAAABJRU5ErkJggg=='],
  ['WhatPeoplePlay', 'whatpeopleplay', 'https://www.whatpeopleplay.com/search/artists/%ARTIST%/showall/', false, '/%26/g, \'%2526\'',
   false, '', '',
   'Whatpeopleplay.com is the digital download site of Wordandsound (Medien GmbH, Hamburg, Germany). Wordandsound is one of the market leaders in forward thinking electronic and alternative music offering fine Vinyl, CD and Digital Distribution Formats to customers around the globe.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAASoSURBVFhH7Vb7U1NHFOYvamun79e00xdCq6FSW0cQdbRKdTotsUFEdErF1xRLgmCqDYQQHuGVyLMhAZpCk4AQZqACQmIhVaa2KNRAIEjydffc3JBAptIfgF/8Zs7cs2fPnvPt7tndGyNi69MKbKQE0wqI5rARsqnJRVlFIPYpOX33vF+E/DPtkKZUR/SvRcQYa5EIAoXnOvDH+AOcPlqPk6kGcOi1/REDHicFZ4UYp1gM3tZeseHwR9pVfqJEECgttFPSc7JmZIYRiN+Sj6R3Vdj+QkHEYN5Ofq8Iia8qQzZNgY3G8Ri8vS9OjYSXr5Cf5MXCkJ8oIQKXc9rh+WeeBk/fn0P3L7dJt3e44L49xbQA5mYXcOm0ifx1qhuY9y6SfWnJj4HeO6gquhEWw4ur31nQWDWARd8S+fkWHsGo/w0fPnd5NYGvknXos47T4PamYZQpu0n3LwVg0DpIAgGwpD6c/NzA9ABGb/6J3KxWmOuHyPdm/10WY4J0HuOn2kHSO5pH8G1aI3q7fmetAL4PTiKCABdxC86ntwRrIABbhzPYL8fdiWnql6ZUIUfahNRELQ6x/dWpesjOiQhbEMB5WUtoEg77BM4ea8aRnWX4el81bYuY8zEEAEPZchE6R/4iG09qY1uz6HvEVsKP+397yL6SwIFtGky6p2m1uI1/Bx13sPf/EAg/Bc6Re8wSgOm6sOQ1JX3Y/faPkO2vofZKAh+//gMVb8bBOnYa7HDdEiZgMd4KxYxKoCTfigvHW0iPRkDc5zNsGyQvFVJhcSwTANQKKy0991de+BmJrymRdeQ6ta3trlDMCAL86IjLxQuKQ8+KT+wXCeR9Y6bK9/v9tA393W6y97OEfPXEGL+2OTHzYI50P/Pn9tmHC0hLrgrFjCDA5TNJKU4cqqPvwe0a7HrrWqhv71Y12T54Nh+pO7Ssms2sqGronuB2LnHP5Adj6JESy+4INvPsLxsgZ6R54e5842pEvlUENlqeENh8AsqLFhSwd4AXyaVTJlw8YWSnoQU5x5pY8TTSy5h52IDjB+roFuNX9he7KnH0kwoqRF54++PV2MMKbvc7Knz65jU6/zteUSKBHdFtzxfQ3R/PCjdui4IVqZhcjlgmMeyMrBsCfuGh4o/RwvwivLM+OoYPZ7zssZrF1D3P+hJYC54QiEpgcnIS8/PCjwWHz+fD3By/Uv8bPT3CsxyOhoaGoBYdIQKjo6OUeGBgAJWVlWhtbUVvby8sFgs6OzthNpuhUChQUVGB+vp6lJeXU3C1Wg2tVguVSgWlUkljDQYD0tPTkZGRgbS0NOh0OmRlZSEvLw8OhwN2u/DocYQIcGNbWxvkcjmsVitmZmZQXV1NOk/idDpRXFyMkpISZGZmkh9PWltbSzonK5PJIJVKiQj/8oRJSUnIzs6GRCKhOAkJCfB6vcGsYQTcbjc8Hg+Gh4cxNTVFyz42NkYEBgcH0dfXR4n5inDdZDLRbIxGI3Jzc6HX6zE0NET9NpuNEpeWlpLOfTQaDbq6umhFwrHmIuRP6fi48M+4EtHsLpcrqC2DE+eTC8eaCawXNp8AR1DfcFByEUHbhkHIGhPzL55X8rj4ubC7AAAAAElFTkSuQmCC'],
  ['Wikipedia', 'wikipedia', 'http://en.wikipedia.org/w/index.php?search=%ARTIST%', false, '',
   false, '', '',
   'Wikipedia is a free-access, free content Internet encyclopedia, supported and hosted by the non-profit Wikimedia Foundation. Anyone who can access the site can edit almost any of its articles. Wikipedia is the sixth-most popular website and constitutes the Internet\'s largest and most popular general reference work. As of February 2014, it has 18 billion page views and nearly 500 million unique visitors each month.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1MzmNZGAwAAABV0RVh0Q3JlYXRpb24gVGltZQAyNy8zLzA56KykjAAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAwOS0wMy0yN1QxNToyODozMVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAwOS0wOS0wOFQyMzoxMzowMVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgpRAV/wAAAapQTFRFAAAArKysxcXFxcXFpaWlpqamp6envb29wMDAwcDABAQEBwcHCwsLDw8PEhISFhYWGRkZGhoaHR0dISEhJSUlKCgoLCwsLy8vMTExMzMzNTU1NjY2PDw8QkJCQ0NDRUVFSUlJSkpKS0tLUFBQU1NTVlZWXl5eYGBgYmJiY2NjaGhobGxscXFxc3NzdnZ2eHh4hoaGiIiIiYmJjY2Nj4+PkZGRlZWVnJyco6OjpKSkpaWkpaWlpqamp6enqKioqampqqqqq6urrKysrq6ur6+vsLCwsrKytLS0tbW1tra2t7e3uLi4ubm5urq6u7u7vLy8vr6+v7+/wMDAw8PDxMTExsbGx8fHy8vLzMzMzs7Oz8/P0dHR0tLS1NTU1tbW19fX2tra29va29vb3Nzb3Nzc3d3d3t7d3t7e397f39/f4ODg4eHh4uLi4+Pj5OTk5eXl5ubm5+fn6Ojo6enp6urq6+vr7Ozs7e3t7e7t7u7u7+/v8PDw8fHx8vLx8vLy8/Py8/Pz9PT09fX09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////F171MgAAAAp0Uk5TAJCQkfPz8/Pz83vstw0AAAK1SURBVBgZBcHNbtZVEMDh38w584JA1SCYAG0ENGK0fiTWAHVLjAsT9QJY6J15BW51oys3qGlCE4hgiJa2FAKC2Jb3/86ZGZ9HaLPPSyGVRKuURBMUkh88RL8+f8pSExEgFVJTUxOova3vu104TUa0oAERNDKiZbQSOZuz9sXbKaO0UocMEZEaqSklI6U4NuvRYjQqWuloo0WLRlURtKJ69aqM6AOBkAhEcqguehDATDo1YRmEERrmioNbBuZdJDvVPN0gvWXLljRvmQ7ZqjJ65iRTD0bP7KNHi2JiAqYOJr2QQXRk6kQIU0cAGD0Ys+hF1c/bANd/2gG++XEHzl37DuB6E2kX3zioj17ajqPfLj6cP4krJz+4Pfvq4+no/b765SJtS6VUnr75Th0+1GeXz9a9uvPvZ0ee1ntLl9ZfVJEa4SUvLve64bK/3h9sb5w54ekb09X9gZRoJZm5f64eiIucq43Hn8xT5O5bhykjM1SSGqXrzX+pYr09Or1Umreer45RWolGpYtkLdd2ZtbJWrjkuLvcU9JTUanMdK9P2+HvmXt79eiR5+3nVydxTx+hJUNDtXg996o2T6zmzRr3VlSrSpXSqjExZY61enJrb2ftct99/MeTd0fmkJGIjlKda4z58eXavnlq5b+VuvPn8qvzmEcs5pEqMU0tp0X6Wu3urr6YVuvvf9amnDKnTB1Kw9wBllbqtYvwyoqvHKcbYAYK5gbA4ny9/ww7OF8Xhgtm5kTrAebmmHPp2l9zNy5du39gjrkZRBfccHA42KQDB5sg4OCAKrgZZgaoGM0NOmY4Bh0w3HAsDMfCHAPHHKVpTUfw7mDewMxxAAxMbYT++nBpZmKAFQAGlAPokWMPfuu+W2deDmhEI2gBNIJGtGlrdwjSrow+OgM6o48e1UfPhM4Nr/8BUnnSnwJjWWsAAAAASUVORK5CYII='],
  ['WiMP', 'wimp', 'http://play.wimpmusic.com/search/artists/%ARTIST%', false, '/%26/g, \'%2526\'',
   false, '', '',
   'WiMP is a music streaming service. The service is available on mobiles, tablets, network players and computers. The service is made by the Norwegian company WiMP Music, which is owned by Swedish Aspiro AB, listed on the Nasdaq OMX stock exchange in Stockholm. Music in WiMP is streamed using the AAC+ file format in a bitrate of 96 kbit/s or the AAC file format in a bitrate of 320 kbit/s if the high quality streaming option is selected. WiMP also offers a HiFi-product with FLAC/ALAC.',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAATJSURBVFhHtVdrbBVFFF6NGprevTWBpIkhNT4TSMREghAKdxdtIdrex1ba1NDSUmoErVS0/CjBK8FSFcUSUUyIf4j4gn8YU5SXCIlJE0UNMZGWNEFra21BCrW0Xns8Zx47s3t3b2sTv+RkZs6c833nzs7O7DUAwJgpFhoLb7UMa5YYzgz/pYBEgVXimHa7Y1pHnaj9E1o/2h9OgX0R2zNo+xNmbG08f3GhSJkaUxWAv/CWlGltQeGeioIV4DXbN+Y+LGQM7YNkfuwBQROOXAXEo7HSbOEgUd30eRtSpr0DqW7mjAEIKyAVjaWzCaey4FhcjdNIeRNn9iGogFTUPsCTiTCsgCC/38fHb294FWXggKD3wl8Aiotfnk00vTH11fiJ2x+Bv0ZGqQBCWsgooFP0+C5XRGEmyYOK0I37d9WmubRCiZDjQAdr5xvzb6Pd6yXNZf4Cgu2rT77ksgpjTFACHaxNmlZLEEG2TU9YWl/3JS6rIWnGHk8YS00mjGPWpqLW795kXUguqzR/jH+e+2vvjEPm7wxXFfjmyNdszolYq5kw+oxkvmWHk+p+fZzLeFzDfRUwOTnJlQVaS5vYnGPGPlIFmLF2L0GY2ZAufx72bXoTOta/AhsfXOP6s4uzoWpOKYxcvsqVEZlMBurvTrF53G8DbgF4WnUqguB208P10HPuZ86k4eSHR6FydomI1Y3ybDh/5pyIBBi9eh2qC1e5MfGodS8rAKvp9SdSHy8Z1lbNKYGR4T85SwB6f+wWuTJf9lfAZ/sOiyiAG6NjUFNU5sYlo8tXyQJG/YkyiNrtyRbOgPjh1Lew7bFm2L1uh37A4Ep0Bua+27RLRHBsWPCkO4/HfZVWgJ7oLWb/i3tY8sSNcVzuR13/sw/VenY5HToqj3NsXdkkZjk2Fze6c06BVckLwPtcJerGA2UBg5cGXJ+0dPlmNkeYGJ+ASnxcKsZme0fHFutpN9fB21ZswhhuQiWo+nzcsb6NJV+/co3tBxXD404c7GTzhK7Pz7p+av2P4LlFdWJe34Sm1SadurBsXypr5tkI9QyV0YWjb9LvjnfBG3Xb4b3m3WznS9AKVReuxBz20dLvvobxyLJiIqq/JwWN81azAL2QxnmVnAFBG5ALyyK5teDSTgW6F2Q8fmUddAugc5muYXpn+3p+gdOfHsMgXcCG4f4hRtJevVXze21nVSuLCcJQ36A4hDgvewVlAQQnz5q7Zm4Z7uwauHZlhF0inJivBBVGeDn5gkuiTI2bF6+DUx9/AQO9v8HlgWG4+P0FOPLOISBuGetErV+ZKEEWkMhbegc+l38kEYHeeaqall2ipqjcJZKxYYZCE7zvjU1ElseYKAE5RQ9vxMgySwbV3ZX0HDT0vu95qk2Q5BLPXRh+5PJLSAK5RY8Dr+VWlWDD3o2vwd5nXoeG+ytcn1ckaKy3yo8rcgElvB+n/gIIuCHfyibxE4ZZtjATN+3ulLlotpBQCCqAgCuxzUs0XeOCeiH4y8/iH5yIoPYirAACHZWYfF6R6a1XJGgeN/W4+GMSjlwFSOBR3YBEXcFi2YbCg/gYO8pnFRcJinBMpwAJ+nTDE2yn78/pEFovLTPa+/iptbbUWJAvUv4/0F/zJcaSPDGcIQzjX5mBSLYDDTZXAAAAAElFTkSuQmCC'],
  ['YouTube', 'youtube', 'https://www.youtube.com/results?sp=EgIQAg%253D%253D&q=%ARTIST%', false, '',
   false, 'https://www.youtube.com/results?q=%ARTIST%', '',
   'YouTube is a video-sharing website headquartered in San Bruno, California. The service was created by three former PayPal employees in February 2005 and has been owned by Google since late 2006. The site allows users to upload, view, and share videos, and it makes use of Adobe Flash Video and HTML5 technology to display a wide variety of user-generated and corporate media video. Available content includes video clips, TV clips, music videos, and other content such as video blogging, short original videos, and educational videos. Most of the content on YouTube has been uploaded by individuals, but media corporations including CBS, the BBC, Vevo, Hulu, and other organizations offer some of their material via YouTube, as part of the YouTube partnership program. Unregistered users can watch videos, and registered users can upload an unlimited number of videos. Videos considered to contain potentially offensive content are available only to registered users affirming themselves to be at least 18 years old. YouTube, LLC was bought by Google for US$1.65 billion in November 2006 and now operates as a Google subsidiary.',
   'png', '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']
];
//[0.name, 1.label, 2.searchurl, 3.lucky, 4.urlreplace,
// 5. usealt 6.alturl, 7.altreplace
// 8.description,
// 9.icontype, 10.icondata]

var extFields = {}, externals = [];
extFields.ext_custom_total = {
  'type': 'unsigned int', 'label': ' <b>Custom external sites</b>', 'size': 1, 'min': 0, 'max': 50, 'default': 0, 'section': ['', '<b><u>Custom External Site Settings</u></b>'],
  'title': 'Number of custom external sites to add\nMust be a positive integer (0-50)\nAfter changing this value, save and complete exit the settings to reload page, and reopen menu to add custom external sites',
};
for (var i = 1; i <= customExternalsToAdd; i++) {
  externals.push('customext' + i);
  extFields['ext_customext' + i + '_name'] = {
    'type': 'text', 'label': ' <b>Name</b>', 'size': 16, 'default': 'Custom External Site #', 'section': ['', '<b><u>Custom External Site ' + i + ' Settings</u></b>'],
    'title': 'Name of the tracker\nDisplayed in the tooltip\nDo not use this value in the ordering fields - use the Variable Name below'
  };
  extFields['ext_customext' + i + '_label'] = {
    'type': 'text', 'label': ' <b>Variable Name</b>', 'size': 16, 'default': 'customext' + i, 'save': false,
    'title': 'Cannot be changed\nUse this exact spelling in the ordering fields'
  };
  extFields['ext_customext' + i + '_searchurl'] = {
    'type': 'text', 'label': ' <b>Search URL</b>', 'size': 48, 'default': '%ARTIST%', 'title': 'External site link search URL'
  };
  extFields['ext_customext' + i + '_lucky'] = {
    'type': 'checkbox', 'label': 'Google Lucky search', 'default': false,
    'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search \'site:domain "searchTerms"\' URL'
  };
  extFields['ext_customext' + i + '_usealt'] = {
    'type': 'checkbox', 'label': 'Use alternate URL', 'default': false,
    'title': 'Use the alternate URL (for direct link to artist page) instead of the search URL above'
  };
  extFields['ext_customext' + i + '_urlreplace'] = {
    'label': '<b>Pattern/Replace</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
  };
  extFields['ext_customext' + i + '_alturl'] = {
    'type': 'text', 'label': ' <b>Alternate URL</b>', 'size': 48, 'default': '', 'title': 'External site link alternate search URL'
  };
  extFields['ext_customext' + i + '_altreplace'] = {
    'label': '<b>Pattern/Replace</b>', 'type': 'textarea', 'rows': 1, 'cols': 24, 'default': '',
    'title': 'Regexp patterns and replacement strings to apply to the alternate URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()',
  };
  extFields['ext_customext' + i + '_description'] = {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': ''
  };
  extFields['ext_customext' + i + '_icontype'] = {
    'type': 'select', 'label': ' <b>Icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png', 'title': 'Type of image (extension)'
  };
  extFields['ext_customext' + i + '_icondata'] = {
    'type': 'textarea', 'rows': 4, 'cols': 96, 'default': '', 'title': 'Base64-encoded image'
  };
}
for (var i = 0, len = extData.length; i < len; i++) {
  externals.push(extData[i][1]);
  extFields['ext_' + extData[i][1] + '_name'] = {
    'type': 'text', 'label': ' <b>Name</b>', 'size': 16, 'default': extData[i][0], 'section': ['', '<b><u>' + extData[i][0] + ' Settings</u></b>'],
    'title': 'Name of the tracker\nDisplayed in the tooltip\nDo not use this value in the ordering fields - use the Variable Name below'
  };
  extFields['ext_' + extData[i][1] + '_label'] = {
    'type': 'text', 'label': ' <b>Variable Name</b>', 'size': 16, 'default': extData[i][1], 'save': false,
    'title': 'Cannot be changed\nUse this exact spelling in the ordering fields'
  };
  extFields['ext_' + extData[i][1] + '_searchurl'] = {
    'type': 'text', 'label': ' <b>Search URL</b>', 'size': 96, 'default': extData[i][2], 'title': 'External site link search URL'
  };
  extFields['ext_' + extData[i][1] + '_lucky'] = {
    'type': 'checkbox', 'label': 'Google Lucky search', 'default': extData[i][3],
    'title': 'Search uses Google Lucky (&btnI)\nOnly affects search URL if it is a Google Search URL'
  };
  extFields['ext_' + extData[i][1] + '_urlreplace'] = {
    'label': '<b>Pattern/Replace</b>', 'type': 'textarea', 'rows': 4, 'cols': 24, 'default': extData[i][4],
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()'
  };
  extFields['ext_' + extData[i][1] + '_usealt'] = {
    'type': 'checkbox', 'label': 'Use alternate URL', 'default': extData[i][5],
    'title': 'Use the alternate URL (for direct link to artist page) instead of the search URL above'
  };
  extFields['ext_' + extData[i][1] + '_alturl'] = {
    'type': 'text', 'label': ' <b>Alternate URL</b>', 'size': 96, 'default': extData[i][6], 'title': 'External site link alternate search URL'
  };
  extFields['ext_' + extData[i][1] + '_altreplace'] = {
    'label': '<b>Pattern/Replace</b>', 'type': 'textarea', 'rows': 4, 'cols': 24, 'default': extData[i][7],
    'title': 'Regexp patterns and replacement strings to apply to the alternate URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()'
  };
  extFields['ext_' + extData[i][1] + '_description'] = {
    'label': '<b>Description</b>', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': extData[i][8]
  };
  extFields['ext_' + extData[i][1] + '_icontype'] = {
    'type': 'select', 'label': ' <b>Icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': extData[i][9],
    'title': 'Type of image (extension)'
  };
  extFields['ext_' + extData[i][1] + '_icondata'] = {
    'type': 'textarea', 'rows': 4, 'cols': 96, 'default': extData[i][10], 'title': 'Base64-encoded image'
  };
}
extData = null;
// +------------------------------------------------------------------------------+
// |                   end EXTERNAL SITES ADVANCED SETTINGS MENU                  |
// +------------------------------------------------------------------------------+

var gmc_opext = new GM_configStruct(
  {
    'id': 'ExternalsMenu',
    'title': oinkplusIcon + ' External Sites Advanced Settings Menu',
    'fields': extFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function(doc) {
        var config = this;
        var icontypes = doc.querySelectorAll('div[title="Type of image (extension)"]');
        var icondatas = doc.querySelectorAll('div[title="Base64-encoded image"]');
        for (var i = 0, len = icontypes.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '')
            icontypes[i].firstChild.nextSibling.innerHTML += ': <img title="Icon preview" src="data:image/' + icontypes[i].firstChild.value +
              ';base64,' + icondatas[i].firstChild.textContent + '" style="width: 32px; height: 32px; border-width: 0px; padding: 0px 0px 0px 0px;">';
        }
        for (i = 0, len = icondatas.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '') continue;
          var input = doc.createElement('input');
          input.type = 'file';
          input.id = icondatas[i].firstChild.id.replace('_icondata', '_filebtn');
          input.multiple = false;
          input.title = 'Click to add a local file and automatically convert it to base64';
          icondatas[i].appendChild(input);
        }
        var iconfiles = doc.querySelectorAll('input[title$="convert it to base64"]');
        for (i = 0, len = iconfiles.length; i < len; i++) {
          iconfiles[i].addEventListener('change', function(evt) {
            var replacementtext;
            var thisid = this.id;
            var files = evt.target.files;
            var file = files[0];
            var fileExtension = file.name.toLowerCase().split('.').pop().replace('jpg', 'jpeg');
            if (files && file) {
              var reader = new FileReader();
              reader.onload = function(readerEvt) {
                var texttoreplace = thisid.replace('ExternalsMenu_field_', '').replace('filebtn', 'icondata');
                var binaryString = readerEvt.target.result;
                var base64String = btoa(binaryString);
                config.fields[texttoreplace].value = base64String;
                config.fields[texttoreplace].reload();
                if (['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'].indexOf(fileExtension) > -1) {
                  var typetochange = texttoreplace.replace('icondata', 'icontype');
                  config.fields[typetochange].value = fileExtension;
                  config.fields[typetochange].reload();
                }
              };
              reader.readAsBinaryString(file);
            }
          }, false);
        }
      },
      'save': function() {
        valuesSaved = true;
        var config = this;
        GM_setValue('custom_externals', config.get('ext_custom_total'));
        config.close();
      }
    }
  });
gmc_opext.init();
// +------------------------------------------------------------------------------+
// |                  init EXTERNAL SITES ADVANCED SETTINGS MENU                  |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                        TRACKERS ADVANCED SETTINGS MENU                       |
// +------------------------------------------------------------------------------+
var traData = [
  ['orpheus.network', 'orpheus', '1', true,
   'https://orpheus.network/artist.php?artistname=%ARTIST%',
   'orpheus\\.network/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'orpheus\\.network/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'orpheus\\.network/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/torrents.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'box torrent_description\' || (divs[i].className == \'box\' && divs[i].id == \'artist_information\')) {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'var titles = document.getElementsByTagName("title");\n  if (titles.length > 0) {\n    var str = titles[0].textContent;\n    str = str.replace(/(.+?) - (.+) \\[\\d{4}\\]( :: What\.CD)?/, \'$2\');\n    return str;\n  } else return \'\';',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSQaKyUbLCYcLScdLigeLigeLykfMCkgMCshMiwiMi0jMy0jNC0kNC4lNS8lNi8mNjAlNjAmNjEnNzIoODMpOTUsPDYtPTcuPjgvPjkvPzkwPzkwQDsyQT00Q0A3RkM6SEI6SUQ7SkU9S0c+TEpCUExEUk1FU09HVFFIV1NLWVdQXVxUYWBZZWFaZmNcaGVea2hhbWpjbmpjb25nc3Nsd3NteHRueX14goF8hYJ8hoN+iIaBioeCjImEjYyHkJKOlpOOl5uXnp6aoaGcpKWiqaejqqunrqyor6+rsrCssrCts7Wyt7WyuLazubu4vry5vr68wb+9wsG+w8PBxsTCxsXDx8XDyMbEyM3M0M/N0dPS1dPS1tTS1dbW2NfW2djX2djX2tnY2trZ3Nva3dzb3t3c3t3c397d4N/e4ODf4uHh4uPi5OXk5uXl5+fm6Ojo6eno6urp6+rq6+rq7Ozs7e3t7u3t7+/v8PDw8fHx8vHy8vLy8/Pz9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALh4tPIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFxSURBVDhPtZFnU8JAEIa5RBAUFFGxYAEBe2/YUbH3rmAXG4KKIsJ6+fFecpsQmHH8os+XvPvuM5mdOYPwC38v2CwYVAoEcaIfk0qB4AyvmDEi+QLpebv1YEbyBcMCZCcLKvwqEE8M6GkNTpw8oShIAegwTpw8oeEMmLBpxVFBL5CBDxqNw5OPYCGjF8RVyIyHIBvEWUEnEP8L3Lm7U3DfiI2MTjDNS3TNUhsGKSBixdAJTTdAhwRxRoLdcqwYOYGMpmnEKZDmGCQ6cmfmBOMWZKfYgiwChLBjaALpfIcHrxz6UhBv4SVDE8xLlG6UyMkVodK0dqYmeB+BjihJDFJ6XKVEhioYAhkadTsqGY72Z3jtUs9UhdIDgNTVpcL1J8CyCRcokN40eyf4UpBTspUvVMG6LkHiXOUiCdKskW9Q8MdBGqurR1xzEpxU8w0XyOD+0XbuiYhv73CnjZ+JfzDby2y6FxJt9opiHlH4mX8XBOEbn0ZQxEhpCswAAAAASUVORK5CYII='],
  ['ArenaBG', 'arenabg', '0', false,
   'http://arenabg.com/torrents/search:%ARTIST%/type:music/time:pVBe78_NDURv6fCgIp5X_.WtvkMMOUZC4xz97.NhnXc/',
   'arenabg\\.(com|ch)/torrents/search:.+/type:music/', 'arenabg\\.(com|ch)/torrent-download-', 'null',
   '', '',
   '',
   '',
   'return false;',
   'return null;',
   'return null;',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REQ5QUYzNTJENUU3MTFFMzlDMUJCMTk5NjZCMjdERTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REQ5QUYzNTNENUU3MTFFMzlDMUJCMTk5NjZCMjdERTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERDlBRjM1MEQ1RTcxMUUzOUMxQkIxOTk2NkIyN0RFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpERDlBRjM1MUQ1RTcxMUUzOUMxQkIxOTk2NkIyN0RFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoYQdfgAAAdHSURBVHjaxFd7jFTV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'],
  ['DEEPBASSNiNE', 'deepbassnine', '1', true,
   'https://www.deepbassnine.com/artist.php?artistname=%ARTIST%',
   'deepbassnine\\.com/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'deepbassnine\\.com/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'deepbassnine\\.com/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/torrents.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.querySelectorAll(\'.head\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (new RegExp(\'(Artist|Album|EP|Anthology|Compilation|Single|Mixtape/Live|Remix|Bootleg|Unknown) info\').test(divs[i].innerHTML)) {\n    centertable = divs[i].parentNode;\n    break;\n  }\n}\nhook = centertable.lastChild.previousSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.appendChild(myDiv);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\[[^\]]*\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\s+|\s+$/g, \'\');\n  }\n  else return str.replace(/^\s+|\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'return null;',
   'png', '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'],
  ['Efecto Doppler', 'efectodoppler', '1', true,
   'http://efectodoppler.pw/artist.php?artistname=%ARTIST%',
   'efectodoppler\\.pw/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'efectodoppler\\.pw/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'efectodoppler\\.pw/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/torrents.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'box torrent_description\' || (divs[i].className == \'box\' && divs[i].id == \'artist_information\')) {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'var titles = document.getElementsByTagName("title");\n  if (titles.length > 0) {\n    var str = titles[0].textContent;\n    str = str.replace(/(.+?) - (.+) \\[\\d{4}\\]( :: What\.CD)?/, \'$2\');\n    return str;\n  } else return \'\';',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATlSURBVFhHvZdtTFtVGMfRLIsx8YsBtwV6KQVGHW+mzvjCXAeNZIFt8toCVtrCViktnQUKXaEU+jLclKXSaUFgRIwoaGyyD2wEMBjjBtvCMEbAydxggzpWjDMzmml6POfec+kt6WAtxH/yy/Pcc859zr+np+f2htD6pLtT0KgsnLBpckBrZTawr5C1Cqrtg9qie32OlnB8+8bU9v6pg8YCnuenukhw18ICd80EWDKzSKhrFAkGLDDfnHB/qF1N4BLBy+l0sq0y/p8LTVRhN3MiK5yYZlXbfHP85hjQyQtPjWt2kEXd6NNiKCMRPrgZ+fzxTTLQqdk/7bYSePIIMPvO7r8v20QXx1oLvhm3F4yO24sgKBaMjrWKyHi5tWD0gl02ONBlDcNlgtfZuvQFNDn6xHcsUeArR4PVaDQ+DgB4bD1wiY3prF6wQC/7bWsccNhbGuw2W67d1vJw7C25jtO2jP7+/q24TPBy6tJWDCxZ2aBbGuX5qBjyZrSnozga5xwYUY4ih2x3HH7O3WFVb8NlgpezZt+KAbTLqc1HbUh6XzA3J811S4K711q6cQNfavmLq4s/CtfN8cvdRsl2XCZ49VWmuJiFFy1s4LJwYOTAGIXxzRdhnDElLncc24QV+Eyz5w6aGC0z2gOnG94a7LSqjq9Hm1Wtb283PonLBK9Pj77868oKQAPm2jI97vp/1Fe5d5Y2gFahS/HCfVVxVo9KlkeixKhkQgzVrpIKe5Ti3B5lcV6PojiXREmSDXOIGEXcTo6DSHM/Vkjyy6qrq717p02V2oFOQtrEookA3+siwUQtGxIJrtagnIoUbCrCtkk4ZpKMXq7CNgo6p8aiHNUZVrOBTrj7F4VUyiINVJRL9l+pi4OTe03Q+Pv5bRRUc66RAO/JUi7BE3dLCDpSP6x4rfeWKQoOQA8a70B/MIsFivd+AvxQx/GoJa+XkqtQUlLylK089evJ+p0Ppg3RgGbGEEPCbJs2cMAUBuU0VJt3HMqnDFFkPgP7bpkioQHmIUeAnoqXzpMGkCQSyRPGI9m87hOVb5w5qSk604xBub9rEjWG0eYzhuprMynEJsnez6fqY/5lrsiwNnEWTx+00BORyUNlzM/f6ijlDTD32oj22XncHbjkEpEgLzV5QpiWAEmcyBU8fz4vL/1p3O1XQj7Xchv+yigDBBip5M7hrsBlUovll6pY4FodC/xczwJDb8e5eFzuDtztVwIeYbhhRP87qc0+ok1w4a7AZVIXyWf03u9zrHani0sQaxpITYow3GjAf3whw9rk33BX4DIqRfJphoGLtbEugghd08Cru54x3GQYGNIm38NdgcugyPcxcKEmxkWErm0gNSnccpP8CtA9BBisSvoDdwUuvTxHPnXMe3B9p41xha5hgM/nbznE2+50mb0GzmkSf8fdgUt32NfAt9Wx7nQB/4BULHpFzABdFwlzUni7Yk+YD2x7wDxNB44mLONygUsrO+hjYFofCSyZYcCUEQpMMDYhMqhoygwFXYVhYK7BOx7xRVnMNVwucGklvgaYzwo6p/C+c9BjEUvwCaw/FNeLywWuKkmmfErnW/RRQW9YziPsv9L2vJiEywUuZOBHXbjfCdYCvfCeU7D/ydvHK8elgpMoMy2/KSva864wFqzHSW/0NGZzr/B58QeoKiEh/wHmNecP6LrzbwAAAABJRU5ErkJggg=='],
  ['indietorrents', 'indietorrents', '1', true,
   'https://indietorrents.com/artist.php?artistname=%ARTIST%',
   'indietorrents\\.com/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'indietorrents\\.com/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'indietorrents\\.com/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/artist.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++){\n  if (divs[i].className == \'main_column\') {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[1].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n    if (str.split(\' - \').length > 1)\n      return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n    else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', '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'],
  ['JPopsuki', 'jpopsuki', '1', true,
   'https://jpopsuki.eu/artist.php?name=%ARTIST%',
   'jpopsuki\\.eu/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'jpopsuki\\.eu/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'jpopsuki\\.eu/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?searchtags=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/artist.php?name=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'main_column\') {\n    centertable =  divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1)\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', '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'],
  ['Karagarga', 'karagarga', '1', false,
   'https://karagarga.in/browse.php?dirsearch=%ARTIST%&cat=2',
   'karagarga\\.in/browse\\.php\\?(dirsearch=.+|(search=).+&(search_type=director)|\\2&\\1.+)', 'karagarga\\.in/details\\.php\\?id=\\d+(?!&page=)', 'null',
   '', '',
   '/browse.php?dirsearch=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'Music\')))\n      return true;\n    break;\n  }\n}\nreturn false;',
   'var tds = document.getElementsByTagName(\'td\');\nvar centertable, oinkinsert;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'rowhead\') {\n    centertable =  tds[i].parentNode.parentNode;\n  }\n  if (tds[i].innerHTML == \'Pots <a name="pots"></a>\') {\n    oinkinsert = tds[i].parentNode;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.previousSibling.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\ncentertable.insertBefore(new_row, oinkinsert);',
   'var artist = document.querySelectorAll(\'h1 a\');\nreturn artist[0].innerHTML;',
   'return null;',
   'return null;', 'png', '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'],
  ['Kraytracker', 'kraytracker', '1', true,
   'http://kraytracker.com/artist.php?artistname=%ARTIST%',
   'kraytracker\\.com/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'kraytracker\\.com/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'kraytracker\\.com/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   'torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/?cls=2&act=audio&orderby=added&sortby=desc&artist=%ARTIST%',
   '.artistHeadline {font-size: 12pt;} \n.OiNKPlusHeadline {text-align:left }',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'td_dark\' && tds[i].innerHTML.indexOf(\'Artist\') > -1) {\n    return true;\n    break;\n  }\n}\nreturn false;',
   'myDiv = document.createElement(\'div\');\nmyHeadline = document.createElement(\'h4\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyHeadline.className = \'OiNKPlusHeadline\';\nmyDiv.appendChild(myHeadline);\nmyDiv.appendChild(document.createElement(\'br\'));\nmyNode = document.createElement(\'div\');\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar tds = document.getElementsByTagName(\'table\');\nvar centertable;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'main\') {\n    centertable =  tds[i].parentNode.parentNode.parentNode;\n    break;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.cloneNode(true);\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(myDiv);\nvar parent = centertable.lastChild.previousSibling.parentNode;\nparent.appendChild(new_row);',
   'var title = document.getElementsByTagName(\'title\')[0].innerHTML;\ntitle = title.replace(\'Kraytracker / \', \'\');\nif (title.indexOf(\'-\') < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\' - \')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');',
   'return null;',
   'return null;', 'png', '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'],
  ['Libble', 'libble', '1', true,
   'https://libble.me/artist.php?artistname=%ARTIST%',
   'libble\\.me/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'libble\\.me/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'libble\\.me/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/artist.php?name=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'main_column\') {\n    centertable = divs[i];\n    break;n\  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  } else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAVxSURBVFhHxZfpT1RXGMYHhibqB02tjbSptrWmxaSlSzTplqjIsGiCINS4IKFgIqY1gnVJia2oBGRYZhjWQRAUFHEMi2ySgFMWS+NWk/4B/hF+aNI2efq+596zXLw1RtP2wy/nnPee8z7PWe6ZOx4A/yuuQSYupTGOyCS6iUfEYwLPCPflMTyWc8S5aTCuQRqQQMwTbsmfB86V4KblaFAnnvVR4nfCLdGLwDmPmnqMo8EdjAH/Fg4Tpjgvu2PmXkWDrvuobmD2f0ZYQ22HFOelV3suktulai9E9dMxOf4Z+JUQB1MY8PpCWTohlZSUO3p9pjjHnX0cqH66bQi6kasNpDQM8CCzg0okk9v1WElqI5UWlqGQIW7X7QmYeQ16lQFqPOKB8qFMZCW3k4q2FVNlqoxpVH9hgIzYdZnb4JFp4LEaKAdTGUOzjCERrgsBnrUtynH5nLGMaUG1XQYLDDxWBvSecmmJWMtnC6RxTIoZZdoCEwyPFybkNmgWGCBp28DyjBaUtk7izRx6QAM7b/6G3WV9OBQcx4YDHfCQkIdMaAMh7DjVj7W5LaJuGbFYvLURJ1omsY6eiYmIibmbUAbW7GnF2Mx9fF5YD29yED80jyCp8ByGbt1DUcVlxKTUYkV2IzypQSIET0oQdVei2FREZlICeH//BcQk1wgD8TnNlOsBMo6EaSUon1yNZBvDhDLwzq5WjNsGeJC/Zxr5P3bhBhk4WN6NDwrC+OPPv7Aq6xxe2UFGyECgN4rNRQ3IKevnRMg41o43drUgPjskJiMM+IJYnBZCUfUwanuiqOicxL6yCJamB4QR1tYGph/gi4IguaxH87U5FFf1oPDsZSTm1SI2uRqrtp/Fd4EBDEzdQ8K+BqQf68LqHVU08yp8mBfA1iNtGJ99iC8PNItcGSWtNMs61PfNwd8+jG3fNmLn8fPoHppF1+Aclm4NuRngLQihKTKLEjJQUBHBe3utPWe8JNY5OIsz4SFsO96N17Lr7fNB+GrxfdMwTtRdxdhPtAIlYXx2sAsTtB1rs6twsm0KX5VexltZ1RiN3sW6vU3awMrMRoxE76HYfxVxSX40XZtF8blLaOmbxPnIFFZsrxHLnri/A0PR+ygqv4jDNddR3j6CRel+ehbASjrAnTduI/NwCINTd3CyYQCrs6owOn0fyd+EsZ5WaU3GaXg3+7E8tRIvbanRBnjZfYc6MDh5B5eGf0ZH/wxK/L14PdOP0JVJsbQXhm5jgsrS+ggWJZ3CkvRqtEaiGLx1F239sxideYhQz00sS6/ApwfCuD7xC3rH5rG9uBlDU3fRMzKP9v45yj2HwvKI2GplgE8kn/5lKZVI3BPAuzsDeJUS8SGKTarC29l+rM8PUuwMPJvKacb0JtCJj91SiYTdtdjwdZCWtgKejacpXk9vRhBLfJX4OI/O1MazeDmtEp/QCmzIqxPEb6sUb4bDgMS6QGzoFeKLhV8vFuS7QOy3WRdtNsRwjPpTjMfwzaiuZ8erGHK+htRwfO9ZBqyB4gom+ALypHNyC2FCiVqmzD76x8q6gExsHX0VU4M/IA0DdmcerExYKyFvQl23zMg6I/pTTInL0sbWcfwY8derMsCoQVxyQorpHyMtprFMyFkLcc5jCEtsDcfPcY4UNlEJRN1KqpGiUphitjlLXGJMRosz+aYBxyeZiWVAJ3AascTYhG7bgiZPivMn2SJlwDbxxEepxEwiTaiZEdKQ7mMfYqNu5GONj6SuMmCb+MfPcp3QTsoxgRknZNuIL8jl/lnO0MOn/jFRIm4sNCJwjOecT/9jIqGOvB28T2aCF4FzqWU3eSIgoQG8GrlEL/G8f055bD4hDpwbrsH/Dnj+BpSMjfNcth/SAAAAAElFTkSuQmCC'],
  ['MusicVids', 'musicvids', '1', true,
   'http://music-vid.com/browse.php?search=%ARTIST%&searchtype=1',
   'music-vid\\.com/browse\\.php\\?search=.+&searchtype=1', 'music-vid\\.com/details\\.php', 'null',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/browse.php?searchtype=1&search=%ARTIST%',
   '',
   'return true;',
   'var centertable = document.getElementById(\'oinkpluslocation\');\ndocument.getElementById(\'spam\').innerHTML=\'\';\ncentertable.style.dispay=\'inline\';\nvar new_row = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nnew_row.appendChild(document.createElement(\'div\'));\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'Oinkplus\'));\nvar div = document.createElement(\'div\');\ndiv.id = \'OiNKPlus\';\nnew_row.firstChild.appendChild(div);\ncentertable.appendChild(new_row);',
   'var h1s = document.getElementsByTagName(\'h1\');\nif (h1s.length > 0) {\n  var str = h1s[0].innerHTML;\n  return h1s[0].getElementsByTagName(\'b\')[0].innerHTML;\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', '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'],
  ['NotWhat.CD', 'notwhat', '1', true,
   'https://notwhat.cd/artist.php?artistname=%ARTIST%',
   'notwhat\\.cd/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'notwhat\\.cd/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'notwhat\\.cd/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/torrents.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'box torrent_description\' || (divs[i].className == \'box\' && divs[i].id == \'artist_information\')) {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'var titles = document.getElementsByTagName("title");\n  if (titles.length > 0) {\n    var str = titles[0].textContent;\n    str = str.replace(/(.+?) - (.+) \\[\\d{4}\\]( :: What\.CD)?/, \'$2\');\n    return str;\n  } else return \'\';',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQjSURBVFhH3ddJbBtlFAfwGY89Xsb72LGdQPCSsikgUitplrIkCIg4pAoCQVMWYZAo56a9QGlBAg6cOCG4ceUEEtyQIpChlUBNDlSVcqFBDaQgBQlRQLTNn//7xm4aaWKPHZ940k92Zvy9983yLdE6iAA9QEfoWRcL9AgVqeeRpS/oCmEXW/Q3/UavU5B6Ega9T1LArbCbf+ko9STCdIncCrVynnoSNv1DbkVa2SCd9hwZkmfrVqSV/08H5BH8RW5FWtlTBx6mx0iGUpK6eQd+JumAnySPjzzHEkmS7+kdutb4uxMyFJ+nT+gCHSDPcQt9QHIVf5BbAS/k0Un7rylNHYfMgG+RmoTC4TB8Pp9bISUYDCo3HfuYHqIEdRWH6HfC8PAwflpbw9rFi6jX6xgZGblRaGBgAPVv6ri8sYH19UuYnp6Gruty7jLdT13FGMm8joxtY3Z2FsvnzgFbW5BYWlqCZVmIRqOYmZnG2bNnbpxbXl5GKpVqdvBXGqeOQm79D6SSlMtlbG5uMr9TQGJlZYVF0shkMrzq9R3nVldXUSgUmh0QX1GEPMcLVlC7RiqBYRio1V7C4uJxnH7tGN5+4xgOPzWn3gfxSu0w3j29iDdPnsDi8RNYWFhQbTgGEQtpCAXUKHpSZfYQgXRE+7Gc1ZBLsLjP6QSTIM5k0qko2RGe7zdQyBtIh51jIs7vpt9pE+RnIck7yFxsJ4uTpyV6fCClXS1mmIBFJUk2xiR9GkpMJMebymmydx6T3wg7yo4YHDmm04F8XNtk7v1OidZxlL29PpTbLiqfNxcpsmiZV5YbMtF/W0B933GeKo228ikd4IXIbPqEU6J1vEdbUd7uQRZqJlCYuJzSMdinw74jCLMaQbBqIVcxUczq6pz6TeP30vZW3iW5C8wp78GLUqBdyAyonqFPd559hAlENONHbDSM2FgCpakKKvdWEL89gdBEFJGxKBL7OSxTBqzG7+UR6szRyHedXqa2cYpct196zIfkVBrV0Sr6xnPwj5oIHYio4sKaisFn7TpTXqXnqG3IrlctPsl4HHYigUHycWbL5wuYn5+HPW4jNLZduFk8dFcEXP/cigvZ0D5ObWOIZCXDnZxMZopFTLAjCY73V59+BnNzh2DeHYQ1GYM1sS18TwQ633pptwuZVSV325A1XC3HJU7BRyYncZAdqXJiGQoE1MSjGzqMlB9mKQSzGIKR9Ktj0qaFL8nznuBButKfzeJUrYZH9+1DhcUDzgLTjT/pPvIcMmN9KitamMtrOMSrNM3mCtcpeaE/ItkZdRSygThDbkk78S3lqKso03fkltgL2QnlaU/RTx+SjGO3Im5k2pUJrUA9CRkZslP+nH4ht02qdFD+hfuMDlLXW/JWIf8nylieJ5kx5eWSKz1Jc1QikzyGpv0HtCaSdIXKwt8AAAAASUVORK5CYII='],
  ['Redacted', 'redacted', '1', true,
   'https://redacted.ch/artist.php?artistname=%ARTIST%',
   'redacted\\.ch/torrents\\.php(\\?|\\?page=\\d+&)(artistname|searchstr)=.+', 'redacted\\.ch/torrents\\.php(\\?|\\?page=\\d+&)id=\\d+', 'redacted\\.ch/artist\\.php(\\?|\\?page=\\d+&)id=\\d+',
   '/torrents.php?taglist=%TAG%', '/[ \\-\\/]/g, \'.\'',
   '/torrents.php?artistname=%ARTIST%',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++){\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))){\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Comics|E-books|E-learning videos)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var divs = document.getElementsByTagName(\'div\');\nvar centertable;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'box torrent_description\' || (divs[i].className == \'box\' && divs[i].id == \'artist_information\')) {\n    centertable = divs[i];\n    break;\n  }\n}\nhook = centertable.firstChild.nextSibling.nextSibling.nextSibling;\nmyDiv = document.createElement(\'div\');\nmyDiv.className = \'box\';\nmyHeadline = document.createElement(\'div\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \'));\nmyBoldText = document.createElement(\'b\');\nmyBoldText.textContent = \'OiNKPlus\';\nmyHeadline.appendChild(myBoldText);\nmyHeadline.className=\'head\';\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nhook.parentNode.insertBefore(myDiv, hook.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nhook.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var h2s = document.getElementsByTagName(\'h2\');\nif (h2s.length > 0) {\n  var str = h2s[0].textContent;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n  else return str.replace(/^\\s+|\\s+$/g, \'\');\n}\nreturn \'\';',
   'return null;',
   'var titles = document.getElementsByTagName("title");\n  if (titles.length > 0) {\n    var str = titles[0].textContent;\n    str = str.replace(/(.+?) - (.+) \\[\\d{4}\\]( :: What\.CD)?/, \'$2\');\n    return str;\n  } else return \'\';',
   'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANuSURBVFhH7ddLSFRRGAdwNZ0hrEVlpkXRKErp5CIDXdgsIokoooVBiWCBFEhhJEhusrdEPtoFpRG20EVNmWnM9FLCfFuipfkoiwwfvQSjN//+5+C5zJ2udjV3+YcfDud+57vfcO7MoM8UEkKpVESt9I4wboSa6DwlUxDNWGLISepmZt2gOPqnXCDZ0Gq1YvPmJOTlFaG6uhl9fcMYHf2FT59+ord3CPfuNSA39zwSE7fLWrWPimnKmU/iHcDf3x/Jyel4/vwtPnz4bkpPzyDS0jI9B7lNC8h0bhJCQkJRXl6D4eEvUnNzDzIzTyEhYQtCQ5fK4SwWKxYvDkZs7Hrs25eF+/dbtHq3uxHLl69UQ7gpgP4a8ZDxBstQV9eJgYExdHUNISVlv7yhuPY3Dsd2OazYK/7abGHqWglNmkRCQIAFTmcN+vtHUVvbhcjI1bobmBEUFKz1cLtbEBgYqK7tognjIuzdm43u7vec/iUiIqJ1jadi4cJFuHv3ieyVlZWv1h+QYTYRz3MJb/wKHR1D2Lhxp67hdKxZE4f29kG0tQ1gxQrtKFLoj5QSUlMPo6V1AEVFVfD19dU1m64TJ4plz4OZZ9VaBekyh+Dn58dza+TD9xrx8Vt1Tf5FVFSs7OlydfBTY1Hrc0lLLPG87aiueYHyiiemn3izLpdUy952u0OtiSPXkkH8FtsN151uZGQU6jbPhD17jsreSUmH1NpJ0iLPP/1AASoqO+HYkKLb7M1CudRLfeOvxZpRrbJu3TbZOyv7glqrIi1thNwzTly73o7IVWt1m72dpvdejpBRrWKzRcnehYWVaq2btMif1ri4HSxcpdtoRLxz7wHEmlGtJ9E7PkH7aH8mLT9JVzyZ6Q5gQItcsNmikXO8DJVVz9DU9IY/sx8xMvLVe5PhEeSQd93YGOR+0aeu/jXyCq8jPNzuWaPlCyHn2FWUlj3GbVfXpAOoh1A8gJM9hJ4DNLCf6FtQUKWufyUtcvFicb2pAcwyGkD096jRIhdmB5gdYHaA/3qAHjL9TWiW0QAe34T9pOUSISwsGkeOluLmracTDeCgs1RLg/RtnHgt1sQ1USPrPQeofdSP/HwnwiNiVK8rpMVKLaQuGnlIZiNqjXoo4r/refRHzlEz/SDPDaKhncxG1HoPIXqK3uIe4/Hx+Q0impMgs6o5SwAAAABJRU5ErkJggg=='],
  ['RockBox', 'rockbox', '1', false,
   'http://psychocydd.co.uk/torrents.php?search=%ARTIST%',
   'psychocydd\\.co\\.uk/torrents\\.php(\\?|\\?active=1&)search=.+', 'psychocydd\\.co\\.uk/details\\.php\\?id=', 'null',
   '', '',
   '/torrents.php?search=%ARTIST%',
   '',
   'return true;',
   'hookNode = document.evaluate("//tr//tr//tr[contains(self::node(),\'Added:\')]/parent::*/tr[position() = last()]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\nvar new_row = hookNode.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()){\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\nvar parent = hookNode.parentNode;\nparent.appendChild(new_row);',
   'var hint = document.evaluate("//tr//tr//tr[contains(self::node(),\'Torrent:\')]//a[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;\nstr = hint.textContent;\nstr = str.replace(/\\[[^\\]]*\\]/g, \'\');\nif (str.split(\' - \').length > 1) {\n  return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n}\nif (str.split(\-\).length > 1) {\n  return str.split(\-\)[0].replace(/^\\s+|\\s+$/g, \'\').replace(/_/g, \' \');\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAATPSURBVFhHrZcHktswDEXttbf33nvvvc9Wb++9ak+SXMlnRPgQU+EqtK3MxDN/aFEU8AF8QHbCfEoNfhpkCyGZTCrsdWlpaXZkZCQ7Ozub3djYyM7Pz2ebm5u/nSkpKQm/e/DDIGWQyBhIMRhjYoyLcSyjo6NydnYm9/f38vz8LHd3d/Lw8CBPT0+yubkp1dXV4TNROxHgOxE4G3mB46amJtnd3ZXHx0d5f39Xh5eXl7K9vS2Tk5NycnKi++fn59Le3h6HAL6LEygrK5OhoSHZ39+Xl5cXdfL5+Sk3NzcyNTWlgIAph977+PiQ29tb6e3tLUaiOIF0Oi3Dw8NycHCgacYBJC4uLrQEpv4yMzMjExMTiuvra3l9fdVzV1dX0tfXp6Xz2TYoTAD2XV1dsre3p2kl5W9vb0rg6OhIy4FzMD4+LmNjY7pmMpnwHMQbGhq89g0KE0BMpBWDEEBwOMYJ0dq0UwKbAfZ2dna0RJwnI4uLi5JKpXw+/AQ4jOgaGxtlYWFBDg8PVfWkFgECoif9y8vLKsL19XWZnp5WMpBCnJSIlc6oqqrSUkTK8Z2Ae4C1o6NDjVECFE5KiQyRAQiRaurNSs1XVlZka2tLSaIZtAKBurq60K6zBglT5wCVk24it6q1BBAgERIx0ZBWnLMCqwtIWPFBlC6wBCBVU1OjdrGPH8SN74RxHJBuNiESJdDd3a0GyMLp6ak6tBHjCBJcB0GgxNiDCOmnTREhQWDbEsA5PvGdMF8CG7m9aQl0dnaKGa+hDigDUeHo6+srLAUEKA2OuQ8JpiMg/a2trd9EiO2cv98a4IJNm5pceqSlpUUfxgjO5+bmtNUgRDcQvStMzjCsrGbIgHlHaAaw5xIA+FYCzkZ4kwfq6+u1rTDCPEAnlZWVmpWBgQFVPg4BHcFeT0+PEmdyHh8fKxnGsrUPbMD4NvjTBS44UFtbKxUVFSEpFxCi7Zh0OGY2IDR7HydklBcXhGyZI37yEwBEysO+e/Q19ykJRBGV7xyOIeZqwEHhDPT394t55/91D2CU6JiSaAMS0TPYoP5kyxM9KEyA2gNaiGt7j2ioNe2J0Kgz105tdeU5JiV6sM9G4CeAofLycllbW1O18zsAY6SZfWYDxLhH25EFph/7ZIbyIFYc0w2M56iPHPJnAAOonF5mBiwtLWk0tCAvF6Ln5cM5HNAFTEtII87BwUHdoz057/NhkJ8AESMwdEAdeTHRhmQD8aENm26rB2rN8OL9QXaYnKxkyy2hg/wEeMAOJYDImAsAEqyuUfb4BcT4pkyAIQYpssG1az+H/ARcoAkygHGip9bUGU3YqckeNWcu4JhsQRDBcu6fMxAFGcA4JEg3UTHhKAWRU2fakTN2IPnsRBCfAFHgnKmH0HAIqC/iRKS8M9AMZP87AURJpAgMAnQDrcd3VgjQBQi3ra3Na8OD+ASoM3VH5cx9Il9dXQ1bkpcW5UCMCC7P6I3i3wjwYuLdQO1RN7+GyYhtVUiwz2yARIwyxCdARCielUygdIggRnSBPvjdR5dAIKYQ4xPAGM4xTib4jhNAy1lC/AdAhJyLSyDWn1NAGXBsYa/JDF2CUCHDyr7PRgT65zRtUPTvuYWJKoQhEK6GhH43RPQa+J53YP6eJ5K/AGogsilS/sISAAAAAElFTkSuQmCC'],
  ['RuTracker', 'rutracker', '0', false,
   'http://rutracker.org/forum/tracker.php?nm=%ARTIST%',
   'rutracker\\.org/forum/tracker\\.php\\?nm=.+', 'rutracker\\.org/viewtopic\\.php\\?t=\\d+', 'null',
   '', '',
   '',
   '',
   'return false;',
   'return null;',
   'return null;',
   'return null;',
   'return null;', 'png', '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'],
  ['Secret Cinema', 'secretcinema', '0', false,
   'http://www.secret-cinema.net/browse.php?cat16=on&search=%ARTIST%',
   'secret-cinema\\.net/browse\\.php\\?cat16=on&search=.+', 'secret-cinema\\.net/viewtopic\\.php?id=\\d+(?!&p=)', 'null',
   '', '',
   '',
   '',
   'return false;',
   'return null;',
   'return null;',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAAAAQABAgABAwABBAQAAAARAQANKwEPLAAOLQAOLgAOMAAPMgEQLAIQMAMRMgAQNgMSNAESNwITOwUVOwUWPgUXPwAnBAApBAUsCAIwBgIyBwA2BQE3BgI7BwQ7CSsAACsDAS0AACwDATEAADACAjIDAzYAADcCAjQDAzsDAzsGBj4GBgYYQQcaR0EHB0cICA4/rxRHvRpOxRtPxhxQxx5TzR9Uyx5V0ilZxSpbyitdziFX0yJY1S9h0i5g0y9i1Tx3/D14/T96/xmjJhzLLR7TLx7WMCXFNSbKNifONyDgMjj9Sjj9Szn/TK8QEL0XF8UeHsYfH8cgIMskJM0iIsUwMMoxMc4yMtIiItMmJtUnJ9M1NdI2NtU2NvxGRv1HR/9JSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnTsmUAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABTElEQVQ4T42Q1ULDMBSGiw0Y7gOGlcFw9+EZNqA4DBmQ93+IcqxtEi7gv0jOOd/XtKkX/hFX8H4NZJd4ECkldovcMawOYJ1rmA2gqdslxzBqAPlH/TltG0kJ45m3b60rc5YRVzDMv2vMx6JpRAWMck/wPKbiG4bsMEj5dyK8jKIQEV49L1vM+K/Ey7PExaAVmuGzq4uR8YcvrZ8nGUMiAcrsaRAEpcHcvS5PMKSwAMXQyTUIwfnA2A1dMg4KsPVdIoaU+nme5D+C9YqG5Z4qJhz6BuMjm9ZUoZURRW6BBl2zZf1Iqe22aqbEWaAzipnGLYUpdDMWRCsaqfTqMQlqpz7hkYBG84YIB+mExwIa7XvM5w2eCGh07cIZ+701BjcEOmNTHXaYz1sCGp0rC3hJGWDMGo1a/JHSUqwGDYc7AhlSSpwWDCmiuL2TMPwBV1xR+9Q0uSUAAAAASUVORK5CYII='],
  ['Shellife', 'shellife', '1', false,
   'http://shellife.eu/browse.php?search=%ARTIST%&cat=1&exact=1',
   'shellife\\.eu/browse\\.php\\?search=.+&cat=1', 'shellife\\.eu/details\\.php\\?id=\\d+', 'null',
   '/browse.php?cat=%TAG%', '/[ \\.\\-\\/]/g, \'\'',
   '/browse.php?search=%ARTIST%&cat=1&exact=1',
   '',
   'return true;',
   'document.getElementById(\'greasemonkey\').innerHTML = \'<table class="row2" width="100%"><tr><td class="row1" align="center"><div id="OiNKPlus"></div></td></tr></table>\';',
   'return document.getElementById(\'greasemonkey\').title;',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAANgSURBVFhHxda9q1VHFAVw/6qgRIs8kkbFSqzEIhYRQQSxEEFsxEaxEBtTpNNYJII2WogWggiKoqgoLz78QkUlSP6B8f0OWZe58+a8+y4KFouZ2fecvdb+mH3uulLKd0XXuFacOHmqHDt2vFjh7O9/LJv7z46ha5yFQ4cOl3PnL5TrN26WO3fvl8dPnpZbt26XK1evDWifXw1d4xhEiwDh4j9L5fnSi/L6zdvy8tWbARFCVPvuGLrGFohF/ODho4Ho3fsP5eOnf6fABkR8UwH79u0vF/78q9y7/2AgR/b5839d+E1WiGj9jKFrDJD/ffHyEFHSvZoASDlaX2PoGmHPnr1D5Kmp9M8iB2X4agG6/PTpMwM54qfPFocSrEUEAbLV+hxD16jpkKslZ6DrnYmom7Amd/bsV2VA3V21uuPVnmOZUA52tlpIyOe5AbDCYJql6eK4FdCKiEiiW3+zMHU4cODgZNC0zglgR24CImPzG5HzpL3G1ME8T/Q1Oed6AGkEAEF5zju1r7Vi6uDO101mRZ701wJkSqOakPkoXbp0ednNNMEsTDb1nBd1IrNHzo4cKQGe3759xwAzw+o3mEfIZKP+MpCRi9ga1AKQLyz8XBZ++qVs3rx12O/cuWv4ndggvlfDZCOKjN186axxRgBxokO48cdNAwYhy/A+ccrBDxhm8T+GySYCkCAOQq7+fhO9qCNg/Q8bBpgf+sE7RniCif8xTDZ1CRJ1jYhAFAEhD/iQBdmTKUKICkcPk43UeZjqpB/s65uAZEyAUiDWpPmW2Iejh6kDEV4SLUTA6/8b0t4z6YFWAJsgkgVT1b7maDF1qL//okWKvL6SIkQ0lgGEniVEELP+qE4d8hnOTQh5vgn2IlOClpwgDYqYSL2EXN/UHC1WGNxnL6odJ0TUn1tRpQSBeYA8TehdGRTMXD0AHG3Zsq3s/vW3koxkQnLKFgGuLnJ9YZ+UE6GUMrHmW1DDWEWSSQcZuUeOHB2uokxxTqw0+03PpAmztr5bdI3AoZTKBHJEzjIgS7lqIk69EeYmpYyt3xZdYyBK5FbkCJFbkw0k9hEk7Upm3/rroWuskSgRWGWEIDVmUw52ZZAd5ES0fsbQNfYgWtmwhlzkKUcy0743C13jLGgwUcM80a5EWfcF4aYWKiAxeMwAAAAASUVORK5CYII='],
  ['The Pirate Bay', 'thepiratebay', '1', false,
   'https://thepiratebay.org/search/%ARTIST%/0/3/100',
   'thepiratebay\\.org/search/.+/\\d+/\\d+/(100|101|104|199)', 'thepiratebay\\.org/torrent/\\d+/.+', 'null',
   '/tag/%TAG%', '/ /g, \'+\'',
   '/s/?q=%ARTIST%&audio=on&searchTitle=on&page=0&orderby=7',
   '.artistHeadline {font-size: 12pt;}\nh2 {clear:none !important; text-align:left !important;}',
   'var details = document.getElementById(\'details\');\nvar atags = details.getElementsByTagName(\'a\');\nif (/Audio &gt; (Music|FLAC|Other)/.test(atags[0].innerHTML) return true;\nreturn false;',
   'myDiv = document.createElement(\'div\');\nmyHeadline = document.createElement(\'h4\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyDiv.appendChild(myHeadline);\nmyDiv.appendChild(document.createElement(\'br\'));\nmyNode = document.createElement(\'div\');\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar divs = document.getElementsByTagName(\'div\');\nvar nfoDiv;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'nfo\') {\n    nfoDiv =  divs[i];\n    break;\n  }\n}\nnfoDiv.parentNode.insertBefore(myDiv, nfoDiv.nextSibling);',
   'var title = document.getElementsByTagName(\'title\')[0].textContent.replace(/\(download torrent\) - TPB/, \'\');\nif (title.indexOf(\"-\") < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\'-\')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAUCSURBVFhHxVdNTFRXFBaGGf4iBYUBEVBogcJILURLQSsosQUTfgstCeWnW8SNxki7ckG76khiYlGTUiAsiIILXRCW7mBBWillQatho4QgQuQ3DMzX+x3nvnkzoCkkpSf5cu89591zvnvueefN7KO43e4jCjcUbu4R2hQOm4OvYI9FxXythjASuPFGtfeiYjtJ4KZnvefC2NsSUDqfcTfCveb9eu2nezuBzc1NzMzMoKenB93d3TtGV1eX4N69e1hZWfEJrOWdBNbX11FVVQVVp7tCQECAIDAwEK2trTsnsLq6iry8PB+H2823W5t1HBsbG8WnP4m3EqCQQH5+vpxAw2KxyEinnHPUYDD9nF5rAg0NDR6vvvKvCOgAdGy323Ho0CGZR0REIC0tzUB4eLjoExISEBUVZewjCWZgO9kRgaSkJDx9+hQvXrxAbm4uampq5BkW2NLSEgoLC6Vm5ufnMTIy4kNixxlQOnHMGtBOSkpKsLGxIW9Hc3MzEhMTUVlZKSgvL5fs3Lp1S/aura0hPT1d9ukMUK+hRc3fTmB5eRknTpwwCISFhcHpdMqrFRMTY9y1GSkpKejr65Oqt1qtoiOB6upqIa59a3kngbm5OcTFxYkTBtMB9dy/CLVNz3URErw++tTQwtg+BMwPzM7OIjY21nBmBAlQBPRoCig2rtWztJv18fHxhl/zqOAlwIK6f/8+RkdHJV3mDGjnwcHBCLbakPpBKj79JNewMRsFBQWIjbEjxBYMW5DVhxzfHPr0BJW5Z+0l0Nvbi6CgIDn11NQUXr58Kcy1E4J3WV5ahm8bm/Bj2w9GEO67e+cuCs8UoOGbepwtKPTZd/ToUSlgdteJiQkpUg8JL4H+/n5xRKfs5YuLi+jo6EBWVhYyMjKQmZkpOJbpgEONjoxM0Wubw+Hw2hS0PicnBwMDAxKcr6PNZsPly5fhcrm8BNybbtz+uQNBKpUWdbcR+/cj5+NsXFSv26+/dGJi/E8svV6Ee8M3jXpOMY9mUHj6sbExozeUlZUJAWV/Q+DV3CtEvRcpxRN98CC+rKzCkcQkhIaEwGoJQnhoGN5PTpH0d3Z2Ynx8XDKkA3CkQzYhXt/jx48li1euXEFRUZFk4sCBA8aVMLPcYxBgJyv+/AtkpH+IluaL+OhYFr5v/Q5Pfvsddzpuo/arr8VGQnTAa2IjqqiokHSWlpbi+PHjOKjI69eTfYC9Izo6GqmpqTh58iT2q8zSxtZNsgYBnsKl7mhhYQH19fXyECve+ZMTtxXblpYWFBcXbylKBmPdmHWRkZFoampCT1e3HOCPJ2M4feq0FOKFCxcQog6RnJyM6elpXwJq5IDh4WG5K55Sg4XD07HTMaWXLl1Ce3s7BgcH8ejRI1y7dk26JtPM53l6XmnBZ2dwOv8ULEpHsm1tbZicnJTTb3kLSICgkWx5Gqbt4cOH0hvYmLjJ/KwZtPFDNTQ0hKtXr6Lo7DnYVctmUbO2srOz5RcWC9K0ZyuBZ8+eyd0xtaZiMWAWf7157Vp34e/JvxQJuxymtrbWx+7BVgKs5gcPHshHhR+k3Qp98Yt6/vx5IVBXV2fE0KLmbwhog4bHaMx3I9zLa2FHZa08f/5c1mafau7NgNnIkfDfsBPRPraDFjX3Evg/RBPgH0WPas/lOgkcVuAfxT0VFXNWIVT91lC/INS/VLVwKvj/jf5PoOJdV6MKvm/fPz7k+j3SMXAOAAAAAElFTkSuQmCC'],
  ['Torrentz', 'torrentz', '1', false,
   'https://torrentz.com/search?q=%ARTIST%+music',
   'torrent(z((-proxy)?\\.com|\\.eu)|smirror\\.com)/search\\?q=.+\\+music', 'torrent(z((-proxy)?\\.com|\\.eu)|smirror\\.com)/[0-9a-f]{40}', 'null',
   '', '',
   '/search?q=%ARTIST%+music',
   '.OiNK {float: left !important;} \n.OinkPlus {float: left !important; min-width:700px;} \n.artistHeadline {font-size: 10pt;}',
   'var divs = document.getElementsByTagName(\'div\');\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'download\') {\n    if (divs[i].textContent.match(new RegExp(\'(audio|music)\')))\n      return true;\n    break;\n  }\n}\nreturn false;',
   'myDiv = document.createElement(\'div\');\nmyDiv.className = \'results\';\nmyDiv.setAttribute(\'style\',\'position: relative\');\nmyHeadline = document.createElement(\'h2\');\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nmyHeadline.appendChild(toggleDiv);\nmyHeadline.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nmyDiv.appendChild(myHeadline);\nmyNode = document.createElement(\'div\');\nmyNode.className = \'OiNK\';\nmyNode.innerHTML = \'<div id="OiNKPlus"></div>\';\nmyDiv.appendChild(myNode);\nvar divs = document.getElementsByTagName(\'div\');\nvar filesDiv;\nfor (var i = 0, len = divs.length; i < len; i++) {\n  if (divs[i].className == \'download\') {\n    filesDiv = divs[i];\n    break;\n  }\n}\nfilesDiv.parentNode.insertBefore(myDiv, filesDiv.nextSibling);\nseperator = document.createElement(\'div\');\nseperator.setAttribute(\'style\',\'clear: both\');\nfilesDiv.parentNode.insertBefore(seperator, myDiv.nextSibling);',
   'var title = document.getElementsByTagName(\'title\')[0].innerHTML;\ntitle = title.replace(/Torrent Download/, \'\');\nif (title.indexOf(\'-\') < 0 ) return null;\nvar myartist = title.replace(/\\[.*?\\]/g, \'\').replace(/_/g, \' \').split(\'-\')[0];\nreturn myartist.replace(/(^( )*)|(( )*$)/g, \'\').replace(/[ ]{2,}/gi, \' \');',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAJ9SURBVFhH3ZfLaxNRFMbzD7j2b3BpmtZWWyyICgruLCLShWmaWJJQFF+tIqhdCCUrhaaZaaxNsD4CUo3BGhctCEWqoihajNhYJaHSGps2yeT1eWfmZuhMxkdwbtUe+MFw5pz5vsy9nMk1acPc4atjCZWpDnPnQLfZNtBf1+kFS0QNi827ncrKQcVX9BpYQPTmNluvbKLyxMAa/HItynKIF2LC9nAOuVIZRsXs4xC2demLV9h6mNvw7xhoOTmKgxdDONT3A0beIVmgBnPfEPQ9QLteHaXtNI96u75wBZWBX9L/Eh/zJdlAdhGe89fRoFdXA+vDgC34FCPjL2qCvx3F7qO8MQY8M1k5V0Msf36LA73+dWJAt3Y1Dg77/c8RSxel1lJRwJPxR9jjHlwbA7v6JjGVFEA78f7VNNpOcNI99ga67iI8m0FlfJTSCZzpGYKF3mdsgEP31CKU4ZpPYfTSsKqHmQGLcxgd9+JIFWX1QiaF8LVbaHKo69gYOOKHPfAG8WV505ULOUTuR7HDNVhVy8TAzt6watMlYjNoJ0NHWyfCwAAPz+s06JsHhAV4znKor6qTMdSAxR2Aa+ILBKmgDGFpHjcuX1U/Q4NxBhxBnIp8UjZdMfMVAX8IjZpNp8UgAxys/DN8IJNOki/mMRGexF6nr/oZGgwx0NoTQjSRUzbdQjwGxzGfMmx+hiEGzk0voSBnyajLIhK8o/sPScWFm2h1csYYGEvKqZqC9B8n/fv+LwPks9rsGkKLm+Di0WiXJ1uTk+ZqgfQ3kH5pCaSzwd88mIghntXE45JeIRNs3rEtVt9GKi+HeFb77eX4A0SNKvHVIa4LS6gMDZPpOzm1vHjonRGeAAAAAElFTkSuQmCC'],
  ['Waffles', 'waffles', '1', false,
   'https://waffles.ch/browse.php?artist=%ARTIST%&s=year&d=desc',
   'waffles\\.ch/browse\\.php\\?artist=.+', 'waffles\\.ch/details\\.php\\?id=\\d+', 'null',
   '/browse.php?q=tag%3A%22%TAG%%22&t=1', '/ /g, \'+\'',
   '/browse.php?q=artist_full%3A%22%ARTIST%%22',
   '.artistHeadline {font-size: 10pt;text-align:left;} \nfont-size: 10pt !important;}',
   'var tds = document.getElementsByTagName(\'td\');\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'heading\' && tds[i].textContent.match(new RegExp(\'Type\'))) {\n    typeFieldContent = tds[i].nextSibling.textContent;\n    if (typeFieldContent.match(new RegExp(\'(Apps|Components|eBook)\')))\n      return false;\n    break;\n  }\n}\nreturn true;',
   'var tds = document.getElementsByTagName(\'td\');\nvar centertable, oinkinsert;\nfor (var i = 0, len = tds.length; i < len; i++) {\n  if (tds[i].className == \'rowhead\') {\n    centertable =  tds[i].parentNode.parentNode;\n  }\n  if (tds[i].innerHTML == \'Type\') {\n    oinkinsert = tds[i].parentNode;\n  }\n}\nvar new_row = centertable.lastChild.previousSibling.cloneNode(true);\ntoggleDiv = document.createElement(\'div\');\ntoggleDiv.id = \'toggleOiNKPlus\';\nif (new_row.firstChild.hasChildNodes()) {\n  new_row.firstChild.innerHTML = \'\';\n}\nnew_row.firstChild.appendChild(toggleDiv);\nnew_row.firstChild.appendChild(document.createTextNode(\' \' + \'OiNKPlus\'));\nnew_row.firstChild.nextSibling.innerHTML = \'<div id="OiNKPlus"></div>\';\ncentertable.insertBefore(new_row, oinkinsert);',
   'var h1s = document.getElementsByTagName(\'h1\');\nif (h1s.length > 0) {\n  var str = h1s[0].innerHTML;\n  str = str.replace(/\\[[^\\]]*\\]/g, \'\');\n  if (str.split(\' - \').length > 1) {\n    return str.split(\' - \')[0].replace(/^\\s+|\\s+$/g, \'\');\n  }\n}\nreturn \'\';',
   'return null;',
   'return null;', 'png', 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaXUAAAALZJREFUWEfNk8ENgDAMA/PhxYON2YIdWIQH67AASFBTKIEWVFJXuo9lOVaUCl7fNrMlbqx/mulP3Fg/eBrrE1Y6X4Ghq1asdJ4CpeApgBWB3SByIrs/angb+NYfGi5H4oJCPZs/arAqUAqeAlgRsNL5CqQeTy6dp8Ad+FZf0TKP8BTAikCoa+FP3OWEOl+B2PFow46k5kDnKVAKngJYEbDS+QqkHk8uvXwBPAhWuLH+aaY/2aaKLGf12hn2gF8pAAAAAElFTkSuQmCC']
];
//[0.name, 1.label, 2.version, 3.isGazelle,
// 4.searchurl,
// 5.searchpatt, 6.torrentpatt, 7.artistpatt,
// 8.tagurl, 9.tagreplace,
// 10.morelink,
// 11.css,
// 12.isAudioRelease,
// 13.hook,
// 14.findArtist,
// 15.findMultipleArtists,
// 16.findAlbum, 17.icontype, 18.icondata]

var defShellifeTags = 'abstract:133\nacid:134\nacidjazz:211\nacidrock:727\nacoustic:703\nafrobeat:257\naggropop:504\naggrotech:610\naltcountry:711\nalternativecountry:711\
\nalternativerock:702\naltrock:702\nambient:141\nanadolupop:815\nanatolianrock:724\nantifolk:469\nartrock:705\navantgarde:701\nbaggy:164\nbaroquepop:802\nbedroompop:503\
\nbigbeat:113\nblackmetal:302\nblissbeat:143\nblues:706\nbluesrock:721\nbollywood:809\nbop:203\nbossanova:210\nbreakbeat:135\nbreakcore:105\nbreaks:136\nbritpop:508\
\nbubblegumpop:818\ncalypso:274\ncandombe:280\nchamberpop:808\nchanson:805\nchillwave:166\nchiptune:137\nclassical:900\nclassicjazz:204\nclubpop:506\ncoldwave:609\
\ncontemporary:901\ncooljazz:205\ncountryrock:708\ncpop:817\ncutupdj:266\ndancehall:275\ndarkambient:120\ndarkcabaret:725\ndarkelektro:607\ndarkjazz:214\ndarkmetal:311\
\ndarkwave:167\ndeathmetal:303\ndeephouse:119\ndisco:253\ndoomgaze:325\ndoommetal:307\ndowntempo:127\ndreampop:152\ndrone:144\ndrumnbass:104\ndub:276\ndubstep:103\
\ndubtechno:130\nebm:606\nelectro:109\nelectronica:100\nemo:351\nemotronica:142\nexotica:813\nexperimental:146\nfolk:450\nfolkmetal:312\nfolkpunk:455\nfolkrock:452\
\nfolktronica:458\nfreakbeat:723\nfreakfolk:456\nfreefunk:254\nfreejazz:206\nfunk:251\nfunkmetal:310\nfusion:207\nfuturejazz:213\nfuturepop:604\ngangsta:263\
\ngaragepunk:358\ngaragerock:712\ngirlgroup:807\nglam:713\nglitch:132\ngoatrance:124\ngothabilly:728\ngothicmetal:313\ngothrock:714\ngrime:261\ngrindcore:322\ngrunge:715\
\nhardbop:208\nhardcorepunk:353\nhardrock:716\nheavymetal:305\nhiphop:260\nhouse:126\nidm:101\nillbient:118\nindianclassical:459\nindiefolk:454\nindiepop:500\
\nindierock:150\nindustrial:600\nindustrialpercussion:605\njanglepop:509\njazz:200\njazzfunk:216\njpop:804\njungle:128\nkiwirock:710\nkrautrock:726\nlaptopfolk:451\
\nlatinjazz:209\nleftfield:115\nlofi:159\nloungemusic:812\nmathmetal:321\nmathrock:163\nmetal:300\nminimal:112\nmod:709\nmodernclassical:905\nmodrevival:707\
\nmusiqueconcrète:114\nneoclassical:903\nneofolk:608\nneosoul:255\nnewage:110\nnoise:145\nnoisepop:501\nnoiserock:165\nnorthernsoul:259\nnowave:357\nnujazz:212\
\nnumetal:308\npaisleyunderground:718\npfunk:252\npop:800\npoprock:810\npostbop:215\npostmetal:317\npostpunk:355\npostrock:154\npowerelectronics:601\npowermetal:320\
\npowernoise:612\npowerpop:507\nprogfolk:460\nproghouse:111\nprogmetal:316\nprogrock:717\nprogtrance:123\nprotohonkytonk:730\nprotopunk:356\npsybient:129\
\npsychedelic:153\npsychfolk:453\npsychobilly:722\npsytrance:122\npunk:350\nqueercore:359\nr&b:250\nragga:277\nreggae:273\nretropop:505\nrhythm&blues:250\
\nrhythmandblues:250\nriotgrrrl:720\nrock:700\nrocksteady:279\nromantic:902\nroots:278\nscreamo:352\nshibuyakei:816\nshoegaze:151\nsingersongwriter:803\nska:354\
\nsludge:315\nsnorecore:157\nsoftrock:801\nsoul:258\nsouljazz:201\nsoundtrack:904\nsouthernrock:729\nspaceagepop:811\nspacerock:161\nspeedmetal:301\nstonerrock:324\
\nsunshinepop:806\nsurf:704\nswedishpop:814\nswing:202\nsynthpop:116\ntango:256\ntechhouse:121\ntechno:106\ntechnoid:108\nthirdstream:906\nthrashmetal:304\nthugrap:271\
\ntrance:102\ntribal:107\ntriphop:117\ntropicalia:719\ntwee:502\ntweegrind:306\ntweepop:502\nvikingmetal:309\nworldmusic:457';

var traFields = {}, trackers = [];
traFields.tra_custom_total = {
  'type': 'unsigned int', 'label': ' <b>Custom trackers</b>', 'size': 1, 'min': 0, 'max': 20, 'default': 0, 'section': ['', '<b><u>Custom Tracker Settings</u></b>'],
  'title': 'Number of custom trackers to add\nMust be a positive integer (0-20)\nAfter changing this value, save and complete exit the settings to reload page, and reopen menu to add custom trackers',
};
for (var i = 1; i <= customTrackersToAdd; i++) {
  trackers.push('customtra' + i);
  traFields['tra_customtra' + i + '_name'] = {
    'type': 'text', 'label': ' <b>Name</b>', 'size': 16, 'default': 'Custom Tracker #' + i, 'section': ['', '<b><u>Custom Tracker ' + i + ' Settings</u></b>'],
    'title': 'Name of the tracker\nDisplayed in the tooltip\nDo not use this value in the tracker ordering field - use the Variable Name below'
  };
  traFields['tra_customtra' + i + '_label'] = {
    'type': 'text', 'label': ' <b>Variable Name</b>', 'size': 16, 'default': 'customtra' + i, 'save': false,
    'title': 'Cannot be changed\nUse this exact spelling in the ordering fields'
  };
  traFields['tra_customtra' + i + '_version'] = {
    'type': 'text', 'label': ' <b>Version</b>', 'size': 1, 'default': 'n/a', 'save': false
  };
  traFields['tra_customtra' + i + '_isGazelle'] = {
    'type': 'checkbox', 'label': 'Gazelle', 'default': false, 'title': 'Tracker is Gazelle-based'
  };
  traFields['tra_customtra' + i + '_searchurl'] = {
    'type': 'text', 'label': ' <b>Search URL</b>', 'size': 48, 'default': '%ARTIST%',
    'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)'
  };
  traFields['tra_customtra' + i + '_searchpatt'] = {
    'type': 'text', 'label': ' <b> Search match pattern</b>', 'size': 48, 'default': 'null',
    'title': 'Regex pattern to match search pages'
  };
  traFields['tra_customtra' + i + '_torrentpatt'] = {
    'type': 'text', 'label': ' <b> Torrent match pattern</b>', 'size': 48, 'default': 'null',
    'title': 'Regex pattern to match torrent pages'
  };
  traFields['tra_customtra' + i + '_artistpatt'] = {
    'type': 'text', 'label': ' <b> Artist match pattern</b>', 'size': 48, 'default': 'null',
    'title': 'Regex pattern to match artist pages'
  };
  traFields['tra_customtra' + i + '_tagurl'] = {
    'type': 'text', 'label': ' <b>Tag Link</b>', 'size': 48, 'default': '%TAG%',
    'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)'
  };
  traFields['tra_customtra' + i + '_tagreplace'] = {
    'label': '<b>Tag Pattern/Replace</b>', 'type': 'textarea', 'rows': 1, 'cols': 16, 'default': '',
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()'
  };
  traFields['tra_customtra' + i + '_morelink'] = {
    'type': 'text', 'label': ' <b>More link</b>', 'size': 48, 'default': '%ARTIST%',
    'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers'
  };
  traFields['tra_customtra' + i + '_css'] = {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40, 'default': ''
  };
  traFields['tra_customtra' + i + '_isAudioRelease'] = {
    'label': '<b>isAudioRelease</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'return false;'
  };
  traFields['tra_customtra' + i + '_hook'] = {
    'label': '<b>hook</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'return null;'
  };
  traFields['tra_customtra' + i + '_findArtist'] = {
    'label': '<b>findArtist</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'return null;'
  };
  traFields['tra_customtra' + i + '_findMultipleArtists'] = {
    'label': '<b>findMultipleArtists</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'return null;'
  };
  traFields['tra_customtra' + i + '_findAlbum'] = {
    'label': '<b>findAlbum</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': 'return null;'
  };
  traFields['tra_customtra' + i + '_icontype'] = {
    'type': 'select', 'label': ' <b>Icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png', 'title': 'Type of image (extension)'
  };
  traFields['tra_customtra' + i + '_icondata'] = {
    'title': 'Base64-encoded image', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': ''
  };
}
for (var i = 0, len = traData.length; i < len; i++) {
  trackers.push(traData[i][1]);
  traFields['tra_' + traData[i][1] + '_name'] = {
    'type': 'text', 'label': ' <b>Name</b>', 'size': 12, 'default': traData[i][0], 'section': ['', '<b><u>' + traData[i][0] + ' Settings</u><b>'],
    'title': 'Name of the tracker\nDisplayed in the tooltip\nDo not use this value in the tracker ordering field - use the Variable Name below',
  };
  traFields['tra_' + traData[i][1] + '_label'] = {
    'type': 'text', 'label': ' <b>Variable Name</b>', 'size': 12, 'default': traData[i][1], 'save': false,
    'title': 'Cannot be changed\nUse this exact spelling in the ordering fields'
  };
  traFields['tra_' + traData[i][1] + '_version'] = {
    'type': 'text', 'label': ' <b>Version</b>', 'size': 1, 'default': traData[i][2]
  };
  traFields['tra_' + traData[i][1] + '_isGazelle'] = {
    'type': 'checkbox', 'label': 'Gazelle', 'default': traData[i][3],
    'title': 'Tracker is Gazelle-based'
  };
  traFields['tra_' + traData[i][1] + '_searchurl'] = {
    'type': 'text', 'label': ' <b> Search URL</b>', 'size': 48, 'default': traData[i][4],
    'title': 'Tracker link search URL\nReplace the searchTerms with the Artist variable (default is %ARTIST%)'
  };
  traFields['tra_' + traData[i][1] + '_searchpatt'] = {
    'type': 'text', 'label': ' <b> Search match pattern</b>', 'size': 48, 'default': traData[i][5],
    'title': 'Regex pattern to match search pages'
  };
  traFields['tra_' + traData[i][1] + '_torrentpatt'] = {
    'type': 'text', 'label': ' <b> Torrent match pattern</b>', 'size': 48, 'default': traData[i][6],
    'title': 'Regex pattern to match torrent pages'
  };
  traFields['tra_' + traData[i][1] + '_artistpatt'] = {
    'type': 'text', 'label': ' <b> Artist match pattern</b>', 'size': 48, 'default': traData[i][7],
    'title': 'Regex pattern to match artist pages'
  };
  traFields['tra_' + traData[i][1] + '_tagurl'] = {
    'type': 'text', 'label': '<b> Tag Link</b>', 'size': 48, 'default': traData[i][8],
    'title': 'Tracker tag link search URL\nReplace the searchTerms with the Tag variable (default is %TAG%)'
  };
  traFields['tra_' + traData[i][1] + '_tagreplace'] = {
    'label': '<b>Tag Pattern/Replace</b>', 'type': 'textarea', 'rows': 1, 'cols': 16, 'default': traData[i][9],
    'title': 'Regexp patterns and replacement strings to apply to the search URL\nEach pattern+replacement should be on a separate line, and typed exactly as it would appear inside ()s in a .replace()'
  };
  if (traData[i][1] == 'shellife') {
    traFields.tra_shellife_taglist = {
      'label': '<b>Tag Names/Category Numbers</b>', 'type': 'textarea', 'rows': 8, 'cols': 20, 'default': defShellifeTags,
      'title': 'List of Shellife tags and associated category ID numbers\nTags matching this list\'s tag names will be mapped to the associated category number'
    };
  }
  traFields['tra_' + traData[i][1] + '_morelink'] = {
    'type': 'text', 'label': ' <b>More link</b>', 'size': 48, 'default': traData[i][10],
    'title': 'Artist search linked to artist name heading text\nRedundant on Gazelle trackers'
  };
  traFields['tra_' + traData[i][1] + '_css'] = {
    'label': '<b>CSS</b>', 'type': 'textarea', 'rows': 3, 'cols': 40, 'default': traData[i][11],
    'title': 'Custom CSS for the tracker'
  };
  traFields['tra_' + traData[i][1] + '_isAudioRelease'] = {
    'label': '<b>isAudioRelease</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][12]
  };
  traFields['tra_' + traData[i][1] + '_hook'] = {
    'label': '<b>hook</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][13]
  };
  traFields['tra_' + traData[i][1] + '_findArtist'] = {
    'label': '<b>findArtist</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][14]
  };
  traFields['tra_' + traData[i][1] + '_findMultipleArtists'] = {
    'label': '<b>findMultipleArtists</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][15]
  };
  traFields['tra_' + traData[i][1] + '_findAlbum'] = {
    'label': '<b>findAlbum</b> function', 'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][16]
  };
  traFields['tra_' + traData[i][1] + '_icontype'] = {
    'type': 'select', 'label': '<b> Icon</b>', 'default': traData[i][17],
    'title': 'Type of image (extension)', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff']
  };
  traFields['tra_' + traData[i][1] + '_icondata'] = {
    'type': 'textarea', 'rows': 4, 'cols': 96, 'default': traData[i][18],
    'title': 'Base64-encoded image'
  };
}
traData = null;
// +------------------------------------------------------------------------------+
// |                      end TRACKERS ADVANCED SETTINGS MENU                     |
// +------------------------------------------------------------------------------+

var gmc_optra = new GM_configStruct(
  {
    'id': 'TrackersMenu',
    'title': oinkplusIcon + ' Trackers Advanced Settings Menu',
    'fields': traFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: center !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function(doc) {
        var config = this;
        var icontypes = doc.querySelectorAll('div[title="Type of image (extension)"]');
        var icondatas = doc.querySelectorAll('div[title="Base64-encoded image"]');
        for (var i = 0, len = icontypes.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '')
            icontypes[i].firstChild.nextSibling.innerHTML += ': <img title="Icon preview" src="data:image/' + icontypes[i].firstChild.value +
              ';base64,' + icondatas[i].firstChild.textContent + '" style="width: 32px; height: 32px; border-width: 0px; padding: 0px 0px 0px 0px;">';
        }
        for (i = 0, len = icondatas.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '') continue;
          var input = doc.createElement('input');
          input.type = 'file';
          input.id = icondatas[i].firstChild.id.replace('_icondata', '_filebtn');
          input.multiple = false;
          input.title = 'Click to add a local file and automatically convert it to base64';
          icondatas[i].appendChild(input);
        }
        var iconfiles = doc.querySelectorAll('input[title$="convert it to base64"]');
        for (i = 0, len = iconfiles.length; i < len; i++) {
          iconfiles[i].addEventListener('change', function(evt) {
            var replacementtext;
            var thisid = this.id;
            var files = evt.target.files;
            var file = files[0];
            var fileExtension = file.name.toLowerCase().split('.').pop().replace('jpg', 'jpeg');
            if (files && file) {
              var reader = new FileReader();
              reader.onload = function(readerEvt) {
                var texttoreplace = thisid.replace('TrackersMenu_field_', '').replace('filebtn', 'icondata');
                var binaryString = readerEvt.target.result;
                var base64String = btoa(binaryString);
                config.fields[texttoreplace].value = base64String;
                config.fields[texttoreplace].reload();
                if (['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'].indexOf(fileExtension) > -1) {
                  var typetochange = texttoreplace.replace('icondata', 'icontype');
                  config.fields[typetochange].value = fileExtension;
                  config.fields[typetochange].reload();
                }
              };
              reader.readAsBinaryString(file);
            }
          }, false);
        }
      },
      'save': function() {
        valuesSaved = true;
        var config = this;
        GM_setValue('custom_trackers', config.get('tra_custom_total'));
        config.close();
      }
    }
  });
gmc_optra.init();
// +------------------------------------------------------------------------------+
// |                     init TRACKERS ADVANCED SETTINGS MENU                     |
// +------------------------------------------------------------------------------+

// +------------------------------------------------------------------------------+
// |                            ADVANCED SETTINGS MENU                            |
// +------------------------------------------------------------------------------+
var advFields = {
  'oinkplus_css_code': {
    'label': '<b>OiNKPlus CSS Code</b>', 'type': 'textarea', 'rows': 8, 'cols': 96, 'section': ['', '<b><u>CSS / Basic Layout</u></b>'],
    'default': '.OinkPlus { position:relative; max-width:1300px; }\n.explore  { text-decoration:none; }\n.leftinfo {clear:both;}\n.floatright { border: solid #000000 0px;float:right;margin:0pt 0pt 10px 10px;padding:2px;text-align: left;}\n.floatleft { border: solid #000000 0px;float:left;text-align: left; width:140px;  }\n.floatleft-small { border: solid #000000 0px;float:left;text-align: left;   }\n.floatmiddle { border: solid #000000 0px;text-align: left; margin-left:140px;} '
  },
  'oinkplus_basic_layout': {
    'label': '<b>OiNKPlus Basic Layout</b>', 'type': 'textarea', 'rows': 24, 'cols': 96,
    'default': '<div id="OinkPlus" class="OinkPlus"><div class="floatleft"><h2><div id="ArtistName"></div></h2>  \n <div id="toggleLastFMSimilar"></div>&nbsp;<b>Similar artists:</b><br>    \n <div id="LastFMSimilar"></div>   \n <br> \n <div id="toggleHistory"></div>&nbsp;<b>Browsing History:</b><br>    \n <div id="History"></div><br>   \n </div>          \n <div id="artistinfo" class="floatmiddle">\n <div class="floatright"> \n <div id="ArtistSearchField"></div><br>     \n <div id="ArtistImage"></div><br>   \n </div><div id="ArtistTitle"></div><div class="floatleft-small"><img src="%TAGICON%" style="vertical-align:bottom; margin-top:5px; margin-right:5px; !important;" > </div>      \n <div id="LastFMTags"></div><br>    \n <div id="toggleLastFMBio"></div>&nbsp;<b>Abstract:</b><br>       \n <div id="LastFMBio"></div><br>      \n <div id="HydraLinks"></div><br>   \n <div id="ExternalLinks"></div><br>\n</div>       \n <div id="UpdateNotify" class="leftinfo"></div>   \n </div> '
  },
  'oinkplus_plus_icontype': {
    'type': 'select', 'label': '<b> Plus Toggle icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif',
    'title': 'Type of image (extension)', 'section': ['', '<b><u>Icon Images</u></b>']
  },
  'oinkplus_plus_icondata': {
    'type': 'textarea', 'rows': 1, 'cols': 96, 'default': 'R0lGODlhCQAJAIAAAOLn7UtjfCwAAAAACQAJAAACEYyPoAu28aCSDSJLc44s3lMAADs%3D',
    'title': 'Plus Toggle icon base64-encoded image'
  },
  'oinkplus_minus_icontype': {
    'type': 'select', 'label': '<b> Minus Toggle icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif',
    'title': 'Type of image (extension)'
  },
  'oinkplus_minus_icondata': {
    'type': 'textarea', 'rows': 1, 'cols': 96, 'default': 'R0lGODlhCQAJAIAAAOLn7UtjfCwAAAAACQAJAAACEIyPoAvG614L80x5ZXyohwIAOw%3D%3D',
    'title': 'Minus Toggle icon base64-encoded image'
  },
  'oinkplus_spinner_icontype': {
    'type': 'select', 'label': '<b> Spinner icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif',
    'title': 'Type of image (extension)'
  },
  'oinkplus_spinner_icondata': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'R0lGODlhEAAQAPMAAP%2F%2F%2FwAAAAAAAIKCgnJycqioqLy8vM7Ozt7e3pSUlOjo6GhoaAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAEAAQAAAEKxDISau9OE%2FBu%2F%2FcQBTGgWDhWJ5XSpqoIL6s5a7xjLeyCvOgIEdDLBqPlAgAIfkECQoAAAAsAAAAABAAEAAABCsQyEmrvThPwbv%2FXJEMxIFg4VieV0qaqCC%2BrOWu8Yy3sgrzoCBHQywaj5QIACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2F9xhFMlAYOFYnldKmqggvqzlrvGMt7IK86AgR0MsGo%2BUCAAh%2BQQJCgAAACwAAAAAEAAQAAAEMRDISau9OE%2FBu%2F%2BcghxGkQyEFY7lmVYraaKqIMpufbc0bLOzFyXGE25AyI5myWw6KREAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FnKQgh1EkA0GFwFie6SqIpImq29zWMC6xLlssR3vdZEWhDwBqejTQqHRKiQAAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FHKUgh1EkAyGF01ie6SqIpImqACu5dpzPrRoMpwPwhjLa6yYDOYuaqHRKjQAAIfkECQoAAAAsAAAAABAAEAAABDEQyEmrvThPwbv%2FnKUgh1EkAxFWY3mmK9WaqCqIJA3fbP7aOFctNpn9QEiPZslsOikRACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2FxymIIexEOE1lmdqrSYqiGTsVnA7q7VOszKQ8KYpGo%2FICAAh%2BQQJCgAAACwAAAAAEAAQAAAEJhDISau9OE%2FBu%2F%2BcthBDEmZjeWKpKYikC6svGq9XC%2B6e5v%2FAICUCACH5BAkKAAAALAAAAAAQABAAAAQrEMhJq704T8G7%2Fxy2EENSGOE1lmdqrSYqiGTsVnA7q7VOszKQ8KYpGo%2FICAAh%2BQQJCgAAACwAAAAAEAAQAAAEMRDISau9OE%2FBu%2F%2BctRBDUhgHElZjeaYr1ZqoKogkDd9s%2Fto4Vy02mf1ASI9myWw6KREAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FHLUQQ1IYByKF01ie6SqIpImqACu5dpzPrRoMpwPwhjLa6yYDOYuaqHRKjQAAIfkECQoAAAAsAAAAABAAEAAABDYQyEmrvThPwbv%2FnLQQQ1IYB0KFwFie6SqIpImq29zWMC6xLlssR3vdZEWhDwBqejTQqHRKiQAAIfkECQoAAAAsAAAAABAAEAAABDEQyEmrvThPwbv%2F3EIMSWEciBWO5ZlWK2miqiDKbn23NGyzsxclxhNuQMiOZslsOikRADsAAAAAAAAAAAA%3D',
    'title': 'Spinner icon base64-encoded image'
  },
  'oinkplus_search_icontype': {
    'type': 'select', 'label': '<b> Search icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'gif',
    'title': 'Type of image (extension)'
  },
  'oinkplus_search_icondata': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'R0lGODlhDgAOANUAAPr6%2Bri4uPLy8vz8%2FMbGxtjY2Pf3997e3vv7%2B9bW1rq6utPT07u7u7S0tLKystzc3NDQ0MPDw7CwsO%2Fv783NzczMzNTU1PT09NXV1ezs7LW1tc%2FPz7Ozs%2FPz86mpqevr6%2Fb29v39%2Fbm5uf7%2B%2Fqampv%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAOAA4AAAZvwJJwSCwOB6GRcmm0MDwMzMVYIpCuV0KnuCCJEp9EgLQoikgFA8BQ8I6IHlInVAp1SB768PwYPrwDRBAkCgcABwokFHpCGRFYWA4gRAgfGwEeARUOJA2TQiMIIAITAh0fDSQanyVvRAAfHBICVFRBADs%3D',
    'title': 'Search icon base64-encoded image'
  },
  'oinkplus_explore_icontype': {
    'type': 'select', 'label': '<b> Explore Similar icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png',
    'title': 'Currently unused\nType of image (extension)'
  },
  'oinkplus_explore_icondata': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAAAOFJREFUOMvVUqFuw1AMvE7VpHxAQHDA0Da4gf5DUL4kLN%2FzWFDQAwNT2camRQMJHA0NsC9O3lCrri3oFtSTLFuWfD75vAohYAluFk1fH0FZli9FUdz%2Bm0BVNyLyddhbhRDgnAsAYGYwM5AESagqVBUiAlVFHMcgia7rPp1zjwCw3jGlaYp5njFN068ws5M8DMNDlmXvdV0%2FrQ837wiOh47rcRxBctwrMDM0TXNWtohARBBFEZIkQd%2F3aNv2w3u%2F2d%2FgEuR5%2FkzyleS39%2F7uzy5UVfVGcmtm9ycuLMGVvfI5%2FADcE8BIG7ekhwAAACJ6VFh0U29mdHdhcmUAAHjac0zJT0pV8MxNTE8NSk1MqQQAL5wF1K4MqU0AAAAASUVORK5CYII%3D',
    'title': 'Explore Similar icon base64-encoded image'
  },
  'oinkplus_tag_icontype': {
    'type': 'select', 'label': '<b> Tag icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png',
    'title': 'Type of image (extension)'
  },
  'oinkplus_tag_icondata': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJCAYAAAACTR1pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJlJREFUeNpi%2FP%2F%2FPwMMMHUcqwNSjQyEwT5GmEaopnAgPgfE3whoTGNC1sTJwnRhQ7CGIRE2MrDANEnzsl3ZGa7lqCXCJQnkHyWkkQnqp3O5xpJSUE1EAZDGJiA2mnz2%2BdNrb749J1rjvwqreiC95unnX7qmCy7t3Xr3%2FTViNCKHKsjJIUB8Boh%2FEApVRrR4BGmuI8LCHQABBgC0YDp2HRMWcAAAAABJRU5ErkJggg%3D%3D',
    'title': 'Tag icon base64-encoded image'
  },
  'oinkplus_similar_icontype': {
    'type': 'select', 'label': '<b> Highlighted Similar Artist icon</b>', 'options': ['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'], 'default': 'png',
    'title': 'Type of image (extension)'
  },
  'oinkplus_similar_icondata': {
    'type': 'textarea', 'rows': 4, 'cols': 96,
    'default': 'iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHISURBVChTVZHdS1oBGMbPfzBqRLsRWjCIDt3vwsL1cSKzIqIaUuqy0s6CIizTzmpizhs3yciojVoXx0N0IbHNIipYZASLirQIImksK+ysTh8Yp6AnlSbsuXlvfvweeF6CeMwrVRepMrs40/B3ocM9C/qjV6g2OLliFUP+YxK3QG2usrNL4mTgFi7/Nd75eOg9v6EcCaKSYcVcpaEiAcaNlomf4ujaLWyLV2j3RlA3HkKRYwM53YuQ9c0hjx6KUuq+LOK10cU5V0QYZy6h5U6gcO/hhWkVKc0+mLlNLAXDoIwsSnVWltB9+ibQXgE1X48gc+4irX0ZT5p8oL/8QuCAh2chgMxaOwqb+nmixv4DJSOH8KydY3rjFE/1M1AO+BE6vsDCeghkvQOSUiPyVAyI8t4pgbRuY37nDPcA5reOEf57ja39E7zUuRJgBkWDamB4Qt7q4NJj1c/ezmJ5N4Ib8Q5h/hIlhs9JMFuuR5nuPUsUNzKktG1MTNVM4rl2Av7gH2hsXAzsShgzC7Qo1JijiubYGvHEd5S1uqMZdYOQVNmSYLa8JV4fldZ2Kv57DKU2ZZXRH7j8RiufW9+DojcMX95iYZPGGP0AZecJAEoHq2IAAAAASUVORK5CYII=',
    'title': 'Highlighted Similar Artist icon base64-encoded image'
  },
  'oinkplus_var_apikey': {
    'type': 'text', 'label': ' <b>API Key</b>', 'size': 12, 'default': '%APIKEY%', 'section': ['', '<b><u>URL Variables</u></b>'],
    'title': 'The variable to be replaced with the API Key in Last.fm API Call URLs\nChanging this setting WILL NOT change the API Call URL settings - they must also be manually updated if this is changed'
  },
  'oinkplus_var_artist': {
    'type': 'text', 'label': ' <b>Artist</b>', 'size': 12, 'default': '%ARTIST%',
    'title': 'The variable to be replaced with the searched Artist in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed'
  },
  'oinkplus_var_album': {
    'type': 'text', 'label': ' <b>Album</b>', 'size': 12, 'default': '%ALBUM%',
    'title': 'The variable to be replaced with the searched Album in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed'
  },
  'oinkplus_var_tag': {
    'type': 'text', 'label': ' <b>Tag</b>', 'size': 12, 'default': '%TAG%',
    'title': 'The variable to be replaced with the searched Tag in search URLs\nChanging this setting WILL NOT change the search URL settings - they must also be manually updated if this is changed'
  },
  'lastfm_artist_url': {
    'type': 'text', 'label': ' <b>Artist URL</b>', 'size': 72, 'default': 'http://www.last.fm/music/%ARTIST%', 'section': ['', '<b><u>Last.fm URLs</u></b>'],
    'title': 'The URL for the artist on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)'
  },
  'lastfm_bio_url': {
    'type': 'text', 'label': ' <b>Biography URL</b>', 'size': 72, 'default': 'http://www.last.fm/music/%ARTIST%/%2bwiki',
    'title': 'The URL for the biography on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)'
  },
  'lastfm_bio_link': {
    'type': 'text', 'label': ' <b>Biography Link</b>', 'size': 72, 'default': '<a href="http://www.last.fm/music/%ARTIST%/%2bwiki" target="_blank">read more</a>',
    'title': 'The link for the biography on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)'
  },
  'lastfm_gallery_url': {
    'type': 'text', 'label': ' <b>Gallery URL</b>', 'size': 72, 'default': 'http://www.last.fm/music/%ARTIST%/+images',
    'title': 'The URL for the image gallery on Last.fm\nReplace the artist name with the Artist variable (default is %ARTIST%)'
  },
  'lastfm_info_url': {
    'type': 'text', 'label': ' <b>getInfo URL</b>', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=%ARTIST%&api_key=%APIKEY%',
    'title': 'The URL for the getInfo API API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)'
  },
  'lastfm_tags_url': {
    'type': 'text', 'label': ' <B>getTopTags URL</b>', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getTopTags&artist=%ARTIST%&api_key=%APIKEY%',
    'title': 'The URL for the getTopTags API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)'
  },
  'lastfm_similar_url': {
    'type': 'text', 'label': ' <b>getSimilar URL</b>', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=%ARTIST%&api_key=%APIKEY%',
    'title': 'The URL for the getSimilar API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)'
  },
  'lastfm_albums_url': {
    'type': 'text', 'label': ' <B>getTopAlbums URL </b>', 'size': 96, 'default': 'http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=%ARTIST%&api_key=%APIKEY%',
    'title': 'The URL for the getTopAlbums API Call on Last.fm\nReplace the artist name and API key with the Artist and API Key variables (default is %ARTIST% and %APIKEY%)'
  },
  'resourceLoadTimeout': {
    'type': 'unsigned float', 'label': ' <b>Timeout</b>', 'size': 1, 'min': 0.001, 'default': 10, 'section': ['', '<b><u>Other Variables</u></b>'],
    'title': 'Time in seconds to wait before timing out loading Last.fm resources\nMust be a positive number'
  },
  'oinkplus_debug': {
    'type': 'checkbox', 'label': 'Debug mode', 'title': 'Logs various status messages to the console', 'default': false
  }/*,
  'import_settings': {
    'label': '<b>Import Settings</b>', 'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '', 'save': false, 'section': ['', '<b><u>Import/Export Settings</u></b>'],
    'title': 'A copy of all the OiNKPlus GM_config menu settings\nCopy/paste this elsewhere if you wish to back them up, or import them into another copy of OiNKPlus on another browser'
  },
  'import_button': {
    'type': 'button', 'label': 'Import Settings', 'click': function() {}
  },
  'export_settings': {
    'label': '<b>Export Settings</b>', 'type': 'textarea', 'rows': 8, 'cols': 96, 'default': '', 'save': false,
    'title': 'A copy of all the OiNKPlus GM_config menu settings\nCopy/paste this elsewhere if you wish to back them up, or import them into another copy of OiNKPlus on another browser'
  },
  'export_button': {
    'type': 'button', 'label': 'Copy To Clipboard', 'click': function() {
      var settingsToExport = gmc_opadv.fields.export_settings.toValue();
      GM_setClipboard(settingsToExport);
      alert('OiNKPlus settings copied to clipboard.');
    }
  }*/
};
// +------------------------------------------------------------------------------+
// |                          end ADVANCED SETTINGS MENU                          |
// +------------------------------------------------------------------------------+

var gmc_opadv = new GM_configStruct(
  {
    'id': 'AdvSettings',
    'title': oinkplusIcon + ' OiNKPlus Advanced Settings Menu',
    'fields': advFields,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'open': function(doc) {
        var config = this;
        /*var exportStr = '{"MainMenu": ' + GM_getValue('MainMenu') + ',\n';
        exportStr += '"ArtistColors": ' + GM_getValue('ArtistColors') + ',\n';
        exportStr += '"ArtistList": ' + GM_getValue('ArtistList') + ',\n';
        exportStr += '"SitesMenu": ' + GM_getValue('SitesMenu') + ',\n';
        exportStr += '"ExternalsMenu": ' + GM_getValue('ExternalsMenu') + ',\n';
        exportStr += '"TrackersMenu": ' + GM_getValue('TrackersMenu') + ',\n';
        exportStr += '"custom_externals": ' + GM_getValue('custom_externals') + ',\n';
        exportStr += '"custom_trackers": ' + GM_getValue('custom_trackers') + '}';
        config.fields['export_settings'].value = JSON.stringify(JSON.parse(exportStr), null, 4);
        config.fields['export_settings'].reload();
        doc.getElementById('undefined_field_export_settings').addEventListener('click', function(){ this.select(); });*/
        var icontypes = doc.querySelectorAll('div[title$="Type of image (extension)"]');
        var icondatas = doc.querySelectorAll('div[title$=" base64-encoded image"]');
        for (var i = 0, len = icontypes.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '')
            icontypes[i].firstChild.nextSibling.innerHTML += ': <img title="Icon preview" src="data:image/' + icontypes[i].firstChild.value +
              ';base64,' + icondatas[i].firstChild.textContent + '">';
        }
        for (i = 0, len = icondatas.length; i < len; i++) {
          if (icondatas[i].firstChild.textContent !== '') continue;
          var input = doc.createElement('input');
          input.type = 'file';
          input.id = icondatas[i].firstChild.id.replace('_icondata', '_filebtn');
          input.multiple = false;
          input.title = 'Click to add a local file and automatically convert it to base64';
          icondatas[i].appendChild(input);
        }
        var iconfiles = doc.querySelectorAll('input[title$="convert it to base64"]');
        for (i = 0, len = iconfiles.length; i < len; i++) {
          iconfiles[i].addEventListener('change', function(evt) {
            var replacementtext;
            var thisid = this.id;
            var files = evt.target.files;
            var file = files[0];
            var fileExtension = file.name.toLowerCase().split('.').pop().replace('jpg', 'jpeg');
            if (files && file) {
              var reader = new FileReader();
              reader.onload = function(readerEvt) {
                var texttoreplace = thisid.replace('AdvSettings_field_', '').replace('filebtn', 'icondata');
                var binaryString = readerEvt.target.result;
                var base64String = btoa(binaryString);
                config.fields[texttoreplace].value = base64String;
                config.fields[texttoreplace].reload();
                if (['bmp', 'exif', 'gif', 'ico', 'jpeg', 'png', 'tiff'].indexOf(fileExtension) > -1) {
                  var typetochange = texttoreplace.replace('icondata', 'icontype');
                  config.fields[typetochange].value = fileExtension;
                  config.fields[typetochange].reload();
                }
              };
              reader.readAsBinaryString(file);
            }
          }, false);
        }
      },
      'save': function(values) {
        valuesSaved = true;
        var config = this;
        config.close();
      }
    }
  });
gmc_opadv.init();
// +------------------------------------------------------------------------------+
// |                         init ADVANCED SETTINGS MENU                          |
// +------------------------------------------------------------------------------+

var previousVersion;
if (GM_getValue("oinkplusVersion") === undefined) {
  GM_setValue('oinkplusVersion', VERSION);
  previousVersion = VERSION;
} else previousVersion = GM_getValue("oinkplusVersion");
if (previousVersion < VERSION) {
  GM_setValue('oinkplusVersion', VERSION);
  var newUselessTags = (GM_config.get('useless_tags') + ',' + mainFields.useless_tags.default).split(/, ?/);
  newUselessTags.sort();
  for (var i = 1, len = newUselessTags.length; i < len; i++)
    if (newUselessTags[i] == newUselessTags[i - 1]) newUselessTags[i] = '';
  newUselessTags.sort();
  while (newUselessTags[0] === '') newUselessTags.shift();
  GM_config.set('useless_tags', newUselessTags.join(', '));
  console.log('gmc_opsit.get(\'tracker_order\'): ' + gmc_opsit.get('tracker_order'));
  var newTrackerOrder = 'redacted\n' + gmc_opsit.get('tracker_order');
  console.log('newTrackerOrder: ' + newTrackerOrder);
  gmc_opsit.set('tracker_order', newTrackerOrder);
  console.log('gmc_opsit.get(\'tracker_order\'): ' + gmc_opsit.get('tracker_order'));
  gmc_opadv.set('oinkplus_css_code', advFields.oinkplus_css_code.default);
  gmc_opadv.set('oinkplus_basic_layout', advFields.oinkplus_basic_layout.default);
  gmc_opadv.set('lastfm_artist_url', advFields.lastfm_artist_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')));
  gmc_opadv.set('lastfm_bio_url', advFields.lastfm_bio_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')));
  gmc_opadv.set('lastfm_bio_link', advFields.lastfm_bio_link.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')));
  gmc_opadv.set('lastfm_gallery_url', advFields.lastfm_gallery_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')));
  gmc_opadv.set('lastfm_info_url', advFields.lastfm_info_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')).
                replace(advFields.oinkplus_var_apikey.default, gmc_opadv.get('oinkplus_var_apikey')));
  gmc_opadv.set('lastfm_tags_url', advFields.lastfm_tags_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')).
                replace(advFields.oinkplus_var_apikey.default, gmc_opadv.get('oinkplus_var_apikey')));
  gmc_opadv.set('lastfm_similar_url', advFields.lastfm_similar_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')).
                replace(advFields.oinkplus_var_apikey.default, gmc_opadv.get('oinkplus_var_apikey')));
  gmc_opadv.set('lastfm_albums_url', advFields.lastfm_albums_url.default.replace(advFields.oinkplus_var_artist.default, gmc_opadv.get('oinkplus_var_artist')).
                replace(advFields.oinkplus_var_apikey.default, gmc_opadv.get('oinkplus_var_apikey')));
  for (var j in traFields) {
    if (!/tra_custom(tra\d{1,2}_.+|_total)/.test(j))
      gmc_optra.set(j, traFields[j].default);
    for (j in extFields) {
      if (!/ext_custom(ext\d{1,2}_.+|_total)/.test(j))
        gmc_opext.set(j, extFields[j].default);
    }
  }
  GM_config.save();
  alert('OiNKPlus has been updated to version ' + VERSION + '.\n\nThe following settings have been updated to their new default values:\n\n\
OiNKPlus CSS and Basic Layout\nLast.fm API URLs\nPredefined Tracker and External Site advanced settings (does not include custom tracker/site settings)\n\
The existing Useless Tags setting has been combined with the new version\'s default list\n\nAll other settings retain their previous values.' +
        (includesUpdated ? '\n\n@include directives have been updated for this version- you may wish to review your User Includes/Excludes\
if you previously changed them.' : ''));
}
// +------------------------------------------------------------------------------+
// |                               end OINKPLUS MENUs                             |
// +------------------------------------------------------------------------------+

main();

// here be monsters
//.user.js