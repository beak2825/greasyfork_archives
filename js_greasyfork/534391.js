;const lemmatizer = (() => {
    const wn_files = {
        noun: [
            'index.noun.json',
            'noun.exc.json'
        ],
        verb: [
            'index.verb.json',
            'verb.exc.json'
        ],
        adj: [
            'index.adj.json',
            'adj.exc.json'
        ],
        adv: [
            'index.adv.json',
            'adv.exc.json'
        ]
    };
    const wn_data = {};
    Object.values(wn_files).forEach(v => v.forEach(vv => wn_data[vv] = GM_getResourceText(vv)));
    return new Lemmatizer(wn_data)
})();