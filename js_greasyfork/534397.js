;PushIconAction({
    name: 'force copy',
    id: 'icon-copy',
    image: GM_getResourceURL('icon-copy'),
    trigger: (t, hideIcon) => {
        const el = getSelectionElement();
        const html = el.innerHTML ? el.innerHTML : t;
        const item = new ClipboardItem({
            'text/html': new Blob([html], {type: 'text/html'}),
            'text/plain': new Blob([t], {type: 'text/plain'}),
        })
        navigator.clipboard.write([item]).catch((err) => {
            console.log(err);
            request('text=' + t, '', () => {
                hideIcon();
            }).catch(console.log);
        });
    },
});