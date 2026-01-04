;(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const goldDictKey = parseKey(GM_getValue('goldDictKey', 'ctrl c,ctrl c'));
    const ocrKey = parseKey(GM_getValue('ocrKey', ['windows', 'win32', 'win64'].filter(v => userAgent.indexOf(v) > -1).length > 0 ? 'cmd alt c' : 'alt c'));
    const menus = GM_getValue('menus', [
        {
            title: 'ocr translate',
            action: {next: goldDictKey, prev: ocrKey},
            key: 'h',
            path: 'aca'
        },
        {
            title: "ocr",
            action: ocrKey,
            key: "k"
        },
        {
            title: "parse qrcode",
            action: 'ctrl alt x',
            key: "x"
        },
        {
            title: "anki",
            action: addAnki,
            key: "p"
        },
        {
            title: 'qrcode',
            action() {
                const html = document.createElement('div');
                html.innerHTML = createHtml(`
                        <style>
                            .qr-text{ width: 26vw; margin-bottom: 1vw; height: 2vw; font-size: 100%; }
                            .qr-img img{ margin: auto; max-width: 27vw }
                        </style>
                        
                        <div class="qr-container">
                            <input type="text" name="qr-text" class="qr-text" value="${location.href}">
                            <div class="qr-img"></div>
                        </div>`);
                const qr = new QRCode(html.querySelector('.qr-img'), {
                    text: location.href,
                    correctLevel: QRCode.CorrectLevel.L,
                    height: 365,
                    width: 365,
                });
                html.querySelector('.qr-text').addEventListener('change', function () {
                    this.value && qr.makeCode(this.value);
                });
                Swal.fire({
                    title: "<h3>qrcode</h3>",
                    html: html,
                    width: '32vw',
                });
            },
            key: 'm'
        }
        /*{
            title: "sh",
            action: {
                cmd: "ls -l /var/log/!*.log",
            },
            key: "e",
            path: "cmd",
            call: (res) => {
                console.log(res.response)
            },
        }*/
        /*{
            title: "env",
            action: {
                cmd: ["env","grep","wc"],
                args: [],
                "1": ["PATH"],
                "2": ["-l"],
                env: ["PATH=$PATH:/home/xing"]
            },
            key: "e",
            path: "cmd",
            call: (res) => {
                console.log(res.response)
            },
        }*/
        /*{
            title: "ls",
            action: {cmd: "ls", args: ["-l", "/"]},
            key: "e",
            path: "cmd",
            call: (res) => {
                console.log(res.response)
            },
        }*/
    ]);
    PushContextMenu(...menus);
})();