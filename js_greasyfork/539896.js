// ==UserScript==
// @name         Letterboxd ListSearch Plus
// @namespace    https://greasyfork.org/users/1484969
// @license      MIT
// @version      1.0.2
// @description  Search and filter Letterboxd lists with advanced options
// @match        https://letterboxd.com/*/list/*
// @exclude      https://letterboxd.com/*/list/*/page*
// @exclude      https://letterboxd.com/*/list/*/edit*
// @exclude      https://letterboxd.com/*/list/*/stats*
// @exclude      https://letterboxd.com/*/list/*/detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539896/Letterboxd%20ListSearch%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/539896/Letterboxd%20ListSearch%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
.user-search-wrapper {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.load-status {
    margin-right: 8px;
    display: flex;
    align-items: center;
    font: 13px Graphik-Regular-Web, sans-serif;
    color: #ccc;
}

.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #00ac1c;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 6px;
    box-sizing: border-box;
    flex-shrink: 0;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.user-search {
    width: min(600px, 100%);
    padding: 0 48px 0 16px;
    height: 40px;
    font: 14px/1.2 Graphik-Regular-Web, sans-serif;
    color: #222;
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 20px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    transition: border-color .2s, box-shadow .2s;
}

.user-search:focus {
    border-color: #3a7ca5;
    box-shadow: 0 0 0 2px rgba(58,124,165,0.3);
    outline: none;
}

.user-search-button {
    position: absolute;
    right: 16px;
    top: 50%;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    border: none;
    background: url('https://s.ltrbxd.com/static/img/sprite-Cmcg-tqK.svg') no-repeat;
    background-size: 800px 1020px;
    background-position: -100px -170px;
    cursor: pointer;
    background-color: transparent;
    text-indent: -9999px;
}

.user-advanced-toggle {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 20px;
    padding: 0 8px;
    font: 14px/1.2 Graphik-Regular-Web, sans-serif;
    cursor: pointer;
    background-color: #f0f0f0;
    color: #555;
    border: 1px solid #d3d3d3;
}

.user-search-wrapper.advanced-mode .user-advanced-toggle {
    background-color: #00ac1c;
    color: #fff;
    border-color: #00ac1c;
}
`;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'user-search-wrapper';

    const status = document.createElement('div');
    status.className = 'load-status';
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    const statusText = document.createElement('span');
    statusText.textContent = 'Loading… (0 movies)';
    status.append(spinner, statusText);

    const input = document.createElement('input');
    input.className = 'user-search';
    input.placeholder = 'Search list…';

    const advBtn = document.createElement('button');
    advBtn.className = 'user-advanced-toggle';
    advBtn.type = 'button';
    advBtn.textContent = 'Advanced';
    advBtn.setAttribute('aria-label', 'Toggle advanced search');

    const btn = document.createElement('button');
    btn.className = 'user-search-button';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Search');

    wrapper.append(status, input, advBtn, btn);

    const listEl = document.querySelector('.js-list-entries');
    if (listEl && listEl.parentNode) {
        listEl.parentNode.insertBefore(wrapper, listEl);
    } else {
        const fallback = document.querySelector('.section > .tags') || document.querySelector('.sidebar');
        fallback && fallback.insertBefore(wrapper, fallback.firstChild);
    }

    input.disabled = btn.disabled = advBtn.disabled = true;

    let advancedMode = false;
    advBtn.addEventListener('click', () => {
        advancedMode = !advancedMode;
        wrapper.classList.toggle('advanced-mode', advancedMode);
        // console.log('Advanced search mode:', advancedMode);
    });

    const parser = new DOMParser();
    async function getDom(i) {
        const res = await fetch(`${window.location.href}page/${i}/`);
        const doc = parser.parseFromString(await res.text(), 'text/html');
        const movies = doc.querySelectorAll('.js-list-entries > li');
        // console.log(i, movies);
        return movies.length ? Array.from(movies) : undefined;
    }

    const container = document.querySelector('.js-list-entries');
    const items = Array.from(container.querySelectorAll('li'));
    const nodelists = [];

    let loadedCount = items.length;
    statusText.textContent = `Loading… (${loadedCount} movies)`;

    (async () => {
        for (let i = 2; i <= 100; i++) {
            const page = await getDom(i);
            if (!page) break;
            nodelists.push(page);
            loadedCount += page.length;
            statusText.textContent = `Loading… (${loadedCount} movies)`;
        }
        spinner.remove();
        statusText.textContent = `Loaded ${loadedCount} movies`;
        input.disabled = btn.disabled = advBtn.disabled = false;
    })();

    function parseQuery(input) {
        const tokens = input.match(/-?"[^"]*"|[()|]|-?[^()\s|]+/g) || [];
        let pos = 0;
        function peek() { return tokens[pos]; }
        function consume(tok) {
            if (!tok || peek() === tok) pos++;
            else throw new Error(`Expected ${tok} but got ${peek()}`);
        }
        function parseExpression() { return parseOr(); }
        function parseOr() {
            let node = parseAnd();
            while (peek() === '|') {
                consume('|');
                const right = parseAnd();
                node = { type: 'OR', children: [node, right] };
            }
            return node;
        }
        function parseAnd() {
            let node = parseNot();
            while (peek() && peek() !== ')' && peek() !== '|') {
                const right = parseNot();
                node = { type: 'AND', children: [node, right] };
            }
            return node;
        }
        function parseNot() {
            const tok = peek();
            if (tok && tok.startsWith('-') && tok.length > 1) {
                consume();
                const sub = tok.slice(1);
                if (sub.startsWith('"') && sub.endsWith('"')) {
                    const phrase = sub.slice(1, -1);
                    return { type: 'NOT', child: { type: 'TERM', value: phrase.toLowerCase() } };
                }
                return { type: 'NOT', child: { type: 'TERM', value: sub.toLowerCase() } };
            }
            return parseTerm();
        }
        function parseTerm() {
            const tok = peek();
            if (tok === '(') {
                consume('(');
                const node = parseExpression();
                if (peek() === ')') consume(')');
                return node;
            }
            if (!tok) throw new Error('Unexpected end of input');
            consume();
            if (tok.startsWith('"') && tok.endsWith('"')) {
                const phrase = tok.slice(1, -1);
                return { type: 'TERM', value: phrase.toLowerCase() };
            }
            return { type: 'TERM', value: tok.toLowerCase() };
        }
        const ast = parseExpression();
        if (pos < tokens.length) throw new Error('Unexpected token: ' + peek());
        return ast;
    }
    function evaluateAST(node, text) {
        switch (node.type) {
            case 'TERM': return text.includes(node.value);
            case 'NOT':  return !evaluateAST(node.child, text);
            case 'AND':  return node.children.every(c => evaluateAST(c, text));
            case 'OR':   return node.children.some(c => evaluateAST(c, text));
        }
    }

    function normalizeText(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    function getSearchText(li) {
        const ds  = li.childNodes[1]?.dataset.filmName || '';
        const alt = li.querySelector('div > img')?.alt || '';
        return normalizeText(ds + '|' + alt);
    }

    function triggerLazyLoad() {
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('scroll'));
        });
    }

    function doSearch() {
        const raw = input.value.trim();
        const normTerm = normalizeText(raw);
        container.innerHTML = '';

        if (!raw) {
            items.forEach(i => container.appendChild(i));
            statusText.textContent = `Showing ${loadedCount} of ${loadedCount} movies`;
            triggerLazyLoad();
            return;
        }

        if (advancedMode) {
            let ast;
            try {
                ast = parseQuery(normTerm);
            } catch {
                items.forEach(li => {
                    const name = getSearchText(li);
                    if (name.includes(normTerm)) container.appendChild(li);
                });
                nodelists.forEach(list => list.forEach(li => {
                    const name = getSearchText(li);
                    if (name.includes(normTerm)) container.appendChild(li);
                }));
                statusText.textContent = `Showing ${container.children.length} of ${loadedCount} movies`;
                triggerLazyLoad();
                return;
            }
            items.forEach(li => {
                const name = getSearchText(li);
                if (evaluateAST(ast, name)) container.appendChild(li);
            });
            nodelists.forEach(list => list.forEach(li => {
                const name = getSearchText(li);
                if (evaluateAST(ast, name)) container.appendChild(li);
            }));
            statusText.textContent = `Showing ${container.children.length} of ${loadedCount} movies`;
            triggerLazyLoad();
            return;
        }

        items.forEach(li => {
            const name = getSearchText(li);
            if (name.includes(normTerm)) container.appendChild(li);
        });
        nodelists.forEach(list => list.forEach(li => {
            const name = getSearchText(li);
            if (name.includes(normTerm)) container.appendChild(li);
        }));
        statusText.textContent = `Showing ${container.children.length} of ${loadedCount} movies`;
        triggerLazyLoad();
    }

    input.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
    btn.addEventListener('click', doSearch);

})();