// ==UserScript==
// @name        Constraints Emphasizer
// @namespace   https://github.com/TrueRyoB
// @version      1.3
// @description AtCoderで入力値の制約が極端な時に目立たせる。(inspired by Time Limit Emphasizer by https://github.com/Ogtsn99)
// @include     https://atcoder.jp/contests/*/tasks/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @author TrueRyoB
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541785/Constraints%20Emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/541785/Constraints%20Emphasizer.meta.js
// ==/UserScript==

const styles = [
    { ub: 10, className: 'dneg-perm' },
    { ub: 20, className: 'dneg-2pn' },
    { ub: 30, className: 'dneg-2pmdiv3' },
    { ub: 100, className: 'dneg-np4' },
    { ub: 300, className: 'dneg-np3' },
    { ub: 1000, className: 'dneg-np2' },
    { ub: 1000000, className: 'dneg-nlogn' },
    { ub: 100000000, className: 'dneg-n' },
    { ub: 1000000000000, className: 'dneg-logn' },
];

$('<style>')
    .prop('type', 'text/css')
    .html(`
        .dneg-c { color:#e2345; font-weight:1000; }
        .dneg-perm { color:#492ed1; font-weight:700; }
        .dneg-2pn { color:#492ed1; font-weight:700; }
        .dneg-2pmdiv3 { color:#492ed1; font-weight:700; }
        .dneg-np4 { color:#2ed192; font-weight:700; }
        .dneg-np3 { color:#2ed192; font-weight:700; }
        .dneg-np2 { color:#2ed192; font-weight:700; }
        .dneg-nlogn { }
        .dneg-n { }
        .dneg-logn { color: #e23454; font-weight:700;}
    `)
    .appendTo('head');


const $container = $('section h3:contains("制約")');
$container.next('ul').find('li').each(function () {
    const annotation = $(this).find('annotation[encoding="application/x-tex"]').text();
    console.log("new annotation:", annotation);
    const bound = extractMinMax(annotation);
    
    let found=false;
    for (const style of styles) {
        if(style.ub <= bound.max) {
            $(this).addClass(style.className);found=true;break;
        }
    }
    if(!found) $(this).addClass('dneg-c');
});

function extractMinMax(annotation) {
    const match = annotation.match(/(\d+)\s*\\leq\s*.+?\s*\\leq\s*(.+)/);
    if (!match) return null;

    const min = parseInt(match[1], 10);
    const rawMax = match[2].trim();

    let max;

    const funcMatch = rawMax.match(/\\(min|max)\s*\(([^)]+)\)/);
    if (funcMatch) {
        const [, funcType, args] = funcMatch;
        const values = args.split(',').map(s => s.trim());

        let numericValues = values.map(val => {
            const expMatch = val.match(/(\d+)\s*\\times\s*10\^\{?(\d+)\}?/);
            if (expMatch) {
                return parseInt(expMatch[1], 10) * Math.pow(10, parseInt(expMatch[2], 10));
            }
            const plainNum = val.match(/^\d+$/);
            return plainNum ? parseInt(val, 10) : null;
        }).filter(v => v !== null);

        if (numericValues.length === 0) return null;

        max = funcType === "min"
            ? Math.min(...numericValues)
            : Math.max(...numericValues);
    } else {
        const expMatch = rawMax.match(/(\d+)\s*\\times\s*10\^\{?(\d+)\}?/);
        if (expMatch) {
            max = parseInt(expMatch[1], 10) * Math.pow(10, parseInt(expMatch[2], 10));
        } else {
            const plainNum = rawMax.match(/^\d+$/);
            max = plainNum ? parseInt(rawMax, 10) : null;
        }
    }

    if (isNaN(min) || isNaN(max)) return null;
    return { min, max };
}